import { sessionLedger } from './contributions/modules.js';
import { availableSubject, contributionReference, entityRecord, subjectOwner } from './contributions/subjects.js';
import type { ExactSubject } from './contributions/subjects.js';
import type { EntityId } from './contributions/model.js';
import type { NameMatch } from './contributions/ledger.js';
import { isAnswerReference } from './answer-references.js';
import { freezeOwned } from './immutable.js';
import { completedMaterialization } from './evaluation-state.js';
import { moduleMatches } from './module-selection.js';
import type { ClaimContextRecord, EvaluationRecord, EvaluationState, ProgramRecordStore, RecordId, SessionId } from './records.js';
import type { OrganizationEvaluationRecord } from './organization/records.js';
import type { LensDefinition, SubjectDesignation } from './application/lenses.js';

export type EntityKind = 'module' | 'group' | 'investigram' | 'contribution' | 'content' | 'designation' | 'entity';
export interface ResolvedSubject {
  readonly id: RecordId;
  readonly kind: EntityKind;
  readonly reference: string;
  readonly selected?: ExactSubject;
  readonly name: string | null;
}
export interface LookupSupport extends Pick<EvaluationState, 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason'> {
  readonly id: RecordId;
  readonly kind: 'evaluation' | 'organization-evaluation';
  readonly method: string;
  readonly qualification: readonly Pick<ClaimContextRecord, 'id' | 'scope' | 'method' | 'status' | 'guarantee' | 'limitations' | 'diagnostics'>[];
  readonly population: readonly RecordId[];
}
export interface SubjectResolution {
  readonly status: 'resolved' | 'answer-as-subject' | 'missing' | 'unknown-reference' | 'unsupported-subject' | 'ambiguous' | 'lookup-incomplete' | 'lookup-unavailable';
  readonly candidates: readonly ResolvedSubject[];
  readonly criteria: readonly string[];
  readonly qualifications: readonly string[];
  readonly prerequisites: readonly RecordId[];
  readonly support: readonly LookupSupport[];
  readonly identifications?: readonly NameMatch[];
}

/** Lookup consumes qualified populations. A precise binding needs no population acquisition. */
export function resolveSubjects(store: ProgramRecordStore, session: SessionId, definition: LensDefinition,
  designation: SubjectDesignation, populations: { modules?: EvaluationRecord; organization?: OrganizationEvaluationRecord } = {}): SubjectResolution {
  const ledger = sessionLedger(store, session);
  const identifications: NameMatch[] = [];
  const modules = populations.modules ? store.get(populations.modules.id) : undefined;
  const organization = populations.organization ? store.get(populations.organization.id) : undefined;
  if (modules && (modules.kind !== 'evaluation' || modules.requirement !== 'modules' || modules.session !== session)) throw new Error('Expected same-Session module lookup population');
  if (organization && (organization.kind !== 'organization-evaluation' || organization.session !== session)) throw new Error('Expected same-Session group lookup population');
  populations = { ...(modules ? { modules } : {}), ...(organization ? { organization } : {}) };
  const criteria = [`Applicable subjects: ${definition.subjects.join(', ')}`, `Cardinality: ${definition.cardinality}`,
    designation.kind === 'reference' ? 'Established compact reference or retained same-Session module, group or investigram record ID' : designation.kind === 'name' ? 'Exact name or generated module handle' : 'Designated population'];
  const outcomes = [populations.modules, populations.organization].filter(item => item !== undefined);
  const support: LookupSupport[] = outcomes.map(item => ({ id: item.id, kind: item.kind,
    applicability: item.applicability, availability: item.availability, execution: item.execution,
    materialization: item.materialization, reason: item.reason, method: item.method,
    qualification: item.contexts.map(id => {
      const context = store.get(id);
      if (context.kind !== 'claim-context') throw new Error('Expected lookup qualification');
      const { scope, method, status, guarantee, limitations, diagnostics } = context;
      return { id, scope, method, status, guarantee, limitations, diagnostics };
    }), population: item.kind === 'evaluation' ? item.modules : item.groups }));
  const qualifications = [...new Set(outcomes.flatMap(item => [
    ...(item.applicability !== 'applicable' || item.availability !== 'available' || !completedMaterialization(item) ? [item.reason ?? 'The supplied lookup population is not fully established; other matches may be unknown.'] : []),
    ...item.contexts.flatMap(id => { const context = store.get(id); return context.kind === 'claim-context' ? context.limitations : []; }),
  ]))];
  const finish = (status: SubjectResolution['status'], candidates: readonly ResolvedSubject[] = []): SubjectResolution => freezeOwned({
    status, candidates, criteria, qualifications, prerequisites: outcomes.map(item => item.id), support, ...(identifications.length ? { identifications } : {}),
  });
  const candidate = (id: RecordId, reference: string): ResolvedSubject => {
    const entity = store.get(id);
    if (entity.session !== session || entity.kind !== 'module' && entity.kind !== 'group' && entity.kind !== 'investigram') throw new Error('Expected same-Session subject');
    const claim = entity.kind === 'investigram' ? null : store.get(entity.claim);
    return { id, kind: entity.kind, reference, name: claim?.kind === 'claim' && (claim.information.type === 'module' || claim.information.type === 'group') ? claim.information.name : null };
  };
  const commonCandidate = (subject: ExactSubject, reference: string): ResolvedSubject => {
    const native = subject.kind === 'entity' ? entityRecord(store, ledger, subject.entity) : undefined;
    if (native && ['module', 'group'].includes(store.get(native).kind)) return { ...candidate(native, reference), selected: subject };
    return { id: subjectOwner(subject), kind: subject.kind === 'investigram' ? 'contribution' : subject.kind,
      reference, name: null, selected: subject };
  };
  if (designation.kind === 'selection') {
    if (!availableSubject(ledger, designation.subject)) return finish('unknown-reference');
    const target = commonCandidate(designation.subject, subjectOwner(designation.subject));
    return finish(definition.subjects.includes(target.kind) ? 'resolved' : 'unsupported-subject', [target]);
  }
  if (designation.kind === 'reference') {
    if (isAnswerReference(designation.value)) return finish('answer-as-subject');
    const raw = designation.value.replace(/^@/, '');
    const id = store.boundEntity(session, raw);
    const owner = !id ? contributionReference(ledger, raw) : undefined;
    const subject: ExactSubject | undefined = owner ? { kind: 'investigram', investigram: owner }
      : ledger.hasEntity(raw as EntityId) ? { kind: 'entity', entity: raw as EntityId } : undefined;
    if (!id && !subject) return finish('unknown-reference');
    const target = id ? candidate(id, designation.value) : commonCandidate(subject!, designation.value);
    return finish(definition.subjects.includes(target.kind) ? 'resolved' : 'unsupported-subject', [target]);
  }
  if (designation.kind !== 'name') return finish(definition.cardinality === 'population' ? 'resolved' : 'missing');
  const matches: RecordId[] = [];
  if (definition.subjects.includes('group') && populations.organization) {
    for (const id of populations.organization.groups) {
      if (candidate(id, id).name === designation.value) matches.push(id);
    }
  }
  if (definition.subjects.includes('module') && populations.modules) {
    for (const id of populations.modules.modules) {
      if (moduleMatches(store, id, designation.value)) matches.push(id);
    }
  }
  const commonMatches: ResolvedSubject[] = [];
  for (const match of ledger.lookupName(designation.value, { history: true }).matches) {
    const target = commonCandidate({ kind: 'entity', entity: match.entity }, match.entity);
    if (!definition.subjects.includes(target.kind)) continue;
    identifications.push(match);
    if (match.standing.state === 'displaced') qualifications.push('A matched identification is historical/displaced; this match does not establish a current or canonical name.');
    if (target.kind === 'module' || target.kind === 'group') {
      if (!matches.includes(target.id)) matches.push(target.id);
    } else if (!commonMatches.some(item => item.id === target.id)) commonMatches.push(target);
  }
  if (commonMatches.length) {
    const targets = [...matches.map(id => candidate(id, store.entityIds([id], store.get(id).kind as 'module' | 'group').get(id)!)), ...commonMatches];
    return finish(definition.cardinality === 'one' && targets.length !== 1 ? 'ambiguous' : 'resolved', targets);
  }
  if (matches.length) {
    const status = definition.cardinality === 'one' && matches.length !== 1 ? 'ambiguous' : 'resolved';
    const bindings = new Map<RecordId, string>();
    // Successful applications retain their whole-population, group-then-module schedule.
    // Unsuccessful applications bind the complete delivered candidate set, before any paging.
    for (const kind of ['group', 'module'] as const) {
      if (!definition.subjects.includes(kind)) continue;
      const population = kind === 'group' ? populations.organization?.groups : populations.modules?.modules;
      if (!population) continue;
      const ids = status === 'resolved' ? [...new Set([...population, ...matches.filter(id => store.get(id).kind === kind)])] : matches.filter(id => store.get(id).kind === kind);
      for (const [id, reference] of store.entityIds(ids, kind)) bindings.set(id, reference);
    }
    return finish(status, matches.map(id => candidate(id, bindings.get(id)!)));
  }
  return finish(outcomes.some(item => item.availability === 'unavailable') ? 'lookup-unavailable'
    : outcomes.some(item => !completedMaterialization(item)) ? 'lookup-incomplete' : 'missing');
}

export function resolutionExplanation(resolution: SubjectResolution): string {
  switch (resolution.status) {
    case 'answer-as-subject': return 'An answer reference is not a Lens subject. Retained answers can be retrieved in the Session that owns them.';
    case 'resolved': return 'The subject designation is resolved.';
    case 'unknown-reference': return 'The supplied reference identifies neither an established compact binding nor a retained supported subject in this Session.';
    case 'unsupported-subject': return `The reference identifies a ${resolution.candidates[0]!.kind}; this is an unsupported subject/lens combination.`;
    case 'ambiguous': return 'This Lens requires one subject, but the designation matches several applicable subjects.';
    case 'lookup-incomplete': return 'No matching subject was established in the incomplete lookup population; absence is not established.';
    case 'lookup-unavailable': return 'The lookup information needed to establish a matching subject is unavailable.';
    case 'missing': return 'No applicable subject matches the supplied designation in the available lookup population.';
  }
}

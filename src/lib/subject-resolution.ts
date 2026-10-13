import { freezeOwned } from './immutable.js';
import { completedMaterialization } from './evaluation-state.js';
import { moduleMatches } from './module-selection.js';
import type { ClaimContextRecord, EvaluationRecord, EvaluationState, ProgramRecordStore, RecordId, SessionId } from './records.js';
import type { OrganizationEvaluationRecord } from './organization/records.js';
import type { LensDefinition, SubjectDesignation } from './requests.js';

export type EntityKind = 'module' | 'group' | 'investigram';
export interface ResolvedSubject {
  readonly id: RecordId;
  readonly kind: EntityKind;
  readonly reference: string;
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
  readonly status: 'resolved' | 'missing' | 'unknown-reference' | 'unsupported-subject' | 'ambiguous' | 'lookup-incomplete' | 'lookup-unavailable';
  readonly candidates: readonly ResolvedSubject[];
  readonly criteria: readonly string[];
  readonly qualifications: readonly string[];
  readonly prerequisites: readonly RecordId[];
  readonly support: readonly LookupSupport[];
}

/** Lookup consumes qualified populations. A precise binding needs no population acquisition. */
export function resolveSubjects(store: ProgramRecordStore, session: SessionId, definition: LensDefinition,
  designation: SubjectDesignation, populations: { modules?: EvaluationRecord; organization?: OrganizationEvaluationRecord } = {}): SubjectResolution {
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
    status, candidates, criteria, qualifications, prerequisites: outcomes.map(item => item.id), support,
  });
  const candidate = (id: RecordId, reference: string): ResolvedSubject => {
    const entity = store.get(id);
    if (entity.session !== session || entity.kind !== 'module' && entity.kind !== 'group' && entity.kind !== 'investigram') throw new Error('Expected same-Session subject');
    const claim = entity.kind === 'investigram' ? null : store.get(entity.claim);
    return { id, kind: entity.kind, reference, name: claim?.kind === 'claim' && (claim.information.type === 'module' || claim.information.type === 'group') ? claim.information.name : null };
  };
  if (designation.kind === 'reference') {
    const id = store.boundEntity(session, designation.value);
    if (!id) return finish('unknown-reference');
    const target = candidate(id, designation.value);
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
  if (matches.length) {
    const status = definition.cardinality === 'one' && matches.length !== 1 ? 'ambiguous' : 'resolved';
    const bindings = new Map<RecordId, string>();
    // Successful applications retain their whole-population, group-then-module schedule.
    // Unsuccessful applications bind the complete delivered candidate set, before any paging.
    for (const kind of ['group', 'module'] as const) {
      if (!definition.subjects.includes(kind)) continue;
      const population = kind === 'group' ? populations.organization?.groups : populations.modules?.modules;
      if (!population) continue;
      const ids = status === 'resolved' ? population : matches.filter(id => store.get(id).kind === kind);
      for (const [id, reference] of store.entityIds(ids, kind)) bindings.set(id, reference);
    }
    return finish(status, matches.map(id => candidate(id, bindings.get(id)!)));
  }
  return finish(outcomes.some(item => item.availability === 'unavailable') ? 'lookup-unavailable'
    : outcomes.some(item => !completedMaterialization(item)) ? 'lookup-incomplete' : 'missing');
}

export function resolutionExplanation(resolution: SubjectResolution): string {
  switch (resolution.status) {
    case 'resolved': return 'The subject designation is resolved.';
    case 'unknown-reference': return 'The supplied reference identifies neither an established compact binding nor a retained supported subject in this Session.';
    case 'unsupported-subject': return `The reference identifies a ${resolution.candidates[0]!.kind}; this is an unsupported subject/lens combination.`;
    case 'ambiguous': return 'This Lens requires one subject, but the designation matches several applicable subjects.';
    case 'lookup-incomplete': return 'No matching subject was established in the incomplete lookup population; absence is not established.';
    case 'lookup-unavailable': return 'The lookup information needed to establish a matching subject is unavailable.';
    case 'missing': return 'No applicable subject matches the supplied designation in the available lookup population.';
  }
}

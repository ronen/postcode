import { identityReference, methods, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { ProgramRecord, RecordId, SessionId } from '../records.js';
import type { InvestigationContext } from './context.js';
import type { AcceptedInvestigation, AgentIdentity, Association, Correction, Investigram, InvestigationProvenance,
  InvestigationRequest, QualifiedSupport, SubmittedInvestigram } from './contracts.js';

export class InvalidSubmission extends Error {}
const invalid = (message: string): never => { throw new InvalidSubmission(message); };
function object(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return invalid('Expected result object.');
  if (Object.keys(value).some(key => !keys.includes(key))) return invalid('Unexpected result field.');
  return value as Record<string, unknown>;
}
const text = (value: unknown): string => typeof value === 'string' && value.trim().length > 0 ? value : invalid('Expected nonempty text.');
const array = (value: unknown): unknown[] => Array.isArray(value) ? value : invalid('Expected array.');

export interface AcceptanceContext {
  readonly session: SessionId;
  readonly attempt: RecordId;
  readonly request: InvestigationRequest;
  readonly originatingModule: RecordId;
  readonly instructions: string;
  readonly agent: AgentIdentity;
  readonly exposure: InvestigationContext;
  readonly suppliedEvidence: readonly RecordId[];
  readonly summarizedEvidence: readonly RecordId[];
  readonly lookup: (id: RecordId) => ProgramRecord | undefined;
}

/** Parses untrusted submissions and allocates identities only after validating the entire forest. */
export function acceptInvestigation(value: unknown, context: AcceptanceContext): AcceptedInvestigation {
  const { session, attempt, request, exposure } = context;
  const localIds = new Set<string>(), visited = new Set<object>();
  const delivered = new Set([...context.suppliedEvidence, ...context.summarizedEvidence, ...exposure.citations]);
  const complete = new Set(exposure.completeTargets);
  const reference = (value: unknown, role: 'subject' | 'evidence' | 'target'): RecordId => {
    const id = text(value) as RecordId;
    const prior = exposure.history.get(id);
    const record = context.lookup(id);
    if (role === 'target') {
      if (!prior || prior.session !== session || !complete.has(id)) return invalid('Correction target must predate this result and have complete supplied context.');
    } else if (role === 'subject') {
      if (!(prior?.session === session || record?.session === session
        && ['module', 'symbol', 'group', 'claim', 'source-evidence', 'repository-artifact', 'captured-content'].includes(record.kind))) return invalid('Invalid referent or association subject.');
    } else if (!delivered.has(id) || !(prior?.session === session || record?.session === session)) return invalid('Evidence must identify supplied context in this session.');
    return id;
  };
  const support = (item: Record<string, unknown>): QualifiedSupport => {
    const qualifications = array(item.qualifications).map(text);
    if (!qualifications.length) return invalid('Every account, association and correction requires attributable qualification.');
    return { qualifications, evidence: array(item.evidence).map(id => reference(id, 'evidence')) };
  };
  const parse = (value: unknown, depth: number): SubmittedInvestigram => {
    const item = object(value, ['localId', 'prose', 'referent', 'qualifications', 'evidence', 'associations', 'children', 'corrections', 'inconsistencies']);
    if (visited.has(item) || depth > 32 || visited.size >= 256) return invalid('Result tree is cyclic, shared, or exceeds structural bounds.');
    visited.add(item);
    const localId = text(item.localId);
    if (localIds.has(localId)) return invalid('Each investigram must occupy exactly one composition position; local IDs must be unique.');
    localIds.add(localId);
    const referent = object(item.referent, ['description', 'subjects']);
    return { localId, prose: text(item.prose), ...support(item),
      referent: { description: text(referent.description), subjects: array(referent.subjects).map(id => reference(id, 'subject')) },
      associations: array(item.associations).map(value => {
        const association = object(value, ['subject', 'qualifications', 'evidence']);
        return { subject: reference(association.subject, 'subject'), ...support(association) };
      }),
      children: array(item.children).map(child => parse(child, depth + 1)),
      corrections: array(item.corrections).map(value => {
        const correction = object(value, ['target', 'correctedSubjects', 'reason', 'qualifications', 'evidence', 'replacement']);
        const target = reference(correction.target, 'target');
        const correctedSubjects = array(correction.correctedSubjects).map(id => reference(id, 'subject'));
        if (!correctedSubjects.length || new Set(correctedSubjects).size !== correctedSubjects.length
          || correctedSubjects.some(id => !['module', 'symbol', 'group', 'repository-artifact'].includes(context.lookup(id)?.kind ?? ''))) return invalid('Corrected subjects must explicitly identify distinct program subjects: module, symbol, group or repository-artifact.');
        return { target, correctedSubjects, reason: text(correction.reason), ...support(correction), replacement: parse(correction.replacement, depth + 1) };
      }),
      inconsistencies: array(item.inconsistencies).map(value => {
        const inconsistency = object(value, ['targets', 'reason', 'qualifications', 'evidence']);
        const targets = array(inconsistency.targets).map(id => reference(id, 'subject'));
        if (!targets.length || targets.some(id => !exposure.history.get(id))) return invalid('Inconsistency targets must be earlier investigrams.');
        return { targets, reason: text(inconsistency.reason), ...support(inconsistency) };
      }),
    };
  };
  const tree = parse(value, 0);
  const provenance: InvestigationProvenance = {
    kind: 'investigation-provenance', id: attempt, session, method: methods.investigation,
    request, originatingModule: context.originatingModule, instructions: context.instructions, agent: context.agent,
    citations: exposure.citations, completeTargets: exposure.completeTargets, completeCorrections: exposure.completeCorrections,
    suppliedEvidence: context.suppliedEvidence, summarizedEvidence: context.summarizedEvidence, deliveries: exposure.deliveries,
  };
  const investigrams: Investigram[] = [], corrections: Correction[] = [];
  const idFor = (item: SubmittedInvestigram) => recordId(session, 'investigram', [methods.investigation, identityReference(session, attempt), item.localId]);
  const build = (item: SubmittedInvestigram, requiredAssociations: readonly Association[] = []): RecordId => {
    const id = idFor(item);
    const ownCorrections = item.corrections.map((correction, index) => {
      const correctionId = recordId(session, 'investigram-correction', [identityReference(session, id), index]);
      const replacement = build(correction.replacement, correction.correctedSubjects.map(subject => ({ subject,
        role: 'corrected-subject', qualifications: correction.qualifications, evidence: correction.evidence })));
      corrections.push({ kind: 'investigram-correction', id: correctionId, session, method: methods.investigation,
        reporter: id, target: correction.target, correctedSubjects: correction.correctedSubjects, replacement, reason: correction.reason,
        qualifications: correction.qualifications, evidence: correction.evidence, provenance: attempt });
      return correctionId;
    });
    const associations: Association[] = item.associations.map(item => ({ ...item, role: 'described' }));
    associations.push(...requiredAssociations);
    investigrams.push({ kind: 'investigram', id, session, method: methods.investigation, status: 'interpretation',
      prose: item.prose, referent: item.referent, qualifications: item.qualifications, evidence: item.evidence,
      originatingModule: context.originatingModule, associations, children: item.children.map(child => build(child)),
      corrections: ownCorrections, inconsistencies: item.inconsistencies, provenance: attempt });
    return id;
  };
  const root = build(tree, [{ subject: request.subject, role: 'investigation-subject',
    qualifications: ['Investigation selected this subject; this association does not establish interpretive correctness.'], evidence: [] }]);
  return freezeOwned(structuredClone({ root, investigrams, corrections, provenance }));
}

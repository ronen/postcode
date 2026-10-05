import { qualifiedRecord } from './projection-content.js';
import type { QualifiedRecord } from './projection-content.js';
import type { EvaluationRecord, ModuleCompositionClaim, ProgramRecordStore, RecordId } from './records.js';

export interface CompositionContent {
  readonly claims: readonly QualifiedRecord<ModuleCompositionClaim>[];
  readonly evaluations: readonly EvaluationRecord[];
}

/** Only the supplied expansion claims/outcomes participate in this immutable content. */
export function resolveComposition(store: ProgramRecordStore, claimIds: readonly RecordId[], evaluationIds: readonly RecordId[]) {
  const claims = new Map<RecordId, QualifiedRecord<ModuleCompositionClaim>[]>();
  const evaluations = new Map<RecordId, EvaluationRecord[]>();
  for (const id of claimIds) {
    const claim = store.get(id);
    if (claim.kind !== 'claim' || claim.information.type !== 'module-composition') continue;
    const bucket = claims.get(claim.subject) ?? [];
    bucket.push(qualifiedRecord(store, claim as ModuleCompositionClaim)); claims.set(claim.subject, bucket);
  }
  for (const id of evaluationIds) {
    const outcome = store.get(id);
    if (outcome.kind !== 'evaluation' || outcome.requirement !== 'composition') continue;
    for (const subject of new Set(outcome.modules)) {
      const bucket = evaluations.get(subject) ?? [];
      bucket.push(outcome); evaluations.set(subject, bucket);
    }
  }
  const subjects = new Map([...new Set([...claims.keys(), ...evaluations.keys()])].map(subject => [subject,
    Object.freeze({ claims: Object.freeze(claims.get(subject) ?? []), evaluations: Object.freeze(evaluations.get(subject) ?? []) })]));
  const empty: CompositionContent = Object.freeze({ claims: Object.freeze([]), evaluations: Object.freeze([]) });
  return (subject: RecordId): CompositionContent => subjects.get(subject) ?? empty;
}

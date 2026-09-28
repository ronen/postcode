import { completedMaterialization } from './evaluation-state.js';
import type { ClaimContextRecord, EvaluationRecord, ProgramRecordStore, RecordId } from './records.js';

export type CompositionView = {
  readonly claims: readonly { readonly id: RecordId; readonly property: 're-exports-only';
    readonly qualification: Omit<ClaimContextRecord, 'kind' | 'evidence' | 'inputs'> }[];
  readonly evaluations: readonly Pick<EvaluationRecord, 'id' | 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason'>[];
};

/** Reads only the expansion records selected by the caller's projection. */
export function prepareCompositionViews(store: ProgramRecordStore,
  claimIds: readonly RecordId[], evaluationIds: readonly RecordId[]): (subject: RecordId) => CompositionView {
  const claims = new Map<RecordId, CompositionView['claims'][number][]>();
  const evaluations = new Map<RecordId, CompositionView['evaluations'][number][]>();
  for (const id of claimIds) {
    const claim = store.get(id);
    if (claim.kind !== 'claim' || claim.information.type !== 'module-composition') continue;
    const context = store.get(claim.context);
    if (context.kind !== 'claim-context') throw new Error('Expected composition qualification');
    const { kind: _kind, evidence: _evidence, inputs: _inputs, ...qualification } = context;
    const bucket = claims.get(claim.subject) ?? [];
    bucket.push({ id, property: claim.information.property, qualification }); claims.set(claim.subject, bucket);
  }
  for (const id of evaluationIds) {
    const outcome = store.get(id);
    if (outcome.kind !== 'evaluation' || outcome.requirement !== 'composition') continue;
    const { applicability, availability, execution, materialization, reason } = outcome;
    for (const subject of new Set(outcome.modules)) {
      const bucket = evaluations.get(subject) ?? [];
      bucket.push({ id, applicability, availability, execution, materialization, reason }); evaluations.set(subject, bucket);
    }
  }
  return subject => ({ claims: claims.get(subject) ?? [], evaluations: evaluations.get(subject) ?? [] });
}

export function compositionAnnotation(composition: CompositionView): string {
  if (composition.claims.length) return ' · re-exports only';
  if (composition.evaluations.length && !composition.evaluations.some(e => e.applicability === 'applicable'
    && e.availability === 'available' && completedMaterialization(e))) return ' · composition not established';
  return '';
}

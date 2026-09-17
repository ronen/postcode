import type { ClaimContextRecord, EvaluationRecord, ProgramRecordStore, RecordId } from './records.js';

export type CompositionView = {
  readonly claims: readonly { readonly id: RecordId; readonly property: 're-exports-only';
    readonly qualification: Omit<ClaimContextRecord, 'kind' | 'evidence'> }[];
  readonly evaluations: readonly Pick<EvaluationRecord, 'id' | 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason'>[];
};

/** Reads only the expansion records selected by the caller's projection. */
export function compositionView(store: ProgramRecordStore, subject: RecordId,
  claimIds: readonly RecordId[], evaluationIds: readonly RecordId[]): CompositionView {
  const claims = claimIds.flatMap(id => {
    const claim = store.get(id);
    if (claim.kind !== 'claim' || claim.subject !== subject || claim.information.type !== 'module-composition') return [];
    const context = store.get(claim.context);
    if (context.kind !== 'claim-context') throw new Error('Expected composition qualification');
    const { kind: _kind, evidence: _evidence, ...qualification } = context;
    return [{ id, property: claim.information.property, qualification }];
  });
  const evaluations = evaluationIds.flatMap(id => {
    const outcome = store.get(id);
    if (outcome.kind !== 'evaluation' || outcome.requirement !== 'composition' || !outcome.modules.includes(subject)) return [];
    const { applicability, availability, execution, materialization, reason } = outcome;
    return [{ id, applicability, availability, execution, materialization, reason }];
  });
  return { claims, evaluations };
}

export function compositionAnnotation(composition: CompositionView): string {
  if (composition.claims.length) return ' · re-exports only';
  if (composition.evaluations.length && !composition.evaluations.some(e => e.applicability === 'applicable'
    && e.availability === 'available' && e.execution === 'completed' && e.materialization === 'full')) return ' · composition not established';
  return '';
}

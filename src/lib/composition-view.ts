import { resolveComposition } from './composition-content.js';
import type { CompositionContent } from './composition-content.js';
import { presentQualification } from './qualification-view.js';
import { completedMaterialization } from './evaluation-state.js';
import type { ClaimContextRecord, EvaluationRecord, ProgramRecordStore, RecordId } from './records.js';

export type CompositionView = {
  readonly claims: readonly { readonly id: RecordId; readonly property: 're-exports-only';
    readonly qualification: Omit<ClaimContextRecord, 'kind' | 'evidence' | 'inputs'> }[];
  readonly evaluations: readonly Pick<EvaluationRecord, 'id' | 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason'>[];
};

/** Convenience coordinator for existing callers; arrangement itself receives only resolved content. */
export function prepareCompositionViews(store: ProgramRecordStore,
  claimIds: readonly RecordId[], evaluationIds: readonly RecordId[]): (subject: RecordId) => CompositionView {
  const content = resolveComposition(store, claimIds, evaluationIds);
  return subject => compositionView(content(subject));
}

export function compositionView(content: CompositionContent): CompositionView {
  return { claims: content.claims.map(({ record, context }) => ({ id: record.id, property: record.information.property, qualification: presentQualification(context) })),
    evaluations: content.evaluations.map(({ id, applicability, availability, execution, materialization, reason }) => ({ id, applicability, availability, execution, materialization, reason })) };
}

export function compositionAnnotation(composition: CompositionView): string {
  if (composition.claims.length) return ' · re-exports only';
  if (composition.evaluations.length && !composition.evaluations.some(e => e.applicability === 'applicable'
    && e.availability === 'available' && completedMaterialization(e))) return ' · composition not established';
  return '';
}

import type { EvaluationState } from './records.js';

/** Execution/materialization only; availability and applicability remain independent. */
export function completedMaterialization(state: Pick<EvaluationState, 'execution' | 'materialization'>): boolean {
  return state.execution === 'completed' && state.materialization === 'full';
}

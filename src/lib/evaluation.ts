import { methods, recordId } from './identity.js';
import type { EvaluationRecord, EvaluationState, ProgramRecordStore, RecordId, SnapshotId } from './records.js';

export interface DiscoveryResult extends EvaluationState {
  readonly snapshot: SnapshotId;
  readonly modules: readonly RecordId[];
  readonly contexts: readonly RecordId[];
}

/** Language-specific objects stay behind this boundary. Results refer to stored domain records. */
export interface ModuleAnalysis {
  discover(store: ProgramRecordStore): DiscoveryResult;
}

export function evaluateModules(store: ProgramRecordStore, analysis: ModuleAnalysis): EvaluationRecord {
  const result = analysis.discover(store);
  const attempt = store.evaluations(result.snapshot).length + 1;
  const method = methods.evaluation;
  const outcome: EvaluationRecord = {
    ...result, kind: 'evaluation', method, requirement: 'modules', attempt,
    id: recordId(result.snapshot, 'evaluation', { method, attempt, requirement: 'modules' }),
  };
  store.put([outcome]);
  return outcome;
}

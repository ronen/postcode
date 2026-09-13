import { methods, recordId } from './identity.js';
import type { EvaluationRecord, EvaluationState, ModuleExpansion, ProgramRecordStore, RecordId, SnapshotId } from './records.js';

export interface DiscoveryResult extends EvaluationState {
  readonly snapshot: SnapshotId;
  readonly modules: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly expansions?: readonly (EvaluationState & {
    readonly requirement: ModuleExpansion;
    readonly modules: readonly RecordId[];
    readonly claims: readonly RecordId[];
    readonly contexts: readonly RecordId[];
  })[];
}

/** Language-specific objects stay behind this boundary. Results refer to stored domain records. */
export interface ModuleAnalysis {
  discover(store: ProgramRecordStore, expansions?: readonly ModuleExpansion[]): DiscoveryResult;
}

export function evaluateModules(store: ProgramRecordStore, analysis: ModuleAnalysis, expansions: readonly ModuleExpansion[] = []): EvaluationRecord {
  const { expansions: expanded = [], ...result } = analysis.discover(store, expansions);
  const attempt = store.evaluations(result.snapshot)
    .filter(outcome => outcome.requirement === 'modules' && outcome.basis === undefined).length + 1;
  const method = methods.evaluation;
  const outcome: EvaluationRecord = {
    ...result, kind: 'evaluation', method, requirement: 'modules', attempt,
    id: recordId(result.snapshot, 'evaluation', { method, attempt, requirement: 'modules' }),
  };
  store.put([outcome]);
  store.put(expanded.map(expansion => ({ ...expansion, kind: 'evaluation', snapshot: result.snapshot,
    basis: outcome.id, method, attempt,
    id: recordId(result.snapshot, 'evaluation', { method, attempt, requirement: expansion.requirement, modules: expansion.modules }),
  })));
  return outcome;
}

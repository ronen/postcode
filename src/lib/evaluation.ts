import type { DependencyResult } from './dependencies/records.js';
import { canonical, methods, recordId } from './identity.js';
import type { EvaluationRecord, EvaluationState, ModuleExpansion, ProgramRecordStore, RecordId, SessionId } from './records.js';

export interface DiscoveryResult extends EvaluationState {
  /** Provider assurance: partial work is stable until additional inputs change this captured basis. */
  readonly retryBasis?: RecordId;
  readonly dependencies?: DependencyResult;
  readonly session: SessionId;
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
  discover(store: ProgramRecordStore, expansions?: readonly ModuleExpansion[], dependencies?: boolean): DiscoveryResult;
}

export function evaluateModules(store: ProgramRecordStore, analysis: ModuleAnalysis, expansions: readonly ModuleExpansion[] = []): EvaluationRecord {
  const result = analysis.discover(store, expansions);
  return recordModuleEvaluation(store, result);
}

const retained = new WeakMap<ProgramRecordStore, Map<string, EvaluationRecord>>();

/** Shared recording path for discovery invoked by an additional lens requirement. */
export function recordModuleEvaluation(store: ProgramRecordStore, discovery: DiscoveryResult): EvaluationRecord {
  const { expansions: expanded = [], dependencies: _dependencies, retryBasis, ...result } = discovery;
  if (retryBasis !== undefined) {
    const basis = store.get(retryBasis);
    if (basis.kind !== 'analysis-inputs' || basis.session !== result.session) throw new Error('Expected captured retry input basis');
  }
  const complete = [result, ...expanded].every(item => item.execution === 'completed' && item.materialization === 'full');
  const key = canonical([result, expanded, complete ? null : retryBasis ?? null]);
  const reused = retained.get(store)?.get(key);
  if (reused) return reused;
  const attempt = store.evaluations(result.session)
    .filter(outcome => outcome.requirement === 'modules' && outcome.basis === undefined).length + 1;
  const method = methods.evaluation;
  const outcome: EvaluationRecord = {
    ...result, kind: 'evaluation', method, requirement: 'modules', attempt,
    id: recordId(result.session, 'evaluation', { method, attempt, requirement: 'modules' }),
  };
  store.put([outcome]);
  store.put(expanded.map(expansion => ({ ...expansion, kind: 'evaluation', session: result.session,
    basis: outcome.id, method, attempt,
    id: recordId(result.session, 'evaluation', { method, attempt, requirement: expansion.requirement, modules: expansion.modules }),
  })));
  if (complete || retryBasis !== undefined) {
    let cache = retained.get(store);
    if (!cache) { cache = new Map(); retained.set(store, cache); }
    cache.set(key, outcome);
  }
  return outcome;
}

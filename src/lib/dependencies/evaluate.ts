import { recordModuleEvaluation } from '../evaluation.js';
import type { ModuleAnalysis } from '../evaluation.js';
import { methods, recordId } from '../identity.js';
import type { ModuleExpansion, ProgramRecordStore } from '../records.js';
import type { DependencyEvaluationRecord } from './records.js';

/** Explicit requirement; discovery-only callers do not silently request this lens. */
export function evaluateDependencies(store: ProgramRecordStore, analysis: ModuleAnalysis,
  expansions: readonly ModuleExpansion[] = []): DependencyEvaluationRecord {
  const result = analysis.discover(store, expansions, true);
  const basis = recordModuleEvaluation(store, result);
  const method = methods.dependencyEvaluation;
  const outcome: DependencyEvaluationRecord = {
    ...(result.dependencies ?? {
      applicability: 'applicable', availability: 'unavailable', execution: 'stopped', materialization: 'none',
      reason: 'The module provider did not supply the requested dependency analysis.',
      cost: { measure: 'module-count', value: 0 }, projectModules: [], occurrences: [], relationships: [], coverage: [], contexts: [],
    }),
    kind: 'dependency-evaluation', method, snapshot: result.snapshot, moduleEvaluation: basis.id,
    id: recordId(result.snapshot, 'dependency-evaluation', { method, basis: basis.id }),
  };
  store.put([outcome]);
  return outcome;
}

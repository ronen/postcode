import { recordModuleEvaluation } from '../evaluation.js';
import type { ModuleAnalysis } from '../evaluation.js';
import { identityReference, methods, recordId } from '../identity.js';
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
    kind: 'dependency-evaluation', method, session: result.session, moduleEvaluation: basis.id,
    id: recordId(result.session, 'dependency-evaluation', { method, basis: identityReference(result.session, basis.id), result: result.dependencies ? {
      ...result.dependencies,
      projectModules: result.dependencies.projectModules.map(id => identityReference(result.session, id)),
      occurrences: result.dependencies.occurrences.map(id => identityReference(result.session, id)),
      relationships: result.dependencies.relationships.map(id => identityReference(result.session, id)),
      coverage: result.dependencies.coverage.map(id => identityReference(result.session, id)),
      contexts: result.dependencies.contexts.map(id => identityReference(result.session, id)),
    } : null }),
  };
  store.put([outcome]);
  const owned = store.get(outcome.id);
  if (owned.kind !== 'dependency-evaluation') throw new Error('Expected retained dependency-evaluation');
  return owned;
}

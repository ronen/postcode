import { completedMaterialization } from './evaluation-state.js';
import { isModuleClaim } from './records.js';
import type { EvaluationRecord, ProgramRecordStore } from './records.js';

/** Qualified lookup without constructing or retaining an answer to another Lens. */
export function selectModules(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string | null, reference = false) {
  const bindings = store.entityIds(evaluation.modules, 'module');
  const modules = evaluation.modules.filter(id => {
    if (selector === null || selector === id) return true;
    if (reference) return selector === bindings.get(id);
    const module = store.get(id);
    if (module.kind !== 'module') throw new Error('Expected module entity');
    const claim = store.get(module.claim);
    if (!isModuleClaim(claim) || claim.subject !== id) throw new Error('Expected module naming claim');
    return selector === claim.information.name || selector === claim.information.handle;
  });
  return { modules, selection: { matches: modules.length, population: evaluation.modules.length,
    populationEstablished: completedMaterialization(evaluation), subset: selector !== null && modules.length < evaluation.modules.length,
    referenceStatus: reference && modules.length === 0 ? 'unknown-reference' as const : 'current' as const } };
}

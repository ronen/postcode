import { completedMaterialization } from './evaluation-state.js';
import { isModuleClaim } from './records.js';
import type { EvaluationRecord, ProgramRecordStore, RecordId } from './records.js';

/** Qualified lookup without constructing or retaining an answer to another Lens. */
export function selectModules(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string | null, reference = false, resolved?: readonly RecordId[]) {
  const bindings = store.entityIds(evaluation.modules, 'module');
  const modules = resolved ? [...resolved] : evaluation.modules.filter(id => {
    if (selector === null || selector === id) return true;
    if (reference) return selector === bindings.get(id);
    return moduleMatches(store, id, selector);
  });
  for (const id of modules) {
    const entity = store.get(id);
    if (entity.kind !== 'module' || entity.session !== evaluation.session) throw new Error('Invalid resolved module subject');
  }
  const population = new Set(evaluation.modules);
  const outsidePopulation = modules.filter(id => !population.has(id));
  return { modules, selection: { ...(outsidePopulation.length ? { outsidePopulation } : {}), matches: modules.length, population: evaluation.modules.length,
    populationEstablished: completedMaterialization(evaluation), subset: selector !== null && modules.length < evaluation.modules.length,
    referenceStatus: reference && modules.length === 0 ? 'unknown-reference' as const : 'current' as const } };
}

/** Exact language names and generated handles share one matching rule. */
export function moduleMatches(store: ProgramRecordStore, id: RecordId, selector: string): boolean {
  const module = store.get(id);
  if (module.kind !== 'module') throw new Error('Expected module entity');
  const claim = store.get(module.claim);
  if (!isModuleClaim(claim) || claim.subject !== id) throw new Error('Expected module naming claim');
  return selector === claim.information.name || selector === claim.information.handle;
}

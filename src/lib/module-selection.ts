import { completedMaterialization } from './evaluation-state.js';
import { isModuleClaim } from './records.js';
import type { EvaluationRecord, ProgramRecordStore, RecordId } from './records.js';

/** Construction consumes an explicit selection; null denotes the configured population. */
export function selectResolvedModules(store: ProgramRecordStore, evaluation: EvaluationRecord, subjects: readonly RecordId[] | null) {
  store.entityIds(evaluation.modules, 'module');
  const modules = [...(subjects ?? evaluation.modules)];
  if (new Set(modules).size !== modules.length) throw new Error('Duplicate resolved module subject');
  for (const id of modules) {
    const entity = store.get(id);
    if (entity.kind !== 'module' || entity.session !== evaluation.session) throw new Error('Invalid resolved module subject');
  }
  const population = new Set(evaluation.modules);
  const outsidePopulation = modules.filter(id => !population.has(id));
  return { modules, selection: { ...(outsidePopulation.length ? { outsidePopulation } : {}), matches: modules.length, population: evaluation.modules.length,
    populationEstablished: completedMaterialization(evaluation), subset: subjects !== null && modules.length < evaluation.modules.length } };
}

/** Exact language names and generated handles share one matching rule. */
export function moduleMatches(store: ProgramRecordStore, id: RecordId, selector: string): boolean {
  const module = store.get(id);
  if (module.kind !== 'module') throw new Error('Expected module entity');
  const claim = store.get(module.claim);
  if (!isModuleClaim(claim) || claim.subject !== id) throw new Error('Expected module naming claim');
  return selector === claim.information.name || selector === claim.information.handle;
}

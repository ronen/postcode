import { methods, recordId } from './identity.js';
import type { EvaluationRecord, ModuleClaim, ProgramRecordStore, ProjectionRecord, RecordId } from './records.js';

function moduleClaim(store: ProgramRecordStore, id: RecordId): ModuleClaim {
  const module = store.get(id);
  if (module.kind !== 'module') throw new Error('Expected module entity');
  const claim = store.get(module.claim);
  if (claim.kind !== 'claim' || claim.subject !== id) throw new Error('Expected module claim');
  return claim;
}

/** Construction reads materialized state only; it has no language-provider access. */
function project(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string | null): ProjectionRecord {
  const stored = store.get(evaluation.id);
  if (stored.kind !== 'evaluation') throw new Error('Expected stored evaluation');
  evaluation = stored;
  const lens = selector === null ? 'modules' : 'inspect';
  const modules = evaluation.modules.filter(id => {
    if (selector === null || selector === id) return true;
    const claim = moduleClaim(store, id);
    return selector === claim.information.name || selector === claim.information.handle;
  });
  const claims = modules.map(id => moduleClaim(store, id));
  const method = methods.projection;
  const projection: ProjectionRecord = {
    kind: 'projection', method, snapshot: evaluation.snapshot,
    id: recordId(evaluation.snapshot, 'projection', { method, lens, selector, evaluation: evaluation.id }),
    lens, subject: selector === null ? 'configured-project' : 'selected-modules',
    parameters: { selector }, modules, claims: claims.map(claim => claim.id),
    contexts: [...new Set([...evaluation.contexts, ...claims.map(claim => claim.context)])],
    evaluations: [evaluation.id],
    selection: {
      matches: modules.length, population: evaluation.modules.length,
      populationEstablished: evaluation.execution === 'completed' && evaluation.materialization === 'full',
      subset: selector !== null && modules.length < evaluation.modules.length,
    },
  };
  store.put([projection]);
  return projection;
}

export function modules(store: ProgramRecordStore, evaluation: EvaluationRecord): ProjectionRecord {
  return project(store, evaluation, null);
}

export function inspect(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string): ProjectionRecord {
  return project(store, evaluation, selector);
}

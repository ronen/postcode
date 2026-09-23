import { methods, recordId } from './identity.js';
import type { EvaluationRecord, ModuleClaim, ProgramRecordStore, ProjectionRecord, RecordId } from './records.js';
import { isModuleClaim } from './records.js';

function moduleClaim(store: ProgramRecordStore, id: RecordId): ModuleClaim {
  const module = store.get(id);
  if (module.kind !== 'module') throw new Error('Expected module entity');
  const claim = store.get(module.claim);
  if (!isModuleClaim(claim) || claim.subject !== id) throw new Error('Expected module claim');
  return claim;
}

/** Construction reads materialized state only; it has no language-provider access. */
function project(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string | null, reference = false): ProjectionRecord {
  const stored = store.get(evaluation.id);
  if (stored.kind !== 'evaluation') throw new Error('Expected stored evaluation');
  evaluation = stored;
  const lens = selector === null ? 'modules' : 'inspect';
  const entityIds = store.entityIds(evaluation.modules, 'module');
  const modules = evaluation.modules.filter(id => {
    if (selector === null) return true;
    if (selector === id) return true;
    if (reference) return selector === entityIds.get(id);
    const claim = moduleClaim(store, id);
    return selector === claim.information.name || selector === claim.information.handle;
  });
  const referenceStatus = reference && modules.length === 0 ? 'unknown-reference' : 'current';
  const claims = modules.map(id => moduleClaim(store, id));
  const expansions = store.evaluations(evaluation.session).filter(outcome => outcome.basis === evaluation.id);
  const relevantExpansions = expansions.filter(outcome => outcome.modules.some(id => modules.includes(id)) || outcome.modules.length === 0);
  const expanded = expansions.flatMap(outcome => outcome.claims ?? []);
  const selected = new Set<RecordId>(modules);
  // Export symbols and their assertions are inline expansion data, not arbitrary store contents.
  for (const id of expanded) {
    const claim = store.get(id);
    if (claim.kind === 'claim' && claim.information.type === 'export' && selected.has(claim.subject)) {
      selected.add(claim.id);
      if (claim.information.symbol) selected.add(claim.information.symbol);
    }
  }
  const expansionClaims = expanded.filter(id => {
    const claim = store.get(id);
    return claim.kind === 'claim' && selected.has(claim.subject);
  });
  const method = methods.projection;
  const projection: ProjectionRecord = {
    kind: 'projection', method, session: evaluation.session,
    id: recordId(evaluation.session, 'projection', { method, lens, selector, reference, evaluation: evaluation.id }),
    lens, subject: selector === null ? 'configured-project' : 'selected-modules',
    parameters: { selector, reference }, modules, claims: claims.map(claim => claim.id),
    contexts: [...new Set([...evaluation.contexts, ...claims.map(claim => claim.context)])],
    evaluations: [evaluation.id, ...relevantExpansions.map(outcome => outcome.id)],
    expansions: { requested: [...new Set(expansions.flatMap(outcome => outcome.requirement === 'modules' ? [] : [outcome.requirement]))], claims: [...new Set(expansionClaims)] },
    selection: {
      matches: modules.length, population: evaluation.modules.length,
      populationEstablished: evaluation.execution === 'completed' && evaluation.materialization === 'full',
      subset: selector !== null && modules.length < evaluation.modules.length,
      referenceStatus,
    },
  };
  store.put([projection]);
  return projection;
}

export function modules(store: ProgramRecordStore, evaluation: EvaluationRecord): ProjectionRecord {
  return project(store, evaluation, null);
}

export function inspect(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string, reference = false): ProjectionRecord {
  return project(store, evaluation, selector, reference);
}

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
function project(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string | null, expectedSnapshot: string | null = null): ProjectionRecord {
  const stored = store.get(evaluation.id);
  if (stored.kind !== 'evaluation') throw new Error('Expected stored evaluation');
  evaluation = stored;
  const lens = selector === null ? 'modules' : 'inspect';
  const snapshotMismatch = expectedSnapshot !== null && expectedSnapshot !== evaluation.snapshot;
  const handleOnly = selector !== null && evaluation.modules.some(id => moduleClaim(store, id).information.handle === selector)
    && !evaluation.modules.some(id => id === selector || moduleClaim(store, id).information.name === selector);
  const referenceStatus = snapshotMismatch ? 'snapshot-mismatch' : handleOnly && expectedSnapshot === null ? 'snapshot-required' : 'current';
  const modules = evaluation.modules.filter(id => {
    if (referenceStatus !== 'current') return false;
    if (selector === null || selector === id) return true;
    const claim = moduleClaim(store, id);
    return selector === claim.information.name || expectedSnapshot !== null && selector === claim.information.handle;
  });
  const claims = modules.map(id => moduleClaim(store, id));
  const expansions = store.evaluations(evaluation.snapshot).filter(outcome => outcome.basis === evaluation.id);
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
    kind: 'projection', method, snapshot: evaluation.snapshot,
    id: recordId(evaluation.snapshot, 'projection', { method, lens, selector, expectedSnapshot, evaluation: evaluation.id }),
    lens, subject: selector === null ? 'configured-project' : 'selected-modules',
    parameters: { selector, expectedSnapshot }, modules, claims: claims.map(claim => claim.id),
    contexts: [...new Set([...evaluation.contexts, ...claims.map(claim => claim.context)])],
    evaluations: [evaluation.id, ...relevantExpansions.map(outcome => outcome.id)],
    expansions: { requested: expansions.flatMap(outcome => outcome.requirement === 'modules' ? [] : [outcome.requirement]), claims: [...new Set(expansionClaims)] },
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

export function inspect(store: ProgramRecordStore, evaluation: EvaluationRecord, selector: string, expectedSnapshot: string | null = null): ProjectionRecord {
  return project(store, evaluation, selector, expectedSnapshot);
}

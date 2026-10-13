import { mechanicalAnswerIdentity } from './answer-identity.js';
import { selectResolvedModules } from './module-selection.js';
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
function project(store: ProgramRecordStore, evaluation: EvaluationRecord, subjects: readonly RecordId[] | null): ProjectionRecord {
  const stored = store.get(evaluation.id);
  if (stored.kind !== 'evaluation') throw new Error('Expected stored evaluation');
  evaluation = stored;
  const lens = subjects === null ? 'modules' : 'inspect';
  const { modules, selection } = selectResolvedModules(store, evaluation, subjects);
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
  const payload: Omit<ProjectionRecord, 'id'> = {
    kind: 'projection', method, session: evaluation.session,
    lens, subject: subjects === null ? 'configured-project' : 'selected-modules',
    parameters: {}, modules, claims: claims.map(claim => claim.id),
    contexts: [...new Set([...evaluation.contexts, ...claims.map(claim => claim.context)])],
    evaluations: [evaluation.id, ...relevantExpansions.map(outcome => outcome.id)],
    expansions: { requested: [...new Set(expansions.flatMap(outcome => outcome.requirement === 'modules' ? [] : [outcome.requirement]))], claims: [...new Set(expansionClaims)] },
    selection,
  };
  const projection = { ...payload, id: recordId(evaluation.session, 'projection', mechanicalAnswerIdentity(payload)) };
  store.put([projection]);
  return projection;
}

export function modules(store: ProgramRecordStore, evaluation: EvaluationRecord): ProjectionRecord {
  return project(store, evaluation, null);
}

export function inspect(store: ProgramRecordStore, evaluation: EvaluationRecord, subjects: readonly RecordId[]): ProjectionRecord {
  if (subjects.length === 0) throw new Error('Module inspection requires at least one resolved subject');
  return project(store, evaluation, subjects);
}

/** Legitimate empty module detail embedded in a resolved group inspection, never an unsuccessful lookup. */
export function emptyModuleDetail(store: ProgramRecordStore, evaluation: EvaluationRecord): ProjectionRecord {
  return project(store, evaluation, []);
}

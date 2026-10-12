import { mechanicalAnswerIdentity } from '../answer-identity.js';
import { completedMaterialization } from '../evaluation-state.js';
import { compare, methods, recordId } from '../identity.js';
import { selectResolvedModules } from '../module-selection.js';
import { isModuleClaim } from '../records.js';
import type { EvaluationState, ProgramRecordStore, RecordId } from '../records.js';
import { deriveDependencyGraph } from './graph.js';
import type { DependencyEvaluationRecord, DependencyProjectionRecord, DependencyRelationshipClaim } from './records.js';

const complete = (state: EvaluationState) => state.applicability === 'applicable' && state.availability === 'available'
  && completedMaterialization(state);

/** These lenses select materialized relationships, never transitive reach or display bounds. */
function project(store: ProgramRecordStore, evaluation: DependencyEvaluationRecord,
  lens: DependencyProjectionRecord['lens'], resolved: readonly RecordId[] | null,
  organization: RecordId | null): DependencyProjectionRecord {
  const stored = store.get(evaluation.id);
  if (stored.kind !== 'dependency-evaluation') throw new Error('Expected dependency evaluation');
  evaluation = stored;
  const basis = store.get(evaluation.moduleEvaluation);
  if (basis.kind !== 'evaluation' || basis.requirement !== 'modules') throw new Error('Expected module evaluation');
  const moduleClaims = basis.modules.map(id => {
    const module = store.get(id);
    if (module.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(module.claim);
    if (!isModuleClaim(claim)) throw new Error('Expected module claim');
    return claim;
  });
  const population = moduleClaims.filter(claim => claim.information.discoveryFacets.includes('project')).map(claim => claim.subject);
  const projectModules = new Set(population);
  const selected = resolved === null ? null : selectResolvedModules(store, basis, resolved);
  const subjects = selected?.modules ?? population;
  if (resolved !== null && subjects.length === 0) throw new Error('Dependency selection requires resolved subjects');
  const subjectSet = new Set(subjects);
  const allRelationships = evaluation.relationships.map(id => {
    const record = store.get(id);
    if (record.kind !== 'claim' || record.information.type !== 'dependency') throw new Error('Expected dependency relationship');
    return record as DependencyRelationshipClaim;
  });
  const relationships = allRelationships.filter(edge => lens === 'dependency-structure' ? projectModules.has(edge.subject)
    : lens === 'dependency-children' ? subjectSet.has(edge.subject) : subjectSet.has(edge.information.child));
  const included = new Set([...subjects, ...relationships.flatMap(edge => [edge.subject, edge.information.child])]);
  const occurrences = [...new Set(relationships.flatMap(edge => edge.information.occurrences))];
  const nonEdgeRequests = lens === 'dependency-parents' ? [] : evaluation.occurrences.filter(id => {
    const occurrence = store.get(id);
    if (occurrence.kind !== 'dependency-occurrence') throw new Error('Expected occurrence');
    return subjectSet.has(occurrence.owner) && occurrence.targetStatus !== 'resolved';
  });
  // Structure retains the evaluation's recognition coverage, including unowned results;
  // children require the selected owner, and parents carry no source-owned coverage.
  // This is intentionally distinct from the project-owned request/edge selection above.
  const coverage = evaluation.coverage.filter(id => {
    const item = store.get(id);
    if (item.kind !== 'dependency-coverage') throw new Error('Expected coverage result');
    return lens === 'dependency-structure' || lens === 'dependency-children' && item.owner !== null && subjectSet.has(item.owner);
  });
  const outcomes = store.evaluations(evaluation.session).filter(outcome => outcome.basis === basis.id
    && (outcome.modules.length === 0 || outcome.modules.some(id => included.has(id))));
  const moduleExpansionClaims = [...new Set(outcomes.flatMap(outcome => outcome.claims ?? []))];
  const contexts = new Set([...basis.contexts, ...evaluation.contexts.filter(id => {
    const context = store.get(id);
    return context.kind === 'claim-context' && context.scope === 'configured-project';
  }), ...moduleClaims.filter(claim => included.has(claim.subject)).map(claim => claim.context), ...outcomes.flatMap(outcome => outcome.contexts)]);
  for (const id of subjects.filter(id => !basis.modules.includes(id))) {
    const entity = store.get(id);
    if (entity.kind !== 'module') throw new Error('Expected resolved module');
    const claim = store.get(entity.claim);
    if (!isModuleClaim(claim)) throw new Error('Expected retained naming support');
    contexts.add(claim.context);
  }
  for (const id of [...occurrences, ...nonEdgeRequests, ...coverage, ...relationships.map(edge => edge.id), ...moduleExpansionClaims]) {
    const record = store.get(id);
    if (record.kind === 'claim' || record.kind === 'dependency-occurrence' || record.kind === 'dependency-coverage') contexts.add(record.context);
  }
  if (organization !== null) {
    const expansion = store.get(organization);
    if (expansion.kind !== 'dependency-organization-evaluation' || expansion.dependencyEvaluation !== evaluation.id) throw new Error('Expected matching dependency organization expansion');
    expansion.contexts.forEach(id => contexts.add(id));
  }
  const method = methods.dependencyProjection;
  const payload: Omit<DependencyProjectionRecord, 'id'> = {
    kind: 'dependency-projection', method, session: evaluation.session,
    lens, subject: resolved === null ? 'configured-project' : 'selected-modules', parameters: {},
    evaluation: evaluation.id, subjects, modules: [...included].sort(compare), relationships: relationships.map(edge => edge.id),
    occurrences, nonEdgeRequests, coverage, contexts: [...contexts],
    opaqueSubjects: subjects.filter(id => !projectModules.has(id)),
    graph: lens === 'dependency-structure' ? deriveDependencyGraph(population, relationships, complete(evaluation) && complete(basis)) : null,
    selection: selected?.selection ?? { matches: population.length, population: population.length,
      populationEstablished: complete(basis) },
    expansions: { moduleEvaluations: outcomes.map(outcome => outcome.id), moduleClaims: moduleExpansionClaims, organization },
  };
  const projection = { ...payload, id: recordId(evaluation.session, 'dependency-projection', mechanicalAnswerIdentity(payload)) };
  store.put([projection]);
  return projection;
}

export function dependencyStructure(store: ProgramRecordStore, evaluation: DependencyEvaluationRecord, organization: RecordId | null = null) {
  return project(store, evaluation, 'dependency-structure', null, organization);
}
export function dependencyChildren(store: ProgramRecordStore, evaluation: DependencyEvaluationRecord, subjects: readonly RecordId[],
  organization: RecordId | null = null) {
  return project(store, evaluation, 'dependency-children', subjects, organization);
}
export function dependencyParents(store: ProgramRecordStore, evaluation: DependencyEvaluationRecord, subjects: readonly RecordId[],
  organization: RecordId | null = null) {
  return project(store, evaluation, 'dependency-parents', subjects, organization);
}

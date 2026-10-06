import { resolveComposition } from '../composition-content.js';
import { qualifiedContext, qualifiedRecord } from '../projection-content.js';
import type { QualifiedRecord } from '../projection-content.js';
import type { Claim, ModuleClaim, ProgramRecordStore, RecordId, SourceEvidenceRecord } from '../records.js';
import type { DependencyOrganizationClaim, DependencyProjectionRecord, DependencyRelationshipClaim } from './records.js';

/** Resolves all selected relationships and their support before display traversal. */
export function resolveDependencyProjection(store: ProgramRecordStore, projection: DependencyProjectionRecord) {
  const retained = store.get(projection.id);
  if (retained.kind !== 'dependency-projection') throw new Error('Expected retained dependency-projection');
  projection = retained;
  const evaluation = store.get(projection.evaluation);
  if (evaluation.kind !== 'dependency-evaluation') throw new Error('Expected dependency evaluation');
  const basis = store.get(evaluation.moduleEvaluation);
  if (basis.kind !== 'evaluation') throw new Error('Expected module evaluation');
  const expanded = projection.expansions.organization ? store.get(projection.expansions.organization) : null;
  if (expanded && expanded.kind !== 'dependency-organization-evaluation') throw new Error('Expected organization expansion');
  const relationships = Object.freeze(projection.relationships.map(id => qualifiedRecord(store, store.get(id) as DependencyRelationshipClaim)));
  const capturedSource = (id: RecordId): SourceEvidenceRecord => {
    const evidence = store.get(id);
    if (evidence.kind !== 'source-evidence') throw new Error('Expected captured source evidence');
    return evidence;
  };
  const occurrence = (id: RecordId) => {
    const record = store.get(id);
    if (record.kind !== 'dependency-occurrence') throw new Error('Expected occurrence');
    return Object.freeze({ ...qualifiedRecord(store, record), source: capturedSource(record.evidence), targets: Object.freeze(record.targetEvidence.map(capturedSource)) });
  };
  const occurrences = Object.freeze(Object.fromEntries([...new Set([...relationships.flatMap(item => item.record.information.occurrences), ...projection.nonEdgeRequests])]
    .map(id => [id, occurrence(id)])));
  const coverage = Object.freeze(projection.coverage.map(id => {
    const record = store.get(id);
    if (record.kind !== 'dependency-coverage') throw new Error('Expected coverage outcome');
    return Object.freeze({ ...qualifiedRecord(store, record), source: capturedSource(record.evidence) });
  }));
  const composition = resolveComposition(store, projection.expansions.moduleClaims, projection.expansions.moduleEvaluations);
  const moduleClaim = (id: RecordId): QualifiedRecord<ModuleClaim> => {
    const entity = store.get(id);
    if (entity.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(entity.claim);
    if (claim.kind !== 'claim' || claim.information.type !== 'module') throw new Error('Expected module claim');
    return qualifiedRecord(store, claim as ModuleClaim);
  };
  const modules = Object.freeze(projection.modules.map(id => Object.freeze({ id, claim: moduleClaim(id), composition: composition(id) })));
  const selectedRelationships = new Set(projection.relationships);
  const organizationClaims = (expanded?.claims ?? []).map(id => store.get(id) as DependencyOrganizationClaim)
    .filter(claim => selectedRelationships.has(claim.subject));
  const organization = Object.freeze(organizationClaims.map(claim => {
    const occurrences = Object.freeze(claim.information.occurrences.map(item => {
      const ids = [...item.source.groups, ...item.target.groups, ...item.source.candidates, ...item.target.candidates,
        ...item.source.claims, ...item.target.claims, ...item.pairs.flatMap(pair => [...pair.commonAncestors, ...pair.containment])];
      const support = ids.flatMap(id => {
        const record = store.get(id);
        const claim = record.kind === 'group' ? store.get(record.claim) : record;
        return claim.kind === 'claim' ? [qualifiedRecord(store, claim as Claim)] : [];
      });
      return Object.freeze({ information: item, support: Object.freeze(support) });
    }));
    return Object.freeze({ claim: qualifiedRecord(store, claim), occurrences });
  }));
  const moduleEvaluations = Object.freeze(projection.expansions.moduleEvaluations.map(id => {
    const outcome = store.get(id);
    if (outcome.kind !== 'evaluation') throw new Error('Expected module expansion outcome');
    return outcome;
  }));
  const count = (keys: readonly string[]) => {
    const counts: Record<string, number> = {};
    for (const key of keys) counts[key] = (counts[key] ?? 0) + 1;
    return Object.freeze(counts);
  };
  // These summaries describe explicit full populations, not the displayed rows.
  const projectModules = Object.freeze(basis.modules.map(id => Object.freeze({ id, claim: moduleClaim(id) })));
  const summary = Object.freeze({ modules: projection.modules.length, discoveredModules: basis.modules.length,
    projectModules: projectModules.filter(item => item.claim.record.information.discoveryFacets.includes('project')).length,
    relationships: projection.relationships.length,
    requestsWithoutEdges: count(projection.nonEdgeRequests.map(id => occurrences[id]!.record.targetStatus)),
    recognitionCoverage: count(coverage.map(item => item.record.outcome)) });
  return Object.freeze({ projection, evaluation, basis, expanded, moduleEvaluations, relationships, occurrences, coverage, modules, organization,
    contexts: Object.freeze(projection.contexts.map(id => qualifiedContext(store, id))),
    summary, discoveryPopulation: projectModules });
}
export type DependencyProjectionContent = ReturnType<typeof resolveDependencyProjection>;

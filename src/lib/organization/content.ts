import { completedMaterialization } from '../evaluation-state.js';
import { resolveComposition } from '../composition-content.js';
import { resolveModuleProjection } from '../module-content.js';
import { qualifiedContext, qualifiedRecord } from '../projection-content.js';
import type { QualifiedRecord } from '../projection-content.js';
import type { EvaluationState, ModuleClaim, ProgramRecordStore, ProjectionRecord, RecordId } from '../records.js';
import type { ContainmentClaim, GroupClaim, GroupPropertiesClaim, ModulePlacementClaim, OrganizationClaims, OrganizationProjectionRecord } from './records.js';

type ClassificationOutcome = Pick<EvaluationState, 'applicability' | 'availability' | 'execution' | 'materialization'>;
export type ArtifactClassification = {
  readonly state: 'complete' | 'not-requested'; readonly reasons: readonly [];
} | {
  readonly state: 'incomplete'; readonly reasons: readonly ('repository-incomplete' | 'placement-incomplete')[];
};

const outcomeComplete = (state: ClassificationOutcome) => state.applicability === 'applicable'
  && state.availability === 'available' && completedMaterialization(state);

/** Artifact placements and README-existence associations share repository evaluation.
 * Module-population completeness is already incorporated in placement state.
 * Reasons identify the failing basis outcomes; their full qualification stays in the summary basis. */
export function artifactClassification(repository: ClassificationOutcome, placement: ClassificationOutcome,
  detail: 'materialized' | 'not-requested'): ArtifactClassification {
  if (detail === 'not-requested') return Object.freeze({ state: 'not-requested', reasons: Object.freeze([] as const) });
  const reasons: ('repository-incomplete' | 'placement-incomplete')[] = [];
  if (!outcomeComplete(repository)) reasons.push('repository-incomplete');
  if (!outcomeComplete(placement)) reasons.push('placement-incomplete');
  return reasons.length ? Object.freeze({ state: 'incomplete', reasons: Object.freeze(reasons) })
    : Object.freeze({ state: 'complete', reasons: Object.freeze([] as const) });
}

/** Compatibility wording is derivable from the existing public View fields. */
export function artifactClassificationComplete(repository: ClassificationOutcome, placement: ClassificationOutcome,
  detail: 'materialized' | 'not-requested'): boolean {
  return artifactClassification(repository, placement, detail).state === 'complete';
}

/** Selects captured support and derives scoped summaries without a display traversal. */
export function resolveOrganizationProjection(store: ProgramRecordStore, projection: OrganizationProjectionRecord) {
  const retained = store.get(projection.id);
  if (retained.kind !== 'organization-projection') throw new Error('Expected retained organization-projection');
  projection = retained;
  if (!projection.expansions.requested.includes('group-details')) throw new Error('Organization presentation requires evaluated group-details');
  const evaluation = store.get(projection.evaluation);
  if (evaluation.kind !== 'organization-evaluation') throw new Error('Expected organization evaluation');
  const repository = store.get(evaluation.repository);
  if (repository.kind !== 'repository-evidence') throw new Error('Expected repository evidence');
  const moduleEvaluation = store.get(evaluation.moduleEvaluation);
  if (moduleEvaluation.kind !== 'evaluation') throw new Error('Expected module evaluation');
  const claims = evaluation.claims.map(id => store.get(id) as OrganizationClaims);
  const selectedClaims = new Set([...projection.claims, ...projection.expansions.claims]);
  const available = claims.filter(claim => selectedClaims.has(claim.id));
  const primaryGroups = new Map(claims.filter((claim): claim is GroupClaim => claim.information.type === 'group').map(claim => [claim.subject, claim]));
  const properties = new Map(claims.filter((claim): claim is GroupPropertiesClaim => claim.information.type === 'group-properties').map(claim => [claim.subject, claim]));
  const bySubject = new Map<RecordId, OrganizationClaims[]>(), parents = new Map<RecordId, RecordId[]>();
  for (const claim of available) {
    const bucket = bySubject.get(claim.subject) ?? [];
    bucket.push(claim); bySubject.set(claim.subject, bucket);
    if (claim.information.type === 'group-containment') {
      const bucket = parents.get(claim.information.child) ?? [];
      bucket.push(claim.subject); parents.set(claim.information.child, bucket);
    }
  }
  const composition = resolveComposition(store, projection.expansions.moduleClaims, projection.expansions.moduleEvaluations);
  const referenceGroups: Record<string, { readonly claim: QualifiedRecord<GroupClaim>; readonly properties: QualifiedRecord<GroupPropertiesClaim> }> = {};
  const group = (id: RecordId) => {
    if (!referenceGroups[id]) {
      const claim = primaryGroups.get(id), property = properties.get(id);
      if (!claim || !property) throw new Error('Missing group properties');
      referenceGroups[id] = Object.freeze({ claim: qualifiedRecord(store, claim), properties: qualifiedRecord(store, property) });
    }
    return id;
  };
  const containment = Object.freeze(available.filter((claim): claim is ContainmentClaim => claim.information.type === 'group-containment')
    .map(claim => qualifiedRecord(store, claim)));
  const placements = available.filter((claim): claim is ModulePlacementClaim => claim.information.type === 'module-placement');
  const modules = Object.freeze(placements.map(placement => {
    const entity = store.get(placement.subject);
    if (entity.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(entity.claim);
    if (claim.kind !== 'claim' || claim.information.type !== 'module') throw new Error('Expected module claim');
    [...placement.information.groups, ...placement.information.candidates].forEach(group);
    return Object.freeze({ id: entity.id, claim: qualifiedRecord(store, claim as ModuleClaim), placement: qualifiedRecord(store, placement), composition: composition(entity.id) });
  }));
  const members = new Map<RecordId, typeof modules[number][]>();
  for (const module of modules) for (const id of new Set(module.placement.record.information.groups)) {
    const bucket = members.get(id) ?? [];
    bucket.push(module); members.set(id, bucket);
  }
  const selected = new Set(projection.groups);
  const groups = Object.freeze([...new Set([...projection.groups, ...projection.expansions.groups])].map(id => {
    group(id);
    const ownClaims = bySubject.get(id) ?? [];
    const artifacts = ownClaims.flatMap(claim => {
      if (claim.information.type !== 'artifact-placement') return [];
      const artifact = store.get(claim.information.artifact);
      if (artifact.kind !== 'repository-artifact') throw new Error('Expected captured artifact');
      return [Object.freeze({ placement: qualifiedRecord(store, claim), artifact })];
    });
    const documentation = ownClaims.filter(claim => claim.information.type === 'group-documentation');
    const placements = members.get(id) ?? [];
    const moduleArtifacts = new Set(placements.flatMap(item => item.placement.record.information.artifacts));
    const documentationArtifacts = new Set(documentation.flatMap(claim => claim.information.type === 'group-documentation' ? [claim.information.artifact] : []));
    const other = artifacts.filter(({ artifact }) => !moduleArtifacts.has(artifact.id) && !documentationArtifacts.has(artifact.id));
    const detail = selected.has(id) ? 'materialized' as const : 'not-requested' as const;
    return Object.freeze({ id, selected: selected.has(id), detail,
      parents: Object.freeze([...new Set(parents.get(id) ?? [])].map(group)),
      subgroups: Object.freeze([...new Set(ownClaims.flatMap(claim => claim.information.type === 'group-containment' ? [claim.information.child] : []))].map(group)),
      modules: Object.freeze(placements), artifacts: Object.freeze(artifacts),
      documentation: Object.freeze(documentation.map(claim => qualifiedRecord(store, claim))),
      summary: Object.freeze({ basis: Object.freeze({ repository: evaluation, modulePopulation: moduleEvaluation, placement: evaluation.placement }),
        documentationCount: documentation.length,
        classification: artifactClassification(evaluation, evaluation.placement, detail),
        total: artifacts.length, moduleAssociated: artifacts.filter(item => moduleArtifacts.has(item.artifact.id)).length,
        unanalyzed: other.length, opaqueBoundaries: other.filter(item => !!item.artifact.artifact.boundary).length }) });
  }));
  const moduleProjection = projection.moduleProjection ? store.get(projection.moduleProjection) : null;
  if (moduleProjection && moduleProjection.kind !== 'projection') throw new Error('Expected module projection');
  const moduleDetail = moduleProjection ? resolveModuleProjection(store, moduleProjection as ProjectionRecord) : null;
  const moduleEvaluations = Object.freeze(projection.expansions.moduleEvaluations.map(id => {
    const outcome = store.get(id);
    if (outcome.kind !== 'evaluation') throw new Error('Expected module expansion outcome');
    return outcome;
  }));
  const contexts = Object.freeze(projection.contexts.map(id => qualifiedContext(store, id)));
  const evidence = repository.capture.status === 'available' ? repository.capture.evidence : null;
  const excluded = evidence?.exclusions.filter(item => item.contentDigest !== null) ?? [];
  const repositorySummary = Object.freeze({ provider: 'repository-layout' as const, groups: evaluation.groups.length, artifacts: evidence?.artifacts.length ?? 0,
    consistency: 'first-observed' as const, sparseCheckout: evidence?.sparseCheckout ?? null,
    exclusions: Object.freeze({ repository: excluded.filter(item => item.origin === 'repository').length, local: excluded.filter(item => item.origin === 'local').length,
      global: excluded.filter(item => item.origin === 'global').length, outputLocations: evidence?.excludedOutputDirectories.length ?? 0 }),
    unestablishedRelationships: repository.layout?.links.filter(link => link.targetRegion === null && !['file-target', 'artifact-target'].includes(link.outcome)).length ?? 0 });
  const external = claims.filter(claim => claim.information.type === 'module-placement' && claim.information.reasons.includes('external-module'));
  return Object.freeze({ projection, evaluation, repository, repositorySummary, moduleEvaluation, moduleEvaluations, moduleDetail, contexts, groups, modules, containment,
    referenceGroups: Object.freeze(referenceGroups),
    externalModules: Object.freeze({ count: external.length, evaluation: evaluation.id, support: Object.freeze(external.map(claim => qualifiedRecord(store, claim))) }) });
}
export type OrganizationProjectionContent = ReturnType<typeof resolveOrganizationProjection>;

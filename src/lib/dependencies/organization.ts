import { compare, methods, recordId } from '../identity.js';
import { locate } from '../organization/placement.js';
import type { ContainmentClaim, ModulePlacementClaim, OrganizationEvaluationRecord } from '../organization/records.js';
import type { EvaluationState, ProgramRecord, ProgramRecordStore, RecordId } from '../records.js';
import type { DependencyEndpointPlacement, DependencyEvaluationRecord, DependencyOrganizationClaim,
  DependencyOrganizationEvaluation, DependencyPlacementClassification } from './records.js';

const complete = (state: Pick<EvaluationState, 'availability' | 'execution' | 'materialization'>) =>
  state.availability === 'available' && state.execution === 'completed' && state.materialization === 'full';

/** Requested relationship expansion. Uses captured placement/containment only; no I/O. */
export function evaluateDependencyOrganization(store: ProgramRecordStore, dependency: DependencyEvaluationRecord,
  organization: OrganizationEvaluationRecord): DependencyOrganizationEvaluation {
  const storedDependency = store.get(dependency.id);
  const storedOrganization = store.get(organization.id);
  if (storedDependency.kind !== 'dependency-evaluation' || storedOrganization.kind !== 'organization-evaluation'
    || storedDependency.moduleEvaluation !== storedOrganization.moduleEvaluation) throw new Error('Mismatched organization expansion basis');
  dependency = storedDependency;
  organization = storedOrganization;
  const repository = store.get(organization.repository);
  if (repository.kind !== 'repository-evidence') throw new Error('Expected repository capture');
  const capture = repository.capture.status === 'available' ? repository.capture.evidence : null;
  const layout = repository.layout;
  const records: ProgramRecord[] = [];
  const base = { session: dependency.session, method: methods.dependencyOrganization };
  const id = recordId(base.session, 'dependency-organization-evaluation', [base.method, dependency.id, organization.id]);
  const claims = organization.claims.map(id => store.get(id));
  const placements = new Map(claims.filter((claim): claim is ModulePlacementClaim =>
    claim.kind === 'claim' && claim.information.type === 'module-placement').map(claim => [claim.subject, claim]));
  const containment = claims.filter((claim): claim is ContainmentClaim => claim.kind === 'claim' && claim.information.type === 'group-containment');
  const groupPaths = new Map<string, RecordId>();
  for (const groupId of organization.groups) {
    const group = store.get(groupId);
    if (group.kind !== 'group') throw new Error('Expected group');
    const claim = store.get(group.claim);
    if (claim.kind !== 'claim') throw new Error('Expected group claim');
    const context = store.get(claim.context);
    if (context.kind !== 'claim-context') throw new Error('Expected group context');
    for (const sourceId of context.evidence) {
      const evidence = store.get(sourceId);
      if (evidence.kind === 'repository-region') groupPaths.set(evidence.path, groupId);
    }
  }
  const artifacts = new Map(claims.flatMap(claim => {
    if (claim.kind !== 'claim' || claim.information.type !== 'artifact-placement') return [];
    const artifact = store.get(claim.information.artifact);
    if (artifact.kind !== 'repository-artifact') throw new Error('Expected artifact');
    return [[artifact.artifact.path, artifact.id] as const];
  }));
  const endpoint = (module: RecordId, evidenceIds: readonly RecordId[], basis: DependencyEndpointPlacement['basis']): DependencyEndpointPlacement => {
    const fallback = placements.get(module);
    const empty = (outcome: DependencyEndpointPlacement['outcome'], reason: string): DependencyEndpointPlacement => ({
      basis, outcome, materialization: 'none', groups: [], candidates: [], artifacts: [], evidence: evidenceIds, claims: [], reasons: [reason],
    });
    if (fallback?.information.reasons.includes('external-module')) return empty('outside-organization', 'external-module');
    if (!capture || !layout) return empty('unavailable', 'repository-unavailable');
    if (evidenceIds.length === 0) {
      if (!fallback) return empty('unavailable', 'source-unavailable');
      const { type: _type, ...information } = fallback.information;
      return { ...information, materialization: information.reasons.length > 0 && information.groups.length > 0
        ? 'partial' : information.materialization, basis: 'module-placement', evidence: [], claims: [fallback.id] };
    }
    const groups = new Set<RecordId>();
    const sourceArtifacts = new Set<RecordId>();
    const reasons = new Set<string>();
    for (const evidenceId of evidenceIds) {
      const source = store.get(evidenceId);
      if (source.kind !== 'source-evidence') throw new Error('Expected source evidence for endpoint');
      const placed = locate(source.path, capture, layout);
      if ('reason' in placed) reasons.add(placed.reason);
      else {
        const group = groupPaths.get(placed.group);
        const artifact = artifacts.get(placed.artifact);
        if (!group || !artifact) throw new Error('Captured placement missing materialized organization records');
        groups.add(group);
        sourceArtifacts.add(artifact);
      }
    }
    return { basis, outcome: groups.size > 1 ? 'multiple' : groups.size === 1 ? 'established' : 'unplaced',
      materialization: reasons.size === 0 ? 'full' : groups.size > 0 ? 'partial' : 'none',
      groups: [...groups].sort(compare), candidates: [], artifacts: [...sourceArtifacts].sort(compare),
      evidence: evidenceIds, claims: [], reasons: [...reasons].sort(compare) };
  };
  const parents = new Map<RecordId, ContainmentClaim[]>();
  for (const edge of containment) {
    const list = parents.get(edge.information.child) ?? [];
    list.push(edge);
    parents.set(edge.information.child, list);
  }
  const ancestry = new Map<RecordId, { groups: Set<RecordId>; claims: Set<RecordId> }>();
  const ancestors = (group: RecordId) => {
    const cached = ancestry.get(group);
    if (cached) return cached;
    const result = { groups: new Set([group]), claims: new Set<RecordId>() };
    const pending = [group];
    while (pending.length) for (const edge of parents.get(pending.pop()!) ?? []) {
      result.claims.add(edge.id);
      if (!result.groups.has(edge.subject)) { result.groups.add(edge.subject); pending.push(edge.subject); }
    }
    ancestry.set(group, result);
    return result;
  };
  const expanded: DependencyOrganizationClaim[] = dependency.relationships.map(relationshipId => {
    const relationship = store.get(relationshipId);
    if (relationship.kind !== 'claim' || relationship.information.type !== 'dependency') throw new Error('Expected dependency relationship');
    const occurrences: DependencyOrganizationClaim['information']['occurrences'] = relationship.information.occurrences.map(occurrenceId => {
      const occurrence = store.get(occurrenceId);
      if (occurrence.kind !== 'dependency-occurrence' || !occurrence.target) throw new Error('Expected resolved occurrence');
      const source = endpoint(occurrence.owner, [occurrence.evidence], 'occurrence');
      const target = endpoint(occurrence.target, occurrence.targetEvidence, 'target-declaration');
      // These sets are narrowed by this occurrence's source/target evidence above.
      // Whole-module placements enter only through the explicit evidence-absent fallback.
      const pairs: DependencyOrganizationClaim['information']['occurrences'][number]['pairs'] = complete(organization) ? source.groups.flatMap(from => target.groups.map(to => {
        const sourceAncestors = ancestors(from);
        const targetAncestors = ancestors(to);
        return { source: from, target: to, classification: from === to ? 'same-group' as const
          : targetAncestors.groups.has(from) ? 'into-descendants' as const : 'outward' as const,
        commonAncestors: [...sourceAncestors.groups].filter(group => targetAncestors.groups.has(group)).sort(compare),
        containment: [...new Set([...sourceAncestors.claims, ...targetAncestors.claims])].sort(compare) };
      })) : [];
      const status = source.outcome === 'ambiguous' || target.outcome === 'ambiguous' ? 'ambiguous'
        : source.materialization === 'full' && target.materialization === 'full' && pairs.length > 0 && complete(organization) ? 'established'
          : source.groups.length > 0 && target.groups.length > 0 ? 'partial' : 'unavailable';
      const answers = new Set(pairs.map(pair => pair.classification));
      const classification: DependencyPlacementClassification | null = status === 'established'
        ? answers.size === 1 ? [...answers][0]! : 'varies-by-placement' : null;
      return { occurrence: occurrenceId, source, target, status, classification, pairs };
    });
    const answers = new Set(occurrences.map(item => item.classification));
    const classification = occurrences.every(item => item.status === 'established')
      ? answers.size === 1 ? occurrences[0]!.classification : 'varies-by-occurrence' : null;
    const claimId = recordId(base.session, 'dependency-organization', [base.method, id, relationshipId]);
    const context = recordId(base.session, 'dependency-organization-context', claimId);
    const supportingContexts = new Set(occurrences.flatMap(item => [...item.source.claims, ...item.target.claims,
      ...item.pairs.flatMap(pair => pair.containment)]).map(claimId => {
      const claim = store.get(claimId);
      if (claim.kind !== 'claim') throw new Error('Expected placement or containment claim');
      return claim.context;
    }));
    const evidence = [...new Set([repository.id, ...occurrences.flatMap(item => [...item.source.evidence, ...item.target.evidence,
      ...item.source.artifacts, ...item.target.artifacts]), ...[...supportingContexts].flatMap(contextId => {
      const context = store.get(contextId);
      if (context.kind !== 'claim-context') throw new Error('Expected placement context');
      return context.evidence;
    })])];
    records.push({ ...base, kind: 'claim-context', id: context, scope: relationshipId, evidence, status: 'mechanically-derived',
      guarantee: 'A common repository-layout classification requires agreement across all applicable placements and supporting occurrences.',
      limitations: ['Repository layout establishes no architectural rule, intended layering, API boundary, or desirability judgment.',
        'Incomplete placement or containment leaves a common classification unestablished.'], diagnostics: [] });
    return { ...base, kind: 'claim', id: claimId, subject: relationshipId, context,
      information: { type: 'dependency-organization', scheme: 'repository-layout', evaluation: id, classification, occurrences } };
  });
  const fullyEstablished = complete(dependency) && complete(organization) && expanded.every(claim => claim.information.classification !== null);
  const result: DependencyOrganizationEvaluation = { ...base, kind: 'dependency-organization-evaluation', id,
    dependencyEvaluation: dependency.id, organizationEvaluation: organization.id, scheme: 'repository-layout',
    claims: expanded.map(claim => claim.id), contexts: [...organization.contexts, ...expanded.map(claim => claim.context)],
    applicability: 'applicable', availability: capture && layout ? 'available' : 'unavailable',
    execution: capture && layout ? 'completed' : 'stopped', materialization: fullyEstablished ? 'full' : expanded.length > 0 ? 'partial' : 'none',
    reason: fullyEstablished ? null : 'Some requested organization context is unavailable or incomplete.',
    cost: { measure: 'relationship-count', value: expanded.length } };
  store.put([...records, ...expanded, result]);
  return result;
}

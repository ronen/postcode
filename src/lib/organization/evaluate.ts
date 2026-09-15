import path from 'node:path';
import { compare, methods, recordId } from '../identity.js';
import type { LayoutEvidence, RepositoryEvidence } from '../repository/evidence.js';
import type { ClaimContextRecord, EvaluationRecord, EvaluationState, ProgramRecord, ProgramRecordStore, RecordId, SourceEvidenceRecord } from '../records.js';
import type { GroupExpansion, ModulePlacementClaim, OrganizationClaims, OrganizationEvaluationRecord, PlacementReason } from './records.js';
import { groupStandardExpansions } from './records.js';

const complete = (state: Pick<EvaluationState, 'execution' | 'materialization'>) =>
  state.execution === 'completed' && state.materialization === 'full';

/** Materializes organization from captured inputs and a stored module outcome. No I/O. */
export function evaluateOrganization(store: ProgramRecordStore, moduleEvaluation: EvaluationRecord,
  requested: readonly GroupExpansion[] = groupStandardExpansions): OrganizationEvaluationRecord {
  const stored = store.get(moduleEvaluation.id);
  if (stored.kind !== 'evaluation' || stored.requirement !== 'modules') throw new Error('Expected module evaluation');
  moduleEvaluation = stored;
  const snapshot = store.get(moduleEvaluation.snapshot);
  if (snapshot.kind !== 'snapshot' || !snapshot.repository) throw new Error('Expected captured repository in snapshot');
  const repository = store.get(snapshot.repository);
  if (repository.kind !== 'repository-evidence') throw new Error('Expected repository evidence');
  const base = { snapshot: snapshot.snapshot, method: methods.organization };
  const id = (kind: string, key: unknown) => recordId(base.snapshot, kind, key);
  const evaluationId = id('organization-evaluation', { method: base.method, modules: moduleEvaluation.id, requested: [...new Set(requested)].sort(compare) });
  const records: ProgramRecord[] = [];
  const claims: OrganizationClaims[] = [];
  const contexts: RecordId[] = [];
  const context = (key: unknown, scope: ClaimContextRecord['scope'], evidence: readonly RecordId[], guarantee: string,
    limitations: readonly string[], inherited?: ClaimContextRecord): RecordId => {
    const record: ClaimContextRecord = { ...base, kind: 'claim-context', id: id('organization-context', key), scope,
      evidence: [...new Set(evidence)], status: 'mechanically-derived', guarantee,
      limitations: [...new Set([...limitations, ...(inherited?.limitations ?? [])])], diagnostics: inherited?.diagnostics ?? [],
      method: inherited ? `${base.method};${inherited.method}` : base.method };
    records.push(record);
    contexts.push(record.id);
    return record.id;
  };
  const addClaim = (subject: RecordId, claimContext: RecordId, information: OrganizationClaims['information'], key: unknown = information) => {
    const claim = { ...base, kind: 'claim' as const, subject, context: claimContext,
      id: id('organization-claim', [subject, key]), information } as OrganizationClaims;
    claims.push(claim);
    return claim.id;
  };
  const capture = repository.capture;
  const evidence = capture.status === 'available' ? capture.evidence : null;
  const layout = repository.layout;
  const layoutContext = context('repository-layout', repository.id, [repository.id],
    'Repository-layout relationships are established from the captured visible worktree artifact population.',
    [...(evidence?.limitations ?? ['Repository layout is unavailable.']),
      'Repository layout is one organizational account, not a claim about architectural purpose.',
      'README association establishes only direct documentation existence, not truth, currency, completeness, or inheritance.']);
  const groups = new Map((layout?.regions ?? []).map(region => [region.path, id('group', ['repository-layout', region.path])]));
  const artifacts = new Map((evidence?.artifacts ?? []).map(artifact => [artifact.path, id('repository-artifact', artifact.path)]));
  const regionEvidence = new Map<string, RecordId>();
  for (const region of layout?.regions ?? []) {
    const group = groups.get(region.path)!;
    const source = id('repository-region', region.path);
    regionEvidence.set(region.path, source);
    records.push({ ...base, kind: 'repository-region', id: source, repository: repository.id, path: region.path });
    const claimContext = context(['group', group], group, [source],
      'The group name is its captured directory segment; the repository root has no intrinsic segment name.', []);
    const claim = addClaim(group, claimContext, { type: 'group', name: region.name });
    records.push({ ...base, kind: 'group', id: group, claim });
  }
  for (const artifact of evidence?.artifacts ?? []) {
    records.push({ ...base, kind: 'repository-artifact', id: artifacts.get(artifact.path)!, repository: repository.id, artifact });
  }
  for (const edge of layout?.containment ?? []) {
    const parent = groups.get(edge.parent)!;
    const source = edge.basis === 'directory' ? regionEvidence.get(edge.child)! : artifacts.get(edge.evidencePath)!;
    const claimContext = context(['containment', edge], parent, [source], 'Direct group containment established by repository layout.', []);
    addClaim(parent, claimContext, { type: 'group-containment', child: groups.get(edge.child)! }, ['containment', edge]);
  }
  const documented = new Set<RecordId>();
  for (const placement of layout?.placements ?? []) {
    const group = groups.get(placement.groupPath)!;
    const artifact = artifacts.get(placement.artifactPath)!;
    const claimContext = context(['artifact', artifact], group, [artifact], 'Direct artifact placement in its captured group.', []);
    addClaim(group, claimContext, { type: 'artifact-placement', artifact });
    if (placement.documentation) {
      documented.add(group);
      const documentationContext = context(['documentation', artifact], group, [artifact],
        'A directly placed README or README.* artifact establishes documentation existence only.',
        ['Documentation content, correctness, currency, completeness, applicability, and inheritance are not evaluated.']);
      addClaim(group, documentationContext, { type: 'group-documentation', artifact });
    }
  }

  const placements: ModulePlacementClaim[] = [];
  for (const moduleId of moduleEvaluation.modules) {
    const module = store.get(moduleId);
    if (module.kind !== 'module') throw new Error('Expected module entity');
    const claim = store.get(module.claim);
    if (claim.kind !== 'claim' || claim.information.type !== 'module') throw new Error('Expected module claim');
    const original = store.get(claim.context);
    if (original.kind !== 'claim-context') throw new Error('Expected module context');
    const sources = original.evidence.map(source => store.get(source))
      .filter((source): source is SourceEvidenceRecord => source.kind === 'source-evidence' && !source.resolution);
    const placed = new Set<RecordId>();
    const sourceArtifacts = new Set<RecordId>();
    const reasons = new Set<PlacementReason>();
    let outcome: ModulePlacementClaim['information']['outcome'];
    let materialization: ModulePlacementClaim['information']['materialization'] = 'full';
    if (!claim.information.facets.includes('project')) {
      outcome = 'outside-organization';
      reasons.add('external-module');
    } else if (!evidence || !layout) {
      outcome = 'unavailable';
      materialization = 'none';
      reasons.add('repository-unavailable');
    } else if (sources.length === 0) {
      outcome = 'unavailable';
      materialization = 'none';
      reasons.add('source-unavailable');
    } else {
      for (const source of sources) {
        const association = locate(source.path, evidence, layout);
        if ('reason' in association) reasons.add(association.reason);
        else {
          placed.add(groups.get(association.group)!);
          sourceArtifacts.add(artifacts.get(association.artifact)!);
        }
      }
      outcome = placed.size > 1 ? 'multiple' : placed.size === 1 ? 'established' : 'unplaced';
    }
    const claimContext = context(['module-placement', evaluationId, moduleId], moduleId,
      [...sources.map(source => source.id), ...sourceArtifacts],
      'Placement relates the configured module entity to groups through its apparent captured source paths.',
      ['Module identity remains the configured TypeScript identity; no realpath, inode, or content-based module merging is performed.'], original);
    const placementId = addClaim(moduleId, claimContext, { type: 'module-placement', outcome,
      groups: [...placed].sort(compare), candidates: [], artifacts: [...sourceArtifacts].sort(compare),
      reasons: [...reasons].sort(compare), materialization }, ['module-placement', evaluationId]);
    placements.push(claims.find(item => item.id === placementId) as ModulePlacementClaim);
  }
  const moduleComplete = complete(moduleEvaluation);
  const placementComplete = evidence !== null && moduleComplete && placements.every(claim => claim.information.materialization === 'full');
  const placementState: EvaluationState = {
    applicability: moduleEvaluation.applicability,
    availability: evidence ? moduleEvaluation.availability : 'unavailable',
    execution: evidence ? moduleEvaluation.execution : 'deferred',
    materialization: placementComplete ? 'full' : placements.some(claim => claim.information.groups.length > 0) ? 'partial' : 'none',
    reason: !evidence ? 'Repository layout is unavailable.' : !moduleComplete ? moduleEvaluation.reason ?? 'Module population is incomplete.'
      : !placementComplete ? 'Some module source evidence is unavailable.' : null,
    cost: { measure: 'module-count', value: moduleEvaluation.modules.length },
  };
  const direct = new Set(placements.flatMap(claim => claim.information.groups));
  const containing = new Set(direct);
  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of layout?.containment ?? []) {
      if (containing.has(groups.get(edge.child)!) && !containing.has(groups.get(edge.parent)!)) {
        containing.add(groups.get(edge.parent)!);
        changed = true;
      }
    }
  }
  for (const group of groups.values()) {
    const propertyContext = context(['group-properties', evaluationId, group], group, [repository.id],
      'Direct documentation existence and module presence are derived from captured layout and this module-placement evaluation.',
      ['Module presence describes only the selected configured project.',
        ...(!placementComplete ? ['Incomplete placement evaluation leaves descendant-only and absent module presence unknown.'] : [])]);
    addClaim(group, propertyContext, { type: 'group-properties', documented: documented.has(group),
      modulePresence: direct.has(group) ? 'direct' : placementComplete ? containing.has(group) ? 'descendant-only' : 'none' : null,
      evaluation: evaluationId }, ['group-properties', evaluationId]);
  }
  const result: OrganizationEvaluationRecord = { ...base, kind: 'organization-evaluation', id: evaluationId,
    repository: repository.id, moduleEvaluation: moduleEvaluation.id, groups: [...groups.values()], claims: claims.map(claim => claim.id),
    contexts: [...new Set([layoutContext, ...moduleEvaluation.contexts, ...contexts])], requested: [...new Set(requested)].sort(compare),
    applicability: 'applicable', availability: evidence ? 'available' : 'unavailable',
    execution: evidence ? 'completed' : 'deferred', materialization: evidence ? 'full' : 'none',
    reason: capture.status === 'unavailable' ? `${capture.reason}: ${capture.operation}` : null,
    placement: placementState, cost: { measure: 'group-count', value: groups.size } };
  store.put([...records, ...claims, result]);
  return result;
}

/** Resolve directory-link regions without changing the identity of an apparent-path module. */
function locate(sourcePath: string, evidence: RepositoryEvidence, layout: LayoutEvidence):
  { group: string; artifact: string } | { reason: PlacementReason } {
  const source = path.resolve(sourcePath);
  let relative: string | undefined;
  for (const root of evidence.rootPaths) {
    const candidate = path.relative(root, source);
    if (candidate !== '..' && !candidate.startsWith(`..${path.sep}`) && !path.isAbsolute(candidate)) {
      relative = candidate.split(path.sep).join('/');
      break;
    }
  }
  if (relative === undefined) return { reason: 'outside-repository' };
  const seen = new Set<string>();
  // Inspect the destination after the last permitted redirect as well.
  for (let redirects = 0; redirects <= 40; redirects++) {
    if (seen.has(relative)) return { reason: 'link-not-established' };
    seen.add(relative);
    const direct = layout.placements.find(item => item.artifactPath === relative);
    if (direct) {
      const artifact = evidence.artifacts.find(item => item.path === relative)!;
      if (artifact.boundary) return { reason: 'opaque-boundary' };
      if (artifact.link?.status === 'excluded-output') return { reason: 'link-not-established' };
      return { group: direct.groupPath, artifact: direct.artifactPath };
    }
    if (evidence.artifacts.some(item => item.boundary && relative!.startsWith(`${item.path}/`))) return { reason: 'opaque-boundary' };
    const link = layout.links.filter(item => relative!.startsWith(`${item.artifactPath}/`))
      .sort((a, b) => b.artifactPath.length - a.artifactPath.length)[0];
    if (!link) return { reason: 'not-visible' };
    if (link.targetRegion === null || redirects === 40) return { reason: 'link-not-established' };
    relative = [link.targetRegion, relative.slice(link.artifactPath.length + 1)].filter(Boolean).join('/');
  }
  return { reason: 'link-not-established' };
}

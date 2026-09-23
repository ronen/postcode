import { compositionView, compositionAnnotation } from '../composition-view.js';
import type { CompositionView } from '../composition-view.js';
import path from 'node:path';
import { groupEntityIds, methods, moduleEntityIds, recordId } from '../identity.js';
import { createView, renderUnicode } from '../presentation.js';
import type { Presentation, QualifiedView } from '../presentation.js';
import type { ClaimContextRecord, EvaluationState, ModuleClaim, ProgramRecordStore, ProjectionRecord, RecordId } from '../records.js';
import { moduleStandardExpansions } from '../records.js';
import type { LayoutEvidence, RepositoryArtifact } from '../repository/evidence.js';
import { inlineText } from '../terminal-text.js';
import { groupStandardExpansions } from './records.js';
import type { GroupPropertiesClaim, ModulePlacementClaim, OrganizationClaims, OrganizationEvaluationRecord, OrganizationProjectionRecord } from './records.js';

export const organizationPresentationRequirements = {
  groups: groupStandardExpansions,
  // Common source capture keeps navigation between lenses in the same session.
  modules: moduleStandardExpansions,
};

type Qualification = Omit<ClaimContextRecord, 'kind' | 'evidence' | 'inputs'>;
interface EntityReference { readonly id: RecordId; readonly entityId: string; readonly name: string | null; readonly label: string }
interface GroupReference extends EntityReference {
  readonly documented: boolean;
  readonly modulePresence: GroupPropertiesClaim['information']['modulePresence'];
}
interface ModuleReference extends EntityReference {
  readonly composition: CompositionView;
  readonly handle: string;
  readonly handleStatus: ModuleClaim['information']['handleStatus'];
  readonly handleProvenance: ModuleClaim['information']['handleProvenance'];
  readonly placement: Omit<ModulePlacementClaim['information'], 'artifacts' | 'reasons'> & { readonly reasons: readonly string[] };
  readonly locations: readonly GroupReference[];
  readonly candidates: readonly GroupReference[];
  readonly qualification: Qualification;
}
interface GroupView extends GroupReference {
  readonly selected: boolean;
  readonly detail: 'materialized' | 'not-requested';
  readonly qualification: Qualification;
  readonly parents: readonly GroupReference[];
  readonly subgroups: readonly GroupReference[];
  readonly modules: readonly ModuleReference[];
  readonly documentationCount: number;
  readonly artifacts: { readonly total: number; readonly moduleAssociated: number; readonly unanalyzed: number; readonly opaqueBoundaries: number };
}
interface TreeRow {
  readonly kind: 'group' | 'module'; readonly id: RecordId; readonly depth: number;
  readonly reference: boolean; readonly pruned: 'outside-project' | 'depth-limit' | null;
}

export interface QualifiedOrganizationView {
  readonly schema: 'postcode-organization-view/1-experimental';
  readonly id: RecordId;
  readonly projection: Pick<OrganizationProjectionRecord, 'id' | 'session' | 'lens' | 'subject' | 'parameters' | 'selection'>;
  readonly presentation: Presentation & { readonly expansions: readonly string[] };
  readonly evaluations: {
    readonly repository: Omit<EvaluationState, 'cost'> & { readonly id: RecordId; readonly cost: OrganizationEvaluationRecord['cost'] };
    readonly placement: EvaluationState;
  };
  readonly repository: {
    readonly provider: 'repository-layout'; readonly groups: number; readonly artifacts: number;
    readonly consistency: 'first-observed'; readonly sparseCheckout: boolean | null;
    readonly exclusions: { readonly repository: number; readonly local: number; readonly global: number; readonly outputLocations: number };
    readonly unestablishedRelationships: number;
  };
  readonly qualifications: readonly Qualification[];
  readonly groups: readonly GroupView[];
  readonly placementExceptions: readonly ModuleReference[];
  readonly moduleDetail: QualifiedView | null;
  readonly display: {
    readonly rows: readonly TreeRow[];
    readonly selectedGroups: number; readonly omittedSelectedGroups: number;
    readonly repeatedGroupReferences: number; readonly prunedGroups: number;
    readonly omittedModulePlacements: number; readonly externalModules: number;
  };
  readonly sourceDetail?: {
    readonly level: 'organization-paths' | 'organization-and-module-source';
    readonly notice: string;
    readonly repositoryRoot: string | null;
    readonly groups: readonly {
      readonly id: RecordId; readonly path: string;
      readonly artifacts: readonly RepositoryArtifact[];
      readonly links: LayoutEvidence['links'];
    }[];
    readonly modules: QualifiedView['sourceDetail'] | null;
  };
}

/** Construct the qualified view from stored records. No repository or compiler reads. */
export function createOrganizationView(store: ProgramRecordStore, projection: OrganizationProjectionRecord,
  presentation: Presentation): QualifiedOrganizationView {
  if (presentation.sourceDetail && projection.lens !== 'inspect') throw new Error('Source detail requires inspection');
  if (!projection.expansions.requested.includes('group-details')) throw new Error('Organization presentation requires evaluated group-details');
  const outcome = store.get(projection.evaluation);
  if (outcome.kind !== 'organization-evaluation') throw new Error('Expected organization evaluation');
  const captured = store.get(outcome.repository);
  if (captured.kind !== 'repository-evidence') throw new Error('Expected repository evidence');
  const evidence = captured.capture.status === 'available' ? captured.capture.evidence : null;
  const layout = captured.layout;
  const moduleEvaluation = store.get(outcome.moduleEvaluation);
  if (moduleEvaluation.kind !== 'evaluation') throw new Error('Expected module evaluation');
  const groupIds = groupEntityIds(outcome.groups);
  const moduleIds = moduleEntityIds(moduleEvaluation.modules);
  const claims = outcome.claims.map(id => store.get(id) as OrganizationClaims);
  const selectedClaims = new Set([...projection.claims, ...projection.expansions.claims]);
  const available = claims.filter(claim => selectedClaims.has(claim.id));
  const qualification = (id: RecordId): Qualification => {
    const context = store.get(id);
    if (context.kind !== 'claim-context') throw new Error('Expected Claim context');
    const { kind: _kind, evidence: _evidence, inputs: _inputs, ...result } = context;
    return result;
  };
  const group = (id: RecordId): GroupReference => {
    const claim = claims.find(claim => claim.subject === id && claim.information.type === 'group');
    const properties = claims.find(claim => claim.subject === id && claim.information.type === 'group-properties');
    if (claim?.information.type !== 'group' || properties?.information.type !== 'group-properties') throw new Error('Missing group properties');
    return { id, entityId: groupIds.get(id)!, name: claim.information.name,
      label: claim.information.name ?? '[repository root]', documented: properties.information.documented,
      modulePresence: properties.information.modulePresence };
  };
  const module = (placement: ModulePlacementClaim): ModuleReference => {
    const entity = store.get(placement.subject);
    if (entity.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(entity.claim) as ModuleClaim;
    const { artifacts: _artifacts, reasons, ...information } = placement.information;
    return { composition: compositionView(store, entity.id, projection.expansions.moduleClaims, projection.expansions.moduleEvaluations), id: entity.id, entityId: moduleIds.get(entity.id)!, name: claim.information.name,
      label: claim.information.name ?? claim.information.handle, handle: claim.information.handle,
      handleStatus: claim.information.handleStatus, handleProvenance: claim.information.handleProvenance,
      placement: { ...information, reasons: reasons.map(reason => reason === 'link-not-established' ? 'relationship-not-established' : reason) },
      locations: information.groups.map(group), candidates: information.candidates.map(group), qualification: qualification(placement.context) };
  };
  const placements = available.filter((claim): claim is ModulePlacementClaim => claim.information.type === 'module-placement');
  const groupPopulation = [...new Set([...projection.groups, ...projection.expansions.groups])];
  const groups: GroupView[] = groupPopulation.map(id => {
    const ownClaims = available.filter(claim => claim.subject === id);
    const primary = claims.find(claim => claim.subject === id && claim.information.type === 'group')!;
    const artifactClaims = ownClaims.filter(claim => claim.information.type === 'artifact-placement');
    const documentation = ownClaims.filter(claim => claim.information.type === 'group-documentation');
    const members = placements.filter(claim => claim.information.groups.includes(id));
    const moduleArtifacts = new Set(members.flatMap(claim => claim.information.artifacts));
    const documentationArtifacts = new Set(documentation.flatMap(claim => claim.information.type === 'group-documentation' ? [claim.information.artifact] : []));
    const other = artifactClaims.flatMap(claim => claim.information.type === 'artifact-placement'
      && !moduleArtifacts.has(claim.information.artifact) && !documentationArtifacts.has(claim.information.artifact) ? [claim.information.artifact] : []);
    return { ...group(id), selected: projection.groups.includes(id), detail: projection.groups.includes(id) ? 'materialized' : 'not-requested', qualification: qualification(primary.context),
      parents: [...new Set(available.flatMap(claim => claim.information.type === 'group-containment' && claim.information.child === id ? [claim.subject] : []))].map(group),
      subgroups: [...new Set(ownClaims.flatMap(claim => claim.information.type === 'group-containment' ? [claim.information.child] : []))].map(group),
      modules: members.map(module), documentationCount: documentation.length,
      artifacts: { total: artifactClaims.length, moduleAssociated: artifactClaims.filter(claim => claim.information.type === 'artifact-placement' && moduleArtifacts.has(claim.information.artifact)).length,
        unanalyzed: other.length, opaqueBoundaries: other.filter(id => { const artifact = store.get(id); return artifact.kind === 'repository-artifact' && !!artifact.artifact.boundary; }).length },
    };
  });
  const rows: TreeRow[] = [];
  const seen = new Set<RecordId>();
  let repeatedGroupReferences = 0;
  let prunedGroups = 0;
  let omittedModulePlacements = 0;
  const byId = new Map(groups.map(group => [group.id, group]));
  const selected = new Set(projection.groups);
  const roots = groups.filter(group => group.selected && !group.parents.some(parent => selected.has(parent.id)));
  const pending = roots.map(group => ({ id: group.id, depth: 0 })).reverse();
  const maximumGroups = presentation.format === 'unicode' ? 150 : Infinity;
  const maximumDepth = presentation.format === 'unicode' ? 6 : Infinity;
  while (pending.length > 0 && projection.lens === 'organization') {
    const next = pending.pop()!;
    const item = byId.get(next.id);
    if (!item || seen.size >= maximumGroups && !seen.has(item.id)) continue;
    const reference = seen.has(item.id);
    const pruned = !item.selected && projection.subject === 'configured-project' ? 'outside-project'
      : next.depth >= maximumDepth && item.subgroups.length > 0 ? 'depth-limit' : null;
    rows.push({ kind: 'group', id: item.id, depth: next.depth, reference, pruned });
    if (reference) { repeatedGroupReferences++; continue; }
    seen.add(item.id);
    if (pruned) prunedGroups++;
    const maximumModules = presentation.format === 'unicode' ? 12 : Infinity;
    for (const member of item.modules.slice(0, maximumModules)) rows.push({ kind: 'module', id: member.id, depth: next.depth + 1, reference: false, pruned: null });
    omittedModulePlacements += Math.max(0, item.modules.length - maximumModules);
    if (!pruned) for (const child of [...item.subgroups].reverse()) pending.push({ id: child.id, depth: next.depth + 1 });
  }
  if (projection.lens === 'organization') omittedModulePlacements += groups.filter(group => group.selected && !seen.has(group.id))
    .reduce((sum, group) => sum + group.modules.length, 0);
  const moduleDetail = projection.moduleProjection ? createView(store, store.get(projection.moduleProjection) as ProjectionRecord,
    { format: presentation.format, sourceDetail: presentation.sourceDetail }) : null;
  const excluded = evidence?.exclusions.filter(item => item.contentDigest !== null) ?? [];
  const { applicability, availability, execution, materialization, reason, cost } = outcome;
  const externalModules = claims.filter(claim => claim.information.type === 'module-placement' && claim.information.reasons.includes('external-module')).length;
  return {
    schema: 'postcode-organization-view/1-experimental',
    id: recordId(projection.session, 'organization-view', { projection: projection.id, presentation, method: methods.presentation }),
    projection: { id: projection.id, session: projection.session, lens: projection.lens, subject: projection.subject,
      parameters: projection.parameters, selection: projection.selection },
    presentation: { ...presentation, expansions: [...projection.expansions.requested, ...new Set(projection.expansions.moduleEvaluations.flatMap(id => {
      const outcome = store.get(id); return outcome.kind === 'evaluation' && outcome.requirement !== 'modules' ? [outcome.requirement] : [];
    }))] },
    evaluations: { repository: { id: outcome.id, applicability, availability, execution, materialization, reason, cost }, placement: outcome.placement },
    repository: { provider: 'repository-layout', groups: outcome.groups.length, artifacts: evidence?.artifacts.length ?? 0,
      consistency: 'first-observed', sparseCheckout: evidence?.sparseCheckout ?? null,
      exclusions: { repository: excluded.filter(item => item.origin === 'repository').length, local: excluded.filter(item => item.origin === 'local').length,
        global: excluded.filter(item => item.origin === 'global').length, outputLocations: evidence?.excludedOutputDirectories.length ?? 0 },
      unestablishedRelationships: layout?.links.filter(link => link.targetRegion === null && !['file-target', 'artifact-target'].includes(link.outcome)).length ?? 0 },
    qualifications: projection.contexts.map(qualification), groups,
    placementExceptions: placements.filter(claim => claim.information.outcome !== 'established' && !claim.information.reasons.includes('external-module')).map(module),
    moduleDetail,
    display: { rows, selectedGroups: projection.groups.length,
      omittedSelectedGroups: projection.lens === 'organization' ? projection.groups.filter(id => !seen.has(id)).length : 0,
      repeatedGroupReferences, prunedGroups, omittedModulePlacements, externalModules },
    ...(presentation.sourceDetail ? { sourceDetail: {
      level: moduleDetail?.modules.length ? 'organization-and-module-source' as const : 'organization-paths' as const,
      notice: 'Captured group and artifact paths only; group documentation and other artifact contents are not reproduced. Module source detail, when selected, is separately bounded.',
      repositoryRoot: evidence?.root ?? null,
      groups: groups.filter(group => group.selected).map(group => {
        const primary = claims.find(claim => claim.subject === group.id && claim.information.type === 'group')!;
        const context = store.get(primary.context);
        if (context.kind !== 'claim-context') throw new Error('Expected group context');
        const region = context.evidence.map(id => store.get(id)).find(record => record.kind === 'repository-region');
        if (region?.kind !== 'repository-region' || !evidence) throw new Error('Expected group region');
        const artifacts = available.flatMap(claim => claim.subject === group.id && claim.information.type === 'artifact-placement' ? [store.get(claim.information.artifact)] : [])
          .flatMap(record => record.kind === 'repository-artifact' ? [record.artifact] : []);
        return { id: group.id, path: path.resolve(evidence.root, region.path), artifacts,
          links: layout?.links.filter(link => link.targetRegion === region.path
            || artifacts.some(artifact => artifact.path === link.artifactPath)) ?? [] };
      }), modules: moduleDetail?.sourceDetail ?? null,
    } } : {}),
  };
}

const annotation = (group: GroupReference) => [group.documented ? 'documented' : null,
  group.modulePresence === 'direct' ? 'direct project modules' : group.modulePresence === 'descendant-only' ? 'modules in descendants'
    : group.modulePresence === 'none' ? 'no project modules' : 'module presence unknown'].filter(Boolean).join(' · ');
const label = (entity: EntityReference) => `${inlineText(entity.label)}  ${entity.entityId}`;

export function renderOrganizationView(view: QualifiedOrganizationView): string {
  if (view.presentation.format === 'json') return `${JSON.stringify(view, null, 2)}\n`;
  const inspection = view.projection.lens === 'inspect';
  const lines = [inspection ? 'Inspect · groups and modules' : `Organization · ${view.projection.subject === 'repository' ? 'repository' : 'configured project'}`,
    `Session ${view.projection.session.replace(/^session:/, '')}`,
    inspection ? `${view.projection.selection.matches} exact matches for ${inlineText(view.projection.parameters.selector ?? '')}`
      : `${view.display.selectedGroups} selected groups · ${view.repository.groups} repository groups`];
  if (!view.projection.selection.populationEstablished) lines.push('Selection population is not fully established.');
  for (const [name, state] of Object.entries(view.evaluations)) {
    lines.push(`${name === 'repository' ? 'Repository layout' : 'Project placement'}: ${state.availability}, ${state.execution}, materialization ${state.materialization}${state.reason ? ` · ${inlineText(state.reason)}` : ''}`);
  }
  const groups = new Map(view.groups.map(group => [group.id, group]));
  const modules = new Map(view.groups.flatMap(group => group.modules.map(module => [module.id, module] as const)));
  if (inspection) {
    lines.push('', 'Groups');
    if (!view.groups.some(group => group.selected)) lines.push('  No exact group match.');
    for (const group of view.groups.filter(group => group.selected)) {
      lines.push('', `◆ ${label(group)}`, `  ${annotation(group)}`,
        `  Direct documentation: ${group.documentationCount} artifact${group.documentationCount === 1 ? '' : 's'}`);
      for (const [heading, items] of [['Parents', group.parents], ['Subgroups', group.subgroups]] as const) {
        lines.push(`  ${heading}:`);
        if (!items.length) lines.push('    None established.');
        for (const item of items) lines.push(`    ${label(item)} · ${annotation(item)}`);
      }
      lines.push('  Direct modules:');
      if (!group.modules.length) lines.push(view.evaluations.placement.materialization === 'full' ? '    None.' : '    None established; placement is incomplete.');
      for (const module of group.modules) lines.push(`    ${label(module)}${compositionAnnotation(module.composition)}${module.placement.outcome === 'multiple' ? ' · multiple placements' : ''}`);
      lines.push(`  Other artifacts: ${group.artifacts.unanalyzed} unanalyzed · ${group.artifacts.opaqueBoundaries} opaque boundaries`);
    }
    if (view.moduleDetail?.modules.length) lines.push('', 'Modules', renderUnicode(view.moduleDetail).trimEnd());
  } else {
    lines.push('');
    const width = Math.min(36, Math.max(0, ...view.display.rows.map(row => {
      const entity = row.kind === 'group' ? groups.get(row.id)! : modules.get(row.id)!;
      return inlineText(entity.label).length + row.depth * 2;
    })));
    for (const row of view.display.rows) {
      const item = row.kind === 'group' ? groups.get(row.id)! : modules.get(row.id)!;
      const group = row.kind === 'group' ? item as GroupView : null;
      const name = inlineText(item.label).padEnd(Math.max(0, width - row.depth * 2));
      lines.push(`${'  '.repeat(row.depth)}${row.kind === 'group' ? '◆' : '·'} ${name}  ${item.entityId}${group ? ` · ${annotation(group)}${!group.selected ? ' · context group' : ''}${group.artifacts.unanalyzed ? ` · ${group.artifacts.unanalyzed} unanalyzed artifacts` : ''}` : ''}${row.kind === 'module' ? compositionAnnotation((item as ModuleReference).composition) : ''}${row.reference ? ' · reference (already expanded)' : ''}${row.pruned ? ` · descent pruned (${row.pruned === 'outside-project' ? 'outside project selection' : 'depth limit'})` : ''}`);
    }
    if (!view.display.rows.length) lines.push(view.projection.selection.populationEstablished ? 'No groups in this selection.' : 'No groups materialized for this selection.');
  }
  if (view.placementExceptions.length) {
    lines.push('', 'Placement exceptions');
    for (const outcome of [...new Set(view.placementExceptions.map(module => module.placement.outcome))]) {
      lines.push(`  ${outcome}:`);
      for (const module of view.placementExceptions.filter(module => module.placement.outcome === outcome)) {
        lines.push(`    ${label(module)}${compositionAnnotation(module.composition)} · ${module.placement.materialization}${module.placement.reasons.length ? ` · ${module.placement.reasons.map(inlineText).join(', ')}` : ''}`);
        for (const location of module.locations) lines.push(`      Established in ${label(location)}`);
        for (const candidate of module.candidates) lines.push(`      Candidate only: ${label(candidate)}`);
      }
    }
  }
  if (view.sourceDetail) {
    lines.push('', 'Group source detail', `  ${view.sourceDetail.notice}`);
    for (const group of view.sourceDetail.groups) {
      lines.push(`  ${label(groups.get(group.id)!)}`, `    ${inlineText(group.path)}`);
      for (const artifact of group.artifacts) lines.push(`    ${inlineText(artifact.path)} · ${artifact.kind}${artifact.link ? ` · ${artifact.link.status} → ${inlineText(artifact.link.target)}` : ''}`);
      for (const link of group.links) lines.push(`    Relationship evidence: ${inlineText(link.artifactPath)} · ${link.outcome}`);
    }
  }
  lines.push('', 'Display', `  ${view.display.omittedSelectedGroups} selected groups omitted · ${view.display.prunedGroups} descents pruned · ${view.display.repeatedGroupReferences} repeated references · ${view.display.omittedModulePlacements} module placements omitted`,
    `  ${view.display.externalModules} external modules outside this organization.`,
    '', 'Qualifications', '  Repository layout is one organizational account; architectural purpose is not established.',
    '  Documentation availability is direct existence only; contents and descendant applicability are not evaluated.',
    '  Module presence describes the selected configured project; other artifacts remain unanalyzed.',
    '  Re-exports only is a syntax property, not an API, purity, or safe-collapse claim.',
    '  Unnamed module leaves use generated navigation handles, not responsibility labels.',
    `  Repository-layout evidence left ${view.repository.unestablishedRelationships} relationships unestablished.`,
    `  Exclusion policies: ${view.repository.exclusions.repository} repository, ${view.repository.exclusions.local} local, ${view.repository.exclusions.global} global; ${view.repository.exclusions.outputLocations} output locations excluded.`,
    '  Inputs are first-observed, not atomic; sparse-checkout completeness remains unresolved.');
  const diagnostics = new Set(view.qualifications.flatMap(context => context.diagnostics.map(diagnostic => diagnostic.code)));
  for (const code of diagnostics) lines.push(`  Encountered TypeScript diagnostic: TS${code}`);
  return `${lines.join('\n')}\n`;
}

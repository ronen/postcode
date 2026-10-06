import { renderAssociatedInvestigations } from '../investigation/associations.js';
import type { AssociatedInvestigations } from '../investigation/associations.js';
import { displayWidth, padDisplay } from '../terminal-layout.js';
import { compositionView, compositionAnnotation } from '../composition-view.js';
import type { CompositionView } from '../composition-view.js';
import path from 'node:path';
import { identityReference, methods, recordId } from '../identity.js';
import { arrangeModuleView, renderUnicode } from '../presentation.js';
import type { Presentation, QualifiedView } from '../presentation.js';
import type { ClaimContextRecord, EvaluationState, ModuleClaim, ProgramRecordStore, RecordId } from '../records.js';
import { moduleStandardExpansions } from '../records.js';
import type { LayoutEvidence, RepositoryArtifact } from '../repository/evidence.js';
import { inlineText } from '../terminal-text.js';
import { artifactClassificationComplete, resolveOrganizationProjection } from './content.js';
import type { OrganizationProjectionContent } from './content.js';
import { presentQualification } from '../qualification-view.js';
import { groupStandardExpansions } from './records.js';
import type { GroupPropertiesClaim, ModulePlacementClaim, OrganizationEvaluationRecord, OrganizationProjectionRecord } from './records.js';

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
  readonly investigations?: AssociatedInvestigations;
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

/** Coordinate population bindings before arranging the resolved selection. */
export function createOrganizationView(store: ProgramRecordStore, projection: OrganizationProjectionRecord,
  presentation: Presentation): QualifiedOrganizationView {
  const content = resolveOrganizationProjection(store, projection);
  const groups = store.entityIds(content.evaluation.groups, 'group');
  const modules = store.entityIds(content.moduleEvaluation.modules, 'module');
  const detail = content.moduleDetail ? store.entityIds(content.moduleDetail.discovery.modules, 'module') : new Map<RecordId, string>();
  return arrangeOrganizationView(content, { groups, modules, detail }, presentation);
}

export function arrangeOrganizationView(content: OrganizationProjectionContent,
  bindings: { readonly groups: ReadonlyMap<RecordId, string>; readonly modules: ReadonlyMap<RecordId, string>; readonly detail: ReadonlyMap<RecordId, string> },
  presentation: Presentation): QualifiedOrganizationView {
  const { projection, evaluation: outcome, repository: captured } = content;
  if (presentation.sourceDetail && projection.lens !== 'inspect') throw new Error('Source detail requires inspection');
  const evidence = captured.capture.status === 'available' ? captured.capture.evidence : null;
  const layout = captured.layout;
  const groupContent = new Map(content.groups.map(item => [item.id, item]));
  const group = (id: RecordId): GroupReference => {
    const { claim, properties } = content.referenceGroups[id]!;
    return { id, entityId: bindings.groups.get(id)!, name: claim.record.information.name,
      label: claim.record.information.name ?? '[repository root]', documented: properties.record.information.documented,
      modulePresence: properties.record.information.modulePresence };
  };
  const module = (item: OrganizationProjectionContent['modules'][number]): ModuleReference => {
    const claim = item.claim.record;
    const { artifacts: _artifacts, reasons, ...information } = item.placement.record.information;
    return { composition: compositionView(item.composition), id: item.id, entityId: bindings.modules.get(item.id)!, name: claim.information.name,
      label: claim.information.name ?? claim.information.handle, handle: claim.information.handle,
      handleStatus: claim.information.handleStatus, handleProvenance: claim.information.handleProvenance,
      placement: { ...information, reasons: reasons.map(reason => reason === 'link-not-established' ? 'relationship-not-established' : reason) },
      locations: information.groups.map(group), candidates: information.candidates.map(group), qualification: presentQualification(item.placement.context) };
  };
  const selected = new Set(projection.groups);
  const groups: GroupView[] = content.groups.map(item => {
    const { total, moduleAssociated, unanalyzed, opaqueBoundaries } = item.summary;
    return { ...group(item.id), selected: item.selected, detail: item.detail, qualification: presentQualification(content.referenceGroups[item.id]!.claim.context),
      parents: item.parents.map(group), subgroups: item.subgroups.map(group), modules: item.modules.map(module), documentationCount: item.summary.documentationCount,
      artifacts: { total, moduleAssociated, unanalyzed, opaqueBoundaries } };
  });
  const rows: TreeRow[] = [];
  const seen = new Set<RecordId>();
  let repeatedGroupReferences = 0;
  let prunedGroups = 0;
  let omittedModulePlacements = 0;
  const byId = new Map(groups.map(group => [group.id, group]));
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
  const moduleDetail = content.moduleDetail ? arrangeModuleView(content.moduleDetail, bindings.detail,
    { format: presentation.format, sourceDetail: presentation.sourceDetail }) : null;
  const { applicability, availability, execution, materialization, reason, cost } = outcome;
  const externalModules = content.externalModules.count;
  const linksByTarget = new Map<string, { link: LayoutEvidence['links'][number]; order: number }[]>();
  const linksByArtifact = new Map<string, { link: LayoutEvidence['links'][number]; order: number }>();
  if (presentation.sourceDetail) (layout?.links ?? []).forEach((link, order) => {
    const item = { link, order };
    linksByArtifact.set(link.artifactPath, item);
    if (link.targetRegion !== null) {
      const bucket = linksByTarget.get(link.targetRegion) ?? [];
      bucket.push(item); linksByTarget.set(link.targetRegion, bucket);
    }
  });
  return {
    schema: 'postcode-organization-view/1-experimental',
    id: recordId(projection.session, 'organization-view', { projection: identityReference(projection.session, projection.id), presentation, method: methods.presentation }),
    projection: { id: projection.id, session: projection.session, lens: projection.lens, subject: projection.subject,
      parameters: projection.parameters, selection: projection.selection },
    presentation: { ...presentation, expansions: [...projection.expansions.requested, ...new Set(content.moduleEvaluations.flatMap(outcome => outcome.requirement !== 'modules' ? [outcome.requirement] : []))] },
    evaluations: { repository: { id: outcome.id, applicability, availability, execution, materialization, reason, cost }, placement: outcome.placement },
    repository: content.repositorySummary,
    qualifications: content.contexts.map(item => presentQualification(item.context)), groups,
    placementExceptions: content.modules.filter(item => item.placement.record.information.outcome !== 'established' && !item.placement.record.information.reasons.includes('external-module')).map(module),
    moduleDetail,
    display: { rows, selectedGroups: projection.groups.length,
      omittedSelectedGroups: projection.lens === 'organization' ? projection.groups.filter(id => !seen.has(id)).length : 0,
      repeatedGroupReferences, prunedGroups, omittedModulePlacements, externalModules },
    ...(presentation.sourceDetail ? { sourceDetail: {
      level: moduleDetail?.modules.length ? 'organization-and-module-source' as const : 'organization-paths' as const,
      notice: 'Captured group and artifact paths only; group documentation and other artifact contents are not reproduced. Module source detail, when selected, is separately bounded.',
      repositoryRoot: evidence?.root ?? null,
      groups: groups.filter(group => group.selected).map(group => {
        const region = content.referenceGroups[group.id]!.claim.evidence.find(record => record.kind === 'repository-region');
        if (region?.kind !== 'repository-region' || !evidence) throw new Error('Expected group region');
        const artifacts = groupContent.get(group.id)!.artifacts.map(item => item.artifact.artifact);
        return { id: group.id, path: path.resolve(evidence.root, region.path), artifacts,
          links: [...new Set([...(linksByTarget.get(region.path) ?? []), ...artifacts.flatMap(artifact => {
            const link = linksByArtifact.get(artifact.path); return link ? [link] : [];
          })])].sort((a, b) => a.order - b.order).map(item => item.link) };
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
    inspection ? `${view.projection.selection.matches} exact matches for ${view.projection.parameters.reference ? '@' : ''}${inlineText(view.projection.parameters.selector ?? '')}${view.projection.parameters.reference ? ` · ${view.projection.selection.referenceStatus}` : ''}`
      : `${view.display.selectedGroups} selected groups · ${view.repository.groups} repository groups`];
  if (!view.projection.selection.populationEstablished) lines.push('Selection population is not fully established.');
  for (const [name, state] of Object.entries(view.evaluations)) {
    lines.push(`${name === 'repository' ? 'Repository layout' : 'Project placement'}: ${state.availability}, ${state.execution}, materialization ${state.materialization}${state.reason ? ` · ${inlineText(state.reason)}` : ''}`);
  }
  const classificationComplete = (group: GroupView) => artifactClassificationComplete(view.evaluations.repository, view.evaluations.placement, group.detail);
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
      lines.push(classificationComplete(group)
        ? `  Other artifacts: ${group.artifacts.unanalyzed} unanalyzed · ${group.artifacts.opaqueBoundaries} opaque boundaries`
        : `  Other captured artifacts: ${group.artifacts.unanalyzed} · ${group.artifacts.opaqueBoundaries} opaque boundaries (classification incomplete)`);
    }
    if (view.moduleDetail?.modules.length) lines.push('', 'Modules', renderUnicode(view.moduleDetail).trimEnd());
  } else {
    lines.push('');
    const width = Math.min(36, Math.max(0, ...view.display.rows.map(row => {
      const entity = row.kind === 'group' ? groups.get(row.id)! : modules.get(row.id)!;
      return displayWidth(inlineText(entity.label)) + row.depth * 2;
    })));
    for (const row of view.display.rows) {
      const item = row.kind === 'group' ? groups.get(row.id)! : modules.get(row.id)!;
      const group = row.kind === 'group' ? item as GroupView : null;
      const name = padDisplay(inlineText(item.label), Math.max(0, width - row.depth * 2));
      lines.push(`${'  '.repeat(row.depth)}${row.kind === 'group' ? '◆' : '·'} ${name}  ${item.entityId}${group ? ` · ${annotation(group)}${!group.selected ? ' · context group' : ''}${group.artifacts.unanalyzed ? ` · ${group.artifacts.unanalyzed} ${classificationComplete(group) ? 'unanalyzed artifacts' : 'other captured artifacts (classification incomplete)'}` : ''}` : ''}${row.kind === 'module' ? compositionAnnotation((item as ModuleReference).composition) : ''}${row.reference ? ' · reference (already expanded)' : ''}${row.pruned ? ` · descent pruned (${row.pruned === 'outside-project' ? 'outside project selection' : 'depth limit'})` : ''}`);
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
  // Changes to this section or JSON source fields must stay aligned with
  // src/lib/source-disclosure.ts and test/source-disclosure.test.ts.
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
    // Qualify the evaluation basis even when no groups match or layout is unavailable.
    artifactClassificationComplete(view.evaluations.repository, view.evaluations.placement, 'materialized')
      ? '  Module presence describes the selected configured project; other artifacts remain unanalyzed.'
      : '  Module presence describes the selected configured project. Other captured artifacts have no module or documentation association established in the supplied information; classification is incomplete.',
    '  Re-exports only is a syntax property, not an API, purity, or safe-collapse claim.',
    '  Unnamed module leaves use generated navigation handles, not responsibility labels.',
    `  Repository-layout evidence left ${view.repository.unestablishedRelationships} relationships unestablished.`,
    `  Exclusion policies: ${view.repository.exclusions.repository} repository, ${view.repository.exclusions.local} local, ${view.repository.exclusions.global} global; ${view.repository.exclusions.outputLocations} output locations excluded.`,
    '  Inputs are first-observed, not atomic; sparse-checkout completeness remains unresolved.');
  const diagnostics = new Set(view.qualifications.flatMap(context => context.diagnostics.map(diagnostic => diagnostic.code)));
  for (const code of diagnostics) lines.push(`  Encountered TypeScript diagnostic: TS${code}`);
  return `${lines.join('\n')}\n${renderAssociatedInvestigations(view.investigations)}`;
}

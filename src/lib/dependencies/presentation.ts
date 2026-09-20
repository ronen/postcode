import { compositionAnnotation, compositionView } from '../composition-view.js';
import type { CompositionView } from '../composition-view.js';
import { methods, moduleEntityIds, recordId } from '../identity.js';
import type { Presentation } from '../presentation.js';
import { moduleStandardExpansions } from '../records.js';
import type { ClaimContextRecord, EvaluationState, ModuleClaim, ProgramRecord, ProgramRecordStore, RecordId, SourceEvidenceRecord } from '../records.js';
import { inlineText } from '../terminal-text.js';
import { dependencyLimitations } from './records.js';
import type { DependencyCoverageRecord, DependencyGraph, DependencyOccurrenceRecord, DependencyOrganizationClaim, DependencyProjectionRecord, DependencyRelationshipClaim } from './records.js';

export const dependencyPresentationRequirements = { modules: moduleStandardExpansions, organization: 'repository-layout' } as const;
type Qualification = Omit<ClaimContextRecord, 'kind' | 'evidence'>;
type Outcome = Omit<EvaluationState, 'cost'>;
type ModuleView = { readonly id: RecordId; readonly entityId: string; readonly name: string | null; readonly handle: string;
  readonly discoveryFacets: ModuleClaim['information']['discoveryFacets']; readonly opaque: boolean;
  readonly composition: CompositionView; readonly qualification: Qualification };
type OccurrenceView = Pick<DependencyOccurrenceRecord, 'id' | 'owner' | 'target' | 'mechanism' | 'typeOnly' | 'targetStatus' | 'commonjs'> & { readonly qualification: Qualification };
type OrganizationView = { readonly scheme: 'repository-layout'; readonly classification: DependencyOrganizationClaim['information']['classification'];
  readonly qualification: Qualification; readonly occurrences: readonly {
    readonly occurrence: RecordId; readonly status: string; readonly classification: string | null;
    readonly source: { readonly outcome: string; readonly materialization: string; readonly groups: readonly RecordId[]; readonly candidates: readonly RecordId[] };
    readonly target: { readonly outcome: string; readonly materialization: string; readonly groups: readonly RecordId[]; readonly candidates: readonly RecordId[] };
  }[]; readonly omittedOccurrences: number };
type EdgeView = { readonly id: RecordId; readonly parent: RecordId; readonly child: RecordId; readonly typeOnly: boolean;
  readonly mechanisms: DependencyRelationshipClaim['information']['mechanisms']; readonly qualification: Qualification;
  readonly occurrences: readonly OccurrenceView[]; readonly omittedOccurrences: number; readonly organization: OrganizationView | null };
type Row = { readonly component: number; readonly depth: number; readonly reference: boolean; readonly pruned: boolean };

export interface QualifiedDependencyView {
  readonly schema: 'postcode-dependency-view/0-experimental'; readonly id: RecordId;
  readonly projection: Pick<DependencyProjectionRecord, 'id' | 'snapshot' | 'lens' | 'subject' | 'parameters' | 'selection'>;
  readonly presentation: Presentation & { readonly expansions: readonly string[]; readonly dependencyNavigation?: { readonly children: string; readonly parents: string; readonly source: string } };
  readonly evaluations: { readonly modules: Outcome; readonly dependencies: Outcome; readonly organization: Outcome | null };
  readonly limitations: readonly string[]; readonly qualifications: readonly Qualification[];
  readonly modules: readonly ModuleView[]; readonly subjects: readonly RecordId[]; readonly relationships: readonly EdgeView[];
  readonly graph: DependencyGraph | null;
  readonly requestResults: readonly OccurrenceView[];
  readonly recognitionCoverage: readonly { readonly id: RecordId; readonly owner: RecordId | null; readonly outcome: string; readonly commonjs: DependencyCoverageRecord['commonjs']; readonly qualification: Qualification }[];
  readonly summary: { readonly modules: number; readonly discoveredModules: number; readonly projectModules: number; readonly relationships: number; readonly requestsWithoutEdges: Readonly<Record<string, number>>; readonly recognitionCoverage: Readonly<Record<string, number>> };
  readonly display: { readonly rows: readonly Row[]; readonly omittedModules: number; readonly omittedRelationships: number;
    readonly omittedOccurrences: number; readonly omittedRequestResults: number; readonly omittedCoverageOutcomes: number; readonly prunedComponents: number };
  readonly sourceDetail?: { readonly level: 'dependency-occurrences-and-organization-evidence'; readonly notice: string;
    readonly items: readonly { readonly subject: RecordId; readonly role: 'request' | 'recognition-coverage' | 'target' | 'composition'; readonly evidence: SourceEvidenceRecord }[];
    readonly organization: readonly (DependencyOrganizationClaim & { readonly omittedOccurrences: number })[];
    readonly organizationEvidence: readonly ProgramRecord[]; readonly omittedOrganizationEvidence: number; readonly omittedOrganizationClaims: number; readonly omittedEvidence: number };
}

const state = ({ applicability, availability, execution, materialization, reason }: Outcome): Outcome => ({ applicability, availability, execution, materialization, reason });
const full = (outcome: Outcome) => outcome.applicability === 'applicable' && outcome.availability === 'available' && outcome.execution === 'completed' && outcome.materialization === 'full';

/** Materializes display bounds from the stored graph; rendering below only formats this value. */
export function createDependencyView(store: ProgramRecordStore, projection: DependencyProjectionRecord,
  presentation: Presentation & { readonly dependencyNavigation?: { readonly children: string; readonly parents: string; readonly source: string } }): QualifiedDependencyView {
  const evaluation = store.get(projection.evaluation);
  if (evaluation.kind !== 'dependency-evaluation') throw new Error('Expected dependency evaluation');
  const basis = store.get(evaluation.moduleEvaluation);
  if (basis.kind !== 'evaluation') throw new Error('Expected module evaluation');
  const ids = moduleEntityIds(basis.modules);
  const qualification = (id: RecordId): Qualification => {
    const context = store.get(id);
    if (context.kind !== 'claim-context') throw new Error('Expected qualification');
    const { kind: _kind, evidence: _evidence, ...result } = context;
    return result;
  };
  const expanded = projection.expansions.organization ? store.get(projection.expansions.organization) : null;
  if (expanded && expanded.kind !== 'dependency-organization-evaluation') throw new Error('Expected organization expansion');
  const organizationClaims = expanded?.claims.map(id => store.get(id) as DependencyOrganizationClaim) ?? [];
  const allEdges = projection.relationships.map(id => store.get(id) as DependencyRelationshipClaim);
  const graph = projection.graph;
  const rows: Row[] = [];
  const displayed = new Set<RecordId>();
  const selectedEdges = new Set<RecordId>();
  const maximumEdges = presentation.format === 'unicode' ? 200 : Infinity;
  const maximumComponents = presentation.format === 'unicode' ? 60 : Infinity;
  const maximumDepth = presentation.format === 'unicode' ? 6 : Infinity;
  const componentOf = new Map(graph?.components.flatMap((component, index) => component.members.map(id => [id, index] as const)) ?? []);
  if (graph) {
    const seen = new Set<number>();
    // Incomplete evaluation cannot name roots: show known components as a flat inventory.
    const pending = (graph.rootsEstablished ? graph.roots : graph.components.map((_, index) => index)).map(component => ({ component, depth: 0 })).reverse();
    while (pending.length) {
      const next = pending.pop()!;
      const component = graph.components[next.component]!;
      const reference = seen.has(next.component);
      if (seen.size >= maximumComponents && !reference) continue;
      const pruned = next.depth >= maximumDepth && component.children.length > 0;
      rows.push({ ...next, reference, pruned });
      if (reference) continue;
      seen.add(next.component);
      component.members.forEach(id => displayed.add(id));
      // Opaque external endpoints come from projection edges, not the project-only SCC graph.
      for (const edge of allEdges.filter(edge => componentOf.get(edge.subject) === next.component)) {
        if (selectedEdges.size >= maximumEdges) break;
        selectedEdges.add(edge.id); displayed.add(edge.subject); displayed.add(edge.information.child);
      }
      if (!pruned && graph.rootsEstablished) for (const child of [...component.children].reverse()) pending.push({ component: child, depth: next.depth + 1 });
    }
  } else {
    projection.subjects.forEach(id => displayed.add(id));
    for (const edge of allEdges.slice(0, maximumEdges)) { selectedEdges.add(edge.id); displayed.add(edge.subject); displayed.add(edge.information.child); }
  }
  const maximumOccurrences = presentation.format === 'unicode' ? 20 : 50;
  const sourceItems: NonNullable<QualifiedDependencyView['sourceDetail']>['items'][number][] = [];
  const source = (subject: RecordId, role: NonNullable<QualifiedDependencyView['sourceDetail']>['items'][number]['role'], evidenceId: RecordId) => {
    if (!presentation.sourceDetail) return;
    const evidence = store.get(evidenceId);
    if (evidence.kind !== 'source-evidence') throw new Error('Expected captured source evidence');
    sourceItems.push({ subject, role, evidence });
  };
  const occurrence = (id: RecordId): OccurrenceView => {
    const item = store.get(id);
    if (item.kind !== 'dependency-occurrence') throw new Error('Expected occurrence');
    source(id, 'request', item.evidence);
    item.targetEvidence.forEach(evidence => source(id, 'target', evidence));
    const { owner, target, mechanism, typeOnly, targetStatus, commonjs } = item;
    return { id, owner, target, mechanism, typeOnly, targetStatus, commonjs, qualification: qualification(item.context) };
  };
  const relationships: EdgeView[] = allEdges.filter(edge => selectedEdges.has(edge.id)).map(edge => {
    const organization = organizationClaims.find(claim => claim.subject === edge.id);
    const endpoint = (item: DependencyOrganizationClaim['information']['occurrences'][number]['source']) => ({
      outcome: item.outcome, materialization: item.materialization, groups: item.groups, candidates: item.candidates });
    return { id: edge.id, parent: edge.subject, child: edge.information.child, typeOnly: edge.information.typeOnly,
      mechanisms: edge.information.mechanisms, qualification: qualification(edge.context),
      occurrences: edge.information.occurrences.slice(0, maximumOccurrences).map(occurrence),
      omittedOccurrences: Math.max(0, edge.information.occurrences.length - maximumOccurrences),
      organization: organization ? { scheme: organization.information.scheme, classification: organization.information.classification,
        qualification: qualification(organization.context), occurrences: organization.information.occurrences.slice(0, maximumOccurrences).map(item => ({
          occurrence: item.occurrence, status: item.status, classification: item.classification, source: endpoint(item.source), target: endpoint(item.target) })),
        omittedOccurrences: Math.max(0, organization.information.occurrences.length - maximumOccurrences) } : null };
  });
  const maximumResults = presentation.format === 'unicode' ? 20 : 50;
  // Structure summarizes non-edge requests; explicit source escape exposes their bounded records.
  const requestIds = projection.lens === 'dependency-structure' && !presentation.sourceDetail ? [] : projection.nonEdgeRequests.slice(0, maximumResults);
  const requestResults = requestIds.map(occurrence);
  const recognitionCoverage = projection.coverage.slice(0, maximumResults).map(id => {
    const item = store.get(id);
    if (item.kind !== 'dependency-coverage') throw new Error('Expected coverage outcome');
    source(id, 'recognition-coverage', item.evidence);
    return { id, owner: item.owner, outcome: item.outcome, commonjs: item.commonjs, qualification: qualification(item.context) };
  });
  requestResults.forEach(item => displayed.add(item.owner));
  recognitionCoverage.forEach(item => { if (item.owner && projection.modules.includes(item.owner)) displayed.add(item.owner); });
  const modules = projection.modules.filter(id => displayed.has(id)).map(id => {
    const module = store.get(id);
    if (module.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(module.claim) as ModuleClaim;
    const composition = compositionView(store, id, projection.expansions.moduleClaims, projection.expansions.moduleEvaluations);
    for (const property of composition.claims) {
      const context = store.get(property.qualification.id);
      if (context.kind === 'claim-context') for (const evidence of context.evidence) source(property.id, 'composition', evidence);
    }
    return { id, entityId: ids.get(id)!, name: claim.information.name, handle: claim.information.handle,
      discoveryFacets: claim.information.discoveryFacets, opaque: !claim.information.discoveryFacets.includes('project'), composition, qualification: qualification(claim.context) };
  });
  const count = (references: readonly RecordId[], field: 'targetStatus' | 'outcome') => {
    const counts: Record<string, number> = {};
    for (const id of references) {
      const item = store.get(id);
      const key = item.kind === 'dependency-occurrence' && field === 'targetStatus' ? item.targetStatus : item.kind === 'dependency-coverage' ? item.outcome : null;
      if (key) counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  };
  const sourceOrganization = organizationClaims.filter(claim => selectedEdges.has(claim.subject));
  const boundedOrganization = sourceOrganization.slice(0, 50).map(claim => ({ ...claim,
    information: { ...claim.information, occurrences: claim.information.occurrences.slice(0, maximumOccurrences) },
    omittedOccurrences: Math.max(0, claim.information.occurrences.length - maximumOccurrences) }));
  const organizationEvidence = new Map<RecordId, ProgramRecord>();
  if (presentation.sourceDetail) for (const claim of boundedOrganization) for (const item of claim.information.occurrences) {
    const supporting = [...item.source.groups, ...item.target.groups, ...item.source.candidates, ...item.target.candidates,
      ...item.source.claims, ...item.target.claims, ...item.pairs.flatMap(pair => [...pair.commonAncestors, ...pair.containment])];
    for (const id of supporting) {
      const record = store.get(id);
      const claim = record.kind === 'group' ? store.get(record.claim) : record;
      if (claim.kind !== 'claim') continue;
      organizationEvidence.set(claim.id, claim);
      const context = store.get(claim.context);
      if (context.kind !== 'claim-context') continue;
      organizationEvidence.set(context.id, context);
      for (const id of context.evidence) {
        const evidence = store.get(id);
        if (evidence.kind === 'repository-region' || evidence.kind === 'repository-artifact' || evidence.kind === 'source-evidence') organizationEvidence.set(id, evidence);
      }
    }
  }
  const limitations: string[] = [...dependencyLimitations,
    'Dependency direction: a parent depends directly on a child. Roots are structural, not entry points or importance.',
    'Re-exports only is a syntax property, not a barrel, API, purity, or safe-collapse claim.',
    'Repository-layout labels compare all applicable occurrence endpoint placements: same-group means equal groups; into-descendants means a strict organization descendant; outward means outside the source group and its descendants.',
    'Variation labels preserve different established answers; unestablished organization is not a policy failure. Repository layout establishes no dependency policy or architectural violation.',
    'Generated handles are navigation cues; exact names and snapshot-scoped Entity IDs retain their established meanings.'];
  if (projection.lens === 'dependency-parents') limitations.push('A request without an established child cannot be attributed to the selected module and therefore cannot produce a parent result.');
  const sourcePriority = (item: typeof sourceItems[number]) => projection.nonEdgeRequests.includes(item.subject) ? 0
    : projection.coverage.includes(item.subject) ? 1 : item.role === 'target' ? 3 : 2;
  sourceItems.sort((a, b) => sourcePriority(a) - sourcePriority(b));
  const result: QualifiedDependencyView = {
    schema: 'postcode-dependency-view/0-experimental',
    id: recordId(projection.snapshot, 'dependency-view', { method: methods.presentation, projection: projection.id, presentation }),
    projection: { id: projection.id, snapshot: projection.snapshot, lens: projection.lens, subject: projection.subject, parameters: projection.parameters, selection: projection.selection },
    presentation: { ...presentation, expansions: [...new Set(projection.expansions.moduleEvaluations.flatMap(id => {
      const outcome = store.get(id); return outcome.kind === 'evaluation' && outcome.requirement !== 'modules' ? [outcome.requirement] : [];
    })), ...(expanded ? ['repository-layout'] : [])] },
    evaluations: { modules: state(basis), dependencies: state(evaluation), organization: expanded ? state(expanded) : null },
    qualifications: projection.contexts.map(qualification), limitations, modules, subjects: projection.subjects, relationships, graph,
    requestResults, recognitionCoverage,
    summary: { modules: projection.modules.length, discoveredModules: basis.modules.length, projectModules: basis.modules.filter(id => { const entity = store.get(id); if (entity.kind !== 'module') return false; const claim = store.get(entity.claim); return claim.kind === 'claim' && claim.information.type === 'module' && claim.information.discoveryFacets.includes('project'); }).length, relationships: projection.relationships.length,
      requestsWithoutEdges: count(projection.nonEdgeRequests, 'targetStatus'), recognitionCoverage: count(projection.coverage, 'outcome') },
    display: { rows, omittedModules: projection.modules.length - modules.length, omittedRelationships: projection.relationships.length - relationships.length,
      omittedOccurrences: relationships.reduce((sum, edge) => sum + edge.omittedOccurrences, 0),
      omittedRequestResults: projection.nonEdgeRequests.length - requestResults.length,
      omittedCoverageOutcomes: projection.coverage.length - recognitionCoverage.length, prunedComponents: rows.filter(row => row.pruned).length },
    ...(presentation.sourceDetail ? { sourceDetail: { level: 'dependency-occurrences-and-organization-evidence' as const,
      notice: 'Explicit source escape: captured source and organization evidence only; files are not reread.',
      items: sourceItems.slice(0, 100), omittedEvidence: Math.max(0, sourceItems.length - 100),
      organization: boundedOrganization, organizationEvidence: [...organizationEvidence.values()].slice(0, 100),
      omittedOrganizationEvidence: Math.max(0, organizationEvidence.size - 100), omittedOrganizationClaims: Math.max(0, sourceOrganization.length - 50) } } : {}),
  };
  return result;
}

export function renderDependencyView(view: QualifiedDependencyView): string {
  if (view.presentation.format === 'json') return `${JSON.stringify(view, null, 2)}\n`;
  const counted = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`;
  const modules = new Map(view.modules.map(module => [module.id, module]));
  const label = (id: RecordId, annotation = true) => {
    const module = modules.get(id);
    return module ? `${inlineText(module.name ?? module.handle)} (${module.entityId})${module.opaque ? ' · opaque external' : ''}${annotation ? compositionAnnotation(module.composition) : ''}` : '[module omitted]';
  };
  const edgeText = (edge: EdgeView) => `${label(edge.parent, false)} → ${label(edge.child, false)}${edge.typeOnly ? ' · type-only' : ''} · ${edge.mechanisms.join(', ')}${edge.organization ? ` · ${edge.organization.classification ?? 'organization not established'}` : ''}`;
  const lines = [`Module dependency ${view.projection.lens === 'dependency-structure' ? 'structure' : view.projection.lens === 'dependency-children' ? 'children' : 'parents'}`,
    `Snapshot ${view.projection.snapshot}`, 'Direction: dependency parent → dependency child (depends directly on).',
    `${counted(view.summary.modules, 'module')} in this projection · ${counted(view.summary.relationships, 'direct relationship')}`,
    `Materialized population: ${counted(view.summary.projectModules, 'project module')}; ${counted(view.summary.discoveredModules, 'discovered module')} available for exact lookup.`,
    'Analysis outcomes below describe supported source requests, not complete runtime behavior.',
    `Display bounds: ${counted(view.display.omittedModules, 'module')} and ${counted(view.display.omittedRelationships, 'relationship')} omitted; ${counted(view.display.prunedComponents, 'further descent')} pruned.`];
  for (const [name, outcome] of Object.entries(view.evaluations)) if (outcome) lines.push(`${name}: ${outcome.availability}, ${outcome.execution}, materialization ${outcome.materialization}${outcome.reason ? ` · ${inlineText(outcome.reason)}` : ''}`);
  if (view.projection.parameters.selector !== null) {
    lines.push(`${view.projection.selection.matches} exact ${view.projection.selection.matches === 1 ? 'match' : 'matches'} · ${view.projection.selection.referenceStatus}`);
    for (const subject of view.subjects) lines.push(`Selected: ${label(subject)}`);
  }
  if (view.graph) {
    lines.push('', view.graph.rootsEstablished ? 'Dependency roots and direct structure (root components have no incoming project relationships from outside the component)' : 'Known components; roots not established');
    for (const row of view.display.rows) {
      const component = view.graph.components[row.component]!;
      const indent = '  '.repeat(row.depth);
      lines.push(`${indent}◆ ${component.cyclic ? 'Cycle grouping (not an entity): ' : ''}${component.members.map(id => label(id)).join(', ')}${row.reference ? ' · reference (already expanded)' : ''}${row.pruned ? ' · further descent pruned at display depth' : ''}`);
      if (!row.reference) for (const edge of view.relationships.filter(edge => component.members.includes(edge.parent))) lines.push(`${indent}  ${edgeText(edge)}`);
    }
    if (!view.graph.components.length) lines.push(view.graph.rootsEstablished ? 'No project modules.' : 'No project modules materialized.');
  } else {
    lines.push('', 'Established direct relationships');
    for (const edge of view.relationships) lines.push(`  ${edgeText(edge)}`);
    if (!view.relationships.length) lines.push(view.projection.lens === 'dependency-children' && view.modules.some(module => view.subjects.includes(module.id) && module.opaque)
      ? '  External interiors are opaque; an empty child set is not established.'
      : !view.subjects.length ? '  No selected module.' : (full(view.evaluations.dependencies) && full(view.evaluations.modules)) ? '  None in the supported project-owned request population.' : '  None materialized; dependency evaluation is incomplete.');
  }
  if (!view.graph) for (const module of view.modules.filter(module => module.composition.claims.length)) lines.push(`Module property: ${label(module.id, false)} · re-exports only`);
  if (view.projection.lens !== 'dependency-parents') {
    lines.push('', 'Source-owned request results without edges');
    for (const [status, count] of Object.entries(view.summary.requestsWithoutEdges)) lines.push(`  ${status}: ${count}`);
    if (!Object.keys(view.summary.requestsWithoutEdges).length) lines.push((full(view.evaluations.dependencies) && full(view.evaluations.modules)) ? '  None in supported coverage.' : '  None materialized; evaluation is incomplete.');
    for (const [index, item] of view.requestResults.entries()) lines.push(`  Request ${index + 1}: ${item.mechanism} · ${item.targetStatus}${item.typeOnly ? ' · type-only' : ''}`);
    lines.push('', 'Recognition-coverage outcomes (not recognized occurrences)');
    for (const [outcome, count] of Object.entries(view.summary.recognitionCoverage)) lines.push(`  ${outcome}: ${count}`);
    for (const [index, item] of view.recognitionCoverage.entries()) lines.push(`  Coverage ${index + 1}: ${item.outcome}${item.owner && modules.has(item.owner) ? ` · ${label(item.owner, false)}` : item.owner ? ' · owner omitted from this view' : ' · owner not established'}`);
    if (!Object.keys(view.summary.recognitionCoverage).length) lines.push('  No recorded coverage outcomes; bounded recognition still applies.');
  }
  if (view.sourceDetail) {
    lines.push('', 'SOURCE DETAIL — explicit source escape', view.sourceDetail.notice);
    for (const item of view.sourceDetail.items) {
      const source = item.evidence;
      const request = view.requestResults.findIndex(result => result.id === item.subject);
      const coverage = view.recognitionCoverage.findIndex(result => result.id === item.subject);
      lines.push(`  ${request >= 0 ? `Request ${request + 1}` : coverage >= 0 ? `Coverage ${coverage + 1}` : item.role}: ${inlineText(source.path)}${source.location.association === 'span' ? `:${source.location.from.line}:${source.location.from.column}` : ''}`);
      if (source.location.association === 'span') lines.push(`    ${inlineText(source.location.excerpt.text)}${source.location.excerpt.omittedCharacters ? ` … ${counted(source.location.excerpt.omittedCharacters, 'character')} omitted` : ''}`);
      if (source.dependencyResolution) lines.push(`    ${source.dependencyResolution.status} · ${source.dependencyResolution.targetBasis} · ${source.dependencyResolution.mode} · target file: ${inlineText(source.dependencyResolution.resolvedFile ?? '(none)')}`);
    }
    for (const claim of view.sourceDetail.organization) lines.push(`  Organization evidence: ${claim.information.classification ?? 'not established'} · ${counted(claim.information.occurrences.length, 'occurrence')} · ${counted(claim.information.occurrences.reduce((sum, item) => sum + item.pairs.length, 0), 'placement comparison')}; bounded captured support in JSON source detail.`);
    for (const evidence of view.sourceDetail.organizationEvidence) {
      if (evidence.kind === 'repository-region') lines.push(`  Organization region: ${inlineText(evidence.path || '[repository root]')}`);
      if (evidence.kind === 'repository-artifact') lines.push(`  Organization artifact: ${inlineText(evidence.artifact.path)}`);
    }
    lines.push(`  Source omissions: ${counted(view.sourceDetail.omittedEvidence, 'evidence record')} · ${counted(view.sourceDetail.omittedOrganizationClaims, 'organization claim')} · ${counted(view.sourceDetail.omittedOrganizationEvidence, 'organization evidence record')} · ${counted(view.sourceDetail.organization.reduce((sum, claim) => sum + claim.omittedOccurrences, 0), 'organization occurrence')}.`);
  }
  lines.push('', 'Display', `  ${counted(view.display.omittedModules, 'module')} omitted · ${counted(view.display.omittedRelationships, 'relationship')} omitted · ${counted(view.display.prunedComponents, 'descent')} pruned`,
    `  ${counted(view.display.omittedOccurrences, 'supporting occurrence')} omitted · ${counted(view.display.omittedRequestResults, 'request result')} summarized/omitted · ${counted(view.display.omittedCoverageOutcomes, 'recognition outcome')} summarized/omitted`,
    '  Display bounds do not reduce analysis coverage.', '', 'Qualifications', ...view.limitations.map(item => `  ${item}`));
  for (const code of new Set(view.qualifications.flatMap(context => context.diagnostics.map(item => item.code)))) lines.push(`  Encountered TypeScript diagnostic: TS${code}`);
  if (view.presentation.navigation || view.presentation.dependencyNavigation) lines.push('', 'Navigation evaluates current inputs afresh. Scoped selectors reject snapshot mismatches; source detail uses evidence captured in the new invocation.');
  if (view.presentation.navigation) lines.push('', 'Next · inspect a module:', view.presentation.navigation.inspect);
  if (view.presentation.dependencyNavigation) lines.push('', 'Next · dependency children:', view.presentation.dependencyNavigation.children, '', 'Next · dependency parents:', view.presentation.dependencyNavigation.parents, '', 'Next · fresh evaluation with request and organization source detail (view-local Request/Coverage numbers are not entity selectors):', view.presentation.dependencyNavigation.source);
  return `${lines.join('\n')}\n`;
}

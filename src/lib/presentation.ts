import { answerIdentity, answerDisplay, answerLines, continuationLines } from './answer-presentation.js';
import type { AnswerContext, AnswerDisplay } from './answer-presentation.js';
import { documentationLabel, documentationLines, documentationNotice, presentDocumentation } from './documentation-view.js';
import { exportRoles, exportRoutes } from './export-view.js';
import type { Documentation } from './documentation-view.js';
import { validatePresentationContent, presentationChanges } from './presentation-contracts.js';
import type { PresentedOptions } from './presentation-contracts.js';
import { lookupDescription, lookupQualifications, resolutionContextIdentity } from './resolution-context.js';
import type { ResolutionContext } from './resolution-context.js';
import { resolveModuleProjection } from './module-content.js';
import type { DocumentationContent, ModuleProjectionContent } from './module-content.js';
import { presentQualification } from './qualification-view.js';
import type { QualifiedRecord } from './projection-content.js';
import { renderAssociatedInvestigations } from './investigation/associations.js';
import type { AssociatedInvestigations } from './investigation/associations.js';
import { displayWidth, layoutText, padDisplay } from './terminal-layout.js';
import { moduleLimitations, isCompositionContext } from './qualification-policy.js';
import { completedMaterialization } from './evaluation-state.js';
import { compositionView, compositionAnnotation } from './composition-view.js';
import type { CompositionView } from './composition-view.js';
import { inlineText, terminalText } from './terminal-text.js';
import { identityReference, methods, recordId } from './identity.js';
import { moduleStandardExpansions } from './records.js';
import type { Claim, ClaimContextRecord, EvaluationRecord, ExportClaim, ModuleClaim, ModuleExpansion, ProgramRecordStore, RecordId, SessionRecord, SourceEvidenceRecord, SymbolClaim } from './records.js';

export interface Presentation {
  readonly format: 'unicode' | 'json';
  readonly sourceDetail: boolean;
}

export function presentationRequirements(_presentation: Presentation): readonly ModuleExpansion[] {
  return moduleStandardExpansions;
}

type Qualification = Omit<ClaimContextRecord, 'kind' | 'evidence' | 'inputs'>;
type ExportView = ExportClaim['information'] & {
  id: RecordId; qualification: Qualification;
  originHandle: string | null; originEntityId: string | null;
  symbolInformation: SymbolClaim['information'] | null;
  documentation: Documentation[]; omittedDocumentation: number;
};

export interface QualifiedView extends AnswerDisplay {
  readonly investigations?: AssociatedInvestigations;
  readonly schema: 'postcode-view/1-experimental';
  readonly id: RecordId;
  readonly resolution?: ResolutionContext;
  readonly title: string;
  readonly projection: Pick<ModuleProjectionContent['projection'], 'id' | 'session' | 'lens' | 'subject' | 'parameters' | 'selection'>;
  readonly presentation: PresentedOptions & { readonly expansions: readonly ModuleExpansion[] };
  readonly analysis: SessionRecord['analysis'] | null;
  readonly qualifications: readonly Qualification[];
  readonly evaluations: readonly Pick<EvaluationRecord, 'id' | 'requirement' | 'modules' | 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason' | 'cost'>[];
  readonly modules: readonly {
    id: RecordId; entityId: string; name: string | null; handle: string; handleStatus: string; handleProvenance: ModuleClaim['information']['handleProvenance']; discoveryFacets: readonly string[];
    composition: CompositionView; qualification: Qualification; documentation: Documentation[]; omittedDocumentation: number;
    exports: ExportView[]; omittedExports: number;
  }[];
  readonly display: {
    readonly collapsedModules: number;
    readonly omittedExports: number;
    readonly modulesWithOmittedDocumentation: number;
    readonly collapsedQualifications: readonly { readonly handle: string; readonly contexts: readonly Qualification[] }[];
  };
  readonly sourceDetail?: { readonly level: 'declaration-locations-and-excerpts'; readonly notice: string;
    readonly items: readonly { readonly label: string; readonly module: RecordId; readonly subject: RecordId; readonly role: 'module' | 'export' | 'symbol' | 'documentation'; readonly association?: Documentation['association']; readonly claims: readonly RecordId[]; readonly evidence: readonly SourceEvidenceRecord[] }[] };
}

/** Coordination preserves population-wide reference allocation independently of display bounds. */
export function createView(store: ProgramRecordStore, projection: ModuleProjectionContent['projection'], presentation: PresentedOptions, title: string, resolution?: ResolutionContext, content = resolveModuleProjection(store, projection), context: AnswerContext = {}): QualifiedView {
  const population = store.entityIds(content.discovery.modules, 'module');
  const ids = new Map([...population, ...store.entityIds(projection.modules, 'module')]);
  return arrangeModuleView(content, ids, presentation, title, resolution, { ...context, answerReference: context.answerReference ?? store.answerIds([projection.id]).get(projection.id)! });
}

/** Fixed family Presentation policy over population versus selected-subject content. */
function moduleDisplayPolicy(subject: ModuleProjectionContent['projection']['subject'], presentation: Presentation) {
  const layout = subject === 'configured-project' ? 'table' : 'cards';
  const compact = presentation.format === 'unicode' && layout === 'table';
  return { layout, collapseExternal: compact, source: layout === 'cards', detailedDocumentation: layout === 'cards',
    exports: compact ? 3 : layout === 'cards' ? 50 : 6,
    projectDocumentation: compact ? 0 : layout === 'cards' ? 3 : 1,
    externalDocumentation: layout === 'cards' ? 3 : 0 };
}

/** Pure presentation of an already selected answer. No store, acquisition or reference allocation. */
export function arrangeModuleView(content: ModuleProjectionContent, entityIds: ReadonlyMap<RecordId, string>, presentation: PresentedOptions, title: string, resolution?: ResolutionContext, context: AnswerContext = {}): QualifiedView {
  validatePresentationContent({ contract: 'modules', value: content });
  const { projection, session } = content;
  const policy = moduleDisplayPolicy(projection.subject, presentation);
  if (presentation.sourceDetail && !policy.source) throw new Error('Source detail requires selected module content');
  const displayedClaims = new Map<RecordId, QualifiedRecord<Claim>>();
  type SourceGroup = Omit<NonNullable<QualifiedView['sourceDetail']>['items'][number], 'evidence'>;
  const sourceGroups = new Map<string, SourceGroup>();
  const sourceGroup = (group: Omit<SourceGroup, 'claims'>, claims: readonly QualifiedRecord<Claim>[]) => {
    const key = JSON.stringify([group.module, group.subject, group.role, group.association]);
    sourceGroups.set(key, { ...group, claims: [...new Set([...(sourceGroups.get(key)?.claims ?? []), ...claims.map(claim => claim.record.id)])] });
    for (const claim of claims) displayedClaims.set(claim.record.id, claim);
  };
  const documentation = (associations: readonly DocumentationContent[], maximumDocs: number, label: string, module: RecordId, subject: RecordId) =>
    presentDocumentation(associations, maximumDocs, presentation, policy.detailedDocumentation, association =>
      sourceGroup({ label: `Documentation for ${label}`, module, subject, role: 'documentation', association: association.record.information.association }, [association]));
  const modules = content.modules.map(module => {
    const { id, claim: supported } = module, claim = supported.record;
    const maximumDocs = claim.information.discoveryFacets.includes('project') ? policy.projectDocumentation : policy.externalDocumentation;
    const sourceLabel = `${claim.information.handle} (${entityIds.get(id)!})`;
    sourceGroup({ label: `Module ${sourceLabel}`, module: id, subject: id, role: 'module' }, [supported]);
    const composition = compositionView(module.composition);
    for (const property of module.composition.claims) {
      sourceGroup({ label: `Composition ${sourceLabel}`, module: id, subject: id, role: 'module' }, [property]);
    }
    const maximumExports = policy.exports;
    const exports = module.exports.slice(0, maximumExports).map(item => {
      const exported = item.claim.record;
      sourceGroup({ label: `Export ${exported.information.exportedName}`, module: id, subject: exported.id, role: 'export' }, [item.claim]);
      if (item.symbol) sourceGroup({ label: `Defining source for ${exported.information.exportedName}`, module: id, subject: exported.id, role: 'symbol' }, [item.symbol]);
      return { ...exported.information, id: exported.id, qualification: presentQualification(item.claim.context), symbolInformation: item.symbol?.record.information ?? null,
        originHandle: item.origin?.record.information.handle ?? null, originEntityId: exported.information.origin ? entityIds.get(exported.information.origin) ?? null : null,
        ...documentation(item.documentation, maximumDocs, `${exported.information.exportedName} · ${sourceLabel}`, id, exported.id) };
    });
    const moduleDocumentation = documentation(module.documentation, maximumDocs, `module ${sourceLabel}`, id, id);
    const shownDocumentation = [...moduleDocumentation.documentation, ...exports.flatMap(exported => exported.documentation)];
    const shownIds = new Set(shownDocumentation.map(doc => doc.id));
    const omittedDocumentationInModule = module.documentationIds.some(id => !shownIds.has(id))
      || shownDocumentation.some(doc => doc.omittedTextCharacters > 0 || doc.omittedTags > 0 || doc.tags.some(tag => tag.omittedTextCharacters > 0));
    return { id, composition, entityId: entityIds.get(id)!, ...claim.information, qualification: presentQualification(supported.context), ...moduleDocumentation, omittedDocumentationInModule,
      exports, omittedExports: module.exports.length - exports.length };
  }).sort((left, right) => Number(right.discoveryFacets.includes('project')) - Number(left.discoveryFacets.includes('project')));
  const evaluations = content.evaluations.map(({ id, requirement, modules, applicability, availability, execution, materialization, reason, cost }) =>
    ({ id, requirement, modules, applicability, availability, execution, materialization, reason, cost }));
  const contexts = content.contexts.map(item => presentQualification(item.context));
  const contextsByScope = new Map<Qualification['scope'], Qualification[]>();
  for (const context of contexts) {
    const bucket = contextsByScope.get(context.scope) ?? [];
    bucket.push(context); contextsByScope.set(context.scope, bucket);
  }
  const collapsed = policy.collapseExternal ? modules.filter(module => !module.discoveryFacets.includes('project')) : [];
  const listed = policy.collapseExternal ? modules.filter(module => module.discoveryFacets.includes('project')) : modules;
  return {
    ...answerDisplay(context), schema: 'postcode-view/1-experimental', id: recordId(projection.session, 'view', { projection: identityReference(projection.session, projection.id), presentation, title, resolution: resolutionContextIdentity(projection.session, resolution), method: methods.presentation, ...answerIdentity(context) }),
    title,
    ...(resolution ? { resolution } : {}),
    projection: { id: projection.id, session: projection.session, lens: projection.lens, subject: projection.subject,
      parameters: projection.parameters, selection: projection.selection },
    presentation: { ...presentation, expansions: projection.expansions.requested },
    analysis: session.analysis ?? null,
    qualifications: contexts, evaluations, modules: listed.map(({ omittedDocumentationInModule: _omittedDocumentation, ...module }) => module),
    display: { collapsedModules: collapsed.length,
      omittedExports: listed.reduce((count, module) => count + module.omittedExports, 0),
      modulesWithOmittedDocumentation: listed.filter(module => module.omittedDocumentationInModule).length,
      collapsedQualifications: collapsed.map(module => ({ handle: module.handle, contexts: contextsByScope.get(module.id) ?? [] })) },
    ...(presentation.sourceDetail ? { sourceDetail: {
      level: 'declaration-locations-and-excerpts' as const,
      notice: 'Source locations and bounded excerpts supporting displayed claims only. Module source files are listed without full-file excerpts. Range ends are exclusive; ↪ marks a wrapped source line.',
      items: [...sourceGroups.values()].map(group => {
        const evidence = new Map<string, SourceEvidenceRecord>();
        for (const id of group.claims) {
          const claim = displayedClaims.get(id)!;
          for (const record of claim.evidence) {
            if (record.kind !== 'source-evidence') throw new Error('Expected source evidence');
            // Resolution occurrences are not a module's declaration association.
            if (claim.record.information.type === 'module' && record.resolution) continue;
            evidence.set(JSON.stringify([record.path, record.start, record.length]), record);
          }
        }
        return { ...group, evidence: [...evidence.values()] };
      }),
    } } : {}),
  };
}

/** Rendering and fit checks share terminal cell widths and grapheme boundaries. */
function wrapText(text: string, indent: string, width = 88, continuation = indent): string[] {
  const result = layoutText(text, indent, width, continuation);
  return [...result.lines, ...(result.omittedCharacters
    ? [`${indent}… ${result.omittedCharacters} character(s) omitted because indivisible display text exceeds the available width.`] : [])];
}

export function renderUnicode(view: QualifiedView): string {
  const selection = view.projection.selection;
  const inventory = moduleDisplayPolicy(view.projection.subject, view.presentation).layout === 'table';
  const lines = [`${inlineText(view.title)} · configured TypeScript project`,
    `Session ${view.projection.session.replace(/^session:/, '')}`,
    inventory ? `${selection.population} module${selection.population === 1 ? '' : 's'} found · ${view.modules.length} listed${view.display.collapsedModules ? ` · ${view.display.collapsedModules} external module${view.display.collapsedModules === 1 ? '' : 's'} collapsed` : ''}`
      : `${selection.matches} module${selection.matches === 1 ? '' : 's'} selected from ${selection.population}${lookupDescription(view.resolution, selection.matches) ? ` · ${lookupDescription(view.resolution, selection.matches)}` : ''}`];
  lines.push(...answerLines(view), ...continuationLines(view), ...presentationChanges(view.presentation), ...lookupQualifications(view.resolution));
  if (selection.outsidePopulation?.length) lines.push('Identified subjects are outside the supplied evaluation population; their detail is unavailable in this answer.');
  if (!selection.populationEstablished) lines.push('Module population is not established.');
  const outcomeGroups = new Map<string, number>();
  for (const outcome of view.evaluations) {
    const label = `${outcome.requirement}: ${outcome.execution}, materialization ${outcome.materialization}${outcome.applicability !== 'applicable' ? `, ${outcome.applicability}` : ''}${outcome.availability !== 'available' ? `, ${outcome.availability}` : ''}${outcome.reason ? ` — ${inlineText(outcome.reason)}` : ''}`;
    outcomeGroups.set(label, (outcomeGroups.get(label) ?? 0) + 1);
  }
  const complete = view.evaluations.length > 0 && view.evaluations.every(outcome => outcome.applicability === 'applicable'
    && outcome.availability === 'available' && completedMaterialization(outcome));
  if (complete) lines.push(`Analysis complete: ${[...new Set(view.evaluations.map(outcome => outcome.requirement))].join(', ')}`);
  else for (const [label, count] of outcomeGroups) lines.push(`Analysis ${label} (${count} scope${count === 1 ? '' : 's'})`);
  const contextsByScope = new Map<Qualification['scope'], Qualification[]>();
  for (const context of view.qualifications) {
    const bucket = contextsByScope.get(context.scope) ?? [];
    bucket.push(context); contextsByScope.set(context.scope, bucket);
  }
  const establishedExportModules = new Set(view.evaluations.flatMap(outcome => outcome.requirement === 'exports'
    && outcome.availability === 'available' && outcome.applicability === 'applicable' && completedMaterialization(outcome) ? outcome.modules : []));
  const projectContexts = contextsByScope.get('configured-project') ?? [];
  const sharedLimitations = new Set(projectContexts.flatMap(context => context.limitations));
  const sharedDiagnostics = new Set(projectContexts.flatMap(context => context.diagnostics.map(diagnostic => diagnostic.code)));
  const local = (contexts: readonly Qualification[], indent: string) => {
    for (const limitation of new Set(contexts.flatMap(context => context.limitations))) {
      if (!sharedLimitations.has(limitation)) lines.push(`${indent}Limitation: ${inlineText(limitation)}`);
    }
    for (const code of new Set(contexts.flatMap(context => context.diagnostics.map(diagnostic => diagnostic.code)))) {
      if (!sharedDiagnostics.has(code)) lines.push(`${indent}Encountered TypeScript diagnostic: TS${code}`);
    }
  };
  let documentationDisplayed = false;
  let relationshipsDisplayed = false;
  const docs = (items: readonly Documentation[], omitted: number, indent: string) => {
    documentationDisplayed ||= items.length > 0;
    lines.push(...documentationLines(items, omitted, indent));
  };
  const exceptions = (exported: ExportView, moduleId: RecordId): string[] => {
    const details = exportRoutes(exported);
    if (details.length || exported.origin !== moduleId) relationshipsDisplayed = true;
    if (!exported.routes.length) details.push('route unavailable');
    if (exported.origin !== moduleId) details.push(exported.origin ? `origin: ${inlineText(exported.originHandle ?? 'anonymous')} (${exported.originEntityId ?? 'identity unavailable'})` : 'origin not established');
    if (exported.symbolInformation && exported.symbolInformation.declarationCount !== 1) details.push(`${exported.symbolInformation.declarationCount} contributing declarations`);
    return details;
  };
  const commonFacets = view.modules[0]?.discoveryFacets.filter(facet => view.modules.every(module => module.discoveryFacets.includes(facet))) ?? [];
  const allAnonymous = view.modules.length > 0 && view.modules.every(module => module.name === null);
  const handleWidth = Math.min(30, Math.max(6, ...view.modules.map(module => displayWidth(inlineText(module.handle)))));
  const idWidth = Math.max(9, ...view.modules.map(module => module.entityId.length));
  if (view.modules.length) {
    const projectSelection = commonFacets.includes('project');
    const ordinary = projectSelection && commonFacets.includes('implementation-available') && view.modules.every(module => module.discoveryFacets.every(facet => facet === 'project' || facet === 'implementation-available'));
    const facets = commonFacets.filter(facet => facet !== 'project' && (!ordinary || facet !== 'implementation-available'));
    lines.push('', `${inventory ? 'Project modules' : projectSelection ? 'Selected project modules' : 'Selected modules'} · ${view.modules.length}${allAnonymous ? ' · TypeScript names not established' : ''}${facets.length ? ` · ${facets.join(', ')}` : ''}`);
    if (inventory) lines.push('', `${'Handle'.padEnd(handleWidth)}  ${'Entity ID'.padEnd(idWidth)}  Export names`);
  }
  for (const module of view.modules) {
    if (!inventory) lines.push('', `◆ ${inlineText(module.handle)}${allAnonymous ? '' : ` · ${inlineText(module.name ?? '[anonymous]')}`}`);
    const facets = module.discoveryFacets.filter(facet => !commonFacets.includes(facet));
    if (!inventory) {
      if (facets.length) lines.push(`  ${facets.join(', ')}`);
      if (compositionAnnotation(module.composition)) lines.push(`  ${compositionAnnotation(module.composition).slice(3)}`);
      lines.push(`  Entity ID: ${module.entityId}`);
    }
    const total = module.exports.length + module.omittedExports;
    const established = establishedExportModules.has(module.id);
    if (inventory) {
      const names = module.exports.map(exported => inlineText(exported.exportedName));
      if (module.omittedExports) names.push(`+${module.omittedExports}`);
      const cue = total ? names.join(', ') : established ? '(none)' : '(not established; no exports displayed)';
      lines.push(`${padDisplay(inlineText(module.handle), handleWidth)}  ${module.entityId.padEnd(idWidth)}  ${cue}${compositionAnnotation(module.composition)}${total && !established ? ' (materialized; surface incomplete)' : ''}`);
      if (!allAnonymous) lines.push(`  TypeScript name: ${inlineText(module.name ?? '(not established)')}`);
      if (facets.length) lines.push(`  ${facets.join(', ')}`);
    } else {
      docs(module.documentation, module.omittedDocumentation, '  ');
      lines.push('', '  Exports:');
      if (!total) lines.push(established ? '    (none)' : '    Not established; no exports displayed.');
      for (const exported of module.exports) {
        const details = exceptions(exported, module.id);
        lines.push(`  ├─ ${inlineText(exported.exportedName)} [${exportRoles(exported)}]${details.length ? ` · ${details.join('; ')}` : ''}`);
        if (exported.symbolInformation?.name && exported.symbolInformation.name !== exported.exportedName) lines.push(`  │  Semantic symbol: ${inlineText(exported.symbolInformation.name)}`);
        docs(exported.documentation, exported.omittedDocumentation, '  │  ');
      }
      if (module.omittedExports) lines.push(`  … ${module.omittedExports} effective export(s) omitted.`);
    }

    local([...(contextsByScope.get(module.id) ?? []).filter(context => (!isCompositionContext(context) || module.composition.claims.length > 0
        || !module.composition.evaluations.some(outcome => completedMaterialization(outcome)))), ...module.exports.map(exported => exported.qualification)], '  ');
  }
  // Changes to this section or JSON source fields must stay aligned with
  // src/lib/source-disclosure.ts and test/source-disclosure.test.ts.
  if (view.sourceDetail) {
    lines.push('', 'SOURCE DETAIL — explicit source escape', ...wrapText(view.sourceDetail.notice, ''));
    const items = view.sourceDetail.items;
    const itemsBySubject = new Map<string, typeof items[number][]>();
    const subjectKey = (module: RecordId, subject: RecordId) => JSON.stringify([module, subject]);
    for (const item of items) {
      const key = subjectKey(item.module, item.subject), bucket = itemsBySubject.get(key) ?? [];
      bucket.push(item); itemsBySubject.set(key, bucket);
    }
    const key = (evidence: SourceEvidenceRecord) => JSON.stringify([evidence.path, evidence.start, evidence.length]);
    const showEvidence = (evidence: readonly SourceEvidenceRecord[], indent: string) => {
      for (const record of evidence) {
        const location = record.location;
        if (location.association === 'file') lines.push(`${indent}Source file: ${inlineText(record.path)}`);
        else {
          lines.push(`${indent}${inlineText(record.path)}:${location.from.line}:${location.from.column}–${location.to.line}:${location.to.column}`);
          lines.push(...wrapText(location.excerpt.text, `${indent}  `, 88, `${indent}  ↪ `));
          if (location.excerpt.omittedCharacters) lines.push(`${indent}  … ${location.excerpt.omittedCharacters} source character(s) omitted.`);
        }
      }
    };
    const sourceDocs = (module: RecordId, subject: RecordId, indent: string) => {
      const documentation = (itemsBySubject.get(subjectKey(module, subject)) ?? []).filter(item => item.role === 'documentation');
      for (const item of documentation) {
        lines.push(`${indent}${documentationLabel(item.association!, documentation.length > 1)}`);
        showEvidence(item.evidence, `${indent}  `);
      }
    };
    for (const module of view.modules) {
      lines.push('', `◆ ${inlineText(module.handle)}`, `  Entity ID: ${module.entityId}`);
      const association = (itemsBySubject.get(subjectKey(module.id, module.id)) ?? []).find(item => item.role === 'module');
      if (association) showEvidence(association.evidence, '  ');
      sourceDocs(module.id, module.id, '  ');
      lines.push('', '  Exports:');
      if (!module.exports.length) lines.push('    No displayed export source.');
      for (const exported of module.exports) {
        lines.push(`  ├─ ${inlineText(exported.exportedName)} [${exportRoles(exported)}]`);
        const defining = (itemsBySubject.get(subjectKey(module.id, exported.id)) ?? []).find(item => item.role === 'symbol')?.evidence ?? [];
        const definingKeys = new Set(defining.map(key));
        const forwarding = ((itemsBySubject.get(subjectKey(module.id, exported.id)) ?? []).find(item => item.role === 'export')?.evidence ?? []).filter(evidence => !definingKeys.has(key(evidence)));
        if (forwarding.length) {
          lines.push('  │  Export/forwarding source:');
          showEvidence(forwarding, '  │    ');
        }
        if (defining.length) {
          const remote = exported.origin !== module.id;
          lines.push(remote ? `  │  Defining source · ${inlineText(exported.symbolInformation?.name ?? exported.exportedName)} in ${inlineText(exported.originHandle ?? 'unestablished origin')}${exported.originEntityId ? ` (${exported.originEntityId})` : ''}:` : '  │  Source:');
          showEvidence(defining, '  │    ');
        }
        sourceDocs(module.id, exported.id, '  │  ');
      }
    }
  }
  if (documentationDisplayed) lines.push('', documentationNotice);
  if (relationshipsDisplayed) lines.push('', 'Export relationships describe aliases and forwarding, not calls or dependencies.');
  const omissions: string[] = [];
  if (view.display.collapsedModules) omissions.push(`${view.display.collapsedModules} external module${view.display.collapsedModules === 1 ? '' : 's'} and their details`);
  if (view.display.omittedExports) omissions.push(`${view.display.omittedExports} export${view.display.omittedExports === 1 ? '' : 's'} from listed modules`);
  if (inventory && view.display.modulesWithOmittedDocumentation) omissions.push(`documentation for ${view.display.modulesWithOmittedDocumentation} listed module${view.display.modulesWithOmittedDocumentation === 1 ? '' : 's'}`);
  if (omissions.length) lines.push('', 'Display', '  Omitted:', ...omissions.map(omission => `    ${omission}`), inventory ? '  Inspection shows detail; JSON lists all selected modules with bounded related detail.' : '  Displayed detail is bounded; JSON retains fuller context.');
  lines.push('', 'Status');
  if (view.analysis?.provider === 'typescript') {
    const exportsComplete = view.evaluations.filter(outcome => outcome.requirement === 'exports');
    const establishedExports = exportsComplete.length > 0 && exportsComplete.every(outcome => completedMaterialization(outcome) && outcome.availability === 'available' && outcome.applicability === 'applicable');
    lines.push(selection.outsidePopulation?.length ? '  Retained subject information is shown; membership and detail in the supplied evaluation are not established.' : selection.populationEstablished && establishedExports
      ? '  Module membership and effective exports established by TypeScript analysis.'
      : selection.populationEstablished ? exportsComplete.length === 0 ? '  Module membership established by TypeScript analysis.'
        : '  Module membership established by TypeScript analysis; export information is qualified by the capability states above.'
        : '  Displayed information is derived by TypeScript analysis; module population is not established.',
      '  Coverage: external-module SourceFiles and visible named ambient modules; other compiler module categories are not established.');
  } else for (const guarantee of new Set(projectContexts.map(context => context.guarantee))) lines.push(`  ${inlineText(guarantee)}`);
  for (const code of sharedDiagnostics) lines.push(`  Encountered TypeScript diagnostic: TS${code}`);
  const representedLimitations = view.analysis ? new Set<string>(Object.values(moduleLimitations)) : new Set<string>();
  const extraLimitations = [...sharedLimitations].filter(limitation => !representedLimitations.has(limitation));
  if (view.analysis || extraLimitations.length) {
    lines.push('', 'Run limitations');
    if (view.analysis?.excludedOutputLocations) lines.push(`  ${view.analysis.excludedOutputLocations} generated-output locations excluded by this run's input filter.`);
    if (view.analysis?.inputConsistency === 'first-observed') lines.push('  Inputs were memoized as first observed, not captured as an atomic filesystem snapshot.');
    for (const limitation of extraLimitations) lines.push(`  ${inlineText(limitation)}`);
  }
  for (const collapsed of view.display.collapsedQualifications) {
    const exceptional = collapsed.contexts.filter(context => context.limitations.some(limitation => !sharedLimitations.has(limitation))
      || context.diagnostics.some(diagnostic => !sharedDiagnostics.has(diagnostic.code)));
    if (exceptional.length) { lines.push(`- Collapsed ${inlineText(collapsed.handle)}:`); local(exceptional, '  '); }
  }
  lines.push('', 'Entity references belong to this session. One-shot queries accept exact names or handles.');
  return `${lines.map(terminalText).join('\n')}\n${renderAssociatedInvestigations(view.investigations)}`;
}

export function renderView(view: QualifiedView): string {
  return view.presentation.format === 'json' ? `${JSON.stringify(view, null, 2)}\n` : renderUnicode(view);
}

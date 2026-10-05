import { resolveModuleProjection } from './module-content.js';
import type { DocumentationContent, ModuleProjectionContent } from './module-content.js';
import { presentQualification } from './qualification-view.js';
import type { QualifiedRecord } from './projection-content.js';
import { renderAssociatedInvestigations } from './investigation/associations.js';
import type { AssociatedInvestigations } from './investigation/associations.js';
import { boundedText, codePointLength, displayWidth, fitText, layoutText, padDisplay } from './terminal-layout.js';
import { moduleLimitations, isCompositionContext } from './qualification-policy.js';
import { completedMaterialization } from './evaluation-state.js';
import { compositionView, compositionAnnotation } from './composition-view.js';
import type { CompositionView } from './composition-view.js';
import { inlineText, terminalText } from './terminal-text.js';
import { identityReference, methods, recordId } from './identity.js';
import { moduleStandardExpansions } from './records.js';
import type { Claim, ClaimContextRecord, EvaluationRecord, ExportClaim, ModuleClaim, ModuleExpansion, ProgramRecordStore, ProjectionRecord, RecordId, RecordedAssertion, SessionRecord, SourceEvidenceRecord, SymbolClaim } from './records.js';

export interface Presentation {
  readonly format: 'unicode' | 'json';
  readonly sourceDetail: boolean;
}

export function presentationRequirements(_presentation: Presentation): readonly ModuleExpansion[] {
  return moduleStandardExpansions;
}

type Qualification = Omit<ClaimContextRecord, 'kind' | 'evidence' | 'inputs'>;
type Documentation = Pick<RecordedAssertion, 'id' | 'status' | 'text'> & {
  omittedTextCharacters: number;
  tags: readonly { name: string; text: string; omittedTextCharacters: number }[];
  omittedTags: number;
  association: 'module' | 'origin-symbol' | 'export-alias'; qualification: Qualification;
};
type ExportView = ExportClaim['information'] & {
  id: RecordId; qualification: Qualification;
  originHandle: string | null; originEntityId: string | null;
  symbolInformation: SymbolClaim['information'] | null;
  documentation: Documentation[]; omittedDocumentation: number;
};

export interface QualifiedView {
  readonly investigations?: AssociatedInvestigations;
  readonly schema: 'postcode-view/1-experimental';
  readonly id: RecordId;
  readonly projection: Pick<ProjectionRecord, 'id' | 'session' | 'lens' | 'subject' | 'parameters' | 'selection'>;
  readonly presentation: Presentation & { readonly expansions: readonly ModuleExpansion[] };
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
export function createView(store: ProgramRecordStore, projection: ProjectionRecord, presentation: Presentation): QualifiedView {
  const content = resolveModuleProjection(store, projection);
  const ids = store.entityIds(content.discovery.modules, 'module');
  return arrangeModuleView(content, ids, presentation);
}

/** Pure presentation of an already selected answer. No store, acquisition or reference allocation. */
export function arrangeModuleView(content: ModuleProjectionContent, entityIds: ReadonlyMap<RecordId, string>, presentation: Presentation): QualifiedView {
  const { projection, session } = content;
  if (presentation.sourceDetail && projection.lens !== 'inspect') throw new Error('Source detail requires inspection');
  const compact = presentation.format === 'unicode' && projection.lens === 'modules';
  const displayedClaims = new Map<RecordId, QualifiedRecord<Claim>>();
  type SourceGroup = Omit<NonNullable<QualifiedView['sourceDetail']>['items'][number], 'evidence'>;
  const sourceGroups = new Map<string, SourceGroup>();
  const sourceGroup = (group: Omit<SourceGroup, 'claims'>, claims: readonly QualifiedRecord<Claim>[]) => {
    const key = JSON.stringify([group.module, group.subject, group.role, group.association]);
    sourceGroups.set(key, { ...group, claims: [...new Set([...(sourceGroups.get(key)?.claims ?? []), ...claims.map(claim => claim.record.id)])] });
    for (const claim of claims) displayedClaims.set(claim.record.id, claim);
  };
  const excerpt = (text: string, maximum: number) => boundedText(text, maximum, presentation.format === 'unicode');
  const documentation = (associations: readonly DocumentationContent[], maximumDocs: number, label: string, module: RecordId, subject: RecordId) => {
    const shown = associations.slice(0, maximumDocs);
    const items: Documentation[] = shown.map(({ association, assertion: supported }) => {
      const claim = association.record, assertion = supported.record;
      sourceGroup({ label: `Documentation for ${label}`, module, subject, role: 'documentation', association: claim.information.association }, [association]);
      const maximumTags = projection.lens === 'inspect' ? 20 : 5;
      // Keep source-oriented examples/links in the assertion record, outside normal conceptual excerpts.
      const prose = assertion.text.replace(/```[\s\S]*?```/g, '').trim();
      let proseExcerpt = excerpt(prose, projection.lens === 'inspect' ? 2000 : 400);
      let remainingLines = presentation.format === 'unicode' ? 8 : Infinity;
      if (Number.isFinite(remainingLines)) proseExcerpt = excerpt(prose, codePointLength(fitText(proseExcerpt.text, '', remainingLines)));
      remainingLines -= proseExcerpt.text ? wrapText(proseExcerpt.text, '       ').length : 0;
      const conceptualTags = assertion.tags.filter(tag => tag.name !== 'example' && tag.name !== 'see');
      const tags: Documentation['tags'][number][] = [];
      for (const tag of conceptualTags.slice(0, maximumTags)) {
        if (remainingLines <= 0) break;
        const bounded = excerpt(tag.text, 300);
        const text = Number.isFinite(remainingLines) ? fitText(bounded.text, `@${inlineText(tag.name)} `, remainingLines) : bounded.text;
        if (Number.isFinite(remainingLines) && wrapText(`@${inlineText(tag.name)} ${text}`, '       ').length > remainingLines) break;
        tags.push({ name: tag.name, text, omittedTextCharacters: codePointLength(tag.text) - codePointLength(text) });
        remainingLines -= wrapText(`@${inlineText(tag.name)} ${text}`, '       ').length;
      }
      return { id: assertion.id, status: assertion.status,
        text: proseExcerpt.text, omittedTextCharacters: codePointLength(assertion.text) - codePointLength(proseExcerpt.text),
        tags, omittedTags: assertion.tags.length - tags.length,
        association: claim.information.association, qualification: presentQualification(association.context) };
    });
    return { documentation: items, omittedDocumentation: associations.length - shown.length };
  };
  const modules = content.modules.map(module => {
    const { id, claim: supported } = module, claim = supported.record;
    const maximumDocs = compact ? 0 : projection.lens === 'inspect' ? 3 : claim.information.discoveryFacets.includes('project') ? 1 : 0;
    const sourceLabel = `${claim.information.handle} (${entityIds.get(id)!})`;
    sourceGroup({ label: `Module ${sourceLabel}`, module: id, subject: id, role: 'module' }, [supported]);
    const composition = compositionView(module.composition);
    for (const property of module.composition.claims) {
      sourceGroup({ label: `Composition ${sourceLabel}`, module: id, subject: id, role: 'module' }, [property]);
    }
    const maximumExports = compact ? 3 : projection.lens === 'inspect' ? 50 : 6;
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
  const collapsed = compact ? modules.filter(module => !module.discoveryFacets.includes('project')) : [];
  const listed = compact ? modules.filter(module => module.discoveryFacets.includes('project')) : modules;
  return {
    schema: 'postcode-view/1-experimental', id: recordId(projection.session, 'view', { projection: identityReference(projection.session, projection.id), presentation, method: methods.presentation }),
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
  const inventory = view.projection.lens === 'modules';
  const lines = [`${inventory ? 'Modules' : 'Inspect'} · configured TypeScript project`,
    `Session ${view.projection.session.replace(/^session:/, '')}`,
    inventory ? `${selection.population} module${selection.population === 1 ? '' : 's'} found · ${view.modules.length} listed${view.display.collapsedModules ? ` · ${view.display.collapsedModules} external module${view.display.collapsedModules === 1 ? '' : 's'} collapsed` : ''}`
      : `${selection.matches} module${selection.matches === 1 ? '' : 's'} selected from ${selection.population} · ${selection.matches === 0 ? 'no exact match' : selection.matches === 1 ? 'exact match' : 'exact matches'} for ${view.projection.parameters.reference ? '@' : ''}${inlineText(view.projection.parameters.selector ?? '')}${view.projection.parameters.reference ? ` · ${selection.referenceStatus}` : ''}`];
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
  const documentationLabel = (association: Documentation['association'], mixed: boolean) =>
    association === 'export-alias' ? 'Documentation from export alias:'
      : mixed && association === 'origin-symbol' ? 'Documentation from original symbol:' : 'Documentation:';
  const docs = (items: readonly Documentation[], omitted: number, indent: string) => {
    const associations = [...new Set(items.map(doc => doc.association))];
    for (const association of associations) {
      documentationDisplayed = true;
      lines.push(`${indent}${documentationLabel(association, associations.length > 1)}`);
      const contributions = items.filter(doc => doc.association === association);
      for (const [index, doc] of contributions.entries()) {
        if (index) lines.push(indent);
        if (doc.text) lines.push(...wrapText(doc.text, `${indent}  `));
        if (doc.omittedTextCharacters) lines.push(`${indent}  … ${doc.omittedTextCharacters} assertion character(s) omitted.`);
        for (const tag of doc.tags) lines.push(...wrapText(`@${inlineText(tag.name)} ${tag.text}${tag.omittedTextCharacters ? ` … (${tag.omittedTextCharacters} characters omitted)` : ''}`, `${indent}  `));
        if (doc.omittedTags) lines.push(`${indent}  … ${doc.omittedTags} structured tag(s) omitted (including source-oriented examples/links).`);
      }
    }
    if (omitted) lines.push(`${indent}… ${omitted} documentation assertion(s) omitted.`);
  };
  const roles = (exported: ExportView) => exported.roles
    ? [exported.roles.type ? 'type' : '', exported.roles.value ? 'value' : ''].filter(Boolean).join('+') || 'no type/value role'
    : 'roles unavailable';
  const exceptions = (exported: ExportView, moduleId: RecordId): string[] => {
    const details = [...new Set(exported.routes.filter(route => route.kind !== 'direct' && route.kind !== 'default' || route.aliased || route.typeOnly)
      .map(route => `${route.kind}${route.typeOnly ? ' (type-only)' : ''}`))];
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
        lines.push(`  ├─ ${inlineText(exported.exportedName)} [${roles(exported)}]${details.length ? ` · ${details.join('; ')}` : ''}`);
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
        lines.push(`  ├─ ${inlineText(exported.exportedName)} [${roles(exported)}]`);
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
  if (documentationDisplayed) lines.push('', 'Documentation entries are recorded assertions; truth, currency, and completeness are not established.');
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
    lines.push(selection.populationEstablished && establishedExports
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

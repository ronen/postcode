import { methods, moduleEntityIds, recordId } from './identity.js';
import { isModuleClaim, moduleStandardExpansions } from './records.js';
import type { Claim, ClaimContextRecord, EvaluationRecord, ExportClaim, ModuleClaim, ModuleExpansion, ProgramRecordStore, ProjectionRecord, RecordId, RecordedAssertion, SnapshotRecord, SourceEvidenceRecord, SymbolClaim } from './records.js';

export interface Presentation {
  readonly format: 'unicode' | 'json';
  readonly sourceDetail: boolean;
  /** Operational invocation context supplied by the CLI, not repository source evidence. */
  readonly navigation?: { readonly inspect: string };
}

export function presentationRequirements(_presentation: Presentation): readonly ModuleExpansion[] {
  return moduleStandardExpansions;
}

type Qualification = Omit<ClaimContextRecord, 'kind' | 'evidence'>;
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
  readonly schema: 'postcode-view/0-experimental';
  readonly id: RecordId;
  readonly projection: Pick<ProjectionRecord, 'id' | 'snapshot' | 'lens' | 'subject' | 'parameters' | 'selection'>;
  readonly presentation: Presentation & { readonly expansions: readonly ModuleExpansion[] };
  readonly analysis: SnapshotRecord['analysis'] | null;
  readonly qualifications: readonly Qualification[];
  readonly evaluations: readonly Pick<EvaluationRecord, 'id' | 'requirement' | 'modules' | 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason' | 'cost'>[];
  readonly modules: readonly {
    id: RecordId; entityId: string; name: string | null; handle: string; handleStatus: string; handleProvenance: ModuleClaim['information']['handleProvenance']; facets: readonly string[];
    qualification: Qualification; documentation: Documentation[]; omittedDocumentation: number;
    exports: ExportView[]; omittedExports: number;
  }[];
  readonly display: {
    readonly collapsedModules: number;
    readonly omittedExports: number;
    readonly modulesWithOmittedDocumentation: number;
    readonly collapsedQualifications: readonly { readonly handle: string; readonly contexts: readonly Qualification[] }[];
  };
  readonly sourceDetail?: { readonly level: 'declaration-locations'; readonly notice: string;
    readonly claims: readonly { readonly claim: RecordId; readonly evidence: readonly SourceEvidenceRecord[] }[] };
}

/** Assembles a bounded view from already-materialized records. Neither this nor rendering evaluates. */
export function createView(store: ProgramRecordStore, projection: ProjectionRecord, presentation: Presentation): QualifiedView {
  if (presentation.sourceDetail && projection.lens !== 'inspect') throw new Error('Source detail requires inspection');
  const snapshot = store.get(projection.snapshot);
  if (snapshot.kind !== 'snapshot') throw new Error('Expected analysis snapshot');
  const discovery = store.get(projection.evaluations[0]!);
  if (discovery.kind !== 'evaluation') throw new Error('Expected discovery evaluation');
  const entityIds = moduleEntityIds(discovery.modules);
  const qualification = (id: RecordId): Qualification => {
    const context = store.get(id);
    if (context.kind !== 'claim-context') throw new Error('Expected Claim context');
    const { kind: _kind, evidence: _evidence, ...conceptual } = context;
    return conceptual;
  };
  const expanded = projection.expansions.claims.map(id => store.get(id)).filter((record): record is Claim => record.kind === 'claim');
  const compact = presentation.format === 'unicode' && projection.lens === 'modules';
  const displayedClaims = new Map<RecordId, Claim>();
  const excerpt = (text: string, maximum: number) => {
    const characters = [...text];
    return { text: characters.slice(0, maximum).join(''), omittedTextCharacters: Math.max(0, characters.length - maximum) };
  };
  const documentation = (subjects: readonly RecordId[], maximumDocs: number) => {
    const associations = expanded.filter(record => record.information.type === 'documentation-association' && subjects.includes(record.subject));
    const shown = associations.slice(0, maximumDocs);
    const items: Documentation[] = shown.map(claim => {
      if (claim.information.type !== 'documentation-association') throw new Error('Expected documentation association');
      const assertion = store.get(claim.information.assertion);
      if (assertion.kind !== 'recorded-assertion') throw new Error('Expected recorded assertion');
      displayedClaims.set(claim.id, claim);
      const maximumTags = projection.lens === 'inspect' ? 20 : 5;
      // Keep source-oriented examples/links in the assertion record, outside normal conceptual excerpts.
      const prose = assertion.text.replace(/```[\s\S]*?```/g, '').trim();
      const proseExcerpt = excerpt(prose, projection.lens === 'inspect' ? 2000 : 400);
      const conceptualTags = assertion.tags.filter(tag => tag.name !== 'example' && tag.name !== 'see');
      return { id: assertion.id, status: assertion.status,
        text: proseExcerpt.text, omittedTextCharacters: [...assertion.text].length - [...proseExcerpt.text].length,
        tags: conceptualTags.slice(0, maximumTags).map(tag => ({ name: tag.name, ...excerpt(tag.text, 300) })),
        omittedTags: assertion.tags.length - Math.min(conceptualTags.length, maximumTags),
        association: claim.information.association, qualification: qualification(claim.context) };
    });
    return { documentation: items, omittedDocumentation: associations.length - shown.length };
  };
  const modules = projection.modules.map(id => {
    const entity = store.get(id);
    if (entity.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(entity.claim);
    if (!isModuleClaim(claim)) throw new Error('Expected module claim');
    // Keep the full population visible without letting external documentation dominate inventory.
    const maximumDocs = compact ? 0 : projection.lens === 'inspect' ? 3 : claim.information.facets.includes('project') ? 1 : 0;
    displayedClaims.set(claim.id, claim);
    const allExports = expanded.filter((record): record is ExportClaim => record.information.type === 'export' && record.subject === id);
    const allSubjects = new Set([id, ...allExports.map(exported => exported.id), ...allExports.flatMap(exported => exported.information.symbol ? [exported.information.symbol] : [])]);
    const allDocumentation = expanded.flatMap(record => record.information.type === 'documentation-association' && allSubjects.has(record.subject) ? [record.information.assertion] : []);
    const maximumExports = compact ? 3 : projection.lens === 'inspect' ? 50 : 6;
    const exports = allExports.slice(0, maximumExports).map(exported => {
      displayedClaims.set(exported.id, exported);
      let symbolInformation: SymbolClaim['information'] | null = null;
      if (exported.information.symbol) {
        const symbol = store.get(exported.information.symbol);
        if (symbol.kind !== 'symbol') throw new Error('Expected symbol');
        const symbolClaim = store.get(symbol.claim);
        if (symbolClaim.kind !== 'claim' || symbolClaim.information.type !== 'symbol') throw new Error('Expected symbol claim');
        symbolInformation = symbolClaim.information;
        displayedClaims.set(symbolClaim.id, symbolClaim);
      }
      const origin = exported.information.origin ? store.get(exported.information.origin) : null;
      const originClaim = origin?.kind === 'module' ? store.get(origin.claim) : null;
      const originHandle = originClaim && isModuleClaim(originClaim) ? originClaim.information.handle : null;
      return { ...exported.information, id: exported.id, qualification: qualification(exported.context), symbolInformation, originHandle, originEntityId: exported.information.origin ? entityIds.get(exported.information.origin) ?? null : null,
        ...documentation([exported.id, ...(exported.information.symbol ? [exported.information.symbol] : [])], maximumDocs) };
    });
    const moduleDocumentation = documentation([id], maximumDocs);
    const shownDocumentation = [...moduleDocumentation.documentation, ...exports.flatMap(exported => exported.documentation)];
    const omittedDocumentationInModule = allDocumentation.some(id => !shownDocumentation.some(doc => doc.id === id))
      || shownDocumentation.some(doc => doc.omittedTextCharacters > 0 || doc.omittedTags > 0 || doc.tags.some(tag => tag.omittedTextCharacters > 0));
    return { id, entityId: entityIds.get(id)!, ...claim.information, qualification: qualification(claim.context), ...moduleDocumentation, omittedDocumentationInModule,
      exports, omittedExports: allExports.length - exports.length };
  }).sort((left, right) => Number(right.facets.includes('project')) - Number(left.facets.includes('project')));
  const evaluations = projection.evaluations.map(id => {
    const outcome = store.get(id);
    if (outcome.kind !== 'evaluation') throw new Error('Expected evaluation');
    const { requirement, modules, applicability, availability, execution, materialization, reason, cost } = outcome;
    return { id, requirement, modules, applicability, availability, execution, materialization, reason, cost };
  });
  const contextIds = new Set(projection.contexts);
  for (const id of projection.evaluations) {
    const outcome = store.get(id);
    if (outcome.kind !== 'evaluation') continue;
    for (const contextId of outcome.contexts) {
      const context = store.get(contextId);
      if (context.kind === 'claim-context' && (context.scope === 'configured-project' || projection.modules.includes(context.scope))) contextIds.add(contextId);
    }
  }
  const contexts = [...contextIds].map(qualification);
  const collapsed = compact ? modules.filter(module => !module.facets.includes('project')) : [];
  const listed = compact ? modules.filter(module => module.facets.includes('project')) : modules;
  return {
    schema: 'postcode-view/0-experimental', id: recordId(projection.snapshot, 'view', { projection: projection.id, presentation, method: methods.presentation }),
    projection: { id: projection.id, snapshot: projection.snapshot, lens: projection.lens, subject: projection.subject,
      parameters: projection.parameters, selection: projection.selection },
    presentation: { ...presentation, expansions: projection.expansions.requested },
    analysis: snapshot.analysis ?? null,
    qualifications: contexts, evaluations, modules: listed.map(({ omittedDocumentationInModule: _omittedDocumentation, ...module }) => module),
    display: { collapsedModules: collapsed.length,
      omittedExports: listed.reduce((count, module) => count + module.omittedExports, 0),
      modulesWithOmittedDocumentation: listed.filter(module => module.omittedDocumentationInModule).length,
      collapsedQualifications: collapsed.map(module => ({ handle: module.handle, contexts: contexts.filter(context => context.scope === module.id) })) },
    ...(presentation.sourceDetail ? { sourceDetail: {
      level: 'declaration-locations' as const,
      notice: 'Source escape: locations supporting displayed claims only; no full-file content. Omitted exports/documentation have no source disclosure.',
      claims: [...displayedClaims.values()].map(claim => {
        const context = store.get(claim.context);
        if (context.kind !== 'claim-context') throw new Error('Expected Claim context');
        return { claim: claim.id, evidence: context.evidence.map(id => {
          const record = store.get(id);
          if (record.kind !== 'source-evidence') throw new Error('Expected source evidence');
          return record;
        }) };
      }),
    } } : {}),
  };
}

const terminalText = (text: string) => text.replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g,
  character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);

export function renderUnicode(view: QualifiedView): string {
  const selection = view.projection.selection;
  const inventory = view.projection.lens === 'modules';
  const lines = [`${inventory ? 'Modules' : 'Inspect'} · configured TypeScript project`,
    `Snapshot ${view.projection.snapshot.replace(/^snapshot:/, '').slice(0, 12)}`,
    inventory ? `${selection.population} module${selection.population === 1 ? '' : 's'} found · ${view.modules.length} listed${view.display.collapsedModules ? ` · ${view.display.collapsedModules} external module${view.display.collapsedModules === 1 ? '' : 's'} collapsed` : ''}`
      : `${selection.matches} module${selection.matches === 1 ? '' : 's'} selected from ${selection.population} · ${selection.matches === 1 ? 'exact match' : 'exact matches'} for ${view.projection.parameters.selector}`];
  if (!selection.populationEstablished) lines.push('Module population is not established.');
  if (selection.referenceStatus === 'snapshot-required') lines.push('No current match: handle or compact Entity ID selection requires --snapshot from its inventory.');
  if (selection.referenceStatus === 'snapshot-mismatch') lines.push('No current match: the supplied snapshot differs from this analysis; no successor is inferred.');
  const outcomeGroups = new Map<string, number>();
  for (const outcome of view.evaluations) {
    const label = `${outcome.requirement}: ${outcome.execution}, materialization ${outcome.materialization}${outcome.applicability !== 'applicable' ? `, ${outcome.applicability}` : ''}${outcome.availability !== 'available' ? `, ${outcome.availability}` : ''}${outcome.reason ? ` — ${outcome.reason}` : ''}`;
    outcomeGroups.set(label, (outcomeGroups.get(label) ?? 0) + 1);
  }
  const complete = view.evaluations.length > 0 && view.evaluations.every(outcome => outcome.applicability === 'applicable'
    && outcome.availability === 'available' && outcome.execution === 'completed' && outcome.materialization === 'full');
  if (complete) lines.push(`Analysis complete: ${[...new Set(view.evaluations.map(outcome => outcome.requirement))].join(', ')}`);
  else for (const [label, count] of outcomeGroups) lines.push(`Analysis ${label} (${count} scope${count === 1 ? '' : 's'})`);
  const projectContexts = view.qualifications.filter(context => context.scope === 'configured-project');
  const sharedLimitations = new Set(projectContexts.flatMap(context => context.limitations));
  const sharedDiagnostics = new Set(projectContexts.flatMap(context => context.diagnostics.map(diagnostic => diagnostic.code)));
  const local = (contexts: readonly Qualification[], indent: string) => {
    for (const limitation of new Set(contexts.flatMap(context => context.limitations))) {
      if (!sharedLimitations.has(limitation)) lines.push(`${indent}Limitation: ${limitation}`);
    }
    for (const code of new Set(contexts.flatMap(context => context.diagnostics.map(diagnostic => diagnostic.code)))) {
      if (!sharedDiagnostics.has(code)) lines.push(`${indent}Encountered TypeScript diagnostic: TS${code}`);
    }
  };
  let documentationDisplayed = false;
  let relationshipsDisplayed = false;
  const docs = (items: readonly Documentation[], omitted: number, indent: string) => {
    for (const doc of items) {
      documentationDisplayed = true;
      lines.push(`${indent}doc [recorded assertion] (${doc.association}):`);
      for (const line of doc.text.split('\n')) if (line.trim()) lines.push(`${indent}  ${line}`);
      if (doc.omittedTextCharacters) lines.push(`${indent}  … ${doc.omittedTextCharacters} assertion character(s) omitted.`);
      for (const tag of doc.tags) lines.push(`${indent}  @${tag.name} ${tag.text}${tag.omittedTextCharacters ? ` … (${tag.omittedTextCharacters} characters omitted)` : ''}`);
      if (doc.omittedTags) lines.push(`${indent}  … ${doc.omittedTags} structured tag(s) omitted (including source-oriented examples/links).`);
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
    if (exported.origin !== moduleId) details.push(exported.origin ? `origin ${`${exported.originHandle ?? 'anonymous'} (${exported.originEntityId ?? 'identity unavailable'})`}` : 'origin not established');
    if (exported.symbolInformation && exported.symbolInformation.declarationCount !== 1) details.push(`${exported.symbolInformation.declarationCount} contributing declarations`);
    return details;
  };
  const commonFacets = view.modules[0]?.facets.filter(facet => view.modules.every(module => module.facets.includes(facet))) ?? [];
  const allAnonymous = view.modules.length > 0 && view.modules.every(module => module.name === null);
  const handleWidth = Math.min(30, Math.max(6, ...view.modules.map(module => module.handle.length)));
  const idWidth = Math.max(9, ...view.modules.map(module => module.entityId.length));
  if (view.modules.length) {
    const facets = commonFacets.filter(facet => !inventory || facet !== 'project');
    lines.push('', `${inventory ? 'Project modules' : 'Selected modules'} · ${view.modules.length}${allAnonymous ? ' · TypeScript names not established' : ''}${facets.length ? ` · ${facets.join(', ')}` : ''}`);
    if (inventory) lines.push('', `${'Handle'.padEnd(handleWidth)}  ${'Entity ID'.padEnd(idWidth)}  Export names`);
  }
  for (const module of view.modules) {
    if (!inventory) lines.push('', `◆ ${module.handle}${allAnonymous ? '' : ` · ${module.name ?? '[anonymous]'}`}`);
    const facets = module.facets.filter(facet => !commonFacets.includes(facet));
    if (!inventory) {
      if (facets.length) lines.push(`  ${facets.join(', ')}`);
      lines.push(`  Entity ID ${module.entityId}`);
    }
    const total = module.exports.length + module.omittedExports;
    const established = view.evaluations.some(outcome => outcome.requirement === 'exports'
      && outcome.modules.includes(module.id) && outcome.availability === 'available' && outcome.applicability === 'applicable' && outcome.execution === 'completed' && outcome.materialization === 'full');
    if (inventory) {
      const names = module.exports.map(exported => exported.exportedName);
      if (module.omittedExports) names.push(`+${module.omittedExports}`);
      const cue = total ? names.join(', ') : established ? '(none)' : '(not established; no exports displayed)';
      lines.push(`${module.handle.padEnd(handleWidth)}  ${module.entityId.padEnd(idWidth)}  ${cue}${total && !established ? ' (materialized; surface incomplete)' : ''}`);
      if (!allAnonymous) lines.push(`  TypeScript name: ${module.name ?? '(not established)'}`);
      if (facets.length) lines.push(`  ${facets.join(', ')}`);
    } else {
      if (!total) lines.push(established ? '  Exports: (none)' : '  Exports: not established; no exports displayed.');
      docs(module.documentation, module.omittedDocumentation, '  ');
      for (const exported of module.exports) {
        const details = exceptions(exported, module.id);
        lines.push(`  ├─ ${exported.exportedName} [${roles(exported)}]${details.length ? ` · ${details.join('; ')}` : ''}`);
        if (exported.symbolInformation?.name && exported.symbolInformation.name !== exported.exportedName) lines.push(`  │  Semantic symbol: ${exported.symbolInformation.name}`);
        docs(exported.documentation, exported.omittedDocumentation, '  │  ');
      }
      if (module.omittedExports) lines.push(`  … ${module.omittedExports} effective export(s) omitted.`);
    }

    local([...view.qualifications.filter(context => context.scope === module.id), ...module.exports.map(exported => exported.qualification)], '  ');
  }
  if (documentationDisplayed) lines.push('', 'Documentation: doc [recorded assertion] has no established truth, currency or completeness.');
  if (relationshipsDisplayed) lines.push('', 'Export relationships describe aliases and forwarding, not calls or dependencies.');
  const omissions: string[] = [];
  if (view.display.collapsedModules) omissions.push(`${view.display.collapsedModules} external module${view.display.collapsedModules === 1 ? '' : 's'} and their details`);
  if (view.display.omittedExports) omissions.push(`${view.display.omittedExports} export${view.display.omittedExports === 1 ? '' : 's'} from listed modules`);
  if (view.display.modulesWithOmittedDocumentation) omissions.push(`documentation for ${view.display.modulesWithOmittedDocumentation} listed module${view.display.modulesWithOmittedDocumentation === 1 ? '' : 's'}`);
  if (omissions.length) lines.push('', 'Display', '  Omitted:', ...omissions.map(omission => `    ${omission}`), '  Inspection shows detail; JSON lists the full selected inventory.');
  lines.push('', 'Status');
  if (view.analysis?.provider === 'typescript') {
    const exportsComplete = view.evaluations.filter(outcome => outcome.requirement === 'exports');
    const establishedExports = exportsComplete.length > 0 && exportsComplete.every(outcome => outcome.execution === 'completed' && outcome.materialization === 'full' && outcome.availability === 'available' && outcome.applicability === 'applicable');
    lines.push(selection.populationEstablished && establishedExports
      ? '  Module membership and effective exports established by TypeScript analysis.'
      : selection.populationEstablished ? '  Module membership established by TypeScript analysis; export information is qualified by the capability states above.'
        : '  Displayed information is derived by TypeScript analysis; module population is not established.',
      '  Coverage: external-module SourceFiles and visible named ambient modules; other compiler module categories are not established.');
  } else for (const guarantee of new Set(projectContexts.map(context => context.guarantee))) lines.push(`  ${guarantee}`);
  for (const code of sharedDiagnostics) lines.push(`  Encountered TypeScript diagnostic: TS${code}`);
  const representedLimitations = view.analysis ? new Set([
    'Population is configured Program external-module SourceFiles and visible named ambient-module symbols; other compiler module categories are not established.',
    'Configured generated-output locations are explicitly excluded from repository evidence.',
    'No atomic filesystem snapshot is claimed; inputs are memoized as first observed.',
  ]) : new Set<string>();
  const extraLimitations = [...sharedLimitations].filter(limitation => !representedLimitations.has(limitation));
  if (view.analysis || extraLimitations.length) {
    lines.push('', 'Run limitations');
    if (view.analysis?.excludedOutputLocations) lines.push(`  ${view.analysis.excludedOutputLocations} generated-output locations excluded by this run's input filter.`);
    if (view.analysis?.inputConsistency === 'first-observed') lines.push('  Inputs were memoized as first observed, not captured as an atomic filesystem snapshot.');
    for (const limitation of extraLimitations) lines.push(`  ${limitation}`);
  }
  for (const collapsed of view.display.collapsedQualifications) {
    const exceptional = collapsed.contexts.filter(context => context.limitations.some(limitation => !sharedLimitations.has(limitation))
      || context.diagnostics.some(diagnostic => !sharedDiagnostics.has(diagnostic.code)));
    if (exceptional.length) { lines.push(`- Collapsed ${collapsed.handle}:`); local(exceptional, '  '); }
  }
  if (view.presentation.navigation) lines.push('', 'Next · inspect a module:', view.presentation.navigation.inspect);
  else lines.push('', 'Inspection requires an exact subject, the full snapshot ID from JSON, and the selected --project configuration.');
  lines.push('More: --help; command and concepts reference in docs/cli-reference.md.');
  if (view.sourceDetail) {
    lines.push('', 'SOURCE DETAIL — explicit source escape', view.sourceDetail.notice);
    for (const claim of view.sourceDetail.claims) {
      lines.push(`Claim ${claim.claim}`);
      for (const evidence of claim.evidence) lines.push(`  ${evidence.path} · offset ${evidence.start}, length ${evidence.length}`);
    }
  }
  return `${lines.map(terminalText).join('\n')}\n`;
}

export function renderView(view: QualifiedView): string {
  return view.presentation.format === 'json' ? `${JSON.stringify(view, null, 2)}\n` : renderUnicode(view);
}

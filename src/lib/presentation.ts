import { methods, recordId } from './identity.js';
import { isModuleClaim, moduleStandardExpansions } from './records.js';
import type { Claim, ClaimContextRecord, EvaluationRecord, ExportClaim, ModuleExpansion, ProgramRecordStore, ProjectionRecord, RecordId, RecordedAssertion, SourceEvidenceRecord, SymbolClaim } from './records.js';

export interface Presentation {
  readonly format: 'unicode' | 'json';
  readonly sourceDetail: boolean;
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
  symbolInformation: SymbolClaim['information'] | null;
  documentation: Documentation[]; omittedDocumentation: number;
};

export interface QualifiedView {
  readonly schema: 'postcode-view/0-experimental';
  readonly id: RecordId;
  readonly projection: Pick<ProjectionRecord, 'id' | 'snapshot' | 'lens' | 'subject' | 'parameters' | 'selection'>;
  readonly presentation: Presentation & { readonly expansions: readonly ModuleExpansion[] };
  readonly qualifications: readonly Qualification[];
  readonly evaluations: readonly Pick<EvaluationRecord, 'id' | 'requirement' | 'modules' | 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason' | 'cost'>[];
  readonly modules: readonly {
    id: RecordId; name: string | null; handle: string; handleStatus: string; facets: readonly string[];
    qualification: Qualification; documentation: Documentation[]; omittedDocumentation: number;
    exports: ExportView[]; omittedExports: number;
  }[];
  readonly sourceDetail?: { readonly level: 'declaration-locations'; readonly notice: string;
    readonly claims: readonly { readonly claim: RecordId; readonly evidence: readonly SourceEvidenceRecord[] }[] };
}

/** Assembles a bounded view from already-materialized records. Neither this nor rendering evaluates. */
export function createView(store: ProgramRecordStore, projection: ProjectionRecord, presentation: Presentation): QualifiedView {
  if (presentation.sourceDetail && projection.lens !== 'inspect') throw new Error('Source detail requires inspection');
  const qualification = (id: RecordId): Qualification => {
    const context = store.get(id);
    if (context.kind !== 'claim-context') throw new Error('Expected Claim context');
    const { kind: _kind, evidence: _evidence, ...conceptual } = context;
    return conceptual;
  };
  const expanded = projection.expansions.claims.map(id => store.get(id)).filter((record): record is Claim => record.kind === 'claim');
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
    const maximumDocs = projection.lens === 'inspect' ? 3 : claim.information.facets.includes('project') ? 1 : 0;
    displayedClaims.set(claim.id, claim);
    const allExports = expanded.filter((record): record is ExportClaim => record.information.type === 'export' && record.subject === id);
    const maximumExports = projection.lens === 'inspect' ? 50 : 6;
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
      return { ...exported.information, id: exported.id, qualification: qualification(exported.context), symbolInformation,
        ...documentation([exported.id, ...(exported.information.symbol ? [exported.information.symbol] : [])], maximumDocs) };
    });
    return { id, ...claim.information, qualification: qualification(claim.context), ...documentation([id], maximumDocs),
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
  return {
    schema: 'postcode-view/0-experimental', id: recordId(projection.snapshot, 'view', { projection: projection.id, presentation, method: methods.presentation }),
    projection: { id: projection.id, snapshot: projection.snapshot, lens: projection.lens, subject: projection.subject,
      parameters: projection.parameters, selection: projection.selection },
    presentation: { ...presentation, expansions: projection.expansions.requested },
    qualifications: [...contextIds].map(qualification), evaluations, modules,
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
  const lines = [`${view.projection.lens === 'modules' ? 'Modules' : 'Inspect'} · configured TypeScript project`,
    `Snapshot ${view.projection.snapshot}`,
    `${selection.matches} module${selection.matches === 1 ? '' : 's'} shown · ${selection.population} discovered · population ${selection.populationEstablished ? 'established' : 'not established'}`];
  if (selection.subset) lines.push('Selected subset; other discovered modules are not shown.');
  if (view.projection.parameters.selector !== null) lines.push(`Exact selector: ${view.projection.parameters.selector}`);
  lines.push('Materialization describes analysis results; display limits may still omit exports or documentation, with counts below.',
    'Handles are generated navigation aids for this snapshot. Next: inspect <handle> with the same project configuration.',
    'Export roles: type, value, or both. Routes list contributing export relationships, not calls or dependencies.');
  if (view.projection.lens === 'modules') lines.push('External documentation is omitted from inventory; inspect its module handle to read bounded assertions.');
  const outcomeGroups = new Map<string, number>();
  for (const outcome of view.evaluations) {
    const label = `${outcome.requirement}: ${outcome.applicability}, ${outcome.availability}, ${outcome.execution}, materialization ${outcome.materialization}${outcome.reason ? ` — ${outcome.reason}` : ''}`;
    outcomeGroups.set(label, (outcomeGroups.get(label) ?? 0) + 1);
  }
  for (const [label, count] of outcomeGroups) lines.push(`${label} (${count} evaluation scope${count === 1 ? '' : 's'})`);
  const projectContext = view.qualifications.filter(context => context.scope === 'configured-project');
  const guarantees = new Set(projectContext.map(context => context.guarantee));
  for (const guarantee of guarantees) lines.push(`Derived: ${guarantee}`);
  for (const limitation of new Set(projectContext.flatMap(context => context.limitations))) lines.push(`Limitation: ${limitation}`);
  for (const code of new Set(projectContext.flatMap(context => context.diagnostics.map(diagnostic => diagnostic.code)))) lines.push(`Encountered TypeScript diagnostic: TS${code}`);
  const docs = (items: readonly Documentation[], omitted: number, indent: string) => {
    for (const doc of items) {
      lines.push(`${indent}Recorded assertion (${doc.association}; truth/currency/completeness not established):`);
      for (const line of doc.text.split('\n')) lines.push(`${indent}  ${line}`);
      if (doc.omittedTextCharacters) lines.push(`${indent}  … ${doc.omittedTextCharacters} assertion character(s) omitted.`);
      for (const tag of doc.tags) lines.push(`${indent}  @${tag.name} ${tag.text}${tag.omittedTextCharacters ? ` … (${tag.omittedTextCharacters} characters omitted)` : ''}`);
      if (doc.omittedTags) lines.push(`${indent}  … ${doc.omittedTags} structured tag(s) omitted (including source-oriented examples/links).`);
    }
    if (omitted) lines.push(`${indent}… ${omitted} documentation assertion(s) omitted.`);
  };
  let priorGroup = '';
  for (const module of view.modules) {
    const group = module.facets.includes('project') ? 'Project-associated modules' : 'Other configured modules (including external declarations)';
    if (group !== priorGroup) { lines.push('', group); priorGroup = group; }
    lines.push('', `◆ ${module.name ?? '(anonymous module)'} · ${module.handle}`, `  Entity ${module.id}`,
      `  Facets: ${module.facets.join(', ') || 'none established'}`);
    for (const context of view.qualifications.filter(context => context.scope === module.id && context.method.includes('expansions'))) {
      lines.push(`  Derived: ${context.guarantee}`);
      for (const limitation of context.limitations) lines.push(`  Limitation: ${limitation}`);
    }
    docs(module.documentation, module.omittedDocumentation, '  ');
    if (module.exports.length === 0) {
      const exportsEstablished = view.evaluations.some(outcome => outcome.requirement === 'exports'
        && outcome.modules.includes(module.id) && outcome.execution === 'completed' && outcome.materialization === 'full');
      lines.push(exportsEstablished && module.omittedExports === 0
        ? '  Effective export set established as empty.'
        : '  No exports displayed; an empty effective export set is not established.');
    }
    for (const exported of module.exports) {
      const roles = exported.roles ? [exported.roles.type ? 'type' : '', exported.roles.value ? 'value' : ''].filter(Boolean).join(' + ') || 'no type/value role' : 'roles unavailable';
      lines.push(`  ├─ ${exported.exportedName} · ${roles} · routes: ${exported.routes.map(route => `${route.kind}${route.typeOnly ? ' (type-only)' : ''}`).join(', ') || 'unavailable'}`);
      if (exported.origin) lines.push(`  │  Origin ${exported.origin === module.id ? 'this module' : view.modules.find(module => module.id === exported.origin)?.handle ?? exported.origin}`);
      if (exported.symbolInformation) lines.push(`  │  Semantic symbol ${exported.symbolInformation.name ?? '(anonymous)'} · ${exported.symbolInformation.declarationCount} contributing declaration(s)`);
      for (const limitation of exported.qualification.limitations) lines.push(`  │  Limitation: ${limitation}`);
      docs(exported.documentation, exported.omittedDocumentation, '  │  ');
    }
    if (module.omittedExports) lines.push(`  └─ … ${module.omittedExports} effective export(s) omitted.`);
  }
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

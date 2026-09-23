import ts from 'typescript';
import { compare, methods, recordId } from '../identity.js';
import type { DiscoveryResult } from '../evaluation.js';
import type { ExportClaim, ModuleExpansion, ProgramRecord, RecordId, SessionId } from '../records.js';

export interface ExpansionModule {
  readonly key: string;
  readonly symbol: ts.Symbol | undefined;
  readonly declarations: readonly ts.Declaration[];
}

interface Route {
  kind: ExportClaim['information']['routes'][number]['kind'];
  typeOnly: boolean;
  aliased: boolean;
  via: ts.Symbol | undefined;
  node: ts.Node;
}

function statements(module: ts.Symbol): readonly ts.Statement[] {
  return (module.getDeclarations() ?? []).flatMap(declaration => {
    if (ts.isSourceFile(declaration)) return [...declaration.statements];
    if (ts.isModuleDeclaration(declaration) && declaration.body && ts.isModuleBlock(declaration.body)) return [...declaration.body.statements];
    return [];
  });
}

/** Prepares expansion queries before the caller captures input support and materializes records. */
export function prepareExpansions(checker: ts.TypeChecker, modules: readonly ExpansionModule[], requested: readonly ModuleExpansion[]) {
  const resolve = (symbol: ts.Symbol): ts.Symbol => symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const aliasAllowsValue = (symbol: ts.Symbol, seen = new Set<ts.Symbol>()): boolean => {
    if (!(symbol.flags & ts.SymbolFlags.Alias) || seen.has(symbol)) return true;
    seen.add(symbol);
    if ((symbol.getDeclarations() ?? []).some(node =>
      ts.isExportSpecifier(node) ? node.isTypeOnly || node.parent.parent.isTypeOnly
        : ts.isImportSpecifier(node) ? node.isTypeOnly || node.parent.parent.isTypeOnly
          : ts.isImportClause(node) || ts.isImportEqualsDeclaration(node) ? node.isTypeOnly
            : ts.isNamespaceImport(node) ? node.parent.isTypeOnly : false)) return false;
    const immediate = checker.getImmediateAliasedSymbol(symbol);
    return !immediate || aliasAllowsValue(immediate, seen);
  };
  const surfaces = new Map<ts.Symbol, readonly ts.Symbol[]>();
  const effective = (module: ts.Symbol): readonly ts.Symbol[] => {
    const cached = surfaces.get(module);
    if (cached) return cached;
    const symbols = checker.getExportsOfModule(module);
    const assignment = module.exports?.get(ts.InternalSymbolName.ExportEquals);
    const result = [...symbols, ...(assignment && !symbols.includes(assignment) ? [assignment] : [])]
      .sort((a, b) => compare(a.getName(), b.getName()));
    surfaces.set(module, result);
    return result;
  };
  const moduleAt = (node: ts.Node | undefined) => node ? checker.getSymbolAtLocation(node) : undefined;
  const moduleBySymbol = new Map(modules.filter(module => module.symbol).map(module => [module.symbol!, module]));
  const owner = (node: ts.Node, knownModuleOnly = false): ts.Symbol | undefined => {
    for (let parent: ts.Node | undefined = node.parent; parent; parent = parent.parent) {
      if (ts.isSourceFile(parent) || ts.isModuleDeclaration(parent)) {
        const symbol = moduleAt(ts.isModuleDeclaration(parent) ? parent.name : parent);
        if (symbol && (!knownModuleOnly || moduleBySymbol.has(symbol))) return symbol;
      }
    }
    return undefined;
  };
  interface Edge { route: Route; next?: { module: ts.Symbol; name: string } }
  const edges = (module: ts.Symbol, name: string): Edge[] => {
    const exported = effective(module).find(symbol => symbol.getName() === name);
    if (!exported) return [];
    const target = resolve(exported);
    const paths: Edge[] = [];
    const forward = (via: ts.Symbol | undefined, importedName: string, route: Route): void => {
      paths.push({ route, ...(via ? { next: { module: via, name: importedName } } : {}) });
    };
    for (const declaration of exported.getDeclarations() ?? []) {
      if (owner(declaration) !== module) continue;
      if (ts.isExportSpecifier(declaration)) {
        const statement = declaration.parent.parent;
        const via = moduleAt(statement.moduleSpecifier);
        const local = checker.getExportSpecifierLocalTargetSymbol(declaration);
        const imported = local?.getDeclarations()?.find(ts.isImportSpecifier);
        const importClause = imported?.parent.parent;
        const importStatement = importClause?.parent;
        const actualVia = via ?? (importStatement ? moduleAt(importStatement.moduleSpecifier) : undefined);
        forward(actualVia, imported?.propertyName?.text ?? imported?.name.text ?? declaration.propertyName?.text ?? declaration.name.text, {
          kind: via ? 'reexport' : 'alias', typeOnly: !aliasAllowsValue(exported) || declaration.isTypeOnly || statement.isTypeOnly
            || Boolean(imported?.isTypeOnly || importClause?.isTypeOnly),
          aliased: true, via: actualVia, node: declaration,
        });
      } else if (ts.isNamespaceExport(declaration)) {
        const statement = declaration.parent;
        paths.push({ route: { kind: 'reexport', typeOnly: statement.isTypeOnly, aliased: true,
          via: moduleAt(statement.moduleSpecifier), node: declaration } });
      } else {
        paths.push({ route: { kind: ts.isExportAssignment(declaration)
          ? declaration.isExportEquals ? 'export-assignment' : 'default'
          : name === 'default' ? 'default' : 'direct', typeOnly: false, aliased: false, via: undefined, node: declaration } });
      }
    }
    if (paths.length === 0 && name !== 'default' && name !== 'export=') {
      for (const statement of statements(module)) {
        if (!ts.isExportDeclaration(statement) || statement.exportClause || !statement.moduleSpecifier) continue;
        const via = moduleAt(statement.moduleSpecifier);
        const upstream = via && effective(via).find(symbol => symbol.getName() === name);
        if (!upstream || resolve(upstream) !== target) continue;
        forward(via, name, { kind: 'wildcard', typeOnly: statement.isTypeOnly, aliased: false, via, node: statement });
      }
    }
    if (paths.length === 0 && name !== 'export=') {
      const assignment = module.exports?.get(ts.InternalSymbolName.ExportEquals);
      const via = assignment && resolve(assignment);
      const node = assignment?.getDeclarations()?.[0];
      if (via && node && via !== module && (via.flags & ts.SymbolFlags.Module)) {
        forward(via, name, { kind: 'export-assignment', typeOnly: !aliasAllowsValue(assignment!), aliased: true, via, node });
      }
    }
    return paths;
  };

  // Keep a graph of reachable states, never a list of complete forwarding paths.
  // Shared suffixes and cycles are visited once; value reachability is a fixed point.
  const trace = (module: ts.Symbol, name: string) => {
    interface State { edges: Edge[]; predecessors: State[]; value: boolean }
    const states = new Map<ts.Symbol, Map<string, State>>();
    const pending: { module: ts.Symbol; name: string; state: State }[] = [];
    const stateFor = (module: ts.Symbol, name: string): State => {
      let names = states.get(module);
      if (!names) { names = new Map(); states.set(module, names); }
      let state = names.get(name);
      if (!state) {
        state = { edges: [], predecessors: [], value: false };
        names.set(name, state);
        pending.push({ module, name, state });
      }
      return state;
    };
    const root = stateFor(module, name);
    const routes: Route[] = [];
    const byNode = new Map<ts.Node, Route[]>();
    for (let index = 0; index < pending.length; index++) {
      const item = pending[index]!;
      item.state.edges = edges(item.module, item.name);
      for (const edge of item.state.edges) {
        const prior = byNode.get(edge.route.node) ?? [];
        if (!prior.some(route => route.kind === edge.route.kind && route.via === edge.route.via
          && route.typeOnly === edge.route.typeOnly && route.aliased === edge.route.aliased)) {
          prior.push(edge.route);
          byNode.set(edge.route.node, prior);
          routes.push(edge.route);
        }
        if (edge.next) stateFor(edge.next.module, edge.next.name);
      }
    }
    const values: State[] = [];
    for (const { state } of pending) {
      for (const edge of state.edges) {
        if (edge.route.typeOnly) continue;
        const next = edge.next && states.get(edge.next.module)!.get(edge.next.name)!;
        if (next && next.edges.length) next.predecessors.push(state);
        else if (!state.value) { state.value = true; values.push(state); }
      }
    }
    for (let index = 0; index < values.length; index++) {
      for (const predecessor of values[index]!.predecessors) {
        if (!predecessor.value) { predecessor.value = true; values.push(predecessor); }
      }
    }
    return { routes, allowsValue: root.value };
  };

  const docs = (declarations: readonly ts.Declaration[]) => {
    const found = new Map<string, { node: ts.JSDoc; text: string; tags: { name: string; text: string }[] }>();
    for (const declaration of declarations) {
      for (const item of ts.getJSDocCommentsAndTags(declaration)) {
        const doc = ts.isJSDoc(item) ? item : ts.isJSDoc(item.parent) ? item.parent : undefined;
        if (!doc) continue;
        const text = ts.getTextOfJSDocComment(doc.comment) ?? '';
        const tags = (doc.tags ?? []).map(tag => ({ name: tag.tagName.text,
          text: `${ts.isJSDocParameterTag(tag) ? `${tag.name.getText()} ` : ''}${ts.getTextOfJSDocComment(tag.comment) ?? ''}`.trim() }));
        if (text || tags.length) found.set(`${doc.getSourceFile().fileName}:${doc.pos}`, { node: doc, text, tags });
      }
    }
    return [...found.values()];
  };
  const prepared = modules.map(module => {
    const issues: string[] = [];
    if (!module.symbol) issues.push('Compiler module symbol is unavailable; expansions cannot be established.');
    for (const statement of module.symbol ? statements(module.symbol) : []) {
      if (ts.isExportDeclaration(statement) && statement.moduleSpecifier && !moduleAt(statement.moduleSpecifier)) {
        issues.push('An export target could not be resolved; the effective export surface is incomplete.');
      }
    }
    const exports = (module.symbol ? effective(module.symbol) : []).map(exported => {
      const symbol = resolve(exported);
      const unresolved = checker.isUnknownSymbol(symbol);
      const traced = trace(module.symbol!, exported.getName());
      if (!(exported.getDeclarations() ?? []).some(node => owner(node) === module.symbol)) {
        const wildcardTargets = new Set(statements(module.symbol!).flatMap(statement => {
          if (!ts.isExportDeclaration(statement) || statement.exportClause) return [];
          const via = moduleAt(statement.moduleSpecifier);
          const member = via && effective(via).find(member => member.getName() === exported.getName());
          return member ? [resolve(member)] : [];
        }));
        if (wildcardTargets.size > 1) issues.push(`Export ${exported.getName()} has conflicting wildcard origins; the compiler surface is qualified.`);
      }
      if (unresolved) issues.push(`Export ${exported.getName()} has an unresolved originating symbol.`);
      if (traced.routes.length === 0) issues.push(`The forwarding route for export ${exported.getName()} is unavailable.`);
      return { exported, symbol: unresolved ? undefined : symbol, traced,
        originDocs: requested.includes('documentation') && !unresolved ? docs(symbol.getDeclarations() ?? []) : [],
        aliasDocs: requested.includes('documentation') && symbol !== exported ? docs(exported.getDeclarations() ?? []) : [] };
    });
    return { module, exports, issues: [...new Set(issues)], docs: requested.includes('documentation') ? docs(module.declarations) : [] };
  });

  return (session: SessionId, evidence: (node: ts.Node, compilerName: string | null) => RecordId) => {
    const method = `${methods.expansions};typescript@${ts.version}`;
    const records: ProgramRecord[] = [];
    const moduleId = (symbol: ts.Symbol | undefined) => {
      const module = symbol && moduleBySymbol.get(symbol);
      return module ? recordId(session, 'module', module.key) : null;
    };
    const symbolId = (symbol: ts.Symbol) => recordId(session, 'symbol', {
      name: symbol.getName(), declarations: (symbol.getDeclarations() ?? []).map(node =>
        [node.getSourceFile().fileName, node.pos, node.end]).sort((a, b) => compare(JSON.stringify(a), JSON.stringify(b))),
    });
    const context = (scope: RecordId, key: unknown, nodes: readonly ts.Node[], guarantee: string, limitations: readonly string[] = []) => {
      const id = recordId(session, 'expansion-context', key);
      records.push({ kind: 'claim-context', id, session, method, scope,
        evidence: [...new Set(nodes.map(node => evidence(node, null)))], status: 'mechanically-derived', guarantee,
        limitations, diagnostics: [] });
      return id;
    };
    const putDocs = (subject: RecordId, contributions: ReturnType<typeof docs>, association: 'module' | 'origin-symbol' | 'export-alias'): RecordId[] => {
      return contributions.map(doc => {
        const key = [subject, doc.node.getSourceFile().fileName, doc.node.pos, association];
        const assertion = recordId(session, 'documentation', key);
        const claim = recordId(session, 'documentation-association', key);
        const ctx = context(subject, key, [doc.node], 'TypeScript associates this recorded documentation with the subject.',
          ['The text is a recorded assertion; its truth, currency and completeness are not established.']);
        records.push({ kind: 'recorded-assertion', id: assertion, session, method, context: ctx,
          status: 'recorded-assertion', text: doc.text, tags: doc.tags }, {
          kind: 'claim', id: claim, session, method, subject, context: ctx,
          information: { type: 'documentation-association', assertion, association },
        });
        return claim;
      });
    };
    const exportClaims: RecordId[] = [];
    const docClaims: RecordId[] = [];
    const contexts: RecordId[] = [];
    const symbols = new Set<RecordId>();
    for (const item of prepared) {
      const subject = recordId(session, 'module', item.module.key);
      contexts.push(context(subject, ['expansion', subject], item.module.declarations,
        'Effective exports and associated documentation obtained through the TypeScript compiler model.', item.issues));
      docClaims.push(...putDocs(subject, item.docs, 'module'));
      for (const exported of item.exports) {
        const id = recordId(session, 'export', [subject, exported.exported.getName()]);
        const symbol = exported.symbol ? symbolId(exported.symbol) : null;
        const declarations = exported.symbol?.getDeclarations() ?? [];
        const targetRoles = exported.symbol ? { type: Boolean(exported.symbol.flags & ts.SymbolFlags.Type),
          value: Boolean(exported.symbol.flags & ts.SymbolFlags.Value) } : null;
        if (symbol && !symbols.has(symbol)) {
          symbols.add(symbol);
          const claim = recordId(session, 'symbol-claim', symbol);
          const ctx = context(symbol, symbol, declarations, 'One compiler semantic symbol with its contributing declarations.');
          records.push({ kind: 'symbol', id: symbol, session, method, claim }, {
            kind: 'claim', id: claim, session, method, subject: symbol, context: ctx,
            information: { type: 'symbol', name: declarations.some(ts.isSourceFile) ? null : exported.symbol!.getName(), roles: targetRoles!, declarationCount: declarations.length },
          });
          docClaims.push(...putDocs(symbol, exported.originDocs, 'origin-symbol'));
        }
        const ctx = context(subject, id, [...declarations, ...exported.traced.routes.map(step => step.node)],
          'The compiler exposes this exported name; roles and forwarding are qualified by the recorded route.', item.issues);
        const routes = exported.traced.routes.map(step => ({ kind: step.kind, typeOnly: step.typeOnly,
          aliased: step.aliased, via: moduleId(step.via) }));
        const origins = [...new Set(declarations.map(node => moduleId(owner(node, true))).filter(id => id !== null))];
        records.push({ kind: 'claim', id, session, method, subject, context: ctx, information: {
          type: 'export', exportedName: exported.exported.getName(), symbol,
          origin: origins.length === 1 ? origins[0]! : null,
          roles: targetRoles && exported.traced.routes.length ? { type: targetRoles.type, value: targetRoles.value
            && aliasAllowsValue(exported.exported) && exported.traced.allowsValue } : null, routes,
        } });
        exportClaims.push(id);
        docClaims.push(...putDocs(id, exported.aliasDocs, 'export-alias'));
      }
    }
    const byId = new Map(records.map(record => [record.id, record]));
    const results: NonNullable<DiscoveryResult['expansions']>[number][] = prepared.flatMap((item, index) => {
      const subject = recordId(session, 'module', item.module.key);
      const exports = exportClaims.filter(id => {
        const claim = byId.get(id);
        return claim?.kind === 'claim' && claim.subject === subject;
      });
      const related = new Set([subject, ...exports]);
      for (const id of exports) {
        const claim = byId.get(id);
        if (claim?.kind === 'claim' && claim.information.type === 'export' && claim.information.symbol) related.add(claim.information.symbol);
      }
      const docs = docClaims.filter(id => {
        const claim = byId.get(id);
        return claim?.kind === 'claim' && related.has(claim.subject);
      });
      return requested.map(requirement => ({
        requirement, modules: [subject], claims: requirement === 'exports' ? exports : [...exports, ...docs], contexts: [contexts[index]!],
        applicability: 'applicable', availability: 'available', execution: 'completed',
        materialization: item.issues.length ? 'partial' : 'full', reason: item.issues.length ? 'Some requested expansion information for this module could not be established.' : null,
        cost: { measure: 'module-count', value: 1 },
      }));
    });
    if (modules.length === 0) results.push(...requested.map(requirement => ({
      requirement, modules: [], claims: [], contexts: [], applicability: 'applicable' as const, availability: 'available' as const,
      execution: 'completed' as const, materialization: 'full' as const, reason: null, cost: { measure: 'module-count' as const, value: 0 },
    })));
    return { records, results };
  };
}

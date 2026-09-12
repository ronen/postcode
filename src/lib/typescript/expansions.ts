import ts from 'typescript';
import { compare, methods, recordId } from '../identity.js';
import type { DiscoveryResult } from '../evaluation.js';
import type { ExportClaim, ModuleExpansion, ProgramRecord, RecordId, SnapshotId } from '../records.js';

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

/** Preparation completes compiler queries before the caller finalizes snapshot identity. */
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
  const trace = (module: ts.Symbol, name: string, seen = new Set<ts.Symbol>()): Route[][] => {
    if (seen.has(module)) return [];
    seen = new Set([...seen, module]);
    const exported = effective(module).find(symbol => symbol.getName() === name);
    if (!exported) return [];
    const target = resolve(exported);
    const paths: Route[][] = [];
    const forward = (via: ts.Symbol | undefined, importedName: string, route: Route): void => {
      const continuation = via ? trace(via, importedName, seen) : [];
      paths.push(...(continuation.length ? continuation.map(rest => [route, ...rest]) : [[route]]));
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
        paths.push([{ kind: 'reexport', typeOnly: statement.isTypeOnly, aliased: true,
          via: moduleAt(statement.moduleSpecifier), node: declaration }]);
      } else {
        paths.push([{ kind: ts.isExportAssignment(declaration)
          ? declaration.isExportEquals ? 'export-assignment' : 'default'
          : name === 'default' ? 'default' : 'direct', typeOnly: false, aliased: false, via: undefined, node: declaration }]);
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
      const paths = trace(module.symbol!, exported.getName());
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
      if (paths.length === 0) issues.push(`The forwarding route for export ${exported.getName()} is unavailable.`);
      return { exported, symbol: unresolved ? undefined : symbol, paths,
        originDocs: requested.includes('documentation') && !unresolved ? docs(symbol.getDeclarations() ?? []) : [],
        aliasDocs: requested.includes('documentation') && symbol !== exported ? docs(exported.getDeclarations() ?? []) : [] };
    });
    return { module, exports, issues: [...new Set(issues)], docs: requested.includes('documentation') ? docs(module.declarations) : [] };
  });

  return (snapshot: SnapshotId, evidence: (node: ts.Node, compilerName: string | null) => RecordId) => {
    const method = `${methods.expansions};typescript@${ts.version}`;
    const records: ProgramRecord[] = [];
    const moduleId = (symbol: ts.Symbol | undefined) => {
      const module = symbol && moduleBySymbol.get(symbol);
      return module ? recordId(snapshot, 'module', module.key) : null;
    };
    const symbolId = (symbol: ts.Symbol) => recordId(snapshot, 'symbol', {
      name: symbol.getName(), declarations: (symbol.getDeclarations() ?? []).map(node =>
        [node.getSourceFile().fileName, node.pos, node.end]).sort((a, b) => compare(JSON.stringify(a), JSON.stringify(b))),
    });
    const context = (scope: RecordId, key: unknown, nodes: readonly ts.Node[], guarantee: string, limitations: readonly string[] = []) => {
      const id = recordId(snapshot, 'expansion-context', key);
      records.push({ kind: 'claim-context', id, snapshot, method, scope,
        evidence: [...new Set(nodes.map(node => evidence(node, null)))], status: 'mechanically-derived', guarantee,
        limitations, diagnostics: [] });
      return id;
    };
    const putDocs = (subject: RecordId, contributions: ReturnType<typeof docs>, association: 'module' | 'origin-symbol' | 'export-alias'): RecordId[] => {
      return contributions.map(doc => {
        const key = [subject, doc.node.getSourceFile().fileName, doc.node.pos, association];
        const assertion = recordId(snapshot, 'documentation', key);
        const claim = recordId(snapshot, 'documentation-association', key);
        const ctx = context(subject, key, [doc.node], 'TypeScript associates this recorded documentation with the subject.',
          ['The text is a recorded assertion; its truth, currency and completeness are not established.']);
        records.push({ kind: 'recorded-assertion', id: assertion, snapshot, method, context: ctx,
          status: 'recorded-assertion', text: doc.text, tags: doc.tags }, {
          kind: 'claim', id: claim, snapshot, method, subject, context: ctx,
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
      const subject = recordId(snapshot, 'module', item.module.key);
      contexts.push(context(subject, ['expansion', subject], item.module.declarations,
        'Effective exports and associated documentation obtained through the TypeScript compiler model.', item.issues));
      docClaims.push(...putDocs(subject, item.docs, 'module'));
      for (const exported of item.exports) {
        const id = recordId(snapshot, 'export', [subject, exported.exported.getName()]);
        const symbol = exported.symbol ? symbolId(exported.symbol) : null;
        const declarations = exported.symbol?.getDeclarations() ?? [];
        const targetRoles = exported.symbol ? { type: Boolean(exported.symbol.flags & ts.SymbolFlags.Type),
          value: Boolean(exported.symbol.flags & ts.SymbolFlags.Value) } : null;
        if (symbol && !symbols.has(symbol)) {
          symbols.add(symbol);
          const claim = recordId(snapshot, 'symbol-claim', symbol);
          const ctx = context(symbol, symbol, declarations, 'One compiler semantic symbol with its contributing declarations.');
          records.push({ kind: 'symbol', id: symbol, snapshot, method, claim }, {
            kind: 'claim', id: claim, snapshot, method, subject: symbol, context: ctx,
            information: { type: 'symbol', name: declarations.some(ts.isSourceFile) ? null : exported.symbol!.getName(), roles: targetRoles!, declarationCount: declarations.length },
          });
          docClaims.push(...putDocs(symbol, exported.originDocs, 'origin-symbol'));
        }
        const ctx = context(subject, id, [...declarations, ...exported.paths.flatMap(route => route.map(step => step.node))],
          'The compiler exposes this exported name; roles and forwarding are qualified by the recorded route.', item.issues);
        const routes = exported.paths.flatMap(route => route.map(step => ({ kind: step.kind, typeOnly: step.typeOnly,
          aliased: step.aliased, via: moduleId(step.via) })));
        const origins = [...new Set(declarations.map(node => moduleId(owner(node, true))).filter(id => id !== null))];
        records.push({ kind: 'claim', id, snapshot, method, subject, context: ctx, information: {
          type: 'export', exportedName: exported.exported.getName(), symbol,
          origin: origins.length === 1 ? origins[0]! : null,
          roles: targetRoles && exported.paths.length ? { type: targetRoles.type, value: targetRoles.value
            && aliasAllowsValue(exported.exported) && exported.paths.some(route => route.every(step => !step.typeOnly)) } : null, routes,
        } });
        exportClaims.push(id);
        docClaims.push(...putDocs(id, exported.aliasDocs, 'export-alias'));
      }
    }
    const byId = new Map(records.map(record => [record.id, record]));
    const results: NonNullable<DiscoveryResult['expansions']>[number][] = prepared.flatMap((item, index) => {
      const subject = recordId(snapshot, 'module', item.module.key);
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

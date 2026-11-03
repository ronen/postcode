import { diagnosticLookup, capturedDiagnostic } from './diagnostics.js';
import ts from 'typescript';
import { identityReference, methods, recordId } from '../identity.js';
import type { DiscoveryResult } from '../evaluation.js';
import type { ProgramRecord, RecordId, SessionId } from '../records.js';
import type { ExpansionModule } from './expansions.js';

/** Exhaustive syntax property; no export traversal or purpose inference. */
export function prepareComposition(program: ts.Program, modules: readonly ExpansionModule[]) {
  const diagnostics = diagnosticLookup(program.getSyntacticDiagnostics());
  const prepared = modules.map(module => {
    const statements: ts.Statement[] = [];
    let supported = module.declarations.length > 0;
    for (const declaration of module.declarations) {
      if (ts.isSourceFile(declaration)) statements.push(...declaration.statements);
      else if (ts.isModuleDeclaration(declaration) && declaration.body && ts.isModuleBlock(declaration.body)) statements.push(...declaration.body.statements);
      else supported = false;
    }
    const relevant = diagnostics(module.declarations.map(node => node.getSourceFile()))
      .map(capturedDiagnostic);
    const substantive = statements.filter(statement => !ts.isEmptyStatement(statement));
    const complete = supported && relevant.length === 0;
    // An empty named re-export (`export {} from './target'`) still has a module
    // specifier; the bare module marker (`export {};`) does not qualify.
    const positive = complete && substantive.length > 0 && substantive.every(statement =>
      ts.isExportDeclaration(statement) && statement.moduleSpecifier !== undefined && ts.isStringLiteralLike(statement.moduleSpecifier));
    return { module, complete, positive, diagnostics: relevant };
  });
  return (session: SessionId, evidence: (node: ts.Node, compilerName: string | null) => RecordId) => {
    const method = `${methods.composition};typescript@${ts.version}`;
    const records: ProgramRecord[] = [];
    const results: NonNullable<DiscoveryResult['expansions']>[number][] = prepared.map(item => {
      const subject = recordId(session, 'module', item.module.key);
      const context = recordId(session, 'composition-context', [method, identityReference(session, subject)]);
      const claim = recordId(session, 'composition-claim', [method, identityReference(session, subject)]);
      records.push({ kind: 'claim-context', id: context, session, method, scope: subject,
        evidence: item.module.declarations.map(node => evidence(node, null)), status: 'mechanically-derived',
        guarantee: 'Composition tests every substantive top-level statement across all captured module declarations.',
        limitations: ['This assessment ignores comments and empty statements (instructions that do nothing). It does not establish an architectural facade or public interface, absence of effects, safe removal of a module boundary, or effects of indirectly used modules.',
          ...(!item.complete ? ['Malformed code or a program structure this analyzer does not recognize prevents a complete account of the module’s composition.'] : [])],
        diagnostics: item.diagnostics });
      if (item.positive) records.push({ kind: 'claim', id: claim, session, method, subject, context,
        information: { type: 'module-composition', property: 're-exports-only' } });
      return { requirement: 'composition', modules: [subject], claims: item.positive ? [claim] : [], contexts: [context],
        applicability: 'applicable', availability: 'available', execution: 'completed', materialization: item.complete ? 'full' : 'partial',
        reason: item.complete ? null : 'Module composition could not be completely established.', cost: { measure: 'module-count', value: 1 } };
    });
    if (modules.length === 0) results.push({ requirement: 'composition', modules: [], claims: [], contexts: [],
      applicability: 'applicable', availability: 'available', execution: 'completed', materialization: 'full', reason: null,
      cost: { measure: 'module-count', value: 0 } });
    return { records, results };
  };
}

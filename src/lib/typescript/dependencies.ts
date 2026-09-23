import ts from 'typescript';
import { compare, methods, recordId } from '../identity.js';
import type { ClaimContextRecord, ModuleDiscoveryFacet, ProgramRecord, RecordId, SessionId, SourceEvidenceRecord } from '../records.js';
import type { CommonJSRecognition, DependencyCoverageRecord, DependencyMechanism, DependencyOccurrenceRecord,
  DependencyRelationshipClaim, DependencyResult, DependencyTargetStatus } from '../dependencies/records.js';
import { dependencyLimitations } from '../dependencies/records.js';
import { recognizeCommonJS } from './commonjs.js';

interface ModuleCandidate {
  readonly key: string;
  readonly symbol: ts.Symbol | undefined;
  readonly declarations: readonly ts.Declaration[];
  readonly discoveryFacets: readonly ModuleDiscoveryFacet[];
}
interface PreparedRequest {
  node: ts.Node;
  owner: ModuleCandidate | undefined;
  mechanism: DependencyMechanism;
  typeOnly: boolean;
  target: ModuleCandidate | undefined;
  targetStatus: DependencyTargetStatus;
  literal: string | null;
  resolvedFile: string | null;
  targetBasis: NonNullable<SourceEvidenceRecord['dependencyResolution']>['targetBasis'];
  mode: 'commonjs' | 'esm' | 'unspecified';
  commonjs: CommonJSRecognition | null;
  declarations: readonly ts.Declaration[];
  targetDeclarations: readonly ts.Declaration[];
  coverage: DependencyCoverageRecord['outcome'] | null;
}

type Evidence = (node: ts.Node, compilerName: string | null, resolution?: SourceEvidenceRecord['resolution'],
  dependencyResolution?: SourceEvidenceRecord['dependencyResolution']) => RecordId;

/** Prepares dependency queries before the caller captures input support and materializes records. */
export function prepareDependencies(program: ts.Program, host: ts.CompilerHost, modules: readonly ModuleCandidate[]) {
  const checker = program.getTypeChecker();
  const diagnostics = program.getSyntacticDiagnostics();
  const syntaxFailures = new Set(diagnostics.flatMap(diagnostic => diagnostic.file ? [diagnostic.file] : []));
  const bySymbol = new Map(modules.filter(module => module.symbol).map(module => [module.symbol!, module]));
  const byFile = new Map(modules.flatMap(module => module.declarations.filter(ts.isSourceFile)
    .map(file => [host.getCanonicalFileName(file.fileName), module] as const)));
  const ambient = new Map(checker.getAmbientModules().map(symbol => [symbol.getName(), symbol]));
  const ownerOf = (node: ts.Node): ModuleCandidate | undefined => {
    for (let parent: ts.Node | undefined = node.parent; parent; parent = parent.parent) {
      if (ts.isModuleDeclaration(parent) && (parent.flags & ts.NodeFlags.GlobalAugmentation) !== 0) return undefined;
      if (ts.isModuleDeclaration(parent) && ts.isStringLiteral(parent.name)) {
        // A named module or augmentation is an ownership boundary, even when
        // it cannot be mapped. Never attribute its requests to an enclosing file.
        const symbol = checker.getSymbolAtLocation(parent.name);
        return symbol ? bySymbol.get(symbol) : undefined;
      }
      if (ts.isSourceFile(parent)) return byFile.get(host.getCanonicalFileName(parent.fileName));
    }
    return undefined;
  };
  const requests: PreparedRequest[] = [];
  const visit = (node: ts.Node): void => {
    let expression: ts.Node | undefined;
    let mechanism: DependencyMechanism | undefined;
    let typeOnly = false;
    let wrongShape = false;
    if (ts.isImportDeclaration(node)) {
      expression = node.moduleSpecifier;
      const clause = node.importClause;
      mechanism = clause ? 'static-import' : 'side-effect-import';
      typeOnly = Boolean(clause && (clause.isTypeOnly || (!clause.name && clause.namedBindings
        && ts.isNamedImports(clause.namedBindings) && clause.namedBindings.elements.length > 0
        && clause.namedBindings.elements.every(element => element.isTypeOnly))));
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      expression = node.moduleSpecifier;
      mechanism = 're-export';
      typeOnly = node.isTypeOnly || Boolean(node.exportClause && ts.isNamedExports(node.exportClause)
        && node.exportClause.elements.length > 0 && node.exportClause.elements.every(element => element.isTypeOnly));
    } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      expression = node.moduleReference.expression;
      mechanism = 'import-equals';
      typeOnly = node.isTypeOnly;
    } else if (ts.isImportTypeNode(node)) {
      expression = ts.isLiteralTypeNode(node.argument) ? node.argument.literal : node.argument;
      mechanism = 'import-type';
      typeOnly = true;
    } else if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        expression = node.arguments[0];
        mechanism = expression ? 'dynamic-import' : undefined;
      } else if (ts.isIdentifier(node.expression) && node.expression.text === 'require') {
        expression = node.arguments[0];
        mechanism = 'commonjs';
        wrongShape = node.arguments.length !== 1;
      }
    }
    if (mechanism) {
      const owner = ownerOf(node);
      const request: PreparedRequest = {
        node, owner, mechanism, typeOnly, target: undefined, targetStatus: 'target-indeterminate',
        literal: expression && ts.isStringLiteralLike(expression) ? expression.text : null,
        resolvedFile: null, targetBasis: 'none', mode: 'unspecified', commonjs: null, declarations: [], targetDeclarations: [],
        coverage: !owner ? 'ownership-unestablished' : !owner.discoveryFacets.includes('project') ? 'external-owner'
          : wrongShape ? 'outside-commonjs-shape' : null,
      };
      if (request.coverage === null && mechanism === 'commonjs' && ts.isCallExpression(node)) {
        const result = recognizeCommonJS(program, checker, node, syntaxFailures);
        request.commonjs = result.recognition;
        request.declarations = result.declarations;
        if (result.recognition.outcome !== 'recognized') request.coverage = result.recognition.outcome;
      }
      if (request.coverage === null && expression && ts.isStringLiteralLike(expression)) {
        const file = node.getSourceFile();
        const mode = mechanism === 'commonjs' ? ts.ModuleKind.CommonJS : program.getModeForUsageLocation(file, expression);
        request.mode = mode === ts.ModuleKind.CommonJS ? 'commonjs' : mode === ts.ModuleKind.ESNext ? 'esm' : 'unspecified';
        const resolution = ts.resolveModuleName(expression.text, file.fileName, program.getCompilerOptions(), host,
          undefined, undefined, mode).resolvedModule;
        request.resolvedFile = resolution?.resolvedFileName ?? null;
        // CommonJS uses the configured file resolver; exact ambient symbols
        // are a fallback when no file was resolved. Other supported syntax has
        // direct checker-symbol evidence, including wildcard ambient targets.
        const symbol = mechanism === 'commonjs'
          ? resolution ? undefined : ambient.get(JSON.stringify(expression.text))
          : checker.getSymbolAtLocation(expression);
        if (symbol) {
          request.targetBasis = mechanism === 'commonjs' ? 'exact-ambient-symbol' : 'checker-symbol';
          request.target = bySymbol.get(symbol);
        } else if (resolution) {
          request.targetBasis = 'configured-file-resolution';
          request.target = byFile.get(host.getCanonicalFileName(resolution.resolvedFileName));
        }
        request.targetStatus = request.target ? 'resolved' : symbol || resolution ? 'outside-population' : 'unresolved';
        const declarations = request.target?.declarations ?? [];
        const matched = resolution ? declarations.filter(declaration =>
          host.getCanonicalFileName(declaration.getSourceFile().fileName) === host.getCanonicalFileName(resolution.resolvedFileName)) : [];
        // A file-resolver path alone must never narrow an unrelated ambient
        // symbol's placement. Preserve its actual declaration evidence instead.
        request.targetDeclarations = matched.length > 0 ? matched : declarations;
      }
      requests.push(request);
    }
    ts.forEachChild(node, visit);
  };
  // External library interiors never become request owners merely because installed.
  [...program.getSourceFiles()].filter(file => !program.isSourceFileFromExternalLibrary(file) && !program.isSourceFileDefaultLibrary(file))
    .sort((a, b) => compare(a.fileName, b.fileName)).forEach(visit);

  return (session: SessionId, evidence: Evidence): { records: ProgramRecord[]; result: DependencyResult } => {
    const method = `${methods.dependencies};typescript@${ts.version}`;
    const records: ProgramRecord[] = [];
    const occurrences: DependencyOccurrenceRecord[] = [];
    const occurrenceFiles = new Map<RecordId, ts.SourceFile>();
    const coverage: DependencyCoverageRecord[] = [];
    const contexts = new Map<RecordId, ClaimContextRecord>();
    const moduleId = (candidate: ModuleCandidate) => recordId(session, 'module', candidate.key);
    const context = (key: unknown, scope: RecordId | 'configured-project', sources: readonly RecordId[],
      sourceFiles: readonly ts.SourceFile[]): RecordId => {
      const relevant = diagnostics.filter(diagnostic => diagnostic.file && sourceFiles.includes(diagnostic.file))
        .map(diagnostic => ({ code: diagnostic.code, category: ts.DiagnosticCategory[diagnostic.category]!.toLowerCase() }))
        .sort((a, b) => a.code - b.code || compare(a.category, b.category));
      const record: ClaimContextRecord = {
        kind: 'claim-context', id: recordId(session, 'dependency-context', key), session, method, scope,
        evidence: [...new Set(sources)], status: 'mechanically-derived',
        guarantee: 'Bounded source-request evidence under the configured TypeScript environment; syntax diagnostics qualify interpretation.',
        limitations: dependencyLimitations, diagnostics: relevant,
      };
      contexts.set(record.id, record);
      return record.id;
    };
    for (const request of requests) {
      const owner = request.owner ? moduleId(request.owner) : null;
      const source = evidence(request.node, null, undefined, request.coverage === null ? {
        writtenSpecifier: request.literal, status: request.targetStatus, resolvedFile: request.resolvedFile, targetBasis: request.targetBasis, mode: request.mode,
      } : undefined);
      const targetEvidence = request.targetDeclarations.map(declaration => evidence(declaration, null));
      const support = [source, ...request.declarations.map(declaration => evidence(declaration, null)), ...targetEvidence];
      const id = recordId(session, request.coverage === null ? 'dependency-occurrence' : 'dependency-coverage', [method, source, owner]);
      const qualification = context(id, owner ?? 'configured-project', support, [request.node.getSourceFile()]);
      if (request.coverage !== null) {
        coverage.push({ kind: 'dependency-coverage', id, session, method, owner, context: qualification,
          evidence: source, outcome: request.coverage, commonjs: request.commonjs });
      } else {
        if (!owner) throw new Error('Recognized dependency occurrence lacks an owner');
        occurrenceFiles.set(id, request.node.getSourceFile());
        occurrences.push({ kind: 'dependency-occurrence', id, session, method, owner, context: qualification,
          evidence: source, targetEvidence, mechanism: request.mechanism, typeOnly: request.typeOnly,
          targetStatus: request.targetStatus, target: request.target ? moduleId(request.target) : null, commonjs: request.commonjs });
      }
    }
    const pairs = new Map<string, DependencyOccurrenceRecord[]>();
    for (const occurrence of occurrences) {
      if (!occurrence.target) continue;
      const key = JSON.stringify([occurrence.owner, occurrence.target]);
      const supporting = pairs.get(key) ?? [];
      supporting.push(occurrence);
      pairs.set(key, supporting);
    }
    const relationships: DependencyRelationshipClaim[] = [...pairs].sort(([a], [b]) => compare(a, b)).map(([, supporting]) => {
      const first = supporting[0]!;
      const id = recordId(session, 'dependency', [method, first.owner, first.target]);
      // Select each captured diagnostic once across the contributing files.
      // Concatenating occurrence contexts multiplies file-wide diagnostics;
      // deduplicating projected code/category pairs would lose distinct errors.
      const sourceFiles = [...new Set(supporting.map(occurrence => occurrenceFiles.get(occurrence.id)!))];
      const qualification = context(id, first.owner,
        supporting.flatMap(occurrence => contexts.get(occurrence.context)!.evidence), sourceFiles);
      return { kind: 'claim', id, session, method, subject: first.owner, context: qualification,
        information: { type: 'dependency', child: first.target!, occurrences: supporting.map(occurrence => occurrence.id),
          mechanisms: [...new Set(supporting.map(occurrence => occurrence.mechanism))].sort(compare),
          typeOnly: supporting.every(occurrence => occurrence.typeOnly) } };
    });
    context('project', 'configured-project', [], program.getSourceFiles().filter(file => !program.isSourceFileFromExternalLibrary(file) && !program.isSourceFileDefaultLibrary(file)));
    const projectModules = modules.filter(module => module.discoveryFacets.includes('project')).map(moduleId);
    // Full materialization means the bounded pass completed, not universal recognition.
    const result: DependencyResult = {
      projectModules, occurrences: occurrences.map(occurrence => occurrence.id), relationships: relationships.map(relationship => relationship.id),
      coverage: coverage.map(item => item.id), contexts: [...contexts.keys()],
      applicability: 'applicable', availability: 'available', execution: 'completed', materialization: 'full', reason: null,
      cost: { measure: 'module-count', value: projectModules.length },
    };
    records.push(...contexts.values(), ...occurrences, ...coverage, ...relationships);
    return { records, result };
  };
}

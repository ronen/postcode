import path from 'node:path';
import ts from 'typescript';
import { compare, digest, methods, recordId, snapshotId } from '../identity.js';
import type { DiscoveryResult, ModuleAnalysis } from '../evaluation.js';
import type { ClaimContextRecord, ModuleFacet, ProgramRecord, ProgramRecordStore, RecordId, SourceEvidenceRecord } from '../records.js';
import { captureInputs } from './inputs.js';

const method = `${methods.discovery};typescript@${ts.version}`;
const identityMethod = methods.inputs;
const limitation = 'Population is configured Program external-module SourceFiles and visible named ambient-module symbols; other compiler module categories are not established.';

export type ProjectOpenResult =
  | { readonly status: 'opened'; readonly analysis: ModuleAnalysis }
  | { readonly status: 'project-open-failed'; readonly diagnostics: readonly { readonly code: number; readonly message: string }[] };

export interface ProjectOptions {
  readonly configPath: string;
  /** Every known generated-output destination must be supplied before any filesystem evidence is read. */
  readonly excludedOutputDirectories?: readonly string[];
}

/** Operational setup follows TS config inheritance/selection/resolution without executing target code. */
export function openTypeScriptProject(options: ProjectOptions): ProjectOpenResult {
  const configPath = path.resolve(options.configPath);
  const base = path.dirname(configPath);
  const inputs = captureInputs([
    path.join(base, '_observations'), path.join(base, '_build'),
    ...(options.excludedOutputDirectories ?? []),
  ]);
  const diagnostics: ts.Diagnostic[] = [];
  const parsed = ts.getParsedCommandLineOfConfigFile(configPath, { noEmit: true }, {
    ...inputs.system,
    readFile: name => {
      const text = inputs.system.readFile(name);
      if (text !== undefined) {
        const syntax = ts.parseConfigFileTextToJson(name, text);
        if (syntax.error) diagnostics.push(syntax.error);
      }
      return text;
    },
    onUnRecoverableConfigFileDiagnostic: diagnostic => diagnostics.push(diagnostic),
  });
  // An empty configured selection is meaningful, including `files: []`.
  const isEmpty = (diagnostic: ts.Diagnostic) => diagnostic.code === 18002 || diagnostic.code === 18003;
  diagnostics.push(...(parsed?.errors.filter(diagnostic => !isEmpty(diagnostic)) ?? []));
  const failure = (): ProjectOpenResult => ({
    status: 'project-open-failed',
    diagnostics: diagnostics.map(diagnostic => ({
      code: diagnostic.code, message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    })),
  });
  if (!parsed || diagnostics.length > 0) return failure();
  const host = ts.createCompilerHost(parsed.options, true);
  host.readFile = inputs.system.readFile;
  host.fileExists = inputs.system.fileExists;
  host.directoryExists = inputs.system.directoryExists;
  host.getDirectories = inputs.system.getDirectories;
  host.realpath = inputs.system.realpath!;
  host.readDirectory = inputs.system.readDirectory;
  host.getCurrentDirectory = () => base;
  host.writeFile = () => { throw new Error('Analysis must not emit'); };
  host.getSourceFile = (name, languageVersion, onError) => {
    const text = host.readFile(name);
    if (text === undefined) {
      onError?.('Source input unavailable');
      return undefined;
    }
    return ts.createSourceFile(name, text, languageVersion, true);
  };
  const program = ts.createProgram({
    rootNames: parsed.fileNames.filter(name => !inputs.excluded(name)), options: parsed.options, host,
    ...(parsed.projectReferences ? { projectReferences: parsed.projectReferences } : {}),
    configFileParsingDiagnostics: parsed.errors.filter(diagnostic => !isEmpty(diagnostic)),
  });
  diagnostics.push(...program.getOptionsDiagnostics(), ...program.getConfigFileParsingDiagnostics());
  if (diagnostics.length > 0) return failure();

  // Compiler state never escapes the language integration. Discovery writes domain records atomically.
  return { status: 'opened', analysis: { discover: store => discover(store) } };

  function discover(store: ProgramRecordStore): DiscoveryResult {
    const checker = program.getTypeChecker();
    const files = [...program.getSourceFiles()].sort((a, b) => compare(a.fileName, b.fileName));
    const encountered = program.getSyntacticDiagnostics();
    const roots = new Set(program.getRootFileNames());
    const candidates: { key: string; name: string | null; compilerName: string | null;
      declarations: readonly ts.Declaration[]; facets: ModuleFacet[] }[] = [];
    for (const file of files) {
      if (!ts.isExternalModule(file)) continue;
      candidates.push({
        key: `source:${host.getCanonicalFileName(file.fileName)}`, name: file.moduleName ?? null,
        compilerName: checker.getSymbolAtLocation(file)?.getName() ?? null, declarations: [file],
        facets: [program.isSourceFileFromExternalLibrary(file) ? 'external' : 'project',
          file.isDeclarationFile ? 'declaration-only' : 'implementation-available'],
      });
    }
    for (const symbol of checker.getAmbientModules()) {
      const declarations = symbol.getDeclarations() ?? [];
      candidates.push({
        key: `ambient:${symbol.getName()}`, name: symbol.getName().replace(/^"|"$/g, ''),
        compilerName: symbol.getName(), declarations,
        facets: ['ambient', ...(declarations.length > 0 && declarations.every(declaration =>
          declaration.getSourceFile().isDeclarationFile || (ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Ambient) !== 0)
          ? ['declaration-only' as const] : [])],
      });
    }
    candidates.sort((a, b) => compare(a.key, b.key));
    const snapshot = snapshotId({
      method, methods, configPath, cwd: base, node: process.versions.node,
      platform: process.platform, arch: process.arch, inputs: inputs.identity(),
      options: parsed!.options, roots: program.getRootFileNames(),
      sources: files.map(file => [file.fileName, digest(file.text)]),
      population: candidates.map(candidate => candidate.key),
    });
    const records: ProgramRecord[] = [{
      kind: 'snapshot', id: snapshot, snapshot, method: identityMethod,
      inputDigest: snapshot.slice('snapshot:'.length), methods: [...Object.values(methods), method],
    }];
    const evidence = (declaration: ts.Declaration, compilerName: string | null): RecordId => {
      const file = declaration.getSourceFile();
      const start = ts.isSourceFile(declaration) ? 0 : declaration.getStart(file);
      const detail: SourceEvidenceRecord = {
        kind: 'source-evidence', id: recordId(snapshot, 'source', [file.fileName, start, declaration.end, compilerName]),
        snapshot, method, path: file.fileName, contentDigest: digest(file.text),
        start, length: declaration.end - start, configuredRoot: roots.has(file.fileName), compilerName,
      };
      records.push(detail);
      return detail.id;
    };
    const qualifications = (sourceFiles: readonly ts.SourceFile[], projectWide: boolean) => encountered
      // Syntax diagnostics normally have files; a future file-less result belongs only to project context.
      .filter(diagnostic => diagnostic.file === undefined ? projectWide : sourceFiles.includes(diagnostic.file))
      .map(diagnostic => ({ code: diagnostic.code, category: ts.DiagnosticCategory[diagnostic.category]!.toLowerCase() }))
      .sort((a, b) => a.code - b.code || compare(a.category, b.category));
    const makeContext = (scope: 'configured-project' | RecordId, evidenceIds: readonly RecordId[], sourceFiles: readonly ts.SourceFile[]): RecordId => {
      const relevant = qualifications(sourceFiles, scope === 'configured-project');
      const context: ClaimContextRecord = {
        kind: 'claim-context', id: recordId(snapshot, 'context', scope), snapshot, method,
        scope, evidence: [...new Set(evidenceIds)], status: 'mechanically-derived',
        guarantee: relevant.length > 0
          ? 'Compiler-established module information with encountered syntax diagnostics; correctness is qualified.'
          : 'Module membership established by the supported TypeScript compiler operations.',
        limitations: [limitation, 'Configured generated-output locations are explicitly excluded from repository evidence.',
          'No atomic filesystem snapshot is claimed; inputs are memoized as first observed.',
          ...(relevant.length > 0 ? ['Encountered syntax diagnostics may limit the module interpretation.'] : [])],
        diagnostics: relevant,
      };
      records.push(context);
      return context.id;
    };
    const globalContext = makeContext('configured-project', files.map(file => evidence(file, null)), files);
    const moduleIds: RecordId[] = [];
    for (const [index, candidate] of candidates.entries()) {
      const id = recordId(snapshot, 'module', candidate.key);
      const claim = recordId(snapshot, 'claim', id);
      const context = makeContext(id, candidate.declarations.map(declaration => evidence(declaration, candidate.compilerName)),
        candidate.declarations.map(declaration => declaration.getSourceFile()));
      records.push({ kind: 'module', id, snapshot, method, claim }, {
        kind: 'claim', id: claim, snapshot, method, subject: id, context,
        information: { type: 'module', name: candidate.name,
          handle: `module-${snapshot.slice(9, 21)}-${index + 1}`, handleStatus: 'generated-navigation-aid',
          facets: candidate.facets },
      });
      moduleIds.push(id);
    }
    store.put(records);
    return {
      snapshot, modules: moduleIds, contexts: [globalContext], applicability: 'applicable', availability: 'available',
      execution: 'completed', materialization: 'full', reason: null, cost: { measure: 'module-count', value: moduleIds.length },
    };
  }
}

/** Manual compiler investigation, not a provider or an automatic test. Never executes target code. */
import path from 'node:path';
import ts from 'typescript';
import { captureInputs } from '../src/lib/typescript/inputs.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { canonical, digest } from '../src/lib/identity.js';
import { isModuleClaim } from '../src/lib/records.js';

const configPath = path.resolve(process.argv[2]!);
const root = path.dirname(configPath);
const captured = captureInputs([]);
const parsed = ts.getParsedCommandLineOfConfigFile(configPath, {}, {
  ...captured.system, onUnRecoverableConfigFileDiagnostic: diagnostic => { throw new Error(String(diagnostic.messageText)); },
});
if (!parsed) throw new Error('Configuration not parsed');
const host = ts.createCompilerHost(parsed.options, true);
host.readFile = captured.system.readFile;
host.fileExists = captured.system.fileExists;
host.directoryExists = captured.system.directoryExists;
host.getDirectories = captured.system.getDirectories;
host.realpath = captured.system.realpath!;
host.readDirectory = captured.system.readDirectory;
host.getCurrentDirectory = () => root;
host.getSourceFile = (name, languageVersion) => {
  const text = host.readFile(name);
  return text === undefined ? undefined : ts.createSourceFile(name, text, languageVersion, true);
};
host.writeFile = () => { throw new Error('Investigation must not emit'); };
// Intentionally inspect public compiler facts even when operational opening fails.
// Diagnostics below prevent this from masquerading as a successful product run.
const program = ts.createProgram(parsed.fileNames, parsed.options, host);
const checker = program.getTypeChecker();
const roots = new Set(program.getRootFileNames());
const relative = (name: string) => path.relative(root, name).split(path.sep).join('/');
const ambient = checker.getAmbientModules();
const calls: unknown[] = [];
const importTypes: unknown[] = [];
const location = (node: ts.Node) => {
  const file = node.getSourceFile();
  const point = file.getLineAndCharacterOfPosition(node.getStart(file));
  return { file: relative(file.fileName), line: point.line + 1, column: point.character + 1 };
};
for (const file of program.getSourceFiles()) {
  const name = relative(file.fileName);
  // Report the survey's core slice while leaving the configured Program unchanged.
  if (!name.startsWith('src/') || name.startsWith('src/test/')) continue;
  const visit = (node: ts.Node): void => {
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteralLike(node.argument.literal)) {
      const symbol = checker.getSymbolAtLocation(node.argument.literal);
      importTypes.push({ ...location(node), literal: node.argument.literal.text, isTypeOf: node.isTypeOf,
        targetDeclarations: symbol?.declarations?.map(declaration => relative(declaration.getSourceFile().fileName)) ?? [] });
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require' && node.arguments.length === 1) {
      const argument = node.arguments[0]!;
      const symbol = checker.getSymbolAtLocation(node.expression);
      const literal = ts.isStringLiteralLike(argument) ? argument.text : null;
      const resolved = literal === null ? undefined : ts.resolveModuleName(literal, file.fileName,
        parsed.options, host, undefined, undefined, ts.ModuleKind.CommonJS).resolvedModule;
      const target = resolved && program.getSourceFile(resolved.resolvedFileName);
      const ambientTarget = literal === null ? undefined : ambient.find(module => module.name === JSON.stringify(literal));
      calls.push({ ...location(node), literal, expression: argument.getText(file), sourceRoot: roots.has(file.fileName),
        sourceExternalModule: ts.isExternalModule(file), impliedNodeFormat: file.impliedNodeFormat ?? null,
        locallyBound: checker.resolveName('require', node.expression, ts.SymbolFlags.Value, true) !== undefined,
        callSignatures: checker.getTypeAtLocation(node.expression).getCallSignatures().length,
        bindingDeclarations: symbol?.declarations?.map(declaration => ({ file: relative(declaration.getSourceFile().fileName),
          kind: ts.SyntaxKind[declaration.kind], declarationFile: declaration.getSourceFile().isDeclarationFile })) ?? [],
        resolution: resolved ? { file: relative(resolved.resolvedFileName), root: roots.has(resolved.resolvedFileName),
          inProgram: target !== undefined, supportedSourceModule: target ? ts.isExternalModule(target) : false,
          externalLibrary: target ? program.isSourceFileFromExternalLibrary(target) : null } : null,
        exactAmbientTarget: ambientTarget?.name ?? null });
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
}
const opened = openTypeScriptProject({ configPath });
const baselinePath = process.argv[3] ? path.resolve(process.argv[3]) : null;
const baseline = baselinePath ? ts.getParsedCommandLineOfConfigFile(baselinePath, {}, {
  ...captured.system, onUnRecoverableConfigFileDiagnostic: diagnostic => { throw new Error(String(diagnostic.messageText)); },
}) : null;
const baselineOpen = baselinePath ? openTypeScriptProject({ configPath: baselinePath }) : null;
let productionDiscovery: unknown = null;
if (opened.status === 'opened') {
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateModules(store, opened.analysis);
  const surveyedTargets: unknown[] = [];
  for (const id of evaluation.modules) {
    const module = store.get(id);
    if (module.kind !== 'module') throw new Error('Invalid discovered module');
    const claim = store.get(module.claim);
    if (!isModuleClaim(claim)) throw new Error('Invalid module claim');
    const context = store.get(claim.context);
    if (context.kind !== 'claim-context') throw new Error('Invalid module context');
    for (const evidenceId of context.evidence) {
      const evidence = store.get(evidenceId);
      if (evidence.kind === 'source-evidence' && evidence.location.association === 'file'
        && ['src/child/child-loader.ts', 'src/esm.ts'].includes(relative(evidence.path))) {
        surveyedTargets.push({ path: relative(evidence.path), facets: claim.information.facets });
      }
    }
  }
  productionDiscovery = { execution: evaluation.execution, materialization: evaluation.materialization,
    moduleCount: evaluation.modules.length, surveyedTargets };
}
const baselineRoots = baseline?.fileNames.map(relative).sort();
const currentRoots = [...roots].map(relative).sort();
if (baselineRoots && canonical(baselineRoots) !== canonical(currentRoots)) throw new Error('Adaptation changed source selection');
console.log(JSON.stringify({ compiler: ts.version, node: process.versions.node,
  operationalOpen: opened.status === 'opened' ? { status: opened.status } : opened,
  productionDiscovery, dependencyProviderExercised: false, configurationChangedByProbe: false,
  adaptation: baseline ? {
    baseline: relative(baselinePath!), selected: relative(configPath),
    originalOpen: baselineOpen?.status === 'project-open-failed' ? baselineOpen : { status: baselineOpen?.status },
    identicalRoots: true, rootsDigest: digest(currentRoots), roots: currentRoots,
    changedOptions: [...new Set([...Object.keys(baseline.options), ...Object.keys(parsed.options)])]
      .filter(key => key !== 'configFilePath' && canonical(baseline.options[key] ?? null) !== canonical(parsed.options[key] ?? null))
      .map(key => ({ option: key, before: baseline.options[key] ?? null, after: parsed.options[key] ?? null })),
  } : null,
  diagnostics: [...parsed.errors, ...program.getOptionsDiagnostics()].map(diagnostic => ({ code: diagnostic.code,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n') })),
  module: parsed.options.module, moduleResolution: parsed.options.moduleResolution,
  rootCount: roots.size, programFileCount: program.getSourceFiles().length,
  coreRootFiles: [...roots].map(relative).filter(name => name.startsWith('src/') && !name.startsWith('src/test/')).sort(),
  calls, importTypes,
}, null, 2));

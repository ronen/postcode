import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';

// Compiler characterization for the dependency provider, not a second provider.
// Assertions describe public API evidence; recognition policy is reviewed separately.
const config = path.resolve('fixtures/dependency-contract/tsconfig.json');
function open() {
  const parsed = ts.getParsedCommandLineOfConfigFile(config, {}, {
    ...ts.sys, onUnRecoverableConfigFileDiagnostic: diagnostic => assert.fail(String(diagnostic.messageText)),
  });
  assert.ok(parsed);
  assert.deepEqual(parsed.errors, []);
  const host = ts.createCompilerHost(parsed.options, true);
  // Match the existing input-capturing host's SourceFile construction.
  host.getSourceFile = (name, languageVersion) => {
    const text = host.readFile(name);
    return text === undefined ? undefined : ts.createSourceFile(name, text, languageVersion, true);
  };
  const program = ts.createProgram(parsed.fileNames, parsed.options, host);
  const checker = program.getTypeChecker();
  const file = program.getSourceFile(path.resolve('fixtures/dependency-contract/requests.cts'))!;
  return { program, checker, file, host };
}
function nodes(root: ts.Node): ts.Node[] {
  const result: ts.Node[] = [];
  const visit = (node: ts.Node): void => { result.push(node); ts.forEachChild(node, visit); };
  visit(root);
  return result;
}
function bareRequires(file: ts.SourceFile) {
  return nodes(file).filter(ts.isCallExpression)
    .filter(node => ts.isIdentifier(node.expression) && node.expression.text === 'require');
}

test('dependency contract: supported request syntax preserves mechanism and explicit type evidence', () => {
  const { file, program } = open();
  assert.equal(ts.version, '6.0.3');
  assert.deepEqual(program.getSyntacticDiagnostics(), []);
  const imports = file.statements.filter(ts.isImportDeclaration);
  assert.equal(imports.length, 5);
  assert.equal(imports[1]!.importClause, undefined); // Side-effect form.
  assert.equal(imports[2]!.importClause!.isTypeOnly, true);
  const typeElements = imports[3]!.importClause!.namedBindings!;
  assert.ok(ts.isNamedImports(typeElements));
  assert.deepEqual(typeElements.elements.map(element => element.isTypeOnly), [true]);
  const mixed = imports[4]!.importClause!.namedBindings!;
  assert.ok(ts.isNamedImports(mixed));
  assert.deepEqual(mixed.elements.map(element => element.isTypeOnly), [true, false]);
  const exports = file.statements.filter(ts.isExportDeclaration);
  assert.equal(exports.length, 5);
  assert.equal(exports[0]!.exportClause, undefined);
  assert.ok(ts.isNamespaceExport(exports[1]!.exportClause!));
  assert.equal(exports[2]!.isTypeOnly, true);
  assert.ok(ts.isNamedExports(exports[3]!.exportClause!));
  assert.ok(ts.isNamedExports(exports[4]!.exportClause!));
  assert.equal(exports[4]!.exportClause.elements.length, 0);
  assert.deepEqual(file.statements.filter(ts.isImportEqualsDeclaration).map(node => node.isTypeOnly), [false, true]);
  assert.deepEqual(nodes(file).filter(ts.isImportTypeNode).map(node => node.isTypeOf), [false, true]);
  const dynamic = nodes(file).filter(ts.isCallExpression).filter(node => node.expression.kind === ts.SyntaxKind.ImportKeyword);
  assert.deepEqual(dynamic.map(node => ts.isStringLiteralLike(node.arguments[0]!)), [true, true, false, false, true]);
});

test('dependency contract: direct re-exports resolve to the intermediate module, not its export origin', () => {
  const { file, checker, program } = open();
  const request = file.statements.filter(ts.isExportDeclaration)[0]!;
  const target = checker.getSymbolAtLocation(request.moduleSpecifier!)!;
  const forward = program.getSourceFile(path.resolve('fixtures/dependency-contract/forward.ts'))!;
  assert.equal(target, checker.getSymbolAtLocation(forward));
  const value = checker.getExportsOfModule(target).find(symbol => symbol.name === 'value')!;
  assert.ok(value.flags & ts.SymbolFlags.Alias);
  assert.equal(path.basename(checker.getAliasedSymbol(value).declarations![0]!.getSourceFile().fileName), 'target.ts');
});

test('dependency contract: static, dynamic, import-type and import-equals literal symbols identify the same module', () => {
  const { file, checker, program } = open();
  const target = checker.getSymbolAtLocation(program.getSourceFile(path.resolve('fixtures/dependency-contract/target.ts'))!);
  const requests = nodes(file).filter(ts.isStringLiteralLike).filter(node => node.text === './target.js'
    && (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)
      || ts.isExternalModuleReference(node.parent) || ts.isLiteralTypeNode(node.parent)
      || (ts.isCallExpression(node.parent) && node.parent.expression.kind === ts.SyntaxKind.ImportKeyword)));
  assert.equal(requests.length, 15);
  assert.ok(requests.every(node => checker.getSymbolAtLocation(node) === target));
  const missing = nodes(file).filter(ts.isStringLiteralLike).find(node => node.text === './missing.js')!;
  assert.equal(checker.getSymbolAtLocation(missing), undefined);
});

test('dependency contract: require literal lookup differs between TypeScript and JavaScript', () => {
  const { file, checker, program, host } = open();
  const call = bareRequires(file)[0]!;
  assert.equal(checker.getSymbolAtLocation(call.arguments[0]!), undefined);
  const resolved = ts.resolveModuleName('./target.js', file.fileName, program.getCompilerOptions(), host,
    undefined, undefined, ts.ModuleKind.CommonJS).resolvedModule;
  assert.equal(resolved?.resolvedFileName, path.resolve('fixtures/dependency-contract/target.ts'));
  const js = program.getSourceFile(path.resolve('fixtures/dependency-contract/script.js'))!;
  assert.equal(checker.getSymbolAtLocation(bareRequires(js)[0]!.arguments[0]!),
    checker.getSymbolAtLocation(program.getSourceFile(resolved!.resolvedFileName)!));
  assert.equal(ts.isExternalModule(js), true);
});

test('dependency contract: successful require resolution does not add a file to the configured Program population', () => {
  const { file, program, host } = open();
  const resolved = ts.resolveModuleName('./require-only.js', file.fileName, program.getCompilerOptions(), host,
    undefined, undefined, ts.ModuleKind.CommonJS).resolvedModule;
  assert.ok(resolved);
  assert.equal(path.basename(resolved.resolvedFileName), 'require-only.ts');
  assert.equal(program.getSourceFile(resolved.resolvedFileName), undefined);
  assert.equal(ts.resolveModuleName('./missing.js', file.fileName, program.getCompilerOptions(), host,
    undefined, undefined, ts.ModuleKind.CommonJS).resolvedModule, undefined);
});

test('dependency contract: scope lookup distinguishes globals from parameters, hoisting and temporal-dead-zone bindings', () => {
  const { file, checker } = open();
  const calls = bareRequires(file);
  assert.equal(calls.length, 10);
  assert.deepEqual(calls.map(call => checker.resolveName('require', call.expression, ts.SymbolFlags.Value, true)
    ?.declarations?.map(node => ts.SyntaxKind[node.kind]) ?? []),
  [[], [], [], [], [], ['Parameter'], ['FunctionDeclaration'], ['VariableDeclaration'], [], []]);
  assert.equal(path.basename(checker.getSymbolAtLocation(calls[0]!.expression)!.declarations![0]!.getSourceFile().fileName), 'globals.d.ts');
  assert.equal(checker.getTypeAtLocation(calls[0]!.expression).getCallSignatures().length, 1);
  // Shape alone cannot qualify a request: these remain syntactically separable.
  assert.equal(calls.filter(call => call.arguments.length === 1).length, 8);
  const propertyCalls = nodes(file).filter(ts.isCallExpression).filter(call => ts.isPropertyAccessExpression(call.expression));
  assert.deepEqual(propertyCalls.map(call => call.expression.getText()), ['loader.require', 'require.resolve']);
});

test('dependency contract: ESM format and an ambient require declaration are separate evidence, neither proves a loader', () => {
  const { file, checker, program } = open();
  const esm = program.getSourceFile(path.resolve('fixtures/dependency-contract/esm.mts'))!;
  assert.equal(file.impliedNodeFormat, ts.ModuleKind.CommonJS);
  assert.equal(esm.impliedNodeFormat, ts.ModuleKind.ESNext);
  assert.equal(checker.resolveName('require', bareRequires(esm)[0]!.expression, ts.SymbolFlags.Value, true), undefined);
  assert.equal(checker.getTypeAtLocation(bareRequires(esm)[0]!.expression).getCallSignatures().length, 1);
});

test('dependency contract: merged named ambient modules retain occurrence-specific declaration ownership', () => {
  const { checker } = open();
  const parent = checker.getAmbientModules().find(symbol => symbol.name === '"ambient-parent"')!;
  const target = checker.getAmbientModules().find(symbol => symbol.name === '"ambient-target"')!;
  assert.equal(parent.declarations!.length, 2);
  const owned = parent.declarations!.map(declaration => nodes(declaration).filter(ts.isStringLiteralLike)
    .filter(node => node.text === 'ambient-target'));
  assert.deepEqual(owned.map(group => group.length), [3, 1]);
  for (const declaration of parent.declarations!) {
    assert.ok(ts.isModuleDeclaration(declaration));
    assert.equal(checker.getSymbolAtLocation(declaration.name), parent);
  }
  assert.ok(owned.flat().every(node => checker.getSymbolAtLocation(node) === target));
});

test('dependency contract: resolution mode selects distinct package export conditions', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-contract-'));
  try {
    const pkg = path.join(root, 'node_modules/conditional');
    mkdirSync(pkg, { recursive: true });
    writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ name: 'conditional', exports: {
      '.': { import: './import.d.mts', require: './require.d.cts' },
    } }));
    for (const name of ['import.d.mts', 'require.d.cts']) writeFileSync(path.join(pkg, name), 'export const marker: number;');
    const options = { module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext };
    const importer = path.join(root, 'entry.mts');
    const resolve = (mode: ts.ResolutionMode) => ts.resolveModuleName('conditional', importer, options,
      ts.sys, undefined, undefined, mode).resolvedModule!;
    assert.equal(path.basename(resolve(ts.ModuleKind.ESNext).resolvedFileName), 'import.d.mts');
    assert.equal(path.basename(resolve(ts.ModuleKind.CommonJS).resolvedFileName), 'require.d.cts');
    assert.equal(resolve(ts.ModuleKind.CommonJS).isExternalLibraryImport, true);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('dependency contract: absent require evidence and local import aliases remain distinguishable', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-context-'));
  try {
    const files: Record<string, string> = {
      'missing.mts': "export {}; require('unresolved');",
      'alias.mts': "import { value as require } from './target.mjs'; require('unresolved');",
      'target.mts': 'export const value = (name: string) => name;',
      'local.cts': "declare function require(name: string): unknown; export {}; require('unresolved');",
    };
    for (const [name, text] of Object.entries(files)) writeFileSync(path.join(root, name), text);
    const program = ts.createProgram(Object.keys(files).map(name => path.join(root, name)), {
      noLib: true, types: [], module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
    });
    const checker = program.getTypeChecker();
    const call = (name: string) => bareRequires(program.getSourceFile(path.join(root, name))!)[0]!;
    assert.equal(checker.getSymbolAtLocation(call('missing.mts').expression), undefined);
    assert.equal(checker.resolveName('require', call('missing.mts').expression, ts.SymbolFlags.Value, true), undefined);
    const alias = checker.resolveName('require', call('alias.mts').expression, ts.SymbolFlags.Value, true)!;
    assert.ok(alias.flags & ts.SymbolFlags.Alias);
    const local = checker.resolveName('require', call('local.cts').expression, ts.SymbolFlags.Value, true)!;
    assert.equal(local.declarations![0]!.getSourceFile().fileName, path.join(root, 'local.cts'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('dependency contract: module declarations and augmentations require symbol membership, not just syntax ownership', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-owner-'));
  try {
    const files: Record<string, string> = {
      'ambient.d.ts': "declare module 'named' { namespace Nested { type T = import('target').T; } } declare module 'target' { export type T = string; }",
      'augmentation.ts': "export {}; declare module './target.js' { interface Extra { value: import('target').T } }",
      'target.ts': 'export interface Original { value: string }',
    };
    for (const [name, text] of Object.entries(files)) writeFileSync(path.join(root, name), text);
    const program = ts.createProgram(Object.keys(files).map(name => path.join(root, name)), {
      noLib: true, types: [], module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
    });
    const checker = program.getTypeChecker();
    const ambient = checker.getAmbientModules();
    assert.deepEqual(ambient.map(symbol => symbol.name).sort(), ['"named"', '"target"']);
    const named = ambient.find(symbol => symbol.name === '"named"')!;
    const nested = nodes(named.declarations![0]!).filter(ts.isModuleDeclaration).find(node => node.name.getText() === 'Nested')!;
    assert.ok(checker.getSymbolAtLocation(nested.name));
    assert.equal(ambient.includes(checker.getSymbolAtLocation(nested.name)!), false);
    const augmentationFile = program.getSourceFile(path.join(root, 'augmentation.ts'))!;
    const augmentation = augmentationFile.statements.filter(ts.isModuleDeclaration)[0]!;
    const augmented = checker.getSymbolAtLocation(augmentation.name)!;
    assert.equal(augmented, checker.getSymbolAtLocation(program.getSourceFile(path.join(root, 'target.ts'))!));
    assert.notEqual(augmented, checker.getSymbolAtLocation(augmentationFile));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('dependency contract: re-exports-only syntax rule ignores only comments and EmptyStatement', () => {
  const positive = [
    "export { value } from './target.js';", "export * from './target.js';",
    "export * as values from './target.js';", "export type { Shape } from './target.js';",
    "export type * from './target.js';", "export type * as shapes from './target.js';",
    "export { type Shape } from './target.js';", "export {} from './target.js';",
  ];
  const blockers = [
    "import './target.js';", "import type { Shape } from './target.js';",
    'const value = 1;', 'declare const value: number;', 'interface Shape {}', 'type Shape = string;',
    'function value() {}', 'class Value {}', 'enum Value {}', 'namespace Value {}',
    'value();', 'if (false) value();', 'export = value;', 'export default value;', 'export { value };', 'export {};',
    "'use strict';", 'debugger;', 'declare global { interface Value {} }',
  ];
  // A candidate exhaustive predicate, tested against syntax kinds; no semantic purity claim.
  const qualifies = (source: string) => {
    const file = ts.createSourceFile('composition.ts', source, ts.ScriptTarget.Latest, true);
    const substantive = file.statements.filter(statement => !ts.isEmptyStatement(statement));
    return substantive.length > 0 && substantive.every(statement => ts.isExportDeclaration(statement)
      && statement.moduleSpecifier !== undefined && ts.isStringLiteralLike(statement.moduleSpecifier));
  };
  for (const source of positive) assert.equal(qualifies(`// comment\n; ${source} ;`), true, source);
  for (const blocker of blockers) assert.equal(qualifies(`${positive[0]}\n${blocker}`), false, blocker);
  for (const empty of ['', '// only a comment', ';;;']) assert.equal(qualifies(empty), false, empty);
});

test('dependency contract: request syntax can survive diagnostics without implying a sound complete interpretation', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-diagnostics-'));
  try {
    const fileName = path.join(root, 'broken.ts');
    writeFileSync(fileName, "import './missing.js'; export const broken = ;");
    const program = ts.createProgram([fileName], { noLib: true, types: [] });
    const file = program.getSourceFile(fileName)!;
    assert.ok(program.getSyntacticDiagnostics(file).some(diagnostic => diagnostic.code === 1109));
    const request = file.statements.filter(ts.isImportDeclaration)[0]!;
    assert.equal(request.moduleSpecifier.getText(file), "'./missing.js'");
    assert.equal(program.getTypeChecker().getSymbolAtLocation(request.moduleSpecifier), undefined);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

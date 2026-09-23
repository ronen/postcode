import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { normalizeSession, inputBasis } from './helpers.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import type { DependencyCoverageRecord, DependencyEvaluationRecord, DependencyOccurrenceRecord, DependencyRelationshipClaim } from '../src/lib/dependencies/records.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { ModuleClaim, ProgramRecord, RecordId, SourceEvidenceRecord } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';

function analyze(config: string, excludedOutputDirectories: readonly string[] = []) {
  const opened = openTypeScriptProject({ configPath: config, excludedOutputDirectories });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error(JSON.stringify(opened));
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateDependencies(store, opened.analysis);
  const occurrences = evaluation.occurrences.map(id => store.get(id) as DependencyOccurrenceRecord);
  const relationships = evaluation.relationships.map(id => store.get(id) as DependencyRelationshipClaim);
  const coverage = evaluation.coverage.map(id => store.get(id) as DependencyCoverageRecord);
  const source = (record: DependencyOccurrenceRecord | DependencyCoverageRecord) => store.get(record.evidence) as SourceEvidenceRecord;
  const name = (id: RecordId) => {
    const module = store.get(id);
    assert.equal(module.kind, 'module');
    if (module.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(module.claim) as ModuleClaim;
    return claim.information.name ?? claim.information.handle;
  };
  return { store, evaluation, occurrences, relationships, coverage, source, name };
}
function temporary(files: Record<string, string>, run: (root: string) => void, options: object = {}, roots?: string[]) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependencies-'));
  try {
    for (const [name, text] of Object.entries(files)) {
      const file = path.join(root, name);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, text);
    }
    writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({
      compilerOptions: { target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', noLib: true, types: [], ...options },
      files: roots ?? Object.keys(files).filter(name => /\.[cm]?[jt]s$/.test(name) && !name.includes('node_modules')),
    }));
    run(root);
  } finally { rmSync(root, { recursive: true, force: true }); }
}
const fixture = (name: string) => path.resolve('fixtures', name, 'tsconfig.json');

test('production dependencies retain supported mechanisms, direct intermediates and every aggregated occurrence', () => {
  const result = analyze(fixture('dependency-contract'));
  const { occurrences, relationships, coverage, source, name, evaluation } = result;
  assert.equal(evaluation.execution, 'completed');
  assert.equal(evaluation.materialization, 'full');
  const owned = occurrences.filter(item => name(item.owner) === 'requests');
  assert.equal(owned.length, 25);
  assert.deepEqual(owned.map(item => item.mechanism), [
    'static-import', 'side-effect-import', 'static-import', 'static-import', 'static-import', 'static-import',
    're-export', 're-export', 're-export', 're-export', 're-export', 'import-equals', 'import-equals', 'import-type', 'import-type',
    'dynamic-import', 'dynamic-import', 'dynamic-import', 'dynamic-import', 'dynamic-import',
    'commonjs', 'commonjs', 'commonjs', 'commonjs', 'commonjs',
  ]);
  assert.deepEqual(owned.map(item => item.typeOnly), [false, false, true, true, false, false,
    false, false, true, true, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false]);
  assert.deepEqual(owned.filter(item => item.targetStatus !== 'resolved').map(item =>
    [item.mechanism, item.targetStatus, source(item).dependencyResolution!.writtenSpecifier]), [
    ['dynamic-import', 'target-indeterminate', null], ['dynamic-import', 'target-indeterminate', null],
    ['dynamic-import', 'unresolved', './missing.js'], ['commonjs', 'outside-population', './require-only.js'],
    ['commonjs', 'unresolved', './missing.js'], ['commonjs', 'target-indeterminate', null],
  ]);
  const edges = relationships.filter(item => name(item.subject) === 'requests');
  assert.deepEqual(edges.map(item => name(item.information.child)).sort(), ['forward', 'target']);
  const target = edges.find(item => name(item.information.child) === 'target')!;
  assert.equal(target.information.typeOnly, false);
  assert.equal(target.information.occurrences.length, 18);
  assert.equal(new Set(relationships.flatMap(item => item.information.occurrences)).size,
    occurrences.filter(item => item.targetStatus === 'resolved').length);
  assert.equal(coverage.filter(item => name(item.owner!) === 'requests' && item.outcome === 'alternative-binding').length, 3);
  assert.equal(coverage.filter(item => item.outcome === 'outside-commonjs-shape').length, 2);
  assert.ok(occurrences.some(item => name(item.owner) === 'script' && item.mechanism === 'commonjs'));
  assert.ok(coverage.some(item => item.outcome === 'unsupported-format' && item.commonjs?.format === 'esm-file'));
  const ambient = relationships.find(item => name(item.subject) === 'ambient-parent')!;
  assert.equal(name(ambient.information.child), 'ambient-target');
  assert.equal(ambient.information.occurrences.length, 4);
});

test('production recognition applies classic, mixed and preserve context precedence', () => {
  for (const [mode, format] of [['classic', 'commonjs-option'], ['mixed', 'commonjs-file'], ['preserve', 'preserve-option']] as const) {
    const { occurrences, coverage } = analyze(fixture(`dependency-context/${mode}`));
    assert.ok(occurrences.some(item => item.commonjs?.format === format && item.commonjs.binding === 'callable-ambient'));
    if (mode !== 'classic') assert.ok(coverage.some(item => item.commonjs?.format === 'esm-file' && item.outcome === 'unsupported-format'));
  }
});

test('production declaration evidence distinguishes same-kind implementations, named annotations, conflicts and insufficiency', () => {
  const cases = [
    ['', 'recognized', 'absent'],
    ['var require = (name) => name;', 'alternative-binding', 'alternative'],
    ['function require(name: string) { return name; }', 'alternative-binding', 'alternative'],
    ['declare var require: (name: string) => unknown;', 'recognized', 'callable-ambient'],
    ['interface Requireish { (name: string): unknown } declare var require: Requireish;', 'recognized', 'callable-ambient'],
    ['type Requireish = (name: string) => unknown; declare var require: Requireish;', 'recognized', 'callable-ambient'],
    ['declare function require(name: string): unknown;', 'recognized', 'callable-ambient'],
    ['declare var require: string;', 'alternative-binding', 'alternative'],
    ['declare var require: (name: string) => unknown; declare var require: string;', 'conflicting-binding-evidence', 'conflicting'],
    ['declare var require: MissingType;', 'insufficient-binding-evidence', 'insufficient'],
    ['declare var require: unknown;', 'insufficient-binding-evidence', 'insufficient'],
    ['declare var require;', 'insufficient-binding-evidence', 'insufficient'],
  ];
  for (const [declarations, outcome, binding] of cases) {
    temporary({ 'entry.ts': "export {}; require('./target');", 'target.ts': 'export {};', 'globals.ts': declarations! }, root => {
      const result = analyze(path.join(root, 'tsconfig.json'));
      const records = [...result.occurrences, ...result.coverage];
      assert.equal(records.length, 1, declarations);
      assert.equal(records[0]!.commonjs?.outcome, outcome, declarations);
      assert.equal(records[0]!.commonjs?.binding, binding, declarations);
      assert.equal(result.relationships.length, outcome === 'recognized' ? 1 : 0, declarations);
    }, { module: 'CommonJS', moduleResolution: 'Node10', ignoreDeprecations: '6.0' });
  }
});

test('production missing declaration evidence permits CommonJS but not preserve or unset-mode fallback', () => {
  for (const [module, expected] of [['CommonJS', 'recognized'], ['Preserve', 'insufficient-context'], [null, 'insufficient-context']] as const) {
    temporary({ 'entry.ts': "export {}; require('./target');", 'target.ts': 'export {};' }, root => {
      const config = path.join(root, 'tsconfig.json');
      if (module === null) {
        const parsed = JSON.parse(readFileSync(config, 'utf8'));
        delete parsed.compilerOptions.module;
        writeFileSync(config, JSON.stringify(parsed));
      }
      const result = analyze(config);
      assert.equal([...result.occurrences, ...result.coverage][0]!.commonjs?.outcome, expected);
    }, { module: module ?? 'CommonJS', moduleResolution: module === 'Preserve' ? 'Bundler' : 'Node10', target: 'ES5', ignoreDeprecations: '6.0' });
  }
  for (const extension of ['cts', 'cjs']) temporary({ [`entry.${extension}`]: "export {}; require('./target');", 'target.ts': 'export {};' }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.equal(result.occurrences[0]!.commonjs?.binding, 'absent');
    assert.equal(result.occurrences[0]!.targetStatus, 'resolved');
  }, { allowJs: true });
});

test('production lexical completion rejects parse recovery, with scopes and all tested local binding shapes', () => {
  const bodies = [
    "require('./target'); const = ;", "with ({}) { require('./target'); }",
    "function f(require) { require('./target'); }", "function f() { require('./target'); var require; }",
    "{ require('./target'); let require; }", "try {} catch (require) { require('./target'); }",
    "for (const require of []) { require('./target'); }", "function f({ require }) { require('./target'); }",
    "declare const require: (s: string) => unknown; require('./target');",
  ];
  for (const [index, body] of bodies.entries()) temporary({ 'entry.cts': `export {}; ${body}`, 'target.ts': 'export {};' }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.equal(result.occurrences.length, 0, body);
    assert.equal(result.coverage[0]!.outcome, index < 2 ? 'insufficient-lexical-evidence' : 'alternative-binding', body);
  });
  temporary({ 'entry.cjs': "export {}; require(require('./target')); function f(require) { require(require('./target')); }", 'target.ts': 'export {};' }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.equal(result.occurrences.length, 2);
    assert.deepEqual(result.occurrences.map(item => item.targetStatus), ['target-indeterminate', 'resolved']);
    assert.equal(result.coverage.length, 2);
    assert.ok(result.coverage.every(item => item.outcome === 'alternative-binding'));
  }, { allowJs: true });
});

test('type-only is whole-edge evidence; adding a require never produces a runtime claim', () => {
  temporary({
    'types.cts': "import type { T } from './target'; export type U = import('./target').T;",
    'mixed.cts': "export type U = import('./target').T; require('./target');",
    'target.ts': 'export interface T {}',
  }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    const types = result.relationships.find(item => result.name(item.subject) === 'types')!;
    const mixed = result.relationships.find(item => result.name(item.subject) === 'mixed')!;
    assert.equal(types.information.typeOnly, true);
    assert.equal(mixed.information.typeOnly, false);
    assert.deepEqual(mixed.information.mechanisms, ['commonjs', 'import-type']);
    assert.equal(types.information.occurrences.length, 2);
  });
});

test('literal resolution honors package conditions, import-type mode attributes and exact ambient declarations', () => {
  temporary({
    'entry.cts': `export {}; require('dual'); type T = import('dual', { with: { 'resolution-mode': 'import' } }).T;
      require('ambient'); import('ambient');`,
    'ambient.d.ts': "declare module 'ambient' { export const a: number; }",
    'node_modules/dual/package.json': JSON.stringify({ name: 'dual', type: 'module', exports: { import: './esm.d.mts', require: './cjs.d.cts' } }),
    'node_modules/dual/esm.d.mts': 'export interface T {}',
    'node_modules/dual/cjs.d.cts': 'export interface T {}',
  }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    // Require alone does not populate a TS-only file. Select it via a type request.
    const commonjs = result.occurrences[0]!;
    assert.equal(commonjs.targetStatus, 'outside-population');
    assert.ok(result.source(commonjs).dependencyResolution!.resolvedFile!.endsWith('cjs.d.cts'));
    assert.equal(result.name(result.occurrences[1]!.target!), 'esm');
    assert.equal(result.source(result.occurrences[1]!).dependencyResolution!.mode, 'esm');
    assert.ok(result.occurrences.slice(2).every(item => result.name(item.target!) === 'ambient'));
  });
});

test('ownership respects named modules, namespaces and unresolved augmentations without guessing enclosing ownership', () => {
  temporary({
    'ambient.d.ts': "declare module 'named' { namespace Nested { type T = import('target').T; } } declare module 'target' { export interface T {} }",
    'entry.ts': "export {}; declare module 'not-resolved' { type T = import('target').T; }",
    'script.ts': "type T = import('target').T;",
    'global.ts': "export {}; declare global { interface Global { t: import('target').T } }",
    'wildcard.d.ts': "declare module '*.data' { export const data: unknown; }",
    'wild.ts': "import { data } from './something.data'; export { data };",
  }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.ok(result.occurrences.some(item => result.name(item.owner) === 'named' && result.name(item.target!) === 'target'));
    assert.deepEqual(result.coverage.filter(item => item.outcome === 'ownership-unestablished').map(item => path.basename(result.source(item).path)).sort(), ['entry.ts', 'global.ts', 'script.ts']);
    assert.ok(result.occurrences.some(item => result.name(item.owner) === 'wild' && item.target !== null && result.name(item.target) === '*.data'));
    assert.equal(result.relationships.length, 2);
  }, { moduleDetection: 'legacy' });
});

test('external interiors stay opaque and external augmentations do not become enclosing module requests', () => {
  temporary({
    'entry.ts': "import { T } from 'outside'; export {}; declare module 'outside' { interface Added { t: import('./target').T } }",
    'target.ts': 'export interface T {}',
    'node_modules/outside/package.json': '{"types":"index.d.ts"}',
    'node_modules/outside/index.d.ts': "export interface T { t: import('./other').U }",
    'node_modules/outside/other.d.ts': 'export interface U {}',
  }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.equal(result.occurrences.length, 1);
    assert.equal(result.relationships.length, 1);
    assert.equal(result.coverage[0]!.outcome, 'external-owner');
    assert.ok(result.occurrences.every(item => result.evaluation.projectModules.includes(item.owner)));
  });
});

test('dependency resolution uses the captured output exclusion boundary and retains changed resolution inputs independently of session identity', () => {
  temporary({ 'entry.cts': "export {}; require('./generated/target');", 'generated/target.ts': 'export {};' }, root => {
    const config = path.join(root, 'tsconfig.json');
    const excluded = analyze(config, [path.join(root, 'generated')]);
    assert.equal(excluded.occurrences[0]!.targetStatus, 'unresolved');
    const visible = analyze(config);
    assert.equal(visible.occurrences[0]!.targetStatus, 'outside-population');
    assert.notEqual(inputBasis(visible), inputBasis(excluded));
    rmSync(path.join(root, 'generated/target.ts'));
    const removed = analyze(config);
    assert.equal(removed.occurrences[0]!.targetStatus, 'unresolved');
    assert.notEqual(inputBasis(removed), inputBasis(visible));
  }, {}, ['entry.cts']);
});

test('empty and unavailable dependency evaluations are distinct; ordinary discovery does not request dependencies', () => {
  const empty = analyze(fixture('empty'));
  assert.equal(empty.evaluation.materialization, 'full');
  assert.equal(empty.occurrences.length, 0);
  assert.equal(empty.relationships.length, 0);
  const opened = openTypeScriptProject({ configPath: fixture('module-population') });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') return;
  const store = new MemoryProgramRecordStore();
  const original = opened.analysis;
  let requested: boolean | undefined;
  const wrapped = { discover: (target: MemoryProgramRecordStore, expansions?: Parameters<typeof original.discover>[1], dependencies?: boolean) => {
    requested = dependencies;
    return original.discover(target, expansions);
  } };
  evaluateModules(store, wrapped);
  assert.equal(requested, undefined);
  const unavailable = evaluateDependencies(store, wrapped);
  assert.equal(requested, true);
  assert.equal(unavailable.availability, 'unavailable');
  assert.equal(unavailable.materialization, 'none');
});

test('dependency records reproduce in fresh processes without clock or invocation identity', () => {
  const script = `import { openTypeScriptProject } from './_build/src/lib/typescript/project.js';
    import { MemoryProgramRecordStore } from './_build/src/lib/memory-store.js';
    import { evaluateDependencies } from './_build/src/lib/dependencies/evaluate.js';
    const store = new MemoryProgramRecordStore();
    const opened = openTypeScriptProject({ configPath: 'fixtures/dependency-contract/tsconfig.json' });
    const result = evaluateDependencies(store, opened.analysis);
    console.log(JSON.stringify([result, ...[...result.occurrences, ...result.relationships, ...result.coverage, ...result.contexts].map(id => store.get(id))]));`;
  const run = () => execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.deepEqual(normalizeSession(JSON.parse(run())), normalizeSession(JSON.parse(run())));
});

test('partial, stopped and failed dependency attempts retain qualified materialized results; defects propagate', () => {
  for (const execution of ['stopped', 'failed'] as const) {
    const opened = openTypeScriptProject({ configPath: fixture('dependency-contract') });
    assert.equal(opened.status, 'opened');
    if (opened.status !== 'opened') throw new Error('Expected open');
    const store = new MemoryProgramRecordStore();
    const result = evaluateDependencies(store, { discover: (target, expansions, dependencies) => {
      const original = opened.analysis.discover(target, expansions, dependencies);
      assert.ok(original.dependencies);
      return { ...original, dependencies: { ...original.dependencies, execution, materialization: 'partial', reason: 'Synthetic interruption after retained results.' } };
    } });
    assert.equal(result.execution, execution);
    assert.equal(result.materialization, 'partial');
    assert.ok(result.occurrences.length > 0 && result.relationships.length > 0);
    assert.ok(result.occurrences.every(id => store.get(id).kind === 'dependency-occurrence'));
  }
  assert.throws(() => evaluateDependencies(new MemoryProgramRecordStore(), { discover: () => { throw new Error('Unexpected checker defect'); } }), /Unexpected checker defect/);
});

test('store rejects unsupported relationship edges and false whole-edge qualifications atomically', () => {
  const result = analyze(fixture('dependency-contract'));
  const relationship = result.relationships.find(item => !item.information.typeOnly)!;
  const id = `${relationship.id}-invalid` as RecordId;
  assert.throws(() => result.store.put([{ ...relationship, id, information: { ...relationship.information, occurrences: [] } }]), /matching occurrences/);
  assert.throws(() => result.store.get(id), /Missing program record/);
  assert.throws(() => result.store.put([{ ...relationship, id, information: { ...relationship.information, typeOnly: true } }]), /aggregation/);
  const nonedge = result.occurrences.find(item => item.targetStatus === 'unresolved')!;
  assert.throws(() => result.store.put([{ ...relationship, id, information: { ...relationship.information, occurrences: [nonedge.id] } }]), /matching occurrences/);
  assert.throws(() => result.store.put([{ ...nonedge, id, target: relationship.information.child }]), /Invalid dependency occurrence/);
});

test('captured request evidence survives later edits and dependency method versions are retained', () => {
  temporary({ 'entry.cts': "export {}; require('./target');", 'target.ts': 'export {};' }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    const before = result.source(result.occurrences[0]!);
    writeFileSync(path.join(root, 'entry.cts'), "export {}; require('./missing');");
    assert.equal(result.source(result.occurrences[0]!), before);
    assert.equal(before.dependencyResolution!.writtenSpecifier, './target');
    const changed = analyze(path.join(root, 'tsconfig.json'));
    assert.notEqual(inputBasis(result), inputBasis(changed));
    const session = result.store.get(result.evaluation.session);
    assert.equal(session.kind, 'session');
    if (session.kind !== 'session') throw new Error('Expected session');
    assert.ok(session.methods.includes('postcode/typescript-dependencies@2'));
    assert.ok(session.methods.includes('postcode/evaluate-dependencies@2'));
  });
});

test('direct relationships preserve self requests and every edge around a cycle', () => {
  temporary({ 'a.ts': "export {} from './a'; export * from './b';", 'b.ts': "export * from './c';", 'c.ts': "export * from './a';" }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.deepEqual(result.relationships.map(item => [result.name(item.subject), result.name(item.information.child)]).sort(),
      [['a', 'a'], ['a', 'b'], ['b', 'c'], ['c', 'a']]);
    assert.equal(result.occurrences.length, 4);
    assert.ok(result.relationships.every(item => item.information.occurrences.length === 1));
  });
});

test('file resolver evidence never narrows a different ambient target declaration', () => {
  temporary({
    'entry.cts': "export type T = import('both').T; require('both');",
    'ambient.d.ts': "declare module 'both' { export interface T {} }",
    'node_modules/both/package.json': '{"types":"index.d.ts"}',
    'node_modules/both/index.d.ts': 'export interface T {}',
  }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    const typed = result.occurrences.find(item => item.mechanism === 'import-type')!;
    assert.equal(result.name(typed.target!), 'both');
    assert.equal(result.source(typed).dependencyResolution!.targetBasis, 'checker-symbol');
    assert.ok(typed.targetEvidence.every(id => {
      const evidence = result.store.get(id);
      return evidence.kind === 'source-evidence' && evidence.path === path.join(root, 'ambient.d.ts');
    }));
    const required = result.occurrences.find(item => item.mechanism === 'commonjs')!;
    assert.equal(result.source(required).dependencyResolution!.targetBasis, 'configured-file-resolution');
    assert.equal(required.targetStatus, 'resolved');
    assert.notEqual(required.target, typed.target);
    assert.ok(required.targetEvidence.every(id => {
      const evidence = result.store.get(id);
      return evidence.kind === 'source-evidence'
        && evidence.path === result.source(required).dependencyResolution!.resolvedFile
        && realpathSync(evidence.path) === realpathSync(path.join(root, 'node_modules/both/index.d.ts'));
    }));
  });
});

test('relationship diagnostics count source diagnostics once without collapsing distinct same-code errors', () => {
  for (const diagnosticCount of [1, 2]) temporary({
    'entry.ts': `import { value as first } from './target'; import { value as second } from './target';
      const broken = ; ${diagnosticCount === 2 ? 'const alsoBroken = ;' : ''}`,
    'target.ts': 'export const value = 1;',
    'unrelated.ts': 'export {}; const unrelatedError = ;',
  }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.equal(result.occurrences.length, 2);
    assert.equal(result.relationships.length, 1);
    const expected = Array.from({ length: diagnosticCount }, () => ({ code: 1109, category: 'error' }));
    for (const record of [...result.occurrences, ...result.relationships]) {
      const context = result.store.get(record.context);
      assert.equal(context.kind, 'claim-context');
      if (context.kind !== 'claim-context') throw new Error('Expected context');
      assert.deepEqual(context.diagnostics, expected);
    }
    assert.equal(result.evaluation.execution, 'completed');
    assert.equal(result.evaluation.materialization, 'full');
  });
});

test('merged module relationships retain distinct diagnostics across files without multiplying shared file diagnostics', () => {
  temporary({
    'first.d.ts': `declare module 'parent' {
      export type A = import('child').T;
      export type B = import('child').T;
      const broken = ;
    }`,
    'second.d.ts': `declare module 'parent' {
      export type C = import('child').T;
      const alsoBroken = ;
    }`,
    'child.d.ts': "declare module 'child' { export interface T {} }",
    'unrelated.ts': 'export {}; const unrelatedError = ;',
  }, root => {
    const result = analyze(path.join(root, 'tsconfig.json'));
    assert.equal(result.relationships.length, 1);
    const relationship = result.relationships[0]!;
    assert.equal(result.name(relationship.subject), 'parent');
    assert.equal(result.name(relationship.information.child), 'child');
    assert.equal(relationship.information.occurrences.length, 3);
    assert.equal(result.occurrences.length, 3);
    assert.deepEqual(result.occurrences.map(occurrence => path.basename(result.source(occurrence).path)).sort(),
      ['first.d.ts', 'first.d.ts', 'second.d.ts']);
    for (const occurrence of result.occurrences) {
      assert.equal(occurrence.owner, relationship.subject);
      assert.equal(occurrence.target, relationship.information.child);
      const context = result.store.get(occurrence.context);
      assert.equal(context.kind, 'claim-context');
      if (context.kind !== 'claim-context') throw new Error('Expected context');
      assert.deepEqual(context.diagnostics, [{ code: 1109, category: 'error' }]);
    }
    const context = result.store.get(relationship.context);
    assert.equal(context.kind, 'claim-context');
    if (context.kind !== 'claim-context') throw new Error('Expected context');
    assert.deepEqual(context.diagnostics, [
      { code: 1109, category: 'error' }, { code: 1109, category: 'error' },
    ]);
    assert.equal(result.evaluation.execution, 'completed');
    assert.equal(result.evaluation.materialization, 'full');
  });
});


test('dependency evaluations partition resolved occurrences exactly and reject inconsistent batches atomically', () => {
  const { store, evaluation, relationships, occurrences } = analyze(fixture('dependency-contract'));
  const edge = relationships[0]!;
  const occurrence = occurrences.find(item => item.id === edge.information.occurrences[0])!;
  let sequence = 0;
  const reject = (changes: Partial<DependencyEvaluationRecord>, extra: ProgramRecord[] = []) => {
    const id = `${evaluation.id}-partition-${sequence++}` as RecordId;
    const context = store.get(evaluation.contexts[0]!);
    const marker = { ...context, id: `${id}-marker` as RecordId };
    assert.throws(() => store.put([marker, ...extra, { ...evaluation, ...changes, id }]), /partition|Duplicate dependency evaluation occurrence/);
    for (const rejected of [marker.id, ...extra.map(record => record.id), id]) {
      assert.throws(() => store.get(rejected), /Missing program record/);
    }
    assert.deepEqual(store.get(evaluation.id), evaluation);
  };
  // Missing an edge loses retained resolved evidence.
  reject({ relationships: evaluation.relationships.filter(id => id !== edge.id) });
  // A valid stored edge cannot draw support outside this evaluation.
  reject({ occurrences: evaluation.occurrences.filter(id => id !== occurrence.id) });
  reject({ relationships: [...evaluation.relationships, edge.id] });
  // Distinct relationship IDs must not count the same occurrence twice either.
  const duplicate = { ...edge, id: `${edge.id}-duplicate` as RecordId };
  reject({ relationships: [...evaluation.relationships, duplicate.id] }, [duplicate]);
  reject({ occurrences: [...evaluation.occurrences, occurrence.id] });
  // Exercise forward references to new support in the pending batch.
  const pendingOccurrence = { ...occurrence, id: `${occurrence.id}-pending` as RecordId };
  const pendingEdge = { ...edge, id: `${edge.id}-pending` as RecordId,
    information: { ...edge.information, occurrences: [pendingOccurrence.id],
      mechanisms: [pendingOccurrence.mechanism], typeOnly: pendingOccurrence.typeOnly } };
  reject({ relationships: [...evaluation.relationships, pendingEdge.id] }, [pendingEdge, pendingOccurrence]);
  const valid = { ...evaluation, id: `${evaluation.id}-valid-partial` as RecordId,
    materialization: 'partial' as const, reason: 'Other requests unavailable.' };
  store.put([valid]);
  assert.deepEqual(store.get(valid.id), valid); // Partial evaluation still covers all retained resolved evidence.
});


test('dependency evaluations reject disjoint relationships for one ordered pair atomically', () => {
  temporary({
    'entry.cts': "import { value } from './target.cjs'; export { value } from './target.cjs';",
    'target.cts': "import './entry.cjs'; export const value = 1;",
  }, root => {
    const { store, evaluation, relationships, occurrences } = analyze(path.join(root, 'tsconfig.json'));
    const edge = relationships.find(item => item.information.occurrences.length === 2)!;
    assert.equal(edge.information.occurrences.length, 2);
    // Reverse direction is a different ordered pair and is accepted in the original evaluation.
    assert.equal(relationships.length, 2);
    assert.ok(relationships.some(item => item.subject === edge.information.child && item.information.child === edge.subject));
    const split = edge.information.occurrences.map((id, index) => {
      const support = occurrences.find(item => item.id === id)!;
      return { ...edge, id: `${edge.id}-split-${index}` as RecordId,
        information: { ...edge.information, occurrences: [id], mechanisms: [support.mechanism], typeOnly: support.typeOnly } };
    });
    const invalid = { ...evaluation, id: `${evaluation.id}-split` as RecordId,
      relationships: [...evaluation.relationships.filter(id => id !== edge.id), ...split.map(item => item.id)] };
    // Individually valid pending edges cover every resolved occurrence exactly once.
    // Only their repeated ordered pair is invalid, regardless of batch insertion order.
    for (const batch of [[...split, invalid], [invalid, ...split]]) {
      assert.throws(() => store.put(batch), /Duplicate dependency relationship for ordered module pair/);
      for (const record of batch) assert.throws(() => store.get(record.id), /Missing program record/);
      assert.deepEqual(store.get(evaluation.id), evaluation);
      assert.deepEqual(store.get(edge.id), edge);
    }
  });
});

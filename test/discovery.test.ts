import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { methods, moduleEntityIds } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { createView } from '../src/lib/presentation.js';
import { inspect, modules } from '../src/lib/projections.js';
import type { SourceEvidenceRecord } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { discover } from './helpers.js';

const fixture = (name: string) => path.resolve('fixtures', name, 'tsconfig.json');
function temporary(run: (root: string) => void) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-test-'));
  try { run(root); } finally { rmSync(root, { recursive: true, force: true }); }
}

test('enumerates the exact supported population, with merged ambient evidence and transitively resolved identity', () => {
  const { store, claims, contexts, evaluation } = discover(fixture('module-population'));
  assert.equal(claims.length, 6);
  assert.deepEqual(claims.map(claim => claim.information.name).filter(name => name !== null), ['ambient-one', 'ambient-two']);
  const sources = contexts.flatMap(context => context.scope === 'configured-project' ? [] : context.evidence)
    .map(id => store.get(id) as SourceEvidenceRecord).filter(source => !source.resolution);
  assert.deepEqual(sources.map(source => path.basename(source.path)).sort(),
    ['allowed.js', 'ambient.d.ts', 'ambient.d.ts', 'ambient.d.ts', 'external.d.ts', 'root.ts', 'transitive.ts']);
  assert.equal(sources.find(source => source.path.endsWith('/transitive.ts'))!.configuredRoot, false);
  assert.equal(evaluation.materialization, 'full');
  assert.equal(new Set(evaluation.modules).size, 6);
  assert.equal(claims.filter(claim => claim.information.discoveryFacets.includes('declaration-only')).length, 3);
  const resolution = contexts.flatMap(context => context.evidence).map(id => store.get(id) as SourceEvidenceRecord)
    .filter(source => source.resolution);
  assert.ok(resolution.length >= 2);
  assert.equal(new Set(resolution.map(source => source.resolution!.target)).size, 1);
  assert.ok(resolution.every(source => source.resolution!.status === 'established'));
});

test('source-derived compiler names do not become conceptual names', () => {
  const { claims } = discover(fixture('module-population'));
  assert.equal(claims.filter(claim => claim.information.name === null).length, 4);
  assert.equal(JSON.stringify(claims).includes(process.cwd()), false);
});

test('named ambient declarations in ordinary TypeScript have declaration-only facets', () => {
  temporary(root => {
    writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["ambient.ts"]}');
    writeFileSync(path.join(root, 'ambient.ts'), 'declare module "ordinary-ambient" { export const value: number; }');
    const { claims } = discover(path.join(root, 'tsconfig.json'));
    assert.equal(claims.length, 1);
    assert.equal(claims[0]!.information.name, 'ordinary-ambient');
    assert.deepEqual(claims[0]!.information.discoveryFacets, ['ambient', 'project', 'declaration-only']);
  });
});

test('TypeScript automatic module detection is honored even without written imports or exports', () => {
  temporary(root => {
    writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
    writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[],"module":"NodeNext"},"files":["implicit.ts"]}');
    writeFileSync(path.join(root, 'implicit.ts'), 'const value = 1;');
    assert.equal(discover(path.join(root, 'tsconfig.json')).claims.length, 1);
  });
});

test('empty population has a stored projection and fully materialized evaluation', () => {
  const { store, projection, evaluation } = discover(fixture('empty'));
  assert.equal(projection.modules.length, 0);
  assert.equal(projection.selection.populationEstablished, true);
  assert.equal(evaluation.execution, 'completed');
  assert.equal(evaluation.materialization, 'full');
  assert.equal(store.get(projection.id).kind, 'projection');
  assert.equal(projection.evaluations.length, 1);
});

test('missing, malformed, unusable config and missing configured source fail operationally', () => {
  temporary(root => {
    const configPath = path.join(root, 'tsconfig.json');
    assert.equal(openTypeScriptProject({ configPath }).status, 'project-open-failed');
    for (const text of ['{', '{"compilerOptions":{"target":"bogus"}}', '{"files":["missing.ts"]}']) {
      writeFileSync(configPath, text);
      assert.equal(openTypeScriptProject({ configPath }).status, 'project-open-failed', text);
    }
    writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":[]}');
    assert.equal(discover(configPath).evaluation.modules.length, 0);
    writeFileSync(path.join(root, 'base.json'), '{');
    writeFileSync(configPath, '{"extends":"./base.json","files":[]}');
    assert.equal(openTypeScriptProject({ configPath }).status, 'project-open-failed');
  });
});

test('encountered parse diagnostics qualify discovery without unrelated semantic checking', () => {
  const { evaluation, contexts, claims } = discover(fixture('diagnostics'));
  assert.equal(evaluation.execution, 'completed');
  assert.equal(evaluation.modules.length, 2);
  const global = contexts.find(context => context.scope === 'configured-project')!;
  assert.ok(global.diagnostics.some(diagnostic => diagnostic.code === 1109));
  assert.equal(global.diagnostics.some(diagnostic => diagnostic.code === 2322), false);
  assert.equal(contexts.filter(context => claims.some(claim => claim.context === context.id))
    .filter(context => context.diagnostics.length > 0).length, 1);
});

test('inspect exact names, handles and IDs preserves zero/one selection and applicable context', () => {
  const { store, evaluation, claims } = discover(fixture('module-population'));
  const ambient = claims.find(claim => claim.information.name === 'ambient-one')!;
  for (const selector of ['ambient-one', ambient.information.handle, ambient.subject]) {
    const projection = inspect(store, evaluation, selector, evaluation.snapshot);
    assert.deepEqual(projection.modules, [ambient.subject]);
    assert.equal(projection.selection.subset, true);
    assert.equal(projection.contexts.length, 2);
    assert.ok(projection.contexts.includes(ambient.context));
  }
  for (const selector of ['ambient', 'ambient-*', 'missing']) {
    assert.equal(inspect(store, evaluation, selector).selection.matches, 0);
  }
});

test('exact names remain usable when they collide with compact IDs; scoped IDs stay precise', () => {
  temporary(root => {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, include: ['*.ts'] }));
    writeFileSync(path.join(root, 'ordinary.ts'), 'export const value = 1;');
    const before = discover(config);
    const selector = moduleEntityIds(before.evaluation.modules).get(before.evaluation.modules[0]!)!;
    writeFileSync(path.join(root, 'ambient.d.ts'), `declare module "${selector}" { export const named: number; }`);
    const { store, evaluation, claims } = discover(config);
    const named = claims.find(claim => claim.information.name === selector)!;
    const ordinary = claims.find(claim => claim.information.name === null)!;
    const ids = moduleEntityIds(evaluation.modules);
    assert.equal(ids.get(ordinary.subject), selector);

    const currentName = inspect(store, evaluation, selector);
    assert.equal(currentName.selection.referenceStatus, 'current');
    assert.deepEqual(currentName.modules, [named.subject]);
    assert.ok(currentName.contexts.includes(named.context));
    assert.deepEqual(inspect(store, evaluation, selector, evaluation.snapshot).modules, [ordinary.subject]);
    assert.deepEqual(inspect(store, evaluation, ids.get(named.subject)!, evaluation.snapshot).modules, [named.subject]);
    assert.equal(inspect(store, evaluation, ids.get(named.subject)!).selection.referenceStatus, 'snapshot-required');
    const stale = inspect(store, evaluation, selector, before.evaluation.snapshot);
    assert.equal(stale.selection.referenceStatus, 'snapshot-mismatch');
    assert.deepEqual(stale.modules, []);
  });
});

test('generated handles avoid compact Entity IDs across basename, language-name and export cues', () => {
  temporary(root => {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, include: ['**/*.ts'] }));
    writeFileSync(path.join(root, 'ordinary.ts'), 'export const value = 1;');
    const before = discover(config);
    const selector = moduleEntityIds(before.evaluation.modules).get(before.evaluation.modules[0]!)!;
    for (const directory of ['first', 'second']) {
      mkdirSync(path.join(root, directory));
      writeFileSync(path.join(root, directory, `${selector}.ts`), 'export const value = 1;');
    }
    writeFileSync(path.join(root, 'ambient.d.ts'), `declare module "${selector}" { export const value: number; }`);
    writeFileSync(path.join(root, 'index.ts'), `export const ${selector.replace('-', '_')} = 1;`);
    // Reserve the entire compact-ID grammar, including prefixes extended on collision.
    for (const length of [9, 64]) writeFileSync(path.join(root, `module-${'a'.repeat(length)}.ts`), 'export const value = 1;');
    const { store, evaluation, claims } = discover(config);
    const ids = moduleEntityIds(evaluation.modules);
    const ordinary = claims.find(claim => claim.information.handle === 'ordinary')!;
    assert.equal(ids.get(ordinary.subject), selector);
    const rewritten = claims.filter(claim => claim.information.handle === `handle-${selector}`);
    assert.equal(rewritten.length, 4);
    assert.deepEqual(new Set(rewritten.map(claim => claim.information.handleProvenance)),
      new Set(['source-basename', 'language-name', 'declared-export']));
    assert.deepEqual(inspect(store, evaluation, `handle-${selector}`, evaluation.snapshot).modules,
      rewritten.map(claim => claim.subject));
    assert.equal(inspect(store, evaluation, `handle-${selector}`).selection.referenceStatus, 'snapshot-required');
    assert.deepEqual(inspect(store, evaluation, selector, evaluation.snapshot).modules, [ordinary.subject]);
    const named = claims.find(claim => claim.information.name === selector)!;
    assert.deepEqual(inspect(store, evaluation, selector).modules, [named.subject]);
    for (const claim of claims) {
      assert.equal(/^module-[a-f0-9]{8,64}$/.test(claim.information.handle), false);
      assert.deepEqual(inspect(store, evaluation, ids.get(claim.subject)!, evaluation.snapshot).modules, [claim.subject]);
    }
    assert.deepEqual(discover(config).claims, claims);
  });
});

test('equivalent separate processes reproduce snapshot, records, ordering and projection', () => {
  const invoke = () => execFileSync(process.execPath, ['_build/test/process-probe.js', fixture('module-population')], { encoding: 'utf8' });
  assert.equal(invoke(), invoke());
});

test('a changed method version produces a new snapshot in an independent process', () => {
  temporary(root => {
    cpSync('_build', path.join(root, '_build'), { recursive: true });
    writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
    symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
    const probe = path.join(root, '_build/test/process-probe.js');
    const invoke = () => JSON.parse(execFileSync(process.execPath, [probe, fixture('empty')], { encoding: 'utf8' })) as { evaluation: { snapshot: string } };
    const before = invoke();
    const implementation = path.join(root, '_build/src/lib/identity.js');
    const original = readFileSync(implementation, 'utf8');
    assert.ok(original.includes('postcode/projection@6'));
    writeFileSync(implementation, original.replace('postcode/projection@6', 'postcode/projection@verification-change'));
    assert.notEqual(invoke().evaluation.snapshot, before.evaluation.snapshot);
  });
});

test('source, inherited config, package metadata and missing-input resolution changes create new snapshots', () => {
  temporary(root => {
    cpSync('fixtures/module-population', root, { recursive: true });
    const config = path.join(root, 'tsconfig.json');
    const identities = [discover(config).evaluation.snapshot];
    writeFileSync(path.join(root, 'transitive.ts'), 'export const transit = 2;');
    identities.push(discover(config).evaluation.snapshot);
    writeFileSync(path.join(root, 'base.json'), '{"compilerOptions":{"noLib":true,"types":[],"allowJs":true,"strict":true,"module":"NodeNext","moduleResolution":"NodeNext","moduleDetection":"legacy"}}');
    identities.push(discover(config).evaluation.snapshot);
    writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
    identities.push(discover(config).evaluation.snapshot);
    writeFileSync(path.join(root, 'root.ts'), 'import {x} from "./missing.js"; export const result = x;');
    identities.push(discover(config).evaluation.snapshot);
    writeFileSync(path.join(root, 'missing.ts'), 'export const x = 3;');
    identities.push(discover(config).evaluation.snapshot);
    assert.equal(new Set(identities).size, identities.length);
  });
});

test('generated output is excluded from roots, imports, symlinks and snapshot inputs', () => {
  temporary(root => {
    const output = path.join(root, '_observations');
    mkdirSync(output);
    writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"include":["**/*.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'import "./_observations/generated"; export const value = 1;');
    const config = path.join(root, 'tsconfig.json');
    const before = discover(config, [output]);
    writeFileSync(path.join(output, 'generated.ts'), 'export const fabricated = 1;');
    writeFileSync(path.join(output, 'batch.json'), '{"formatVersion":0}');
    assert.equal(discover(config, [output]).evaluation.snapshot, before.evaluation.snapshot);
    symlinkSync(output, path.join(root, 'alias'), 'dir');
    const linked = discover(config, [output]);
    assert.equal(linked.claims.length, 1);
    writeFileSync(path.join(output, 'generated.ts'), 'export const fabricated = 200;');
    assert.equal(discover(config, [output]).evaluation.snapshot, linked.evaluation.snapshot);
    assert.equal(linked.contexts.flatMap(context => context.evidence)
      .map(id => linked.store.get(id) as SourceEvidenceRecord).some(source => source.path.includes('_observations')), false);
  });
});

test('explicit output exclusion applies outside the default destination', () => {
  temporary(root => {
    const output = path.join(root, 'generated');
    mkdirSync(output);
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"include":["**/*.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export const real = 1;');
    const before = discover(config, [output]);
    writeFileSync(path.join(output, 'fake.ts'), 'export const fake = 1;');
    assert.equal(discover(config, [output]).evaluation.snapshot, before.evaluation.snapshot);
    assert.equal(discover(config).claims.length, 2);
  });
});

test('repeated evaluation retains distinct attempts without changing equivalent snapshot identity', () => {
  const { store, evaluation, analysis } = discover(fixture('empty'));
  const next = evaluateModules(store, analysis);
  assert.equal(next.snapshot, evaluation.snapshot);
  assert.notEqual(next.id, evaluation.id);
  assert.equal(store.evaluations(evaluation.snapshot).length, 2);
  assert.deepEqual(store.get(evaluation.id), evaluation);
});

test('expanded discovery attempts count root evaluations and preserve earlier expansion outcomes', () => {
  const { store, analysis, evaluation } = discover(fixture('exports'));
  const expanded = evaluateModules(store, analysis, ['exports', 'documentation']);
  assert.equal(expanded.attempt, 2);
  const earlier = store.evaluations(evaluation.snapshot);
  assert.ok(earlier.some(outcome => outcome.basis === expanded.id));
  const repeated = evaluateModules(store, analysis, ['exports']);
  assert.equal(repeated.attempt, 3);
  assert.equal(repeated.snapshot, evaluation.snapshot);
  assert.notEqual(repeated.id, expanded.id);
  assert.ok(store.evaluations(repeated.snapshot).filter(outcome => outcome.basis === repeated.id)
    .every(outcome => outcome.attempt === 3 && outcome.requirement === 'exports'));
  for (const outcome of earlier) assert.deepEqual(store.get(outcome.id), outcome);
});

test('output-exclusion qualifications describe only filters actually supplied by the caller', () => {
  for (const excludedOutputDirectories of [undefined, [], [path.resolve('_observations')]]) {
    const opened = openTypeScriptProject({ configPath: fixture('module-population'),
      ...(excludedOutputDirectories === undefined ? {} : { excludedOutputDirectories }) });
    assert.equal(opened.status, 'opened');
    if (opened.status !== 'opened') throw new Error('Project did not open');
    const store = new MemoryProgramRecordStore();
    const evaluation = evaluateModules(store, opened.analysis, ['exports', 'documentation']);
    const projection = modules(store, evaluation);
    const view = createView(store, projection, { format: 'json', sourceDetail: false });
    const expectedCount = excludedOutputDirectories?.length ?? 0;
    assert.equal(view.analysis!.excludedOutputLocations, expectedCount);
    // Check both project and per-module discovery contexts through the public view.
    assert.ok(view.qualifications.some(context => context.scope === 'configured-project'));
    assert.ok(view.modules.length > 0);
    const contexts = [...view.qualifications, ...view.modules.map(module => module.qualification)]
      .filter(context => context.method.startsWith(`${methods.discovery};`));
    assert.ok(contexts.length > view.modules.length);
    for (const context of contexts) {
      assert.equal(context.limitations.includes('Configured generated-output locations are explicitly excluded from repository evidence.'), expectedCount > 0);
    }
  }
});

test('exclusion order and duplicates preserve snapshots while different exclusion sets remain distinct', () => {
  temporary(root => {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"include":["**/*.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export const value=1;');
    const outputs = ['first', 'second'].map(name => path.join(root, name));
    for (const output of outputs) { mkdirSync(output); writeFileSync(path.join(output, 'generated.ts'), 'export const fake=1;'); }
    const before = discover(config, outputs);
    for (const exclusions of [[...outputs].reverse(), [outputs[1]!, outputs[0]!, outputs[1]!],
      [path.join(outputs[0]!, '.'), outputs[1]!]]) {
      const next = discover(config, exclusions);
      assert.equal(next.evaluation.snapshot, before.evaluation.snapshot);
      assert.deepEqual(next.claims, before.claims);
      assert.deepEqual(next.contexts, before.contexts);
    }
    assert.equal(before.claims.length, 1);
    const changed = discover(config, [outputs[0]!]);
    assert.notEqual(changed.evaluation.snapshot, before.evaluation.snapshot);
    assert.equal(changed.claims.length, 2);
  });
});

test('missing descendants of symlinked exclusions stay outside snapshot inputs when generated output appears', () => {
  temporary(root => {
    const output = path.join(root, 'output');
    const ordinary = path.join(root, 'ordinary');
    mkdirSync(output); mkdirSync(ordinary);
    symlinkSync(output, path.join(root, 'alias'), 'dir');
    symlinkSync(ordinary, path.join(root, 'visible'), 'dir');
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), "import './alias/deep/generated.js'; import './visible/new.js'; export const value=1;");
    const before = discover(config, [output]);
    const verify = () => {
      const result = discover(config, [output]);
      assert.equal(result.evaluation.snapshot, before.evaluation.snapshot);
      assert.deepEqual(result.claims, before.claims);
      assert.deepEqual(result.contexts, before.contexts);
      assert.equal(result.claims.length, 1);
    };
    mkdirSync(path.join(output, 'deep')); verify();
    const generated = path.join(output, 'deep/generated.ts');
    writeFileSync(generated, 'export const generated=1;'); verify();
    writeFileSync(generated, 'export const generated=2;'); verify();
    rmSync(generated); verify();
    writeFileSync(path.join(ordinary, 'new.ts'), 'export const real=1;');
    const changed = discover(config, [output]);
    assert.notEqual(changed.evaluation.snapshot, before.evaluation.snapshot);
    assert.equal(changed.claims.length, 2);
  });
});

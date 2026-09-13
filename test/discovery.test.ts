import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { inspect } from '../src/lib/projections.js';
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
  assert.equal(claims.filter(claim => claim.information.facets.includes('declaration-only')).length, 3);
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
    assert.deepEqual(claims[0]!.information.facets, ['ambient', 'project', 'declaration-only']);
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
    assert.ok(original.includes('postcode/projection@4'));
    writeFileSync(implementation, original.replace('postcode/projection@4', 'postcode/projection@verification-change'));
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
    const before = discover(config);
    writeFileSync(path.join(output, 'generated.ts'), 'export const fabricated = 1;');
    writeFileSync(path.join(output, 'batch.json'), '{"formatVersion":0}');
    assert.equal(discover(config).evaluation.snapshot, before.evaluation.snapshot);
    symlinkSync(output, path.join(root, 'alias'), 'dir');
    const linked = discover(config);
    assert.equal(linked.claims.length, 1);
    writeFileSync(path.join(output, 'generated.ts'), 'export const fabricated = 200;');
    assert.equal(discover(config).evaluation.snapshot, linked.evaluation.snapshot);
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

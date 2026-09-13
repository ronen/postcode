import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { createView, renderView } from '../src/lib/presentation.js';
import { inspect, modules } from '../src/lib/projections.js';
import type { ClaimContextRecord, ExportClaim, ModuleExpansion, RecordedAssertion, SourceEvidenceRecord, SymbolClaim, SymbolRecord } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';

function expanded(configPath = path.resolve('fixtures/exports/tsconfig.json'), requested: readonly ModuleExpansion[] = ['exports', 'documentation']) {
  const opened = openTypeScriptProject({ configPath });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Open failure');
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateModules(store, opened.analysis, requested);
  const projection = modules(store, evaluation);
  const exports = projection.expansions.claims.map(id => store.get(id))
    .filter((record): record is ExportClaim => record.kind === 'claim' && record.information.type === 'export');
  const from = (filename: string) => exports.filter(claim => {
    const module = store.get(claim.subject);
    assert.equal(module.kind, 'module');
    if (module.kind !== 'module') return false;
    const info = store.get(module.claim);
    if (info.kind !== 'claim') return false;
    const context = store.get(info.context) as ClaimContextRecord;
    return context.evidence.some(id => (store.get(id) as SourceEvidenceRecord).path.endsWith(`/${filename}`));
  });
  const symbolClaim = (claim: ExportClaim) => store.get((store.get(claim.information.symbol!) as SymbolRecord).claim) as SymbolClaim;
  return { store, evaluation, projection, exports, from, symbolClaim };
}

test('effective surfaces include direct/default/aliased/wildcard/chained exports and preserve origin identity', () => {
  const { from } = expanded();
  assert.deepEqual(from('origin.ts').map(claim => claim.information.exportedName), ['Dual', 'Merged', 'default', 'overloaded', 'value']);
  assert.deepEqual(from('barrel.ts').map(claim => claim.information.exportedName), ['Dual', 'Merged', 'Renamed', 'default', 'overloaded', 'value']);
  assert.deepEqual(from('chain.ts').map(claim => claim.information.exportedName), ['Dual', 'Merged', 'Renamed', 'overloaded', 'value']);
  const dual = from('origin.ts').find(claim => claim.information.exportedName === 'Dual')!;
  const renamed = from('barrel.ts').find(claim => claim.information.exportedName === 'Renamed')!;
  assert.equal(renamed.information.symbol, dual.information.symbol);
  assert.equal(renamed.information.origin, dual.subject);
  assert.ok(renamed.information.routes.some(route => route.kind === 'reexport' && route.aliased));
  assert.equal(from('chain.ts').find(claim => claim.information.exportedName === 'Dual')!.information.routes.filter(route => route.kind === 'wildcard').length, 2);
});

test('type, value and dual roles survive type-only direct and chained forwarding', () => {
  const { from } = expanded();
  const roles = (file: string, name: string) => from(file).find(claim => claim.information.exportedName === name)!.information.roles;
  assert.deepEqual(roles('origin.ts', 'Dual'), { type: true, value: true });
  assert.deepEqual(roles('origin.ts', 'Merged'), { type: true, value: false });
  assert.deepEqual(roles('origin.ts', 'value'), { type: false, value: true });
  assert.deepEqual(roles('types.ts', 'Dual'), { type: true, value: false });
  assert.deepEqual(roles('types.ts', 'TypeDual'), { type: true, value: false });
  assert.deepEqual(roles('import-alias.ts', 'ImportedType'), { type: true, value: false });
});

test('overloads and merged declarations are one semantic symbol with separate evidence', () => {
  const { from, symbolClaim } = expanded();
  assert.equal(symbolClaim(from('origin.ts').find(claim => claim.information.exportedName === 'Merged')!).information.declarationCount, 2);
  assert.equal(symbolClaim(from('origin.ts').find(claim => claim.information.exportedName === 'overloaded')!).information.declarationCount, 3);
});

test('module and symbol documentation, tags and independent contributions remain recorded assertions', () => {
  const { store, projection } = expanded();
  const assertions = projection.expansions.claims.map(id => store.get(id)).flatMap(record =>
    record.kind === 'claim' && record.information.type === 'documentation-association'
      ? [store.get(record.information.assertion) as RecordedAssertion] : []);
  for (const text of ['First contribution.', 'Second contribution, independently recorded.', 'Accepts a string.', 'Accepts a number.', 'A compiler-associated module assertion.']) {
    assert.ok(assertions.some(assertion => assertion.text === text), text);
  }
  assert.ok(assertions.some(assertion => assertion.tags.some(tag => tag.name === 'deprecated')));
  assert.ok(assertions.every(assertion => assertion.status === 'recorded-assertion'));
  assert.ok(assertions.some(assertion => assertion.text === 'Alias-specific documentation.'));
});

test('export assignments are represented explicitly', () => {
  const { from } = expanded();
  const assignment = from('assignment.cts').find(claim => claim.information.exportedName === 'export=');
  assert.ok(assignment);
  assert.ok(assignment.information.routes.some(route => route.kind === 'export-assignment'));
  const property = from('assignment.cts').find(claim => claim.information.exportedName === 'property');
  assert.ok(property);
  assert.ok(property.information.routes.some(route => route.kind === 'export-assignment'));
  assert.deepEqual(property.information.roles, { type: false, value: true });
});

test('expansions are requested before evaluation and inspect includes only selected expansion subjects', () => {
  const unexpanded = expanded(undefined, []);
  assert.deepEqual(unexpanded.projection.expansions.requested, []);
  assert.deepEqual(unexpanded.projection.expansions.claims, []);
  const { store, evaluation, from } = expanded();
  const selected = from('origin.ts')[0]!.subject;
  const projection = inspect(store, evaluation, selected);
  const relationships = projection.expansions.claims.map(id => store.get(id)).filter(record => record.kind === 'claim' && record.information.type === 'export');
  assert.equal(relationships.length, 5);
  assert.ok(relationships.every(record => record.kind === 'claim' && record.subject === selected));
});

test('unresolved export targets produce partial expansion outcomes even when no export entity is available', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-unresolved-'));
  try {
    writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["missing.ts","healthy.ts"]}');
    writeFileSync(path.join(root, 'healthy.ts'), 'export const healthy = 1;');
    writeFileSync(path.join(root, 'missing.ts'), 'export * from "./absent"; export { no } from "./absent";');
    const { store, projection, evaluation, from } = expanded(path.join(root, 'tsconfig.json'));
    assert.equal(evaluation.materialization, 'full');
    assert.ok(projection.evaluations.map(id => store.get(id)).some(record => record.kind === 'evaluation' && record.materialization === 'partial'));
    const healthy = inspect(store, evaluation, from('healthy.ts')[0]!.subject);
    assert.ok(healthy.evaluations.map(id => store.get(id)).every(record => record.kind === 'evaluation' && record.materialization === 'full'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});


test('requested expansion kinds are unique while qualified evaluation scopes remain per module', () => {
  const { store, evaluation, projection } = expanded();
  assert.ok(projection.modules.length > 1);
  for (const selected of [projection, inspect(store, evaluation, projection.modules[0]!), inspect(store, evaluation, 'absent')]) {
    assert.deepEqual(selected.expansions.requested, ['exports', 'documentation']);
    const view = createView(store, selected, { format: 'json', sourceDetail: false });
    const serialized = JSON.parse(renderView(view)) as typeof view;
    assert.deepEqual(serialized.presentation.expansions, ['exports', 'documentation']);
    assert.equal(new Set(serialized.presentation.expansions).size, serialized.presentation.expansions.length);
    assert.deepEqual(serialized.evaluations.map(outcome => outcome.id), selected.evaluations);
    for (const requirement of ['exports', 'documentation']) {
      const outcomes = serialized.evaluations.filter(outcome => outcome.requirement === requirement);
      assert.equal(outcomes.length, selected.modules.length);
      assert.deepEqual(outcomes.flatMap(outcome => outcome.modules), selected.modules);
      assert.ok(outcomes.every(outcome => outcome.execution === 'completed' && outcome.materialization === 'full'));
    }
  }
});

test('renamed re-export traversal revisits a module under another name and still terminates true cycles', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-reexport-cycle-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"include":["*.ts"]}');
    writeFileSync(path.join(root, 'a.ts'), "export { b as a } from './b.js'; export const b = 1;");
    writeFileSync(path.join(root, 'b.ts'), "export { b } from './a.js';");
    writeFileSync(path.join(root, 'c.ts'), "export * from './d.js'; export * from './e.js';");
    writeFileSync(path.join(root, 'd.ts'), "export * from './c.js';");
    writeFileSync(path.join(root, 'e.ts'), 'export const value=1;');
    const { from, store } = expanded(config);
    const alias = from('a.ts').find(claim => claim.information.exportedName === 'a')!;
    const local = from('a.ts').find(claim => claim.information.exportedName === 'b')!;
    assert.deepEqual(alias.information.routes.map(route => route.kind), ['reexport', 'reexport', 'direct']);
    assert.deepEqual(alias.information.routes.map(route => route.via), [from('b.ts')[0]!.subject, local.subject, null]);
    assert.equal(alias.information.symbol, local.information.symbol);
    const context = store.get(alias.context) as ClaimContextRecord;
    assert.ok(context.evidence.map(id => store.get(id) as SourceEvidenceRecord)
      .some(evidence => evidence.path.endsWith('/b.ts')));
    assert.deepEqual(from('c.ts').map(claim => claim.information.exportedName), ['value']);
    assert.deepEqual(from('d.ts').map(claim => claim.information.exportedName), ['value']);
    assert.ok(from('c.ts')[0]!.information.routes.length < 8);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

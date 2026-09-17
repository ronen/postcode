import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import type { QualifiedDependencyView } from '../src/lib/dependencies/presentation.js';
import type { QualifiedView } from '../src/lib/presentation.js';

async function invoke(config: string, args: string[]) {
  let stdout = ''; let stderr = ''; const batches: ObservationBatch[] = [];
  const exit = await runCli([...args, '--project', config], { cwd: process.cwd(), checkout: process.cwd(),
    stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
    sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } } });
  return { stdout, stderr, exit, batches };
}
const viewOf = (result: Awaited<ReturnType<typeof invoke>>) => {
  assert.equal(result.exit, 0, result.stderr);
  return result.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedDependencyView;
};

test('representative journey preserves direct intermediates, shared parents, composition and scoped navigation', async () => {
  const config = path.resolve('fixtures/dependency-journey/tsconfig.json');
  const initial = await invoke(config, ['dependencies']);
  const view = viewOf(initial);
  assert.equal(view.summary.modules, 6);
  assert.deepEqual([...view.presentation.expansions].sort(), ['composition', 'documentation', 'exports', 'repository-layout']);
  assert.equal(view.summary.relationships, 6);
  const module = (handle: string) => view.modules.find(module => module.handle === handle)!;
  assert.equal(view.graph!.roots.length, 1);
  assert.deepEqual(view.graph!.components[view.graph!.roots[0]!]!.members, [module('entry').id]);
  assert.match(initial.stdout, /parent → dependency child/);
  assert.match(initial.stdout, /re-exports only/);
  assert.ok(view.relationships.some(edge => edge.organization?.classification === 'outward'));
  assert.ok(view.relationships.some(edge => edge.organization?.classification === 'same-group'));
  const snapshot = view.projection.snapshot;
  const children = viewOf(await invoke(config, ['children', module('right').entityId, '--snapshot', snapshot, '--json']));
  assert.deepEqual(children.relationships.map(edge => edge.child), [module('forward').id]);
  const parents = viewOf(await invoke(config, ['parents', module('shared').entityId, '--snapshot', snapshot, '--json']));
  assert.deepEqual(parents.relationships.map(edge => edge.parent).sort(), [module('left').id, module('forward').id].sort());
  assert.equal(parents.projection.snapshot, snapshot);
  assert.equal(parents.recognitionCoverage.length, 0);
  assert.ok(parents.limitations.some(text => text.includes('cannot produce a parent result')));
  assert.match(view.presentation.navigation!.inspect, /--dependency-context/);
  const inspected = await invoke(config, ['inspect', module('forward').entityId, '--snapshot', snapshot, '--dependency-context', '--json']);
  const detail = JSON.parse(inspected.stdout) as QualifiedView;
  assert.equal(detail.modules.length, 1);
  assert.equal(detail.modules[0]!.composition.claims[0]!.property, 're-exports-only');
  assert.equal(viewOf(await invoke(config, ['children', module('left').handle, '--json'])).projection.selection.referenceStatus, 'snapshot-required');
  assert.equal(viewOf(await invoke(config, ['parents', module('shared').entityId, '--snapshot', `snapshot:${'0'.repeat(64)}`, '--json'])).subjects.length, 0);
  const json = viewOf(await invoke(config, ['dependencies', '--json']));
  assert.deepEqual(json.projection, view.projection);
  assert.deepEqual(json.relationships.map(edge => edge.id), view.relationships.map(edge => edge.id));
});

test('source-owned request results and recognition outcomes are separate and parent disclosure does not fabricate them', async () => {
  const config = path.resolve('fixtures/dependency-contract/tsconfig.json');
  const initial = viewOf(await invoke(config, ['dependencies', '--json']));
  const requests = initial.modules.find(module => module.handle === 'requests')!;
  const children = await invoke(config, ['children', requests.entityId, '--snapshot', initial.projection.snapshot, '--json']);
  const view = viewOf(children);
  assert.equal(view.requestResults.length, 6);
  assert.ok(view.recognitionCoverage.length > 0);
  assert.ok(view.recognitionCoverage.some(item => item.outcome === 'alternative-binding'));
  assert.ok(view.limitations.some(text => text.includes('bare require')));
  for (const key of ['"path":', '"evidence":', '"writtenSpecifier":', '"resolvedFile":', '"excerpt":']) assert.equal(children.stdout.includes(key), false, key);
  const escaped = await invoke(config, ['children', requests.entityId, '--snapshot', initial.projection.snapshot, '--source-detail', '--json']);
  const source = viewOf(escaped).sourceDetail!;
  assert.ok(source.items.some(item => item.evidence.dependencyResolution?.status === 'target-indeterminate'));
  assert.ok(source.items.some(item => item.evidence.dependencyResolution?.status === 'unresolved'));
  assert.ok(source.items.some(item => item.role === 'recognition-coverage'));
  assert.ok(source.items.length <= 100);
  assert.ok(source.organizationEvidence.some(item => item.kind === 'repository-region'));
  const batch = escaped.batches[0]!;
  assert.equal(batch.events[1]!.sourceLevel, 'dependency-occurrences-and-organization-evidence');
  assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, escaped.stdout);
  const parents = await invoke(config, ['parents', requests.entityId, '--snapshot', initial.projection.snapshot]);
  const parentView = viewOf(parents);
  assert.deepEqual(parentView.requestResults, []);
  assert.deepEqual(parentView.recognitionCoverage, []);
  assert.match(parents.stdout, /without an established child cannot be attributed/);
  assert.match(parents.stdout, /CommonJS coverage/);
});

test('opaque external endpoints render as leaves and never claim an established empty interior', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-external-'));
  try {
    mkdirSync(path.join(root, 'node_modules/outside'), { recursive: true });
    writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"module":"NodeNext","moduleResolution":"NodeNext","noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), "import type { T } from 'outside'; export type U = T;");
    writeFileSync(path.join(root, 'node_modules/outside/package.json'), '{"types":"index.d.ts"}');
    writeFileSync(path.join(root, 'node_modules/outside/index.d.ts'), 'export interface T {}');
    const config = path.join(root, 'tsconfig.json');
    const result = await invoke(config, ['dependencies']);
    const view = viewOf(result);
    assert.match(result.stdout, /opaque external/);
    const external = view.modules.find(module => module.opaque)!;
    assert.ok(!view.graph!.components.some(component => component.members.includes(external.id)));
    const child = await invoke(config, ['children', external.entityId, '--snapshot', view.projection.snapshot]);
    assert.match(child.stdout, /empty child set is not established/);
    assert.equal(viewOf(child).evaluations.organization!.availability, 'unavailable');
    const parent = viewOf(await invoke(config, ['parents', external.entityId, '--snapshot', view.projection.snapshot]));
    assert.equal(parent.relationships.length, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('cycle grouping retains internal edges and display depth omissions do not remove JSON graph facts', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-depth-'));
  try {
    execFileSync('git', ['init', '--quiet', root]);
    writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"include":["*.ts"]}');
    for (let index = 0; index < 10; index++) writeFileSync(path.join(root, `m${index}.ts`), index === 9 ? 'export const value = 1;' : `export * from './m${index + 1}';`);
    writeFileSync(path.join(root, 'a.ts'), "export * from './b';");
    writeFileSync(path.join(root, 'b.ts'), "export * from './a';");
    const config = path.join(root, 'tsconfig.json');
    const unicode = await invoke(config, ['dependencies']);
    const view = viewOf(unicode);
    assert.match(unicode.stdout, /Cycle grouping \(not an entity\)/);
    assert.equal(view.graph!.components.find(component => component.cyclic)!.internalRelationships.length, 2);
    assert.ok(view.display.prunedComponents > 0);
    assert.ok(view.display.omittedRelationships > 0);
    assert.match(unicode.stdout, /Display bounds do not reduce analysis coverage/);
    const json = viewOf(await invoke(config, ['dependencies', '--json']));
    assert.equal(json.display.omittedModules, 0);
    assert.equal(json.display.omittedRelationships, 0);
    assert.equal(json.relationships.length, 11);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('source-only context preparation keeps dependency navigation scoped where CommonJS observes extra inputs', async () => {
  const config = path.resolve('fixtures/dependency-contract/tsconfig.json');
  const initial = viewOf(await invoke(config, ['dependencies', '--json']));
  const selected = initial.modules.find(module => module.handle === 'requests')!;
  const inspected = JSON.parse((await invoke(config, ['inspect', selected.entityId, '--snapshot', initial.projection.snapshot, '--dependency-context', '--json'])).stdout) as QualifiedView;
  assert.equal(inspected.projection.selection.matches, 1);
  assert.equal(inspected.projection.snapshot, initial.projection.snapshot);
});

test('component bounds count disconnected omissions and terminal controls stay inert', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-bounds-'));
  try {
    writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"include":["*.ts"]}');
    for (let index = 0; index < 65; index++) writeFileSync(path.join(root, `m${index}.ts`), 'export const value = 1;');
    writeFileSync(path.join(root, 'ambient.d.ts'), "declare module 'name\\u001b[31m' { export const value: number; }");
    const config = path.join(root, 'tsconfig.json');
    const unicode = await invoke(config, ['dependencies']);
    const view = viewOf(unicode);
    assert.equal(view.display.rows.length, 60);
    assert.equal(view.display.omittedModules, 6);
    assert.equal(unicode.stdout.includes('\u001b'), false);
    const json = viewOf(await invoke(config, ['dependencies', '--json']));
    assert.equal(json.modules.length, 66);
    assert.equal(json.display.omittedModules, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

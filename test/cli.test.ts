import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch, ObservationSink } from '../src/lib/observations.js';
import type { QualifiedView } from '../src/lib/presentation.js';

const config = path.resolve('fixtures/exports/tsconfig.json');
async function invoke(args: string[], sink?: ObservationSink, checkout = process.cwd()) {
  let stdout = '';
  let stderr = '';
  const batches: ObservationBatch[] = [];
  const exit = await runCli(args, { cwd: process.cwd(), checkout,
    stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
    sink: sink ?? { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  return { stdout, stderr, exit, batches };
}

test('Unicode and experimental JSON use the same qualified projection and automatically record exact displayed artifacts', async () => {
  const unicode = await invoke(['--project', config]);
  const json = await invoke(['--project', config, '--json']);
  assert.equal(unicode.exit, 0);
  assert.equal(json.exit, 0);
  const structured = JSON.parse(json.stdout) as QualifiedView;
  const unicodeArtifact = unicode.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedView;
  assert.deepEqual(structured.projection, unicodeArtifact.projection);
  assert.deepEqual(structured.modules, unicodeArtifact.modules);
  assert.equal(structured.schema, 'postcode-view/0-experimental');
  assert.ok(unicode.stdout.includes('Recorded assertion'));
  assert.ok(unicode.stdout.includes('documentation assertion(s) omitted'));
  assert.ok(unicode.stderr.includes('Local observations:'));
  for (const result of [unicode, json]) {
    assert.equal(result.batches.length, 1);
    const batch = result.batches[0]!;
    assert.equal(batch.formatVersion, 0);
    assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, result.stdout);
    const ids = [batch.id, ...batch.records.map(record => record.id), ...batch.events.map(event => event.id)];
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.every(id => /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/.test(id)));
    for (const event of batch.events) for (const id of [event.request, event.analysis, event.view, event.rendered]) {
      assert.ok(batch.records.some(record => record.id === id));
    }
  }
  assert.notEqual(unicode.batches[0]!.id, json.batches[0]!.id);
});

test('normal views omit source facets and raw evidence; inspection source escape only discloses displayed claims', async () => {
  const inventory = await invoke(['--project', config, '--json']);
  const view = JSON.parse(inventory.stdout) as QualifiedView;
  assert.equal(view.sourceDetail, undefined);
  assert.equal(inventory.stdout.includes(process.cwd()), false);
  for (const key of ['"path":', '"compilerName":', '"contentDigest":', '"evidence":', '"start":']) assert.equal(inventory.stdout.includes(key), false);
  const selected = view.modules.find(module => module.name === 'documented')!;
  const inspected = await invoke(['inspect', selected.handle, '--project', config, '--source-detail', '--json']);
  const detail = JSON.parse(inspected.stdout) as QualifiedView;
  assert.equal(detail.modules.length, 1);
  assert.ok(detail.sourceDetail);
  assert.ok(detail.sourceDetail.claims.flatMap(claim => claim.evidence).every(evidence => evidence.path.endsWith('/ambient.d.ts')));
  const batch = inspected.batches[0]!;
  assert.deepEqual(batch.events.map(event => event.type), ['view-produced', 'source-escape']);
  assert.equal(batch.records.length, 4);
  assert.equal(batch.events[1]!.sourceLevel, 'declaration-locations');
  const missing = await invoke(['inspect', 'no match', '--project', config, '--json']);
  assert.equal((JSON.parse(missing.stdout) as QualifiedView).projection.selection.matches, 0);
});

test('delivery rejection and thrown sink failure visibly report the observation gap while preserving the successful view', async () => {
  for (const sink of [
    { async submit() { return { accepted: false as const, reason: 'rejected fixture' }; } },
    { async submit(): Promise<never> { throw new Error('offline fixture'); } },
  ]) {
    const result = await invoke(['--project', config, '--json'], sink);
    assert.equal(result.exit, 0);
    assert.ok(result.stderr.includes('WARNING: observation not recorded'));
    assert.equal((JSON.parse(result.stdout) as QualifiedView).projection.selection.populationEstablished, true);
  }
});

test('invalid CLI requests and project-open failures produce no view or misleading observation', async () => {
  for (const args of [['inspect'], ['inspect', 'one', 'two'], ['--source-detail'], ['--project'], ['--unknown'], ['--project', '/postcode-not-present/tsconfig.json']]) {
    const result = await invoke(args);
    assert.equal(result.exit, 2);
    assert.equal(result.stdout, '');
    assert.equal(result.batches.length, 0);
  }
});

test('independent CLI processes reproduce JSON while the local sink writes private self-contained batches', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-cli-'));
  try {
    cpSync('_build', path.join(root, '_build'), { recursive: true });
    writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
    symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
    const cli = path.join(root, '_build/src/cli.js');
    const args = [cli, '--project', config, '--json'];
    const output = execFileSync(process.execPath, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    assert.equal(execFileSync(process.execPath, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }), output);
    const sink = path.join(root, '_observations');
    const files = readdirSync(sink);
    assert.equal(files.length, 2);
    assert.equal(statSync(sink).mode & 0o777, 0o700);
    for (const file of files) {
      const destination = path.join(sink, file);
      assert.equal(statSync(destination).mode & 0o777, 0o600);
      const batch = JSON.parse(readFileSync(destination, 'utf8')) as ObservationBatch;
      assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, output);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('CLI explicitly excludes actual checkout output directories when analyzing a nested configuration', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-nested-'));
  try {
    mkdirSync(path.join(root, 'nested'));
    mkdirSync(path.join(root, '_observations'));
    const nested = path.join(root, 'nested/tsconfig.json');
    writeFileSync(nested, '{"compilerOptions":{"noLib":true,"types":[]},"include":["../**/*.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export const actual = 1;');
    const before = await invoke(['--project', nested, '--json'], undefined, root);
    writeFileSync(path.join(root, '_observations/generated.ts'), 'export const fabricated = 1;');
    const after = await invoke(['--project', nested, '--json'], undefined, root);
    assert.equal(after.stdout, before.stdout);
    assert.equal((JSON.parse(after.stdout) as QualifiedView).modules.length, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('bounded exports and documentation disclose every material omission in both presentations', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-omission-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["large.ts"]}');
    writeFileSync(path.join(root, 'large.ts'), `/** ${'A'.repeat(600)} */\nexport const a = 1;\n${Array.from({ length: 8 }, (_, i) => `export const b${i} = ${i};`).join('\n')}`);
    const json = await invoke(['--project', config, '--json']);
    const unicode = await invoke(['--project', config]);
    const view = JSON.parse(json.stdout) as QualifiedView;
    assert.equal(view.modules[0]!.exports.length, 6);
    assert.equal(view.modules[0]!.omittedExports, 3);
    assert.equal(view.modules[0]!.exports[0]!.documentation[0]!.omittedTextCharacters, 200);
    assert.ok(unicode.stdout.includes('3 effective export(s) omitted'));
    assert.ok(unicode.stdout.includes('200 assertion character(s) omitted'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('conceptual documentation excerpts omit source examples and source-oriented tags with counts', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-source-docs-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["docs.ts"]}');
    writeFileSync(path.join(root, 'docs.ts'), '/** Conceptual prose.\n * ```ts\n * const sourceExample = 1;\n * ```\n * @example otherSourceExample();\n * @see source.ts\n * @deprecated Use a newer API.\n */\nexport const value = 1;');
    const json = await invoke(['--project', config, '--json']);
    assert.equal(json.stdout.includes('sourceExample'), false);
    assert.equal(json.stdout.includes('otherSourceExample'), false);
    assert.equal(json.stdout.includes('source.ts'), false);
    const assertion = (JSON.parse(json.stdout) as QualifiedView).modules[0]!.exports[0]!.documentation[0]!;
    assert.ok(assertion.omittedTextCharacters > 0);
    assert.equal(assertion.omittedTags, 2);
    assert.equal(assertion.tags[0]!.name, 'deprecated');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch, ObservationSink } from '../src/lib/observations.js';
import { renderUnicode } from '../src/lib/presentation.js';
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

function copyTestCheckout(checkout: string) {
  cpSync('_build/src', path.join(checkout, '_build/src'), { recursive: true });
  writeFileSync(path.join(checkout, 'package.json'), '{"type":"module"}');
  symlinkSync(path.resolve('node_modules'), path.join(checkout, 'node_modules'), 'dir');
  // Node resolves the entry point's real path; use that same checkout for generated scope.
  return realpathSync(checkout);
}

function assertRecordedOutput(checkout: string, output: string) {
  const sink = path.join(checkout, '_observations');
  const files = readdirSync(sink);
  assert.equal(files.length, 1);
  const batch = JSON.parse(readFileSync(path.join(sink, files[0]!), 'utf8')) as ObservationBatch;
  assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, output);
}

test('Unicode and experimental JSON use the same qualified projection and automatically record exact displayed artifacts', async () => {
  const unicode = await invoke(['--project', config]);
  const json = await invoke(['--project', config, '--json']);
  assert.equal(unicode.exit, 0);
  assert.equal(json.exit, 0);
  const structured = JSON.parse(json.stdout) as QualifiedView;
  const unicodeArtifact = unicode.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedView;
  assert.deepEqual(structured.projection, unicodeArtifact.projection);
  assert.deepEqual(structured.modules.map(module => module.id), unicodeArtifact.modules.map(module => module.id));
  assert.equal(structured.schema, 'postcode-view/0-experimental');
  assert.equal(unicode.stdout.includes('Documentation entries are recorded assertions'), false);
  assert.ok(unicode.stdout.includes('documentation for'));
  assert.equal(unicode.stdout.includes('[type]'), false);
  assert.ok(unicode.stdout.includes('Export names'));
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
  const { navigation: _navigation, ...presentation } = view.presentation;
  assert.equal(JSON.stringify({ ...view, presentation }).includes(process.cwd()), false);
  for (const key of ['"path":', '"compilerName":', '"contentDigest":', '"evidence":', '"start":']) assert.equal(inventory.stdout.includes(key), false);
  const selected = view.modules.find(module => module.name === 'documented')!;
  const inspected = await invoke(['inspect', selected.handle, '--snapshot', view.projection.snapshot, '--project', config, '--source-detail', '--json']);
  const detail = JSON.parse(inspected.stdout) as QualifiedView;
  assert.equal(detail.modules.length, 1);
  assert.ok(detail.sourceDetail);
  assert.ok(detail.sourceDetail.items.flatMap(claim => claim.evidence).every(evidence => evidence.path.endsWith('/ambient.d.ts')));
  const batch = inspected.batches[0]!;
  assert.deepEqual(batch.events.map(event => event.type), ['view-produced', 'source-escape']);
  assert.equal(batch.records.length, 4);
  assert.equal(batch.events[1]!.sourceLevel, 'declaration-locations-and-excerpts');
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

test('malformed root and inherited configurations report each syntax diagnostic once', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-config-diagnostics-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    const malformed = '{"compilerOptions":{"noLib":true,"types":[]},"files":[]';
    for (const inherited of [false, true]) {
      writeFileSync(config, inherited ? '{"extends":"./base.json","files":[]}' : malformed);
      if (inherited) writeFileSync(path.join(root, 'base.json'), malformed);
      const result = await invoke(['--project', config]);
      assert.equal(result.exit, 2);
      assert.equal(result.stdout, '');
      assert.equal(result.batches.length, 0);
      assert.deepEqual(result.stderr.trim().split('\n'), ['Project open failed:',
        `  TS1005: ${inherited ? path.join(root, 'base.json') : config}:1:${malformed.length + 1}: '}' expected.`]);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('configuration diagnostics retain equal messages at different files or positions', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-distinct-diagnostics-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"extends":["./first.json","./second.json"],"files":[]}');
    for (const name of ['first.json', 'second.json']) {
      writeFileSync(path.join(root, name), '{"compilerOptions":{"noLib":true,"types":[]},"files":[]');
    }
    const files = await invoke(['--project', config]);
    assert.equal(files.exit, 2);
    assert.equal(files.stdout, '');
    assert.equal(files.batches.length, 0);
    assert.deepEqual(files.stderr.trim().split('\n'), ['Project open failed:',
      `  TS1005: ${path.join(root, 'first.json')}:1:56: '}' expected.`,
      `  TS1005: ${path.join(root, 'second.json')}:1:56: '}' expected.`]);
    writeFileSync(config, '{"extends":"./first.json","files":[]}');
    writeFileSync(path.join(root, 'first.json'), '{"compilerOptions":{"noLib":true "types":[]} "files":[]}');
    const positions = await invoke(['--project', config]);
    assert.equal(positions.exit, 2);
    assert.equal(positions.stdout, '');
    assert.equal(positions.batches.length, 0);
    assert.deepEqual(positions.stderr.trim().split('\n'), ['Project open failed:',
      `  TS1005: ${path.join(root, 'first.json')}:1:34: ',' expected.`,
      `  TS1005: ${path.join(root, 'first.json')}:1:46: ',' expected.`]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('modules usage errors identify source-detail and snapshot as inspection-only options', async () => {
  for (const lens of [[], ['modules']]) {
    for (const options of [['--source-detail'], ['--snapshot', `snapshot:${'a'.repeat(64)}`],
      ['--source-detail', '--snapshot', `snapshot:${'a'.repeat(64)}`]]) {
      const result = await invoke([...lens, ...options]);
      assert.equal(result.exit, 2);
      assert.equal(result.stdout, '');
      assert.equal(result.batches.length, 0);
      assert.ok(result.stderr.includes('--source-detail and --snapshot require inspect'));
    }
  }
});

test('end-of-options preserves option-like exact names while keeping one-selector validation', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-option-names-'));
  try {
    const checkout = copyTestCheckout(path.join(root, 'checkout'));
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["ambient.d.ts"]}');
    const names = ['--json', '-h', '--help', '--project', '--source-detail', '--'];
    writeFileSync(path.join(root, 'ambient.d.ts'), names.map(name => `declare module "${name}" { export const value: number; }`).join('\n'));
    for (const name of names) {
      const result = await invoke(['inspect', '--project', config, '--json', '--', name], undefined, checkout);
      assert.equal(result.exit, 0, result.stderr);
      const view = JSON.parse(result.stdout) as QualifiedView;
      assert.deepEqual(view.modules.map(module => module.name), [name]);
      assert.equal(result.batches.length, 1);
      assert.equal(view.sourceDetail, undefined);
      if (name === '--json') {
        const command = view.presentation.navigation!.inspect.replace('MODULE_HANDLE', name);
        const output = execFileSync('/bin/sh', ['-c', command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        assert.ok(output.includes('exact match for --json'));
        assert.ok(output.includes('1 module selected from 6'));
        assertRecordedOutput(checkout, output);
      }
    }
    const invalid = await invoke(['inspect', '--project', config, '--', '--json', '-h']);
    assert.equal(invalid.exit, 2);
    assert.equal(invalid.batches.length, 0);
    const missing = await invoke(['inspect', '--project', config, '--']);
    assert.equal(missing.exit, 2);
    const help = await invoke(['inspect', '--help']);
    assert.equal(help.exit, 0);
    assert.ok(help.stdout.startsWith('PostCode —'));
    assert.equal(help.batches.length, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('target directories named like PostCode output retain configured sources and input identity', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-legitimate-inputs-'));
  try {
    for (const directory of ['_build', '_observations']) mkdirSync(path.join(root, directory));
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(path.join(root, 'regular.ts'), 'export const regular = 1;');
    for (const selection of [{ files: ['regular.ts', '_build/legitimate.ts', '_observations/legitimate.ts'] }, { include: ['**/*.ts'] }]) {
      writeFileSync(path.join(root, '_build/legitimate.ts'), 'export const buildSource = 1;');
      writeFileSync(path.join(root, '_observations/legitimate.ts'), 'export const observationSource = 1;');
      writeFileSync(config, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, ...selection }));
      const before = await invoke(['modules', '--project', config, '--json']);
      assert.equal(before.exit, 0, before.stderr);
      const view = JSON.parse(before.stdout) as QualifiedView;
      assert.equal(view.modules.length, 3);
      assert.ok(view.evaluations.every(outcome => outcome.materialization === 'full'));
      const snapshots = [view.projection.snapshot];
      for (const directory of ['_build', '_observations']) {
        const filename = path.join(root, directory, 'legitimate.ts');
        writeFileSync(filename, readFileSync(filename, 'utf8') + '\nexport const extra = 2;');
        const changed = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
        snapshots.push(changed.projection.snapshot);
      }
      assert.equal(new Set(snapshots).size, 3);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('independent CLI processes reproduce JSON while the local sink writes private self-contained batches', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-cli-'));
  try {
    copyTestCheckout(root);
    const cli = path.join(root, '_build/src/cli.js');
    const args = [cli, '--project', config, '--json'];
    const output = execFileSync(process.execPath, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    assert.equal(execFileSync(process.execPath, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }), output);
    const unicodeArgs = [cli, '--project', config];
    const unicode = execFileSync(process.execPath, unicodeArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    assert.equal(execFileSync(process.execPath, unicodeArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }), unicode);
    const sink = path.join(root, '_observations');
    const files = readdirSync(sink);
    assert.equal(files.length, 4);
    assert.equal(statSync(sink).mode & 0o777, 0o700);
    for (const file of files) {
      const destination = path.join(sink, file);
      assert.equal(statSync(destination).mode & 0o777, 0o600);
      const batch = JSON.parse(readFileSync(destination, 'utf8')) as ObservationBatch;
      assert.ok([output, unicode].includes(batch.records.find(record => record.kind === 'rendered-output')!.value as string));
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
    assert.ok(unicode.stdout.includes('6 exports from listed modules'));
    assert.ok(unicode.stdout.includes('documentation for 1 listed module'));
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

test('Unicode distinguishes established empty exports from unresolved exports and explains display limits', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-empty-exports-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export {};');
    const empty = await invoke(['--project', config]);
    assert.ok(empty.stdout.includes('(none)'));
    assert.ok(empty.stdout.includes('Analysis complete: modules, exports, documentation'));
    assert.ok(empty.stdout.includes('Next · inspect a module:'));
    writeFileSync(path.join(root, 'entry.ts'), 'export * from "./missing.js";');
    const unresolved = await invoke(['--project', config]);
    assert.ok(unresolved.stdout.includes('(not established; no exports displayed)'));
    assert.equal(unresolved.stdout.includes('(none)'), false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('inventory counts omitted external documentation while exact inspection makes it available', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-external-docs-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    mkdirSync(path.join(root, 'node_modules/dependency'), { recursive: true });
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'import "dependency"; export {};');
    writeFileSync(path.join(root, 'node_modules/dependency/index.d.ts'), '/** External responsibility. */\nexport declare const value: number;');
    const inventory = await invoke(['--project', config, '--json']);
    const view = JSON.parse(inventory.stdout) as QualifiedView;
    const external = view.modules.find(module => module.facets.includes('external'))!;
    assert.ok(external);
    assert.equal(external.exports[0]!.documentation.length, 0);
    assert.equal(external.exports[0]!.omittedDocumentation, 1);
    const inspected = await invoke(['inspect', external.handle, '--snapshot', view.projection.snapshot, '--project', config, '--json']);
    const detail = JSON.parse(inspected.stdout) as QualifiedView;
    assert.equal(detail.modules[0]!.exports[0]!.documentation[0]!.text, 'External responsibility.');
    const unicode = await invoke(['--project', config]);
    assert.ok(unicode.stdout.includes('2 modules found · 1 listed · 1 external module collapsed'));
    assert.equal(unicode.stdout.includes('External responsibility.'), false);
    assert.ok(unicode.stdout.includes('Entity ID'));
    assert.equal(unicode.stdout.includes('Origin this module'), false);
    assert.equal(unicode.stdout.includes('routes: direct'), false);
    assert.equal(unicode.stdout.includes('1 contributing declaration'), false);
    assert.equal(unicode.stdout.split(view.projection.snapshot).length - 1, 1);
    assert.ok(unicode.stdout.includes('Coverage: external-module SourceFiles'));
    const inspectedUnicode = await invoke(['inspect', external.handle, '--snapshot', view.projection.snapshot, '--project', config]);
    assert.ok(inspectedUnicode.stdout.includes('Documentation entries are recorded assertions'));
    assert.ok(inspectedUnicode.stdout.includes('External responsibility.'));
    assert.ok(inspectedUnicode.stdout.includes(`Entity ID: ${external.entityId}`));
    writeFileSync(path.join(root, 'node_modules/dependency/index.d.ts'), 'export * from "./missing.js";');
    const incomplete = await invoke(['--project', config]);
    assert.ok(incomplete.stdout.includes('1 external module collapsed'));
    assert.ok(incomplete.stdout.includes('materialization partial'));
    assert.ok(incomplete.stdout.includes('Collapsed anonymous:'));
    assert.ok(incomplete.stdout.includes('An export target could not be resolved'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('conceptual handles require their snapshot and never infer successors after changed inputs', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-handle-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    const entry = path.join(root, 'entry.ts');
    writeFileSync(entry, 'export function runCli() {}');
    const before = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
    const module = before.modules[0]!;
    assert.equal(module.handle, 'run-cli');
    const unscoped = JSON.parse((await invoke(['inspect', module.handle, '--project', config, '--json'])).stdout) as QualifiedView;
    assert.equal(unscoped.projection.selection.referenceStatus, 'snapshot-required');
    assert.equal(unscoped.projection.selection.matches, 0);
    writeFileSync(entry, 'export function runCli() { return 1; }');
    const after = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
    assert.equal(after.modules[0]!.handle, module.handle);
    assert.notEqual(after.projection.snapshot, before.projection.snapshot);
    const stale = JSON.parse((await invoke(['inspect', module.handle, '--snapshot', before.projection.snapshot, '--project', config, '--json'])).stdout) as QualifiedView;
    assert.equal(stale.projection.selection.referenceStatus, 'snapshot-mismatch');
    assert.equal(stale.projection.selection.matches, 0);
    const staleId = JSON.parse((await invoke(['inspect', module.id, '--project', config, '--json'])).stdout) as QualifiedView;
    assert.equal(staleId.projection.selection.matches, 0);
    const current = JSON.parse((await invoke(['inspect', module.handle, '--snapshot', after.projection.snapshot, '--project', config, '--json'])).stdout) as QualifiedView;
    assert.equal(current.projection.selection.matches, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('inspection suppresses ordinary provenance but preserves aliases and merged declarations', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-provenance-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export interface Merged {a: string}; export interface Merged {b: string}; export const ordinary = 1; export {ordinary as renamed};');
    const inventory = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
    const result = await invoke(['inspect', inventory.modules[0]!.entityId, '--snapshot', inventory.projection.snapshot, '--project', config]);
    assert.ok(result.stdout.includes('Merged [type] · 2 contributing declarations'));
    assert.ok(result.stdout.includes('renamed [value] · alias'));
    assert.equal(result.stdout.includes('ordinary: direct'), false);
    assert.equal(result.stdout.includes('1 contributing declaration'), false);
    assert.equal(result.stdout.includes('Origin this module'), false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('common success state is compact but abnormal capability states remain explicit', async () => {
  const result = await invoke(['--project', config, '--json']);
  const view = JSON.parse(result.stdout) as QualifiedView;
  assert.ok(renderUnicode(view).includes('Analysis complete: modules, exports, documentation'));
  for (const execution of ['deferred', 'stopped', 'failed'] as const) {
    const evaluations = view.evaluations.map((outcome, index) => index === 0 ? {
      ...outcome, execution, materialization: 'none' as const, reason: 'Explicit fixture state',
    } : outcome);
    const output = renderUnicode({ ...view, evaluations });
    assert.equal(output.includes('Analysis complete:'), false);
    assert.ok(output.includes(execution));
    assert.ok(output.includes('Explicit fixture state'));
  }
  const unavailable = renderUnicode({ ...view, evaluations: view.evaluations.map(outcome => ({ ...outcome, availability: 'unavailable', execution: 'deferred', materialization: 'none' })) });
  assert.ok(unavailable.includes('unavailable'));
  assert.equal(unavailable.includes('Analysis complete:'), false);
});

test('compact inventory consolidates common labels and counts documentation beyond its export cues', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-display-scopes-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"include":["*.ts"]}');
    writeFileSync(path.join(root, 'first.ts'), 'export const a=1; export const b=2; export const c=3;\n/** Not a displayed cue. */\nexport const z=4;');
    writeFileSync(path.join(root, 'second.ts'), 'export const other=1;');
    const result = await invoke(['--project', config]);
    const view = result.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedView;
    assert.equal(view.display.omittedExports, 1);
    assert.equal(view.display.modulesWithOmittedDocumentation, 1);
    assert.ok(result.stdout.includes('Omitted:\n    1 export from listed modules\n    documentation for 1 listed module'));
    assert.equal(result.stdout.split('TypeScript names not established').length - 1, 1);
    assert.equal(result.stdout.includes('(anonymous module)'), false);
    assert.equal(result.stdout.split('implementation-available').length - 1, 0);
    assert.equal(result.stdout.includes('Documentation entries are recorded assertions'), false);
    assert.equal(result.stdout.includes('not calls or dependencies'), false);
    assert.equal(result.stdout.includes('Not a displayed cue.'), false);
    assert.ok(result.stdout.includes('other compiler module categories are not established'));
    assert.ok(result.stdout.includes('not captured as an atomic filesystem snapshot'));
    assert.equal(view.analysis?.excludedOutputLocations, 2);
    assert.ok(result.stdout.includes("2 generated-output locations excluded by this run's input filter"));
    assert.ok(result.stdout.includes(`Snapshot ${view.projection.snapshot.slice(9, 21)}\n`));
    assert.equal(result.stdout.includes('Snapshot snapshot:'), false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('a mostly-type module uses an exported type cue instead of a helper predicate', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-type-handle-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export type Claim=string; export type ClaimContext={}; export type ExportClaim={}; export function isModuleClaim() {return true}');
    const view = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
    assert.equal(view.modules[0]!.handle, 'claim');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('the suggested command runs after replacing MODULE_HANDLE, including a quoted project path', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "postcode-project's "));
  try {
    const checkout = copyTestCheckout(path.join(root, 'checkout'));
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export function runCli() {}');
    const view = JSON.parse((await invoke(['--project', config, '--json'], undefined, checkout)).stdout) as QualifiedView;
    const command = view.presentation.navigation!.inspect.replace('MODULE_HANDLE', 'run-cli');
    const output = execFileSync('/bin/sh', ['-c', command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    assert.ok(output.includes('exact match for run-cli'));
    assert.ok(output.includes('1 module selected from 1'));
    assert.equal(output.includes('No current match'), false);
    assertRecordedOutput(checkout, output);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('generated navigation selects shared name-derived and basename handles; unscoped names and scoped IDs stay precise', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-shared-handle-'));
  try {
    const checkout = copyTestCheckout(path.join(root, 'checkout'));
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["widget.ts","ambient.d.ts"]}');
    writeFileSync(path.join(root, 'widget.ts'), 'export const value = 1;');
    writeFileSync(path.join(root, 'ambient.d.ts'), 'declare module "widget" { export const named: number; }');
    const inventory = JSON.parse((await invoke(['--project', config, '--json'], undefined, checkout)).stdout) as QualifiedView;
    assert.equal(inventory.modules.length, 2);
    const named = inventory.modules.find(module => module.name === 'widget')!;
    const anonymous = inventory.modules.find(module => module.name === null)!;
    assert.equal(named.handle, 'widget');
    assert.equal(named.handleProvenance, 'language-name');
    assert.equal(anonymous.handle, 'widget');
    assert.equal(anonymous.handleProvenance, 'source-basename');

    const command = inventory.presentation.navigation!.inspect.replace('MODULE_HANDLE', 'widget');
    const output = execFileSync('/bin/sh', ['-c', command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    assert.ok(output.includes('2 modules selected from 2 · exact matches for widget'));
    for (const module of inventory.modules) assert.ok(output.includes(`Entity ID: ${module.entityId}`));
    assertRecordedOutput(checkout, output);

    const scoped = JSON.parse((await invoke(['inspect', '--project', config, '--json',
      '--snapshot', inventory.projection.snapshot, '--', 'widget'], undefined, checkout)).stdout) as QualifiedView;
    assert.deepEqual(scoped.modules.map(module => module.id), inventory.modules.map(module => module.id));
    assert.equal(scoped.projection.selection.matches, 2);
    const unscoped = JSON.parse((await invoke(['inspect', '--project', config, '--json', '--', 'widget'], undefined, checkout)).stdout) as QualifiedView;
    assert.deepEqual(unscoped.modules.map(module => module.id), [named.id]);
    assert.equal(unscoped.projection.selection.matches, 1);
    for (const module of inventory.modules) {
      const precise = JSON.parse((await invoke(['inspect', '--project', config, '--json',
        '--snapshot', inventory.projection.snapshot, '--', module.entityId], undefined, checkout)).stdout) as QualifiedView;
      assert.deepEqual(precise.modules.map(selected => selected.id), [module.id]);
      assert.equal(precise.projection.selection.matches, 1);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('basename mnemonic evidence stays distinct from names and precise scoped Entity IDs', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-mnemonic-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"include":["**/*.ts"]}');
    mkdirSync(path.join(root, 'nested'));
    writeFileSync(path.join(root, 'evaluation.ts'), 'export const none=1;');
    writeFileSync(path.join(root, 'nested/evaluation.ts'), 'export {};');
    const long = 'a-very-long-recognition-handle-that-exceeds-the-padded-column';
    writeFileSync(path.join(root, `${long}.ts`), 'export {};');
    writeFileSync(path.join(root, 'index.ts'), 'export {};');
    const view = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
    const matching = view.modules.filter(module => module.handle === 'evaluation');
    assert.equal(matching.length, 2);
    for (const module of matching) {
      assert.equal(module.name, null);
      assert.equal(module.handleProvenance, 'source-basename');
      assert.match(module.entityId, /^module-[a-f0-9]{8,64}$/);
      const unscoped = JSON.parse((await invoke(['inspect', module.entityId, '--project', config, '--json'])).stdout) as QualifiedView;
      assert.equal(unscoped.projection.selection.referenceStatus, 'snapshot-required');
      const selected = JSON.parse((await invoke(['inspect', module.entityId, '--snapshot', view.projection.snapshot, '--project', config, '--json'])).stdout) as QualifiedView;
      assert.deepEqual(selected.modules.map(item => item.id), [module.id]);
    }
    const multiple = await invoke(['inspect', 'evaluation', '--snapshot', view.projection.snapshot, '--project', config]);
    assert.ok(multiple.stdout.includes('2 modules selected from 4 · exact matches for evaluation'));
    const zero = await invoke(['inspect', 'absent', '--project', config]);
    assert.ok(zero.stdout.includes('0 modules selected from 4 · no exact match for absent'));
    assert.ok(zero.stdout.includes('Module membership established by TypeScript analysis.'));
    assert.equal(zero.stdout.includes('export information is qualified'), false);
    const unicode = (await invoke(['--project', config])).stdout;
    assert.ok(unicode.includes(long));
    assert.match(unicode, /evaluation +module-[a-f0-9]+ +none\n/);
    assert.match(unicode, /evaluation +module-[a-f0-9]+ +\(none\)\n/);
    assert.equal(unicode.includes('nested/'), false);
    assert.equal(unicode.includes('evaluation.ts'), false);
    assert.ok(unicode.includes('Module membership and effective exports established by TypeScript analysis.'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('exceptional inspections retain forwarding provenance, qualified failures, and truncated assertions', async () => {
  const view = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
  const selected = view.modules.find(module => module.handle === 'chain')!;
  const reexport = await invoke(['inspect', selected.entityId, '--snapshot', view.projection.snapshot, '--project', config]);
  assert.ok(reexport.stdout.includes('wildcard'));
  assert.match(reexport.stdout, /origin: origin \(module-[a-f0-9]+\)/);
  assert.ok(reexport.stdout.includes('not calls or dependencies'));
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-inspection-'));
  try {
    const project = path.join(root, 'tsconfig.json');
    writeFileSync(project, '{"compilerOptions":{"noLib":true,"types":[]},"files":["index.ts"]}');
    writeFileSync(path.join(root, 'index.ts'), `/** ${'A'.repeat(2100)} */\nexport const documented=1;\nexport * from './missing.js';`);
    const inventory = JSON.parse((await invoke(['--project', project, '--json'])).stdout) as QualifiedView;
    const detail = await invoke(['inspect', inventory.modules[0]!.entityId, '--snapshot', inventory.projection.snapshot, '--project', project, '--source-detail']);
    assert.ok(detail.stdout.includes('materialization partial'));
    assert.ok(detail.stdout.includes('assertion character(s) omitted'));
    assert.ok(detail.stdout.includes('Documentation entries are recorded assertions'));
    assert.ok(detail.stdout.includes('truth, currency, and completeness are not established'));
    assert.ok(detail.stdout.includes('SOURCE DETAIL — explicit source escape'));
    assert.equal(detail.stdout.includes('Module membership and effective exports established'), false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('source expansion groups deduplicated evidence by displayed concepts with precise ranges and excerpts', async () => {
  const inventory = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
  const origin = inventory.modules.find(module => module.handle === 'origin')!;
  const args = ['inspect', origin.entityId, '--snapshot', inventory.projection.snapshot, '--project', config];
  const plain = await invoke(args);
  assert.equal(plain.stdout.includes('export interface Merged'), false);
  const result = await invoke([...args, '--source-detail', '--json']);
  const view = JSON.parse(result.stdout) as QualifiedView;
  const items = view.sourceDetail!.items;
  const module = items.find(item => item.label.startsWith('Module origin'))!;
  assert.equal(module.evidence.length, 1);
  assert.deepEqual(module.evidence[0]!.location, { association: 'file' });
  const merged = items.find(item => item.label.startsWith('Export Merged'))!;
  assert.equal(merged.evidence.length, 2);
  assert.deepEqual(merged.evidence.map(evidence => evidence.location.association === 'span' ? evidence.location.from : null), [
    { line: 4, column: 1 }, { line: 6, column: 1 },
  ]);
  const docs = items.find(item => item.label.startsWith('Documentation for Merged'))!;
  assert.equal(docs.evidence.length, 2);
  assert.ok(docs.evidence.every(evidence => evidence.location.association === 'span' && evidence.location.excerpt.text.startsWith('/**')));
  for (const evidence of items.flatMap(item => item.evidence)) {
    if (evidence.location.association === 'file') continue;
    const source = readFileSync(evidence.path, 'utf8');
    const span = source.slice(evidence.start, evidence.start + evidence.length);
    assert.ok(span.startsWith(evidence.location.excerpt.text));
    assert.equal(evidence.location.excerpt.omittedCharacters, [...span].length - [...evidence.location.excerpt.text].length);
  }
  const text = renderUnicode(view);
  assert.ok(text.includes('origin.ts:4:1–4:43'));
  assert.ok(text.includes('export interface Merged { first: string; }'));
  assert.ok(text.includes('Source file:'));
  assert.ok(text.replace(/\s+/g, ' ').includes('Module source files are listed without full-file excerpts.'));
  assert.equal(text.includes('Claim snapshot:'), false);
  assert.equal(text.includes('offset '), false);
  assert.equal(view.sourceDetail!.level, 'declaration-locations-and-excerpts');
});

test('documentation wraps without changing stored text and source excerpts stay bounded to displayed subjects', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-source-bounds-'));
  try {
    const project = path.join(root, 'tsconfig.json');
    writeFileSync(project, '{"compilerOptions":{"noLib":true,"types":[]},"files":["sample.ts"]}');
    const prose = Array.from({ length: 160 }, (_, index) => `TEST_SEGMENT_${index}`).join(' ');
    const source = `/** ${prose} */\r\nexport const a = "😀"; export const b = 2;\r\n${Array.from({ length: 50 }, (_, index) => `export const c${String(index).padStart(2, '0')}=${index};`).join('\r\n')}\r\nexport const zzzOmitted = 'DO_NOT_DISCLOSE';`;
    writeFileSync(path.join(root, 'sample.ts'), source);
    const inventory = JSON.parse((await invoke(['--project', project, '--json'])).stdout) as QualifiedView;
    const view = JSON.parse((await invoke(['inspect', inventory.modules[0]!.entityId, '--snapshot', inventory.projection.snapshot, '--project', project, '--source-detail', '--json'])).stdout) as QualifiedView;
    const text = renderUnicode(view);
    const documentation = view.modules[0]!.exports[0]!.documentation[0]!;
    assert.equal(documentation.text, prose.slice(0, 2000));
    assert.ok(text.split('SOURCE DETAIL')[0]!.split('\n').filter(line => line.startsWith('  │  ')).every(line => [...line].length <= 88));
    assert.ok(text.includes('assertion character(s) omitted'));
    assert.equal(text.includes('documentation for 1 listed module'), false);
    assert.equal(text.includes('DO_NOT_DISCLOSE'), false);
    assert.equal(text.includes('Export zzzOmitted'), false);
    assert.ok(text.includes('source character(s) omitted'));
    const b = view.sourceDetail!.items.find(item => item.label === 'Export b')!.evidence[0]!.location;
    assert.equal(b.association, 'span');
    if (b.association === 'span') assert.deepEqual(b.from, { line: 2, column: 24 });
    for (const evidence of view.sourceDetail!.items.flatMap(item => item.evidence)) {
      if (evidence.location.association === 'span') {
        assert.ok([...evidence.location.excerpt.text].length <= 300);
        assert.ok(evidence.location.excerpt.text.split('\n').length <= 4);
      }
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('source hierarchy preserves forwarding, defining syntax and mixed documentation before the closing sections', async () => {
  const inventory = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
  for (const handle of ['origin', 'chain']) {
    const module = inventory.modules.find(item => item.handle === handle)!;
    const result = await invoke(['inspect', module.entityId, '--snapshot', inventory.projection.snapshot, '--project', config, '--source-detail']);
    const text = result.stdout;
    const source = text.slice(text.indexOf('SOURCE DETAIL'), text.indexOf('\nStatus\n'));
    assert.ok(text.indexOf('SOURCE DETAIL') < text.indexOf('\nStatus\n'));
    assert.ok(text.indexOf('\nStatus\n') < text.indexOf('\nNext'));
    assert.equal(text.includes('More:'), false);
    assert.equal(text.match(/Documentation entries are recorded assertions/g)?.length, 1);
    assert.ok(text.includes(`Entity ID: ${module.entityId}\n\n  Exports:`));
    assert.equal(source.match(new RegExp(`Entity ID: ${module.entityId}`, 'g'))?.length, 1);
    assert.ok(source.includes('  ├─ value [value]\n'));
    assert.ok(source.includes('export const value = 1;'));
    if (handle === 'origin') {
      assert.equal(text.includes('origin-symbol'), false);
      assert.ok(source.includes('  ├─ Merged [type]\n  │  Source:'));
    } else {
      const renamed = source.slice(source.indexOf('  ├─ Renamed'), source.indexOf('  ├─ overloaded'));
      assert.ok(renamed.includes('Export/forwarding source:'));
      assert.ok(renamed.includes("export * from './barrel.js';"));
      assert.ok(renamed.includes('Dual as Renamed'));
      assert.ok(renamed.includes('Defining source · Dual in origin'));
      assert.ok(renamed.includes('export class Dual {}'));
      assert.ok(renamed.includes('Documentation from original symbol:'));
      assert.ok(renamed.includes('Documentation from export alias:'));
    }
  }
});

test('Unicode bounds each assertion to eight wrapped content lines with exact character and tag omissions', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-doc-height-'));
  try {
    const project = path.join(root, 'tsconfig.json');
    writeFileSync(project, '{"compilerOptions":{"noLib":true,"types":[]},"files":["height.ts"]}');
    const prose = Array.from({ length: 100 }, (_, index) => `TEST_SEGMENT_${index} 😀`).join('\n');
    writeFileSync(path.join(root, 'height.ts'), `/** ${prose.replace(/\n/g, '\n * ')}\n * @deprecated ${'tag '.repeat(100)}\n */\nexport const a=1;`);
    const inventory = JSON.parse((await invoke(['--project', project, '--json'])).stdout) as QualifiedView;
    const args = ['inspect', inventory.modules[0]!.entityId, '--snapshot', inventory.projection.snapshot, '--project', project];
    const unicode = await invoke(args);
    const view = unicode.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedView;
    const doc = view.modules[0]!.exports[0]!.documentation[0]!;
    assert.ok(doc.text.split('\n').length <= 8);
    assert.equal([...doc.text].length + doc.omittedTextCharacters, [...prose].length);
    assert.equal(doc.omittedTags, 1);
    assert.ok(unicode.stdout.includes(`${doc.omittedTextCharacters} assertion character(s) omitted`));
    assert.ok(unicode.stdout.includes('1 structured tag(s) omitted'));
    const json = JSON.parse((await invoke([...args, '--json'])).stdout) as QualifiedView;
    assert.ok(json.modules[0]!.exports[0]!.documentation[0]!.text.length > doc.text.length);
    const missing = await invoke(['inspect', 'not-here', '--project', project]);
    assert.equal(missing.stdout.includes('More:'), false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('Unicode inline names and paths cannot inject structure while JSON and wrapped content retain source text', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-inline-controls-'));
  try {
    const config = path.join(root, 'tsconfig.json');
    const name = 'spoof\nStatus\tmarker\u2028tail\u061c\u200e\u200f\u202a\u202b\u202c\u202d\u202e\u2066\u2067\u2068\u2069';
    const filename = `file-${name}.ts`;
    writeFileSync(config, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: [filename, 'ambient.d.ts'] }));
    writeFileSync(path.join(root, filename), `/** First documentation line.\n * Second documentation line. */\nconst value=1; export { value as ${JSON.stringify(name)} };`);
    writeFileSync(path.join(root, 'ambient.d.ts'), `declare module ${JSON.stringify(name)} { export const item:number; }`);
    const inventory = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
    const file = inventory.modules.find(module => module.exports.some(exported => exported.exportedName === name))!;
    const escaped = 'spoof\\u000aStatus\\u0009marker\\u2028tail\\u061c\\u200e\\u200f\\u202a\\u202b\\u202c\\u202d\\u202e\\u2066\\u2067\\u2068\\u2069';
    for (const module of [file]) {
      const json = JSON.parse((await invoke(['inspect', module.entityId, '--snapshot', inventory.projection.snapshot,
        '--project', config, '--source-detail', '--json'])).stdout) as QualifiedView;
      const original = JSON.stringify(json);
      const output = renderUnicode(json);
      assert.equal(output.includes(name), false);
      assert.ok(output.includes(escaped));
      assert.equal(output.split('\n').filter(line => line === 'Status').length, 1);
      assert.equal(output.includes('\t'), false);
      assert.equal(output.includes('\u2028'), false);
      assert.equal(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/.test(output), false);
      assert.equal(JSON.stringify(json), original);
      // Exercise module-name and selector interpolation independently of compiler naming rules.
      const labelled = structuredClone(json);
      (labelled.modules[0] as { name: string | null }).name = name;
      const parameters = labelled.projection.parameters as { selector: string | null };
      parameters.selector = name;
      assert.equal(renderUnicode(labelled).includes(name), false);
      assert.ok(renderUnicode(labelled).includes(escaped));
      if (module === file) {
        assert.ok(json.sourceDetail!.items.flatMap(item => item.evidence).some(evidence => evidence.path.endsWith(filename)));
        assert.ok(output.includes('First documentation line.'));
        assert.ok(output.includes('Second documentation line.'));
      }
    }
    const unicode = (await invoke(['--project', config])).stdout;
    assert.equal(unicode.includes(name), false);
    assert.ok(unicode.includes(escaped));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('control-bearing invocation paths omit the generated command instead of injecting or altering shell arguments', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-command-controls-'));
  try {
    const config = path.join(root, 'config\nStatus\tspoof.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export const value=1;');
    const ordinaryConfig = path.join(root, 'tsconfig.json');
    writeFileSync(ordinaryConfig, readFileSync(config));
    for (const [selectedConfig, checkout] of [[config, root], [ordinaryConfig, path.join(root, 'checkout\nspoof')],
      ...['\u061c', '\u200e', '\u200f', '\u202a', '\u202b', '\u202c', '\u202d', '\u202e', '\u2066', '\u2067', '\u2068', '\u2069'].map(control => [ordinaryConfig, path.join(root, `checkout${control}spoof`)])]) {
      const result = await invoke(['--project', selectedConfig!, '--json'], undefined, checkout!);
      assert.equal(result.exit, 0);
      const view = JSON.parse(result.stdout) as QualifiedView;
      assert.equal(view.presentation.navigation, undefined);
      const unicode = renderUnicode(view);
      assert.equal(unicode.includes('config\nStatus\tspoof'), false);
      assert.equal(unicode.includes('checkout\nspoof'), false);
      assert.ok(unicode.includes('Inspection requires an exact subject'));
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('observation destination disclosure escapes controls while the sink uses the original path', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-stderr-controls-'));
  try {
    const checkout = path.join(root, 'checkout-\n\t\u001b[2J\u0085\u2028\u2029\u202e\u2066\u2069');
    let stdout = '', stderr = '';
    const exit = await runCli(['--project', config, '--json'], { cwd: process.cwd(), checkout,
      stdout: text => { stdout += text; }, stderr: text => { stderr += text; } });
    assert.equal(exit, 0);
    assert.equal(stderr.trimEnd().split('\n').length, 1);
    assert.equal(/[\u0000-\u001f\u007f-\u009f\u2028\u2029\u202e\u2066\u2069]/.test(stderr.slice(0, -1)), false);
    assert.ok(stderr.includes('checkout-\\u000a\\u0009\\u001b[2J\\u0085\\u2028\\u2029\\u202e\\u2066\\u2069'));
    const destination = path.join(checkout, '_observations');
    const files = readdirSync(destination);
    assert.equal(files.length, 1);
    const batch = JSON.parse(readFileSync(path.join(destination, files[0]!), 'utf8')) as ObservationBatch;
    assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, stdout);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('CLI error and observation-warning values cannot introduce diagnostic lines', async () => {
  const text = 'spoof\nWARNING: forged\t\u001b[2J\u0085\u2028\u2029\u202e\u2066\u2069';
  const unknown = await invoke([`--${text}`]);
  assert.equal(unknown.exit, 2);
  assert.equal(unknown.stderr.trimEnd().split('\n').length, 1);
  const missing = await invoke(['--project', path.join('/postcode-not-present', text, 'tsconfig.json')]);
  assert.equal(missing.exit, 2);
  assert.equal(missing.stderr.includes(text), false);
  assert.ok(missing.stderr.includes('\\u202e\\u2066\\u2069'));
  for (const sink of [
    { async submit() { return { accepted: false as const, reason: text }; } },
    { async submit(): Promise<never> { throw new Error(text); } },
  ]) {
    const result = await invoke(['--project', config], sink);
    assert.equal(result.exit, 0);
    assert.equal(result.stderr.trimEnd().split('\n').length, 2);
    assert.equal(result.stderr.includes(text), false);
    assert.ok(result.stderr.includes('\\u202e\\u2066\\u2069'));
    assert.ok(result.stderr.includes('spoof\\u000aWARNING: forged\\u0009'));
  }
});

test('the executable escapes unexpected failure messages without changing exit status', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-entry-error-'));
  try {
    const checkout = copyTestCheckout(root);
    const message = 'failure\nFORGED\t\u001b[2J\u0085\u2028\u2029';
    writeFileSync(path.join(checkout, '_build/src/lib/cli.js'),
      `export async function runCli() { throw new Error(${JSON.stringify(message)}); }`);
    const result = spawnSync(process.execPath, [path.join(checkout, '_build/src/cli.js')], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr.trimEnd().split('\n').length, 1);
    assert.equal(result.stderr.includes(message), false);
    assert.ok(result.stderr.startsWith('Internal failure: failure\\u000aFORGED\\u0009'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('configuration diagnostic locations are one-based across lines and safely escaped on stderr', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-config-location-'));
  try {
    const config = path.join(root, 'multiline\nStatus.json');
    writeFileSync(config, '{\n  "compilerOptions": {\n    "noLib": true\n    "types": []\n  },\n  "files": []\n}');
    const result = await invoke(['--project', config]);
    assert.equal(result.exit, 2);
    assert.equal(result.stdout, '');
    assert.equal(result.batches.length, 0);
    assert.deepEqual(result.stderr.trim().split('\n'), ['Project open failed:',
      `  TS1005: ${path.join(root, 'multiline\\u000aStatus.json')}:4:5: ',' expected.`]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

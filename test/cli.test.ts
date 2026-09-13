import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
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
  assert.equal(unicode.stdout.includes('doc [recorded assertion]'), false);
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
    assert.ok(inspectedUnicode.stdout.includes('doc [recorded assertion]'));
    assert.ok(inspectedUnicode.stdout.includes('External responsibility.'));
    assert.ok(inspectedUnicode.stdout.includes(`Entity ID ${external.entityId}`));
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
    assert.equal(result.stdout.split('implementation-available').length - 1, 1);
    assert.equal(result.stdout.includes('doc [recorded assertion]'), false);
    assert.equal(result.stdout.includes('not calls or dependencies'), false);
    assert.equal(result.stdout.includes('Not a displayed cue.'), false);
    assert.ok(result.stdout.includes('other compiler module categories are not established'));
    assert.ok(result.stdout.includes('not captured as an atomic filesystem snapshot'));
    assert.equal(view.analysis?.excludedOutputLocations, 4);
    assert.ok(result.stdout.includes("4 generated-output locations excluded by this run's input filter"));
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
    const config = path.join(root, 'tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    writeFileSync(path.join(root, 'entry.ts'), 'export function runCli() {}');
    const view = JSON.parse((await invoke(['--project', config, '--json'])).stdout) as QualifiedView;
    const command = view.presentation.navigation!.inspect.replace('MODULE_HANDLE', 'run-cli');
    const output = execFileSync('/bin/sh', ['-c', command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    assert.ok(output.includes('exact match for run-cli'));
    assert.ok(output.includes('1 module selected from 1'));
    assert.equal(output.includes('No current match'), false);
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
    assert.ok(zero.stdout.includes('0 modules selected from 4 · exact matches for absent'));
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
  assert.match(reexport.stdout, /origin origin \(module-[a-f0-9]+\)/);
  assert.ok(reexport.stdout.includes('not calls or dependencies'));
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-inspection-'));
  try {
    const project = path.join(root, 'tsconfig.json');
    writeFileSync(project, '{"compilerOptions":{"noLib":true,"types":[]},"files":["index.ts"]}');
    writeFileSync(path.join(root, 'index.ts'), `/** ${'A'.repeat(2100)} */\nexport const documented=1;\nexport * from './missing.js';`);
    const inventory = JSON.parse((await invoke(['--project', project, '--json'])).stdout) as QualifiedView;
    const detail = await invoke(['inspect', inventory.modules[0]!.entityId, '--snapshot', inventory.projection.snapshot, '--project', project, '--source-detail']);
    assert.ok(detail.stdout.includes('materialization partial'));
    assert.ok(detail.stdout.includes('100 assertion character(s) omitted'));
    assert.ok(detail.stdout.includes('doc [recorded assertion]'));
    assert.ok(detail.stdout.includes('no established truth, currency or completeness'));
    assert.ok(detail.stdout.includes('SOURCE DETAIL — explicit source escape'));
    assert.equal(detail.stdout.includes('Module membership and effective exports established'), false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

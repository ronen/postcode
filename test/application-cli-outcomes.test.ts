import assert from 'node:assert/strict';
import { test } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import { openWorkerCliSession } from '../src/lib/interfaces/cli/application.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { publishCommand } from '../src/lib/command-execution.js';
import type { ObservationBatch } from '../src/lib/application/observations.js';
import type { WorkReport } from '../src/lib/work-attribution.js';

for (const host of ['in-process', 'worker'] as const) test(`unknown continuation fails CLI presentation while application work stays completed (${host})`, async t => {
  const root = temporaryDirectory(t, 'postcode-application-outcome-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), 'export const entry = 1;');
  const local = host === 'in-process' ? await openWorkerCliSession({ configPath }) : undefined;
  const worker = host === 'worker' ? interactiveSession({ configPath }) : undefined;
  if (local) assert.equal(local.status, 'opened');
  const opening = worker ? await worker.opening : undefined;
  if (opening) assert.equal(opening.status, 'opened');
  const session = local?.status === 'opened' ? local.session : worker!;
  const id = local?.status === 'opened' ? local.session.id : opening!.status === 'opened' ? opening!.id : assert.fail('Opening failed');
  t.after(() => session.close());
  const presentation = { format: 'json' as const, moreDetails: false };
  const selected = await session.execute({ lens: 'inspect', selector: 'entry', presentation });
  assert.equal(selected.kind, 'view');
  let batch: ObservationBatch | undefined, stdout = '';
  const code = await publishCommand({ ...session, id }, { kind: 'present', target: selected.view.answerReference!,
    presentation: { ...presentation, after: 'investigram-00000000' } }, 'present', configPath, 2,
  { stdout: text => { stdout += text; }, stderr: text => assert.fail(text) },
  { async submit(value) { batch = value; return { accepted: true }; } });
  assert.equal(code, 3);
  assert.equal(JSON.parse(stdout).investigations.status, 'unknown-continuation');
  assert.equal(session.work()!.status, 'completed');
  assert.equal((batch!.records.find(item => item.kind === 'request-work')!.value as WorkReport).status, 'completed');
  assert.equal(batch!.events.at(-1)!.type, 'command-failed');
});

test('local delivery keeps the operation guard through checks despite competing microtasks', async t => {
  const { openCliSession } = await import('../src/lib/interfaces/cli/application.js');
  const { SessionBusy } = await import('../src/lib/application/index.js');
  const root = temporaryDirectory(t, 'postcode-local-publication-race-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), 'export const entry = 1;');
  let compete = () => {};
  const opened = await openCliSession({ configPath }, { onWork(event) { if (event.kind === 'finish') compete(); } });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  let checks: Promise<void> | undefined, busy = 0;
  compete = () => { checks = (async () => {
    for (let i = 0; i < 40; i++) {
      try { await session.check(); } catch (error) { assert.ok(error instanceof SessionBusy); busy++; }
    }
  })(); };
  const result = await session.execute({ lens: 'modules', selector: null, presentation: { format: 'json', moreDetails: false } });
  await checks;
  assert.ok(busy > 0);
  assert.equal(result.attribution.status, 'completed');
  assert.equal(session.work()!.status, 'completed');
  await session.check();
});

for (const timing of ['stable', 'before-output', 'after-output', 'output-throws'] as const) test(`local publication checks actual output once (${timing})`, async t => {
  const { openCliSession } = await import('../src/lib/interfaces/cli/application.js');
  const { default: ts } = await import('typescript');
  const root = temporaryDirectory(t, 'postcode-local-publication-');
  const configPath = path.join(root, 'tsconfig.json'), source = path.join(root, 'entry.ts');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(source, 'export const entry = 1;');
  let publishing = false;
  const opened = await openCliSession({ configPath }, { onWork(event) {
    if (publishing && timing === 'before-output' && event.kind === 'finish') writeFileSync(source, 'export const changed = 2;');
  } });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const request = { lens: 'modules', selector: null, presentation: { format: 'json' as const, moreDetails: false } };
  await session.execute(request);
  const read = ts.sys.readFile; let reads = 0;
  t.mock.method(ts.sys, 'readFile', (name: string, encoding?: string) => { if (name === source) reads++; return read(name, encoding); });
  publishing = true;
  let stdout = '', stderr = '', batch: ObservationBatch | undefined;
  const code = await publishCommand(session, request, 'modules', configPath, 1, {
    stdout(text) {
      if (timing === 'output-throws') throw Error('Controlled output failure');
      stdout += text;
      if (timing === 'after-output') writeFileSync(source, 'export const changed = 3;');
    }, stderr(text) { stderr += text; },
  }, { async submit(value) { batch = value; return { accepted: true }; } });
  assert.equal(code, timing === 'stable' ? 0 : timing === 'output-throws' ? 1 : 2);
  assert.equal(!!stdout, timing === 'stable' || timing === 'after-output');
  assert.equal(session.work()!.status, 'completed');
  assert.equal(reads, timing === 'stable' || timing === 'after-output' ? 3 : 2, 'execution check plus exactly one pre/post-output guard');
  assert.equal(batch!.records.some(item => item.kind === 'qualified-view'), !!stdout);
  if (timing === 'before-output' || timing === 'after-output') assert.match(stderr, /invalidated/);
  if (timing === 'output-throws') assert.match(stderr, /Controlled output failure/);
});

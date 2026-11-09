import assert from 'node:assert/strict';
import { test } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import { openWorkerCliSession } from '../src/lib/interfaces/cli/application.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { publishCommand } from '../src/lib/command-execution.js';
import type { ObservationBatch } from '../src/lib/observations.js';
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

import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import { lenses, normalizeRequest } from '../src/lib/requests.js';
import type { LensId, ViewRequest } from '../src/lib/requests.js';
import { openSession } from '../src/lib/session.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { publishCommand } from '../src/lib/command-execution.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import type { RequestContext } from '../src/lib/request-reporting.js';
import { finalizeRequestReport } from '../src/lib/request-reporting.js';
import { requireView } from './request-helpers.js';

const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
const presentation = { format: 'json' as const, sourceDetail: false };

test('all current Lens requests separate question, designation, parameters and presentation', () => {
  const expected: readonly LensId[] = ['modules', 'organization', 'dependencies', 'children', 'parents', 'inspect', 'summarize', 'explain', 'decompose', 'examine'];
  assert.deepEqual(Object.keys(lenses).sort(), [...expected].sort());
  for (const lens of expected) {
    for (const reference of [true, false]) {
      const input = { lens, selector: 'module-12345678', reference, presentation, after: 'next', revisionPage: 2 };
      const normalized = normalizeRequest(input);
      assert.equal(normalized.kind, 'lens');
      if (normalized.kind !== 'lens') throw new Error('Expected Lens request');
      assert.equal(normalized.lens, lens);
      assert.ok(normalized.question.length > 0);
      assert.deepEqual(normalized.parameters, {});
      assert.deepEqual(normalized.designation, { kind: reference ? 'reference' : 'name', value: input.selector });
      assert.deepEqual(normalized.presentation, { ...presentation, after: 'next', revisionPage: 2 });
      assert.ok(Object.isFrozen(normalized));
      assert.ok(Object.isFrozen(normalized.designation));
    }
  }
  const defaults = normalizeRequest({ lens: 'organization', selector: null, presentation });
  const project = normalizeRequest({ lens: 'organization', selector: null, subject: 'project', presentation });
  const repository = normalizeRequest({ lens: 'organization', selector: null, subject: 'repository', presentation });
  assert.equal(defaults.kind === 'lens' && defaults.designation.kind, 'default');
  assert.equal(project.kind === 'lens' && project.designation.kind, 'configured-project');
  assert.equal(repository.kind === 'lens' && repository.designation.kind, 'repository');
  const usage = normalizeRequest({ lens: 'usage', selector: null, presentation });
  assert.deepEqual(usage, { kind: 'report', report: 'usage', presentation, referenceLifetime: 'session' });
});

test('direct parameter rejection and subjectless usage perform no Evaluation or Projection retention', async t => {
  const opened = await openSession({ configPath });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  for (const lens of Object.keys(lenses) as LensId[]) {
    const result = await opened.session.execute({ lens, selector: null, parameters: { selector: 'not-a-parameter' }, presentation });
    assert.equal(result.kind, 'resolution');
    if (result.kind !== 'resolution') throw new Error('Expected resolution result');
    assert.equal(result.report.resolution.reason, 'invalid-parameters');
    assert.deepEqual(result.report.resolution.prerequisites, []);
    assert.deepEqual(result.report.resolution.retainedAnswers, []);
    assert.equal('view' in result, false);
    assert.deepEqual(JSON.parse(result.rendered), result.report);
  }
  const usage = await opened.session.execute({ lens: 'usage', selector: null, presentation });
  assert.equal(usage.kind, 'usage');
  if (usage.kind !== 'usage') throw new Error('Expected usage report');
  assert.equal('projection' in usage.report, false);
  assert.equal('id' in usage.report, false);
  assert.equal(usage.report.usage.calls, 0);
  assert.deepEqual(finalizeRequestReport(usage.report, usage.report.usage), usage.report);
  assert.equal(put.mock.calls.length, 0);
});

test('invocation context stays separate from immutable program output and captures caller values', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const input = { lens: 'modules' as const, selector: null, presentation: { format: 'json' as 'json' | 'unicode', sourceDetail: false }, parameters: {} };
  const pending = opened.session.execute(input);
  input.presentation.format = 'unicode';
  const first = requireView(await pending);
  assert.equal(first.view.presentation.format, 'json', 'capture the request before asynchronous input validation');
  const second = requireView(await opened.session.execute({ ...input, presentation }));
  assert.notEqual(first.context.id, second.context.id);
  assert.deepEqual(first.view, second.view);
  assert.equal(first.rendered, second.rendered);
  assert.deepEqual(first.context.request, second.context.request);
  assert.ok(Object.isFrozen(first.context.request.presentation));
});

for (const kind of ['usage', 'resolution', 'view'] as const) {
  test(`worker publication carries ${kind} as its actual result, including sink failure`, async t => {
    const remote = interactiveSession({ configPath });
    t.after(() => remote.close());
    const opening = await remote.opening;
    if (opening.status !== 'opened') throw new Error('Expected project');
    const request: ViewRequest = kind === 'usage' ? { lens: 'usage', selector: null, presentation }
      : { lens: 'modules', selector: null, presentation, ...(kind === 'resolution' ? { parameters: { unsupported: true } } : {}) };
    let stdout = '', stderr = '';
    const batches: ObservationBatch[] = [];
    const code = await publishCommand({ id: opening.id, execute: remote.execute, check: remote.check, usage: remote.usage }, request,
      'controlled request', configPath, 1, { stdout(text) { stdout += text; }, stderr(text) { stderr += text; } },
      { async submit(batch) { batches.push(batch); throw new Error('controlled sink failure'); } });
    assert.equal(code, kind === 'resolution' ? 3 : 0);
    assert.match(stderr, /observation not recorded.*controlled sink failure/);
    assert.equal(batches.length, 1);
    const batch = batches[0]!;
    assert.equal(batch.formatVersion, 2);
    assert.equal(batch.events.some(item => item.type === 'view-produced'), kind === 'view');
    assert.equal(batch.events.some(item => item.type === 'source-escape'), false);
    assert.equal(batch.events.at(-1)!.type, kind === 'resolution' ? 'command-refused' : 'command-completed');
    const context = batch.records.find(item => item.kind === 'request')!.value as RequestContext;
    assert.deepEqual(context.request, normalizeRequest(request));
    assert.equal(batch.records.find(item => item.kind === 'rendered-output')!.value, stdout);
    if (kind !== 'view') {
      const artifact = batch.records.find(item => item.kind === (kind === 'usage' ? 'usage-report' : 'resolution-result'))!.value;
      assert.deepEqual(artifact, JSON.parse(stdout));
      assert.equal(batch.records.some(item => item.kind === 'qualified-view'), false);
    }
  });
}

for (const afterOutput of [false, true]) test(`non-View publication checks inputs ${afterOutput ? 'after' : 'before'} output`, async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const { SessionInvalidated } = await import('../src/lib/execution-errors.js');
  let checks = 0, stdout = '', stderr = '';
  const batches: ObservationBatch[] = [];
  const code = await publishCommand({ ...opened.session, check() {
    if (++checks === (afterOutput ? 2 : 1)) throw new SessionInvalidated();
  } }, { lens: 'usage', selector: null, presentation }, 'usage', configPath, 1,
  { stdout(text) { stdout += text; }, stderr(text) { stderr += text; } },
  { async submit(batch) { batches.push(batch); return { accepted: true }; } });
  assert.equal(code, 2);
  assert.match(stderr, /invalidated/);
  assert.equal(stdout.length > 0, afterOutput);
  const batch = batches[0]!;
  assert.equal(batch.records.some(item => item.kind === 'usage-report'), afterOutput);
  assert.equal(batch.events.some(item => item.type === 'view-produced'), false);
  assert.equal(batch.events.at(-1)!.type, 'session-invalidated');
  const context = batch.records.find(item => item.kind === 'request')!.value as RequestContext;
  assert.equal(context.request.kind, 'report');
});

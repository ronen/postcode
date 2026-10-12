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
  const expected: readonly LensId[] = ['modules', 'organization', 'dependency-structure', 'dependency-children', 'dependency-parents', 'inspect', 'summarize', 'explain', 'decompose', 'examine'];
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

test('dependency command spellings normalize to the Lens identity of the retained answer', async t => {
  const { parseCommand } = await import('../src/lib/commands.js');
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  for (const [spelling, identity] of [['dependencies', 'dependency-structure'], ['children', 'dependency-children'], ['parents', 'dependency-parents']] as const) {
    const parsed = parseCommand([spelling, ...(spelling === 'dependencies' ? [] : ['entry']), '--json'], '.');
    if (parsed.kind !== 'view') throw new Error('Expected command');
    assert.equal(parsed.request.lens, identity);
    const batches: ObservationBatch[] = [];
    const code = await publishCommand(opened.session, parsed.request, spelling, configPath, 1,
      { stdout() {}, stderr() {} }, { async submit(batch) { batches.push(batch); return { accepted: true }; } });
    assert.equal(code, 0);
    const request = batches[0]!.records.find(item => item.kind === 'request')!.value as RequestContext;
    assert.equal(request.request.kind === 'lens' && request.request.lens, identity);
    const view = batches[0]!.records.find(item => item.kind === 'qualified-view')!.value as { projection: { lens: string } };
    assert.equal(view.projection.lens, identity);
    const direct = requireView(await opened.session.execute({ ...parsed.request, lens: spelling }));
    assert.equal(direct.context.request.kind === 'lens' && direct.context.request.lens, identity);
    assert.equal(direct.view.projection.lens, identity);
  }
});

test('missing and inapplicable designation modes are refused before Evaluation', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  const requests: ViewRequest[] = [];
  for (const lens of ['inspect', 'dependency-children', 'dependency-parents', 'summarize', 'explain', 'decompose', 'examine'] as const) {
    requests.push({ lens, selector: null, presentation });
    for (const subject of ['project', 'repository'] as const) requests.push({ lens, selector: null, subject, presentation });
  }
  for (const lens of ['modules', 'dependency-structure'] as const) requests.push({ lens, selector: null, subject: 'repository', presentation });
  for (const lens of ['modules', 'dependency-structure', 'organization'] as const) {
    for (const reference of [true, false]) requests.push({ lens, selector: 'entry', reference, presentation });
  }
  requests.push({ lens: 'inspect', selector: 'entry', subject: 'project', presentation });
  for (const lens of ['explain', 'decompose', 'examine'] as const) requests.push({ lens, selector: 'foo', presentation });
  for (const request of requests) {
    const result = await opened.session.execute(request);
    assert.equal(result.kind, 'resolution', JSON.stringify(request));
    if (result.kind !== 'resolution') throw new Error('Expected resolution');
    assert.equal(result.report.resolution.reason, 'invalid-designation');
    if (request.selector === 'foo') {
      assert.match(result.report.resolution.explanation, /requires a precise investigram reference/);
      assert.doesNotMatch(result.report.resolution.explanation, /population|matches/);
      assert.deepEqual(result.report.context.request.kind === 'lens' && result.report.context.request.designation, { kind: 'name', value: 'foo' });
    }
    assert.deepEqual(result.report.resolution.prerequisites, []);
    assert.deepEqual(result.report.resolution.retainedAnswers, []);
    assert.equal('view' in result, false);
  }
  assert.equal(put.mock.calls.length, 0);
});

test('usage refuses and preserves extraneous designation and parameters without Evaluation', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  for (const inputs of [
    { selector: 'entry' }, { selector: 'module-12345678', reference: true },
    { selector: null, subject: 'project' as const }, { selector: null, subject: 'repository' as const },
    { selector: null, parameters: { bogus: 1 } },
    { selector: 'entry', subject: 'project' as const, parameters: { bogus: [true, null] } },
  ]) {
    const result = await opened.session.execute({ lens: 'usage', ...inputs, presentation });
    assert.equal(result.kind, 'resolution');
    if (result.kind !== 'resolution') throw new Error('Expected refusal');
    assert.equal(result.report.resolution.reason, 'invalid-report-inputs');
    assert.equal(result.context.request.kind, 'report');
    if (result.context.request.kind !== 'report') throw new Error('Expected usage request');
    assert.deepEqual(result.context.request.suppliedInputs, inputs);
    assert.deepEqual(JSON.parse(result.rendered), result.report);
    assert.equal(result.report.usage.calls, 0);
  }
  assert.equal((await opened.session.execute({ lens: 'usage', selector: null, parameters: {}, presentation })).kind, 'usage');
  assert.equal(put.mock.calls.length, 0);
});

test('unknown Lens names are preserved as rejected input and never treated as Lens identities', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  for (const lens of ['absent-lens', 'toString', 'constructor', '__proto__']) {
    const result = await opened.session.execute({ lens, selector: null, presentation } as ViewRequest);
    assert.equal(result.kind, 'resolution');
    if (result.kind !== 'resolution' || result.context.request.kind !== 'rejected') throw new Error('Expected rejected input');
    assert.equal(result.report.resolution.reason, 'invalid-request');
    assert.equal(result.context.request.input.lens, lens);
    assert.equal('lens' in result.context.request, false);
    assert.deepEqual(result.context.request.problems, [{ field: 'lens', reason: 'The supplied name does not identify a registered Lens or report.', representation: 'preserved' }]);
    assert.deepEqual(JSON.parse(result.rendered), result.report);
  }
  assert.equal(put.mock.calls.length, 0);
});

test('unrepresentable input reports affected fields and omissions without executing accessors', () => {
  const cyclic: { self?: unknown } = {}; cyclic.self = cyclic;
  let reads = 0;
  const accessor = { get secret() { reads++; throw new Error('Must not execute caller accessor'); } };
  for (const parameters of [{ value: () => {} }, { value: Symbol('value') }, { value: 1n }, cyclic,
    { value: Infinity }, { value: new Map() }, accessor, new Proxy({}, {})]) {
    const request = normalizeRequest({ lens: 'inspect', selector: 'entry', parameters, presentation } as ViewRequest);
    assert.equal(request.kind, 'rejected');
    if (request.kind !== 'rejected') throw new Error('Expected rejected input');
    assert.equal(request.input.lens, 'inspect');
    assert.equal('parameters' in request.input, false);
    assert.ok(request.problems.some(problem => problem.field.startsWith('parameters') && problem.representation === 'omitted' && problem.omittedField === 'parameters' && problem.reason.length > 0));
    assert.doesNotThrow(() => JSON.stringify(request));
  }
  assert.equal(reads, 0);
});

test('direct and worker publication refuse malformed input with serializable observations and remain usable', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  const remote = interactiveSession({ configPath });
  t.after(async () => { await remote.close(); await opened.session.close(); });
  const opening = await remote.opening;
  if (opening.status !== 'opened') throw new Error('Expected worker');
  const cycle: { self?: unknown } = {}; cycle.self = cycle;
  for (const session of [opened.session, { id: opening.id, execute: remote.execute, check: remote.check, usage: remote.usage }]) {
    for (const request of [
      { lens: '__proto__', selector: null, presentation },
      { lens: 'inspect', selector: 'entry', parameters: { value: () => {} }, presentation },
      { lens: 'usage', selector: null, parameters: cycle, presentation },
      { lens: 'usage', selector: 'entry', parameters: { bogus: 1 }, presentation },
    ] as ViewRequest[]) {
      let stdout = '', stderr = '';
      const batches: ObservationBatch[] = [];
      const code = await publishCommand(session, request, request, configPath, 1,
        { stdout(text) { stdout += text; }, stderr(text) { stderr += text; } },
        { async submit(batch) { JSON.stringify(batch); batches.push(batch); return { accepted: true }; } });
      assert.equal(code, 3, stderr);
      assert.equal(stderr, '');
      const report = JSON.parse(stdout);
      assert.equal(report.schema, 'postcode-resolution/1-experimental');
      assert.equal(batches[0]!.events.at(-1)!.type, 'command-refused');
      assert.equal(batches[0]!.events.some(event => event.type === 'view-produced'), false);
      assert.equal(batches[0]!.records.some(record => record.kind === 'qualified-view'), false);
      if (report.context.request.kind === 'rejected' && report.context.request.problems.some((problem: { representation: string }) => problem.representation === 'omitted')) {
        assert.match(report.resolution.qualifications.join(' '), /Representation limit: parameters is omitted/);
      }
    }
    assert.equal((await session.execute({ lens: 'usage', selector: null, presentation })).kind, 'usage');
  }
});

test('unexpected failures after validation remain defects, including a later cloning failure', async () => {
  for (const error of [new Error('Unexpected execution failure'), new DOMException('Unexpected later clone failure', 'DataCloneError')]) {
    const batches: ObservationBatch[] = [];
    let stderr = '';
    const code = await publishCommand({ id: 'test-session', execute() { throw error; }, check() {} },
      { lens: 'modules', selector: null, presentation }, 'modules', configPath, 1,
      { stdout() { assert.fail('No program output expected'); }, stderr(text) { stderr += text; } },
      { async submit(batch) { batches.push(batch); return { accepted: true }; } });
    assert.equal(code, 1);
    assert.match(stderr, /Internal failure: Unexpected/);
    assert.equal(batches[0]!.events.at(-1)!.type, 'command-defect');
    assert.equal(batches[0]!.records.some(record => record.kind === 'resolution-result'), false);
  }
});

test('abnormal final usage uses captured presentation without rereading rejected accessor input', async () => {
  const { SessionInvalidated } = await import('../src/lib/execution-errors.js');
  const { usageSummary } = await import('../src/lib/investigation/reporting.js');
  const { recordId, sessionId } = await import('../src/lib/identity.js');
  const id = sessionId();
  const subject = recordId(id, 'module', ['fixture', 'subject']);
  const usage = usageSummary([{ session: id, attempt: recordId(id, 'attempt', ['fixture', 'attempt']),
    request: { operation: 'functionality', subject, parameters: {} },
    agent: { provider: 'postcode-test', model: 'scripted', origin: 'scripted', configuration: {} },
    instructions: 'Controlled prior attempt', termination: 'interrupted', elapsedMilliseconds: 0,
    usage: [], deliveries: [], suppliedEvidence: [], summarizedEvidence: [] }]);
  let reads = 0, stderr = '';
  const request = { lens: 'modules', selector: null, get presentation(): never { reads++; throw new Error('Must not reread rejected input'); } } as ViewRequest;
  const batches: ObservationBatch[] = [];
  const code = await publishCommand({ id, execute() { throw new SessionInvalidated(); }, check() {}, usage: () => usage },
    request, request, configPath, 1, { stdout() { assert.fail('No output before invalidation'); }, stderr(text) { stderr += text; } },
    { async submit(batch) { JSON.stringify(batch); batches.push(batch); return { accepted: true }; } });
  assert.equal(code, 2);
  assert.equal(reads, 0);
  assert.match(stderr, /Final investigation usage/);
  assert.equal(batches[0]!.events.at(-1)!.type, 'session-invalidated');
});

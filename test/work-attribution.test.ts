import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import { ScriptedInvestigator } from './investigator-double.js';
import { openSession } from '../src/lib/session.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { publishCommand } from '../src/lib/command-execution.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import { CommandInterrupted } from '../src/lib/execution-errors.js';
import { initiation, RequestWork } from '../src/lib/work-attribution.js';
import type { WorkReport, AttributedWork } from '../src/lib/work-attribution.js';
import { normalizeRequest } from '../src/lib/requests.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { investigate } from '../src/lib/investigation/execute.js';
import { InvestigationUsage } from '../src/lib/investigation/usage.js';
import { evidenceAccess } from '../src/lib/evidence-access.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { investigationBounds } from '../src/lib/investigation/bounds.js';
import type { RecordId } from '../src/lib/records.js';
import type { AgentInput, SubmittedInvestigram, ContextDelivery } from '../src/lib/investigation/contracts.js';
import type { EvidenceResponse } from '../src/lib/evidence-access.js';
import type { InvestigationView } from '../src/lib/investigation/presentation.js';

const presentation = { format: 'json' as const, sourceDetail: false };
const inventory = { lens: 'modules' as const, selector: null, presentation };
const summary = { lens: 'summarize' as const, selector: 'widget', presentation };
function fixture(t: TestContext, huge = false, many = false) {
  const root = temporaryDirectory(t, 'postcode-work-attribution-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, include: ['*.ts'] }));
  writeFileSync(path.join(root, 'widget.ts'), `${huge ? `// ${'x'.repeat(70_000)}\n` : ''}export const widget = 1;`);
  if (many) for (let i = 0; i < 30; i++) writeFileSync(path.join(root, `other${i}.ts`), `export const other${i} = ${i};`);
  return { root, configPath };
}
function draft(input: AgentInput): SubmittedInvestigram {
  return { localId: 'root', prose: 'A qualified account.', referent: { description: 'Selected subject.', subjects: [input.request.subject] },
    qualifications: ['Controlled interpretation, not a behavioral observation.'], evidence: [], associations: [], children: [], corrections: [], inconsistencies: [] };
}
function view(result: Awaited<ReturnType<Extract<Awaited<ReturnType<typeof openSession>>, { status: 'opened' }>['session']['execute']>>) {
  assert.equal(result.kind, 'view');
  assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
  return result.view as InvestigationView;
}

test('request attribution separates prerequisite work, actual provider reuse and first generation without changing answers', async t => {
  const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
  const opened = await openSession({ configPath });
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const first = await opened.session.execute(inventory);
  assert.equal(first.kind, 'view');
  assert.equal(first.attribution.status, 'completed');
  assert.equal(first.context.initiator, 'caller');
  assert.equal(first.context.constraints.wholeRequestBudget, null);
  const snapshot = JSON.stringify(first);
  const repeat = await opened.session.execute(inventory);
  assert.equal(repeat.kind, 'view');
  assert.notEqual(first.context.id, repeat.context.id);
  assert.deepEqual(first.view, repeat.view);
  for (const boundary of ['provider-modules', 'module-evaluation']) {
    assert.equal(first.attribution.work.find(item => item.boundary === boundary)!.disposition, 'established');
    const reused: AttributedWork = repeat.attribution.work.find(item => item.boundary === boundary)!;
    assert.equal(reused.disposition, 'reused');
    assert.equal(reused.current.parent.id, repeat.context.id);
    assert.ok(reused.generating.every(item => item.origin?.parent.id === first.context.id));
  }
  const missing = await opened.session.execute({ ...summary, selector: 'absent-candidate' });
  assert.equal(missing.kind, 'resolution');
  assert.equal(missing.attribution.status, 'refused');
  assert.ok(missing.attribution.work.length > 0);
  assert.ok(missing.attribution.work.every(item => item.current.role === 'resolution-prerequisite' && item.current.initiator === 'PostCode'));
  assert.deepEqual(missing.report.attribution, missing.attribution);
  assert.deepEqual(JSON.parse(missing.rendered), missing.report);
  const dependencies = await opened.session.execute({ ...inventory, lens: 'dependencies' });
  const repeated = await opened.session.execute({ ...inventory, lens: 'dependencies' });
  const provider = repeated.attribution.work.find(item => item.boundary === 'provider-dependencies')!;
  assert.equal(provider.disposition, 'reused');
  assert.ok(provider.generating.every(item => item.origin?.parent.id === dependencies.context.id));
  assert.equal(repeated.attribution.work.find(item => item.boundary === 'dependency-evaluation')!.disposition, 'established', 'the dependency evaluator actually re-derives, even though its record ID is equal');
  assert.equal(JSON.stringify(first), snapshot, 'later consumption cannot mutate the earlier snapshot');
  const refused = await opened.session.execute({ ...inventory, parameters: { wrong: true } });
  assert.deepEqual(refused.attribution.work, []);
});

test('partial provider outcomes retry without an assurance and retain current versus original attribution with one', async t => {
  const opened = await openTypeScriptProject({ configPath: fixture(t).configPath });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const discovery = opened.analysis.discover(store);
  const { retryBasis, ...withoutBasis } = discovery;
  assert.ok(retryBasis);
  let stable = false, calls = 0;
  const analysis = { discover() { calls++; return { ...withoutBasis, ...(stable ? { retryBasis } : {}),
    execution: 'stopped' as const, materialization: 'partial' as const, reason: 'Controlled incomplete population.' }; } };
  const contexts: WorkReport[] = [];
  const run = () => {
    const work = new RequestWork(initiation(normalizeRequest(inventory)), store);
    const result = evaluateModules(store, analysis, [], work.scope('Resolve a controlled partial population.', null, 'resolution-prerequisite'));
    contexts.push(work.finish('completed'));
    return result;
  };
  const first = run(), second = run();
  assert.notEqual(first.id, second.id);
  stable = true;
  const third = run(), fourth = run();
  assert.equal(third.id, fourth.id);
  assert.equal(calls, 4, 'no outer cache may hide the provider retry decision');
  assert.deepEqual(contexts.map(report => report.work[0]!.disposition), ['established', 'established', 'established', 'reused']);
  assert.equal(contexts[3]!.work[0]!.generating[0]!.origin!.parent.id, contexts[2]!.context.id);
  assert.equal(contexts[3]!.work[0]!.outcome.state!.reason, 'Controlled incomplete population.');
});

test('evidence attribution preserves withheld capture, unavailability, reuse and direct-operation parent context', async t => {
  const agent = new ScriptedInvestigator([
    input => input.request.operation === 'functionality' ? { kind: 'tools', requests: [
      { kind: 'source', subject: input.request.subject }, { kind: 'source', subject: input.request.subject },
      { kind: 'source', subject: 'unknown-in-this-session' as RecordId },
    ] } : { kind: 'tools', requests: [{ kind: 'investigations', subject: (input.responses[0] as ContextDelivery).accounts[0]!.originatingModule }] },
    input => {
      if (input.request.operation === 'functionality') assert.ok(input.responses.every(response => 'status' in response && response.status === 'unavailable'));
      return { kind: 'submit', result: draft(input) };
    },
  ]);
  const bounds = { ...investigationBounds, calls: 4 };
  const opened = await openSession({ configPath: fixture(t, true).configPath }, { investigation: { agent, bounds } });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  bounds.calls = 1;
  const first = await opened.session.execute(summary);
  const answer = view(first);
  assert.equal(first.context.constraints.investigation.calls, 4, 'the actual inherited bounds are captured when the Session opens');
  assert.equal(first.attribution.evidence.length, 3);
  const [acquired, repeated, unavailable] = first.attribution.evidence;
  assert.equal(acquired!.outcome!.status, 'available');
  assert.equal(acquired!.delivery, 'withheld');
  assert.match(acquired!.reason!, /response bound/);
  assert.equal(repeated!.delivery, 'withheld');
  assert.equal(unavailable!.outcome!.status, 'unavailable');
  assert.equal(unavailable!.delivery, 'delivered');
  const content = first.attribution.work.filter(item => item.boundary === 'content');
  assert.deepEqual(content.map(item => item.disposition), ['established', 'reused']);
  assert.deepEqual(content[0]!.current.trigger, { kind: 'source', subject: answer.selected[0] });
  assert.equal(content[0]!.current.sequence, 0);
  assert.equal(content[1]!.current.sequence, 1);
  assert.equal(content[1]!.generating[0]!.origin!.sequence, 0);
  const capture = content[0]!.outcome.records[0]!;
  assert.ok(acquired!.outcome!.records.includes(capture));
  assert.ok(!answer.usage.attempts[0]!.suppliedEvidence.includes(capture));
  assert.equal(answer.usage.attempts[0]!.parent!.id, first.context.id);
  const second = await opened.session.execute(summary);
  assert.deepEqual(view(second).projection, answer.projection);
  assert.deepEqual(second.attribution.evidence, []);
  const reused = second.attribution.work.find(item => item.boundary === 'interpretation')!;
  assert.equal(reused.disposition, 'reused');
  assert.ok(reused.generating.every(item => item.origin!.parent.id === first.context.id));
  const operation = { ...answer.result!.request };
  const pending = opened.session.evaluateInvestigation(operation);
  operation.subject = 'mutated-after-entry' as RecordId;
  const direct = await pending;
  assert.equal(direct.request.subject, answer.result!.request.subject, 'entry captures direct operation inputs before asynchronous checks');
  assert.equal(direct.context.request.kind, 'operation');
  assert.equal(direct.reused, true);
  assert.notEqual(direct.context.id, first.context.id);
  assert.equal(agent.inputs.length, 1);
  const followup = await opened.session.execute({ ...summary, lens: 'explain', selector: answer.accounts[0]!.id, reference: true });
  assert.equal(view(followup).result!.evaluation!.outcome.kind, 'accepted');
  assert.equal(followup.attribution.evidence[0]!.query.kind, 'initial-context');
  assert.equal(followup.attribution.evidence[0]!.delivery, 'delivered');
  assert.deepEqual(followup.attribution.evidence[1]!.outcome!.listing, { subject: answer.selected[0], selected: [answer.accounts[0]!.id], total: 1, next: null });
  assert.equal(followup.attribution.evidence[1]!.outcome!.status, 'available', 'an established association listing stays available');
  assert.equal(followup.attribution.work.find(item => item.boundary === 'evidence-retrieval')!.disposition, 'consumed');
  const inspected = await opened.session.execute({ ...summary, lens: 'inspect', selector: answer.accounts[0]!.id, reference: true });
  const consumption = inspected.attribution.work.find(item => item.boundary === 'interpretation' && item.disposition === 'consumed')!;
  assert.ok(consumption.generating.some(item => item.record === answer.accounts[0]!.id && item.origin?.parent.id === first.context.id));
  assert.equal(agent.inputs.length, 2, 'historical inspection starts no inference');
});

test('continuations consume an established page without claiming another acquisition; guarded evidence stays undelivered', async t => {
  const agent = new ScriptedInvestigator([
    () => ({ kind: 'tools', requests: [{ kind: 'modules' }] }),
    input => {
      const response = input.responses[0] as EvidenceResponse;
      assert.ok(response.page?.next);
      return { kind: 'tools', requests: [{ kind: 'modules', cursor: response.page.next }] };
    },
    input => ({ kind: 'submit', result: draft(input) }),
  ]);
  const f = fixture(t, false, true);
  const opened = await openSession({ configPath: f.configPath }, { investigation: { agent } });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const result = await opened.session.execute(summary);
  assert.equal(result.attribution.evidence[0]!.outcome!.page!.total, 31);
  assert.equal(result.attribution.evidence[1]!.delivery, 'delivered');
  const continuation = result.attribution.work.filter(item => item.current.sequence === 1);
  assert.deepEqual(continuation.map(item => item.boundary), ['evidence-retrieval']);
  assert.equal(continuation[0]!.disposition, 'consumed');
  const limited = await openSession({ configPath: f.configPath }, { investigation: {
    agent: new ScriptedInvestigator([input => ({ kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] })]),
    bounds: { ...investigationBounds, calls: 1 },
  } });
  assert.equal(limited.status, 'opened'); t.after(() => limited.session.close());
  const stopped = await limited.session.execute(summary);
  assert.equal(view(stopped).result!.evaluation!.outcome.kind, 'limit-stop');
  assert.equal(stopped.attribution.evidence[0]!.outcome!.status, 'available');
  assert.equal(stopped.attribution.evidence[0]!.delivery, 'not-delivered');
  assert.equal(stopped.attribution.status, 'failed');
  assert.equal(stopped.attribution.completeness, 'complete');
});

test('worker interruption seals received work and observations independently of a View and sink success', { timeout: 30_000 }, async t => {
  let ready!: () => void;
  const waiting = new Promise<void>(resolve => { ready = resolve; });
  const agent = new ScriptedInvestigator([
    input => ({ kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] }),
    () => { ready(); return new Promise(() => {}); },
  ]);
  const f = fixture(t);
  const remote = interactiveSession({ configPath: f.configPath }, { investigator: agent });
  t.after(() => remote.close());
  const opened = await remote.opening; assert.equal(opened.status, 'opened');
  const batches: ObservationBatch[] = []; let stdout = '', stderr = '';
  const pending = publishCommand({ id: opened.id, execute: remote.execute, check: remote.check, usage: remote.usage, work: remote.work }, summary,
    'summarize widget', f.configPath, 1, { stdout: text => { stdout += text; }, stderr: text => { stderr += text; } },
    { async submit(batch) { batches.push(batch); return { accepted: false, reason: 'Controlled sink failure.' }; } });
  await waiting;
  await remote.interrupt();
  assert.equal(await pending, 130);
  assert.equal(stdout, ''); assert.match(stderr, /Controlled sink failure/);
  const work = remote.work()!;
  assert.equal(work.status, 'interrupted'); assert.equal(work.completeness, 'incomplete');
  assert.ok(work.work.some(item => item.boundary === 'content' && item.disposition === 'established'));
  assert.equal(work.evidence[0]!.delivery, 'delivered');
  assert.deepEqual(batches[0]!.records.find(item => item.kind === 'request-work')!.value, work);
  assert.ok(!batches[0]!.events.some(item => item.type === 'view-produced'));
  const sealed = JSON.stringify(work);
  await assert.rejects(remote.execute(inventory), CommandInterrupted);
  assert.equal(JSON.stringify(work), sealed);
});


test('equal re-derived records do not invent original attribution for previously untracked work', async t => {
  const opened = await openTypeScriptProject({ configPath: fixture(t).configPath });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const prior = evaluateDependencies(store, opened.analysis, ['exports']);
  const work = new RequestWork(initiation(normalizeRequest(inventory)), store);
  const repeated = evaluateDependencies(store, opened.analysis, ['exports'], work.scope('Re-derive an outcome using retained provider work.'));
  assert.equal(repeated, prior);
  const report = work.finish('completed');
  assert.equal(report.work.find(item => item.boundary === 'dependency-evaluation')!.disposition, 'established');
  assert.ok(report.work.every(item => item.generating.every(generation => generation.origin === null)));
  assert.match(report.limitations.join(' '), /unknown for untracked support/);
});

test('failed publication retains completed prerequisite facts and labels the missing boundary outcome', async t => {
  const f = fixture(t), opened = await openSession({ configPath: f.configPath });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const original = MemoryProgramRecordStore.prototype.put;
  t.mock.method(MemoryProgramRecordStore.prototype, 'put', function (this: MemoryProgramRecordStore, records: Parameters<typeof original>[0]) {
    if (records.some(record => record.kind === 'projection')) throw new Error('Controlled construction defect.');
    return original.call(this, records);
  });
  const batches: ObservationBatch[] = [];
  const code = await publishCommand(opened.session, inventory, 'modules', f.configPath, 1,
    { stdout() { assert.fail('No fabricated output on defect'); }, stderr() {} },
    { async submit(batch) { batches.push(batch); return { accepted: true }; } });
  assert.equal(code, 1);
  const work = opened.session.work()!;
  assert.equal(work.status, 'defect'); assert.equal(work.completeness, 'incomplete');
  assert.ok(work.work.some(item => item.boundary === 'module-evaluation' && item.outcome.state?.execution === 'completed'));
  assert.deepEqual(batches[0]!.records.find(item => item.kind === 'request-work')!.value, work);
  assert.equal(batches[0]!.events.at(-1)!.type, 'command-defect');
});

test('a cancelled asynchronous evidence query retains known acquisition but never accepts a late query result', async t => {
  const opened = await openTypeScriptProject({ configPath: fixture(t).configPath });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const basis = evaluateModules(store, opened.analysis);
  const request = { operation: 'functionality' as const, subject: basis.modules[0]!, parameters: {} };
  const controller = new AbortController();
  const work = new RequestWork(initiation({ kind: 'operation', operation: request }), store);
  const evidence = evidenceAccess(store, opened.analysis, opened.session);
  let release!: () => void, ready!: () => void;
  const started = new Promise<void>(resolve => { ready = resolve; });
  const agent = new ScriptedInvestigator([input => ({ kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] })]);
  const pending = investigate({ session: opened.session, request, work, agent, signal: controller.signal, usage: new InvestigationUsage(),
    history: { get: () => undefined, provenance: () => undefined, correction: () => undefined, corrections: () => [] },
    check: async () => {}, evidence: { lookup: evidence.lookup, query(query, signal, scope) {
      const acquired = evidence.query(query, signal, scope);
      return new Promise(resolve => { release = () => resolve(acquired); ready(); });
    } },
  });
  const rejected = assert.rejects(pending, CommandInterrupted);
  await started; controller.abort(new CommandInterrupted()); await rejected;
  const report = work.finish('interrupted');
  assert.equal(report.completeness, 'incomplete');
  assert.equal(report.evidence[0]!.outcome, null);
  assert.equal(report.evidence[0]!.delivery, 'not-delivered');
  assert.ok(report.work.some(item => item.boundary === 'content' && item.disposition === 'established'));
  const sealed = JSON.stringify(work.snapshot());
  release(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(JSON.stringify(work.snapshot()), sealed);
  assert.equal(agent.inputs[0]!.length, 1);
});


test('cancellation during provider reporting prevents the next evaluation boundary', async t => {
  const controller = new AbortController();
  const opened = await openSession({ configPath: fixture(t).configPath }, { signal: controller.signal,
    onWork(report) { if (report.work.some(item => item.boundary === 'provider-modules')) controller.abort(); },
  });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  await assert.rejects(opened.session.execute(inventory), CommandInterrupted);
  const report = opened.session.work()!;
  assert.equal(report.status, 'interrupted');
  assert.ok(report.work.some(item => item.boundary === 'provider-modules'));
  assert.ok(!put.mock.calls.flatMap(call => call.arguments[0]).some(record => record.kind === 'evaluation' || record.kind === 'projection'));
});


test('a completed parent cannot authorize another provider call through its old work scope', async t => {
  const opened = await openTypeScriptProject({ configPath: fixture(t).configPath });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const work = new RequestWork(initiation(normalizeRequest(inventory)), store);
  const scope = work.scope('Materialize this inventory.');
  const discover = t.mock.method(opened.analysis, 'discover');
  evaluateModules(store, opened.analysis, [], scope);
  work.finish('completed');
  assert.throws(() => evaluateModules(store, opened.analysis, [], scope), /Request work has ended/);
  assert.equal(discover.mock.calls.length, 1);
});

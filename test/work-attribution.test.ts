import { sessionLedger, moduleEntity } from '../src/lib/contributions/modules.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './temporary-directory.js';
import { ScriptedContributionAgent, moduleRecord, proseContribution } from './contribution-agent.js';
import { openApplication as openSession } from '../src/lib/application/index.js';
import { CommandInterrupted } from '../src/lib/execution-errors.js';
import { initiation, RequestWork, WorkReportState, recordExpansionWork } from '../src/lib/work-attribution.js';
import type { WorkReport, AttributedWork } from '../src/lib/work-attribution.js';
import { freezeOwned } from '../src/lib/immutable.js';
import { captureApplicationRequest as normalizeRequest } from '../src/lib/application/requests.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { conductDialog } from '../src/lib/contributions/dialog.js';
import { InvestigationUsage } from '../src/lib/investigation/usage.js';
import { evidenceAccess } from '../src/lib/evidence-access.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { investigationBounds } from '../src/lib/investigation/bounds.js';
import type { RecordId } from '../src/lib/records.js';

const inventory = { kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } } as const;
const summary = { kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'widget' } } as const;
function fixture(t: TestContext, huge = false, many = false) {
  const root = temporaryDirectory(t, 'postcode-work-attribution-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, include: ['*.ts'] }));
  writeFileSync(path.join(root, 'widget.ts'), `${huge ? `// ${'x'.repeat(70_000)}\n` : ''}export const widget = 1;`);
  if (many) for (let i = 0; i < 30; i++) writeFileSync(path.join(root, `other${i}.ts`), `export const other${i} = ${i};`);
  return { root, configPath };
}
function contribution(result: import('../src/lib/application/index.js').ApplicationResult) {
  assert.equal(result.kind, 'answer'); assert.equal(result.answer.content.contract, 'contribution');
  return { ...result, projection: result.answer.content.value.projection };
}

test('request attribution separates prerequisite work, actual provider reuse and first generation without changing answers', async t => {
  const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
  const opened = await openSession({ configPath });
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const first = await opened.session.execute(inventory);
  assert.equal(first.kind, 'answer');
  assert.equal(first.attribution.status, 'completed');
  assert.equal(first.context.initiator, 'caller');
  assert.equal(first.context.constraints.wholeRequestBudget, null);
  const snapshot = JSON.stringify(first);
  const repeat = await opened.session.execute(inventory);
  assert.equal(repeat.kind, 'answer');
  assert.notEqual(first.context.id, repeat.context.id);
  assert.deepEqual(repeat.attribution.parents, [first.context]);
  assert.deepEqual(first.attribution.parents, []);
  assert.deepEqual(first.answer, repeat.answer);
  for (const boundary of ['provider-modules', 'module-evaluation']) {
    assert.equal(first.attribution.work.find(item => item.boundary === boundary)!.disposition, 'established');
    const reused: AttributedWork = repeat.attribution.work.find(item => item.boundary === boundary)!;
    assert.equal(reused.disposition, 'reused');
    assert.deepEqual(parentOf(repeat.attribution, reused.current.parent), repeat.context);
    assert.ok(reused.generating.every(item => item.origin !== null && parentOf(repeat.attribution, item.origin.parent).id === first.context.id));
  }
  const missing = await opened.session.execute({ ...summary, designation: { kind: 'name', value: 'absent-candidate' } });
  assert.equal(missing.kind, 'resolution');
  assert.equal(missing.attribution.status, 'refused');
  assert.ok(missing.attribution.work.length > 0);
  assert.ok(missing.attribution.work.every(item => item.current.role === 'resolution-prerequisite' && item.current.initiator === 'PostCode'));
  const dependencies = await opened.session.execute({ ...inventory, lens: 'dependency-structure' });
  const repeated = await opened.session.execute({ ...inventory, lens: 'dependency-structure' });
  const provider = repeated.attribution.work.find(item => item.boundary === 'provider-dependencies')!;
  assert.equal(provider.disposition, 'reused');
  assert.ok(provider.generating.every(item => item.origin !== null && parentOf(repeated.attribution, item.origin.parent).id === dependencies.context.id));
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
  assert.equal(parentOf(contexts[3]!, contexts[3]!.work[0]!.generating[0]!.origin!.parent).id, contexts[2]!.context.id);
  assert.equal(contexts[3]!.work[0]!.outcome.state!.reason, 'Controlled incomplete population.');
});

test('evidence attribution preserves withheld capture, unavailability, reuse and request parent context', async t => {
  const agent = new ScriptedContributionAgent([
    input => input.request.operation === 'functionality' ? { kind: 'tools', requests: [
      { kind: 'source', subject: moduleRecord(input) }, { kind: 'source', subject: moduleRecord(input) },
      { kind: 'source', subject: 'unknown-in-this-session' as RecordId },
    ] } : { kind: 'tools', requests: [] },
    input => {
      if (input.request.operation === 'functionality') assert.ok(input.responses.every(response => response.tool === 'unavailable' || response.tool === 'evidence' && response.response.status === 'unavailable'));
      return { kind: 'submit', contribution: proseContribution(input) };
    },
  ]);
  const bounds = { ...investigationBounds, calls: 4 };
  const opened = await openSession({ configPath: fixture(t, true).configPath }, { investigation: { agent, bounds } });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  bounds.calls = 1;
  const first = await opened.session.execute(summary);
  const answer = contribution(first);
  assert.equal(first.context.constraints.investigation.calls, 4, 'the actual inherited bounds are captured when the Session opens');
  assert.equal(first.attribution.evidence.filter(item => item.query.kind === 'source').length, 3);
  const [acquired, repeated, unavailable] = first.attribution.evidence.filter(item => item.query.kind === 'source');
  assert.equal(acquired!.outcome!.status, 'available');
  assert.equal(acquired!.delivery, 'withheld');
  assert.match(acquired!.reason!, /delivery bound/);
  assert.equal(repeated!.delivery, 'withheld');
  assert.equal(unavailable!.outcome!.status, 'unavailable');
  assert.equal(unavailable!.delivery, 'delivered');
  const content = first.attribution.work.filter(item => item.boundary === 'content');
  assert.deepEqual(content.map(item => item.disposition), ['established', 'reused']);
  assert.deepEqual(content[0]!.current.trigger, { kind: 'source', subject: answer.resolution!.candidates[0]!.id });
  assert.equal(content[0]!.current.sequence, 1);
  assert.equal(content[1]!.current.sequence, 2);
  assert.equal(content[1]!.generating[0]!.origin!.sequence, 1);
  const capture = content[0]!.outcome.records[0]!;
  assert.ok(acquired!.outcome!.records.includes(capture));
  assert.ok(!answer.usage.attempts[0]!.suppliedEvidence.includes(capture));
  assert.equal(answer.usage.attempts[0]!.parent!.id, first.context.id);
  const second = await opened.session.execute(summary);
  assert.deepEqual(contribution(second).projection, answer.projection);
  assert.deepEqual(second.attribution.evidence, []);
  const reused = second.attribution.work.find(item => item.boundary === 'interpretation')!;
  assert.equal(reused.disposition, 'reused');
  assert.ok(reused.generating.every(item => parentOf(second.attribution, item.origin!.parent).id === first.context.id));
  const followup = await opened.session.execute({ ...summary, lens: 'explain', designation: { kind: 'reference', value: answer.projection.alternatives[0]!.designation.investigram } });
  assert.equal(contribution(followup).reporting!.contribution!.outcome.kind, 'accepted');
  assert.equal(followup.attribution.evidence[0]!.query.kind, 'contribution');
  assert.equal(followup.attribution.evidence[0]!.delivery, 'delivered');
  assert.ok(followup.attribution.evidence[0]!.outcome!.contributions!.some(delivery => delivery.kind === 'item'));
  assert.equal(followup.attribution.work.find(item => item.boundary === 'evidence-retrieval')!.disposition, 'consumed');
  const inspected = await opened.session.execute({ ...summary, lens: 'inspect', designation: { kind: 'reference', value: answer.projection.alternatives[0]!.designation.investigram } });
  const consumption = inspected.attribution.work.find(item => item.boundary === 'interpretation' && item.disposition === 'consumed')!;
  assert.ok(consumption.generating.some(item => item.records.includes(answer.reporting!.attempt!) && item.origin !== null && parentOf(inspected.attribution, item.origin.parent).id === first.context.id));
  assert.equal(agent.inputs.length, 2, 'historical inspection starts no inference');
});

test('continuations consume an established page without claiming another acquisition; guarded evidence stays undelivered', async t => {
  const agent = new ScriptedContributionAgent([
    () => ({ kind: 'tools', requests: [{ kind: 'modules' }] }),
    input => {
      const supplied = input.responses[0]!; assert.equal(supplied.tool, 'evidence'); const response = supplied.response;
      assert.ok(response.page?.next);
      return { kind: 'tools', requests: [{ kind: 'modules', cursor: response.page.next }] };
    },
    input => ({ kind: 'submit', contribution: proseContribution(input) }),
  ]);
  const f = fixture(t, false, true);
  const opened = await openSession({ configPath: f.configPath }, { investigation: { agent } });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const result = await opened.session.execute(summary);
  assert.equal(result.attribution.evidence[1]!.outcome!.page!.total, 31);
  assert.equal(result.attribution.evidence[2]!.delivery, 'delivered');
  const continuation = result.attribution.work.filter(item => item.current.sequence === 2);
  assert.deepEqual(continuation.map(item => item.boundary), ['evidence-retrieval']);
  assert.equal(continuation[0]!.disposition, 'consumed');
  const limited = await openSession({ configPath: f.configPath }, { investigation: {
    agent: new ScriptedContributionAgent([input => ({ kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] })]),
    bounds: { ...investigationBounds, calls: 1 },
  } });
  assert.equal(limited.status, 'opened'); t.after(() => limited.session.close());
  const stopped = await limited.session.execute(summary);
  assert.equal(contribution(stopped).reporting!.contribution!.outcome.kind, 'limit-stop');
  assert.equal(stopped.attribution.evidence[1]!.outcome!.status, 'available');
  assert.equal(stopped.attribution.evidence[1]!.delivery, 'not-delivered');
  assert.equal(stopped.attribution.status, 'failed');
  assert.equal(stopped.attribution.completeness, 'complete');
});

test('over-bound common content is withheld while a subsequent bounded excerpt is actually delivered', async t => {
  let item!: import('../src/lib/contributions/model.js').ItemAddress;
  const agent = new ScriptedContributionAgent([
    input => input.request.operation === 'functionality'
      ? { kind: 'submit', contribution: proseContribution(input, 'x'.repeat(70_000)) }
      : { kind: 'tools', requests: [{ kind: 'item', item }] },
    input => {
      assert.equal(input.responses[0]!.tool, 'unavailable');
      return { kind: 'tools', requests: [{ kind: 'item', item, excerptCharacters: 200 }] };
    },
    input => {
      assert.equal(input.responses[0]!.tool, 'contribution');
      return { kind: 'submit', contribution: proseContribution(input, 'An excerpt was available.') };
    },
  ]);
  const opened = await openSession({ configPath: fixture(t).configPath }, { investigation: { agent } });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const first = contribution(await opened.session.execute(summary)); item = first.projection.alternatives[0]!.items[0]!.address;
  const follow = await opened.session.execute({ ...summary, lens: 'explain', designation: { kind: 'reference', value: item.investigram } });
  const common = follow.attribution.evidence.filter(entry => entry.query.kind === 'contribution');
  assert.equal(common.length, 3, 'initial whole subject, explicit full item, then excerpt');
  for (const entry of common.slice(0, 2)) {
    assert.equal(entry.delivery, 'withheld'); assert.equal(entry.outcome!.status, 'unavailable');
    assert.deepEqual(entry.outcome!.records, []); assert.deepEqual(entry.outcome!.contributions, []);
    assert.match(entry.reason!, /Response omitted.*Nothing was delivered/);
  }
  assert.equal(common[2]!.delivery, 'delivered'); assert.equal(common[2]!.outcome!.status, 'available');
  const supplied = contribution(follow).usage.attempts.at(-1)!.contributionDeliveries!.filter(delivery => delivery.kind === 'item');
  assert.equal(supplied.length, 1); assert.deepEqual(supplied[0]!.item, item); assert.equal(supplied[0]!.coverage, 'excerpt');
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

test('a cancelled asynchronous evidence query retains known acquisition but never accepts a late query result', async t => {
  const opened = await openTypeScriptProject({ configPath: fixture(t).configPath });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const basis = evaluateModules(store, opened.analysis);
  const controller = new AbortController();
  const work = new RequestWork(initiation(normalizeRequest({ kind: 'lens', lens: 'summarize', designation: { kind: 'reference', value: basis.modules[0]! } })), store);
  const evidence = evidenceAccess(store, opened.analysis, opened.session);
  let release!: () => void, ready!: () => void;
  const started = new Promise<void>(resolve => { ready = resolve; });
  const agent = new ScriptedContributionAgent([() => ({ kind: 'tools', requests: [{ kind: 'source', subject: basis.modules[0]! }] })]);
  const ledger = sessionLedger(store, opened.session), entity = moduleEntity(store, basis.modules[0]!)!;
  const invoked = ledger.invoke({ operation: 'functionality', subjects: [{ role: null, subject: { kind: 'entity', entity } }], parameters: {}, context: [], resultContract: null });
  const pending = conductDialog({ ledger, store, invocation: invoked.invocation.id, operation: { id: 'functionality', method: 'test/cancel@1', objective: 'Read evidence.' }, work, agent, signal: controller.signal, usage: new InvestigationUsage(),
    check: async () => {}, evidence: { lookup: evidence.lookup, query(query, signal, scope) {
      const acquired = evidence.query(query, signal, scope);
      return new Promise(resolve => { release = () => resolve(acquired); ready(); });
    } },
  });
  const rejected = assert.rejects(pending, CommandInterrupted);
  await started; controller.abort(new CommandInterrupted()); await rejected;
  const report = work.finish('interrupted');
  assert.equal(report.completeness, 'incomplete');
  const source = report.evidence.find(item => item.query.kind === 'source')!;
  assert.ok(source); assert.equal(source.outcome, null);
  assert.equal(source.delivery, 'not-delivered');
  assert.ok(report.work.some(item => item.boundary === 'content' && item.disposition === 'established'));
  const sealed = JSON.stringify(work.snapshot());
  release(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(JSON.stringify(work.snapshot()), sealed);
  assert.equal(agent.inputs[0]!.length, 1);
});


test('cancellation during provider reporting prevents the next evaluation boundary', async t => {
  const controller = new AbortController();
  const opened = await openSession({ configPath: fixture(t).configPath }, { signal: controller.signal,
    onWork(progress) { if (progress.kind === 'work' && progress.entry.boundary === 'provider-modules') controller.abort(); },
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

test('attribution progress transports each work entry once and reconstructs immutable complete reports', () => {
  const context = initiation(normalizeRequest(inventory));
  let received: WorkReportState | undefined;
  let bytes = 0;
  const work = new RequestWork(context, new MemoryProgramRecordStore(), progress => {
    bytes += Buffer.byteLength(JSON.stringify(progress));
    const owned = freezeOwned(structuredClone(progress));
    if (owned.kind === 'start') received = new WorkReportState(owned.context);
    else received!.apply(owned);
  });
  const scope = work.scope('Materialize a large controlled population.');
  for (let index = 0; index < 4_000; index++) scope.record('content', 'established', {
    records: [`controlled-record-${index.toString().padStart(4, '0')}` as RecordId],
  });
  const earlier = received!.snapshot();
  const final = work.finish('completed');
  assert.deepEqual(received!.snapshot(), final);
  assert.equal(earlier.status, 'running');
  assert.equal(final.work.length, 4_000);
  assert.ok(bytes < Buffer.byteLength(JSON.stringify(final)) * 1.5, 'incremental transport must stay proportional to final facts, not accumulated snapshots');
  assert.ok(Object.isFrozen(final.work) && Object.isFrozen(final.work[0]!.generating[0]!.origin));
  assert.equal(final.work[0], work.snapshot().work[0], 'snapshot containers share already immutable entries');
  assert.deepEqual(final.parents, []);
});

test('expansion reporting groups equal states without hiding qualifications or first-retention limits', () => {
  const work = new RequestWork(initiation(normalizeRequest(inventory)), new MemoryProgramRecordStore());
  const state = { applicability: 'applicable' as const, availability: 'available' as const, execution: 'completed' as const,
    materialization: 'full' as const, reason: null, cost: { measure: 'modules', value: 1 } };
  recordExpansionWork(work.scope('Materialize expansions.'), 'module-expansion-evaluation', [
    { requirement: 'exports', disposition: 'established', state, records: ['a' as RecordId] },
    { requirement: 'exports', disposition: 'established', state, records: ['b' as RecordId], firstRetained: [] },
    { requirement: 'exports', disposition: 'established', state: { ...state, materialization: 'partial', reason: 'Unavailable part.' }, records: ['c' as RecordId] },
    { requirement: 'exports', disposition: 'reused', state, records: ['d' as RecordId] },
  ]);
  const report = work.finish('completed');
  assert.deepEqual(report.work.map(item => [item.disposition, item.outcome.records, item.outcome.expansion?.count, item.outcome.state?.reason]), [
    ['established', ['a', 'b'], 2, null], ['established', ['c'], 1, 'Unavailable part.'], ['reused', ['d'], 1, null],
  ]);
  assert.ok(report.work[0]!.generating[0]!.origin);
  assert.equal(report.work[0]!.generating[1]!.origin, null);
  assert.equal(report.work[2]!.generating[0]!.origin, null);
});

test('hundreds of modules produce boundary-sized expansion reports with complete record attribution', async t => {
  const project = fixture(t);
  for (let index = 1; index < 500; index++) writeFileSync(path.join(project.root, `other${index}.ts`), `export const other${index} = ${index};`);
  let events = 0, bytes = 0;
  const opened = await openSession({ configPath: project.configPath }, { onWork(progress) {
    events++; bytes += Buffer.byteLength(JSON.stringify(progress));
  } });
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const first = await opened.session.execute(inventory);
  const expansions = first.attribution.work.filter(item => item.boundary === 'module-expansion-evaluation');
  assert.ok(expansions.length > 0 && expansions.length < 12);
  assert.ok(expansions.reduce((count, item) => count + item.outcome.expansion!.count, 0) >= 1_000);
  for (const expansion of expansions) {
    assert.equal(expansion.outcome.records.length, expansion.outcome.expansion!.count);
    assert.deepEqual(expansion.generating.flatMap(item => item.records), expansion.outcome.records);
    assert.ok(expansion.generating.every(item => item.origin?.parent === 0));
  }
  const reportBytes = Buffer.byteLength(JSON.stringify(first.attribution));
  assert.ok(events < 32, 'provider/evaluator expansion reports are grouped by requirement and qualification');
  assert.ok(bytes < reportBytes * 1.5, 'incremental progress does not repeat earlier facts');
  assert.ok(reportBytes < 1_500_000, 'report size includes record identities, not repeated parent descriptions');
  const repeat = await opened.session.execute(inventory);
  assert.deepEqual(repeat.attribution.parents, [first.context]);
  assert.deepEqual(repeat.kind === 'answer' && repeat.answer, first.kind === 'answer' && first.answer);
  assert.ok(repeat.attribution.work.filter(item => item.boundary === 'module-expansion-evaluation')
    .every(item => item.disposition === 'reused' && item.generating.every(generation => generation.origin !== null && parentOf(repeat.attribution, generation.origin.parent).id === first.context.id)));
});


function parentOf(report: WorkReport, reference: number) {
  return reference === 0 ? report.context : report.parents[reference - 1]!;
}

test('reused caller correlation IDs cannot conflate distinct generating parent descriptions', async t => {
  const opened = await openSession({ configPath: fixture(t).configPath });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const first = await opened.session.execute(inventory, { requestId: 'repeated-correlation' });
  const second = await opened.session.execute({ ...inventory, lens: 'dependency-structure' }, { requestId: 'repeated-correlation' });
  assert.equal(first.context.id, second.context.id);
  assert.notEqual(first.context.purpose, second.context.purpose);
  const reused = second.attribution.work.find(item => item.boundary === 'module-evaluation')!;
  assert.deepEqual(parentOf(second.attribution, reused.current.parent), second.context);
  assert.deepEqual(parentOf(second.attribution, reused.generating[0]!.origin!.parent), first.context);
  assert.deepEqual(second.attribution.parents, [first.context]);
});

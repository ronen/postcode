import { finalizeRequestReport } from '../src/lib/interfaces/cli/request-reporting.js';
import type { UsageReport } from '../src/lib/interfaces/cli/report-contracts.js';
import { requireView, requireResolution } from './request-helpers.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { Worker } from 'node:worker_threads';
import type { WorkerReply, WorkerRequest } from '../src/lib/session-protocol.js';
import { temporaryDirectory, interactionDriver } from './cli-helpers.js';
import { syntheticUsage } from './investigator-double.js';
import { ScriptedContributionAgent, moduleRecord, proseContribution, caveat } from './contribution-agent.js';
import type { DialogAgent as InvestigatorAgent, DialogReply as AgentReply } from '../src/lib/contributions/dialog.js';
import { presentationMethods } from '../src/lib/interfaces/cli/methods.js';
import { openCliSession as openSession } from '../src/lib/interfaces/cli/application.js';
import { runCli } from '../src/lib/cli.js';
import type { ReportedUsage } from '../src/lib/investigation/contracts.js';
import { finalizeInvestigationUsage } from '../src/lib/investigation/presentation.js';
import type { ContributionView as InvestigationView } from '../src/lib/interfaces/cli/contribution-presentation.js';
import type { InvestigationUsageReport } from '../src/lib/investigation/reporting.js';
import type { ObservationBatch } from '../src/lib/application/observations.js';
import type { RecordId } from '../src/lib/records.js';
import { investigationBounds } from '../src/lib/investigation/execute.js';

function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-investigation-integration-');
  const configPath = path.join(root, 'tsconfig.json');
  const source = path.join(root, 'entry.ts');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['entry.ts', 'other.ts'] }));
  writeFileSync(source, 'export function entry() { return 7; }');
  writeFileSync(path.join(root, 'other.ts'), 'export const other = 1;');
  return { root, configPath, source };
}
function summaryAgent() {
  return new ScriptedContributionAgent([
    (input, _signal, usage) => { usage(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] }; },
    (input, _signal, usage) => {
      usage(syntheticUsage); const response = input.responses[0]!; assert.equal(response.tool, 'evidence');
      const root = proseContribution(input, 'Returns seven.\u001b[31m', { evidence: response.response.selected, key: 'root' });
      return { kind: 'submit', contribution: { investigrams: [{ ...root.investigrams[0]!, declarations: [{ key: 'answer', operation: 'add',
        target: { kind: 'result', result: input.request.result }, members: [
          { kind: 'item', item: { investigram: { local: 'root' }, item: 'prose' } },
          { kind: 'item', item: { investigram: { local: 'aspect' }, item: 'prose' } }] }] },
        { key: 'aspect', qualification: caveat, items: [{ key: 'prose', type: 'prose', body: { text: 'A separately selectable aspect.' } }] }] } };
    },
  ]);
}
const summary = { lens: 'summarize' as const, selector: 'entry', presentation: { format: 'json' as const, moreDetails: false } };
function view(executed: import('../src/lib/session-protocol.js').ExecutedRequest): InvestigationView {
  const result = requireView(executed);
  assert.equal(result.view.schema, 'postcode-contribution-view/1-experimental');
  return result.view as InvestigationView;
}
async function session(t: TestContext, agent?: InvestigatorAgent) {
  const f = fixture(t);
  const opened = await openSession({ configPath: f.configPath }, { investigation: agent ? { agent } : {} });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Fixture failed');
  t.after(() => opened.session.close());
  return { ...f, session: opened.session };
}

for (const kind of ['refused', 'truncated', 'communication-failure', 'configuration-unavailable'] as const) {
  test(`session applies retention policy to ${kind} with attempt usage preserved`, async t => {
    const agent = new ScriptedContributionAgent([(_input, _signal, usage): AgentReply => {
      usage(syntheticUsage);
      return kind === 'communication-failure' || kind === 'configuration-unavailable' ? { kind, code: 'controlled', diagnostic: 'Controlled failure.' } : { kind };
    }]);
    const f = await session(t, agent);
    const first = view(await f.session.execute(summary));
    const second = view(await f.session.execute(summary));
    const retained = kind === 'refused' || kind === 'truncated';
    assert.equal(second.reporting!.reused, retained);
    assert.equal(agent.inputs.length, retained ? 1 : 2);
    assert.equal(second.usage.calls, retained ? 1 : 2);
    assert.equal(first.rows.length, 0);
    assert.equal(first.reporting!.attempt, first.usage.attempts[0]!.attempt);
    assert.equal(second.reporting!.attempt, second.usage.attempts.at(-1)!.attempt);
  });
}


test('CLI worker summary, reuse, exact child inspection, source traceability and usage share one session', async t => {
  const f = fixture(t), agent = summaryAgent();
  const input = Object.assign(new PassThrough(), { isTTY: true });
  const driver = interactionDriver(() => input.end());
  const batches: ObservationBatch[] = [];
  let started = false, output = '', error = '', rootReference = '';
  const code = await runCli(['shell', '--project', f.configPath, '--json'], {
    cwd: f.root, checkout: f.root, input, investigator: agent,
    stdout: text => { output += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\n')); } }, stderr: text => { error += text; },
    sink: { async submit(batch) {
      batches.push(batch);
      driver.run(() => {
        if (batch.records.some(item => item.kind === 'usage-report')) { input.end(); return; }
        const data = batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
        if (batches.length === 1) { assert.equal(data.rows.length, 2); rootReference = data.rows[0]!.reference; input.write('summarize entry\n'); }
        else if (batches.length === 2) { assert.equal(data.reporting!.reused, true); input.write(`inspect @${data.rows[1]!.reference}\n`); }
        else if (batches.length === 3) { assert.equal(data.rows.length, 1); input.write(`inspect @${rootReference} --more-details\n`); }
        else if (batches.length === 4) input.write('usage\n');
        else input.end();
      });
      return { accepted: true };
    } },
  });
  driver.verify();
  assert.equal(code, 0, error);
  assert.equal(agent.inputs.length, 1);
  assert.equal(agent.closes, 1);
  assert.equal(batches.length, 5);
  assert.ok(batches.every(batch => batch.records.some(item => item.kind === 'investigation-usage')));
  assert.ok(batches.filter((_, index) => index !== 3).every(batch => !batch.events.some(item => item.type === 'attribution-disclosed')), 'investigator source reads are not human source disclosure');
  assert.ok(batches[3]!.events.some(item => item.type === 'attribution-disclosed' && item.sourceLevel === 'investigation-support'));
  assert.ok(output.includes('postcode-contribution-view/1-experimental'));
});


test('one-shot summary discloses expiring references, source inspection is escaped, and unconfigured requests fail explicitly', async t => {
  const f = fixture(t);
  let stdout = '', stderr = '';
  const batches: ObservationBatch[] = [];
  const environment = { cwd: f.root, checkout: f.root, stdout: (text: string) => { stdout += text; }, stderr: (text: string) => { stderr += text; },
    sink: { async submit(batch: ObservationBatch) { batches.push(batch); return { accepted: true as const }; } } };
  assert.equal(await runCli(['summarize', 'entry', '--project', f.configPath], { ...environment, investigator: summaryAgent() }), 0, stderr);
  assert.match(stdout, /references expire/);
  assert.doesNotMatch(stdout, /\u001b/);
  assert.ok(stdout.includes('synthetic'));
  stdout = '';
  assert.equal(await runCli(['summarize', 'entry', '--project', f.configPath, '--json'], environment), 3);
  assert.equal(JSON.parse(stdout).reporting.unavailable.kind, 'configuration-unavailable');
  assert.equal(batches.at(-1)!.events.at(-1)!.type, 'command-failed');
});


test('worker interruption aborts the dialogue and preserves received usage and exposure in final observations', async t => {
  const f = fixture(t);
  let aborted = false, closed = 0, calls = 0, stderr = '';
  const batches: ObservationBatch[] = [];
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open: () => ({
    exchange: async (input, signal, report) => {
      report(syntheticUsage);
      if (++calls === 1) return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] };
      signal.addEventListener('abort', () => { aborted = true; }, { once: true });
      setImmediate(() => process.emit('SIGINT'));
      return new Promise<AgentReply>(() => {});
    }, close: () => { closed++; },
  }) };
  const code = await runCli(['summarize', 'entry', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, investigator: agent,
    stdout: () => {}, stderr: text => { stderr += text; }, sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } } });
  assert.equal(code, 130);
  assert.equal(aborted, true); assert.equal(closed, 1);
  assert.match(stderr, /postcode-investigation-usage/);
  const usage = batches[0]!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  assert.equal(usage.calls, 2); assert.equal(usage.missingCalls, 0);
  assert.ok(usage.attempts[0]!.suppliedEvidence.length > 0, 'interruption preserves source exposure already dispatched');
  assert.equal(usage.attempts[0]!.termination, 'interrupted');
  assert.equal(batches[0]!.events.at(-1)!.type, 'command-interrupted');
  assert.ok(!batches[0]!.records.some(item => item.kind === 'qualified-view'));
});


test('post-submission input invalidation suppresses the view but preserves usage', async t => {
  const f = fixture(t), batches: ObservationBatch[] = [];
  const agent = new ScriptedContributionAgent([(input, _signal, usage) => {
    usage(syntheticUsage); writeFileSync(f.source, 'export function entry() { return 8; }');
    return { kind: 'submit', contribution: proseContribution(input) };
  }]);
  const code = await runCli(['summarize', 'entry', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, investigator: agent,
    stdout: () => {}, stderr: () => {}, sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } } });
  assert.equal(code, 2);
  assert.equal(batches[0]!.events.at(-1)!.type, 'session-invalidated');
  const usage = batches[0]!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  assert.equal(usage.calls, 1); assert.equal(usage.attempts[0]!.termination, 'invalidated');
  assert.ok(!batches[0]!.records.some(item => item.kind === 'qualified-view'));
});


test('worker call guard produces a retained limit stop without retrying on repeated summary', async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  const agent = new ScriptedContributionAgent([item => ({ kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(item) }] })]);
  const views: InvestigationView[] = []; let started = false;
  const code = await runCli(['shell', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, input, investigator: agent,
    investigationBounds: { ...investigationBounds, calls: 1 }, stderr: () => {},
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nsummarize entry\n')); } },
    sink: { async submit(batch) { views.push(batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView); if (views.length === 2) input.end(); return { accepted: true }; } } });
  assert.equal(code, 0);
  assert.equal(views[0]!.reporting!.contribution!.outcome.kind, 'limit-stop');
  assert.equal(views[1]!.reporting!.reused, true);
  assert.equal(agent.inputs.length, 1);
});


test('selection failures and cross-session investigram references cannot start generation', async t => {
  const f = fixture(t);
  writeFileSync(path.join(f.root, 'other.ts'), "declare module 'entry' { export const value: number; }");
  const agent = summaryAgent();
  const opened = await openSession({ configPath: f.configPath }, { investigation: { agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  t.after(() => opened.session.close());
  const ambiguous = requireResolution(await opened.session.execute(summary));
  assert.equal(ambiguous.resolution.reason, 'ambiguous');
  assert.equal(ambiguous.resolution.candidates.length, 2);
  assert.equal(agent.inputs.length, 0);
  const selected = view(await opened.session.execute({ ...summary, selector: ambiguous.resolution.candidates[0]!.reference, reference: true }));
  assert.equal(selected.rows.length, 2);
  const fresh = await session(t, summaryAgent());
  const foreign = requireResolution(await fresh.session.execute({ lens: 'inspect', selector: selected.references[0]![1], reference: true, presentation: summary.presentation }));
  assert.equal(foreign.resolution.reason, 'unknown-reference');
});


test('session usage keeps unknown and anomalous calls distinct and does not fail on aggregate overflow', async t => {
  const agent = new ScriptedContributionAgent([
    (input, _signal, usage) => { usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value: Number.MAX_VALUE, includedIn: null }] }); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] }; },
    (input, _signal, usage) => { usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value: Number.MAX_VALUE, includedIn: null }] }); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] }; },
    (input, _signal, usage) => { usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value: -1, includedIn: null }] }); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] }; },
    input => ({ kind: 'submit', contribution: proseContribution(input) }),
  ]);
  const f = await session(t, agent);
  const result = view(await f.session.execute(summary));
  assert.equal(result.reporting!.contribution!.outcome.kind, 'accepted');
  assert.equal(result.usage.calls, 4); assert.equal(result.usage.missingCalls, 1); assert.equal(result.usage.anomalousCalls, 1);
  assert.equal(result.usage.totals[0]!.categories[0]!.value, null);
  assert.match(result.usage.limitations.join(' '), /finite numeric range/);
  await f.session.close();
  assert.equal(f.session.usage().calls, 4, 'closing the session does not erase usage');
});


test('worker guard ignores late replies and late usage from a closed dialogue', async t => {
  const f = fixture(t), batches: ObservationBatch[] = [];
  let released: (() => void) | undefined;
  let late: (() => void) | undefined;
  let closes = 0;
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open: () => ({
    exchange: async (input, _signal, report) => {
      report(syntheticUsage);
      late = () => report({ ...syntheticUsage, categories: [{ category: 'output', unit: 'tokens', value: 9999, includedIn: null }] });
      await new Promise<void>(resolve => { released = resolve; });
      return { kind: 'submit', contribution: proseContribution(input) };
    }, close: () => { closes++; },
  }) };
  const code = await runCli(['summarize', 'entry', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, investigator: agent,
    investigationBounds: { ...investigationBounds, milliseconds: 1000 }, stdout: () => {}, stderr: () => {},
    sink: { async submit(batch) { batches.push(batch); late?.(); released?.(); return { accepted: true }; } } });
  assert.equal(code, 3); assert.equal(closes, 1);
  const data = batches[0]!.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
  assert.equal(data.reporting!.contribution!.outcome.kind, 'limit-stop');
  assert.equal(data.rows.length, 0);
  const usage = batches[0]!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  assert.equal(usage.calls, 1); assert.equal(usage.anomalousCalls, 0);
});


test('non-finite usage reports remain distinguishable after JSON serialization', async t => {
  const f = await session(t, new ScriptedContributionAgent([(input, _signal, usage) => {
    for (const value of [NaN, Infinity, -Infinity]) usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', includedIn: null, value }] });
    return { kind: 'submit', contribution: proseContribution(input) };
  }]));
  const result = view(await f.session.execute(summary));
  const json = JSON.parse(JSON.stringify(result.usage)) as InvestigationUsageReport;
  assert.deepEqual(json.nonFiniteReports.map(item => item.value), ['NaN', 'Infinity', '-Infinity']);
  assert.equal(json.anomalousCalls, 1); assert.deepEqual(json.totals, []);
});


test('the worker bridge preserves an absent malformed reply for retained domain failure', async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  const agent = new ScriptedContributionAgent([() => undefined as unknown as AgentReply]);
  let started = false; const views: InvestigationView[] = [];
  const code = await runCli(['shell', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, input, investigator: agent,
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nsummarize entry\n')); } }, stderr: () => {},
    sink: { async submit(batch) { views.push(batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView); if (views.length === 2) input.end(); return { accepted: true }; } } });
  assert.equal(code, 0);
  assert.deepEqual(views[0]!.reporting!.contribution!.outcome, { kind: 'investigation-failure', reason: 'Malformed agent response.' });
  assert.equal(views[1]!.reporting!.reused, true); assert.equal(agent.inputs.length, 1); assert.equal(agent.closes, 1);
});


for (const shell of [false, true]) test(`usage arriving after a reply remains attributable until dialogue close (${shell ? 'shell' : 'one-shot'})`, async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  let reportFirst: (() => void) | undefined, started = false;
  const agent = new ScriptedContributionAgent([
    (item, _signal, report) => { reportFirst = () => report(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(item) }] }; },
    (item, _signal, report) => { reportFirst!(); report(syntheticUsage); return { kind: 'submit', contribution: proseContribution(item) }; },
  ]);
  const batches: ObservationBatch[] = [];
  const code = await runCli(shell ? ['shell', '--project', f.configPath, '--json'] : ['summarize', 'entry', '--project', f.configPath, '--json'], {
    cwd: f.root, checkout: f.root, input, investigator: agent, stderr: () => {},
    stdout: text => { if (shell && !started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nusage\n')); } },
    sink: { async submit(batch) { batches.push(batch); if (batches.length === 2) input.end(); return { accepted: true }; } },
  });
  assert.equal(code, 0);
  for (const batch of batches) {
    const data = batch.records.find(item => item.kind === 'qualified-view' || item.kind === 'usage-report')!.value as InvestigationView | UsageReport;
    const observed = batch.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
    assert.equal(data.usage.calls, 2); assert.equal(data.usage.missingCalls, 0);
    assert.deepEqual(data.usage, observed);
    assert.equal(data.usage.totals[0]!.categories.find(item => item.category === 'input')!.value, 40);
  }
  assert.equal(batches.length, shell ? 2 : 1);
  assert.equal(agent.closes, 1);
});


test('shell rejects known investigram subjects for mechanical and summary lenses without calling the investigator', async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true }), agent = summaryAgent();
  let started = false, reference = '', output = '';
  const batches: ObservationBatch[] = [], driver = interactionDriver(() => input.end());
  const commands = ['children', 'parents', 'summarize'];
  const code = await runCli(['shell', '--project', f.configPath], { cwd: f.root, checkout: f.root, input, investigator: agent,
    stdout: text => { output += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\n')); } }, stderr: () => {},
    sink: { async submit(batch) { batches.push(batch); driver.run(() => {
      if (batches.length === 1) reference = (batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView).references[0]![1];
      else {
        const data = batch.records.find(item => item.kind === 'resolution-result')!.value as import('../src/lib/interfaces/cli/report-contracts.js').ResolutionReport;
        assert.equal(data.resolution.reason, 'unsupported-subject');
        assert.equal(data.resolution.candidates[0]!.kind, 'contribution');
        assert.deepEqual(data.resolution.retainedAnswers, []);
        assert.equal(batch.records.some(item => item.kind === 'qualified-view'), false);
      }
      const command = commands[batches.length - 1];
      if (command) input.write(`${command} @${reference}\n`); else input.end();
    }); return { accepted: true }; } },
  });
  driver.verify(); assert.equal(code, 0); assert.equal(agent.inputs.length, 1);
  assert.equal(batches.length, 4); assert.match(output, /unsupported subject\/lens combination/);
  assert.ok(batches.slice(1).every(batch => batch.events.at(-1)!.type === 'command-refused'));
  assert.doesNotMatch(output, /unknown-reference|Selection: missing/);
});


for (const reported of [true, false]) test(`human final interruption reporting preserves attempt and session usage (${reported ? 'multiple attempts' : 'unknown only'})`, async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  let started = false, opened = 0, stderr = '';
  const batches: ObservationBatch[] = [];
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open() {
    const attempt = ++opened;
    return { exchange: async (item, _signal, usage) => {
      if (reported) usage(syntheticUsage);
      if (reported && attempt === 1) return { kind: 'submit', contribution: proseContribution(item) };
      setImmediate(() => process.emit('SIGINT'));
      return new Promise<AgentReply>(() => {});
    }, close() {} };
  } };
  const code = await runCli(reported ? ['shell', '--project', f.configPath] : ['summarize', 'entry', '--project', f.configPath], {
    cwd: f.root, checkout: f.root, input, investigator: agent,
    stdout: text => { if (reported && !started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nsummarize other\n')); } },
    stderr: text => { stderr += text; }, sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  input.end(); assert.equal(code, 130);
  const usage = batches.at(-1)!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  assert.equal(usage.attempts.length, reported ? 2 : 1);
  for (const attempt of usage.attempts) assert.ok(stderr.includes(`Attempt ${attempt.attempt} (${attempt.termination}) reported usage: 1 calls; ${reported ? 0 : 1} unknown; 0 anomalous.`));
  assert.ok(stderr.includes(`Session reported usage: ${reported ? 2 : 1} calls; ${reported ? 0 : 1} unknown; 0 anomalous.`));
  if (reported) { assert.match(stderr, /input 20 tokens/); assert.match(stderr, /input 40 tokens/); }
  assert.doesNotMatch(stderr, /\n\n/);
});


for (const format of ['json', 'unicode'] as const) test(`CLI seals authoritative usage in the worker-to-parent closing window (${format})`, async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  const callbacks: ((value: ReportedUsage) => void)[] = [];
  const agent = new ScriptedContributionAgent([
    (item, _signal, report) => { callbacks.push(report); report(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(item) }] }; },
    (item, _signal, report) => { callbacks.push(report); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(item) }] }; },
    (item, _signal, report) => { callbacks.push(report); return { kind: 'submit', contribution: proseContribution(item) }; },
  ]);
  let closingWindows = 0, workerMissing: number | undefined, started = false, stdout = '';
  const arrangementKeys = new Map<RecordId, RecordId>();
  const emit = Worker.prototype.emit;
  // Interpose only on delivery of the real worker's close message: its domain
  // ledger is already closed, but the parent dialogue is still accepting reports.
  t.mock.method(Worker.prototype, 'emit', function(this: Worker, event: string | symbol, ...args: unknown[]) {
    const message = args[0] as WorkerReply | undefined;
    const closing = event === 'message' && message?.type === 'agent-close';
    if (closing) {
      closingWindows++;
      callbacks[0]!(syntheticUsage); // Existing report, not another charged call.
      callbacks[1]!(syntheticUsage); callbacks[1]!(syntheticUsage);
    }
    if (event === 'message' && message?.type === 'reply' && message.result?.kind === 'view' && message.result.view.schema === 'postcode-contribution-view/1-experimental'
      && message.result.view.projection.lens === 'summarize') workerMissing = message.result.view.usage.missingCalls;
    if (event === 'message' && message?.type === 'reply' && message.result?.kind === 'view' && message.result.investigationArrangementKey) {
      arrangementKeys.set(message.result.view.projection.id, message.result.investigationArrangementKey);
    }
    const delivered = Reflect.apply(emit, this, [event, ...args]) as boolean;
    if (closing) {
      callbacks[2]!(syntheticUsage); // First report after closure must remain unknown.
      callbacks[0]!({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value: 999, includedIn: null }] });
    }
    return delivered;
  });
  const batches: ObservationBatch[] = [];
  const code = await runCli(['shell', '--project', f.configPath, ...(format === 'json' ? ['--json'] : [])], {
    cwd: f.root, checkout: f.root, input, investigator: agent, stderr: () => {},
    stdout: text => { stdout += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nusage\n')); } },
    sink: { async submit(batch) { batches.push(batch); if (batches.length === 2) input.end(); return { accepted: true }; } },
  });
  assert.equal(code, 0); assert.equal(closingWindows, 1); assert.equal(agent.closes, 1);
  assert.equal(workerMissing, 2, 'the closing-window report was absent from the worker snapshot');
  assert.equal(batches.length, 2);
  let first: InvestigationUsageReport | undefined;
  for (const batch of batches) {
    const data = batch.records.find(item => item.kind === 'qualified-view' || item.kind === 'usage-report')!.value as InvestigationView | UsageReport;
    const observed = batch.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
    const rendered = batch.records.find(item => item.kind === 'rendered-output')!.value as string;
    assert.deepEqual(data.usage, observed);
    if (first) assert.deepEqual(data.usage, first); else first = data.usage;
    assert.equal(data.usage.calls, 3); assert.equal(data.usage.missingCalls, 1); assert.equal(data.usage.anomalousCalls, 0);
    assert.equal(data.usage.totals[0]!.categories.find(item => item.category === 'input')!.value, 40);
    assert.deepEqual(data.usage.attempts[0]!.usage.map(call => call.reports.length), [1, 1, 0]);
    if (data.schema === 'postcode-contribution-view/1-experimental') {
      assert.deepEqual(finalizeInvestigationUsage(data, data.usage, arrangementKeys.get(data.projection.id)!, presentationMethods.contributionPresentation), data, 'finalization is idempotent');
      const different = finalizeInvestigationUsage(data, { ...data.usage, missingCalls: 2 }, arrangementKeys.get(data.projection.id)!, presentationMethods.contributionPresentation);
      assert.equal(different.projection.id, data.projection.id); assert.notEqual(different.id, data.id);
    } else {
      assert.deepEqual(finalizeRequestReport(data, data.usage), data);
      assert.equal('projection' in data, false);
      assert.ok(!batch.events.some(item => item.type === 'view-produced'));
    }
    assert.ok(stdout.includes(rendered));
    if (format === 'json') assert.deepEqual(JSON.parse(rendered).usage, observed);
    else { assert.match(rendered, /Session reported usage: 3 calls; 1 unknown; 0 anomalous/); assert.match(rendered, /input 40 tokens/); }
  }
});


for (const failure of ['throw', 'interrupt'] as const) test(`selection ${failure} closes the shell and preserves only prior accepted usage`, { timeout: 15000 }, async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  t.after(() => input.destroy());
  const agent = summaryAgent(), batches: ObservationBatch[] = [];
  let selections = 0, started = false, output = '', errors = '', owner: Worker | undefined;
  let held: Extract<WorkerRequest, { type: 'agent-selected' }> | undefined;
  const post = Worker.prototype.postMessage;
  t.mock.method(Worker.prototype, 'postMessage', function(this: Worker, message: WorkerRequest) {
    owner = this;
    if (failure === 'interrupt' && message.type === 'agent-selected' && selections === 2) {
      held = message;
      setImmediate(() => process.emit('SIGINT'));
      return; // The worker is waiting for identity; no second dialogue has opened.
    }
    return Reflect.apply(post, this, [message]);
  });
  const code = await runCli(['shell', '--project', f.configPath, '--json'], {
    cwd: f.root, checkout: f.root, input, investigator: agent,
    selectInvestigator: () => { if (++selections === 2 && failure === 'throw') throw new Error('Controlled selector failure'); return agent; },
    stdout: text => { output += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nsummarize other\nusage\n')); } },
    stderr: text => { errors += text; },
    sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  assert.equal(code, failure === 'throw' ? 1 : 130);
  assert.match(errors, failure === 'throw' ? /Internal failure: Controlled selector failure/ : /interrupted/i);
  assert.equal(selections, 2); assert.equal(owner!.threadId, -1, 'the worker has exited before runCli returns');
  assert.equal(agent.inputs.length, 1); assert.equal(agent.closes, 1);
  assert.equal(batches.length, 2, 'queued usage command is not executed after session closure');
  assert.equal(output.match(/postcode> /g)!.length, 2, 'no prompt follows the failed selection');
  assert.ok(!batches[1]!.records.some(item => item.kind === 'qualified-view'));
  const prior = batches[0]!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  const final = batches[1]!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  assert.equal(prior.calls, 2); assert.equal(prior.attempts.length, 1);
  assert.deepEqual(final, prior, 'selection failure does not invent an attempt, usage report or charge');
  if (held) {
    Reflect.apply(post, owner, [held]); // Late reply to a terminated worker cannot publish.
    owner!.emit('message', { type: 'agent-select', operation: held.operation, id: held.id, request: agent.inputs[0]![0]!.request as unknown as Extract<WorkerReply, { type: 'agent-select' }>['request'] } satisfies WorkerReply);
    assert.equal(selections, 2); assert.equal(agent.inputs.length, 1); assert.equal(batches.length, 2);
  }
});


for (const field of ['operation', 'id'] as const) test(`worker ignores an agent-selected reply with stale ${field}`, { timeout: 15000 }, async t => {
  const f = fixture(t), agent = summaryAgent(), batches: ObservationBatch[] = [];
  let injected = 0;
  const post = Worker.prototype.postMessage;
  t.mock.method(Worker.prototype, 'postMessage', function(this: Worker, message: WorkerRequest) {
    if (message.type === 'agent-selected' && message.identity) {
      injected++;
      Reflect.apply(post, this, [{ ...message, [field]: message[field] - 1,
        identity: { ...message.identity, provider: 'stale-selection-must-not-be-used' } }]);
    }
    // FIFO delivery puts the stale reply first, without a timing-based assertion.
    return Reflect.apply(post, this, [message]);
  });
  const code = await runCli(['summarize', 'entry', '--project', f.configPath, '--json'], {
    cwd: f.root, checkout: f.root, investigator: agent, selectInvestigator: () => agent,
    stdout: () => {}, stderr: () => {}, sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  assert.equal(code, 0); assert.equal(injected, 1); assert.equal(agent.closes, 1);
  const result = batches[0]!.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
  assert.equal(result.reporting!.contribution!.outcome.kind, 'accepted');
  assert.deepEqual(result.rows[0]!.producer.agent, agent.identity);
  assert.deepEqual(result.usage.attempts[0]!.agent, agent.identity);
  assert.equal(result.usage.calls, 2);
  assert.ok(result.usage.attempts[0]!.usage.every(call => call.agent.provider === agent.identity.provider));
});

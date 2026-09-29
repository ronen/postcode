import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { temporaryDirectory, interactionDriver } from './cli-helpers.js';
import { ScriptedInvestigator, syntheticUsage } from './investigator-double.js';
import { openSession } from '../src/lib/session.js';
import { runCli } from '../src/lib/cli.js';
import type { EvidenceResponse } from '../src/lib/evidence-access.js';
import type { SubmittedInvestigram, AgentReply, InvestigatorAgent } from '../src/lib/investigation/contracts.js';
import type { InvestigationView } from '../src/lib/investigation/presentation.js';
import type { InvestigationUsageReport } from '../src/lib/investigation/reporting.js';
import type { ObservationBatch } from '../src/lib/observations.js';
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
function draft(subject: RecordId, evidence: readonly RecordId[] = [], localId = 'root'): SubmittedInvestigram {
  return { localId, prose: 'Returns seven.\u001b[31m', referent: { description: 'The selected function.', subjects: [subject] },
    qualifications: ['Interpretation of captured source.'], evidence, associations: [], children: [], corrections: [], inconsistencies: [] };
}
function summaryAgent() {
  return new ScriptedInvestigator([
    (input, _signal, usage) => { usage(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] }; },
    (input, _signal, usage) => { usage(syntheticUsage); const response = input.responses[0] as EvidenceResponse;
      return { kind: 'submit', result: { ...draft(input.request.subject, response.selected), children: [draft(input.request.subject, [], 'child')] } }; },
  ]);
}
const summary = { lens: 'summarize' as const, selector: 'entry', presentation: { format: 'json' as const, sourceDetail: false } };
function view(result: { view: { schema: string } }): InvestigationView {
  assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
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

test('operation retention is independent of presentation and exact inspection preserves original composition', async t => {
  const agent = summaryAgent(), f = await session(t, agent);
  const first = view(await f.session.execute(summary));
  assert.equal(first.result!.reused, false);
  assert.equal(first.accounts.length, 2);
  assert.equal(first.usage.calls, 2);
  assert.deepEqual(first.support[0]!.exposures, [{ provenance: first.accounts[0]!.provenance, forms: ['full'] }]);
  const repeated = view(await f.session.execute({ ...summary, presentation: { format: 'unicode', sourceDetail: false } }));
  assert.equal(repeated.result!.reused, true);
  assert.deepEqual(repeated.accounts, first.accounts);
  assert.equal(agent.inputs.length, 1);
  assert.equal(repeated.usage.calls, 2);
  const reference = first.references.find(item => item.id === first.accounts[0]!.id)!.reference;
  const inspected = view(await f.session.execute({ lens: 'inspect', selector: reference, reference: true, presentation: { format: 'json', sourceDetail: true } }));
  assert.deepEqual(inspected.accounts, first.accounts);
  assert.ok(inspected.sourceDetail!.items.some(item => item.kind === 'source-evidence'));
  assert.equal(agent.inputs.length, 1);
  const missing = view(await f.session.execute({ lens: 'inspect', selector: 'investigram-unknown', reference: true, presentation: summary.presentation }));
  assert.equal(missing.projection.selection.status, 'missing');
  const direct = await f.session.evaluateInvestigation(first.result!.request);
  assert.equal(direct.reused, true, 'operation reuse does not depend on a lens');
});

test('successive operation evaluations atomically retain corrections and supply earlier retained context', async t => {
  let initial: InvestigationView;
  let count = 0;
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open() {
    if (++count === 1) return summaryAgent().open();
    return new ScriptedInvestigator([input => {
      const prior = input.responses[0];
      assert.ok(prior && 'accounts' in prior);
      assert.equal(prior.accounts[0]!.id, input.request.subject);
      const module = initial.selected[0]!;
      return { kind: 'submit', result: { ...draft(module), corrections: [{ target: input.request.subject,
        correctedSubjects: [module], reason: 'Clarifies the returned value.', qualifications: ['A more precise interpretation.'], evidence: [input.request.subject],
        replacement: { ...draft(module, [], 'replacement'), prose: 'Returns the number seven.' } }] } };
    }]).open();
  } };
  const f = await session(t, agent);
  initial = view(await f.session.execute(summary));
  const root = initial.accounts[0]!.id;
  const later = await f.session.evaluateInvestigation({ operation: 'clarification', subject: root, parameters: {} });
  assert.equal(later.evaluation!.outcome.kind, 'accepted');
  const reference = initial.references.find(item => item.id === root)!.reference;
  const inspected = view(await f.session.execute({ lens: 'inspect', selector: reference, reference: true, presentation: summary.presentation }));
  assert.deepEqual(inspected.accounts, initial.accounts, 'retention cannot rewrite an earlier tree');
  assert.equal(inspected.corrections.length, 1);
  assert.deepEqual(inspected.support.find(item => item.id === root)!.exposures, [{ provenance: inspected.corrections[0]!.provenance, forms: ['prior-interpretation'] }]);
  const replacement = inspected.references.find(item => item.id === inspected.corrections[0]!.replacement)!.reference;
  const replacementView = view(await f.session.execute({ lens: 'inspect', selector: replacement, reference: true, presentation: summary.presentation }));
  assert.equal(replacementView.accounts[0]!.prose, 'Returns the number seven.');
  assert.ok(replacementView.provenance[0]!.completeTargets.includes(root));
  const repeated = view(await f.session.execute(summary));
  assert.equal(repeated.result!.reused, true);
  assert.deepEqual(repeated.accounts, initial.accounts, 'replacement substitution is later milestone work');
  assert.equal(count, 2);
});

for (const kind of ['refused', 'truncated', 'communication-failure', 'configuration-unavailable'] as const) {
  test(`session applies retention policy to ${kind} with attempt usage preserved`, async t => {
    const agent = new ScriptedInvestigator([(_input, _signal, usage): AgentReply => {
      usage(syntheticUsage);
      return kind === 'communication-failure' || kind === 'configuration-unavailable' ? { kind, code: 'controlled', diagnostic: 'Controlled failure.' } : { kind };
    }]);
    const f = await session(t, agent);
    const first = view(await f.session.execute(summary));
    const second = view(await f.session.execute(summary));
    const retained = kind === 'refused' || kind === 'truncated';
    assert.equal(second.result!.reused, retained);
    assert.equal(agent.inputs.length, retained ? 1 : 2);
    assert.equal(second.usage.calls, retained ? 1 : 2);
    assert.equal(first.accounts.length, 0);
    assert.equal(first.result!.attempt, first.usage.attempts[0]!.attempt);
    assert.equal(second.result!.attempt, second.usage.attempts.at(-1)!.attempt);
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
        const data = batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
        if (batches.length === 1) { assert.equal(data.accounts.length, 2); rootReference = data.references.find(item => item.id === data.accounts[0]!.id)!.reference; input.write('summarize entry\n'); }
        else if (batches.length === 2) { assert.equal(data.result!.reused, true); input.write(`inspect @${data.references.find(item => item.id === data.accounts[1]!.id)!.reference}\n`); }
        else if (batches.length === 3) { assert.equal(data.accounts.length, 1); input.write(`inspect @${rootReference} --source-detail\n`); }
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
  assert.ok(batches.filter((_, index) => index !== 3).every(batch => !batch.events.some(item => item.type === 'source-escape')), 'investigator source reads are not human source disclosure');
  assert.ok(batches[3]!.events.some(item => item.type === 'source-escape' && item.sourceLevel === 'investigation-support'));
  assert.ok(output.includes('postcode-investigation-view/1-experimental'));
});

test('one-shot summary discloses expiring references, source inspection is escaped, and unconfigured requests fail explicitly', async t => {
  const f = fixture(t);
  let stdout = '', stderr = '';
  const batches: ObservationBatch[] = [];
  const environment = { cwd: f.root, checkout: f.root, stdout: (text: string) => { stdout += text; }, stderr: (text: string) => { stderr += text; },
    sink: { async submit(batch: ObservationBatch) { batches.push(batch); return { accepted: true as const }; } } };
  assert.equal(await runCli(['summarize', 'entry', '--project', f.configPath], { ...environment, investigator: summaryAgent() }), 0, stderr);
  assert.match(stdout, /References expire/);
  assert.doesNotMatch(stdout, /\u001b/);
  assert.ok(stdout.includes('synthetic'));
  stdout = '';
  assert.equal(await runCli(['summarize', 'entry', '--project', f.configPath, '--json'], environment), 3);
  assert.equal(JSON.parse(stdout).result.unavailable.kind, 'configuration-unavailable');
  assert.equal(batches.at(-1)!.events.at(-1)!.type, 'command-failed');
});

test('worker interruption aborts the dialogue and preserves received usage and exposure in final observations', async t => {
  const f = fixture(t);
  let aborted = false, closed = 0, calls = 0, stderr = '';
  const batches: ObservationBatch[] = [];
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open: () => ({
    exchange: async (input, signal, report) => {
      report(syntheticUsage);
      if (++calls === 1) return { kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] };
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
  const agent = new ScriptedInvestigator([(input, _signal, usage) => {
    usage(syntheticUsage); writeFileSync(f.source, 'export function entry() { return 8; }');
    return { kind: 'submit', result: draft(input.request.subject) };
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
  const agent = new ScriptedInvestigator([item => ({ kind: 'tools', requests: [{ kind: 'source', subject: item.request.subject }] })]);
  const views: InvestigationView[] = []; let started = false;
  const code = await runCli(['shell', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, input, investigator: agent,
    investigationBounds: { ...investigationBounds, calls: 1 }, stderr: () => {},
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nsummarize entry\n')); } },
    sink: { async submit(batch) { views.push(batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView); if (views.length === 2) input.end(); return { accepted: true }; } } });
  assert.equal(code, 0);
  assert.equal(views[0]!.result!.evaluation!.outcome.kind, 'limit-stop');
  assert.equal(views[1]!.result!.reused, true);
  assert.equal(agent.inputs.length, 1);
});

test('selection failures and cross-session investigram references cannot start generation', async t => {
  const f = fixture(t);
  writeFileSync(path.join(f.root, 'other.ts'), "declare module 'entry' { export const value: number; }");
  const agent = summaryAgent();
  const opened = await openSession({ configPath: f.configPath }, { investigation: { agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  t.after(() => opened.session.close());
  const ambiguous = view(await opened.session.execute(summary));
  assert.equal(ambiguous.projection.selection.status, 'ambiguous');
  assert.equal(ambiguous.candidates.length, 2);
  assert.equal(agent.inputs.length, 0);
  const selected = view(await opened.session.execute({ ...summary, selector: ambiguous.candidates[0]!.reference, reference: true }));
  assert.equal(selected.accounts.length, 2);
  const fresh = await session(t, summaryAgent());
  const foreign = view(await fresh.session.execute({ lens: 'inspect', selector: selected.references[0]!.reference, reference: true, presentation: summary.presentation }));
  assert.equal(foreign.projection.selection.status, 'missing');
});

test('session usage keeps unknown and anomalous calls distinct and does not fail on aggregate overflow', async t => {
  const agent = new ScriptedInvestigator([
    (input, _signal, usage) => { usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value: Number.MAX_VALUE, includedIn: null }] }); return { kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] }; },
    (input, _signal, usage) => { usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value: Number.MAX_VALUE, includedIn: null }] }); return { kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] }; },
    (input, _signal, usage) => { usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value: -1, includedIn: null }] }); return { kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] }; },
    input => ({ kind: 'submit', result: draft(input.request.subject) }),
  ]);
  const f = await session(t, agent);
  const result = view(await f.session.execute(summary));
  assert.equal(result.result!.evaluation!.outcome.kind, 'accepted');
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
      return { kind: 'submit', result: draft(input.request.subject) };
    }, close: () => { closes++; },
  }) };
  const code = await runCli(['summarize', 'entry', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, investigator: agent,
    investigationBounds: { ...investigationBounds, milliseconds: 1000 }, stdout: () => {}, stderr: () => {},
    sink: { async submit(batch) { batches.push(batch); late?.(); released?.(); return { accepted: true }; } } });
  assert.equal(code, 3); assert.equal(closes, 1);
  const data = batches[0]!.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
  assert.equal(data.result!.evaluation!.outcome.kind, 'limit-stop');
  assert.equal(data.accounts.length, 0);
  const usage = batches[0]!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  assert.equal(usage.calls, 1); assert.equal(usage.anomalousCalls, 0);
});

test('invalid submitted corrections retain only the failure and leave earlier accounts untouched', async t => {
  let root: RecordId;
  let calls = 0;
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open() {
    if (++calls === 1) return summaryAgent().open();
    return new ScriptedInvestigator([
      () => ({ kind: 'tools', requests: [{ kind: 'investigram', subject: root }] }),
      input => ({ kind: 'submit', result: { ...draft(input.request.subject), corrections: [{ target: root,
        correctedSubjects: [input.request.subject], reason: 'Controlled invalid tree.', qualifications: ['Interpretation.'], evidence: [],
        replacement: draft(input.request.subject) }] } }),
    ]).open();
  } };
  const f = await session(t, agent);
  const first = view(await f.session.execute(summary)); root = first.accounts[0]!.id;
  const failed = view(await f.session.execute({ ...summary, selector: 'other' }));
  assert.equal(failed.result!.evaluation!.outcome.kind, 'investigation-failure');
  assert.deepEqual(failed.result!.evaluation!.investigrams, []);
  assert.deepEqual(failed.result!.evaluation!.corrections, []);
  const repeated = view(await f.session.execute({ ...summary, selector: 'other' }));
  assert.equal(repeated.result!.reused, true); assert.equal(calls, 2);
  const inspected = view(await f.session.execute({ lens: 'inspect', selector: first.references.find(item => item.id === root)!.reference, reference: true, presentation: summary.presentation }));
  assert.deepEqual(inspected.accounts, first.accounts);
  assert.deepEqual(inspected.corrections, []);
});

test('shell retains accompanying corrections and makes original and replacement references inspectable', async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  let original: InvestigationView, originalReference: string, root: RecordId, module: RecordId, opened = 0, started = false;
  const views: InvestigationView[] = [];
  const driver = interactionDriver(() => input.end());
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open() {
    if (++opened === 1) return summaryAgent().open();
    return new ScriptedInvestigator([
      () => ({ kind: 'tools', requests: [{ kind: 'investigram', subject: root }] }),
      item => ({ kind: 'submit', result: { ...draft(item.request.subject), corrections: [{ target: root, correctedSubjects: [module],
        reason: 'Names the exact returned value.', qualifications: ['Revised interpretation.'], evidence: [root],
        replacement: { ...draft(module, [], 'replacement'), prose: 'Returns the number seven.' } }] } }),
    ]).open();
  } };
  const code = await runCli(['shell', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, input, investigator: agent,
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\n')); } }, stderr: () => {},
    sink: { async submit(batch) {
      const data = batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
      views.push(data);
      driver.run(() => {
        if (views.length === 1) {
          original = data; root = data.accounts[0]!.id; module = data.selected[0]!;
          originalReference = data.references.find(item => item.id === root)!.reference; input.write('summarize other\n');
        } else if (views.length === 2) {
          assert.equal(data.corrections.length, 1); assert.ok(data.provenance.some(item => item.completeTargets.includes(root)));
          input.write(`inspect @${originalReference}\n`);
        } else if (views.length === 3) {
          assert.deepEqual(data.accounts, original.accounts);
          input.write(`inspect @${data.references.find(item => item.id === data.corrections[0]!.replacement)!.reference}\n`);
        } else input.end();
      });
      return { accepted: true };
    } },
  });
  driver.verify(); assert.equal(code, 0); assert.equal(opened, 2);
  assert.equal(views[3]!.accounts[0]!.prose, 'Returns the number seven.');
  assert.ok(views[3]!.accounts[0]!.associations.some(item => item.role === 'corrected-subject' && item.subject === module));
});

test('non-finite usage reports remain distinguishable after JSON serialization', async t => {
  const f = await session(t, new ScriptedInvestigator([(input, _signal, usage) => {
    for (const value of [NaN, Infinity, -Infinity]) usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', includedIn: null, value }] });
    return { kind: 'submit', result: draft(input.request.subject) };
  }]));
  const result = view(await f.session.execute(summary));
  const json = JSON.parse(JSON.stringify(result.usage)) as InvestigationUsageReport;
  assert.deepEqual(json.nonFiniteReports.map(item => item.value), ['NaN', 'Infinity', '-Infinity']);
  assert.equal(json.anomalousCalls, 1); assert.deepEqual(json.totals, []);
});

test('the worker bridge preserves an absent malformed reply for retained domain failure', async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  const agent = new ScriptedInvestigator([() => undefined as unknown as AgentReply]);
  let started = false; const views: InvestigationView[] = [];
  const code = await runCli(['shell', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, input, investigator: agent,
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nsummarize entry\n')); } }, stderr: () => {},
    sink: { async submit(batch) { views.push(batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView); if (views.length === 2) input.end(); return { accepted: true }; } } });
  assert.equal(code, 0);
  assert.deepEqual(views[0]!.result!.evaluation!.outcome, { kind: 'investigation-failure', reason: 'Missing agent exchange.' });
  assert.equal(views[1]!.result!.reused, true); assert.equal(agent.inputs.length, 1); assert.equal(agent.closes, 1);
});

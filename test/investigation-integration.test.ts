import { InvestigatorReferences } from '../src/lib/investigation/openai/references.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { Worker } from 'node:worker_threads';
import type { WorkerReply, WorkerRequest } from '../src/lib/session-protocol.js';
import { temporaryDirectory, interactionDriver } from './cli-helpers.js';
import { ScriptedInvestigator, syntheticUsage } from './investigator-double.js';
import { openSession } from '../src/lib/session.js';
import { runCli } from '../src/lib/cli.js';
import type { EvidenceResponse } from '../src/lib/evidence-access.js';
import type { SubmittedInvestigram, AgentReply, InvestigatorAgent, ReportedUsage } from '../src/lib/investigation/contracts.js';
import { finalizeInvestigationUsage, renderInvestigationView } from '../src/lib/investigation/presentation.js';
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
  const human = renderInvestigationView({ ...inspected, presentation: { format: 'unicode', sourceDetail: false } });
  const correctionText = human.slice(human.indexOf('Correction reported by'), human.indexOf('  Support'));
  assert.ok(correctionText.includes(`Corrected subjects: ${initial.selected[0]}`));
  assert.ok(correctionText.includes(`Evidence: ${root}`));
  assert.deepEqual(inspected.support.find(item => item.id === root)!.exposures, [{ provenance: inspected.corrections[0]!.provenance, forms: ['prior-interpretation'] }]);
  const replacement = inspected.references.find(item => item.id === inspected.corrections[0]!.replacement)!.reference;
  const replacementView = view(await f.session.execute({ lens: 'inspect', selector: replacement, reference: true, presentation: summary.presentation }));
  assert.equal(replacementView.accounts[0]!.prose, 'Returns the number seven.');
  assert.ok(replacementView.provenance[0]!.completeTargets.includes(root));
  const repeated = view(await f.session.execute(summary));
  assert.equal(repeated.result!.reused, true);
  assert.equal(repeated.accounts[0]!.id, inspected.corrections[0]!.replacement);
  assert.equal(repeated.display[0]!.original, root);
  assert.deepEqual(initial.accounts.map(item => item.id), [root, ...initial.accounts[0]!.children]);
  assert.notEqual(repeated.projection.id, initial.projection.id);
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
          assert.equal(data.corrections.length, 1);
          const human = renderInvestigationView({ ...data, presentation: { format: 'unicode', sourceDetail: false } });
          assert.ok(human.includes(`Corrected subjects: ${module}`)); assert.ok(human.includes(`Evidence: ${root}`));
          assert.ok(data.provenance.some(item => item.completeTargets.includes(root)));
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

for (const shell of [false, true]) test(`usage arriving after a reply remains attributable until dialogue close (${shell ? 'shell' : 'one-shot'})`, async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  let reportFirst: (() => void) | undefined, started = false;
  const agent = new ScriptedInvestigator([
    (item, _signal, report) => { reportFirst = () => report(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: item.request.subject }] }; },
    (item, _signal, report) => { reportFirst!(); report(syntheticUsage); return { kind: 'submit', result: draft(item.request.subject) }; },
  ]);
  const batches: ObservationBatch[] = [];
  const code = await runCli(shell ? ['shell', '--project', f.configPath, '--json'] : ['summarize', 'entry', '--project', f.configPath, '--json'], {
    cwd: f.root, checkout: f.root, input, investigator: agent, stderr: () => {},
    stdout: text => { if (shell && !started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\nusage\n')); } },
    sink: { async submit(batch) { batches.push(batch); if (batches.length === 2) input.end(); return { accepted: true }; } },
  });
  assert.equal(code, 0);
  for (const batch of batches) {
    const data = batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
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
      const data = batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
      if (batches.length === 1) reference = data.references[0]!.reference;
      else { assert.equal(data.projection.selection.status, 'unsupported-subject-lens'); assert.equal(data.unsupportedSubject, 'investigram'); assert.equal(data.result, null); assert.equal(data.accounts.length, 0); }
      const command = commands[batches.length - 1];
      if (command) input.write(`${command} @${reference}\n`); else input.end();
    }); return { accepted: true }; } },
  });
  driver.verify(); assert.equal(code, 0); assert.equal(agent.inputs.length, 1);
  assert.equal(batches.length, 4); assert.match(output, /unsupported subject\/lens combination/);
  assert.ok(batches.slice(1).every(batch => batch.events.at(-1)!.type === 'command-failed'));
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
      if (reported && attempt === 1) return { kind: 'submit', result: draft(item.request.subject) };
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
  const agent = new ScriptedInvestigator([
    (item, _signal, report) => { callbacks.push(report); report(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: item.request.subject }] }; },
    (item, _signal, report) => { callbacks.push(report); return { kind: 'tools', requests: [{ kind: 'source', subject: item.request.subject }] }; },
    (item, _signal, report) => { callbacks.push(report); return { kind: 'submit', result: draft(item.request.subject) }; },
  ]);
  let closingWindows = 0, workerMissing: number | undefined, started = false, stdout = '';
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
    if (event === 'message' && message?.type === 'reply' && message.result?.view.schema === 'postcode-investigation-view/1-experimental'
      && message.result.view.projection.lens === 'summarize') workerMissing = message.result.view.usage.missingCalls;
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
    const data = batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
    const observed = batch.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
    const rendered = batch.records.find(item => item.kind === 'rendered-output')!.value as string;
    assert.deepEqual(data.usage, observed);
    if (first) assert.deepEqual(data.usage, first); else first = data.usage;
    assert.equal(data.usage.calls, 3); assert.equal(data.usage.missingCalls, 1); assert.equal(data.usage.anomalousCalls, 0);
    assert.equal(data.usage.totals[0]!.categories.find(item => item.category === 'input')!.value, 40);
    assert.deepEqual(data.usage.attempts[0]!.usage.map(call => call.reports.length), [1, 1, 0]);
    assert.deepEqual(finalizeInvestigationUsage(data, data.usage), data, 'finalization is idempotent');
    const different = finalizeInvestigationUsage(data, { ...data.usage, missingCalls: 2 });
    assert.equal(different.projection.id, data.projection.id); assert.notEqual(different.id, data.id);
    assert.ok(stdout.includes(rendered));
    if (format === 'json') assert.deepEqual(JSON.parse(rendered).usage, observed);
    else { assert.match(rendered, /Session reported usage: 3 calls; 1 unknown; 0 anomalous/); assert.match(rendered, /input 40 tokens/); }
  }
});

for (const format of ['json', 'unicode'] as const) test(`progressive worker lenses navigate retained context, correct originals and preserve per-evaluation origin (${format})`, async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true });
  let initial!: InvestigationView, last: InvestigationView, module: RecordId, rootReference = '', childReference = '', followupReference = '';
  const scripted = summaryAgent();
  let listingOnly: RecordId[] = [];
  const followup = new ScriptedInvestigator([
    item => {
      const prior = item.responses[0]; assert.ok(prior && 'accounts' in prior);
      assert.equal(prior.accounts[0]!.id, item.request.subject);
      assert.equal(prior.accounts[0]!.provenance.agent.origin, item.request.operation === 'decomposition' ? 'scripted' : 'hosted');
      module = prior.accounts[0]!.originatingModule;
      return { kind: 'tools', requests: [{ kind: 'investigations', subject: module }, { kind: 'source', subject: module }] };
    }, item => {
      const listing = item.responses[0]; assert.ok(listing && 'accounts' in listing && listing.listing);
      assert.equal(listing.accounts.length, 0, 'listing handles do not disclose content');
      listingOnly = [...listing.listing.selected];
      if (item.request.operation === 'examination') return { kind: 'tools', requests: [{ kind: 'investigram', subject: listing.listing.selected[0]! }] };
      return { kind: 'submit', result: { ...draft(module), prose: item.request.operation === 'decomposition' ? 'Two overlapping views of the selected behavior.' : 'No useful additional detail established.',
        qualifications: ['These aspects overlap and are not exhaustive.'], children: item.request.operation === 'decomposition' ? [draft(module, [], 'part')] : [] } };
    }, item => {
      const context = item.responses[0]; assert.ok(context && 'accounts' in context);
      assert.equal(context.accounts[0]!.id, initial.accounts[0]!.id);
      return { kind: 'submit', result: { ...draft(module), prose: 'A more precise account accompanies this examination.', corrections: [{ target: context.accounts[0]!.id,
        correctedSubjects: [module], reason: 'The earlier wording lacked numeric precision.', qualifications: ['Controlled correction exercise.'], evidence: [context.accounts[0]!.id],
        replacement: { ...draft(module, [], 'replacement'), prose: 'Returns the number seven.' } }] } };
    },
  ]);
  const liveDouble: InvestigatorAgent = { identity: { ...followup.identity, provider: 'offline-follow-up-double', origin: 'hosted' }, open: () => followup.open() };
  const selectedOperations: string[] = [], batches: ObservationBatch[] = [];
  let started = false, output = '';
  const driver = interactionDriver(() => input.end());
  const code = await runCli(['shell', '--project', f.configPath, ...(format === 'json' ? ['--json'] : [])], {
    cwd: f.root, checkout: f.root, input, investigator: liveDouble,
    selectInvestigator: request => { selectedOperations.push(request.operation); return request.operation === 'functionality' ? scripted : liveDouble; },
    stdout: text => { output += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\n')); } }, stderr: () => {},
    sink: { async submit(batch) {
      batches.push(batch); driver.run(() => {
        const observedView = batch.records.find(item => item.kind === 'qualified-view');
        assert.ok(observedView, JSON.stringify(batch));
        const data = observedView.value as InvestigationView;
        const ref = (id: RecordId) => data.references.find(item => item.id === id)!.reference;
        switch (batches.length) {
          case 1: initial = data; module = data.selected[0]!; rootReference = ref(data.accounts[0]!.id); childReference = ref(data.accounts[1]!.id); input.write(`decompose @${childReference}\n`); break;
          case 2:
            assert.equal(data.result!.request.operation, 'decomposition');
            assert.equal(data.provenance[0]!.request.subject, initial.accounts[1]!.id);
            assert.equal(data.provenance[0]!.citations.includes(initial.accounts[0]!.id), false, 'association availability is not exposure');
            assert.ok(listingOnly.includes(initial.accounts[0]!.id));
            followupReference = ref(data.accounts[1]!.id); input.write(`explain @${followupReference}\n`); break;
          case 3: input.write(`examine @${ref(data.accounts[0]!.id)}\n`); break;
          case 4:
            last = data; assert.equal(data.corrections.length, 1);
            assert.ok(data.provenance[0]!.completeTargets.includes(initial.accounts[0]!.id));
            input.write(`examine @${ref(data.selected[0]!)}\n`); break;
          case 5: assert.equal(data.result!.reused, true); assert.deepEqual(data.accounts, last.accounts); input.write(`inspect @${rootReference} --source-detail\n`); break;
          case 6:
            assert.deepEqual(data.accounts, initial.accounts); assert.equal(data.corrections.length, 1);
            assert.ok(data.sourceDetail!.items.length); input.write('inspect entry\n'); break;
          case 7: {
            const listing = (data as unknown as { investigations: import('../src/lib/investigation/associations.js').AssociatedInvestigations }).investigations;
            assert.ok(listing.items.some(item => item.id === initial.accounts[0]!.id));
            assert.ok(listing.items.some(item => item.detail!.associations.some(item => item.role === 'corrected-subject')));
            input.write('usage\n'); break;
          }
          default: input.end();
        }
      }); return { accepted: true };
    } },
  });
  driver.verify(); assert.equal(code, 0);
  assert.deepEqual(selectedOperations, ['functionality', 'decomposition', 'clarification', 'examination']);
  assert.equal(scripted.closes, 1); assert.equal(followup.closes, 3);
  for (const dialogue of followup.inputs) {
    const refs = new InvestigatorReferences();
    for (const item of dialogue) assert.equal(JSON.stringify(refs.encode(item)).includes(initial.projection.session), false, 'real context and association listings cannot leak canonical references');
    refs.close();
  }
  assert.equal(batches.length, 8);
  assert.ok(batches.every((batch, index) => index === 5 || !batch.events.some(item => item.type === 'source-escape')));
  assert.match(output, format === 'unicode' ? /Investigation subject: .*provenance, not composition/ : /"navigation"/);
  const usages = batches.at(-1)!.records.find(item => item.kind === 'investigation-usage')!.value as InvestigationUsageReport;
  assert.deepEqual(usages.attempts.map(item => item.agent.origin), ['scripted', 'hosted', 'hosted', 'hosted']);
});

test('associated inspection is bounded, navigable and independent of incidental module context', async t => {
  const agent = new ScriptedInvestigator([item => ({ kind: 'submit', result: { ...draft(item.request.subject),
    children: Array.from({ length: 30 }, (_, i) => ({ ...draft(item.request.subject, [], `part-${i}`),
      associations: [{ subject: item.request.subject, qualifications: ['Explicitly described.'], evidence: [] }] })) } })]);
  const f = await session(t, agent);
  const before = await f.session.execute({ ...summary, lens: 'inspect' });
  assert.equal('investigations' in before.view && before.view.investigations?.total, 0);
  const original = JSON.stringify(before.view);
  const generated = view(await f.session.execute(summary));
  const first = await f.session.execute({ ...summary, lens: 'inspect' });
  assert.ok('investigations' in first.view && first.view.investigations);
  assert.equal(first.view.investigations.total, 31); assert.equal(first.view.investigations.items.length, 24);
  const second = await f.session.execute({ ...summary, lens: 'inspect', after: first.view.investigations.next! });
  assert.ok('investigations' in second.view && second.view.investigations);
  assert.equal(second.view.investigations.items.length, 7); assert.equal(second.view.investigations.next, null);
  assert.equal(new Set([...first.view.investigations.items, ...second.view.investigations.items].map(item => item.id)).size, 31);
  assert.equal(JSON.stringify(before.view), original); assert.notEqual(before.view.projection.id, first.view.projection.id);
  const invalid = await f.session.execute({ ...summary, lens: 'inspect', after: 'investigram-00000000' });
  const otherInvalid = await f.session.execute({ ...summary, lens: 'inspect', after: 'investigram-11111111' });
  const invalidAgain = await f.session.execute({ ...summary, lens: 'inspect', after: 'investigram-00000000' });
  assert.equal(invalid.failed, true); assert.equal(otherInvalid.failed, true);
  assert.ok('investigations' in invalid.view && invalid.view.investigations);
  assert.equal(invalid.view.investigations.status, 'unknown-continuation');
  assert.equal(invalid.view.investigations.after, 'investigram-00000000');
  assert.notEqual(invalid.view.projection.id, otherInvalid.view.projection.id);
  assert.notEqual(invalid.view.id, otherInvalid.view.id);
  assert.equal(invalid.view.projection.id, invalidAgain.view.projection.id);
  assert.equal(invalid.view.id, invalidAgain.view.id);
  const humanInvalid = await f.session.execute({ ...summary, lens: 'inspect', after: 'investigram-00000000', presentation: { format: 'unicode', sourceDetail: false } });
  assert.match(humanInvalid.rendered, /continuation reference is not in this listing/);
  assert.match(humanInvalid.rendered, /without --after/);
  assert.equal(agent.inputs.length, 1);
  for (const lens of ['explain', 'decompose', 'examine'] as const) {
    const unsupported = view(await f.session.execute({ ...summary, lens, reference: true, selector: generated.candidates[0]!.reference }));
    assert.equal(unsupported.projection.selection.status, 'unsupported-subject-lens');
    assert.match(renderInvestigationView({ ...unsupported, presentation: { format: 'unicode', sourceDetail: false } }), /This reference identifies part of the program/);
    const missing = view(await f.session.execute({ ...summary, lens, reference: true, selector: 'investigram-00000000' }));
    assert.equal(missing.projection.selection.status, 'missing');
  }
  assert.equal(agent.inputs.length, 1);
});

test('all follow-up lenses consume each other and retain candid empty decomposition outcomes', async t => {
  const agent = new ScriptedInvestigator([item => {
    const prior = item.responses[0];
    const module = prior && 'accounts' in prior ? prior.accounts[0]!.originatingModule : item.request.subject;
    return { kind: 'submit', result: { ...draft(module), prose: 'No useful finer decomposition or additional finding established.' } };
  }]);
  const f = await session(t, agent);
  let current = view(await f.session.execute(summary));
  for (const first of ['explain', 'decompose', 'examine'] as const) for (const next of ['explain', 'decompose', 'examine'] as const) {
    for (const lens of [first, next]) {
      const subject = current.accounts[0]!;
      const selector = current.references.find(item => item.id === subject.id)!.reference;
      const request = { ...summary, lens, selector, reference: true };
      current = view(await f.session.execute(request));
      assert.equal(current.accounts.length, 1); assert.equal(current.provenance[0]!.request.subject, subject.id);
      assert.deepEqual(subject.children, []);
      const repeated = view(await f.session.execute(request));
      assert.equal(repeated.result!.reused, true); assert.deepEqual(repeated.accounts, current.accounts);
    }
  }
  assert.equal(agent.inputs.length, 19);
});

test('association discovery alone cannot authorize correcting an undelivered account', async t => {
  let module: RecordId;
  const followup = new ScriptedInvestigator([
    item => {
      const prior = item.responses[0]; assert.ok(prior && 'accounts' in prior); module = prior.accounts[0]!.originatingModule;
      return { kind: 'tools', requests: [{ kind: 'investigations', subject: module }] };
    }, item => {
      const listed = item.responses[0]; assert.ok(listed && 'accounts' in listed && listed.listing);
      return { kind: 'submit', result: { ...draft(module), corrections: [{ target: listed.listing.selected[0]!, correctedSubjects: [module],
        reason: 'Attempted without target content.', qualifications: ['Unverified.'], evidence: [], replacement: draft(module, [], 'replacement') }] } };
    },
  ]);
  let count = 0;
  const initialAgent = summaryAgent();
  const f = await session(t, { identity: initialAgent.identity, open: () => ++count === 1 ? initialAgent.open() : followup.open() });
  const initial = view(await f.session.execute(summary));
  const selector = initial.references.find(item => item.id === initial.accounts[1]!.id)!.reference;
  const result = view(await f.session.execute({ ...summary, lens: 'examine', selector, reference: true }));
  assert.equal(result.result!.evaluation!.outcome.kind, 'investigation-failure');
  assert.equal(result.accounts.length, 0);
  assert.deepEqual(view(await f.session.execute(summary)).accounts, initial.accounts);
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
    owner!.emit('message', { type: 'agent-select', operation: held.operation, id: held.id, request: prior.attempts[0]!.request } satisfies WorkerReply);
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
  assert.equal(result.result!.evaluation!.outcome.kind, 'accepted');
  assert.deepEqual(result.provenance[0]!.agent, agent.identity);
  assert.deepEqual(result.usage.attempts[0]!.agent, agent.identity);
  assert.equal(result.usage.calls, 2);
  assert.ok(result.usage.attempts[0]!.usage.every(call => call.agent.provider === agent.identity.provider));
});

test('revision lifecycle preserves exact subjects, displaced composition, conflicts, cause exemptions and immutable views', async t => {
  let next = summaryAgent(), calls = 0;
  const agent: InvestigatorAgent = { identity: next.identity, open() { calls++; return next.open(); } };
  const f = await session(t, agent);
  const initial = view(await f.session.execute(summary));
  const frozenInitial = JSON.stringify(initial);
  const module = initial.selected[0]!, a = initial.accounts[0]!.id, child = initial.accounts[0]!.children[0]!;
  const reference = (v: InvestigationView, id: RecordId) => v.references.find(item => item.id === id)!.reference;
  const execute = async (lens: 'explain' | 'examine' | 'decompose', subject: RecordId, prior: InvestigationView,
    result: SubmittedInvestigram, retrieve: RecordId[] = []) => {
    next = new ScriptedInvestigator([
      ...(retrieve.length ? [() => ({ kind: 'tools' as const, requests: retrieve.map(subject => ({ kind: 'investigram' as const, subject })) })] : []),
      () => ({ kind: 'submit', result }),
    ]);
    const out = view(await f.session.execute({ lens, selector: reference(prior, subject), reference: true, presentation: summary.presentation }));
    assert.equal(out.result?.evaluation?.outcome.kind, 'accepted', JSON.stringify(out.result));
    return out;
  };
  const correction = (target: RecordId, name: string, replacementChildren: SubmittedInvestigram[] = []) => ({ target, correctedSubjects: [module],
    reason: `Revision ${name}.`, qualifications: ['Source interpretation.'], evidence: [target],
    replacement: { ...draft(module, [], name), prose: name, children: replacementChildren } });
  const y = await execute('explain', a, initial, { ...draft(module), prose: 'Dependent Y.' });
  const yId = y.accounts[0]!.id;
  const z = await execute('decompose', yId, y, { ...draft(module), prose: 'Transitive Z.' });
  const zId = z.accounts[0]!.id;
  const correcting = await execute('examine', a, initial, { ...draft(module), children: [draft(module, [], 'report-child')],
    corrections: [correction(a, 'B', [draft(module, [], 'B-child')]), correction(child, 'old-child-replacement')] }, [child, yId]);
  assert.ok(correcting.revisions.every(item => !item.needsReconsideration), 'whole correcting evaluation is exempt even through Y');
  const b = correcting.corrections.find(item => item.target === a)!.replacement;
  const changed = view(await f.session.execute(summary));
  assert.equal(changed.accounts[0]!.id, b);
  assert.deepEqual(changed.display.map(item => item.account), [b, ...changed.accounts[0]!.children]);
  assert.ok(changed.displaced.includes(child));
  assert.ok(changed.corrections.some(item => item.target === child), 'correction in displaced subtree stays disclosed');
  assert.equal(JSON.stringify(initial), frozenInitial);
  const yAgain = view(await f.session.execute({ lens: 'explain', selector: reference(initial, a), reference: true, presentation: summary.presentation }));
  assert.equal(yAgain.result!.reused, true); assert.equal(yAgain.result!.request.subject, a);
  assert.equal(yAgain.revisions.find(item => item.original === yId)!.needsReconsideration, true);
  assert.equal(yAgain.revisions.find(item => item.original === yId)!.rows.filter(item => item.cause).length, 1, 'revised subject does not duplicate cause');
  const zAgain = view(await f.session.execute({ lens: 'inspect', selector: reference(z, zId), reference: true, presentation: summary.presentation }));
  assert.equal(zAgain.revisions[0]!.rows[0]!.cause!.direct, false);
  assert.match(renderInvestigationView({ ...zAgain, presentation: { format: 'unicode', sourceDetail: false } }), /Transitive cause/);
  const aware = await execute('examine', yId, y, { ...draft(module), children: [draft(module, [], 'aware-child')] });
  assert.ok(aware.accounts.every(item => !aware.revisions.find(status => status.original === item.id)!.needsReconsideration));
  assert.ok(aware.provenance[0]!.completeCorrections.includes(correcting.corrections.find(item => item.target === a)!.id));
  const competing = await execute('decompose', a, initial, { ...draft(module), corrections: [correction(a, 'C')] });
  const c = competing.corrections.find(item => item.reporter === competing.accounts[0]!.id)!.replacement;
  assert.equal(view(await f.session.execute(summary)).accounts[0]!.id, c);
  const descendant = await execute('explain', b, correcting, { ...draft(module), corrections: [correction(b, 'D')] });
  assert.equal(descendant.result!.request.subject, b);
  const d = descendant.corrections.find(item => item.target === b)!.replacement;
  const final = view(await f.session.execute(summary));
  assert.equal(final.accounts[0]!.id, d);
  assert.equal(final.revisions.find(item => item.original === a)!.conflicting, true);
  const exact = view(await f.session.execute({ lens: 'inspect', selector: reference(initial, a), reference: true, presentation: summary.presentation }));
  assert.deepEqual(exact.accounts, initial.accounts);
  assert.ok(exact.revisions[0]!.rows.some(item => item.replacement === c));
  assert.equal(calls, 7, 'redisplay and inspection do not infer');
  const reporter = correcting.accounts[0]!.id;
  const reporterRevision = await execute('examine', reporter, correcting, { ...draft(module), corrections: [correction(reporter, 'E-prime')] });
  const redisplay = view(await f.session.execute({ lens: 'examine', selector: reference(initial, a), reference: true, presentation: summary.presentation }));
  assert.equal(redisplay.result!.reused, true);
  assert.equal(redisplay.accounts[0]!.id, reporterRevision.corrections.find(item => item.target === reporter)!.replacement);
  const displacedCorrection = redisplay.displacedCorrections.find(item => item.target === child)!;
  assert.ok(displacedCorrection, 'corrections reported by the displaced root stay navigable');
  assert.equal(displacedCorrection.reporter, reporter);
  assert.ok(!redisplay.display.some(item => item.account === displacedCorrection.replacement), 'no old replacement spliced into the new tree');
  assert.ok(redisplay.references.some(item => item.id === displacedCorrection.replacement));
  assert.match(renderInvestigationView({ ...redisplay, presentation: { format: 'unicode', sourceDetail: false } }), /Displaced account .* reports correction/);
  assert.equal(calls, 8);

});

for (const stop of ['invalidation', 'interruption'] as const) test(`revision submission cannot alter earlier observations after ${stop}`, async t => {
  const f = fixture(t), input = Object.assign(new PassThrough(), { isTTY: true }), batches: ObservationBatch[] = [];
  let initial: InvestigationView, saved = '', count = 0;
  const agent: InvestigatorAgent = { identity: summaryAgent().identity, open() {
    if (++count === 1) return summaryAgent().open();
    return new ScriptedInvestigator([(request, _signal, usage) => {
      usage(syntheticUsage);
      if (stop === 'interruption') { setImmediate(() => process.emit('SIGINT')); return new Promise<AgentReply>(() => {}); }
      writeFileSync(f.source, 'export function entry() { return 8; }');
      return { kind: 'submit', result: { ...draft(initial.selected[0]!), corrections: [{ target: request.request.subject,
        correctedSubjects: initial.selected, reason: 'Updated account.', qualifications: ['Static interpretation.'], evidence: [],
        replacement: { ...draft(initial.selected[0]!, [], 'revision'), prose: 'Returns eight.' } }] } };
    }]).open();
  } };
  const driver = interactionDriver(() => input.end());
  let started = false;
  const code = await runCli(['shell', '--project', f.configPath, '--json'], { cwd: f.root, checkout: f.root, input, investigator: agent,
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\n')); } }, stderr: () => {}, sink: { async submit(batch) {
      batches.push(batch);
      if (batches.length === 1) {
        initial = batch.records.find(item => item.kind === 'qualified-view')!.value as InvestigationView;
        saved = JSON.stringify(initial);
        driver.run(() => input.write(`examine @${initial.references.find(item => item.id === initial.accounts[0]!.id)!.reference}\n`));
      }
      return { accepted: true };
    } } });
  driver.verify();
  assert.equal(code, stop === 'interruption' ? 130 : 2);
  assert.equal(JSON.stringify(initial!), saved);
  assert.equal(batches.length, 2);
  assert.ok(!batches[1]!.records.some(item => item.kind === 'qualified-view'));
  assert.ok(!batches[1]!.events.some(item => item.type === 'source-escape'));
});

test('historical inspection pages expose every competing correction without changing primary selection or invoking inference', async t => {
  let next = summaryAgent(), calls = 0;
  const f = await session(t, { identity: next.identity, open() { calls++; return next.open(); } });
  const initial = view(await f.session.execute(summary)), a = initial.accounts[0]!.id, module = initial.selected[0]!;
  let subject = a, prior = initial;
  for (let n = 0; n < 26; n++) {
    next = new ScriptedInvestigator([
      () => ({ kind: 'tools', requests: [{ kind: 'investigram', subject: a }] }),
      () => ({ kind: 'submit', result: { ...draft(module), corrections: [{ target: a, correctedSubjects: [module], reason: `Alternative ${n}`,
        qualifications: ['Interpretive alternative.'], evidence: [a], replacement: { ...draft(module, [], 'replacement'), prose: `Alternative ${n}.` } }] } }),
    ]);
    prior = view(await f.session.execute({ lens: 'examine', selector: prior.references.find(item => item.id === subject)!.reference, reference: true, presentation: summary.presentation }));
    assert.equal(prior.result!.evaluation!.outcome.kind, 'accepted', `Alternative ${n}: ${JSON.stringify(prior.result!.evaluation!.outcome)}`); subject = prior.accounts[0]!.id;
  }
  const request = { lens: 'inspect' as const, selector: initial.references.find(item => item.id === a)!.reference, reference: true, presentation: summary.presentation };
  const first = view(await f.session.execute(request)), second = view(await f.session.execute({ ...request, revisionPage: 2 }));
  assert.equal(first.revisions[0]!.rows.length, 24); assert.equal(first.revisions[0]!.nextPage, 2);
  assert.equal(second.revisions[0]!.rows.length, 2); assert.equal(second.revisions[0]!.nextPage, null);
  assert.equal(first.revisions[0]!.primary, second.revisions[0]!.primary);
  assert.notEqual(first.projection.id, second.projection.id);
  assert.deepEqual(first.accounts, initial.accounts); assert.deepEqual(second.accounts, initial.accounts);
  assert.equal(new Set([...first.revisions[0]!.rows, ...second.revisions[0]!.rows].map(item => item.correction)).size, 26);
  assert.match(renderInvestigationView({ ...first, presentation: { format: 'unicode', sourceDetail: false } }), /--revision-page 2/);
  assert.equal(calls, 27);
});

test('large displaced history has bounded metadata and exact inspection recovers omitted statuses without inference', async t => {
  let next = new ScriptedInvestigator([input => ({ kind: 'submit', result: { ...draft(input.request.subject),
    children: Array.from({ length: 255 }, (_, n) => draft(input.request.subject, [], `old-${n}`)) } })]);
  let calls = 0;
  const f = await session(t, { identity: next.identity, open() { calls++; return next.open(); } });
  const initial = view(await f.session.execute(summary));
  assert.equal(initial.accounts.length, 256);
  const a = initial.accounts[0]!.id, module = initial.selected[0]!;
  const oldReference = initial.references.find(item => item.id === a)!.reference;
  next = new ScriptedInvestigator([() => ({ kind: 'submit', result: { ...draft(module), corrections: [{ target: a,
    correctedSubjects: [module], reason: 'A revised division of responsibility.', qualifications: ['Scripted bound regression.'], evidence: [a],
    replacement: { ...draft(module, [], 'replacement'), children: Array.from({ length: 254 }, (_, n) => draft(module, [], `new-${n}`)) } }] } })]);
  const changed = view(await f.session.execute({ lens: 'examine', selector: oldReference, reference: true, presentation: summary.presentation }));
  assert.equal(changed.result!.evaluation!.outcome.kind, 'accepted');
  const repeated = view(await f.session.execute(summary));
  assert.equal(repeated.accounts.length, 255);
  assert.equal(repeated.displaced.length, 256);
  assert.equal(repeated.revisions.length, 256);
  assert.equal(repeated.omissions.revisions, 255);
  assert.ok(repeated.displacedCorrections.length <= 256);
  const human = renderInvestigationView({ ...repeated, presentation: { format: 'unicode', sourceDetail: false } });
  assert.equal((human.match(/Revision status /g) ?? []).length, 256);
  assert.match(human, /255 revision statuses omitted/);
  const original = view(await f.session.execute({ lens: 'inspect', selector: oldReference, reference: true, presentation: summary.presentation }));
  assert.deepEqual(original.accounts, initial.accounts);
  assert.equal(original.revisions.length, 256);
  assert.equal(original.omissions.revisions, 0);
  assert.equal(calls, 2);
});

test('an already displayed accompanying replacement still discloses the deeper displaced original and subtree', async t => {
  let next = new ScriptedInvestigator([input => ({ kind: 'submit', result: { ...draft(input.request.subject), children: [
    draft(input.request.subject, [], 'shallow'), { ...draft(input.request.subject, [], 'parent'), children: [
      { ...draft(input.request.subject, [], 'K'), children: [draft(input.request.subject, [], 'K-child')] },
    ] },
  ] } })]);
  let calls = 0;
  const f = await session(t, { identity: next.identity, open() { calls++; return next.open(); } });
  const initial = view(await f.session.execute(summary)), module = initial.selected[0]!;
  const root = initial.accounts[0]!, shallow = root.children[0]!;
  const parent = initial.accounts.find(item => item.id === root.children[1])!;
  const k = initial.accounts.find(item => item.id === parent.children[0])!;
  const correction = (target: RecordId, replacement: SubmittedInvestigram) => ({ target, replacement,
    correctedSubjects: [module], reason: 'More precise account.', qualifications: ['Scripted ordering regression.'], evidence: [target] });
  next = new ScriptedInvestigator([
    () => ({ kind: 'tools', requests: [{ kind: 'investigram', subject: k.id }] }),
    () => ({ kind: 'submit', result: { ...draft(module), corrections: [correction(shallow,
      { ...draft(module, [], 'shallow-replacement'), corrections: [correction(k.id, draft(module, [], 'K-replacement'))] })] } }),
  ]);
  const changed = view(await f.session.execute({ lens: 'examine', selector: initial.references.find(item => item.id === shallow)!.reference,
    reference: true, presentation: summary.presentation }));
  assert.equal(changed.result!.evaluation!.outcome.kind, 'accepted');
  const replacement = changed.corrections.find(item => item.target === k.id)!.replacement;
  const repeated = view(await f.session.execute(summary));
  assert.equal(repeated.display.filter(item => item.account === replacement).length, 1);
  assert.ok(repeated.displaced.includes(k.id));
  assert.ok(repeated.displaced.includes(k.children[0]!));
  assert.ok(repeated.revisions.some(item => item.original === k.id));
  assert.deepEqual(repeated.omissions, { displaced: 0, displacedCorrections: 0, revisions: 0 });
  const exact = view(await f.session.execute({ lens: 'inspect', selector: initial.references.find(item => item.id === k.id)!.reference,
    reference: true, presentation: summary.presentation }));
  assert.deepEqual(exact.accounts, [k, initial.accounts.find(item => item.id === k.children[0])!]);
  assert.equal(calls, 2);
});

test('displaced account and accompanying correction listings truncate with exact counts and retained navigation', async t => {
  let next = new ScriptedInvestigator([input => ({ kind: 'submit', result: draft(input.request.subject) })]), calls = 0;
  const f = await session(t, { identity: next.identity, open() { calls++; return next.open(); } });
  const auxiliary = view(await f.session.execute({ ...summary, selector: 'other' }));
  const target = auxiliary.accounts[0]!.id;
  next = new ScriptedInvestigator([input => ({ kind: 'submit', result: { ...draft(input.request.subject),
    children: Array.from({ length: 3 }, (_, n) => draft(input.request.subject, [], `branch-${n}`)) } })]);
  const initial = view(await f.session.execute(summary)), module = initial.selected[0]!;
  const correction = (subject: RecordId, replacement: SubmittedInvestigram) => ({ target: subject, replacement,
    correctedSubjects: [module], reason: 'More precise account.', qualifications: ['Scripted listing regression.'], evidence: [subject] });
  const reporters: RecordId[] = [];
  for (const [n, branch] of initial.accounts[0]!.children.entries()) {
    next = new ScriptedInvestigator([
      () => ({ kind: 'tools', requests: [{ kind: 'investigram', subject: target }] }),
      () => ({ kind: 'submit', result: { ...draft(module), corrections: [correction(branch,
        { ...draft(module, [], `wrapper-${n}`), children: [{ ...draft(module, [], `reporter-${n}`),
          children: Array.from({ length: 122 }, (_, i) => draft(module, [], `child-${i}`)),
          corrections: Array.from({ length: 129 }, (_, i) => correction(target, draft(module, [], `alternative-${i}`))),
        }] })] } }),
    ]);
    const changed = view(await f.session.execute({ lens: 'examine', selector: initial.references.find(item => item.id === branch)!.reference,
      reference: true, presentation: summary.presentation }));
    assert.equal(changed.result!.evaluation!.outcome.kind, 'accepted');
    reporters.push(changed.accounts.find(item => item.corrections.length === 129)!.id);
  }
  next = new ScriptedInvestigator([
    () => ({ kind: 'tools', requests: reporters.map(subject => ({ kind: 'investigram', subject })) }),
    () => ({ kind: 'submit', result: { ...draft(module), corrections: reporters.map((subject, n) => correction(subject, draft(module, [], `replacement-${n}`))) } }),
  ]);
  const changed = view(await f.session.execute({ lens: 'examine', selector: initial.references.find(item => item.id === initial.accounts[0]!.id)!.reference,
    reference: true, presentation: summary.presentation }));
  assert.equal(changed.result!.evaluation!.outcome.kind, 'accepted');
  const repeated = view(await f.session.execute(summary));
  assert.equal(repeated.displaced.length, 256);
  assert.equal(repeated.omissions.displaced, 116, 'three old branches plus three displaced 123-account subtrees');
  assert.equal(repeated.displacedCorrections.length, 256);
  assert.equal(repeated.omissions.displacedCorrections, 131, 'three reporters each retain 129 corrections');
  const human = renderInvestigationView({ ...repeated, presentation: { format: 'unicode', sourceDetail: false } });
  assert.match(human, /116 displaced accounts, 131 accompanying corrections/);
  const lastReporter = reporters[2]!;
  const exact = view(await f.session.execute({ lens: 'inspect', selector: repeated.references.find(item => item.id === lastReporter)!.reference,
    reference: true, presentation: summary.presentation }));
  assert.equal(exact.accounts[0]!.id, lastReporter);
  assert.equal(exact.accounts[0]!.children.length, 122);
  assert.equal(exact.accounts[0]!.corrections.length, 129);
  assert.ok(exact.accounts[0]!.corrections.some(id => !repeated.displacedCorrections.some(item => item.id === id)));
  assert.ok(exact.accounts[0]!.children.some(id => !repeated.displaced.includes(id)));
  assert.equal(exact.omittedAccounts.length, 0);
  assert.equal(calls, 6, 'repeat and exact navigation do not infer');
});

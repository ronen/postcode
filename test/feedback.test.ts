import { publishCommand } from '../src/lib/command-execution.js';
import { publishFeedback, type DisplayedResult } from '../src/lib/feedback.js';
import { AnalysisFailure, CommandInterrupted } from '../src/lib/execution-errors.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PassThrough } from 'node:stream';
import path from 'node:path';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import { parseCommand } from '../src/lib/commands.js';
import { temporaryDirectory, interactionDriver } from './cli-helpers.js';

for (const json of [false, true]) test(`one-shot feedback is context-free without project or investigator (${json})`, async t => {
  const root = temporaryDirectory(t, 'postcode-feedback-');
  let stdout = '', stderr = '';
  const exit = await runCli(['feedback', ...(json ? ['--json', 'Not enough context'] : [])], {
    cwd: root, checkout: root, configureInvestigator: async () => { throw new Error('Must not configure investigator'); },
    stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
  });
  assert.equal(exit, 0); assert.match(stderr, /context-free/);
  const destination = path.join(root, '_observations/context-free');
  const day = readdirSync(destination)[0]!;
  const batch = JSON.parse(readFileSync(path.join(destination, day, readdirSync(path.join(destination, day))[0]!), 'utf8')) as ObservationBatch;
  assert.equal(batch.command, 1); assert.match(batch.session, /^invocation:/);
  assert.ok(!batch.records.some(item => item.kind === 'analysis-context' || item.kind === 'qualified-view'));
  const feedback = batch.records.find(item => item.kind === 'inadequacy-feedback')!.value as { context: string; explanation: string | null; displayed: unknown };
  assert.equal(feedback.context, 'context-free'); assert.equal(feedback.displayed, null);
  assert.equal(feedback.explanation, json ? 'Not enough context' : null);
  assert.equal(batch.records.find(item => item.kind === 'rendered-output')!.value, stdout);
  assert.deepEqual(batch.events.map(event => event.type), ['inadequacy-reported', 'command-completed']);
});

for (const json of [false, true]) test(`shell feedback preserves the actual displayed result through reports and delivery failure (${json})`, async t => {
  const root = temporaryDirectory(t, 'postcode-feedback-shell-');
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), '/** Coordinates work. */ export const entry = 1;');
  const input = Object.assign(new PassThrough(), { isTTY: true });
  const driver = interactionDriver(() => input.end());
  const commands = ['feedback', 'inspect entry --more-details', 'feedback "Need responsibility detail"', 'usage', 'feedback', 'present @ANSWER', 'feedback', 'inspect missing', 'feedback'];
  const batches: ObservationBatch[] = []; let started = false, stderr = '', stdout = '', answer = '';
  const code = await runCli(['shell', ...(json ? ['--json'] : [])], {
    cwd: root, checkout: root, input,
    configureInvestigator: async () => ({ kind: 'disabled' }),
    stdout: text => { stdout += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write(commands[0] + '\n')); } },
    stderr: text => { stderr += text; },
    sink: { async submit(batch) {
      batches.push(batch);
      driver.run(() => {
        const view = batch.records.find(item => item.kind === 'qualified-view')?.value as { answerReference: string } | undefined;
        if (view) answer = view.answerReference;
        const next = commands[batches.length];
        if (next) input.write(next.replace('ANSWER', answer) + '\n'); else input.end();
      });
      return batch.command === 3 ? { accepted: false, reason: 'Deliberate delivery failure' } : { accepted: true };
    } },
  });
  driver.verify(); assert.equal(code, 0, stderr); assert.match(stderr, /observation not recorded: Deliberate delivery failure/);
  const report = (index: number) => batches[index]!.records.find(item => item.kind === 'inadequacy-feedback')!.value as { context: string; displayed: { records: ObservationBatch['records']; events: ObservationBatch['events']; command: number } | null };
  assert.equal(report(0).context, 'context-free');
  for (const index of [2, 4]) assert.deepEqual(report(index).displayed, { command: 2, records: batches[1]!.records, events: batches[1]!.events });
  assert.equal(report(6).displayed!.command, 6);
  assert.equal(report(8).displayed!.command, 8);
  assert.ok(report(8).displayed!.records.some(item => item.kind === 'resolution-result'));
  assert.ok(!report(8).displayed!.records.some(item => item.kind === 'qualified-view'));
  const rendered = report(2).displayed!.records.find(item => item.kind === 'rendered-output')!.value as string;
  assert.ok(stdout.includes(rendered));
  assert.ok(report(2).displayed!.records.some(item => item.kind === 'analysis-context'));
  assert.equal(batches.length, commands.length);
});

test('removed source option gives guidance and feedback rejects investigation options', () => {
  for (const interactive of [false, true]) {
    const result = parseCommand(['inspect', 'entry', '--source-detail'], '.', interactive);
    assert.equal(result.kind, 'error'); assert.match(result.message, /--more-details/);
    assert.equal(parseCommand(['feedback', '--more-details'], '.', interactive).kind, 'error');
    assert.equal(parseCommand(['feedback', '--project=missing.json'], '.', interactive).kind, 'error');
  }
});

for (const json of [false, true]) test(`feedback snapshots the latest failure instead of an older answer (${json})`, async () => {
  let displayed: DisplayedResult = { command: 1, events: [], records: [{ id: 'prior', kind: 'qualified-view', value: { old: true } }] };
  let calls = 0;
  for (const error of [new AnalysisFailure('Evidence unavailable'), new CommandInterrupted(), new Error('Controlled defect')]) {
    const batches: ObservationBatch[] = []; let stderr = '', acknowledgement = '';
    await publishCommand({ id: 'session:fixture', async execute() { calls++; throw error; }, check() {} },
      { lens: 'inspect', selector: 'entry', referenceLifetime: 'command', presentation: { format: json ? 'json' : 'unicode', moreDetails: false } }, {}, '/fixture/tsconfig.json', 2,
      { stdout() {}, stderr(text) { stderr += text; } }, { async submit(batch) { batches.push(batch); return { accepted: false, reason: 'controlled rejection' }; } },
      snapshot => { displayed = snapshot; });
    const failure = batches[0]!;
    assert.deepEqual(displayed, { command: 2, records: failure.records, events: failure.events });
    assert.ok(!displayed.records.some(record => record.kind === 'qualified-view'));
    const outcome = displayed.records.find(record => record.kind === 'command-outcome')!.value as { status: string; stderr: string };
    assert.ok(stderr.includes(outcome.stderr)); assert.match(stderr, /controlled rejection/);
    if (outcome.status === 'defect') { assert.match(outcome.stderr, /new invocation/); assert.doesNotMatch(outcome.stderr, /reopen the shell/); }
    for (let command = 3; command <= 4; command++) await publishFeedback({ correlation: 'session:fixture', command, explanation: null, json, displayed },
      { stdout(text) { acknowledgement += text; }, stderr() {} }, { async submit(batch) {
        const report = batch.records.find(record => record.kind === 'inadequacy-feedback')!.value as { displayed: DisplayedResult; target: unknown };
        assert.deepEqual(report.displayed, displayed);
        assert.deepEqual(report.target, { command: 2, status: outcome.status });
        return { accepted: true };
      } });
    assert.match(acknowledgement, new RegExp(outcome.status));
  }
  assert.equal(calls, 3, 'feedback does not execute a request');
});

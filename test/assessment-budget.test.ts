import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';

const { requestBudget } = await import(new URL('../../scripts/module-investigation/request-budget.mjs', import.meta.url).href);
test('assessment allowance reserves before dispatch, persists failed attempts and excludes competing runners', t => {
  const root = temporaryDirectory(t, 'postcode-assessment-budget-'), file = path.join(root, 'budget.json');
  writeFileSync(file, JSON.stringify({ authorized: 2, requests: [] }));
  const budget = requestBudget(file);
  try {
    assert.throws(() => requestBudget(file));
    assert.equal(budget.reserve('first'), 1);
    assert.equal(JSON.parse(readFileSync(file, 'utf8')).requests[0].status, 'reserved-before-dispatch');
    budget.record(1, { status: 'failed', usage: null });
  } finally { budget.close(); }
  const reopened = requestBudget(file);
  try { assert.equal(reopened.reserve('second'), 2); assert.equal(reopened.reserve('third'), null); }
  finally { reopened.close(); }
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).requests.length, 2);
});

test('assessment harness captures CLI interaction and refuses an extra POST without exposing credentials', async t => {
  const { runAssessment } = await import(new URL('../../scripts/module-investigation/run-shell.mjs', import.meta.url).href);
  const root = temporaryDirectory(t, 'postcode-assessment-shell-'), file = path.join(root, 'budget.json'), output = path.join(root, 'capture');
  writeFileSync(file, JSON.stringify({ ceiling: 1, requests: [] }));
  let posts = 0;
  const exit = await runAssessment({ id: 'offline', project: 'fixture', output, budget: file, pass: 'test', commands: ['usage', 'exit'] }, {
    onError(error: unknown) { throw error; }, verify() {}, session: async () => ({ token: async () => 'offline-secret', watch: () => () => {} }),
    fetch: async () => { posts++; return new Response('data: ' + JSON.stringify({ type: 'response.completed', response: { id: 'test', status: 'completed', model: 'gpt-5.6-sol', output: [], usage: { input_tokens: 4, output_tokens: 2, total_tokens: 6 } } }) + '\n\n', { headers: { 'content-type': 'text/event-stream' } }); },
    runCli: async (_args: unknown, options: any) => {
      const { agent } = await options.configureInvestigator(); const dialogue = agent.open();
      const input = { attempt: 'attempt:test', instructions: 'offline', request: { operation: 'functionality', subject: 'module:test', parameters: {} }, responses: [], remaining: { milliseconds: 10000, calls: 3, toolCalls: 3 } };
      try {
        await dialogue.exchange(input, new AbortController().signal, () => {});
        const another = agent.open();
        try { await another.exchange(input, new AbortController().signal, () => {}); } finally { another.close(); }
        for (const expected of ['usage', 'exit']) {
          const line = new Promise<string>(resolve => options.input.once('data', (data: Buffer) => resolve(data.toString().trim())));
          options.stdout('postcode> '); assert.equal(await line, expected);
        }
        await options.sink.submit({ type: 'test' }); return 0;
      } finally { dialogue.close(); }
    },
  });
  assert.equal(exit, 0); assert.equal(posts, 1);
  assert.equal(JSON.parse(readFileSync(path.join(output, 'result.json'), 'utf8')).pausedForBudget, true);
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).requests.length, 1);
  assert.doesNotMatch(readFileSync(path.join(output, 'exchanges.jsonl'), 'utf8'), /offline-secret/);
});

test('controlled earlier interpretation is explicitly scripted and never sends a provider request', async () => {
  const { injectedSetup } = await import(new URL('../../scripts/module-investigation/injected-setup.mjs', import.meta.url).href);
  const captures: unknown[] = [], usage: unknown[] = [];
  const agent = injectedSetup({ id: 'controlled', prose: 'Earlier root.', childProse: 'Earlier part.', qualifications: ['Injected test context.'] }, (value: unknown) => captures.push(value));
  const dialogue = agent.open();
  const reply = await dialogue.exchange({ request: { subject: 'module:test' } }, new AbortController().signal, (value: unknown) => usage.push(value));
  assert.equal(agent.identity.origin, 'scripted'); assert.equal(agent.identity.configuration.providerRequests, false);
  assert.equal(reply.kind, 'submit'); assert.equal(reply.result.children[0].prose, 'Earlier part.');
  assert.deepEqual(reply.result.referent.subjects, ['module:test']);
  assert.deepEqual(usage, [{ source: 'synthetic', categories: [] }]); assert.equal(captures.length, 1);
  dialogue.close(); await assert.rejects(dialogue.exchange({}, new AbortController().signal, () => {}), /Closed/);
});

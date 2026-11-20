/** Focused dialog @14 live regression. Controlled setup, then unchanged production invocation.
 * node scripts/structured-accounts/run-dialog14-trial.mjs spec.json [--offline]
 * Spec: { id, project: absolute tsconfig, output: new absolute directory, budget: request ledger }.
 * --offline validates the fixture/delivery without opening credentials or dispatching inference.
 * Captures can contain source and must remain private until inspected.
 */
import assert from 'node:assert/strict';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { openApplication } from '../../_build/src/lib/application/index.js';
import { productionChatGPTCredentials } from '../../_build/src/lib/application/accounts.js';
import { chatGPTDialogAgent } from '../../_build/src/lib/investigation/openai/contribution-protocol.js';
import { methods } from '../../_build/src/lib/identity.js';
import { requestBudget } from '../module-investigation/request-budget.mjs';

const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const offline = process.argv.includes('--offline');
for (const field of ['id', 'project', 'output', 'budget']) assert.ok(typeof spec[field] === 'string' && spec[field]);
assert.equal(methods.contributionDialog, 'postcode/contribution-dialog@14');
mkdirSync(spec.output, { recursive: false, mode: 0o700 });
const save = (name, value) => writeFileSync(path.join(spec.output, name), JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
const append = (name, value) => appendFileSync(path.join(spec.output, name), JSON.stringify(value) + '\n', { mode: 0o600 });
save('spec.json', { ...spec, offline });
const scripted = { provider: 'postcode-trial', model: 'controlled-dialog14-setup', origin: 'scripted', configuration: {} };
const qualification = { limitations: ['Controlled trial fixture: manually prepared notes about pinned Cockatiel code. This producing attempt has not verified source behavior. These retained input claims are not mechanically established facts.'] };
const notes = [
  { key: 'note_k', text: 'Half-open admission: executeHalfOpen waits for the decision promise when successes + failures + inFlight reaches the configured calls budget, then calls execute again. This note concerns admission while a half-open sampling decision is pending.' },
  { key: 'note_r', text: 'Manual isolation: isolate() resolves a pending half-open decision, enters Isolated, and counts live isolation handles. Each handle disposes at most once; only disposing the last handle while still Isolated returns the circuit to Closed. This note concerns explicit isolation ownership, not successful sample counting.' },
  { key: 'note_b', text: 'Stale completion: recordHalfOpenSuccess immediately returns when the captured half-open state is not the current innerState. A success from an old sampling episode therefore does not update that episode through this method. This note does not establish every failure or cancellation path.' },
];
const selected = key => ({ kind: 'content', item: { investigram: { local: 'fixture' }, item: key }, component: null });
function seed(input) {
  const entity = input.request.subjects[0].subject.entity;
  return { investigrams: [{ key: 'fixture', qualification, referents: [entity],
    items: notes.map(note => ({ key: note.key, type: 'prose', body: { text: note.text }, referents: [entity] })),
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result },
      members: notes.map(note => ({ kind: 'item', item: { investigram: { local: 'fixture' }, item: note.key } })) }],
    options: [{ key: 'compare_notes',
      meaning: 'Clarify how the selected half-open admission behavior relates to the additional selected notes on manual isolation and stale-completion handling. Keep the three mechanisms distinct, cite the exact retained item supporting each point, and preserve their limitations. A concise prose answer is sufficient.',
      request: { operation: 'clarification', subjects: [{ subject: selected('note_k') }],
        context: ['note_k', 'note_r', 'note_k', 'note_b', 'note_r', 'note_b'].map(selected) } }],
  }] };
}
let phase = 'setup', hosted, session, budget, ordinal, initial;
const agent = {
  get identity() { return phase === 'setup' || offline ? scripted : hosted.identity; },
  open() {
    if (phase === 'setup') return { close() {}, async exchange(input) {
      append('domain-inputs.jsonl', { phase, input });
      const contribution = seed(input); save('seed.json', contribution);
      return { kind: 'submit', contribution };
    } };
    const conversation = offline ? null : hosted.open();
    return { close() { conversation?.close(); }, async exchange(input, signal, usage) {
      append('domain-inputs.jsonl', { phase, input });
      if (!initial) {
        initial = input;
        assert.deepEqual(input.request.subjects.map(entry => entry.subject.item.item), ['note_k']);
        assert.deepEqual(input.request.context.map(entry => entry.item.item), ['note_k', 'note_r', 'note_k', 'note_b', 'note_r', 'note_b']);
        assert.deepEqual(input.responses.map(response => response.kind), ['item', 'item', 'item', 'metadata']);
        assert.deepEqual(input.responses.slice(0, 3).map(response => response.value.address.item), notes.map(note => note.key));
        for (const [index, note] of notes.entries()) assert.equal(input.responses[index].value.item.body.text, note.text);
      }
      // Do not append instructions, reorder responses, change the request or inject a model answer.
      const reply = offline ? { kind: 'submit', contribution: { investigrams: [], report: { inability: 'Offline fixture preflight only; no inference performed.' } } }
        : await conversation.exchange(input, signal, usage);
      append('domain-replies.jsonl', { phase, reply });
      return reply;
    } };
  },
};
try {
  const opened = await openApplication({ configPath: spec.project, excludedOutputDirectories: [spec.output] },
    { investigation: { dialogAgent: agent, onReport: report => append('attempts.jsonl', { phase, ...report }) } });
  assert.equal(opened.status, 'opened'); session = opened.session;
  const setup = await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'circuit-breaker-policy' } });
  save('setup-result.json', setup);
  assert.equal(setup.kind, 'answer'); assert.equal(setup.failed, false);
  const option = setup.answer.content.value.projection.alternatives.flatMap(alternative => alternative.options)[0];
  assert.equal(option.address.key, 'compare_notes');
  phase = 'invocation';
  if (!offline) {
    budget = requestBudget(spec.budget);
    hosted = chatGPTDialogAgent(await (await productionChatGPTCredentials()).session(), {
      fetch: async (url, options) => {
        assert.equal(String(url), 'https://api.openai.com/v1/responses');
        ordinal = budget.reserve(spec.id);
        if (ordinal === null) throw new Error('Trial request ceiling reached; stop and assess');
        try {
          const response = await fetch(url, options);
          budget.record(ordinal, { status: 'response-headers-received', httpStatus: response.status }); return response;
        } catch (error) { budget.record(ordinal, { status: 'transport-failed', usage: null }); throw error; }
      },
      onExchange: exchange => {
        append('exchanges.jsonl', exchange);
        if (ordinal) budget.record(ordinal, { status: exchange.failure ? 'failed' : 'response-received', usage: exchange.response?.usage ?? null, failure: exchange.failure?.code ?? null });
      },
    });
  }
  const request = { kind: 'lens', lens: 'follow-up', designation: { kind: 'reference', value: option.address.investigram }, parameters: { option: option.address.key } };
  const started = performance.now(), result = await session.execute(request), milliseconds = performance.now() - started;
  save('result.json', { request, milliseconds, result });
  save('usage.json', session.usage());
  console.log(JSON.stringify({ offline, milliseconds, kind: result.kind, failed: result.failed, outcome: result.reporting?.contribution?.outcome,
    alternatives: result.answer?.content?.value?.projection?.alternatives?.length }));
} finally {
  try { await session?.close(); } finally { budget?.close(); }
}

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chatGPTInvestigator } from '../src/lib/investigation/openai/adapter.js';
import type { OpenAIExchange } from '../src/lib/investigation/openai/adapter.js';
import type { AgentInput, ReportedUsage } from '../src/lib/investigation/contracts.js';
import type { RecordId } from '../src/lib/records.js';
import { checkChatGPTConnection } from '../src/lib/investigation/openai/auth-command.js';
import type { ChatGPTCredentials } from '../src/lib/investigation/openai/chatgpt-credentials.js';
import { CredentialError } from '../src/lib/investigation/openai/credential-store.js';

const secret = 'test-secret-quote"backslash\\token';
const session = { token: async () => secret, watch: () => () => {} };
const input: AgentInput = { attempt: 'attempt:test' as RecordId, instructions: 'Test instructions', request: { operation: 'functionality', subject: 'module:test' as RecordId, parameters: {} }, responses: [], remaining: { milliseconds: 10000, calls: 5, toolCalls: 10 } };
const usage = { input_tokens: 12, output_tokens: 3, total_tokens: 15, input_tokens_details: { cached_tokens: 2 }, output_tokens_details: { reasoning_tokens: 1 } };
const call = (name: string, args: unknown) => ({ type: 'function_call', call_id: 'call', name, namespace: 'postcode', arguments: JSON.stringify(args) });
const response = (output: unknown[], status = 'completed') => ({ id: 'resp_test', model: 'gpt-5.6-sol', status, output, usage });
function sse(events: unknown[], done = true): Response {
  const text = events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + (done ? 'data: [DONE]\n\n' : '');
  return new Response(text, { headers: { 'content-type': 'text/event-stream', 'x-request-id': 'request-test' } });
}

test('subscription transport uses streaming, namespace tools, completed response only, fresh history and rotated credentials', async () => {
  const sent: Record<string, any>[] = [], reports: ReportedUsage[] = [], captures: OpenAIExchange[] = []; let tokenCalls = 0;
  const agent = chatGPTInvestigator({ ...session, token: async () => { tokenCalls++; return `token-${tokenCalls}`; } }, { onExchange: item => captures.push(item), fetch: async (_url, options) => {
    assert.equal(new Headers(options?.headers).get('authorization'), `Bearer token-${tokenCalls}`);
    const body = JSON.parse(String(options?.body)); sent.push(body);
    const output = sent.length === 1 ? [call('request_evidence', { requests: [{ kind: 'source', subject: input.request.subject }] })] : [call('submit_investigram', { prose: 'finished' })];
    return sse([{ type: 'response.output_item.done', item: call('submit_investigram', { prose: 'unfinished' }) }, { type: 'response.completed', response: response(output) }]);
  } });
  const dialogue = agent.open();
  assert.equal((await dialogue.exchange(input, new AbortController().signal, item => reports.push(item))).kind, 'tools');
  const reply = await dialogue.exchange({ ...input, responses: [{ status: 'unavailable', records: [], selected: [], limitations: ['test'] }] }, new AbortController().signal, item => reports.push(item));
  assert.deepEqual(reply, { kind: 'submit', result: { prose: 'finished' } }); dialogue.close();
  assert.equal(sent[0]!.model, 'gpt-5.6-sol'); assert.equal(agent.identity.model, 'gpt-5.6-sol');
  assert.equal(sent[0]!.stream, true); assert.equal(sent[0]!.store, false); assert.equal(Array.isArray(sent[0]!.input), true);
  assert.equal(sent[0]!.tools[0].type, 'namespace'); assert.equal(sent[0]!.tools[0].name, 'postcode');
  for (const field of ['max_output_tokens', 'service_tier', 'temperature', 'previous_response_id', 'metadata', 'conversation']) assert.equal(field in sent[0]!, false);
  assert.equal(sent[1]!.input.some((item: any) => item.type === 'function_call_output'), true);
  assert.equal(reports.length, 2); assert.equal(reports[0]!.categories.find(c => c.category === 'total')?.value, 15);
  assert.doesNotMatch(JSON.stringify(captures), /token-1|token-2/);
  const fresh = agent.open(); await fresh.exchange(input, new AbortController().signal, () => {}); fresh.close();
  assert.deepEqual(sent[2], sent[0]);
  assert.equal(agent.identity.configuration.billingRoute, 'chatgpt-plan');
});

test('partial output, EOF, malformed SSE, failed terminal and incomplete terminal never become accepted submissions', async () => {
  const cases = [
    { wire: sse([{ type: 'response.output_item.done', item: call('submit_investigram', {}) }]), kind: 'communication-failure', reports: 0 },
    { wire: new Response('data: not json\n\n', { headers: { 'content-type': 'text/event-stream' } }), kind: 'communication-failure', reports: 0 },
    { wire: sse([{ type: 'response.failed', response: { ...response([], 'failed'), error: { code: 'subscription_sharing_usage_limit_exceeded', param: null } } }]), kind: 'communication-failure', reports: 1 },
    { wire: sse([{ type: 'response.incomplete', response: response([], 'incomplete') }]), kind: 'truncated', reports: 1 },
    { wire: sse([{ type: 'response.completed', response: response([call('submit_investigram', {})], 'in_progress') }]), kind: 'communication-failure', reports: 0 },
    { wire: sse([{ type: 'response.completed', response: response([{ ...call('submit_investigram', {}), namespace: 'elsewhere' }]) }]), kind: 'ended', reports: 1 },
  ];
  for (const item of cases) {
    let calls = 0; const reports: ReportedUsage[] = [];
    const dialogue = chatGPTInvestigator(session, { fetch: async () => { calls++; return item.wire; } }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, report => reports.push(report)); dialogue.close();
    assert.equal(result.kind, item.kind); assert.equal(reports.length, item.reports); assert.equal(calls, 1);
  }
});

test('admission and streaming errors retain HTTP status, code, parameter, request ID and sanitized body shape', async () => {
  for (const stream of [false, true]) {
    const body = { code: 'subscription_sharing_unsupported_capability', param: 'max_output_tokens', message: `echo ${secret}` };
    const captures: OpenAIExchange[] = [];
    const wire = stream ? sse([{ type: 'error', ...body }]) : new Response(JSON.stringify({ error: body }), { status: 400, headers: { 'content-type': 'application/json', 'x-request-id': 'request-test' } });
    const dialogue = chatGPTInvestigator(session, { fetch: async () => wire, onExchange: e => captures.push(e) }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, () => {}); dialogue.close();
    assert.equal(result.kind, 'configuration-unavailable');
    if (result.kind !== 'configuration-unavailable') throw new Error('wrong result');
    assert.equal(result.code, body.code); assert.equal(result.provider?.status, stream ? 200 : 400); assert.equal(result.provider?.requestId, 'request-test');
    assert.match(JSON.stringify(result.provider?.body), /max_output_tokens/); assert.equal(JSON.stringify(captures).includes(JSON.stringify(secret).slice(1, -1)), false);
  }
  const dialogue = chatGPTInvestigator(session, { fetch: async () => new Response(JSON.stringify({ detail: 'plan unavailable' }), { status: 403 }) }).open();
  const result = await dialogue.exchange(input, new AbortController().signal, () => {}); dialogue.close();
  assert.equal(result.kind, 'configuration-unavailable');
  if (result.kind === 'configuration-unavailable') assert.deepEqual(result.provider?.body, { detail: 'plan unavailable' });
});

test('cancellation after streamed partial submission aborts transport and reports no accepted result or late usage', async () => {
  let started!: () => void; const ready = new Promise<void>(resolve => { started = resolve; }); let aborted = false, reports = 0;
  const dialogue = chatGPTInvestigator(session, { fetch: async (_url, options) => {
    return new Response(new ReadableStream({ start(controller) {
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'response.output_item.done', item: call('submit_investigram', {}) })}\n\n`)); started();
      options?.signal?.addEventListener('abort', () => { aborted = true; controller.error(new DOMException('abort', 'AbortError')); }, { once: true });
    } }), { headers: { 'content-type': 'text/event-stream' } });
  } }).open();
  const pending = dialogue.exchange(input, new AbortController().signal, () => { reports++; }); await ready; dialogue.close();
  await assert.rejects(pending); assert.equal(aborted, true); assert.equal(reports, 0);
});

test('account check never substitutes a missing model and verifies medium through the actual streaming route', async () => {
  const manager = { session: async () => session } as unknown as ChatGPTCredentials;
  let posts = 0, available = false;
  const fetcher: typeof fetch = async (url, options) => {
    if (String(url).endsWith('/models')) return new Response(JSON.stringify({ models: available ? [{ slug: 'gpt-5.6-sol', visibility: 'list' }] : [{ slug: 'another-model', visibility: 'list' }] }));
    posts++; const body = JSON.parse(String(options?.body)); assert.equal(body.model, 'gpt-5.6-sol'); assert.equal(body.reasoning.effort, 'medium');
    return sse([{ type: 'response.completed', response: response([call('submit_investigram', { prose: 'Connection confirmed' })]) }]);
  };
  await assert.rejects(checkChatGPTConnection(manager, new AbortController().signal, fetcher), CredentialError); assert.equal(posts, 0);
  available = true; const checked = await checkChatGPTConnection(manager, new AbortController().signal, fetcher);
  assert.equal(checked.status, 'connected'); assert.equal(posts, 1); assert.equal(checked.usage.length, 1); assert.match(checked.monetaryAttribution, /unavailable/);
});

test('credential revocation aborts an active stream as configuration unavailability, independently of investigation cancellation', async () => {
  let revoke!: () => void, ready!: () => void; const started = new Promise<void>(resolve => { ready = resolve; });
  const dialogue = chatGPTInvestigator({ ...session, watch: controller => { revoke = () => controller.abort(new CredentialError('reauthorization_required', 'Interactive sign-in required.')); return () => {}; } }, { fetch: async (_url, options) => new Response(new ReadableStream({ start(controller) {
    ready(); options?.signal?.addEventListener('abort', () => controller.error(new DOMException('aborted', 'AbortError')), { once: true });
  } }), { headers: { 'content-type': 'text/event-stream' } }) }).open();
  const pending = dialogue.exchange(input, new AbortController().signal, () => assert.fail('no usage yet'));
  await started; revoke(); const result = await pending; dialogue.close();
  assert.equal(result.kind, 'configuration-unavailable');
});

test('terminal events supply optional response status while partial output and contradictions remain rejected', async () => {
  for (const status of ['completed', 'failed', 'incomplete']) {
    const body = { model: 'gpt-5.6-sol', output: [call('submit_investigram', { prose: 'complete' })], usage };
    const reports: ReportedUsage[] = [];
    const dialogue = chatGPTInvestigator(session, { fetch: async () => sse([{ type: `response.${status}`, response: body }]) }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, report => reports.push(report)); dialogue.close();
    assert.equal(result.kind, status === 'completed' ? 'submit' : status === 'failed' ? 'communication-failure' : 'truncated');
    assert.equal(reports.length, 1);
  }
});

test('stream diagnostics distinguish content type, premature EOF and contradictory terminal status and redact credentials', async () => {
  for (const [wire, code] of [
    [new Response(null), 'stream_ended_without_terminal'],
    [new Response('{}', { headers: { 'content-type': 'application/json' } }), 'unexpected_response_content_type'],
    [sse([{ type: secret }]), 'stream_ended_without_terminal'],
    [sse([{ type: 'response.created' }]), 'stream_ended_without_terminal'],
    [sse([{ type: 'response.completed', response: response([], 'in_progress') }]), 'inconsistent_terminal_response'],
  ] as const) {
    const dialogue = chatGPTInvestigator(session, { fetch: async () => wire }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, () => {}); dialogue.close();
    assert.equal(result.kind, 'communication-failure');
    assert.equal(JSON.stringify(result).includes(secret), false);
    if (result.kind === 'communication-failure') { assert.equal(result.code, code); assert.equal(result.provider?.status, 200); }
  }
});

test('absent content type permits framed terminal responses while empty output, partial events and JSON stay unaccepted', async () => {
  const completed = response([call('submit_investigram', { prose: 'complete' })]);
  for (const [events, expected, count] of [
    [[{ type: 'response.completed', response: completed }], 'submit', 1],
    [[{ type: 'response.completed', response: response([]) }], 'ended', 1],
    [[{ type: 'response.failed', response: response([], 'failed') }], 'communication-failure', 1],
    [[{ type: 'response.incomplete', response: response([], 'incomplete') }], 'truncated', 1],
    [[{ type: 'response.output_item.done', item: call('submit_investigram', {}) }], 'communication-failure', 0],
  ] as const) {
    const wire = sse([...events]); wire.headers.delete('content-type');
    const reports: ReportedUsage[] = [];
    const dialogue = chatGPTInvestigator(session, { fetch: async () => wire }).open();
    const reply = await dialogue.exchange(input, new AbortController().signal, report => reports.push(report)); dialogue.close();
    assert.equal(reply.kind, expected); assert.equal(reports.length, count);
  }
  const dialogue = chatGPTInvestigator(session, { fetch: async () => new Response(new TextEncoder().encode(JSON.stringify(completed))) }).open();
  const reply = await dialogue.exchange(input, new AbortController().signal, () => assert.fail('not an SSE terminal')); dialogue.close();
  assert.equal(reply.kind, 'communication-failure');
});

test('completed stream items supply an empty terminal envelope only after a consistent successful completion', async () => {
  const item = { ...call('submit_investigram', { prose: 'finished' }), id: 'fc_1' };
  const start = { type: 'response.created', response: response([], 'in_progress') };
  const added = { type: 'response.output_item.added', response_id: 'resp_test', output_index: 0, item: { ...item, arguments: '' } };
  const done = { ...added, type: 'response.output_item.done', item };
  const completed = { type: 'response.completed', response: response([]) };
  const cases = [
    { events: [start, added, done, completed], expected: 'submit' },
    { events: [start, added, done], expected: 'communication-failure' },
    { events: [start, added, completed], expected: 'ended' },
    { events: [start, done, completed], expected: 'ended' },
    { events: [start, added, done, done, completed], expected: 'ended' },
    { events: [start, added, { ...done, item: { ...item, call_id: 'other' } }, completed], expected: 'ended' },
    { events: [start, added, { ...done, response_id: 'other' }, completed], expected: 'ended' },
    { events: [start, { ...added, output_index: 2 }, { ...done, output_index: 2 }, completed], expected: 'ended' },
    { events: [start, added, done, { ...completed, response: { ...response([]), id: 'other' } }], expected: 'ended' },
    { events: [start, added, done, { type: 'response.failed', response: response([], 'failed') }], expected: 'communication-failure' },
    { events: [start, added, done, { type: 'response.incomplete', response: response([], 'incomplete') }], expected: 'truncated' },
  ];
  for (const { events, expected } of cases) {
    const captures: OpenAIExchange[] = [], reports: ReportedUsage[] = [];
    const wire = sse(events); wire.headers.delete('content-type');
    const dialogue = chatGPTInvestigator(session, { fetch: async () => wire, onExchange: capture => captures.push(capture) }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, report => reports.push(report)); dialogue.close();
    assert.equal(result.kind, expected);
    if (expected === 'submit') {
      assert.deepEqual(result, { kind: 'submit', result: { prose: 'finished' } });
      assert.deepEqual((captures[0]!.response as { output: unknown[] }).output, []);
      assert.deepEqual(captures[0]!.streamOutput, [item]); assert.equal(reports.length, 1);
    }
  }
});

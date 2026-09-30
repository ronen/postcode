import assert from 'node:assert/strict';
import { test } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { chatGPTInvestigator, openAIInvestigator } from '../src/lib/investigation/openai/adapter.js';
import type { OpenAIExchange } from '../src/lib/investigation/openai/adapter.js';
import { configuredInvestigator } from '../src/lib/investigation/openai/configuration.js';
import { InvestigationUsage } from '../src/lib/investigation/usage.js';
import { usageSummary } from '../src/lib/investigation/reporting.js';
import { usageLines } from '../src/lib/investigation/presentation.js';
import type { InvestigationView } from '../src/lib/investigation/presentation.js';
import type { AgentInput, AttemptReport, ReportedUsage } from '../src/lib/investigation/contracts.js';
import type { RecordId } from '../src/lib/records.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import { runCli } from '../src/lib/cli.js';
import { openSession } from '../src/lib/session.js';
import { temporaryDirectory, interactionDriver } from './cli-helpers.js';

const sentinel = 'postcode-sentinel-secret-not-a-real-key';
const input: AgentInput = { attempt: 'attempt:test' as RecordId, instructions: 'Interpret this module using only supplied evidence.',
  request: { operation: 'functionality', subject: 'module:test' as RecordId, parameters: {} }, responses: [], remaining: { milliseconds: 10000, calls: 5, toolCalls: 10 } };
const providerUsage = { input_tokens: 100, input_tokens_details: { cached_tokens: 20, cache_write_tokens: 30 },
  output_tokens: 50, output_tokens_details: { reasoning_tokens: 10 }, total_tokens: 150 };
function response(overrides: Record<string, unknown> = {}) {
  return { id: 'resp_test', object: 'response', status: 'completed', model: 'gpt-6-sol', service_tier: 'default', usage: providerUsage, output: [], ...overrides };
}
function call(name: string, args: unknown) { return { type: 'function_call', call_id: 'call_1', id: 'fc_1', status: 'completed', name, arguments: JSON.stringify(args) }; }
function http(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }); }
function draft(subject: string, evidence: string[] = []) {
  return { localId: 'root', prose: 'Returns seven.', referent: { description: 'Selected module', subjects: [subject] },
    qualifications: ['Interpretation of supplied captured source.'], evidence, associations: [], children: [], corrections: [], inconsistencies: [] };
}

test('real SDK transports a fresh bounded dialogue with only PostCode functions and no credential in context or capture', async () => {
  const sent: Record<string, any>[] = [], captures: OpenAIExchange[] = [], usage: ReportedUsage[] = [];
  const agent = openAIInvestigator(sentinel, { onExchange: item => captures.push(item), fetch: async (url, options) => {
    assert.equal(String(url), 'https://api.openai.com/v1/responses');
    assert.equal(new Headers(options?.headers).get('authorization'), `Bearer ${sentinel}`);
    const body = JSON.parse(String(options?.body)); sent.push(body);
    if (sent.length === 2) return http(response({ output: [call('submit_investigram', draft(input.request.subject))] }));
    return http(response({ output: [{ type: 'reasoning', id: 'rs_1', summary: [], encrypted_content: 'opaque-test-reasoning' },
      call('request_evidence', { requests: [{ kind: 'source', subject: input.request.subject }] })] }));
  } });
  const dialogue = agent.open(), signal = new AbortController().signal;
  assert.deepEqual(await dialogue.exchange(input, signal, item => usage.push(item)), { kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] });
  const evidence = { status: 'unavailable' as const, records: [], selected: [], limitations: ['Controlled unavailable source'] };
  const submitted = await dialogue.exchange({ ...input, responses: [evidence] }, signal, item => usage.push(item));
  assert.equal(submitted.kind, 'submit');
  dialogue.close();
  const fresh = agent.open();
  await fresh.exchange(input, signal, () => {}); fresh.close();
  assert.deepEqual(sent[0], sent[2], 'new operation must not inherit prior history');
  assert.equal(sent[0]!.model, 'gpt-6-sol');
  assert.deepEqual(sent[0]!.reasoning, { effort: 'medium' });
  assert.equal(sent[0]!.store, false); assert.equal(sent[0]!.service_tier, 'default');
  assert.equal(sent[0]!.parallel_tool_calls, false);
  assert.deepEqual(sent[0]!.tools.map((tool: { name: string; type: string }) => [tool.type, tool.name]), [['function', 'request_evidence'], ['function', 'submit_investigram']]);
  assert.equal(sent[1]!.input.find((item: { type: string }) => item.type === 'function_call_output').output, JSON.stringify([evidence]));
  assert.ok(sent[1]!.input.some((item: { type: string }) => item.type === 'reasoning'));
  assert.doesNotMatch(JSON.stringify({ captures, sent, usage, identity: agent.identity }), new RegExp(sentinel));
  assert.deepEqual(usage[0]!.execution, { model: 'gpt-6-sol', serviceTier: 'default' });
  assert.deepEqual(usage[0]!.categories.map(c => [c.category, c.value, c.includedIn]), [
    ['total', 150, null], ['input', 100, 'total'], ['output', 50, 'total'], ['cached-input', 20, 'input'], ['cache-write-input', 30, 'input'], ['reasoning', 10, 'output'],
  ]);
});

test('provider failure taxonomy preserves codes, excludes echoed credentials, and never retries', async () => {
  for (const [status, code, kind] of [
    [401, 'invalid_api_key', 'configuration-unavailable'], [403, 'permission_denied', 'configuration-unavailable'],
    [404, 'model_not_found', 'configuration-unavailable'], [429, 'rate_limit_exceeded', 'communication-failure'],
    [429, 'insufficient_quota', 'communication-failure'], [429, 'project_spend_limit_exceeded', 'communication-failure'],
    [429, 'organization_spend_limit_exceeded', 'communication-failure'], [429, 'credit_balance_exhausted', 'communication-failure'],
    [500, 'server_error', 'communication-failure'], [400, 'unknown_service_problem', 'communication-failure'],
  ] as const) {
    let requests = 0;
    const captures: OpenAIExchange[] = [];
    const agent = openAIInvestigator(sentinel, { onExchange: item => captures.push(item), fetch: async () => {
      requests++; return http({ error: { code, message: `Echoed credential ${sentinel}`, type: 'provider_error' } }, status);
    } });
    const dialogue = agent.open();
    const result = await dialogue.exchange(input, new AbortController().signal, () => assert.fail('No usage was supplied'));
    dialogue.close();
    assert.equal(result.kind, kind);
    assert.ok('code' in result); assert.equal(result.code, code);
    assert.equal(requests, 1);
    assert.doesNotMatch(JSON.stringify({ result, captures }), new RegExp(sentinel));
  }
  for (const [error, code] of [[new Error(sentinel), 'transport_error'], [new DOMException(sentinel, 'AbortError'), 'request_timeout']] as const) {
    let calls = 0;
    const dialogue = openAIInvestigator(sentinel, { fetch: async () => { calls++; throw error; } }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, () => {}); dialogue.close();
    assert.ok('code' in result); assert.equal(result.code, code); assert.equal(calls, 1);
    assert.doesNotMatch(JSON.stringify(result), new RegExp(sentinel));
  }
});

test('provider refusal, truncation, failure, malformed submission and absent usage remain distinct', async () => {
  const cases = [
    [response({ output: [{ type: 'message', role: 'assistant', content: [{ type: 'refusal', refusal: sentinel }] }] }), 'refused'],
    [response({ status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' } }), 'truncated'],
    [response({ status: 'incomplete', incomplete_details: { reason: 'content_filter' } }), 'refused'],
    [response({ status: 'failed', error: { code: 'server_error', message: sentinel } }), 'communication-failure'],
    [response({ output: [{ ...call('submit_investigram', {}), arguments: '{bad-json' }] }), 'submit'],
    [response({ output: [call('unsupported_tool', {})] }), 'ended'],
    [response({ output: [{ ...call('request_evidence', { requests: [] }), status: 'incomplete' }] }), 'ended'],
    [response({ output: [{ ...call('submit_investigram', {}), status: 'in_progress' }] }), 'ended'],
    [response({ output: [call('submit_investigram', {}), call('request_evidence', {})] }), 'ended'],
    [response({ output: [null] }), 'ended'],
    [response({ output: [{ type: 'message', content: null }] }), 'ended'],
    [response({ usage: null }), 'ended'],
  ] as const;
  for (const [body, kind] of cases) {
    const reports: ReportedUsage[] = [], captures: OpenAIExchange[] = [];
    const dialogue = openAIInvestigator(sentinel, { fetch: async () => http(body), onExchange: item => captures.push(item) }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, item => reports.push(item)); dialogue.close();
    assert.equal(result.kind, kind); assert.equal(reports.length, body.usage ? 1 : 0);
    assert.doesNotMatch(JSON.stringify({ result, reports, captures }), new RegExp(sentinel));
  }
});

test('malformed provider JSON is a safe communication failure rather than a parser defect', async () => {
  for (const body of ['{invalid-json', 'null']) {
    const dialogue = openAIInvestigator(sentinel, { fetch: async () => new Response(body, { headers: { 'content-type': 'application/json' } }) }).open();
    const result = await dialogue.exchange(input, new AbortController().signal, () => {}); dialogue.close();
    assert.equal(result.kind, 'communication-failure');
    assert.ok('code' in result); assert.equal(result.code, 'invalid_provider_response');
  }
});

test('abort and close cancel in-flight SDK transport without retry or a late usage report', async () => {
  for (const end of ['abort', 'close'] as const) {
    let started!: () => void;
    const ready = new Promise<void>(resolve => { started = resolve; });
    let calls = 0, aborted = false;
    const dialogue = openAIInvestigator(sentinel, { fetch: async (_url, options) => {
      calls++; started();
      return new Promise<Response>((_resolve, reject) => options!.signal!.addEventListener('abort', () => {
        aborted = true; reject(new DOMException('Aborted', 'AbortError'));
      }, { once: true }));
    } }).open();
    const controller = new AbortController();
    const pending = assert.rejects(dialogue.exchange(input, controller.signal, () => assert.fail('Late usage')));
    await ready;
    if (end === 'abort') controller.abort(new Error('Controlled interruption')); else dialogue.close();
    await pending; assert.equal(aborted, true); assert.equal(calls, 1); dialogue.close();
  }
});

test('usage grouping preserves returned models and service tiers and does not add token subsets', async () => {
  const agent = openAIInvestigator(sentinel, { fetch: async () => http(response()) });
  const ledger = new InvestigationUsage();
  for (let i = 1; i <= 3; i++) {
    const record = ledger.start(input.attempt, i, agent.identity);
    const dialogue = openAIInvestigator(sentinel, { fetch: async () => http(response({ model: i === 3 ? 'gpt-6-sol-snapshot' : 'gpt-6-sol', service_tier: i === 2 ? 'flex' : 'default' })) }).open();
    await dialogue.exchange(input, new AbortController().signal, usage => { record(usage); record(usage); }); dialogue.close();
  }
  const report = usageSummary([{ usage: ledger.calls() } as AttemptReport]);
  assert.equal(report.calls, 3); assert.equal(report.totals.length, 3);
  assert.deepEqual(report.totals.map(group => group.categories.find(c => c.category === 'total')!.value), [150, 150, 150]);
  assert.match(usageLines(report, 'Session').join('\n'), /reported model gpt-6-sol-snapshot, service tier default/);
});

test('configuration fails closed without probing credentials when disabled or unsupported', async () => {
  let reads = 0;
  const deps = { platform: 'darwin', readCredential: async () => { reads++; return sentinel; } };
  assert.equal((await configuredInvestigator(undefined, deps)).kind, 'disabled');
  assert.equal((await configuredInvestigator('disabled', deps)).kind, 'disabled');
  assert.equal((await configuredInvestigator('other', deps)).kind, 'configuration-unavailable');
  assert.equal((await configuredInvestigator('openai', { ...deps, platform: 'linux' })).kind, 'configuration-unavailable');
  assert.equal(reads, 0);
  for (const readCredential of [async () => undefined, async () => '', async () => 'invalid key', async () => { throw new Error(sentinel); }]) {
    const result = await configuredInvestigator('openai', { platform: 'darwin', readCredential });
    assert.equal(result.kind, 'configuration-unavailable'); assert.doesNotMatch(JSON.stringify(result), new RegExp(sentinel));
  }
  assert.equal((await configuredInvestigator('openai', deps)).kind, 'ready'); assert.equal(reads, 1);
});

test('CLI preflight precedes project opening for shell and mechanical one-shot commands', async () => {
  for (const args of [['shell'], ['modules'], ['summarize', 'entry']]) {
    let stdout = '', stderr = '', calls = 0;
    const exit = await runCli([...args, '--project', '/nonexistent/tsconfig.json'], { cwd: process.cwd(), checkout: process.cwd(),
      stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
      configureInvestigator: async () => { calls++; return { kind: 'configuration-unavailable', diagnostic: 'Controlled unavailable setup' }; } });
    assert.equal(exit, 2); assert.equal(calls, 1); assert.equal(stdout, ''); assert.equal(stderr, 'Controlled unavailable setup\n');
  }
});

test('SDK service failure after evidence retains usage and acquisition, but a later request starts fresh', async t => {
  const root = temporaryDirectory(t, 'postcode-openai-failure-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), 'export function entry() { return 7; }');
  let calls = 0;
  const captures: OpenAIExchange[] = [];
  const agent = openAIInvestigator(sentinel, { onExchange: item => captures.push(item), fetch: async (_url, options) => {
    calls++;
    const body = JSON.parse(String(options?.body));
    if (calls % 2 === 0) return http({ error: { code: 'insufficient_quota', message: sentinel } }, 429);
    assert.equal(body.input.length, 1, 'retry is a fresh dialogue, not resumption');
    const subject = JSON.parse(body.input[0].content).request.subject;
    return http(response({ output: [call('request_evidence', { requests: [{ kind: 'source', subject }] })] }));
  } });
  const opened = await openSession({ configPath }, { investigation: { agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  t.after(() => opened.session.close());
  const command = { lens: 'summarize' as const, selector: 'entry', presentation: { format: 'json' as const, sourceDetail: false } };
  const first = (await opened.session.execute(command)).view as InvestigationView;
  const second = (await opened.session.execute(command)).view as InvestigationView;
  assert.equal(calls, 4); assert.equal(second.accounts.length, 0); assert.equal(second.result!.reused, false);
  assert.equal(first.usage.missingCalls, 1); assert.equal(second.usage.missingCalls, 2);
  assert.equal(second.usage.totals[0]!.categories.find(c => c.category === 'total')!.value, 300);
  assert.ok(first.usage.attempts[0]!.suppliedEvidence.length > 0);
  assert.deepEqual(first.usage.attempts[0]!.suppliedEvidence, second.usage.attempts[1]!.suppliedEvidence);
  assert.doesNotMatch(JSON.stringify({ first, second, captures }), new RegExp(sentinel));
});

for (const route of ['api-key', 'chatgpt-plan']) for (const format of ['unicode', 'json'] as const) test(`offline real-adapter CLI shell covers source acquisition, retention, usage and credential exclusion in ${format} via ${route}`, async t => {
  const root = temporaryDirectory(t, 'postcode-openai-');
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), 'export function entry() { return 7; }');
  const inputStream = Object.assign(new PassThrough(), { isTTY: true });
  const driver = interactionDriver(() => inputStream.end());
  const batches: ObservationBatch[] = [], captures: OpenAIExchange[] = [];
  let calls = 0, stdout = '', stderr = '', prompts = 0, subject = '';
  const createAgent = (options: Parameters<typeof openAIInvestigator>[1]) => route === 'api-key' ? openAIInvestigator(sentinel, options) : chatGPTInvestigator({ token: async () => sentinel, watch: () => () => {} }, options);
  const transportResponse = (body: ReturnType<typeof response>) => {
    if (route === 'api-key') return http(body);
    const envelope = { ...body, model: 'gpt-5.6-sol', output: [] };
    const events = [{ type: 'response.created', response: { ...envelope, status: 'in_progress' } },
      ...(body.output as any[]).flatMap((item, output_index) => [
        { type: 'response.output_item.added', output_index, item: { ...item, namespace: 'postcode', arguments: '' } },
        { type: 'response.output_item.done', output_index, item: { ...item, namespace: 'postcode' } },
      ]), { type: 'response.completed', response: envelope }];
    return new Response(new TextEncoder().encode(events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('')));
  };
  const agent = createAgent( { onExchange: item => captures.push(item), fetch: async (_url, options) => {
    calls++;
    const body = JSON.parse(String(options?.body));
    const latest = body.input.filter((item: { role: string }) => item.role === 'user').at(-1);
    subject = JSON.parse(latest.content).request.subject;
    if (calls === 1) return transportResponse(response({ output: [call('request_evidence', { requests: [{ kind: 'source', subject }] })] }));
    const result = JSON.parse(body.input.find((item: { type: string }) => item.type === 'function_call_output').output)[0];
    assert.equal(result.status, 'available');
    return transportResponse(response({ output: [call('submit_investigram', draft(subject, result.selected))] }));
  } });
  const exit = await runCli(['shell', '--project', path.join(root, 'tsconfig.json'), ...(format === 'json' ? ['--json'] : [])], {
    cwd: root, checkout: root, input: inputStream,
    configureInvestigator: async () => ({ kind: 'ready', agent }),
    stdout: text => { stdout += text; if (text.endsWith('postcode> ')) driver.run(() => {
      inputStream.write(['summarize entry\n', 'summarize entry\n', 'usage\n', 'exit\n'][prompts++]!);
    }); }, stderr: text => { stderr += text; },
    sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  driver.verify(); assert.equal(exit, 0); assert.equal(calls, 2); assert.match(stderr, /sent to OpenAI/);
  assert.match(stdout, /Returns seven/);
  const views = batches.flatMap(batch => batch.records.filter(record => record.kind === 'qualified-view').map(record => record.value as InvestigationView));
  assert.equal(views.length, 3);
  for (const view of views) { assert.equal(view.usage.calls, 2); assert.equal(view.usage.totals[0]!.categories.find(c => c.category === 'total')!.value, 300); }
  assert.equal(views[1]!.result!.reused, true);
  assert.equal(captures[0]!.request.model, route === 'api-key' ? 'gpt-6-sol' : 'gpt-5.6-sol');
  assert.equal(views[0]!.usage.totals[0]!.agent.configuration.billingRoute, route === 'api-key' ? 'openai-api' : 'chatgpt-plan');
  if (route === 'chatgpt-plan') { assert.match(stderr, /ChatGPT plan usage/); assert.match(JSON.stringify(views[0]!.usage.limitations), /monetary attribution is unavailable/); }
  assert.doesNotMatch(JSON.stringify({ stdout, stderr, batches, captures }), new RegExp(sentinel));
});


test('only an explicit submission call classifies malformed arguments as an invalid submission on either route', async () => {
  for (const subscription of [false, true]) {
    for (const name of ['request_evidence', 'unsupported_tool', 'submit_investigram']) {
      const body = response({ output: [{ ...call(name, {}), namespace: 'postcode', arguments: '{bad-json' }] });
      let requests = 0; const reports: ReportedUsage[] = [];
      const fetcher: typeof fetch = async () => { requests++; return subscription
        ? new Response(`data: ${JSON.stringify({ type: 'response.completed', response: body })}\n\n`, { headers: { 'content-type': 'text/event-stream' } }) : http(body); };
      const agent = subscription ? chatGPTInvestigator({ token: async () => sentinel, watch: () => () => {} }, { fetch: fetcher }) : openAIInvestigator(sentinel, { fetch: fetcher });
      const dialogue = agent.open();
      try {
        const result = await dialogue.exchange(input, new AbortController().signal, report => reports.push(report));
        assert.deepEqual(result, name === 'submit_investigram' ? { kind: 'submit', result: null } : { kind: 'ended' });
        assert.equal(requests, 1); assert.equal(reports.length, 1);
      } finally { dialogue.close(); }
    }
  }
});

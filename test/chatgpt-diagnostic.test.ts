import assert from 'node:assert/strict';
import { test } from 'node:test';

const diagnostic = await import(new URL('../../scripts/module-investigation/diagnose-chatgpt.mjs', import.meta.url).href);
const secret = 'sentinel-must-not-leave-diagnostic';
test('diagnostic retains response structure and numeric usage without arbitrary strings or keys', async () => {
  const body = { id: secret, model: secret, status: 'failed', error: { message: secret }, [secret]: secret,
    usage: { input_tokens: 10, output_tokens: secret, total_tokens: 10 }, output: [{ type: secret }] };
  const report = await diagnostic.inspectResponse(new Response(JSON.stringify(body), { headers: { 'content-type': secret, 'x-request-id': secret } }));
  assert.equal(report.contentType, 'other'); assert.equal(report.requestIdPresent, true);
  assert.equal(report.body.format, 'json'); assert.equal(report.body.response.status, 'failed');
  assert.equal(report.body.response.reportedTokenUsage.input_tokens, 10);
  assert.equal(report.body.response.reportedTokenUsage.output_tokens, null);
  assert.equal(JSON.stringify(report).includes(secret), false);
  const event = diagnostic.bodyStructure(`data: ${JSON.stringify({ type: 'response.completed', response: body })}\n\n`, true);
  assert.equal(event.format, 'event-stream'); assert.equal(event.events[0].event, 'response.completed');
  assert.equal(JSON.stringify(event).includes(secret), false);
  const item = diagnostic.bodyStructure(`data: ${JSON.stringify({ type: 'response.output_item.done', output_index: 1,
    item: { type: 'function_call', name: 'submit_investigram', namespace: 'postcode', call_id: secret, arguments: JSON.stringify({ prose: secret }) } })}\n\n`, true);
  assert.deepEqual(item.events[0].item, { kind: 'function_call', function: 'submit_investigram', namespaceMatches: true, callIdPresent: true, argumentsKind: 'object' });
  assert.equal(JSON.stringify(item).includes(secret), false);
});
test('diagnostic bounds capture, leaves original body readable, and distinguishes absent headers', async () => {
  const wire = new Response(new TextEncoder().encode('x'.repeat(100)));
  const report = await diagnostic.inspectResponse(wire, 20);
  assert.equal(report.capturedBytes, 20); assert.equal(report.body.complete, false);
  assert.equal(report.contentType, 'absent'); assert.equal((await wire.text()).length, 100);
});
test('diagnostic makes one inference attempt and preserves unknown cost on missing stream headers', async () => {
  let posts = 0;
  const credentials = { session: async () => ({ token: async () => secret, watch: () => () => {} }) };
  const result = await diagnostic.diagnose(credentials, async (url: string) => {
    if (String(url).endsWith('/models')) return Response.json({ models: [{ slug: 'gpt-5.6-sol', visibility: 'list' }] });
    posts++; return new Response(null);
  });
  assert.equal(posts, 1); assert.equal(result.inferenceRequests, 1); assert.equal(result.check, 'not-completed');
  assert.equal(result.wire[0].body.format, 'empty'); assert.match(result.monetaryAttribution, /unknown/);
  assert.equal(JSON.stringify(result).includes(secret), false);
});

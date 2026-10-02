/** Explicit, at-most-one-inference diagnostic. Uses PostCode's credential boundary;
 * emits allowlisted structure only, never raw headers, bodies or credentials. */
import { pathToFileURL } from 'node:url';
import { checkChatGPTConnection, productionChatGPTCredentials } from '../../_build/src/lib/investigation/openai/auth-command.js';

const kind = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
const statuses = ['completed', 'failed', 'incomplete', 'queued', 'in_progress', 'cancelled'];
const events = ['response.created', 'response.in_progress', 'response.completed', 'response.failed', 'response.incomplete', 'response.output_item.added', 'response.output_item.done', 'response.function_call_arguments.delta', 'response.function_call_arguments.done', 'response.output_text.delta', 'response.output_text.done', 'error'];
function itemStructure(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return { kind: kind(item) };
  let args;
  try { args = JSON.parse(item.arguments); } catch { /* No arbitrary text escapes. */ }
  return { kind: ['message', 'reasoning', 'function_call'].includes(item.type) ? item.type : 'other',
    function: ['request_evidence', 'submit_investigram'].includes(item.name) ? item.name : 'other',
    namespaceMatches: item.namespace === 'postcode', callIdPresent: typeof item.call_id === 'string' && item.call_id.length > 0,
    argumentsKind: args === undefined ? 'not-json' : kind(args) };
}
function responseShape(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { kind: kind(value) };
  const fields = ['id', 'object', 'model', 'status', 'output', 'usage', 'error', 'message', 'code', 'detail'];
  const usage = value.usage && typeof value.usage === 'object' ? Object.fromEntries(
    ['input_tokens', 'output_tokens', 'total_tokens'].map(key => [key,
      typeof value.usage[key] === 'number' && Number.isFinite(value.usage[key]) && value.usage[key] >= 0 ? value.usage[key] : null])) : null;
  return { kind: 'object', fields: Object.fromEntries(fields.filter(key => key in value).map(key => [key, kind(value[key])])),
    otherFieldCount: Object.keys(value).filter(key => !fields.includes(key)).length,
    status: statuses.includes(value.status) ? value.status : null,
    selectedModelMatches: typeof value.model === 'string' ? value.model === 'gpt-5.6-sol' : null,
    outputKinds: Array.isArray(value.output) ? value.output.slice(0, 20).map(item =>
      ['message', 'reasoning', 'function_call'].includes(item?.type) ? item.type : 'other') : null,
    reportedTokenUsage: usage };
}
export function bodyStructure(text, complete) {
  try { return { format: 'json', complete, response: responseShape(JSON.parse(text)) }; } catch { /* Try event framing below. */ }
  const frames = text.replaceAll('\r\n', '\n').split('\n\n');
  if (!complete) frames.pop();
  const reports = [];
  for (const frame of frames.slice(0, 100)) {
    const data = frame.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
    if (!data) continue;
    if (data === '[DONE]') { reports.push({ event: 'done' }); continue; }
    try {
      const value = JSON.parse(data);
      reports.push({ event: events.includes(value?.type) ? value.type : 'other',
        ...(['response.output_item.added', 'response.output_item.done'].includes(value?.type)
          ? { item: itemStructure(value.item), index: Number.isSafeInteger(value.output_index) && value.output_index >= 0 ? value.output_index : null } : {}),
        ...(value && typeof value === 'object' && 'response' in value ? { response: responseShape(value.response) } : {}) });
    } catch { reports.push({ event: 'invalid-json' }); }
  }
  return { format: reports.length ? 'event-stream' : /^\s*<(?:!doctype|html)/i.test(text) ? 'html-like' : text.length ? 'unrecognized' : 'empty', complete, events: reports };
}
export async function inspectResponse(response, byteLimit = 131072) {
  const reader = response.clone().body?.getReader();
  let bytes = 0, complete = !reader, readFailed = false;
  const chunks = [];
  try {
    while (reader && bytes < byteLimit) {
      const part = await reader.read();
      if (part.done) { complete = true; break; }
      const chunk = part.value.subarray(0, byteLimit - bytes);
      chunks.push(Buffer.from(chunk)); bytes += chunk.byteLength;
    }
  } catch { readFailed = true; }
  finally {
    // A tee cancellation can wait for the other branch: the adapter consumes it next.
    if (reader && !complete) void reader.cancel().catch(() => {});
    reader?.releaseLock();
  }
  const contentType = response.headers.get('content-type');
  return { status: response.status, contentType: contentType === null ? 'absent' : contentType.includes('text/event-stream') ? 'event-stream' : contentType.includes('application/json') ? 'json' : 'other',
    requestIdPresent: response.headers.has('x-request-id'), capturedBytes: bytes, readFailed,
    body: bodyStructure(Buffer.concat(chunks).toString('utf8'), complete) };
}
export async function diagnose(credentials, fetcher = fetch) {
  const started = performance.now();
  const result = { model: 'gpt-5.6-sol', reasoning: 'medium', billingRoute: 'chatgpt-plan', inferenceRequests: 0, wire: [], check: 'not-completed', elapsedMilliseconds: 0,
    monetaryAttribution: 'unknown; a failed or interrupted request does not establish zero consumption or charges' };
  try {
    await checkChatGPTConnection(credentials, AbortSignal.timeout(30000), async (url, options) => {
      const inference = String(url) === 'https://api.openai.com/v1/responses';
      if (inference && ++result.inferenceRequests > 1) throw new Error('Diagnostic inference limit');
      const response = await fetcher(url, options);
      if (inference) result.wire.push(await inspectResponse(response));
      return response;
    });
    result.check = 'connected';
  } catch { result.check = 'not-completed'; }
  result.elapsedMilliseconds = Math.round(performance.now() - started);
  return result;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await diagnose(await productionChatGPTCredentials());
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    if (result.check !== 'connected') process.exitCode = 2;
  } catch {
    process.stderr.write('Diagnostic could not initialize PostCode credentials. No credential or raw error is displayed.\n');
    process.exitCode = 2;
  }
}

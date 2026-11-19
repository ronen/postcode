import OpenAI from 'openai';
import { Stream } from 'openai/core/streaming';
import { CredentialError } from './credential-store.js';
import type { ChatGPTSession } from './chatgpt-credentials.js';
import type { Response, ResponseCreateParams, ResponseInputItem } from 'openai/resources/responses/responses.js';
import type { AgentFailure, AgentIdentity, ReportedUsage, UsageCategory } from '../contracts.js';
import type { FunctionTool } from 'openai/resources/responses/responses.js';
import { referenceInstructions, type ReferenceAudit } from './references.js';
export type { ReferenceAudit } from './references.js';
import { CompletedStreamOutput } from './stream-output.js';

export const openAIIdentity: AgentIdentity = Object.freeze({ provider: 'openai', model: 'gpt-6-sol', origin: 'hosted',
  configuration: Object.freeze({ adapter: 'postcode/openai-responses@7', authenticationRoute: 'api-key', billingRoute: 'openai-api', sdk: 'openai@7.25.0', reasoningEffort: 'medium', serviceTier: 'default', store: false, references: 'postcode/investigator-references@3', characterGuard: 'canonical-domain-exchanges', retries: 0, maxOutputTokens: 16000 }) });

export interface OpenAIExchange {
  readonly request: ResponseCreateParams;
  /** Available wire bindings are not evidence exposure; resolutions cover typed reply fields. */
  readonly references: ReferenceAudit;
  /** Sanitized wire body, including malformed responses for assessment diagnosis. */
  readonly response?: unknown;
  /** Finalized stream items supplied separately from an empty completed envelope. */
  readonly streamOutput?: readonly unknown[];
  readonly failure?: AgentFailure;
}

export const chatGPTIdentity: AgentIdentity = Object.freeze({ provider: 'openai', model: 'gpt-5.6-sol', origin: 'hosted',
  configuration: Object.freeze({ adapter: 'postcode/chatgpt-responses@7', sdk: 'openai@7.25.0', authenticationRoute: 'chatgpt-sign-in',
    billingRoute: 'chatgpt-plan', reasoningEffort: 'medium', store: false, streaming: true, references: 'postcode/investigator-references@3', characterGuard: 'canonical-domain-exchanges', retries: 0 }) });
interface TransportOptions { fetch?: typeof fetch; onExchange?: (exchange: OpenAIExchange) => void }
type Terminal = { readonly kind: 'ended' | 'refused' | 'truncated' } | AgentFailure;
/**
 * A typed dialog protocol carried by the hosted transport: its two functions and the
 * structural translation of its reference fields. The transport defines no investigation semantics.
 */
export interface WireProtocol<I extends { readonly instructions: string }, R> {
  readonly functions: FunctionTool[];
  readonly requestFunction: string;
  readonly submitFunction: string;
  readonly description: string;
  /** Recorded in the agent identity to identify the typed protocol. */
  readonly protocol?: string;
  codec(): {
    message(input: I): { readonly content: Readonly<Record<string, unknown>>; readonly responses: unknown };
    /** Null when the arguments are not a well-formed request. */
    tools(args: unknown): R | null;
    /** `malformed` when the submission arguments could not be parsed at all. */
    submission(args: unknown, malformed: boolean): R;
    audit(): ReferenceAudit;
    close(): void;
  };
}
/** The same hosted transports carrying another typed dialog protocol. */
export function hostedAgent<I extends { readonly instructions: string }, R>(credentials: { readonly apiKey: string } | { readonly session: ChatGPTSession },
  protocol: WireProtocol<I, R>, options: TransportOptions = {}) {
  if ('apiKey' in credentials) {
    if (!credentials.apiKey || /\s/.test(credentials.apiKey)) throw new Error('Invalid OpenAI credential');
    const apiKey = credentials.apiKey;
    return hosted({ token: async () => apiKey, watch: () => () => {} }, false, options, protocol);
  }
  return hosted(credentials.session, true, options, protocol);
}
/** Parent-only transport owns credentials. Only sanitized replies and usage leave this boundary. */
function hosted<I extends { readonly instructions: string }, R>(session: ChatGPTSession, subscription: boolean, options: TransportOptions, protocol: WireProtocol<I, R>) {
  const base = subscription ? chatGPTIdentity : openAIIdentity;
  const identity: AgentIdentity = protocol.protocol ? Object.freeze({ ...base, configuration: Object.freeze({ ...base.configuration, protocol: protocol.protocol }) }) : base;
  const secrets = new Set<string>();
  const redact = (value: string) => { for (const secret of secrets) value = value.split(secret).join('[redacted credential]'); return value; };
  const safe = <T>(value: T): T => {
    const visit = (v: unknown): unknown => typeof v === 'string' ? redact(v) : Array.isArray(v) ? v.map(visit)
      : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, item]) => [redact(k), visit(item)])) : v;
    return visit(value) as T;
  };
  function failure(code: unknown, status?: number, body?: unknown, requestId?: string | null): AgentFailure {
    const cleanCode = typeof code === 'string' && /^[a-zA-Z0-9_.-]{1,100}$/.test(code) && ![...secrets].some(secret => code.includes(secret)) ? code : 'unclassified_provider_error';
    const auth = status === 401 || status === 403 || ['invalid_api_key', 'model_not_found', 'subscription_sharing_unsupported_capability', 'subscription_sharing_user_not_eligible', 'subscription_sharing_route_not_supported', 'subscription_sharing_invalid_user', 'chatpass_v2_scope_not_authorized', 'chatpass_v2_invalid_authorization_context'].includes(cleanCode);
    const exhaustion = ['insufficient_quota', 'organization_spend_limit_exceeded', 'project_spend_limit_exceeded', 'organization_usage_limit_exceeded', 'credit_balance_exhausted'].includes(cleanCode);
    return { ...(body !== undefined || status !== undefined ? { provider: safe({ status: status ?? null, body: body ?? null, requestId: requestId ?? null }) } : {}), kind: auth ? 'configuration-unavailable' : 'communication-failure', code: cleanCode,
      diagnostic: auth ? 'OpenAI authentication or configured model access is unavailable.'
        : cleanCode === 'subscription_sharing_usage_limit_exceeded' ? 'ChatGPT app usage limit reached. Review https://chatgpt.com/settings/usage; no API billing fallback or automatic inference retry was made.'
        : exhaustion ? 'OpenAI reports quota, credit or spending-limit exhaustion. Check provider billing and limits.'
          : status === 429 ? 'OpenAI rejected the request at a rate or usage limit; the precise restriction is unconfirmed.'
            : `OpenAI request failed${status ? ` (HTTP ${status})` : ''}; no automatic retry was made. Unclassified errors are not assumed transient.` };
  }

  return {
    identity,
    open() {
      const controller = new AbortController();
      const references = protocol.codec();
      const stopWatching = session.watch(controller);
      let history: ResponseInputItem[] = [], pending: string | undefined, closed = false;
      return {
        async exchange(input: I, signal: AbortSignal, reportUsage: (usage: ReportedUsage) => void): Promise<R | Terminal> {
          try {
            if (closed) throw new Error('OpenAI dialogue is closed');
            const requestSignal = AbortSignal.any([signal, controller.signal]);
            requestSignal.throwIfAborted();
            const encoded = references.message(input);
            if (pending) history.push({ type: 'function_call_output', call_id: pending, output: JSON.stringify(encoded.responses) });
            else if (history.length) throw new Error('OpenAI dialogue has no pending evidence request');
            history.push({ role: 'user', content: JSON.stringify({ ...encoded.content,
              ...(pending ? {} : { responses: encoded.responses }) }) });
            pending = undefined;
            let token: string;
            try { token = await session.token(requestSignal); secrets.add(token); }
            catch (error) {
              if (signal.aborted) throw signal.reason;
              return { kind: 'configuration-unavailable', code: error instanceof CredentialError ? error.code : 'credential_unavailable',
                diagnostic: error instanceof CredentialError ? error.message : 'ChatGPT credentials are unavailable; interactive sign-in may be required. No API billing fallback was used.' };
            }
            let failureBody: unknown;
            const transport: typeof fetch = async (url, init) => {
              const response = await (options.fetch ?? fetch)(url, { ...init, redirect: 'error' });
              if (!response.ok) {
                try { failureBody = safe(await response.clone().json()); } catch { failureBody = null; }
              }
              return response;
            };
            const client = new OpenAI({ apiKey: token, adminAPIKey: null, webhookSecret: null, baseURL: 'https://api.openai.com/v1', organization: null, project: null,
              maxRetries: 0, timeout: 180000, logLevel: 'off', fetch: transport });
            const request: ResponseCreateParams = safe({ model: identity.model, reasoning: { effort: 'medium' },
              ...(subscription ? { stream: true as const } : { service_tier: 'default' as const, stream: false as const, max_output_tokens: 16000 }), store: false, include: ['reasoning.encrypted_content'],
              instructions: `${input.instructions}\n\n${referenceInstructions}`, input: history, tools: subscription ? [{ type: 'namespace', name: 'postcode', description: protocol.description, tools: protocol.functions }] : protocol.functions, parallel_tool_calls: false, tool_choice: 'auto' });
            let wire: globalThis.Response;
            try { wire = await client.responses.create(request, { signal: requestSignal }).asResponse(); }
            catch (error) {
              if (requestSignal.aborted) throw requestSignal.reason;
              if (!(error instanceof OpenAI.OpenAIError)) throw error;
              const problem = error instanceof OpenAI.APIError ? failure(error.code ?? (error instanceof OpenAI.APIConnectionTimeoutError ? 'request_timeout'
                : error instanceof OpenAI.APIConnectionError ? 'transport_error' : undefined), error.status, failureBody ?? error.error, error.requestID) : failure(undefined);
              options.onExchange?.({ request, references: safe(references.audit()), failure: problem });
              return problem;
            }
            let body: unknown;
            const streamEvents: string[] = [];
            const completedOutput = new CompletedStreamOutput();
            let responseIssue = 'invalid_provider_response';
            try {
              if (subscription) {
                // Some subscription responses omit Content-Type despite carrying SSE.
                // Parse the requested stream; framing and an explicit terminal still
                // determine success. An explicitly incompatible type remains an error.
                const contentType = wire.headers.get('content-type');
                if (contentType !== null && !contentType.includes('text/event-stream')) { responseIssue = 'unexpected_response_content_type'; throw new SyntaxError(); }
                if (!wire.body) { responseIssue = 'stream_ended_without_terminal'; throw new SyntaxError(); }
                const stream = Stream.fromSSEResponse<Record<string, unknown>>(wire, new AbortController(), client);
                for await (const event of stream) {
                  if (streamEvents.length < 100) streamEvents.push(typeof event.type === 'string' ? event.type : '[missing event type]');
                  completedOutput.observe(event);
                  if (event.type === 'response.completed' || event.type === 'response.failed' || event.type === 'response.incomplete') {
                    body = safe(event.response);
                    if (!body || typeof body !== 'object' || Array.isArray(body) || ('status' in body && `response.${body.status}` !== event.type)) {
                      responseIssue = 'inconsistent_terminal_response'; throw new SyntaxError();
                    }
                    // Response.status is optional in the provider schema. The terminal
                    // event supplies status when omitted; contradictory status is rejected.
                    body = { ...body, status: event.type.slice('response.'.length) };
                    break;
                  }
                  // Deltas and output-item completion are never accepted results.
                  if (event.type === 'error') {
                    const problem = failure(event.code, wire.status, event, wire.headers.get('x-request-id'));
                    options.onExchange?.({ request, references: safe(references.audit()), failure: problem }); return problem;
                  }
                }
                if (body === undefined) { responseIssue = 'stream_ended_without_terminal'; throw new SyntaxError(); }
              } else body = safe(await wire.json());
            }
            catch (error) {
              if (requestSignal.aborted) throw requestSignal.reason;
              const problem = error instanceof OpenAI.APIError ? failure(error.code, wire.status, error.error, wire.headers.get('x-request-id')) : failure(responseIssue, wire.status, { contentType: wire.headers.get('content-type'), observedEvents: streamEvents }, wire.headers.get('x-request-id'));
              options.onExchange?.({ request, references: safe(references.audit()), failure: problem });
              return problem;
            }
            if (!body || typeof body !== 'object' || !('status' in body)) {
              const problem = failure('invalid_provider_response');
              options.onExchange?.({ request, references: safe(references.audit()), response: body, failure: problem });
              return problem;
            }
            // The SDK's raw-response route lets us reject malformed wire shapes
            // before convenience parsing can turn them into incidental TypeErrors.
            let response = body as Response;
            // Account before interpreting status, including refused, incomplete and failed responses.
            const usage = providerUsage(response);
            if (usage && !closed) reportUsage(usage);
            if (closed || requestSignal.aborted) throw requestSignal.reason ?? new Error('OpenAI dialogue closed');
            const streamOutput = subscription && response.status === 'completed' && Array.isArray(response.output) && response.output.length === 0
              ? safe(completedOutput.complete(response as unknown as Record<string, unknown>)) : null;
            try {
              if (response.status === 'failed') return failure(response.error?.code, wire.status, response, wire.headers.get('x-request-id'));
              if (response.status === 'incomplete') return { kind: response.incomplete_details?.reason === 'content_filter' ? 'refused' : 'truncated' };
              if (response.status !== 'completed' || !Array.isArray(response.output)) return { kind: 'ended' };
              if (subscription && response.output.length === 0) {
                if (!streamOutput) return { kind: 'ended' };
                // Keep the captured terminal body unchanged. Resolve completed items
                // only after terminal success, before existing tool/domain validation.
                response = { ...response, output: streamOutput as Response['output'] };
              }
              if (response.output.some(item => !item || typeof item !== 'object' ||
                  (item.type === 'message' && !Array.isArray(item.content)))) return { kind: 'ended' };
              if (response.output.some(item => item.type === 'message' && item.content.some(part => part?.type === 'refusal'))) return { kind: 'refused' };
              const calls = response.output.filter(item => item.type === 'function_call');
              if (calls.length !== 1) return { kind: 'ended' };
              const call = calls[0]!;
              if ('status' in call && call.status !== 'completed') return { kind: 'ended' };
              if (subscription && call.namespace !== 'postcode') return { kind: 'ended' };
              if (typeof call.call_id !== 'string' || !call.call_id || typeof call.arguments !== 'string') return { kind: 'ended' };
              if (call.name !== protocol.submitFunction && call.name !== protocol.requestFunction) return { kind: 'ended' };
              let args: unknown;
              let parsed = true;
              try { args = JSON.parse(call.arguments); } catch { parsed = false; }
              if (call.name === protocol.submitFunction) {
                // A protocol with bounded repair answers a rejected submission in the next exchange, as this call's
                // output. Keep the call in history as the pending one; a protocol without repair simply closes.
                if (response.output.every(item => item.type === 'function_call' || item.type === 'message' || item.type === 'reasoning')) {
                  for (const item of response.output) history.push(item);
                  pending = call.call_id;
                }
                return references.submission(parsed ? args : null, !parsed);
              }
              if (!parsed) return { kind: 'ended' };
              const requested = references.tools(args);
              if (requested === null) return { kind: 'ended' };
              for (const item of response.output) {
                if (item.type !== 'function_call' && item.type !== 'message' && item.type !== 'reasoning') return { kind: 'ended' };
                history.push(item);
              }
              pending = call.call_id;
              return requested;
            } finally {
              options.onExchange?.({ request, references: safe(references.audit()), response: body, ...(streamOutput ? { streamOutput } : {}) });
            }
          } catch (error) {
            if (error instanceof CredentialError) return { kind: 'configuration-unavailable', code: error.code, diagnostic: error.message };
            throw error;
          }
        },
        close() { closed = true; stopWatching(); controller.abort(); history = []; pending = undefined; references.close(); },
      };
    },
  };
}

function providerUsage(response: Response): ReportedUsage | null {
  if (!response.usage) return null;
  const usage = response.usage;
  const categories: UsageCategory[] = [];
  const add = (category: string, value: number | undefined, includedIn: string | null) => {
    if (value !== undefined) categories.push({ category, unit: 'tokens', value, includedIn });
  };
  add('total', usage.total_tokens, null);
  add('input', usage.input_tokens, 'total');
  add('output', usage.output_tokens, 'total');
  add('cached-input', usage.input_tokens_details?.cached_tokens, 'input');
  add('cache-write-input', usage.input_tokens_details?.cache_write_tokens, 'input');
  add('reasoning', usage.output_tokens_details?.reasoning_tokens, 'output');
  return { source: 'provider', execution: { model: response.model, serviceTier: response.service_tier ?? null }, categories };
}

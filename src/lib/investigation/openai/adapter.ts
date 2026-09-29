import OpenAI from 'openai';
import type { Response, ResponseCreateParamsNonStreaming, ResponseInputItem } from 'openai/resources/responses/responses.js';
import type { AgentFailure, AgentIdentity, AgentReply, InvestigatorAgent, InvestigatorTool, ReportedUsage, UsageCategory } from '../contracts.js';
import { investigatorFunctions } from './protocol.js';

export const openAIIdentity: AgentIdentity = Object.freeze({ provider: 'openai', model: 'gpt-6-sol', origin: 'hosted',
  configuration: Object.freeze({ adapter: 'postcode/openai-responses@1', sdk: 'openai@7.25.0', reasoningEffort: 'medium', serviceTier: 'default', store: false, retries: 0, maxOutputTokens: 16000 }) });

export interface OpenAIExchange {
  readonly request: ResponseCreateParamsNonStreaming;
  /** Sanitized wire body, including malformed responses for assessment diagnosis. */
  readonly response?: unknown;
  readonly failure?: AgentFailure;
}

/** Private transport owns the key. Never pass a client, headers or SDK errors upstream. */
export function openAIInvestigator(apiKey: string, options: {
  /** Offline transport substitution; the production route and headers remain fixed. */
  fetch?: typeof fetch;
  /** Development assessment capture; excludes headers, credential values and SDK errors. */
  onExchange?: (exchange: OpenAIExchange) => void;
} = {}): InvestigatorAgent {
  if (!apiKey || /\s/.test(apiKey)) throw new Error('Invalid OpenAI credential');
  const redact = (value: string) => value.split(apiKey).join('[redacted credential]');
  const safe = <T>(value: T): T => JSON.parse(redact(JSON.stringify(value))) as T;
  const client = new OpenAI({ apiKey, adminAPIKey: null, webhookSecret: null, baseURL: 'https://api.openai.com/v1', organization: null, project: null,
    maxRetries: 0, timeout: 180000, logLevel: 'off', ...(options.fetch ? { fetch: options.fetch } : {}) });

  function failure(code: unknown, status?: number): AgentFailure {
    const cleanCode = typeof code === 'string' && /^[a-zA-Z0-9_.-]{1,100}$/.test(code) && !code.includes(apiKey) ? code : 'unclassified_provider_error';
    const auth = status === 401 || status === 403 || ['invalid_api_key', 'model_not_found'].includes(cleanCode);
    const exhaustion = ['insufficient_quota', 'organization_spend_limit_exceeded', 'project_spend_limit_exceeded', 'organization_usage_limit_exceeded', 'credit_balance_exhausted'].includes(cleanCode);
    return { kind: auth ? 'configuration-unavailable' : 'communication-failure', code: cleanCode,
      diagnostic: auth ? 'OpenAI authentication or configured model access is unavailable.'
        : exhaustion ? 'OpenAI reports quota, credit or spending-limit exhaustion. Check provider billing and limits.'
          : status === 429 ? 'OpenAI rejected the request at a rate or usage limit; the precise restriction is unconfirmed.'
            : `OpenAI request failed${status ? ` (HTTP ${status})` : ''}; no automatic retry was made. Unclassified errors are not assumed transient.` };
  }

  return {
    identity: openAIIdentity,
    open() {
      const controller = new AbortController();
      let history: ResponseInputItem[] = [], pending: string | undefined, closed = false;
      return {
        async exchange(input, signal, reportUsage): Promise<AgentReply> {
          if (closed) throw new Error('OpenAI dialogue is closed');
          const requestSignal = AbortSignal.any([signal, controller.signal]);
          requestSignal.throwIfAborted();
          if (pending) history.push({ type: 'function_call_output', call_id: pending, output: JSON.stringify(input.responses) });
          else if (history.length) throw new Error('OpenAI dialogue has no pending evidence request');
          history.push({ role: 'user', content: JSON.stringify({ request: input.request, remaining: input.remaining,
            ...(pending ? {} : { responses: input.responses }) }) });
          pending = undefined;
          const request: ResponseCreateParamsNonStreaming = safe({ model: openAIIdentity.model, reasoning: { effort: 'medium' },
            service_tier: 'default', store: false, stream: false, max_output_tokens: 16000, include: ['reasoning.encrypted_content'],
            instructions: input.instructions, input: history, tools: investigatorFunctions, parallel_tool_calls: false, tool_choice: 'auto' });
          let wire: globalThis.Response;
          try { wire = await client.responses.create(request, { signal: requestSignal }).asResponse(); }
          catch (error) {
            if (requestSignal.aborted) throw requestSignal.reason;
            if (!(error instanceof OpenAI.OpenAIError)) throw error;
            const problem = error instanceof OpenAI.APIError ? failure(error.code ?? (error instanceof OpenAI.APIConnectionTimeoutError ? 'request_timeout'
              : error instanceof OpenAI.APIConnectionError ? 'transport_error' : undefined), error.status) : failure(undefined);
            options.onExchange?.({ request, failure: problem });
            return problem;
          }
          let body: unknown;
          try { body = safe(await wire.json()); }
          catch (error) {
            if (requestSignal.aborted) throw requestSignal.reason;
            if (!(error instanceof SyntaxError || error instanceof TypeError)) throw error;
            const problem = failure('invalid_provider_response');
            options.onExchange?.({ request, failure: problem });
            return problem;
          }
          if (!body || typeof body !== 'object' || !('status' in body)) {
            const problem = failure('invalid_provider_response');
            options.onExchange?.({ request, response: body, failure: problem });
            return problem;
          }
          // The SDK's raw-response route lets us reject malformed wire shapes
          // before convenience parsing can turn them into incidental TypeErrors.
          const response = body as Response;
          // Account before interpreting status, including refused, incomplete and failed responses.
          const usage = providerUsage(response);
          if (usage && !closed) reportUsage(usage);
          if (closed || requestSignal.aborted) throw requestSignal.reason ?? new Error('OpenAI dialogue closed');
          options.onExchange?.({ request, response });
          if (response.status === 'failed') return failure(response.error?.code);
          if (response.status === 'incomplete') return { kind: response.incomplete_details?.reason === 'content_filter' ? 'refused' : 'truncated' };
          if (response.status !== 'completed' || !Array.isArray(response.output)) return { kind: 'ended' };
          if (response.output.some(item => !item || typeof item !== 'object' ||
              (item.type === 'message' && !Array.isArray(item.content)))) return { kind: 'ended' };
          if (response.output.some(item => item.type === 'message' && item.content.some(part => part?.type === 'refusal'))) return { kind: 'refused' };
          const calls = response.output.filter(item => item.type === 'function_call');
          if (calls.length !== 1) return { kind: 'ended' };
          const call = calls[0]!;
          if (typeof call.call_id !== 'string' || !call.call_id || typeof call.arguments !== 'string') return { kind: 'ended' };
          let args: unknown;
          try { args = JSON.parse(call.arguments); } catch { return { kind: 'submit', result: null }; }
          if (call.name === 'submit_investigram') return { kind: 'submit', result: args };
          if (call.name !== 'request_evidence' || !args || typeof args !== 'object' || !('requests' in args) || !Array.isArray(args.requests)) return { kind: 'ended' };
          for (const item of response.output) {
            if (item.type !== 'function_call' && item.type !== 'message' && item.type !== 'reasoning') return { kind: 'ended' };
            history.push(item);
          }
          pending = call.call_id;
          // Domain coordination validates every requested capability and reference.
          return { kind: 'tools', requests: args.requests as InvestigatorTool[] };
        },
        close() { closed = true; controller.abort(); history = []; pending = undefined; },
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

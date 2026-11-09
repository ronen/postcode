import type { ChatGPTCredentials } from './chatgpt-credentials.js';
import { chatGPTCredentials } from './chatgpt-credentials.js';
import { CredentialError, keychainStore } from './credential-store.js';
import { oauthService } from './oauth.js';
import { chatGPTIdentity, chatGPTInvestigator } from './adapter.js';
import type { AgentInput, ReportedUsage } from '../contracts.js';
import type { RecordId } from '../../records.js';

export async function productionChatGPTCredentials(): Promise<ChatGPTCredentials> {
  return chatGPTCredentials(await keychainStore(), oauthService());
}

/** Explicit, cost-bearing account compatibility check; never run implicitly during setup or startup. */
export async function checkChatGPTConnection(credentials: ChatGPTCredentials, signal: AbortSignal, fetcher: typeof fetch = fetch) {
  const model = chatGPTIdentity.model;
  const session = await credentials.session(), token = await session.token(signal);
  let catalog: unknown;
  try {
    const response = await fetcher('https://api.openai.com/v1/models', { headers: { authorization: `Bearer ${token}` }, redirect: 'error',
      signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]) });
    if (!response.ok) throw new Error(); catalog = await response.json();
  } catch { throw new CredentialError('model_catalog_unavailable', 'ChatGPT model access could not be verified. No model substitution or API billing fallback was made.'); }
  const models = catalog && typeof catalog === 'object' && 'models' in catalog && Array.isArray(catalog.models) ? catalog.models : [];
  if (!models.some((m: unknown) => m && typeof m === 'object' && 'slug' in m && m.slug === model && 'visibility' in m && m.visibility === 'list'))
    throw new CredentialError('model_unavailable', `The authorized ChatGPT account does not list ${model}. A human model choice is required; no substitute was used.`);
  const usage: ReportedUsage[] = [];
  let returnedModel: unknown;
  const agent = chatGPTInvestigator(session, { fetch: fetcher, onExchange: exchange => {
    if (exchange.response && typeof exchange.response === 'object' && 'model' in exchange.response) returnedModel = exchange.response.model;
  } }), dialogue = agent.open();
  const input: AgentInput = { attempt: 'attempt:connection-check' as RecordId, request: { operation: 'functionality', subject: 'module:connection-check' as RecordId, parameters: {} },
    instructions: 'Connection check only. Call submit_investigram with localId check, prose Connection confirmed, referent description Connection check and empty subjects. Use empty arrays for qualifications, evidence, associations, children, corrections and inconsistencies. Do not request evidence.',
    responses: [], remaining: { milliseconds: 30000, calls: 1, toolCalls: 0 } };
  try {
    const reply = await dialogue.exchange(input, AbortSignal.any([signal, AbortSignal.timeout(30000)]), report => usage.push(report));
    if (reply.kind !== 'submit') throw new CredentialError('configuration_incompatible',
      `The ${model} / medium / subscription-streaming check did not complete (${reply.kind}${'code' in reply ? `: ${reply.code}` : ''}). Retained check usage: ${JSON.stringify(usage)}. Provider diagnostic: ${JSON.stringify('provider' in reply ? reply.provider : null)}. A human decision may be required; no substitute or inference retry was used.`);
    if (returnedModel !== model || usage.some(report => report.execution?.model !== model)) throw new CredentialError('model_mismatch', `OpenAI reported a different model for the requested ${model} check. A human decision is required.`);
    return { authenticationRoute: 'chatgpt-sign-in', billingRoute: 'chatgpt-plan', model, reasoning: 'medium', status: 'connected',
      usage, monetaryAttribution: 'unavailable; provider tokens do not identify allowance versus optional purchased credits', usageControls: 'https://chatgpt.com/settings/usage' };
  } finally { dialogue.close(); }
}

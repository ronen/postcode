import type { ChatGPTCredentials } from './chatgpt-credentials.js';
import { chatGPTCredentials } from './chatgpt-credentials.js';
import { CredentialError, keychainStore } from './credential-store.js';
import { oauthService } from './oauth.js';
import { chatGPTIdentity, chatGPTInvestigator } from './adapter.js';
import type { AgentInput, ReportedUsage } from '../contracts.js';
import type { RecordId } from '../../records.js';

export const authHelp = `PostCode ChatGPT authentication (no project required):
  postcode auth chatgpt sign-in [label] [--consent]
  postcode auth chatgpt status
  postcode auth chatgpt use <label>
  postcode auth chatgpt sign-out [label]
  postcode auth chatgpt check
Labels default to personal for sign-in. Reuse a label to reauthorize; use a new label to add an account.
Sign-in does not select billing for project commands. Set POSTCODE_INVESTIGATOR=chatgpt
for ChatGPT plan usage, or POSTCODE_INVESTIGATOR=openai for API-key billing.
The check uses a small inference request and reports provider token usage.
ChatGPT usage and optional credit controls: https://chatgpt.com/settings/usage
`;
export async function productionChatGPTCredentials(): Promise<ChatGPTCredentials> {
  return chatGPTCredentials(await keychainStore(), oauthService());
}
export async function runAuthentication(args: readonly string[], output: { stdout(text: string): void; stderr(text: string): void },
  supplied?: ChatGPTCredentials): Promise<number> {
  const [provider, operation, ...rest] = args;
  if (provider !== 'chatgpt' || !operation || operation === 'help') { output.stdout(authHelp); return operation === 'help' ? 0 : 2; }
  const label = rest.find(item => item !== '--consent');
  if (!['sign-in', 'status', 'use', 'sign-out', 'check'].includes(operation) ||
      (['status', 'check'].includes(operation) && rest.length > 0) ||
      (operation !== 'sign-in' && rest.includes('--consent')) ||
      rest.filter(item => item !== '--consent').length > 1 || rest.filter(item => item === '--consent').length > 1 ||
      (operation === 'use' && !label) || (label !== undefined && !/^[a-zA-Z0-9_-]{1,40}$/.test(label))) {
    output.stderr(authHelp); return 2;
  }
  const controller = new AbortController();
  const interrupt = () => controller.abort(); process.on('SIGINT', interrupt);
  try {
    const credentials = supplied ?? await productionChatGPTCredentials();
    if (operation === 'sign-in') {
      output.stderr('Opening ChatGPT sign-in. Approve optional plan usage in the browser if desired. PostCode will not purchase credits or change spending settings.\n');
      const result = await credentials.signIn(label ?? 'personal', rest.includes('--consent'), controller.signal);
      output.stdout(`Signed in as registration ${result.label}. ChatGPT plan usage ${result.planUsage ? 'granted' : 'not granted'}; ${result.renewable ? 'renewable session saved' : 'interactive renewal may be required'}.\n`);
    } else if (operation === 'status') {
      const accounts = await credentials.status();
      output.stdout(accounts.length ? accounts.map(a => `${a.active ? '*' : ' '} ${a.label}: ${a.signedIn ? 'signed in' : 'signed out'}; plan usage ${a.planUsage ? 'granted' : 'unavailable'}; renewal ${a.renewable ? 'available' : 'unavailable'}`).join('\n') + '\n' : 'No saved ChatGPT registrations.\n');
    } else if (operation === 'use') {
      await credentials.select(label!); output.stdout(`Selected ChatGPT registration ${label}. Project billing still requires an explicit route selection.\n`);
    } else if (operation === 'sign-out') {
      const revoked = await credentials.signOut(label);
      output.stdout(`Signed out locally; registration retained. ${revoked ? 'Renewable session revoked or already absent.' : 'Remote revocation was not confirmed. Disconnect PostCode in ChatGPT Settings → Security and login → Sign in with ChatGPT.'}\n`);
    } else {
      const result = await checkChatGPTConnection(credentials, controller.signal);
      output.stdout(JSON.stringify(result, null, 2) + '\n');
    }
    return 0;
  } catch (error) {
    output.stderr(`${error instanceof CredentialError ? error.message : controller.signal.aborted ? 'Authentication operation interrupted.' : 'PostCode authentication operation failed. No credentials or provider errors are displayed.'}\n`);
    return controller.signal.aborted ? 130 : 2;
  } finally { process.removeListener('SIGINT', interrupt); }
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

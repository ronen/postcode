import { inlineText } from '../terminal-text.js';
import { productionChatGPTCredentials, checkChatGPTConnection, CredentialError } from '../application/accounts.js';
import type { ChatGPTCredentials } from '../application/accounts.js';
export const authHelp = `PostCode ChatGPT authentication (no project required):
  postcode auth chatgpt sign-in [label] [--consent]
  postcode auth chatgpt status
  postcode auth chatgpt use <label>
  postcode auth chatgpt sign-out [label]
  postcode auth chatgpt check
Labels default to personal for sign-in. Reuse a label to reauthorize; use a new label to add an account.
Sign-in does not select billing for direct investigation clients. Clients explicitly configure
chatgpt for ChatGPT plan usage or openai for API-key billing; see docs/hosted-investigation.md.
The check uses a small inference request and reports provider token usage.
ChatGPT usage and optional credit controls: https://chatgpt.com/settings/usage
`;
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
      output.stdout(`Signed in as registration ${inlineText(result.label)}. ChatGPT plan usage ${result.planUsage ? 'granted' : 'not granted'}; ${result.renewable ? 'renewable session saved' : 'interactive renewal may be required'}.\n`);
    } else if (operation === 'status') {
      const accounts = await credentials.status();
      output.stdout(accounts.length ? accounts.map(a => `${a.active ? '*' : ' '} ${inlineText(a.label)}: ${a.signedIn ? 'signed in' : 'signed out'}; plan usage ${a.planUsage ? 'granted' : 'unavailable'}; renewal ${a.renewable ? 'available' : 'unavailable'}`).join('\n') + '\n' : 'No saved ChatGPT registrations.\n');
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
    output.stderr(`${error instanceof CredentialError ? inlineText(credentialDiagnostic(error)) : controller.signal.aborted ? 'Authentication operation interrupted.' : 'PostCode authentication operation failed. No credentials or provider errors are displayed.'}\n`);
    return controller.signal.aborted ? 130 : 2;
  } finally { process.removeListener('SIGINT', interrupt); }
}


function credentialDiagnostic(error: { readonly code: string; readonly message: string }): string {
  if (error.code === 'reauthorization_required') return 'ChatGPT sign-in is required. Run postcode auth chatgpt sign-in in your own terminal. No API billing fallback was used.';
  if (error.code === 'plan_permission_required' && error.message === 'Signed in, but ChatGPT plan usage was not granted.') return 'Signed in, but ChatGPT plan usage was not granted. Use postcode auth chatgpt sign-in <label> --consent to request it, or explicitly choose API billing.';
  return error.message;
}

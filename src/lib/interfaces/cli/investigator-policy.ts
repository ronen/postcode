import { configuredInvestigator } from '../../application/accounts.js';
import type { ConfigurationReason } from '../../application/accounts.js';

export const hostedDisclosure = 'Hosted investigation enabled: selected repository source, documentation and qualified analysis will be sent to OpenAI (gpt-6-sol, medium reasoning) through its Responses API. API charges apply.\n';
export const chatGPTDisclosure = 'Hosted investigation enabled: selected repository source, documentation and qualified analysis will be sent to OpenAI (gpt-5.6-sol, medium reasoning). Route: Sign in with ChatGPT / ChatGPT plan usage; optional credits apply only if already permitted in provider settings. Monetary attribution is unavailable. Controls: https://chatgpt.com/settings/usage. No API billing fallback.\n';

export function configurationDiagnostic(reason: ConfigurationReason): string {
  switch (reason.kind) {
    case 'api-key-unavailable': return 'Hosted investigation configuration unavailable: macOS Keychain must contain service org.postcode.openai, account api-key, with an accessible nonempty API key. See docs/hosted-investigation.md. No credential fallback is used.';
    case 'unknown-provider': return 'Unknown POSTCODE_INVESTIGATOR value. Explicitly select openai (API billing), chatgpt (ChatGPT plan), or disabled. See docs/hosted-investigation.md.';
    case 'chatgpt-unavailable': return 'ChatGPT credentials are unavailable. Run postcode auth chatgpt sign-in. No API billing fallback was used.';
    case 'credential-error': return credentialDiagnostic(reason);
  }
}
export function credentialDiagnostic(error: { readonly code: string; readonly message: string }): string {
  if (error.code === 'reauthorization_required') return 'ChatGPT sign-in is required. Run postcode auth chatgpt sign-in in your own terminal. No API billing fallback was used.';
  if (error.code === 'plan_permission_required' && error.message === 'Signed in, but ChatGPT plan usage was not granted.') return 'Signed in, but ChatGPT plan usage was not granted. Use postcode auth chatgpt sign-in <label> --consent to request it, or explicitly choose API billing.';
  return error.message;
}
/** Preserve the CLI's diagnostic and offline setup-substitution contract. */
export async function configureCliInvestigator(...args: Parameters<typeof configuredInvestigator>) {
  const result = await configuredInvestigator(...args);
  if (result.kind === 'configuration-unavailable') return { kind: result.kind, diagnostic: configurationDiagnostic(result.reason) };
  if (result.kind !== 'ready') return result;
  // Credential revocation can occur after preflight. Keep command guidance in
  // this client even when the service reports unavailability during an exchange.
  return { ...result, agent: { ...result.agent, open() {
    const dialogue = result.agent.open();
    return { close: () => dialogue.close(), async exchange(...exchangeArgs: Parameters<typeof dialogue.exchange>) {
      const reply = await dialogue.exchange(...exchangeArgs);
      return reply.kind === 'configuration-unavailable'
        ? { ...reply, diagnostic: credentialDiagnostic({ code: reply.code, message: reply.diagnostic }) } : reply;
    } };
  } } };
}

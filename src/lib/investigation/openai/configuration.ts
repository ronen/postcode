import { execFile } from 'node:child_process';
import type { InvestigatorAgent } from '../contracts.js';
import { openAIInvestigator } from './adapter.js';

export const hostedDisclosure = 'Hosted investigation enabled: selected repository source, documentation and qualified analysis will be sent to OpenAI (gpt-6-sol, medium reasoning) through its Responses API. API charges apply.\n';
const unavailable = { kind: 'configuration-unavailable' as const,
  diagnostic: 'Hosted investigation configuration unavailable: macOS Keychain must contain service org.postcode.openai, account api-key, with an accessible nonempty API key. See docs/hosted-investigation.md. No credential fallback is used.' };

type Configuration = { readonly kind: 'disabled' } | typeof unavailable | { readonly kind: 'ready'; readonly agent: InvestigatorAgent };

/** Credential availability is checked before either CLI entry path opens a project. */
export async function configuredInvestigator(provider: string | undefined, dependencies: {
  platform?: string;
  readCredential?: () => Promise<string | undefined>;
  createAgent?: (key: string) => InvestigatorAgent;
} = {}): Promise<Configuration> {
  if (provider === undefined || provider === '' || provider === 'disabled') return { kind: 'disabled' };
  if (provider !== 'openai') return { kind: 'configuration-unavailable', diagnostic: 'Unknown POSTCODE_INVESTIGATOR value. Use openai or disabled. See docs/hosted-investigation.md.' };
  if ((dependencies.platform ?? process.platform) !== 'darwin') return unavailable;
  let credential: string | undefined;
  try { credential = await (dependencies.readCredential ?? keychainCredential)(); }
  catch { return unavailable; } // System errors may contain captured output; never propagate them.
  if (!credential || credential.length > 16000 || /\s/.test(credential)) return unavailable;
  return { kind: 'ready', agent: (dependencies.createAgent ?? openAIInvestigator)(credential) };
}

function keychainCredential(): Promise<string | undefined> {
  return new Promise(resolve => {
    execFile('/usr/bin/security', ['find-generic-password', '-s', 'org.postcode.openai', '-a', 'api-key', '-w'],
      { encoding: 'utf8', timeout: 15000, killSignal: 'SIGKILL', maxBuffer: 16384, env: {} },
      (error, stdout) => { resolve(error ? undefined : stdout.trim()); });
  });
}

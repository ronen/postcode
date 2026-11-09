import { execFile } from 'node:child_process';
import type { InvestigatorAgent } from '../contracts.js';
import { productionChatGPTCredentials } from './accounts.js';
import { CredentialError } from './credential-store.js';
import type { ChatGPTCredentials } from './chatgpt-credentials.js';
import { chatGPTInvestigator, openAIInvestigator } from './adapter.js';

export type ConfigurationReason = { readonly kind: 'api-key-unavailable' | 'unknown-provider' | 'chatgpt-unavailable' }
  | { readonly kind: 'credential-error'; readonly code: string; readonly message: string };
export type InvestigatorConfiguration = { readonly kind: 'disabled' }
  | { readonly kind: 'configuration-unavailable'; readonly reason: ConfigurationReason }
  | { readonly kind: 'ready'; readonly agent: InvestigatorAgent };
const unavailable: InvestigatorConfiguration = { kind: 'configuration-unavailable', reason: { kind: 'api-key-unavailable' } };

/** Credential availability is checked before opening a project, without choosing an interface. */
export async function configuredInvestigator(provider: string | undefined, dependencies: {
  platform?: string;
  chatGPTCredentials?: () => Promise<ChatGPTCredentials>;
  readCredential?: () => Promise<string | undefined>;
  createAgent?: (key: string) => InvestigatorAgent;
} = {}): Promise<InvestigatorConfiguration> {
  if (provider === undefined || provider === '' || provider === 'disabled') return { kind: 'disabled' };
  if (provider === 'chatgpt') {
    try { return { kind: 'ready', agent: chatGPTInvestigator(await (await (dependencies.chatGPTCredentials ?? productionChatGPTCredentials)()).session()) }; }
    catch (error) { return { kind: 'configuration-unavailable', reason: error instanceof CredentialError ? { kind: 'credential-error', code: error.code, message: error.message } : { kind: 'chatgpt-unavailable' } }; }
  }
  if (provider !== 'openai') return { kind: 'configuration-unavailable', reason: { kind: 'unknown-provider' } };
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

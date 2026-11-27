import assert from 'node:assert/strict';
import { test } from 'node:test';
import { configuredInvestigator, CredentialError } from '../src/lib/application/accounts.js';
import type { ChatGPTCredentials } from '../src/lib/application/accounts.js';

test('account setup returns typed reasons without reading other routes or starting a connection check', async () => {
  let reads = 0, credentials = 0, tokens = 0;
  const deps = { platform: 'darwin', readCredential: async () => { reads++; return undefined; },
    chatGPTCredentials: async () => { credentials++; throw new CredentialError('reauthorization_required', 'ChatGPT sign-in is required. No API billing fallback was used.'); } };
  assert.deepEqual(await configuredInvestigator('disabled', deps), { kind: 'disabled' });
  assert.deepEqual(await configuredInvestigator('automatic', deps), { kind: 'configuration-unavailable', reason: { kind: 'unknown-provider' } });
  assert.equal(reads + credentials, 0);
  const unavailable = await configuredInvestigator('chatgpt', deps);
  assert.equal(unavailable.kind, 'configuration-unavailable');
  assert.equal(unavailable.reason.kind, 'credential-error');
  assert.doesNotMatch(JSON.stringify(unavailable), /postcode auth|docs\//);
  assert.equal(reads, 0); assert.equal(credentials, 1);
  assert.deepEqual(await configuredInvestigator('openai', deps), { kind: 'configuration-unavailable', reason: { kind: 'api-key-unavailable' } });
  assert.equal(reads, 1); assert.equal(credentials, 1);
  const ready = await configuredInvestigator('chatgpt', { chatGPTCredentials: async () => ({
    session: async () => ({ token: async () => { tokens++; throw new Error('No inference authorized'); }, watch: () => () => {} }),
  } as unknown as ChatGPTCredentials) });
  assert.equal(ready.kind, 'ready');
  assert.equal(ready.agent.identity.configuration.billingRoute, 'chatgpt-plan');
  assert.equal(tokens, 0, 'preflight must not run the explicit cost-bearing check');
});

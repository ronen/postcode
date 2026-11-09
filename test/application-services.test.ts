import assert from 'node:assert/strict';
import { test } from 'node:test';
import { configuredInvestigator, CredentialError } from '../src/lib/application/accounts.js';
import { prepareFeedback, feedbackObservation } from '../src/lib/application/feedback.js';
import { deliverObservation } from '../src/lib/application/observations.js';
import { configureCliInvestigator, configurationDiagnostic } from '../src/lib/interfaces/cli/investigator-policy.js';
import type { ChatGPTCredentials } from '../src/lib/application/accounts.js';
import type { AgentInput } from '../src/lib/investigation/contracts.js';
import type { RecordId } from '../src/lib/records.js';

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
  assert.match(configurationDiagnostic(unavailable.reason), /Run postcode auth chatgpt sign-in in your own terminal/);
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

test('CLI policy restores sign-in guidance when credentials are revoked after setup', async () => {
  const setup = await configureCliInvestigator('chatgpt', { chatGPTCredentials: async () => ({
    session: async () => ({ token: async () => { throw new CredentialError('reauthorization_required', 'ChatGPT sign-in is required. No API billing fallback was used.'); }, watch: () => () => {} }),
  } as unknown as ChatGPTCredentials) });
  assert.equal(setup.kind, 'ready');
  const dialogue = setup.agent.open();
  try {
    const input: AgentInput = { attempt: 'attempt:test' as RecordId, instructions: 'offline', request: { operation: 'functionality', subject: 'module:test' as RecordId, parameters: {} }, responses: [], remaining: { milliseconds: 100, calls: 1, toolCalls: 0 } };
    const reply = await dialogue.exchange(input, new AbortController().signal, () => {});
    assert.equal(reply.kind, 'configuration-unavailable');
    assert.equal(reply.code, 'reauthorization_required');
    assert.match(reply.diagnostic, /Run postcode auth chatgpt sign-in in your own terminal/);
  } finally { dialogue.close(); }
});

test('neutral feedback owns supplied snapshots, reconstructs nothing and isolates delivery failure', async () => {
  const free = prepareFeedback({ correlation: 'invocation:test', command: 1, explanation: 'Missing information' });
  assert.equal(free.report.context, 'context-free');
  assert.equal(free.report.displayed, null);
  assert.deepEqual(structuredClone(free), free);
  const displayed = { command: 2, records: [{ id: 'outcome', kind: 'command-outcome' as const, value: { status: 'failed' } }], events: [] };
  const prepared = prepareFeedback({ correlation: 'session:test', command: 3, explanation: null, displayed });
  displayed.records[0]!.value.status = 'changed';
  assert.deepEqual(prepared.report.target, { command: 2, status: 'failed' });
  assert.equal((prepared.report.displayed!.records[0]!.value as { status: string }).status, 'failed');
  assert.ok(Object.isFrozen(prepared.report.displayed!.records));
  const batch = feedbackObservation(prepared, 'Actually displayed feedback acknowledgment\n');
  assert.equal(batch.formatVersion, 4);
  assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, 'Actually displayed feedback acknowledgment\n');
  assert.equal(batch.records.some(record => record.kind === 'qualified-view'), false);
  assert.deepEqual(await deliverObservation({ async submit() { throw new Error('offline'); } }, batch), { accepted: false, reason: 'offline' });
  assert.deepEqual(await deliverObservation({ async submit() { throw 'untrusted'; } }, batch), { accepted: false, reason: 'sink delivery failed' });
  assert.deepEqual(await deliverObservation({ async submit() { return { accepted: true, cleanupWarning: 'staging retained' }; } }, batch), { accepted: true, cleanupWarning: 'staging retained' });
  assert.deepEqual(prepared.report.target, { command: 2, status: 'failed' });
});

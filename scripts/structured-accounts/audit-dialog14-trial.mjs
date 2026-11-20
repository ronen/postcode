/** Offline audit of run-dialog14-trial captures. No inference or credential access.
 * node scripts/structured-accounts/audit-dialog14-trial.mjs <run-directory>
 * Protocol/address/exposure checks are mechanical; assess generated meaning separately.
 */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { dialogInstructions } from '../../_build/src/lib/contributions/dialog.js';
import { contributionOperations, resultContract } from '../../_build/src/lib/contributions/operations.js';
import { contributionFunctions, contributionWireProtocol } from '../../_build/src/lib/investigation/openai/contribution-protocol.js';
import { referenceInstructions } from '../../_build/src/lib/investigation/openai/references.js';

const dir = process.argv[2];
const read = name => JSON.parse(readFileSync(path.join(dir, name), 'utf8'));
const lines = name => readFileSync(path.join(dir, name), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const spec = read('spec.json'), setup = read('setup-result.json'), terminal = read('result.json'), usage = read('usage.json');
assert.equal(spec.offline, false, 'This audit concerns live captures, not scripted preflight');
const inputs = lines('domain-inputs.jsonl').filter(entry => entry.phase === 'invocation').map(entry => entry.input);
const replies = lines('domain-replies.jsonl').map(entry => entry.reply), exchanges = lines('exchanges.jsonl');
const attempts = lines('attempts.jsonl'), invoked = attempts.find(attempt => attempt.phase === 'invocation');
const budget = JSON.parse(readFileSync(spec.budget, 'utf8')), requests = budget.requests.filter(request => request.run === spec.id);
assert.equal(budget.ceiling, 20); assert.ok(budget.requests.length <= 20);
assert.equal(attempts.length, 2); assert.equal(attempts[0].agent.origin, 'scripted');
assert.equal(invoked.agent.origin, 'hosted'); assert.equal(invoked.agent.configuration.billingRoute, 'chatgpt-plan');
assert.equal(invoked.agent.configuration.protocol, contributionWireProtocol); assert.equal(invoked.agent.configuration.retries, 0);
const first = inputs[0], expectedInstructions = dialogInstructions({ ...contributionOperations[first.request.operation], contract: resultContract(first.request.resultContract) });
assert.equal(first.instructions, expectedInstructions);
for (const exchange of exchanges) {
  assert.equal(exchange.request.instructions, expectedInstructions + '\n\n' + referenceInstructions);
  assert.equal(exchange.request.model, 'gpt-5.6-sol'); assert.equal(exchange.request.reasoning.effort, 'medium');
  assert.equal(exchange.request.tools.length, 1); assert.equal(exchange.request.tools[0].name, 'postcode');
  assert.deepEqual(exchange.request.tools[0].tools, contributionFunctions);
}
// Decode captured structural reference slots independently, then compare the first wire message to the domain input.
// This fixture uses prose bodies, whose strings deliberately remain literal.
let bindings = new Map(exchanges[0].references.bindings.map(binding => [binding.handle, binding.reference]));
const referenceKeys = new Set(['entity', 'investigram', 'production', 'result', 'invocation', 'attempt', 'record', 'moduleRecord', 'referent', 'claim', 'referents', 'evidence', 'contexts', 'exports', 'subject', 'cursor']);
function decode(value, key = '') {
  if (key === 'body' || key === 'parameters') return value;
  if (typeof value === 'string' && referenceKeys.has(key)) { assert.ok(bindings.has(value), `Unknown handle ${value}`); return bindings.get(value); }
  if (Array.isArray(value)) return value.map(entry => decode(entry, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, decode(entry, key)]));
  return value;
}
const wire = JSON.parse(exchanges[0].request.input[0].content);
assert.deepEqual(decode(wire.request), first.request);
assert.deepEqual(decode(wire.responses), first.responses);
for (const [index, exchange] of exchanges.entries()) {
  bindings = new Map(exchange.references.bindings.map(binding => [binding.handle, binding.reference]));
  const output = exchange.response?.output?.length ? exchange.response.output : exchange.streamOutput ?? [];
  const submission = output.find(item => item.type === 'function_call' && item.name === 'submit_contribution');
  if (submission && replies[index]?.kind === 'submit') assert.deepEqual(decode(JSON.parse(submission.arguments)), replies[index].contribution);
}
const option = setup.answer.content.value.projection.alternatives.flatMap(alternative => alternative.options)[0];
for (const field of ['subjects', 'context', 'resultContract']) assert.deepEqual(first.request[field], option.option.request[field]);
assert.deepEqual(first.request.option, { investigram: option.address.investigram, key: option.address.key });
assert.deepEqual(first.request.subjects.map(entry => entry.subject.item.item), ['note_k']);
assert.deepEqual(first.request.context.map(entry => entry.item.item), ['note_k', 'note_r', 'note_k', 'note_b', 'note_r', 'note_b']);
assert.deepEqual(first.responses.map(response => response.kind), ['item', 'item', 'item', 'metadata']);
const retained = setup.answer.content.value.projection.alternatives.flatMap(alternative => alternative.items);
const delivered = first.responses.slice(0, 3).map(response => response.value);
assert.deepEqual(delivered.map(value => value.address.item), ['note_k', 'note_r', 'note_b']);
for (const value of delivered) {
  const item = retained.find(item => item.address.investigram === value.address.investigram && item.address.item === value.address.item);
  assert.ok(item); assert.equal(value.coverage, 'complete');
  assert.deepEqual(value.item.body, item.body); assert.deepEqual(value.item.qualification, item.qualification);
  assert.deepEqual(value.owner.qualification, item.ownerQualification);
}
assert.equal(first.responses[3].value.value.meaning, option.option.meaning);
const initialPosition = invoked.contributionDeliveries[0].position;
const initialDeliveries = invoked.contributionDeliveries.filter(delivery => delivery.position === initialPosition);
assert.deepEqual(initialDeliveries.map(delivery => delivery.kind), ['item', 'item', 'item', 'metadata']);
assert.deepEqual(initialDeliveries.filter(delivery => delivery.kind === 'item').map(delivery => delivery.item), delivered.map(value => value.address));
assert.ok(initialDeliveries.filter(delivery => delivery.kind === 'item').every(delivery => delivery.coverage === 'complete' && delivery.route === null));
assert.equal(invoked.usage.length, requests.length);
assert.equal(usage.calls, attempts.reduce((sum, attempt) => sum + attempt.usage.length, 0));
assert.equal(usage.missingCalls, attempts.flatMap(attempt => attempt.usage).filter(call => !call.reported).length);
assert.equal(usage.anomalousCalls, 0);
assert.equal(exchanges.length, requests.filter(request => request.status === 'response-received' || request.status === 'failed').length);
const repairs = inputs.flatMap((input, index) => input.responses.filter(response => response.tool === 'invalid-submission').map(response => ({ exchange: index + 1, problem: response.problem })));
const result = terminal.result, projection = result.answer?.content?.value?.projection;
const summary = {
  checks: ['Production instructions and schema unchanged in every captured exchange.',
    'First wire request and responses decode exactly to the production domain input; completed wire submissions decode to the captured replies.',
    'One subject and six context entries remain retained; exactly three distinct addressed items plus option metadata are initially delivered.',
    'Delivered bodies and item/owner qualifications match retained records.',
    'Initial exposure is exactly one complete direct delivery per distinct item plus the option metadata.',
    'Scripted setup and hosted usage are distinguished; the request ledger agrees with hosted call counts.'],
  requestCount: requests.length, cap: budget.ceiling, milliseconds: terminal.milliseconds,
  outcome: result.reporting?.contribution?.outcome, failed: result.failed, alternatives: projection?.alternatives.length,
  requests: requests.map(({ ordinal, status, failure, usage }) => ({ ordinal, status, failure, usage })),
  scriptedCalls: attempts.filter(attempt => attempt.agent.origin === 'scripted').reduce((sum, attempt) => sum + attempt.usage.length, 0),
  hostedMissingUsage: invoked.usage.filter(call => !call.reported).length,
  repairs, transportFailures: exchanges.filter(exchange => exchange.failure).map(exchange => exchange.failure),
  toolReplies: replies.filter(reply => reply.kind === 'tools'),
  delivered: delivered.map(value => ({ address: value.address, coverage: value.coverage })),
  retainedOutput: projection?.alternatives.flatMap(alternative => alternative.items.map(item => ({ address: item.address, body: item.body,
    support: item.support, qualification: item.qualification, ownerQualification: item.ownerQualification }))),
};
writeFileSync(path.join(dir, 'verification.json'), JSON.stringify(summary, null, 2) + '\n', { mode: 0o600 });
console.log(JSON.stringify({ ...summary, retainedOutput: undefined, requests: undefined }, null, 2));

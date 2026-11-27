import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { temporaryDirectory } from './temporary-directory.js';

// Replace only credential access and the communication participant in the child.
// The actual runner, application, evidence, validation, ledger, arrangement and files execute.
const agentModule = `export function chatGPTDialogAgent() {
  let ordinal = 0;
  return { identity: { provider: 'postcode-test', model: 'runner-control', configuration: {}, origin: 'scripted' }, open() {
    const key = 'account-' + ++ordinal;
    return { close() {}, async exchange(input, signal, usage) {
      usage({ source: 'provider', categories: [{ category: 'input', unit: 'tokens', value: 2, includedIn: null }] });
      const state = input.request.operation === 'state-behavior';
      const member = item => ({ kind: 'item', item: { investigram: { local: key }, item } });
      return { kind: 'submit', contribution: { investigrams: [{ key,
        qualification: { limitations: ['Controlled runner interpretation; no behavioral verification.'] },
        items: [{ key: 'text', type: 'prose', body: { text: 'Controlled runner account.' } }, ...(state ? [{ key: 'model', type: 'state-model', body: {
          bearer: { entity: input.request.subjects[0].subject.entity }, states: [{ key: 'ready', label: 'Ready' }],
          initial: { kind: 'state', state: 'ready' }, transitions: [], coverage: { states: 'some', transitions: 'some' }, unsupported: [],
        } }] : [])],
        declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [member('text'), ...(state ? [member('model')] : [])] }],
        options: state ? [{ key: 'why', meaning: 'Explain the ready state.', request: { operation: 'examine-content', subjects: [{ subject: {
          kind: 'content', item: { investigram: { local: key }, item: 'model' }, component: 'state:ready',
        } }] } }] : [],
      }] } };
    } };
  } };
}`;

test('standard trial preserves ordinary/fresh/option chains and standalone qualification through real application execution', t => {
  const root = temporaryDirectory(t, 'postcode-trial-control-');
  const project = path.join(root, 'tsconfig.json'), output = path.join(root, 'result'), budget = path.join(root, 'budget.json');
  writeFileSync(project, '{"compilerOptions":{"noLib":true,"types":[]},"files":["gate.ts"]}');
  writeFileSync(path.join(root, 'gate.ts'), 'export const gate = 1;');
  writeFileSync(budget, JSON.stringify({ ceiling: 4, requests: [] }));
  const loader = path.join(root, 'loader.mjs'), preflight = path.join(root, 'preflight.mjs');
  writeFileSync(loader, `export async function load(url, context, next) {
    if (url.endsWith('/application/accounts.js')) return { format: 'module', shortCircuit: true, source: 'export async function productionChatGPTCredentials() { return { session: async () => ({}) }; }' };
    if (url.endsWith('/investigation/openai/contribution-protocol.js')) return { format: 'module', shortCircuit: true, source: ${JSON.stringify(agentModule)} };
    return next(url, context);
  }`);
  writeFileSync(preflight, `import { register } from 'node:module'; register(${JSON.stringify(pathToFileURL(loader).href)});`);
  const request = { kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'gate' } };
  const spec = path.join(root, 'spec.json');
  writeFileSync(spec, JSON.stringify({ id: 'offline-runner-control', project, output, budget, steps: [
    { label: 'ordinary', request }, { label: 'reuse', request }, { label: 'fresh', fresh: 'ordinary' },
    { label: 'option', followUp: { from: 'ordinary', option: 'first' } },
  ] }));
  execFileSync(process.execPath, ['--import', preflight, path.resolve('scripts/structured-accounts/run-trial.mjs'), spec], { encoding: 'utf8' });
  const steps = readFileSync(path.join(output, 'steps.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line));
  assert.equal(steps.length, 4); assert.ok(steps.every(step => step.kind === 'answer' && !step.failed));
  assert.equal(steps[1].answer.id, steps[0].answer.id); assert.equal(steps[1].reporting.reused, true);
  assert.equal(steps[2].answer.alternatives.length, 2);
  const option = steps[0].answer.alternatives[0].options[0].address;
  assert.equal(steps[3].request.designation.value, option.investigram); assert.equal(steps[3].request.parameters.option, option.key);
  assert.notEqual(steps[3].answer.id, steps[0].answer.id);
  for (const step of steps) for (const [i, alternative] of step.view.alternatives.entries()) for (const [j, diagram] of alternative.diagrams.entries()) {
    const base = path.join(output, 'diagrams', `${step.step}-${i + 1}-${j + 1}`);
    assert.equal(readFileSync(base + '.svg', 'utf8'), diagram.svg);
    assert.equal(readFileSync(base + '.txt', 'utf8'), diagram.text + '\n');
    assert.match(diagram.text, /Interpretation/); assert.match(diagram.text, /Controlled runner interpretation; no behavioral verification/);
  }
  assert.equal(JSON.parse(readFileSync(path.join(output, 'usage.json'), 'utf8')).calls, 3);
  assert.equal(existsSync(budget + '.lock'), false, 'Success path releases its budget lease');
});

test('dialog14 offline runner retains exact option targets and deduplicated qualified input delivery', t => {
  const root = temporaryDirectory(t, 'postcode-dialog14-control-');
  const project = path.join(root, 'tsconfig.json'), output = path.join(root, 'result'), spec = path.join(root, 'spec.json');
  writeFileSync(project, '{"compilerOptions":{"noLib":true,"types":[]},"files":["circuit-breaker-policy.ts"]}');
  writeFileSync(path.join(root, 'circuit-breaker-policy.ts'), 'export class CircuitBreakerPolicy {}');
  writeFileSync(spec, JSON.stringify({ id: 'offline-delivery-only', project, output, budget: path.join(root, 'unused-budget.json') }));
  execFileSync(process.execPath, [path.resolve('scripts/structured-accounts/run-dialog14-trial.mjs'), spec, '--offline'], { encoding: 'utf8' });
  const setup = JSON.parse(readFileSync(path.join(output, 'setup-result.json'), 'utf8'));
  const result = JSON.parse(readFileSync(path.join(output, 'result.json'), 'utf8'));
  const option = setup.answer.content.value.projection.alternatives[0].options[0].address;
  assert.equal(result.request.designation.value, option.investigram); assert.equal(result.request.parameters.option, option.key);
  assert.equal(result.result.reporting.contribution.outcome.kind, 'accepted');
  assert.equal(result.result.answer.content.value.projection.alternatives.length, 0);
  const input = readFileSync(path.join(output, 'domain-inputs.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line)).find(entry => entry.phase === 'invocation').input;
  assert.equal(input.request.context.length, 6); assert.deepEqual(input.responses.map((response: { kind: string }) => response.kind), ['item', 'item', 'item', 'metadata']);
});

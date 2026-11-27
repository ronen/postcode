/** Controlled comparison oracle. Run in a fresh process; no credentials or hosted requests.
 * Usage: node scripts/structured-accounts/capture-retirement-baseline.mjs OUTPUT FIXTURE [RENDERER]
 * Keep FIXTURE at the same absolute path across compared builds. RENDERER is a compiled module path.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
// Control identity allocation, rather than deleting IDs or their relationships from the comparison.
let sequence = 0;
crypto.randomUUID = () => `11111111-1111-4111-8111-${String(++sequence).padStart(12, '0')}`;
syncBuiltinESMExports();
Object.defineProperty(performance, 'now', { value: () => 0 });
const [output, fixture, renderer = '_build/scripts/structured-accounts/support/answers.js'] = process.argv.slice(2);
assert.ok(output && fixture, 'Supply output and fixture directories');
mkdirSync(output, { recursive: true });
const files = { 'tsconfig.json': '{"compilerOptions":{"noLib":true,"types":[]},"files":["gate.ts","clock.ts"]}\n',
  'gate.ts': "import { now } from './clock.js';\n/** A gate that closes after failure. */\nexport function fail() { return now(); }\n", 'clock.ts': 'export function now() { return 0; }\n' };
mkdirSync(fixture, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  const file = path.join(fixture, name);
  if (existsSync(file)) assert.equal(readFileSync(file, 'utf8'), content, 'Refuse to overwrite another fixture');
  else writeFileSync(file, content);
}
const { openApplication } = await import('../../_build/src/lib/application/index.js');
const { arrangeContributionAnswer } = await import(pathToFileURL(path.resolve(renderer)).href);
const exchanges = [], attempts = [];
let dialog = 0;
const agent = { identity: { provider: 'postcode-test', model: 'controlled-retirement', configuration: {}, origin: 'scripted' }, open() {
  const ordinal = ++dialog;
  return { close() {}, async exchange(input, _signal, usage) {
    exchanges.push(input);
    usage({ source: 'provider', categories: [{ category: 'input', unit: 'tokens', value: 20, includedIn: null }, { category: 'output', unit: 'tokens', value: 10, includedIn: null }] });
    const owner = `account-${ordinal}`, subject = input.request.subjects[0].subject;
    const state = input.request.operation === 'state-behavior';
    const item = (key) => ({ kind: 'item', item: { investigram: { local: owner }, item: key } });
    return { kind: 'submit', contribution: { investigrams: [{ key: owner,
      qualification: { limitations: ['Controlled interpretation; not independently established.'] },
      items: [{ key: 'explanation', type: 'prose', body: { text: 'The gate can stop accepting requests after a failure.' } }, ...(state ? [{ key: 'model', type: 'state-model', body: {
        bearer: { entity: subject.entity }, states: [{ key: 'ready', label: 'Ready' }, { key: 'stopped', label: 'Stopped' }],
        initial: { kind: 'state', state: 'ready' }, transitions: [{ key: 'fail', from: 'ready', to: 'stopped', trigger: 'a failure occurs', effect: 'stops accepting requests' }],
        coverage: { states: 'some', transitions: 'some' }, unsupported: ['Concurrent changes are not modelled.'] } }] : [])],
      declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [item('explanation'), ...(state ? [item('model')] : [])] }],
      options: state ? [{ key: 'why', meaning: 'Explain the stopped state.', request: { operation: 'examine-content', subjects: [{ subject: { kind: 'content', item: { investigram: { local: owner }, item: 'model' }, component: 'state:stopped' } }] } }] : [],
    }] } };
  } };
} };
const opened = await openApplication({ configPath: path.resolve(fixture, 'tsconfig.json') }, { investigation: { dialogAgent: agent, onReport: report => attempts.push(report) } });
assert.equal(opened.status, 'opened');
const session = opened.session, steps = [];
async function run(label, request) {
  const result = await session.execute(request, { requestId: label });
  const view = result.kind === 'answer' && result.answer.content.contract === 'contribution' ? arrangeContributionAnswer(result.answer.content.value, result.title) : null;
  steps.push({ label, request, result, view });
  if (view) for (const [i, alternative] of view.alternatives.entries()) for (const [j, diagram] of alternative.diagrams.entries()) {
    writeFileSync(path.join(output, `${label}-${i}-${j}.svg`), diagram.svg);
    writeFileSync(path.join(output, `${label}-${i}-${j}.txt`), diagram.text + '\n');
  }
  return result;
}
try {
  for (const lens of ['modules', 'organization', 'dependency-structure', 'dependency-children', 'dependency-parents', 'inspect']) {
    const result = await run(lens, { kind: 'lens', lens, designation: ['modules', 'organization', 'dependency-structure'].includes(lens) ? { kind: 'configured-project' } : { kind: 'name', value: 'gate' } });
    assert.equal(result.kind, 'answer');
    await run(`${lens}-exact`, { kind: 'present', target: result.answer.id });
  }
  const request = { kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'gate' } };
  const first = await run('ordinary', request);
  const repeated = await run('reuse', request);
  assert.equal(first.answer.id, repeated.answer.id);
  const option = first.answer.content.value.projection.alternatives[0].options[0].address;
  await run('follow-up', { kind: 'lens', lens: 'follow-up', designation: { kind: 'reference', value: option.investigram }, parameters: { option: option.key } });
  await run('fresh', { ...request, fresh: true });
  const exact = await run('exact', { kind: 'present', target: first.answer.id });
  assert.deepEqual(exact.answer, first.answer);
  await run('missing', { kind: 'lens', lens: 'inspect', designation: { kind: 'name', value: 'absent' } });
  writeFileSync(path.join(output, 'capture.json'), JSON.stringify({ steps, exchanges, attempts, usage: session.usage() }, null, 2) + '\n');
} finally { await session.close(); }

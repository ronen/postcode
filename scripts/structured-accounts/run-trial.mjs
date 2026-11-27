/** Development harness for focused live trials of contribution investigations. Not a public command.
 *
 *   node scripts/structured-accounts/run-trial.mjs spec.json
 *
 * The spec supplies `id`, `project` (absolute tsconfig path), `output` (absolute, must not exist),
 * `budget` (a request ledger file, as in scripts/module-investigation) and `steps`. Each step is
 * one application request through the supported interface:
 *   { "label": "states", "request": { "kind": "lens", "lens": "state-behavior", "designation": { ... } } }
 *   { "label": "option", "followUp": { "from": "states", "option": "<key>" | "first" } }
 *   { "label": "again", "fresh": "states" }   // an explicit fresh investigation of an earlier step's request
 * A step may add `"elicit": "<text>"`: one instruction appended to that step's dialog instructions to
 * elicit an optional action deliberately. It is recorded with the step and in every captured exchange,
 * so an elicited action is never mistaken for a spontaneous one.
 * Credentials come only from PostCode's own credential manager after prior human sign-in. Every
 * provider request is reserved in the ledger before dispatch and refused past its ceiling.
 * Captures hold sanitized exchanges, the delivered answers and rendered diagrams; they can contain
 * repository source, so inspect them before committing anything.
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { openApplication } from '../../_build/src/lib/application/index.js';
import { productionChatGPTCredentials } from '../../_build/src/lib/application/accounts.js';
import { chatGPTDialogAgent } from '../../_build/src/lib/investigation/openai/contribution-protocol.js';
import { arrangeContributionAnswer } from '../../_build/scripts/structured-accounts/support/answers.js';
import { requestBudget } from '../module-investigation/request-budget.mjs';

const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
for (const field of ['id', 'project', 'output', 'budget']) if (typeof spec[field] !== 'string' || !spec[field]) throw new Error(`Missing ${field}`);
if (!Array.isArray(spec.steps) || !spec.steps.length) throw new Error('Missing steps');
mkdirSync(spec.output, { recursive: false, mode: 0o700 });
mkdirSync(path.join(spec.output, 'diagrams'), { mode: 0o700 });
const save = (file, value) => writeFileSync(path.join(spec.output, file), value, { mode: 0o600 });
const append = (file, value) => appendFileSync(path.join(spec.output, file), value, { mode: 0o600 });
save('spec.json', JSON.stringify(spec, null, 2) + '\n');

const budget = requestBudget(spec.budget);
let ordinal = null, step = null, elicit = null;
let session;
try {
  const credentials = (await productionChatGPTCredentials()).session();
  const hosted = chatGPTDialogAgent(await credentials, {
    fetch: async (url, options) => {
      if (String(url) !== 'https://api.openai.com/v1/responses') throw new Error('Unexpected inference endpoint');
      ordinal = budget.reserve(spec.id);
      if (ordinal === null) throw new Error('Trial request allowance reached; this is a pause, not a trial result');
      try {
        const response = await fetch(url, options);
        budget.record(ordinal, { status: 'response-headers-received', httpStatus: response.status, step });
        return response;
      } catch (error) { budget.record(ordinal, { status: 'transport-failed', usage: null, step }); throw error; }
    },
    onExchange: exchange => {
      append('exchanges.jsonl', JSON.stringify({ step, ...exchange }) + '\n');
      if (ordinal) budget.record(ordinal, { status: exchange.failure ? 'failed' : 'response-received', usage: exchange.response?.usage ?? null, failure: exchange.failure?.code ?? null });
    },
  });
  const agent = { identity: hosted.identity, open() {
    const conversation = hosted.open();
    return { close: () => conversation.close(),
      exchange: (input, signal, usage) => conversation.exchange(elicit ? { ...input, instructions: `${input.instructions}\n${elicit}` } : input, signal, usage) };
  } };
  // Only the trial's own output is excluded from evidence. The ledger file lives outside the analyzed project.
  const opened = await openApplication({ configPath: spec.project, excludedOutputDirectories: [spec.output] },
    { investigation: { dialogAgent: agent, onReport: report => append('attempts.jsonl', JSON.stringify(report) + '\n') } });
  if (opened.status !== 'opened') throw new Error(`Project did not open: ${JSON.stringify(opened)}`);
  session = opened.session;
  const results = new Map(), requests = new Map();
  for (const item of spec.steps) {
    step = item.label;
    elicit = typeof item.elicit === 'string' && item.elicit ? item.elicit : null;
    let request;
    if (item.request) request = item.request;
    else if (item.fresh) request = { ...requests.get(item.fresh), fresh: true };
    else if (item.followUp) {
      const earlier = results.get(item.followUp.from);
      const offered = earlier?.answer.content.value.projection.alternatives.flatMap(alternative => alternative.options) ?? [];
      const chosen = item.followUp.option === 'first' ? offered[0] : offered.find(option => option.address.key === item.followUp.option);
      if (!chosen) { append('steps.jsonl', JSON.stringify({ step, skipped: 'The earlier answer offers no such follow-up option.', offered: offered.map(option => option.address.key) }) + '\n'); continue; }
      request = { kind: 'lens', lens: 'follow-up', designation: { kind: 'reference', value: chosen.address.investigram }, parameters: { option: chosen.address.key } };
    } else throw new Error(`Step ${step} has no request`);
    const started = performance.now();
    const result = await session.execute(request);
    const record = { step, request, elicited: elicit, kind: result.kind, milliseconds: performance.now() - started, failed: result.failed ?? null, reporting: result.reporting ?? null };
    if (result.kind === 'answer' && result.answer.content.contract === 'contribution') {
      requests.set(step, request); results.set(step, result);
      const view = arrangeContributionAnswer(result.answer.content.value, result.title);
      view.alternatives.forEach((alternative, index) => alternative.diagrams.forEach((diagram, n) => {
        save(path.join('diagrams', `${step}-${index + 1}-${n + 1}.svg`), diagram.svg);
        save(path.join('diagrams', `${step}-${index + 1}-${n + 1}.txt`), diagram.text + '\n');
      }));
      Object.assign(record, { answer: result.answer.content.value.projection, view });
    } else Object.assign(record, { result });
    append('steps.jsonl', JSON.stringify(record) + '\n');
  }
  save('usage.json', JSON.stringify(session.usage(), null, 2) + '\n');
} finally {
  await session?.close();
  budget.close();
}

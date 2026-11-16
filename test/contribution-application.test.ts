import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { openApplication } from '../src/lib/application/index.js';
import type { ApplicationResult } from '../src/lib/application/index.js';
import { arrangeContributionAnswer } from '../src/lib/contributions/answers.js';
import type { DialogAgent, DialogInput, DialogReply } from '../src/lib/contributions/dialog.js';
import type { EntityId } from '../src/lib/contributions/model.js';
import { temporaryDirectory } from './cli-helpers.js';

const caveat = { limitations: ['Interpretation from the supplied source; not mechanically established.'] };
type Step = (input: DialogInput) => DialogReply;
/** Replaces only the agent-communication participant. Each opened conversation takes the next scripted dialog. */
class ScriptedDialogs implements DialogAgent {
  readonly identity = { provider: 'postcode-test', model: 'scripted', configuration: {}, origin: 'scripted' as const };
  readonly inputs: DialogInput[][] = [];
  constructor(readonly dialogs: (readonly Step[])[]) {}
  open() {
    const script = this.dialogs.shift(), inputs: DialogInput[] = [];
    assert.ok(script, 'Unexpected dialog');
    this.inputs.push(inputs);
    let position = 0;
    return { exchange: async (input: DialogInput) => { inputs.push(input); const step = script[position++]; assert.ok(step, 'Unexpected exchange'); return step(input); }, close() {} };
  }
}
function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-contribution-application-');
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['breaker.ts', 'timer.ts', 'plain.ts'] }));
  writeFileSync(path.join(root, 'breaker.ts'), "import { now } from './timer.js';\nlet state: 'closed' | 'open' = 'closed';\nlet openedAt = 0;\n/** Record a failure and trip the breaker. */\nexport function fail() { state = 'open'; openedAt = now(); }\n/** Allow a call only while closed. */\nexport function allowed() { return state === 'closed'; }\nexport function opened() { return openedAt; }\n");
  writeFileSync(path.join(root, 'timer.ts'), 'export function now() { return 0; }\n');
  writeFileSync(path.join(root, 'plain.ts'), 'export const value = 1;\n');
  execFileSync('git', ['init', '--quiet', root]);
  return { configPath: path.join(root, 'tsconfig.json') };
}
function answer(result: ApplicationResult) {
  assert.equal(result.kind, 'answer', JSON.stringify(result.kind === 'resolution' ? result.resolution : null));
  if (result.kind !== 'answer' || result.answer.content.contract !== 'contribution') throw new Error('Expected a contribution answer');
  assert.deepEqual(structuredClone(result), result);
  return { result, projection: result.answer.content.value.projection, content: result.answer.content.value };
}
const subject = (input: DialogInput) => (input.request.subjects[0] as { subject: { entity: EntityId } }).subject.entity;
/** A state-behavior account with a state model, an explanation and two follow-up options, one of which no operation supports. */
const stateAccount = (key: string, states: readonly string[]): Step => input => ({ kind: 'submit', contribution: { investigrams: [{ key, qualification: caveat, referents: [subject(input)],
  items: [{ key: 'model', type: 'state-model', body: { bearer: { entity: subject(input) }, states: states.map(state => ({ key: state, label: state[0]!.toUpperCase() + state.slice(1) })),
    initial: { kind: 'state', state: states[0] }, transitions: [{ key: 'trip', from: states[0], to: states[1], trigger: 'a failure is recorded', effect: 'records when it opened' }],
    coverage: { states: 'all', transitions: 'some' }, unsupported: [] } },
    { key: 'why', type: 'prose', body: { text: 'A module-level variable holds the state; recording a failure opens the breaker.' } }],
  declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result },
    members: [{ kind: 'item', item: { investigram: { local: key }, item: 'model' } }, { kind: 'item', item: { investigram: { local: key }, item: 'why' } }] }],
  options: [{ key: 'reopen', meaning: 'Investigate how the open state is left.', request: { operation: 'examine-content',
      subjects: [{ subject: { kind: 'content', item: { investigram: { local: key }, item: 'model' }, component: `state:${states[1]}` } }] } },
    { key: 'unsupported', meaning: 'Simulate the breaker.', request: { operation: 'simulate', subjects: [{ subject: { kind: 'entity', entity: subject(input) } }] } }] }] } });

test('the state-behavior investigation, its diagram, exact access and a retained follow-up option run through the application interface', async t => {
  const agent = new ScriptedDialogs([
    // 1. The state-behavior investigation of the breaker.
    [input => {
      assert.deepEqual([input.request.operation, input.request.resultContract, input.request.fresh], ['state-behavior', 'postcode/state-diagram-answer@1', false]);
      assert.match(input.instructions, /STATE-DEPENDENT BEHAVIOR/);
      return { kind: 'tools', requests: [{ kind: 'source', subject: (input.request.subjects[0] as { moduleRecord: string }).moduleRecord }] };
    }, stateAccount('states', ['closed', 'open'])],
    // 2. Invocation of the retained follow-up option: it acquires the earlier answer before adding to it.
    [input => {
      const [selected, option] = input.responses as { tool: string; kind?: string; value: { coverage?: string; item?: { type: string }; value?: { key: string; meaning: string } } }[];
      // The exact selected content arrives as the subject, and the invoked option arrives as substantive input.
      assert.deepEqual([selected!.kind, selected!.value.item?.type, option!.kind, option!.value.value?.key], ['item', 'state-model', 'metadata', 'reopen']);
      assert.deepEqual([input.request.operation, input.request.resultContract], ['examine-content', null]);
      const owner = (input.request.subjects[0] as { subject: { item: { investigram: string } } }).subject.item.investigram;
      return { kind: 'tools', requests: [{ kind: 'contribution', investigram: owner }] };
    }, input => {
      assert.equal((input.responses[0] as { kind: string }).kind, 'contribution');
      return { kind: 'submit', contribution: { investigrams: [{ key: 'reopen', qualification: caveat,
        items: [{ key: 'finding', type: 'prose', body: { text: 'Nothing in the supplied source leaves the open state: no transition back to closed is established.' } }],
        declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [{ kind: 'item', item: { investigram: { local: 'reopen' }, item: 'finding' } }] }] }] } };
    }],
    // 3. A module without state: useful prose and a reported inability, but no state model.
    [input => ({ kind: 'submit', contribution: { report: { inability: 'This module has no state-dependent behavior, so there is no state model to supply.' },
      investigrams: [{ key: 'none', qualification: caveat, items: [{ key: 'why', type: 'prose', body: { text: 'The module only exports a constant.' } }],
        declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [{ kind: 'item', item: { investigram: { local: 'none' }, item: 'why' } }] }] }] } })],
    // 4. An explicit fresh investigation of the first question: supplied the current answer, it adds an alternative.
    [input => {
      assert.equal(input.request.fresh, true);
      assert.deepEqual(input.responses.map(response => (response as { kind?: string }).kind), ['baseline', 'designations']);
      return stateAccount('again', ['closed', 'open', 'half-open'])(input);
    }],
  ]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') return;
  const session = opened.session;
  t.after(() => session.close());
  // Declared subject signatures and result contracts are visible as capabilities.
  const capabilities = Object.fromEntries(session.capabilities().map(item => [item.id, item]));
  assert.deepEqual([capabilities['state-behavior']!.subjects, capabilities['state-behavior']!.requirements, capabilities['state-behavior']!.results],
    [['module'], { kind: 'contribution', operation: 'state-behavior', resultContract: 'postcode/state-diagram-answer@1' }, ['contribution']]);
  assert.deepEqual([capabilities['follow-up']!.subjects, Object.keys(capabilities['follow-up']!.parameters)], [['contribution'], ['option']]);

  const request = { kind: 'lens' as const, lens: 'state-behavior', designation: { kind: 'name' as const, value: 'breaker' } };
  const first = answer(await session.execute(request));
  assert.deepEqual([first.result.failed, first.result.reporting?.reused, first.projection.fulfillment, first.projection.alternatives.length, first.result.selectionMode], [false, false, 'fulfilled', 1, 'fresh']);
  const alternative = first.projection.alternatives[0]!;
  assert.deepEqual([alternative.items.map(item => item.type), alternative.unmet, alternative.producer.mechanism, alternative.qualification?.status], [['state-model', 'prose'], [], 'agentic', 'interpretation']);
  // The requested diagram is rendered from the retained state model, with its explanation and qualification alongside.
  const view = arrangeContributionAnswer(first.content, first.result.title, 'breaker');
  assert.deepEqual([view.alternatives.length, view.alternatives[0]!.diagrams.length, view.alternatives[0]!.diagramUnavailable, view.noCurrentAnswer], [1, 1, null, null]);
  assert.match(view.alternatives[0]!.diagrams[0]!.svg, /<rect class="state"/);
  assert.deepEqual(view.alternatives[0]!.diagrams[0]!.legend.map(item => [item.from, item.to, item.trigger]), [['Closed', 'Open', 'a failure is recorded']]);
  assert.equal(view.alternatives[0]!.qualifications.some(item => /^Interpretation \(/.test(item)), true);
  assert.deepEqual(view.alternatives[0]!.options.map(option => [option.address.key, option.operation]), [['reopen', 'examine-content'], ['unsupported', 'simulate']]);

  // An ordinary equivalent request reuses the retained outcome: no dialog, the same answer.
  const repeated = answer(await session.execute({ ...request, designation: { kind: 'reference', value: first.projection.subject } }));
  assert.deepEqual([repeated.result.reporting?.reused, repeated.projection.id, agent.inputs.length], [true, first.projection.id, 1]);
  // Exact presentation follows only the retained answer.
  const exact = answer(await session.execute({ kind: 'present', target: first.projection.id }));
  assert.deepEqual([exact.result.selectionMode, exact.content, agent.inputs.length], ['retained', first.content, 1]);

  // Invoking the exact retained option delegates its question, preserving its owner and key.
  const owner = alternative.designation.investigram;
  const followUp = { kind: 'lens' as const, lens: 'follow-up', designation: { kind: 'reference' as const, value: owner }, parameters: { option: 'reopen' } };
  const followed = answer(await session.execute(followUp));
  assert.deepEqual([followed.projection.subject, followed.projection.parameters, followed.projection.question.request.operation, followed.result.failed, followed.projection.fulfillment],
    [owner, { option: 'reopen' }, 'examine-content', false, null]);
  assert.deepEqual(followed.projection.question.request.subjects, [{ role: null, subject: { kind: 'content', item: { investigram: owner, item: 'model' }, component: 'state:open' } }]);
  assert.match((followed.projection.alternatives[0]!.items[0]!.body as { text: string }).text, /no transition back to closed/);
  assert.equal(agent.inputs.length, 2);
  // The option's own answer does not change the answer it was offered from.
  assert.equal(answer(await session.execute(request)).projection.id, first.projection.id);
  // An option that names an unsupported operation, an unknown key and an unknown contribution are refused without running anything.
  for (const [parameters, designation, reason] of [[{ option: 'unsupported' }, owner, 'unsupported-subject'], [{ option: 'absent' }, owner, 'invalid-parameters'],
    [{ option: 'reopen' }, owner.replace(/.$/, owner.endsWith('0') ? '1' : '0'), 'unknown-reference']] as const) {
    const refused = await session.execute({ ...followUp, parameters, designation: { kind: 'reference', value: designation } });
    assert.deepEqual([refused.kind, refused.kind === 'resolution' && refused.resolution.reason], ['resolution', reason]);
  }
  const missing = await session.execute({ kind: 'lens', lens: 'follow-up', designation: { kind: 'reference', value: owner } });
  assert.deepEqual(missing.kind === 'resolution' && missing.resolution.reason, 'invalid-parameters');
  assert.equal(agent.inputs.length, 2);

  // A diagram request that the accepted contribution does not meet is disclosed; its content and declarations are retained and in effect.
  const plain = answer(await session.execute({ ...request, designation: { kind: 'name', value: 'plain' } }));
  assert.deepEqual([plain.result.failed, plain.projection.fulfillment, plain.projection.alternatives[0]!.unmet.map(item => item.reason)], [false, 'unfulfilled', ['The selected answer contains no state-model content.']]);
  const plainView = arrangeContributionAnswer(plain.content, plain.result.title, 'plain');
  assert.deepEqual([plainView.alternatives[0]!.diagrams, plainView.alternatives[0]!.diagramUnavailable, plainView.alternatives[0]!.prose], [[], 'This alternative selects no state model.', ['The module only exports a constant.']]);
  assert.equal(plainView.alternatives[0]!.qualifications.some(item => /Requested result not met/.test(item)), true);

  // An explicit fresh investigation runs new production. Its addition stands beside the earlier answer; neither is preferred.
  const fresh = answer(await session.execute({ ...request, fresh: true }));
  assert.deepEqual([fresh.result.reporting?.reused, fresh.projection.alternatives.length, fresh.projection.id === first.projection.id, agent.inputs.length], [false, 2, false, 4]);
  assert.deepEqual(fresh.projection.alternatives[0]!.designation, alternative.designation);
  const freshView = arrangeContributionAnswer(fresh.content, fresh.result.title, 'breaker');
  assert.deepEqual(freshView.alternatives.map(item => item.diagrams[0]!.legend.length), [1, 1]);
  assert.match(freshView.notices[0]!, /2 equally standing alternative answers are shown separately/);
  // The earlier exact answer still presents what it captured, and ordinary retrieval now selects both alternatives without a dialog.
  assert.deepEqual(answer(await session.execute({ kind: 'present', target: first.projection.id })).content, first.content);
  const afterwards = answer(await session.execute(request));
  assert.deepEqual([afterwards.result.reporting?.reused, afterwards.projection.id, agent.inputs.length], [true, fresh.projection.id, 4]);
  // The fresh intent has no meaning for a mechanical answer.
  const mechanical = await session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' }, fresh: true });
  assert.deepEqual(mechanical.kind === 'resolution' && mechanical.resolution.reason, 'invalid-parameters');
  // Attempts are reported through the Session's usage report.
  assert.equal(session.usage().attempts.length, 4);
});

test('without a configured agent the investigation is unavailable and fabricates no answer', async t => {
  const opened = await openApplication(fixture(t));
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') return;
  t.after(() => opened.session.close());
  const unavailable = answer(await opened.session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }));
  assert.deepEqual([unavailable.result.failed, unavailable.result.reporting, unavailable.projection.alternatives, unavailable.projection.fulfillment],
    [true, { reused: false, attempt: null }, [], 'no-designated-answer']);
  const view = arrangeContributionAnswer(unavailable.content, unavailable.result.title, 'breaker');
  assert.equal(view.noCurrentAnswer?.explanation, 'No answer has been designated for this question.');
});

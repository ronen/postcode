import { arrangeContributionAnswer } from '../scripts/structured-accounts/support/answers.js';
import type { AssociationAddress } from '../src/lib/contributions/model.js';
import { arrangeContributionView, renderContributionView } from '../src/lib/interfaces/cli/contribution-presentation.js';
import { openAIDialogAgent } from '../src/lib/investigation/openai/contribution-protocol.js';
import { applicationCatalog } from '../src/lib/application/catalog.js';
import { exportsLens } from '../src/lib/mechanical-implementations.js';
import { proseContribution } from './contribution-agent.js';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { openApplication } from '../src/lib/application/index.js';
import type { ApplicationResult } from '../src/lib/application/index.js';
import type { DialogAgent, DialogInput, DialogReply } from '../src/lib/contributions/dialog.js';
import type { EntityId, SubmittedContribution } from '../src/lib/contributions/model.js';
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
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } }, { ...applicationCatalog, lenses: { ...applicationCatalog.lenses, exports: exportsLens } });
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
  const view = arrangeContributionAnswer(first.content, first.result.title);
  assert.deepEqual([view.alternatives.length, view.alternatives[0]!.diagrams.length, view.alternatives[0]!.diagramUnavailable, view.noCurrentAnswer], [1, 1, null, null]);
  assert.match(view.alternatives[0]!.diagrams[0]!.svg, /<rect class="state"/);
  assert.deepEqual(view.alternatives[0]!.diagrams[0]!.legend.map(item => [item.from, item.to, item.trigger]), [['Closed', 'Open', 'a failure is recorded']]);
  assert.equal(view.alternatives[0]!.qualifications.flatMap(group => [...group.statements, ...(group.owner?.statements ?? [])]).some(item => /^Interpretation \(/.test(item)), true);
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
    if (parameters.option === 'unsupported' && refused.kind === 'resolution') {
      assert.match(refused.resolution.explanation, /simulate/);
      assert.match(refused.resolution.explanation, /no supported operation accepts.*cannot be invoked/);
    }
  }
  const missing = await session.execute({ kind: 'lens', lens: 'follow-up', designation: { kind: 'reference', value: owner } });
  assert.deepEqual(missing.kind === 'resolution' && missing.resolution.reason, 'invalid-parameters');
  assert.equal(agent.inputs.length, 2);

  // A diagram request that the accepted contribution does not meet is disclosed; its content and declarations are retained and in effect.
  const plain = answer(await session.execute({ ...request, designation: { kind: 'name', value: 'plain' } }));
  assert.deepEqual([plain.result.failed, plain.projection.fulfillment, plain.projection.alternatives[0]!.unmet.map(item => item.reason)], [false, 'unfulfilled', ['The selected answer contains no state-model content.']]);
  const plainView = arrangeContributionAnswer(plain.content, plain.result.title);
  assert.deepEqual([plainView.alternatives[0]!.diagrams, plainView.alternatives[0]!.diagramUnavailable, plainView.alternatives[0]!.prose], [[], 'This alternative selects no state model.', ['The module only exports a constant.']]);
  assert.equal(plainView.alternatives[0]!.qualifications.flatMap(group => [...group.statements, ...(group.owner?.statements ?? [])]).some(item => /Requested result not met/.test(item)), true);

  // An explicit fresh investigation runs new production. Its addition stands beside the earlier answer; neither is preferred.
  const fresh = answer(await session.execute({ ...request, fresh: true }));
  assert.deepEqual([fresh.result.reporting?.reused, fresh.projection.alternatives.length, fresh.projection.id === first.projection.id, agent.inputs.length], [false, 2, false, 4]);
  assert.deepEqual(fresh.projection.alternatives[0]!.designation, alternative.designation);
  const freshView = arrangeContributionAnswer(fresh.content, fresh.result.title);
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
  const retained: ApplicationResult[] = [];
  for (const lens of ['modules', 'organization', 'dependency-structure', 'dependency-children', 'dependency-parents', 'inspect', 'exports']) {
    const result = await session.execute({ kind: 'lens', lens, designation: ['modules', 'organization', 'dependency-structure'].includes(lens) ? { kind: 'configured-project' } : { kind: 'name', value: 'breaker' } });
    assert.equal(result.kind, 'answer'); assert.deepEqual(structuredClone(result), result); retained.push(result);
  }
  for (const lens of ['summarize', 'explain', 'decompose', 'examine']) {
    agent.dialogs.push([input => ({ kind: 'submit', contribution: proseContribution(input, `Qualified ${input.request.operation} answer.`) })]);
    const result = await session.execute({ kind: 'lens', lens, designation: lens === 'summarize' ? { kind: 'name', value: 'breaker' } : { kind: 'reference', value: owner } });
    assert.equal(result.kind, 'answer'); assert.equal(result.failed, false); retained.push(result);
  }
  for (const original of retained) {
    assert.equal(original.kind, 'answer');
    const exact = await session.execute({ kind: 'present', target: original.answer.id });
    assert.equal(exact.kind, 'answer'); assert.deepEqual(exact.answer, original.answer);
  }
  assert.equal(agent.inputs.length, 8);
  const snapshot = JSON.stringify(first.content);
  await session.close();
  assert.equal(JSON.stringify(first.content), snapshot);
  assert.deepEqual(arrangeContributionAnswer(first.content, first.result.title), view);
});

test('without a configured agent the investigation is unavailable and fabricates no answer', async t => {
  const opened = await openApplication(fixture(t));
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') return;
  t.after(() => opened.session.close());
  const unavailable = answer(await opened.session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }));
  assert.deepEqual([unavailable.result.failed, unavailable.projection.alternatives, unavailable.projection.fulfillment], [true, [], 'no-designated-answer']);
  assert.ok(unavailable.result.reporting?.attempt, 'An unavailable attempt is retained even when no agent can be opened');
  assert.equal(unavailable.result.reporting?.contribution?.outcome.kind, 'configuration-unavailable');
  assert.equal(unavailable.result.reporting?.unavailable?.code, 'investigating-agent-not-configured');
  const retry = answer(await opened.session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }));
  assert.equal(retry.result.reporting?.reused, false);
  assert.notEqual(retry.result.reporting?.attempt, unavailable.result.reporting?.attempt);
  assert.deepEqual(retry.projection, unavailable.projection);
  const view = arrangeContributionAnswer(unavailable.content, unavailable.result.title);
  assert.equal(view.noCurrentAnswer?.explanation, 'No answer has been designated for this question.');
});

test('failure then successful fresh work reuses an accepted attempt; later fresh inability stays separate from current fulfillment', async t => {
  const agent = new ScriptedDialogs([[() => ({ kind: 'ended' })], [stateAccount('ok', ['closed', 'open'])],
    [() => ({ kind: 'submit', contribution: { investigrams: [], report: { inability: 'FRESH_INABILITY_SENTINEL', statement: 'Coverage remains incomplete.' } } })]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const request = { kind: 'lens' as const, lens: 'state-behavior', designation: { kind: 'name' as const, value: 'breaker' } };
  const failed = answer(await session.execute(request));
  assert.equal(failed.result.failed, true);
  const success = answer(await session.execute({ ...request, fresh: true }));
  const reuse = answer(await session.execute(request));
  assert.equal(reuse.result.failed, false);
  assert.equal(reuse.result.reporting?.attempt, success.result.reporting?.attempt);
  assert.notEqual(reuse.result.reporting?.attempt, failed.result.reporting?.attempt);
  assert.equal(reuse.result.reporting?.contribution?.fulfillment?.status, 'fulfilled');
  const fresh = answer(await session.execute({ ...request, fresh: true }));
  assert.equal(fresh.projection.fulfillment, 'fulfilled');
  assert.equal(fresh.result.reporting?.contribution?.fulfillment?.status, 'no-answer-supplied');
  assert.equal(fresh.result.reporting?.contribution?.report?.inability, 'FRESH_INABILITY_SENTINEL');
  assert.equal(fresh.result.reporting?.contribution?.report?.statement, 'Coverage remains incomplete.');
  assert.equal(fresh.projection.id, success.projection.id, 'invocation-specific inability is not answer identity');
  assert.equal(agent.inputs.length, 3);
  assert.equal(session.usage().attempts.length, 3);
});

test('selected owner reports survive exact access while attempt diagnostics stay in delivery reporting', async t => {
  const agent = new ScriptedDialogs([[input => ({ kind: 'submit', contribution: { report: { inability: 'Could not verify concurrency', statement: 'Coverage is one scenario.' },
    investigrams: [{ key: 'partial', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Partial explanation.' } }],
      declarations: [{ key: 'a', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [{ kind: 'item', item: { investigram: { local: 'partial' }, item: 'p' } }] }] }] } })],
    [() => ({ kind: 'communication-failure', code: 'timeout', diagnostic: 'No service response.' })]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const partial = answer(await session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }));
  assert.equal(partial.result.reporting?.contribution?.report?.inability, 'Could not verify concurrency');
  const exact = answer(await session.execute({ kind: 'present', target: partial.projection.id }));
  const qualifications = arrangeContributionAnswer(exact.content, 'Partial').alternatives[0]!.qualifications.flatMap(group => [...group.statements, ...(group.owner?.statements ?? [])]);
  assert.ok(qualifications.includes('Producer-reported inability: Could not verify concurrency'));
  assert.ok(qualifications.includes('Coverage is one scenario.'));
  const unavailable = answer(await session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'plain' } }));
  assert.equal(unavailable.result.reporting?.unavailable?.code, 'timeout');
  const unavailableExact = answer(await session.execute({ kind: 'present', target: unavailable.projection.id }));
  assert.equal(unavailableExact.result.reporting, null);
  assert.ok(!JSON.stringify(unavailableExact.projection).includes('No service response.'));
});

test('cancellation reports already dispatched usage and accepts no late contribution', async t => {
  const { syntheticUsage } = await import('./investigator-double.js');
  const { CommandInterrupted } = await import('../src/lib/execution-errors.js');
  const controller = new AbortController();
  const reports: import('../src/lib/investigation/contracts.js').AttemptReport[] = [];
  let closed = false;
  const agent: DialogAgent = {
    identity: { provider: 'postcode-test', model: 'scripted', configuration: {}, origin: 'scripted' },
    open: () => ({ exchange: async (input, _signal, reportUsage) => {
      reportUsage(syntheticUsage);
      controller.abort();
      return stateAccount('late', ['closed', 'open'])(input);
    }, close: () => { closed = true; } }),
  };
  const opened = await openApplication(fixture(t), { signal: controller.signal, investigation: { dialogAgent: agent, onReport: report => reports.push(report) } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  t.after(() => opened.session.close());
  await assert.rejects(opened.session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }), CommandInterrupted);
  assert.equal(closed, true);
  assert.equal(reports.length, 1);
  assert.equal(reports[0]!.termination, 'interrupted');
  assert.equal(reports[0]!.usage.length, 1);
  assert.equal(opened.session.usage().calls, 1);
  assert.equal(opened.session.usage().attempts.length, 1);
});

test('failed attempts with different diagnostics preserve identical empty answer identity', async t => {
  const agent = new ScriptedDialogs([[() => ({ kind: 'ended' })],
    [() => ({ kind: 'communication-failure', code: 'timeout', diagnostic: 'Different failure reason.' })],
    [() => ({ kind: 'submit', contribution: { investigrams: [], report: { inability: 'No designation supplied.' } } })]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const request = { kind: 'lens' as const, lens: 'state-behavior', designation: { kind: 'name' as const, value: 'breaker' } };
  const first = answer(await session.execute(request));
  const second = answer(await session.execute({ ...request, fresh: true }));
  assert.equal(first.result.reporting?.contribution?.outcome.kind, 'investigation-failure');
  assert.equal(second.result.reporting?.unavailable?.code, 'timeout');
  assert.deepEqual(second.projection, first.projection);
  const empty = answer(await session.execute({ ...request, fresh: true }));
  assert.equal(empty.result.reporting?.contribution?.report?.inability, 'No designation supplied.');
  assert.deepEqual(empty.projection, first.projection);
  const exact = answer(await session.execute({ kind: 'present', target: first.projection.id }));
  assert.deepEqual(exact.projection, first.projection);
  assert.equal(exact.result.reporting, null);
});

test('distinct delegated options keep separate questions while repeated and fresh invocation stay with the same option', async t => {
  const reports: import('../src/lib/investigation/contracts.js').AttemptReport[] = [];
  const meanings = { reopen: 'Investigate how the open state is left.', shared: 'Investigate whether callers share state.' };
  const follow = (key: keyof typeof meanings, text: string): Step => input => {
    assert.equal(input.request.option?.key, key);
    const option = input.responses.find(response => response.tool === 'contribution' && response.kind === 'metadata');
    assert.ok(option && option.tool === 'contribution');
    assert.equal((option.value as { value: { meaning: string } }).value.meaning, meanings[key]);
    return { kind: 'submit', contribution: { investigrams: [{ key: 'answer', qualification: caveat,
      items: [{ key: 'p', type: 'prose', body: { text } }], declarations: [{ key: 'a', operation: 'add', target: { kind: 'result', result: input.request.result },
        members: [{ kind: 'item', item: { investigram: { local: 'answer' }, item: 'p' } }] }] }] } };
  };
  const agent = new ScriptedDialogs([[input => ({ kind: 'submit', contribution: { investigrams: [{ key: 'source', qualification: caveat,
    items: [{ key: 'p', type: 'prose', body: { text: 'Initial account.' } }],
    declarations: [{ key: 'a', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [{ kind: 'item', item: { investigram: { local: 'source' }, item: 'p' } }] }],
    options: Object.entries(meanings).map(([key, meaning]) => ({ key, meaning, request: { operation: 'examine-content',
      subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'source' }, item: 'p' } } }] } })) }] } })],
    [follow('reopen', 'ANSWER_A')], [follow('shared', 'ANSWER_B')], [follow('shared', 'FRESH_B')]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent, onReport: report => reports.push(report) } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const initial = answer(await session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }));
  const owner = initial.projection.alternatives[0]!.designation.investigram;
  const request = (option: string) => ({ kind: 'lens' as const, lens: 'follow-up', designation: { kind: 'reference' as const, value: owner }, parameters: { option } });
  const a = answer(await session.execute(request('reopen'))), b = answer(await session.execute(request('shared')));
  assert.equal(b.result.reporting?.reused, false);
  assert.notEqual(a.projection.question.result, b.projection.question.result);
  assert.deepEqual(b.projection.question.request.option, { investigram: owner, key: 'shared' });
  assert.equal((b.projection.alternatives[0]!.items[0]!.body as { text: string }).text, 'ANSWER_B');
  assert.ok(b.projection.support.metadata.some(meta => meta.address.metadata === 'option' && meta.address.key === 'shared' && 'meaning' in meta.value && meta.value.meaning === meanings.shared));
  assert.equal(answer(await session.execute(request('reopen'))).projection.id, a.projection.id);
  assert.equal(answer(await session.execute(request('shared'))).projection.id, b.projection.id);
  const fresh = answer(await session.execute({ ...request('shared'), fresh: true }));
  assert.equal(fresh.projection.question.result, b.projection.question.result);
  assert.deepEqual(fresh.projection.alternatives.map(alternative => (alternative.items[0]!.body as { text: string }).text), ['ANSWER_B', 'FRESH_B']);
  assert.equal(answer(await session.execute(request('reopen'))).projection.id, a.projection.id);
  assert.equal(agent.inputs.length, 4);
  assert.deepEqual(reports.filter(report => report.followUp).map(report => report.followUp), [
    { owner, key: 'reopen', meaning: meanings.reopen }, { owner, key: 'shared', meaning: meanings.shared }, { owner, key: 'shared', meaning: meanings.shared }]);
});

test('follow-up requirements and prospective Presentation refusal precede dialog and organizing changes', async t => {
  const { applicationCatalog } = await import('../src/lib/application/catalog.js');
  const agent = new ScriptedDialogs([[stateAccount('initial', ['closed', 'open'])], [input => ({ kind: 'submit', contribution: {
    investigrams: [{ key: 'followed', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Only the accepted request ran.' } }],
      declarations: [{ key: 'a', operation: 'add', target: { kind: 'result', result: input.request.result },
        members: [{ kind: 'item', item: { investigram: { local: 'followed' }, item: 'p' } }] }] }] } })]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } }, { ...applicationCatalog, presentations: [
    { id: 'account', contract: 'contribution', default: true, requirements: { modules: [], groups: [] }, precondition: 'qualified',
      eligibility: [{ option: 'format', when: 'always', values: ['json'], label: 'format' }] },
    { id: 'inventory', contract: 'modules', default: true, requirements: { modules: [], groups: [] }, precondition: 'qualified', eligibility: [] },
  ] });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const initial = answer(await session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }));
  const request = { kind: 'lens' as const, lens: 'follow-up', designation: { kind: 'reference' as const, value: initial.projection.alternatives[0]!.designation.investigram }, parameters: { option: 'reopen' } };
  for (const choices of [
    { requirements: { modules: ['exports' as const], groups: [] } },
    { requirements: { modules: [], groups: ['group-details' as const] } },
    { consumption: { presentations: ['inventory'], options: {} } },
    { consumption: { presentations: ['account'], options: { format: 'unsupported' } } },
    { consumption: { presentations: ['account'], options: { format: 'json', source: true } } },
    { consumption: { presentations: ['account'], options: { format: 'json', page: 1 } } },
  ]) {
    const refused = await session.execute({ ...request, ...choices, fresh: true });
    assert.equal(refused.kind, 'resolution');
    if (refused.kind !== 'resolution') throw new Error('Expected preflight refusal');
    assert.equal(refused.resolution.reason, 'presentation-unavailable');
    assert.deepEqual(refused.resolution.retainedAnswers, []);
    assert.equal(agent.inputs.length, 1);
    assert.equal(session.usage().attempts.length, 1);
  }
  const valid = answer(await session.execute({ ...request, consumption: { presentations: ['account'], options: { format: 'json' } } }));
  assert.equal(valid.result.reporting?.reused, false);
  assert.equal(valid.result.consumption?.selected.id, 'account');
  assert.equal(valid.projection.alternatives.length, 1);
  assert.equal(agent.inputs.length, 2);
  assert.deepEqual(answer(await session.execute({ kind: 'present', target: initial.projection.id })).projection, initial.projection);
});

test('a follow-up forwards and enforces its promised result contract, including unfulfilled accepted content and unknown-contract refusal', async t => {
  const contract = 'postcode/state-diagram-answer@1';
  const initial: Step = input => {
    const reply = stateAccount('source', ['closed', 'open'])(input);
    assert.equal(reply.kind, 'submit');
    if (reply.kind !== 'submit') throw new Error('Expected submitted fixture');
    const contribution = reply.contribution as SubmittedContribution;
    return { kind: 'submit', contribution: { ...contribution, investigrams: contribution.investigrams.map(ig => ({ ...ig,
      options: ['complete', 'partial', 'unknown'].map(key => ({ key, meaning: `Examine the retained model: ${key}.`,
        request: { operation: 'examine-content', subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'source' }, item: 'model' } } }],
          resultContract: key === 'unknown' ? 'test/unsupported-contract@1' : contract } })) })) } };
  };
  const follow = (complete: boolean): Step => input => {
    // examine-content has no implicit specialized contract: this must come from the exact option.
    assert.deepEqual([input.request.operation, input.request.resultContract, input.request.option?.key], ['examine-content', contract, complete ? 'complete' : 'partial']);
    const metadata = input.responses.find(response => response.tool === 'contribution' && response.kind === 'metadata');
    assert.ok(metadata && metadata.tool === 'contribution');
    assert.equal((metadata.value as { value: { request: { resultContract: string } } }).value.request.resultContract, contract);
    return { kind: 'submit', contribution: { investigrams: [{ key: 'follow', qualification: caveat,
      items: [complete ? { key: 'answer', type: 'state-model', body: { bearer: { role: 'The selected breaker' },
        states: [{ key: 'open', label: 'Open' }], initial: { kind: 'unknown' }, transitions: [], coverage: { states: 'some', transitions: 'unknown' } } }
        : { key: 'answer', type: 'prose', body: { text: 'Only partial prose was established; no state model is supplied.' } }],
      declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result },
        members: [{ kind: 'item', item: { investigram: { local: 'follow' }, item: 'answer' } }] }] }] } };
  };
  const agent = new ScriptedDialogs([[initial], [follow(true)], [follow(false)]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const first = answer(await session.execute({ kind: 'lens', lens: 'state-behavior', designation: { kind: 'name', value: 'breaker' } }));
  const retainedUnknown = first.projection.alternatives[0]!.options.find(option => option.address.key === 'unknown');
  assert.equal(retainedUnknown?.option.request.resultContract, 'test/unsupported-contract@1', 'unsupported capability does not invalidate retained guidance');
  const owner = first.projection.alternatives[0]!.designation.investigram;
  const request = (option: string) => ({ kind: 'lens' as const, lens: 'follow-up', designation: { kind: 'reference' as const, value: owner }, parameters: { option } });
  for (const [key, expected] of [['complete', 'fulfilled'], ['partial', 'unfulfilled']] as const) {
    const result = answer(await session.execute(request(key)));
    assert.equal(result.result.failed, false, 'a contract shortfall does not invalidate useful accepted content');
    assert.equal(result.result.reporting?.contribution?.outcome.kind, 'accepted');
    assert.equal(result.projection.question.request.resultContract, contract);
    assert.deepEqual(result.projection.question.request.option, { investigram: owner, key });
    assert.equal(result.result.reporting?.contribution?.fulfillment?.contract, contract);
    assert.equal(result.result.reporting?.contribution?.fulfillment?.status, expected);
    assert.equal(result.projection.fulfillment, expected);
    assert.deepEqual(result.projection.alternatives[0]!.unmet.map(item => item.reason), key === 'complete' ? [] : ['The selected answer contains no state-model content.']);
    const reused = answer(await session.execute(request(key)));
    assert.equal(reused.result.reporting?.reused, true);
    assert.equal(reused.projection.id, result.projection.id);
    assert.equal(reused.result.reporting?.contribution?.fulfillment?.status, expected);
    const exact = answer(await session.execute({ kind: 'present', target: result.projection.id }));
    assert.deepEqual(exact.projection, result.projection);
  }
  const refused = await session.execute(request('unknown'));
  assert.equal(refused.kind, 'resolution');
  if (refused.kind !== 'resolution') throw new Error('Expected unsupported contract refusal');
  assert.equal(refused.resolution.reason, 'invalid-parameters');
  assert.match(refused.resolution.explanation, /test\/unsupported-contract@1 is not supported/);
  assert.equal(agent.inputs.length, 3, 'unknown contracts and reused/exact answers never open an extra dialog');
  assert.deepEqual(agent.inputs.map(inputs => inputs.length), [1, 1, 1], 'contract shortfalls do not enter structural repair');
});


test('application invocation delivers explicit retained option context and preserves exact earlier answers', async t => {
  const agent = new ScriptedDialogs([[input => ({ kind: 'submit', contribution: { investigrams: [{ key: 'start', qualification: caveat,
    items: [{ key: 'answer', type: 'prose', body: { text: 'The initial selected answer.' } },
      { key: 'context', type: 'prose', body: { text: 'OPTION_CONTEXT_SENTINEL' }, qualification: { limitations: ['CONTEXT_QUALIFICATION'] } }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [{ kind: 'item', item: { investigram: { local: 'start' }, item: 'answer' } }] }],
    options: [{ key: 'next', meaning: 'Investigate with the selected context.', request: { operation: 'examine-content',
      subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'start' }, item: 'answer' } } }],
      context: [{ kind: 'content', item: { investigram: { local: 'start' }, item: 'context' } }] } }] }] } })],
    [input => {
      assert.equal(input.request.context.length, 1);
      const context = input.request.context[0]!; assert.equal(context.kind, 'content');
      if (context.kind !== 'content') throw Error('Expected selected content context');
      assert.equal(context.item.item, 'context');
      const response = input.responses[1] as { value: { item: { body: { text: string }; qualification: { limitations: string[] } } } };
      assert.equal(response.value.item.body.text, 'OPTION_CONTEXT_SENTINEL');
      assert.deepEqual(response.value.item.qualification.limitations, ['CONTEXT_QUALIFICATION']);
      return { kind: 'submit', contribution: proseContribution(input, 'The follow-up consumed its explicit context.') };
    }]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const first = answer(await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'breaker' } }));
  const snapshot = JSON.stringify(first.content), owner = first.projection.alternatives[0]!.designation.investigram;
  const invoked = answer(await session.execute({ kind: 'lens', lens: 'follow-up', designation: { kind: 'reference', value: owner }, parameters: { option: 'next' } }));
  assert.equal(invoked.result.failed, false);
  const repeated = answer(await session.execute({ kind: 'lens', lens: 'follow-up', designation: { kind: 'reference', value: owner }, parameters: { option: 'next' } }));
  assert.deepEqual(repeated.projection, invoked.projection); assert.equal(agent.inputs.length, 2);
  const exact = await session.execute({ kind: 'present', target: first.projection.id });
  assert.equal(exact.kind, 'answer'); assert.equal(JSON.stringify(exact.answer.content.value), snapshot);
  await session.close(); assert.equal(JSON.stringify(first.content), snapshot);
});


test('hosted authored option context is retained, invoked and reused through the application', async t => {
  let calls = 0;
  const agent = openAIDialogAgent('test-not-a-credential', { fetch: async (_url, options) => {
    const sent = JSON.parse(String(options?.body));
    const message = JSON.parse(sent.input.at(-1).content);
    const input = message.request;
    let contribution;
    if (++calls === 1) {
      const schema = sent.tools[1].parameters.properties.investigrams.items.properties.options.items.properties.request;
      assert.ok(schema.properties.context); assert.ok(!schema.required.includes('context'));
      assert.match(sent.instructions, /not required on every option/);
      contribution = { investigrams: [{ key: 'authored', qualification: caveat,
        items: [{ key: 'subject', type: 'prose', body: { text: 'The selected explanation.' } },
          { key: 'basis', type: 'prose', body: { text: 'HOSTED_SELECTED_CONTEXT' }, qualification: { limitations: ['HOSTED_CONTEXT_LIMIT'] } }],
        declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.result }, members: [{ kind: 'item', item: { investigram: { local: 'authored' }, item: 'subject' } }] }],
        options: [{ key: 'deeper', meaning: 'Investigate with additional context.', request: { operation: 'examine-content',
          subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'authored' }, item: 'subject' } } }],
          context: [{ kind: 'content', item: { investigram: { local: 'authored' }, item: 'basis' } }] } }] }] };
    } else {
      assert.equal(calls, 2);
      assert.equal(input.subjects[0].subject.item.item, 'subject');
      assert.equal(input.context[0].item.item, 'basis');
      assert.equal(message.responses[1].value.address.investigram, input.context[0].item.investigram);
      assert.equal(message.responses[1].value.item.body.text, 'HOSTED_SELECTED_CONTEXT');
      assert.deepEqual(message.responses[1].value.item.qualification.limitations, ['HOSTED_CONTEXT_LIMIT']);
      contribution = { investigrams: [{ key: 'follow', qualification: caveat,
        items: [{ key: 'answer', type: 'prose', body: { text: 'Used the selected context.' } }],
        declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.result }, members: [{ kind: 'item', item: { investigram: { local: 'follow' }, item: 'answer' } }] }] }] };
    }
    return new Response(JSON.stringify({ id: `response-${calls}`, model: 'gpt-6-sol', status: 'completed', output: [
      { type: 'function_call', name: 'submit_contribution', call_id: `call-${calls}`, arguments: JSON.stringify(contribution) }] }), { headers: { 'content-type': 'application/json' } });
  } });
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const first = answer(await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'breaker' } }));
  assert.equal(first.result.failed, false);
  const offered = first.projection.alternatives[0]!.options[0]!, context = offered.option.request.context[0]!;
  assert.equal(context.kind, 'content');
  if (context.kind !== 'content') throw Error('Expected explicit context');
  assert.deepEqual(context.item, { investigram: offered.address.investigram, item: 'basis' });
  const snapshot = JSON.stringify(first.content);
  const request = { kind: 'lens' as const, lens: 'follow-up', designation: { kind: 'reference' as const, value: offered.address.investigram }, parameters: { option: offered.address.key } };
  const invoked = answer(await session.execute(request)); assert.equal(invoked.result.failed, false);
  assert.deepEqual(invoked.projection.question.request.context, offered.option.request.context);
  assert.deepEqual(answer(await session.execute(request)).projection, invoked.projection); assert.equal(calls, 2);
  await session.close(); assert.equal(JSON.stringify(first.content), snapshot);
});


for (const lens of ['state-behavior', 'summarize']) test(`${lens}: returned withdrawn answers disclose standing separately from current answers`, async t => {
  let original!: AssociationAddress;
  const agent = new ScriptedDialogs([
    [stateAccount('original', ['closed', 'open'])],
    [() => ({ kind: 'submit', contribution: { investigrams: [{ key: 'withdraw', qualification: caveat,
      declarations: [{ key: 'withdraw', operation: 'withdraw', displaces: [original], grounds: { text: 'Withdraw the earlier account.' } }] }] } })],
    [() => ({ kind: 'submit', contribution: { investigrams: [], report: { answer: [original] } } })],
    [input => ({ kind: 'submit', contribution: { investigrams: [{ key: 'readopt', qualification: caveat,
      declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result },
        members: [{ kind: 'item', item: { investigram: original.investigram, item: 'model' } }] }] }] } })],
  ]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const request = { kind: 'lens' as const, lens, designation: { kind: 'name' as const, value: 'breaker' } };
  const first = answer(await session.execute(request)); original = first.projection.alternatives[0]!.designation;
  const historical = structuredClone(first.content);
  const withdrawn = answer(await session.execute({ ...request, fresh: true }));
  const returned = answer(await session.execute({ ...request, fresh: true }));
  assert.equal(returned.result.failed, false);
  assert.deepEqual(returned.projection, withdrawn.projection, 'attempt reporting does not change no-current-answer identity');
  assert.equal(returned.projection.fulfillment, lens === 'state-behavior' ? 'no-current-answer' : null);
  assert.deepEqual(returned.projection.alternatives, []);
  const reporting = returned.result.reporting!.contribution!;
  assert.equal(reporting.fulfillment?.status ?? null, lens === 'state-behavior' ? 'fulfilled' : null);
  assert.deepEqual(reporting.answers, [{ designation: original, standing: { state: 'displaced',
    displacedBy: returned.projection.history[0]!.displacedBy.map(({ change, operation }) => ({ change, operation })) } }]);
  assert.equal(reporting.answers[0]!.standing.displacedBy[0]!.operation, 'withdraw');
  if (reporting.fulfillment) assert.deepEqual(reporting.fulfillment.alternatives, reporting.answers.map(answer => ({ ...answer, unmet: [] })));
  const reportSnapshot = structuredClone(returned.result.reporting);
  const view = arrangeContributionView(returned.content, { title: returned.result.title, presentation: { format: 'unicode', moreDetails: false } },
    returned.result.reporting, returned.result.usage, new Map(returned.result.bindings.associations)).view;
  const rendered = renderContributionView(view);
  if (lens === 'state-behavior') assert.match(rendered, /Attempt fulfillment: fulfilled/);
  else assert.doesNotMatch(rendered, /Attempt fulfillment:/);
  assert.match(rendered, /Attempt answer standing when assessed: withdrawn by/);
  assert.match(rendered, /neither endorsement nor re-adoption/);
  assert.ok(view.summary!.noCurrentAnswer);
  assert.deepEqual(structuredClone(view.reporting), reportSnapshot);
  const readopted = answer(await session.execute({ ...request, fresh: true }));
  assert.equal(readopted.projection.fulfillment, lens === 'state-behavior' ? 'fulfilled' : null);
  assert.notDeepEqual(readopted.projection.alternatives[0]!.designation, original);
  assert.deepEqual(readopted.projection.alternatives[0]!.items[0]!.body, first.projection.alternatives[0]!.items[0]!.body);
  const exact = answer(await session.execute({ kind: 'present', target: first.projection.id }));
  assert.deepEqual(exact.content, historical); assert.equal(exact.result.reporting, null);
  await session.close();
  assert.deepEqual(first.content, historical); assert.deepEqual(returned.result.reporting, reportSnapshot);
  assert.equal(renderContributionView(view), rendered, 'report presentation needs no live Session or new standing lookup');
});

test('offered option qualifications survive direct and JSON arrangement and exact historical presentation', async t => {
  const agent = new ScriptedDialogs([[input => ({ kind: 'submit', contribution: { investigrams: [{ key: 'offer', qualification: { limitations: ['OWNER_LIMIT'] },
    items: [{ key: 'p', type: 'prose', body: { text: 'A qualified account.' } }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result },
      members: [{ kind: 'item', item: { investigram: { local: 'offer' }, item: 'p' } }] }],
    options: [{ key: 'next', meaning: 'Investigate further', qualification: { limitations: ['OPTION_ONLY_LIMIT: valid only for the hypothetical deployment.'] },
      request: { operation: 'clarification', subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'offer' }, item: 'p' } } }] } }] }] } })],
    [input => ({ kind: 'submit', contribution: proseContribution(input, 'Later account without the old offer.') })]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const request = { kind: 'lens' as const, lens: 'summarize', designation: { kind: 'name' as const, value: 'breaker' } };
  const first = answer(await session.execute(request));
  const direct = arrangeContributionAnswer(first.content, first.result.title);
  const offered = direct.alternatives[0]!.options[0]!;
  assert.match(JSON.stringify(offered), /OPTION_ONLY_LIMIT/);
  assert.deepEqual(offered.qualification.source, { kind: 'metadata', address: offered.address });
  assert.ok(offered.qualification.statements.includes('OPTION_ONLY_LIMIT: valid only for the hypothetical deployment.'));
  assert.ok(!offered.qualification.statements.includes('OWNER_LIMIT'));
  assert.ok(offered.qualification.owner!.statements.includes('OWNER_LIMIT'));
  assert.ok(!offered.qualification.owner!.statements.some(statement => statement.startsWith('OPTION_ONLY_LIMIT')));
  const json = (value: typeof first) => arrangeContributionView(value.content, { title: value.result.title, presentation: { format: 'json', moreDetails: false } },
    null, value.result.usage, new Map(value.result.bindings.associations)).view;
  const view = json(first);
  assert.match(renderContributionView(view), /OPTION_ONLY_LIMIT/);
  assert.deepEqual(JSON.parse(renderContributionView(view)).summary.alternatives[0].options[0], offered);
  assert.ok(view.qualification.some(group => group.source === JSON.stringify(offered.address) && group.statements.includes('OPTION_ONLY_LIMIT: valid only for the hypothetical deployment.')));
  await session.execute({ ...request, fresh: true });
  const exact = answer(await session.execute({ kind: 'present', target: first.projection.id }));
  assert.deepEqual(arrangeContributionAnswer(exact.content, first.result.title), direct);
  assert.deepEqual(json(exact).summary, view.summary);
  await session.close();
  assert.deepEqual(arrangeContributionAnswer(structuredClone(first.content), first.result.title), direct);
});

test('a dialog cannot claim native identity and can repair with an independently inspectable Entity', async t => {
  const offer = (input: DialogInput, claimNative: boolean): DialogReply => {
    const module = (input.request.subjects[0] as { moduleRecord: string }).moduleRecord;
    return { kind: 'submit', contribution: { investigrams: [{ key: 'distinct', qualification: caveat,
      entities: [{ key: 'distinct', entityKind: 'module', ...(claimNative ? { native: { provider: 'typescript', rule: 'different-discovery@1', scope: 'configured-project',
        key: module.replace(/^session:[^:]+/, 'session') } } : {}) }],
      items: [{ key: 'name', type: 'identification', body: { name: 'Distinct module', nameOrigin: 'assigned', designation: 'An independently identified module.' } }],
      declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: { local: 'distinct' }, role: 'identification' },
        members: [{ kind: 'item', item: { investigram: { local: 'distinct' }, item: 'name' } }] },
      { key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result },
        members: [{ kind: 'item', item: { investigram: { local: 'distinct' }, item: 'name' } }] }],
      options: [{ key: 'investigate', meaning: 'Investigate this distinct Entity.', request: { operation: 'summarize',
        subjects: [{ subject: { kind: 'entity', entity: { local: 'distinct' } } }] } }] }] } };
  };
  const agent = new ScriptedDialogs([[input => offer(input, true), input => offer(input, false)]]);
  const opened = await openApplication(fixture(t), { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  const session = opened.session; t.after(() => session.close());
  const seed = answer(await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'breaker' } }));
  assert.equal(agent.inputs[0]!.length, 2);
  assert.match(JSON.stringify(agent.inputs[0]![1]!.responses), /host-established authority/);
  const owner = seed.projection.alternatives[0]!.designation.investigram;
  const selected = seed.projection.alternatives[0]!.options[0]!.option.request.subjects[0]!.subject;
  assert.equal(selected.kind, 'entity'); if (selected.kind !== 'entity') return;
  const inspection = await session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'selection', subject: selected } });
  assert.equal(inspection.kind, 'answer');
  if (inspection.kind !== 'answer') return;
  assert.equal(inspection.answer.content.contract, 'contribution-inspection');
  if (inspection.answer.content.contract !== 'contribution-inspection') return;
  assert.deepEqual(inspection.answer.content.value.projection.subjects, [selected]);
  assert.equal(inspection.answer.content.value.projection.mechanical, null);
  assert.equal(inspection.answer.content.value.projection.support.items.some(item => item.item.type === 'module-identification'), false);
  for (const request of [
    { kind: 'lens' as const, lens: 'summarize', designation: { kind: 'selection' as const, subject: selected } },
    { kind: 'lens' as const, lens: 'follow-up', designation: { kind: 'reference' as const, value: owner }, parameters: { option: 'investigate' } },
  ]) {
    const result = await session.execute(request);
    assert.equal(result.kind, 'resolution');
    if (result.kind === 'resolution') assert.equal(result.resolution.reason, 'unsupported-subject');
  }
  assert.equal(agent.inputs.length, 1, 'Neither direct nor follow-up module invocation opens another dialog');
});

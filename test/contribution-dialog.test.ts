import { openAIDialogAgent } from '../src/lib/investigation/openai/contribution-protocol.js';
import type { ReportedUsage } from '../src/lib/investigation/contracts.js';
import { ScriptedContributionAgent, proseContribution } from './contribution-agent.js';
import { contributionOperationMethod } from '../src/lib/contributions/operations.js';
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { contributionEvaluation } from '../src/lib/contributions/evaluation.js';
import { InvestigationUsage } from '../src/lib/investigation/usage.js';
import { conductDialog, dialogInstructions } from '../src/lib/contributions/dialog.js';
import type { DialogAgent, DialogInput, DialogOperation, DialogReply, DialogResponse } from '../src/lib/contributions/dialog.js';
import type { AssociationAddress, EntityId, InvestigramId, SubmittedInvestigram, SubjectRef } from '../src/lib/contributions/model.js';
import { moduleEntity, sessionLedger } from '../src/lib/contributions/modules.js';
import type { ResultContract } from '../src/lib/contributions/outcomes.js';
import type { DeliveredAssociation } from '../src/lib/contributions/production.js';
import { evidenceAccess } from '../src/lib/evidence-access.js';
import type { RecordId } from '../src/lib/records.js';
import { discover } from './helpers.js';

const caveat = { limitations: ['Interpretation from the supplied evidence; not mechanically established.'] };
const operation: DialogOperation = { id: 'functionality', method: 'test/functionality@1', objective: 'Give a terse account of the module.' };
type Step = (input: DialogInput) => DialogReply | Promise<DialogReply>;
/** Replaces only the agent-communication participant; coordination, acquisition and acceptance are real. */
class ScriptedDialogAgent implements DialogAgent {
  readonly identity = { provider: 'postcode-test', model: 'scripted', configuration: {}, origin: 'scripted' as const };
  readonly inputs: DialogInput[] = [];
  closes = 0;
  constructor(readonly script: readonly Step[]) {}
  open() {
    let position = 0;
    return { exchange: async (input: DialogInput) => { this.inputs.push(input); const step = this.script[position++]; assert.ok(step, 'Unexpected exchange'); return step(input); },
      close: () => { this.closes++; } };
  }
}
async function setup() {
  const { store, evaluation, analysis, claims } = await discover(path.resolve('fixtures', 'exports', 'tsconfig.json'));
  const session = evaluation.session, ledger = sessionLedger(store, session), evidence = evidenceAccess(store, analysis, session);
  const record = (handle: string) => claims.find(claim => claim.information.handle === handle)!.subject;
  const entity = (handle: string) => moduleEntity(store, record(handle))!;
  const invoke = (subject: EntityId, resultContract: string | null = null, fresh = false) =>
    ledger.invoke({ operation: operation.id, subjects: [{ role: null, subject: { kind: 'entity', entity: subject } }], parameters: {}, context: [], resultContract }, { fresh });
  const run = (script: readonly Step[], invocation: ReturnType<typeof invoke>['invocation'], extra: Partial<Parameters<typeof conductDialog>[0]> = {}) => {
    const agent = new ScriptedDialogAgent(script);
    return conductDialog({ ledger, store, evidence, operation, invocation: invocation.id, agent, check: async () => {}, ...extra }).then(execution => ({ execution, agent }));
  };
  const account = (key: string, subject: EntityId, result: string, text = `Account ${key}.`): SubmittedInvestigram => ({ key, qualification: caveat, referents: [subject],
    items: [{ key: 'p', type: 'prose', body: { text } }],
    declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity: subject, role: 'topic', topic: 'function' }, members: [{ kind: 'item', item: { investigram: { local: key }, item: 'p' } }] },
      { key: 'answer', operation: 'add', target: { kind: 'result', result: result as never }, members: [{ kind: 'association', association: { investigram: { local: key }, declaration: 'use' } }] }] });
  return { store, ledger, record, entity, invoke, run, account };
}
const kinds = (deliveries: readonly { kind: string }[]) => deliveries.map(delivery => delivery.kind);
const causes = (ledger: Awaited<ReturnType<typeof setup>>['ledger'], id: InvestigramId) => ledger.status.investigram(id).producing;

test('a dialog consumes retained mechanical module information, receives requested mechanical results, and records exactly that exposure', async () => {
  const { store, ledger, record, entity, invoke, run, account } = await setup();
  const barrel = entity('barrel'), origin = entity('origin'), exportsScope = (target: EntityId) => ({ kind: 'entity' as const, entity: target, role: 'topic' as const, topic: 'exports' });
  // A control dialog on another module acquires its exports scope while no export finding exists, and requests nothing further.
  const control = invoke(origin);
  const controlled = await run([() => ({ kind: 'tools', requests: [{ kind: 'inventory', scope: exportsScope(origin), inventory: 'current-only' }] }),
    input => { assert.deepEqual((input.responses[0] as { value: { listed: unknown[] } }).value.listed, []); return { kind: 'submit', contribution: { investigrams: [account('c', origin, control.result.id)] } }; }], control.invocation);
  const main = invoke(barrel);
  let citedClaim: RecordId | undefined, retainedUse: AssociationAddress | undefined, acquiredSeparately = false;
  const finish = (retained: readonly DeliveredAssociation[]): DialogReply => {
    assert.deepEqual([retained.length, retained[0]!.owner.producer.mechanism, retained[0]!.content[0]!.type], [1, 'mechanical', 'module-exports']);
    retainedUse = retained[0]!.address;
    const submitted = account('a', barrel, main.result.id, 'The module forwards the exports of its origin.');
    return { kind: 'submit', contribution: { investigrams: [{ ...submitted,
      items: [{ ...submitted.items![0]!, evidence: [citedClaim!], support: [retained[0]!.content[0]!.address] }] }] } };
  };
  const { execution, agent } = await run([
    input => {
      // Initial context: the subject Entity's standing identifications, with the mechanical finding's own qualification.
      const baseline = (input.responses[0] as { kind: string; value: { entity: EntityId; identifications: DeliveredAssociation[] } });
      assert.deepEqual([baseline.kind, baseline.value.entity, baseline.value.identifications.length], ['baseline', barrel, 1]);
      assert.equal(baseline.value.identifications[0]!.content[0]!.qualification?.status, 'mechanically-derived');
      assert.deepEqual([input.request.subjects.length, (input.request.subjects[0] as { moduleRecord: string }).moduleRecord, input.notices], [1, record('barrel'), []]);
      return { kind: 'tools', requests: [{ kind: 'inventory', scope: exportsScope(barrel), inventory: 'current-only' }, { kind: 'exports', subject: record('barrel') }] };
    },
    input => {
      const [inventory, exported] = input.responses as [DialogResponse & { value: { listed: unknown[] } }, Extract<DialogResponse, { tool: 'evidence' }>];
      // The scope was empty when acquired. The requested mechanical work then established the finding and its use, which reach this dialog as a recorded delivery.
      assert.deepEqual(inventory.value.listed, []);
      assert.equal(exported.response.records.some(item => item.kind === 'claim' && item.information.type === 'export'), true);
      assert.deepEqual(exported.entities.filter(item => item.record === record('barrel')), [{ record: record('barrel'), entity: barrel }]);
      citedClaim = exported.response.records.find(item => item.kind === 'claim' && item.information.type === 'export')!.id;
      // Absolute paths change evidence pagination. Accept either inline delivery or an explicit omission,
      // then acquire the exact omitted use before citing it as support.
      if (exported.retained.length) {
        assert.deepEqual(exported.retainedOmitted, []);
        return finish(exported.retained as readonly DeliveredAssociation[]);
      }
      acquiredSeparately = true;
      assert.equal(exported.retainedOmitted.length, 1);
      assert.deepEqual(input.notices.map(notice => [notice.change, notice.operation]), [[exported.retainedOmitted[0], 'add']]);
      assert.match(exported.response.limitations.at(-1)!, /was not delivered/);
      return { kind: 'tools', requests: [{ kind: 'association', association: exported.retainedOmitted[0]!, content: true }] };
    },
    input => {
      const acquired = input.responses[0]!;
      assert.equal(acquired.tool, 'contribution');
      if (acquired.tool !== 'contribution' || acquired.kind !== 'association') return assert.fail('Expected acquired export use');
      return finish([acquired.value as DeliveredAssociation]);
    },
  ], main.invocation);
  assert.equal(execution.outcome.kind, 'accepted');
  if (execution.outcome.kind !== 'accepted') return;
  const produced = execution.outcome.acceptance.productions[0]!.investigrams.a!;
  // Exactly what was dispatched: baseline and acquired scope, an addition notice when content was omitted, then the retained export use and its content.
  assert.deepEqual(kinds(execution.production.deliveries), ['scope', 'association', 'item', 'scope', ...(acquiredSeparately ? ['notice'] : []), 'association', 'item']);
  assert.equal(execution.production.evidence.includes(citedClaim!), true);
  assert.deepEqual([execution.production.producer.mechanism, execution.production.producer.agent?.model, execution.production.invocation, agent.closes], ['agentic', 'scripted', main.invocation.id, 1]);
  assert.equal(ledger.investigram(produced).qualification?.status, 'interpretation');
  // The mechanical work it requested keeps its own producers and received nothing.
  const mechanical = ledger.production(ledger.investigram(retainedUse!.investigram).production);
  assert.deepEqual([mechanical.producer.mechanism, mechanical.deliveries], ['mechanical', []]);
  // The addition within its acquired exports scope was delivered to it, so it is known; the control never received it.
  assert.deepEqual(causes(ledger, produced), []);
  const controlId = controlled.execution.outcome.kind === 'accepted' ? controlled.execution.outcome.acceptance.productions[0]!.investigrams.c! : assert.fail();
  assert.deepEqual(causes(ledger, controlId).map(cause => cause.routes.map(route => [route.kind, 'effect' in route && route.effect])), [[['scope', 'addition']]]);
  // A later withdrawal of the consumed identification is a cause for the dialog's contribution.
  const identification = ledger.identifications(barrel)[0]!.address;
  const handle = ledger.begin({ producer: { mechanism: 'agentic', method: 'test/other@1', agent: null } });
  ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'w', qualification: caveat, declarations: [{ key: 'w', operation: 'withdraw', displaces: [identification], grounds: { text: 'g' } }] }] } }]);
  assert.deepEqual(causes(ledger, produced).map(cause => cause.routes.map(route => route.kind)), [['exact', 'scope']]);
  assert.equal(store.lookup(citedClaim!)?.kind, 'claim');
});

test('a change accepted during a dialog is delivered as an exact notice before submission', async () => {
  const { ledger, entity, invoke, run, account } = await setup();
  const barrel = entity('barrel'), earlier = invoke(barrel, 'earlier');
  const first = await run([() => ({ kind: 'submit', contribution: { investigrams: [account('e', barrel, earlier.result.id)] } })], earlier.invocation);
  const use: AssociationAddress = { investigram: first.execution.outcome.kind === 'accepted' ? first.execution.outcome.acceptance.productions[0]!.investigrams.e! : assert.fail(), declaration: 'use' };
  const supersede = (key: string) => {
    const handle = ledger.begin({ producer: { mechanism: 'agentic', method: 'test/other@1', agent: null } });
    const accepted = ledger.accept([{ production: handle, contribution: { investigrams: [{ key, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Fuller.' } }],
      declarations: [{ key: 'use', operation: 'supersede', target: { kind: 'entity', entity: barrel, role: 'topic', topic: 'function' }, displaces: [use], grounds: { text: 'Fuller account.' },
        members: [{ kind: 'item', item: { investigram: { local: key }, item: 'p' } }] }] }] } }]);
    return { investigram: accepted.productions[0]!.investigrams[key]!, declaration: 'use' };
  };
  const later = invoke(barrel, 'later');
  let change: AssociationAddress | undefined;
  const { execution, agent } = await run([
    () => ({ kind: 'tools', requests: [{ kind: 'association', association: use, content: true }] }),
    // Another producer supersedes the received use while this dialog is in progress.
    input => { assert.deepEqual(input.notices, []); change = supersede('s'); return { kind: 'tools', requests: [] }; },
    input => {
      assert.deepEqual(input.notices, [{ change, operation: 'supersede', displaces: [use], establishes: change }]);
      assert.deepEqual(input.responses, []);
      return { kind: 'submit', contribution: { investigrams: [{ ...account('l', barrel, later.result.id), declarations: [] }] } };
    },
  ], later.invocation);
  assert.equal(execution.outcome.kind, 'accepted');
  const produced = execution.outcome.kind === 'accepted' ? execution.outcome.acceptance.productions[0]!.investigrams.l! : assert.fail();
  // The notice is recorded as a notice. No replacement content was delivered, and the noticed change is not a cause.
  assert.deepEqual(kinds(execution.production.deliveries), ['scope', 'association', 'item', 'association', 'item', 'notice']);
  assert.equal(execution.production.deliveries.some(delivery => delivery.kind === 'item' && delivery.item.investigram === change!.investigram), false);
  assert.deepEqual(causes(ledger, produced), []);
  assert.equal(agent.inputs.length, 3);
  // A change accepted after submission was never disclosed to it.
  const afterwards = supersede('t');
  assert.deepEqual(causes(ledger, produced).map(cause => cause.change), [afterwards]);
});

test('dialog outcomes separate repair, exhausted repair, limits, ended dialogs and communication failure', async () => {
  const { ledger, entity, invoke, run, account } = await setup();
  const barrel = entity('barrel');
  const contract: ResultContract = { id: 'test/prose-answer@1', requirements: [{ kind: 'designated-answer', description: 'An answer.' }, { kind: 'content', description: 'Prose.', type: 'prose' }] };
  const withContract = { operation: { ...operation, contract } };
  const request = () => invoke(barrel, contract.id, true);
  const unqualified = (result: string) => ({ investigrams: [{ ...account('x', barrel, result), qualification: undefined }] });
  // Bounded repair: the problem comes back once, and the corrected submission is accepted.
  const repairing = request();
  const repaired = await run([() => ({ kind: 'submit', contribution: unqualified(repairing.result.id) }),
    input => {
      assert.deepEqual([input.responses, input.remaining.repairs], [[{ tool: 'invalid-submission', problem: 'A content item requires attributable qualification.' }], 0]);
      return { kind: 'submit', contribution: { investigrams: [account('x', barrel, repairing.result.id)] } };
    }], repairing.invocation, withContract);
  assert.deepEqual(repaired.execution.outcome.kind === 'accepted' && [repaired.execution.outcome.repairs, repaired.execution.outcome.fulfillment?.status], [1, 'fulfilled']);
  const retained = ledger.investigrams().length;
  // Repair exhausted: nothing is accepted and the attempt is concluded without a contribution.
  const failing = request();
  const exhausted = await run([() => ({ kind: 'submit', contribution: unqualified(failing.result.id) }), () => ({ kind: 'submit', contribution: unqualified(failing.result.id) })], failing.invocation, withContract);
  assert.deepEqual([exhausted.execution.outcome.kind, exhausted.execution.production.outcome, exhausted.execution.production.investigrams, ledger.investigrams().length],
    ['invalid-submission', { kind: 'no-contribution', reason: 'invalid-submission', failure: exhausted.execution.outcome }, [], retained]);
  // A limit stops the dialog. What was acquired but never dispatched to the agent is not recorded as delivered.
  const limited = await run([() => ({ kind: 'tools', requests: [{ kind: 'contribution', investigram: ledger.investigrams().at(-1)!.id }, { kind: 'read-file', path: '/etc/passwd' }] })],
    request().invocation, { bounds: { milliseconds: 60_000, calls: 1, toolCalls: 10, characters: 1_000_000 } });
  assert.deepEqual([limited.execution.outcome, kinds(limited.execution.production.deliveries.slice(-2)), limited.agent.closes],
    [{ kind: 'limit-stop', reason: 'Provider call guard reached.' }, ['scope', 'association'], 1]);
  // Those last deliveries are the initial designations of the repeated question, which were dispatched.
  assert.equal(limited.execution.production.deliveries.some(delivery => delivery.kind === 'item' && delivery.item.investigram === ledger.investigrams().at(-1)!.id), false);
  // Unsupported requests and unknown references return qualified unavailability and record nothing.
  const refusing = request();
  const refused = await run([() => ({ kind: 'tools', requests: [{ kind: 'read-file', path: '/etc/passwd' }, { kind: 'item', item: { investigram: 'session:x:investigram:0', item: 'p' } },
    { kind: 'inventory', scope: { kind: 'entity', entity: barrel, role: 'topic' }, inventory: 'current-only' }] }),
  input => {
    assert.deepEqual(input.responses.map(response => response.tool), ['unavailable', 'unavailable', 'unavailable']);
    return { kind: 'ended' };
  }], refusing.invocation);
  assert.deepEqual([refused.execution.outcome.kind, refused.execution.production.outcome], ['investigation-failure', { kind: 'no-contribution', reason: 'ended', failure: refused.execution.outcome }]);
  assert.equal(refused.execution.production.deliveries.every(delivery => delivery.position <= ledger.position), true);
  // The fresh request was supplied the answers currently designated for the repeated question.
  assert.equal((refused.agent.inputs[0]!.responses[1] as { kind: string }).kind, 'designations');
  // A communication failure is its own outcome; the attempt is concluded and nothing can be submitted late.
  const failure = { kind: 'communication-failure' as const, code: 'timeout', diagnostic: 'No response.' };
  const failed = await run([() => failure], request().invocation);
  assert.deepEqual([failed.execution.outcome, failed.execution.production.outcome], [failure, { kind: 'no-contribution', reason: 'communication-failure', failure }]);
  // Useful partial content with a reported inability: accepted, in effect, and reported as not fulfilling the request.
  const partial = await run([() => ({ kind: 'submit', contribution: { report: { inability: 'No answer could be established.' },
    investigrams: [{ key: 'notes', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Notes.' } }] }] } })], request().invocation, withContract);
  assert.deepEqual(partial.execution.outcome.kind === 'accepted' && [partial.execution.outcome.fulfillment?.status, partial.execution.outcome.reportedInability], ['no-answer-supplied', 'No answer could be established.']);
  // A producer defect propagates and its production accepts nothing afterwards.
  await assert.rejects(run([() => { throw new TypeError('agent defect'); }], request().invocation), TypeError);
  assert.match(dialogInstructions(operation), /MAINTAIN IDENTITY DELIBERATELY/);
});

test('an evidence page is still delivered when the retained finding it obtained does not fit beside it', async () => {
  const { ledger, record, entity, invoke, run, account } = await setup();
  const barrel = entity('barrel'), main = invoke(barrel);
  const { responseCharacters } = await import('../src/lib/contributions/dialog.js');
  // Stand in for a module with a very large export surface by making the retained finding's qualification enormous.
  const bulky = ledger.begin({ producer: { mechanism: 'mechanical', method: 'test/bulky-exports@1', agent: null } });
  const big = 'x'.repeat(responseCharacters);
  ledger.accept([{ production: bulky, contribution: { investigrams: [{ key: 'b', qualification: { status: 'mechanically-derived', limitations: [big] },
    items: [{ key: 'p', type: 'prose', body: { text: 'A very large export listing.' } }],
    declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity: barrel, role: 'topic', topic: 'exports' }, members: [{ kind: 'item', item: { investigram: { local: 'b' }, item: 'p' } }] }] }] } }]);
  const bulkyUse = { investigram: ledger.investigrams().at(-1)!.id, declaration: 'use' };
  const { execution } = await run([
    () => ({ kind: 'tools', requests: [{ kind: 'exports', subject: record('barrel') }] }),
    input => {
      const page = input.responses[0] as Extract<DialogResponse, { tool: 'evidence' }>;
      // The evidence page arrives; the retained uses are named, not delivered, and the omission is stated.
      assert.equal(page.tool, 'evidence');
      assert.equal(page.response.records.some(item => item.kind === 'claim' && item.information.type === 'export'), true);
      assert.deepEqual(page.retained, []);
      assert.equal(page.retainedOmitted.some(address => address.investigram === bulkyUse.investigram), true);
      assert.match(page.response.limitations.at(-1)!, /did not fit in this response and was not delivered/);
      return { kind: 'submit', contribution: { investigrams: [account('a', barrel, main.result.id)] } };
    },
  ], main.invocation);
  // Only the baseline was recorded as delivered; no retained use was.
  assert.deepEqual(kinds(execution.production.deliveries), ['scope', 'association', 'item']);
});

test('the instructions state the exact submission shapes that live agents got wrong, and those shapes are rejected', async () => {
  const { ledger, entity, invoke, account } = await setup();
  const text = dialogInstructions(operation), barrel = entity('barrel'), { result } = invoke(barrel, 'shapes');
  // Observed in the first live trials: grounds with a statement field, an option with its request at top level,
  // and unsupported semantics as one string. Each shape is stated exactly.
  assert.match(text, /grounds: \{ text: string, evidence\?: \[program record handle\], support\?: \[content address\] \}/);
  assert.match(text, /option: \{ key, meaning: string, request: \{ operation, subjects: \[\{ subject \}\]/);
  assert.match(text, /The operation and subjects go inside request/);
  assert.match(text, /context\?: \[subject\]/);
  assert.match(text, /Context does not change what is being investigated/);
  assert.match(text, /not required on every option/);
  assert.match(text, /without the \{ subject \} wrapper/);
  // Observed in the second live trials: prose bodies given as bare strings, and a report placed inside an investigram.
  assert.match(text, /for type "prose" it is \{ text: string \}/);
  assert.match(text, /The report belongs to the whole contribution, never inside an investigram/);
  const { stateBehaviorGuidance } = await import('../src/lib/contributions/state-model.js');
  assert.match(stateBehaviorGuidance, /unsupported is a list of strings/);
  // Retained regression cases: each observed shape is rejected with a message naming the problem, and the stated shape is accepted.
  const base = account('r', barrel, result.id);
  const cases: [RegExp, unknown][] = [
    [/Unexpected grounds field: statement/, { ...base, declarations: [{ ...base.declarations![0]!, grounds: { statement: 'Because.' } }] }],
    [/Unexpected follow-up option field: operation/, { ...base, options: [{ key: 'o', meaning: 'm', operation: 'state-behavior', subjects: [{ subject: { kind: 'entity', entity: barrel } }] }] }],
    [/Unknown Entity reference/, { ...base, options: [{ key: 'o', meaning: 'm', request: { operation: 'examine-content', subjects: [], context: [{ kind: 'entity', entity: 'invalid-investigator-reference:invented-handle' }] } }] }],
    [/Unexpected.*subject/, { ...base, options: [{ key: 'o', meaning: 'm', request: { operation: 'examine-content', subjects: [], context: [{ subject: { kind: 'entity', entity: barrel } }] } }] }],

  ];
  for (const [message, investigram] of cases) {
    const handle = ledger.begin({ producer: { mechanism: 'agentic', method: 'test@1', agent: null } });
    const position = ledger.position;
    assert.throws(() => ledger.accept([{ production: handle, contribution: { investigrams: [investigram] } }]), message);
    assert.equal(ledger.position, position);
  }
  const handle = ledger.begin({ producer: { mechanism: 'agentic', method: 'test@1', agent: null } });
  assert.doesNotThrow(() => ledger.accept([{ production: handle, contribution: { investigrams: [{ ...base,
    options: [{ key: 'o', meaning: 'Investigate further.', request: { operation: 'state-behavior', subjects: [{ subject: { kind: 'entity', entity: barrel } }] } }] }] } }]));
});

test('malformed acquisitions are refused without delivery while genuine defects propagate', async () => {
  const { entity, invoke, run } = await setup();
  const malformed = [
    { kind: 'item' }, { kind: 'association', association: null }, { kind: 'metadata' },
    { kind: 'member', association: {}, item: [] }, { kind: 'declaration', declaration: 'wrong' },
    { kind: 'item', item: { investigram: 'wrong', item: 12 } }, { kind: 'metadata', address: { investigram: 'wrong', key: 'x', metadata: 'bad' } },
    { kind: 'inventory', scope: null }, { kind: 'contribution', investigram: {} }, { kind: 'source' },
  ];
  const { execution } = await run([() => ({ kind: 'tools', requests: malformed }), input => {
    assert.equal(input.responses.length, malformed.length);
    assert.ok(input.responses.every(response => response.tool === 'unavailable'));
    return { kind: 'ended' };
  }], invoke(entity('barrel')).invocation);
  assert.deepEqual(kinds(execution.production.deliveries), ['scope', 'association', 'item']);
});

test('timeout preserves dispatched context but discards acquisitions awaiting dispatch', async () => {
  const { entity, invoke, run } = await setup();
  const bounds = { milliseconds: 100, calls: 10, toolCalls: 10, characters: 1_000_000 };
  const pending = new Promise<never>(() => {});
  const dispatched = await run([input => { assert.ok(input.responses.length); return pending; }], invoke(entity('barrel')).invocation, { bounds });
  assert.equal(dispatched.execution.outcome.kind, 'limit-stop');
  assert.deepEqual(kinds(dispatched.execution.production.deliveries), ['scope', 'association', 'item']);
  const beforeDispatch = await run([() => ({ kind: 'tools', requests: [{ kind: 'baseline', entity: entity('origin') }, { kind: 'modules' }] })],
    invoke(entity('barrel')).invocation, { bounds, evidence: { lookup: () => undefined, query: () => pending } });
  assert.equal(beforeDispatch.execution.outcome.kind, 'limit-stop');
  assert.deepEqual(beforeDispatch.execution.production.deliveries, dispatched.execution.production.deliveries);
});

test('selected content and whole-owner acquisition retain the originating question without retargeting history', async () => {
  const { ledger, entity, run, account } = await setup();
  const barrel = entity('barrel');
  const original = ledger.invoke({ operation: 'ORIGINAL_QUESTION_MARKER', subjects: [{ role: 'bearer', subject: { kind: 'entity', entity: barrel } }],
    parameters: { scenario: 'ORIGINAL_SCOPE_MARKER' }, context: [], resultContract: 'original-contract' });
  const produced = await run([() => ({ kind: 'submit', contribution: { investigrams: [account('first', barrel, original.result.id)] } })], original.invocation);
  const owner = produced.execution.production.investigrams[0]!;
  const selected = ledger.invoke({ operation: 'examine-content', subjects: [{ role: null, subject: { kind: 'content', item: { investigram: owner, item: 'p' }, component: null } }],
    parameters: {}, context: [], resultContract: null });
  const result = await run([input => {
    const value = (input.responses[0] as { value: { owner: import('../src/lib/contributions/production.js').DeliveredOwner } }).value;
    assert.equal(value.owner.origin?.request.operation, 'ORIGINAL_QUESTION_MARKER');
    assert.equal(value.owner.origin?.request.parameters.scenario, 'ORIGINAL_SCOPE_MARKER');
    assert.equal(value.owner.origin?.result, original.result.id);
    return { kind: 'tools', requests: [{ kind: 'contribution', investigram: owner }] };
  }, input => {
    const value = (input.responses[0] as { value: { owner: import('../src/lib/contributions/production.js').DeliveredOwner } }).value;
    assert.equal(value.owner.origin?.request.resultContract, 'original-contract');
    assert.deepEqual(value.owner.origin?.request.subjects, original.invocation.request.subjects);
    return { kind: 'ended' };
  }], selected.invocation);
  assert.equal(result.execution.production.deliveries[0]?.kind, 'item');
});

test('retained failures preserve their domain kind and details when evaluation is recreated', async () => {
  const { store, ledger, record, entity, invoke, run } = await setup();
  const cases = [
    { kind: 'limit-stop', script: [() => ({ kind: 'tools' as const, requests: [] })], extra: { bounds: { milliseconds: 60_000, calls: 1, toolCalls: 10, characters: 1_000_000 } } },
    { kind: 'invalid-submission', script: [() => ({ kind: 'submit' as const, contribution: null })], extra: { repairs: 0 } },
    { kind: 'investigation-failure', script: [() => ({ kind: 'ended' as const })], extra: {} },
  ];
  for (const scenario of cases) {
    const { invocation } = invoke(entity('barrel'), scenario.kind);
    const { execution } = await run(scenario.script, invocation, { ...scenario.extra, operation: { ...operation, method: contributionOperationMethod({ ...operation, subject: 'module' }) } });
    assert.equal(execution.outcome.kind, scenario.kind);
    const rebuilt = contributionEvaluation(store, ledger,
      { lookup: id => store.lookup(id), query: async () => { throw new Error('Reuse must acquire nothing'); } },
      new InvestigationUsage(), {}, async () => {}, new AbortController().signal);
    const reused = await rebuilt.evaluate(invocation.request, { ...operation, subject: 'module' }, null, { subject: record('barrel') });
    assert.equal(reused.reused, true);
    assert.equal(reused.attempt?.id, execution.production.id);
    assert.deepEqual(reused.attemptResult?.outcome, execution.outcome);
  }
});

test('every production operation advertises supported follow-up signatures and result contracts without trial elicitation', async () => {
  const { contributionOperations } = await import('../src/lib/contributions/operations.js');
  for (const operation of Object.values(contributionOperations)) {
    const instructions = dialogInstructions(operation);
    assert.match(instructions, /state-behavior: one discovered module Entity/);
    assert.match(instructions, /examine-content: one exact content item/);
    assert.match(instructions, /kind: "designation"/);
    assert.match(instructions, /kind: "investigram"/);
    assert.match(instructions, /postcode\/state-diagram-answer@1/);
    assert.match(instructions, /omit resultContract when no specialized form is promised/);
  }
});

test('production component guidance matches schema and contract validation; the observed body-field selector gets normal repair', async () => {
  const { contributionOperations } = await import('../src/lib/contributions/operations.js');
  const { componentSelectorGuidance } = await import('../src/lib/contributions/catalog.js');
  const { stateDiagramContract } = await import('../src/lib/contributions/state-model.js');
  const { contributionFunctions } = await import('../src/lib/investigation/openai/contribution-protocol.js');
  for (const operation of Object.values(contributionOperations)) {
    const instructions = dialogInstructions(operation);
    assert.ok(instructions.includes(componentSelectorGuidance));
    assert.match(instructions, /locally addressable part of a content item, not a separate Entity/);
    assert.match(instructions, /declared by the content-type contract and listed in the retained item’s components array/);
    assert.match(instructions, /arbitrary content-body field name is not automatically a valid selector/);
    assert.match(instructions, /omit component and target the whole item/);
    assert.match(instructions, /state:<key> for each state key and transition:<key> for each transition key/);
  }
  // The wire schema permits an optional string. Membership in a particular item's
  // contract-defined component list is checked by domain validation, not a global enum.
  const schema = contributionFunctions.find(tool => tool.name === 'submit_contribution')!.parameters as Record<string, any>;
  const subjects = schema.properties.investigrams.items.properties.options.items.properties.request.properties.subjects;
  const content = subjects.items.properties.subject.anyOf.find((shape: any) => shape.properties.kind.const === 'content');
  assert.deepEqual(content.required, ['kind', 'item']);
  assert.deepEqual(content.properties.component, { type: 'string', description: componentSelectorGuidance });

  for (const badComponent of ['unsupported', 'HalfOpen concurrency and deferred-decision semantics']) {
    const { ledger, entity, run } = await setup(), barrel = entity('barrel');
    const request = ledger.invoke({ operation: 'state-behavior', subjects: [{ role: null, subject: { kind: 'entity', entity: barrel } }],
      parameters: {}, context: [], resultContract: stateDiagramContract.id });
    const account = (selectors: readonly (string | undefined)[]): SubmittedInvestigram => ({ key: 'states', qualification: caveat,
      items: [{ key: 'model', type: 'state-model', body: { bearer: { entity: barrel }, states: [{ key: 'closed', label: 'Closed' }, { key: 'open', label: 'Open' }],
        initial: { kind: 'unknown' }, transitions: [{ key: 'trip', from: 'closed', to: 'open' }], coverage: { states: 'some', transitions: 'some' },
        unsupported: ['Concurrent callers are not modeled.'] } }],
      declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: request.result.id },
        members: [{ kind: 'item', item: { investigram: { local: 'states' }, item: 'model' } }] }],
      options: selectors.map((component, index) => ({ key: `option-${index}`, meaning: 'Investigate the limitations of this account.', request: { operation: 'examine-content',
        subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'states' }, item: 'model' }, ...(component === undefined ? {} : { component }) } }] } })),
    });
    const position = ledger.position;
    const { execution, agent } = await run([
      // Preserve both actual live mistakes: a body-field name in the capped retry
      // and a free-text description in the completed run. Neither is a selector.
      () => ({ kind: 'submit', contribution: { investigrams: [account([badComponent])] } }),
      input => {
        assert.deepEqual(input.responses, [{ tool: 'invalid-submission', problem: 'Unknown content component reference.' }]);
        assert.equal(input.remaining.repairs, 0);
        assert.equal(ledger.position, position, 'the invalid option does not partially accept its account');
        return { kind: 'submit', contribution: { investigrams: [account([undefined, 'state:open', 'transition:trip'])] } };
      },
    ], request.invocation, { operation: { ...contributionOperations['state-behavior']!, contract: stateDiagramContract } });
    assert.equal(execution.outcome.kind, 'accepted');
    if (execution.outcome.kind !== 'accepted') return;
    assert.equal(execution.outcome.repairs, 1);
    assert.equal(execution.outcome.fulfillment?.status, 'fulfilled');
    assert.equal(agent.inputs.length, 2);
    const owner = execution.outcome.acceptance.productions[0]!.investigrams.states!;
    assert.deepEqual(ledger.item({ investigram: owner, item: 'model' }).components, ['state:closed', 'state:open', 'transition:trip']);
    const options = ledger.investigram(owner).options;
    assert.deepEqual(options.map(option => option.request.subjects[0]!.subject.kind === 'content' ? option.request.subjects[0]!.subject.component : assert.fail()),
      [null, 'state:open', 'transition:trip']);
    for (const option of options) assert.doesNotThrow(() => ledger.invoke(option.request));
    const whole = options[0]!.request;
    assert.throws(() => ledger.invoke({ ...whole, subjects: [{ role: null, subject: { kind: 'content', item: { investigram: owner, item: 'model' }, component: badComponent } }] }), /Unknown content component/);
  }
});

test('report.answer instructions and hosted schema describe the accepted designation reference forms', async () => {
  const { reportAnswerGuidance } = await import('../src/lib/contributions/outcomes.js');
  const { contributionOperations } = await import('../src/lib/contributions/operations.js');
  const { contributionFunctions } = await import('../src/lib/investigation/openai/contribution-protocol.js');
  for (const operation of Object.values(contributionOperations)) {
    const instructions = dialogInstructions(operation);
    assert.ok(instructions.includes(reportAnswerGuidance));
    assert.match(instructions, /own answer designations already count/);
    assert.match(instructions, /earlier answer remains adequate and no new designation is needed/);
    assert.match(instructions, /not an invocation handle, Query result handle or arbitrary dialogue handle/);
    assert.match(instructions, /Repeating an own designation here is allowed but unnecessary/);
    assert.match(instructions, /does not change its standing or clear its reconsideration causes/);
  }
  const schema = contributionFunctions.find(tool => tool.name === 'submit_contribution')!.parameters as Record<string, any>;
  const report = schema.properties.report, answer = report.properties.answer;
  assert.equal(report.required?.includes('answer') ?? false, false);
  assert.equal(answer.description, reportAnswerGuidance);
  assert.deepEqual(answer.items.required, ['investigram', 'declaration']);
  assert.equal(answer.items.additionalProperties, false);
  assert.deepEqual(answer.items.properties.investigram.anyOf, [{ type: 'string' },
    { type: 'object', additionalProperties: false, required: ['local'], properties: { local: { type: 'string' } } }]);
  assert.match(answer.items.properties.investigram.description, /retained investigram handle owning the answer designation/);
  assert.match(answer.items.properties.investigram.description, /local: <investigram key in this submission>/);
  assert.match(answer.items.properties.declaration.description, /add or supersede answer-designation/);
});

test('the observed invocation-as-investigram report reference is rejected atomically and normally repaired', async () => {
  const { attemptAnswers } = await import('../src/lib/contributions/outcomes.js');
  // Both preferred omission and harmless local repetition preserve the own answer.
  for (const repeatOwn of [false, true]) {
    const { ledger, entity, invoke, run, account } = await setup(), barrel = entity('barrel');
    const request = invoke(barrel), position = ledger.position;
    const investigrams = [account('account', barrel, request.result.id)];
    const { execution, agent } = await run([
      input => ({ kind: 'submit', contribution: { investigrams,
        report: { answer: [{ investigram: input.request.invocation, declaration: 'answer' }] } } }),
      input => {
        assert.deepEqual(input.responses, [{ tool: 'invalid-submission', problem: 'Unknown investigram reference.' }]);
        assert.equal(ledger.position, position);
        assert.equal(input.remaining.repairs, 0);
        return { kind: 'submit', contribution: { investigrams,
          ...(repeatOwn ? { report: { answer: [{ investigram: { local: 'account' }, declaration: 'answer' }] } } : {}) } };
      },
    ], request.invocation);
    assert.equal(execution.outcome.kind, 'accepted');
    if (execution.outcome.kind !== 'accepted') return;
    assert.equal(execution.outcome.repairs, 1);
    const owner = execution.outcome.acceptance.productions[0]!.investigrams.account!;
    const designation = { investigram: owner, declaration: 'answer' };
    assert.deepEqual(attemptAnswers(ledger, execution.production, request.result.id), [designation]);
    assert.deepEqual(execution.production.report?.answer ?? [], repeatOwn ? [designation] : []);
    assert.equal(agent.inputs.length, 2);
  }
});

test('report-only returns need no placeholder investigram; the observed empty review is rejected and repaired normally', async () => {
  const { contributionSubmissionGuidance, attemptAnswers } = await import('../src/lib/contributions/outcomes.js');
  const { contributionOperations } = await import('../src/lib/contributions/operations.js');
  const { contributionFunctions } = await import('../src/lib/investigation/openai/contribution-protocol.js');
  for (const operation of Object.values(contributionOperations)) {
    assert.ok(dialogInstructions(operation).includes(contributionSubmissionGuidance));
  }
  assert.match(contributionSubmissionGuidance, /investigrams may be empty when a producer report is supplied/);
  assert.match(contributionSubmissionGuidance, /Every investigram must contribute at least one content item, organizing declaration or qualified metadata entry/);
  assert.match(contributionSubmissionGuidance, /qualification alone is not a contribution/);
  const schema = contributionFunctions.find(tool => tool.name === 'submit_contribution')!.parameters as Record<string, any>;
  assert.equal(schema.properties.investigrams.description, contributionSubmissionGuidance);
  assert.equal(schema.properties.investigrams.minItems ?? 0, 0);

  const contract: ResultContract = { id: 'test/report-only@1', requirements: [{ kind: 'content', type: 'prose', description: 'An account.' }] };
  for (const mode of ['direct', 'repair-to-report', 'repair-to-note']) {
    const { ledger, entity, invoke, run, account } = await setup(), barrel = entity('barrel');
    const request = invoke(barrel, contract.id);
    const first = await run([() => ({ kind: 'submit', contribution: { investigrams: [account('first', barrel, request.result.id)] } })],
      request.invocation, { operation: { ...operation, contract } });
    assert.equal(first.execution.outcome.kind, 'accepted');
    const designation = { investigram: first.execution.production.investigrams[0]!, declaration: 'answer' };
    const fresh = invoke(barrel, contract.id, true), position = ledger.position, count = ledger.investigrams().length;
    const report = { answer: [designation], statement: 'The earlier answer remains adequate.' };
    const finish = (): DialogReply => ({ kind: 'submit', contribution: { report, investigrams: mode === 'repair-to-note'
      ? [{ key: 'review', qualification: caveat, items: [{ key: 'assessment', type: 'prose', body: { text: 'The earlier account remains adequate within its limitations.' } }] }] : [] } });
    const script: Step[] = mode === 'direct' ? [finish] : [
      // The actual live mistake: a qualification-only placeholder beside a correct returned answer.
      () => ({ kind: 'submit', contribution: { report, investigrams: [{ key: 'review', qualification: caveat }] } }),
      input => {
        assert.deepEqual(input.responses, [{ tool: 'invalid-submission', problem: 'An investigram must contribute content, declarations or qualified metadata.' }]);
        assert.equal(ledger.position, position);
        assert.equal(ledger.investigrams().length, count);
        assert.equal(input.remaining.repairs, 0);
        return finish();
      },
    ];
    const { execution, agent } = await run(script, fresh.invocation, { operation: { ...operation, contract } });
    assert.equal(execution.outcome.kind, 'accepted');
    if (execution.outcome.kind !== 'accepted') return;
    assert.equal(execution.outcome.repairs, mode === 'direct' ? 0 : 1);
    assert.equal(agent.inputs.length, mode === 'direct' ? 1 : 2);
    assert.equal(execution.outcome.fulfillment?.status, 'fulfilled');
    assert.deepEqual(execution.production.report?.answer, [designation]);
    assert.deepEqual(attemptAnswers(ledger, execution.production, request.result.id), [designation]);
    assert.deepEqual(ledger.designations(request.result.id).map(entry => entry.address), [designation]);
    assert.equal(execution.production.investigrams.length, mode === 'repair-to-note' ? 1 : 0);
    assert.equal(ledger.investigrams().length, count + (mode === 'repair-to-note' ? 1 : 0));
  }
});

test('common operation reuse fingerprints the complete definition and fixed follow-up catalog', async () => {
  const { store, ledger, record, entity, invoke } = await setup();
  const request = invoke(entity('barrel')).invocation.request;
  const original = { ...operation, subject: 'module' as const };
  const agent = new ScriptedDialogAgent([() => ({ kind: 'submit', contribution: { investigrams: [], report: { inability: 'Controlled empty answer.' } } })]);
  const evaluate = (definition: typeof original, catalog = { functionality: definition }) => contributionEvaluation(store, ledger,
    { lookup: id => store.lookup(id), query: async () => { throw Error('No evidence query expected'); } }, new InvestigationUsage(),
    { agent, operations: catalog }, async () => {}, new AbortController().signal).evaluate(request, definition, null, { subject: record('barrel') });
  const first = await evaluate(original);
  assert.equal((await evaluate(original)).attempt!.id, first.execution!.production.id);
  const changed = { ...original, objective: 'A materially different requested explanation.' };
  const second = await evaluate(changed);
  assert.equal(second.reused, false);
  assert.notEqual(second.execution!.production.producer.method, first.execution!.production.producer.method);
  const third = await evaluate(changed, { functionality: { ...changed, guidance: 'A different advertised follow-up.' } });
  assert.equal(third.reused, false);
  assert.equal(agent.closes, 3);
  assert.equal(ledger.productions().filter(value => value.producer.mechanism === 'agentic').length, 3);
});

const unusualUsage: readonly [string, ReportedUsage][] = [
  ['subset exceeds', { source: 'provider', categories: [
    { category: 'output', unit: 'tokens', value: 2, includedIn: null },
    { category: 'reasoning', unit: 'tokens', value: 4, includedIn: 'output' }] }],
  ['parent category', { source: 'provider', categories: [{ category: 'reasoning', unit: 'tokens', value: 4, includedIn: 'output' }] }],
  ['Duplicate', { source: 'provider', categories: [
    { category: 'output', unit: 'tokens', value: 2, includedIn: null },
    { category: 'output', unit: 'tokens', value: 3, includedIn: null }] }],
  ['Cyclic', { source: 'provider', categories: [
    { category: 'output', unit: 'tokens', value: 2, includedIn: 'reasoning' },
    { category: 'reasoning', unit: 'tokens', value: 2, includedIn: 'output' }] }],
];
test('provider accounting anomalies preserve both accepted and failed common outcomes', async () => {
  const { store, ledger, record, entity } = await setup();
  const evidence = { lookup: (id: RecordId) => store.lookup(id), query: () => { throw Error('No evidence request expected'); } };
  for (const [diagnostic, report] of unusualUsage) for (const submit of [true, false]) {
    const invocation = ledger.invoke({ operation: operation.id, subjects: [{ role: null, subject: { kind: 'entity', entity: entity('barrel') } }], parameters: {}, context: [], resultContract: null }, { fresh: true });
    const agent = new ScriptedContributionAgent([(input, _signal, usage) => { usage(report); return submit ? { kind: 'submit', contribution: proseContribution(input) } : { kind: 'refused' }; }]);
    const execution = await conductDialog({ store, ledger, evidence, operation, invocation: invocation.invocation.id, agent, check: async () => {} });
    assert.equal(execution.outcome.kind, submit ? 'accepted' : 'investigation-failure');
    const call = execution.usage[0]!;
    assert.equal(call.reported, null); assert.deepEqual(call.reports[0]!.reported, report);
    assert.ok(call.anomalies.some(item => item.includes(diagnostic)));
  }
  assert.ok(record('barrel'));
});


test('common dialog guards tool count and canonical decoded reply size independently of wire compaction', async () => {
  const { store, ledger, entity, invoke, run } = await setup();
  const requested = invoke(entity('barrel'));
  const limited = await run([() => ({ kind: 'tools', requests: [{ kind: 'source', subject: 'not-acquired' }, { kind: 'source', subject: 'also-not-acquired' }] })], requested.invocation,
    { bounds: { milliseconds: 60_000, calls: 4, toolCalls: 1, characters: 1_000_000 } });
  assert.equal(limited.execution.outcome.kind, 'limit-stop');
  assert.equal(limited.execution.production.evidence.length, 0);
  let wireCharacters = 0;
  const agent = openAIDialogAgent('test-credential', { fetch: async (_url, options) => {
    const sent = JSON.parse(String(options?.body));
    const message = JSON.parse(sent.input.at(-1).content);
    const handle = message.request.subjects[0].subject.entity;
    const contribution = { investigrams: [{ key: 'large', qualification: caveat, referents: Array.from({ length: 5000 }, () => handle) }] };
    const args = JSON.stringify(contribution); wireCharacters = args.length;
    return new Response(JSON.stringify({ id: 'response', model: 'gpt-6-sol', status: 'completed', output: [{ type: 'function_call', name: 'submit_contribution', call_id: 'call', arguments: args }] }), { headers: { 'content-type': 'application/json' } });
  } });
  const fresh = invoke(entity('barrel'), null, true);
  const before = ledger.investigrams().length;
  const result = await conductDialog({ store, ledger, operation, invocation: fresh.invocation.id, agent, check: async () => {},
    evidence: { lookup: id => store.lookup(id), query: () => { throw Error('Unexpected evidence acquisition'); } },
    bounds: { milliseconds: 60_000, calls: 4, toolCalls: 4, characters: 300_000 } });
  assert.ok(wireCharacters < 300_000);
  assert.equal(result.outcome.kind, 'limit-stop');
  if (result.outcome.kind === 'limit-stop') assert.match(result.outcome.reason, /character/i);
  assert.equal(ledger.investigrams().length, before);
});


test('retained option context is supplied separately from subjects with qualified actual exposure', async () => {
  const { ledger, entity, run } = await setup();
  const original = ledger.invoke({ operation: operation.id, subjects: [{ role: null, subject: { kind: 'entity', entity: entity('origin') } }], parameters: {}, context: [], resultContract: null });
  const production = ledger.begin({ producer: { mechanism: 'agentic', method: 'test/option-context@1', agent: null } });
  const accepted = ledger.accept([{ production, contribution: { investigrams: [{ key: 'owner', qualification: caveat,
    items: [{ key: 'model', type: 'state-model', body: { bearer: { role: 'one connection' }, states: [{ key: 'idle', label: 'Idle' }],
      initial: { kind: 'unknown' }, transitions: [], coverage: { states: 'some', transitions: 'unknown' } } }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: original.result.id }, members: [{ kind: 'item', item: { investigram: { local: 'owner' }, item: 'model' } }] }],
    options: [{ key: 'next', meaning: 'Use these explicit inputs.', request: { operation: operation.id,
      subjects: [{ subject: { kind: 'entity', entity: entity('barrel') } }], context: [
        { kind: 'entity', entity: entity('origin') }, { kind: 'content', item: { investigram: { local: 'owner' }, item: 'model' }, component: 'state:idle' },
        { kind: 'designation', association: { investigram: { local: 'owner' }, declaration: 'answer' } },
        { kind: 'investigram', investigram: { local: 'owner' } }, { kind: 'scope', scope: 'configured-project' }] } }] }] } }]);
  const owner = accepted.productions[0]!.investigrams.owner!, option = ledger.investigram(owner).options[0]!;
  const selected = ledger.invoke({ ...option.request, option: { investigram: owner, key: option.key } });
  const without = ledger.invoke({ ...option.request, context: [], option: { investigram: owner, key: option.key } });
  assert.notEqual(selected.result.id, without.result.id);
  const priorDeliveries = ledger.productions().map(value => value.deliveries);
  const { execution } = await run([input => {
    assert.deepEqual(input.request.context, option.request.context);
    assert.deepEqual(input.request.subjects.map(value => (value as { subject: unknown }).subject), option.request.subjects.map(value => value.subject));
    assert.deepEqual(input.responses.map(value => value.tool === 'contribution' ? value.kind : value.tool),
      ['baseline', 'baseline', 'item', 'association', 'contribution', 'unavailable', 'metadata']);
    const item = input.responses[2] as { value: { item: { key: string }; coverage: string; owner: { qualification: { limitations: readonly string[] } } } };
    assert.equal(item.value.item.key, 'model'); assert.equal(item.value.coverage, 'complete');
    assert.deepEqual(item.value.owner.qualification.limitations, caveat.limitations);
    return { kind: 'ended' };
  }], selected.invocation);
  assert.ok(execution.production.deliveries.some(value => value.kind === 'item' && value.item.investigram === owner && value.item.item === 'model'));
  assert.ok(execution.production.deliveries.some(value => value.kind === 'association' && value.association.investigram === owner));
  assert.deepEqual(ledger.productions().slice(0, priorDeliveries.length).map(value => value.deliveries), priorDeliveries);
});

test('oversized explicit context is withheld and undispatched initial context records no exposure', async () => {
  const { ledger, entity, run } = await setup();
  const production = ledger.begin({ producer: { mechanism: 'agentic', method: 'test/large-context@1', agent: null } });
  const accepted = ledger.accept([{ production, contribution: { investigrams: [{ key: 'large', qualification: caveat,
    items: [{ key: 'body', type: 'prose', body: { text: 'EXPLICIT_CONTEXT_BODY '.repeat(10000) } }] }] } }]);
  const owner = accepted.productions[0]!.investigrams.large!;
  const context: readonly SubjectRef[] = [{ kind: 'content', item: { investigram: owner, item: 'body' }, component: null }];
  const request = { operation: operation.id, subjects: [{ role: null, subject: { kind: 'entity' as const, entity: entity('barrel') } }], parameters: {}, context, resultContract: null };
  const { execution } = await run([input => {
    assert.deepEqual(input.request.context, context);
    assert.equal(input.responses[1]!.tool, 'unavailable');
    assert.match(JSON.stringify(input.responses[1]), /Nothing was delivered/);
    assert.ok(!JSON.stringify(input.responses).includes('EXPLICIT_CONTEXT_BODY'));
    return { kind: 'ended' };
  }], ledger.invoke(request).invocation);
  assert.ok(!execution.production.deliveries.some(value => value.kind === 'item' && value.item.investigram === owner));
  const undispatched = await run([() => { throw Error('The character guard must prevent dispatch'); }],
    ledger.invoke({ ...request, context: [{ kind: 'entity', entity: entity('origin') }] }, { fresh: true }).invocation,
    { bounds: { milliseconds: 60_000, calls: 4, toolCalls: 4, characters: 1 } });
  assert.equal(undispatched.execution.outcome.kind, 'limit-stop');
  assert.deepEqual(undispatched.execution.production.deliveries, []);
  assert.deepEqual(undispatched.execution.production.evidence, []);
});


test('exact initial subject/context duplicates share delivery while roles, components and acquisition routes remain distinct', async () => {
  const { ledger, entity, run } = await setup();
  const origin = ledger.invoke({ operation: operation.id, subjects: [], parameters: {}, context: [], resultContract: null });
  const handle = ledger.begin({ producer: { mechanism: 'agentic', method: 'test/duplicate-inputs@1', agent: null } });
  const accepted = ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'owner', qualification: caveat,
    items: [{ key: 'model', type: 'state-model', body: { bearer: { role: 'one connection' }, states: [{ key: 'idle', label: 'Idle' }],
      initial: { kind: 'unknown' }, transitions: [], coverage: { states: 'some', transitions: 'unknown' } } }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: origin.result.id },
      members: [{ kind: 'item', item: { investigram: { local: 'owner' }, item: 'model' } }] }] }] } }]);
  const owner = accepted.productions[0]!.investigrams.owner!;
  const baseline: SubjectRef = { kind: 'entity', entity: entity('barrel') };
  const component: SubjectRef = { kind: 'content', item: { investigram: owner, item: 'model' }, component: 'state:idle' };
  const whole: SubjectRef = { kind: 'content', item: { investigram: owner, item: 'model' }, component: null };
  const designation: SubjectRef = { kind: 'designation', association: { investigram: owner, declaration: 'answer' } };
  const context: SubjectRef[] = [baseline, baseline, component, { component: 'state:idle', item: { item: 'model', investigram: owner }, kind: 'content' },
    whole, designation, designation, { kind: 'investigram', investigram: owner }];
  const request = { operation: operation.id, subjects: [{ role: 'primary', subject: baseline }, { role: 'comparison', subject: baseline }],
    parameters: {}, context, resultContract: null };
  const invocation = ledger.invoke(request).invocation;
  const { execution, agent } = await run([input => {
    assert.deepEqual(input.request.subjects.map(value => ({ role: (value as { role: string }).role, subject: (value as { subject: unknown }).subject })), request.subjects);
    assert.deepEqual(input.request.context, context);
    assert.deepEqual(input.responses.map(value => value.tool === 'contribution' ? value.kind : value.tool), ['baseline', 'item', 'item', 'association', 'contribution']);
    return { kind: 'tools', requests: [{ kind: 'item', item: whole.kind === 'content' ? whole.item : undefined }] };
  }, input => {
    assert.equal(input.responses.length, 1, 'later deliberate acquisitions are not deduplicated');
    return { kind: 'ended' };
  }], invocation);
  const deliveries = execution.production.deliveries.filter(value => value.kind === 'item' && value.item.investigram === owner);
  assert.equal(deliveries.length, 5, 'component, whole item, designation, owner, and later acquisition each deliver once');
  assert.equal(deliveries.filter(value => value.kind === 'item' && value.route !== null).length, 1, 'designation use remains a distinct exposure route');
  const initialSize = JSON.stringify(agent.inputs[0]).length;
  const stopped = await run([() => { throw Error('Unexpected dispatch'); }], ledger.invoke(request, { fresh: true }).invocation,
    { bounds: { milliseconds: 60_000, calls: 4, toolCalls: 4, characters: initialSize - 1000 } });
  assert.equal(stopped.execution.outcome.kind, 'limit-stop');
  assert.deepEqual(stopped.execution.production.deliveries, []);
  assert.deepEqual(stopped.execution.production.evidence, []);
});

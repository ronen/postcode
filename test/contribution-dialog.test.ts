import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { conductDialog, dialogInstructions } from '../src/lib/contributions/dialog.js';
import type { DialogAgent, DialogInput, DialogOperation, DialogReply, DialogResponse } from '../src/lib/contributions/dialog.js';
import type { AssociationAddress, EntityId, InvestigramId, SubmittedInvestigram } from '../src/lib/contributions/model.js';
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
  let citedClaim: RecordId | undefined, retainedUse: AssociationAddress | undefined;
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
      const retained = exported.retained as DeliveredAssociation[];
      assert.deepEqual([retained.length, retained[0]!.owner.producer.mechanism, retained[0]!.content[0]!.type], [1, 'mechanical', 'module-exports']);
      retainedUse = retained[0]!.address;
      citedClaim = exported.response.records.find(item => item.kind === 'claim' && item.information.type === 'export')!.id;
      const submitted = account('a', barrel, main.result.id, 'The module forwards the exports of its origin.');
      return { kind: 'submit', contribution: { investigrams: [{ ...submitted,
        items: [{ ...submitted.items![0]!, evidence: [citedClaim], support: [retained[0]!.content[0]!.address] }] }] } };
    },
  ], main.invocation);
  assert.equal(execution.outcome.kind, 'accepted');
  if (execution.outcome.kind !== 'accepted') return;
  const produced = execution.outcome.acceptance.productions[0]!.investigrams.a!;
  // Exactly what was dispatched: baseline scope with the identification and its content, the acquired scope, then the retained export use and its content.
  assert.deepEqual(kinds(execution.production.deliveries), ['scope', 'association', 'item', 'scope', 'association', 'item']);
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
    ['invalid-submission', { kind: 'no-contribution', reason: 'invalid-submission' }, [], retained]);
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
  assert.deepEqual([refused.execution.outcome.kind, refused.execution.production.outcome], ['investigation-failure', { kind: 'no-contribution', reason: 'ended' }]);
  assert.equal(refused.execution.production.deliveries.every(delivery => delivery.position <= ledger.position), true);
  // The fresh request was supplied the answers currently designated for the repeated question.
  assert.equal((refused.agent.inputs[0]!.responses[1] as { kind: string }).kind, 'designations');
  // A communication failure is its own outcome; the attempt is concluded and nothing can be submitted late.
  const failure = { kind: 'communication-failure' as const, code: 'timeout', diagnostic: 'No response.' };
  const failed = await run([() => failure], request().invocation);
  assert.deepEqual([failed.execution.outcome, failed.execution.production.outcome], [failure, { kind: 'no-contribution', reason: 'communication-failure' }]);
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
  const { stateBehaviorGuidance } = await import('../src/lib/contributions/state-model.js');
  assert.match(stateBehaviorGuidance, /unsupported is a list of strings/);
  // Retained regression cases: each observed shape is rejected with a message naming the problem, and the stated shape is accepted.
  const base = account('r', barrel, result.id);
  const cases: [RegExp, unknown][] = [
    [/Unexpected grounds field: statement/, { ...base, declarations: [{ ...base.declarations![0]!, grounds: { statement: 'Because.' } }] }],
    [/Unexpected follow-up option field: operation/, { ...base, options: [{ key: 'o', meaning: 'm', operation: 'state-behavior', subjects: [{ subject: { kind: 'entity', entity: barrel } }] }] }],
  ];
  for (const [message, investigram] of cases) {
    const handle = ledger.begin({ producer: { mechanism: 'agentic', method: 'test@1', agent: null } });
    assert.throws(() => ledger.accept([{ production: handle, contribution: { investigrams: [investigram] } }]), message);
  }
  const handle = ledger.begin({ producer: { mechanism: 'agentic', method: 'test@1', agent: null } });
  assert.doesNotThrow(() => ledger.accept([{ production: handle, contribution: { investigrams: [{ ...base,
    options: [{ key: 'o', meaning: 'Investigate further.', request: { operation: 'state-behavior', subjects: [{ subject: { kind: 'entity', entity: barrel } }] } }] }] } }]));
});

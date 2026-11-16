import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assessFulfillment, attemptAnswers, designatedItems, produce } from '../src/lib/contributions/outcomes.js';
import { InvalidContribution } from '../src/lib/contributions/model.js';
import type { ProductionHandle } from '../src/lib/contributions/production.js';
import type { ResultContract } from '../src/lib/contributions/outcomes.js';
import type { AssociationAddress, EntityId, QueryResultId } from '../src/lib/contributions/model.js';
import type { ContributionLedger } from '../src/lib/contributions/ledger.js';
import { agentic, caveat, createLedger, discoverModule, explainAdmission, rejects, snapshot, submit, summaryInvocation } from './contribution-helpers.js';

const answer = (result: QueryResultId, investigram: string, item: string) => ({ key: 'answer', operation: 'add' as const, target: { kind: 'result' as const, result },
  members: [{ kind: 'item' as const, item: { investigram: { local: investigram }, item } }] });
const current = (ledger: ContributionLedger, result: QueryResultId) => ledger.designations(result).map(entry => entry.address);
/** A controlled specialized-form requirement: a table with at least one row, or an explicitly established empty table. */
const tableContract: ResultContract = { id: 'test/table-answer@1', requirements: [
  { kind: 'designated-answer', description: 'A designated answer.' },
  { kind: 'content', description: 'A structured table.', type: 'test-table' },
] };
const table = (result: QueryResultId, key: string, rows: readonly string[]) => [{ key, qualification: caveat,
  items: [{ key: 'table', type: 'test-table', body: { rows } }], declarations: [answer(result, key, 'table')] }];

test('ordinary equivalent requests reuse the invocation and Query result; a different result contract is a different request', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module'), other = discoverModule(ledger, 'timer.ts').entity('module');
  const first = summaryInvocation(ledger, module), again = summaryInvocation(ledger, module);
  assert.deepEqual([first.reused, again.reused], [false, true]);
  assert.equal(again.invocation.id, first.invocation.id);
  assert.equal(again.result.id, first.result.id);
  // Matching subjects alone do not establish request equivalence.
  const diagram = summaryInvocation(ledger, module, 'state-diagram');
  assert.notEqual(diagram.result.id, first.result.id);
  assert.notEqual(summaryInvocation(ledger, other).result.id, first.result.id);
  // An explicit fresh request has its own invocation and keeps the repeated question's Query result as its organizing target.
  const fresh = summaryInvocation(ledger, module, null, true);
  assert.deepEqual([fresh.reused, fresh.invocation.fresh, fresh.result.id], [false, true, first.result.id]);
  assert.notEqual(fresh.invocation.id, first.invocation.id);
  assert.equal(ledger.result(first.result.id).origin, first.invocation.id);
  // A later ordinary request still reuses the original invocation.
  assert.equal(summaryInvocation(ledger, module).invocation.id, first.invocation.id);
  assert.deepEqual(ledger.investigationsOf({ kind: 'entity', entity: module }).map(item => item.id), [first.invocation.id, diagram.invocation.id, fresh.invocation.id]);
  assert.throws(() => summaryInvocation(ledger, 'session:x:entity:0' as EntityId), /Missing Entity/);
});

test('an investigation of selected content keeps its exact historical subject after redesignation', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const { invocation, result } = summaryInvocation(ledger, module);
  const summary = explainAdmission(ledger, module, result.id, invocation.id), d1 = summary.use('summary', 'answer');
  const examine = ledger.invoke({ operation: 'examine', subjects: [{ role: null, subject: { kind: 'designation', association: d1 } }], parameters: {}, context: [], resultContract: null });
  // The investigating producer receives D1 and redesignates the earlier result; its own request still concerns exactly D1.
  const revision = submit(ledger, agentic('reviser'), handle => {
    handle.association(d1);
    return [{ key: 'rev', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Admission can wait.' } }],
      declarations: [{ ...answer(result.id, 'rev', 'p'), operation: 'supersede', displaces: [d1], grounds: { text: 'Fuller answer to the summary question.' } },
        { ...answer(examine.result.id, 'rev', 'p'), key: 'examined' }] }];
  }, { invocation: examine.invocation.id });
  const d2 = revision.use('rev', 'answer');
  assert.deepEqual(ledger.invocation(examine.invocation.id).request.subjects[0]!.subject, { kind: 'designation', association: d1 });
  assert.deepEqual(ledger.investigationsOf({ kind: 'designation', association: d1 }).map(item => item.id), [examine.invocation.id]);
  // The repeated summary request selects the revised answer without a new invocation or producer.
  const repeated = summaryInvocation(ledger, module);
  assert.deepEqual([repeated.reused, current(ledger, repeated.result.id)], [true, [d2]]);
  // Exact original access is preserved, with its displacement available separately.
  assert.deepEqual(designatedItems(ledger, d1), [summary.item('summary', 'admission')]);
  assert.deepEqual(ledger.standing(d1), { state: 'displaced', displacedBy: [d2] });
  // From the already displaced D1, a producer deliberately creates a competing alternative by superseding it again.
  const d3 = submit(ledger, agentic('alternative'), [{ key: 'alt', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Admission is immediate only when closed.' } }],
    declarations: [{ ...answer(result.id, 'alt', 'p'), operation: 'supersede', displaces: [d1], grounds: { text: 'A qualified alternative to the successor, not a replacement of it.' } }] }]).use('alt', 'answer');
  assert.deepEqual(current(ledger, result.id), [d2, d3]);
  assert.deepEqual(current(ledger, result.id), current(ledger, result.id));
  assert.deepEqual(ledger.designations(result.id, 'all').map(entry => entry.address), [d1, d2, d3]);
  assert.deepEqual(ledger.standing(d1).displacedBy, [d2, d3]);
});

test('designated membership is exact, finite and may span investigrams', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const { invocation, result } = summaryInvocation(ledger, module);
  const summary = explainAdmission(ledger, module, result.id, invocation.id);
  const own = (declaration: string) => ({ kind: 'association' as const, association: { investigram: { local: 'x' }, declaration } });
  const target = { kind: 'result' as const, result: result.id };
  rejects(ledger, agentic(), [{ key: 'x', qualification: caveat, declarations: [
    { key: 'a', operation: 'add', target, members: [own('b')] }, { key: 'b', operation: 'add', target, members: [own('a')] }] }], /circular membership/);
  rejects(ledger, agentic(), [{ key: 'x', qualification: caveat, declarations: [{ key: 'a', operation: 'add', target, members: [own('missing')] }] }], /association use/);
  const before = snapshot(ledger);
  const nested = submit(ledger, agentic('nested'), [{ key: 'x', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Extra.' } }], declarations: [
    { key: 'outer', operation: 'add', target, members: [own('inner'), { kind: 'association', association: summary.use('summary', 'answer') }] },
    { key: 'inner', operation: 'add', target: { kind: 'entity', entity: module, role: 'topic', topic: 'extra' }, members: [{ kind: 'item', item: { investigram: { local: 'x' }, item: 'p' } }] }] }]);
  assert.notEqual(snapshot(ledger), before);
  assert.deepEqual(ledger.memberAssociations(nested.use('x', 'outer')), [nested.use('x', 'inner'), summary.use('summary', 'answer'), summary.use('summary', 'admission')]);
  assert.deepEqual(designatedItems(ledger, nested.use('x', 'outer')), [nested.item('x', 'p'), summary.item('summary', 'admission')]);
});

test('withdrawing the last standing designation leaves no current answer, with grounds and history, and restores nothing', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const { invocation, result } = summaryInvocation(ledger, module, tableContract.id);
  assert.equal(assessFulfillment(ledger, tableContract, result.id).status, 'no-designated-answer');
  const first = submit(ledger, agentic(), table(result.id, 't', ['Closed', 'Open']), { invocation: invocation.id }), d1 = first.use('t', 'answer');
  assert.equal(assessFulfillment(ledger, tableContract, result.id).status, 'fulfilled');
  const withdrawal = submit(ledger, agentic('w'), [{ key: 'w', declarations: [{ key: 'w', operation: 'withdraw', qualification: caveat, displaces: [d1],
    grounds: { text: 'The table misattributed the Open state.' } }] }]).use('w', 'w');
  // Ordinary retrieval: an explicit no-current-answer condition, the withdrawal grounds and exact historical access.
  const repeated = summaryInvocation(ledger, module, tableContract.id);
  assert.equal(repeated.reused, true);
  assert.deepEqual(current(ledger, result.id), []);
  const fulfillment = assessFulfillment(ledger, tableContract, result.id);
  assert.deepEqual([fulfillment.status, fulfillment.alternatives, fulfillment.history], ['no-current-answer', [], [{ designation: d1, displacedBy: [withdrawal] }]]);
  const grounds = ledger.declaration(withdrawal);
  assert.equal(grounds.operation === 'withdraw' && grounds.grounds.text, 'The table misattributed the Open state.');
  // The historical answer is still exactly accessible and would itself satisfy the contract; it is not current.
  assert.equal(assessFulfillment(ledger, tableContract, result.id, [d1]).status, 'fulfilled');
  assert.equal(ledger.production(first.handle.id).outcome.kind, 'accepted');
  // An explicit fresh investigation can add a new standing designation while the withdrawn history is preserved.
  const fresh = summaryInvocation(ledger, module, tableContract.id, true);
  const d2 = submit(ledger, agentic('fresh-model'), table(result.id, 'again', ['Closed', 'Open', 'Half-open']), { invocation: fresh.invocation.id }).use('again', 'answer');
  assert.deepEqual(current(ledger, result.id), [d2]);
  assert.equal(ledger.standing(d1).state, 'displaced');
  assert.equal(assessFulfillment(ledger, tableContract, result.id).status, 'fulfilled');
});

test('a fresh investigation preserves earlier attempts; supersession excludes the displaced answer and addition keeps both', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const { invocation, result } = summaryInvocation(ledger, module, tableContract.id);
  const d1 = submit(ledger, agentic('model-a'), table(result.id, 'first', ['Closed']), { invocation: invocation.id }).use('first', 'answer');
  // No organizing change: the attempt actually ran, returns the exact existing answer and adds no duplicate declaration.
  const unchanged = summaryInvocation(ledger, module, tableContract.id, true);
  const count = ledger.investigrams().length;
  const noChange = submit(ledger, agentic('model-b'), handle => { handle.designations(result.id, { content: true }); return []; },
    { invocation: unchanged.invocation.id, report: { answer: [d1], statement: 'No organizing change is warranted.' } });
  const attempt = ledger.production(noChange.handle.id);
  assert.deepEqual([attempt.outcome.kind, attempt.investigrams, attempt.report?.answer, attempt.producer.agent?.model, attempt.invocation],
    ['accepted', [], [d1], 'model-b', unchanged.invocation.id]);
  assert.equal(attempt.deliveries.length > 0, true);
  assert.equal(ledger.investigrams().length, count);
  assert.deepEqual(current(ledger, result.id), [d1]);
  assert.equal(assessFulfillment(ledger, tableContract, result.id, attempt.report!.answer).status, 'fulfilled');
  // Addition: both standing alternatives are returned distinctly; recency confers no priority.
  const added = summaryInvocation(ledger, module, tableContract.id, true);
  const d2 = submit(ledger, agentic('model-c'), table(result.id, 'second', ['Closed', 'Open']), { invocation: added.invocation.id }).use('second', 'answer');
  assert.deepEqual(current(ledger, result.id), [d1, d2]);
  // Explicit supersession: exactly the named designation leaves current selection; exact history remains.
  const replaced = summaryInvocation(ledger, module, tableContract.id, true);
  const d3 = submit(ledger, agentic('model-d'), [{ key: 'third', qualification: caveat, items: [{ key: 'table', type: 'test-table', body: { rows: ['Closed', 'Half-open'] } }],
    declarations: [{ ...answer(result.id, 'third', 'table'), operation: 'supersede', displaces: [d1], grounds: { text: 'The first table omitted Half-open.' } }] }],
  { invocation: replaced.invocation.id }).use('third', 'answer');
  assert.deepEqual(current(ledger, result.id), [d2, d3]);
  assert.deepEqual(ledger.designations(result.id, 'all').map(entry => entry.address), [d1, d2, d3]);
  // A failed fresh attempt preserves earlier information and its own provenance.
  const failed = ledger.begin({ producer: agentic('model-e'), invocation: summaryInvocation(ledger, module, tableContract.id, true).invocation.id });
  failed.designations(result.id);
  const abandoned = ledger.abandon(failed, 'limit-stop');
  assert.deepEqual([abandoned.outcome, abandoned.investigrams, abandoned.producer.agent?.model], [{ kind: 'no-contribution', reason: 'limit-stop' }, [], 'model-e']);
  assert.deepEqual(current(ledger, result.id), [d2, d3]);
  assert.equal(ledger.productions().filter(item => item.invocation !== null).length, 5);
});

test('production outcomes separate no contribution, invalid submission and accepted but unfulfilled work', async () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const { invocation, result } = summaryInvocation(ledger, module, tableContract.id);
  const request = { producer: agentic(), invocation: invocation.id, contract: tableContract };
  const before = snapshot(ledger).length;
  const silent = await produce(ledger, request, () => undefined);
  assert.deepEqual([silent.kind, silent.kind === 'no-contribution' && silent.reason, ledger.investigrams().length], ['no-contribution', 'not-submitted', 1]);
  // Structural failure without repair: nothing accepted.
  const malformed = { investigrams: [{ key: 'a', items: [{ key: 'p', type: 'prose', body: { text: 'x' } }] }] };
  const invalid = await produce(ledger, request, () => malformed);
  assert.deepEqual([invalid.kind, invalid.kind === 'invalid-submission' && invalid.problems, ledger.investigrams().length],
    ['invalid-submission', ['A content item requires attributable qualification.'], 1]);
  assert.equal(invalid.production.outcome.kind, 'no-contribution');
  // Bounded repair within the same execution receives the problem and can succeed.
  const repaired = await produce(ledger, { ...request, repairs: 1 }, (_production, repair) =>
    repair ? { investigrams: [{ ...malformed.investigrams[0]!, qualification: caveat }] } : malformed);
  assert.deepEqual([repaired.kind, repaired.kind === 'accepted' && repaired.repairs], ['accepted', 1]);
  // Valid useful partial content, with no association or designation: retained, addressable, and reported as unfulfilled.
  assert.equal(repaired.kind === 'accepted' && repaired.fulfillment?.status, 'no-answer-supplied');
  assert.equal(assessFulfillment(ledger, tableContract, result.id).status, 'no-designated-answer');
  assert.equal(ledger.investigrams().length, 2);
  // Prose designated as the answer does not silently fulfill the required specialized form; its declarations still take effect.
  const prose = await produce(ledger, request, production => {
    production.baseline(module);
    return { report: { inability: 'I could not construct the requested table, but here is what I established.' },
      investigrams: [{ key: 'partial', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'States: Closed and Open.' } }],
        declarations: [answer(result.id, 'partial', 'p'), { key: 'topic', operation: 'add', target: { kind: 'entity', entity: module, role: 'topic', topic: 'states' },
          members: [{ kind: 'item', item: { investigram: { local: 'partial' }, item: 'p' } }] }] }] };
  });
  assert.equal(prose.kind, 'accepted');
  if (prose.kind !== 'accepted') return;
  const partial = prose.acceptance.productions[0]!.investigrams.partial!;
  const designation: AssociationAddress = { investigram: partial, declaration: 'answer' };
  // The shortfall determined by PostCode's check and the producer's reported inability are separate observations.
  assert.deepEqual(prose.fulfillment?.alternatives, [{ designation, unmet: [{ requirement: 'A structured table.', reason: 'The selected answer contains no test-table content.' }] }]);
  assert.equal(prose.fulfillment?.status, 'unfulfilled');
  assert.match(prose.reportedInability ?? '', /could not construct/);
  assert.deepEqual(current(ledger, result.id), [designation]);
  assert.equal(ledger.associations({ kind: 'entity', entity: module, role: 'topic', topic: 'states' }, 'current').length, 1);
  // Two equally standing alternatives, only one meeting the contract: both preserved, the request not reported as fulfilled.
  const structured = await produce(ledger, request, () => ({ investigrams: table(result.id, 'structured', ['Closed', 'Open']) }));
  // This attempt's own answer meets the contract. The request as a whole now has two standing alternatives and is not fulfilled.
  assert.deepEqual(structured.kind === 'accepted' && [structured.fulfillment?.status, structured.fulfillment?.alternatives.length], ['fulfilled', 1]);
  const whole = assessFulfillment(ledger, tableContract, result.id);
  assert.equal(whole.status, 'unfulfilled');
  const alternatives = whole.alternatives;
  assert.deepEqual(alternatives.map(item => item.unmet.length), [1, 0]);
  // A request explicitly selecting one alternative is assessed for that selection.
  assert.equal(assessFulfillment(ledger, tableContract, result.id, [alternatives[1]!.designation]).status, 'fulfilled');
  assert.throws(() => assessFulfillment(ledger, tableContract, result.id, [{ investigram: partial, declaration: 'topic' }]), /does not belong/);
  assert.equal(snapshot(ledger).length > before, true);
});

test('an established empty result is fulfilled content, distinct from a missing answer or an incomplete one', async () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const contract: ResultContract = { id: 'test/complete-table@1', requirements: [
    { kind: 'content', description: 'A table with established coverage.', type: 'test-table',
      unmet: body => (body as { rows: string[] }).rows.includes('unknown') ? 'The table reports unknown entries.' : null }] };
  const { invocation, result } = summaryInvocation(ledger, module, contract.id);
  const request = { producer: agentic(), invocation: invocation.id, contract };
  assert.equal(assessFulfillment(ledger, contract, result.id).status, 'no-designated-answer');
  const incomplete = await produce(ledger, request, () => ({ investigrams: table(result.id, 'incomplete', ['unknown']) }));
  assert.deepEqual(incomplete.kind === 'accepted' && [incomplete.fulfillment?.status, incomplete.fulfillment?.alternatives[0]?.unmet[0]?.reason],
    ['unfulfilled', 'The table reports unknown entries.']);
  const empty = await produce(ledger, { ...request, invocation: summaryInvocation(ledger, module, contract.id, true).invocation.id }, () => ({
    investigrams: [{ ...table(result.id, 'empty', [])[0]!, declarations: [{ ...answer(result.id, 'empty', 'table'), operation: 'supersede',
      displaces: [{ investigram: incomplete.kind === 'accepted' ? incomplete.acceptance.productions[0]!.investigrams.incomplete! : 'x', declaration: 'answer' }],
      grounds: { text: 'Coverage was completed: there are no entries.' } }] }] }));
  assert.deepEqual(empty.kind === 'accepted' && [empty.fulfillment?.status, empty.fulfillment?.alternatives.length, empty.fulfillment?.history.length], ['fulfilled', 1, 1]);
  // An unexpected defect in a producer is not converted into an ordinary outcome.
  await assert.rejects(produce(ledger, request, () => { throw new TypeError('defect'); }), TypeError);
});

test('an attempt is fulfilled only by answers it supplied or explicitly returned, not by an earlier answer that still stands', async () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module'), other = discoverModule(ledger, 'timer.ts').entity('module');
  const { invocation, result } = summaryInvocation(ledger, module, tableContract.id);
  const first = await produce(ledger, { producer: agentic('model-a'), invocation: invocation.id, contract: tableContract }, () => ({ investigrams: table(result.id, 'first', ['Closed']) }));
  assert.equal(first.kind === 'accepted' && first.fulfillment?.status, 'fulfilled');
  const d1 = current(ledger, result.id)[0]!;
  const fresh = () => ({ producer: agentic('model-b'), invocation: summaryInvocation(ledger, module, tableContract.id, true).invocation.id, contract: tableContract });
  // A fresh partial attempt: qualified notes and a reported inability, no designation and no returned answer.
  const partial = await produce(ledger, fresh(), () => ({ report: { inability: 'I could not construct the table.' },
    investigrams: [{ key: 'notes', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'Partial notes.' } }] }] }));
  assert.equal(partial.kind, 'accepted');
  if (partial.kind !== 'accepted') return;
  assert.deepEqual([partial.fulfillment?.status, partial.fulfillment?.alternatives, partial.reportedInability], ['no-answer-supplied', [], 'I could not construct the table.']);
  assert.deepEqual(attemptAnswers(ledger, partial.production, result.id), []);
  // The earlier answer still stands and the request as a whole is still answered; that is a separate assessment.
  assert.deepEqual([current(ledger, result.id), assessFulfillment(ledger, tableContract, result.id).status], [[d1], 'fulfilled']);
  // Explicit reuse: the attempt returns the exact existing answer and is fulfilled by it without a new declaration.
  const reuse = await produce(ledger, fresh(), production => { production.designations(result.id, { content: true }); return { investigrams: [], report: { answer: [d1], statement: 'No organizing change is warranted.' } }; });
  assert.deepEqual(reuse.kind === 'accepted' && [reuse.fulfillment?.status, reuse.fulfillment?.alternatives.map(item => item.designation), reuse.production.investigrams], ['fulfilled', [d1], []]);
  // A reported answer must answer this attempt's own question.
  const elsewhere = summaryInvocation(ledger, other, tableContract.id);
  const foreign = submit(ledger, agentic(), table(elsewhere.result.id, 'elsewhere', ['Idle']), { invocation: elsewhere.invocation.id }).use('elsewhere', 'answer');
  const mismatched = await produce(ledger, fresh(), () => ({ investigrams: [], report: { answer: [foreign] } }));
  assert.deepEqual(mismatched.kind === 'invalid-submission' && mismatched.problems, ['A reported answer must designate the Query result of this production\'s invocation.']);
});

test('a failing fulfillment check propagates after acceptance and never reopens structural repair', async () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const contract: ResultContract = { id: 'test/defective-check@1', requirements: [{ kind: 'content', description: 'A table.', type: 'test-table',
    unmet: () => { throw new InvalidContribution('fulfillment checker defect'); } }] };
  const { invocation, result } = summaryInvocation(ledger, module, contract.id);
  for (const repairs of [0, 1]) {
    const handles: ProductionHandle[] = [], before = ledger.productions().length;
    await assert.rejects(produce(ledger, { producer: agentic(), invocation: invocation.id, contract, repairs }, production => {
      handles.push(production);
      return { investigrams: table(result.id, `t${repairs}`, ['Closed']) };
    }), (error: unknown) => error instanceof InvalidContribution && error.message === 'fulfillment checker defect');
    // One callback, the accepted contribution retained with its declaration in effect, and the production concluded as accepted.
    assert.deepEqual([handles.length, handles[0]!.closed, ledger.productions().length - before, ledger.production(handles[0]!.id).outcome.kind], [1, true, 1, 'accepted']);
  }
  assert.equal(current(ledger, result.id).length, 2);
});

test('a producer defect propagates and its production accepts nothing afterwards', async () => {
  const ledger = createLedger(), captured: ProductionHandle[] = [], before = snapshot(ledger);
  await assert.rejects(produce(ledger, { producer: agentic() }, production => { captured.push(production); throw new TypeError('defect'); }), TypeError);
  assert.equal(captured[0]!.closed, true);
  assert.throws(() => ledger.accept([{ production: captured[0]!, contribution: { investigrams: [{ key: 'late', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'x' } }] }] } }]), /not open/);
  assert.equal(snapshot(ledger), before);
});

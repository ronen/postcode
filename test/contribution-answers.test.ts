import { stateDiagramContract } from '../src/lib/contributions/state-model.js';
import type { ResultContract } from '../src/lib/contributions/outcomes.js';
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import type { ArrangedQualification } from '../src/lib/contributions/answers.js';
import { arrangeContributionAnswer, resolveContributionAnswer, selectContributionAnswer } from '../src/lib/contributions/answers.js';
import { moduleEntity, sessionLedger } from '../src/lib/contributions/modules.js';
import { discover } from './helpers.js';
import { agentic, submit } from './contribution-helpers.js';

const statements = (group: ArrangedQualification) => [...group.statements, ...(group.owner?.statements ?? [])];
const q = (text: string) => ({ limitations: [text] });
async function setup(contract: ResultContract | null = null) {
  const { store, evaluation, claims } = await discover(path.resolve('fixtures', 'exports', 'tsconfig.json'));
  const ledger = sessionLedger(store, evaluation.session), subject = claims.find(claim => claim.information.handle === 'barrel')!.subject;
  const entity = moduleEntity(store, subject)!;
  const { result, invocation } = ledger.invoke({ operation: 'test-answer', subjects: [{ role: null, subject: { kind: 'entity', entity } }], parameters: {}, context: [], resultContract: contract?.id ?? null });
  const select = () => selectContributionAnswer(store, ledger, { lens: 'test-answer', subject, parameters: {}, result: result.id, contract });
  return { store, ledger, subject, entity, result, invocation, select, claims };
}

test('answers retain cross-owner use paths, prior displacement, precise conflicts and resolved support without exposure', async t => {
  const { store, ledger, subject, entity, result, select } = await setup();
  const module = store.get(subject);
  assert.equal(module.kind, 'module'); if (module.kind !== 'module') return;
  const source = submit(ledger, agentic(), handle => { handle.supplied([module.claim]); return [{ key: 'source', qualification: q('SOURCE_LIMIT'), items: [
    { key: 'support', type: 'prose', body: { text: 'RETAINED_SUPPORT_BODY' }, qualification: q('SUPPORT_LIMIT') },
    { key: 'p', type: 'prose', body: { text: 'A qualified claim.' }, evidence: [module.claim],
      support: [{ investigram: { local: 'source' }, item: 'support' }] }],
    declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity, role: 'topic', topic: 'claim' }, qualification: q('MEMBER_USE_LIMIT'),
      members: [{ kind: 'item', item: { investigram: { local: 'source' }, item: 'p' } }] }] }]; });
  const withdrawn = submit(ledger, agentic(), [{ key: 'withdraw', qualification: q('WITHDRAWAL_LIMIT'), declarations: [{ key: 'w', operation: 'withdraw',
    displaces: [source.use('source', 'use')], grounds: { text: 'WITHDRAWAL_REASON', support: [source.item('source', 'support')] } }] }]);
  submit(ledger, agentic(), [{ key: 'selection', qualification: q('DESIGNATION_OWNER_LIMIT'), declarations: [{ key: 'answer', operation: 'add',
    target: { kind: 'result', result: result.id }, qualification: q('DESIGNATION_NARROW_LIMIT'), members: [{ kind: 'association', association: source.use('source', 'use') }] }] }]);
  const deliveries = ledger.productions().map(production => production.deliveries);
  const first = select(), content = resolveContributionAnswer(store, first), view = arrangeContributionAnswer(content, 'Claim');
  for (const entry of first.support.items) assert.equal(entry.item, ledger.item(entry.address));
  for (const evidence of first.support.evidence) assert.equal(evidence, store.get(evidence.id));
  const groups = view.alternatives[0]!.qualifications;
  for (const limit of ['SOURCE_LIMIT', 'MEMBER_USE_LIMIT', 'DESIGNATION_OWNER_LIMIT', 'DESIGNATION_NARROW_LIMIT', 'WITHDRAWAL_LIMIT']) assert.ok(groups.flatMap(statements).includes(limit), limit);
  const withdrawal = groups.find(group => group.kind === 'displacement')!;
  assert.deepEqual(withdrawal.source, { kind: 'declaration', address: withdrawn.use('withdraw', 'w') });
  assert.ok(withdrawal.label.includes('Displacement'));
  assert.ok(withdrawal.statements.some(value => value.includes('WITHDRAWAL_REASON')));
  assert.deepEqual(groups.filter(group => statements(group).includes('WITHDRAWAL_LIMIT')).map(group => group.kind), ['displacement']);
  const supporting = groups.filter(group => statements(group).includes('SUPPORT_LIMIT'));
  assert.deepEqual(supporting.map(group => [group.kind, group.source]), [['supporting-item', { kind: 'item', address: source.item('source', 'support') }]]);
  assert.ok(groups.filter(group => group.kind === 'selected-use').flatMap(statements).includes('MEMBER_USE_LIMIT'));
  assert.equal(first.alternatives[0]!.membership.length, 0, 'prior displacement is not a later membership cause');
  assert.ok(first.support.evidence.some(record => record.id === module.claim));
  assert.ok(first.support.evidence.some(record => record.kind === 'claim-context'));
  assert.ok(first.support.evidence.some(record => record.kind === 'analysis-inputs'));
  assert.ok(first.support.items.some(value => (value.item.body as { text?: string }).text === 'RETAINED_SUPPORT_BODY'));
  assert.deepEqual(first.support.uses.find(value => value.address.investigram === source.investigram('source'))!.status.standing.displacedBy, [withdrawn.use('withdraw', 'w')]);
  assert.deepEqual(ledger.productions().map(production => production.deliveries), deliveries);
  const other = submit(ledger, agentic(), [{ key: 'other', qualification: q('OTHER_LIMIT'), items: [{ key: 'p', type: 'prose', body: { text: 'A conflicting claim.' } }] }]);
  const conflict = submit(ledger, agentic(), [{ key: 'conflict', qualification: q('CONFLICT_LIMIT'), inconsistencies: [{ key: 'c',
    endpoints: [{ kind: 'item', item: source.item('source', 'p') }, { kind: 'item', item: other.item('other', 'p') }], grounds: { text: 'PRECISE_CONFLICT' } }] }]);
  const second = select();
  assert.notEqual(first.id, second.id);
  assert.equal(second.support.items.find(value => value.item === ledger.item(source.item('source', 'p')))!.item,
    first.support.items.find(value => value.item === ledger.item(source.item('source', 'p')))!.item);
  const conflictGroups = arrangeContributionAnswer(resolveContributionAnswer(store, second), 'Claim').alternatives[0]!.qualifications.filter(group => statements(group).includes('CONFLICT_LIMIT'));
  assert.equal(conflictGroups.length, 1);
  assert.equal(conflictGroups[0]!.kind, 'inconsistency');
  assert.equal(conflictGroups[0]!.source.address.investigram, conflict.investigram('conflict'));
  assert.ok(conflictGroups[0]!.statements.includes('Unresolved inconsistency: PRECISE_CONFLICT'));
  assert.deepEqual(arrangeContributionAnswer(resolveContributionAnswer(store, first), 'Claim'), view);
  // Unrelated acceptance changes no selected support or status and therefore no answer identity.
  submit(ledger, agentic(), [{ key: 'unrelated', qualification: q('UNRELATED'), items: [{ key: 'p', type: 'prose', body: { text: 'Other work.' } }] }]);
  assert.equal(select().id, second.id);
  store.releaseOwnership();
  for (const method of ['get', 'lookup', 'capture'] as const) t.mock.method(store, method, () => { throw Error('Presentation consulted the store'); });
  t.mock.method(ledger, 'standing', () => { throw Error('Presentation consulted current standing'); });
  t.mock.method(ledger.status, 'association', () => { throw Error('Presentation reconsidered an earlier answer'); });
  assert.deepEqual(arrangeContributionAnswer(content, 'Claim'), view);
  assert.deepEqual(arrangeContributionAnswer(structuredClone(content), 'Claim'), view);
});

test('multiple state models preserve their distinct role and Entity bearers without accompanying prose', async () => {
  const { store, ledger, entity, result, select } = await setup();
  const model = (bearer: unknown) => ({ bearer, states: [{ key: 'idle', label: 'Idle' }], initial: { kind: 'unknown' }, transitions: [], coverage: { states: 'some', transitions: 'unknown' } });
  submit(ledger, agentic(), [{ key: 'models', qualification: q('MODEL_LIMIT'), items: [
    { key: 'cache', type: 'state-model', body: model({ role: 'each cache instance\u001b' }) },
    { key: 'connection', type: 'state-model', body: model({ role: 'one connection' }) },
    { key: 'entity', type: 'state-model', body: model({ entity }) },
    { key: 'label', type: 'identification', body: { name: 'barrel', nameOrigin: 'assigned', designation: 'The barrel module' } }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: result.id },
      members: ['cache', 'connection', 'entity'].map(item => ({ kind: 'item', item: { investigram: { local: 'models' }, item } })) },
      { key: 'identify', operation: 'add', target: { kind: 'entity', entity, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: 'models' }, item: 'label' } }] }],
    illustrations: [{ key: 'cache-picture', diagramType: 'state-transition', inputs: [{ investigram: { local: 'models' }, item: 'cache' }], qualification: q('ILLUSTRATION_LIMIT') }] }]);
  const projection = select();
  const illustration = projection.support.metadata.find(value => value.address.metadata === 'illustration');
  assert.ok(illustration && 'inputs' in illustration.value);
  assert.equal(illustration.value.inputs[0]!.item, 'cache');
  assert.deepEqual(illustration.value.qualification?.limitations, ['ILLUSTRATION_LIMIT']);
  const view = arrangeContributionAnswer(resolveContributionAnswer(store, projection), 'Models');
  const diagrams = view.alternatives[0]!.diagrams;
  assert.equal(diagrams.length, 3);
  assert.match(diagrams[0]!.text, /States of each cache instance\\u001b/);
  assert.match(diagrams[1]!.text, /States of one connection/);
  assert.match(diagrams[2]!.text, /States of barrel/);
  assert.ok(!JSON.stringify(diagrams).includes(ledger.session));
  assert.deepEqual((projection.alternatives[0]!.items[2]!.body as { bearer: unknown }).bearer, { kind: 'entity', entity });
  assert.ok(!diagrams.some(diagram => diagram.text.includes('wrong common module label')));
  assert.deepEqual(view.alternatives[0]!.prose, []);
});

test('discovered module bearers retain distinct qualified labels without supplemental identifications', async () => {
  const { store, ledger, entity, result, select, claims } = await setup();
  const origin = moduleEntity(store, claims.find(claim => claim.information.handle === 'origin')!.subject)!;
  const entities = [entity, origin], handles = ['barrel', 'origin'];
  const uses = entities.map(entity => ledger.identifications(entity).map(entry => entry.address));
  assert.ok(uses.every(addresses => addresses.length === 1));
  submit(ledger, agentic(), [{ key: 'models', qualification: q('MODEL_LIMIT'), items: entities.map((entity, index) => ({
    key: handles[index]!, type: 'state-model', body: { bearer: { entity }, states: [{ key: 'idle', label: 'Idle' }], initial: { kind: 'unknown' },
      transitions: [], coverage: { states: 'some', transitions: 'unknown' } } })),
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: result.id },
      members: handles.map(item => ({ kind: 'item', item: { investigram: { local: 'models' }, item } })) }] }]);
  const deliveries = ledger.productions().map(production => production.deliveries);
  const projection = select(), content = resolveContributionAnswer(store, projection);
  const view = arrangeContributionAnswer(content, 'Modules'), alternative = view.alternatives[0]!;
  for (const [index, handle] of handles.entries()) {
    const diagram = alternative.diagrams[index]!;
    assert.ok(diagram.text.startsWith(`States of ${handle}\n`));
    assert.ok(diagram.notes.includes(`State bearer: ${handle}.`));
    assert.ok(diagram.svg.includes(`States of ${handle}`));
    assert.deepEqual((projection.alternatives[0]!.items[index]!.body as { bearer: unknown }).bearer, { kind: 'entity', entity: entities[index] });
    const identification = projection.support.items.find(value => value.item.type === 'module-identification' && (value.item.body as { handle: string }).handle === handle)!;
    assert.ok(identification);
    assert.deepEqual(identification.identifyingNames, [{ text: handle, origin: 'generated-handle' }]);
    assert.equal((identification.item.body as { name: null; handleProvenance: string }).name, null);
    assert.equal((identification.item.body as { handleProvenance: string }).handleProvenance, 'source-basename');
    const group = alternative.qualifications.find(group => group.kind === 'bearer-identification' && group.source.kind === 'item'
      && group.source.address.investigram === identification.address.investigram)!;
    assert.ok(group.statements.includes(`Generated handle: ${handle}.`));
    assert.ok(group.statements.some(statement => statement.startsWith('Mechanically derived')));
  }
  assert.ok(!JSON.stringify(alternative.diagrams).includes(ledger.session));
  assert.deepEqual(ledger.productions().map(production => production.deliveries), deliveries);
  // Presentation of the old answer cannot refresh its identification after a withdrawal.
  submit(ledger, agentic(), [{ key: 'withdraw', qualification: q('WITHDRAWAL_LIMIT'), declarations: [{ key: 'w', operation: 'withdraw',
    displaces: uses[0]!, grounds: { text: 'Withdraw the first module identifying use.' } }] }]);
  assert.deepEqual(arrangeContributionAnswer(resolveContributionAnswer(store, projection), 'Modules'), view);
  const current = arrangeContributionAnswer(resolveContributionAnswer(store, select()), 'Modules');
  assert.ok(current.alternatives[0]!.diagrams[0]!.text.startsWith('States of Unlabelled Entity\n'));
  assert.ok(current.alternatives[0]!.diagrams[1]!.text.startsWith('States of origin\n'));
});

test('arrangement discloses every unrendered selected item and preserves incompatible model limits beside drawable models', async () => {
  const { store, ledger, result, select } = await setup();
  const model = (role: string, drawable: boolean) => ({ bearer: { role }, states: drawable ? [{ key: 'idle', label: 'Idle' }] : [], initial: { kind: 'unknown' },
    transitions: [], coverage: { states: 'some', transitions: 'unknown' }, applicability: `${role}_APPLICABILITY`, unsupported: [`${role}_CONCURRENCY_NOT_REPRESENTABLE`] });
  const items = [
    { key: 'draw', type: 'state-model', body: model('worker', true) }, { key: 'empty', type: 'state-model', body: model('shared pool', false) },
    { key: 'identification', type: 'identification', body: { name: 'Pool', nameOrigin: 'assigned', designation: 'The shared resource pool' } },
    { key: 'empty2', type: 'state-model', body: model('second pool', false) }, { key: 'draw2', type: 'state-model', body: model('caller', true) }];
  const accepted = submit(ledger, agentic(), [{ key: 'mixed', qualification: q('MIXED_LIMIT'), items,
    declarations: [{ key: 'a', operation: 'add', target: { kind: 'result', result: result.id }, members: items.map(item => ({ kind: 'item', item: { investigram: { local: 'mixed' }, item: item.key } })) }] }]);
  const projection = select(), view = arrangeContributionAnswer(resolveContributionAnswer(store, projection), 'Mixed'), alternative = view.alternatives[0]!;
  assert.equal(alternative.diagrams.length, 2);
  assert.deepEqual(alternative.unpresented.map(item => [item.address, item.type]), [
    [accepted.item('mixed', 'empty'), 'state-model'], [accepted.item('mixed', 'identification'), 'identification'], [accepted.item('mixed', 'empty2'), 'state-model']]);
  for (const omitted of alternative.unpresented.filter(item => item.type === 'state-model')) {
    assert.equal(omitted.reason, 'The state model establishes no states.');
    assert.equal(omitted.stateModel?.applicability, `${omitted.bearer}_APPLICABILITY`);
    assert.deepEqual(omitted.stateModel?.unsupported, [`${omitted.bearer}_CONCURRENCY_NOT_REPRESENTABLE`]);
  }
  assert.match(alternative.unpresented[1]!.reason, /retained but has no renderer/);
  assert.equal(alternative.diagramUnavailable, null, 'the summary does not suppress the per-item omission list');
});

for (const contract of [null, stateDiagramContract, { id: 'test/designated-answer', requirements: [{ kind: 'designated-answer' as const, description: 'A designated answer.' }] }]) {
  test(`mixed diagram availability reports only retained fulfillment (${contract?.id ?? 'no contract'})`, async () => {
    const { store, ledger, result, select } = await setup(contract);
    submit(ledger, agentic(), [{ key: 'alternatives', qualification: q('INTERPRETATION'), items: [
      { key: 'model', type: 'state-model', body: { bearer: { role: 'one connection' }, states: [{ key: 'idle', label: 'Idle' }],
        initial: { kind: 'unknown' }, transitions: [], coverage: { states: 'some', transitions: 'unknown' } } },
      { key: 'prose', type: 'prose', body: { text: 'An alternative explanation without a state model.' } }],
      declarations: ['model', 'prose'].map(item => ({ key: item, operation: 'add' as const, target: { kind: 'result' as const, result: result.id },
        members: [{ kind: 'item' as const, item: { investigram: { local: 'alternatives' }, item } }] })) }]);
    const projection = select(), content = resolveContributionAnswer(store, projection), before = JSON.stringify(content);
    const view = arrangeContributionAnswer(content, 'Alternatives');
    assert.equal(projection.fulfillment, contract === null ? null : contract === stateDiagramContract ? 'unfulfilled' : 'fulfilled');
    assert.deepEqual(view.alternatives.map(alternative => alternative.diagrams.length).sort(), [0, 1]);
    const notice = view.notices.find(text => text.startsWith('A diagram can be drawn'))!;
    assert.ok(notice.startsWith('A diagram can be drawn for 1 of 2 alternatives.'));
    if (contract === stateDiagramContract) assert.match(notice, /requested result is unmet for 1 of 2 alternatives/);
    else assert.doesNotMatch(notice, /unmet|not fulfilled/);
    assert.equal(JSON.stringify(content), before);
  });
}

test('answer keys preserve Session-shaped literal parameters and retained support text', async () => {
  const { store, ledger, subject, result } = await setup();
  const literal = `Literal ${ledger.session} remains text.`;
  const source = submit(ledger, agentic(), [{ key: 'source', qualification: q(literal), items: [{ key: 'p', type: 'prose', body: { text: literal } }] }]);
  submit(ledger, agentic(), [{ key: 'answer', qualification: q('ANSWER'), items: [{ key: 'p', type: 'prose', body: { text: 'Supported answer.' }, support: [source.item('source', 'p')] }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: result.id }, members: [{ kind: 'item', item: { investigram: { local: 'answer' }, item: 'p' } }] }] }]);
  const select = (literal: string) => selectContributionAnswer(store, ledger, { lens: 'test-answer', subject, parameters: { literal }, result: result.id, contract: null });
  const original = select(ledger.session), other = select('session');
  assert.notEqual(original.id, other.id);
  assert.equal(select(ledger.session), original);
  assert.deepEqual(original.parameters, { literal: ledger.session });
  const retained = original.support.items.find(value => value.address.investigram === source.investigram('source'))!;
  assert.deepEqual(retained.item.body, { text: literal });
  assert.deepEqual(original.support.owners.find(owner => owner.investigram === source.investigram('source'))!.qualification!.limitations, [literal]);
  assert.equal(other.support.items.find(value => value.address.investigram === source.investigram('source'))!.item, retained.item);
});

test('contribution answer keys exclude operational output-exclusion capture while retaining it in support', async () => {
  const { identityReference, recordId } = await import('../src/lib/identity.js');
  const answers = [];
  for (const exclusions of [[], [path.resolve('_verification/unused-answer-output')]]) {
    const { store, evaluation, claims } = await discover(path.resolve('fixtures/exports/tsconfig.json'), exclusions);
    const ledger = sessionLedger(store, evaluation.session), subject = claims.find(claim => claim.information.handle === 'barrel')!.subject;
    const entity = moduleEntity(store, subject)!;
    const { result, invocation } = ledger.invoke({ operation: 'controlled-answer', subjects: [{ role: null, subject: { kind: 'entity', entity } }], parameters: {}, context: [], resultContract: null });
    const production = ledger.begin({ producer: agentic(), invocation: invocation.id, id: recordId(ledger.session, 'production', ['controlled-answer']) });
    const module = store.get(subject); assert.equal(module.kind, 'module'); if (module.kind !== 'module') throw Error('Expected module');
    production.supplied([module.claim]);
    ledger.accept([{ production, contribution: { investigrams: [{ key: 'same', qualification: q('Same qualified account.'),
      items: [{ key: 'p', type: 'prose', body: { text: 'Same meaning.' }, evidence: [module.claim] }],
      declarations: [{ key: 'a', operation: 'add', target: { kind: 'result', result: result.id }, members: [{ kind: 'item', item: { investigram: { local: 'same' }, item: 'p' } }] }] }] } }]);
    const selected = selectContributionAnswer(store, ledger, { lens: 'test-answer', subject, parameters: {}, result: result.id, contract: null });
    answers.push({ key: identityReference(ledger.session, selected.id), item: identityReference(ledger.session, selected.alternatives[0]!.items[0]!.address.investigram),
      inputs: selected.support.evidence.filter(record => record.kind === 'analysis-inputs') });
  }
  assert.equal(answers[0]!.item, answers[1]!.item);
  assert.notDeepEqual(answers[0]!.inputs, answers[1]!.inputs, 'Operational input capture remains part of exact historical support');
  assert.ok(answers[1]!.inputs.length > 0);
  assert.equal(answers[0]!.key, answers[1]!.key);
});

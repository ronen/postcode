import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { arrangeContributionAnswer, resolveContributionAnswer, selectContributionAnswer } from '../src/lib/contributions/answers.js';
import { moduleEntity, sessionLedger } from '../src/lib/contributions/modules.js';
import { discover } from './helpers.js';
import { agentic, submit } from './contribution-helpers.js';

const q = (text: string) => ({ limitations: [text] });
async function setup() {
  const { store, evaluation, claims } = await discover(path.resolve('fixtures', 'exports', 'tsconfig.json'));
  const ledger = sessionLedger(store, evaluation.session), subject = claims.find(claim => claim.information.handle === 'barrel')!.subject;
  const entity = moduleEntity(store, subject)!;
  const { result, invocation } = ledger.invoke({ operation: 'test-answer', subjects: [{ role: null, subject: { kind: 'entity', entity } }], parameters: {}, context: [], resultContract: null });
  const select = () => selectContributionAnswer(store, ledger, { lens: 'test-answer', subject, parameters: {}, result: result.id, contract: null });
  return { store, ledger, subject, entity, result, invocation, select };
}

test('answers retain cross-owner use paths, prior displacement, precise conflicts and resolved support without exposure', async () => {
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
  for (const limit of ['SOURCE_LIMIT', 'MEMBER_USE_LIMIT', 'DESIGNATION_OWNER_LIMIT', 'DESIGNATION_NARROW_LIMIT', 'WITHDRAWAL_LIMIT']) assert.ok(view.alternatives[0]!.qualifications.includes(limit), limit);
  assert.ok(view.alternatives[0]!.qualifications.some(value => value.includes('WITHDRAWAL_REASON')));
  assert.equal(first.alternatives[0]!.membership.length, 0, 'prior displacement is not a later membership cause');
  assert.ok(first.support.evidence.some(record => record.id === module.claim));
  assert.ok(first.support.evidence.some(record => record.kind === 'claim-context'));
  assert.ok(first.support.evidence.some(record => record.kind === 'analysis-inputs'));
  assert.ok(first.support.items.some(value => (value.item.body as { text?: string }).text === 'RETAINED_SUPPORT_BODY'));
  assert.deepEqual(first.support.uses.find(value => value.address.investigram === source.investigram('source'))!.status.standing.displacedBy, [withdrawn.use('withdraw', 'w')]);
  assert.deepEqual(ledger.productions().map(production => production.deliveries), deliveries);
  const other = submit(ledger, agentic(), [{ key: 'other', qualification: q('OTHER_LIMIT'), items: [{ key: 'p', type: 'prose', body: { text: 'A conflicting claim.' } }] }]);
  submit(ledger, agentic(), [{ key: 'conflict', qualification: q('CONFLICT_LIMIT'), inconsistencies: [{ key: 'c',
    endpoints: [{ kind: 'item', item: source.item('source', 'p') }, { kind: 'item', item: other.item('other', 'p') }], grounds: { text: 'PRECISE_CONFLICT' } }] }]);
  const second = select();
  assert.notEqual(first.id, second.id);
  assert.ok(arrangeContributionAnswer(resolveContributionAnswer(store, second), 'Claim').alternatives[0]!.qualifications.includes('Unresolved inconsistency: PRECISE_CONFLICT'));
  assert.deepEqual(arrangeContributionAnswer(resolveContributionAnswer(store, first), 'Claim'), view);
  // Unrelated acceptance changes no selected support or status and therefore no answer identity.
  submit(ledger, agentic(), [{ key: 'unrelated', qualification: q('UNRELATED'), items: [{ key: 'p', type: 'prose', body: { text: 'Other work.' } }] }]);
  assert.equal(select().id, second.id);
});

test('multiple state models preserve their distinct role and Entity bearers without accompanying prose', async () => {
  const { store, ledger, entity, result, select } = await setup();
  const model = (bearer: unknown) => ({ bearer, states: [{ key: 'idle', label: 'Idle' }], initial: { kind: 'unknown' }, transitions: [], coverage: { states: 'some', transitions: 'unknown' } });
  submit(ledger, agentic(), [{ key: 'models', qualification: q('MODEL_LIMIT'), items: [
    { key: 'cache', type: 'state-model', body: model({ role: 'each cache instance\u001b' }) },
    { key: 'connection', type: 'state-model', body: model({ role: 'one connection' }) },
    { key: 'entity', type: 'state-model', body: model({ entity }) }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: result.id },
      members: ['cache', 'connection', 'entity'].map(item => ({ kind: 'item', item: { investigram: { local: 'models' }, item } })) }] }]);
  const view = arrangeContributionAnswer(resolveContributionAnswer(store, select()), 'Models');
  const diagrams = view.alternatives[0]!.diagrams;
  assert.equal(diagrams.length, 3);
  assert.match(diagrams[0]!.text, /States of each cache instance\\u001b/);
  assert.match(diagrams[1]!.text, /States of one connection/);
  assert.ok(diagrams[2]!.text.includes(entity));
  assert.ok(!diagrams.some(diagram => diagram.text.includes('wrong common module label')));
  assert.deepEqual(view.alternatives[0]!.prose, []);
});

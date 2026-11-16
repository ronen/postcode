import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ContributionLedger } from '../src/lib/contributions/ledger.js';
import { InvalidAcquisition } from '../src/lib/contributions/model.js';
import type { AssociationAddress, EntityId, InvestigramId, QueryResultId, SelectionScope } from '../src/lib/contributions/model.js';
import type { ProductionHandle } from '../src/lib/contributions/production.js';
import { agentic, caveat, createLedger, discoverModule, evidenceRecord, explainAdmission, mechanical, derived, submit, submitted, summaryInvocation } from './contribution-helpers.js';
import type { Submitted } from './contribution-helpers.js';

const local = (investigram: string, item: string) => ({ kind: 'item' as const, item: { investigram: { local: investigram }, item } });
const admission = (module: EntityId) => ({ kind: 'entity' as const, entity: module, role: 'topic' as const, topic: 'admission' });
const causes = (ledger: ContributionLedger, investigram: InvestigramId) => ledger.status.investigram(investigram).producing;

/** An account of admission, with a use on the module. */
function account(ledger: ContributionLedger, module: EntityId, key: string, prepare?: (handle: ProductionHandle) => void): Submitted {
  return submit(ledger, agentic(key), handle => {
    prepare?.(handle);
    return [{ key, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: `Account ${key}.` } }],
      declarations: [{ key: 'u', operation: 'add', target: admission(module), members: [local(key, 'p')] }] }];
  });
}
function supersede(ledger: ContributionLedger, module: EntityId, key: string, displaces: AssociationAddress, prepare?: (handle: ProductionHandle) => void): Submitted {
  return submit(ledger, agentic(key), handle => {
    prepare?.(handle);
    return [{ key, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: `Fuller account ${key}.` } }],
      declarations: [{ key: 'u', operation: 'supersede', target: admission(module), members: [local(key, 'p')], displaces: [displaces], grounds: { text: `Grounds ${key}.` } }] }];
  });
}
function withdraw(ledger: ContributionLedger, key: string, displaces: AssociationAddress): Submitted {
  return submit(ledger, agentic(key), [{ key, declarations: [{ key: 'w', operation: 'withdraw', qualification: caveat, displaces: [displaces], grounds: { text: `Withdrawn by ${key}.` } }] }]);
}

test('exact acquisition: a later displacement of a received use is a cause; a known one is disclosed context', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a'), use = a.use('a', 'u');
  const early = account(ledger, module, 'early', handle => {
    const delivered = handle.association(use, { content: true });
    assert.equal(delivered.status.standing.state, 'standing');
    assert.equal(delivered.content[0]!.item?.type, 'prose');
    assert.equal(delivered.owner.producer.agent?.model, 'a');
  });
  const b = supersede(ledger, module, 'b', use), change = b.use('b', 'u');
  const late = account(ledger, module, 'late', handle => {
    const delivered = handle.association(use, { content: true });
    // The displacement is already accepted: it is disclosed with its grounds, and replacement content is only referenced.
    assert.equal(delivered.status.standing.state, 'displaced');
    assert.deepEqual(delivered.displacements.map(item => [item.change, item.declaration.operation, item.standing?.state]), [[change, 'supersede', 'standing']]);
    assert.equal(handle.deliveries.some(delivery => delivery.kind === 'item' && delivery.item.investigram === b.investigram('b')), false);
  });
  const flagged = causes(ledger, early.investigram('early'));
  assert.deepEqual(flagged.map(cause => [cause.change, cause.operation, cause.routes]), [[change, 'supersede', [{ kind: 'exact', association: use }]]]);
  assert.deepEqual(causes(ledger, late.investigram('late')), []);
  // The displacing producer acquires no cause from its own declaration; the displaced use's owner is not flagged either.
  assert.deepEqual(causes(ledger, b.investigram('b')), []);
  assert.deepEqual(causes(ledger, a.investigram('a')), []);
  // Derived status leaves the recorded delivery history and content unchanged.
  assert.deepEqual(ledger.production(early.handle.id).deliveries.map(delivery => delivery.kind), ['association', 'item']);
  assert.equal(ledger.status.investigram(early.investigram('early')).method, 'postcode/contribution-status@1');
});

test('one acceptance batch does not union independent producers\' exposure', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const use = account(ledger, module, 'a').use('a', 'u');
  const reader = ledger.begin({ producer: agentic('reader') }), bystander = ledger.begin({ producer: agentic('bystander') });
  reader.association(use, { content: true });
  const item = (key: string) => ({ investigrams: [{ key, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: key } }] }] });
  const acceptance = ledger.accept([{ production: reader, contribution: item('read') }, { production: bystander, contribution: item('independent') }]);
  supersede(ledger, module, 'b', use);
  assert.equal(causes(ledger, submitted(acceptance, reader).investigram('read')).length, 1);
  assert.deepEqual(causes(ledger, submitted(acceptance, bystander).investigram('independent')), []);
  assert.deepEqual(ledger.production(bystander.id).deliveries, []);
});

test('references, read access, identity resolution and content shared through another use create no exposure path', () => {
  const ledger = createLedger(), discovery = discoverModule(ledger), module = discovery.entity('module');
  const a = account(ledger, module, 'a'), use = a.use('a', 'u'), item = a.item('a', 'p');
  // Reuse without acquisition: the reuser references the item but never received the source use.
  const reuser = submit(ledger, agentic('reuser'), [{ key: 'r', declarations: [{ key: 'u', operation: 'add', qualification: caveat,
    target: { kind: 'entity', entity: module, role: 'topic', topic: 'summary' }, members: [{ kind: 'item', item }] }] }]);
  // Receiving the bare item, without the association route, is not exposure to that use.
  const direct = account(ledger, module, 'direct', handle => { handle.item(item); });
  const productions = ledger.productions().length;
  // Answer assembly, browsing and host identity bookkeeping read retained information without a production.
  ledger.identifications(module); ledger.associations(admission(module), 'all'); ledger.item(item); ledger.status.association(use);
  ledger.native({ provider: 'typescript', rule: 'source-file', scope: 'project-1', key: 'breaker.ts' }); ledger.lookupName('breaker.ts');
  assert.equal(ledger.productions().length, productions);
  supersede(ledger, module, 'b', use);
  assert.deepEqual(causes(ledger, reuser.investigram('r')), []);
  assert.deepEqual(causes(ledger, direct.investigram('direct')), []);
  assert.deepEqual(ledger.production(reuser.handle.id).deliveries, []);
});

test('a mechanical producer that consumes retained information records it; independent discovery does not', () => {
  const ledger = createLedger(), discovery = discoverModule(ledger), module = discovery.entity('module');
  const identify = discovery.use('discovery', 'identify');
  const body = { rows: ['imports timer'], about: module };
  // Supplied the retained module identification as input.
  const consumer = submit(ledger, mechanical('test/dependencies@1'), handle => {
    handle.association(identify, { content: true });
    return [{ key: 'deps', qualification: derived, items: [{ key: 'edges', type: 'test-table', body }] }];
  });
  // Independently analyses source; host identity mapping alone delivers nothing.
  const independent = submit(ledger, mechanical('test/dependencies@1'), [{ key: 'deps2', qualification: derived,
    entities: [{ key: 'm', entityKind: 'module', native: { provider: 'typescript', rule: 'source-file', scope: 'project-1', key: 'breaker.ts' } }],
    items: [{ key: 'edges', type: 'test-table', body: { rows: ['imports timer'], about: { local: 'm' } } }] }]);
  assert.equal(independent.entity('m'), module);
  withdraw(ledger, 'w', identify);
  assert.equal(causes(ledger, consumer.investigram('deps')).length, 1);
  assert.deepEqual(causes(ledger, independent.investigram('deps2')), []);
  // The mechanical finding keeps its own method qualification either way.
  assert.equal(ledger.investigram(consumer.investigram('deps')).qualification?.status, 'mechanically-derived');
});

test('baseline identification context has a scope dependency; an exact description alone does not', () => {
  const ledger = createLedger(), discovery = discoverModule(ledger), module = discovery.entity('module');
  const withBaseline = account(ledger, module, 'baseline', handle => {
    const baseline = handle.baseline(module);
    assert.equal(baseline.entityKind, 'module');
    assert.deepEqual(baseline.identifications.map(item => item.address), [discovery.use('discovery', 'identify')]);
    assert.equal(baseline.identifications[0]!.content[0]!.item?.type, 'identification');
    assert.equal(baseline.identifications[0]!.owner.qualification?.status, 'mechanically-derived');
  });
  const exactOnly = account(ledger, module, 'exact', handle => { handle.association(discovery.use('discovery', 'identify'), { content: true }); });
  const added = submit(ledger, agentic('namer'), [{ key: 'i', qualification: caveat,
    items: [{ key: 'id', type: 'identification', body: { name: 'Recovery controller', nameOrigin: 'assigned', designation: 'Controls recovery' } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: module, role: 'identification' }, members: [local('i', 'id')] }] }]);
  const scope = { kind: 'entity', entity: module, role: 'identification' };
  assert.deepEqual(causes(ledger, withBaseline.investigram('baseline')).map(cause => [cause.change, cause.routes]),
    [[added.use('i', 'identify'), [{ kind: 'scope', scope, effect: 'addition', association: added.use('i', 'identify') }]]]);
  assert.deepEqual(causes(ledger, exactOnly.investigram('exact')), []);
  // An Entity with no standing identification has an explicit empty baseline selection, still recorded as a scope.
  withdraw(ledger, 'w1', discovery.use('discovery', 'identify')); withdraw(ledger, 'w2', added.use('i', 'identify'));
  const empty = ledger.begin({ producer: agentic() });
  assert.deepEqual(empty.baseline(module).identifications, []);
  assert.deepEqual(empty.deliveries.map(delivery => [delivery.kind, delivery.kind === 'scope' && delivery.listed.length]), [['scope', 0]]);
  ledger.abandon(empty, 'not-submitted');
});

test('inventories record their acquired scope and timing: additions, current-only withdrawals and refresh', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const scope = admission(module);
  const a = account(ledger, module, 'a'), b = account(ledger, module, 'b');
  const listings = new Map<string, readonly AssociationAddress[]>();
  const current = account(ledger, module, 'current', handle => { listings.set('current', handle.inventory(scope, 'current-only').listed); });
  const history = account(ledger, module, 'history', handle => { listings.set('history', handle.inventory(scope, 'all-history').listed); });
  assert.deepEqual(listings.get('current'), [a.use('a', 'u'), b.use('b', 'u')]);
  // Listing delivered no content.
  assert.deepEqual(ledger.production(current.handle.id).deliveries.map(delivery => delivery.kind), ['scope']);
  // Withdrawal of a listed, never-delivered association removes it from the current-only inventory only.
  const removal = withdraw(ledger, 'w', a.use('a', 'u')).use('w', 'w');
  const afterWithdrawal = (id: InvestigramId) => causes(ledger, id).filter(cause => cause.operation === 'withdraw');
  assert.deepEqual(afterWithdrawal(current.investigram('current')).map(cause => [cause.change, cause.routes, cause.standing]),
    [[removal, [{ kind: 'scope', scope, effect: 'removal', association: a.use('a', 'u') }], null]]);
  assert.deepEqual(afterWithdrawal(history.investigram('history')), []);
  // `current` and `history` themselves added uses within the scope after their own listing; those are their own declarations.
  // The later accounts are additions within both acquired scopes.
  const additions = (id: InvestigramId) => causes(ledger, id).filter(cause => cause.operation === 'add').map(cause => cause.change);
  assert.deepEqual(additions(current.investigram('current')), [history.use('history', 'u')]);
  assert.deepEqual(additions(history.investigram('history')), []);
  const c = account(ledger, module, 'c');
  assert.deepEqual(additions(history.investigram('history')), [c.use('c', 'u')]);
  // A first inventory acquired after those changes reflects them without any later-change concern.
  const fresh = account(ledger, module, 'fresh', handle => {
    assert.equal(handle.inventory(scope, 'current-only').listed.length, 4);
    assert.equal(handle.inventory(scope, 'all-history').listed.length, 5);
  });
  assert.deepEqual(causes(ledger, fresh.investigram('fresh')), []);
  // Refreshing an inventory neither clears an earlier cause nor delivers the newly listed content.
  const refresher = account(ledger, module, 'refresher', handle => {
    handle.inventory(scope, 'current-only');
    withdraw(ledger, 'w2', b.use('b', 'u'));
    handle.inventory(scope, 'current-only');
    assert.equal(handle.deliveries.every(delivery => delivery.kind === 'scope'), true);
    assert.equal(handle.pending().length, 1);
  });
  assert.deepEqual(causes(ledger, refresher.investigram('refresher')).map(cause => cause.routes.map(route => route.kind)), [['scope']]);
});

test('an exact change notice delivered before submission makes that change known, by every route', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a'), use = a.use('a', 'u');
  // An intermediate producer received the use; its account is later supplied to others.
  const middle = account(ledger, module, 'middle', handle => { handle.association(use, { content: true }); });
  const open = (model: string) => { const handle = ledger.begin({ producer: agentic(model) }); handle.association(use, { content: true }); handle.item(middle.item('middle', 'p')); return handle; };
  const noticed = open('noticed'), generic = open('generic'), unaware = open('unaware');
  const change = supersede(ledger, module, 'b', use).use('b', 'u');
  assert.deepEqual(noticed.pending().map(cause => [cause.change, cause.routes.map(route => route.kind)]), [[change, ['exact', 'inherited']]]);
  const notice = noticed.notify(change);
  assert.deepEqual(notice, { change, operation: 'supersede', displaces: [use], establishes: change });
  // The notice is recorded as a notice; it delivered no replacement content.
  assert.equal(noticed.deliveries.at(-1)!.kind, 'notice');
  assert.equal(noticed.deliveries.some(delivery => delivery.kind === 'item' && delivery.item.investigram === change.investigram), false);
  assert.deepEqual(noticed.pending(), []);
  // A refreshed listing is not a notice of the particular change.
  generic.inventory(admission(module), 'current-only');
  const body = (key: string) => ({ investigrams: [{ key, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: key } }] }] });
  const acceptance = ledger.accept([{ production: noticed, contribution: body('n') }, { production: generic, contribution: body('g') }, { production: unaware, contribution: body('u') }]);
  assert.deepEqual(causes(ledger, submitted(acceptance, noticed).investigram('n')), []);
  for (const [handle, key] of [[generic, 'g'], [unaware, 'u']] as const) {
    assert.deepEqual(causes(ledger, submitted(acceptance, handle).investigram(key)).map(cause => [cause.change, cause.routes.map(route => route.kind)]), [[change, ['exact', 'inherited']]]);
  }
  // The intermediate, completed contribution is not retrospectively cleared; a notice after submission is impossible.
  assert.equal(causes(ledger, middle.investigram('middle')).length, 1);
  assert.throws(() => unaware.notify(change), /concluded/);
  // An independent later cause still applies to the noticed producer.
  const second = withdraw(ledger, 'w', change).use('w', 'w');
  assert.deepEqual(causes(ledger, submitted(acceptance, noticed).investigram('n')).map(cause => cause.change), []);
  const middleCauses = causes(ledger, middle.investigram('middle'));
  assert.deepEqual(middleCauses.map(cause => [cause.change, cause.standing?.state ?? null]), [[change, 'displaced']]);
  assert.equal(second.declaration, 'w');
});

test('cause identity survives transitive propagation; known causes do not re-enter', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const use = account(ledger, module, 'a').use('a', 'u');
  const first = account(ledger, module, 'first', handle => { handle.association(use, { content: true }); });
  const second = account(ledger, module, 'second', handle => { handle.item(first.item('first', 'p')); });
  const third = account(ledger, module, 'third', handle => { handle.association(second.use('second', 'u'), { content: true }); });
  const change = supersede(ledger, module, 'b', use).use('b', 'u');
  const route = (id: InvestigramId) => causes(ledger, id).map(cause => [cause.change, cause.routes]);
  assert.deepEqual(route(first.investigram('first')), [[change, [{ kind: 'exact', association: use }]]]);
  assert.deepEqual(route(second.investigram('second')), [[change, [{ kind: 'inherited', from: first.investigram('first') }]]]);
  assert.deepEqual(route(third.investigram('third')), [[change, [{ kind: 'inherited', from: second.investigram('second') }]]]);
  // Received after the change was accepted: the concern is delivered as known context, not a later change.
  const after = account(ledger, module, 'after', handle => {
    const delivered = handle.item(second.item('second', 'p'));
    assert.deepEqual(delivered.owner.concerns.map(cause => cause.change), [change]);
  });
  assert.deepEqual(causes(ledger, after.investigram('after')), []);
  // B displaced A, then C displaces B: the earlier recipient of A keeps historical cause B, now itself displaced.
  const c = supersede(ledger, module, 'c', change).use('c', 'u');
  assert.deepEqual(causes(ledger, first.investigram('first')).map(cause => [cause.change, cause.standing]),
    [[change, { state: 'displaced', displacedBy: [c] }]]);
  assert.equal(ledger.standing(use).displacedBy.length, 1);
});

test('designation status separates standing, membership concerns and producing-context concerns', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const { invocation, result } = summaryInvocation(ledger, module);
  const summary = explainAdmission(ledger, module, result.id, invocation.id);
  const d1 = summary.use('summary', 'answer'), member = summary.use('summary', 'admission');
  assert.deepEqual(ledger.memberAssociations(d1), [member]);
  // A consumer receives the designation, without its member content.
  const consumer = account(ledger, module, 'consumer', handle => {
    const delivered = handle.designations(result.id);
    assert.deepEqual(delivered.map(item => [item.address, item.undeliveredMembers, item.content]), [[d1, [member], []]]);
  });
  // A later inquiry supplies fuller content, supersedes the admission use and explicitly redesignates the result.
  const revision = submit(ledger, agentic('reviser'), handle => {
    handle.association(d1); handle.association(member, { content: true });
    return [{ key: 'rev', qualification: caveat, items: [{ key: 'admission', type: 'prose', body: { text: 'Admission can wait for a probe slot.' } }],
      declarations: [
        { key: 'admission', operation: 'supersede', target: admission(module), members: [local('rev', 'admission')], displaces: [member], grounds: { text: 'Omitted waiting callers.' } },
        { key: 'answer', operation: 'supersede', target: { kind: 'result', result: result.id }, displaces: [d1], grounds: { text: 'The answer changed with the fuller admission account.' },
          members: [{ kind: 'association', association: { investigram: { local: 'rev' }, declaration: 'admission' } }] },
      ] }];
  });
  const d2 = revision.use('rev', 'answer'), fuller = revision.use('rev', 'admission');
  // D1 still selects its original member; it never silently contains the replacement.
  assert.deepEqual(ledger.association(d1).declaration.members, [{ kind: 'association', association: member }]);
  const oldStatus = ledger.status.association(d1);
  assert.deepEqual(oldStatus.standing, { state: 'displaced', displacedBy: [d2] });
  assert.deepEqual(oldStatus.membership.map(cause => [cause.change, cause.routes]), [[fuller, [{ kind: 'membership', association: member }]]]);
  // Its own displacement is standing, not a warning on itself; its producer received nothing later changed except the baseline scope.
  assert.deepEqual(oldStatus.producing, []);
  // D2 does not acquire the cause that created it, and is not flagged by its own declarations.
  const newStatus = ledger.status.association(d2);
  assert.deepEqual([newStatus.standing.state, newStatus.membership, newStatus.producing], ['standing', [], []]);
  assert.deepEqual(ledger.designations(result.id).map(entry => entry.address), [d2]);
  // The consumer of D1 needs reconsideration: D1 was displaced and its member changed after delivery.
  assert.deepEqual(causes(ledger, consumer.investigram('consumer')).map(cause => [cause.change, cause.routes.map(route => route.kind)]),
    [[fuller, ['membership']], [d2, ['exact', 'scope', 'scope']]]);
  // An independent later change to D2's member affects D2; a designation made after that displacement gets no invented later-change warning.
  const later = supersede(ledger, module, 'later', fuller).use('later', 'u');
  assert.deepEqual(ledger.status.association(d2).membership.map(cause => cause.change), [later]);
  const d3 = submit(ledger, agentic('historian'), [{ key: 'h', declarations: [{ key: 'answer', operation: 'add', qualification: caveat,
    target: { kind: 'result', result: result.id }, members: [{ kind: 'association', association: fuller }] }] }]).use('h', 'answer');
  assert.deepEqual(ledger.status.association(d3).membership, []);
  assert.equal(ledger.standing(fuller).state, 'displaced');
  // Content concerns of another owner's producer are exposed on the use, not as a global status on the item.
  assert.deepEqual(ledger.status.association(d3).content, []);
  const reuse = submit(ledger, agentic('reuse'), [{ key: 'x', declarations: [{ key: 'u', operation: 'add', qualification: caveat,
    target: { kind: 'entity', entity: module, role: 'topic', topic: 'consumer-view' }, members: [{ kind: 'item', item: consumer.item('consumer', 'p') }] }] }]).use('x', 'u');
  // The consumer's producer now also has the later designation D3 as an addition within its acquired result scope.
  assert.deepEqual(ledger.status.association(reuse).content.map(item => [item.investigram, item.producing.map(cause => cause.change)]),
    [[consumer.investigram('consumer'), [fuller, d2, d3]]]);
});

test('explicit-referent discovery returns handles without content exposure, and whole-investigram delivery is recorded per part', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a');
  const explained = submit(ledger, agentic('x'), [{ key: 'x', qualification: caveat, referents: [module],
    items: [{ key: 'p', type: 'prose', body: { text: 'Half-open admits one probe.' } }],
    options: [{ key: 'o', meaning: 'Examine probe admission.', request: { operation: 'examine', subjects: [{ subject: { kind: 'entity', entity: module } }] } }] }]);
  const finder = account(ledger, module, 'finder', handle => {
    assert.deepEqual(handle.discover(module), [explained.item('x', 'p')]);
  });
  const reader = account(ledger, module, 'reader', handle => {
    const whole = handle.investigram(a.investigram('a'));
    assert.deepEqual([whole.items.length, whole.declarations.length], [1, 1]);
    handle.metadata({ investigram: explained.investigram('x'), metadata: 'option', key: 'o' });
    // A bounded excerpt is disclosed as partial coverage, never as complete delivery.
    const excerpt = handle.item(explained.item('x', 'p'), { excerptCharacters: 12 });
    assert.deepEqual([excerpt.coverage, excerpt.item, excerpt.excerpt?.text.length, (excerpt.excerpt?.omittedCharacters ?? 0) > 0], ['excerpt', null, 12, true]);
  });
  assert.deepEqual(ledger.production(finder.handle.id).deliveries.map(delivery => delivery.kind), ['discovery']);
  assert.deepEqual(ledger.production(reader.handle.id).deliveries.map(delivery => delivery.kind), ['item', 'association', 'metadata', 'item']);
  const change = supersede(ledger, module, 'b', a.use('a', 'u')).use('b', 'u');
  assert.deepEqual(causes(ledger, finder.investigram('finder')), []);
  // The whole contribution included its association declaration: that exact use was received.
  assert.deepEqual(causes(ledger, reader.investigram('reader')).map(cause => cause.change), [change]);
});

test('a designation\'s recipient acquires member displacement through membership, without invented content delivery', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const { invocation, result } = summaryInvocation(ledger, module);
  const summary = explainAdmission(ledger, module, result.id, invocation.id);
  const d = summary.use('summary', 'answer'), a = summary.use('summary', 'admission'), content = summary.item('summary', 'admission');
  // An unrelated use of the same content.
  const unrelated = submit(ledger, agentic('other'), [{ key: 'o', declarations: [{ key: 'u', operation: 'add', qualification: caveat,
    target: { kind: 'entity', entity: module, role: 'topic', topic: 'overview' }, members: [{ kind: 'item', item: content }] }] }]).use('o', 'u');
  const open = (model: string, prepare: (handle: ProductionHandle) => void) => { const handle = ledger.begin({ producer: agentic(model) }); prepare(handle); return handle; };
  const recipient = open('recipient', handle => { handle.association(d); });
  const noticed = open('noticed', handle => { handle.association(d); });
  // Controls: an address-only listing of D, a discovery handle, and the same content through the unrelated use.
  const lister = open('lister', handle => { assert.deepEqual(handle.inventory({ kind: 'result', result: result.id }, 'all-history').listed, [d]); });
  const finder = open('finder', handle => { assert.deepEqual(handle.discover(module), [content]); });
  const viaOther = open('via-other', handle => { handle.association(unrelated, { content: true }); });
  const change = supersede(ledger, module, 'b', a).use('b', 'u');
  noticed.notify(change);
  // Received after the displacement: D's membership concern is delivered as known context.
  const late = open('late', handle => { assert.deepEqual(handle.association(d).status.membership.map(cause => cause.change), [change]); });
  const handles = [recipient, noticed, lister, finder, viaOther, late];
  const acceptance = ledger.accept(handles.map((production, index) => ({ production,
    contribution: { investigrams: [{ key: `k${index}`, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'x' } }] }] } })));
  const of = (index: number) => causes(ledger, submitted(acceptance, handles[index]!).investigram(`k${index}`));
  assert.deepEqual(of(0).map(cause => [cause.change, cause.routes]), [[change, [{ kind: 'membership', association: a }]]]);
  // Receiving the designation delivered neither its member's content nor the member use itself.
  assert.deepEqual(ledger.production(recipient.id).deliveries.map(delivery => delivery.kind), ['association']);
  for (const index of [1, 2, 3, 4, 5]) assert.deepEqual(of(index), [], `control ${index}`);
  assert.equal(ledger.standing(d).state, 'standing');
});

test('complete and bounded delivery both carry the item\'s own qualification, attribution and support', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const text = 'Admission is immediate while the breaker is closed and the probe budget is unused.';
  // One item is qualified only on the item; the other is narrower than its owner.
  const itemOnly = submit(ledger, agentic('a'), handle => { handle.supplied([evidenceRecord]); return [{ key: 'a', items: [{ key: 'p', type: 'prose', body: { text },
    referents: [module], evidence: [evidenceRecord], qualification: { limitations: ['Only configuration A.'] } }] }]; }).item('a', 'p');
  const narrower = submit(ledger, agentic('b'), [{ key: 'b', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text },
    support: [itemOnly], qualification: { scope: 'closed state', limitations: ['Sampled with one caller.'] } }] }]).item('b', 'p');
  const handle = ledger.begin({ producer: agentic('reader') });
  for (const options of [{}, { excerptCharacters: 20 }]) {
    const first = handle.item(itemOnly, options), second = handle.item(narrower, options);
    assert.deepEqual([first.owner.qualification, first.qualification?.status, first.qualification?.limitations, first.type], [null, 'interpretation', ['Only configuration A.'], 'prose']);
    assert.deepEqual([first.referents, first.evidence], [[module], [evidenceRecord]]);
    assert.deepEqual([second.owner.qualification?.limitations, second.qualification?.scope, second.qualification?.limitations, second.support],
      [caveat.limitations, 'closed state', ['Sampled with one caller.'], [itemOnly]]);
    assert.deepEqual([first.coverage, first.item === null, first.excerpt?.text.length], 'excerptCharacters' in options ? ['excerpt', true, 20] : ['complete', false, undefined]);
  }
  ledger.abandon(handle, 'not-submitted');
});

test('content delivered as a member of a use arrives with that use\'s known displacement context', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a'), use = a.use('a', 'u'), item = a.item('a', 'p');
  const withdrawal = withdraw(ledger, 'w', use).use('w', 'w');
  for (const options of [{}, { excerptCharacters: 5 }]) {
    const after = ledger.begin({ producer: agentic('after') });
    const delivered = after.member(use, item, options);
    // The displaced use is disclosed with its standing and the withdrawal's grounds; it is known context, not a later change.
    assert.deepEqual(delivered.association.status.standing, { state: 'displaced', displacedBy: [withdrawal] });
    assert.deepEqual(delivered.association.displacements.map(change => [change.change, change.declaration.operation === 'withdraw' && change.declaration.grounds.text]),
      [[withdrawal, 'Withdrawn by w.']]);
    assert.equal(delivered.association.declaration.qualification ?? delivered.association.owner.qualification, delivered.association.owner.qualification);
    assert.deepEqual([delivered.item.route, delivered.item.coverage], [use, 'excerptCharacters' in options ? 'excerpt' : 'complete']);
    assert.deepEqual(after.deliveries.map(delivery => delivery.kind), ['association', 'declaration', 'item']);
    assert.deepEqual(after.pending(), []);
    ledger.abandon(after, 'not-submitted');
  }
  // The bare item is independent of every use: no association context and no exact-use exposure.
  const bare = ledger.begin({ producer: agentic('bare') });
  assert.equal(bare.item(item).route, null);
  assert.deepEqual(bare.deliveries.map(delivery => delivery.kind), ['item']);
  assert.throws(() => bare.member(use, { investigram: item.investigram, item: 'absent' }), /Missing content item|not a member/);
  ledger.abandon(bare, 'not-submitted');
  // Supersession known at delivery is likewise disclosed; a displacement after delivery is a later cause instead.
  const b = account(ledger, module, 'b'), other = b.use('b', 'u');
  const before = ledger.begin({ producer: agentic('before') });
  assert.equal(before.member(other, b.item('b', 'p')).association.displacements.length, 0);
  const change = supersede(ledger, module, 'c', other).use('c', 'u');
  assert.deepEqual(before.pending().map(cause => [cause.change, cause.routes]), [[change, [{ kind: 'exact', association: other }]]]);
  const known = ledger.begin({ producer: agentic('known') });
  assert.deepEqual(known.member(other, b.item('b', 'p'), { excerptCharacters: 5 }).association.displacements.map(item => [item.change, item.standing?.state]), [[change, 'standing']]);
  assert.deepEqual(known.pending(), []);
});

test('recorded deliveries are owned immutable captures that a caller cannot rewrite', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a'), original = a.item('a', 'p'), use = a.use('a', 'u');
  const handle = ledger.begin({ producer: agentic('reader') });
  const address = { ...original }, route = { ...use }, scope = { kind: 'entity' as const, entity: module, role: 'topic' as const, topic: 'admission' as string | null };
  handle.item(address);
  handle.member(route, { ...original });
  const listing = handle.inventory(scope, 'current-only');
  // The caller changes its own objects and tries to change what it was handed back.
  address.item = 'never-delivered'; route.declaration = 'never-delivered'; scope.topic = 'other';
  assert.throws(() => { (handle.deliveries[0] as { item: { item: string } }).item.item = 'x'; }, TypeError);
  // Changing a returned listing does not reach the record, and the record itself is immutable.
  (listing.listed as unknown[]).push(route);
  assert.throws(() => { (handle.deliveries.at(-1) as unknown as { listed: unknown[] }).listed.push(route); }, TypeError);
  const reader = submitted(ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'r', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'x' } }] }] } }]), handle);
  const recorded = ledger.production(handle.id).deliveries;
  assert.deepEqual(recorded.map(delivery => delivery.kind), ['item', 'association', 'item', 'scope']);
  assert.deepEqual(recorded.flatMap(delivery => delivery.kind === 'item' ? [[delivery.item, delivery.route]] : []), [[original, null], [original, use]]);
  assert.deepEqual(recorded.flatMap(delivery => delivery.kind === 'scope' ? [[delivery.scope, delivery.listed]] : []),
    [[{ kind: 'entity', entity: module, role: 'topic', topic: 'admission' }, [use]]]);
  for (const delivery of recorded) if (delivery.kind === 'item') ledger.item(delivery.item);
  // The mutation neither invented nor removed a cause: displacing the received use is still exactly one cause.
  const change = supersede(ledger, module, 'b', use).use('b', 'u');
  assert.deepEqual(causes(ledger, reader.investigram('r')).map(cause => [cause.change, cause.routes.map(item => item.kind)]), [[change, ['exact', 'scope', 'scope']]]);
});

test('a change declaration actually delivered before submission is known, by every route', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a'), use = a.use('a', 'u');
  const middle = account(ledger, module, 'middle', handle => { handle.association(use, { content: true }); });
  const open = (model: string, inherited = false) => {
    const handle = ledger.begin({ producer: agentic(model) });
    if (inherited) handle.item(middle.item('middle', 'p')); else handle.association(use);
    return handle;
  };
  const redelivered = open('redelivered'), direct = open('direct'), inherited = open('inherited', true), listed = open('listed'), undisclosed = open('undisclosed');
  const scoped = ledger.begin({ producer: agentic('scoped') }), scopedOnly = ledger.begin({ producer: agentic('scoped-only') });
  for (const handle of [scoped, scopedOnly]) handle.inventory(admission(module), 'current-only');
  const change = withdraw(ledger, 'w', use).use('w', 'w');
  const added = account(ledger, module, 'added').use('added', 'u');
  for (const handle of [redelivered, direct, listed, undisclosed]) assert.deepEqual(handle.pending().map(cause => [cause.change, cause.routes.map(route => route.kind)]), [[change, ['exact']]]);
  assert.deepEqual(inherited.pending().map(cause => cause.routes.map(route => route.kind)), [['inherited']]);
  // Re-delivery discloses the withdrawal with its grounds; the declaration can also be acquired directly.
  const again = redelivered.association(use);
  assert.deepEqual(again.displacements.map(item => [item.change, item.declaration.operation === 'withdraw' && item.declaration.grounds.text]), [[change, 'Withdrawn by w.']]);
  assert.equal('change' in direct.declaration(change), true);
  // The inherited variant: the use arrives, with the change disclosed, only after the change.
  inherited.association(use);
  // A refreshed listing reflects the change without identifying it.
  listed.inventory(admission(module), 'current-only');
  // A later addition within an acquired scope is known once the new use itself is delivered, not when it is merely listed.
  scoped.association(added);
  scopedOnly.inventory(admission(module), 'current-only');
  const handles = [redelivered, direct, inherited, listed, undisclosed, scoped, scopedOnly];
  for (const handle of [redelivered, direct, inherited]) assert.deepEqual(handle.pending(), []);
  // The records stay distinguishable: these were content deliveries, not notices.
  assert.equal(handles.some(handle => handle.deliveries.some(delivery => delivery.kind === 'notice')), false);
  const acceptance = ledger.accept(handles.map((production, index) => ({ production,
    contribution: { investigrams: [{ key: `k${index}`, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'x' } }] }] } })));
  const of = (index: number) => causes(ledger, submitted(acceptance, handles[index]!).investigram(`k${index}`)).map(cause => [cause.change, cause.routes.map(route => route.kind)]);
  for (const index of [0, 1, 2]) assert.deepEqual(of(index), [], `disclosed ${index}`);
  for (const index of [3, 4]) assert.deepEqual(of(index), [[change, ['exact']]], `undisclosed ${index}`);
  assert.deepEqual(of(5), [[change, ['scope']]]);
  assert.deepEqual(of(6), [[change, ['scope']], [added, ['scope']]]);
  // The completed intermediate contribution is not retrospectively cleared.
  assert.equal(causes(ledger, middle.investigram('middle')).length, 1);
});

test('an association-establishing declaration is always delivered as an exact use', () => {
  const ledger = createLedger(), discovery = discoverModule(ledger), module = discovery.entity('module');
  const identify = discovery.use('discovery', 'identify');
  const { invocation, result } = summaryInvocation(ledger, module);
  const summary = explainAdmission(ledger, module, result.id, invocation.id);
  const d = summary.use('summary', 'answer'), member = summary.use('summary', 'admission');
  const viaDeclaration = ledger.begin({ producer: agentic('declaration') }), viaAssociation = ledger.begin({ producer: agentic('association') });
  const received = viaDeclaration.declaration(identify);
  assert.equal('status' in received && received.status.standing.state, 'standing');
  viaDeclaration.declaration(d); viaAssociation.association(identify); viaAssociation.association(d);
  assert.deepEqual(viaDeclaration.deliveries, viaAssociation.deliveries);
  const withdrawal = withdraw(ledger, 'w', identify).use('w', 'w'), change = supersede(ledger, module, 'b', member).use('b', 'u');
  // The designation's producer acquired the module's baseline identification scope, so the withdrawal also reaches its recipients as an inherited concern.
  const expected = [[withdrawal, ['exact', 'inherited']], [change, ['membership']]];
  for (const handle of [viaDeclaration, viaAssociation]) assert.deepEqual(handle.pending().map(cause => [cause.change, cause.routes.map(route => route.kind)]), expected);
  // A use that is already displaced arrives with the displacing grounds, not only their addresses.
  const late = ledger.begin({ producer: agentic('late') }), displaced = late.declaration(identify);
  assert.deepEqual('displacements' in displaced && displaced.displacements.map(item => [item.change, item.declaration.operation === 'withdraw' && item.declaration.grounds.text]),
    [[withdrawal, 'Withdrawn by w.']]);
  // A withdrawal establishes no use and is delivered as its grounds.
  const grounds = late.declaration(withdrawal);
  assert.deepEqual(['change' in grounds && grounds.standing, late.deliveries.map(delivery => delivery.kind)], [null, ['association', 'declaration', 'declaration']]);
  assert.deepEqual(late.pending(), []);
});

test('malformed acquisition requests are refused and record nothing', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a'), handle = ledger.begin({ producer: agentic('reader') });
  const scopes: unknown[] = [
    { kind: 'entity', entity: 'session:x:entity:0', role: 'any' }, { kind: 'result', result: 'session:x:query-result:0' },
    { kind: 'entity', entity: module, role: 'topic' }, { kind: 'entity', entity: module, role: 'topic', topic: '' },
    { kind: 'entity', entity: module, role: 'described' }, { kind: 'entity', entity: module }, { kind: 'investigram', entity: module, role: 'any' }, null,
  ];
  for (const scope of scopes) assert.throws(() => handle.inventory(scope as SelectionScope, 'current-only'), InvalidAcquisition, JSON.stringify(scope));
  assert.throws(() => handle.inventory({ kind: 'entity', entity: module, role: 'any' }, 'recent' as 'all-history'), InvalidAcquisition);
  assert.throws(() => handle.designations('session:x:query-result:0' as QueryResultId), InvalidAcquisition);
  assert.throws(() => handle.baseline('session:x:entity:0' as EntityId), InvalidAcquisition);
  for (const bound of [-5, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => handle.item(a.item('a', 'p'), { excerptCharacters: bound }), InvalidAcquisition);
    assert.throws(() => handle.member(a.use('a', 'u'), a.item('a', 'p'), { excerptCharacters: bound }), InvalidAcquisition);
  }
  // A refused request delivered nothing, so it recorded nothing: no use was exposed and no change made known.
  assert.deepEqual(handle.deliveries, []);
  // An explicit null topic selects every topic; an omitted key is not that request. A zero bound is a valid, fully disclosed excerpt.
  assert.deepEqual(handle.inventory({ kind: 'entity', entity: module, role: 'topic', topic: null }, 'current-only').listed, [a.use('a', 'u')]);
  const empty = handle.item(a.item('a', 'p'), { excerptCharacters: 0 });
  assert.deepEqual([empty.coverage, empty.excerpt?.text, (empty.excerpt?.omittedCharacters ?? 0) > 0], ['excerpt', '', true]);
});

test('displacement context for A references its replacement B without acquiring B; only actual acquisition of B makes a later displacement of B a cause', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a').use('a', 'u');
  const early = ledger.begin({ producer: agentic('early') });
  early.association(a);
  const superseding = supersede(ledger, module, 'b', a), b = superseding.use('b', 'u'), content = superseding.item('b', 'p');
  const open = (model: string) => { const handle = ledger.begin({ producer: agentic(model) }); return { handle, delivered: handle.association(a, { content: true }) }; };
  // Acquiring A after B superseded it: A arrives with B's qualified displacement context and a reference to B.
  const contextOnly = open('context-only'), context = contextOnly.delivered.displacements[0]!;
  assert.deepEqual([context.change, context.establishes, context.declaration.operation, context.declaration.operation === 'supersede' && context.declaration.displaces,
    context.declaration.operation === 'supersede' && context.declaration.grounds.text], [b, b, 'supersede', [a], 'Grounds b.']);
  // The explanation keeps its own provenance and qualification.
  assert.deepEqual([context.owner.investigram, context.owner.producer.agent?.model, context.owner.qualification?.status], [b.investigram, 'b', 'interpretation']);
  // What was recorded is A, A's content and B's declaration grounds: no use of B and none of B's content.
  assert.deepEqual(contextOnly.handle.deliveries.map(delivery => delivery.kind === 'item' ? [delivery.kind, delivery.item.investigram === a.investigram] : [delivery.kind,
    delivery.kind === 'association' ? delivery.association : delivery.kind === 'declaration' ? delivery.declaration : null]),
    [['association', a], ['declaration', b], ['item', true]]);
  // Others go on to actually acquire B: its use, its content as a member of that use, its bare content, or a listing containing it.
  const acquiredUse = open('use'), acquiredMember = open('member'), bareContent = open('bare'), listing = open('listing');
  acquiredUse.handle.association(b);
  acquiredMember.handle.member(b, content);
  bareContent.handle.item(content);
  listing.handle.inventory(admission(module), 'current-only');
  // C later displaces B.
  const c = supersede(ledger, module, 'c', b).use('c', 'u');
  const pending = (handle: ProductionHandle) => handle.pending().map(cause => [cause.change, cause.routes]);
  // The recipient of only A and its displacement context does not acquire C. A's displacement by B was known context.
  assert.deepEqual(pending(contextOnly.handle), []);
  // Receiving B's content apart from the use B is not exposure to that use either.
  assert.deepEqual(pending(bareContent.handle), []);
  // Actual acquisition of B, or another recorded path to it, makes C applicable.
  assert.deepEqual(pending(acquiredUse.handle), [[c, [{ kind: 'exact', association: b }]]]);
  assert.deepEqual(pending(acquiredMember.handle), [[c, [{ kind: 'exact', association: b }]]]);
  assert.deepEqual(pending(listing.handle), [[c, [
    { kind: 'scope', scope: admission(module), effect: 'addition', association: c }, { kind: 'scope', scope: admission(module), effect: 'removal', association: b }]]]);
  // The recipient of A from before B keeps the historical displacement of A as its cause; C is not a second one.
  assert.deepEqual(early.pending().map(cause => [cause.change, cause.standing]), [[b, { state: 'displaced', displacedBy: [c] }]]);
  assert.deepEqual(ledger.standing(a).displacedBy, [b]);
});

test('a change disclosed as a concern on a later delivery is known and does not re-enter by the earlier route', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a').use('a', 'u');
  const x = account(ledger, module, 'x', handle => { handle.association(a); });
  const { invocation, result } = summaryInvocation(ledger, module);
  const summary = explainAdmission(ledger, module, result.id, invocation.id), d = summary.use('summary', 'answer'), member = summary.use('summary', 'admission');
  const open = (prepare: (handle: ProductionHandle) => void) => { const handle = ledger.begin({ producer: agentic('p') }); prepare(handle); return handle; };
  // Inherited: P received X's item before the change. Membership: P received designation D before its member changed.
  const inherited = open(handle => { handle.item(x.item('x', 'p')); }), inheritedControl = open(handle => { handle.item(x.item('x', 'p')); });
  const membership = open(handle => { handle.association(d); }), membershipControl = open(handle => { handle.association(d); });
  const w = withdraw(ledger, 'w', a).use('w', 'w'), m = withdraw(ledger, 'm', member).use('m', 'w');
  const routes = (handle: ProductionHandle) => handle.pending().map(cause => [cause.change, cause.routes.map(route => route.kind)]);
  assert.deepEqual([routes(inherited), routes(membership)], [[[w, ['inherited']]], [[m, ['membership']]]]);
  // Received again: the concern is disclosed, identified exactly, and the record shows it.
  assert.deepEqual(inherited.item(x.item('x', 'p')).owner.concerns.map(cause => cause.change), [w]);
  assert.deepEqual(membership.association(d).status.membership.map(cause => cause.change), [m]);
  assert.deepEqual(inherited.deliveries.map(delivery => delivery.kind === 'item' && delivery.concerns), [[], [w]]);
  assert.deepEqual(membership.deliveries.map(delivery => delivery.kind === 'association' && delivery.concerns), [[], [m]]);
  assert.deepEqual([routes(inherited), routes(membership)], [[], []]);
  // No notice was needed, and none was recorded. The controls, shown nothing further, still have their causes.
  assert.equal([...inherited.deliveries, ...membership.deliveries].some(delivery => delivery.kind === 'notice'), false);
  const handles = [inherited, inheritedControl, membership, membershipControl];
  const acceptance = ledger.accept(handles.map((production, index) => ({ production,
    contribution: { investigrams: [{ key: `k${index}`, qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'x' } }] }] } })));
  const of = (index: number) => causes(ledger, submitted(acceptance, handles[index]!).investigram(`k${index}`)).map(cause => cause.change);
  assert.deepEqual([of(0), of(1), of(2), of(3)], [[], [w], [], [m]]);
});

test('retained history states the actual portion of each bounded delivery', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a'), item = a.item('a', 'p');
  const serialized = JSON.stringify(ledger.item(item).body);
  const acquire = (bound?: number) => {
    const handle = ledger.begin({ producer: agentic('reader') });
    const delivered = handle.item(item, bound === undefined ? {} : { excerptCharacters: bound });
    const concluded = ledger.abandon(handle, 'not-submitted').deliveries[0]!;
    return { delivered, record: concluded.kind === 'item' ? concluded : assert.fail() };
  };
  const one = acquire(1), nine = acquire(9), whole = acquire(), generous = acquire(serialized.length);
  // Distinct excerpts acquired at the same position stay distinguishable after conclusion.
  assert.notDeepEqual(one.record, nine.record);
  for (const [bound, { delivered, record }] of [[1, one], [9, nine]] as const) {
    assert.deepEqual([record.coverage, record.excerpt], ['excerpt', { deliveredCharacters: bound, omittedCharacters: serialized.length - bound }]);
    // The record recovers exactly the portion that arrived, without retaining a copy of the content.
    assert.equal(serialized.slice(0, record.excerpt!.deliveredCharacters), delivered.excerpt!.text);
    assert.equal(record.excerpt!.omittedCharacters, delivered.excerpt!.omittedCharacters);
  }
  for (const { delivered, record } of [whole, generous]) assert.deepEqual([record.coverage, record.excerpt, delivered.excerpt], ['complete', null, null]);
});

test('a further displacement shown only as standing and a reference is not an exact notice of that change', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const a = account(ledger, module, 'a').use('a', 'u');
  const b = supersede(ledger, module, 'b', a).use('b', 'u');
  // P actually acquires B while it stands, so a later displacement of B is a cause for P.
  const reference = ledger.begin({ producer: agentic('reference') }), noticed = ledger.begin({ producer: agentic('noticed') }), delivered = ledger.begin({ producer: agentic('delivered') });
  for (const handle of [reference, noticed, delivered]) handle.association(b);
  const c = supersede(ledger, module, 'c', b).use('c', 'u');
  // Acquiring A now shows B's displacement context, in which B's standing names C by reference only.
  const context = reference.association(a).displacements[0]!;
  assert.deepEqual([context.change, context.standing], [b, { state: 'displaced', displacedBy: [c] }]);
  assert.equal(reference.deliveries.some(delivery => JSON.stringify(delivery).includes(c.investigram)), false);
  // That reference states neither C's operation nor its grounds. C stays a cause until it is noticed exactly or actually delivered.
  noticed.notify(c);
  delivered.association(b);
  const routes = (handle: ProductionHandle) => handle.pending().map(cause => [cause.change, cause.routes.map(route => route.kind)]);
  assert.deepEqual([routes(reference), routes(noticed), routes(delivered)], [[[c, ['exact']]], [], []]);
});

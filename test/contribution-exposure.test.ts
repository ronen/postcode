import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ContributionLedger } from '../src/lib/contributions/ledger.js';
import type { AssociationAddress, EntityId, InvestigramId } from '../src/lib/contributions/model.js';
import type { ProductionHandle } from '../src/lib/contributions/production.js';
import { agentic, caveat, createLedger, discoverModule, explainAdmission, mechanical, derived, submit, submitted, summaryInvocation } from './contribution-helpers.js';
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

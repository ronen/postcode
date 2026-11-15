import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { EntityId, InvestigramId, SubmittedInvestigram } from '../src/lib/contributions/model.js';
import { agentic, caveat, contextRecord, createLedger, derived, discoverModule, evidenceRecord, mechanical, rejects, snapshot, submit, submitted } from './contribution-helpers.js';

const prose = (key: string, body: string) => ({ key, type: 'prose', body: { text: body } });
const local = (investigram: string, item: string) => ({ kind: 'item' as const, item: { investigram: { local: investigram }, item } });

test('provider identity resolves within its rule and scope before a common identity is allocated', () => {
  const ledger = createLedger();
  const first = discoverModule(ledger), module = first.entity('module');
  assert.equal(ledger.native({ provider: 'typescript', rule: 'source-file', scope: 'project-1', key: 'breaker.ts' }), module);
  assert.notEqual(module, 'breaker.ts');
  // The same native key in another scope is another Entity; names are not identity keys.
  const other = discoverModule(ledger, 'breaker.ts', 'project-2').entity('module');
  assert.notEqual(other, module);
  assert.equal(ledger.lookupName('breaker.ts').matches.length, 2);
  // A later producer naming the same native identity refers to the retained Entity and need not identify it again.
  const reused = submit(ledger, mechanical('test/dependencies@1'), [{ key: 'deps', qualification: derived,
    entities: [{ key: 'again', entityKind: 'module', native: { provider: 'typescript', rule: 'source-file', scope: 'project-1', key: 'breaker.ts' } }],
    items: [{ key: 'edges', type: 'test-table', body: { rows: ['imports timer'], about: { local: 'again' } } }] }]);
  assert.equal(reused.entity('again'), module);
  assert.equal(ledger.entities().length, 2);
  assert.deepEqual(ledger.referencing(module), [reused.item('deps', 'edges')]);
  assert.equal(ledger.entity(module).introducedBy, first.investigram('discovery'));
});

test('an explicitly introduced Entity receives a new identity and independent discoveries stay distinct', () => {
  const ledger = createLedger();
  const introduce = (key: string) => submit(ledger, agentic(), [{ key, qualification: caveat,
    entities: [{ key: 'state', entityKind: 'state' }],
    items: [{ key: 'id', type: 'identification', body: { name: 'Half-open', nameOrigin: 'assigned', designation: 'Probing state of the breaker' } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: { local: 'state' }, role: 'identification' }, members: [local(key, 'id')] }] }]);
  const a = introduce('first').entity('state'), b = introduce('second').entity('state');
  assert.notEqual(a, b);
  const lookup = ledger.lookupName('Half-open');
  assert.deepEqual(lookup.matches.map(match => match.entity), [a, b]);
  assert.equal(lookup.matches[0]!.name.origin, 'assigned');
  assert.equal(ledger.lookupName('Closed').matches.length, 0);
});

test('invalid submissions are rejected atomically with no partial accepted contribution', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const discovery = ledger.investigrams()[0]!.id;
  const valid: SubmittedInvestigram = { key: 'a', qualification: caveat, items: [prose('p', 'Valid content.')] };
  const cases: [RegExp, readonly unknown[], ReturnType<typeof agentic>?][] = [
    [/Unknown Entity reference/, [valid, { key: 'b', qualification: caveat, referents: ['session:none:entity'], items: [prose('p', 'x')] }]],
    [/Unknown local Entity key/, [{ ...valid, referents: [{ local: 'missing' }] }]],
    [/Unknown content item reference/, [{ ...valid, items: [{ ...prose('p', 'x'), support: [{ investigram: discovery, item: 'absent' }] }] }]],
    [/Unknown investigram reference/, [{ ...valid, items: [{ ...prose('p', 'x'), support: [{ investigram: 'session:x:investigram:0', item: 'name' }] }] }]],
    [/Duplicate investigram key/, [valid, valid]],
    [/Duplicate content item key/, [{ ...valid, items: [prose('p', 'x'), prose('p', 'y')] }]],
    [/Unsupported content type/, [{ ...valid, items: [{ key: 'p', type: 'state-model', body: {} }] }]],
    [/Expected nonempty prose text/, [{ ...valid, items: [prose('p', '  ')] }]],
    [/requires attributable qualification/, [{ key: 'a', items: [prose('p', 'x')] }]],
    [/cannot claim a stronger epistemic status/, [{ ...valid, qualification: { status: 'mechanically-derived', limitations: ['x'] } }]],
    [/cannot claim a stronger epistemic status/, [{ ...valid, qualification: { limitations: ['x'], guarantee: 'Exact.' } }]],
    [/cannot adopt a provider Claim context as its own/, [{ ...valid, qualification: { limitations: ['x'], contexts: [contextRecord] } }]],
    [/explicit epistemic status/, [{ ...valid, qualification: { limitations: ['x'] } }], mechanical()],
    [/Evidence must identify program material supplied/, [{ ...valid, items: [{ ...prose('p', 'x'), evidence: [evidenceRecord] }] }]],
    [/requires an identification association/, [{ ...valid, entities: [{ key: 'state', entityKind: 'state' }] }]],
    [/cannot be reidentified/, [{ ...valid, entities: [{ key: 'm', entityKind: 'group', native: { provider: 'typescript', rule: 'source-file', scope: 'project-1', key: 'breaker.ts' } }] }]],
    [/requires identifying content/, [{ ...valid, declarations: [{ key: 'd', operation: 'add', target: { kind: 'entity', entity: module, role: 'identification' }, members: [local('a', 'p')] }] }]],
    [/Invalid Entity information role/, [{ ...valid, declarations: [{ key: 'd', operation: 'add', target: { kind: 'entity', entity: module, role: 'result' }, members: [local('a', 'p')] }] }]],
    [/never an Entity role/, [{ ...valid, declarations: [{ key: 'd', operation: 'add', target: { kind: 'result', entity: module, result: 'x' }, members: [local('a', 'p')] }] }]],
    [/Unknown Query result reference/, [{ ...valid, declarations: [{ key: 'd', operation: 'add', target: { kind: 'result', result: 'session:x:query-result:0' }, members: [local('a', 'p')] }] }]],
    [/at least one exact member/, [{ ...valid, declarations: [{ key: 'd', operation: 'add', target: { kind: 'entity', entity: module, role: 'topic', topic: 't' }, members: [] }] }]],
    [/must contribute content, declarations or qualified metadata/, [{ key: 'a', qualification: caveat }]],
    [/Unexpected investigram field/, [{ ...valid, children: [] }]],
    [/already established/, [{ ...valid, qualification: derived, providerKey: 'discovery project-1 breaker.ts' }], mechanical()],
  ];
  for (const [message, investigrams, producer] of cases) rejects(ledger, producer ?? agentic(), investigrams, message);
  // A later valid item in the same pool does not rescue, and is not retained from, a rejected pool.
  assert.equal(ledger.investigrams().length, 1);
  // Evidence is eligible once actually supplied to that production.
  const supplied = submit(ledger, agentic(), handle => { handle.supplied([evidenceRecord]); return [{ ...valid, items: [{ ...prose('p', 'x'), evidence: [evidenceRecord] }] }]; });
  assert.deepEqual(ledger.production(supplied.handle.id).evidence, [evidenceRecord]);
  assert.equal(ledger.item(supplied.item('a', 'p')).qualification, null);
  assert.equal(ledger.investigram(supplied.investigram('a')).qualification?.status, 'interpretation');
});

test('a contribution without investigrams requires a producer report, and a concluded production accepts nothing further', () => {
  const ledger = createLedger(), handle = ledger.begin({ producer: agentic() });
  assert.throws(() => ledger.accept([{ production: handle, contribution: { investigrams: [] } }]), /requires a producer report/);
  ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'a', qualification: caveat, items: [prose('p', 'x')] }] } }]);
  assert.throws(() => ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'late', qualification: caveat, items: [prose('p', 'x')] }] } }]), /not open/);
  assert.throws(() => handle.inventory({ kind: 'entity', entity: 'x' as EntityId, role: 'any' }, 'all-history'));
  assert.throws(() => handle.supplied([evidenceRecord]), /concluded/);
});

test('items without any association remain owned, addressable and available for a later qualified use', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const notes = submit(ledger, agentic(), [{ key: 'notes', qualification: caveat, referents: [module],
    items: [{ ...prose('states', 'Established states: Closed, Open, Half-open.'), qualification: { limitations: ['Sampled configuration only.'] } }] }]);
  const address = notes.item('notes', 'states');
  assert.equal(ledger.investigram(address.investigram).declarations.length, 0);
  assert.equal(ledger.associations({ kind: 'entity', entity: module, role: 'any' }, 'all').length, 1);
  assert.deepEqual(ledger.referencing(module), [address]);
  // A later investigation acquires the item and establishes a use without copying it or taking ownership.
  const organizer = submit(ledger, agentic('scripted-b'), handle => {
    assert.equal(handle.item(address).item?.qualification?.limitations[0], 'Sampled configuration only.');
    return [{ key: 'organize', declarations: [{ key: 'states', operation: 'add', qualification: { limitations: ['Organizing judgment only.'] },
      target: { kind: 'entity', entity: module, role: 'topic', topic: 'states' }, members: [{ kind: 'item', item: address }] }] }];
  });
  const use = ledger.association(organizer.use('organize', 'states'));
  assert.equal(ledger.investigram(organizer.investigram('organize')).items.length, 0);
  assert.deepEqual(use.declaration.members, [{ kind: 'item', item: address }]);
  assert.equal(ledger.item(address).qualification?.limitations[0], 'Sampled configuration only.');
  assert.equal(ledger.production(use.owner.production).producer.agent?.model, 'scripted-b');
  assert.equal(ledger.production(ledger.investigram(address.investigram).production).producer.agent?.model, 'scripted-a');
});

test('addition, supersession and withdrawal change the standing of exact uses only', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const topic = { kind: 'entity' as const, entity: module, role: 'topic' as const, topic: 'admission' };
  const first = submit(ledger, agentic(), [{ key: 'a', qualification: caveat, items: [prose('p', 'Admission is immediate.'), prose('q', 'Timer resets the breaker.')],
    declarations: [{ key: 'admission', operation: 'add', target: topic, members: [local('a', 'p')] },
      { key: 'timing', operation: 'add', target: { ...topic, topic: 'timing' }, members: [local('a', 'q')] }] }]);
  const original = first.use('a', 'admission'), timing = first.use('a', 'timing');
  const before = JSON.stringify(ledger.investigram(first.investigram('a')));
  const second = submit(ledger, agentic('scripted-b'), [{ key: 'b', qualification: caveat, items: [prose('p', 'Admission can wait for a probe slot.')],
    declarations: [{ key: 'admission', operation: 'supersede', target: topic, members: [local('b', 'p')], displaces: [original],
      grounds: { text: 'The earlier account omitted waiting callers.', support: [first.item('a', 'p')] } }] }]);
  const replacement = second.use('b', 'admission');
  assert.equal(ledger.standing(original).state, 'displaced');
  assert.deepEqual(ledger.standing(original).displacedBy, [replacement]);
  assert.equal(ledger.standing(original, first.acceptance.position).state, 'standing');
  // The unspecified use, the content and the owning investigram are untouched; nothing is globally superseded.
  assert.equal(ledger.standing(timing).state, 'standing');
  assert.equal(JSON.stringify(ledger.investigram(first.investigram('a'))), before);
  assert.deepEqual(ledger.associations(topic, 'current').map(entry => entry.address), [replacement]);
  assert.deepEqual(ledger.associations(topic, 'all').map(entry => entry.address), [original, replacement]);
  // Withdrawing the replacement does not reinstate its predecessor.
  const third = submit(ledger, agentic('scripted-c'), [{ key: 'c', declarations: [{ key: 'retract', operation: 'withdraw', qualification: caveat,
    displaces: [replacement], grounds: { text: 'The probe-slot account relied on a misread guard.' } }] }]);
  assert.deepEqual(ledger.associations(topic, 'current'), []);
  assert.equal(ledger.standing(original).state, 'displaced');
  assert.equal(ledger.declaration(third.use('c', 'retract')).operation, 'withdraw');
  assert.throws(() => ledger.association(third.use('c', 'retract')), /establishes no association/);
  // Explicit re-adoption is a new addition referencing the earlier content with current grounds; no old use is reinstated.
  const fourth = submit(ledger, agentic('scripted-d'), [{ key: 'd', declarations: [{ key: 'readopt', operation: 'add', qualification: caveat, target: topic,
    members: [{ kind: 'item', item: first.item('a', 'p') }], grounds: { text: 'Re-examined: immediate admission holds for the closed state.' } }] }]);
  assert.deepEqual(ledger.associations(topic, 'current').map(entry => entry.address), [fourth.use('d', 'readopt')]);
  assert.equal(ledger.standing(original).state, 'displaced');
});

test('displacement requires exact earlier uses of the same target and role, with qualified grounds', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const identify = ledger.identifications(module)[0]!.address;
  const topic = { kind: 'entity', entity: module, role: 'topic', topic: 'admission' };
  const base = { key: 'b', qualification: caveat, items: [prose('p', 'x')] };
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'd', operation: 'supersede', target: topic, members: [local('b', 'p')], displaces: [identify], grounds: { text: 'g' } }] }], /same target and role/);
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'd', operation: 'withdraw', displaces: [identify] }] }], /require attributable qualified grounds/);
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'd', operation: 'withdraw', displaces: [], grounds: { text: 'g' } }] }], /at least one exact earlier association/);
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'd', operation: 'withdraw', displaces: [identify, identify], grounds: { text: 'g' } }] }], /Duplicate displaced association/);
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'a', operation: 'add', target: topic, members: [local('b', 'p')] },
    { key: 'd', operation: 'withdraw', displaces: [{ investigram: { local: 'b' }, declaration: 'a' }], grounds: { text: 'g' } }] }], /must predate this acceptance/);
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'a', operation: 'add', target: topic, members: [local('b', 'p')], displaces: [identify] }] }], /An addition displaces nothing/);
  const withdrawn = submit(ledger, agentic(), [{ key: 'w', declarations: [{ key: 'w', operation: 'withdraw', qualification: caveat, displaces: [identify], grounds: { text: 'g' } }] }]);
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'd', operation: 'withdraw', displaces: [withdrawn.use('w', 'w')], grounds: { text: 'g' } }] }], /Expected a reference to an association use/);
  rejects(ledger, agentic(), [{ ...base, declarations: [{ key: 'd', operation: 'add', target: topic, members: [{ kind: 'association', association: identify }] }] }], /Only a result designation/);
});

test('competing supersessions remain distinct alternatives without production-time priority', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const topic = { kind: 'entity' as const, entity: module, role: 'topic' as const, topic: 'admission' };
  const first = submit(ledger, agentic(), [{ key: 'a', qualification: caveat, items: [prose('p', 'x')], declarations: [{ key: 'u', operation: 'add', target: topic, members: [local('a', 'p')] }] }]);
  const compete = (key: string) => submit(ledger, agentic(key), [{ key, qualification: caveat, items: [prose('p', `Account ${key}.`)],
    declarations: [{ key: 'u', operation: 'supersede', target: topic, members: [local(key, 'p')], displaces: [first.use('a', 'u')], grounds: { text: `Grounds ${key}.` } }] }]).use(key, 'u');
  const left = compete('left'), right = compete('right');
  assert.deepEqual(ledger.associations(topic, 'current').map(entry => entry.address), [left, right]);
  assert.deepEqual(ledger.standing(first.use('a', 'u')).displacedBy, [left, right]);
  // Repeated enumeration is stable for the same retained information.
  assert.deepEqual(ledger.associations(topic, 'current'), ledger.associations(topic, 'current'));
});

test('an organizing judgment accepted with an independent finding keeps separate ownership, method and status', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const finder = ledger.begin({ producer: mechanical('test/exports@1') }), organizer = ledger.begin({ producer: mechanical('test/organizing-policy@1') });
  const acceptance = ledger.accept([
    { production: finder, contribution: { investigrams: [{ key: 'finding', qualification: derived, items: [{ key: 'exports', type: 'test-table', body: { rows: ['open', 'close'], about: module } }] }] } },
    { production: organizer, contribution: { investigrams: [{ key: 'policy', declarations: [{ key: 'use', operation: 'add',
      qualification: { status: 'organizing-policy', limitations: ['Deterministic wrapper policy; not a finding about the module.'] },
      target: { kind: 'entity', entity: module, role: 'topic', topic: 'exports' }, members: [local('finding', 'exports')] }] }] } },
  ]);
  const found = submitted(acceptance, finder), organized = submitted(acceptance, organizer);
  const use = ledger.association(organized.use('policy', 'use'));
  assert.equal(use.declaration.qualification?.status, 'organizing-policy');
  assert.equal(use.declaration.qualification?.method, 'test/organizing-policy@1');
  const item = ledger.item(found.item('finding', 'exports'));
  assert.equal(ledger.investigram(found.investigram('finding')).qualification?.status, 'mechanically-derived');
  assert.equal(ledger.investigram(found.investigram('finding')).qualification?.method, 'test/exports@1');
  assert.deepEqual(item.components, ['open', 'close']);
  assert.equal(ledger.investigram(found.investigram('finding')).position, ledger.investigram(organized.investigram('policy')).position);
  assert.notEqual(ledger.investigram(found.investigram('finding')).production, ledger.investigram(organized.investigram('policy')).production);
});

test('exact identity and method-specific identification survive interpreted identification and withdrawal', () => {
  const ledger = createLedger(), discovery = discoverModule(ledger), module = discovery.entity('module');
  const mechanicalUse = discovery.use('discovery', 'identify');
  const interpreted = submit(ledger, agentic(), [{ key: 'i', qualification: caveat,
    items: [{ key: 'id', type: 'identification', body: { name: 'Recovery controller', nameOrigin: 'assigned', designation: 'Controls recovery after failures' } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: module, role: 'identification' }, members: [local('i', 'id')] }] }]);
  // General current identification returns every standing alternative; the method-specific answer keeps its own finding.
  assert.deepEqual(ledger.identifications(module).map(entry => entry.address), [mechanicalUse, interpreted.use('i', 'identify')]);
  assert.deepEqual(ledger.identifications(module, { method: 'test/module-discovery@1' }).map(entry => entry.address), [mechanicalUse]);
  submit(ledger, agentic('scripted-b'), [{ key: 'w', declarations: [{ key: 'w', operation: 'withdraw', qualification: caveat, displaces: [mechanicalUse],
    grounds: { text: 'The file name does not describe the responsibility.' } }] }]);
  assert.equal(ledger.entity(module).id, module);
  assert.deepEqual(ledger.identifications(module).map(entry => entry.address), [interpreted.use('i', 'identify')]);
  const retained = ledger.identifications(module, { standing: 'all', method: 'test/module-discovery@1' });
  assert.deepEqual(retained.map(entry => entry.address), [mechanicalUse]);
  assert.equal((ledger.item(discovery.item('discovery', 'name')).body as { name: string }).name, 'breaker.ts');
  assert.equal(ledger.standing(mechanicalUse).state, 'displaced');
  // A displaced name still locates its Entity when history is requested, with its standing; it is not a current name.
  assert.equal(ledger.lookupName('breaker.ts').matches.length, 0);
  const historical = ledger.lookupName('breaker.ts', { history: true });
  assert.deepEqual(historical.matches.map(match => [match.entity, match.standing.state]), [[module, 'displaced']]);
  assert.equal(ledger.lookupName('Recovery controller').matches[0]!.entity, module);
  // Equivalent recomputation recognizes the established contribution rather than renewing the withdrawn use.
  assert.equal(ledger.established('discovery project-1 breaker.ts'), discovery.investigram('discovery'));
});

test('inconsistency reports target exact content or uses and displace nothing', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const topic = { kind: 'entity' as const, entity: module, role: 'topic' as const, topic: 'admission' };
  const account = (key: string, body: string) => submit(ledger, agentic(key), [{ key, qualification: caveat, items: [prose('p', body), prose('other', 'Unrelated sibling.')],
    declarations: [{ key: 'u', operation: 'add', target: topic, members: [local(key, 'p')] }] }]);
  const a = account('a', 'Admission is immediate.'), b = account('b', 'Admission waits for a slot.');
  const endpoints = [{ kind: 'item' as const, item: a.item('a', 'p') }, { kind: 'association' as const, association: b.use('b', 'u') }];
  rejects(ledger, agentic(), [{ key: 'r', qualification: caveat, inconsistencies: [{ key: 'c', endpoints: endpoints.slice(0, 1), grounds: { text: 'g' } }] }], /at least two exact/);
  rejects(ledger, agentic(), [{ key: 'r', qualification: caveat, inconsistencies: [{ key: 'c', endpoints }] }], /qualified grounds/);
  rejects(ledger, agentic(), [{ key: 'r', qualification: caveat, inconsistencies: [{ key: 'c', endpoints: [{ kind: 'investigram', investigram: a.investigram('a') }, endpoints[0]], grounds: { text: 'g' } }] }], /Invalid member kind|Unexpected member field/);
  const report = submit(ledger, agentic('reporter'), [{ key: 'r', qualification: caveat,
    inconsistencies: [{ key: 'conflict', endpoints, grounds: { text: 'The accounts disagree about whether a caller can wait.' } }] }]);
  const address = { investigram: report.investigram('r'), metadata: 'inconsistency' as const, key: 'conflict' };
  assert.deepEqual(ledger.inconsistencies(endpoints[0]!), [address]);
  assert.deepEqual(ledger.inconsistencies(endpoints[1]!), [address]);
  assert.deepEqual(ledger.inconsistencies({ kind: 'item', item: a.item('a', 'other') }), []);
  assert.deepEqual(ledger.status.association(b.use('b', 'u')).inconsistencies, [address]);
  assert.deepEqual(ledger.status.investigram(a.investigram('a')).inconsistencies, [address]);
  assert.deepEqual(ledger.associations(topic, 'current').map(entry => entry.address), [a.use('a', 'u'), b.use('b', 'u')]);
  // The report created no exposure: its producer received nothing.
  assert.deepEqual(ledger.production(report.handle.id).deliveries, []);
});

test('follow-up options and illustrations are qualified metadata owned by their investigram', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const owner = submit(ledger, agentic(), [{ key: 'a', qualification: caveat,
    items: [{ key: 'states', type: 'test-table', body: { rows: ['Closed', 'Open'], about: module } }],
    options: [{ key: 'probe', meaning: 'Investigate how the Open state admits a probe request.', references: [local('a', 'states')],
      request: { operation: 'examine', subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'a' }, item: 'states' }, component: 'Open' } }], resultContract: 'state-diagram' } }],
    illustrations: [{ key: 'picture', diagramType: 'state-transition', inputs: [{ investigram: { local: 'a' }, item: 'states' }] }] }]);
  const id = owner.investigram('a');
  const option = ledger.metadata({ investigram: id, metadata: 'option', key: 'probe' });
  assert.deepEqual('request' in option && option.request.subjects, [{ role: null, subject: { kind: 'content', item: { investigram: id, item: 'states' }, component: 'Open' } }]);
  assert.equal('request' in option && option.request.resultContract, 'state-diagram');
  assert.equal(ledger.investigram(id).illustrations[0]!.diagramType, 'state-transition');
  rejects(ledger, agentic(), [{ key: 'b', qualification: caveat, items: [{ key: 's', type: 'test-table', body: { rows: ['Closed'] } }],
    options: [{ key: 'o', meaning: 'm', request: { operation: 'examine', subjects: [{ subject: { kind: 'content', item: { investigram: { local: 'b' }, item: 's' }, component: 'Open' } }] } }] }], /Unknown content component/);
  rejects(ledger, agentic(), [{ key: 'b', qualification: caveat, illustrations: [{ key: 'i', diagramType: 'state-transition', inputs: [] }] }], /exact primary content inputs/);
  assert.throws(() => ledger.metadata({ investigram: id as InvestigramId, metadata: 'option', key: 'absent' }), /Missing option/);
  assert.equal(snapshot(ledger).includes('probe'), true);
});

test('a supersession may replace a topical use with a differently named topic; structure does not judge their equivalence', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  const first = submit(ledger, agentic(), [{ key: 'a', qualification: caveat, items: [prose('p', 'Admission is immediate.')],
    declarations: [{ key: 'u', operation: 'add', target: { kind: 'entity', entity: module, role: 'topic', topic: 'admission' }, members: [local('a', 'p')] }] }]);
  const renamed = submit(ledger, agentic('b'), [{ key: 'b', qualification: caveat, items: [prose('p', 'Probe scheduling decides admission.')],
    declarations: [{ key: 'u', operation: 'supersede', target: { kind: 'entity', entity: module, role: 'topic', topic: 'probe-scheduling' }, members: [local('b', 'p')],
      displaces: [first.use('a', 'u')], grounds: { text: 'Admission is better described as probe scheduling.' } }] }]);
  assert.deepEqual(ledger.standing(first.use('a', 'u')).displacedBy, [renamed.use('b', 'u')]);
  assert.deepEqual(ledger.associations({ kind: 'entity', entity: module, role: 'topic', topic: null }, 'current').map(entry => entry.address), [renamed.use('b', 'u')]);
  assert.deepEqual(ledger.associations({ kind: 'entity', entity: module, role: 'topic', topic: 'admission' }, 'current'), []);
});

test('agentic reuse of mechanical content keeps the source qualification with the source and inherits no guarantee', () => {
  const ledger = createLedger(), module = discoverModule(ledger).entity('module');
  // A mechanical finding whose own Claim context is retained as a provider record.
  const finding = submit(ledger, mechanical('test/exports@1'), [{ key: 'f', items: [{ key: 'exports', type: 'test-table', body: { rows: ['open'], about: module },
    qualification: { status: 'mechanically-derived', guarantee: 'Every listed export is real.', contexts: [contextRecord] } }] }]);
  const source = finding.item('f', 'exports');
  // The agent receives the finding with its qualification, is supplied the context record as evidence, and reuses both.
  const reuse = submit(ledger, agentic(), handle => {
    const delivered = handle.item(source);
    assert.deepEqual([delivered.item?.qualification?.status, delivered.item?.qualification?.contexts], ['mechanically-derived', [contextRecord]]);
    handle.supplied([contextRecord]);
    return [{ key: 'r', qualification: caveat,
      items: [{ ...prose('reading', 'The single export suggests a narrow public surface.'), evidence: [contextRecord], support: [source] }],
      declarations: [{ key: 'surface', operation: 'add', target: { kind: 'entity', entity: module, role: 'topic', topic: 'surface' },
        members: [{ kind: 'item', item: source }, local('r', 'reading')] }] }];
  });
  const owner = ledger.investigram(reuse.investigram('r')), reading = ledger.item(reuse.item('r', 'reading'));
  // The agent's own claim and organizing use are interpretation with no guarantee and no adopted context.
  assert.deepEqual([owner.qualification?.status, owner.qualification?.guarantee, owner.qualification?.contexts], ['interpretation', null, []]);
  assert.deepEqual([reading.evidence, reading.support], [[contextRecord], [source]]);
  // The reused finding is still owned and qualified by its mechanical producer, unchanged.
  const reused = ledger.item(source);
  assert.deepEqual([reused.qualification?.status, reused.qualification?.method, reused.qualification?.guarantee, reused.qualification?.contexts],
    ['mechanically-derived', 'test/exports@1', 'Every listed export is real.', [contextRecord]]);
  assert.equal(ledger.association(reuse.use('r', 'surface')).owner.id, reuse.investigram('r'));
});

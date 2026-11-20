import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { canonical } from '../src/lib/identity.js';
import { ContentCatalog, identificationContract, proseContract } from '../src/lib/contributions/catalog.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import { moduleEntity, sessionLedger } from '../src/lib/contributions/modules.js';
import { nativeEntity, nativeFindingRecords } from '../src/lib/contributions/native.js';
import { nativeIdentity, programProviderIdentityAuthority } from '../src/lib/contributions/native-identity.js';
import type { NativeIdentity, SubmittedInvestigram } from '../src/lib/contributions/model.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { recordModuleEvaluation } from '../src/lib/evaluation.js';
import { agentic, caveat, derived, mechanical, session, snapshot, submit } from './contribution-helpers.js';
import { discover } from './helpers.js';

const namespace = { provider: 'controlled-provider', rule: 'controlled-rule', scope: 'controlled-scope' };
const identity = { ...namespace, key: 'one' };
const introduction = (native: NativeIdentity): SubmittedInvestigram => ({ key: 'introduced', qualification: caveat,
  entities: [{ key: 'thing', entityKind: 'module', native }],
  items: [{ key: 'name', type: 'identification', body: { name: 'Thing', nameOrigin: 'assigned', designation: 'A controlled provider Entity.' } }],
  declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: { local: 'thing' }, role: 'identification' },
    members: [{ kind: 'item', item: { investigram: { local: 'introduced' }, item: 'name' } }] }] });
const catalog = () => new ContentCatalog([identificationContract, proseContract]);

test('native authority defaults to denial and is checked per production and namespace before atomic acceptance', () => {
  const credential = Object.freeze({ provider: namespace.provider });
  const host = () => new ContributionLedger({ session, catalog: catalog(),
    authorizesNativeIdentity: (authority, { key: _key, ...requested }) => authority === credential && canonical(requested) === canonical(namespace) });
  const ledger = host(), denied = new ContributionLedger({ session, catalog: catalog() });
  for (const [target, authority, native] of [
    [denied, credential, identity], [ledger, undefined, identity], [ledger, Object.freeze({ ...credential }), identity],
    ...['provider', 'rule', 'scope'].map(field => [ledger, credential, { ...identity, [field]: 'another' }] as const),
  ] as const) {
    for (const producer of [agentic(), mechanical('controlled-provider')]) {
      const handle = target.begin({ producer, nativeIdentityAuthority: authority });
      const valid = target.begin({ producer: agentic() });
      const before = snapshot(target);
      assert.throws(() => target.accept([
        { production: valid, contribution: { investigrams: [{ key: 'valid', qualification: caveat, items: [{ key: 'p', type: 'prose', body: { text: 'This must not be partly retained.' } }] }] } },
        { production: handle, contribution: { investigrams: [{ ...introduction(native), qualification: producer.mechanism === 'mechanical' ? derived : caveat }] } },
      ]), /host-established authority/);
      assert.equal(snapshot(target), before);
      assert.equal(target.native(native), undefined);
      assert.equal(handle.closed, false);
      assert.equal(valid.closed, false);
    }
  }
  // An authorized member of a pool does not lend its authority to the other member,
  // including when the latter repeats the exact tuple staged earlier in that pool.
  const authorized = ledger.begin({ producer: agentic(), nativeIdentityAuthority: credential });
  const unauthorized = ledger.begin({ producer: mechanical() });
  const before = snapshot(ledger);
  assert.throws(() => ledger.accept([
    { production: authorized, contribution: { investigrams: [introduction(identity)] } },
    { production: unauthorized, contribution: { investigrams: [{ key: 'borrowed', qualification: caveat, entities: [{ key: 'other', entityKind: 'module', native: identity }] }] } },
  ]), /host-established authority/);
  assert.equal(snapshot(ledger), before);
  // The registered credential succeeds even for an agentic producer: the mechanism label grants no authority.
  const accepted = ledger.accept([{ production: authorized, contribution: { investigrams: [introduction(identity)] } }]);
  assert.equal(ledger.native(identity), accepted.productions[0]!.entities.thing);
  assert.deepEqual(structuredClone(ledger.productions()), ledger.productions(), 'Credentials never enter retained production records');
});

test('other producers reuse common Entities, add and challenge information without acquiring native authority', () => {
  const credential = Symbol('host provider');
  const ledger = new ContributionLedger({ session, catalog: catalog(), authorizesNativeIdentity: authority => authority === credential });
  const provider = submit(ledger, agentic(), [introduction(identity)], { nativeIdentityAuthority: credential });
  const entity = provider.entity('thing'), identification = provider.use('introduced', 'identify');
  const before = ledger.entity(entity);
  assert.throws(() => submit(ledger, mechanical(), [{ ...introduction(identity), qualification: derived }]), /host-established authority/, 'A known tuple still requires authority; other producers use its common ID');
  const extension = submit(ledger, agentic(), [{ key: 'challenge', qualification: caveat, referents: [entity],
    items: [{ key: 'p', type: 'prose', body: { text: 'A different account of this same Entity.' } }],
    declarations: [{ key: 'extend', operation: 'add', target: { kind: 'entity', entity, role: 'topic', topic: 'purpose' },
      members: [{ kind: 'item', item: { investigram: { local: 'challenge' }, item: 'p' } }] },
    { key: 'withdraw', operation: 'withdraw', displaces: [identification], grounds: { text: 'The identifying description is disputed, not the identity.' } }] }]);
  assert.equal(ledger.standing(identification).state, 'displaced');
  assert.equal(ledger.entity(entity), before);
  assert.equal(ledger.native(identity), entity);
  assert.deepEqual(ledger.referencing(entity), [extension.item('challenge', 'p')]);
  assert.deepEqual(ledger.productions().flatMap(value => value.deliveries), [], 'References and authority checks do not invent exposure');
});

test('untrusted producers cannot preempt a not-yet-contributed symbol; the real provider can introduce it afterwards', async () => {
  const { analysis } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const store = new MemoryProgramRecordStore();
  const discovery = analysis.discover(store, ['exports']);
  const symbolClaim = nativeFindingRecords(store, discovery.expansions!.flatMap(value => value.claims)).find(value => value.kind === 'claim' && value.information.type === 'symbol');
  assert.ok(symbolClaim?.kind === 'claim');
  const symbol = store.get(symbolClaim.subject); assert.equal(symbol.kind, 'symbol'); if (symbol.kind !== 'symbol') return;
  const ledger = sessionLedger(store, discovery.session), native = nativeIdentity(symbol);
  assert.equal(nativeEntity(store, symbol.id), undefined);
  const before = snapshot(ledger);
  for (const producer of [agentic(), mechanical(symbol.method)]) {
    assert.throws(() => submit(ledger, producer, [{ ...introduction(native), qualification: producer.mechanism === 'mechanical' ? derived : caveat }]), /host-established authority/);
    assert.equal(snapshot(ledger), before);
  }
  // Even the real host credential cannot claim a different provider, rule, scope or key.
  for (const field of ['provider', 'rule', 'scope', 'key']) {
    assert.throws(() => submit(ledger, agentic(), [introduction({ ...native, [field]: 'different' })],
      { nativeIdentityAuthority: programProviderIdentityAuthority }), /host-established authority/);
  }
  const evaluation = recordModuleEvaluation(store, discovery);
  const entity = nativeEntity(store, symbol.id)!;
  assert.ok(entity);
  assert.equal(ledger.entity(entity).entityKind, 'symbol');
  assert.equal(ledger.entity(entity).modality, 'implemented');
  assert.ok(moduleEntity(store, evaluation.modules[0]!));
});

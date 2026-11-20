import { nativeRecordEntity, programProviderIdentityAuthority } from '../src/lib/contributions/native-identity.js';
import { nativeEntity } from '../src/lib/contributions/native.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { ContentCatalog, identificationContract } from '../src/lib/contributions/catalog.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import { entityModule, moduleEntity, moduleNativeIdentity, sessionLedger } from '../src/lib/contributions/modules.js';
import type { Entity, NativeIdentity } from '../src/lib/contributions/model.js';
import { entityRecord } from '../src/lib/contributions/subjects.js';
import type { ModuleRecord } from '../src/lib/records.js';
import { agentic, caveat, submit } from './contribution-helpers.js';
import { discover } from './helpers.js';

const controlledAuthority = Symbol('Controlled alternate provider namespaces');
function identify(ledger: ContributionLedger, native: NativeIdentity, entityKind = 'module', modality: Entity['modality'] = 'implemented', authority: unknown = controlledAuthority) {
  return submit(ledger, agentic(), [{ key: 'alternative', qualification: caveat,
    entities: [{ key: 'alternative', entityKind, modality, native }],
    items: [{ key: 'name', type: 'identification', body: { name: 'Alternative', nameOrigin: 'assigned', designation: 'A separately identified Entity.' } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: { local: 'alternative' }, role: 'identification' },
      members: [{ kind: 'item', item: { investigram: { local: 'alternative' }, item: 'name' } }] }] }], { nativeIdentityAuthority: authority }).entity('alternative');
}

test('reverse native mapping preserves the full identity and does not turn another Entity into a mechanical subject', async () => {
  const { store, evaluation } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const module = store.get(evaluation.modules[0]!) as ModuleRecord;
  const ledger = new ContributionLedger({ session: evaluation.session, catalog: new ContentCatalog([identificationContract]), authorizesNativeIdentity: authority => authority === controlledAuthority });
  const native = moduleNativeIdentity(module), original = identify(ledger, native);
  const alternatives = ['provider', 'rule', 'scope'].map(field => identify(ledger, { ...native, [field]: `another-${field}` }));
  const before = ledger.productions();
  assert.equal(entityRecord(store, ledger, original), module.id);
  assert.equal(entityModule(store, evaluation.session, moduleEntity(store, module.id)!), module.id);
  for (const entity of alternatives) {
    assert.notEqual(entity, original);
    assert.equal(entityRecord(store, ledger, entity), undefined);
  }
  assert.deepEqual(ledger.productions(), before, 'Reverse lookup and subject classification create no exposure or production');
});

test('forward and reverse mapping require the matching Entity kind and implemented modality even for an exact native tuple', async () => {
  const { store, evaluation, analysis } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const module = store.get(evaluation.modules[0]!) as ModuleRecord;
  for (const [kind, modality] of [['module', 'implemented'], ['symbol', 'implemented'], ['module', 'hypothetical'], ['module', 'intended']] as const) {
    // Separate real ledgers allow each variant to introduce the exact tuple first; normal
    // acceptance forbids changing the kind/modality of an already established identity.
    const isolated = new MemoryProgramRecordStore();
    analysis.discover(isolated);
    const ledger = sessionLedger(isolated, evaluation.session);
    const entity = identify(ledger, moduleNativeIdentity(module), kind, modality, programProviderIdentityAuthority);
    const matches = kind === 'module' && modality === 'implemented';
    assert.equal(entityRecord(isolated, ledger, entity), matches ? module.id : undefined);
    assert.equal(entityModule(isolated, evaluation.session, entity), matches ? module.id : undefined);
    assert.equal(nativeRecordEntity(ledger, module), matches ? entity : undefined);
    assert.equal(moduleEntity(isolated, module.id), matches ? entity : undefined);
    assert.equal(nativeEntity(isolated, module.id), matches ? entity : undefined);
    assert.deepEqual(ledger.productions().flatMap(production => production.deliveries), []);
  }
});

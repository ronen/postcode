import { conductDialog } from '../src/lib/contributions/dialog.js';
import type { DialogInput } from '../src/lib/contributions/dialog.js';
import { evidenceAccess } from '../src/lib/evidence-access.js';
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { ContentCatalog, identificationContract } from '../src/lib/contributions/catalog.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import { entityModule, moduleEntity, moduleNativeIdentity, sessionLedger } from '../src/lib/contributions/modules.js';
import type { Entity, NativeIdentity } from '../src/lib/contributions/model.js';
import { entityRecord } from '../src/lib/contributions/subjects.js';
import { resolveSubjects } from '../src/lib/subject-resolution.js';
import { applicationCatalog } from '../src/lib/application/catalog.js';
import type { ModuleRecord } from '../src/lib/records.js';
import { agentic, caveat, submit } from './contribution-helpers.js';
import { discover } from './helpers.js';

function identify(ledger: ContributionLedger, native: NativeIdentity, entityKind = 'module', modality: Entity['modality'] = 'implemented') {
  return submit(ledger, agentic(), [{ key: 'alternative', qualification: caveat,
    entities: [{ key: 'alternative', entityKind, modality, native }],
    items: [{ key: 'name', type: 'identification', body: { name: 'Alternative', nameOrigin: 'assigned', designation: 'A separately identified Entity.' } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: { local: 'alternative' }, role: 'identification' },
      members: [{ kind: 'item', item: { investigram: { local: 'alternative' }, item: 'name' } }] }] }]).entity('alternative');
}

test('reverse native mapping preserves the full identity and does not turn another Entity into a mechanical subject', async () => {
  const { store, evaluation, analysis } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const ledger = sessionLedger(store, evaluation.session), module = store.get(evaluation.modules[0]!) as ModuleRecord;
  const native = moduleNativeIdentity(module), original = moduleEntity(store, module.id)!;
  const alternatives = ['provider', 'rule', 'scope'].map(field => identify(ledger, { ...native, [field]: `another-${field}` }));
  const before = ledger.productions();
  assert.equal(entityRecord(store, ledger, original), module.id);
  assert.equal(entityModule(store, ledger.session, original), module.id);
  for (const entity of alternatives) {
    assert.notEqual(entity, original);
    assert.equal(entityRecord(store, ledger, entity), undefined);
    assert.equal(entityModule(store, ledger.session, entity), undefined);
    const designation = { kind: 'selection' as const, subject: { kind: 'entity' as const, entity } };
    const inspection = resolveSubjects(store, ledger.session, applicationCatalog.lenses.inspect!, designation);
    assert.equal(inspection.status, 'resolved');
    assert.equal(inspection.candidates[0]!.id, entity);
    assert.equal(inspection.candidates[0]!.kind, 'entity');
    assert.equal(resolveSubjects(store, ledger.session, applicationCatalog.lenses.summarize!, designation).status, 'unsupported-subject');
  }
  assert.deepEqual(ledger.productions(), before, 'Reverse lookup and subject classification create no exposure or production');
  // The delivery boundary must not advertise the candidate record to a dialog either.
  for (const entity of alternatives) {
    const invocation = ledger.invoke({ operation: 'test', subjects: [{ role: null, subject: { kind: 'entity', entity } }], parameters: {}, context: [], resultContract: null });
    const inputs: DialogInput[] = [];
    await conductDialog({ ledger, store, evidence: evidenceAccess(store, analysis, ledger.session), invocation: invocation.invocation.id,
      operation: { id: 'test', method: 'test/native-identity@1', objective: 'Inspect the supplied Entity.' }, check: async () => {},
      agent: { identity: { provider: 'postcode-test', model: 'scripted', configuration: {}, origin: 'scripted' },
        open: () => ({ exchange: async input => { inputs.push(input); return { kind: 'ended' }; }, close() {} }) } });
    assert.equal(inputs.length, 1);
    assert.deepEqual(inputs[0]!.request.subjects, [{ role: null, subject: { kind: 'entity', entity }, moduleRecord: null }]);
    assert.equal(JSON.stringify(inputs[0]!.responses).includes('module-identification'), false);
  }
});

test('reverse mapping requires the matching Entity kind and implemented modality even for an exact native tuple', async () => {
  const { store, evaluation } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const module = store.get(evaluation.modules[0]!) as ModuleRecord;
  for (const [kind, modality] of [['module', 'implemented'], ['symbol', 'implemented'], ['module', 'hypothetical'], ['module', 'intended']] as const) {
    // Separate real ledgers allow each variant to introduce the exact tuple first; normal
    // acceptance forbids changing the kind/modality of an already established identity.
    const ledger = new ContributionLedger({ session: evaluation.session, catalog: new ContentCatalog([identificationContract]), resolvesRecord: () => false });
    const entity = identify(ledger, moduleNativeIdentity(module), kind, modality);
    assert.equal(entityRecord(store, ledger, entity), kind === 'module' && modality === 'implemented' ? module.id : undefined);
    assert.deepEqual(ledger.productions().flatMap(production => production.deliveries), []);
  }
});

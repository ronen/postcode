import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { entityModule, moduleEntity, sessionLedger } from '../src/lib/contributions/modules.js';
import { InvalidContribution } from '../src/lib/contributions/model.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { methods } from '../src/lib/identity.js';
import type { ClaimContextRecord, ModuleClaim, ModuleRecord, RecordId } from '../src/lib/records.js';
import { discover } from './helpers.js';

const fixture = (name: string) => path.resolve('fixtures', name, 'tsconfig.json');
const suffix = (id: string) => id.slice(id.lastIndexOf(':') + 1);
const caveat = { limitations: ['Controlled interpretation; not mechanically established.'] };
const agent = { mechanism: 'agentic' as const, method: 'test/investigation@1', agent: { model: 'scripted' } };

test('module discovery contributes one common Entity per module, resolving to and from its module record', async () => {
  const { store, evaluation, claims } = await discover(fixture('module-population'));
  const ledger = sessionLedger(store, evaluation.session);
  assert.equal(sessionLedger(store, evaluation.session), ledger);
  assert.equal(evaluation.modules.length > 2, true);
  assert.equal(ledger.entities().length, evaluation.modules.length);
  for (const id of evaluation.modules) {
    const module = store.get(id) as ModuleRecord, claim = store.get(module.claim) as ModuleClaim, context = store.get(claim.context) as ClaimContextRecord;
    const entity = moduleEntity(store, id)!;
    // One identity, never the native key, with the correspondence available in both directions.
    assert.notEqual(entity, id);
    assert.deepEqual([ledger.entity(entity).entityKind, entityModule(store, evaluation.session, entity)], ['module', id]);
    const [identification, ...others] = ledger.identifications(entity);
    assert.deepEqual(others, []);
    const item = ledger.item(identification!.declaration.members[0]!.kind === 'item' ? identification!.declaration.members[0]!.item : assert.fail());
    // The finding carries the discovery method's own name, handle and qualification, and references its retained claim.
    assert.deepEqual(item.body, { claim: claim.id, name: claim.information.name, handle: claim.information.handle, handleProvenance: claim.information.handleProvenance });
    assert.deepEqual([item.qualification?.status, item.qualification?.method, item.qualification?.guarantee, item.qualification?.limitations, item.qualification?.contexts, item.evidence],
      ['mechanically-derived', module.method, context.guarantee, context.limitations, [context.id], [claim.id]]);
    // The finding and its organizing use have separate producers; method-specific access follows the finding.
    const finder = ledger.production(ledger.investigram(item === undefined ? assert.fail() : identification!.declaration.members[0]!.kind === 'item' ? identification!.declaration.members[0]!.item.investigram : assert.fail()).production);
    const organizer = ledger.production(identification!.owner.production);
    assert.deepEqual([finder.producer.method, organizer.producer.method, identification!.declaration.qualification ?? identification!.owner.qualification?.status],
      [module.method, methods.moduleIdentificationPolicy, 'organizing-policy']);
    assert.deepEqual(ledger.identifications(entity, { method: module.method }).map(entry => entry.address), [identification!.address]);
    assert.deepEqual(ledger.identifications(entity, { method: methods.moduleIdentificationPolicy }), []);
  }
  // Names and handles locate their Entities; anonymity is preserved, not invented.
  const named = claims.find(claim => claim.information.name !== null)!;
  assert.deepEqual(ledger.lookupName(named.information.name!).matches.map(match => entityModule(store, evaluation.session, match.entity)), [named.subject]);
  assert.equal(ledger.lookupName(named.information.name!).matches[0]!.name.origin, 'system-under-study');
  // Discovery consumed no retained contributions: host identity mapping is not a delivery.
  assert.deepEqual(ledger.productions().flatMap(production => production.deliveries), []);
});

test('equivalent recomputation reuses the established findings and never renews a withdrawn identification', async () => {
  const { store, evaluation, analysis } = await discover(fixture('exports'));
  const ledger = sessionLedger(store, evaluation.session);
  const module = evaluation.modules[0]!, entity = moduleEntity(store, module)!, use = ledger.identifications(entity)[0]!.address;
  const discoveryMethod = (store.get(module) as ModuleRecord).method;
  const before = [ledger.position, ledger.entities().length, ledger.investigrams().length];
  // An interpreted identification is added and the mechanical one withdrawn.
  const handle = ledger.begin({ producer: agent });
  handle.baseline(entity);
  ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'i', qualification: caveat,
    items: [{ key: 'id', type: 'identification', body: { name: 'Barrel', nameOrigin: 'assigned', designation: 'Re-exporting entry module' } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: 'i' }, item: 'id' } }] },
      { key: 'withdraw', operation: 'withdraw', displaces: [use], grounds: { text: 'The file name does not describe the responsibility.' } }] }] } }]);
  const after = [ledger.position, ledger.entities().length, ledger.investigrams().length];
  // New evaluations with further requirements re-examine the same modules through the provider.
  const exports = evaluateModules(store, analysis, ['exports', 'documentation']);
  evaluateModules(store, analysis, ['composition']);
  assert.notEqual(exports.id, evaluation.id);
  assert.deepEqual([ledger.position, ledger.entities().length, ledger.investigrams().length], after);
  assert.deepEqual(after, [before[0]! + 1, before[1], before[2]! + 1]);
  // The exact Entity and the method's own finding remain, with the withdrawal available as standing.
  assert.equal(moduleEntity(store, module), entity);
  assert.deepEqual(ledger.identifications(entity).map(entry => ledger.production(entry.owner.production).producer.method), ['test/investigation@1']);
  assert.deepEqual(ledger.identifications(entity, { method: discoveryMethod }).map(entry => [entry.address, ledger.standing(entry.address).state]), [[use, 'displaced']]);
  const claim = store.get((store.get(module) as ModuleRecord).claim) as ModuleClaim;
  assert.equal(ledger.lookupName(claim.information.handle).matches.length, 0);
  assert.deepEqual(ledger.lookupName(claim.information.handle, { history: true }).matches.map(match => [match.entity, match.standing.state]), [[entity, 'displaced']]);
  // The deterministic handle and module claim are untouched by the interpreted identification.
  assert.equal((store.get(claim.id) as ModuleClaim).information.handle, claim.information.handle);
});

test('common module identities and identifying findings are independent of the order in which evaluations arrive', async () => {
  const describe = async (expansionsFirst: boolean) => {
    const { store, evaluation, analysis } = await discover(fixture('exports'));
    if (expansionsFirst) evaluateModules(store, analysis, ['exports']);
    const ledger = sessionLedger(store, evaluation.session);
    return evaluation.modules.map(id => {
      const entity = moduleEntity(store, id)!, item = ledger.identifications(entity)[0]!.declaration.members[0]!;
      const body = ledger.item(item.kind === 'item' ? item.item : assert.fail()).body as { name: string | null; handle: string };
      return [suffix(id), suffix(entity), body.name, body.handle];
    });
  };
  const [first, second] = [await describe(false), await describe(true)];
  assert.deepEqual(first, second);
  assert.equal(new Set(first.map(item => item[1])).size, first.length);
});

test('a mechanical qualification can name only a Claim context of its own producing method', async () => {
  const { store, evaluation } = await discover(fixture('exports'));
  const ledger = sessionLedger(store, evaluation.session);
  const module = store.get(evaluation.modules[0]!) as ModuleRecord, claim = store.get(module.claim) as ModuleClaim;
  const submit = (method: string, context: RecordId) => {
    const handle = ledger.begin({ producer: { mechanism: 'mechanical', method, agent: null } });
    return () => ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'k', items: [{ key: 'p', type: 'prose', body: { text: 'x' },
      qualification: { status: 'mechanically-derived', contexts: [context] } }] }] } }]);
  };
  const rejected = (error: unknown) => error instanceof InvalidContribution && /Claim context of the producing method/.test(error.message);
  // Another method cannot adopt the discovery context, and a record of another kind is not a context at all.
  assert.throws(submit('test/other-method@1', claim.context), rejected);
  assert.throws(submit(module.method, claim.id), rejected);
  assert.doesNotThrow(submit(module.method, claim.context));
});

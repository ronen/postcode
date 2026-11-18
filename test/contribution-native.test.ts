import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateDependencyOrganization } from '../src/lib/dependencies/organization.js';
import { dependencyStructure } from '../src/lib/dependencies/projections.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { organization } from '../src/lib/organization/projections.js';
import { modules } from '../src/lib/projections.js';
import { nativeEntity, nativeFindingRecords, nativeItem } from '../src/lib/contributions/native.js';
import { nativeConcerns, nativeConcernLines } from '../src/lib/contributions/native-presentation.js';
import { sessionLedger } from '../src/lib/contributions/modules.js';
import { addressKey, InvalidContribution, itemKey } from '../src/lib/contributions/model.js';
import type { AssociationAddress } from '../src/lib/contributions/model.js';
import type { EvaluationRecord } from '../src/lib/records.js';
import { discover } from './helpers.js';

const agent = { mechanism: 'agentic' as const, method: 'test/native-review@1', agent: { model: 'controlled' } };
const qualification = { limitations: ['Controlled organizing judgment; no change to provider guarantees.'] };

test('all module expansions retain exact symbols, exports, assertions and composition through contributions', async () => {
  const { store, analysis, evaluation } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const complete = evaluateModules(store, analysis, ['exports', 'documentation', 'composition']);
  const ledger = sessionLedger(store, evaluation.session), answer = modules(store, complete);
  const records = nativeFindingRecords(store, answer.expansions.claims);
  for (const type of ['symbol', 'export', 'documentation-association', 'module-composition']) {
    assert.ok(records.some(value => value.kind === 'claim' && value.information.type === type), type);
  }
  assert.ok(records.some(value => value.kind === 'recorded-assertion'));
  for (const record of records) {
    const address = nativeItem(store, record.id)!;
    const item = ledger.item(address);
    if (record.kind === 'claim' && record.information.type === 'module') continue;
    assert.deepEqual(item.body, { record: record.id, finding: record });
    assert.deepEqual(item.evidence, [record.id]);
    assert.ok(answer.contributions.support.items.some(item => itemKey(item.address) === itemKey(address)));
    if (record.kind === 'recorded-assertion') assert.equal(item.qualification!.status, 'recorded-assertion');
    if (record.kind === 'claim' && record.information.type === 'symbol') {
      const entity = nativeEntity(store, record.subject)!;
      assert.equal(ledger.entity(entity).entityKind, 'symbol');
      assert.ok(ledger.identifications(entity).length);
    }
  }
  assert.deepEqual(ledger.productions().flatMap(production => production.deliveries), [], 'Compiler recomputation and answer construction deliver no retained inputs');
  const before = [ledger.position, ledger.entities().length, ledger.productions().length];
  evaluateModules(store, analysis, ['exports']); evaluateModules(store, analysis, ['exports', 'documentation', 'composition']);
  assert.deepEqual([ledger.position, ledger.entities().length, ledger.productions().length], before);
  assert.equal(modules(store, complete).id, answer.id);
});

test('native contracts reject fabricated provider statements atomically', async () => {
  const { store, analysis, evaluation } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const complete = evaluateModules(store, analysis, ['exports']);
  const ledger = sessionLedger(store, evaluation.session), answer = modules(store, complete);
  const native = answer.contributions.support.items.find(value => value.item.type === 'native-finding')!;
  const production = ledger.begin({ producer: agent }), position = ledger.position;
  assert.throws(() => ledger.accept([{ production, contribution: { investigrams: [{ key: 'fake', qualification,
    items: [{ key: 'fake', type: 'native-finding', body: { ...(native.item.body as object), finding: { kind: 'claim', information: 'invented' } } }] }] } }]), InvalidContribution);
  assert.equal(ledger.position, position);
  ledger.abandon(production, 'Controlled invalid submission');
});

test('mechanical selections expose exact displacement without changing earlier captures', async () => {
  const { store, analysis, evaluation } = await discover(path.resolve('fixtures/exports/tsconfig.json'));
  const complete = evaluateModules(store, analysis, ['exports', 'documentation', 'composition']);
  const ledger = sessionLedger(store, evaluation.session), before = modules(store, complete);
  const selected = before.contributions.findings.find(value => value.record && store.get(value.record).kind === 'claim'
    && (store.get(value.record) as { information: { type: string } }).information.type === 'module-composition')!;
  assert.ok(selected.uses.length);
  const production = ledger.begin({ producer: agent });
  ledger.accept([{ production, contribution: { investigrams: [{ key: 'review', qualification, declarations: [
    { key: 'withdraw', operation: 'withdraw', displaces: selected.uses, grounds: { text: 'Use is withdrawn for the controlled account.' } },
  ] }] } }]);
  const after = modules(store, complete), concerns = nativeConcerns(after.contributions);
  assert.notEqual(after.id, before.id);
  assert.deepEqual(after.claims, before.claims);
  assert.ok(concerns.uses.some(value => selected.uses.some(use => addressKey(use) === addressKey(value.address)) && value.status.standing.state === 'displaced'));
  assert.match(nativeConcernLines(concerns).join('\n'), /Use is withdrawn/);
  assert.deepEqual(nativeConcerns(before.contributions).changes, []);
  const count = ledger.position;
  evaluateModules(store, analysis, ['composition']);
  assert.equal(ledger.position, count, 'Equivalent native computation does not reassert a withdrawn use');
  assert.equal(modules(store, complete).id, after.id);
});

test('organization and dependency families preserve qualified findings and actual retained-input exposure', async t => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-native-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  cpSync(path.resolve('fixtures/organization'), root, { recursive: true });
  execFileSync('git', ['init', '--quiet', root]);
  const { store, analysis, evaluation } = await discover(path.join(root, 'tsconfig.json'));
  const dependency = evaluateDependencies(store, analysis, ['exports', 'documentation', 'composition']);
  const basis = store.get(dependency.moduleEvaluation) as EvaluationRecord;
  const layout = evaluateOrganization(store, basis), expansion = evaluateDependencyOrganization(store, dependency, layout);
  const ledger = sessionLedger(store, evaluation.session);
  const selected = organization(store, layout, 'repository'), edges = dependencyStructure(store, dependency, expansion.id);
  for (const id of [...layout.claims, ...dependency.relationships, ...dependency.occurrences, ...dependency.coverage, ...expansion.claims]) {
    assert.ok(nativeItem(store, id), `Missing common contribution for ${id}`);
  }
  for (const id of layout.groups) {
    const entity = nativeEntity(store, id)!;
    assert.equal(ledger.entity(entity).entityKind, 'group');
    assert.equal(ledger.identifications(entity).length, 1);
  }
  const placement = layout.claims.map(id => store.get(id)).find(record => record.kind === 'claim' && record.information.type === 'module-placement')!;
  const placementOwner = ledger.investigram(nativeItem(store, placement.id)!.investigram);
  const deliveries = ledger.production(placementOwner.production).deliveries;
  assert.ok(deliveries.some(delivery => delivery.kind === 'item'));
  assert.ok(deliveries.every(delivery => delivery.kind !== 'scope'), 'A fixed module population is not an evolving inventory');
  for (const id of dependency.relationships) {
    const relationship = store.get(id);
    assert.ok(relationship.kind === 'claim' && relationship.information.type === 'dependency');
    const address = nativeItem(store, id)!;
    assert.deepEqual(new Set(ledger.item(address).referents), new Set([nativeEntity(store, relationship.subject), nativeEntity(store, relationship.information.child)]));
    assert.deepEqual(ledger.production(ledger.investigram(nativeItem(store, id)!.investigram).production).deliveries, []);
  }
  const use = selected.contributions.findings.find(value => value.record === placement.id)!.uses[0]!;
  const change = ledger.begin({ producer: agent });
  ledger.accept([{ production: change, contribution: { investigrams: [{ key: 'review', qualification,
    declarations: [{ key: 'withdraw', operation: 'withdraw', displaces: [use], grounds: { text: 'Controlled placement-use withdrawal.' } }] }] } }]);
  const position = ledger.position;
  assert.equal(evaluateOrganization(store, basis).id, layout.id);
  assert.equal(evaluateDependencyOrganization(store, dependency, layout).id, expansion.id);
  assert.equal(ledger.position, position);
  // A different module requirement set creates another provider evaluation, but the
  // same placement/properties must reuse their original contribution and displaced use.
  const recomputedBasis = evaluateModules(store, analysis, ['exports']);
  const recomputedLayout = evaluateOrganization(store, recomputedBasis);
  assert.notEqual(recomputedLayout.id, layout.id);
  assert.equal(ledger.position, position);
  const equivalentPlacement = recomputedLayout.claims.map(id => store.get(id)).find(value => value.kind === 'claim'
    && value.information.type === 'module-placement' && value.subject === (placement as { subject: typeof value.id }).subject)!;
  assert.deepEqual(nativeItem(store, equivalentPlacement.id), nativeItem(store, placement.id));
  const next = organization(store, layout, 'repository');
  assert.notEqual(next.id, selected.id);
  assert.ok(next.contributions.support.uses.some(value => addressKey(value.address) === addressKey(use) && value.status.standing.state === 'displaced'));
  assert.equal(selected.contributions.support.uses.find(value => addressKey(value.address) === addressKey(use))!.status.standing.state, 'standing');
  assert.equal(dependencyStructure(store, dependency, expansion.id).id, edges.id, 'Unrelated organizing-use withdrawal does not alter bare finding inputs');
  const groupUse = selected.contributions.support.uses.find(value => value.declaration.target.kind === 'entity'
    && ledger.entity(value.declaration.target.entity).entityKind === 'group' && value.declaration.target.role === 'identification'
    && value.declaration.members.some(member => member.kind === 'item' && selected.contributions.support.items.find(item => itemKey(item.address) === itemKey(member.item))!.identifyingNames.length > 0))!;
  const oldName = ledger.item(groupUse.declaration.members[0]!.kind === 'item' ? groupUse.declaration.members[0]!.item : assert.fail()).body as { finding: { information: { name: string | null } } };
  if (oldName.finding.information.name) {
    const withdraw = ledger.begin({ producer: agent });
    ledger.accept([{ production: withdraw, contribution: { investigrams: [{ key: 'name', qualification,
      declarations: [{ key: 'withdraw', operation: 'withdraw', displaces: [groupUse.address as AssociationAddress], grounds: { text: 'Historical name control.' } }] }] } }]);
    assert.ok(ledger.lookupName(oldName.finding.information.name, { history: true }).matches.some(match => match.standing.state === 'displaced'));
  }
});

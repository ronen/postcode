import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { entityModule, moduleEntity, sessionLedger } from '../src/lib/contributions/modules.js';
import { InvalidContribution } from '../src/lib/contributions/model.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { methods, recordId } from '../src/lib/identity.js';
import type { ClaimContextRecord, ModuleClaim, ModuleRecord, RecordId } from '../src/lib/records.js';
import { moduleExports, resolveModuleExports } from '../src/lib/exports/content.js';
import { arrangeModuleExports, renderModuleExports } from '../src/lib/exports/presentation.js';
import { discover } from './helpers.js';
import { normalizeSession } from './comparison.js';

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
  const identifying = () => ledger.entities().flatMap(item => ledger.identifications(item.id, { standing: 'all' })).length;
  const before = [ledger.position, ledger.entities().length, identifying()];
  // An interpreted identification is added and the mechanical one withdrawn.
  const handle = ledger.begin({ producer: agent });
  handle.baseline(entity);
  ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'i', qualification: caveat,
    items: [{ key: 'id', type: 'identification', body: { name: 'Barrel', nameOrigin: 'assigned', designation: 'Re-exporting entry module' } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: 'i' }, item: 'id' } }] },
      { key: 'withdraw', operation: 'withdraw', displaces: [use], grounds: { text: 'The file name does not describe the responsibility.' } }] }] } }]);
  const after = [ledger.position, ledger.entities().length, identifying()];
  // New evaluations with further requirements re-examine the same modules through the provider.
  const exports = evaluateModules(store, analysis, ['exports', 'documentation']);
  evaluateModules(store, analysis, ['composition']);
  assert.notEqual(exports.id, evaluation.id);
  // The export evaluation contributes its own new findings, once; no Entity or identification is added by any of them.
  const exported = ledger.position;
  assert.equal(exported, after[0]! + 1);
  evaluateModules(store, analysis, ['exports', 'documentation']); evaluateModules(store, analysis, ['exports']);
  assert.deepEqual([ledger.position, ledger.entities().length, identifying()], [exported, after[1], after[2]]);
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

const unicode = { format: 'unicode' as const, moreDetails: false };
async function exportsSession(order: 'direct' | 'contributions-first' | 'contributions-after' = 'direct') {
  const { store, evaluation, analysis, claims } = await discover(fixture('exports'));
  const barrel = claims.find(claim => claim.information.handle === 'barrel')!.subject, other = claims.find(claim => claim.information.handle === 'origin')!.subject;
  const ledger = sessionLedger(store, evaluation.session), entity = moduleEntity(store, barrel)!;
  // Independent contributions: an interpreted identification and topical account of the same module, and an account of another.
  const independent = () => {
    for (const [key, target] of [['other', moduleEntity(store, other)!], ['same', entity]] as const) {
      const handle = ledger.begin({ producer: agent });
      handle.baseline(target);
      ledger.accept([{ production: handle, contribution: { investigrams: [{ key, qualification: caveat,
        items: [{ key: 'id', type: 'identification', body: { name: `Interpreted ${key}`, nameOrigin: 'assigned', designation: 'An interpreted identification' } },
          { key: 'p', type: 'prose', body: { text: 'An interpreted account.' } }],
        declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: target, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: key }, item: 'id' } }] },
          { key: 'topic', operation: 'add', target: { kind: 'entity', entity: target, role: 'topic', topic: 'exports' }, members: [{ kind: 'item', item: { investigram: { local: key }, item: 'p' } }] }] }] } }]);
    }
  };
  if (order === 'contributions-first') independent();
  const evaluate = () => evaluateModules(store, analysis, ['exports', 'documentation']);
  if (order === 'contributions-after') { evaluate(); independent(); }
  const answer = () => moduleExports(store, evaluate(), [barrel], 'exports');
  return { store, analysis, session: evaluation.session, ledger, barrel, entity, answer };
}

test('an exports answer is assembled from the methods\' retained findings without creating producer exposure', async () => {
  const { store, ledger, barrel, entity, answer } = await exportsSession();
  const productions = ledger.productions().length;
  const projection = answer(), content = resolveModuleExports(store, projection);
  const { naming, surface } = projection.contributions;
  // The module naming is the discovery method's identifying finding; the export listing is the export method's finding.
  assert.deepEqual([projection.contributions.entity, naming.length, naming[0]!.standing, naming[0]!.displacements, surface?.uses.map(use => use.standing)], [entity, 1, 'standing', [], ['standing']]);
  const named = ledger.item(naming[0]!.item).body as { name: string | null; handle: string; claim: RecordId };
  assert.deepEqual([named.handle, named.claim], [content.module.record.information.handle, content.module.record.id]);
  const listed = ledger.item(surface!.item);
  assert.deepEqual((listed.body as { exports: RecordId[] }).exports, projection.exports);
  assert.deepEqual([listed.qualification?.status, listed.evidence, content.exports.length > 0], ['mechanically-derived', projection.exports, true]);
  // Mechanical semantic content survives the wrapper: the export claims and their qualification are the provider's own records.
  for (const exported of content.exports) assert.equal(exported.claim.record.subject, barrel);
  // The export producer analysed source independently and the assembly only read retained information: nothing was delivered to anyone.
  assert.equal(ledger.productions().length, productions + 2);
  assert.deepEqual(ledger.productions().flatMap(production => production.deliveries), []);
  const again = answer();
  assert.equal(again.id, projection.id);
  assert.equal(ledger.productions().length, productions + 2);
});

test('a withdrawn use of a method\'s finding is captured by a fresh answer, shown with it, and never renewed or applied to the earlier answer', async () => {
  const { store, analysis, ledger, entity, answer } = await exportsSession();
  const before = answer(), use = before.contributions.naming[0]!.association, exportsUse = before.contributions.surface!.uses[0]!.association;
  // An agentic producer consumes the retained export finding, then withdraws both mechanical uses.
  const handle = ledger.begin({ producer: agent });
  handle.baseline(entity);
  assert.equal(handle.member(exportsUse, before.contributions.surface!.item).item.qualification?.status, 'mechanically-derived');
  ledger.accept([{ production: handle, contribution: { investigrams: [{ key: 'w', qualification: caveat, declarations: [
    { key: 'name', operation: 'withdraw', displaces: [use], grounds: { text: 'The file name does not describe the responsibility.' } },
    { key: 'exports', operation: 'withdraw', displaces: [exportsUse], grounds: { text: 'The listing omits the dynamic registrations.' } }] }] } }]);
  assert.deepEqual(ledger.production(handle.id).deliveries.map(delivery => delivery.kind), ['scope', 'association', 'item', 'association', 'item']);
  const position = ledger.position, associations = ledger.associations({ kind: 'entity', entity, role: 'any' }, 'all').length;
  // Equivalent provider recomputation after the displacement adds no association.
  evaluateModules(store, analysis, ['exports']); evaluateModules(store, analysis, ['exports', 'documentation', 'composition']);
  assert.deepEqual([ledger.position, ledger.associations({ kind: 'entity', entity, role: 'any' }, 'all').length], [position, associations]);
  // The fresh answer returns the same findings with the withdrawal as captured status; the earlier answer is unchanged.
  const after = answer();
  assert.notEqual(after.id, before.id);
  assert.deepEqual([after.exports, after.contributions.naming[0]!.item, after.contributions.surface!.item], [before.exports, before.contributions.naming[0]!.item, before.contributions.surface!.item]);
  assert.deepEqual(after.contributions.naming[0]!.displacements.map(change => [change.operation, change.grounds]), [['withdraw', 'The file name does not describe the responsibility.']]);
  assert.equal(after.contributions.surface!.uses[0]!.standing, 'displaced');
  assert.deepEqual((store.get(before.id) as typeof before).contributions, before.contributions);
  assert.equal(before.contributions.naming[0]!.standing, 'standing');
  const render = (projection: typeof before) => renderModuleExports(arrangeModuleExports(resolveModuleExports(store, projection), 'module-test', unicode, 'Exports'));
  // The method's name is still shown, and not as though unaffected.
  assert.match(render(after), /^barrel \(module-test\)$/m);
  assert.match(render(after), /use of this module identification as information about the module was withdrawn by later analysis: The file name does not describe the responsibility\. The finding itself/);
  assert.match(render(after), /use of this export listing .* was withdrawn by later analysis: The listing omits the dynamic registrations\./);
  assert.doesNotMatch(render(before), /later analysis/);
});

test('equivalent exports answers are identical when findings arrive in a different order', async () => {
  // The same mechanical findings, with independent contributions accepted before them, after them, or not at all.
  const sessions = [await exportsSession('direct'), await exportsSession('contributions-first'), await exportsSession('contributions-after')];
  const [direct, ...reordered] = sessions.map(item => {
    const projection = item.answer(), content = resolveModuleExports(item.store, projection);
    return { item, projection: normalizeSession(projection), content: normalizeSession(content, item.session),
      rendered: normalizeSession(renderModuleExports(arrangeModuleExports(content, 'module-test', unicode, 'Exports')), item.session),
      json: normalizeSession(renderModuleExports(arrangeModuleExports(content, 'module-test', { format: 'json', moreDetails: false }, 'Exports')), item.session) };
  });
  // The ledgers really differ in arrival order and in what else stands for the module.
  assert.notEqual(direct!.item.ledger.position, reordered[0]!.item.ledger.position);
  assert.equal(reordered[0]!.item.ledger.identifications(reordered[0]!.item.entity).length, 2);
  // The full structured answer, its resolved content and both renderings are equal under the shared comparison policy.
  for (const other of reordered) {
    assert.deepEqual(other.projection, direct!.projection);
    assert.deepEqual(other.content, direct!.content);
    assert.equal(other.rendered, direct!.rendered);
    assert.equal(other.json, direct!.json);
  }
  // Unrelated accumulated work and another standing identification did not broaden or reorder the method's answer.
  assert.equal(direct!.projection.contributions.naming.length, 1);
  assert.equal(direct!.projection.contributions.surface!.uses.length, 1);
});

test('export displacement snapshots retain separately qualified evidence and support through later changes', async () => {
  const run = async () => {
    const { store, ledger, entity, answer } = await exportsSession();
    const before = answer(), naming = before.contributions.naming[0]!.association, surface = before.contributions.surface!.uses[0]!.association;
    const producer = ledger.begin({ producer: agent, id: recordId(ledger.session, 'production', 'qualified-export-displacement') });
    // The controlled producer is supplied the actual retained export claim before citing it.
    producer.supplied([store.get(before.exports[0]!).id]);
    const accepted = ledger.accept([{ production: producer, contribution: { investigrams: [{ key: 'change',
      qualification: { scope: 'hypothetical comparison only', limitations: ['OWNER_LIMIT: this organizing judgment is hypothetical.'] },
      items: [{ key: 'grounds', type: 'prose', body: { text: 'SUPPORT_BODY: the comparison uses one hypothetical scenario.' },
        qualification: { limitations: ['SUPPORT_LIMIT: not a mechanically established fact.'] }, evidence: [before.exports[0]!] },
        { key: 'replacement', type: 'prose', body: { text: 'REPLACEMENT_CONTENT_NOT_SELECTED' } }],
      declarations: [
        { key: 'withdraw-name', operation: 'withdraw', displaces: [naming],
          qualification: { scope: 'naming only', limitations: ['DECLARATION_LIMIT: applies only to the hypothetical naming use.'] },
          grounds: { text: 'Compare the name in the hypothetical scenario.', evidence: [before.exports[0]!], support: [{ investigram: { local: 'change' }, item: 'grounds' }] } },
        { key: 'replace-exports', operation: 'supersede', target: { kind: 'entity', entity, role: 'topic', topic: 'exports' }, displaces: [surface],
          members: [{ kind: 'item', item: { investigram: { local: 'change' }, item: 'replacement' } }],
          qualification: { limitations: ['EXPORT_LIMIT: replacement use is conditional.'] },
          grounds: { text: 'Compare another export account.', support: [{ investigram: { local: 'change' }, item: 'grounds' }] } },
      ] }] } }]);
    const owner = accepted.productions[0]!.investigrams.change!;
    const selected = answer(), fixed = structuredClone(selected), support = selected.contributions.support;
    assert.deepEqual(support.owners.find(item => item.investigram === owner)?.producer, agent);
    assert.equal(support.owners.find(item => item.investigram === owner)?.qualification?.scope, 'hypothetical comparison only');
    assert.equal(support.changes.find(item => item.address.declaration === 'withdraw-name')?.declaration.qualification?.scope, 'naming only');
    assert.ok(support.evidence.some(record => record.id === before.exports[0]));
    assert.ok(support.evidence.some(record => record.kind === 'claim-context'));
    assert.ok(support.items.some(item => item.address.item === 'grounds' && item.item.qualification?.limitations.includes('SUPPORT_LIMIT: not a mechanically established fact.')));
    assert.ok(!support.items.some(item => item.address.item === 'replacement'), 'displacement context does not select replacement content');
    const render = () => arrangeModuleExports(resolveModuleExports(store, selected), 'module-test', unicode, 'Exports');
    const view = render(), text = renderModuleExports(view);
    assert.match(text, /Displacement producer: agentic \(test\/investigation@1\)/);
    assert.match(text, /Displacement owner: interpretation.*scope: hypothetical comparison only/);
    assert.match(text, /OWNER_LIMIT/); assert.match(text, /DECLARATION_LIMIT/); assert.match(text, /EXPORT_LIMIT/);
    assert.ok(!view.module.qualification.limitations.some(value => /OWNER_LIMIT|DECLARATION_LIMIT|EXPORT_LIMIT/.test(value)));
    const displacement = view.contributions.naming[0]!.displacements[0]!;
    assert.deepEqual(displacement.evidence, [before.exports[0]]);
    assert.deepEqual(displacement.support, [{ investigram: owner, item: 'grounds' }]);
    assert.ok(!('support' in view.contributions), 'raw resolved source evidence is not copied into the public View');
    const textBeforeLaterChange = renderModuleExports(view);
    const later = ledger.begin({ producer: agent });
    ledger.accept([{ production: later, contribution: { investigrams: [{ key: 'later', qualification: caveat, declarations: [{ key: 'w', operation: 'withdraw',
      displaces: [{ investigram: owner, declaration: 'replace-exports' }], grounds: { text: 'Later withdrawal of the replacement use.' } }] }] } }]);
    assert.deepEqual(resolveModuleExports(store, selected).projection, fixed);
    assert.equal(renderModuleExports(render()), textBeforeLaterChange);
    assert.equal(before.contributions.support.changes.length, 0);
    const fresh = answer();
    assert.notEqual(fresh.id, selected.id);
    assert.equal(fresh.contributions.support.changes.find(item => item.address.declaration === 'replace-exports')?.standing?.state, 'displaced');
    return { projection: normalizeSession(fixed), view: normalizeSession(view, selected.session), text: normalizeSession(textBeforeLaterChange, selected.session) };
  };
  assert.deepEqual(await run(), await run(), 'qualified displacement captures and identities are repeatable across Sessions');
});

test('fresh exports disclose reconsideration of the displacing production without reversing its displacement or revising an exact answer', async () => {
  const { store, ledger, entity, answer } = await exportsSession();
  const initial = answer(), naming = initial.contributions.naming[0]!.association, surface = initial.contributions.surface!.uses[0]!.association;
  const premise = ledger.accept([{ production: ledger.begin({ producer: agent }), contribution: { investigrams: [{ key: 'premise', qualification: caveat,
    items: [{ key: 'p', type: 'prose', body: { text: 'A limited organizing premise.' } }],
    declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity, role: 'topic', topic: 'organizing-premise' },
      members: [{ kind: 'item', item: { investigram: { local: 'premise' }, item: 'p' } }] }] }] } }]);
  const premiseUse = { investigram: premise.productions[0]!.investigrams.premise!, declaration: 'use' };
  const displacer = ledger.begin({ producer: agent });
  displacer.association(premiseUse);
  const withdrawn = ledger.accept([{ production: displacer, contribution: { investigrams: [{ key: 'w', qualification: caveat,
    declarations: [{ key: 'withdraw', operation: 'withdraw', displaces: [naming, surface], grounds: { text: 'Organizing judgment based on the received premise.' } }] }] } }]);
  const owner = withdrawn.productions[0]!.investigrams.w!;
  const earlier = answer(), fixed = structuredClone(earlier);
  const arrange = (projection: typeof earlier) => arrangeModuleExports(resolveModuleExports(store, projection), 'module-test', unicode, 'Exports');
  const earlierView = arrange(earlier), earlierText = renderModuleExports(earlierView);
  assert.deepEqual(earlierView.contributions.surface!.uses[0]!.displacements[0]!.producing, []);
  const changed = ledger.accept([{ production: ledger.begin({ producer: agent }), contribution: { investigrams: [{ key: 'change', qualification: caveat,
    declarations: [{ key: 'withdraw-premise', operation: 'withdraw', displaces: [premiseUse],
      qualification: { limitations: ['CAUSE_LIMIT: concerns only the organizing premise.'] }, grounds: { text: 'The organizing premise was withdrawn.' } }] }] } }]);
  const cause = { investigram: changed.productions[0]!.investigrams.change!, declaration: 'withdraw-premise' };
  const fresh = answer(), view = arrange(fresh), text = renderModuleExports(view);
  assert.notEqual(fresh.id, earlier.id);
  for (const use of [view.contributions.naming[0]!, view.contributions.surface!.uses[0]!]) {
    assert.equal(use.standing, 'displaced');
    const change = use.displacements[0]!;
    assert.deepEqual(change.change, { investigram: owner, declaration: 'withdraw' });
    assert.equal(change.production, displacer.id);
    assert.deepEqual(change.producing.map(item => item.change), [cause]);
    assert.equal(change.producing[0]!.grounds?.text, 'The organizing premise was withdrawn.');
    assert.deepEqual(change.producing[0]!.routes, [{ kind: 'exact', association: premiseUse }]);
  }
  assert.match(text, /Displacement production needs reconsideration: 1 later change/);
  assert.match(text, /does not establish an error, reverse the displacement or reinstate the earlier association/);
  assert.match(text, /Reconsideration cause: withdraw — The organizing premise was withdrawn/);
  assert.match(text, /CAUSE_LIMIT/);
  assert.deepEqual(view.module.qualification, earlierView.module.qualification);
  assert.deepEqual(view.exports, earlierView.exports);
  assert.deepEqual(ledger.status.investigram(initial.contributions.surface!.item.investigram).producing, []);
  assert.equal(ledger.standing(surface).state, 'displaced');
  assert.equal(fresh.contributions.support.changes.some(item => item.address.investigram === cause.investigram && item.address.declaration === cause.declaration), true);
  assert.deepEqual(resolveModuleExports(store, earlier).projection, fixed);
  assert.deepEqual(arrange(earlier), earlierView);
  assert.equal(renderModuleExports(arrange(earlier)), earlierText);
  assert.doesNotMatch(earlierText, /needs reconsideration|CAUSE_LIMIT/);
  assert.equal(answer().id, fresh.id);
});

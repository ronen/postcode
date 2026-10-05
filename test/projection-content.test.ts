import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { identityReference, methods, recordId } from '../src/lib/identity.js';
import { resolveModuleProjection } from '../src/lib/module-content.js';
import { arrangeModuleView, createView, renderUnicode } from '../src/lib/presentation.js';
import { inspect, modules } from '../src/lib/projections.js';
import { moduleStandardExpansions } from '../src/lib/records.js';
import type { EvaluationRecord } from '../src/lib/records.js';
import { sourceDisclosure } from '../src/lib/source-disclosure.js';
import { artifactClassificationComplete, resolveOrganizationProjection } from '../src/lib/organization/content.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { arrangeOrganizationView, createOrganizationView, renderOrganizationView } from '../src/lib/organization/presentation.js';
import { inspectOrganization, organization } from '../src/lib/organization/projections.js';
import { resolveDependencyProjection } from '../src/lib/dependencies/content.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateDependencyOrganization } from '../src/lib/dependencies/organization.js';
import { arrangeDependencyView, createDependencyView, renderDependencyView } from '../src/lib/dependencies/presentation.js';
import { dependencyChildren, dependencyStructure } from '../src/lib/dependencies/projections.js';
import { temporaryDirectory } from './cli-helpers.js';
import { discover } from './helpers.js';

function fixture(t: TestContext, files: Record<string, string>) {
  const root = temporaryDirectory(t, 'postcode-projection-content-');
  execFileSync('git', ['init', '--quiet', root]);
  for (const [name, text] of Object.entries({ 'tsconfig.json': '{"compilerOptions":{"noLib":true,"types":[]},"include":["**/*.ts"]}', ...files })) {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), text);
  }
  return root;
}
function frozen(value: unknown, seen = new Set<object>()): void {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  assert.ok(Object.isFrozen(value));
  for (const item of Object.values(value)) frozen(item, seen);
}

test('module content retains full documentation and exports independently of display bounds and source disclosure', async t => {
  const prose = 'Long documented explanation. '.repeat(150);
  const root = fixture(t, { 'large.ts': Array.from({ length: 65 }, (_, i) => `/** ${prose}\n * @example private source example\n */\nexport const item${i} = ${i};`).join('\n') });
  const { store, analysis } = await discover(path.join(root, 'tsconfig.json'));
  const evaluation = evaluateModules(store, analysis, moduleStandardExpansions);
  const projection = inspect(store, evaluation, 'large');
  const content = resolveModuleProjection(store, projection);
  frozen(content);
  const original = structuredClone(content);
  assert.equal(content.modules[0]!.exports.length, 65);
  assert.ok(content.modules[0]!.exports.every(item => item.documentation.some(doc => doc.assertion.record.text.length > 2000)));
  assert.ok(content.modules[0]!.exports[64]!.claim.evidence.length);
  assert.ok(content.contexts.every(item => item.context.inputs === item.inputs?.id));
  const bindings = store.entityIds(content.discovery.modules, 'module');
  const expected = createView(store, projection, { format: 'unicode', sourceDetail: true });
  // A transferred value cannot contain a store closure; filesystem changes cannot refresh it.
  rmSync(path.join(root, 'large.ts'));
  const detached = structuredClone(content);
  const unicode = arrangeModuleView(detached, bindings, { format: 'unicode', sourceDetail: true });
  assert.deepEqual(unicode, expected);
  assert.equal(unicode.modules[0]!.exports.length, 50);
  assert.equal(unicode.modules[0]!.omittedExports, 15);
  assert.ok(unicode.modules[0]!.exports[0]!.documentation[0]!.omittedTextCharacters > 0);
  assert.ok(!unicode.sourceDetail!.items.some(item => item.subject === content.modules[0]!.exports[64]!.claim.record.id));
  const ordinary = arrangeModuleView(detached, bindings, { format: 'json', sourceDetail: false });
  assert.equal(sourceDisclosure(ordinary), null);
  assert.deepEqual(sourceDisclosure(unicode)?.forms, ['locations', 'excerpts']);
  assert.ok(renderUnicode(unicode).includes('large.ts'));
  assert.deepEqual(content, original);
  // Accumulated evaluation metadata does not enter an earlier Projection's content.
  store.put([{ ...evaluation, id: recordId(evaluation.session, 'evaluation', 'unrelated-outcome'), attempt: 99 }]);
  assert.deepEqual(resolveModuleProjection(store, projection), content);
});

test('organization artifact qualification uses supplied completeness with some modules listed and remains self-contained', async t => {
  const root = fixture(t, { 'src/one.ts': 'export const one = 1;', 'src/two.ts': 'export const two = 2;',
    'src/README.md': 'documentation exists', 'src/note.txt': 'artifact' });
  const { store, evaluation } = await discover(path.join(root, 'tsconfig.json'));
  const complete = evaluateOrganization(store, evaluation);
  const completeProjection = inspectOrganization(store, complete, 'src');
  const completeView = createOrganizationView(store, completeProjection, { format: 'unicode', sourceDetail: false });
  assert.match(renderOrganizationView(completeView), /Other artifacts: 1 unanalyzed/);
  assert.match(renderOrganizationView(completeView), /other artifacts remain unanalyzed/);
  const partial: EvaluationRecord = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'partial-population'),
    modules: evaluation.modules.slice(0, 1), execution: 'stopped', materialization: 'partial', reason: 'Synthetic incomplete population.' };
  store.put([partial]);
  const partialPlacement = evaluateOrganization(store, partial);
  const partialArtifacts = { ...complete, id: recordId(evaluation.session, 'organization-evaluation', 'partial-artifact-support'),
    execution: 'stopped' as const, materialization: 'partial' as const, reason: 'Synthetic incomplete artifact support.' };
  store.put([partialArtifacts]);
  for (const outcome of [partialPlacement, partialArtifacts]) {
    const projection = inspectOrganization(store, outcome, 'src');
    const content = resolveOrganizationProjection(store, projection);
    frozen(content);
    const selected = content.groups.find(group => group.selected)!;
    assert.equal(selected.summary.complete, false);
    assert.ok(selected.parents.length > 0);
    for (const parent of selected.parents) {
      const relationship = content.containment.find(item => item.record.subject === parent && item.record.information.child === selected.id);
      assert.ok(relationship);
      assert.equal(relationship.record.context, relationship.context.id);
      assert.equal(relationship.context.inputs, relationship.inputs?.id);
      assert.deepEqual(relationship.evidence.map(item => item.id), relationship.context.evidence);
      assert.ok(relationship.evidence.length > 0);
    }
    assert.ok(selected.modules.length > 0);
    const bindings = { groups: store.entityIds(content.evaluation.groups, 'group'), modules: store.entityIds(content.moduleEvaluation.modules, 'module'),
      detail: store.entityIds(content.moduleDetail!.discovery.modules, 'module') };
    const view = arrangeOrganizationView(structuredClone(content), bindings, { format: 'unicode', sourceDetail: false });
    assert.deepEqual(view, createOrganizationView(store, projection, { format: 'unicode', sourceDetail: false }));
    const group = view.groups.find(group => group.selected)!;
    assert.equal(group.artifacts.unanalyzed, outcome === partialPlacement ? 2 : 1);
    assert.equal(group.documentationCount, 1);
    assert.equal(artifactClassificationComplete(view.evaluations.repository, view.evaluations.placement, group.detail), selected.summary.complete);
    const text = renderOrganizationView(JSON.parse(JSON.stringify(view)));
    assert.match(text, /Other captured artifacts: \d · 0 opaque boundaries \(classification incomplete\)/);
    assert.match(text, /Other captured artifacts have no module or documentation association established in the supplied information; classification is incomplete\./);
    assert.doesNotMatch(text, /unanalyzed/);
    assert.match(text, /Repository layout: available/);
    assert.match(text, /Project placement: available/);
    assert.equal('complete' in group.artifacts, false);
    const json = createOrganizationView(store, projection, { format: 'json', sourceDetail: false });
    assert.deepEqual(json.groups, view.groups);
    assert.deepEqual(json.evaluations, view.evaluations);
    assert.deepEqual(JSON.parse(renderOrganizationView(json)).groups, view.groups);
    const tree = createOrganizationView(store, organization(store, outcome, 'repository'), { format: 'unicode', sourceDetail: false });
    assert.match(renderOrganizationView(tree), /\d other captured artifacts \(classification incomplete\)/);
    assert.equal(sourceDisclosure(view), null);
    for (const context of content.groups.filter(group => !group.selected)) {
      assert.equal(context.detail, 'not-requested');
      assert.equal(context.summary.complete, false);
    }
  }
  assert.equal(partialArtifacts.placement.materialization, 'full');
  assert.deepEqual(createOrganizationView(store, completeProjection, { format: 'unicode', sourceDetail: false }), completeView);
});

test('dependency content keeps unbounded occurrences, graph and qualified organization support outside CLI slices', async t => {
  const root = fixture(t, { 'requests.ts': Array.from({ length: 75 }, () => "import './leaf';").join('\n'), 'leaf.ts': 'export const leaf = 1;',
    ...Object.fromEntries(Array.from({ length: 65 }, (_, i) => [`m${i}.ts`, 'export const item = 1;'])) });
  const { store, analysis } = await discover(path.join(root, 'tsconfig.json'));
  const evaluation = evaluateDependencies(store, analysis, moduleStandardExpansions);
  const basis = store.get(evaluation.moduleEvaluation);
  assert.equal(basis.kind, 'evaluation');
  if (basis.kind !== 'evaluation') throw new Error('Expected module basis');
  const organizationOutcome = evaluateOrganization(store, basis);
  const organized = resolveOrganizationProjection(store, organization(store, organizationOutcome, 'repository'));
  frozen(organized);
  const rootGroup = organized.groups.find(group => group.modules.length === 67)!;
  assert.equal(rootGroup.modules.length, 67);
  assert.equal(rootGroup.summary.moduleAssociated, 67);
  const organizationBindings = { groups: store.entityIds(organizationOutcome.groups, 'group'), modules: store.entityIds(basis.modules, 'module'), detail: new Map() };
  const tree = arrangeOrganizationView(structuredClone(organized), organizationBindings, { format: 'unicode', sourceDetail: false });
  assert.equal(tree.display.omittedModulePlacements, 55);
  assert.equal(tree.groups.find(group => group.id === rootGroup.id)!.modules.length, 67);
  assert.equal(arrangeOrganizationView(structuredClone(organized), organizationBindings, { format: 'json', sourceDetail: false }).display.omittedModulePlacements, 0);
  const expansion = evaluateDependencyOrganization(store, evaluation, organizationOutcome);
  const projection = dependencyChildren(store, evaluation, 'requests', false, expansion.id);
  const content = resolveDependencyProjection(store, projection);
  frozen(content);
  assert.equal(content.relationships[0]!.record.information.occurrences.length, 75);
  assert.equal(Object.keys(content.occurrences).length, 75);
  assert.equal(content.organization[0]!.occurrences.length, 75);
  assert.ok(content.organization[0]!.occurrences[74]!.support.some(item => item.evidence.length > 0));
  assert.equal(content.summary.modules, 2);
  assert.equal(content.summary.projectModules, 67);
  const bindings = store.entityIds(basis.modules, 'module');
  for (const format of ['unicode', 'json'] as const) {
    const view = arrangeDependencyView(structuredClone(content), bindings, { format, sourceDetail: true });
    assert.deepEqual(view, createDependencyView(store, projection, { format, sourceDetail: true }));
    assert.equal(view.relationships[0]!.occurrences.length, format === 'unicode' ? 20 : 50);
    assert.equal(view.relationships[0]!.omittedOccurrences, format === 'unicode' ? 55 : 25);
    assert.equal(view.sourceDetail!.organization[0]!.omittedOccurrences, format === 'unicode' ? 55 : 25);
    assert.ok(sourceDisclosure(view));
    assert.equal(renderDependencyView(JSON.parse(JSON.stringify(view))), renderDependencyView(view));
  }
  const structure = resolveDependencyProjection(store, dependencyStructure(store, evaluation, expansion.id));
  assert.equal(structure.modules.length, 67);
  const unicode = arrangeDependencyView(structuredClone(structure), bindings, { format: 'unicode', sourceDetail: false });
  const json = arrangeDependencyView(structuredClone(structure), bindings, { format: 'json', sourceDetail: false });
  assert.ok(unicode.display.omittedModules > 0);
  assert.equal(json.display.omittedModules, 0);
  assert.equal(sourceDisclosure(unicode), null);
  assert.equal(structure.relationships.length, 1);
});

test('mechanical identities retain their formula and all use the shared presentation method bump', async () => {
  const { store, analysis } = await discover(path.resolve('fixtures/dependency-journey/tsconfig.json'));
  const evaluation = evaluateModules(store, analysis, moduleStandardExpansions);
  const organizationProjection = organization(store, evaluateOrganization(store, evaluation));
  const dependencyProjection = dependencyStructure(store, evaluateDependencies(store, analysis, moduleStandardExpansions));
  const presentation = { format: 'json' as const, sourceDetail: false };
  const views = [createView(store, modules(store, evaluation), presentation), createOrganizationView(store, organizationProjection, presentation),
    createDependencyView(store, dependencyProjection, presentation)];
  assert.equal(methods.presentation, 'postcode/presentation@27');
  for (const [index, view] of views.entries()) {
    const kind = ['view', 'organization-view', 'dependency-view'][index]!;
    const key = { projection: identityReference(view.projection.session, view.projection.id), presentation, method: methods.presentation };
    assert.equal(view.id, recordId(view.projection.session, kind, key));
    assert.notEqual(view.id, recordId(view.projection.session, kind, { ...key, method: 'postcode/presentation@26' }));
  }
});

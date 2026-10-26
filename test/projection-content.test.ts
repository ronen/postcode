import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { identityReference, methods, recordId } from '../src/lib/identity.js';
import { resolveModuleProjection } from '../src/lib/module-content.js';
import { arrangeModuleView, createView, renderUnicode, renderView } from '../src/lib/presentation.js';
import { inspect, modules } from './projection-helpers.js';
import { moduleStandardExpansions } from '../src/lib/records.js';
import type { EvaluationRecord, RecordId, SessionId } from '../src/lib/records.js';
import { sourceDisclosure } from '../src/lib/source-disclosure.js';
import { artifactClassification, artifactClassificationComplete, resolveOrganizationProjection } from '../src/lib/organization/content.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { arrangeOrganizationView, createOrganizationView, renderOrganizationView } from '../src/lib/organization/presentation.js';
import { inspectOrganization, organization } from './projection-helpers.js';
import { resolveDependencyProjection } from '../src/lib/dependencies/content.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateDependencyOrganization } from '../src/lib/dependencies/organization.js';
import { arrangeDependencyView, createDependencyView, renderDependencyView } from '../src/lib/dependencies/presentation.js';
import { dependencyChildren, dependencyParents, dependencyStructure } from './projection-helpers.js';
import { compatiblePresentation, presentations, validatePresentationContent } from '../src/lib/presentation-contracts.js';
import { captureRequest, lenses } from '../src/lib/requests.js';
import type { LensDefinition } from '../src/lib/requests.js';
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

/** Controlled compatible producer: own question/answer identity, unchanged qualified support.
 * This tests the content/Presentation seam, not registration of a production constructor. */
function compatibleAnswer<T extends { readonly id: RecordId; readonly session: SessionId; readonly lens: string }>(answer: T) {
  return { ...answer, lens: 'fixture-compatible-question',
    id: recordId(answer.session, 'fixture-answer', ['fixture-compatible-question', identityReference(answer.session, answer.id)]) };
}

test('the shared module Presentation accepts another question with population and selected content', async t => {
  const root = fixture(t, { 'large.ts': "import 'external';\n" + Array.from({ length: 65 }, (_, index) =>
    `/** Documented export ${index}. ${'Explanation. '.repeat(80)} */\nexport const item${index} = ${index};`).join('\n'),
  'node_modules/external/index.d.ts': 'export const opaque: 1;' });
  const { store, analysis } = await discover(path.join(root, 'tsconfig.json'));
  const basis = evaluateModules(store, analysis, moduleStandardExpansions);
  const bindings = store.entityIds(basis.modules, 'module');
  const definition: LensDefinition = { ...lenses.modules, id: 'fixture-compatible-question', question: 'Fixture qualified module information?',
    title: 'Fixture information', subjects: ['module'], cardinality: 'collection' };
  const captured = captureRequest({ lens: definition.id, selector: 'large', presentation: { format: 'json', sourceDetail: true } }, { [definition.id]: definition });
  assert.equal(captured.normalized.kind, 'lens');
  assert.ok(compatiblePresentation(presentations.find(item => item.contract === 'modules')!, captured.normalized, definition),
    'source policy depends on selected subjects, not inspection implementation identity');
  const population = resolveModuleProjection(store, modules(store, basis));
  const selection = resolveModuleProjection(store, inspect(store, basis, 'large'));
  for (const content of [population, selection]) {
    const compatible = structuredClone({ ...content, projection: compatibleAnswer(content.projection) });
    validatePresentationContent({ contract: 'modules', value: compatible });
    for (const format of ['unicode', 'json'] as const) for (const sourceDetail of [false, true]) {
      const options = { format, sourceDetail };
      if (sourceDetail && content.projection.subject === 'configured-project') {
        assert.throws(() => arrangeModuleView(compatible, bindings, options, definition.title), /Source detail requires selected module content/);
        continue;
      }
      const expected = arrangeModuleView(content, bindings, options, content.projection.lens === 'modules' ? 'Modules' : 'Inspect');
      const actual = arrangeModuleView(compatible, bindings, options, definition.title);
      assert.equal(actual.projection.lens, definition.id);
      assert.notEqual(actual.projection.id, expected.projection.id);
      assert.notEqual(actual.id, expected.id);
      assert.deepEqual(actual, { ...expected, id: actual.id, title: definition.title, projection: { ...expected.projection, id: actual.projection.id, lens: definition.id } });
      assert.equal(renderUnicode(actual), renderUnicode(expected).replace(`${expected.title} ·`, `${definition.title} ·`).replace(expected.projection.id, actual.projection.id));
      assert.equal(JSON.parse(renderView({ ...actual, presentation: { ...actual.presentation, format: 'json' } })).title, definition.title);
      const retitled = arrangeModuleView(compatible, bindings, options, 'Another question label');
      assert.notEqual(retitled.id, actual.id);
      assert.deepEqual(retitled, { ...actual, id: retitled.id, title: 'Another question label' });
      assert.deepEqual(retitled.projection, actual.projection, 'display labels do not change the answer');
      assert.deepEqual(sourceDisclosure(actual), sourceDisclosure(expected));
      assert.deepEqual(arrangeModuleView(structuredClone(compatible), bindings, options, definition.title), actual);
      const large = actual.modules.find(module => module.handle === 'large')!;
      assert.equal(large.exports.length, content === selection ? 50 : format === 'unicode' ? 3 : 6);
      assert.equal(large.omittedExports, 65 - large.exports.length);
      if (content === population && format === 'unicode') assert.ok(actual.display.collapsedModules > 0);
    }
  }
});

test('organization layout and disclosure use supplied subject scope independently of Lens identity', async t => {
  const root = fixture(t, { 'src/entry.ts': 'export const entry = 1;', 'src/README.md': 'Documentation.' });
  const { store, analysis } = await discover(path.join(root, 'tsconfig.json'));
  const basis = evaluateModules(store, analysis, moduleStandardExpansions);
  const outcome = evaluateOrganization(store, basis);
  const bindings = { groups: store.entityIds(outcome.groups, 'group'), modules: store.entityIds(basis.modules, 'module'), detail: store.entityIds(basis.modules, 'module') };
  for (const projection of [organization(store, outcome), organization(store, outcome, 'repository'), inspectOrganization(store, outcome, 'src')]) {
    const content = resolveOrganizationProjection(store, projection);
    const compatible = structuredClone({ ...content, projection: compatibleAnswer(projection) });
    for (const format of ['unicode', 'json'] as const) for (const sourceDetail of [false, true]) {
      const options = { format, sourceDetail };
      if (sourceDetail && projection.subject !== 'selected-entities') {
        assert.throws(() => arrangeOrganizationView(compatible, bindings, options, 'Fixture information'), /Source detail requires selected organization content/);
        continue;
      }
      const expected = arrangeOrganizationView(content, bindings, options, projection.lens === 'organization' ? 'Organization' : 'Inspect');
      const actual = arrangeOrganizationView(compatible, bindings, options, 'Fixture information');
      assert.deepEqual(actual, { ...expected, id: actual.id, title: 'Fixture information',
        projection: { ...expected.projection, id: actual.projection.id, lens: 'fixture-compatible-question' },
        moduleDetail: expected.moduleDetail ? { ...expected.moduleDetail, id: actual.moduleDetail!.id, title: 'Fixture information' } : null });
      assert.notEqual(actual.id, expected.id);
      const retitled = arrangeOrganizationView(compatible, bindings, options, 'Another question label');
      assert.notEqual(retitled.id, actual.id);
      assert.deepEqual(retitled, { ...actual, id: retitled.id, title: 'Another question label',
        moduleDetail: actual.moduleDetail ? { ...actual.moduleDetail, id: retitled.moduleDetail!.id, title: 'Another question label' } : null });
      assert.deepEqual(retitled.projection, actual.projection, 'display labels do not change the answer');
      if (actual.moduleDetail) {
        assert.notEqual(retitled.moduleDetail!.id, actual.moduleDetail.id);
        assert.deepEqual(retitled.moduleDetail!.projection, actual.moduleDetail.projection);
      }
      assert.equal(JSON.parse(renderOrganizationView({ ...actual, presentation: { ...actual.presentation, format: 'json' } })).title, 'Fixture information');
      assert.equal(renderOrganizationView({ ...actual, presentation: { ...actual.presentation, format: 'unicode' } }),
        renderOrganizationView({ ...expected, presentation: { ...expected.presentation, format: 'unicode' } }).replaceAll(`${expected.title} ·`, 'Fixture information ·').replace(expected.projection.id, actual.projection.id));
      assert.deepEqual(arrangeOrganizationView(structuredClone(compatible), bindings, options, 'Fixture information'), actual);
      assert.deepEqual(sourceDisclosure(actual), sourceDisclosure(expected));
    }
  }
});

test('dependency direction and request coverage remain explicit under another question identity', async () => {
  const { store, analysis } = await discover(path.resolve('fixtures/dependency-contract/tsconfig.json'));
  const outcome = evaluateDependencies(store, analysis, moduleStandardExpansions);
  const projections = [dependencyStructure(store, outcome), dependencyChildren(store, outcome, 'requests'), dependencyParents(store, outcome, 'requests')];
  const bindings = store.entityIds(projections.flatMap(projection => projection.modules), 'module');
  assert.deepEqual(projections.map(projection => [projection.subjectRole, projection.coverageScope]),
    [[null, 'evaluation'], ['parent', 'subject-owners'], ['child', 'unattributable-to-subjects']]);
  for (const projection of projections) {
    const content = resolveDependencyProjection(store, projection);
    const compatible = structuredClone({ ...content, projection: compatibleAnswer(projection) });
    for (const format of ['unicode', 'json'] as const) for (const sourceDetail of [false, true]) {
      const options = { format, sourceDetail };
      const expected = arrangeDependencyView(content, bindings, options);
      const actual = arrangeDependencyView(compatible, bindings, options);
      assert.deepEqual(actual, { ...expected, id: actual.id, projection: { ...expected.projection, id: actual.projection.id, lens: 'fixture-compatible-question' } });
      assert.notEqual(actual.id, expected.id);
      assert.equal(renderDependencyView({ ...actual, presentation: { ...actual.presentation, format: 'unicode' } }),
        renderDependencyView({ ...expected, presentation: { ...expected.presentation, format: 'unicode' } }).replace(expected.projection.id, actual.projection.id));
      assert.deepEqual(sourceDisclosure(actual), sourceDisclosure(expected));
    }
  }
  const parent = projections[2]!;
  assert.throws(() => store.put([{ ...parent, id: recordId(parent.session, 'dependency-projection', 'wrong-direction'), subjectRole: 'parent' }]), /direction or coverage/);
  const content = resolveDependencyProjection(store, parent);
  assert.throws(() => validatePresentationContent({ contract: 'dependencies', value: { ...content,
    projection: { ...content.projection, nonEdgeRequests: projections[1]!.nonEdgeRequests } } }), /direction or coverage/);
});

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
  const expected = createView(store, projection, { format: 'unicode', sourceDetail: true }, 'Inspect');
  // A transferred value cannot contain a store closure; filesystem changes cannot refresh it.
  rmSync(path.join(root, 'large.ts'));
  const detached = structuredClone(content);
  const unicode = arrangeModuleView(detached, bindings, { format: 'unicode', sourceDetail: true }, 'Inspect', undefined, { answerReference: expected.answerReference! });
  assert.deepEqual(unicode, expected);
  assert.equal(unicode.modules[0]!.exports.length, 50);
  assert.equal(unicode.modules[0]!.omittedExports, 15);
  assert.ok(unicode.modules[0]!.exports[0]!.documentation[0]!.omittedTextCharacters > 0);
  assert.ok(!unicode.sourceDetail!.items.some(item => item.subject === content.modules[0]!.exports[64]!.claim.record.id));
  const ordinary = arrangeModuleView(detached, bindings, { format: 'json', sourceDetail: false }, 'Inspect');
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
  const completeView = createOrganizationView(store, completeProjection, { format: 'unicode', sourceDetail: false }, 'Inspect');
  assert.match(renderOrganizationView(completeView), /Other artifacts: 1 unanalyzed/);
  assert.match(renderOrganizationView(completeView), /other artifacts remain unanalyzed/);
  assert.throws(() => inspectOrganization(store, complete, 'missing'), /\(missing\)/);
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
    assert.deepEqual(selected.summary.classification, { state: 'incomplete',
      reasons: [outcome === partialPlacement ? 'placement-incomplete' : 'repository-incomplete'] });
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
    const view = arrangeOrganizationView(structuredClone(content), bindings, { format: 'unicode', sourceDetail: false }, 'Inspect', undefined, { answerReference: store.answerIds([projection.id]).get(projection.id)! });
    assert.deepEqual(view, createOrganizationView(store, projection, { format: 'unicode', sourceDetail: false }, 'Inspect'));
    const group = view.groups.find(group => group.selected)!;
    assert.equal(group.artifacts.unanalyzed, outcome === partialPlacement ? 2 : 1);
    assert.equal(group.documentationCount, 1);
    assert.equal(artifactClassificationComplete(view.evaluations.repository, view.evaluations.placement, group.detail), selected.summary.classification.state === 'complete');
    const text = renderOrganizationView(JSON.parse(JSON.stringify(view)));
    assert.match(text, /Other captured artifacts: \d · 0 opaque boundaries \(classification incomplete\)/);
    assert.match(text, /Other captured artifacts have no module or documentation association established in the supplied information; classification is incomplete\./);
    assert.doesNotMatch(text, /unanalyzed/);
    assert.match(text, /Repository layout: available/);
    assert.match(text, /Project placement: available/);
    assert.equal('complete' in group.artifacts, false);
    const json = createOrganizationView(store, projection, { format: 'json', sourceDetail: false }, 'Inspect');
    assert.deepEqual(json.groups, view.groups);
    assert.deepEqual(json.evaluations, view.evaluations);
    assert.deepEqual(JSON.parse(renderOrganizationView(json)).groups, view.groups);
    const tree = createOrganizationView(store, organization(store, outcome, 'repository'), { format: 'unicode', sourceDetail: false }, 'Organization');
    assert.match(renderOrganizationView(tree), /\d other captured artifacts \(classification incomplete\)/);
    assert.throws(() => inspectOrganization(store, outcome, 'missing'), /\(lookup-incomplete\)/);
    assert.match(renderOrganizationView(JSON.parse(JSON.stringify(tree))), /classification is incomplete\./);
    assert.equal(sourceDisclosure(view), null);
    for (const context of content.groups.filter(group => !group.selected)) {
      assert.equal(context.detail, 'not-requested');
      assert.deepEqual(context.summary.classification, { state: 'not-requested', reasons: [] });
    }
  }
  assert.equal(partialArtifacts.placement.materialization, 'full');
  assert.deepEqual(createOrganizationView(store, completeProjection, { format: 'unicode', sourceDetail: false }, 'Inspect'), completeView);
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
  const tree = arrangeOrganizationView(structuredClone(organized), organizationBindings, { format: 'unicode', sourceDetail: false }, 'Organization');
  assert.equal(tree.display.omittedModulePlacements, 55);
  assert.equal(tree.groups.find(group => group.id === rootGroup.id)!.modules.length, 67);
  assert.equal(arrangeOrganizationView(structuredClone(organized), organizationBindings, { format: 'json', sourceDetail: false }, 'Organization').display.omittedModulePlacements, 0);
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
    const view = arrangeDependencyView(structuredClone(content), bindings, { format, sourceDetail: true }, undefined, { answerReference: store.answerIds([projection.id]).get(projection.id)! });
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

test('mechanical View identities include resolution context and use the shared presentation method bump', async () => {
  const { store, analysis } = await discover(path.resolve('fixtures/dependency-journey/tsconfig.json'));
  const evaluation = evaluateModules(store, analysis, moduleStandardExpansions);
  const organizationProjection = organization(store, evaluateOrganization(store, evaluation));
  const dependencyProjection = dependencyStructure(store, evaluateDependencies(store, analysis, moduleStandardExpansions));
  const presentation = { format: 'json' as const, sourceDetail: false };
  const views = [createView(store, modules(store, evaluation), presentation, 'Modules'), createOrganizationView(store, organizationProjection, presentation, 'Organization'),
    createDependencyView(store, dependencyProjection, presentation)];
  assert.equal(methods.presentation, 'postcode/presentation@34');
  for (const [index, view] of views.entries()) {
    const kind = ['view', 'organization-view', 'dependency-view'][index]!;
    const key: Record<string, unknown> = { selectionMode: 'fresh', referenceLifetime: 'session', projection: identityReference(view.projection.session, view.projection.id), presentation,
      ...('title' in view ? { title: view.title } : {}), resolution: null, method: methods.presentation };
    assert.equal(view.id, recordId(view.projection.session, kind, key));
    assert.notEqual(view.id, recordId(view.projection.session, kind, { ...key, method: 'postcode/presentation@29' }));
  }
});


test('artifact classification distinguishes unrequested support and identifies every incomplete basis', () => {
  const full = { applicability: 'applicable', availability: 'available', execution: 'completed', materialization: 'full' } as const;
  assert.deepEqual(artifactClassification(full, full, 'materialized'), { state: 'complete', reasons: [] });
  for (const incomplete of [{ ...full, applicability: 'inapplicable' }, { ...full, availability: 'unavailable' },
    { ...full, execution: 'stopped' }, { ...full, materialization: 'partial' }] as const) {
    assert.deepEqual(artifactClassification(incomplete, full, 'materialized'), { state: 'incomplete', reasons: ['repository-incomplete'] });
    assert.deepEqual(artifactClassification(full, incomplete, 'materialized'), { state: 'incomplete', reasons: ['placement-incomplete'] });
    assert.deepEqual(artifactClassification(incomplete, incomplete, 'materialized'),
      { state: 'incomplete', reasons: ['repository-incomplete', 'placement-incomplete'] });
    assert.deepEqual(artifactClassification(incomplete, incomplete, 'not-requested'), { state: 'not-requested', reasons: [] });
  }
  assert.deepEqual(artifactClassification(full, full, 'not-requested'), { state: 'not-requested', reasons: [] });
});

test('unavailable repository content preserves qualification and a self-contained View', async t => {
  const root = fixture(t, { 'sample.ts': 'export const value = 1;' });
  rmSync(path.join(root, '.git'), { recursive: true });
  const { store, evaluation } = await discover(path.join(root, 'tsconfig.json'));
  const outcome = evaluateOrganization(store, evaluation);
  assert.equal(outcome.availability, 'unavailable');
  assert.throws(() => inspectOrganization(store, outcome, 'missing'), /\(lookup-unavailable\)/);
  for (const projection of [organization(store, outcome, 'repository'), organization(store, outcome, 'configured-project')]) {
    const content = resolveOrganizationProjection(store, projection);
    frozen(content);
    assert.deepEqual(content.groups, []);
    assert.equal(content.evaluation.availability, 'unavailable');
    assert.equal(content.evaluation.placement.availability, 'unavailable');
    const bindings = { groups: store.entityIds(content.evaluation.groups, 'group'), modules: store.entityIds(content.moduleEvaluation.modules, 'module'),
      detail: store.entityIds(content.moduleDetail?.discovery.modules ?? [], 'module') };
    const view = arrangeOrganizationView(structuredClone(content), bindings, { format: 'unicode', sourceDetail: false }, 'Organization', undefined, { answerReference: store.answerIds([projection.id]).get(projection.id)! });
    assert.deepEqual(view, createOrganizationView(store, projection, { format: 'unicode', sourceDetail: false }, 'Organization'));
    const rendered = renderOrganizationView(view);
    assert.equal(renderOrganizationView(JSON.parse(JSON.stringify(view))), rendered);
    assert.match(rendered, /Repository layout: unavailable/);
    assert.match(rendered, /Project placement: unavailable/);
    assert.match(rendered, /classification is incomplete\./);
    assert.doesNotMatch(rendered, /other artifacts remain unanalyzed/);
    assert.equal(sourceDisclosure(view), null);
  }
});

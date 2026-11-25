
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { recordId } from '../src/lib/identity.js';
import { resolveModuleProjection } from '../src/lib/module-content.js';
import { inspect } from './projection-helpers.js';
import { moduleStandardExpansions } from '../src/lib/records.js';
import type { EvaluationRecord } from '../src/lib/records.js';
import { artifactClassification, resolveOrganizationProjection } from '../src/lib/organization/content.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { inspectOrganization, organization } from './projection-helpers.js';
import { resolveDependencyProjection } from '../src/lib/dependencies/content.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateDependencyOrganization } from '../src/lib/dependencies/organization.js';
import { dependencyChildren, dependencyStructure } from './projection-helpers.js';
import { temporaryDirectory } from './temporary-directory.js';
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
  rmSync(path.join(root, 'large.ts'));
  assert.deepEqual(structuredClone(content), original);
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
  const completeContent = resolveOrganizationProjection(store, completeProjection);
  assert.equal(completeContent.groups.find(group => group.selected)!.summary.classification.state, 'complete');
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
    assert.throws(() => inspectOrganization(store, outcome, 'missing'), /\(lookup-incomplete\)/);
    for (const context of content.groups.filter(group => !group.selected)) {
      assert.equal(context.detail, 'not-requested');
      assert.deepEqual(context.summary.classification, { state: 'not-requested', reasons: [] });
    }
  }
  assert.equal(partialArtifacts.placement.materialization, 'full');
  assert.deepEqual(resolveOrganizationProjection(store, completeProjection), completeContent);
});

test('dependency content keeps unbounded occurrences, graph and qualified organization support without display slicing', async t => {
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
  const structure = resolveDependencyProjection(store, dependencyStructure(store, evaluation, expansion.id));
  assert.equal(structure.modules.length, 67);
  assert.equal(structure.relationships.length, 1);
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

test('unavailable repository content preserves qualification and self-contained support', async t => {
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
    assert.deepEqual(structuredClone(content), content);
  }
});

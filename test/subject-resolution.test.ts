import { resolveModuleProjection } from '../src/lib/module-content.js';
import { resolveDependencyProjection } from '../src/lib/dependencies/content.js';
import { resolveOrganizationProjection } from '../src/lib/organization/content.js';
import { openApplication as openSession } from '../src/lib/application/index.js';
import { requireAnswer, requireResolution } from './application-assertions.js';
import { lenses } from '../src/lib/application/lenses.js';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { temporaryDirectory } from './temporary-directory.js';
import { test } from 'node:test';
import { discover } from './helpers.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { dependencyChildren, dependencyParents } from './projection-helpers.js';
import { inspectOrganization } from './projection-helpers.js';
import { inspect } from './projection-helpers.js';
import { resolveSubjects } from '../src/lib/subject-resolution.js';
import { recordId } from '../src/lib/identity.js';
import { moduleStandardExpansions } from '../src/lib/records.js';
import type { EvaluationRecord } from '../src/lib/records.js';

const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');

test('missing and unknown subjects return self-contained reports without requested answers', async t => {
  const opened = await openSession({ configPath });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  for (const lens of ['inspect', 'dependency-children', 'dependency-parents', 'summarize'] as const) {
    const report = requireResolution(await opened.session.execute({ kind: 'lens', lens, designation: { kind: 'name', value: 'no-such-subject' } }));
    assert.equal(report.resolution.reason, 'missing');
    assert.ok(report.resolution.prerequisites.length);
    assert.ok(report.resolution.support!.every(item => item.id && item.population.length));
    assert.deepEqual(report.resolution.retainedAnswers, []);
  }
  assert.equal(put.mock.calls.flatMap(call => call.arguments[0]).some(record => record.kind.endsWith('projection')), false);
  put.mock.resetCalls();
  for (const lens of ['inspect', 'dependency-children', 'dependency-parents', 'summarize', 'explain', 'decompose', 'examine'] as const) {
    const report = requireResolution(await opened.session.execute({ kind: 'lens', lens, designation: { kind: 'reference', value: 'group-00000000' } }));
    assert.equal(report.resolution.reason, 'unknown-reference');
    assert.deepEqual(report.resolution.prerequisites, []);
  }
  assert.equal(put.mock.calls.length, 0);
});

test('qualified name lookup preserves incomplete support and frozen candidates independently of subsequent work', async () => {
  const { store, analysis } = await discover(configPath);
  const basis = evaluateModules(store, analysis);
  const entity = store.get(basis.modules[0]!);
  assert.equal(entity.kind, 'module');
  const claim = store.get(entity.claim);
  assert.equal(claim.kind, 'claim');
  assert.equal(claim.information.type, 'module');
  const partial: EvaluationRecord = { ...basis, id: recordId(basis.session, 'evaluation', 'controlled-partial-lookup'),
    modules: [entity.id], execution: 'stopped', materialization: 'partial', reason: 'Controlled provider limit: additional matches are not established.' };
  store.put([partial]);
  const found = resolveSubjects(store, basis.session, lenses.inspect, { kind: 'name', value: claim.information.handle }, { modules: partial });
  assert.equal(found.status, 'resolved');
  assert.equal(found.candidates.length, 1);
  assert.ok(found.qualifications.includes(partial.reason!));
  const saved = structuredClone(found);
  evaluateModules(store, analysis, moduleStandardExpansions);
  assert.deepEqual(found, saved);
  assert.ok(Object.isFrozen(found.candidates));
  const exact = resolveSubjects(store, basis.session, lenses.summarize, { kind: 'reference', value: found.candidates[0]!.reference });
  assert.equal(exact.status, 'resolved');
  assert.equal(exact.candidates[0]!.id, entity.id);
  const missing = resolveSubjects(store, basis.session, lenses.summarize, { kind: 'name', value: 'absent' }, { modules: partial });
  assert.equal(missing.status, 'lookup-incomplete');
  assert.equal(missing.support[0]!.reason, partial.reason);
  const unavailable = { ...partial, id: recordId(basis.session, 'evaluation', 'controlled-unavailable-lookup'), modules: [], availability: 'unavailable' as const, materialization: 'none' as const };
  store.put([unavailable]);
  assert.equal(resolveSubjects(store, basis.session, lenses.inspect, { kind: 'name', value: 'absent' }, { modules: unavailable }).status, 'lookup-unavailable');
});

test('known modules omitted from a supplied evaluation remain resolved and retain qualified module and dependency answers', async () => {
  const { store, analysis } = await discover(configPath);
  const basis = evaluateModules(store, analysis, moduleStandardExpansions);
  const subject = basis.modules[0]!, reference = subject;
  const narrow: EvaluationRecord = { ...basis, id: recordId(basis.session, 'evaluation', 'controlled-narrow-module-basis'), modules: [] };
  store.put([narrow]);
  const found = resolveSubjects(store, basis.session, lenses.inspect, { kind: 'reference', value: reference }, { modules: narrow });
  assert.equal(found.status, 'resolved');
  assert.equal(found.candidates[0]!.id, subject);
  const projection = inspect(store, narrow, reference, true, [subject]);
  assert.deepEqual(projection.modules, [subject]);
  assert.deepEqual(projection.selection.outsidePopulation, [subject]);
  assert.deepEqual(narrow.modules, [], 'do not invent evaluation membership');
  assert.equal(resolveModuleProjection(store, projection).modules[0]!.id, subject);
  assert.throws(() => store.put([{ ...projection, id: recordId(basis.session, 'projection', 'invalid-omission'),
    selection: { ...projection.selection, outsidePopulation: [] } }]), /materialization qualification/);
  const dependencies = evaluateDependencies(store, analysis);
  const missing = { ...dependencies, id: recordId(basis.session, 'dependency-evaluation', 'controlled-narrow-dependencies'),
    moduleEvaluation: narrow.id, projectModules: [], relationships: [], occurrences: [], coverage: [] };
  store.put([missing]);
  for (const construct of [dependencyChildren, dependencyParents]) {
    const answer = construct(store, missing, reference, true, null, [subject]);
    assert.deepEqual(answer.subjects, [subject]);
    assert.deepEqual(answer.selection.outsidePopulation, [subject]);
    assert.equal(resolveDependencyProjection(store, answer).modules[0]!.id, subject);
  }
});

test('known group omitted from organization retains naming support with unavailable properties and detail', async () => {
  const { store, analysis } = await discover(configPath);
  const modules = evaluateModules(store, analysis, moduleStandardExpansions);
  const basis = evaluateOrganization(store, modules);
  const subject = basis.groups[0]!;
  const raw = resolveSubjects(store, basis.session, lenses.inspect, { kind: 'reference', value: subject });
  assert.equal(raw.status, 'resolved', 'exact retained groups require no prior lookup');
  assert.equal(raw.candidates[0]!.id, subject);
  const reference = subject;
  const narrow = { ...basis, id: recordId(basis.session, 'organization-evaluation', 'controlled-narrow-organization'), groups: [], claims: [] };
  store.put([narrow]);
  const found = resolveSubjects(store, basis.session, lenses.inspect, { kind: 'reference', value: reference }, { organization: narrow });
  assert.equal(found.status, 'resolved');
  const projection = inspectOrganization(store, narrow, reference, true, [subject]);
  assert.deepEqual(projection.groups, [subject]);
  assert.deepEqual(projection.selection.outsidePopulation, [subject]);
  const content = resolveOrganizationProjection(store, projection);
  assert.equal(content.groups[0]!.id, subject);
  assert.equal(content.groups[0]!.detail, 'unavailable');
  assert.equal(content.referenceGroups[subject]!.claim.record.subject, subject);
  assert.equal(content.referenceGroups[subject]!.properties, null);
  assert.deepEqual(content.groups[0]!.summary.classification, { state: 'incomplete', reasons: ['subject-not-materialized'] });
});

test('external dependency endpoints remain valid inspection and summary subjects in the Session', async t => {
  const root = temporaryDirectory(t, 'postcode-resolved-external-');
  mkdirSync(path.join(root, 'node_modules/outside'), { recursive: true });
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"module":"NodeNext","moduleResolution":"NodeNext","noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), "import type { T } from 'outside'; export type U = T;");
  writeFileSync(path.join(root, 'node_modules/outside/package.json'), '{"types":"index.d.ts"}');
  writeFileSync(path.join(root, 'node_modules/outside/index.d.ts'), 'export interface T {}');
  const opened = await openSession({ configPath: path.join(root, 'tsconfig.json') });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const dependencies = requireAnswer(await opened.session.execute({ kind: 'lens', lens: 'dependency-structure', designation: { kind: 'configured-project' } }));
  assert.equal(dependencies.answer.content.contract, 'dependencies');
  const external = dependencies.answer.content.value.modules.find(module => !module.claim.record.information.discoveryFacets.includes('project'));
  assert.ok(external, 'fixture exposes an opaque external endpoint');
  const inspected = requireAnswer(await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: external.id } }));
  assert.equal(inspected.answer.content.contract, 'contribution-inspection');
  assert.equal(inspected.answer.mechanical!.contract, 'modules');
  assert.equal(('modules' in inspected.answer.mechanical!.value ? inspected.answer.mechanical!.value.modules[0]!.id : null), external.id);
  const summary = requireAnswer(await opened.session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'reference', value: external.id } }));
  assert.equal(summary.answer.content.contract, 'contribution');
  assert.equal(summary.reporting!.unavailable!.kind, 'configuration-unavailable');
  assert.deepEqual(summary.answer.content.value.projection.alternatives, []);
});

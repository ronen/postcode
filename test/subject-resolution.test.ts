import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { temporaryDirectory } from './cli-helpers.js';
import { test } from 'node:test';
import { discover } from './helpers.js';
import { requireResolution, requireView } from './request-helpers.js';
import { openSession } from '../src/lib/session.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { dependencyChildren, dependencyParents } from '../src/lib/dependencies/projections.js';
import { createDependencyView, renderDependencyView } from '../src/lib/dependencies/presentation.js';
import { inspectOrganization } from '../src/lib/organization/projections.js';
import { createOrganizationView, renderOrganizationView } from '../src/lib/organization/presentation.js';
import { inspect } from '../src/lib/projections.js';
import { createView, renderView } from '../src/lib/presentation.js';
import { lenses } from '../src/lib/requests.js';
import { resolveSubjects } from '../src/lib/subject-resolution.js';
import { recordId } from '../src/lib/identity.js';
import { moduleStandardExpansions } from '../src/lib/records.js';
import type { EvaluationRecord, ModuleClaim, RecordId } from '../src/lib/records.js';

const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
const presentation = { format: 'json' as const, sourceDetail: false };

test('failed lookup allocates only the complete returned candidate set and preserves later collisions', async t => {
  const { store, evaluation: basis } = await discover(configPath);
  const source = store.get(basis.modules[0]!);
  assert.equal(source.kind, 'module');
  const naming = store.get(source.claim) as ModuleClaim;
  const ids = [1, 2, 3].map(n => `${basis.session}:module:12345678${String(n).repeat(56)}` as RecordId);
  for (const [index, id] of ids.entries()) {
    const claim = { ...naming, id: recordId(basis.session, 'claim', ['collision-lookup', index]), subject: id,
      information: { ...naming.information, name: index ? 'matching' : 'unrelated', handle: `controlled-${index}` } };
    store.put([{ ...source, id, claim: claim.id }, claim]);
  }
  const population = { ...basis, id: recordId(basis.session, 'evaluation', 'collision-lookup'), modules: ids };
  store.put([population]);
  const prior = store.entityIds(basis.modules, 'module');
  const allocations = t.mock.method(store, 'entityIds');
  for (const state of [
    { execution: 'completed' as const, availability: 'available' as const, materialization: 'full' as const, status: 'missing' },
    { execution: 'stopped' as const, availability: 'available' as const, materialization: 'partial' as const, status: 'lookup-incomplete' },
    { execution: 'deferred' as const, availability: 'unavailable' as const, materialization: 'none' as const, status: 'lookup-unavailable' },
  ]) {
    const { status, ...outcome } = state;
    const lookup = { ...population, ...outcome, id: recordId(basis.session, 'evaluation', status) };
    store.put([lookup]);
    assert.equal(resolveSubjects(store, basis.session, lenses.summarize, { kind: 'name', value: 'absent' }, { modules: lookup }).status, status);
  }
  assert.equal(allocations.mock.calls.length, 0);
  const ambiguous = resolveSubjects(store, basis.session, lenses.summarize, { kind: 'name', value: 'matching' }, { modules: population });
  assert.equal(ambiguous.status, 'ambiguous');
  assert.deepEqual(allocations.mock.calls.map(call => call.arguments), [[ids.slice(1), 'module']]);
  assert.deepEqual(ambiguous.candidates.map(item => item.reference), ['module-12345678', 'module-123456783']);
  for (const candidate of ambiguous.candidates) assert.equal(store.boundEntity(basis.session, candidate.reference), candidate.id);
  assert.equal(store.entityIds([ids[0]!], 'module').get(ids[0]!), 'module-123456781', 'unreturned subject gets a longer spelling only when later allocated');
  assert.deepEqual(store.entityIds(basis.modules, 'module'), prior, 'prerequisite bindings remain unchanged');
  assert.deepEqual(store.entityIds(ids.slice(1), 'module'), new Map(ambiguous.candidates.map(item => [item.id, item.reference])));
});

test('successful name lookup preserves group-then-module whole-population allocation', async t => {
  const { store, evaluation: modules } = await discover(configPath);
  const organization = evaluateOrganization(store, modules);
  const module = store.get(modules.modules[0]!);
  assert.equal(module.kind, 'module');
  const naming = store.get(module.claim);
  assert.equal(naming.kind, 'claim');
  assert.equal(naming.information.type, 'module');
  const allocations = t.mock.method(store, 'entityIds');
  const resolved = resolveSubjects(store, modules.session, lenses.inspect, { kind: 'name', value: naming.information.handle }, { modules, organization });
  assert.equal(resolved.status, 'resolved');
  assert.deepEqual(allocations.mock.calls.map(call => call.arguments), [[organization.groups, 'group'], [modules.modules, 'module']]);
});

test('raw and compact precise designations share mechanical answers and retain distinct request spellings', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const inventory = requireView(await opened.session.execute({ lens: 'modules', selector: null, presentation })).view;
  assert.equal(inventory.schema, 'postcode-view/1-experimental');
  const module = inventory.modules[0]!;
  const organized = requireView(await opened.session.execute({ lens: 'organization', selector: null, presentation })).view;
  assert.equal(organized.schema, 'postcode-organization-view/1-experimental');
  const group = organized.groups.find(item => item.selected)!;
  for (const [target, applicable] of [[module, ['inspect', 'children', 'parents', 'summarize']], [group, ['inspect']]] as const) {
    for (const lens of applicable) {
      const raw = requireView(await opened.session.execute({ lens, selector: target.id, reference: true, presentation }));
      const compact = requireView(await opened.session.execute({ lens, selector: target.entityId, reference: true, presentation }));
      assert.equal(raw.resolution.candidates[0]!.id, compact.resolution.candidates[0]!.id);
      assert.deepEqual(raw.view.projection, compact.view.projection, `${lens} retains the same answer descriptor`);
      assert.notDeepEqual(raw.context.request, compact.context.request);
      assert.match(raw.resolution.criteria.join(' '), /retained same-Session/);
    }
  }
  for (const selector of [group.id, group.entityId]) {
    const refused = requireResolution(await opened.session.execute({ lens: 'children', selector, reference: true, presentation }));
    assert.equal(refused.resolution.reason, 'unsupported-subject');
    assert.equal(refused.resolution.candidates[0]!.id, group.id);
  }
  const literal = requireResolution(await opened.session.execute({ lens: 'inspect', selector: module.id, presentation }));
  assert.equal(literal.resolution.reason, 'missing', 'raw-looking literals do not become references');
  const other = await openSession({ configPath });
  if (other.status !== 'opened') throw new Error('Expected other project');
  t.after(() => other.session.close());
  for (const selector of [module.id, group.id, inventory.projection.id]) {
    const refused = requireResolution(await other.session.execute({ lens: 'inspect', selector, reference: true, presentation }));
    assert.equal(refused.resolution.reason, 'unknown-reference');
  }
  const nonEntity = requireResolution(await opened.session.execute({ lens: 'inspect', selector: inventory.projection.id, reference: true, presentation }));
  assert.equal(nonEntity.resolution.reason, 'unknown-reference');
});

test('bound group survives inspection and dependency refusals without application work or new bindings', async t => {
  const opened = await openSession({ configPath });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const organized = requireView(await opened.session.execute({ lens: 'organization', selector: null, presentation }));
  assert.equal(organized.view.schema, 'postcode-organization-view/1-experimental');
  const target = organized.view.groups.find(group => group.selected)!;
  const request = { lens: 'inspect' as const, selector: target.entityId, reference: true, presentation };
  const before = requireView(await opened.session.execute(request));
  const bindings = t.mock.method(MemoryProgramRecordStore.prototype, 'entityIds');
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  for (const lens of ['children', 'parents', 'summarize', 'explain', 'decompose', 'examine'] as const) {
    const report = requireResolution(await opened.session.execute({ ...request, lens }));
    assert.equal(report.resolution.reason, 'unsupported-subject');
    assert.deepEqual(report.resolution.candidates.map(item => [item.id, item.kind, item.reference]), [[target.id, 'group', target.entityId]]);
    assert.deepEqual(report.resolution.prerequisites, []);
    assert.deepEqual(report.resolution.retainedAnswers, []);
  }
  assert.equal(bindings.mock.calls.length, 0, 'classification must not allocate populations');
  assert.equal(put.mock.calls.length, 0, 'unsupported targets require no Evaluation or requested Projection');
  const after = requireView(await opened.session.execute(request));
  assert.deepEqual(after.view, before.view);
});

test('missing and unknown subjects return self-contained reports without requested answers', async t => {
  const opened = await openSession({ configPath });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  for (const lens of ['inspect', 'children', 'parents', 'summarize'] as const) {
    const report = requireResolution(await opened.session.execute({ lens, selector: 'no-such-subject', presentation }));
    assert.equal(report.resolution.reason, 'missing');
    assert.ok(report.resolution.prerequisites.length);
    assert.ok(report.resolution.support!.every(item => item.id && item.population.length));
    assert.deepEqual(report.resolution.retainedAnswers, []);
  }
  assert.equal(put.mock.calls.flatMap(call => call.arguments[0]).some(record => record.kind.endsWith('projection')), false);
  put.mock.resetCalls();
  for (const lens of ['inspect', 'children', 'parents', 'summarize', 'explain', 'decompose', 'examine'] as const) {
    const report = requireResolution(await opened.session.execute({ lens, selector: 'group-00000000', reference: true, presentation }));
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
  store.entityIds(basis.modules, 'module');
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
  const subject = basis.modules[0]!, reference = store.entityIds(basis.modules, 'module').get(subject)!;
  const narrow: EvaluationRecord = { ...basis, id: recordId(basis.session, 'evaluation', 'controlled-narrow-module-basis'), modules: [] };
  store.put([narrow]);
  const found = resolveSubjects(store, basis.session, lenses.inspect, { kind: 'reference', value: reference }, { modules: narrow });
  assert.equal(found.status, 'resolved');
  assert.equal(found.candidates[0]!.id, subject);
  const projection = inspect(store, narrow, reference, true, [subject]);
  assert.deepEqual(projection.modules, [subject]);
  assert.deepEqual(projection.selection.outsidePopulation, [subject]);
  assert.deepEqual(narrow.modules, [], 'do not invent evaluation membership');
  assert.throws(() => store.put([{ ...projection, id: recordId(basis.session, 'projection', 'invalid-omission'),
    selection: { ...projection.selection, outsidePopulation: [] } }]), /materialization qualification/);
  assert.equal(createView(store, projection, presentation).modules[0]!.id, subject);
  assert.match(renderView(createView(store, projection, { ...presentation, format: 'unicode' })), /outside the supplied evaluation population/);
  const dependencies = evaluateDependencies(store, analysis);
  const missing = { ...dependencies, id: recordId(basis.session, 'dependency-evaluation', 'controlled-narrow-dependencies'),
    moduleEvaluation: narrow.id, projectModules: [], relationships: [], occurrences: [], coverage: [] };
  store.put([missing]);
  for (const construct of [dependencyChildren, dependencyParents]) {
    const answer = construct(store, missing, reference, true, null, [subject]);
    assert.deepEqual(answer.subjects, [subject]);
    assert.deepEqual(answer.selection.outsidePopulation, [subject]);
    assert.equal(createDependencyView(store, answer, presentation).modules[0]!.id, subject);
    const text = renderDependencyView(createDependencyView(store, answer, { ...presentation, format: 'unicode' }));
    assert.match(text, /outside the supplied evaluation population/);
    assert.doesNotMatch(text, /None in the supported project-owned request population/);
  }
});

test('known group omitted from organization retains naming support with unavailable properties and detail', async t => {
  const { store, analysis } = await discover(configPath);
  const modules = evaluateModules(store, analysis, moduleStandardExpansions);
  const basis = evaluateOrganization(store, modules);
  const subject = basis.groups[0]!;
  const allocations = t.mock.method(store, 'entityIds');
  const raw = resolveSubjects(store, basis.session, lenses.inspect, { kind: 'reference', value: subject });
  assert.equal(raw.status, 'resolved', 'retained groups need not already have compact bindings');
  assert.equal(raw.candidates[0]!.id, subject);
  assert.equal(allocations.mock.calls.length, 0);
  const reference = store.entityIds(basis.groups, 'group').get(subject)!;
  const narrow = { ...basis, id: recordId(basis.session, 'organization-evaluation', 'controlled-narrow-organization'), groups: [], claims: [] };
  store.put([narrow]);
  const found = resolveSubjects(store, basis.session, lenses.inspect, { kind: 'reference', value: reference }, { organization: narrow });
  assert.equal(found.status, 'resolved');
  const projection = inspectOrganization(store, narrow, reference, true, [subject]);
  assert.deepEqual(projection.groups, [subject]);
  assert.deepEqual(projection.selection.outsidePopulation, [subject]);
  const shown = createOrganizationView(store, projection, { ...presentation, sourceDetail: true });
  assert.equal(shown.groups[0]!.id, subject);
  assert.equal(shown.groups[0]!.documented, null);
  assert.equal(shown.groups[0]!.modulePresence, null);
  assert.equal(shown.groups[0]!.detail, 'unavailable');
  assert.equal(shown.sourceDetail!.groups.length, 1);
  assert.match(renderOrganizationView({ ...shown, presentation: { ...shown.presentation, format: 'unicode' } }), /outside the supplied evaluation population/);
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
  const dependencies = requireView(await opened.session.execute({ lens: 'dependencies', selector: null, presentation }));
  assert.equal(dependencies.view.schema, 'postcode-dependency-view/1-experimental');
  const external = dependencies.view.modules.find(module => !module.discoveryFacets.includes('project'));
  assert.ok(external, 'fixture exposes an opaque external endpoint');
  const inspected = requireView(await opened.session.execute({ lens: 'inspect', selector: external.entityId, reference: true, presentation }));
  assert.equal(inspected.view.schema, 'postcode-view/1-experimental');
  assert.equal(inspected.view.modules[0]!.id, external.id);
  const summary = requireView(await opened.session.execute({ lens: 'summarize', selector: external.entityId, reference: true, presentation }));
  assert.equal(summary.view.schema, 'postcode-investigation-view/1-experimental');
  assert.deepEqual(summary.view.selected, [external.id]);
  assert.equal(summary.view.result!.unavailable!.kind, 'configuration-unavailable');
});

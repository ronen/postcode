import { contributeModuleFindings } from '../src/lib/contributions/modules.js';
import { contributeNativeFindings } from '../src/lib/contributions/native.js';
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { discover } from './helpers.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { emptyModuleDetail, inspect, modules } from '../src/lib/projections.js';
import { inspectOrganization, organization } from '../src/lib/organization/projections.js';
import { dependencyChildren, dependencyParents, dependencyStructure } from '../src/lib/dependencies/projections.js';
import { recordId } from '../src/lib/identity.js';
import type { EvaluationRecord, RecordId } from '../src/lib/records.js';
import { openApplication as openSession } from '../src/lib/application/index.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';

const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');

test('unordered selections canonicalize whole payloads independently of caller order', async () => {
  const { store, evaluation, analysis } = await discover(configPath);
  const organized = evaluateOrganization(store, evaluation);
  const dependencies = evaluateDependencies(store, analysis);
  assert.ok(evaluation.modules.length >= 2 && organized.groups.length >= 2);
  // Real retained populations with a deliberately non-ID order distinguish population order from sorting.
  const modulePopulation = evaluation.modules.slice(0, 2).sort().reverse();
  const groupPopulation = organized.groups.slice(0, 2).sort().reverse();
  const moduleBasis: EvaluationRecord = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'ordered-narrow-modules'), modules: modulePopulation };
  const groupBasis = { ...organized, id: recordId(evaluation.session, 'organization-evaluation', 'ordered-narrow-groups'),
    moduleEvaluation: moduleBasis.id, groups: groupPopulation, claims: [] };
  const dependencyBasis = { ...dependencies, id: recordId(evaluation.session, 'dependency-evaluation', 'ordered-narrow-dependencies'),
    moduleEvaluation: moduleBasis.id, projectModules: modulePopulation, relationships: [], occurrences: [], coverage: [] };
  store.put([moduleBasis, groupBasis, dependencyBasis]);

  // Outside-population subjects use precise record order, independently of request order.
  const outsiders = (kind: 'module' | 'group') => {
    const source = store.get(kind === 'module' ? evaluation.modules[0]! : organized.groups[0]!);
    if (source.kind !== 'module' && source.kind !== 'group') throw new Error('Expected subject');
    const naming = store.get(source.claim);
    if (naming.kind !== 'claim') throw new Error('Expected naming claim');
    const context = store.get(naming.context);
    if (context.kind !== 'claim-context') throw new Error('Expected naming context');
    const ids = [1, 2].map(n => `${evaluation.session}:${kind}:12345678${String(n).repeat(56)}` as RecordId);
    for (const id of ids) {
      const claimId = recordId(evaluation.session, 'claim', id), contextId = recordId(evaluation.session, 'claim-context', id);
      store.put([{ ...source, id, claim: claimId }, { ...naming, id: claimId, subject: id, context: contextId },
        { ...context, id: contextId, scope: id }]);
    }
    // Controlled providers must use the same contribution boundary as the real provider.
    if (kind === 'module') {
      const produced = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'outsider-modules'), modules: ids };
      store.put([produced]); contributeModuleFindings(store, produced);
    }
    else contributeNativeFindings(store, evaluation.session, ids);
    return { ids };
  };
  const outsideModules = outsiders('module'), outsideGroups = outsiders('group');
  const expectedModules = [...modulePopulation, ...outsideModules.ids], expectedGroups = [...groupPopulation, ...outsideGroups.ids];
  const cases = [
    { build: (subjects: readonly RecordId[]) => inspect(store, moduleBasis, subjects), subjects: expectedModules,
      schedule: [[modulePopulation, 'module']] },
    { build: (subjects: readonly RecordId[]) => inspectOrganization(store, groupBasis, subjects), subjects: [...expectedGroups, ...expectedModules],
      schedule: [[groupPopulation, 'group'], [modulePopulation, 'module']] },
    ...[dependencyChildren, dependencyParents].map(build => ({ build: (subjects: readonly RecordId[]) => build(store, dependencyBasis, subjects),
      subjects: expectedModules, schedule: [[modulePopulation, 'module']] })),
  ];
  for (const item of cases) {
    const payloads = [item.subjects, [...item.subjects].reverse(), [...item.subjects.slice(1), item.subjects[0]!]].map(subjects => {
      const before = structuredClone(subjects);
      const answer = item.build(subjects);
      assert.deepEqual(subjects, before, 'caller inputs remain unchanged');
      return answer;
    });
    assert.deepEqual(payloads[0], payloads[1]);
    assert.deepEqual(payloads[0], payloads[2], 'canonicalization applies to the entire retained payload and ID');
    const answer = payloads[0]!;
    assert.deepEqual(answer.kind === 'dependency-projection' ? answer.subjects : answer.modules, expectedModules);
    assert.deepEqual(answer.selection.outsidePopulation,
      answer.kind === 'organization-projection' ? [...outsideGroups.ids, ...outsideModules.ids] : outsideModules.ids);
    if (answer.kind === 'organization-projection') {
      assert.deepEqual(answer.groups, expectedGroups);
      const embedded = store.get(answer.moduleProjection!);
      assert.equal(embedded.kind, 'projection');
      assert.deepEqual(embedded.kind === 'projection' && embedded.modules, expectedModules);
    }
    assert.throws(() => item.build([...item.subjects, item.subjects[0]!]), /Duplicate|Invalid inspection subject/);
  }
});

test('ordinary empty inspection is an invariant violation while embedded detail and empty populations remain valid', async t => {
  const { store, evaluation, analysis } = await discover(configPath);
  const basis = evaluateOrganization(store, evaluation);
  const writes = t.mock.method(store, 'put');
  assert.throws(() => inspect(store, evaluation, []), /requires at least one resolved subject/);
  assert.equal(writes.mock.calls.length, 0);
  const group = inspectOrganization(store, basis, [basis.groups[0]!]);
  const embedded = store.get(group.moduleProjection!);
  assert.deepEqual(embedded, emptyModuleDetail(store, evaluation));
  assert.equal(embedded.kind, 'projection');
  assert.deepEqual(embedded.kind === 'projection' && embedded.modules, []);
  const emptyBasis = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'valid-empty-population'), modules: [] };
  store.put([emptyBasis]);
  assert.deepEqual(modules(store, emptyBasis).modules, []);
  const emptyGroups = { ...basis, id: recordId(evaluation.session, 'organization-evaluation', 'valid-empty-groups'),
    moduleEvaluation: emptyBasis.id, groups: [], claims: [] };
  const dependencies = evaluateDependencies(store, analysis);
  const emptyDependencies = { ...dependencies, id: recordId(evaluation.session, 'dependency-evaluation', 'valid-empty-dependencies'),
    moduleEvaluation: emptyBasis.id, projectModules: [], relationships: [], occurrences: [], coverage: [] };
  store.put([emptyGroups, emptyDependencies]);
  assert.deepEqual(organization(store, emptyGroups, 'repository').groups, []);
  assert.deepEqual(dependencyStructure(store, emptyDependencies).subjects, []);
});

test('unsuccessful user lookup returns a resolution result without ordinary or embedded answer construction', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected fixture Session');
  t.after(() => opened.session.close());
  const writes = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  const result = await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'name', value: 'absent-collection-subject' } });
  assert.equal(result.kind, 'resolution');
  assert.equal(result.resolution.reason, 'missing');
  assert.equal(writes.mock.calls.flatMap(call => call.arguments[0]).some(record => record.kind.endsWith('projection')), false);
});

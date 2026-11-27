import assert from 'node:assert/strict';
import { test } from 'node:test';
import { recordModuleEvaluation } from '../src/lib/evaluation.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { evaluateDependencyOrganization } from '../src/lib/dependencies/organization.js';
import { recordId, sessionId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { DiscoveryResult } from '../src/lib/evaluation.js';
import type { RecordId } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { completedMaterialization } from '../src/lib/evaluation-state.js';

function synthetic() {
  const session = sessionId();
  const store = new MemoryProgramRecordStore();
  const repository = recordId(session, 'repository', 'unavailable');
  store.put([{ kind: 'session', id: session, session, method: 'test', methods: ['test'], repository },
    { kind: 'repository-evidence', id: repository, session, method: 'test',
      capture: { status: 'unavailable', reason: 'not-in-worktree', operation: 'test', code: null }, layout: null }]);
  const discovery: DiscoveryResult = { session, modules: [], contexts: [], applicability: 'applicable', availability: 'available',
    execution: 'completed', materialization: 'full', reason: null, cost: { measure: 'module-count', value: 0 } };
  return { store, session, discovery };
}

test('coupled publication rejects the root and expansion together and leaves no evaluation index residue', () => {
  const { store, session, discovery } = synthetic();
  const invalid = { ...discovery, expansions: [{ ...discovery, requirement: 'exports' as const,
    claims: [recordId(session, 'claim', 'absent')] }] };
  assert.throws(() => recordModuleEvaluation(store, invalid), /reference/);
  assert.deepEqual(store.evaluations(session), []);
  const accepted = recordModuleEvaluation(store, discovery);
  assert.equal(accepted.attempt, 1);
  assert.equal(store.lookup(accepted.id), accepted);
  assert.equal(store.evaluations(session)[0], accepted);
  assert.equal(store.get(session).kind, 'session');
});

test('evaluation results are owned immutable values, independent of the producer and index consumers', () => {
  const { store, discovery, session } = synthetic();
  const producer = { ...discovery, modules: [] as RecordId[], cost: { measure: 'module-count' as const, value: 0 } };
  const result = recordModuleEvaluation(store, producer);
  producer.modules.push(recordId(session, 'module', 'later')); producer.cost.value = 42;
  assert.deepEqual(result.modules, []); assert.equal(result.cost.value, 0);
  assert.throws(() => (result.modules as RecordId[]).push(session), TypeError);
  assert.throws(() => Object.assign(result.cost, { value: 12 }), TypeError);
  assert.equal(recordModuleEvaluation(store, discovery), result);
  (store.evaluations(session) as unknown[]).pop();
  assert.equal(store.evaluations(session)[0], result);
  assert.equal(store.lookup(recordId(session, 'missing', 'x')), undefined);
});

test('pure unavailable derivations are reused without submission and different immutable bases derive anew', () => {
  const { store, discovery } = synthetic();
  const dependency = evaluateDependencies(store, { discover: () => discovery });
  assert.equal(dependency, store.get(dependency.id));
  const basis = store.get(dependency.moduleEvaluation);
  if (basis.kind !== 'evaluation') throw new Error('Expected evaluation');
  const organization = evaluateOrganization(store, basis);
  const expansion = evaluateDependencyOrganization(store, dependency, organization);
  assert.equal(organization, store.get(organization.id)); assert.equal(expansion, store.get(expansion.id));
  assert.equal(organization.availability, 'unavailable');
  const put = store.put.bind(store); let submissions = 0;
  store.put = records => { submissions++; put(records); };
  assert.equal(evaluateOrganization(store, basis), organization);
  assert.equal(evaluateDependencyOrganization(store, dependency, organization), expansion);
  assert.equal(submissions, 0);
  const partial = recordModuleEvaluation(store, { ...discovery, execution: 'stopped', materialization: 'partial' });
  assert.notEqual(evaluateOrganization(store, partial).id, organization.id);
  assert.deepEqual(store.get(organization.id), organization);
});

test('provider discovery cannot be mutated to affect retained results or later discovery', async () => {
  const opened = (await openTypeScriptProject({ configPath: 'fixtures/exports/tsconfig.json' }));
  if (opened.status !== 'opened') throw new Error('Expected opened project');
  const store = new MemoryProgramRecordStore();
  const first = opened.analysis.discover(store, ['exports', 'documentation', 'composition'], true);
  const retained = structuredClone(first);
  assert.throws(() => (first.modules as RecordId[]).pop(), TypeError);
  assert.throws(() => (first.expansions![0]!.claims as RecordId[]).pop(), TypeError);
  assert.throws(() => Object.assign(first.dependencies!.cost, { value: 99 }), TypeError);
  assert.deepEqual(opened.analysis.discover(store, ['exports', 'documentation', 'composition'], true), retained);
  const later = opened.analysis.discover(store);
  assert.deepEqual(later.modules, retained.modules);
});

test('completed materialization leaves independent availability and applicability dimensions unchanged', () => {
  for (const applicability of ['applicable', 'inapplicable'] as const) for (const availability of ['available', 'unavailable'] as const) {
    const { store, discovery } = synthetic();
    const result = recordModuleEvaluation(store, { ...discovery, applicability, availability });
    assert.equal(completedMaterialization(result), true);
    assert.equal(result.applicability, applicability); assert.equal(result.availability, availability);
    assert.equal(recordModuleEvaluation(store, { ...discovery, applicability, availability }), result);
  }
});

test('evaluation query visits only session evaluations as unrelated stored evidence grows', t => {
  const { store, session, discovery } = synthetic();
  const outcome = recordModuleEvaluation(store, discovery);
  const values = Map.prototype.values;
  let visited = 0;
  t.mock.method(Map.prototype, 'values', function* (this: Map<unknown, unknown>) {
    for (const value of values.call(this)) { visited++; yield value; }
  });
  for (const size of [10, 1000]) {
    store.put(Array.from({ length: size }, (_, index) => ({ kind: 'analysis-inputs' as const,
      id: recordId(session, 'inputs', index), session, method: 'test', value: index })));
    visited = 0;
    assert.deepEqual(store.evaluations(session), [outcome]);
    assert.equal(visited, 1);
  }
});

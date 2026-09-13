import type { RecordId } from '../src/lib/records.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { methods, recordId, snapshotId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { inspect, modules } from '../src/lib/projections.js';
import type { ClaimContextRecord, EvaluationState, ModuleClaim, ModuleRecord, SnapshotRecord } from '../src/lib/records.js';
import { discover } from './helpers.js';

function context() {
  const snapshot = snapshotId({ fixture: 'record-boundary', methods });
  const record: SnapshotRecord = {
    id: snapshot, snapshot, kind: 'snapshot', method: 'test@0', inputDigest: 'fixture', methods: ['test@0'],
  };
  const store = new MemoryProgramRecordStore();
  store.put([record]);
  return { store, snapshot, record };
}

test('store rejects overwrites, missing/cross-snapshot/wrong-kind references and leaves batches atomic', () => {
  const { store, snapshot, record } = context();
  assert.throws(() => store.put([{ ...record, method: 'changed' }]), /collision/);
  const invalid: ModuleRecord = {
    kind: 'module', id: recordId(snapshot, 'module', 'bad'), snapshot, method: 'test@0',
    claim: recordId(snapshot, 'claim', 'missing'),
  };
  assert.throws(() => store.put([invalid]), /reference/);
  assert.throws(() => store.get(invalid.id), /Missing/);
  assert.throws(() => store.put([{ ...invalid, claim: snapshot }]), /Expected claim/);
  const other = snapshotId('other');
  store.put([{ ...record, id: other, snapshot: other }]);
  assert.throws(() => store.put([{ ...invalid, claim: other }]), /reference/);
  assert.deepEqual(store.get(snapshot), record);
});

test('store owns immutable copies rather than sharing mutable producer values', () => {
  const { store, snapshot } = context();
  const record = store.get(snapshot);
  assert.ok(Object.isFrozen(record));
  assert.throws(() => Object.assign(record, { method: 'mutated' }), TypeError);
  const input = { ...record, methods: ['test@0'] } as SnapshotRecord;
  store.put([input]);
  (input.methods as string[]).push('mutated');
  assert.deepEqual((store.get(snapshot) as SnapshotRecord).methods, ['test@0']);
});

test('unavailable, deferred, failed, stopped and partial outcomes survive without becoming an established empty population', () => {
  const { store, snapshot } = context();
  const states: EvaluationState[] = [
    { applicability: 'applicable', availability: 'unavailable', execution: 'deferred', materialization: 'none', reason: 'Provider unavailable', cost: { measure: 'module-count', value: 0 } },
    { applicability: 'applicable', availability: 'available', execution: 'deferred', materialization: 'none', reason: 'Not scheduled', cost: { measure: 'module-count', value: 0 } },
    { applicability: 'applicable', availability: 'available', execution: 'failed', materialization: 'none', reason: 'Analysis failed', cost: { measure: 'module-count', value: 0 } },
    { applicability: 'applicable', availability: 'available', execution: 'stopped', materialization: 'partial', reason: 'Stopped by caller', cost: { measure: 'module-count', value: 0 } },
  ];
  for (const state of states) {
    const outcome = evaluateModules(store, { discover: () => ({ ...state, snapshot, modules: [], contexts: [] }) });
    const projection = modules(store, outcome);
    assert.equal(projection.selection.populationEstablished, false);
    assert.equal(projection.evaluations.length, 1);
    assert.equal((store.get(outcome.id) as typeof outcome).reason, state.reason);
  }
  assert.equal(store.evaluations(snapshot).length, states.length);
  const earlier = store.evaluations(snapshot)[0]!;
  const established = evaluateModules(store, { discover: () => ({
    snapshot, modules: [], contexts: [], applicability: 'applicable', availability: 'available',
    execution: 'completed', materialization: 'full', reason: null, cost: { measure: 'module-count', value: 0 },
  }) });
  assert.equal(modules(store, established).selection.populationEstablished, true);
  assert.deepEqual(modules(store, established).evaluations, [established.id]);
  assert.deepEqual(store.get(earlier.id), earlier);
});

test('compiler/implementation defects are not mislabeled as ordinary analysis failure', () => {
  const { store } = context();
  const defect = new Error('Broken invariant');
  assert.throws(() => evaluateModules(store, { discover: () => { throw defect; } }), error => error === defect);
});

test('duplicate exact names and handles select multiple modules and only their contexts', () => {
  const { store, snapshot } = context();
  const ids = ['first', 'second', 'other'].map(key => recordId(snapshot, 'module', key));
  for (const [index, id] of ids.entries()) {
    const context: ClaimContextRecord = {
      kind: 'claim-context', id: recordId(snapshot, 'context', id), snapshot, method: 'test@0', scope: id,
      evidence: [], status: 'mechanically-derived', guarantee: 'Synthetic fixture', limitations: [], diagnostics: [],
    };
    const claim: ModuleClaim = {
      kind: 'claim', id: recordId(snapshot, 'claim', id), snapshot, method: 'test@0', subject: id, context: context.id,
      information: { type: 'module', name: index < 2 ? 'duplicate' : 'other', handle: index < 2 ? 'shared-handle' : 'other-handle',
        handleStatus: 'generated-navigation-aid', handleProvenance: 'anonymous-fallback', facets: [] },
    };
    store.put([{ kind: 'module', id, snapshot, method: 'test@0', claim: claim.id }, context, claim]);
  }
  const evaluation = evaluateModules(store, { discover: () => ({
    snapshot, modules: ids, contexts: [], applicability: 'applicable', availability: 'available',
    execution: 'completed', materialization: 'full', reason: null, cost: { measure: 'module-count', value: 3 },
  }) });
  for (const selector of ['duplicate', 'shared-handle']) {
    const projection = inspect(store, evaluation, selector, evaluation.snapshot);
    assert.deepEqual(projection.modules, ids.slice(0, 2));
    assert.equal(projection.selection.matches, 2);
    assert.equal(projection.contexts.length, 2);
    assert.equal(projection.selection.subset, true);
  }
});

test('multiple snapshots coexist; stale IDs and scoped handles have no inferred successor', () => {
  const initial = discover('fixtures/module-population/tsconfig.json');
  const next = discover('fixtures/empty/tsconfig.json');
  evaluateModules(initial.store, next.analysis);
  assert.equal(initial.store.evaluations(initial.evaluation.snapshot).length, 1);
  assert.equal(initial.store.evaluations(next.evaluation.snapshot).length, 1);
  assert.equal(inspect(initial.store, next.evaluation, initial.claims[0]!.subject).selection.matches, 0);
  assert.equal(inspect(initial.store, next.evaluation, initial.claims[0]!.information.handle).selection.matches, 0);
});

test('compact module Entity IDs extend colliding prefixes across the complete population', async () => {
  const { moduleEntityIds } = await import('../src/lib/identity.js');
  const ids = ['12345678a', '12345678b', '12345679a'].map(prefix =>
    `${snapshotId('collision-fixture')}:module:${prefix.padEnd(64, '0')}` as RecordId);
  const compact = moduleEntityIds(ids);
  assert.deepEqual([...compact.values()], ['module-12345678a', 'module-12345678b', 'module-12345679']);
  assert.deepEqual([...moduleEntityIds([...ids].reverse())], [...compact]);
  assert.equal(new Set(compact.values()).size, ids.length);
});

import type { RecordId } from '../src/lib/records.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { methods, recordId, snapshotId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { inspect, modules } from '../src/lib/projections.js';
import type { ClaimContextRecord, DocumentationAssociationClaim, EvaluationState, ModuleClaim, ModuleRecord, ProgramRecord, SnapshotRecord, SymbolClaim } from '../src/lib/records.js';
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

test('snapshot records require their own matching identity even when referencing a valid pending or stored snapshot', () => {
  for (const existingTarget of [false, true]) {
    const { store, record } = context();
    const targetId = snapshotId('valid-target');
    const target: SnapshotRecord = { ...record, id: targetId, snapshot: targetId };
    const malformed: SnapshotRecord = { ...target, id: snapshotId('orphan') };
    const marker: ClaimContextRecord = { kind: 'claim-context', id: recordId(targetId, 'context', 'marker'),
      snapshot: targetId, method: 'test@0', scope: 'configured-project', evidence: [],
      status: 'mechanically-derived', guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
    if (existingTarget) store.put([target]);
    const batch = [marker, malformed, ...(existingTarget ? [] : [target])];
    assert.throws(() => store.put(batch), /invalid snapshot/i);
    for (const rejected of batch) assert.throws(() => store.get(rejected.id), /Missing/);
    assert.deepEqual(store.get(record.id), record);
    if (!existingTarget) store.put([target]);
    assert.deepEqual(store.get(targetId), target);
    store.put([marker]);
    assert.deepEqual(store.get(marker.id), marker);
  }
});

test('entity claims require the matching discriminator and reciprocal subject before any batch is committed', () => {
  for (const kind of ['module', 'symbol'] as const) {
    for (const mismatch of ['discriminator', 'subject', 'export-claim'] as const) {
      for (const existingTarget of [false, true]) {
        const { store, snapshot, record } = context();
        const id = (key: string) => recordId(snapshot, 'test', key);
        const base = { snapshot, method: 'test@0' };
        const claimContext: ClaimContextRecord = { ...base, kind: 'claim-context', id: id('context'),
          scope: 'configured-project', evidence: [], status: 'mechanically-derived',
          guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
        const moduleClaim: ModuleClaim = { ...base, kind: 'claim', id: id('module-claim'),
          subject: id('module'), context: claimContext.id, information: { type: 'module', name: null,
            handle: 'fixture', handleStatus: 'generated-navigation-aid', handleProvenance: 'anonymous-fallback', facets: [] } };
        const symbolClaim: SymbolClaim = { ...base, kind: 'claim', id: id('symbol-claim'),
          subject: id('symbol'), context: claimContext.id, information: { type: 'symbol', name: 'fixture',
            roles: { type: false, value: true }, declarationCount: 1 } };
        const valid: ProgramRecord[] = [claimContext, moduleClaim, symbolClaim,
          { ...base, id: id('module'), kind: 'module', claim: moduleClaim.id },
          { ...base, id: id('symbol'), kind: 'symbol', claim: symbolClaim.id },
          { ...base, id: id('export-claim'), kind: 'claim', subject: id('module'), context: claimContext.id,
            information: { type: 'export', exportedName: 'fixture', symbol: id('symbol'), origin: id('module'), roles: null, routes: [] } }];
        const target = mismatch === 'export-claim' ? 'export' : mismatch === 'subject' ? kind : kind === 'module' ? 'symbol' : 'module';
        const invalid: ProgramRecord = { ...base, kind, id: id('invalid'), claim: id(`${target}-claim`) };
        if (existingTarget) store.put(valid);
        const marker: ClaimContextRecord = { ...claimContext, id: id('uncommitted') };
        assert.throws(() => store.put([marker, invalid, ...(existingTarget ? [] : valid)]), /entity claim/);
        for (const rejected of [marker, invalid, ...(existingTarget ? [] : valid)]) {
          assert.throws(() => store.get(rejected.id), /Missing/);
        }
        assert.deepEqual(store.get(snapshot), record);
        if (!existingTarget) store.put(valid);
        for (const accepted of valid) assert.deepEqual(store.get(accepted.id), accepted);
      }
    }
  }
});

test('documentation associations validate subject kinds and export discriminators atomically for pending and existing targets', () => {
  for (const association of ['module', 'origin-symbol', 'export-alias'] as const) {
    for (const target of ['module', 'symbol', 'export', 'module-claim', 'symbol-claim', 'context', 'assertion'] as const) {
      for (const existingTarget of [false, true]) {
        const { store, snapshot, record } = context();
        const id = (key: string) => recordId(snapshot, 'test', key);
        const base = { snapshot, method: 'test@0' };
        const claimContext: ClaimContextRecord = { ...base, kind: 'claim-context', id: id('context'),
          scope: 'configured-project', evidence: [], status: 'mechanically-derived',
          guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
        const valid: ProgramRecord[] = [claimContext,
          { ...base, kind: 'module', id: id('module'), claim: id('module-claim') },
          { ...base, kind: 'symbol', id: id('symbol'), claim: id('symbol-claim') },
          { ...base, kind: 'claim', id: id('module-claim'), subject: id('module'), context: claimContext.id,
            information: { type: 'module', name: null, handle: 'fixture', handleStatus: 'generated-navigation-aid',
              handleProvenance: 'anonymous-fallback', facets: [] } },
          { ...base, kind: 'claim', id: id('symbol-claim'), subject: id('symbol'), context: claimContext.id,
            information: { type: 'symbol', name: 'fixture', roles: { type: false, value: true }, declarationCount: 1 } },
          { ...base, kind: 'claim', id: id('export'), subject: id('module'), context: claimContext.id,
            information: { type: 'export', exportedName: 'fixture', symbol: id('symbol'), origin: id('module'), roles: null, routes: [] } },
          { ...base, kind: 'recorded-assertion', id: id('assertion'), context: claimContext.id,
            status: 'recorded-assertion', text: 'Fixture documentation', tags: [] }];
        const claim: DocumentationAssociationClaim = { ...base, kind: 'claim', id: id('documentation'),
          subject: id(target), context: claimContext.id,
          information: { type: 'documentation-association', association, assertion: id('assertion') } };
        const marker: ClaimContextRecord = { ...claimContext, id: id('marker') };
        if (existingTarget) store.put(valid);
        const batch = [marker, claim, ...(existingTarget ? [] : valid)];
        const expected = association === 'module' ? 'module' : association === 'origin-symbol' ? 'symbol' : 'export';
        if (target === expected) {
          store.put(batch);
          assert.deepEqual(store.get(claim.id), claim);
        } else {
          assert.throws(() => store.put(batch), /documentation subject/);
          for (const rejected of batch) assert.throws(() => store.get(rejected.id), /Missing/);
        }
        assert.deepEqual(store.get(snapshot), record);
        if (!existingTarget) store.put(valid);
        for (const accepted of valid) assert.deepEqual(store.get(accepted.id), accepted);
      }
    }
  }
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

test('an export claim cannot serve as a module primary claim even with a reciprocal subject', () => {
  const { store, snapshot } = context();
  const module: ModuleRecord = { kind: 'module', id: recordId(snapshot, 'module', 'invalid-primary'),
    snapshot, method: 'test@0', claim: recordId(snapshot, 'claim', 'invalid-primary') };
  const claimContext: ClaimContextRecord = { kind: 'claim-context', id: recordId(snapshot, 'context', 'primary'),
    snapshot, method: 'test@0', scope: module.id, evidence: [], status: 'mechanically-derived',
    guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
  assert.throws(() => store.put([module, claimContext, {
    kind: 'claim', id: module.claim, snapshot, method: 'test@0', subject: module.id, context: claimContext.id,
    information: { type: 'export', exportedName: 'fixture', symbol: null, origin: null, roles: null, routes: [] },
  }]), /Invalid module entity claim/);
  for (const id of [module.id, module.claim, claimContext.id]) assert.throws(() => store.get(id), /Missing/);
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

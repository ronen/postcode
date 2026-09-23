import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { recordId, sessionId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { inspect, modules } from '../src/lib/projections.js';
import type { ClaimContextRecord, DocumentationAssociationClaim, EvaluationState, ModuleClaim, ModuleRecord, ProgramRecord, SessionRecord, SymbolClaim } from '../src/lib/records.js';
import { discover } from './helpers.js';

function context() {
  const session = sessionId();
  const record: SessionRecord = {
    id: session, session, kind: 'session', method: 'test@0', methods: ['test@0'],
  };
  const store = new MemoryProgramRecordStore();
  store.put([record]);
  return { store, session, record };
}

test('store rejects overwrites, missing/cross-session/wrong-kind references and leaves batches atomic', () => {
  const { store, session, record } = context();
  assert.throws(() => store.put([{ ...record, method: 'changed' }]), /collision/);
  const invalid: ModuleRecord = {
    kind: 'module', id: recordId(session, 'module', 'bad'), session, method: 'test@0',
    claim: recordId(session, 'claim', 'missing'),
  };
  assert.throws(() => store.put([invalid]), /reference/);
  assert.throws(() => store.get(invalid.id), /Missing/);
  assert.throws(() => store.put([{ ...invalid, claim: session }]), /Expected claim/);
  const other = sessionId();
  store.put([{ ...record, id: other, session: other }]);
  assert.throws(() => store.put([{ ...invalid, claim: other }]), /reference/);
  assert.deepEqual(store.get(session), record);
});

test('session records require their own matching identity even when referencing a valid pending or stored session', () => {
  for (const existingTarget of [false, true]) {
    const { store, record } = context();
    const targetId = sessionId();
    const target: SessionRecord = { ...record, id: targetId, session: targetId };
    const malformed: SessionRecord = { ...target, id: sessionId() };
    const marker: ClaimContextRecord = { kind: 'claim-context', id: recordId(targetId, 'context', 'marker'),
      session: targetId, method: 'test@0', scope: 'configured-project', evidence: [],
      status: 'mechanically-derived', guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
    if (existingTarget) store.put([target]);
    const batch = [marker, malformed, ...(existingTarget ? [] : [target])];
    assert.throws(() => store.put(batch), /invalid session/i);
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
        const { store, session, record } = context();
        const id = (key: string) => recordId(session, 'test', key);
        const base = { session, method: 'test@0' };
        const claimContext: ClaimContextRecord = { ...base, kind: 'claim-context', id: id('context'),
          scope: 'configured-project', evidence: [], status: 'mechanically-derived',
          guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
        const moduleClaim: ModuleClaim = { ...base, kind: 'claim', id: id('module-claim'),
          subject: id('module'), context: claimContext.id, information: { type: 'module', name: null,
            handle: 'fixture', handleStatus: 'generated-navigation-aid', handleProvenance: 'anonymous-fallback', discoveryFacets: [] } };
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
        assert.deepEqual(store.get(session), record);
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
        const { store, session, record } = context();
        const id = (key: string) => recordId(session, 'test', key);
        const base = { session, method: 'test@0' };
        const claimContext: ClaimContextRecord = { ...base, kind: 'claim-context', id: id('context'),
          scope: 'configured-project', evidence: [], status: 'mechanically-derived',
          guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
        const valid: ProgramRecord[] = [claimContext,
          { ...base, kind: 'module', id: id('module'), claim: id('module-claim') },
          { ...base, kind: 'symbol', id: id('symbol'), claim: id('symbol-claim') },
          { ...base, kind: 'claim', id: id('module-claim'), subject: id('module'), context: claimContext.id,
            information: { type: 'module', name: null, handle: 'fixture', handleStatus: 'generated-navigation-aid',
              handleProvenance: 'anonymous-fallback', discoveryFacets: [] } },
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
        assert.deepEqual(store.get(session), record);
        if (!existingTarget) store.put(valid);
        for (const accepted of valid) assert.deepEqual(store.get(accepted.id), accepted);
      }
    }
  }
});

test('store owns immutable copies rather than sharing mutable producer values', () => {
  const { store, session } = context();
  const record = store.get(session);
  assert.ok(Object.isFrozen(record));
  assert.throws(() => Object.assign(record, { method: 'mutated' }), TypeError);
  const input = { ...record, methods: ['test@0'] } as SessionRecord;
  store.put([input]);
  (input.methods as string[]).push('mutated');
  assert.deepEqual((store.get(session) as SessionRecord).methods, ['test@0']);
});

test('an export claim cannot serve as a module primary claim even with a reciprocal subject', () => {
  const { store, session } = context();
  const module: ModuleRecord = { kind: 'module', id: recordId(session, 'module', 'invalid-primary'),
    session, method: 'test@0', claim: recordId(session, 'claim', 'invalid-primary') };
  const claimContext: ClaimContextRecord = { kind: 'claim-context', id: recordId(session, 'context', 'primary'),
    session, method: 'test@0', scope: module.id, evidence: [], status: 'mechanically-derived',
    guarantee: 'Synthetic fixture', limitations: [], diagnostics: [] };
  assert.throws(() => store.put([module, claimContext, {
    kind: 'claim', id: module.claim, session, method: 'test@0', subject: module.id, context: claimContext.id,
    information: { type: 'export', exportedName: 'fixture', symbol: null, origin: null, roles: null, routes: [] },
  }]), /Invalid module entity claim/);
  for (const id of [module.id, module.claim, claimContext.id]) assert.throws(() => store.get(id), /Missing/);
});

test('unavailable, deferred, failed, stopped and partial outcomes survive without becoming an established empty population', () => {
  const { store, session } = context();
  const states: EvaluationState[] = [
    { applicability: 'applicable', availability: 'unavailable', execution: 'deferred', materialization: 'none', reason: 'Provider unavailable', cost: { measure: 'module-count', value: 0 } },
    { applicability: 'applicable', availability: 'available', execution: 'deferred', materialization: 'none', reason: 'Not scheduled', cost: { measure: 'module-count', value: 0 } },
    { applicability: 'applicable', availability: 'available', execution: 'failed', materialization: 'none', reason: 'Analysis failed', cost: { measure: 'module-count', value: 0 } },
    { applicability: 'applicable', availability: 'available', execution: 'stopped', materialization: 'partial', reason: 'Stopped by caller', cost: { measure: 'module-count', value: 0 } },
  ];
  for (const state of states) {
    const outcome = evaluateModules(store, { discover: () => ({ ...state, session, modules: [], contexts: [] }) });
    const projection = modules(store, outcome);
    assert.equal(projection.selection.populationEstablished, false);
    assert.equal(projection.evaluations.length, 1);
    assert.equal((store.get(outcome.id) as typeof outcome).reason, state.reason);
  }
  assert.equal(store.evaluations(session).length, states.length);
  const earlier = store.evaluations(session)[0]!;
  const established = evaluateModules(store, { discover: () => ({
    session, modules: [], contexts: [], applicability: 'applicable', availability: 'available',
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
  const { store, session } = context();
  const ids = ['first', 'second', 'other'].map(key => recordId(session, 'module', key));
  for (const [index, id] of ids.entries()) {
    const context: ClaimContextRecord = {
      kind: 'claim-context', id: recordId(session, 'context', id), session, method: 'test@0', scope: id,
      evidence: [], status: 'mechanically-derived', guarantee: 'Synthetic fixture', limitations: [], diagnostics: [],
    };
    const claim: ModuleClaim = {
      kind: 'claim', id: recordId(session, 'claim', id), session, method: 'test@0', subject: id, context: context.id,
      information: { type: 'module', name: index < 2 ? 'duplicate' : 'other', handle: index < 2 ? 'shared-handle' : 'other-handle',
        handleStatus: 'generated-navigation-aid', handleProvenance: 'anonymous-fallback', discoveryFacets: [] },
    };
    store.put([{ kind: 'module', id, session, method: 'test@0', claim: claim.id }, context, claim]);
  }
  const evaluation = evaluateModules(store, { discover: () => ({
    session, modules: ids, contexts: [], applicability: 'applicable', availability: 'available',
    execution: 'completed', materialization: 'full', reason: null, cost: { measure: 'module-count', value: 3 },
  }) });
  for (const selector of ['duplicate', 'shared-handle']) {
    const projection = inspect(store, evaluation, selector);
    assert.deepEqual(projection.modules, ids.slice(0, 2));
    assert.equal(projection.selection.matches, 2);
    assert.equal(projection.contexts.length, 2);
    assert.equal(projection.selection.subset, true);
  }
});

test('multiple sessions coexist; old record IDs do not bind in another session', () => {
  const initial = discover('fixtures/module-population/tsconfig.json');
  const next = discover('fixtures/empty/tsconfig.json');
  evaluateModules(initial.store, next.analysis);
  assert.equal(initial.store.evaluations(initial.evaluation.session).length, 1);
  assert.equal(initial.store.evaluations(next.evaluation.session).length, 1);
  assert.equal(inspect(initial.store, next.evaluation, initial.claims[0]!.subject).selection.matches, 0);
  assert.equal(inspect(initial.store, next.evaluation, initial.claims[0]!.information.handle).selection.matches, 0);
});

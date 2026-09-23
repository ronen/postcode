import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { openSession } from '../src/lib/session.js';
import { observationBatch } from '../src/lib/observations.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { recordId } from '../src/lib/identity.js';
import { discover, normalizeSession } from './helpers.js';

const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
const request = { lens: 'dependencies' as const, selector: null, presentation: { format: 'json' as const, sourceDetail: true } };

test('one-shot sessions own a project, produce correlated views, and release their state', () => {
  const open = () => {
    const result = openSession({ configPath });
    assert.equal(result.status, 'opened');
    if (result.status !== 'opened') throw new Error('Expected project');
    return result.session;
  };
  const first = open();
  const second = open();
  try {
    assert.notEqual(first.id, second.id);
    const a = first.execute(request), b = second.execute(request);
    assert.equal(a.view.projection.session, first.id);
    assert.equal(b.view.projection.session, second.id);
    assert.deepEqual(normalizeSession(a.view), normalizeSession(b.view));
    assert.deepEqual(normalizeSession(a.rendered), normalizeSession(b.rendered));
    const batch = observationBatch(a.view, a.rendered, { configPath, repositoryRoot: a.repositoryRoot, methods: a.methods }, 1);
    assert.equal(batch.session, first.id);
    assert.equal(batch.command, 1);
    assert.equal(batch.formatVersion, 1);
    assert.deepEqual(batch.events.map(event => event.type), ['view-produced', 'source-escape']);
    assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, a.rendered);
    assert.deepEqual(first.execute(request), a);
    assert.throws(() => observationBatch(a.view, a.rendered, { configPath, repositoryRoot: a.repositoryRoot, methods: a.methods }, 0), /command order/);
  } finally { first.close(); second.close(); }
  assert.throws(() => first.execute(request), /closed/);
  first.close();
});

test('claim input support is a retained record distinct from session identity and validates at the store boundary', () => {
  const result = discover(configPath);
  const context = result.contexts[0]!;
  assert.ok(context.inputs);
  const inputs = result.store.get(context.inputs);
  assert.equal(inputs.kind, 'analysis-inputs');
  assert.notEqual(inputs.id, result.evaluation.session);
  assert.ok(Object.isFrozen(inputs));
  if (inputs.kind !== 'analysis-inputs') throw new Error('Expected input support');
  assert.ok(Object.isFrozen(inputs.value));
  assert.throws(() => result.store.put([{ ...inputs, value: 'overwritten' }]), /Immutable record collision/);
  const session = result.store.get(result.evaluation.session);
  assert.equal(session.kind, 'session');
  assert.equal('inputDigest' in session, false);
  const invalid = { ...context, id: recordId(context.session, 'context', 'bad-inputs'), inputs: session.id };
  assert.throws(() => result.store.put([invalid]), /Expected analysis-inputs/);
  assert.throws(() => result.store.get(invalid.id), /Missing program record/);
  const unrelated = new MemoryProgramRecordStore();
  assert.throws(() => unrelated.put([inputs]), /invalid session/);
});

test('accumulation preserves complete earlier views and precise references across independent requests', () => {
  const opened = openSession({ configPath });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') return;
  const { session } = opened;
  try {
    const inventory = session.execute({ ...request, lens: 'modules', presentation: { format: 'json', sourceDetail: false } });
    const before = structuredClone(inventory);
    const dependency = session.execute(request);
    assert.deepEqual(session.execute({ ...request, lens: 'modules', presentation: { format: 'json', sourceDetail: false } }), before);
    assert.deepEqual(inventory, before);
    assert.deepEqual(session.execute(request), dependency);
    if (inventory.view.schema !== 'postcode-view/1-experimental') throw new Error('Expected inventory');
    const module = inventory.view.modules.find(item => item.handle === 'forward')!;
    const selected = session.execute({ ...request, lens: 'inspect', selector: module.entityId, reference: true });
    assert.equal(selected.view.projection.selection.matches, 1);
    assert.ok(selected.rendered.includes(module.entityId));
    session.execute({ ...request, lens: 'organization', subject: 'repository', presentation: { format: 'json', sourceDetail: false } });
    assert.deepEqual(session.execute(request), dependency);
    const fresh = openSession({ configPath });
    if (fresh.status !== 'opened') throw new Error('Expected project');
    try {
      assert.deepEqual(normalizeSession(fresh.session.execute(request)), normalizeSession(dependency));
      assert.deepEqual(normalizeSession(fresh.session.execute({ ...request, lens: 'modules', presentation: { format: 'json', sourceDetail: false } })), normalizeSession(inventory));
    } finally { fresh.session.close(); }
  } finally { session.close(); }
});

test('growing reference allocations cannot steal or lengthen earlier bindings', async () => {
  const { EntityBindings, sessionId } = await import('../src/lib/identity.js');
  const session = sessionId();
  const a = recordId(session, 'module', 'a');
  const colliding = (suffix: string) => `${session}:module:${'12345678' + suffix.padEnd(56, '0')}` as typeof a;
  const bindings = new EntityBindings();
  const first = bindings.allocate([colliding('b')], 'module').get(colliding('b'));
  const later = bindings.allocate([colliding('a'), colliding('b'), colliding('bc')], 'module');
  assert.equal(first, 'module-12345678');
  assert.equal(later.get(colliding('b')), first);
  assert.equal(new Set(later.values()).size, 3);
  assert.deepEqual(bindings.allocate([...later.keys()].reverse(), 'module').get(colliding('b')), first);
});

test('Unicode reference misses preserve reference syntax and status in organization and module inspection', async () => {
  const opened = openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  const inspection = { ...request, lens: 'inspect' as const, selector: 'forward', presentation: { format: 'unicode' as const, sourceDetail: false } };
  try {
    const exact = opened.session.execute(inspection);
    assert.equal(exact.view.projection.selection.matches, 1);
    const miss = opened.session.execute({ ...inspection, reference: true });
    assert.equal(miss.view.projection.selection.matches, 0);
    assert.match(miss.rendered, /0 exact matches for @forward · unknown-reference/);
    assert.equal(miss.view.schema, 'postcode-organization-view/1-experimental');
    const { inspect } = await import('../src/lib/projections.js');
    const { createView, renderUnicode } = await import('../src/lib/presentation.js');
    const { store, evaluation } = discover(configPath);
    const moduleMiss = createView(store, inspect(store, evaluation, 'forward', true), inspection.presentation);
    assert.match(renderUnicode(moduleMiss), /no exact match for @forward · unknown-reference/);
  } finally { opened.session.close(); }
});

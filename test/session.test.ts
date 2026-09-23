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
    assert.throws(() => first.execute(request), /one request per session/);
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

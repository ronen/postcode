import assert from 'node:assert/strict';
import { test } from 'node:test';
import { freezeOwned, ImmutableCapture } from '../src/lib/immutable.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { recordId, sessionId } from '../src/lib/identity.js';

test('capture trusts its own deep copies, never a caller freeze, and snapshots mutable state independently', () => {
  const capture = new ImmutableCapture();
  const external = Object.freeze({ nested: { text: 'original' } });
  const content = capture.capture(external);
  assert.notEqual(content, external);
  external.nested.text = 'changed';
  assert.equal(content.nested.text, 'original');
  assert.throws(() => Object.assign(content.nested, { text: 'mutated' }), TypeError);
  const state = { standing: 'standing', causes: [] as string[] };
  const earlier = capture.capture({ selected: [content], state });
  state.standing = 'displaced'; state.causes.push('later withdrawal');
  const later = capture.capture({ selected: [content], state });
  assert.equal(earlier.selected[0], content); assert.equal(later.selected[0], content);
  assert.notEqual(earlier.selected, later.selected);
  assert.deepEqual(earlier.state, { standing: 'standing', causes: [] });
  assert.deepEqual(later.state, state);
  const arbitraryFrozen = Object.freeze({ nested: Object.freeze({ value: 1 }) });
  assert.notEqual(capture.capture(arbitraryFrozen).nested, arbitraryFrozen.nested);
});

test('capture preserves plain structured graph aliases, cycles, sparse arrays and own prototype-named fields', () => {
  const capture = new ImmutableCapture();
  const shared = { value: 1 }, array = new Array(3);
  array[2] = shared;
  const value = { shared, again: shared, array, nullPrototype: Object.assign(Object.create(null), { name: 'x' }),
    special: JSON.parse('{"__proto__":{"data":true}}'), self: null as unknown };
  value.self = value;
  const actual = capture.capture(value);
  assert.deepEqual(actual, structuredClone(value));
  assert.equal(actual.shared, actual.again); assert.equal(actual.array[2], actual.shared); assert.equal(actual.self, actual);
  assert.ok(Object.isFrozen(actual.shared)); assert.ok(Object.isFrozen(actual.array));
  assert.equal(capture.capture(actual), actual);
  capture.dispose();
  const late = capture.capture(actual);
  assert.notEqual(late, actual); assert.notEqual(late.shared, actual.shared);
  assert.deepEqual(late, actual);
  assert.equal(late.self, late); assert.equal(late.again, late.shared); assert.equal(late.array[2], late.shared);
  assert.ok(Object.isFrozen(late)); assert.ok(Object.isFrozen(late.array)); assert.ok(Object.isFrozen(late.shared));
  assert.throws(() => Object.assign(late.shared, { value: 2 }), TypeError);
  assert.notEqual(capture.capture(late), late, 'Capturing cycles after disposal does not restore ownership reuse');
});

test('freezing owned graphs follows cycles and still visits descendants of shallow-frozen nodes', () => {
  const nested = { values: [1] }, root = Object.freeze({ nested, alias: nested });
  Object.assign(nested, { parent: root });
  assert.equal(freezeOwned(root), root);
  assert.equal(root.alias, nested);
  assert.ok(Object.isFrozen(nested)); assert.ok(Object.isFrozen(nested.values));
  assert.throws(() => nested.values.push(2), TypeError);
});

test('native fallback copies the whole graph with aliasing and getter behavior, and never brands exotic values', () => {
  const capture = new ImmutableCapture();
  const child = { value: 1 }, map = new Map([['child', child]]);
  let reads = 0;
  const value = { child, map, get property() { reads++; return child; } };
  const actual = capture.capture(value);
  assert.equal(reads, 1); assert.equal(actual.map.get('child'), actual.child); assert.equal(actual.property, actual.child);
  child.value = 2; assert.equal(actual.child.value, 1);
  assert.notEqual(capture.capture(actual), actual, 'Exotic graph is not accepted as deeply immutable');
  assert.throws(() => capture.capture({ callback() {} }), { name: 'DataCloneError' });
  assert.throws(() => capture.capture(new Proxy({}, {})), { name: 'DataCloneError' });
  const cyclic = { child, get self(): unknown { return cyclic; } };
  const fallback = capture.capture(cyclic);
  assert.equal(fallback.self, fallback); assert.notEqual(fallback.child, child);
  assert.ok(Object.isFrozen(fallback)); assert.ok(Object.isFrozen(fallback.child));
});

test('ownership is independent per boundary and disposal cannot recreate sharing bookkeeping', () => {
  const first = new ImmutableCapture(), second = new ImmutableCapture();
  const a = first.capture({ nested: { value: 1 } });
  const b = second.capture(a);
  assert.notEqual(a, b); assert.notEqual(a.nested, b.nested);
  first.dispose(); first.dispose();
  assert.notEqual(first.capture(a), a);
  const late = first.capture({ value: 2 });
  assert.notEqual(first.capture(late), late, 'Late work does not revive the disposed registry');
  assert.equal(second.capture(b), b, 'Disposing another owner leaves this boundary live');
  assert.deepEqual(structuredClone(a), a); assert.ok(Object.isFrozen(a.nested));
});

test('shared store values still undergo collision, same-Session and atomic batch validation', () => {
  const store = new MemoryProgramRecordStore(), session = sessionId(), other = sessionId();
  store.put([{ kind: 'session', id: session, session, method: 'test', methods: ['test'] },
    { kind: 'session', id: other, session: other, method: 'test', methods: ['test'] }]);
  const first = store.get(session);
  store.put([first]); assert.equal(store.get(session), first);
  const inputs = { kind: 'analysis-inputs' as const, id: recordId(session, 'inputs', 'one'), session, method: 'test', value: { complete: true } };
  const capturedCollision = store.capture({ ...first, method: 'collision' });
  assert.throws(() => store.put([inputs, capturedCollision]), /collision/);
  assert.equal(store.lookup(inputs.id), undefined);
  const wrongSession = store.capture({ kind: 'claim-context' as const, id: recordId(session, 'context', 'invalid'), session, method: 'test',
    scope: 'configured-project' as const, evidence: [other], status: 'mechanically-derived' as const, guarantee: '', limitations: [], diagnostics: [] });
  assert.throws(() => store.put([inputs, wrongSession]), /reference/);
  assert.equal(store.lookup(inputs.id), undefined); assert.equal(store.get(session), first);
  store.put([inputs]); inputs.value.complete = false;
  const retained = store.get(inputs.id); assert.equal(retained.kind, 'analysis-inputs');
  assert.deepEqual(retained.value, { complete: true });
  store.releaseOwnership();
  assert.notEqual(store.capture(retained), retained);
  assert.deepEqual(structuredClone(retained), retained);
});

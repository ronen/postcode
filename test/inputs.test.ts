import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { captureInputs } from '../src/lib/typescript/inputs.js';

test('exclusion checks resolve a missing candidate once regardless of exclusion count', context => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-exclusion-probes-'));
  try {
    const candidate = path.join(root, 'missing/deep/source.ts');
    const one = captureInputs([path.join(root, 'out-0')]);
    const many = captureInputs(Array.from({ length: 12 }, (_, index) => path.join(root, `out-${index}`)));
    const lstat = context.mock.method(fs, 'lstatSync');
    syncBuiltinESMExports();
    const counts = () => lstat.mock.callCount();
    assert.equal(one.excluded(candidate), false);
    const first = counts();
    assert.ok(first > 1);
    assert.equal(many.excluded(candidate), false);
    assert.deepEqual(counts() - first, first);
    const before = counts();
    assert.equal(many.excluded(path.join(root, 'out-11/missing.ts')), true);
    assert.deepEqual(counts(), before);
    assert.equal(captureInputs([]).excluded(candidate), false);
    assert.deepEqual(counts(), before);
  } finally { context.mock.restoreAll(); syncBuiltinESMExports(); rmSync(root, { recursive: true, force: true }); }
});

test('unexpected candidate resolution defects propagate rather than becoming absence', t => {
  const inputs = captureInputs([path.resolve('_observations')]);
  t.mock.method(fs.realpathSync, 'native', () => { throw new Error('controlled resolution defect'); });
  assert.throws(() => inputs.system.fileExists(path.resolve('source.ts')), /controlled resolution defect/);
});

test('validation preserves captured identity and revision when a missing candidate becomes cyclic', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-replay-absence-'));
  try {
    const candidate = path.join(root, 'candidate');
    const inputs = captureInputs([path.join(root, 'output')]);
    assert.equal(inputs.system.fileExists(candidate), false);
    assert.equal(inputs.system.readFile(candidate), undefined);
    const identity = inputs.identity(), revision = inputs.revision();
    symlinkSync(candidate, candidate);
    assert.equal(inputs.changed(), false);
    assert.equal(inputs.changed(), false);
    assert.deepEqual(inputs.identity(), identity);
    assert.equal(inputs.revision(), revision);
    unlinkSync(candidate); writeFileSync(candidate, 'export const recovered = true;');
    assert.equal(inputs.changed(), true);
    assert.deepEqual(inputs.identity(), identity);
    assert.equal(inputs.revision(), revision);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

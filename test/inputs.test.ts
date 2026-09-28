import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
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

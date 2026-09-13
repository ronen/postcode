import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import { captureInputs } from '../src/lib/typescript/inputs.js';

test('exclusion checks resolve a missing candidate once regardless of exclusion count', context => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-exclusion-probes-'));
  try {
    const candidate = path.join(root, 'missing/deep/source.ts');
    const one = captureInputs([path.join(root, 'out-0')]);
    const many = captureInputs(Array.from({ length: 12 }, (_, index) => path.join(root, `out-${index}`)));
    const fileExists = context.mock.method(ts.sys, 'fileExists');
    const directoryExists = context.mock.method(ts.sys, 'directoryExists');
    const realpath = context.mock.method(ts.sys as ts.System & { realpath(name: string): string }, 'realpath');
    const counts = () => [fileExists.mock.callCount(), directoryExists.mock.callCount(), realpath.mock.callCount()];
    assert.equal(one.excluded(candidate), false);
    const first = counts();
    assert.ok(first[0]! > 1);
    assert.equal(first[2], 1);
    assert.equal(many.excluded(candidate), false);
    assert.deepEqual(counts().map((count, index) => count - first[index]!), first);
    const before = counts();
    assert.equal(many.excluded(path.join(root, 'out-11/missing.ts')), true);
    assert.deepEqual(counts(), before);
    assert.equal(captureInputs([]).excluded(candidate), false);
    assert.deepEqual(counts(), before);
  } finally { context.mock.restoreAll(); rmSync(root, { recursive: true, force: true }); }
});

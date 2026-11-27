import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './temporary-directory.js';

const { requestBudget } = await import(new URL('../../scripts/module-investigation/request-budget.mjs', import.meta.url).href);
test('assessment allowance reserves before dispatch, persists failed attempts and excludes competing runners', t => {
  const root = temporaryDirectory(t, 'postcode-assessment-budget-'), file = path.join(root, 'budget.json');
  writeFileSync(file, JSON.stringify({ authorized: 2, requests: [] }));
  const budget = requestBudget(file);
  try {
    assert.throws(() => requestBudget(file));
    assert.equal(budget.reserve('first'), 1);
    assert.equal(JSON.parse(readFileSync(file, 'utf8')).requests[0].status, 'reserved-before-dispatch');
    budget.record(1, { status: 'failed', usage: null });
  } finally { budget.close(); }
  const reopened = requestBudget(file);
  try { assert.equal(reopened.reserve('second'), 2); assert.equal(reopened.reserve('third'), null); }
  finally { reopened.close(); }
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).requests.length, 2);
});

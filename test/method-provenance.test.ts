import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { methods } from '../src/lib/identity.js';
import { discover, inputBasis, normalizeSession } from './helpers.js';

test('application method changes still affect captured input and answer identity', async () => {
  const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
  const before = await discover(configPath);
  const application = methods as unknown as { projection: string };
  const original = methods.projection;
  application.projection = 'test/projection@next';
  try {
    const after = await discover(configPath);
    assert.notEqual(inputBasis(before), inputBasis(after));
    assert.notEqual(normalizeSession(before.projection).id, normalizeSession(after.projection).id);
  } finally { application.projection = original; }
});

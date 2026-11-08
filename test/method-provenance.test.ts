import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { methods } from '../src/lib/identity.js';
import { artifactMethods, presentationMethods } from '../src/lib/interfaces/cli/methods.js';
import { createView } from '../src/lib/presentation.js';
import { resolveModuleProjection } from '../src/lib/module-content.js';
import { discover, inputBasis, normalizeSession } from './helpers.js';

test('Presentation versions affect artifacts independently of application capture and answers', async () => {
  const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
  const before = await discover(configPath);
  const presentation = { format: 'json' as const, moreDetails: false };
  const view = createView(before.store, before.projection, presentation, 'Modules');
  const original = presentationMethods.presentation;
  // Deliberately change only the test client's method, as a different client build would.
  const client = presentationMethods as unknown as { presentation: string };
  client.presentation = 'test/presentation@2';
  try {
    const after = await discover(configPath);
    assert.equal(inputBasis(after), inputBasis(before));
    assert.deepEqual(normalizeSession(after.evaluation), normalizeSession(before.evaluation));
    assert.deepEqual(normalizeSession(resolveModuleProjection(after.store, after.projection)),
      normalizeSession(resolveModuleProjection(before.store, before.projection)));
    const changed = createView(before.store, before.projection, presentation, 'Modules');
    assert.notEqual(changed.id, view.id);
    assert.deepEqual(changed.projection, view.projection);
    const session = before.store.get(before.evaluation.session);
    assert.equal(session.kind, 'session');
    assert.ok(session.methods.every(method => !method.includes('presentation')));
    assert.ok(artifactMethods(session.methods, changed).includes('test/presentation@2'));
    assert.ok(!artifactMethods(session.methods, changed).includes(presentationMethods.investigationPresentation));
    assert.ok(!artifactMethods(session.methods, changed).includes(presentationMethods.exportsPresentation));
    assert.equal('presentation' in methods, false);
  } finally { client.presentation = original; }
});

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

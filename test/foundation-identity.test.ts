import crypto from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { identityReference, recordId, methods } from '../src/lib/identity.js';
import type { RecordId, SessionId } from '../src/lib/records.js';
import { isCompositionContext, moduleLimitations } from '../src/lib/qualification-policy.js';
import { createView, renderUnicode } from '../src/lib/presentation.js';
import { inspect } from '../src/lib/projections.js';
import { discover } from './helpers.js';

const a = 'session:11111111-1111-1111-1111-111111111111' as SessionId;
const b = 'session:22222222-2222-2222-2222-222222222222' as SessionId;
const suffix = (id: string) => id.slice(id.lastIndexOf(':') + 1);

test('identity normalizes only explicitly identified local references and retains all literal spellings', () => {
  const left = recordId(a, 'module', 'same');
  const right = recordId(b, 'module', 'same');
  assert.equal(suffix(recordId(a, 'derived', [identityReference(a, left)])),
    suffix(recordId(b, 'derived', [identityReference(b, right)])));
  assert.notEqual(suffix(recordId(b, 'derived', [identityReference(b, left)])),
    suffix(recordId(b, 'derived', [identityReference(b, right)])));
  for (const key of [a, `literal ${a}`, { name: a }, { path: `/tmp/${a}/source.ts` }, { limitations: [a] }, { id: a }]) {
    const formerlyCollapsed = JSON.parse(JSON.stringify(key).replaceAll(a, 'session')) as unknown;
    assert.notEqual(recordId(a, 'literal', key), recordId(a, 'literal', formerlyCollapsed));
  }
  assert.equal(identityReference(a, null), null);
  assert.equal(identityReference(a, a), 'session');
  assert.equal(identityReference(a, b), b);
  assert.equal(identityReference(a, `${a}-foreign:key` as RecordId), `${a}-foreign:key`);
});

test('literal selectors containing the producing session cannot collide with the word session', () => {
  const { store, evaluation } = discover('fixtures/empty/tsconfig.json');
  const literal = inspect(store, evaluation, evaluation.session);
  const word = inspect(store, evaluation, 'session');
  assert.notEqual(literal.id, word.id);
  assert.equal(literal.parameters.selector, evaluation.session);
  assert.equal(word.parameters.selector, 'session');
});

test('qualification classification uses exact registered method identity, independent of limitation prose', () => {
  assert.equal(isCompositionContext({ method: `${methods.composition};typescript@6.0.3` }), true);
  assert.equal(isCompositionContext({ method: `${methods.composition}-unrelated` }), false);
  assert.equal(isCompositionContext({ method: `${methods.composition}0` }), false);
  const { store, evaluation } = discover('fixtures/exports/tsconfig.json');
  const view = createView(store, inspect(store, evaluation, 'origin'), { format: 'unicode', sourceDetail: false });
  const module = view.modules[0]!;
  const extra = { ...module.qualification, id: recordId(evaluation.session, 'unrelated-context', 1),
    method: `${methods.composition}-unrelated`, scope: module.id, limitations: ['Independent limitation remains visible.'] };
  const withCompleteComposition = { ...view, qualifications: [...view.qualifications, extra], modules: view.modules.map(item => ({ ...item,
    composition: { claims: [], evaluations: [{ id: recordId(evaluation.session, 'complete', 1), applicability: 'applicable' as const,
      availability: 'available' as const, execution: 'completed' as const, materialization: 'full' as const, reason: null }] } })) };
  assert.match(renderUnicode(withCompleteComposition), /Independent limitation remains visible/);
  assert.ok(view.qualifications.some(context => context.limitations.includes(moduleLimitations.population)));
});


test('real provider keeps ambient names containing its own session distinct from literal session', t => {
  const directory = temporaryDirectory(t, 'postcode-literal-session-');
  const configPath = path.join(directory, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["ambient.d.ts"]}');
  writeFileSync(path.join(directory, 'ambient.d.ts'),
    `declare module "${a}" { export const first: 1; }\ndeclare module "session" { export const second: 2; }\n`);
  const original = crypto.randomUUID;
  t.mock.method(crypto, 'randomUUID', () => a.slice('session:'.length) as ReturnType<typeof crypto.randomUUID>);
  syncBuiltinESMExports();
  t.after(() => { crypto.randomUUID = original; syncBuiltinESMExports(); });
  const result = discover(configPath);
  assert.equal(result.evaluation.session, a);
  assert.equal(result.claims.length, 2);
  assert.equal(new Set(result.claims.map(claim => claim.subject)).size, 2);
  assert.deepEqual(new Set(result.claims.map(claim => claim.information.name)), new Set([a, 'session']));
  for (const selector of [a, 'session']) assert.equal(inspect(result.store, result.evaluation, selector).modules.length, 1);
});

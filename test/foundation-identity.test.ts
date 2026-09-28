import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
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
import { inspectOrganization } from '../src/lib/organization/projections.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { dependencyChildren, dependencyParents } from '../src/lib/dependencies/projections.js';
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

test('resolved internal selectors cannot collide with literal normalized spellings in any projection family', t => {
  const directory = temporaryDirectory(t, 'postcode-selector-collision-');
  execFileSync('git', ['init', '--quiet', directory]);
  const configPath = path.join(directory, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"include":["*.ts"]}');
  writeFileSync(path.join(directory, 'a.ts'), 'export const value = 1;');
  const initial = discover(configPath);
  const spelling = identityReference(initial.evaluation.session, initial.evaluation.modules[0]!)!;
  writeFileSync(path.join(directory, 'ambient.d.ts'), `declare module "${spelling}" { export const other: 2; }`);
  const { store, evaluation, analysis, claims } = discover(configPath);
  const file = claims.find(claim => claim.information.handle === 'a')!.subject;
  const ambient = claims.find(claim => claim.information.name === spelling)!.subject;
  const organization = evaluateOrganization(store, evaluation);
  const dependency = evaluateDependencies(store, analysis);
  for (const project of [
    (selector: string) => inspect(store, evaluation, selector),
    (selector: string) => inspectOrganization(store, organization, selector),
    (selector: string) => dependencyChildren(store, dependency, selector),
    (selector: string) => dependencyParents(store, dependency, selector),
  ]) {
    const resolved = project(file), literal = project(spelling);
    assert.notEqual(resolved.id, literal.id);
    assert.deepEqual(resolved.modules, [file]);
    assert.deepEqual(literal.modules, [ambient]);
    assert.equal(resolved.parameters.selector, file);
    assert.equal(literal.parameters.selector, spelling);
  }
});

for (const family of ['module', 'organization-module', 'organization-group', 'dependency-children', 'dependency-parents'] as const) {
  test(`${family} projection normalizes resolved internal IDs across sessions and retains compact selection`, t => {
    const directory = temporaryDirectory(t, 'postcode-selector-sessions-');
    execFileSync('git', ['init', '--quiet', directory]);
    const configPath = path.join(directory, 'tsconfig.json');
    writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["a.ts"]}');
    writeFileSync(path.join(directory, 'a.ts'), 'export const value = 1;');
    const projections = [discover(configPath), discover(configPath)].map(({ store, evaluation, analysis }) => {
      const organization = evaluateOrganization(store, evaluation);
      const dependency = evaluateDependencies(store, analysis);
      const group = family === 'organization-group';
      const selected = group ? organization.groups[0]! : evaluation.modules[0]!;
      const compact = store.entityIds(group ? organization.groups : evaluation.modules, group ? 'group' : 'module').get(selected)!;
      const project = (selector: string, reference = false) => family === 'module' ? inspect(store, evaluation, selector, reference)
        : family.startsWith('organization') ? inspectOrganization(store, organization, selector, reference)
          : family === 'dependency-children' ? dependencyChildren(store, dependency, selector, reference)
            : dependencyParents(store, dependency, selector, reference);
      const internal = project(selected), precise = project(compact, true);
      assert.equal(internal.selection.matches, 1);
      assert.equal(precise.selection.matches, 1);
      assert.deepEqual(precise.modules, internal.modules);
      if ('groups' in internal && 'groups' in precise) assert.deepEqual(precise.groups, internal.groups);
      assert.equal(internal.parameters.selector, selected);
      assert.equal(precise.parameters.selector, compact);
      assert.notEqual(internal.id, precise.id);
      return { internal, precise };
    });
    assert.notEqual(projections[0]!.internal.session, projections[1]!.internal.session);
    assert.equal(suffix(projections[0]!.internal.id), suffix(projections[1]!.internal.id));
    assert.equal(suffix(projections[0]!.precise.id), suffix(projections[1]!.precise.id));
  });
}

test('qualification classification uses only the exact primary producer and preserves derived limitations', () => {
  assert.equal(isCompositionContext({ method: methods.composition }), true);
  assert.equal(isCompositionContext({ method: `${methods.composition};typescript@6.0.3` }), true);
  assert.equal(isCompositionContext({ method: `${methods.organization};${methods.composition};typescript@6.0.3` }), false);
  assert.equal(isCompositionContext({ method: `${methods.composition}-unrelated` }), false);
  assert.equal(isCompositionContext({ method: `${methods.composition}0` }), false);
  const { store, evaluation } = discover('fixtures/exports/tsconfig.json');
  const view = createView(store, inspect(store, evaluation, 'origin'), { format: 'unicode', sourceDetail: false });
  const module = view.modules[0]!;
  const extra = { ...module.qualification, id: recordId(evaluation.session, 'unrelated-context', 1),
    method: `${methods.composition}-unrelated`, scope: module.id, limitations: ['Independent limitation remains visible.'] };
  const inherited = { ...extra, id: recordId(evaluation.session, 'derived-context', 1),
    method: `${methods.organization};${methods.composition}`, limitations: ['Derived limitation remains visible.'] };
  const primary = { ...extra, id: recordId(evaluation.session, 'primary-context', 1),
    method: `${methods.composition};typescript@6.0.3`, limitations: ['Primary composition limitation.'] };
  const withCompleteComposition = { ...view, qualifications: [...view.qualifications, extra, inherited, primary], modules: view.modules.map(item => ({ ...item,
    composition: { claims: [], evaluations: [{ id: recordId(evaluation.session, 'complete', 1), applicability: 'applicable' as const,
      availability: 'available' as const, execution: 'completed' as const, materialization: 'full' as const, reason: null }] } })) };
  assert.match(renderUnicode(withCompleteComposition), /Independent limitation remains visible/);
  assert.match(renderUnicode(withCompleteComposition), /Derived limitation remains visible/);
  assert.doesNotMatch(renderUnicode(withCompleteComposition), /Primary composition limitation/);
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

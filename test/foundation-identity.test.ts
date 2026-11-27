import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './temporary-directory.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { identityReference, recordId } from '../src/lib/identity.js';
import type { RecordId, SessionId } from '../src/lib/records.js';
import { inspect } from './projection-helpers.js';
import { inspectOrganization } from './projection-helpers.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { dependencyChildren, dependencyParents } from './projection-helpers.js';
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

test('unresolved literal selectors cannot manufacture retained answers', async () => {
  const { store, evaluation } = await discover('fixtures/empty/tsconfig.json');
  for (const literal of [evaluation.session, 'session']) assert.throws(() => inspect(store, evaluation, literal), /\(missing\)/);
});

test('distinct subjects selected by resolved ID and literal name retain different answers in every mechanical family', async t => {
  const directory = temporaryDirectory(t, 'postcode-selector-collision-');
  execFileSync('git', ['init', '--quiet', directory]);
  const configPath = path.join(directory, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"include":["*.ts"]}');
  writeFileSync(path.join(directory, 'a.ts'), 'export const value = 1;');
  const initial = (await discover(configPath));
  const spelling = identityReference(initial.evaluation.session, initial.evaluation.modules[0]!)!;
  writeFileSync(path.join(directory, 'ambient.d.ts'), `declare module "${spelling}" { export const other: 2; }`);
  const { store, evaluation, analysis, claims } = (await discover(configPath));
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
    assert.deepEqual(resolved.parameters, {});
    assert.deepEqual(literal.parameters, {});
  }
});

for (const family of ['module', 'organization-module', 'organization-group', 'dependency-children', 'dependency-parents'] as const) {
  test(`${family} projection normalizes resolved internal IDs across sessions and retains exact selection`, async t => {
    const directory = temporaryDirectory(t, 'postcode-selector-sessions-');
    execFileSync('git', ['init', '--quiet', directory]);
    const configPath = path.join(directory, 'tsconfig.json');
    writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["a.ts"]}');
    writeFileSync(path.join(directory, 'a.ts'), 'export const value = 1;');
    const projections = [(await discover(configPath)), (await discover(configPath))].map(({ store, evaluation, analysis }) => {
      const organization = evaluateOrganization(store, evaluation);
      const dependency = evaluateDependencies(store, analysis);
      const group = family === 'organization-group';
      const selected = group ? organization.groups[0]! : evaluation.modules[0]!;
      const exact = selected;
      const project = (selector: string, reference = false) => family === 'module' ? inspect(store, evaluation, selector, reference)
        : family.startsWith('organization') ? inspectOrganization(store, organization, selector, reference)
          : family === 'dependency-children' ? dependencyChildren(store, dependency, selector, reference)
            : dependencyParents(store, dependency, selector, reference);
      const internal = project(selected), precise = project(exact, true);
      assert.equal(internal.selection.matches, 1);
      assert.equal(precise.selection.matches, 1);
      assert.deepEqual(precise.modules, internal.modules);
      if ('groups' in internal && 'groups' in precise) assert.deepEqual(precise.groups, internal.groups);
      assert.deepEqual(internal.parameters, {});
      assert.deepEqual(precise.parameters, {});
      assert.equal(internal.id, precise.id);
      return { internal, precise };
    });
    assert.notEqual(projections[0]!.internal.session, projections[1]!.internal.session);
    assert.equal(suffix(projections[0]!.internal.id), suffix(projections[1]!.internal.id));
    assert.equal(suffix(projections[0]!.precise.id), suffix(projections[1]!.precise.id));
  });
}


test('real provider keeps ambient names containing its own session distinct from literal session', async t => {
  const directory = temporaryDirectory(t, 'postcode-literal-session-');
  const configPath = path.join(directory, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["ambient.d.ts"]}');
  writeFileSync(path.join(directory, 'ambient.d.ts'),
    `declare module "${a}" { export const first: 1; }\ndeclare module "session" { export const second: 2; }\n`);
  const original = crypto.randomUUID;
  t.mock.method(crypto, 'randomUUID', () => a.slice('session:'.length) as ReturnType<typeof crypto.randomUUID>);
  syncBuiltinESMExports();
  t.after(() => { crypto.randomUUID = original; syncBuiltinESMExports(); });
  const result = (await discover(configPath));
  assert.equal(result.evaluation.session, a);
  assert.equal(result.claims.length, 2);
  assert.equal(new Set(result.claims.map(claim => claim.subject)).size, 2);
  assert.deepEqual(new Set(result.claims.map(claim => claim.information.name)), new Set([a, 'session']));
  for (const selector of [a, 'session']) assert.equal(inspect(result.store, result.evaluation, selector).modules.length, 1);
});

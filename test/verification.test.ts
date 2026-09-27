import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeSession } from './comparison.js';
import { deriveDependencyGraph } from '../src/lib/dependencies/graph.js';
import type { RecordId, SessionId } from '../src/lib/records.js';
import type { DependencyRelationshipClaim } from '../src/lib/dependencies/records.js';

const a = 'session:11111111-1111-1111-1111-111111111111';
const b = 'session:22222222-2222-2222-2222-222222222222';
const fixture = (session: string) => ({ projection: { session, id: `${session}:projection:aaa` },
  modules: [{ id: `${session}:module:bbb`, name: a, documentation: [{ text: `Literal ${a}` }] }],
  relationships: [{ id: `${session}:edge:ccc`, parent: `${session}:module:bbb`, child: `${session}:module:ddd` }],
  qualifications: [{ session, scope: `${session}:module:bbb`, limitations: ['partial'], evidence: [`${session}:evidence:eee`] }],
  display: { omittedModules: 1, rows: [0, 2, 1] } });

test('reference-aware comparison accepts consistent renaming and rejects semantic mutations', () => {
  const original = fixture(a);
  assert.deepEqual(normalizeSession(original), normalizeSession(fixture(b)));
  for (const mutate of [
    (value: ReturnType<typeof fixture>) => { value.relationships[0]!.child = `${a}:module:ddd`; },
    (value: ReturnType<typeof fixture>) => { value.relationships[0]!.child = `${b}:module:bbb`; },
    (value: ReturnType<typeof fixture>) => { value.modules[0]!.name = b; },
    (value: ReturnType<typeof fixture>) => { value.modules[0]!.documentation[0]!.text = `Literal ${b}`; },
    (value: ReturnType<typeof fixture>) => { value.qualifications[0]!.limitations = []; },
    (value: ReturnType<typeof fixture>) => { value.display.omittedModules = 0; },
    (value: ReturnType<typeof fixture>) => { value.display.rows.reverse(); },
  ]) {
    const changed = fixture(b); mutate(changed);
    assert.notDeepEqual(normalizeSession(original), normalizeSession(changed));
  }
  assert.notEqual(normalizeSession(`Session ${a.slice(8)}\n  Literal ${a}\n`),
    normalizeSession(`Session ${b.slice(8)}\n  Literal ${b}\n`));
  assert.notDeepEqual(normalizeSession({ kind: 'analysis-inputs', session: a, value: { id: a } }),
    normalizeSession({ kind: 'analysis-inputs', session: b, value: { id: b } }));
});

test('graph oracle pins component/member order, indices, parallel support and incomplete roots', () => {
  const id = (name: string) => name as RecordId;
  const edge = (name: string, parent: string, child: string): DependencyRelationshipClaim => ({
    kind: 'claim', id: id(name), session: a as SessionId, method: 'oracle', subject: id(parent), context: id('context'),
    information: { type: 'dependency', child: id(child), occurrences: [], mechanisms: [], typeOnly: false },
  });
  const edges = [edge('ba', 'b', 'a'), edge('ab2', 'a', 'b'), edge('ab1', 'a', 'b'), edge('bc', 'b', 'c'),
    edge('cc', 'c', 'c'), edge('dc', 'd', 'c'), edge('external', 'c', 'outside')];
  const components = [
    { members: ['a', 'b'], internalRelationships: ['ab1', 'ab2', 'ba'], children: [1], cyclic: true },
    { members: ['c'], internalRelationships: ['cc'], children: [], cyclic: true },
    { members: ['d'], internalRelationships: [], children: [1], cyclic: false },
    { members: ['isolate'], internalRelationships: [], children: [], cyclic: false },
  ];
  for (const ordered of [edges, [...edges].reverse()]) {
    assert.deepEqual(deriveDependencyGraph(['d', 'b', 'isolate', 'a', 'c'].map(id), ordered, true),
      { components, roots: [0, 2, 3], rootsEstablished: true });
    assert.deepEqual(deriveDependencyGraph(['c', 'a', 'isolate', 'b', 'd'].map(id), ordered, false),
      { components, roots: [], rootsEstablished: false });
  }
});

test('comparison workers clean up partial opening and independent close failures', async () => {
  const { withComparisonSessions } = await import('./session-comparison.js');
  for (const failure of ['second-open', 'first-close']) {
    let acquired = 0;
    const closed: number[] = [];
    await assert.rejects(withComparisonSessions(() => {
      const id = ++acquired;
      return { opening: id === 2 && failure === 'second-open' ? Promise.reject(new Error(failure)) : Promise.resolve(),
        async close() { closed.push(id); if (id === 1 && failure === 'first-close') throw new Error(failure); } };
    }, async () => {}));
    assert.deepEqual(closed, [1, 2]);
  }
});

test('interaction failures complete cleanup and rethrow their assertion', async () => {
  const { interactionDriver } = await import('./cli-helpers.js');
  let cleaned = false;
  const driver = interactionDriver(() => { cleaned = true; });
  driver.run(() => assert.equal(1, 2, 'deliberately falsified expectation'));
  await new Promise<void>(resolve => setImmediate(resolve));
  assert.equal(cleaned, true);
  assert.throws(() => driver.verify(), assert.AssertionError);
});

test('CLI collection surfaces swallowed sink assertions unless a warning is explicitly expected', async () => {
  const { invokeCli } = await import('./cli-helpers.js');
  const args = ['modules', '--project', 'fixtures/empty/tsconfig.json'];
  await assert.rejects(invokeCli(args, { sink: { async submit() { assert.fail('deliberately falsified sink expectation'); } } }), assert.AssertionError);
  const expected = await invokeCli(args, { expectedWarning: true,
    sink: { async submit() { return { accepted: false, reason: 'controlled rejection' }; } } });
  assert.equal(expected.exit, 0);
  assert.match(expected.stderr, /WARNING: observation not recorded: controlled rejection/);
});

test('bare reference comparison requires the declared producer and retains foreign namespaces', () => {
  assert.throws(() => normalizeSession([`${a}:module:x`]), /producing session/);
  assert.deepEqual(normalizeSession([`${a}:module:x`], a), normalizeSession([`${b}:module:x`], b));
  assert.notDeepEqual(normalizeSession([`${a}:module:x`], a), normalizeSession([`${b}:module:x`], a));
});

test('comparison retains complete mixed group/module inspection and embedded session headings', async t => {
  const { invokeCli, temporaryDirectory } = await import('./cli-helpers.js');
  const { writeFileSync, mkdirSync } = await import('node:fs');
  const { execFileSync } = await import('node:child_process');
  const path = await import('node:path');
  const root = temporaryDirectory(t, 'postcode-mixed-comparison-');
  execFileSync('git', ['init', '--quiet', root]);
  mkdirSync(path.join(root, 'mixed'));
  writeFileSync(path.join(root, 'mixed/README.md'), 'Directory documentation');
  writeFileSync(path.join(root, 'mixed.ts'), '/** Literal session:11111111-1111-1111-1111-111111111111 */\nexport const value = 1;');
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["mixed.ts"]}');
  for (const format of [[], ['--json']]) {
    const args = ['inspect', 'mixed', '--source-detail', '--project', path.join(root, 'tsconfig.json'), ...format];
    const first = await invokeCli(args), second = await invokeCli(args);
    assert.equal(first.exit, 0, first.stderr); assert.equal(second.exit, 0, second.stderr);
    const view = (result: typeof first) => result.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as {
      schema: string; groups: { name: string | null; selected: boolean }[]; moduleDetail: { modules: unknown[] };
    };
    assert.equal(view(first).schema, 'postcode-organization-view/1-experimental');
    assert.deepEqual(view(first).groups.map(({ name, selected }) => ({ name, selected })),
      [{ name: 'mixed', selected: true }, { name: null, selected: false }]);
    assert.equal(view(first).moduleDetail.modules.length, 1);
    assert.deepEqual(normalizeSession(view(first)), normalizeSession(view(second)));
    assert.equal(normalizeSession(first.stdout), normalizeSession(second.stdout));
  }
  assert.notEqual(normalizeSession(`Session ${a.slice(8)}\nSession ${b.slice(8)}\n`),
    normalizeSession(`Session ${a.slice(8)}\nSession ${a.slice(8)}\n`));
});

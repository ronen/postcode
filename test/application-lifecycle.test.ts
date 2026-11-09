import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import { openApplication, guardPublication, SessionBusy, SessionClosed, SessionInvalidated } from '../src/lib/application/index.js';
import type { ApplicationRequest, ExecutionContext, PresentationDeclaration } from '../src/lib/application/index.js';
import { withCliOperation } from '../src/lib/application/operation-scope.js';
import { lenses } from '../src/lib/application/lenses.js';
import { operations } from '../src/lib/investigation/operations.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { ReferenceBinding } from '../src/lib/reference-binding.js';
import type { RecordId } from '../src/lib/records.js';
import { ScriptedInvestigator } from './investigator-double.js';

function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-application-lifecycle-');
  const configPath = path.join(root, 'tsconfig.json'), source = path.join(root, 'entry.ts');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(source, '/** Full documentation. */ export const entry = 1;');
  return { configPath, source };
}
const inventory = { kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } } as const;

test('direct requests capture caller data and declarations, honor subsets and refuse unsupported exact expansion', async t => {
  const f = fixture(t);
  const declarations: PresentationDeclaration[] = [{ id: 'summary', contract: 'modules', default: true,
    requirements: { modules: [], groups: [] }, eligibility: [{ option: 'detail', when: 'present', values: [false], label: 'detail' }], precondition: 'qualified' }];
  const pending = openApplication(f, {}, { lenses, operations, presentations: declarations });
  declarations.length = 0;
  const opened = await pending; assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const session = opened.session;
  assert.ok(session.capabilities().every(item => !('implementation' in item.requirements)));
  const request = { ...inventory, lens: 'modules' as string, requirements: { modules: [], groups: [] } };
  const invocation = { label: 'original' };
  const execution = session.execute(request, { invocation });
  invocation.label = 'changed'; request.lens = 'organization';
  const result = await execution; assert.equal(result.kind, 'answer'); assert.equal(result.answer.content.contract, 'modules');
  assert.deepEqual(result.answer.content.value.projection.expansions.requested, []);
  assert.equal(result.context.invocation!.fields.label, 'original');
  const before = structuredClone(result.answer);
  const unsupported = await session.execute({ ...inventory, consumption: { presentations: ['summary'], options: { undeclared: true } } });
  assert.equal(unsupported.kind, 'resolution'); assert.equal(unsupported.resolution.reason, 'presentation-unavailable');
  const refused = await session.execute({ kind: 'present', target: result.answer.id, requirements: { modules: ['exports'], groups: [] } });
  assert.equal(refused.kind, 'resolution'); assert.equal(refused.resolution.reason, 'presentation-unavailable');
  const bound = await session.execute({ ...inventory, consumption: { presentations: ['summary'], options: { detail: false } } });
  assert.equal(bound.kind, 'answer'); assert.equal(bound.consumption!.selected.id, 'summary');
  for (const method of ['put', 'evaluations', 'investigations', 'boundEntity'] as const) t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw Error(`Exact access called ${method}`); });
  const exact = await session.execute({ kind: 'present', target: result.answer.id });
  assert.equal(exact.kind, 'answer'); assert.deepEqual(exact.answer, before);
});

test('direct boundary rejects malformed data without invoking accessors and preserves omitted attachment fields', async t => {
  const opened = await openApplication(fixture(t)); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  for (const request of [null, [], { ...inventory, lens: 'unknown' }, { ...inventory, designation: { kind: 'reference', value: 4 } },
    { ...inventory, requirements: { modules: ['bogus'], groups: [] } }, { ...inventory, get parameters() { throw Error('Accessor ran'); } }]) {
    const result = await opened.session.execute(request as unknown as ApplicationRequest);
    assert.equal(result.kind, 'resolution'); assert.equal(result.attribution.status, 'refused');
    assert.deepEqual(structuredClone(result), result);
  }
  const result = await opened.session.execute(inventory, { invocation: { label: 'kept', get unsafe() { throw Error('Attachment accessor ran'); } } } as unknown as ExecutionContext);
  assert.equal(result.context.invocation!.fields.label, 'kept');
  assert.equal(result.context.invocation!.problems[0]!.omittedField, 'unsafe');
  const missing = await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'missing' } });
  assert.equal(missing.kind, 'resolution'); assert.equal(missing.resolution.reason, 'invalid-designation');
  const wrong = await opened.session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'repository' } });
  assert.equal(wrong.kind, 'resolution'); assert.equal(wrong.resolution.reason, 'invalid-designation');
});

test('one operation guard spans arrangement, expires bindings and preserves completed application work after client failure', async t => {
  const opened = await openApplication(fixture(t), { investigation: { agent: new ScriptedInvestigator([() => ({ kind: 'ended' })]) } });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  let escaped!: ReferenceBinding;
  let escapedCheck!: () => Promise<void>;
  await assert.rejects(withCliOperation(session, async scope => {
    const result = await scope.execute({ kind: 'lens', lens: 'modules', question: lenses.modules.question,
      designation: { kind: 'configured-project' }, parameters: {}, programInput: 'session-configured-project' });
    assert.equal(result.attribution.status, 'completed');
    escaped = scope.bindings; escapedCheck = scope.check;
    await assert.rejects(session.execute({ kind: 'report', report: 'usage' }), SessionBusy);
    await assert.rejects(session.check(), SessionBusy);
    throw Error('Client arrangement failed');
  }), /Client arrangement failed/);
  assert.equal(session.work()!.status, 'completed');
  assert.throws(() => escaped.bind([], 'module'), /expired/);
  await assert.rejects(escapedCheck(), /expired/);
  await withCliOperation(session, async scope => {
    const result = await scope.execute({ kind: 'lens', lens: 'summarize', question: lenses.summarize.question,
      designation: { kind: 'name', value: 'entry' }, parameters: {}, programInput: 'session-configured-project' });
    assert.equal(result.kind, 'answer'); assert.equal(result.answer.content.contract, 'investigation');
    escaped = scope.bindings; escapedCheck = scope.check;
    const reference = result.answer.content.value.references.find(item => item.kind === 'module')!;
    assert.ok(reference);
    assert.throws(() => scope.bindings.bind([reference.id, 'foreign' as RecordId], 'module'), /outside/);
    assert.throws(() => scope.bindings.bind([reference.id], 'investigram'), /different kind/);
    assert.ok(scope.bindings.bind([reference.id], 'module').get(reference.id));
  });
  assert.throws(() => escaped.bind([], 'module'), /expired/);
  await assert.rejects(escapedCheck(), /expired/);
  await session.close(); assert.throws(() => escaped.bind([], 'module'), SessionClosed);
});

test('publication distinguishes withheld, output failure and invalidation after output', async () => {
  const error = new SessionInvalidated(); let checks = 0, outputs = 0;
  const withheld = await guardPublication(() => { throw error; }, () => { outputs++; });
  assert.equal(withheld.status, 'withheld'); assert.equal(outputs, 0);
  const after = await guardPublication(() => { if (++checks === 2) throw error; }, () => { outputs++; });
  assert.equal(after.status, 'failed-after-output'); assert.equal(outputs, 1);
  const output = await guardPublication(() => {}, () => { throw Error('Output failed'); });
  assert.equal(output.status, 'output-failed');
});

test('direct post-execution validation precedes application completion', async t => {
  const f = fixture(t); let changed = false;
  const opened = await openApplication(f, { onWork(event) {
    if (!changed && event.kind === 'work') {
      changed = true; writeFileSync(f.source, 'export const changed = 2;');
    }
  } });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  await assert.rejects(opened.session.execute(inventory), SessionInvalidated);
  assert.equal(opened.session.work()!.status, 'invalidated');
});

test('direct inventory retains qualified partial support and complete empty populations', async t => {
  const f = fixture(t);
  writeFileSync(f.source, "export { missing } from './missing.js';");
  const opened = await openApplication(f); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const partial = await opened.session.execute(inventory);
  assert.equal(partial.kind, 'answer'); assert.equal(partial.answer.content.contract, 'modules');
  assert.ok(partial.answer.content.value.evaluations.some(item => item.requirement === 'exports' && item.materialization === 'partial'));
  const exact = await opened.session.execute({ kind: 'present', target: partial.answer.id });
  assert.equal(exact.kind, 'answer'); assert.deepEqual(exact.answer, partial.answer);
  const empty = await openApplication({ configPath: path.resolve('fixtures/empty/tsconfig.json') });
  assert.equal(empty.status, 'opened'); t.after(() => empty.session.close());
  const result = await empty.session.execute(inventory);
  assert.equal(result.kind, 'answer'); assert.equal(result.answer.content.contract, 'modules');
  assert.equal(result.answer.content.value.modules.length, 0);
  assert.equal(result.attribution.status, 'completed');
});

test('unrepresentable invocation attachments are attributed to the attachment, not the accepted request', async t => {
  const opened = await openApplication(fixture(t)); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  class Attachment { label = 'class instance'; }
  for (const invocation of [() => 1, new Map(), new Attachment(), null, [], 'text', 42]) {
    const result = await opened.session.execute({ kind: 'report', report: 'usage' }, { invocation } as unknown as ExecutionContext);
    assert.equal(result.kind, 'usage'); assert.equal(result.attribution.status, 'completed');
    assert.deepEqual(result.context.invocation, { fields: {}, problems: [{ field: 'invocation',
      reason: 'An invocation attachment must be a plain object.', representation: 'omitted', omittedField: 'invocation' }] });
    assert.deepEqual(structuredClone(result), result);
  }
});

import { ScriptedInvestigator, syntheticUsage } from './investigator-double.js';
import { investigationBounds } from '../src/lib/investigation/bounds.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { temporaryDirectory } from './cli-helpers.js';
import { requireView, requireResolution } from './request-helpers.js';
import { openSession } from '../src/lib/session.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { captureRequest } from '../src/lib/requests.js';
import type { LensViewRequest, ViewRequest } from '../src/lib/requests.js';
import { parseCommand } from '../src/lib/commands.js';
import { publishCommand } from '../src/lib/command-execution.js';
import { finalizeInvestigationUsage } from '../src/lib/investigation/presentation.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import type { RequestContext } from '../src/lib/request-reporting.js';
import { SessionClosed, SessionInvalidated } from '../src/lib/execution-errors.js';

const json = { format: 'json' as const, sourceDetail: false };
function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-retained-');
  execFileSync('git', ['init', '--quiet', root]);
  mkdirSync(path.join(root, 'entry'));
  const configPath = path.join(root, 'tsconfig.json');
  const source = path.join(root, 'entry/entry.ts');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, include: ['**/*.ts'] }));
  writeFileSync(source, '/** Entry. */\nexport { value } from "../other";\nexport function entry() { return 7; }');
  writeFileSync(path.join(root, 'other.ts'), 'export const value = 7;');
  return { configPath, source };
}
async function session(t: TestContext) {
  const f = fixture(t), opened = await openSession(f);
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  return { ...f, active: opened.session };
}

test('exact mechanical presentation covers every family and composite without selection or Evaluation', async t => {
  const { active } = await session(t);
  const requests: LensViewRequest[] = [
    { lens: 'modules', selector: null, presentation: json },
    { lens: 'organization', selector: null, subject: 'project', presentation: json },
    { lens: 'organization', selector: null, subject: 'repository', presentation: json },
    { lens: 'inspect', selector: 'entry', presentation: json }, // mixed module/group
    { lens: 'inspect', selector: 'other', presentation: json },
    ...['dependencies', 'children', 'parents'].map(lens => ({ lens, selector: lens === 'dependencies' ? null : 'entry', presentation: json })),
  ];
  const fresh = [];
  for (const request of requests) {
    const first = requireView(await active.execute(request));
    fresh.push(first);
    for (const format of ['unicode', 'json'] as const) {
      const oneShot = requireView(await active.execute({ ...request, referenceLifetime: 'command', presentation: { ...request.presentation, format } }));
      assert.equal(oneShot.view.projection.id, first.view.projection.id);
      assert.equal(oneShot.view.answerReference, first.view.answerReference);
      assert.equal(oneShot.view.referenceLifetime, 'command');
      assert.match(oneShot.view.referenceNotice, /All answer, subject and supporting references expire/);
      assert.deepEqual(oneShot.view.continuations, []);
      assert.doesNotMatch(oneShot.rendered, /present @answer-/);
      if (format === 'unicode') {
        assert.match(oneShot.rendered, /Open postcode shell/);
        assert.equal(oneShot.rendered.match(/^Answer:/gm)?.length, 1);
        assert.equal(oneShot.rendered.match(/^Fresh answer selection$/gm)?.length, 1);
        assert.equal(oneShot.rendered.split(oneShot.view.referenceNotice).length - 1, 1);
      }
      else assert.equal(JSON.parse(oneShot.rendered).referenceNotice, oneShot.view.referenceNotice);
    }
  }
  const mixed = fresh[3]!.view;
  assert.equal(mixed.schema, 'postcode-organization-view/1-experimental');
  assert.ok(mixed.groups.length && mixed.moduleDetail?.modules.length);
  const group = requireView(await active.execute({ lens: 'inspect', selector: mixed.groups[0]!.entityId, reference: true, presentation: json }));
  fresh.push(group);
  for (const method of ['put', 'evaluations', 'investigations', 'boundEntity'] as const) t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw new Error(`present must not call ${method}`); });
  for (const first of fresh) {
    assert.equal(first.view.selectionMode, 'fresh');
    assert.match(first.view.answerReference!, /^answer-[a-f0-9]{8,64}$/);
    const retained = requireView(await active.execute({ kind: 'present', target: first.view.projection.id, presentation: json }));
    const alias = requireView(await active.execute({ kind: 'present', target: first.view.answerReference!, presentation: json }));
    assert.deepEqual(retained.view, alias.view);
    assert.deepEqual(retained.view.projection, first.view.projection);
    assert.equal(retained.view.selectionMode, 'retained');
    assert.notEqual(retained.view.id, first.view.id);
    assert.equal(retained.failed, false);
    assert.equal(retained.attribution.status, 'completed');
    assert.ok(retained.attribution.work[0]!.generating.some(item => item.origin !== null), 'fixed support keeps its original generating attribution');
    assert.deepEqual(retained.attribution.work.map(item => [item.boundary, item.disposition]), [['content', 'consumed']]);
    const text = requireView(await active.execute({ kind: 'present', target: first.view.projection.id, presentation: { format: 'unicode', sourceDetail: false } }));
    assert.match(text.rendered, /Retained answer; selection unchanged/);
    assert.match(text.rendered, new RegExp(`@${first.view.answerReference}`));
    assert.equal(text.view.projection.id, first.view.projection.id);
    assert.equal(text.rendered.match(/^Answer:/gm)?.length, 1);
    assert.equal(text.rendered.match(/^Retained answer; selection unchanged$/gm)?.length, 1);
    assert.equal(text.rendered.split(text.view.referenceNotice).length - 1, 1);
  }
  const composite = fresh[4]!.view;
  assert.ok('mechanical' in composite.projection);
  const mechanical = String(composite.projection.mechanical);
  const bare = requireView(await active.execute({ kind: 'present', target: mechanical, presentation: { ...json, sourceDetail: true } }));
  assert.equal(bare.view.projection.id, mechanical);
  assert.notEqual(bare.view.answerReference, composite.answerReference);
  assert.equal('investigations' in bare.view, false);
  assert.ok('sourceDetail' in bare.view && bare.view.sourceDetail);
  const unsupported = requireResolution(await active.execute({ kind: 'present', target: mechanical, presentation: { ...json, after: 'investigram-00000000' } }));
  assert.equal(unsupported.resolution.reason, 'presentation-unavailable');
  assert.match(unsupported.resolution.explanation, /Unsupported presentation choices.*--after/);
  assert.doesNotMatch(unsupported.resolution.explanation, /new information request/i);
  assert.equal(unsupported.resolution.retainedAnswers[0]!.id, mechanical);
  assert.equal(unsupported.resolution.retainedAnswers[0]!.reference, bare.view.answerReference);
  for (const first of fresh.slice(0, 3)) {
    const choices = [
      { presentation: { ...json, sourceDetail: true }, names: ['--source-detail'] },
      { presentation: { ...json, revisionPage: 2 }, names: ['--revision-page'] },
      { presentation: { ...json, after: 'investigram-00000000' }, names: ['--after'] },
      { presentation: { ...json, sourceDetail: true, revisionPage: 2, after: 'investigram-00000000' }, names: ['--source-detail', '--revision-page', '--after'] },
    ];
    for (const { presentation, names } of choices) {
      const refused = requireResolution(await active.execute({ kind: 'present', target: first.view.projection.id, presentation }));
      assert.equal(refused.resolution.reason, 'presentation-unavailable');
      assert.match(refused.resolution.explanation, /Unsupported presentation choices/);
      for (const name of names) assert.ok(refused.resolution.explanation.includes(name));
      assert.doesNotMatch(refused.resolution.explanation, /new information request/i);
      assert.equal(refused.resolution.retainedAnswers[0]!.id, first.view.projection.id);
      assert.equal(refused.resolution.retainedAnswers[0]!.reference, first.view.answerReference);
    }
  }
});

test('documentation-only group presentation uses selected modules rather than the discovery population', async t => {
  const f = fixture(t), manual = path.join(path.dirname(f.configPath), 'manual');
  mkdirSync(manual);
  writeFileSync(path.join(manual, 'README.md'), '# Manual\nDocumentation without TypeScript modules.');
  const opened = await openSession(f);
  assert.equal(opened.status, 'opened');
  const active = opened.session;
  t.after(() => active.close());
  const inventory = requireView(await active.execute({ lens: 'modules', selector: null, presentation: json }));
  assert.equal(inventory.view.schema, 'postcode-view/1-experimental');
  assert.equal(inventory.view.modules.length, 2, 'unrelated project modules must not require support in the selected group');
  const fresh = requireView(await active.execute({ lens: 'inspect', selector: 'manual', presentation: json }));
  assert.equal(fresh.view.schema, 'postcode-organization-view/1-experimental');
  const selected = fresh.view.groups.filter(group => group.selected);
  assert.equal(selected.length, 1);
  assert.equal(selected[0]!.documentationCount, 1);
  assert.deepEqual(selected[0]!.modules, []);
  assert.deepEqual(fresh.view.moduleDetail!.modules, []);
  assert.ok('mechanical' in fresh.view.projection);
  for (const method of ['put', 'evaluations', 'investigations', 'boundEntity'] as const) t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw new Error(`present must not call ${method}`); });
  for (const target of [fresh.view.answerReference!, String(fresh.view.projection.mechanical)]) {
    for (const format of ['json', 'unicode'] as const) {
      const retained = requireView(await active.execute({ kind: 'present', target, presentation: { format, sourceDetail: false } }));
      assert.equal(retained.view.schema, 'postcode-organization-view/1-experimental');
      assert.equal(retained.view.projection.id, target === fresh.view.answerReference ? fresh.view.projection.id : target);
      assert.equal(retained.view.selectionMode, 'retained');
      assert.deepEqual(retained.view.groups, fresh.view.groups);
      assert.deepEqual(retained.view.moduleDetail!.modules, []);
      assert.deepEqual(retained.view.qualifications, fresh.view.qualifications);
      assert.equal(retained.failed, false);
      assert.deepEqual(retained.attribution.work.map(item => [item.boundary, item.disposition]), [['content', 'consumed']]);
      if (format === 'unicode') assert.match(retained.rendered, /Retained answer; selection unchanged/);
      else assert.equal(JSON.parse(retained.rendered).projection.id, retained.view.projection.id);
    }
  }
});

test('malformed and mixed requests are safely refused before work', async t => {
  const { active } = await session(t);
  const bad: unknown[] = [
    { kind: 'present', target: 'answer-12345678', lens: 'inspect', selector: 'entry', presentation: json },
    { kind: 'present', target: 'answer-12345678', parameters: {}, presentation: json },
    { kind: 'present', target: 'answer-12345678', after: 'investigram-12345678', presentation: json },
    { kind: 'present', target: '', presentation: json },
    { kind: 'present', target: 7, presentation: json },
    ...[null, 'json', { format: 'html' }, { format: ['json'] }, { sourceDetail: 'yes' }, { after: 'bad' }, { after: '@investigram-12345678' }, { revisionPage: 0 }, { revisionPage: 1.5 }, { revisionPage: Infinity }, { extra: 1 }]
      .map(presentation => ({ kind: 'present', target: 'answer-12345678', presentation })),
    { lens: 'inspect', selector: 'entry', after: 'investigram-12345678', presentation: json },
  ];
  const noPut = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  for (const request of bad) {
    const report = requireResolution(await active.execute(request as ViewRequest));
    assert.equal(report.context.request.kind, 'rejected', JSON.stringify(request));
    assert.deepEqual(report.attribution!.work, []);
    assert.doesNotThrow(() => JSON.stringify(report));
  }
  assert.equal(noPut.mock.calls.length, 0);
  const captured = captureRequest({ kind: 'present', target: 'x', presentation: { format: 'json', sourceDetail: false } });
  assert.equal(captured.normalized.kind, 'present');
});

test('target refusals preserve the target without claiming expiry or selecting a replacement', async t => {
  const { active } = await session(t);
  const first = requireView(await active.execute({ lens: 'modules', selector: null, presentation: json }));
  assert.equal(first.view.schema, 'postcode-view/1-experimental');
  const targets = [
    ['answer-00000000', 'unknown-answer'],
    [`${active.id}:projection:${'0'.repeat(64)}`, 'unknown-answer'],
    [`session:foreign:projection:${'0'.repeat(64)}`, 'foreign-answer'],
    [first.view.modules[0]!.id, 'unsupported-answer'],
  ];
  for (const [target, reason] of targets) {
    const report = requireResolution(await active.execute({ kind: 'present', target: target!, presentation: json }));
    assert.equal(report.resolution.reason, reason);
    assert.equal(report.context.request.kind, 'present');
    assert.equal(report.context.request.target, target);
    assert.doesNotMatch(report.resolution.explanation, /expired|evicted/);
    assert.deepEqual(report.attribution!.work, []);
  }
  const foreign = await session(t);
  const copied = requireResolution(await foreign.active.execute({ kind: 'present', target: first.view.answerReference!, presentation: json }));
  assert.match(copied.resolution.explanation, /not bound in this Session/);
  const local = requireView(await foreign.active.execute({ lens: 'modules', selector: null, presentation: json }));
  const localCopy = requireView(await foreign.active.execute({ kind: 'present', target: local.view.answerReference!, presentation: json }));
  assert.equal(localCopy.view.projection.id, local.view.projection.id);
  await active.close();
  await assert.rejects(active.execute({ kind: 'present', target: first.view.projection.id, presentation: json }), SessionClosed);
});

for (const outcome of ['configuration-unavailable', 'investigation-failure', 'limit-stop'] as const) for (const worker of [false, true]) test(`retained ${outcome} outcome completes presentation and publication (${worker ? 'worker' : 'direct'})`, async t => {
  const options = fixture(t);
  const agent = new ScriptedInvestigator([(_input, _signal, report) => { report(syntheticUsage); return outcome === 'limit-stop' ? { kind: 'tools', requests: [] } : { kind: 'ended' }; }]);
  const investigation = outcome === 'configuration-unavailable' ? {} : { agent, bounds: { ...investigationBounds, calls: 1 } };
  const opened = worker ? interactiveSession(options, outcome === 'configuration-unavailable' ? {} : { investigator: agent, investigationBounds: { ...investigationBounds, calls: 1 } }) : null;
  if (opened) t.after(() => opened.close());
  const direct = worker ? null : await openSession(options, { investigation });
  if (direct) { assert.equal(direct.status, 'opened'); t.after(() => direct.session.close()); }
  const opening = opened ? await opened.opening : null;
  if (opening) assert.equal(opening.status, 'opened');
  const active = opened ?? direct!.session;
  const id = opening?.id ?? direct!.session.id;
  const fresh = requireView(await active.execute({ lens: 'summarize', selector: 'entry', presentation: json }));
  assert.equal(fresh.failed, true);
  assert.equal(fresh.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(fresh.view.outcome?.kind, outcome);
  const batches: ObservationBatch[] = []; let stdout = '', stderr = '';
  const request = { kind: 'present' as const, target: fresh.view.projection.id, presentation: json };
  const code = await publishCommand({ id, execute: active.execute, check: active.check, usage: active.usage, work: active.work }, request,
    'present retained failure', options.configPath, 2, { stdout: text => { stdout += text; }, stderr: text => { stderr += text; } },
    { async submit(batch) { batches.push(batch); throw new Error('controlled sink failure'); } });
  assert.equal(code, 0); assert.match(stderr, /observation not recorded/);
  const retained = requireView(await active.execute(request));
  assert.equal(retained.failed, false); assert.equal(retained.attribution.status, 'completed');
  assert.equal(retained.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(retained.view.result, null);
  assert.deepEqual(retained.view.outcome, fresh.view.outcome);
  assert.deepEqual(retained.view.usage, fresh.view.usage);
  assert.equal(retained.view.projection.id, fresh.view.projection.id);
  assert.equal(retained.view.id, finalizeInvestigationUsage(retained.view, retained.view.usage, retained.investigationArrangementKey!).id);
  const text = requireView(await active.execute({ ...request, presentation: { format: 'unicode', sourceDetail: false } }));
  assert.match(text.rendered, new RegExp(outcome));
  assert.equal(agent.inputs.length, outcome === 'configuration-unavailable' ? 0 : 1);
  assert.match(text.rendered, /Retained answer; selection unchanged/);
  const batch = batches[0]!;
  assert.equal(batch.formatVersion, 3);
  assert.equal((batch.records.find(item => item.kind === 'request')!.value as RequestContext).request.kind, 'present');
  assert.equal(batch.events.at(-1)!.type, 'command-completed');
  assert.ok(batch.events.some(item => item.type === 'view-produced'));
  assert.equal(batch.records.find(item => item.kind === 'rendered-output')!.value, stdout);
});

test('answer subjects receive shared guidance while literal lookup and unrelated @ names remain intact', async t => {
  const { active } = await session(t);
  const fresh = requireView(await active.execute({ lens: 'modules', selector: null, presentation: json }));
  for (const lens of ['inspect', 'children', 'parents', 'summarize', 'explain', 'decompose', 'examine']) {
    for (const target of [fresh.view.answerReference!, fresh.view.projection.id]) {
      const report = requireResolution(await active.execute({ lens, selector: target, reference: true, presentation: json }));
      assert.equal(report.resolution.reason, 'answer-as-subject'); assert.match(report.resolution.explanation, /Use present/);
      for (const interactive of [true, false]) {
        const parsed = parseCommand([lens, `@${target}`], '.', interactive);
        assert.equal(parsed.kind, 'error'); assert.match(parsed.message, /Use present/);
      }
    }
  }
  assert.equal(parseCommand(['inspect', '--', '@answer-12345678'], '.').kind, 'view');
  assert.equal(parseCommand(['inspect', '@ordinary-name'], '.').kind, 'view');
  assert.equal(parseCommand(['present', '@answer-12345678'], '.').kind, 'error');
  for (const flag of ['--after=investigram-12345678', '--revision-page=2']) {
    const shell = parseCommand(['shell', flag], '.');
    assert.equal(shell.kind, 'error');
    const parsed = parseCommand(['inspect', 'entry', flag], '.', true);
    assert.equal(parsed.kind, 'error'); assert.match(parsed.message, /present @answer-reference/);
  }
  const defaults = parseCommand(['present', `@${fresh.view.answerReference}`], '.', true, true);
  assert.equal(defaults.kind, 'view'); assert.equal(defaults.request.kind, 'present');
  assert.deepEqual(defaults.request.presentation, json);
});

test('retained presentation preserves input invalidation and shutdown limits', async t => {
  const { active, source } = await session(t);
  const first = requireView(await active.execute({ lens: 'modules', selector: null, presentation: json }));
  writeFileSync(source, 'export const changed = true;');
  await assert.rejects(active.execute({ kind: 'present', target: first.view.projection.id, presentation: json }), SessionInvalidated);
  assert.equal(first.view.selectionMode, 'fresh');
});

for (const timing of ['before-publication', 'after-publication'] as const) test(`retained publication preserves input checks (${timing})`, async t => {
  const { active, configPath, source } = await session(t);
  const first = requireView(await active.execute({ lens: 'modules', selector: null, presentation: json }));
  let stdout = '', stderr = ''; const batches: ObservationBatch[] = [];
  const code = await publishCommand({ id: active.id, usage: active.usage, work: active.work, check: active.check,
    async execute(request, execution) {
      const result = await active.execute(request, execution);
      if (timing === 'before-publication') writeFileSync(source, 'export const changed = 1;');
      return result;
    } }, { kind: 'present', target: first.view.projection.id, presentation: json }, 'present', configPath, 2,
    { stdout(text) { stdout += text; if (timing === 'after-publication') writeFileSync(source, 'export const changed = 2;'); }, stderr(text) { stderr += text; } },
    { async submit(batch) { batches.push(batch); return { accepted: true }; } });
  assert.equal(code, 2); assert.match(stderr, /Session invalidated/);
  assert.equal(stdout.length > 0, timing === 'after-publication');
  assert.equal(batches[0]!.events.some(item => item.type === 'view-produced'), timing === 'after-publication');
  assert.equal(batches[0]!.events.at(-1)!.type, 'session-invalidated');
});

test('worker retained presentation is withheld after input invalidation', async t => {
  const options = fixture(t), active = interactiveSession(options);
  t.after(() => active.close());
  assert.equal((await active.opening).status, 'opened');
  const first = requireView(await active.execute({ lens: 'modules', selector: null, presentation: json }));
  writeFileSync(options.source, 'export const changed = true;');
  await assert.rejects(active.execute({ kind: 'present', target: first.view.projection.id, presentation: json }), SessionInvalidated);
});

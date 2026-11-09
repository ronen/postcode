import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import { openApplication } from '../src/lib/application/index.js';
import { applicationPresentation, openCliSession } from '../src/lib/interfaces/cli/application.js';
import { defaultCatalog } from '../src/lib/request-catalog.js';
import { exportsLens } from '../src/lib/mechanical-implementations.js';
import { exportsPresentation } from '../src/lib/exports/presentation.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { ScriptedInvestigator } from './investigator-double.js';
import type { RecordId } from '../src/lib/records.js';
import type { SubmittedInvestigram } from '../src/lib/investigation/contracts.js';

const json = { format: 'json' as const, moreDetails: false };
const definitions = { ...defaultCatalog, lenses: { ...defaultCatalog.lenses, exports: exportsLens },
  presentations: [...defaultCatalog.presentations!, exportsPresentation] };
function fixture(t: TestContext, source = 'export const entry = 1;') {
  const root = temporaryDirectory(t, 'postcode-exact-compatibility-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), source);
  return { configPath };
}
function denyAcquisition(t: TestContext) {
  for (const method of ['put', 'evaluations', 'investigations', 'boundEntity'] as const) {
    t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw Error(`Exact retrieval called ${method}`); });
  }
}

test('raw organization subsets remain retrievable without Presentation expansions', async t => {
  const options = fixture(t);
  execFileSync('git', ['init', '-q'], { cwd: path.dirname(options.configPath) });
  const opened = await openApplication(options, {}, { ...defaultCatalog,
    presentations: defaultCatalog.presentations!.map(applicationPresentation) });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const request = { kind: 'lens', lens: 'organization', designation: { kind: 'configured-project' } } as const;
  const subset = await session.execute({ ...request, requirements: { modules: [], groups: [] } });
  assert.equal(subset.kind, 'answer'); assert.equal(subset.answer.content.contract, 'organization');
  assert.equal(subset.attribution.status, 'completed');
  const content = subset.answer.content.value;
  assert.ok(content.groups.length > 0);
  assert.deepEqual(content.projection.expansions.requested, []);
  assert.deepEqual(content.projection.expansions.groups, []);
  assert.deepEqual(content.moduleEvaluations, []);
  const before = structuredClone(subset.answer);
  const full = await session.execute(request);
  assert.equal(full.kind, 'answer'); assert.equal(full.answer.content.contract, 'organization');
  assert.ok(full.answer.content.value.projection.expansions.requested.includes('group-details'));
  assert.notEqual(full.answer.id, subset.answer.id);
  denyAcquisition(t);
  for (const requirements of [undefined, { modules: [], groups: [] }]) {
    const raw = await session.execute({ kind: 'present', target: subset.answer.id, ...(requirements ? { requirements } : {}) });
    assert.equal(raw.kind, 'answer'); assert.equal(raw.attribution.status, 'completed');
    assert.deepEqual(raw.answer, before);
  }
  const refused = await session.execute({ kind: 'present', target: subset.answer.id,
    consumption: { presentations: ['organization'], options: json } });
  assert.equal(refused.kind, 'resolution'); assert.equal(refused.attribution.status, 'refused');
  assert.equal(refused.resolution.reason, 'presentation-unavailable');
  assert.match(refused.resolution.explanation, /group details not selected/);
  assert.deepEqual(refused.resolution.retainedAnswers, [{ id: subset.answer.id, reference: subset.answerReference }]);
});

test('direct exact exports refuses missing declared support without enriching the retained answer', async t => {
  const opened = await openApplication(fixture(t), {}, { ...definitions, presentations: definitions.presentations.map(applicationPresentation) });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const subset = await session.execute({ kind: 'lens', lens: 'exports', designation: { kind: 'name', value: 'entry' }, requirements: { modules: ['exports'], groups: [] } });
  assert.equal(subset.kind, 'answer'); assert.equal(subset.answer.content.contract, 'module-exports');
  assert.ok(!subset.answer.content.value.evaluations.some(item => item.requirement === 'documentation'));
  const full = await session.execute({ kind: 'lens', lens: 'exports', designation: { kind: 'name', value: 'entry' } });
  assert.equal(full.kind, 'answer'); assert.notEqual(full.answer.id, subset.answer.id);
  denyAcquisition(t);
  const raw = await session.execute({ kind: 'present', target: subset.answer.id });
  assert.equal(raw.kind, 'answer'); assert.deepEqual(raw.answer, subset.answer);
  const refused = await session.execute({ kind: 'present', target: subset.answer.id,
    consumption: { presentations: ['module-exports'], options: json } });
  assert.equal(refused.kind, 'resolution'); assert.equal(refused.resolution.reason, 'presentation-unavailable');
  assert.deepEqual(refused.resolution.retainedAnswers, [{ id: subset.answer.id, reference: subset.answerReference }]);
  assert.match(refused.resolution.explanation, /support not selected by this retained answer/);
  assert.match(refused.resolution.explanation, /new information request/);
  assert.equal(refused.attribution.status, 'refused');
  const exactFull = await session.execute({ kind: 'present', target: full.answer.id, consumption: { presentations: ['module-exports'], options: json } });
  assert.equal(exactFull.kind, 'answer'); assert.deepEqual(exactFull.answer, full.answer);
});

for (const state of ['partial', 'empty'] as const) test(`CLI exact exports keeps ${state} content and its materialization fallback`, async t => {
  const source = state === 'partial' ? "export const known = 1; export { missing } from './unknown.js';" : 'export {};';
  const catalog = { ...definitions, presentations: [...defaultCatalog.presentations!,
    { ...exportsPresentation, id: 'complete-exports', precondition: 'complete-materialization' as const, fallback: exportsPresentation.id },
    { ...exportsPresentation, default: false }] };
  const opened = await openCliSession(fixture(t, source), {}, catalog);
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const inventory = await session.execute({ lens: 'modules', selector: null, presentation: json });
  assert.equal(inventory.kind, 'view'); assert.equal(inventory.view.schema, 'postcode-view/1-experimental');
  const fresh = await session.execute({ lens: 'exports', selector: inventory.view.modules[0]!.id, reference: true, presentation: json });
  assert.equal(fresh.kind, 'view'); assert.equal(fresh.view.schema, 'postcode-module-exports-view/1-experimental');
  assert.equal(fresh.view.completeness, state === 'partial' ? 'not-established' : 'complete');
  assert.deepEqual(fresh.view.exports.map(item => item.exportedName).sort(), state === 'partial' ? ['known', 'missing'] : []);
  if (state === 'partial') assert.ok(fresh.view.evaluations.some(item => item.requirement === 'exports' && item.materialization === 'partial'));
  denyAcquisition(t);
  for (const format of ['json', 'unicode'] as const) {
    const retained = await session.execute({ kind: 'present', target: fresh.view.answerReference!, presentation: { ...json, format } });
    assert.equal(retained.kind, 'view'); assert.equal(retained.view.schema, 'postcode-module-exports-view/1-experimental');
    assert.deepEqual(retained.view.projection, fresh.view.projection);
    assert.deepEqual(retained.view.exports, fresh.view.exports);
    assert.equal(retained.failed, false); assert.equal(retained.attribution.status, 'completed');
    assert.equal(retained.view.presentation.decision!.selected, state === 'partial' ? 'module-exports' : 'complete-exports');
    assert.equal(retained.view.presentation.decision!.changes.length, state === 'partial' ? 1 : 0);
    if (format === 'unicode' && state === 'partial') assert.match(retained.rendered, /empty listing does not establish no exports/);
  }
});

test('exact exports applies retained-support fallback before materialization without new work', async t => {
  const narrow = { ...exportsPresentation, id: 'exports-only', default: false, requirements: { modules: ['exports'] as const, groups: [] } };
  const declarations = [{ ...exportsPresentation, fallback: narrow.id }, narrow].map(applicationPresentation);
  const opened = await openApplication(fixture(t), {}, { ...definitions, presentations: declarations });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const fresh = await session.execute({ kind: 'lens', lens: 'exports', designation: { kind: 'name', value: 'entry' }, requirements: { modules: ['exports'], groups: [] } });
  assert.equal(fresh.kind, 'answer'); denyAcquisition(t);
  const retained = await session.execute({ kind: 'present', target: fresh.answer.id, consumption: { presentations: ['module-exports'], options: json } });
  assert.equal(retained.kind, 'answer'); assert.deepEqual(retained.answer, fresh.answer);
  assert.equal(retained.consumption!.initial, 'module-exports'); assert.equal(retained.consumption!.selected.id, 'exports-only');
  assert.match(retained.consumption!.changes[0]!.reason, /support absent from this answer/);
});

test('production exact investigation preserves revision and association continuations over fixed support', async t => {
  const draft = (subject: RecordId, localId = 'root'): SubmittedInvestigram => ({ localId, prose: localId,
    referent: { description: 'Selected module.', subjects: [subject] }, qualifications: ['Controlled interpretation.'],
    evidence: [], associations: [], children: [], corrections: [], inconsistencies: [] });
  let module!: RecordId;
  const agent = new ScriptedInvestigator([input => {
    if (input.request.operation === 'functionality') { module = input.request.subject; return { kind: 'submit', result: draft(module) }; }
    return { kind: 'submit', result: { ...draft(module), children: Array.from({ length: 30 }, (_, i) => ({ ...draft(module, `association-${i}`),
      associations: [{ subject: input.request.subject, qualifications: ['Explicit association.'], evidence: [] }] })),
    corrections: Array.from({ length: 26 }, (_, i) => ({ target: input.request.subject, correctedSubjects: [module],
      reason: `Alternative ${i}`, qualifications: ['Controlled correction.'], evidence: [input.request.subject], replacement: draft(module, `replacement-${i}`) })) } };
  }]);
  const opened = await openCliSession(fixture(t), { investigation: { agent } });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const initial = await session.execute({ lens: 'summarize', selector: 'entry', presentation: json });
  assert.equal(initial.kind, 'view'); assert.equal(initial.view.schema, 'postcode-investigation-view/1-experimental');
  const root = initial.view.accounts[0]!.id;
  const changed = await session.execute({ lens: 'examine', selector: root, reference: true, presentation: json });
  assert.equal(changed.kind, 'view'); assert.equal(changed.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(changed.view.result!.evaluation!.outcome.kind, 'accepted');
  const historical = await session.execute({ lens: 'inspect', selector: root, reference: true, presentation: json });
  assert.equal(historical.kind, 'view'); assert.equal(historical.view.schema, 'postcode-investigation-view/1-experimental');
  const frozen = structuredClone(historical.view.projection);
  assert.equal(historical.view.revisions[0]!.rows.length, 24);
  assert.equal(historical.view.revisions[0]!.nextPage, 2);
  assert.ok(historical.view.investigations!.total >= 30);
  const after = historical.view.investigations!.next!;
  denyAcquisition(t);
  for (const format of ['json', 'unicode'] as const) {
    const retained = await session.execute({ kind: 'present', target: historical.view.answerReference!, presentation: { ...json, format, moreDetails: true, revisionPage: 2, after } });
    assert.equal(retained.kind, 'view'); assert.equal(retained.view.schema, 'postcode-investigation-view/1-experimental');
    assert.deepEqual(retained.view.projection, frozen);
    assert.equal(retained.view.revisions[0]!.rows.length, 2);
    assert.equal(retained.view.revisions[0]!.nextPage, null);
    assert.equal(retained.view.investigations!.after, after);
    assert.equal(retained.failed, false);
    const unknown = await session.execute({ kind: 'present', target: frozen.id, presentation: { ...json, format, revisionPage: 2, after: 'investigram-00000000' } });
    assert.equal(unknown.kind, 'view'); assert.equal(unknown.view.schema, 'postcode-investigation-view/1-experimental');
    assert.equal(unknown.failed, true); assert.equal(unknown.attribution.status, 'completed');
    const restart = unknown.view.continuations.find(item => item.action === 'association-restart')!;
    assert.equal(restart.request.target, frozen.id); assert.equal(restart.request.presentation.revisionPage, 2);
    const restarted = await session.execute({ ...restart.request, presentation: restart.request.presentation });
    assert.equal(restarted.kind, 'view'); assert.equal(restarted.failed, false);
    assert.deepEqual(restarted.view.projection, frozen);
  }
  const old = await session.execute({ kind: 'present', target: initial.view.projection.id, presentation: json });
  assert.equal(old.kind, 'view'); assert.equal(old.view.schema, 'postcode-investigation-view/1-experimental');
  assert.deepEqual(old.view.accounts, initial.view.accounts);
  assert.deepEqual(old.view.revisions, initial.view.revisions);
  assert.equal(agent.inputs.length, 2, 'exact retrieval does not infer again');
});

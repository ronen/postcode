import { applicationCatalog } from '../src/lib/application/catalog.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { temporaryDirectory } from './temporary-directory.js';
import { openApplication } from '../src/lib/application/index.js';
import { exportsLens } from '../src/lib/mechanical-implementations.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';

const consumptionOptions = {};
const exportsPresentation = { id: 'module-exports', contract: 'module-exports' as const, default: true,
  requirements: { modules: ['exports', 'documentation'] as const, groups: [] }, eligibility: [], precondition: 'qualified' as const };
const defaultCatalog = { ...applicationCatalog, presentations: [{ id: 'organization', contract: 'organization' as const, default: true,
  requirements: { modules: [], groups: ['group-details'] as const }, eligibility: [], precondition: 'qualified' as const }] };
const definitions = { ...defaultCatalog, lenses: { ...defaultCatalog.lenses, exports: exportsLens },
  presentations: [...defaultCatalog.presentations, exportsPresentation] };
function fixture(t: TestContext, source = 'export const entry = 1;') {
  const root = temporaryDirectory(t, 'postcode-exact-compatibility-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), source);
  return { configPath };
}
function denyAcquisition(t: TestContext) {
  for (const method of ['put', 'evaluations', 'retainedEntity'] as const) {
    t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw Error(`Exact retrieval called ${method}`); });
  }
}

test('raw organization subsets remain retrievable without Presentation expansions', async t => {
  const options = fixture(t);
  execFileSync('git', ['init', '-q'], { cwd: path.dirname(options.configPath) });
  const opened = await openApplication(options, {}, { ...defaultCatalog,
    presentations: defaultCatalog.presentations });
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
    consumption: { presentations: ['organization'], options: consumptionOptions } });
  assert.equal(refused.kind, 'resolution'); assert.equal(refused.attribution.status, 'refused');
  assert.equal(refused.resolution.reason, 'presentation-unavailable');
  assert.match(refused.resolution.explanation, /group details not selected/);
  assert.deepEqual(refused.resolution.retainedAnswers, [{ id: subset.answer.id, reference: subset.answer.id }]);
});

test('direct exact exports refuses missing declared support without enriching the retained answer', async t => {
  const opened = await openApplication(fixture(t), {}, { ...definitions, presentations: definitions.presentations });
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
    consumption: { presentations: ['module-exports'], options: consumptionOptions } });
  assert.equal(refused.kind, 'resolution'); assert.equal(refused.resolution.reason, 'presentation-unavailable');
  assert.deepEqual(refused.resolution.retainedAnswers, [{ id: subset.answer.id, reference: subset.answer.id }]);
  assert.match(refused.resolution.explanation, /support not selected by this retained answer/);
  assert.match(refused.resolution.explanation, /new information request/);
  assert.equal(refused.attribution.status, 'refused');
  const exactFull = await session.execute({ kind: 'present', target: full.answer.id, consumption: { presentations: ['module-exports'], options: consumptionOptions } });
  assert.equal(exactFull.kind, 'answer'); assert.deepEqual(exactFull.answer, full.answer);
});

test('exact exports applies retained-support fallback before materialization without new work', async t => {
  const narrow = { ...exportsPresentation, id: 'exports-only', default: false, requirements: { modules: ['exports'] as const, groups: [] } };
  const declarations = [{ ...exportsPresentation, fallback: narrow.id }, narrow];
  const opened = await openApplication(fixture(t), {}, { ...definitions, presentations: declarations });
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const fresh = await session.execute({ kind: 'lens', lens: 'exports', designation: { kind: 'name', value: 'entry' }, requirements: { modules: ['exports'], groups: [] } });
  assert.equal(fresh.kind, 'answer'); denyAcquisition(t);
  const retained = await session.execute({ kind: 'present', target: fresh.answer.id, consumption: { presentations: ['module-exports'], options: consumptionOptions } });
  assert.equal(retained.kind, 'answer'); assert.deepEqual(retained.answer, fresh.answer);
  assert.equal(retained.consumption!.initial, 'module-exports'); assert.equal(retained.consumption!.selected.id, 'exports-only');
  assert.match(retained.consumption!.changes[0]!.reason, /support absent from this answer/);
});

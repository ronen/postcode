import { usageSummary } from '../src/lib/investigation/reporting.js';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { temporaryDirectory } from './cli-helpers.js';
import { discover } from './helpers.js';
import { normalizeSession } from './comparison.js';
import { requireResolution, requireView } from './request-helpers.js';
import { moduleExports, resolveModuleExports } from '../src/lib/exports/content.js';
import { arrangeModuleExports, exportsPresentation, renderModuleExports } from '../src/lib/exports/presentation.js';
import { exportsLens } from '../src/lib/mechanical-implementations.js';
import { captureCatalog, defaultCatalog } from '../src/lib/request-catalog.js';
import type { RequestCatalog } from '../src/lib/request-catalog.js';
import { openSession } from '../src/lib/session.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { publishCommand } from '../src/lib/command-execution.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { methods, recordId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { sourceDisclosure } from '../src/lib/source-disclosure.js';
import { settlePresentation } from '../src/lib/presentation-contracts.js';
import type { EvaluationRecord } from '../src/lib/records.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import type { RequestContext } from '../src/lib/request-reporting.js';

const json = { format: 'json' as const, sourceDetail: false };
const unicode = { format: 'unicode' as const, sourceDetail: false };
const request = { lens: 'exports', selector: 'widget', presentation: json };
function catalog(): RequestCatalog {
  return { ...defaultCatalog, lenses: { ...defaultCatalog.lenses, exports: exportsLens },
    presentations: [...defaultCatalog.presentations!, exportsPresentation] };
}
function fixture(t: TestContext, files: Record<string, string> = {
  'widget.ts': '/** A documented value.\n * @example concealed source example\n */\nexport const item = 1;\nexport type Shape = { value: number };',
  'barrel.ts': "export { item as renamed } from './widget';\nexport type { Shape } from './widget';",
  'empty.ts': 'export {};',
}) {
  const root = temporaryDirectory(t, 'postcode-exports-lens-');
  execFileSync('git', ['init', '--quiet', root]);
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, include: ['**/*.ts'] }));
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
  }
  return { configPath };
}
async function session(t: TestContext, options = fixture(t), definitions = catalog()) {
  const opened = await openSession(options, {}, definitions);
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  return opened.session;
}

test('exports uses common resolution and retains its own qualified answer without manufacturing inspection', async t => {
  const active = await session(t);
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  const first = requireView(await active.execute(request));
  assert.equal(first.view.schema, 'postcode-module-exports-view/1-experimental');
  assert.equal(first.view.completeness, 'complete');
  assert.deepEqual(first.view.exports.map(item => item.exportedName).sort(), ['Shape', 'item']);
  assert.match(first.view.exports.find(item => item.exportedName === 'item')!.documentation[0]!.text, /documented value/);
  assert.equal(first.view.exports.find(item => item.exportedName === 'item')!.documentation[0]!.omittedTags, 1);
  assert.equal(first.context.request.kind, 'lens');
  assert.equal(first.context.request.lens, 'exports');
  assert.equal(first.context.request.question, exportsLens.question);
  assert.equal(first.view.presentation.decision!.criteria.contract, 'module-exports');
  assert.equal(first.view.title, 'Module exports');
  assert.ok(first.methods.includes(methods.exportsProjection));
  assert.ok(first.methods.includes(methods.exportsPresentation));
  const presented = requireView(await active.execute({ kind: 'present', target: first.view.projection.id, presentation: { ...json, sourceDetail: true } }));
  assert.equal(presented.view.schema, 'postcode-module-exports-view/1-experimental');
  assert.equal(presented.view.projection.id, first.view.projection.id);
  assert.equal(presented.view.title, 'Module exports'); assert.equal(presented.failed, false);
  assert.deepEqual(presented.view.exports.map(item => item.id), first.view.exports.map(item => item.id));
  for (const format of ['unicode', 'json'] as const) {
    const command = requireView(await active.execute({ ...request, referenceLifetime: 'command', presentation: { format, sourceDetail: true } }));
    assert.equal(command.view.projection.id, first.view.projection.id);
    assert.match(command.view.referenceNotice, /All answer, subject and supporting references expire/);
    assert.deepEqual(command.view.continuations, []);
    assert.match(command.rendered, /Open postcode shell/);
  }
  const wrong = requireResolution(await active.execute({ ...request, selector: first.view.answerReference!, reference: true }));
  assert.equal(wrong.resolution.reason, 'answer-as-subject'); assert.match(wrong.resolution.explanation, /Use present/);

  for (const selector of [first.view.module.reference, first.view.module.id]) {
    const same = requireView(await active.execute({ ...request, selector, reference: true }));
    assert.deepEqual(same.view.projection, first.view.projection);
    assert.notEqual(same.view.id, first.view.id, 'request spelling belongs to View reporting');
  }
  const records = put.mock.calls.flatMap(call => call.arguments[0]);
  assert.ok(records.some(item => item.kind === 'module-exports-projection'));
  assert.equal(records.some(item => ['projection', 'organization-projection', 'investigation-selection-projection'].includes(item.kind)), false);
  const retained = records.find(item => item.kind === 'module-exports-projection')!;
  assert.equal('selection' in retained, false);
  assert.equal('presentation' in retained, false);
  assert.ok(first.attribution.work.some(item => item.current.role === 'resolution-prerequisite'));
  const text = requireView(await active.execute({ ...request, presentation: unicode }));
  assert.equal(text.view.projection.id, first.view.projection.id);
  assert.match(text.rendered, /item \[value\]/);
  assert.match(text.rendered, /Shape \[type\]/);
  assert.doesNotMatch(text.rendered, /concealed source example/);
  assert.equal(sourceDisclosure(first.view), null);
});

test('exports preserves reexport, type-only and established-empty meaning with explicit source disclosure', async t => {
  const active = await session(t);
  const barrel = requireView(await active.execute({ ...request, selector: 'barrel', presentation: unicode }));
  assert.equal(barrel.view.schema, 'postcode-module-exports-view/1-experimental');
  assert.match(barrel.rendered, /renamed \[value\].*reexport.*from widget/);
  assert.match(barrel.rendered, /Shape \[type\].*type-only/);
  assert.equal(barrel.view.exports.find(item => item.exportedName === 'renamed')!.symbolInformation!.name, 'item');
  const source = requireView(await active.execute({ ...request, presentation: { ...json, sourceDetail: true } }));
  assert.equal(source.view.schema, 'postcode-module-exports-view/1-experimental');
  assert.deepEqual(sourceDisclosure(source.view)?.forms, ['locations', 'excerpts']);
  assert.ok(source.view.sourceDetail!.items.some(item => item.path.endsWith('widget.ts')));
  const empty = requireView(await active.execute({ ...request, selector: 'empty', presentation: unicode }));
  assert.equal(empty.view.schema, 'postcode-module-exports-view/1-experimental');
  assert.equal(empty.view.completeness, 'complete');
  assert.deepEqual(empty.view.exports, []);
  assert.match(empty.rendered, /0 exports established/);
});

test('extension catalog capture is immutable, rejects unsupported registrations and stays nonpublic', async t => {
  const supplied = structuredClone(catalog());
  const pending = session(t, fixture(t), supplied);
  (supplied.lenses.exports as { title: string }).title = 'Changed title';
  (supplied.presentations!.at(-1) as { formats: readonly string[] }).formats = [];
  const first = requireView(await (await pending).execute(request));
  assert.equal(first.view.schema, 'postcode-module-exports-view/1-experimental');
  assert.equal(first.view.title, 'Module exports');
  assert.ok(Object.isFrozen(exportsLens.requirements));
  assert.ok(Object.isFrozen(exportsPresentation.requirements.modules));
  assert.throws(() => captureCatalog({ ...catalog(), lenses: { ...catalog().lenses,
    exports: { ...exportsLens, requirements: { kind: 'exports', implementation: 'module-inventory' } } } }), /mechanical Lens definitions/);
  const production = await session(t, fixture(t), defaultCatalog);
  const refused = requireResolution(await production.execute(request));
  assert.equal(refused.context.request.kind, 'rejected');
  assert.equal(refused.context.request.input.lens, 'exports');
});

test('exports refusal uses common candidate and Presentation outcomes before requested construction', async t => {
  const active = await session(t, fixture(t, { 'widget.ts': 'export const item = 1;',
    'ambient.ts': "declare module 'widget' { export const other: number; }" }));
  const put = t.mock.method(MemoryProgramRecordStore.prototype, 'put');
  const ambiguous = requireResolution(await active.execute(request));
  assert.equal(ambiguous.resolution.reason, 'ambiguous');
  assert.equal(ambiguous.resolution.candidates.length, 2);
  assert.equal(put.mock.calls.flatMap(call => call.arguments[0]).some(item => item.kind === 'module-exports-projection'), false);
  assert.equal(requireResolution(await active.execute({ ...request, selector: 'absent' })).resolution.reason, 'missing');
  assert.equal(requireResolution(await active.execute({ ...request, selector: 'module-00000000', reference: true })).resolution.reason, 'unknown-reference');
  assert.equal(requireResolution(await active.execute({ ...request, after: 'page' })).resolution.reason, 'invalid-request');
  const precise = requireView(await active.execute({ ...request, selector: ambiguous.resolution.candidates[0]!.reference, reference: true }));
  assert.equal(precise.view.schema, 'postcode-module-exports-view/1-experimental');
  const noPresentation = await session(t, fixture(t), { ...catalog(), presentations: defaultCatalog.presentations! });
  const refusal = requireResolution(await noPresentation.execute(request));
  assert.equal(refusal.resolution.reason, 'presentation-unavailable');
  assert.deepEqual(refusal.resolution.prerequisites, []);
  assert.deepEqual(refusal.attribution!.work, []);
});

test('qualified exports preserve partial, unavailable, unrequested and outside-population distinctions', async t => {
  const { store, analysis, evaluation: discovery, claims } = await discover(fixture(t).configPath);
  const subject = claims.find(item => item.information.handle === 'widget')!.subject;
  const unrequested = resolveModuleExports(store, moduleExports(store, discovery, [subject], 'exports'));
  assert.equal(unrequested.complete, false);
  assert.deepEqual(unrequested.exports, []);
  const complete = evaluateModules(store, analysis, ['exports', 'documentation']);
  const outcomes = store.evaluations(complete.session).filter(item => item.basis === complete.id && item.modules.includes(subject));
  for (const state of ['partial', 'unavailable'] as const) {
    const basis = { ...complete, id: recordId(complete.session, 'evaluation', state) };
    const expansions: EvaluationRecord[] = outcomes.map(item => ({ ...item, basis: basis.id,
      id: recordId(complete.session, 'evaluation', [state, item.requirement]),
      availability: state === 'unavailable' ? 'unavailable' as const : 'available' as const,
        execution: 'stopped' as const, materialization: state === 'partial' ? 'partial' as const : 'none' as const,
        claims: state === 'partial' && item.requirement === 'exports' ? item.claims!.filter(id => {
          const record = store.get(id); return record.kind === 'claim' && record.information.type === 'export';
        }).slice(0, 1) : [], reason: `Controlled ${state} export analysis.` }));
    store.put([basis, ...expansions]);
    const content = resolveModuleExports(store, moduleExports(store, basis, [subject], 'exports'));
    assert.equal(content.complete, false);
    assert.equal(content.exports.length, state === 'partial' ? 1 : 0);
    const pair = { contract: 'module-exports' as const, value: content };
    assert.ok(settlePresentation([exportsPresentation], pair));
    assert.equal(settlePresentation([{ ...exportsPresentation, precondition: 'complete-materialization' }], pair), null);
    const view = arrangeModuleExports(content, store.entityIds([subject], 'module').get(subject)!, unicode, 'Module exports');
    assert.match(renderModuleExports(view), /empty listing does not establish no exports/);
    assert.match(renderModuleExports(view), new RegExp(`Controlled ${state}`));
    const { presentRetained } = await import('../src/lib/retained-presentation.js');
    // A fuller answer already exists in the store. Exact presentation cannot enrich this one.
    const retained = presentRetained(store, basis.session, { kind: 'present', target: content.projection.id, presentation: json, referenceLifetime: 'session' },
      captureCatalog(catalog()), usageSummary([]), { check() {}, record() {} });
    assert.equal(retained.kind, 'view'); assert.equal(retained.view.schema, 'postcode-module-exports-view/1-experimental');
    assert.equal(retained.view.projection.id, content.projection.id); assert.equal(retained.failed, false);
    assert.deepEqual(retained.view.exports.map(item => item.id), content.exports.map(item => item.claim.record.id));
    assert.match(JSON.stringify(retained.view), new RegExp(`Controlled ${state}`));

  }
  const { presentRetained } = await import('../src/lib/retained-presentation.js');
  const missing = presentRetained(store, discovery.session, { kind: 'present', target: unrequested.projection.id, presentation: json, referenceLifetime: 'session' },
    captureCatalog(catalog()), usageSummary([]), { check() {}, record() {} });
  assert.equal(missing.kind, 'refusal'); assert.equal(missing.reason, 'presentation-unavailable');
  assert.deepEqual(missing.retainedAnswers, [unrequested.projection.id]);
  assert.match(missing.explanation, /support not selected by this retained answer/);
  assert.match(missing.explanation, /new information request/);
  const narrowed = { ...complete, id: recordId(complete.session, 'evaluation', 'narrowed'), modules: [] };
  store.put([narrowed]);
  const outsider = resolveModuleExports(store, moduleExports(store, narrowed, [subject], 'exports'));
  assert.equal(outsider.projection.outsidePopulation, true);
  assert.equal(outsider.module.record.subject, subject);
  assert.equal(outsider.complete, false);
  assert.deepEqual(outsider.exports, []);
  assert.throws(() => moduleExports(store, complete, [], 'exports'), /exactly one resolved/);
  assert.throws(() => moduleExports(store, complete, [complete.id], 'exports'), /Invalid exports basis or subject/);
  assert.throws(() => arrangeModuleExports({ ...outsider, module: { ...outsider.module, record: { ...outsider.module.record, subject: complete.id } } },
    'module-test', unicode, 'Module exports'), /Malformed exports/);
});

test('exports arrangement is detached, bounded and stable after later accumulation', async t => {
  const options = fixture(t, { 'widget.ts': Array.from({ length: 55 }, (_, i) =>
    `/** ${'Documented explanation. '.repeat(120)}\n * @example source-only-example\n */\nexport const item${i} = ${i};`).join('\n') });
  const { store, analysis, claims } = await discover(options.configPath);
  const basis = evaluateModules(store, analysis, ['exports', 'documentation']);
  const projection = moduleExports(store, basis, [claims[0]!.subject], 'exports');
  const content = resolveModuleExports(store, projection), original = structuredClone(content);
  const reference = store.entityIds([projection.subject], 'module').get(projection.subject)!;
  assert.equal(content.exports.length, 55);
  assert.ok(Object.isFrozen(content.exports[0]!.documentation));
  rmSync(path.join(path.dirname(options.configPath), 'widget.ts'));
  const shown = arrangeModuleExports(structuredClone(content), reference, { ...unicode, sourceDetail: true }, 'Module exports');
  assert.equal(shown.exports.length, 50);
  assert.equal(shown.omittedExports, 5);
  assert.ok(shown.exports[0]!.documentation[0]!.omittedTextCharacters > 0);
  const hiddenEvidence = new Set(content.exports[54]!.claim.evidence.map(item => item.id));
  assert.equal(shown.sourceDetail!.items.some(item => hiddenEvidence.has(item.id)), false);
  const ordinary = arrangeModuleExports(content, reference, json, 'Module exports');
  assert.equal(ordinary.exports.length, 55);
  assert.equal(sourceDisclosure(ordinary), null);
  assert.doesNotMatch(renderModuleExports(ordinary), /source-only-example/);
  store.put([{ ...basis, id: recordId(basis.session, 'evaluation', 'later'), attempt: 90 }]);
  assert.deepEqual(resolveModuleExports(store, projection), original);
  assert.deepEqual(content, original);
});

test('equivalent export records normalize only declared references and preserve literal text', async t => {
  const options = fixture(t);
  const results = [];
  for (let i = 0; i < 2; i++) {
    const { store, analysis, claims } = await discover(options.configPath);
    const basis = evaluateModules(store, analysis, ['exports', 'documentation']);
    const subject = claims.find(item => item.information.handle === 'widget')!.subject;
    results.push(moduleExports(store, basis, [subject], 'exports'));
  }
  assert.notEqual(results[0]!.session, results[1]!.session);
  assert.deepEqual(normalizeSession(results[0]), normalizeSession(results[1]));
  const literal = { session: results[0]!.session, documentation: [results[0]!.subject] };
  assert.deepEqual(normalizeSession(literal).documentation, literal.documentation);
});

test('exports crosses actual worker publication and rejected observation delivery with complete attribution', async t => {
  const options = fixture(t), supplied = structuredClone(catalog());
  const remote = interactiveSession(options, {}, supplied);
  t.after(() => remote.close());
  (supplied.lenses.exports as { title: string }).title = 'Late mutation';
  const opening = await remote.opening;
  assert.equal(opening.status, 'opened');
  let stdout = '', stderr = '';
  const batches: ObservationBatch[] = [];
  const code = await publishCommand({ id: opening.id, ...remote }, { ...request, presentation: { ...json, sourceDetail: true } },
    'internal exports fixture', options.configPath, 1, { stdout: text => { stdout += text; }, stderr: text => { stderr += text; } },
    { async submit(batch) { batches.push(batch); return { accepted: false, reason: 'Controlled sink rejection.' }; } });
  assert.equal(code, 0);
  assert.match(stderr, /Controlled sink rejection/);
  assert.equal(JSON.parse(stdout).title, 'Module exports');
  const batch = batches[0]!;
  assert.equal(batch.formatVersion, 3);
  assert.deepEqual(batch.events.map(item => item.type), ['view-produced', 'source-escape', 'command-completed']);
  const context = batch.records.find(item => item.kind === 'request')!.value as RequestContext;
  assert.equal(context.request.kind, 'lens');
  assert.equal(context.request.lens, 'exports');
  assert.equal(remote.work()!.status, 'completed');
  assert.equal(remote.work()!.completeness, 'complete');
  assert.deepEqual(batch.records.find(item => item.kind === 'request-work')!.value, remote.work());
  assert.equal(batch.records.find(item => item.kind === 'rendered-output')!.value, stdout);
});

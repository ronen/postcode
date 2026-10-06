// Task-specific full View/rendering/binding/observation comparison. No field redaction.
// Usage: node scripts/compare-investigation-construction.mjs BEFORE_BUILD AFTER_BUILD REPORT
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [beforePath, afterPath, reportPath] = process.argv.slice(2);
if (!beforePath || !afterPath) throw new Error('Supply baseline and current build directories');
async function runtime(root) {
  const load = name => import(pathToFileURL(path.resolve(root, 'src/lib', `${name}.js`)).href);
  const parts = await Promise.all(['identity', 'memory-store', 'investigation/presentation', 'investigation/associations',
    'investigation/reporting', 'projections', 'presentation', 'source-disclosure', 'observations', 'typescript/project', 'evaluation', 'records'].map(load));
  return Object.assign({}, ...parts);
}
const before = await runtime(beforePath), after = await runtime(afterPath);
const session = 'session:00000000-0000-0000-0000-000000000001';
const base = { session, method: 'comparison@1' };
// Two account IDs deliberately collide at the allocator's initial eight-character prefix.
const id = name => ['A', 'citer'].includes(name)
  ? `${session}:comparison:12345678${(name === 'A' ? 'a' : 'b').repeat(56)}`
  : before.recordId(session, 'comparison', name);
const module = id('module'), context = id('context'), source = id('source');
function fixture(api, capturedValue = { comparison: true }) {
  const inputs = api.recordId(session, 'analysis-inputs', capturedValue);
  const store = new api.MemoryProgramRecordStore(), bindings = [];
  const allocate = store.entityIds.bind(store);
  store.entityIds = (ids, kind) => { bindings.push({ ids: [...ids], kind }); return allocate(ids, kind); };
  const evaluation = { ...base, id: id('evaluation'), kind: 'evaluation', requirement: 'modules', attempt: 1,
    applicability: 'applicable', availability: 'available', execution: 'completed', materialization: 'full', reason: null,
    cost: { measure: 'module-count', value: 2 }, modules: [module, id('module2')], contexts: [context] };
  store.put([{ ...base, kind: 'session', id: session, methods: [] },
    { ...base, kind: 'analysis-inputs', id: inputs, value: capturedValue },
    { ...base, kind: 'source-evidence', id: source, path: '/fixture/entry.ts', contentDigest: 'fixture', start: 0, length: 10,
      location: { association: 'file' }, configuredRoot: true, compilerName: null },
    { ...base, kind: 'claim-context', id: context, inputs, scope: 'configured-project', evidence: [source], status: 'mechanically-derived',
      guarantee: 'Fixture guarantee.', limitations: ['Fixture limitation.'], diagnostics: [] },
    ...[module, id('module2')].flatMap((subject, i) => [
      { ...base, kind: 'module', id: subject, claim: id(`claim-${i}`) },
      { ...base, kind: 'claim', id: id(`claim-${i}`), subject, context, information: { type: 'module', name: 'entry', handle: `entry-${i}`,
        handleStatus: 'generated-navigation-aid', handleProvenance: 'declared-export', discoveryFacets: ['project'] } },
    ]), evaluation]);
  function publish(names, corrections = [], citations = [], associations = true) {
    const root = names[0], origin = id(`origin-${root}`);
    const provenance = { ...base, kind: 'investigation-provenance', id: origin,
      request: { operation: 'functionality', subject: module, parameters: {} }, originatingModule: module, instructions: 'Fixture.',
      agent: { provider: 'comparison', model: 'fixture', origin: 'scripted', configuration: {} }, citations, completeTargets: [], completeCorrections: [],
      suppliedEvidence: [id('claim-0')], summarizedEvidence: [id('claim-0')], deliveries: [] };
    const links = corrections.map(([target, replacement], i) => ({ ...base, kind: 'investigram-correction', id: id(`correction-${root}-${i}`),
      reporter: id(root), target: id(target), replacement: id(replacement), provenance: origin, correctedSubjects: [module],
      reason: 'Explicit correction.', qualifications: ['Scoped correction.'], evidence: [id('claim-0')] }));
    const accounts = names.map((name, i) => ({ ...base, kind: 'investigram', id: id(name), status: 'interpretation',
      prose: `${name}: ${'Long qualified prose. '.repeat(35)}`, referent: { description: name, subjects: [module] },
      originatingModule: module, provenance: origin, qualifications: ['Scoped interpretation.'], evidence: [id('claim-0')],
      associations: associations ? [{ subject: module, role: 'described', evidence: [id('claim-0')], qualifications: ['Explicit.'] }] : [],
      children: i === 0 ? names.slice(1).map(id) : [], corrections: i === 0 ? links.map(item => item.id) : [],
      inconsistencies: citations.length ? [{ targets: [citations[0]], reason: 'Qualified disagreement.', evidence: [id('claim-0')], qualifications: ['Scoped.'] }] : [] }));
    const result = { ...base, kind: 'investigation-evaluation', id: id(`result-${root}`), request: provenance.request, attempt: origin,
      outcome: { kind: 'accepted', root: id(root) }, investigrams: accounts.map(item => item.id), corrections: links.map(item => item.id) };
    store.put([provenance, ...accounts, ...links, result]);
    return { request: result.request, reused: false, attempt: origin, evaluation: result, unavailable: null };
  }
  const result = publish(['A', ...Array.from({ length: 270 }, (_, i) => `child-${i}`)]);
  publish(['citer'], [], [id('A')], false);
  for (let i = 0; i < 30; i++) publish([`reporter-${i}`, `replacement-${i}`], [['child-1', `replacement-${i}`]], [id('A')]);
  const failed = { ...base, kind: 'investigation-evaluation', id: id('failed'), request: result.request,
    attempt: id('failed-reporting'), outcome: { kind: 'limit-stop', reason: 'Fixture stop.' }, investigrams: [], corrections: [] };
  store.put([failed]);
  return { api, store, bindings, evaluation, result, failed, publish, inputs };
}
const usage = before.usageSummary([]);
const stats = { comparisons: 0, investigations: 0, associated: 0, observations: 0, bindingSchedules: 0, disclosures: 0,
  capturedInputComparisons: 0, collidingAccountReferences: true, validContinuationPages: true,
  permitted: ['investigation/associated Projection and View IDs', 'investigation presentation method @11 to @12', 'registered investigation-projection@1 method', 'captured method registry and resulting analysis-inputs IDs/references'], differences: [] };
function output(f, spec) {
  if (spec.after === 'next-page') {
    const first = output(f, { ...spec, after: undefined });
    assert.ok(first.view.investigations.next);
    spec = { ...spec, after: first.view.investigations.next };
  }
  f.bindings.length = 0;
  const { api, store } = f;
  const presentation = { format: spec.format, sourceDetail: spec.source };
  let view;
  if (spec.kind === 'associated') {
    const projection = api.inspect(store, f.evaluation, 'entry-0');
    const mechanical = api.createView(store, projection, presentation);
    view = api.createAssociatedInspectionView
      ? api.createAssociatedInspectionView(store, mechanical, [module], spec.after, spec.lifetime)
      : api.withAssociatedInvestigations(mechanical, api.associatedView(store, session, [module], spec.after, spec.lifetime));
  } else {
    const selected = spec.kind === 'inspect' ? [id(spec.subject ?? 'A')]
      : spec.kind === 'missing' || spec.kind === 'usage' ? [] : spec.kind === 'ambiguous' ? [module, id('module2')]
        : spec.kind === 'unsupported' ? [id('A')] : [module];
    const result = spec.kind === 'summary' ? { ...f.result, reused: spec.reused ?? false }
      : spec.kind === 'failed' ? { ...f.result, evaluation: f.failed, attempt: f.failed.attempt }
        : spec.kind === 'unavailable' ? { ...f.result, evaluation: null, unavailable: {
          provider: { status: 500, body: { detail: 'retained reporting' }, requestId: 'provider-attempt' },
          kind: 'communication-failure', code: 'fixture', diagnostic: 'Unavailable.' } } : null;
    const request = { lens: spec.kind === 'inspect' ? 'inspect' : spec.kind === 'usage' ? 'usage' : 'summarize',
      selector: spec.kind === 'usage' ? null : 'entry', presentation, ...(spec.after ? { after: spec.after } : {}),
      ...(spec.page ? { revisionPage: spec.page } : {}), referenceLifetime: spec.lifetime,
      ...(spec.kind === 'unsupported' ? { unsupportedSubject: 'investigram' } : {}) };
    const value = api.createInvestigationView(store, session, request, selected, result, usage);
    view = value.view ?? value;
  }
  return { view, rendered: view.schema === 'postcode-investigation-view/1-experimental' ? api.renderInvestigationView(view) : api.renderView(view),
    bindings: structuredClone(f.bindings), disclosure: api.sourceDisclosure(view) };
}
function comparableObservation(batch) {
  const refs = new Map([[batch.id, 'batch'], ...batch.records.map((item, i) => [item.id, `record-${i}`]), ...batch.events.map((item, i) => [item.id, `event-${i}`])]);
  // Only observation-envelope identifiers are nondeterministic; keep values verbatim.
  return { ...batch, id: 'batch', records: batch.records.map(item => ({ ...item, id: refs.get(item.id) })),
    events: batch.events.map(item => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, refs.get(value) ?? value]))) };
}
function compare(a, b, spec) {
  const old = output(a, spec), current = output(b, spec);
  const expected = { ...old.view, id: current.view.id, projection: { ...old.view.projection, id: current.view.projection.id } };
  if (a.inputs !== b.inputs && expected.support) {
    expected.support = expected.support.map(item => item.qualification?.inputs === a.inputs
      ? { ...item, qualification: { ...item.qualification, inputs: b.inputs } } : item);
  }
  assert.deepEqual(current.view, expected, JSON.stringify(spec));
  const expectedRendering = spec.kind === 'associated' ? before.renderView(expected) : before.renderInvestigationView(expected);
  if (current.rendered !== expectedRendering) {
    let offset = 0; while (current.rendered[offset] === expectedRendering[offset]) offset++;
    throw new Error(`Rendering differs at ${offset} for ${JSON.stringify(spec)}: ${JSON.stringify(current.rendered.slice(offset, offset + 100))} versus ${JSON.stringify(expectedRendering.slice(offset, offset + 100))}`);
  }
  assert.deepEqual(current.bindings, old.bindings, `Bindings ${JSON.stringify(spec)}`);
  assert.deepEqual(current.disclosure, old.disclosure);
  const expectedMethods = Object.values(before.methods).flatMap(method => method === before.methods.investigationEvaluation
    ? [method, after.methods.investigationProjection] : [method === before.methods.investigationPresentation ? after.methods.investigationPresentation : method]);
  assert.deepEqual(Object.values(after.methods), expectedMethods);
  const context = { configPath: '/fixture/tsconfig.json', repositoryRoot: null, methods: expectedMethods };
  assert.deepEqual(comparableObservation(after.observationBatch(current.view, current.rendered, context)),
    comparableObservation(before.observationBatch(expected, expectedRendering, context)));
  stats.comparisons++; stats[spec.kind === 'associated' ? 'associated' : 'investigations']++;
  stats.observations++; stats.bindingSchedules++; stats.disclosures++;
}
const specs = [];
for (const format of ['unicode', 'json']) for (const source of [false, true]) for (const lifetime of ['session', 'command']) {
  for (const kind of ['summary', 'inspect', 'associated', 'missing', 'ambiguous', 'unsupported', 'failed', 'unavailable', 'usage']) specs.push({ kind, format, source, lifetime });
  specs.push({ kind: 'summary', format, source, lifetime, reused: true },
    { kind: 'inspect', subject: 'citer', format, source, lifetime },
    { kind: 'inspect', format, source, lifetime, page: 2 }, { kind: 'inspect', format, source, lifetime, page: 99 },
    { kind: 'associated', format, source, lifetime, after: 'unknown' },
    { kind: 'associated', format, source, lifetime, after: 'next-page' });
}
for (const order of [specs, [...specs].reverse()]) {
  const a = fixture(before), b = fixture(after);
  for (const spec of order) compare(a, b, spec);
  a.publish(['new-root'], [['A', 'new-root']]); b.publish(['new-root'], [['A', 'new-root']]);
  for (const spec of order.filter(item => ['summary', 'inspect', 'associated'].includes(item.kind))) compare(a, b, spec);
}
for (const spec of specs.filter(item => item.format === 'json' && item.lifetime === 'session')) compare(fixture(before), fixture(after), spec);
// Real provider captures keep the complete method registry in their input basis.
// Compare that full value before using it as the support basis in paired Views.
async function captured(api, fixtureName) {
  const opened = await api.openTypeScriptProject({ configPath: path.resolve('fixtures', fixtureName, 'tsconfig.json') });
  assert.equal(opened.status, 'opened');
  const store = new api.MemoryProgramRecordStore();
  const evaluation = api.evaluateModules(store, opened.analysis, api.moduleStandardExpansions);
  const context = store.get(evaluation.contexts[0]);
  const input = store.get(context.inputs);
  assert.equal(input.id, api.recordId(opened.session, 'analysis-inputs', input.value));
  return { input, methods: store.get(opened.session).methods };
}
for (const fixtureName of ['exports', 'diagnostics', 'organization']) {
  const a = await captured(before, fixtureName), b = await captured(after, fixtureName);
  assert.deepEqual(a.input.value.methods, before.methods);
  assert.deepEqual(b.input.value, { ...a.input.value, methods: after.methods });
  assert.deepEqual(b.methods, a.methods.flatMap(method => method === before.methods.investigationEvaluation
    ? [method, after.methods.investigationProjection] : [method === before.methods.investigationPresentation ? after.methods.investigationPresentation : method]));
  assert.notEqual(before.identityReference(a.input.session, a.input.id), after.identityReference(b.input.session, b.input.id));
  const old = fixture(before, a.input.value), current = fixture(after, b.input.value);
  for (const spec of specs.filter(item => item.lifetime === 'session' && ['summary', 'inspect'].includes(item.kind))) compare(old, current, spec);
  stats.capturedInputComparisons++;
}
if (reportPath) writeFileSync(reportPath, `${JSON.stringify(stats, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(stats)}\n`);

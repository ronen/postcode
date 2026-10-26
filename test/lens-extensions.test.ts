import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import { ScriptedInvestigator, syntheticUsage } from './investigator-double.js';
import { requireResolution, requireView } from './request-helpers.js';
import { openSession } from '../src/lib/session.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { publishCommand } from '../src/lib/command-execution.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import type { RequestContext } from '../src/lib/request-reporting.js';
import { captureCatalog, defaultCatalog } from '../src/lib/request-catalog.js';
import type { RequestCatalog } from '../src/lib/request-catalog.js';
import { operationMethod } from '../src/lib/investigation/operations.js';
import type { OperationDefinition } from '../src/lib/investigation/operations.js';
import { lenses } from '../src/lib/requests.js';
import type { LensDefinition } from '../src/lib/requests.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { investigationEvaluation } from '../src/lib/investigation/evaluation.js';
import { InvestigationUsage } from '../src/lib/investigation/usage.js';

const risks: OperationDefinition = { id: 'risks', objective: 'Identify apparent module risks, their evidence and limitations.',
  subject: 'module', initialContext: 'subject-reference', method: 'test/module-risks@1' };
const riskLens: LensDefinition = { id: 'risks', title: 'Module risks', question: 'What risks are apparent in this module?',
  subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'risks' }, results: ['investigation'] };
function catalog(): RequestCatalog {
  return { lenses: { ...defaultCatalog.lenses, risks: riskLens, 'risk-review': { ...riskLens, id: 'risk-review', title: 'Risk review' } },
    operations: { ...defaultCatalog.operations, risks } };
}

const invalidDefinitions: readonly { name: string; definition: LensDefinition; reason: RegExp }[] = [
  { name: 'new mechanical implementation', definition: { ...lenses.modules, id: 'other-modules' }, reason: /mechanical Lens definitions/ },
  { name: 'changed built-in requirements', definition: { ...lenses.modules, requirements: { kind: 'dependencies', implementation: 'dependency-structure' }, results: ['dependencies'] }, reason: /mechanical Lens definitions/ },
  { name: 'changed built-in applicability', definition: { ...lenses.modules, subjects: ['module'], cardinality: 'collection' }, reason: /mechanical Lens definitions/ },
  { name: 'changed built-in question', definition: { ...lenses.modules, question: 'A different question' }, reason: /mechanical Lens definitions/ },
  { name: 'mechanical implementation under an interpretation identity', definition: { ...lenses.modules, id: 'summarize' }, reason: /mechanical Lens definitions/ },
  { name: 'interpretation replacing built-in inspection', definition: { ...riskLens, id: 'inspect' }, reason: /mechanical Lens definitions/ },
  ...['dependencies', 'children', 'parents', 'usage', 'present'].map(id => ({ name: `shadowed identity ${id}`, definition: { ...riskLens, id }, reason: /reserved/ })),
  ...[{ depth: 1 }, null, [], 'depth'].map(parameters => ({ name: `unsupported parameter declaration ${JSON.stringify(parameters)}`,
    definition: { ...riskLens, parameters: parameters as unknown as LensDefinition['parameters'] }, reason: /empty parameter object/ })),
  { name: 'mechanical parameter declaration', definition: { ...lenses.modules, parameters: { depth: 1 } as unknown as LensDefinition['parameters'] }, reason: /mechanical Lens definitions/ },
];
for (const { name, definition, reason } of invalidDefinitions) {
  test(`catalog rejects ${name} before Session opening`, async () => {
    const definitions = catalog();
    const supplied = { ...definitions, lenses: { ...definitions.lenses, [definition.id]: definition } };
    assert.throws(() => captureCatalog(supplied), reason);
    // No project is required: unsupported assembly must fail before acquisition,
    // not become a request, open failure, or mislabelled program answer.
    await assert.rejects(openSession({ configPath: '/catalog-rejection-must-not-open/tsconfig.json' }, {}, supplied), reason);
  });
}

test('catalog accepts unchanged built-ins independent of object key order and supported interpretation additions', () => {
  const supplied = catalog();
  const reordered = Object.fromEntries(Object.entries(lenses.modules).reverse()) as unknown as LensDefinition;
  const captured = captureCatalog({ ...supplied, lenses: { ...supplied.lenses, modules: reordered } });
  assert.deepEqual(captured.lenses.modules, lenses.modules);
  assert.deepEqual(captured.lenses.risks, riskLens);
  assert.deepEqual(captureCatalog(defaultCatalog), defaultCatalog);
  assert.ok(Object.isFrozen(captured.lenses.risks!.parameters));
});

const presentation = { format: 'json' as const, sourceDetail: false };
const request = { lens: 'risks', selector: 'entry', presentation };
function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-lens-extensions-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['entry.ts'] }));
  writeFileSync(path.join(root, 'entry.ts'), 'export const entry = 1;');
  return { configPath };
}
function agent() {
  return new ScriptedInvestigator([(input, _signal, usage) => {
    usage(syntheticUsage);
    return { kind: 'submit', result: { localId: 'root', prose: 'No behavioral risk established from the supplied context.',
      referent: { description: 'Selected subject', subjects: [input.request.subject] },
      qualifications: ['Controlled interpretation with limited evidence.'], evidence: [], associations: [], children: [], corrections: [], inconsistencies: [] } };
  }]);
}

test('a nonpublic module Lens shares interpretation machinery and original provenance across consumers', async t => {
  const investigator = agent();
  const opened = await openSession(fixture(t), { investigation: { agent: investigator } }, catalog());
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const first = requireView(await opened.session.execute(request));
  assert.equal(first.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(first.view.title, 'Module risks');
  assert.equal(first.context.request.kind, 'lens');
  assert.equal(first.context.request.lens, 'risks');
  assert.equal(first.view.result!.request.operation, 'risks');
  assert.equal(first.view.provenance[0]!.method, operationMethod(risks));
  assert.ok(investigator.inputs[0]![0]!.instructions.startsWith(risks.objective));
  assert.deepEqual(investigator.inputs[0]![0]!.responses, []);
  const reference = first.view.candidates[0]!.reference;
  const same = requireView(await opened.session.execute({ ...request, selector: reference, reference: true }));
  assert.equal(same.view.projection.id, first.view.projection.id);
  const other = requireView(await opened.session.execute({ ...request, lens: 'risk-review', selector: reference, reference: true,
    presentation: { format: 'unicode', sourceDetail: false } }));
  assert.equal(other.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(other.view.result!.reused, true);
  assert.deepEqual(other.view.accounts, first.view.accounts);
  assert.deepEqual(other.view.provenance, first.view.provenance);
  assert.equal(other.view.usage.calls, 1);
  assert.equal(investigator.inputs.length, 1);
  assert.match(other.rendered, /^Risk review\n/);
  assert.ok(other.attribution.parents.some(parent => parent.id === first.context.id));
  const original = requireView(await opened.session.execute({ lens: 'inspect', selector: first.view.accounts[0]!.id, reference: true, presentation }));
  assert.equal(original.view.schema, 'postcode-investigation-view/1-experimental');
  assert.deepEqual(original.view.accounts, first.view.accounts);
  const retained = requireView(await opened.session.execute({ kind: 'present', target: first.view.projection.id, presentation }));
  assert.equal(retained.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(retained.view.title, 'Module risks');
  assert.deepEqual(retained.view.accounts, first.view.accounts); assert.equal(retained.view.result, null);
  const refused = requireResolution(await opened.session.execute({ ...request, selector: first.view.answerReference!, reference: true }));
  assert.equal(refused.resolution.reason, 'answer-as-subject'); assert.match(refused.resolution.explanation, /Use present/);

});

test('fixture Lens resolution rejects missing, unknown, unsupported and parameter inputs before inference', async t => {
  const investigator = agent();
  const opened = await openSession(fixture(t), { investigation: { agent: investigator } }, catalog());
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  for (const [input, reason] of [
    [{ ...request, selector: null }, 'invalid-designation'],
    [{ ...request, selector: 'absent' }, 'missing'],
    [{ ...request, parameters: { accidental: true } }, 'invalid-parameters'],
  ] as const) assert.equal(requireResolution(await opened.session.execute(input)).resolution.reason, reason);
  assert.equal(investigator.inputs.length, 0);
  const first = requireView(await opened.session.execute(request));
  assert.equal(first.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(requireResolution(await opened.session.execute({ ...request, selector: first.view.accounts[0]!.id, reference: true })).resolution.reason, 'unsupported-subject');
  assert.equal(investigator.inputs.length, 1);
});

test('unavailable fixture interpretation retains the actual operation request and supplied title', async t => {
  const opened = await openSession(fixture(t), {}, catalog());
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const result = requireView(await opened.session.execute(request));
  assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(result.view.result!.unavailable!.kind, 'configuration-unavailable');
  assert.equal(result.view.result!.request.operation, 'risks');
  assert.equal(result.view.title, 'Module risks');
  assert.equal(result.view.candidates.length, 1);
  const production = await openSession(fixture(t));
  assert.equal(production.status, 'opened');
  t.after(() => production.session.close());
  const refused = requireResolution(await production.session.execute(request));
  assert.equal(refused.context.request.kind, 'rejected');
  assert.equal(refused.context.request.input.lens, 'risks');
});

test('Session captures definitions before opening and ignores later caller mutation', async t => {
  const definitions = structuredClone(catalog());
  const investigator = agent();
  const pending = openSession(fixture(t), { investigation: { agent: investigator } }, definitions);
  (definitions.operations.risks as { objective: string }).objective = 'Mutated objective';
  (definitions.lenses.risks as { title: string }).title = 'Mutated title';
  const opened = await pending;
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const result = requireView(await opened.session.execute(request));
  assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(result.view.title, 'Module risks');
  assert.ok(investigator.inputs[0]![0]!.instructions.startsWith(risks.objective));
});

test('different objectives, methods and initial context cannot consume incompatible retained work', async t => {
  const opened = await openTypeScriptProject(fixture(t));
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const basis = evaluateModules(store, opened.analysis, []);
  const investigator = agent(), usage = new InvestigationUsage();
  const run = (definition: OperationDefinition, subject = basis.modules[0]!) => investigationEvaluation(store, opened.analysis, opened.session,
    usage, { agent: investigator }, async () => {}, new AbortController().signal, { [definition.id]: definition })
    .evaluate({ operation: definition.id, subject, parameters: {} });
  const first = await run(risks);
  assert.equal(first.evaluation!.outcome.kind, 'accepted');
  assert.equal((await run(risks)).reused, true);
  const changedObjective = await run({ ...risks, objective: 'A different investigation objective.' });
  const changedMethod = await run({ ...risks, method: 'test/module-risks@2' });
  assert.equal(changedObjective.reused, false);
  assert.equal(changedMethod.reused, false);
  assert.notEqual(changedObjective.evaluation!.method, first.evaluation!.method);
  assert.notEqual(changedMethod.evaluation!.method, first.evaluation!.method);
  const root = first.evaluation!.investigrams[0]!;
  const follow: OperationDefinition = { ...risks, id: 'follow', subject: 'investigram', initialContext: 'prior-interpretation' };
  const contextual = await run(follow, root);
  const bare = await run({ ...follow, initialContext: 'subject-reference' }, root);
  assert.equal(contextual.reused, false);
  assert.equal(bare.reused, false);
  assert.ok(investigator.inputs[3]![0]!.responses.length > 0);
  assert.deepEqual(investigator.inputs[4]![0]!.responses, []);
  assert.notEqual(contextual.evaluation!.method, bare.evaluation!.method);
});


test('ambiguous fixture lookup returns every candidate and a precise follow-up starts only one operation', async t => {
  const options = fixture(t);
  writeFileSync(options.configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['entry.ts', 'ambient.ts'] }));
  writeFileSync(path.join(path.dirname(options.configPath), 'ambient.ts'), "declare module 'entry' { export const other: number; }");
  const investigator = agent();
  const opened = await openSession(options, { investigation: { agent: investigator } }, catalog());
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const ambiguous = requireResolution(await opened.session.execute(request));
  assert.equal(ambiguous.resolution.reason, 'ambiguous');
  assert.equal(ambiguous.resolution.candidates.length, 2);
  assert.equal(investigator.inputs.length, 0);
  const precise = requireView(await opened.session.execute({ ...request, selector: ambiguous.resolution.candidates[0]!.reference, reference: true }));
  assert.equal(precise.view.schema, 'postcode-investigation-view/1-experimental');
  assert.equal(precise.view.accounts.length, 1);
  assert.equal(investigator.inputs.length, 1);
});

test('fixture operation preserves retained failure and retryable communication outcomes', async t => {
  for (const kind of ['refused', 'communication-failure'] as const) {
    const investigator = new ScriptedInvestigator([() => kind === 'refused' ? { kind } : { kind, code: 'fixture', diagnostic: 'Unavailable.' }]);
    const opened = await openSession(fixture(t), { investigation: { agent: investigator } }, catalog());
    assert.equal(opened.status, 'opened');
    t.after(() => opened.session.close());
    const first = requireView(await opened.session.execute(request));
    const repeat = requireView(await opened.session.execute({ ...request, lens: 'risk-review' }));
    assert.equal(first.view.schema, 'postcode-investigation-view/1-experimental');
    assert.equal(repeat.view.schema, 'postcode-investigation-view/1-experimental');
    assert.equal(repeat.view.result!.reused, kind === 'refused');
    assert.equal(investigator.inputs.length, kind === 'refused' ? 1 : 2);
  }
});

test('fixture interpretation catalogs cross worker publication with actual Lens identity and authoritative reuse usage', async t => {
  const options = fixture(t), investigator = agent();
  const remote = interactiveSession(options, { investigator }, catalog());
  t.after(() => remote.close());
  const opening = await remote.opening;
  assert.equal(opening.status, 'opened');
  const first = requireView(await remote.execute(request));
  assert.equal(first.view.schema, 'postcode-investigation-view/1-experimental');
  const batches: ObservationBatch[] = [];
  let stdout = '', stderr = '';
  const code = await publishCommand({ id: opening.id, ...remote }, { ...request, lens: 'risk-review', selector: first.view.candidates[0]!.reference, reference: true },
    'internal risk fixture', options.configPath, 2, { stdout: text => { stdout += text; }, stderr: text => { stderr += text; } },
    { async submit(batch) { batches.push(batch); return { accepted: true }; } });
  assert.equal(code, 0);
  assert.equal(stderr, '');
  assert.equal(investigator.inputs.length, 1);
  const view = JSON.parse(stdout) as typeof first.view;
  assert.equal(view.title, 'Risk review');
  assert.equal(view.result!.reused, true);
  assert.equal(view.usage.calls, 1);
  assert.deepEqual(view.provenance, first.view.provenance);
  const context = batches[0]!.records.find(item => item.kind === 'request')!.value as RequestContext;
  assert.equal(context.request.kind, 'lens');
  assert.equal(context.request.lens, 'risk-review');
  assert.equal(batches[0]!.formatVersion, 3);
  assert.deepEqual(batches[0]!.events.map(item => item.type), ['view-produced', 'command-completed']);
  assert.equal(remote.work()!.completeness, 'complete');
});

import { ScriptedInvestigator } from './investigator-double.js';
import type { EvidenceResponse } from '../src/lib/evidence-access.js';
import { withDiagnosticMeanings } from '../src/lib/diagnostic-view.js';
import type { ViewRequest } from '../src/lib/requests.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { temporaryDirectory } from './cli-helpers.js';
import { openCliSession as openSession } from '../src/lib/interfaces/cli/application.js';
import { requireView } from './request-helpers.js';
import { defaultCatalog } from '../src/lib/request-catalog.js';
import { exportsLens } from '../src/lib/mechanical-implementations.js';
import { exportsPresentation, renderModuleExports } from '../src/lib/exports/presentation.js';
import { renderView } from '../src/lib/presentation.js';
import { renderOrganizationView } from '../src/lib/organization/presentation.js';
import { renderDependencyView } from '../src/lib/dependencies/presentation.js';
import { presentQualification } from '../src/lib/qualification-view.js';
import { observationBatch, commandObservation } from '../src/lib/interfaces/cli/observations.js';
import { investigationInstructions } from '../src/lib/investigation/execute.js';
import { assertionContent, documentationLines } from '../src/lib/documentation-view.js';

for (const format of ['unicode', 'json'] as const) test(`human detail and diagnostic meaning survive fresh and retained family presentations (${format})`, async t => {
  const root = temporaryDirectory(t, 'postcode-human-output-');
  execFileSync('git', ['init', '--quiet', root]);
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), `import './missing'; import 'unknown-package/subpath';
/** Coordinates requests.\n * \`\`\`ts\n * export const SOURCE_ONLY = 1;\n * \`\`\`\n * @see Architecture handbook \`\`\`read(1)\`\`\` reference\n */
export const namedValue = 1;
const broken = ;`);
  const opened = await openSession({ configPath: path.join(root, 'tsconfig.json') }, {}, {
    ...defaultCatalog, lenses: { ...defaultCatalog.lenses, exports: exportsLens }, presentations: [...defaultCatalog.presentations!, exportsPresentation],
  });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const session = opened.session;
  for (const request of [
    { lens: 'inspect', selector: 'named-value', detail: true },
    { lens: 'organization', selector: null, detail: false },
    { lens: 'dependencies', selector: null, detail: true },
    { lens: 'exports', selector: 'named-value', detail: true },
  ]) {
    const presentation = { format, moreDetails: request.detail };
    const executed = await session.execute({ lens: request.lens, selector: request.selector, ...(request.lens === 'organization' ? { subject: 'project' as const } : {}), presentation });
    assert.equal(executed.kind, 'view', `${request.lens}: ${executed.rendered}`);
    const fresh = requireView(executed);
    const retained = requireView(await session.execute({ kind: 'present', target: fresh.view.projection.id, presentation }));
    assert.equal(retained.view.projection.id, fresh.view.projection.id);
    for (const result of [fresh, retained]) {
      assert.doesNotMatch(result.rendered, /export const SOURCE_ONLY|read\(1\)|"excerpt"/);
      assert.match(result.rendered, /TS1109|"code": 1109/);
      assert.match(result.rendered, /incomplete or unreliable/);
      assert.match(result.rendered, /Expression expected/);
      assert.match(result.rendered, /coding agent/);
      if (result.view.schema === 'postcode-dependency-view/1-experimental') {
        assert.match(result.rendered, /\.\/missing/); assert.match(result.rendered, /unknown-package\/subpath/);
        assert.equal(result.view.requestResults.find(item => item.writtenSpecifier === './missing')?.targetStatus, 'unresolved');
        assert.match(result.rendered, /local naming is fully checked/); assert.match(result.rendered, /compile-time descriptions/);
      }
      if (result.view.schema === 'postcode-view/1-experimental' || result.view.schema === 'postcode-module-exports-view/1-experimental') {
        assert.match(result.rendered, /Coordinates requests/); assert.match(result.rendered, /Architecture handbook/);
        const docs = result.view.schema === 'postcode-view/1-experimental' ? result.view.modules.flatMap(module => module.exports.flatMap(item => item.documentation)) : result.view.exports.flatMap(item => item.documentation);
        assert.equal(docs[0]!.tags[0]!.omittedTextCharacters, 13);
        const batch = observationBatch(result.view, result.rendered, { configPath: root, repositoryRoot: root, methods: [] }, result.context);
        assert.ok(batch.events.some(event => event.type === 'representation-limited'), `${request.lens}: ${result.rendered}`);
        assert.ok(batch.records.some(record => record.kind === 'representation-limit'));
      }
      const { moreDetails: _detail, ...noDetail } = result.view;
      const jsonDiagnostic = { ...noDetail, presentation: { ...noDetail.presentation, format: 'json' as const } } as typeof result.view;
      const diagnosticBatch = observationBatch(jsonDiagnostic, JSON.stringify(jsonDiagnostic), { configPath: root, repositoryRoot: root, methods: [] }, result.context);
      assert.ok(diagnosticBatch.events.some(event => event.type === 'attribution-disclosed' && event.sourceLevel === 'diagnostic-locations'));
      // Controlled code-only diagnostic exercises the shared wording for each family.
      if (result.view.schema === 'postcode-investigation-view/1-experimental') throw new Error('Unexpected interpretation');
      const context = result.view.qualifications[0]!;
      const qualified = presentQualification({ ...context, scope: 'configured-project', kind: 'claim-context', evidence: [], diagnostics: [{ code: 2307, category: 'error', message: "Cannot find module './missing'." }] });
      const view = withDiagnosticMeanings({ ...result.view, qualifications: [qualified] });
      const rendered = view.schema === 'postcode-view/1-experimental' ? renderView(view)
        : view.schema === 'postcode-organization-view/1-experimental' ? renderOrganizationView(view)
          : view.schema === 'postcode-dependency-view/1-experimental' ? renderDependencyView(view) : renderModuleExports(view);
      assert.match(rendered, /could not locate a requested module/); assert.match(rendered, /2307/);
      assert.match(rendered, /Cannot find module/);
    }
  }
  const missing = await session.execute({ lens: 'inspect', selector: 'absent', presentation: { format, moreDetails: false } });
  assert.equal(missing.kind, 'resolution');
  if (missing.kind !== 'resolution') throw new Error('Expected resolution');
  assert.match(missing.rendered, /incomplete or unreliable/); assert.match(missing.rendered, /Expression expected/);
  const batch = commandObservation(session.id, 1, {}, 'refused', missing.rendered, '', undefined, undefined,
    { kind: 'resolution-result', value: missing.report }, missing.context);
  assert.ok(batch.events.some(event => event.type === 'attribution-disclosed' && event.sourceLevel === 'diagnostic-locations'));
  assert.ok(!batch.records.some(record => record.kind === 'qualified-view'));
  const rejected = await session.execute({ lens: 'inspect', selector: () => {}, presentation: { format, moreDetails: false } } as unknown as ViewRequest);
  assert.equal(rejected.kind, 'resolution');
  if (rejected.kind !== 'resolution') throw new Error('Expected rejected-input report');
  const limited = commandObservation(session.id, 2, {}, 'refused', rejected.rendered, '', undefined, undefined,
    { kind: 'resolution-result', value: rejected.report }, rejected.context);
  assert.ok(limited.events.some(event => event.type === 'representation-limited'));
  assert.ok(limited.records.some(record => record.kind === 'representation-limit'));

});

test('plain-text documentation blocks and references remain assertions; omitted blocks disclose a representation limit', () => {
  const represented = assertionContent({ text: 'Useful claim.\n```text\nRequests cross the cache boundary.\n```\n```ts\nconst opaque = () => 1;\n```', tags: [{ name: 'see', text: 'Architecture' }] });
  assert.match(represented.text, /Useful claim/); assert.match(represented.text, /cross the cache boundary/);
  assert.doesNotMatch(represented.text, /const opaque/); assert.equal(represented.tags[0]!.text, 'Architecture');
  assert.equal(represented.representationLimits.length, 1);
  for (const operation of ['functionality', 'clarification', 'decomposition', 'examination']) {
    const instructions = investigationInstructions(operation);
    assert.match(instructions, /not presumed to read or write/); assert.match(instructions, /correction and inconsistency reasons/);
    assert.match(instructions, /Never hide a material qualification/);
  }
});

for (const format of ['unicode', 'json'] as const) test(`many diagnostics stay bounded and complete in their appropriate representation (${format})`, async t => {
  const root = temporaryDirectory(t, 'postcode-diagnostic-bounds-');
  execFileSync('git', ['init', '--quiet', root]);
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["errors.ts","other.ts"]}');
  const prose = Array.from({ length: 12 }, (_, index) => `Useful architectural assertion ${index}.`).join('\n * ');
  writeFileSync(path.join(root, 'errors.ts'), `/** ${prose}\n * Use it like \`\`\`foo(1)\`\`\` carefully.\n * @example example source content\n */\n` + Array.from({ length: 25 }, (_, i) => `export const z${i} = ;`).join('\n'));
  writeFileSync(path.join(root, 'other.ts'), 'export const other = 1;');
  const opened = await openSession({ configPath: path.join(root, 'tsconfig.json') }, {}, {
    ...defaultCatalog, lenses: { ...defaultCatalog.lenses, exports: exportsLens }, presentations: [...defaultCatalog.presentations!, exportsPresentation],
  });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  for (const lens of ['modules', 'inspect', 'organization', 'dependencies', 'exports']) {
    const result = requireView(await opened.session.execute({ lens, selector: ['inspect', 'exports'].includes(lens) ? 'errors' : null,
      ...(lens === 'organization' ? { subject: 'project' as const } : {}), presentation: { format, moreDetails: false } }));
    const retained = requireView(await opened.session.execute({ kind: 'present', target: result.view.projection.id, presentation: { format, moreDetails: false } }));
    for (const shown of [result, retained]) {
      assert.doesNotMatch(shown.rendered, /foo\(1\)/);
      if (format === 'unicode') {
        assert.equal((shown.rendered.match(/Information affected by this diagnostic/g) ?? []).length, 1, lens);
        assert.equal((shown.rendered.match(/analyzer message:/g) ?? []).length, 3, lens);
        assert.match(shown.rendered, /22 diagnostic occurrence\(s\) omitted/);
      } else {
        assert.equal((shown.rendered.match(/Information affected by this diagnostic/g) ?? []).length, 1, lens);
        const data = JSON.parse(shown.rendered);
        assert.equal(data.diagnosticMeanings[0].code, 1109);
        assert.equal(Math.max(...data.qualifications.map((q: { diagnostics: unknown[] }) => q.diagnostics.length)), 25);
        assert.ok(data.qualifications.every((q: { diagnostics: object[] }) => q.diagnostics.every(d => !('explanation' in d))));
      }
      if (shown.view.schema === 'postcode-view/1-experimental') {
        const doc = shown.view.modules.flatMap(module => module.exports.flatMap(exported => exported.documentation))[0];
        if (doc && format === 'unicode') {
          const lines = documentationLines([doc], 0, '     ');
          const content = lines.filter(line => line.trim() && !line.trim().startsWith('Documentation:') && !line.trim().startsWith('…'));
          assert.ok(content.length <= 8, content.join('\n'));
          assert.ok(content[0]!.includes('Useful architectural assertion'));
          assert.ok(content.some(line => line.includes('Representation limit:')));
          assert.ok(lines.findIndex(line => line.includes('Representation limit:')) > lines.findIndex(line => line.includes('Useful architectural assertion')));
        }
      }
    }
  }
  const missing = await opened.session.execute({ lens: 'inspect', selector: 'missing', presentation: { format, moreDetails: false } });
  assert.equal(missing.kind, 'resolution');
  assert.equal((missing.rendered.match(/Information affected by this diagnostic/g) ?? []).length, 1);
  if (format === 'unicode') assert.match(missing.rendered, /22 diagnostic occurrence\(s\) omitted/);
});

test('single-line fences are omitted without hiding adjacent prose or plain-text blocks', () => {
  for (const text of ['Use it like ```foo(1)``` carefully.', 'Use it like ```ts foo(1)``` carefully.']) {
    const represented = assertionContent({ text, tags: [] });
    assert.equal(represented.text, 'Use it like  carefully.');
    assert.equal(represented.representationLimits.length, 1);
  }
  const represented = assertionContent({ text: '```text\nUseful architecture assertion.\n```', tags: [] });
  assert.equal(represented.text, 'Useful architecture assertion.');
  assert.deepEqual(represented.representationLimits, []);
});

for (const format of ['unicode', 'json'] as const) test(`investigation support bounds diagnostics and filters retained tag fences (${format})`, async t => {
  const root = temporaryDirectory(t, 'postcode-support-output-');
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), '/** Coordinates work.\n * @see Architecture ```read(1)``` reference\n */\nexport const entry = 1;\n'
    + Array.from({ length: 25 }, (_, i) => `const z${i} = ;`).join('\n'));
  const agent = new ScriptedInvestigator([
    input => ({ kind: 'tools', requests: [{ kind: 'exports', subject: input.request.subject }, { kind: 'modules' }] }),
    input => {
      const response = input.responses[0] as EvidenceResponse;
      const assertion = response.records.find(item => item.kind === 'recorded-assertion')!;
      const claim = (input.responses[1] as EvidenceResponse).records.find(item => item.kind === 'claim' && item.information.type === 'module')!;
      assert.ok(assertion); assert.ok(claim);
      assert.match(JSON.stringify(assertion), /read\(1\)/, 'machine evidence retains the original tag');
      return { kind: 'submit', result: { localId: 'root', prose: 'Coordinates work.',
        referent: { description: 'Entry module.', subjects: [input.request.subject] }, qualifications: ['Interpretation.'],
        evidence: [assertion.id, claim.id], associations: [], children: [], corrections: [], inconsistencies: [] } };
    },
  ]);
  const opened = await openSession({ configPath: path.join(root, 'tsconfig.json') }, { investigation: { agent } });
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const generated = requireView(await opened.session.execute({ lens: 'summarize', selector: 'entry', presentation: { format, moreDetails: false } }));
  assert.equal(generated.view.schema, 'postcode-investigation-view/1-experimental');
  if (generated.view.schema !== 'postcode-investigation-view/1-experimental') throw new Error('Expected investigation');
  const account = generated.view.accounts[0]!.id;
  const reference = generated.view.references.find(item => item.id === account)!.reference;
  const inspected = requireView(await opened.session.execute({ lens: 'inspect', selector: reference, reference: true, presentation: { format, moreDetails: true } }));
  const retained = requireView(await opened.session.execute({ kind: 'present', target: inspected.view.projection.id, presentation: { format, moreDetails: true } }));
  for (const result of [inspected, retained]) {
    assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
    if (result.view.schema !== 'postcode-investigation-view/1-experimental') throw new Error('Expected investigation');
    assert.doesNotMatch(result.rendered, /read\(1\)/);
    assert.match(result.rendered, /Architecture  reference/);
    assert.match(result.rendered, /Representation limit/);
    assert.match(result.rendered, /incomplete or unreliable/);
    assert.match(result.rendered, /coding agent/);
    assert.equal(result.view.support.find(item => item.assertion)?.assertion?.tags[0]?.omittedTextCharacters, 13);
    if (format === 'unicode') {
      assert.equal((result.rendered.match(/analyzer message:/g) ?? []).length, 3);
      assert.match(result.rendered, /22 diagnostic occurrence\(s\) omitted/);
      assert.doesNotMatch(result.rendered, /"diagnostics":/);
    } else {
      assert.equal(Math.max(...result.view.support.map(item => item.qualification?.diagnostics.length ?? 0)), 25);
      assert.equal((JSON.parse(result.rendered).diagnosticMeanings as unknown[]).length, 1);
    }
    const batch = observationBatch(result.view, result.rendered, { configPath: root, repositoryRoot: root, methods: [] }, result.context);
    assert.ok(batch.events.some(event => event.type === 'attribution-disclosed'));
    assert.ok(batch.events.some(event => event.type === 'representation-limited'));
  }
  assert.equal(agent.inputs.length, 1, 'inspection and retained presentation do not generate');
});

for (const format of ['unicode', 'json'] as const) test(`rejected caller diagnostics are not analyzer provenance (${format})`, async t => {
  const root = temporaryDirectory(t, 'postcode-rejected-provenance-');
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), 'export const entry = 1;');
  const opened = await openSession({ configPath: path.join(root, 'tsconfig.json') });
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  const callerData = { diagnostics: [{ code: 2307, path: '/not-analyzed.ts' }],
    qualifications: [{ diagnostics: [{ code: 1005, path: '/also-not-analyzed.ts' }] }] };
  const rejected = await opened.session.execute({ lens: 'inspect', selector: callerData, presentation: { format, moreDetails: false } } as unknown as ViewRequest);
  assert.equal(rejected.kind, 'resolution');
  if (rejected.kind !== 'resolution') throw new Error('Expected rejected input');
  const batch = commandObservation(opened.session.id, 1, {}, 'refused', rejected.rendered, '', undefined, undefined,
    { kind: 'resolution-result', value: rejected.report }, rejected.context);
  assert.ok(!batch.events.some(event => event.type === 'attribution-disclosed' || event.type === 'source-displayed'));
  assert.ok(!('diagnosticMeanings' in rejected.report), 'caller diagnostics must not receive analyzer meanings');
  if (format === 'json') assert.match(rejected.rendered, /not-analyzed/);
});

test('retained tag filtering preserves plain-text assertions and counts original code points', () => {
  const tags = [{ name: 'see', text: 'Before ```call(😀)``` after' },
    { name: 'remarks', text: '```plaintext\nArchitectural assertion.\n```' }];
  const represented = assertionContent({ text: '', tags });
  assert.equal(represented.tags[0]!.text, 'Before  after');
  assert.equal(represented.tags[0]!.omittedTextCharacters, 13);
  assert.equal(represented.tags[1]!.text, 'Architectural assertion.');
  assert.equal(represented.tags[1]!.omittedTextCharacters, Array.from(tags[1]!.text).length - Array.from('Architectural assertion.').length);
  assert.equal(represented.representationLimits.length, 1);
  assert.match(tags[0]!.text, /call/, 'original assertions remain unchanged');
});

for (const format of ['unicode', 'json'] as const) test(`caller representation-limit fields are not recognized disclosures (${format})`, async t => {
  const root = temporaryDirectory(t, 'postcode-rejected-limits-');
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), 'export const entry = 1;');
  const opened = await openSession({ configPath: path.join(root, 'tsconfig.json') });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const callerData = { representationLimits: ['caller marker'], resolution: { representationLimits: ['nested caller marker'] } };
  for (const omit of [false, true]) {
    const result = await opened.session.execute({ lens: 'inspect', selector: callerData,
      ...(omit ? { parameters: { unrepresentable: () => {} } } : {}), presentation: { format, moreDetails: false } } as unknown as ViewRequest);
    assert.equal(result.kind, 'resolution');
    if (result.kind !== 'resolution') throw new Error('Expected rejected input');
    const recognized: readonly string[] = result.report.resolution.representationLimits!;
    assert.equal(recognized.length > 0, omit, 'only omitted unrepresentable input produces a recognized limit');
    const batch = commandObservation(opened.session.id, 1, {}, 'refused', result.rendered, '', undefined, undefined,
      { kind: 'resolution-result', value: result.report }, result.context);
    assert.equal(batch.events.some(event => event.type === 'representation-limited'), omit);
    assert.deepEqual(batch.records.filter(record => record.kind === 'representation-limit').flatMap(record => (record.value as { limits: string[] }).limits), recognized);
    if (format === 'json') {
      assert.match(result.rendered, /caller marker/, 'caller data stays in the rejected request');
      const attributed = { ...result.report, attribution: { representationLimits: ['attribution marker'] } };
      const repeated = commandObservation(opened.session.id, 2, {}, 'refused', JSON.stringify(attributed), '', undefined, undefined,
        { kind: 'resolution-result', value: attributed }, result.context);
      assert.deepEqual(repeated.records.filter(record => record.kind === 'representation-limit').flatMap(record => (record.value as { limits: string[] }).limits), recognized);
    }
  }
  const result = requireView(await opened.session.execute({ lens: 'modules', selector: null, presentation: { format, moreDetails: false } }));
  const contaminated = { ...result.view, attribution: callerData };
  const batch = observationBatch(contaminated, JSON.stringify(contaminated), { configPath: root, repositoryRoot: root, methods: [] }, result.context);
  assert.ok(!batch.events.some(event => event.type === 'representation-limited'));
  assert.ok(!batch.records.some(record => record.kind === 'representation-limit'));
});

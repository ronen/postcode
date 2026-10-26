import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { temporaryDirectory } from './cli-helpers.js';
import { requireResolution, requireView } from './request-helpers.js';
import { discover } from './helpers.js';
import { modules } from './projection-helpers.js';
import { recordId } from '../src/lib/identity.js';
import { resolveModuleProjection } from '../src/lib/module-content.js';
import { finalizeInvestigationUsage } from '../src/lib/investigation/presentation.js';
import { openSession } from '../src/lib/session.js';
import { renderRequestReport } from '../src/lib/request-reporting.js';
import { captureCatalog, defaultCatalog } from '../src/lib/request-catalog.js';
import { presentations, settlePresentation, validatePresentationContent } from '../src/lib/presentation-contracts.js';
import type { PresentationDefinition } from '../src/lib/presentation-contracts.js';

const json = { format: 'json' as const, sourceDetail: false };
const interpretation = presentations.find(item => item.contract === 'investigation')!;
function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-presentation-contracts-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['entry.ts'] }));
  writeFileSync(path.join(root, 'entry.ts'), 'export const entry = 1;');
  return { configPath };
}
async function session(t: TestContext, definitions: readonly PresentationDefinition[]) {
  const opened = await openSession(fixture(t), {}, { ...defaultCatalog, presentations: definitions });
  assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  return opened.session;
}

test('incompatible prospective Presentation refuses before lookup or requested Evaluation', async t => {
  const active = await session(t, []);
  const report = requireResolution(await active.execute({ lens: 'summarize', selector: 'entry', presentation: json }));
  assert.equal(report.resolution.reason, 'presentation-unavailable');
  assert.deepEqual(report.resolution.candidates, []);
  assert.deepEqual(report.resolution.prerequisites, []);
  assert.deepEqual(report.resolution.retainedAnswers, []);
  assert.deepEqual(report.attribution!.work, []);
  assert.equal(report.context.request.kind, 'lens');
  assert.equal(report.context.request.lens, 'summarize');
});

test('resolved subject contract refusal preserves actual prerequisite qualification', async t => {
  const active = await session(t, [interpretation]);
  const report = requireResolution(await active.execute({ lens: 'inspect', selector: 'entry', presentation: json }));
  assert.equal(report.resolution.reason, 'presentation-unavailable');
  assert.equal(report.resolution.candidates.length, 1);
  assert.equal(report.resolution.candidates[0]!.kind, 'module');
  assert.ok(report.resolution.prerequisites.length);
  assert.ok(report.resolution.support!.length);
  assert.deepEqual(report.resolution.retainedAnswers, []);
  assert.ok(report.attribution!.work.every(item => item.current.role === 'resolution-prerequisite'));
});

test('materialization refusal retains its answer and reports it without a View', async t => {
  const active = await session(t, [{ ...interpretation, precondition: 'complete-materialization' }]);
  const result = await active.execute({ lens: 'summarize', selector: 'entry', presentation: { ...json, format: 'unicode' } });
  const report = requireResolution(result);
  assert.equal(report.resolution.reason, 'presentation-unavailable');
  assert.equal(report.resolution.retainedAnswers.length, 1);
  assert.match(result.rendered, /Retained answer: @answer-/);
  assert.match(result.rendered, /Use present @answer-reference|All references expire/);
  assert.match(result.rendered, /Candidate references remain usable while this Session is valid\./);
  for (const referenceLifetime of ['session', 'command'] as const) {
    const noCandidates = renderRequestReport({ ...report,
      context: { ...report.context, request: { ...report.context.request, referenceLifetime } },
      resolution: { ...report.resolution, candidates: [] } });
    assert.match(noCandidates, /Retained answer: @answer-/);
    assert.match(noCandidates, /Use present @answer-reference|All references expire/);
    assert.match(noCandidates, referenceLifetime === 'command' ? /Open postcode shell/ : /Use present @answer-reference/);
  }
  assert.match(result.rendered, /Interpretation: configuration-unavailable/);
  assert.equal(report.resolution.candidates.length, 1);
  assert.equal(report.attribution!.status, 'refused');
  const repeat = requireResolution(await active.execute({ lens: 'summarize', selector: report.resolution.candidates[0]!.reference,
    reference: true, presentation: json }));
  assert.deepEqual(repeat.resolution.retainedAnswers, report.resolution.retainedAnswers);
  const retained = requireResolution(await active.execute({ kind: 'present', target: report.resolution.retainedAnswers[0]!.id, presentation: json }));
  assert.equal(retained.resolution.reason, 'presentation-unavailable');
  assert.match(retained.resolution.explanation, /materialization precondition/);
  assert.doesNotMatch(retained.resolution.explanation, /new information request/i);
  assert.deepEqual(retained.resolution.retainedAnswers, report.resolution.retainedAnswers);
  assert.deepEqual(retained.attribution!.work, []);
  const command = requireResolution(await active.execute({ lens: 'summarize', selector: 'entry', referenceLifetime: 'command', presentation: json }));
  assert.match(command.referenceNotice!, /All answer, subject and supporting references expire/);
  assert.match(renderRequestReport(command), /Open postcode shell/);
  assert.deepEqual(JSON.parse(JSON.stringify(report)), structuredClone(report));
});

test('declared fallback preserves explicit format and source choices and explains its use', async t => {
  const strict = { ...interpretation, id: 'complete-interpretation', precondition: 'complete-materialization' as const, fallback: 'qualified-interpretation' };
  const fallback = { ...interpretation, id: 'qualified-interpretation', default: false };
  const active = await session(t, [strict, fallback]);
  for (const format of ['json', 'unicode'] as const) {
    const result = requireView(await active.execute({ lens: 'summarize', selector: 'entry', presentation: { format, sourceDetail: true } }));
    assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
    assert.equal(result.view.result!.unavailable!.kind, 'configuration-unavailable');
    assert.equal(result.view.presentation.format, format);
    assert.equal(result.view.presentation.sourceDetail, true);
    assert.equal(result.view.presentation.decision!.selected, fallback.id);
    assert.equal(result.view.presentation.decision!.changes.length, 1);
    assert.equal(result.view.presentation.decision!.criteria.precondition, 'qualified');
    const retained = requireView(await active.execute({ kind: 'present', target: result.view.projection.id, presentation: { format, sourceDetail: true } }));
    assert.equal(retained.view.projection.id, result.view.projection.id);
    assert.equal(retained.view.presentation.decision!.selected, fallback.id);
    assert.equal(retained.failed, false);
    const finalized = finalizeInvestigationUsage(result.view, { ...result.view.usage, missingCalls: 2 }, result.investigationArrangementKey!);
    assert.deepEqual(finalized.presentation, result.view.presentation);
    assert.deepEqual(finalizeInvestigationUsage(finalized, finalized.usage, result.investigationArrangementKey!), finalized);
    if (format === 'unicode') assert.match(result.rendered, /Presentation changed from complete-interpretation to qualified-interpretation/);
    else assert.equal(JSON.parse(result.rendered).presentation.decision.selected, fallback.id);
  }
});

test('declared fallback expansions are acquired before constructing and arranging the answer', async t => {
  const module = presentations.find(item => item.contract === 'modules')!;
  const active = await session(t, [{ ...module, id: 'minimal', requirements: { modules: [], groups: [] },
    precondition: 'complete-materialization', fallback: 'detailed' }, { ...module, id: 'detailed', default: false }]);
  const result = requireView(await active.execute({ lens: 'modules', selector: null, presentation: json }));
  assert.equal(result.view.schema, 'postcode-view/1-experimental');
  assert.equal(result.view.presentation.decision!.selected, 'minimal');
  assert.ok(result.view.modules[0]!.exports.some(item => item.exportedName === 'entry'));
  assert.ok(result.attribution.work.some(item => item.boundary === 'provider-expansion' && item.outcome.expansion?.requirement === 'exports'));
  assert.ok(result.view.evaluations.some(item => item.requirement === 'exports'));
});

test('fallback cannot silently drop explicit format or source requirements', async t => {
  for (const restriction of [{ formats: ['unicode'] as const }, { source: 'none' as const }]) {
    const active = await session(t, [{ ...interpretation, precondition: 'complete-materialization', fallback: 'limited' },
      { ...interpretation, id: 'limited', default: false, ...restriction }]);
    const report = requireResolution(await active.execute({ lens: 'summarize', selector: 'entry', presentation: { ...json, sourceDetail: true } }));
    assert.equal(report.resolution.reason, 'presentation-unavailable');
    assert.equal(report.resolution.retainedAnswers.length, 1);
  }
});

test('qualified partial module content remains usable, empty populations remain valid, malformed content throws', async t => {
  const { store, evaluation } = await discover(fixture(t).configPath);
  const qualified = presentations.find(item => item.contract === 'modules')!;
  const strict = { ...qualified, precondition: 'complete-materialization' as const };
  const partial = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'controlled-partial'),
    execution: 'stopped' as const, materialization: 'partial' as const, reason: 'Controlled incomplete population.' };
  const empty = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'controlled-empty'), modules: [] };
  store.put([partial, empty]);
  const partialContent = { contract: 'modules' as const, value: resolveModuleProjection(store, modules(store, partial)) };
  assert.equal(settlePresentation([qualified], partialContent)!.selected, qualified.id);
  assert.equal(settlePresentation([strict], partialContent), null);
  assert.ok(settlePresentation([strict], { contract: 'modules', value: resolveModuleProjection(store, modules(store, empty)) }));
  const malformed = { ...partialContent, value: { ...partialContent.value, modules: [] } };
  assert.throws(() => validatePresentationContent(malformed), /Malformed module/);
  assert.throws(() => settlePresentation([strict], malformed), /Malformed module/);
  assert.throws(() => settlePresentation([interpretation], partialContent), /does not match/);
});

test('Presentation catalog rejects cycles, cross-contract fallbacks and unsupported requirements', () => {
  for (const definitions of [
    [{ ...interpretation, fallback: interpretation.id }],
    [{ ...interpretation, fallback: 'module' }, presentations[0]!],
    [{ ...interpretation, requirements: { modules: ['exports'] as const, groups: [] } }],
    [{ ...presentations[0]!, source: 'supported' as const }],
  ]) assert.throws(() => captureCatalog({ ...defaultCatalog, presentations: definitions }), /Presentation/);
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { digest, identityReference, recordId, sessionId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { inspect } from './projection-helpers.js';
import { emptyModuleDetail } from '../src/lib/projections.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { inspectOrganization } from './projection-helpers.js';
import { referenceBinding } from '../src/lib/reference-binding.js';
import type { EvaluationRecord, ProgramRecord, ProgramRecordStore, RecordId, SessionId } from '../src/lib/records.js';
import type { Correction, Investigram, InvestigationProvenance, Inconsistency } from '../src/lib/investigation/contracts.js';
import type { InvestigationEvaluationRecord, InvestigationSelection } from '../src/lib/investigation/evaluation.js';
import type { InvestigationSelectionProjection } from '../src/lib/investigation/selection-record.js';
import { selectionIdentity } from '../src/lib/investigation/selection-record.js';
import { selectAssociatedInspection, selectInvestigation } from '../src/lib/investigation/selection.js';
import { resolveInvestigationContent } from '../src/lib/investigation/content.js';
import { revisionPage } from '../src/lib/investigation/revision-page.js';
import { arrangeInvestigationView, createInvestigationView, finalizeInvestigationUsage, renderInvestigationView } from '../src/lib/investigation/presentation.js';
import { arrangeAssociatedInspection, associationContinuation } from '../src/lib/investigation/associations.js';
import { createView } from '../src/lib/presentation.js';
import { usageSummary } from '../src/lib/investigation/reporting.js';
import { sourceDisclosure } from '../src/lib/source-disclosure.js';

interface AccountSpec {
  name: string;
  children?: readonly string[];
  associations?: readonly RecordId[];
  inconsistencies?: readonly Inconsistency[];
  evidence?: readonly RecordId[];
}
interface CorrectionSpec { name: string; reporter: string; target: string; replacement: string }

function fixture(session: SessionId = sessionId(), overrides: Readonly<Record<string, RecordId>> = {}) {
  const store = new MemoryProgramRecordStore(), base = { session, method: 'selection-test@1' };
  const id = (name: string) => overrides[name] ?? recordId(session, 'test', name);
  const module = id('module'), inputs = id('inputs'), context = id('context'), source = id('source');
  const text = 'export const entry = 7;';
  const evaluation: EvaluationRecord = { ...base, id: id('module-evaluation'), kind: 'evaluation', requirement: 'modules', attempt: 1,
    applicability: 'applicable', availability: 'available', execution: 'completed', materialization: 'full', reason: null,
    cost: { measure: 'module-count', value: 2 }, modules: [module, id('module2')], contexts: [context] };
  store.put([{ ...base, id: session, kind: 'session', methods: [], repository: id('repository') },
    { ...base, id: id('repository'), kind: 'repository-evidence', capture: { status: 'available', evidence: {
      provider: 'repository-layout', method: base.method, root: '/fixture', rootPaths: ['/fixture'], gitVersion: 'fixture',
      gitPathPolicy: { ignoreCase: false, precomposeUnicode: false }, inputConsistency: 'first-observed', sparseCheckout: false,
      limitations: ['Fixture capture.'], exclusions: [], excludedOutputDirectories: [], artifacts: [{ path: 'entry.ts', kind: 'file', tracked: true }],
    } }, layout: { method: base.method, regions: [{ path: '.', name: 'entry' }], containment: [],
      placements: [{ artifactPath: 'entry.ts', groupPath: '.', documentation: false }], links: [] } },
    { ...base, id: inputs, kind: 'analysis-inputs', value: { fixture: true } },
    { ...base, id: source, kind: 'source-evidence', path: '/fixture/entry.ts', contentDigest: digest(text), start: 0, length: text.length,
      location: { association: 'file' }, configuredRoot: true, compilerName: null },
    { ...base, id: context, kind: 'claim-context', inputs, scope: 'configured-project', evidence: [source], status: 'mechanically-derived',
      guarantee: 'Fixture guarantee.', limitations: ['Fixture limitation.'], diagnostics: [] },
    ...[module, id('module2')].flatMap((subject, index): ProgramRecord[] => [
      { ...base, id: subject, kind: 'module', claim: id(`module-claim-${index}`) },
      { ...base, id: id(`module-claim-${index}`), kind: 'claim', subject, context, information: { type: 'module',
        name: 'entry', handle: `entry-${index}`, handleStatus: 'generated-navigation-aid', handleProvenance: 'declared-export', discoveryFacets: ['project'] } },
    ]), evaluation,
    { ...base, id: id('capture'), kind: 'captured-content', subject: module, inputs, mapping: source,
      path: '/fixture/entry.ts', contentDigest: digest(text), text, coverage: 'full-file', limitations: ['Captured only.'] },
  ]);
  function publish(specs: readonly AccountSpec[], correctionSpecs: readonly CorrectionSpec[] = [], options: {
    citations?: readonly RecordId[]; complete?: readonly RecordId[]; subject?: RecordId; supplied?: readonly RecordId[]; summarized?: readonly RecordId[];
  } = {}): InvestigationSelection {
    const root = specs[0]!.name;
    const provenance: InvestigationProvenance = { ...base, id: id(`provenance-${root}`), kind: 'investigation-provenance',
      request: { operation: options.subject ? 'clarification' : 'functionality', subject: options.subject ?? module, parameters: {} },
      originatingModule: module, instructions: 'Fixture.', agent: { provider: 'fixture', model: 'fixture', configuration: {}, origin: 'scripted' },
      citations: options.citations ?? [], completeCorrections: options.complete ?? [], completeTargets: [],
      suppliedEvidence: options.supplied ?? [], summarizedEvidence: options.summarized ?? [], deliveries: [] };
    const corrections: Correction[] = correctionSpecs.map(item => ({ ...base, kind: 'investigram-correction', id: id(item.name),
      reporter: id(item.reporter), target: id(item.target), replacement: id(item.replacement), correctedSubjects: [module],
      reason: `Correction ${item.name}`, qualifications: ['Interpretation only.'], evidence: [id(item.target)], provenance: provenance.id }));
    const accounts: Investigram[] = specs.map(item => ({ ...base, id: id(item.name), kind: 'investigram', status: 'interpretation',
      prose: `${item.name}: ${'complete prose '.repeat(80)}`, referent: { description: item.name, subjects: [module] }, originatingModule: module,
      associations: (item.associations ?? []).map(subject => ({ subject, role: 'described', evidence: item.evidence ?? [], qualifications: ['Explicit association.'] })),
      qualifications: ['Interpretation only.'], evidence: item.evidence ?? [], children: (item.children ?? []).map(id),
      corrections: corrections.filter(correction => correction.reporter === id(item.name)).map(item => item.id),
      inconsistencies: item.inconsistencies ?? [], provenance: provenance.id }));
    const evaluation: InvestigationEvaluationRecord = { ...base, id: id(`evaluation-${root}`), kind: 'investigation-evaluation',
      request: provenance.request, attempt: provenance.id, outcome: { kind: 'accepted', root: id(root) }, investigrams: accounts.map(item => item.id), corrections: corrections.map(item => item.id) };
    store.put([provenance, ...accounts, ...corrections, evaluation]);
    return { request: evaluation.request, reused: false, attempt: evaluation.attempt, evaluation, unavailable: null };
  }
  const select = (result: InvestigationSelection) => selectInvestigation(store, session, { lens: 'summarize' }, [module], result);
  const historical = (name: string) => selectInvestigation(store, session, { lens: 'inspect' }, [id(name)], null);
  return { store, session, base, id, module, context, source, inputs, evaluation, publish, select, historical };
}

test('request variants retain semantic outcomes without attempt reporting, pages, usage or allocation', () => {
  const f = fixture(), { store, session, module, id, base } = f;
  const accepted = f.publish([{ name: 'A' }]);
  const selection = f.select(accepted);
  assert.equal(selection.variant, 'request');
  assert.deepEqual(selection.roots, [id('A')]);
  const same = f.select({ ...accepted, reused: true, attempt: id('reporting-only') });
  assert.equal(same, selection, 'identical validated reinsertion preserves owned object');
  assert.ok(Object.isFrozen(selection.revisions[0]!.rows));
  assert.deepEqual(structuredClone(selection), selection);
  assert.ok(!('reused' in selection) && !('attempt' in selection));
  for (const kind of ['limit-stop', 'investigation-failure'] as const) {
    const evaluation: InvestigationEvaluationRecord = { ...base, id: id(kind), kind: 'investigation-evaluation', request: accepted.request,
      attempt: id(`reporting-${kind}`), outcome: { kind, reason: 'Fixture stop.' }, investigrams: [], corrections: [] };
    store.put([evaluation]);
    const projection = f.select({ ...accepted, evaluation, attempt: evaluation.attempt });
    assert.deepEqual(projection.roots, []);
    assert.equal(resolveInvestigationContent(store, projection).evaluation?.outcome.kind, kind);
    assert.equal(store.lookup(evaluation.attempt), undefined, 'failed attempt is a reporting event, not a record');
  }
  const retained = store.investigations(session).length;
  for (const kind of ['configuration-unavailable', 'communication-failure'] as const) {
    const unavailable = { kind, code: 'fixture', diagnostic: 'Unavailable now.' };
    const projection = f.select({ ...accepted, evaluation: null, attempt: id('only-event'), unavailable });
    assert.equal(projection.variant, 'request');
    if (projection.variant !== 'request') throw new Error('Expected request');
    assert.deepEqual(projection.outcome, { kind: 'unavailable', value: unavailable });
    assert.equal(resolveInvestigationContent(store, projection).evaluation, null);
  }
  assert.equal(store.investigations(session).length, retained, 'unavailable selections cannot become reusable evaluations');
  const failed = (requestId: string): InvestigationSelection => ({ ...accepted, evaluation: null, unavailable: {
    kind: 'communication-failure', code: 'provider-error', diagnostic: 'Request failed.', provider: { status: 500, requestId, body: { requestId } },
  } });
  const firstFailure = failed('one'), secondFailure = failed('two');
  const unavailableProjection = f.select(firstFailure);
  assert.equal(f.select(secondFailure), unavailableProjection, 'provider request IDs and bodies remain reporting, not Projection identity');
  assert.equal(firstFailure.unavailable?.provider?.requestId, 'one', 'request reporting remains intact');
  assert.deepEqual(unavailableProjection.variant === 'request' && unavailableProjection.outcome,
    { kind: 'unavailable', value: { kind: 'communication-failure', code: 'provider-error', diagnostic: 'Request failed.' } });
  assert.notEqual(f.select({ ...firstFailure, unavailable: { ...firstFailure.unavailable!, diagnostic: 'Different failure.' } }).id, unavailableProjection.id);
  assert.throws(() => selectInvestigation(store, session, { lens: 'summarize' }, [module], null), /requires an outcome/);
  for (const lens of ['dependency-children', 'dependency-parents'] as const) assert.throws(() =>
    selectInvestigation(store, session, { lens }, [id('A')], null), /resolved investigation subject/);
  if (unavailableProjection.variant !== 'request') throw new Error('Expected request');
  assert.throws(() => store.put([{ ...unavailableProjection, id: id('invalid-provider'),
    outcome: { kind: 'unavailable', value: firstFailure.unavailable! } }]), /provider reporting/);
  assert.throws(() => store.put([{ ...unavailableProjection, id: id('invalid-no-evaluation'), outcome: { kind: 'no-evaluation' } } as unknown as InvestigationSelectionProjection]), /requires an outcome/);
  for (const selected of [[], [module, id('module2')]]) {
    assert.throws(() => selectInvestigation(store, session, { lens: 'summarize' }, selected, null), /resolved investigation subject/);
  }
  for (const lens of ['summarize', 'dependency-children', 'dependency-parents'] as const) {
    assert.throws(() => selectInvestigation(store, session, { lens }, [id('A')], null), /resolved investigation subject/);
  }
  assert.throws(() => selectInvestigation(store, session, { lens: 'explain' }, [module], null), /resolved investigation subject/);
  assert.throws(() => selectInvestigation(store, session, { lens: 'inspect' }, [], null), /resolved investigation subject/);
  const bound = selectInvestigation(store, session, { lens: 'inspect' }, [id('A')], null);
  assert.deepEqual(bound.subjects, [id('A')]);
  assert.equal('selector' in bound, false);
  assert.throws(() => store.put([{ ...bound, id: id('invalid-lookup'), selector: { literal: 'A' } } as unknown as InvestigationSelectionProjection]), /Invocation-specific/);
});

test('retained snapshots reconstruct without session enumeration after corrections, associations and inconsistencies accumulate', () => {
  const f = fixture(), { id, store, session, module } = f;
  const initial = f.publish([{ name: 'A', children: ['child'], associations: [module] }, { name: 'child' }]);
  const before = f.select(initial), historical = f.historical('A');
  const mechanical = inspect(store, f.evaluation, 'entry-0');
  const associated = selectAssociatedInspection(store, mechanical.id, [module]);
  const originalContent = structuredClone(resolveInvestigationContent(store, before));
  f.publish([{ name: 'B', associations: [module], inconsistencies: [{ targets: [id('A')], reason: 'Disagrees.', evidence: [f.id('module-claim-0')], qualifications: ['Scoped.'] }] }],
    [{ name: 'AB', reporter: 'B', target: 'A', replacement: 'B' }]);
  const after = f.select(initial), newAssociated = selectAssociatedInspection(store, mechanical.id, [module]);
  assert.notEqual(before.id, after.id); assert.notEqual(associated.id, newAssociated.id);
  assert.deepEqual(after.relations, [{ original: id('A'), account: id('B') }, { original: id('B'), account: id('B') }],
    'the accompanying route to the already-selected primary remains explicit');
  assert.deepEqual(after.displaced, [id('A'), id('child')]);
  assert.deepEqual(f.historical('A').relations.map(item => item.account), [id('A'), id('child')]);
  assert.deepEqual(associated.associated, [id('A')]); assert.deepEqual(newAssociated.associated, [id('A'), id('B')]);
  const fixedOnly: ProgramRecordStore = { get: id => store.get(id), lookup: () => { throw new Error('No lookup'); },
    put: () => { throw new Error('No publication'); }, investigations: () => { throw new Error('No history enumeration'); },
    answerIds: () => { throw new Error('Forbidden answer binding'); }, boundAnswer: () => { throw new Error('Forbidden answer lookup'); }, boundEntity: () => { throw new Error('No subject lookup'); },
    evaluations: () => { throw new Error('No evaluation enumeration'); }, entityIds: () => { throw new Error('No allocation'); } };
  assert.deepEqual(resolveInvestigationContent(fixedOnly, before), originalContent);
  assert.deepEqual(resolveInvestigationContent(fixedOnly, historical).projection, historical);
  assert.deepEqual(resolveInvestigationContent(fixedOnly, associated).projection.associated, [id('A')]);
  const current = resolveInvestigationContent(fixedOnly, after);
  assert.equal(current.projection.revisions.find(item => item.original === id('A'))!.inconsistencies[0]!.reporter, id('B'));
  f.publish([{ name: 'unrelated' }]);
  assert.equal(f.select(initial), after, 'unrelated accumulation leaves the complete retained payload unchanged');
  store.put([structuredClone(before), structuredClone(associated)]);
  assert.equal(store.get(before.id), before, 'old records remain valid after later history');
  assert.equal(store.investigations(session).length, 3);
});

test('unpaged content retains all accounts, displaced descendants and their corrections, full sources and exposure pairs', () => {
  const f = fixture(), { id, store } = f;
  f.publish([{ name: 'old-target' }]);
  const children = Array.from({ length: 270 }, (_, i) => `child-${i}`);
  const initial = f.publish([{ name: 'root', children }, ...children.map(name => ({ name, evidence: [id('module-claim-0'), id('capture')] })),
    { name: 'child-replacement' }], [{ name: 'child-correction', reporter: 'child-269', target: 'old-target', replacement: 'child-replacement' }],
    { supplied: [id('module-claim-0'), id('capture')], summarized: [id('module-claim-0')] });
  const projection = f.select(initial), content = resolveInvestigationContent(store, projection);
  assert.equal(projection.relations.length, 272);
  assert.ok(content.accounts.some(item => item.id === id('child-269')));
  assert.ok(content.accounts.every(item => item.prose.length > 400));
  const support = content.support.find(item => item.record.id === id('module-claim-0'))!;
  assert.equal(support.qualification!.context.guarantee, 'Fixture guarantee.');
  assert.equal(support.inputs!.id, f.inputs); assert.equal(support.sources[0]!.id, f.source);
  assert.deepEqual(support.exposures, [{ provenance: id('provenance-root'), forms: ['full', 'summary'] }]);
  assert.equal(content.support.find(item => item.record.id === id('capture'))!.record.kind, 'captured-content');
  assert.deepEqual(structuredClone(content), content);
  assert.ok(Object.isFrozen(content.support[0]!.exposures));
  f.publish([{ name: 'replacement' }], [{ name: 'replace-root', reporter: 'replacement', target: 'root', replacement: 'replacement' }]);
  const replaced = f.select(initial), resolved = resolveInvestigationContent(store, replaced);
  assert.equal(replaced.displaced.length, 271);
  assert.ok(resolved.corrections.some(item => item.id === id('child-correction')), 'corrections on deep displaced descendants survive');
  const allowed = new Set(resolved.references.map(item => item.id));
  for (const name of ['child-269', 'child-replacement', 'old-target']) assert.ok(allowed.has(id(name)), name);
});

test('revision snapshots preserve transitive causes, whole-evaluation exemptions, branches and all inconsistency reporters', () => {
  const f = fixture(), { id } = f;
  f.publish([{ name: 'A' }]);
  f.publish([{ name: 'Y' }], [], { citations: [id('A')] });
  f.publish([{ name: 'Z' }], [], { citations: [id('Y')] });
  f.publish([{ name: 'B', children: ['B-child'] }, { name: 'B-child' }], [{ name: 'AB', reporter: 'B', target: 'A', replacement: 'B' }], { citations: [id('A')] });
  f.publish([{ name: 'aware', children: ['aware-child'] }, { name: 'aware-child' }], [], { citations: [id('Y')], complete: [id('AB')] });
  f.publish([{ name: 'through-aware' }], [], { citations: [id('aware')] });
  f.publish([{ name: 'alternate' }], [], { citations: [id('aware'), id('Z')] });
  const status = (name: string) => f.historical(name).revisions.find(item => item.original === id(name))!;
  assert.deepEqual(status('alternate').rows[0]!.cause, { direct: false, via: [id('Z')] });
  for (const name of ['B', 'B-child', 'aware', 'aware-child', 'through-aware']) assert.equal(status(name).needsReconsideration, false, name);
  const old = f.historical('A');
  f.publish([{ name: 'C' }], [{ name: 'AC', reporter: 'C', target: 'A', replacement: 'C' }]);
  f.publish([{ name: 'D' }], [{ name: 'BD', reporter: 'D', target: 'B', replacement: 'D' }]);
  const current = status('A');
  assert.equal(current.primary, id('D')); assert.equal(current.conflicting, true);
  assert.deepEqual(current.rows.map(row => row.correction), ['AB', 'AC', 'BD'].map(id));
  assert.equal(old.revisions[0]!.primary, id('B'));
  for (let i = 0; i < 30; i++) f.publish([{ name: `reporter-${i}`, inconsistencies: [{ targets: [id('Z')], reason: `Disagreement ${i}`, evidence: [], qualifications: ['Scoped.'] }] }]);
  const revision = status('Z');
  assert.equal(revision.inconsistencies.length, 30); assert.equal(revisionPage(revision).inconsistencies.length, 24);
  assert.equal(revisionPage(revision, 2).inconsistencies.length, 6);
  const content = resolveInvestigationContent(f.store, f.historical('Z'));
  assert.ok(content.provenance.some(item => item.id === id('provenance-reporter-29')));
  assert.ok(content.references.some(item => item.id === id('reporter-29')));
});

test('selection identity normalizes only known references and ignores irrelevant acceptance-rank shifts', () => {
  function scenario(session: SessionId, extra: boolean) {
    const f = fixture(session), initial = f.publish([{ name: 'A' }]);
    if (extra) { f.publish([{ name: 'unrelated' }]); f.publish([{ name: 'unrelated-replacement' }],
      [{ name: 'unrelated-correction', reporter: 'unrelated-replacement', target: 'unrelated', replacement: 'unrelated-replacement' }]); }
    f.publish([{ name: 'B' }], [{ name: 'AB', reporter: 'B', target: 'A', replacement: 'B' }]);
    return { f, selection: f.select(initial) };
  }
  const a = scenario(sessionId(), false), b = scenario(sessionId(), true);
  assert.equal(identityReference(a.f.session, a.selection.id), identityReference(b.f.session, b.selection.id));
  const unavailable: InvestigationSelection = { request: { operation: 'functionality', subject: a.f.module, parameters: {} },
    reused: false, attempt: null, evaluation: null, unavailable: { kind: 'configuration-unavailable', code: 'disabled', diagnostic: 'Disabled.' } };
  const selection = selectInvestigation(a.f.store, a.f.session, { lens: 'summarize' }, [a.f.module], unavailable);
  const repeated = selectInvestigation(a.f.store, a.f.session, { lens: 'summarize' }, [a.f.module], unavailable);
  assert.equal(selection, repeated, 'identical qualified payloads resubmit consistently');
  const { id: _id, ...payload } = selection;
  assert.equal(Object.hasOwn(selectionIdentity(payload) as object, 'selector'), false, 'designation is excluded from retained identity');
  assert.deepEqual(selectionIdentity(selection), selectionIdentity(payload), 'own identity is never part of its key');
});

test('retention has no revision, proximal-citation, association-page or prose bounds', () => {
  const f = fixture(), { id, store, module } = f;
  f.publish([{ name: 'A' }]);
  const citers = Array.from({ length: 10 }, (_, n) => `citer-${n}`);
  for (const name of citers) f.publish([{ name }], [], { citations: [id('A')] });
  f.publish([{ name: 'selected' }], [], { citations: citers.map(id) });
  for (let i = 0; i < 27; i++) f.publish([{ name: `replacement-${i}`, associations: [module] }],
    [{ name: `correction-${i}`, reporter: `replacement-${i}`, target: 'A', replacement: `replacement-${i}` }]);
  const projection = f.historical('selected'), revision = projection.revisions[0]!;
  assert.equal(revision.rows.length, 27); assert.equal(revision.rows[0]!.cause!.via.length, 10);
  assert.equal(revisionPage(revision).rows[0]!.cause!.omittedVia, 2);
  assert.equal(revisionPage(revision, 2).rows.length, 3);
  const content = resolveInvestigationContent(store, projection);
  assert.ok(content.references.some(item => item.id === id('citer-9')), 'full via population authorizes references outside page bounds');
  assert.ok(content.corrections.some(item => item.id === id('correction-26')));
  const mechanical = inspect(store, f.evaluation, 'entry-0');
  const associated = selectAssociatedInspection(store, mechanical.id, [module]);
  assert.deepEqual(associated.associated, Array.from({ length: 27 }, (_, n) => id(`replacement-${n}`)));
  assert.equal(resolveInvestigationContent(store, associated).accounts.filter(item => associated.associated.includes(item.id)).length, 27);
  const emptyMechanical = emptyModuleDetail(store, f.evaluation);
  const empty = selectAssociatedInspection(store, emptyMechanical.id, []);
  assert.equal(empty.variant, 'associated-inspection'); assert.deepEqual(empty.associated, []);
  assert.equal(store.get(empty.id), empty);
});

test('associated selections retain the shown module or mixed organization basis and explicit subject population', () => {
  const f = fixture(), { store, module } = f;
  const outcome = evaluateOrganization(store, f.evaluation);
  const moduleOnly = inspectOrganization(store, outcome, 'entry-0');
  assert.deepEqual(moduleOnly.groups, []);
  assert.ok(moduleOnly.moduleProjection);
  const moduleBasis = store.get(moduleOnly.moduleProjection);
  assert.equal(moduleBasis.kind, 'projection');
  const moduleSelection = selectAssociatedInspection(store, moduleBasis.id, [module]);
  assert.equal(moduleSelection.variant === 'associated-inspection' && moduleSelection.mechanical, moduleBasis.id);
  assert.notEqual(moduleBasis.id, moduleOnly.id);
  const mixed = inspectOrganization(store, outcome, 'entry');
  assert.equal(mixed.groups.length, 1);
  const embedded = store.get(mixed.moduleProjection!);
  assert.equal(embedded.kind, 'projection');
  if (embedded.kind !== 'projection') throw new Error('Expected module Projection');
  const subjects = [...mixed.groups, ...embedded.modules];
  const selected = selectAssociatedInspection(store, mixed.id, subjects);
  assert.equal(selected.variant === 'associated-inspection' && selected.mechanical, mixed.id);
  assert.deepEqual(selected.subjects, subjects);
  assert.throws(() => selectAssociatedInspection(store, mixed.id, [module]), /subjects/);
  assert.deepEqual(selected.associated, []);
});

test('selection validation rejects wrong kinds, sessions and incomplete graphs atomically, preserving original records', () => {
  const f = fixture(), result = f.publish([{ name: 'A', children: ['child'] }, { name: 'child' }]);
  const projection = f.select(result), foreign = fixture();
  f.store.put([{ ...foreign.base, id: foreign.session, kind: 'session', methods: [] }]);
  const marker: ProgramRecord = { ...f.base, kind: 'analysis-inputs', id: f.id('marker'), value: {} };
  const variants: InvestigationSelectionProjection[] = [
    { ...projection, subjects: [f.source] }, { ...projection, subjects: [foreign.session] },
    { ...projection, roots: [] }, { ...projection, relations: projection.relations.slice(0, 1) },
    { ...projection, navigation: [] }, { ...projection, revisions: [] },
    { ...projection, revisions: projection.revisions.map(item => revisionPage(item)) },
    { ...projection, status: 'empty' },
  ];
  for (const [index, value] of variants.entries()) {
    const invalid = { ...value, id: f.id(`invalid-${index}`) };
    assert.throws(() => f.store.put([marker, invalid]));
    assert.equal(f.store.lookup(marker.id), undefined); assert.equal(f.store.lookup(invalid.id), undefined);
  }
  assert.throws(() => f.store.put([{ ...projection, status: 'empty' }]), /collision/);
  assert.equal(f.store.get(projection.id), projection);
});

test('binding port cannot allocate outside its typed population or partially bind invalid batches', () => {
  const f = fixture(), prefix = '12345678';
  const colliding = (tail: string) => `${f.session}:test:${prefix}${tail.repeat(56)}` as RecordId;
  const a = colliding('a'), b = colliding('b');
  const context = f.store.get(f.context);
  assert.equal(context.kind, 'claim-context');
  f.store.put([a, b].flatMap((id, index): ProgramRecord[] => [
    { ...f.base, id, kind: 'module', claim: f.id(`collision-claim-${index}`) },
    { ...f.base, id: f.id(`collision-claim-${index}`), kind: 'claim', subject: id, context: f.context,
      information: { type: 'module', name: null, handle: `collision-${index}`, handleStatus: 'generated-navigation-aid', handleProvenance: 'anonymous-fallback', discoveryFacets: [] } },
  ]));
  const references = [{ id: a, kind: 'module' as const }, { id: b, kind: 'module' as const }];
  const port = referenceBinding(f.store, f.session, references);
  assert.deepEqual(Object.keys(port), ['bind']);
  assert.throws(() => port.bind([a, f.module], 'module'), /population/);
  assert.throws(() => port.bind([a], 'investigram'), /kind/);
  assert.equal(port.bind([b], 'module').get(b), `module-${prefix}`, 'invalid batches did not allocate a');
  assert.equal(port.bind([a], 'module').get(a), `module-${prefix}a`);
  assert.equal(port.bind([b], 'module').get(b), `module-${prefix}`);
  assert.throws(() => referenceBinding(f.store, sessionId(), references), /population/);
});

test('interpretation support display follows retained-selection meaning instead of the Lens spelling', () => {
  const f = fixture();
  const result = f.publish([{ name: 'A', evidence: [f.id('module-claim-0')] }], [], { supplied: [f.id('module-claim-0')] });
  for (const projection of [f.select(result), f.historical('A')]) {
    const content = resolveInvestigationContent(f.store, projection);
    const { view } = arrangeInvestigationView(content, { title: 'Qualified accounts', presentation: { format: 'unicode', sourceDetail: false } },
      projection.variant === 'request' ? { reused: false, attempt: result.attempt } : null,
      usageSummary([]), referenceBinding(f.store, f.session, content.references));
    assert.ok(view.support.length);
    const rendered = renderInvestigationView(view);
    assert.equal(renderInvestigationView({ ...view, projection: { ...view.projection, lens: 'fixture-account-question' } }), rendered);
    assert.equal(rendered.includes('Support (exposure identified by provenance)'), projection.variant !== 'request');
    assert.equal(sourceDisclosure(view), null);
  }
});

test('arrangement is self-contained, preserves bounded disclosure and distinguishes presentation from Projection identity', () => {
  const f = fixture(), { id, store } = f;
  const children = Array.from({ length: 270 }, (_, n) => `child-${n}`);
  const result = f.publish([{ name: 'A', children }, ...children.map(name => ({ name, evidence: [id('module-claim-0')] }))], [],
    { supplied: [id('module-claim-0')] });
  const content = structuredClone(resolveInvestigationContent(store, f.select(result)));
  const spellings = store.entityIds(content.references.filter(item => item.kind === 'investigram').map(item => item.id), 'investigram');
  const modules = store.entityIds([f.module], 'module');
  const calls: { ids: readonly RecordId[]; kind: string }[] = [];
  const bindings = { bind(ids: readonly RecordId[], kind: 'module' | 'group' | 'investigram') {
    calls.push({ ids, kind });
    return new Map(ids.map(id => [id, (kind === 'investigram' ? spellings : modules).get(id)!]));
  } };
  const options = { title: 'Investigation test', presentation: { format: 'json' as const, sourceDetail: false } };
  const report = { reused: false, attempt: result.attempt };
  const usage = usageSummary([]);
  const plain = arrangeInvestigationView(content, options, report, usage, bindings);
  assert.equal(plain.view.accounts.length, 256); assert.equal(plain.view.omittedAccounts.length, 15);
  assert.equal(sourceDisclosure(plain.view), null, 'held source is not disclosure');
  assert.equal(calls[0]!.kind, 'investigram'); assert.equal(calls[1]!.kind, 'module'); assert.equal(calls[2]!.kind, 'module');
  const fresh = arrangeInvestigationView(content, { ...options, selectionMode: 'fresh' }, null, usage, bindings);
  const retained = arrangeInvestigationView(content, { ...options, selectionMode: 'retained' }, null, usage, bindings);
  assert.notEqual(fresh.investigationArrangementKey, retained.investigationArrangementKey);
  assert.notEqual(fresh.view.id, retained.view.id);
  assert.deepEqual({ ...fresh.view, id: retained.view.id, selectionMode: 'retained' }, retained.view);
  const variants = [
    { ...options, presentation: { format: 'unicode' as const, sourceDetail: false } },
    { ...options, presentation: { format: 'json' as const, sourceDetail: true } },
    { ...options, revisionPage: 99 }, { ...options, after: 'unknown' }, { ...options, after: 'another-unknown' },
    { ...options, referenceLifetime: 'command' as const },
  ].map(options => arrangeInvestigationView(content, options, report, usage, bindings));
  assert.equal(new Set([plain, ...variants].map(item => item.view.projection.id)).size, 1);
  assert.equal(new Set([plain, ...variants].map(item => item.view.id)).size, 7);
  assert.equal(arrangeInvestigationView(content, { ...options, revisionPage: 1 }, report, usage, bindings).view.id, plain.view.id);
  const source = variants[1]!.view;
  assert.ok(sourceDisclosure(source)); assert.equal(source.sourceDetail!.items.length, 1);
  assert.equal(renderInvestigationView(JSON.parse(JSON.stringify(source))), renderInvestigationView(source));
  assert.deepEqual(finalizeInvestigationUsage(plain.view, usage, plain.investigationArrangementKey), plain.view);
  const changed = finalizeInvestigationUsage(plain.view, { ...usage, missingCalls: 2 }, plain.investigationArrangementKey);
  assert.notEqual(changed.id, plain.view.id); assert.equal(changed.projection.id, plain.view.projection.id);
  assert.deepEqual(finalizeInvestigationUsage(changed, { ...usage, missingCalls: 2 }, plain.investigationArrangementKey), changed);
  assert.notEqual(arrangeInvestigationView(content, options, { ...report, reused: true }, usage, bindings).view.id, plain.view.id);
  const unavailable = (requestId: string): InvestigationSelection => ({ ...result, evaluation: null,
    unavailable: { provider: { status: 500, body: 'error', requestId }, kind: 'communication-failure', code: 'provider', diagnostic: 'Failed.' } });
  const one = createInvestigationView(store, f.session, { ...options, lens: 'summarize' }, [f.module], unavailable('one'), usage);
  const two = createInvestigationView(store, f.session, { ...options, lens: 'summarize' }, [f.module], unavailable('two'), usage);
  assert.equal(one.view.projection.id, two.view.projection.id); assert.notEqual(one.view.id, two.view.id);
  assert.equal(one.view.result!.unavailable!.provider!.requestId, 'one');
  assert.equal(JSON.stringify(one.view.result!.unavailable), JSON.stringify(unavailable('one').unavailable),
    'preserve the production adapter failure field order in JSON and observations');

});

test('association continuation identity uses precise selected matches in both View formulas', () => {
  const f = fixture(), { store, module, id } = f;
  f.publish([{ name: 'A' }, { name: 'associated', associations: [id('A'), module] }]);
  const content = resolveInvestigationContent(store, f.historical('A'));
  const options = { title: 'Investigation test', presentation: { format: 'json' as const, sourceDetail: false } };
  const bindings = (spelling: string) => ({ bind(ids: readonly RecordId[]) { return new Map(ids.map(id => [id, id === f.id('associated') ? spelling : `ref-${id}`])); } });
  const first = arrangeInvestigationView(content, { ...options, after: 'short' }, null, usageSummary([]), bindings('short'));
  const second = arrangeInvestigationView(content, { ...options, after: 'longer' }, null, usageSummary([]), bindings('longer'));
  assert.equal(first.view.id, second.view.id); assert.equal(first.view.investigations!.after, 'short');
  assert.equal(second.view.investigations!.after, 'longer');
  const projection = inspect(store, f.evaluation, 'entry-0'), mechanical = createView(store, projection, options.presentation, 'Inspect');
  const associated = resolveInvestigationContent(store, selectAssociatedInspection(store, projection.id, [module]));
  const one = arrangeAssociatedInspection(mechanical, associated, new Map([[id('associated'), 'short']]), 'short');
  const two = arrangeAssociatedInspection(mechanical, associated, new Map([[id('associated'), 'longer']]), 'longer');
  assert.equal(one.id, two.id); assert.equal(one.projection.id, associated.projection.id);
  const unknown = arrangeAssociatedInspection(mechanical, associated, new Map([[id('associated'), 'short']]), 'unknown');
  assert.notEqual(one.id, unknown.id); assert.equal(one.projection.id, unknown.projection.id);
  assert.equal(unknown.investigations.status, 'unknown-continuation');
  assert.deepEqual(associationContinuation(f.session, [], new Map(), null), associationContinuation(f.session, [], new Map()));
});

test('exact investigram inspection retains its contextual heading and explicit title overrides', () => {
  const f = fixture();
  f.publish([{ name: 'A' }]);
  const request = { lens: 'inspect', presentation: { format: 'unicode' as const, sourceDetail: false } };
  const { view } = createInvestigationView(f.store, f.session, request, [f.id('A')], null, usageSummary([]));
  assert.equal(view.title, 'Inspect · investigram');
  assert.equal(renderInvestigationView(view).split('\n')[0], 'Inspect · investigram');
  const retitled = createInvestigationView(f.store, f.session, { ...request, title: 'Supplied question' }, [f.id('A')], null, usageSummary([])).view;
  assert.equal(retitled.title, 'Supplied question');
  assert.equal(retitled.projection.id, view.projection.id);
  assert.notEqual(retitled.id, view.id);
});

test('exact retained presentation keeps combined pages and frozen correction/association state across later history', async t => {
  const { presentRetained, resolveRetainedContent } = await import('../src/lib/retained-presentation.js');
  const { captureCatalog, defaultCatalog } = await import('../src/lib/request-catalog.js');
  const { captureRequest } = await import('../src/lib/requests.js');
  const { continuationCommand } = await import('../src/lib/answer-presentation.js');
  const { parseCommand, commandWords } = await import('../src/lib/commands.js');
  const f = fixture(), { store, session, id, module } = f;
  const initial = f.publish([{ name: 'root', children: ['short'], evidence: [id('capture')] }, { name: 'short' }], [], { supplied: [id('capture')] });
  const operation = f.select(initial);
  for (let n = 0; n < 50; n++) f.publish([{ name: `long-${n}`, associations: [id('root')] }],
    [{ name: `long-correction-${n}`, reporter: `long-${n}`, target: 'root', replacement: `long-${n}` }]);
  for (let n = 0; n < 26; n++) f.publish([{ name: `short-${n}` }],
    [{ name: `short-correction-${n}`, reporter: `short-${n}`, target: 'short', replacement: `short-${n}` }]);
  const frozen = f.historical('root'), content = structuredClone(resolveRetainedContent(store, frozen));
  const refs = store.entityIds(frozen.associated, 'investigram');
  const after = refs.get(frozen.associated[23]!)!;
  f.publish([{ name: 'later', associations: [id('root')], inconsistencies: [{ targets: [id('root')], reason: 'Later disagreement.', evidence: [], qualifications: [] }] }],
    [{ name: 'later-correction', reporter: 'later', target: 'root', replacement: 'later' }]);
  const unknown = store.entityIds([id('later')], 'investigram').get(id('later'))!;
  const newer = f.historical('root');
  assert.notEqual(newer.id, frozen.id);
  const catalog = captureCatalog(defaultCatalog), usage = usageSummary([]);
  const work = { check() {}, record() {} };
  const run = (target: string, presentation: { format: 'json' | 'unicode'; sourceDetail: boolean; after?: string; revisionPage?: number }, referenceLifetime: 'session' | 'command' = 'session') => {
    const result = presentRetained(store, session, { kind: 'present', target, presentation, referenceLifetime }, catalog, usage, work);
    assert.equal(result.kind, 'view');
    assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
    return { ...result, view: result.view };
  };
  for (const method of ['put', 'investigations', 'evaluations', 'boundEntity'] as const) t.mock.method(store, method, () => { throw new Error(`Exact presentation called ${method}`); });
  assert.deepEqual(resolveRetainedContent({ get: store.get.bind(store), lookup: () => { throw new Error('No lookup'); } }, frozen), content);
  const retainedOperation = run(operation.id, { format: 'json', sourceDetail: true, revisionPage: 1 });
  assert.equal(retainedOperation.view.projection.id, operation.id);
  assert.deepEqual(retainedOperation.view.accounts.map(item => item.id), [id('root'), id('short')]);
  assert.ok(retainedOperation.view.revisions.every(item => !item.superseded));
  assert.equal(retainedOperation.view.result, null); assert.equal(retainedOperation.view.outcome?.kind, 'accepted');
  assert.equal(sourceDisclosure(retainedOperation.view)?.level, 'investigation-support');
  for (const format of ['json', 'unicode'] as const) {
    const options = { format, sourceDetail: true, after, revisionPage: 2 };
    const old = run(frozen.id, options);
    assert.equal(old.failed, false);
    assert.equal(old.view.investigations!.total, 50);
    assert.deepEqual(old.view.revisions.map(item => [item.page, item.rows.length, item.nextPage]), [[2, 24, 3], [2, 2, null]]);
    assert.equal(old.view.continuations.length, 2);
    for (const entry of old.view.continuations) {
      const expected = { ...options, ...(entry.action === 'association-next' ? { after: old.view.investigations!.next! } : { revisionPage: 3 }) };
      assert.deepEqual(entry.request.presentation, expected);
      assert.equal(entry.request.target, frozen.id);
      const structured = run(entry.request.target, entry.request.presentation);
      for (const defaultJson of format === 'json' ? [false, true] : [false]) {
        const command = continuationCommand(entry, old.view.answerReference!);
        if (format === 'json') assert.match(command, /--json/);
        const parsed = parseCommand(commandWords(command), '.', true, defaultJson);
        assert.equal(parsed.kind, 'view');
        const normalized = captureRequest(parsed.request).normalized;
        assert.equal(normalized.kind, 'present');
        const shell = run(normalized.target, normalized.presentation);
        assert.deepEqual(shell.view, structured.view);
      }
      assert.equal(structured.view.projection.id, frozen.id);
      if (entry.action === 'revision-next') {
        assert.deepEqual(structured.view.revisions.map(item => item.rows.length), [2, 0]);
        assert.equal(structured.view.investigations!.after, after);
        if (format === 'unicode') assert.match(structured.rendered, /No further rows on this page/);
      }
    }
    const invalid = run(frozen.id, { ...options, after: unknown });
    assert.equal(invalid.failed, true); assert.equal(invalid.view.investigations!.omitted, 50);
    const revision = invalid.view.continuations.find(item => item.action === 'revision-next')!;
    const restart = invalid.view.continuations.find(item => item.action === 'association-restart')!;
    assert.equal(revision.qualification, 'unknown-continuation');
    assert.equal(revision.request.presentation.after, unknown);
    assert.equal(run(revision.request.target, revision.request.presentation).failed, true);
    assert.deepEqual(restart.request.presentation, { format, sourceDetail: true, revisionPage: 2 });
    const restarted = run(restart.request.target, restart.request.presentation);
    assert.equal(restarted.failed, false); assert.equal(restarted.view.investigations!.items.length, 24);
    if (format === 'unicode') {
      assert.match(invalid.rendered, /association continuation remains unknown; this command retains failed status/);
      assert.equal((invalid.rendered.match(/Continue revision details for this answer/g) ?? []).length, 1);
    }
  }
  const oneShot = run(frozen.id, { format: 'unicode', sourceDetail: true, after, revisionPage: 2 }, 'command');
  assert.deepEqual(oneShot.view.continuations, []); assert.doesNotMatch(oneShot.rendered, /present @answer-/);
  assert.match(oneShot.rendered, /Open postcode shell, request the information there/);
  const defaulted = run(frozen.id, { format: 'json', sourceDetail: false });
  assert.equal(defaulted.view.investigations!.after, null);
  assert.equal(defaulted.view.revisions[0]!.page, 1); assert.equal(defaulted.view.sourceDetail, undefined);
  assert.equal(frozen.subjects[0], id('root')); assert.equal(initial.request.subject, module);
});


test('answer bindings are separate, append-only and local even for copied colliding aliases', () => {
  const f = fixture(), g = fixture();
  function answers(basis: ReturnType<typeof fixture>) {
    const original = inspect(basis.store, basis.evaluation, basis.module);
    const ids = ['a', 'b'].map(tail => `${basis.session}:projection:12345678${tail.repeat(56)}` as RecordId);
    basis.store.put(ids.map(id => ({ ...original, id })));
    return ids;
  }
  const [a, b] = answers(f), [local] = answers(g);
  const subjects = f.store.entityIds([f.module], 'module');
  assert.throws(() => f.store.answerIds([a!, f.module]), /retained answer/);
  assert.equal(f.store.answerIds([b!]).get(b!), 'answer-12345678');
  assert.equal(f.store.answerIds([a!]).get(a!), 'answer-12345678a');
  assert.equal(f.store.answerIds([b!]).get(b!), 'answer-12345678');
  assert.deepEqual(f.store.entityIds([f.module], 'module'), subjects);
  assert.equal(f.store.boundEntity(f.session, 'answer-12345678'), undefined);
  assert.equal(f.store.boundAnswer(f.session, subjects.get(f.module)!), undefined);
  assert.equal(g.store.boundAnswer(g.session, 'answer-12345678'), undefined);
  assert.equal(g.store.answerIds([local!]).get(local!), 'answer-12345678');
  assert.equal(g.store.boundAnswer(g.session, 'answer-12345678'), local);
  assert.equal(f.store.boundAnswer(f.session, 'answer-12345678'), b);
});


test('an empty composite remains empty after later associations and refuses their tokens', async () => {
  const { presentRetained } = await import('../src/lib/retained-presentation.js');
  const { captureCatalog, defaultCatalog } = await import('../src/lib/request-catalog.js');
  const f = fixture();
  const mechanical = inspect(f.store, f.evaluation, f.module);
  const frozen = selectAssociatedInspection(f.store, mechanical.id, [f.module]);
  const catalog = captureCatalog({ ...defaultCatalog, presentations: defaultCatalog.presentations!.map(item =>
    item.contract === 'modules' ? { ...item, requirements: { modules: [], groups: [] } } : item) });
  const request = { kind: 'present' as const, target: frozen.id, presentation: { format: 'json' as const, sourceDetail: false }, referenceLifetime: 'session' as const };
  const run = (after?: string) => presentRetained(f.store, f.session,
    { ...request, presentation: { ...request.presentation, ...(after ? { after } : {}) } }, catalog, usageSummary([]), { check() {}, record() {} });
  const before = run(); assert.equal(before.kind, 'view');
  f.publish([{ name: 'later-association', associations: [f.module] }]);
  const later = f.store.entityIds([f.id('later-association')], 'investigram').get(f.id('later-association'))!;
  const after = run(); assert.equal(after.kind, 'view');
  assert.deepEqual(after.view, before.view);
  assert.ok('investigations' in after.view); assert.equal(after.view.investigations!.total, 0);
  const invalid = run(later); assert.equal(invalid.kind, 'view'); assert.equal(invalid.failed, true);
  assert.equal(invalid.view.projection.id, frozen.id);
  assert.ok('investigations' in invalid.view); assert.equal(invalid.view.investigations!.status, 'unknown-continuation');
});


test('retained off-page support can claim a new subject prefix without changing old bindings', async () => {
  const { presentRetained } = await import('../src/lib/retained-presentation.js');
  const { captureCatalog, defaultCatalog } = await import('../src/lib/request-catalog.js');
  const session = sessionId();
  const offPage = `${session}:test:12345678${'a'.repeat(56)}` as RecordId;
  const later = `${session}:test:12345678${'b'.repeat(56)}` as RecordId;
  const f = fixture(session, { 'off-page': offPage, later });
  const children = [...Array.from({ length: 270 }, (_, n) => `child-${n}`), 'off-page'];
  f.publish([{ name: 'root', children }, ...children.map(name => ({ name }))]);
  const frozen = f.historical('root');
  f.publish([{ name: 'later' }]);
  const old = f.store.entityIds([f.module], 'module').get(f.module)!;
  assert.equal(f.store.boundEntity(session, 'investigram-12345678'), undefined);
  const result = presentRetained(f.store, session,
    { kind: 'present', target: frozen.id, presentation: { format: 'json', sourceDetail: false }, referenceLifetime: 'session' },
    captureCatalog(defaultCatalog), usageSummary([]), { check() {}, record() {} });
  assert.equal(result.kind, 'view'); assert.equal(result.view.schema, 'postcode-investigation-view/1-experimental');
  assert.ok(result.view.omittedAccounts.includes(offPage));
  assert.equal(f.store.boundEntity(session, 'investigram-12345678'), offPage);
  assert.equal(f.store.entityIds([later], 'investigram').get(later), 'investigram-12345678b');
  assert.equal(f.store.entityIds([offPage], 'investigram').get(offPage), 'investigram-12345678');
  assert.equal(f.store.entityIds([f.module], 'module').get(f.module), old);
});

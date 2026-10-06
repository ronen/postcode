import assert from 'node:assert/strict';
import { test } from 'node:test';
import { digest, identityReference, recordId, sessionId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { inspect } from '../src/lib/projections.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { inspectOrganization } from '../src/lib/organization/projections.js';
import { referenceBinding } from '../src/lib/reference-binding.js';
import type { EvaluationRecord, ProgramRecord, ProgramRecordStore, RecordId, SessionId } from '../src/lib/records.js';
import type { Correction, Investigram, InvestigationProvenance, Inconsistency } from '../src/lib/investigation/contracts.js';
import type { InvestigationEvaluationRecord, InvestigationSelection } from '../src/lib/investigation/evaluation.js';
import type { InvestigationSelectionProjection } from '../src/lib/investigation/selection-record.js';
import { selectionIdentity } from '../src/lib/investigation/selection-record.js';
import { selectAssociatedInspection, selectInvestigation } from '../src/lib/investigation/selection.js';
import { resolveInvestigationContent } from '../src/lib/investigation/content.js';
import { revisionPage } from '../src/lib/investigation/revision-page.js';

interface AccountSpec {
  name: string;
  children?: readonly string[];
  associations?: readonly RecordId[];
  inconsistencies?: readonly Inconsistency[];
  evidence?: readonly RecordId[];
}
interface CorrectionSpec { name: string; reporter: string; target: string; replacement: string }

function fixture(session: SessionId = sessionId()) {
  const store = new MemoryProgramRecordStore(), base = { session, method: 'selection-test@1' };
  const id = (name: string) => recordId(session, 'test', name);
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
  const select = (result: InvestigationSelection) => selectInvestigation(store, session, { lens: 'summarize', selector: 'entry-0' }, [module], result);
  const historical = (name: string) => selectInvestigation(store, session, { lens: 'inspect', selector: name, reference: true }, [id(name)], null);
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
  for (const selected of [[], [module, id('module2')]]) {
    const projection = selectInvestigation(store, session, { lens: 'summarize', selector: 'entry' }, selected, null);
    assert.equal(projection.status, selected.length ? 'ambiguous' : 'missing');
    assert.deepEqual(projection.variant === 'request' && projection.outcome, { kind: 'no-evaluation' });
  }
  for (const lens of ['summarize', 'children', 'parents'] as const) {
    const projection = selectInvestigation(store, session, { lens, selector: 'A', reference: true, unsupportedSubject: 'investigram' }, [id('A')], null);
    assert.equal(projection.status, 'unsupported-subject-lens'); assert.deepEqual(projection.roots, []);
  }
  const unsupported = selectInvestigation(store, session, { lens: 'explain', selector: 'entry', unsupportedSubject: 'program-subject' }, [module], null);
  assert.equal(unsupported.status, 'unsupported-subject-lens');
  const missing = selectInvestigation(store, session, { lens: 'inspect', selector: 'investigram-later', reference: true }, [], null);
  assert.equal(missing.variant, 'historical-inspection'); assert.deepEqual(missing.associated, []);
  const bound = selectInvestigation(store, session, { lens: 'inspect', selector: 'investigram-later', reference: true }, [id('A')], null);
  assert.notEqual(bound.id, missing.id); assert.equal(store.get(missing.id), missing);
  assert.deepEqual(missing.selector, { unresolvedReference: 'investigram-later' });
  assert.deepEqual(bound.selector, { reference: id('A') });
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
  const literal = a.f.id('module');
  const literalSelection = selectInvestigation(a.f.store, a.f.session, { lens: 'summarize', selector: literal }, [a.f.module], null);
  const referenceSelection = selectInvestigation(a.f.store, a.f.session, { lens: 'summarize', selector: literal, reference: true }, [a.f.module], null);
  assert.notEqual(literalSelection.id, referenceSelection.id);
  const { id: _id, ...payload } = literalSelection;
  assert.deepEqual((selectionIdentity(payload) as typeof payload).selector, { literal }, 'reference-shaped literal remains verbatim');
  assert.deepEqual(selectionIdentity(literalSelection), selectionIdentity(payload), 'own identity is never part of its key');
  const spelling = selectInvestigation(a.f.store, a.f.session, { lens: 'summarize', selector: 'different-compact-spelling', reference: true }, [a.f.module], null);
  assert.equal(referenceSelection, spelling, 'resolved selectors retain the precise subject, not a spelling');
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
  const missingMechanical = inspect(store, f.evaluation, 'unknown');
  const empty = selectAssociatedInspection(store, missingMechanical.id, []);
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
    { ...projection, status: 'missing' },
  ];
  for (const [index, value] of variants.entries()) {
    const invalid = { ...value, id: f.id(`invalid-${index}`) };
    assert.throws(() => f.store.put([marker, invalid]));
    assert.equal(f.store.lookup(marker.id), undefined); assert.equal(f.store.lookup(invalid.id), undefined);
  }
  assert.throws(() => f.store.put([{ ...projection, status: 'missing' }]), /collision/);
  assert.equal(f.store.get(projection.id), projection);
});

test('binding port cannot allocate outside its typed population, and eager resolution does not reserve colliding spellings', () => {
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
  const selection = selectInvestigation(f.store, f.session, { lens: 'summarize', selector: 'collision' }, [a, b], null);
  const content = resolveInvestigationContent(f.store, selection);
  const port = referenceBinding(f.store, f.session, content.references);
  assert.deepEqual(Object.keys(port), ['bind']);
  assert.throws(() => port.bind([a, f.module], 'module'), /population/);
  assert.throws(() => port.bind([a], 'investigram'), /kind/);
  assert.equal(port.bind([b], 'module').get(b), `module-${prefix}`, 'neither eager content nor invalid batches allocated a');
  assert.equal(port.bind([a], 'module').get(a), `module-${prefix}a`);
  assert.equal(port.bind([b], 'module').get(b), `module-${prefix}`);
  assert.throws(() => referenceBinding(f.store, sessionId(), content.references), /population/);
});

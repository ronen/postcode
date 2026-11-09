import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { openApplication } from '../src/lib/application/index.js';
import type { ApplicationResult, ApplicationSession, AnswerDelivery, LensDefinition } from '../src/lib/application/index.js';
import { applicationCatalog } from '../src/lib/application/catalog.js';
import { exportsLens } from '../src/lib/mechanical-implementations.js';
import { operationMethod } from '../src/lib/investigation/operations.js';
import type { OperationDefinition } from '../src/lib/investigation/operations.js';
import type { SubmittedInvestigram, InvestigatorAgent } from '../src/lib/investigation/contracts.js';
import type { RecordId } from '../src/lib/records.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { temporaryDirectory } from './cli-helpers.js';
import { ScriptedInvestigator, syntheticUsage } from './investigator-double.js';

function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-application-journey-');
  mkdirSync(path.join(root, 'entry'));
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['entry/entry.ts', 'support.ts'] }));
  writeFileSync(path.join(root, 'entry/entry.ts'), "import { support } from '../support.js';\n/** Return the captured helper value. */ export function entry() { return support; }");
  writeFileSync(path.join(root, 'support.ts'), '/** The helper value. */ export const support = 7;');
  execFileSync('git', ['init', '--quiet', root]);
  return { configPath: path.join(root, 'tsconfig.json') };
}
function answer(result: ApplicationResult) {
  assert.equal(result.kind, 'answer');
  assert.deepEqual(structuredClone(result), result);
  assert.ok(Object.isFrozen(result.answer));
  assert.equal(result.consumption, null, 'direct operations need no Presentation');
  return result;
}
function interpretation(result: ApplicationResult) {
  const delivery = answer(result);
  assert.equal(delivery.answer.content.contract, 'investigation');
  return { delivery, content: delivery.answer.content.value };
}
const reference = (value: string) => ({ kind: 'reference' as const, value });
const named = (value: string) => ({ kind: 'name' as const, value });
const project = { kind: 'configured-project' } as const;

/** Deny all writes and population/history discovery while traversing fixed support.
 * These are tripwires, not substitute analysis/selection implementations. */
async function exactAnswers(t: TestContext, session: ApplicationSession, retained: readonly AnswerDelivery[], agent?: InvestigatorAgent) {
  const usage = structuredClone(session.usage());
  const denied = ['put', 'evaluations', 'investigations', 'boundEntity'] as const;
  const mocks = denied.map(method => t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw Error(`Exact access called ${method}`); }));
  const inference = agent ? t.mock.method(agent, 'open', () => { throw Error('Exact access opened an investigator'); }) : undefined;
  try {
    for (const original of retained) {
      const exact = answer(await session.execute({ kind: 'present', target: original.answer.id }));
      assert.equal(exact.selectionMode, 'retained');
      assert.deepEqual(exact.answer, original.answer, 'complete content, fixed support and identity remain equal');
      assert.equal(exact.attribution.status, 'completed');
      assert.ok(exact.attribution.work.every(item => item.boundary === 'content' && item.disposition === 'consumed'));
      assert.deepEqual(exact.attribution.evidence, []);
      assert.deepEqual(exact.usage, usage);
    }
  } finally {
    for (const mock of mocks) mock.mock.restore();
    inference?.mock.restore();
  }
}

test('direct organization, dependencies and group/mixed inspection expose fixed qualified content', async t => {
  const opened = await openApplication(fixture(t)); assert.equal(opened.status, 'opened');
  const session = opened.session; t.after(() => session.close());
  const inventory = answer(await session.execute({ kind: 'lens', lens: 'modules', designation: project }));
  assert.equal(inventory.answer.content.contract, 'modules');
  const modules = inventory.answer.content.value.modules;
  const entry = modules.find(item => item.claim.record.information.handle === 'entry')!.id;
  const support = modules.find(item => item.claim.record.information.handle === 'support')!.id;
  const subset = answer(await session.execute({ kind: 'lens', lens: 'dependency-structure', designation: project,
    requirements: { modules: [], groups: [] } }));
  assert.equal(subset.answer.content.contract, 'dependencies');
  assert.deepEqual(subset.answer.content.value.moduleEvaluations, []);
  assert.equal(subset.answer.content.value.expanded, null);
  assert.ok(subset.attribution.work.every(item => !['organization-evaluation', 'dependency-organization-evaluation'].includes(item.boundary)));
  const retained = [inventory, subset];
  for (const designation of [project, { kind: 'repository' } as const]) {
    const result = answer(await session.execute({ kind: 'lens', lens: 'organization', designation }));
    assert.equal(result.answer.content.contract, 'organization');
    assert.equal(result.answer.content.value.projection.subject, designation.kind);
    assert.ok(result.answer.content.value.projection.expansions.requested.includes('group-details'));
    assert.ok(result.answer.content.value.contexts.length);
    retained.push(result);
  }
  const mixed = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: named('entry') }));
  assert.equal(mixed.answer.mechanical?.contract, 'organization');
  assert.deepEqual(mixed.resolution!.candidates.map(item => item.kind).sort(), ['group', 'module']);
  assert.deepEqual(mixed.answer.mechanical.value.moduleDetail!.projection.modules, [entry]);
  const group = mixed.answer.mechanical.value.projection.groups[0]!;
  const groupOnly = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: reference(group) }));
  assert.equal(groupOnly.answer.mechanical?.contract, 'organization');
  assert.deepEqual(groupOnly.answer.mechanical.value.projection.groups, [group]);
  assert.deepEqual(groupOnly.answer.mechanical.value.moduleDetail!.projection.modules, []);
  assert.notEqual(groupOnly.answer.id, groupOnly.answer.mechanical.value.projection.id);
  retained.push(mixed, groupOnly);
  const bare = answer(await session.execute({ kind: 'present', target: mixed.answer.mechanical.value.projection.id }));
  assert.equal(bare.answer.content.contract, 'organization'); assert.equal(bare.answer.mechanical, null);
  assert.deepEqual(bare.answer.content, mixed.answer.mechanical);
  retained.push(bare);
  for (const [lens, designation, role] of [
    ['dependency-structure', project, null], ['dependency-children', reference(entry), 'parent'], ['dependency-parents', reference(support), 'child'],
  ] as const) {
    const result = answer(await session.execute({ kind: 'lens', lens, designation }));
    assert.equal(result.answer.content.contract, 'dependencies');
    const content = result.answer.content.value;
    assert.equal(content.projection.subjectRole, role);
    assert.deepEqual(content.relationships.map(item => [item.record.subject, item.record.information.child]), [[entry, support]]);
    assert.ok(content.expanded); assert.ok(content.organization.length);
    assert.ok(Object.values(content.occurrences).every(item => item.source.kind === 'source-evidence'));
    assert.ok(content.contexts.length); retained.push(result);
  }
  const missing = await session.execute({ kind: 'lens', lens: 'inspect', designation: named('absent') });
  assert.equal(missing.kind, 'resolution'); assert.equal(missing.resolution.reason, 'missing');
  assert.equal(missing.attribution.status, 'refused');
  const wrong = await session.execute({ kind: 'lens', lens: 'dependency-children', designation: reference(group) });
  assert.equal(wrong.kind, 'resolution'); assert.equal(wrong.resolution.reason, 'unsupported-subject');
  const needsDetail = await session.execute({ kind: 'present', target: subset.answer.id, requirements: { modules: [], groups: ['group-details'] } });
  assert.equal(needsDetail.kind, 'resolution'); assert.equal(needsDetail.resolution.reason, 'presentation-unavailable');
  assert.deepEqual(needsDetail.resolution.retainedAnswers, [{ id: subset.answer.id, reference: subset.answerReference }]);
  await exactAnswers(t, session, retained);
  const usage = await session.execute({ kind: 'report', report: 'usage' });
  assert.equal(usage.kind, 'usage'); assert.equal(usage.usage.calls, 0); assert.equal(usage.attribution.status, 'completed');
});

function draft(subject: RecordId, localId = 'root', evidence: readonly RecordId[] = []): SubmittedInvestigram {
  return { localId, prose: `Qualified account ${localId}.`, referent: { description: 'The selected module.', subjects: [subject] },
    qualifications: ['Controlled interpretation of captured evidence.'], evidence, associations: [], children: [], corrections: [], inconsistencies: [] };
}

test('direct investigation journey retains full earlier answers through corrections, conflicts and reconsideration', async t => {
  let next = new ScriptedInvestigator([
    (input, _signal, usage) => { usage(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: input.request.subject }] }; },
    (input, _signal, usage) => {
      usage(syntheticUsage);
      const response = input.responses[0]!; assert.ok('selected' in response); assert.ok(response.selected.length);
      return { kind: 'submit', result: { ...draft(input.request.subject, 'A', response.selected), children: [draft(input.request.subject, 'A-child')] } };
    },
  ]);
  const exchanges: ScriptedInvestigator[] = [next];
  let calls = 0;
  const agent: InvestigatorAgent = { identity: next.identity, open() { calls++; return next.open(); } };
  const opened = await openApplication(fixture(t), { investigation: { agent } }); assert.equal(opened.status, 'opened');
  const session = opened.session; t.after(() => session.close());
  const inventory = answer(await session.execute({ kind: 'lens', lens: 'modules', designation: project }));
  assert.equal(inventory.answer.content.contract, 'modules');
  const module = inventory.answer.content.value.modules.find(item => item.claim.record.information.handle === 'entry')!.id;
  const initial = interpretation(await session.execute({ kind: 'lens', lens: 'summarize', designation: named('entry') }));
  assert.deepEqual(initial.content.projection.subjects, [module]);
  assert.equal(initial.content.evaluation!.outcome.kind, 'accepted');
  assert.equal(initial.delivery.attribution.status, 'completed');
  assert.ok(initial.delivery.attribution.evidence.some(item => item.delivery === 'delivered'));
  assert.ok(initial.content.support.some(item => item.sources.length && item.inputs));
  assert.ok(initial.content.provenance[0]!.suppliedEvidence.length);
  const a = initial.content.projection.relations[0]!.account;
  const child = initial.content.accounts.find(item => item.id === a)!.children[0]!;
  const historical = interpretation(await session.execute({ kind: 'lens', lens: 'inspect', designation: reference(a) }));
  assert.equal(historical.content.projection.variant, 'historical-inspection');
  assert.deepEqual(historical.content.accounts, initial.content.accounts);
  assert.equal(calls, 1);
  const associatedBefore = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: reference(module) }));
  const saved = [initial.delivery, historical.delivery, associatedBefore];
  const frozen = saved.map(item => structuredClone(item.answer));
  const follow = async (lens: 'explain' | 'decompose' | 'examine', subject: RecordId, result: SubmittedInvestigram, retrieve: RecordId[] = []) => {
    next = new ScriptedInvestigator([
      ...(retrieve.length ? [() => ({ kind: 'tools' as const, requests: retrieve.map(subject => ({ kind: 'investigram' as const, subject })) })] : []),
      () => ({ kind: 'submit', result }),
    ]);
    exchanges.push(next);
    const selected = interpretation(await session.execute({ kind: 'lens', lens, designation: reference(subject) }));
    assert.equal(selected.content.evaluation!.outcome.kind, 'accepted');
    assert.equal(selected.content.evaluation!.request.subject, subject);
    assert.equal(selected.delivery.attribution.status, 'completed');
    assert.ok(next.inputs[0]![0]!.responses.some(item => 'accounts' in item && item.accounts.some(account => account.id === subject)));
    return selected;
  };
  const correction = (target: RecordId, localId: string) => ({ target, correctedSubjects: [module], reason: `Revision ${localId}.`,
    qualifications: ['Interpretive correction.'], evidence: [target], replacement: draft(module, localId) });
  const y = await follow('explain', a, draft(module, 'Y'));
  const yId = y.content.projection.relations[0]!.account;
  const z = await follow('decompose', yId, draft(module, 'Z'));
  const zId = z.content.projection.relations[0]!.account;
  const correcting = await follow('examine', a, { ...draft(module, 'correcting'), corrections: [correction(a, 'B')],
    associations: [{ subject: module, qualifications: ['Explicit module association.'], evidence: [] },
      { subject: a, qualifications: ['Explicit original-account association.'], evidence: [a] }] }, [yId]);
  const b = correcting.content.corrections.find(item => item.target === a)!.replacement;
  const correctionId = correcting.content.corrections.find(item => item.target === a)!.id;
  assert.ok(correcting.content.projection.revisions.every(item => !item.needsReconsideration), 'the correcting evaluation is exempt from its own cause');
  const yAgain = interpretation(await session.execute({ kind: 'lens', lens: 'explain', designation: reference(a) }));
  assert.equal(yAgain.delivery.reporting!.reused, true);
  assert.equal(yAgain.content.projection.revisions.find(item => item.original === yId)!.needsReconsideration, true);
  const zAgain = interpretation(await session.execute({ kind: 'lens', lens: 'inspect', designation: reference(zId) }));
  const transitive = zAgain.content.projection.revisions.find(item => item.original === zId)!;
  assert.equal(transitive.needsReconsideration, true); assert.equal(transitive.rows[0]!.cause!.direct, false);
  assert.ok(transitive.rows[0]!.cause!.via.includes(yId));
  const aware = await follow('examine', yId, draft(module, 'aware'));
  assert.ok(aware.content.provenance[0]!.completeCorrections.includes(correctionId));
  assert.ok(aware.content.projection.relations.every(relation => !aware.content.projection.revisions.find(item => item.original === relation.account)!.needsReconsideration));
  assert.equal(aware.content.projection.revisions.find(item => item.original === yId)!.needsReconsideration, true, 'aware follow-up does not erase the earlier subject status');
  const competing = await follow('decompose', a, { ...draft(module, 'competing'), corrections: [correction(a, 'C')] });
  const c = competing.content.corrections.find(item => item.target === a && item.reporter === competing.content.projection.relations[0]!.account)!.replacement;
  const descendant = await follow('explain', b, { ...draft(module, 'descendant'), corrections: [correction(b, 'D')] });
  const d = descendant.content.corrections.find(item => item.target === b)!.replacement;
  const fresh = interpretation(await session.execute({ kind: 'lens', lens: 'summarize', designation: reference(module) }));
  assert.equal(fresh.delivery.reporting!.reused, true);
  assert.equal(fresh.content.projection.relations[0]!.account, d);
  assert.ok(fresh.content.projection.displaced.includes(a)); assert.ok(fresh.content.projection.displaced.includes(child));
  const revision = fresh.content.projection.revisions.find(item => item.original === a)!;
  assert.equal(revision.conflicting, true); assert.equal(revision.primary, d);
  assert.ok(revision.rows.some(item => item.replacement === c));
  const originalNow = interpretation(await session.execute({ kind: 'lens', lens: 'inspect', designation: reference(a) }));
  assert.deepEqual(originalNow.content.projection.relations.map(item => item.account), [a, child]);
  assert.ok(originalNow.content.projection.associated.includes(correcting.content.projection.relations[0]!.account));
  assert.notEqual(originalNow.delivery.answer.id, historical.delivery.answer.id);
  const associatedNow = interpretation(await session.execute({ kind: 'lens', lens: 'inspect', designation: reference(module) }));
  assert.ok(associatedNow.content.projection.associated.includes(correcting.content.projection.relations[0]!.account));
  assert.notEqual(associatedNow.delivery.answer.id, associatedBefore.answer.id);
  assert.deepEqual(saved.map(item => item.answer), frozen, 'later selection does not mutate already delivered values');
  assert.equal(calls, 7);
  await exactAnswers(t, session, [...saved, y.delivery, z.delivery, fresh.delivery, originalNow.delivery, associatedNow.delivery], agent);
  assert.equal(calls, 7); assert.ok(exchanges.every(item => item.closes === 1));
  const usage = await session.execute({ kind: 'report', report: 'usage' });
  assert.equal(usage.kind, 'usage'); assert.equal(usage.usage.attempts.length, 7);
  assert.equal(usage.usage.calls, exchanges.reduce((sum, item) => sum + item.inputs[0]!.length, 0));
});

test('direct nonpublic interpretation and exports use captured catalogs and common exact access', async t => {
  const risks: OperationDefinition = { id: 'risks', objective: 'Identify apparent module risks and limitations.',
    subject: 'module', initialContext: 'subject-reference', method: 'test/module-risks@1' };
  const riskLens: LensDefinition = { id: 'risks', title: 'Module risks', question: 'What risks are apparent in this module?',
    subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'risks' }, results: ['investigation'] };
  const catalog = { lenses: { ...applicationCatalog.lenses, risks: riskLens, 'risk-review': { ...riskLens, id: 'risk-review', title: 'Risk review' }, exports: exportsLens },
    operations: { ...applicationCatalog.operations, risks } };
  const agent = new ScriptedInvestigator([input => ({ kind: 'submit', result: draft(input.request.subject) })]);
  const opened = await openApplication(fixture(t), { investigation: { agent } }, catalog);
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const fresh = interpretation(await session.execute({ kind: 'lens', lens: 'risks', designation: named('entry') }));
  assert.equal(fresh.delivery.title, 'Module risks');
  assert.equal(fresh.content.evaluation!.request.operation, 'risks');
  assert.equal(fresh.content.provenance[0]!.method, operationMethod(risks));
  assert.ok(agent.inputs[0]![0]!.instructions.startsWith(risks.objective));
  assert.deepEqual(agent.inputs[0]![0]!.responses, []);
  const module = fresh.content.projection.subjects[0]!;
  const other = interpretation(await session.execute({ kind: 'lens', lens: 'risk-review', designation: reference(module) }));
  assert.equal(other.delivery.title, 'Risk review'); assert.equal(other.delivery.reporting!.reused, true);
  assert.deepEqual(other.content.accounts, fresh.content.accounts); assert.deepEqual(other.content.provenance, fresh.content.provenance);
  assert.notEqual(other.delivery.answer.id, fresh.delivery.answer.id);
  assert.ok(other.delivery.attribution.parents.some(item => item.id === fresh.delivery.context.id));
  const exported = answer(await session.execute({ kind: 'lens', lens: 'exports', designation: reference(module) }));
  assert.equal(exported.answer.content.contract, 'module-exports');
  assert.equal(exported.answer.content.value.complete, true);
  assert.equal(exported.answer.content.value.exports.length, 1);
  assert.ok(exported.answer.content.value.exports[0]!.documentation.length);
  await exactAnswers(t, session, [fresh.delivery, other.delivery, exported], agent);
  assert.equal(agent.inputs.length, 1);
});

for (const mode of ['unavailable', 'failed'] as const) test(`direct exact ${mode} investigation preserves its historical outcome while retrieval succeeds`, async t => {
  const agent = new ScriptedInvestigator([() => ({ kind: 'ended' })]);
  const options = fixture(t);
  const opened = await openApplication(options, mode === 'failed' ? { investigation: { agent } } : {});
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const first = interpretation(await session.execute({ kind: 'lens', lens: 'summarize', designation: named('entry') }));
  assert.equal(first.delivery.failed, true); assert.equal(first.delivery.attribution.status, 'failed');
  assert.equal(first.content.projection.variant, 'request');
  assert.equal(first.content.projection.outcome.kind, mode === 'failed' ? 'evaluation' : 'unavailable');
  if (mode === 'failed') assert.equal(first.content.evaluation!.outcome.kind, 'investigation-failure');
  const module = first.content.projection.subjects[0]!;
  const other = await openApplication(options); assert.equal(other.status, 'opened'); t.after(() => other.session.close());
  const foreign = answer(await other.session.execute({ kind: 'lens', lens: 'modules', designation: project }));
  const targets = [
    [module, 'unsupported-answer'], [foreign.answer.id, 'foreign-answer'],
    [`${session.id}:projection:${'f'.repeat(64)}`, 'unknown-answer'], ['answer-00000000', 'unknown-answer'],
  ] as const;
  for (const [target, reason] of targets) {
    const refused = await session.execute({ kind: 'present', target });
    assert.equal(refused.kind, 'resolution'); assert.equal(refused.resolution.reason, reason);
    assert.equal(refused.attribution.status, 'refused');
    assert.deepEqual(refused.context.request, { kind: 'present', target });
  }
  await exactAnswers(t, session, [first.delivery], agent);
  const exact = answer(await session.execute({ kind: 'present', target: first.delivery.answer.id }));
  assert.equal(exact.failed, false); assert.deepEqual(exact.answer, first.delivery.answer);
  assert.equal(first.delivery.attribution.status, 'failed');
  assert.equal(agent.inputs.length, mode === 'failed' ? 1 : 0);
});

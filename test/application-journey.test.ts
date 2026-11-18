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
import { contributionOperationMethod as operationMethod } from '../src/lib/contributions/operations.js';
import type { ContributionOperation as OperationDefinition } from '../src/lib/contributions/operations.js';
import type { DialogAgent as InvestigatorAgent } from '../src/lib/contributions/dialog.js';
import type { AssociationAddress, EntityId } from '../src/lib/contributions/model.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { temporaryDirectory } from './cli-helpers.js';
import { syntheticUsage } from './investigator-double.js';
import { ScriptedContributionAgent, proseContribution, moduleRecord, entitySubject } from './contribution-agent.js';
import type { ExactSubject } from '../src/lib/contributions/subjects.js';

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
  assert.equal(delivery.answer.content.contract, 'contribution');
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
  assert.deepEqual(mixed.resolution!.candidates.map(item => item.kind).sort(), ['entity', 'group', 'module']);
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

test('direct investigation journey preserves exact selections, competing designations and transitive reconsideration', async t => {
  let entity!: EntityId;
  let next = new ScriptedContributionAgent([
    (input, _signal, usage) => { usage(syntheticUsage); entity = entitySubject(input); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] }; },
    (input, _signal, usage) => { usage(syntheticUsage); const response = input.responses[0]!; assert.equal(response.tool, 'evidence');
      return { kind: 'submit', contribution: proseContribution(input, 'A', { evidence: response.response.selected, associate: entity }) }; },
  ]);
  const exchanges = [next]; let calls = 0;
  const agent: InvestigatorAgent = { identity: next.identity, open() { calls++; return next.open(); } };
  const opened = await openApplication(fixture(t), { investigation: { agent } }); assert.equal(opened.status, 'opened');
  const session = opened.session; t.after(() => session.close());
  const initial = interpretation(await session.execute({ kind: 'lens', lens: 'summarize', designation: named('entry') }));
  const a = initial.content.projection.alternatives[0]!.designation, result = initial.content.projection.question.result;
  const exactUse = (association: AssociationAddress): ExactSubject => ({ kind: 'designation', association });
  const exactItem = (association: AssociationAddress): ExactSubject => ({ kind: 'content', item: { investigram: association.investigram, item: 'prose' }, component: null });
  const select = (subject: ExactSubject) => ({ kind: 'selection' as const, subject });
  assert.ok(initial.content.projection.support.evidence.some(item => item.kind === 'source-evidence'));
  assert.equal(initial.content.projection.support.owners[0]!.origin!.request.operation, 'functionality');
  const historical = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: select(exactUse(a)) }));
  const associatedBefore = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: reference(initial.content.projection.subject) }));
  const saved = [initial.delivery, historical, associatedBefore], frozen = saved.map(item => structuredClone(item.answer));
  const follow = async (lens: 'explain' | 'decompose' | 'examine', subject: ExactSubject, text: string, displaces?: AssociationAddress) => {
    next = new ScriptedContributionAgent([input => {
      const contribution = proseContribution(input, text);
      return { kind: 'submit', contribution: displaces ? { investigrams: [{ ...contribution.investigrams[0]!, declarations: [
        ...contribution.investigrams[0]!.declarations!, { key: 'revise', operation: 'supersede', target: { kind: 'result', result },
          displaces: [displaces], grounds: { text: `Qualified revision ${text}` },
          members: [{ kind: 'item', item: { investigram: { local: 'answer' }, item: 'prose' } }] }] }] } : contribution };
    }]); exchanges.push(next);
    const value = interpretation(await session.execute({ kind: 'lens', lens, designation: select(subject) }));
    assert.equal(value.delivery.reporting!.contribution!.outcome.kind, 'accepted');
    assert.deepEqual(value.content.projection.question.request.subjects[0]!.subject, subject);
    assert.ok(next.inputs[0]![0]!.responses.length);
    return value;
  };
  const y = await follow('explain', exactUse(a), 'Y'), yUse = y.content.projection.alternatives[0]!.designation;
  const z = await follow('decompose', exactItem(yUse), 'Z'), zUse = z.content.projection.alternatives[0]!.designation;
  const changing = await follow('examine', exactUse(a), 'B', a), b = { investigram: changing.content.projection.alternatives[0]!.designation.investigram, declaration: 'revise' };
  assert.ok(changing.content.projection.alternatives.every(alternative => !alternative.producing.length), 'own declarations do not create a cause for their producer');
  const yAgain = interpretation(await session.execute({ kind: 'lens', lens: 'explain', designation: select(exactUse(a)) }));
  assert.equal(yAgain.delivery.reporting!.reused, true);
  assert.ok(yAgain.content.projection.alternatives[0]!.producing.some(cause => cause.routes.some(route => route.kind === 'exact')));
  const zAgain = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: select(exactItem(zUse)) }));
  assert.equal(zAgain.answer.content.contract, 'contribution-inspection');
  assert.ok(zAgain.answer.content.value.projection.support.owners.some(owner => owner.producing.some(cause => cause.routes.some(route => route.kind === 'inherited' && route.from === yUse.investigram))));
  const aware = await follow('examine', exactItem(yUse), 'Aware');
  assert.deepEqual(aware.content.projection.alternatives[0]!.producing, [], 'known concerns do not become new causes');
  const competing = await follow('decompose', exactUse(a), 'C', a), c = { investigram: competing.content.projection.alternatives[0]!.designation.investigram, declaration: 'revise' };
  const descendant = await follow('explain', exactUse(b), 'D', b), d = { investigram: descendant.content.projection.alternatives[0]!.designation.investigram, declaration: 'revise' };
  const current = interpretation(await session.execute({ kind: 'lens', lens: 'summarize', designation: reference(initial.content.projection.subject) }));
  assert.equal(current.delivery.reporting!.reused, true);
  assert.deepEqual(current.content.projection.alternatives.map(alternative => alternative.designation), [c, d], 'all standing alternatives remain; no primary replacement is invented');
  assert.ok(current.content.projection.history.some(item => item.designation.investigram === a.investigram));
  const originalNow = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: select(exactUse(a)) }));
  assert.equal(originalNow.answer.content.contract, 'contribution-inspection');
  assert.equal(originalNow.answer.content.value.projection.support.uses[0]!.status.standing.state, 'displaced');
  assert.equal((originalNow.answer.content.value.projection.support.items[0]!.item.body as { text: string }).text, 'A');
  assert.deepEqual(saved.map(value => value.answer), frozen);
  await exactAnswers(t, session, [...saved, y.delivery, z.delivery, current.delivery, originalNow, zAgain], agent);
  assert.equal(calls, 7); assert.ok(exchanges.every(value => value.closes === 1));
  assert.equal(session.usage().attempts.length, 7);
});

test('direct nonpublic interpretation and exports use captured catalogs and common exact access', async t => {
  const risks: OperationDefinition = { id: 'risks', objective: 'Identify apparent module risks and limitations.',
    subject: 'module', method: 'test/module-risks@1' };
  const riskLens: LensDefinition = { id: 'risks', title: 'Module risks', question: 'What risks are apparent in this module?',
    subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'contribution', operation: 'risks', resultContract: null }, results: ['contribution'] };
  const catalog = { lenses: { ...applicationCatalog.lenses, risks: riskLens, 'risk-review': { ...riskLens, id: 'risk-review', title: 'Risk review' }, exports: exportsLens },
    operations: { ...applicationCatalog.operations, risks } };
  const agent = new ScriptedContributionAgent([input => ({ kind: 'submit', contribution: proseContribution(input) })]);
  const opened = await openApplication(fixture(t), { investigation: { agent } }, catalog);
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const fresh = interpretation(await session.execute({ kind: 'lens', lens: 'risks', designation: named('entry') }));
  assert.equal(fresh.delivery.title, 'Module risks');
  assert.equal(fresh.content.projection.question.request.operation, 'risks');
  assert.equal(fresh.content.projection.alternatives[0]!.producer.method, operationMethod(risks, catalog.operations));
  assert.ok(agent.inputs[0]![0]!.instructions.startsWith(risks.objective));
  assert.ok(agent.inputs[0]![0]!.responses.length > 0);
  const module = fresh.content.projection.subject;
  const other = interpretation(await session.execute({ kind: 'lens', lens: 'risk-review', designation: reference(module) }));
  assert.equal(other.delivery.title, 'Risk review'); assert.equal(other.delivery.reporting!.reused, true);
  assert.deepEqual(other.content.projection.alternatives, fresh.content.projection.alternatives); assert.deepEqual(other.content.projection.support, fresh.content.projection.support);
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

for (const mode of ['unavailable', 'failed'] as const) test(`direct exact ${mode} investigation preserves the empty selection while attempt reporting remains separate`, async t => {
  const agent = new ScriptedContributionAgent([() => ({ kind: 'ended' })]);
  const options = fixture(t);
  const opened = await openApplication(options, mode === 'failed' ? { investigation: { agent } } : {});
  assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
  const first = interpretation(await session.execute({ kind: 'lens', lens: 'summarize', designation: named('entry') }));
  assert.equal(first.delivery.failed, true); assert.equal(first.delivery.attribution.status, 'failed');
  assert.deepEqual(first.content.projection.alternatives, []);
  assert.equal(first.delivery.reporting!.contribution!.outcome.kind, mode === 'failed' ? 'investigation-failure' : 'configuration-unavailable');
  assert.ok(first.delivery.reporting!.attempt);
  const module = first.content.projection.subject;
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

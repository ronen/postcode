import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { openApplication } from '../src/lib/application/index.js';
import type { ApplicationResult } from '../src/lib/application/index.js';
import { openCliSession } from '../src/lib/interfaces/cli/application.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { AssociationAddress, EntityId, SubmittedContribution, SubjectRef } from '../src/lib/contributions/model.js';
import { temporaryDirectory } from './cli-helpers.js';
import { ScriptedContributionAgent, proseContribution, entitySubject } from './contribution-agent.js';
import { syntheticUsage } from './investigator-double.js';
import { arrangeContributionView, renderContributionView } from '../src/lib/interfaces/cli/contribution-presentation.js';
function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-m3-cutover-');
  writeFileSync(path.join(root, 'entry.ts'), '/** Entry account. */ export const entry = 1;');
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['entry.ts'] }));
  return { configPath: path.join(root, 'tsconfig.json') };
}
function answer(value: ApplicationResult) { assert.equal(value.kind, 'answer'); return value; }
function contributed(value: ApplicationResult) { const result = answer(value); assert.equal(result.answer.content.contract, 'contribution'); return { result, projection: result.answer.content.value.projection }; }
const request = { kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'entry' } } as const;

test('all four existing agentic operations use exact flat contributions, reuse and immutable historical access', async t => {
  const agent = new ScriptedContributionAgent([(input, _signal, usage) => { usage(syntheticUsage); return { kind: 'submit', contribution: proseContribution(input, input.request.operation) }; }]);
  const opened = await openApplication(fixture(t), { investigation: { agent } }); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const initial = contributed(await opened.session.execute(request));
  const owner = initial.projection.alternatives[0]!.designation.investigram;
  const selections: SubjectRef[] = [{ kind: 'investigram', investigram: owner }, { kind: 'content', item: { investigram: owner, item: 'prose' }, component: null },
    { kind: 'designation', association: initial.projection.alternatives[0]!.designation }];
  for (const [index, lens] of ['explain', 'decompose', 'examine'].entries()) {
    const subject = selections[index]!; assert.notEqual(subject.kind, 'scope');
    const follow = contributed(await opened.session.execute({ kind: 'lens', lens, designation: { kind: 'selection', subject: subject as Exclude<SubjectRef, { kind: 'scope' }> } }));
    assert.deepEqual(follow.projection.question.request.subjects[0]!.subject, subject);
    assert.equal(follow.projection.alternatives[0]!.items[0]!.body && (follow.projection.alternatives[0]!.items[0]!.body as { text: string }).text,
      ['clarification', 'decomposition', 'examination'][index]);
    assert.ok(agent.inputs.at(-1)![0]!.responses.length > 0);
  }
  const repeated = contributed(await opened.session.execute(request));
  assert.equal(repeated.result.reporting!.reused, true); assert.deepEqual(repeated.projection, initial.projection); assert.equal(agent.inputs.length, 4);
  const reusedProduction = repeated.result.attribution.work.find(entry => entry.boundary === 'interpretation' && entry.outcome.records.includes(initial.result.reporting!.attempt!));
  assert.ok(reusedProduction);
  assert.equal(reusedProduction.disposition, 'reused');
  assert.ok(reusedProduction.generating.every(value => value.origin !== null && value.origin.parent > 0));
  const inspection = answer(await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: owner } }));
  assert.equal(inspection.answer.content.contract, 'contribution-inspection');
  assert.equal(inspection.answer.content.value.projection.investigations.length, 1, 'reverse lookup is exact whole-contribution subject only');
  const frozen = structuredClone(initial.result.answer);
  for (const method of ['invoke', 'associations', 'status'] as const) if (method !== 'status') t.mock.method(ContributionLedger.prototype, method, () => { throw Error('Exact access must not consult current ledger'); });
  for (const method of ['put', 'evaluations'] as const) t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw Error('Exact access must not evaluate or reselect'); });
  const exact = answer(await opened.session.execute({ kind: 'present', target: initial.result.answer.id }));
  assert.deepEqual(exact.answer, frozen); assert.equal(agent.inputs.length, 4);
  await opened.session.close(); assert.deepEqual(initial.result.answer, frozen);
  for (const method of ['get', 'lookup', 'capture'] as const) t.mock.method(MemoryProgramRecordStore.prototype, method, () => { throw Error('Detached presentation consulted a closed Session'); });
  t.mock.method(ContributionLedger.prototype, 'investigram', () => { throw Error('Detached presentation consulted the ledger'); });
  const view = arrangeContributionView({ projection: initial.projection }, { title: initial.result.title, presentation: { format: 'unicode', moreDetails: false } },
    null, initial.result.usage, new Map(initial.result.bindings.associations)).view;
  assert.match(renderContributionView(view), /functionality/);
});

test('summary redesignation changes current selection without rerun, preserving historical subjects and alternatives', async t => {
  let original!: AssociationAddress, entity!: EntityId, revision!: AssociationAddress;
  const agent = new ScriptedContributionAgent([input => {
    if (input.request.operation === 'functionality') { entity = entitySubject(input); return { kind: 'submit', contribution: proseContribution(input, 'Original', { associate: entity }) }; }
    const contribution = proseContribution(input, 'Revised');
    return { kind: 'submit', contribution: { investigrams: [{ ...contribution.investigrams[0]!, declarations: [...contribution.investigrams[0]!.declarations!,
      { key: 'redesignate', operation: 'supersede', target: { kind: 'result', result: initial.projection.question.result }, displaces: [original],
        members: [{ kind: 'item', item: { investigram: { local: 'answer' }, item: 'prose' } }], grounds: { text: 'More precise account.' } }] }] } satisfies SubmittedContribution };
  }]);
  const opened = await openApplication(fixture(t), { investigation: { agent } }); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const initial = contributed(await opened.session.execute(request)); original = initial.projection.alternatives[0]!.designation;
  const historical = answer(await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'selection', subject: { kind: 'designation', association: original } } }));
  const changed = contributed(await opened.session.execute({ kind: 'lens', lens: 'examine', designation: { kind: 'selection', subject: { kind: 'designation', association: original } } }));
  revision = { investigram: changed.projection.alternatives[0]!.designation.investigram, declaration: 'redesignate' };
  const current = contributed(await opened.session.execute(request));
  assert.deepEqual(current.projection.alternatives.map(value => value.designation), [revision]); assert.equal(current.result.reporting!.reused, true); assert.equal(agent.inputs.length, 2);
  assert.deepEqual(initial.projection.alternatives.map(value => value.designation), [original]);
  const exact = answer(await opened.session.execute({ kind: 'present', target: historical.answer.id })); assert.deepEqual(exact.answer, historical.answer);
  const selected = answer(await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'selection', subject: { kind: 'designation', association: original } } }));
  assert.equal(selected.answer.content.contract, 'contribution-inspection');
  assert.equal(selected.answer.content.value.projection.support.uses[0]!.status.standing.state, 'displaced');
  assert.deepEqual(selected.answer.content.value.projection.items, initial.projection.alternatives[0]!.items.map(item => item.address));
});

for (const worker of [false, true]) test(`summary and exact presentation retain usage and plain worker delivery (${worker ? 'worker' : 'direct'})`, async t => {
  const agent = new ScriptedContributionAgent([(input, _signal, usage) => { usage(syntheticUsage); return { kind: 'submit', contribution: proseContribution(input, 'A small module.') }; }]);
  const options = fixture(t), remote = worker ? interactiveSession(options, { investigator: agent }) : null;
  const opened = remote ? await remote.opening : await openCliSession(options, { investigation: { agent } }); assert.equal(opened.status, 'opened');
  const session = remote ?? ('session' in opened ? opened.session : null)!; t.after(() => session.close());
  const first = await session.execute({ lens: 'summarize', selector: 'entry', presentation: { format: 'json', moreDetails: false } });
  assert.equal(first.kind, 'view'); assert.equal(first.view.schema, 'postcode-contribution-view/1-experimental'); assert.equal(first.view.usage.calls, 1);
  assert.deepEqual(structuredClone(first), first); assert.ok(first.view.summary?.alternatives[0]!.prose.includes('A small module.'));
  const exact = await session.execute({ kind: 'present', target: first.view.answerReference!, presentation: { format: 'unicode', moreDetails: false } });
  assert.equal(exact.kind, 'view'); assert.equal(exact.view.schema, 'postcode-contribution-view/1-experimental');
  assert.deepEqual(exact.view.projection, first.view.projection); assert.match(exact.rendered, /A small module/); assert.equal(agent.inputs.length, 1); assert.equal(agent.closes, 1);
  let subject = first.view.rows[0]!.reference;
  for (const lens of ['explain', 'decompose', 'examine']) {
    const follow = await session.execute({ lens, selector: subject, reference: true, presentation: { format: 'json', moreDetails: false } });
    assert.equal(follow.kind, 'view'); assert.equal(follow.view.schema, 'postcode-contribution-view/1-experimental');
    assert.equal(follow.view.reporting!.contribution!.outcome.kind, 'accepted');
    assert.deepEqual(structuredClone(follow), follow);
    subject = follow.view.rows[0]!.reference;
  }
  assert.deepEqual(agent.inputs.map(inputs => inputs[0]!.request.operation), ['functionality', 'clarification', 'decomposition', 'examination']);
  assert.equal(agent.closes, 4);
});

test('historical identifying names resolve their Entity with displaced standing, without changing native handles', async t => {
  let old!: AssociationAddress, phase = 0;
  const agent = new ScriptedContributionAgent([input => {
    const entity = entitySubject(input), name = phase++ ? 'New architectural name' : 'Old architectural name';
    const base = proseContribution(input, name).investigrams[0]!;
    return { kind: 'submit', contribution: { investigrams: [{ ...base,
      items: [...base.items!, { key: 'name', type: 'identification', body: { name, nameOrigin: 'assigned', designation: 'A controlled architectural designation.' } }],
      declarations: [...base.declarations!, { key: 'identify', target: { kind: 'entity', entity, role: 'identification' },
        members: [{ kind: 'item', item: { investigram: { local: 'answer' }, item: 'name' } }],
        ...(old ? { operation: 'supersede', displaces: [old], grounds: { text: 'Changed naming judgment.' } } : { operation: 'add' }) }] }] } };
  }]);
  const opened = await openApplication(fixture(t), { investigation: { agent } }); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const first = contributed(await opened.session.execute(request)); old = { investigram: first.projection.alternatives[0]!.designation.investigram, declaration: 'identify' };
  const before = answer(await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'name', value: 'Old architectural name' } }));
  const saved = structuredClone(before.answer);
  await opened.session.execute({ ...request, fresh: true });
  for (const name of ['Old architectural name', 'New architectural name']) {
    const found = answer(await opened.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'name', value: name } }));
    assert.equal(found.answer.content.contract, 'contribution-inspection');
    assert.equal(found.resolution!.identifications![0]!.standing.state, name.startsWith('Old') ? 'displaced' : 'standing');
    assert.equal(found.answer.mechanical!.contract, 'modules');
    assert.equal(found.answer.mechanical!.value.modules[0]!.claim.record.information.handle, 'entry');
  }
  assert.deepEqual(answer(await opened.session.execute({ kind: 'present', target: before.answer.id })).answer, saved);
  assert.equal(agent.inputs.length, 2);
});

test('invalid common submission cannot partially displace a standing public answer', async t => {
  let original!: AssociationAddress, invalid = false;
  const agent = new ScriptedContributionAgent([input => invalid ? { kind: 'submit', contribution: { investigrams: [{ key: 'bad', qualification: { limitations: ['Controlled invalid batch.'] },
    declarations: [{ key: 'withdraw', operation: 'withdraw', displaces: [original], grounds: { text: 'MUST_NOT_BE_ACCEPTED' } },
      { key: 'dangling', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [{ kind: 'item', item: { investigram: { local: 'bad' }, item: 'absent' } }] }] }] } }
    : { kind: 'submit', contribution: proseContribution(input) }, () => ({ kind: 'ended' })]);
  const opened = await openApplication(fixture(t), { investigation: { agent } }); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const first = contributed(await opened.session.execute(request)); original = first.projection.alternatives[0]!.designation;
  const historical = structuredClone(first.projection); invalid = true;
  const failed = contributed(await opened.session.execute({ ...request, fresh: true }));
  assert.equal(failed.result.failed, true); assert.deepEqual(failed.projection, historical);
  assert.doesNotMatch(JSON.stringify(failed.projection), /MUST_NOT_BE_ACCEPTED/);
  assert.deepEqual(contributed(await opened.session.execute({ kind: 'present', target: first.projection.id })).projection, historical);
  assert.equal(agent.inputs[1]![1]!.responses[0]!.tool, 'invalid-submission');
});

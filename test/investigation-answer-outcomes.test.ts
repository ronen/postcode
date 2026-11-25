import { arrangeContributionAnswer } from '../scripts/structured-accounts/support/answers.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import type { TestContext } from 'node:test';
import { openApplication } from '../src/lib/application/index.js';
import type { ApplicationResult } from '../src/lib/application/index.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import type { Production, AssociationAddress } from '../src/lib/contributions/model.js';
import { ScriptedContributionAgent, proseContribution } from './contribution-agent.js';
import { temporaryDirectory } from './temporary-directory.js';
import type { DialogReply } from '../src/lib/contributions/dialog.js';
import { investigationBounds } from '../src/lib/investigation/bounds.js';

function fixture(t: TestContext) {
  const root = temporaryDirectory(t, 'postcode-attempt-answers-');
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['entry.ts'] }));
  writeFileSync(path.join(root, 'entry.ts'), 'declare module "entry" {}');
  return { configPath: path.join(root, 'tsconfig.json') };
}
function answer(result: ApplicationResult) {
  assert.equal(result.kind, 'answer'); assert.equal(result.answer.content.contract, 'contribution');
  return { result, projection: result.answer.content.value.projection };
}
for (const lens of ['summarize', 'state-behavior']) test(`${lens}: attempts, partial content, failed fresh work and withdrawal have distinct meanings`, async t => {
  const retained: Production[] = [], abandon = ContributionLedger.prototype.abandon;
  t.mock.method(ContributionLedger.prototype, 'abandon', function(this: ContributionLedger, ...args: Parameters<typeof abandon>) {
    const production = abandon.apply(this, args); retained.push(production); return production;
  });
  let phase = 0, designation!: AssociationAddress;
  const agent = new ScriptedContributionAgent([input => {
    switch (phase++) {
      case 0: return { kind: 'communication-failure', code: 'timeout-a', diagnostic: 'TIMEOUT_ONLY_SENTINEL' };
      case 1: return { kind: 'configuration-unavailable', code: 'auth-b', diagnostic: 'AUTH_ONLY_SENTINEL' };
      case 2: return { kind: 'submit', contribution: { investigrams: [], report: { inability: 'UNDESIGNATED_INABILITY_SENTINEL' } } };
      case 3: return { kind: 'submit', contribution: { ...proseContribution(input, 'Partial qualified information.'), report: { inability: 'SELECTED_SCOPE_LIMIT_SENTINEL', statement: 'Only one scenario was established.' } } };
      case 4: return { kind: 'communication-failure', code: 'timeout-fresh', diagnostic: 'FRESH_FAILURE_SENTINEL' };
      default: return { kind: 'submit', contribution: { investigrams: [{ key: 'withdraw', qualification: { limitations: ['Qualified withdrawal.'] }, declarations: [
        { key: 'withdraw', operation: 'withdraw', displaces: [designation], grounds: { text: 'WITHDRAWAL_GROUNDS_SENTINEL' } }] }] } };
    }
  }]);
  const opened = await openApplication(fixture(t), { investigation: { agent } }); assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close()); const session = opened.session;
  const request = { kind: 'lens', lens, designation: { kind: 'name', value: 'entry' } } as const;
  const a = answer(await session.execute(request)), b = answer(await session.execute(request));
  assert.deepEqual(b.projection, a.projection); assert.notEqual(a.result.reporting!.attempt, b.result.reporting!.attempt);
  assert.equal(a.result.reporting!.unavailable!.diagnostic, 'TIMEOUT_ONLY_SENTINEL');
  assert.equal(b.result.reporting!.unavailable!.code, 'auth-b');
  assert.equal(retained.length, 2); assert.equal(retained[0]!.outcome.kind, 'no-contribution');
  assert.ok(JSON.stringify(retained).includes('TIMEOUT_ONLY_SENTINEL') && JSON.stringify(retained).includes('AUTH_ONLY_SENTINEL'));
  assert.doesNotMatch(JSON.stringify(a.projection), /TIMEOUT_ONLY|AUTH_ONLY/);
  const undesignated = answer(await session.execute(request));
  assert.deepEqual(undesignated.projection, a.projection);
  assert.equal(undesignated.result.reporting!.contribution!.report!.inability, 'UNDESIGNATED_INABILITY_SENTINEL');
  assert.equal(answer(await session.execute(request)).result.reporting!.reused, true); assert.equal(phase, 3);
  const partial = answer(await session.execute({ ...request, fresh: true })); designation = partial.projection.alternatives[0]!.designation;
  assert.equal(partial.projection.fulfillment, lens === 'state-behavior' ? 'unfulfilled' : null);
  assert.ok(JSON.stringify(partial.projection.support).includes('SELECTED_SCOPE_LIMIT_SENTINEL'));
  const failedFresh = answer(await session.execute({ ...request, fresh: true }));
  assert.equal(failedFresh.result.failed, true); assert.equal(failedFresh.result.reporting!.unavailable!.diagnostic, 'FRESH_FAILURE_SENTINEL');
  assert.deepEqual(failedFresh.projection, partial.projection);
  const exact = answer(await session.execute({ kind: 'present', target: partial.projection.id }));
  assert.equal(exact.result.reporting, null); assert.equal(exact.result.failed, false);
  const presentation = arrangeContributionAnswer({ projection: exact.projection }, 'Historical answer');
  assert.match(JSON.stringify(presentation), /SELECTED_SCOPE_LIMIT_SENTINEL/);
  assert.doesNotMatch(JSON.stringify(presentation), /FRESH_FAILURE_SENTINEL|TIMEOUT_ONLY|AUTH_ONLY|UNDESIGNATED_INABILITY/);
  const withdrawn = answer(await session.execute({ ...request, fresh: true }));
  assert.deepEqual(withdrawn.projection.alternatives, []); assert.notEqual(withdrawn.projection.id, a.projection.id);
  assert.match(JSON.stringify(withdrawn.projection.history), /WITHDRAWAL_GROUNDS_SENTINEL/);
  assert.deepEqual(answer(await session.execute({ kind: 'present', target: partial.projection.id })).projection, partial.projection);
  const exports = await session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } });
  assert.equal(exports.kind, 'answer'); assert.equal(exports.answer.content.contract, 'modules');
  assert.deepEqual(exports.answer.content.value.modules[0]!.exports, []);
  assert.ok(exports.answer.content.value.evaluations.some(value => value.requirement === 'exports' && value.availability === 'available' && value.materialization === 'full'));
  const snapshot = structuredClone(retained); await session.close(); assert.deepEqual(retained, snapshot);
});

for (const scenario of ['inability', 'malformed', 'invalid', 'guard', 'communication', 'configuration'] as const) {
  test(`direct application preserves ${scenario} reporting and separates exact answers`, async t => {
    const step = (): DialogReply => scenario === 'inability'
      ? { kind: 'submit', contribution: { investigrams: [], report: { inability: 'INABILITY_SENTINEL', statement: 'STATEMENT_SENTINEL' } } }
      : scenario === 'malformed' ? { kind: 'malformed' } as unknown as DialogReply
        : scenario === 'invalid' ? { kind: 'submit', contribution: { investigrams: [] } }
          : scenario === 'guard' ? { kind: 'tools', requests: [] }
            : { kind: scenario === 'communication' ? 'communication-failure' : 'configuration-unavailable', code: 'CODE_SENTINEL', diagnostic: 'DIAGNOSTIC_SENTINEL' };
    const agent = new ScriptedContributionAgent([step, step]);
    const opened = await openApplication(fixture(t), { investigation: { agent, bounds: { ...investigationBounds, calls: scenario === 'guard' ? 1 : investigationBounds.calls } } });
    assert.equal(opened.status, 'opened'); const session = opened.session; t.after(() => session.close());
    const request = { kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'entry' } } as const;
    const first = answer(await session.execute(request)), repeated = answer(await session.execute(request));
    const reusable = !['communication', 'configuration'].includes(scenario);
    assert.equal(repeated.result.reporting!.reused, reusable);
    assert.deepEqual(repeated.result.reporting!.contribution, first.result.reporting!.contribution);
    assert.deepEqual(repeated.projection, first.projection);
    const expected = { inability: 'accepted', malformed: 'investigation-failure', invalid: 'invalid-submission', guard: 'limit-stop', communication: 'communication-failure', configuration: 'configuration-unavailable' };
    const outcome = first.result.reporting!.contribution?.outcome ?? first.result.reporting!.unavailable;
    assert.equal(outcome?.kind, expected[scenario]);
    const exact = answer(await session.execute({ kind: 'present', target: first.projection.id }));
    assert.equal(exact.result.reporting, null); assert.deepEqual(exact.projection, first.projection);
    assert.equal(agent.inputs.length, reusable ? 1 : 2);
    assert.equal(agent.closes, agent.inputs.length);
  });
}

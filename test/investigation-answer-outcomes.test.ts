import assert from 'node:assert/strict';
import { test } from 'node:test';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import type { TestContext } from 'node:test';
import { openApplication } from '../src/lib/application/index.js';
import type { ApplicationResult } from '../src/lib/application/index.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import type { Production, AssociationAddress } from '../src/lib/contributions/model.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { ScriptedContributionAgent, proseContribution } from './contribution-agent.js';
import { temporaryDirectory } from './cli-helpers.js';
import { arrangeContributionAnswer } from '../src/lib/contributions/answers.js';
import { openCliSession } from '../src/lib/interfaces/cli/application.js';
import type { DialogReply } from '../src/lib/contributions/dialog.js';
import { investigationBounds } from '../src/lib/investigation/bounds.js';
import { inlineText } from '../src/lib/terminal-text.js';

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

test('worker retries distinct transient failures without changing the empty answer, then retains selected partial qualification', async t => {
  let phase = 0;
  const agent = new ScriptedContributionAgent([input => phase++ === 0 ? { kind: 'communication-failure', code: 'network', diagnostic: 'NETWORK_DIAGNOSTIC' }
    : phase === 2 ? { kind: 'configuration-unavailable', code: 'credentials', diagnostic: 'CREDENTIAL_DIAGNOSTIC' }
      : { kind: 'submit', contribution: { ...proseContribution(input, 'Selected partial account.'), report: { inability: 'PARTIAL_SCOPE' } } }]);
  const remote = interactiveSession(fixture(t), { investigator: agent }); t.after(() => remote.close());
  assert.equal((await remote.opening).status, 'opened');
  const request = { lens: 'summarize', selector: 'entry', presentation: { format: 'json', moreDetails: false } } as const;
  const a = await remote.execute(request), b = await remote.execute(request);
  assert.equal(a.kind, 'view'); assert.equal(b.kind, 'view');
  assert.equal(a.view.schema, 'postcode-contribution-view/1-experimental'); assert.equal(b.view.schema, 'postcode-contribution-view/1-experimental');
  assert.deepEqual(a.view.projection, b.view.projection); assert.deepEqual(a.view.summary, b.view.summary);
  assert.notEqual(a.view.reporting!.attempt, b.view.reporting!.attempt);
  assert.deepEqual([a.view.reporting!.unavailable!.code, b.view.reporting!.unavailable!.code], ['network', 'credentials']);
  const exact = await remote.execute({ kind: 'present', target: a.view.answerReference!, presentation: request.presentation });
  assert.equal(exact.kind, 'view'); assert.equal(exact.view.schema, 'postcode-contribution-view/1-experimental');
  assert.equal(exact.view.reporting, null); assert.deepEqual(exact.view.summary, a.view.summary);
  const partial = await remote.execute(request), reused = await remote.execute(request);
  assert.equal(partial.kind, 'view'); assert.equal(reused.kind, 'view');
  assert.equal(reused.view.schema, 'postcode-contribution-view/1-experimental');
  assert.equal(reused.view.reporting!.reused, true); assert.match(JSON.stringify(reused.view.summary), /PARTIAL_SCOPE/);
  assert.equal(agent.inputs.length, 3); assert.equal(agent.closes, 3);
  assert.deepEqual(structuredClone(reused), reused);
});

for (const worker of [false, true]) for (const scenario of ['inability', 'malformed', 'invalid', 'guard', 'communication', 'configuration'] as const) {
  test(`Unicode preserves ${scenario} attempt reporting and separates exact answers (${worker ? 'worker' : 'direct'})`, async t => {
    const step = (): DialogReply => scenario === 'inability'
      ? { kind: 'submit', contribution: { investigrams: [], report: { inability: 'INABILITY_SENTINEL\nnot a heading', statement: 'STATEMENT_SENTINEL' } } }
      : scenario === 'malformed' ? { kind: 'malformed' } as unknown as DialogReply
        : scenario === 'invalid' ? { kind: 'submit', contribution: { investigrams: [] } }
          : scenario === 'guard' ? { kind: 'tools', requests: [] }
            : { kind: scenario === 'communication' ? 'communication-failure' : 'configuration-unavailable', code: 'CODE_SENTINEL', diagnostic: 'DIAGNOSTIC_SENTINEL\nnot a heading' };
    const agent = new ScriptedContributionAgent([step, step]);
    const bounds = { ...investigationBounds, calls: scenario === 'guard' ? 1 : investigationBounds.calls };
    const options = fixture(t), remote = worker ? interactiveSession(options, { investigator: agent, investigationBounds: bounds }) : null;
    const opened = remote ? await remote.opening : await openCliSession(options, { investigation: { agent, bounds } });
    assert.equal(opened.status, 'opened');
    const session = remote ?? ('session' in opened ? opened.session : null)!; t.after(() => session.close());
    const request = { lens: 'summarize', selector: 'entry', presentation: { format: 'unicode', moreDetails: false } } as const;
    const first = await session.execute(request);
    assert.equal(first.kind, 'view'); assert.equal(first.view.schema, 'postcode-contribution-view/1-experimental');
    const saved = structuredClone(first.view.summary), reporting = first.view.reporting!;
    assert.match(first.rendered, /New investigation request\./);
    if (scenario === 'inability') {
      assert.match(first.rendered, /Attempt: accepted/);
      assert.ok(first.rendered.includes(inlineText('INABILITY_SENTINEL\nnot a heading')));
      assert.match(first.rendered, /Attempt report: STATEMENT_SENTINEL/);
      assert.doesNotMatch(first.rendered, /\nnot a heading/);
    } else if (scenario === 'malformed') assert.match(first.rendered, /Attempt: investigation-failure: Malformed agent response\./);
    else if (scenario === 'guard') assert.match(first.rendered, /Attempt: limit-stop: .*guard/);
    else if (scenario === 'invalid') {
      const outcome = reporting.contribution!.outcome;
      assert.equal(outcome.kind, 'invalid-submission');
      assert.ok(outcome.problems.length > 0);
      for (const problem of outcome.problems) assert.ok(first.rendered.includes(`Submission problem: ${inlineText(problem)}`));
    } else {
      assert.ok(first.rendered.includes(`Attempt: ${scenario === 'communication' ? 'communication-failure' : 'configuration-unavailable'} (CODE_SENTINEL): ${inlineText('DIAGNOSTIC_SENTINEL\nnot a heading')}`));
      assert.doesNotMatch(first.rendered, /\nnot a heading/);
    }
    const repeated = await session.execute(request);
    assert.equal(repeated.kind, 'view'); assert.equal(repeated.view.schema, 'postcode-contribution-view/1-experimental');
    const reusable = !['communication', 'configuration'].includes(scenario);
    assert.equal(repeated.view.reporting!.reused, reusable);
    assert.match(repeated.rendered, reusable ? /Retained outcome; no new investigation\./ : /New investigation request\./);
    assert.deepEqual(repeated.view.reporting!.contribution, reporting.contribution);
    for (const line of first.rendered.split('\n').filter(line => /^(Attempt:|Attempt report:|Submission problem:)/.test(line))) {
      assert.ok(repeated.rendered.includes(line), 'reused reporting preserves its applicable outcome and producer report');
    }
    assert.deepEqual(repeated.view.projection, first.view.projection);
    assert.deepEqual(repeated.view.summary, saved);
    const exact = await session.execute({ kind: 'present', target: first.view.answerReference!, presentation: request.presentation });
    assert.equal(exact.kind, 'view'); assert.equal(exact.view.schema, 'postcode-contribution-view/1-experimental');
    assert.equal(exact.view.reporting, null); assert.deepEqual(exact.view.summary, saved);
    assert.doesNotMatch(exact.rendered, /Attempt:|Attempt report:|New investigation request|Retained outcome|SENTINEL|Submission problem:|Malformed agent response/);
    assert.equal(agent.inputs.length, reusable ? 1 : 2);
  });
}

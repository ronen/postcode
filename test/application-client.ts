/** Small direct client: production imports are confined to the intended entry. */
import assert from 'node:assert/strict';
import { openApplication, SessionClosed } from '../src/lib/application/index.js';
import type { ApplicationResult, InvestigatorAgent, WorkProgress, AttemptReport } from '../src/lib/application/index.js';

function answer(result: ApplicationResult) {
  assert.equal(result.kind, 'answer');
  assert.deepEqual(structuredClone(result), result);
  assert.equal(result.consumption, null);
  return result;
}
export async function exerciseApplication(configPath: string, agent: InvestigatorAgent) {
  const work: WorkProgress[] = [], progress: AttemptReport[] = [], reports: AttemptReport[] = [];
  const opened = await openApplication({ configPath }, { onWork: event => work.push(event),
    investigation: { agent, onProgress: report => progress.push(report), onReport: report => reports.push(report) } });
  assert.equal(opened.status, 'opened');
  const session = opened.session;
  try {
    const capabilities = session.capabilities();
    assert.ok(capabilities.some(item => item.id === 'modules' && item.question));
    assert.deepEqual(structuredClone(capabilities), capabilities);
    const inventory = answer(await session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } }));
    assert.equal(inventory.answer.content.contract, 'modules');
    const module = inventory.answer.content.value.modules.find(item => item.claim.record.information.handle === 'large')!;
    assert.ok(module);
    const designation = { kind: 'reference' as const, value: module.id };
    const organization = answer(await session.execute({ kind: 'lens', lens: 'organization', designation: { kind: 'repository' } }));
    const dependencies = answer(await session.execute({ kind: 'lens', lens: 'dependency-structure', designation: { kind: 'configured-project' } }));
    const children = answer(await session.execute({ kind: 'lens', lens: 'dependency-children', designation }));
    const inspection = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation }));
    const original = answer(await session.execute({ kind: 'lens', lens: 'summarize', designation }, { requestId: 'direct-client-summary' }));
    assert.equal(original.answer.content.contract, 'investigation');
    const account = original.answer.content.value.projection.relations[0]!.account;
    const follow = answer(await session.execute({ kind: 'lens', lens: 'examine', designation: { kind: 'reference', value: account } }));
    const historical = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: account } }));
    const exact = answer(await session.execute({ kind: 'present', target: original.answer.id }));
    assert.deepEqual(exact.answer, original.answer);
    const usage = await session.execute({ kind: 'report', report: 'usage' });
    assert.equal(usage.kind, 'usage');
    for (const value of [...work, ...progress, ...reports]) {
      assert.deepEqual(structuredClone(value), value); assert.ok(Object.isFrozen(value));
    }
    assert.ok(work.some(item => item.kind === 'finish'));
    assert.ok(progress.length > 0); assert.equal(reports.length, 2);
    assert.equal(original.context.id, 'direct-client-summary');
    assert.ok(original.methods.every(method => !method.includes('presentation')));
    await session.close();
    assert.deepEqual(session.usage(), usage.usage);
    await assert.rejects(session.execute({ kind: 'report', report: 'usage' }), SessionClosed);
    return { inventory, organization, dependencies, children, inspection, original, follow, historical, exact, usage };
  } finally { await session.close(); }
}

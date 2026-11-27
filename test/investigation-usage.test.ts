import assert from 'node:assert/strict';
import { test } from 'node:test';
import { InvestigationUsage } from '../src/lib/investigation/usage.js';
import { ScriptedContributionAgent } from './contribution-agent.js';
import { syntheticUsage } from './investigator-double.js';
import type { RecordId } from '../src/lib/records.js';
test('usage retains distinct reports and anomalies without selecting uncertain totals', () => {
  const usage = new InvestigationUsage();
  const agent = new ScriptedContributionAgent([]);
  const report = usage.start('attempt' as RecordId, 1, agent.identity);
  report(syntheticUsage);
  report(syntheticUsage);
  assert.equal(usage.calls()[0]!.reports.length, 1);
  assert.deepEqual(usage.calls()[0]!.reported, syntheticUsage);
  assert.throws(() => usage.start('attempt' as RecordId, 1, agent.identity), /Duplicate/);
  report({ source: 'provider', categories: [] });
  assert.equal(usage.calls()[0]!.reports.length, 2);
  assert.equal(usage.calls()[0]!.reported, null);
  assert.match(usage.calls()[0]!.anomalies.join(' '), /Differing reports/);
  for (const value of [NaN, Infinity, NaN]) report({ source: 'provider', categories: [{ category: 'output', unit: 'tokens', value, includedIn: null }] });
  assert.equal(usage.calls()[0]!.reports.length, 4, 'distinct non-finite reports survive without JSON null collisions');
  assert.equal(usage.calls()[0]!.reported, null);
});


// These assertions previously ran through the CLI host. Their accounting contract
// belongs to the direct Session and must survive retirement of that host.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import type { TestContext } from 'node:test';
import { openApplication } from '../src/lib/application/index.js';
import { moduleRecord, proseContribution } from './contribution-agent.js';
import { temporaryDirectory } from './temporary-directory.js';
async function direct(t: TestContext, agent: ScriptedContributionAgent) {
  const root = temporaryDirectory(t, 'postcode-direct-usage-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), 'export const entry = 1;');
  const opened = await openApplication({ configPath }, { investigation: { dialogAgent: agent } });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close()); return opened.session;
}
const summary = { kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'entry' } } as const;
test('direct Session preserves unknown/anomalous usage and aggregate overflow after shutdown', async t => {
  const agent = new ScriptedContributionAgent([
    ...[Number.MAX_VALUE, Number.MAX_VALUE, -1].map(value => (input: Parameters<typeof moduleRecord>[0], _signal: AbortSignal, usage: (value: typeof syntheticUsage) => void) => {
      usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', value, includedIn: null }] });
      return { kind: 'tools' as const, requests: [{ kind: 'source' as const, subject: moduleRecord(input) }] };
    }),
    input => ({ kind: 'submit', contribution: proseContribution(input) }),
  ]);
  const session = await direct(t, agent), result = await session.execute(summary);
  assert.equal(result.kind, 'answer'); assert.equal(result.reporting!.contribution!.outcome.kind, 'accepted');
  assert.equal(result.usage.calls, 4); assert.equal(result.usage.missingCalls, 1); assert.equal(result.usage.anomalousCalls, 1);
  assert.equal(result.usage.totals[0]!.categories[0]!.value, null);
  assert.match(result.usage.limitations.join(' '), /finite numeric range/);
  await session.close(); assert.deepEqual(session.usage(), result.usage);
});
test('direct Session serializes non-finite usage without erasing distinctions', async t => {
  const session = await direct(t, new ScriptedContributionAgent([(input, _signal, usage) => {
    for (const value of [NaN, Infinity, -Infinity]) usage({ source: 'synthetic', categories: [{ category: 'input', unit: 'tokens', includedIn: null, value }] });
    return { kind: 'submit', contribution: proseContribution(input) };
  }]));
  const result = await session.execute(summary), json = JSON.parse(JSON.stringify(result.usage));
  assert.deepEqual(json.nonFiniteReports.map((item: { value: string }) => item.value), ['NaN', 'Infinity', '-Infinity']);
  assert.equal(json.anomalousCalls, 1); assert.deepEqual(json.totals, []);
});
test('direct usage arriving after an earlier reply is retained until sealing, and known incompatible subjects are refused', async t => {
  let first!: () => void;
  const agent = new ScriptedContributionAgent([
    (input, _signal, usage) => { first = () => usage(syntheticUsage); return { kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(input) }] }; },
    (input, _signal, usage) => { first(); usage(syntheticUsage); return { kind: 'submit', contribution: proseContribution(input) }; },
  ]);
  const session = await direct(t, agent), result = await session.execute(summary);
  assert.equal(result.kind, 'answer'); assert.equal(result.answer.content.contract, 'contribution');
  assert.equal(result.usage.calls, 2); assert.equal(result.usage.missingCalls, 0);
  assert.equal(result.usage.totals[0]!.categories.find(item => item.category === 'input')!.value, 40);
  assert.equal(agent.closes, 1);
  const owner = result.answer.content.value.projection.alternatives[0]!.designation.investigram;
  for (const lens of ['dependency-children', 'dependency-parents', 'summarize']) {
    const refused = await session.execute({ kind: 'lens', lens, designation: { kind: 'reference', value: owner } });
    assert.equal(refused.kind, 'resolution'); assert.equal(refused.resolution.reason, 'unsupported-subject');
    assert.equal(refused.resolution.candidates[0]!.kind, 'contribution');
  }
  assert.equal(agent.inputs.length, 1);
  assert.deepEqual((await session.execute({ kind: 'report', report: 'usage' })).usage, result.usage);
});

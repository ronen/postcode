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


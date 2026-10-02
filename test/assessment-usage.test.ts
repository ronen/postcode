import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';

test('assessment report preserves investigator/evaluator attribution and unknown ChatGPT charges', t => {
  const root = temporaryDirectory(t, 'postcode-assessment-usage-'), input = path.join(root, 'runs.json');
  const group = (route: string) => ({ agent: { provider: 'openai', model: 'gpt-6-sol', configuration: { billingRoute: route, authenticationRoute: route === 'chatgpt-plan' ? 'chatgpt-sign-in' : 'api-key' } }, source: 'provider', categories: [{ category: 'input', unit: 'tokens', value: 100, includedIn: null }] });
  const run = (role: string, route: string) => ({ role, session: role, usage: { calls: 2, missingCalls: 1, anomalousCalls: 0, totals: [group(route)], limitations: ['One call has unknown usage.'] } });
  writeFileSync(input, JSON.stringify([run('investigator', 'chatgpt-plan'), run('evaluator', 'chatgpt-plan'), run('assessor', 'openai-api')]));
  const report = JSON.parse(execFileSync(process.execPath, ['scripts/module-investigation/usage-report.mjs', input], { encoding: 'utf8' }));
  assert.deepEqual(report.runs.map((r: { role: string }) => r.role), ['investigator', 'evaluator', 'assessor']);
  assert.equal(report.runs[0].groups[0].monetaryAttribution.amount, null); assert.equal(report.runs[0].missingCalls, 1);
  assert.match(report.runs[0].groups[0].monetaryAttribution.explanation, /API prices are not ChatGPT/);
  assert.match(report.runs[2].groups[0].monetaryAttribution.explanation, /not confirmed API charges/);
});

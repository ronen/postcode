import { comparisonFixture, fixtures, commands, buildIdentity } from './comparison-fixtures.mjs';
import { normalizeSession as normalize } from '../_build/test/comparison.js';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const root = process.cwd();
globalThis.__analysisMeasure = (_, operation) => operation();
// Usage: node scripts/compare-analysis.mjs BEFORE_BUILD AFTER_BUILD REPORT
const [beforeBuild, afterBuild, report] = process.argv.slice(2);
if (!beforeBuild || !afterBuild || !report) throw Error('Expected two builds and a report path');
const before = await import(pathToFileURL(path.resolve(beforeBuild, 'src/lib/cli.js')));
const after = await import(pathToFileURL(path.resolve(afterBuild, 'src/lib/cli.js')));
const identities = { before: buildIdentity(beforeBuild), after: buildIdentity(afterBuild) };
const results = [];
async function invoke(implementation, args, config) {
  let stdout = '', stderr = ''; const batches = [];
  const exit = await implementation.runCli([...args, '--project', config], { cwd: root, checkout: root,
    stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
    sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  assert.equal(exit, 0, stderr); assert.equal(batches.length, 1);
  const batch = batches[0];
  const kinds = new Map(batch.records.map(record => [record.id, record.kind]));
  const observation = { formatVersion: batch.formatVersion, session: batch.session, command: batch.command, records: batch.records.map(({ kind, value }) => ({ kind, value })),
    events: batch.events.map(({ id, ...event }) => Object.fromEntries(Object.entries(event).map(([key, value]) => [key, kinds.get(value) ?? value]))) };
  const view = batch.records.find(record => record.kind === 'qualified-view').value;
  return { stdout, stderr, observation, view };
}
async function pair(args, config) {
  const a = await invoke(before, args, config), b = await invoke(after, args, config);
  assert.deepEqual(normalize(b), normalize(a));
  results.push({ config, args, bytes: Buffer.byteLength(a.stdout), sha256: createHash('sha256').update(a.stdout).digest('hex'), equal: true,
    session: a.view.projection.session, events: a.observation.events.map(event => event.type) });
  console.log(config, args.join(' '), 'equal');
  return a.view;
}
for (const fixture of fixtures) {
  await comparisonFixture(fixture, async (root, selector) => {
    for (const command of commands(selector)) await pair(command, path.join(root, 'tsconfig.json'));
  });
}
assert.deepEqual({ before: buildIdentity(beforeBuild), after: buildIdentity(afterBuild) }, identities, 'Builds changed during comparison');
writeFileSync(report, JSON.stringify({ ...identities, results }, null, 2) + '\n');

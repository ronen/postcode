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
  const observation = { formatVersion: batch.formatVersion, records: batch.records.map(({ kind, value }) => ({ kind, value })),
    events: batch.events.map(({ id, ...event }) => Object.fromEntries(Object.entries(event).map(([key, value]) => [key, kinds.get(value) ?? value]))) };
  const view = batch.records.find(record => record.kind === 'qualified-view').value;
  return { stdout, stderr, observation, view };
}
async function pair(args, config) {
  const a = await invoke(before, args, config), b = await invoke(after, args, config);
  assert.deepEqual(b, a);
  results.push({ config, args, bytes: Buffer.byteLength(a.stdout), sha256: createHash('sha256').update(a.stdout).digest('hex'), equal: true,
    snapshot: a.view.projection.snapshot, events: a.observation.events.map(event => event.type) });
  console.log(config, args.join(' '), 'equal');
  return a.view;
}
for (const config of ['fixtures/dependency-journey/tsconfig.json', 'fixtures/dependency-contract/tsconfig.json']) {
  await pair(['modules', '--json'], config);
  const org = await pair(['organization', 'repository', '--json'], config);
  await pair(['organization', 'project'], config);
  const group = org.groups.find(group => group.name === 'src');
  await pair(['inspect', group.entityId, '--snapshot', org.projection.snapshot, '--source-detail', '--json'], config);
  const deps = await pair(['dependencies', '--json'], config);
  await pair(['dependencies', '--source-detail'], config);
  const module = deps.modules.find(module => module.handle === (config.includes('journey') ? 'forward' : 'requests'));
  for (const action of ['children', 'parents']) await pair([action, module.entityId, '--snapshot', deps.projection.snapshot, '--json', '--source-detail'], config);
  await pair(['inspect', module.entityId, '--snapshot', deps.projection.snapshot, '--dependency-context', '--source-detail', '--json'], config);
  const stale = await pair(['children', module.entityId, '--snapshot', `snapshot:${'0'.repeat(64)}`, '--json'], config);
  assert.equal(stale.subjects.length, 0);
}
await pair(['modules', '--json'], 'tsconfig.json');
writeFileSync(report, JSON.stringify(results, null, 2) + '\n');

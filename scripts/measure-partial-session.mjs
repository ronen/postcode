import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// PostCode-sized partial-expansion regression and descriptive latency/retention probe.
// An older build can be measured with: <runtime-src-directory> --allow-retries.
assert.ok(global.gc, 'Run with --expose-gc');
const runtime = path.resolve(process.argv[2] ?? '_build/src');
const expectReuse = !process.argv.includes('--allow-retries');
const { openSession } = await import(pathToFileURL(path.join(runtime, 'lib/session.js')).href);
const collect = async () => {
  for (let i = 0; i < 3; i++) { global.gc(); await new Promise(resolve => setImmediate(resolve)); }
  return process.memoryUsage();
};
const report = { node: process.versions.node, runtime, expectReuse, projects: [],
  note: 'Two temporary Git copies of current PostCode sources/tests/configuration use the installed dependencies. One adds an unresolved re-export. Direct execution includes validation, excludes worker/publication/sink costs, and each measured request is followed by forced GC outside its timed interval. Five warmed reference views are deliberately retained until close. No timing or memory threshold is asserted.' };
for (const partial of [false, true]) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-partial-cost-'));
  let session;
  try {
    for (const name of ['src', 'test', 'tsconfig.json']) cpSync(path.resolve(name), path.join(root, name), { recursive: true });
    symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
    writeFileSync(path.join(root, '.gitignore'), 'node_modules\n');
    if (partial) writeFileSync(path.join(root, 'src/partial-export.ts'), "export { missing } from './nowhere.js';\n");
    execFileSync('git', ['init', '--quiet', root]);
    const baseline = await collect();
    const started = performance.now();
    const opened = openSession({ configPath: path.join(root, 'tsconfig.json') });
    assert.equal(opened.status, 'opened');
    session = opened.session;
    const openingMs = performance.now() - started;
    const request = { lens: 'modules', selector: null, presentation: { format: 'json', sourceDetail: false } };
    let inventory = session.execute(request);
    assert.equal(inventory.view.schema, 'postcode-view/1-experimental');
    assert.equal(inventory.view.evaluations.some(item => item.materialization === 'partial'), partial);
    const population = inventory.view.modules.length;
    const subject = inventory.view.modules.find(item => item.handle === 'session');
    assert.ok(subject);
    const commands = [request, { ...request, lens: 'dependencies' }, { ...request, lens: 'organization' },
      { ...request, lens: 'inspect', selector: subject.entityId, reference: true },
      { ...request, lens: 'children', selector: subject.entityId, reference: true }];
    // First acquire every requested lens, then establish comparison views on that basis.
    for (const command of commands) session.execute(command);
    let retained = commands.map(command => session.execute(command));
    const beforeRepeats = await collect();
    const samples = [];
    const projections = commands.map(() => new Set());
    for (let round = 0; round < 4; round++) {
      for (const [index, command] of commands.entries()) {
        const began = performance.now();
        const result = session.execute(command);
        const milliseconds = performance.now() - began;
        if (expectReuse) assert.deepEqual(result, retained[index], `Unexpected retry: ${partial ? 'partial' : 'clean'} ${command.lens}`);
        projections[index].add(result.view.projection.id);
        const memory = await collect();
        samples.push({ round, lens: command.lens, milliseconds, heapUsed: memory.heapUsed, rss: memory.rss });
      }
      console.error(`${partial ? 'partial' : 'clean'}: ${round + 1}/4 measured rounds complete`);
    }
    const afterRepeats = await collect();
    // Release views and session state before measuring teardown; samples contain only scalars.
    retained = undefined; inventory = undefined;
    session.close(); session = undefined;
    const closed = await collect();
    report.projects.push({ partial, population, openingMs, baseline, beforeRepeats, afterRepeats, closed, samples,
      distinctProjections: commands.map((command, index) => ({ lens: command.lens, count: projections[index].size })) });
  } finally { session?.close(); rmSync(root, { recursive: true, force: true }); }
}
console.log(JSON.stringify(report, null, 2));

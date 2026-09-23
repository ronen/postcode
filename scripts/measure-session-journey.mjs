import assert from 'node:assert/strict';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { runCli } from '../_build/src/lib/cli.js';
import { writeFileSync } from 'node:fs';
import { openSession } from '../_build/src/lib/session.js';

// Run with --expose-gc; measurements are descriptive, never test thresholds.
const configPath = path.resolve(process.argv[2] ?? 'tsconfig.json');
const output = process.argv[3];
const collect = async () => { for (let i = 0; i < 3; i++) { global.gc?.(); await new Promise(resolve => setImmediate(resolve)); } return process.memoryUsage(); };
const baseline = await collect();
const openingStarted = performance.now();
let opened = openSession({ configPath, excludedOutputDirectories: [path.resolve('_build'), path.resolve('_observations'), ...(output ? [path.dirname(path.resolve(output))] : [])] });
assert.equal(opened.status, 'opened');
const openingMs = performance.now() - openingStarted;
const samples = [];
const presentation = { format: 'json', sourceDetail: false };
let first;
const run = (lens, selector = null, extra = {}) => {
  const started = performance.now();
  const result = opened.session.execute({ lens, selector, presentation, ...extra });
  samples.push({ lens, selector, sourceDetail: extra.presentation?.sourceDetail ?? false,
    milliseconds: performance.now() - started, memory: process.memoryUsage(), schema: result.view.schema,
    selection: result.view.projection.selection });
  return result;
};
const firstStarted = performance.now();
first = run('modules');
const selected = first.view.modules.find(item => item.handle === 'session') ?? first.view.modules[0];
run('inspect', selected.entityId, { reference: true });
const dependency = run('dependencies');
const subject = dependency.view.modules.find(item => item.handle === selected.handle) ?? dependency.view.modules[0];
const children = run('children', subject.entityId, { reference: true });
const child = children.view.modules.find(item => item.id !== subject.id) ?? subject;
run('parents', child.entityId, { reference: true });
run('inspect', selected.entityId, { reference: true, presentation: { ...presentation, sourceDetail: true } });
run('organization', null, { subject: 'project' });
const organization = run('organization', null, { subject: 'repository' });
const group = organization.view.groups.find(item => item.name === 'lib') ?? organization.view.groups[0];
if (group) run('inspect', group.entityId, { reference: true });
assert.deepEqual(run('modules'), first);
assert.deepEqual(run('dependencies'), dependency);
const journeyMs = performance.now() - firstStarted;
const live = await collect();
opened.session.close(); opened = undefined; first = undefined;
const closed = await collect();
const input = Object.assign(new PassThrough(), { isTTY: true });
const shellSamples = [];
let ready = false, shellOpenMs = 0, commandStarted = 0, currentCommand = '', shellSubject, shellChild;
const shellStarted = performance.now();
const submitLine = line => { currentCommand = line; commandStarted = performance.now(); input.write(line + '\n'); };
const shellExit = await runCli(['shell', '--project', configPath, '--json'], {
  cwd: process.cwd(), checkout: process.cwd(), input, stderr: () => {},
  stdout: text => {
    if (!ready && text.includes('postcode> ')) {
      ready = true; shellOpenMs = performance.now() - shellStarted;
      setImmediate(() => submitLine('modules'));
    }
  },
  sink: { async submit(batch) {
    const view = batch.records.find(record => record.kind === 'qualified-view')?.value;
    shellSamples.push({ command: currentCommand, milliseconds: performance.now() - commandStarted,
      rss: process.memoryUsage().rss, outcome: batch.records.find(record => record.kind === 'command-outcome')?.value.status });
    let next;
    if (batch.command === 1) { shellSubject = view.modules.find(item => item.handle === 'session') ?? view.modules[0]; next = `inspect @${shellSubject.entityId}`; }
    else if (batch.command === 2) next = 'dependencies';
    else if (batch.command === 3) next = `children @${shellSubject.entityId}`;
    else if (batch.command === 4) { shellChild = view.modules.find(item => item.id !== shellSubject.id) ?? shellSubject; next = `parents @${shellChild.entityId}`; }
    else if (batch.command === 5) next = `inspect @${shellSubject.entityId} --source-detail`;
    else if (batch.command === 6) next = 'organization project';
    else if (batch.command === 7) next = 'organization repository';
    else if (batch.command === 8) { const group = view.groups.find(item => item.name === 'lib') ?? view.groups[0]; next = `inspect @${group.entityId}`; }
    else if (batch.command === 9) next = 'modules';
    else if (batch.command === 10) next = 'dependencies';
    setImmediate(() => next ? submitLine(next) : input.end());
    return { accepted: true };
  } },
});
assert.equal(shellExit, 0);
const afterWorkerClose = await collect();
const report = { configPath, node: process.versions.node, gcAvailable: Boolean(global.gc), baseline, openingMs, samples, journeyMs, live, closed, shellOpenMs, shellSamples, afterWorkerClose,
  note: 'Executor measurements include its two validation passes but exclude publication checks, worker startup, prompt and sink delivery. Shell measurements include worker/prompt/publication checks through observation submission to a no-op sink; opening is separate. Earlier view objects remain referenced during the closed measurement; compiler/store release is inferred from heap changes, not RSS high-water marks.' };
if (output) writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

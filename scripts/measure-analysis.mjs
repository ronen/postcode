// One fresh-process CLI invocation with real local observation delivery.
// Usage: node [--cpu-prof --cpu-prof-dir=...] scripts/measure-analysis.mjs BUILD REPORT CLI_ARGS...
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
const [build, report, ...args] = process.argv.slice(2);
const root = process.cwd();
const startWall = Date.now(), startMono = performance.now(), startCpu = process.cpuUsage();
const conditions = { node: process.version, platform: process.platform, arch: process.arch,
  cpus: os.cpus().length, cpu: os.cpus()[0]?.model, loadBefore: os.loadavg(), freeMemoryBefore: os.freemem() };
const stages = {};
const stack = [];
globalThis.__analysisMeasure = (name, operation) => {
  const start = performance.now();
  const frame = { child: 0 }; stack.push(frame);
  try { return operation(); } finally {
    const elapsed = performance.now() - start;
    stack.pop(); if (stack.length) stack.at(-1).child += elapsed;
    const entry = stages[name] ??= { calls: 0, inclusiveMs: 0, exclusiveMs: 0 };
    entry.calls++; entry.inclusiveMs += elapsed; entry.exclusiveMs += elapsed - frame.child;
  }
};
const { runCli } = await import(pathToFileURL(path.resolve(build, 'src/lib/cli.js')));
const { localFileObservationSink } = await import(pathToFileURL(path.resolve(build, 'src/lib/observations.js')));
const sink = localFileObservationSink(path.join(root, '_observations'));
const output = createHash('sha256');
let outputBytes = 0, stderr = '', firstOutputMs = null, observationMs = 0;
const exitCode = await runCli(args, { cwd: root, checkout: root,
  stdout: text => { firstOutputMs ??= performance.now() - startMono; output.update(text); outputBytes += Buffer.byteLength(text); },
  stderr: text => { stderr += text; },
  sink: { async submit(batch) { const start = performance.now(); try { return await sink.submit(batch); } finally { observationMs += performance.now() - start; } } },
});
const monotonicMs = performance.now() - startMono, wallMs = Date.now() - startWall;
const result = { args, conditions: { ...conditions, loadAfter: os.loadavg(), freeMemoryAfter: os.freemem() },
  exitCode, wallMs, monotonicMs, wallMinusMonotonicMs: wallMs - monotonicMs, cpu: process.cpuUsage(startCpu),
  firstOutputMs, observationMs, stages, outputBytes, outputDigest: output.digest('hex'),
  warning: stderr.includes('WARNING'), disposition: Math.abs(wallMs - monotonicMs) > 1000 ? 'suspected-suspension' : 'unreviewed' };
writeFileSync(report, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ report, exitCode, wallMs, stages }));
process.exitCode = exitCode;

// Sequential paired fresh processes; no timing assertions belong in the test suite.
// Usage: node scripts/benchmark-analysis.mjs BEFORE_BUILD AFTER_BUILD OUTPUT_DIRECTORY [SAMPLES=3]
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
const [before, after, directory, count = '3'] = process.argv.slice(2);
if (!before || !after || !directory || !Number.isInteger(Number(count)) || Number(count) < 1) throw Error('Expected before, after, output directory and positive sample count');
mkdirSync(directory, { recursive: true });
const cases = [
  ['postcode-dependencies', ['dependencies', '--json']],
  ['postcode-organization', ['organization', 'repository']],
  ['fixture-dependencies', ['dependencies', '--json', '--project', 'fixtures/dependency-journey/tsconfig.json']],
  ['fixture-organization', ['organization', 'project', '--project', 'fixtures/dependency-journey/tsconfig.json']],
];
const runs = [];
const manifest = path.join(directory, 'runs.json');
if (existsSync(manifest)) throw Error('Refusing to overwrite an existing measurement series');
for (const [name, args] of cases) {
  for (let sample = 0; sample <= Number(count); sample++) {
    // Alternate order to reduce systematic before/after warm filesystem bias.
    const variants = sample % 2 ? [['after', after], ['before', before]] : [['before', before], ['after', after]];
    for (const [variant, build] of variants) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const id = `${name}-${variant}-${sample}-${attempt}`;
        const report = path.join(directory, id + '.json');
        const startWall = Date.now(), startMono = performance.now();
        let heartbeat = startMono, maximumHeartbeatGapMs = 0;
        const monitor = setInterval(() => { const now = performance.now(); maximumHeartbeatGapMs = Math.max(maximumHeartbeatGapMs, now - heartbeat); heartbeat = now; }, 250);
        let timedOut = false;
        const child = spawn(process.execPath, ['scripts/measure-analysis.mjs', build, report, ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
        let error = ''; child.stderr.on('data', chunk => { error += chunk; });
        const timeout = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, 120_000);
        const exit = await new Promise((resolve, reject) => { child.once('error', reject); child.once('close', (code, signal) => resolve({ code, signal })); });
        clearTimeout(timeout); clearInterval(monitor);
        const wallMs = Date.now() - startWall, monotonicMs = performance.now() - startMono;
        const measurement = existsSync(report) ? JSON.parse(readFileSync(report, 'utf8')) : null;
        const cpuRatio = measurement ? (measurement.cpu.user + measurement.cpu.system) / 1000 / measurement.monotonicMs : null;
        const reasons = [
          ...(timedOut ? ['timeout'] : []), ...(exit.code !== 0 ? ['process-failure'] : []),
          ...(!measurement || measurement.exitCode !== 0 || measurement.warning ? ['unsuccessful-cli-or-observation'] : []),
          ...(Math.abs(wallMs - monotonicMs) > 1000 || maximumHeartbeatGapMs > 2000 ? ['parent-suspension-or-contention'] : []),
          ...(measurement?.disposition === 'suspected-suspension' ? ['child-clock-divergence'] : []),
          ...(measurement && measurement.monotonicMs > 10_000 && cpuRatio < 0.6 ? ['low-cpu-wall-ratio'] : []),
        ];
        const disposition = reasons.length ? 'excluded-repeat' : sample === 0 ? 'warmup' : 'representative';
        if (measurement) { measurement.disposition = disposition; writeFileSync(report, JSON.stringify(measurement, null, 2) + '\n'); }
        const run = { id, name, variant, sample, attempt, wallMs, monotonicMs, maximumHeartbeatGapMs, cpuRatio, exit, disposition, reasons, error };
        runs.push(run); writeFileSync(manifest, JSON.stringify(runs, null, 2) + '\n');
        console.log(JSON.stringify(run));
        if (!reasons.length) break;
        if (attempt === 2) throw Error(`Incomplete measurement series: ${name} ${variant} sample ${sample} exhausted all 3 attempts. Retained attempts: ${manifest}`);
      }
    }
  }
}

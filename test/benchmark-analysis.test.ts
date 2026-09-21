import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

// Run the real series driver with deterministic measurement reports supplied by
// a child in an isolated working directory. No timing threshold is under test.
function runSeries(exclude: string, recover: boolean) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-benchmark-series-'));
  try {
    mkdirSync(path.join(root, 'scripts'));
    writeFileSync(path.join(root, 'scripts/measure-analysis.mjs'), `
      import { writeFileSync } from 'node:fs';
      import path from 'node:path';
      const report = process.argv[3];
      const id = path.basename(report, '.json');
      const excluded = id.startsWith(${JSON.stringify(exclude)})
        && (!${recover} || !id.endsWith('-2'));
      writeFileSync(report, JSON.stringify({ exitCode: 0, warning: false,
        monotonicMs: 1, cpu: { user: 1000, system: 0 },
        disposition: excluded ? 'suspected-suspension' : 'unreviewed' }));
    `);
    const output = path.join(root, 'results');
    const result = spawnSync(process.execPath, [path.resolve('scripts/benchmark-analysis.mjs'),
      'before', 'after', output, '1'], { cwd: root, encoding: 'utf8', timeout: 60_000 });
    assert.ifError(result.error);
    const runs = JSON.parse(readFileSync(path.join(output, 'runs.json'), 'utf8')) as {
      id: string; disposition: string; reasons: string[];
    }[];
    const reports = runs.map(run => JSON.parse(readFileSync(path.join(output, `${run.id}.json`), 'utf8')) as { disposition: string });
    return { result, runs, reports };
  } finally { rmSync(root, { recursive: true, force: true }); }
}

for (const [label, excluded, retained] of [
  ['warm-up', 'postcode-dependencies-before-0-', 3],
  ['representative', 'postcode-dependencies-after-1-', 5],
] as const) {
  test(`benchmark fails explicitly after exhausted ${label} retries and retains all attempts`, () => {
    const { result, runs, reports } = runSeries(excluded, false);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Incomplete measurement series:.*exhausted all 3 attempts/);
    assert.equal(runs.length, retained, 'later sample slots must not silently continue');
    const failures = runs.filter(run => run.id.startsWith(excluded));
    assert.equal(failures.length, 3);
    assert.deepEqual(failures.map(run => run.disposition), Array(3).fill('excluded-repeat'));
    assert.ok(failures.every(run => run.reasons.includes('child-clock-divergence')));
    assert.deepEqual(reports.map(report => report.disposition), runs.map(run => run.disposition));
  });
}

test('benchmark continues after a successful retry and completes every requested sample slot', () => {
  const { result, runs } = runSeries('postcode-dependencies-after-1-', true);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(runs.filter(run => run.disposition === 'excluded-repeat').length, 2);
  assert.equal(runs.filter(run => run.disposition === 'warmup').length, 8);
  assert.equal(runs.filter(run => run.disposition === 'representative').length, 8);
  assert.equal(new Set(runs.filter(run => run.disposition !== 'excluded-repeat')
    .map(run => run.id.replace(/-\d+$/, ''))).size, 16);
});

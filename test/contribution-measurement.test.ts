import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { temporaryDirectory } from './cli-helpers.js';

test('measurement refuses report parents with project inputs and preserves the journey with a dedicated output directory', t => {
  const root = temporaryDirectory(t, 'postcode-measurement-output-');
  const source = path.join(root, 'src'); mkdirSync(source);
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noLib: true, types: [] }, include: ['src/*.ts'] }));
  writeFileSync(path.join(source, 'entry.ts'), "export { value } from './value.js';\n");
  writeFileSync(path.join(source, 'value.ts'), 'export const value = 1;\n');
  execFileSync('git', ['init', '--quiet', root]);
  const build = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
  const args = [path.resolve('scripts/measure-contribution-session.mjs'), path.join(root, 'tsconfig.json'), build];
  for (const parent of [root, source]) {
    const output = path.join(parent, 'report.json');
    const result = spawnSync(process.execPath, [...args, output, '1'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /dedicated empty output directory/);
    assert.equal(existsSync(output), false);
  }
  const run = (output: string) => JSON.parse(execFileSync(process.execPath, [...args, output, '1'], { encoding: 'utf8', maxBuffer: 2_000_000 }));
  const baseline = run(''), output = path.join(root, '_measurement', 'report.json'), saved = run(output);
  assert.equal(saved.build.build, build);
  assert.equal(baseline.build.build, build);
  assert.equal(saved.modules, 2);
  assert.equal(saved.modules, baseline.modules);
  assert.deepEqual(saved.application.samples.map((sample: { answer: string }) => sample.answer), baseline.application.samples.map((sample: { answer: string }) => sample.answer));
  assert.equal(saved.application.repeatedAnswersEqual, true);
  assert.equal(saved.dialogs.count, 1);
  assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')), saved);
});

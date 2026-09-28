import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, mkdirSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { runCli } from '../src/lib/cli.js';
import { outputBoundary, OutputBoundaryFailure } from '../src/lib/output-boundary.js';
import { openSession, SessionInvalidated } from '../src/lib/session.js';
import { temporaryDirectory } from './cli-helpers.js';
import { invokeCli } from './cli-helpers.js';

test('one output policy resolves aliases, dangling targets and missing descendants without duplicate boundary counts', t => {
  const root = temporaryDirectory(t, 'postcode-output-policy-');
  const physical = path.join(root, 'physical'); mkdirSync(physical);
  if (existsSync(path.join(root, 'PHYSICAL'))) {
    assert.equal(outputBoundary([physical, path.join(root, 'PHYSICAL')]).count, 1);
  }
  const alias = path.join(root, 'alias'); symlinkSync(physical, alias);
  const dangling = path.join(root, 'dangling'); symlinkSync(path.join(physical, 'missing'), dangling);
  const first = path.join(alias, 'missing/deep');
  const policy = outputBoundary([first, path.join(dangling, 'deep'), first]);
  assert.equal(policy.count, 1);
  assert.equal(policy.excluded(path.join(physical, 'missing/deep/file.ts')), true);
  assert.equal(policy.excluded(path.join(dangling, 'deep/file.ts')), true);
  assert.equal(policy.excluded(path.join(physical, 'missing/deeper/file.ts')), false);
  assert.equal(policy.changed(), false);
  mkdirSync(path.join(root, 'target/nested'), { recursive: true });
  symlinkSync(path.join(root, 'target/nested'), path.join(physical, 'redirect'));
  const indirect = path.join(root, 'indirect');
  symlinkSync('physical/redirect/../output', indirect);
  assert.equal(outputBoundary([indirect]).excluded(path.join(root, 'target/output/file.ts')), true);
  assert.equal(outputBoundary([indirect]).excluded(path.join(physical, 'output/file.ts')), false);
  unlinkSync(alias); symlinkSync(path.join(root, 'other'), alias);
  assert.equal(policy.changed(), true);
});

test('unverifiable explicit boundaries refuse both CLI entry paths and later retargeting invalidates', async t => {
  const root = temporaryDirectory(t, 'postcode-boundary-refusal-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":[]}');
  const output = path.join(root, '_observations'); symlinkSync(output, output);
  assert.throws(() => outputBoundary([output]), OutputBoundaryFailure);
  const refused = await openSession({ configPath, excludedOutputDirectories: [output] });
  assert.equal(refused.status, 'project-open-failed');
  assert.equal(refused.operational?.operation, 'resolve generated-output boundary');
  const cli = await invokeCli(['--project', configPath], { checkout: root });
  assert.equal(cli.exit, 2); assert.equal(cli.stdout, ''); assert.deepEqual(cli.batches, []);
  assert.match(cli.stderr, /Project open failed:\n  resolve generated-output boundary/);
  assert.doesNotMatch(cli.stderr, /TS\d/);
  let shellError = '', shellOutput = '';
  const shell = await runCli(['shell', '--project', configPath], { cwd: root, checkout: root,
    input: Object.assign(new PassThrough(), { isTTY: true }), stdout: text => { shellOutput += text; }, stderr: text => { shellError += text; },
    sink: { async submit() { assert.fail('Opening refusal must not produce a view observation'); } },
  });
  assert.equal(shell, 2); assert.equal(shellOutput, '');
  assert.match(shellError, /Project open failed:\n  resolve generated-output boundary/);
  unlinkSync(output); symlinkSync(path.join(root, 'first'), output);
  const options = { configPath, excludedOutputDirectories: [output] };
  const opening = openSession(options); options.excludedOutputDirectories.length = 0;
  const opened = await opening;
  assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
  t.after(() => opened.session.close());
  await opened.session.check();
  unlinkSync(output); symlinkSync(output, output);
  await assert.rejects(opened.session.check(), SessionInvalidated);
});

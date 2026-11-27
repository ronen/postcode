import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chmodSync, existsSync, mkdirSync, readdirSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { outputBoundary, OutputBoundaryFailure } from '../src/lib/output-boundary.js';
import { openApplication as openSession, SessionInvalidated } from '../src/lib/application/index.js';
import { temporaryDirectory } from './temporary-directory.js';

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

test('unverifiable explicit boundaries refuse direct application opening and later retargeting invalidates', async t => {
  const root = temporaryDirectory(t, 'postcode-boundary-refusal-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":[]}');
  const output = path.join(root, '_observations'); symlinkSync(output, output);
  assert.throws(() => outputBoundary([output]), OutputBoundaryFailure);
  const refused = await openSession({ configPath, excludedOutputDirectories: [output] });
  assert.equal(refused.status, 'project-open-failed');
  assert.equal(refused.operational?.operation, 'resolve generated-output boundary');
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

test('resolvable output boundaries need search permission but not directory-listing permission', async t => {
  const root = temporaryDirectory(t, 'postcode-searchable-output-');
  const hidden = path.join(root, 'hidden');
  const output = path.join(hidden, 'out'); mkdirSync(output, { recursive: true });
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":[]}');
  chmodSync(hidden, 0o311);
  try {
    assert.throws(() => readdirSync(hidden), { code: 'EACCES' });
    const policy = outputBoundary([output]);
    assert.equal(policy.count, 1);
    assert.equal(policy.excluded(path.join(output, 'generated.ts')), true);
    assert.equal(policy.changed(), false);
    const opened = await openSession({ configPath, excludedOutputDirectories: [output] });
    assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
    try { await opened.session.check(); }
    finally { await opened.session.close(); }
  } finally { chmodSync(hidden, 0o700); }
});

test('missing output suffixes follow observed filesystem case handling before and after materialization', async t => {
  const { captureInputs } = await import('../src/lib/typescript/inputs.js');
  const { captureRepository } = await import('../src/lib/repository/capture.js');
  const { execFileSync } = await import('node:child_process');
  const root = temporaryDirectory(t, 'postcode-missing-case-');
  execFileSync('git', ['init', '--quiet', root]);
  mkdirSync(path.join(root, 'CaseProbe'));
  const insensitive = existsSync(path.join(root, 'caseprobe'));
  const upper = path.join(root, 'GENERATED/deep');
  const lower = path.join(root, 'generated/deep');
  const policy = outputBoundary([upper]);
  assert.equal(outputBoundary([upper, lower]).count, insensitive ? 1 : 2);
  assert.equal(policy.excluded(path.join(lower, 'file.ts')), insensitive);
  assert.equal(policy.excluded(path.join(root, 'generated/deeper/file.ts')), false);
  const inputs = captureInputs(policy);
  mkdirSync(lower, { recursive: true });
  const file = path.join(lower, 'file.ts'); writeFileSync(file, 'export const generated = true;');
  assert.equal(policy.excluded(file), insensitive);
  assert.equal(inputs.system.readFile(file), insensitive ? undefined : 'export const generated = true;');
  assert.equal(policy.changed(), false);
  const capture = await captureRepository(path.join(root, 'tsconfig.json'), policy);
  assert.equal(capture.status, 'available'); if (capture.status !== 'available') return;
  assert.equal(capture.evidence.artifacts.some(item => item.path === 'generated/deep/file.ts'), !insensitive);
});

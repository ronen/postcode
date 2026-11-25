import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EventEmitter, once } from 'node:events';
import { PassThrough } from 'node:stream';
import { spawn } from 'node:child_process';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { GitExecutionOwner, executionLimits } from '../src/lib/git-execution.js';
import { CleanupIncomplete, GitFailure } from '../src/lib/execution-errors.js';
import { openApplication as openSession, SessionInvalidated } from '../src/lib/application/index.js';
import { captureRepository } from '../src/lib/repository/capture.js';
import { temporaryDirectory } from './temporary-directory.js';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const limits = { gitDeadlineMs: 2000, terminationGraceMs: 30, cleanupDeadlineMs: 500 };
const request = { cwd: process.cwd(), args: ['--version'] };

function childHarness() {
  let ready!: () => void;
  let failed!: (error: Error) => void;
  const readiness = new Promise<void>((resolve, reject) => { ready = resolve; failed = reject; });
  // A child that exits before readiness must fail the waiter, not strand it.
  void readiness.catch(() => {});
  let child!: ChildProcessWithoutNullStreams;
  const start = () => {
    child = spawn(process.execPath, ['-e', "process.on('SIGTERM',()=>{});process.stdout.write('ready');setInterval(()=>{},1000)"], { stdio: 'pipe' });
    const exited = () => failed(new Error('Controlled child exited before readiness'));
    child.once('exit', exited);
    child.once('error', failed);
    child.stdout.once('data', () => {
      child.removeListener('exit', exited);
      child.removeListener('error', failed);
      ready();
    });
    return child;
  };
  return { start, readiness, get child() { return child; } };
}

test('Git owner enforces its per-call deadline, escalates, and confirms actual exit', { timeout: 10000 }, async t => {
  assert.deepEqual(executionLimits, { gitDeadlineMs: 30000, terminationGraceMs: 250, cleanupDeadlineMs: 2000, outputBytes: 64 * 1024 * 1024 });
  const harness = childHarness();
  const owner = new GitExecutionOwner({ limits: { ...limits, gitDeadlineMs: 300 }, spawn: () => harness.child });
  t.after(async () => { harness.child?.kill('SIGKILL'); await owner.close(); });
  harness.start();
  // Escalation requires an installed SIGTERM handler. OS startup time is not
  // part of this fixture's controlled deadline; pre-readiness expiry is below.
  await harness.readiness;
  const exited = once(harness.child, 'exit');
  const outcome = owner.run(request);
  const rejected = assert.rejects(outcome, error => error instanceof GitFailure && error.code === 'ETIMEDOUT');
  await rejected;
  const [code, signal] = await exited;
  assert.equal(code, null); assert.equal(signal, 'SIGKILL');
  assert.equal(owner.ownedChildren, 0);
});

test('Git deadline settles and releases a child that never announces readiness', { timeout: 10000 }, async t => {
  const child = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { stdio: 'pipe' });
  const owner = new GitExecutionOwner({ limits: { ...limits, gitDeadlineMs: 30 }, spawn: () => child });
  t.after(async () => { child.kill('SIGKILL'); await owner.close(); });
  const exited = once(child, 'exit');
  let announced = false;
  child.stdout.on('data', () => { announced = true; });
  await assert.rejects(owner.run(request), error => error instanceof GitFailure && error.code === 'ETIMEDOUT');
  const [code, signal] = await exited;
  assert.equal(code, null);
  assert.ok(signal === 'SIGTERM' || signal === 'SIGKILL');
  assert.equal(announced, false);
  assert.equal(owner.ownedChildren, 0);
  await owner.close();
});

test('child readiness rejects when exit precedes its announcement', async t => {
  const harness = childHarness();
  t.after(() => { harness.child?.kill('SIGKILL'); });
  const rejected = assert.rejects(harness.readiness, /exited before readiness/);
  harness.start().kill('SIGKILL');
  await rejected;
});

test('unconfirmed Git cleanup reports the resource and retains exit ownership', async () => {
  const fake = Object.assign(new EventEmitter(), { pid: 12345, stdin: new PassThrough(), stdout: new PassThrough(), stderr: new PassThrough(),
    kill() { throw new Error('Controlled unavailable termination'); } });
  const owner = new GitExecutionOwner({ spawn: () => fake as unknown as ChildProcessWithoutNullStreams,
    limits: { ...limits, gitDeadlineMs: 10, cleanupDeadlineMs: 40, terminationGraceMs: 5 } });
  await assert.rejects(owner.run(request), error => error instanceof CleanupIncomplete && error.resource.includes('12345'));
  assert.equal(owner.ownedChildren, 1);
  await assert.rejects(owner.run(request), CleanupIncomplete);
  await assert.rejects(owner.close(), CleanupIncomplete);
  fake.emit('exit', null, 'SIGKILL'); fake.emit('close', null, 'SIGKILL');
  assert.equal(owner.ownedChildren, 0);
});

test('opening timeout is qualified unavailability; recovery or loss invalidates, consistent unavailability remains', async t => {
  const root = temporaryDirectory(t, 'postcode-timeout-basis-');
  execFileSync('git', ['init', '--quiet', root]);
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":[]}');
  const owner = new GitExecutionOwner();
  t.after(() => owner.close());
  let timedOut = true, cleanupFailed = false;
  const runGit: typeof owner.run = req => cleanupFailed ? Promise.reject(new CleanupIncomplete('controlled Git child'))
    : timedOut ? Promise.reject(new GitFailure(`git ${req.args[0]} timeout`, 'ETIMEDOUT')) : owner.run(req);
  const unavailable = await captureRepository(configPath, [], runGit);
  assert.deepEqual(unavailable, { status: 'unavailable', reason: 'capture-failed', operation: 'git rev-parse timeout', code: 'ETIMEDOUT' });
  const first = await openSession({ configPath }, { runGit });
  assert.equal(first.status, 'opened'); if (first.status !== 'opened') return;
  t.after(() => first.session.close());
  await first.session.check();
  timedOut = false;
  await assert.rejects(first.session.check(), SessionInvalidated);
  const second = await openSession({ configPath }, { runGit });
  assert.equal(second.status, 'opened'); if (second.status !== 'opened') return;
  t.after(() => second.session.close());
  timedOut = true;
  await assert.rejects(second.session.check(), SessionInvalidated);
  timedOut = false;
  const third = await openSession({ configPath }, { runGit });
  assert.equal(third.status, 'opened'); if (third.status !== 'opened') return;
  t.after(() => third.session.close());
  cleanupFailed = true;
  await assert.rejects(third.session.check(), SessionInvalidated);
  await assert.rejects(openSession({ configPath }, { runGit: async () => { throw new CleanupIncomplete('controlled Git child'); } }), CleanupIncomplete);
});

test('Git output limits wait for exit and sanitized invocation context stays local', async () => {
  let seen: NodeJS.ProcessEnv | undefined;
  const fake = Object.assign(new EventEmitter(), { pid: 24680, stdin: new PassThrough(), stdout: new PassThrough(), stderr: new PassThrough(),
    kill() { setImmediate(() => { fake.emit('exit', null, 'SIGTERM'); fake.emit('close', null, 'SIGTERM'); }); return true; } });
  const owner = new GitExecutionOwner({ limits: { ...limits, outputBytes: 4 }, spawn: (_, env) => { seen = env; return fake as unknown as ChildProcessWithoutNullStreams; } });
  const result = owner.run(request);
  const rejected = assert.rejects(result, error => error instanceof GitFailure && error.code === 'ENOBUFS');
  assert.equal(seen!.LC_ALL, 'C'); assert.equal(seen!.GIT_OPTIONAL_LOCKS, '0');
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_PREFIX']) assert.equal(seen![key], undefined);
  fake.stdout.write('123'); fake.stderr.write('45');
  await rejected;
  assert.equal(owner.ownedChildren, 0);
  await owner.close();
});

test('failed Git spawn has no child to reap; unexpected defects stay distinct', async () => {
  const missing = new GitExecutionOwner({ spawn: () => { throw Object.assign(new Error('missing'), { code: 'ENOENT' }); } });
  await assert.rejects(missing.run(request), error => error instanceof GitFailure && error.code === 'ENOENT');
  assert.equal(missing.ownedChildren, 0); await missing.close();
  const defect = new GitExecutionOwner({ spawn: () => { throw new Error('controlled defect'); } });
  await assert.rejects(defect.run(request), error => !(error instanceof GitFailure) && error instanceof Error && error.message === 'controlled defect');
  await defect.close();
});

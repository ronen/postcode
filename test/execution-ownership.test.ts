import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EventEmitter, once } from 'node:events';
import { PassThrough } from 'node:stream';
import { spawn } from 'node:child_process';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import type { Worker } from 'node:worker_threads';
import { GitExecutionOwner, executionLimits } from '../src/lib/git-execution.js';
import { CleanupIncomplete, CommandInterrupted, GitFailure, SessionClosed } from '../src/lib/execution-errors.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { openSession, SessionInvalidated } from '../src/lib/session.js';
import { captureRepository } from '../src/lib/repository/capture.js';
import { temporaryDirectory } from './cli-helpers.js';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const limits = { gitDeadlineMs: 2000, terminationGraceMs: 30, cleanupDeadlineMs: 500 };
const request = { cwd: process.cwd(), args: ['--version'] };
const command = { lens: 'modules' as const, selector: null, presentation: { format: 'json' as const, sourceDetail: false } };

function childHarness() {
  let ready!: () => void;
  const readiness = new Promise<void>(resolve => { ready = resolve; });
  let child!: ChildProcessWithoutNullStreams;
  const start = () => {
    child = spawn(process.execPath, ['-e', "process.on('SIGTERM',()=>{});process.stdout.write('ready');setInterval(()=>{},1000)"], { stdio: 'pipe' });
    child.stdout.once('data', ready);
    return child;
  };
  return { start, readiness, get child() { return child; } };
}

test('Git owner enforces its per-call deadline, escalates, and confirms actual exit', { timeout: 10000 }, async t => {
  assert.deepEqual(executionLimits, { gitDeadlineMs: 30000, terminationGraceMs: 250, cleanupDeadlineMs: 2000, outputBytes: 64 * 1024 * 1024 });
  const harness = childHarness();
  const owner = new GitExecutionOwner({ limits: { ...limits, gitDeadlineMs: 300 }, spawn: harness.start });
  t.after(async () => { harness.child.kill('SIGKILL'); await owner.close(); });
  const outcome = owner.run(request);
  const rejected = assert.rejects(outcome, error => error instanceof GitFailure && error.code === 'ETIMEDOUT');
  await harness.readiness;
  const exited = once(harness.child, 'exit');
  await rejected;
  const [code, signal] = await exited;
  assert.equal(code, null); assert.equal(signal, 'SIGKILL');
  assert.equal(owner.ownedChildren, 0);
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

for (const phase of ['opening', 'validation'] as const) {
  test(`worker interruption owns Git through ${phase} and prevents later work`, { timeout: 10000 }, async t => {
    const harness = childHarness();
    let block = phase === 'opening';
    const owner = new GitExecutionOwner({ limits, spawn: (req, env) => block ? harness.start()
      : spawn('git', ['-C', req.cwd, ...req.args], { env, stdio: 'pipe' }) });
    const remote = interactiveSession({ configPath: 'fixtures/empty/tsconfig.json' }, { git: owner });
    t.after(async () => { harness.child?.kill('SIGKILL'); await remote.close(); });
    let operation: Promise<unknown> = remote.opening;
    if (phase === 'validation') {
      assert.equal((await remote.opening).status, 'opened');
      block = true; operation = remote.check();
    }
    const rejected = assert.rejects(operation, CommandInterrupted);
    await harness.readiness;
    const exited = once(harness.child, 'exit');
    await remote.interrupt();
    await rejected; await exited;
    assert.equal(owner.ownedChildren, 0);
    await assert.rejects(remote.execute(command), CommandInterrupted);
  });
}

test('unexpected worker exit cancels outstanding Git independently', { timeout: 10000 }, async t => {
  const harness = childHarness();
  const owner = new GitExecutionOwner({ limits, spawn: harness.start });
  const worker = Object.assign(new EventEmitter(), { postMessage() {}, async terminate() { return 0; } });
  const remote = interactiveSession({ configPath: 'unused' }, { worker: worker as unknown as Worker, git: owner });
  t.after(async () => { harness.child?.kill('SIGKILL'); await remote.close(); });
  const rejected = assert.rejects(remote.opening, /exited unexpectedly/);
  worker.emit('message', { type: 'git', operation: 0, id: 1, request });
  await harness.readiness;
  worker.emit('exit', 1);
  await rejected; await remote.close();
  assert.equal(owner.ownedChildren, 0);
});

for (const failure of ['send', 'close', 'late'] as const) {
  test(`worker ${failure} settles once without phantom pending operations`, async () => {
    let sent: { operation: number } | undefined;
    const worker = Object.assign(new EventEmitter(), {
      postMessage(message: { operation: number }) { if (failure === 'send') throw new Error('Controlled send failure'); sent = message; },
      async terminate() { return 0; },
    });
    const remote = interactiveSession({ configPath: 'unused' }, { worker: worker as unknown as Worker });
    worker.emit('message', { type: 'reply', operation: 0, opening: { status: 'opened', id: 'session:test' } });
    await remote.opening;
    const pending = remote.check();
    if (failure === 'send') await assert.rejects(pending, /send failure/);
    else if (failure === 'close') {
      const rejected = assert.rejects(pending, SessionClosed);
      await remote.close(); await rejected;
    } else {
      let complete = false; void pending.then(() => { complete = true; });
      worker.emit('message', { type: 'reply', operation: 0 });
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(complete, false);
      worker.emit('message', { type: 'reply', operation: sent!.operation });
      await pending;
    }
    await remote.close();
    worker.emit('message', { type: 'reply', operation: 999 });
    await assert.rejects(remote.check(), SessionClosed);
  });
}

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

test('interrupted publication settles at 130 while cleanup failure is reported separately', async () => {
  const { publishCommand } = await import('../src/lib/command-execution.js');
  const fake = Object.assign(new EventEmitter(), { pid: 98765, stdin: new PassThrough(), stdout: new PassThrough(), stderr: new PassThrough(), kill() { return false; } });
  const git = new GitExecutionOwner({ spawn: () => fake as unknown as ChildProcessWithoutNullStreams,
    limits: { ...limits, terminationGraceMs: 5, cleanupDeadlineMs: 20 } });
  let operation = 0;
  const worker = Object.assign(new EventEmitter(), { postMessage(message: { operation: number }) { operation = message.operation; }, async terminate() { return 0; } });
  const remote = interactiveSession({ configPath: 'unused' }, { worker: worker as unknown as Worker, git });
  worker.emit('message', { type: 'reply', operation: 0, opening: { status: 'opened', id: 'session:test' } });
  await remote.opening;
  let output = '', error = '', status: unknown;
  const published = publishCommand({ id: 'session:test', execute: remote.execute, check: remote.check }, command, 'modules', 'unused', 1,
    { stdout: text => { output += text; }, stderr: text => { error += text; } },
    { async submit(batch) { status = batch.records.find(record => record.kind === 'command-outcome')!.value; return { accepted: true }; } });
  worker.emit('message', { type: 'git', operation, id: 1, request });
  await assert.rejects(remote.interrupt(), /Cleanup incomplete.*98765/);
  assert.equal(await published, 130); assert.equal(output, ''); assert.match(error, /interrupted/);
  assert.equal((status as { status: string }).status, 'interrupted');
  assert.equal(git.ownedChildren, 1);
  fake.emit('exit', null, 'SIGKILL'); fake.emit('close', null, 'SIGKILL');
  assert.equal(git.ownedChildren, 0);
});

test('worker cleanup reporting is bounded without claiming worker exit', async () => {
  let exit!: (code: number) => void;
  const worker = Object.assign(new EventEmitter(), { postMessage() {}, terminate: () => new Promise<number>(resolve => { exit = resolve; }) });
  const remote = interactiveSession({ configPath: 'unused' }, { worker: worker as unknown as Worker, cleanupDeadlineMs: 20 });
  const opening = assert.rejects(remote.opening, SessionClosed);
  await assert.rejects(remote.close(), /Cleanup incomplete.*analysis worker/);
  await opening;
  exit(0); worker.emit('exit', 0);
  await assert.rejects(remote.execute(command), SessionClosed);
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

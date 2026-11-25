import childProcess from 'node:child_process';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { GitExecutionOwner } from '../src/lib/git-execution.js';
import type { GitResult } from '../src/lib/git-execution.js';
import { CleanupIncomplete, SessionInvalidated, SessionClosed, SessionBusy } from '../src/lib/application/index.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { openApplication, CommandInterrupted, SessionShutdownError } from '../src/lib/application/index.js';
import type { ApplicationSession, InvestigatorAgent } from '../src/lib/application/index.js';
import type { DialogReply } from '../src/lib/contributions/dialog.js';
import type { ReportedUsage } from '../src/lib/investigation/contracts.js';

const identity = { provider: 'postcode-test', model: 'shutdown', configuration: {}, origin: 'scripted' as const };
const request = { kind: 'lens' as const, lens: 'summarize', designation: { kind: 'name' as const, value: 'gate' } };
const tick = () => new Promise<void>(resolve => setImmediate(resolve));
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
function fixture(t: { after(fn: () => void): void }) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-shutdown-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["gate.ts"]}');
  writeFileSync(path.join(root, 'gate.ts'), 'export const gate = 1;\n');
  return { configPath: path.join(root, 'tsconfig.json') };
}
function sessionOf(opened: Awaited<ReturnType<typeof openApplication>>): ApplicationSession {
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Opening failed');
  return opened.session;
}
const measurement: ReportedUsage = { source: 'provider', categories: [{ category: 'input', unit: 'tokens', value: 7, includedIn: null }] };
for (const route of ['interrupt', 'signal', 'close'] as const) for (const failure of ['none', 'cleanup', 'report', 'both'] as const) {
  test(`${route}: interrupted dialog retains accounting with ${failure} failure`, async t => {
    const entered = deferred<void>(), reply = deferred<DialogReply>(), controller = new AbortController();
    let closeCount = 0, lateUsage!: (value: ReportedUsage) => void;
    const cleanup = new Error('participant cleanup'), reporting = new Error('attempt notification');
    const agent: InvestigatorAgent = { identity, open: () => ({
      exchange: (_input, _signal, usage) => { lateUsage = usage; usage(measurement); entered.resolve(); return reply.promise; },
      close: () => { closeCount++; if (failure === 'cleanup' || failure === 'both') throw cleanup; },
    }) };
    const session = sessionOf(await openApplication(fixture(t), { signal: controller.signal, investigation: { dialogAgent: agent,
      onReport: () => { if (failure === 'report' || failure === 'both') throw reporting; } } }));
    const pending = session.execute(request), requestRejected = assert.rejects(pending, CommandInterrupted);
    await entered.promise;
    const shutdown = route === 'signal' ? (controller.abort(), undefined) : session[route]();
    // Observe explicit promises immediately; signal-only failures must be internally handled.
    const assessment = shutdown?.then(() => null, error => error);
    await requestRejected;
    assert.equal(session.work()?.status, 'interrupted');
    assert.equal(session.usage().attempts.length, 1);
    assert.equal(session.usage().attempts[0]!.termination, 'interrupted');
    const before = session.usage();
    lateUsage({ ...measurement, categories: [{ category: 'input', unit: 'tokens', value: 99, includedIn: null }] });
    reply.resolve({ kind: 'refused' });
    await tick();
    assert.deepEqual(session.usage(), before);
    const outcome = await (assessment ?? session.close().then(() => null, error => error));
    if (failure === 'none') assert.equal(outcome, null);
    else {
      assert.ok(outcome instanceof SessionShutdownError);
      assert.deepEqual(outcome.failures.map(item => item.phase), failure === 'both' ? ['participant-cleanup', 'attempt-report'] : [failure === 'cleanup' ? 'participant-cleanup' : 'attempt-report']);
      assert.deepEqual(outcome.errors, failure === 'both' ? [cleanup, reporting] : [failure === 'cleanup' ? cleanup : reporting]);
    }
    for (const again of [session.interrupt(), session.close(), session.close()]) {
      assert.equal(await again.then(() => null, error => error), outcome);
    }
    assert.equal(closeCount, 1);
    await assert.rejects(session.execute(request), CommandInterrupted);
  });
}
for (const route of ['interrupt', 'signal', 'close'] as const) {
  test(`${route}: non-dialog agent selection stops cooperatively and rejects late opening`, async t => {
    const entered = deferred<void>(), selected = deferred<InvestigatorAgent>(), controller = new AbortController();
    let opened = 0;
    const agent: InvestigatorAgent = { identity, open() { opened++; throw new Error('late open'); } };
    const session = sessionOf(await openApplication(fixture(t), { signal: controller.signal,
      investigation: { selectDialogAgent: () => { entered.resolve(); return selected.promise; } },
      onWork: progress => { if (progress.kind === 'finish') throw new Error('work report'); } }));
    const rejected = assert.rejects(session.execute(request), CommandInterrupted);
    await entered.promise;
    const shutdown = route === 'signal' ? (controller.abort(), undefined) : session[route]();
    const assessed = shutdown?.catch(error => error);
    await rejected;
    assert.equal(session.work()?.status, 'interrupted');
    assert.equal(session.usage().attempts.length, 0);
    const outcome = await (assessed ?? session.close().catch(error => error));
    assert.ok(outcome instanceof SessionShutdownError);
    assert.deepEqual(outcome.failures.map(item => item.phase), ['work-report']);
    selected.resolve(agent); await tick();
    assert.equal(opened, 0);
  });
}
for (const failure of ['cleanup', 'report'] as const) {
  test(`ordinary ${failure} failure belongs to its request; idle close remains clean`, async t => {
    const expected = new Error(failure);
    const session = sessionOf(await openApplication(fixture(t), { investigation: {
      dialogAgent: { identity, open: () => ({ exchange: async () => ({ kind: 'refused' }), close() { if (failure === 'cleanup') throw expected; } }) },
      onReport() { if (failure === 'report') throw expected; },
    } }));
    await assert.rejects(session.execute(request), error => error === expected);
    assert.equal(session.usage().attempts[0]!.termination, 'investigation-failure');
    await session.close(); await session.interrupt();
  });
}
test('completed work is not relabelled by a subsequent abort', async t => {
  const session = sessionOf(await openApplication(fixture(t)));
  const result = await session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } });
  assert.equal(result.attribution.status, 'completed');
  const before = session.work();
  await session.interrupt(); await session.close();
  assert.deepEqual(session.work(), before);
});

// Exercise owned resource failure through the direct Session, retaining the real Git owner.
// Only process creation is substituted to control exit and termination observations.


for (const route of ['interrupt', 'signal', 'close'] as const) {
  test(`${route}: Git cleanup deadline preserves ownership, interruption and simultaneous finalizer failures`, async t => {
    const entered = deferred<void>(), controller = new AbortController(), signals: string[] = [];
    let block = false, owner: GitExecutionOwner | undefined;
    const fake = Object.assign(new EventEmitter(), { pid: 98765, stdin: new PassThrough(), stdout: new PassThrough(), stderr: new PassThrough(),
      kill(signal: string) { signals.push(signal); return false; } });
    const spawn = childProcess.spawn, close = GitExecutionOwner.prototype.close;
    t.mock.method(childProcess, 'spawn', (...args: Parameters<typeof spawn>) => {
      if (!block) return spawn(...args);
      entered.resolve(); return fake as unknown as ChildProcessWithoutNullStreams;
    });
    syncBuiltinESMExports();
    t.mock.method(GitExecutionOwner.prototype, 'close', function(this: GitExecutionOwner, reason?: Error) {
      owner = this; return close.call(this, reason);
    });
    t.after(() => { fake.emit('exit', null, 'SIGKILL'); fake.emit('close', null, 'SIGKILL'); t.mock.restoreAll(); syncBuiltinESMExports(); });
    const session = sessionOf(await openApplication(fixture(t), { signal: controller.signal, investigation: {
      dialogAgent: { identity, open: () => ({ exchange: async () => { block = true; return { kind: 'tools', requests: [{ kind: 'modules' }] }; }, close() { throw new Error('close participant'); } }) },
      onReport() { throw new Error('report attempt'); },
    } }));
    const rejected = assert.rejects(session.execute(request), CommandInterrupted);
    await entered.promise;
    const shutdown = route === 'signal' ? (controller.abort(), new Promise<void>(resolve => setTimeout(resolve, 2100)).then(() => session.close())) : session[route]();
    let assessed = false;
    const result = shutdown.then(() => null, error => error).finally(() => { assessed = true; });
    await rejected;
    assert.equal(assessed, false, 'Request settlement must not await resource exit assessment');
    assert.equal(session.work()?.status, 'interrupted');
    assert.equal(session.usage().attempts[0]!.termination, 'interrupted');
    const failure = await result;
    assert.ok(failure instanceof SessionShutdownError);
    assert.deepEqual(new Set(failure.failures.map(item => item.phase)), new Set(['participant-cleanup', 'attempt-report', 'resource-cleanup']));
    assert.ok(failure.failures.find(item => item.phase === 'resource-cleanup')!.cause instanceof CleanupIncomplete);
    assert.equal(owner!.ownedChildren, 1);
    assert.deepEqual(signals, process.platform === 'win32' ? ['SIGKILL'] : ['SIGTERM', 'SIGKILL']);
    fake.emit('exit', null, 'SIGKILL'); fake.emit('close', null, 'SIGKILL');
    assert.equal(owner!.ownedChildren, 0);
    assert.equal(await session.close().catch(error => error), failure);
  });
}

for (const route of ['interrupt', 'signal', 'close'] as const) {
  test(`${route}: injected Git remains caller-owned and late validation cannot complete work`, async t => {
    const entered = deferred<void>(), result = deferred<GitResult>(), controller = new AbortController();
    const unavailable: GitResult = { status: 128, signal: null, stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
    let block = false;
    const session = sessionOf(await openApplication(fixture(t), { signal: controller.signal,
      runGit: async () => { if (!block) return unavailable; entered.resolve(); return result.promise; } }));
    block = true;
    const rejected = assert.rejects(session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } }), CommandInterrupted);
    await entered.promise;
    if (route === 'signal') controller.abort(); else await session[route]();
    await rejected; await session.close();
    const work = session.work(); assert.equal(work?.status, 'interrupted');
    result.resolve(unavailable); await tick(); assert.deepEqual(session.work(), work);
  });
}

test('an accepted producing attempt retains acceptance when final request validation is aborted', async t => {
  const entered = deferred<void>(), result = deferred<GitResult>();
  const unavailable: GitResult = { status: 128, signal: null, stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
  let block = false;
  const session = sessionOf(await openApplication(fixture(t), {
    runGit: async () => { if (!block) return unavailable; entered.resolve(); return result.promise; },
    investigation: { dialogAgent: { identity, open: () => ({ close() {}, exchange: async input => ({ kind: 'submit', contribution: {
      investigrams: [{ key: 'a', qualification: { limitations: ['Controlled interpretation.'] }, items: [{ key: 'p', type: 'prose', body: { text: 'A gate.' } }],
        declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [{ kind: 'item', item: { investigram: { local: 'a' }, item: 'p' } }] }] }],
    } }) }) }, onReport: () => { block = true; } },
  }));
  const rejected = assert.rejects(session.execute(request), CommandInterrupted);
  await entered.promise; await session.interrupt(); await rejected;
  assert.equal(session.work()?.status, 'interrupted');
  assert.equal(session.usage().attempts[0]!.termination, 'accepted');
  result.resolve(unavailable); await session.close();
});

for (const first of ['invalidation', 'abort'] as const) test(`first established ${first} remains the terminal cause`, async t => {
  const f = fixture(t), session = sessionOf(await openApplication(f));
  writeFileSync(path.join(path.dirname(f.configPath), 'gate.ts'), 'export const changed = 2;\n');
  if (first === 'invalidation') await assert.rejects(session.check(), SessionInvalidated);
  await session.interrupt(); await session.close();
  await assert.rejects(session.execute(request), first === 'invalidation' ? SessionInvalidated : CommandInterrupted);
});

test('reentrant shutdown observers share one assessment and participant cleanup', async t => {
  const entered = deferred<void>(), reply = deferred<DialogReply>();
  let session!: ApplicationSession, nested: Promise<void> | undefined, closed = 0;
  session = sessionOf(await openApplication(fixture(t), { investigation: { dialogAgent: { identity, open: () => ({
    exchange: (_input, signal) => { signal.addEventListener('abort', () => { nested = session.close(); }); entered.resolve(); return reply.promise; },
    close: () => { closed++; },
  }) } } }));
  const rejected = assert.rejects(session.execute(request), CommandInterrupted);
  await entered.promise;
  const shutdown = session.interrupt();
  assert.equal(nested, shutdown);
  await shutdown; await rejected;
  assert.equal(closed, 1);
  reply.resolve({ kind: 'ended' });
});

test('idle close does not abort completed work or invoke a participant twice', async t => {
  let closed = 0;
  const session = sessionOf(await openApplication(fixture(t), { investigation: { dialogAgent: { identity, open: () => ({
    exchange: async () => ({ kind: 'refused' }), close: () => { closed++; },
  }) } } }));
  await session.execute(request);
  const work = session.work(), usage = session.usage();
  await session.close(); await session.close();
  assert.equal(closed, 1); assert.deepEqual(session.work(), work); assert.deepEqual(session.usage(), usage);
});

test('missing measurements stay explicit through simultaneous attempt and work notification failures', async t => {
  const entered = deferred<void>(), reply = deferred<DialogReply>();
  const session = sessionOf(await openApplication(fixture(t), {
    onWork: event => { if (event.kind === 'finish') throw new Error('work notification'); },
    investigation: { dialogAgent: { identity, open: () => ({
      exchange: () => { entered.resolve(); return reply.promise; }, close() { throw new Error('participant cleanup'); },
    }) }, onReport() { throw new Error('attempt notification'); } },
  }));
  const rejected = assert.rejects(session.execute(request), CommandInterrupted);
  await entered.promise;
  const assessed = session.close().catch(error => error);
  await rejected;
  const failure = await assessed;
  assert.ok(failure instanceof SessionShutdownError);
  assert.deepEqual(failure.failures.map(item => item.phase), ['participant-cleanup', 'attempt-report', 'work-report']);
  assert.equal(session.work()?.status, 'interrupted');
  assert.equal(session.usage().attempts[0]!.usage[0]!.reported, null);
  assert.deepEqual(session.usage().attempts[0]!.usage[0]!.reports, []);
  reply.resolve({ kind: 'ended' });
});

for (const failures of ['none', 'participant-and-report', 'all-finalizers'] as const) {
  test(`active invalidation preserves its cause and shared shutdown assessment: ${failures}`, async t => {
    const f = fixture(t), entered = deferred<void>(), reply = deferred<DialogReply>();
    const participantFailure = new Error('invalidated participant cleanup');
    const attemptFailure = new Error('invalidated attempt notification');
    const workFailure = new Error('invalidated work notification');
    const resourceFailure = new CleanupIncomplete('controlled invalidation cleanup');
    let participantCloses = 0, resourceCloses = 0, reportCalls = 0, workFinishes = 0;
    let cleanupReason: Error | undefined, lateUsage!: (value: ReportedUsage) => void;
    const close = GitExecutionOwner.prototype.close;
    t.mock.method(GitExecutionOwner.prototype, 'close', function(this: GitExecutionOwner, reason?: Error) {
      resourceCloses++; cleanupReason = reason;
      return close.call(this, reason).then(() => { if (failures === 'all-finalizers') throw resourceFailure; });
    });
    const session = sessionOf(await openApplication(f, {
      onWork: event => {
        if (event.kind !== 'finish') return;
        workFinishes++; assert.equal(event.status, 'invalidated');
        if (failures === 'all-finalizers') throw workFailure;
      },
      investigation: { dialogAgent: { identity, open: () => ({
        exchange: (_input, _signal, usage) => { lateUsage = usage; usage(measurement); entered.resolve(); return reply.promise; },
        close: () => { participantCloses++; if (failures !== 'none') throw participantFailure; },
      }) }, onReport: report => {
        reportCalls++; assert.equal(report.termination, 'invalidated');
        if (failures !== 'none') throw attemptFailure;
      } },
    }));
    let terminal: unknown;
    const rejected = assert.rejects(session.execute(request), error => { terminal = error; return error instanceof SessionInvalidated; });
    await entered.promise;
    writeFileSync(path.join(path.dirname(f.configPath), 'gate.ts'), 'export const changedDuringDialog = 2;\n');
    reply.resolve({ kind: 'tools', requests: [{ kind: 'modules' }] });
    await rejected;
    // Detection itself must start owned cleanup; no explicit shutdown call has occurred.
    assert.equal(resourceCloses, 1); assert.equal(cleanupReason, terminal);
    assert.equal(session.work()?.status, 'invalidated');
    assert.equal(session.usage().attempts[0]!.termination, 'invalidated');
    const work = session.work(), usage = session.usage();
    lateUsage({ ...measurement, categories: [{ category: 'input', unit: 'tokens', value: 99, includedIn: null }] });
    await tick(); // Also allow a signal-triggered assessment rejection before explicit observation.
    assert.deepEqual(session.usage(), usage);
    const interrupted = session.interrupt(), closed = session.close();
    assert.equal(closed, interrupted);
    const outcome = await interrupted.then(() => null, error => error);
    if (failures === 'none') assert.equal(outcome, null, 'Invalidation is not itself a shutdown failure');
    else {
      assert.ok(outcome instanceof SessionShutdownError);
      const expected = new Map<string, unknown>([['participant-cleanup', participantFailure], ['attempt-report', attemptFailure]]);
      if (failures === 'all-finalizers') { expected.set('work-report', workFailure); expected.set('resource-cleanup', resourceFailure); }
      assert.equal(outcome.failures.length, expected.size);
      for (const failure of outcome.failures) assert.equal(failure.cause, expected.get(failure.phase));
      assert.deepEqual(new Set(outcome.errors), new Set(expected.values()));
    }
    assert.equal(await closed.then(() => null, error => error), outcome);
    assert.equal(await session.close().then(() => null, error => error), outcome);
    await assert.rejects(session.execute(request), error => error === terminal);
    await assert.rejects(session.check(), error => error === terminal);
    assert.deepEqual(session.work(), work); assert.deepEqual(session.usage(), usage);
    assert.deepEqual([participantCloses, resourceCloses, reportCalls, workFinishes], [1, 1, 1, 1]);
  });
}

for (const first of ['detected-change', 'interruption'] as const) {
  test(`active dialog with pending Git input change: ${first} establishes the terminal cause`, async t => {
    const entered = deferred<void>(), changed = deferred<GitResult>();
    const initial: GitResult = { status: 128, signal: null, stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
    // Repository acquisition retains the failure code. A different code is an input change,
    // and the detected-change case proves this same pending result invalidates without abort.
    const later: GitResult = { ...initial, status: 129 };
    let pendingChange = false, closes = 0, reports = 0, exchanges = 0;
    const session = sessionOf(await openApplication(fixture(t), {
      runGit: async () => { if (!pendingChange) return initial; entered.resolve(); return changed.promise; },
      investigation: { dialogAgent: { identity, open: () => ({
        exchange: async (_input, _signal, usage) => {
          exchanges++; usage(measurement); pendingChange = true;
          return { kind: 'tools', requests: [{ kind: 'modules' }] };
        }, close: () => { closes++; },
      }) }, onReport: () => { reports++; } },
    }));
    const ErrorType = first === 'detected-change' ? SessionInvalidated : CommandInterrupted;
    const status = first === 'detected-change' ? 'invalidated' : 'interrupted';
    let terminal: unknown;
    const rejected = assert.rejects(session.execute(request), error => { terminal = error; return error instanceof ErrorType; });
    await entered.promise;
    assert.equal(session.work()?.status, 'running');
    if (first === 'detected-change') changed.resolve(later);
    else await session.interrupt();
    await rejected;
    assert.equal(session.work()?.status, status);
    assert.equal(session.usage().attempts[0]!.termination, status);
    const work = session.work(), usage = session.usage();
    changed.resolve(later); await tick();
    await session.interrupt(); await session.close();
    await assert.rejects(session.execute(request), error => error === terminal);
    assert.deepEqual(session.work(), work); assert.deepEqual(session.usage(), usage);
    assert.deepEqual([closes, reports, exchanges], [1, 1, 1]);
  });
}

test('close from the completed-work callback preserves completed direct delivery and establishes SessionClosed', async t => {
  let session!: ApplicationSession, closing: Promise<void> | undefined, finishes = 0;
  session = sessionOf(await openApplication(fixture(t), { onWork(event) {
    if (event.kind === 'finish') { finishes++; closing = session.close(); }
  } }));
  const result = await session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } });
  assert.equal(result.kind, 'answer'); assert.equal(result.attribution.status, 'completed');
  await closing; assert.equal(finishes, 1); assert.equal(session.work()!.status, 'completed');
  await assert.rejects(session.check(), SessionClosed);
  assert.equal(session.close(), closing);
});

test('pending direct work refuses concurrent execution and validity checks without disturbing its accounting', async t => {
  const entered = deferred<void>(), reply = deferred<DialogReply>();
  const session = sessionOf(await openApplication(fixture(t), { investigation: { dialogAgent: { identity, open: () => ({
    exchange: () => { entered.resolve(); return reply.promise; }, close() {},
  }) } } }));
  t.after(() => session.close());
  const running = session.execute(request); await entered.promise;
  await assert.rejects(session.execute({ kind: 'report', report: 'usage' }), SessionBusy);
  await assert.rejects(session.check(), SessionBusy);
  assert.equal(session.work()!.status, 'running');
  reply.resolve({ kind: 'refused' }); await running;
  assert.notEqual(session.work()!.status, 'interrupted');
  await session.check();
});

test('lifetime abort during direct opening cancels owned Git before returning any Session', async t => {
  const controller = new AbortController(), entered = deferred<void>(), signals: string[] = [];
  const fake = Object.assign(new EventEmitter(), { pid: 13579, stdin: new PassThrough(), stdout: new PassThrough(), stderr: new PassThrough(),
    kill(signal: string) { signals.push(signal); setImmediate(() => { fake.emit('exit', null, signal); fake.emit('close', null, signal); }); return true; } });
  const spawn = childProcess.spawn, close = GitExecutionOwner.prototype.close;
  let owner: GitExecutionOwner | undefined;
  t.mock.method(childProcess, 'spawn', () => { entered.resolve(); return fake as unknown as ChildProcessWithoutNullStreams; });
  syncBuiltinESMExports();
  t.mock.method(GitExecutionOwner.prototype, 'close', function(this: GitExecutionOwner, reason?: Error) { owner = this; return close.call(this, reason); });
  t.after(() => { t.mock.restoreAll(); syncBuiltinESMExports(); });
  const opening = openApplication(fixture(t), { signal: controller.signal });
  const rejected = assert.rejects(opening, CommandInterrupted);
  await entered.promise; controller.abort(); await rejected;
  assert.ok(signals.includes('SIGTERM')); assert.equal(owner!.ownedChildren, 0);
  assert.notEqual(childProcess.spawn, spawn);
});

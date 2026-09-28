import { spawn } from 'node:child_process';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { CleanupIncomplete, GitFailure, SessionClosed, errorCode } from './execution-errors.js';

export interface GitRequest { readonly cwd: string; readonly args: readonly string[]; readonly input?: string }
export interface GitResult { readonly status: number | null; readonly signal: string | null; readonly stdout: Uint8Array; readonly stderr: Uint8Array }
export type RunGit = (request: GitRequest) => Promise<GitResult>;
export const executionLimits = { gitDeadlineMs: 30_000, terminationGraceMs: 250, cleanupDeadlineMs: 2_000, outputBytes: 64 * 1024 * 1024 } as const;
type Limits = { [K in keyof typeof executionLimits]: number };

/** Bound cleanup reporting without confusing it with confirmed exit. */
export function reportExit(exit: Promise<unknown>, resource: string, deadlineMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new CleanupIncomplete(resource)), deadlineMs);
    exit.then(() => { clearTimeout(timer); resolve(); }, error => { clearTimeout(timer); reject(error); });
  });
}

/** Own Git in the calling process, outside disposable compiler workers. */
export class GitExecutionOwner {
  readonly #children = new Set<{ cancel(error: Error): Promise<void> }>();
  #disposed: Error | undefined;
  #cleanup: Promise<void> | undefined;
  readonly limits: Limits;
  constructor(options: { limits?: Partial<Limits>; spawn?: (request: GitRequest, env: NodeJS.ProcessEnv) => ChildProcessWithoutNullStreams } = {}) {
    this.limits = { ...executionLimits, ...options.limits };
    this.spawn = options.spawn ?? ((request, env) => spawn('git', ['-C', request.cwd, ...request.args], { env, stdio: 'pipe' }));
  }
  private readonly spawn: (request: GitRequest, env: NodeJS.ProcessEnv) => ChildProcessWithoutNullStreams;
  get ownedChildren() { return this.#children.size; }
  readonly run: RunGit = request => {
    if (this.#disposed) return Promise.reject(this.#disposed);
    const env: NodeJS.ProcessEnv = { ...process.env, LC_ALL: 'C', GIT_OPTIONAL_LOCKS: '0' };
    for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_PREFIX']) delete env[key];
    let child: ChildProcessWithoutNullStreams;
    try { child = this.spawn(request, env); }
    catch (error) {
      const code = errorCode(error);
      return Promise.reject(code ? new GitFailure(`git ${request.args[0]}`, code) : error);
    }
    return new Promise<GitResult>((resolve, reject) => {
      let settled = false, exited = false, cancellation: Promise<void> | undefined;
      let finishExit!: () => void;
      const exit = new Promise<void>(done => { finishExit = done; });
      const resource = `Git child ${child.pid ?? '(spawn pending)'} (${request.args[0]})`;
      const stdout: Buffer[] = [], stderr: Buffer[] = [];
      let bytes = 0;
      const fail = (error: Error) => { if (!settled) { settled = true; reject(error); } };
      let force: ReturnType<typeof setTimeout> | undefined;
      const cancel = (error: Error, waitForExit = false) => {
        if (!waitForExit) fail(error);
        if (!cancellation) {
          clearTimeout(deadline);
          // Destroy streams as well: inherited pipes do not establish descendant ownership.
          child.stdin.destroy(); child.stdout.destroy(); child.stderr.destroy();
          if (!exited) {
            try { child.kill(process.platform === 'win32' ? 'SIGKILL' : 'SIGTERM'); } catch { /* exit monitoring is authoritative */ }
            if (process.platform !== 'win32') force = setTimeout(() => {
              if (!exited) { try { child.kill('SIGKILL'); } catch { /* report unconfirmed cleanup */ } }
            }, this.limits.terminationGraceMs);
          }
          cancellation = reportExit(exit, resource, this.limits.cleanupDeadlineMs);
          void cancellation.catch(problem => { this.#disposed = problem; fail(problem); });
        }
        if (waitForExit) void cancellation.then(() => fail(error), problem => fail(problem));
        return cancellation;
      };
      const owned = { cancel: (error: Error) => cancel(error) };
      this.#children.add(owned);
      const deadline = setTimeout(() => { void cancel(new GitFailure(`git ${request.args[0]} timeout`, 'ETIMEDOUT'), true); }, this.limits.gitDeadlineMs);
      const released = () => {
        exited = true; clearTimeout(force); this.#children.delete(owned); finishExit();
      };
      child.once('exit', released);
      child.once('error', error => {
        // A failed spawn has no process to reap; an error after spawn is not exit evidence.
        if (child.pid === undefined) released();
        void cancel(new GitFailure(errorCode(error) === 'ENOENT' ? 'git executable' : `git ${request.args[0]}`, errorCode(error)), true);
      });
      child.stdin.on('error', error => { void cancel(new GitFailure('git input', errorCode(error)), true); });
      const collect = (chunks: Buffer[]) => (data: Buffer) => {
        bytes += data.length;
        if (bytes > this.limits.outputBytes) { void cancel(new GitFailure('Git output limit', 'ENOBUFS'), true); return; }
        chunks.push(data);
      };
      child.stdout.on('data', collect(stdout)); child.stderr.on('data', collect(stderr));
      child.once('close', (status, signal) => {
        clearTimeout(deadline);
        if (!settled && !cancellation) {
          settled = true;
          resolve({ status, signal, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) });
        }
      });
      child.stdin.end(request.input);
    });
  };
  close(reason: Error = new SessionClosed()): Promise<void> {
    this.#disposed ??= reason;
    return this.#cleanup ??= Promise.allSettled([...this.#children].map(child => child.cancel(reason))).then(results => {
      const failed = results.find(result => result.status === 'rejected');
      if (failed?.status === 'rejected') throw failed.reason;
    });
  }
}

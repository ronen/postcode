import { Worker } from 'node:worker_threads';
import { CommandInterrupted, SessionClosed } from './execution-errors.js';
import { GitExecutionOwner, executionLimits, reportExit } from './git-execution.js';
import type { ViewRequest, ExecutionOptions } from './session.js';
import type { ProjectOptions } from './typescript/project.js';
import { decodeError, encodeError } from './session-protocol.js';
import type { Opening, WorkerReply, WorkerRequest, ExecutedView } from './session-protocol.js';
export { CommandInterrupted } from './execution-errors.js';
export type { ExecutedView } from './session-protocol.js';

type Reply = Extract<WorkerReply, { type: 'reply' }>;
/** One operation; the parent owns Git and cleanup independently of compiler disposal. */
export function interactiveSession(options: ProjectOptions, dependencies: {
  worker?: Worker; git?: GitExecutionOwner; cleanupDeadlineMs?: number;
} = {}) {
  // This compiled private worker does not inherit process-only launch flags.
  const worker = dependencies.worker ?? new Worker(new URL('./session-worker.js', import.meta.url), { execArgv: [], workerData: {
    ...options, excludedOutputDirectories: [...(options.excludedOutputDirectories ?? [])],
  } });
  const git = dependencies.git ?? new GitExecutionOwner();
  let pending: { id: number; resolve(value: Reply): void; reject(error: Error): void } | undefined;
  let ended = false, interrupted = false, sequence = 0;
  let termination: Promise<void> | undefined;
  const receive = (id: number) => new Promise<Reply>((resolve, reject) => { pending = { id, resolve, reject }; });
  const settleError = (error: Error) => { const current = pending; pending = undefined; current?.reject(error); };
  const dispose = (reason: Error) => {
    ended = true; settleError(reason);
    if (!termination) {
      const children = git.close(reason);
      let exit: Promise<number>;
      try { exit = worker.terminate(); } catch (error) { exit = Promise.reject(error); }
      termination = Promise.allSettled([children,
        reportExit(exit, 'analysis worker', dependencies.cleanupDeadlineMs ?? executionLimits.cleanupDeadlineMs)]).then(results => {
        const failed = results.filter(result => result.status === 'rejected');
        if (failed.length) throw new AggregateError(failed.map(result => result.reason), failed.map(result => String(result.reason)).join('; '));
      });
      void termination.catch(() => {}); // close()/interrupt() still report this same result.
    }
    return termination;
  };
  const opening = receive(0).then((reply): Opening => {
    if (!reply.opening) throw new Error('Invalid worker opening response');
    return reply.opening;
  });
  void opening.catch(() => {});
  const post = (message: WorkerRequest) => {
    try { worker.postMessage(message); }
    catch (error) { void dispose(error instanceof Error ? error : new Error('Worker send failed')); }
  };
  worker.on('message', (message: WorkerReply) => {
    if (ended || !pending || pending.id !== message.operation) return;
    if (message.type === 'git') {
      void git.run(message.request).then(result => {
        if (!ended && pending?.id === message.operation) post({ type: 'git-result', operation: message.operation, id: message.id, result });
      }, error => {
        if (!ended && pending?.id === message.operation) post({ type: 'git-result', operation: message.operation, id: message.id, error: encodeError(error) });
      });
      return;
    }
    const current = pending; pending = undefined;
    if (message.error) current.reject(decodeError(message.error));
    else current.resolve(message);
  });
  worker.on('error', error => { void dispose(error); });
  worker.on('exit', code => { void dispose(new Error(`Analysis worker exited unexpectedly (${code})`)); });
  const send = async (message: { type: 'check' } | { type: 'execute'; request: ViewRequest; execution: ExecutionOptions }) => {
    if (interrupted) throw new CommandInterrupted();
    if (ended) throw new SessionClosed();
    if (pending) throw new Error('Concurrent session command');
    const operation = ++sequence;
    const response = receive(operation);
    post({ ...message, operation });
    return response;
  };
  return {
    opening,
    async execute(request: ViewRequest, execution: ExecutionOptions = {}): Promise<ExecutedView> {
      const reply = await send({ type: 'execute', request, execution });
      if (!reply.result) throw new Error('Worker returned no view');
      return reply.result;
    },
    async check() { await send({ type: 'check' }); },
    get interrupted() { return interrupted; },
    interrupt() { interrupted = true; return dispose(new CommandInterrupted()); },
    close() { return dispose(new SessionClosed()); },
  };
}

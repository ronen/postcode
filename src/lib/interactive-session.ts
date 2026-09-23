import { Worker } from 'node:worker_threads';
import { AnalysisFailure, SessionInvalidated } from './session.js';
import type { openSession, ViewRequest } from './session.js';
import type { ProjectOptions } from './typescript/project.js';

type Opened = Extract<ReturnType<typeof openSession>, { status: 'opened' }>;
export type ExecutedView = ReturnType<Opened['session']['execute']>;
type Opening = { status: 'opened'; id: string } | Exclude<ReturnType<typeof openSession>, Opened>;
type Reply = Opening | { status: 'ok'; result?: ExecutedView } | { status: 'invalidated' } | { status: 'unavailable'; message: string };
export class CommandInterrupted extends Error {
  constructor() { super('Command interrupted; session ended.'); }
}

/** One in-flight operation; termination discards all worker state, including compiler objects. */
export function interactiveSession(options: ProjectOptions) {
  const worker = new Worker(new URL('./session-worker.js', import.meta.url), { workerData: options });
  let pending: { resolve: (value: Reply) => void; reject: (error: Error) => void } | undefined;
  let ended = false, interrupted = false;
  let termination: Promise<number> | undefined;
  const receive = () => new Promise<Reply>((resolve, reject) => { pending = { resolve, reject }; });
  const opening = receive().then((reply): Opening => {
    if (reply.status !== 'opened' && reply.status !== 'project-open-failed') throw new Error('Invalid worker opening response');
    return reply;
  });
  worker.on('message', (message: Reply) => {
    const current = pending;
    pending = undefined;
    if (message.status === 'invalidated') current?.reject(new SessionInvalidated());
    else if (message.status === 'unavailable') current?.reject(new AnalysisFailure(message.message));
    else current?.resolve(message);
  });
  worker.on('error', error => { ended = true; pending?.reject(error); pending = undefined; });
  worker.on('exit', code => {
    ended = true;
    if (pending) { pending.reject(new Error(`Analysis worker exited unexpectedly (${code})`)); pending = undefined; }
  });
  const send = async (message: unknown) => {
    if (interrupted) throw new CommandInterrupted();
    if (ended) throw new Error('Session worker is closed');
    if (pending) throw new Error('Concurrent session command');
    const response = receive();
    worker.postMessage(message);
    const reply = await response;
    if (reply.status !== 'ok') throw new Error('Invalid worker command response');
    return reply;
  };
  return {
    opening,
    async execute(request: ViewRequest): Promise<ExecutedView> {
      const reply = await send({ type: 'execute', request });
      if (!reply.result) throw new Error('Worker returned no view');
      return reply.result;
    },
    async check(): Promise<void> { await send({ type: 'check' }); },
    get interrupted() { return interrupted; },
    interrupt() {
      ended = true; interrupted = true;
      pending?.reject(new CommandInterrupted()); pending = undefined;
      return termination ??= worker.terminate();
    },
    async close() {
      ended = true;
      await (termination ??= worker.terminate());
    },
  };
}

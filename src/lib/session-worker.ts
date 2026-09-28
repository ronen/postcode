import { parentPort, workerData } from 'node:worker_threads';
import { openSession } from './session.js';
import type { ProjectOptions } from './typescript/project.js';
import { encodeError, decodeError } from './session-protocol.js';
import type { WorkerRequest, WorkerReply } from './session-protocol.js';
import type { GitResult, RunGit } from './git-execution.js';

// Compiler state belongs here; Git handles belong to the parent and survive disposal.
const port = parentPort!;
let operation = 0, gitId = 0, active = true;
const waiting = new Map<number, { operation: number; resolve(result: GitResult): void; reject(error: Error): void }>();
const send = (message: WorkerReply) => port.postMessage(message);
const runGit: RunGit = request => new Promise((resolve, reject) => {
  const id = ++gitId;
  waiting.set(id, { operation, resolve, reject });
  try { send({ type: 'git', operation, id, request }); }
  catch (error) { waiting.delete(id); reject(error); }
});
let opened: Awaited<ReturnType<typeof openSession>>;
port.on('message', async (message: WorkerRequest) => {
  if (message.type === 'git-result') {
    const pending = waiting.get(message.id);
    if (!pending || pending.operation !== message.operation) return;
    waiting.delete(message.id);
    if (message.error) pending.reject(decodeError(message.error));
    else if (message.result) pending.resolve(message.result);
    else pending.reject(new Error('Missing Git response'));
    return;
  }
  if (active || opened?.status !== 'opened') throw new Error('Invalid concurrent worker operation');
  active = true; operation = message.operation;
  try {
    const result = message.type === 'execute' ? await opened.session.execute(message.request, message.execution) : await opened.session.check();
    send({ type: 'reply', operation, ...(result ? { result } : {}) });
  } catch (error) { send({ type: 'reply', operation, error: encodeError(error) }); }
  finally { active = false; }
});
try {
  opened = await openSession(workerData as ProjectOptions, { runGit });
  send({ type: 'reply', operation, opening: opened.status === 'opened' ? { status: 'opened', id: opened.session.id } : opened });
  active = false;
  if (opened.status !== 'opened') port.close();
} catch (error) {
  send({ type: 'reply', operation, error: encodeError(error) });
  port.close();
}

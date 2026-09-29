import type { AgentIdentity, AgentReply, InvestigatorAgent, ReportedUsage } from './investigation/contracts.js';
import type { InvestigationBounds } from './investigation/execute.js';
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
let exchangeId = 0;
const exchanges = new Map<number, { operation: number; resolve(reply: AgentReply): void; reject(error: Error): void; usage(value: ReportedUsage): void }>();
const configuration = workerData as ProjectOptions & { investigatorIdentity?: AgentIdentity; investigationBounds?: InvestigationBounds };
const agent: InvestigatorAgent | undefined = configuration.investigatorIdentity ? {
  identity: configuration.investigatorIdentity,
  open() {
    let attempt: string | undefined, call = 0;
    const owned = new Set<number>();
    return {
      exchange(input, _signal, usage) {
        attempt = input.attempt;
        return new Promise((resolve, reject) => {
          const id = ++exchangeId; owned.add(id);
          exchanges.set(id, { operation, resolve, reject, usage });
          send({ type: 'agent-exchange', operation, id, input, call: ++call });
        });
      },
      close() {
        for (const id of owned) exchanges.delete(id);
        if (attempt) send({ type: 'agent-close', operation, attempt });
      },
    };
  },
} : undefined;
let opened: Awaited<ReturnType<typeof openSession>>;
port.on('message', async (message: WorkerRequest) => {
  if (message.type === 'agent-result' || message.type === 'agent-usage') {
    const pending = exchanges.get(message.id);
    if (!pending || pending.operation !== message.operation) return;
    if (message.type === 'agent-usage') { pending.usage(message.usage); return; }
    exchanges.delete(message.id);
    if (message.error) pending.reject(decodeError(message.error));
    else if ('reply' in message) pending.resolve(message.reply!);
    else pending.reject(new Error('Missing investigator response'));
    return;
  }
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
  opened = await openSession(configuration, { runGit, investigation: {
    ...(agent ? { agent } : {}), ...(configuration.investigationBounds ? { bounds: configuration.investigationBounds } : {}),
    onProgress: report => send({ type: 'attempt-report', operation, report }),
    onReport: report => send({ type: 'attempt-report', operation, report }),
  } });
  send({ type: 'reply', operation, opening: opened.status === 'opened' ? { status: 'opened', id: opened.session.id } : opened });
  active = false;
  if (opened.status !== 'opened') port.close();
} catch (error) {
  send({ type: 'reply', operation, error: encodeError(error) });
  port.close();
}

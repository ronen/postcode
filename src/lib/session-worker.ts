import type { RecordId } from './records.js';
import type { AgentIdentity, AgentReply, InvestigationRequest, InvestigatorAgent, ReportedUsage } from './investigation/contracts.js';
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
const exchanges = new Map<number, { operation: number; resolve(reply: AgentReply): void; reject(error: Error): void }>();
// Usage belongs to the dialogue, not the shorter pending-reply lifetime.
const usageCallbacks = new Map<number, { operation: number; usage(value: ReportedUsage): void }>();
const configuration = workerData as ProjectOptions & { investigatorIdentity?: AgentIdentity; selectInvestigator?: boolean; investigationBounds?: InvestigationBounds };
const bridge = (identity: AgentIdentity): InvestigatorAgent => ({
  identity,
  open() {
    let attempt: RecordId | undefined, call = 0;
    const owned = new Set<number>();
    return {
      exchange(input, _signal, usage) {
        attempt = input.attempt;
        return new Promise((resolve, reject) => {
          const id = ++exchangeId; owned.add(id);
          exchanges.set(id, { operation, resolve, reject });
          usageCallbacks.set(id, { operation, usage });
          send({ type: 'agent-exchange', operation, id, input, call: ++call });
        });
      },
      close() {
        for (const id of owned) { exchanges.delete(id); usageCallbacks.delete(id); }
        if (attempt) send({ type: 'agent-close', operation, attempt });
      },
    };
  },
});
const selections = new Map<number, { operation: number; resolve(agent: InvestigatorAgent): void; reject(error: Error): void }>();
let selectionId = 0;
let opened: Awaited<ReturnType<typeof openSession>>;
port.on('message', async (message: WorkerRequest) => {
  if (message.type === 'agent-selected') {
    const selected = selections.get(message.id);
    if (!selected || selected.operation !== message.operation) return;
    selections.delete(message.id);
    if (message.error) selected.reject(decodeError(message.error));
    else if (message.identity) selected.resolve(bridge(message.identity));
    else selected.reject(new Error('Missing investigator selection'));
    return;
  }
  if (message.type === 'agent-result' || message.type === 'agent-usage') {
    if (message.type === 'agent-usage') {
      const callback = usageCallbacks.get(message.id);
      if (callback?.operation === message.operation) callback.usage(message.usage);
      return;
    }
    const pending = exchanges.get(message.id);
    if (!pending || pending.operation !== message.operation) return;
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
    ...(configuration.investigatorIdentity ? { agent: bridge(configuration.investigatorIdentity) } : {}),
    ...(configuration.selectInvestigator ? { selectAgent: (request: InvestigationRequest) => new Promise<InvestigatorAgent>((resolve, reject) => {
      const id = ++selectionId; selections.set(id, { operation, resolve, reject });
      send({ type: 'agent-select', operation, id, request });
    }) } : {}), ...(configuration.investigationBounds ? { bounds: configuration.investigationBounds } : {}),
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

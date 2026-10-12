import { initiation, incompleteWork } from './work-attribution.js';
import type { WorkReport } from './work-attribution.js';
import { captureRequest } from './requests.js';
import { finalizeRequestReport, renderRequestReport, rejectedRequestResult } from './request-reporting.js';
import { freezeOwned } from './immutable.js';
import type { InvestigationRequest, AgentIdentity, InvestigatorAgent, AgentDialogue, AgentReply, AttemptReport, CallUsage } from './investigation/contracts.js';
import { finalizeInvestigationUsage, renderInvestigationView } from './investigation/presentation.js';
import type { InvestigationBounds } from './investigation/execute.js';
import type { RecordId } from './records.js';
import { InvestigationUsage } from './investigation/usage.js';
import { usageSummary } from './investigation/reporting.js';
import { Worker } from 'node:worker_threads';
import { CommandInterrupted, SessionClosed, SessionInvalidated, AnalysisFailure } from './execution-errors.js';
import { GitExecutionOwner, executionLimits, reportExit } from './git-execution.js';
import type { ViewRequest, ExecutionOptions } from './session.js';
import type { ProjectOptions } from './typescript/project.js';
import { decodeError, encodeError } from './session-protocol.js';
import type { Opening, WorkerReply, WorkerRequest, ExecutedRequest } from './session-protocol.js';
export { CommandInterrupted } from './execution-errors.js';
export type { ExecutedRequest } from './session-protocol.js';

type Reply = Extract<WorkerReply, { type: 'reply' }>;
/** One operation; the parent owns Git and cleanup independently of compiler disposal. */
export function interactiveSession(options: ProjectOptions, dependencies: {
  worker?: Worker; git?: GitExecutionOwner; cleanupDeadlineMs?: number; investigator?: InvestigatorAgent; selectInvestigator?: (request: InvestigationRequest) => InvestigatorAgent; investigationBounds?: InvestigationBounds;
} = {}) {
  const bounds = dependencies.investigationBounds ? freezeOwned(structuredClone(dependencies.investigationBounds)) : undefined;
  const identity = dependencies.investigator ? freezeOwned(structuredClone(dependencies.investigator.identity)) : undefined;
  // This compiled private worker does not inherit process-only launch flags.
  const worker = dependencies.worker ?? new Worker(new URL('./session-worker.js', import.meta.url), { execArgv: [], workerData: {
    ...options, investigatorIdentity: identity, selectInvestigator: !!dependencies.selectInvestigator, investigationBounds: bounds, excludedOutputDirectories: [...(options.excludedOutputDirectories ?? [])],
  } });
  const usage = new InvestigationUsage();
  const reports = new Map<RecordId, AttemptReport>();
  let latestWork: WorkReport | undefined;
  const started = new Map<RecordId, number>();
  const closedDialogues = new Map<RecordId, readonly CallUsage[]>();
  const selectedAgents = new Map<number, { agent: InvestigatorAgent; identity: AgentIdentity }>();
  const dialogues = new Map<RecordId, { dialogue: AgentDialogue; identity: AgentIdentity; controller: AbortController }>();
  const closeDialogue = (attempt: RecordId) => {
    if (closedDialogues.has(attempt)) return undefined;
    // This is the acceptance boundary, before abort/close can trigger callbacks.
    closedDialogues.set(attempt, usage.calls(attempt));
    const item = dialogues.get(attempt); dialogues.delete(attempt);
    if (item) { item.controller.abort(); try { item.dialogue.close(); } catch (error) { return error instanceof Error ? error : new Error('Investigator close failed'); } }
    return undefined;
  };
  const usageReport = () => usageSummary([...reports.values()].map(report => ({ ...report,
    usage: closedDialogues.get(report.attempt) ?? usage.calls(report.attempt) })));
  const git = dependencies.git ?? new GitExecutionOwner();
  let pending: { id: number; resolve(value: Reply): void; reject(error: Error): void } | undefined;
  let ended = false, interrupted = false, sequence = 0;
  let termination: Promise<void> | undefined;
  const receive = (id: number) => new Promise<Reply>((resolve, reject) => { pending = { id, resolve, reject }; });
  const settleError = (error: Error) => { const current = pending; pending = undefined; current?.reject(error); };
  const dispose = (reason: Error) => {
    if (latestWork?.status === 'running') latestWork = incompleteWork(latestWork, reason instanceof CommandInterrupted ? 'interrupted' : 'defect');
    ended = true; settleError(reason); selectedAgents.clear();
    for (const [attempt, report] of reports) if (report.termination === 'running') reports.set(attempt, { ...report, termination: reason instanceof CommandInterrupted ? 'interrupted' : 'defect', elapsedMilliseconds: performance.now() - (started.get(attempt) ?? performance.now()) });
    const agentErrors = [...dialogues.keys()].map(closeDialogue).filter((error): error is Error => error !== undefined);
    if (!termination) {
      const children = git.close(reason);
      let exit: Promise<number>;
      try { exit = worker.terminate(); } catch (error) { exit = Promise.reject(error); }
      termination = Promise.allSettled([...agentErrors.map(error => Promise.reject(error)), children,
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
    if (message.type === 'work-report') { latestWork = freezeOwned(message.report); return; }
    if (message.type === 'attempt-report') {
      if (!started.has(message.report.attempt)) started.set(message.report.attempt, performance.now() - message.report.elapsedMilliseconds);
      reports.set(message.report.attempt, message.report); return;
    }
    if (message.type === 'agent-select') {
      try {
        const agent = dependencies.selectInvestigator!(message.request);
        const selectedIdentity = freezeOwned(structuredClone(agent.identity));
        selectedAgents.set(message.operation, { agent, identity: selectedIdentity });
        post({ type: 'agent-selected', operation: message.operation, id: message.id, identity: selectedIdentity });
      } catch (error) { post({ type: 'agent-selected', operation: message.operation, id: message.id, error: encodeError(error) }); }
      return;
    }
    if (message.type === 'agent-close') { const error = closeDialogue(message.attempt); if (error) void dispose(error); return; }
    if (message.type === 'agent-exchange') {
      const { attempt } = message.input;
      void Promise.resolve().then(() => {
        if (ended || pending?.id !== message.operation) return;
        const selected = selectedAgents.get(message.operation);
        const agent = selected?.agent ?? dependencies.investigator;
        if (!agent) throw new Error('Missing investigator bridge');
        let active = dialogues.get(attempt);
        if (!active) { active = { dialogue: agent.open(), identity: selected?.identity ?? identity!, controller: new AbortController() }; dialogues.set(attempt, active); }
        const current = active;
        const recordUsage = usage.start(attempt, message.call, active.identity);
        return active.dialogue.exchange(message.input, active.controller.signal, value => {
          if (ended || pending?.id !== message.operation || dialogues.get(attempt) !== current) return;
          recordUsage(value);
          post({ type: 'agent-usage', operation: message.operation, id: message.id, usage: value });
        });
      }).then(reply => {
        if (!ended && pending?.id === message.operation && !closedDialogues.has(attempt)) post({ type: 'agent-result', operation: message.operation, id: message.id, reply: reply as AgentReply });
      }, error => {
        if (!ended && pending?.id === message.operation && !closedDialogues.has(attempt)) post({ type: 'agent-result', operation: message.operation, id: message.id, error: encodeError(error) });
      });
      return;
    }
    if (message.type === 'git') {
      void git.run(message.request).then(result => {
        if (!ended && pending?.id === message.operation) post({ type: 'git-result', operation: message.operation, id: message.id, result });
      }, error => {
        if (!ended && pending?.id === message.operation) post({ type: 'git-result', operation: message.operation, id: message.id, error: encodeError(error) });
      });
      return;
    }
    selectedAgents.delete(message.operation);
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
    opening, usage: usageReport, work: () => latestWork,
    async execute(request: ViewRequest, execution: ExecutionOptions = {}): Promise<ExecutedRequest> {
      const captured = captureRequest(request);
      execution = { ...execution };
      if (pending && pending.id !== 0) throw new Error('Concurrent session command');
      const context = initiation(captured.normalized, execution.requestId, bounds);
      execution = { ...execution, requestId: context.id };
      latestWork = freezeOwned({ context, status: 'running', completeness: 'complete', work: [], evidence: [], limitations: [] });
      try {
        if (captured.input === null) {
          const opened = await opening;
          if (opened.status !== 'opened') throw new Error('Request requires an opened Session');
          await send({ type: 'check' });
          const result = rejectedRequestResult(opened.id, context, usageReport());
          if (!execution.deferPublicationCheck) await send({ type: 'check' });
          const attribution: WorkReport = freezeOwned({ ...latestWork!, status: 'refused' });
          latestWork = attribution;
          const report = freezeOwned({ ...result.report, attribution });
          return { ...result, report, attribution, rendered: renderRequestReport(report) };
        }
        const reply = await send({ type: 'execute', request: captured.input, execution });
        if (!reply.result) throw new Error('Worker returned no request result');
        if (reply.result.kind === 'resolution') {
          const report = finalizeRequestReport(reply.result.report, usageReport());
          return { ...reply.result, report, rendered: renderRequestReport(report) };
        }
        if (reply.result.kind === 'usage') {
          const report = finalizeRequestReport(reply.result.report, usageReport());
          return { ...reply.result, report, rendered: renderRequestReport(report) };
        }
        if (reply.result.view.schema === 'postcode-investigation-view/1-experimental') {
          // The close message precedes the result. Finalize from those sealed call
          // snapshots, which also feed observations and subsequent usage requests.
          if (!reply.result.investigationArrangementKey) throw new Error('Missing investigation arrangement identity');
          const view = finalizeInvestigationUsage(reply.result.view, usageReport(), reply.result.investigationArrangementKey);
          return { ...reply.result, view, rendered: renderInvestigationView(view), methods: [...reply.result.methods], failed: reply.result.failed ?? false };
        }
        return reply.result;
      } catch (error) {
        if (latestWork?.status === 'running') latestWork = incompleteWork(latestWork, error instanceof CommandInterrupted ? 'interrupted'
          : error instanceof SessionInvalidated ? 'invalidated' : error instanceof AnalysisFailure ? 'failed' : 'defect');
        throw error;
      }
    },
    async check() { await send({ type: 'check' }); },
    get interrupted() { return interrupted; },
    interrupt() { interrupted = true; return dispose(new CommandInterrupted()); },
    close() { return dispose(new SessionClosed()); },
  };
}

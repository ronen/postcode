import { untilAborted } from '../execution-wait.js';
import { freezeOwned } from '../immutable.js';
import { initiation, RequestWork } from '../work-attribution.js';
import type { WorkReport, WorkProgress } from '../work-attribution.js';
import { evidenceAccess } from '../evidence-access.js';
import { InvestigationUsage } from '../investigation/usage.js';
import { usageSummary } from '../investigation/reporting.js';
import type { AttemptReport } from '../investigation/contracts.js';
import type { RecordId } from '../records.js';
import { AnalysisFailure, SessionInvalidated, SessionClosed, SessionBusy, CommandInterrupted, CleanupIncomplete, operationalIO, SessionShutdownError, TerminalFinalizationError } from '../execution-errors.js';
import { GitExecutionOwner } from '../git-execution.js';
import { OutputBoundaryFailure } from '../output-boundary.js';
import { MemoryProgramRecordStore } from '../memory-store.js';
import { openTypeScriptProject } from '../typescript/project.js';
import type { ProjectOptions } from '../typescript/project.js';
import { captureApplicationRequest, captureFields, InvalidRequestId } from './requests.js';
import type { SemanticRequest, InputProblem } from './requests.js';
import { applicationCatalog, captureApplicationCatalog } from './catalog.js';
import type { ApplicationCatalog } from './catalog.js';
import type { ApplicationSession, OpenApplicationResult, ApplicationDependencies, ApplicationContext, ApplicationResult, CapturedInvocation } from './contracts.js';
import { requestExecutor } from './executor.js';
import { contributionEvaluation } from '../contributions/evaluation.js';
import { sessionLedger } from '../contributions/modules.js';

export async function openApplication(options: ProjectOptions, lifetime: ApplicationDependencies = {}, definitions: ApplicationCatalog = applicationCatalog): Promise<OpenApplicationResult> {
  options = { ...options, excludedOutputDirectories: [...(options.excludedOutputDirectories ?? [])] };
  const catalog = captureApplicationCatalog(definitions);
  const investigation = { ...lifetime.investigation, ...(lifetime.investigation?.bounds ? { bounds: freezeOwned(structuredClone(lifetime.investigation.bounds)) } : {}) };
  const owner = lifetime.runGit ? undefined : new GitExecutionOwner();
  const controller = new AbortController(), reports = new Map<RecordId, AttemptReport>();
  const usage = new InvestigationUsage();
  const usageReport = () => usageSummary([...reports.values()]);
  let state: { store: MemoryProgramRecordStore; execute: ReturnType<typeof requestExecutor>;
    changed: () => Promise<boolean> } | undefined;
  let disposed: Error | undefined, busy = false, invalid = false, requestFinalized = false;
  let activeDone: Promise<void> | undefined, shutdown: Promise<void> | undefined;
  const shutdownFailures: import('../execution-errors.js').ShutdownFailure[] = [];
  const dispose = (reason: Error): Promise<void> => {
    disposed ??= reason;
    if (!shutdown) {
      let assess!: () => void;
      shutdown = new Promise<void>(resolve => { assess = resolve; }).then(() => {
        state = undefined;
        lifetime.signal?.removeEventListener('abort', interrupt);
        if (shutdownFailures.length) throw new SessionShutdownError(Object.freeze([...shutdownFailures]));
      });
      void shutdown.catch(() => {});
      state?.store.releaseOwnership();
      controller.abort(disposed);
      const cleanup = (owner?.close(disposed) ?? Promise.resolve()).catch(cause => { shutdownFailures.push({ phase: 'resource-cleanup', cause }); });
      // Both inputs are fulfilled internal observations, never the caller's request promise.
      void Promise.all([cleanup, activeDone]).then(assess);
    }
    return shutdown;
  };
  const interrupt = () => { void dispose(new CommandInterrupted()).catch(() => {}); };
  lifetime.signal?.addEventListener('abort', interrupt, { once: true });
  if (lifetime.signal?.aborted) interrupt();
  const alive = () => { if (disposed) throw disposed; };
  let opened;
  try { alive(); opened = await openTypeScriptProject(options, lifetime.runGit ?? owner!.run); alive(); }
  catch (error) {
    lifetime.signal?.removeEventListener('abort', interrupt);
    // Opening keeps its existing cleanup/error contract; no Session has been returned.
    const reason = error instanceof Error ? error : new Error('Opening failed');
    disposed ??= reason; controller.abort(disposed);
    await owner?.close(disposed);
    if (!operationalIO(error)) throw error;
    return { status: 'project-open-failed', diagnostics: [], operational: { operation: 'project input acquisition', path: options.configPath, reason: error.message } };
  }
  if (opened.status !== 'opened') { lifetime.signal?.removeEventListener('abort', interrupt); await owner?.close(new SessionClosed()); return opened; }
  const id = opened.session;
  const check = async () => {
    alive();
    if (!state) throw new SessionClosed();
    if (!invalid) {
      try { invalid = await untilAborted(state.changed, controller.signal); }
      catch (error) {
        if (!operationalIO(error) && !(error instanceof OutputBoundaryFailure) && !(error instanceof CleanupIncomplete)) throw error;
        invalid = true;
      }
    }
    alive();
    if (invalid) { const error = disposed ?? new SessionInvalidated(); void dispose(error); throw error; }
  };
  // Retained domain state is owned by this holder and released on close. Final
  // attempt accounting may arrive during cancellation; progress cannot revive work.
  const initialize = (project: Extract<typeof opened, { status: 'opened' }>) => {
    const store = new MemoryProgramRecordStore();
    const evidence = evidenceAccess(store, project.analysis, id);
    const report = (value: AttemptReport) => { if (!currentWork) return; const captured = freezeOwned(structuredClone(value)); reports.set(value.attempt, captured); investigation.onReport?.(captured); };
    const contributions = contributionEvaluation(store, sessionLedger(store, id), evidence, usage,
      { ...investigation, operations: catalog.operations, onReport: report, onProgress: value => { if (!currentWork || controller.signal.aborted) return; const captured = freezeOwned(structuredClone(value)); reports.set(value.attempt, captured); investigation.onProgress?.(captured); } }, check, controller.signal);
    return { store, execute: requestExecutor(store, project.analysis, id, usageReport, catalog, contributions), changed: project.changed };
  };
  state = initialize(opened);
  const operation = async <T>(run: () => Promise<T>): Promise<T> => {
    alive(); if (invalid) throw new SessionInvalidated();
    if (busy) throw new SessionBusy();
    busy = true; requestFinalized = false;
    let done!: () => void;
    activeDone = new Promise<void>(resolve => { done = resolve; });
    try { return await run(); } finally { busy = false; done(); activeDone = undefined; }
  };
  let latestWork: WorkReport | undefined, currentWork: RequestWork | undefined;
  const progress = lifetime.onWork ? (event: WorkProgress) => {
    try { lifetime.onWork!(freezeOwned(structuredClone(event))); }
    catch (cause) {
      if (!controller.signal.aborted) throw cause;
      shutdownFailures.push({ phase: 'work-report', cause });
    }
  } : undefined;
  const finishWork = (work: RequestWork, status: Exclude<WorkReport['status'], 'running'>, reason?: string) => {
    // A finish callback can reenter close() before finish() returns. This direct
    // boundary flag prevents completed work from establishing a new interruption.
    requestFinalized = true;
    latestWork = work.finish(status, reason); currentWork = undefined; return latestWork;
  };
  const failWork = (work: RequestWork, error: unknown) => finishWork(work, error instanceof CommandInterrupted ? 'interrupted'
    : error instanceof SessionInvalidated ? 'invalidated' : error instanceof AnalysisFailure ? 'failed' : 'defect',
    'Execution threw before completing the request; work without a returned boundary outcome is unknown.');
  const perform = async (request: SemanticRequest, execution: { readonly requestId?: string; readonly invocation?: CapturedInvocation }): Promise<ApplicationResult> => {
    const context: ApplicationContext = freezeOwned({ ...initiation(request, execution.requestId, investigation.bounds), ...(execution.invocation ? { invocation: execution.invocation } : {}) });
    const work = new RequestWork(context, state!.store, progress, controller.signal); currentWork = work;
    try {
      await check();
      const result = await state!.execute(context, work);
      await check();
      alive();
      const attribution = finishWork(work, result.kind === 'resolution' ? 'refused' : result.kind === 'answer' && result.failed ? 'failed' : 'completed');
      return freezeOwned({ ...result, attribution });
    } catch (error) {
      if (error instanceof TerminalFinalizationError) { shutdownFailures.push(...error.failures); error = error.terminal; }
      if (disposed) error = disposed;
      if (operationalIO(error)) {
        try { await check(); } catch (invalid) { failWork(work, invalid); throw invalid; }
        error = new AnalysisFailure(error.message);
      }
      failWork(work, error); throw error;
    }
  };
  const session: ApplicationSession = {
    id,
    capabilities: () => freezeOwned(Object.values(catalog.lenses).map(({ requirements, ...lens }) => ({ ...lens, requirements: requirements.kind === 'contribution' || requirements.kind === 'follow-up' ? requirements : { kind: requirements.kind } }))),
    check: () => operation(check), usage: usageReport, work: () => currentWork?.snapshot() ?? latestWork,
    execute(request, execution = {}) {
      const captured = captureApplicationRequest(request, catalog.lenses);
      const supplied = captureFields(execution);
      const requestId = typeof supplied.input.requestId === 'string' ? supplied.input.requestId : undefined;
      const correlationProblems: InputProblem[] = supplied.problems.filter(problem => problem.omittedField === 'requestId');
      if (Object.hasOwn(supplied.input, 'requestId') && requestId === undefined) correlationProblems.push({ field: 'requestId',
        reason: 'Request correlation must be a string.', representation: 'preserved' });
      if (correlationProblems.length) return operation(async () => {
        throw new InvalidRequestId({ input: Object.hasOwn(supplied.input, 'requestId') ? { requestId: supplied.input.requestId! } : {}, problems: correlationProblems });
      });
      const descriptor = execution && typeof execution === 'object' ? Object.getOwnPropertyDescriptor(execution, 'invocation') : undefined;
      const invocation = descriptor && 'value' in descriptor && descriptor.value !== undefined ? captureFields(descriptor.value, 'invocation')
        : supplied.problems.some(problem => problem.omittedField === 'invocation') ? { input: {}, problems: supplied.problems.filter(problem => problem.omittedField === 'invocation') } : undefined;
      return operation(() => perform(captured, { ...(requestId !== undefined ? { requestId } : {}), ...(invocation ? { invocation: { fields: invocation.input, problems: invocation.problems } } : {}) }));
    },
    interrupt: () => dispose(new CommandInterrupted()),
    close: () => dispose(busy && !requestFinalized ? new CommandInterrupted() : new SessionClosed()),
  };
  return { status: 'opened', session };
}

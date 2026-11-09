import { freezeOwned } from '../immutable.js';
import { initiation, RequestWork } from '../work-attribution.js';
import type { WorkReport, WorkProgress } from '../work-attribution.js';
import { investigationEvaluation } from '../investigation/evaluation.js';
import { InvestigationUsage } from '../investigation/usage.js';
import { usageSummary } from '../investigation/reporting.js';
import type { AttemptReport } from '../investigation/contracts.js';
import type { RecordId } from '../records.js';
import { AnalysisFailure, SessionInvalidated, SessionClosed, SessionBusy, CommandInterrupted, CleanupIncomplete, operationalIO } from '../execution-errors.js';
import { GitExecutionOwner } from '../git-execution.js';
import { OutputBoundaryFailure } from '../output-boundary.js';
import { evaluateModules } from '../evaluation.js';
import { MemoryProgramRecordStore } from '../memory-store.js';
import { openTypeScriptProject } from '../typescript/project.js';
import type { ProjectOptions } from '../typescript/project.js';
import { referenceBinding } from '../reference-binding.js';
import type { ReferenceBinding, ReferenceKind } from '../reference-binding.js';
import { captureApplicationRequest, captureFields } from './requests.js';
import type { SemanticRequest, InputConstraints } from './requests.js';
import { applicationCatalog, captureApplicationCatalog } from './catalog.js';
import type { ApplicationCatalog } from './catalog.js';
import type { ApplicationSession, OpenApplicationResult, ApplicationDependencies, ApplicationContext, ApplicationResult, CapturedInvocation } from './contracts.js';
import { requestExecutor } from './executor.js';
import { registerOperationHost } from './operation-scope.js';

export async function openApplication(options: ProjectOptions, lifetime: ApplicationDependencies = {}, definitions: ApplicationCatalog = applicationCatalog): Promise<OpenApplicationResult> {
  options = { ...options, excludedOutputDirectories: [...(options.excludedOutputDirectories ?? [])] };
  const catalog = captureApplicationCatalog(definitions);
  const investigation = { ...lifetime.investigation, ...(lifetime.investigation?.bounds ? { bounds: freezeOwned(structuredClone(lifetime.investigation.bounds)) } : {}) };
  const owner = lifetime.runGit ? undefined : new GitExecutionOwner();
  const controller = new AbortController(), reports = new Map<RecordId, AttemptReport>();
  const usage = new InvestigationUsage();
  const usageReport = () => usageSummary([...reports.values()]);
  let disposed: Error | undefined, busy = false, invalid = false;
  const dispose = (reason: Error) => { disposed ??= reason; controller.abort(reason); return owner?.close(reason) ?? Promise.resolve(); };
  const interrupt = () => { void dispose(new CommandInterrupted()).catch(() => {}); };
  lifetime.signal?.addEventListener('abort', interrupt, { once: true });
  if (lifetime.signal?.aborted) interrupt();
  const alive = () => { if (disposed) throw disposed; };
  let opened;
  try { alive(); opened = await openTypeScriptProject(options, lifetime.runGit ?? owner!.run); alive(); }
  catch (error) {
    lifetime.signal?.removeEventListener('abort', interrupt);
    await dispose(error instanceof Error ? error : new Error('Opening failed'));
    if (!operationalIO(error)) throw error;
    return { status: 'project-open-failed', diagnostics: [], operational: { operation: 'project input acquisition', path: options.configPath, reason: error.message } };
  }
  if (opened.status !== 'opened') { lifetime.signal?.removeEventListener('abort', interrupt); await dispose(new SessionClosed()); return opened; }
  const id = opened.session;
  let state: { store: MemoryProgramRecordStore; execute: ReturnType<typeof requestExecutor>;
    evaluate: ReturnType<typeof investigationEvaluation>['evaluate']; changed: () => Promise<boolean> } | undefined;
  const check = async () => {
    alive();
    if (!state) throw new SessionClosed();
    if (!invalid) {
      try { invalid = await state.changed(); }
      catch (error) {
        if (!operationalIO(error) && !(error instanceof OutputBoundaryFailure) && !(error instanceof CleanupIncomplete)) throw error;
        invalid = true;
      }
    }
    alive();
    if (invalid) { const error = new SessionInvalidated(); controller.abort(error); throw error; }
  };
  // Retained domain state is owned by this holder and released on close. Final
  // attempt accounting may arrive during cancellation; progress cannot revive work.
  const initialize = (project: Extract<typeof opened, { status: 'opened' }>) => {
    const store = new MemoryProgramRecordStore();
    const integration = investigationEvaluation(store, project.analysis, id, usage, { ...investigation,
      onReport: report => { if (!currentWork) return; const captured = freezeOwned(structuredClone(report)); reports.set(report.attempt, captured); investigation.onReport?.(captured); },
      onProgress: report => { if (!currentWork || controller.signal.aborted) return; const captured = freezeOwned(structuredClone(report)); reports.set(report.attempt, captured); investigation.onProgress?.(captured); },
    }, check, controller.signal, catalog.operations);
    return { store, execute: requestExecutor(store, project.analysis, id, integration, usageReport, catalog), changed: project.changed,
      evaluate: (request: Parameters<typeof integration.evaluate>[0], work?: RequestWork) => {
        evaluateModules(store, project.analysis, [], work?.scope('Establish the module basis for direct interpretation.'));
        return integration.evaluate(request, work);
      } };
  };
  state = initialize(opened);
  const operation = async <T>(run: () => Promise<T>): Promise<T> => {
    alive(); if (invalid) throw new SessionInvalidated();
    if (busy) throw new SessionBusy();
    busy = true; try { return await run(); } finally { busy = false; }
  };
  let latestWork: WorkReport | undefined, currentWork: RequestWork | undefined;
  const progress = lifetime.onWork ? (event: WorkProgress) => lifetime.onWork!(freezeOwned(structuredClone(event))) : undefined;
  const finishWork = (work: RequestWork, status: Exclude<WorkReport['status'], 'running'>, reason?: string) => {
    latestWork = work.finish(status, reason); currentWork = undefined; return latestWork;
  };
  const failWork = (work: RequestWork, error: unknown) => finishWork(work, error instanceof CommandInterrupted ? 'interrupted'
    : error instanceof SessionInvalidated ? 'invalidated' : error instanceof AnalysisFailure ? 'failed' : 'defect',
    'Execution threw before completing the request; work without a returned boundary outcome is unknown.');
  const perform = async (request: SemanticRequest, execution: { readonly requestId?: string; readonly invocation?: CapturedInvocation; readonly referenceLifetime?: 'session' | 'command'; readonly constraints?: InputConstraints }, deferred: boolean): Promise<ApplicationResult> => {
    const context: ApplicationContext = freezeOwned({ ...initiation(request, execution.requestId, investigation.bounds), ...(execution.invocation ? { invocation: execution.invocation } : {}) });
    const work = new RequestWork(context, state!.store, progress, controller.signal); currentWork = work;
    try {
      await check();
      const result = await state!.execute(context, work, execution.referenceLifetime ?? lifetime.referenceLifetime ?? 'session', execution.constraints);
      if (!deferred) await check();
      alive();
      const attribution = finishWork(work, result.kind === 'resolution' ? 'refused' : result.kind === 'answer' && result.failed ? 'failed' : 'completed');
      return freezeOwned({ ...result, attribution });
    } catch (error) {
      if (operationalIO(error)) {
        try { await check(); } catch (invalid) { failWork(work, invalid); throw invalid; }
        error = new AnalysisFailure(error.message);
      }
      failWork(work, error); throw error;
    }
  };
  const session: ApplicationSession = {
    id,
    capabilities: () => freezeOwned(Object.values(catalog.lenses).map(({ requirements, ...lens }) => ({ ...lens, requirements: requirements.kind === 'interpretation' ? requirements : { kind: requirements.kind } }))),
    check: () => operation(check), usage: usageReport, work: () => currentWork?.snapshot() ?? latestWork,
    execute(request, execution = {}) {
      const captured = captureApplicationRequest(request, catalog.lenses);
      const supplied = captureFields(execution);
      const requestId = typeof supplied.input.requestId === 'string' ? supplied.input.requestId : undefined;
      const descriptor = execution && typeof execution === 'object' ? Object.getOwnPropertyDescriptor(execution, 'invocation') : undefined;
      const invocation = descriptor && 'value' in descriptor && descriptor.value !== undefined ? captureFields(descriptor.value, 'invocation')
        : supplied.problems.some(problem => problem.omittedField === 'invocation') ? { input: {}, problems: supplied.problems.filter(problem => problem.omittedField === 'invocation') } : undefined;
      return operation(() => perform(captured, { ...(requestId ? { requestId } : {}), ...(invocation ? { invocation: { fields: invocation.input, problems: invocation.problems } } : {}) }, false));
    },
    interrupt: () => dispose(new CommandInterrupted()),
    async close() { state = undefined; lifetime.signal?.removeEventListener('abort', interrupt); await dispose(new SessionClosed()); },
  };
  registerOperationHost(session, {
    run: client => operation(async () => {
      let active = true, used = false, port: ReferenceBinding | undefined;
      const allowed = () => { alive(); if (invalid) throw new SessionInvalidated(); if (!active) throw new Error('Operation binding capability expired'); };
      try {
        return await client({
          async check() { allowed(); await check(); allowed(); },
          async execute(request, execution = {}) {
            allowed(); if (used) throw new Error('An operation scope accepts exactly one request'); used = true;
            const result = await perform(freezeOwned(structuredClone(request)), freezeOwned(structuredClone(execution)), true);
            if (result.kind === 'answer' && result.answer.content.contract === 'investigation' && result.answer.mechanical === null) port = referenceBinding(state!.store, id, result.answer.content.value.references);
            return result;
          },
          bindings: Object.freeze({ bind(ids: readonly RecordId[], kind: ReferenceKind) { allowed(); if (!port) throw new Error('No investigation binding population for this operation'); return port.bind(ids, kind); } }),
        });
      } finally { active = false; port = undefined; }
    }),
    evaluate: request => {
      const captured = freezeOwned(structuredClone(request));
      return operation(async () => {
        const context = initiation({ kind: 'operation', operation: captured }, undefined, investigation.bounds);
        const work = new RequestWork(context, state!.store, progress, controller.signal); currentWork = work;
        try {
          await check();
          const result = await state!.evaluate(context.request.operation, work);
          await check(); alive();
          return freezeOwned({ ...result, context, attribution: finishWork(work, result.unavailable || result.evaluation?.outcome.kind !== 'accepted' ? 'failed' : 'completed') });
        } catch (error) { failWork(work, error); throw error; }
      });
    },
  });
  return { status: 'opened', session };
}

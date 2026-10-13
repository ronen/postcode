import { mechanicalImplementation } from './mechanical-implementations.js';
import { createMechanicalView, renderMechanicalView } from './program-presentation.js';
import { planPresentation, settlePresentation, presentedOptions, materializationLimitations } from './presentation-contracts.js';
import type { PresentationContent } from './presentation-contracts.js';
import { resolveInvestigationContent } from './investigation/content.js';
import { selectInvestigation } from './investigation/selection.js';
import type { SubjectResolution } from './subject-resolution.js';
import { captureCatalog, defaultCatalog } from './request-catalog.js';
import type { RequestCatalog, CapturedCatalog } from './request-catalog.js';
import { resolutionContext } from './resolution-context.js';
import { resolveSubjects, resolutionExplanation } from './subject-resolution.js';
import { freezeOwned } from './immutable.js';
import { initiation, RequestWork } from './work-attribution.js';
import type { WorkProgress, WorkReport } from './work-attribution.js';
import { captureRequest, invalidParameters, invalidDesignation, invalidReportInputs } from './requests.js';
import type { ViewRequest, CapturedRequest, ResultContract } from './requests.js';
export type { ViewRequest } from './requests.js';
import { renderRequestReport, rejectedRequestResult } from './request-reporting.js';
import type { RequestContext, ResolutionReport, UsageReport } from './request-reporting.js';
import { createAssociatedInspectionView } from './investigation/associations.js';
import { methods } from './identity.js';
import { investigationEvaluation } from './investigation/evaluation.js';
import type { InvestigationDependencies } from './investigation/evaluation.js';
import { InvestigationUsage } from './investigation/usage.js';
import { usageSummary } from './investigation/reporting.js';
import { createInvestigationView, renderInvestigationView } from './investigation/presentation.js';
import type { AttemptReport, InvestigationRequest } from './investigation/contracts.js';
import type { RecordId } from './records.js';
import { AnalysisFailure, SessionInvalidated, SessionClosed, CommandInterrupted, CleanupIncomplete, operationalIO } from './execution-errors.js';
import { GitExecutionOwner } from './git-execution.js';
import type { RunGit } from './git-execution.js';
import { OutputBoundaryFailure } from './output-boundary.js';
import { evaluateModules } from './evaluation.js';
import { MemoryProgramRecordStore } from './memory-store.js';
import { evaluateOrganization } from './organization/evaluate.js';

import type { ModuleAnalysis } from './evaluation.js';
import type { SessionId } from './records.js';
import { openTypeScriptProject } from './typescript/project.js';
import type { ProjectOptions } from './typescript/project.js';

export { AnalysisFailure, SessionInvalidated } from './execution-errors.js';

export interface ExecutionOptions {
  /** Occurrence correlation supplied by a publisher, never a reusable-work key. */
  readonly requestId?: string;
  /** The publisher must check after delivery and before emitting this result. */
  readonly deferPublicationCheck?: boolean;
}

/** One configured project and its accumulating transient program records. */
export async function openSession(options: ProjectOptions, lifetime: { runGit?: RunGit; signal?: AbortSignal; investigation?: InvestigationDependencies; onWork?: (progress: WorkProgress) => void } = {}, definitions: RequestCatalog = defaultCatalog) {
  const catalog = captureCatalog(definitions);
  const investigation = { ...lifetime.investigation, ...(lifetime.investigation?.bounds
    ? { bounds: freezeOwned(structuredClone(lifetime.investigation.bounds)) } : {}) };
  const owner = lifetime.runGit ? undefined : new GitExecutionOwner();
  const controller = new AbortController();
  const reports = new Map<RecordId, AttemptReport>();
  const usage = new InvestigationUsage();
  const usageReport = () => usageSummary([...reports.values()]);
  let disposed: Error | undefined;
  let busy = false;
  const dispose = (reason: Error) => { disposed ??= reason; controller.abort(reason); return owner?.close(reason) ?? Promise.resolve(); };
  const interrupt = () => { void dispose(new CommandInterrupted()).catch(() => {}); };
  lifetime.signal?.addEventListener('abort', interrupt, { once: true });
  if (lifetime.signal?.aborted) interrupt();
  const alive = () => { if (disposed) throw disposed; };
  let opened;
  try {
    alive();
    opened = await openTypeScriptProject(options, lifetime.runGit ?? owner!.run);
    alive();
  } catch (error) {
    lifetime.signal?.removeEventListener('abort', interrupt);
    await dispose(error instanceof Error ? error : new Error('Opening failed'));
    if (!operationalIO(error)) throw error;
    return { status: 'project-open-failed' as const, diagnostics: [], operational: {
      operation: 'project input acquisition', path: options.configPath, reason: error.message,
    } };
  }
  if (opened.status !== 'opened') {
    lifetime.signal?.removeEventListener('abort', interrupt);
    await dispose(new SessionClosed());
    return opened;
  }
  const id: SessionId = opened.session;
  let state: { store: MemoryProgramRecordStore; execute: ReturnType<typeof requestExecutor>; evaluate(request: InvestigationRequest, work: RequestWork): ReturnType<ReturnType<typeof investigationEvaluation>['evaluate']>; changed: () => Promise<boolean> } | undefined;
  let invalid = false;
  const check = async () => {
    alive();
    if (!state) throw new SessionClosed();
    if (!invalid) {
      try { invalid = await state.changed(); }
      catch (error) {
        // The owner reports cleanup separately when closed; an unverified basis
        // cannot continue or be relabelled as an internal programming defect.
        if (!operationalIO(error) && !(error instanceof OutputBoundaryFailure) && !(error instanceof CleanupIncomplete)) throw error;
        invalid = true;
      }
    }
    alive();
    if (invalid) { const error = new SessionInvalidated(); controller.abort(error); throw error; }
  };
  const store = new MemoryProgramRecordStore();
  const integration = investigationEvaluation(store, opened.analysis, id, usage, { ...investigation,
    onReport: report => { reports.set(report.attempt, report); investigation.onReport?.(report); },
    onProgress: report => { reports.set(report.attempt, report); investigation.onProgress?.(report); },
  }, check, controller.signal, catalog.operations);
  state = { store, execute: requestExecutor(store, opened.analysis, id, integration, usageReport, catalog), changed: opened.changed,
    evaluate: (request, work) => {
      evaluateModules(store, opened.analysis, [], work.scope('Establish the module basis for direct interpretation.'));
      return integration.evaluate(request, work);
    } };
  const operation = async <T>(run: () => Promise<T>): Promise<T> => {
    alive();
    if (busy) throw new Error('Concurrent session command');
    busy = true;
    try { return await run(); } finally { busy = false; }
  };
  let latestWork: WorkReport | undefined;
  let currentWork: RequestWork | undefined;
  const finishWork = (work: RequestWork, status: Exclude<WorkReport['status'], 'running'>, reason?: string) => {
    latestWork = work.finish(status, reason); currentWork = undefined;
    return latestWork;
  };
  const progress = lifetime.onWork;
  const failWork = (work: RequestWork, error: unknown) => finishWork(work, error instanceof CommandInterrupted ? 'interrupted'
    : error instanceof SessionInvalidated ? 'invalidated' : error instanceof AnalysisFailure ? 'failed' : 'defect',
    'Execution threw before completing the request; work without a returned boundary outcome is unknown.');
  return { status: 'opened' as const, session: {
    id, check: () => operation(check), usage: usageReport, work: () => currentWork?.snapshot() ?? latestWork,
    evaluateInvestigation: (request: InvestigationRequest) => operation(async () => {
      const context = initiation({ kind: 'operation', operation: request }, undefined, investigation.bounds);
      const work = new RequestWork(context, state!.store, progress, controller.signal); currentWork = work;
      try {
        await check();
        const result = await state!.evaluate(context.request.operation, work);
        await check(); alive();
        return { ...result, context, attribution: finishWork(work, result.unavailable || result.evaluation?.outcome.kind !== 'accepted' ? 'failed' : 'completed') };
      } catch (error) { failWork(work, error); throw error; }
    }),
    execute: (request: ViewRequest, execution: ExecutionOptions = {}) => {
      const captured = captureRequest(request, catalog.lenses);
      execution = { ...execution };
      return operation(async () => {
        const context = initiation(captured.normalized, execution.requestId, investigation.bounds);
        const work = new RequestWork(context, state!.store, progress, controller.signal); currentWork = work;
        try {
          await check();
          const result = await state!.execute(captured, context, work);
          if (!execution.deferPublicationCheck) await check();
          alive();
          const attribution = finishWork(work, result.kind === 'resolution' ? 'refused' : 'failed' in result && result.failed ? 'failed' : 'completed');
          if (result.kind === 'view') return { ...result, attribution };
          if (result.kind === 'resolution') {
            const report = freezeOwned({ ...result.report, attribution });
            return { ...result, report, attribution, rendered: renderRequestReport(report) };
          }
          const report = freezeOwned({ ...result.report, attribution });
          return { ...result, report, attribution, rendered: renderRequestReport(report) };
        } catch (error) {
          if (operationalIO(error)) {
            try { await check(); } catch (invalid) { failWork(work, invalid); throw invalid; }
            error = new AnalysisFailure(error.message);
          }
          failWork(work, error);
          throw error;
        }
      });
    },
    async close() {
      state = undefined;
      lifetime.signal?.removeEventListener('abort', interrupt);
      await dispose(new SessionClosed());
    },
  } };
}

function requestExecutor(store: MemoryProgramRecordStore, analysis: ModuleAnalysis, session: SessionId,
  integration: ReturnType<typeof investigationEvaluation>, usage: () => ReturnType<typeof usageSummary>, catalog: CapturedCatalog) {
  return async (capturedRequest: CapturedRequest, context: RequestContext, work: RequestWork) => {
    const lookupWork = work.scope('Establish qualified populations to resolve the requested subject.', null, 'resolution-prerequisite');
    const answerWork = work.scope('Materialize requirements and declared expansions for the requested answer.');
    const consumeInterpretation = (projection: RecordId) => {
      const selection = store.get(projection);
      if (selection.kind !== 'investigation-selection-projection') return;
      const records = [...new Set([...selection.relations.flatMap(item => [item.original, item.account]),
        ...selection.displaced, ...selection.associated])];
      if (records.length) answerWork.record('interpretation', 'consumed', { records,
        limitations: ['Retained interpretation and revision/association selection; no new inference or independent corroboration.'] });
    };
    if (context.request.kind === 'rejected') return rejectedRequestResult(session, context, usage());
    const request = capturedRequest.input;
    if (!request) throw new Error('Validated request input missing');
    const parameterError = invalidParameters(context.request, catalog.lenses);
    const reportError = invalidReportInputs(context.request);
    const invalid = parameterError ?? reportError ?? invalidDesignation(context.request, request, catalog.lenses);
    if (invalid) {
      const report: ResolutionReport = { schema: 'postcode-resolution/1-experimental', session, context, usage: usage(),
        resolution: { reason: parameterError ? 'invalid-parameters' : reportError ? 'invalid-report-inputs' : 'invalid-designation', explanation: invalid, candidates: [], criteria: [parameterError ? 'Declared Lens parameters' : reportError ? 'Subjectless usage report' : 'Declared Lens subjects and cardinality'], qualifications: [], prerequisites: [], retainedAnswers: [] } };
      return { kind: 'resolution' as const, context, report, rendered: renderRequestReport(report), failed: true };
    }
    if (context.request.kind === 'report') {
      const report: UsageReport = { schema: 'postcode-investigation-usage/1-experimental', session, context, usage: usage() };
      return { kind: 'usage' as const, context, report, rendered: renderRequestReport(report), failed: false };
    }
    const definition = catalog.lenses[context.request.lens]!;
    const presentationFailure = (explanation: string, resolution?: SubjectResolution, retainedAnswers: readonly RecordId[] = [], content?: PresentationContent) => {
      const report: ResolutionReport = freezeOwned({ schema: 'postcode-resolution/1-experimental', session, context, usage: usage(),
        resolution: { reason: 'presentation-unavailable', explanation, candidates: resolution?.candidates ?? [],
          criteria: [...(resolution?.criteria ?? []), 'Compatible qualified result contract and explicit Presentation choices'],
          qualifications: [...new Set([...(resolution?.qualifications ?? []), ...(content ? materializationLimitations(content) : [])])], prerequisites: resolution?.prerequisites ?? [],
          support: resolution?.support ?? [], retainedAnswers } });
      return { kind: 'resolution' as const, context, report, rendered: renderRequestReport(report), failed: true };
    };
    const normalizedRequest = context.request;
    const plans = new Map(definition.results.map(contract => [contract, planPresentation(catalog.presentations, contract, normalizedRequest, definition)]));
    if (![...plans.values()].some(plan => plan.length)) return presentationFailure('No Presentation accepts the prospective answer contract with the supplied format, source and paging choices.');
    const mechanical = mechanicalImplementation(definition);
    const lens = context.request.lens;
    const operation = definition.requirements.kind === 'interpretation' ? definition.requirements.operation : null;
    const investigationLens = operation !== null;
    // Resolve precise references before acquiring any lookup or application information.
    // Literal lookup evaluates only the populations required to identify applicable subjects.
    const designation = context.request.designation;
    const lookupModules = designation.kind === 'name' && definition.subjects.includes('module')
      ? evaluateModules(store, analysis, mechanical?.lookup.modules ?? [], lookupWork) : undefined;
    const lookupOrganization = lookupModules && definition.subjects.includes('group')
      ? evaluateOrganization(store, lookupModules, mechanical?.lookup.groups ?? [], lookupWork) : undefined;
    const resolution = resolveSubjects(store, session, definition, designation,
      { ...(lookupModules ? { modules: lookupModules } : {}), ...(lookupOrganization ? { organization: lookupOrganization } : {}) });
    if (resolution.status !== 'resolved') {
      const report: ResolutionReport = freezeOwned({ schema: 'postcode-resolution/1-experimental', session, context, usage: usage(),
        resolution: { ...resolution, reason: resolution.status, explanation: resolutionExplanation(resolution), retainedAnswers: [] } });
      return { kind: 'resolution' as const, context, report, rendered: renderRequestReport(report), failed: true };
    }
    const displayResolution = resolutionContext(designation, resolution);
    const selected = resolution.candidates.map(candidate => candidate.id);
    const interpretationInspection = definition.requirements.kind === 'inspection' && resolution.candidates[0]?.kind === 'investigram';
    const contract: ResultContract = investigationLens ? 'investigation' : mechanical!.contract(resolution);
    const presentationPlan = plans.get(contract) ?? [];
    if (!presentationPlan.length) return presentationFailure('No compatible Presentation accepts the resolved subject’s answer contract and supplied choices.', resolution);
    const moduleExpansions = [...new Set([...(mechanical?.required.modules ?? []), ...presentationPlan.flatMap(item => item.requirements.modules)])];
    const groupExpansions = [...new Set([...presentationPlan.flatMap(item => item.requirements.groups),
      ...(mechanical?.required.groups ?? [])])];
    if (investigationLens || interpretationInspection) {
      const basis = evaluateModules(store, analysis, [], answerWork);
      answerWork.check();
      if (definition.subjects.includes('module') && investigationLens) store.entityIds(basis.modules, 'module');
      else store.entityIds(store.investigations(session).flatMap(item => item.investigrams), 'investigram');
      const result = investigationLens && selected.length === 1
        ? await integration.evaluate({ operation: operation!, subject: selected[0]!, parameters: {} }, work) : null;
      answerWork.check();
      const viewRequest = { ...request, resolution: displayResolution, lens, definition, title: interpretationInspection ? `${definition.title} · investigram` : definition.title };
      const content = resolveInvestigationContent(store, selectInvestigation(store, session, viewRequest, selected, result));
      consumeInterpretation(content.projection.id);
      const decision = settlePresentation(presentationPlan, { contract: 'investigation', value: content });
      if (!decision) return presentationFailure('The retained interpretation answer does not meet the Presentation materialization precondition; no compatible declared fallback applies.', resolution, [content.projection.id], { contract: 'investigation', value: content });
      const { view, investigationArrangementKey } = createInvestigationView(store, session,
        { ...viewRequest, presentation: presentedOptions(request.presentation, decision) }, selected, result, usage(), content);

      const sessionContext = store.get(session);
      if (sessionContext.kind !== 'session') throw new Error('Expected session');
      const repository = sessionContext.repository ? store.get(sessionContext.repository) : null;
      return { kind: 'view' as const, context, resolution, view, investigationArrangementKey, rendered: renderInvestigationView(view), repositoryRoot: repository?.kind === 'repository-evidence' && repository.capture.status === 'available' ? repository.capture.evidence.root : null,
        methods: [...sessionContext.methods, methods.investigationEvaluation, methods.investigationPresentation],
        failed: !!investigationLens && (!result?.evaluation || result.evaluation.outcome.kind !== 'accepted') || view.investigations?.status === 'unknown-continuation' };
    }
    if (!mechanical) throw new Error('Missing mechanical implementation');
    const constructed = mechanical.construct({ store, analysis, subjects: selected, request: normalizedRequest,
      expansions: { modules: moduleExpansions, groups: groupExpansions }, work: answerWork });
    const content = constructed.content;
    const decision = settlePresentation(presentationPlan, content);
    if (!decision) return presentationFailure('The retained answer does not meet the Presentation materialization precondition; no compatible declared fallback applies.', resolution,
      constructed.retainedAnswers, content);
    const presentation = presentedOptions(request.presentation, decision);
    let view = createMechanicalView(store, content, presentation, definition.title, displayResolution);
    if (constructed.associatedSubjects) {
      if (view.schema !== 'postcode-view/1-experimental' && view.schema !== 'postcode-organization-view/1-experimental') throw new Error('Invalid associated-inspection contract');
      view = createAssociatedInspectionView(store, view, constructed.associatedSubjects, request.after, request.referenceLifetime);
    }
    consumeInterpretation(view.projection.id);
    const rendered = renderMechanicalView(view);
    const projection = content.value.projection;
    const sessionContext = store.get(projection.session);
    if (sessionContext.kind !== 'session') throw new Error('Expected analysis session');
    const captured = sessionContext.repository ? store.get(sessionContext.repository) : null;
    const repositoryRoot = captured?.kind === 'repository-evidence' && captured.capture.status === 'available' ? captured.capture.evidence.root : null;
    return { kind: 'view' as const, context, resolution, view, investigationArrangementKey: null, rendered, repositoryRoot, methods: constructed.associatedSubjects ? [...sessionContext.methods, methods.investigationPresentation] : sessionContext.methods,
      ...('investigations' in view && view.investigations?.status === 'unknown-continuation' ? { failed: true } : {}) };
  };
}

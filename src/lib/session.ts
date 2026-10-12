import { resolveSubjects, resolutionExplanation } from './subject-resolution.js';
import { freezeOwned } from './immutable.js';
import { randomUUID } from 'node:crypto';
import { lenses, captureRequest, invalidParameters, invalidDesignation, invalidReportInputs } from './requests.js';
import type { ViewRequest, CapturedRequest } from './requests.js';
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
import { evaluateDependencies } from './dependencies/evaluate.js';
import { evaluateDependencyOrganization } from './dependencies/organization.js';
import { dependencyStructure, dependencyChildren, dependencyParents } from './dependencies/projections.js';
import { createDependencyView, dependencyPresentationRequirements, renderDependencyView } from './dependencies/presentation.js';
import { MemoryProgramRecordStore } from './memory-store.js';
import { createView, presentationRequirements, renderView } from './presentation.js';
import { modules } from './projections.js';
import { evaluateOrganization } from './organization/evaluate.js';
import { inspectOrganization, organization } from './organization/projections.js';
import { createOrganizationView, organizationPresentationRequirements, renderOrganizationView } from './organization/presentation.js';
import type { EvaluationRecord, ProjectionRecord } from './records.js';

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
export async function openSession(options: ProjectOptions, lifetime: { runGit?: RunGit; signal?: AbortSignal; investigation?: InvestigationDependencies } = {}) {
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
  let state: { execute: ReturnType<typeof requestExecutor>; evaluate(request: InvestigationRequest): ReturnType<ReturnType<typeof investigationEvaluation>['evaluate']>; changed: () => Promise<boolean> } | undefined;
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
  const integration = investigationEvaluation(store, opened.analysis, id, usage, { ...lifetime.investigation,
    onReport: report => { reports.set(report.attempt, report); lifetime.investigation?.onReport?.(report); },
    onProgress: report => { reports.set(report.attempt, report); lifetime.investigation?.onProgress?.(report); },
  }, check, controller.signal);
  state = { execute: requestExecutor(store, opened.analysis, id, integration, usageReport), changed: opened.changed,
    evaluate: request => { evaluateModules(store, opened.analysis); return integration.evaluate(request); } };
  const operation = async <T>(run: () => Promise<T>): Promise<T> => {
    alive();
    if (busy) throw new Error('Concurrent session command');
    busy = true;
    try { return await run(); } finally { busy = false; }
  };
  return { status: 'opened' as const, session: {
    id, check: () => operation(check), usage: usageReport,
    evaluateInvestigation: (request: InvestigationRequest) => operation(async () => {
      await check(); return state!.evaluate(request);
    }),
    execute: (request: ViewRequest, execution: ExecutionOptions = {}) => {
      const captured = captureRequest(request);
      execution = { ...execution };
      return operation(async () => {
        await check();
        try {
          const result = await state!.execute(captured, execution.requestId);
          if (!execution.deferPublicationCheck) await check();
          alive();
          return result;
        } catch (error) {
          if (operationalIO(error)) { await check(); throw new AnalysisFailure(error.message); }
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
  integration: ReturnType<typeof investigationEvaluation>, usage: () => ReturnType<typeof usageSummary>) {
  return async (capturedRequest: CapturedRequest, requestId: string = randomUUID()) => {
    const context: RequestContext = freezeOwned({ id: requestId, initiator: 'caller', request: capturedRequest.normalized });
    if (context.request.kind === 'rejected') return rejectedRequestResult(session, context, usage());
    const request = capturedRequest.input;
    if (!request) throw new Error('Validated request input missing');
    const parameterError = invalidParameters(context.request);
    const reportError = invalidReportInputs(context.request);
    const invalid = parameterError ?? reportError ?? invalidDesignation(context.request, request);
    if (invalid) {
      const report: ResolutionReport = { schema: 'postcode-resolution/1-experimental', session, context, usage: usage(),
        resolution: { reason: parameterError ? 'invalid-parameters' : reportError ? 'invalid-report-inputs' : 'invalid-designation', explanation: invalid, candidates: [], criteria: [parameterError ? 'Declared Lens parameters' : reportError ? 'Subjectless usage report' : 'Declared Lens subjects and cardinality'], qualifications: [], prerequisites: [], retainedAnswers: [] } };
      return { kind: 'resolution' as const, context, report, rendered: renderRequestReport(report), failed: true };
    }
    if (context.request.kind === 'report') {
      const report: UsageReport = { schema: 'postcode-investigation-usage/1-experimental', session, context, usage: usage() };
      return { kind: 'usage' as const, context, report, rendered: renderRequestReport(report), failed: false };
    }
    const definition = lenses[context.request.lens];
    const { selector, presentation } = request;
    const lens = context.request.lens;
    const operation = definition.requirements.kind === 'interpretation' ? definition.requirements.operation : null;
    const investigationLens = operation !== null;
    // Resolve precise references before acquiring any lookup or application information.
    // Literal lookup evaluates only the populations required to identify applicable subjects.
    const designation = context.request.designation;
    const lookupModules = designation.kind === 'name' && definition.subjects.includes('module')
      ? evaluateModules(store, analysis, investigationLens ? [] : organizationPresentationRequirements.modules) : undefined;
    const lookupOrganization = lookupModules && definition.subjects.includes('group')
      ? evaluateOrganization(store, lookupModules, organizationPresentationRequirements.groups) : undefined;
    const resolution = resolveSubjects(store, session, definition, designation,
      { ...(lookupModules ? { modules: lookupModules } : {}), ...(lookupOrganization ? { organization: lookupOrganization } : {}) });
    if (resolution.status !== 'resolved') {
      const report: ResolutionReport = freezeOwned({ schema: 'postcode-resolution/1-experimental', session, context, usage: usage(),
        resolution: { ...resolution, reason: resolution.status, explanation: resolutionExplanation(resolution), retainedAnswers: [] } });
      return { kind: 'resolution' as const, context, report, rendered: renderRequestReport(report), failed: true };
    }
    const selected = resolution.candidates.map(candidate => candidate.id);
    const interpretationInspection = lens === 'inspect' && resolution.candidates[0]?.kind === 'investigram';
    if (investigationLens || interpretationInspection) {
      const basis = evaluateModules(store, analysis);
      if (definition.subjects.includes('module') && investigationLens) store.entityIds(basis.modules, 'module');
      else store.entityIds(store.investigations(session).flatMap(item => item.investigrams), 'investigram');
      const result = investigationLens && selected.length === 1
        ? await integration.evaluate({ operation: operation!, subject: selected[0]!, parameters: {} }) : null;
      const { view, investigationArrangementKey } = createInvestigationView(store, session, { ...request, lens: lens as 'summarize' | 'explain' | 'decompose' | 'examine' | 'inspect' | 'dependency-children' | 'dependency-parents' }, selected, result, usage());
      const sessionContext = store.get(session);
      if (sessionContext.kind !== 'session') throw new Error('Expected session');
      const repository = sessionContext.repository ? store.get(sessionContext.repository) : null;
      return { kind: 'view' as const, context, resolution, view, investigationArrangementKey, rendered: renderInvestigationView(view), repositoryRoot: repository?.kind === 'repository-evidence' && repository.capture.status === 'available' ? repository.capture.evidence.root : null,
        methods: [...sessionContext.methods, methods.investigationEvaluation, methods.investigationPresentation],
        failed: !!investigationLens && (selected.length !== 1 || !result?.evaluation || result.evaluation.outcome.kind !== 'accepted') || !!interpretationInspection && selected.length !== 1 || view.investigations?.status === 'unknown-continuation' };
    }
    const dependencyLens = definition.requirements.kind === 'dependencies';
    // Provider/evaluation reuse owns input-basis validity; an outer cache could hide new acquisition.
    const dependencyOutcome = dependencyLens ? evaluateDependencies(store, analysis, dependencyPresentationRequirements.modules) : null;
    const expansions = lens === 'modules' ? presentationRequirements(presentation) : organizationPresentationRequirements.modules;
    const evaluation = dependencyOutcome ? store.get(dependencyOutcome.moduleEvaluation) as EvaluationRecord
      : evaluateModules(store, analysis, expansions);
    const organizationOutcome = lens === 'modules' ? null : evaluateOrganization(store, evaluation, organizationPresentationRequirements.groups);
    const dependencyOrganization = dependencyLens ? evaluateDependencyOrganization(store, dependencyOutcome!, organizationOutcome!) : null;
    const projection = dependencyLens
      ? lens === 'dependency-structure' ? dependencyStructure(store, dependencyOutcome!, dependencyOrganization!.id)
        : lens === 'dependency-children' ? dependencyChildren(store, dependencyOutcome!, selector!, request.reference ?? false, dependencyOrganization!.id, selected)
          : dependencyParents(store, dependencyOutcome!, selector!, request.reference ?? false, dependencyOrganization!.id, selected)
      : lens === 'modules' ? modules(store, evaluation) : lens === 'inspect'
        ? inspectOrganization(store, organizationOutcome!, selector!, request.reference ?? false, selected)
        : organization(store, organizationOutcome!, request.subject === 'repository' ? 'repository' : 'configured-project');
    const moduleProjection = projection.kind === 'organization-projection' && projection.moduleProjection
      ? store.get(projection.moduleProjection) as ProjectionRecord : null;
    const moduleOnly = projection.kind === 'organization-projection' && projection.lens === 'inspect' && projection.groups.length === 0
      && moduleProjection !== null && (moduleProjection.modules.length > 0 || organizationOutcome!.groups.length === 0);
    const mechanicalView = projection.kind === 'dependency-projection' ? createDependencyView(store, projection, presentation)
      : projection.kind === 'projection' ? createView(store, projection, presentation)
      : moduleOnly ? createView(store, moduleProjection!, presentation)
      : createOrganizationView(store, projection, presentation);
    const inspectedSubjects = projection.kind === 'organization-projection' ? [...projection.groups, ...(moduleProjection?.modules ?? [])] : projection.kind === 'projection' ? projection.modules : [];
    const view = lens === 'inspect' ? createAssociatedInspectionView(store, mechanicalView, inspectedSubjects, request.after, request.referenceLifetime) : mechanicalView;
    const rendered = view.schema === 'postcode-dependency-view/1-experimental' ? renderDependencyView(view)
      : view.schema === 'postcode-view/1-experimental' ? renderView(view) : renderOrganizationView(view);
    const sessionContext = store.get(projection.session);
    if (sessionContext.kind !== 'session') throw new Error('Expected analysis session');
    const captured = sessionContext.repository ? store.get(sessionContext.repository) : null;
    const repositoryRoot = captured?.kind === 'repository-evidence' && captured.capture.status === 'available' ? captured.capture.evidence.root : null;
    return { kind: 'view' as const, context, resolution, view, investigationArrangementKey: null, rendered, repositoryRoot, methods: lens === 'inspect' ? [...sessionContext.methods, methods.investigationPresentation] : sessionContext.methods,
      ...('investigations' in view && view.investigations?.status === 'unknown-continuation' ? { failed: true } : {}) };
  };
}

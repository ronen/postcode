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
import type { Presentation } from './presentation.js';
import { openTypeScriptProject } from './typescript/project.js';
import type { ProjectOptions } from './typescript/project.js';

export { AnalysisFailure, SessionInvalidated } from './execution-errors.js';

export interface ViewRequest {
  readonly lens: 'modules' | 'inspect' | 'organization' | 'dependencies' | 'children' | 'parents';
  readonly selector: string | null;
  readonly reference?: boolean;
  readonly subject?: 'project' | 'repository';
  readonly presentation: Presentation;
}

export interface ExecutionOptions {
  /** The publisher must check after delivery and before emitting this result. */
  readonly deferPublicationCheck?: boolean;
}

/** One configured project and its accumulating transient program records. */
export async function openSession(options: ProjectOptions, lifetime: { runGit?: RunGit; signal?: AbortSignal } = {}) {
  const owner = lifetime.runGit ? undefined : new GitExecutionOwner();
  let disposed: Error | undefined;
  let busy = false;
  const dispose = (reason: Error) => { disposed ??= reason; return owner?.close(reason) ?? Promise.resolve(); };
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
  let state: { execute: ReturnType<typeof requestExecutor>; changed: () => Promise<boolean> } | undefined = {
    execute: requestExecutor(new MemoryProgramRecordStore(), opened.analysis), changed: opened.changed,
  };
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
    if (invalid) throw new SessionInvalidated();
  };
  const operation = async <T>(run: () => Promise<T>): Promise<T> => {
    alive();
    if (busy) throw new Error('Concurrent session command');
    busy = true;
    try { return await run(); } finally { busy = false; }
  };
  return { status: 'opened' as const, session: {
    id, check: () => operation(check),
    execute: (request: ViewRequest, execution: ExecutionOptions = {}) => operation(async () => {
      await check();
      try {
        const result = state!.execute(request);
        if (!execution.deferPublicationCheck) await check();
        alive();
        return result;
      } catch (error) {
        if (operationalIO(error)) { await check(); throw new AnalysisFailure(error.message); }
        throw error;
      }
    }),
    async close() {
      state = undefined;
      lifetime.signal?.removeEventListener('abort', interrupt);
      await dispose(new SessionClosed());
    },
  } };
}

function requestExecutor(store: MemoryProgramRecordStore, analysis: ModuleAnalysis) {
  return (request: ViewRequest) => {
    const { lens, selector, presentation } = request;
    const dependencyLens = ['dependencies', 'children', 'parents'].includes(lens);
    // Provider/evaluation reuse owns input-basis validity; an outer cache could hide new acquisition.
    const dependencyOutcome = dependencyLens ? evaluateDependencies(store, analysis, dependencyPresentationRequirements.modules) : null;
    const expansions = lens === 'modules' ? presentationRequirements(presentation) : organizationPresentationRequirements.modules;
    const evaluation = dependencyOutcome ? store.get(dependencyOutcome.moduleEvaluation) as EvaluationRecord
      : evaluateModules(store, analysis, expansions);
    const organizationOutcome = lens === 'modules' ? null : evaluateOrganization(store, evaluation, organizationPresentationRequirements.groups);
    const dependencyOrganization = dependencyLens ? evaluateDependencyOrganization(store, dependencyOutcome!, organizationOutcome!) : null;
    const projection = dependencyLens
      ? lens === 'dependencies' ? dependencyStructure(store, dependencyOutcome!, dependencyOrganization!.id)
        : lens === 'children' ? dependencyChildren(store, dependencyOutcome!, selector!, request.reference ?? false, dependencyOrganization!.id)
          : dependencyParents(store, dependencyOutcome!, selector!, request.reference ?? false, dependencyOrganization!.id)
      : lens === 'modules' ? modules(store, evaluation) : lens === 'inspect'
        ? inspectOrganization(store, organizationOutcome!, selector!, request.reference ?? false)
        : organization(store, organizationOutcome!, request.subject === 'repository' ? 'repository' : 'configured-project');
    const moduleProjection = projection.kind === 'organization-projection' && projection.moduleProjection
      ? store.get(projection.moduleProjection) as ProjectionRecord : null;
    const moduleOnly = projection.kind === 'organization-projection' && projection.lens === 'inspect' && projection.groups.length === 0
      && moduleProjection !== null && (moduleProjection.modules.length > 0 || organizationOutcome!.groups.length === 0);
    const view = projection.kind === 'dependency-projection' ? createDependencyView(store, projection, presentation)
      : projection.kind === 'projection' ? createView(store, projection, presentation)
      : moduleOnly ? createView(store, moduleProjection!, presentation)
      : createOrganizationView(store, projection, presentation);
    const rendered = view.schema === 'postcode-dependency-view/1-experimental' ? renderDependencyView(view)
      : view.schema === 'postcode-view/1-experimental' ? renderView(view) : renderOrganizationView(view);
    const context = store.get(projection.session);
    if (context.kind !== 'session') throw new Error('Expected analysis session');
    const captured = context.repository ? store.get(context.repository) : null;
    const repositoryRoot = captured?.kind === 'repository-evidence' && captured.capture.status === 'available' ? captured.capture.evidence.root : null;
    return { view, rendered, repositoryRoot, methods: context.methods };
  };
}

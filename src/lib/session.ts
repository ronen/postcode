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

export interface ViewRequest {
  readonly lens: 'modules' | 'inspect' | 'organization' | 'dependencies' | 'children' | 'parents';
  readonly selector: string | null;
  readonly subject?: 'project' | 'repository';
  readonly presentation: Presentation;
}

/** One configured project and its transient program records. Accumulation follows the checkpoint review. */
export function openSession(options: ProjectOptions) {
  const opened = openTypeScriptProject(options);
  if (opened.status !== 'opened') return opened;
  const id: SessionId = opened.session;
  let state: { store: MemoryProgramRecordStore; analysis: ModuleAnalysis } | undefined = {
    store: new MemoryProgramRecordStore(), analysis: opened.analysis,
  };
  let executed = false;
  return { status: 'opened' as const, session: {
    id,
    execute(request: ViewRequest) {
      if (!state) throw new Error('Session is closed');
      if (executed) throw new Error('This checkpoint supports one request per session');
      executed = true;
      return execute(state.store, state.analysis, request);
    },
    close() { state = undefined; },
  } };
}

function execute(store: MemoryProgramRecordStore, analysis: ModuleAnalysis, request: ViewRequest) {
  const { lens, selector, presentation } = request;
  const dependencyLens = ['dependencies', 'children', 'parents'].includes(lens);
  const dependencyOutcome = dependencyLens ? evaluateDependencies(store, analysis, dependencyPresentationRequirements.modules) : null;
  const evaluation = dependencyOutcome ? store.get(dependencyOutcome.moduleEvaluation) as EvaluationRecord
    : evaluateModules(store, analysis, lens === 'modules' ? presentationRequirements(presentation) : organizationPresentationRequirements.modules);
  const organizationOutcome = lens === 'modules' ? null : evaluateOrganization(store, evaluation, organizationPresentationRequirements.groups);
  const dependencyOrganization = dependencyLens ? evaluateDependencyOrganization(store, dependencyOutcome!, organizationOutcome!) : null;
  const projection = dependencyLens
    ? lens === 'dependencies' ? dependencyStructure(store, dependencyOutcome!, dependencyOrganization!.id)
      : lens === 'children' ? dependencyChildren(store, dependencyOutcome!, selector!, false, dependencyOrganization!.id)
        : dependencyParents(store, dependencyOutcome!, selector!, false, dependencyOrganization!.id)
    : lens === 'modules' ? modules(store, evaluation) : lens === 'inspect'
      ? inspectOrganization(store, organizationOutcome!, selector!, false)
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
}

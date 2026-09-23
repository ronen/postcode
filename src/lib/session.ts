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
import { canonical } from './identity.js';
import type { DependencyEvaluationRecord } from './dependencies/records.js';
import type { OrganizationEvaluationRecord } from './organization/records.js';
import type { EvaluationState, EvaluationRecord, ProjectionRecord } from './records.js';

import type { ModuleAnalysis } from './evaluation.js';
import type { SessionId } from './records.js';
import type { Presentation } from './presentation.js';
import { openTypeScriptProject } from './typescript/project.js';
import type { ProjectOptions } from './typescript/project.js';

export class AnalysisFailure extends Error {}

const operational = (error: unknown): error is Error => error instanceof Error && 'code' in error
  && ['EACCES', 'EPERM', 'ENOENT', 'ENOTDIR', 'ELOOP', 'EIO', 'EMFILE', 'ENFILE'].includes(String(error.code));

export class SessionInvalidated extends Error {
  constructor() { super('Session invalidated: relevant inputs changed or could not be verified. Restart to continue.'); }
}

export interface ViewRequest {
  readonly lens: 'modules' | 'inspect' | 'organization' | 'dependencies' | 'children' | 'parents';
  readonly selector: string | null;
  readonly reference?: boolean;
  readonly subject?: 'project' | 'repository';
  readonly presentation: Presentation;
}

/** One configured project and its accumulating transient program records. */
export function openSession(options: ProjectOptions) {
  const opened = openTypeScriptProject(options);
  if (opened.status !== 'opened') return opened;
  const id: SessionId = opened.session;
  let state: { execute: ReturnType<typeof requestExecutor>; changed: () => boolean } | undefined = {
    execute: requestExecutor(new MemoryProgramRecordStore(), opened.analysis), changed: opened.changed,
  };
  let invalid = false;
  const check = () => {
    if (!state) throw new Error('Session is closed');
    if (!invalid) {
      try { invalid = state.changed(); }
      catch (error) {
        if (!operational(error)) throw error;
        invalid = true;
      }
    }
    if (invalid) throw new SessionInvalidated();
  };
  return { status: 'opened' as const, session: {
    id, check,
    execute(request: ViewRequest) {
      if (!state) throw new Error('Session is closed');
      check();
      try {
        const result = state.execute(request);
        check();
        return result;
      } catch (error) {
        if (operational(error)) {
          check();
          throw new AnalysisFailure(error.message);
        }
        throw error;
      }
    },
    close() { state = undefined; },
  } };
}

function requestExecutor(store: MemoryProgramRecordStore, analysis: ModuleAnalysis) {
  const moduleOutcomes = new Map<string, EvaluationRecord>();
  const dependencyOutcomes = new Map<string, DependencyEvaluationRecord>();
  const organizationOutcomes = new Map<string, OrganizationEvaluationRecord>();
  const dependencyOrganizations = new Map<string, ReturnType<typeof evaluateDependencyOrganization>>();
  const reuse = <T extends Pick<EvaluationState, 'execution' | 'materialization'>>(cache: Map<string, T>, key: unknown, compute: () => T): T => {
    const encoded = canonical(key);
    const previous = cache.get(encoded);
    if (previous) return previous;
    const outcome = compute();
    if (outcome.execution === 'completed' && outcome.materialization === 'full') cache.set(encoded, outcome);
    return outcome;
  };
  return (request: ViewRequest) => {
    const { lens, selector, presentation } = request;
    const dependencyLens = ['dependencies', 'children', 'parents'].includes(lens);
    const dependencyOutcome = dependencyLens ? reuse(dependencyOutcomes, dependencyPresentationRequirements.modules,
      () => evaluateDependencies(store, analysis, dependencyPresentationRequirements.modules)) : null;
    const expansions = lens === 'modules' ? presentationRequirements(presentation) : organizationPresentationRequirements.modules;
    const evaluation = dependencyOutcome ? store.get(dependencyOutcome.moduleEvaluation) as EvaluationRecord
      : reuse(moduleOutcomes, expansions, () => evaluateModules(store, analysis, expansions));
    const organizationOutcome = lens === 'modules' ? null : reuse(organizationOutcomes, [evaluation.id, organizationPresentationRequirements.groups],
      () => evaluateOrganization(store, evaluation, organizationPresentationRequirements.groups));
    const dependencyOrganization = dependencyLens ? reuse(dependencyOrganizations, [dependencyOutcome!.id, organizationOutcome!.id],
      () => evaluateDependencyOrganization(store, dependencyOutcome!, organizationOutcome!)) : null;
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

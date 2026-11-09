import { openApplication } from '../../application/index.js';
import type { ApplicationDependencies, AnswerDelivery, ProjectOptions, PresentationDeclaration, ParameterValue } from '../../application/index.js';
import type { SemanticRequest } from '../../application/requests.js';
import { withCliOperation, evaluateOperation } from '../../application/operation-scope.js';
import { guardPublication } from '../../application/publication.js';
import { captureRequest } from '../../requests.js';
import type { ViewRequest, NormalizedRequest } from '../../requests.js';
import { captureCatalog, defaultCatalog } from '../../request-catalog.js';
import type { RequestCatalog } from '../../request-catalog.js';
import type { PresentationDefinition, PresentationDecision, PresentedOptions } from '../../presentation-contracts.js';
import { freezeOwned } from '../../immutable.js';
import { referenceNotice } from '../../answer-presentation.js';
import { resolutionContext } from '../../resolution-context.js';
import { arrangeModuleView } from '../../presentation.js';
import { arrangeOrganizationView } from '../../organization/presentation.js';
import { arrangeDependencyView } from '../../dependencies/presentation.js';
import { arrangeModuleExports } from '../../exports/presentation.js';
import { renderMechanicalView } from '../../program-presentation.js';
import { arrangeAssociatedInspection } from '../../investigation/associations.js';
import { arrangeInvestigationView, renderInvestigationView } from '../../investigation/presentation.js';
import { finalizeRequestReport, renderRequestReport } from '../../request-reporting.js';
import type { RequestContext, ResolutionReport, UsageReport } from '../../request-reporting.js';
import type { InitiationContext, WorkReport, WorkProgress } from '../../work-attribution.js';
import type { ReferenceBinding } from '../../reference-binding.js';
import type { AttemptReport, InvestigationRequest } from '../../investigation/contracts.js';
import type { InvestigationUsageReport } from '../../investigation/reporting.js';
import { artifactMethods } from './methods.js';

export type { ViewRequest } from '../../requests.js';
export { AnalysisFailure, SessionInvalidated } from '../../execution-errors.js';
export interface ExecutionOptions { readonly requestId?: string }

/** The client declares option meanings once. The application evaluates these
 * finite clauses against semantic facts; it never imports format or View types. */
export function applicationPresentation(definition: PresentationDefinition): PresentationDeclaration {
  const { id, default: isDefault, fallback, ...description } = definition;
  return { id, default: isDefault, contract: definition.contract, requirements: definition.requirements,
    precondition: definition.precondition, ...(fallback ? { fallback } : {}), description: description as unknown as Record<string, ParameterValue>,
    eligibility: [
      { option: 'format', when: 'always', values: definition.formats, label: 'format', includeValue: true },
      { option: 'moreDetails', when: 'truthy', label: '--more-details', ...(definition.source === 'none' ? { values: [false] }
        : definition.source === 'selected-subjects' ? { requires: ['selected-subjects' as const] } : {}) },
      { option: 'after', when: 'present', label: '--after', ...(definition.associationPage ? { requires: ['association' as const] } : { values: [] }) },
      { option: 'revisionPage', when: 'present', label: '--revision-page', ...(definition.revisionPage ? { requires: ['revision' as const] } : { values: [] }) },
    ] };
}

export function cliContext(context: InitiationContext): InitiationContext {
  if (context.request.kind === 'operation' || !context.invocation) return context;
  const { invocation, ...owned } = context;
  const request = context.request;
  const presentation = invocation.fields.presentation as unknown as NormalizedRequest['presentation'];
  const referenceLifetime = invocation.fields.referenceLifetime as 'session' | 'command';
  const { consumption: _consumption, requirements: _requirements, ...semantic } = request;
  const normalized = request.kind === 'present' ? { kind: 'present' as const, target: request.target, presentation, referenceLifetime }
    : request.kind === 'rejected' ? { ...semantic, presentation, referenceLifetime }
      : { presentation, referenceLifetime, ...semantic, ...(request.kind === 'report' && invocation.fields.suppliedInputs ? { suppliedInputs: invocation.fields.suppliedInputs } : {}) };
  return freezeOwned({ ...owned, request: normalized });
}
export function cliWork(work: WorkReport): WorkReport {
  return freezeOwned({ ...work, context: cliContext(work.context), parents: work.parents.map(cliContext) });
}
function cliAttempt(report: AttemptReport): AttemptReport {
  return freezeOwned({ ...report, ...(report.parent ? { parent: cliContext(report.parent) } : {}) });
}
function cliUsage(usage: InvestigationUsageReport): InvestigationUsageReport {
  return freezeOwned({ ...usage, attempts: usage.attempts.map(cliAttempt) });
}
function cliProgress(progress: WorkProgress): WorkProgress {
  return progress.kind === 'start' ? freezeOwned({ ...progress, context: cliContext(progress.context) })
    : progress.kind === 'work' ? freezeOwned({ ...progress, parents: progress.parents.map(cliContext) }) : progress;
}
function arrange(result: AnswerDelivery, context: RequestContext, port: ReferenceBinding) {
  if (!result.consumption) throw new Error('CLI delivery requires a selected Presentation');
  const decision: PresentationDecision = { contract: result.consumption.contract, initial: result.consumption.initial,
    selected: result.consumption.selected.id, criteria: result.consumption.selected.description as unknown as PresentationDecision['criteria'], changes: result.consumption.changes };
  const choices = context.request.presentation;
  const presentation: PresentedOptions = { format: choices.format, moreDetails: choices.moreDetails, decision };
  const display = { selectionMode: result.selectionMode, referenceLifetime: result.referenceLifetime, answerReference: result.answerReference };
  const resolution = result.resolution && result.context.request.kind === 'lens' ? resolutionContext(result.context.request.designation, result.resolution) : undefined;
  const content = result.answer.mechanical ?? result.answer.content;
  if (content.contract === 'investigation') {
    const arranged = arrangeInvestigationView(content.value, { ...display, title: result.title, presentation,
      ...(resolution ? { resolution } : {}), ...(choices.after === undefined ? {} : { after: choices.after }), revisionPage: choices.revisionPage ?? 1 }, result.reporting, result.usage, port);
    return { ...arranged, rendered: renderInvestigationView(arranged.view), failed: result.failed || arranged.view.investigations?.status === 'unknown-continuation' };
  }
  const bindings = result.bindings;
  let view = content.contract === 'modules' ? arrangeModuleView(content.value, new Map(bindings.modules), presentation, result.title, resolution, display)
    : content.contract === 'organization' ? arrangeOrganizationView(content.value, { groups: new Map(bindings.groups), modules: new Map(bindings.modules), detail: new Map(bindings.detail) }, presentation, result.title, resolution, display)
      : content.contract === 'dependencies' ? arrangeDependencyView(content.value, new Map(bindings.modules), presentation, resolution, display)
        : arrangeModuleExports(content.value, new Map(bindings.modules).get(content.value.projection.subject)!, presentation, result.title, resolution, display);
  if (result.answer.mechanical) {
    if (result.answer.content.contract !== 'investigation' || view.schema !== 'postcode-view/1-experimental' && view.schema !== 'postcode-organization-view/1-experimental') throw new Error('Broken associated inspection contract');
    view = arrangeAssociatedInspection(view, result.answer.content.value, new Map(bindings.associations), choices.after, result.referenceLifetime);
  }
  return { view, investigationArrangementKey: null, rendered: renderMechanicalView(view),
    failed: result.failed || 'investigations' in view && (view.investigations as { status: string }).status === 'unknown-continuation' };
}

/** Same adapter for in-process tests and the private CLI worker. */
export async function openCliSession(options: ProjectOptions, lifetime: ApplicationDependencies = {}, definitions: RequestCatalog = defaultCatalog) {
  return compose(options, lifetime, definitions, false);
}
/** Private worker composition transfers final checks to the parent's publication guard. */
export async function openWorkerCliSession(options: ProjectOptions, lifetime: ApplicationDependencies = {}, definitions: RequestCatalog = defaultCatalog) {
  return compose(options, lifetime, definitions, true);
}
async function compose(options: ProjectOptions, lifetime: ApplicationDependencies, definitions: RequestCatalog, transported: boolean) {
  const catalog = captureCatalog(definitions);
  const opened = await openApplication(options, { ...lifetime, investigation: { ...lifetime.investigation,
    ...(lifetime.investigation?.onReport ? { onReport: report => lifetime.investigation!.onReport!(cliAttempt(report)) } : {}),
    ...(lifetime.investigation?.onProgress ? { onProgress: report => lifetime.investigation!.onProgress!(cliAttempt(report)) } : {}),
  }, ...(lifetime.onWork ? { onWork: progress => lifetime.onWork!(cliProgress(progress)) } : {}) },
    { lenses: catalog.lenses, operations: catalog.operations, presentations: catalog.presentations.map(applicationPresentation) });
  if (opened.status !== 'opened') return opened;
  const application = opened.session;
  return { status: 'opened' as const, session: {
    id: application.id, check: application.check, usage: () => cliUsage(application.usage()), close: application.close,
    work: () => { const work = application.work(); return work ? cliWork(work) : undefined; },
    evaluateInvestigation: (request: InvestigationRequest) => evaluateOperation(application, request),
    async execute(request: ViewRequest, execution: ExecutionOptions = {}) {
      execution = { ...execution };
      const captured = captureRequest(request, catalog.lenses);
      const { presentation, referenceLifetime, ...meaning } = captured.normalized;
      const { suppliedInputs, ...semantic } = meaning as typeof meaning & { suppliedInputs?: ParameterValue };
      const normalized: SemanticRequest = freezeOwned({ ...semantic,
        ...(semantic.kind === 'lens' || semantic.kind === 'present' ? { consumption: { presentations: catalog.presentations.map(item => item.id), options: { ...presentation } } } : {}) });
      const invocation = { fields: { presentation: presentation as unknown as ParameterValue, referenceLifetime,
        ...(suppliedInputs === undefined ? {} : { suppliedInputs }) }, problems: [] };
      const result = await withCliOperation(application, async operation => {
        const delivery = await operation.execute(normalized, { ...execution, invocation, referenceLifetime, constraints: {
          reportHasInputs: suppliedInputs !== undefined, conflictingDesignation: !!captured.input && captured.input.kind !== 'present' && captured.input.subject !== undefined && captured.input.selector !== null,
        } });
        const delivered = { ...delivery, usage: cliUsage(delivery.usage) };
        const context = cliContext(delivered.context) as RequestContext;
        const attribution = cliWork(delivered.attribution);
        if (delivered.kind === 'answer') {
          const arranged = arrange(delivered, context, operation.bindings);
          return { kind: 'view' as const, context, ...arranged, attribution, ...(delivered.resolution ? { resolution: delivered.resolution } : {}), repositoryRoot: delivered.repositoryRoot,
            methods: artifactMethods(delivered.methods, arranged.view) };
        }
        if (delivered.kind === 'resolution') {
          const report: ResolutionReport = finalizeRequestReport({ schema: 'postcode-resolution/1-experimental', session: application.id, context,
            usage: delivered.usage, ...(delivered.referenceNotice ? { referenceNotice: referenceNotice(delivered.referenceLifetime) } : {}), resolution: delivered.resolution, attribution }, delivered.usage);
          return { kind: 'resolution' as const, context, report, attribution, rendered: renderRequestReport(report), failed: true };
        }
        const report: UsageReport = freezeOwned({ schema: 'postcode-investigation-usage/1-experimental', session: application.id, context, usage: delivered.usage, attribution });
        return { kind: 'usage' as const, context, report, attribution, rendered: renderRequestReport(report), failed: false };
      });
      if (!transported) {
        const publication = await guardPublication(application.check, () => {});
        if (publication.status !== 'published') throw publication.error;
      }
      return result;
    },
  } };
}
export type CliResult = Awaited<ReturnType<Extract<Awaited<ReturnType<typeof openCliSession>>, { status: 'opened' }>['session']['execute']>>;

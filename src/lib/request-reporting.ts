import type { ResolutionInformation } from './application/reports.js';
export type { ResolutionInformation } from './application/reports.js';
import { diagnosticLines, withDiagnosticMeanings } from './diagnostic-view.js';
import { referenceNotice } from './answer-presentation.js';
import { summarizeWork } from './work-attribution.js';
import type { InitiationContext, WorkReport } from './work-attribution.js';
import { usageSummary } from './investigation/reporting.js';
import { freezeOwned } from './immutable.js';
import { completedMaterialization } from './evaluation-state.js';
import { inlineText } from './terminal-text.js';
import { usageLines } from './investigation/presentation.js';
import type { InvestigationUsageReport } from './investigation/reporting.js';
import type { NormalizedRequest } from './requests.js';
import type { SessionId } from './records.js';

export interface RequestContext extends InitiationContext {
  readonly request: NormalizedRequest;
}
export interface ResolutionReport {
  readonly schema: 'postcode-resolution/1-experimental';
  readonly session: SessionId;
  readonly context: RequestContext;
  readonly resolution: ResolutionInformation;
  readonly referenceNotice?: string;
  readonly usage: InvestigationUsageReport;
  readonly attribution?: WorkReport;
}
export interface UsageReport {
  readonly schema: 'postcode-investigation-usage/1-experimental';
  readonly session: SessionId;
  readonly context: RequestContext;
  readonly usage: InvestigationUsageReport;
  readonly attribution?: WorkReport;
}

const resolutionGuidance = 'No answer was produced for this request. Use a listed candidate or a supported designation; ask a coding agent to resolve reported project problems before retrying.';

/** Reports carry occurrence context; they have no program answer or content identity. */
export function renderRequestReport(report: ResolutionReport | UsageReport): string {
  if (report.context.request.presentation.format === 'json') return `${JSON.stringify({ ...report,
    ...(report.attribution ? { attribution: summarizeWork(report.attribution) } : {}) })}\n`;
  if (report.schema === 'postcode-investigation-usage/1-experimental') {
    return ['Investigation usage', ...report.usage.attempts.flatMap(attempt => usageLines(usageSummary([attempt]), `Attempt ${attempt.attempt} (${attempt.termination})`)), ...usageLines(report.usage, 'Session'), ...report.usage.limitations.map(inlineText)].join('\n') + '\n';
  }
  return ['Request could not be resolved',
    ...(report.context.request.kind === 'lens' ? [`Lens: ${report.context.request.lens}`,
      ...('value' in report.context.request.designation ? [`Subject: ${report.context.request.designation.kind === 'reference' ? '@' : ''}${inlineText(report.context.request.designation.value)}`] : [])] : []),
    ...(report.context.request.kind === 'present' ? [`Retained answer target: ${inlineText(report.context.request.target)}`] : []),
    `Reason: ${report.resolution.reason}`, inlineText(report.resolution.explanation),
    ...(report.referenceNotice ? [report.referenceNotice] : []),
    ...report.resolution.candidates.map(candidate => `  ${candidate.kind}: ${inlineText(candidate.reference)}`),
    ...report.resolution.criteria.map(inlineText),
    ...(report.resolution.support ?? []).map(support => {
      const kind = support.kind === 'evaluation' ? 'module' : 'group';
      const established = support.applicability === 'applicable' && support.availability === 'available' && completedMaterialization(support);
      const matches = report.resolution.candidates.filter(candidate => candidate.kind === kind && support.population.includes(candidate.id)).length;
      const state = established ? 'fully established' : `${support.applicability}, ${support.availability}, ${support.execution}, ${support.materialization}`;
      return `${kind === 'module' ? 'Modules' : 'Groups'}: ${state}; ${matches ? `${matches} ${matches === 1 ? 'match' : 'matches'}` : established ? 'no match' : 'no match established'}${support.reason ? `; ${inlineText(support.reason)}` : ''}`;
    }),
    ...report.resolution.qualifications.map(inlineText),
    ...diagnosticLines((report.resolution.support ?? []).flatMap(support => support.qualification)),
    report.resolution.guidance ?? resolutionGuidance,
    ...report.resolution.retainedAnswers.map(answer => `Retained answer: @${inlineText(answer.reference)} · ${inlineText(answer.id)}`),
    ...(report.resolution.retainedAnswers.length ? [report.context.request.referenceLifetime === 'command' ? 'All references expire when this command ends. Open postcode shell, request the information there, then use that new Session’s answer reference.' : 'Use present @answer-reference with compatible presentation choices in this Session.'] : []),
    ...(report.resolution.candidates.length ? [report.context.request.referenceLifetime === 'command'
      ? 'Candidate references expire when this command completes.' : 'Candidate references remain usable while this Session is valid.'] : []),
    ...usageLines(report.usage, 'Session')].join('\n') + '\n';
}

export function finalizeRequestReport<T extends ResolutionReport | UsageReport>(report: T, usage: InvestigationUsageReport): T {
  return freezeOwned(withDiagnosticMeanings({ ...report, usage,
    ...(report.schema === 'postcode-resolution/1-experimental' ? { resolution: { ...report.resolution, guidance: resolutionGuidance } } : {}) }));
}

/** Both direct and worker-facing boundaries refuse invalid input without evaluating it. */
export function rejectedRequestResult(session: SessionId, context: RequestContext, usage: InvestigationUsageReport) {
  if (context.request.kind !== 'rejected') throw new Error('Expected rejected request input');
  const report: ResolutionReport = freezeOwned({ schema: 'postcode-resolution/1-experimental', session, context, usage,
    ...(context.request.input.kind === 'present' ? { referenceNotice: referenceNotice(context.request.referenceLifetime) } : {}),
    resolution: { reason: 'invalid-request', explanation: 'The supplied request input could not be accepted.',
      candidates: [], criteria: ['Registered Lens or report', 'Serializable request data', 'Supported designation and reference choices'],
      qualifications: context.request.problems.map(problem => `${problem.field}: ${problem.reason} ${problem.representation === 'preserved'
        ? 'The supplied value is preserved as rejected input.' : problem.representation === 'absent'
          ? 'No value was supplied.' : `Representation limit: ${problem.omittedField ?? problem.field} is omitted from the report.`}`),
      representationLimits: context.request.problems.filter(problem => problem.representation === 'omitted')
        .map(problem => `Representation limit: ${problem.omittedField ?? problem.field} is omitted from the report.`),
      prerequisites: [], retainedAnswers: [] } });
  const presented = finalizeRequestReport(report, usage);
  return { kind: 'resolution' as const, context, report: presented, rendered: renderRequestReport(presented), failed: true };
}

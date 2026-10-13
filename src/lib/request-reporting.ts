import { summarizeWork } from './work-attribution.js';
import type { InitiationContext, WorkReport } from './work-attribution.js';
import { usageSummary } from './investigation/reporting.js';
import { freezeOwned } from './immutable.js';
import { completedMaterialization } from './evaluation-state.js';
import { inlineText } from './terminal-text.js';
import { usageLines } from './investigation/presentation.js';
import type { InvestigationUsageReport } from './investigation/reporting.js';
import type { NormalizedRequest } from './requests.js';
import type { RecordId, SessionId } from './records.js';
import type { LookupSupport, SubjectResolution } from './subject-resolution.js';

export interface RequestContext extends InitiationContext {
  readonly request: NormalizedRequest;
}
export interface ResolutionInformation {
  readonly reason: 'presentation-unavailable' | 'invalid-parameters' | 'invalid-designation' | 'invalid-report-inputs' | 'invalid-request' | Exclude<SubjectResolution['status'], 'resolved'>;
  readonly explanation: string;
  readonly candidates: readonly { readonly id: RecordId; readonly kind: 'module' | 'group' | 'investigram'; readonly reference: string }[];
  readonly criteria: readonly string[];
  readonly qualifications: readonly string[];
  readonly prerequisites: readonly RecordId[];
  readonly retainedAnswers: readonly RecordId[];
  readonly support?: readonly LookupSupport[];
}
export interface ResolutionReport {
  readonly schema: 'postcode-resolution/1-experimental';
  readonly session: SessionId;
  readonly context: RequestContext;
  readonly resolution: ResolutionInformation;
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
    `Reason: ${report.resolution.reason}`, inlineText(report.resolution.explanation),
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
    ...report.resolution.retainedAnswers.map(id => `Retained answer: ${inlineText(id)}`),
    ...(report.resolution.candidates.length || report.resolution.retainedAnswers.length ? [report.context.request.referenceLifetime === 'command'
      ? 'References expire when this command completes.' : 'References remain usable while this Session is valid.'] : []),
    ...usageLines(report.usage, 'Session')].join('\n') + '\n';
}

export function finalizeRequestReport<T extends ResolutionReport | UsageReport>(report: T, usage: InvestigationUsageReport): T {
  return freezeOwned({ ...report, usage });
}

/** Both direct and worker-facing boundaries refuse untransportable input without evaluating it. */
export function rejectedRequestResult(session: SessionId, context: RequestContext, usage: InvestigationUsageReport) {
  if (context.request.kind !== 'rejected') throw new Error('Expected rejected request input');
  const report: ResolutionReport = freezeOwned({ schema: 'postcode-resolution/1-experimental', session, context, usage,
    resolution: { reason: 'invalid-request', explanation: 'The supplied request input could not be accepted.',
      candidates: [], criteria: ['Registered Lens or report', 'Serializable request data'],
      qualifications: context.request.problems.map(problem => `${problem.field}: ${problem.reason} ${problem.representation === 'preserved'
        ? 'The supplied value is preserved as rejected input.' : `Representation limit: ${problem.omittedField ?? problem.field} is omitted from the report.`}`),
      prerequisites: [], retainedAnswers: [] } });
  return { kind: 'resolution' as const, context, report, rendered: renderRequestReport(report), failed: true };
}

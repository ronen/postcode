import { usageSummary } from './investigation/reporting.js';
import { freezeOwned } from './immutable.js';
import { inlineText } from './terminal-text.js';
import { usageLines } from './investigation/presentation.js';
import type { InvestigationUsageReport } from './investigation/reporting.js';
import type { NormalizedRequest } from './requests.js';
import type { RecordId, SessionId } from './records.js';

export interface RequestContext {
  readonly id: string;
  readonly initiator: 'caller';
  readonly request: NormalizedRequest;
}
export interface ResolutionInformation {
  readonly reason: 'invalid-parameters' | 'invalid-designation';
  readonly explanation: string;
  readonly candidates: readonly { readonly id: RecordId; readonly kind: 'module' | 'group' | 'investigram'; readonly reference: string }[];
  readonly criteria: readonly string[];
  readonly qualifications: readonly string[];
  readonly prerequisites: readonly RecordId[];
  readonly retainedAnswers: readonly RecordId[];
}
export interface ResolutionReport {
  readonly schema: 'postcode-resolution/1-experimental';
  readonly session: SessionId;
  readonly context: RequestContext;
  readonly resolution: ResolutionInformation;
  readonly usage: InvestigationUsageReport;
}
export interface UsageReport {
  readonly schema: 'postcode-investigation-usage/1-experimental';
  readonly session: SessionId;
  readonly context: RequestContext;
  readonly usage: InvestigationUsageReport;
}

/** Reports carry occurrence context; they have no program answer or content identity. */
export function renderRequestReport(report: ResolutionReport | UsageReport): string {
  if (report.context.request.presentation.format === 'json') return `${JSON.stringify(report)}\n`;
  if (report.schema === 'postcode-investigation-usage/1-experimental') {
    return ['Investigation usage', ...report.usage.attempts.flatMap(attempt => usageLines(usageSummary([attempt]), `Attempt ${attempt.attempt} (${attempt.termination})`)), ...usageLines(report.usage, 'Session'), ...report.usage.limitations.map(inlineText)].join('\n') + '\n';
  }
  return ['Request could not be resolved', inlineText(report.resolution.explanation),
    ...report.resolution.qualifications.map(inlineText),
    ...usageLines(report.usage, 'Session')].join('\n') + '\n';
}

export function finalizeRequestReport<T extends ResolutionReport | UsageReport>(report: T, usage: InvestigationUsageReport): T {
  return freezeOwned({ ...report, usage });
}

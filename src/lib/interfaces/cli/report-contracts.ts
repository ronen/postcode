import type { ResolutionInformation } from '../../application/reports.js';
import type { InitiationContext, WorkReport } from '../../work-attribution.js';
import type { InvestigationUsageReport } from '../../investigation/reporting.js';
import type { NormalizedRequest } from '../../requests.js';
import type { SessionId } from '../../records.js';
export type { ResolutionInformation } from '../../application/reports.js';

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


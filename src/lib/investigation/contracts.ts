import type { InitiationContext } from '../work-attribution.js';
import type { RecordId, SessionId } from '../records.js';

export type InvestigationOperation = string;
export interface InvestigationRequest {
  readonly operation: InvestigationOperation;
  readonly subject: RecordId;
  readonly parameters: Readonly<Record<string, never>>;
}

export interface AgentIdentity {
  readonly provider: string;
  readonly model: string;
  readonly configuration: Readonly<Record<string, string | number | boolean>>;
  readonly origin: 'hosted' | 'scripted';
}
export interface UsageCategory {
  readonly category: string;
  readonly unit: string;
  readonly value: number;
  /** For example, reasoning is a subset of output, not an additional output charge. */
  readonly includedIn: string | null;
}
export interface ReportedUsage {
  readonly source: 'provider' | 'synthetic';
  /** Actual provider response metadata, distinct from the requested agent configuration. */
  readonly execution?: { readonly model: string; readonly serviceTier: string | null };
  readonly categories: readonly UsageCategory[];
}
export interface CallUsage {
  readonly attempt: RecordId;
  readonly call: number;
  readonly agent: AgentIdentity;
  /** Sole unambiguous report; null for absent or anomalous accounting. */
  readonly reported: ReportedUsage | null;
  /** Every distinct provider report, including anomalous or conflicting updates. */
  readonly reports: readonly { readonly reported: ReportedUsage; readonly anomalies: readonly string[] }[];
  /** Nonempty means reported is null and this call is excluded from trusted totals. */
  readonly anomalies: readonly string[];
}
export type AgentFailure = { readonly kind: 'communication-failure' | 'configuration-unavailable'; readonly code: string; readonly diagnostic: string; readonly provider?: { readonly status: number | null; readonly body: unknown; readonly requestId: string | null } };
export interface AttemptReport {
  /** The retained option that delegated this attempt's question, when invoked through follow-up. */
  readonly followUp?: { readonly owner: RecordId; readonly key: string; readonly meaning: string };
  readonly parent?: InitiationContext;
  readonly attempt: RecordId;
  readonly session: SessionId;
  readonly request: InvestigationRequest;
  readonly agent: AgentIdentity;
  readonly instructions: string;
  readonly termination: 'accepted' | 'limit-stop' | 'investigation-failure' | AgentFailure['kind'] | 'interrupted' | 'invalidated' | 'defect' | 'running';
  readonly elapsedMilliseconds: number;
  readonly usage: readonly CallUsage[];
  /** Contribution deliveries actually dispatched. */
  readonly contributionDeliveries?: readonly import('../contributions/model.js').Delivery[];
  /** Full records delivered during this attempt. */
  readonly suppliedEvidence: readonly RecordId[];
}

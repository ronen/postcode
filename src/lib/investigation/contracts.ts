import type { EvidenceQuery, EvidenceResponse } from '../evidence-access.js';
import type { RecordContext, RecordId, SessionId } from '../records.js';

export type InvestigationOperation = 'functionality' | 'clarification' | 'decomposition' | 'examination';
export interface InvestigationRequest {
  readonly operation: InvestigationOperation;
  readonly subject: RecordId;
  readonly parameters: Readonly<Record<string, never>>;
}

export interface QualifiedSupport {
  readonly qualifications: readonly string[];
  readonly evidence: readonly RecordId[];
}
export interface Referent {
  readonly description: string;
  readonly subjects: readonly RecordId[];
}
export interface Association extends QualifiedSupport {
  readonly subject: RecordId;
  readonly role: 'described' | 'investigation-subject' | 'corrected-subject';
}
export interface Inconsistency extends QualifiedSupport { readonly targets: readonly RecordId[]; readonly reason: string }

/** Local IDs belong only to one submitted unit. PostCode allocates retained identities. */
export interface SubmittedInvestigram extends QualifiedSupport {
  readonly localId: string;
  readonly prose: string;
  readonly referent: Referent;
  readonly associations: readonly Omit<Association, 'role'>[];
  readonly children: readonly SubmittedInvestigram[];
  readonly corrections: readonly (QualifiedSupport & { readonly target: RecordId; readonly reason: string; readonly replacement: SubmittedInvestigram })[];
  readonly inconsistencies: readonly Inconsistency[];
}

export interface Investigram extends RecordContext, QualifiedSupport {
  readonly kind: 'investigram';
  readonly status: 'interpretation';
  readonly prose: string;
  readonly referent: Referent;
  readonly originatingModule: RecordId;
  readonly associations: readonly Association[];
  readonly children: readonly RecordId[];
  readonly corrections: readonly RecordId[];
  readonly inconsistencies: readonly Inconsistency[];
  readonly provenance: RecordId;
}
export interface Correction extends RecordContext, QualifiedSupport {
  readonly kind: 'investigram-correction';
  readonly reporter: RecordId;
  readonly target: RecordId;
  readonly replacement: RecordId;
  readonly reason: string;
  readonly provenance: RecordId;
}
export interface InvestigationProvenance extends RecordContext {
  readonly kind: 'investigation-provenance';
  readonly request: InvestigationRequest;
  readonly originatingModule: RecordId;
  readonly instructions: string;
  readonly agent: AgentIdentity;
  readonly citations: readonly RecordId[];
  readonly completeTargets: readonly RecordId[];
  readonly completeCorrections: readonly RecordId[];
  readonly suppliedEvidence: readonly RecordId[];
  readonly deliveries: readonly ContextDelivery[];
}
export interface AcceptedInvestigation {
  readonly root: RecordId;
  readonly investigrams: readonly Investigram[];
  readonly corrections: readonly Correction[];
  readonly provenance: InvestigationProvenance;
}

/** Read-only retained context. M1 supplies fixtures; session retention is coordinated by evaluation. */
export interface InvestigationHistory {
  get(id: RecordId): Investigram | undefined;
  provenance(id: RecordId): InvestigationProvenance | undefined;
  correction(id: RecordId): Correction | undefined;
  corrections(id: RecordId): readonly Correction[];
}
export type ContextPart = 'prose' | 'referent' | 'qualifications';
export interface AccountContext {
  readonly id: RecordId;
  readonly status: 'prior-interpretation';
  readonly prose?: string;
  readonly referent?: Referent;
  readonly qualifications?: readonly string[];
  readonly associations?: readonly Association[];
  readonly inconsistencies?: readonly Inconsistency[];
  readonly completeParts: readonly ContextPart[];
  readonly evidence: readonly RecordId[];
  readonly originatingModule: RecordId;
  readonly children: readonly RecordId[];
  readonly provenance: Omit<InvestigationProvenance, 'deliveries'>;
  readonly corrections: readonly RecordId[];
  readonly revisionNotices: readonly { readonly id: RecordId; readonly target: RecordId; readonly replacement: RecordId }[];
  readonly omissions: readonly string[];
}
export interface ContextDelivery {
  readonly requested: RecordId;
  readonly accounts: readonly AccountContext[];
  readonly corrections: readonly Correction[];
  readonly omittedAccounts: readonly RecordId[];
  readonly omittedCorrections: readonly RecordId[];
  readonly limitations: readonly string[];
}
export type InvestigatorTool = EvidenceQuery | {
  readonly kind: 'investigram'; readonly subject: RecordId;
  readonly parts?: readonly ContextPart[];
  readonly excerptCharacters?: number;
};
export type ToolResponse = EvidenceResponse | ContextDelivery;

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
export interface ReportedUsage { readonly source: 'provider' | 'synthetic'; readonly categories: readonly UsageCategory[] }
export interface CallUsage {
  readonly attempt: RecordId;
  readonly call: number;
  readonly agent: AgentIdentity;
  readonly reported: ReportedUsage | null;
}
export type AgentFailure = { readonly kind: 'communication-failure' | 'configuration-unavailable'; readonly code: string; readonly diagnostic: string };
export type AgentReply =
  | { readonly kind: 'tools'; readonly requests: readonly InvestigatorTool[] }
  | { readonly kind: 'submit'; readonly result: unknown }
  | { readonly kind: 'ended' | 'refused' | 'truncated' }
  | AgentFailure;
export interface AgentInput {
  readonly instructions: string;
  readonly request: InvestigationRequest;
  readonly responses: readonly ToolResponse[];
  readonly remaining: { readonly milliseconds: number; readonly calls: number; readonly toolCalls: number };
}
export interface AgentDialogue {
  exchange(input: AgentInput, signal: AbortSignal, reportUsage: (usage: ReportedUsage) => void): Promise<AgentReply>;
  /** Must release local resources synchronously; remote cancellation is best effort. */
  close(): void;
}
/** Provider exceptions must be translated here. Unexpected defects remain thrown errors. */
export interface InvestigatorAgent {
  readonly identity: AgentIdentity;
  open(): AgentDialogue;
}
export interface AttemptReport {
  readonly attempt: RecordId;
  readonly session: SessionId;
  readonly request: InvestigationRequest;
  readonly agent: AgentIdentity;
  readonly instructions: string;
  readonly termination: InvestigationOutcome['kind'] | 'interrupted' | 'invalidated' | 'defect';
  readonly elapsedMilliseconds: number;
  readonly usage: readonly CallUsage[];
  readonly deliveries: readonly ContextDelivery[];
  readonly suppliedEvidence: readonly RecordId[];
}
export type InvestigationOutcome =
  | { readonly kind: 'accepted'; readonly result: AcceptedInvestigation }
  | { readonly kind: 'limit-stop' | 'investigation-failure'; readonly reason: string }
  | AgentFailure;
export interface InvestigationExecution { readonly outcome: InvestigationOutcome; readonly report: AttemptReport }

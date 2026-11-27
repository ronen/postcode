import type { SessionId, RecordId } from '../records.js';
import type { SubjectResolution } from '../subject-resolution.js';
import type { InitiationContext, WorkReport, WorkProgress } from '../work-attribution.js';
import type { InvestigationUsageReport } from '../investigation/reporting.js';
import type { AgentFailure } from '../investigation/contracts.js';
import type { InvestigationRequest } from '../investigation/contracts.js';
import type { ProjectOptions } from '../typescript/project.js';
import type { RunGit } from '../git-execution.js';
import type { QualifiedContent } from './content.js';
import type { SemanticRequest, ApplicationRequest, InputProblem } from './requests.js';
import type { ParameterValue, LensDefinition } from './lenses.js';
import type { ConsumptionDecision } from './consumption.js';
import type { ResolutionInformation } from './reports.js';

export interface ApplicationContext extends InitiationContext { readonly request: SemanticRequest }
export interface SelectedAnswer {
  readonly id: RecordId;
  readonly content: QualifiedContent;
  /** Both exact halves of associated inspection; otherwise null. */
  readonly mechanical: Exclude<QualifiedContent, { contract: 'contribution' | 'contribution-inspection' }> | null;
}
export interface ApplicationDelivery {
  readonly context: ApplicationContext;
  readonly usage: InvestigationUsageReport;
  readonly attribution: WorkReport;
}
export interface AnswerDelivery extends ApplicationDelivery {
  readonly kind: 'answer';
  readonly answer: SelectedAnswer;
  readonly selectionMode: 'fresh' | 'retained';
  readonly title: string;
  readonly resolution?: SubjectResolution;
  readonly consumption: ConsumptionDecision | null;
  readonly reporting: { readonly contribution?: import('../contributions/evaluation.js').ContributionAttemptResult | null;
    readonly unavailable?: import('../investigation/contracts.js').AgentFailure | null;
    readonly reused: boolean; readonly attempt: RecordId | null;
    readonly provider?: NonNullable<AgentFailure['provider']> } | null;
  readonly repositoryRoot: string | null;
  readonly methods: readonly string[];
  readonly failed: boolean;
}
export interface ResolutionDelivery extends ApplicationDelivery {
  readonly kind: 'resolution';
  readonly resolution: ResolutionInformation;
}
export interface UsageDelivery extends ApplicationDelivery { readonly kind: 'usage' }
export type ApplicationResult = AnswerDelivery | ResolutionDelivery | UsageDelivery;
export type PreparedResult = ApplicationResult extends infer T ? T extends ApplicationResult ? Omit<T, 'attribution'> : never : never;
export interface ExecutionContext {
  /** Supplied strings are preserved, including empty strings. Invalid values
   * reject with InvalidRequestId; omission/undefined generates a correlation ID. */
  readonly requestId?: string;
  /** Opaque caller-owned reporting fields; never semantic authority or answer identity. */
  readonly invocation?: Readonly<Record<string, ParameterValue>>;
}
export interface CapturedInvocation {
  readonly fields: Readonly<Record<string, ParameterValue>>;
  readonly problems: readonly InputProblem[];
}
export interface ApplicationDependencies {
  /** Injected execution retains caller ownership: the Session cannot confirm its subprocess exit. */
  readonly runGit?: RunGit;
  readonly signal?: AbortSignal;
  readonly investigation?: import('../contributions/evaluation.js').ContributionDependencies;
  readonly onWork?: (progress: WorkProgress) => void;
}
export interface Capability {
  readonly id: string;
  readonly question: string;
  readonly title: string;
  readonly subjects: LensDefinition['subjects'];
  readonly cardinality: LensDefinition['cardinality'];
  readonly parameters: LensDefinition['parameters'];
  readonly results: LensDefinition['results'];
  /** Mechanical Lenses expose only their kind. Agentic Lenses expose their operation and requested result contract. */
  readonly requirements: { readonly kind: Exclude<LensDefinition['requirements']['kind'], 'contribution' | 'follow-up'> }
    | Extract<LensDefinition['requirements'], { kind: 'contribution' | 'follow-up' }>;
}
export interface ApplicationSession {
  readonly id: SessionId;
  capabilities(): readonly Capability[];
  execute(request: ApplicationRequest, context?: ExecutionContext): Promise<ApplicationResult>;
  /** Detected invalidation establishes SessionInvalidated and immediately begins owned cleanup.
   * Active work stays invalidated; later interrupt/close cannot replace the terminal cause. */
  check(): Promise<void>;
  usage(): InvestigationUsageReport;
  work(): WorkReport | undefined;
  /** Terminal cancellation unless an earlier cause (including invalidation) is established.
   * Shares close()'s assessment of owned cleanup and terminal reporting. Request settlement
   * is separate; neither interruption nor invalidation alone is a shutdown failure. */
  interrupt(): Promise<void>;
  /** Active work is interrupted; idle close starts no new request abort. Repeated calls observe
   * the same assessment, including failures during invalidated-request finalization, and reject
   * with SessionShutdownError when cleanup/report delivery failed. Ordinary request failures
   * stay with their request. Cleanup deadlines do not prove resource exit. */
  close(): Promise<void>;
}
export type OpenApplicationResult = { readonly status: 'opened'; readonly session: ApplicationSession }
  | { readonly status: 'project-open-failed'; readonly diagnostics: readonly { readonly code: number; readonly message: string }[];
      readonly operational?: { readonly operation: string; readonly path: string; readonly reason: string } };
export type { ProjectOptions, InvestigationRequest };

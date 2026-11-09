import type { SessionId, RecordId } from '../records.js';
import type { SubjectResolution } from '../subject-resolution.js';
import type { InitiationContext, WorkReport, WorkProgress } from '../work-attribution.js';
import type { InvestigationUsageReport } from '../investigation/reporting.js';
import type { InvestigationSelection, InvestigationDependencies } from '../investigation/evaluation.js';
import type { InvestigationRequest } from '../investigation/contracts.js';
import type { ProjectOptions } from '../typescript/project.js';
import type { RunGit } from '../git-execution.js';
import type { QualifiedContent } from './content.js';
import type { SemanticRequest, ApplicationRequest, InputProblem } from './requests.js';
import type { ParameterValue, LensDefinition } from './lenses.js';
import type { ConsumptionDecision } from './consumption.js';
import type { CoordinatedBindings } from './bindings.js';
import type { ResolutionInformation } from './reports.js';

export interface ApplicationContext extends InitiationContext { readonly request: SemanticRequest }
export interface SelectedAnswer {
  readonly id: RecordId;
  readonly content: QualifiedContent;
  /** Both exact halves of associated inspection; otherwise null. */
  readonly mechanical: Exclude<QualifiedContent, { contract: 'investigation' }> | null;
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
  readonly answerReference: string;
  readonly referenceLifetime: 'session' | 'command';
  readonly resolution?: SubjectResolution;
  readonly bindings: CoordinatedBindings;
  readonly consumption: ConsumptionDecision | null;
  readonly reporting: { readonly reused: boolean; readonly attempt: RecordId | null;
    readonly provider?: NonNullable<NonNullable<InvestigationSelection['unavailable']>['provider']> } | null;
  readonly repositoryRoot: string | null;
  readonly methods: readonly string[];
  readonly failed: boolean;
}
export interface ResolutionDelivery extends ApplicationDelivery {
  readonly kind: 'resolution';
  readonly resolution: ResolutionInformation;
  readonly referenceLifetime: 'session' | 'command';
  readonly referenceNotice: boolean;
}
export interface UsageDelivery extends ApplicationDelivery { readonly kind: 'usage' }
export type ApplicationResult = AnswerDelivery | ResolutionDelivery | UsageDelivery;
export type PreparedResult = ApplicationResult extends infer T ? T extends ApplicationResult ? Omit<T, 'attribution'> : never : never;
export interface ExecutionContext {
  readonly requestId?: string;
  /** Opaque caller-owned reporting fields; never semantic authority or answer identity. */
  readonly invocation?: Readonly<Record<string, ParameterValue>>;
}
export interface CapturedInvocation {
  readonly fields: Readonly<Record<string, ParameterValue>>;
  readonly problems: readonly InputProblem[];
}
export interface ApplicationDependencies {
  readonly runGit?: RunGit;
  readonly signal?: AbortSignal;
  readonly investigation?: InvestigationDependencies;
  readonly onWork?: (progress: WorkProgress) => void;
  readonly referenceLifetime?: 'session' | 'command';
}
export interface Capability {
  readonly id: string;
  readonly question: string;
  readonly title: string;
  readonly subjects: LensDefinition['subjects'];
  readonly cardinality: LensDefinition['cardinality'];
  readonly parameters: LensDefinition['parameters'];
  readonly results: LensDefinition['results'];
  readonly requirements: { readonly kind: Exclude<LensDefinition['requirements']['kind'], 'interpretation'> }
    | Extract<LensDefinition['requirements'], { kind: 'interpretation' }>;
}
export interface ApplicationSession {
  readonly id: SessionId;
  capabilities(): readonly Capability[];
  execute(request: ApplicationRequest, context?: ExecutionContext): Promise<ApplicationResult>;
  check(): Promise<void>;
  usage(): InvestigationUsageReport;
  work(): WorkReport | undefined;
  interrupt(): Promise<void>;
  close(): Promise<void>;
}
export type OpenApplicationResult = { readonly status: 'opened'; readonly session: ApplicationSession }
  | { readonly status: 'project-open-failed'; readonly diagnostics: readonly { readonly code: number; readonly message: string }[];
      readonly operational?: { readonly operation: string; readonly path: string; readonly reason: string } };
export type { ProjectOptions, InvestigationRequest };

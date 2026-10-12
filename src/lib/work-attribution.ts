import { randomUUID } from 'node:crypto';
import { freezeOwned } from './immutable.js';
import { investigationBounds } from './investigation/bounds.js';
import type { InvestigationBounds } from './investigation/bounds.js';
import type { InvestigationRequest, InvestigatorTool, ToolResponse, AccountContext, ContextDelivery } from './investigation/contracts.js';
import type { NormalizedRequest } from './requests.js';
import type { EvidenceResponse } from './evidence-delivery.js';
import type { EvaluationState, ProgramRecordStore, RecordId } from './records.js';

export interface InitiationContext {
  readonly id: string;
  /** The entry point knows its caller role, not whether that caller is a human. */
  readonly initiator: 'caller';
  readonly purpose: string;
  readonly request: NormalizedRequest | { readonly kind: 'operation'; readonly operation: InvestigationRequest };
  readonly constraints: {
    readonly wholeRequestBudget: null;
    readonly investigation: InvestigationBounds;
    readonly cancellation: 'Session lifetime; investigation inherits cancellation and its own guards';
  };
}

export function initiation<T extends InitiationContext['request']>(request: T, id: string = randomUUID(), bounds = investigationBounds): InitiationContext & { readonly request: T } {
  return freezeOwned(structuredClone({ id, initiator: 'caller' as const, request,
    purpose: request.kind === 'lens' ? `Answer the ${request.lens} Lens request.` : request.kind === 'operation'
      ? `Evaluate the ${request.operation.operation} interpretation operation.` : request.kind === 'report' ? 'Report investigation usage.' : 'Resolve the supplied rejected request.',
    constraints: { wholeRequestBudget: null, investigation: bounds,
      cancellation: 'Session lifetime; investigation inherits cancellation and its own guards' as const } }));
}

export interface WorkOrigin {
  readonly parent: InitiationContext;
  readonly initiator: 'caller' | 'PostCode';
  readonly role: 'requested-answer' | 'resolution-prerequisite' | 'interpretation-evidence';
  readonly purpose: string;
  readonly attempt: RecordId | null;
  readonly trigger: EvidenceWork['query'] | null;
  readonly sequence: number | null;
}
type WorkState = Omit<EvaluationState, 'cost'> & { readonly cost: { readonly measure: string; readonly value: number } };
export interface WorkOutcome {
  readonly records: readonly RecordId[];
  readonly state?: WorkState;
  readonly limitations?: readonly string[];
}
export interface AttributedWork {
  readonly boundary: 'provider-modules' | 'provider-expansion' | 'provider-dependencies' | 'content'
    | 'module-evaluation' | 'module-expansion-evaluation' | 'dependency-evaluation' | 'organization-evaluation' | 'dependency-organization-evaluation'
    | 'interpretation' | 'evidence-retrieval';
  readonly disposition: 'established' | 'reused' | 'consumed' | 'unavailable' | 'started' | 'finished';
  readonly current: WorkOrigin;
  readonly outcome: WorkOutcome;
  /** Unknown origins are explicit; consuming untracked information cannot establish its origin. */
  readonly generating: readonly { readonly record: RecordId; readonly origin: WorkOrigin | null }[];
}
export interface WorkReport {
  readonly context: InitiationContext;
  readonly status: 'running' | 'completed' | 'refused' | 'failed' | 'invalidated' | 'interrupted' | 'defect';
  readonly completeness: 'complete' | 'incomplete';
  readonly work: readonly AttributedWork[];
  readonly evidence: readonly EvidenceWork[];
  readonly limitations: readonly string[];
}

export interface EvidenceWork {
  readonly current: WorkOrigin;
  readonly query: InvestigatorTool | { readonly kind: 'initial-context'; readonly subject: RecordId } | { readonly kind: 'invalid' };
  readonly outcome: {
    readonly status: 'available' | 'partial' | 'unavailable';
    readonly records: readonly RecordId[];
    readonly selected: readonly RecordId[];
    readonly limitations: readonly string[];
    readonly evaluations: NonNullable<EvidenceResponse['evaluations']>;
    readonly supportReferences?: EvidenceResponse['supportReferences'];
    readonly accounts?: readonly Pick<AccountContext, 'id' | 'qualifications' | 'completeParts' | 'omissions' | 'revision' | 'nextCorrectionPage'>[];
    readonly listing?: ContextDelivery['listing'];
    readonly page?: EvidenceResponse['page'];
    readonly repositories?: EvidenceResponse['repositories'];
    readonly omittedAccounts?: readonly RecordId[];
    readonly omittedCorrections?: readonly RecordId[];
  } | null;
  readonly delivery: 'not-delivered' | 'delivered' | 'withheld';
  readonly reason: string | null;
}

export interface EvidenceWorkHandle {
  readonly scope: WorkScope;
  acquired(response: ToolResponse): void;
  withheld(reason: string): void;
  delivered(): void;
}

// Attribution has the same lifetime as the supported Session store. It is neither
// record payload nor an input to reusable-work/answer identity.
const origins = new WeakMap<ProgramRecordStore, Map<RecordId, WorkOrigin>>();

export class RequestWork {
  private readonly work: AttributedWork[] = [];
  private readonly evidenceWork: EvidenceWork[] = [];
  private status: WorkReport['status'] = 'running';
  private incompleteReason: string | undefined;
  constructor(readonly context: InitiationContext, private readonly store: ProgramRecordStore,
    private readonly progress?: (report: WorkReport) => void, private readonly signal?: AbortSignal) {}

  scope(purpose: string, attempt: RecordId | null = null, role: WorkOrigin['role'] = 'requested-answer', trigger: EvidenceWork['query'] | null = null, sequence: number | null = null): WorkScope {
    const current: WorkOrigin = freezeOwned(structuredClone({ parent: this.context, initiator: role === 'requested-answer' ? 'caller' as const : 'PostCode' as const, role, purpose, attempt, trigger, sequence }));
    return { check: () => {
      this.signal?.throwIfAborted();
      if (this.status !== 'running') throw new Error('Request work has ended');
    }, record: (boundary, disposition, outcome, firstRetained = outcome.records) => {
      if (this.status !== 'running') return; // Late completions cannot rewrite a sealed request.
      let retained = origins.get(this.store);
      if (!retained) { retained = new Map(); origins.set(this.store, retained); }
      if (disposition === 'established') for (const id of firstRetained) if (!retained.has(id)) retained.set(id, current);
      this.work.push(freezeOwned(structuredClone({ boundary, disposition, current, outcome,
        generating: outcome.records.map(record => ({ record, origin: retained.get(record) ?? null })) })));
      this.progress?.(this.snapshot());
    } };
  }

  evidence(query: EvidenceWork['query'], attempt: RecordId): EvidenceWorkHandle {
    const purpose = query.kind === 'initial-context' ? 'Supply the selected prior interpretation as initial context.'
      : `Satisfy the investigator's ${query.kind} evidence query.`;
    const index = this.evidenceWork.length;
    const current: WorkOrigin = { parent: this.context, initiator: 'PostCode', role: 'interpretation-evidence', purpose, attempt, trigger: query, sequence: index };
    const update = (fields: Partial<EvidenceWork>) => {
      if (this.status !== 'running') return;
      this.evidenceWork[index] = freezeOwned(structuredClone({ ...this.evidenceWork[index]!, ...fields }));
      this.progress?.(this.snapshot());
    };
    update({ current, query, outcome: null, delivery: 'not-delivered', reason: null });
    const scope = this.scope(purpose, attempt, 'interpretation-evidence', query, index);
    return { scope, acquired: response => {
      const accounts = 'accounts' in response;
      update({ outcome: {
        status: accounts ? response.omittedAccounts.length || response.omittedCorrections.length ? 'partial'
          : response.accounts.length || response.listing ? 'available' : 'unavailable' : response.status,
        records: accounts ? [...response.accounts.map(item => item.id), ...response.corrections.map(item => item.id)] : response.records.map(item => item.id),
        selected: accounts ? response.listing?.selected ?? (response.accounts.some(item => item.id === response.requested)
          || response.omittedAccounts.includes(response.requested) ? [response.requested] : []) : response.selected,
        limitations: response.limitations,
        ...(accounts ? { omittedAccounts: response.omittedAccounts, omittedCorrections: response.omittedCorrections,
          ...(response.listing ? { listing: response.listing } : {}),
          accounts: response.accounts.map(({ id, qualifications, completeParts, omissions, revision, nextCorrectionPage }) => ({ id, completeParts, omissions,
            ...(qualifications ? { qualifications } : {}), ...(revision ? { revision } : {}),
            ...(nextCorrectionPage !== undefined ? { nextCorrectionPage } : {}) })) }
          : { ...(response.page ? { page: response.page } : {}), ...(response.repositories ? { repositories: response.repositories } : {}),
            ...(response.supportReferences ? { supportReferences: response.supportReferences } : {}) }),
        evaluations: accounts ? [] : response.evaluations ?? [],
      } });
      scope.record('evidence-retrieval', this.evidenceWork[index]?.outcome?.status === 'unavailable' ? 'unavailable' : 'consumed', {
        records: [...new Set([...(this.evidenceWork[index]?.outcome?.records ?? []),
          ...(this.evidenceWork[index]?.outcome?.evaluations.map(item => item.id) ?? [])])], limitations: response.limitations,
      });
    }, withheld: reason => update({ delivery: 'withheld', reason }), delivered: () => {
      if (this.evidenceWork[index]?.delivery !== 'withheld') update({ delivery: 'delivered' });
    } };
  }

  snapshot(): WorkReport {
    const unfinished = this.status !== 'running' && this.evidenceWork.some(item => item.outcome === null);
    return freezeOwned({ context: this.context, status: this.status, completeness: unfinished || this.incompleteReason ? 'incomplete' : 'complete',
      work: [...this.work], evidence: [...this.evidenceWork], limitations: [
        ...(unfinished ? ['An evidence query did not return before execution ended; its acquisition outcome is unknown.'] : []),
        ...(this.incompleteReason ? [this.incompleteReason] : []),
        ...(this.work.some(item => item.generating.some(generation => generation.origin === null))
          ? ['Generating attribution is unknown for untracked support; consumption does not imply new acquisition.'] : []),
      ] });
  }
  finish(status: Exclude<WorkReport['status'], 'running'>, incompleteReason?: string): WorkReport {
    this.status = status; this.incompleteReason = incompleteReason;
    const report = this.snapshot();
    this.progress?.(report);
    return report;
  }
}

export interface WorkScope {
  check(): void;
  /** Execution may repeat while only newly retained support acquires an origin. */
  record(boundary: AttributedWork['boundary'], disposition: AttributedWork['disposition'], outcome: WorkOutcome, firstRetained?: readonly RecordId[]): void;
}

/** Copy qualification only; an evaluation's population is not an execution trace. */
export function workState(value: WorkState): WorkState {
  const { applicability, availability, execution, materialization, reason, cost } = value;
  return { applicability, availability, execution, materialization, reason, cost };
}

export function incompleteWork(report: WorkReport, status: 'interrupted' | 'invalidated' | 'failed' | 'defect'): WorkReport {
  return freezeOwned({ ...report, status, completeness: 'incomplete', limitations: [...report.limitations,
    'Execution ended before a final work report was received. Only received facts are recorded; unfinished work is unknown.'] });
}

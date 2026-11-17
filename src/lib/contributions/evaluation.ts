import type { AgentFailure, AttemptReport } from '../investigation/contracts.js';
import type { InvestigationBounds } from '../investigation/bounds.js';
import type { InvestigationUsage } from '../investigation/usage.js';
import type { ProgramRecordStore, RecordId } from '../records.js';
import { conductDialog } from './dialog.js';
import type { DialogAgent, DialogEvidence, DialogExecution, DialogOutcome } from './dialog.js';
import type { ContributionLedger } from './ledger.js';
import type { Invocation, InvocationRequest, MetadataAddress, Production, ProducerReport, QueryResultId } from './model.js';
import type { ContributionOperation } from './operations.js';
import type { ResultContract } from './outcomes.js';
import { assessFulfillment, attemptAnswers } from './outcomes.js';

export interface ContributionAttemptResult {
  readonly outcome: Exclude<DialogOutcome, { readonly kind: 'accepted' }> | { readonly kind: 'accepted' };
  readonly fulfillment: import('./outcomes.js').Fulfillment | null;
  readonly report: ProducerReport | null;
}
export interface ContributionEvaluated {
  readonly attemptResult: ContributionAttemptResult | null;
  readonly invocation: Invocation;
  readonly result: QueryResultId;
  /** True when a compatible retained outcome answered the request and no dialog ran. */
  readonly reused: boolean;
  readonly execution: DialogExecution | null;
  /** The retained attempt that was reused, when one was. */
  readonly attempt: Production | null;
  readonly unavailable: AgentFailure | null;
}
export interface ContributionDependencies {
  readonly dialogAgent?: DialogAgent;
  readonly bounds?: InvestigationBounds;
  readonly onReport?: ((report: AttemptReport) => void) | undefined;
}
/** Outcomes that are not retained as reusable: an eligible retry must still run. */
const transient = ['communication-failure', 'configuration-unavailable'];

/**
 * Evaluation of contribution operations: select a compatible retained outcome or obtain the
 * missing work through a dialog. An ordinary request reuses completed work for the same
 * question, including after fresh attempts or later declarations. An explicit fresh request
 * always runs a new producing attempt and never displaces anything by itself.
 */
export function contributionEvaluation(store: ProgramRecordStore, ledger: ContributionLedger, evidence: DialogEvidence, usage: InvestigationUsage,
  dependencies: ContributionDependencies, check: () => Promise<void>, signal: AbortSignal) {
  const completed = new Map<Production['id'], ContributionAttemptResult>();
  return { async evaluate(request: InvocationRequest, operation: ContributionOperation, contract: ResultContract | null,
    options: { readonly fresh?: boolean; readonly context?: readonly MetadataAddress[]; readonly subject: RecordId }): Promise<ContributionEvaluated> {
    await check();
    const { invocation, result } = ledger.invoke(request, { fresh: options.fresh === true });
    if (!options.fresh) {
      const candidates = ledger.productions().filter(production => production.invocation !== null && ledger.invocation(production.invocation).result === result.id
        && (production.outcome.kind === 'accepted' || !transient.includes(production.outcome.failure.kind)));
      // A completed accepted investigation remains reusable even if an earlier attempt failed.
      // This selects execution reporting only; every standing claim is still selected independently.
      const attempt = candidates.find(production => production.outcome.kind === 'accepted') ?? candidates[0];
      if (attempt) return { invocation, result: result.id, reused: true, execution: null, attempt, unavailable: null,
        attemptResult: completed.get(attempt.id) ?? { outcome: attempt.outcome.kind === 'accepted' ? { kind: 'accepted' } : attempt.outcome.failure,
          fulfillment: contract && attempt.outcome.kind === 'accepted' ? assessFulfillment(ledger, contract, result.id, attemptAnswers(ledger, attempt, result.id)) : null, report: attempt.report } };
    }
    if (!dependencies.dialogAgent) return { invocation, result: result.id, reused: false, execution: null, attempt: null, attemptResult: null, unavailable: { kind: 'configuration-unavailable',
      code: 'investigating-agent-not-configured', diagnostic: 'No investigating agent is configured for contribution investigations.' } };
    const execution = await conductDialog({ ledger, store, evidence, operation: { ...operation, contract }, invocation: invocation.id, agent: dependencies.dialogAgent, usage, check, signal,
      onReport: report => dependencies.onReport?.({ ...report, session: ledger.session,
        request: { operation: operation.id, subject: options.subject, parameters: {} } }),
      ...(dependencies.bounds ? { bounds: dependencies.bounds } : {}), ...(options.context ? { context: options.context } : {}) });
    if (signal.aborted) throw signal.reason;
    const { outcome } = execution;
    const attemptResult: ContributionAttemptResult = { outcome: outcome.kind === 'accepted' ? { kind: 'accepted' } : outcome,
      fulfillment: outcome.kind === 'accepted' ? outcome.fulfillment : null, report: execution.production.report };
    completed.set(execution.production.id, attemptResult);
    return { invocation, result: result.id, reused: false, execution, attempt: null, attemptResult,
      unavailable: outcome.kind === 'communication-failure' || outcome.kind === 'configuration-unavailable' ? outcome : null };
  } };
}

import type { AgentFailure, AttemptReport } from '../investigation/contracts.js';
import type { InvestigationBounds } from '../investigation/bounds.js';
import type { InvestigationUsage } from '../investigation/usage.js';
import type { ProgramRecordStore, RecordId } from '../records.js';
import { conductDialog } from './dialog.js';
import type { DialogAgent, DialogEvidence, DialogExecution } from './dialog.js';
import type { ContributionLedger } from './ledger.js';
import type { Invocation, InvocationRequest, MetadataAddress, Production, QueryResultId } from './model.js';
import type { ContributionOperation } from './operations.js';
import type { ResultContract } from './outcomes.js';

export interface ContributionEvaluated {
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
  return { async evaluate(request: InvocationRequest, operation: ContributionOperation, contract: ResultContract | null,
    options: { readonly fresh?: boolean; readonly context?: readonly MetadataAddress[]; readonly subject: RecordId }): Promise<ContributionEvaluated> {
    await check();
    const { invocation, result } = ledger.invoke(request, { fresh: options.fresh === true });
    if (!options.fresh) {
      const attempt = ledger.productions().find(production => production.invocation !== null && ledger.invocation(production.invocation).result === result.id
        && (production.outcome.kind === 'accepted' || !transient.includes(production.outcome.reason)));
      if (attempt) return { invocation, result: result.id, reused: true, execution: null, attempt, unavailable: null };
    }
    if (!dependencies.dialogAgent) return { invocation, result: result.id, reused: false, execution: null, attempt: null, unavailable: { kind: 'configuration-unavailable',
      code: 'investigating-agent-not-configured', diagnostic: 'No investigating agent is configured for contribution investigations.' } };
    const execution = await conductDialog({ ledger, store, evidence, operation: { ...operation, contract }, invocation: invocation.id, agent: dependencies.dialogAgent, usage, check, signal,
      ...(dependencies.bounds ? { bounds: dependencies.bounds } : {}), ...(options.context ? { context: options.context } : {}) });
    if (signal.aborted) throw signal.reason;
    const { outcome } = execution;
    // Usage and attempt reporting share the Session's existing attempt ledger.
    dependencies.onReport?.({ attempt: execution.attempt, session: ledger.session, request: { operation: operation.id, subject: options.subject, parameters: {} },
      agent: execution.agent, instructions: execution.instructions, elapsedMilliseconds: execution.elapsedMilliseconds, usage: execution.usage, deliveries: [],
      termination: outcome.kind === 'invalid-submission' ? 'investigation-failure' : outcome.kind, suppliedEvidence: execution.production.evidence, summarizedEvidence: [] });
    return { invocation, result: result.id, reused: false, execution, attempt: null,
      unavailable: outcome.kind === 'communication-failure' || outcome.kind === 'configuration-unavailable' ? outcome : null };
  } };
}

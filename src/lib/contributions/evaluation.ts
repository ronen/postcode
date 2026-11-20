import type { RequestWork } from '../work-attribution.js';
import type { AgentFailure, AttemptReport } from '../investigation/contracts.js';
import type { InvestigationBounds } from '../investigation/bounds.js';
import type { InvestigationUsage } from '../investigation/usage.js';
import type { ProgramRecordStore, RecordId } from '../records.js';
import { conductDialog } from './dialog.js';
import type { DialogAgent, DialogEvidence, DialogExecution, DialogOutcome } from './dialog.js';
import type { ContributionLedger } from './ledger.js';
import type { Invocation, InvocationRequest, MetadataAddress, Production, ProducerReport, QueryResultId } from './model.js';
import type { ContributionOperation, ContributionOperationCatalog } from './operations.js';
import { contributionOperationMethod } from './operations.js';
import type { AnswerStanding, ResultContract } from './outcomes.js';
import { answerStanding, assessFulfillment, attemptAnswers } from './outcomes.js';

export interface ContributionAttemptResult {
  readonly outcome: Exclude<DialogOutcome, { readonly kind: 'accepted' }> | { readonly kind: 'accepted' };
  /** Exact supplied designations with standing captured for this attempt report, even without a result contract. */
  readonly answers: readonly AnswerStanding[];
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
  /** The retained attempt selected without a dialog execution, including configuration failure. */
  readonly attempt: Production | null;
  readonly unavailable: AgentFailure | null;
}
export interface ContributionDependencies {
  readonly dialogAgent?: DialogAgent;
  readonly agent?: DialogAgent;
  readonly selectDialogAgent?: (request: InvocationRequest) => Promise<DialogAgent>;
  readonly operations?: ContributionOperationCatalog;
  readonly bounds?: InvestigationBounds;
  readonly onProgress?: ((report: AttemptReport) => void) | undefined;
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
    options: { readonly fresh?: boolean; readonly context?: readonly MetadataAddress[]; readonly subject: RecordId; readonly work?: RequestWork }): Promise<ContributionEvaluated> {
    await check();
    const method = contributionOperationMethod(operation, dependencies.operations);
    const { invocation, result } = ledger.invoke(request, { fresh: options.fresh === true });
    if (!options.fresh) {
      const candidates = ledger.productions().filter(production => production.producer.method === method && production.invocation !== null && ledger.invocation(production.invocation).result === result.id
        && (production.outcome.kind === 'accepted' || !transient.includes(production.outcome.failure.kind)));
      // A completed accepted investigation remains reusable even if an earlier attempt failed.
      // This selects execution reporting only; every standing claim is still selected independently.
      const attempt = candidates.find(production => production.outcome.kind === 'accepted') ?? candidates[0];
      if (attempt) {
        options.work?.scope('Reuse a retained producing outcome.', attempt.id).record('interpretation', 'reused', {
          records: [attempt.id, ...attempt.investigrams] });
        return { invocation, result: result.id, reused: true, execution: null, attempt, unavailable: null,
        attemptResult: completed.get(attempt.id) ?? { outcome: attempt.outcome.kind === 'accepted' ? { kind: 'accepted' } : attempt.outcome.failure,
          answers: attempt.outcome.kind === 'accepted' ? attemptAnswers(ledger, attempt, result.id).map(address => answerStanding(ledger, address)) : [],
          fulfillment: contract && attempt.outcome.kind === 'accepted' ? assessFulfillment(ledger, contract, result.id, attemptAnswers(ledger, attempt, result.id)) : null, report: attempt.report } };
      }
    }
    const agent = dependencies.selectDialogAgent ? await dependencies.selectDialogAgent(request) : dependencies.dialogAgent ?? dependencies.agent;
    if (!agent) {
      const unavailable: AgentFailure = { kind: 'configuration-unavailable', code: 'investigating-agent-not-configured',
        diagnostic: 'No investigating agent is configured for contribution investigations.' };
      const attempt = ledger.abandon(ledger.begin({ producer: { mechanism: 'agentic', method, agent: null }, invocation: invocation.id }), unavailable.kind, unavailable);
      const attemptResult = { outcome: unavailable, answers: [], fulfillment: null, report: null };
      completed.set(attempt.id, attemptResult);
      options.work?.scope('Retain the unavailable investigation attempt; no agent was opened.', attempt.id).record('interpretation', 'established', {
        records: [attempt.id], limitations: [unavailable.diagnostic] });
      return { invocation, result: result.id, reused: false, execution: null, attempt, attemptResult, unavailable };
    }
    const report = (value: Omit<AttemptReport, 'session' | 'request'>): AttemptReport => ({ ...value, session: ledger.session,
        ...(options.work ? { parent: options.work.context } : {}),
        request: { operation: operation.id, subject: options.subject, parameters: {} },
        ...(request.option ? { followUp: { owner: request.option.investigram, key: request.option.key,
          meaning: ledger.investigram(request.option.investigram).options.find(option => option.key === request.option!.key)!.meaning } } : {}) });
    const execution = await conductDialog({ ledger, store, evidence, operation: { ...operation, method, contract }, invocation: invocation.id, agent, ...(options.work ? { work: options.work } : {}), ...(dependencies.operations ? { operations: dependencies.operations } : {}), usage, check, signal,
      onReport: value => dependencies.onReport?.(report(value)), onProgress: value => dependencies.onProgress?.(report(value)),
      ...(dependencies.bounds ? { bounds: dependencies.bounds } : {}), ...(options.context ? { context: options.context } : {}) });
    if (signal.aborted) throw signal.reason;
    const { outcome } = execution;
    options.work?.scope('Retain the producing outcome and its accepted contributions.', execution.production.id).record('interpretation', 'established', {
      records: [execution.production.id, ...execution.production.investigrams], limitations: [`Producing outcome: ${outcome.kind}.`] });
    const attemptResult: ContributionAttemptResult = { outcome: outcome.kind === 'accepted' ? { kind: 'accepted' } : outcome,
      answers: outcome.kind === 'accepted' ? attemptAnswers(ledger, execution.production, result.id).map(address => answerStanding(ledger, address)) : [],
      fulfillment: outcome.kind === 'accepted' ? outcome.fulfillment : null, report: execution.production.report };
    completed.set(execution.production.id, attemptResult);
    return { invocation, result: result.id, reused: false, execution, attempt: null, attemptResult,
      unavailable: outcome.kind === 'communication-failure' || outcome.kind === 'configuration-unavailable' ? outcome : null };
  } };
}

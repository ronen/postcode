import type { Acceptance, ContributionLedger } from './ledger.js';
import { InvalidContribution, addressKey, itemKey } from './model.js';
import type { AssociationAddress, DeclarationAddress, InvocationId, ItemAddress, Producer, Production, QueryResultId } from './model.js';
import type { ProductionHandle } from './production.js';

/** A requirement of a requested result contract, checked against the actual selected answer. */
export type Requirement =
  | { readonly kind: 'designated-answer'; readonly description: string }
  /** Required specialized content. `unmet` explains a shortfall in an item of the type, or returns null when it satisfies the requirement. */
  | { readonly kind: 'content'; readonly description: string; readonly type: string; readonly unmet?: (body: unknown) => string | null };
export interface ResultContract { readonly id: string; readonly requirements: readonly Requirement[] }

export interface AlternativeFulfillment {
  readonly designation: AssociationAddress;
  /** Unmet requirements determined by PostCode's contract checks for this alternative's own selected content. */
  readonly unmet: readonly { readonly requirement: string; readonly reason: string }[];
}
/**
 * Request fulfillment, separate from contribution validity and from substantive
 * correctness. A met contract does not establish that the answer is true.
 */
export interface Fulfillment {
  readonly contract: string;
  readonly result: QueryResultId;
  /**
   * `fulfilled` only when every alternative in scope meets every requirement.
   * `no-current-answer` means every designation was displaced; `no-designated-answer`
   * means none was ever supplied. `no-answer-supplied` means an explicit selection, such as
   * one attempt's own answers, was empty; other answers of the Query result may still stand.
   * None of these establishes absence of findings.
   */
  readonly status: 'fulfilled' | 'unfulfilled' | 'no-current-answer' | 'no-designated-answer' | 'no-answer-supplied';
  readonly alternatives: readonly AlternativeFulfillment[];
  /** Exact historical designations and the changes that displaced them, for qualified historical access. */
  readonly history: readonly { readonly designation: AssociationAddress; readonly displacedBy: readonly DeclarationAddress[] }[];
}

/** Items selected by a designation, directly and through declaration membership. */
export function designatedItems(ledger: ContributionLedger, designation: AssociationAddress): readonly ItemAddress[] {
  const items = new Map<string, ItemAddress>();
  for (const address of [designation, ...ledger.memberAssociations(designation)]) {
    for (const member of ledger.association(address).declaration.members) if (member.kind === 'item') items.set(itemKey(member.item), member.item);
  }
  return [...items.values()];
}

/**
 * Assess a contract against current designated answers, or against an explicit selection
 * of particular alternatives. Read-only: assessment records no producer exposure.
 */
export function assessFulfillment(ledger: ContributionLedger, contract: ResultContract, result: QueryResultId,
  selection?: readonly AssociationAddress[]): Fulfillment {
  const all = ledger.designations(result, 'all');
  const selected = selection ?? ledger.designations(result, 'current').map(entry => entry.address);
  const known = new Set(all.map(entry => addressKey(entry.address)));
  if (selected.some(address => !known.has(addressKey(address)))) throw new Error('Selected designation does not belong to this Query result');
  const alternatives = selected.map(designation => {
    const items = designatedItems(ledger, designation).map(address => ledger.item(address));
    const unmet = contract.requirements.flatMap(requirement => {
      if (requirement.kind !== 'content') return [];
      const candidates = items.filter(item => item.type === requirement.type);
      if (!candidates.length) return [{ requirement: requirement.description, reason: `The selected answer contains no ${requirement.type} content.` }];
      const reasons = candidates.map(item => requirement.unmet?.(item.body) ?? null);
      return reasons.some(reason => reason === null) ? [] : [{ requirement: requirement.description, reason: reasons[0]! }];
    });
    return { designation, unmet };
  });
  const history = all.flatMap(entry => {
    const displacedBy = ledger.standing(entry.address).displacedBy;
    return displacedBy.length ? [{ designation: entry.address, displacedBy }] : [];
  });
  const needsAnswer = contract.requirements.length > 0;
  const status = alternatives.length ? alternatives.every(item => !item.unmet.length) ? 'fulfilled' : 'unfulfilled'
    : !needsAnswer ? 'fulfilled' : selection ? 'no-answer-supplied' : all.length ? 'no-current-answer' : 'no-designated-answer';
  return { contract: contract.id, result, status, alternatives, history };
}

/** Shared submission guidance for report-only returns and substantive investigrams. */
export const contributionSubmissionGuidance = 'investigrams may be empty when a producer report is supplied. For an answer-only return, use { investigrams: [], report: { answer: [address] } }; no placeholder investigram is needed. Every investigram must contribute at least one content item, organizing declaration or qualified metadata entry (option, illustration or inconsistency report). A qualification alone is not a contribution. If you choose to retain an adequacy judgment as content, put it in a qualified prose item; that note does not require a new answer designation.';

/** Shared authoring guidance for the producer report's explicit answer selection. */
export const reportAnswerGuidance = 'report.answer is optional: this submission’s own answer designations already count as its answer, so you need not repeat them. Use report.answer to explicitly return existing answer designations for this invocation, for example when an earlier answer remains adequate and no new designation is needed. Each entry is { investigram: <retained investigram handle>, declaration: <declaration key> }, or { investigram: { local: <investigram key in this submission> }, declaration: <declaration key> } for a designation in this submission. The declaration must be an add or supersede designation of this invocation’s Query result. Reference the owning investigram and declaration key, not an invocation handle, Query result handle or arbitrary dialogue handle. Repeating an own designation here is allowed but unnecessary; do not list the same address twice. Returning an existing designation does not change its standing or clear its reconsideration causes.';

/**
 * The answers one concluded attempt supplied for a Query result: the designations its own
 * investigrams declared for it, and exact existing designations it reported as its answer.
 * Answers that merely stand for the same Query result from other attempts are not included.
 */
export function attemptAnswers(ledger: ContributionLedger, production: Production, result: QueryResultId): readonly AssociationAddress[] {
  const answers = new Map<string, AssociationAddress>();
  for (const id of production.investigrams) for (const declaration of ledger.investigram(id).declarations) {
    if (declaration.operation !== 'withdraw' && declaration.target.kind === 'result' && declaration.target.result === result) {
      const address = { investigram: id, declaration: declaration.key };
      answers.set(addressKey(address), address);
    }
  }
  for (const address of production.report?.answer ?? []) {
    const target = ledger.association(address).declaration.target;
    if (target.kind === 'result' && target.result === result) answers.set(addressKey(address), address);
  }
  return [...answers.values()];
}

/** What a producing attempt returned, kept distinct from whether a retained contribution fulfills its request. */
export type ProductionOutcome =
  /** Nothing was submitted; no unaccepted partial work is retained. */
  | { readonly kind: 'no-contribution'; readonly reason: string; readonly production: Production }
  /** A structurally invalid submission that bounded repair did not correct. */
  | { readonly kind: 'invalid-submission'; readonly problems: readonly string[]; readonly production: Production }
  /** A valid contribution, retained with all its declarations in effect whatever its fulfillment. */
  | { readonly kind: 'accepted'; readonly acceptance: Acceptance; readonly production: Production; readonly repairs: number;
    /**
     * Determined by PostCode's contract checks, for the answers this attempt itself supplied.
     * An earlier answer still standing for the same Query result does not fulfill this attempt
     * unless the attempt explicitly returned it. Assess the Query result as a whole separately.
     */
    readonly fulfillment: Fulfillment | null;
    /** Reported by the producer; a different observation from the contract checks. */
    readonly reportedInability: string | null };

export interface ProductionRequest {
  readonly producer: Producer;
  readonly invocation?: InvocationId | null;
  readonly contract?: ResultContract | null;
  /** Bounded structural repair attempts within the same execution. */
  readonly repairs?: number;
}
/** Returns a contribution to submit, or undefined to end without submitting. */
export type Produce = (production: ProductionHandle, repair: { readonly problem: string } | null) => unknown | Promise<unknown>;

/**
 * The common producer boundary: one producing execution acquires its inputs through its
 * production, submits explicitly, and is accepted or concluded. Mechanical wrappers and
 * agentic dialog coordination share this acceptance and outcome contract, not an execution protocol.
 * Unexpected defects propagate.
 */
export async function produce(ledger: ContributionLedger, request: ProductionRequest, producer: Produce): Promise<ProductionOutcome> {
  const handle = ledger.begin({ producer: request.producer, invocation: request.invocation ?? null });
  const problems: string[] = [];
  for (let attempt = 0; ; attempt++) {
    let contribution: unknown;
    try {
      contribution = await producer(handle, attempt ? { problem: problems.at(-1)! } : null);
    } catch (error) {
      // A producer defect propagates unchanged. Its production is discarded so nothing can be submitted late.
      handle.close();
      throw error;
    }
    if (contribution === undefined) {
      return problems.length ? { kind: 'invalid-submission', problems, production: ledger.abandon(handle, 'invalid-submission', { kind: 'invalid-submission', problems }) }
        : { kind: 'no-contribution', reason: 'not-submitted', production: ledger.abandon(handle, 'not-submitted') };
    }
    // Structural repair concerns acceptance only. Once a contribution is accepted, a failure of
    // the fulfillment check is a defect of that check: it propagates, and never reopens repair.
    let acceptance: Acceptance;
    try {
      acceptance = ledger.accept([{ production: handle, contribution }]);
    } catch (error) {
      // Only a structural rejection keeps the production open, and only while a permitted repair continues.
      // Any other failure of acceptance, such as a defect in a content contract, ends the execution:
      // it propagates unchanged and its production is discarded so nothing can be submitted late.
      if (!(error instanceof InvalidContribution)) { handle.close(); throw error; }
      problems.push(error.message);
      if (attempt >= (request.repairs ?? 0)) return { kind: 'invalid-submission', problems, production: ledger.abandon(handle, 'invalid-submission', { kind: 'invalid-submission', problems }) };
      continue;
    }
    const production = ledger.production(handle.id);
    const result = request.contract && request.invocation ? ledger.invocation(request.invocation).result : null;
    const fulfillment = request.contract && result ? assessFulfillment(ledger, request.contract, result, attemptAnswers(ledger, production, result)) : null;
    return { kind: 'accepted', acceptance, production, repairs: attempt, fulfillment, reportedInability: production.report?.inability ?? null };
  }
}

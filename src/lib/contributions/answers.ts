import { answerSupport } from './answer-support.js';
import { answerSupportIdentity } from './support-identity.js';
import type { AnswerSupport } from './answer-support.js';
import { identityReference, methods, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { ProgramRecordStore, RecordContext, RecordId } from '../records.js';
import type { ContributionLedger } from './ledger.js';
import type { AssociationAddress, DeclarationAddress, FollowUpOption, Grounds, InvocationRequest, InvestigramId, ItemAddress, MetadataAddress, Producer,
  Qualification, QueryResultId } from './model.js';
import { assessFulfillment, designatedItems } from './outcomes.js';
import type { Fulfillment, ResultContract } from './outcomes.js';
import type { Cause } from './status.js';

/** One selected content item with its owner's provenance and both applicable qualifications. */
export interface AnswerItem {
  readonly address: ItemAddress;
  readonly type: string;
  readonly body: unknown;
  readonly qualification: Qualification | null;
  readonly ownerQualification: Qualification | null;
  readonly producer: Producer;
  readonly evidence: readonly RecordId[];
  readonly support: readonly ItemAddress[];
  /** Needs-reconsideration causes of the item's producer, as they were when the answer was constructed. */
  readonly producing: readonly Cause[];
}
/** One designated answer, exactly as selected, with its status when the answer was constructed. */
export interface AnswerAlternative {
  readonly designation: AssociationAddress;
  readonly producer: Producer;
  readonly qualification: Qualification | null;
  readonly grounds: Grounds | null;
  readonly ownerQualification: Qualification | null;
  /** Exact member-use graph, resolved in the answer's fixed support. */
  readonly uses: readonly AssociationAddress[];
  readonly items: readonly AnswerItem[];
  /** Displacements of member uses accepted after this designation; it still selects its original members. */
  readonly membership: readonly Cause[];
  readonly producing: readonly Cause[];
  readonly inconsistencies: readonly MetadataAddress[];
  /** Requirements of the requested result contract this alternative's own content does not meet. */
  readonly unmet: readonly { readonly requirement: string; readonly reason: string }[];
  /** Follow-up options offered by the contributions this alternative selects. Each stays attached to its owner. */
  readonly options: readonly { readonly address: MetadataAddress; readonly option: FollowUpOption }[];
}
/**
 * A retained answer over contributions: the current designated answers of one Query result,
 * all equally standing alternatives distinctly, captured with their content and status.
 * Enumeration is stable for the same retained information and implies no preference. Later
 * declarations produce a new answer; they never change this one.
 */
export interface ContributionAnswer extends RecordContext {
  readonly kind: 'contribution-projection';
  readonly lens: string;
  readonly subject: RecordId;
  readonly parameters: Readonly<Record<string, string>>;
  /** The question this answers. The invocation that produced or reused it is reporting, not answer identity. */
  readonly question: { readonly result: QueryResultId; readonly request: InvocationRequest };
  readonly alternatives: readonly AnswerAlternative[];
  readonly support: AnswerSupport;
  /** Designations no longer standing, with the grounds of their displacement, for exact historical access. */
  readonly history: readonly { readonly designation: AssociationAddress;
    readonly displacedBy: readonly { readonly change: DeclarationAddress; readonly operation: 'supersede' | 'withdraw'; readonly grounds: string }[] }[];
  /** Fulfillment of the requested result contract by the current answer as a whole; null when no contract applies. */
  readonly fulfillment: Fulfillment['status'] | null;
}

/**
 * Select the current designated answer of a Query result into a retained answer. Read-only
 * answer assembly: it establishes no claim and records no producer exposure.
 */
export function selectContributionAnswer(store: ProgramRecordStore, ledger: ContributionLedger, selection: { readonly lens: string; readonly subject: RecordId;
  readonly parameters: Readonly<Record<string, string>>; readonly result: QueryResultId; readonly contract: ResultContract | null }): ContributionAnswer {
  const session = ledger.session, result = ledger.result(selection.result), request = ledger.invocation(result.origin).request;
  const fulfillment = selection.contract ? assessFulfillment(ledger, selection.contract, result.id) : null;
  const producer = (address: { readonly investigram: ItemAddress['investigram'] }) => ledger.production(ledger.investigram(address.investigram).production).producer;
  const support = answerSupport(store, ledger);
  if (request.option) support.metadata({ ...request.option, metadata: 'option' });
  const alternatives = ledger.designations(result.id).map((entry): AnswerAlternative => {
    const status = ledger.status.association(entry.address), items = designatedItems(ledger, entry.address);
    const uses = [entry.address, ...ledger.memberAssociations(entry.address)];
    uses.forEach(support.use);
    const owners = [...new Set([...uses.map(use => use.investigram), ...items.map(item => item.investigram)])];
    for (const investigram of owners) {
      const owner = ledger.investigram(investigram);
      for (const option of owner.options) support.metadata({ investigram, metadata: 'option', key: option.key });
      for (const illustration of owner.illustrations) support.metadata({ investigram, metadata: 'illustration', key: illustration.key });
    }
    return { designation: entry.address, producer: producer(entry.address), qualification: entry.declaration.qualification ?? entry.owner.qualification, ownerQualification: entry.owner.qualification, uses, grounds: entry.declaration.grounds,
      items: items.map(address => {
        const item = ledger.item(address), owner = ledger.investigram(address.investigram);
        return { address, type: item.type, body: item.body, qualification: item.qualification, ownerQualification: owner.qualification, producer: producer(address),
          evidence: item.evidence, support: item.support, producing: ledger.status.investigram(address.investigram).producing };
      }),
      membership: status.membership, producing: status.producing, inconsistencies: status.inconsistencies,
      unmet: fulfillment?.alternatives.find(item => item.designation.investigram === entry.address.investigram && item.designation.declaration === entry.address.declaration)?.unmet ?? [],
      options: owners.flatMap(investigram => ledger.investigram(investigram).options.map(option => ({ address: { investigram, metadata: 'option' as const, key: option.key }, option }))) };
  });
  const history = ledger.designations(result.id, 'all').flatMap(entry => {
    const displacedBy = ledger.standing(entry.address).displacedBy.map(change => {
      support.change(change);
      const declaration = ledger.declaration(change);
      if (declaration.operation === 'add') throw new Error('Expected a displacing declaration');
      return { change, operation: declaration.operation, grounds: declaration.grounds.text };
    });
    if (displacedBy.length) support.use(entry.address);
    return displacedBy.length ? [{ designation: entry.address, displacedBy }] : [];
  });
  const payload: Omit<ContributionAnswer, 'id'> = store.capture({ kind: 'contribution-projection', method: methods.contributionProjection, session, lens: selection.lens,
    subject: selection.subject, parameters: selection.parameters, question: { result: result.id, request }, alternatives, history, support: support.finish(), fulfillment: fulfillment?.status ?? null });
  // Exact immutable owners identify content, provenance and the question. Only selection and
  // captured derived status need value keys. Normalize reference positions, never literal text
  // or operational input-exclusion metadata retained within the resolved evidence payload.
  const ref = (id: RecordId) => identityReference(session, id);
  const address = <T extends { readonly investigram: InvestigramId }>(value: T) => ({ ...value, investigram: ref(value.investigram) });
  const identity = { kind: payload.kind, method: payload.method, lens: payload.lens, subject: ref(payload.subject), parameters: payload.parameters,
    question: ref(payload.question.result), alternatives: payload.alternatives.map(alternative => ({ designation: address(alternative.designation),
      uses: alternative.uses.map(address), items: alternative.items.map(item => address(item.address)), options: alternative.options.map(option => address(option.address)), unmet: alternative.unmet })),
    history: payload.history.map(entry => ({ designation: address(entry.designation), displacedBy: entry.displacedBy.map(value => address(value.change)) })),
    support: answerSupportIdentity(session, payload.support), fulfillment: payload.fulfillment };
  const answer = { ...payload, id: recordId(session, payload.kind, [identityReference(session, session), identity]) };
  store.put([answer]);
  return store.get(answer.id) as ContributionAnswer;
}

export interface ContributionAnswerContent { readonly projection: ContributionAnswer }
/** The retained answer carries its whole selected content, so exact presentation follows only this record. */
export function resolveContributionAnswer(store: Pick<ProgramRecordStore, 'get'>, projection: ContributionAnswer): ContributionAnswerContent {
  const retained = store.get(projection.id);
  if (retained.kind !== 'contribution-projection') throw new Error('Invalid retained contribution answer');
  return freezeOwned({ projection: retained });
}


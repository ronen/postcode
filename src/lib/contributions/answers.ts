import { identityReference, methods, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { ProgramRecordStore, RecordContext, RecordId } from '../records.js';
import type { ContributionLedger } from './ledger.js';
import type { AssociationAddress, DeclarationAddress, FollowUpOption, Grounds, InvocationRequest, ItemAddress, MetadataAddress, Producer,
  Qualification, QueryResultId } from './model.js';
import { assessFulfillment, designatedItems } from './outcomes.js';
import type { Fulfillment, ResultContract } from './outcomes.js';
import { renderStateDiagram, stateDiagramIncompatibility } from './state-diagram.js';
import type { StateDiagram } from './state-diagram.js';
import type { StateModel } from './state-model.js';
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
  const alternatives = ledger.designations(result.id).map((entry): AnswerAlternative => {
    const status = ledger.status.association(entry.address), items = designatedItems(ledger, entry.address);
    const owners = [...new Set([entry.address.investigram, ...items.map(item => item.investigram)])];
    return { designation: entry.address, producer: producer(entry.address), qualification: entry.declaration.qualification ?? entry.owner.qualification, grounds: entry.declaration.grounds,
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
      const declaration = ledger.declaration(change);
      if (declaration.operation === 'add') throw new Error('Expected a displacing declaration');
      return { change, operation: declaration.operation, grounds: declaration.grounds.text };
    });
    return displacedBy.length ? [{ designation: entry.address, displacedBy }] : [];
  });
  const payload: Omit<ContributionAnswer, 'id'> = structuredClone({ kind: 'contribution-projection', method: methods.contributionProjection, session, lens: selection.lens,
    subject: selection.subject, parameters: selection.parameters, question: { result: result.id, request }, alternatives, history, fulfillment: fulfillment?.status ?? null });
  // Only the producing Session's namespace is normalized in the identity, so equal answers are equal independently of it.
  const identity = JSON.parse(JSON.stringify(payload).replaceAll(session, 'session')) as unknown;
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

export interface ArrangedAlternative {
  readonly designation: AssociationAddress;
  readonly producer: Producer;
  /** Statements a reader needs alongside the content: epistemic status, limitations, and current concerns. */
  readonly qualifications: readonly string[];
  readonly prose: readonly string[];
  /** A diagram for each selected state model, or why none can be drawn from this alternative's content. */
  readonly diagrams: readonly StateDiagram[];
  readonly diagramUnavailable: string | null;
  readonly options: readonly { readonly address: MetadataAddress; readonly meaning: string; readonly operation: string; readonly resultContract: string | null }[];
}
export interface ContributionAnswerView {
  readonly answer: RecordId;
  readonly title: string;
  /** Present when the Query result has no standing designated answer; historical answers remain exactly accessible. */
  readonly noCurrentAnswer: { readonly explanation: string; readonly withdrawn: ContributionAnswer['history'] } | null;
  readonly alternatives: readonly ArrangedAlternative[];
  readonly notices: readonly string[];
}
const statusPhrase: Readonly<Record<Qualification['status'], string>> = { 'mechanically-derived': 'Mechanically derived', 'recorded-assertion': 'Recorded assertion',
  observation: 'Observation', interpretation: 'Interpretation', 'organizing-policy': 'Organizing policy' };

/**
 * Arrange a retained contribution answer as explanation with pictures. This is presentation:
 * it uses only the supplied content, draws a diagram for every alternative that supports one
 * without needing an authored illustration, reports each alternative that does not, and never
 * merges alternatives or chooses between them.
 */
export function arrangeContributionAnswer(content: ContributionAnswerContent, title: string, bearerLabel: string): ContributionAnswerView {
  const { projection } = content;
  const alternatives = projection.alternatives.map((alternative): ArrangedAlternative => {
    const models = alternative.items.filter(item => item.type === 'state-model').map(item => item.body as StateModel);
    const drawable = models.filter(model => stateDiagramIncompatibility(model) === null);
    const qualify = (qualification: Qualification | null) => qualification ? [`${statusPhrase[qualification.status]} (${qualification.method})${qualification.scope ? `, scope: ${qualification.scope}` : ''}.`,
      ...(qualification.guarantee ? [qualification.guarantee] : []), ...qualification.limitations] : [];
    const concerns = [...alternative.membership, ...alternative.producing, ...alternative.items.flatMap(item => item.producing)];
    return { designation: alternative.designation, producer: alternative.producer,
      qualifications: [...new Set([...qualify(alternative.qualification), ...alternative.items.flatMap(item => [...qualify(item.ownerQualification), ...qualify(item.qualification)]),
        ...(concerns.length ? [`Needs reconsideration: ${new Set(concerns.map(cause => `${cause.change.investigram}#${cause.change.declaration}`)).size} later change(s) to information this answer selected or its producer received. This does not establish an error.`] : []),
        ...(alternative.inconsistencies.length ? [`${alternative.inconsistencies.length} unresolved inconsistency report(s) target this answer.`] : []),
        ...alternative.unmet.map(item => `Requested result not met: ${item.requirement} ${item.reason}`)])],
      prose: alternative.items.flatMap(item => item.type === 'prose' ? [(item.body as { text: string }).text] : []),
      diagrams: drawable.map(model => renderStateDiagram(model, bearerLabel)),
      diagramUnavailable: drawable.length ? null : models.length ? stateDiagramIncompatibility(models[0]!) : 'This alternative selects no state model.',
      options: alternative.options.map(({ address, option }) => ({ address, meaning: option.meaning, operation: option.request.operation, resultContract: option.request.resultContract })) };
  });
  const drawn = alternatives.filter(item => item.diagrams.length).length;
  return freezeOwned({ answer: projection.id, title, alternatives,
    noCurrentAnswer: alternatives.length ? null : { withdrawn: projection.history,
      explanation: projection.history.length ? 'Every designated answer to this question has been withdrawn or superseded without a standing replacement. This is not a finding that nothing can be established, and no earlier answer is restored. Historical answers remain exactly accessible; a fresh investigation can be requested explicitly.'
        : 'No answer has been designated for this question.' },
    notices: [...(alternatives.length > 1 ? [`${alternatives.length} equally standing alternative answers are shown separately. Their order implies no preference, and they are not reconciled.`] : []),
      ...(alternatives.length > 1 && drawn > 0 && drawn < alternatives.length ? [`A diagram can be drawn for ${drawn} of ${alternatives.length} alternatives; the request is not fulfilled for the others.`] : [])] });
}

import { answerSupport } from './answer-support.js';
import type { AnswerSupport } from './answer-support.js';
import { addressKey, itemKey } from './model.js';
import { identityReference, methods, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { ProgramRecordStore, RecordContext, RecordId } from '../records.js';
import type { ContributionLedger } from './ledger.js';
import type { AssociationAddress, DeclarationAddress, FollowUpOption, Grounds, InvocationRequest, InvestigramId, ItemAddress, MetadataAddress, Producer,
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
  const payload: Omit<ContributionAnswer, 'id'> = structuredClone({ kind: 'contribution-projection', method: methods.contributionProjection, session, lens: selection.lens,
    subject: selection.subject, parameters: selection.parameters, question: { result: result.id, request }, alternatives, history, support: support.finish(), fulfillment: fulfillment?.status ?? null });
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

/** Qualification stays attached to its exact source; owner statements qualify that source's production. */
export interface ArrangedQualification {
  readonly kind: 'selected-content' | 'selected-use' | 'supporting-item' | 'bearer-identification' | 'displacement' | 'reconsideration' | 'inconsistency' | 'result-contract';
  readonly source: { readonly kind: 'item'; readonly address: ItemAddress }
    | { readonly kind: 'association' | 'declaration'; readonly address: DeclarationAddress }
    | { readonly kind: 'metadata'; readonly address: MetadataAddress };
  readonly label: string;
  readonly statements: readonly string[];
  readonly owner: { readonly investigram: InvestigramId; readonly statements: readonly string[] } | null;
}
export interface ArrangedAlternative {
  readonly designation: AssociationAddress;
  readonly producer: Producer;
  /** Statements a reader needs alongside the content: epistemic status, limitations, and current concerns. */
  readonly qualifications: readonly ArrangedQualification[];
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
export function arrangeContributionAnswer(content: ContributionAnswerContent, title: string): ContributionAnswerView {
  const { projection } = content;
  const useSupport = new Map(projection.support.uses.map(value => [addressKey(value.address), value]));
  const itemSupport = new Map(projection.support.items.map(value => [itemKey(value.address), value]));
  const changeSupport = new Map(projection.support.changes.map(value => [addressKey(value.address), value]));
  const bearerSupport = new Map(projection.support.bearers.map(value => [value.entity, value]));
  const alternatives = projection.alternatives.map((alternative): ArrangedAlternative => {
    const models = alternative.items.filter(item => item.type === 'state-model').map(item => item.body as StateModel);
    const drawable = models.filter(model => stateDiagramIncompatibility(model) === null);
    const qualify = (qualification: Qualification | null) => qualification ? [`${statusPhrase[qualification.status]} (${qualification.method})${qualification.scope ? `, scope: ${qualification.scope}` : ''}.`,
      ...(qualification.guarantee ? [qualification.guarantee] : []), ...qualification.limitations] : [];
    const uses = alternative.uses.map(address => useSupport.get(addressKey(address))!);
    const selected = new Map<string, AnswerSupport['items'][number]>();
    const include = (address: ItemAddress) => {
      const key = itemKey(address); if (selected.has(key)) return;
      const value = itemSupport.get(key)!; selected.set(key, value);
      [...value.item.support, ...value.item.dependencies].forEach(include);
    };
    alternative.items.forEach(item => include(item.address));
    const selectedItems = [...selected.values()];
    const ownerIds = new Set([...uses.map(use => use.address.investigram), ...selectedItems.map(item => item.address.investigram)]);
    const bearerUses = models.flatMap(model => model.bearer.kind === 'entity' ? bearerSupport.get(model.bearer.entity)?.identifications ?? [] : [])
      .map(address => useSupport.get(addressKey(address))!);
    bearerUses.forEach(use => { ownerIds.add(use.address.investigram); use.declaration.members.forEach(member => { if (member.kind === 'item') ownerIds.add(member.item.investigram); }); });
    const owners = projection.support.owners.filter(owner => ownerIds.has(owner.investigram));
    const concerns = [...uses.flatMap(use => [...use.status.membership, ...use.status.producing]), ...owners.flatMap(owner => owner.producing)];
    const conflicts = new Set([...uses.flatMap(use => use.status.inconsistencies), ...selectedItems.flatMap(item => item.inconsistencies)].map(address => JSON.stringify(address)));
    const displacements = uses.flatMap(use => use.status.standing.displacedBy.map(address => changeSupport.get(addressKey(address))!));
    const changes = [...new Map([...displacements, ...concerns.map(cause => changeSupport.get(addressKey(cause.change))!)].map(change => [addressKey(change.address), change])).values()];
    const reports = projection.support.metadata.filter(meta => conflicts.has(JSON.stringify(meta.address)));
    const bearer = (model: StateModel): string => {
      if (model.bearer.kind === 'role') return model.bearer.role;
      const entity = model.bearer.entity, selected = bearerSupport.get(entity);
      const labels = selected?.identifications.flatMap(address => {
        const use = useSupport.get(addressKey(address))!;
        return use.declaration.members.flatMap(member => member.kind === 'item' ? [itemSupport.get(itemKey(member.item))!.item] : [])
          .filter(item => item.type === 'identification').map(item => { const body = item.body as { name: string | null; designation: string }; return body.name ?? body.designation; });
      }) ?? [];
      return labels.length ? [...new Set(labels)].join(' / ') : 'Unlabelled Entity';
    };
    const concernText = (causes: readonly Cause[]) => causes.length ? [`Needs reconsideration: ${new Set(causes.map(cause => addressKey(cause.change))).size} later change(s) to selected or received information. This does not establish an error.`] : [];
    const group = (kind: ArrangedQualification['kind'], source: ArrangedQualification['source'], label: string,
      statements: readonly string[]): ArrangedQualification => {
      const owner = projection.support.owners.find(owner => owner.investigram === source.address.investigram)!;
      return { kind, source, label, statements: [...new Set(statements)], owner: kind === 'result-contract' ? null : { investigram: owner.investigram,
        statements: [...qualify(owner.qualification), ...concernText(owner.producing),
          ...(owner.report?.inability ? [`Producer-reported inability: ${owner.report.inability}`] : []), ...(owner.report?.statement ? [owner.report.statement] : [])] } };
    };
    const selectedKeys = new Set(alternative.items.map(item => itemKey(item.address)));
    const displacedKeys = new Set(displacements.map(change => addressKey(change.address)));
    const qualifications: ArrangedQualification[] = [
      ...selectedItems.map(item => group(selectedKeys.has(itemKey(item.address)) ? 'selected-content' : 'supporting-item',
        { kind: 'item', address: item.address }, `${selectedKeys.has(itemKey(item.address)) ? 'Selected content' : 'Supporting item'}: ${item.item.key}`, qualify(item.item.qualification))),
      ...uses.map(use => group('selected-use', { kind: 'association', address: use.address }, `Selected use: ${use.address.declaration}`,
        [...qualify(use.declaration.qualification), ...concernText(use.status.membership)])),
      ...bearerUses.flatMap(use => [group('bearer-identification', { kind: 'association', address: use.address }, 'Bearer identification use',
        [...qualify(use.declaration.qualification), ...concernText(use.status.membership)]),
        ...use.declaration.members.flatMap(member => member.kind === 'item' ? [group('bearer-identification', { kind: 'item', address: member.item },
          'Bearer identification content', qualify(itemSupport.get(itemKey(member.item))!.item.qualification))] : [])]),
      ...changes.map(change => group(displacedKeys.has(addressKey(change.address)) ? 'displacement' : 'reconsideration',
        { kind: 'declaration', address: change.address }, displacedKeys.has(addressKey(change.address)) ? 'Displacement of selected use' : 'Change requiring reconsideration',
        [...qualify(change.declaration.qualification), `${change.declaration.operation}: ${change.declaration.grounds?.text ?? ''}`])),
      ...reports.map(report => group('inconsistency', { kind: 'metadata', address: report.address }, 'Inconsistency report',
        [...qualify(report.value.qualification), ...('grounds' in report.value ? [`Unresolved inconsistency: ${report.value.grounds.text}`] : [])])),
      ...(alternative.unmet.length ? [group('result-contract', { kind: 'association', address: alternative.designation }, 'Requested result',
        alternative.unmet.map(item => `Requested result not met: ${item.requirement} ${item.reason}`))] : []),
    ];
    return { designation: alternative.designation, producer: alternative.producer, qualifications,
      prose: alternative.items.flatMap(item => item.type === 'prose' ? [(item.body as { text: string }).text] : []),
      diagrams: drawable.map(model => renderStateDiagram(model, bearer(model))),
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

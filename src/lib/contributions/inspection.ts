import { identityReference, methods, recordId } from '../identity.js';
import type { ProgramRecordStore, RecordContext, RecordId } from '../records.js';
import { answerSupportIdentity } from './support-identity.js';
import { answerSupport } from './answer-support.js';
import type { AnswerSupport } from './answer-support.js';
import type { ContributionLedger } from './ledger.js';
import { addressKey, itemKey } from './model.js';
import type { AssociationAddress, Invocation, ItemAddress } from './model.js';
import { designatedItems } from './outcomes.js';
import { availableSubject } from './subjects.js';
import type { ExactSubject } from './subjects.js';

/** Inspection is a fixed selection of exact content and explicit associated uses, not a new investigation. */
export interface ContributionInspection extends RecordContext {
  readonly kind: 'contribution-inspection-projection';
  readonly lens: 'inspect';
  readonly parameters: Readonly<Record<string, never>>;
  readonly subjects: readonly ExactSubject[];
  readonly mechanical: RecordId | null;
  readonly uses: readonly AssociationAddress[];
  readonly items: readonly ItemAddress[];
  readonly support: AnswerSupport;
  /** Investigations of these exact subjects. This relationship implies neither delivery nor reliance. */
  readonly investigations: readonly Invocation[];
  readonly coverage: 'all-retained-associated-uses' | 'exact-selection';
}
export interface ContributionInspectionContent { readonly projection: ContributionInspection }
export function selectContributionInspection(store: ProgramRecordStore, ledger: ContributionLedger, subjects: readonly ExactSubject[], mechanical: RecordId | null = null): ContributionInspection {
  if (!subjects.length || subjects.some(subject => !availableSubject(ledger, subject))) throw new Error('Expected retained exact inspection subjects');
  const support = answerSupport(store, ledger), uses = new Map<string, AssociationAddress>(), items = new Map<string, ItemAddress>();
  const item = (address: ItemAddress) => { items.set(itemKey(address), address); support.item(address); };
  const use = (address: AssociationAddress) => { uses.set(addressKey(address), address); support.use(address); designatedItems(ledger, address).forEach(item); };
  for (const subject of subjects) {
    switch (subject.kind) {
      case 'entity': ledger.associations({ kind: 'entity', entity: subject.entity, role: 'any' }, 'all').forEach(entry => use(entry.address)); break;
      case 'content': item(subject.item); break;
      case 'designation': use(subject.association); break;
      case 'investigram': {
        const owner = ledger.investigram(subject.investigram);
        support.owner(owner.id);
        owner.items.forEach(value => item({ investigram: owner.id, item: value.key }));
        owner.declarations.forEach(value => value.operation === 'withdraw' ? support.change({ investigram: owner.id, declaration: value.key }) : use({ investigram: owner.id, declaration: value.key }));
        for (const [kind, entries] of [['option', owner.options], ['illustration', owner.illustrations], ['inconsistency', owner.inconsistencies]] as const) {
          entries.forEach(value => support.metadata({ investigram: owner.id, metadata: kind, key: value.key }));
        }
        break;
      }
    }
  }
  const payload: Omit<ContributionInspection, 'id'> = store.capture({ kind: 'contribution-inspection-projection', session: ledger.session,
    method: methods.contributionInspection, lens: 'inspect', parameters: {}, subjects, mechanical, uses: [...uses.values()], items: [...items.values()],
    support: support.finish(), investigations: [...new Map(subjects.flatMap(subject => ledger.investigationsOf(subject)).map(invocation => [invocation.id, invocation])).values()],
    coverage: subjects.every(subject => subject.kind === 'entity') ? 'all-retained-associated-uses' : 'exact-selection' });
  // Immutable exact references identify selected content. Hash captured standing,
  // not operational input-exclusion metadata or literal source text rewritten as IDs.
  const ref = (id: RecordId | null) => identityReference(ledger.session, id);
  const address = <T extends { investigram: ItemAddress['investigram'] }>(value: T) => ({ ...value, investigram: ref(value.investigram) });
  const identity = { kind: payload.kind, method: payload.method, lens: payload.lens, parameters: payload.parameters,
    subjects: subjects.map(subject => subject.kind === 'entity' ? { ...subject, entity: ref(subject.entity) }
      : subject.kind === 'investigram' ? { ...subject, investigram: ref(subject.investigram) }
        : subject.kind === 'content' ? { ...subject, item: address(subject.item) } : { ...subject, association: address(subject.association) }),
    mechanical: ref(mechanical), uses: payload.uses.map(address), items: payload.items.map(address),
    support: answerSupportIdentity(ledger.session, payload.support), investigations: payload.investigations.map(value => ref(value.id)), coverage: payload.coverage };
  const answer = { ...payload, id: recordId(ledger.session, payload.kind, [identityReference(ledger.session, ledger.session), identity]) };
  store.put([answer]);
  return store.get(answer.id) as ContributionInspection;
}
export function resolveContributionInspection(store: Pick<ProgramRecordStore, 'get'>, projection: ContributionInspection): ContributionInspectionContent {
  const retained = store.get(projection.id);
  if (retained.kind !== 'contribution-inspection-projection') throw new Error('Expected a retained contribution inspection');
  return { projection: retained };
}

import { evidenceDelivery } from '../evidence-delivery.js';
import type { ProgramRecord, ProgramRecordStore } from '../records.js';
import type { ContributionLedger } from './ledger.js';
import { addressKey, itemKey } from './model.js';
import type { AssociationAddress, ContentItem, Declaration, DeclarationAddress, EntityId, FollowUpOption, Grounds, Illustration,
  InconsistencyReport, InvestigramId, ItemAddress, MetadataAddress, Producer, ProductionId, ProducerReport, Qualification } from './model.js';
import { originatingQuestion } from './production.js';
import type { OriginatingQuestion } from './production.js';
import type { AssociationStatus, Cause, Standing } from './status.js';

export interface AnswerOwner {
  readonly investigram: InvestigramId;
  readonly producer: Producer;
  readonly production: ProductionId;
  readonly qualification: Qualification | null;
  readonly origin: OriginatingQuestion | null;
  readonly report: ProducerReport | null;
  readonly producing: readonly Cause[];
}
export interface AnswerUse {
  readonly address: AssociationAddress;
  readonly declaration: Exclude<Declaration, { operation: 'withdraw' }>;
  readonly question: OriginatingQuestion | null;
  readonly status: Omit<AssociationStatus, 'position'>;
}
/** Fixed, resolved support. Links retain their exact meaning; inclusion is not selection or exposure. */
export interface AnswerSupport {
  readonly owners: readonly AnswerOwner[];
  readonly items: readonly { readonly address: ItemAddress; readonly item: ContentItem; readonly inconsistencies: readonly MetadataAddress[] }[];
  readonly uses: readonly AnswerUse[];
  readonly changes: readonly { readonly address: DeclarationAddress; readonly declaration: Declaration; readonly standing: Standing | null }[];
  readonly metadata: readonly { readonly address: MetadataAddress; readonly value: FollowUpOption | Illustration | InconsistencyReport }[];
  readonly bearers: readonly { readonly entity: EntityId; readonly identifications: readonly AssociationAddress[] }[];
  readonly evidence: readonly ProgramRecord[];
}

/** Captures only selected paths and their necessary support, never the whole accumulating ledger. */
export function answerSupport(store: ProgramRecordStore, ledger: ContributionLedger) {
  const owners = new Map<InvestigramId, AnswerOwner>(), items = new Map<string, AnswerSupport['items'][number]>();
  const uses = new Map<string, AnswerUse>(), changes = new Map<string, AnswerSupport['changes'][number]>();
  const metadata = new Map<string, AnswerSupport['metadata'][number]>(), bearers = new Map<EntityId, AnswerSupport['bearers'][number]>();
  const evidence = new Set<ProgramRecord['id']>();
  const qualification = (value: Qualification | null) => value?.contexts.forEach(id => evidence.add(id));
  const grounds = (value: Grounds | null) => { value?.evidence.forEach(id => evidence.add(id)); value?.support.forEach(item); };
  const causes = (values: readonly Cause[]) => values.forEach(value => change(value.change));
  function owner(id: InvestigramId): void {
    if (owners.has(id)) return;
    const source = ledger.investigram(id), production = ledger.production(source.production);
    const value: AnswerOwner = { investigram: id, production: production.id, producer: production.producer, qualification: source.qualification,
      origin: production.invocation ? originatingQuestion(ledger, production.invocation) : null, report: production.report,
      producing: ledger.status.production(production.id) };
    owners.set(id, value);
    qualification(value.qualification); causes(value.producing);
  }
  function meta(address: MetadataAddress): void {
    const key = JSON.stringify(address);
    if (metadata.has(key)) return;
    const value = ledger.metadata(address);
    metadata.set(key, { address, value }); owner(address.investigram); qualification(value.qualification);
    if ('grounds' in value) {
      grounds(value.grounds);
      value.endpoints.forEach(endpoint => endpoint.kind === 'item' ? item(endpoint.item) : use(endpoint.association));
    }
    if ('inputs' in value) { value.inputs.forEach(item); value.evidence.forEach(id => evidence.add(id)); }
  }
  function change(address: DeclarationAddress): void {
    const key = addressKey(address);
    if (changes.has(key)) return;
    const declaration = ledger.declaration(address);
    const standing = declaration.operation === 'withdraw' ? null : ledger.standing(address);
    changes.set(key, { address, declaration, standing });
    owner(address.investigram); qualification(declaration.qualification); grounds(declaration.grounds);
    standing?.displacedBy.forEach(change);
    // The replacement's members remain references: grounds are not replacement content.
  }
  function item(address: ItemAddress): void {
    const key = itemKey(address);
    if (items.has(key)) return;
    const value = ledger.item(address), inconsistencies = ledger.inconsistencies({ kind: 'item', item: address });
    items.set(key, { address, item: value, inconsistencies }); owner(address.investigram);
    qualification(value.qualification); value.evidence.forEach(id => evidence.add(id));
    value.support.forEach(item); value.dependencies.forEach(item); inconsistencies.forEach(meta);
    if (value.type === 'state-model') {
      const model = value.body as import('./state-model.js').StateModel;
      if (model.bearer.kind === 'entity' && !bearers.has(model.bearer.entity)) {
        const entity = model.bearer.entity, identifications = ledger.identifications(entity).map(entry => entry.address);
        bearers.set(entity, { entity, identifications }); identifications.forEach(use);
      }
    }
  }
  function use(address: AssociationAddress): void {
    const key = addressKey(address);
    if (uses.has(key)) return;
    const { declaration } = ledger.association(address), { position: _position, ...status } = ledger.status.association(address);
    uses.set(key, { address, declaration, status,
      question: declaration.target.kind === 'result' ? originatingQuestion(ledger, ledger.result(declaration.target.result).origin) : null });
    owner(address.investigram); qualification(declaration.qualification); grounds(declaration.grounds);
    declaration.members.forEach(member => member.kind === 'item' ? item(member.item) : use(member.association));
    status.standing.displacedBy.forEach(change); causes(status.membership); causes(status.producing);
    status.content.forEach(value => causes(value.producing)); status.inconsistencies.forEach(meta);
  }
  return { use, item, change, metadata: meta,
    finish(): AnswerSupport {
      // Shared evidence traversal preserves record-specific support. Capture inputs and repository
      // bodies too: this is internal resolved support, not the agent's bounded evidence page.
      const composed = evidenceDelivery(store, ledger.session).compose([...evidence]);
      const records = new Map(composed.records.map(record => [record.id, record]));
      for (const record of [...records.values()]) if ('inputs' in record && typeof record.inputs === 'string') records.set(record.inputs, store.get(record.inputs));
      for (const repository of composed.repositories ?? []) records.set(repository.id, store.get(repository.id));
      return { owners: [...owners.values()], items: [...items.values()], uses: [...uses.values()], changes: [...changes.values()],
        metadata: [...metadata.values()], bearers: [...bearers.values()], evidence: [...records.values()] };
    } };
}

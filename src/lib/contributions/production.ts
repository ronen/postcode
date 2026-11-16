import type { RecordId } from '../records.js';
import type { ContributionLedger } from './ledger.js';
import type { AssociationAddress, AssociationDeclaration, ContentItem, Declaration, DeclarationAddress, Delivery, EntityId, FollowUpOption,
  Illustration, InconsistencyReport, InvestigramId, InvocationId, ItemAddress, MetadataAddress, Producer, ProductionId, Qualification,
  QueryResultId, SelectionScope } from './model.js';
import { freezeOwned } from '../immutable.js';
import { InvalidAcquisition, addressKey } from './model.js';
import type { AssociationStatus, Cause, Standing } from './status.js';

export interface DeliveredOwner {
  readonly investigram: InvestigramId;
  readonly production: ProductionId;
  readonly producer: Producer;
  /** Owner-wide qualification, applicable alongside any narrower item or declaration qualification. */
  readonly qualification: Qualification | null;
  /** Producing-context concerns already known at this delivery. */
  readonly concerns: readonly Cause[];
}
export interface DeliveredItem {
  readonly address: ItemAddress;
  readonly owner: DeliveredOwner;
  readonly route: AssociationAddress | null;
  readonly coverage: 'complete' | 'excerpt';
  readonly type: string;
  /**
   * The item's own qualification, applicable alongside the owner's. It, and the item's
   * attribution and support, accompany every delivery; an excerpt bounds only the body.
   */
  readonly qualification: Qualification | null;
  readonly referents: readonly EntityId[];
  readonly evidence: readonly RecordId[];
  readonly support: readonly ItemAddress[];
  readonly dependencies: readonly ItemAddress[];
  /** Present for complete delivery. */
  readonly item: ContentItem | null;
  /** A bounded excerpt of the serialized body; not complete delivery. */
  readonly excerpt: { readonly text: string; readonly omittedCharacters: number } | null;
}
/**
 * Qualified displacement context: the exact change declaration with its operation, the uses it
 * affects, its grounds and qualification, its owner's provenance, and a reference to any
 * replacement use. It is recorded as delivery of that declaration's grounds. It is not
 * acquisition of the replacement use or of its content, which remain references.
 */
export interface DeliveredChange {
  readonly change: DeclarationAddress;
  readonly declaration: Declaration;
  readonly owner: DeliveredOwner;
  /** The replacement use a supersession established: a reference only. Null for a withdrawal. */
  readonly establishes: AssociationAddress | null;
  /** Current standing of the association the change established, when it established one. */
  readonly standing: Standing | null;
}
export interface DeliveredAssociation {
  readonly address: AssociationAddress;
  readonly declaration: AssociationDeclaration;
  readonly owner: DeliveredOwner;
  readonly status: AssociationStatus;
  /** Displacements already accepted, with their grounds; replacement content is referenced, not delivered. */
  readonly displacements: readonly DeliveredChange[];
  /** Member content actually delivered; other members remain references only. */
  readonly content: readonly DeliveredItem[];
  readonly undeliveredMembers: readonly AssociationAddress[];
}
export interface DeliveredInventory {
  readonly scope: SelectionScope;
  readonly inventory: 'current-only' | 'all-history';
  /** Addresses only. Listing does not deliver the listed content. */
  readonly listed: readonly AssociationAddress[];
  readonly complete: boolean;
}

/** The exact change declarations named by disclosed causes, each once. */
function changes(causes: readonly Cause[]): DeclarationAddress[] {
  return [...new Map(causes.map(cause => [addressKey(cause.change), cause.change])).values()];
}

interface ProductionInit { readonly id: ProductionId; readonly producer: Producer; readonly invocation: InvocationId | null }

/**
 * One open producing execution. Every acquisition returns qualified information and
 * records what actually arrived; nothing is recorded for references, host identity
 * bookkeeping or read-only answer assembly, which do not go through a production.
 */
export class ProductionHandle {
  readonly id: ProductionId;
  readonly producer: Producer;
  readonly invocation: InvocationId | null;
  readonly opened: number;
  readonly #ledger: ContributionLedger;
  readonly #deliveries: Delivery[] = [];
  readonly #evidence = new Set<RecordId>();
  #closed = false;

  constructor(ledger: ContributionLedger, init: ProductionInit) {
    this.#ledger = ledger; this.id = init.id; this.producer = init.producer; this.invocation = init.invocation; this.opened = ledger.position;
  }
  get ledger(): ContributionLedger { return this.#ledger; }
  get closed(): boolean { return this.#closed; }
  get deliveries(): readonly Delivery[] { return [...this.#deliveries]; }
  get evidence(): readonly RecordId[] { return [...this.#evidence]; }
  /** Ends acquisition. Called when the ledger accepts or abandons this production; later deliveries are refused. */
  close(): void { this.#closed = true; }
  #open(): void { if (this.#closed) throw new Error('Production has concluded'); }
  /**
   * A well-formed scope over an existing target. An unknown target or malformed rule is
   * refused: it is unavailable information, never a complete empty inventory.
   */
  #scope(scope: SelectionScope): SelectionScope {
    const value = scope as { kind?: unknown; entity?: unknown; role?: unknown; topic?: unknown; result?: unknown };
    const invalid = (message: string): never => { throw new InvalidAcquisition(message); };
    if (value === null || typeof value !== 'object') return invalid('Expected a selection scope.');
    if (value.kind === 'result') {
      if (typeof value.result !== 'string' || !this.#ledger.hasResult(value.result as QueryResultId)) return invalid('A result scope must name an existing Query result.');
      return { kind: 'result', result: value.result as QueryResultId };
    }
    if (value.kind !== 'entity' || typeof value.entity !== 'string' || !this.#ledger.hasEntity(value.entity as EntityId)) return invalid('An Entity scope must name an existing Entity.');
    const entity = value.entity as EntityId;
    if (value.role === 'identification' || value.role === 'any') return { kind: 'entity', entity, role: value.role };
    if (value.role !== 'topic' || value.topic !== null && (typeof value.topic !== 'string' || !value.topic.trim())) return invalid('A topical scope states one topic key, or null for every topic.');
    return { kind: 'entity', entity, role: 'topic', topic: value.topic };
  }

  /** The record is an owned immutable capture of what arrived; later changes to a caller's objects cannot rewrite it. */
  #record(delivery: Delivery): void {
    if (this.#closed) throw new Error('Production has concluded');
    this.#deliveries.push(freezeOwned(structuredClone(delivery)));
  }

  /** Register program evidence actually supplied to, or acquired as the source basis of, this production. */
  supplied(records: readonly RecordId[]): void {
    if (this.#closed) throw new Error('Production has concluded');
    records.forEach(id => this.#evidence.add(id));
  }

  #owner(investigram: InvestigramId): DeliveredOwner {
    const owner = this.#ledger.investigram(investigram), production = this.#ledger.production(owner.production);
    return { investigram, production: production.id, producer: production.producer, qualification: owner.qualification,
      concerns: this.#ledger.status.investigram(investigram).producing };
  }

  /** A bound that is not a whole number of characters cannot state actual coverage. Checked before anything is recorded. */
  #bound(excerptCharacters: number | undefined): void {
    this.#open();
    if (excerptCharacters !== undefined && (!Number.isInteger(excerptCharacters) || excerptCharacters < 0)) throw new InvalidAcquisition('An excerpt bound must be a non-negative whole number of characters.');
  }
  #item(address: ItemAddress, route: AssociationAddress | null, excerptCharacters: number | undefined): DeliveredItem {
    this.#bound(excerptCharacters);
    const item = this.#ledger.item(address);
    address = { investigram: address.investigram, item: address.item };
    const serialized = JSON.stringify(item.body);
    const bounded = excerptCharacters !== undefined && serialized.length > excerptCharacters;
    const coverage = bounded ? 'excerpt' : 'complete';
    const owner = this.#owner(address.investigram);
    this.#record({ kind: 'item', position: this.#ledger.position, item: address, route, coverage, concerns: changes(owner.concerns) });
    return { address, owner, route, coverage, type: item.type, qualification: item.qualification,
      referents: item.referents, evidence: item.evidence, support: item.support, dependencies: item.dependencies, item: bounded ? null : item,
      excerpt: bounded ? { text: serialized.slice(0, excerptCharacters), omittedCharacters: serialized.length - excerptCharacters! } : null };
  }

  /**
   * Exact content on its own, complete or as a disclosed bounded excerpt, with its item and
   * owner qualification and provenance. This is not exposure to any use of the item.
   */
  item(address: ItemAddress, options: { readonly excerptCharacters?: number } = {}): DeliveredItem {
    return this.#item(address, null, options.excerptCharacters);
  }

  /**
   * One item as a member of a particular use. The use is delivered with it: its grounds,
   * qualification, standing and every displacement already accepted. Content of an exact
   * use never arrives without that context.
   */
  member(route: AssociationAddress, address: ItemAddress, options: { readonly excerptCharacters?: number } = {}):
  { readonly association: DeliveredAssociation; readonly item: DeliveredItem } {
    // The whole request is checked before either part is delivered or recorded.
    this.#bound(options.excerptCharacters);
    if (!this.#ledger.association(route).declaration.members.some(member => member.kind === 'item'
      && member.item.investigram === address.investigram && member.item.item === address.item)) throw new Error('Item is not a member of the stated association');
    return { association: this.association(route), item: this.#item(address, { investigram: route.investigram, declaration: route.declaration }, options.excerptCharacters) };
  }

  #change(change: DeclarationAddress): DeliveredChange {
    const declaration = this.#ledger.declaration(change), owner = this.#owner(change.investigram);
    this.#record({ kind: 'declaration', position: this.#ledger.position, declaration: change, concerns: changes(owner.concerns) });
    return { change, declaration, owner, establishes: declaration.operation === 'withdraw' ? null : change,
      standing: declaration.operation === 'withdraw' ? null : this.#ledger.standing(change) };
  }
  /**
   * One exact declaration. A withdrawal is delivered as its qualified grounds. An addition or
   * supersession establishes a use, so it is delivered as that exact use, with its standing and
   * known displacement grounds; a use never arrives as bare declaration text.
   */
  declaration(address: DeclarationAddress): DeliveredAssociation | DeliveredChange {
    return this.#ledger.declaration(address).operation === 'withdraw' ? this.#change(address) : this.association(address);
  }

  /** An exact use with its grounds, standing and known displacement context; optionally its item members' content. */
  association(address: AssociationAddress, options: { readonly content?: boolean } = {}): DeliveredAssociation {
    address = { investigram: address.investigram, declaration: address.declaration };
    const declaration = this.#ledger.association(address).declaration;
    const status = this.#ledger.status.association(address), owner = this.#owner(address.investigram);
    this.#record({ kind: 'association', position: this.#ledger.position, association: address, disclosed: status.standing.displacedBy,
      concerns: changes([...owner.concerns, ...status.membership, ...status.producing, ...status.content.flatMap(item => item.producing)]) });
    const displacements = status.standing.displacedBy.map(change => this.#change(change));
    const content = options.content ? declaration.members.flatMap(member => member.kind === 'item' ? [this.#item(member.item, address, undefined)] : []) : [];
    return { address, declaration, owner, status, displacements, content,
      undeliveredMembers: declaration.members.flatMap(member => member.kind === 'association' ? [member.association] : []) };
  }

  /** An explicitly scoped inventory of addresses. It records the acquired scope without delivering listed content. */
  inventory(scope: SelectionScope, inventory: 'current-only' | 'all-history'): DeliveredInventory {
    this.#open();
    scope = this.#scope(scope);
    if (inventory !== 'current-only' && inventory !== 'all-history') throw new InvalidAcquisition('Unknown inventory kind.');
    const listed = this.#ledger.associations(scope, inventory === 'current-only' ? 'current' : 'all').map(entry => entry.address);
    this.#record({ kind: 'scope', position: this.#ledger.position, scope, inventory, listed, complete: true });
    return { scope, inventory, listed, complete: true };
  }

  /**
   * Baseline subject context: every standing identification association with its content,
   * qualification and concerns. The selection is recorded under the identification scope.
   */
  baseline(entity: EntityId): { readonly entity: EntityId; readonly entityKind: string; readonly identifications: readonly DeliveredAssociation[] } {
    const listing = this.inventory({ kind: 'entity', entity, role: 'identification' }, 'current-only');
    return { entity, entityKind: this.#ledger.entity(entity).entityKind,
      identifications: listing.listed.map(address => this.association(address, { content: true })) };
  }

  /** Current designated answers of a Query result: all equally standing alternatives, distinctly. */
  designations(result: Parameters<ContributionLedger['designations']>[0], options: { readonly content?: boolean } = {}): readonly DeliveredAssociation[] {
    const listing = this.inventory({ kind: 'result', result }, 'current-only');
    return listing.listed.map(address => this.association(address, options));
  }

  /** A whole contribution: its Analysis content and organizing metadata. */
  investigram(id: InvestigramId): { readonly owner: DeliveredOwner; readonly items: readonly DeliveredItem[];
    /** Association declarations are delivered as exact uses; withdrawals as their qualified grounds. */
    readonly declarations: readonly (DeliveredAssociation | DeliveredChange)[];
    readonly options: readonly FollowUpOption[]; readonly illustrations: readonly Illustration[]; readonly inconsistencies: readonly InconsistencyReport[] } {
    const owner = this.#ledger.investigram(id), delivered = this.#owner(id);
    const metadata = (kind: MetadataAddress['metadata'], key: string) => this.#record({ kind: 'metadata', position: this.#ledger.position,
      address: { investigram: id, metadata: kind, key }, concerns: changes(delivered.concerns) });
    const items = owner.items.map(item => this.item({ investigram: id, item: item.key }));
    const declarations = owner.declarations.map(declaration => {
      const address = { investigram: id, declaration: declaration.key };
      return declaration.operation === 'withdraw' ? this.#change(address) : this.association(address);
    });
    owner.options.forEach(item => metadata('option', item.key));
    owner.illustrations.forEach(item => metadata('illustration', item.key));
    owner.inconsistencies.forEach(item => metadata('inconsistency', item.key));
    return { owner: delivered, items, declarations, options: owner.options, illustrations: owner.illustrations, inconsistencies: owner.inconsistencies };
  }

  /** One follow-up option, illustration or inconsistency report as substantive qualified input. */
  metadata(address: MetadataAddress): { readonly owner: DeliveredOwner; readonly value: FollowUpOption | Illustration | InconsistencyReport } {
    const value = this.#ledger.metadata(address), owner = this.#owner(address.investigram);
    this.#record({ kind: 'metadata', position: this.#ledger.position, address, concerns: changes(owner.concerns) });
    return { owner, value };
  }

  /** Explicit-referent discovery: exact handles only, creating no content exposure. */
  discover(referent: EntityId): readonly ItemAddress[] {
    const handles = this.#ledger.referencing(referent);
    this.#record({ kind: 'discovery', position: this.#ledger.position, referent, handles });
    return handles;
  }

  /**
   * Deliver an exact change notice. It makes that particular change known to this
   * production; it is not delivery of replacement content, reliance or agreement.
   */
  notify(change: DeclarationAddress): { readonly change: DeclarationAddress; readonly operation: Declaration['operation'];
    readonly displaces: readonly AssociationAddress[]; readonly establishes: AssociationAddress | null } {
    const declaration = this.#ledger.declaration(change);
    this.#record({ kind: 'notice', position: this.#ledger.position, change });
    return { change, operation: declaration.operation, displaces: declaration.operation === 'add' ? [] : declaration.displaces,
      establishes: declaration.operation === 'withdraw' ? null : change };
  }

  /** Changes that would be reconsideration causes if this production submitted now; candidates for exact notices. */
  pending(): readonly Cause[] {
    return this.#ledger.status.pending(this);
  }
  noticed(): ReadonlySet<string> {
    return new Set(this.#deliveries.flatMap(delivery => delivery.kind === 'notice' ? [addressKey(delivery.change)] : []));
  }
}

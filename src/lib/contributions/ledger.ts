import { randomUUID } from 'node:crypto';
import { canonical, identityReference, methods, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { RecordId, SessionId } from '../records.js';
import { ContentCatalog, list, record, text } from './catalog.js';
import type { IdentifyingName } from './catalog.js';
import { InvalidContribution, addressKey, inScope, itemKey, targetKey } from './model.js';
import type { AssociationAddress, AssociationDeclaration, AssociationTarget, ContentItem, Declaration, DeclarationAddress, Entity, EntityId,
  EpistemicStatus, FollowUpOption, Grounds, Illustration, InconsistencyReport, Investigram, InvestigramId, Invocation, InvocationId,
  InvocationRequest, ItemAddress, Member, MetadataAddress, NativeIdentity, Producer, ProducerReport, Production, ProductionId, Qualification,
  QueryResult, QueryResultId, SelectionScope, SubjectRef } from './model.js';
import { ProductionHandle } from './production.js';
import { ContributionStatus } from './status.js';
import type { Standing } from './status.js';

export interface DeclarationEntry {
  readonly address: DeclarationAddress;
  readonly declaration: Declaration;
  readonly owner: Investigram;
  /** Acceptance enumeration order. It conveys neither priority nor architectural chronology. */
  readonly sequence: number;
}
export interface AssociationEntry extends DeclarationEntry { readonly declaration: AssociationDeclaration }
export interface Acceptance {
  readonly position: number;
  readonly productions: readonly {
    readonly production: ProductionId;
    readonly investigrams: Readonly<Record<string, InvestigramId>>;
    readonly entities: Readonly<Record<string, EntityId>>;
  }[];
}
export interface NameMatch {
  readonly entity: EntityId;
  readonly association: AssociationAddress;
  readonly item: ItemAddress;
  readonly name: IdentifyingName;
  readonly standing: Standing;
}
export interface LedgerOptions {
  readonly session: SessionId;
  readonly catalog?: ContentCatalog;
  /** Whether a program record reference resolves in this Session. Defaults to accepting none. */
  readonly resolvesRecord?: (id: RecordId) => boolean;
}

const fail = (message: string): never => { throw new InvalidContribution(message); };
const optional = (value: unknown, what: string): unknown[] => value === undefined || value === null ? [] : list(value, what);
const statuses: readonly EpistemicStatus[] = ['mechanically-derived', 'recorded-assertion', 'observation', 'interpretation', 'organizing-policy'];
const memberKey = (member: Member): string => member.kind === 'item' ? `item ${itemKey(member.item)}` : `association ${addressKey(member.association)}`;
function keyed(value: unknown, what: string): Map<string, Record<string, unknown>> {
  const result = new Map<string, Record<string, unknown>>();
  for (const entry of optional(value, what)) {
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) return fail(`Expected ${what} object.`);
    const key = text((entry as Record<string, unknown>).key, `${what} key`);
    if (result.has(key)) return fail(`Duplicate ${what} key: ${key}.`);
    result.set(key, entry as Record<string, unknown>);
  }
  return result;
}
function sameUse(a: AssociationTarget, b: AssociationTarget): boolean {
  return a.kind === 'result' ? b.kind === 'result' && a.result === b.result
    : b.kind === 'entity' && a.entity === b.entity && a.role === b.role;
}

/**
 * Session-owned retention of Entities, Query results and immutable investigrams.
 * Submitted pools are validated completely and accepted atomically; standing and
 * reconsideration are derived, never written back into retained contributions.
 */
export class ContributionLedger {
  readonly session: SessionId;
  readonly catalog: ContentCatalog;
  readonly status: ContributionStatus;
  readonly #resolvesRecord: (id: RecordId) => boolean;
  #position = 0;
  #sequence = 0;
  readonly #entities = new Map<EntityId, Entity>();
  readonly #natives = new Map<string, EntityId>();
  readonly #invocations = new Map<InvocationId, Invocation>();
  readonly #requests = new Map<string, InvocationId>();
  readonly #results = new Map<QueryResultId, QueryResult>();
  readonly #subjects = new Map<string, InvocationId[]>();
  readonly #investigrams = new Map<InvestigramId, Investigram>();
  readonly #providerKeys = new Map<string, InvestigramId>();
  readonly #productions = new Map<ProductionId, Production>();
  readonly #items = new Map<string, ContentItem>();
  readonly #declarations = new Map<string, DeclarationEntry>();
  readonly #byTarget = new Map<string, AssociationEntry[]>();
  readonly #byEntity = new Map<EntityId, AssociationEntry[]>();
  readonly #displacements = new Map<string, { change: DeclarationAddress; position: number }[]>();
  readonly #referencing = new Map<EntityId, ItemAddress[]>();
  readonly #inconsistencies = new Map<string, MetadataAddress[]>();
  readonly #inconsistenciesWithin = new Map<InvestigramId, MetadataAddress[]>();
  readonly #names = new Map<string, Omit<NameMatch, 'standing'>[]>();

  constructor(options: LedgerOptions) {
    this.session = options.session;
    this.catalog = options.catalog ?? new ContentCatalog();
    this.#resolvesRecord = options.resolvesRecord ?? (() => false);
    this.status = new ContributionStatus(this);
  }

  /** Number of accepted submissions. An acceptance or delivery position identifies retained state, not claim precedence. */
  get position(): number { return this.#position; }

  // Identities and exact retained access. None of these reads records producer exposure.
  entity(id: EntityId): Entity { return this.#entities.get(id) ?? this.#missing('Entity', id); }
  entities(): readonly Entity[] { return [...this.#entities.values()]; }
  hasEntity(id: EntityId): boolean { return this.#entities.has(id); }
  hasResult(id: QueryResultId): boolean { return this.#results.has(id); }
  /** Host identity bookkeeping: resolve a provider-native identity within its rule and scope. */
  native(native: NativeIdentity): EntityId | undefined { return this.#natives.get(canonical(native)); }
  /** The contribution already established for a provider contribution key; equivalent recomputation reuses it. */
  established(providerKey: string): InvestigramId | undefined { return this.#providerKeys.get(providerKey); }
  investigram(id: InvestigramId): Investigram { return this.#investigrams.get(id) ?? this.#missing('investigram', id); }
  investigrams(): readonly Investigram[] { return [...this.#investigrams.values()]; }
  item(address: ItemAddress): ContentItem { return this.#items.get(itemKey(address)) ?? this.#missing('content item', itemKey(address)); }
  declarationEntry(address: DeclarationAddress): DeclarationEntry {
    return this.#declarations.get(addressKey(address)) ?? this.#missing('declaration', addressKey(address));
  }
  declaration(address: DeclarationAddress): Declaration { return this.declarationEntry(address).declaration; }
  association(address: AssociationAddress): AssociationEntry {
    const entry = this.declarationEntry(address);
    if (entry.declaration.operation === 'withdraw') throw new Error('A withdrawal establishes no association');
    return entry as AssociationEntry;
  }
  metadata(address: MetadataAddress): FollowUpOption | Illustration | InconsistencyReport {
    const owner = this.investigram(address.investigram);
    const values: readonly (FollowUpOption | Illustration | InconsistencyReport)[] = address.metadata === 'option' ? owner.options
      : address.metadata === 'illustration' ? owner.illustrations : owner.inconsistencies;
    return values.find(value => value.key === address.key) ?? this.#missing(address.metadata, `${address.investigram}#${address.key}`);
  }
  production(id: ProductionId): Production { return this.#productions.get(id) ?? this.#missing('production', id); }
  productions(): readonly Production[] { return [...this.#productions.values()]; }
  invocation(id: InvocationId): Invocation { return this.#invocations.get(id) ?? this.#missing('invocation', id); }
  result(id: QueryResultId): QueryResult { return this.#results.get(id) ?? this.#missing('Query result', id); }
  #missing(what: string, id: string): never { throw new Error(`Missing ${what}: ${id}`); }

  /** Accepted displacements of one exact association, in acceptance enumeration order. */
  displacements(address: AssociationAddress): readonly { readonly change: DeclarationAddress; readonly position: number }[] {
    return [...(this.#displacements.get(addressKey(address)) ?? [])];
  }
  /** Standing of an exact use, now or as of an earlier position. Displacing a replacement never reinstates its predecessor. */
  standing(address: AssociationAddress, at: number = this.#position): Standing {
    this.association(address);
    const displacedBy = this.displacements(address).filter(item => item.position <= at).map(item => item.change);
    return freezeOwned({ state: displacedBy.length ? 'displaced' : 'standing', displacedBy });
  }
  /**
   * Associations within a scope, in stable acceptance enumeration. `current` returns all
   * equally standing uses distinctly; position conveys neither preference nor chronology of claims.
   * This enumeration depends on the order in which contributions were accepted. It is repeatable
   * for the same retained information, but it is not a semantic order: a mechanical answer must
   * order its content by its method's own semantic keys, never by this enumeration.
   */
  associations(scope: SelectionScope, standing: 'current' | 'all'): readonly AssociationEntry[] {
    const entries = scope.kind === 'result' ? this.#byTarget.get(targetKey({ kind: 'result', result: scope.result })) ?? []
      : (this.#byEntity.get(scope.entity) ?? []).filter(entry => inScope(scope, entry.declaration.target));
    return standing === 'all' ? [...entries] : entries.filter(entry => this.displacements(entry.address).length === 0);
  }
  /**
   * Identification uses of an Entity. General access defaults to the standing uses. A
   * method-specific request defaults to all of that method's identifying findings regardless
   * of standing, since later displacement does not remove a method's findings; callers obtain
   * standing separately. An explicit `standing` overrides either default.
   */
  identifications(entity: EntityId, options: { readonly standing?: 'current' | 'all'; readonly method?: string } = {}): readonly AssociationEntry[] {
    this.entity(entity);
    return this.associations({ kind: 'entity', entity, role: 'identification' }, options.standing ?? (options.method === undefined ? 'current' : 'all'))
      .filter(entry => options.method === undefined || this.production(entry.owner.production).producer.method === options.method);
  }
  designations(result: QueryResultId, standing: 'current' | 'all' = 'current'): readonly AssociationEntry[] {
    this.result(result);
    return this.associations({ kind: 'result', result }, standing);
  }
  /** Member associations reached directly or through declaration membership. Membership is finite by acceptance. */
  memberAssociations(address: AssociationAddress): readonly AssociationAddress[] {
    const seen = new Map<string, AssociationAddress>(), queue = [address];
    for (let index = 0; index < queue.length; index++) {
      for (const member of this.association(queue[index]!).declaration.members) {
        if (member.kind !== 'association' || seen.has(addressKey(member.association))) continue;
        seen.set(addressKey(member.association), member.association); queue.push(member.association);
      }
    }
    return [...seen.values()];
  }
  /** Explicit-referent discovery: exact handles of content naming the Entity as a referent. */
  referencing(entity: EntityId): readonly ItemAddress[] { this.entity(entity); return [...(this.#referencing.get(entity) ?? [])]; }
  /** Inconsistency reports discoverable from an exact content or use endpoint. */
  inconsistencies(endpoint: Member): readonly MetadataAddress[] { return [...(this.#inconsistencies.get(memberKey(endpoint)) ?? [])]; }
  inconsistenciesWithin(investigram: InvestigramId): readonly MetadataAddress[] { return [...(this.#inconsistenciesWithin.get(investigram) ?? [])]; }
  /** Reverse lookup of investigations performed on an exact subject. Implies neither delivery nor reliance. */
  investigationsOf(subject: SubjectRef): readonly Invocation[] {
    return (this.#subjects.get(canonical(subject)) ?? []).map(id => this.invocation(id));
  }
  /**
   * Exact-name lookup over identification uses, preserving zero, one or many matches.
   * A historical match is disclosed with its standing; it is not recast as a current name.
   */
  lookupName(name: string, options: { readonly history?: boolean } = {}): { readonly name: string; readonly history: boolean;
    readonly population: 'identification-associations'; readonly matches: readonly NameMatch[] } {
    const matches = (this.#names.get(name) ?? []).map(match => ({ ...match, standing: this.standing(match.association) }))
      .filter(match => options.history || match.standing.state === 'standing');
    return freezeOwned({ name, history: options.history ?? false, population: 'identification-associations', matches });
  }

  #subject(value: SubjectRef): void {
    switch (value.kind) {
      case 'entity': this.entity(value.entity); break;
      case 'investigram': this.investigram(value.investigram); break;
      case 'content': {
        const item = this.item(value.item);
        if (value.component !== null && !item.components.includes(value.component)) throw new Error('Unknown content component');
        break;
      }
      case 'designation': if (this.association(value.association).declaration.target.kind !== 'result') throw new Error('Expected a result designation'); break;
      case 'scope': break;
    }
  }

  /**
   * Resolve an investigation request to its invocation and Query result. An ordinary
   * equivalent request reuses both. An explicit fresh request records a new invocation
   * that keeps the repeated question's Query result as its organizing target.
   */
  invoke(request: InvocationRequest, options: { readonly fresh?: boolean } = {}): { readonly invocation: Invocation; readonly result: QueryResult; readonly reused: boolean } {
    const owned = freezeOwned(structuredClone(request));
    owned.subjects.forEach(item => this.#subject(item.subject)); owned.context.forEach(item => this.#subject(item));
    const key = canonical(owned), earlier = this.#requests.get(key);
    if (earlier && !options.fresh) {
      const invocation = this.invocation(earlier);
      return { invocation, result: this.result(invocation.result), reused: true };
    }
    const id = recordId(this.session, 'invocation', [this.#invocations.size]) as InvocationId;
    const result: QueryResult = earlier ? this.result(this.invocation(earlier).result)
      : freezeOwned({ kind: 'query-result', id: recordId(this.session, 'query-result', [identityReference(this.session, id)]) as QueryResultId, session: this.session, origin: id });
    const invocation: Invocation = freezeOwned({ kind: 'invocation', id, session: this.session, request: owned, result: result.id,
      fresh: options.fresh ?? false, position: this.#position });
    this.#invocations.set(id, invocation); this.#results.set(result.id, result);
    if (!earlier) this.#requests.set(key, id);
    for (const subject of new Set(owned.subjects.map(item => canonical(item.subject)))) {
      const invocations = this.#subjects.get(subject) ?? []; invocations.push(id); this.#subjects.set(subject, invocations);
    }
    return { invocation, result, reused: false };
  }

  /** Open one producing execution. Its acquisitions are the only source of recorded exposure. */
  begin(init: { readonly producer: Producer; readonly invocation?: InvocationId | null; readonly id?: RecordId }): ProductionHandle {
    if (init.invocation) this.invocation(init.invocation);
    const id = (init.id ?? recordId(this.session, 'production', [randomUUID()])) as ProductionId;
    if (this.#productions.has(id)) throw new Error('Production identity already concluded');
    return new ProductionHandle(this, { id, producer: freezeOwned(structuredClone(init.producer)), invocation: init.invocation ?? null });
  }

  /** Conclude an attempt that returned no contribution. Its actual deliveries remain attributable; nothing unsubmitted is accepted. */
  abandon(handle: ProductionHandle, reason: string): Production {
    this.#owns(handle);
    handle.close();
    return this.#conclude(handle, { kind: 'no-contribution', reason }, null, []);
  }
  #owns(handle: ProductionHandle): void {
    if (handle.ledger !== this || handle.closed || this.#productions.has(handle.id)) throw new Error('Production is not open in this ledger');
  }
  #conclude(handle: ProductionHandle, outcome: Production['outcome'], report: ProducerReport | null, investigrams: readonly InvestigramId[]): Production {
    const production: Production = freezeOwned(structuredClone({ kind: 'production', id: handle.id, session: this.session, producer: handle.producer,
      invocation: handle.invocation, opened: handle.opened, concluded: this.#position, outcome, deliveries: handle.deliveries,
      evidence: handle.evidence, report, investigrams }));
    this.#productions.set(production.id, production);
    return production;
  }

  /**
   * Validate and retain a pool of independently attributed contributions atomically.
   * Any structural defect rejects the whole pool with no partial acceptance. Structural
   * acceptance checks ownership, addressability, references and contract shape; it does
   * not assess request fulfillment, reachability through associations or correctness.
   */
  accept(submissions: readonly { readonly production: ProductionHandle; readonly contribution: unknown }[]): Acceptance {
    if (!submissions.length) throw new Error('Nothing submitted');
    const session = this.session, position = this.#position + 1;
    interface Staged {
      readonly handle: ProductionHandle; readonly key: string; readonly id: InvestigramId; readonly ordinal: number;
      readonly raw: Record<string, unknown>; readonly items: Map<string, Record<string, unknown>>; readonly declarations: Map<string, Record<string, unknown>>;
    }
    const handles = new Set<ProductionHandle>(), pool = new Map<string, Staged>(), reports = new Map<ProductionHandle, unknown>();
    for (const { production: handle, contribution } of submissions) {
      this.#owns(handle);
      // Distinct handles can carry the same caller-supplied identity; one would overwrite the other's history.
      if (handles.has(handle) || [...handles].some(other => other.id === handle.id)) throw new Error('Production submitted twice');
      handles.add(handle);
      const value = record(contribution, ['investigrams', 'report'], 'contribution');
      const investigrams = list(value.investigrams, 'investigram');
      if (!investigrams.length && (value.report === undefined || value.report === null)) fail('A contribution without investigrams requires a producer report.');
      reports.set(handle, value.report ?? null);
      for (const entry of investigrams) {
        const raw = record(entry, ['key', 'providerKey', 'qualification', 'entities', 'referents', 'items', 'declarations', 'options', 'illustrations', 'inconsistencies'], 'investigram');
        const key = text(raw.key, 'investigram key');
        if (pool.has(key)) fail(`Duplicate investigram key: ${key}.`);
        pool.set(key, { handle, key, raw, ordinal: pool.size, items: keyed(raw.items, 'content item'), declarations: keyed(raw.declarations, 'declaration'),
          id: recordId(session, 'investigram', [identityReference(session, handle.id), key]) as InvestigramId });
      }
    }

    // Resolve known identities before allocating new Session identities.
    const localEntities = new Map<string, EntityId>(), created = new Map<EntityId, Entity>(), natives = new Map<string, EntityId>();
    for (const staged of pool.values()) for (const entry of optional(staged.raw.entities, 'entity')) {
      const raw = record(entry, ['key', 'entityKind', 'modality', 'native'], 'entity');
      const key = text(raw.key, 'entity key'), entityKind = text(raw.entityKind, 'entity kind'), modality = raw.modality ?? 'implemented';
      if (localEntities.has(key)) fail(`Duplicate entity key: ${key}.`);
      if (modality !== 'implemented' && modality !== 'hypothetical' && modality !== 'intended') fail('Invalid architectural modality.');
      let native: NativeIdentity | null = null, id: EntityId;
      if (raw.native !== undefined && raw.native !== null) {
        const value = record(raw.native, ['provider', 'rule', 'scope', 'key'], 'native identity');
        native = { provider: text(value.provider, 'provider'), rule: text(value.rule, 'identity rule'), scope: text(value.scope, 'identity scope'), key: text(value.key, 'native key') };
        const nativeKey = canonical(native), known = this.#natives.get(nativeKey) ?? natives.get(nativeKey);
        if (known) {
          const existing = this.#entities.get(known) ?? created.get(known)!;
          if (existing.entityKind !== entityKind || existing.modality !== modality) fail('A native identity cannot be reidentified with a different kind or modality.');
          localEntities.set(key, known);
          continue;
        }
        // The common identity is mapped from provider, rule, scope and key together; the same native key in another scope is another Entity.
        id = recordId(session, 'entity', ['native', native.provider, native.rule, native.scope, native.key]) as EntityId;
        natives.set(nativeKey, id);
      } else id = recordId(session, 'entity', ['introduced', identityReference(session, staged.id), key]) as EntityId;
      created.set(id, { kind: 'entity', id, session, entityKind, modality: modality as Entity['modality'], native, introducedBy: staged.id, position });
      localEntities.set(key, id);
    }

    const entityRef = (value: unknown): EntityId => {
      if (typeof value === 'string') return this.#entities.has(value as EntityId) ? value as EntityId : fail('Unknown Entity reference.');
      return localEntities.get(text(record(value, ['local'], 'entity reference').local, 'local entity key')) ?? fail('Unknown local Entity key.');
    };
    const investigramRef = (value: unknown): { readonly id: InvestigramId; readonly staged: Staged | null } => {
      if (typeof value === 'string') return this.#investigrams.has(value as InvestigramId) ? { id: value as InvestigramId, staged: null } : fail('Unknown investigram reference.');
      const staged = pool.get(text(record(value, ['local'], 'investigram reference').local, 'local investigram key')) ?? fail('Unknown local investigram key.');
      return { id: staged.id, staged };
    };
    const itemRef = (value: unknown): ItemAddress => {
      const raw = record(value, ['investigram', 'item'], 'content reference'), owner = investigramRef(raw.investigram), item = text(raw.item, 'item key');
      if (owner.staged ? !owner.staged.items.has(item) : !this.#items.has(itemKey({ investigram: owner.id, item }))) fail('Unknown content item reference.');
      return { investigram: owner.id, item };
    };
    /** Resolves a declaration reference to an association use; `earlier` additionally requires a use that predates this acceptance. */
    const associationRef = (value: unknown, earlier: boolean): AssociationAddress => {
      const raw = record(value, ['investigram', 'declaration'], 'declaration reference'), owner = investigramRef(raw.investigram), declaration = text(raw.declaration, 'declaration key');
      if (owner.staged && earlier) fail('A displaced association must predate this acceptance.');
      const operation = owner.staged ? owner.staged.declarations.get(declaration)?.operation : this.#declarations.get(addressKey({ investigram: owner.id, declaration }))?.declaration.operation;
      if (operation !== 'add' && operation !== 'supersede') fail('Expected a reference to an association use.');
      return { investigram: owner.id, declaration };
    };
    const itemType = (address: ItemAddress): string => this.#items.get(itemKey(address))?.type
      ?? String([...pool.values()].find(staged => staged.id === address.investigram)!.items.get(address.item)!.type);
    const distinct = <T>(values: readonly T[], key: (value: T) => string, what: string): T[] => {
      if (new Set(values.map(key)).size !== values.length) fail(`Duplicate ${what}.`);
      return [...values];
    };
    const member = (value: unknown): Member => {
      const raw = record(value, ['kind', 'item', 'association'], 'member');
      return raw.kind === 'item' ? { kind: 'item', item: itemRef(raw.item) }
        : raw.kind === 'association' ? { kind: 'association', association: associationRef(raw.association, false) } : fail('Invalid member kind.');
    };
    const subject = (value: unknown): SubjectRef => {
      const raw = record(value, ['kind', 'entity', 'investigram', 'item', 'component', 'association', 'scope'], 'subject');
      switch (raw.kind) {
        case 'entity': return { kind: 'entity', entity: entityRef(raw.entity) };
        case 'investigram': return { kind: 'investigram', investigram: investigramRef(raw.investigram).id };
        case 'content': return { kind: 'content', item: itemRef(raw.item), component: raw.component === undefined || raw.component === null ? null : text(raw.component, 'component key') };
        case 'designation': return { kind: 'designation', association: associationRef(raw.association, false) };
        case 'scope': return { kind: 'scope', scope: text(raw.scope, 'scope') };
        default: return fail('Invalid subject kind.');
      }
    };

    const built: Investigram[] = [], stagedDeclarations = new Map<string, Declaration>(), stagedComponents = new Map<string, readonly string[]>();
    const componentChecks: { item: ItemAddress; component: string }[] = [], designationChecks: AssociationAddress[] = [];
    for (const staged of pool.values()) {
      const { handle, raw } = staged, producer = handle.producer, supplied = new Set(handle.evidence);
      const evidence = (value: unknown): RecordId[] => optional(value, 'evidence').map(entry => {
        const id = text(entry, 'evidence reference') as RecordId;
        // Evidence must identify program material actually supplied to this production; a bare reference is not delivery.
        if (!supplied.has(id) || !this.#resolvesRecord(id)) fail('Evidence must identify program material supplied to this production in this Session.');
        return id;
      });
      const qualification = (value: unknown): Qualification | null => {
        if (value === undefined || value === null) return null;
        const item = record(value, ['status', 'scope', 'guarantee', 'limitations', 'contexts'], 'qualification');
        const limitations = optional(item.limitations, 'limitation').map(entry => text(entry, 'limitation'));
        const guarantee = item.guarantee === undefined || item.guarantee === null ? null : text(item.guarantee, 'guarantee');
        const scope = item.scope === undefined || item.scope === null ? null : text(item.scope, 'scope');
        const contexts = optional(item.contexts, 'context').map(entry => {
          const id = text(entry, 'context reference') as RecordId;
          return this.#resolvesRecord(id) ? id : fail('Unknown qualification context reference.');
        });
        let status: EpistemicStatus;
        if (producer.mechanism === 'agentic') {
          // An agent can caveat its claims; it cannot raise their epistemic status or assert a guarantee.
          if (item.status !== undefined && item.status !== 'interpretation' || guarantee !== null) fail('Agentic qualification cannot claim a stronger epistemic status or guarantee.');
          // `contexts` holds the claim's own provider Claim context. Provider Claim contexts qualify mechanically derived
          // findings, so one cannot be an interpretation's own context. Source context is cited as supplied evidence, or
          // stays with the referenced content, without transferring its guarantee.
          if (contexts.length) fail('An agentic qualification cannot adopt a provider Claim context as its own; cite it as supplied evidence or reference the qualified content.');
          if (!limitations.length) fail('Agentic qualification requires stated limitations.');
          status = 'interpretation';
        } else {
          if (!statuses.includes(item.status as EpistemicStatus)) fail('Mechanical qualification requires an explicit epistemic status.');
          if (!limitations.length && guarantee === null && !contexts.length) fail('Qualification requires a guarantee, limitation or method context.');
          status = item.status as EpistemicStatus;
        }
        return { status, method: producer.method, scope, guarantee, limitations, contexts };
      };
      const own = qualification(raw.qualification);
      const qualified = (value: unknown, what: string): Qualification | null => {
        const result = qualification(value);
        if (!result && !own) fail(`${what} requires attributable qualification.`);
        return result;
      };
      const grounds = (value: unknown, required: boolean): Grounds | null => {
        if (value === undefined || value === null) return required ? fail('Supersession and withdrawal require attributable qualified grounds.') : null;
        const item = record(value, ['text', 'evidence', 'support'], 'grounds');
        return { text: text(item.text, 'grounds'), evidence: evidence(item.evidence), support: optional(item.support, 'support').map(itemRef) };
      };
      const displaced = (value: unknown): AssociationAddress[] => {
        const result = distinct(list(value, 'displaced association').map(entry => associationRef(entry, true)), addressKey, 'displaced association');
        return result.length ? result : fail('A displacement must identify at least one exact earlier association.');
      };
      const target = (value: unknown): AssociationTarget => {
        const item = record(value, ['kind', 'entity', 'role', 'topic', 'result'], 'association target');
        if (item.kind === 'result') {
          if (item.role !== undefined || item.entity !== undefined) fail('A result designation targets a Query result, never an Entity role.');
          const result = text(item.result, 'Query result reference') as QueryResultId;
          return this.#results.has(result) ? { kind: 'result', result } : fail('Unknown Query result reference.');
        }
        if (item.kind !== 'entity') return fail('Invalid association target kind.');
        const entity = entityRef(item.entity);
        return item.role === 'identification' ? { kind: 'entity', entity, role: 'identification' }
          : item.role === 'topic' ? { kind: 'entity', entity, role: 'topic', topic: text(item.topic, 'topic key') } : fail('Invalid Entity information role.');
      };

      const items: ContentItem[] = [...staged.items].map(([key, value]) => {
        const item = record(value, ['key', 'type', 'body', 'referents', 'evidence', 'support', 'qualification'], 'content item');
        const type = text(item.type, 'content type'), contract = this.catalog.get(type) ?? fail(`Unsupported content type: ${type}.`);
        const accepted = contract.accept(item.body, { entity: entityRef, item: itemRef });
        stagedComponents.set(itemKey({ investigram: staged.id, item: key }), accepted.components);
        return { key, type, body: accepted.body,
          referents: [...new Set([...optional(item.referents, 'referent').map(entityRef), ...accepted.entities])],
          evidence: evidence(item.evidence), support: optional(item.support, 'support').map(itemRef), dependencies: [...accepted.content],
          components: [...accepted.components], qualification: qualified(item.qualification, 'A content item') };
      });
      const declarations: Declaration[] = [...staged.declarations].map(([key, value]) => {
        if (value.operation === 'withdraw') {
          const item = record(value, ['key', 'operation', 'displaces', 'grounds', 'qualification'], 'withdrawal');
          return { key, operation: 'withdraw', displaces: displaced(item.displaces), grounds: grounds(item.grounds, true)!, qualification: qualified(item.qualification, 'A declaration') };
        }
        if (value.operation !== 'add' && value.operation !== 'supersede') return fail('Invalid declaration operation.');
        const item = record(value, ['key', 'operation', 'target', 'members', 'displaces', 'grounds', 'qualification'], 'declaration');
        const use = target(item.target), members = distinct(list(item.members, 'member').map(member), memberKey, 'member');
        if (!members.length) fail('An association must select at least one exact member.');
        if (use.kind === 'entity' && members.some(entry => entry.kind === 'association')) fail('Only a result designation can select declaration members.');
        if (use.kind === 'entity' && use.role === 'identification'
          && !members.some(entry => entry.kind === 'item' && this.catalog.get(itemType(entry.item))?.identifying)) fail('An identification requires identifying content.');
        if (value.operation === 'add') {
          if (item.displaces !== undefined) fail('An addition displaces nothing; use supersession or withdrawal.');
          return { key, operation: 'add', target: use, members, grounds: grounds(item.grounds, false), qualification: qualified(item.qualification, 'A declaration') };
        }
        const displaces = displaced(item.displaces);
        // The new use and every displaced use must concern the same target and role; another target is withdrawal plus addition.
        if (displaces.some(address => !sameUse(use, this.association(address).declaration.target))) fail('A supersession must displace uses of the same target and role.');
        return { key, operation: 'supersede', target: use, members, displaces, grounds: grounds(item.grounds, true)!, qualification: qualified(item.qualification, 'A declaration') };
      });
      const options: FollowUpOption[] = [...keyed(raw.options, 'follow-up option')].map(([key, value]) => {
        const item = record(value, ['key', 'meaning', 'request', 'references', 'qualification'], 'follow-up option');
        const request = record(item.request, ['operation', 'subjects', 'parameters', 'context', 'resultContract'], 'option request');
        const parameters = request.parameters === undefined ? {} : record(request.parameters, Object.keys(request.parameters as object ?? {}), 'option parameters');
        return { key, meaning: text(item.meaning, 'option meaning'), references: optional(item.references, 'reference').map(member),
          request: { operation: text(request.operation, 'option operation'),
            subjects: list(request.subjects, 'option subject').map(entry => {
              const role = record(entry, ['role', 'subject'], 'option subject');
              return { role: role.role === undefined || role.role === null ? null : text(role.role, 'subject role'), subject: subject(role.subject) };
            }),
            parameters: structuredClone(parameters), context: optional(request.context, 'option context').map(subject),
            resultContract: request.resultContract === undefined || request.resultContract === null ? null : text(request.resultContract, 'result contract') },
          qualification: qualified(item.qualification, 'A follow-up option') };
      });
      const illustrations: Illustration[] = [...keyed(raw.illustrations, 'illustration')].map(([key, value]) => {
        const item = record(value, ['key', 'diagramType', 'inputs', 'evidence', 'qualification'], 'illustration');
        const inputs = distinct(list(item.inputs, 'illustration input').map(itemRef), itemKey, 'illustration input');
        if (!inputs.length) fail('An illustration names its exact primary content inputs.');
        return { key, diagramType: text(item.diagramType, 'diagram type'), inputs, evidence: evidence(item.evidence), qualification: qualified(item.qualification, 'An illustration') };
      });
      const inconsistencies: InconsistencyReport[] = [...keyed(raw.inconsistencies, 'inconsistency report')].map(([key, value]) => {
        const item = record(value, ['key', 'endpoints', 'grounds', 'qualification'], 'inconsistency report');
        const endpoints = distinct(list(item.endpoints, 'endpoint').map(member), memberKey, 'inconsistency endpoint');
        if (endpoints.length < 2) fail('An inconsistency report compares at least two exact content items or association uses.');
        return { key, endpoints, grounds: grounds(item.grounds, true)!, qualification: qualified(item.qualification, 'An inconsistency report') };
      });
      if (!items.length && !declarations.length && !options.length && !illustrations.length && !inconsistencies.length) fail('An investigram must contribute content, declarations or qualified metadata.');
      const providerKey = raw.providerKey === undefined || raw.providerKey === null ? null : text(raw.providerKey, 'provider key');
      if (providerKey !== null && (this.#providerKeys.has(providerKey) || built.some(item => item.providerKey === providerKey))) fail('This provider contribution is already established; equivalent recomputation reuses it.');
      for (const declaration of declarations) stagedDeclarations.set(addressKey({ investigram: staged.id, declaration: declaration.key }), declaration);
      for (const option of options) for (const entry of [...option.request.subjects.map(item => item.subject), ...option.request.context]) {
        if (entry.kind === 'content' && entry.component !== null) componentChecks.push({ item: entry.item, component: entry.component });
        if (entry.kind === 'designation') designationChecks.push(entry.association);
      }
      built.push({ kind: 'investigram', id: staged.id, session, method: methods.contributions, production: handle.id, key: staged.key, providerKey,
        position, ordinal: staged.ordinal, qualification: own, referents: [...new Set(optional(raw.referents, 'referent').map(entityRef))],
        items, declarations, options, illustrations, inconsistencies });
    }

    // Checks over the whole assembled pool.
    const declared = (address: DeclarationAddress): Declaration => stagedDeclarations.get(addressKey(address)) ?? this.declaration(address);
    const isDesignation = (address: AssociationAddress): boolean => {
      const declaration = declared(address);
      return declaration.operation !== 'withdraw' && declaration.target.kind === 'result';
    };
    for (const check of componentChecks) {
      const components = stagedComponents.get(itemKey(check.item)) ?? this.item(check.item).components;
      if (!components.includes(check.component)) fail('Unknown content component reference.');
    }
    if (designationChecks.some(address => !isDesignation(address))) fail('Expected a result designation reference.');
    const identified = new Set([...stagedDeclarations.values()].flatMap(declaration =>
      declaration.operation === 'add' && declaration.target.kind === 'entity' && declaration.target.role === 'identification' ? [declaration.target.entity] : []));
    // A new thing is explicitly introduced with identifying information; a matching name alone never establishes identity.
    for (const entity of created.keys()) if (!identified.has(entity)) fail('A newly identified Entity requires an identification association in the same submission.');
    const visiting = new Set<string>(), finished = new Set<string>();
    const visit = (key: string): void => {
      if (finished.has(key)) return;
      if (visiting.has(key)) fail('Designated membership must be finite; circular membership is rejected.');
      visiting.add(key);
      const declaration = stagedDeclarations.get(key);
      if (declaration && declaration.operation !== 'withdraw') for (const entry of declaration.members) {
        if (entry.kind === 'association' && stagedDeclarations.has(addressKey(entry.association))) visit(addressKey(entry.association));
      }
      visiting.delete(key); finished.add(key);
    };
    [...stagedDeclarations.keys()].forEach(visit);
    const concluded = new Map<ProductionHandle, ProducerReport | null>();
    for (const [handle, value] of reports) {
      if (value === null) { concluded.set(handle, null); continue; }
      const raw = record(value, ['inability', 'answer', 'statement'], 'producer report');
      const answer = distinct(optional(raw.answer, 'answer reference').map(entry => associationRef(entry, false)), addressKey, 'answer reference');
      if (answer.some(address => !isDesignation(address))) fail('A reported answer identifies exact result designations.');
      concluded.set(handle, { inability: raw.inability === undefined || raw.inability === null ? null : text(raw.inability, 'reported inability'),
        answer, statement: raw.statement === undefined || raw.statement === null ? null : text(raw.statement, 'report statement') });
    }

    // Prepare everything that could still fail before changing retained state: owned immutable
    // copies, and identifying names resolved against the whole staged pool in any pool order.
    const retained = built.map(value => freezeOwned(structuredClone(value)));
    const stagedItems = new Map(retained.flatMap(investigram => investigram.items.map(item => [itemKey({ investigram: investigram.id, item: item.key }), item] as const)));
    const names: (Omit<NameMatch, 'standing'>)[] = [];
    for (const investigram of retained) for (const declaration of investigram.declarations) {
      if (declaration.operation === 'withdraw' || declaration.target.kind !== 'entity' || declaration.target.role !== 'identification') continue;
      for (const entry of declaration.members) {
        if (entry.kind !== 'item') continue;
        const item = stagedItems.get(itemKey(entry.item)) ?? this.item(entry.item);
        for (const name of this.catalog.get(item.type)?.identifying?.(item.body) ?? []) {
          names.push(freezeOwned(structuredClone({ entity: declaration.target.entity, association: { investigram: investigram.id, declaration: declaration.key }, item: entry.item, name })));
        }
      }
    }

    // Commit. Nothing above has changed retained state, and nothing below can fail.
    this.#position = position;
    for (const [id, entity] of created) {
      this.#entities.set(id, freezeOwned(entity));
      if (entity.native) this.#natives.set(canonical(entity.native), id);
    }
    const index = <K, V>(map: Map<K, V[]>, key: K, value: V) => { const values = map.get(key) ?? []; values.push(value); map.set(key, values); };
    for (const investigram of retained) {
      const id = investigram.id;
      this.#investigrams.set(id, investigram);
      if (investigram.providerKey !== null) this.#providerKeys.set(investigram.providerKey, id);
      for (const item of investigram.items) {
        const address = freezeOwned({ investigram: id, item: item.key });
        this.#items.set(itemKey(address), item);
        for (const entity of new Set([...item.referents, ...investigram.referents])) index(this.#referencing, entity, address);
      }
    }
    for (const match of names) index(this.#names, match.name.text, match);
    // A flat pool has no semantic order: a use can select content owned by a later investigram of the same pool.
    for (const investigram of retained) {
      const id = investigram.id;
      for (const declaration of investigram.declarations) {
        const address = freezeOwned({ investigram: id, declaration: declaration.key });
        const entry = Object.freeze({ address, declaration, owner: investigram, sequence: this.#sequence++ });
        this.#declarations.set(addressKey(address), entry);
        if (declaration.operation !== 'add') for (const displaced of declaration.displaces) index(this.#displacements, addressKey(displaced), Object.freeze({ change: address, position }));
        if (declaration.operation === 'withdraw') continue;
        const association = entry as AssociationEntry;
        index(this.#byTarget, targetKey(declaration.target), association);
        if (declaration.target.kind !== 'entity') continue;
        index(this.#byEntity, declaration.target.entity, association);
      }
      for (const report of investigram.inconsistencies) {
        const address: MetadataAddress = freezeOwned({ investigram: id, metadata: 'inconsistency', key: report.key });
        for (const endpoint of report.endpoints) {
          index(this.#inconsistencies, memberKey(endpoint), address);
          const owner = endpoint.kind === 'item' ? endpoint.item.investigram : endpoint.association.investigram;
          if (!this.#inconsistenciesWithin.get(owner)?.includes(address)) index(this.#inconsistenciesWithin, owner, address);
        }
      }
    }
    const productions = [...handles].map(handle => {
      handle.close();
      const mine = [...pool.values()].filter(staged => staged.handle === handle);
      this.#conclude(handle, { kind: 'accepted' }, concluded.get(handle) ?? null, mine.map(staged => staged.id));
      return { production: handle.id, investigrams: Object.fromEntries(mine.map(staged => [staged.key, staged.id])),
        entities: Object.fromEntries(mine.flatMap(staged => optional(staged.raw.entities, 'entity').map(entry => {
          const key = (entry as { key: string }).key;
          return [key, localEntities.get(key)!] as const;
        }))) };
    });
    return freezeOwned({ position, productions });
  }
}

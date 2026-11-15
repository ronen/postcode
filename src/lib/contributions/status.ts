import { compare, methods } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { ContributionLedger } from './ledger.js';
import type { AssociationAddress, Declaration, DeclarationAddress, Delivery, InvestigramId, MetadataAddress, ProductionId, SelectionScope } from './model.js';
import { addressKey } from './model.js';

/** An association is displaced once an accepted supersession or withdrawal targets it; otherwise it is standing. */
export interface Standing { readonly state: 'standing' | 'displaced'; readonly displacedBy: readonly DeclarationAddress[] }

/** How a recorded change reached the status bearer. Proximal references; not an enumeration of every path. */
export type CauseRoute =
  /** Later displacement of an exact association use that was received. */
  | { readonly kind: 'exact'; readonly association: AssociationAddress }
  /** Later addition within, or removal from, an acquired inventory or selection scope. */
  | { readonly kind: 'scope'; readonly scope: SelectionScope; readonly effect: 'addition' | 'removal'; readonly association: AssociationAddress }
  /** A producing-context concern of supplied information's generating investigram. */
  | { readonly kind: 'inherited'; readonly from: InvestigramId }
  /** Later displacement of an association included, directly or through declaration membership. */
  | { readonly kind: 'membership'; readonly association: AssociationAddress };

export interface Cause {
  /** The exact change declaration; its identity survives direct and transitive propagation. */
  readonly change: DeclarationAddress;
  readonly operation: Declaration['operation'];
  readonly position: number;
  readonly routes: readonly CauseRoute[];
  /** Current standing of the association the change established; null for a withdrawal. */
  readonly standing: Standing | null;
}

/**
 * Derived claims about recorded Session relationships under a versioned method. They
 * establish neither error nor reliance, and never mutate retained content or captures.
 */
export interface InvestigramStatus {
  readonly investigram: InvestigramId;
  readonly method: string;
  readonly position: number;
  /** Needs-reconsideration causes from the producer's actual inputs. */
  readonly producing: readonly Cause[];
  /** Inconsistency reports targeting this investigram's exact items or uses. */
  readonly inconsistencies: readonly MetadataAddress[];
}
export interface AssociationStatus {
  readonly address: AssociationAddress;
  readonly method: string;
  readonly position: number;
  readonly standing: Standing;
  readonly membership: readonly Cause[];
  /** Concerns of the declaring investigram's production. */
  readonly producing: readonly Cause[];
  /** Concerns of the producers of content referenced from other owners; not a global status on the item. */
  readonly content: readonly { readonly investigram: InvestigramId; readonly producing: readonly Cause[] }[];
  readonly inconsistencies: readonly MetadataAddress[];
}

type Pending = Map<string, { change: DeclarationAddress; routes: Map<string, CauseRoute> }>;

export class ContributionStatus {
  readonly #ledger: ContributionLedger;
  #memoPosition = -1;
  readonly #memo = new Map<ProductionId, readonly Cause[]>();
  constructor(ledger: ContributionLedger) { this.#ledger = ledger; }

  #finish(pending: Pending): readonly Cause[] {
    const ledger = this.#ledger;
    return freezeOwned(structuredClone([...pending.values()]
      .sort((a, b) => ledger.declarationEntry(a.change).sequence - ledger.declarationEntry(b.change).sequence)
      .map(({ change, routes }) => {
        const entry = ledger.declarationEntry(change);
        return { change, operation: entry.declaration.operation, position: entry.owner.position,
          routes: [...routes].sort(([a], [b]) => compare(a, b)).map(([, route]) => route),
          standing: entry.declaration.operation === 'withdraw' ? null : ledger.standing(change) };
      })));
  }

  /** Later displacements of an association's transitive member associations, relative to a position. */
  #membership(association: AssociationAddress, after: number, add: (change: DeclarationAddress, route: CauseRoute) => void): void {
    for (const member of this.#ledger.memberAssociations(association)) {
      for (const displacement of this.#ledger.displacements(member)) {
        if (displacement.position > after) add(displacement.change, { kind: 'membership', association: member });
      }
    }
  }

  #derive(self: ProductionId, deliveries: readonly Delivery[]): readonly Cause[] {
    const ledger = this.#ledger, pending: Pending = new Map();
    // An exact notice actually delivered before submission makes that change known by every route.
    const noticed = new Set(deliveries.flatMap(delivery => delivery.kind === 'notice' ? [addressKey(delivery.change)] : []));
    const add = (change: DeclarationAddress, route: CauseRoute) => {
      const key = addressKey(change);
      // A production acquires no cause solely from its own declarations.
      if (noticed.has(key) || ledger.declarationEntry(change).owner.production === self) return;
      const entry = pending.get(key) ?? { change, routes: new Map() };
      entry.routes.set(JSON.stringify(route), route); pending.set(key, entry);
    };
    const exact = (association: AssociationAddress, after: number) => {
      for (const displacement of ledger.displacements(association)) {
        if (displacement.position > after) add(displacement.change, { kind: 'exact', association });
      }
    };
    // A cause already accepted at delivery is known context, and cannot re-enter by this route.
    const inherit = (from: InvestigramId, after: number) => {
      const source = ledger.investigram(from).production;
      if (source === self) return;
      for (const cause of this.production(source)) if (cause.position > after) add(cause.change, { kind: 'inherited', from });
    };
    for (const delivery of deliveries) {
      switch (delivery.kind) {
        case 'association':
          exact(delivery.association, delivery.position);
          this.#membership(delivery.association, delivery.position, add);
          inherit(delivery.association.investigram, delivery.position);
          break;
        case 'item':
          if (delivery.route) exact(delivery.route, delivery.position);
          inherit(delivery.item.investigram, delivery.position);
          break;
        case 'declaration': inherit(delivery.declaration.investigram, delivery.position); break;
        case 'metadata': inherit(delivery.address.investigram, delivery.position); break;
        case 'scope': {
          for (const entry of ledger.associations(delivery.scope, 'all')) {
            if (entry.owner.position > delivery.position) add(entry.address, { kind: 'scope', scope: delivery.scope, effect: 'addition', association: entry.address });
          }
          // Membership of an all-history address inventory is unchanged by withdrawal.
          if (delivery.inventory === 'current-only') for (const association of delivery.listed) {
            for (const displacement of ledger.displacements(association)) {
              if (displacement.position > delivery.position) add(displacement.change, { kind: 'scope', scope: delivery.scope, effect: 'removal', association });
            }
          }
          break;
        }
        // A notice or a discovery-only handle is not content exposure.
        case 'notice': case 'discovery': break;
      }
    }
    return this.#finish(pending);
  }

  /** Producing-context causes of one concluded production, from its actual input history. */
  production(id: ProductionId): readonly Cause[] {
    if (this.#memoPosition !== this.#ledger.position) { this.#memo.clear(); this.#memoPosition = this.#ledger.position; }
    let causes = this.#memo.get(id);
    if (!causes) { causes = this.#derive(id, this.#ledger.production(id).deliveries); this.#memo.set(id, causes); }
    return causes;
  }

  /** For an open production: changes not yet known to it that would be causes if it submitted now. */
  pending(production: { readonly id: ProductionId; readonly deliveries: readonly Delivery[] }): readonly Cause[] {
    return this.#derive(production.id, production.deliveries);
  }

  investigram(id: InvestigramId): InvestigramStatus {
    const owner = this.#ledger.investigram(id);
    return freezeOwned({ investigram: id, method: methods.contributionStatus, position: this.#ledger.position,
      producing: this.production(owner.production), inconsistencies: [...this.#ledger.inconsistenciesWithin(id)] });
  }

  association(address: AssociationAddress): AssociationStatus {
    const ledger = this.#ledger, entry = ledger.association(address), pending: Pending = new Map();
    this.#membership(address, entry.owner.position, (change, route) => {
      const item = pending.get(addressKey(change)) ?? { change, routes: new Map() };
      item.routes.set(JSON.stringify(route), route); pending.set(addressKey(change), item);
    });
    const owners = [...new Set(entry.declaration.members.flatMap(member => member.kind === 'item' ? [member.item.investigram] : []))]
      .filter(owner => owner !== address.investigram);
    return freezeOwned({ address, method: methods.contributionStatus, position: ledger.position, standing: ledger.standing(address),
      membership: this.#finish(pending), producing: this.production(entry.owner.production),
      content: owners.map(investigram => ({ investigram, producing: this.production(ledger.investigram(investigram).production) })),
      inconsistencies: [...ledger.inconsistencies({ kind: 'association', association: address })] });
  }
}

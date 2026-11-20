import { InvalidContribution } from './model.js';
import type { EntityId, ItemAddress } from './model.js';

/** Shared wording for production instructions and the hosted content-subject schema. */
export const componentSelectorGuidance = 'component selects a locally addressable part of a content item, not a separate Entity. Supported selectors are declared by the content-type contract and listed in the retained item’s components array. For a submission-local item, use only selectors defined by that type’s documented contract. An arbitrary content-body field name is not automatically a valid selector. When no supported selector is available, omit component and target the whole item.';

/** Assigned labels remain distinguishable from names in the system under study. */
export interface IdentifyingName { readonly text: string; readonly origin: 'system-under-study' | 'assigned' | 'generated-handle' }

export interface ReferenceResolver {
  entity(reference: unknown): EntityId;
  item(reference: unknown): ItemAddress;
}
export interface AcceptedBody {
  /** The retained body, with submission-local references resolved. */
  readonly body: unknown;
  readonly entities: readonly EntityId[];
  /** Content dependencies declared once by the contract. */
  readonly content: readonly ItemAddress[];
  /** Locally addressable components; these are not Entities. */
  readonly components: readonly string[];
}

/**
 * A content-type contract gives retained structure its meaning. The schema check
 * establishes mechanically checkable shape and reference integrity, never truth.
 */
export interface ContentTypeContract {
  readonly type: string;
  readonly method: string;
  readonly meaning: string;
  accept(body: unknown, resolve: ReferenceResolver): AcceptedBody;
  /** Present for types able to carry identifying information for the identification role. */
  identifying?(body: unknown): readonly IdentifyingName[];
}

const invalid = (message: string): never => { throw new InvalidContribution(message); };
export function record(value: unknown, keys: readonly string[], what: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return invalid(`Expected ${what} object.`);
  const unexpected = Object.keys(value).find(key => !keys.includes(key));
  if (unexpected !== undefined) return invalid(`Unexpected ${what} field: ${unexpected}.`);
  return value as Record<string, unknown>;
}
export const text = (value: unknown, what: string): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : invalid(`Expected nonempty ${what}.`);
export const list = (value: unknown, what: string): unknown[] => Array.isArray(value) ? value : invalid(`Expected ${what} array.`);

/** Qualified prose is a legitimate item; it does not satisfy a required specialized form. */
export const proseContract: ContentTypeContract = {
  type: 'prose', method: 'postcode/content-prose@1',
  meaning: 'A prose finding or explanation. Its claims are qualified by its item and owner qualifications.',
  accept(body) {
    const value = record(body, ['text'], 'prose');
    return { body: { text: text(value.text, 'prose text') }, entities: [], content: [], components: [] };
  },
};

/** A readable name or designation with distinguishing context; not a complete behavioral definition. */
export const identificationContract: ContentTypeContract = {
  type: 'identification', method: 'postcode/content-identification@1',
  meaning: 'Identifying information for one thing in the system under study: a name where one exists and a distinguishing designation.',
  accept(body) {
    const value = record(body, ['name', 'nameOrigin', 'designation'], 'identification');
    const name = value.name === null || value.name === undefined ? null : text(value.name, 'identifying name');
    const nameOrigin = value.nameOrigin ?? (name === null ? null : invalid('A name requires its origin.'));
    if (name === null ? nameOrigin !== null : nameOrigin !== 'system-under-study' && nameOrigin !== 'assigned') return invalid('Invalid name origin.');
    return { body: { name, nameOrigin, designation: text(value.designation, 'distinguishing designation') }, entities: [], content: [], components: [] };
  },
  identifying(body) {
    const value = body as { name: string | null; nameOrigin: IdentifyingName['origin'] | null };
    return value.name === null || value.nameOrigin === null ? [] : [{ text: value.name, origin: value.nameOrigin }];
  },
};

export class ContentCatalog {
  readonly #contracts: ReadonlyMap<string, ContentTypeContract>;
  constructor(contracts: readonly ContentTypeContract[] = [proseContract, identificationContract]) {
    this.#contracts = new Map(contracts.map(contract => [contract.type, contract]));
    if (this.#contracts.size !== contracts.length) throw new Error('Duplicate content type');
  }
  get(type: string): ContentTypeContract | undefined { return this.#contracts.get(type); }
  with(...contracts: readonly ContentTypeContract[]): ContentCatalog { return new ContentCatalog([...this.#contracts.values(), ...contracts]); }
}

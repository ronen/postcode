import { presentations, validatePresentations } from './presentation-contracts.js';
import type { PresentationDefinition } from './presentation-contracts.js';
import { commandLenses, lenses } from './requests.js';
import type { CommandLens, LensDefinition, PublicLensId } from './requests.js';
import { canonical } from './identity.js';
import { operations, requireOperation } from './investigation/operations.js';
import type { OperationCatalog } from './investigation/operations.js';
import { freezeOwned } from './immutable.js';

/** Internal assembly seam. Definitions are captured before opening a Session;
 * no registration, discovery or replacement occurs during execution. */
export interface RequestCatalog {
  readonly lenses: Readonly<Record<string, LensDefinition>>;
  readonly operations: OperationCatalog;
  readonly presentations?: readonly PresentationDefinition[];
}
export const defaultCatalog: RequestCatalog = freezeOwned({ lenses, operations, presentations });
export type CapturedCatalog = RequestCatalog & { readonly presentations: readonly PresentationDefinition[] };
export function captureCatalog(source: RequestCatalog): CapturedCatalog {
  const catalog = freezeOwned(structuredClone({ ...source, presentations: source.presentations ?? presentations }));
  validatePresentations(catalog.presentations);
  for (const [id, operation] of Object.entries(catalog.operations)) {
    if (id !== operation.id || !id || !operation.objective.trim() || !operation.method.trim()
      || !['module', 'investigram'].includes(operation.subject)
      || !['subject-reference', 'prior-interpretation'].includes(operation.initialContext)
      || operation.initialContext === 'prior-interpretation' && operation.subject !== 'investigram') {
      throw new Error('Invalid operation definition');
    }
  }
  for (const [id, lens] of Object.entries(catalog.lenses)) {
    if (id !== lens.id || !id || !lens.question.trim() || !lens.title.trim()) throw new Error('Invalid Lens definition');
    if (id === 'usage' || Object.hasOwn(commandLenses, id) && commandLenses[id as CommandLens] !== id) {
      throw new Error('Lens identity is reserved for a command alias or report');
    }
    const builtin = Object.hasOwn(lenses, id) ? lenses[id as PublicLensId] : undefined;
    // Mechanical dispatch still uses built-in identities. Until its assembly
    // boundary exists, neither new policy under those names nor a mechanical
    // implementation under an interpretation name can be honored.
    if (lens.requirements.kind !== 'interpretation' || builtin && builtin.requirements.kind !== 'interpretation') {
      if (!builtin || canonical(lens) !== canonical(builtin)) {
        throw new Error('Additional or altered mechanical Lens definitions are not yet supported');
      }
    }
    if (lens.requirements.kind === 'interpretation') {
      if (!lens.parameters || typeof lens.parameters !== 'object' || Array.isArray(lens.parameters)
        || Object.getPrototypeOf(lens.parameters) !== Object.prototype || Object.keys(lens.parameters).length) {
        throw new Error('Interpretation Lens definitions must declare an empty parameter object');
      }
      const operation = requireOperation(catalog.operations, lens.requirements.operation);
      if (lens.cardinality !== 'one' || lens.subjects.length !== 1 || lens.subjects[0] !== operation.subject
        || lens.results.length !== 1 || lens.results[0] !== 'investigation') throw new Error('Incompatible interpretation Lens definition');
    }
  }
  return catalog;
}

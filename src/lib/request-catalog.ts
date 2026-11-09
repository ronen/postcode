import { presentations, validatePresentations } from './presentation-contracts.js';
import type { PresentationDefinition } from './presentation-contracts.js';
import { commandLenses, lenses } from './requests.js';
import type { CommandLens, LensDefinition } from './requests.js';
import { captureApplicationCatalog } from './application/catalog.js';
import { operations } from './investigation/operations.js';
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
  captureApplicationCatalog({ lenses: catalog.lenses, operations: catalog.operations });
  for (const id of Object.keys(catalog.lenses)) {
    if (id === 'usage' || id === 'present' || Object.hasOwn(commandLenses, id) && commandLenses[id as CommandLens] !== id) {
      throw new Error('Lens identity is reserved for a command alias or report');
    }
  }
  return catalog;
}

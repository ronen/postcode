import { lenses } from './requests.js';
import type { LensDefinition } from './requests.js';
import { operations, requireOperation } from './investigation/operations.js';
import type { OperationCatalog } from './investigation/operations.js';
import { freezeOwned } from './immutable.js';

/** Internal assembly seam. Definitions are captured before opening a Session;
 * no registration, discovery or replacement occurs during execution. */
export interface RequestCatalog {
  readonly lenses: Readonly<Record<string, LensDefinition>>;
  readonly operations: OperationCatalog;
}
export const defaultCatalog: RequestCatalog = freezeOwned({ lenses, operations });
export function captureCatalog(source: RequestCatalog): RequestCatalog {
  const catalog = freezeOwned(structuredClone(source));
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
    if (lens.requirements.kind !== 'interpretation' && !Object.hasOwn(lenses, id)) {
      throw new Error('Additional mechanical Lens implementations are not yet supported');
    }
    if (lens.requirements.kind === 'interpretation') {
      const operation = requireOperation(catalog.operations, lens.requirements.operation);
      if (lens.cardinality !== 'one' || lens.subjects.length !== 1 || lens.subjects[0] !== operation.subject
        || lens.results.length !== 1 || lens.results[0] !== 'investigation') throw new Error('Incompatible interpretation Lens definition');
    }
  }
  return catalog;
}

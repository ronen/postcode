import { representationProblem } from './input.js';
import { lenses } from './lenses.js';
import type { LensDefinition } from './lenses.js';
import { operations, requireOperation } from '../investigation/operations.js';
import type { OperationCatalog } from '../investigation/operations.js';
import { freezeOwned } from '../immutable.js';
import { canonical } from '../identity.js';
import { mechanicalImplementation } from '../mechanical-implementations.js';
import { capturePresentations } from './consumption.js';
import type { PresentationDeclaration } from './consumption.js';

export interface ApplicationCatalog {
  readonly lenses: Readonly<Record<string, LensDefinition>>;
  readonly operations: OperationCatalog;
  readonly presentations?: readonly PresentationDeclaration[];
}
export const applicationCatalog: ApplicationCatalog = freezeOwned({ lenses, operations });
export type CapturedApplicationCatalog = ApplicationCatalog & { readonly presentations: readonly PresentationDeclaration[] };
export function captureApplicationCatalog(source: ApplicationCatalog): CapturedApplicationCatalog {
  const problem = representationProblem(source, 'catalog');
  if (problem) throw new Error(`Invalid application catalog at ${problem.field}: ${problem.reason}`);
  const captured = freezeOwned(structuredClone({ ...source, presentations: capturePresentations(source.presentations ?? []) }));
  for (const [id, operation] of Object.entries(captured.operations)) {
    if (id !== operation.id || !id || !operation.objective.trim() || !operation.method.trim()
      || !['module', 'investigram'].includes(operation.subject)
      || !['subject-reference', 'prior-interpretation'].includes(operation.initialContext)
      || operation.initialContext === 'prior-interpretation' && operation.subject !== 'investigram') throw new Error('Invalid operation definition');
  }
  for (const [id, lens] of Object.entries(captured.lenses)) {
    if (id !== lens.id || !id || !lens.question.trim() || !lens.title.trim()) throw new Error('Invalid Lens definition');
    const builtin = Object.hasOwn(lenses, id) ? (lenses as Readonly<Record<string, LensDefinition>>)[id] : undefined;
    if (builtin && builtin.requirements.kind !== 'interpretation' && canonical(lens) !== canonical(builtin)) throw new Error('Unsupported mechanical Lens definitions for built-in identity');
    mechanicalImplementation(lens);
    if (lens.requirements.kind === 'interpretation') {
      if (!lens.parameters || typeof lens.parameters !== 'object' || Array.isArray(lens.parameters)
        || Object.getPrototypeOf(lens.parameters) !== Object.prototype || Object.keys(lens.parameters).length) throw new Error('Interpretation Lens definitions must declare an empty parameter object');
      const operation = requireOperation(captured.operations, lens.requirements.operation);
      if (lens.cardinality !== 'one' || lens.subjects.length !== 1 || lens.subjects[0] !== operation.subject
        || lens.results.length !== 1 || lens.results[0] !== 'investigation') throw new Error('Incompatible interpretation Lens definition');
    }
  }
  return captured;
}

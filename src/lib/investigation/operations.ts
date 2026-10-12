import { digest, methods } from '../identity.js';
import { freezeOwned } from '../immutable.js';

/** Operation policy is independent of the Lens consuming its outcome. */
export interface OperationDefinition {
  readonly id: string;
  readonly objective: string;
  readonly subject: 'module' | 'investigram';
  readonly initialContext: 'subject-reference' | 'prior-interpretation';
  readonly method: string;
}
export type OperationCatalog = Readonly<Record<string, OperationDefinition>>;
export const operations: OperationCatalog = freezeOwned({
  functionality: { id: 'functionality', objective: 'Give a deliberately terse account of apparent module functionality and division of responsibility. Explain significant mechanisms, cases and delegation. Follow useful delegation across multiple modules; avoid structural labels as a substitute for functionality. Do not invent a unifying role for mixed responsibilities.', subject: 'module', initialContext: 'subject-reference', method: 'postcode/functionality@1' },
  clarification: { id: 'clarification', objective: 'Make the selected program aspect more understandable, adding useful clarification omitted for brevity. New findings are not required. Avoid a general programming tutorial.', subject: 'investigram', initialContext: 'prior-interpretation', method: 'postcode/clarification@1' },
  decomposition: { id: 'decomposition', objective: 'Identify smaller, tersely described selectable aspects of the selected functionality. Do not imply the parts are exhaustive or mutually exclusive without support.', subject: 'investigram', initialContext: 'prior-interpretation', method: 'postcode/decomposition@1' },
  examination: { id: 'examination', objective: 'Investigate the selected aspect more deeply. Supply substantive findings, sharper limitations, explicit corrections, or a candid report that no useful addition was established.', subject: 'investigram', initialContext: 'prior-interpretation', method: 'postcode/examination@1' },
});

/** Fingerprint actual policy as well as its authored version; a forgotten version
 * bump must not permit reuse after changing objective or initial context. */
export function operationMethod(definition: OperationDefinition): string {
  return `${methods.investigation} ${definition.method} definition:${digest(definition)}`;
}
export function requireOperation(catalog: OperationCatalog, id: string): OperationDefinition {
  const definition = Object.hasOwn(catalog, id) ? catalog[id] : undefined;
  if (!definition) throw new Error(`Unknown investigation operation: ${id}`);
  return definition;
}

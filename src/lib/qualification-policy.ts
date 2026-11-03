import { methods } from './identity.js';
import type { ClaimContextRecord } from './records.js';

/** Shared prose for qualifications represented by the module view's run summary. */
export const moduleLimitations = {
  population: 'Population covers configured files the analyzer treats as separate modules and visible named modules described by declarations (including interfaces to external implementations). Files treated as shared global code and other compiler module categories are not established as modules.',
  excludedOutput: 'Configured generated-output locations are explicitly excluded from repository evidence.',
  firstObserved: 'No atomic filesystem snapshot is claimed; inputs are memoized as first observed.',
} as const;

/** Only the primary producer (the first exact method token) classifies a context.
 * Inherited composition provenance cannot suppress a derived context's limitations.
 */
export function isCompositionContext(context: Pick<ClaimContextRecord, 'method'>): boolean {
  return context.method.split(';')[0] === methods.composition;
}

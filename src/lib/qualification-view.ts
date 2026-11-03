import { diagnosticMeaning } from './diagnostic-view.js';
import type { ClaimContextRecord } from './records.js';

/** Conceptual disclosure retains the context identity; captured support stays in core content. */
export function presentQualification(context: ClaimContextRecord): Omit<ClaimContextRecord, 'kind' | 'evidence' | 'inputs'> {
  const { kind: _kind, evidence: _evidence, inputs: _inputs, ...conceptual } = context;
  return { ...conceptual, diagnostics: conceptual.diagnostics.map(item => ({ ...item, explanation: diagnosticMeaning(item) })) };
}

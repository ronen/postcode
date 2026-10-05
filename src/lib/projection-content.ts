import type { AnalysisInputsRecord, ClaimContextRecord, ProgramRecord, ProgramRecordStore, RecordId } from './records.js';

/** The record and its complete support remain attributable before any disclosure policy. */
export interface QualifiedContext {
  readonly context: ClaimContextRecord;
  readonly inputs: AnalysisInputsRecord | null;
  readonly evidence: readonly ProgramRecord[];
}

export interface QualifiedRecord<T extends { readonly context: RecordId }> extends QualifiedContext { readonly record: T }

/** Resolves captured support only; it cannot acquire inputs or establish another claim. */
export function qualifiedContext(store: ProgramRecordStore, id: RecordId): QualifiedContext {
  const context = store.get(id);
  if (context.kind !== 'claim-context') throw new Error('Expected Claim context');
  const inputs = context.inputs ? store.get(context.inputs) : null;
  if (inputs && inputs.kind !== 'analysis-inputs') throw new Error('Expected captured inputs');
  return Object.freeze({ context, inputs, evidence: Object.freeze(context.evidence.map(id => store.get(id))) });
}

export function qualifiedRecord<T extends { readonly context: RecordId }>(store: ProgramRecordStore, record: T): QualifiedRecord<T> {
  return Object.freeze({ record, ...qualifiedContext(store, record.context) });
}

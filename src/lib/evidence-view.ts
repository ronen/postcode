import { diagnosticMeaning } from './diagnostic-view.js';
import type { ProgramRecord, SourceEvidenceRecord } from './records.js';

/** Attribution from fixed captured evidence. Source text remains available to analysis and agents. */
export type SourceAttribution = Omit<SourceEvidenceRecord, 'location'> & {
  readonly location: { readonly association: 'file' } | Omit<Extract<SourceEvidenceRecord['location'], { association: 'span' }>, 'excerpt'>;
};
export type DetailRecord = Exclude<ProgramRecord, SourceEvidenceRecord> | SourceAttribution;

export function sourceAttribution(source: SourceEvidenceRecord): SourceAttribution {
  const location = source.location.association === 'file' ? source.location
    : { association: 'span' as const, from: source.location.from, to: source.location.to };
  return { ...source, location };
}
export function detailRecord(record: ProgramRecord): DetailRecord {
  return record.kind === 'source-evidence' ? sourceAttribution(record)
    : record.kind === 'claim-context' ? { ...record, diagnostics: record.diagnostics.map(item => ({ ...item, explanation: diagnosticMeaning(item) })) } : record;
}

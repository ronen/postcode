import { freezeOwned } from '../immutable.js';
import { qualifiedContext, qualifiedRecord } from '../projection-content.js';
import type { QualifiedContext, QualifiedRecord } from '../projection-content.js';
import type { AnalysisInputsRecord, ModuleClaim, ProgramRecord, ProgramRecordStore, RecordId } from '../records.js';
import type { ReferenceSubject } from '../reference-binding.js';
import type { Correction, Investigram, InvestigationProvenance } from './contracts.js';
import type { InvestigationEvaluationRecord } from './evaluation.js';
import type { InvestigationSelectionProjection } from './selection-record.js';

export interface InvestigationSupport {
  readonly record: ProgramRecord;
  readonly qualification: QualifiedContext | null;
  readonly inputs: AnalysisInputsRecord | null;
  readonly sources: readonly ProgramRecord[];
  readonly exposures: readonly { readonly provenance: RecordId; readonly forms: readonly ('full' | 'summary' | 'prior-interpretation')[] }[];
}
export interface InvestigationProjectionContent {
  readonly projection: InvestigationSelectionProjection;
  readonly evaluation: InvestigationEvaluationRecord | null;
  readonly accounts: readonly Investigram[];
  readonly corrections: readonly Correction[];
  readonly provenance: readonly InvestigationProvenance[];
  readonly support: readonly InvestigationSupport[];
  readonly candidates: readonly { readonly id: RecordId; readonly naming: QualifiedRecord<ModuleClaim> }[];
  readonly references: readonly ReferenceSubject[];
}

/** Resolve fixed references only. Neither later evaluations nor new associations
 * can change this content; source held here is not yet disclosed by a View. */
export function resolveInvestigationContent(store: ProgramRecordStore, projection: InvestigationSelectionProjection): InvestigationProjectionContent {
  const retained = store.get(projection.id);
  if (retained.kind !== 'investigation-selection-projection') throw new Error('Expected retained investigation selection');
  projection = retained;
  const accounts = new Map<RecordId, Investigram>(), corrections = new Map<RecordId, Correction>();
  const provenance = new Map<RecordId, InvestigationProvenance>();
  const references = new Map<RecordId, ReferenceSubject>();
  const reference = (id: RecordId) => {
    const record = store.get(id);
    if (record.session !== projection.session || !['module', 'group', 'investigram'].includes(record.kind)) throw new Error('Invalid investigation navigation subject');
    references.set(id, { id, kind: record.kind as ReferenceSubject['kind'] });
  };
  const origin = (id: RecordId) => {
    if (provenance.has(id)) return;
    const record = store.get(id);
    if (record.kind !== 'investigation-provenance') throw new Error('Expected investigation provenance');
    provenance.set(id, record);
  };
  const correction = (id: RecordId) => {
    if (corrections.has(id)) return;
    const record = store.get(id);
    if (record.kind !== 'investigram-correction') throw new Error('Expected investigation correction');
    corrections.set(id, record); origin(record.provenance);
    [record.reporter, record.target, record.replacement].forEach(reference);
  };
  const account = (id: RecordId) => {
    if (accounts.has(id)) return;
    const record = store.get(id);
    if (record.kind !== 'investigram') throw new Error('Expected investigram');
    accounts.set(id, record); reference(id); origin(record.provenance);
    record.children.forEach(reference);
    record.corrections.forEach(correction);
    record.inconsistencies.forEach(item => item.targets.forEach(reference));
  };
  projection.subjects.forEach(reference);
  for (const item of projection.relations) { account(item.original); account(item.account); }
  projection.displaced.forEach(account);
  projection.associated.forEach(account);
  for (const item of projection.navigation) {
    reference(item.account); if (item.compositionParent) reference(item.compositionParent); reference(item.investigationSubject);
  }
  for (const revision of projection.revisions) {
    account(revision.original);
    [revision.primary, revision.familyPrimary].forEach(reference);
    for (const row of revision.rows) { correction(row.correction); row.cause?.via.forEach(reference); }
    for (const item of revision.inconsistencies) { account(item.reporter); item.targets.forEach(reference); }
  }
  const supportIds = new Set([...accounts.values()].flatMap(item => [...item.evidence,
    ...item.associations.flatMap(item => item.evidence), ...item.inconsistencies.flatMap(item => item.evidence)]));
  for (const item of corrections.values()) item.evidence.forEach(id => supportIds.add(id));
  const support = [...supportIds].map(id => {
    const record = store.get(id);
    const qualification = record.kind === 'claim' || record.kind === 'recorded-assertion' ? qualifiedContext(store, record.context)
      : record.kind === 'claim-context' ? qualifiedContext(store, record.id) : null;
    const capturedInputs = record.kind === 'captured-content' ? store.get(record.inputs) : null;
    if (capturedInputs && capturedInputs.kind !== 'analysis-inputs') throw new Error('Expected captured content inputs');
    const sourceCandidates = qualification ? qualification.evidence : [record.kind === 'captured-content' ? store.get(record.mapping) : record];
    const exposures = [...provenance.values()].flatMap(origin => {
      const forms: ('full' | 'summary' | 'prior-interpretation')[] = [];
      if (origin.suppliedEvidence.includes(id)) forms.push('full');
      if (origin.summarizedEvidence.includes(id)) forms.push('summary');
      if (origin.citations.includes(id)) forms.push('prior-interpretation');
      return forms.length ? [{ provenance: origin.id, forms }] : [];
    });
    return { record, qualification, inputs: capturedInputs ?? qualification?.inputs ?? null, exposures,
      sources: sourceCandidates.filter(item => item.kind === 'source-evidence' || item.kind === 'repository-artifact') };
  });
  const candidates = projection.lens === 'summarize' && projection.variant === 'request' && !projection.unsupportedSubject
    ? projection.subjects.map(id => {
      const module = store.get(id), claim = module.kind === 'module' ? store.get(module.claim) : null;
      if (claim?.kind !== 'claim' || claim.information.type !== 'module') throw new Error('Expected module naming claim');
      return { id, naming: qualifiedRecord(store, claim as ModuleClaim) };
    }) : [];
  const evaluation = projection.variant === 'request' && projection.outcome.kind === 'evaluation' ? store.get(projection.outcome.evaluation) : null;
  if (evaluation && evaluation.kind !== 'investigation-evaluation') throw new Error('Expected selected investigation evaluation');
  return freezeOwned({ projection, evaluation, accounts: [...accounts.values()], corrections: [...corrections.values()],
    provenance: [...provenance.values()], support, candidates, references: [...references.values()] });
}

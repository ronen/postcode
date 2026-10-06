import type { Investigram } from './contracts.js';
import { methods, recordId } from '../identity.js';
import type { ProgramRecordStore, RecordId, SessionId } from '../records.js';
import type { InvestigationSelection } from './evaluation.js';
import type { InvestigationLens, InvestigationSelectionProjection, SelectionPayload, SelectionSelector } from './selection-record.js';
import { investigationOperations, selectionIdentity, selectionStatus } from './selection-record.js';
import { sessionRevisions } from './revisions.js';

export interface InvestigationSelectionRequest {
  readonly lens: InvestigationLens;
  readonly selector: string | null;
  readonly reference?: boolean;
  readonly unsupportedSubject?: 'investigram' | 'program-subject';
}

/** Selects against accumulated history once. Reconstruction uses only the record. */
export function selectInvestigation(store: ProgramRecordStore, session: SessionId, request: InvestigationSelectionRequest,
  selected: readonly RecordId[], result: InvestigationSelection | null): InvestigationSelectionProjection {
  const selector: SelectionSelector = request.selector === null ? null : request.reference
    ? selected.length === 1 ? { reference: selected[0]! } : { unresolvedReference: request.selector }
    : { literal: request.selector };
  if (request.lens === 'inspect' && !request.unsupportedSubject) {
    if (result !== null) throw new Error('Historical inspection has no generating evaluation');
    return retain(store, { kind: 'investigation-selection-projection', session, method: methods.investigationProjection,
      variant: 'historical-inspection', lens: 'inspect', selector, subjects: selected,
      status: selectionStatus(selected), ...derive(store, session, selected, selected, true, true) });
  }
  if (result && (selected.length !== 1 || result.request.subject !== selected[0] || request.unsupportedSubject
    || !(request.lens in investigationOperations)
    || investigationOperations[request.lens as keyof typeof investigationOperations] !== result.request.operation)) {
    throw new Error('Investigation outcome must describe the selected subject');
  }
  const evaluation = result?.evaluation ? store.get(result.evaluation.id) : null;
  if (evaluation && evaluation.kind !== 'investigation-evaluation') throw new Error('Expected retained investigation evaluation');
  const outcome = evaluation ? { kind: 'evaluation' as const, evaluation: evaluation.id }
    : result?.unavailable ? { kind: 'unavailable' as const, value: {
      kind: result.unavailable.kind, code: result.unavailable.code, diagnostic: result.unavailable.diagnostic,
    } } : { kind: 'no-evaluation' as const };
  const roots = evaluation?.outcome.kind === 'accepted' ? [evaluation.outcome.root] : [];
  return retain(store, { kind: 'investigation-selection-projection', session, method: methods.investigationProjection,
    variant: 'request', lens: request.lens, selector, subjects: selected, status: selectionStatus(selected, request.unsupportedSubject),
    unsupportedSubject: request.unsupportedSubject ?? null, outcome, ...derive(store, session, selected, roots, false, false) });
}

/** The mechanical argument is the Projection actually shown, including embedded module inspection. */
export function selectAssociatedInspection(store: ProgramRecordStore, mechanical: RecordId,
  subjects: readonly RecordId[]): InvestigationSelectionProjection {
  const basis = store.get(mechanical);
  if (basis.kind !== 'projection' && basis.kind !== 'organization-projection') throw new Error('Expected mechanical inspection Projection');
  if (basis.lens !== 'inspect') throw new Error('Expected inspection lens');
  return retain(store, { kind: 'investigation-selection-projection', session: basis.session, method: methods.investigationProjection,
    variant: 'associated-inspection', lens: 'inspect', selector: null, mechanical, subjects, status: selectionStatus(subjects),
    ...derive(store, basis.session, subjects, [], true, true) });
}


function retain(store: ProgramRecordStore, payload: SelectionPayload): InvestigationSelectionProjection {
  const value = { ...payload, id: recordId(payload.session, 'investigation-selection-projection', selectionIdentity(payload)) };
  store.put([value]);
  const retained = store.get(value.id);
  if (retained.kind !== 'investigation-selection-projection') throw new Error('Expected retained investigation selection');
  return retained;
}

function derive(store: ProgramRecordStore, session: SessionId, selected: readonly RecordId[], roots: readonly RecordId[],
  historical: boolean, includeAssociations: boolean) {
  const index = sessionRevisions(store, session);
  const relations = new Map<RecordId, RecordId>(), expanded = new Set<RecordId>(), displaced = new Set<RecordId>();
  const rememberDisplaced = (root: RecordId) => {
    const pending = [root];
    for (let cursor = 0; cursor < pending.length; cursor++) {
      const id = pending[cursor]!;
      if (displaced.has(id)) continue;
      const account = index.accounts.get(id);
      if (!account) throw new Error('Missing displaced investigram');
      displaced.add(id); pending.push(...account.children);
    }
  };
  const pending = [...roots];
  for (let cursor = 0; cursor < pending.length; cursor++) {
    const original = pending[cursor]!;
    if (relations.has(original)) continue;
    const id = historical ? original : index.primary(original);
    relations.set(original, id);
    if (id !== original) rememberDisplaced(original);
    if (expanded.has(id)) continue;
    const account = index.accounts.get(id);
    if (!account) throw new Error('Missing selected investigram');
    expanded.add(id); pending.push(...account.children);
    for (const correctionId of account.corrections) {
      const correction = store.get(correctionId);
      if (correction.kind !== 'investigram-correction') throw new Error('Expected accompanying correction');
      pending.push(correction.replacement);
    }
  }
  const selectedSet = new Set(selected);
  const associated = includeAssociations ? [...index.accounts.values()]
    .filter(account => account.associations.some(item => selectedSet.has(item.subject))).map(item => item.id) : [];
  const parents = new Map([...index.accounts.values()].flatMap(account => account.children.map(child => [child, account.id] as const)));
  const navigation = [...expanded].map(id => {
    const account = index.accounts.get(id)!;
    const provenance = store.get(account.provenance);
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected investigation provenance');
    return { account: id, compositionParent: parents.get(id) ?? null, investigationSubject: provenance.request.subject };
  });
  const revisionSubjects = [...new Set([...selected.filter(id => index.accounts.has(id)),
    ...[...relations].flat(), ...displaced, ...associated])];
  return { roots, relations: [...relations].map(([original, account]) => ({ original, account })), displaced: [...displaced],
    navigation, associated, revisions: revisionSubjects.map(id => index.snapshot(id)) };
}

/** Association roles are explicit; originating context and evidence mentions do not add matches. */
export function associatedInvestigrams(store: ProgramRecordStore, session: SessionId, subjects: readonly RecordId[]): Investigram[] {
  const selected = new Set(subjects);
  return store.investigations(session).flatMap(item => item.investigrams).map(id => store.get(id))
    .filter((item): item is Investigram => item.kind === 'investigram' && item.associations.some(item => selected.has(item.subject)));
}

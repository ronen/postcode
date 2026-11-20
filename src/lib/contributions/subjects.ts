import { nativeRecordCandidate, nativeRecordEntity } from './native-identity.js';
import { EntityBindings } from '../identity.js';
import type { ProgramRecordStore, RecordId } from '../records.js';
import type { ContributionLedger } from './ledger.js';
import { UnknownReference } from './model.js';
import type { EntityId, InvestigramId, SubjectRef } from './model.js';

/** Compact contribution spellings belong to the same lifetime as their ledger. */
const bindings = new WeakMap<ContributionLedger, EntityBindings>();
export function contributionBindings(ledger: ContributionLedger, ids: readonly InvestigramId[]): ReadonlyMap<RecordId, string> {
  // Validate all inputs before allocating any spelling.
  for (const id of ids) ledger.investigram(id);
  let table = bindings.get(ledger);
  if (!table) { table = new EntityBindings(); bindings.set(ledger, table); }
  return table.allocate(ids, 'investigram');
}
export function contributionReference(ledger: ContributionLedger, reference: string): InvestigramId | undefined {
  const id = (bindings.get(ledger)?.resolve(reference.replace(/^@/, '')) ?? reference.replace(/^@/, '')) as InvestigramId;
  try { return ledger.investigram(id).id; } catch (error) { if (error instanceof UnknownReference) return undefined; throw error; }
}

export type ExactSubject = Exclude<SubjectRef, { kind: 'scope' }>;
/** Runtime shape validation before any ledger lookup or invocation. */
export function exactSubjectShape(value: unknown): value is ExactSubject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const subject = value as Record<string, unknown>;
  const keys = (...allowed: string[]) => Object.keys(subject).every(key => allowed.includes(key));
  const address = (value: unknown, key: string) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const item = value as Record<string, unknown>;
    return Object.keys(item).length === 2 && typeof item.investigram === 'string' && typeof item[key] === 'string' && item[key] !== '';
  };
  switch (subject.kind) {
    case 'entity': return keys('kind', 'entity') && typeof subject.entity === 'string';
    case 'investigram': return keys('kind', 'investigram') && typeof subject.investigram === 'string';
    case 'content': return keys('kind', 'item', 'component') && address(subject.item, 'item')
      && (subject.component === null || typeof subject.component === 'string');
    case 'designation': return keys('kind', 'association') && address(subject.association, 'declaration');
    default: return false;
  }
}
/** Exact validation never selects a successor or creates an invocation/exposure. */
export function availableSubject(ledger: ContributionLedger, subject: ExactSubject): boolean {
  try {
    switch (subject.kind) {
      case 'entity': ledger.entity(subject.entity); return true;
      case 'investigram': ledger.investigram(subject.investigram); return true;
      case 'content': { const item = ledger.item(subject.item); return subject.component === null || item.components.includes(subject.component); }
      case 'designation': return ledger.association(subject.association).declaration.target.kind === 'result';
    }
  } catch (error) { if (error instanceof UnknownReference) return false; throw error; }
}
export function subjectOwner(subject: ExactSubject): RecordId {
  switch (subject.kind) {
    case 'entity': return subject.entity;
    case 'investigram': return subject.investigram;
    case 'content': return subject.item.investigram;
    case 'designation': return subject.association.investigram;
  }
}
/** The key locates a candidate; only the complete native identity, kind and modality establish correspondence. */
export function entityRecord(store: ProgramRecordStore, ledger: ContributionLedger, entity: EntityId): RecordId | undefined {
  const retained = ledger.entity(entity), native = retained.native;
  if (retained.modality !== 'implemented' || !native || !/^session:(module|symbol|group):/.test(native.key)) return undefined;
  const value = nativeRecordCandidate(store, ledger.session, native.key);
  return value && nativeRecordEntity(ledger, value) === entity ? value.id : undefined;
}

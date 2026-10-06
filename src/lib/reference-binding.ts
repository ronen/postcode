import type { ProgramRecordStore, RecordId, SessionId } from './records.js';

export type ReferenceKind = 'module' | 'group' | 'investigram';
export interface ReferenceSubject { readonly id: RecordId; readonly kind: ReferenceKind }
export interface ReferenceBinding {
  bind(ids: readonly RecordId[], kind: ReferenceKind): ReadonlyMap<RecordId, string>;
}

/** A population authorizes allocation without allocating or exposing session content. */
export function referenceBinding(store: ProgramRecordStore, session: SessionId,
  population: readonly ReferenceSubject[]): ReferenceBinding {
  const allowed = new Map<RecordId, ReferenceKind>();
  for (const item of population) {
    const record = store.get(item.id);
    if (record.session !== session || record.kind !== item.kind) throw new Error('Invalid reference population');
    allowed.set(item.id, item.kind);
  }
  return Object.freeze({ bind(ids: readonly RecordId[], kind: ReferenceKind) {
    // Reject the whole batch before the session allocator can change any spelling.
    if (ids.some(id => allowed.get(id) !== kind)) throw new Error('Reference is outside the qualified population or has a different kind');
    return store.entityIds(ids, kind);
  } });
}

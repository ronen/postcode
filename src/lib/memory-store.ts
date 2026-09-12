import { canonical } from './identity.js';
import type { EvaluationRecord, ProgramRecord, ProgramRecordStore, RecordId, SnapshotId } from './records.js';

function references(record: ProgramRecord): readonly RecordId[] {
  switch (record.kind) {
    case 'snapshot': return [];
    case 'module': return [record.claim];
    case 'claim': return [record.subject, record.context];
    case 'claim-context': return [...record.evidence,
      ...(record.scope === 'configured-project' ? [] : [record.scope])];
    case 'source-evidence': return [];
    case 'evaluation': return [...record.modules, ...record.contexts];
    case 'projection': return [...record.modules, ...record.claims, ...record.contexts, ...record.evaluations];
  }
}

function freeze(value: unknown): void {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
}

/** Atomic batches permit mutually referring entity/claim/context records. */
export class MemoryProgramRecordStore implements ProgramRecordStore {
  readonly #records = new Map<RecordId, ProgramRecord>();

  put(records: readonly ProgramRecord[]): void {
    const pending = new Map<RecordId, ProgramRecord>();
    for (const record of records) {
      if (!record.id || !record.snapshot || !record.method) throw new Error('Missing record context');
      const prior = pending.get(record.id) ?? this.#records.get(record.id);
      if (prior && canonical(prior) !== canonical(record)) throw new Error('Immutable record collision');
      pending.set(record.id, structuredClone(record));
    }
    for (const record of pending.values()) {
      const snapshot = pending.get(record.snapshot) ?? this.#records.get(record.snapshot);
      if (snapshot?.kind !== 'snapshot' || snapshot.id !== snapshot.snapshot) {
        throw new Error('Missing or invalid snapshot');
      }
      for (const id of references(record)) {
        const target = pending.get(id) ?? this.#records.get(id);
        if (!target || target.snapshot !== record.snapshot) throw new Error('Invalid record reference');
      }
      const requireKind = (id: RecordId, kind: ProgramRecord['kind']) => {
        if ((pending.get(id) ?? this.#records.get(id))?.kind !== kind) {
          throw new Error(`Expected ${kind} reference`);
        }
      };
      switch (record.kind) {
        case 'module': requireKind(record.claim, 'claim'); break;
        case 'claim':
          requireKind(record.subject, 'module');
          requireKind(record.context, 'claim-context');
          break;
        case 'claim-context':
          record.evidence.forEach(id => requireKind(id, 'source-evidence'));
          if (record.scope !== 'configured-project') requireKind(record.scope, 'module');
          break;
        case 'evaluation':
          record.modules.forEach(id => requireKind(id, 'module'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          break;
        case 'projection':
          record.modules.forEach(id => requireKind(id, 'module'));
          record.claims.forEach(id => requireKind(id, 'claim'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          record.evaluations.forEach(id => requireKind(id, 'evaluation'));
          break;
        case 'snapshot':
        case 'source-evidence': break;
      }
    }
    for (const [id, record] of pending) {
      freeze(record);
      this.#records.set(id, record);
    }
  }

  get(id: RecordId): ProgramRecord {
    const result = this.#records.get(id);
    if (!result) throw new Error(`Missing program record: ${id}`);
    return result;
  }

  evaluations(snapshot: SnapshotId): readonly EvaluationRecord[] {
    return [...this.#records.values()].filter((record): record is EvaluationRecord =>
      record.kind === 'evaluation' && record.snapshot === snapshot);
  }
}

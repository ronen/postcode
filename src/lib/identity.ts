import { createHash } from 'node:crypto';
import type { RecordId, SnapshotId } from './records.js';

/** Bump the responsible method whenever its analysis/identity/projection semantics change. */
export const methods = {
  inputs: 'postcode/observed-inputs@3',
  records: 'postcode/program-records@14',
  discovery: 'postcode/typescript-modules@10',
  evaluation: 'postcode/evaluate-modules@3',
  dependencies: 'postcode/typescript-dependencies@2',
  dependencyEvaluation: 'postcode/evaluate-dependencies@1',
  dependencyProjection: 'postcode/dependency-projection@1',
  composition: 'postcode/typescript-composition@1',
  dependencyOrganization: 'postcode/dependency-organization@1',
  projection: 'postcode/projection@6',
  expansions: 'postcode/typescript-expansions@2',
  presentation: 'postcode/presentation@19',
  handles: 'postcode/module-handles@5',
  organization: 'postcode/organization@3',
} as const;

/** Stable key order without locale, clock, random IDs, or storage identity. */
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    return `{${Object.entries(value).sort(([a], [b]) => compare(a, b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  }
  const result = JSON.stringify(value);
  if (result === undefined) throw new Error('Non-serializable identity input');
  return result;
}

export function compare(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
export function digest(value: unknown): string {
  return createHash('sha256').update(canonical(value)).digest('hex');
}
export function snapshotId(input: unknown): SnapshotId {
  return `snapshot:${digest(input)}` as SnapshotId;
}
export function recordId(snapshot: SnapshotId, kind: string, key: unknown): RecordId {
  return `${snapshot}:${kind}:${digest(key)}` as RecordId;
}

/** Precise module addresses, abbreviated against the complete snapshot population. */
export function moduleEntityIds(ids: readonly RecordId[]): ReadonlyMap<RecordId, string> {
  return entityIds(ids, 'module');
}

export function groupEntityIds(ids: readonly RecordId[]): ReadonlyMap<RecordId, string> {
  return entityIds(ids, 'group');
}

function entityIds(ids: readonly RecordId[], kind: 'module' | 'group'): ReadonlyMap<RecordId, string> {
  const entries = [...new Set(ids)].map(id => ({ id, hash: id.slice(id.lastIndexOf(':') + 1) }))
    .sort((a, b) => compare(a.hash, b.hash));
  const common = (a: string, b: string) => {
    let length = 0;
    while (length < Math.min(a.length, b.length) && a[length] === b[length]) length++;
    return length;
  };
  return new Map(entries.map((entry, index) => {
    const before = entries[index - 1];
    const after = entries[index + 1];
    const length = Math.max(8, before ? common(entry.hash, before.hash) + 1 : 0,
      after ? common(entry.hash, after.hash) + 1 : 0);
    if (!/^[a-f0-9]{64}$/.test(entry.hash) || length > entry.hash.length) throw new Error('Invalid or colliding entity record keys');
    return [entry.id, `${kind}-${entry.hash.slice(0, length)}`];
  }));
}

import { createHash } from 'node:crypto';
import type { RecordId, SnapshotId } from './records.js';

/** Bump the responsible method whenever its analysis/identity/projection semantics change. */
export const methods = {
  inputs: 'postcode/observed-inputs@0',
  records: 'postcode/program-records@6',
  discovery: 'postcode/typescript-modules@4',
  evaluation: 'postcode/evaluate-modules@1',
  projection: 'postcode/projection@3',
  expansions: 'postcode/typescript-expansions@0',
  presentation: 'postcode/presentation@8',
  handles: 'postcode/module-handles@3',
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
    if (!/^[a-f0-9]{64}$/.test(entry.hash) || length > entry.hash.length) throw new Error('Invalid or colliding module record keys');
    return [entry.id, `module-${entry.hash.slice(0, length)}`];
  }));
}

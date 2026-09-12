import { createHash } from 'node:crypto';
import type { RecordId, SnapshotId } from './records.js';

/** Bump the responsible method whenever its analysis/identity/projection semantics change. */
export const methods = {
  inputs: 'postcode/observed-inputs@0',
  records: 'postcode/program-records@1',
  discovery: 'postcode/typescript-modules@2',
  evaluation: 'postcode/evaluate-modules@1',
  projection: 'postcode/projection@1',
  expansions: 'postcode/typescript-expansions@0',
  presentation: 'postcode/presentation@0',
  handles: 'postcode/module-handles@0',
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

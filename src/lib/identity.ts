import { createHash, randomUUID } from 'node:crypto';
import type { RecordId, SessionId } from './records.js';

/** Bump the responsible method whenever its analysis/identity/projection semantics change. */
export const methods = {
  inputs: 'postcode/observed-inputs@3',
  records: 'postcode/program-records@18',
  discovery: 'postcode/typescript-modules@11',
  evaluation: 'postcode/evaluate-modules@4',
  dependencies: 'postcode/typescript-dependencies@2',
  dependencyEvaluation: 'postcode/evaluate-dependencies@2',
  dependencyProjection: 'postcode/dependency-projection@2',
  composition: 'postcode/typescript-composition@1',
  dependencyOrganization: 'postcode/dependency-organization@1',
  projection: 'postcode/projection@8',
  expansions: 'postcode/typescript-expansions@2',
  presentation: 'postcode/presentation@22',
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
export function sessionId(): SessionId {
  return `session:${randomUUID()}` as SessionId;
}
export function recordId(session: SessionId, kind: string, key: unknown): RecordId {
  // Reference spelling must not randomize semantic ordering of derived records.
  const localKey = canonical(key).replaceAll(session, 'session');
  return `${session}:${kind}:${createHash('sha256').update(localKey).digest('hex')}` as RecordId;
}

/** Allocations are append-only: extending the population cannot steal a spelling. */
export class EntityBindings {
  readonly #bindings = new Map<RecordId, string>();
  readonly #owners = new Map<string, RecordId>();

  allocate(ids: readonly RecordId[], kind: 'module' | 'group'): ReadonlyMap<RecordId, string> {
    for (const id of [...new Set(ids)].sort(compare)) {
      if (this.#bindings.has(id)) continue;
      const hash = id.slice(id.lastIndexOf(':') + 1);
      if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid entity record key');
      let length = 8;
      while (this.#owners.has(`${kind}-${hash.slice(0, length)}`)) {
        if (++length > hash.length) throw new Error('Colliding entity record keys');
      }
      const reference = `${kind}-${hash.slice(0, length)}`;
      this.#bindings.set(id, reference);
      this.#owners.set(reference, id);
    }
    return new Map(ids.map(id => [id, this.#bindings.get(id)!]));
  }
}

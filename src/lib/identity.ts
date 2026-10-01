import { createHash, randomUUID } from 'node:crypto';
import type { RecordId, SessionId } from './records.js';

/** Bump the responsible method whenever its analysis/identity/projection semantics change. */
export const methods = {
  inputs: 'postcode/observed-inputs@6',
  records: 'postcode/program-records@21',
  content: 'postcode/subject-content@1',
  investigation: 'postcode/investigation@9',
  investigationEvaluation: 'postcode/investigation-evaluation@2',
  investigationPresentation: 'postcode/investigation-presentation@7',
  discovery: 'postcode/typescript-modules@12',
  evaluation: 'postcode/evaluate-modules@5',
  dependencies: 'postcode/typescript-dependencies@2',
  dependencyEvaluation: 'postcode/evaluate-dependencies@2',
  dependencyProjection: 'postcode/dependency-projection@3',
  composition: 'postcode/typescript-composition@1',
  dependencyOrganization: 'postcode/dependency-organization@1',
  projection: 'postcode/projection@9',
  expansions: 'postcode/typescript-expansions@2',
  presentation: 'postcode/presentation@26',
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
  // Callers identify reference positions; all ordinary strings remain literal.
  const localKey = canonical(key);
  return `${session}:${kind}:${createHash('sha256').update(localKey).digest('hex')}` as RecordId;
}

/** Use only at a known reference position in an identity key. Foreign namespaces remain literal. */
export function identityReference(session: SessionId, reference: RecordId | SessionId | null): string | null {
  return reference === session ? 'session' : reference?.startsWith(`${session}:`)
    ? `session${reference.slice(session.length)}` : reference;
}

/** Allocations are append-only: extending the population cannot steal a spelling. */
export class EntityBindings {
  readonly #bindings = new Map<RecordId, string>();
  readonly #owners = new Map<string, RecordId>();

  allocate(ids: readonly RecordId[], kind: 'module' | 'group' | 'investigram'): ReadonlyMap<RecordId, string> {
    return this.prepare(ids, kind)();
  }

  /** Validate a batch without publishing bindings; the store commits all sessions together. */
  prepare(ids: readonly RecordId[], kind: 'module' | 'group' | 'investigram'): () => ReadonlyMap<RecordId, string> {
    const additions = new Map<RecordId, string>();
    const owners = new Set<string>();
    for (const id of [...new Set(ids)].sort(compare)) {
      if (this.#bindings.has(id)) continue;
      const hash = id.slice(id.lastIndexOf(':') + 1);
      if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid entity record key');
      let length = 8;
      while (this.#owners.has(`${kind}-${hash.slice(0, length)}`) || owners.has(`${kind}-${hash.slice(0, length)}`)) {
        if (++length > hash.length) throw new Error('Colliding entity record keys');
      }
      const reference = `${kind}-${hash.slice(0, length)}`;
      additions.set(id, reference);
      owners.add(reference);
    }
    return () => {
      for (const [id, reference] of additions) {
        const bound = this.#bindings.get(id), owner = this.#owners.get(reference);
        if (bound !== undefined && bound !== reference || owner !== undefined && owner !== id) {
          throw new Error('Entity bindings changed before publication');
        }
      }
      for (const [id, reference] of additions) { this.#bindings.set(id, reference); this.#owners.set(reference, id); }
      return new Map(ids.map(id => [id, this.#bindings.get(id)!]));
    };
  }
}

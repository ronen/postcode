import { createHash, randomUUID } from 'node:crypto';
import type { RecordId, SessionId } from './records.js';

/** Bump the responsible method whenever its analysis/identity/projection semantics change. */
export const methods = {
  inputs: 'postcode/observed-inputs@7',
  records: 'postcode/program-records@25',
  content: 'postcode/subject-content@1',
  exportsProjection: 'postcode/module-exports-projection@4',
  discovery: 'postcode/typescript-modules@13',
  evaluation: 'postcode/evaluate-modules@5',
  dependencies: 'postcode/typescript-dependencies@3',
  dependencyEvaluation: 'postcode/evaluate-dependencies@2',
  dependencyProjection: 'postcode/dependency-projection@10',
  composition: 'postcode/typescript-composition@2',
  dependencyOrganization: 'postcode/dependency-organization@2',
  projection: 'postcode/projection@14',
  expansions: 'postcode/typescript-expansions@3',
  handles: 'postcode/module-handles@5',
  organization: 'postcode/organization@3',
  contributions: 'postcode/contributions@2',
  contributionStatus: 'postcode/contribution-status@1',
  moduleIdentificationPolicy: 'postcode/module-identification-policy@1',
  nativeFindingPolicy: 'postcode/native-finding-policy@1',
  moduleExportsPolicy: 'postcode/module-exports-policy@1',
  contributionProjection: 'postcode/contribution-projection@8',
  contributionInspection: 'postcode/contribution-inspection@2',
  contributionDialog: 'postcode/contribution-dialog@14',
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

import type { ContributionLedger } from './ledger.js';
import { canonical, identityReference } from '../identity.js';
import type { ProgramRecord, ProgramRecordStore, RecordId, SessionId } from '../records.js';
import type { EntityId, NativeIdentity } from './model.js';

/** Provider-owned identity of a retained native Entity record, shared by both mapping directions. */
export function nativeIdentity(value: Extract<ProgramRecord, { kind: 'module' | 'symbol' | 'group' }>): NativeIdentity {
  return {
    provider: value.kind === 'group' ? 'repository-layout' : 'typescript', rule: value.method,
    scope: value.kind === 'group' ? 'captured-repository' : 'configured-project', key: identityReference(value.session, value.id)!,
  };
}

/** Host-only credentials for built-in provider adapters; never part of a contribution or delivery. */
export const programProviderIdentityAuthority = Symbol('Host TypeScript and repository-layout identity adapters');

type NativeEntity = Extract<ProgramRecord, { kind: 'module' | 'symbol' | 'group' }>;
/** A key locates a candidate only; callers must establish identity correspondence separately. */
export function nativeRecordCandidate(store: ProgramRecordStore, session: SessionId, key: string): NativeEntity | undefined {
  if (!/^session:(module|symbol|group):/.test(key)) return undefined;
  const value = store.lookup(`${session}${key.slice('session'.length)}` as RecordId);
  return value?.session === session && (value.kind === 'module' || value.kind === 'symbol' || value.kind === 'group') ? value : undefined;
}
/** Built-in namespace authority additionally requires the exact host-retained provider identity. */
export function authorizesNativeIdentity(store: ProgramRecordStore, session: SessionId, authority: unknown, native: NativeIdentity): boolean {
  const value = nativeRecordCandidate(store, session, native.key);
  return value !== undefined && authority === programProviderIdentityAuthority
    && canonical(native) === canonical(nativeIdentity(value));
}

/** Forward lookup never treats an incompatible native mapping as the provider's Entity. */
export function nativeRecordEntity(ledger: ContributionLedger, value: NativeEntity): EntityId | undefined {
  if (value.session !== ledger.session) return undefined;
  const id = ledger.native(nativeIdentity(value));
  if (!id) return undefined;
  const entity = ledger.entity(id);
  return entity.entityKind === value.kind && entity.modality === 'implemented' ? id : undefined;
}

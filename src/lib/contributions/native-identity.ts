import { identityReference } from '../identity.js';
import type { ProgramRecord } from '../records.js';
import type { NativeIdentity } from './model.js';

/** Provider-owned identity of a retained native Entity record, shared by both mapping directions. */
export function nativeIdentity(value: Extract<ProgramRecord, { kind: 'module' | 'symbol' | 'group' }>): NativeIdentity {
  return {
    provider: value.kind === 'group' ? 'repository-layout' : 'typescript', rule: value.method,
    scope: value.kind === 'group' ? 'captured-repository' : 'configured-project', key: identityReference(value.session, value.id)!,
  };
}

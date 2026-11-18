import { digest, identityReference, methods, recordId } from '../identity.js';
import type { ClaimContextRecord, ProgramRecord, ProgramRecordStore, RecordId, SessionId } from '../records.js';
import { moduleNativeIdentity, sessionLedger } from './modules.js';
import type { EntityId, ItemAddress, NativeIdentity, SubmittedInvestigram } from './model.js';
import type { ProductionHandle } from './production.js';
import { isNativeFinding } from './native-contract.js';

type NativeEntity = Extract<ProgramRecord, { kind: 'module' | 'symbol' | 'group' }>;
export function nativeIdentity(value: NativeEntity): NativeIdentity {
  return value.kind === 'module' ? moduleNativeIdentity(value) : {
    provider: value.kind === 'group' ? 'repository-layout' : 'typescript', rule: value.method,
    scope: value.kind === 'group' ? 'captured-repository' : 'configured-project', key: identityReference(value.session, value.id)!,
  };
}
export function nativeEntity(store: ProgramRecordStore, id: RecordId): EntityId | undefined {
  const value = store.get(id);
  return value.kind === 'module' || value.kind === 'symbol' || value.kind === 'group'
    ? sessionLedger(store, value.session).native(nativeIdentity(value)) : undefined;
}
/** Derived providers retain attempt-specific support records. Equality uses their statement,
 * actual qualification and fixed input population, not incidental evaluation record identity. */
export function nativeFindingKey(store: ProgramRecordStore, id: RecordId): string {
  const value = store.get(id), ref = (id: RecordId | null) => identityReference(value.session, id);
  if (value.kind !== 'claim' || !['module-placement', 'group-properties', 'dependency-organization'].includes(value.information.type)) {
    return `native-finding ${ref(id)}`;
  }
  const own = store.get(value.context);
  if (own.kind !== 'claim-context') throw new Error('Expected native Claim context');
  const qualification = { method: own.method, scope: own.scope === 'configured-project' ? own.scope : ref(own.scope),
    evidence: own.evidence.map(ref), status: own.status, guarantee: own.guarantee, limitations: own.limitations, diagnostics: own.diagnostics };
  let statement: unknown;
  const info = value.information;
  if (info.type === 'module-placement') statement = { ...info, groups: info.groups.map(ref), candidates: info.candidates.map(ref), artifacts: info.artifacts.map(ref) };
  if (info.type === 'group-properties') {
    const evaluation = store.get(info.evaluation);
    if (evaluation.kind !== 'organization-evaluation') throw new Error('Expected property evaluation');
    const modules = store.get(evaluation.moduleEvaluation);
    if (modules.kind !== 'evaluation') throw new Error('Expected property module population');
    const { evaluation: _evaluation, ...properties } = info;
    statement = { ...properties, population: modules.modules.map(ref), placement: evaluation.placement };
  }
  if (info.type === 'dependency-organization') {
    const endpoint = (value: typeof info.occurrences[number]['source']) => ({ ...value, groups: value.groups.map(ref),
      candidates: value.candidates.map(ref), artifacts: value.artifacts.map(ref), evidence: value.evidence.map(ref),
      claims: value.claims.map(id => nativeFindingKey(store, id)) });
    statement = { type: info.type, scheme: info.scheme, classification: info.classification, occurrences: info.occurrences.map(occurrence => ({
      ...occurrence, occurrence: ref(occurrence.occurrence), source: endpoint(occurrence.source), target: endpoint(occurrence.target),
      pairs: occurrence.pairs.map(pair => ({ ...pair, source: ref(pair.source), target: ref(pair.target), commonAncestors: pair.commonAncestors.map(ref), containment: pair.containment.map(ref) })),
    })) };
  }
  return `native-finding ${digest({ method: value.method, subject: ref(value.subject), statement, qualification })}`;
}

/** Explicit participants in a provider statement, without identifying a relationship as an Entity. */
function referents(store: ProgramRecordStore, value: ProgramRecord): readonly RecordId[] {
  const ids: RecordId[] = [];
  if (value.kind === 'claim') {
    ids.push(value.subject);
    const info = value.information;
    if (info.type === 'export') ids.push(...[info.symbol, info.origin, ...info.routes.map(route => route.via)].filter((id): id is RecordId => id !== null));
    if (info.type === 'dependency' || info.type === 'group-containment') ids.push(info.child);
    if (info.type === 'module-placement') ids.push(...info.groups, ...info.candidates);
    if (info.type === 'documentation-association' || info.type === 'dependency-organization') {
      ids.push(...referents(store, store.get(value.subject)));
    }
    if (info.type === 'dependency-organization') for (const occurrence of info.occurrences) {
      ids.push(...occurrence.source.groups, ...occurrence.source.candidates, ...occurrence.target.groups, ...occurrence.target.candidates);
    }
  }
  if (value.kind === 'dependency-occurrence') ids.push(value.owner, ...(value.target ? [value.target] : []));
  if (value.kind === 'dependency-coverage' && value.owner) ids.push(value.owner);
  return [...new Set(ids)].filter(id => { const item = store.get(id); return item.kind === 'module' || item.kind === 'symbol' || item.kind === 'group'; });
}

/** Exact correspondence, including the identifying findings already migrated in M2. No delivery. */
export function nativeItem(store: ProgramRecordStore, id: RecordId): ItemAddress | undefined {
  const value = store.get(id), ledger = sessionLedger(store, value.session);
  if (value.kind === 'module' || value.kind === 'symbol' || value.kind === 'group') return nativeItem(store, value.claim);
  const module = value.kind === 'claim' && value.information.type === 'module';
  const owner = ledger.established(module ? `module-identification ${identityReference(value.session, id)}` : nativeFindingKey(store, id));
  return owner ? { investigram: owner, item: module ? 'identification' : 'finding' } : undefined;
}

/** Find the provider's explicit semantic support, without enumerating unrelated stored findings. */
export function nativeFindingRecords(store: ProgramRecordStore, ids: readonly RecordId[]): readonly ProgramRecord[] {
  const found = new Map<RecordId, ProgramRecord>();
  const visit = (id: RecordId) => {
    if (found.has(id)) return;
    const value = store.get(id);
    if (value.kind === 'module' || value.kind === 'symbol' || value.kind === 'group') { visit(value.claim); return; }
    if (!isNativeFinding(value)) return;
    found.set(id, value);
    if (value.kind === 'claim') {
      const info = value.information;
      if (info.type === 'export') { if (info.symbol) visit(info.symbol); if (info.origin) visit(info.origin); }
      if (info.type === 'documentation-association') { visit(value.subject); visit(info.assertion); }
      if (info.type === 'dependency') { visit(value.subject); visit(info.child); info.occurrences.forEach(visit); }
      if (info.type === 'group-containment') { visit(value.subject); visit(info.child); }
      if (info.type === 'module-placement') { visit(value.subject); [...info.groups, ...info.candidates].forEach(visit); }
    }
    if (value.kind === 'dependency-occurrence') { visit(value.owner); if (value.target) visit(value.target); }
  };
  ids.forEach(visit);
  return [...found.values()];
}

/**
 * Retain exact provider statements once, with separately attributed deterministic uses.
 * Caller-supplied input records name actual retained inputs to a deriving producer. Compiler
 * findings independently obtained from source supply no such list. Fixed input is not an
 * acquired evolving inventory and a recomputation never renews a displaced use.
 */
export function contributeNativeFindings(store: ProgramRecordStore, session: SessionId, ids: readonly RecordId[],
  inputs: readonly RecordId[] = []): void {
  const ledger = sessionLedger(store, session);
  const pending = nativeFindingRecords(store, ids).filter(value => !nativeItem(store, value.id));
  if (!pending.length) return;
  const key = (id: RecordId) => nativeFindingKey(store, id);
  const localEntity = (id: RecordId) => `native ${identityReference(session, id)}`;
  const context = (value: ProgramRecord): ClaimContextRecord => {
    if (!('context' in value)) throw new Error('Native finding has no Claim context');
    const result = store.get(value.context);
    if (result.kind !== 'claim-context') throw new Error('Expected native Claim context');
    return result;
  };
  const inputItems = [...new Map(nativeFindingRecords(store, inputs).flatMap(value => {
    const item = nativeItem(store, value.id);
    return item ? [[JSON.stringify(item), item] as const] : [];
  })).values()];
  const productions = new Map<string, { production: ProductionHandle; investigrams: SubmittedInvestigram[] }>();
  const batch = (method: string) => {
    let found = productions.get(method);
    if (!found) {
      const production = ledger.begin({ producer: { mechanism: 'mechanical', method, agent: null },
        id: recordId(session, 'production', ['native-findings', method, pending.map(value => identityReference(session, value.id))]) });
      inputItems.forEach(item => production.item(item));
      production.supplied(inputs);
      found = { production, investigrams: [] }; productions.set(method, found);
    }
    return found;
  };
  const targetEntity = (id: RecordId): EntityId | { local: string } | undefined => {
    const value = store.get(id);
    if (value.kind !== 'module' && value.kind !== 'symbol' && value.kind !== 'group') return undefined;
    return nativeEntity(store, id) ?? { local: localEntity(id) };
  };
  const organizing: SubmittedInvestigram[] = [];
  for (const value of pending) {
    const own = context(value), producer = batch(own.method);
    producer.production.supplied([value.id, own.id, ...own.evidence]);
    const identification = value.kind === 'claim' && (value.information.type === 'symbol' || value.information.type === 'group');
    const subject = value.kind === 'claim' ? value.subject : value.kind === 'dependency-occurrence' || value.kind === 'dependency-coverage' ? value.owner : null;
    const entity = subject ? targetEntity(subject) : undefined;
    const native = identification ? store.get(value.subject) as NativeEntity : null;
    const item: SubmittedInvestigram = { key: key(value.id), providerKey: key(value.id),
      ...(native && !nativeEntity(store, native.id) ? { entities: [{ key: localEntity(native.id), entityKind: native.kind, native: nativeIdentity(native) }] } : {}),
      items: [{ key: 'finding', type: 'native-finding', body: { record: value.id, finding: value }, evidence: [value.id],
        referents: referents(store, value).map(id => targetEntity(id)!), qualification: {
          status: value.kind === 'recorded-assertion' ? 'recorded-assertion' : 'mechanically-derived',
          scope: own.scope === 'configured-project' ? own.scope : identityReference(session, own.scope),
          guarantee: own.guarantee, limitations: own.limitations, contexts: [own.id],
        } }],
    };
    producer.investigrams.push(item);
    if (entity) organizing.push({ key: `use ${key(value.id)}`, providerKey: `use ${key(value.id)}`,
      qualification: { status: 'organizing-policy', limitations: ['Deterministic wrapper use of a provider finding about its explicit subject; this organizing use adds no provider guarantee.'] },
      declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity,
        ...(identification ? { role: 'identification' as const } : { role: 'topic' as const, topic: value.kind === 'claim' ? value.information.type : value.kind }) },
      members: [{ kind: 'item', item: { investigram: { local: key(value.id) }, item: 'finding' } }] }] });
  }
  const policy = organizing.length ? ledger.begin({ producer: { mechanism: 'mechanical', method: methods.nativeFindingPolicy, agent: null },
    id: recordId(session, 'production', [methods.nativeFindingPolicy, pending.map(value => identityReference(session, value.id))]) }) : null;
  ledger.accept([...productions.values()].map(value => ({ production: value.production, contribution: { investigrams: value.investigrams } }))
    .concat(policy ? [{ production: policy, contribution: { investigrams: organizing } }] : []));
}

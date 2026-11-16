import { identityReference, methods, recordId } from '../identity.js';
import type { ClaimContextRecord, EvaluationRecord, ModuleClaim, ModuleRecord, ProgramRecordStore, RecordId, SessionId } from '../records.js';
import { ContentCatalog, identificationContract, proseContract, record, text } from './catalog.js';
import type { ContentTypeContract, IdentifyingName } from './catalog.js';
import { ContributionLedger } from './ledger.js';
import { InvalidContribution } from './model.js';
import type { EntityId, NativeIdentity, SubmittedInvestigram } from './model.js';

/**
 * The module discovery method's identifying finding for one module: its name where the
 * language establishes one, and its generated navigation handle. The retained module claim
 * record remains the finding's full statement; this item identifies and references it.
 */
export const moduleIdentificationContract: ContentTypeContract = {
  type: 'module-identification', method: 'postcode/content-module-identification@1',
  meaning: 'A module as identified by module discovery: its established name, or honest anonymity, and its generated handle.',
  accept(body) {
    const value = record(body, ['claim', 'name', 'handle', 'handleProvenance'], 'module identification');
    if (value.name !== null && typeof value.name !== 'string') throw new InvalidContribution('Expected a module name or explicit anonymity.');
    return { body: { claim: text(value.claim, 'module claim reference'), name: value.name, handle: text(value.handle, 'module handle'),
      handleProvenance: text(value.handleProvenance, 'handle provenance') }, entities: [], content: [], components: [] };
  },
  identifying(body) {
    const value = body as { name: string | null; handle: string };
    const names: IdentifyingName[] = value.name === null ? [] : [{ text: value.name, origin: 'system-under-study' }];
    return value.handle === value.name ? names : [...names, { text: value.handle, origin: 'generated-handle' }];
  },
};

const ledgers = new WeakMap<ProgramRecordStore, Map<SessionId, ContributionLedger>>();
/**
 * The contribution ledger of a Session, paired with its program record store. Both are
 * released together when the Session's retained state is released; neither outlives the other.
 */
export function sessionLedger(store: ProgramRecordStore, session: SessionId): ContributionLedger {
  let bySession = ledgers.get(store);
  if (!bySession) { bySession = new Map(); ledgers.set(store, bySession); }
  let ledger = bySession.get(session);
  if (!ledger) {
    ledger = new ContributionLedger({ session, catalog: new ContentCatalog([proseContract, identificationContract, moduleIdentificationContract]),
      resolvesRecord: id => store.lookup(id)?.session === session,
      qualifiesContext: (id, producer) => { const context = store.lookup(id); return context?.kind === 'claim-context' && context.session === session && context.method === producer.method; } });
    bySession.set(session, ledger);
  }
  return ledger;
}

/** The native identity of a discovered module: the discovery method's own module identity, within the configured project. */
export function moduleNativeIdentity(module: ModuleRecord): NativeIdentity {
  return { provider: 'typescript', rule: module.method, scope: 'configured-project', key: identityReference(module.session, module.id)! };
}
/** The one common Entity of a module record, once its identification has been contributed. Host identity bookkeeping; no exposure. */
export function moduleEntity(store: ProgramRecordStore, module: RecordId): EntityId | undefined {
  const value = store.lookup(module);
  return value?.kind === 'module' ? sessionLedger(store, value.session).native(moduleNativeIdentity(value)) : undefined;
}
/** The module record a common Entity was mapped from, if it is a discovered module. */
export function entityModule(store: ProgramRecordStore, session: SessionId, entity: EntityId): RecordId | undefined {
  const native = sessionLedger(store, session).entity(entity).native;
  if (native?.provider !== 'typescript' || !native.key.startsWith('session:module:')) return undefined;
  const id = `${session}${native.key.slice('session'.length)}` as RecordId;
  return store.lookup(id)?.kind === 'module' ? id : undefined;
}

/**
 * Contribute the identifying findings of a module evaluation. Each module's finding is
 * contributed once: an equivalent recomputation recognizes the established contribution and
 * adds nothing, so a withdrawn identification is never silently renewed. The finding and the
 * deterministic organizing policy that uses it as the module's identification are separately
 * attributed productions in one atomic pool.
 */
export function contributeModuleIdentifications(store: ProgramRecordStore, evaluation: EvaluationRecord): void {
  const session = evaluation.session, ledger = sessionLedger(store, session);
  const reference = (id: RecordId) => identityReference(session, id)!;
  const pending = evaluation.modules.flatMap(id => {
    const module = store.get(id);
    if (module.kind !== 'module') throw new Error('Expected module record');
    const claim = store.get(module.claim) as ModuleClaim, context = store.get(claim.context) as ClaimContextRecord;
    const providerKey = `module-identification ${reference(claim.id)}`;
    return ledger.established(providerKey) ? [] : [{ module, claim, context, providerKey, key: `module ${reference(module.id)}` }];
  });
  if (!pending.length) return;
  // A provider reports one discovery method per Session; group defensively so each finding keeps its own method.
  for (const method of [...new Set(pending.map(item => item.module.method))]) {
    const items = pending.filter(item => item.module.method === method);
    // Each production is identified by what it did, not by a random value: one per method and establishing evaluation.
    const production = (producer: string) => recordId(session, 'production', [producer, 'module-identification', method, reference(evaluation.id)]);
    const finder = ledger.begin({ producer: { mechanism: 'mechanical', method, agent: null }, id: production(method) });
    finder.supplied(items.flatMap(item => [item.claim.id, item.context.id]));
    const policy = ledger.begin({ producer: { mechanism: 'mechanical', method: methods.moduleIdentificationPolicy, agent: null }, id: production(methods.moduleIdentificationPolicy) });
    const findings: SubmittedInvestigram[] = items.map(({ module, claim, context, providerKey, key }) => ({ key, providerKey,
      entities: [{ key, entityKind: 'module', native: moduleNativeIdentity(module) }],
      items: [{ key: 'identification', type: moduleIdentificationContract.type, referents: [{ local: key }], evidence: [claim.id],
        body: { claim: claim.id, name: claim.information.name, handle: claim.information.handle, handleProvenance: claim.information.handleProvenance },
        qualification: { status: context.status, scope: context.scope === 'configured-project' ? context.scope : reference(context.scope),
          guarantee: context.guarantee, limitations: context.limitations, contexts: [context.id] } }] }));
    ledger.accept([
      { production: finder, contribution: { investigrams: findings } },
      { production: policy, contribution: { investigrams: [{ key: `identification-policy ${method}`,
        qualification: { status: 'organizing-policy', limitations: ['Deterministic wrapper policy: a module discovery finding is used as the identification of the module it was discovered as. This is an organizing use, not a further finding about the module.'] },
        declarations: items.map(({ key }) => ({ key, operation: 'add' as const, target: { kind: 'entity' as const, entity: { local: key }, role: 'identification' as const },
          members: [{ kind: 'item' as const, item: { investigram: { local: key }, item: 'identification' } }] })) }] } },
    ]);
  }
}

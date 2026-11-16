import { canonical, identityReference, methods, recordId } from '../identity.js';
import type { ClaimContextRecord, EvaluationRecord, ExportClaim, ModuleClaim, ModuleRecord, ProgramRecordStore, RecordId, SessionId } from '../records.js';
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
    ledger = new ContributionLedger({ session, catalog: new ContentCatalog([proseContract, identificationContract, moduleIdentificationContract, moduleExportsContract]),
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

/** The export method's finding for one module under one evaluation state: its export claims, or an explicit non-established surface. */
export const moduleExportsContract: ContentTypeContract = {
  type: 'module-exports', method: 'postcode/content-module-exports@1',
  meaning: 'The effective exports established for a module by the export method, with the evaluation state that says whether the listing is complete. An empty listing establishes no exports only when materialization is full.',
  accept(body) {
    const value = record(body, ['exports', 'applicability', 'availability', 'execution', 'materialization', 'reason'], 'module exports');
    if (!Array.isArray(value.exports) || (value.reason !== null && typeof value.reason !== 'string')) throw new InvalidContribution('Expected export claim references and an evaluation reason.');
    return { body: { exports: value.exports.map(item => text(item, 'export claim reference')), applicability: text(value.applicability, 'applicability'),
      availability: text(value.availability, 'availability'), execution: text(value.execution, 'execution'), materialization: text(value.materialization, 'materialization'),
      reason: value.reason }, entities: [], content: [], components: [] };
  },
};

interface Finding {
  readonly module: ModuleRecord;
  readonly method: string;
  readonly providerKey: string;
  readonly policyKey: string;
  readonly policyMethod: string;
  readonly policyStatement: string;
  readonly target: { readonly role: 'identification' } | { readonly role: 'topic'; readonly topic: string };
  readonly item: { readonly key: string; readonly type: string; readonly body: unknown; readonly evidence: readonly RecordId[];
    readonly qualification: { readonly status: 'mechanically-derived'; readonly scope: string | null; readonly guarantee: string | null; readonly limitations: readonly string[]; readonly contexts: readonly RecordId[] } };
}

/**
 * Accept provider findings not yet established, each with the deterministic organizing use of it.
 * A finding and the policy that uses it are separately attributed productions in one atomic pool.
 * Both contributions are identified by their provider key, never by which evaluation arrived first.
 */
function contribute(store: ProgramRecordStore, session: SessionId, purpose: string, findings: readonly Finding[], basis: RecordId): void {
  const ledger = sessionLedger(store, session);
  const pending = findings.filter(item => !ledger.established(item.providerKey));
  if (!pending.length) return;
  const reference = (id: RecordId) => identityReference(session, id)!;
  // A provider reports one method per requirement and Session; group defensively so each finding keeps its own method.
  for (const method of [...new Set(pending.map(item => item.method))]) {
    const items = pending.filter(item => item.method === method), policyMethod = items[0]!.policyMethod;
    const production = (producer: string) => recordId(session, 'production', [producer, purpose, method, reference(basis)]);
    const finder = ledger.begin({ producer: { mechanism: 'mechanical', method, agent: null }, id: production(method) });
    finder.supplied(items.flatMap(item => [...item.item.evidence, ...item.item.qualification.contexts]));
    const policy = ledger.begin({ producer: { mechanism: 'mechanical', method: policyMethod, agent: null }, id: production(policyMethod) });
    const entity = (module: ModuleRecord) => `module ${reference(module.id)}`;
    ledger.accept([
      { production: finder, contribution: { investigrams: items.map((item): SubmittedInvestigram => ({ key: item.providerKey, providerKey: item.providerKey,
        entities: [{ key: entity(item.module), entityKind: 'module', native: moduleNativeIdentity(item.module) }],
        items: [{ ...item.item, referents: [{ local: entity(item.module) }] }] })) } },
      { production: policy, contribution: { investigrams: items.map((item): SubmittedInvestigram => ({ key: item.policyKey, providerKey: item.policyKey,
        qualification: { status: 'organizing-policy', limitations: [item.policyStatement] },
        declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity: { local: entity(item.module) }, ...item.target },
          members: [{ kind: 'item', item: { investigram: { local: item.providerKey }, item: item.item.key } }] }] })) } },
    ]);
  }
}

/** The provider key of the export finding for a module under one expansion outcome: its claims and evaluation state, not the attempt that produced them. */
export function moduleExportsKey(store: ProgramRecordStore, module: RecordId, outcome: EvaluationRecord): string {
  const reference = (id: RecordId) => identityReference(outcome.session, id)!;
  const claims = exportClaims(store, module, outcome).map(claim => reference(claim.id));
  return `module-exports ${reference(module)} ${canonical([claims, outcome.applicability, outcome.availability, outcome.execution, outcome.materialization, outcome.reason])}`;
}
function exportClaims(store: ProgramRecordStore, module: RecordId, outcome: EvaluationRecord): readonly ExportClaim[] {
  return (outcome.claims ?? []).map(id => store.get(id)).filter((claim): claim is ExportClaim => claim.kind === 'claim' && claim.information.type === 'export' && claim.subject === module);
}

/**
 * Contribute the findings of a newly recorded module evaluation: each module's identifying
 * finding, and each module's export finding for every export expansion outcome it carries.
 * Each finding is contributed once. An equivalent recomputation recognizes the established
 * contribution and adds nothing, so a withdrawn use is never silently renewed. The provider
 * analysed source independently; mapping its native identities onto common Entities delivers nothing.
 */
export function contributeModuleFindings(store: ProgramRecordStore, evaluation: EvaluationRecord): void {
  const session = evaluation.session;
  const reference = (id: RecordId) => identityReference(session, id)!;
  const moduleRecord = (id: RecordId) => { const module = store.get(id); if (module.kind !== 'module') throw new Error('Expected module record'); return module; };
  contribute(store, session, 'module-identification', evaluation.modules.map((id): Finding => {
    const module = moduleRecord(id), claim = store.get(module.claim) as ModuleClaim, context = store.get(claim.context) as ClaimContextRecord;
    return { module, method: module.method, providerKey: `module-identification ${reference(claim.id)}`, policyKey: `module-identification-policy ${reference(claim.id)}`,
      policyMethod: methods.moduleIdentificationPolicy, target: { role: 'identification' },
      policyStatement: 'Deterministic wrapper policy: a module discovery finding is used as the identification of the module it was discovered as. This is an organizing use, not a further finding about the module.',
      item: { key: 'identification', type: moduleIdentificationContract.type, evidence: [claim.id],
        body: { claim: claim.id, name: claim.information.name, handle: claim.information.handle, handleProvenance: claim.information.handleProvenance },
        qualification: { status: context.status, scope: context.scope === 'configured-project' ? context.scope : reference(context.scope),
          guarantee: context.guarantee, limitations: context.limitations, contexts: [context.id] } } };
  }), evaluation.id);
  // Export outcomes are scoped per module; their findings are one provider pass and are accepted together.
  contribute(store, session, 'module-exports', store.evaluations(session).filter(outcome => outcome.basis === evaluation.id && outcome.requirement === 'exports')
    .flatMap(outcome => outcome.modules.map((id): Finding => {
      const module = moduleRecord(id), claims = exportClaims(store, id, outcome);
      const contexts = outcome.contexts.map(context => store.get(context)).filter((context): context is ClaimContextRecord => context.kind === 'claim-context');
      const method = claims[0]?.method ?? contexts[0]?.method ?? methods.expansions;
      const own = contexts.filter(context => context.method === method && (context.scope === id || context.scope === 'configured-project'));
      const key = moduleExportsKey(store, id, outcome);
      return { module, method, providerKey: key, policyKey: `module-exports-policy ${key}`, policyMethod: methods.moduleExportsPolicy, target: { role: 'topic', topic: 'exports' },
        policyStatement: 'Deterministic wrapper policy: an export finding is used as information about the exports of the module it was established for. This is an organizing use, not a further finding about the module.',
        item: { key: 'exports', type: moduleExportsContract.type, evidence: claims.map(claim => claim.id),
          body: { exports: claims.map(claim => claim.id), applicability: outcome.applicability, availability: outcome.availability, execution: outcome.execution,
            materialization: outcome.materialization, reason: outcome.reason },
          qualification: { status: 'mechanically-derived', scope: reference(id), guarantee: null,
            limitations: [`Export evaluation: ${outcome.applicability}, ${outcome.availability}, ${outcome.execution}, materialization ${outcome.materialization}${outcome.reason ? `; ${outcome.reason}` : ''}. An empty listing establishes no exports only when materialization is full.`],
            contexts: own.map(context => context.id) } } };
    })), evaluation.id);
}

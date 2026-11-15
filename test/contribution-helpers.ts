import assert from 'node:assert/strict';
import { ContentCatalog, identificationContract, proseContract, record, text } from '../src/lib/contributions/catalog.js';
import type { ContentTypeContract } from '../src/lib/contributions/catalog.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import type { Acceptance } from '../src/lib/contributions/ledger.js';
import { InvalidContribution } from '../src/lib/contributions/model.js';
import type { AssociationAddress, EntityId, InvestigramId, InvocationId, ItemAddress, Producer, QueryResultId, SubmittedContribution,
  SubmittedInvestigram } from '../src/lib/contributions/model.js';
import type { ProductionHandle } from '../src/lib/contributions/production.js';
import type { RecordId, SessionId } from '../src/lib/records.js';

/** Controlled producers exercise the mechanism; they establish nothing about the truth of an interpretation. */
export const session = 'session:11111111-1111-4111-8111-111111111111' as SessionId;
export const evidenceRecord = `${session}:source-evidence:${'e'.repeat(64)}` as RecordId;

/** A controlled structured type standing in for a specialized form: a list of named entries, possibly established empty. */
export const tableContract: ContentTypeContract = {
  type: 'test-table', method: 'test/content-table@1', meaning: 'Controlled structured content with locally addressable rows.',
  accept(body, resolve) {
    const value = record(body, ['rows', 'about'], 'table');
    if (!Array.isArray(value.rows)) throw new InvalidContribution('Expected rows.');
    const rows = value.rows.map(row => text(row, 'row'));
    const about = value.about === undefined ? [] : [resolve.entity(value.about)];
    return { body: { rows, about: about[0] ?? null }, entities: about, content: [], components: rows };
  },
};

export function createLedger(): ContributionLedger {
  return new ContributionLedger({ session, catalog: new ContentCatalog([proseContract, identificationContract, tableContract]),
    resolvesRecord: id => id === evidenceRecord });
}
export const mechanical = (method = 'test/module-discovery@1'): Producer => ({ mechanism: 'mechanical', method, agent: null });
export const agentic = (model = 'scripted-a', method = 'test/investigation@1'): Producer => ({ mechanism: 'agentic', method, agent: { model } });
export const caveat = { limitations: ['Controlled interpretation; not mechanically established.'] };
export const derived = { status: 'mechanically-derived' as const, guarantee: 'Controlled mechanical finding over the fixture scope.' };

export interface Submitted {
  readonly acceptance: Acceptance;
  readonly handle: ProductionHandle;
  readonly investigram: (key: string) => InvestigramId;
  readonly entity: (key: string) => EntityId;
  readonly item: (investigram: string, item: string) => ItemAddress;
  readonly use: (investigram: string, declaration: string) => AssociationAddress;
}
/** One producing execution: optional acquisitions, then one submitted contribution. */
export function submit(ledger: ContributionLedger, producer: Producer, investigrams: readonly SubmittedInvestigram[] | ((handle: ProductionHandle) => readonly SubmittedInvestigram[]),
  options: { readonly invocation?: InvocationId; readonly report?: SubmittedContribution['report'] } = {}): Submitted {
  const handle = ledger.begin({ producer, invocation: options.invocation ?? null });
  const contribution: SubmittedContribution = { investigrams: typeof investigrams === 'function' ? investigrams(handle) : investigrams,
    ...(options.report ? { report: options.report } : {}) };
  return submitted(ledger.accept([{ production: handle, contribution }]), handle);
}
export function submitted(acceptance: Acceptance, handle: ProductionHandle): Submitted {
  const production = acceptance.productions.find(item => item.production === handle.id);
  assert.ok(production);
  const investigram = (key: string) => production.investigrams[key] ?? assert.fail(`Unknown investigram key ${key}`);
  return { acceptance, handle, investigram, entity: key => production.entities[key] ?? assert.fail(`Unknown entity key ${key}`),
    item: (owner, item) => ({ investigram: investigram(owner), item }), use: (owner, declaration) => ({ investigram: investigram(owner), declaration }) };
}

/** Mechanical discovery of one module Entity with its identifying finding. */
export function discoverModule(ledger: ContributionLedger, name = 'breaker.ts', scope = 'project-1'): Submitted {
  return submit(ledger, mechanical(), [{ key: 'discovery', providerKey: `discovery ${scope} ${name}`, qualification: derived,
    entities: [{ key: 'module', entityKind: 'module', native: { provider: 'typescript', rule: 'source-file', scope, key: name } }],
    items: [{ key: 'name', type: 'identification', body: { name, nameOrigin: 'system-under-study', designation: `Source module ${name}` } }],
    declarations: [{ key: 'identify', operation: 'add', target: { kind: 'entity', entity: { local: 'module' }, role: 'identification' },
      members: [{ kind: 'item', item: { investigram: { local: 'discovery' }, item: 'name' } }] }] }]);
}

export function summaryInvocation(ledger: ContributionLedger, subject: EntityId, resultContract: string | null = null, fresh = false) {
  return ledger.invoke({ operation: 'summarize', subjects: [{ role: null, subject: { kind: 'entity', entity: subject } }], parameters: {}, context: [], resultContract }, { fresh });
}

/** An agentic account of admission behavior, associated with the module and designated for a summary result. */
export function explainAdmission(ledger: ContributionLedger, module: EntityId, result: QueryResultId, invocation: InvocationId,
  options: { readonly key?: string; readonly prepare?: (handle: ProductionHandle) => void; readonly model?: string } = {}): Submitted {
  const key = options.key ?? 'summary';
  return submit(ledger, agentic(options.model), handle => {
    handle.baseline(module);
    options.prepare?.(handle);
    return [{ key, qualification: caveat, referents: [module],
      items: [{ key: 'admission', type: 'prose', body: { text: 'An admitted request starts work immediately.' } }],
      declarations: [
        { key: 'admission', operation: 'add', target: { kind: 'entity', entity: module, role: 'topic', topic: 'admission' },
          members: [{ kind: 'item', item: { investigram: { local: key }, item: 'admission' } }] },
        { key: 'answer', operation: 'add', target: { kind: 'result', result },
          members: [{ kind: 'association', association: { investigram: { local: key }, declaration: 'admission' } }] },
      ] }];
  }, { invocation });
}

export function snapshot(ledger: ContributionLedger): string {
  return JSON.stringify([ledger.position, ledger.entities(), ledger.investigrams(), ledger.productions()]);
}
/** A structurally invalid pool is rejected with nothing retained and the production still open for repair. */
export function rejects(ledger: ContributionLedger, producer: Producer, investigrams: readonly unknown[], message: RegExp,
  prepare?: (handle: ProductionHandle) => void): void {
  const before = snapshot(ledger), handle = ledger.begin({ producer });
  prepare?.(handle);
  assert.throws(() => ledger.accept([{ production: handle, contribution: { investigrams } }]),
    (error: unknown) => error instanceof InvalidContribution && message.test(error.message));
  assert.equal(snapshot(ledger), before);
  assert.equal(handle.closed, false);
}

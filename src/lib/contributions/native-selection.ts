import { compare, identityReference } from '../identity.js';
import type { EvaluationRecord, ProgramRecordStore, RecordId, SessionId } from '../records.js';
import { answerSupport } from './answer-support.js';
import type { AnswerSupport } from './answer-support.js';
import { addressKey, itemKey } from './model.js';
import type { AssociationAddress, EntityId, ItemAddress } from './model.js';
import { moduleExportsKey, sessionLedger } from './modules.js';
import { nativeFindingRecords, nativeItem } from './native.js';
import { answerSupportIdentity } from './support-identity.js';

export interface NativeSelection {
  readonly findings: readonly { readonly record: RecordId | null; readonly item: ItemAddress; readonly uses: readonly AssociationAddress[] }[];
  readonly support: AnswerSupport;
}

/** Method-specific selection: preserve provider findings even when their organizing uses change. */
export function selectNativeContributions(store: ProgramRecordStore, session: SessionId, ids: readonly RecordId[],
  exportOutcomes: readonly EvaluationRecord[] = []): NativeSelection {
  const ledger = sessionLedger(store, session), support = answerSupport(store, ledger);
  const selected = new Map<string, { record: RecordId | null; item: ItemAddress }>();
  for (const record of nativeFindingRecords(store, ids)) {
    const item = nativeItem(store, record.id);
    if (!item) throw new Error(`Expected contributed native finding: ${record.id}`);
    selected.set(itemKey(item), { record: record.id, item });
  }
  for (const outcome of exportOutcomes.filter(outcome => outcome.requirement === 'exports')) {
    for (const module of outcome.modules) {
      const owner = ledger.established(moduleExportsKey(store, module, outcome));
      if (!owner) throw new Error('Expected contributed export outcome');
      const item = { investigram: owner, item: 'exports' };
      selected.set(itemKey(item), { record: null, item });
    }
  }
  const indexed = new Map<EntityId, Map<string, AssociationAddress[]>>();
  const usesFor = (entity: EntityId, item: ItemAddress) => {
    let byItem = indexed.get(entity);
    if (!byItem) {
      byItem = new Map(); indexed.set(entity, byItem);
      for (const entry of ledger.associations({ kind: 'entity', entity, role: 'any' }, 'all')) {
        for (const member of entry.declaration.members) if (member.kind === 'item') {
          const key = itemKey(member.item), uses = byItem.get(key) ?? [];
          uses.push(entry.address); byItem.set(key, uses);
        }
      }
    }
    return byItem.get(itemKey(item)) ?? [];
  };
  const findings = [...selected.values()].sort((a, b) => compare(a.record ?? itemKey(a.item), b.record ?? itemKey(b.item))).map(value => {
    support.item(value.item);
    const item = ledger.item(value.item);
    const uses = item.referents.flatMap(entity => usesFor(entity, value.item)).sort((a, b) => compare(addressKey(a), addressKey(b)));
    uses.forEach(use => support.use(use));
    return { ...value, uses };
  });
  return { findings, support: support.finish() };
}

export function nativeSelectionIdentity(session: SessionId, value: NativeSelection) {
  const ref = (id: RecordId | null) => identityReference(session, id);
  return { findings: value.findings.map(finding => ({ record: ref(finding.record),
    item: { ...finding.item, investigram: ref(finding.item.investigram) },
    uses: finding.uses.map(use => ({ ...use, investigram: ref(use.investigram) })) })), support: answerSupportIdentity(session, value.support) };
}

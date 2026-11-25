import { selectNativeContributions } from '../contributions/native-selection.js';
import { completedMaterialization } from '../evaluation-state.js';
import { freezeOwned } from '../immutable.js';
import { methods, recordId } from '../identity.js';
import { resolveExport } from '../module-content.js';
import type { ExportContent } from '../module-content.js';
import { qualifiedContext, qualifiedRecord } from '../projection-content.js';
import type { QualifiedContext, QualifiedRecord } from '../projection-content.js';
import type { DocumentationAssociationClaim, EvaluationRecord, ExportClaim, ModuleClaim, ProgramRecordStore, RecordId } from '../records.js';
import { moduleEntity, moduleExportsKey, sessionLedger } from '../contributions/modules.js';
import type { AssociationEntry, ContributionLedger } from '../contributions/ledger.js';
import type { ItemAddress } from '../contributions/model.js';
import { answerSupport } from '../contributions/answer-support.js';
import { exportsIdentity } from './records.js';
import type { ExportsContributions, ModuleExportsProjection, UseSnapshot } from './records.js';

export function moduleExports(store: ProgramRecordStore, basis: EvaluationRecord, subjects: readonly RecordId[], lens: string): ModuleExportsProjection {
  if (subjects.length !== 1) throw new Error('Exports require exactly one resolved module');
  const subject = subjects[0]!;
  const entity = store.get(subject), retained = store.get(basis.id);
  if (entity.kind !== 'module' || retained.kind !== 'evaluation' || entity.session !== retained.session || retained.requirement !== 'modules') throw new Error('Invalid exports basis or subject');
  basis = retained;
  // Preserve successful module-population allocations, including a precise outsider.
  const outcomes = store.evaluations(basis.session).filter(item => item.basis === basis.id && item.modules.includes(subject)
    && (item.requirement === 'exports' || item.requirement === 'documentation'));
  const claims = [...new Set(outcomes.flatMap(item => item.claims ?? []))].map(id => store.get(id));
  const exports = claims.filter((item): item is ExportClaim => item.kind === 'claim' && item.information.type === 'export' && item.subject === subject);
  const owners = new Set(exports.flatMap(item => [item.id, ...(item.information.symbol ? [item.information.symbol] : [])]));
  const documentation = claims.filter(item => item.kind === 'claim' && item.information.type === 'documentation-association' && owners.has(item.subject));
  const naming = store.get(entity.claim);
  if (naming.kind !== 'claim' || naming.information.type !== 'module') throw new Error('Expected module naming');
  const contributions = selectContributions(store, entity.id, entity.method, outcomes.find(item => item.requirement === 'exports'));
  const payload: Omit<ModuleExportsProjection, 'id'> = { kind: 'module-exports-projection', method: methods.exportsProjection, session: basis.session,
    lens, subject, parameters: {}, evaluation: basis.id, evaluations: outcomes.map(item => item.id), exports: exports.map(item => item.id),
    documentation: documentation.map(item => item.id), contexts: [...new Set([naming.context, ...basis.contexts, ...outcomes.flatMap(item => item.contexts)])],
    outsidePopulation: !basis.modules.includes(subject), contributions,
    native: selectNativeContributions(store, basis.session, [naming.id, ...exports.map(item => item.id), ...documentation.map(item => item.id)], outcomes.filter(item => item.requirement === 'exports')) };
  const projection = { ...payload, id: recordId(basis.session, payload.kind, exportsIdentity(payload)) };
  store.put([projection]);
  return store.get(projection.id) as ModuleExportsProjection;
}

/** Capture one use of a finding with its standing and displacement grounds as they are now. */
function useSnapshot(ledger: ContributionLedger, support: ReturnType<typeof answerSupport>, entry: AssociationEntry, item: ItemAddress): UseSnapshot {
  const displacements = ledger.standing(entry.address).displacedBy.map(change => {
    support.change(change);
    const declaration = ledger.declaration(change);
    if (declaration.operation === 'add') throw new Error('Expected a displacing declaration');
    return { change, operation: declaration.operation, grounds: declaration.grounds.text };
  });
  return { association: entry.address, item, standing: displacements.length ? 'displaced' : 'standing', displacements };
}
/**
 * Select the method-specific contributions for an exports answer. This is read-only answer
 * assembly: it establishes no claim and records no producer exposure. The naming is the
 * discovery method's own identifying finding, whatever other identifications now stand.
 */
function selectContributions(store: ProgramRecordStore, module: RecordId, discoveryMethod: string, exportsOutcome: EvaluationRecord | undefined): ExportsContributions {
  const session = store.get(module).session, ledger = sessionLedger(store, session), entity = moduleEntity(store, module);
  if (!entity) throw new Error('Expected a contributed module identification');
  const support = answerSupport(store, ledger);
  const members = (entry: AssociationEntry) => entry.declaration.members.flatMap(member => member.kind === 'item' ? [member.item] : []);
  const naming = ledger.identifications(entity, { method: discoveryMethod }).flatMap(entry =>
    members(entry).filter(item => ledger.production(ledger.investigram(item.investigram).production).producer.method === discoveryMethod).map(item => useSnapshot(ledger, support, entry, item)));
  const finding = exportsOutcome ? ledger.established(moduleExportsKey(store, module, exportsOutcome)) : undefined;
  if (exportsOutcome && !finding) throw new Error('Expected a contributed export finding');
  const item = finding ? { investigram: finding, item: 'exports' } : null;
  const surface = item ? { item, uses: ledger.associations({ kind: 'entity', entity, role: 'topic', topic: 'exports' }, 'all')
    .filter(entry => members(entry).some(member => member.investigram === item.investigram && member.item === item.item)).map(entry => useSnapshot(ledger, support, entry, item)) } : null;
  return { entity, naming, surface, support: support.finish() };
}

export interface ModuleExportsContent {
  readonly projection: ModuleExportsProjection;
  readonly basis: EvaluationRecord;
  readonly evaluations: readonly EvaluationRecord[];
  readonly module: QualifiedRecord<ModuleClaim>;
  readonly exports: readonly ExportContent[];
  readonly contexts: readonly QualifiedContext[];
  readonly complete: boolean;
}
export function resolveModuleExports(store: Pick<ProgramRecordStore, 'get'>, projection: ModuleExportsProjection): ModuleExportsContent {
  const retained = store.get(projection.id);
  if (retained.kind !== 'module-exports-projection') throw new Error('Invalid retained exports content');
  projection = retained;
  const basis = store.get(projection.evaluation), entity = store.get(projection.subject);
  if (basis.kind !== 'evaluation' || entity.kind !== 'module') throw new Error('Invalid retained exports content');
  const module = store.get(entity.claim);
  if (module.kind !== 'claim' || module.information.type !== 'module') throw new Error('Expected module naming');
  const evaluations = projection.evaluations.map(id => {
    const item = store.get(id);
    if (item.kind !== 'evaluation') throw new Error('Expected export expansion outcome');
    return item;
  });
  const documentation = projection.documentation.map(id => {
    const association = store.get(id);
    if (association.kind !== 'claim' || association.information.type !== 'documentation-association') throw new Error('Expected documentation association');
    const assertion = store.get(association.information.assertion);
    if (assertion.kind !== 'recorded-assertion') throw new Error('Expected documentation assertion');
    return { association: qualifiedRecord(store, association as DocumentationAssociationClaim), assertion: qualifiedRecord(store, assertion) };
  });
  const exports = projection.exports.map(id => {
    const item = store.get(id);
    if (item.kind !== 'claim' || item.information.type !== 'export') throw new Error('Expected export claim');
    const exported = item as ExportClaim;
    return resolveExport(store, exported, documentation.filter(doc => doc.association.record.subject === exported.id || doc.association.record.subject === exported.information.symbol));
  });
  const complete = !projection.outsidePopulation && evaluations.some(item => item.requirement === 'exports')
    && [basis, ...evaluations.filter(item => item.requirement === 'exports')].every(item => item.applicability === 'applicable' && item.availability === 'available' && completedMaterialization(item));
  return freezeOwned({ projection, basis, evaluations, module: qualifiedRecord(store, module as ModuleClaim), exports,
    contexts: projection.contexts.map(id => qualifiedContext(store, id)), complete });
}

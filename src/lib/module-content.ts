import { resolveComposition } from './composition-content.js';
import type { CompositionContent } from './composition-content.js';
import { qualifiedContext, qualifiedRecord } from './projection-content.js';
import type { QualifiedContext, QualifiedRecord } from './projection-content.js';
import type { DocumentationAssociationClaim, EvaluationRecord, ExportClaim, ModuleClaim, ProgramRecordStore, ProjectionRecord, RecordId, RecordedAssertion, SessionRecord, SymbolClaim } from './records.js';

export interface DocumentationContent {
  readonly association: QualifiedRecord<DocumentationAssociationClaim>;
  readonly assertion: QualifiedRecord<RecordedAssertion>;
}
export interface ExportContent {
  readonly claim: QualifiedRecord<ExportClaim>;
  readonly symbol: QualifiedRecord<SymbolClaim> | null;
  readonly origin: QualifiedRecord<ModuleClaim> | null;
  readonly documentation: readonly DocumentationContent[];
}
export interface ModuleContent {
  readonly id: RecordId;
  readonly claim: QualifiedRecord<ModuleClaim>;
  readonly composition: CompositionContent;
  readonly documentation: readonly DocumentationContent[];
  readonly exports: readonly ExportContent[];
  readonly documentationIds: readonly RecordId[];
}
export interface ModuleProjectionContent {
  readonly projection: ProjectionRecord;
  readonly session: SessionRecord;
  readonly discovery: EvaluationRecord;
  readonly evaluations: readonly EvaluationRecord[];
  readonly contexts: readonly QualifiedContext[];
  readonly modules: readonly ModuleContent[];
}

/** Resolves the selected qualified answer without applying any display or source-disclosure bounds. */
export function resolveModuleProjection(store: ProgramRecordStore, projection: ProjectionRecord): ModuleProjectionContent {
  const retained = store.get(projection.id);
  if (retained.kind !== 'projection') throw new Error('Expected retained projection');
  projection = retained;
  const session = store.get(projection.session);
  if (session.kind !== 'session') throw new Error('Expected analysis session');
  const evaluations = projection.evaluations.map(id => {
    const record = store.get(id);
    if (record.kind !== 'evaluation') throw new Error('Expected evaluation');
    return record;
  });
  const discovery = evaluations[0];
  if (!discovery) throw new Error('Expected discovery evaluation');
  const expanded = projection.expansions.claims.map(id => store.get(id));
  const exports = new Map<RecordId, ExportClaim[]>();
  const docs = new Map<RecordId, { order: number; content: DocumentationContent }[]>();
  expanded.forEach((record, order) => {
    if (record.kind !== 'claim') return;
    if (record.information.type === 'export') {
      const bucket = exports.get(record.subject) ?? [];
      bucket.push(record as ExportClaim); exports.set(record.subject, bucket);
    } else if (record.information.type === 'documentation-association') {
      const assertion = store.get(record.information.assertion);
      if (assertion.kind !== 'recorded-assertion') throw new Error('Expected recorded assertion');
      const bucket = docs.get(record.subject) ?? [];
      bucket.push({ order, content: Object.freeze({ association: qualifiedRecord(store, record as DocumentationAssociationClaim), assertion: qualifiedRecord(store, assertion) }) });
      docs.set(record.subject, bucket);
    }
  });
  const documentation = (subjects: readonly RecordId[]) => Object.freeze([...new Set(subjects)].flatMap(id => docs.get(id) ?? [])
    .sort((a, b) => a.order - b.order).map(item => item.content));
  const composition = resolveComposition(store, projection.expansions.claims, projection.evaluations);
  const modules = projection.modules.map(id => {
    const entity = store.get(id);
    if (entity.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(entity.claim);
    if (claim.kind !== 'claim' || claim.information.type !== 'module') throw new Error('Expected module claim');
    const allExports = exports.get(id) ?? [];
    const allSubjects = new Set([id, ...allExports.map(item => item.id), ...allExports.flatMap(item => item.information.symbol ? [item.information.symbol] : [])]);
    return Object.freeze({ id, claim: qualifiedRecord(store, claim as ModuleClaim), composition: composition(id), documentation: documentation([id]),
      documentationIds: Object.freeze([...allSubjects].flatMap(subject => docs.get(subject) ?? []).map(item => item.content.assertion.record.id)),
      exports: Object.freeze(allExports.map(exported => {
        const entity = exported.information.symbol ? store.get(exported.information.symbol) : null;
        if (entity && entity.kind !== 'symbol') throw new Error('Expected symbol');
        const symbol = entity ? store.get(entity.claim) : null;
        if (symbol && (symbol.kind !== 'claim' || symbol.information.type !== 'symbol')) throw new Error('Expected symbol claim');
        const origin = exported.information.origin ? store.get(exported.information.origin) : null;
        const originClaim = origin?.kind === 'module' ? store.get(origin.claim) : null;
        return Object.freeze({ claim: qualifiedRecord(store, exported),
          symbol: symbol ? qualifiedRecord(store, symbol as SymbolClaim) : null,
          origin: originClaim?.kind === 'claim' && originClaim.information.type === 'module' ? qualifiedRecord(store, originClaim as ModuleClaim) : null,
          documentation: documentation([exported.id, ...(exported.information.symbol ? [exported.information.symbol] : [])]) });
      })) });
  });
  const selected = new Set(projection.modules);
  const contextIds = new Set(projection.contexts);
  for (const outcome of evaluations) for (const id of outcome.contexts) {
    const context = store.get(id);
    if (context.kind === 'claim-context' && (context.scope === 'configured-project' || selected.has(context.scope))) contextIds.add(id);
  }
  const contexts = [...contextIds].map(id => qualifiedContext(store, id));
  return Object.freeze({ projection, session, discovery, evaluations: Object.freeze(evaluations), contexts: Object.freeze(contexts), modules: Object.freeze(modules) });
}

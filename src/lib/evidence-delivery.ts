import { freezeOwned } from './immutable.js';
import { recordId } from './identity.js';
import type { ClaimContextRecord, EvaluationRecord, EvaluationState, ProgramRecord, ProgramRecordStore, RecordContext, RecordId, SessionId } from './records.js';
import type { DependencyEvaluationRecord } from './dependencies/records.js';
import type { OrganizationEvaluationRecord } from './organization/records.js';

type Evaluation = EvaluationRecord | DependencyEvaluationRecord | OrganizationEvaluationRecord;
type State = Omit<EvaluationState, 'cost'>;
/** Summaries are delivery metadata, never incomplete copies inserted into the store. */
export interface EvaluationSummary extends RecordContext, State {
  readonly kind: Evaluation['kind'];
  readonly requirement: string;
  readonly basis?: RecordId;
  readonly placement?: State;
  readonly qualification: readonly (Omit<ClaimContextRecord, 'kind' | 'evidence' | 'diagnostics'> & {
    readonly evidenceCount: number;
    readonly diagnostics: readonly { readonly code: number; readonly category: string; readonly count: number }[];
  })[];
}
export interface RepositorySummary extends RecordContext {
  readonly kind: 'repository-evidence';
  readonly status: 'available' | 'unavailable';
  readonly limitations: readonly string[];
}
export interface EvidenceResponse {
  readonly status: 'available' | 'partial' | 'unavailable';
  readonly records: readonly ProgramRecord[];
  readonly selected: readonly RecordId[];
  readonly limitations: readonly string[];
  readonly evaluations?: readonly EvaluationSummary[];
  readonly repositories?: readonly RepositorySummary[];
  /** Undelivered source support remains addressable via inspect; references alone are not supplied evidence. */
  readonly supportReferences?: readonly { readonly id: RecordId; readonly kind: 'source-evidence'; readonly method: string }[];
  readonly page?: {
    readonly total: number;
    readonly start: number;
    readonly end: number;
    readonly next: string | null;
    readonly omitted: readonly { readonly id: RecordId; readonly reason: string }[];
  };
}
export const evidencePageCharacters = 55_000;
const pageItems = 24;
const state = ({ applicability, availability, execution, materialization, reason }: State): State =>
  ({ applicability, availability, execution, materialization, reason });

/** Scoped support traversal and stable, byte-bounded delivery of retained selections. */
export function evidenceDelivery(store: ProgramRecordStore, session: SessionId) {
  const get = (id: RecordId) => {
    const record = store.get(id);
    if (record.session !== session) throw new Error('Foreign evidence session');
    return record;
  };
  const summarize = (evaluation: Evaluation): EvaluationSummary => ({
    id: evaluation.id, session, kind: evaluation.kind, method: evaluation.method, ...state(evaluation),
    requirement: evaluation.kind === 'evaluation' ? evaluation.requirement : evaluation.kind === 'dependency-evaluation' ? 'dependencies' : 'organization',
    ...(evaluation.kind === 'evaluation' ? evaluation.basis ? { basis: evaluation.basis } : {}
      : { basis: evaluation.moduleEvaluation }),
    ...(evaluation.kind === 'organization-evaluation' ? { placement: state(evaluation.placement) } : {}),
    // Per-claim contexts are delivered with their claims. Only global qualification
    // belongs here; following every evaluation context recreates the whole project.
    qualification: evaluation.contexts.map(get).filter((record): record is ClaimContextRecord => record.kind === 'claim-context'
      && (record.scope === 'configured-project' || evaluation.kind === 'organization-evaluation' && record.scope === evaluation.repository))
      .map(({ kind: _kind, evidence, diagnostics, ...context }) => {
        const counts = new Map<string, { code: number; category: string; count: number }>();
        for (const diagnostic of diagnostics) {
          const key = `${diagnostic.code}:${diagnostic.category}`;
          const existing = counts.get(key);
          if (existing) existing.count++;
          else counts.set(key, { ...diagnostic, count: 1 });
        }
        return { ...context, evidenceCount: evidence.length, diagnostics: [...counts.values()] };
      }),
  });
  const compose = (ids: readonly RecordId[]): Pick<EvidenceResponse, 'records' | 'repositories'> => {
    const found = new Map<RecordId, ProgramRecord>();
    const repositories = new Map<RecordId, RepositorySummary>();
    const pending = [...ids];
    while (pending.length) {
      const id = pending.pop()!;
      if (found.has(id) || repositories.has(id)) continue;
      const record = get(id);
      if (record.kind === 'repository-evidence') {
        repositories.set(id, { id, session, method: record.method, kind: record.kind, status: record.capture.status,
          limitations: record.capture.status === 'available' ? record.capture.evidence.limitations
            : [`${record.capture.reason}: ${record.capture.operation}`] });
        continue;
      }
      found.set(id, record);
      if (record.kind === 'module' || record.kind === 'symbol' || record.kind === 'group') pending.push(record.claim);
      if (record.kind === 'claim' || record.kind === 'recorded-assertion') pending.push(record.context);
      if (record.kind === 'claim-context') pending.push(...record.evidence);
      if (record.kind === 'claim') {
        const info = record.information;
        if (info.type === 'dependency') pending.push(...info.occurrences);
        if (info.type === 'export') pending.push(...[info.symbol, info.origin].filter((id): id is RecordId => id !== null));
        if (info.type === 'documentation-association') pending.push(info.assertion);
        if (info.type === 'module-placement') pending.push(...info.groups, ...info.candidates, ...info.artifacts);
        if (info.type === 'group-containment') pending.push(record.subject, info.child);
        if (info.type === 'artifact-placement' || info.type === 'group-documentation') pending.push(record.subject, info.artifact);
      }
      if (record.kind === 'dependency-occurrence') pending.push(record.context, record.evidence, ...record.targetEvidence);
      if (record.kind === 'dependency-coverage') pending.push(record.context, record.evidence);
      if (record.kind === 'captured-content') pending.push(record.mapping);
    }
    return { records: [...found.values()], repositories: [...repositories.values()] };
  };
  interface Selection {
    key: string; id: RecordId; ids: readonly RecordId[]; evaluations: readonly EvaluationSummary[];
    limitations: readonly string[]; status: EvidenceResponse['status']; referenceSourceSupport: boolean;
  }
  const cursors = new Map<string, { selection: Selection; offset: number }>();
  const page = (selection: Selection, start: number): EvidenceResponse => {
    const selected: RecordId[] = [], omitted: { id: RecordId; reason: string }[] = [];
    let end = start;
    let referenceSourceSupport = selection.referenceSourceSupport;
    const render = (): EvidenceResponse => {
      const next = end < selection.ids.length ? recordId(session, 'evidence-continuation', [selection.id, end]) : null;
      const support = compose(selected);
      const supportReferences = referenceSourceSupport ? support.records.filter(record => record.kind === 'source-evidence')
        .map(({ id, kind, method }) => ({ id, kind, method })) : [];
      return { status: selection.status === 'unavailable' ? 'unavailable'
        : next || omitted.length || supportReferences.length ? 'partial' : selection.status,
      ...support, records: referenceSourceSupport ? support.records.filter(record => record.kind !== 'source-evidence') : support.records,
      supportReferences, selected: [...selected], evaluations: selection.evaluations,
      limitations: [...selection.limitations, ...(supportReferences.length ? ['Source support bodies are supplied by reference; inspect each supportReferences identity for its retained evidence. References alone are not supplied evidence.'] : []), ...(next ? ['This is a page of the retained selection; follow page.next with the same query.'] : []),
        ...(omitted.length ? ['Oversized items were withheld with their qualification intact; this does not establish absence.'] : [])],
      page: { total: selection.ids.length, start, end, next, omitted: [...omitted] } };
    };
    while (end < selection.ids.length && end - start < pageItems) {
      selected.push(selection.ids[end]!);
      end++;
      if (JSON.stringify(render()).length <= evidencePageCharacters) continue;
      if (selected.length === 1 && !omitted.length && !referenceSourceSupport) {
        referenceSourceSupport = true;
        if (JSON.stringify(render()).length <= evidencePageCharacters) break;
        referenceSourceSupport = false;
      }
      const id = selected.pop()!;
      if (selected.length || omitted.length) { end--; break; }
      omitted.push({ id, reason: 'This item and its qualified support exceed the evidence page bound. It remains retained; disclose this coverage gap.' });
      break;
    }
    const result = render();
    if (result.page!.next) cursors.set(result.page!.next, { selection, offset: end });
    return result;
  };
  return {
    compose,
    resume(key: string, cursor: string): EvidenceResponse {
      const retained = cursors.get(cursor);
      return retained?.selection.key === key ? page(retained.selection, retained.offset)
        : { status: 'unavailable', records: [], selected: [], limitations: ['Unknown continuation or continuation belongs to another query/session.'] };
    },
    select(key: string, ids: readonly RecordId[], evaluations: readonly Evaluation[], limitations: readonly string[] = [],
      status: EvidenceResponse['status'] = !ids.length && evaluations.some(item => item.availability === 'unavailable') ? 'unavailable' : evaluations.every(item => item.availability === 'available' && item.execution === 'completed' && item.materialization === 'full') ? 'available' : 'partial',
      referenceSourceSupport = false): EvidenceResponse {
      const selection = freezeOwned({ key, id: recordId(session, 'evidence-selection', [key, ids, evaluations.map(item => item.id)]),
        ids: [...new Set(ids)], evaluations: evaluations.map(summarize), limitations: [...new Set([
          ...evaluations.flatMap(item => item.reason ? [item.reason] : []), ...limitations,
          'Evaluation summaries describe the wider analysis; only selected records and their own support are embedded. Shared input-basis membership does not establish claim derivation.',
        ])], status, referenceSourceSupport });
      return page(selection, 0);
    },
  };
}

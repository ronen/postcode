import { evaluateModules } from './evaluation.js';
import type { ModuleAnalysis } from './evaluation.js';
import { evaluateDependencies } from './dependencies/evaluate.js';
import { evaluateOrganization } from './organization/evaluate.js';
import type { ProgramRecord, ProgramRecordStore, RecordContext, RecordId, SessionId } from './records.js';

/** Content is captured by the language/provider input boundary, never read by a lens or agent. */
export interface CapturedContentRecord extends RecordContext {
  readonly kind: 'captured-content';
  readonly subject: RecordId;
  readonly inputs: RecordId;
  readonly mapping: RecordId;
  readonly path: string;
  readonly contentDigest: string;
  readonly text: string;
  readonly coverage: 'full-file';
  readonly limitations: readonly string[];
}

export interface ContentResult {
  readonly status: 'available' | 'partial' | 'unavailable';
  readonly captures: readonly RecordId[];
  readonly limitations: readonly string[];
}

export type EvidenceQuery = { readonly kind: 'modules' | 'organization' }
  | { readonly kind: 'inspect' | 'exports' | 'dependencies' | 'dependents' | 'membership' | 'source'; readonly subject: RecordId };

export interface EvidenceResponse {
  readonly status: 'available' | 'partial' | 'unavailable';
  readonly records: readonly ProgramRecord[];
  readonly selected: readonly RecordId[];
  readonly limitations: readonly string[];
}

/** A domain entry point to existing evaluators; no projections or human-command observations. */
export function evidenceAccess(store: ProgramRecordStore, analysis: ModuleAnalysis, session: SessionId) {
  const unavailable = (reason: string): EvidenceResponse => ({ status: 'unavailable', records: [], selected: [], limitations: [reason] });
  const response = (ids: readonly RecordId[], selected: readonly RecordId[], limitations: readonly string[] = [],
    status: EvidenceResponse['status'] = 'available'): EvidenceResponse => {
    const found = new Map<RecordId, ProgramRecord>();
    const pending = [...ids];
    while (pending.length) {
      const id = pending.pop()!;
      if (found.has(id)) continue;
      const record = store.get(id);
      if (record.session !== session) throw new Error('Foreign evidence session');
      found.set(id, record);
      if (record.kind === 'module' || record.kind === 'symbol' || record.kind === 'group') pending.push(record.claim);
      if (record.kind === 'claim' || record.kind === 'recorded-assertion') pending.push(record.context);
      if (record.kind === 'claim-context') pending.push(...record.evidence);
      if (record.kind === 'claim' && record.information.type === 'documentation-association') pending.push(record.information.assertion);
      if (record.kind === 'dependency-occurrence') pending.push(record.context, record.evidence, ...record.targetEvidence);
      if (record.kind === 'dependency-coverage') pending.push(record.context, record.evidence);
      if (record.kind === 'captured-content') pending.push(record.mapping);
    }
    return { status, records: [...found.values()], selected, limitations };
  };
  return {
    lookup: (id: RecordId) => { const item = store.lookup(id); return item?.session === session ? item : undefined; },
    query(query: EvidenceQuery): EvidenceResponse {
      const subject = 'subject' in query ? store.lookup(query.subject) : undefined;
      if ('subject' in query && (!subject || subject.session !== session)) return unavailable('Unknown subject in this session.');
      if (query.kind === 'inspect') {
        if (!['module', 'symbol', 'group', 'claim', 'claim-context', 'source-evidence', 'repository-artifact',
          'recorded-assertion', 'captured-content', 'dependency-occurrence', 'dependency-coverage'].includes(subject!.kind)) {
          return unavailable('This internal record is not an inspectable program subject or evidence item.');
        }
        return response([subject!.id], [subject!.id]);
      }
      if (query.kind === 'source') {
        if (subject!.kind !== 'module' && subject!.kind !== 'repository-artifact') return unavailable('Source requires a module or organization artifact reference.');
        if (!analysis.acquireContent) return unavailable('Content acquisition is unavailable from this provider.');
        const result = analysis.acquireContent(store, subject!.id);
        return response(result.captures, result.captures, result.limitations, result.status);
      }
      if (['exports', 'dependencies', 'dependents', 'membership'].includes(query.kind) && subject!.kind !== 'module') {
        return unavailable('This evidence query requires a module.');
      }
      if (query.kind === 'dependencies' || query.kind === 'dependents') {
        const evaluation = evaluateDependencies(store, analysis);
        const relationships = evaluation.relationships.filter(id => {
          const claim = store.get(id);
          return claim.kind === 'claim' && claim.information.type === 'dependency'
            && (query.kind === 'dependencies' ? claim.subject === subject!.id : claim.information.child === subject!.id);
        });
        const claims = relationships.map(id => store.get(id));
        const endpoints = claims.flatMap(claim => claim.kind === 'claim' && claim.information.type === 'dependency'
          ? [claim.subject, claim.information.child, ...claim.information.occurrences] : []);
        return response([evaluation.id, ...evaluation.contexts, ...relationships, ...endpoints, ...evaluation.coverage], relationships,
          evaluation.reason ? [evaluation.reason] : [], evaluation.materialization === 'full' ? 'available' : 'partial');
      }
      const modules = evaluateModules(store, analysis, query.kind === 'exports' ? ['exports', 'documentation'] : []);
      if (query.kind === 'modules') return response([modules.id, ...modules.contexts, ...modules.modules], modules.modules,
        modules.reason ? [modules.reason] : [], modules.materialization === 'full' ? 'available' : 'partial');
      if (query.kind === 'exports') {
        const expansions = store.evaluations(session).filter(item => item.basis === modules.id && item.modules.includes(subject!.id));
        // Each expansion is already scoped to this module. Documentation may
        // describe its exported symbol or alias rather than the module entity.
        const claims = [...new Set(expansions.flatMap(item => item.claims ?? []))];
        const symbols = claims.flatMap(id => { const claim = store.get(id); return claim.kind === 'claim' && claim.information.type === 'export'
          ? [claim.information.symbol, claim.information.origin].filter((id): id is RecordId => id !== null) : []; });
        return response([modules.id, ...expansions.map(item => item.id), ...expansions.flatMap(item => item.contexts), ...claims, ...symbols], claims,
          expansions.flatMap(item => item.reason ? [item.reason] : []), expansions.every(item => item.materialization === 'full') ? 'available' : 'partial');
      }
      const organization = evaluateOrganization(store, modules);
      const selected = query.kind === 'membership' ? organization.claims.filter(id => {
        const claim = store.get(id); return claim.kind === 'claim' && claim.subject === subject!.id && claim.information.type === 'module-placement';
      }) : [...organization.groups, ...organization.claims];
      const artifacts = selected.flatMap(id => {
        const record = store.get(id);
        return record.kind === 'claim' && (record.information.type === 'artifact-placement' || record.information.type === 'group-documentation')
          ? [record.information.artifact] : [];
      });
      return response([organization.id, ...organization.contexts, ...selected, ...artifacts], selected,
        organization.reason ? [organization.reason] : [], organization.materialization === 'full' ? 'available' : 'partial');
    },
  };
}

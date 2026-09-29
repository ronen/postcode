import { evaluateModules } from './evaluation.js';
import type { ModuleAnalysis } from './evaluation.js';
import { evaluateDependencies } from './dependencies/evaluate.js';
import { canonical } from './identity.js';
import { evidenceDelivery } from './evidence-delivery.js';
import type { EvidenceResponse } from './evidence-delivery.js';
export type { EvidenceResponse } from './evidence-delivery.js';
import { evaluateOrganization } from './organization/evaluate.js';
import type { ProgramRecordStore, RecordContext, RecordId, SessionId } from './records.js';

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

export type EvidenceQuery = ({ readonly kind: 'modules' | 'organization' }
  | { readonly kind: 'exports' | 'dependencies' | 'dependents' | 'membership' | 'group'; readonly subject: RecordId }) & { readonly cursor?: string }
  | { readonly kind: 'inspect' | 'source'; readonly subject: RecordId };

/** A domain entry point to existing evaluators; no projections or human-command observations. */
export function evidenceAccess(store: ProgramRecordStore, analysis: ModuleAnalysis, session: SessionId) {
  const unavailable = (reason: string): EvidenceResponse => ({ status: 'unavailable', records: [], selected: [], limitations: [reason] });
  const delivery = evidenceDelivery(store, session);
  return {
    lookup: (id: RecordId) => { const item = store.lookup(id); return item?.session === session ? item : undefined; },
    query(query: EvidenceQuery): EvidenceResponse {
      const subject = 'subject' in query ? store.lookup(query.subject) : undefined;
      if ('subject' in query && (!subject || subject.session !== session)) return unavailable('Unknown subject in this session.');
      const key = canonical({ kind: query.kind, ...('subject' in query ? { subject: query.subject } : {}) });
      if ('cursor' in query && query.cursor !== undefined) return delivery.resume(key, query.cursor);
      if (query.kind === 'inspect') {
        if (!['module', 'symbol', 'group', 'claim', 'claim-context', 'source-evidence', 'repository-artifact', 'repository-region',
          'recorded-assertion', 'captured-content', 'dependency-occurrence', 'dependency-coverage'].includes(subject!.kind)) {
          return unavailable('This internal record is not an inspectable program subject or evidence item.');
        }
        return { status: 'available', ...delivery.compose([subject!.id]), selected: [subject!.id], limitations: [] };
      }
      if (query.kind === 'source') {
        if (subject!.kind !== 'module' && subject!.kind !== 'repository-artifact') return unavailable('Source requires a module or organization artifact reference.');
        if (!analysis.acquireContent) return unavailable('Content acquisition is unavailable from this provider.');
        const result = analysis.acquireContent(store, subject!.id);
        return { status: result.status, ...delivery.compose(result.captures), selected: result.captures, limitations: result.limitations };
      }
      if (['exports', 'dependencies', 'dependents', 'membership'].includes(query.kind) && subject!.kind !== 'module') {
        return unavailable('This evidence query requires a module.');
      }
      if (query.kind === 'group' && subject!.kind !== 'group') return unavailable('Group navigation requires a group.');
      if (query.kind === 'dependencies' || query.kind === 'dependents') {
        const evaluation = evaluateDependencies(store, analysis);
        const relationships = evaluation.relationships.filter(id => {
          const claim = store.get(id);
          return claim.kind === 'claim' && claim.information.type === 'dependency'
            && (query.kind === 'dependencies' ? claim.subject === subject!.id : claim.information.child === subject!.id);
        });
        const covered = new Set(relationships.flatMap(id => {
          const claim = store.get(id);
          return claim.kind === 'claim' && claim.information.type === 'dependency' ? claim.information.occurrences : [];
        }));
        const nonEdges = query.kind === 'dependencies' ? evaluation.occurrences.filter(id => {
          const item = store.get(id); return item.kind === 'dependency-occurrence' && item.owner === subject!.id && !covered.has(id);
        }) : [];
        const coverage = query.kind === 'dependencies' ? evaluation.coverage.filter(id => {
          const item = store.get(id); return item.kind === 'dependency-coverage' && item.owner === subject!.id;
        }) : [];
        return delivery.select(key, [...relationships, ...nonEdges, ...coverage], [evaluation], [
          'Dependency coverage is bounded project-owned source-request analysis, not runtime dependency completeness.',
          ...(query.kind === 'dependents' ? ['Incoming relationships include established targets only; unresolved requests and unattributed coverage elsewhere cannot establish absence of dependents.']
            : ['Outgoing selection includes recognized requests without established edges and owner-specific coverage records. Unattributed requests elsewhere cannot be assigned to this module.']),
          ...(!evaluation.projectModules.includes(subject!.id) ? ['This subject is outside the analyzed project-owner population; its interior is opaque.'] : []),
        ]);
      }
      const modules = evaluateModules(store, analysis, query.kind === 'exports' ? ['exports', 'documentation'] : []);
      if (query.kind === 'modules') return delivery.select(key, modules.modules, [modules]);
      if (query.kind === 'exports') {
        const expansions = store.evaluations(session).filter(item => item.basis === modules.id && item.modules.includes(subject!.id));
        const claims = [...new Set(expansions.flatMap(item => item.claims ?? []))];
        const missing = ['exports', 'documentation'].filter(requirement => !expansions.some(item => item.requirement === requirement));
        return delivery.select(key, claims, [modules, ...expansions],
          missing.map(requirement => `The provider did not supply ${requirement} for this module; absence is not established.`),
          missing.length ? expansions.length ? 'partial' : 'unavailable' : undefined);
      }
      const organization = evaluateOrganization(store, modules);
      const selected = query.kind === 'organization' ? organization.groups : organization.claims.filter(id => {
        const claim = store.get(id);
        if (claim.kind !== 'claim') return false;
        if (query.kind === 'membership') return claim.subject === subject!.id && claim.information.type === 'module-placement';
        return claim.subject === subject!.id || claim.information.type === 'module-placement' && claim.information.groups.includes(subject!.id);
      });
      return delivery.select(key, selected, [organization], [
        'Organization lists groups; use group(subject) for direct containment, members, artifacts and documentation, then source(artifact) for content.',
        'Repository layout and module-placement coverage are separate. Placement does not establish documentation applicability.',
      ]);
    },
  };
}

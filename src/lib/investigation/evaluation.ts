import { revisionPage } from './revision-page.js';
import { sessionRevisions } from './revisions.js';
import { associatedInvestigrams } from './associations.js';
import { canonical, identityReference, methods, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import { evidenceAccess } from '../evidence-access.js';
import type { ModuleAnalysis } from '../evaluation.js';
import type { ProgramRecordStore, RecordContext, RecordId, SessionId } from '../records.js';
import { investigate } from './execute.js';
import type { InvestigationBounds } from './execute.js';
import type { AttemptReport, Correction, InvestigationHistory, InvestigationOutcome, InvestigationRequest, InvestigatorAgent } from './contracts.js';
import { InvestigationUsage } from './usage.js';

export interface InvestigationEvaluationRecord extends RecordContext {
  readonly kind: 'investigation-evaluation';
  readonly request: InvestigationRequest;
  readonly attempt: RecordId;
  readonly outcome: { readonly kind: 'accepted'; readonly root: RecordId } | Extract<InvestigationOutcome, { kind: 'limit-stop' | 'investigation-failure' }>;
  readonly investigrams: readonly RecordId[];
  readonly corrections: readonly RecordId[];
}
export interface InvestigationSelection {
  readonly request: InvestigationRequest;
  readonly reused: boolean;
  readonly attempt: RecordId | null;
  readonly evaluation: InvestigationEvaluationRecord | null;
  readonly unavailable: Extract<InvestigationOutcome, { kind: 'configuration-unavailable' | 'communication-failure' }> | null;
}
export interface InvestigationDependencies {
  readonly agent?: InvestigatorAgent;
  /** Internal assessment injection, selected only for missing work. */
  readonly selectAgent?: (request: InvestigationRequest) => Promise<InvestigatorAgent>;
  readonly bounds?: InvestigationBounds;
  readonly onReport?: (report: AttemptReport) => void;
  readonly onProgress?: (report: AttemptReport) => void;
}

/** Operation selection and atomic retention; independent of lenses and projections. */
export function investigationEvaluation(store: ProgramRecordStore, analysis: ModuleAnalysis, session: SessionId,
  usage: InvestigationUsage, dependencies: InvestigationDependencies, check: () => Promise<void>, signal: AbortSignal) {
  const evidence = evidenceAccess(store, analysis, session);
  let revisionCount = -1, revisions: ReturnType<typeof sessionRevisions>;
  const history: InvestigationHistory = {
    revision(id, page) {
      const count = store.investigations(session).length;
      if (count !== revisionCount) { revisions = sessionRevisions(store, session); revisionCount = count; }
      return revisionPage(revisions.snapshot(id), page);
    },
    associated(subject) {
      const record = store.lookup(subject);
      if (!record || record.session !== session || !['module', 'symbol', 'group', 'repository-artifact', 'investigram'].includes(record.kind)) return undefined;
      return associatedInvestigrams(store, session, [subject]).map(item => item.id);
    },
    get(id) { const value = store.lookup(id); return value?.kind === 'investigram' && value.session === session ? value : undefined; },
    provenance(id) { const value = store.lookup(id); return value?.kind === 'investigation-provenance' && value.session === session ? value : undefined; },
    correction(id) { const value = store.lookup(id); return value?.kind === 'investigram-correction' && value.session === session ? value : undefined; },
    corrections(id) { return store.investigations(session).flatMap(item => item.corrections)
      .map(id => store.get(id)).filter((item): item is Correction => item.kind === 'investigram-correction' && item.target === id); },
  };
  const key = (request: InvestigationRequest) => canonical(request);
  return { evidence, history, async evaluate(request: InvestigationRequest): Promise<InvestigationSelection> {
    request = freezeOwned(structuredClone(request));
    await check();
    const retained = store.investigations(session).find(item => key(item.request) === key(request));
    if (retained) return { request, reused: true, attempt: retained.attempt, evaluation: retained, unavailable: null };
    const agent = dependencies.selectAgent ? await dependencies.selectAgent(request) : dependencies.agent;
    if (!agent) return { request, reused: false, attempt: null, evaluation: null, unavailable: {
      kind: 'configuration-unavailable', code: 'investigator-not-configured', diagnostic: 'Investigation is disabled. See docs/hosted-investigation.md for intentional hosted enablement and credential setup.',
    } };
    const execution = await investigate({ session, request, evidence, history, usage, agent, check, signal,
      ...(dependencies.bounds ? { bounds: dependencies.bounds } : {}),
      onReport: dependencies.onReport, onProgress: dependencies.onProgress });
    if (signal.aborted) throw signal.reason;
    const outcome = execution.outcome;
    if (outcome.kind === 'communication-failure' || outcome.kind === 'configuration-unavailable') {
      return { request, reused: false, attempt: execution.report.attempt, evaluation: null, unavailable: outcome };
    }
    if (outcome.kind !== 'accepted' && !('reason' in outcome)) throw new Error('Unexpected investigation outcome');
    const accepted = outcome.kind === 'accepted' ? outcome.result : null;
    const evaluation: InvestigationEvaluationRecord = { kind: 'investigation-evaluation', session, method: methods.investigationEvaluation,
      id: recordId(session, 'investigation-evaluation', [methods.investigationEvaluation, identityReference(session, execution.report.attempt)]),
      request, attempt: execution.report.attempt, outcome: outcome.kind === 'accepted' ? { kind: 'accepted', root: outcome.result.root } : outcome,
      investigrams: accepted?.investigrams.map(item => item.id) ?? [], corrections: accepted?.corrections.map(item => item.id) ?? [] };
    // After the domain validity check returns, recheck abortion above and publish
    // synchronously; no asynchronous work intervenes after that abort check.
    store.put([...(accepted ? [accepted.provenance, ...accepted.investigrams, ...accepted.corrections] : []), evaluation]);
    const stored = store.get(evaluation.id);
    if (stored.kind !== 'investigation-evaluation') throw new Error('Expected retained investigation outcome');
    return { request, reused: false, attempt: execution.report.attempt, evaluation: stored, unavailable: null };
  } };
}

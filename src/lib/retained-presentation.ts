import { isAnswer } from './answer-references.js';
import type { RetainedAnswer } from './answer-references.js';
import { resolveModuleProjection } from './module-content.js';
import { resolveOrganizationProjection } from './organization/content.js';
import { resolveDependencyProjection } from './dependencies/content.js';
import { resolveModuleExports } from './exports/content.js';
import { resolveInvestigationContent } from './investigation/content.js';
import { referenceBinding } from './reference-binding.js';
import { arrangeInvestigationView, renderInvestigationView } from './investigation/presentation.js';
import { arrangeAssociatedInspection } from './investigation/associations.js';
import { createMechanicalView, renderMechanicalView } from './program-presentation.js';
import { retainedPresentation, presentedOptions, materializationLimitations } from './presentation-contracts.js';
import type { PresentationContent } from './presentation-contracts.js';
import type { ProgramRecordStore, RecordId, SessionId } from './records.js';
import type { CapturedCatalog } from './request-catalog.js';
import type { NormalizedRequest } from './requests.js';
import type { InvestigationUsageReport } from './investigation/reporting.js';
import type { WorkScope } from './work-attribution.js';

type RetentionStore = Pick<ProgramRecordStore, 'get' | 'lookup'>;
/** Fixed-reference resolution has no selection, population enumeration or Evaluation capability. */
export function resolveRetainedContent(store: RetentionStore, answer: RetainedAnswer): PresentationContent {
  switch (answer.kind) {
    case 'projection': return { contract: 'modules', value: resolveModuleProjection(store, answer) };
    case 'organization-projection': return { contract: 'organization', value: resolveOrganizationProjection(store, answer) };
    case 'dependency-projection': return { contract: 'dependencies', value: resolveDependencyProjection(store, answer) };
    case 'module-exports-projection': return { contract: 'module-exports', value: resolveModuleExports(store, answer) };
    case 'investigation-selection-projection': return { contract: 'investigation', value: resolveInvestigationContent(store, answer) };
  }
}

/** Attribute consumption to fixed retained producers without treating their work as new. */
function supportingWork(content: PresentationContent): readonly RecordId[] {
  switch (content.contract) {
    case 'modules': return content.value.evaluations.map(item => item.id);
    case 'organization': return [content.value.evaluation.id, content.value.moduleEvaluation.id,
      ...content.value.moduleEvaluations.map(item => item.id),
      ...(content.value.moduleDetail?.evaluations.map(item => item.id) ?? [])];
    case 'dependencies': return [content.value.evaluation.id, content.value.basis.id,
      ...content.value.moduleEvaluations.map(item => item.id), ...(content.value.expanded ? [content.value.expanded.id] : [])];
    case 'module-exports': return [content.value.basis.id, ...content.value.evaluations.map(item => item.id)];
    case 'investigation': return [...(content.value.evaluation ? [content.value.evaluation.id] : []),
      ...content.value.accounts.map(item => item.id), ...content.value.corrections.map(item => item.id),
      ...content.value.support.map(item => item.record.id)];
  }
}

export function presentRetained(store: ProgramRecordStore, session: SessionId,
  request: Extract<NormalizedRequest, { kind: 'present' }>, catalog: CapturedCatalog, usage: InvestigationUsageReport, work: WorkScope) {
  const refuse = (reason: 'unknown-answer' | 'foreign-answer' | 'unsupported-answer' | 'presentation-unavailable', explanation: string, retainedAnswers: readonly RecordId[] = [], qualifications: readonly string[] = []) =>
    ({ kind: 'refusal' as const, reason, explanation, retainedAnswers, qualifications });
  const raw = request.target.replace(/^@/, '');
  const id = /^answer-[a-f0-9]{8,64}$/.test(raw) ? store.boundAnswer(session, raw) : raw as RecordId;
  if (!id) return refuse('unknown-answer', 'This answer reference is not bound in this Session.');
  if (!/^session:[^:]+:[^:]+:[a-f0-9]{64}$/.test(id)) return refuse('unknown-answer', 'Supply an exact retained Projection ID or a bound answer reference.');
  if (!id.startsWith(`${session}:`)) return refuse('foreign-answer', 'This precise target belongs to a different Session.');
  const answer = store.lookup(id);
  if (!answer) return refuse('unknown-answer', 'This target is not retained in this Session.');
  if (!isAnswer(answer)) return refuse('unsupported-answer', 'This retained record is not a supported Projection.');
  const answerReference = store.answerIds([answer.id]).get(answer.id)!;
  const associated = answer.kind === 'investigation-selection-projection' && answer.variant === 'associated-inspection';
  const mechanical = associated ? store.get(answer.mechanical) : null;
  if (mechanical && mechanical.kind !== 'projection' && mechanical.kind !== 'organization-projection') throw new Error('Broken mechanical support for retained inspection');
  const base = mechanical ?? answer;
  if (base.kind === 'organization-projection' && !base.expansions.requested.includes('group-details')) return refuse('presentation-unavailable', 'This Presentation needs group details not selected by the retained answer. Issue a new information request.', [answer.id]);
  const content = resolveRetainedContent(store, answer);
  const baseContent = mechanical ? resolveRetainedContent(store, mechanical) : content;
  const compatibility = retainedPresentation(catalog.presentations, baseContent, request.presentation, associated);
  if ('explanation' in compatibility) return refuse('presentation-unavailable', compatibility.explanation, [answer.id], materializationLimitations(baseContent));
  const context = { selectionMode: 'retained' as const, referenceLifetime: request.referenceLifetime, answerReference };
  const presentation = presentedOptions(request.presentation, compatibility.decision);
  const title = catalog.lenses[answer.lens]?.title;
  if (!title) throw new Error('Retained answer has no meaning in the fixed Session catalog');
  work.record('content', 'consumed', { records: [...new Set([answer.id, ...(mechanical ? [mechanical.id, ...supportingWork(baseContent)] : []), ...supportingWork(content)])],
    limitations: ['Exact retained answer and its fixed support; no selection, Evaluation or new evidence acquisition.'] });
  if (baseContent.contract === 'investigation') {
    const arranged = arrangeInvestigationView(baseContent.value, { ...context, title, presentation,
      ...(request.presentation.after === undefined ? {} : { after: request.presentation.after }),
      revisionPage: request.presentation.revisionPage ?? 1 }, null, usage, referenceBinding(store, session, baseContent.value.references));
    return { kind: 'view' as const, ...arranged, rendered: renderInvestigationView(arranged.view), failed: arranged.view.investigations?.status === 'unknown-continuation' };
  }
  let view = createMechanicalView(store, baseContent, presentation, title, undefined, context);
  if (associated) {
    if (content.contract !== 'investigation' || view.schema !== 'postcode-view/1-experimental' && view.schema !== 'postcode-organization-view/1-experimental') throw new Error('Broken associated inspection contract');
    view = arrangeAssociatedInspection(view, content.value, store.entityIds(content.value.projection.associated, 'investigram'), request.presentation.after, request.referenceLifetime);
  }
  return { kind: 'view' as const, view, investigationArrangementKey: null, rendered: renderMechanicalView(view),
    failed: 'investigations' in view && view.investigations?.status === 'unknown-continuation' };
}

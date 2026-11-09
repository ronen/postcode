import type { RetainedAnswer } from '../answer-references.js';
import { resolveModuleProjection } from '../module-content.js';
import { resolveOrganizationProjection } from '../organization/content.js';
import { resolveDependencyProjection } from '../dependencies/content.js';
import { resolveModuleExports } from '../exports/content.js';
import { resolveInvestigationContent } from '../investigation/content.js';
import type { ProgramRecordStore, RecordId, SessionId } from '../records.js';
import { isAnswer } from '../answer-references.js';
import type { QualifiedContent } from './content.js';

type RetentionStore = Pick<ProgramRecordStore, 'get' | 'lookup'>;
/** Fixed-reference resolution has no selection, population enumeration or Evaluation capability. */
export function resolveRetainedContent(store: RetentionStore, answer: RetainedAnswer): QualifiedContent {
  switch (answer.kind) {
    case 'projection': return { contract: 'modules', value: resolveModuleProjection(store, answer) };
    case 'organization-projection': return { contract: 'organization', value: resolveOrganizationProjection(store, answer) };
    case 'dependency-projection': return { contract: 'dependencies', value: resolveDependencyProjection(store, answer) };
    case 'module-exports-projection': return { contract: 'module-exports', value: resolveModuleExports(store, answer) };
    case 'investigation-selection-projection': return { contract: 'investigation', value: resolveInvestigationContent(store, answer) };
  }
}

/** Attribute consumption to fixed retained producers without treating their work as new. */
export function supportingWork(content: QualifiedContent): readonly RecordId[] {
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

export function resolveRetainedTarget(store: ProgramRecordStore, session: SessionId, target: string) {
  const refuse = (reason: 'unknown-answer' | 'foreign-answer' | 'unsupported-answer', explanation: string) => ({ kind: 'refusal' as const, reason, explanation });
  const raw = target.replace(/^@/, '');
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
  const content = resolveRetainedContent(store, answer);
  const base = mechanical ? resolveRetainedContent(store, mechanical) : content;
  return { kind: 'answer' as const, answerReference, content, base, associated };
}

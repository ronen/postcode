import type { RecordId } from './records.js';
import type { NormalizedRequest } from './requests.js';
import type { Presentation } from './presentation.js';
import { inlineText } from './terminal-text.js';

/** Supplied by Session coordination, independently of Presentation selection. */
export interface AnswerContext {
  readonly selectionMode?: 'fresh' | 'retained';
  readonly referenceLifetime?: 'session' | 'command';
  readonly answerReference?: string | undefined;
}
export interface AnswerDisplay {
  readonly selectionMode: 'fresh' | 'retained';
  readonly referenceLifetime: 'session' | 'command';
  readonly answerReference: string | null;
  readonly referenceNotice: string;
  readonly continuations: readonly AnswerContinuation[];
}
export interface AnswerContinuation {
  readonly action: 'association-next' | 'revision-next' | 'association-restart';
  readonly request: Extract<NormalizedRequest, { kind: 'present' }>;
  readonly qualification?: 'unknown-continuation';
}
export function answerIdentity(context: AnswerContext) {
  return { selectionMode: context.selectionMode ?? 'fresh', referenceLifetime: context.referenceLifetime ?? 'session' };
}
export function answerDisplay(context: AnswerContext): AnswerDisplay {
  return { ...answerIdentity(context), answerReference: context.answerReference ?? null, referenceNotice: referenceNotice(context.referenceLifetime ?? 'session'), continuations: [] };
}
export function referenceNotice(lifetime: 'session' | 'command'): string {
  return lifetime === 'command' ? 'All answer, subject and supporting references expire when this command ends. Open postcode shell, request the information there, then use that new Session’s answer reference.'
    : 'Answer, subject and supporting references remain bound for this Session.';
}
export function answerLines(view: AnswerDisplay & { readonly projection: { readonly id: RecordId } }): string[] {
  return [view.selectionMode === 'fresh' ? 'Fresh answer selection' : 'Retained answer; selection unchanged',
    `Answer: ${view.answerReference ? `@${inlineText(view.answerReference)} · ` : ''}${inlineText(view.projection.id)}`,
    view.referenceNotice];
}
export function answerContinuations(target: RecordId, context: AnswerContext, presentation: Presentation,
  paging: { readonly after?: string | undefined; readonly revisionPage?: number; readonly next?: string | null | undefined;
    readonly nextPage?: number | null | undefined; readonly unknownContinuation?: boolean }): readonly AnswerContinuation[] {
  if (context.referenceLifetime === 'command') return [];
  const request: Extract<NormalizedRequest, { kind: 'present' }> = { kind: 'present', target,
    presentation: { format: presentation.format, sourceDetail: presentation.sourceDetail,
      ...(paging.after === undefined ? {} : { after: paging.after }),
      ...(paging.revisionPage === undefined ? {} : { revisionPage: paging.revisionPage }) }, referenceLifetime: 'session' };
  const entries: AnswerContinuation[] = [];
  if (paging.next) entries.push({ action: 'association-next', request: { ...request, presentation: { ...request.presentation, after: paging.next } } });
  if (paging.nextPage) entries.push({ action: 'revision-next', request: { ...request, presentation: { ...request.presentation, revisionPage: paging.nextPage } },
    ...(paging.unknownContinuation ? { qualification: 'unknown-continuation' as const } : {}) });
  if (paging.unknownContinuation) {
    const { after: _after, ...choices } = request.presentation;
    entries.push({ action: 'association-restart', request: { ...request, presentation: choices } });
  }
  return entries;
}
export function continuationCommand(entry: AnswerContinuation, answerReference: string): string {
  const choices = entry.request.presentation;
  return [`present @${answerReference}`, ...(choices.after ? [`--after @${choices.after}`] : []),
    ...(choices.revisionPage !== undefined && choices.revisionPage !== 1 ? [`--revision-page ${choices.revisionPage}`] : []),
    ...(choices.sourceDetail ? ['--source-detail'] : []), ...(choices.format === 'json' ? ['--json'] : [])].join(' ');
}
export function continuationLines(view: AnswerDisplay): string[] {
  if (!view.answerReference) return [];
  return view.continuations.map(entry => {
    const command = inlineText(continuationCommand(entry, view.answerReference!));
    if (entry.action === 'revision-next') return `Continue revision details for this answer with ${command}. This pages all shown revision statuses; some may have no further rows.${entry.qualification === 'unknown-continuation' ? ' The association continuation remains unknown; this command retains failed status.' : ''}`;
    if (entry.action === 'association-restart') return `Restart associations for this answer with ${command}. This clears only the unknown association continuation.`;
    return `Continue associations for this answer with ${command}.`;
  });
}

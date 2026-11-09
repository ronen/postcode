import { randomUUID } from 'node:crypto';
import { freezeOwned } from '../immutable.js';
import type { ObservationBatch } from './observations.js';

/** Already displayed artifacts supplied by the caller; never a live Session lookup. */
export type DisplayedResult = Pick<ObservationBatch, 'command' | 'records' | 'events'>;
export interface FeedbackInput {
  readonly correlation: string; readonly command: number; readonly explanation: string | null;
  readonly displayed?: DisplayedResult;
}

/** No project opening, investigation, correction, or source reconstruction. */
export function prepareFeedback(input: FeedbackInput) {
  const options = structuredClone({ correlation: input.correlation, command: input.command, explanation: input.explanation,
    ...(input.displayed ? { displayed: input.displayed } : {}) });
  const request = randomUUID(), rendered = randomUUID(), feedback = randomUUID();
  const context = options.displayed ? 'displayed-result' : 'context-free';
  const outcome = options.displayed?.records.find(record => record.kind === 'command-outcome')?.value as { status: string } | undefined;
  const target = options.displayed ? { command: options.displayed.command, status: outcome?.status ?? 'displayed' } : null;
  const report = { target, kind: 'inadequacy', explanation: options.explanation, context,
    displayed: options.displayed ?? null,
    limitations: options.displayed
      ? ['Context contains only artifacts already supplied at display. Unexported captured basis and navigation history remain unavailable; no context was reconstructed.']
      : ['No prior result, subject, captured basis, project or investigation context is associated with this report. Correlation alone does not establish a prior displayed result or its captured basis.'] };
  return freezeOwned({ options, request, rendered, feedback, report });
}

export type PreparedFeedback = ReturnType<typeof prepareFeedback>;

/** Attach only the rendering the caller actually supplied for this feedback. */
export function feedbackObservation(prepared: PreparedFeedback, stdout: string): ObservationBatch {
  const { options, request, rendered, feedback, report } = prepared;
  const batch: ObservationBatch = { formatVersion: 4, id: randomUUID(), session: options.correlation, command: options.command,
    records: [
      { id: request, kind: 'request', value: { kind: 'feedback', explanation: options.explanation } },
      { id: feedback, kind: 'inadequacy-feedback', value: report },
      { id: rendered, kind: 'rendered-output', value: stdout },
      { id: randomUUID(), kind: 'command-outcome', value: { status: 'completed', stderr: '' } },
    ], events: [
      { id: randomUUID(), type: 'inadequacy-reported', request, rendered, feedback },
      { id: randomUUID(), type: 'command-completed', request, rendered },
    ] };
  return freezeOwned(batch);
}

import { inlineText } from '../../terminal-text.js';
import { prepareFeedback, feedbackObservation } from '../../application/feedback.js';
import type { FeedbackInput } from '../../application/feedback.js';
import type { ObservationSink } from '../../application/observations.js';
import { submitObservation } from './observations.js';

export async function publishFeedback(options: FeedbackInput & { readonly json: boolean },
  output: { stdout(text: string): void; stderr(text: string): void }, sink: ObservationSink): Promise<void> {
  const prepared = prepareFeedback(options);
  const { report } = prepared;
  const { target, context } = report;
  const stdout = options.json ? `${JSON.stringify({ schema: 'postcode-feedback/1-experimental', action: 'submitting-inadequacy-feedback', context, target, limitations: report.limitations }, null, 2)}\n`
    : `Submitting inadequacy feedback${target ? ` about command ${target.command} (${inlineText(target.status)})` : ' without associated investigation context'}. No investigation or correction is requested.\n`;
  output.stdout(stdout);
  await submitObservation(sink, feedbackObservation(prepared, stdout), output);
}

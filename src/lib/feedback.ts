import { randomUUID } from 'node:crypto';
import type { ObservationBatch, ObservationSink } from './observations.js';
import { submitObservation } from './command-execution.js';

/** Snapshot supplied by publication, never a lookup into a live Session or prior sink batch. */
export type DisplayedResult = Pick<ObservationBatch, 'command' | 'records' | 'events'>;

export async function publishFeedback(options: {
  correlation: string; command: number; explanation: string | null; json: boolean;
  displayed?: DisplayedResult;
}, output: { stdout(text: string): void; stderr(text: string): void }, sink: ObservationSink): Promise<void> {
  const request = randomUUID(), rendered = randomUUID(), feedback = randomUUID();
  const context = options.displayed ? 'displayed-result' : 'context-free';
  const report = { kind: 'inadequacy', explanation: options.explanation, context,
    displayed: options.displayed ? structuredClone(options.displayed) : null,
    limitations: options.displayed
      ? ['Context contains only artifacts already supplied at display. Unexported captured basis and navigation history remain unavailable; no context was reconstructed.']
      : ['No prior result, subject, captured basis, project or investigation context is associated with this report. Correlation alone does not establish a prior displayed result or its captured basis.'] };
  const stdout = options.json ? `${JSON.stringify({ schema: 'postcode-feedback/1-experimental', action: 'submitting-inadequacy-feedback', context, limitations: report.limitations }, null, 2)}\n`
    : `Submitting inadequacy feedback${options.displayed ? ' about the most recently displayed result' : ' without associated investigation context'}. No investigation or correction is requested.\n`;
  output.stdout(stdout);
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
  await submitObservation(sink, batch, output);
}

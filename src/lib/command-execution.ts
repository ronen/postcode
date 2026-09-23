import { commandObservation, observationBatch } from './observations.js';
import type { ObservationSink } from './observations.js';
import { AnalysisFailure, SessionInvalidated } from './session.js';
import type { ViewRequest } from './session.js';
import { CommandInterrupted } from './interactive-session.js';
import type { ExecutedView } from './interactive-session.js';
import { inlineText } from './terminal-text.js';

interface Output {
  stdout(text: string): void;
  stderr(text: string): void;
}

export async function submitObservation(sink: ObservationSink, batch: ReturnType<typeof commandObservation>, output: Output) {
  try {
    const acknowledgement = await sink.submit(batch);
    if (!acknowledgement.accepted) output.stderr(`WARNING: observation not recorded: ${inlineText(acknowledgement.reason)}\n`);
  } catch (error) {
    output.stderr(`WARNING: observation not recorded: ${inlineText(error instanceof Error ? error.message : 'sink delivery failed')}\n`);
  }
}

/** Shared publication and observation boundary for one-shot and interactive requests. */
export async function publishCommand(session: {
  readonly id: string;
  execute(request: ViewRequest): ExecutedView | Promise<ExecutedView>;
  check(): void | Promise<void>;
}, request: ViewRequest, supplied: unknown, configPath: string, command: number, output: Output, sink: ObservationSink): Promise<number> {
  let published: ExecutedView | undefined, stdout = '', stderr = '';
  let status: 'completed' | 'invalidated' | 'failed' | 'interrupted' = 'completed', code = 0;
  try {
    const result = await session.execute(request);
    await session.check();
    output.stdout(result.rendered);
    stdout = result.rendered; published = result;
    await session.check();
  } catch (error) {
    status = error instanceof SessionInvalidated ? 'invalidated' : error instanceof CommandInterrupted ? 'interrupted' : 'failed';
    code = status === 'interrupted' ? 130 : status === 'invalidated' ? 2 : error instanceof AnalysisFailure ? 3 : 1;
    stderr = `${status === 'failed' ? error instanceof AnalysisFailure ? 'Analysis failed: ' : 'Internal failure: ' : ''}${inlineText(error instanceof Error ? error.message : 'unknown defect')}\n`;
    output.stderr(stderr);
  }
  const produced = published ? observationBatch(published.view, stdout,
    { configPath, repositoryRoot: published.repositoryRoot, methods: published.methods }, command) : undefined;
  await submitObservation(sink, commandObservation(session.id, command, { supplied, request, configPath }, status, stdout, stderr, produced), output);
  return code;
}

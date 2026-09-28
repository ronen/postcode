import { commandObservation, observationBatch } from './observations.js';
import type { ObservationSink } from './observations.js';
import { AnalysisFailure, SessionInvalidated } from './execution-errors.js';
import type { ViewRequest, ExecutionOptions } from './session.js';
import { CommandInterrupted } from './execution-errors.js';
import type { ExecutedView } from './session-protocol.js';
import { inlineText } from './terminal-text.js';

interface Output {
  stdout(text: string): void;
  stderr(text: string): void;
}

export async function submitObservation(sink: ObservationSink, batch: ReturnType<typeof commandObservation>, output: Output) {
  let acknowledgement;
  try { acknowledgement = await sink.submit(batch); }
  catch (error) {
    output.stderr(`WARNING: observation not recorded: ${inlineText(error instanceof Error ? error.message : 'sink delivery failed')}\n`);
    return;
  }
  if (acknowledgement.accepted && 'cleanupWarning' in acknowledgement && typeof acknowledgement.cleanupWarning === 'string') {
    output.stderr(`WARNING: ${inlineText(acknowledgement.cleanupWarning)}\n`);
  }
  if (!acknowledgement.accepted) output.stderr(`WARNING: observation not recorded: ${inlineText(acknowledgement.reason)}\n`);
}

/** Shared publication and observation boundary for one-shot and interactive requests. */
export async function publishCommand(session: {
  readonly id: string;
  execute(request: ViewRequest, execution?: ExecutionOptions): ExecutedView | Promise<ExecutedView>;
  check(): void | Promise<void>;
}, request: ViewRequest, supplied: unknown, configPath: string, command: number, output: Output, sink: ObservationSink): Promise<number> {
  let published: ExecutedView | undefined, stdout = '', stderr = '';
  let status: 'completed' | 'invalidated' | 'failed' | 'defect' | 'interrupted' = 'completed', code = 0;
  try {
    const result = await session.execute(request, { deferPublicationCheck: true });
    await session.check();
    output.stdout(result.rendered);
    stdout = result.rendered; published = result;
    await session.check();
  } catch (error) {
    status = error instanceof SessionInvalidated ? 'invalidated' : error instanceof CommandInterrupted ? 'interrupted'
      : error instanceof AnalysisFailure ? 'failed' : 'defect';
    code = status === 'interrupted' ? 130 : status === 'invalidated' ? 2 : error instanceof AnalysisFailure ? 3 : 1;
    stderr = `${status === 'failed' ? 'Analysis failed: ' : status === 'defect' ? 'Internal failure: ' : ''}${inlineText(error instanceof Error ? error.message : 'unknown defect')}\n`;
    output.stderr(stderr);
  }
  const produced = published ? observationBatch(published.view, stdout,
    { configPath, repositoryRoot: published.repositoryRoot, methods: published.methods }, command) : undefined;
  await submitObservation(sink, commandObservation(session.id, command, { supplied, request, configPath }, status, stdout, stderr, produced), output);
  return code;
}

export function openFailureText(failure: {
  diagnostics: readonly { code: number; message: string }[];
  operational?: { operation: string; path: string; reason: string };
}): string {
  const detail = failure.operational
    ? `  ${inlineText(failure.operational.operation)}: ${inlineText(failure.operational.path)}: ${inlineText(failure.operational.reason)}`
    : failure.diagnostics.map(item => `  TS${item.code}: ${inlineText(item.message)}`).join('\n');
  return `Project open failed:\n${detail}\n`;
}

import path from 'node:path';
import type { Readable } from 'node:stream';
import { localFileObservationSink } from './observations.js';
import type { ObservationSink } from './observations.js';
import { openSession } from './session.js';
import { inlineText } from './terminal-text.js';
import { help, parseCommand } from './commands.js';
import { publishCommand } from './command-execution.js';
import { runShell } from './shell.js';

export interface CliEnvironment {
  readonly cwd: string;
  readonly checkout: string;
  readonly stdout: (text: string) => void;
  readonly stderr: (text: string) => void;
  readonly sink?: ObservationSink;
  readonly input?: Readable & { readonly isTTY?: boolean };
}

export async function runCli(args: readonly string[], environment: CliEnvironment): Promise<number> {
  const parsed = parseCommand(args, environment.cwd);
  if (parsed.kind === 'help') { environment.stdout(help); return 0; }
  if (parsed.kind === 'error') { environment.stderr(parsed.message); return 2; }
  if (parsed.kind === 'exit') return 0;
  if (parsed.kind === 'shell') return runShell(parsed, environment);
  const destination = path.resolve(environment.checkout, '_observations');
  const opened = openSession({ configPath: parsed.configPath, excludedOutputDirectories: [destination, path.resolve(environment.checkout, '_build')] });
  if (opened.status !== 'opened') {
    environment.stderr(`Project open failed:\n${opened.diagnostics.map(diagnostic => `  TS${diagnostic.code}: ${inlineText(diagnostic.message)}`).join('\n')}\n`);
    return 2;
  }
  try {
    environment.stderr(`Local observations: ${inlineText(destination)} (may contain repository-derived text and explicitly requested source locations).\n`);
    return await publishCommand(opened.session, parsed.request, args, parsed.configPath, 1,
      environment, environment.sink ?? localFileObservationSink(destination));
  } finally { opened.session.close(); }
}

import type { InvestigatorAgent } from './investigation/contracts.js';
import type { InvestigationBounds } from './investigation/execute.js';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { localFileObservationSink } from './observations.js';
import type { ObservationSink } from './observations.js';
import { interactiveSession } from './interactive-session.js';
import { CommandInterrupted, CleanupIncomplete } from './execution-errors.js';
import { inlineText } from './terminal-text.js';
import { help, parseCommand } from './commands.js';
import { publishCommand, openFailureText } from './command-execution.js';
import { runShell } from './shell.js';
import { configuredInvestigator, hostedDisclosure } from './investigation/openai/configuration.js';

export interface CliEnvironment {
  /** Internal communication-boundary injection for tests and assessment. */
  readonly investigator?: InvestigatorAgent;
  readonly investigationBounds?: InvestigationBounds;
  /** Internal setup substitution for offline tests. Production uses POSTCODE_INVESTIGATOR. */
  readonly configureInvestigator?: typeof configuredInvestigator;
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
  if (!environment.investigator) {
    const configured = await (environment.configureInvestigator ?? configuredInvestigator)(process.env.POSTCODE_INVESTIGATOR);
    if (configured.kind === 'configuration-unavailable') { environment.stderr(`${configured.diagnostic}\n`); return 2; }
    if (configured.kind === 'ready') {
      environment.stderr(hostedDisclosure);
      environment = { ...environment, investigator: configured.agent };
    }
  }
  if (parsed.kind === 'shell') return runShell(parsed, environment);
  const destination = path.resolve(environment.checkout, '_observations');
  const localSink = localFileObservationSink(destination, parsed.configPath);
  const remote = interactiveSession({ configPath: parsed.configPath, excludedOutputDirectories: [destination, path.resolve(environment.checkout, '_build')] }, { ...(environment.investigator ? { investigator: environment.investigator } : {}), ...(environment.investigationBounds ? { investigationBounds: environment.investigationBounds } : {}) });
  const interrupt = () => { void remote.interrupt().catch(() => {}); };
  process.on('SIGINT', interrupt);
  try {
    let opened;
    try { opened = await remote.opening; }
    catch (error) {
      if (error instanceof CommandInterrupted) { environment.stderr(`${error.message}\n`); return 130; }
      if (error instanceof CleanupIncomplete) { environment.stderr(`Project open failed:\n  ${inlineText(error.message)}\n`); return 2; }
      throw error;
    }
    if (opened.status !== 'opened') { environment.stderr(openFailureText(opened)); return 2; }
    environment.stderr(`Local observations: ${inlineText(localSink.destination)} (may contain repository-derived text and explicitly requested source locations).\n`);
    return await publishCommand({ id: opened.id, execute: remote.execute, check: remote.check, usage: remote.usage }, parsed.request, args, parsed.configPath, 1,
      environment, environment.sink ?? localSink);
  } finally {
    process.removeListener('SIGINT', interrupt);
    try { await remote.close(); }
    catch (error) { environment.stderr(`WARNING: ${inlineText(error instanceof Error ? error.message : 'Cleanup unconfirmed')}\n`); }
  }
}

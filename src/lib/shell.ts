import { CleanupIncomplete } from './execution-errors.js';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { commandWords, help, parseCommand } from './commands.js';
import type { CliEnvironment } from './cli.js';
import { CommandInterrupted, interactiveSession } from './interactive-session.js';
import { commandObservation, localFileObservationSink } from './observations.js';
import { publishCommand, submitObservation, openFailureText } from './command-execution.js';
import { inlineText } from './terminal-text.js';

export async function runShell(options: { configPath: string; json: boolean }, environment: CliEnvironment): Promise<number> {
  const input = environment.input ?? process.stdin;
  if (!input.isTTY) { environment.stderr('Interactive shell requires terminal stdin; piped and command-file input are unsupported.\n'); return 2; }
  const destination = path.resolve(environment.checkout, '_observations');
  const localSink = localFileObservationSink(destination, options.configPath);
  const sink = environment.sink ?? localSink;
  const remote = interactiveSession({ configPath: options.configPath, excludedOutputDirectories: [destination, path.resolve(environment.checkout, '_build')] }, { ...(environment.investigator ? { investigator: environment.investigator } : {}), ...(environment.investigationBounds ? { investigationBounds: environment.investigationBounds } : {}) });
  let busy = true;
  let inputClosed = false;
  let readline: ReturnType<typeof createInterface> | undefined;
  const prompt = () => { if (!inputClosed) readline?.prompt(); };
  const interrupt = () => {
    if (busy) void remote.interrupt().catch(() => {});
    else {
      readline?.write(null, { ctrl: true, name: 'e' });
      readline?.write(null, { ctrl: true, name: 'u' });
      // Node's dumb-terminal mode ignores editing keys. Clear the retained input
      // as well as requesting the normal terminal's visual line deletion.
      if (readline) Object.assign(readline, { line: '', cursor: 0 });
      environment.stdout('\n'); prompt();
    }
  };
  process.on('SIGINT', interrupt);
  try {
    let opened;
    try { opened = await remote.opening; }
    catch (error) {
      if (error instanceof CleanupIncomplete) { environment.stderr(`Project open failed:\n  ${inlineText(error.message)}\n`); return 2; }
      if (!(error instanceof CommandInterrupted)) throw error;
      environment.stderr(`${error.message}\n`); return 130;
    }
    if (opened.status !== 'opened') {
      environment.stderr(openFailureText(opened));
      return 2;
    }
    environment.stderr(`Local observations: ${inlineText(localSink.destination)} (may contain repository-derived text and explicitly requested source locations).\n`);
    environment.stdout(`Session ${opened.id.slice('session:'.length)}\nInputs are assumed unchanged. Use help for commands; exit or EOF to finish.\n`);
    const session = { id: opened.id, execute: remote.execute, check: remote.check, usage: remote.usage };
    const terminalOutput = new Writable({ write(chunk, _encoding, done) { environment.stdout(String(chunk)); done(); } });
    readline = createInterface({ input, output: terminalOutput, terminal: true, prompt: 'postcode> ', historySize: 0 });
    readline.on('SIGINT', interrupt);
    readline.on('close', () => { inputClosed = true; });
    let command = 0, code = 0;
    busy = false;
    prompt();
    // readline's iterator queues accepted lines; EOF does not cancel a running command.
    for await (const line of readline) {
      if (!line.trim()) { prompt(); continue; }
      busy = true;
      command++;
      let parsed;
      try { parsed = parseCommand(commandWords(line), environment.cwd, true, options.json); }
      catch (error) { parsed = { kind: 'error' as const, message: error instanceof Error ? error.message : 'Usage error.\n' }; }
      if (parsed.kind === 'view') {
        code = await publishCommand(session, parsed.request, line, options.configPath, command, environment, sink);
        if (code !== 0 && code !== 3) break;
        code = 0;
      } else {
        const stderr = parsed.kind === 'error' ? parsed.message : '';
        const stdout = parsed.kind === 'help' ? help : '';
        if (stderr) environment.stderr(stderr);
        if (stdout) environment.stdout(stdout);
        await submitObservation(sink, commandObservation(session.id, command, { supplied: line, configPath: options.configPath },
          parsed.kind === 'error' ? 'refused' : 'completed', stdout, stderr, undefined, remote.usage()), environment);
        if (parsed.kind === 'exit') break;
      }
      if (remote.interrupted) {
        const message = 'Session interrupted after command output; session ended.\n';
        environment.stderr(message);
        await submitObservation(sink, commandObservation(session.id, ++command,
          { control: 'SIGINT', phase: 'command-completion' }, 'interrupted', '', message, undefined, remote.usage()), environment);
        code = 130;
        break;
      }
      busy = false;
      prompt();
    }
    return code;
  } finally {
    process.removeListener('SIGINT', interrupt);
    readline?.close();
    try { await remote.close(); }
    catch (error) { environment.stderr(`WARNING: ${inlineText(error instanceof Error ? error.message : 'Cleanup unconfirmed')}\n`); }
  }
}

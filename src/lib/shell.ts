import path from 'node:path';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { commandWords, help, parseCommand } from './commands.js';
import type { CliEnvironment } from './cli.js';
import { CommandInterrupted, interactiveSession } from './interactive-session.js';
import { commandObservation, localFileObservationSink } from './observations.js';
import { publishCommand, submitObservation } from './command-execution.js';
import { inlineText } from './terminal-text.js';

export async function runShell(options: { configPath: string; json: boolean }, environment: CliEnvironment): Promise<number> {
  const input = environment.input ?? process.stdin;
  if (!input.isTTY) { environment.stderr('Interactive shell requires terminal stdin; piped and command-file input are unsupported.\n'); return 2; }
  const destination = path.resolve(environment.checkout, '_observations');
  const sink = environment.sink ?? localFileObservationSink(destination);
  const remote = interactiveSession({ configPath: options.configPath, excludedOutputDirectories: [destination, path.resolve(environment.checkout, '_build')] });
  let busy = true;
  let readline: ReturnType<typeof createInterface> | undefined;
  const interrupt = () => {
    if (busy) void remote.interrupt();
    else { readline?.write(null, { ctrl: true, name: 'u' }); environment.stdout('\n'); readline?.prompt(); }
  };
  process.on('SIGINT', interrupt);
  try {
    let opened;
    try { opened = await remote.opening; }
    catch (error) {
      if (!(error instanceof CommandInterrupted)) throw error;
      environment.stderr(`${error.message}\n`); return 130;
    }
    if (opened.status !== 'opened') {
      environment.stderr(`Project open failed:\n${opened.diagnostics.map(item => `  TS${item.code}: ${inlineText(item.message)}`).join('\n')}\n`);
      return 2;
    }
    environment.stderr(`Local observations: ${inlineText(destination)} (may contain repository-derived text and explicitly requested source locations).\n`);
    environment.stdout(`Session ${opened.id.slice('session:'.length)}\nInputs are assumed unchanged. Use help for commands; exit or EOF to finish.\n`);
    const session = { id: opened.id, execute: remote.execute, check: remote.check };
    const terminalOutput = new Writable({ write(chunk, _encoding, done) { environment.stdout(String(chunk)); done(); } });
    readline = createInterface({ input, output: terminalOutput, terminal: true, prompt: 'postcode> ', historySize: 0 });
    readline.on('SIGINT', interrupt);
    let command = 0, code = 0;
    busy = false;
    readline.prompt();
    // readline's iterator queues accepted lines; EOF does not cancel a running command.
    for await (const line of readline) {
      if (!line.trim()) { readline.prompt(); continue; }
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
          parsed.kind === 'error' ? 'refused' : 'completed', stdout, stderr), environment);
        if (parsed.kind === 'exit') break;
      }
      if (remote.interrupted) {
        const message = 'Session interrupted after command output; session ended.\n';
        environment.stderr(message);
        await submitObservation(sink, commandObservation(session.id, ++command,
          { control: 'SIGINT', phase: 'command-completion' }, 'interrupted', '', message), environment);
        code = 130;
        break;
      }
      busy = false;
      readline.prompt();
    }
    return code;
  } finally {
    process.removeListener('SIGINT', interrupt);
    readline?.close();
    await remote.close();
  }
}

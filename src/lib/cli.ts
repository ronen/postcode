import { authHelp, runAuthentication } from './authentication/commands.js';
import type { ChatGPTCredentials } from './application/accounts.js';
import { inlineText } from './terminal-text.js';

export interface CliEnvironment {
  readonly authentication?: ChatGPTCredentials;
  readonly stdout: (text: string) => void;
  readonly stderr: (text: string) => void;
}
const help = `PostCode authentication CLI
Investigation and shell commands have been retired. Internal application access and direct validation trials remain available.

${authHelp}`;

export async function runCli(args: readonly string[], environment: CliEnvironment): Promise<number> {
  if (args[0] === 'auth') return runAuthentication(args.slice(1), environment, environment.authentication);
  if (!args.length || args.length === 1 && ['help', '--help', '-h'].includes(args[0]!)) {
    environment.stdout(help); return 0;
  }
  environment.stderr(`Unsupported command: ${inlineText(args[0]!)}. Only authentication and help are available.\n`);
  return 2;
}

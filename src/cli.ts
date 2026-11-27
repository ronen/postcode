import { runCli } from './lib/cli.js';
import { inlineText } from './lib/terminal-text.js';

try {
  process.exitCode = await runCli(process.argv.slice(2), {
    stdout: text => { process.stdout.write(text); }, stderr: text => { process.stderr.write(text); },
  });
} catch (error) {
  process.stderr.write(`Internal failure: ${inlineText(error instanceof Error ? error.message : 'unknown defect')}\n`);
  process.exitCode = 1;
}

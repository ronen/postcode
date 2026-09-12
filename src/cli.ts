import { fileURLToPath } from 'node:url';
import { runCli } from './lib/cli.js';

try {
  process.exitCode = await runCli(process.argv.slice(2), {
    cwd: process.cwd(), checkout: fileURLToPath(new URL('../../', import.meta.url)),
    stdout: text => { process.stdout.write(text); }, stderr: text => { process.stderr.write(text); },
  });
} catch (error) {
  process.stderr.write(`Internal failure: ${error instanceof Error ? error.message : 'unknown defect'}\n`);
  process.exitCode = 1;
}

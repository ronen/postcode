/** Development CLI harness. One fresh shell per spec, with exact captures and a
 * shared finite request ledger. Optional stdin commands are incremental controls. */
import { PassThrough } from 'node:stream';
import { createInterface } from 'node:readline';
import { mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { verifyConfiguration } from './verify-configuration.mjs';
import { runCli } from '../../_build/src/lib/cli.js';
import { chatGPTInvestigator } from '../../_build/src/lib/investigation/openai/adapter.js';
import { productionChatGPTCredentials } from '../../_build/src/lib/investigation/openai/auth-command.js';
import { requestBudget } from './request-budget.mjs';

export async function runAssessment(spec, dependencies = {}) {
for (const field of ['id', 'project', 'output', 'budget', 'pass']) if (typeof spec[field] !== 'string' || !spec[field]) throw new Error(`Missing ${field}`);
(dependencies.verify ?? verifyConfiguration)(spec);
mkdirSync(spec.output, { recursive: false, mode: 0o700 });
const save = (file, value) => writeFileSync(path.join(spec.output, file), value, { mode: 0o600 });
const append = (file, value) => appendFileSync(path.join(spec.output, file), value, { mode: 0o600 });
save('spec.json', JSON.stringify(spec, null, 2) + '\n');
const started = performance.now(), input = Object.assign(new PassThrough(), { isTTY: true });
let budget;
let ready = false, ordinal, pausedForBudget = false, exit = null, commands = [...(spec.commands ?? [])];
const send = () => {
  if (!ready || !commands.length) return;
  ready = false;
  const command = commands.shift();
  append('commands.jsonl', JSON.stringify({ command, at: new Date().toISOString() }) + '\n');
  setImmediate(() => input.write(`${command}\n`));
};
const controls = spec.incremental ? createInterface({ input: process.stdin }) : null;
controls?.on('line', line => { commands.push(line); send(); });
try {
  budget = requestBudget(spec.budget);
  const session = await (dependencies.session ? dependencies.session() : (await productionChatGPTCredentials()).session());
  const agent = chatGPTInvestigator(session, {
    fetch: async (url, options) => {
      if (String(url) !== 'https://api.openai.com/v1/responses') throw new Error('Unexpected inference endpoint');
      ordinal = budget.reserve(spec.id);
      if (ordinal === null) { pausedForBudget = true; throw new Error('Assessment request allowance reached; pause, not milestone failure'); }
      try {
        const response = await (dependencies.fetch ?? fetch)(url, options);
        budget.record(ordinal, { status: 'response-headers-received', httpStatus: response.status }); return response;
      } catch (error) { budget.record(ordinal, { status: 'transport-failed', usage: null }); throw error; }
    },
    onExchange: exchange => {
      append('exchanges.jsonl', JSON.stringify(exchange) + '\n');
      if (ordinal) budget.record(ordinal, { status: exchange.failure ? 'failed' : 'response-received',
        usage: exchange.response?.usage ?? null, failure: exchange.failure?.code ?? null });
    },
  });
  exit = await (dependencies.runCli ?? runCli)(['shell', '--project', spec.project, ...(spec.json ? ['--json'] : [])], {
    cwd: process.cwd(), checkout: process.cwd(), input,
    configureInvestigator: async () => ({ kind: 'ready', agent }),
    ...(spec.bounds ? { investigationBounds: spec.bounds } : {}),
    stdout: text => { append('stdout.txt', text); if (text.endsWith('postcode> ')) { ready = true; process.stdout.write('READY\n'); send(); } },
    stderr: text => { append('stderr.txt', text); },
    sink: { async submit(batch) { append('observations.jsonl', JSON.stringify(batch) + '\n'); return { accepted: true }; } },
  });
} catch (error) {
  dependencies.onError?.(error);
  // Detailed provider failures are already captured by the credential-safe adapter.
  save('runner-error.txt', 'Harness did not complete. No raw exception or credential is disclosed.\n');
  exit = 2;
} finally {
  controls?.close(); input.end(); budget?.close();
  const result = { exit, elapsedMilliseconds: Math.round(performance.now() - started), pausedForBudget,
    disposition: pausedForBudget ? 'administrative-pause-not-milestone-failure' : 'inspect-recorded-outcome' };
  save('result.json', JSON.stringify(result, null, 2) + '\n'); process.stdout.write(JSON.stringify(result) + '\n');
}
return exit ?? 2;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.argv.length !== 3) throw new Error('Usage: node run-shell.mjs <spec.json>');
  process.exitCode = await runAssessment(JSON.parse(readFileSync(process.argv[2], 'utf8')));
}

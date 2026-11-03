/** Bounded real-investigator sample for the approved reconciliation plan.
 * Run against an isolated, committed copy of fixtures/human-output. No credential values are recorded.
 */
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { openSession } from '../_build/src/lib/session.js';
import { configuredInvestigator } from '../_build/src/lib/investigation/openai/configuration.js';
import { renderInvestigationView } from '../_build/src/lib/investigation/presentation.js';
const [fixture, output] = process.argv.slice(2).map(item => path.resolve(item));
if (!fixture || !output) throw new Error('Supply isolated fixture and new output directory');
mkdirSync(output, { recursive: false });
const save = (name, data) => writeFileSync(path.join(output, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
const basis = { fixture: 'fixtures/human-output', commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: fixture, encoding: 'utf8' }).trim(),
  files: Object.fromEntries(readdirSync(fixture).filter(name => !name.startsWith('.')).map(name => [name, createHash('sha256').update(readFileSync(path.join(fixture, name))).digest('hex')])) };
save('basis.json', basis);
const configured = await configuredInvestigator('chatgpt');
if (configured.kind !== 'ready') {
  save('unavailable.json', configured); console.log('Real investigator unavailable; coverage incomplete.'); process.exitCode = 2;
} else {
  save('agent.json', configured.agent.identity);
  const opened = await openSession({ configPath: path.join(fixture, 'tsconfig.json'), excludedOutputDirectories: [output] },
    { investigation: { agent: configured.agent, bounds: { milliseconds: 180000, calls: 20, toolCalls: 60, characters: 1000000 } } });
  if (opened.status !== 'opened') { save('opening.json', opened); process.exitCode = 2; }
  else {
    const session = opened.session; let root;
    try {
      for (const lens of ['summarize', 'explain', 'decompose', 'examine']) {
        if (lens !== 'summarize' && !root) { save(`${lens}-unavailable.json`, { reason: 'No completed initial account; no follow-up subject available.' }); continue; }
        console.log(`Starting ${lens}`);
        try {
          const result = await session.execute({ lens, selector: lens === 'summarize' ? 'catalog' : root,
            ...(lens !== 'summarize' ? { reference: true } : {}), presentation: { format: 'json', moreDetails: false } });
          save(`${lens}.json`, result); save(`${lens}-usage.json`, session.usage());
          if (result.kind === 'view' && result.view.schema === 'postcode-investigation-view/1-experimental') {
            save(`${lens}.txt`, renderInvestigationView({ ...result.view, presentation: { ...result.view.presentation, format: 'unicode' } }));
            if (lens === 'summarize') root = result.view.accounts[0]?.id;
          }
          console.log(`${lens}: ${result.kind}, ${result.failed ? 'failed' : 'completed'}`);
        } catch {
          // Provider diagnostics and actual instruction attribution are in the credential-safe attempt reports.
          save(`${lens}-failure.json`, { status: 'failed', usage: session.usage(), work: session.work() }); console.log(`${lens}: failed`);
        }
      }
    } finally { save('usage.json', session.usage()); await session.close(); }
  }
}

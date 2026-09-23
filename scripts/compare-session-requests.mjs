import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { openSession } from '../_build/src/lib/session.js';
import { interactiveSession } from '../_build/src/lib/interactive-session.js';

const normalize = value => JSON.parse(JSON.stringify(value).replace(/session:[a-f0-9-]{36}/g, 'session:normalized').replace(/Session [a-f0-9-]{36}/g, 'Session normalized'));
const reports = [];
for (const fixture of ['dependency-journey', 'dependency-contract', 'exports']) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-session-comparison-'));
  try {
    cpSync(`fixtures/${fixture}`, root, { recursive: true });
    execFileSync('git', ['init', '--quiet', root]);
    const options = { configPath: path.join(root, 'tsconfig.json') };
    const selector = fixture === 'dependency-journey' ? 'forward' : fixture === 'dependency-contract' ? 'requests' : 'origin';
    const commands = [{ lens: 'modules' }, { lens: 'organization', subject: 'project' }, { lens: 'organization', subject: 'repository' },
      { lens: 'inspect', selector }, { lens: 'inspect', selector, detail: true }, { lens: 'dependencies' }, { lens: 'dependencies', detail: true },
      { lens: 'children', selector, detail: true }, { lens: 'parents', selector, detail: true }]
      .flatMap(command => ['json', 'unicode'].map(format => ({ lens: command.lens, selector: command.selector ?? null,
        ...(command.subject ? { subject: command.subject } : {}), presentation: { format, sourceDetail: command.detail ?? false } })));
    const shell = interactiveSession(options), reversed = interactiveSession(options);
    assert.equal((await shell.opening).status, 'opened');
    assert.equal((await reversed.opening).status, 'opened');
    try {
      const expected = [];
      for (const command of commands) {
        const fresh = openSession(options);
        assert.equal(fresh.status, 'opened');
        try {
          const single = fresh.session.execute(command);
          const accumulated = await shell.execute(command);
          assert.deepEqual(normalize(accumulated), normalize(single), `${fixture}: ${JSON.stringify(command)}`);
          expected.push(accumulated);
        } finally { fresh.session.close(); }
      }
      for (const index of [...commands.keys()].reverse()) {
        assert.deepEqual(normalize(await reversed.execute(commands[index])), normalize(expected[index]), `${fixture}: reordered ${index}`);
        assert.deepEqual(await shell.execute(commands[index]), expected[index], `${fixture}: retained ${index}`);
      }
      reports.push({ fixture, requests: commands.length, comparisons: commands.length * 3, equivalent: true });
      console.log(`${fixture}: ${commands.length * 3} complete view/output comparisons passed`);
    } finally { await shell.close(); await reversed.close(); }
  } finally { rmSync(root, { recursive: true, force: true }); }
}
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(reports, null, 2) + '\n');

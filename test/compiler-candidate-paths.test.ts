import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { captureInputs } from '../src/lib/typescript/inputs.js';
import { openSession, SessionInvalidated } from '../src/lib/session.js';
import { runCli } from '../src/lib/cli.js';
import { temporaryDirectory, invokeCli, interactionDriver } from './cli-helpers.js';

for (const failure of ['cycle', 'unreadable'] as const) {
  test(`ordinary ${failure} compiler candidates stay absent, replay recovery, and open through both CLI entry paths`, async t => {
    const root = temporaryDirectory(t, 'postcode-candidate-path-');
    const configPath = path.join(root, 'tsconfig.json');
    const candidate = path.join(root, 'node_modules/subject');
    mkdirSync(path.dirname(candidate), { recursive: true });
    writeFileSync(path.join(root, '.gitignore'), 'node_modules/\n');
    writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[],"module":"nodenext"},"files":["main.ts"]}');
    writeFileSync(path.join(root, 'main.ts'), "import { value } from 'subject'; export const result = value;\n");
    execFileSync('git', ['init', '--quiet', root]);
    const recover = () => {
      if (failure === 'cycle') { rmSync(candidate); mkdirSync(candidate); }
      else chmodSync(candidate, 0o700);
      writeFileSync(path.join(candidate, 'package.json'), '{"types":"index.d.ts"}');
      writeFileSync(path.join(candidate, 'index.d.ts'), 'export declare const value: number;\n');
    };
    try {
      if (failure === 'cycle') symlinkSync('subject', candidate);
      else {
        mkdirSync(candidate); writeFileSync(path.join(candidate, 'package.json'), '{}');
        chmodSync(candidate, 0);
        assert.throws(() => readFileSync(path.join(candidate, 'package.json')), { code: 'EACCES' });
      }
      const outputs = [path.join(root, '_observations'), path.join(root, '_build')];
      const captured = captureInputs(outputs);
      const file = path.join(candidate, 'package.json');
      assert.equal(captured.system.fileExists(file), false);
      assert.equal(captured.system.readFile(file), undefined);
      assert.equal(captured.system.directoryExists!(candidate), failure === 'unreadable');
      assert.deepEqual(captured.system.getDirectories(candidate), []);
      assert.deepEqual(captured.system.readDirectory(candidate), []);
      assert.equal(captured.changed(), false);
      const opened = await openSession({ configPath, excludedOutputDirectories: outputs });
      assert.equal(opened.status, 'opened'); if (opened.status !== 'opened') return;
      t.after(() => opened.session.close());
      await opened.session.check();
      await opened.session.execute({ lens: 'dependencies', selector: null, presentation: { format: 'json', sourceDetail: false } });
      const cli = await invokeCli(['modules', '--project', configPath, '--json'], { checkout: root });
      assert.equal(cli.exit, 0, cli.stderr); assert.equal(cli.batches.length, 1);
      const input = Object.assign(new PassThrough(), { isTTY: true });
      const driver = interactionDriver(() => input.end());
      let ready = false, error = '', batches = 0;
      const shell = await runCli(['shell', '--project', configPath, '--json'], { cwd: root, checkout: root, input,
        stderr: text => { error += text; }, stdout: text => {
          if (!ready && text.includes('postcode> ')) { ready = true; driver.run(() => input.end('modules\n')); }
        }, sink: { async submit() { batches++; return { accepted: true }; } },
      });
      driver.verify(); assert.equal(shell, 0, error); assert.equal(batches, 1);
      recover();
      assert.equal(captured.changed(), true);
      await assert.rejects(opened.session.check(), SessionInvalidated);
    } finally { if (failure === 'unreadable' && existsSync(candidate)) chmodSync(candidate, 0o700); }
  });
}

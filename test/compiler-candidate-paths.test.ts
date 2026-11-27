import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { captureInputs } from '../src/lib/typescript/inputs.js';
import { openApplication as openSession, SessionInvalidated } from '../src/lib/application/index.js';
import { temporaryDirectory } from './temporary-directory.js';

for (const failure of ['cycle', 'unreadable'] as const) {
  test(`ordinary ${failure} compiler candidates stay absent, replay recovery, and open through the application boundary`, async t => {
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
      await opened.session.execute({ kind: 'lens', lens: 'dependency-structure', designation: { kind: 'configured-project' } });
      recover();
      assert.equal(captured.changed(), true);
      await assert.rejects(opened.session.check(), SessionInvalidated);
    } finally { if (failure === 'unreadable' && existsSync(candidate)) chmodSync(candidate, 0o700); }
  });
}

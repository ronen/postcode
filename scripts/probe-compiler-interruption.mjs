import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Run after npm run build. Native SIGINT ends this one-shot process even while
// synchronous compiler work prevents JavaScript signal callbacks from running.
if (process.argv[2] === '--child') {
  const ts = (await import('typescript')).default;
  const read = ts.sys.readFile;
  ts.sys.readFile = (name, encoding) => {
    const result = read(name, encoding);
    if (name.endsWith('/large.ts')) process.send({ phase: 'compiler-source-read', stack: new Error().stack });
    return result;
  };
  const { runCli } = await import('../_build/src/lib/cli.js');
  const exit = await runCli(['modules', '--json', '--project', process.argv[3]], {
    cwd: process.cwd(), checkout: process.cwd(), stdout: () => process.send({ phase: 'view-published' }), stderr: () => {},
    sink: { async submit() { return { accepted: true }; } },
  });
  process.send({ phase: 'finished', exit });
  process.disconnect();
} else {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-compiler-interruption-'));
  try {
    mkdirSync(path.join(root, 'project'));
    const config = path.join(root, 'project/tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["large.ts"]}');
    writeFileSync(path.join(root, 'project/large.ts'), Array.from({ length: 80000 }, (_, i) => `const value${i} = ${i};`).join('\n') + '\nexport { value0 };\n');
    const run = interrupt => new Promise((resolve, reject) => {
      const child = fork(fileURLToPath(import.meta.url), ['--child', config], { stdio: ['ignore', 'ignore', 'pipe', 'ipc'] });
      const phases = []; let compilerStack = ''; let signalledAt; let errors = '';
      const started = performance.now();
      const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('Compiler probe timed out')); }, 60000);
      child.stderr.on('data', text => { errors += text; });
      child.on('error', reject);
      child.on('message', message => {
        phases.push(message.phase);
        if (message.phase === 'compiler-source-read') {
          compilerStack = message.stack;
          if (interrupt) setTimeout(() => { signalledAt = performance.now(); child.kill('SIGINT'); }, 20);
        }
      });
      child.on('exit', (code, signal) => {
        clearTimeout(timer);
        try {
          assert.match(compilerStack, /host.getSourceFile/);
          assert.equal(errors, '');
          if (interrupt) {
            assert.equal(signal, 'SIGINT');
            assert.equal(phases.includes('view-published'), false);
            assert.equal(phases.includes('finished'), false);
          } else {
            assert.equal(code, 0);
            assert.ok(phases.includes('view-published'));
            assert.ok(phases.includes('finished'));
          }
          resolve({ interrupted: interrupt, phases, code, signal, elapsedMs: performance.now() - started,
            ...(signalledAt === undefined ? {} : { signalToExitMs: performance.now() - signalledAt }) });
        } catch (error) { reject(error); }
      });
    });
    console.log(JSON.stringify({ compiler: 'typescript@6.0.3', declarations: 80000, control: await run(false), interrupted: await run(true) }, null, 2));
  } finally { rmSync(root, { recursive: true, force: true }); }
}

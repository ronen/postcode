import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Run after npm run build. Instrument only a disposable compiled copy so the
// parent can signal while the private worker is inside synchronous compiler work.
if (process.argv[2] === '--child') {
  const { runCli } = await import(pathToFileURL(path.join(process.argv[4], 'src/lib/cli.js')));
  const exit = await runCli(['modules', '--json', '--project', process.argv[3]], {
    cwd: process.cwd(), checkout: process.cwd(), stdout: () => process.send({ phase: 'view-published' }), stderr: () => {},
    sink: { async submit() { return { accepted: true }; } },
  });
  process.send({ phase: 'finished', exit });
  process.exitCode = exit;
  process.disconnect();
} else {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-compiler-interruption-'));
  try {
    const build = path.join(root, 'build');
    cpSync('_build/src', path.join(build, 'src'), { recursive: true });
    writeFileSync(path.join(build, 'package.json'), '{"type":"module"}');
    symlinkSync(path.resolve('node_modules'), path.join(build, 'node_modules'), 'dir');
    const worker = path.join(build, 'src/lib/session-worker.js');
    writeFileSync(worker, `import ts from 'typescript';
const probeRead = ts.sys.readFile;
ts.sys.readFile = (name, encoding) => {
  const result = probeRead(name, encoding);
  if (name.endsWith('/large.ts')) parentPort.postMessage({ phase: 'compiler-source-read', stack: new Error().stack });
  return result;
};
` + readFileSync(worker, 'utf8'));
    const parent = path.join(build, 'src/lib/interactive-session.js');
    let source = readFileSync(parent, 'utf8');
    const listener = "worker.on('message', (message) => {";
    assert.ok(source.includes(listener));
    source = source.replace(listener, listener + "\nif (message.phase) { process.send(message); return; }");
    writeFileSync(parent, source);
    mkdirSync(path.join(root, 'project'));
    const config = path.join(root, 'project/tsconfig.json');
    writeFileSync(config, '{"compilerOptions":{"noLib":true,"types":[]},"files":["large.ts"]}');
    writeFileSync(path.join(root, 'project/large.ts'), Array.from({ length: 80000 }, (_, i) => `const value${i} = ${i};`).join('\n') + '\nexport { value0 };\n');
    const run = interrupt => new Promise((resolve, reject) => {
      const child = fork(fileURLToPath(import.meta.url), ['--child', config, build], { stdio: ['ignore', 'ignore', 'pipe', 'ipc'] });
      const phases = []; let outcome; let compilerStack = ''; let signalledAt; let interruptTimer; let errors = '';
      const started = performance.now();
      const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('Compiler probe timed out')); }, 60000);
      child.stderr.on('data', text => { errors += text; });
      child.on('error', reject);
      child.on('message', message => {
        phases.push(message.phase);
        if (message.phase === 'finished') outcome = message.exit;
        if (message.phase === 'compiler-source-read' && !compilerStack) {
          compilerStack = message.stack;
          if (interrupt) interruptTimer = setTimeout(() => { signalledAt = performance.now(); child.kill('SIGINT'); }, 20);
        }
      });
      child.on('exit', (code, signal) => {
        clearTimeout(timer); clearTimeout(interruptTimer);
        try {
          assert.match(compilerStack, /host.getSourceFile/);
          assert.equal(errors, '');
          if (interrupt) {
            assert.equal(signal, null);
            assert.equal(code, 130);
            assert.equal(outcome, 130);
            assert.equal(phases.includes('view-published'), false);
            assert.equal(phases.includes('finished'), true);
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

import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { PassThrough } from 'node:stream';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// An instrumented copy adds only a marker immediately before the real checker call.
// Ctrl-C travels through the production readline handler, worker termination and observation path.
const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-session-interrupt-'));
try {
  cpSync('_build/src', path.join(root, 'src'), { recursive: true });
  writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
  symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'));
  const marker = path.join(root, 'checker-started');
  const provider = path.join(root, 'src/lib/typescript/project.js');
  const original = readFileSync(provider, 'utf8');
  assert.ok(original.includes('const checker = program.getTypeChecker();'));
  writeFileSync(provider, "import { writeFileSync as mark, renameSync as publishMarker } from 'node:fs';\n" + original.replace('const checker = program.getTypeChecker();',
    `mark(${JSON.stringify(marker + ".pending")}, new Error().stack); publishMarker(${JSON.stringify(marker + ".pending")}, ${JSON.stringify(marker)});\nconst checker = program.getTypeChecker();`));
  mkdirSync(path.join(root, 'project'));
  const configPath = path.join(root, 'project/tsconfig.json');
  writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["large.ts"]}');
  writeFileSync(path.join(root, 'project/large.ts'), Array.from({ length: 80000 }, (_, i) => `const value${i} = ${i};`).join('\n') + '\nexport { value0 };\n');
  const { runCli } = await import(pathToFileURL(path.join(root, 'src/lib/cli.js')));
  async function run(interrupt) {
    rmSync(marker, { force: true });
    const input = Object.assign(new PassThrough(), { isTTY: true });
    const batches = [];
    const started = performance.now();
    let ready = false, openingMs = 0, finished = false;
    const operation = runCli(['shell', '--project', configPath, '--json'], {
      cwd: root, checkout: root, input, stderr: () => {},
      stdout: text => {
        if (!ready && text.includes('postcode> ')) {
          ready = true; openingMs = performance.now() - started;
          setImmediate(() => input.write('modules\n'));
        }
      },
      sink: { async submit(batch) { batches.push(batch); setImmediate(() => input.end()); return { accepted: true }; } },
    });
    const settled = operation.then(code => { finished = true; return code; });
    const deadline = Date.now() + 30000;
    while (!existsSync(marker)) {
      assert.ok(Date.now() < deadline && !finished, 'Real checker marker must precede completion');
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    assert.match(readFileSync(marker, 'utf8'), /prepareDiscovery/);
    let signalled;
    if (interrupt) {
      await new Promise(resolve => setTimeout(resolve, 20));
      assert.equal(finished, false, 'Compiler-backed request must still be running');
      signalled = performance.now();
      input.write('\x03');
    }
    const exitCode = await settled;
    assert.equal(exitCode, interrupt ? 130 : 0);
    assert.equal(batches.length, 1);
    const viewReturned = batches[0].events.some(event => event.type === 'view-produced');
    assert.equal(viewReturned, !interrupt);
    assert.ok(batches[0].events.some(event => event.type === (interrupt ? 'command-interrupted' : 'command-completed')));
    return { openingMs, commandMs: performance.now() - started - openingMs,
      ...(signalled === undefined ? {} : { interruptionToExitMs: performance.now() - signalled }), exitCode,
      viewReturned, events: batches[0].events.map(event => event.type) };
  }

  console.log(JSON.stringify({ compiler: 'typescript@6.0.3', declarations: 80000, control: await run(false), interrupted: await run(true) }, null, 2));
} finally { rmSync(root, { recursive: true, force: true }); }

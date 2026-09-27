// Experiment: compiler-input exclusions (typescript/inputs.ts) and repository-capture
// exclusions (repository/capture.ts) resolve the same configured output directory
// independently. Compare them when the output location is a dangling symlink, and
// check whether compiler inputs and repository evidence then agree about a file
// reached through the link once its target exists.
// Usage: node this.mjs <build-dir>
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [build] = process.argv.slice(2);
const { captureInputs } = await import(pathToFileURL(path.join(build, 'src/lib/typescript/inputs.js')));
const { captureRepository } = await import(pathToFileURL(path.join(build, 'src/lib/repository/capture.js')));
const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'postcode-exclusion-divergence-')));
try {
  execFileSync('git', ['init', '--quiet', root]);
  writeFileSync(path.join(root, 'tsconfig.json'), '{"files":[]}');
  const output = path.join(root, 'out');
  symlinkSync(path.join(root, 'elsewhere', 'target'), output); // dangling at open time
  const inputs = captureInputs([output]);
  const capture = captureRepository(path.join(root, 'tsconfig.json'), [output]);
  const inputReal = inputs.identity().exclusions.map(e => e.real);
  const captureReal = capture.status === 'available' ? capture.evidence.excludedOutputDirectories.map(e => e.real) : capture;
  console.log('compiler-input exclusion real paths:', JSON.stringify(inputReal.map(p => path.relative(root, p))));
  console.log('repository exclusion real paths:   ', JSON.stringify(captureReal.map(p => path.relative(root, p))));
  mkdirSync(path.join(root, 'elsewhere', 'target'), { recursive: true });
  const probe = path.join(root, 'elsewhere', 'target', 'generated.ts');
  writeFileSync(probe, 'export {};');
  console.log('after target creation: compiler inputs exclude elsewhere/target/generated.ts:', inputs.excluded(probe));
  console.log('inputs.changed() after target creation:', inputs.changed());
} finally { rmSync(root, { recursive: true, force: true }); }

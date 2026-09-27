// Experiment: an assertion that fails inside an observation sink's submit() is
// caught by submitObservation and turned into a stderr warning, so the command
// (and a test awaiting it) still succeeds.
// Usage: node this.mjs <build-dir> <tsconfig>
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [build, config] = process.argv.slice(2);
const { runCli } = await import(pathToFileURL(path.join(build, 'src/lib/cli.js')));
let stderr = '';
const code = await runCli(['modules', '--project', config, '--json'], {
  cwd: process.cwd(), checkout: path.dirname(config), stdout: () => {}, stderr: text => { stderr += text; },
  sink: { async submit() { assert.equal(1, 2, 'deliberately failing assertion inside sink'); return { accepted: true }; } },
});
console.log('exit code:', code);
console.log('stderr warning line:', stderr.split('\n').find(line => line.startsWith('WARNING')));

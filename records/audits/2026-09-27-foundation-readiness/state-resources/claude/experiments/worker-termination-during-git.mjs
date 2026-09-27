// Experiment: does interrupting the analysis worker end promptly while repository
// capture is blocked in spawnSync(git), and is the git child left running?
// Usage: PATH=<dir with slow fake git>:$PATH FAKEGIT_LOG=<log> node this.mjs <build-dir> <tsconfig>
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [build, config] = process.argv.slice(2);
const { interactiveSession } = await import(pathToFileURL(path.join(build, 'src/lib/interactive-session.js')));
const remote = interactiveSession({ configPath: config });
const opening = remote.opening.then(v => ({ ok: v.status }), e => ({ rejected: e.constructor.name }));
await new Promise(r => setTimeout(r, 1500)); // TS program is tiny; capture is now inside the first sleeping git
const started = performance.now();
const termination = remote.interrupt();
console.log('opening settled as', JSON.stringify(await opening), 'after', Math.round(performance.now() - started), 'ms');
await termination;
console.log('worker.terminate() resolved after', Math.round(performance.now() - started), 'ms');
const pids = readFileSync(process.env.FAKEGIT_LOG, 'utf8').trim().split('\n').map(l => l.split(' ')[0]);
for (const pid of pids) {
  let alive = true; try { process.kill(Number(pid), 0); } catch { alive = false; }
  console.log(`fake git pid ${pid} still running after terminate: ${alive}`);
}
console.log('git invocations started:', pids.length);

// Times session requests against one configured project, in-process (no worker, no observation sink).
// Usage: node measure-requests.mjs BUILD_DIR TSCONFIG OUTPUT_JSON
// Each request runs twice: the first includes any evaluation it triggers; the second
// measures steady-state projection/view/render work after evaluation reuse.
import path from 'node:path';
import { writeFileSync } from 'node:fs';

const [build, config, output] = process.argv.slice(2);
const { openSession } = await import(path.resolve(build, 'src/lib/session.js'));
const t = () => performance.now();
let started = t();
const opened = openSession({ configPath: path.resolve(config) });
if (opened.status !== 'opened') throw new Error(JSON.stringify(opened));
const results = { config, openMs: t() - started, requests: [], checks: [] };
const { session } = opened;
const unicode = { format: 'unicode', sourceDetail: false };
const json = { format: 'json', sourceDetail: false };
const run = (label, request) => {
  for (const pass of [1, 2]) {
    const s = t();
    const result = session.execute(request, { deferPublicationCheck: true });
    const ms = t() - s;
    results.requests.push({ label, pass, ms, renderedBytes: result.rendered.length });
  }
};
const check = label => { const s = t(); session.check(); results.checks.push({ label, ms: t() - s }); };
check('initial');
run('modules unicode', { lens: 'modules', selector: null, presentation: unicode });
run('modules json', { lens: 'modules', selector: null, presentation: json });
run('inspect mod1 unicode', { lens: 'inspect', selector: 'mod1', presentation: unicode });
run('organization project unicode', { lens: 'organization', selector: null, subject: 'project', presentation: unicode });
run('organization repository json', { lens: 'organization', selector: null, subject: 'repository', presentation: json });
run('dependencies unicode', { lens: 'dependencies', selector: null, presentation: unicode });
run('dependencies json', { lens: 'dependencies', selector: null, presentation: json });
run('children mod1 json', { lens: 'children', selector: 'mod1', presentation: json });
check('after requests');
check('repeat');
results.memoryMB = Math.round(process.memoryUsage().heapUsed / 1e6);
writeFileSync(output, JSON.stringify(results, null, 2));
for (const r of results.requests) console.log(`${r.label.padEnd(34)} pass ${r.pass} ${r.ms.toFixed(0).padStart(8)} ms`);
for (const c of results.checks) console.log(`check ${c.label.padEnd(28)} ${c.ms.toFixed(0).padStart(8)} ms`);
console.log(`open ${results.openMs.toFixed(0)} ms, heap ${results.memoryMB} MB`);

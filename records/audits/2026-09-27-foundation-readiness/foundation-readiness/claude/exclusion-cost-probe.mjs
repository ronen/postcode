// Count live ts.sys calls made by captureInputs' exclusion filter versus memoized host observations.
import ts from 'typescript';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
const counts = { fileExists: 0, directoryExists: 0, realpath: 0 };
for (const name of Object.keys(counts)) { const original = ts.sys[name]; ts.sys[name] = (...args) => { counts[name]++; return original.apply(ts.sys, args); }; }
const { openTypeScriptProject } = await import('./build/src/lib/typescript/project.js');
const { MemoryProgramRecordStore } = await import('./build/src/lib/memory-store.js');
const { evaluateModules } = await import('./build/src/lib/evaluation.js');
const checkout = path.resolve('..');
const out = {};
for (const exclusions of [[], [path.join(checkout, '_observations'), path.join(checkout, '_build')]]) {
  Object.keys(counts).forEach(key => { counts[key] = 0; });
  let t = performance.now();
  const opened = openTypeScriptProject({ configPath: path.join(checkout, 'tsconfig.json'), excludedOutputDirectories: exclusions });
  const store = new MemoryProgramRecordStore();
  evaluateModules(store, opened.analysis, ['exports', 'documentation', 'composition']);
  const openMs = performance.now() - t;
  const afterOpen = { ...counts };
  Object.keys(counts).forEach(key => { counts[key] = 0; });
  t = performance.now();
  const changed = opened.changed();
  const checkMs = performance.now() - t;
  out[exclusions.length ? 'withCliExclusions' : 'withoutExclusions'] = { openAndDiscover: { ms: Math.round(openMs), liveCalls: afterOpen }, oneValidation: { changed, ms: Math.round(checkMs), liveCalls: { ...counts } } };
}
writeFileSync(new URL('./exclusion-cost-results.json', import.meta.url), `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify(out, null, 2));

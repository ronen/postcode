// Summarizes self and inclusive time by function location for a .cpuprofile.
// Usage: node summarize-profile.mjs PROFILE [TOP=25]
import { readFileSync } from 'node:fs';
const [file, top = '25'] = process.argv.slice(2);
const profile = JSON.parse(readFileSync(file, 'utf8'));
const nodes = new Map(profile.nodes.map(node => [node.id, node]));
const parent = new Map();
for (const node of profile.nodes) for (const child of node.children ?? []) parent.set(child, node.id);
const hits = new Map();
const deltas = profile.timeDeltas; const samples = profile.samples;
for (let i = 0; i < samples.length; i++) hits.set(samples[i], (hits.get(samples[i]) ?? 0) + (deltas[i + 1] ?? 0));
const label = node => { const f = node.callFrame; const url = f.url.replace(/^.*\/_build\//, '').replace(/^.*node_modules\//, 'nm/'); return `${f.functionName || '(anon)'} ${url}:${f.lineNumber + 1}`; };
const self = new Map(), inclusive = new Map();
for (const [id, us] of hits) {
  const node = nodes.get(id); const key = label(node);
  self.set(key, (self.get(key) ?? 0) + us);
  const seen = new Set();
  for (let cur = id; cur !== undefined; cur = parent.get(cur)) { const k = label(nodes.get(cur)); if (seen.has(k)) continue; seen.add(k); inclusive.set(k, (inclusive.get(k) ?? 0) + us); }
}
const total = [...hits.values()].reduce((a, b) => a + b, 0);
const show = (title, map) => { console.log(`\n${title} (total ${(total / 1000).toFixed(0)} ms)`); [...map].filter(([k]) => title.startsWith('Self') || k.includes('src/lib')).sort((a, b) => b[1] - a[1]).slice(0, Number(top)).forEach(([k, us]) => console.log(`${(us / 1000).toFixed(0).padStart(8)} ms ${(100 * us / total).toFixed(1).padStart(5)}%  ${k}`)); };
show('Self time', self); show('Inclusive time (src/lib frames)', inclusive);

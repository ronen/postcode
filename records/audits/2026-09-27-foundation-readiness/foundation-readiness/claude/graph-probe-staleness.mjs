// Supplementary check: does in-place mutation produce stale answers from CSR-backed algorithms?
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
const here = path.dirname(fileURLToPath(import.meta.url));
const stately = path.resolve(here, '../_codex-library-reuse-audit/graph-research/probe/node_modules/@statelyai/graph/dist');
const { createGraph } = await import(path.join(stately, 'index.mjs'));
const { getStronglyConnectedComponents, genDFS, hasPath } = await import(path.join(stately, 'algorithms.mjs'));
const out = [];
const graph = createGraph({ mode: 'directed', nodes: [{ id: 'a' }, { id: 'b' }], edges: [{ id: 'e1', sourceId: 'a', targetId: 'b' }, { id: 'e2', sourceId: 'b', targetId: 'b' }] });
out.push({ before: getStronglyConnectedComponents(graph).map(c => c.map(n => n.id)) });
graph.edges[1].targetId = 'a'; // in-place: creates cycle a<->b
out.push({ afterInPlaceMutation: getStronglyConnectedComponents(graph).map(c => c.map(n => n.id)), freshWouldBe: [['a', 'b']] });
// Linear alternative for reachability: incoming/outgoing genDFS membership test.
const reach = (g, from, to) => { for (const node of genDFS(g, { from: [from] })) if (node.id === to) return true; return false; };
for (const width of [10000, 50000, 100000]) {
  const nodes = [{ id: 'root' }, ...Array.from({ length: width }, (_, i) => ({ id: `n${i}` })), { id: 'missing' }];
  const g = createGraph({ mode: 'directed', nodes, edges: Array.from({ length: width }, (_, i) => ({ id: `e${i}`, sourceId: 'root', targetId: `n${i}` })) });
  reach(g, 'root', 'n0'); hasPath(g, 'root', 'n0');
  let t = process.hrtime.bigint(); const a = reach(g, 'root', 'missing'); const dfsMs = Number(process.hrtime.bigint() - t) / 1e6;
  t = process.hrtime.bigint(); const b = hasPath(g, 'root', 'missing'); const bfsMs = Number(process.hrtime.bigint() - t) / 1e6;
  out.push({ width, genDFS: { found: a, ms: Math.round(dfsMs * 10) / 10 }, hasPath: { found: b, ms: Math.round(bfsMs * 10) / 10 } });
}
writeFileSync(path.join(here, 'graph-probe-staleness-results.json'), `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify(out, null, 2));

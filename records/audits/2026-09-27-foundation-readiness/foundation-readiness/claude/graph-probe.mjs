// Focused @statelyai/graph integration probe for the foundation-readiness review.
// Compares Stately-backed replacements of PostCode's containment traversals with the
// compiled baseline implementation and an independent oracle. Research code only.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const stately = path.resolve(here, '../_codex-library-reuse-audit/graph-research/probe/node_modules/@statelyai/graph/dist');
const { createGraph, addEdge } = await import(path.join(stately, 'index.mjs'));
const { hasPath, genDFS } = await import(path.join(stately, 'algorithms.mjs'));
const { deriveLayout } = await import(path.join(here, 'build/src/lib/repository/layout.js'));

const results = [];
let seed = 20260927;
const random = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = items => items[Math.floor(random() * items.length)];
const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// A. Directory-link containment acceptance: the order-dependent cycle refusal in deriveLayout.
function statelyLayout(evidence) {
  const baseline = deriveLayout(evidence);
  // Rebuild only the link-acceptance step on a library graph; regions/placements are unchanged.
  const parent = name => { const d = path.posix.dirname(name); return d === '.' ? '' : d; };
  const regions = new Set(baseline.regions.map(region => region.path));
  const artifactPaths = new Set(evidence.artifacts.map(artifact => artifact.path));
  // Stately rejects empty node ids; the repository root region path is ''. Encode ids at the adapter.
  const node = region => `r:${region}`;
  const graph = createGraph({ mode: 'directed', nodes: [...regions].map(id => ({ id: node(id) })), edges: [] });
  const containment = baseline.regions.filter(region => region.path).map(region => ({ parent: parent(region.path), child: region.path, basis: 'directory', evidencePath: region.path }));
  containment.forEach((edge, index) => addEdge(graph, { id: `d${index}`, sourceId: node(edge.parent), targetId: node(edge.child) }));
  const links = [];
  for (const artifact of [...evidence.artifacts].sort((a, b) => compare(a.path, b.path))) {
    const link = artifact.link;
    if (!link) continue;
    const add = (outcome, targetRegion = null) => links.push({ artifactPath: artifact.path, outcome, targetRegion });
    if (link.status !== 'resolved') { add(link.status); continue; }
    const target = path.relative(evidence.root, link.resolved).split(path.sep).join('/');
    if (link.targetKind !== 'directory') add(artifactPaths.has(target) ? link.targetKind === 'file' ? 'file-target' : 'artifact-target' : 'outside-population');
    else if (!regions.has(target)) add('outside-population');
    else {
      const source = parent(artifact.path);
      if (hasPath(graph, node(target), node(source))) add('cyclic-containment');
      else if (containment.some(edge => edge.parent === source && edge.child === target)) add('existing-parent', target);
      else {
        containment.push({ parent: source, child: target, basis: 'symlink', evidencePath: artifact.path });
        addEdge(graph, { id: `l${links.length}`, sourceId: node(source), targetId: node(target) });
        add('additional-parent', target);
      }
    }
  }
  return { ...baseline, containment, links };
}

function randomEvidence(size) {
  const root = '/repo';
  const directories = [''];
  for (let i = 0; i < size; i++) directories.push([pick(directories), `d${i}`].filter(Boolean).join('/'));
  const artifacts = [];
  for (const directory of directories.slice(1)) artifacts.push({ path: `${directory}/f.ts`, kind: 'file', tracked: true });
  const links = Math.floor(random() * size) + 1;
  for (let i = 0; i < links; i++) {
    const home = pick(directories);
    const target = pick(directories);
    artifacts.push({ path: [home, `link${i}`].filter(Boolean).join('/'), kind: 'symlink', tracked: true,
      link: { target: 'x', status: random() < 0.1 ? 'broken' : 'resolved', resolved: path.posix.join(root, target), targetKind: 'directory' } });
  }
  return { provider: 'repository-layout', method: 'probe', root, rootPaths: [root], gitVersion: 'probe', gitPathPolicy: { ignoreCase: false, precomposeUnicode: false },
    inputConsistency: 'first-observed', sparseCheckout: false, limitations: [], exclusions: [], excludedOutputDirectories: [],
    artifacts: artifacts.sort((a, b) => compare(a.path, b.path)) };
}

let layoutCases = 0, cyclicRefusals = 0, acceptedLinks = 0;
for (let i = 0; i < 1500; i++) {
  const evidence = randomEvidence(2 + (i % 30));
  const expected = deriveLayout(evidence);
  const actual = statelyLayout(evidence);
  assert.deepEqual(actual, expected, `layout case ${i}`);
  layoutCases++;
  cyclicRefusals += expected.links.filter(link => link.outcome === 'cyclic-containment').length;
  acceptedLinks += expected.links.filter(link => link.outcome === 'additional-parent').length;
}
results.push({ name: 'directory-link containment acceptance matches deriveLayout', cases: layoutCases, cyclicRefusals, acceptedLinks, passed: true });

// B. Multi-parent ancestry with every supporting containment claim (dependencies/organization.ts semantics).
function oracleAncestors(edges, group) {
  const groups = new Set([group]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of edges) if (groups.has(edge.child) && !groups.has(edge.parent)) { groups.add(edge.parent); changed = true; }
  }
  // Supporting claims: every containment edge whose child is in the ancestor closure.
  return { groups: [...groups].sort(compare), claims: edges.filter(edge => groups.has(edge.child)).map(edge => edge.id).sort(compare) };
}
function statelyAncestors(graph, group) {
  const groups = new Set([...genDFS(graph, { from: [group], direction: 'incoming' })].map(node => node.id));
  return { groups: [...groups].sort(compare), claims: graph.edges.filter(edge => groups.has(edge.targetId)).map(edge => edge.id).sort(compare) };
}
let ancestryCases = 0;
for (let i = 0; i < 1000; i++) {
  const n = 2 + (i % 25);
  const nodes = Array.from({ length: n }, (_, index) => `g${index}`);
  const edges = [];
  // Mostly-DAG containment with multiple parents, parallel claims, and occasional cycles (layout refuses them,
  // but ancestry must still terminate and include every supporting claim).
  for (let e = 0; e < n * 2; e++) {
    const a = Math.floor(random() * n), b = Math.floor(random() * n);
    if (a === b && random() < 0.8) continue;
    const [parent, child] = random() < 0.9 ? [Math.min(a, b), Math.max(a, b)] : [Math.max(a, b), Math.min(a, b)];
    edges.push({ id: `c${e}`, parent: nodes[parent], child: nodes[child] });
  }
  const graph = createGraph({ mode: 'directed', nodes: nodes.map(id => ({ id })), edges: edges.map(edge => ({ id: edge.id, sourceId: edge.parent, targetId: edge.child })) });
  for (const node of nodes) assert.deepEqual(statelyAncestors(graph, node), oracleAncestors(edges, node), `ancestry ${i} ${node}`);
  ancestryCases++;
}
results.push({ name: 'multi-parent ancestry with all supporting claims matches oracle', graphs: ancestryCases, passed: true });

// E. The empty-id impediment itself.
{
  let message = null;
  try { createGraph({ mode: 'directed', nodes: [{ id: '' }], edges: [] }); } catch (error) { message = error.message; }
  results.push({ name: 'empty node id (repository root region path) is rejected', error: message, passed: message !== null });
}

// C. Direct field mutation is not detected by the library index (documented contract), so graphs must be
// treated as immutable derivations or mutated only through its API.
{
  const graph = createGraph({ mode: 'directed', nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], edges: [{ id: 'e', sourceId: 'a', targetId: 'b' }] });
  assert.equal(hasPath(graph, 'a', 'b'), true);
  graph.edges[0].targetId = 'c';
  const stale = hasPath(graph, 'a', 'b');
  results.push({ name: 'in-place edge field mutation leaves a stale index', staleAnswerAfterMutation: stale, expectedFresh: false, passed: stale === true });
}

// D. hasPath breadth cost: BFS uses Array.prototype.shift.
for (const width of [10000, 50000, 100000]) {
  const nodes = [{ id: 'root' }, ...Array.from({ length: width }, (_, i) => ({ id: `n${i}` })), { id: 'missing' }];
  const graph = createGraph({ mode: 'directed', nodes, edges: Array.from({ length: width }, (_, i) => ({ id: `e${i}`, sourceId: 'root', targetId: `n${i}` })) });
  hasPath(graph, 'root', 'n0');
  const start = process.hrtime.bigint();
  const found = hasPath(graph, 'root', 'missing');
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  results.push({ name: 'hasPath star traversal', width, found, milliseconds: Math.round(ms * 10) / 10 });
}

writeFileSync(path.join(here, 'graph-probe-results.json'), `${JSON.stringify({ node: process.version, stately: '2.4.0', results }, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { directedGraph } from '../src/lib/directed-graph.js';

test('directed adapter preserves empty roots, direction, isolates and incremental mutations', () => {
  const graph = directedGraph<string>(['', 'n', 'left', 'right', 'leaf', 'isolate'],
    [['', 'left'], ['', 'right'], ['left', 'leaf'], ['right', 'leaf'], ['right', 'leaf']]);
  assert.deepEqual([...graph.ancestors(['leaf'])].sort(), ['', 'leaf', 'left', 'right']);
  assert.deepEqual([...graph.ancestors([])], []);
  assert.deepEqual([...graph.ancestors(['unknown'])], []);
  assert.equal(graph.reaches('unknown', 'unknown'), false);
  assert.equal(graph.reaches('', ''), true);
  assert.equal(graph.reaches('', 'leaf'), true);
  assert.equal(graph.reaches('leaf', ''), false);
  assert.equal(graph.reaches('', 'n'), false);
  assert.equal(graph.hasEdge('right', 'leaf'), true);
  assert.equal(graph.hasEdge('leaf', 'right'), false);
  assert.equal(graph.reaches('isolate', 'leaf'), false);
  graph.add('isolate', '');
  assert.equal(graph.hasEdge('isolate', ''), true);
  assert.equal(graph.reaches('isolate', 'leaf'), true);
  assert.deepEqual([...graph.ancestors(['leaf'])].sort(), ['', 'isolate', 'leaf', 'left', 'right']);
  assert.throws(() => graph.add('unknown', ''), /outside selected population/);
});

test('SCC, ancestry and incremental reachability match an independent bounded matrix oracle', () => {
  let seed = 0x981452;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
  for (let trial = 0; trial < 200; trial++) {
    const size = 1 + Math.floor(random() * 18);
    const nodes = Array.from({ length: size }, (_, index) => String(index));
    const edges: [string, string][] = [];
    for (const from of nodes) for (const to of nodes) if (random() < 0.13) edges.push([from, to]);
    const graph = directedGraph(nodes, edges);
    for (let mutation = 0; mutation < 3; mutation++) {
      const reach = nodes.map((_, index) => nodes.map((_, other) => index === other));
      for (const [from, to] of edges) reach[Number(from)]![Number(to)] = true;
      for (let via = 0; via < size; via++) for (let from = 0; from < size; from++) for (let to = 0; to < size; to++) {
        reach[from]![to] ||= reach[from]![via]! && reach[via]![to]!;
      }
      const unseen = new Set(nodes), components: string[][] = [];
      for (const from of nodes) if (unseen.has(from)) {
        const group = nodes.filter(to => reach[Number(from)]![Number(to)] && reach[Number(to)]![Number(from)]);
        group.forEach(node => unseen.delete(node)); components.push(group.sort());
      }
      const ordered = (groups: string[][]) => groups.map(group => group.sort()).sort((a, b) => a[0]! < b[0]! ? -1 : 1);
      assert.deepEqual(ordered(graph.components()), ordered(components));
      for (const from of nodes) {
        assert.deepEqual([...graph.ancestors([from])].sort(), nodes.filter(to => reach[Number(to)]![Number(from)]).sort());
        for (const to of nodes) assert.equal(graph.reaches(from, to), reach[Number(from)]![Number(to)]);
      }
      const from = nodes[Math.floor(random() * size)]!, to = nodes[Math.floor(random() * size)]!;
      edges.push([from, to]); graph.add(from, to);
    }
  }
});

test('delegated components and incoming traversal preserve deep-chain and deep-cycle robustness', () => {
  const nodes = Array.from({ length: 100_000 }, (_, index) => String(index));
  const graph = directedGraph(nodes, nodes.slice(1).map((node, index) => [nodes[index]!, node] as const));
  assert.equal(graph.components().length, nodes.length);
  assert.equal(graph.ancestors([nodes.at(-1)!]).size, nodes.length);
  assert.equal(graph.reaches(nodes[0]!, nodes.at(-1)!), true);
  graph.add(nodes.at(-1)!, nodes[0]!);
  const components = graph.components();
  assert.equal(components.length, 1);
  assert.equal(components[0]!.length, nodes.length);
});

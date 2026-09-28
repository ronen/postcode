import { addEdge, createGraph, getEdgesBetween } from '@statelyai/graph';
import { genDFS, getStronglyConnectedComponents } from '@statelyai/graph/algorithms';

/** Ephemeral topology only; callers retain evidence, population policy and ordering. */
export function directedGraph<T extends string>(nodes: Iterable<T>, edges: Iterable<readonly [T, T]>) {
  // Prefix every ID, including the empty repository-root path, without collisions.
  const encode = (id: T) => `n${id}`;
  const population = new Map([...nodes].map(id => [encode(id), id]));
  let sequence = 0;
  const edge = (from: T, to: T) => {
    if (!population.has(encode(from)) || !population.has(encode(to))) throw new Error('Graph edge outside selected population');
    return { id: `e${sequence++}`, sourceId: encode(from), targetId: encode(to) };
  };
  const graph = createGraph({ mode: 'directed', nodes: [...population.keys()].map(id => ({ id })),
    edges: [...edges].map(([from, to]) => edge(from, to)) });
  return {
    components: (): T[][] => getStronglyConnectedComponents(graph).map(group => group.map(node => population.get(node.id)!)),
    add(from: T, to: T) { addEdge(graph, edge(from, to)); },
    hasEdge(from: T, to: T): boolean {
      return population.has(encode(from)) && population.has(encode(to))
        && getEdgesBetween(graph, encode(from), encode(to)).length > 0;
    },
    reaches(from: T, to: T): boolean {
      if (!population.has(encode(from)) || !population.has(encode(to))) return false;
      for (const node of genDFS(graph, { from: [encode(from)], direction: 'outgoing' })) {
        if (node.id === encode(to)) return true;
      }
      return false;
    },
    ancestors(roots: Iterable<T>): Set<T> {
      const from = [...roots].map(encode).filter(id => population.has(id));
      return new Set([...genDFS(graph, { from, direction: 'incoming' })].map(node => population.get(node.id)!));
    },
  };
}

import { directedGraph } from '../directed-graph.js';
import { compare } from '../identity.js';
import type { RecordId } from '../records.js';
import type { DependencyGraph, DependencyRelationshipClaim } from './records.js';

/** Delegate topology over project modules; retain all relationship evidence and qualified roots. */
export function deriveDependencyGraph(modules: readonly RecordId[], relationships: readonly DependencyRelationshipClaim[], complete: boolean): DependencyGraph {
  const population = [...new Set(modules)].sort(compare);
  const members = new Set(population);
  const graph = directedGraph(population, relationships.filter(edge => members.has(edge.subject)
    && members.has(edge.information.child)).map(edge => [edge.subject, edge.information.child] as const));
  const groups = graph.components().map(group => group.sort(compare));
  groups.sort((a, b) => compare(a[0]!, b[0]!));
  const componentOf = new Map(groups.flatMap((group, index) => group.map(id => [id, index] as const)));
  const internal = groups.map(() => [] as RecordId[]);
  const outgoing = groups.map(() => new Set<number>());
  const incoming = new Set<number>();
  for (const edge of relationships) {
    const from = componentOf.get(edge.subject);
    const to = componentOf.get(edge.information.child);
    if (from === undefined || to === undefined) continue;
    if (from === to) internal[from]!.push(edge.id);
    else { outgoing[from]!.add(to); incoming.add(to); }
  }
  return {
    components: groups.map((members, index) => ({ members, internalRelationships: internal[index]!.sort(compare),
      children: [...outgoing[index]!].sort((a, b) => a - b), cyclic: members.length > 1 || internal[index]!.length > 0 })),
    roots: complete ? groups.map((_, index) => index).filter(index => !incoming.has(index)) : [], rootsEstablished: complete,
  };
}

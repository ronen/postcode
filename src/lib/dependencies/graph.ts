import { compare } from '../identity.js';
import type { RecordId } from '../records.js';
import type { DependencyGraph, DependencyRelationshipClaim } from './records.js';

/** Iterative Kosaraju over the project population, including isolated modules. */
export function deriveDependencyGraph(modules: readonly RecordId[], relationships: readonly DependencyRelationshipClaim[], complete: boolean): DependencyGraph {
  const population = [...new Set(modules)].sort(compare);
  const children = new Map(population.map(id => [id, new Set<RecordId>()]));
  const parents = new Map(population.map(id => [id, new Set<RecordId>()]));
  for (const edge of relationships) {
    if (children.has(edge.subject) && children.has(edge.information.child)) {
      children.get(edge.subject)!.add(edge.information.child);
      parents.get(edge.information.child)!.add(edge.subject);
    }
  }
  const seen = new Set<RecordId>();
  const finished: RecordId[] = [];
  for (const root of population) {
    if (seen.has(root)) continue;
    const stack: { id: RecordId; iterator: Iterator<RecordId> }[] = [];
    const enter = (id: RecordId) => { seen.add(id); stack.push({ id, iterator: children.get(id)!.values() }); };
    enter(root);
    while (stack.length) {
      const current = stack[stack.length - 1]!;
      const next = current.iterator.next();
      if (next.done) { finished.push(current.id); stack.pop(); }
      else if (!seen.has(next.value)) enter(next.value);
    }
  }
  seen.clear();
  const groups: RecordId[][] = [];
  for (const root of finished.reverse()) {
    if (seen.has(root)) continue;
    const group: RecordId[] = [];
    const stack = [root];
    seen.add(root);
    while (stack.length) {
      const id = stack.pop()!;
      group.push(id);
      for (const parent of parents.get(id)!) if (!seen.has(parent)) { seen.add(parent); stack.push(parent); }
    }
    groups.push(group.sort(compare));
  }
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

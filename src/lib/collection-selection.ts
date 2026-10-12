import { compare } from './identity.js';
import type { RecordId } from './records.js';

/** Current unordered module/group selections only; ordered subjects or roles must not use this policy. */
export function orderCollectionSubjects(population: readonly RecordId[], subjects: readonly RecordId[]): RecordId[] {
  const positions = new Map(population.map((id, index) => [id, index]));
  return [...subjects].sort((a, b) => {
    const left = positions.get(a), right = positions.get(b);
    if (left !== undefined) return right === undefined ? -1 : left - right;
    return right === undefined ? compare(a, b) : 1;
  });
}

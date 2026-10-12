import { inspect as inspectSubjects } from '../src/lib/projections.js';
import { inspectOrganization as inspectEntities } from '../src/lib/organization/projections.js';
import { dependencyChildren as children, dependencyParents as parents } from '../src/lib/dependencies/projections.js';
import { resolveSubjects } from '../src/lib/subject-resolution.js';
import { lenses } from '../src/lib/requests.js';
import type { EvaluationRecord, ProgramRecordStore, RecordId } from '../src/lib/records.js';
import type { OrganizationEvaluationRecord } from '../src/lib/organization/records.js';
import type { DependencyEvaluationRecord } from '../src/lib/dependencies/records.js';

export { modules } from '../src/lib/projections.js';
export { organization } from '../src/lib/organization/projections.js';
export { dependencyStructure } from '../src/lib/dependencies/projections.js';

/** Fixture convenience: known record IDs supply resolved subjects directly; strings use production resolution.
 * Product constructors accept only resolved IDs. Public designation semantics are tested through Session. */
function subjects(store: ProgramRecordStore, modules: EvaluationRecord, selector: string, reference: boolean,
  organization?: OrganizationEvaluationRecord, resolved?: readonly RecordId[]) {
  if (resolved) return resolved;
  const record = store.lookup(selector as RecordId);
  if (record && (record.kind === 'module' || record.kind === 'group')) return [record.id];
  const result = resolveSubjects(store, modules.session, lenses.inspect, { kind: reference ? 'reference' : 'name', value: selector },
    { modules, ...(organization ? { organization } : {}) });
  if (result.status !== 'resolved') throw new Error('Unresolved designation must be handled by request coordination');
  return result.candidates.map(item => item.id);
}

export function inspect(store: ProgramRecordStore, basis: EvaluationRecord, selector: string, reference = false, resolved?: readonly RecordId[]) {
  return inspectSubjects(store, basis, subjects(store, basis, selector, reference, undefined, resolved));
}
export function inspectOrganization(store: ProgramRecordStore, basis: OrganizationEvaluationRecord, selector: string, reference = false, resolved?: readonly RecordId[]) {
  return inspectEntities(store, basis, subjects(store, store.get(basis.moduleEvaluation) as EvaluationRecord, selector, reference, basis, resolved));
}
export function dependencyChildren(store: ProgramRecordStore, basis: DependencyEvaluationRecord, selector: string,
  reference = false, organization: RecordId | null = null, resolved?: readonly RecordId[]) {
  return children(store, basis, subjects(store, store.get(basis.moduleEvaluation) as EvaluationRecord, selector, reference, undefined, resolved), organization);
}
export function dependencyParents(store: ProgramRecordStore, basis: DependencyEvaluationRecord, selector: string,
  reference = false, organization: RecordId | null = null, resolved?: readonly RecordId[]) {
  return parents(store, basis, subjects(store, store.get(basis.moduleEvaluation) as EvaluationRecord, selector, reference, undefined, resolved), organization);
}

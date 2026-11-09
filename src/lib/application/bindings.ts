import type { ProgramRecordStore, RecordId } from '../records.js';
import type { QualifiedContent } from './content.js';
export interface CoordinatedBindings {
  readonly modules: readonly (readonly [RecordId, string])[];
  readonly groups: readonly (readonly [RecordId, string])[];
  readonly detail: readonly (readonly [RecordId, string])[];
  readonly associations: readonly (readonly [RecordId, string])[];
}
/** Preserve the mechanical wrappers' batches and order; never bind a display subset. */
export function coordinateBindings(store: ProgramRecordStore, content: Exclude<QualifiedContent, { contract: 'investigation' }>, associated?: readonly RecordId[]): CoordinatedBindings {
  let modules: ReadonlyMap<RecordId, string> = new Map(), groups: ReadonlyMap<RecordId, string> = new Map(), detail: ReadonlyMap<RecordId, string> = new Map();
  switch (content.contract) {
    case 'modules': modules = new Map([...store.entityIds(content.value.discovery.modules, 'module'), ...store.entityIds(content.value.projection.modules, 'module')]); break;
    case 'organization':
      groups = new Map([...store.entityIds(content.value.evaluation.groups, 'group'), ...store.entityIds(content.value.projection.groups, 'group')]);
      modules = store.entityIds(content.value.moduleEvaluation.modules, 'module');
      if (content.value.moduleDetail) detail = new Map([...store.entityIds(content.value.moduleDetail.discovery.modules, 'module'), ...store.entityIds(content.value.moduleDetail.projection.modules, 'module')]);
      break;
    case 'dependencies': modules = new Map([...store.entityIds(content.value.basis.modules, 'module'), ...store.entityIds(content.value.projection.modules, 'module')]); break;
    case 'module-exports': store.entityIds(content.value.basis.modules, 'module'); modules = store.entityIds([content.value.projection.subject], 'module'); break;
  }
  return { modules: [...modules], groups: [...groups], detail: [...detail], associations: associated ? [...store.entityIds(associated, 'investigram')] : [] };
}

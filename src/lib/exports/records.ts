import { identityReference } from '../identity.js';
import type { RecordContext, RecordId } from '../records.js';

/** A selected export surface, never a complete module inspection. */
export interface ModuleExportsProjection extends RecordContext {
  readonly kind: 'module-exports-projection';
  readonly lens: string;
  readonly subject: RecordId;
  readonly parameters: Readonly<Record<string, never>>;
  readonly evaluation: RecordId;
  readonly evaluations: readonly RecordId[];
  readonly exports: readonly RecordId[];
  readonly documentation: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly outsidePopulation: boolean;
}
export function exportsIdentity(answer: Omit<ModuleExportsProjection, 'id'>) {
  const ref = (id: RecordId) => identityReference(answer.session, id);
  return { ...answer, session: ref(answer.session), subject: ref(answer.subject), evaluation: ref(answer.evaluation),
    evaluations: answer.evaluations.map(ref), exports: answer.exports.map(ref), documentation: answer.documentation.map(ref), contexts: answer.contexts.map(ref) };
}

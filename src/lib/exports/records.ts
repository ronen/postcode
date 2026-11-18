import { nativeSelectionIdentity } from '../contributions/native-selection.js';
import type { NativeSelection } from '../contributions/native-selection.js';
import { identityReference } from '../identity.js';
import type { AnswerSupport } from '../contributions/answer-support.js';
import { answerSupportIdentity } from '../contributions/support-identity.js';
import type { AssociationAddress, DeclarationAddress, EntityId, ItemAddress } from '../contributions/model.js';
import type { RecordContext, RecordId } from '../records.js';

/** A captured use of a finding: its exact association, standing at selection, and the grounds of any displacement. */
export interface UseSnapshot {
  readonly association: AssociationAddress;
  readonly item: ItemAddress;
  readonly standing: 'standing' | 'displaced';
  readonly displacements: readonly { readonly change: DeclarationAddress; readonly operation: 'supersede' | 'withdraw'; readonly grounds: string }[];
}
/**
 * The contributions selected for the answer and their organizing status when it was constructed.
 * These are the method's own findings; a later displacement of a use never removes a finding,
 * and never changes this capture.
 */
export interface ExportsContributions {
  /** Fixed qualified displacement context and its evidence/support; not replacement content. */
  readonly support: AnswerSupport;
  readonly entity: EntityId;
  /** Uses of the discovery method's identifying finding for the module. */
  readonly naming: readonly UseSnapshot[];
  /** The export method's finding matching the selected export outcome, with its uses. Null when no export outcome was selected. */
  readonly surface: { readonly item: ItemAddress; readonly uses: readonly UseSnapshot[] } | null;
}

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
  readonly contributions: ExportsContributions;
  readonly native: NativeSelection;
}
export function exportsIdentity(answer: Omit<ModuleExportsProjection, 'id'>) {
  const ref = (id: RecordId) => identityReference(answer.session, id);
  const use = (item: UseSnapshot) => ({ ...item, association: { ...item.association, investigram: ref(item.association.investigram) },
    item: { ...item.item, investigram: ref(item.item.investigram) },
    displacements: item.displacements.map(change => ({ ...change, change: { ...change.change, investigram: ref(change.change.investigram) } })) });
  const { entity, naming, surface, support } = answer.contributions;
  const supportKey = answerSupportIdentity(answer.session, support);
  return { ...answer, session: ref(answer.session), subject: ref(answer.subject), evaluation: ref(answer.evaluation),
    evaluations: answer.evaluations.map(ref), exports: answer.exports.map(ref), documentation: answer.documentation.map(ref), contexts: answer.contexts.map(ref),
    native: nativeSelectionIdentity(answer.session, answer.native),
    contributions: { support: supportKey, entity: ref(entity), naming: naming.map(use),
      surface: surface ? { item: { ...surface.item, investigram: ref(surface.item.investigram) }, uses: surface.uses.map(use) } : null } };
}

import { identityReference } from '../identity.js';
import type { AnswerSupport } from '../contributions/answer-support.js';
import type { Cause, Standing } from '../contributions/status.js';
import type { AssociationAddress, DeclarationAddress, EntityId, InvestigramId, ItemAddress } from '../contributions/model.js';
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
}
export function exportsIdentity(answer: Omit<ModuleExportsProjection, 'id'>) {
  const ref = (id: RecordId) => identityReference(answer.session, id);
  const use = (item: UseSnapshot) => ({ ...item, association: { ...item.association, investigram: ref(item.association.investigram) },
    item: { ...item.item, investigram: ref(item.item.investigram) },
    displacements: item.displacements.map(change => ({ ...change, change: { ...change.change, investigram: ref(change.change.investigram) } })) });
  const { entity, naming, surface, support } = answer.contributions;
  const address = <T extends { readonly investigram: InvestigramId }>(value: T) => ({ ...value, investigram: ref(value.investigram) });
  const standing = (value: Standing | null) => value && ({ ...value, displacedBy: value.displacedBy.map(address) });
  const cause = (value: Cause) => ({ ...value, change: address(value.change), standing: standing(value.standing), routes: value.routes.map(route =>
    route.kind === 'inherited' ? { ...route, from: ref(route.from) } : { ...route, association: address(route.association),
      ...(route.kind === 'scope' ? { scope: { ...route.scope, ...(route.scope.kind === 'entity' ? { entity: ref(route.scope.entity) } : { result: ref(route.scope.result) }) } } : {}) }) });
  // Exact immutable references identify source content and provenance. Only captured derived
  // status needs a value key; normalize its reference positions without rewriting ordinary text.
  const supportKey = {
    owners: support.owners.map(owner => ({ investigram: ref(owner.investigram), producing: owner.producing.map(cause) })),
    items: support.items.map(item => ({ address: address(item.address), identifyingNames: item.identifyingNames, inconsistencies: item.inconsistencies.map(address) })),
    uses: support.uses.map(use => ({ address: address(use.address), status: { ...use.status, address: address(use.status.address),
      standing: standing(use.status.standing), membership: use.status.membership.map(cause), producing: use.status.producing.map(cause),
      content: use.status.content.map(value => ({ investigram: ref(value.investigram), producing: value.producing.map(cause) })), inconsistencies: use.status.inconsistencies.map(address) } })),
    changes: support.changes.map(change => ({ address: address(change.address), standing: standing(change.standing) })),
    metadata: support.metadata.map(value => address(value.address)),
    bearers: support.bearers.map(value => ({ entity: ref(value.entity), identifications: value.identifications.map(address) })),
    evidence: support.evidence.map(record => ref(record.id)),
  };
  return { ...answer, session: ref(answer.session), subject: ref(answer.subject), evaluation: ref(answer.evaluation),
    evaluations: answer.evaluations.map(ref), exports: answer.exports.map(ref), documentation: answer.documentation.map(ref), contexts: answer.contexts.map(ref),
    contributions: { support: supportKey, entity: ref(entity), naming: naming.map(use),
      surface: surface ? { item: { ...surface.item, investigram: ref(surface.item.investigram) }, uses: surface.uses.map(use) } : null } };
}

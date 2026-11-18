import { identityReference } from '../identity.js';
import type { SessionId, RecordId } from '../records.js';
import type { AnswerSupport } from './answer-support.js';
import type { InvestigramId } from './model.js';
import type { Cause, Standing } from './status.js';

/** Normalize exact support references and captured status, never source text. */
export function answerSupportIdentity(session: SessionId, support: AnswerSupport) {
  const ref = (id: RecordId) => identityReference(session, id);
  const address = <T extends { readonly investigram: InvestigramId }>(value: T) => ({ ...value, investigram: ref(value.investigram) });
  const standing = (value: Standing | null) => value && ({ ...value, displacedBy: value.displacedBy.map(address) });
  const cause = (value: Cause) => ({ ...value, change: address(value.change), standing: standing(value.standing), routes: value.routes.map(route =>
    route.kind === 'inherited' ? { ...route, from: ref(route.from) } : { ...route, association: address(route.association),
      ...(route.kind === 'scope' ? { scope: { ...route.scope, ...(route.scope.kind === 'entity' ? { entity: ref(route.scope.entity) } : { result: ref(route.scope.result) }) } } : {}) }) });
  // Exact immutable references identify source content and provenance. Only captured derived
  // status needs a value key; normalize its reference positions without rewriting ordinary text.
  return {
    owners: support.owners.map(owner => ({ investigram: ref(owner.investigram), producing: owner.producing.map(cause) })),
    items: support.items.map(item => ({ address: address(item.address), identifyingNames: item.identifyingNames, inconsistencies: item.inconsistencies.map(address) })),
    uses: support.uses.map(use => ({ address: address(use.address), status: { ...use.status, address: address(use.status.address),
      standing: standing(use.status.standing), membership: use.status.membership.map(cause), producing: use.status.producing.map(cause),
      content: use.status.content.map(value => ({ investigram: ref(value.investigram), producing: value.producing.map(cause) })), inconsistencies: use.status.inconsistencies.map(address) } })),
    changes: support.changes.map(change => ({ address: address(change.address), standing: standing(change.standing) })),
    metadata: support.metadata.map(value => address(value.address)),
    bearers: support.bearers.map(value => ({ entity: ref(value.entity), identifications: value.identifications.map(address) })),
    // Resolved evidence is immutable support reachable through the exact item/declaration
    // owners above. Its capture may include operational exclusion metadata that does not
    // change the provider finding; it is retained in the payload, not a second answer key.
  };
}

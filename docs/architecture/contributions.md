# Common analysis contributions

This describes the implemented common contribution mechanism under `src/lib/contributions/`. It realizes the first milestone of the [structured architectural accounts plan](../plans/structured-architectural-accounts.md) and is governed by [common analysis contributions](../decisions/common-analysis-contributions.md), [association organization and exposure](../decisions/association-organization-and-exposure.md), [qualified answers over contributions](../decisions/qualified-answers-over-contributions.md) and [structured architectural explanation](../decisions/structured-architectural-explanation.md).

## Current integration status

The mechanism is exercised only by controlled producers in tests. No Session, Lens, CLI or investigating-agent path produces or consumes contributions yet. Existing mechanical retention, investigram trees, whole-investigram corrections and citation-based reconsideration are unchanged and remain subject to the [temporary migration contract](../decisions/common-analysis-contributions.md#adoption-and-migration-conformance). The state-behavior investigation, state diagram and follow-up-option invocation are not available. The other architecture documents therefore still describe the operating system; this document describes the target mechanism those capabilities migrate onto.

## Responsibilities

A Session-owned **contribution ledger** retains Entities, invocations with their Query results, immutable investigrams and the record of each producing execution. It is a separate component from the program record store. Content items can reference program records such as source evidence and provider Claim contexts; the ledger does not copy or reinterpret them.

Four responsibilities are kept apart:

| Responsibility | Boundary |
| --- | --- |
| Acceptance | Validates a submitted pool completely, resolves known identities, then allocates and retains everything atomically. It checks ownership, addressability, reference eligibility, qualification presence and content-contract shape. It does not check association reachability, request fulfillment or correctness. |
| Producer input recording | An open **production** is the only route by which a producer acquires retained information. Each acquisition returns qualified content and records what actually arrived, at its delivery position. |
| Derived status | Standing and needs-reconsideration are computed from retained declarations, deliveries and membership under a versioned method. They are never written back into contributions. |
| Outcome and fulfillment | What an attempt returned (nothing, an unrepaired invalid submission, or an accepted contribution) is reported separately from whether the selected answer meets its requested result contract. |

Read access to the ledger — identity resolution, name lookup, association and designation selection, status — involves no production and therefore records no exposure. This is the structural basis for answer assembly, browsing and host identity bookkeeping creating no producer exposure.

## Identities

An Entity record carries identity only: its kind, modality, optional provider-native identity and the investigram that introduced it. Names and descriptions are content selected by identification associations, so several can coexist and displacing one does not change what the Entity ID denotes.

A submitted Entity uses a submission-local key. One with a provider-native identity resolves through the combination of provider, identity rule, basis scope and native key; an existing mapping yields the retained Entity and no new identification is required. The same native key under another scope is a different Entity. One without a native identity is always new and must be identified in the same submission. Common IDs are Session-scoped digests, derived from the scoped native tuple or from the introducing investigram and local key, so they are independent of acceptance order and never equal a native key.

An invocation records one request: operation, subjects with roles and order, parameters, explicitly selected context and the requested result contract. Its Query result is a separate identity. An ordinary equivalent request resolves to the existing invocation and result. An explicit fresh request records a new invocation that keeps the repeated question's Query result as its organizing target.

## Contributions and declarations

A submission is a flat pool of investigrams, each belonging to one production; several productions can be accepted in one batch. An investigram owns keyed content items, declarations, follow-up options, illustrations and inconsistency reports. Its content, and each of those parts, needs applicable qualification of its own or from its owner. Agentic qualification always has interpretation status and cannot state a guarantee; mechanical qualification states its status explicitly. Both are attributed to the producing method.

Content items have a type from a content catalogue. The type's contract validates shape, resolves any references in the body and reports locally addressable components and content dependencies. Only prose and identification types are built in at this stage.

Declarations are addressed through their owning investigram. An addition or supersession establishes an association at its own address, targeting either an Entity with an identification or topical role, or a Query result. A supersession or withdrawal names exact earlier associations and carries qualified grounds. A supersession's displaced uses must concern the same Entity and role class, or the same Query result. Members are exact content items, and for result designations also other associations, with circular membership rejected. Declarations may reference another owner's content; ownership and qualification stay with the source.

## Exposure and reconsideration

A production records deliveries of exact content items (complete or as a disclosed excerpt, with the association route when delivered as a particular use), exact associations with the displacements already known, declaration grounds, qualified metadata, acquired inventory scopes (current-only or all-history, with the addresses listed), exact change notices and discovery-only referent handles. Positions are counts of accepted submissions and serve only to order deliveries against changes.

Each investigram inherits the deliveries of its own production. Causes are exact change declarations, reached by four routes:

- later displacement of an association use that was received;
- a later addition within an acquired scope, or a later displacement that removes a listed association from a current-only inventory;
- a producing-context cause of the investigram that owns supplied content, declarations or metadata, when that cause was accepted after the delivery;
- later displacement of a member association of a received or assessed designation.

A change accepted at or before a delivery is known context for that delivery. A change for which an exact notice was delivered before submission is known by every route. A production never acquires a cause from its own declarations. Notices, bare references and discovery handles are not content exposure.

Status has separate bearers. An investigram has producing-context causes. An association has its standing, membership causes relative to its own acceptance, its declarer's producing-context causes, and the producing-context causes of other owners whose content it references. A cause reports the current standing of the association its change established.

## Outcomes

The shared producer boundary opens a production, lets the producer acquire inputs and submit, applies bounded structural repair, and concludes the production. An attempt that returns no contribution is retained with its deliveries and no investigram. An accepted contribution takes full effect whatever its fulfillment. Fulfillment is assessed against every current designation of the invocation's Query result, or against an explicitly selected alternative, and distinguishes a result that never had a designation from one whose designations were all displaced.

## Deliberate limits at this stage

Inventories are delivered whole; bounded or ranked listings with explicit coverage are not implemented. The selected-content baseline, compact reference bindings for the new identities, Projection snapshots of association and status selections, and any persistence are later work in the same plan. Status derivation recomputes after each acceptance and has not been measured on a representative Session.

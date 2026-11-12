# Structured architectural accounts: working proposal

Updated: 2026-11-12

Exploratory working proposal, not an adopted decision or implementation authorization.
This version conforms the current synthesis and authored fixtures to entity-organized
accounts, association declarations and query-result entities. It replaces the earlier
working recommendation to supersede entire investigrams. Governing documents and the
implemented application still use their existing model; their revision requires the
later planning package. Historical discussion remains in the [discussion notes](structured-architectural-accounts.md).

Read the [consolidation](structured-architectural-accounts-consolidation.md) for the
ownership maps, the [walkthrough](structured-architectural-accounts-example.md) for the
worked thread, and the [fixture guide](structured-account-example/README.md) for exact
payloads and executable checks. Decisions needed for the bounded capability should be
settled here before drafting. Provisional fixture choices below are reviewable examples,
not silently adopted policies.

## Purpose and first scope

Successive investigations should reuse, extend, challenge and reorganize qualified
architectural understanding. Preserve evidence, limitations, conflicts and exact earlier
information. Organize multiple accounts rather than maintain one reconciled model.

The first candidate is circuit-breaker admission → trial → correction at a pinned
Cockatiel revision. Composition with a bulkhead probes extension across accounts. It
need not all be implemented in the first capability. A state diagram and interaction
diagram demonstrate that retained data supplies architectural meaning; rendering must
not invent it. Validation must be independently possible within the supported Session.
No persistence, GUI, general navigation, global operation catalogue or universal ontology
is included by implication.

## The conceptual center

- **Entities organize information.** An entity is an identified thing around which
  qualified content associations accumulate. Several descriptions may coexist or conflict.
- **Queries request information.** Q denotes one invocation with its selected subjects,
  parameters, basis and context, not a recurring question or a continuing inquiry.
- **Query results also have organizing identities.** RESULT-Q identifies that invocation's
  result. Later declarations may designate different information as its answer without
  rewriting what Q originally returned. This broadens the proposed Entity mechanism
  beyond things in the described program and needs explicit governing treatment.
- **Investigations contribute content and association declarations.** An investigram is
  the immutable bundle that attributes those contributions to their producer. It remains
  important for provenance, qualification, inspection and exact addresses; it is no longer
  the normal context unit or the thing that is superseded.

“Account” remains informal English for the information provided. It is not an aggregate
record. Entity-organized accounts need not be complete, consistent or canonical. Content,
association declarations, qualified relationships and exact selections remain distinct.

## Identity and reuse

Reuse means reuse as a referent: “this account concerns the previously identified thing.”
It does not endorse an earlier description. An investigation explicitly introduces a new
entity with a submission-local key; PostCode allocates a stable ID at acceptance. Existing
IDs are reused explicitly. A name, topic or local diagram key does not deduplicate identity.
A selected passage is an input, not an automatic entity introduction. Later investigation
may introduce an entity grounded in it; a structured origin field remains an unexercised
extension, not proof of equivalence.

Descriptions, names, classifications and behavior are qualified content, not authoritative
fields on an entity. Correcting or displacing a description does not delete its entity or
retarget the ID. Independent discovery may produce two IDs for the same architectural
thing; qualified correspondence is needed to say so. A conflation cannot be silently fixed
by making the old ID denote whichever part seems preferable.

Mechanical and interpreted producers share identity/reference and qualified-information
semantics without identical storage or guarantees. Mechanical provider identity must retain
its deterministic captured-basis/Session behavior. Do not mint fresh IDs merely on repeated
encounter, or parallel architectural module IDs just to investigate a module. Mechanical
claims do not become investigrams. The fixture seeds compatible module/policy references;
live discovery and producer migration remain separate verification/scope choices.

Architectural relationships and ordered patterns may be explicitly identified as entities.
Not every edge becomes an entity. A relationship identity does not assert occurrence,
participants or conditions; those remain qualified claims. Query-result identities are
another distinct proposed kind. Both extensions require governing clarification, not just
renaming fields.

## Content and declarations

A **content item** is a keyed portion of Interpretation content. Its **content type**
identifies a supported structure. A **content-type contract** specifies required data,
meaning, references, qualifications and partial information; a **schema** expresses its
mechanically checkable shape. Shape validation does not establish architectural truth.
Types form a defined, extensible catalogue. Investigators can invent topics/concepts using
supported types, not unknown structures PostCode is expected to understand.

A **content association** connects qualified information to a target. An investigram's
association specifications express three **association declaration** kinds:

| Kind | Meaning |
| --- | --- |
| Addition | Introduce an association alongside existing information. |
| Supersession | Introduce an association in place of specified earlier associations. |
| Withdrawal | Displace specified earlier associations without replacement members. |

A target is an entity together with an information role. With query-result identities,
`result` is the role for a query-result entity and only for that kind. Architectural
entities use roles such as `identifies` or `describes`. Own-result and other-result targets
use the same mechanism. The target denotes a category of information, not a mutable slot
or an exact earlier item. Supersession/withdrawal must additionally identify exact earlier
associations. Matching role, name or recency is insufficient.

New associations can reference content owned by another investigram. B owns its new
association; A still owns the referenced content, qualifications, evidence and original
provenance. No copying, reparenting or silent scope expansion occurs. If wording must
change, produce new content. The fixture accepts only same-target supersession; reassociation
to another entity/role is withdrawal plus addition. This is an explicit provisional
restriction for review, not an inferred identity rule.

Supersession and withdrawal have qualified reasons, normally inline. Additional exact
content/evidence references are supplied where needed; do not repeat the target's already
available references as a mandatory support list. Ordinary additions need attributable
grounds without redundant prose. There is no special operation for revising reasons.
Later investigations may provide new grounds concerning an earlier claim, with their own
provenance; they do not change what the earlier investigator knew.

An investigram may rarely contain no new content items but meaningful qualified declarations.
The fixture demonstrates this. Mandatory filler prose would obscure the distinction.
“Metadata” describes the organizing function, not lesser epistemic obligations. Referent
information, associations and guidance can carry qualified interpretation.

## Result designation and immutable history

The first accepted contribution for Q adds a result association targeting RESULT-Q.
The fixture represents its members as exact item references and/or declaration references.
Referencing declarations lets a result explicitly include identifying/descriptive uses
and, in a declaration-only result, the organizing assertions themselves. Result membership
is qualified content organization; it is not the investigram's child tree.

B can supersede A's result association while leaving A's other associations untouched,
and independently supersede an identifying or behavioral association. Unchanged content
can be included through its original associations. No investigram is globally superseded;
there is no `sourceSuperseded` attribute on all of its items.

The exact original answer preserves its captured membership, content and qualification.
A later explicit selection can follow current declarations and show competing associations.
It must not mutate that captured answer or redirect an exact item/association reference.
The historical fact that Q produced its contributions remains fixed for the supported
lifetime; this is not a promise of indefinite cross-Session storage.

Redesignation is optional, for a result whose declared question and scope the investigator
has actually received. It requires that invocation's operation, subjects, parameters, any
selected option, and declared meaning—not merely its old answer. The fixture captures this
in `queryMeanings` alongside result projections and checks exact delivery before any new
declaration targets an earlier query result. This retained request meaning is not human
prose input or a new global operation.

Superseding an architectural association does not oblige the investigator to find and
redesignate every containing result. Other designations retain exact membership and expose
fresh displacement/membership concerns. Redesignation is never performed by the index or
renderer just to keep two organizing structures synchronized.

The fixture retains fixed, single-parent child trees as provenance/composition of submitted
bundles. A contribution pool may have several roots; no special replacement tree is needed.
Cross-investigram content references do not adopt old children. Atomic acceptance still
resolves local identities, validates references and qualification, and retains the whole
contribution together. Displacement targets predate acceptance; cycles in designated
membership are rejected.

**Provisional result-contract choice:** every successful fixture invocation allocates one
result entity and one initial result designation. The submitted bundle's content must be
reachable through an association. This is a coverage check, not proof of intelligibility,
sufficiency or valid reasoning. Result designation shape, mechanical-query coverage,
failed/partial invocations, repeated requests and cached evaluation reuse still need
application-level decisions; do not claim every product query has already migrated.

## Entity context and actual delivery

“Supply entity S” means deliver an exact, qualified selection of associated information.
Do not pass only an ID, synthesize a canonical definition, or automatically deliver S's
entire history. Competing descriptions can remain visible. Subject-only context has no
inferred navigation origin. A UI may supply an explicit origin; context and origin remain
separate.

Selecting something in Q's result uses RESULT-Q as context. Supplying the selected material
creates exposure to that result entity. Human browsing, selection, an available ID or a
reference alone creates no exposure. The selected passage need not itself become an entity.
Qualified item/declaration addresses retain original ownership even through another entity's
projection. Actual deliveries, including exact association-use provenance, not the investigator's claimed reliance, determine exposure.

The fixture materializes delivered values with source investigram, query provenance, captured
basis, source qualifications/evidence and any narrower item/declaration information. It
follows only required content dependencies (for example interaction state-transition refs),
not every informative link or every entity's descriptions. Identifying support can be
explicitly included or requested through dialogue. General ranking, bounds and missing-support
behavior still need a bounded contract; presentation retrieval/navigation remains outside scope.

**Provisional displacement eligibility:** the investigation must receive the exact earlier
association declaration and all designated members, including required semantic dependencies
and applicable source qualifications. Result targets recursively include their designated
declarations/items. That is not a demand for entire owner bundles or children. Foreign content
used by a new association must also have actually been delivered. Tests reject an ID, an item
excerpt without its declaration, missing members and stripped qualification/basis/provenance.
This replaces, rather than quietly weakens, the current whole-investigram delivery rule and
requires explicit adoption. Exceptions for partial/narrow reassociation are not implemented.

Fresh delivery discloses later declarations affecting exact selected association uses,
with reason, ownership and qualifications. References in a notice do not deliver those
members. Further acquisition remains explicit. An exact captured answer stays unchanged.

### Identifying support, alternatives and acquisition

Substantive references need enough qualified identifying information to distinguish their
referents, or an explicit unresolved/contextual designation with inspectable support. Do
not satisfy intelligibility with a bare ID or silently fetch today's preferred description
into an old exact answer. Preserve the support actually grounding the delivered claim.
Basic support obligations are application semantics; UI arrangement/retrieval design is
separate. Bounded acquisition, missing-support outcomes and exact support selection remain
open, not obligations a renderer can fill by inventing correspondence.

When two descriptions of S differ without explicit displacement, preserve and make both
available with their scope and attribution; the simple two-description case can supply
both. Difference need not be contradiction. Larger inventories require disclosed selection
bounds and access to alternatives, not automatic reconciliation or hidden last-writer truth.
A supersession can favor new information without making its acceptance a truth judgment.

Refers-to discovery remains broader than identifies/describes indexing. ADMISSION-1 lists
S as a referent even though its admission association targets P. Investigators of S should
be able to find that contribution without a known navigation origin. The current projection
simulator exercises association-backed selection, not this broader discovery/retrieval path;
that path needs an explicit context-entity/delivery contract rather than being silently lost
in the new model. Mention inventory, association target and evidential support are distinct.

Dialogue can acquire additional material after the initial context. A useful candidate is
identifying support up front plus discoverable further attributes, alternatives and evidence;
an inventory-first variant may suit large/ambiguous context. Bounds need not be a rigid
initial cutoff. Available, requested and delivered information are distinct. Substantive
listing summaries are actual context, whereas bare IDs are not. A target can become eligible
for displacement after further complete qualified acquisition during the same evaluation.

Request identity captures operation, subject, parameters and selected seed context. Later
acquisitions belong to generating provenance and cannot be known in a pre-execution request
key. Retained-answer identity, query-invocation identity and evaluation reuse are distinct;
no cache/freshness policy follows merely from assigning RESULT-Q. General discovery rankings
and budgets remain surrounding application design.

### Access obligations independent of presentation

| Access | Required distinction |
| --- | --- |
| Exact captured answer | Keep its membership, content, support and captured status/qualification context fixed. |
| Exact item/declaration inspected afresh | Preserve its target while separately exposing later declarations and qualified notices. |
| Newly selected entity/result information | Capture the chosen original/new/competing associations and support; selection does not rewrite their sources. |
| Further investigation | Use declared question meaning and explicit seed/acquired deliveries; preserve what was actually supplied. |

Equivalent captured content/support/status selections should retain the existing repeatable
selection-identity guarantee. This is separate from whether an investigation is rerun or
reused. The new types need continuous submission, validation, retention and direct/exact API
access. Existing human-output paths must preserve qualifications even while GUI/navigation
work is deferred. Neither a saved Account collection nor a special assembly Lens is implied.

## Reconsideration

A fuller description can reveal important behavior or edge cases without showing the earlier
one false. Explicit supersession or withdrawal can therefore create a reconsideration cause.
The reason explains it; factual-error classification is not required to trigger review.
The warning is not invalidation, proven reliance, or automatic rejection of an account.
Whether additions should also trigger reconsideration remains open.

Two paths matter:

1. **Exposure during investigation.** Q receives entity information, and its produced result
   and contributions retain that actual delivery provenance. A relevant later change can
   warrant reconsideration and propagate through subsequent deliveries.
2. **Designated result membership.** Q may itself create an entity and its description. A
   later change to an association included in RESULT-Q can affect that result even though
   Q had no incoming exposure to its newly created entity. Do not fabricate such exposure.

Exposure uses the actual association versions delivered, not all information associated
with the same entity. The entity remains the organizing context and discovery identity.
Q1 received P's orientation; it was not exposed to its own subsequently produced admission
association, nor to a P association another investigation creates later. Item excerpts retain
an explicit association route so partial delivery does not lose this distinction.

Result status belongs to each exact **designation**, not one warning set on RESULT-Q.
Distinguish displaced standing (a newer designation exists), membership concerns (an exact
included association was displaced), and concerns inherited from the generating evaluation's
actual context. A designation's displacement is not itself a reconsideration warning on that
same designation. Consumers that received it can nevertheless need reconsideration.

The updated designation does not acquire the cause that created it. It can still acquire
independent concerns about its exact members or producing evaluation. Historical captured
answers remain fixed; fresh status reports are separate. Receiving the new designation must
not be confused with receiving the old designation of the same result entity.

Membership and exposure operate on exact association references. Sharing a content item
through different associations is not alone a warning path. Observer/reuse results in the
fixture create their own associations to earlier items; their actual incoming exposure,
not shared text, supplies any inherited concern. Entity merge/split effects remain a separate
unimplemented identity question.

The prototype retains conservative generating-evaluation propagation: a cause affecting
actual input can follow that producer's delivered contributions. A selected result designation
can transmit its membership concerns; this does not establish item-level causal reliance.
It exempts originating evaluations from their own causes, but has no received-cause exemption
or clearance. An informed later investigation may still be flagged for an exact old association
it actually received. Addition policy, richer partial-delivery precision, exemptions and
reassessment remain open; broad entity/shared-item displacement triggers have been removed.

Causes remain distinct; no automatic transitive equivalence, last-writer truth, or disappearance
of a cause through context trimming. A supersession can be contested. Competing declarations
remain available; the fixture does not select a winner by timestamp. Withdrawal declarations
are not themselves associations to supersede in this bounded prototype. Reinstatement and
challenging the standing of declarations remain design questions, not silent undo.

## Architectural content and diagrams

The catalogue has three responsibilities: architectural concept guidance; content-type
contracts; diagram-type input contracts/mappings. They need not be three physical registries.
One item can express several concepts; one concept can have several representations or prose.
Concept classifications are qualified information. Multiple tags and investigator-proposed
concepts are possible; known icons or concept-specific operations are deferred treatments.
A small recognized vocabulary can grow without becoming an exhaustive whitelist of ideas.

The examples supply identifying descriptions, prose, admission cases, architectural
relationships, a recovery state model and an interaction. Local roles are variables within
an item with explicit scope, not automatically shared entities. Illustrations bind a general
role to an example; they are not aliases for the same scenario identity. Content refs share
claims with source qualification; entity refs share identity only. Local keys support exact
references and later selection without automatically creating identities.

State content includes bearer, states, transitions, triggers, guards/effects and limits.
Interaction content includes participants, conditions, order, alternatives, causal links and
omissions. A state-transition step names its exact state content/transition; a diagram follows
that reference rather than duplicating it in presentation metadata. Sequence position alone
is not causation. Situations assert resource occupancy, state assignment and execution progress;
they are not inferred from drawings and do not themselves assert transitions.

Presentation recommendations are optional usefulness judgments owned by their investigram.
Supported diagrams can render compatible content without them. New renderers require no
revision of earlier recommendations. Compact labels plus legends preserve conditions, scope,
evidence and causal meaning; the image alone may be only an overview. The generator cannot
invent missing nodes, transitions, correspondence or ordering. General cross-owner diagram
retrieval is not implemented; the current diagram content remains unchanged.

<a id="offered-followup-investigation"></a>
## Follow-up options and surrounding application context

Follow-up options are qualified metadata owned by exact producing investigrams. They express
available investigations, not necessarily recommended next steps. References include exact
owner and option key; replacement/reselection of entity associations does not retarget options.
The fixture follows an option made available within Q1's result while keeping its originating
owner explicit. Q2's expanded admission bundle does not repeat a question Q2 already answered.
This is an authoring choice, not a prohibition on reinvestigation.

The stipulated follow-up Lens delegates its question to the selected qualified option under
a supported method. Its default result contract is qualified information in supported types,
not a prescribed diagram. An explicit “generate a state diagram” promise additionally requires
compatible data and successful presentation, or an explicit partial/unmet outcome. Schemas
alone cannot establish adequate interpretation. Optional specialization is a conceptual
contract example, not exercised as a product API.

<a id="global-investigation-entry"></a>
Overview, Explain, structural listings, option discovery and user selection are surrounding
application context. They demonstrate fit, not a menu/UI implementation commitment. Human
pushback to investigators stays outside this slice; existing inadequacy feedback is to
researchers/developers. General reconciliation operations are not implied by selecting
retained information. Direct/exact access must preserve qualification, association standing,
actual delivery, reference lifetime and result snapshots regardless of presentation.

<a id="composition-as-a-design-probe"></a>
## Composition as a design probe

The two Cockatiel orders remain intentionally different setups. Bulkhead outside breaker:
a later caller holds execution capacity while waiting for the recovery decision. Breaker
outside bulkhead: the trial reserves the breaker slot while queued behind an independently
occupied bulkhead. State categories, scenario roles and particular execution progress remain
distinct. Scenario relationships can stay locally designated; this proves local addressing
suffices here, not that general relationship identities are never useful.

Q4 receives selected P, S, R and B information, not whole investigrams or a historical
superseded admission payload by default. Its result has its own entity and declares pattern
identities C-BB/C-BH. Follow-up can select a pattern or an exact occurrence within RESULT-Q4;
neither recreates the pair as a new generic operation or promotes every selected node.
The two-subject invocation is a design probe with explicit unordered roles. A general state
model and a second consumer of situation/resource content remain useful later probes, not
new requirements silently introduced here.

## Implementation boundary and governing changes

The [current contracts](../src/lib/investigation/contracts.ts) retain prose investigrams,
subject associations, child trees, correction records and generating provenance with
`citations` and delivery history. The [capability reference](../docs/capability-reference.md)
describes retained interpretation and follow-up within the active process, not the new
entity projection/declaration protocol. Those facilities provide qualified acquisition,
identity, history and Session lifetime machinery; they do not already implement this proposal.

Specific inspected constraints still matter for migration:

| Existing machinery | Consequence for this design |
| --- | --- |
| One investigation already returns a root with recursive children and atomic allocation | Hierarchy is existing machinery; a forest, explicit entity introductions and association/result semantics are extensions. |
| Current correction constructs a replacement and has selection/conflict/reconsideration effects | Replace those effects explicitly with declaration rules; do not merely rename the correction field. |
| Current unresolved inconsistency indexes qualified comparisons of delivered earlier investigrams | Preserve its distinct meaning. It is neither a generic alternative link nor automatic displacement. |
| `correctedSubjects` has a restricted existing subject vocabulary | New entities/result targets and association operations need explicit validation/migration. |
| Investigrams/provenance require `originatingModule` | Specify attributable originating context for new subjects; interpreted implementation correspondence cannot become a mechanical guarantee. |
| Current investigation parameters are empty; context parts are prose/referent/qualifications | Extend declared request meaning and structured partial/full delivery deliberately. Future dialogue acquisitions are provenance, not pre-request parameters. |

These findings are recorded against [acceptance](../src/lib/investigation/acceptance.ts),
[revision processing](../src/lib/investigation/revisions.ts) and the
[application boundary](../src/lib/application/index.ts). Shared identity does not require
migrating every mechanical producer/storage path in the first capability. Demonstrate
interpreted use of an existing mechanical subject while preserving its provider guarantees.

The planning package would need explicit treatment of:

- Interpreted, architectural-relationship/pattern and query-result identities; preservation
  of existing mechanical identity and result guarantees.
- Investigrams as immutable contributions; item addresses, cross-owner references,
  declaration-only results and result designation separate from fixed child composition.
- Association addition/supersession/withdrawal replacing whole-investigram correction,
  including validation, delivery eligibility, conflict/standing and exact historical access.
- Entity/result exposure and reconsideration with qualified notices and cause identities.
  Renaming citation index to exposure index should be considered alongside the actual semantic
  change; it is no longer sufficient to characterize this whole migration as just a rename.
- Representation-independent qualification, captured basis, direct/exact application access,
  atomicity and the supported Session boundary. No foundation or governing text is changed here.

## Decisions still to make in notes

| Decision | Current direction / remaining choice |
| --- | --- |
| Entity and result identity | Common reference mechanism; settle invocation/evaluation/reuse guarantees and first migration depth. No semantic deduplication. |
| Association/result shape | Fixture members reference items/declarations; decide ordering, nested-result bounds, role vocabulary and result completeness. |
| Support and eligibility | Fixture delivers full targeted declarations/members with qualifications; settle bounded acquisition, competing definitions and missing support. |
| Reconsideration | Agree addition policy, partial-delivery/producer precision, received-context exemptions and warning clearance or explicit deferral; exact association/designation identity is retained. |
| Declaration standing | Competing declarations are retained; challenge/reinstatement and result selection policy remain open. Do not infer revocation from a newer bundle. |
| Entity merge/split | Qualified correspondence and preserved old IDs; supersession/reassignment effects remain a design probe, not delivered automatically by association operations. |
| First capability | Choose delivered relationship kinds, contextual selection depth, mechanical compatibility and which composition/diagram probes become implementation acceptance tests. |

Detailed reassessment, persistence, global discovery and broader UI are candidates for
deferral, but make that boundary explicit before drafting. Do not leave a first-delivery
requirement undecided merely because the fixture can serialize it.

Verification should combine deterministic acceptance/history/API tests, an actual bounded
investigation testing discovery/reuse and supported dialogue, and representative rendering.
The [current authored checks](structured-account-example/README.md#verification) establish
structural/lifecycle consistency only. They do not prove interpretation quality, semantic
identity, performance, live agent compliance or product acceptance.

## Designs and theories to build on

Prior research identified [incremental formalization](https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html),
[qualified statements](https://www.mediawiki.org/wiki/Wikibase/DataModel/Primer),
[reason maintenance](https://dspace.mit.edu/entities/publication/5377b306-4ecc-4687-b1f5-78cbb4a0543a)
and [nanopublications](https://nanopub.net/docs/guidelines/) as conceptual precedents.
Missing information is not a negative assertion; structural validity is not truth;
an agent's classification remains a claim. No library selection or universal logical
inference engine follows from these references.


The earlier [research discussion](structured-architectural-accounts.md) considers incremental
formalization, qualified statements, reason maintenance and nanopublications. Their useful
lesson here is to preserve identity, claims, provenance and contestability separately.
Avoid adopting a universal truth-maintenance model merely because it can express the data.

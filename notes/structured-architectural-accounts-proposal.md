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

<a id="identity-findings-with-existing-mechanisms"></a>
For this capability, existing mechanisms are sufficient for duplicate or conflated identities.
Retain qualified correspondence claims between independently introduced IDs. For a conflated
entity, introduce distinct entities and explain their relationship to the original; use ordinary
association additions, supersessions or withdrawals for specifically justified changes. Original
IDs, content and histories remain inspectable. No dedicated merge/split operation or content type
is required merely to express those findings.

Defer automatic ID aliasing, pooling or reassignment of associations, entity-level supersession
and propagation triggered specifically by identity changes. A correspondence claim does not
silently make two IDs interchangeable or transfer their information. Choosing how to present
these histories and relationships may be awkward, but that is later UI work and does not require
more organizing machinery in this capability. These are supported uses of the proposed mechanisms,
not a claim that a new executable merge/split probe has been completed.

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

<a id="recognized-request-reuse"></a>
A repeated user request is not automatically a new investigation invocation. When PostCode
recognizes it as the same request and reuses Q1's retained investigation, it returns the existing
RESULT-Q1 identity. It does not create Q2, another result entity/designation, duplicate architectural
entities or new interpretive claims. Access/reporting may be recorded separately; exact redisplay
is likewise access, not a new investigation. This preserves the existing reuse behavior.

A new Q represents a new investigation undertaken—for example because effective inputs changed,
or a supported operation explicitly requests new investigation. Same wording alone does not
establish equivalent inputs. This agreement does not introduce a rerun operation, specify a new
cache key, or change mechanical qualified-answer identity. Existing exact-history and fresh-selection
rules still determine what is returned; reuse does not silently mutate the captured answer.

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

Redesignation is optional. Its operation instructions tell the investigator to understand the
earlier invocation's question and scope, including operation, subjects, parameters and selected
option—not merely its old answer. The fixture captures that context in `queryMeanings` alongside
result projections. When delivered, it must be recorded accurately; prior delivery is not an
acceptance prerequisite. This retained request meaning is not human prose input or a new global
operation. Structural acceptance does not certify that the new designation answers that question.

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
failed/partial invocations and first migration depth still need application-level decisions.
Recognized reuse returns the existing query-result identity as specified above; the authored
simulator exercises new invocations, not the product reuse coordinator. Do not claim every
product query has already migrated.

## Entity context and actual delivery

“Supply entity S” means deliver an exact, qualified selection of associated information.
Do not pass only an ID, synthesize a canonical definition, or automatically deliver S's
entire history. Competing descriptions can remain visible. Subject-only context has no
inferred navigation origin. A UI may supply an explicit origin; context and origin remain
separate.

Selecting something in Q's result uses RESULT-Q as organizing context. Supplying the selected
material records exact association/content exposure through its designation route, not exposure
to everything about that result entity. A separately acquired inventory records its scope and
delivery position. Human browsing, selection or a bare reference alone creates neither kind of
investigator exposure. The selected passage need not itself become an entity. Qualified addresses
retain original ownership even through another entity's projection. Actual deliveries, not an
investigator's claimed reliance, determine the structural exposure record.

The fixture materializes delivered values with source investigram, query provenance, captured
basis, source qualifications/evidence and any narrower item/declaration information. It
follows only required content dependencies (for example interaction state-transition refs),
not every informative link or every entity's descriptions. Identifying support can be
explicitly included or requested through dialogue. General ranking, bounds and missing-support
behavior still need a bounded contract; presentation retrieval/navigation remains outside scope.

<a id="displacement-acquisition-guidance"></a>
**Displacement acquisition is an investigator instruction.** Before superseding or withdrawing
an association, acquire its complete designated content, qualifications and required support,
including semantic dependencies. Result targets include their designated declarations/items;
this does not require entire owner bundles or unrelated children. Acquisition may proceed over
successive dialog requests. Investigators are expected to follow this instruction and supply
qualified grounds; PostCode does not attempt to verify understanding.

For the first capability, defer mechanical enforcement of target-support completeness. Structural
acceptance still validates exact existing eligible targets, compatible target/role, operation
shape and required grounds. It also validates the accuracy and qualification of recorded deliveries:
an ID is not delivered content, and a reason does not deliver its referenced members. A declaration
can therefore be structurally accepted even if the recorded context is insufficient under the
investigator instruction. That is not certification of adequate analysis or instruction compliance.
Observe instruction-following in the end-to-end investigation before deciding whether a completeness
gate is needed. This changes the proposed replacement for the governing correction rule and needs
explicit adoption before product implementation; qualification/evidence/provenance obligations remain.

<a id="validation-and-investigator-policy"></a>
**General first-capability policy:** PostCode mechanically validates data integrity and operational
contracts: schemas, required fields, reference resolution and types, ownership, acyclicity, valid
operation targets, atomicity and faithful history/delivery/exposure records. It checks that evidence,
qualifications and grounds are represented where required, not that they substantively establish
a claim. Valid data is not certification of a valid interpretation.

Reasoning and investigation policies belong in investigator instructions. Mechanical checking of
those policies is deferred until demonstrated need. In particular, reuse has no separate prior-
exposure gate or special new instruction beyond understanding and qualifying information used;
references must resolve and preserve source provenance/qualification without inventing prior exposure.
Redesignation instructions require understanding the earlier question, but the checker does not
require its prior acquisition. The fixture now exercises both boundaries as well as displacement.

If policy checks are introduced later, they may participate in the dialog: identify an apparent
omission, remind the investigator of the policy, and allow further acquisition, clarification or
revision before a final submission. Acknowledging a reminder alone does not prove a policy was
satisfied, and dialog recovery cannot make malformed final data acceptable. No semantic checker,
reminder protocol or new application interaction is implemented in this capability. Existing
structural errors could likewise be made recoverable in the dialog without weakening final validity.
This is a proposed design policy, not a revision to adopted governing documents or product behavior.

Fresh delivery discloses applicable declarations with reason, ownership and qualifications.
A substantively supplied declaration is itself an exact exposure, so its later displacement can
create a direct cause. Bare references inside that declaration do not deliver their targets or
members. The fixture derives declaration exposure from its captured qualified disclosures;
target-support acquisition remains an investigator obligation, not a mechanical gate. Fresh access also discloses subsequent displacement
of those supplied declarations, without retroactive warnings or automatic reinstatement.
Further acquisition remains explicit. An exact captured answer stays unchanged.

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

Specify acquisition at the investigation boundary, leaving dialog tools to implementation.
An investigation receives its subject, question and selected initial context, and can acquire
further qualified information. Selection by exact association reference creates content exposure
only. Selection by scope—for example all undisplaced identifying descriptions of S—also records
the scope guarantee and delivery position, even without a separately requested inventory list.
A matching later description could have changed the supplied selection. Do not invent an unseen
list as delivered content, or erase the actual selection dependency because the coordinator made
it up front. The fixture's `selectionScope` captures one complete undisplaced entity/role policy;
it is not an authority ranking or general initial-context algorithm.

A separate “what else is known?” acquisition supplies an inventory with scope/coverage and
captured position, without delivering listed content. Requesting a particular association then
establishes content exposure. Scope-selected content and explicit inventory acquisition both
create selection-opportunity dependencies. No automatic delivery of every other association's
reason. General ranking and partial selection remain outside this bounded contract.

Available, requested and delivered information remain distinct. Mechanical inventory entries
record availability; substantive listing summaries would additionally be delivered interpretive
content with its own provenance and qualifications. Inventory discovery does not satisfy the
instruction to acquire complete qualified support before displacement; structural acceptance
and fulfillment of that instruction are separate.
Incomplete/paged inventories must disclose their actual coverage; the probe uses complete scoped
lists and does not yet generalize those acquisition policies.

Request identity captures operation, subject, parameters and selected seed context. Later
acquisitions belong to generating provenance and cannot be known in a pre-execution request
key. Retained-answer identity, query-invocation identity and evaluation reuse are distinct;
no cache/freshness policy follows merely from assigning RESULT-Q. General discovery rankings
and budgets remain surrounding application design.

### Access obligations independent of presentation

| Access | Required distinction |
| --- | --- |
| Exact captured answer | Keep its membership, content, support and captured status/qualification context fixed. |
| Exact item/declaration inspected afresh | Preserve its target and supply applicable displacement/inherited-cause context, not every addition about the entity. |
| Explicit inventory acquisition | Capture availability scope, actual entries/coverage and delivery position without pretending the listed content was supplied. |
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
The [revised addition probe](structured-account-example/additions.md) distinguishes
**association exposure** from **inventory exposure**. Later additions affect earlier inventory
recipients when the new association falls within an acquired inventory's or content-selection
scope. Receiving a definition by exact reference, or a fixed result containing it, does not by
itself imply that scope dependency. Receiving all definitions selected by a declared scope does.
The cause is the exact new declaration; it does not claim that new content was received earlier.

The fixture lists all retained association addresses/roles for an entity and selected roles,
including displaced ones, without interpretive summaries or standing claims. A supersession
also introduces an entry and can affect that inventory. Withdrawal preserves the historical
entry, so it affects exact content recipients but not this inventory's membership. Current-only,
status-bearing, ranked or partial inventories need their own explicit change/coverage rules.

The original by-reference boundary control remains 0/7 evaluations and 0/8 designations for
either tested addition; none acquired an inventory or content-selection scope. This is not a
realistic warning-rate estimate. A separate inventory reader and its result consumer give 2/9
and 2/10. In the [discovery follow-up](structured-account-example/acquisition.md), Q2 actually
lists S's available associations and retrieves selected content: either addition then reaches
3/7 evaluations and 4/8 designations. A separate scope-selected identifying-context probe also
reacts to another identifying description while its exact-reference counterpart does not.
The older entity-wide 5/7 and 7/8 counts remain a historical comparison. No targeted suppression,
semantic harmlessness assertion or empirical frequency claim is used.

Three paths matter:

1. **Exposure during investigation.** Q receives entity information, and its produced result
   and contributions retain that actual delivery provenance. A relevant later change can
   warrant reconsideration and propagate through subsequent deliveries.
2. **Designated result membership.** Q may itself create an entity and its description. A
   later change to an association included in RESULT-Q can affect that result even though
   Q had no incoming exposure to its newly created entity. Do not fabricate such exposure.
3. **Availability/selection scope.** Q acquires an inventory or receives content selected by
   a declared scope, initially or later. A matching association could have changed the selection.
   Its outputs can inherit that concern. Fixed result membership alone is not such a scope.

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

For displacement, membership and exposure operate on exact association references. Sharing a content item
through different associations is not alone a warning path. Observer/reuse results in the
fixture create their own associations to earlier items; their actual incoming exposure,
not shared text, supplies any inherited concern. Automatic entity merge/split effects and
identity-specific propagation are deferred; qualified identity findings use existing mechanisms.

Removing acquisition gates makes one coverage limit explicit: an ordinary association can
reference an earlier item without its producer receiving the source association. Later displacement
of that source association then has no exposure path to the reuser. This is not a reason to invent
exposure or make one association's displacement invalidate every use of shared content. Even with
acquisition, the path is the exact association actually delivered, not a uniquely privileged
"original association." Instruction-following affects whether that path exists.

Result designations acquire membership causes when they include the exact association being
displaced (directly or through nested declaration membership). A direct item reference alone does
not supply this protection. References, deliveries and designated membership are distinct.
An audit of references without prior delivery can be derived from the existing records for a
future study or dialog check. Defer a dedicated retained "used without delivery" field and any
propagation dependency based on it; neither follows from structural acceptance.

<a id="current-standing-of-causes"></a>
Fresh inspection of a reconsideration cause should expose its current declaration standing. If B
superseded A and C later supersedes B, an earlier recipient of A still has historical cause B;
C is not a new exposure-based cause merely because it changes B. Fresh qualified access can show
B together with C and their exact relationship. It does not clear B, certify the recipient's answer,
or reinstate A. The current standing is derived from retained declarations, not a new stored flag.
The [renewal probe](structured-account-example/acquisition.md#current-standing-of-a-cause) exercises
this through existing standing lookup and fresh result disclosure, preserving captured history.

The prototype retains conservative generating-evaluation propagation: a cause affecting
actual input can follow that producer's delivered contributions. A selected result designation
can transmit its membership concerns; this does not establish item-level causal reliance.
The timing boundary is each actual delivery, including later acquisitions during a dialogue.
A displacement already accepted at that point is known context and must be disclosed; it is
not a later change to that delivery. Missing disclosure is a delivery defect, not a substitute
reconsideration warning. This applies to direct association exposure, designation concerns and
inherited generating-context concerns, so a known cause cannot re-enter through another path.
The producing evaluation also remains exempt from its own causes.

New designation membership follows the same distinction: an association already displaced
when the designation is accepted retains that standing, without a new membership warning.
Its producer can still need reconsideration if it actually acquired the relevant information
before the displacement. A later refresh does not erase an earlier exposure or clear its
warning. Historical designations and their existing causes remain unchanged.

The fixture records host-assigned acceptance positions and the retained-state position of each
captured delivery. An investigation may finish after a change while its inputs precede it;
neither query start nor final acceptance substitutes for actual delivery time. Fresh projections
disclose known direct and indirect causes with qualified reasons. Notice receipt establishes
awareness, not sufficient replacement context or endorsement of the displaced association.
Further acquisition and qualification obligations still apply.

This timing rule does not implement reassessment or clearance. Richer inventory coverage and
partial-delivery precision and reassessment remain open. Displacement
uses exact association exposure; additions use actual scoped inventory exposure. A newly read
inventory includes already accepted entries without a later-change warning; a refresh does
not erase an earlier inventory exposure. Acquiring a description before an addition and the
inventory only afterward does not create a pre-addition inventory dependency.

Causes remain distinct; no automatic transitive equivalence, last-writer truth, or disappearance
of a cause through context trimming. A supersession can be contested. Competing declarations
remain available; the fixture does not select a winner by timestamp. Withdrawal declarations
are not themselves associations to supersede in this bounded prototype.

<a id="renewed-association"></a>
### Renewed assertions without reinstatement

Working agreement: challenge earlier information through new qualified associations, without
revoking the historical displacement. If B superseded A, C may supersede B while referencing
A's original content. A remains displaced; C is the new assertion. Reused content retains its
original ownership, evidence, qualifications and provenance, while C has its own attributable
grounds. The acquisition instruction and structural eligibility rules apply. Reuse does not clear causes or
establish that the original content is generally sound.

After a withdrawal, C can add a new association to the earlier content without undoing or
superseding the withdrawal declaration. D can later disagree with C and supersede or withdraw
C in turn; it can reuse qualified earlier content where appropriate. C acquires no final
authority, and no timestamp silently settles competing assertions. These operations restore availability
through a new assertion, not the standing of an old association or an old result designation.

Defer general declaration revocation and reinstatement. Historical deliveries, displacement
records and reconsideration causes remain; this choice adds no clearance or reassessment rule.
The A → B → C → D sequence is an illustrative contract case, not a newly executed fixture.

<a id="competing-associations"></a>
### Competing associations remain available

Working agreement: if B and C both supersede A and neither displaces the other, both remain
available. Scoped acquisition of current descriptions includes both with their qualifications,
grounds and required support; current here means undisplaced, not reconciled or authoritative.
PostCode does not choose by recency. Exact-reference acquisition can still request one particular
association and must disclose its applicable standing; that is not a claim to have acquired all
current descriptions. Fixed result designations are not silently expanded.

The bounded discussion assumes sequential investigations, not parallel producers. When C acquires
A after B's supersession, fresh delivery discloses B's declaration. C can acquire the required
members/support and explicitly supersede B if warranted. Competition is therefore an edge case,
not an assumed routine race: C may deliberately leave B standing while asserting a different
account. Merely learning that B exists does not deliver all of B's content or fulfill the
acquisition instruction, even though no target-support completeness gate is enforced. The fixture's competing declaration remains a useful deliberate case; it does not
establish an observed frequency. General delivery bounds remain to be specified without silently
choosing a winner or claiming complete coverage for a partial selection.

### Architectural coverage dependencies — deferred

ADMISSION-1's admission item already claims coverage of runtime admission cases. New waiting
information could challenge that claim even if added without superseding it and without any
prior inventory/scope acquisition. The current repairs do not assign that claim a standing
dependency on future P/describes associations. Completeness of a selection of retained
information is distinct from completeness of an architectural account of program behavior.

Defer declared dependencies and investigator-directed propagation beyond the first capability.
Declared dependencies could anticipate a relevant change scope; investigator-directed propagation
could identify affected earlier results when a new finding emerges. Both would supplement actual
exposure tracking, not replace it or fabricate deliveries. They may be complementary. Observe
how often coverage gaps arise, in which circumstances and with what consequences before choosing
between them or designing both. Broad P/describes scope admits unrelated information; narrower
admission semantics and qualified impact assessment each need further design.

Keep the added-waiting-case example as a deferred coverage test. Without prior relevant inventory/
selection exposure or explicit displacement, no automatic reconsideration cause is guaranteed.
This is an accepted limit, not a claim that the earlier explanation is unaffected. No dependency
metadata, standing subscription or investigator-directed concern contract is introduced here.

### Deferred investigator-directed propagation, reassessment and scheduling

The human accepts the coverage limit: an exposure-based mechanism cannot find every earlier
explanation that new information might affect. The current direction is suitable for the first
capability; do not reinstate broad entity-based propagation to seek perfect coverage.

**Investigator-directed propagation** could later supplement structural causes. An investigator
might already know an earlier result, or ask which earlier evaluations received associations
about an entity (including other information roles). An exposure-index lookup would identify
candidates, not assert impact or deliver their substantive content. The investigator would
acquire selected results, their questions/scopes and relevant qualified support, then identify
an exact result designation that may need updating, with an exact new finding/cause and a
qualified explanation. That concern could enter the same cause-preserving propagation mechanism.
Candidate discovery, eligibility and the concern's retained representation still need design;
no reverse-lookup API, new declaration type or executed probe is introduced here.

This differs from targeted suppression: it adds a justified concern where automatic exposure
rules missed one. It does not retroactively invent inventory/content exposure, displace the
earlier information, establish a replacement, or require exhaustive search of earlier results.
Actual review deliveries would themselves be recorded. An omitted assessment means unassessed.

Keep targeted suppression by the causing investigator and later reassessment together as
a deferred, qualified, target-and-cause assessment mechanism. An omitted assessment does
not mean unaffected. An assessment that a target needs no change is distinct from a finding
that this cause need not propagate through it. Other causes and independent paths remain;
neither operation certifies the target generally or rewrites historical deliveries.

PostCode could later initiate reassessment automatically, starting with immediately affected
results (the discussion's "0th-order dependents"). Qualified findings might stop further
propagation along those paths without waiting for a user to request reassessment. This is
an orchestration policy over the same assessment mechanism, not weaker evidence requirements
or permission to silently discard a cause. Whether to assess before surfacing warnings or
to expose pending status while assessing remains future behavior, not a UI commitment here.

Scheduling could also respond to UI state: prioritize information underlying currently
visible views, or reassess when a user re-exposes a view. The interface supplies a scheduling
signal; the assessment still concerns exact retained targets and causes. Visibility alone
is not investigator exposure and does not clear warnings or rewrite an exact captured answer.
Only actual reassessment deliveries create new exposure. Pending-status behavior, blocking
versus background execution and scheduling limits remain deferred presentation/orchestration
choices, rather than requirements of the retained-content model.

Investigator-directed propagation, targeted suppression, reassessment/clearance and automatic
scheduling remain deferred and unimplemented. The original
broad experiment flagged outputs that manual inspection found unlikely to require substantive
change. The refined boundary removes those addition causes structurally: no inventory was
received. It does not prove semantic harmlessness or establish that every important new fact
will be noticed. A genuinely new finding might matter to an investigator that never requested
an inventory. Keep that coverage limitation explicit; do not reintroduce implicit entity-wide
exposure through result membership to hide it. These results do not establish that first delivery
requires suppression or clearance. Test further if that scope decision needs stronger evidence.

Exposure granularity grows with actual acquisition, not every retained association. Inventory
exposure can be indexed by its scope/position without creating content-exposure edges for all
entries. Implementations may share delivery records across outputs and index direct edges
separately from derived propagation, preserving meaningful acquisition times. No performance
bound or storage representation is decided by the authored probe.

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
  including structural validation, acquisition guidance, conflict/standing and exact historical access.
- Exact association/content exposure, separate scoped inventory exposure, and result-membership
  reconsideration with qualified context disclosures and exact cause identities. Entity/result
  IDs organize access; they are not blanket exposure units.
  Renaming citation index to exposure index should be considered alongside the actual semantic
  change; it is no longer sufficient to characterize this whole migration as just a rename.
- Representation-independent qualification, captured basis, direct/exact application access,
  atomicity and the supported Session boundary. No foundation or governing text is changed here.

## Decisions still to make in notes

| Decision | Current direction / remaining choice |
| --- | --- |
| Entity and result identity | Recognized reuse returns the existing invocation/result identity; no duplicate result for repeated access. Set first migration depth and failed/partial-result treatment. No semantic deduplication. |
| Association/result shape | Fixture members reference items/declarations; decide ordering, nested-result bounds, role vocabulary and result completeness. |
| Support acquisition | Reasoning policies are investigator instructions; their mechanical enforcement is deferred. Data integrity and faithful qualified deliveries remain enforced. Set bounded acquisition/missing-support behavior; scoped current-description acquisition includes competing undisplaced associations and exact-reference acquisition remains narrower. |
| Reconsideration | Distinguish actual association and inventory exposure; additions trigger matching prior inventories, not every entity use or fixed result membership. Refined probe removes the earlier broad marks. Record both inventory and scope-selected content acquisition; exact delivered declaration reasons are exposure too. Set first-delivery coverage explicitly; richer selectors remain open. Investigator-directed propagation, suppression, reassessment/clearance and scheduling are deferred. |
| First capability | Choose delivered relationship kinds, contextual selection depth, mechanical compatibility and which composition/diagram probes become implementation acceptance tests. |

Declared dependencies, investigator-directed propagation, targeted suppression, reassessment/clearance
and automatic scheduling are deferred beyond the first capability unless a later concrete need changes that
scope. Persistence, global discovery and broader UI remain outside this work. The plan must
carry these boundaries explicitly, while resolving the actual first-delivery contracts.

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

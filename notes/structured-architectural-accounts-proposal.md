# Structured architectural accounts: working proposal

Updated: 2026-11-13

Exploratory working proposal, not an adopted decision or implementation authorization.
This version conforms the current synthesis and authored fixtures to entity-organized
accounts, association declarations and query-result entities. It replaces the earlier
working recommendation to supersede entire investigrams. Governing documents and the
implemented application still use their existing model; their revision requires the
later planning package. Historical discussion remains in the [discussion notes](structured-architectural-accounts.md).

Read the [consolidation](structured-architectural-accounts-consolidation.md) for the
ownership maps, the [walkthrough](structured-architectural-accounts-example.md) for the
worked thread, and the [fixture guide](structured-account-example/README.md) for exact
payloads and executable checks. Consequential architectural decisions and the promised capability
should be settled here before drafting. Detailed schemas, API shapes and operational bounds need
not be settled merely to make a fixture executable. Provisional fixture choices are reviewable
examples, not silently adopted policies; see the design/implementation boundary below.

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
- **Analyses contribute content and association declarations.** Mechanical and agentic
  analyses can use the proposed common contribution structure. An investigram is
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

Mechanical and agentic producers share identity/reference and qualified-information
semantics without identical storage or guarantees. Mechanical provider identity must retain
its deterministic captured-basis/Session behavior. Do not mint fresh IDs merely on repeated
encounter, or parallel architectural module IDs just to investigate a module. Mechanical
claims can be content in the proposed generalized investigram, without artificial interpretive
prose or agent provenance. The admission/trial fixtures seed compatible module/policy references; the separate
[unification probe](structured-account-example/unification/README.md) now exercises authored
mechanical contributions. Live producer integration remains unverified.

Architectural relationships and ordered patterns may be explicitly identified as entities.
Not every edge becomes an entity. A relationship identity does not assert occurrence,
participants or conditions; those remain qualified claims. Query-result identities are
another distinct proposed kind. Both extensions require governing clarification, not just
renaming fields.

<a id="mechanical-and-interpreted-contributions"></a>
## Mechanical and agentic production of contributions

Working direction: generalize Investigram from an interpretation artifact to an immutable,
qualified analysis contribution bundle. Mechanical and agentic producers can contribute
content and association declarations through common organizing machinery. Method, captured basis,
evidence, scope and guarantees remain attributable; common packaging does not confer one producer's
guarantees on another's claims. "Interpretation content" would need a broader governing definition
and name (provisionally analysis content). No adopted document is changed by this recommendation.

<a id="investigation-and-execution-vocabulary"></a>
Working vocabulary: **investigation** is the architectural inquiry; **analysis** is work performed
within it; **interpretation** is explanatory judgment or inference; an **investigram** retains a
qualified analysis contribution. **Mechanical** and **agentic** distinguish mechanisms for creating
investigrams, not two kinds of artifact or guarantees. They are current examples, not an exhaustive
taxonomy: hybrid or other future mechanisms can produce the same qualified contribution type.
The common model must not require every producer to be classified as exactly one of these two.
Use **investigating agent** for the agent
participating in the dialog, rather than making every provider implement an agent interface.

The operational boundaries remain distinct: an **agentic analysis runner** manages agent dialog,
tools, limits and submissions; a **mechanical analysis provider** executes source-analysis operations
behind its provider boundary. Both feed common data-integrity/retention contracts. These component
names are working terminology, not an adopted code rename or a requirement for one execution API.
An investigation can use either mechanism or both. If an agent requests mechanical analysis, the
mechanical contribution keeps its own producer attribution; reuse does not relabel it agentic.
An agent's additional interpretation has its own attribution. In the probe, `producer.kind` now
records `mechanical` or `agentic`; claim method, evidence, scope and guarantee remain separately
attributable. Those two accepted values bound the current fixture, not the conceptual model.
Supporting another mechanism requires its method attribution and execution integration, not a new
kind of investigram. A hybrid label alone would not replace attribution of the actual contributing
methods. No hybrid execution contract is specified now. Mechanical/agentic alone does not establish
correctness, completeness or observation.

The shared definitions do not erase differences in epistemological capability. For supported
questions, a mechanical method can establish verified facts within its stated captured basis,
assumptions and scope. Agentic interpretation does not independently provide that verification
guarantee merely by reaching or asserting a conclusion. An agent can use or relay mechanically
verified information; its verification remains attributable to the establishing method. These are
capabilities and guarantees of the particular mechanisms/methods, recorded in their contracts and
claim qualifications, not restrictions built into the definitions of investigation or investigram.
Neither all mechanical output nor every claim in a mechanically produced bundle is thereby verified.

Either kind of analysis may enhance, qualify, challenge or supersede information from the other.
For example, mechanical analysis may establish statically resolved module dependencies while an
interpreted investigation identifies a runtime dependency through a dynamic loader or configuration.
That can add complementary qualified information about the same modules without displacing a valid
static-dependency association. If an earlier contribution claimed exhaustive dependency coverage,
the new finding may instead warrant explicit supersession of that association. Whether it does is
a substantive analysis judgment, not a consequence of producer type. An inferred runtime dependency
retains its conditions and evidence; it is not silently represented as an observed execution.

An interpreted replacement of mechanical information retains interpreted provenance and guarantees;
a mechanical replacement of interpreted information retains its own method guarantees. Neither
erases the earlier contribution or inherits its epistemic status by occupying a similar role.
Later mechanical discovery can also extend an interpreted account without alleging an error.
Fuller prose alone warrants addition alongside a valid mechanical finding, not its displacement.
When supersession is justified, its qualified grounds should explain material changes to method,
scope or guarantee; the notice delivers those grounds and preserves the exact old/new qualifications.
Defer a minimum-guarantee selector: scoped guarantees do not form a universal ordered scale.

An investigram is not necessarily the atomic acceptance boundary: a contribution submission may
contain several investigrams. Mechanical analysis may produce reusable contributions incrementally;
unification need not require an entire analysis to finish atomically. Evaluation outcomes remain
separate, including incomplete work, failure and established empty results. Existing mechanical
identities and deterministic reuse must be preserved, without duplicate entity creation on access.

The human explicitly prefers sound design over preserving the existing split to avoid migration
work. Pre-release document and implementation changes are not a compatibility constraint. The
[worked unification](structured-account-example/unification/README.md) now maps authored module
discovery, later export/symbol contributions and source-dependency analysis into the common model.
An interpreted conditional target complements the mechanical indeterminate target. The authored
stages distinguish the mechanical finding from an agentic declaration selecting it in place of an
earlier inference. A fuller interpreted explanation is an addition alongside the mechanical
finding, preserving its current availability and guarantee.

The probe supports this direction and identifies three concrete requirements:

- Identifying content can be structured mechanical information rather than a mandatory prose
  description. Supported identifying content types still resolve explicit introductions and carry
  qualifications. Before acceptance, host/provider identity resolution binds repeated native
  identities within supported scope to existing entities. The analyzer need not inspect Session
  state. Native keys differ from common IDs. A genuinely different provider identity scope can
  allocate fresh common IDs without implied correspondence; fresh common-ID collisions still fail.
  Equal identifying contributions may reuse **undisplaced** associations without inventing analyzer
  delivery/exposure. If displaced, recomputation can add a new identifying contribution on the same
  entity, preserving the earlier displacement and any replacement. The host records exact equality
  history to the displaced association; fresh delivery discloses its qualified displacement reason.
  This does not invent analyzer exposure, deliver old content, infer semantic equivalence or clear
  concerns. Subsequent consumers receive and expose the reasons actually delivered. Renewal does
  not adjudicate disagreement. The probe exercises both supersession and withdrawal, along with identical reuse,
  changed methods, new identity scope and per-investigram provenance, separately from query reuse.
- Provenance must retain the actual producing method and basis per contribution. Selecting content
  from different producers must not flatten it to one method, basis or guarantee. The shared probe
  permits host-attributed provenance per investigram within one acceptance. Computing a target
  and deciding to displace an earlier inference are separately attributed, even in one submission.
  An explicit deterministic organizing policy could also author a declaration under its own method.
  The organizer's association alone can make the mechanical item reachable across the submission;
  a second association owned by the mechanical bundle is unnecessary. A later investigation that
  rejects the organizing use while keeping the finding withdraws that association and adds a new
  association to the original item, retaining its provenance/guarantee. Restoring use of the earlier
  interpretation likewise requires an explicit addition, not reversal of its displacement. Selection-only basis names
  retained inputs actually used, not source it did not read. When source is also supplied and cited
  (Q-R), capture both source and retained inputs. Original source bases remain with selected items.
  Older fixtures retain their single fixed basis.
- Evaluation/outcome, contribution, query result and selected answer remain distinct. An established
  empty export surface is content; unavailable analysis does not manufacture that content. Reusing
  an existing answer does not allocate another result. One public request may involve several
  methods; not every internal compiler phase needs a public query-result entity.

Four small content contracts, six provider re-encounter branches, organizing withdrawal-plus-
addition/restoration and twenty-eight malformed cases are exercised. No native provider, live investigator or proposed constant-target method was run.
Production content contracts, actual coordinated execution, detailed stage boundaries and full
partial/failure result handling remain planning work. First native verification must include
a mechanical consumer of retained claims, such as export projection reading module naming,
with qualified delivery/exposure and later-displacement checks, as well as identity re-encounter.
A method-specific Lens must preserve its question and guarantee, rather than simply
selecting the latest description of its subject. This direction withdraws the earlier blanket
exclusion of mechanical claims from investigrams.

## Agreed implementation scope: existing mechanical information, staged

The human chose migration of all currently supported mechanical architectural information within
this plan, with staged implementation and verification. A partial migration is an intermediate
milestone, not the intended endpoint. The stages are:

1. Module discovery/identification and exports, including later symbol introduction and actual
   mechanical consumption of retained module naming.
2. Dependencies and remaining module information, including associated documentation and module
   composition, preserving qualified targets, coverage and partial/empty distinctions.
3. Project/repository organization: groups, containment, placement and qualified properties.
4. Integrated use of these real contributions in the bounded agentic investigation journey, with
   exact access, standing, provenance and exposure verification within the supported Session.

This scopes the existing architectural outputs, not new analyzers or a rewrite of every provider
algorithm. Provider internals and physical record storage may remain where suitable; architectural
information must participate consistently in the common contribution/association model. Preserve
method-specific result contracts, qualification, deterministic identity guarantees and outcomes.
Persistence, broader navigation/GUI, new mechanical capabilities (including the hypothetical
constant-target method), automatic reassessment and suppression of repeated provider output remain
outside this scope. Preventing a provider from reasserting withdrawn information would require an
explicit host policy; renewal history alone does not suppress production.

## Entity storage and lookup

These are architectural migration requirements and observations of current code, not a chosen
storage implementation. Stable entity identity is separate from the qualified information
associated with it. The common entity-facing contract replaces the existing specialized claim
lookup paths; it must not introduce a parallel registry of architectural versions of existing
mechanical entities. Provider identity resolution remains responsible for native continuity.

| Responsibility | Current implementation observation | Proposed treatment |
| --- | --- | --- |
| Immutable storage and exact retrieval | `MemoryProgramRecordStore` stores records by ID, validates references and accepts atomic batches. | Preserve these guarantees; reuse or adapt the storage where suitable. A new storage engine is not required by unification. |
| Entity identity and reference binding | Specialized module, symbol and group records coexist with Session reference bindings and provider identity rules. | Resolve to common identities without duplicating the underlying things. Provider-native identity, common identity and human-facing reference spellings remain distinct responsibilities. |
| Identifying information | Module/symbol/group records point to one `claim`; subject resolution follows module/group claims for names. | Obtain qualified identifying information through associations. An original identifying claim may remain exactly addressable, but cannot silently act as the authoritative current description outside association standing/selection. |
| Subject lookup | Resolution recognizes a fixed module/group/investigram vocabulary and uses qualified populations for name matching; precise bindings do not require population acquisition. | Generalize supported subject resolution while preserving applicability, ambiguity, population coverage and qualification. Entity identity and the Subject role remain distinct. |

The observations are grounded in [record contracts](../src/lib/records.ts),
[the memory store](../src/lib/memory-store.ts), [reference bindings](../src/lib/identity.ts)
and [subject resolution](../src/lib/subject-resolution.ts).

Exact ID/reference resolution and name search are different operations. An existing entity ID
continues to identify the same entity within the supported Session even if identifying associations
are displaced or withdrawn. Resolving that ID does not select a canonical description or deliver
all associated content. It does not extend reference lifetime beyond the Session.

Name search uses qualified identifying information: matching a name does not establish identity,
several entities may match, and multiple descriptions may concern one entity. Search results must
preserve the standing, qualification and population coverage relevant to the lookup rather than
silently treating a displaced description as current. The exact search scope and treatment of
historical names remain contract details to settle; this does not introduce fuzzy search, semantic
deduplication or a new UI. Established precise reference bindings are not mutable descriptive names.

Classes, maps, indexes, physical record layouts and reuse of existing lookup code are implementation
choices. The architectural requirement is one consistent identity/information contract, including
exact historical access and qualified selection, not one universal table or the removal of all
provider-specific records. Migration verification should include exact resolution after identifying
information is withdrawn, ambiguous names and lookup over incompletely established populations.

## Content and declarations

A **content item** is a keyed portion of substantive analysis content (broadening the current
governing "Interpretation content"). Its **content type**
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
[application boundary](../src/lib/application/index.ts). The agreed endpoint brings all existing mechanical architectural information into the common
model in stages. This does not require replacing every physical storage path or provider algorithm.
Verify interpreted use of mechanical subjects while preserving their provider guarantees.

The planning package would need explicit treatment of:

- Interpreted, architectural-relationship/pattern and query-result identities; preservation
  of existing mechanical identity and result guarantees.
- Investigrams as immutable mechanically or agentically produced analysis contributions, with explicit
  method-specific guarantees; broader content terminology, item addresses, cross-owner references,
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

## Design requirements, implementation choices and deferred capabilities

The human clarified that these notes should not prescribe implementation choices merely because
the authored probes required concrete ones. A choice belongs in the architectural design when
changing it would change what retained information means, what an investigator can rely on,
what a consumer receives, or the promised capability. Different implementations that preserve
those guarantees need not be decided here. Observable failure, completeness or qualification
behavior cannot be dismissed as an implementation detail.

| Area | Architectural requirement or decision | Implementation freedom within that boundary |
| --- | --- | --- |
| Partial, failed and empty results | Preserve their semantic distinction; decide what usable accepted contributions and the retained answer represent after partial or unsuccessful work. | Buffering, batching, internal checkpoints and error-handling structure, subject to accepted atomicity and outcome contracts. |
| Associations and results | Membership meaning, qualification, standing and exact history; ordering only where it conveys meaning. | Serialization, collection types, indexes, incidental ordering and nesting limits that preserve the supported capability and disclose limits accurately. |
| Context acquisition | Selection meaning, actual coverage, qualification, exposure and the representation of unavailable or incomplete support. | Dialog tool shapes, fetching strategy, pagination mechanics and operational limits that preserve those contracts. |
| Architectural content and diagrams | Architectural meanings supported by the first capability; content must supply the meaning needed for representative diagrams. | Detailed schemas, field layout and renderer implementation consistent with those meanings. |
| Entity lookup | Stable exact identity within the Session; qualified and potentially ambiguous name lookup; no silent identity merging or displaced-description authority. | Storage layout, lookup indexes, caching and search mechanics within the supported lookup semantics. |
| Migration and verification | All existing mechanical architectural information joins the common model in agreed stages; define observable acceptance scenarios and retained guarantees. | Test harnesses, internal task breakdown and sequencing within those stages. |

An executable probe is evidence about a proposed behavior, not authority for every field, constant,
role spelling or operational restriction in its implementation. During drafting, distinguish:

- **Architectural requirements:** meaning, invariants and observable capabilities to preserve.
- **Illustrative implementation choices:** replaceable details used to exercise those requirements.
- **Deferred capabilities:** explicitly outside the first delivery, not commitments for implementers
  to fill in opportunistically.

Implementation may propose detailed schemas, APIs and bounds without reopening the design when
it preserves the agreed behavior. A choice that changes that behavior, weakens a guarantee or
exposes an unresolved architectural question requires discussion and the applicable decision
workflow. Neither the probes nor this boundary authorize product implementation.

## Decisions still to make in notes

The remaining pre-draft discussion is narrower than the previous list of fixture details:

| Question | Required resolution |
| --- | --- |
| Partial or unsuccessful investigation | What remains available, and what does the retained query result mean when work stops with usable contributions or none? Preserve existing empty/partial/failure distinctions and qualified history. |
| First delivered capability and verification | Which architectural content meanings, representative diagrams and follow-up behaviors are promised, and which examples remain design probes? Mechanical migration scope and broad staging are already agreed. |
| Remaining semantic ambiguities | Resolve ambiguity in membership, qualification, selection or lookup where different choices would change meaning or supported behavior. Do not require every role spelling, schema field, nested-result limit or delivery limit to be fixed before drafting. |

Association versus inventory/selection-scope exposure, actual reason delivery, standing and
qualified access remain requirements. Richer selectors, exact tool shapes and operational bounds
are not all architectural decisions. Detailed migration task breakdown is implementation/planning
work within the agreed stages. The proposed formal name **Analysis content** remains a naming
recommendation rather than an adopted governing edit.

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

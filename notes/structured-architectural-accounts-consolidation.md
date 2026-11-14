# Investigram structure: consolidation checkpoint

Updated: 2026-11-13

Current exploratory model, not an adopted schema or product behavior. The
[proposal](structured-architectural-accounts-proposal.md) states scope, consequences and
open decisions; [fixtures](structured-account-example/README.md) now exercise the new
direction. Prior discussion remains in the [historical notes](structured-architectural-accounts.md).
Governing documents still describe whole-investigram correction.

## Center of the model

Subject, Lens, Projection, Presentation and View remain the outer application concepts; the
investigation/contribution mechanism is the supporting engine. Query results organize
invocation-specific answer designations inside that engine. A Lens method selects its qualified
answer, which a Projection captures immutably with answer-relevant basis, qualification and standing.
No one-to-one Lens/investigation/investigram mapping is required. Later engine changes do not mutate
an exact Projection; fresh selection may yield another. Existing qualified-answer identity rules
remain: incidental engine invocation IDs do not alone distinguish equivalent answers, while
meaningful content/support/history differences can. Preserve provenance separately where it is
invocation context rather than answer meaning, without weakening immutable payload consistency.
See the [mapping agreement](structured-architectural-accounts-proposal.md#outer-answers-and-the-investigation-engine).
Drafting checks existing answer contracts and brings any concrete conflict back for discussion.
Call choosing engine information **context selection**, and supplying it to an investigator
**context delivery**. Reserve **Projection** for the outer qualified answer.

Entities organize qualified information. Queries request information. Mechanical and agentic
analyses can contribute content and association declarations through the proposed common structure; investigrams preserve those contributions
and their provenance. A query's result has its own organizing identity through which original and
later designated answers can be organized. It is not the query, and Q identifies a particular
invocation, not a recurring question. A repeated user request recognized as Q1 reuses Q1's existing
result identity; it does not create Q2 or another result designation. Exact redisplay is also
access rather than investigation. A new Q requires new investigation, not just another user action.
New retained information does not itself force a new request identity or rerun. Matching additions
can flag acquired inventory/selection scopes; displacements can flag actual exposure or result
membership, with cause-specific propagation. Such warnings do not invalidate reuse or trigger
automatic reassessment. Exact acquisition of one description is not exposure to every future
addition about the entity. Preserve captured answers and expose current status through the existing
fresh-access paths. Explicitly selected request context differs from context the engine acquires
for execution; the latter is production provenance/exposure, not an automatically changing reuse key.
Effective-input equality still matters; matching wording alone does not establish reuse. See the
[working agreement](structured-architectural-accounts-proposal.md#recognized-request-reuse).

Investigrams themselves have no inherent total order or precedence. Directed exposure, derivation
provenance and association-amendment relationships establish a partial order of contribution
ancestry; unrelated contributions remain incomparable. Exposure does not assert reliance, and
amendments do not mutate investigrams. Shared provenance or ordinary references alone do not create
ancestry. Production/acceptance chronology remains recorded for operational semantics, including
later-change checks, without conferring authority or last-writer precedence. This is explanatory:
no new partial-order graph/index or generic acyclicity validator is required. Existing relationship
records and their specific acceptance/exposure/propagation rules carry the mechanism. Application
access must preserve relevant relationship meaning, qualification and precise traceability, whether
through direct contribution access or mappings onto application-level items. Investigrams need not
be hidden, but no specific API exposure is prescribed. Implementers choose representations within
the established Projection/investigram distinction and exact-access guarantees. Do not broaden a
contribution-specific relationship to the whole answer, infer relationships from chronology, or
present exposure as reliance. Answer-relevant information accompanies the answer; further history
can be acquired separately. UI presentation remains outside this scope.

An investigram atomically captures analysis results; its member positions imply no claim order,
authority or architectural chronology. Result designations may select across investigrams without
ordering their claims. Claims retain basis/scope/time qualifications, and explicit architectural
sequences, dependencies or amendments retain their stated meanings. Incidental ordering/nesting
is packaging, not a further design mechanism.

An investigram is never globally superseded in this proposed model. Later declarations can
displace particular associations, including the designation of an earlier query's result.
Its original information, names, evidence and metadata remain attributable to it. An exact
captured answer remains fixed. Fresh access can disclose later declarations and select
other information explicitly. When a fresh result selection encounters equally standing alternative
designations, Lens code supplies both as distinct qualified alternatives; it cannot choose by
recency or invent a priority. Exact/explicit selection can request a particular alternative.
An agent offered or supplied both may make a contextual choice for its own investigation, without
silently displacing the other or establishing a global preference. Actual acquisition determines
exposure. Interface presentation remains separate; the application boundary does not permit
arbitrarily hiding an equally standing answer.

There is no single canonical definition per entity. Several descriptions, scopes and
conflicting interpretations can coexist. Identity/reuse does not establish agreement,
unique discovery, or equivalence of independently allocated entities.

Working direction: generalize investigrams to mechanically or agentically produced contributions. Either
producer can enhance or supersede the other's information, preserving each claim's method and
qualifications. Static module dependencies and interpreted runtime dependencies can coexist as
complementary scoped information; adding runtime information need not withdraw a valid static
account. Inferred runtime behavior is not automatically observed behavior. A replacement does not
inherit the displaced contribution's method guarantee. Multiple bundles can be accepted together;
mechanical incremental work and evaluation outcomes remain distinct. Document/implementation
migration effort is not a reason to retain an inferior split. The
[worked unification](structured-account-example/unification/README.md) exercises authored module
and symbol identification, export surfaces, complementary dependencies, provider re-encounter
and separately attributed mechanical findings/organizing declarations in one acceptance. Fuller
interpretation is added alongside the mechanical finding. Fresh allocation differs from resolving
a known provider identity. Native keys and common IDs are distinct; a new identity scope may
allocate a new common ID without correspondence. Equivalent recomputation reuses an established
qualified contribution even if its association is displaced, without changing standing or inventing
analyzer exposure. Cache misses and incidental provider execution do not authorize new associations.
The mechanical wrapper distinguishes computing findings from organizing their use; deliberate
reassertion requires an explicit organizing action. Changed inputs/methods/findings may warrant
new contributions. The older automatic-renewal branches and history machinery are superseded design
evidence pending fixture alignment. The mechanism preserves the finding's method, basis, evidence
and qualifications, retains standing/history and makes both available through qualified application
access. Lens-specific use and presentation belong to application contracts; no new mechanical-answer
selection or warning mechanism is prescribed. Migration still preserves existing guarantees and
raises concrete conflicts. Reachability is submission-wide, so the organizer alone can associate the mechanical item. Later withdrawal of
that organizing use can accompany a new addition referencing the unchanged mechanical item;
restoring use of earlier content similarly requires an explicit addition. Neither reverses old
displacements or clears concerns. Selection-only
basis names retained inputs; a contribution also using source captures both, preserving each
selected item's original source basis. Supersession grounds should
explain material changes in method, scope or guarantee; guarantee-ranking selectors remain deferred.
Native producer integration remains unverified, including mechanical consumers of retained claims. See the
[working direction](structured-architectural-accounts-proposal.md#mechanical-and-interpreted-contributions).

The working scope also migrates existing agentic capabilities (`summarize`, `explain`, `decompose`,
`examine`), prose outputs, prior-result follow-up and inspection/status access onto the common
mechanism. Preserve their questions and qualified information, with no permanent legacy correction/
exposure regime. Changes from whole-investigram correction and replacement-chain selection must be
explicit. Drafting names the cut-over; faithful subject/input mapping and interface packaging must
preserve the application/engine distinction. This does not settle the review's separate fresh-answer
selection question. See [agentic migration](structured-architectural-accounts-proposal.md#existing-agentic-capability-migration).

An internal producer/contribution boundary enables controlled mechanism tests before real-provider
migration, including separately attributed producers for cross-producer cases. Mechanical and agentic
are production mechanisms, not a closed type list or a requirement for identical execution protocols.
Verify an early vertical slice with initial mechanical integration, agentic state behavior,
association operations, exposure/reconsideration and the diagram contract before completing migration.
Interface details and milestone packaging remain implementation/planning choices.

The agreed implementation endpoint includes all existing mechanical architectural information,
staged through module discovery/exports, dependencies and remaining module information, organization,
and integrated agentic verification. Milestones provide review checkpoints, including the early
vertical slice. No supported mixed-mode product or fully usable intermediate milestone is required:
implementation may tolerate temporary breakage while conforming callers, or retain the old mechanism
until migration is complete. Report stage-specific completion and verification accurately; final
verification covers the full endpoint. No compatibility layer is required just to bridge unfinished
stages. This does not prescribe replacing physical storage or provider algorithms. New analyzers, persistence,
broader UI and provider-suppression policy remain deferred. See the proposal's
[scope](structured-architectural-accounts-proposal.md#agreed-implementation-scope-existing-mechanical-information-staged).

Entity storage/lookup migration separates exact identity resolution from qualified information
selection. Existing immutable storage and reference bindings may be adapted; a parallel registry
of architectural copies of mechanical entities is not the intended design. The current single
identifying-claim pointer cannot remain an authoritative current-description path outside the
association model. Exact IDs remain resolvable within the Session after identification withdrawal;
name search preserves ambiguity, standing and population qualification. Support lookup of historical/
displaced names, either by default or on request, exposing the match's standing and access to current
identifying information. Default inclusion and continuation/selection behavior are interface policies;
matching a name does not establish identity or a rename. Physical layouts and
indexes remain implementation choices. See [entity storage and lookup](structured-architectural-accounts-proposal.md#entity-storage-and-lookup).

<a id="working-vocabulary"></a>
## Working vocabulary

The citation-index to exposure-index rename is included across affected governing documents, APIs
and code alongside the semantic migration. Evidence citations and substantive support retain their
distinct meanings; this is not a blanket replacement of every use of “citation”.

| Term | Meaning |
| --- | --- |
| Entity | Identified thing in the system under study, around which qualified architectural information is organized. |
| Query result | Separately identified result of a particular invocation, organized through result designations. Not an Entity; it shares identity/reference and association machinery. |
| Subject / referent | Roles: what an investigation concerns; what a reference denotes. |
| Query invocation | One request with captured subjects, parameters and context. Its result identity is separate. |
| Investigation | Architectural inquiry, using mechanical analysis, agentic analysis, or both. |
| Analysis | Work performed within an investigation. |
| Interpretation | Explanatory judgment or inference, with explicit grounds and qualifications. |
| Production mechanism | How investigrams are produced. Mechanical and agentic are current examples; hybrid and other future mechanisms are possible. Not an epistemic guarantee or a different artifact kind. |
| Investigating agent | Agent participating in the dialog managed by an agentic analysis runner; a mechanical provider need not implement that interface. |
| Investigram | Proposed generalization: immutable, qualified analysis contribution bundle. Not the default context or supersession unit. |
| Account | Ordinary language for information provided by PostCode; no additional Account object. |
| Analysis content | Agreed name for the substantive findings and explanations within an investigram, including mechanical contributions; proposed replacement for governing “Interpretation content”. |
| Content item | Keyed item of Analysis content. Identity of content is not identity of the described entity. |
| Content type | A supported kind of content item in a defined, extensible catalogue. |
| Content-type contract / schema | Required data, semantics, qualification and reference rules / mechanically checkable shape within that contract. |
| Architectural concept | Vocabulary for framing interpretation, not a required representation or diagram. |
| Architectural relationship | Relationship in the described architecture. It may itself be identified as an entity, without making every edge one. |
| Content association | Qualified use of content for an Entity and information role, or for a Query result through a result designation. |
| Association local key | Unique within its owning investigram; together they address the exact association. Separate from its recognized purpose, and required for identification and result designations as well as topical information. |
| Identification | PostCode-understood association role supplying a readable name/designation and qualified information distinguishing an Entity. Multiple identifications may coexist; assigned labels remain distinguishable from source-declared names. |
| Association specification / declaration | Submitted specification expressing addition, supersession or withdrawal, attributable to its producing investigram. |
| Investigram relationship | Qualified comparison of investigations/accounts, such as reported inconsistency. It does not silently displace associations; whole-bundle correction is replaced by declarations in this proposal. |
| Follow-up option | Available investigation associated with exact originating metadata; atemporal availability, not implied priority. |
| Presentation recommendation | Judgment of usefulness, not permission to render compatible content. |
| Context delivery | Exact material supplied, including ownership, basis, qualification and completeness. |
| Association exposure | Exact association uses/content actually delivered, retaining route, source qualification and generating provenance. |
| Inventory/selection-scope exposure | Dependency on an acquired availability inventory or content selected by an explicit scope, with coverage and actual delivery position. A scope-selected delivery need not present a separate list; bare entries do not deliver listed content. |
| Exposure index | Indexes actual content and inventory deliveries, with entity/query-result IDs organizing access. Qualified guidance and reason delivery also retain source exposure. Product `citation` indexes remain investigram-based until adoption. |
| Support | Attributed grounds for a claim, not inferred from delivery alone. |

Agentic execution and mechanical providers retain their distinct operational boundaries while
sharing contribution and retention contracts. The probe exercises `mechanical` and
`agentic` producer kinds; the common model does not restrict future mechanisms to this pair. Mechanical tool output reused by an agent keeps its original provenance; interpretation
and guarantees remain qualifications of the contributed information. See the
[working vocabulary](structured-architectural-accounts-proposal.md#investigation-and-execution-vocabulary).

Common contribution definitions preserve real epistemological differences: some mechanical methods
can establish verified facts for supported questions within a stated basis and scope; agentic
interpretation does not independently supply that guarantee. If an agent uses verified information,
verification remains attributable to the establishing method. Method contracts and claim qualifications
express these capabilities, without defining all mechanical output as verified or encoding a closed
mechanism taxonomy in Investigram.

Qualified information is a broad description, not another record kind. “Metadata” does
not imply mechanical truth or exemption from evidence obligations. Content associations,
withdrawal reasons and result organization can be the substantive interpretation.

## Three ownership maps

### Submitted investigation contribution

```text
Invocation Q and its allocated query result RESULT-Q
  Contribution pool of investigrams
    Content items, referents, qualifications, evidence
    Association specifications
      addition / supersession / withdrawal
      Entity + information role, or Query result
      exact content/declaration members where applicable
      exact earlier associations displaced
      reason and attributable grounds
    Follow-up options and presentation recommendations
    Fixed local child links, arranged as a forest
  Local entity introductions and references to existing identities
```

Acceptance resolves local IDs, validates all declarations and references, and retains
atomically. A new successful investigation receives a query result; recognized reuse allocates
none. Architectural entities
are introduced through qualified identifying content. Existing mechanical identities
retain provider guarantees. Own-result/earlier-result targets use the same association mechanism.
The fixture encodes a Query result through a `result` role; shared storage/encoding does not make it
an Entity. No additional umbrella concept is required. An Entity concerns the system under study;
a Query result organizes answers to the invocation's particular question, rather than all accounts
about its architectural subjects. This distinction justifies retaining redesignation while keeping
the two concepts separate. Broader Entity terminology with kinds was considered but would not remove
the result-specific rules. Shared internal types remain implementation choices.

### Retained information

```text
Entity identities and introduction provenance
Query invocations and their generating/delivery history
Immutable investigrams
  Original items, declarations, qualifications, evidence, guidance, child links
Association indexes for Entity + role and for Query results
Query-result designations with explicit member references
Captured answers and exact context deliveries
Separately acquired inventory snapshots with scope, coverage and delivery position
```

An entity/role target denotes a category of information. It is not a single value slot.
Exact displaced-association references are additional to the target. The new declaration's
owner and the referenced content's owner may differ. Original qualification remains with
the original content; the new association has its own attributable grounds.

### Derived/access information

```text
Association standing: displacement links and competing declarations
Entity context selections: explicit selected information with qualifications and applicable context disclosures
Inventory acquisition: scoped availability, without implicit content delivery
Result membership: exact declarations/items, never implicit current substitutions
Reconsideration causes on evaluations and exact result designations
Validated diagram inputs and rendered diagrams/legends
```

No global investigram superseded flag is derived. A new declaration can reference old
content without copying it. A rare declaration-only investigram is meaningful when its
qualified organizing assertions are meaningful; no filler prose is required.

## Ownership and effect audit

| Responsibility | Owner / effect |
| --- | --- |
| Architectural content | Original investigram owns exact items and applicable qualification. New wording needs new content. |
| Addition | Producing investigram owns a new association. Existing associations coexist. |
| Supersession | Producing investigram owns a new association explicitly displacing earlier associations, not their owner bundles. |
| Withdrawal | Producing investigram records displacement without replacement members. Old content and other associations remain. |
| Result designation | Association targeting a query result. Can include exact items/declarations originating elsewhere. |
| Child composition | Fixed submitted-bundle structure; not result membership, current answer selection, exposure or architectural containment. |
| Follow-up option | Exact producing metadata remains owned by its investigram. Access through a result/entity does not retarget or transfer it. |
| Presentation recommendation | Original usefulness judgment; selecting a different compatible diagram changes no retained record. |
| Context delivery | Captures actual delivered content, original qualification, source provenance and applicable disclosures. A subject ID or human browsing is not exposure. |
| Inventory delivery | Captures availability scope/coverage and time separately. Matching later entries may affect selection; listed content is not supplied merely by appearing. |
| Reconsideration | Derived cause-specific warning, not proof of wrongness or automatic withdrawal. |

The fixture provisionally requires same-target supersession, historical displacement
targets and full delivery of the targeted declaration/members. These rules need review;
they are not hidden consequences of the word association.

## Baseline initial context and association vocabulary

For each subject Entity, supply all non-displaced `identification`-role associations with content,
qualification, provenance and required support/status disclosures. Do not select a preferred
identification or silently remove one because it needs reconsideration. Record the actual selection
scope and delivery position; later matching additions can trigger reconsideration. If none remain,
report the empty selection. Broader topical information and referring contributions are available
for further acquisition, not automatically delivered by this baseline. Query results and exact
contextual selections are distinct inputs, not Entities by analogy.

Every association has a local key, independently of its purpose; `(investigram, key)` is the exact
address. Several differently keyed identifications may concern the same Entity. Their content and
qualifications explain any differences; keys alone do not establish equivalence or priority. Other
topical information can use meaningful agent-chosen local keys without a separate topic identity
system. Identification requires a readable name/designation with sufficient qualified identifying
information, not a complete definition or necessarily prose. Fixtures still use the earlier
`identifies`/`describes` vocabulary as bounded examples; further recognized roles need defined
semantics rather than inference from key spelling.

## Discovery through referents

First-delivery scope includes finding retained contributions through their explicit referents,
independently of which Entity their identifying/descriptive associations concern. An investigation
of Half-open can discover an admission contribution referring to Half-open even when that
contribution's descriptive association concerns Circuit Breaker. A known address or navigation
origin is not required. This preserves an existing purpose of referents, not a new semantic-search
capability. Finding a reference does not automatically deliver the contribution's content; subsequent
qualified acquisition and actual exposure remain distinct. Indexes and tool shapes are implementation
choices. Include this path in validation; the current association-backed fixture does not yet
exercise it, which is a coverage gap rather than deferred scope.

## Exposure and result membership

Each investigram captures its own actual production/exposure history at creation. Contributions
from one production can share that history; atomic acceptance or a shared outer invocation does
not merge independently produced contributions' inputs. The unification fixture now records the
mechanical producer's source-only input separately from the organizing agent's retained input and
actual receipt of the mechanical item. Propagation and fresh disclosure follow the delivered
contribution's owner, not an invocation-wide union. Invocation totals are report summaries only.
A mechanical input concern still propagates forward to an agent that received its finding; agent-
only input does not propagate backward into the mechanical finding. No per-output-item reliance
inference is introduced; contributions from a shared production retain its conservative exposure.

Supplying entity S means supplying a qualified context selection, not its ID or a
canonical definition. Selecting a portion of Q's result and delivering it records its exact
association/designation route under RESULT-Q, not every association of that entity. Receiving
an inventory is separate, with its own scope and timing. The selected text/node need not
become another entity.

A result can need reconsideration because its producer received subsequently displaced
information. It can also need reconsideration because a constituent association was later
displaced—even when its producer created that entity and never received it as context.
The second route is designated membership, not fabricated exposure or the fixed child tree.
A third route is availability/selection scope: a later matching entry could have changed an
acquired inventory or the content selected by an explicit scope. A description acquired by
exact reference or fixed result membership does not establish that scope dependency.

The executable prototype tracks exact delivered association uses. Entity identity alone
cannot expose an evaluation to information created later. Item excerpts record their route;
sharing an item through another association is not a displacement warning. Generating-context
provenance remains conservative across a producer's contributions, without making the entire
entity's future information part of an old delivery.

Status is keyed by designation: `displacedBy`, `membershipCauses`, and
`generatingEvaluationCauses` remain distinct. `needsReconsideration` combines the latter two,
not the mere fact that the designation has a successor. A new designation is not flagged by
its own creation; unrelated later concerns still apply. Fresh status never rewrites the
captured original answer.

Redesignating an earlier result requires its declared question/scope, subjects, parameters
and operation/option in context, captured in `queryMeanings`. It is optional. Other containing
designations receive fresh notices/status rather than automatic redesignation. No investigation
must maintain every result that references an affected association.

Supersession for fuller coverage and withdrawal can trigger review without asserting falsehood.
Known causes accepted before an actual delivery are disclosed context, not later-change
warnings. This covers direct exposure, designation concerns and inherited producer concerns.
A fresh context delivery must disclose all those applicable causes; missing/altered disclosure is
rejected. Notice receipt is awareness, not adequate replacement evidence or endorsement.
New designation membership retains already-displaced standing without treating it as a new
change. A prior acquisition can still affect its producer, even if the query finishes later.
Later refresh does not clear that earlier warning. Historical statuses remain intact.

The fixture records host-assigned acceptance positions and delivery-state positions; these
are ordering aids, not proposed public timestamps or agent-supplied exemption claims. General inventory
coverage, clearance and reassessment remain open. Producers still exclude their own causes. Identifying content newly established from the
pinned basis need not copy irrelevant source behavioral restrictions; original reused content
retains its qualifications, while new scenario examples carry their own applicable limits.

Renewed assertions need no reinstatement operation: after B supersedes A, C may supersede B
using A's original content, retaining its provenance and qualifications and supplying C's own
grounds. A stays displaced. After withdrawal, C may add a new association to the earlier content.
D may later disagree with C through another supersession or withdrawal. The complete-support
acquisition instruction and structural rules apply; historical causes and result designations
are not cleared or restored.
General declaration revocation/reinstatement is deferred. See the
[working agreement](structured-architectural-accounts-proposal.md#renewed-association).

Competing undisplaced associations remain available and are both included when acquiring current
descriptions in scope, with qualified grounds and support. Recency does not pick a winner. Exact
requests remain narrower and fixed result memberships do not expand automatically. With sequential
investigations, C acquiring A after B superseded it receives disclosure of B and can acquire the
support the investigator is instructed to acquire before superseding B explicitly. Deliberately leaving B standing remains valid; parallel
execution is not required to explain the competing fixture. See the
[working agreement](structured-architectural-accounts-proposal.md#competing-associations).

Before superseding or withdrawing an association, the investigator is instructed to acquire its
complete designated content, qualifications and required support. For the first capability,
mechanical target-support completeness enforcement is deferred: PostCode validates structural
rules and accurate qualified deliveries, not whether the investigator understood enough to justify
a change. Deliberately incomplete acquisitions in the probe are structurally accepted without
fabricating exposure or certifying instruction compliance. The same boundary now applies to reuse
and earlier-query redesignation: valid references preserve original provenance and qualifications,
while adequate understanding is an investigator responsibility, not a prior-delivery gate.
When query meaning is delivered its captured record must still be accurate. See the
[working agreement](structured-architectural-accounts-proposal.md#validation-and-investigator-policy).

More generally, mechanically enforce data integrity and operational contracts; put reasoning
policies in investigator instructions and defer their mechanical enforcement pending need.
No special reuse instruction is needed beyond understanding and qualifying the information used.
Future policy checks could operate within the dialog, inviting acquisition, clarification or
revision rather than only rejecting a finished submission. Final structural validity remains
mandatory, and acknowledgement alone does not establish compliance. This is a design possibility,
not a new checker or dialog implementation.

<a id="catalogue-responsibilities"></a>
## Catalogue responsibilities and diagrams

| Catalogue responsibility | Purpose |
| --- | --- |
| Architectural concept guidance | Meanings, investigative distinctions, examples and references. |
| Content-type contract | Required data, semantics, qualification, references and partial/unknown cases. |
| Diagram-type input contract/mapping | Compatible inputs and their known mapping to a diagram and legend. |

One concept can have several representations; one item can express several concepts.
Entity references share identity; exact qualified item references share assertions.
The supported catalogue is extensible, but an investigator cannot invent an understood
content type just by naming it. Prose is a supported structure, not an unqualified escape.

TRIAL-1's state diagram binds `recovery`; the sequence binds `concurrent-callers` and
follows its existing `stateContent`/`transition` references. No duplicate state-model
binding or renderer-invented dependency. Both diagrams render unchanged with recommendations
removed. Legends preserve conditions, qualifications and source mappings. Presentation
retrieval, arrangement and UI remain outside this remit.

## What the current examples show

Q1 introduces state categories and an incomplete admission account. Its result designation
includes the entity associations. Q2 receives RESULT-Q1's selected qualified information;
it adds trial content, supersedes the admission association and redesignates RESULT-Q1
while referencing unchanged descriptions. ADMISSION-1 remains unchanged. No K-style
whole-investigram correction or special replacement tree is returned.

The later expansion probe supersedes identifying information without alleging factual
error. Q1 had never received S, but RESULT-Q1 included S's identifying declaration and
therefore receives a membership cause. A consumer of RESULT-Q1 inherits it. Other probes
reuse an earlier item in a declaration-only result and withdraw that new association
without changing the original item or its other association standings. Competing
supersessions remain available.

The mixed and children partitions preserve the same behavioral models. Children can
still give descriptions appropriate qualification boundaries, but they are no longer
necessary to obtain independent association supersession or item delivery. Entity/result
exposure changes the earlier argument about smaller citation units; do not present that
argument as unchanged. Evaluation-wide provenance can still cause conservative warnings.

Composition receives selected P/S/R/B context and returns pattern entities plus
RESULT-Q4. Exact local selectors remain valid; their context entity is RESULT-Q4. The
same architectural diagrams and assertions remain authored content.

## Open decisions and verification limits

The [revised addition probe](structured-account-example/additions.md) distinguishes exact
association content from availability/selection scope. A description supplied by reference does
not imply a scope guarantee. Initial descriptions selected by scope do carry that dependency,
even without a separate list request; `selectionScope` records the guarantee with actual delivery
time. Explicit inventory acquisition also records entity, scope and position.
The fixture lists all retained association addresses/roles in scope, including displaced ones,
without delivering their content or interpretive reasons. New matching entries affect prior
inventory recipients; exact supersession/withdrawal still affects actual association uses.

Fixed designation membership is not inventory exposure. Merely adding another description of
S does not mark a result containing an earlier description; its producer can still be affected
through an actually acquired inventory. The original by-reference seven-evaluation/eight-designation control acquires no causes from
either addition. Adding an inventory reader and consumer gives two affected evaluations/results.
This does not estimate realistic warning frequency: a [Q2 discovery branch](structured-account-example/acquisition.md)
that lists associations before retrieving content reaches 3/7 evaluations and 4/8 designations.
The earlier broad 5/7 and 7/8 comparison remains reproducible. Both partitions agree.

A qualified declaration reason supplied as context creates exact exposure to that declaration;
later displacement can affect its recipient directly. Referenced members are not delivered
by the reason; it does not fulfill the displacement acquisition instruction or establish prior member exposure. Fresh disclosures follow later
displacement of the supplied declaration too, without implying reinstatement of its predecessor.

Removing implicit entity-wide exposure and unsolicited addition reasons is a structural
refinement, not targeted suppression or semantic clearance. It leaves a coverage limit:
unrequested new information may matter even when no inventory dependency was established.
The human accepts that coverage limitation. General initial selection and richer inventory
policies still need bounded treatment. The contract is at the investigation boundary; dialog
tools and storage sharing are implementation choices. The broad earlier counts no longer
establish a first-delivery need for reassessment.

Reuse without acquisition can lack an exposure path from a later displacement of the source
association. Preserve that limit without treating shared content as a global dependency. Result
membership helps only when it includes the displaced association; direct item membership is not
equivalent. References without recorded delivery can be audited from existing data. A dedicated
retained flag and dependency rule remain deferred.

Fresh cause inspection exposes the cause declaration's current standing: C's displacement of B
can accompany historical cause B without clearing it, marking a new exposure cause on the original
recipient, or reinstating A. The renewal probe uses existing standing and disclosure, preserves
captured inputs/answers and adds no retained status field. See the
[probe](structured-account-example/acquisition.md#current-standing-of-a-cause).

Investigator-directed propagation is deferred alongside targeted suppression, reassessment/
clearance and automatic scheduling. It could identify a qualified concern for an exact earlier
result that structural propagation missed. An exposure-index lookup might find candidates;
acquiring their questions, results and support would permit assessment. A candidate listing
is not an impact judgment, and a concern neither displaces earlier content nor fabricates
past exposure. No reverse-lookup API or concern declaration is implemented. See the
[proposal](structured-architectural-accounts-proposal.md#deferred-investigator-directed-propagation-reassessment-and-scheduling).

The outcome discussion distinguishes no accepted contribution, host-detected unmet contract,
producer-reported inability/incompleteness, and an undetected substantive error despite acceptance
and reported success. Failures have execution outcomes, not fabricated architectural findings;
structural validity, request fulfillment and correctness are distinct. Later discovery uses the
existing association/reconsideration mechanisms, without guaranteeing error detection. Human
objections and investigation driven by user pushback remain explicitly deferred; the current
research/developer feedback is not that mechanism. See [outcomes and inadequacy](structured-architectural-accounts-proposal.md#execution-outcomes-known-inadequacy-and-undetected-error).

Accepted investigrams are retained and all their content processed normally, including ordinary
association effects, even when the investigation did not fulfill the whole request. Known inadequacy
and unmet requirements are reported separately; they do not invalidate what was achieved. Ordinary
data-integrity acceptance remains required. This settles the retention question; outcome fields,
result packaging and repair sequence are implementation choices within those distinctions.

The plan delivers the common mechanism and one architectural concept: **state-dependent behavior**,
with sufficient retained content for a state diagram. Entity and relationship identification and
description are common mechanism functions, not a separately required generic explanatory capability.
The Cockatiel thread remains a candidate validation scenario; interaction and composition remain
design probes rather than required implemented concepts. A second concept needs a specific mechanism
coverage justification, not a desire to test broader interpretive ability.

Include one real supported state-diagram catalogue entry, an input contract and a minimal renderer;
planning specifies the notation and bounded semantic coverage. Catalogue injection is an optional
test implementation technique, not a substitute for this content-to-diagram demonstration. No
polished presentation system is required. SLICE remains free to select, refine, supplement or
replace the diagram for the initial offering.

Require a few live-agent runs to check the real integration, plus controlled dialogs for mechanism
coverage, including optional actions such as follow-up options, presentation recommendations,
reported inability, association operations and cross-investigation content reuse. Do not rely on
spontaneous agent choices for repeatable coverage. Include an explicit state-diagram result contract:
successful fulfillment, otherwise valid content that leaves the requirement unmet, and producer-
reported inability. This differs from optionally recommending a diagram. Accepted contributions
retain their normal processing and effects despite unmet requirements; prose alone does not fulfill
the diagram contract. No additional architectural concept is needed. Harnesses, mocking arrangements and exact test
scenarios are implementation details. “Plausibly useful” is a sanity check on the representative
architectural application, not a separate acceptance criterion: keep a recognizable investigative
purpose, while allowing controlled responses constructed to exercise particular cases. These
checks establish mechanism behavior, not the usefulness of an investigation experience. Proof of
user value is not required. The separate [SLICE step](upcoming-work.md#slice) selects the
initial user-facing offering using the demonstrated capabilities and limitations.

Before drafting, resolve any remaining concrete ambiguity in information meaning or qualification;
mapping the agreed validation scope to observable checks is planning work. Detailed schemas, API/tool shapes, operational bounds, incidental
ordering and implementation task breakdown need not be fixed here. The test is whether a different
choice changes retained meaning, investigator guarantees, consumer-visible information or the
promised capability. Existing atomicity, truthful coverage and qualified-delivery requirements still
apply. See the [design/implementation boundary](structured-architectural-accounts-proposal.md#design-requirements-implementation-choices-and-deferred-capabilities).

Executable fixtures expose contradictions; their incidental details do not automatically become
requirements. Drafting should label architectural requirements, illustrative implementation choices
and deliberately deferred capabilities separately. Implementation choices preserving the agreed
behavior remain open to implementers; consequential changes follow the decision workflow.

Declared dependencies and investigator-directed propagation are deferred:
observe coverage gaps before choosing anticipatory dependency declarations, qualified impact
assessment when new findings emerge, or both. Either would supplement actual exposure tracking.
ADMISSION-1 already claims runtime admission coverage, which is not the same as completeness
of a retained-information selection. An added waiting case may challenge that claim without an
automatic cause when no relevant scope exposure or displacement exists. Preserve this accepted
limit and deferred test; introduce no standing coverage subscription. Carry these deferrals explicitly.
Existing entity introductions, qualified correspondence and association declarations suffice for
merge/split findings in this capability. Preserve old identities and histories; defer automatic
aliasing, reassignment, entity-level supersession and identity-specific propagation. Presentation
of the resulting histories is later UI work. See the
[working agreement](structured-architectural-accounts-proposal.md#identity-findings-with-existing-mechanisms).

The [checkers](structured-account-example/README.md#verification) validate authored references,
qualification delivery, atomicity, exact history, declaration lifecycle, conservative
reconsideration and diagram/selector inputs. Their source judgments are not mechanically
proved. No live investigator, supported product API, general cross-investigram renderer,
performance bound, persistence or migration is demonstrated. The plan must explicitly
revise the governing correction/exposure model before implementation.

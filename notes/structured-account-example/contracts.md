# Illustrative contribution and content contracts

Updated 2026-11-12. Exploratory contracts and executable authored probes, not adopted
schemas or product APIs. The [proposal](../structured-architectural-accounts-proposal.md)
and [consolidation](../structured-architectural-accounts-consolidation.md) explain the
change from whole-investigram correction to association declarations and entity context.
The [payload tour](metadata-payload.md) follows the exact serialized examples.

An architectural concept frames interpretation. A content type identifies a supported
kind of item; its contract defines data, semantics, references and qualifications.
A schema captures mechanically checkable shape, not truth or sufficient evidence.
`/0` marks illustrative versions. The catalogue is defined and extensible; naming an
invented type does not make it understood. Topics and concepts may extend beyond the
recognized catalogue using supported types.

## Shared envelope and addressing

Each submission names a query invocation, its newly allocated query-result entity,
a pool of investigrams and `compositionRoots`. An investigram supplies its content,
referents, `associationSpecifications`, qualifications, evidence, fixed `children`,
`followupOptions` and `presentations`. Empty content is possible for a meaningful,
qualified declaration-only contribution. Metadata can carry substantive interpretation.

Each content item has a local `key`, `concept`, `contentType` and type-specific data.
Declaration, content, option and presentation keys have separate namespaces. Nested
state, role, relation and step keys are local to their item. Matching names/keys do
not establish correspondence. Submission-local investigram and entity references use
separate namespaces and resolve atomically:

| Reference | Meaning |
| --- | --- |
| `{entity: ID}` | Existing architectural or query-result identity. |
| `{introducedEntity: key}` | New identity allocated by PostCode on acceptance. |
| `{investigram: ID}` | Exact retained contribution bundle. |
| `{submittedInvestigram: key}` | Exact bundle in this submission. |
| `{investigram: reference, contentKey: key}` | Content item; source ownership does not change when reused. |
| `{investigram: reference, associationKey: key}` | Exact association declaration, not an entity/role category. |
| `{investigram: ID, optionKey: key}` | Exact originating follow-up option. |

Readable P/S/R and RESULT-Q1 aliases stand for opaque IDs, not a naming convention.
The `OWNER::key` notation in checker reports is display notation for an exact address.
Forward local references are allowed when all resolve. No partial allocation, orphan
bundle or unresolved accepted reference is intended.

Exactly one `entity-description/0` with `introducesEntity: true` declares each new
architectural entity and supplies qualified identifying content. An `identifies`
association must include that description. References/referents do not themselves
introduce entities. Query-result identity is allocated for the invocation separately;
it does not need an agent-invented architectural description. The probe requires one
initial result designation per invocation, not one canonical answer for all time.

Names, descriptions and classifications are associated information, not mutable
unqualified fields of the identity. Reuse asserts reference to the identified thing,
not agreement with its descriptions. Every explicit introduction receives an ID;
there is no promotion threshold. Local selection can remain an addressed occurrence.
A later investigation may introduce an entity from it, but a structured origin field
and that live follow-up are still open work.

Mechanical identities retain their provider guarantees under a proposed common reference
mechanism. The seeds illustrate compatibility, not mechanical-producer migration.
Relationships W and patterns C-BB/C-BH are proposed explicitly identified entities;
this and query-result entities require governing treatment beyond interpreted identity.
Not every architectural edge, organizing relationship or local role becomes an entity.

## Association specifications

Each specification has a local key, operation and `target: {entity, role}`. The role
is `result` if and only if the entity is a query-result entity. This probe also supports
`identifies` and `describes`. The broader role vocabulary remains to be designed.
Entity/role denotes a category of information, not a unique value slot.

| Operation | Required contribution | Effect |
| --- | --- | --- |
| `addition` | Nonempty `members`; no `displaces` | Adds an association; other associations coexist. |
| `supersession` | Nonempty `members`, exact earlier `displaces`, qualified `reason` | Adds an association and explicitly displaces those earlier associations. |
| `withdrawal` | Exact earlier `displaces`, qualified `reason`; no replacement members | Displaces those associations without replacing their information. |

Members are a typed union:

```json
{"item": {"investigram": {"submittedInvestigram": "trial"}, "contentKey": "recovery"}}
```

```json
{"declaration": {"investigram": {"investigram": "DEFINITIONS-1"}, "associationKey": "half-open-description"}}
```

The first designates content. The second is permitted for a result designation so
an answer can include exact association assertions, including withdrawal. Recursive
membership is acyclic. Required content dependencies, such as an interaction's state
model, accompany the designated content; informative links do not silently expand it.
Result membership is distinct from child composition and actual context exposure.

A declaration belongs to its producing investigram. Its members may belong to another;
reuse neither copies nor reparents content. Each source retains its qualification,
basis and provenance. The new declaration has its own attributable grounds. Reasons
are inline in this slice; no redundant mandatory `support` list repeats the displaced
address. Additional grounds can be supplied as new qualified content without a special
operation for editing an earlier reason.

**Provisional acceptance rules exercised here:** displaced declarations must predate
the submission, share the new declaration's target and be additions/supersessions,
not withdrawals. Changing the target uses withdrawal plus addition. The exact target
declaration and its complete designated membership/dependencies must have been delivered
with source qualification and provenance. A reason alone, an ID, or an option excerpt
is insufficient. Reusing foreign content/declarations also requires their actual qualified
delivery. These are reviewable choices, not assumed consequences of the new direction.
Challenge/reinstatement of withdrawal and a complete standing algebra remain open.

Every newly submitted content item is covered by at least one association in this
prototype. Coverage does not prove semantic adequacy, nor require every association
to be included in the query's result. Result-only content is allowed. Competing
supersessions can both be retained; timestamps do not choose truth. The checker reports
displacement links and competition, not a universal active-winner algorithm.

A fuller description can supersede an earlier association without alleging factual
error. Different context alone is not grounds to withdraw a still-valid scoped use.
Other associations to the same item remain intact. There is no whole-investigram
superseded flag and no implicit item correspondence based on a repeated key.

## Query results and exact history

Q identifies a particular invocation; RESULT-Q identifies its result. Q1's original
result association designates original qualified items/declarations. Q2 can target
RESULT-Q1 and supersede that association with an updated designation while separately
creating RESULT-Q2. Unchanged definitions can be referenced directly. This does not
rewrite Q1's original returned answer, what Q1 produced, or an earlier delivery snapshot.

The example makes two explicit declarations: ADMISSION-2 supersedes the admission
association on P, and Q2's root supersedes Q1's result association. Neither implies
the other. Original investigrams, child links, metadata, items and introductions persist.
The updated answer is available through a later designation; it is not substituted
inside old exact result membership. Redesignation is optional. Other containing designations
keep their membership and receive fresh notices/status; the investigator need not find them
all. Before targeting an earlier query result, supply its exact declared meaning/scope,
operation, subjects, parameters and option (if any). `queryMeanings` in the projection
preserves this context with invocation identity and basis; the checker rejects missing
or altered question context even when the full old answer was delivered.

## Ownership and qualification

`compositionRoots` and ordered `children` form a forest of newly submitted bundles.
Every bundle has exactly one owning position, with no cycles, shared subtrees, old
adopted children or disconnected bundles. A content reference does not establish
ownership. There are no special replacement trees. This retained packaging is distinct
from the result's association membership and need not define its later organization.

Every bundle carries its own qualifications and evidence. Nothing inherits from a
parent by omission. Roots can orient and delimit the contributions without restating
behavioral children. Repetition adds another substantive claim that may later need its
own declaration. A declaration-only contribution need not invent summary prose.

When partitioning qualifications:

1. Identify each bundle's claims and the scenario context needed to distinguish referents;
   retain applicable source-basis and method limitations.
2. Retain every condition needed for those claims. Put narrower restrictions on the
   relevant item, or separate the content when the condition does not apply throughout.
3. Do not copy unrelated exclusions or remove necessary ones as an editorial shortcut
   to broader applicability. Verify broader identification, narrow the claim, or state
   what remains unestablished.

DEFINITIONS-1 identifies categories without default-sampling/reentrancy restrictions;
it does not assert general admission rules. ROLE-DEFINITIONS-1 retains context needed
to distinguish scenario roles. The mixed source descriptions retain their original
broader bundle qualification even when associated separately later. The new mechanism
does not retroactively broaden them.

Minimal identification need not supply full behavioral explanation. W identifies its
participants and what is awaited; `relatedContent` locates the separately qualified
occurrence/release explanation. That link neither delivers the content nor asserts
that minimal identification is unintelligible without it.

<a id="provisional-partition-default"></a>
## Provisional partition default

Prefer coherent qualification boundaries. Identifying children remain useful when
an investigation mixes general identities and narrower behavior, as in this example.
Independent association supersession and item delivery now work in both partitions;
children are no longer necessary merely to get those affordances. The previous claim
that each child supplies a smaller citation/correction unit must not be carried over
unchanged to entity exposure.

Actual generating-context provenance can still conservatively affect later consumers
of a small definition. Separate evaluations can bound that context at an orchestration
cost; evidence must not be withheld to avoid warnings. Per-output exposure and qualified
reassessment remain alternatives to decide, not exemptions supplied by partitioning.

## Entity context, delivery and reconsideration

Supplying an entity means supplying a selected qualified projection of its information.
A selection names exact associations, item excerpts or options reachable through that
entity's information. It is not just an ID, all history, or a canonical definition.
Each delivered item/declaration/option preserves its own value, source investigram,
generating query, captured basis, source qualifications and evidence. A declaration's
members from another owner retain that owner's support too.

The entity/result exposure index is an organizing summary, not a change subscription to
every association with that identity. `associationUses` records exact uses actually supplied,
with source qualification and generating provenance. Full association delivery records its
expanded declarations; an item excerpt requires `viaAssociation` and records only paths to
that item. These partial use records do not claim full declaration/member delivery and cannot
establish displacement eligibility. The captured route cannot expand to later associations.

Selecting a portion of Q's result retains its exact designation route as well as RESULT-Q.
Human browsing, bare IDs and undelivered siblings do not create delivered association entries.
Options alone carry their source provenance; discovering an option through a result does not
assert receipt of every behavioral association. Required state-model dependencies, informative
links and actual content acquisition remain distinct. Arbitrary excerpt dependency closure
is not fully generalized by the bounded renderer.

Fresh projections disclose qualified displacement notices for exact supplied uses, not every
other use of a shared item. Notice references do not deliver the old/new members. Original
answer/delivery snapshots stay fixed. General warnings are inspected separately through
`reconsideration()`, whose statuses name exact designation addresses rather than only RESULT-Q.

The designation status has separate `displacedBy`, `membershipCauses` and
`generatingEvaluationCauses`; only the latter two contribute to `needsReconsideration`.
Displacing a designation records history, not a self-warning. An association displaced within
its membership can warrant review. A new designation does not inherit the old one's causes
by entity identity, but can independently be affected through its own members or producer.
Consumers of an actually delivered old designation may need reconsideration when it changes.

Q1's identifying membership can be affected without Q1 having received its newly introduced S.
No incoming exposure is fabricated. A cause can then reach an actual consumer of that exact
designation. Delivered contributions from an exposure-affected producing evaluation also
retain that concern. This remains conservative at evaluation/designation granularity; it
is not proof that every received excerpt relied on the affected claim.

The simulator uses supersession/withdrawal as causes and exempts the producer from its own
causes. It uses exact displaced associations, not entity equality or shared-item overlap.

### Actual-delivery timing and known causes

`acceptedAt` orders accepted contributions; `asOfAcceptance` records the retained-state
position at which a projection was captured for delivery. These are host-owned fixture
provenance, not an agent's declaration that it already knew a cause. Acceptance checks
recorded projections against their captured positions, not against the latest state.
Default fixture requests acquire immediately before submission; separate probes retain
an earlier delivery across an intervening change and acquire further context afterward.

A cause accepted before a delivery is already part of its context. Fresh delivery must
include qualified notices for direct displacement, affected designation membership and
inherited generating-context concerns, including concerns attached to substantive notice
sources. The checker rejects omitted/altered required notices. An old captured delivery
that predates a cause is valid without that notice; it remains an exposure to later change.
A future position or references unavailable at the recorded position are invalid.

All propagation paths compare the cause to each actual delivery. Known causes cannot re-enter
as new warnings via a source query or result designation. New designation membership compares
against designation acceptance: already-displaced members retain their standing but do not
create new membership causes. Its producing evaluation may still carry a cause from an earlier
acquisition. If a query receives both an old and a refreshed projection, the refresh does not
clear the old exposure. Query-start time and final acceptance are not delivery-time proxies.

Notices preserve reasons, qualification and exact standing; they do not deliver all referenced
replacement members or establish sufficient understanding. Those acquisition obligations remain.
No historical warning is cleared. Additions, identity events, declaration challenge, clearance
and reassessment remain open; no general whole-investigram completeness exemption is imported.

<a id="retained-investigation-offer"></a>
## Retained follow-up option metadata

[Follow-up options](followup-options.md) belong to the exact producing investigram,
not a transferable guidance child. Each has a key, label, purpose, architectural targets,
supported method, declared parameters, qualifications and evidence. No content type is
needed for this metadata. The source address and request subject are separate: Q2
selects RESULT-Q1 and names ADMISSION-1's exact option. Knowing that address does not
establish human navigation origin or delivery of the owner's other information.

An ordinary option requests qualified interpretation using valid supported content.
It need not predict the answer's diagram types. A specialized promise such as generating
a state diagram requires sufficient qualified content and successful compatible
presentation, or an explicit unmet/partial outcome. Keyed prose cannot silently fulfill
a specialized diagram promise. The general option is exercised; specialization remains
illustrative, not an implemented schema field or Lens catalogue.

Options retain their original scope and provenance. Superseding a behavioral association
does not transfer its source option or assert that the option is wrong. Fresh access
must preserve relevant context; suitability after association changes remains a selection
judgment. ADMISSION-2 has no repeated option because its submission already answers it.
This is an authoring choice, not a ban on reinvestigation. Historical exact access remains.
An option excerpt is substantive investigator context but does not establish full delivery
of the declaration/members one might later supersede.

## Presentation recommendation metadata and delivery

`presentations` entries have key, diagramType, named inputs, qualifications and evidence;
address them by exact investigram/presentationKey. Recommendations express usefulness,
not permission. A diagram can render compatible content directly with no recommendation.
Missing a recommendation for a newly available renderer is not an error. No independent
mutable recommendation lifecycle is introduced.

[Diagram contracts](diagram-contracts.json) define primary inputs: a state diagram takes
a state-behavior model; a sequence diagram takes an interaction. Follow the interaction's
`stateContent`/`transition` references for its state-model dependency. Do not repeat a
`stateModel` binding in recommendation metadata, infer alignment, or require a recommendation
for these dependencies to exist. The probe tests both diagrams with recommendations absent.
Only same-investigram state dependencies are exercised; general cross-owner retrieval
remains design work.

Metadata carries source qualification/basis/provenance like other delivered interpretation.
A recommendation does not deliver its referenced model or unrelated source content.
Presentation access is a limited probe; full UI arrangement, navigation, delivery selection
and export behavior remain outside this work.

## Types in this example

| Type | Information to supply | What it does not imply |
| --- | --- | --- |
| `entity-description/0` | Entity reference, name, identifying description, classification, relevant context (`relativeTo`), evidence; explicit introduction flag when introducing a new entity | Unique discovery, canonical definition, or automatic standing of its associated information |
| `prose/0` | Keyed explanatory text under the appropriate concept, with support and qualifications | Missing graph or interaction structure can be invented from the text |
| `admission-cases/0` | Explicit coverage claim; optional item-local roles and their scope; keyed cases with state, condition, outcome, optional resulting state/relationship, and evidence; separately qualified scenario illustrations | A complete state machine, universal interface model, or general claim bound to an illustrative subject |
| `architectural-relations/0` | Keyed, typed relations with role-named endpoints and applicable conditions; optional entity for a relation | Association displacement, global graph consistency, or mandatory relation identities |
| `state-behavior/0` | State bearer; coverage and omissions; keyed labelled states; keyed directed transitions with trigger, guard, effect and evidence; outcome qualifications | Initial state, completeness, hierarchy or concurrency when not supplied |
| `interaction/0` | Scenario meaning/conditions; keyed participants tied to subjects; ordered prefix; alternatives with conditions and keyed steps; omissions and evidence | Observed trace, all possible interleavings, or application-level success |

The `interaction/0` step vocabulary in this probe is `request`, `response`, `action`,
`wait`, `resume`, and `state-transition`. Requests/responses supply endpoints and text;
actions supply an actor and text; wait/resume supply participant, decision holder,
architectural relationship and text. A state-transition step names a state-content
item and one of its transitions. That link reuses an explicit claim; it does not
authorize an interpreter to derive arbitrary cross-investigram correspondences.

An optional `causedBy` lists earlier step keys on the same possible path. It asserts
causal support, not just diagram ordering. Cross-branch or forward references are
invalid here. A cause need not be sufficient or exclusive: branch conditions, guards
and investigram qualifications still apply. Missing links are not inferred from ordering
or transition-effect prose. Completion, outcome availability and classification use existing action
and response types; each outcome transition explicitly names classification as its
cause. Structural validation checks that these links resolve in order, not that the
asserted causality is true. The trial participant denotes the execution including its
work, so the outcome response is distinct from final delivery to its initiating caller.
The wait step names the caller request and trial entry, with an explicit condition
that the reserved slot remains occupied on arrival. Each resume/recheck step names
the transition that releases it; ordinary work or refusal names that recheck. This explicitly connects release of W to subsequent
admission without claiming that release guarantees work will run.

<a id="shared-roles-and-illustrations"></a>
### Shared roles and illustrations

`roles`, `roleScope` and `illustrations` are optional fields of the common structured
content-item envelope, usable by admission, state, interaction and structural types.
They are not separate mechanisms per type and are not investigram-global variables.
`{localRole: key}` resolves within the owning item's `roles` only. Keys are unique
there, all references resolve, and `roleScope` states how the variables are bound.
Identical role names in different items do not assert correspondence. The role's full
context is its exact investigram, content key and local role key; allocating it does not
introduce an entity or a general architectural fact.

The admission item binds execution/instance variables separately per request, then
illustrates them with the named scenario. The scenario state item instead refers
directly to R. It needs no variable plus binding merely to rename that same participant.
The common mechanism remains available to other types when variables add meaning;
the fixture no longer forces a second use just to exercise the syntax. A broadly
applicable state model would require qualified analysis before its instances could
serve as illustrations.

An `illustrations` entry identifies a target investigram/content item, binds owner-local
roles to scenario subjects, and supplies qualification and evidence for that mapping.
An illustration is a general-to-example relationship here, not an alternate encoding
of identity between two names for the same scenario participant. Use a direct subject
reference for the latter; no separate identity-binding mechanism is introduced.
In this probe every declared role is bound once in each illustration. A content-type-specific
selector may narrow what is illustrated: `case` selects an admission-case key; without
one, the illustration concerns the owning item. Mapping does not establish global
identity or change the general claim's scope. Its substantive subject references need
identifying support when supplied. Bindings remain qualified authored claims, never
correspondences invented by a renderer.

## Architectural guidance and diagrams

**State behavior.** Distinguish the thing whose state changes from the state categories
and from participating executions. State what causes a transition, what must hold,
and what it does. Declare partial coverage. A partial statechart may omit an initial
marker; it must not manufacture one. The present type is a flat subset: richer
statecharts would require explicit containment, entry/exit and concurrency semantics.
In this sample the bearer is a direct reference to scenario subject R. The explicit
applicability field connects the investigram to P without broadening it to all instances/configurations of P.
The shared role mechanism also permits a type-level model, but establishing that
broader applicability remains an open extension, not a mechanical reinterpretation.
The recovery-outcome guard means the completing trial still belongs to the current Half-open state; stale results do not
perform these transitions.

**Interaction.** Identify participants and their roles before giving ordering. Explain
whether a sequence is observed, possible or required. Make branch conditions and
omitted interleavings explicit. A shared component's state and an execution's progress
are different dimensions; waiting need not be a new component state.

The established reference is the SEI's
[Documenting Software Architectures: Documenting Behavior](https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf),
statecharts §6.1.1 and sequence diagrams §6.2.3. The agent may consult it for deeper
guidance; it is not evidence about Cockatiel. The local contract must still be
sufficient to submit supported content without mandatory external reading.

`architectural-identification`, `interface`, and `structure` are working catalogue
labels here, not claims that the references standardize these exact payloads.
Keyed prose is a valid type under any relevant concept. The catalogue need not force
each concept into one diagram, nor require a diagram for every explanation.

<a id="concise-overviews-and-legends"></a>
## Concise overviews and keyed legends

The [readability examples](diagrams.md) add two optional authored fields to the
provisional contract: `displayLabel` is a short, meaningful label on a content item
or a named element (participant, transition, step, branch or situation), and
`overviewScope` is a concise statement of an item's scope for an overview. These are
qualified architectural wording, not an invitation for a renderer to invent summaries.
Existing detailed descriptions, guards, effects, causes, evidence and qualifications
remain attached to the same elements. The examples require these fields where the
compact generator uses them; other content types need not acquire them by default.

A renderer can assign display-local keys such as T1, I4 or S1 mechanically and map
them to exact content in a separate legend. These keys are not entity identities,
stable content keys, cross-investigram correspondences or correction units. Their scope
is the particular diagram/legend pair; retain the mapping with exact presentation
artifacts rather than resolving an old key against a later regenerated figure.
Keep meaningful names where they fit; do not replace every name with a code.

The overview must signal its partial scope and where full conditions are available.
Shortening must not present a conditional transition as unconditional: the statechart
retains terse guard cues on edges, while the legend supplies the exact trigger, guard
and effect. A state-change action, after-state snapshot and structured transition
remain different kinds of content even if their labels are similar. Preserve stated
causal links in the legend; proximity and sequence position do not add causes.

The legend carries element-level detail, relevant investigram/item qualification and
support, and an exact mapping to the source investigram content. It is part of the
meaning-bearing delivery when the overview depends on it, not optional decoration.
An isolated image remains explicitly an overview. Moving detail into a legend must
not shed its limitations or establish delivery of unrelated declarations: investigator delivery records the selected context entity, exact items and original source provenance. A diagram/legend alone need not supply the association declaration that designates those items. Exact qualified access remains available.

The mixed and children variants can share a picture because their behavioral data
match; their legend pages and source mappings remain variant-specific. A short label
change is an authored-content change in these fixtures; a mechanically assigned
legend-key change is presentational. This exploration adopts neither a universal
label vocabulary nor a full export/navigation system.

## Exact item addressing and linked information

Cross-investigram illustrations and `relatedContent` use exact investigram/contentKey
addresses, including `{submittedInvestigram: key}` for same-submission targets.
`stateContent` is a same-owner key shorthand. Different link kinds have different
contracts: an illustration asserts a qualified mapping; related content locates an
explanation; stateContent supplies a required semantic dependency. None adopts ownership.

Fresh access can show displacement declarations affecting a linked item's associations.
It cannot report the entire source investigram as superseded or infer that this particular
use is invalid. Repeated content keys do not authorize retargeting. Same-result references
are not incoming exposure; result membership and actual later deliveries are explicit
paths in the current reconsideration probe. See [illustration access](illustration-access.json).

The architectural relation kinds here are `state-category-of`, `instance-role-of`,
`execution-uses-instance` and `waits-for-decision`; only selected things such as W get
an independent entity identity. These are architectural assertions, not organizing
supersession declarations. Other investigram comparison relationships, such as alternative
or inconsistent-with, confer no displacement effect by their label alone.

## Composition probe extensions — not yet generalized

The [composition probe](composition/README.md#small-experimental-additions-to-the-content-contract)
uses shared local roles plus item-local relations and explicit situations. It supplies
resource occupancy and execution progress as qualified assertions, not renderer simulation.
Its [selector grammar](composition/README.md#nested-selector-grammar-for-this-probe) supports
exact relation and situated state-assignment selection, not arbitrary paths. Follow-up
context is RESULT-Q4; selected occurrences need not become entities.

The origin-free request selects P/S/R/B information, including ADMISSION-2's admission
association, without delivering old admission content by default. Actual deliveries and
source provenance are recorded. A separate architectural state model for composition,
resource-lifetime content type, structured selection-origin field and live follow-up
remain open. See the [verification guide](README.md#verification) for exercised boundaries.

# Illustrative agent-facing content contracts

Provisional catalogue slice for the [concrete example](README.md), not a JSON schema
or a commitment to these names. `/0` marks illustrative form versions. Concept IDs
organize architectural guidance; form IDs specify data shape. Neither is an entity
ID, local element key, evidence reference or investigram-relationship kind.

**Terminology:** investigram names the specific retained artifact; account remains
ordinary explanatory language, not a second object or a collection. Existing fixture
keys `account`, `accounts`, `submittedAccount`, `accountIds`, `accountQualifications`
and `accountRelationships` encode investigrams or their relationships/context. These
provisional wire spellings are unchanged in this prose pass; they do not imply an
Account type. Governing definitions and product APIs are unchanged.

**Representation checkpoint:** the authored fixtures now encode offers and presentation
recommendations as qualified investigram-owned metadata. The [complete-payload tour](metadata-payload.md)
traces exact addresses, delivery and replacement through both partitions. A bounded
[diagram-type catalogue](diagram-contracts.json) supplies input contracts for the trial
renderings. These are exploratory executable examples, not implemented application
protocols. Moving information to metadata does not waive qualification, exposure or
complete-target delivery rules.

## Shared envelope and addressing

Return one root investigram, its accompanying replacement investigrams if any, and qualified
relationships between investigrams. Each investigram supplies its own referents,
associations, qualifications, evidence, content, `offers` and `presentations` (explicit
empty arrays when absent in this fixture). Each content item has a local
`key`, a `concept`, a `form`, and the fields required by that form. Content keys are
unique within their exact investigram; nested state keys are local to their state model,
and step keys are unique within their interaction. Identical keys across investigrams do
not assert identity. Introduced-entity keys and submitted-investigram keys instead are
submission-scoped, each in its own namespace.

The `subject` field still denotes a role (request subject, association subject, or
what an item describes). Its value is a typed reference; `{entity: ID}` identifies
an architectural entity, while `{account: ID}` identifies an investigram.
Use `{entity: ID}` for a supplied entity. Use
`{introducedEntity: localKey}` for an entity explicitly introduced in this submission;
PostCode allocates the ID on acceptance. Names are display/interpretation aids, never
identity matching rules. A local state or step key is not automatically an entity.
Use `{account: ID}` for an earlier investigram and `{submittedAccount: key}` for a newly
submitted one. Forward local references are allowed if all resolve in the accepted
submission. No partial allocation or dangling result is intended.

Exactly one `entity-description/0` item per introduced-entity key declares it with
`introducesEntity: true`. This is a declaration marker, not an additional retention/promotion choice: every
explicitly declared entity receives an ID. References, `referents` membership and
`identifies` associations do not themselves declare entities. Duplicate declarations and references without
a declaration are invalid. ADMISSION-2 may reference entities declared in a sibling
or another tree of the same submission; declaration scope is the whole submission.

### Entity identity and associated information

Entities organize qualified information, including investigrams and items, around
identified architectural things;
Subject remains the investigative/claim role and Referent describes what a reference
denotes. Opaque global IDs may be UUIDs; the readable S/P/R aliases here are not an ID
format proposal. Allocation resolves local IDs and records introducing investigram/item
provenance atomically. It does not prove unique discovery, correctness or persistence
beyond the supported Session. There is no registration or promotion stage.

Mechanical producers use the same entity/reference semantics, preserving their existing
identity rules and qualified identifying information. They do not mint a fresh entity
for each encounter, become investigrams or acquire interpretive identity guarantees.
The seeded M/P orientation illustrates this compatibility, not a delivered migration.
Selected entity subjects are recorded as result referents at the appropriate scope;
that does not manufacture a describes/identifies claim or require every child to copy
all input subjects. Investigram/selected-passage subjects need not be entities.

Associated items remain attributable to their owning investigram. `associations` may name
an own `contentKey` for a precise item or omit it for an investigram-level association;
either carries the investigram's applicable qualifications. Identifying descriptions,
classifications, behavior and open topics remain distinct information, not authoritative
entity fields. Referring-investigram discovery remains broader than these item associations.
An item can be associated with several entities. Finer addressing does not allow
item-level correction or bypass whole-investigram replacement/exposure rules.

Ordinary content, node, step and role keys are not entity declarations. Selecting the
passage “application work has not started” addresses content for Explain; it does not
create an entity bearing that sentence as its name. An investigation can subsequently
introduce one using the same declaration protocol. The [walkthrough's supersession
probe](../structured-architectural-accounts-example.md#entity-supersession-probe) keeps
qualified merge/split succession and entity-use reconsideration distinct from existing
investigram correction; those proposed extensions are not accepted by this fixture checker.

### Proposed Entity treatment

W identifies an architectural relationship; C-BB/C-BH identify ordered patterns.
These fixtures propose treating such explicitly identified things as Entities while
keeping all claims about them qualified. This requires explicit governing treatment
alongside interpreted identity; it is not already established merely by the field
name `introducedEntity`. Mechanical export/dependency claims can remain claims without
independent entity identities. Addressability alone, including that of investigram-organizing
metadata or diagram edges, does not introduce an Entity.

### Ownership and composition

The construction pool is a serialization of a result tree and correction-replacement
trees, not a collection of independent roots. Each investigram has exactly one owning
position: the result root, one ordered `children` slot, or one correction's replacement
root. Child slots use `{submittedAccount: key}` and cannot adopt retained old children.
All owned investigrams must be reachable from the result root by following child slots
and reporter-to-replacement ownership links. Duplicate owners, disconnected investigrams,
cycles and shared subtrees are invalid. A correction reporter may be a child; its
replacement belongs to a separate composition tree. Content references and illustration
links are not ownership edges and cannot make an otherwise orphan investigram valid.

Every investigram, including each child and an organizational root, carries its own
qualifications, evidence, referents and associations. Nothing inherits from a parent
by omission. Roots may carry orientation and scope claims that make the result
intelligible without restating the children's behavioral rules. Restatement is
permitted but creates another claim and correction surface: correcting a child does
not automatically correct a root summary. Do not invent a behavioral synthesis merely
to make the root substantive.
`identifies` belongs to the child containing the description when that is the chosen
partition; parent composition does not duplicate that association. Replacing one
child does not mutate its siblings, its parent, or the parent's fixed child list.
Replacement-aware selection discloses displacement separately from stored composition.

Investigram qualifications apply to all its content and associations; items can further
limit claims and identify their own evidence. The investigram's evidence union is not
an assertion that every source supports every item. A nested event/transition keeps
its more specific evidence. Evidence names here resolve through the fixture registry;
production must preserve the corresponding captured basis and qualified support.

When partitioning, determine the qualifications for each investigram's own claims:

1. State what it identifies or asserts, including any scenario context needed to
   distinguish the referents. Retain applicable source-basis and method limitations.
2. Retain every condition needed for those claims. Put a restriction on a narrower
   item, or separate the content, when it does not apply to the whole investigram.
3. Do not copy unrelated behavioral exclusions merely because they qualified the
   original combined explanation. Do not remove a limitation as an editorial shortcut
   to broader applicability: verify the resulting description against its evidence,
   narrow it to identification, or state what remains unestablished.

DEFINITIONS-1 now identifies categories using the pinned `CircuitState` distinctions;
its designations are not limited to default sampling, but it supplies no general
admission/transition rules. ROLE-DEFINITIONS-1 preserves the single-slot scenario
context that identifies its roles, without claiming occurrence or release behavior.
This is claim-level qualification judgment, not a mechanical filter on keywords.

An item excerpt must carry its source investigram identity, applicable investigram-level
qualifications and basis, plus its own evidence and qualifications. An excerpt cannot
silently shed limitations because the full investigram was not selected. Its substantive
delivery cites the containing investigram but does not establish complete-target
delivery. The context ledger spells out this support envelope for the TRIAL-1 excerpts.

`referents` lists explicit entity references in these fixtures; `associations` distinguishes
`identifies` from `describes`. Identifying content can coexist with behavioral content
in one investigram. Classification is a qualified description of the subject, not a
guarantee from allocating its ID. No authoritative global definition is selected by
silently taking the newest description.

Identifying intelligibility means enough information to distinguish the referent
with its applicable scope and limitations, not a complete behavioral explanation.
W's description identifies the participants and what is awaited; it does not specify
when waiting occurs or ends. An `entity-description/0` item may supply `relatedContent`
addresses with a stated purpose so a consumer can request that further explanation.
The referenced content is not implicitly delivered, cited or needed to make W's
minimal identification intelligible. If fetched, it carries its own qualifications.

In the mixed variant, fresh replacement-aware identifying support uses ADMISSION-2's
descriptions. In the children variant, DEFINITIONS-1 remains unchanged because K
targets its behavioral sibling; no descriptions are copied into ADMISSION-2.
ADMISSION-1 remains historical/input context, explicitly labelled as such in the
follow-up answer. Exact ANSWER-1 retains its original support. A correction's
`affectedSubjects` does not exempt embedded descriptions from whole-investigram replacement;
it is not an item-level validity mask. Selection does not establish a canonical definition.

## Provisional partition default

When an investigation result mixes identifying descriptions of explicitly introduced
entities with behavioral explanations, put those descriptions in one or more
identifying children by default. Explicit introduction is the present signal of
expected reuse; the investigator need not predict specific future questions. Group
related descriptions where coherent. An identification-only investigram can itself
be the root; it does not need a wrapper just to follow this rule. Descriptions of
local/minor terms can stay embedded. Any departure should explain the coherence or
delivery reason and acknowledge the wider correction/citation unit.

Assess partition together with the producing evaluation's exposure. DEFINITIONS-1
was produced with only ORIENTATION-0 as retained-investigram context; its consumers can
avoid the separate admission sibling's correction path. COMPOSITION-DEFINITIONS-1
shares seven synthesis citations, so a component correction can reach the definition
and propagate through it to later consumers. Children narrow direct correction and
citation units; they do not isolate inherited correction causes. Their reconsideration
benefit is greatest when the producing evaluation has few relevant exposure paths,
not simply a small token count or few context records. Qualification-scope and
independent-access benefits remain even with broad exposure.

Where identification can be adequately established from a bounded basis, a separate
evaluation can preserve that smaller exposure boundary. This is an orchestration
tradeoff, not a requirement to introduce subjects early or withhold necessary context
to avoid warnings. The default partition rule and evaluation boundaries should be
reviewed together; no per-output exposure exception is implied.

This remains a recommendation, not an adopted schema rule. The [children variant](children/README.md)
now exercises ownership, independent qualification and support selection in authored
fixtures. The mixed-content fixture remains a comparison; neither is application input.

<a id="retained-investigation-offer"></a>
## Retained investigation offer metadata

The [offered follow-up](offered-followup.md) puts keyed entries in `offers`, outside
Interpretation content. Each has label, purpose, architectural targets and their roles,
a supported method reference, declared additional parameters, qualifications and evidence.
This slice declares one focus target and no additional parameters. It is deliberately
not a general schema or an implemented Lens catalogue. Offers have no architectural
content `form` or `concept` tag.

The retained address is `{account, offerKey}`, distinct from `{account, contentKey}`.
Acceptance resolves introduced entities as elsewhere in the submission. Invocation
identifies the exact retained investigram and offer key, with only declared parameter
values; names and purpose text are not lookup keys. The sample stipulates one supported
method: an agent cannot create another capability merely by naming it. The architectural
focus comes from the retained offer, independently of the investigram playing the request
subject role. Discovery remains outside this probe.

The prospective result contract for this offer is the ordinary qualified investigram
contract. It does not require `interaction/0` or `state-behavior/0`; those are useful
forms chosen in the authored result. Each supplied form must satisfy its own contract,
with qualification and reference validation. Concepts alone are neither shape contracts
nor promises of diagrams. The offer supplies its question and scope within the stipulated
supported method; it does not create a new executable capability. A compatible general
presentation handles the supported result content, while specialized diagram availability
depends on the materialized forms and their semantic preconditions.

An offer/request may explicitly specialize this contract, for example “generate a
state diagram.” It then requires suitable qualified state-behavior content and the
requested compatible diagram presentation. Partial/unavailable outcomes must be explicit;
prose-only content is not silent success. See the [optional-contract example](offered-followup.md#optional-diagram-contract).
This note does not adopt a new contract field or require one per offer; specialized
request acceptance is not implemented by the existing checker.

An offer remains subject to its containing investigram's basis, qualifications, whole-
investigram correction and exposure rules. Delivering the substantive offer cites that
investigram, but is not automatically complete-target delivery. Complete own delivery
includes retained offers and presentation recommendations as well as content, referents,
associations, qualifications, evidence and child links, with basis and provenance context.
Child links do not imply delivery of descendants or other referenced items. Knowing the offer's
source does not establish a human navigation origin or prove all source content was
supplied. Preserve actual deliveries and exact offer provenance separately.

ADMISSION-2 has no offer here: its submission already supplies TRIAL-1's answer.
This is an authoring choice, not a rule that offers must be unanswered or temporally
"next". Offers remain atemporal "find out more" guidance; reinvestigation can be useful.
No `addressedBy` field is introduced. In general, a replacement may repeat an offer key. That creates an address in the replacement,
not automatic migration or asserted continuity of the older offer. Retain access to
the original, disclose applicable correction context when supplying its content,
and distinguish partial from complete correction-context delivery. Exact captured
answers preserve their original selection. Fresh inspection does not independently
establish whether an offer is affected by its containing investigram's correction.

## Presentation recommendation metadata and delivery

`presentations` entries contain `key`, `diagramType`, named `inputs`, `qualifications`
and `evidence`. Their retained address is `{account, presentationKey}`. Content,
offer and presentation keys have distinct namespaces; identical spelling does not
permit fallback across namespaces or replacement investigrams.

The bounded [diagram contracts](diagram-contracts.json) declare input forms and known
mappings. `state-diagram/0` takes a `model` of form `state-behavior/0`.
`sequence-diagram/0` takes an `interaction` of form `interaction/0`. Its state-transition
steps already declare their same-investigram `stateContent` and `transition` references.
Resolve those content dependencies to state-behavior items and exact transitions;
reject missing/incompatible models or unknown transitions. Do not repeat those bindings
in presentation metadata, search for a plausible model, or infer state alignment.
These references remain meaningful without recommendations. Only own-investigram
inputs/dependencies are exercised; cross-investigram retrieval policy is not added.

Recommendations are optional judgments of usefulness, not permission to render.
A selected supported diagram type and compatible content can use the same input and
content contracts directly. Both routes preserve qualifications and reject missing
dependencies. Adding a renderer or selecting another compatible diagram does not change
the investigram or require correction. Historical recommendations remain immutable;
an erroneous recommendation could warrant correction, but absence of a newly available
diagram is not an error. No independently mutable guidance lifecycle is introduced.

Each metadata entry carries its owner's applicable qualifications, basis and provenance
when delivered, plus its own narrower qualifications and evidence. An excerpt preserves
the exact entry and address. Delivering it substantively to an investigator cites the
owner; human browsing alone does not. Delivering a recommendation does not deliver
its referenced models. It cannot establish complete-target eligibility. Complete own
delivery includes all own parts, even empty metadata collections, together with basis
and provenance context. Existing correction/revision disclosure rules still apply;
a completeness check alone does not establish every correction precondition.

[Guidance access](guidance-access.json) and the [children counterpart](children/guidance-access.json)
record these deliveries. The [checker](check-guidance.py) rejects omitted or altered
own metadata, missing/mismatched basis or provenance, ambiguous addresses and invalid
diagram bindings. The supported rendering mappings preserve the existing qualified
legends. The current recommendations introduce no additional architectural limitations
beyond those in their bound items and owning investigram. Optional promises, rendering
failure handling and general presentation selection remain outside this fixture.

## Forms in this example

| Form | Information to supply | What it does not imply |
| --- | --- | --- |
| `entity-description/0` | Entity reference, name, identifying description, classification, relevant context (`relativeTo`), evidence; explicit introduction flag when introducing a new entity | Unique discovery, canonical definition, or independent correction unit |
| `prose/0` | Keyed explanatory text under the appropriate concept, with support and qualifications | Missing graph or interaction structure can be invented from the text |
| `admission-cases/0` | Explicit coverage claim; optional form-local roles and their scope; keyed cases with state, condition, outcome, optional resulting state/relationship, and evidence; separately qualified scenario illustrations | A complete state machine, universal interface model, or general claim bound to an illustrative subject |
| `architectural-relations/0` | Keyed, typed relations with role-named endpoints and applicable conditions; optional entity for a relation | Investigram correction, global graph consistency, or mandatory relation identities |
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
and response forms; each outcome transition explicitly cites classification as its
cause. Structural validation checks that these links resolve in order, not that the
asserted causality is true. The trial participant denotes the execution including its
work, so the outcome response is distinct from final delivery to its initiating caller.
The wait step cites the caller request and trial entry, with an explicit condition
that the reserved slot remains occupied on arrival. Each resume/recheck step cites
the transition that releases it; ordinary work or refusal cites that recheck. This explicitly connects release of W to subsequent
admission without claiming that release guarantees work will run.

### Shared roles and illustrations

`roles`, `roleScope` and `illustrations` are optional fields of the common structured
content-item envelope, usable by admission, state, interaction and structural forms.
They are not separate mechanisms per form and are not investigram-global variables.
`{localRole: key}` resolves within the owning item's `roles` only. Keys are unique
there, all references resolve, and `roleScope` states how the variables are bound.
Identical role names in different items do not assert correspondence. The role's full
context is its exact investigram, content key and local role key; allocating it does not
introduce an entity or a general architectural fact.

The admission item binds execution/instance variables separately per request, then
illustrates them with the named scenario. The scenario state item instead refers
directly to R. It needs no variable plus binding merely to rename that same participant.
The common mechanism remains available to other forms when variables add meaning;
the fixture no longer forces a second use just to exercise the syntax. A broadly
applicable state model would require qualified analysis before its instances could
serve as illustrations.

An `illustrations` entry identifies a target investigram/content item, binds owner-local
roles to scenario subjects, and supplies qualification and evidence for that mapping.
An illustration is a general-to-example relationship here, not an alternate encoding
of identity between two names for the same scenario participant. Use a direct subject
reference for the latter; no separate identity-binding mechanism is introduced.
In this probe every declared role is bound once in each illustration. A form-specific
selector may narrow what is illustrated: `case` selects an admission-case key; without
one, the illustration concerns the owning item. Mapping does not establish global
identity or change the general claim's scope. Its substantive subject references need
identifying support when supplied. Bindings remain qualified authored claims, never
correspondences invented by a renderer.

### Exact item addressing and linked revision disclosure

A cross-investigram item address consists of an exact investigram reference and `contentKey`.
Both `illustrations` and descriptive `relatedContent` links use this address shape,
but they have distinct purposes: related content locates further explanation without
asserting an illustrative binding or implying that its content has been supplied.
Within a submission, for example, an illustration has
`account: {submittedAccount: "trial"}, contentKey: "concurrent-callers"`.
Acceptance fixes that investigram reference; subsequent retrieval uses the retained investigram
identity. The `stateContent` field is a same-investigram content-key shorthand. The item
must exist in its addressed investigram. Addressability neither makes it an independently
correctable investigram nor gives its content key identity across replacement investigrams.
Role/case keys can further designate occurrences inside that exact item under its form's
rules. Such content designation can support later investigation without allocating
an entity. The investigation can explicitly introduce an entity if warranted; selection does not
allocate a shared general relationship identity.

Fresh inspection of an illustration may report its target investigram's current revision
status, while preserving the original item address. A superseded investigram does not
establish that this particular item is wrong or replaced. Even an identical content key
in a replacement supplies no correspondence and must not trigger automatic retargeting.
Exact answers preserve captured target/support/revision context; fresh status can be
requested separately. See the [access probe](illustration-access.json).

This is linked-investigram status disclosure, not a new propagation rule. A same-result
illustration link can be surfaced even though it is not a prior-exposure citation;
it does not by itself flag or clear the source investigram for reconsideration. Delivering
the referenced item's qualified content cites its containing investigram, without
complete-target eligibility. Bare addresses/status alone do not supply that content;
substantive correction explanations retain their reporter-citation rule.

The architectural-relation kinds used here are `state-category-of`,
`instance-role-of`, `execution-uses-instance`, and `waits-for-decision`, with explicit
role fields. The first three have local identities only; the waiting relation also
designates W. This small example does not decide how an extensible relation vocabulary
will be organized or which relations warrant special product handling.

## Architectural guidance and diagrams

**State behavior.** Distinguish the thing whose state changes from the state categories
and from participating executions. State what causes a transition, what must hold,
and what it does. Declare partial coverage. A partial statechart may omit an initial
marker; it must not manufacture one. The present form is a flat subset: richer
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
Keyed prose is a valid form under any relevant concept. The catalogue need not force
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
compact generator uses them; other content forms need not acquire them by default.

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
not shed its limitations or manufacture complete-target delivery: supplying selected
diagram content and its legend still cites its source investigram but need not
supply that investigram's complete own content. Exact/full access remains available.

The mixed and children variants can share a picture because their behavioral data
match; their legend pages and source mappings remain variant-specific. A short label
change is an authored-content change in these fixtures; a mechanically assigned
legend-key change is presentational. This exploration adopts neither a universal
label vocabulary nor a full export/navigation system.

## Qualified investigram relationships

The example's correction record supplies a local key, kind, reporter, earlier target,
new replacement, affected subjects, reason, qualifications and evidence. The reason
must establish the claimed error; the kind is not inferred from investigram age or matching
names. The target's complete own content must have been supplied in the dialogue.
The replacement supplies its whole own content; this is not an item patch operation.
If a replacement changes the target's scope, its explanation must disclose the
difference and resulting limits of coverage, not merely add a background qualification.
This example has no such scope difference: both admission investigrams exclude reentrant
entry calls. K's reason therefore remains about the missing waiting case.

Retain K separately, while attributing its substantive reason/qualifications to its
reporter TRIAL-1 for citation and exposure, preserving the current correction rule.
Delivering that explanation cites TRIAL-1, not K, and does not supply TRIAL-1's complete
own content. Bare relationship/endpoint IDs do not cite the reporter. Actual supplied
support is tracked by the usual rules; an evidence reference alone does not assert
delivery of its target's content. The ledger gives concrete exposure examples.
Changing the reporter does not automatically retract K. Independent citations to K
and relationship revocation are not introduced by this sample.

Alternative and inconsistency records would have different meaning and consequences;
this sample neither serializes them nor grants them correction effects. A relationship
record is separately indexable metadata with qualified substance, not necessarily an
investigram. Retention and challenge/revocation semantics beyond this correction path
still require design. This contract must not be mistaken for the existing protocol.

## Composition probe extensions — not yet generalized

The [composition probe](composition/README.md#small-experimental-additions-to-the-content-contract)
uses the shared roles on interaction items and explores item-local relations plus
explicit situation snapshots. Its README defines the additional addressing and
fields; these are local experiments, not requirements retroactively imposed on the
admission/trial fixtures. It deliberately keeps situation and trace roles within one
item. Extracting situations into another form would require qualified correspondence,
not matching role names. Two rendered sequence diagrams exercise the retained meaning;
no full structural view, universal resource schema or application API is introduced.
Its [nested-selector grammar](composition/README.md#nested-selector-grammar-for-this-probe)
defines only exact relation selection and situated state-assignment selection, with
structural and resolution checks. This is not a general arbitrary-path selector.
The origin-free context uses current investigrams plus qualified history disclosure;
endpoint references do not deliver superseded investigram content or establish complete
correction context.

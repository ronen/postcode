# Illustrative agent-facing content contracts

Provisional catalogue slice for the [concrete example](README.md), not a JSON schema
or a commitment to these names. `/0` marks illustrative form versions. Concept IDs
organize architectural guidance; form IDs specify data shape. Neither is a subject
ID, local element key, evidence reference or account-relationship kind.

## Shared envelope and addressing

Return one root account, its accompanying replacement accounts if any, and qualified
account-organizing relationships. Each account supplies its own referents,
associations, qualifications, evidence and content. Each content item has a local
`key`, a `concept`, a `form`, and the fields required by that form. Content keys are
unique within their exact account; nested state keys are local to their state model,
and step keys are unique within their interaction. Identical keys across accounts do
not assert identity. Introduced-subject keys and submitted-account keys instead are
submission-scoped, each in its own namespace.

Use `{subject: ID}` for a supplied retained subject. Use
`{introducedSubject: localKey}` for a subject explicitly introduced in this submission;
PostCode allocates the ID on acceptance. Names are display/interpretation aids, never
identity matching rules. A local state or step key is not automatically a subject.
Use `{account: ID}` for an earlier account and `{submittedAccount: key}` for a newly
submitted one. Forward local references are allowed if all resolve in the accepted
submission. No partial allocation or dangling result is intended.

Exactly one `subject-description/0` item per introduced-subject key declares it with
`introduceRetainedSubject: true`. References, `referents` membership and `identifies`
associations do not declare subjects. Duplicate declarations and references without
a declaration are invalid. ADMISSION-2 may reference subjects declared in a sibling
or another tree of the same submission; declaration scope is the whole submission.

### Ownership and composition

The construction pool is a serialization of a result tree and correction-replacement
trees, not a collection of independent roots. Each account has exactly one owning
position: the result root, one ordered `children` slot, or one correction's replacement
root. Child slots use `{submittedAccount: key}` and cannot adopt retained old children.
All owned accounts must be reachable from the result root by following child slots
and reporter-to-replacement ownership links. Duplicate owners, disconnected accounts,
cycles and shared subtrees are invalid. A correction reporter may be a child; its
replacement belongs to a separate composition tree. Content references and illustration
links are not ownership edges and cannot make an otherwise orphan account valid.

Every account, including each child and an organizational root, carries its own
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

Account qualifications apply to all its content and associations; items can further
limit claims and identify their own evidence. The account's evidence union is not
an assertion that every source supports every item. A nested event/transition keeps
its more specific evidence. Evidence names here resolve through the fixture registry;
production must preserve the corresponding captured basis and qualified support.

When partitioning, determine the qualifications for each account's own claims:

1. State what it identifies or asserts, including any scenario context needed to
   distinguish the referents. Retain applicable source-basis and method limitations.
2. Retain every condition needed for those claims. Put a restriction on a narrower
   item, or separate the content, when it does not apply to the whole account.
3. Do not copy unrelated behavioral exclusions merely because they qualified the
   original combined explanation. Do not remove a limitation as an editorial shortcut
   to broader applicability: verify the resulting description against its evidence,
   narrow it to identification, or state what remains unestablished.

DEFINITIONS-1 now identifies categories using the pinned `CircuitState` distinctions;
its designations are not limited to default sampling, but it supplies no general
admission/transition rules. ROLE-DEFINITIONS-1 preserves the single-slot scenario
context that identifies its roles, without claiming occurrence or release behavior.
This is claim-level qualification judgment, not a mechanical filter on keywords.

An item excerpt must carry its source account identity, applicable account-level
qualifications and basis, plus its own evidence and qualifications. An excerpt cannot
silently shed limitations because the full account was not selected. Its substantive
delivery cites the containing investigram but does not establish complete-target
delivery. The context ledger spells out this support envelope for the TRIAL-1 excerpts.

`referents` lists substantive subject references; `associations` distinguishes
`identifies` from `describes`. Identifying content can coexist with behavioral content
in one investigram. Classification is a qualified description of the subject, not a
guarantee from allocating its ID. No authoritative global definition is selected by
silently taking the newest description.

Identifying intelligibility means enough information to distinguish the referent
with its applicable scope and limitations, not a complete behavioral explanation.
W's description identifies the participants and what is awaited; it does not specify
when waiting occurs or ends. A `subject-description/0` item may supply `relatedContent`
addresses with a stated purpose so a consumer can request that further explanation.
The referenced content is not implicitly delivered, cited or needed to make W's
minimal identification intelligible. If fetched, it carries its own qualifications.

In the mixed variant, fresh replacement-aware identifying support uses ADMISSION-2's
descriptions. In the children variant, DEFINITIONS-1 remains unchanged because K
targets its behavioral sibling; no descriptions are copied into ADMISSION-2.
ADMISSION-1 remains historical/input context, explicitly labelled as such in the
follow-up answer. Exact ANSWER-1 retains its original support. A correction's
`affectedSubjects` does not exempt embedded descriptions from whole-account replacement;
it is not an item-level validity mask. Selection does not establish a canonical definition.

## Provisional partition default

When an investigation result mixes identifying descriptions of explicitly introduced
shared subjects with behavioral explanations, put those descriptions in one or more
identifying children by default. Explicit introduction is the present signal of
expected reuse; the investigator need not predict specific future questions. Group
related descriptions where coherent. An identification-only investigram can itself
be the root; it does not need a wrapper just to follow this rule. Descriptions of
local/minor terms can stay embedded. Any departure should explain the coherence or
delivery reason and acknowledge the wider correction/citation unit.

Assess partition together with the producing evaluation's exposure. DEFINITIONS-1
was produced with only ORIENTATION-0 as retained-account context; its consumers can
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
fixtures. The mixed-account fixture remains a comparison; neither is application input.

## Forms in this example

| Form | Information to supply | What it does not imply |
| --- | --- | --- |
| `subject-description/0` | Subject reference, name, identifying description, classification, relevant context (`relativeTo`), evidence; explicit introduction flag when allocating a new subject | Unique discovery, canonical definition, or independent correction unit |
| `prose/0` | Keyed explanatory text under the appropriate concept, with support and qualifications | Missing graph or interaction structure can be invented from the text |
| `admission-cases/0` | Explicit coverage claim; optional form-local roles and their scope; keyed cases with state, condition, outcome, optional resulting state/relationship, and evidence; separately qualified scenario illustrations | A complete state machine, universal interface model, or general claim bound to an illustrative subject |
| `architectural-relations/0` | Keyed, typed relations with role-named endpoints and applicable conditions; optional retained subject for a relation | Account correction, global graph consistency, or mandatory relation identities |
| `state-behavior/0` | State bearer; coverage and omissions; keyed labelled states; keyed directed transitions with trigger, guard, effect and evidence; outcome qualifications | Initial state, completeness, hierarchy or concurrency when not supplied |
| `interaction/0` | Scenario meaning/conditions; keyed participants tied to subjects; ordered prefix; alternatives with conditions and keyed steps; omissions and evidence | Observed trace, all possible interleavings, or application-level success |

The `interaction/0` step vocabulary in this probe is `request`, `response`, `action`,
`wait`, `resume`, and `state-transition`. Requests/responses supply endpoints and text;
actions supply an actor and text; wait/resume supply participant, decision holder,
architectural relationship and text. A state-transition step names a state-content
item and one of its transitions. That link reuses an explicit claim; it does not
authorize an interpreter to derive arbitrary cross-account correspondences.

An optional `causedBy` lists earlier step keys on the same possible path. It asserts
causal support, not just diagram ordering. Cross-branch or forward references are
invalid here. A cause need not be sufficient or exclusive: branch conditions, guards
and account qualifications still apply. Missing links are not inferred from ordering
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
They are not separate mechanisms per form and are not account-global variables.
`{localRole: key}` resolves within the owning item's `roles` only. Keys are unique
there, all references resolve, and `roleScope` states how the variables are bound.
Identical role names in different items do not assert correspondence. The role's full
context is its exact account, content key and local role key; allocating it does not
introduce a retained subject or a general architectural fact.

The admission item binds execution/instance variables separately per request, then
illustrates them with the named scenario. The scenario state item instead refers
directly to R. It needs no variable plus binding merely to rename that same participant.
The common mechanism remains available to other forms when variables add meaning;
the fixture no longer forces a second use just to exercise the syntax. A broadly
applicable state model would require qualified analysis before its instances could
serve as illustrations.

An `illustrations` entry identifies a target account/content item, binds owner-local
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

A cross-account item address consists of an exact account reference and `contentKey`.
Both `illustrations` and descriptive `relatedContent` links use this address shape,
but they have distinct purposes: related content locates further explanation without
asserting an illustrative binding or implying that its content has been supplied.
Within a submission, for example, an illustration has
`account: {submittedAccount: "trial"}, contentKey: "concurrent-callers"`.
Acceptance fixes that account reference; subsequent retrieval uses the retained account
identity. The `stateContent` field is a same-account content-key shorthand. The item
must exist in its addressed account. Addressability neither makes it an independently
correctable investigram nor gives its content key identity across replacement accounts.
Role/case keys can further designate occurrences inside that exact item under its form's
rules. Such designation can support a later investigation or promotion; it does not
allocate a shared general relationship identity.

Fresh inspection of an illustration may report its target account's current revision
status, while preserving the original item address. A superseded account does not
establish that this particular item is wrong or replaced. Even an identical content key
in a replacement supplies no correspondence and must not trigger automatic retargeting.
Exact answers preserve captured target/support/revision context; fresh status can be
requested separately. See the [access probe](illustration-access.json).

This is linked-account status disclosure, not a new propagation rule. A same-result
illustration link can be surfaced even though it is not a prior-exposure citation;
it does not by itself flag or clear the source account for reconsideration. Delivering
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
applicability field connects the account to P without broadening it to all instances/configurations of P.
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
them to exact content in a separate legend. These keys are not subject identities,
stable content keys, cross-account correspondences or correction units. Their scope
is the particular diagram/legend pair; retain the mapping with exact presentation
artifacts rather than resolving an old key against a later regenerated figure.
Keep meaningful names where they fit; do not replace every name with a code.

The overview must signal its partial scope and where full conditions are available.
Shortening must not present a conditional transition as unconditional: the statechart
retains terse guard cues on edges, while the legend supplies the exact trigger, guard
and effect. A state-change action, after-state snapshot and structured transition
remain different kinds of content even if their labels are similar. Preserve stated
causal links in the legend; proximity and sequence position do not add causes.

The legend carries element-level detail, relevant account/item qualification and
support, and an exact mapping to the source account content. It is part of the
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

## Qualified account relationships

The example's correction record supplies a local key, kind, reporter, earlier target,
new replacement, affected subjects, reason, qualifications and evidence. The reason
must establish the claimed error; the kind is not inferred from account age or matching
names. The target's complete own content must have been supplied in the dialogue.
The replacement supplies its whole own content; this is not an item patch operation.
If a replacement changes the target's scope, its explanation must disclose the
difference and resulting limits of coverage, not merely add a background qualification.
This example has no such scope difference: both admission accounts exclude reentrant
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
The origin-free context uses current accounts plus qualified history disclosure;
endpoint references do not deliver superseded account content or establish complete
correction context.

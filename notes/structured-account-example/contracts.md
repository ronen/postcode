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
associations do not themselves declare subjects. Duplicate declarations and references
without a declaration are invalid. ADMISSION-2 may reference a subject declared in
TRIAL-1 because both belong to this submission. Every construction-pool member in
this childless sample must be either the root or the replacement of exactly one
correction; those roles are disjoint and there are no orphan accounts. A future pool
representation of children would need explicit ownership/reachability rules too.

Account qualifications apply to all its content and associations; items can further
limit claims and identify their own evidence. The account's evidence union is not
an assertion that every source supports every item. A nested event/transition keeps
its more specific evidence. Evidence names here resolve through the fixture registry;
production must preserve the corresponding captured basis and qualified support.
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

For this example, fresh replacement-aware identifying support uses ADMISSION-2's
descriptions. ADMISSION-1 remains historical/input context, explicitly labelled as
such in the follow-up answer. Exact ANSWER-1 retains its original support. A correction's
`affectedSubjects` does not exempt embedded descriptions from whole-account replacement;
it is not an item-level validity mask. Selection does not establish a canonical definition.

## Forms in this example

| Form | Information to supply | What it does not imply |
| --- | --- | --- |
| `subject-description/0` | Subject reference, name, identifying description, classification, relevant context (`relativeTo`), evidence; explicit introduction flag when allocating a new subject | Unique discovery, canonical definition, or independent correction unit |
| `prose/0` | Keyed explanatory text under the appropriate concept, with support and qualifications | Missing graph or interaction structure can be invented from the text |
| `admission-cases/0` | Explicit coverage claim; keyed cases with state, condition, outcome, optional resulting state/relationship references, and evidence | A complete state machine or a universal interface model |
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
invalid here. Completion, outcome availability and classification use existing action
and response forms; each outcome transition explicitly cites classification as its
cause. Structural validation checks that these links resolve in order, not that the
asserted causality is true. The trial participant denotes the execution including its
work, so the outcome response is distinct from final delivery to its initiating caller.

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
In this sample the bearer remains scenario role R. The explicit applicability field
connects the account to P without broadening it to all instances/configurations of P.
A type-level model and qualified binding to R are a possible later extension, not a
mechanical reinterpretation of this model. The recovery-outcome guard means the
completing trial still belongs to the current Half-open state; stale results do not
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

## Qualified account relationships

The example's correction record supplies a local key, kind, reporter, earlier target,
new replacement, affected subjects, reason, qualifications and evidence. The reason
must establish the claimed error; the kind is not inferred from account age or matching
names. The target's complete own content must have been supplied in the dialogue.
The replacement supplies its whole own content; this is not an item patch operation.

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

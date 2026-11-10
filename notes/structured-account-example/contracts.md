# Illustrative agent-facing content contracts

Provisional catalogue slice for the [concrete example](README.md), not a JSON schema
or a commitment to these names. `/0` marks illustrative form versions. Concept IDs
organize architectural guidance; form IDs specify data shape. Neither is a subject
ID, local element key, evidence reference or account-relationship kind.

## Shared envelope and addressing

Return one root account, its accompanying replacement accounts if any, and qualified
account-organizing relationships. Each account supplies its own referents,
associations, qualifications, evidence and content. Each content item has a local
`key`, a `concept`, a `form`, and the fields required by that form. A key is stable
within this exact account only; identical keys in two accounts do not assert identity.

Use `{subject: ID}` for a supplied retained subject. Use
`{introducedSubject: localKey}` for a subject explicitly introduced in this submission;
PostCode allocates the ID on acceptance. Names are display/interpretation aids, never
identity matching rules. A local state or step key is not automatically a subject.
Use `{account: ID}` for an earlier account and `{submittedAccount: key}` for a newly
submitted one. Forward local references are allowed if all resolve in the accepted
submission. No partial allocation or dangling result is intended.

Account qualifications apply to all its content and associations; items can further
limit claims and identify their own evidence. The account's evidence union is not
an assertion that every source supports every item. A nested event/transition keeps
its more specific evidence. Evidence names here resolve through the fixture registry;
production must preserve the corresponding captured basis and qualified support.

`referents` lists substantive subject references; `associations` distinguishes
`identifies` from `describes`. Identifying content can coexist with behavioral content
in one investigram. Classification is a qualified description of the subject, not a
guarantee from allocating its ID. No authoritative global definition is selected by
silently taking the newest description.

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

Alternative and inconsistency records would have different meaning and consequences;
this sample neither serializes them nor grants them correction effects. A relationship
record is separately indexable metadata with qualified substance, not necessarily an
investigram. Retention and challenge/revocation semantics beyond this correction path
still require design. This contract must not be mistaken for the existing protocol.

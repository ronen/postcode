# Cockatiel: connected account examples

Recorded: 2026-11-08

Status: exploratory content and interaction examples for capability planning

These examples make a small part of the
[investigation script](cockatiel-investigation-script.md) concrete: breaker admission,
half-open trials, policy composition, and a correction to an earlier account.
They show what is available to select, what information that selection requests,
and what carries into the next selection. The human's private question supplies
neither hidden request parameters nor application context.

The aim is to help choose a bounded account/presentation capability. The examples
specify candidate content and observable relationships; implementation schemas,
Lens boundaries, graphical controls and broader work sequencing remain open.

<a id="basis"></a>
## Shared basis and scope

The program basis is Cockatiel revision
`f48bea55022ab15ab07eb52a79bfc1e661300fd4`. Content is adapted from the existing
[working account](cockatiel-working-account.md), which records documentation and
static source inspection. This document adds no source inspection, runtime test or
PostCode-generated analysis. The omission and its discovery are deliberately
staged to exercise correction delivery, not to demonstrate reliable detection.

The account content concerns implemented library behavior. Half-open concurrency
uses the default single-trial case; other sampling configurations remain unexamined.
Application-specific behavior and proposed changes stay in the human's reasoning.
The script's [scope choices](cockatiel-investigation-script.md#journey-scope) apply.

For inspection of supporting material, these evidence references inherit the
original investigation's citations:

| Reference | Material | Content it bears on |
| --- | --- | --- |
| E-breaker | [CircuitBreakerPolicy source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts) | Admission, recovery trials, waiting and stored state |
| E-bulkhead | [BulkheadPolicy source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/BulkheadPolicy.ts) | Execution capacity, waiting queue and refusal |
| E-policy | [Policy API source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/Policy.ts) | Policy instances, supplied operations and composition |

A source reference records the basis used by an interpretation; it does not by
itself establish that every claim or omission is correct. A human can inspect the
qualified explanation and its evidence without being required to read source syntax.
[[BASIS]](architectural-concept-references.md#basis)

<a id="subjects"></a>
## Available subjects and choices

At entry, an orientation account has introduced these subjects:

- **Circuit breaker:** a kind of reusable policy governing supplied work through
  failure/recovery rules. [[RESP]](architectural-concept-references.md#responsibility)
- **Bulkhead:** a kind of reusable policy governing concurrency and queue capacity.
  [[RESP]](architectural-concept-references.md#responsibility)
- **Policy:** the shared execution-governing role.
  [[RESP]](architectural-concept-references.md#responsibility)
- **Policy combination:** the supported arrangement in which an outer policy
  controls execution through an inner policy.
  [[INTERACTION]](architectural-concept-references.md#interaction)

These are architectural subjects over the captured library revision. Policy kinds
and composition patterns describe possible use; no running application has been
inspected. The examples retain the following more specific meanings as they emerge:

| Subject | Meaning and scope | Relationship enabling navigation |
| --- | --- | --- |
| Half-open | Recovery state of the Circuit breaker kind in this account | State of Circuit breaker; permits a recovery trial |
| Recovery trial | An execution role occupied by application-supplied work under recovery rules | Occurs during half-open; outcome influences breaker state |
| Individual execution | One call using a policy with supplied work | Uses a policy instance; has its own pending/completed progress |
| Shared breaker instance | Instance role whose recovery state is shared by callers | Instance of Circuit breaker; used by individual executions |
| Bulkhead outside breaker | Ordered composition pattern | Outer Bulkhead instance role and inner Circuit breaker instance role |
| Breaker outside bulkhead | Ordered composition pattern | Outer Circuit breaker instance role and inner Bulkhead instance role |

The table specifies meaning that must survive selection, rather than a persistent
identifier scheme. References must distinguish a policy kind, a shared-instance
role, a state and an execution role even when their labels are similar. Scope and
relationships are retained within the example's investigation and captured basis.
[[ACCOUNT]](architectural-concept-references.md#account)

The small set of offered choices is explicit:

| Available subject | Offered information choice | Meaning of that choice |
| --- | --- | --- |
| Circuit breaker | Interface → execution and state inspection | Describe supplied-work execution, observable admission cases, state inspection and their effects |
| Half-open, once exposed | Interaction → concurrent callers and outcomes | Describe how trial work, other callers and trial outcomes interact under the stated configuration |
| Policy combination | Interaction → composition order | Describe how execution passes through the two named policies and which resources/state each owns while work proceeds or waits |

These are candidate selectable meanings, not proposed CLI syntax. They can be
presented as options or refinements. Each requests the same information regardless
of whether the human is considering readiness, documentation or another concern.
The account can expose more than the human needs at that moment.

<a id="admission-initial"></a>
## 1. Breaker execution and inspection: ADMISSION-1

**Available before selection:** Circuit breaker and its offered interface choice.

**Human selection:** Circuit breaker → Interface → execution and state inspection.

**Request meaning:** explain the existing execution and state-inspection contract
for this policy kind at the captured revision and stated recovery configuration.

**Displayed account:**

| Item | Initial content | Concept |
| --- | --- | --- |
| Supplied work | The application supplies an operation; the breaker governs its admission and observes its outcome. | [[INTERFACE]](architectural-concept-references.md#interface) |
| Normal work allowed | Ordinary execution is permitted under closed-state behavior. | [[INTERFACE]](architectural-concept-references.md#interface) [[STATE]](architectural-concept-references.md#state) |
| Recovery attempt allowed | A recovery-eligible execution can enter half-open and run a trial of supplied work. | [[INTERFACE]](architectural-concept-references.md#interface) [[STATE]](architectural-concept-references.md#state) |
| Work blocked | The breaker withholds attempts under its blocking conditions. | [[INTERFACE]](architectural-concept-references.md#interface) |
| State inspection | Reading stored state reports it without reserving an opportunity or supplying work. Inspection and execution can observe different conditions. | [[INTERFACE]](architectural-concept-references.md#interface) |
| Qualification | Static interpretation with E-breaker as its cited basis; default single-trial recovery scope. | [[BASIS]](architectural-concept-references.md#basis) |

*Example annotation: the admission cases omit a caller waiting while the recovery
trial is occupied. This is the seeded error, not an accurate complete contract.*

**Newly available follow-up:** Half-open is a selectable state of this breaker,
linked to recovery-trial execution. Its offered interaction choice includes
concurrent callers and outcomes. The human can choose that without already knowing
that waiting was omitted. [[ACCOUNT]](architectural-concept-references.md#account)

**Retained answer:** call this exact initial result ANSWER-1. It selects ADMISSION-1
with its subject meaning, basis and qualifications. These names are editorial
handles in this example, not claims about current product identifiers.

<a id="trial"></a>
## 2. Half-open with concurrent callers: TRIAL-1

**Available before selection:** Half-open, exposed by ADMISSION-1, and the interaction
choice defined above.

**Human selection:** Half-open → Interaction → concurrent callers and outcomes.

**Request meaning:** describe the trial's work, the progress of concurrent callers,
and the effects of trial outcomes for the default single-trial case.

**Investigation context:** the selected state retains its Circuit breaker referent
and program basis. The complete ADMISSION-1 interpretation and its qualifications
are supplied as earlier-account context, alongside relevant library evidence.
The known navigation origin is ANSWER-1; that origin does not establish what the
human understood or relied on.

**Displayed account:**

| Item | Content | Concept |
| --- | --- | --- |
| Shared state | A shared breaker instance carries recovery state across calls. Individual executions have their own progress. | [[OWNERSHIP]](architectural-concept-references.md#ownership) [[STATE]](architectural-concept-references.md#state) |
| Trial work | An admitted recovery trial runs an operation supplied by the application. | [[INTERACTION]](architectural-concept-references.md#interaction) [[OWNERSHIP]](architectural-concept-references.md#ownership) |
| Concurrent caller | While the single trial is occupied, another caller can wait for its outcome; that caller's execution result remains pending. | [[INTERACTION]](architectural-concept-references.md#interaction) |
| Trial outcome | The result contributes to the recovery decision. Success can close the breaker; failure can reopen it under the configured rules. | [[STATE]](architectural-concept-references.md#state) |
| Waiting caller's later result | After waiting, the caller encounters the resulting admission decision, which can still refuse it. | [[INTERACTION]](architectural-concept-references.md#interaction) [[INTERFACE]](architectural-concept-references.md#interface) |
| Qualification | Static account supported by E-breaker. This is a possible interaction sequence, not an observed run or coverage of every recovery configuration. | [[BASIS]](architectural-concept-references.md#basis) |

The account exposes Individual execution, Shared breaker instance and Recovery
trial with the meanings above. Following a relationship selects that scoped
subject; it does not require discovering a source-code entity with the same name.
[[ACCOUNT]](architectural-concept-references.md#account)

In this staged example, the investigation identifies the omission in ADMISSION-1.
TRIAL-1 arrives together with the replacement admission account and correction
below. The trigger is investigation of concurrent callers, rather than the human
asking PostCode to diagnose an unspoken misunderstanding.

<a id="correction"></a>
## 3. Corrected admission account: ADMISSION-2

This is a replacement account accompanying the second investigation, not another
human request. Its subject, revision and default recovery scope match ADMISSION-1.

**Displayed replacement content:**

| Item | Corrected content | Concept |
| --- | --- | --- |
| Supplied work | The application supplies an operation; the breaker governs its admission and observes its outcome. | [[INTERFACE]](architectural-concept-references.md#interface) |
| Normal work allowed | Ordinary execution is permitted under closed-state behavior. | [[INTERFACE]](architectural-concept-references.md#interface) [[STATE]](architectural-concept-references.md#state) |
| Recovery attempt allowed | A recovery-eligible execution can enter half-open and run a trial when trial capacity permits. | [[INTERFACE]](architectural-concept-references.md#interface) [[STATE]](architectural-concept-references.md#state) |
| Waiting for recovery decision | In the default single-trial case, another caller can wait while the trial is occupied. The resulting decision can still refuse that caller. | [[INTERACTION]](architectural-concept-references.md#interaction) [[INTERFACE]](architectural-concept-references.md#interface) |
| Work blocked | The breaker withholds attempts under its blocking conditions. | [[INTERFACE]](architectural-concept-references.md#interface) |
| State inspection | Reading stored state reports it without reserving an opportunity or supplying work. Inspection and execution can observe different conditions. | [[INTERFACE]](architectural-concept-references.md#interface) |
| Qualification | Static interpretation with E-breaker as its cited basis; default single-trial recovery scope. The concurrent-caller behavior is explained by TRIAL-1. | [[BASIS]](architectural-concept-references.md#basis) |

**Correction notice:** “The earlier admission account omitted waiting during an
occupied recovery trial. Recovery eligibility does not mean every caller can start
a trial immediately; a waiting caller can later be refused.”
[[CORRECTION]](architectural-concept-references.md#correction)

The notice identifies ADMISSION-1 as its target, ADMISSION-2 as its replacement,
and the newly examined concurrent-caller behavior as its reason. The related
TRIAL-1 explanation and cited evidence remain accessible. This illustrates the
required experience once a correction is identified; discovery reliability needs
separate assessment.

**Retained answer and available actions:** ANSWER-2 selects TRIAL-1 and ADMISSION-2
with the correction relationship and their qualifications. It makes the change
visible without requiring the human to open a history display.
[[ACCOUNT]](architectural-concept-references.md#account)
[[CORRECTION]](architectural-concept-references.md#correction)

- Inspect ADMISSION-1, ADMISSION-2, the reason and supporting material.
- Reopen exact ANSWER-1 with the content and qualification it originally selected.
  Any display of subsequently known revision status is distinguished from that
  historical answer's captured state.
- Continue from the replacement by explicitly selecting it. An exact reference to
  the earlier account keeps its original target.

A factual revision to an account is distinct from the human changing a design
preference. This episode contains no proposed program change or runtime state change.

<a id="composition"></a>
## 4. Composition order: COMPOSITION-1

**Available before selection:** Policy combination, Circuit breaker and Bulkhead
from the orientation material; the retained admission and trial accounts from the
preceding selections.

**Human selection:** Policy combination → Interaction → composition order, selecting
Circuit breaker and Bulkhead as the two components.

**Request meaning:** describe both supported wrapping orders, execution flow and
resource/state ownership while work runs or waits. This requests analysis of
existing composition behavior; placing two summaries side by side would not itself
establish those relationships.

**Displayed account:**

| Item | Content | Concept |
| --- | --- | --- |
| Instance composition | The outer policy controls calls into the inner policy. Their instances retain distinct state. The application chooses which executions share them. | [[INTERACTION]](architectural-concept-references.md#interaction) [[OWNERSHIP]](architectural-concept-references.md#ownership) |
| Bulkhead outside breaker | An operation can occupy bulkhead execution capacity while waiting for the breaker to finish its recovery decision. The pending execution uses both policies. | [[INTERACTION]](architectural-concept-references.md#interaction) [[OWNERSHIP]](architectural-concept-references.md#ownership) |
| Breaker outside bulkhead | A recovery attempt admitted by the breaker can then wait for bulkhead capacity before its supplied work runs. | [[INTERACTION]](architectural-concept-references.md#interaction) [[OWNERSHIP]](architectural-concept-references.md#ownership) |
| Observation and later execution | A snapshot before submission need not predict the conditions when an inner policy is reached after waiting. | [[INTERFACE]](architectural-concept-references.md#interface) [[INTERACTION]](architectural-concept-references.md#interaction) |
| Qualification | Static interpretation using E-policy, E-bulkhead and E-breaker, with TRIAL-1 and ADMISSION-2 as selected earlier interpretations. These are supported usage patterns, not observed objects in the reporter's application. | [[BASIS]](architectural-concept-references.md#basis) |

**Navigable relationships:** either ordering case can be selected for more detail.
Its component instance roles link to their policy kinds. Following the breaker
kind gives access to its admission contract and half-open state; following Bulkhead
gives access to its capacity and waiting behavior. The shared instance role remains
distinct from Individual execution throughout.
[[ACCOUNT]](architectural-concept-references.md#account)

**Retained answer:** ANSWER-3 selects COMPOSITION-1 with its captured basis and
explicit earlier-account contributions. The human can revisit ANSWER-2 as an exact
reference. Selecting a new perspective instead requests that perspective's content;
rearranging an existing answer preserves its selected content.

<a id="structure"></a>
## What these examples need to carry

| Information that needs explicit representation | Why this small set needs it |
| --- | --- |
| Subject reference, meaning and scope | Following Half-open or an instance role must preserve what was selected, its policy relationship and captured program basis. |
| Request meaning and selected focus | Interface/execution-inspection and Interaction/concurrent-callers request different information independently of a private question. |
| Addressable account content and qualifications | The admission account, trial account and composition account can be selected, cited and inspected separately with their applicable conditions. |
| Named relationships and destinations | State-of, trial-work, instance-of, uses-policy and outer/inner order support follow-up selections. Their meaning matters more than their eventual field names. |
| Supporting basis and roles | Program evidence and earlier interpretations remain distinguishable; using an earlier account is not independent corroboration. |
| Exact answer selection and revision information | Retain what ANSWER-1 showed, what ANSWER-2 selected, and the correction target, replacement and reason. |

The explanatory wording, human-readable qualification text, inferred consequences
and correction explanation can remain prose. Addressability does not require every
sentence to become a field or every concept mnemonic to become a Lens. Conversely,
a relationship named only in prose is insufficient for the promised follow-up
selection unless its destination and meaning are available to that operation.

The tables illustrate content that must be distinguishable; they are not a proposed
serialization or a requirement for table presentation. An account may comprise
several retained interpretation units. The labels here deliberately leave that
partition open while making the target and replacement content concrete.

<a id="planning-questions"></a>
## Questions for capability planning

- Which of these subjects and relationships need explicit retained structure for
  the first selected interaction, and which can remain qualified prose?
- What must an execution/inspection or concurrent-caller selection carry so that
  generation is reproducible in meaning without importing the human's thoughts?
- How should new perspective content, expansion of existing content and exact
  answer presentation be distinguished in that bounded interaction?
- Which parts of the correction experience can be exercised with seeded accounts,
  and what separate investigation evaluates discovery of omissions or misleading
  explanations?

These examples are inputs to the planned structured-account and presentation work.
They do not choose a complete implementation slice or extend the journey to
hypothetical/intended-design assessment. The mnemonic `ACCOUNT` used in these notes
means account support; it is distinct from the broader upcoming-work item of the
same name.

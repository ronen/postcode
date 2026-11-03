# Cockatiel through architectural operations

Recorded: 2026-11-03
Status: first discussion sketch; non-governing, not an interface or implementation plan

## What this pass tests

Walk through the [recorded Cockatiel dialogue](readiness-investigation-dialogue.md)
using architectural concepts and reusable operations, discovering the vocabulary
as we go. The question is how much of the investigation these operations can carry,
and where something else is needed. Commands below are illustrative interaction
notation, not implemented PostCode CLI syntax. A GUI could express the same
intentions with selections and actions. Results can be prose, diagrams, or both.

The human understands how to use PostCode and can identify available actions and
targets. They initially know little about Cockatiel. We presume useful, possibly
partial and tentative architectural framing, with further investigation available.
Perspectives are conceptually available at entry; computation timing and command
discovery are outside this pass. This does not assume that every perspective has
an adequate answer or that analysis will always settle a question.

All Cockatiel result content below is reconstructed from the earlier dialogue and
[working account](cockatiel-working-account.md), concerning revision
`f48bea55022ab15ab07eb52a79bfc1e661300fd4` and issue #111 as read on 2026-10-14.
No new repository inspection, execution, or PostCode inference was performed.
These are concrete illustrative answers, not demonstrated PostCode results.
Their original basis was static inspection and documentation; the reported
application problem was not reproduced. Source references identify the dialogue
passages supporting each scene. Selecting supporting evidence should disclose
that basis intelligibly without requiring source-language fluency.

The pass groups related exchanges while preserving the main investigative route.
It is retrospective: successful framing here cannot prove that an agent would
have proposed it at the time. In particular, issue #111 already suggested eager
transitions. We must not hide that suggestion to manufacture a later discovery.

## Starting place

**Context:** issue #111 — deciding whether to prepare work before protected execution.

**Initial account:** the reporter wants to avoid costly preparation while the
breaker blocks work. Stored state can remain open after the recovery delay, so a
state-only gate can prevent execution from initiating recovery. The reporter says
an application-side timing workaround works and suggests optional eager state
transitions. These are reported need and proposed direction, not a verified fix.

**Available perspectives, assumed for this sketch:** responsibility, ownership,
state, interaction, and contract; relevant surrounding context is available.
Perspective names may overlap and are provisional. There is no required top-level
stop before this issue context.

## 1. What is this part of?

**Human need:** is job submission central to Cockatiel, or a supporting component?

```text
show surrounding context
focus Cockatiel
show purpose
show responsibilities
```

**Illustrative answer:** Cockatiel governs application-supplied operations through
resilience policies. The application owns job preparation, submission, and stored
outcomes. Cockatiel supplies retry, breaker, timeout, bulkhead, and fallback
behavior. Its bulkhead can queue operations in memory; that is not the
application's background-job lifecycle.

The issue context remains available. The broader account identifies policy
execution and application ownership as relevant subjects. This outward movement
is through responsibilities, not a directory parent or navigation history.

**Carries forward:** the application/library boundary. The original opening
blurred that boundary; the original dialogue remains evidence of that correction.
This reconstructed answer incorporates it openly rather than reenacting the error.

**Source:** exchanges [1](readiness-investigation-dialogue.md#orientation) and
[3](readiness-investigation-dialogue.md#queueing-correction).

## 2. A readiness facility is a new intention

**Human need:** suggest a readiness check and understand its promise.

At this point the human introduces a design idea. `show contract` cannot create
that intention from nothing. We record a first gap: how a command/gesture-only
experience lets the human introduce a proposal not already offered.

For the remainder of the walkthrough, supply the original human proposal as
explicit input: **an advisory readiness query, before preparation**. It is a
candidate change, kept distinct from existing behavior. Its initial contract can
then be investigated:

```text
focus readiness-query proposal
show contract
explain advisory observation
```

**Illustrative answer:** report eligibility to attempt work; do not run work,
reserve permission, or predict success. Conditions may change before execution.
A stronger reservation would introduce lifetime and coordination obligations.
These are candidate commitments for human judgment, not established requirements.

**Source:** exchanges [2–3](readiness-investigation-dialogue.md#readiness-proposal).

## 3. Does the concept extend beyond the breaker?

**Human need:** consider other mechanisms and how they fit Cockatiel's purpose.

```text
show alternatives
compare alternatives by responsibility
```

**Illustrative answer:** breaker admission, bulkhead capacity, active dependency
probes, and application health signals offer different information. A healthy
service may still be blocked by a breaker. Policy admission is closer to the
library's existing responsibilities; general readiness introduces broader ones.
That assessment is inferred fit, not a maintainer ruling.

**New capability assumption:** `show alternatives` here asks for qualified design
analysis. It is not merely revealing an inventory. The alternatives must state
where they came from and need not be exhaustive. If this is too broad to count as
a basic operation, that is a gap to discuss rather than a reason to assume the
candidates were always present.

The human's preference to address the immediate need conservatively is another
intent input. We preserve it from exchange 7; no inspection command derives it.
It constrains the proposal without preventing further comparison.

**Sources:** exchanges [4–6](readiness-investigation-dialogue.md#alternative-mechanisms)
and [7](readiness-investigation-dialogue.md#conservative-scope).

## 4. Compare admission and discover waiting

**Human need:** could breaker readiness and bulkhead capacity share a meaning?

```text
compare breaker and bulkhead by admission
explain waiting during recovery
```

**Illustrative answer:** bulkhead work can start, queue, or be rejected. A breaker
can admit normal work or a trial, withhold attempts, or make calls wait while
recovery trials are occupied. A waiting call can still be rejected after the
trial outcome. Waiting for capacity and waiting for a recovery decision have
different meanings. Neither reserves eventual success.

**Revision to retain:** the original normal/trial/blocked account omitted waiting.
A more complete account records that addition, its static-inspection basis, and
its consequence for any proposed acceptance contract. The earlier answer remains
accessible. We should not force the sketch to reproduce an omission if the
initial framing already covers waiting.

**Source:** exchange [8](readiness-investigation-dialogue.md#bulkhead-comparison).

## 5. What is the operating model, and who owns the state?

**Human need:** understand policy objects, per-call progress, and composition.

```text
focus Cockatiel
show interaction
show ownership
focus policy composition
show interaction
```

**Illustrative answer:** an application creates and retains policy instances,
supplies an operation, and receives its eventual value or error. A policy instance
can govern many calls. The breaker retains recovery state; the bulkhead retains
capacity and its waiting queue; each execution has its own progress. Wrapping
policies gives one execution entry point while preserving component instances
and their separate states.

The interaction account offers the two ordering cases for inspection. With a
bulkhead outside a breaker, work can hold execution capacity while waiting for a
recovery decision. With a breaker outside a bulkhead, an admitted recovery attempt
can wait for capacity. This is a static account, not an observed execution trace.

Returning to **ownership** adds the significance of separate state and capacity
to the earlier boundary account. A caller assembling the composition can retain
the breaker reference; a caller given only the protected operation may not have
it. Wrapping alone does not settle the application's access boundary.

**Sources:** exchanges [9–11](readiness-investigation-dialogue.md#operating-model)
and [16](readiness-investigation-dialogue.md#access-to-wrapped-breaker).

## 6. Starting, acceptance, and the limits of a common contract

**Human need:** distinguish immediate execution from acceptance to wait, explain
negative results, and assess whether the proposal addresses the issue.

```text
focus readiness-query proposal
compare immediate-start and acceptance contracts
show refusal explanations
compare proposal with reported need
```

The contract candidates were introduced by the original human discussion. Their
availability here depends on the unresolved intent/proposal input from scene 2;
we do not assume that a selector can express every new contract.

**Illustrative answer:** acceptance could include waiting, but not promise that the
operation will eventually run. A negative answer should distinguish exhausted
capacity, recovery delay, and manual isolation. The last failure explains past
behavior; it does not establish current dependency health. The query must account
for elapsed recovery delay to address the reported preparation problem.

For a composition, a conservative check of current component conditions cannot
predict conditions after waiting. A negative component snapshot need not imply
eventual rejection. A common interface is a proposal with unresolved semantics,
not a conclusion implied by there being two comparable policies.

**Gap:** comparing a design with a need requires qualified reasoning about both;
this is more than comparing fields. "Addresses the reported need" must remain
separate from implementation verification.

**Sources:** exchanges [12–15](readiness-investigation-dialogue.md#available-now)
and [17](readiness-investigation-dialogue.md#shared-interface-direction).

## 7. Return to the policy family and its existing contracts

**Human need:** discover other policies and existing failure-reporting mechanisms.

```text
focus Cockatiel
show policy responsibilities
show execution outcomes
show notifications
```

**Illustrative answer:** retry, timeout, fallback, and no-op join breaker and
bulkhead in the common execution model. They do not all govern admission in the
same way. Execution yields an eventual value or error; outer policies may handle
inner failures. Waiting is pending execution, not itself failure. Policy-local
events and state queries provide additional information; no generic acceptance
query exists in the inspected model.

**Carries forward:** any shared-query proposal now has a wider compatibility and
meaning question. This is the same broad context as scene 1 with relevant detail
made available, not an unrelated new account.

**Sources:** exchanges [18–19](readiness-investigation-dialogue.md#policy-family).

## 8. Why doesn't existing state answer the question?

**Human need:** understand the missing information and the reason for current behavior.

```text
focus circuit breaker
show state transitions
compare stored state with admission eligibility
show evidence for execution-triggered recovery
explain execution-triggered recovery
```

**Illustrative answer:** after an illustrative 30-second delay, an otherwise
eligible breaker may still report open at 31 seconds; the next execution checks
the clock, transitions to half-open, and supplies the trial. Reading state does
not do that. The reporter's timing workaround recognizes the distinction and is
reported sufficient. No runtime reproduction establishes sufficiency here.

Evidence access identifies the pinned implementation/documentation basis and
explains the relevant behavior in intelligible terms. An explanation may suggest
advantages of work-driven recovery and avoiding idle timers, but must label that
rationale as inference. "Explain" cannot invent authorial intent.

**Sources:** exchanges [20–21](readiness-investigation-dialogue.md#state-versus-acceptance)
and [24](readiness-investigation-dialogue.md#workaround-sufficiency).

## 9. Explain the state through an interaction

**Human need:** understand half-open, actual trials, and other callers.

```text
explain half-open
show interaction during a recovery trial
```

**Illustrative answer:** half-open permits limited trial executions of ordinary
application work; it is not special repair work or proof of health. In the
recorded single-trial example, other calls wait for the trial's outcome and may
then be rejected. An advisory query starts no trial and reserves no opportunity.
Multiple callers could observe eligibility and all prepare work.

**Cross-perspective consequence:** ownership identifies who supplies the trial;
state describes eligibility; interaction distinguishes eligibility from a running
trial. The new behavioral detail qualifies the proposal's contract. The account
should connect these claims without pretending that a structural rendering alone
established the behavior.

**Sources:** exchanges [22–23](readiness-investigation-dialogue.md#half-open-explanation).

## 10. Inspect the reporter's alternative precisely

**Human need:** distinguish automatic eligibility from recovery and an elapsed delay
from a scheduled timer.

```text
focus automatic-transition proposal
show state transitions
compare proposal with existing recovery behavior
```

**Illustrative answer:** the proposal makes a recovery trial eligible when the
delay ends, without an execution arriving. It moves to half-open, not directly
to closed; execution still supplies work and its outcome establishes recovery.
The existing delay is checked on execution. Scheduling a timer to cause a
transition would be new behavior.

**Correction access:** the original explanation's phrase "timer expires" blurred
this distinction. If an answer contains that ambiguity, later investigation must
link its correction and show what the change affects. The reconstructed account
uses the corrected meaning, with the original available in the dialogue.

**Sources:** exchanges [25–26](readiness-investigation-dialogue.md#requested-automatic-transition).

## 11. Notifications change the comparison

**Human need:** see existing events and judge a notification-based alternative.

```text
focus circuit breaker
show notifications
compare readiness-query and automatic-transition proposals by interaction
```

**Illustrative answer:** existing breaker events report actual state transitions.
Currently, delay expiry alone emits no transition event. A pure advisory query
can answer when asked; automatic transition with the existing events could notify
a waiting application that a trial is eligible. Neither starts application work.
Incoming job requests could themselves trigger queries, so polling is not an
unavoidable consequence of the query alternative.

**Return to responsibility/ownership:** the proposed timer moves responsibility
for announcing eligibility into Cockatiel. Application ownership of preparation
and trial work remains. Show this as a proposed allocation alongside the existing
account, not a correction claiming the library already does it.

**Source:** exchanges [27–28](readiness-investigation-dialogue.md#breaker-transition-events).

## 12. Examine commitments and reach a human endpoint

```text
focus automatic-transition proposal
show compatibility concerns
show lifecycle concerns
```

**Illustrative answer:** preserving current behavior by default is a plausible
compatibility direction, not a verified implementation property. Opting in changes
state and event timing. Open questions include event ordering, duplicate
transitions, obsolete timers after isolation or reopening, restored state, and
resource lifetime. A timer must not imply work or successful recovery.

**Intent/decision gap:** the human endorses an opt-in direction and its commitments.
An investigation operation cannot infer that endorsement. Selecting a displayed
candidate might express the choice, but adding or qualifying commitments still
needs an input mechanism. Preserve the actual historical decision for this pass:
opt-in automatic open-to-half-open transition, using existing state/events,
default behavior preserved, with the identified details still to settle.

The useful endpoint is a qualified design direction with rationale, alternatives,
and unresolved commitments available for later work. The sketch performs no
implementation or external handoff.

**Sources:** exchanges [29–30](readiness-investigation-dialogue.md#compatibility-and-timer-contract).

## Vocabulary encountered and limits

The walkthrough suggests four recurring operation families, not a settled grammar:

| Operation | Meaning in this sketch | Limitation exposed |
| --- | --- | --- |
| Focus | Select an issue, system, relationship, or proposal as context. | These are conceptual targets, not all currently supported PostCode Subjects. |
| Show | Request a named architectural perspective or supporting detail. | May need new analysis; apparent uniformity is not proof of a uniform capability. |
| Explain | Clarify a selected concept, claim, or mechanism. | Explanation may require further evidence; inferred rationale stays qualified. |
| Compare | Examine selected accounts or alternatives under a stated concern. | Design fit and correspondence require analysis, not just side-by-side presentation. |

The perspective/content vocabulary is richer than the verbs: purpose,
responsibility, ownership, state transitions, interaction, contract, notifications,
and lifecycle. Some labels may overlap or be subdivisions of others. The exercise
has not established a complete taxonomy. Adding a noun to `show` must not become
a way to assume any desired capability without specifying its result.

Two distinct gaps recur. One is **generating candidate alternatives**, as opposed
to inspecting known ones. The other is **expressing human intentions**: introducing
a proposal, setting scope, revising a promise, and endorsing a direction. Neither
gap proves conversation essential; forms, examples, or a structured design
vocabulary could help. This pass has not established their sufficiency. Read-only
investigation views do not themselves authorize an architecture editing interface.

No dedicated `expand detail` command was needed yet: selecting a more specific
aspect and showing or explaining it served those steps. Whether to distinguish
expansion from new investigation in the UX remains open. Evidence, qualification,
original-answer access, and correction visibility accompany the operations;
navigation history is left as supporting UX rather than a separate experiment.

## Relationship to actual PostCode support

The [capability reference](../../docs/capability-reference.md) supplies the baseline.
Current module summary and retained-investigram explain/decompose/examine operations
can contribute qualified accounts and deeper investigation. Their exact subject
and operation contracts are narrower than this sketch. Mechanical module and
dependency results can support evidence; they do not supply these architectural
responsibilities or runtime interactions by themselves.

Exact retained-answer `present` supports redisplaying an earlier answer and frozen
support within the Session. It does not implement contexts, persistent perspective
selection, or correspondence among architectural accounts. Existing correction and
reconsideration machinery supports parts of the required revision experience.

Presentation work includes recognizable contexts/perspectives, selectable subjects
and claims, intelligible evidence and limitations, and original/revised/proposed
accounts that remain distinguishable. Additional capability to establish includes
issue-level and project-level framing, the relevant behavioral and contract
analysis, structured accounts and correspondence, and comparison of proposals.
The [structured-content decision](../../docs/decisions/structured-investigram-content.md)
permits the direction without establishing that machinery. Issue ingestion and
human-intent capture also remain assumptions or open design work.

The next discussion should assess whether these scenes convey useful questions
and answers, where `show` or `compare` hides too much, and which portion is worth
sketching more concretely. The opening orientation, the waiting correction, and
the return to ownership after considering notifications are useful checkpoints.
This pass supplies a sequence to critique; it does not demonstrate an improvement
over capable chat or command-only adequacy for the whole journey.

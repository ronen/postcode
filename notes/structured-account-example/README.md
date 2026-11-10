# Admission → trial → correction: complete illustrative results

Exploratory notes, 2026-11-10. These are authored examples of a **proposed** content
contract, not an adopted schema, supported API, or live investigator run. The initial
omission and its discovery are staged. The [working proposal](../structured-architectural-accounts-proposal.md)
remains provisional. The [earlier walkthrough](../structured-architectural-accounts-example.md)
explores a different partition with definition children; this pass deliberately uses
one investigram per coherent explanation to make the tradeoff concrete.

## Read the example

1. [Context and bindings](context-and-bindings.json): the investigation inputs,
   evidence registry, allocated identities, and expected retained selections.
2. [First result](first-result.json): ADMISSION-1, including explicit introduction of
   Closed, Open and Half-open, identifying descriptions and an incomplete admission account.
3. [Follow-up result](followup-result.json): TRIAL-1, the complete replacement
   ADMISSION-2, and qualified correction record K.
4. [Illustrative content contracts](contracts.md): what the investigator is being
   asked to supply, independently of rendering.
5. [Partial recovery statechart](recovery-state.svg) and
   [concurrent-caller sequence diagram](concurrent-callers.svg): rendered projections
   of that follow-up, with [traceability back to the data](diagram-traceability.json).

The JSON is intentionally complete, including repeated qualifications and unchanged
replacement content. The readable account/subject IDs are editorial aliases for
Session references, not names the investigator must guess or a persistence format.

## 1. Investigate Circuit breaker P

The precondition is a mechanical module reference M and an earlier orientation
account ORIENTATION-0 identifying Circuit breaker policy kind P and interpreting its
connection to M. The fixture supplies that qualified orientation; it does **not**
demonstrate how an initial real investigation discovers P.

The request concerns admission and state inspection under default recovery sampling.
ADMISSION-1 describes P and explicitly introduces three state-category subjects.
Half-open's submitted description says:

> A recovery state category of the Circuit breaker policy kind. Sampled work
> contributes to the decision to close or reopen the breaker; the category is not
> an individual execution or evidence of application health.

That item has a local key, the name “Half-open,” a classification, evidence references,
and `introduceRetainedSubject: true`. Its subject reference is initially the submission
local `half-open`; acceptance allocates S. The account's qualified `identifies S`
association makes the description discoverable as identifying support. The description
remains account content, rather than becoming an authoritative field on S.

The admission table says Closed admits ordinary work, Open after its recovery delay
starts a trial, and Open before that delay refuses work. **Those cases are not the
mistake; the claim that they cover admission in this scope is.** Waiting during an
occupied trial is missing. A merely partial table without that coverage claim might
warrant an addition rather than a correction.

For this pass all six content items belong to one investigram. Their local keys make
them addressable within content; they do not make them independently correctable
investigrams. No child investigrams are returned.

## 2. Select Half-open S and investigate concurrent callers

The follow-up receives S, its identifying account, and the **complete own content of
ADMISSION-1**, including qualifications and structured parts. This establishes the
intended correction-target eligibility. An index entry or a small excerpt would not.
The fixture records an explicit originating answer because this particular selection
came from it; an origin-free request must not fabricate that history.

TRIAL-1 reuses S, P and the other state identities. It introduces:

| ID after acceptance | Meaning |
| --- | --- |
| R | One shared breaker instance role in the scenario, not an observed runtime object |
| E-trial | The execution occupying the single trial slot |
| E-caller | A concurrent execution using the same breaker |
| W | The architectural relationship of that execution waiting for the recovery decision |

The account contains their identifying descriptions, architectural relationships,
explanatory prose, a partial state model, and an interaction with two outcomes.
This is one qualified explanation with multiple forms, not a requirement that every
item have its own investigram or every architectural relationship have a subject ID.
W is promoted explicitly here to exercise that option.

The retained behavioral content says:

- An execution request finding Open after the delay enters Half-open and occupies
  the trial slot. Elapsed time alone is not the transition trigger.
- A concurrent execution waits while the trial slot is occupied. Its supplied work
  has not started; “waiting” is its progress, not another breaker state.
- A trial counted successful closes the breaker and releases the waiter to recheck
  admission. In this scenario it then runs ordinary work.
- A trial counted failed reopens the breaker and also releases the waiter to recheck.
  In the illustrated failure branch the new delay is positive and still unelapsed,
  so the waiter is refused. Release alone does not guarantee admission.

These are qualified interpretations of the
[pinned Cockatiel source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts),
not observed executions. They cover default single-trial recovery, excluding
cancellation, isolation, restored state, non-default sampling and interfering state
changes. “Success” is the breaker's classification, not application success: an
unhandled error can count as recovery success while still reaching its caller.

## 3. Return a complete replacement and a separate organizing claim

The follow-up returns ADMISSION-2 with the missing Half-open admission cases. It
also repeats the unchanged state descriptions, orientation and inspection content.
Those descriptions now reference existing S/S-open/S-closed; they do not allocate
new subjects. This deliberately exposes the duplication cost of correcting a large
investigram. Definition children would reduce that copying, but add separate
qualification, support and selection obligations; this example does not settle that
tradeoff for all investigations.

K is a **qualified account-relationship record** with these concrete fields:

| Field | Value |
| --- | --- |
| Kind | correction |
| Reporter | TRIAL-1 |
| Target | ADMISSION-1 |
| Replacement | ADMISSION-2 |
| Affected subject | P |
| Reason | The claimed admission coverage omitted waiting during an occupied trial |
| Support | The earlier account and the source supporting waiting/recheck behavior |
| Qualifications | The static basis and bounded recovery scope stated on K itself |

K is outside account content because it organizes retained accounts; W is inside
TRIAL-1 because it describes the architecture. Neither is an unsupported bare edge.
The metadata label does not exempt K's reason or source claims from qualified
analysis and exposure accounting. A revised reporter would not silently revoke K.
Challenging a correction relationship and undoing its effects remain open design work.

The submission's `accounts` array is a construction pool: one result root and an
accompanying correction replacement. It is not a proposal for multiple independent
result roots. The reporter and replacement are disjoint, childless trees. Allocation
and local-reference resolution must be atomic; spelling out the actual application
contract remains future design work.

## 4. Retain history and choose what to supply

The context ledger gives three expected selections:

- **ANSWER-1**, captured before K, retains ADMISSION-1 and its original support.
  Exact retrieval must not substitute ADMISSION-2 or a newer identifying description.
- **FOLLOWUP-ANSWER-1** supplies TRIAL-1, ADMISSION-2 and K, preserving original and
  replacement references and the attributed descriptions used for support.
- **A fresh admission answer** follows the correction to ADMISSION-2, exposes K,
  and supplies the relevant identifying descriptions for the new roles and W.
  Supplying those excerpts does not make the whole of TRIAL-1 an eligible correction
  target in a later dialogue.

These are expected outcomes of the proposal, not exercised application calls. Selection
does not merge the accounts into a canonical model. The old account remains available
as history; identifying descriptions remain attributed. A fresh selection's treatment
of competing correction chains, alternatives and inconsistencies is not tested here.
Nor does a reference or prior exposure establish substantive reliance. Existing
reconsideration rules must remain visible; this fixture does not claim they disappear
because the newly supplied explanation is correct.

## 5. What the diagrams establish

The statechart takes its state bearer, state names, directed transitions, triggers,
guards, effects and coverage from `trial.content.recovery`. It has no initial marker:
the supplied model is partial and deliberately does not specify initial construction.
The sequence takes participants, ordering, waiting, branches and resumption from
`trial.content.concurrent-callers`; transition events refer to the state model by
local keys. A renderer does not infer a state edge from prose or invent an outcome.

The diagram styles follow the statechart and sequence forms discussed in the SEI's
[Documenting Software Architectures: Documenting Behavior](https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf)
(§6.1.1 and §6.2.3), also indexed in the
[local architecture references](../initial-journey/architectural-concept-references.md).
They are limited probes of those forms, not full UML contracts. There is no composite
state, orthogonal region or general interaction algebra in this sample.

The committed [statechart source](recovery-state.mmd) and
[sequence source](concurrent-callers.mmd) were generated mechanically from the JSON.
The converter selects notation and layout only: nodes from states, edges from
transitions, arrows from request/response steps, notes from actions/wait/resume,
and branches from alternatives. The traceability file maps semantic elements to
JSON pointers and evidence references. Layout aliases such as `s0` are not subject IDs.
Qualifications and source references remain available alongside each diagram; a
standalone image is not the complete qualified account.

## Checks and unresolved design choices

Structural checks cover local and retained references, unique content keys, subject
allocations, evidence references available to each request, correction linkage,
state endpoints, interaction participants, cross-form transition references and
traceability pointers. The two diagrams were rendered with Mermaid CLI 12.0.0 and
visually checked. These checks establish internally resolvable examples and usable
diagram inputs, **not** semantic correctness, real agent reliability, or acceptance
by the implemented application. No application code or API was changed.

The next discussion should use this payload to decide:

1. Is repeating unchanged definitions an acceptable initial cost, or does useful
   independent correction justify children in this case?
2. Is qualified organizing metadata the right delivery/retention boundary for K,
   including its own support and effect on current selection?
3. Do these two specialized forms contain enough architectural meaning, with prose
   carrying interpretation and limitations, without prematurely designing a universal
   behavior schema?

Composition remains a design probe: another account could refer to P/R and add
wrapper-order or interaction claims, but must qualify that correspondence and cannot
silently fuse its states with this account. This sample does not demonstrate that
investigation. Initial discovery, origin-free retrieval, local/prose promotion,
subject merge/split, competing accounts and end-to-end Session validation likewise
remain unexercised. Human pushback and detailed reassessment stay outside this pass.

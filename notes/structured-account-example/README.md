# Admission → trial → correction: complete illustrative results

The current entity model uses `{introducedEntity: localKey}` for new architectural
entities and `{entity: ID}` for existing ones. PostCode resolves local keys to global
IDs at acceptance; there is no registration/promotion threshold. `entity-description/0`
provides qualified identifying content, not a definitive entity field. `subject`
continues to name a role in requests and associations. Exact `contentKey` associations
exercise both identifying descriptions and P's admission-behavior item, alongside
broader referring-account discovery. Existing account IDs, evidence, correction and
exposure semantics remain unchanged. Contextual-selection and entity-supersession
examples are [conceptual probes](../structured-architectural-accounts-example.md#entity-supersession-probe);
the executable checks do not implement those proposed operations.


Exploratory notes, updated 2026-11-11. These are authored examples of a **proposed** content
contract, not an adopted schema, supported API, or live investigator run. The initial
omission and its discovery are staged. The [working proposal](../structured-architectural-accounts-proposal.md)
remains provisional. The [earlier walkthrough](../structured-architectural-accounts-example.md)
explores a different partition with definition children; this pass deliberately uses
one investigram per coherent explanation to make the tradeoff concrete.

After review, the recommendation is to place descriptions of explicitly introduced
entities in identifying children by default when mixed with behavior. Grouped
descriptions and identification-only roots remain possible; local terms may stay embedded. The payloads retain the single-investigram
alternative so its costs remain inspectable; they are not the recommended default.
The revised support and exposure rules below apply to this alternative consistently.
The [children variant](children/README.md) now supplies complete paired submissions,
self-contained children, exact/fresh selections and ownership checks. Start there
for the recommended partition; this page remains the mixed-account comparison.

Start with the [compact diagram overviews and keyed legends](diagrams.md) for the
readability examples. Full meanings and qualifications remain alongside each picture.

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
and `introducesEntity: true`. Its subject reference is initially the submission
local `half-open`; acceptance allocates S. The account's qualified `identifies S`
association makes the description discoverable as identifying support. The description
remains account content, rather than becoming an authoritative field on S.

The admission table says Closed admits ordinary work, Open after its recovery delay
starts a trial, and Open before that delay refuses work. **Those cases are not the
mistake; the claim that they cover admission in this scope is.** Waiting during an
occupied trial is missing. A merely partial table without that coverage claim might
warrant an addition rather than a correction.

For this pass all content items, including the retained investigation offer, belong to one investigram. Their local keys make
them addressable within content; they do not make them independently correctable
investigrams. No child investigrams are returned.

## 2. Select Half-open S and investigate concurrent callers

ADMISSION-1 now returns the qualified `concurrent-callers-offer` item. The illustrative
Follow-up investigation request selects ADMISSION-1 and that exact key; the offer
resolves its architectural focus to S. The prose `informationNeed` documents its
meaning, not user input. See the [bounded offer chain](offered-followup.md) and
[access probe](offer-access.json) for qualification, provenance and replacement handling.


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
W is explicitly introduced as an entity here; other relationships can remain
structured content without an independent entity designation.

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
error not matched by the failure policy is recorded as recovery success and still
delivered to its caller.

## 3. Return a complete replacement and a separate organizing claim

The follow-up returns ADMISSION-2 with the missing Half-open waiting case. It
also repeats the unchanged state descriptions, orientation, inspection content and
qualified follow-up offer. Repeating the offer key does not retarget an old invocation.
Those descriptions now reference existing S/S-open/S-closed; they do not allocate
new subjects. This deliberately exposes the duplication cost of correcting a large
investigram. More importantly, an investigation receiving just its identifying
description still cites ADMISSION-1 and is exposed to its behavioral corrections.
A separate identifying child can be delivered and cited without its behavioral
sibling, avoiding that particular reconsideration path. This is about the cited
unit: splitting the receiving evaluation's outputs does not narrow their shared
exposure index. Children still add qualification, support and composition obligations.
The investigator can use explicit entity introduction as the signal of
expected reuse: when mixed with behavior, put those identifying descriptions in one
or more children by default. An identification-only root needs no extra wrapper;
local terms may stay embedded. This does not require forecasting later queries,
one child per subject, or semantic independence. The paired children variant now
exercises that recommendation, retaining this payload as the comparison.

The mixed partition also couples qualification scope: the state descriptions in both
ADMISSION-1 and ADMISSION-2 inherit the account-level default-sampling restriction,
even though that restriction is needed for their behavioral claims rather than for
state-category identification. Excerpting a description cannot remove that limit.
Separate identifying children allow independently supported descriptions to carry
their own applicable qualifications while admission behavior remains bounded. This
is a second benefit alongside the cited-unit benefit, not permission to broaden a
claim merely by moving it to a child.

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

K is a separate organizing record; W is architectural content inside TRIAL-1. Storage
and citation attribution are distinct: K's substantive reason and qualifications
are attributed to TRIAL-1 for exposure and evidence citation, preserving the current
correction rule. Receiving that explanation cites TRIAL-1, not K, but does not count
as receiving TRIAL-1's complete own content. Receiving bare K/endpoint IDs creates no
such exposure. The ledger gives concrete delivery/citation examples. Neither claim
becomes unqualified by its representation. A revised reporter would not silently revoke K.
Challenging a correction relationship and undoing its effects remain open design work.

The submission's `accounts` array is a construction pool: one result root and an
accompanying correction replacement. It is not a proposal for multiple independent
result roots. The reporter and replacement are disjoint, childless trees. Allocation
and local-reference resolution must be atomic; spelling out the actual application
contract remains future design work.

The general admission table binds two local roles per request: the requested execution
and its breaker instance (an instance of P). Its waiting relationship uses those local
roles, not R or W. A separate qualified illustration binds the roles to R/E-caller and
names W in TRIAL-1's scenario. This distinguishes a general claim from a particular
illustration while keeping their asserted correspondence inspectable. The example
binding remains qualified analysis; neither selection nor rendering establishes it.
No additional entity is needed for these item-local roles. `roles`,
`roleScope` and `illustrations` belong to the shared structured-content envelope,
not just the admission form. Use them when variables add meaning: the scenario state
item now references R directly instead of adding a redundant local name and treating
identity as an illustration. Identical role keys across items do not imply identity
or correspondence. The children variant separately reviews which qualifications apply
to its identifying accounts; the mixed account's broad envelope still qualifies its
embedded descriptions and must remain visible when they are excerpted.

## 4. Retain history and choose what to supply

The context ledger gives three expected selections:

- **ANSWER-1**, captured before K, retains ADMISSION-1 and its original support.
  Exact retrieval must not substitute ADMISSION-2 or a newer identifying description.
- **FOLLOWUP-ANSWER-1** supplies TRIAL-1, ADMISSION-2 and K, preserving original and
  replacement references. Current identifying support uses ADMISSION-2; ADMISSION-1
  is separately labelled historical context and the input actually received.
- **A fresh admission answer** follows the correction to ADMISSION-2, exposes K,
  and supplies the relevant identifying descriptions for the scenario illustration,
  including R, its executions and W. These support the illustration, not the general
  admission rule’s local-role identities.
  Those excerpts carry TRIAL-1's account qualifications and basis as well as item
  evidence/qualifications. Their delivery cites TRIAL-1 but does not make its whole
  account an eligible correction target in a later dialogue.

K's `affectedSubjects: [P]` states its claimed scope; it is not permission to preserve
selected items as unreplaced. Whole-account replacement also replaces embedded
identifying content, even when unchanged. Historical or explicitly selected original
descriptions remain available with their status; fresh support does not silently mix
them with current support. No authoritative definition is thereby established.

Request-time identity records the operation, subject, parameters and selected seed
context. Subsequent dialogue acquisitions are recorded in evaluation provenance;
they are not retroactively treated as inputs known when the request was dispatched.
Reuse of a prior result does not promise an identical new dialogue or discovery of
new retained context. The broader policy for refreshing/reusing investigations when
that context changes remains open; exact retained answers stay fixed.

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

The wait step explicitly cites the caller request and trial entry as causes, subject
to the slot still being occupied when that caller arrives. The sequence also includes
trial-work completion, outcome availability and classification
before the alternatives. Explicit `causedBy` references connect the outcome transitions
to that classification. Each resume/recheck cites its releasing transition, and
ordinary work/refusal cites that recheck. Ordinary sequence position alone is not a
causality claim, nor is a stated cause necessarily sufficient without the guard and
scenario conditions. In particular, release does not guarantee admission.
The existing action/response forms carry these events without a new universal event
type. Trial-work completion is distinct from final result delivery to its caller,
whose order remains omitted.

The state bearer directly references scenario subject R. The account describes P, so
a question about P can find this qualified scenario account; it cannot silently treat
it as a model of every instance/configuration. Shared role syntax permits a more
general model, but establishing its broader applicability remains an open extension. The outcome guard now says the completing
trial belongs to the current Half-open state: it expresses rejection of stale trial
updates, not an unexplained “same cycle” phrase.

Static cross-form review removed the separate “available Half-open slot” admission
case. Entry briefly creates Half-open before reservation, but the bounded account
abstracts the initiating request and reservation as one admission step. Reentrant
event-listener execution during entry is explicitly excluded throughout; it would
need separate analysis. This avoids claiming an additional ordinary admission case
without supplying its circumstances. This reading is grounded in `execute`,
`executeHalfOpen`, and the outcome-recording methods at the pinned source linked above.

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
JSON pointers and evidence references. Layout aliases such as `s0` are not entity IDs.
Qualifications and source references remain available alongside each diagram; a
standalone image is not the complete qualified account.

## Exact illustration access

The shared contract addresses an item by its exact account reference and content key.
The [access probe](illustration-access.json) postulates a later correction of TRIAL-1.
Fresh access can disclose that the illustrated account has a replacement, preserving
ADMISSION-2's original illustration target and leaving the particular item's revision
status unestablished. Matching content keys in replacement accounts do not establish
correspondence. Exact answers retain their captured status/context.

This gives useful disclosure for an explicit same-result content link without adding
exposure-based reconsideration, automatic reassessment or retargeting. Delivering the
target item's substantive content still cites its containing account. The same rules
apply to W’s descriptive link to its behavioral explanation; that link is not an
illustrative binding. A local occurrence can be designated for later
investigation without already having a shared general relationship identity.

## Checks and unresolved design choices

Structural checks cover local and retained references, unique content keys, subject
allocations, evidence references available to each request, correction linkage,
state endpoints, interaction participants, cross-form transition references, earlier
causal-step references, form-local role/illustration references, excerpt qualification
preservation, construction-pool ownership
and traceability pointers. These are not automatic checks of semantic consistency
between forms. The slot/entry issue was examined manually against the source; the
example deliberately retains ADMISSION-1's staged error, so validation must not be
described as certifying every claim. The two diagrams were rendered with Mermaid CLI 12.0.0 and
visually checked. These checks establish internally resolvable examples and usable
diagram inputs, **not** semantic correctness, real agent reliability, or acceptance
by the implemented application. No application code or API was changed. The
[standalone fixture checker](check-fixtures.py) checks both partitions with Python 3,
including admission-local roles, direct state-bearer references, child ownership and exact item
addresses. The children variant has its own traceability pointers into its payload,
while reusing the identical behavioral diagrams.

The next discussion should use this payload to decide:

1. Review the completed children variant's grouping, self-contained qualifications,
   ownership and unchanged identifying support when only a behavioral sibling is
   corrected. Its authored fixtures and malformed-input probes exercise the
   recommendation; they do not establish product acceptance or agent reliability.
2. Is retaining K separately while citing its reporter sufficient for the first
   capability? It preserves the current exposure rule; independent relationship
   citation, challenge and revocation remain deferred.
3. Do these two specialized forms contain enough architectural meaning, with prose
   carrying interpretation and limitations, without prematurely designing a universal
   behavior schema?

Composition remains a design probe: another account could refer to P/R and add
wrapper-order or interaction claims, but must qualify that correspondence and cannot
silently fuse its states with this account. This sample does not demonstrate that
investigation. Initial discovery, origin-free retrieval, contextual selection and subsequent entity introduction,
entity merge/split, competing accounts and end-to-end Session validation likewise
remain unexercised. Human pushback and detailed reassessment stay outside this pass.

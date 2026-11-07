# Cockatiel: information consulted and human judgment

Recorded: 2026-11-07
Status: exploratory companion pass; not an implementation plan or chosen UX

## Purpose and reading convention

This pass preserves the sequence and numbering of the
[human + PostCode walkthrough](cockatiel-human-postcode-walkthrough.md). Each step
links to its full verbatim human turns and concept selections there. That document
remains unchanged as a reference. Here we separate the information consulted,
PostCode's contribution, and the human reasoning it supports. We do not reconstruct
a more natural order yet.

The human pointed out that some original questions would be answered by drawing
their own conclusions from PostCode's accounts. They also observed that prominently
available information could change the sequence: the operating model might be
consulted well before step 6. Holding the order fixed tests information needs, not
likely navigation behavior. It is acceptable for a turn to involve no new request.

**PostCode contribution** below means proposed useful account content, including
qualified interpretation and analysis. It is not a claim of implemented capability.
**Recorded human judgment** identifies a proposal, preference or endorsement
expressed in the original dialogue. **Possible human reasoning** is this author's
reconstruction, not a transcript of the human's thoughts or a prediction of what
another human will conclude. Learning a fact need not be recast as a design choice.

The division is not “PostCode supplies facts; humans do all reasoning.” Explaining
behavior, identifying a counterexample and assessing a proposed contract can be
valuable architectural analysis. But the human can also reason from those accounts
without requesting that PostCode produce the conclusion as another answer. If a
human supplies their conclusion, record it with that provenance; do not silently
promote it into PostCode's independently supported analysis.

## Basis and assumptions

Cockatiel content comes from the [working account](cockatiel-working-account.md)
and original dialogue, at revision `f48bea55022ab15ab07eb52a79bfc1e661300fd4`,
issue #111 read on 2026-10-14. This pass adds no code inspection, execution or
PostCode inference. Original static interpretations, reported experiences,
corrections and unresolved cases retain their qualifications.

The [concept references](architectural-concept-references.md) continue to ground
context, responsibility, ownership/access, contract, state, interaction and
rationale. Evidence inspection and exact-answer operations are supporting actions.
Assume choices are discoverable and the human can use them. Supplying hypothetical
designs or intentions remains possible through an unspecified mechanism. Neither
the entry mechanism nor a natural navigation sequence is being designed here.

<a id="orientation"></a>
## 1. What Cockatiel is for

[Original step 1 and question](cockatiel-human-postcode-walkthrough.md#orientation)

**Information consulted:** the application/library context and responsibilities.

**PostCode contribution:** explain that the application owns preparation and the
business job lifecycle; Cockatiel governs supplied operations through resilience
policies. Distinguish bulkhead waiting from a background-job service, with support
for that boundary.

**Human reasoning:** primarily understanding, rather than a design decision. The
human can place the issue in that operating context. They need not infer the
boundary from source or a module inventory.

**Review point:** this explanatory account is a substantive requirement. Whether
it appears at entry or is opened here is a later sequence question.

<a id="readiness"></a>
## 2. Proposing readiness and considering reservation

[Original step 2, exchanges 2–3](cockatiel-human-postcode-walkthrough.md#readiness)

**Information consulted:** execution/admission behavior, preparation ownership and,
if useful, a supplied candidate contract.

**PostCode contribution:** explain what current inspection and execution do and
when conditions can change. If comparing hypothetical observation and reservation,
make their different effects explicit. A bare readiness proposal does not already
specify whether checking changes state, reserves permission or starts work.

**Recorded human judgment:** propose a readiness facility and agree to explore an
advisory check. The explanation offered for that agreement included a mistaken
assumption about Cockatiel managing background jobs.

**Possible human reasoning:** a snapshot may be enough to avoid some wasted
preparation; reserving permission may be unnecessary. The human decides whether
that weaker promise serves their purpose. Correcting the ownership assumption
does not automatically invalidate the preference.

**Review point:** an accurate account can expose the distinction without knowing
what is in the human's head. A silent misunderstanding is not automatically
available for PostCode to diagnose.

<a id="scope"></a>
## 3. Other mechanisms and fit with the library

[Original step 3, exchanges 4–6](cockatiel-human-postcode-walkthrough.md#scope)

**Information consulted:** policy responsibilities, documented purpose, and the
contracts of known candidate mechanisms.

**PostCode contribution:** distinguish permission under a breaker from available
capacity or a health observation. Explain which responsibilities would be added
by a supplied probe or broader readiness proposal. Keep documented purpose separate
from inferred product boundaries; a purpose statement does not mechanically decide
what extensions belong.

**Recorded human judgment:** raise generalization as a possibility, rather than
commit to supporting every readiness mechanism.

**Possible human reasoning:** a related concept might merit a shared facility,
but additional responsibilities may not serve this issue. Whether that expansion
is desirable belongs to the human's scope judgment.

**Review point — discuss:** the original conversation supplied alternatives the
human had not named. Here we can reuse that candidate set, but must attribute its
origin. Discovering alternatives would be a separate PostCode contribution; it
cannot be hidden inside “show responsibility.” The human could also bring candidates
from their own architectural knowledge. This pass does not establish which route
is sufficient for a future newcomer.

<a id="preference"></a>
## 4. Choosing conservative scope

[Original step 4, exchange 7](cockatiel-human-postcode-walkthrough.md#preference)

**Information consulted:** the accounts already seen; no new selection is required.

**PostCode contribution:** remain available as reference. If the human supplies
their preference, retain it with its origin and scope for later use.

**Recorded human judgment:** address the immediate need, fit existing capabilities
and allow growth without implementing unrequested features.

**Review point:** this is a human contribution, not a question PostCode must answer.
Opening a rationale account merely to read back a just-expressed preference would
be an unnecessary step. Later recall may be useful; capture is not endorsement by
PostCode or the Cockatiel maintainers.

<a id="waiting"></a>
## 5. Comparing bulkhead and breaker readiness

[Original step 5, exchange 8](cockatiel-human-postcode-walkthrough.md#waiting)

**Information consulted:** component contracts and interactions under load/recovery.

**PostCode contribution:** make starting, waiting and refusal explicit. Bulkhead
waiting concerns capacity; in the default single-trial breaker case, callers can
wait for a recovery outcome and later be refused. Preserve the correction to the
earlier normal/trial/blocked account and the limits on configurations examined.
A behavioral comparison may state supported similarities and differences.

**Possible human reasoning:** both mechanisms regulate progress, but that does
not yet make a common readiness promise useful or well-defined. The human can
consider unification without PostCode supplying a verdict that it makes sense.

**Review point — discuss:** do these accounts make the differences clear enough
for that judgment, or does the human need a more explicit comparison? Side-by-side
placement is presentation; a new semantic comparison is analytical content.

<a id="operating-model"></a>
## 6. Understanding policy objects and composition

[Original step 6, exchanges 9–11](cockatiel-human-postcode-walkthrough.md#operating-model)

**Information consulted:** the operating interaction, state/resource ownership,
policy family and ordered composition.

**PostCode contribution:** explain reusable policy instances, application-supplied
operations, eventual outcomes and per-call versus shared state. Show that wrapping
retains component instances. Explain both ordering cases: capacity held while
waiting for recovery, or an admitted trial waiting for capacity.

**Human reasoning:** the immediate task is comprehension. The human can then use
this model to recognize why composition order may matter to a proposed query.
Those consequences should not require decoding source-language objects.

**Review point:** this is likely useful earlier, but we preserve its position for
this pass. It also demonstrates a need for connected accounts: responsibilities
alone do not communicate the operating model.

<a id="acceptance"></a>
## 7. Choosing what an acceptance query should promise

[Original step 7, exchanges 12–14](cockatiel-human-postcode-walkthrough.md#acceptance)

**Information consulted:** current admission, waiting, state and outcome accounts;
optionally, comparisons of supplied contract candidates.

**PostCode contribution:** distinguish immediate start, acceptance to wait and
eventual execution/success. Explain available state and refusal information, and
that a last failure describes prior experience rather than present health. If
analyzing a supplied query, identify races and unresolved conditions.

**Recorded human judgment:** suggest a query on a policy, then consider acceptance
including queueing and an explanation accompanying a negative result. These are
candidate design commitments, not conclusions forced by existing APIs.

**Possible human reasoning:** including waiting better matches the application's
concern; reasons may help it respond appropriately. The human might reach these
ideas from current-behavior accounts before supplying any hypothetical design.

**Review point — discuss:** do not require hypothetical analysis merely because
the human is thinking about a design. It becomes a distinct contribution when
PostCode is asked to assess that proposal's consequences or consistency.

<a id="need-check"></a>
## 8. Assessing whether the proposal addresses the reported need

[Original step 8, exchange 15](cockatiel-human-postcode-walkthrough.md#need-check)

**Information consulted:** the reporter's obstacle, implemented transition behavior
and the candidate query's meaning.

**PostCode contribution:** explain the state-only gate and which proposed behavior
would allow an eligible trial to be recognized before preparation. A qualified
scenario assessment can expose a missing condition or contradiction. It cannot
establish a verified fix without further evidence.

**Possible human reasoning:** compare those accounts and judge that the proposal
appears to address the stated obstacle, while accepting that later execution may
still refuse. The original question requested confirmation; it does not record
that this independent reasoning occurred.

**Review point:** both routes are legitimate: the human makes the comparison, or
requests a PostCode assessment. Neither should silently turn plausibility into
validation of the reporter's application.

<a id="component-access"></a>
## 9. Access to a wrapped breaker

[Original step 9, exchange 16](cockatiel-human-postcode-walkthrough.md#component-access)

**Information consulted:** component identity, retained references and caller access.

**PostCode contribution:** explain that an application assembling the composition
can retain its breaker; a caller given only a protected operation need not have
access. Distinguish what wrapping permits from what a particular application
actually exposes.

**Possible human reasoning:** component-specific inspection may serve some callers;
others could benefit from an exposed common facility. This does not establish the
need for one.

**Review point:** the question asks about a “typical application.” The available
account establishes possible arrangements, not their prevalence. A product choice
should not rest on an unexamined claim about typical usage.

<a id="generic-interface"></a>
## 10. Generalizing to the policy interface

[Original step 10, exchanges 17–18](cockatiel-human-postcode-walkthrough.md#generic-interface)

**Information consulted:** the whole relevant policy family, component contracts
and ordered waiting behavior; optionally the supplied common-query contract.

**PostCode contribution:** expose retry, timeout, fallback and no-op as well as
breaker/bulkhead. Explain that present component conditions do not predict all
conditions after waiting. If evaluating the proposed contract, supply a concrete
qualified counterexample or unresolved case rather than just a generic caution.

**Recorded human judgment:** propose a common interface on the premise that its
meaning is well-defined, then ask about the newly revealed additional policy types.

**Possible human reasoning:** reconsider whether the proposed meaning works across
the family and composition. That reconsideration is not itself recorded as an
explicit rejection at this point; the human might refine, narrow or retain the idea.

**Review point — discuss:** PostCode should be able to challenge an unsupported
premise through analysis. The human remains responsible for whether a qualified
shared contract is worth pursuing. Calling that a human decision must not excuse
an account that conceals important contrary behavior.

<a id="outcomes"></a>
## 11. Understanding existing failure reporting

[Original step 11, exchange 19](cockatiel-human-postcode-walkthrough.md#outcomes)

**Information consulted:** execution outcomes, notifications and their composition.

**PostCode contribution:** explain pending work versus failure, local versus final
outcomes, handling by outer policies and selected failure-valued results. Make
clear that breaker admission refusal is not its normal operation-failure event
path. These are substantive behavioral answers, not judgments to outsource to
the human.

**Possible human reasoning:** use existing reporting conventions when considering
query results, without assuming a new query must reproduce them exactly.

**Review point:** no separate design verdict is required at this step.

<a id="stored-state"></a>
## 12. Understanding stored state and considering the existing rationale

[Original step 12, exchanges 20–21](cockatiel-human-postcode-walkthrough.md#stored-state)

**Information consulted:** states, triggers and elapsed-time conditions, the
reported application interaction, and any rationale support.

**PostCode contribution:** explain why stored open can coexist with trial
eligibility and how an execution triggers transition. Separate supported mechanism
from hypotheses about work-driven recovery or avoiding idle timers. The original
investigation did not establish maintainer intent.

**Possible human reasoning:** recognize what the query would add beyond stored
state; judge whether the inferred benefits of lazy transition are worth retaining.
The human can infer the application's blocking loop from connected accounts,
although PostCode may usefully explain it explicitly.

**Review point:** “why does it happen?” is a behavioral question; “why was it chosen?”
needs rationale evidence; “is that a good reason?” also calls for judgment. One
selection labelled rationale must not collapse all three.

<a id="trial"></a>
## 13. Understanding half-open and choosing whether a query acts

[Original step 13, exchanges 22–23](cockatiel-human-postcode-walkthrough.md#trial)

**Information consulted:** half-open state meaning, trial interaction and ownership
of supplied work; optionally proposed query effects.

**PostCode contribution:** explain that the trial uses ordinary application work,
that eligibility is not a running trial or proof of recovery, and that other calls
can wait in the recorded single-trial case. For a supplied observational query,
explain that observation reserves nothing and multiple callers may prepare work.

**Recorded human contribution:** ask whether a query initiates a trial or merely
reports willingness. The question does not itself settle that choice.

**Possible human reasoning:** favor observation because preparation and execution
remain under application control. If a query is intended to initiate work instead,
that is a different promise needing explicit analysis; PostCode should not silently
define all “queries” to satisfy the preferred design.

**Review point:** established behavior is necessary information; the intended
side effects of a new facility are a human design choice.

<a id="reporter-evidence"></a>
## 14. Checking what the reporter actually said

[Original step 14, exchange 24](cockatiel-human-postcode-walkthrough.md#reporter-evidence)

**Information consulted:** the retained issue evidence and its attribution.

**PostCode contribution:** accurately expose the report that the external timing
workaround worked but was clumsy. Preserve the distinction between reported
experience, our static interpretation and an unperformed reproduction.

**Possible human reasoning:** library support may principally simplify or better
encapsulate an already workable approach. Whether that justifies the addition is
not answered by the reporter's statement alone.

**Review point:** this is evidence access, not a new architecture perspective or
an occasion to infer more than the report establishes.

<a id="timer"></a>
## 15. Distinguishing recovery delay from an automatic transition

[Original step 15, exchanges 25–26](cockatiel-human-postcode-walkthrough.md#timer)

**Information consulted:** implemented and proposed transition conditions, plus the
earlier wording and its correction.

**PostCode contribution:** show execution-triggered elapsed-time checking versus
a scheduled open-to-half-open transition. Explain that the proposed transition
starts no trial and establishes no successful recovery. Keep the reporter's
suggestion distinct from this more specific candidate interpretation.

**Human reasoning:** principally understanding the actual difference. The human
can then judge whether moving the trigger addresses the opportunity they see.
They should not have to derive the mechanism from the word “delay.”

**Review point:** the selected account should resolve the factual ambiguity.
Calling it human reasoning would not excuse an unclear explanation of time,
state and action.

<a id="notifications"></a>
## 16. Considering notification rather than querying

[Original step 16, exchanges 27–28](cockatiel-human-postcode-walkthrough.md#notifications)

**Information consulted:** current state/event contract; proposed transition
behavior; optionally candidate interactions under a notification concern.

**PostCode contribution:** explain existing transition events and the absence of
an event merely on delay expiry. Analyze how an automatic transition could provide
notification. Qualify the polling premise: incoming requests could prompt a query
without a separate polling loop. No notification starts application work.

**Recorded human judgment:** favor an event-based approach because a query could
lead the application to poll, and use that as a reason for a built-in timer.

**Possible human reasoning:** existing events plus automatic eligibility would
suit the desired coordination better than a query alone. The benefit depends on
application behavior and must be weighed against timer obligations.

**Review point — discuss:** PostCode can establish the conditional difference;
it need not select the preferred mechanism. The transcript does not establish
that the human explicitly weighed every timer cost before expressing this preference.

<a id="compatibility"></a>
## 17. Separating compatibility from timer semantics

[Original step 17, exchange 29](cockatiel-human-postcode-walkthrough.md#compatibility)

**Information consulted:** existing options and default behavior, proposed event
contract, and state/resource lifetime cases.

**PostCode contribution:** identify what opt-in changes and what remains unverified.
Expose unresolved ordering, duplicate transitions, isolation/reopening, restoration
and timer lifetime/process-liveness cases. Analyze compatibility if requested;
an available options mechanism alone would not prove it.

**Recorded human judgment:** distinguish preserving compatibility through optional
behavior from settling timer and event semantics.

**Possible human reasoning:** retain the direction while assigning those issues
to further design and verification. The final endorsement supports proceeding
with a direction, not a claim that each concern is resolved.

**Review point:** producing consequential concerns is useful expertise. A complete
design or a proof that the list is exhaustive is not required to reach this endpoint.

<a id="endpoint"></a>
## 18. Endorsing the direction and stopping

[Original step 18, exchange 30](cockatiel-human-postcode-walkthrough.md#endpoint)

**Information consulted:** already available comparison, qualifications and open
concerns. No new selection is necessary just to decide.

**PostCode contribution:** keep the accounts accessible. If the human records the
choice, retain it alongside its stated rationale and exact referenced accounts,
without implying agreement by others or implementation. A final recap is useful
if requested, not a required inference that PostCode has approved the design.

**Recorded human judgment:** endorse the opt-in automatic-transition direction
within the simulation and ask whether the journey is complete.

**Review point:** sufficiency for this human's next activity is a human stopping
judgment. The product need not certify that the architecture is settled. This
pass neither implements the proposal nor dispatches a handoff.

<a id="account-requirements"></a>
## What this changes about the account requirements

The account set remains provisional, but the pass makes its content more concrete:

| Account or coordinated information | What must be intelligible | Human use it supports |
| --- | --- | --- |
| Application/library context and operating model | Supplied work, responsibility boundary, reusable state, per-call progress and composition | Place the issue; notice relevant scope and control choices |
| Policy family, contracts and access | Coverage beyond breaker/bulkhead; observable outcomes and available component access | Consider where a proposed facility belongs |
| State and interaction | Stored state, conditions, triggers, waiting, concurrency and elapsed time | Understand recovery; test the meaning of an early query |
| Known proposals and qualified comparison, when requested | Changed promises, added responsibilities, cases that support or challenge them | Refine alternatives and choose among them |
| Supporting evidence, rationale and revisions | What is reported, interpreted, corrected, unknown or explicitly intended | Assess confidence; revisit reasoning without losing its basis |

These are content needs, not five prescribed panels or five new Lens definitions.
Some human reasoning can use several existing accounts without a dedicated
comparison result. Where PostCode asserts a new relationship or consequence,
that remains analysis requiring its own qualified basis. The human can compare accounts presented together; that arrangement does not
itself produce a supported PostCode comparison.

The human's silent conclusion creates no obligation to record an inferred mental
state. If supplied, that conclusion remains a participant contribution. Merely
viewing an account does not establish comprehension, reliance or acceptance.
Exact retained-answer support matters for returning to what was actually offered,
including corrections and selection snapshots, independently of what the human
made of it. Presentation must make conditions and distinctions legible enough
for reasoning; diagrams remain an option rather than a requirement of this pass.

The [existing capability limits](../../docs/capability-reference.md) still apply.
Moving judgment to the human does not deliver the missing cross-module operating
account, architectural subject navigation or qualified hypothetical analysis.
Conversely, a thought about a proposed design does not make hypothetical analysis
a prerequisite for every useful implemented-architecture account.

<a id="discussion-and-next-exercise"></a>
## Discussion points and whether another journey is needed

The most consequential review points are:

- **Steps 3 and 5:** whether the supplied context and behavioral distinctions give
  the human enough to assess scope/unification, and where candidate alternatives
  come from.
- **Steps 7 and 10:** when current-behavior accounts suffice for proposing a common
  contract, and when explicit analysis of that proposal is valuable for exposing
  counterexamples or missing conditions.
- **Step 16:** whether the state/event account provides the information needed for
  the human's notification preference, without PostCode selecting that preference.

This pass provides a provisional division of contribution across all original
turns. It suggests we have enough material to discuss initial account content;
it does not establish that the proposed accounts let a newcomer make progress
without conversational prompting.

**Recommendation for discussion:** review the cases above before producing another
full journey. If the remaining uncertainty is what these accounts should say,
refine them directly. If it is whether the available accounts suggest useful next
questions, a short hypothetical natural investigation would test a different
property: begin from the issue, make the operating model readily available, and
follow the information the human would actually choose. It need not reenact all
30 exchanges. That is a possible next exercise, not one performed or selected here.

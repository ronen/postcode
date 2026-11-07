# Cockatiel: information consulted and human judgment

Recorded: 2026-11-07
Status: exploratory companion pass; not an implementation plan or chosen UX

## Purpose and reading convention

This pass preserves the sequence and numbering of the
[human + PostCode walkthrough](cockatiel-human-postcode-walkthrough.md). Each step
links to its full verbatim human turns and concept selections there. That document
remains unchanged as a reference. Here each step has five parts:

- **Before:** the question, working understanding or intention at this point.
- **PostCode interaction:** subject/scope, desired information and a minimal
  operation; sometimes no new interaction is needed.
- **What PostCode shows:** concrete, qualified account content.
- **After:** a plausible change in understanding or ability to proceed, remaining
  uncertainty, and our assessment of what the information does or does not support.
- **Review point:** a design question or limitation worth examining together.

Before/after descriptions are reconstructions unless explicitly attributed to the
recorded dialogue. They do not claim that displaying an account caused the human
to understand, accept or rely on it. The after section can examine a tempting
inference as well as useful progress. A recorded proposal is evidence of what the
human expressed, not a complete account of their reasoning.

The working route emphasizes accounts of existing software and the reported need.
The human considers design ideas without necessarily supplying them to PostCode.
Hypothetical comparison is not required in these interactions; review points
identify where requesting it might add value. Optional capture of an intention
or proposal is distinguished from asking PostCode to analyze it. This is a
simplification for the exercise, not a restriction on PostCode's adopted scope.

The human observed that prominently available information could change the order:
the operating model might be consulted well before step 6. Holding the order fixed
tests information needs, not likely navigation behavior. Grouped steps are not
atomic requests, and later revisiting a question does not mean earlier content was
absent or necessarily understood. The route uses corrected accounts rather than
deliberately reenacting mistakes from the dialogue.

## Basis and assumptions

Cockatiel content comes from the [working account](cockatiel-working-account.md)
and original dialogue, at revision `f48bea55022ab15ab07eb52a79bfc1e661300fd4`,
issue #111 read on 2026-10-14. This pass adds no code inspection, execution or
PostCode inference. What PostCode shows below is illustrative account content,
not actual product output. Original static interpretations, reported experiences,
corrections and unresolved cases retain their qualifications.

The [concept references](architectural-concept-references.md) ground context,
responsibility, ownership/access, contract, state, interaction and rationale.
Evidence inspection and exact-answer operations are supporting actions. Assume
choices are discoverable and the human can use them. UI wording and controls
remain unspecified; the interactions state what is selected and requested.

Supplying hypothetical designs or intentions remains possible through an
unspecified mechanism if needed. The main route does not depend on it for analysis.
The human can compare and reason from accounts, while PostCode still supplies
substantive interpretation of existing architecture. Inferring behavior or
correspondence is analytical work, not a rendering operation. A supplied human
conclusion retains its provenance and does not become independently supported
PostCode analysis merely by being recorded.

<a id="orientation"></a>
## 1. What Cockatiel is for

[Original step 1 and question](cockatiel-human-postcode-walkthrough.md#orientation)

**Before:** I know little about Cockatiel. Is job submission its central purpose, or
one component of a larger system? The issue's application context and the library's
responsibilities are not yet clearly separated in my understanding.

**PostCode interaction:** From the issue, open the surrounding application/library
context; select responsibilities at Cockatiel scope. No proposal is supplied.

**What PostCode shows:** The application prepares work and owns its business job
lifecycle. Cockatiel applies resilience policies to application-supplied operations.
Its bulkhead can queue operations in memory while waiting for execution capacity;
that is not a background-job service. The responsibility boundary is supported by
the inspected documentation and implementation.

**After:** The human could now place the issue across an application/library boundary
and recognize why a resilience facility matters to preparation. This is an initial
orientation, not yet a complete operating model. The original dialogue's later
questions show that an early explanation did not settle all of that understanding.

**Review point:** This explanatory account is a substantive requirement. Whether
it appears at entry or is opened here is a later sequence question.

<a id="readiness"></a>
## 2. Proposing readiness and considering reservation

[Original step 2, exchanges 2–3](cockatiel-human-postcode-walkthrough.md#readiness)

**Before:** A readiness check seems promising. Would it merely report an opportunity,
or secure one? In the original dialogue the human favored an advisory check while
still associating Cockatiel with managing background jobs.

**PostCode interaction:** Select breaker inspection and execution contracts; follow
the supplied-work relationship to application ownership. Revisit the bulkhead's
queue responsibility if needed. The human keeps the readiness idea in mind; no
hypothetical query is submitted for analysis.

**What PostCode shows:** Current inspection reports information about policy state;
execution is where admission and work occur. Application preparation is separate
from that execution. Shared state and capacity can change between operations.
Cockatiel's queue is for waiting on capacity, not the business job lifecycle.

**After:** The human might infer that observing current conditions could avoid some
wasted preparation without securing later execution. In the dialogue they agreed
to explore that weaker promise. Our assessment: the boundary clarification helps,
but neither asynchrony nor queueing rules out reservation. Whether a weaker promise
is sufficient remains a design judgment, and the query's meaning is still unsettled.

**Review point:** An accurate account can expose the distinction without knowing
what is in the human's head. A silent misunderstanding is not automatically
available for PostCode to diagnose. Explicit analysis of a reservation proposal
would add value if its coordination obligations become consequential.

<a id="scope"></a>
## 3. Other mechanisms and fit with the library

[Original step 3, exchanges 4–6](cockatiel-human-postcode-walkthrough.md#scope)

**Before:** Is breaker-based readiness the only mechanism? If we introduce readiness,
should it cover others, and which would fit Cockatiel's purpose? These are questions
about possible scope, not a commitment to generalize.

**PostCode interaction:** At Cockatiel scope, open the policy responsibility catalog
and documented purpose. Select the breaker and bulkhead contracts. Keep possible
new mechanisms in the human's reasoning; do not request hypothetical comparison.

**What PostCode shows:** The breaker regulates attempts using failure/recovery state;
the bulkhead regulates execution capacity and waiting. These are different signals,
and neither by itself establishes present dependency health. The account identifies
the library's documented purpose and qualifies inferred boundaries of responsibility.

**After:** The human has grounds to consider whether a common concept is useful,
without assuming permission, capacity and health mean the same thing. They might
bring probes or health signals from architectural knowledge. In the original
dialogue, the agent introduced those alternatives; the displayed current accounts
do not establish that the human would independently generate that set. A broader
scope decision remains open.

**Review point:** The origin of alternatives is a real dependency, not something
hidden inside “show responsibility.” Reusing the earlier candidate list would be
consulting attributed material; generating new candidates or assessing their fit
would be an additional contribution. Discuss whether this simpler route is enough.

<a id="preference"></a>
## 4. Choosing conservative scope

[Original step 4, exchange 7](cockatiel-human-postcode-walkthrough.md#preference)

**Before:** The issue could grow into a broader readiness feature. I prefer a change
that addresses the immediate need, fits existing capabilities and leaves room to
grow without implementing unrequested features.

**PostCode interaction:** No new information request is required. Optionally supply
that scope preference as an intention to retain, without requesting analysis.

**What PostCode shows:** Existing accounts remain available. If the preference is
recorded, its attribution and scope are visible; no new technical conclusion is
needed merely to reflect it back.

**After:** The human has set a criterion for later judgment. This preference was
explicit in the original dialogue. It does not settle which mechanism fits best,
and PostCode has not adopted it as a Cockatiel maintainer requirement.

**Review point:** This is a human contribution, not a question PostCode must answer.
Opening a rationale account merely to read back a just-expressed preference would
be unnecessary. Later recall may be useful; capture is not endorsement.

<a id="waiting"></a>
## 5. Comparing bulkhead and breaker readiness

[Original step 5, exchange 8](cockatiel-human-postcode-walkthrough.md#waiting)

**Before:** Bulkhead also seems to expose capacity readiness. What does it actually
mean, and would that support unifying it with breaker readiness?

**PostCode interaction:** Select breaker and bulkhead as the subjects; open their
admission contracts and expand waiting interactions under load/recovery. Inspect
the earlier admission account's correction if relevant. No common-query proposal
is supplied.

**What PostCode shows:** Bulkhead calls can start, queue or be refused when capacity
is exhausted. In the default single-trial breaker case, other callers can wait
for a recovery outcome and later be refused. The earlier normal/trial/blocked
account omitted that waiting. Other recovery sampling configurations were not
worked through in detail.

**After:** Shared admission vocabulary might lead the human toward a common query.
The waiting details give them reason to distinguish immediate progress from
acceptance and eventual execution. Our assessment: the resemblance is a reasonable
lead, but it does not establish a common contract. Composition and the rest of the
policy family still matter; the human remains positioned to investigate, not to
regard unification as settled.

**Review point:** Discuss whether these accounts make the differences clear enough,
or whether an explicit comparison of existing behavior is needed. Side-by-side
placement is presentation; new semantic correspondence is analytical content.
Neither requires a verdict on the desirability of unification.

<a id="operating-model"></a>
## 6. Understanding policy objects and composition

[Original step 6, exchanges 9–11](cockatiel-human-postcode-walkthrough.md#operating-model)

**Before:** I still lack the theory of operation. Does the application queue jobs,
create manageable job instances, or use policy objects? How do breaker and bulkhead
work together?

**PostCode interaction:** Open the operating interaction at Cockatiel/application
scope, then ownership of state and resources. Select policy instances and expand
composition in each wrapping order. These are successive selections, not a required
single “theory of operation” command.

**What PostCode shows:** Applications create reusable policy instances, supply
operations and receive eventual values or errors. Breaker state and bulkhead
capacity can be shared across calls; individual execution progress is separate.
Wrapping retains component instances. With the bulkhead outside, capacity can be
held while waiting for recovery; the reverse order can admit a trial that then
waits for capacity. These are static accounts, not observed traces.

**After:** The human could form a more usable model of the library and recognize why
ordering matters. They are better positioned to reason about where a query belongs.
Learning that instances compose does not yet establish what a combined query
would promise, and the source-language object model need not be deciphered.

**Review point:** This is likely useful earlier, but we preserve its position here.
Responsibilities alone do not communicate the operating model; relationships
between the accounts are part of the information need.

<a id="acceptance"></a>
## 7. Choosing what an acceptance query should promise

[Original step 7, exchanges 12–14](cockatiel-human-postcode-walkthrough.md#acceptance)

**Before:** Could a policy answer “available now”? Perhaps “acceptable,” including
queueing, would better express what I need. Should a negative answer explain why?

**PostCode interaction:** On the existing policies, select admission contracts,
waiting behavior and exposed state/outcome information. Revisit already-open
accounts as needed. The query alternatives stay in the human's reasoning; no
hypothetical contract analysis is requested.

**What PostCode shows:** Immediate start, acceptance to wait and eventual success
are different. The existing accounts identify capacity exhaustion, recovery delay
and isolation, and describe available reporting. A last failure records past
experience rather than current dependency health. Conditions can change between
inspection and execution.

**After:** The human may prefer a promise that includes waiting and supplies reasons.
Those candidate choices were expressed in the dialogue. The accounts make the
choices intelligible; they do not force them or finish the result-type design.
A plausible interpretation of “acceptable” still needs conditions, especially for
compositions whose state changes while work waits.

**Review point:** Hypothetical analysis is not required just because the human is
designing. Its additional benefit would be checking a supplied promise for missing
conditions, races or contradictions, rather than restating the human's choice.

<a id="need-check"></a>
## 8. Assessing whether the proposal addresses the reported need

[Original step 8, exchange 15](cockatiel-human-postcode-walkthrough.md#need-check)

**Before:** I have a candidate query in mind. Would it address the reporter's original
problem, or have I drifted toward a different problem?

**PostCode interaction:** Reopen the issue's reported preparation/gating behavior.
At breaker scope, select stored state and the transition/admission conditions.
Compare those with the intended query mentally; do not submit the query for
PostCode to assess.

**What PostCode shows:** The reported application avoids preparation while stored
state is open. That can withhold the execution that would check elapsed recovery
time and initiate a trial. The report and supported breaker mechanism are distinct;
the application problem has not been reproduced.

**After:** The human might conclude that recognizing trial eligibility before
preparation addresses the stated obstacle. That is a conditional inference: it
depends on the proposed query having that meaning, and it guarantees neither later
admission nor success. In the original dialogue the human requested confirmation;
we have not observed them make this comparison unaided.

**Review point:** If this comparison is difficult, asking PostCode to evaluate the
proposal against the reported scenario could add useful scrutiny. Neither that
assessment nor the human's inference should become a claim of a verified fix.

<a id="component-access"></a>
## 9. Access to a wrapped breaker

[Original step 9, exchange 16](cockatiel-human-postcode-walkthrough.md#component-access)

**Before:** Would callers already have access to the breaker after it has been
wrapped with a bulkhead? That affects whether a component-specific facility is
practical.

**PostCode interaction:** Select the composition and caller boundary; inspect
component identity and access/ownership relationships. Expand the arrangements
where the caller assembles policies or receives only a protected operation.

**What PostCode shows:** An application assembling the composition can retain its
breaker reference. A caller supplied only a protected operation need not have
access. Wrapping permits both arrangements; it does not determine an application's
chosen access boundary or establish how prevalent either arrangement is.

**After:** The human could see that component-specific inspection can serve some
callers, while a common facility might help others. This is enough to keep both
possibilities in consideration. It does not justify a general interface based on
an unsupported assumption about “typical” applications.

**Review point:** The available account establishes possible arrangements, not their
prevalence. Product scope may need more usage evidence if typicality becomes a
deciding consideration.

<a id="generic-interface"></a>
## 10. Generalizing to the policy interface

[Original step 10, exchanges 17–18](cockatiel-human-postcode-walkthrough.md#generic-interface)

**Before:** The query seems meaningful for breaker, bulkhead and either wrapping order,
so perhaps it belongs on the generic interface. Are there other policy types I
have not considered?

**PostCode interaction:** Select the common policy family and its responsibilities;
expand execution contracts for other members. Revisit composed waiting behavior.
The proposed generic interface is not supplied for analysis in this route.

**What PostCode shows:** Retry, timeout, fallback and no-op also share the execution
model; they do not all regulate admission alike. Waiting separates present
component conditions from conditions when inner work actually executes. A negative
component snapshot therefore need not predict eventual refusal by the composition.
Coverage and qualifications remain explicit.

**After:** The human might recognize that the initial generalization covered too
little of the family, or promised too much about future execution. The original
proposal and surprise at other policies are recorded; a rejection at this point
is not. They could refine, narrow or retain the idea. Our assessment: information
supporting a shared vocabulary was not sufficient to establish a shared contract.

**Review point:** Do these existing-behavior accounts expose the difficulty clearly
enough? If not, analyzing the supplied contract against a concrete counterexample
could materially improve judgment. Keeping the decision human-owned must not
excuse concealing contrary behavior in PostCode's accounts.

<a id="outcomes"></a>
## 11. Understanding existing failure reporting

[Original step 11, exchange 19](cockatiel-human-postcode-walkthrough.md#outcomes)

**Before:** What do policies already provide to explain failure or blocking? I need
that picture before deciding what additional reporting a query should offer.

**PostCode interaction:** Select policy execution contracts: outcomes and notifications.
Expand how an inner failure is handled through the composition.

**What PostCode shows:** Waiting is pending execution. An operation eventually
yields a value or error; outer policies can handle inner failures. Selected return
values can count as policy failures without becoming exceptions. Events concern
local activity, and breaker admission refusal is not its ordinary operation-failure
event path.

**After:** The human could distinguish local refusal, waiting and the final caller
outcome, and use current conventions when imagining query results. Existing
reporting does not dictate the new query's shape. This step primarily answers a
behavioral question; a design verdict is unnecessary.

**Review point:** These are substantive answers for PostCode to explain. They should
not require the human to reconstruct behavior from an unfamiliar implementation
language merely because the subsequent design judgment is theirs.

<a id="stored-state"></a>
## 12. Understanding stored state and considering the existing rationale

[Original step 12, exchanges 20–21](cockatiel-human-postcode-walkthrough.md#stored-state)

**Before:** If breaker state is already inspectable, what would our query add? Why
does the breaker stay open until an attempt arrives, and is there a good reason?

**PostCode interaction:** On the breaker, expand state transitions and elapsed-time
conditions; follow the reported application interaction. Inspect rationale and its
support separately from the behavior. No query proposal needs to be supplied.

**What PostCode shows:** With an illustrative 30-second delay, stored state can
remain open at 31 seconds. Execution checks elapsed time and initiates the
transition/trial; reading stored state does not. The account explains the reported
state-only gate. Avoiding idle timers and work-driven recovery are inferred
advantages; maintainer rationale was not established.

**After:** The human could now articulate what an eligibility query adds beyond
stored state, and consider whether the inferred advantages of the current design
matter to them. The explanation supports a mechanism, not a proven history of why
it was chosen. A deeper rationale investigation might be needed if that history
would change the decision.

**Review point:** “Why does it happen?”, “why was it chosen?” and “is that a good
reason?” have different information and judgment needs. One rationale selection
must not collapse them.

<a id="trial"></a>
## 13. Understanding half-open and choosing whether a query acts

[Original step 13, exchanges 22–23](cockatiel-human-postcode-walkthrough.md#trial)

**Before:** I do not yet understand half-open. Would a query have to initiate a trial,
or merely indicate willingness to run one?

**PostCode interaction:** Select the half-open state; expand its interaction with
an arriving execution and concurrent callers. Follow the relationship to ownership
of trial work. Keep alternative query effects in the human's reasoning.

**What PostCode shows:** Half-open permits limited trials using ordinary
application-supplied work. Eligibility, a trial in progress and successful recovery
are different. In the recorded single-trial case, other calls can wait and then be
refused. The application supplies the operation; recovery is not autonomous repair
work performed just by inspecting state.

**After:** The human may see that reporting eligibility and initiating a trial would
be different promises, and favor the former. That preference remains a choice:
the original question alone did not settle it. The human might also infer that
several callers observing eligibility could all prepare work; whether this race
is acceptable is unresolved.

**Review point:** Clear trial semantics are required account content. If the human
needs confidence about races or effects of a specific query design, explicit
hypothetical analysis has a concrete purpose. Do not quietly define the proposal
as observational just because that is the preferred direction.

<a id="reporter-evidence"></a>
## 14. Checking what the reporter actually said

[Original step 14, exchange 24](cockatiel-human-postcode-walkthrough.md#reporter-evidence)

**Before:** This sounds much like the reporter's workaround. Did they say it was
sufficient but awkward, or did it still fail in some important way?

**PostCode interaction:** Select the reported need and inspect the retained issue
material supporting the workaround assessment, with attribution.

**What PostCode shows:** The recorded report says the external timing workaround
worked but was clumsy. That is an attributed report of experience, not our
reproduction or proof across configurations.

**After:** The human might view the opportunity as better library support for an
already workable approach. They can assess the value of simplification without
inventing an unmet correctness need. The report alone does not determine whether
a library addition is worthwhile.

**Review point:** This is evidence access rather than a new architecture perspective.
The source's scope must survive presentation; reporting sufficiency is not the
same as validating it.

<a id="timer"></a>
## 15. Distinguishing recovery delay from an automatic transition

[Original step 15, exchanges 25–26](cockatiel-human-postcode-walkthrough.md#timer)

**Before:** Did the reporter mean automatic transition to closed or half-open? I
thought Cockatiel already had a timer delay, so I may be misunderstanding what
would change.

**PostCode interaction:** At breaker scope, inspect transition triggers and effects,
then the reporter's recorded suggestion. Open the earlier timing explanation and
its correction. No new hypothetical comparison is requested.

**What PostCode shows:** The implemented recovery delay is checked on execution;
it is not a scheduled state-changing timer. Half-open permits a trial; recovery
outcomes govern the return to closed under the configured rules. The recorded suggestion concerns
automatic transitions. The correction explains why “timer expires” was misleading
about existing behavior; it does not claim a complete reporter-specified contract.

**After:** The human can distinguish having a delay from scheduling an action at
its expiry. They might formulate automatic open-to-half-open as the desired change:
eligibility changes, while work and demonstrated recovery still follow execution.
That specific formulation is design reasoning, not an existing behavior discovered
in the implementation. Its timer/event details remain open.

**Review point:** The current-behavior account must resolve the factual ambiguity.
Comparing an explicitly supplied transition design could later check its effects,
but understanding what is implemented should not depend on doing that analysis.

<a id="notifications"></a>
## 16. Considering notification rather than querying

[Original step 16, exchanges 27–28](cockatiel-human-postcode-walkthrough.md#notifications)

**Before:** There may already be transition events. If so, could notification avoid
making the application poll, and favor an automatic transition over a new query?

**PostCode interaction:** Select the breaker's notification contract and its
relationship to state transitions. Revisit which triggers cause transitions.
The human compares query and timer ideas without submitting either for analysis.

**What PostCode shows:** Existing break, half-open, reset and state-change events
report actual transitions. Delay expiry alone currently produces no transition
event. The account relates notification to execution-triggered recovery. Trial
work still comes from an application-supplied execution; notification and that
execution are distinct actions.

**After:** The human might infer that an automatic transition could reuse the event
facility to announce eligibility. The dialogue records a preference for events
because queries could lead to polling. Our assessment: that is a conditional
benefit, not a universal advantage—an application could query on incoming requests.
The displayed existing contract does not by itself prove how newly timed events
would behave or what they would cost.

**Review point:** Discuss whether the human has enough to prefer a direction.
Analysis of a supplied timer/event proposal could expose ordering or lifecycle
interactions that change the choice; merely restating “events avoid polling”
would add little. The transcript does not establish that every timer cost was
weighed before the preference was expressed.

<a id="compatibility"></a>
## 17. Separating compatibility from timer semantics

[Original step 17, exchange 29](cockatiel-human-postcode-walkthrough.md#compatibility)

**Before:** I see two concerns: preserving compatibility through optional behavior,
and defining the timer/event semantics. Which existing facilities and behaviors
would constrain that work?

**PostCode interaction:** At breaker scope, inspect configuration/default behavior,
state changes including isolation/reopening, event semantics and any available
restoration/lifetime account. Keep the opt-in timer proposal in mind; do not ask
PostCode to certify its compatibility or analyze its lifecycle yet.

**What PostCode shows:** The retained investigation identifies an options mechanism
as a plausible extension point, without verifying compatibility. Existing recovery
is lazy, and state/events have the meanings already examined. Isolation, reopening
and state restoration are relevant areas to inspect. This recorded basis does not
contain a complete account of their interaction with a new timer, or an implemented
timer's lifetime/process-liveness contract.

**After:** The human could separate a compatibility strategy from the remaining design
work, as they explicitly did in the dialogue. They may identify event ordering,
duplicate transitions, obsolete timers, restoration and lifetime as concerns. In
the actual conversation, the agent contributed that detailed list; the simplified
route does not establish that the human would derive all of it independently.
The direction can be worth pursuing without those questions being answered.

**Review point:** This is a strong candidate for useful additional hypothetical
analysis: connect a supplied timer design to lifecycle cases the human might miss.
Do not smuggle the original agent's timer risk analysis into a supposedly
existing-behavior-only display. A complete design is unnecessary for the endpoint,
but the source and coverage of the unresolved concerns matter.

<a id="endpoint"></a>
## 18. Endorsing the direction and stopping

[Original step 18, exchange 30](cockatiel-human-postcode-walkthrough.md#endpoint)

**Before:** The opt-in automatic-transition direction seems preferable for the
immediate need. Have I reached enough understanding to stop investigating for now?

**PostCode interaction:** No new request is necessary to decide. Optionally supply
the chosen direction and stated rationale for retention, referencing exact accounts
already consulted. This is capture of an intention, not hypothetical analysis.

**What PostCode shows:** Existing accounts and qualifications remain available.
If the choice is recorded, it is attributed to the human within this simulation;
it does not imply maintainer acceptance, implementation or a PostCode certification
that the design is complete.

**After:** The human explicitly endorsed the direction and asked whether the journey
was complete in the dialogue. In this reconstructed route, they could stop with a
direction suitable for further design, while remaining uncertain about timer and
event details and scenario validation. Reaching the same endorsement would not
prove equivalent understanding, particularly if the simpler route exposed fewer
risks than the conversation.

**Review point:** Stopping is the human's judgment of sufficiency for their next
activity. No final recap or new account is mandatory. The exercise implements
nothing and sends no handoff; later detailed investigation remains possible.

<a id="account-requirements"></a>
## What this changes about the account requirements

The simpler route relies on a provisional set of connected accounts:

| Account or coordinated information | What must be intelligible | Human use it supports |
| --- | --- | --- |
| Application/library context and operating model | Supplied work, responsibility boundary, reusable state, per-call progress and composition | Place the issue; notice relevant scope and control choices |
| Policy family, contracts and access | Coverage beyond breaker/bulkhead; observable outcomes and component access | Consider where a proposed facility belongs |
| State and interaction | Stored state, conditions, triggers, waiting, concurrency and elapsed time | Understand recovery; reason about an early query or changed trigger |
| Supporting evidence, rationale and revisions | What is reported, interpreted, corrected or unknown | Assess confidence and revisit the basis of understanding |
| Participant intentions, if supplied | What the human proposes or chooses, with attribution and exact references | Resume the investigation or explain a direction later |

These are content needs, not prescribed panels or Lens definitions. Interaction
is specified only as selecting subjects/scopes, desired information and supporting
operations. More detail may mean expanding a retained answer or requesting deeper
analysis; those actions must remain distinguishable. Diagrams are optional, while
legibility and visibility of consequential conditions are essential to evaluating
whether the accounts help.

The human can compare accounts and reason about new designs without requiring
PostCode to generate every conclusion. Where PostCode itself asserts a new
relationship or consequence, that remains analysis requiring a qualified basis.
Presentation beside other information does not itself produce a supported
PostCode comparison. Optional capture of a human proposal is likewise distinct
from evaluating it.

The main route has deliberately removed hypothetical comparison requests. It
therefore cannot simply inherit everything the original conversational agent
contributed. In particular, generation of alternative mechanisms (step 3) and
timer-specific risk analysis (step 17) need an explicit source if retained. Their
absence need not prevent an initial design direction, but can reduce the scope
or confidence of what the human is positioned to decide. These are consequential
limits to discuss, not failures to conceal to keep the journey moving.

The before/after commentary is our design analysis, not application telemetry.
The human's silent conclusion creates no obligation to infer or store a mental
state. If supplied, it remains a participant contribution. Viewing an account
establishes neither comprehension nor acceptance. Exact retained-answer support
preserves what was offered, including correction and selection snapshots,
independently of what the human made of it.

The [existing capability limits](../../docs/capability-reference.md) still apply.
Moving judgment to the human does not deliver missing cross-module accounts or
architectural subject navigation. Hypothetical analysis remains within adopted
scope, but it is not required simply because a human uses implemented-architecture
accounts to design something new.

<a id="discussion-and-next-exercise"></a>
## Discussion points and whether another journey is needed

The most consequential review points are:

- **Steps 3 and 5:** whether current responsibilities and behavior support the
  human's scope/unification reasoning, and where additional candidate mechanisms
  come from.
- **Steps 7 and 10:** whether existing accounts reveal enough to qualify a common
  contract, or whether analyzing the supplied proposal against a counterexample
  adds material value.
- **Steps 16 and 17:** whether existing state/events support choosing a direction,
  and what important timer interactions a human might miss without further help.

Each after section now exposes both possible progress and limits to that progress.
A selection-only route must not acquire the original agent's suggestions and
critiques invisibly. Equally, it need not reproduce every conversational contribution
to be useful: understanding enough to choose a direction for further investigation
can be a meaningful endpoint.

**Recommendation for discussion:** review these cases before producing another
full journey. If uncertainty concerns account content, refine the accounts directly.
If it concerns what a user would naturally examine and infer from what is visible,
a short hypothetical natural investigation would test something different: begin
at the issue, make the operating model readily available, and follow the information
the human actually wants next. It need not reenact all 30 exchanges. That remains
a possible next exercise, not one performed or selected here.

# Investigating Cockatiel through PostCode

Recorded: 2026-11-08

Status: exploratory interaction sketch

A human investigates an architectural change by using PostCode as an available
reference surface. They select subjects, architectural perspectives and detail;
PostCode presents connected accounts of the software. The human develops and
judges design ideas while consulting those accounts.

## Starting situation

The human has read [Cockatiel issue #111](https://github.com/connor4312/cockatiel/issues/111).
Its reporter describes an application
that prepares jobs, launches background work and acknowledges submissions.
An external service can fail, so the application uses a circuit breaker to protect
work involving that service. The reporter also wants to check the breaker before
spending effort preparing a job.

The obstacle is that checking the breaker's stored state can keep reporting
“open” even after its recovery delay. If the application keeps withholding work,
the execution that would move the breaker into recovery never arrives.

The human knows little about Cockatiel but brings software-design experience.
They have encountered **circuit breaker**, **CircuitBreakerPolicy** and
**CircuitState** in the issue. Their aim is to understand the relevant architecture
and choose a promising direction for addressing the need.

## Reading the script

The questions below are the human's thoughts. Interaction means selecting a
subject, choosing information such as responsibility, ownership, contract, state
or interaction, and following or expanding what appears. “PostCode shows” can
span an initial account and detail exposed through those selections. Accounts
remain available to revisit, with their qualifications and supporting evidence.
The particular controls, panel arrangement and use of diagrams are left open.

The human reads the issue separately. PostCode receives the Cockatiel repository
and the selected subjects and perspectives. The human relates its library accounts
to the application described in the issue and supplies their own design alternatives.
Optional recording of a preference or decision is indicated where relevant.

This is a plausible sketch, with illustrative PostCode results and assumed competent
presentation. The library descriptions derive from static documentation/source
inspection at revision `f48bea55022ab15ab07eb52a79bfc1e661300fd4`; the report was
read on 2026-10-14. Runtime behavior and the proposed change remain to be validated.
Two errors are deliberately included, followed by explicit correction notices.
Annotations identifying the initial errors are for readers of the script.

The [detailed exploration](cockatiel-information-and-judgment.md) records the basis
and design discussion. Everything needed to follow this episode is included here.

<a id="orientation"></a>
## 1. What is Cockatiel for?

**Before:** Is job submission central to Cockatiel, or part of an application that
uses it?

**Interaction:** Select the Cockatiel repository. Locate “circuit breaker” or
`CircuitBreakerPolicy`, inspect the match, and select its responsibility and
surrounding context. `CircuitState` is another available name lead.

**PostCode shows:**

- **CircuitBreakerPolicy** identifies the circuit-breaker policy;
  **CircuitState** names its state vocabulary.
- **Cockatiel** is a resilience library governing attempts to execute
  application-supplied work under failures, delays and capacity limits.
- **Application** supplies the work and owns its business meaning, job identity,
  preparation, acknowledgment and stored outcomes.
- **Policy** governs execution according to configured rules. Applications create
  policy instances, reuse them across operations and combine them.
- **Circuit breaker** withholds attempts after configured failures and later allows
  limited trials. **Bulkhead** limits concurrent execution and queues work in memory
  while capacity is occupied, refusing calls when execution and queue capacity are
  exhausted. **Retry** repeats selected failed operations. **Timeout** limits time,
  with stopping behavior dependent on configuration and cooperation. **Fallback**
  supplies an alternative after selected failure. **No-op** passes execution through.
- **Relationships:** the application supplies an operation to a policy; policies
  can combine around that operation. An illustrative operation calls an external
  service. The breaker learns from execution outcomes; permission to attempt work
  is distinct from evidence that the service is healthy.

**After:** I place the reported job lifecycle on the application side. Cockatiel
provides reusable execution controls. The named policies and relationships give
me subjects to explore.

<a id="readiness"></a>
## 2. Would a readiness check observe or reserve?

**Before:** A readiness check seems useful. Would it report an opportunity or secure
one for the job?

**Interaction:** Select Circuit breaker's inspection/execution contract. Follow
the supplied-operation relationship to ownership; revisit Bulkhead's queue role.

**PostCode shows:**

- Reading breaker state observes retained information; execution supplies work
  for the policy to govern.
- The initial breaker admission account lists three cases: **normal work allowed**,
  **recovery attempt allowed**, and **work blocked**.
- Bulkhead owns execution capacity and an in-memory waiting queue. The application
  owns its business jobs and work performed outside policy execution.
- State and capacity can change between inspection and execution. Inspection
  reserves neither permission nor capacity.

*Script annotation: the three-case breaker account omits waiting while a recovery
trial is occupied. Step 5 corrects this omission.*

**After:** I favor an advisory check that could save preparation while allowing
execution to refuse later. Its precise promise still needs thought.

<a id="scope"></a>
## 3. What other mechanisms might fit?

**Before:** Should readiness mean only breaker permission? What about a health probe
or other application conditions?

**Interaction:** Revisit Cockatiel's purpose and the responsibilities of Circuit
breaker and Bulkhead. Expand their state and capacity information.

**PostCode shows:**

- Breaker permission reflects failure/recovery rules and previously observed outcomes.
- Bulkhead capacity describes room to execute or wait.
- An application-supplied operation may contact an external dependency. A separate
  health signal would answer a different question from policy permission or capacity.
- The documented scope centers on resilience policies around supplied work. These
  accounts identify no general readiness or active-probe facility; their coverage
  is qualified rather than an exhaustive survey.

**After:** I generate alternatives using my own knowledge and this understanding.
Permission, capacity and health are distinct kinds of information. I can consider
which scope fits the immediate need and Cockatiel's role.

<a id="preference"></a>
## 4. Choose conservative scope

**Before:** I want to address the immediate need, fit existing capabilities and leave
room to grow as demand emerges.

**Interaction:** Continue with the breaker inquiry. Optionally record that preference
against it.

**PostCode shows:** The existing responsibility accounts remain available. If the
preference is supplied, it is retained as the human's stated intent.

**After:** I have a criterion for judging alternatives: a focused addition that fits
the library.

<a id="waiting"></a>
## 5. Compare breaker and bulkhead admission

**Before:** Bulkhead already has capacity information. Would it make sense to unify
that with breaker readiness?

**Interaction:** Select admission contracts for Circuit breaker and Bulkhead;
expand capacity and admission detail. The earlier breaker account remains available.

**PostCode shows:**

- **Bulkhead:** starts work when execution capacity is free; queues it when only
  waiting capacity remains; refuses it when both are exhausted.
- **Circuit breaker:** in the default single-trial recovery case, another caller
  can wait while the trial is occupied. The trial's outcome determines the later
  decision, which can still refuse that caller.
- **Correction notice:** “The earlier normal/trial/blocked account omitted waiting
  during an occupied recovery trial. Recovery eligibility does not mean every
  caller can start a trial immediately.” The notice identifies the earlier account
  and the corrected one, with the reason and supporting evidence accessible.
- **Different waiting commitments:** Bulkhead waits for execution capacity;
  the breaker caller waits for a recovery decision. Both calls remain pending.
- **Recovery subject:** half-open and its trial interaction are available for
  closer inspection. Other recovery sampling configurations remain outside this
  account's explored cases.

**After:** I learn that the earlier explanation was incomplete and can reconsider
any reasoning based on it. The shared start/wait/refuse vocabulary is useful, but
the waiting cases make a common promise less straightforward.

<a id="operating-model"></a>
## 6. How do policy objects and composition work?

**Before:** What is the overall operating model? Does an application create jobs,
policy objects, or something else? Can it combine a breaker and a bulkhead?

**Interaction:** Select Policy's interaction and ownership. Follow the combination
relationship and inspect both wrapping orders.

**PostCode shows:**

- **Application:** creates policy instances, chooses which calls share them and
  supplies operations.
- **Reusable policy instance:** carries configuration and shared state. A breaker
  retains failure/recovery state; a bulkhead retains capacity counts and its queue.
- **Individual execution:** runs supplied work through a policy, with its own
  progress and eventual value or error.
- **Combined execution:** the outer policy calls into the next. Component instances
  and their states remain distinct.
- **Bulkhead outside breaker:** work can occupy a bulkhead execution slot while
  waiting for the breaker recovery decision.
- **Breaker outside bulkhead:** a recovery attempt can be admitted by the breaker
  and then wait for bulkhead capacity.

**After:** I can distinguish reusable policy state from an individual operation.
Order affects what waits and which resources it holds. A combined readiness
answer would have to respect those interactions.

<a id="acceptance"></a>
## 7. What should “acceptable” mean?

**Before:** Perhaps “acceptable” is more useful than “available now,” since it could
include waiting. Should a negative answer explain why?

**Interaction:** Revisit admission accounts. Expand state/capacity inspection and
refusal information for the named policies.

**PostCode shows:**

- Bulkhead distinguishes room to start immediately from room to queue.
- Breaker recovery eligibility depends on elapsed delay as well as stored state.
- Manual isolation holds the breaker open separately from its ordinary recovery delay.
- Last-failure information describes previous failure, with its historical scope.
- Starting, waiting, later refusal and eventual outcome are distinct. Conditions
  observed now can change before the operation reaches a policy.

**After:** I consider a check that includes waiting and gives reasons. I still need
to decide what a positive answer promises and how much later uncertainty is acceptable.

<a id="need-check"></a>
## 8. Would that address the reported obstacle?

**Before:** The application in the issue withholds preparation while stored state
says open. Would a better readiness check help?

**Interaction:** Expand Circuit breaker's state meanings and transition conditions.
Compare them mentally with the issue read separately.

**PostCode shows:**

- Stored open state can persist after the recovery delay.
- An arriving execution checks recovery eligibility and can move the breaker into
  half-open to try the supplied work.
- Reading the stored state leaves it unchanged.

**After:** I connect the application's gate with the library's execution trigger.
Recognizing eligibility before preparation looks capable of addressing that
obstacle, while leaving later admission and success uncertain.

<a id="component-access"></a>
## 9. Can callers inspect a wrapped breaker?

**Before:** If policies are combined, does a caller still have access to the breaker?

**Interaction:** Select ownership/access on the composition model and expand its
caller arrangements.

**PostCode shows:**

- The caller assembling the policies can retain a direct reference to the breaker.
- A caller given only a protected operation may have access solely to execution.
- These are supported arrangements; evidence about their prevalence is unavailable
  in this account.

**After:** A breaker-specific facility can serve some callers. Whether a common
facility would be more useful depends partly on application boundaries.

<a id="generic-interface"></a>
## 10. Could every policy support the query?

**Before:** An acceptance query seems meaningful for breaker, bulkhead and both
wrapping orders. Could it belong on Policy's common interface?

**Interaction:** Select Policy's common execution contract, expand its six named
kinds and revisit the wrapping cases.

**PostCode shows:**

- The common role is governed execution of supplied work and reporting its outcome.
- Breaker and Bulkhead have admission restrictions based on state and capacity.
- Retry, Timeout, Fallback and No-op govern different aspects: repeated attempts,
  time limits, alternative outcomes and pass-through execution.
- An outer policy may delay reaching an inner one. A negative component snapshot
  taken beforehand need not predict final refusal by the combination.

**After:** I notice that a shared execution interface does not settle a shared
pre-execution promise. I can refine, narrow or retain the idea with those differences
in view.

<a id="outcomes"></a>
## 11. How is failure or blocking reported?

**Before:** Existing reporting conventions could inform the result of a new query.

**Interaction:** Select Policy's outcomes and notifications. Follow an inner outcome
through an outer policy to the final caller.

**PostCode shows:**

- Waiting leaves an execution pending. Admission refusal produces an identifiable
  refusal error; an operation that runs and fails is a different case.
- Configuration can classify thrown errors or returned values as unsuccessful.
  A classified return value can remain a value.
- An outer retry or fallback can respond to an inner failure before the final
  result reaches the caller.
- Policy-local events describe that policy's activity. Breaker admission refusals
  do not use its ordinary operation-failure event path.

**After:** I distinguish admission, progress and final outcome. Those existing
conventions inform my thinking about explanations without determining the new
query's result type.

<a id="stored-state"></a>
## 12. Why does the breaker stay open?

**Before:** Why leave the breaker open after enough time has passed? What would a
query add beyond reading its state?

**Interaction:** Revisit the open-to-half-open transition. Expand timing and triggers,
then inspect the evidence and qualifications attached to its rationale.

**PostCode shows:**

- The initial timing explanation says: “The transition into recovery happens when
  execution is attempted, not automatically when the timer expires.”
- Opening records a time and delay for a later execution's elapsed-time check.
- With an illustrative 30-second delay, the state can still be open at 31 seconds;
  an eligible execution can move it to half-open and supply a trial.
- Keeping recovery driven by incoming work avoids scheduling transitions solely
  because time passes. This is an inferred advantage; maintainer intent has not
  been established by the supporting material.

*Script annotation: “timer expires” misleadingly suggests a scheduled timer exists,
despite the surrounding clock-checking explanation. Step 15 corrects this wording.*

**After:** I understand the execution trigger and can consider its advantages.
However, the timer wording may leave me imagining an existing scheduled timer
whose effects could be changed.

<a id="trial"></a>
## 13. What does half-open actually mean?

**Before:** Would a readiness query start a trial, or just indicate willingness to
run one? What happens to other callers?

**Interaction:** Select half-open and expand its trial interaction, concurrent callers
and ownership of supplied work.

**PostCode shows:**

- Half-open permits limited recovery trials. A trial runs ordinary work supplied
  by the application.
- Eligibility and an executing trial are distinct. Trial outcomes determine recovery
  under configured rules: success can close the breaker; failure can reopen it.
- In the default single-trial case, other callers can wait for that outcome and
  then encounter its admission decision, including refusal.

**After:** Reporting eligibility and initiating work would be different promises.
I lean toward observation, while recognizing that several callers could prepare
work after observing the same opportunity.

<a id="reporter-evidence"></a>
## 14. Was the workaround sufficient?

**Before:** This resembles the reporter's own workaround. Did they say it failed,
or that it was awkward?

**Interaction:** Reread the issue outside PostCode. Keep the breaker accounts available
as a reference.

**PostCode shows:** The retained state and timing accounts remain available.

**After:** The reporter says an external elapsed-time workaround works but is clumsy.
I now see the opportunity as better library support for a reported workable approach.
That report is experience to consider, with broader validation still outstanding.

<a id="timer"></a>
## 15. Is there already a timer?

**Before:** The issue suggests eager state transitions. I thought Cockatiel already
had a timer delay—the earlier explanation said “timer expires.” What would change?

**Interaction:** Revisit Circuit breaker's transition triggers and expand the timing
mechanism, using the retained explanation as context.

**PostCode shows:**

- Opening records a time and recovery delay. An arriving execution checks elapsed
  time and can trigger recovery. The mechanism schedules no independent recovery timer.
- **Correction notice:** “The earlier phrase ‘timer expires’ misleadingly suggested
  a scheduled timer. The transition into recovery happens when execution is attempted
  after the recovery delay has elapsed.” The earlier explanation, corrected account,
  reason and supporting evidence are available to inspect.
- Half-open permits trial work. Closing depends on recovery under the configured
  rules; passing time alone does not demonstrate health.

**After:** I distinguish a delay from a scheduled action and revise my earlier
impression. An automatic open-to-half-open transition now looks like a concrete
possible change, with trial work still supplied by the application.

<a id="notifications"></a>
## 16. Could recovery be announced?

**Before:** If the breaker announced eligibility, the application might avoid polling.
Does it already have transition events?

**Interaction:** Select the breaker's notification contract and follow its associations
with state transitions.

**PostCode shows:**

- Existing events report breaking/opening, entering half-open, resetting to closed,
  and changes of stored state.
- The current execution-triggered transitions produce notifications. Delay expiry
  alone produces neither the recovery transition nor its notification.
- The application supplies trial work; a transition notification is separate from
  executing that work. Event ordering coverage is limited to the static account.

**After:** I favor exploring an automatic transition that uses the existing event
facility to announce eligibility. That could help an application waiting to resume;
other applications might instead query when new requests arrive.

<a id="compatibility"></a>
## 17. What remains to be worked out?

**Before:** Making the behavior optional could preserve existing behavior. What
constraints would matter to that design?

**Interaction:** Select Circuit breaker's configuration/defaults and lifecycle detail,
focusing on the already exposed isolation, reopening and transition behavior.

**PostCode shows:**

- An existing options mechanism is a plausible extension point. Compatibility with
  a particular new option remains unverified.
- Current default recovery is triggered by execution. Manual isolation and reopening
  are relevant existing state changes.
- The available account has incomplete restoration and lifetime detail. These gaps
  remain visible as subjects for further investigation.

**After:** I separate a compatibility strategy from the remaining design work.
I can ask how a proposed timer would interact with isolation, reopening and event
ordering, while leaving a fuller account of lifecycle constraints for follow-up.

<a id="endpoint"></a>
## 18. Choose a direction

**Before:** I have enough understanding to choose the next design direction.

**Interaction:** Optionally record the choice and rationale, selecting the exact
accounts that informed it.

**PostCode shows:** The consulted accounts remain available, including earlier
versions, corrections and qualifications. If supplied, the human's choice is retained
with its selected references and outstanding questions.

**After:** I choose to pursue an opt-in automatic open-to-half-open transition when
the recovery delay elapses, using the existing state/event model and preserving
current behavior by default. Detailed timer semantics, lifecycle constraints,
compatibility and validation against the reported scenario are the next work.

# Cockatiel: working account after the readiness investigation

Date: 2026-10-14
Version: first extraction from the completed investigation
Status: exploratory, non-governing; agent synthesis for review and reuse

## Basis and scope

This is a compact account of the understanding expressed in
[the first investigation](readiness-investigation-dialogue.md), exchanges 1–30,
as recorded at PostCode planning commit `97907b7`. It does not establish what
either participant remembers or fully understands. It is selective, and its
selection and wording can themselves need correction.

The investigation used Cockatiel revision
`f48bea55022ab15ab07eb52a79bfc1e661300fd4` and issue #111 as read on
2026-10-14. Its basis was documentation and static source inspection by the agent;
the human deliberately did not follow the evidence links. No runtime reproduction
or PostCode analysis supplied these results. This extraction adds no fresh
verification. Source links below are evidence cited by the original investigation.

The dialogue preserves the route, original answers and revisions. This account
makes the resulting understanding easier to consult; it does not replace that
record. “Current” below means the investigated revision, not today's upstream code.

<a id="operating-account"></a>
## What Cockatiel does and who owns what

Cockatiel is a resilience library. An application supplies an operation and asks a
reusable policy object to execute it under configured rules. The application
receives an eventual value or error. Cockatiel does not need to understand the
business meaning of the work.

The application creates and retains policy instances, decides which operations
share them, and owns business job identities, preparation, acknowledgments and
stored outcomes. A shared breaker carries failure/recovery state across calls; a
shared bulkhead carries running-operation counts and an in-memory waiting queue.
Individual executions have their own progress, such as retry attempts.
Cockatiel does not automatically group operations by the service they contact.

| Policy | Responsibility described in the investigation |
| --- | --- |
| Circuit breaker | Withhold attempts after configured failures, then permit limited recovery trials. |
| Bulkhead | Limit concurrency, optionally queue excess operations, and refuse when both capacities are exhausted. |
| Retry | Repeat operations after selected failures, optionally with delays. |
| Timeout | Apply a time limit; cancellation behavior depends on configuration and cooperation from the operation. |
| Fallback | Supply an alternative value or action after a selected failure. |
| No-op | Pass execution through. |

These are executable policy objects with a common execution contract, called
`IPolicy`. The implementation also has a class named `Policy` for configuring
which errors or returned results count as failures; that is a different use of
the name.

**Support:** [operating model](readiness-investigation-dialogue.md#operating-model),
[policy naming](readiness-investigation-dialogue.md#policy-object),
[policy family](readiness-investigation-dialogue.md#policy-family);
cited [README](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md)
and [policy API](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/Policy.ts).

<a id="composition"></a>
## How policies work together

Wrapping policies creates a combined executable object while retaining the
component instances and their separate states. One execution passes through them
in the specified order; each outer policy controls calls into the next.

Order matters. With a bulkhead outside a breaker, an operation can occupy bulkhead
execution capacity while waiting for the breaker. With a breaker outside a
bulkhead, a recovery attempt can be admitted and then wait for capacity.
A retry outside a breaker can call through that breaker on each attempt.

A caller assembling the policies can keep a direct breaker reference. A caller
given only a general protected operation need not have that reference. These are
application interface choices, not automatic consequences of wrapping.

**Support:** [composition](readiness-investigation-dialogue.md#combined-policy)
and [component access](readiness-investigation-dialogue.md#access-to-wrapped-breaker),
which cite the pinned policy API and README.

<a id="admission-and-recovery"></a>
## Admission, waiting and recovery

Starting immediately, being accepted to wait, and eventually succeeding are
different outcomes. Capacity/state inspection does not reserve permission; the
conditions can change before execution.

The bulkhead exposes available execution and queue slots. If execution capacity
is full but queue capacity remains, an operation waits in memory and its result
remains pending. This is not a durable background-job lifecycle.

A breaker normally allows work while **closed**, withholds it while **open**,
and allows limited recovery work while **half-open**. It can also be held open
through manual isolation. Half-open does not mean half the normal traffic, or
proof of health. In the default single-trial example, other calls wait while the
trial runs; they then encounter the resulting decision, which can still refuse
them. Other recovery sampling configurations were not worked through in detail.

At the inspected revision, opening records a time and recovery delay. A later
execution checks elapsed time and, when eligible, triggers the transition to
half-open and supplies the trial. Merely waiting or reading stored state does not
cause that transition. This explains why stored “open” can coexist with eligibility
for a new trial.

Existing breaker events include `onBreak`, `onHalfOpen`, `onReset` and
`onStateChange`. They report actual transitions; delay expiry alone currently
produces no transition event.

**Support:** [bulkhead comparison](readiness-investigation-dialogue.md#bulkhead-comparison),
[half-open explanation](readiness-investigation-dialogue.md#half-open-explanation),
[delay versus timer](readiness-investigation-dialogue.md#delay-versus-timer),
[events](readiness-investigation-dialogue.md#breaker-transition-events);
cited [bulkhead source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/BulkheadPolicy.ts)
and [breaker source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts).
These are static accounts, not tested execution traces.

## What failures and notifications tell the caller

Execution returns an eventual value or error. Admission refusals have distinct
error types; waiting itself is not a failure. Outer retry or fallback policies
can handle an inner failure, so it need not become the final caller-visible error.
Configured unsuccessful return values can count as policy failures without
necessarily becoming thrown exceptions.

Policy events describe local activity, not a single report of the whole
composition. In particular, breaker admission refusals do not use its ordinary
operation-failure event path. State and capacity queries provide another kind of
information; there is no existing generic acceptance query in the inspected model.

**Support:** [failure reporting](readiness-investigation-dialogue.md#failure-reporting),
including its cited [executor source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/common/Executor.ts).
Event coverage was not runtime-tested.

<a id="intent-and-direction"></a>
## Human intent and the chosen direction

**Reported need:** the application in
[issue #111](https://github.com/connor4312/cockatiel/issues/111) wants to avoid
expensive job preparation while its breaker blocks work. Checking stored state
can prevent all executions that would trigger recovery. The reporter says their
application-side timing workaround works, but wants better library support.
This is a report, not our reproduced failure.

**Human preference:** address the immediate need, fit existing facilities, and
leave room to grow without building speculative features
([scope choice](readiness-investigation-dialogue.md#conservative-scope)).

**Chosen direction within the simulation:** opt-in automatic open-to-half-open
transition at recovery-delay expiry, using the existing state and event facility.
Preserve existing behavior by default. The transition means trial eligibility;
it starts no work and establishes no successful recovery. This could support
notification as well as inspection before job preparation.

The human endorsed this direction in the
[decision endpoint](readiness-investigation-dialogue.md#decision-endpoint).
It is neither existing Cockatiel behavior nor maintainer acceptance, and no
implementation or external handoff was authorized.

**Still to settle:** event ordering and duplicate-transition prevention, obsolete
timers after isolation or reopening, restoration of state, timer lifetime and
process-liveness behavior, compatibility, and a reproduction of the reported
scenario. The options object is a plausible extension point, not verified
compatibility for an implementation.

<a id="revisions"></a>
## How the account and the design direction changed

| Earlier account or proposal | Later qualification or change, and why |
| --- | --- |
| Opening discussion blurred job submission with Cockatiel's responsibilities. | [Exchanges 1 and 3](readiness-investigation-dialogue.md#queueing-correction) separate the application's job lifecycle from policy-controlled execution and bulkhead waiting. |
| Readiness discussion initially focused only on the breaker. | [Exchange 4](readiness-investigation-dialogue.md#alternative-mechanisms) distinguishes permission from dependency health and recognizes other possible mechanisms. These are alternatives, not established features. |
| Normal / trial / blocked was an incomplete admission account. | [Exchange 8](readiness-investigation-dialogue.md#bulkhead-comparison) adds waiting for occupied recovery trials, based on further inspection. |
| A combined acceptance answer appeared to predict execution. | [Exchange 17](readiness-investigation-dialogue.md#shared-interface-direction) qualifies it as a conservative check of present component conditions. Waiting can change later conditions; a negative snapshot need not predict eventual rejection. No generic contract was completed. |
| The phrase “timer expires” suggested an existing scheduled transition. | [Exchange 26](readiness-investigation-dialogue.md#delay-versus-timer) corrects this to elapsed-time checking on execution. |
| The working proposal grew into a generic acceptance query. | [Exchanges 28–30](readiness-investigation-dialogue.md#event-driven-recovery) favor opt-in automatic transitions because state plus events addresses the need and can notify waiting applications. This is a design-choice revision, not a factual correction. |

The rationale for lazy transitions (work-driven recovery, avoiding idle timers)
was the agent's inference, not an established statement of maintainer intent.
A query would not inherently require polling: incoming job requests could trigger
checks. These qualifications remain relevant when comparing alternatives.

<a id="next-investigation"></a>
## Starting another investigation

Both participants now have exposure to this operating model. Reusing the account
would explore cumulative understanding, not repeat a newcomer-orientation test.
It also would not isolate the account's benefit from our existing conversational
memory.

An overall execution-budget investigation has been suggested but has not begun.
We know the broad roles of retry, timeout, composition and cancellation; we have
not established how an overall budget is or should be measured across attempts,
delays, queues and recovery waiting, or what happens to underlying work on expiry.
Those are questions for investigation, not missing facts to fill in by assumption.

This first extraction can be consulted alongside the dialogue. If later work
changes it, retain this version and record what changed, why and on what basis.
Ordinary Git and linked notes suffice for this experiment; it is not a new
PostCode knowledge schema or evidence that its retention machinery has been tested.

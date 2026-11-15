# Recovery states

**Overview:** Partial model; default single trial. [Q — scope and conditions](#scope).

![Recovery states](recovery-state.svg)

The short labels locate fuller meanings in the legend. Guarded transitions and scenario conditions remain part of the account; omission from a box is not removal of a condition.

## Transition legend

Every edge is conditional; the guard column supplies its full condition.

| Key | Short label | Full guarded transition | Evidence |
| --- | --- | --- | --- |
| T1 | Request [delay elapsed] | Open → Half-open. Trigger: Execution requested. Guard: Recovery delay elapsed. Effect: Reserve trial slot and start supplied work. | E-admission, E-half-open |
| T2 | Counted success [current trial] | Half-open → Closed. Trigger: Trial counted successful. Guard: Completing trial belongs to the current Half-open state. Effect: Close and release waiting executions. | E-half-open, E-outcomes, E-default |
| T3 | Counted failure [current trial] | Half-open → Open. Trigger: Trial counted failed. Guard: Completing trial belongs to the current Half-open state. Effect: Restart backoff and release waiting executions. | E-half-open, E-outcomes, E-default |

## State names

State bearer: R, the shared breaker scenario role. State names denote categories, not execution progress.

| Name | Category identity |
| --- | --- |
| Closed | S-closed |
| Open | S-open |
| Half-open | S |

<a id="scope"></a>
## Q — Scope and qualifications

These limits apply to the overview and every legend entry. This page accompanies the image; the image alone is an overview, not the complete qualified account.

- Authored illustrative static interpretation at the pinned revision; not an observed execution or a result from the implemented PostCode investigator.
- Default one-call recovery sampling with zero permitted counted failures.
- Manual isolation, restored state, cancellation, competing external state changes and non-default sampling are outside this account.
- Application-specific usage and business success are not established. Failure classification follows the configured policy.
- Reentrant execution requests from event listeners during entry to Half-open are excluded; entry and slot reservation are treated as one admission step.

Basis: `f48bea55022ab15ab07eb52a79bfc1e661300fd4`. Static source inspection plus the prior exploratory accounts; no runtime execution.

Success and failure here are breaker classifications. An error not matched by the failure policy is recorded as recovery success and still delivered to its caller.

Recovery of the shared breaker scenario role under the account qualifications. Discoverable as an account about P, not an assertion covering every instance or configuration of P.

Shared breaker role; default single trial, no reentrant entry calls. Static partial account; not all configurations of P.

Initial state: not-specified. No initial marker is inferred.

Not covered / not shown:

- Initial construction
- Closed-to-Open failure-policy behavior
- Manual isolation
- Restored-state behavior
- Non-default sampling
- Reentrant event-listener execution requests during Half-open entry

## Evidence and exact content

Investigram content: [followup-result.json](followup-result.json). Reference keys below are display-local aliases; the traceability file maps them to exact content locations. They are not entity identities or correction units.

| Reference | Support |
| --- | --- |
| E-admission | [source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts) — execute |
| E-default | [source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts) — createHalfOpenSamplingOptions |
| E-half-open | [source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts) — executeHalfOpen |
| E-outcomes | [source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts) — recordHalfOpenSuccess, recordHalfOpenFailure, maybeCompleteHalfOpen, open and close |
| E-state | [source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts) — CircuitState and state getter |

[Captured basis and delivery context](context-and-bindings.json) · [Exact diagram/legend mapping](diagram-traceability.json)

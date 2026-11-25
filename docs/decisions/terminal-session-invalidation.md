# Share terminal finalization for Session invalidation and abort

Status: accepted
Decided: 2026-11-25
Arising from: human disposition of F1 in the [terminal lifecycle review](../../records/reviews/cli-shell-retirement/2026-11-25-terminal-lifecycle-round-1-findings.md), preserved in the [task follow-up](../../records/tasks/2026-11-25-cli-shell-retirement.md)
Scope: finalization after an opened Session establishes invalidation or interruption
Supersedes: [Preserve terminal Session abort and separate shutdown failures](cli-shell-retirement.md#terminal-abort), only its limitation of terminal-finalization protection to abort; other contracts remain binding

## Context

The direct lifecycle implementation starts owned-resource cleanup on invalidation,
preserves the established invalidation cause and includes terminal finalizer failures
in the shared shutdown assessment. Review confirmed the behavior but identified that
the accepted wording described protection only for abort. The human explicitly
confirmed the implemented behavior and requested contract documentation and active-work
verification. This records that accepted clarification without rewriting the original
retirement decision's rationale.

<a id="terminal-finalization"></a>
## Decision

When an opened Session detects invalidation, it immediately begins owned-resource
cleanup and uses the same terminal-finalization protections and shutdown assessment
as terminal abort. Preserve the first established cause. Invalidation detected first
makes the active request reject with `SessionInvalidated` and its work remain
`invalidated`, including after later `interrupt()` or `close()`. Interruption established
while a changed input is still pending detection remains interruption. Earlier completed
producing attempts retain their actual outcomes.

Invalidation alone leaves the shutdown assessment clean. Participant cleanup,
terminal attempt/work reporting and owned-resource cleanup failures retain their
individual causes and are exposed by subsequent `interrupt()` and `close()` calls.
Repeated calls observe the same assessment without repeating cleanup. Internal
accounting survives notification failure. Ordinary request failures stay with their
request; they do not by themselves make idle shutdown fail.

## Rationale and alternatives

A terminal invalidation must not become a defect or be replaced by later interruption
merely because cleanup or reporting failed. Keeping finalizer failures request-local
for invalidation would give the two terminal paths inconsistent accounting and
observation guarantees. The human chose the common finalization contract.

## Consequences and limits

Protection is limited to finalization once a Session terminal cause is established.
It does not isolate general callbacks, redesign opening or introduce a broader
lifecycle. Existing cooperative execution, injected-resource ownership, Git deadlines
and continued ownership until confirmed exit remain unchanged. Request settlement
remains distinct from shutdown assessment and confirmed resource exit.

Verify clean invalidation during active work, simultaneous finalizer failures followed
by shutdown observation, and interruption before a pending change is detected through
the direct application boundary. Document the distinction from ordinary request failure.

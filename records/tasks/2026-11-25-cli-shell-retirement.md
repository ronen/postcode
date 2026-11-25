# Surgical CLI shell retirement

Status: active
Opened: 2026-11-25
Closed:

## Task

Please implement the plan at docs/plans/cli-shell-retirement.md ; this is explicit authorization to begin the substantive implementation task described by that plan.

## Follow-ups

### 2026-11-25 — Standalone diagram disclosure

Context: the human selected correction of the discovered standalone-diagram
disclosure gap, then clarified the instruction in the following prompt:

oops sorry that paste got garbled, but hopefully you got the point:  In trial support, make each standalone SVG and text diagram visibly carry the interpretation status and applicable owner limitations already supplied for its alternative. Keep each alternative’s qualifications with its own diagram. Record this as an intentional difference from the baseline, and verify both rendered formats against the same structured input. The correction is limited to rendering.

### 2026-11-25 — Confirm terminal invalidation finalization

The review is in records/reviews/cli-shell-retirement/2026-11-25-terminal-lifecycle-round-1-findings.md. &#x20;

**Regarding F1: Confirm the implemented behavior.** When an opened Session detects invalidation, it must begin cleanup of its owned resources and use the same terminal-finalization protections and shutdown assessment as terminal abort. Preserve the first established cause. If invalidation is detected first, the active request rejects with `SessionInvalidated` and its work remains `invalidated`, including after a later `interrupt()` or `close()`. If interruption is established while an input change is still pending detection, the request remains `interrupted`.

Invalidation alone leaves the shutdown assessment clean. If participant cleanup, terminal reporting, or owned-resource cleanup fails, preserve each cause and expose it through subsequent `interrupt()` and `close()` calls. Repeated calls observe the same assessment without repeating cleanup. Ordinary request failures stay with their request.

Update the contract and implementation documentation, and add direct-boundary tests during active work. Cover clean invalidation, invalidation with simultaneous participant-close and final-report failures followed by shutdown observation, and interruption before a pending change is detected. These cases also address F3’s ordering concern. This clarification is limited to finalization once a Session terminal cause is established. General callback isolation and broader lifecycle redesign remain outside scope.

### 2026-11-25 — Intermediate checkpoint acceptance

Yes checkpoint is accepted, continue with the implementation

### 2026-11-25 — Next checkpoint coverage

BTW for the next checkpoint, the reviewer suggests including these two points in the handoff: &#x20;
&#x20; \- Checking that the carried-forward items were handled: the CLI-only publication path and its completion flag (my note O1) and the Node\
&#x20;   version recorded for the capture comparison.\
&#x20; \- Checking that removing the CLI host didn't weaken the lifecycle guarantees that the old host's tests used to cover.

## Outcome

## Verification

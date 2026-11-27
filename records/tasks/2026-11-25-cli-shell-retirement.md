# Surgical CLI shell retirement

Status: completed
Opened: 2026-11-25
Closed: 2026-11-26

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

### 2026-11-26 — Integrated review and bounded rendering extension

The review is in records/reviews/cli-shell-retirement/2026-11-25-integrated-retirement-round-1-findings.md .&#x20;

Regarding R2: Authorize a bounded rendering-only extension. Each standalone SVG/text artifact should identify its alternative and corresponding account in the trial record and, when multiple alternatives exist, state their count, equal standing and unreconciled status.

Include the existing entry, coverage, applicability and unsupported-content notes in the SVG. The full transition legend may remain in the companion text, with an explicit reference from the SVG.

Use only supplied information; no new analysis or core capability. Record intentional baseline differences and verify both formats with multiple alternatives and partial coverage, keeping each alternative’s qualifications separate.\

### 2026-11-26 — Final gate acceptance, closure and integration

The review gate is satisfied. Please close the task, merge PR #15, and clean up the task branch and worktree.

## Outcome

Retired the investigation CLI, interactive shell, private worker, mechanical human
Views, compact aliases, command observation/feedback implementation, and dependent
tooling. The remaining CLI provides authentication and help. Direct application
clients retain qualified content, precise same-Session references, historical
answers, ordinary/fresh/follow-up investigations, attribution and usage.

Terminal abort and detected invalidation share protected finalization and a
memoized shutdown assessment. The first established cause is preserved, cleanup
and reporting failures remain observable, and ordinary request failures remain
local. The private CLI publication path is removed; the directly necessary
completed-work flag remains covered by its reentrant-close test.

Trial rendering is separate from core content. The human-authorized rendering
extensions make each standalone SVG/text artifact identify its trial answer,
alternative and account, disclose multiple-alternative standing, and carry its
own qualifications and coverage notes. SVGs reference the companion text for the
full legend. These intentional baseline differences add no analysis capability.

The human accepted the final review gate and authorized closure, merge and cleanup
on 2026-11-26. All returned actionable findings are resolved; see the
[final disposition](../reviews/cli-shell-retirement/2026-11-25-integrated-retirement-disposition.md).
No required implementation work remains. The documented residual limits remain:
cooperative execution without worker hard preemption, the separate opening-path
cleanup-error gap, and no replacement human investigation interface or research
recording facility. General callback isolation remains outside scope.

## Verification

- Type checking and compilation passed. The latest full suite passed **500/500**
  tests on Node **26.11.0**, independently reproduced during integrated review.
- Subsequent test-only corrections passed their affected suites: all 10
  contribution-answer tests and all 3 authentication CLI tests. The latter also
  passed from an isolated compiled build; a deliberate isolated-entry failure
  proved the corrected smoke test no longer executes a stale checkout CLI.
- Two controlled 18-step captures repeat byte-identically. Strict comparison with
  the preserved baseline allows only enumerated retirement/rendering differences,
  retaining exact identities, runtime provenance, support, qualifications,
  relationships and ordering. Both fresh-alternative SVGs were rendered and
  visually inspected; both formats were tested against the same structured input
  with separate qualifications and partial coverage.
- Direct-boundary verification preserves the former host's applicable lifecycle
  guarantees, including submission-time invalidation, once-only cleanup, terminal
  cause ordering, final accounting and repeated shutdown observation.
- Retained controlled trials, import/dependency audits, runtime provenance and
  coverage migration are preserved in the [integrated evidence](../validation/cli-shell-retirement/integrated-verification.md)
  and [review-correction evidence](../validation/cli-shell-retirement/review-corrections.md).
  No live model/credential run was used.
- Intermediate and final review gates were accepted by the human. The final
  [disposition](../reviews/cli-shell-retirement/2026-11-25-integrated-retirement-disposition.md)
  links the complete recorded findings, correction commits and verification.

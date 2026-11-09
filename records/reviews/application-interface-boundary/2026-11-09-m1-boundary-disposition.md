Record type: disposition
Date: 2026-11-09
Task: [Separate application functionality from its interfaces](../../tasks/2026-11-08-application-interface-boundary.md)
Handoff: [M1 application boundary review](2026-11-09-m1-boundary-handoff.md)
Findings: [Round 1](2026-11-09-m1-boundary-round-1-findings.md), [Round 2](2026-11-09-m1-boundary-round-2-findings.md)

# M1 application boundary review: disposition

## Findings and dispositions

- **F1 — accepted and resolved.** Correction `67e3818cbdbeb7156e6426115aaed337a4e2b6e6` retains the local operation guard through delivery/publication checks, using the scope's internal validity transport. Local actual output is passed through that scope once by `publishCommand`. Regression tests reproduce the old busy race and duplicate checks and pass with the correction. Round 2 independently confirms resolution, including scope expiry, check counts, exit codes, output bookkeeping and completed application work.
- **F2 — accepted and resolved for the M1 exact path.** The same correction adds production-entry tests for exports support refusal and guidance, raw exact access, partial/empty exports, materialization and retained-support fallbacks, and investigation revision/association continuations over fixed support. Exact tests deny acquisition and current-history enumeration. Round 2 confirms this coverage addresses the finding. Existing helper tests remain for the planned M3 consolidation; broader M2–M4 work remains part of the original task.
- **F3 — accepted and resolved.** The same correction labels unrepresentable direct invocation attachments as `invocation`, preserving accepted semantic requests and work. Round 2 confirms the corrected reporting and the unchanged per-key treatment of nested unrepresentable values.

Round 2 has no actionable findings. No finding was rejected or deferred. Its non-defect observations remain preserved in the findings record: local `publish` takes precedence over an overridden `execute`, non-View timing tests use the worker composition, and local delivery without an output action still performs two scoped validity checks. These are considerations for the already-planned CLI/script consolidation, not new correction requests or additions to scope.

## Corrections and verification

The correction target is `67e3818cbdbeb7156e6426115aaed337a4e2b6e6`, with emitted-source digest `627a27158bb7b77734fd9acd32aa57d7db1c2c7a5ae55da813b5d8c6485ec097`. The [active task verification](../../tasks/2026-11-08-application-interface-boundary.md#verification) preserves the implementing agent's checks. Round 2 independently confirms type checking, whitespace checks, 21 stable CLI comparisons and 60 both-host/collision journey comparisons with unchanged comparison policy.

Both implementation verification and round 2 ran the 652-test suite, with 650 passing in each full run. The two authentication/kernel-lock failures came from the shared native `fs-ext` binary targeting a different Node ABI. Each verification obtained 20/20 passing authentication tests after rebuilding for its Node version; round 2 used a scratch copy without modifying the task worktree's dependencies. No authentication or locking code changed. The review's other residual limits remain as authored; no live credentials or paid inference were used.

The findings commit and subsequent record commits change no implementation relative to the correction target. This clean second review requires no further product changes or repeated implementation tests.

## Review rounds

1. Round 1 reviewed `94f3c5046115687205b695aafa33bba9c35fef96` and returned F1–F3. All were corrected in `67e3818`.
2. Round 2 reviewed `67e3818cbdbeb7156e6426115aaed337a4e2b6e6`, confirmed all three findings resolved and returned no actionable findings. The reviewer recommends proceeding to M2–M4, subject to the human's gate decision.

## Gate conclusion

Independent review is clean. The human has requested that the second review be addressed but has not yet determined whether the accumulated review satisfies the M1 gate. Under `dev/review.md`, the implementing agent reports the clean result and awaits that direction. The task remains active at M1; this disposition does not authorize progression to M2–M4, task closure or merging. The original handoff and both findings records are unchanged.

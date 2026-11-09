Record type: disposition
Date: 2026-11-09
Task: [Separate application functionality from its interfaces](../../tasks/2026-11-08-application-interface-boundary.md)
Handoff: [M1 application boundary review](2026-11-09-m1-boundary-handoff.md)
Findings: [Round 1](2026-11-09-m1-boundary-round-1-findings.md), [Round 2](2026-11-09-m1-boundary-round-2-findings.md), [Round 3 — Copilot](2026-11-09-m1-boundary-round-3-copilot-findings.md)

# M1 application boundary review: disposition

## Findings and dispositions

- **F1 — accepted and resolved.** Correction `67e3818cbdbeb7156e6426115aaed337a4e2b6e6` retains the local operation guard through delivery/publication checks, using the scope's internal validity transport. Local actual output is passed through that scope once by `publishCommand`. Regression tests reproduce the old busy race and duplicate checks and pass with the correction. Round 2 independently confirms resolution, including scope expiry, check counts, exit codes, output bookkeeping and completed application work.
- **F2 — accepted and resolved for the M1 exact path.** The same correction adds production-entry tests for exports support refusal and guidance, raw exact access, partial/empty exports, materialization and retained-support fallbacks, and investigation revision/association continuations over fixed support. Exact tests deny acquisition and current-history enumeration. Round 2 confirms this coverage addresses the finding. Existing helper tests remain for the planned M3 consolidation; broader M2–M4 work remains part of the original task.
- **F3 — accepted and resolved.** The same correction labels unrepresentable direct invocation attachments as `invocation`, preserving accepted semantic requests and work. Round 2 confirms the corrected reporting and the unchanged per-key treatment of nested unrepresentable values.
- **Copilot 4511492976 — accepted and resolved.** Correction `9202fcedb76acca1cc2c0a9598b324672119bb91` moves the organization `group-details` guard from fixed content resolution to Presentation arrangement. Supported raw subsets now construct and retrieve successfully without adding expansions. Shared compatibility still refuses a Presentation requiring absent group details. The regression uses a real Git fixture, verifies an empty expansion subset and a distinct richer answer, then denies acquisition/selection while retrieving the original subset unchanged, with both omitted and explicit empty requirements. It also verifies the typed Presentation refusal and retained-answer guidance.
- **Copilot 4511493065 — accepted and resolved.** The same correction rechecks the scoped operation's lifecycle immediately after awaited application work, before accessing retained state or returning delivery. Closure from the finish callback now throws `SessionClosed`, leaves completed work unchanged, and prevents late delivery or binding use. The regression retrieves a retained investigation answer, closes during its completed-work callback, and checks the typed outcome, single final event, preserved completed status and revoked capability.

Round 2 has no actionable findings. No finding was rejected or deferred. Its non-defect observations remain preserved in the findings record: local `publish` takes precedence over an overridden `execute`, non-View timing tests use the worker composition, and local delivery without an output action still performs two scoped validity checks. These are considerations for the already-planned CLI/script consolidation, not new correction requests or additions to scope.

## Corrections and verification

The round 1 correction target is `67e3818cbdbeb7156e6426115aaed337a4e2b6e6`, with emitted-source digest `627a27158bb7b77734fd9acd32aa57d7db1c2c7a5ae55da813b5d8c6485ec097`. The [active task verification](../../tasks/2026-11-08-application-interface-boundary.md#verification) preserves the implementing agent's checks. Round 2 independently confirms type checking, whitespace checks, 21 stable CLI comparisons and 60 both-host/collision journey comparisons with unchanged comparison policy.

Both implementation verification and round 2 ran the 652-test suite, with 650 passing in each full run. The two authentication/kernel-lock failures came from the shared native `fs-ext` binary targeting a different Node ABI. Each verification obtained 20/20 passing authentication tests after rebuilding for its Node version; round 2 used a scratch copy without modifying the task worktree's dependencies. No authentication or locking code changed. The review's other residual limits remain as authored; no live credentials or paid inference were used.

Processing the clean second review changed records only and required no further product changes or repeated implementation tests.

Copilot subsequently reviewed `9b1446614d54a764ef50d2860be54652f49826ed`, whose implementation remained identical to the round 2 target. The complete external review was retrieved through all pages of the GitHub review, inline-comment and conversation-comment endpoints and committed in `7101d9e` before correction. All three returned component bodies, including original line endings, were verified unchanged in the committed findings record; there were no conversation comments.

For correction `9202fce`, the initial reproductions failed with the reported organization Presentation error and an untyped `TypeError` during scoped investigation delivery. After correction, all 14 focused lifecycle/exact-compatibility tests passed. `npm run build`, `npm run check`, `git diff --check`, and the full offline suite (`node --test --test-concurrency=2 _build/test/*.test.js`) passed: **654 tests, 654 passed**, with no skipped tests or environment failures. All **21 stable CLI comparisons and 60 retained-answer/allocation journey cases** passed against `b4dc07b` without method-split allowances or oracle changes. Baseline emitted-source digest remains `70d8d8bebfe283fc06e770300df52ee3fe267a5e99cc8eaa95ebc6f998b62c02`; corrected emitted-source digest is `7c5784110abb2b0fdddae0d71820956606b097d00bca123fb774624fe30932dc`. No live credentials or paid inference were used. These are implementing-agent checks, not an independent rereview.

## Review rounds

1. Round 1 reviewed `94f3c5046115687205b695aafa33bba9c35fef96` and returned F1–F3. All were corrected in `67e3818`.
2. Round 2 reviewed `67e3818cbdbeb7156e6426115aaed337a4e2b6e6`, confirmed all three findings resolved and returned no actionable findings. The reviewer recommends proceeding to M2–M4, subject to the human's gate decision.
3. Round 3 (Copilot review `5824285917`) reviewed `9b1446614d54a764ef50d2860be54652f49826ed` and recommended changes for two additional defects. Both are accepted and corrected at `9202fcedb76acca1cc2c0a9598b324672119bb91`; neither is rejected, deferred or materially qualified.

## Gate conclusion

The earlier round 2 review was clean; the subsequent Copilot findings were corrected and verified by the implementing agent. These are local guard corrections under the same assignment, with no scope expansion or changes to retained identity, allocation policy or publication ownership. They do not materially invalidate the prior analysis, but the earlier clean recommendation is not represented as independent review of the new correction target.

On 2026-11-09, the human explicitly determined: “The M1 review gate is satisfied. Please proceed to M2 as per the approved plan.” This decision is preserved in the active task's follow-ups. The M1 gate is satisfied and M2 may proceed; the task remains active, with final integrated review still required. This does not authorize task closure or merging. The original handoff and all findings records remain unchanged.

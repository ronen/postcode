# M3 ownership-aware sharing review

Record type: handoff
Prepared: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Review gate: Focused ownership-sharing review within the unaccepted M3 remaining mechanical-family checkpoint
Review target: `f4e8a386de51eda7483227dd386b9d6f265b730a`
Baseline or diff range: `959ef4495b2fbdc0857e1a97da097fcd56de976e..f4e8a386de51eda7483227dd386b9d6f265b730a`
Runtime comparison baseline: `8e06c5c74ba6679dd7e030dbb28162503b6235aa`
Branch: `claude/structured-architectural-accounts`
Worktree: `../app-worktrees/structured-architectural-accounts-impl` relative to the primary checkout
Pull request: [#14](https://github.com/ronen/postcode/pull/14)

## Review assignment and boundaries

Review the authorized ownership-aware sharing change, especially its compatibility with exact historical answers, external-input isolation, actual exposure and Session lifetime. This is a new focused assignment because the ownership/retention change materially extends the scope of the earlier mechanical review. It supplements the [mechanical handoff](2026-11-18-m3-mechanical-handoff.md) and its [round 1 findings](2026-11-18-m3-mechanical-round-1-findings.md); it does not rewrite or dispose of that assignment or accept its corrections on the human's behalf.

Inspect implementation, tests and measurement evidence directly. Neither this handoff, the earlier prototype nor the implementing agent's verification is independent proof. Recommend whether the sharing change is ready to be included in the mechanical checkpoint, distinguishing defects from optional further optimization. The reviewer may modify only its findings record. Do not change implementation, governing material, task status, the task record or this handoff; do not close or merge the task. No live inference is authorized.

## Governing context

- [Approved plan](../../../docs/plans/structured-architectural-accounts.md), including separate M3 mechanical and agentic/caller checkpoints and M4 integrated review.
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md) and [application specification](../../../docs/app-specification.md).
- Accepted decisions: [common contributions](../../../docs/decisions/common-analysis-contributions.md), [qualified answers](../../../docs/decisions/qualified-answers-over-contributions.md), [association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md), and [transient Sessions](../../../docs/decisions/transient-analysis-sessions.md).
- The human's ownership-sharing follow-up in the active task, committed at the diff baseline above; [task protocol](../../../dev/task-protocol.md) and [review workflow](../../../dev/review.md).
- [Investigation](../../validation/structured-architectural-accounts/m3-memory-investigation.md), [implementation architecture](../../../docs/architecture/contributions.md), and the new [validation checkpoint](../../validation/structured-architectural-accounts/m3-ownership-sharing-checkpoint.md) with its numeric evidence and reproduction instructions.

## Result under review

The program store owns an immutable-capture boundary, shared by its paired contribution ledger. Record retention, ledger acceptance, contribution-answer capture and production delivery capture reuse only proven-owned immutable subgraphs. Unknown plain values are copied and frozen; arbitrary caller freezes are not proof. Accessor/exotic graphs use native whole-graph cloning without being registered for sharing. Existing validation still processes owned inputs, and actual delivery records remain separate from shared payloads.

Answers still independently capture selected information, standing and reconsideration state. They carry resolved immutable values rather than lazy Session references. Application close, interruption and invalidation discard ownership bookkeeping; retained output does not carry a reference back to the table or owner. Late work cannot recreate the disposed table. Standalone ledger/store bookkeeping follows its own owner lifetime.

Canonicalization/comparison allocation, method identity and caller migration are deliberately unchanged. Active-session ownership tracking still has a cost; this is not a minimal-memory implementation or a claim that every remaining byte is necessary.

## Verification already performed

The implementing agent reports successful type/build checks and **779/779** full offline tests on Node 22.13.1, with no skips or failures. Six new tests plus strengthened existing cases exercise proof of ownership, aliases/native fallback, mutation isolation, independent owners, disposal, collision/Session/atomic validation, canonical native/answer sharing, historical arrangement and simultaneous application Sessions with post-close worker delivery. Existing exposure, history and real CLI/worker checks remain in the full suite. A forced-GC control separately demonstrates collection of the actual ownership table while its owner/output remain held.

The representative 741-module journey was rerun on Node 26.11.0 against the corrected build. Heap after GC fell from **1,182.91 MB to 643.37 MB**. All 18 application answer keys and per-kind retained record/contribution/delivery counts match. Identical answers stabilize; eight distinct overlapping answers add **1.03 MB versus 20.24 MB**. Historical hashes remain unchanged after a scripted withdrawal. After close and release of measurement outputs/bookkeeping, heap is **24.09 MB versus 24.04 MB**, with no surviving store or ledger. The validation record preserves the limits of these bounded single runs.

## Review focus and reproduction

1. Is ownership established only by an internal isolated copy and deep freeze? Check aliases, cycles, sparse arrays, prototype-named fields, getters, exotic/native fallback and errors. Can a caller forge trust, mutate a shared descendant or acquire cross-Session authority?
2. Do all capture sites preserve independent selection/standing/cause snapshots, unchanged actual exposure and plain structured delivery? Check both native findings and agentic contribution answers, including exact arrangement after disposal.
3. Do collision checks, reference validation, contribution atomicity and resubmission checks still run for owned inputs? Confirm the shared path does not become a validation bypass.
4. Does the ownership table have the right lifetime on close, interruption, invalidation, failed initialization and late completion? Verify independent simultaneous Sessions and that retained data cannot keep the table/store/compiler alive. Distinguish an intentionally retained output graph from leaked Session resources.
5. Are the memory and identity comparisons fair and reproducible? Use the exact build digests and fixed fixture in the checkpoint. Compare retained counts and complete answer keys as well as heap. Check that instrumentation overhead and temporary canonicalization work are not misreported as necessary information or savings.

Run `npm run check`, `npm run build` and the relevant offline tests; the complete suite uses Node 22.13.1 with test concurrency 2 because the installed credential-lock binary targets that ABI. The checkpoint includes both profile commands and the ownership-table GC control. No live-agent rerun is needed or authorized for this representation change.

## Findings return

Use `records/reviews/structured-architectural-accounts/YYYY-MM-DD-m3-ownership-sharing-round-N-findings.md`, starting with round 1, and the repository's [findings template](../../../dev/templates/review-findings.md). Identify this handoff, exact reviewed target, actual scope, method, checks performed, actionable findings, non-defect observations and unverified limits. Preserve the report under `## Returned findings`.

If the reviewer has repository write access, commit only that findings record and modify nothing else. Otherwise return the complete findings to the human for preservation. Subsequent rounds should identify their actual target and prior findings under this assignment; a different reviewer alone does not require a new handoff.

## Review gate

The implementation is ready for human-arranged independent review. The task remains active. This change and its verification do not accept the M3 mechanical checkpoint; the human determines review sufficiency. The separate agentic/caller checkpoint and M4 integrated review remain required. Material corrections require appropriate further review before gate acceptance or task closure.

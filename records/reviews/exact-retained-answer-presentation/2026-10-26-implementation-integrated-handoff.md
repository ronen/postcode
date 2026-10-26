Record type: handoff
Prepared: 2026-10-26
Task: [Exact retained-answer presentation](../../tasks/2026-10-26-exact-retained-answer-presentation.md)
Review gate: final integrated independent review
Review target: 62a282bb1e6858850e1dffd7a619b4c1b6332348
Baseline: ffaceb4c351cb90dc318d61cad5ad6f7ba31b003
Branch: codex/exact-retained-answer-presentation
Worktree: ../app-worktrees/exact-retained-answer-presentation (relative to the primary checkout)
Pull request: https://github.com/ronen/postcode/pull/11

# Exact retained-answer presentation — integrated review

## Review assignment and boundaries

Review the integrated implementation against the approved plan and governing contracts. The baseline-to-target diff includes the task-opening record and implementation; the subsequent handoff commit is assignment material, not part of the implementation target. Inspect the implementation and evidence directly; this handoff and the implementer's checks are not proof of correctness.

This is the final gate required by the task protocol. The human arranges the independent reviewer and decides whether the gate is sufficient. Reviewers may record findings as described below, but must not modify implementation, governing material, task status or the active task record.

## Governing context

- [Approved plan and verification matrix](../../../docs/plans/exact-retained-answer-presentation.md)
- [Accepted exact-presentation decision](../../../docs/decisions/exact-retained-answer-presentation.md)
- [Core concepts](../../../docs/core-concepts.md) and [architectural constraints](../../../docs/architectural-constraints.md)
- [Qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md), [request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md), and [reference lifetime](../../../docs/decisions/reference-lifetime-disclosure.md)
- [Task protocol](../../../dev/task-protocol.md) and [independent review workflow](../../../dev/review.md)

## Result under review

`present` is a separate direct/worker request and shell command. It resolves an exact retained answer and fixed support, checks compatible presentation choices, coordinates references and arranges the result without fresh selection, Evaluation, evidence acquisition or inference. Mechanical families, internal exports, shared interpretation extensions, investigation result/historical variants and associated-inspection composites use this path. Composite descriptors expose their variant and precise mechanical support; the support can be targeted separately.

Answer aliases use a separate append-only Session namespace. Views expose precise identity, alias, fresh/retained mode and reference lifetime. Fresh inspection constructs its composite before arrangement while preserving subject-binding order. Paging moves to present; structured and human continuations preserve the other effective choices. An unknown association token remains unknown during revision paging, with a separate restart that clears only that token.

Retained semantic failures/unavailability remain visible independently of current invocation reporting. Successful presentation completes without retry or additional usage. Fixed support consumption preserves available generating attribution. Existing invalidation, publication checks and shutdown remain in force. Observations use version 3. Current capability, CLI, architecture, status and the two scoped backlog descriptions are reconciled.

No material plan deviation is identified. Persistence, post-invalidation access, general View history, public Presentation registration, complete captured-basis export and the remaining non-View lifetime assessment stay outside this change. Foundation, process instructions, accepted decisions and governing architecture were not revised.

## Verification already performed

Implementer verification at the exact target:

- `npm run check`: passed.
- `npm test`: 608 passed; 0 failed, skipped or cancelled (172.5 seconds)..
- `git diff --check`: passed before committing.
- A disposable real-project Unicode smoke check showed the retained-selection marker, unchanged precise Projection ID and alias, a distinct View ID and `failed: false`.
- Earlier focused runs covered combined source/association/revision choices, unavailable and failed outcomes through direct and worker publication, source observations, fallback compatibility and extension locality. The final suite includes the added empty-listing, separate alias namespace, off-page collision and publication-invalidation regressions.

Tests use real retained records and the controlled investigator double; no hosted inference was used. During verification, two new assertions were corrected to use the existing `session-invalidated` event name. A separate run was invalidated by staging new tracked files while repository-backed fixture Sessions were open; final verification ran against the committed target with the checkout held stable.

## Review focus and reproduction

1. Check the no-selection boundary in retained resolution and content-based compatibility, including missing expansions versus qualified partial/unavailable support and internal extension families.
2. Check exact correction/association/reconsideration snapshots after later history, composite/base identity, subject-binding order and off-page collision behavior.
3. Execute combined continuations from structured requests and generated shell commands; verify complete effective choices, answer-wide revisions, unknown-token failure preservation and separate restart.
4. Check fresh/retained and lifetime View identity, canonical alias equivalence, one-shot text/JSON disclosure and guided answer-as-subject refusals.
5. Check retained failure semantics against current success, original work attribution, authoritative worker usage finalization, source disclosure, v3 observations and publication/input-validity checks.

Reproduce with `npm ci` (including the optional native test dependency), `npm run check`, and `npm test` in the task worktree. Keep its files and Git index stable while the suite runs: some fixtures capture the enclosing repository. Focused tests live in `test/retained-presentation.test.ts`, `test/investigation-selection.test.ts`, `test/investigation-integration.test.ts`, `test/presentation-compatibility.test.ts`, `test/exports-lens.test.ts`, `test/lens-extensions.test.ts` and `test/source-disclosure.test.ts`.

## Findings return

Use review name `implementation-integrated` and filename `YYYY-MM-DD-implementation-integrated-round-N[-reviewer]-findings.md` in this review series. Follow the [findings template](../../../dev/templates/review-findings.md), identify the exact target and actual scope reviewed, and preserve the report under `## Returned findings` with verification, actionable findings, residual limits and a gate recommendation.

If the reviewer has repository write access, create and commit only that findings record, modifying nothing else. Otherwise return findings to the human for preservation through the review workflow. Later rounds retain this assignment and identify their actual corrected target and prior findings.

## Review gate

The task remains active. The implementer will address clear in-scope findings through the review workflow; consequential alternatives or scope changes return to the human. Further review may be needed after material corrections. The task must not close until the human confirms that the independent-review gate is sufficient; this handoff does not authorize merge or task closure.

# M1 application boundary review

Record type: handoff
Prepared: 2026-11-09
Task: [Separate application functionality from its interfaces](../../tasks/2026-11-08-application-interface-boundary.md)
Review gate: M1 intermediate independent review before broad migration
Review target: `94f3c5046115687205b695aafa33bba9c35fef96`
Baseline or diff range: `b4dc07b..94f3c5046115687205b695aafa33bba9c35fef96` for extraction; separately `815f237..b4dc07b` for method provenance
Branch: `codex/application-interface-boundary`
Worktree: `../app-worktrees/application-interface-boundary` relative to the primary checkout
Pull request: [#13](https://github.com/ronen/postcode/pull/13)

## Review assignment and boundaries

Review the M1 boundary slice required by the approved plan. Inspect the implementation and relevant evidence directly; neither this handoff nor implementing-agent verification establishes correctness. The immutable target above defines the implementation scope. Subsequent evidence, handoff and active-task-record commits supply context and do not silently expand that target.

Recommend whether dependency direction, capture-once contracts, complete precise-ID content, allocation scope/order and publication/work outcomes are sound enough to proceed to M2–M4. Identify actionable defects with evidence and distinguish them from later planned work. The reviewer may write only its findings record as described below. Do not modify implementation, governing documents, task status, the active task record, or this handoff; do not close or merge the task.

## Governing context

- [Approved plan](../../../docs/plans/application-interface-boundary.md), especially M1, bounded contracts, allocation/outcome tables and test matrix.
- [Internal application API decision](../../../docs/decisions/internal-application-api.md), including invocation context and CLI bindings/outcomes.
- [Application specification](../../../docs/app-specification.md#application-interface-boundary), [core concepts](../../../docs/core-concepts.md), and [architectural constraints](../../../docs/architectural-constraints.md#application-interface-boundary).
- Accepted decisions for [qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md), [exact retained answers](../../../docs/decisions/exact-retained-answer-presentation.md), [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md), and [generated-output boundaries](../../../docs/decisions/generated-output-boundaries.md). Follow current successor mappings for investigation content/revision contracts.
- [Task protocol](../../../dev/task-protocol.md#independent-review) and [independent review workflow](../../../dev/review.md).

## Result under review

`src/lib/application/index.ts` exports explicit internal contracts and the in-process lifecycle. Semantic normalization, shared request validation, captured Presentation requirement/eligibility matching, complete selected content, exact resolution and binding coordination are application responsibilities. Direct callers need no CLI parser, renderer, terminal or sink. Optional invocation attachments remain separate and immutable.

`interfaces/cli/application.ts` is the common worker/in-process adapter. It combines semantic and captured client fields into the legacy report shape, arranges content, and preserves the worker-to-parent View/key transport and parent usage ownership. Application work finalizes before arrangement. A trusted internal scope holds one operation guard and supplies the existing investigation allocation sites with a revocable validated port. Mechanical bindings remain population-coordinated plain entries. The public deferred-check flag is gone; direct calls check before/after work, worker delivery transfers final validity checks to parent publication, and in-process CLI delivery composes a local guard.

The method-provenance change is a separate earlier checkpoint. Extraction changes no further method versions. Unknown-continuation work status changes only as approved; command failure and exit 3 remain. Client arrangement exceptions preserve completed application work.

The executor's existing family branches were moved together to avoid parallel semantic engines. This does not constitute completion of M2's direct interpretation/revision/conflict journey. Account/configuration and neutral observation/feedback services, live-script migration, removal of transitional import/helper paths, and final integrated documentation/verification remain M3–M4. `session.ts` currently forwards live script imports to the CLI adapter; it has no engine or deferred-check switch. Lower-level Presentation helper tests remain intact for their independent assertions.

## Verification already performed

See [boundary verification](../../validation/application-interface-boundary/boundary-checkpoint.md), its [comparison data](../../validation/application-interface-boundary/boundary-comparison.json), and the preceding [method-provenance verification](../../validation/application-interface-boundary/provenance-checkpoint.md). These records identify exact emitted source digests and the limits of each run.

The full suite passed 638 tests on the preceding extraction build. After final refinements, 51 focused tests passed on the final target build, as did 21 stable CLI comparisons and 60 deterministic journey comparisons. The latter cover both hosts and forced-prefix collisions, preserve allocation traces/serialized context order, and explicitly assert only the approved unknown-continuation work-status changes. There was no paid inference or live credential use. The offline authentication fixtures need local loopback access outside a restrictive sandbox.

## Review focus and reproduction

1. Trace runtime and type dependencies from the intended entry, including dynamic imports. Confirm content is complete fixed selected support, not a bounded View facade, and no store/binding capability is in the public delivery.
2. Inspect safe request capture, one semantic normalization authority, direct defaults/subsets, captured declarations, prospective/refined/materialized compatibility and fallback. Check generating-parent and attempt context reconstruction, preserved malformed input and omission limits, field order, and prevention of attachment authority over work/identity.
3. Audit every allocation population/order against the plan and retained traces, including answer aliases, mechanical composites, historical investigation association batches and off-page support. Inspect scope lifetime on success, exception, invalidation and close, and whole-batch validation before mutation.
4. Check work finalization versus arrangement/publication, typed busy behavior, direct and worker validity-check schedules, preserved final cancellation usage, state cleanup and owner boundaries. Exact access must not acquire, evaluate or enumerate current history. Earlier failed historical outcomes must remain distinct from current successful access.
5. Examine the comparison harnesses as code, including the deterministic occurrence sources and collision fixture. Do not accept a passing oracle if its policy could hide a substantive change.

Run `npm ci`, `npm run check`, and `npm test` for the target. Targeted tests are `application-*.test.ts`, `method-provenance.test.ts`, `retained-presentation.test.ts`, `session-inputs.test.ts`, `execution-ownership.test.ts`, `investigation-integration.test.ts`, and `work-attribution.test.ts`. Emit baseline and target into separate build roots and run `scripts/compare-application-boundary.mjs BEFORE_BUILD AFTER_BUILD REPORT` and `scripts/compare-application-journey.mjs BEFORE_BUILD AFTER_BUILD REPORT`. Extraction must use no `--method-split` allowance. Preserve task history; do not reset, amend or rebase the task branch to recreate a baseline.

## Findings return

If repository write access is available, use the [findings template](../../../dev/templates/review-findings.md) and create `records/reviews/application-interface-boundary/YYYY-MM-DD-m1-boundary-round-1-findings.md`. Identify this handoff, the exact reviewed target/scope, review method and verification, actionable findings, non-defect observations, unverified limits and the recommendation for this gate. Preserve the authored report under `## Returned findings`. Commit only that findings record and modify nothing else. Later rounds use the same handoff and increment the round number, recording the new exact target and prior findings/target.

If repository write access is unavailable, return the findings to the human. The human may supply that text or authorize retrieval so it can be preserved through the review workflow.

## Review gate

The plan requires an intermediate review before broad migration, and `dev/review.md` requires the implementing agent to commit this handoff and stop for the human to arrange review. The task remains active. Review findings are input to the authorized task, not approval to change scope, close or merge it. Clear in-scope corrections proceed through the review workflow; consequential alternatives or qualifications require human direction. The human determines whether this gate is sufficient before implementation proceeds beyond M1. Final integrated review remains required after later milestones.

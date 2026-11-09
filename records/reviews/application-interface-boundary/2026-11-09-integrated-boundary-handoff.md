# Integrated application boundary review

Record type: handoff
Prepared: 2026-11-09
Task: [Separate application functionality from its interfaces](../../tasks/2026-11-08-application-interface-boundary.md)
Review gate: Final integrated independent review before task closure
Review target: `e7de4b1ba5a222c0facc9b376c5a8c5b582e1386`
Baseline or diff range: `815f2378a5e6f2d4ca36884e4a8547a42f6c49ca..e7de4b1ba5a222c0facc9b376c5a8c5b582e1386`; separately `815f237..b4dc07b` for method provenance and `b4dc07b..e7de4b1` for extraction
Branch: `codex/application-interface-boundary`
Worktree: `../app-worktrees/application-interface-boundary` relative to the primary checkout
Pull request: [#13](https://github.com/ronen/postcode/pull/13)

## Review assignment and boundaries

Review the complete implementation of the approved application/interface plan. Inspect implementation and evidence directly: this handoff, prior reviews and implementing-agent checks are not proof of correctness. The immutable target above defines the implementation; subsequent evidence, handoff and active-record commits provide context without silently changing it.

This is a new final integrated assignment. The [M1 handoff](2026-11-09-m1-boundary-handoff.md) covered the earlier extraction boundary; its three review rounds and [disposition](2026-11-09-m1-boundary-disposition.md) remain preserved, and the human accepted that intermediate gate. M2–M4 add direct journeys, the dependency subset correction, companion services, CLI/script consolidation and final integration. Review their interaction with M1 rather than limiting review to the last commit or treating M1 acceptance as final acceptance.

Recommend whether the implemented boundary and preservation evidence satisfy the plan's final gate. Distinguish actionable defects from explicit non-goals or future work. The reviewer may write only its findings record through the return procedure below. Do not modify implementation, governing material, task status, the active task record or this handoff; do not close or merge the task. The human decides whether the review gate is sufficient.

## Governing context

- [Approved plan](../../../docs/plans/application-interface-boundary.md), including contracts, binding schedules, outcome matrix, M1–M4 and the verification matrix.
- [Internal application API decision](../../../docs/decisions/internal-application-api.md), especially invocation capture, complete content, method provenance, CLI bindings and outcome separation.
- [Application specification](../../../docs/app-specification.md#application-interface-boundary), [core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md#application-interface-boundary) and adopted [foundation](../../../foundation/README.md).
- Accepted decisions for [qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md), [exact retained answers](../../../docs/decisions/exact-retained-answer-presentation.md), [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md), [generated-output boundaries](../../../docs/decisions/generated-output-boundaries.md) and [research recording](../../../docs/decisions/research-question-driven-observation.md). Follow successor mappings for investigation selection/revision contracts.
- [Task protocol](../../../dev/task-protocol.md#independent-review), [review workflow](../../../dev/review.md) and [engineering guidelines](../../../dev/engineering-guidelines.md).

## Result under review

`application/index.ts` supplies explicit semantic requests/results, captured capabilities, complete qualified selected content and fixed support, exact answer access, operational attribution and lifecycle. Direct clients need no CLI parser, Presentation, writer or sink. One executor serves all implemented families and internal extension fixtures. Exact access preserves earlier answers through later correction/conflict/reconsideration without selecting or acquiring new support. Supported direct subsets remain distinct from Presentation requirements.

The shared CLI adapter captures client declarations/attachments, reconstructs existing report contexts, arranges supplied content and preserves allocation order. One operation guard covers application execution and client arrangement, with a revocable binding port. Application work finalizes before arrangement. Direct checks surround work; local CLI publication remains inside its operation scope; private worker delivery transfers final checks to parent publication. Parent usage finalization retains the arrangement key. Unknown continuations still fail the command with exit 3 while work remains completed; retained failed interpretation outcomes remain historical.

Accounts/configuration, explicit cost-bearing connection checking, observation delivery and feedback are independent companion services. The CLI owns route disclosures, command/document guidance, authentication process signals, View/source classification, terminal rendering and continuations. One-shot and shell share runtime/exclusion assembly. Observation format remains version 4. Existing displayed feedback still uses the supplied observation-shaped snapshot and does not reconstruct source context.

Live scripts and CLI-shaped tests use the intended entries. The temporary session shim is removed; historical checkpoint tools retain documented module/export assumptions. The small direct client and final same-fixture Unicode/JSON test exercise the intended API and complete-versus-bounded content contract. TSDoc, architecture, CLI, capability and status documentation describe the implemented boundary.

The original method split is preserved as its own checkpoint. No method versions or identity allowances were added during later extraction or M4. No GUI, public transport/browser API, persistence, generic View history, research/feedback decoupling or captured-basis observation export is introduced. Direct synchronous compiler work remains non-preemptible on its calling thread. No live inference assessment is required for this assignment.

## Verification already performed

The [integrated verification record](../../validation/application-interface-boundary/integrated-checkpoint.md) maps every plan criterion to distinguishing tests and inspection. Its [comparison evidence](../../validation/application-interface-boundary/integrated-comparison.json) identifies the exact baseline/final emitted-source digests and records cases/allocation traces. The [original method-provenance record](../../validation/application-interface-boundary/provenance-checkpoint.md) and its mapping evidence are unchanged. The [M2](../../validation/application-interface-boundary/m2-checkpoint.md) and [M3](../../validation/application-interface-boundary/m3-checkpoint.md) records preserve intermediate evidence and script classification.

At the target, `npm test -- --test-concurrency=2` passed 664/664 tests; type and whitespace checks passed. All 21 stable CLI comparisons and 60 retained-answer/allocation comparisons passed across both hosts and ordinary/forced-prefix collisions. The new direct client retains beyond-display-bound exports, documentation, dependency occurrences, association and revision content, while the CLI preserves matching answers and explicit omissions. The dependency test traverses application and companion service runtime/type imports. Current script syntax/named-export linkage passed for 14 entry points and 19 built exports, without importing inference-starting assessment entry points.

M3 additionally exercised 288 live output comparisons, eight service-output baseline cases, a real controlled shell, profiler instrumentation, both 80,000-declaration interruption probes, and 40 clean/partial repository-sized reuse requests. M4 changed only tests, TSDoc and documentation; the full suite and linkage checks were repeated, while those unchanged runtime probes retain their recorded evidence. No live credentials or paid inference were used. Local-loopback authentication fixtures ran with the necessary local network access. Measurement timings are descriptive, not guarantees.

## Review focus and reproduction

1. Trace runtime and type dependencies, semantic normalization, safe capture and plain delivery from the intended entries. Verify that the direct client uses complete fixed content rather than bounded Views, and that no store, provider, binder or mutable Session capability escapes in results/progress.
2. Check fresh/exact behavior, raw subsets, fallback planning and all qualification/refusal distinctions. Inspect exact-access tripwires and correction/conflict journeys; incomplete, unavailable and empty answers must remain distinct. Check the complete-content assertions against actual selected support, not counts alone.
3. Audit allocation populations/order and scope revocation against the plan and comparison traces, including historical inspection association batches and off-page support. Check name/reference identity, separate answer aliases, malformed targets, arranged keys and idempotent usage finalization.
4. Inspect work completion versus arrangement/publication, single-guard ownership, busy refusal, callbacks, invalidation/interruption, late messages and cleanup. Verify unknown-continuation exit 3 with completed work, arrangement exceptions, direct post-check failure, withheld output and post-output invalidation without false displayed context.
5. Review companion services and both host assemblies: typed credential reasons, preflight without implicit connection checking, explicit billing/no fallback, authentication cancellation, feedback without a project, displayed failure replacing old context, atomic sink publication and failure-isolated delivery.
6. Inspect scripts and comparison policy as code. Historical old imports must stay historical; current consumers must not succeed through stale build files. Do not accept comparisons that erase qualification, reference digests, ordering or the method-capture transition. Review documentation against actual behavior and retained limits.

Run `npm ci` if dependencies are absent, `npm run check`, and `npm test -- --test-concurrency=2`. Node must match native optional dependency builds; offline authentication tests need local loopback. Focused files include `application-*.test.ts`, `method-provenance`, `request-model`, `presentation-compatibility`, `retained-presentation`, `investigation-selection`, `work-attribution`, `execution-ownership`, `feedback` and account/observation tests. The integration client's production imports are isolated in `test/application-client.ts`; its test harness separately invokes the CLI on the same fixture.

Emit the immutable post-split baseline and target into separate build roots, then run `scripts/compare-application-boundary.mjs BEFORE_BUILD AFTER_BUILD REPORT` and `scripts/compare-application-journey.mjs BEFORE_BUILD AFTER_BUILD REPORT`. Use no `--method-split` flag for extraction. That flag applies only to reproducing the original-to-post-split checkpoint. Preserve task history; do not reset, amend or rebase the task branch to recreate baselines. Live assessment entry points may initiate paid inference; inspect their imports without executing them. The controlled offline shell is covered by `assessment-budget.test.ts`.

## Findings return

If repository write access is available, use the [findings template](../../../dev/templates/review-findings.md), create `records/reviews/application-interface-boundary/YYYY-MM-DD-integrated-boundary-round-1-findings.md`, and identify this handoff, the exact reviewed target/scope, review method, verification, actionable findings, relevant non-defect observations, unverified areas/residual limits and recommendation. Preserve the authored report under `## Returned findings`. Commit only that findings record and modify nothing else. Later rounds retain this handoff, increment the round and identify the new target and prior findings/target.

If repository write access is unavailable, return findings to the human. The human can supply the text or authorize retrieval for preservation through the review workflow.

## Review gate

The approved plan and task protocol require final integrated review. The implementing agent commits this handoff and stops for the human to arrange that review, as required by `dev/review.md`. The task stays active; no closure or merge is authorized. Clear in-scope corrections proceed through the review workflow. Material corrections may require further rounds under this handoff; consequential alternatives or scope changes require human direction. Only the human determines that the accumulated review satisfies the final gate.

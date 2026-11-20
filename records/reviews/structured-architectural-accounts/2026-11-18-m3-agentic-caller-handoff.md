Record type: handoff
Prepared: 2026-11-18
Task: `2026-11-15-structured-architectural-accounts`
Review gate: M3 agentic/caller cut-over, separate from the accepted mechanical checkpoint
Review target: e6f5c4c28a467670100fbdc77b9fabac0b1df17e
Baseline: `142a04623944dfb3285d1c36cea514a193e40dad` (mechanical acceptance); inspect `142a04623944dfb3285d1c36cea514a193e40dad..e6f5c4c28a467670100fbdc77b9fabac0b1df17e`, including partial caller implementation `1f00938`, accepted semantic decision `bd9f581`, follow-up `fc9d909` and the completed implementation
Branch: `claude/structured-architectural-accounts`
Worktree: `../app-worktrees/structured-architectural-accounts-impl`
Pull request: https://github.com/ronen/postcode/pull/14

# M3 agentic/caller cut-over review

## Assignment and boundaries

Review the supported existing investigation capabilities and callers under the common contribution model, including restored coverage and the accepted attempt/answer separation. Inspect source and tests independently; this handoff, implementation verification and earlier reviews are not proof of correctness. Recommend whether this distinct M3 checkpoint is ready for human acceptance. Mechanical review and ownership-sharing acceptance are predecessors, not substitutes for this review.

Reviewers may inspect and run offline checks. Do not invoke live inference, change implementation/governing material, alter task status or the task record, or arrange additional agents/reviewers without human direction. No live inference is authorized. This is not the M4 integrated gate or task closure.

## Governing context

- [Approved plan](../../../docs/plans/structured-architectural-accounts.md), especially M3 and the coverage obligations.
- [Active task and chronological direction](../../tasks/2026-11-15-structured-architectural-accounts.md).
- [Common analysis contributions](../../../docs/decisions/common-analysis-contributions.md), [association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md), [qualified answers](../../../docs/decisions/qualified-answers-over-contributions.md), [structured explanation](../../../docs/decisions/structured-architectural-explanation.md).
- [Investigation attempts and answer outcomes](../../../docs/decisions/investigation-attempts-and-answer-outcomes.md), accepted at `bd9f581`; implementation direction recorded before changes at `fc9d909`.
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [application specification](../../../docs/app-specification.md).
- [Mechanical checkpoint](../../validation/structured-architectural-accounts/m3-mechanical-checkpoint.md), [ownership-sharing validation](../../validation/structured-architectural-accounts/m3-ownership-sharing-checkpoint.md) and [accepted rereview disposition](2026-11-18-m3-ownership-sharing-disposition.md).

## Result under review

`summarize`, `explain`, `decompose` and `examine` now use common production/delivery/acceptance with exact result designations. Hosted configuration, direct application and private worker delivery all use that route. Exact whole-contribution, item/component and designation subjects, reverse exact-subject invocations, historical identifying names and mixed native/common inspection preserve qualified access. CLI output uses a common View with fixed owner/status pages and source disclosure limits. No new CLI command or option is introduced for state behavior, follow-up options, fresh execution or component selection.

Attempt failure and undesignated inability remain retained request reporting, distinct from selected answer identity and fulfillment. Failed fresh work leaves a previous standing answer unchanged. Partial selected content retains applicable owner reports/limitations. Complete operation/catalog fingerprints govern reuse; cancellation, eligible retry, cleanup, usage and provider-detail disclosure remain covered.

Answers capture selected immutable content/evidence and independent status snapshots. The partial implementation's full production per answer owner was removed because it duplicated unrelated batch history and contaminated selection/identity; owner provenance, origin, report, exact evidence and captured causes remain self-contained. Full attempts stay Session records. Common inspection identity uses exact references and captured status rather than rewriting arbitrary source strings. Ownership sharing remains under the accepted store-lifetime boundary; no global registry or temporary allocation optimization was added.

## Verification already performed

See the [caller checkpoint](../../validation/structured-architectural-accounts/m3-agentic-caller-checkpoint.md), [coverage migration inventory](../../validation/structured-architectural-accounts/m3-agentic-caller-coverage.md), and [representative memory comparison](../../validation/structured-architectural-accounts/m3-agentic-caller-memory.md). These are implementing-agent observations. The final full offline suite passed 774/774 with zero failures, skips or cancellations; build and script/diff checks and the exact build digest are recorded there. The memory comparison uses the accepted corrected mechanical revision and the same 741-module repository, distinguishing canonical records, selected support, repeat/distinct answers and representative post-close controls.

## Review focus and reproduction

1. Trace each supported operation from application/CLI configuration through common hosted/worker dispatch, acceptance, current selection and exact replay. Check that no supported capability can silently register or execute the old tree/correction path.
2. Verify all five accepted attempt/answer cases against `investigation-answer-outcomes`, `contribution-application`, `contribution-dialog` and `m3-agentic-cutover`, including reused failure detail and retry. Look for diagnostics silently dropped or inappropriately entering old answers.
3. Inspect selected support completeness and ownership: producer/origin/report, applicable qualification, evidence, displacements, causes, membership and conflicts. Confirm exact output works with ledger/store tripwires and after close without depending on full live production history. Check atomic rejection and old-answer immutability.
4. Inspect common inspection identity and deterministic native identities; source text and foreign references must not be normalized away. Review historical names, zero/one/many lookup, exact subjects, equal alternatives and native/common mixed selections.
5. Audit the migration inventory rather than accepting test-count changes. In particular inspect deleted integration cases, low-level legacy test adapters and the replacement public/worker journeys. Verify fixed pagination returns all qualified details, truthful omissions and restart behavior without inference, and that source-bearing bodies remain internal.
6. Confirm actual acquisition versus dispatch in work/attempt reports, independent producer exposure, cleanup, simultaneous Sessions and plain structured worker delivery. Review representative retained counts, full answer keys, canonical sharing and post-close liveness, not only the small fixture.

Build with `npm run build`. Run `node --test --test-concurrency=2 _build/test/*.test.js` with Node 22.13.1 for the installed native modules; authentication tests need local loopback/native locking access. Focused files include `m3-agentic-cutover`, `investigation-answer-outcomes`, `contribution-dialog`, `application-journey`, `application-exact-compatibility`, `investigation-integration`, `work-attribution`, `human-output`, `source-disclosure` and `verification`. The memory record gives the Node 26.11.0 reproduction command; keep the build fixed during a run.

## Remaining scope and limits

Supported capabilities are cut over, but unreachable legacy evaluator/tree/correction/citation helpers and their isolated tests remain for M4 retirement and integrated documentation reconciliation. The coverage inventory identifies them; they do not validate the new route. No caller checkpoint acceptance is inferred. M2 live trials are the only authorized live instruction-usability evidence; the changed M3 guidance was checked offline. This checkpoint does not claim architectural completeness, persistence, cross-Session identity, automatic reassessment/clearance, a total output byte cap or statistical performance conclusions.

## Findings return

Use `dev/templates/review-findings.md`. If repository write access is available, create `records/reviews/structured-architectural-accounts/2026-11-18-m3-agentic-caller-round-1-findings.md` (or a date/round/reviewer-qualified successor), identify this handoff, exact reviewed target and scope, review method, checks, actionable findings, residual limits and gate recommendation. Preserve the report under `## Returned findings`; commit only that findings record and modify nothing else. Without write access, return findings to the human. Further rounds reuse this handoff while the assignment remains applicable and name their new exact target and previous findings.

## Review gate

The implementing agent stops for the human to arrange review. Findings are addressed under the active task and review workflow. Only human acceptance satisfies this M3 caller checkpoint; material corrections require appropriate further review. M4 integrated verification/review and final task closure remain later obligations, with no inferred permission to merge.

# M1 common contribution mechanism review

Record type: handoff
Prepared: 2026-11-15
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Review gate: Milestone 1 checkpoint — review mechanism semantics before expanding native integration
Review target: `2bc5b862d8a4acfd85463525c0abe80def0f46b2`
Baseline or diff range: `8a7f2834470644726dd742a0ddaeb1455bac3b2a..2bc5b862d8a4acfd85463525c0abe80def0f46b2`
Branch: `claude/structured-architectural-accounts`
Worktree: `../app-worktrees/structured-architectural-accounts-impl` relative to the primary checkout
Pull request: [#14](https://github.com/ronen/postcode/pull/14)

## Review assignment and boundaries

Review the common contribution mechanism required by Milestone 1 of the approved plan. The plan places this checkpoint before any native producer or caller is migrated, so that mechanism semantics are examined while changing them is still cheap.

Inspect the implementation and tests directly. This handoff, the checkpoint record and the implementing agent's verification are context, not evidence of correctness. The immutable target and diff range above define the implementation under review; later commits, including the checkpoint record and this handoff, are not part of that scope.

Recommend whether the mechanism's semantics conform to the governing decisions well enough to begin Milestone 2. Identify actionable defects with evidence, and separate them from work the plan assigns to later milestones. The reviewer may write only its findings record as described below. Do not modify implementation, governing documents, the task record, task status or this handoff, and do not close or merge the task.

## Governing context

- [Approved plan](../../../docs/plans/structured-architectural-accounts.md), especially Milestone 1, the intermediate-state contract and the verification coverage table.
- Accepted decisions: [common analysis contributions](../../../docs/decisions/common-analysis-contributions.md), [association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md), [qualified answers over contributions](../../../docs/decisions/qualified-answers-over-contributions.md) and [structured architectural explanation](../../../docs/decisions/structured-architectural-explanation.md).
- [Core concepts](../../../docs/core-concepts.md) for Entity, Query result, Investigram, content association, and exposure and reconsideration; [architectural constraints](../../../docs/architectural-constraints.md#retained-interpretation) for retained analysis contributions.
- [Engineering guidelines](../../../dev/engineering-guidelines.md) and [implementation conventions](../../../docs/implementation-conventions.md).
- [Task protocol](../../../dev/task-protocol.md#independent-review) and [independent review workflow](../../../dev/review.md).

## Result under review

`src/lib/contributions/` contains the whole mechanism:

- `model.ts`: identities, retained records, submission shapes and delivery records.
- `catalog.ts`: content-type contracts, with prose and identification types.
- `ledger.ts`: Session-owned retention, invocation and Query-result resolution, atomic acceptance and read access.
- `production.ts`: the open producing execution through which inputs are acquired and recorded.
- `status.ts`: derived standing and cause-bearing reconsideration.
- `outcomes.ts`: the shared producer boundary, production outcomes and fulfillment assessment.

Three test files and one helper exercise it with controlled producers. `docs/architecture/contributions.md` describes it, the architecture overview links it, and the implementation conventions gain one testing convention. `src/lib/identity.ts` gains two method versions.

Nothing existing was migrated. No Session, Lens, CLI or investigating-agent path uses the mechanism, and no existing test was changed. This milestone does not demonstrate the real application path; that is Milestone 2.

The [M1 checkpoint record](../../validation/structured-architectural-accounts/m1-checkpoint.md) gives the concrete schema, twelve implementation choices offered for review, the mapping of contract tests to the plan's verification areas, capability migration status, and the legacy check families with the milestone by which each must be restored.

## Verification already performed

By the implementing agent, at the review target, without live credentials or inference:

- `npm run check` and `git diff --check` passed.
- The three contribution test files pass 29/29.
- `npm test` passed 697/697 with no skips: the 668 unmodified tests of the starting revision and the 29 new tests. A second complete run of the built suite also passed 697/697.
- One earlier complete run reported 7 failures that were not identified because its output was truncated. The worktree and its Git index were being modified during that run. The cause is inferred, not established; the checkpoint record states this.

## Review focus and reproduction

1. **Conformance of acceptance.** Does `ContributionLedger.accept` enforce what the decisions require and nothing they retire? In particular: identity resolution before allocation, atomic rejection, no association-reachability requirement, no prior-delivery gate on reuse, displacement or inconsistency endpoints, and grounds required for supersession and withdrawal.
2. **Exposure and timing.** Does `ContributionStatus` implement the three concern paths, the known-versus-later boundary, the exact-notice rule across direct and inherited routes, and the own-declaration exclusion as specified? Look for a route by which a known cause re-enters, or by which exposure is invented without a delivery.
3. **Status bearers.** Are standing, membership concerns, producing-context concerns and content-owner concerns kept on the right bearers, without a merged Query-result status or a global status on an item?
4. **The implementation choices in the checkpoint record.** Choices 1, 2, 6 and 12 have the widest consequences for Milestone 2. Say whether each is a permitted implementation choice or a consequential semantic selection that needs human resolution.
5. **Test independence.** Do the contract tests derive expectations from the decisions, or do they restate the implementation? Identify required Milestone 1 observations that are missing.
6. **Fit for migration.** Is anything in the schema likely to force a weaker rule when real module identification, exports and an agentic dialog are integrated?

To reproduce: `npm ci`, `npm run check`, then `npm run build && node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js`. `npm test` runs the complete offline suite.

## Findings return

Use the [findings template](../../../dev/templates/review-findings.md). If you have repository write access, create and commit only

`records/reviews/structured-architectural-accounts/2026-11-15-m1-mechanism-round-1-findings.md`

with the required metadata and your report under `## Returned findings`, and change nothing else. Add a reviewer name to the filename if several reviewers report in one round, and increment the round number for a rereview. If you cannot write to the repository, return your findings to the human.

## Review gate

Milestone 2 does not begin until the human says this checkpoint is sufficient. Findings whose resolution is clear and within the authorized scope will be corrected and verified by the implementing agent; a finding that would change consequential semantics, reject a reviewer's conclusion or expand scope returns to the human first. Material corrections may warrant a further round under this handoff.

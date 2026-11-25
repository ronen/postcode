# Direct terminal Session lifecycle

Record type: handoff
Prepared: 2026-11-25
Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md)
Review gate: intermediate lifecycle checkpoint before CLI/worker retirement
Review target: `ff2da8709b8ed929b6fcaac1ccbd52129c93a9d5`
Baseline or diff range: `5db2cf19f0436d206aa5d5c05de7f022a03b45b9..ff2da8709b8ed929b6fcaac1ccbd52129c93a9d5`
Branch: `codex/cli-shell-retirement`
Worktree: `../app-worktrees/cli-shell-retirement` relative to the primary checkout
Pull request: [#15](https://github.com/ronen/postcode/pull/15)

## Review assignment and boundaries

Independently inspect the implementation and evidence for terminal cancellation
through the direct application boundary. Do not treat this handoff or the implementing
agent's passing checks as proof. This checkpoint implements the lifecycle prerequisite
before deleting the CLI's private worker/transport and its separate interruption
machinery. Checking the direct guarantee now reduces the risk of removing the host
that previously protected these distinctions without an adequate replacement at the
surviving application boundary.

The review is scoped to the exact target above, including the controlled pre-change
comparison evidence. A later task follow-up records the human's rendering-only
qualification correction; it does not change this lifecycle review scope. Reviewers
must not implement that correction or other pending retirement work.

Only a findings record may be changed by the reviewer. Do not change implementation,
governing material, task status, the task record or this handoff. Recommend whether
this checkpoint is sufficient to proceed with retirement and identify actionable
defects, missing evidence and residual uncertainty.

## Governing context

- [Approved plan](../../../docs/plans/cli-shell-retirement.md), especially terminal abort, preservation and opening boundaries.
- [Accepted retirement decision](../../../docs/decisions/cli-shell-retirement.md#terminal-abort).
- [Architectural constraints](../../../docs/architectural-constraints.md#application-interface-boundary).
- [Core concepts](../../../docs/core-concepts.md#session).
- [Application specification](../../../docs/app-specification.md#application-interface-boundary).
- [Task protocol](../../../dev/task-protocol.md#independent-review) and [review workflow](../../../dev/review.md).

## Result under review

Opened Sessions share terminal behavior across interrupt, external signal abort and
active close. The direct request retains its established terminal cause. Attempt and
work accounting are finalized before request rejection; finalizer/notification errors
are retained as separately classified shutdown failures. Repeated shutdown observers
share one assessment and cleanup is not repeated. Signal-only failures remain available
to a later close without an unhandled internal rejection. Ordinary request-local
participant or callback failures do not by themselves make a later idle close fail.

Resource assessment retains the existing Git deadlines, escalation and ownership
until exit. Request settlement does not wait for resource exit. Injected execution
remains caller-owned. Cooperative waits cover validation and agent selection; no
hard interruption of synchronous work, overall shutdown deadline or asynchronous
participant-close contract has been added. Earlier accepted production remains
accepted when the consuming request is aborted during final validation.

The CLI, aliases, rendering locations, observation implementation and exclusive tools
are deliberately still present. Their removal, test migration and final documentation
remain authorized work after this intermediate review. The final integrated review
and full retained suite remain required. This is not a completed implementation of
the plan or authorization to close or merge the task.

## Verification already performed

The implementing agent ran type checking/build and 93 tests across the five suites
listed below: all passed. Before changes, 32 preservation tests passed. A fresh
controlled post-change application capture is byte-identical to its pre-change
capture, with no field exclusions. Participants replace agent communication only;
application coordination, selection, contribution acceptance, retention and accounting
are real. The captured fixture contains no credentials or sensitive repository material.
See the [preservation evidence](../../validation/cli-shell-retirement/README.md).

An opening-path experiment confirmed an existing defect: acquisition failure followed
by cleanup failure surfaces only the cleanup error. This correction deliberately
preserves the pre-Session contract and records that concern for separate work. Review
that the separation has not introduced an unowned resource or concealed cleanup failure.

## Review focus and reproduction

```sh
npm ci --offline
npm run check
npm run build
node --test --test-concurrency=2 _build/test/application-shutdown.test.js _build/test/application-lifecycle.test.js _build/test/contribution-dialog.test.js _build/test/contribution-application.test.js _build/test/execution-ownership.test.js
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/review-capture /private/tmp/postcode-cli-retirement-controlled
```

Compare `capture.json` with decompressed `records/validation/cli-shell-retirement/baseline/capture.json.gz`.
The fixture's absolute path and controlled UUID sequence are part of this comparison;
do not erase reference identity, support, qualification or target relationships to
make it pass. The baseline script refuses to overwrite unexpected fixture contents.

Inspect in particular:

- Request-versus-shutdown settlement ordering, reentrant observers and internal rejection handling.
- Distinguishable simultaneous resource, participant, attempt-report and work-report failures.
- Retention/sealing of measured and missing usage and rejection of late replies or agent opening.
- Final validation and internal completion boundaries; accepted attempts must not be relabelled.
- First invalidation versus interruption and repeated/mixed shutdown calls.
- Ownership after a Git cleanup timeout and eventual confirmed exit, plus caller-owned injected execution.
- Preservation of ordinary callback policy and the explicitly limited opening scope.

No live inference was used and no production agent instructions changed. Test success
is not a claim of hard in-process interruption or comprehensive opening-path correctness.

## Findings return

If you have repository write access, use [the findings template](../../../dev/templates/review-findings.md),
create `2026-11-25-terminal-lifecycle-round-1-findings.md` in this directory, and
commit only that record. Include the reviewer, handoff, exact target and scope,
method, verification, actionable findings, non-defect observations, unverified areas
and gate recommendation. Preserve your report under `## Returned findings`.
Subsequent rounds increment the round number and identify the prior findings and
target. If you cannot write to the repository, return the findings to the human.

## Review gate

Implementation pauses at this checkpoint for human-arranged independent review.
The implementing agent incorporates clearly in-scope findings under the review
workflow. The human determines when review is sufficient to continue retirement.
Material corrections require further review as appropriate. A clean report alone
authorizes neither task closure nor merging; a final integrated review remains due.

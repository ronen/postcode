# Module investigation milestone 2: round 1 corrections

Date: 2026-09-29
Implementing-agent validation, not independent review or milestone acceptance.
Target: `df2bdb07b8b0b3c7149a11e36a9bfbbd44c8b4e0`
Reviewed baseline: `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`
Runtime: Node.js 22.13.1, repository-pinned dependencies.

## Corrections and focused checks

`npm run check` and `npm run build` passed. Running
`node --test _build/test/investigation-integration.test.js` passed 23 tests,
zero failed/cancelled/skipped, approximately 13.70 seconds.

Committed regressions cover:

- Usage for call 1 delivered during call 2, guaranteeing that its reply has
  already settled. One-shot summary, shell summary and subsequent shell usage
  agree with command observations: two calls, no missing reports, input total 40
  synthetic tokens. Existing closed-dialogue late usage/reply rejection remains
  covered.
- Known investigram references supplied to all currently available focused
  unsupported lenses (`children`, `parents`, `summarize`). They report unsupported
  subject/lens combinations, failed command observations and no additional
  investigator invocation. Existing foreign/missing inspection selection remains
  covered separately.
- A human shell report interrupted in its second attempt, preserving individual
  attempt counts/termination and totals (20 input tokens per attempt, 40 session
  input tokens), plus a one-shot interruption with unknown-only usage and no
  stray blank line. Both drive the production CLI and compiler worker.
- Corrected-subject and correction-evidence attribution in human summary and
  inspection, alongside retained original trees and explicit replacement links.

## Complete suite

Two complete `npm test` runs were performed against the same implementation:

| Run | Total | Passed | Failed | Cancelled | Duration |
| --- | --- | --- | --- | --- | --- |
| First, while review records were being added | 365 | 363 | 2 | 0 | 123.09 seconds |
| Second, worktree held stationary | 365 | 365 | 0 | 0 | 112.56 seconds |

The first run failed `one-shot sessions own a project, produce correlated views,
and release their state` with `SessionInvalidated`, and
`idle Ctrl-C discards its input line and EOF finishes the next accepted command
(dumb)` with exit 2 instead of 0. Both exercise repository-backed sessions; review
records were created/updated during that run. Concurrent repository edits are a
plausible source of those invalidations. The repeat held repository contents still
and passed both tests and the entire suite without a code change. This is distinct
from the historical execution-ownership cancellations and does not diagnose them.
The first run is retained here rather than counted as a pass.

`git diff --check` and changed-document local link resolution passed. No separate
isolated execution-ownership run was performed in this correction round; all 13
ownership tests passed in the complete stationary run.

## Limits and standing qualification

F1's reported after-reply case is corrected, but code inspection identifies a
remaining parent/worker closing-window race. The parent can receive usage before
its dialogue closes but after the worker has finalized its view snapshot.
Human direction on finalizing CLI views from authoritative parent usage has been
requested. The current correction does not claim that remaining case resolved.

The historical execution-ownership cancellations remain unexplained. The human
renewed deferral through milestone 2, requiring diagnosis before milestone 3's
live, cost-bearing adapter work. Previous cancelled full runs, isolated passes,
and the reviewer's three complete 360-test passes remain separate evidence; none
is a diagnosis. This validation remains qualified by that concern. No cancellation
policy or ownership test was changed; no hosted adapter, credentials, live inference,
source-informed assessment or baseline diagnosis was undertaken.

See the [disposition](../../reviews/module-investigation/2026-09-29-milestone-2-disposition.md)
and [backlog evidence](../../../docs/backlog.md#diagnose-execution-ownership-cancellations-in-full-suite-runs).

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

At the first correction target, F1's reported after-reply case was corrected, but
code inspection identified a remaining parent/worker closing-window race. The parent can receive usage before
its dialogue closes but after the worker has finalized its view snapshot.
Human direction was requested before resolving this additional case. The approved
completion and its verification are recorded below; this limit is now resolved.

The historical execution-ownership cancellations remain unexplained. The human
renewed deferral through milestone 2, requiring diagnosis before milestone 3's
live, cost-bearing adapter work. Previous cancelled full runs, isolated passes,
and the reviewer's three complete 360-test passes remain separate evidence; none
is a diagnosis. This validation remains qualified by that concern. No cancellation
policy or ownership test was changed; no hosted adapter, credentials, live inference,
source-informed assessment or baseline diagnosis was undertaken.

See the [disposition](../../reviews/module-investigation/2026-09-29-milestone-2-disposition.md)
and [backlog evidence](../../../docs/backlog.md#diagnose-execution-ownership-cancellations-in-full-suite-runs).


## Approved F1 completion: closure-boundary snapshot

Final target: `849267193a6d75113d2deb33c8a1b481f916fa4e`.
The human approved finalizing CLI usage from the parent ledger snapshot taken at
dialogue closure. Parent closure seals immutable call reports before abort or
local close callbacks, and subsequent worker metadata cannot replace them.
Command views, later usage views and observations use that same acceptance
boundary. Finalization updates view identity/rendering without changing retained
accounts or interpretation projection identity.

Final checks:

| Check | Result |
| --- | --- |
| `npm run check` | Passed |
| `npm run build` | Passed |
| `node --test _build/test/investigation-integration.test.js` | 25 passed; 0 failed/cancelled/skipped; 14.59 seconds |
| `npm test` with the worktree held stationary | 367 passed; 0 failed/cancelled/skipped; 130.80 seconds |
| Whitespace and changed-document local links | Passed |

The two new regressions run the actual shell, investigator double and compiler
worker in JSON and human formats. A test-local interception of the real worker's
close-message delivery places reports exactly after the worker's dialogue closes
but before the parent handles closure; no timer approximation, synthetic worker,
production test hook or public flag is used. The worker's returned snapshot is
asserted to have two unknown calls, proving the window was exercised.

Call 1 reports normally and repeats the identical report in the closing window;
call 2 first reports in that window and repeats its report there. Call 3 first
reports after parent closure. A differing call-1 report is also delivered after
closure. The command view, subsequent `usage` view and both command observations
all agree: three calls, one unknown, zero anomalies, 40 synthetic input tokens,
and raw report counts `[1, 1, 0]`. Rendered human/JSON output matches the finalized
view. Finalization is idempotent, and changing the reporting snapshot changes view
identity without changing projection identity. The existing tests continue to
cover after-reply reports, interrupted final reporting and closed-dialogue late
reply/usage rejection.

No separate isolated ownership run was performed; the complete run includes all
13 execution-ownership tests. The standing cancellation qualification and required
diagnosis before live, cost-bearing adapter work remain unchanged. No credentials,
hosted adapter or live inference were used. All review findings are dispositioned;
these implementing-agent checks do not themselves accept the milestone gate.

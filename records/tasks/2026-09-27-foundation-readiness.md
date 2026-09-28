# Foundation readiness

Status: active
Opened: 2026-09-27
Closed:

## Task

Please implement the approved plan at docs/plans/foundation-readiness.md -- This is explicit authorization\
to begin the substantive implementation task described by that plan

## Follow-ups

### 2026-09-27 — Idle Ctrl-C correction

Context: The repaired sink assertion exposed a pre-existing shell bug: idle Ctrl-C
leaves the discarded line intact under `TERM=dumb`, so the next command becomes
`discard-thismodules`. Asked whether to include the correction because this
changes an outcome outside the plan's listed exceptions.

Human response:

Include the Ctrl-C correction (recommended)

### 2026-09-28 — First review disposition and corrections

The first review round is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-09-28 — Composition qualification policy

Context: Asked whether composition classification should consider only a context's
primary producer or any inherited method, resolving the round-1 review uncertainty.

Human response:

only the primary producer, as recommended

### 2026-09-28 — M2 acceptance and M3 continuation

Context: Round 2 reported no remaining issues. Asked whether the human accepted the
M2 gate as satisfied and authorized proceeding to M3.

Human response:

Accept M2 and proceed to M3

### 2026-09-28 — M3 first review disposition and corrections

Context: This follow-up concerns the first M3 acquisition/lifetime review.

The first review round is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-09-28 — Case-insensitive missing output suffix investigation

Context: The M3 reviewer identified unresolved uncertainty about a missing output-boundary suffix whose spelling differs only in case on a case-insensitive filesystem. Asked whether to investigate now alongside F1.

Human response:

Investigate now; fix a confirmed defect within the existing boundary policy (recommended)

### 2026-09-28 — M3 second review disposition and corrections

Context: This follow-up concerns the second M3 acquisition/lifetime review.

The second review round is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-09-28 — F2 unknown case handling policy

Context: Asked whether to remove the directory-listing requirement while preserving explicit failure when case handling cannot be established, rather than adopting a guessed default.

Human response:

Preserve explicit failure; improve detection and diagnostic (recommended)

### 2026-09-28 — M3 round-2 uncertainty investigation

Context: Asked whether to investigate validation adding observations, per-directory case rules, and paths crossing filesystems, and fix confirmed defects within the existing policy.

Human response:

Investigate now; fix confirmed defects within existing policy (recommended)

### 2026-09-28 — M3 acceptance and filesystem defect deferral

Context: The re-review follows the local F2 and validation corrections. The two
filesystem defects concern per-directory case rules on one device and lexical
paths crossing filesystems with different case rules.

the re-review is complete, no further findings.  OK to defer those filesystem defects.  M3 is acctepted.

## Outcome

Implementation checkpoint, 2026-09-28 (task remains active): M4 is implemented in
`5e732dfcfeffb700570c7a5fd7591b4486a72446`. Stately owns the four planned generic
graph operations behind a private adapter. Selected immutable inputs supply the
processing indexes. Terminal layout uses display cells and grapheme boundaries;
strict Node option scanning implements the approved grammar. Presentation advances
to version 26. The implementation conventions now describe the graph boundary,
index lifetime/order, strict scanner, and shared terminal fit/layout calculation.
These operationalize the approved plan and graph decision without changing the
governing architecture. M3's two filesystem defects remain explicitly deferred.
Integrated comparisons, measurements and the M5 review gate remain outstanding.

M5 handoff checkpoint, 2026-09-28: planned implementation and integrated
verification are complete at `9f8c8bd85e94428b11abb5b415e98cebb1f50901`.
The [integrated review handoff](../reviews/foundation-readiness/2026-09-28-m5-integrated-handoff.md)
is committed in `89838cc`. The agent has stopped for human-arranged review;
the task remains active and no M5 acceptance or closure is inferred. The two
filesystem defects remain explicitly deferred as authorized above.

## Verification

M4 checkpoint: type checking and all 294 tests pass on the final application source.
The graph/index checkpoint matched 72 CLI comparisons against accepted M3 before
the intentional terminal version change. Final version-aligned and session-order
comparisons are in progress; this is not final acceptance or task closure.

Integrated verification: 294/294 tests and type checking pass. The graph/index
checkpoint matches 72 full CLI comparisons against accepted M3; the final build
matches 72 presentation-version-aligned comparisons and 288 fresh/accumulated/
reordered/retained-session comparisons. Eight before/after journeys and 16 real
publication CLI measurements completed across 80-module fixtures with 240 and
2,400 non-module artifacts. All publication samples exit 0 without warnings.
The [validation record](../validation/foundation-readiness/2026-09-28-m4-m5.md)
preserves exact builds, C01–C23 dispositions, dependency review, measurements,
intentional changes, an earlier failed test attempt and the passing stable rerun,
native verification limits and remaining qualifications. Full CLI timing changes
are modest; no aggregate pre-plan speedup or broad platform guarantee is claimed.

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

## Outcome

## Verification

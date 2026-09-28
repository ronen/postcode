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

## Outcome

## Verification

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

## Outcome

## Verification

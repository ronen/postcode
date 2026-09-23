# One-shot session conversion review: disposition

Record type: disposition
Date: 2026-09-23
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Handoff: [One-shot session conversion review](2026-09-23-one-shot-handoff.md)
Findings: [Round 1](2026-09-23-one-shot-round-1-findings.md)

## Findings and dispositions

F1 accepted and corrected in `3846f1f`. Selector-mode adaptation now applies only
at `view.projection.parameters`; display-row `reference` values remain compared.

The input-basis collision observation is accepted as a requirement for the next
stage: existing claim support must remain immutable when dependencies acquire
additional inputs. Stable allocation, ambiguity recovery, invalidation, command
observations and interruption remain the planned subsequent work, not defects in
the one-request checkpoint. Memory verification will distinguish retained live
state from process RSS high-water marks and check release after closing. The
textual namespace-substitution concern will be considered alongside binding
identity; no silent collision recovery is permitted. The review's unverified
PostCode output and human inspection remain explicit final validation work.

## Corrections and verification

Rebuilt baseline `8dccbfd` and the current implementation with the pinned compiler.
All 54 fixture comparisons passed with the narrowed filter. A JSON-only mutation
check accepted the selector-parameter adaptation and rejected a changed display
row marker at `view.display.rows[0].reference`. `git diff --check` passed.
No runtime code changed for F1; its verification is proportional to that scope.

## Review rounds

Round 1 reviewed `45205c54c908d70c618caa9bb03187bf0bd5e887`, relative to
`8dccbfd`. Returned findings remain unchanged in the linked record.

## Gate conclusion

The human explicitly authorized fixing the finding, disposing of the notes with
implementation judgment, recording this disposition, and continuing implementation.
Those conditions are satisfied. The one-shot gate is cleared; the task remains
active for accumulation, the shell and final integrated verification/review.

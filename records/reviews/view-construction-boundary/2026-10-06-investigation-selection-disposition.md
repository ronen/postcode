Record type: disposition

# Retained investigation selection checkpoint: disposition

Date: 2026-10-06
Task: [Construction boundary](../../tasks/2026-10-05-view-construction-boundary.md)
Handoff: [Retained investigation selection](2026-10-06-investigation-selection-handoff.md)
Findings: [Round 1](2026-10-06-investigation-selection-round-1-findings.md)
Status: accepted and corrected; human authorized continuation without re-review

## Actionable findings

**F1 — Accepted, option (a), explicitly selected by the human.** Unavailable
selections retain only `kind`, `code` and `diagnostic`. The store rejects extra
provider reporting fields. Provider status/body/request ID stay in invocation
reporting and the eventual View, where arrangement identity distinguishes them.
The proposal clarification is recorded in `a4353df`. Tests show differing provider
IDs and bodies produce the same retained selection, changed diagnostics produce
different selections, and the supplied reporting value remains intact.

**F2 — Accepted and corrected.** `children` and `parents` require the unsupported
investigram case. A supported single-subject operation cannot have a no-evaluation
outcome. Construction goes through the same store validator, so both entry points
enforce the rule. Tests cover rejected construction and direct insertion; previous
identity tests now use a valid unavailable outcome for a single supported subject.

Type checking, build and all 15 selection/revision tests passed after these
corrections. The reviewer's independent 484-test run and 875-result comparison
apply to the reviewed target, not these corrections; subsequent integration will
receive its own full verification.

## Non-defect observations

All five observations are accepted as reported.

1. **Derived IDs:** current stores enforce immutable content and reference validity,
   while constructors derive IDs. This existing convention is retained; the
   review explicitly identifies the observation as a non-defect.
2. **Two account predicates:** the stated retention invariant makes them agree for
   current production records. No behavior change is needed for this checkpoint.
3. **Mechanical binding populations:** coordination continues to own them. CLI
   integration must preserve its existing allocation schedule without broadening
   the investigation binding port.
4. **Method registration:** the new method enters both session metadata and the
   captured `analysis-inputs` value, changing that input record's ID. Integrated
   comparisons must explicitly account for both; the earlier verification record
   described only the session-method effect. This disposition records the
   additional effect without altering the historical review or handoff.
5. **Snapshot size:** complete snapshots and their dense-history cost are the
   approved strategy. The reviewer did not characterize performance or memory;
   no such evidence is claimed here.

## Gate conclusion

The human selected F1(a), waived re-review and explicitly authorized continuation
after handling the findings. Both actionable findings are corrected. There is no
rejected finding or remaining reviewer uncertainty to carry through this gate.
The deferred CLI, associated-selection, usage and identity integration remains
required, including its output/observation comparisons. Final integrated review
and explicit approval to close the task remain mandatory.

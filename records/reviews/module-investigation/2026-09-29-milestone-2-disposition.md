# Module investigation: shell and session integration review disposition

Record type: disposition
Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 2](2026-09-29-milestone-2-handoff.md)
Findings: [Round 1](2026-09-29-milestone-2-round-1-findings.md)

## Findings and dispositions

| Finding | Disposition | Basis and action |
| --- | --- | --- |
| F1 — worker/parent usage disagreement | Accepted and corrected | `df2bdb0` keeps worker usage callbacks alive through dialogue close. The human-approved completion in `849267193a6d75113d2deb33c8a1b481f916fa4e` seals parent call reports at its closure boundary, before abort/close callbacks, and finalizes CLI views from those snapshots. Observations and subsequent usage views use the same accepted reports. Deterministic human and JSON regressions deliver usage after worker closure but before parent closure, verify identical totals without duplicate counting, and preserve unknown/ignored treatment after closure. |
| F2 — known investigram reference called unknown | Accepted and corrected | Known investigram references supplied to `children`, `parents` or `summarize` return an explicit unsupported subject/lens selection and expected failure status. No module coercion or investigation occurs. A production shell regression covers all three commands and confirms only the preceding summary opened a dialogue. Missing/foreign references keep their missing status. |
| F3 — incomplete human abnormal usage report | Accepted and corrected | Final human stderr lists each attempt and termination, its reported categories, and session totals through the shared usage renderer. Unknown-only reporting contains no stray blank line. Real CLI interruption regressions cover both multiple attempts and one unknown-only attempt; observations retain the same usage. |
| F4 — correction attribution omitted in human output | Accepted and corrected | Each human correction now prints its explicit corrected subjects and own evidence IDs next to its reporter, target, replacement, reason and qualifications. Summary and inspection regressions check the correction attribution; the support list remains supplementary. Raw evidence IDs are attribution keys, not newly selectable shell subjects. |

F2–F4 and the first F1 correction are in `df2bdb0`. The investigation presentation
method advances to version 2 for the changed selection and presentation semantics.
The approved F1 completion advances that method to version 3: finalized usage is
part of view identity separately from interpretation projection identity. The
architecture account and CLI reference describe the closure boundary and reporting
authority. No retained interpretation or acceptance policy changed.

## Non-defect observations and residual limits

The positive assessments of selection/reuse, atomic retention, exact immutable
references, interruption, usage arithmetic, configuration unavailability, source
disclosure and milestone scope remain applicable. The inaccurate atomic-publication
comment is corrected: the domain validity check returns across a microtask boundary,
then the evaluator checks abortion and publishes synchronously. No retention policy
or validity guarantee changed.

The remaining observations are preserved as limits rather than claimed fixes:
inspection may allocate undisplayed stable bindings; raw evidence IDs are not
selectable shell references; a non-cloneable broken adapter response causes a
transport defect; human usage labels show provider/model while JSON retains the
full configuration identity. The existing implementation still distinguishes
configurations in arithmetic. No hosted adapter or live behavior was assessed.
Reviewer scratch probes are not treated as committed regressions. The unprobed
shell invalidation-during-evidence and worker-crash-during-exchange cases are not
claimed covered by this correction; multi-attempt interrupted human reporting
now has committed regression coverage.

## Cancellation qualification

The human renewed deferral through milestone 2, with diagnosis required before
milestone 3's live, cost-bearing adapter work. The reviewer passed all 360 tests
three times at the reviewed target and did not diagnose the earlier cancellations.
The implementation's earlier full-suite cancellations and isolated successes
remain distinct evidence. Validation remains qualified by unresolved uncertainty
about the execution-ownership lifecycle. This is neither a diagnosed harness
artifact nor an established regression introduced by investigation. The
[backlog entry](../../../docs/backlog.md#diagnose-execution-ownership-cancellations-in-full-suite-runs)
retains reproduction commands, baseline, affected tests and results, and now records
the human's prerequisite for live adapter work.

## Corrections and verification

At `df2bdb0`, type checking and build passed; all 23 focused integration tests
passed with zero failures/cancellations (about 13.70 seconds). A complete stationary-worktree run passed all 365 tests with zero failures or
cancellations (112.56 seconds). An earlier complete run passed 363 and failed two
repository-backed session tests with invalidation while review records were being
added; it had zero cancellations. Both runs and the inference about concurrent
edits are preserved in the [correction validation](../../validation/module-investigation/2026-09-29-milestone-2-round-1-corrections.md).
Whitespace and local documentation links passed. These are implementing-agent checks. The original
handoff and reviewer-authored findings remain unchanged.

The final F1 target `849267193a6d75113d2deb33c8a1b481f916fa4e` passed type checking,
build, all 25 focused integration tests (14.59 seconds), and all 367 full-suite
tests (130.80 seconds), with zero failures/cancellations/skips. The worktree was
held stationary during that complete run. The closing-window regressions use the
real CLI and compiler worker, interposing only on delivery of its close message
so the callback timing is deterministic. They establish that the worker snapshot
missed two calls' reports, while the authoritative snapshot accepts one of those
reports before parent closure and leaves the other unknown after closure. Both
views and observations agree on three calls, one unknown, zero anomalies and
40 synthetic input tokens. These checks do not diagnose historical cancellations.

## Review rounds and gate conclusion

Round 1 reviewed `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`. The reviewer recommends acceptance
after F1 is corrected or explicitly dispositioned, with F2–F4 corrected or deferred
by human direction. All four findings are now corrected. The focused F1 completion
implements the human's explicit closure-boundary ruling within the existing
parent-ledger design; it does not revise the review's retention or reference
analysis. No further independent round is imposed by these local corrections;
the human determines whether the accumulated review is sufficient and has not yet
accepted the milestone-2 gate. No milestone-3 implementation or live inference has begun.

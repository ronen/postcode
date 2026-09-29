# Module investigation: shell and session integration review disposition

Record type: disposition
Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 2](2026-09-29-milestone-2-handoff.md)
Findings: [Round 1](2026-09-29-milestone-2-round-1-findings.md)

## Findings and dispositions

| Finding | Disposition | Basis and action |
| --- | --- | --- |
| F1 — worker/parent usage disagreement | Accepted; correction in progress | `df2bdb0` separates pending replies from dialogue-lived worker usage callbacks. A report received after its reply remains attributable until dialogue close. Deterministic one-shot and shell regressions deliver call 1 usage during call 2 and compare the view and observation, including the later `usage` view. Code inspection also identifies a closing-window race: the parent can receive usage after the worker snapshot but before parent dialogue close. Human direction has been requested on finalizing CLI views from the parent snapshot; F1 remains open pending that ruling and correction. |
| F2 — known investigram reference called unknown | Accepted and corrected | Known investigram references supplied to `children`, `parents` or `summarize` return an explicit unsupported subject/lens selection and expected failure status. No module coercion or investigation occurs. A production shell regression covers all three commands and confirms only the preceding summary opened a dialogue. Missing/foreign references keep their missing status. |
| F3 — incomplete human abnormal usage report | Accepted and corrected | Final human stderr lists each attempt and termination, its reported categories, and session totals through the shared usage renderer. Unknown-only reporting contains no stray blank line. Real CLI interruption regressions cover both multiple attempts and one unknown-only attempt; observations retain the same usage. |
| F4 — correction attribution omitted in human output | Accepted and corrected | Each human correction now prints its explicit corrected subjects and own evidence IDs next to its reporter, target, replacement, reason and qualifications. Summary and inspection regressions check the correction attribution; the support list remains supplementary. Raw evidence IDs are attribution keys, not newly selectable shell subjects. |

F2–F4 and the first F1 correction are in `df2bdb0`. The investigation presentation
method advances to version 2 for the changed selection and presentation semantics.
The architecture account and CLI reference describe these behaviors.

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

## Review rounds and gate conclusion

Round 1 reviewed `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`. The reviewer recommends acceptance
after F1 is corrected or explicitly dispositioned, with F2–F4 corrected or deferred
by human direction. F1 remains open as recorded above. The human has not accepted
the milestone-2 gate. No milestone-3 implementation or live inference has begun.

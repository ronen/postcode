# Module investigation: shell and session integration review disposition

Record type: disposition
Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 2](2026-09-29-milestone-2-handoff.md)
Findings: [Round 1](2026-09-29-milestone-2-round-1-findings.md), [Round 2](2026-09-29-milestone-2-round-2-findings.md), [Round 3](2026-09-29-milestone-2-round-3-findings.md)

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


## Round 2 and human-directed source-disclosure correction

Round 2 independently reviewed `849267193a6d75113d2deb33c8a1b481f916fa4e` and
confirmed F1–F4 corrected, with no new defects in those fixes and no further round
needed for them. The reviewer passed type checking, all 367 tests (133.7 seconds,
zero failures/cancellations/skips), the original delayed-usage probe, and a new
source-disclosure probe. This supersedes the earlier gate discussion about whether
the local corrections needed re-review; that focused re-review has now occurred.

| Round-2 item | Disposition | Basis/action |
| --- | --- | --- |
| F1–F4 correction confirmations and publication comment | Accepted; independently verified | The reviewer confirms usage closure, unsupported selection, final human usage and correction attribution, including identity/version handling. No further change to those fixes. |
| Source-escape events with no disclosed source | Accepted as pre-existing nonconformance; corrected | The human explicitly authorized correction within this task, including existing affected commands, under the governing actual-disclosure decision. `b408c414b041f032a8954ca450c9cbe30dded139` classifies actual supported source fields by view family and output format. The requested option stays in the request; empty containers and reference/omission metadata do not cause events. Events identify actual locations and/or excerpts. |
| Residual limits and unprobed lifecycle cases | Acknowledged, unchanged | Undisplayed bindings, raw evidence IDs, non-cloneable reply defects, human usage identity labels, shell invalidation during evidence work and worker crashes during exchange retain their previously recorded limits; the new tests do not claim to resolve them. |
| Cancellation uncertainty and gate recommendation | Qualification retained; acceptance remains human-owned | Round 2 did not diagnose cancellations. Human-authorized deferral through milestone 2 and diagnosis before live adapter work remain in force. Reviewer acceptance advice is not treated as human acceptance. |

The reviewer's suggestion to handle source observations separately is superseded
by the human's explicit scope direction. This was a local observation-boundary
correction, not a broader redesign. Rendered source remains unchanged, so a missing
organization selection can still disclose a repository-root path in JSON and must
record it; human output omits that path and records no escape. Locations count
without excerpts, and empty excerpts do not falsely count as source text.

The [source-disclosure validation](../../validation/module-investigation/2026-09-29-milestone-2-source-disclosure.md)
records the exact target, command matrix and results: type checking/build passed,
45 targeted tests passed (48.56 seconds), and all 369 full-suite tests passed on a
stationary worktree (130.37 seconds), with zero failures/cancellations/skips.
Whitespace and local links passed. The human explicitly requested inclusion in
the milestone handoff; a dated addendum preserves the original handoff text while
recording this correction, verification and standing qualification.

All actionable findings and the newly authorized observation are corrected.
The task remains active at the milestone-2 gate pending human acceptance. The
round-2 clearance covers F1–F4 at its pinned target; the subsequent disclosure
correction has implementing-agent verification and is separately identified for
any further review the human arranges. Milestone 3 has not begun.


## Round 3 assessment — 2026-09-30

Round 3 independently reviewed source-disclosure target
`b408c414b041f032a8954ca450c9cbe30dded139`. The reviewer compared each classifier
branch with its renderer, passed type checking and all 369 tests (133.4 seconds,
zero failures/cancellations/skips), and reran the missing/unsupported-reference
probe with a positive disclosure control in both formats. No new findings were
reported. The implementing agent accepts the assessment that the correction
conforms to the actual-disclosure decision and leaves the round-2 fixes intact.

| Round-3 item | Disposition | Basis/action |
| --- | --- | --- |
| Source-disclosure correction and positive/negative controls | Accepted; independently verified | Request intent is retained; actual format-specific locations and nonempty excerpts determine events and forms. Empty selection/container cases and genuine location-only disclosure behave as required. No runtime correction is indicated. |
| Correction to round-2 wording | Accepted | Shared mechanical behavior was pre-existing nonconformance, not an adopted convention. The reviewer now confirms this explicitly; the human-authorized correction and earlier disposition already use that interpretation. |
| Maintenance coupling between renderer and classifier | Accepted risk; approved safeguard added | The classifier models renderer output separately. Current tests establish current behavior but cannot automatically cover future fields. The human approved brief cross-references, now placed beside source-detail rendering in all four view families. They point to the classifier and regression tests and explicitly include changes to JSON source fields. This is a maintenance reminder, not a structural guarantee against future drift. |
| Paths outside sourceDetail | Unassessed; human-approved backlog follow-up | The reviewer did not assess ordinary JSON/context paths against the disclosure decision. The human directed recording an unassessed follow-up without expanding this milestone. The [backlog entry](../../../docs/backlog.md#assess-disclosure-classification-for-paths-outside-sourcedetail) preserves the question without claiming compliance or a defect, or authorizing a classification change. |
| Handoff addendum traceability | Acknowledged; no correction needed | The previous human explicitly requested inclusion of the correction and verification in the handoff. Its dated addendum preserved the original text; the review notes that authorization. No new handoff edit is needed for this assessment. |
| Cancellation uncertainty | Existing human-approved qualification retained | The reviewer's fifth complete passing run does not diagnose historical cancellations. Diagnosis remains required before milestone-3 live, cost-bearing adapter work. |

The reviewer recommends milestone-2 acceptance with that qualification. The
implementing agent agrees that no defect in the reviewed target remains open.
Both observation choices have been resolved by the human as recorded above;
explicit milestone acceptance remains pending. Only source comments, the backlog
and review/task records changed. Whitespace and cross-reference/link checks passed;
no runtime code, governing document or development instruction changed, and no new
tests were required or rerun. The independent 369-test result remains the evidence
for the unchanged runtime implementation.
The authored findings and handoff remain unchanged. The task remains active;
milestone 3 has not begun.

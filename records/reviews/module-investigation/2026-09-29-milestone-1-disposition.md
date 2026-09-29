# Module investigation: domain execution review disposition

Record type: disposition
Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 1](2026-09-29-milestone-1-handoff.md)
Findings: [Round 1](2026-09-29-milestone-1-round-1-findings.md)
State: F1–F6 corrected under human direction; bounded F7 and cancellation investigation in progress

## Findings and dispositions

### F1 — replacement associations

**Accepted and corrected under the human's explicit-subject ruling.** Corrections
now require nonempty, distinct program-subject references in `correctedSubjects`.
The corrected investigram remains separately identified by `target`. Replacement
roots receive qualified associations only to those explicitly named subjects;
no subject is inferred from an originating request. Regression tests cover a
clarification/examination chain, a subordinate account describing a different
module, and rejection of empty, duplicate or investigram corrected subjects.

### F2 — provider usage anomalies

**Accepted and corrected under the human's retain-with-anomalies ruling.** Every
distinct report is retained, with anomalies for invalid amounts, missing parents,
cycles, duplicate categories, subsets exceeding their parent and differing call
updates. Identical reports are deduplicated. A call with unresolved accounting
has `reported: null`, so downstream trusted totals cannot silently select or add
uncertain figures. The complete raw reports remain available. Duplicate actual
call identities remain a separate programming error. Regression tests preserve
both accepted and failed investigation outcomes despite unusual usage reports.

### F3 — oversized evidence responses

**Accepted and corrected** in `1de634a29e0ba07a42091d0718f286462f77e3f4`.
Before delivery, each mechanical/source evidence response is bounded to 60,000
serialized UTF-16 code units. A larger response becomes a small, explicitly
unavailable tool response with the omitted size and record/reference counts,
coverage qualification and suggested narrower-subject access. It does not
establish an empty population or terminate the dialogue. Withheld records do not
enter supplied-evidence provenance; acquired captures remain retained.

The test acquires a real mapped source file larger than the cumulative dialogue
guard and also supplies an oversized organization response at the evidence
boundary. The investigator receives unavailable responses, continues and submits
a qualified accepted result. The architecture account describes the delivery
bound and the separate cumulative guard. Acquisition remains full-file and has
no streaming/range selector; the response bound does not claim to bound
acquisition memory. No range capability is required to make oversized evidence
explicitly unavailable under the approved plan.

### F4 — citation of correction reporters

**Accepted and corrected under the human's reporter-citation ruling.** Delivering
a correction's reasons and qualifications records exposure to its reporting
investigram. That citation does not grant complete account context or correction
eligibility. Tests distinguish reasons delivered with `parts: []` from correction
content withheld by bounds, and cover reporter citations in correction chains.

### F5 — empty excerpt citations

**Accepted and corrected** in `1de634a29e0ba07a42091d0718f286462f77e3f4`.
An empty or whitespace-only prose excerpt, without referent or qualification
content, no longer records exposure. This does not suppress a citation when
other substantive account fields were delivered. The zero-character excerpt
regression asserts both no citation and no complete-target eligibility; later
substantive delivery and separately accumulated complete parts remain tested.

### F6 — rejection-test specificity

**Accepted and corrected** in `1de634a29e0ba07a42091d0718f286462f77e3f4`.
The rejection table now asserts each exact rejection reason. Its cyclic exchange
case explicitly identifies dialogue serialization as the rejecting boundary.
Separate direct acceptance tests assert cycle and acyclic shared-node rejection,
and the dialogue suite also covers a shared child object. The former misleading
`unseen-target` and `same-result` labels now identify the module-target and
local-ID-target cases they actually exercise.

A distinct acceptance test constructs the exact identity that would be assigned
to this submission's root and verifies that it cannot be a correction target.
The existing earlier-but-undelivered context case remains. These assertions
distinguish intended boundary checks from unrelated generic failures.

### F7 — artifact acquisition and compiler input basis

**Investigation authorized; current policy preserved pending human assessment.**
The regression exercises README acquisition through the evidence boundary after
organization materialization, followed by partial and complete mechanical queries.
It confirms one new partial attempt on the advanced input basis, reuse on the
next query, reuse of completed work, and immutability of earlier evaluations and
claim-context input references. The new retry-basis analysis-input record includes
the README read; previously established claim contexts keep their earlier basis.

No compiler/documentation input separation or retry-policy change was made. The
human has been asked whether to accept this demonstrated shared-basis behavior
with regression coverage, or keep F7 open for a separate design decision.

## Non-defect observations and residual limits

The six verified observations are acknowledged without dispute: qualified
symbol/alias documentation; source access through the shared host and exclusions;
whole-result validation; guard/cancellation handling and final reports; the
post-submission validity check outside the generation deadline; and the documented
context metadata bound. The corrections above preserve these boundaries.

The review's first full run cancelled 13 execution-ownership tests, while its
isolated and subsequent full runs passed. The authorized comparison reproduced
the same 13 cancellations on the pre-implementation baseline (283 passed, zero
failed), with the same pending-promise error. Both baseline and corrected
isolated execution-ownership runs passed all 13 tests. This establishes that the
pattern predates the implementation; its cause remains unresolved. The human
has been asked whether to defer diagnosis explicitly or keep it open before gate
acceptance. The corrected full-suite run is in progress.

No hosted provider, credentials or live inference were exercised. Retention,
reconsideration and display remain later milestones. These review limits are
preserved, and neither a passing scripted suite nor the review recommendation
establishes their correctness or interpretive usefulness.

## Corrections and verification

Correction commits: `1de634a29e0ba07a42091d0718f286462f77e3f4` (F3, F5, F6),
`f5a974d` (F1, F2, F4 and the F7 regression).

- Type checking and build passed.
- All 34 investigation tests passed, without failures, cancellations or skips.
- The README regression passed for partial and complete mechanical work.
- Baseline and corrected isolated execution-ownership runs each passed 13 tests.
- Baseline full suite: 283 passed, zero failed, 13 cancelled (296 total).
- Corrected full suite: in progress.
- `git diff --check`: passed.

Investigation semantics advanced to `postcode/investigation@3`. No dependency,
CLI capability, governing document or development-process file changed.

## Review rounds

Round 1 reviewed `d4260522c2abf0530de076c05944f531de003e4b` against
`c15afdd3b03f588534ac386c2453c81da71ffb68`; its findings remain unchanged.
The correction target is `f5a974d`. No further independent round has occurred.

## Gate conclusion

F1–F6 are corrected. Human assessment is pending on the demonstrated F7 behavior
and deferral of the pre-existing cancellation pattern's unresolved diagnosis.
The reviewer considers a further independent round unnecessary if F1 and F2
corrections are small and verified; the human retains the gate decision.
The task remains active at milestone 1; milestone 2 has not begun. No finding
was rejected or materially qualified without human approval.

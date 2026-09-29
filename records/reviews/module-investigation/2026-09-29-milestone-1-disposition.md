# Module investigation: domain execution review disposition

Record type: disposition
Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 1](2026-09-29-milestone-1-handoff.md)
Findings: [Round 1](2026-09-29-milestone-1-round-1-findings.md)
State: clear corrections implemented; human direction pending on remaining choices

## Findings and dispositions

### F1 — replacement associations

**Accepted; resolution requires human direction.** The implementation derives
`corrected-subject` associations from the target's originating request. That
request can select an uncorrected investigram or concern a different module
from the subordinate account actually corrected. The code, existing assertion
and architecture description agree with each other but codify the reported
misattribution. This contract should be corrected before retention begins.

Proposed for human approval: corrections explicitly identify the subjects whose
accounts they correct; `correction.target` identifies the corrected investigram
separately. Do not infer corrected subjects from the originating request or copy
all earlier associations. This proposal is not yet an adopted representation or
implemented change. The human was asked before choosing the contract.

### F2 — provider usage anomalies

**Accepted; resolution requires human direction.** Provider-reported category
anomalies and differing updates currently throw through the communication
callback and can discard the investigation as a defect. Usage accounting should
preserve the distinction between uncertain accounting and investigation failure.

The reviewer offers consequential alternatives. The human was asked to choose
between retaining distinct reports with explicit anomalies and excluding
unresolved figures from trusted totals, or marking call usage unknown with a
diagnostic. The former is recommended, not implemented or assumed approved.
Duplicate call identity remains conceptually distinct from an unusual provider
report; no usage policy change has been made pending that choice.

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

**Requires human direction; no rejection or semantic ruling made.** The code
delivers correction reasons/qualifications but records citation exposure only
from account fields. The reviewer explicitly identifies an unresolved reading
of accompanying correction content. Changing this affects later reconsideration
causes and cannot be silently treated as an implementation detail.

The human was asked whether delivering a correction's reason or qualifications
must cite its reporting investigram. Citing the reporter is recommended, but no
change or governing interpretation has been adopted pending the ruling.

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

**Requires human direction before proceeding with the reviewer's uncertainty.**
The reviewer identifies a shared-input revision consequence and notes that it
fits the existing partial-retry rule, but asks for confirmation of intent and
regression coverage. This has not been rejected, classified as harmless or
accepted as settled policy.

The human was asked to authorize a bounded regression investigation: preserve
the current shared input-basis policy, exercise a mechanical query after README
acquisition, and report observed retry/reuse and input attribution before
proposing any policy change. No separation of compiler and documentation input
bases, policy change or new claim of intentional behavior has been made.

## Non-defect observations and residual limits

The six verified observations are acknowledged without dispute: qualified
symbol/alias documentation; source access through the shared host and exclusions;
whole-result validation; guard/cancellation handling and final reports; the
post-submission validity check outside the generation deadline; and the documented
context metadata bound. The corrections above preserve these boundaries.

The review's first full run cancelled 13 execution-ownership tests, while its
isolated and subsequent full runs passed. **This remains unresolved.** It has
not been dismissed as a pre-existing flake or attributed to load. The human was
asked whether to perform bounded checks against the reviewed target and
pre-implementation baseline and report the evidence. The present corrections
were verified with the investigation suite; execution-ownership behavior was not
investigated or rerun as part of these fixes.

No hosted provider, credentials or live inference were exercised. Retention,
reconsideration and display remain later milestones. These review limits are
preserved, and neither a passing scripted suite nor the review recommendation
establishes their correctness or interpretive usefulness.

## Corrections and verification

Correction commit: `1de634a29e0ba07a42091d0718f286462f77e3f4`.

- `npm run check`: passed.
- `npm run build`: passed.
- `node --test _build/test/investigation.test.js`: 31 passed, zero failures,
  cancellations or skips (approximately 23.5 seconds).
- `git diff --check`: passed.

The investigation method advanced to `postcode/investigation@2` for changed
delivery and citation semantics. No dependency, CLI capability, governing
document or development-process file changed. The full suite was not rerun;
the review's test-cancellation uncertainty remains separately pending.

## Review rounds

Round 1 reviewed `d4260522c2abf0530de076c05944f531de003e4b` against
`c15afdd3b03f588534ac386c2453c81da71ffb68`; its findings remain unchanged.
The current correction target is `1de634a29e0ba07a42091d0718f286462f77e3f4`.
No further independent round has occurred.

## Gate conclusion

Human direction is pending on F1, F2, F4, F7 and the unresolved cancellation
evidence. The reviewer considers a further independent round unnecessary if F1
and F2 corrections are small and verified; those corrections have not yet been
selected or made. The human has not accepted the milestone gate. The task remains
active at milestone 1; milestone 2 has not begun. No finding was rejected or
materially qualified without human approval.

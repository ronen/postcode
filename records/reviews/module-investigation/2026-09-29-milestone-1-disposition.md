# Module investigation: domain execution review disposition

Record type: disposition
Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 1](2026-09-29-milestone-1-handoff.md)
Findings: [Round 1](2026-09-29-milestone-1-round-1-findings.md), [Round 2](2026-09-29-milestone-1-round-2-findings.md)
State: round-2 findings accepted; resolution choices await human direction; milestone gate not satisfied

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

**Accepted current behavior with regression coverage, by human direction.**
The regression exercises README acquisition through the evidence boundary after
organization materialization, followed by partial and complete mechanical queries.
It confirms one new partial attempt on the advanced input basis, reuse on the
next query, reuse of completed work, and immutability of earlier evaluations and
claim-context input references. The new retry-basis analysis-input record includes
the README read; previously established claim contexts keep their earlier basis.

The human clarified that this is a conservative shared acquisition basis.
Membership means captured in that basis, not used by the compiler or to derive
a particular claim. README acquisition registers session validity and makes
incomplete work eligible for conservative retry; unnecessary work does not
misrepresent its outcome. The architecture account records this distinction.
No input separation or retry-policy change was made. Relevance-based acquisition
revisions remain a possible later optimization if retry cost becomes significant,
without expanding this milestone.

## Round 2 findings and dispositions

### R2-F1 — evaluation-wide evidence in subject queries

**Accepted; high priority, milestone gate remains blocked by this defect.**
The evidence boundary seeds per-subject responses with entire evaluation records,
all evaluation contexts and all dependency coverage, then traverses context
evidence. The size bound correctly qualifies oversized delivery, but cannot make
these already-narrow subject requests usable. The round-1 F3 correction addressed
termination behavior without addressing this underlying response-scope defect.
The round-2 finding is accepted without reducing its severity or deferring it.

A local probe against this repository's `tsconfig.json`, using the existing built
production evidence boundary, reproduced the structural problem (256 modules,
91 project modules; selected module handle `graph`):

| Query | Serialized UTF-16 code units | Selected references |
| --- | --- | --- |
| dependencies | 3,039,446 | 4 |
| dependents | 3,041,486 | 2 |
| membership | 3,163,084 | 1 |
| exports | 48,960 | 2 |
| source | 3,623 | 1 |
| modules | 2,214,732 | 256 |
| organization | 4,127,415 | 1,180 |

The dependency response contained 1,266 claim contexts and 752 source-evidence
records for only four selected relationships. These are raw evidence-query
responses; the investigator coordinator withholds those exceeding 60,000 units.
The probe confirms this repository instance, not universal size thresholds for
other repositories or every subject. The review's broader structural conclusion
is supported by the response construction itself.

The human has been asked to approve the proposed contract: selected claims with
their own context/evidence and qualification, evaluation-level identity plus
qualification summaries rather than evaluation-wide embedding, and bounded
navigation through module/group/artifact listings. The correction must retain
per-claim method, scope, evidence and coverage; show omissions and continuation
explicitly; and make delegation and documentation access usable at realistic
scale. Population listings and intrinsically large individual evidence must
remain honestly qualified. No new response contract has been selected or
implemented pending the human's direction.

The reviewer's request for a further independent round is accepted. Once the
approved correction is implemented and verified, supply its exact target and
qualification/scale evidence under this existing assignment. Do not proceed to
milestone 2 or treat the round-1 gate recommendation as sufficient.

### R2-F2 — evidence records accepted as corrected subjects

**Accepted; precise subject-kind contract awaits human direction.** The existing
`subject` reference rule admits claims, source evidence and captured content, and
the correction-specific check only excludes investigrams, missing records and
duplicate/empty lists. Thus the instructions' “program subjects” wording and the
accepted association model are not enforced by a dedicated subject-kind rule.

The human has been asked to restrict `correctedSubjects` to `module`, `symbol`,
`group` and `repository-artifact`, with evidence records rejected. That proposal
preserves evidence attribution separately from described-subject associations.
The reviewer offers narrowing or documenting a broader meaning; the implementing
agent has not silently selected between those semantic alternatives. No code or
instructions have been changed while this choice is pending.

### Round 2 observations and residual limits

- **Round-1 statuses:** agree with every reported status: F1, F2, F4, F5 and F6
  corrected; F7 accepted under the human's clarification; F3's bounded unavailable
  behavior corrected, with the newly identified structural defect tracked by
  R2-F1. No earlier finding is reopened or dismissed by implication.
- **Execution-ownership cancellations:** acknowledge the reviewer reproduced the
  same 13 cancellations in the 331-test full run and all 13 passed in isolation.
  The human-authorized diagnosis deferral, backlog entry and qualified validation
  remain in force. The reviewer's assessment that this is not material to domain
  behavior is recorded as their assessment, not proof of the unresolved cause or
  a fully passing suite. No new diagnosis or cancellation change was undertaken.
- **Handoff addendum:** acknowledge the process-traceability observation. The
  addendum was explicitly requested by the human and preserves the original
  assignment text. No development-process rule is changed or proposed here.
- **Residual limits:** retain the absence of hosted/live validation and the
  one-repository limit of the scale measurements. No inference credentials or
  hosted service were used. Further scale regressions and qualification checks
  belong to the proposed in-scope correction, once its contract is approved.

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
pattern predates the implementation; its cause remains unresolved. The corrected
full suite also produced the same 13 cancellations: 318 passed, zero failed
(331 total). **Diagnosis is deferred by explicit human direction**, with a
[backlog entry](../../../docs/backlog.md#diagnose-execution-ownership-cancellations-in-full-suite-runs)
containing reproduction commands, baseline, affected tests and captured results.
The validation and handoff explicitly disclose the concern. Validation remains
qualified by these cancelled suite runs; isolated passes do not establish a fully
passing suite. The reviewer can assess whether the uncertainty affects milestone
acceptance.

No hosted provider, credentials or live inference were exercised. Retention,
reconsideration and display remain later milestones. These review limits are
preserved, and neither a passing scripted suite nor the review recommendation
establishes their correctness or interpretive usefulness.

## Corrections and verification

Correction commits: `1de634a29e0ba07a42091d0718f286462f77e3f4` (F3, F5, F6),
`f5a974d` (F1, F2, F4 and the F7 regression), and `32f90a5` (distinct
non-finite usage reports).

- Type checking and build passed.
- All 34 investigation tests passed, without failures, cancellations or skips.
- The README regression passed for partial and complete mechanical work.
- Baseline and corrected isolated execution-ownership runs each passed 13 tests.
- Baseline full suite: 283 passed, zero failed, 13 cancelled (296 total).
- Corrected full suite: 318 passed, zero failed, 13 cancelled (331 total).
- Final usage refinement: both targeted tests, type checking and build passed.
- `git diff --check`: passed.

Investigation semantics advanced to `postcode/investigation@3`. No dependency,
CLI capability, governing document or development-process file changed.

## Review rounds

Round 1 reviewed `d4260522c2abf0530de076c05944f531de003e4b` against
`c15afdd3b03f588534ac386c2453c81da71ffb68`; its findings remain unchanged.
Round 2 reviewed `32f90a504344352a12810be66e3b41547731909f`, with the working
tree at `2388914` containing documentation-only follow-ups. Its unchanged findings
report type checking passed, 318 full-suite passes with 13 cancellations, all
13 execution-ownership tests passing in isolation, and 56 investigation/input
tests passing. No correction to the round-2 target has yet been implemented.
The [correction validation](../../validation/module-investigation/2026-09-29-milestone-1-review-corrections.md)
records chronology, reproduction and limits, including the final focused check.

## Gate conclusion

Round 2 does not recommend proceeding until R2-F1 is corrected and independently
reviewed. Both R2-F1 and R2-F2 are accepted, with the proposed consequential
contract choices awaiting human direction. No finding has been rejected or
materially qualified, and no additional scope has been assumed. Earlier F7
acceptance and the explicitly qualified cancellation deferral remain unchanged.

The task remains active at milestone 1. No milestone-2 work has begun and the
human has not accepted this gate. A further independent review is required for
the R2-F1 correction; the human arranges that review after implementation and
verification are ready.

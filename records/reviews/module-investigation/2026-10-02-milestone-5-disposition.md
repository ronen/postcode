Record type: disposition

# Milestone 5 round-1 dispositions

Findings: [round 1](2026-10-02-milestone-5-round-1-findings.md)
Reviewed target: `37837f8d1432df652c6cec7c839f101a5b3d2cea`
Human decisions: `f21dd5e` (F2 and one focused assessment), `458fe44` (F4 bounds),
`56912e6` (F5 current-primary context priority).
Status: milestone 5 accepted by the human on 2026-10-02 (`70aa34f`); rounds 1 and 2 resolved; final integrated review remains.

| Finding | Assessment and disposition |
| --- | --- |
| F1 | Accepted. Displaced accounts must disclose corrections they report. Add bounded reporter/target/replacement references without splicing old replacement trees; real-session regression covers a corrected reporting root and unchanged history. Verified by the focused regression and complete suite. |
| F2 | Accepted; human chooses (a). Make reporter attribution explicit in instructions, evidence schema descriptions and supplied context. Keep correction IDs ineligible, metadata distinct from substantive exposure, and rejection atomic without substitution/repair. Regression tests both accepted reporter citation and rejected correction/metadata-only citation. Deterministic verification passed; all three separately frozen live examinations were accepted without correction IDs as evidence. |
| F3 | Accepted. Replace stale help text with current replacement/exact-inspection/conflict/reconsideration behavior. |
| F4 | Accepted; human authorizes scale investigation and bounded metadata. Bound displaced accounts, their accompanying-correction references and revision statuses independently at 256; expose omission counts and exact inspection navigation. Large-history regression checks status truncation and retained retrieval without inference. Verified by the focused regression and complete suite. |
| F5 | Accepted. Distinguish policy omission from character-bound omission; count all policy-omitted incoming inconsistencies, with explicit paging. Human approves prioritizing the path to the current primary instead of the oldest link. Regression covers 30 inconsistencies and competing branches. Verified by the focused regression and complete suite. |
| F6 | Accepted. The [pass-05 addendum](../../validation/module-investigation/2026-10-02-milestone-5-review-addendum.md) records the hosted structured inconsistency targeting scripted A/B/C and its appearance in redisplay. It preserves the original artifacts and qualifies detection claims. |
| Dependent-account evidence gap | Accepted as an evidence gap, not inferred product correctness failure. Human authorizes one fresh, separately frozen sequence with unambiguous dependent claims and unchanged model/effort/route. No tuning or whole-sequence rerun if dependent correction fails. Frozen in [pass 06](../../validation/module-investigation/pass-06/protocol.md), including setup, source pin, instructions/schema and source-grounded reference. The [completed sequence](../../validation/module-investigation/pass-06/report.md) accepted source-supported corrections to both direct Y and transitive Z; the later Z examination adds a competing refinement of the same original, not another distinct error. Controlled origin and deliberate examination still limit discrimination. |

## Other observations and review limits

Accept the verified all-branch selection, persistent conflicts, per-cause exemptions,
completeness, exact subjects, projection identities, revision-page parsing,
structural transport and cancellation/invalidation findings. The tie-break is the
flattened accepted correction array; the addendum records its ordering. The capture
fixpoint audit corroborates that rule's execution, not an independent semantic
interpretation. The pinned Cockatiel overstatement remains qualified, not repaired
historically. The old-branch descendant selection evidence is preserved.

The reviewer did not independently rederive fsm-engine/merge-anything semantics,
repeat the sleep monitor, inspect all dry-run captures, or exercise F4 at scale;
usage verification was through the audit, and the review was one fresh session
without full earlier milestone context. These limits remain disclosed. New scale
regression addresses F4; other historical evidence is not upgraded by implication.
No finding is rejected or materially qualified without authorization. The conditional
gate recommendation is not milestone acceptance. Further review will name an exact
new target under the existing handoff after correction and focused assessment.

## Correction verification

Production corrections are `117a4d4`. The complete suite passes **466 tests**,
zero failures/cancellations/skips, at a clean stationary checkout. The preceding
restricted run had three loopback sign-in failures; a minimal listener reproduced
`EPERM`, and the same complete suite passed with local listeners permitted, without
code/test changes. Both runs and monitor data are retained in
[pass-06 offline verification](../../validation/module-investigation/pass-06/offline-verification.md).
The new scripted setup dry run passed all three real CLI/worker evaluations with
zero provider requests. No real credentials or inference were used by offline
verification. Earlier historical concerns remain qualified.

## Focused assessment and return for review

The frozen pass (`94ee9b9`) completed three accepted hosted examinations in a fresh
session, with unchanged gpt-5.6-sol / medium / ChatGPT-plan configuration. Ten
requests report 188,953 tokens, none missing or anomalous; synthetic setup and
separately unknown formative-role usage remain distinguished. Actual monetary
attribution is unavailable. Full source bodies were supplied to each examination;
wire/canonical exposure, usage, immutable history and independently reconstructed
revision state agree. No tuning, retry, fallback or extra live sequence occurred.
Earlier pass-05 results and findings are preserved. Fresh formative evaluator and
source-informed assessor agree on the bounded dependent correction result while
retaining generated “complete result” wording ambiguity, absent user-facing source
excerpts and qualitative reading burden. No historical output was repaired or
additional inference performed in response.

These changes and the new evidence warrant further independent review under the
[original handoff](2026-10-02-milestone-5-handoff.md). Review the production correction
`117a4d4`, the complete-suite evidence, F6 addendum and pass-06 report/captures,
including its source-informed assessment and controlled-case limitations. The next
review message supplies the exact target containing these records. No new handoff
or expanded assignment is needed. Human milestone acceptance and final integrated
review remain pending.

## Round 2 assessment and follow-up

Findings: [round 2](2026-10-02-milestone-5-round-2-findings.md), reviewed
`9e07266804701447fd737d6499db3f4e13262fc1` under the original handoff. The same
human-arranged reviewer independently ran the complete suite (466 passes),
regenerated all four pass-06 audits byte-identically, checked the source pin and
unchanged prior artifacts, and reproduced resolution of round-1 F1. Accept its
verification that F1–F6 are resolved as directed and that pass 06 addresses the
specific dependent-account evidence gap within the authorized bounds. Its
recommendation supports the milestone gate but is not human acceptance.

| Observation | Assessment and disposition |
| --- | --- |
| R2-O1 | Accepted and corrected in `9d189d9`, after human authorization `015ea9c` to investigate the unexercised case. A real-session regression reproduced the omission: a shallow replacement's accompanying correction displays K's primary before a deeper K is dequeued. The old code omits K and its child from displacement. Record displacement before deduplicating the already displayed body, while retaining the existing bound for genuinely new bodies. The regression passes after the correction and verifies exact inspection, one primary display and no extra inference. Presentation identity advances to @11; architecture explains this case. |
| R2-O2 | Accepted and covered in `9d189d9`. A separate real-session regression constructs three displaced 123-account subtrees plus three old branches and 387 accompanying corrections. It asserts 256 entries in each listing, exactly 116 displaced-account and 131 correction omissions, matching human disclosure, and retrieval of omitted children/corrections through exact reporter inspection without inference. The earlier 511-status regression remains. No truncation behavior needed changing. |

The correction is a reproduced, local traversal-order fix with deterministic
coverage. It does not invalidate round 2's substantive findings or require another
milestone-5 re-review round. The final integrated review should include it and the
new truncation coverage. Human milestone-5 acceptance is still pending.

Preserve the review's residual limits: it did not read full pass-06 formative role
inputs/outputs, independently rederive the generated “complete result” concern,
rederive fsm-engine/merge-anything semantics, or repeat the sleep monitor and dry-run
checks. Its dependent-correction judgment did inspect reasons and evidence. Neither
new regression nor the suite upgrades these unverified areas. Prior live captures,
reports, fixture, handoff and reviewer findings remain unchanged. No live request,
credential operation, tuning or reassessment was performed in this follow-up.

[Round-2 correction verification](../../validation/module-investigation/2026-10-02-milestone-5-round-2/verification.md)
retains the failing reproduction, passing focused cases and complete suite: **468
passes**, zero failures/cancellations/skips, clean stationary `9d189d9`. No further
milestone-5 re-review is judged necessary for these local corrections; this is an
implementation-agent judgment, not a claim that the reviewer inspected the new fix.

## Milestone acceptance

The human accepted milestone 5 and directed preparation of final integrated review
in `70aa34f`. Both rounds are dispositioned, including the reproduced R2-O1 fix and
R2-O2 coverage. The milestone-5 gate is satisfied. Earlier pending statements above
preserve their historical context; the acceptance does not rewrite failed live
attempts or remove the reported limits. The task remains active for a separate
integrated review across all five milestones and the final human completion gate.

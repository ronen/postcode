# M2 early vertical application review: disposition

Record type: disposition
Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Final checkpoint target: `bb8e34072664fcaa1897e75dfbfefb2e9ec9ca98`
Human acceptance: task follow-up `6732185`

## Review rounds

The following preserved records cover all twelve rounds, accompanying notes and intent checks under this assignment. Their exact reviewed targets and verification remain authoritative for each round; none is rewritten by this disposition.

- [2026-11-17-m2-vertical-round-1-corrections-intent-check-claude](2026-11-17-m2-vertical-round-1-corrections-intent-check-claude.md)
- [2026-11-17-m2-vertical-round-1-findings](2026-11-17-m2-vertical-round-1-findings.md)
- [2026-11-17-m2-vertical-round-2-corrections-intent-check-claude](2026-11-17-m2-vertical-round-2-corrections-intent-check-claude.md)
- [2026-11-17-m2-vertical-round-2-findings](2026-11-17-m2-vertical-round-2-findings.md)
- [2026-11-17-m2-vertical-round-3-findings](2026-11-17-m2-vertical-round-3-findings.md)
- [2026-11-17-m2-vertical-round-4-claude-findings](2026-11-17-m2-vertical-round-4-claude-findings.md)
- [2026-11-17-m2-vertical-round-5-claude-findings](2026-11-17-m2-vertical-round-5-claude-findings.md)
- [2026-11-17-m2-vertical-round-6-copilot-findings](2026-11-17-m2-vertical-round-6-copilot-findings.md)
- [2026-11-17-m2-vertical-round-6-corrections-intent-check-claude](2026-11-17-m2-vertical-round-6-corrections-intent-check-claude.md)
- [2026-11-17-m2-vertical-round-7-claude-findings](2026-11-17-m2-vertical-round-7-claude-findings.md)
- [2026-11-17-m2-vertical-round-8-claude-findings](2026-11-17-m2-vertical-round-8-claude-findings.md)
- [2026-11-17-m2-vertical-round-9-claude-findings](2026-11-17-m2-vertical-round-9-claude-findings.md)
- [2026-11-17-m2-vertical-round-10-claude-addendum-findings](2026-11-17-m2-vertical-round-10-claude-addendum-findings.md)
- [2026-11-17-m2-vertical-round-10-claude-findings](2026-11-17-m2-vertical-round-10-claude-findings.md)
- [2026-11-18-m2-vertical-round-11-claude-findings](2026-11-18-m2-vertical-round-11-claude-findings.md)
- [2026-11-18-m2-vertical-round-12-copilot-findings](2026-11-18-m2-vertical-round-12-copilot-findings.md)

## Findings and dispositions

All actionable findings were accepted and corrected within the authorized scope. None remains deferred as an M2 defect. Human-directed choices and remaining limitations are distinguished below.

| Findings | Resolution and correction |
| --- | --- |
| Round 1 F1–F8: qualified answer support, producer reports/attempt fulfillment, successful-attempt reuse, originating question access, malformed acquisitions, dispatched timeout exposure, cancellation usage and state bearer | Corrected in `2493db7`; authored illustration support in `a062be2`. The intent check led to `d6f28cc`, correcting answer identity and qualification attribution. |
| Round 2 F1: ordinary module bearer labels | Corrected in `5699501`; round 3 and the associated intent check found no actionable remainder. |
| Round 4 F1–F5: exact option question identity, executable authoring guidance, unrendered-content disclosure, distinguishable state labels and path-dependent exposure test | Corrected in `6f72f86`; round 5 confirmed the corrections. The human chose exact option owner/key identity and accepted that ordinary requests and option requests do not automatically share answers, while retained content remains reusable. |
| Round 6 Copilot: optional measurement report exclusion, follow-up requirements/Presentation preflight, qualified displacement support | Corrected in `d537c65`; later Copilot review acknowledged all three resolved. |
| Round 6 intent observations and round 7 selector finding: hidden producing-context reconsideration in exports and unexplained component selectors | Corrected in `2ed7b5f` under explicit human direction. Fresh export answers expose current causes; exact retained answers keep captured state. Selector guidance preserves supported selectors and normal repair rather than accepting arbitrary content-field names. Round 7's old-target timing is recorded in the checkpoint. |
| Round 8 F1: report.answer meaning and reference forms | Corrected in `2b0d0c3`, preserving own-designation repetition and existing-answer causes; offline and focused live evidence retained. |
| Round 9 F1: report-only return versus empty placeholder investigram | Corrected in `4267a05`; offline coverage and a later successful live report-only return verify the documented form. Round 10 was clean. |
| Round 10 accompanying contract-evidence limitation | Reconciled in `67e04c2`: original live evidence did show a promised contract, with older guidance and assisted elicitation. Added missing application-level coverage in `956032c`; current live evidence in `f31919a` fills the positive current-revision gap. Round 11 independently confirmed the reconciliation, captures and test effectiveness. |
| Round 11 non-defect observation: unknown contract retention | Human chose invocation-time availability validation consistently for operations and contracts. Decision and explanatory-refusal regression assertions recorded in `c213218`; no production change. |
| Round 12 Copilot: measurement test build selection and inaccurate architecture overview | Corrected in `bb8e340`. Separate-build compilation and measurement regression passed; application-route documentation now identifies implemented support and remaining migration accurately. The human accepted this checkpoint after those corrections without requiring another round. |

## Corrections and verification

The [M2 checkpoint](../../validation/structured-architectural-accounts/m2-checkpoint.md), [measurement](../../validation/structured-architectural-accounts/m2-measurement.md) and [trial index](../../validation/structured-architectural-accounts/m2-trials/README.md) retain detailed targets, checks and evidence. The original implementation's full suite passed 738 tests; subsequent corrections have their own recorded focused/full verification and independent checks. Those historical counts are not represented as a fresh full-suite run on the final target. Round 11 independently ran 105 contribution/ledger/export tests and mutation checks on contract coverage. The latest offline corrections passed their recorded build and focused tests.

Live evidence comprises 110 dispatched M2 requests across separately authorized budgets, including preserved failures and repairs. The latest promised-contract chain used 7 requests, no repair, and fulfilled the explicit option contract. Execution success does not establish the generated accounts' accuracy or statistical reliability. No additional live inference is authorized by this disposition.

Remaining limitations and migration obligations are explicit: one model/repository sample; no measured first-submission reliability; generated-account accuracy not independently verified; negative contract fulfillment and nonzero-cause lifecycle cases covered offline; a single structural repair attempt; no application/CLI configuration path selecting the hosted contribution agent; remaining mechanical and earlier agentic/caller families still on the temporary migration contract. These are not newly waived final-plan obligations. M3 must review remaining mechanical-family conformance and agentic/caller cut-over separately; M4 retains integrated verification and final review.

## Gate conclusion

The human judged M2 sufficient on 2026-11-18 and authorized moving to M3, recorded verbatim in task follow-up `6732185`. No further M2 blocker was identified. The M2 review gate is satisfied at `bb8e340`; the task remains active. This is not final task acceptance, merge authorization or permission to skip subsequent review gates. Historical statements that M2 was unaccepted describe their earlier points in the review sequence.

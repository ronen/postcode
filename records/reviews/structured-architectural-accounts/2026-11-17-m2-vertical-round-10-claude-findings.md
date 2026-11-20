# M2 early vertical application review: findings

Record type: findings
Received: 2026-11-17
Reviewer: Claude (Opus 5.5), the same independent review session as rounds 4, 5 and 7–9. It did not take part in implementing M2, running the trials or writing the intent checks.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 10
Reviewed target: implementation `4267a051754f62f1c728295cfe94c09b4b9354af`, with records through `d98a513`. Those records change no source, scripts or tests after `4267a05`.
Reviewed scope:
- correction `4267a05` for R9-F1;
- its offline verification record, `dc57b98`;
- task follow-up `ff143d2`;
- the live check in [report-only-verification.md](../../validation/structured-architectural-accounts/m2-trials/report-only-verification.md) and `_trials/m2-report-only-verification-1/`.

Prior findings: [M2 round 9 Claude findings](2026-11-17-m2-vertical-round-9-claude-findings.md)
Prior reviewed target: `2b0d0c3787f0a7787caf781faeba772ce2c98042`

## Returned findings

### Recommendation

**No actionable findings. R9-F1 is resolved**, and the live check confirms it. With rounds 1–9, I have no remaining finding against the M2 vertical result. I recommend that the human consider it technically sufficient to proceed to M3.

This recommendation does not accept the M2 checkpoint or authorize M3; both remain the human's decisions.

### Method and verification

- **Correction and records.** I read the correction diff, the task follow-up, the validation record and the checkpoint addition.
- **Build and suites.** I built an exact export of `d98a513` under Node 22.23.4. The contribution, ledger and exports suites passed **104/104**, with no skips. I did not repeat the full suite: the correction changes only instruction text, a schema description, a method-version constant and tests.
- **Ledger probe** against the build. These outcomes match the new guidance exactly:

  | Submission | Result |
  | --- | --- |
  | `investigrams: []` with `report.answer` naming the earlier designation | Accepted |
  | `investigrams: []` with no report | Rejected: "A contribution without investigrams requires a producer report." |
  | A qualified prose note with `report.answer` | Accepted |
  | A qualification-only placeholder investigram | Rejected |

- **Capture audit** with my own scripts:
  - All 14 manifest digests matched, and the manifest's own SHA-256 matches the record.
  - **Elicitations.** The initial step has none. The review step's elicitation is unchanged from round 9 and names no field, shape or reference form.
  - **Instructions and schemas.** All six exchanges equal the production `state-behavior` instructions I generated from my build, plus only the review step's elicitation. The function schema matches exactly, including the new `investigrams` description.
  - **Model.** `gpt-5.6-sol` with medium reasoning throughout.
  - **Usage.** Per-exchange provider totals sum to the recorded 145,345 tokens. The separate ledger shows 6 of 20 requests, with no missing or anomalous usage.

### Resolution of R9-F1

- **Shared guidance.** `contributionSubmissionGuidance` is used both in the production instructions and on the hosted `investigrams` schema. It states the following, each consistent with validation:
  - `investigrams` may be empty when a producer report is supplied;
  - `{ investigrams: [], report: { answer: [...] } }` is the answer-only form;
  - every investigram must contribute content, a declaration or qualified metadata, and a qualification alone does not count;
  - an optional adequacy judgment belongs in a qualified prose item, which needs no new designation.
- **Regression.** The observed placeholder submission is kept as a rejection regression.
- **Live check.**
  - The initial answer was accepted first time and fulfilled `postcode/state-diagram-answer@1`.
  - The fresh review submitted `investigrams: []` with a report naming the original designation. Its bindings resolve the handle to the initial investigram's `answer` declaration.
  - It was accepted without repair, on the same Query result, with no new investigram or designation.
  - Attempt and projection both record `fulfilled`, and the projected alternative is identical to the initial one.
  - The placeholder mistake did not recur.

### Non-defect observations and limits

- **Scope of the live check.** It is one run of one model on one repository, and the record says so.
  - **Scenario.** It repeated only the answer-return scenario, not the option chain, which the earlier runs cover.
  - **Not established.** First-submission reliability, a non-null follow-up contract, or the correctness of the generated account and adequacy judgment.
  - **Offline only.** Preserving non-zero reconsideration causes on return, and the optional prose-note path, are covered only by offline tests.
- **Earlier observations.** The observations from earlier rounds still apply: warning breadth, supersede versus add, the single repair attempt, the missing hosted configuration path, answer record size, and explicit human acceptance of undesignated accepted reports.
- **Scratch work.** I kept `GIT_DIR` scoped to individual commands, and the repository's `core.bare` remains `false`.

Only this findings record is created and committed by this reviewer. Implementation, governing material, the task record, task status and the original handoff remain untouched.

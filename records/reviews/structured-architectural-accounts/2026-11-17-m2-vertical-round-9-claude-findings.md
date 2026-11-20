# M2 early vertical application review: findings

Record type: findings
Received: 2026-11-17
Reviewer: Claude (Opus 5.5), the same independent review session as rounds 4, 5, 7 and 8. It did not take part in implementing M2, running the trials or writing the intent checks.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 9
Reviewed target: implementation `2b0d0c3787f0a7787caf781faeba772ce2c98042`, with records through `6a82ff0`. Those records change no source, scripts or tests after `2b0d0c3`.
Reviewed scope:
- correction `2b0d0c3` for R8-F1;
- task follow-up `d17f51b`;
- the live verification in [report-answer-verification.md](../../validation/structured-architectural-accounts/m2-trials/report-answer-verification.md) and `_trials/m2-report-answer-verification-1/`;
- the checkpoint and README additions in `6a82ff0`.

Prior findings: [M2 round 8 Claude findings](2026-11-17-m2-vertical-round-8-claude-findings.md)
Prior reviewed target: `2ed7b5f251157e2176879023694b5166892923b2`

## Returned findings

### Recommendation

**R8-F1 is resolved.** The live run confirms automatic own-designation answers and the explicit return of an existing answer under the revised guidance.

The new answer-only path exposed one adjacent **P3 instruction gap**, R9-F1. It does not block the gate. The live-instruction evidence gap remains closed.

This review does not accept the M2 checkpoint or authorize M3.

### Method and verification

- **Correction and records.** I read the correction diff, the task follow-up, the new validation record and the checkpoint addition.
- **Build and suites.** I built an exact export of `6a82ff0` under Node 22.23.4 and ran the contribution, ledger and exports suites: **103/103 passed**, with no skips. I did not repeat the full suite: the correction touches only instruction text, the hosted report schema, a method-version constant and tests.
- **Ledger probe**, against the build:
  - a fresh attempt that returns an earlier designation in `report.answer` with `investigrams: []` is accepted, and its report retains the reference;
  - the same return with a placeholder investigram that carries only a qualification is rejected with `An investigram must contribute content, declarations or qualified metadata.`
- **Capture audit**, with my own scripts, of `_trials/m2-report-answer-verification-1/`:
  - All 16 manifest digests matched, and the manifest's own SHA-256 matches the record.
  - **Elicitations.** None of the three contains an operation name, field name, reference form or contract identifier.
  - **Instructions and schemas.** All 15 exchanges equal the production `state-behavior` or `examine-content` instructions I generated from my build, plus only that step's elicitation. The function schemas match exactly.
  - **Model.** `gpt-5.6-sol` with medium reasoning throughout.
  - **Usage.** Per-exchange provider totals sum to the recorded 466,361 tokens. The separate ledger shows 15 of 30 requests, with no missing or anomalous usage.

### Resolution of R8-F1

- **Shared guidance.** `reportAnswerGuidance` is used both in the production instructions and on the hosted `report.answer` schema. It states that the contribution's own designations already count, and that the field is for explicitly returning existing designations. It describes both accepted reference forms (a retained handle, or `{ local }` with a declaration key) and excludes invocation and Query-result handles. It also states that a return does not change standing or reconsideration causes.
- **Agreement with validation.** Every claim in the guidance matches validation in `ledger.ts`:
  - duplicates are rejected by `distinct`;
  - an entry must be an add or supersede result designation;
  - it must belong to the same Query result.
- **Schema.** The schema's item type now accepts both forms, replacing the misleading "exact handle supplied" description.
- **Regression.** The observed invocation-handle submission is kept as a rejection-and-repair test.
- **Live run.**
  - **Omission.** The initial and follow-up contributions omitted `report.answer` and were accepted first time.
  - **Explicit return.** The fresh review returned the original owner's `answer` declaration, a retained handle that the bindings resolve to the initial investigram, and declared no new answer.
  - **Outcome.** It stayed on the original Query result. Attempt and projection both record `fulfilled`, and the projected alternative is identical to the initial one.
  - **No recurrence.** The invocation-handle mistake did not recur.
- **Offline only.** Preserving non-zero reconsideration causes on return, and harmless repetition of own designations, are covered only by offline tests. The record says so.

### R9-F1 — P3: The instructions do not say that an answer-only submission needs no investigram

**Location.** The submission line of `dialogInstructions` in `src/lib/contributions/dialog.ts`: `Submit one contribution: { investigrams: [ investigram ], report?: … }`. Two rules are left unstated there:

- `investigrams` may be empty;
- every investigram must contribute content, declarations or qualified metadata.

**Observed.** The fresh review's first submission contained a placeholder investigram, `review`, with no items or declarations, alongside a correct `report.answer`. It was rejected for the unstated rule, and the run's single repair was spent adding a prose assessment to it.

This is exactly the use case the new guidance introduces: "return existing answer designations … when no new designation is needed". The probe confirms that the minimal form, `investigrams: []` plus the report, is valid.

**Pattern.** With R7-F1 and R8-F1, this is the third successful live chain in which an initial or explicit-return submission spent its only repair on an undocumented shape rule. A second mistake in the same submission would have failed the attempt.

**Resolution.** State in the instructions, and in the schema description if useful, either of these:

- an answer-only submission may give `investigrams: []`;
- or, if the preferred style is to record the adequacy judgment, that it belongs in a qualified prose item.

In either case, state that an investigram must contribute something. Keep the observed submission as a regression case. Verifying the reworded instructions live would need separate authorization. I do not consider another live run necessary for a wording-only fix with offline coverage, but that is the human's call.

### Non-defect observations and limits

- **Repair outcome.** After repair, the accepted fresh contribution retains an undesignated, qualified prose assessment. That is a reasonable outcome and changes no answer.
- **Scope of the evidence.** It remains one model, one repository and one successful run per check. It does not establish first-submission reliability, a non-null follow-up contract, or the correctness of the generated accounts or the adequacy judgment. The record says so.
- **Trial guidance on `main`.** I did not review the live-trial guidance the record cites from `main` (`c7aa85c`). It is outside this worktree's review scope.
- **Git directory.** As disclosed in round 8, I kept `GIT_DIR` scoped to individual commands this round. The repository's `core.bare` remains `false`.

Only this findings record is created and committed by this reviewer. Implementation, governing material, the task record, task status and the original handoff remain untouched.

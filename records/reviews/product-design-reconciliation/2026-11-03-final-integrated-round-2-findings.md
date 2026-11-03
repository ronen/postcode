# Product-design reconciliation final integrated review: round 2 findings

Record type: findings
Received: 2026-11-03
Reviewer: Claude Code (Claude Opus 5.5), independent agent session arranged by the human
Handoff: [Final integrated review handoff](2026-11-03-final-integrated-handoff.md)
Round: 2
Reviewed target: `bad7ef484bc5264e3738a723241a278344f93693` (correction range `f1a6a46..bad7ef4`; the integrated range `87706fa..bad7ef4` was considered where corrections interact with it)
Prior findings: [Round 1 findings](2026-11-03-final-integrated-round-1-findings.md)
Prior reviewed target: `ccc8ba35ee0fbef77136e7594dd1dc9876beefcd`

## Returned findings

### Method

- Read the complete `bad7ef4` diff (source, tests and documentation) against each round-1 finding. Then checked how the corrections interact with the round-1 implementation: the diagnostic placement in module rendering, the `withDiagnosticMeanings` wrapping in every arranger and report, and the feedback snapshot condition.
- Rebuilt and repeated the round-1 reproductions against the same scratch fixtures outside the repository: 25 syntax diagnostics across `modules`, `dependencies`, `organization`, `inspect` and `modules --json`; documentation with a fenced block, `@example` and `@see`; `assertionContent` on single-line and plain-text fences.
- Read the new tests in `feedback.test.ts` and `human-output.test.ts`.
- Ran `npm run check`, `git diff --check 87706fa bad7ef4` and the full two-worker suite under Node v26.11.0 with the checkout unchanged. The type check and diff check were clean, and the suite reported **622 passed, 0 failed/skipped/cancelled** (~329 s).

### Disposition of round-1 findings

- **F1 (resolved).** Unicode now shows the meaning once per code, at most three occurrences per code and at most five codes, with explicit occurrence/code omission counts. The 25-diagnostic reproduction now shows one meaning line, three locations and "… 22 diagnostic occurrence(s) omitted" in every family. Per-context `explanation` fields are gone. Views and resolution reports carry one top-level `diagnosticMeanings` table, and `modules --json` dropped from 118 KB to 91 KB. Complete messages and locations remain in JSON qualification contexts.
- **F2 (resolved).** The limit notice is now one concise sentence placed after the retained assertion and tags. It is counted in the 8-line Unicode budget. The probe shows the assertion first and a 2-line combined notice.
- **F3 (resolved).** Any triple-backtick span is removed again, including single-line spans, and now produces a representation limit, which improves on the baseline. Blocks explicitly marked `text`/`plaintext` are preserved.
- **F4 (resolved).** A failure with stderr now replaces the snapshot with its request, stderr and outcome, and no View is fabricated. The feedback record carries `target: { command, status }`, and the acknowledgment names the command and status. The new test covers analysis failure, interruption and defect, sink rejection, consecutive reports and no request execution. The documentation states that an interruption ending the shell also ends the Session.
- **F5 (resolved).** The defect guidance now reads "start a new invocation or shell Session".

The method versions were bumped for the changed presentations (presentation 37, export presentation 4, investigation presentation 22). The CLI reference, architecture documents and implementation conventions describe the corrected bounds, the meaning table and the failure targeting accurately.

### Actionable findings

None.

### Non-defect observations and residual limits

- Module-view diagnostics now appear only in the Status section, built from all view qualification contexts. They no longer appear under the individual module, and a collapsed external module is no longer flagged because of diagnostics alone. No qualification is lost (each occurrence keeps its path, and `inspect` of an affected module still shows it), but the per-module placement changed. This can go to the planned more-details/placement review.
- Removing a single-line span inside a sentence leaves a double space ("Use it like  carefully."). This is cosmetic.
- JSON still repeats a project's complete diagnostic list in each qualification context that captured it. That is the existing record structure, now without the repeated explanation.
- The retained real-investigator outputs predate presentation 37. The assessment already says that later deterministic presentation repairs were not regenerated, and these corrections do not change generation instructions or account content, so no new sample is needed.
- The unverified areas in round 1 still apply: live hosted-failure wording, and generation quality beyond the 18 retained accounts.

### Recommendation

The round-1 findings are resolved and no new defects were found. I recommend that the final integrated review gate be treated as **satisfied** for target `bad7ef4`, subject to the human's confirmation that the accumulated review is sufficient, as the handoff requires.

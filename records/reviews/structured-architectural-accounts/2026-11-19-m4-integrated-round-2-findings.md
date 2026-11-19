# Structured architectural accounts final integrated review: round 2 findings

Record type: findings
Received: 2026-11-19
Reviewer: Claude (Opus 5.5), independent review session arranged by the human
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 2
Reviewed target: `feabbb5d4fef990b0fa9a3c4ca83dd2a802bfdb9`
Reviewed scope: the correction delta `2fa4071..feabbb5d4fef990b0fa9a3c4ca83dd2a802bfdb9` in full (`README.md`, `docs/cli-reference.md`, `docs/hosted-investigation.md`, `m4-retirement-coverage.md`, `src/lib/presentation-contracts.ts` and five test files), checked against the round 1 findings. I read `7196f62` as the disposition only. Areas outside the delta were not re-reviewed beyond the full-suite run below.
Prior findings: [round 1](2026-11-19-m4-integrated-round-1-findings.md)
Prior reviewed target: `fdd670e619087ee5d45654153f99b99f13be65d4`

## Returned findings

### Method and verification

- Exported `feabbb5` with `git archive` into a fresh scratch directory outside the checkout, committed it to a throwaway local repository and reused the round 1 Linux dependency install (same `package-lock.json`). The checkout and its `_build/` were not touched.
- `npm run check` and `npm run build` passed. `buildIdentity("_build").sha256` = `38adcf9153c80a852ff42cf15dfd9f1082440ab9a5f040625dcd600b4ce35ace`, which matches the disposition.
- Full suite, all 74 `_build/test/*.test.js` files (resumable per-file batches, at most two concurrent processes): **718 tests, 717 pass, 0 fail, 0 cancelled, 1 skip**. The two added tests are the F5 catalog regressions. The skip is the same case-insensitive-filesystem test as in round 1.
- `git diff --check 2fa4071 feabbb5` was clean. Relative links in the four changed Markdown files resolve. No source, test, script or current documentation references `retainedPresentation`, `planPresentation`, `compatiblePresentation` or `settlePresentation`.
- No live inference, and no implementation, governing-material or task-record change.

### Round 1 findings

- **F1: resolved.** The README progressive-investigation text and the hosted guide now describe designation/association selection with standing alternatives, exact contribution inspection, exact historical presentation, and revision pages over change grounds, qualification groups and inconsistency reports. Both agree with `docs/cli-reference.md#progressive-investigation-and-usage`. The hosted guide separates failed-attempt reporting from answer meaning. Pass-05 and pass-06, and the README's live formative evidence, are now explicitly historical evidence for the earlier representation, with the M2 trials linked separately. No retired correction, replacement or citation-closure semantics remain in the changed passages.
- **F2: resolved.** The transitional "remove this notice at completion" paragraph is replaced by the delivered CLI scope: existing commands, with state behavior, diagrams and follow-up options available through the API only and no corresponding CLI commands. The subject-navigation sentence no longer uses the retired "current revision context" framing.
- **F3: resolved.** The orphaned helpers are removed. The production executor's `retainedFacts`/`consumptionPlan`/`settleConsumption` path is now the only exact-compatibility implementation, so the two can no longer drift. Tests that used the removed helpers now call the production consumption functions through the real `applicationPresentation` adapter. `projection-content` gained a population refusal control. Equivalent precondition, mismatch and malformed-content assertions are preserved in `presentation-compatibility` and `exports-lens`. Removing the orphan refusal assertion is acceptable because `application-exact-compatibility` covers executor refusal and retained-answer reporting. The inventory line now describes this accurately. Production source changes are deletions of uncalled code only.
- **F4: resolved.** The delegation dialog test now compares `production.evidence` with every full record actually received across its exchanges. It requires that at least one dependency-evaluation summary was received without its full record, and checks that such summary-only records are absent from full-record evidence. The baseline identification acquisition cannot satisfy these assertions. The test passes, so the dependency-evaluation precondition is actually met by the fixture.
- **F5: resolved.** Two regressions (the built-in `summarize` id and a new id) assert rejection by the application catalog, by the CLI catalog, and by CLI Session opening. The open uses a nonexistent configuration path and asserts the legacy-requirement message, so the rejection is shown to precede project acquisition.

### New findings

None.

### Residual limits

- Same environment as round 1: Linux VM, Node 22.23.5, Linux builds of the optional native modules. It is not the stated macOS / Node 22.13.1 setup, and one test skips here because the filesystem is case-sensitive.
- The representative memory workload was not reproduced in either round. The corrections remove only uncalled code and change tests and documentation, so I see no reason to expect a retention change.
- Round 1's limits on independent re-derivation of earlier-checkpoint semantics (focus areas 2, 3 and 5) still apply.

### Gate recommendation

All round 1 findings are resolved, and this round found nothing new. The full offline suite passes at the corrected target with its stated digest. From this review's standpoint, the final integrated gate is ready for human determination. Whether this accumulated review is sufficient, and any task closure or merge, remain the human's decision.

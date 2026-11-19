# Structured architectural accounts final integrated review: round 4 findings

Record type: findings
Received: 2026-11-19
Reviewer: Claude (Opus 5.5), the same session that performed round 3, rereviewing its corrections at the human's request
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 4
Reviewed target: `d724192871ab15510630e8a52374db8e313b21db`, with the disposition update `0bfb9b7`
Reviewed scope: the correction delta `2963c35..0bfb9b7`. That covers `b8b1b6d` (F1, F2), task follow-up `0e32c08` (the F3 direction) and `d724192` (F3), plus the round 3 section of the [disposition](2026-11-19-m4-integrated-disposition.md). It is not a new full-branch derivation. The core mechanisms traced in round 3 are unchanged, except that dialog initial input now includes context.
Prior findings: [round 1](2026-11-19-m4-integrated-round-1-findings.md), [round 2](2026-11-19-m4-integrated-round-2-findings.md), [round 3](2026-11-19-m4-integrated-round-3-claude-findings.md)
Prior reviewed target: `feabbb5d4fef990b0fa9a3c4ca83dd2a802bfdb9`

## Returned findings

### Method and verification

- Exported `d724192` with `git archive` into a fresh scratch directory outside the checkout and committed it to a throwaway local repository. Copied in the implementation worktree's installed `node_modules`. The checkout and its `_build/` were not touched.
- Environment: macOS, Node 22.13.1.
- `npm run check` and `npm run build` passed. `buildIdentity("_build").sha256` = `190e2c60866149a95aa65ea39a0f8f87791b0a0aef16d14cfbe14fd1c33a944b`. This matches the disposition and was unchanged after the suite.
- Full suite in one uninterrupted run, `node --test --test-concurrency=2 _build/test/*.test.js`, with local loopback and credential-lock access: **725/725 passed**, with 0 failures, 0 cancellations and 0 skips, in 435 seconds. The scratch tree and build were kept fixed throughout: no probe, no compilation, and a clean `git status` afterwards.
- No live inference, and no implementation, governing-material or task-record change.

### Round 3 findings

**F1: resolved.** `arrangeContributionAnswer` now states mixed diagram availability neutrally. It adds an unmet-result clause only when `projection.fulfillment` is non-null, counting the alternatives whose retained `unmet` list is non-empty. That is the same per-alternative data that already produces each alternative's "Requested result" qualification group (`answers.ts:236`), so the notice and the qualifications cannot disagree. The new parameterized test covers three cases: no contract (no fulfillment wording), the state-diagram contract (an unmet clause for 1 of 2), and a designated-answer contract that does not require diagrams (fulfilled, so no unmet wording). It also confirms that arrangement leaves resolved content unchanged. Bumping the presentation artifact method to `contribution-presentation@4` is appropriate, and selection, fulfillment and answer identity are untouched.

**F2: resolved.** `docs/architecture/README.md` now describes retained Projections of designated content with independently captured standing and change context, and application-coordinated bindings. It no longer mentions revision snapshots or a binding-only port. `docs/capability-reference.md` now attributes retained interpretations to module and selected-content investigations, including application invocation of follow-up options, and describes exact presentation in current terms. Both are consistent with the code I traced in round 3.

**F3: resolved, as the human directed (delivery).** `conductDialog` now factors subject acquisition into `acquireSubject` and applies it to `invocation.request.context` after the subjects, before option metadata and fresh-question designations. Consequences I checked:
- Context uses the same production acquisitions as subjects: baseline, item, association with content, whole contribution, or an explicit unavailable response for a scope. It therefore inherits the existing response bound, total character guard and dispatch checkpoint. Exposure is recorded only for what is actually dispatched. Both of the last two properties are tested: an oversized context item is withheld with no recorded delivery, and a dialog stopped before dispatch records no deliveries or evidence.
- Unknown context references cannot reach acquisition. `ledger.invoke` validates each context entry with the same `#subject` check as subjects (`ledger.ts:247`), and acceptance validates option context, including component selectors (`ledger.ts:232`, `ledger.ts:535–550`).
- `DialogInput.request.context` carries the exact `SubjectRef` entries, separate from subjects. The hosted codec translates them by key (`entity`, `investigram`). Item keys, declaration keys, component keys and scope text stay literal. The new hosted test confirms that the request's handle equals the handle of the delivered content and that the handle decodes back.
- Context was already part of request identity, so nothing changes there. The `contribution-dialog@12` bump separates new attempts from earlier ones under method-qualified reuse, and the disposition says so accurately.
- The application test exercises real option invocation, reuse without a second dialog, and exact earlier presentation after close.

### New findings

None.

### Non-defect observations

- If a context entry repeats a subject, it is acquired and delivered twice. This is harmless, since exposure stays truthful, and no supported path authors it, because the hosted option schema still omits `context`.
- The unmet clause appears only within the mixed-diagram notice. In other cases, such as a single alternative or all alternatives drawable, unmet requirements are still shown in each alternative's qualifications. That is adequate.

### Unverified areas and residual limits

- Representative memory was not remeasured, as in the disposition. Round 3's residual limits still apply: mechanical providers, hosted transport and CLI rendering were checked through their suites, not re-derived.
- The changed dialog guidance (the new "EXPLICIT INPUT CONTEXT" instruction) has only offline evidence. No live inference was run.

### Gate recommendation

All three round 3 findings are resolved, there are no new findings, and the corrected target reproduces its stated digest and a clean 725/725 run on the handoff's platform. I see no further correction needed before the human's sufficiency determination. Review sufficiency, task closure and merge remain the human's decision.

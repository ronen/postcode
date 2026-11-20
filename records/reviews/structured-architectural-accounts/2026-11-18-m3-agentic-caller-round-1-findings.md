# M3 agentic/caller cut-over review: round 1 findings

Record type: findings
Received: 2026-11-18
Reviewer: Claude (Opus 5.5), independent review session
Handoff: [M3 agentic/caller cut-over review](2026-11-18-m3-agentic-caller-handoff.md)
Round: 1
Reviewed target: `e6f5c4c28a467670100fbdc77b9fabac0b1df17e`
Reviewed scope: `142a04623944dfb3285d1c36cea514a193e40dad..e6f5c4c28a467670100fbdc77b9fabac0b1df17e` (49 `src` files, 37 test files, validation records); `1f00938`, `bd9f581` and `fc9d909` read as the partial implementation, decision and recorded direction. The handoff commit `4c94a2c` was read as the assignment only.

## Returned findings

### Recommendation

**One actionable finding (F1) and one minor finding (F2). Not yet ready for acceptance; ready once F1 is corrected.**

The application-level cut-over looks sound. All four operations run through the common hosted/worker dialog with explicit designations. The legacy interpretation route cannot be registered. The five attempt/answer cases are implemented as the decision requires and tested. Exact presentation is independent of the ledger and of a closed Session.

F1 is a human-output gap in the new common CLI View. The attempt outcome is complete in the application result and in JSON output. The unicode rendering drops the failure reason, the producer's undesignated-inability report and the reuse indication. Legacy investigation rendering showed all three.

F1's correction is local to `renderContributionView` and its tests. It does not invalidate the rest of this analysis, so the implementing agent's own verification should suffice under `dev/review.md`. The human decides whether the gate is satisfied.

### Method and verification

I read the plan (M3 and coverage), the attempt/answer decision, the task's recent direction, the checkpoint, the coverage inventory and the memory record. I then read the full `src` diff and the new and changed tests, concentrating on `application/executor.ts`, `application/session.ts`, `application/catalog.ts`, `subject-resolution.ts`, `contributions/{evaluation,dialog,inspection,subjects,operations}.ts`, `session-worker.ts`, `work-attribution.ts` and `interfaces/cli/contribution-presentation.ts`.

Verification ran on the user's machine in a Linux VM (Node 22.23.5). I used a `git archive` copy of `e6f5c4c` with a fresh `npm ci`, committed into a scratch Git repository because organization fixtures need one. The worktree was not modified apart from this record.

- **Checks.** `npm run check` and `npm run build` passed. `git diff --check 142a046 e6f5c4c` passed.
- **Full offline suite**, run as 19 batches of four files at concurrency 4: **774 tests: 771 passed, 1 skipped, 2 failed.** The failures are the two native kernel-lock credential tests (`assessment-budget`). The skip is the matching native case. All three need the macOS-built `fs-ext` binary, which is unavailable in this VM; they are the same environmental cases as in earlier rounds. This is consistent with the implementing agent's 774/774 on macOS.
- **Focused files** (`m3-agentic-cutover`, `investigation-answer-outcomes`, `contribution-dialog`, `contribution-application`) also passed in isolation: 33/33.
- **Probes** used controlled `ScriptedContributionAgent` doubles through `interactiveSession` and `openApplication`, with no live inference:
  - undesignated inability, refusal and a malformed reply, in unicode and JSON (F1);
  - an over-bound selected-content acquisition, checked in work attribution (F2).

### Actionable findings

**F1. The common CLI View's unicode rendering drops attempt reporting that the application delivers.**

- **Code:** `src/lib/interfaces/cli/contribution-presentation.ts`, `renderContributionView`.
- **What it prints today:**
  - `reporting.unavailable.diagnostic`, but only for transient `communication-failure` and `configuration-unavailable` outcomes;
  - otherwise only `Attempt: <kind>`.
- **What it never prints:**
  - the failure's `reason`, `problems` or `code` for `investigation-failure`, `limit-stop` and `invalid-submission`;
  - `reporting.contribution.report` (`inability`, `statement`) for an accepted attempt with no designated answer;
  - whether the attempt was reused or newly executed (`reporting.reused`).
- **Probe evidence:**
  - *Undesignated inability.* An accepted submission with no investigrams and `report.inability: 'UNDESIGNATED_INABILITY_SENTINEL'` renders only "No answer has been designated for this question." and an `(accepted)` usage line. The sentinel appears only in JSON `reporting`.
  - *Malformed reply.* Renders `Attempt: investigation-failure` without "Malformed agent response.". A reused copy of that failure renders identically to the fresh one; both say "Fresh answer selection", which describes answer selection rather than the attempt.
  - *Earlier behavior.* Legacy `renderInvestigationView` printed `kind (code): reason|diagnostic`, outcome guidance, and "Retained outcome; no new investigation." / "New investigation request.".
- **Why it matters:**
  - The decision requires the applicable attempt outcome, including producer-reported inability, to be delivered in request reporting, including on reuse.
  - The checkpoint presents CLI output as a supported consumer, and the plan requires existing human-output coverage to be preserved.
  - A CLI user receiving "no answer" cannot tell agent inability from a malformed exchange, a guard stop or a reused earlier failure without switching to JSON.
- **Tests:** No existing test asserts the rendered text of attempt reporting. `investigation-integration` "worker call guard…" and `investigation-answer-outcomes` assert only JSON `reporting` fields.
- **Suggested direction (not prescriptive):** render the attempt outcome kind, code and reason/diagnostic, the attempt report's inability/statement, and reused versus new execution, in the reporting area only. Add one rendered-text assertion for each of these. The answer payload and identity must stay unchanged; the decision requires that.

**F2 (minor). Over-bound contribution acquisitions are attributed as `delivered`, while over-bound program evidence is `withheld`.**

- **Code:** In `conductDialog`, the program `evidence` path calls `work.withheld(...)` when `bounded()` refuses the page.
- **The inconsistency:** The new `contribution` path records `acquiredContributions([], limitations, false)`, and the next dispatch then marks it `delivered`.
- **Probe evidence:** In the probe, an `explain` over a 70,000-character prose item produced two work entries (initial subject delivery and an explicit `item` request). Both had `query.kind: 'contribution'`, `status: 'unavailable'`, `records: 0`, `delivery: 'delivered'`. The neighbouring program-evidence entry follows the `withheld` convention.
- **Impact:** No content or exposure is fabricated; the records and deliveries are empty and the omission limitation is present. Only the delivery disposition is inconsistent between the two acquisition routes. Consider recording `withheld` here as well, or documenting that `delivered` means the omission notice was dispatched.

### Assessment against the review focus

1. **Dispatch.**
   - `captureApplicationCatalog` rejects `interpretation` Lens requirements. Contribution Lenses must reference a captured operation with the matching subject signature.
   - `applicationCatalog.operations` is now `contributionOperations`. `openApplication` builds only `contributionEvaluation`, and the direct `evaluateOperation` host maps module and selected-content subjects to the same `contributions.evaluate`.
   - Hosted configuration returns contribution dialog agents. The worker bridges `agent` and `selectDialogAgent` to the same route.
   - The remaining legacy `investigation/*` imports are types, or presentation/resolution of legacy record kinds that the supported path no longer creates. This matches the inventory's M4 retirement scope.
2. **Attempt/answer cases.**
   - Evaluation retains unconfigured attempts through `ledger.abandon` without opening an agent.
   - Transient kinds stay retryable.
   - Reuse is restricted to the fingerprinted method (`contributionOperationMethod` digests the operation and the full catalog), and the cached attempt result supplies the reused report.
   - Answer projections exclude attempt diagnostics, and exact presentation returns `reporting: null`.
   - `investigation-answer-outcomes` covers all five cases for `summarize` and `state-behavior`, plus worker retry. I found no diagnostic entering an answer. F1 is the only place where delivered diagnostics are lost, and only in rendering.
3. **Selected support.**
   - The final answer support keeps owner production identity, producer, origin, report, qualification and captured causes; it no longer embeds whole productions.
   - The tripwire test in `m3-agentic-cutover` mocks ledger `invoke`/`associations`/`investigram` and store `put`/`get`/`lookup`/`capture` across exact and detached presentation, including after close.
   - In the invalid-batch test, a withdrawal plus a dangling member is rejected atomically, with the standing answer unchanged.
4. **Inspection identity.**
   - `selectContributionInspection` hashes exact subjects, uses, items, the support identity, reverse invocations and coverage, through `identityReference`. Source text is not rewritten.
   - Name lookup merges native matches with historical common identifications, adding a displaced-standing qualification and `identifications` on the resolution.
   - Mixed selections construct the native answer from module/group candidates. Non-native Entity candidates are appended to the common inspection; I traced this, and `inspection.construct` always supplies `associatedSubjects`, so none are silently dropped.
   - Literal and foreign references stay unresolved (`unknown-reference`).
5. **Migration inventory and presentation.**
   - Each of the 13 removed `investigation-integration` cases is listed with a replacement or a retirement rationale. The replacements that I spot-checked exist and assert what the inventory claims.
   - Owner pages and qualification/change/conflict pages use 24-entry pages. An unknown continuation keeps failed status. Omission counts are explicit.
   - JSON and unicode Views carry agent prose, names, qualification statements and bounded assertions. Non-prose item bodies are replaced by an "available through application content" notice. Evidence appears as IDs, with source locations only under `moreDetails`.
6. **Acquisition and attribution.**
   - Dialog acquisitions create evidence-work entries. They are marked delivered only when the next exchange is dispatched, so an undispatched final batch stays `not-delivered`.
   - Host Entity mapping uses the lookup-only `ledger.native`, which allocates nothing.
   - Usage and progress reports carry the parent request context.
   - Worker results survive `structuredClone`.

### Non-defect observations

- The CLI has no `fresh` option, consistent with the handoff. A supplied `fresh: true` field on a CLI view request is silently ignored, and the request reuses the retained attempt. This is expected under the stated scope.
- `resolveSubjects` pushes the displaced-identification qualification once per displaced match, so it can repeat. This is cosmetic.
- `acquiredContributions` derives `records` only from item, association, declaration and metadata deliveries. Baseline and inventory deliveries appear in `outcome.contributions`, not in `records`.

### Unverified areas and residual limits

- I did not repeat the representative memory comparison (741-module tree, Node 26.11.0), and I could not reproduce the recorded build digest, because its computation is not recorded in the scripts.
- The native kernel-lock credential tests could not run in this VM.
- I did not audit the unreachable legacy evaluator, tree and correction helpers or their isolated tests, which are left for M4.
- No live inference was used, so changed M3 guidance has no live usability evidence; this is consistent with the handoff.

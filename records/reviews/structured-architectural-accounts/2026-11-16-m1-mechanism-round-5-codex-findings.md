Record type: findings
Received: 2026-11-16
Reviewer: Codex (GPT-6), same reviewer as Codex rounds 1, 2 and 4
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 5
Reviewed target: `1f7e1ec8a2aafd3e0f4b28ffb7fdfa5815a081ae`
Prior findings: [Codex round 4](2026-11-16-m1-mechanism-round-4-codex-findings.md)
Prior reviewed target: `2b9fce8823577cc16b94554142d3eb6db3672d33`
Reviewed scope: correction verification and renewed review of the whole current M1 mechanism against original baseline `8a7f2834470644726dd742a0ddaeb1455bac3b2a`. Clean checkout at `6dc77c591cf4b4c96655a5587e7f4ad59a61bdf8`; its difference from the implementation target is the checkpoint record.

## Returned findings

### Recommendation

The three round 4 findings and its false-fulfillment reproduction are corrected. One terminal failure path remains open in the expanded production cleanup (R1): an unexpected acceptance-validation exception permits a subsequent submission to the failed execution. Recommend correcting that path and verifying its regression before M2.

The broader pass found no other confirmed actionable defect. O1 records a reproducible secondary-standing case whose interpretation is less certain; it is not counted as a defect or presented as grounds for an automatic semantic change. The human determines whether the checkpoint is sufficient. This review does not accept that gate or authorize closure or merge.

### Method and changes examined

The human requested both checking the corrections and another broad review, with attention to defects missed previously. I examined the entire current contribution mechanism and its tests, the correction diff and descriptive architecture, the governing decisions and relevant plan/checkpoint obligations, and the recorded human clarification about displacement context. This is a renewed pass by the same reviewer, not an independent fresh agent session.

The correction changes method-specific identification to follow identifying-content provenance, records excerpt extent, limits structural repair to acceptance, separates attempt answers from all standing answers of a Query result, validates reported-answer ownership, and closes handles when the producer callback throws. I checked those changes first, then examined interactions among independent batch attribution, nested membership, shared Query results, exact historical answers, acquisition coverage and terminal failures.

Additional probes used the compiled mechanism and its controlled helpers, without changing source or test files. A five-node nested designation graph included shared descendants and independently produced nodes. Three different batch orders exercised forward references, membership closure, pre-change delivery, disclosure before conclusion, and a bare-item control. Separate probes exercised excerpt boundaries with escaped and non-ASCII text, asynchronous failure, historical answer reuse, validator failure and secondary standing disclosure. Expected results came from the governing distinctions, rather than from copying the status implementation.

### Resolution of round 4

| Prior finding or observation | Result |
| --- | --- |
| F1 — method selection follows the organizer | Resolved for the reported defect. Identification selection now checks the producer of identifying content. Regression coverage separates the finder and organizing policy, preserves the declaration's attribution, distinguishes another method's identification and checks withdrawal/history. |
| F2 — retained excerpts lose actual coverage | Resolved. History records delivered and omitted UTF-16 code-unit counts for the serialized immutable body. Additional probes recovered the exact returned prefix at zero, small and near-complete bounds, and checked complete delivery at and beyond the body length. The retained extent object is frozen. |
| F3 — fulfillment exceptions reopen repair after acceptance | Resolved. Fulfillment is outside the structural-repair catch. Regression coverage uses both zero and one permitted repair and checks the original exception, one producer callback, retained acceptance and a closed handle. |
| O1 — an old standing answer falsely fulfills a fresh partial attempt | Resolved for the reported behavior. `attemptAnswers()` selects the attempt's own designations and explicitly returned existing answers; an empty selection reports `no-answer-supplied`. Whole-result assessment remains separate. The regression checks partial work, explicit reuse and rejection of a reported answer belonging to another Query result. An additional probe checked deliberate historical-answer reuse after withdrawal: attempt fulfillment retains displacement history while whole-result assessment still reports `no-current-answer`. |
| Known open-handle observation | Resolved when the producer callback itself throws, including asynchronous rejection. Cleanup is incomplete for an unexpected acceptance-validation exception; see R1. |

The checkpoint explicitly records the implementing agent's changed scope disposition for O1. The correction follows the existing fresh-attempt contract; this review does not infer human checkpoint acceptance from that disposition.

### R1 — P2: an unexpected acceptance-validation exception leaves the failed execution open

Location: `src/lib/contributions/outcomes.ts:150–153`, contrasted with the callback cleanup at lines 136–141.

`produce()` now closes its handle when the producer callback throws. However, if `ledger.accept()` throws an unexpected error, the catch immediately rethrows it without closing the still-open handle. A content-type validator or identifying-name extractor can fail this way. These callbacks are part of the supported catalog boundary; a programming defect in one must propagate, but the execution whose boundary has failed must also end.

Reproduction against the compiled target:

1. Construct a ledger with the built-in prose and identification contracts plus a controlled `broken` content contract whose `accept()` throws a particular `TypeError`.
2. Call `produce()`. Capture its handle in the producer callback and return a qualified investigram containing an item of type `broken`.
3. Await rejection and verify it is the original `TypeError`. The ledger remains at position zero with no retained production, but the captured handle has `closed === false`.
4. Call `ledger.accept()` with that same handle and a valid qualified prose contribution. It succeeds and retains an accepted production after `produce()` has already failed.

This is the same prohibited late-submission outcome as the earlier producer-exception observation, through a different terminal path. It is a pre-existing lifecycle gap left uncovered by the new cleanup, not a regression introduced by the correction. Atomic staging itself works in this reproduction: no part of the failed contribution is retained.

The [common-contributions execution contract](../../../docs/decisions/common-analysis-contributions.md#production-and-execution) requires late submission to be rejected after execution ends. The [engineering lifetime guidance](../../../dev/engineering-guidelines.md#state-and-resource-lifetimes) also requires cleanup on failure. Fixing this does not require designing the deferred detailed failure taxonomy.

Ensure every terminal exit from the shared boundary closes or concludes an open handle while preserving the original exception. Keep handles open only while a permitted structural-repair attempt is actually continuing. Regression coverage should distinguish a repairable `InvalidContribution`, an unexpected validator failure before acceptance, and a fulfillment-check failure after acceptance. The last case must preserve its accepted contribution and must not reopen repair.

### O1 — unresolved observation: secondary standing disclosure does not make its change known

Locations: `src/lib/contributions/production.ts:184–188` and the known-change set in `src/lib/contributions/status.ts:93–96`.

Reproduction:

1. B supersedes A. Production P actually acquires B's use while B stands.
2. C supersedes B. P now has C as a pending exact-use cause.
3. Before submitting, P acquires A. A's displacement context includes B, and B's returned `standing.displacedBy` explicitly names C.
4. C remains in P's pending causes and in its concluded producing-context causes. The recorded declaration delivery identifies B and its producer concerns; C is not captured in its known-change fields.

This differs from the previously clarified context-only case: P actually acquired B before C, so C has a valid exposure path. The question is whether the later secondary-standing description is sufficient disclosure to suppress that existing cause.

I initially suspected a missed known-change route. Closer comparison with the decision leaves an important qualification: the returned standing identifies B and C and says B is displaced, but does not state whether C is a withdrawal or supersession. The exact-notice contract explicitly requires the operation. This is therefore not equivalent to the previously fixed delivery of a full `Cause`, which includes the operation and affected route. I do not assert that a bare secondary-standing reference must automatically be treated as a qualified notice.

Before this context is presented through the real producer adapter, make this distinction explicit in its contract/test: either it is intentionally only standing plus a reference, requiring a further qualified notice/acquisition, or the delivery supplies the required change information and records C as known. Preserve the human's constraint that supplying displacement context alone creates no acquisition of B or C's replacement content and no new exposure path. The current reproduction is evidence of a boundary needing interpretation, not authorization for a new propagation or suppression policy.

### Verification and limits

- `npm run check` — passed.
- `npm run build` — passed.
- `node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js` — **48/48 passed**, no skips.
- Additional nested-membership, independent-batch and permutation probes — **21 cases passed**. Transitive membership causes remained distinct from bare-item exposure, and disclosed membership changes stopped being producing-context causes before conclusion.
- Additional excerpt-boundary, asynchronous-failure and historical-answer probes — **8 cases passed**.
- R1 and O1 reproduced as described. R1 preserved the original thrown object and unchanged pre-acceptance state, then demonstrated a successful late acceptance.
- `git diff --check 2b9fce8..1f7e1ec` — passed.

The complete legacy suite was not rerun in this round. The new mechanism still has no application/Session/Lens/CLI consumers; current targeted checks are independent evidence, and the checkpoint's complete-suite results remain implementing-agent evidence. No live inference, diagram integration, real producer migration or representative Session performance exercise was performed.

The existing M2/M3 obligations remain: real method/native identity correspondence, Claim-context validation, deterministic semantic answer ordering, selected-content and originating-question baselines, dependency acquisition, nested designated-content delivery, detailed failure/cancellation handling, shared Session lifetime, live dialog usability, diagrams and option execution. This review does not recategorize those planned integration checks as new M1 defects. Remaining implementation-choice judgments are unchanged, subject to R1 and the O1 interpretation above.

Only this findings record was added. Implementation, tests, governing material, earlier review records, the handoff and task/checkpoint status were not modified.

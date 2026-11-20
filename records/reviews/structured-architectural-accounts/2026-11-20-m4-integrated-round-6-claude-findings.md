# Structured architectural accounts final integrated review: round 6 findings

Record type: findings
Received: 2026-11-20
Reviewer: Claude (Opus 5.5), the same session that performed round 5, rereviewing its corrections at the human's request
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 6
Reviewed target: `3ef4e20dec8899b7bbd2b75cc8262ff11791cada`, with disposition update `edf9f29`
Prior findings: [round 5](2026-11-20-m4-integrated-round-5-claude-findings.md) (rounds 1–4 as listed there)
Prior reviewed target: `801e2dd19603455947f32b9936d8f033b1feb5fc`

## Returned findings

### Scope and method

- This round covers the correction delta `801e2dd..3ef4e20` (`0545ae4`, `3ef4e20`), task follow-up `16918ed`, and the round 5 section of the [disposition](2026-11-19-m4-integrated-disposition.md). It is not a new full-branch derivation. The round 5 full-branch assessment still applies to code outside this delta. `git diff 3ef4e20 edf9f29` touches only the disposition.
- I read every source, test and documentation change in the delta and checked each against the human's direction in `16918ed`.
- No live inference. No implementation, governing, task or other record change other than this findings file.

### Verification

- Removed the reused `_build`, then ran `npm run check` and `npm run build`. Both passed.
- `buildIdentity("_build").sha256` = `5ad660bc9cdbb6b99b66c2cb90e8c70ed27dc02be76991e7283f433f8b2d9bde`. This matches the disposition and was unchanged after the suite.
- Full offline suite, `node --test --test-concurrency=2 _build/test/*.test.js`, macOS, Node 22.13.1, with local loopback and credential-lock access: **731/731 passed**, with 0 failures, 0 cancellations and 0 skips, in 487 s. This was one uninterrupted run with the build and tracked files fixed, and `git status` was clean afterwards.

### Round 5 findings

**F1: resolved as the human directed.** Returned withdrawn designations remain acceptable. The changes:
- New `answerStanding` in `outcomes.ts` captures each supplied designation's standing and the exact displacing declarations, each with its operation (withdraw or supersede). It is read-only and records no exposure. It appears in `ContributionAttemptResult.answers` for every accepted attempt, including attempts with no result contract and reused attempts. It also appears on each `AlternativeFulfillment`.
- The CLI text now shows attempt fulfillment and each returned answer's standing "when assessed", names withdrawal versus supersession, and states that returning a designation is neither endorsement nor re-adoption.
- Query-result fulfillment and answer identity are unchanged. The projection stores only the status and per-alternative `unmet`, so the added `standing` field cannot reach answer identity. The new application test confirms the no-current-answer projection is identical with and without the returning attempt.
- The tests also cover: no implicit declarations; re-adoption only through a new declaration; unchanged historical answers and captured reporting after re-adoption and Session close; and rendering from captured data alone.
- The guidance keeps the unchanged-standing/causes guarantee.

**F2: resolved as the human directed.** `conductDialog` now acquires initial subjects and context once per complete canonical reference, in first-occurrence order with subjects first. The unchanged request still carries every subject role and context entry. Different routes stay distinct: component versus whole item, designation, whole contribution and Entity baseline. Later deliberate tool acquisitions are not de-duplicated. Exposure stays truthful, and the pre-dispatch guard still records nothing. Deduplication cannot be bypassed by spelling `component` differently, because supported application selections require `component` to be `null` or a string (`contributions/subjects.ts:35`) and acceptance normalizes it to `null`. Property order is canonicalized, and a test checks that. The instructions now say that initial responses are per exact selection rather than one per request entry. The method bumps are appropriate (dialog `@14`, wire `@10`, presentation `@5`).

### New findings

None.

### Non-defect observations

- Reporting for a reused attempt from the in-Session cache shows standing as it was when that attempt was assessed. It can therefore show `standing` after a later withdrawal. The text says "when assessed", the disposition states this intentionally, and the answer view shows current standing, so nothing is misstated.
- With de-duplication, initial responses no longer line up position-for-position with `subjects` plus `context`. Each response identifies its address or Entity and the instructions describe the rule, so an agent can still match them.

### Residual limits

- The changed guidance (`@14`) has offline evidence only. The earlier live authoring evidence is correctly kept attributed to `801e2dd`.
- Representative memory was not remeasured. Ownership and retention are untouched.
- The round 5 residual limits still apply to areas outside this delta.

### Gate recommendation

Both round 5 findings are resolved as the human directed, and there are no new findings. The corrected target reproduces its stated digest and a clean 731/731 run. I see no further correction needed before the human's sufficiency determination for the final integrated gate. Review sufficiency, task closure and merge remain the human's decision.

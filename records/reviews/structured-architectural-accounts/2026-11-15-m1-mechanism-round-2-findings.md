Record type: findings
Received: 2026-11-15
Reviewer: Codex (GPT-6), same independent reviewer as round 1
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 2
Reviewed target: `b02c7bcdd59e4253dbe9cddb761c590bb52ca360`
Prior findings: [Round 1 findings](2026-11-15-m1-mechanism-round-1-findings.md)
Prior reviewed target: `84c1cc16f70f3b384a6d772aa3bcb8fda70836b5`
Reviewed scope: M1 mechanism under the original handoff, with focused rereview of `84c1cc16f70f3b384a6d772aa3bcb8fda70836b5..b02c7bcdd59e4253dbe9cddb761c590bb52ca360`; original implementation baseline remains `8a7f2834470644726dd742a0ddaeb1455bac3b2a`

## Returned findings

### Recommendation

No actionable findings remain from round 1, and no new actionable defect was found in the corrections or their affected paths. Recommend that the human consider the M1 mechanism checkpoint sufficient to begin M2, retaining the existing integration and verification obligations. This is a reviewer recommendation, not human acceptance of the gate or authorization to close or merge the task.

### Changes reviewed and method

Correction commit `b02c7bc` stages identifying names and immutable contribution copies before retention, adds item qualification/support metadata to bounded delivery, replaces public routed-item acquisition with qualified `member()` acquisition, and captures delivery records as owned immutable values. It also adds four regression tests and updates the descriptive architecture.

Reviewed the source and test diff directly, traced each correction through acceptance, acquisition and status derivation, and compared the new assertions with the governing requirements and round 1 reproductions. The original handoff and the round 1 findings are unchanged. The checkout was clean at `111ba8b` when this review began; the only difference from the reviewed implementation target was the checkpoint record. Its correction summary and reported verification were read as context, not proof.

### Resolution of prior findings

| Finding | Rereview result |
| --- | --- |
| F1 — partial acceptance of a forward identifying reference | Resolved. Name extraction resolves against the complete staged item population before retained mutation. All items are installed before declaration indexing. The new test covers both pool orders with one production and independently attributed productions, checking identity, name lookup, ownership and concluded production records. An additional reviewer probe made an identifying contract throw during name extraction and confirmed that the retained-state snapshot was unchanged. |
| F2 — excerpt loses item qualification | Resolved. `DeliveredItem` carries type, item qualification, referents, evidence, support and dependencies separately from the bounded body. The new test distinguishes item-only qualification from qualification narrower than the owner's and checks complete and excerpt delivery. An additional bounded-member probe verified preservation of an item-only limitation alongside a separate declaration limitation. |
| F3 — routed item omits known displacement context | Resolved. Public `item()` is bare-item acquisition; the routed helper is private. Public `member()` verifies membership and supplies the qualified association, standing and known displacement grounds together with the selected item. The new tests distinguish withdrawal/supersession already known at delivery from a later displacement and retain the bare-item control. The reviewer probe also checked a withdrawn use with its own qualification, independently of the content's qualification. |
| F4 — delivery history aliases caller values | Resolved. `#record` clones and recursively freezes each captured delivery at acquisition time. Returning a shallow copy of the history array no longer exposes mutable nested records. The new test covers item/route/scope inputs, returned listing mutation and resulting causes. Additional reviewer probes confirmed that mutation of both a supplied notice address and the returned notice cannot change the recorded notice or recreate its suppressed cause, and that the original item-address reproduction concludes with resolvable delivery history. |

The corrections preserve the distinctions established in round 1: bare-item acquisition creates no exact-use exposure, known changes remain disclosed context rather than later causes, and an exact notice does not imply replacement-content delivery. The member operation's additional association delivery is truthful because its returned value actually includes that qualified use. None of these fixes requires a new consequential semantic decision.

### Independent verification

- `npm run check` — passed.
- `npm run build` — passed.
- `node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js` — **36/36 passed**, no skips.
- `git diff --check 84c1cc1..b02c7bc` — passed.
- In-memory Node probes against the compiled target — passed: failure during identifying-name extraction preserves the retained-state snapshot; caller changes cannot rewrite item or exact-notice history; bounded member delivery retains separate item/use qualification and known withdrawal grounds.

No implementation or test files were modified by this review. Dependencies already installed in the checkout were used. The complete offline suite was not rerun; the checkpoint's 704/704 result remains implementing-agent evidence. No live inference or representative-Session performance measurement was performed.

### Remaining limits and M2 obligations

The twelve implementation-choice judgments from round 1 remain applicable. This focused rereview does not establish the real application path or discharge its planned checks: native/common Entity correspondence, mechanical recomputation after withdrawal, method-specific naming and qualification, semantic answer equality under reordered arrivals, real Claim-context kinds/methods/scopes, shared Session lifetime/invalidation, selected-content dependencies and originating question context, nested designated-content acquisition, live dialog usability, diagrams and option execution.

The bounded accumulating-Session exercise must still examine retained-data growth, status derivation cost, delivery volume and identification-scope warning breadth. These are existing obligations of the approved plan, not newly discovered M1 defects. The human's review-gate determination remains pending; this record changes neither the task's status nor the original handoff.

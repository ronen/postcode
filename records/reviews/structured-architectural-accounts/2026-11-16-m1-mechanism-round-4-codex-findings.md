Record type: findings
Received: 2026-11-16
Reviewer: Codex (GPT-6), same reviewer as the Codex round 1 and round 2 findings
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 4
Reviewed target: `2b9fce8823577cc16b94554142d3eb6db3672d33`
Prior findings: [Codex round 2](2026-11-15-m1-mechanism-round-2-findings.md), [Claude round 2](2026-11-15-m1-mechanism-round-2-claude-findings.md), [Claude round 3](2026-11-15-m1-mechanism-round-3-claude-findings.md), [Copilot round 3](2026-11-15-m1-mechanism-round-3-copilot-findings.md)
Prior reviewed target: Codex round 2: `b02c7bcdd59e4253dbe9cddb761c590bb52ca360`; Claude round 3: `5ebe10a19be93a2613ec5fe5cf5f5dcaf16df295`
Reviewed scope: the whole current M1 mechanism under the original handoff, against baseline `8a7f2834470644726dd742a0ddaeb1455bac3b2a`, including all intervening corrections. Clean checkout at `0cbabe26edba66b4edb3294d0c33f9663387c933`; its difference from the implementation target is the checkpoint record.

## Returned findings

### Recommendation

Three new actionable defects remain (F1–F3 below). Recommend correcting them and checking their regressions before beginning M2. O1 supplies a concrete false-fulfillment reproduction in an area a previous review already assigned to M2; it is not a fourth newly discovered issue. Its scope disposition should be explicit, and the current result must not be treated as evidence that the fresh-attempt fulfillment contract works.

This is a reviewer recommendation. The human determines whether the checkpoint is sufficient; this record neither accepts that gate nor authorizes implementation, closure or merge.

### Review method and changes examined

The human requested renewed scrutiny of the whole mechanism, rather than another verification limited to corrections. I reread the governing contracts, all six contribution modules, their tests and the cumulative implementation changes, and derived additional probes from the contracts. I examined later reviewers' records after developing the candidate findings, to identify overlap and prior dispositions. This was the same reviewer/session with knowledge of my earlier work, not a separate fresh reviewer.

The intervening corrections address disclosure of known changes, qualified declaration acquisition, acquisition validation, mutable retained values, duplicate production identities and historical method-specific identification access. The human's clarification about displacement context was retained: acquiring A with context about replacement B does not acquire B's content or use, and a later displacement of B alone must not create that exposure.

The additional investigation emphasized independent attribution, delivery-history fidelity, acceptance/fulfillment boundaries, fresh attempts and timing across multiple delivery routes. An independent matrix exercised 70 combinations of exposure path, change timing and later disclosure. Those cases passed; the findings below concern different gaps.

### F1 — P2: method-specific identification filters the organizing producer instead of the identifying finding

Location: `src/lib/contributions/ledger.ts:167–170`.

`identifications(entity, { method })` filters the production owning the association declaration. A finding and its organizing declaration may legitimately have different producers and methods. Consequently, the method that actually produced an identifying finding can receive no result, while the organizing policy is reported as the matching method.

Reproduction using controlled mechanical producers:

1. Producer `finder@1` contributes Entity E and an identification item naming E.
2. Independently attributed producer `policy@1` contributes an identification-role association selecting that item. Accept the two qualified contributions in one batch.
3. General `identifications(E)` returns one association. `identifications(E, { method: 'finder@1' })` returns zero; the same request for `policy@1` returns one.

The [common-contributions decision](../../../docs/decisions/common-analysis-contributions.md) requires method-specific answers to retain that method's identifying findings and explicitly permits an independently attributed deterministic organizing policy. The current filter conflates those two attributions. Changing the default standing filter in round 3 preserves withdrawn declarations but does not fix this case.

Correct method selection to preserve the provenance of the identifying content, with the organizing use and its standing available separately. Exercise separately produced findings/organization, including withdrawal and a different method's identification. A test where item and declaration share one producer cannot establish this contract.

### F2 — P2: retained excerpt deliveries lose their actual coverage

Locations: `src/lib/contributions/production.ts:147–158`; the item variant of `Delivery` in `src/lib/contributions/model.ts:197–200`.

The returned `DeliveredItem` states the exact text prefix and omitted-character count, but the retained production history records only `coverage: 'excerpt'`. It retains neither the bound, range, omitted count nor excerpt text. Once the return value is discarded, the history cannot distinguish substantially different inputs.

Reproduction: at the same ledger position, begin two productions and acquire the same sufficiently long item using `excerptCharacters: 1` and `excerptCharacters: 40`. The returned texts differ, but `JSON.stringify(first.deliveries) === JSON.stringify(second.deliveries)` is true. Concluding the productions preserves the same insufficient delivery descriptions. The item address and delivery position cannot recover which prefix arrived.

The [exposure decision](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) requires retained history to identify actual supplied information with its delivery position and coverage. The existing complete/excerpt distinction prevents claiming complete delivery, but does not state actual excerpt coverage. This matters to tracing a later finding back to its supplied inputs even though the present cause algorithm treats both excerpts alike.

Retain enough immutable coverage information to recover the actual delivered portion, and verify that distinct excerpts remain distinguishable after conclusion. This does not require storing duplicate full content or reinstating a complete-target acquisition gate.

### F3 — P2: fulfillment-check errors can trigger structural repair after acceptance

Location: `src/lib/contributions/outcomes.ts:114–123`.

The `try` handling repairable `InvalidContribution` errors covers both `ledger.accept()` and subsequent fulfillment assessment. A contract predicate can throw that error after acceptance has already committed the contribution and closed its handle. The boundary then treats the accepted submission as structurally invalid, attempts repair on the closed handle, and replaces the original error with a lifecycle error.

Reproduction: supply a content requirement whose `unmet()` throws `new InvalidContribution('fulfillment checker defect')`; use `repairs: 1`; have the producer return a valid qualified contribution designating matching content. The first producer callback sees an open handle. Acceptance succeeds. The callback is invoked a second time with the checker error as its repair problem but `handle.closed === true`. Its next acceptance throws `Production is not open in this ledger`; one accepted production remains retained. With no repairs, the attempt to abandon the already-closed handle also masks the checker failure.

This violates the producer boundary's stated behavior that unexpected defects propagate, and confuses post-acceptance checking with structural rejection. The predicate's error is a checker defect, not a reason to repair the already accepted submission. It can also cause additional producer work after submission has concluded.

Restrict structural repair handling to the acceptance operation. Errors from subsequent fulfillment checks should propagate without invoking repair or abandoning accepted work. Add a regression that verifies one callback, retained acceptance, a closed handle and preservation of the original checker error. The existing unexpected-producer-error test does not cover this post-acceptance path.

### O1 — known deferred area: a fresh partial attempt is reported fulfilled by an old answer it did not return

Location: `src/lib/contributions/outcomes.ts:117–118`.

The current producer boundary assesses every standing designation of the invocation's shared Query result, irrespective of what this attempt designated or explicitly returned. In a controlled reproduction, an earlier attempt designated a valid `test-table` answer. A fresh invocation for the same request then accepted only qualified prose notes and a reported inability, with no designation and an empty reported `answer`. Its returned outcome nevertheless contained `fulfillment.status === 'fulfilled'` because the old table remained standing.

The [qualified-answers decision](../../../docs/decisions/qualified-answers-over-contributions.md) allows a fresh attempt to succeed without new declarations by explicitly returning an existing qualified answer. It also requires incomplete fulfillment to remain distinguishable. An old answer's existence alone does not establish the fresh attempt's fulfillment. Read-only assessment of the Query result as a whole remains useful; attaching that assessment to an individual attempt is the problematic step here.

Claude round 2 already observed that reported answers are ignored by fulfillment and are not checked against the invocation's result, and assigned that integration to M2. This reproduction strengthens the evidence of current impact rather than claiming a new discovery. I recommend addressing it when adapting the existing boundary for M2 and adding both controls: explicit reuse of an adequate existing answer succeeds; a partial attempt that supplies no answer remains unmet. If the current M1 outcome is intended to certify attempt fulfillment, it needs correction before that claim is accepted. Any decision to change the previously recorded scope disposition belongs to the human/implementation workflow.

### Other observations and limits

The previously noted producer-exception cleanup issue also reproduces: when the producer throws before submission, `produce()` propagates the exception but leaves its handle open; a captured handle can subsequently be submitted directly. Claude round 2 explicitly deferred lifecycle/failure handling to M2/M3. This is a known integration obligation, not another new finding. The real execution boundary must prevent late submission when the attempt has failed.

The earlier implementation-choice judgments remain subject to the same real-path obligations. This review does not establish native/common identity correspondence, real Claim-context validation, application-wide Session lifetime, method-specific answer equality across arrivals, selected-content/dependency baselines, nested designated-content delivery, live agent behavior, diagrams, option execution or representative retained-data performance. Those are planned later-milestone checks. No live inference or performance trial was performed.

### Independent verification

- `npm run check` and `npm run build` passed.
- Two complete runs of `node --test _build/test/*.test.js` each reported **708/711 passed**, three failed, no skips. All 43 contribution-mechanism tests passed. The second run captured the failures: loopback sign-in validation, returning sign-in/client reuse, and identity-only permission decline, all in `chatgpt-auth.test.js`.
- A subsequent `node --test _build/test/chatgpt-auth.test.js` run outside the sandbox passed **20/20**, including those three failures. These tests use simulated authentication. This supports a sandbox explanation; it is not a claim that a complete 711-test run passed outside the sandbox.
- In-memory Node probes against the compiled target reproduced F1–F3 and O1, and the known open-handle observation. No product/test files were changed to run them.
- The 70-case timing/disclosure matrix passed. It combined exact-use, current-inventory, history-inventory, designation-membership and inherited-content exposure with changes before/after first delivery and later disclosure by notice, use, declaration, item, metadata or inventory refresh. It checked pending and concluded causes and rejection of post-submission notification. In particular, merely refreshing an inventory did not suppress an earlier cause, while exact disclosed changes did.
- `git diff --check 8a7f283..0cbabe2 -- src test docs` passed. The unrestricted historical diff reports trailing whitespace in the preserved raw Copilot review table; that is review evidence formatting, not an implementation finding, and was left unchanged.

Only this findings record was added. Implementation, tests, governing material, the handoff and task/checkpoint status were not modified.

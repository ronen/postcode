# Structured architectural accounts final integrated review: round 5 findings

Record type: findings
Received: 2026-11-20
Reviewer: Claude (Opus 5.5), a fresh session independent of rounds 3 and 4
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 5
Reviewed target: `801e2dd19603455947f32b9936d8f033b1feb5fc`
Prior findings: [round 1](2026-11-19-m4-integrated-round-1-findings.md), [round 2](2026-11-19-m4-integrated-round-2-findings.md), [round 3](2026-11-19-m4-integrated-round-3-claude-findings.md), [round 4](2026-11-19-m4-integrated-round-4-claude-findings.md); [disposition](2026-11-19-m4-integrated-disposition.md) through `5f2c564`/`18c8835`
Prior reviewed target: `d724192871ab15510630e8a52374db8e313b21db`

## Returned findings

### Scope and method

- Complete implementation `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1..801e2dd19603455947f32b9936d8f033b1feb5fc`, not only the latest correction. The checkout was at `18c8835`; `git diff 801e2dd 18c8835` touches only the disposition and the new validation record, so source, tests and scripts equal the target.
- I formed an assessment before reading the prior findings or disposition, then compared conclusions (below).
- Read in full: `contributions/model.ts`, `ledger.ts`, `production.ts`, `status.ts`, `dialog.ts`, `outcomes.ts`, `answers.ts`, `evaluation.ts`, `operations.ts`, `state-model.ts`, `state-diagram.ts`, `application/executor.ts`, `openai/contribution-protocol.ts` and the CLI contribution text renderer. I also read the approved plan, the structured-explanation decision, the relevant parts of the qualified-answers and contributions architecture documents, the retirement inventory and the [context-authoring validation record](../../validation/structured-architectural-accounts/m4-option-context-authoring.md). Mechanical providers, worker transport, credentials, immutable ownership and memory were checked through their suites and earlier records, not re-derived line by line.
- Probes were small scripts in the session scratchpad that imported the compiled build read-only. They were run only after `_build` was complete and did not write to the checkout.

### Verification

- Removed the reused `_build`, then ran `npm run check` and `npm run build`. Both passed. There are 74 compiled test files for 74 sources, so no emitted files from deleted legacy tests remain.
- `buildIdentity("_build").sha256` = `a16e5600b93e0101bbb4bbfa1995b260b103e58087f52c8a989251d11c22efb6`. This matches the validation record and was unchanged after the suite.
- Full offline suite, `node --test --test-concurrency=2 _build/test/*.test.js`, macOS, Node 22.13.1, with local loopback and credential-lock access: **727/727 passed**, with 0 failures, 0 cancellations and 0 skips, in 492 s. This was one uninterrupted run with the build and tracked files fixed throughout, and `git status` was clean afterwards. This is the first full-suite result attributed to `801e2dd`; the implementer's record claims only 92 focused tests for this revision.
- No live inference. No implementation, governing, task or other record change other than this findings file.

### Independent assessment of the mechanism

I found no defect in these areas:

- **Atomic acceptance:** native identity is resolved before allocation; every reference, role, component, designation, membership-cycle and report-answer check is staged before the first mutation.
- **Exposure:** recorded only at dispatch. The checkpoint/discard covers the response bound, the character guard, a stop before dispatch and invalid-submission repair. Retrieval and answer assembly do not use a production.
- **Cause derivation:** exact, scope addition/removal, inherited and membership routes. Known changes are excluded by notice, disclosure or delivered concern. There are no self-causes, and nothing is cleared automatically.
- **Reuse:** ordinary requests reuse completed outcomes; transient failures stay retryable; fresh requests always run and deliver the current designations.
- **Per-alternative fulfillment** and the no-current versus no-designated distinction.
- **Option invocation:** checked against the operation's subject signature, keeps the exact owner and key, and delivers context after the subjects.
- **The state-diagram renderer:** adds no state, transition or completeness claim, and states unknown entry and coverage explicitly.

### Findings

**F1 (low): a reported answer can be a displaced designation and is assessed as fulfilling the attempt.** In `ledger.accept` (report handling) and `attemptAnswers`/`assessFulfillment` in `outcomes.ts`, a `report.answer` entry only has to be an add/supersede designation of the invocation's Query result. Its standing is not considered. Probe: withdraw the only summary designation, then run a fresh attempt that submits `{ investigrams: [], report: { answer: [<withdrawn designation>] } }`. Acceptance succeeds. The attempt's fulfillment is `fulfilled` under a designated-answer contract, while the Query result's fulfillment is `no-current-answer`. The application result has `failed: false`, and the answer view shows no current answer. Nothing is reinstated and `history` still discloses the displacement, so retained meaning is intact. Still, attempt reporting asserts fulfillment with a withdrawn answer, and the producer has effectively endorsed withdrawn content without the explicit new declaration the plan requires for re-adoption. Neither the qualified-answers decision ("may return exact references to an existing answer") nor the guidance ("when an earlier answer remains adequate") settles whether a displaced designation counts. This is a semantic choice for the human. Options:
- (a) reject displaced designations in `report.answer` at acceptance;
- (b) accept them, but have attempt fulfillment treat them as not current and disclose that;
- (c) keep current behavior and document it.

I recommend (a) or (b); either needs a regression test.

**F2 (low, newly reachable): option context is not de-duplicated against subjects or within itself.** Round 4 noted that a context entry repeating a subject is acquired and delivered twice, and judged it harmless partly because "no supported path authors it". At `801e2dd` the hosted schema does author `request.context`. A probe confirms that acceptance retains `context: [S, S]` alongside `subjects: [S]`, and `conductDialog` then acquires S three times. Exposure stays truthful, but the duplicates consume response volume and the total character guard, and the guidance never says not to repeat a subject. Options: reject duplicates with `distinct()` at acceptance, as illustrations and endpoints already are; add one sentence to the authoring guidance; or knowingly accept it. Not a gate blocker.

### Assessment of the context-authoring validation record

- **Evidence reproduces.** The 27-file manifest hash matches (`eaac0bef…`). I ran the preserved audit against copies of both run directories in the scratchpad, using my fixed build of the same digest. Both runs pass every check: instructions and schema equal production plus only the recorded elicitation; local references are resolved into the retained option; the subject and context remain distinct; the exact context body and item/owner qualification appear in the first invocation message; and complete context exposure is recorded. The budget ledger gives 14 requests, 340,737 + 15,463 = 356,200 known tokens and one interrupted request with unknown usage, all as stated. The invocation steps had no elicitation.
- **Claims are appropriately bounded.** The run 1 timeout is reported as a limit-stop, not a success, and the record correctly says the repair text was never captured. Its live success is narrow in ways it mostly acknowledges:
  - both runs selected context of one kind: a prose item in the same contribution as the component subject, by local reference;
  - the successful retry was steered to a prose clarification without a diagram, after a diagram follow-up had failed;
  - whether the follow-up agent substantively used the context is not audited. The record does not claim that, but the phrase "live usability of this context-authoring path" should be read as authoring and delivery only.
- **The record does not mention F2,** which this change made reachable.
- **Earlier live coverage:** run 1 adds a second observation of unreliable state-model authoring (non-enum coverage values, an unexpected bearer field). It is properly reported as a limitation rather than a regression, since state-model contracts and instructions are unchanged.
- **Elicitation:** it names the concept ("additional supporting content … distinct from that subject") but no field names or shapes. That stays within the plan's allowance for deliberate elicitation.

### Comparison with prior rounds

My mechanism conclusions agree with round 3's full-branch trace and round 4's correction review. Rounds 1–4 found nothing like F1. F2 updates a round 4 non-defect observation whose premise changed at `801e2dd`. Round 3's other residual observations are independently confirmed and remain limitations:
- notices are capped at 24 per exchange;
- lower-level `invoke` paths throw a plain `Error`;
- local entity keys share a namespace across the pool.

Documentation (architecture contributions, capability and CLI references) now matches the delivered authoring path and claims no CLI route, persistence or new reference kind.

### Residual limits

- Mechanical providers, worker parity, credentials/no-fallback and the ownership/memory mechanism are covered by the passing suite and earlier records, not re-derived.
- Representative memory was not remeasured. The latest change does not touch retention.
- The completeness of the retirement inventory was spot-checked, not audited exhaustively.

### Gate recommendation

No blocking defect. The integrated implementation at `801e2dd` reproduces its digest and passes the full offline suite 727/727 on a fixed build. F1 needs a brief human decision on the semantics (and, if (a) or (b), a small correction with a test). F2 is optional hardening. If the human chooses to document F1 rather than change it and accepts F2, I see the final integrated gate as ready for the human's sufficiency determination. Review sufficiency, task closure and merge remain the human's decision.

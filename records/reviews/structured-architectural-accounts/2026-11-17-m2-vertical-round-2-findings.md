Record type: findings
Received: 2026-11-17
Reviewer: Codex, independent gate reviewer
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 2
Reviewed target: `d6f28cc6d54aa623cc2ca79e1ef77eaf2d7f3d0c`
Prior findings: [M2 round 1 findings](2026-11-17-m2-vertical-round-1-findings.md)
Prior reviewed target: `6f42db00af65d01e5e7f42c8bfab80aafcff4b30`

## Returned findings

### Recommendation

One P2 finding remains: the correction to F8 does not render the identifying information of ordinary mechanically discovered module bearers. I recommend a focused correction and verification of R2-F1 before proceeding to M3. The broader corrections resolve the reproduced F1–F7 failures, and the four original-implementer intent concerns are addressed. I found no additional gate-blocking issue in those corrections.

This is a recommendation to the human arranging the M2 gate, not authorization to begin M3 or close the task.

### Scope and method

The checkout was clean at the exact reviewed target. This round follows the original handoff and reexamines the changes since the prior implementation target, concentrating on correction commits `2493db7`, `a062be2`, and `d6f28cc`. Task, review, and validation records are context rather than implementation. I read the [original-implementer intent check](2026-11-17-m2-vertical-round-1-corrections-intent-check-claude.md) and the [review elicitation record](../../validation/structured-architectural-accounts/m2-trials/review-elicitation.md).

I inspected the answer/support construction, arrangement, application reporting and reuse, originating-question delivery, wire translation, malformed acquisition handling, dispatch accounting, and terminal usage reporting against the handoff's governing decisions. I examined the regression tests and independently reproduced the remaining module-bearer case using the real module-discovery fixture. I also inspected the saved elicitation submissions and selected answers for qualified reuse, exact inconsistency endpoints, and the narrowly targeted withdrawal. This was a read-only inspection of existing live evidence; no new inference was run.

Independent verification under Node 22.13.1:

- `npm run check` and `npm run build`: passed.
- `git diff --check`: passed.
- Focused contribution suite: **64/64 passed**.
- Full offline suite (`node --test --test-concurrency=2 _build/test/*.test.js`): **750 tests, 747 passed, 3 failed**, no skips. The failures were the same sandbox-sensitive loopback authentication cases seen in round 1: real sign-in validation, returning sign-in, and identity-only permission decline.
- Complete authentication file rerun outside the sandbox (`node --test _build/test/chatgpt-auth.test.js`): **20/20 passed**. Together these runs provide passing coverage for every offline test; the sandboxed full run itself was not all-green.
- Independent module-bearer probe: reproduced R2-F1 below. The retained answer contains the normal `module-identification` support, while both the diagram title and bearer note say `Unlabelled Entity`.

### R2-F1 — P2: Ordinary module bearers lose their identifying label in the diagram

**Location:** [`src/lib/contributions/answers.ts`](../../../src/lib/contributions/answers.ts), lines 199–204, especially the `item.type === 'identification'` filter on line 202. Related contracts: [`src/lib/contributions/modules.ts`](../../../src/lib/contributions/modules.ts), lines 15–28 and 142–150.

The new bearer-label selection accepts only the generic `identification` content type. M2's mechanical module-discovery wrapper contributes `module-identification` instead. Its contract supplies an established name when available and a generated handle with provenance otherwise, and it implements the catalog's identifying-name capability. `answerSupport` correctly captures this item and its standing identifying use, but arrangement discards it when deriving the label.

**Reproduction at the reviewed target:**

1. Discover `fixtures/exports/tsconfig.json` using the existing `discover` helper and obtain the module whose handle is `barrel`.
2. Resolve its normal Entity with `moduleEntity`; add no artificial identification.
3. Invoke a result and submit a valid `state-model` whose bearer is that Entity, with one `Idle` state, unknown entry, no listed transitions, and qualified partial/unknown coverage. Designate the model for the result.
4. Select and arrange the answer through `selectContributionAnswer`, `resolveContributionAnswer`, and `arrangeContributionAnswer`.

The fixed support contains a `module-identification` item whose body has `name: null`, `handle: "barrel"`, and `handleProvenance: "source-basename"`.

The rendered text nevertheless starts with `States of Unlabelled Entity` and includes `State bearer: Unlabelled Entity.` The same label feeds the SVG. Multiple models of different discovered module Entities can consequently have indistinguishable bearer labels, despite their retained qualified identification. The exact Entity remains in the structured answer, so this is a presentation-fidelity defect rather than an identity corruption.

The new test in `test/contribution-answers.test.ts` does not cover this normal path: it explicitly adds an agentic generic `identification` for the discovered module before rendering. That extra item makes the filter succeed and masks the omission of the existing mechanical identification.

**Required correction:** derive each Entity bearer's human-readable label from the fixed qualified identification supported by its content contract, including the existing mechanical module type. Preserve name/handle provenance and the exact Entity separately; do not restore raw Session IDs or add ledger access to rendering. Add coverage for an ordinary discovered module without a supplemental generic identification, and for distinct discovered module bearers. This is the remaining part of round 1 F8, within the current M2 vertical scope.

### Earlier findings and intent corrections

- **F1:** fixed support now retains the member-use graph, owner and narrow qualifications, prior displacement, item inconsistencies, support bodies/evidence, and authored illustrations. Selection records no producer exposure; exact presentation remains independent of later ledger changes. The cross-owner, withdrawal, conflict, illustration, and unrelated-acceptance tests pass.
- **F2:** application delivery now distinguishes the attempt's outcome, report, and fulfillment from the current answer's fulfillment. A fresh empty attempt can report inability and `no-answer-supplied` while an earlier fulfilled answer remains standing. Accepted reports attached to selected owners remain fixed support. Exact presentation does not replay invocation-only failure reporting.
- **F3:** ordinary reuse can select a completed accepted production after an earlier failed attempt. This affects execution reporting without prioritizing its claims over other standing alternatives.
- **F4:** selected owners and result uses carry their originating question, including subjects and literal parameters. The wire path preserves literal parameter values instead of interpreting reference-shaped parameter keys as handles.
- **F5:** malformed tool addresses and fields are refused as unavailable before acquisition, without converting genuine internal defects into successful responses.
- **F6:** delivery checkpoints advance at exchange dispatch. The timeout and pre-dispatch controls preserve delivered context and discard undelivered acquisitions respectively.
- **F7:** terminal reporting runs through cleanup, including interruption; the cancellation regression retains already reported usage in Session accounting.
- **F8:** distinct role bearers and generic Entity identifications now render correctly, but ordinary module identification remains incomplete as R2-F1 describes.
- **Intent C1:** current-attempt outcomes no longer enter the Projection. Different failed attempts and an accepted empty attempt can retain the same empty answer identity while delivery reporting distinguishes them. This respects F2's original requirement to keep invocation reporting outside answer identity.
- **Intent C2:** arranged qualifications are grouped and attached to their exact item, use, displacement, inconsistency, or contract source, with owner qualification separately attributed.
- **Intent C3:** rendered diagrams no longer expose raw Entity Session IDs; the exact Entity remains structured content. R2-F1 does not call for reversing this correction.
- **Intent C4:** terminal failure kind and details are retained in the production and survive rebuilding the evaluation's reuse state.

### Other observations and residual limits

The added elicitation evidence addresses the first review's missing live observations of inconsistency reporting, withdrawal, qualified reference reuse/partitioning, and illustration authorship. The examined captures agree with the central reported actions: the second answer reuses the original model address, hypothetical disagreement remains separately qualified, and withdrawal names only the temporary H1 topical use. These are deliberately elicited actions at `2493db7`, not live verification of this round's exact target or evidence of a general reliability rate. The later illustration-support and intent corrections are covered by offline checks.

The prior observations about warning breadth, bounded structural repair, hosted configuration, and work reserved for M3 remain applicable. This round does not recommend suppressing warnings or expanding the checkpoint's migration scope. No new performance measurement, broad visual stress test, or independent validation of the model's architectural conclusions was performed.

Only this findings record is changed for return. Implementation, governing material, the task record, and task status remain untouched.

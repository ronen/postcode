# M2 focused live verification of report-only returns

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review context: [Round 9 findings](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-9-claude-findings.md) and [offline correction verification](../m2-checkpoint.md#round-9-corrections)
Prior live evidence: [Explicit answer reporting](report-answer-verification.md)
Harness: [`run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Outcome and stopping decision

**Both steps succeeded on their first submissions, using 6 of 20 authorized requests and no structural repair.** The initial investigation supplied its own answer designation and omitted the optional producer report. The fresh investigator then submitted `investigrams: []` with a report returning the original answer designation. It created no new investigram or designation, fulfilled the original contract, and returned an unchanged answer alternative.

This observes the newly documented report-only form being used through normal production guidance. The qualification-only placeholder mistake did not recur. The focused uncertainty was resolved, so no retry was made; **14 requests remain unused**. This is integration evidence for one run, not proof of general reliability or architectural correctness. **M2 remains unaccepted; M3 has not begun.**

## Authorization and execution basis

The human authorized the proposed two-step check and 20-request cap in task follow-up `ff143d21c3113ceaa95723115ef36cc0a13cd8cb`, committed before trial preparation. The estimate was 6–10 requests: the prior initial-answer and fresh-review steps used 3 + 5 requests, with the cap allowing ordinary repair and a targeted retry if needed. All dispatched requests, including failures or retries, count toward the ceiling. Earlier unused allowances were not carried into it. This follows the live-trial guidance on `main` previously read at `c7aa85c`.

| Basis | Value |
| --- | --- |
| Application implementation | `4267a051754f62f1c728295cfe94c09b4b9354af` |
| Executed checkout | `ff143d21c3113ceaa95723115ef36cc0a13cd8cb`; only records changed after the implementation target |
| Fixture | Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`, clean before and after execution |
| Subject | `circuit-breaker-policy`, module `src/CircuitBreakerPolicy.ts` |
| Route/model | ChatGPT plan, `gpt-5.6-sol`, medium reasoning |
| Transport | `postcode/chatgpt-responses@7`, references `postcode/investigator-references@3`, wire `postcode/contribution-dialog-wire@7`; zero transport retries |
| Domain methods | Dialog `postcode/contribution-dialog@9`, Projection `postcode/contribution-projection@6`, diagram renderer `postcode/state-transition-diagram@7` |
| Runtime | Node 22.13.1; fresh TypeScript build passed before execution |
| Production limits | 180,000 ms per dialog, 32 calls, 96 tool requests, 2,000,000 canonical exchange characters; one structural repair available |
| Cap enforcement | New ledger with ceiling 20, exclusive run lease and reservation before dispatch |

No application code, production instructions, repair behavior, harness or fixture changed during execution. The earlier 96-test offline result applies to this implementation; the suite was not repeated merely to run inference.

## Elicitation and application chain

The initial request used the ordinary `state-behavior` Lens on `circuit-breaker-policy`, **without any added elicitation**. This narrow check does not ask for or invoke an option; the earlier option-chain scenario was not rerun.

The next application request was an explicit fresh investigation of that same request in the same Session. Its only added instruction was the unchanged adequacy-review elicitation from the previous report-answer trial:

> Assess whether the earlier answer still adequately answers the original question. If it does, return that existing answer without creating a duplicate; make a new or revised answer only if the evidence warrants it.

This supplies no operation names, protocol fields, submission shapes, reference forms or contract identifiers. It permits a warranted revision and does not prescribe exact architectural wording. The report-only shape comes from production instructions and schema, not trial guidance.

## Observed behavior

- **Initial answer:** four requests, approximately 74,651 ms. The investigator acquired information and submitted a state model, prose and an answer designation. The optional report was absent. The contribution was accepted without repair and fulfilled `postcode/state-diagram-answer@1` in both attempt reporting and answer projection.
- **Fresh review:** two requests, approximately 20,804 ms. The investigator acquired further information and judged the existing account adequate. Its first submission contained an empty `investigrams` array and a producer report with the exact retained owning-investigram handle and `answer` declaration key. The bindings resolve that handle to the initial designation, and the fresh invocation has the same Query result. The contribution was accepted without repair, with no new investigram or designation. Its attempt fulfillment and projected fulfillment were both `fulfilled`, and the projected alternative exactly matched the initial one.

The report says reinspection found the same captured source digest and no evidence warranting revision. That is an observed investigator judgment, not an independent assessment of the account's truth or completeness. This trial did not execute Cockatiel behavior tests or visually review the diagrams.

## Usage

All six requests completed and reported provider usage. Application accounting agrees, with zero missing or anomalous calls. Reported usage is **141,401 input + 3,944 output = 145,345 total tokens**, not confirmed billing. Historical dispatches remain separately preserved: **97 prior + 6 new = 103 cumulative M2 requests**. Earlier missing usage remains unknown.

| New request | Outcome | Input tokens | Output tokens | Total tokens |
| --- | --- | ---: | ---: | ---: |
| 1 | Information acquisition | 5,832 | 77 | 5,909 |
| 2 | Information acquisition | 27,792 | 47 | 27,839 |
| 3 | Information acquisition | 28,023 | 45 | 28,068 |
| 4 | Initial answer accepted | 32,554 | 3,046 | 35,600 |
| 5 | Information acquisition | 9,835 | 155 | 9,990 |
| 6 | Report-only return accepted | 37,365 | 574 | 37,939 |

## Audit, evidence and limitations

The implementing-agent audit checked all completed exchanges against the exact current production instructions, with only the recorded elicitation and normal reference guidance, and against the current namespaced function schema. It checked the new submission guidance's presence, requested model/reasoning, ChatGPT route and wire version, zero transport retries, exact report-reference resolution, original Query-result identity, no fresh-review designations, unchanged projected alternative, contract outcomes and complete request accounting. It handles the initial answer's absent optional report and both supported capture-output forms. These are implementing-agent checks, not independent review.

This single run does not establish that invalid placeholders will never recur or that wording alone caused the observed choice. No nonzero reconsideration cause was deliberately induced; preserving such causes and accepting an optional qualified assessment note remain covered by offline regressions. There was no live repair to exercise here. The earlier failed placeholder submission and its repair remain preserved in the prior record and captures.

Raw sanitized exchanges, application steps, terminal reports, diagrams, usage, exact spec, preflight, final fixture check, budget snapshot, audit script and verification summary remain in ignored `_trials/m2-report-only-verification-1/`. The budget is `_trials/m2-report-only-budget.json`; the runnable audit is `_trials/m2-report-only-audit.mjs`. Captures contain repository source and are not committed. The manifest covers 14 files with sizes and SHA-256 digests; its SHA-256 is `c47c422bd89444cb675b1529f9346d59dc55289fa0510cd8853bc23b9969367a`.

The correction and live evidence are ready for independent review under the existing M2 handoff. Neither this run nor an earlier clean review accepts the M2 checkpoint or authorizes M3.

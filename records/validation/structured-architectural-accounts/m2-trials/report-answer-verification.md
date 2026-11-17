# M2 focused live verification of explicit answer reporting

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review: [Round 8 findings](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-8-claude-findings.md), under the existing [M2 handoff](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-handoff.md)
Prior live evidence: [Revised-selector verification](revised-selector-verification.md)
Harness: [`run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Outcome and stopping decision

**The focused run completed all three steps using 15 of 30 additional requests.** The initial investigation and option invocation each supplied a new answer designation, omitted `report.answer`, and were accepted on their first submissions. A fresh investigation explicitly returned the original answer designation in `report.answer`, without declaring another answer. Its first submission correctly identified the existing designation but included an empty investigram; normal repair added a qualified assessment note and preserved the exact report reference. The accepted fresh attempt fulfilled the original contract, and the projected answer alternative remained unchanged.

The observed invocation-handle mistake did not recur. The objective—live use of automatic own-designation answers and explicit existing-designation returns under the revised production guidance—was met. No further attempt was needed to resolve that uncertainty. **15 requests remain unused. M2 remains unaccepted, and M3 has not begun.** Successful execution does not prove the generated architectural accounts or the investigator's adequacy judgment.

## Authorization, estimate and execution basis

The human authorized correction of R8-F1 and focused live verification, with a sufficiently large finite cap and further attempts only to resolve specific uncertainties. Direction was recorded before implementation in task follow-up `d17f51b4eb8d9282812bdd7158ca2b30378639c0`. The implementing agent chose a new 30-request hard ceiling, separate from earlier budgets. The previous option chain used 13 requests; approximately 3–6 more were estimated for the fresh adequacy review, giving 16–19 planned requests with headroom for ordinary repair or a targeted retry.

During execution the human pointed out the live-trial guidance added to `main` at `c7aa85cd4c181ed93421048f1e30398626be6fd3`. It was read and applied: estimate multi-request interactions and retries, count failed attempts, use the cap as a runaway guard, stop when the objective is met, and assess a reached limit before proposing any extension. The already configured cap and stopping rule matched that guidance.

| Basis | Value |
| --- | --- |
| Implementation and executed checkout | `2b0d0c3787f0a7787caf781faeba772ce2c98042` |
| Fixture | Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`, clean before and after |
| Subject | `circuit-breaker-policy`, module `src/CircuitBreakerPolicy.ts` |
| Route/model | ChatGPT plan, `gpt-5.6-sol`, medium reasoning |
| Transport | `postcode/chatgpt-responses@7`, references `postcode/investigator-references@3`, wire `postcode/contribution-dialog-wire@6`; zero transport retries |
| Domain methods | Dialog `postcode/contribution-dialog@8`, Projection `postcode/contribution-projection@6`, diagram renderer `postcode/state-transition-diagram@7` |
| Runtime/offline preparation | Node 22.13.1; TypeScript build and 166 relevant offline tests passed, with no skips |
| Production limits | 180,000 ms per dialog, 32 calls, 96 tool requests, 2,000,000 canonical exchange characters; one structural repair |
| Cap enforcement | New ledger with ceiling 30, exclusive run lease and reservation before dispatch; no carry-over from older allowances |

No production code, instructions, harness, fixture or repair limits changed during this run. The application used its own credential manager and hosted dialog route. No broader live suite was rerun.

## Elicitation and application requests

The first application request used the ordinary `state-behavior` Lens on `circuit-breaker-policy`. Its added elicitation was unchanged from the earlier focused trials:

> In addition to the requested explanation, include an applicable follow-up option proposing a useful further investigation of a limitation or open question in this account.

The second request invoked the first returned option through the application's follow-up Lens with its exact owner/key and no added elicitation.

The third request was an explicit fresh investigation of the first request, in the same Session, with this focused elicitation:

> Assess whether the earlier answer still adequately answers the original question. If it does, return that existing answer without creating a duplicate; make a new or revised answer only if the evidence warrants it.

Neither elicitation supplies operation names, subject signatures, request shapes, report-field names, reference forms or result-contract identifiers. The third deliberately elicits an adequacy assessment; it does not demand agreement or forbid a warranted revision. Protocol guidance comes from the actual production instructions and schema.

## Observed behavior

1. **New answer, report omission.** Three requests, approximately 88,421 ms. The initial contribution supplied a state model, prose and an answer designation, without `report.answer`. It was accepted without repair and fulfilled `postcode/state-diagram-answer@1` in both attempt reporting and answer projection.
2. **Option invocation, report omission.** Seven requests, approximately 136,975 ms. The generated option `half-open-concurrency` targeted the model's supported `state:half-open` component. Its exact identity, retained meaning, subjects and contract reached the next investigator and resulting question. The subsequent contribution supplied a new designation without `report.answer` and was accepted without repair. The option specified no optional result contract, so follow-up fulfillment was correctly null.
3. **Existing answer returned.** Five requests, approximately 43,207 ms. The fresh investigator acquired further information and judged the original account adequate. Its report named the original investigram handle and `answer` declaration key, which resolve to the initial designation for this same Query result. It declared no new answer. The first submission also contained an empty `review` investigram and was rejected with `An investigram must contribute content, declarations or qualified metadata.` The one normal repair added a qualified prose assessment to that investigram; it kept the report's exact answer reference unchanged and still made no designation. The contribution was accepted and fulfilled the original contract through its explicit returned answer. Its projected answer alternative exactly equals the initial alternative.

The initial and follow-up accounts discuss circuit states and HalfOpen concurrency; the fresh report says reinspection supports the earlier model. Those are generated claims and a generated adequacy judgment, not independent architectural findings. No execution tests of Cockatiel behavior were performed by this verification. The empty-investigram failure is preserved for review; it was not hidden by changing the elicitation or production guidance.

## Request accounting

All 15 reserved requests completed and reported usage; application accounting agrees, with zero missing or anomalous calls. Reported usage is **455,077 input + 11,284 output = 466,361 total tokens**, not confirmed billing. The earlier 82 dispatches remain in their separate ledgers, so the cumulative M2 total is **97 dispatched requests**. Older missing usage is not resolved or assigned zero by this record.

| New request | Outcome | Input tokens | Output tokens | Total tokens |
| --- | --- | ---: | ---: | ---: |
| 1 | Information acquisition | 5,673 | 97 | 5,770 |
| 2 | Information acquisition | 32,559 | 687 | 33,246 |
| 3 | Initial contribution accepted | 34,809 | 3,195 | 38,004 |
| 4 | Information acquisition | 7,294 | 176 | 7,470 |
| 5 | Information acquisition | 15,632 | 118 | 15,750 |
| 6 | Information acquisition | 15,955 | 54 | 16,009 |
| 7 | Information acquisition | 25,227 | 849 | 26,076 |
| 8 | Information acquisition | 44,343 | 142 | 44,485 |
| 9 | Information acquisition | 52,741 | 918 | 53,659 |
| 10 | Follow-up contribution accepted | 56,035 | 3,719 | 59,754 |
| 11 | Information acquisition | 9,847 | 140 | 9,987 |
| 12 | Information acquisition | 37,374 | 360 | 37,734 |
| 13 | Information acquisition | 37,970 | 125 | 38,095 |
| 14 | Existing answer returned; empty investigram rejected | 39,614 | 220 | 39,834 |
| 15 | Normal repair; existing-answer return accepted | 40,004 | 484 | 40,488 |

## Capture audit and limitations

The implementing-agent audit checked every completed exchange against current production instructions plus only the recorded elicitation and normal reference guidance, and against the exact current namespaced function schema. It checked model/reasoning and route, zero transport retries, exact option delivery, report/designation/contract agreement, original Query-result identity for the fresh invocation, correct resolved report references, absence of new fresh-review designations, unchanged returned alternative, and request accounting. Both transport capture forms occurred: complete response output and the adapter's streaming-output fallback; the audit uses the same output selection rule as the adapter.

The run does not establish first-submission reliability or universal avoidance of report mistakes. It exercises omission and retained-reference reporting live; harmless submission-local repetition and rejection/repair of the invocation reference are covered offline. No nonzero reconsideration cause was deliberately induced here. Preservation of exact nonzero causes when returning an existing answer is established by the focused offline regression, not claimed from this live run. The follow-up had no optional contract, and the live repair addressed an empty investigram rather than an invalid report reference.

Raw sanitized exchanges, steps, terminal reports, diagrams, usage, exact spec, preflight, final fixture check, budget snapshot, audit script and verification summary remain in ignored `_trials/m2-report-answer-verification-1/`. The separate ledger is `_trials/m2-report-answer-budget.json`; the runnable audit is `_trials/m2-report-answer-audit.mjs`. Captures contain repository source and are not committed. The manifest covers 16 files with sizes and SHA-256 digests; its SHA-256 is `9e4b396c03b52f2ba9879c80386cc99df1e9109faf93120799b640b681c67697`.

This is implementing-agent verification for independent review under the existing handoff. It neither accepts M2 nor authorizes M3.

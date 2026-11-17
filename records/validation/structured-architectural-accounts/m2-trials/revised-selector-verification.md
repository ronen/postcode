# M2 focused live verification of revised component-selector instructions

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review assignment: [M2 vertical handoff](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-handoff.md)
Correction basis: [Round 6 intent-check observations](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-6-corrections-intent-check-claude.md), [round 7 findings](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-7-claude-findings.md), and [offline correction verification](../m2-checkpoint.md#corrections-to-the-round-6-intent-check-observations--2026-11-17)
Prior live evidence: [Focused option verification](focused-option-verification.md)
Harness: [`run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Outcome and stopping decision

**One live attempt completed the focused chain using 13 of 30 newly authorized requests.** The initial submission used the supported selector `state:half`, naming the retained model's actual `half` state. Its option was accepted after a normal repair of an unrelated report reference. The application invoked the option and delivered its exact owner/key, retained meaning and component selector to the subsequent investigator. That investigator's contribution was accepted on its first submission and designated under the option's question.

This verifies live use of the revised selector guidance in this elicited chain. It does not establish reliable first-submission validity, spontaneous option generation, or architectural correctness of either explanation. No further attempt was made: the focused uncertainty was resolved in this run, and repeating it would add sampling rather than resolve a specific remaining uncertainty. **17 requests remain unused under this authorization. M2 remains unaccepted; M3 has not begun.**

## Authorization and execution basis

The human authorized a hard ceiling of 30 additional requests, with further attempts only to resolve specific uncertainties and evidence preserved for review. Direction was recorded before execution in task follow-up `76e2ea607e28346267db3ccec821b5a802edc1f9`. The initial attempt's question was whether the revised instructions support valid selector authoring and completion of the unchanged option chain through the application.

| Basis | Value |
| --- | --- |
| Application implementation | `2ed7b5f251157e2176879023694b5166892923b2` |
| Executed checkout | `76e2ea607e28346267db3ccec821b5a802edc1f9`; subsequent changes since the implementation were records only |
| Fixture | Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`; clean before and after execution |
| Subject | `circuit-breaker-policy`, module `src/CircuitBreakerPolicy.ts` |
| Route/model | ChatGPT plan, `gpt-5.6-sol`, medium reasoning |
| Transport | `postcode/chatgpt-responses@7`, references `postcode/investigator-references@3`, wire `postcode/contribution-dialog-wire@5`; zero transport retries |
| Domain methods | Dialog `postcode/contribution-dialog@7`, Projection `postcode/contribution-projection@6`, diagram renderer `postcode/state-transition-diagram@7` |
| Runtime | Node 22.13.1; fresh TypeScript build passed before execution |
| Production limits | 180,000 ms per dialog, 32 calls, 96 tool requests, 2,000,000 canonical exchange characters; one structural repair |
| Request cap | Separate ledger with ceiling 30, exclusive run lease and reservation before dispatch; the earlier unused request was not added |

The production implementation, harness, fixture, limits and repair behavior were unchanged during verification. The initial sandbox launch could not open PostCode's credential lock and stopped before any request reservation. Its output and log were retained separately. Execution outside that sandbox then used the application's existing credential manager normally. This startup failure consumed zero inference requests and is not an agent failure or a second live attempt.

## Unchanged elicitation and application chain

The initial application request used the `state-behavior` Lens on `circuit-breaker-policy`. The exact added elicitation, unchanged from the previous focused runs, was:

> In addition to the requested explanation, include an applicable follow-up option proposing a useful further investigation of a limitation or open question in this account.

It supplies no operation names, subject signatures, request shapes or result-contract identifiers. The subsequent request invoked the first returned option through the application's follow-up Lens, with no added elicitation or manual option construction. This is deliberate option elicitation, not a test of spontaneous generation or exact architectural wording.

## Observed behavior

The initial investigation used five requests and took approximately 139,820 ms. After three information-acquisition exchanges, its first submission included the option `half_open_concurrency`, targeting the submitted model's `state:half` component. That selector matches the documented `state:<key>` form and an actual state key. Neither observed invalid selector from the earlier trials was repeated.

The submission was rejected with `Unknown investigram reference.` Its optional `report.answer` used a supplied invocation handle where an investigram reference was required. The normal single repair removed that optional report answer; it retained the same option, subjects, component selector and meaning. The corrected contribution was accepted, designated one alternative through its organizing declaration, and fulfilled `postcode/state-diagram-answer@1` in both attempt reporting and answer projection. The empty optional report answer is not an absent designation.

The retained option's meaning was:

> Investigate the HalfOpen part of this model more deeply to characterize concurrent sample completion, waiting-call release, cancellation, and reentrant event-listener ordering that the flat state diagram does not represent.

The application invoked this exact option's owner/key. Capture assertions matched that identity in the question, resolved wire handles and terminal attempt report; matched the meaning byte-for-byte in delivered option metadata and the report; and matched `state:half` and its exact source item in the subsequent wire request and question. The source owner and qualification remained in fixed support.

The follow-up used eight requests, seven for information acquisition and one for submission, taking approximately 135,866 ms. It acquired retained content and source evidence, then submitted a state model and prose. The contribution was accepted without structural repair, and its reported answer matched its projected designation. The option specified no optional result contract, so both follow-up reporting and projection correctly recorded null fulfillment. A non-null follow-up contract was not exercised.

The generated explanation describes aggregate HalfOpen coordination phases, early decisions with calls still in flight, shared waiting, stale completions and event-listener reentrancy. Its qualification limits the designation to the component-level follow-up, and its report says the broader model is left standing. These are observed generated claims, not conclusions independently proved by this trial. The initial account also explicitly qualifies itself as source-based rather than execution-tested.

## Request accounting

The separate ledger numbers this run's requests 1–13. All 13 completed and reported provider usage; application usage agrees, with zero missing or anomalous calls. The run reported **528,715 input + 12,399 output = 541,114 total tokens**. These are reported usage, not confirmed billing. The 69 historical requests remain separately preserved, making **82 dispatched requests across all M2 trials**; historical missing usage is not resolved by this run.

| New request | Outcome | Input tokens | Output tokens | Total tokens |
| --- | --- | ---: | ---: | ---: |
| 1 | Information acquisition | 5,230 | 81 | 5,311 |
| 2 | Information acquisition | 27,194 | 92 | 27,286 |
| 3 | Information acquisition | 35,791 | 47 | 35,838 |
| 4 | Initial submission; invalid report reference | 40,149 | 3,591 | 43,740 |
| 5 | Normal repair; initial contribution accepted | 43,897 | 2,688 | 46,585 |
| 6 | Information acquisition | 6,883 | 146 | 7,029 |
| 7 | Information acquisition | 8,673 | 123 | 8,796 |
| 8 | Information acquisition | 33,100 | 120 | 33,220 |
| 9 | Information acquisition | 34,496 | 125 | 34,621 |
| 10 | Information acquisition | 45,710 | 102 | 45,812 |
| 11 | Information acquisition | 71,695 | 151 | 71,846 |
| 12 | Information acquisition | 85,232 | 47 | 85,279 |
| 13 | Follow-up contribution accepted | 90,665 | 5,086 | 95,751 |

## Evidence and verification limits

An offline audit of every completed exchange checked exact equality with current production instructions plus only the recorded elicitation and normal reference guidance, and exact equality of the namespaced function schema with the current production schema. It also checked the revised selector guidance's presence, requested model/reasoning, ChatGPT billing route, zero transport retries, option identity/meaning/subject delivery, actual state-selector validity, acceptance/designation, contract outcomes and usage reconciliation. These are implementing-agent checks, not independent review.

Raw sanitized exchanges, application answers, terminal attempts, usage, exact spec, preflight, final fixture check, budget snapshot, audit script and verification summary remain in ignored `_trials/m2-selector-verification-1/`. The budget is `_trials/m2-selector-verification-budget.json`; the preserved zero-request startup failure is `_trials/m2-selector-verification-sandbox-startup/` and its adjacent `.log`. Captures contain repository source and are not committed. The run's manifest records sizes and SHA-256 digests for 14 files; its own SHA-256 is `379fafb557b4d66868ef13bfa4a4a4a6daa551a7dc7d48f7e7cfedce50715843`. The audit script's runnable original is `_trials/m2-selector-verification-audit.mjs`.

This narrow run does not rerun the full live suite or the exports-presentation checks. It does not establish that arbitrary unsupported selectors will never recur, that normal repair is generally sufficient, or that the revised wording caused the valid choice rather than merely accompanying it. It exercises a valid state selector; whole-item fallback, transition selectors and rejection of both earlier invalid values remain covered by the offline regressions. No additional live attempts or product fixes were made. The evidence is ready for independent review under the existing handoff, with M2 still awaiting the human's checkpoint decision.

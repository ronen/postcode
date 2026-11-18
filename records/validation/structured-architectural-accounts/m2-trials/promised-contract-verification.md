# M2 focused live verification of a promised follow-up contract

Date: 2026-11-18
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review assignment: [M2 vertical handoff](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-handoff.md)
Prior clarification: [Follow-up contract evidence reconciliation](follow-up-contract-evidence.md)
Harness: [`run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Outcome and stopping decision

**The two-step chain succeeded using 7 of 20 authorized requests, with no repair.** The investigator authored an applicable `examine-content` option explicitly promising `postcode/state-diagram-answer@1`. The application invoked the retained option; its exact owner/key, meaning and promised contract reached the subsequent investigator. The resulting contribution was accepted, and both attempt assessment and answer projection recorded the contract as fulfilled with no unmet requirements.

This supplies the previously missing current-revision live sample combining a non-null option contract, exact-option question identity and current production guidance. The objective was met, so no further attempt was made; **13 requests remain unused**. This is successful execution of one elicited scenario. The generated account’s accuracy was not independently verified. **M2 remains unaccepted; M3 has not begun.**

## Authorization and execution basis

The human authorized the proposed focused chain and 20-request cap in task follow-up `bd8fc70211279f93cec9d6d769ab41e90e6dce17`, committed before preparation. The estimate was 7–13 requests based on prior option chains, with headroom for normal repair or a retry resolving a specific uncertainty. A new ledger reserves each dispatch before inference under an exclusive run lease. Failed requests would count; earlier unused allowances were not carried forward. This follows the live-trial guidance previously read on `main` at `c7aa85c`.

| Basis | Value |
| --- | --- |
| Production implementation | `4267a051754f62f1c728295cfe94c09b4b9354af` |
| Executed checkout | `bd8fc70211279f93cec9d6d769ab41e90e6dce17` |
| Additional offline coverage | `956032c6c7c52eb2c574b270d489069c22331241`; no production changes |
| Fixture | Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`, clean before and after |
| Initial subject | `circuit-breaker-policy`, module `src/CircuitBreakerPolicy.ts` |
| Route/model | ChatGPT plan, `gpt-5.6-sol`, medium reasoning |
| Transport | `postcode/chatgpt-responses@7`, references `postcode/investigator-references@3`, wire `postcode/contribution-dialog-wire@7`; zero transport retries |
| Domain methods | Dialog `postcode/contribution-dialog@9`, Projection `postcode/contribution-projection@6`, diagram renderer `postcode/state-transition-diagram@7` |
| Runtime | Node 22.13.1; fresh TypeScript build passed |
| Production limits | 180,000 ms per dialog, 32 calls, 96 tool requests, 2,000,000 canonical exchange characters; one structural repair available |

Production source and harness match `4267a05`. No application code, instructions, schema, repair behavior, harness or fixture changed during the trial. The preceding 47-test offline verification of contract forwarding/enforcement remains applicable; tests were not repeated solely to run inference.

## Elicitation and application chain

The initial request used the ordinary `state-behavior` Lens on `circuit-breaker-policy`. Its only added elicitation was:

> In addition to the requested explanation, include an applicable follow-up option proposing a useful further investigation whose answer must include a state diagram alongside its explanation.

This asks for an option and its expected answer form without supplying operation names, subject signatures, protocol fields, request shapes, reference forms or contract identifiers. The initial Lens’s own contract remains part of ordinary production context. The supported operations and contract identifier are available through production guidance; this does not test spontaneous option generation or discovery without that context.

The second step invoked the first returned option through the application’s follow-up Lens, with no added elicitation. The prompt and normal repair behavior were unchanged throughout.

## Observed behavior

1. **Authoring:** two requests, approximately 83,724 ms. The first submission contained a state model, explanatory prose and its own answer designation, with no producer report. It also authored `deeper_diagram`, targeting the whole retained `model` item through `examine-content` and explicitly requesting `postcode/state-diagram-answer@1`. The option’s meaning proposed deeper investigation of hydration and concurrent HalfOpen sampling, with a sharpened explanation and state-transition diagram. The contribution was accepted and its initial contract fulfilled.
2. **Invocation:** five requests, approximately 88,489 ms. Every investigator wire request carried the exact retained option owner/key and promised contract; delivered metadata preserved its meaning. The retained question and terminal follow-up identity agreed. The investigator acquired further information and submitted a new state model, prose and answer designation. Its optional report supplied a statement but no repeated answer designation. The first submission was accepted; attempt fulfillment and projected fulfillment were both `fulfilled`, with one alternative and no unmet requirements.

The contract is explicit in the authored option, not inferred from a rendered diagram. Because the option uses `examine-content`, which has no default result contract, this also distinguishes forwarding the option’s promise from inheriting the initial Lens’s default. Both steps produced diagram artifacts. The trial did not independently validate the architectural explanation, execute Cockatiel behavior tests or visually review those diagrams.

## Usage

All seven requests completed with provider usage. Capture count and application accounting agree, with zero missing, anomalous or nonfinite reports. Reported usage is **113,781 input + 7,799 output = 121,580 total tokens**, not confirmed billing. Historical dispatches remain separately preserved: **103 prior + 7 new = 110 cumulative M2 requests**. Earlier missing usage remains unknown.

| New request | Outcome | Input tokens | Output tokens | Total tokens |
| --- | --- | ---: | ---: | ---: |
| 1 | Information acquisition | 5,838 | 89 | 5,927 |
| 2 | Initial answer and option accepted | 31,599 | 3,844 | 35,443 |
| 3 | Information acquisition | 7,408 | 120 | 7,528 |
| 4 | Information acquisition | 9,960 | 99 | 10,059 |
| 5 | Information acquisition | 10,343 | 101 | 10,444 |
| 6 | Information acquisition | 13,476 | 78 | 13,554 |
| 7 | Follow-up answer accepted; contract fulfilled | 35,157 | 3,468 | 38,625 |

## Audit, evidence and limits

The implementing-agent audit compared every completed exchange with exact current production instructions and function schema, allowing only the recorded elicitation and normal reference guidance. It checked model/reasoning, route, protocol and zero transport retries; explicit authored contract; exact option identity, meaning and contract through invocation; accepted contribution/answer fulfillment agreement; and complete request/token accounting. These checks are not independent review.

Unlike original run 6, this elicitation supplies no operation names or subject signatures, and the runtime includes current exact-option question identity. The older run retains its separate revision and elicitation boundaries in the reconciliation. This new sample does not establish first-submission reliability, generated-account accuracy or behavior across models/repositories. A nonconforming follow-up reported as accepted but unfulfilled remains covered offline, not demonstrated live. Lifecycle cases with nonzero reconsideration causes, the single repair attempt and the missing application/CLI configuration path for selecting the hosted contribution agent remain explicit limitations or later-milestone obligations. No repair was needed in this run.

Raw sanitized exchanges, application steps, terminal reports, diagrams, usage, exact spec, preflight, final fixture check, budget snapshot, audit script and verification summary are preserved in ignored `_trials/m2-promised-contract-verification-1/`. The ledger is `_trials/m2-promised-contract-budget.json`; the runnable audit is `_trials/m2-promised-contract-audit.mjs`. Captures contain repository source and are not committed. The manifest covers 14 files with sizes and SHA-256 digests; its SHA-256 is `02f261e9e7297b5c6cf0d2874b9cabfc355ee5ed8675fc08f0fd820a8763747d`.

This evidence is ready for independent review under the existing handoff. Historical reviews remain unchanged; neither successful execution nor a clean review accepts M2 or authorizes M3.

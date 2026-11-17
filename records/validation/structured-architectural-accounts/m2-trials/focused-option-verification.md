# M2 focused live verification: option authoring and invocation

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review context: [Clean round 5 re-review](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-5-claude-findings.md)
Prior evidence: [M2 trials](README.md), [review elicitation](review-elicitation.md)
Harness: [`run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Outcome

**The focused chain is incomplete.** The initial investigation reached the normal 180-second elapsed-dialog guard during its fourth provider request. No contribution or follow-up option was accepted. The application returned a failed answer delivery with `limit-stop`, reason `Elapsed dialog guard reached.`, no standing alternatives and result fulfillment `no-designated-answer`. The harness then recorded the invocation step as skipped because the earlier answer offered no option.

This used **4 of the 11 additionally authorized requests**. Seven remain unused; the cumulative trial count is **53 of the original 60-request ceiling**. The run was not retried, its prompt was not supplemented, and production limits and repair behavior were not changed.

## Authority and execution basis

The human authorized this focused chain after the clean re-review, accepted that exact option identity separates follow-up-option questions from ordinary questions without preventing retained-content reuse, and explicitly kept the M2 gate open. The complete direction was recorded before execution in task follow-up commit `108e9b7633c77a5c810677f50a765b6df5564d38`.

| Basis | Value |
| --- | --- |
| Application implementation | `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b` |
| Executed checkout | `108e9b7633c77a5c810677f50a765b6df5564d38`; changes after the implementation target were review and task records only |
| Fixture | Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`, clean working tree verified before execution |
| Subject | `circuit-breaker-policy`, the module at `src/CircuitBreakerPolicy.ts` |
| Route and model | ChatGPT plan, `gpt-5.6-sol`, medium reasoning |
| Transport | `postcode/chatgpt-responses@7`, reference transport `postcode/investigator-references@3`, wire `postcode/contribution-dialog-wire@4`, no transport retries |
| Domain methods | Dialog `postcode/contribution-dialog@6`, Projection `postcode/contribution-projection@6`, renderer `postcode/state-transition-diagram@7` |
| Runtime | Node 22.13.1; TypeScript build passed before execution |
| Production limits | 180,000 ms per dialog, 32 calls, 96 tool requests, 2,000,000 canonical exchange characters; one structural repair permitted |
| Trial ceiling | Existing request ledger at 49/60 before starting; reservation before dispatch prevents more than 11 additional requests |

No application code, production instructions, repair policy or harness was modified for this run. The harness used the real application interface, credential manager and hosted agent. Raw sanitized exchanges, application results, terminal attempt reporting, usage, the exact spec and verification summary remain in the worktree’s ignored `_trials/` working material. The captures contain repository source and are not committed. An ignored manifest records their sizes and SHA-256 digests.

## Elicitation and planned chain

The first application request was the ordinary `state-behavior` Lens on the module name `circuit-breaker-policy`. The only added trial instruction was:

> In addition to the requested explanation, include an applicable follow-up option proposing a useful further investigation of a limitation or open question in this account.

This asks for an option deliberately; it is not a test of spontaneous option generation or exact architectural wording. The added instruction contains no operation names, subject signatures, request shapes or result-contract identifiers. Those are supplied only through the normal production instructions and application request context.

The next planned application request was to invoke the first option offered by the selected answer, using its exact retained owner and key. No elicitation was planned for that invocation. There was no fallback to a different prompt or manually supplied option when the initial attempt failed.

## Observed execution and accounting

The run reserved request ordinals 50–53 in the existing ledger. Three exchanges completed:

1. The agent requested inspection, exports and dependencies of the subject.
2. It requested source evidence.
3. It requested another source-evidence acquisition.

The fourth request received HTTP 200 headers, but no completed exchange or provider usage report was captured before the elapsed-dialog guard ended the attempt. Terminal reporting records `limit-stop` after approximately 180,002 ms. All four calls remain in usage accounting, with the fourth explicitly missing a provider usage report. No complete `submit_contribution` call was captured, no structural repair occurred, and no contribution reached acceptance.

| Request ordinal | Outcome | Reported input tokens | Reported output tokens | Reported total tokens |
| --- | --- | ---: | ---: | ---: |
| 50 | Completed information request | 5,066 | 87 | 5,153 |
| 51 | Completed information request | 28,130 | 49 | 28,179 |
| 52 | Completed information request | 28,371 | 46 | 28,417 |
| 53 | HTTP headers received; dialog stopped before a completed exchange | Unknown | Unknown | Unknown |

Reported totals for the three completed calls are 61,567 input and 182 output tokens, or 61,749 total tokens. These are **partial totals**, not the complete consumption or billing of the four-request run. Missing usage for request 53 is not treated as zero.

The application retained the distinction between an attempt failure and answer content: the failure appeared in delivery reporting; the exact empty answer carried no designated alternative and did not turn the timeout into an architectural conclusion. The harness completed and recorded `The earlier answer offers no such follow-up option.` for the invocation step. Process completion is not success of the requested verification chain.

## Verification and limitations

An offline capture audit confirmed that every completed exchange used the exact current production instructions, plus only the elicitation above for the initial step and the normal reference-transport guidance. It also confirmed the requested route/model configuration, medium reasoning, four reserved requests and the unchanged ceiling. The terminal attempt report preserves the same hosted-agent configuration and normal limit-stop outcome.

The following live checks remain **unverified in this run**:

- acceptance of an authored, applicable follow-up option using the corrected production instructions without an operation list in the elicitation;
- invocation of that option through the application;
- delivery of its exact owner/key and retained meaning to a subsequent investigator;
- acceptance and result-contract fulfillment of the subsequent contribution.

The earlier offline regressions and independent re-review remain evidence for their stated scopes; this trial does not replace them or establish those behaviors live. A timeout before acceptance does not isolate a defect in option instructions, and successful information acquisition does not establish the architectural correctness of an explanation. No explanation was accepted here for architectural assessment. No general reliability rate, broader live-suite result or M2 checkpoint acceptance is claimed.

Milestone 2 remains open for the human’s decision and independent review of this outcome. Milestone 3 has not begun.

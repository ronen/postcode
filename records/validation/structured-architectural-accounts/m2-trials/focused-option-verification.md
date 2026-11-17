# M2 focused live verification: option authoring and invocation

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review context: [Clean round 5 re-review](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-5-claude-findings.md)
Prior evidence: [M2 trials](README.md), [review elicitation](review-elicitation.md)
Harness: [`run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Current outcome

**The unchanged focused chain completed successfully on the third run**, after the initial timeout and a capped retry preserved below. The application accepted an elicited option, invoked it, delivered its exact retained identity and meaning to the subsequent investigator, and accepted the subsequent contribution. The initial state-diagram answer fulfilled its contract. The generated option did not specify an optional result contract, so the follow-up correctly recorded null fulfillment rather than claiming to fulfill a contract it did not have. A non-null follow-up contract was not exercised in these new runs.

The focused work used **20 of 21 authorized additional inference requests**, bringing all M2 trials to **69 of the increased 70-request ceiling**. One request remains unused. No application code, production instructions, repair behavior or elicitation changed between runs. Successful execution does not establish the architectural correctness of either generated account. M2 remains open for independent review and the human's checkpoint decision; M3 has not begun.

## First attempt outcome

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

## Authorized retry within the original ceiling

After seeing the first timeout, the human asked, “Possibly it's worth trying the trial again?” This direction was recorded before retrying in task follow-up `ff4a3a0f9e1e0234530de4745c6f17041e942dfc`. The retry used that checkout, the same implementation `6f72f86`, unchanged elicitation, harness, route/model, pinned clean fixture and production limits. It began in a fresh Session with seven requests remaining under the original ceiling.

The initial investigation succeeded after five requests (ordinals 54–58), taking approximately 112,627 ms of dialog time. Its first submission was rejected with `Unknown content component reference.`: the proposed option referred to `unsupported` as though it were a declared component of the state-model item. The one normal structural repair removed that component selector and referred to the whole retained model. No trial guidance was added. The repaired contribution was accepted, designated one alternative, and fulfilled `postcode/state-diagram-answer@1` in both attempt reporting and answer projection.

The accepted option key was `concurrency-followup`. Its exact meaning was:

> Examine the state model more deeply to determine how concurrent HalfOpen executions, queued callers, cancellation, and isolation interleave, and identify any race-sensitive behaviors not expressible in the flat diagram.

It requested `examine-content` on the retained state-model item, with no optional result contract. The harness invoked that returned option through the application's follow-up Lens. A capture audit verified the identical retained owner/key in the subsequent question and wire request, the identical meaning in delivered option metadata, and the identical owner/key/meaning in terminal attempt reporting. The subsequent investigator acquired information in requests 59–60. Its next dispatch was refused by the harness budget before a provider request was made. Consequently, no subsequent contribution was accepted; its empty answer had zero alternatives and null contract fulfillment, consistent with the option's absent contract.

The budget refusal surfaced through the adapter as `communication-failure` / `transport_error`. This is a harness-enforced allowance stop, not evidence of provider unavailability or option rejection. Application usage records eight call attempts, including the refused dispatch with no provider usage; the request ledger records exactly seven dispatched requests. All seven have provider usage: 143,943 input plus 5,372 output tokens, totaling 149,315. The cumulative dispatch count reached 60. This retry verifies option acceptance, invocation and identity/meaning delivery, but not completion of the subsequent investigation.

During this retry, the human authorized ten additional requests, recorded in task follow-up `c1c0cef9192a35e717cfcb931545a0cda549dd62`. The running harness held an exclusive budget lease and a fixed in-memory ceiling; it was allowed to finish under its original cap. After it closed the Session and released the lease, the ledger ceiling was raised from 60 to 70. Continuing the chain therefore required a fresh Session and another unchanged initial investigation, rather than resuming the closed Session or fabricating a retained option.

## Completed run under the increased ceiling

This run executed checkout `c1c0cef9192a35e717cfcb931545a0cda549dd62`, still using application implementation `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b`. The same Cockatiel commit was verified clean before and after execution. The exact elicitation above, production instructions, route/model, runtime and 180-second per-dialog limit were unchanged. The harness made nine requests, ordinals 61–69, under the newly authorized ceiling of 70.

The initial investigation completed in approximately 126,536 ms using three requests. Its first submission again received `Unknown content component reference.`; the ordinary single repair succeeded. The accepted answer contained a state model and prose, one designated alternative and an applicable option. Both attempt and answer projection recorded `fulfilled` for `postcode/state-diagram-answer@1`.

The returned option key was `half_open_concurrency`, owned by the accepted initial investigram. Its meaning was:

> Investigate the retained state model more deeply to characterize concurrent HalfOpen call interleavings, waiting-call wakeups, cancellation behavior, and stale-result handling without flattening them into misleading extra states.

Its request was `examine-content` on the retained model, with references to both that model and its explanation and no optional result contract. The application invoked the exact returned owner/key. The audit matched that identity in the subsequent question, the wire request's resolved handles and terminal reporting. It also matched the retained meaning byte-for-byte in the option metadata delivered to the next investigator and the terminal follow-up report. The follow-up's fixed support retained the source owner and its qualification.

The subsequent investigator used six requests, acquiring retained content and further source evidence before submitting. Its contribution was accepted without structural repair after approximately 112,590 ms. It designated a new alternative containing a refined state model and prose under the follow-up question's result. The attempt report's answer addresses matched the projected designation. Its additive declaration targeted the new examination result and explicitly disclaimed supersession of the original whole-policy answer. The explanation addresses admission, waiting callers, wakeups, cancellation and stale results, with captured-source/test-file limitations and an explicit statement that no tests were executed.

The contribution report and answer projection both recorded null fulfillment, matching the option's null result contract. This distinguishes acceptance and designation from satisfaction of a required result shape. The initial state-diagram contract was exercised; live fulfillment of a non-null contract on the follow-up remains outside this run's evidence.

| Request ordinal | Step and outcome | Input tokens | Output tokens | Total tokens |
| --- | --- | ---: | ---: | ---: |
| 61 | Initial information acquisition | 5,020 | 99 | 5,119 |
| 62 | Initial submission; rejected component reference | 31,349 | 3,691 | 35,040 |
| 63 | Normal repair; initial contribution accepted | 35,195 | 2,482 | 37,677 |
| 64 | Follow-up information acquisition | 6,634 | 137 | 6,771 |
| 65 | Follow-up information acquisition | 12,698 | 131 | 12,829 |
| 66 | Follow-up information acquisition | 35,883 | 151 | 36,034 |
| 67 | Follow-up information acquisition | 43,456 | 115 | 43,571 |
| 68 | Follow-up information acquisition | 52,980 | 52 | 53,032 |
| 69 | Follow-up contribution accepted | 58,461 | 3,943 | 62,404 |

All nine dispatched requests reported usage: 281,676 input plus 10,801 output tokens, totaling 292,477. Together the three focused runs dispatched 4 + 7 + 9 = 20 requests. Their known token reports total 503,541 tokens, but that is still partial because request 53 from the first run never reported usage. The refused dispatch in the capped retry is not counted as a provider request or silently assigned provider consumption.

## Combined interpretation for independent review

The completed run demonstrates this elicited option-authoring and invocation path using only actual production guidance and normal repair. The exact option's identity and retained meaning reached the subsequent investigator, whose accepted result was designated under the corresponding question. Offline assertions against the captures checked production-instruction equality, requested model/reasoning, exact identity/meaning delivery, acceptance, designation/report correspondence and the fulfilled-versus-null contract outcomes. Raw captures from all three runs remain separate in ignored working material, with manifests for the retries; the first timeout and allowance stop are not discarded.

This evidence does not establish spontaneous option generation, first-submission validity, repeatable reliability, a non-null follow-up contract, or architectural correctness of the generated accounts. Both successful initial submissions needed the one normal repair for an unknown component reference. The generated concurrency claims were observed and retained, not independently proved by execution or a complete source audit. The live chain's success is an integration observation, not endorsement of the explanations' completeness or truth. No further inference was attempted after completion, and the broader live suite was not rerun.


## Subsequent offline corrections — 2026-11-17

The [round 7 review](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-7-claude-findings.md) independently examined these earlier captures, not the subsequent instruction corrections. Its audit distinguishes the invalid selectors: the capped retry submitted `unsupported`; the completed run submitted `HalfOpen concurrency and deferred-decision semantics`. Both were rejected as unknown components and repaired through the normal path. Both are now offline regression cases in implementation `2ed7b5f251157e2176879023694b5166892923b2`, which clarifies selector meaning, supported sources and the whole-item fallback without broadening validation. See the [checkpoint correction and verification record](../m2-checkpoint.md#corrections-to-the-round-6-intent-check-observations--2026-11-17).

No additional inference was run. The revised production instructions have **not yet been verified live**; the successful chain above continues to describe implementation `6f72f86`, not the revised instructions. This correction record does not accept M2 or authorize M3.

# M4 follow-up-option context authoring verification

Date: 2026-11-19
Task: [Structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Implementation: `801e2dd19603455947f32b9936d8f033b1feb5fc`
Direction: task follow-up `d5c33d2`, after [integrated round 4](../../reviews/structured-architectural-accounts/2026-11-19-m4-integrated-round-4-claude-findings.md)
Review assignment: [Final integrated review](../../reviews/structured-architectural-accounts/2026-11-19-m4-integrated-handoff.md)
Harness: [`run-trial.mjs`](../../../scripts/structured-accounts/run-trial.mjs)

## Result and implementation

The hosted submission schema now accepts optional `options[].request.context`. Authoring instructions explain that these are additional selected inputs, distinct from investigation subjects, and may be omitted. Entries are direct references, without the subjects array's `{ subject }` wrapper. Existing Entity, content/component, designation, whole-contribution and scope forms are supported; scope-only selection still yields an unavailable initial-content response. Existing handles and submission-local references retain their existing interpretation.

Acceptance, request identity, acquisition, response/dialog bounds and actual-dispatch exposure semantics are unchanged. No automatic input selection, new reference kind or new caller route is introduced. The dialog method advances from `postcode/contribution-dialog@12` to `@13`; the hosted wire protocol advances from `postcode/contribution-dialog-wire@8` to `@9`. This distinguishes the new authoring instructions/schema in method-qualified provenance and reuse. Exact historical answers are not reinterpreted under the new methods.

**Live authoring and invocation succeeded in the targeted retry, both without repair.** The initial run also authored context successfully and delivered it correctly, but its broader diagram follow-up hit the existing elapsed-time guard during repair of a malformed state-model submission. Both runs are preserved. The verification objective was met with **14 of 30 requests**, including the interrupted request; the remaining 16 were not used.

## Offline verification

- `npm run check` and `npm run build` passed.
- **92/92 tests passed**, zero failures, cancellations or skips, on macOS Node 22.13.1 using `node --test --test-concurrency=2` in 38.36 seconds. Compiled test files under `_build/test/`: `contribution-hosted`, `contribution-dialog`, `contribution-application`, `contributions`, `contribution-exposure`, `investigation-answer-outcomes`, and `method-provenance`.
- New checks cover optional schema shape, all supported reference forms, omission and empty context, existing-handle decoding, local-reference preservation, invalid-handle rejection and malformed wrapped entries without acceptance mutation. The hosted application test authors local context, resolves it at acceptance, invokes it with its exact body and qualification, reuses the result without another hosted call, and preserves the earlier answer after close. Existing tests cover acquisition kinds, response bounds, the pre-dispatch guard, and exposure accounting.
- Initial focused execution passed 90/92: two new assertions incorrectly expected a lower-case validation diagnostic and an immediate codec exception. The existing codec deliberately preserves an invalid handle for subsequent domain rejection. The tests were corrected to verify that contract; no production behavior was weakened. The corrected build was fixed throughout the successful run.
- Compiled-source SHA-256: `a16e5600b93e0101bbb4bbfa1995b260b103e58087f52c8a989251d11c22efb6`, reproduced with `buildIdentity("_build")` in `scripts/comparison-fixtures.mjs`, unchanged after both live runs. Diff-whitespace and changed Markdown link checks passed.

The full suite was not repeated for this schema/guidance extension. The independent round 4 result remains **725/725** at its own earlier target `d724192`; it is not attributed to this revision. Representative memory was not repeated: ownership, retention representation and temporary allocation implementation are unchanged.

## Live execution basis and elicitation

The human explicitly authorized focused live verification. The task follow-up recorded an estimate of 8–16 requests and a new hard cap of 30, including failures, normal repair and targeted retries. The existing request ledger reserved each request before dispatch and retained one shared ceiling across both runs. No production source, harness, instructions, fixture or execution limits changed during the trials.

| Basis | Value |
| --- | --- |
| Executed revision | `801e2dd19603455947f32b9936d8f033b1feb5fc`, clean checkout |
| Fixture | Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`, clean before and after |
| Initial request | `state-behavior` on `circuit-breaker-policy` |
| Route/model | App-managed ChatGPT sign-in, ChatGPT plan, `gpt-5.6-sol`, medium reasoning |
| Transport | `postcode/chatgpt-responses@7`, references `postcode/investigator-references@3`, wire `postcode/contribution-dialog-wire@9`, zero transport retries |
| Runtime | Node 22.13.1 |
| Limits | 180,000 ms/dialog, 32 calls, 96 tool requests, 2,000,000 canonical exchange characters, one structural repair |

Both runs invoke the first retained option through the application follow-up Lens using its exact owner/key, without editing its request or adding invocation elicitation. The first authoring elicitation was:

> In addition to the requested explanation, include a useful follow-up option for investigating a limitation or open question. Select additional supporting content from this account that the later investigator should receive alongside the investigation subject, distinct from that subject, and explain why it is useful for the follow-up.

After the first invocation timed out, the retry appended:

> Keep the follow-up focused on one small prose clarification of the selected account; do not request a new diagram.

These elicit an optional action and select its scope. They provide no operation identifier, field name, request shape, reference syntax or result-contract identifier; those come from production instructions/schema. The behavior is deliberately elicited, not spontaneous.

## Observations and request accounting

| Run/step | Requests | Result | Elapsed |
| --- | ---: | --- | ---: |
| 1 authoring | 1–3 | Accepted first submission; diagram contract fulfilled | 73.31 s |
| 1 invocation | 4–8 | Elapsed guard during normal repair; no designated answer | 181.00 s |
| 2 authoring | 9–11 | Accepted first submission; diagram contract fulfilled | 85.35 s |
| 2 invocation | 12–14 | Accepted first submission; no optional contract | 42.86 s |

Run 1 authored `examine_half_open_concurrency`, selecting `model` component `state:half_open` as subject and the distinct `explanation` item as context, using submission-local references. The qualification explicitly explained why that context helped without changing the subject. The option additionally promised a diagram. Its invocation received both exact selections, the complete explanation and its item/owner qualification, plus the retained option metadata. The terminal attempt records one complete delivery of that context item.

The invocation's first submission attempted a larger state model. An offline check of its captured body under the unchanged state-model contract rejects it with `Unexpected state bearer field: kind.` Its coverage fields also contain explanatory text instead of allowed enum values. Request 8 received response headers but was interrupted by the dialog deadline; it has no completed exchange capture or usage. The capture therefore does not establish the exact dispatched repair text or a repaired submission. This attempt is a real limit-stop, not a successful answer or a zero-cost request.

Run 2 authored `clarify_stale_samples`, selecting `model` component `transition:half_isolated` as subject and `explanation` as additional context. It promised no diagram. Acceptance resolved the local references; invocation preserved the exact option, subject, context and null result contract. Its first dispatched message supplied the same retained prose body and item/owner qualification, separately from the subject. The terminal attempt records one complete context delivery. The follow-up supplied a designated prose answer and was accepted without repair.

The capture audit checked every completed exchange against the exact production instructions plus its recorded elicitation/reference guidance, current namespaced schema, model/reasoning and route. It checked local-reference resolution, retained request and resulting question agreement, initial wire selections and content, qualification, option metadata and actual recorded exposure. Both complete-response and streaming-output captures are read using the adapter's output-selection rule.

All 14 reserved requests agree with application call counts. Thirteen reported usage: **340,737 input + 15,463 output = 356,200 known tokens**. Request 8's usage remains unknown, so this is not a complete token total or confirmed billing. Run 1 reports eight calls and one missing usage report; run 2 reports six calls and none missing. Neither reports anomalous calls. Earlier live budgets remain separate.

## Evidence and limits

These are implementing-agent checks for independent review. The focused success establishes live usability of this context-authoring path and its subsequent invocation, not universal first-submission reliability or the truth of the generated architectural accounts. Scope-only context, other reference kinds, invalid input, bounded omission, no exposure before dispatch, repeated invocation and post-close history are verified offline, not claimed from these two live runs. The first run's malformed diagram submission and timeout remain limitations; this change does not redesign state-model authoring or raise execution limits.

Sanitized exchanges, answers, attempt reports, diagrams, usage, specs, audit summaries and the failed submission diagnostic remain in ignored `_trials/m4-option-context-authoring-1/` and `-2/`. The runnable audit is `_trials/m4-option-context-audit.mjs`, with the run directory argument; both capture directories preserve a copy. Preflight/final checks and the shared budget are `_trials/m4-option-context-authoring-preflight.json`, `_trials/m4-option-context-final-check.json` and `_trials/m4-option-context-budget.json`. Raw captures can contain repository source and are not committed. The 27-file manifest is `_trials/m4-option-context-manifest.json`, SHA-256 `eaac0bef7d60f9401c1c881f958bfede115ab4af4232aea55e3ebb5cb5e44028`.

Independent review and human sufficiency remain pending under the existing integrated handoff. No task closure or merge is inferred.

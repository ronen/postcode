# M2 early vertical application review: focused option live verification findings

Record type: findings
Received: 2026-11-17
Reviewer: Claude (Opus 5.5), the same independent review session as rounds 4 and 5. It did not take part in implementing M2, running the trials or writing the intent checks.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 7
Reviewed target:
- Live evidence produced by implementation `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b`.
- The record commits `d58d787` and `c13abfb`, and task follow-ups `108e9b7`, `ff4a3a0` and `c1c0cef`, read at worktree HEAD `372e5ec`.

Reviewed scope: the focused live verification of the corrected follow-up-option instructions, which is the three runs in [focused-option-verification.md](../../validation/structured-architectural-accounts/m2-trials/focused-option-verification.md), and any changes made during that verification.
Prior findings: [M2 round 5 Claude findings](2026-11-17-m2-vertical-round-5-claude-findings.md), with [round 6 Copilot findings](2026-11-17-m2-vertical-round-6-copilot-findings.md) and the [round 3–6 corrections intent check](2026-11-17-m2-vertical-round-6-corrections-intent-check-claude.md) as context
Prior reviewed target: `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b`

## Returned findings

### Recommendation

**The live-instruction evidence gap is closed** for elicited authoring and invocation of a follow-up option that promises no result contract. The completed third run establishes all of the following:

- the agent authored an option from the actual production instructions alone;
- the application accepted it and invoked it through the follow-up Lens;
- its exact owner, key and retained meaning reached the subsequent investigator;
- the subsequent contribution was accepted and designated, and contract fulfillment was handled correctly in both steps.

The trial record states the usage, repairs, failures and limits accurately.

The evidence also exposes one **actionable P3 instruction defect**, R7-F1. It does not block the conclusion above.

This review does not accept the M2 checkpoint or authorize M3. Both remain the human's decisions.

### Scope and method

I read the following:

- the trial record and the README addition;
- the task follow-ups that authorized the runs and raised the request ceiling;
- the implementing agent's commit messages;
- the raw captures for all three runs in the ignored `_trials/` directory: specs, sanitized exchanges, steps, attempt reports, usage, budget ledgers, manifests and verification summaries.

I treated the implementing agent's own audit scripts and verification summaries as context and checked them independently, as follows:

- **Capture integrity.** Every file named in the three runs' manifests matched its recorded size and SHA-256.
- **Elicitation.** Each run's spec carries the same single elicitation. It contains no operation name, subject kind or shape, request field, `postcode/` identifier or result-contract identifier. The invocation step carries no elicitation.
- **Instructions and tools.** I generated the production instructions and function definitions from my own build of `6f72f86`. They are `dialogInstructions(operation)` followed by the normal reference guidance. I compared them with every captured exchange:
  - every authoring exchange equals the `state-behavior` instructions with only the elicitation appended;
  - every invocation exchange equals the `examine-content` instructions exactly;
  - the function definitions match exactly;
  - model `gpt-5.6-sol` with medium reasoning throughout.
- **Chain contents.** From the captured function calls, wire inputs, reference bindings, application steps and terminal attempt reports, I extracted the submissions, the repair feedback, the option, the delivered option metadata, the follow-up question and the projections.
- **Accounting.** I reconciled per-exchange provider usage against the record's tables and `usage.json`, and the request ordinals against the budget ledgers.

I ran no inference and changed no implementation or records except this findings file.

### Assessment against the requested criteria

**1. An accepted, invocable option from production instructions alone: established.**

The third run proceeded as follows:

1. Its first submission offered option `half_open_concurrency`, `examine-content` on the retained state-model item. The subject carried a free-text `component` ("HalfOpen concurrency and deferred-decision semantics"), and validation rejected it with `Unknown content component reference.`
2. The one normal repair removed the selector. Nothing else in the option changed.
3. The repaired contribution was accepted. It contained a state model and prose, one designated alternative and the option. Both attempt reporting and the answer projection record `fulfilled` for `postcode/state-diagram-answer@1`.

The operation name and subject shape could have come only from the production instructions. The capped retry independently shows the same pattern.

**2. Invocation through the application, with exact identity and meaning delivered: established.**

- **Invocation.** The harness issued a real `follow-up` Lens request naming the accepted investigram `…4da24ac3…` and parameter `option: half_open_concurrency`. That investigram is the one the initial attempt's report lists as its answer.
- **Delivered request.** The subsequent dialog's first wire input carries `request.option` with that investigram's handle and the key. The reference bindings resolve the handle to the same investigram.
- **Delivered metadata.** The delivered option metadata carries the meaning byte-for-byte as accepted, together with its owner provenance and qualification.
- **Retained records.** The terminal attempt report's `followUp` carries the same owner, key and meaning. The follow-up answer's `question.request.option` and its fixed support retain the option.

**3. Contribution and fulfillment handling: correct.**

- **Follow-up contribution.** It was accepted without repair after six requests. It adds a designation to the follow-up's own Query result, which differs from the original question's result, and its qualification explicitly disclaims supersession of the original answer. The report's answer addresses match the projected designation.
- **Follow-up fulfillment.** The option promised no result contract, and both attempt and projection record null fulfillment. That is correct; the record does not present null as success.
- **No partial outcomes in the completed run.** No reported inability or partial result occurred there: both reports have a null inability.
- **Earlier runs.**
  - The first run ended with `limit-stop` ("Elapsed dialog guard reached."). It was reported as failed with `no-designated-answer` and zero alternatives, so the timeout was not presented as a finding.
  - The retry's follow-up was stopped by the harness's request allowance. It was reported as failed with zero alternatives and null fulfillment.

**4. Repairs, failures, usage and limitations: recorded accurately.**

- **Request counts.** Ordinals 50–53, 54–60 and 61–69 match the ledgers: 49 → 53 at ceiling 60, then 60, then 69 at ceiling 70. The ceiling increase is recorded in follow-up `c1c0cef` before the third run.
- **Token totals.** Per-exchange provider totals reproduce every table entry and the run totals: 61,749 (partial), 149,315 and 292,477. Together they make the stated partial 503,541. The first run's fourth request correctly has no usage, which is treated as unknown rather than zero.
- **Repairs and failures.** Both repairs and both non-completing runs are disclosed.
- **Harness refusal.** The retry's refused dispatch surfaced as `communication-failure` / `transport_error`. The record correctly identifies it as a harness allowance stop and excludes it from provider requests.
- **Limitations.** The stated limits are accurate: no non-null follow-up contract, no spontaneous option generation, no first-submission validity, no reliability rate, and no architectural correctness.

**Directly observed versus established offline.** The live captures directly show the authoring, repair, acceptance, invocation, identity and meaning delivery, follow-up acceptance and fulfillment outcomes above. These remain established only offline or by inspection:

- that distinct options with identical requests stay separate questions;
- ordinary reuse within one option;
- fulfillment of a non-null follow-up contract.

### Changes during the verification

No application, instruction, harness or test change was made during the three runs. `git diff 6f72f86 c13abfb` touches only review, validation and task records.

The later commit `d537c65`, which addresses the round 6 Copilot annotations, changes the executor's preflight ordering. It affects only requests that carry Presentation choices or requirements. The trial requests carry neither, so the observed path is unaffected. That commit leaves `src/lib/contributions/`, `src/lib/investigation/` and the trial harness unchanged, so the production instructions at HEAD are identical to those exercised live. I did not otherwise review `d537c65`, which belongs to the round 6 review.

### R7-F1 — P3: The `component` selector of a content subject is undefined in the instructions

**Location.**
- `followUpInstructions()` in `src/lib/contributions/operations.ts` gives the subject as `{ kind: "content", item: …, component?: string }`.
- The hosted subject schema in `src/lib/investigation/openai/contribution-protocol.ts` offers the same.
- Neither these instructions nor the state-model guidance in `src/lib/contributions/state-model.ts` says what a component is. The state-model contract declares its components as `state:<key>` and `transition:<key>`.

**Observed.** Both investigations that reached submission put an invalid component in their option's subject, and each spent the single permitted repair on it:

| Run | Invalid `component` value |
| --- | --- |
| Retry | `unsupported`, a field name of the state-model body |
| Third | `HalfOpen concurrency and deferred-decision semantics`, free text |

With one bounded repair, any second independent mistake in either submission would have ended the investigation as `invalid-submission`.

The intent check reports both cases as `unsupported`. The third run's value was the free text above; the trial record does not give either value, so it is not inaccurate.

**Resolution.**
- State in the instructions what a component is and how each content type declares its components, for example `state:<key>` for state models. Alternatively, tell agents to omit the selector unless they name a declared component.
- Keep both observed submissions as regression cases, consistent with the earlier instruction findings.

Verifying the reworded instructions live would need separate authorization. Offline validation already rejects the invalid values safely.

### Non-defect observations and limits

- **Same model and repository.** The successful chain used one model and one repository, and needed a repair in each initial investigation. It demonstrates the integration, not reliability.
- **Harness refusals.** The application cannot distinguish a harness allowance refusal from a transport failure, because the harness refuses inside the transport. This is harness-only and disclosed in the record. A future harness could report its refusal distinctly.
- **What I did not do.** I did not assess the architectural accuracy of either generated account. I did not visually inspect the captured diagrams. I did not run the offline suite again, because no relevant implementation changed during the verification.

Only this findings record is created and committed by this reviewer. Implementation, governing material, the task record, task status and the original handoff remain untouched.

# M2 focused live trials

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Structured architectural accounts](../../../../docs/plans/structured-architectural-accounts.md#verification-coverage), focused live observations
Harness: [`scripts/structured-accounts/run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Authority and inputs

The human approved four trials, the route, a 60-request ceiling and elicitation of a follow-up option in trial 1. That approval is recorded verbatim in the task follow-ups.

| Input | Value |
| --- | --- |
| Repository | [Cockatiel](https://github.com/connor4312/cockatiel), MIT licence, commit `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`. This is the pin used by the earlier module-investigation assessments, and the 53 file digests in their manifest were verified before use. Dependencies were installed with `npm ci --ignore-scripts`. |
| Route and model | Sign in with ChatGPT, `gpt-5.6-sol` at medium reasoning, adapter `postcode/chatgpt-responses@7` |
| Subjects | Modules `circuit-breaker-policy` (`src/CircuitBreakerPolicy.ts`) and `consecutive-breaker` (`src/breaker/ConsecutiveBreaker.ts`) |
| Requests used | 39 of 60 across all runs, each reserved in the ledger before dispatch |
| Elicitation | Trial 1 only. One appended instruction asked the agent to offer at least one follow-up option, naming a supported operation and its subject. The harness records it with the step and in every captured exchange. |

The raw captures stay in the session scratch directory and are not committed. They hold sanitized provider exchanges, delivered answers and attempt reports, and they contain repository source. What is committed here is the four accepted state models, rendered with the current renderer, `postcode/state-transition-diagram@4`, as SVG pictures and text forms. These contain agent-authored labels and conditions, and no source text.

## Runs

The trials ran several times, because early runs exposed defects and unclear instructions that were fixed in between. Each row names the protocol versions in force for that run.

| Run | Dialog / wire version | Requests | Outcome |
| --- | --- | --- | --- |
| 1 | — | 0 | The Keychain item could not be read while no one was present to approve access. |
| 2 | — | 0 | Harness defect: it excluded the ledger file's directory, which contained the project, from evidence. |
| 3 | `@1` / `@1` | 2 | Trial 1 submitted, the submission was returned for repair, and the hosted adapter failed. Adapter defect: it did not keep a submission call pending, so the repair turn had nothing to answer. |
| 4 | `@1` / `@1` | 12 | Trial 4 accepted after one repair. Trials 1 and 3 ended as invalid submissions after their one repair. Trial 2 skipped: no option to invoke. |
| 5 | `@2` / `@1` | 12 | Trials 3 and 4 accepted after one repair each. Trial 1 ended as an invalid submission. Trial 2 skipped. |
| 6 | `@3` / `@2` | 7 | Trial 1 accepted after one repair, and trial 2 accepted on its first submission. |
| 7 | `@3` / `@2` | 6 | Trial 1 and trial 3 in one Session, both accepted on their first submission. |

Each successful trial outcome was reached at least once. The protocol in its final state, dialog `@3` and wire `@2`, produced runs 6 and 7: three of four submissions were accepted first time and the fourth after one repair.

## Instruction and protocol findings

Every rejected submission was a structural mismatch with an undocumented or loosely documented shape. None reflected difficulty with the architectural question. Each finding was fixed and kept as a regression case.

| Observed | Cause | Correction |
| --- | --- | --- |
| Declaration grounds given as `{ evidence, statement }` or `{ statement }` | The submission format named `grounds?` without its shape | Exact shape stated; schema closed |
| Follow-up option with `operation` and `subjects` at its top level | Option shape not stated | Exact shape stated; schema closed |
| `unsupported` given as one string | The state-model guidance did not say it is a list | Stated as a list of strings |
| Prose body given as a bare string | Content body shapes not stated | Each built-in type's body shape stated |
| `report` placed inside an investigram | Report placement implicit | Stated as contribution-level only; schema closed |
| Stray strings inside an option's subject list | The submission schema left nested structures open | Complete submission schema matching the stated shapes, as the original investigator protocol already has |
| Unknown investigram reference (run 6, repaired) | Not diagnosed beyond the returned message. The repair succeeded. | None. Recorded as an open observation. |

Validation reports only the first structural problem it finds, so a single repair could fix one mistake and then fail on the next. Bounded repair stays at one attempt. Under the final protocol, no trial needed more.

## Observations against the plan's instruction obligations

| Obligation | Observed live |
| --- | --- |
| Honor the requested result contract | All four accepted answers met the state-diagram contract. Trial 4 explained why its two states are threshold categories over a counter and left the entry category unknown with its reason, instead of forcing a single entry. |
| Maintain identity deliberately | The elicited option in trial 1 referred to the existing `breaker` module Entity by its supplied handle. The fresh investigation in trial 3 referred to the module by its handle and introduced no Entities. No submission introduced an Entity for a state. |
| Ground and qualify claims | Each answer carries limitations naming its basis: captured source as first observed, with no runtime testing or atomic snapshot claimed, and the scope and abstraction level of its model. Each disclosed semantics its model cannot express, such as hydration as an alternate entry, half-open concurrency, a delegated breaker's own state, a publicly writable counter, and NaN. |
| Acquire what the action needs | The fresh investigation was supplied the current designated answer with its content before it superseded that answer. Every dialog requested source evidence before submitting. Dialogs that requested exports received the retained mechanical export finding through their own production. |
| Express organizing changes explicitly | The fresh investigation superseded the earlier designation with qualified grounds: it confirms the earlier four-state account while refining schema, hydration qualification, unchanged-state behavior and the auxiliary state explanation. The displaced designation remains in exact history with those grounds. |
| Update the earlier answer being revised | The same supersession targeted the repeated question's Query result. |
| Follow-up options and illustrations | Elicited in trial 1. Invoking the option in trial 2 delivered the option as substantive input with its owner's provenance. The agent acquired further evidence: inspection, exports, dependencies, and the source of three re-exported breakers. It answered under the option's promised state-diagram contract, stating that the module has no module-level mode and describing its implementations' instance state. No illustration was offered. |

### Not observed live

- **Change notices during a dialog.** Covered by deterministic tests only, as approved.
- **Unresolved inconsistency reports, withdrawals, and reuse or partitioning of existing content.** None of the trial questions called for them, and they were not elicited. Deterministic tests cover their mechanism.
- **Illustrations.** None were offered. Rendering does not depend on one.

### Judgment for review

In trial 3 the agent chose supersession, not an added alternative, for a fresh account it describes as confirming and refining the earlier one. The decision permits supersession with grounds and requires an explanation of the change, which the agent gave. The earlier answer was also an interpretation, not a mechanical finding. Whether this is the organizing choice a reader would expect is a question for review, not a defect.

## Limits

These are a few focused trials of one model on one repository. They show that the integration can produce and consume useful-shaped qualified content. They establish neither statistical reliability, nor the correctness of the architectural accounts, nor user value. No answer or picture is frozen as an expected output.

## Subsequent review elicitation

The [review follow-up trial record](review-elicitation.md) preserves three additionally authorized scenarios and the observations missing from the original runs: precise inconsistency, withdrawal, content reuse/partitioning and illustrations. It used 10 further requests, bringing the cumulative total to 49 of the original 60. The earlier run descriptions above remain evidence of their original targets and instruction versions.

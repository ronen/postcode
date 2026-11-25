# CLI shell retirement evidence

Source baseline: `5f9534aeee06996843c74548a3083b11df8815bf`. These observations identify where to check consumers and compare trial behavior while implementing the [approved plan](../docs/plans/cli-shell-retirement.md). Revisit this note when the plan concludes. Remove evidence covered by implementation checks and carry any outstanding runner findings into the [trial-failure backlog candidate](../docs/backlog.md#assess-artifact-capture-and-cleanup-in-failed-trials).

## Where responsibilities share code at the baseline

| Question | Source evidence |
| --- | --- |
| What does authentication use from the CLI? | Under `src/lib/interfaces/cli/`, `authentication.ts` uses diagnostics from `investigator-policy.ts`. Authentication also uses terminal-safe text independently of investigation layout. |
| Which execution paths depend on the shell? | `src/lib/interfaces/cli/application.ts` consumes the private operation scope. The direct runners call the application Session. Under `src/lib/application/`, `consumption.ts` participates in both Presentation negotiation and selection of information requirements for direct requests. |
| What does the trial renderer consume? | In `src/lib/contributions/answers.ts`, answer selection and resolution share a file with `arrangeContributionAnswer`. The standard runner calls the latter with the returned contribution content and title. It saves the qualified projection, arranged view, and each alternative’s diagrams. `state-diagram.ts` renders diagrams and `state-model.ts` supplies state semantics. |
| How do trial steps refer to earlier work? | The standard runner retains requests and contribution results by step. Fresh requests reuse a captured request and follow-ups use the selected option’s precise address. Compact application bindings and the per-dialog wire handles in `src/lib/investigation/openai/references.ts` have different consumers. |

## Where cleanup can overwrite an interrupted outcome

In `src/lib/contributions/dialog.ts`, the dialog classifies interruption before its finalizer closes the conversation and reports the attempt. An exception from either operation can reach `src/lib/application/session.ts`, which classifies request work from the exception it receives. An earlier session reported comparing two interrupted requests: both attempts recorded interruption and usage, but when conversation close threw, the caller received the cleanup error and work was marked as a defect. The planning assessment corroborated the source path. The paired request experiment was reported by that earlier session.

Useful test entry points under `test/` include `contribution-application.test.ts` and `contribution-dialog.test.ts` for direct interruption, exposure and accounting. `investigation-integration.test.ts` mixes late usage during a dialog with worker-specific message races. `execution-ownership.test.ts` covers Git exit and cleanup, while `contribution-answers.test.ts` and `contribution-state.test.ts` cover answer and diagram semantics. The direct runner and its dialog14 auditor live under `scripts/structured-accounts/`. The request-budget helper under `scripts/module-investigation/` serves direct trials too.

## What did the standard trial runner save on failure?

On 25 November 2026, nine cases exercised the body of `scripts/structured-accounts/run-trial.mjs` with controlled import bindings. A synthetic step emitted an attempt callback. The harness supplied an in-memory filesystem, credentials, agent, Session and budget substitutes and checked the exact error returned, files saved, and cleanup calls. “Primary” denotes the error injected at the named step. The interruption case injected an exception. The experiment measured runner control flow only.

| Injection | Caller error | Final usage saved | Attempt record saved | Budget close attempted |
| --- | --- | --- | --- | --- |
| None | None | Yes | Yes | Yes |
| Request failure | Primary | No | Yes | Yes |
| Request interruption | Primary | No | Yes | Yes |
| Request failure and Session-close failure | Cleanup, replacing primary | No | Yes | No |
| Session-close failure after successful request | Cleanup | Yes | Yes | No |
| Step-output failure | Primary | No | Yes | Yes |
| Attempt-output failure | Primary | No | No | Yes |
| Usage-output failure | Primary | No | Yes | Yes |
| Credential setup failure | Primary | No | No | Yes |

All nine cases passed. The runner appends attempt reports as they arrive and writes final usage after the step loop. Its finalizer awaits Session close before calling budget close. Source inspection of the separate dialog14 runner showed that its nested finalizer attempts budget close even if Session close throws. Both runners reserve a budget slot before dispatch. These observations distinguish pre-existing partial capture and cleanup behavior from changes introduced during rendering relocation.

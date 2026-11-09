# Integrated application boundary review: findings

Record type: findings
Received: 2026-11-09
Reviewer: Claude (Opus 5.5) in an independent Claude Code session arranged by the human
Handoff: [Integrated application boundary review](2026-11-09-integrated-boundary-handoff.md)
Round: 1
Reviewed target: `e7de4b1ba5a222c0facc9b376c5a8c5b582e1386`

## Returned findings

### Scope reviewed

- Implementation: `815f237..e7de4b1` (complete task), with separate attention to `b4dc07b..e7de4b1` (extraction, M1–M4). I did not re-review the method-provenance checkpoint `815f237..b4dc07b` beyond checking that later work did not change it.
- Records and evidence committed after the target (`e7de4b1..0564852`) were read as context. They touch only `records/` and do not change `src/`, `test/` or `scripts/`.
- Governing basis: the approved plan (including the outcome matrix, allocation inventory and verification matrix), the internal application API decision and this handoff.

### Method

- Read the whole intended entry and its service modules: `application/index.ts`, `contracts.ts`, `session.ts`, `executor.ts`, `operation-scope.ts`, `publication.ts`, `requests.ts`, `input.ts`, `consumption.ts`, `catalog.ts`, `content.ts`, `retained.ts`, `bindings.ts`, `lenses.ts`, `accounts.ts`, `observations.ts` and `feedback.ts`. Also read the CLI adapter and host files: `interfaces/cli/application.ts`, `runtime.ts`, `authentication.ts`, `investigator-policy.ts`, `feedback.ts`, plus `command-execution.ts`, `session-worker.ts`, the changed parts of `interactive-session.ts`, `cli.ts`, `shell.ts` and `investigation/openai/configuration.ts`.
- Compared the extracted executor line by line with the baseline `session.ts` and `retained-presentation.ts` at `b4dc07b`. This covered validation order, refusal reasons and pointers, `referenceNotice` conditions, alias allocation sites and order (`answerIds` and `entityIds`, the mechanical wrappers, the associated-inspection batch, and the investigation port population), `consumeInterpretation` targeting, method-provenance assembly, retained compatibility and fallback, and work finalization.
- Traced work finalization and outcome classification across the direct, local in-process CLI and worker-transported paths: deferred versus non-deferred post-checks, `guardPublication` outcomes, `publishCommand` bookkeeping, parent work sealing, and attempt-report capture during cancellation (`investigation/execute.ts` emits `onReport` synchronously in `finally`, before `perform` clears `currentWork`).
- Ran my own TypeScript compiler-API traversal of the source import graph from `application/{index,accounts,observations,feedback}.ts`. It follows static, dynamic and `import type` edges. The reached set contains no `interfaces/cli/`, parser, renderer, terminal, View, `requests.ts`, `request-catalog.ts`, `presentation-contracts.ts` or `source-disclosure.ts` module.
- Checked capability metadata for CLI encodings, the eligibility translation in `applicationPresentation` against the baseline `retainedPresentation` and `planPresentation` checks, and the typed credential-reason split together with the CLI's in-exchange diagnostic restoration.
- Read the comparison scripts as code. The only relaxation in `compare-application-journey.mjs` is narrowly asserted: before is `failed`, after is `completed`, both are CLI-failed, and exactly one `finish` event is rewritten. Everything else is compared as full serialized JSON, so field order is preserved. Build selection is explicit per build and does not fall back to whatever file happens to exist. No `--method-split` flag was used.
- Inspected the exact-access tripwires in `application-journey.test.ts`, the direct client in `test/application-client.ts`, which imports production code only from `application/index.ts`, and the dependency test.
- Ran a small probe of direct `ExecutionContext` capture (see F1).

### Verification performed

- `npm run check`: passed.
- `npm test -- --test-concurrency=2`: **664/664 passed**, 0 failed, skipped or cancelled, on Node.js 26.13.0. A first attempt on Node 22.13.1 failed two `chatgpt-auth` cross-process tests because `fs-ext`'s native build targets NODE_MODULE_VERSION 147. This is the environment constraint the handoff describes, not a defect.
- Emitted `b4dc07b` and `e7de4b1` from `git archive` into separate scratch build roots. Their emitted-source SHA-256 values match the recorded ones exactly: `70d8d8be…62c02` (post-split) and `b540490f…81867` (final).
- `scripts/compare-application-boundary.mjs POST_SPLIT FINAL REPORT`: **21/21 equal**.
- `scripts/compare-application-journey.mjs POST_SPLIT FINAL REPORT`: **60/60 equal**, across both hosts and ordinary/forced-prefix collisions.
- No live credentials, paid inference or live assessment entry points were run.

### Actionable findings

**F1 (low; non-blocking): a malformed or accessor `requestId` on direct `execute` is silently replaced.**
`application/session.ts` `execute` captures `ExecutionContext` with `captureFields`, but it keeps only the problems recorded against `invocation`. A non-string `requestId` (for example `42`), or an accessor `requestId`, is dropped without a report, and the context receives a generated ID. Probe at the target: `{ requestId: 42 }` produces a context ID that is not `42`, with no recorded problem. An accessor `requestId` was correctly *not* executed, but it was also replaced silently. This is better than the baseline, where spreading the execution options could run an accessor. Still, the plan asks for safe capture that "preserve[s] malformed input and safe omission reasons". `requestId` is only occurrence correlation, never identity, so the impact is limited to a direct caller silently losing its correlation. Suggested resolution: either surface correlation-capture problems alongside the invocation attachment's problems, or refuse the call with a typed error. The CLI is unaffected because its adapter always supplies a string.

No other actionable defects were found.

### Relevant non-defect observations

- **Extraction fidelity.** Fresh and exact allocation sites match the plan inventory and the baseline order, including organization (evaluation groups, selected groups, module evaluation population, then embedded detail), exports (basis population, then subject), the full associated-inspection batch over all matches, and the investigation port validated against `content.references`. The independently reproduced 60-case allocation trace comparison agrees.
- **Associated-inspection consumption.** Moving `consumeInterpretation` to the selected composite in the fresh mechanical path, which the plan requires, is implemented before arrangement.
- **Operation scope.** There is one `operation()` acquisition per `withCliOperation`. The scope accepts exactly one `execute`. The port is created only for pure investigation answers. `allowed()` revokes it on settlement (`finally`), on invalidation (`invalid`) and on close (`alive()`). There is no public bypass flag, and `deferPublicationCheck` is gone. The worker path finalizes work before the parent's guarded publication. The local path holds the guard through `guardPublication`.
- **Outcome matrix.** Unknown continuation leaves work `completed` while `failed` drives exit 3. Arrangement throws happen after `finishWork`, and parent sealing does not reclassify a non-running report. Direct post-check invalidation happens before finalization. Retained historical failures deliver `failed: false`.
- **Pre-existing behavior, not introduced here.** Closing a direct Session while an `execute` is in flight makes that request's work `defect`, because `SessionClosed` is not one of `failWork`'s classified errors. The baseline behaves the same way. Recording it only in case a later direct client cares about that distinction.
- **Credential diagnostics.** Command guidance was removed from `CredentialError` messages. `configureCliInvestigator` restores the guidance for preflight and in-exchange `configuration-unavailable` replies by matching code and exact message. Direct clients therefore see neutral wording, and CLI-retained records keep the prior wording.
- **Dependency test.** The test's forbidden-path regex matches any `presentation.ts` basename, but it would not catch a future import of `presentation-contracts.ts`, `requests.ts`, `request-catalog.ts` or `diagnostic-view.ts`. No such import exists today; my independent traversal confirms this. Tightening the pattern would make the test hold up better against future changes, but nothing currently fails because of it.

### Unverified areas and residual limits

- I did not repeat the M3 live/runtime probes (288 output comparisons, interruption probes, profiler, repository-sized reuse) or the script linkage audit. I rely on their recorded evidence, consistent with M4 changing no runtime code. That last point I confirmed: in `git diff d005cd3..e7de4b1`, the only `src/` change is TSDoc comment lines in `application/index.ts`; the rest is tests and documentation.
- I did not independently construct new race tests for worker-termination sealing. I read the code paths and rely on the existing `execution-ownership` and `application-cli-outcomes` tests, which passed.
- I did not separately re-review hosted-provider behavior or the method-provenance checkpoint. Documentation was spot-checked (`cli-reference.md` outcome wording and format version 4; the entry TSDoc) rather than audited exhaustively.

### Recommendation

The implemented boundary and preservation evidence satisfy the plan's final integrated gate in substance. The direct client uses complete fixed content through the intended entry. There is one shared executor. The dependency direction is clean. Allocation schedules and outcome separation are preserved. Both comparison oracles reproduce from independently emitted builds. F1 is a small, clearly in-scope capture-fidelity correction and does not need another full review round; the implementing agent can verify it. The human decides whether this accumulated review satisfies the gate.

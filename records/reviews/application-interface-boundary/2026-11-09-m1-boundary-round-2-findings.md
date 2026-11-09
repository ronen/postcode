# M1 application boundary review: round 2 findings

Record type: findings
Received: 2026-11-09
Reviewer: Claude Code (Claude Opus 5.5), independent review session arranged by the human
Handoff: [M1 application boundary review](2026-11-09-m1-boundary-handoff.md)
Round: 2
Reviewed target: `67e3818cbdbeb7156e6426115aaed337a4e2b6e6` (corrections `94f3c50..67e3818`; extraction comparisons against `b4dc07b`)
Prior findings: [Round 1 findings](2026-11-09-m1-boundary-round-1-findings.md)
Prior reviewed target: `94f3c5046115687205b695aafa33bba9c35fef96`

## Returned findings

### Scope and method

This round reviews the correction commit `67e3818` ("Correct local publication scope and exact-path review coverage"), which responds to round 1 findings F1–F3. Its context is the implementing agent's task-record note in `d1bdea6`. That commit and later ones change no `src/`, `test/`, `scripts/`, `fixtures/` or package files relative to `67e3818`.

Method:

- Read the complete `94f3c50..67e3818` diff:
  - `application/operation-scope.ts`, `application/session.ts`, `application/requests.ts`;
  - `interfaces/cli/application.ts`, `command-execution.ts`;
  - the architecture note;
  - the modified and new tests.
- Checked the production hosts passed to `publishCommand` (`cli.ts`, `shell.ts`).
- Re-ran my round 1 probes against both the round 1 target and the correction build.

### Verification performed

- `npm run check` passed, and `git diff --check` passed over the correction and record commits.
- I emitted `67e3818` into a separate build root. Its emitted source digest is `627a2715…c097`, matching the task record. The extraction baseline `b4dc07b` digest remains `70d8d8be…2c02`.
  - `compare-application-boundary.mjs` (no `--method-split`): 21/21 equal.
  - `compare-application-journey.mjs`: 60/60 equal, covering both hosts and both collision settings. The comparison policy is unchanged.
- `npm test` in the task worktree (code identical to `67e3818`), on Node 22.13.1: 652 tests, 650 passed.
  - The 2 failures are the kernel-lock/shared-renewal tests in `chatgpt-auth.test.js`. They fail because the shared `node_modules/fs-ext` binary was rebuilt for a different Node ABI (`NODE_MODULE_VERSION 147` versus 127). The task record notes the same environment issue in the other direction.
  - In a scratch copy with `fs-ext` rebuilt for Node 22, the complete `chatgpt-auth.test.js` file passed 20/20. I did not alter the worktree's `node_modules`.
  - The correction changes no authentication or locking code.
- My round 1 race probe for F1 holds the session guard with competing `check()` calls from the request's `finish` event.
  - On `94f3c50`, the request still throws `SessionBusy` with work `completed`.
  - On `67e3818`, the request succeeds, the View is returned, and work is `completed`.
- My F3 probe: function and `Map` attachments now yield `{ field: 'invocation', reason: 'An invocation attachment must be a plain object.', representation: 'omitted', omittedField: 'invocation' }`. Nested unrepresentable keys are still reported per key.
- No paid inference and no live credentials were used.

### Assessment of round 1 findings

**F1: resolved.**

- `ClientOperation` now exposes `check()`. It verifies that the scope is still active, runs the internal `check` without the public `operation(...)` guard, and verifies again afterwards.
- In-process `compose` runs `guardPublication(operation.check, output)` inside `withCliOperation`, so the guard is held through delivery and the local pre/post checks.
- The in-process session also exposes `publish(request, execution, output)`. `publishCommand` uses it when present, so the actual display happens once inside the scoped guard instead of under a second outer guard.
- The worker composition has no `publish` and is unchanged. Production one-shot and shell paths still pass worker-backed sessions.
- An escaped `scope.check` is rejected as expired (test added).
- The new tests assert:
  - completion despite competing microtasks;
  - exactly three source checks for stable and after-output delivery, and two for before-output and output-throw;
  - exit codes 0/2/2/1 for stable/before-output/after-output/output-throws;
  - stdout and `qualified-view` bookkeeping;
  - work remains `completed`.

**F2: resolved for the M1 exact path.** `test/application-exact-compatibility.test.ts` exercises exact retrieval through `openApplication` and `openCliSession`, not the legacy helpers:

- direct exports subset refusal with `retainedAnswers` and guidance;
- raw exact retrieval of the same answer still succeeding;
- partial and empty exports with a materialization fallback, in JSON and Unicode;
- retained-support fallback before materialization;
- retained investigation revision paging, association continuation, unknown continuation with restart, and old exact content after reinterpretation.

While exact retrieval runs, `put`, `evaluations`, `investigations` and `boundEntity` are mocked to throw. This directly tests the no-acquisition and no-history-enumeration contract. The legacy helper tests remain, as planned for M3.

**F3: resolved.** `captureFields(value, 'invocation')` labels a non-plain attachment as `invocation` and leaves the accepted request and its work unaffected. Tests cover functions, `Map`, class instances, `null`, arrays and primitives.

### Actionable findings

None.

### Non-defect observations

- `publishCommand` silently prefers `session.publish` over `session.execute` when both are present. If a caller spreads an in-process session and overrides only `execute`, the override is bypassed. This is why several existing tests (`request-model`, `session-inputs`, `work-attribution`) moved to `openWorkerCliSession`. Their assertions are unchanged, and no production caller is affected. It is still a sharp edge to keep in mind when M3 settles the CLI and script consumers.
- After those test moves, in-process before/after-output publication is covered by the new local publication tests for a View result only. The non-View (usage/resolution) publication-timing tests now run on the worker composition.
- In-process `execute` without an output action still runs the guard around a no-op output, giving two back-to-back checks. These now run inside the operation scope, so the round 1 race no longer applies. This is harmless.
- My round 1 observations about dependency direction, content, capture, allocation order, outcomes and harness coverage are unaffected by this correction. The comparison results and emitted-source identities above confirm that the extraction behavior compared by the oracles is unchanged.

### Unverified areas and residual limits

- The round 1 limits still apply: interruption, invalidation and worker-termination races beyond the existing tests, provider and live-credential paths, and a full row-by-row runtime check of the plan matrix.
- I did not run the full suite under the Node version for which the shared `fs-ext` binary is currently built. The two ABI-affected tests passed only in my rebuilt scratch copy.

### Recommendation for this gate

The round 1 findings are resolved, and this round has no actionable findings. In my assessment, the M1 boundary slice at `67e3818` is sound enough to proceed to M2–M4. Whether the accumulated review satisfies the gate is for the human to decide.

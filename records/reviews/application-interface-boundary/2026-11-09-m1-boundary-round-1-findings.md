# M1 application boundary review: round 1 findings

Record type: findings
Received: 2026-11-09
Reviewer: Claude Code (Claude Opus 5.5), independent review session arranged by the human
Handoff: [M1 application boundary review](2026-11-09-m1-boundary-handoff.md)
Round: 1
Reviewed target: `94f3c5046115687205b695aafa33bba9c35fef96` (extraction `b4dc07b..94f3c50`; method provenance separately `815f237..b4dc07b`)

## Returned findings

### Scope and method

I reviewed the immutable target `94f3c50` against the extraction baseline `b4dc07b`. I also examined the separate method-provenance checkpoint `815f237..b4dc07b`. Later commits (`3e42847`, `935a0ec`, `091c148`) were read only as evidence and assignment. I confirmed that they change no `src/`, `test/`, `scripts/`, `fixtures/` or package files relative to the target.

Method:

- Read the full new application layer (`src/lib/application/*.ts`), the CLI adapter (`src/lib/interfaces/cli/application.ts`), the `session.ts` forwarder, and every other changed production file in the extraction diff. Compared each against the baseline `session.ts` executor, `retained-presentation.ts` and `presentation-contracts.ts`.
- Checked the governing plan sections (bounded contracts, allocation table, outcome matrix, lifecycle/delivery, M1) and the invocation-context rules of the internal application API decision.
- Traced runtime, type and dynamic-import dependencies from `application/index.ts` with my own TypeScript AST walk, separate from the repository test.
- Read both comparison harnesses and the shared fixture helper as code.
- Wrote two small probes (outside the repository) to test suspected lifecycle and capture defects.

### Verification performed

- `npm ci` and `npm run check`: passed.
- `npm test` in the task worktree (code identical to the target): **641/641 passed**. A first run from a `git archive` copy of the target, which is not a git checkout, failed 14 repository/group-dependent tests. Those failures are environmental: the copy has no repository evidence. They are not target defects.
- I emitted baseline `b4dc07b` and target `94f3c50` into separate build roots. The emitted source digests match the verification record exactly: `70d8d8be…2c02` and `33590e52…17bb`.
  - `compare-application-boundary.mjs BEFORE AFTER REPORT` (no `--method-split`): 21/21 equal.
  - `compare-application-journey.mjs BEFORE AFTER REPORT`: 60/60 equal, covering both hosts and both collision settings.
- I also emitted the original build `815f237` and ran `compare-application-boundary.mjs 815f237-build b4dc07b-build REPORT --method-split`: 21/21 equal.
- No paid inference and no live credentials were used.

### Actionable findings

**F1 (low–moderate, publication lifecycle). The in-process CLI publication guard runs after the operation scope is released and re-enters the public guarded `check`. A concurrent call can turn a completed request into a `SessionBusy` failure.**

`interfaces/cli/application.ts:130–153`: in-process `compose` (`transported === false`) awaits `withCliOperation(...)`, which releases the session guard. Only then does it call `guardPublication(application.check, () => {})`. `application.check` is `operation(check)` (`application/session.ts:80`), so it acquires the guard again.

Any call that starts in the gap between those two steps holds the guard. The completed request's publication check then fails with `SessionBusy`. That error is rethrown from `execute` even though `work()` already reports the request `completed` and its View was fully arranged.

I reproduced this with a probe:

1. Open `openCliSession` on a one-file project.
2. From the request's `finish` progress event, start a microtask loop that keeps calling `session.check()`.
3. Result: request A threw `SessionBusy` while `session.work().status` was `completed`.

The plan says `SessionBusy` means no new accepted work (matrix row "Concurrent or closed direct call"). It also says the guard is retained until arrangement settles and that the deferred check is owned by the publication path (plan §Reference allocation and the CLI operation scope; §Lifecycle and delivery). Here a busy refusal is reported for work that was accepted and completed.

Related composition issue: the plan asks the in-process adapter to use "a local check transport to exercise the same guarded composition" as the worker. Instead, the in-process `execute` embeds a guard around a no-op output:

- Its "post-output" check runs before any actual output, so the withheld versus failed-after-output distinction is not exercised in this host.
- When the in-process session is used through `publishCommand` (e.g. `test/session-inputs.test.ts:147`), the result is guarded twice, with four checks.

Production one-shot and shell paths use the worker composition and are not affected. The in-process host is used by tests and, through the `session.ts` forwarder, by live assessment scripts.

Suggested direction, an in-scope correction: perform the in-process local pre/post checks inside the operation scope using the internal `check`, not the guarded public one. Alternatively, leave in-process delivery deferred like the worker and let the caller's `guardPublication` own the checks through a local check transport. Then add a race test at that boundary.

**F2 (low, test coverage of the M1 exact path). Several exact-retrieval compatibility and refusal assertions now exercise only legacy helpers that production no longer uses.**

After extraction, `presentRetained` (`retained-presentation.ts`) and `planPresentation`/`retainedPresentation`/`settlePresentation` (`presentation-contracts.ts`) have no production callers; I checked with grep over `src/`. The production exact path is `application/executor.ts:72–104` plus the CLI `arrange`. Tests still call the legacy helpers directly, for example:

- `test/exports-lens.test.ts:193–209`: retained partial/empty exports content, and the missing-support refusal with `retainedAnswers` and "new information request" guidance.
- `test/investigation-selection.test.ts:452–602`: retained investigation presentation and continuation cases.

By inspection, the new executor reproduces the legacy decision procedure: the same default lookup, option eligibility, supplied-requirement filter, fallback rewrite, explanations and qualification lists. However, neither the test suite nor either comparison harness exercises these cases through the production path. The harness fixtures contain no module-exports answer and no missing-support exact case.

The handoff states that these helper tests stay for their independent assertions and that consolidation is M3 work. I accept that as the plan for removal. But until the assertions target the production path, they do not verify the behavior the M1 slice is meant to establish. Suggested direction: port these exact-path assertions to direct-API and CLI-adapter tests in M2, which covers exact-answer operations, before the helpers are removed in M3.

**F3 (low, safe capture reporting). A non-plain invocation attachment on the direct API is reported as a problem with the semantic request.**

`application/session.ts:118–121`: when `context.invocation` is defined but is not a plain object (a function, `Map`, class instance and so on), `captureFields(descriptor.value)` returns `{ field: 'request', reason: 'A request must be a plain object.' }`. The better-labelled `omittedField: 'invocation'` problem that `captureFields(execution)` already produced is discarded.

Probe output for `execute({kind:'report',report:'usage'}, { invocation: () => 1 })`:

```
context.invocation = {"fields":{},"problems":[{"field":"request","reason":"A request must be a plain object.","representation":"omitted"}]}
```

The request itself was accepted. The plan asks capture to "preserve malformed input and safe omission reasons". Suggested direction: label the problem as the invocation attachment, for example by reusing the existing `invocation` problem when the attachment as a whole is unrepresentable.

### Non-defect observations

- **Dependency direction.** The transitive static, dynamic and `import type` graph from `application/index.ts` reaches 78 modules. None of them is CLI, View, renderer, terminal, observation, `presentation-contracts`, `retained-presentation` or `investigation/associations` code. `operation-scope.ts` is reachable but not exported from the entry point, and no delivery payload carries a store, port or function. The repository test's forbidden-path pattern matches family `presentation.ts` files at any depth.
- **Content.** Delivered content is the family resolvers' full qualified content, not a View facade. Associated inspection delivers both the composite and its mechanical support. Exact retrieval only uses bound-answer lookup, exact `lookup`/`get`, the existing answer-alias allocation and fixed resolvers. It does not enumerate current history, select, evaluate or acquire. A retained failed interpretation answer finishes `completed` and does not inherit the fresh-failure flag, which matches matrix row "successful exact retrieval, including a historically failed answer".
- **Capture and normalization.**
  - `normalizeInformation` is the single semantic normalizer for both the direct path and the CLI `captureRequest` path.
  - Direct defaults and subsets follow the plan's table. Raw exact retrieval of an organization answer without `group-details` succeeds; the refusal applies only when consumption is requested.
  - The CLI eligibility translation (`applicationPresentation`) reproduces the baseline `compatiblePresentation`/`retainedPresentation` rules for format, detail, association paging and revision paging, using the fresh and retained fact sets.
  - `cliContext` reconstructs the legacy field order for lens, report, present and rejected requests. The journey oracle confirms this by serialization.
  - The invocation attachment cannot select work. The trusted CLI composition supplies structural designation and report-input facts only as `InputConstraints`.
- **Allocation order.** I checked each plan-table site against the baseline by inspection:
  - answer alias before mechanical populations (argument-evaluation order in `delivery`);
  - modules: discovery then projection;
  - organization: evaluation groups, selected groups, module evaluation, then detail;
  - dependencies: basis then projection;
  - exports: basis then subject;
  - mechanical associations after the mechanical populations;
  - the investigram/module population before Evaluation in the interpretation branch;
  - the investigation port validating whole batches before allocating.

  The port is created only after work finalizes, exists only for investigation content without mechanical support, and is revoked in `finally`. A captured `operation`/`bindings` object throws after the scope ends. The journey traces, including the forced-prefix collision runs, agree with this analysis.
- **Work and outcomes.**
  - Direct calls check before and after work and finalize after the post-check.
  - Worker delivery finalizes before arrangement and leaves final checks to `publishCommand`'s `guardPublication`.
  - Arrangement exceptions leave the finalized work unchanged.
  - The only work-status change is unknown continuation `failed → completed`, with CLI failure and exit 3 retained.
  - Final attempt reports are emitted synchronously in the investigator's `finally` before rejection, so the `currentWork` filter on `onReport` does not drop final cancellation usage.
- **Harnesses.** Both oracles are strict.
  - The journey oracle compares full serialized results, allocation calls and progress events in field order. Its only adjustment is narrowly asserted: before `failed`, after `completed`, exactly one finish event, both CLI results failed.
  - The collision fixture keeps the production allocator.
  - The boundary oracle without `--method-split` requires identical digests and aliases after occurrence correlation.

  Coverage limits: the journey uses only the dependency-journey fixture (inventory, module inspection, exact present, summarize, historical inspection, usage, malformed/conflicting input). Organization, dependency, children and parents run only as single runCli commands in the worker host, without allocation traces or collision. Group and organization associated inspection, module exports, corrections/revision paging and missing-support exact refusals are not compared. Check schedules per host are covered by unit tests, not the oracles.
- **Method provenance.** The `815f237..b4dc07b` split moves the three Presentation versions out of application `methods`, bumps `observed-inputs@7` and `program-records@23`, and preserves the View/key formulas through `presentationMethods`. The `--method-split` comparison passes, and extraction changes no method version.
- **Legacy surface.** As the handoff states, `presentation-contracts.ts` still contains a second (unused) compatibility planner, and `createInvestigationView`/`createMechanicalView` remain as store-taking wrappers. This is planned M3 cleanup, not an M1 defect, but see F2.

### Unverified areas and residual limits

- I did not run interruption, invalidation or worker-termination race scenarios beyond the existing tests.
- I did not test cleanup failure, live credentials, paid inference or provider paths.
- I did not independently re-derive every plan-matrix row against runtime behavior. Rows other than those discussed were accepted on the basis of code inspection plus the passing suite.
- I did not review documentation changes (`docs/architecture/README.md`) in detail.
- The 641-test count differs from the 638 recorded for the earlier extraction build. I did not reconcile which tests were added.

### Recommendation for this gate

I found no defect in dependency direction, capture-once declarations, completeness of precise-ID content, allocation scope/order, or the separation of work and publication outcomes that would block M2–M4. F1 is a small, clear in-scope lifecycle correction in the in-process CLI composition. I recommend fixing it, with a race test, before or at the start of M2. F2 and F3 are low-severity: F2 can be handled as M2 test migration, and F3 is a one-line capture-reporting fix. Whether this gate is satisfied, and whether F1 needs a further review round, is for the human to decide.

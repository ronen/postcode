# Direct terminal Session lifecycle: findings

Record type: findings
Received: 2026-11-25
Reviewer: Claude Code (Claude Opus 5.5), fresh independent session
Handoff: [2026-11-25-terminal-lifecycle-handoff.md](2026-11-25-terminal-lifecycle-handoff.md)
Round: 1
Reviewed target: `ff2da8709b8ed929b6fcaac1ccbd52129c93a9d5` (scope `5db2cf19f0436d206aa5d5c05de7f022a03b45b9..ff2da8709b8ed929b6fcaac1ccbd52129c93a9d5`)

## Returned findings

### Scope and method

I reviewed the exact target diff: `src/lib/application/session.ts`, `contracts.ts`,
`index.ts`, `src/lib/contributions/dialog.ts`, `evaluation.ts`,
`src/lib/execution-errors.ts`, `src/lib/execution-wait.ts`,
`test/application-shutdown.test.ts`, the capture script, the architecture/backlog
text and the preservation evidence. I read them against the approved plan's
terminal-abort section and matrix, and against the accepted decision's
`#terminal-abort` section. I also read the surrounding unchanged code that the
change depends on: `GitExecutionOwner.close`/`reportExit`, the dialog's
`stop`/`wait`/finally, `produce`, the remaining CLI/worker consumers of
`interrupt()`/`close()`, `session-protocol` error encoding and `operation-scope`.
The source tree at `HEAD` (`7d85220`) is identical to the target. Later commits
change only records.

I did not change anything except this record.

### Verification performed

- `npm ci --offline`, `npm run check` and `npm run build` succeed.
- Running the five listed suites gives 93/93 passing under Node 22.13.1 and again
  under Node 26.11.0.
- Controlled capture: under Node 26.11.0 the post-change capture is byte-identical
  to the decompressed `baseline/capture.json.gz`. I also built `a549486` (source
  identical to `5db2cf1`) in a separate scratch worktree. Its pre-change capture
  under Node 26.11.0 is byte-identical to the committed baseline. This confirms
  that the baseline comes from pre-change code and that the comparison is
  meaningful. Under Node 22.13.1 the capture **differs**, but only in the recorded
  `node` runtime version and in `analysis-inputs` hashes derived from it. No other
  field differs (see F2).
- I ran my own experiments through the public `openApplication` boundary on the
  target and on the pre-change build:
  - E1: invalidation detected by the in-dialog validity check during an active
    dialog, with participant-close and attempt-report failures, followed by
    `interrupt()`/`close()` and another `execute`.
  - E2: abort while an invalidating change is pending, before final validation.
  - E3: signal-only abort with a participant-close failure that is never observed
    by a later close.
  - E4: completed request, then external signal abort, then idle close.
  - Each probe counted unhandled rejections.

  Results on the target:
  - E1: the request rejects `SessionInvalidated`; work and attempt are
    `invalidated`; `interrupt()` and `close()` reject with the same
    `SessionShutdownError` (`participant-cleanup`, `attempt-report`); a later
    `execute` rejects `SessionInvalidated`.
  - E2: `CommandInterrupted` / `interrupted`.
  - E3: `CommandInterrupted` / `interrupted`, with no unhandled rejection.
  - E4: clean close; work stays `completed`.

  Results on the pre-change build:
  - E1: the request rejects with the raw report `Error`; work is `defect`;
    shutdown is clean; a later `execute` reports `CommandInterrupted`, so the
    invalidation cause is lost.
  - E3: the request rejects with the raw participant `Error`; work is `defect`.
  - These results confirm that the correction was needed and that it changes
    observable behavior as intended.

### Assessment of requested focus areas

- **Request versus shutdown settlement; reentrancy; internal rejections.**
  Correct as far as I can determine.
  - `dispose` creates a single memoized `shutdown` promise before any synchronous
    abort dispatch, so reentrant `close()`/`interrupt()` from abort listeners
    observe the same promise. The reentrant-observer test confirms this.
  - The assessment waits only on internally fulfilled observations: the caught
    owner cleanup and `activeDone`. It never waits on the caller's request promise.
  - The request rejects as soon as the guarded run completes. The Git-deadline
    tests check `assessed === false` at request settlement.
  - Every internal promise (`shutdown`, `cleanup`, the signal route, `untilAborted`'s
    `stopped`, the dialog's `stopPromise`, Git `cancellation`) has a handler.
    E3 and the suite's signal routes show no unhandled rejection.
- **Distinguishable simultaneous failures.** Yes. Phases are tagged, original causes
  are retained in both `failures` and `AggregateError.errors`, and the same error
  instance is returned to repeated observers. Resource-cleanup ordering relative to
  request-phase failures is nondeterministic; the tests correctly compare sets. One
  pre-existing residual: `GitExecutionOwner.close` rethrows only the first rejected
  child, so if several owned children fail cleanup at once, one cause is reported.
  This is not introduced here and is unlikely with one active request.
- **Usage sealing; late replies and opening.** Correct:
  - `activeUsage` is cleared in the dialog's finally.
  - `onProgress` is suppressed after abort.
  - `untilAborted` discards a late `selectDialogAgent` result, so `open` is never
    reached; this is tested.
  - Missing measurements stay `reported: null`; this is tested.
- **Final validation; accepted attempts.** Correct:
  - Completion is fixed by `finishWork` only after the post-execution `check()`.
    `check()` now races `changed()` against the Session signal.
  - An abort during final validation yields `interrupted` work and leaves the
    accepted attempt's termination as `accepted`; this is tested.
  - `if (disposed) error = disposed` makes the first terminal cause authoritative
    over any later defect or I/O error.
- **First invalidation versus interruption; repeated and mixed calls.** Correct.
  E1 and E2 cover both orders during active work. See F1 for the undisclosed
  consequences and F3 for test strength.
- **Git ownership after a timeout; injected execution.** Correct and unchanged:
  - Owner close is memoized.
  - The cleanup deadline rejects with `CleanupIncomplete`.
  - The child stays in `#children` until exit; SIGTERM then SIGKILL escalation is
    tested.
  - Injected `runGit` creates no owner, and late injected results cannot alter
    finalized work; this is tested.
- **Ordinary callback policy; opening scope.**
  - Without an abort, dialog finalizer failures still propagate as the request error
    (the last failure wins, as with the earlier `try/finally`). `onWork` failures
    still throw. A later idle close is clean; this is tested.
  - Opening now calls `owner.close` directly rather than `dispose`. Because
    `GitExecutionOwner.close` is memoized, a signal-route dispose during opening and
    the opening catch observe the same cleanup promise. That cleanup's rejection
    still propagates from `openApplication`, so it is not concealed.
  - No resource escapes ownership: no Session is returned, and the owner is closed
    on every non-opened path.
  - The recorded acquisition-plus-cleanup masking is accurately described and was
    present before this change.
- **Remaining CLI/worker at this checkpoint.** The change does not regress them:
  - The worker uses injected `runGit` and never calls `session.close()` or
    `interrupt()`.
  - The CLI's `remote.close()`/`interrupt()` act on the worker transport, not on an
    application Session.
  - Raising `SessionShutdownError` instead of `CleanupIncomplete` from `close()`
    therefore has no current CLI consumer.

### Actionable findings

**F1 (moderate: disclosure and verification gap; may need human confirmation).
Invalidation now takes the terminal shutdown path, but nothing says so.**
In `session.ts`, `check()` now calls `dispose(SessionInvalidated)` when it detects
invalidation. Before this change it only released ownership and aborted the
controller. As a result, even without any `interrupt()`, signal or close:

- (a) owned Git cleanup starts at invalidation;
- (b) the dialog sees an aborted signal, so participant-close and attempt-report
  failures during an invalidated request become `TerminalFinalizationError`
  shutdown failures instead of request errors;
- (c) an `onWork` failure during finalization is likewise retained as `work-report`;
- (d) a later *idle* `close()` rejects with `SessionShutdownError` because of those
  request-time callback/participant failures.

E1 shows this. The behavior is in the spirit of "preserve the first established
terminal cause". It also fixes a real pre-change loss, where the request became
`defect` with the raw callback error and a later interrupt replaced the
invalidation cause. However:

- The handoff, the validation README and `docs/architecture/README.md` describe the
  terminal path only for `interrupt()`, signal abort and active close.
- The handoff states without qualification that "Ordinary request-local participant
  or callback failures do not by themselves make a later idle close fail".
- The accepted decision says "Protection of notifications is limited to
  terminal-abort finalization", so it is not clear the decision covers extending
  that protection to invalidation.
- No test exercises an active invalidated request with finalizer failures, or what
  later shutdown calls then report.

Recommendation, as the human decides:

- Either confirm that invalidation is meant to share terminal-finalization
  protection and early resource cleanup, then document it and add a matrix test
  through the direct boundary;
- or narrow notification protection to abort and leave invalidated-request
  finalizer failures request-local, while still preserving `SessionInvalidated`
  as the cause.

**F2 (low: evidence reproducibility). The capture comparison depends on the Node
runtime version, and neither the evidence nor the handoff records it.**
The capture embeds the `node` runtime version in method provenance, and
`analysis-inputs` identities hash it. The baseline was made with Node 26.11.0. The
handoff's reproduction commands, run under another runtime that `engines`
(`>=22.13.0`) allows, produce a non-identical capture: 2,480 differing diff lines,
all runtime version or derived hashes. A reviewer could mistake this for drift, or
be tempted to exclude identity fields, which the handoff correctly forbids.

Recommendation: record the exact Node version used for the baseline and every
comparison in `records/validation/cli-shell-retirement/README.md`, and in later
handoffs. The final integrated comparison should also state the runtime.

**F3 (low: test strength). The invalidation-ordering tests do not exercise ordering
during active work.**
`first established ${first} remains the terminal cause` in
`test/application-shutdown.test.ts` runs only against an idle Session. In the
`abort` variant the file change is never observed, so the assertion holds whatever
the ordering logic does. The matrix asks for invalidation versus abort ordering.
My E1 and E2 probes show that the implementation behaves correctly in both orders
during an active request. Still, the retained suite should hold this guarantee
before the CLI host and its tests are removed.

Recommendation: add active-request variants:

- invalidation detected mid-request (for example by the dialog's validity check),
  then `interrupt()`/`close()`: expect `SessionInvalidated`/`invalidated`;
- abort while an invalidating change is pending: expect
  `CommandInterrupted`/`interrupted`, with no later relabelling.

### Non-defect observations

- O1: `requestFinalized` makes active `close()` choose `SessionClosed` once
  `finishWork` has run. In the deferred publication scope (`withCliOperation`, used
  only by `interfaces/cli/application.ts`), `perform` finalizes work before the
  host's output and post-output validity check. A close during that window
  therefore uses `SessionClosed`, while `interrupt()` uses `CommandInterrupted`.
  This applies only to the CLI and is not reachable through the direct boundary.
  When `operation-scope`/`withCliOperation` is retired, remove the deferred path or
  confirm that the flag remains meaningful.
- O2: The shutdown assessment snapshots `shutdownFailures` when it settles. A
  failure pushed later would be lost. I found no path that pushes after
  `activeDone` resolves: the dialog finalizes synchronously before rejection, and
  progress after the abort is suppressed or captured inside the active run.
- O3: In `check()`, `disposed ?? new SessionInvalidated()` is redundant, because the
  preceding `alive()` already throws when `disposed` is set. It is harmless.
- O4: The `no overall deadline` limit means `interrupt()`/`close()` wait for the
  active run to finish. A participant that ignores abort cannot stall the run,
  because the dialog's `wait` races `stopPromise`. However, synchronous callbacks
  or compiler work can delay the assessment indefinitely. This is documented and
  accepted.

### Unverified areas and residual uncertainty

- I did not run the full retained suite, the authentication suite or any trial
  runner. The handoff scopes them to the final integrated review.
- I did not test hard interruption of synchronous compiler work, which is out of
  scope by design.
- Real child-process Git exit is covered only by the suite's substituted
  process-creation tests and by the unchanged `GitExecutionOwner` code I read. I did
  not run an end-to-end test with a real Git subprocess that outlives its cleanup
  deadline.
- I did not review the pending rendering-only disclosure correction, as instructed.
- I read the plan's "Verification contract" and the decision's `#terminal-abort`
  section in full. I did not reread the whole specification and core-concepts
  documents beyond the sections linked in the handoff.

### Gate recommendation

The checkpoint is substantially sufficient for the lifecycle prerequisite:

- The three shutdown routes share one assessment.
- The established terminal cause and accounting are preserved before settlement.
- Failures are distinguishable and observed internally.
- Git ownership semantics are unchanged.
- Controlled preservation holds on the recorded runtime.

I recommend proceeding with retirement **after** the human disposes of F1, either by
confirming the invalidation behavior with documentation and a test, or by directing
it narrowed. F2 and F3 should be corrected in the implementing task, before the CLI
host and its tests are removed. Neither needs a further full review round unless the
F1 resolution changes `session.ts` or `dialog.ts` semantics. This report does not
authorize task closure or merging; the final integrated review remains due.

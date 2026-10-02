# Execution-ownership cancellation diagnosis

Date: 2026-09-30
Starting revision: `6f16401` (milestone 2 accepted)
Runtime: Node.js 22.13.1
Scope: diagnose the deferred cancellation before milestone-3 live inference.

## Reproduction and cause

The first test starts a real child, starts the owner's 300 ms deadline, and then
awaits a promise resolved only by the child's stdout readiness announcement.
Deadline expiry destroys stdout and terminates the child. If readiness has not
arrived, the test can never leave that await, even though the owner's operation
has settled and its child has exited. A test timeout does not keep Node's event
loop alive. The remaining tests are cancelled by their parent.

This ordering and resolve-only readiness helper are identical at the historical
baseline `c15afdd3b03f588534ac386c2453c81da71ffb68`. A controlled reproduction
used the first test's original ordering and limits, changing only its child
program to delay installing the SIGTERM handler and announcing readiness:

```js
setTimeout(() => {
  process.on('SIGTERM', () => {});
  process.stdout.write('ready');
}, 2000);
setInterval(() => {}, 1000);
```

Run that modified first test with `node --test`, followed by an empty second test.
Keep its original `await harness.readiness` before awaiting the rejection and
registering the exit promise. Independently observe the child exit and the
already-installed `assert.rejects` promise. Captured results:

- Actual child exit: status null, signal SIGTERM.
- Owner operation: rejected with GitFailure / ETIMEDOUT; ownedChildren: 0.
- First test: cancelled after 310.239473 ms with `Promise resolution is still
  pending but the event loop has already resolved` / `ERR_TEST_FAILURE`.
- Second test: cancelled by parent; 0 passed, 0 failed, 2 cancelled.

This establishes a concrete test-harness defect reproducing the exact failure
signature while production ownership settles correctly. Historical runs did not
capture child-readiness timestamps, so attributing every historical occurrence
to this sequence remains an inference; those results are not retroactively
changed into passes. No production cancellation defect was found in this probe.

## Correction and regression

The escalation test now establishes a ready, SIGTERM-resistant real child before
starting the controlled owner deadline, and subscribes to exit before starting
the operation. This tests the intended escalation without depending on OS startup
completing within 300 ms. The shared readiness helper rejects on early exit or
spawn error instead of leaving a pending promise.

Two added regressions cover actual owner deadline expiry with a real child that
never announces readiness, checking timeout rejection, confirmed exit and zero
owned children; and readiness rejection when the fixture exits before announcing.
Production deadlines, termination policy and resource ownership are unchanged.

## Verification

- `npm run build`: passed.
- `node --test _build/test/execution-ownership.test.js`: 15 passed, 0 failed or
  cancelled (3.65 seconds).
- `node --test _build/test/*.test.js`: 371 passed, 0 failed, cancelled or skipped
  (128.03 seconds), with repository inputs unchanged throughout the run.

The diagnosed harness defect is corrected with regression coverage. This resolves
the deferred prerequisite for continuing milestone 3; it does not claim universal
cancellation correctness, remote inference cancellation, or knowledge of timing
that the old logs did not capture. Include this evidence and that historical limit
in the milestone-3 review handoff.

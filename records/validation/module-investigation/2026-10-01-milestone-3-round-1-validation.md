# Milestone 3 round 1: final offline verification remains unresolved

Recorded: 2026-10-01. Target: `4a0a334` on `codex/module-investigation`.
Command: `npm test`, from the PostCode root with Node 22.13.1 and the pinned
TypeScript 6.0.3. Local loopback permission was granted for offline OAuth callback
tests. No real provider inference was part of this suite.

Result: **424 tests; 410 passed, 9 failed, 5 cancelled, 0 skipped.** The test runner
reported **4,251,441.929 ms** (about 70.86 minutes). Build completed before tests.
The full [raw output](2026-10-01-milestone-3-round-1-suite.tap.txt) is preserved;
[structured verification](pass-02/verification.json) lists the exact affected test
names, locations, failure types and durations.

Tracked worktree status was empty immediately before and after the run. No
repository edits, assessment requests or role-agent writes occurred during it.
This removes those known interventions; it does not prove that all runtime inputs
or resource availability were stable.

## Affected tests and observations

| File | Affected test numbers in raw output | Observed failure |
| --- | --- | --- |
| `test/benchmark-analysis.test.ts` | 6 | Child process timeout |
| `test/cli.test.ts` | 42 | Expected success, received exit 2 |
| `test/commands.test.ts` | 81 | Shell test timeout |
| `test/compiler-candidate-paths.test.ts` | 82 | Session input verification invalidated |
| `test/dependency-presentation.test.ts` | 127 | Session input verification invalidated |
| `test/execution-ownership.test.ts` | 184, 185 | Worker opening/validation interruption test timeouts |
| `test/investigation.test.ts` | 282 | Session input verification invalidated |
| `test/organization-cli.test.ts` | 306 | Empty/truncated JSON output |
| `test/session-inputs.test.ts` | 388 | Session input verification invalidated |
| `test/session.test.ts` | 396 | Expected success, received exit 2 |
| `test/shell.test.ts` | 404, 405 | Shell test timeouts |
| `test/source-disclosure.test.ts` | 411 | Session input verification invalidated |

Durations of several nominal 10/30-second timeout tests are much longer than their
limits, and failures span unrelated areas. Timing/suspension/resource effects are
possible explanations, not established causes. No system sleep history, resource
trace or controlled reproduction was captured, so this run is not dismissed as
an environmental flake. Nor is it attributed to the previously diagnosed
execution-ownership readiness race without new evidence.

## Historical checks remain distinct

- At `79a33bb`, the complete suite passed 424 tests with no failures/cancellations
  in 146.90 seconds. That preceded the adjacent final-call status check in
  `a1c1f04`, which passed its 25 focused adapter tests.
- The focused authentication/adapter run passed 45 tests with loopback permission;
  the initial restricted attempt had 42 passes and 3 callback failures. The
  discovery/ledger run passed 14 tests. See the [disposition](../../reviews/module-investigation/2026-09-30-milestone-3-disposition.md).
- The earlier [ownership diagnosis](2026-09-30-execution-ownership-diagnosis.md)
  and historical cancelled suites remain preserved. Neither isolated success nor
  an earlier complete pass changes the result of this final integrated run.

No timeout or validation rule has been relaxed, and no rerun has been used to
replace this evidence. Final verification is **qualified by unresolved failures
and cancellations**, not a fully passing suite. A bounded offline diagnosis and
controlled rerun have been proposed to the human. Until a disposition arrives,
no further implementation or live assessment is inferred from this record.

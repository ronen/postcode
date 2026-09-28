# Foundation readiness M3 acquisition/lifetime review: round 1 findings

Record type: findings
Received: 2026-09-28
Reviewer: Claude Code (Claude Opus 5.5), independent agent session arranged by the human
Handoff: [2026-09-28-m3-acquisition-lifetime-handoff.md](2026-09-28-m3-acquisition-lifetime-handoff.md)
Round: 1
Reviewed target: `4656a34c0847c82d9f830a9d1587a2a28f2dd138` (scope `ecb9f6b81cc11c392acad2546002520af82bdb91..4656a34c0847c82d9f830a9d1587a2a28f2dd138`)

## Returned findings

### Scope and method

This round reviewed packages 4–5 as assigned by the handoff. Commit `88657df`, which
follows the target, adds only the handoff, so it is not part of the implementation
under review.

I read the complete source diff in the stated range:

- `git-execution`, `execution-errors`, `output-boundary`, `session-protocol`,
  `session`, `session-worker` and `interactive-session`;
- repository capture, compiler inputs and project opening;
- the observation sink, command execution, CLI and shell;
- the new focused tests, the changed scripts and the M3 validation record.

I checked the implementation against these accepted decisions:

- generated-output boundaries;
- execution ownership and cancellation;
- local observation acceptance.

I also built the target and the range baseline `ecb9f6b` in separate disposable
detached worktrees and ran native probes against both builds. The main repository
checkout was not modified except for this record.

### Actionable findings

**F1 (medium): unresolvable ordinary compiler probe paths now refuse opening. The
refusal is also attributed to the configuration file.**

`captureInputs` now uses `policy.excluded`
([`src/lib/output-boundary.ts`](../../../src/lib/output-boundary.ts),
`excluded(name)`). Whenever any boundary is configured, it calls
`livePath(name)` for **every** path the compiler host probes. Both CLI entry paths
always configure `_observations` and `_build`. `livePath` rethrows every error
except `ENOENT`/`ENOTDIR`, so an `ELOOP` or `EACCES` from a module-resolution
probe escapes the compiler host callback. `openSession` classifies it as
operational and returns `project-open-failed`, with `path: options.configPath`.

The M2-era resolver used `ts.sys.fileExists`/`ts.sys.realpath`. Those calls treat
such paths as absent, which is also what the compiler itself concludes.

I reproduced this natively. Each project has a committed Git repository,
`src/a.ts` importing a package, and `module: nodenext`.

| Probe path state | Baseline `ecb9f6b` | Target `4656a34` |
| --- | --- | --- |
| `node_modules/cyc -> cyc` (self-link) | Opens; exit 0, 2 modules | `Project open failed: project input acquisition: …/tsconfig.json: ELOOP: too many symbolic links encountered, realpath '…/node_modules/cyc'`; exit 2 |
| `node_modules/locked` mode `000` | Opens; exit 0 | `Project open failed: project input acquisition: …/tsconfig.json: EACCES: permission denied, realpath '…/node_modules/locked/package.json'`; exit 2 |
| Dangling `node_modules/gone` link | Opens; exit 0 | Opens; exit 0 (correct) |

The generated-output decision requires refusal when an *explicit boundary* cannot
be established. Here the boundaries resolved; only an unrelated candidate path
failed to resolve. The validation record describes cyclic refusal only for the
boundary itself. No test covers a cyclic or unreadable ordinary input.

A path that cannot be resolved also cannot be read by the compiler. It therefore
cannot bring generated output into evidence, so refusal is neither required by the
decision nor safer. The same error surfaces in other phases:

- During validation replay, a probe closure that newly fails invalidates the
  session.
- During execution, it becomes an expected analysis failure (exit 3).

The reported `path` names the configuration rather than the failing probe path,
which is misleading.

Suggested direction: keep boundary-resolution failures as refusals. For a
*candidate* path whose live resolution fails operationally, preserve the compiler's
absence semantics. For example, treat the candidate as not present or as excluded.
Keep replay able to detect a later change for that probe, because an excluded
result currently records no probe. Add fixtures for a cyclic and an unreadable
`node_modules` entry. If a candidate-path operational failure is still reported,
name the failing path rather than the configuration.

### Non-defect observations

- **Execution ownership traced end to end.**
  - `GitExecutionOwner` keeps each child registered until `exit`.
  - Timeout, output-limit, stdin and post-spawn errors wait for confirmed exit
    before rejecting.
  - `close()` rejects the operation immediately and reports cleanup separately.
  - An unconfirmed child leaves the owner disposed and the child owned, and later
    `close()` reports `CleanupIncomplete`.
  - Worker disposal closes the parent-held Git owner independently of worker
    termination.
  - Stale or mismatched replies and late Git results are dropped once `ended` is
    set or the operation id differs.
  - Failed sends and close-while-pending settle the pending operation once.
  - In the direct path, the `AbortSignal` interruption awaits child cleanup
    before rejecting.
- **Qualification mappings match the ownership decision.**
  - A confirmed Git timeout becomes `capture-failed` unavailable evidence with a
    stable operation/code and no PID or duration.
  - A `CleanupIncomplete` during opening is surfaced rather than degraded.
  - During validation it invalidates, and closing reports it separately.
  - Interruption stays 130 with a separate cleanup warning.
- **Publication follows the accepted acceptance point.**
  - The sink writes a closed, private staging file and publishes it with a
    no-overwrite `link`.
  - `published` is set only after the link succeeds.
  - Cleanup failure after the link yields an accepted acknowledgement with a
    distinct warning; before the link it yields non-acceptance, and only owned
    staging is removed.
  - The whole observation root remains excluded.
  - Grouping is bound to the resolved configuration path at sink construction,
    so batches without views group correctly.
  - The sink hashes `path.resolve`, not the real path, so a configuration reached
    through a symlinked directory groups separately. This is harmless but worth
    knowing.
- **Async propagation.** I found no un-awaited `openSession`/`captureRepository`/
  `openTypeScriptProject`, `check`, `execute` or `close` calls in `src`, `test` or
  `scripts`. Retained repository serialization (`repositoryBasis`), primitive
  probe comparison and the `inactivePolicy` parent walk preserve the previous
  semantics as far as I traced them. Both method bumps (`observed-inputs@4`,
  `repository-inputs@4`) correspond to real policy changes.
- **Hung Git costs one full deadline per phase.** With a Git that ignores SIGTERM
  and never exits, a one-shot `modules` command completed correctly: exit 0, the
  view was published and no Git remained. It took about 123 s, because opening and
  each of the three publication checks recapture the repository and each waits the
  full 30 s deadline. The limits table states that there is no aggregate budget, so
  this is within the decision, but the user-visible latency multiplies with
  validation phases.
- **Early Git failure with large stdin reports EPIPE, not the Git status.** When
  Git exits before reading its input, the `stdin` error can win over the exit
  status. With 1 MiB of input to a child exiting 128, the result was
  `GitFailure('git input', 'EPIPE')` in 10/10 runs. With 64 bytes it was status
  128 in 10/10. Both map to `capture-failed`, so qualification is unaffected; only
  the recorded operation/code differs. Previous `spawnSync` behaviour was similar,
  so this is not a regression.
- **Parent termination by signals other than SIGINT is outside the guarantee.**
  Ownership lasts only as long as the owning process. My first harness killed the
  CLI with SIGTERM, which left an orphaned fake `git` that ignores SIGTERM. The CLI
  installs only a SIGINT handler. This is consistent with the stated limits, and
  M2's `spawnSync` had the same exposure, but it is not recorded explicitly.
- **Case-insensitive missing suffixes.** On a case-insensitive volume, `livePath`
  keeps a missing suffix's caller spelling, and `within` compares case-sensitively.
  A boundary whose nonexistent suffix differs only in case from a later probe
  spelling would not match. This is an untested niche case, not a demonstrated
  defect.

### Verification performed

- `npm run check` and `npm test` at `4656a34` in a detached worktree: type check
  passed; **276/276** tests passed, with zero failures, skips or cancellations.
- `scripts/probe-compiler-interruption.mjs` reproduced:
  - the control run exited 0 and published;
  - the interrupted run published no view and exited 130;
  - signal-to-exit was about 18 ms in this run.
- A native one-shot CLI used a fake `git` on `PATH` that ignores SIGTERM and never
  exits:
  - SIGINT during opening gave exit 130 and `Command interrupted; session ended.`,
    and the fake Git process was gone.
  - With no signal, the run gave exit 0, a published view, unavailable repository
    capture after the timeouts, no surviving child and a private (0700/0600)
    staging-free observation directory.
- A direct `openSession` with an `AbortSignal` aborted during Git opening rejected
  with `CommandInterrupted` after about 250 ms, and the child had exited.
- A real asynchronous missing-executable spawn gave `GitFailure('git executable',
  'ENOENT')`, left no owned children and produced `git-unavailable` capture
  evidence. The existing test injects only a synchronous throw.
- The F1 reproductions above compared the baseline and target builds.

### Unverified areas and residual uncertainty

- I did not rerun the aligned M2/M3 or same-source comparisons, the 288 session
  comparisons, the session journey or the profiler. I relied on reading the scripts'
  async changes.
- There was no native Linux, Windows or network-filesystem testing, and no
  unsupported-hard-link filesystem. Only the injected failure was reviewed.
- I did not natively reproduce a worker `terminate()` that never settles, or a real
  `unlink` failure after publication. Only the injected tests were reviewed.
- I checked Node's message-before-`exit` ordering for a worker that closes its port
  after a failed opening only by reasoning, not by stress testing.

### Compatibility with later investigation

The parent-held owner survives disposal of compiler computation. It is scoped to
one session or CLI invocation. It implies no investigator, universal scheduler,
persistent session or descendant supervisor, and the stated evidence guarantees are
not strengthened. I saw nothing that would block the investigation boundary.

### Recommendation

M3's ownership, qualification and publication work is sound as reviewed. I
recommend correcting **F1** before the human treats M3 as satisfied. It is a
user-visible regression: projects that opened at the baseline now fail to open
through both CLI entry paths. The fix is narrow, but it changes opening and
validation outcomes, so a short further round on the correction is warranted. The
remaining items are observations only. Human acceptance of M3 is not inferred.

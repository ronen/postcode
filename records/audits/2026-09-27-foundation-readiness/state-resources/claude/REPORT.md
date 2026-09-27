# Audit: State Consistency, Resource Lifetimes, and Supporting Tests

Date: 2026-09-27
Auditor: Claude (Opus 5.5), at the request of the human directing PostCode
Baseline: `main` at `5c04869`, with the uncommitted working-tree revision of `dev/engineering-guidelines.md`
Status: audit only. No product code, tests, documentation, or process files were changed.

## 1. Purpose and scope

`dev/engineering-guidelines.md` gained a *State and resource lifetimes* section and stronger testing guidance after most of the current code was written. This audit checks the existing code against three parts of that guidance:

1. **State consistency.** Where the code keeps several representations of the same state (copies, derived values, caches), is one of them authoritative? Are the update and invalidation rules explicit? Are intentional historical snapshots distinguishable from copies that must track later changes?
2. **Resource lifetimes.** Do workers, subprocesses, files, temporary directories, and similar resources have explicit owners? Are they cleaned up after failure, cancellation, and partial initialization, as well as after normal completion?
3. **Supporting tests.** Do the tests exercise those failure paths and consistency guarantees, or do they mostly confirm that the normal path succeeds?

The audit covered all of `src/` (about 5,500 lines), every test file under `test/`, and the resource-handling parts of `scripts/`. The relevant governing context was also read: `docs/implementation-conventions.md` (especially *Accumulation and interactive execution*), `docs/cli-reference.md` (interruption and input stability), and the workflow's unexpected-findings process.

Each finding is labelled with one of three evidence levels:

- **Demonstrated.** Reproduced by an experiment in `experiments/`, or directly evident from the code with no remaining uncertainty.
- **Potential risk.** A plausible failure path found by reading the code but not reproduced. The report states the conditions it needs.
- **Observation.** Conformant or intentional design, recorded so later readers don't have to re-derive it.

## 2. Summary

Overall, the code base does well on **state consistency**. The immutable, validated record store is the authoritative representation. Every cache above it is either a memo of a deterministic function of immutable records, or it is guarded by an explicit, documented input-revision rule. Intentional snapshots are deliberate and documented: first-observed inputs, first-established claim support, and earlier evaluation attempts that are kept rather than overwritten. No case was found of a cache returning stale or divergent state. The one confirmed divergence is between two independent implementations of the same exclusion-path policy. It is an edge case and fails safe.

**Resource lifetimes** are mostly well structured: `try`/`finally` ownership in the shell and CLI, one owner for the worker, and temporary directories cleaned up in `finally`. The most significant finding is that **Ctrl-C cannot promptly end a session while the worker is blocked in a synchronous `git` subprocess** (demonstrated). The exposure is larger than it looks because every shell command runs three full repository recaptures of about 13 `git` calls each. There is also no timeout on those calls.

**Tests** do check consistency and reuse thoroughly. The most important test finding is that **assertions placed inside observation-sink callbacks cannot fail a test**, because the production code turns sink exceptions into warnings (demonstrated). Several shell and publication assertions are therefore ineffective. In addition, the shell's worker failure paths have no automated tests: active interruption, unexpected worker exit, and open failure through the worker. Active interruption is only exercised by a manual probe script.

### Prioritized recommendations

| Priority | ID | Recommendation | Size |
|---|---|---|---|
| 1 | T1 | Move assertions out of sink callbacks, or make the test sinks record failures and rethrow them afterwards. Re-verify the affected tests. | Small |
| 2 | R1 | Bound synchronous `git` calls with a `timeout` that maps to the existing capture-failure path. Record the remaining cancellation latency. | Small |
| 3 | T2 | Add automated tests for the worker failure paths: interruption while busy, interruption during opening, unexpected worker exit, and open failure through the shell. | Medium |
| 4 | R3 | Make local observation writes all-or-nothing (temporary file plus rename, or unlink on failure), and test a failing real sink. | Small |
| 5 | S2 | Make compiler-input and repository-capture exclusion resolution agree (one shared resolver, or at least a cross-check test). | Small–medium |
| 6 | S3, S4 | Share the operational error-code classification. Make `recordModuleEvaluation` write in a single `put`. | Small |
| 7 | R2, S5, T5 | Optional cleanups: the unused worker `close` message, parallel reuse maps that could be derived from the store, and temporary-directory acquisition in tests. | Small |

R1's broader cost issue (three full recaptures per shell command) involves the documented input-stability contract. Changing its frequency is a separate design question, not a local fix (§4, R1).

## 3. State consistency

### S1. Inventory of maintained state: largely conformant (Observation)

The table lists every place where state is kept alongside the authoritative record store.

| State | Location | Authoritative source | Update / invalidation rule | Assessment |
|---|---|---|---|---|
| Record store | `memory-store.ts:57-326` | Itself | Immutable. `put` validates the whole batch before committing any of it (`:61-325`). Collisions are rejected (`:66`). | Authoritative. Atomic. Tested (`test/session.test.ts:89-108`, `test/records.test.ts`). |
| First-observed filesystem probes | `typescript/inputs.ts:35-44` | The filesystem at first observation | Never updated. `changed()` replays probes and invalidates the session (`:64-73`). | **Intentional snapshot.** Documented in `docs/cli-reference.md` (*Input stability*). |
| Acquisition revision | `inputs.ts:63` (`observations.size`) | Derived | Derived on demand. Append-only. | Correctly derived rather than stored. |
| Discovery result caches (`results`, `expansionCache`, `compositionCache`, `dependencyCache`) | `typescript/project.ts:175-184, 343-361` | Deterministic compiler output plus inputs | Complete results are kept permanently. Partial results are keyed to the revision at which they were produced and retried once new inputs are acquired (`:176-178`). | Explicit and documented (*Accumulation and interactive execution*). Tested (`test/session-inputs.test.ts:237-262, 329-383`). |
| `core` module population | `project.ts:174, 327, 342` | Program (fixed per session) | Computed once per store. | Sound: the program never changes within a session. |
| Claim-context input support (`support`) | `project.ts:182, 333-341` | Store (`claim-context.inputs`) | Set only after a successful `put`. The first basis wins. | **Intentional snapshot** ("A repeated claim keeps the input basis on which it was first established"). It duplicates a store field; see S5. |
| Evaluation reuse (`retained`) | `evaluation.ts:30, 40-59` | Store | The key is the full result content, plus `retryBasis` when the result is partial. Only complete or retry-based outcomes are cached. | Sound. Earlier partial attempts are kept as intentional history (tested at `test/session-inputs.test.ts:102-125`). |
| Organization and dependency-organization reuse | `session.ts:86-98` | Store (deterministic record IDs) | Only complete outcomes are cached. Recomputing a partial outcome produces the same ID and content, which `put` accepts. | Sound but redundant; see S5. |
| Entity reference bindings | `identity.ts:48-66`, `memory-store.ts:328-338` | Itself (append-only) | Never rebound. | Intentional. Tested (`test/session.test.ts:138-150`). |
| Session `invalid` latch | `session.ts:52-63` | Derived from `changed()` | Latches permanently. | Intentional (no silent reopening). |

Two points in this area are especially good. The code comment at `session.ts:102` and the convention "Do not add outer module/dependency caches that hide this check" show that cache layering is considered explicitly. And earlier partial outcomes are kept as history instead of being replaced.

### S2. Two independent exclusion resolvers disagree for a dangling-symlink output directory (Demonstrated; low impact)

The same policy, "exclude these generated-output directories", is resolved in two places:

- `typescript/inputs.ts:8-19, 20-34`, for compiler inputs. It walks up to the nearest ancestor that exists according to `ts.sys.fileExists`/`directoryExists`, which follow symlinks, then applies `ts.sys.realpath`.
- `repository/capture.ts:107-124`, for repository evidence. It walks up to the nearest ancestor that exists according to `lstat`, which does *not* follow symlinks, and resolves links by hand.

Both results are recorded as evidence: `analysis-inputs.value.inputs.exclusions` and `repository-evidence…excludedOutputDirectories`. `experiments/exclusion-resolver-divergence.mjs` configures an output directory `out` as a symlink to a target that doesn't exist yet:

```
compiler-input exclusion real paths: ["out"]
repository exclusion real paths:    ["elsewhere/target"]
after target creation: compiler inputs exclude elsewhere/target/generated.ts: false
inputs.changed() after target creation: true
```

So the two recorded exclusion sets disagree, and for this configuration compiler inputs and repository evidence would classify files under the link target differently. **Practical impact is low and fails safe.** Once the target is created, `inputs.changed()` notices that the output boundary was retargeted and invalidates the session. PostCode's own sink can't create the target: a recursive `mkdir` through a dangling link fails with `ENOTDIR`, which surfaces as a visible observation warning. Only an external process can trigger the invalidation.

This is the situation the new guidance describes: two representations of one policy, with no stated rule for keeping them consistent. The guidance on sharing "classifications and validation rules" also applies.

**Recommendation.** Before consolidating, establish whether the two resolvers are meant to be semantically equivalent. Capture deliberately avoids following links outside the provider, so there may be a meaningful difference. Then do one of the following:

- Resolve exclusions once, for example in the caller that already supplies `excludedOutputDirectories`, and pass the resolved pairs to both consumers.
- Keep both resolvers, and add a test asserting that they agree on the symlink cases already present in `test/repository.test.ts:201-214` and `test/session-inputs.test.ts:190-205`.

### S3. Repeated classification rules (Demonstrated duplication; low risk)

- The operational error-code list `['EACCES','EPERM','ENOENT','ENOTDIR','ELOOP','EIO','EMFILE','ENFILE']` appears in both `session.ts:24-25` and `repository/capture.ts:35`. The two lists decide the same thing: whether an I/O failure is an expected operational condition or a defect. If one list gains a code and the other doesn't, the same condition becomes a qualified result in one path and an internal failure in the other.
- A "complete outcome" predicate is defined separately in `session.ts:88`, `project.ts:184`, `organization/evaluate.ts:7`, `evaluation.ts:39` (inline), and `dependencies/organization.ts:8`. The last one also requires `availability === 'available'`. The difference may be intentional, but it isn't stated.

**Recommendation.** Export one named predicate for operational I/O errors and use it in both places. For the completeness predicates, check equivalence first. Share the four identical ones if that's natural, and add a comment explaining why the dependency-organization variant differs. Don't merge it with the others.

### S4. `recordModuleEvaluation` writes one logical outcome in two `put` calls (Potential risk; low)

`evaluation.ts:50-54` stores the module evaluation first and its expansion evaluations in a second `put`. If the second `put` throws, which only happens when a store invariant is violated (a defect), the store keeps an evaluation whose expansion records are missing. Because the outcome wasn't cached, the next call records a new `attempt` number (derived by counting at `:43-44`). Every other evaluator (`organization/evaluate.ts:172`, `dependencies/organization.ts:161`, `project.ts:331`) writes its records in one atomic batch. The store's batch validation already supports mutually referencing records, so nothing prevents a single `put` here.

**Recommendation.** Combine the two writes into one `store.put([outcome, ...expansions])`. Because the path is defect-only, the value is mainly consistency with the store's atomicity contract.

### S5. Redundant state that could be derived (Observation; optional)

- The `organizationOutcomes` and `dependencyOrganizations` maps (`session.ts:86-98`) cache records whose IDs can be computed deterministically from their inputs (`organization/evaluate.ts:22`, `dependencies/organization.ts:26`). They are currently correct, because recomputation is deterministic and `put` is idempotent for identical content. They could be replaced by a store lookup by ID, which would make the store the only source.
- The `support` map (`project.ts:182`) duplicates `claim-context.inputs` values that are already in the store.

Neither is a defect, and both are explicitly bounded to the session. Treat these as simplifications to consider when the code is next touched. They don't need a dedicated task. A store lookup would need a non-throwing `has` or `find` on `ProgramRecordStore`, which is an interface change.

## 4. Resource lifetimes

### R1. Ctrl-C during synchronous `git` capture blocks until `git` exits, and capture has no timeout (Demonstrated; medium)

The shell runs analysis in a worker so that Ctrl-C can terminate compiler work (`interactive-session.ts:56-60`). That works for JavaScript execution, and `scripts/probe-session-interruption.mjs` verifies it for the type checker. Repository capture, however, calls `spawnSync('git', …)` with no timeout (`repository/capture.ts:46-47`). `Worker.terminate()` can't interrupt a thread blocked in a synchronous native call.

`experiments/worker-termination-during-git.mjs` puts a fake `git` that sleeps 6 s on `PATH` and interrupts the session while the worker is still opening:

```
opening settled as {"rejected":"CommandInterrupted"} after 0 ms
worker.terminate() resolved after 5542 ms
```

The parent rejects the pending operation immediately, but termination waits for the blocking child to finish. `runShell` awaits `remote.close()` in its `finally` block (`shell.ts:87`), so the process doesn't exit until `git` returns. With a `git` that hangs indefinitely (a slow network filesystem, a hook, or a misbehaving `fsmonitor`), Ctrl-C prints its message and then hangs.

Mitigation, inferred from the code but not verified: the `finally` block removes the SIGINT listener and closes readline before awaiting, so a second Ctrl-C would probably fall through to Node's default SIGINT handling and kill the process.

The exposure is larger than it first appears, because capture isn't only an opening step:

- `changed()` recaptures the whole repository on every validation (`project.ts:105-107`).
- A shell command runs three validations (`docs/cli-reference.md`, *Input stability*; tested at `test/session-inputs.test.ts:263-291`).
- One capture of this repository runs 13 `git` processes (2 `rev-parse`, 5 `config`, 1 `ls-files`, 4 `check-ignore`, 1 `--version`), measured with a logging `git` wrapper. That makes about 39 blocking subprocesses per shell command, and each one is a window in which interruption isn't prompt.

**Recommendation (proportionate).**

1. Pass a `timeout` (and `killSignal`) to `spawnSync`. A timeout already surfaces as `result.error`/`result.signal`, which `capture.ts:48-52` maps to `CaptureFailure`. At opening that means repository evidence becomes unavailable; during `changed()` it means the session is invalidated. Both are existing, qualified outcomes, so this change needs no new design decision.
2. Document the remaining cancellation latency next to the interruption behavior in `docs/cli-reference.md`. That document currently says only that Ctrl-C "terminates the worker and ends the session".
3. Treat how often recapture runs as a separate question. It is part of the documented input-stability contract, so reducing it (for example, cheaper change detection before a full recapture) would change guarantees and belongs in a decision or plan, not a local fix. It is also relevant to the guidelines' new *Processing cost* section.

### R2. The worker's `close` message is never sent (Demonstrated; low)

`session-worker.ts:15-17` handles `{ type: 'close' }` by closing the session and the port. The parent never sends that message: `interactive-session.ts:61-64` always terminates the worker, and no test or script sends it either. Termination is the actual ownership rule and it is sound, because terminating discards all worker state. The unused branch suggests a graceful shutdown path that doesn't exist.

**Recommendation.** Remove the branch, or send it before terminating if graceful close is wanted. Per the guidelines' *newly unused* rule, first confirm that the path isn't part of an intended protocol.

### R3. The local observation sink can leave a truncated batch file (Potential risk; low–medium)

`observations.ts:61-63` writes directly to the final file name with `writeFile(..., { flag: 'wx' })`. If the write fails partway (for example `ENOSPC`, `EIO`, or the process being killed), a partially written `timestamp=…json` file stays in `_observations/`, looking like a valid batch. The failure is reported as a warning (`command-execution.ts:14-21`), but the file isn't cleaned up. Readers of the observation stream (the research project) would see malformed data that has no marker. Not reproduced; it requires a mid-write I/O failure.

**Recommendation.** Write to a temporary name in the same dated directory and `rename` it into place (keeping mode `0600`), or `unlink` the partial file in a `catch`. Temporary plus rename keeps acquisition and cleanup structurally together, which is what the guideline asks for.

### R4. Lifetime structure that is sound (Observation)

- **One-shot CLI.** `cli.ts:32-36` closes the session in `finally`. `openSession` acquires nothing that needs release before it returns.
- **Shell.** The SIGINT listener, readline, and worker are all released in `finally` (`shell.ts:84-88`). An open failure, an interruption during opening, and an open failure through the worker all return through that block. The worker is created just before `try` (`shell.ts:16` vs `:30`); the only statement in between is `process.on`, so there is no practical leak.
- **Worker.** Unexpected `error` or `exit` rejects the pending operation and marks the session ended (`interactive-session.ts:32-36`). Replies that arrive after an interruption are ignored.
- **In-process sessions.** `close()` only drops references (`session.ts:81`). All compiler state is memory owned by closures. That matches the documented transient-session lifetime ("closing releases session state").
- **Test temporary directories.** Almost every test creates its directory and removes it in `finally` (see T5 for the exceptions).
- **Scripts** (development tools; low stakes). `scripts/compare-session-requests.mjs:23,44` creates two workers in one statement and closes them one after another in `finally`, so a failure creating or closing the first would leak the second. This is worth fixing only when the script is next touched.

## 5. Supporting tests

### T1. Assertions inside observation-sink callbacks cannot fail tests (Demonstrated; medium)

`submitObservation` (`command-execution.ts:14-21`) deliberately catches every exception from `sink.submit` and turns it into `WARNING: observation not recorded: …` on stderr. That behavior is correct for production. The side effect is that an assertion placed inside a test sink's `submit` is also caught: the command and the test both succeed. `experiments/sink-assertions-swallowed.mjs` demonstrates this:

```
exit code: 0
stderr warning line: WARNING: observation not recorded: deliberately failing assertion inside sink\u000a\u000a1 !== 2\u000a
```

Affected assertions:

| Location | Assertions that cannot fail | Compensating outer check |
|---|---|---|
| `test/shell.test.ts:98-99` | The ambiguous in-shell lookup matches several subjects, and the in-shell view equals the one-shot view. | Only `count === 2`. The equivalence check, which is the point of the test, is **fully ineffective**, and `stderr` is discarded. |
| `test/shell.test.ts:120-121` | The command number is 1, and a view was produced. | `count === 1` and exit code 0. The view-produced check is lost. |
| `test/session-inputs.test.ts:151-155` | View presence, rendered-output equality, invalidation event, and absence of source escape, before and after output. | `code === 2` and `/invalidated/` on stderr. The warning text would not break that regex. |

The equivalent worker test (`test/session-inputs.test.ts:316-323`) does this correctly: it captures the batch in the sink and asserts afterwards.

**Recommendation.** Follow that pattern everywhere: collect batches in the sink and assert after the command completes. For shell tests that must drive input from inside the sink, record any error in a variable and rethrow it after `runCli` resolves. A shared test sink that also asserts no `WARNING` reached stderr would stop this recurring.

**Current state verified.** In a scratch copy of the build, `submitObservation` was instrumented to print any `ERR_ASSERTION` it catches. `test/shell.test.ts` and `test/session-inputs.test.ts` were then run against that copy. All 29 tests passed and no sink assertion failed, so the swallowed assertions hold today and no product defect is hidden behind them. The instrumentation's output was confirmed visible through the test runner. The finding is therefore about test effectiveness: these checks would not catch a future regression.

### T2. Worker failure and cancellation paths lack automated tests (Demonstrated gap; medium)

| Path | Code | Current coverage |
|---|---|---|
| Ctrl-C during an active command (worker terminated, `command-interrupted` recorded, exit 130) | `shell.ts:21-23`, `interactive-session.ts:56-60`, `command-execution.ts:38-40` | Manual `scripts/probe-session-interruption.mjs` only. The unit test at `test/shell.test.ts:128-153` uses a substitute that throws `CommandInterrupted`. |
| Ctrl-C during opening (returns 130, no prompt) | `shell.ts:32-36` | None |
| Interruption after output ("Session interrupted after command output") | `shell.ts:72-79` | None |
| Worker crash or unexpected exit during a command (defect, exit 1, session ends) | `interactive-session.ts:32-36`, `session-worker.ts:23` | None |
| Project-open failure through the worker (exit 2, diagnostics) | `shell.ts:37-40`, `session-worker.ts:9-11` | One-shot only (`test/cli.test.ts:108-115`) |
| Concurrent command rejection | `interactive-session.ts:40` | None (defensive) |

The guidelines now explicitly allow controlled substitutes when real collaborators make failure states hard to exercise. Proportionate options:

- Promote the core of `probe-session-interruption.mjs` into a test. It already drives the production readline, worker, and observation path, and it runs in seconds.
- Test open failure through the shell with a nonexistent or broken config. This is cheap: `test/shell.test.ts` already builds TTY-like inputs.
- For worker crashes, a fixture that triggers a worker-side defect may not exist. The alternative is a narrowly scoped test seam in `interactiveSession` (for example, an injectable worker URL). That seam is a small design choice and should be agreed before it is added.

### T3. The real local sink's failure behavior is untested (Gap; low–medium)

Sink failure tests (`test/cli.test.ts:96-106`, `test/organization-cli.test.ts:213-226`) use substitute sinks that reject or throw. Nothing checks that `localFileObservationSink` itself reports a failure, for example on a read-only or non-directory destination, and leaves no partial file. Add such a test together with the R3 change.

### T4. No test checks that the exclusion resolvers agree (Gap; low)

See S2. Each resolver is tested separately, but nothing asserts that the two recorded exclusion sets agree.

### T5. Temporary-directory acquisition outside `try` in two tests (Demonstrated; low)

`test/session-inputs.test.ts:265-273` and `:132-138` create a temporary directory and then open a session, which may `throw`, before entering the `try` whose `finally` removes the directory. If opening fails, the directory leaks. `docs/implementation-conventions.md` requires ephemeral test projects to be cleaned up. Move the `try` to directly follow `mkdtempSync`, or reuse the `temporary()` helper at the top of the same file.

Separately, `test/cli.test.ts:15`, `test/organization-cli.test.ts:33`, and `test/dependency-presentation.test.ts:13` each define a near-identical `invoke` helper. Under the guideline to look for existing test assets, a shared helper would be the natural place for the T1 safeguard.

### T6. Consistency guarantees that are well tested (Observation)

The main consistency contracts have tests that distinguish correct behavior from plausible defects, not just the successful path:

- Immutability, collision rejection, and that an invalid record is not stored (`test/session.test.ts:89-108`).
- Earlier incomplete outcomes and projections are kept after a later complete evaluation (`test/session-inputs.test.ts:102-125`).
- Partial work is reused until new inputs are acquired, then re-attempted while the earlier basis is kept (`:237-262`, `:329-383`, `:32-60`).
- Invalidation for each change class (source, configuration, resolution, population, repository, environment) (`:61-86`), and operational errors that force a stability check (`:206-234`).
- Retargeted output boundaries are refused (`:190-205`), and writing excluded observations doesn't self-invalidate (`:88-100`).
- Publication-time invalidation before and after output, both in process and through the worker (`:127-165` — but see T1 — and `:293-326`).
- Fresh, accumulating, and reordered sessions produce equivalent views (`test/session.test.ts:110-136`, `test/shell.test.ts:38-79`).

## 6. Classification against the workflow

Under `dev/workflow.md` §5 (Unexpected findings):

- **Local corrections that need no new design decision:** T1, T5, S3 (error-code list), S4, R2, R3/T3, and the `spawnSync` timeout in R1. Each can be done as incidental work in a related task, or as one small maintenance task.
- **Needs human direction:** a test seam for worker crashes (T2), consolidating the exclusion resolvers if they are not semantically equivalent (S2), and any change to how often recapture runs or what it covers (R1 part 3), which touches the documented input-stability contract.
- **Backlog candidate:** "Bound and make interruptible the synchronous Git work in repository capture and validation." None of the audited items appears in `docs/backlog.md` today.

## 7. Limits of this audit

- Not audited: presentation, projection, and TypeScript expansion/dependency logic, beyond checking them for caches and resources (none found beyond local per-call memo maps such as `expansions.ts:42`, `dependencies/organization.ts:90`). The correctness of analysis semantics was out of scope.
- The full test suite was not run. `test/shell.test.ts` and `test/session-inputs.test.ts` were run (29/29 passing), both normally and with the T1 instrumentation. Experiments used a separate `tsc` build in the session scratchpad and did not touch `_build/`.
- R1 was measured on macOS (Darwin 25.6, Node 22). The claim that a second Ctrl-C escapes the hang is inferred from the code and was not verified.
- R3 was not reproduced, because it requires a mid-write I/O failure.

## Appendix: experiments

All scripts are in `experiments/` and run against a compiled build directory (for example `npx tsc -p tsconfig.json --outDir <dir>`, with `node_modules` and a `{"type":"module"}` `package.json` next to it).

| Script | Finding | Invocation |
|---|---|---|
| `worker-termination-during-git.mjs` | R1 | `PATH=experiments/slow-git:$PATH FAKEGIT_LOG=<log> node worker-termination-during-git.mjs <build> <tsconfig>`. `slow-git/git` logs `$$ $*`, sleeps 6 s, then runs `/usr/bin/git`. The tsconfig can be outside a Git worktree. |
| `exclusion-resolver-divergence.mjs` | S2 | `node exclusion-resolver-divergence.mjs <build>` |
| `sink-assertions-swallowed.mjs` | T1 | `node sink-assertions-swallowed.mjs <build> fixtures/dependency-journey/tsconfig.json` |

The `git` call count for R1 came from `experiments/logging-git/git` (logs, no sleep) and running `captureRepository` once on `fixtures/dependency-journey/tsconfig.json`. The capture covers the enclosing PostCode worktree.

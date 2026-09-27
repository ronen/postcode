# Audit of state consistency, resource lifetimes, and supporting tests

Date: 27 September 2026  
Repository: `/Users/ronen/postcode/app`  
Audited commit: `5c048694fa10dc19addcbaf5825bc9c9a9719c9a`  
Standard: the working-tree version of `dev/engineering-guidelines.md`, including the updated state/resource and testing guidance.

## Assessment

The central design already handles much of the updated guidance well. Captured evidence, earlier evaluations, projections, and observations deliberately preserve historical information. They must not be refreshed to match later acquisitions. The store protects its records through cloning, freezing, reference validation, and rejection of conflicting replacements. Partial-result reuse has an explicit input-revision basis and meaningful tests.

The worthwhile course corrections are concentrated at boundaries:

| ID | Finding | Evidence and impact | Suggested attention |
| --- | --- | --- | --- |
| F1 | Synchronous Git work blocks worker shutdown after interruption | A bounded three-second Git substitute delayed termination by about three seconds despite immediate command rejection | Bound subprocess lifetime; distinguish bounded waiting from prompt cancellation |
| F2 | Assertions inside two test sinks are swallowed | Both tests passed after their assertions were replaced with deliberate failures | Repair these tests first so their claimed guarantees are enforced |
| F3 | Failed observation writes leave incomplete files under final names | A short write followed by injected `ENOSPC` left malformed JSON | Small, sink-local failure cleanup improvement |
| F4 | Evaluation cache retains a mutable copy separate from the immutable store | Producer-array mutation changed a cached return value but not its stored record; projections remained correct | Harden ownership before adding providers |
| F5 | Synchronous worker send failure leaves a phantom pending operation | Real `DataCloneError`, false concurrency rejection, then an unhandled rejection during close | Small transport cleanup; current CLI requests do not trigger it |

These findings do not establish widespread stale results or failed cleanup on ordinary successful use. No production fixes, canonical tests, governing documents, backlog entries, or task records were changed. This is an audit artifact, not implementation authorization.

## Scope and method

I followed the task protocol and workflow as exploratory audit work. `_work/TASK.md` was absent. I read the updated guidelines, relevant conventions, governing concepts and constraints, implemented architecture, session and observation decisions, and the completed session plan. The upcoming investigation plan was not treated as implemented behavior. Existing reviews were not used as substitutes for examining code.

The review traced compiler input capture and caches, evaluation recording, store/reference ownership, organization/dependency derivations, projection construction, session ownership, worker transport, shell publication, observation files, and relevant test/development harnesses. It emphasized state transitions and resource failure paths rather than exhaustively revalidating language-analysis semantics. See [source-inventory.txt](source-inventory.txt).

Verification used a tracked-file working-copy snapshot in `checkout/`, with its own Git index and a symlink to the installed dependencies. This preserved the original source tree and kept builds and retained artifacts here. The runtime was Node `22.13.1`, TypeScript `6.0.3`, on macOS. Explicitly selecting the repository's Node installation avoided an unrelated broken system Node installation in the snapshot directory. Existing tests create and clean ephemeral runtime fixtures; the separate interruption harnesses used this directory's `runtime-tmp/`.

A reproduced boundary failure is distinguished below from a normal CLI defect. Controlled substitutes made specific failures observable. No real disk exhaustion, permanently stuck subprocess, or system crash was induced.

## Findings

### F1. Worker termination does not interrupt synchronous Git acquisition

**Demonstrated cancellation limitation on a production path; consequential when Git stalls.**

[Repository capture](../../../../../src/lib/repository/capture.ts), lines 44–55, invokes Git with `spawnSync`, a buffer limit, and no timeout. Capture runs during project opening and input validation: [project.ts](../../../../../src/lib/typescript/project.ts), lines 96–108. [interactive-session.ts](../../../../../src/lib/interactive-session.ts), lines 56–63, rejects the pending operation and calls `worker.terminate()`. [shell.ts](../../../../../src/lib/shell.ts), lines 84–87, awaits termination before returning.

The audit substituted a Git executable that signals entry, sleeps three seconds, and exits. After Git started, `interrupt()` rejected `opening` with `CommandInterrupted` in about **0.5 ms**, but termination took **3,017 ms**. The worker remained blocked until its synchronous child finished. Production supplies no subprocess deadline, so a child that does not finish can make shell shutdown wait indefinitely. An interruption message does not establish that resources have terminated.

This does **not** demonstrate an orphan after completed shutdown or a problem interrupting ordinary JavaScript compiler work. The existing real-compiler worker probe passed and exited about 20 ms after interruption in this run. The missing case is a worker blocked in synchronous subprocess work. Other slow native/filesystem operations were not tested.

**Proportionate change:** give Git operations an explicit finite lifetime and report expiration as an operational acquisition failure. A timeout bounds the wait; it does not provide immediate Ctrl-C cancellation. If prompt cancellation during Git is required, make the child independently cancellable and have its owner await exit, through asynchronous subprocess ownership or an appropriately supervised process boundary. Do not simply stop awaiting the worker and claim cleanup succeeded. Evaluate a broader execution-boundary change separately.

**Test:** use a controlled Git child with a readiness handshake; interrupt after startup and assert both command settlement and actual worker/child termination. Cover opening and validation. Use an outer watchdog and unconditional cleanup. The existing compiler-work probe exercises a different phase.

Evidence: [probes.mjs](probes.mjs), [probes.json](probes.json), [existing-session-interruption.log](existing-session-interruption.log).

### F2. Two tests can pass after their essential assertions fail

**Demonstrated test defect, not a demonstrated observation-format defect.**

[command-execution.ts](../../../../../src/lib/command-execution.ts), lines 14–20, intentionally catches exceptions from `sink.submit` and warns without changing the command result. That is correct production behavior under the delivery contract. These tests, however, assert inside that caught callback:

- [session-inputs.test.ts](../../../../../test/session-inputs.test.ts), lines 150–155: observation contents around pre-/post-publication invalidation. The outer test checks the exit code, the presence of “invalidated,” and whether output occurred. A failed sink assertion becomes an additional warning and satisfies those remaining checks.
- [shell.test.ts](../../../../../test/shell.test.ts), lines 119–125: idle Ctrl-C followed by a command and EOF. `count` increments before assertions; stderr is discarded, and outer checks still see one submission and exit code zero.

In disposable compiled copies, I replaced the first sink assertion in each with `assert.fail('AUDIT: this assertion must fail')`. **Both selected tests still passed, with process exit status 0.** Their observation assertions are ineffective regression guards.

There is overlapping coverage: the worker publication test at `test/session-inputs.test.ts:293–324` captures its batch and asserts afterwards, as do tests in `test/session.test.ts`. Invalidation observations are not entirely untested. Nevertheless, these two tests claim checks they cannot enforce.

**Proportionate change:** collect batches in the fake sink, acknowledge success, and assert after awaiting the operation. If a callback must assert to direct an interaction, preserve and explicitly rethrow its failure in the test body. Check unexpected warnings where appropriate. Keep production sink failure handling intact.

**Verify the fix:** temporarily falsify each important expectation and confirm the test fails. That is more useful here than adding further successful-operation assertions.

Evidence: [test-assertion-probe.mjs](test-assertion-probe.mjs), [test-assertion-probe.json](test-assertion-probe.json), [test-assertion-probe.log](test-assertion-probe.log). Mutated copies are named `*.probe.js`, outside the normal test glob.

### F3. A failed observation write leaves a malformed final-name artifact

**Reproduced under controlled I/O failure; a cleanup and archive-consumption risk.**

[observations.ts](../../../../../src/lib/observations.ts), lines 57–64, writes directly to the final timestamp/UUID `.json` destination using `flag: 'wx'`. Exclusive creation and private permissions are good safeguards. There is no cleanup if writing fails after creation.

The probe performs a real exclusive creation and nine-byte write, then throws `ENOSPC`. Submission rejects, but the destination remains with content `{"formatV`. A failed batch therefore leaves a file named like successfully written batches that cannot be parsed. This models a mid-write failure; no real disk exhaustion was induced.

The CLI already warns and preserves the successful view, as it should. No current historical-reading API was found that mistakes the file for an accepted batch. The issue is residue and ambiguity for later file consumers—not silent success from `submit`, corruption of a previous batch, or a demonstrated descriptor leak. Accepted observation files intentionally outlive sessions and must not be removed on close.

**Proportionate change:** explicitly own a newly created file and remove that owned incomplete file on write failure, while closing its handle on every path. Preserve `wx`: failure due to `EEXIST` must never trigger deletion of an existing file. If crash-safe publication is desired, stage privately and publish complete content using a no-overwrite operation, with staging cleanup. That stronger durability policy is separate from ordinary exception cleanup.

**Tests:** fail before creation and after a short write; verify cleanup, preservation of an existing destination, permissions, visible delivery failure, and unchanged successful view/exit semantics. `test/cli.test.ts:96–105` covers rejected/thrown abstract sinks, and lines 233–281 cover successful files, permissions, and timestamp consistency. Neither exercises partial filesystem writes.

Evidence: `partial-observation-write` in [probes.mjs](probes.mjs) and [probes.json](probes.json). The short file is retained under `probe-data/sink/` as audit evidence.

### F4. Evaluation cache can disagree with the canonical stored evaluation

**Demonstrated boundary weakness; no incorrect current CLI projection reproduced.**

[MemoryProgramRecordStore.put](../../../../../src/lib/memory-store.ts), lines 56–68 and 322–325, clones records and freezes stored copies. [recordModuleEvaluation](../../../../../src/lib/evaluation.ts), lines 34–60, shallowly spreads the provider result, stores it, then caches and returns the original `outcome`. Nested arrays/objects still belong to the provider; the cache key was computed before any later mutation.

The probe passes an ordinary mutable producer array through the readonly `DiscoveryResult` interface, records an evaluation, and clears the producer array. The store still contains **one module**, while the cached evaluation contains **zero**. Supplying the original one-module result again hits the original key and returns the altered zero-module outcome. This does not require mutating through a readonly consumer reference.

Current TypeScript materialization was not found to modify these arrays after publication. [projections.ts](../../../../../src/lib/projections.ts), lines 15–18, and organization/dependency consumers reload stored evaluations. The probe's projection correctly retained its one module. This materially reduces present impact but shows that returned and stored evaluations have different ownership guarantees.

**Proportionate change:** cache evaluation IDs or store-owned immutable records, and return the stored record after successful insertion. State that the store is authoritative. Review the same assumption when extending provider result caches; do not introduce a general cache framework or refresh historical records.

**Test:** mutate a producer-owned array/object after recording and assert initial/reused returns agree with `store.get(id)`. The current ownership test (`test/records.test.ts:138–147`) protects the store but not the evaluation cache. Repeatability tests use stable producer values.

Evidence: `evaluation-cache-alias` in [probes.mjs](probes.mjs) and [probes.json](probes.json).

### F5. Worker send failure leaves `pending` installed with no request in flight

**Demonstrated transport failure path; not reachable from current parsed shell requests.**

[interactive-session.ts](../../../../../src/lib/interactive-session.ts), lines 37–45, installs `pending` through `receive()`, calls `worker.postMessage`, then awaits the response. If serialization throws synchronously, execution never reaches that await. `pending` remains installed; the response promise has no rejection handler.

A request with an additional function-valued property produces a real `DataCloneError`. The next normal `check()` rejects with `Concurrent session command` even though nothing was sent. Closing the worker then rejects the abandoned response promise, producing an unhandled rejection. The audit captured that event to keep its process alive; no production worker implementation was substituted.

The parser emits cloneable data and this transport is private, so this is a bounded robustness issue rather than evidence of routine shell failure. Structural TypeScript typing and future callers can still supply extra properties. Failed sending should not leave contradictory coordination state.

**Proportionate change:** connect pending-operation creation to send-failure cleanup. Settle/clear the pending operation and observe its rejection if posting throws. Explicitly choose whether the failure leaves the session reusable or closes it. Sending only intended fields reduces accidental cloning exposure but does not replace cleanup.

**Tests:** force synchronous send failure and assert subsequent-call behavior, exactly-once settlement, clean close, and no unhandled rejection. Include startup failure and close-while-pending cases. Current shell tests cover higher-level failure classification and worker publication, not this send boundary.

Evidence: [worker-send-probe.mjs](worker-send-probe.mjs), [worker-send-probe.json](worker-send-probe.json).

## State inventory: historical snapshots versus maintained copies

| Area | Authority and consistency rule | Assessment |
| --- | --- | --- |
| Compiler reads/probes (`typescript/inputs.ts:36–80`) | Retain first-observed values; replay probes only to detect invalidation. Revision derives from observation count. | Intentional evidence snapshot. Observation/probe maps are populated together after successful acquisition; do not refresh them during checks. |
| Repository capture/layout (`typescript/project.ts:96–108`; `repository/layout.ts`) | Derive layout from captured artifacts; compare later live captures without replacing the original. | Intentional snapshot and pure derivation. Capture-local metadata caches end with each call; non-atomic capture is explicit. |
| Source digests (`typescript/project.ts:165–173`) | Discovery-local map keyed by captured compiler `SourceFile`. | Appropriate memoization of captured text, not a path cache needing refresh. `source-evidence.test.ts` checks new-opening changes. |
| Prepared expansions, dependencies, results (`typescript/project.ts:174–201, 331–362`) | Complete results reusable; partial results tied to acquisition revision. Acquire dependency inputs before deciding partial expansion reuse; install caches after successful store insertion. | Explicit and substantively tested. `session-inputs.test.ts:237–260, 329–382` covers acquisition, retries, reuse, and historical preservation. No revision-bypass defect found. |
| Claim input support (`typescript/project.ts:331–340`) | Established contexts retain their first supporting input ID; new acquisition supports new contexts. | Historical provenance, not a stale copy of the latest input record. |
| Evaluation reuse (`evaluation.ts:30–60`) | Store should govern retained outcomes; cache currently retains producer aliases. | F4. A separate split-batch hardening opportunity is described below. |
| Organization caches (`session.ts:86–113`) | Complete results keyed by immutable evaluation IDs and requirements; incomplete results recomputed. | No independent live-input refresh duty. Keys distinguish the basis; session execution does not expose mutable cache handles. |
| Entity bindings (`identity.ts:50–67`; `memory-store.ts:328–337`) | Append-only forward/reverse maps; only new colliding references lengthen. | Necessary maintained indexes with adjacent updates and explicit collision tests. |
| Graphs, placement/ancestry indexes, display counts | Derived within evaluations/projections/views from selected records; projections retain historical selections. | No independently updated long-lived graph/display cache found. Semantic tests matter more than invalidation machinery here. |
| Observation view and rendered text | Capture the result at the command boundary; sink owns retained output. | Intentional historical duplication. F3 concerns failed creation, not retention of accepted files. |

## Resource ownership and smaller hardening opportunities

Production lifetime structure is generally sound. One-shot `runCli` closes in `finally` (`src/lib/cli.ts:30–36`). Session close drops executor/provider/store state (`src/lib/session.ts:81`). Shell shutdown removes the signal listener, closes readline, and awaits its worker (`src/lib/shell.ts:84–87`). Worker termination discards compiler/store memory; an unused worker-side close message is not itself evidence of a leak. High-level filesystem operations expose no manually managed descriptors here. The synchronous Git child and incomplete observation file are the material exceptions above.

Three smaller issues merit attention when their surrounding code changes:

1. **Partial initialization in verification harnesses.** `scripts/compare-session-requests.mjs:23–26` creates two workers and asserts their opening results before entering cleanup protection. At line 44, a rejected first close skips the second. `test/session-inputs.test.ts:132–142, 265–274` acquires/writes/opens fixtures before its cleanup region. These are structural gaps, not reproduced sustained production leaks. Register cleanup immediately after acquisition, track partial setup, and attempt independent cleanup independently. Process exit can reclaim workers but does not remove temporary directories.
2. **Evaluation recording spans two store batches.** `evaluation.ts:50–54` inserts the root outcome before validating/storing expansions. A rejected expansion batch leaves the root attempt behind. The current provider produces valid records and the shell ends on unexpected defects; no corrupted view was demonstrated. Construct all outcomes first and use the existing atomic `put`. Test rejection of the expansion portion and absence of a misleading retained subset.
3. **The standalone one-shot interruption probe fails its control run.** `scripts/probe-compiler-interruption.mjs:13–15` labels every `large.ts` read as a compiler-source-read. Lines 41–43 overwrite `compilerStack` and can schedule repeated signals. Validation replay replaces the initial compiler stack; line 49 then fails because the last stack comes through `inputs.changed`/`publishCommand`. Preserve a phase-specific first marker and signal once. This is a harness-state defect, not evidence that native SIGINT stopped working. Its failure log is retained; the script was not changed to make the audit pass.

## Verification and confidence

| Check | Result | Meaning and evidence |
| --- | --- | --- |
| `npm run check`, snapshot | Passed | Current type checks; [typecheck.log](typecheck.log) |
| `npm test`, snapshot, before mutation probes | **229 passed, 0 failed**, about 46 seconds | Broad regression baseline; [tests.log](tests.log). F2 limits two particular assertions despite the green result. |
| Existing compiler-backed worker interruption harness | Passed | Correct control/interruption events, actual worker exit; [existing-session-interruption.log](existing-session-interruption.log). Does not cover synchronous Git. |
| Existing one-shot native interruption harness | **Failed in control verification** | Marker overwritten by later reads; [existing-compiler-interruption.log](existing-compiler-interruption.log). No passing native-interruption claim is made. |
| Git wait, partial-write, evaluation-alias probes | Expected assertions passed | Failure consequences under controlled conditions; [probes.json](probes.json) |
| Worker clone/send failure | Expected sequence reproduced | `DataCloneError`, false concurrency rejection, one unhandled rejection; [worker-send-probe.json](worker-send-probe.json) |
| Deliberately failing assertion copies | **Both incorrectly passed** | Confirms test defect; [test-assertion-probe.log](test-assertion-probe.log) |

Strong existing coverage goes beyond successful operation: batch validation/immutability, cross-session references, collision growth, changed source/configuration/resolution/environment invalidation, retries after acquisition, preserved older projections, publication checks, EOF handling, and abstract sink failure. Remaining gaps concentrate on partial acquisition, subprocess cancellation, failed file publication, and ownership across mutable producer boundaries.

No broad cache framework, observation garbage collector, automatic session refresh, or universal resource abstraction is warranted. Start with ineffective assertions and small ownership/cleanup corrections; make stronger cancellation or crash-durability guarantees explicit and test their exact phases.

## Artifacts and reproduction

All retained audit material is under `_codex_state_resource_audit/`: ignored, disposable, and non-governing. `checkout/` is a verification snapshot, not a proposed implementation. Its source and canonical tests are unchanged; separate `audit-mutated-*.probe.js` files intentionally contain failing assertions.

From the original repository root, after the snapshot build exists:

```sh
node _codex_state_resource_audit/probes.mjs
node _codex_state_resource_audit/worker-send-probe.mjs
node _codex_state_resource_audit/test-assertion-probe.mjs
```

The first script resets only its own sink fixture. Passing probe assertions confirm the existing defects; they do not mean fixes were made. Rerun baseline checks from `checkout/` with the supported Node installation on `PATH`, using `npm run check` and `npm test`.

The original worktree retains only the pre-existing modification to `dev/engineering-guidelines.md`. No implementation/task-record commits were made. Follow-up candidates are recorded here, as requested, rather than added to the canonical backlog.

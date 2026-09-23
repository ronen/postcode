# Transient session shell integrated review: round 1 findings

Record type: findings
Received: 2026-09-23
Reviewer: Claude Opus 5.5 (`claude-opus-5-5`) in a fresh Claude Code session, arranged by the human; not the implementing agent
Handoff: [Transient session shell: integrated review](2026-09-23-integrated-handoff.md)
Round: 1
Reviewed target: `6dd42cb6426cf21d56cbeab4745e179354007576` (scope `8dccbfd..6dd42cb`, with new scrutiny on `45205c5..6dd42cb`; branch `codex/transient-session-shell`)

## Returned findings

### Scope and method

I read the handoff, the review workflow, the approved plan, the accepted session
decisions, the prior round-1 findings and disposition, and the integrated
validation record. I treated the validation record and handoff as claims to
check. I reviewed the `45205c5..6dd42cb` runtime diff in full: `session.ts`,
`shell.ts`, `interactive-session.ts`, `session-worker.ts`,
`command-execution.ts`, `commands.ts`, `cli.ts`, the TypeScript provider
(`typescript/project.ts`, `typescript/inputs.ts`), identity and store bindings,
evaluation reuse, observations, the three presentations and projections, the new
tests (`session-inputs`, `shell`, `session`), the three verification scripts and
the CLI-reference sections for the shell and input stability. `HEAD` (`c331696`)
differs from the target only in the handoff, validation and task records.

I then ran the real CLI shell in a pseudo-terminal (a Python `pty` driver) on the
dependency-journey fixture, on temporary copies of it, and on PostCode itself. I
also wrote small scratch probes against the built runtime. I did not modify the
implementation.

### Verification performed

- `npm run check`: passed (Node 22.13.1).
- `npm test`: 216 of 216 passed.
- `node scripts/compare-session-requests.mjs`: 162 comparisons passed (54 per
  fixture). I read the script. It normalizes only session UUIDs and the `Session`
  header, and it compares retained repeats without normalization.
- `node scripts/probe-session-interruption.mjs`: reproduced. The control run
  exited 0 with `view-produced` and `command-completed`. The interrupted run
  exited 130 after about 18 ms, with `command-interrupted` only and no view. The
  marker confirms that the signal arrived inside the real `prepareDiscovery`
  checker path.
- `node --expose-gc scripts/measure-session-journey.mjs tsconfig.json`:
  completed. Executor: opening 1.20 s, first inventory 3.59 s, focused and
  organization requests 0.59–1.00 s, repeated inventory and dependencies
  1.58/0.75 s. Shell: opening 1.67 s, first inventory 4.52 s, other commands
  1.20–2.06 s. Heap was 30 → 235 → 51 → 49 MiB (baseline, live, closed, after
  worker close). The 257 s outlier did **not** recur.
- PTY shell checks (real terminal, raw mode):
  - Idle Ctrl-C discarded a partly typed line. `help extra` was refused with a
    usage error. `exit` and idle EOF both exited 0.
  - Ctrl-C during a PostCode `modules` command printed
    `Command interrupted; session ended.` and exited 130.
  - Appending a comment to a fixture source file between two commands withheld
    the second view, reported invalidation and exited 2.
  - EOF during a running command: see F1.
- Validation cost probe on PostCode with `openSession` directly: each `check()`
  took about 0.28–0.29 s (see F4).
- Partial-expansion probe: a two-file temporary Git project in which one module
  has `export { missing } from './nowhere.js'` (see F3).
- The latest shell observation batches have `formatVersion` 1, one session ID,
  command order, and `request`/`analysis-context`/`qualified-view`/`rendered-output`/`command-outcome`
  records with `view-produced` and `command-completed` events.

### Actionable findings

**F1 (medium; lifecycle). EOF during a running command leaves the shell process
running indefinitely after it finishes the command.**

`src/lib/shell.ts:74` calls `readline.prompt()` after every command, even when
the interface closed while the command ran. Node's `Interface.prompt()` resumes
paused input. After `rl.close()`, `input.isPaused()` is `true`; after a following
`rl.prompt()` it is `false` (I checked this in isolation on Node 22.13.1). The loop then
ends, `runShell` returns, and the worker is terminated. However, the resumed TTY
stdin keeps the event loop alive. `src/cli.ts` only sets `process.exitCode`, so
the process never exits.

Reproduction: in a real terminal, run `node _build/src/cli.js shell` on PostCode
and enter `modules`. Press Ctrl-D about 0.5 s later, while the command runs. The
view is printed, a stray `postcode> ` prompt appears, and the observation batch
is written. The process then stayed alive and idle at 0% CPU for more than
45 s. SIGINT then killed it through the default handler (wait status 2). That
shows the shell's own SIGINT listener had already been removed in `finally`,
because `runShell` had completed.

EOF at an idle prompt, and `exit`, both exit normally. The shell test
(`idle Ctrl-C … EOF finishes the next accepted command`) uses `PassThrough.end()`.
That does not keep the loop alive and so masks the defect.

Consequence: the lifecycle row "EOF … finish any already accepted command and
its observation submission, then release transient state" holds for the
session, but not for the process. The user must interrupt a finished shell, and
a wrapper waiting for exit hangs. Queued type-ahead lines followed by EOF behave
the same way.

Recommendation: do not prompt, or otherwise resume input, after the interface
closes. Add a test that fails when the input stream is left resumed after
EOF-while-busy, or a pseudo-terminal check.

**F2 (low–medium; presentation honesty). A Unicode inspection for an unknown `@`
reference is shown as a failed exact-name lookup for the reference without `@`.**

`inspect @forward` on dependency-journey, where `forward` is an exact handle,
renders `0 exact matches for forward` and `No exact group match.` The JSON view
for the same request correctly carries `parameters.reference: true` and
`selection.referenceStatus: "unknown-reference"`. The dependency Unicode renderer
also shows `0 exact matches · unknown-reference` for `children @forward`. The
organization-inspection header (`src/lib/organization/presentation.ts:236`) uses
only the stripped selector and ignores the reference mode and status. Before this
slice, the one-shot surface never used reference mode, so this path first
appears in the shell.

Consequence: the output contradicts the displayed inventory: `forward` exists
and matches exactly as a handle. It hides the actual cause, which is that `@`
selects only a session reference. The CLI reference promises that
"Unknown references yield an explicit zero-match result". That result is
explicit in JSON and in dependency views, but not in Unicode inspection. The
plan requires honest selection cardinality and visible qualification in each
view.

Recommendation: render the `@` spelling and `unknown-reference` status in the
Unicode inspection header, and in the module view header if it can be reached.
Consider pointing to plain lookup or `--`.

**F3 (low; reuse contract consistency). Session-level reuse caches a module
evaluation whose expansion outcomes are partial. The provider and
evaluation layers deliberately do not.**

`src/lib/session.ts:83-90` caches an outcome when the module evaluation record's
own `execution` and `materialization` are complete. Expansion outcomes are
separate evaluation records with `basis` equal to that record. They are not
considered. By contrast, `recordModuleEvaluation` (`evaluation.ts`) and the
provider's `results` and `expansionCache` (`typescript/project.ts:332,344`) cache
only when every expansion is complete.

Evidence: in a temporary project with an unresolved re-export, inspection shows
`exports: completed, materialization partial`. Called directly, `evaluateModules`
creates attempts 1, 2 and 3, with 7, 14 and 21 evaluation records and three
distinct projections. It also re-runs `prepareExpansions` each time. Repeated
`session.execute` requests instead return the identical first projection and
view.

Consequence: current behavior is benign, and arguably preferable, because the
provider's expansion partiality is deterministic within a session. However, the
handoff's statement that cached incomplete results do not suppress later
attempts, and the CLI reference's "Reuse requires matching requirements and
completed outcomes", do not describe the session boundary. The two layers apply
different policies. The "later completion" tests fake incompleteness only in the
top-level discovery result, so expansion-level partiality at the session
boundary is untested. If a provider later could complete an expansion after
acquiring input, the session would keep serving the partial result.

Recommendation: choose the policy explicitly: re-attempt, or retain deterministic
partiality as final for the session. Align the reuse predicate and the
documentation, and add a test at the session boundary.

**F4 (low; efficiency and usable latency). Each command performs four
full validation passes, two of them back-to-back, and these dominate follow-up
latency.**

The worker's `session.execute` checks before and after execution
(`session.ts:64,67`). `publishCommand` then checks again immediately
(`command-execution.ts:33`) and after output (`:36`). Only a worker message
round-trip separates the post-execute check from the pre-output check. Each pass
replays every captured compiler probe, including re-reading every observed
source and library file. It also re-runs repository capture through Git. On
PostCode, a pass took about 0.28 s. The executor's focused inspection took
0.64 s including two passes, so the analysis and rendering work was roughly
0.1 s. The corresponding shell commands took 1.2–1.3 s with four passes. The
validation record says the executor figures include validation, but it does not
separate validation cost.

Consequence: about 85–90% of focused follow-up latency is validation, and a
quarter of it is redundant. This is not a correctness defect. The decision
permits this strategy and notes that its I/O cost is not established.

Recommendation: remove the duplicated pre-publication pass. Record validation
cost separately in the measurements. Consider whether cheaper probes are
warranted later.

**F5 (low; observation fidelity). Expected analysis failure and unexpected
defect are recorded with the same outcome status and event.**

`command-execution.ts:38` maps both `AnalysisFailure` and any other error to
`status: 'failed'` and event `command-failed`. The distinction appears only in the
exit code, which is not in the batch, and in the free-text stderr prefix
(`Analysis failed:` or `Internal failure:`). The shell test asserts
`command-failed` for both. The plan's lifecycle table requires an unexpected
defect to terminate distinctly and not to look like ordinary unavailability. The
terminal behavior is distinct, but the observation is not.

Recommendation: record a distinct status or event, or a structured field, for
defects.

### Focus-area assessment (non-defect observations)

1. **Reuse and immutable support.** Provider `results` and `expansionCache`
   reuse only complete work (F3 is the session-level exception). Dependency
   evaluation IDs now include the result, so a later completed dependency
   outcome coexists with the retained partial one on the same module basis. The
   `recordModuleEvaluation` cache returns the identical record when the
   discovery result is identical. Existing contexts keep their first `inputs`
   basis (`support` map), and the store still rejects any other difference.
   Projections select only expansion outcomes whose `basis` matches their
   evaluation. The reversed-order and fresh-versus-accumulated comparisons pass.
   The input basis recorded for core contexts depends on request order. If
   dependencies run first, core contexts take the input record that includes
   dependency-resolution probes, because `prepareDependencies` runs before
   `inputs.identity()` is captured. Presentations strip `inputs`, so views are
   unaffected, and "first established" is literally accurate.
2. **Bindings and selectors.** `EntityBindings` is append-only per session and
   kind, and a colliding later ID lengthens only its own spelling. Exact lookup
   keeps all matches; I reproduced the `inspect src` ambiguity and recovery path
   through tests. `--` makes `@…` and `--…` literal. Compact spellings are
   derived from session-independent key digests, so a spelling copied from
   another invocation generally resolves the same provider entity in a new shell.
   I observed `module-aee44b7a` for `forward` in separate sessions. This is
   consistent with the decision and with the CLI reference ("do not restore the
   earlier investigation"). The `--help` line "one-shot IDs cannot navigate
   another invocation" overstates the restriction: one-shot mode rejects
   compact IDs, but a shell accepts a matching spelling.
3. **Detection.** Probe replay covers reads, negative existence probes,
   directory selection and realpaths. Replay rechecks exclusion, and the probes
   never refresh `observations`. Retargeting an output boundary is checked
   before replay. The repository is recaptured with the exclusions. Excluded
   observation output does not invalidate the session (test). Invalidation
   before and after publication behaves as specified (tests, plus my
   pseudo-terminal source edit). Two minor points:
   - The environment comparison in the worker compares the worker's own copy of
     `process.env`. External changes to a running process's environment are
     impossible, so it guards only against in-process mutation.
   - An operational error thrown during execution becomes `AnalysisFailure`
     (exit 3, session continues) without first checking inputs. A file vanishing
     mid-command would therefore be reported as analysis failure, and only the
     next command would invalidate. With the current system hooks this path is
     rare.
4. **Worker lifecycle.** Opening, active interruption, idle Ctrl-C, expected
   failure and a defect in the worker (`error` reaches the pending request, the
   command is recorded, and the shell exits 1) behave as intended. Termination
   is shared and awaited. Interruption after output but during a check or sink
   submission is recorded truthfully, including the separate
   `command-completion` interruption batch. F1 is the exception.
5. **Observations.** Failure batches carry no `qualified-view`,
   `view-produced` or `source-escape` event. Refusals record the supplied line.
   A sink failure only warns. Session ID and command order are consistent. The
   rendered-output record equals emitted stdout in the publication tests. F5 is
   the exception.
6. **Human-level inspection and costs.** On the fixture, the inventory,
   inspection, dependency children and parents, organization and zero-match
   outputs are coherent and keep their qualifications and omission lines. I
   followed displayed references across sessions and commands. On PostCode, the
   journey completed with every outcome `completed`. The unexplained 257 s
   outlier did not recur in my run, so its cause remains unestablished. Its
   magnitude is far beyond anything F4 explains. The heap figures support
   release of the compiler and store state after closing. RSS in the shell run
   rose from 852 to 1101 MiB over 11 commands, including the parent process that
   still held the executor's views. That is not reachability evidence, but
   growth over long sessions deserves watching.

Nits: after EOF during a command, a stray prompt is printed (part of F1). Idle
Ctrl-C sends Ctrl-U, which deletes only the text left of the cursor.

### Unverified areas and residual limits

- Interrupting during project opening in a real terminal. Behavior without Git,
  and platforms other than macOS.
- Sink delivery failure, the defect path and output-safety escaping were checked
  through the tests and code only, not interactively.
- Growing name/handle ambiguity: the provider fixes its population at opening,
  as documented.
- Long-running sessions and memory beyond about a dozen commands.
- My inspection does not substitute for the required human inspection of the
  fixture and PostCode investigation.
- Running the CLI and shell in the checkout wrote ignored local batches under
  `_observations/`.

### Recommendation

The integrated result is close. Accumulation, immutable support, stable bindings,
detection, publication ordering, interruption on the real compiler path and
observation truthfulness hold within the coverage I reproduced. F1 should be
corrected before closure: it is a reproducible lifecycle defect on a documented
path, EOF during an accepted command. F2 should also be corrected, because it is a
misleading shell-only presentation of a reference miss. F3–F5 are low-severity
consistency, efficiency and fidelity corrections, or explicit dispositions.
Correcting F1 and F2 warrants at least a focused re-review of `shell.ts` and the
inspection renderer. This recommendation does not constitute human acceptance of
the final review gate.

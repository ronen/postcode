# Transient session shell integrated review: round 2 findings

Record type: findings
Received: 2026-09-23
Reviewer: Claude Opus 5.5 (`claude-opus-5-5`) in a fresh Claude Code session, arranged by the human; not the implementing agent
Handoff: [Transient session shell: integrated review](2026-09-23-integrated-handoff.md)
Round: 2
Reviewed target: `cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a` (full scope `8dccbfd..cafbd9c`, with new scrutiny on corrections `6dd42cb..cafbd9c`; branch `codex/transient-session-shell`)
Prior findings: [Integrated round 1](2026-09-23-integrated-round-1-findings.md)
Prior reviewed target: `6dd42cb6426cf21d56cbeab4745e179354007576`

## Returned findings

### Scope and method

I read the original handoff, the review workflow, the round 1 findings, and the
integrated disposition, including its round 2 target and correction account. I
reviewed the complete runtime, test and documentation diff for `6dd42cb..cafbd9c`
(`c6ece7e` and `cafbd9c`). I also reread the current `session.ts`, `shell.ts`,
`command-execution.ts`, `interactive-session.ts`, `session-worker.ts`,
`evaluation.ts`, `dependencies/evaluate.ts` and the provider's `discover` caching.
The checkout was at `HEAD` `1abb063`. `git diff cafbd9c HEAD -- src test scripts`
is empty, so the later commits change records only. I treated the disposition's
claims as statements to check. I drove the real CLI shell in a pseudo-terminal
using a Python `pty` driver. I wrote scratch probes against the built runtime
and did not modify the implementation.

### Verification performed

- `npm run check`: passed (Node 22.13.1). `npm test`: 226 of 226 passed.
- `node scripts/compare-session-requests.mjs`: 162 comparisons passed (54 per fixture).
- `node scripts/probe-session-interruption.mjs`: the control exited 0 with
  `view-produced`/`command-completed`. The interrupted run exited 130
  17 ms after interruption, with `command-interrupted` only and no view.
- `node --expose-gc scripts/measure-session-journey.mjs tsconfig.json`:
  completed. The executor opened in 1.23 s and the first inventory took 3.95 s.
  Focused requests took 0.59–1.01 s. Separate validation checks took 282–308 ms.
  Shell focused requests took 0.85–1.35 s, and repeated inventory took 1.71 s.
  Heap was 30.0 → 236.0 → 51.4 → 49.9 MiB. These figures agree with the
  disposition's.
- Pseudo-terminal checks on the real CLI:
  - **F1 (EOF):** on PostCode, `modules` followed by Ctrl-D 0.5 s later printed
    the complete view, no trailing prompt, and exited 0 in about 4 s. In a second
    run, `modules`, then type-ahead `inspect session`, a blank line and
    `dependencies`, then Ctrl-D: all three commands ran in order, and the process
    exited 0. The run wrote three batches with commands 1–3, one session ID and
    `view-produced`/`command-completed`. The blank line was skipped.
  - **Idle Ctrl-C:** I typed `help xyz`, moved the cursor three places left and
    pressed Ctrl-C. The whole line was discarded, and the next `help` ran normally.
  - **Active Ctrl-C:** during PostCode `modules`, Ctrl-C printed
    `Command interrupted; session ended.` and exited 130. The run wrote one
    `command-interrupted` batch.
  - **F2 (reference miss):** on dependency-journey, `inspect @forward` rendered
    `0 exact matches for @forward · unknown-reference`. `inspect forward`
    selected the module. `children @forward` rendered `0 exact matches ·
    unknown-reference`. `inspect @module-aee44b7a` rendered
    `exact match for @module-aee44b7a · current`.
- F3/F4 probes: I made a copy of PostCode's `src`/`test`/`tsconfig.json` in a
  temporary Git repository and added one file,
  `export { missing } from './nowhere.js';`. I compared repeated direct
  `session.execute` requests and shell requests against unmodified PostCode (see
  R2-F1).
- F5: I read the code and tests. A worker defect travels from the worker `error`
  event to the pending rejection, then through `publishCommand` to status
  `defect`, event `command-defect` and exit 1. The shell then stops. An
  `AnalysisFailure` travels through the worker's `unavailable` reply to `failed`,
  exit 3, and the session continues.

### Assessment of round 1 corrections

- **F1: corrected.** `inputClosed` guards every prompt, including the blank-line
  path. After close, raw mode is released, so a later Ctrl-C arrives as a process
  SIGINT and still interrupts accepted work. New tests close readline without
  ending the stream and assert paused input. I reproduced both the single and
  queued cases in a real terminal.
- **F2: corrected** in both Unicode inspection headers. The `@` spelling and
  status now distinguish a reference miss from a literal `inspect -- @forward`
  name lookup. The methods version advanced to `presentation@23`.
- **F3: corrected as the human approved.** `moduleComplete` considers only
  expansions whose `basis` is that attempt's own module evaluation. Each
  `recordModuleEvaluation` call that is not cached creates a new attempt, so
  unrelated requirement sets are not mixed. The dependency route checks its
  module basis too. Earlier records, views and bindings are unchanged; the new
  tests and my probe both confirm this. The cost of this policy is R2-F1.
- **F4: corrected.** Direct execution keeps two checks. CLI publication performs
  three: before execution, after worker delivery immediately before output, and
  after output. An operational error now checks first and becomes
  `SessionInvalidated` when inputs changed. The caches are populated before the
  deferred check. That is harmless, because a failed check invalidates the whole
  session.
- **F5: corrected.** Outcomes and events are distinct, and the CLI reference and
  conventions document them. Assertions now inspect captured batches outside the
  sink callback.

### Actionable findings

**R2-F1 (medium; usable latency and memory; human direction needed). Under the
approved retry policy, one partial expansion anywhere in the project makes every
later module, inspection, organization and dependency command repeat the full
project expansion work. Retained memory also grows with each command. The
current provider cannot change the result.**

`session.ts:93-112` caches a module basis only when all its expansions are
complete. Organization and inspection requests share
`organizationPresentationRequirements.modules`, and dependency requests check
their module basis. Any partial expansion therefore disables reuse for all
lenses, even when the selected subject is complete. The provider's
`expansionCache` also stores only complete results (`typescript/project.ts`,
`discover`), so each request re-runs `prepareExpansions` over every module. The
Program is fixed and validated inputs are unchanged, so the retry yields the same
partial outcome. The CLI reference says so: "the current provider can return the
same partial information again". Each retry adds a module evaluation, expansion
records, an organization evaluation and a projection. None is evicted.

Evidence: in the PostCode copy with one unresolved re-export:

| Request (direct `session.execute`) | Unmodified PostCode | One partial expansion |
| --- | ---: | ---: |
| Repeated `modules` | 1.31–1.42 s | 3.32–3.46 s |
| Repeated `dependencies` | 0.66–0.69 s | 2.59–2.63 s |
| Repeated `organization` | 0.52 s | 2.51–2.54 s |
| Repeated `inspect session` (complete module) | 0.51–0.52 s | 2.53–2.56 s |
| Repeated `children session` | 0.62–0.64 s | 2.58–2.64 s |

In the real shell, repeated `inspect session` took about 1.0 s per command on
unmodified PostCode and about 3.1 s on the copy. Collected heap stayed flat at
about 221–228 MiB on unmodified PostCode. On the copy it rose steadily from
203 MiB to 298 MiB over 19 mixed commands. A separate run reached 304 MiB after
33 inspections, about 3 MiB per command, and fell to 35 MiB after close. That
suggests the retained attempt records, not a leak beyond the session. The
Unicode inspection of `session` reports `Analysis complete`, so nothing visible
explains the threefold slowdown.

Consequence: a project with even one unresolved re-export makes every follow-up
command slower, and focused follow-ups lose most of the accumulation benefit.
Unresolved re-exports are ordinary during active work, for example a missing
generated file or a work-in-progress module. Long sessions on such projects grow
in memory with no bound other than the session. That compounds the long-session
limit the disposition carried forward. The disposition's measurements and the
new tests use only projects where retries are absent or tiny, so they do not
show this cost. The documentation describes the retry, but not that it applies
to every lens and repeats project-wide expansion work.

This does not undermine correctness. Views stay truthful and immutable, and
comparison outputs are unaffected. I am not re-litigating the approved policy.
The human should decide whether its measured cost is acceptable. Options:

- keep it and document the per-command cost and memory growth explicitly;
- retry only when the provider has acquired a new input basis since the partial
  attempt, since otherwise an identical result is certain under the fixed
  Program;
- retry only for requests whose projection displays the partial scope; or
- bound retained retry attempts.

Any correction should include a measurement or regression on a realistically
sized project with one partial expansion.

### Non-defect observations and nits

1. The idle Ctrl-C redraw erases the discarded text from the line rather than
   leaving it visible with a `^C` marker. It then prints a newline and a fresh
   prompt. That is acceptable and cosmetic.
2. Type-ahead commands run after the previous view without their own
   `postcode> <command>` echo. The command text appears only where the terminal
   echoed it while typing, so a scrolled transcript attributes queued views less
   clearly. The observation batches carry the correct order, so this is a
   usability nit, not an observation defect.
3. Pre-existing grammar: `1 exact matches for src` in the organization
   inspection header. The reference variant reads `0 exact matches for @forward`,
   which is acceptable, but "exact" describes a reference resolution loosely.
4. The disposition's statements about validation count, EOF behavior, reference
   rendering, defect observations and dependency-basis caching match the code
   and my reproduction. Its round 2 measurements are consistent with mine.
5. In F4, the executor's reuse caches are filled before the deferred pre-output
   check. A detected change always invalidates the session and refuses further
   work, so no stale cached result can be published.

### Unverified areas and residual limits

- The limits the human approved for carrying forward are still unverified by me:
  interrupting opening in a real terminal, non-Git and non-macOS behavior,
  interactive sink failure and worker defects, which I checked through code and
  tests only, and sessions beyond about 30 commands.
- The 257 s latency outlier did not recur in my measurement or probe runs, so its
  cause remains unestablished.
- I did not repeat the full human-level PostCode organization/group journey from
  round 1. This round focused on the corrected paths. My inspection does not
  substitute for the human inspection the plan requires.
- The R2-F1 figures are single runs on one machine and one kind of partial
  expansion. They show the scale of the cost, not a latency guarantee.
- Running the shell in the checkout wrote ignored local batches under
  `_observations/`. The scratch project copy was outside the repository.

### Recommendation

The round 1 corrections are sound, and I found no regression in EOF and queued
input, idle and active interruption, reference-miss rendering, validation
placement across worker delivery, or structured defect observations. F1, F2, F4
and F5 can be treated as closed. F3 is implemented as approved. Its measured
consequence, R2-F1, is the one remaining actionable item. The human should
either accept and document that cost or direct a narrower retry condition before
closing the task. If only documentation changes, I do not think another full
review round is needed. A runtime change to the retry condition would warrant a
focused re-review of `session.ts` reuse and the provider's expansion caching.
This recommendation is not human acceptance of the final review gate.

# Transient session shell integrated review: disposition

Record type: disposition
Date: 2026-09-23
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Handoff: [Integrated review assignment](2026-09-23-integrated-handoff.md)
Findings: [Integrated round 1](2026-09-23-integrated-round-1-findings.md)
State: all round 1 findings dispositioned; ready for round 2

## Findings and dispositions

- **F1 — accepted and corrected.** Track readline closure and suppress every
  subsequent prompt, including queued blank lines. EOF leaves the underlying
  input paused while accepted commands and observation submissions finish.
  Tests cover EOF without ending the underlying stream, queued commands, no
  trailing prompt and paused input. A real macOS pseudo-terminal check sent
  Ctrl-D during PostCode `modules`: the view finished and the process exited 0
  without a trailing prompt.
- **F2 — accepted and corrected.** Organization and module Unicode inspection
  headers retain the `@` spelling and reference status. An unknown reference
  to `forward` is visibly distinct from the successful exact-handle lookup.
  Both renderer paths are covered. The presentation method advances to 23.
- **F3 — accepted and corrected with human-approved retry policy.** Session
  reuse requires completed, fully materialized requested expansions as well as
  the root module outcome. Dependency-request caching also checks its module
  basis, preventing that route from retaining partial expansions indefinitely.
  Partial requests establish a new attempt while preserving earlier outcomes,
  views and bindings. Real unresolved re-export regressions exercise retries
  through modules, inspection and dependencies. Existing completed-work reuse
  and later-completion coverage remain applicable.
- **F4 — accepted and corrected with human-approved validation placement.**
  CLI publication explicitly defers the executor's final check, retains its
  pre-output check after result delivery, and checks again after output. This
  removes one of four scans without moving detection across the publication
  boundary. Direct execution still checks before and after work. The private
  worker forwards the execution option. A regression counts two direct checks
  and three publication checks; actual worker delivery tests cover changed
  inputs before output and truthful retention after output. The measurement
  script samples validation cost separately. Cheaper probes remain a possible
  later optimization, not an added implementation commitment.
- **F5 — accepted and corrected.** Unexpected defects produce structured outcome
  `defect` and event `command-defect`. Expected analysis failures retain `failed`
  and `command-failed`. Exit codes and terminal prefixes remain distinct.
  Regression assertions inspect captured batches outside the sink callback,
  so sink failure handling cannot swallow assertion failures.

## Non-defect observations, nits and residual limits

1. **Reuse and support.** Acknowledged. Earlier contexts keep their first
   supporting input record; dependency-first acquisition can establish a broader
   first basis. No change is proposed to this accurately described behavior.
   Expansion-level reuse is corrected under F3.
2. **Bindings and selectors.** Acknowledged. The overstatement in `--help` is
   corrected: matching reference spellings in a different session do not restore
   earlier work or establish continuity. No cross-session spelling uniqueness
   is claimed or introduced.
3. **Detection.** Acknowledged. The CLI reference now states that worker
   environment comparison covers its own process-local copy and in-process
   mutation. The operational-error note is corrected: recognized I/O errors
   trigger a stability check before becoming recoverable `AnalysisFailure`.
   Controlled resolution errors verify immediate invalidation when an observed
   source changes and continued reuse when inputs remain stable.
4. **Worker lifecycle.** Acknowledged, with F1 corrected. Shared, awaited worker
   termination and truthful interruption observations remain in place.
5. **Observations.** Acknowledged, with F5 corrected. No view is invented on
   pre-publication failure, and sink failure remains a warning.
6. **Human inspection and costs.** The reviewer independently completed the
   fixture and PostCode journeys. This does not replace the human inspection
   required by the plan. The 257-second outlier remains unexplained; it did not
   recur in the correction measurement run either. The human approved
   carrying that uncertainty and long-session memory explicitly into rereview
   rather than requiring further investigation before this handoff.
7. **Nits.** The trailing EOF prompt is fixed under F1. Idle Ctrl-C now moves to
   the end of the input before clearing it, so text right of the cursor is also
   discarded. The regression uses a cursor moved left before Ctrl-C.
8. **Unverified areas.** The review's limits remain explicit: real-terminal
   opening interruption, non-Git behavior and other platforms; interactive sink
   failure, worker defects and escaping beyond code/tests; sessions beyond about
   a dozen commands; and the separate human inspection. The human approved retaining those
   limits explicitly for rereview. No new platform or long-session
   assurance is claimed. Fixed module population and ignored local observation
   writes remain as described by the reviewer.
9. **Recommendation.** Accepted: further review is required, particularly for
   EOF handling and inspection rendering. No reviewer recommendation is treated
   as human acceptance of the final gate.

## Corrections and verification

The clear corrections are committed in
`c6ece7e85cb5e56041247c5fb793e587d47763cd`. This is the first correction commit. The human subsequently approved
the F3 retry policy, F4 validation placement and retaining the residual limits
in the next review round. The original findings and handoff are unchanged.

Type checking and all **221 tests** passed. The complete fresh/accumulated,
repeated and reordered view/output comparison passed **162 comparisons** across
three fixtures. The real compiler-backed interruption probe passed: control
returned a view and exited 0; interruption inside the checker path returned no
view, recorded `command-interrupted`, awaited teardown and exited 130 (22 ms from
interruption to exit in this run). Diff checking passed.

The real pseudo-terminal EOF check used the actual CLI on PostCode, sent
`modules`, then Ctrl-D after 0.5 seconds, drained output and waited for process
exit. It verified a completed view, no trailing prompt and exit 0. The unit
regressions additionally cover queued commands and paused input.

### Validation-cost measurement before the F4 runtime correction

At the first correction target `c6ece7e`, ran `node --expose-gc scripts/measure-session-journey.mjs tsconfig.json` with
Node 22.13.1 / TypeScript 6.0.3. The new `validationCheckMs` samples a separate
check immediately after each direct request; it does not instrument or subtract
time within that request. Sampling adds work to the overall journey and can
perturb subsequent timings. Shell timings include worker delivery, publication
checks and submission to a no-op sink, not disk delivery or physical terminal
rendering. These are descriptive samples, not latency guarantees or thresholds.

| Request | Direct executor (ms) | Separate validation check (ms) | Shell (ms) |
| --- | ---: | ---: | ---: |
| Initial modules | 4981 | 317 | 4698 |
| Module inspection | 801 | 322 | 1365 |
| Dependencies | 1077 | 323 | 1801 |
| Children | 778 | 334 | 1400 |
| Parents | 749 | 317 | 1434 |
| Source-detail inspection | 651 | 332 | 1266 |
| Project organization | 717 | 333 | 1300 |
| Repository organization | 667 | 299 | 1299 |
| Group inspection | 699 | 336 | 1351 |
| Repeated modules | 1715 | 325 | 2483 |
| Repeated dependencies | 793 | 316 | 1567 |

Opening was 1.34 seconds direct and 1.75 seconds for the shell. All commands
completed. Heap after forced collection was 30.0 MiB at baseline, 233.6 MiB live,
49.3 MiB after direct close and 49.4 MiB after worker close. Earlier returned views
remain held in this harness; these figures are consistent with state release but
do not establish long-session memory behavior. The prior 257-second outlier was
not reproduced, and its cause remains unresolved.

The extra error-path regression initially did not reach the injected failure
because the target directory was absent. The fixture now creates that directory
before opening, allowing the genuinely lazy dependency-resolution probe to run.
Both changed-input and stable-input variants passed before the full suite. No
runtime workaround was added for that test setup issue.

## Round 2 target and verification

Review target: `cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a` on
`codex/transient-session-shell`.

The full assignment remains the [original integrated handoff](2026-09-23-integrated-handoff.md),
with full scope `8dccbfd8713c5425d333e29952217b86c883326c..cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a`.
New corrections since the reviewed target are
`6dd42cb6426cf21d56cbeab4745e179354007576..cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a`:
`c6ece7e` fixes F1, F2, F5 and the clear notes; `cafbd9c` fixes F3 and F4.
The [round 1 findings](2026-09-23-integrated-round-1-findings.md) remain unchanged.
Later disposition/task-record commits are review context, not changes to the
implementation target.

Please assess the implementation and evidence directly under the original
assignment. In particular, recheck EOF/queued-input lifecycle and reference-miss
rendering, partial-expansion retries through both module and dependency caches,
validation placement across worker delivery, and structured defect observations.
Inspect the corrections for regressions rather than treating the disposition or
passing checks as proof. Return round 2 findings under the original handoff's
procedure, naming the exact target above and the prior findings/target; the usual
filename is `2026-09-23-integrated-round-2-findings.md` (use the actual review date
and optional reviewer suffix).

At the final correction target, `npm run build`, `npm run check`, all **226 tests**
(`node --test _build/test/*.test.js`) and diff checking passed. The unchanged
comparison harness passed **162 full view/output comparisons** across fresh,
accumulated, repeated and reversed requests. The real compiler interruption
probe passed again: the control returned a view and exited 0; active interruption
inside the checker path emitted only `command-interrupted`, returned no view,
awaited worker teardown and exited 130, about 20 ms after interruption.

New regressions exercise a real unresolved re-export with a complete root module
outcome but partial export expansions. Repeated modules, inspection and dependency
requests produce new attempts while earlier views and entity bindings remain
unchanged. A probe counts two validations for direct execution and three for
publication. Actual worker tests mutate a source after delivery and before output,
and again in a separate case after output: the former withholds the view; the
latter preserves emitted output and records invalidation. Neither path permits
further investigation after invalidation.

The partial-expansion inspection test initially assumed the `.cts` module's exact
handle was `entry`; the provider generated a different handle, so the test selected
no module. It now follows an actual displayed entity reference. No runtime lookup
change was made to satisfy that mistaken test assumption.

### Measurements after F4

Reran `node --expose-gc scripts/measure-session-journey.mjs tsconfig.json` with the
same measurement method described above and no simultaneous verification jobs.
The direct executor still performs two checks; CLI publication now performs three.
The separate check sample remains outside each measured direct request.

| Request | Direct executor (ms) | Separate validation check (ms) | Shell (ms) |
| --- | ---: | ---: | ---: |
| Initial modules | 4517 | 348 | 4947 |
| Module inspection | 783 | 353 | 1202 |
| Dependencies | 1148 | 368 | 1651 |
| Children | 831 | 368 | 1164 |
| Parents | 831 | 372 | 1200 |
| Source-detail inspection | 947 | 348 | 1083 |
| Project organization | 736 | 348 | 1099 |
| Repository organization | 717 | 351 | 1101 |
| Group inspection | 698 | 355 | 1068 |
| Repeated modules | 1981 | 396 | 2201 |
| Repeated dependencies | 880 | 351 | 1281 |

Opening was 1.52 seconds direct and 1.89 seconds for the shell; every command
completed. Collected heap was 30.0 MiB at baseline, 234.0 MiB live, 49.3 MiB after
direct close and 49.5 MiB after worker close. Peak sampled shell RSS was 978.3 MiB,
including the parent retaining earlier direct views. These single-run samples
support the expected reduction in follow-up work but do not establish a stable
latency guarantee. The prior outlier did not recur; its cause is still unknown.
Long-session growth and the other explicitly approved residual limits remain
unresolved, not silently treated as verified.

## Review rounds

- Round 1 reviewed `6dd42cb6426cf21d56cbeab4745e179354007576`, scope
  `8dccbfd..6dd42cb`, with new scrutiny on `45205c5..6dd42cb`.
- Round 2 remains under the original integrated handoff. Its exact corrected
  target is `cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a`, with the corrections and
  verification above. Human arrangement and returned findings remain pending;
  no replacement assignment is needed.

## Gate conclusion

Further independent review is required. The human approved all three proposed
dispositions; no policy question remains pending from round 1. The
implementation task remains active; the review gate and human inspection have
not been accepted or waived.

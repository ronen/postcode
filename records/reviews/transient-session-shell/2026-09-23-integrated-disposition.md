# Transient session shell integrated review: disposition

Record type: disposition
Date: 2026-09-23
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Handoff: [Integrated review assignment](2026-09-23-integrated-handoff.md)
Findings: [Integrated round 1](2026-09-23-integrated-round-1-findings.md)
State: corrections in progress; human direction pending

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
- **F3 — requires human direction.** The inconsistency is accepted. The reviewer
  explicitly offers two policies. The implementing agent recommended retrying
  partial expansions, matching the provider/evaluation policy and documented
  completed-outcome contract, and asked the human before choosing. No reuse
  predicate change has been made while that question is pending.
- **F4 — accepted; measurement corrected; runtime choice requires human
  direction.** The measurement script now samples an additional validation
  check separately after each executor request, outside its request duration.
  The new samples substantiate the review's cost observation. The two adjacent
  checks straddle worker delivery: simply removing the publisher check changes
  whether a delivery-time input change is detected before or after output.
  The implementing agent recommended letting CLI execution defer its
  post-execution check to the publisher, preserving the publisher's pre-output
  check and both checks for direct `session.execute()` callers. Human direction
  was requested before making that choice. Four checks remain for now.
  Cheaper validation probes are not implemented or claimed necessary by this
  correction.
- **F5 — accepted and corrected.** Unexpected defects produce structured outcome
  `defect` and event `command-defect`. Expected analysis failures retain `failed`
  and `command-failed`. Exit codes and terminal prefixes remain distinct.
  Regression assertions inspect captured batches outside the sink callback,
  so sink failure handling cannot swallow assertion failures.

## Non-defect observations, nits and residual limits

1. **Reuse and support.** Acknowledged. Earlier contexts keep their first
   supporting input record; dependency-first acquisition can establish a broader
   first basis. No change is proposed to this accurately described behavior.
   Expansion-level reuse remains the pending F3 choice.
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
   recur in the correction measurement run either. Human direction was requested
   before treating that uncertainty and long-session memory as retained limits
   for rereview rather than investigating further now.
7. **Nits.** The trailing EOF prompt is fixed under F1. Idle Ctrl-C now moves to
   the end of the input before clearing it, so text right of the cursor is also
   discarded. The regression uses a cursor moved left before Ctrl-C.
8. **Unverified areas.** The review's limits remain explicit: real-terminal
   opening interruption, non-Git behavior and other platforms; interactive sink
   failure, worker defects and escaping beyond code/tests; sessions beyond about
   a dozen commands; and the separate human inspection. The request for direction
   about retaining those limits is pending. No new platform or long-session
   assurance is claimed. Fixed module population and ignored local observation
   writes remain as described by the reviewer.
9. **Recommendation.** Accepted: further review is required, particularly for
   EOF handling and inspection rendering. No reviewer recommendation is treated
   as human acceptance of the final gate.

## Corrections and verification

The clear corrections are committed in
`c6ece7e85cb5e56041247c5fb793e587d47763cd`. This is an intermediate corrected target;
F3, the F4 runtime choice and the residual-uncertainty disposition still await
human direction. The original findings and handoff are unchanged.

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

### Validation-cost measurement

Ran `node --expose-gc scripts/measure-session-journey.mjs tsconfig.json` with
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

## Review rounds

- Round 1 reviewed `6dd42cb6426cf21d56cbeab4745e179354007576`, scope
  `8dccbfd..6dd42cb`, with new scrutiny on `45205c5..6dd42cb`.
- Round 2 remains under the original integrated handoff. Its exact corrected
  target will be supplied after the pending human choices and their resulting
  work are complete; no replacement assignment is needed.

## Gate conclusion

Further independent review is required. Human direction on the three questions
above is pending before finalizing the corrected target for that review. The
implementation task remains active; the review gate and human inspection have
not been accepted or waived.

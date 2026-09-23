# Transient session shell integrated review: disposition

Record type: disposition
Date: 2026-09-23
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Handoff: [Integrated review assignment](2026-09-23-integrated-handoff.md)
Findings: [Integrated round 1](2026-09-23-integrated-round-1-findings.md); [integrated round 2](2026-09-23-integrated-round-2-findings.md); [integrated round 3 and supplement](2026-09-23-integrated-round-3-findings.md); [integrated round 4, Copilot](2026-09-23-integrated-round-4-copilot-findings.md); [integrated round 5, Copilot](2026-09-23-integrated-round-5-copilot-findings.md); [integrated round 6, Copilot](2026-09-23-integrated-round-6-copilot-findings.md)
State: no actionable findings remain; human inspection confirmed; final gate acceptance pending

## Round 1 findings and dispositions

These entries describe the corrections reviewed in round 2. The repeat-on-every-
request policy chosen for F3 is superseded by the human-approved R2-F1 correction
below; the other round 1 corrections remain in place.

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

## Round 2 disposition

The human returned [round 2](2026-09-23-integrated-round-2-findings.md) and
requested correction and another review round. The report is preserved unchanged.
The reviewer confirms round 1 F1–F5 were corrected as approved, including real
terminal reproduction of EOF, queued input and interruption. Its checks passed
226 tests and 162 comparisons. Those are the reviewer's results, not new checks
run by the implementing agent during this disposition.

### R2-F1 — accepted and corrected under the human-approved narrower policy

The implementing agent accepted the measured latency/retention finding and asked
before revising the previously approved retry policy. The human selected
“Retry after additional inputs (Recommended)”; the prompt and context are
preserved in the task follow-ups. Correction
`441772648cbd550b108c1060cc8dfb1df883edc4` implements that choice:

- The TypeScript provider retains partial prepared work and results against its
  append-only input-acquisition revision. Dependency acquisition precedes the
  partial-expansion reuse decision. If later preparation acquires inputs, an
  earlier partial component is not treated as stable on that newer basis.
- A stable provider result supplies a captured `retryBasis`. Evaluation validates
  its kind/session and retains an identical partial outcome on that basis.
  Completed work remains reusable across acquisition. Providers without this
  explicit assurance still retry incomplete work.
- Session-level module/dependency caches were removed so they cannot hide the
  provider's acquisition/retry decision. Repeated views retain the same qualified
  outcomes and bindings. A new input basis permits a new attempt without changing
  earlier records; qualification is never promoted merely because work is reused.
- Changed inputs still invalidate the session. No refresh, automatic reopening,
  history eviction, selector-dependent retry heuristic or public control is added.
  Discovery/evaluation methods advance to 12/5, and the CLI reference,
  architecture and implementation conventions describe the established policy.

The [validation report](../../validation/transient-session-shell/2026-09-23-partial-reuse.md)
records focused regressions and paired PostCode-sized runs with one unresolved
re-export. The previous runtime reproduced project-wide repeated work: partial
inspection took 2630–2706 ms and heap grew from 273.6 to 368.6 MiB over 20 mixed
requests. The correction took 576–600 ms for that inspection and remained at
237.9 → 237.6 MiB. Every lens reused one projection across four repeats instead of
four distinct projections, and full repeated results matched exactly. These are
single-machine observations of the tested workload, not a general latency or
memory bound. Additional input bases and new requirements can still grow retained
state. The earlier outlier and previously approved residual limits remain explicit.

### Other round 2 observations

- The acceptable idle Ctrl-C redraw, type-ahead transcript clarity and existing
  singular/plural grammar are recorded as cosmetic/usability notes. They do not
  change the truthful command ordering in observations or the R2-F1 policy choice;
  no unrelated presentation changes accompany the retry correction.
- The confirmation of validation placement, cache invalidation, EOF behavior,
  reference rendering and defect observations is acknowledged. No stale result
  may be published after invalidation, even if its reuse cache was populated
  before the publication check.
- Previously approved residual limits remain explicit: opening interruption and
  other platform/non-Git paths not interactively verified; sink failure and
  defects checked through code/tests; no human acceptance inferred from reviewer
  inspection; and the unexplained 257-second outlier. R2-F1 is new measured
  evidence about partial-project memory growth and is not silently absorbed into
  that earlier approval. It has been addressed by the separately approved correction above.
- The reviewer recommends documenting accepted cost or narrowing retries before
  closure. The implementing agent has prepared the requested next review target
  under the original assignment after the human-directed correction and its
  verification. The reviewer’s suggestion that a documentation-only resolution
  might not need full rereview does not waive the human's request for another
  round.

## Round 3 target and verification

Review target: `441772648cbd550b108c1060cc8dfb1df883edc4` on
`codex/transient-session-shell`, under the unchanged
[original integrated handoff](2026-09-23-integrated-handoff.md).
Prior reviewed target: `cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a`.
Prior findings: [round 2](2026-09-23-integrated-round-2-findings.md).
Full scope remains `8dccbfd..4417726`; focus new scrutiny on `cafbd9c..4417726`.
Later validation, disposition and task-record commits are context, not runtime
changes to this target.

`npm run check`, `npm test` (**228 tests**), diff checking and **162 complete
view/output comparisons** passed. The actual compiler interruption probe passed
with no fabricated view and awaited teardown. The new realistically sized
[measurement/regression script](../../../scripts/measure-partial-session.mjs)
passed full result equality for repeated requests in both clean and partial
projects. Full methods, coverage, timings, heap observations and limits are in the
[partial-reuse report](../../validation/transient-session-shell/2026-09-23-partial-reuse.md).

Please inspect the correction directly, focusing on provider cache validity after
acquisition, captured-basis partial evaluation reuse, absence of an outer cache
that suppresses acquisition, immutable earlier support, and the latency/retention
regression. Verify both reuse without new inputs and renewed eligibility after
acquisition; ensure changed-input invalidation remains distinct. Do not treat the
disposition or passing checks as proof of correctness. Follow the original
handoff's return procedure and write `YYYY-MM-DD-integrated-round-3[-reviewer]-findings.md`
with the exact target above and prior findings/target. Commit only the returned
findings when repository write access is available.

## Round 3 disposition

The [round 3 report and long-session supplement](2026-09-23-integrated-round-3-findings.md)
are preserved as returned. The reviewer found no actionable findings, confirmed
the R2-F1 correction against `441772648cbd550b108c1060cc8dfb1df883edc4`, and
reported no remaining actionable findings from rounds 1–3. No implementation
correction or additional review target results from this round.

The reviewer independently passed type checking, **228 tests**, **162 complete
view/output comparisons**, the real compiler interruption probe and the
PostCode-sized clean/partial reuse measurement. Mixed-order acquisition produced
one new attempt and then stable reuse; all nine negative-resolution mutation
cases invalidated. The actual partial-project shell also recovered the expected
follow-up latency. These are reviewer results, not checks rerun by the
implementing agent while recording this disposition.

### Non-defect observations

1. **Global retry scope — acknowledged.** Additional acquisition permits retries
   of partial work across the project, including for a focused request. This is
   the approved and documented policy; the review introduces no request to
   narrow it further.
2. **Unstable preparation branch — retained as an execution-coverage limit.**
   The reviewer could not trigger acquisition after dependency preparation in
   the same call. Its conservative omission of a reuse basis remains unchanged.
   No direct execution coverage is claimed for that branch.
3. **Provider/store pairing — recorded as a reuse concern for future changes.**
   The review identifies no current consequence because a session pairs one
   provider with one store. This disposition makes no new multi-store guarantee
   and introduces no change to that session arrangement.
4. **Measurement warm-up — acknowledged.** The committed measurement deliberately
   measures steady reuse after acquisition. The review's separate mixed-order
   probe and real shell run provide transition evidence; the steady measurements
   are not presented as the cost of the first retry.
5. **Selected-subject qualification — acknowledged.** A complete focused subject
   can truthfully omit partial qualification that appears in the project-wide
   inventory. No qualification or rendering change is required.

### Supplementary experiment

The supplement extends long-session evidence to **800 direct executions with
238 distinct requests** on the clean PostCode project. All 400 second-pass
rendering digests matched the first pass. Collected heap rose from 229.7 MiB at
24 distinct requests to 257.9 MiB at 238, then stayed at 257.3–258.0 MiB throughout
the repeated pass and fell to 39.2 MiB after close. The observed growth was about
135 KB per additional distinct request in this workload. The supplement explicitly
supersedes the earlier conversational 75 KB figure and discards heap measurements
from the preliminary harness that retained full rendered strings.

This supports stable repetition and release on close in the tested workload,
with retained growth for new distinct requests. It establishes no general memory
bound or per-request cost guarantee. No latency growth with accumulated state was
observed; the slowest command in the corrected run took 1.9 seconds. The earlier
257-second outlier did not recur across the two runs, but its cause remains
unknown. No eviction or new performance policy is introduced by this evidence.

The earlier approximately 30-command coverage limit is therefore replaced by
the supplement's stated scope: 800 commands through the direct executor on one
clean project, one deterministic mix and one machine. This does not establish
equivalent long-session coverage of worker/publication/terminal delivery,
partial projects or many additional input acquisitions. Heap figures come from
one corrected run. The reviewer did not repeat the full fixture/PostCode human
journey this round. Real-terminal opening interruption, non-Git/non-macOS
behavior, interactive sink failure and worker defects beyond code/tests, and
realistically sized partial composition/dependency cases remain explicit limits.

### Recommendation

The reviewer recommends no further round. Recorded as review evidence, with no
new runtime work proposed. The remaining coverage limits and unexplained outlier
are presented for the human's final acceptance; this disposition does not waive
them or treat independent reviewer inspection as the required human inspection.

## Round 4 disposition: Copilot PR review

The human requested retrieval and preservation of the complete Copilot review of
[PR #6](https://github.com/ronen/postcode/pull/6), followed by assessment of whether
each documentation mismatch indicated a deeper functional issue. The
[preserved findings](2026-09-23-integrated-round-4-copilot-findings.md) contain the
overall review and all three inline comments; the paginated conversation endpoint
returned no comments. The review targets `841f51098dbb33cfe0c231a29e2816bf99983254`.
It is additional PR evidence under this assignment, not a claim that Copilot
performed the handoff's requested verification.

All three low-severity findings are **accepted and corrected** in `60c33a4`.
Inspection of the implementation and focused verification establish stale
descriptive text in each case, not a reason to change the identity contract:

1. **R4-F1 — dependency preparation comment**
   ([4084949168](https://github.com/ronen/postcode/pull/6#discussion_r4084949168)).
   `openTypeScriptProject` allocates its session before returning the discovery
   interface. Discovery calls `prepareDependencies` before constructing
   `capturedInputs` from `inputs.identity()` and materializing domain records.
   Later dependency acquisition can therefore add input support while retaining
   the same session and earlier claim support. The comment now names that input
   capture/materialization boundary. Existing regressions passed for additional
   acquisition, changed resolution inputs and immutable earlier support; no
   missing session-finalization operation is needed.
2. **R4-F2 — expansion preparation comment**
   ([4084949226](https://github.com/ronen/postcode/pull/6#discussion_r4084949226)).
   The same discovery sequence calls `prepareExpansions` before constructing
   captured input support, then materializes its prepared results in the already
   allocated session. The comment incorrectly described session finalization
   instead. It now describes preparation before input capture and record
   materialization. Tests covering expansion reuse after dependency acquisition
   and preservation of earlier bases passed. No identity or evidence-ordering
   defect was established by this finding.
3. **R4-F3 — manual provider probe description**
   ([4084949274](https://github.com/ronen/postcode/pull/6#discussion_r4084949274)).
   `sessionId()` takes no input and returns a `randomUUID()` namespace.
   `recordId()` and separate `analysis-inputs` records retain the distinct
   record/evidence roles; a session ID is not an input digest. The probe's
   `pathPolicy` string wrongly claimed input-dependent session IDs. Corrected it
   to state that retained session IDs are random namespaces independent of
   analysis inputs, with input support recorded separately. Running the probe
   confirmed the corrected output. The existing test that opens equivalent
   projects in two sessions confirms distinct IDs with equivalent normalized
   results. The defect is in the emitted explanation, not ID generation.

The overview's reminder that human inspection remains pending is acknowledged.
The generated suggestion to configure review skills/MCP is external tooling
advice, not an implementation finding; no configuration change was requested.
No finding was rejected or deferred, and no functional or governing change was
made. These small descriptive corrections do not invalidate the prior runtime
review or independently require another review round. The human still decides
whether the accumulated review and inspection satisfy the final gate.

Verification: `npm run build` passed. Five existing focused tests passed across
`session.test.ts`, `session-inputs.test.ts` and `dependencies.test.ts`, covering
independent session identity, separate immutable input support, changed resolution
inputs, later acquisition and partial-attempt bases. The manual provider probe on
`fixtures/dependency-contract/tsconfig.json` completed with full materialization
and emitted the corrected policy text. Retrieved bodies were checked against the
saved API responses for verbatim preservation. Diff checking of the corrections
passed. No tests were added and the full suite was not rerun for two comment edits
and one descriptive probe string.

## Round 5 disposition: second Copilot PR review

The [new review](2026-09-23-integrated-round-5-copilot-findings.md) targets
`88f66b1f99d93694afc920fa12434c44f9118a7c` and confirms the three prior findings
resolved. Its overview says "Findings: None" but embeds one medium-severity
issue under "Previously missed (1)". That issue is assessed here as R5-F1;
it was not omitted because it lacks a separate inline comment. Paginated
retrieval found no new inline comments, replies or PR conversation comments.
Earlier review bodies were verified unchanged against the round 4 record.

### R5-F1 — accepted and corrected: navigation provenance in observations

Source: [review 5294207644](https://github.com/ronen/postcode/pull/6#pullrequestreview-5294207644),
"Derive provenance text from projection.parameters.reference", `observations.ts`.
Correction: `579a57e`.

This was a functional observation-content defect, rather than a stale source
comment. The shell parser correctly distinguishes `@` references from exact
name/handle lookups, the projection retains `parameters.reference`, and selection
uses the session's bindings. The observation request nevertheless attached the
same "no previous view" description to all focused requests. Consumers therefore
received an explanation that contradicted the structured request and actual
navigation. The finding did not reveal a broken reference binding or selection.

Observation navigation text now uses the projection's reference flag for
inspection and dependency children/parents. Reference requests are described as
session-local, with resolution confined to that session; ordinary lookups are
described as exact name/handle lookups without asserting reference continuity.
The wording describes the requested selection mode, not successful resolution,
so an unknown reference remains truthful alongside its zero-match result and
`unknown-reference` status. A literal `@` selector after `--`, and an `@` selector
in one-shot use, remain name/handle lookups. Neither branch implies
cross-invocation continuity. The batch shape and experimental version remain
unchanged, as do view content, rendered output and selection behavior. This is
the existing command-provenance contract applied correctly, with no new policy.

Verification: the new publication-boundary regression failed on the old navigation
description before the fix. After correction, `npm run check`, `npm test`
(**229 tests**, including build) and diff checking passed. The regression parses
and publishes ten requests covering module inspection, dependency children and
parents by reference and handle, group inspection by reference, an unknown
reference, literal `@` lookup, and one-shot `@` lookup. It checks recorded selection
mode and navigation, actual selected counts, and unknown-reference status.
Assertions run after sink delivery, so sink error handling cannot swallow them.
The existing adaptive worker-backed shell test now also checks the emitted
reference-navigation observation. No additional comparison or performance run
was warranted for this isolated metadata correction.

No human policy choice, scope expansion or finding rejection was needed. This
local correction does not materially invalidate the earlier runtime review;
the exact corrected target is `579a57e` if the human arranges further scrutiny
under the unchanged integrated handoff. Human inspection and final gate acceptance
remain pending. The review itself does not authorize closure.

## Round 6 disposition: clean Copilot review and remaining human acceptance

The [third Copilot review](2026-09-23-integrated-round-6-copilot-findings.md)
targets `21eb46d33fd3b4fc31d9f01f555432b4b0899ccb` and reports no findings. No new
inline comments, replies or PR conversation comments were returned. Its reminder
about human inspection explicitly refers to the inspection already pending for
the cross-cutting changes; it identifies no additional defect, disputed design
choice or new review procedure. No correction results from this round.

The implementing agent recommends accepting the accumulated technical review as
sufficient. A further line-by-line human code review or another agent review is
not indicated by this report or a remaining actionable finding. This recommendation
does not replace the human's gate decision. The approved plan and prior human
decisions about corrections and retry policy do not need to be reconsidered.

At round 6 assessment, two existing acceptance items remained unconfirmed
(the subsequent human inspection confirmation is recorded below):

1. The [plan's verification section](../../../docs/plans/transient-session-shell.md#implementation-stages-and-validation)
   calls for "the representative journey on fixtures and PostCode, with human
   inspection". Its practical purpose is to assess the implemented navigation,
   qualification, source detail, revisiting results and usable latency by choosing
   subjects from preceding output. The human reported testing another repository
   and elected to leave selector-UI clarity for a later cleanup pass. That is
   relevant firsthand evidence, but does not establish completion of the specified
   fixture/PostCode journey. The human may confirm that inspection or explicitly
   accept the testing already done as sufficient in its place; no substitution or
   waiver is inferred here.
2. The [development workflow](../../../dev/workflow.md#7-verification) requires
   the human to say the final review gate is sufficient before closure. Approval
   of the plan and individual review responses is preserved as given, without
   treating it as final acceptance of the implemented task. No new approval of
   already settled policy choices is requested.

Previously recorded limits remain relevant to overall acceptance, rather than
becoming a new review assignment: input validation is best-effort and non-atomic;
new distinct requests can grow retained memory until close; the earlier latency
outlier remains unexplained despite non-recurrence; and the specified platform
and interaction coverage limits remain. The human previously approved carrying
those limits through review, and the later supplement strengthens the long-session
evidence. This round adds no new uncertainty to investigate.

Verification for this disposition was complete paginated retrieval, byte-for-byte
preservation of the new body, and confirmation that all five earlier review/comment
bodies remain unchanged in their existing records. No implementation changed and
no runtime checks were rerun; the latest runtime verification remains the 229-test
round 5 result. Human acceptance has not been inferred from this clean review.

## Review rounds

- Round 1 reviewed `6dd42cb6426cf21d56cbeab4745e179354007576`, scope
  `8dccbfd..6dd42cb`, with new scrutiny on `45205c5..6dd42cb`.
- Round 2 reviewed `cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a`, with new scrutiny
  on `6dd42cb..cafbd9c`. Its [findings](2026-09-23-integrated-round-2-findings.md)
  confirm the prior corrections and introduce R2-F1.
- Round 3 reviewed `441772648cbd550b108c1060cc8dfb1df883edc4` under the original
  integrated handoff, with new scrutiny on `cafbd9c..4417726`. Its report and
  supplementary experiment identify no actionable findings and recommend no
  further round.
- Round 4 is the supplementary Copilot review of PR target
  `841f51098dbb33cfe0c231a29e2816bf99983254`, with PR scope
  `0d59720..841f510`. All three documentation findings are corrected in `60c33a4`;
  runtime semantics are unchanged.
- Round 5 is Copilot review 5294207644 of
  `88f66b1f99d93694afc920fa12434c44f9118a7c`. It confirms the round 4 corrections
  and identifies the observation-provenance defect, corrected in `579a57e`.
- Round 6 is Copilot review 5296036666 of
  `21eb46d33fd3b4fc31d9f01f555432b4b0899ccb`. It reports no findings and reiterates
  the existing requirement for human inspection.

## Gate conclusion

Implementation, review and corrections through round 6 are complete, with no
remaining actionable findings. The human subsequently confirmed performing the
representative journey on a separate project and that it functions as expected.
This supplies the hands-on acceptance discussed above using that project in place
of the specified fixture/PostCode human inspection; it does not claim that the
human used those repositories. No additional usability issue was reported.

The task remains active pending explicit final review-gate acceptance and closure.
No reviewer recommendation is treated as human acceptance of that gate; residual
limits remain recorded with the supplement's updated long-session evidence.

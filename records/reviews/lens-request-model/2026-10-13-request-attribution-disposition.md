# Request attribution checkpoint: disposition

Record type: disposition
Prepared: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Request attribution checkpoint](2026-10-12-request-attribution-handoff.md)
Findings: [Round 1](2026-10-12-request-attribution-round-1-findings.md); [round 2](2026-10-12-request-attribution-round-2-findings.md)
Reviewed target: `2c26810611230bcb5d28a8f89d75b5213d57a893`
Rechecked target: `aafaae226f24b503fbc6f89b14026ef1f950ae9f`
Correction commits: `8fd59ffdedc9ca8aa85bee03c01e6fd137151f1b`; `aafaae226f24b503fbc6f89b14026ef1f950ae9f` (final implementation target)

## Dispositions

### F1 — accepted and corrected

Recording no longer constructs an accumulated snapshot per entry. Entries are frozen
once, and explicit snapshots freeze only newly created containers. Session failure
reporting requests a snapshot on demand. Operation-tagged worker progress sends a
start context, new work entries, indexed evidence replacements and final status.
The parent reconstructs those facts and preserves the existing incomplete sealing
and late-message rules. Completed Session reporting does not retain the mutable
work collector or its store.

Provider and module-evaluation expansion reporting groups outcomes within one call
by requirement, disposition and exact per-expansion qualification/cost. Groups keep
counts and all record IDs, with generating records grouped by their actual original
origin. Different states, unavailable/partial reasons and reuse dispositions remain
separate. First-retention rules, unknown origins, allocation schedules, provider retry
checks, qualified answers and operation reuse keys are unchanged. No outer cache or
freshness guarantee was added.

A deterministic 4,000-entry check reconstructs a full immutable report from serialized
increments and limits transport bytes relative to the resulting report. A 500-module
real-provider regression checks grouped event counts, size, complete record-to-origin
association, reuse and unchanged Views. A separate mixed-state check protects
qualification and first-retention distinctions. Repository-scale measurements below
confirm the practical correction; no machine-dependent timing threshold is used in
automated tests.

### F2 — accepted and corrected following human direction

Every full report contains the current parent as `context` and each referenced earlier
parent once in `parents`. Work origins use report-local parent references; all
descriptions, including earlier generating requests, remain available without another
lookup.

A final-check reproducer showed that callers can reuse the same correlation ID for
different requests. Parent references therefore use a report-local index (0 for the
current context, otherwise the corresponding earlier parent), rather than assuming
correlation-ID uniqueness. A regression verifies both original and current purposes
remain intact under repeated caller IDs.

Expansion aggregation preserves record/outcome/origin relationships rather than
replacing them with totals. Full report detail scales with actual record identities,
distinct parents and evidence queries; it is not silently truncated to a byte cap.

The human approved compact attribution in ordinary non-View JSON while retaining
self-contained resolution information and complete Session results. The
[accepted decision](../../../docs/decisions/compact-attribution-and-complete-results.md)
records the choice and its boundaries. JSON preserves the actual request, reason,
candidates, prerequisite support/qualifications and usage. Its attribution summary
supplements those fields with status, reporting completeness, counts and limitations.
`detail: "summary"` is independent of `completeness`; full Session/observation reports
use `detail: "full"`. Observation delivery is not required to obtain the full Session
report. View JSON is unchanged.

Direct and worker tests verify the explicit summary contract while retaining every
other report field. Reuse tests verify earlier parent descriptions. A publication test
verifies complete Session/observation attribution despite sink rejection.

## Other observations and residual limits

The non-defect observations about initiation, generation versus consumption, evidence
acquisition/withholding/dispatch, guards, closed scopes, actual request publication
and sink independence remain supported by the existing attribution tests. They are
preserved, not treated as new work or reasons to reject either finding.

The deferred-publication observation is accepted and documented in the CLI reference.
A new real Session test changes an input after execution and before the publisher's
check: work remains `completed`/`complete`, the command outcome is `invalidated`, and
no stdout or View event is fabricated. These statuses intentionally describe execution
and publication separately.

The existing worker interruption test passes with incremental transport, and the new
serialization/reconstruction check verifies snapshot integrity and proportional bytes.
This does not claim exhaustive worker scheduling coverage, a large-project
mid-expansion cancellation timing guarantee, or a heap/GC assessment over many
requests. Hosted investigators were not exercised. The historical intermittent CLI
failure remains unexplained; a passing run is not its diagnosis or repair. Remaining
Presentation compatibility, catalog/operation definitions and extension demonstrations
are outside this correction checkpoint and remain required by the approved plan.

## Verification and scale evidence

`npm run check` and build passed. The combined request/attribution focused run passed
31 tests; after the final repeated-correlation correction, all 16 attribution tests
passed. Final `npm test` passed all 535 tests (about 173 seconds), including the new
parent-reference case. `git diff --check` passed. Offline authentication tests used
local loopback permission; no paid inference was used. Visible repository inputs
were held stable during every test and measurement run.

An initial scale assertion exposed repeated same-origin descriptions after parent
deduplication; grouping record IDs by origin corrected this without increasing the
size budget. Earlier full-report/stdout equality assertions were updated to the
human-approved summary contract while retaining exact comparisons of all other
fields. A temporary-project test now explicitly expects unavailable group lookup,
rather than falsely expecting an established missing subject.

Measurements below are single implementer runs on the repository's 685-module
`tsconfig.json`, with repository inputs held stable. Direct timings cover execution
after Session opening, in the listed order; CLI timings include one-shot startup,
validation, output and local observations. The reviewed timings are the reviewer's
single-run observations, not a newly rerun baseline or a statistical guarantee.

| Case | Reviewed target (reviewer) | Corrected implementation |
|---|---:|---:|
| Direct Session modules | 47.3 s | 6.04 s |
| Direct Session dependencies | 54.2 s | 1.81 s |
| Direct Session repeated dependencies | 53.6 s | 1.03 s |
| CLI modules JSON | 155.9 s | 12.51 s |
| CLI missing-name inspection JSON | 162.1 s | 12.79 s |

The direct dependency request sends 14 incremental updates totaling 1.69 MB, versus
the reviewed 4,118 whole-report updates totaling about 24.8 GB. Modules produces eight
work entries and ten updates; dependency requests produce twelve entries and fourteen
updates. The grouped module evaluations still account for 685 outcomes for each of
exports, documentation and composition.

Full modules attribution is 1.05 MB, and its CLI observation batch is 19.01 MB (the
review measured 27.2 MB). Missing-name CLI JSON is 1.62 MB overall with a 196-byte
attribution summary, versus the reviewed 11.0 MB overall / 9.4 MB attribution. Full
Session detail remains available. Bytes use decimal MB and compact JSON where the
runtime uses compact JSON.

A separate recording-plus-serialization probe took 15 ms, 28 ms and 52 ms for 1,000,
2,000 and 4,110 entries, respectively, sending 0.50 MB, 0.99 MB and 2.04 MB. This
supports proportional cost alongside the deterministic byte/event-count tests; it
is not a repeated/averaged benchmark or a guarantee for arbitrary query payloads.

## Round 2 assessment — 2026-10-13

Round 2 independently confirms both corrections and reports no actionable findings.
F1 remains accepted and corrected: measured recording/transport cost is linear,
repository-scale timings match the earlier baseline within single-run variation, and
cached repeats are fast again. F2 remains accepted and corrected: parent descriptions
are self-contained, grouping preserves record/outcome/origin associations, and the
human-directed summary/full-report split is implemented. Nothing is rejected,
materially qualified, or deferred as an unresolved actionable finding.

The reviewer independently passed `npm run check` and all 535 tests, inspected the
complete correction diff, and repeated scale probes against the exact rechecked
target. A 25-query fixture sent 0.59 MB of increments instead of 61 MB of accumulated
snapshots. The reviewer also verified distinct parents under repeated caller
correlation IDs. The implementation remains unchanged from that target; the
implementer confirmed the source/test/fixture/package diff is empty. This round
requires only review/task record updates, so no additional test run is claimed.

The four non-defect observations are retained as such:

- Full reports still grow with record identities and evidence queries. The measured
  2.7 MB repository-scale, 25-query report is consistent with the accepted full-detail
  contract; stdout is unaffected. Repeated record lists are a documented potential
  source of future observation growth, not authorization for another optimization.
- A second `finish` cannot rewrite a final work report. Inspection confirms that a
  later freezing/rendering defect can coexist with completed work, preserving the
  execution/publication distinction. Neither reviewer nor implementer exercised
  that specific post-finish defect path in this round; no broader claim is made.
- Worker reconstruction and sealing remain supported by code inspection and the
  existing interruption test, without an exhaustive scheduling claim.
- The deferred-publication distinction remains documented and covered by its test.

Single-run timing limits, no rerun of the earlier performance baselines, large-expansion
cancellation timing, heap retention across many requests and hosted-investigator
coverage remain explicit. The broader plan's compatibility, catalog/operation and
extension work remains outside this re-check. These limits are not silently treated
as newly verified behavior.

## Review gate

Both actionable findings are accepted and corrected; none is rejected or deferred.
The original handoff and both authored findings remain unchanged. The narrow re-check
is complete, and the round-2 reviewer recommended continuing to compatibility and
extension work. On 2026-10-13, the human explicitly accepted this intermediate gate
and authorized continuation ("Yes, you can continue"), recorded in task follow-up
commit `0499bee`. This assignment's gate is satisfied; its residual limits remain
as recorded above.
The task remains active, with final integrated review and explicit acceptance still
required before closure.

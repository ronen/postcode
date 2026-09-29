# Module investigation: shell and session integration review

Record type: handoff
Prepared: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review gate: milestone 2, before live summary/provider work
Review target: `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`
Baseline or diff range: `bca53ba66b1440039de805e1d74e2ef9a10a552b..a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`
Branch: `codex/module-investigation`

## Review assignment and boundaries

Independently assess the milestone-2 integration against the approved plan and
governing material. Inspect implementation and evidence rather than treating this
handoff, implementer tests, or milestone-1 acceptance as proof. Recommend whether
the shell/session checkpoint is sufficient and identify defects, omissions and
unresolved uncertainty. The human arranges this review and decides gate acceptance.

This is a new milestone assignment. The original milestone-1 handoff and its three
rounds remain unchanged; its human acceptance is recorded in the
[milestone-1 disposition](2026-09-29-milestone-1-disposition.md). Review only the
pinned implementation target above; subsequent commits of this handoff and task
records do not change its code scope.

Do not modify implementation, governing material or task status. You may rerun
credential-free tests and inspect source. No hosted provider or live assessment
exists at this checkpoint; do not configure credentials or invoke hosted inference.

## Governing context

- [Approved plan, milestone 2](../../../docs/plans/module-investigation.md#milestone-2-shell-and-session-integration), including operation identity, retention, inspection, usage and observations.
- [Core concepts](../../../docs/core-concepts.md) and [architectural constraints](../../../docs/architectural-constraints.md).
- [Investigator execution and evidence access](../../../docs/decisions/investigator-execution-and-evidence-access.md).
- [Investigrams and progressive investigation](../../../docs/decisions/investigrams-and-progressive-investigation.md).
- [Investigation operations and lenses](../../../docs/decisions/investigation-operations-and-lenses.md).
- [Execution ownership and cancellation](../../../docs/decisions/execution-ownership-and-cancellation.md).
- [Transient sessions](../../../docs/decisions/transient-analysis-sessions.md) and [reference lifetime disclosure](../../../docs/decisions/reference-lifetime-disclosure.md).
- [Descriptive architecture](../../../docs/architecture/investigation.md) and [CLI checkpoint reference](../../../docs/cli-reference.md#interpretation-checkpoint-summary-inspection-and-usage).

## Result under review

A dedicated investigation evaluator selects reusable operation outcomes independently
of projection construction and invokes the domain boundary only for missing work.
The shared program record store atomically retains accepted trees, corrections,
provenance and outcomes, with append-only investigram reference bindings. Failure
and limit outcomes remain reusable; communication/configuration failures do not.
A persistent evidence-access instance keeps continuations valid across tool calls.
Earlier retained investigrams supply correction-aware context in successive
session evaluations.

The shell and one-shot CLI support `summarize`, exact investigram `inspect`, and
`usage`. Views identify retained versus new outcomes, qualified original accounts,
fixed composition, accompanying corrections, support and generating provenance.
Original and replacement references are independently inspectable. Summary lookup
requires one exact module; ambiguity does not silently select one. Explicit source
inspection records disclosure; investigator-only acquisition does not. One-shot
references disclose their expiry.

Compiler/evidence/retention work stays in the existing worker. A private tagged
bridge connects its investigator communication boundary to a parent-owned injected
agent. The parent independently records received usage and exposure snapshots so
active worker termination does not erase reporting. Interruption, input invalidation,
late responses and final command observations follow the shared lifecycle. Usage
is grouped by provider/model/configuration, units and category relationships, with
synthetic, unknown and anomalous accounting explicitly distinguished.

The regular CLI has no configured hosted investigator and reports configuration
unavailability. The internal environment injection supplies the scripted participant
through the production path; no public testing flag or alternate stdin mode was
added. Public follow-up lenses, associated-account discovery, live provider/setup,
replacement selection, conflicts and reconsideration display remain later
milestones, as scheduled by the plan.

## Verification already performed

See the [milestone-2 validation](../../validation/module-investigation/2026-09-29-milestone-2.md)
for exact commands, results, development findings and limits. All evidence there is
implementer verification, not independent review. Final checks: 360 passed, zero failed, cancelled or skipped in the latest complete run (approximately 113.0 seconds).
On the pinned target, final type checking/build, all 18 integration tests and all
13 isolated execution-ownership tests passed. The 360-test run preceded only the
final small reporting refinement documented in validation. Whitespace and local
documentation links passed. Isolated passes do not turn the earlier cancelled run
into a passing suite or explain its cause.

**Unresolved cancellation concern:** milestone 1 explicitly deferred diagnosis of
intermittent full-suite cancellation of 13 execution-ownership tests, observed on
both the implementation and its earlier baseline while isolated runs passed.
The same pattern recurred during milestone-2 development: a 359-test full run
reported 346 passed, zero failed and 13 cancelled. The [backlog evidence](../../../docs/backlog.md#diagnose-execution-ownership-cancellations-in-full-suite-runs)
contains commands, baseline, tests and captured results. Later full-suite passes
do not resolve it. Validation remains qualified by this concern, which is especially
relevant to review of the worker/session changes. Assess its effect on milestone
acceptance rather than assuming isolated or later passes establish its cause.

## Review focus and reproduction

1. Check operation-based selection, reuse across presentations, retention taxonomy
   and atomic publication. Confirm rejected submissions cannot retain any partial
   tree/correction and that later context does not silently regenerate work.
2. Check shared record/reference integrity, original composition immutability and
   exact inspection of targets and replacements. Check attribution of evidence
   exposure separately for each account/correction provenance.
3. Check the actual worker bridge, including single-operation correlation, fresh
   dialogue ownership, malformed replies, late events, interruption, input changes
   and preservation of independently received usage when the worker is disposed.
4. Check human/JSON views, one-shot reference expiry, selection failures, expected
   failure exit behavior and shell continuation. Verify complete correction links
   and retained context are accessible without accidental inference.
5. Check per-attempt/session usage, subset arithmetic, anomalous and non-finite
   reports, unknown coverage, source-disclosure observations and reporting when
   publication is suppressed. Check existing mechanical behavior for regression.

Run `npm run check` and `npm test`. Focused journeys can be rerun after building with
`node --test _build/test/investigation-integration.test.js`. Tests exercise the
production in-process CLI, real compiler worker and deterministic investigator
communication boundary without credentials.

## Findings return

Use [the review findings template](../../../dev/templates/review-findings.md).
With repository write access, create
`records/reviews/module-investigation/2026-09-29-milestone-2-round-1-findings.md`,
identify the exact target and methods used, preserve findings as authored under
`## Returned findings`, and commit only that findings record. Modify nothing else.
Without repository write access, return the complete findings to the human. Include
non-defect observations, residual limits, uncertainty and the gate recommendation.
Subsequent rounds remain under this handoff and name their own exact targets.

## Review gate

Pause before milestone 3. Findings are assessed under the human's direction;
consequential alternatives, material qualifications/rejections, scope expansion
or reviewer-identified unresolved uncertainty require human direction before action.
Further rounds follow material corrections when warranted. The human must accept
the milestone gate; a reviewer recommendation alone does not authorize proceeding.

## Human-requested addendum — actual source disclosure, 2026-09-29

This addendum is explicitly requested by the human after round 2. The original
assignment, target, verification and reviewer-authored findings above remain
historical evidence. [Round 2](2026-09-29-milestone-2-round-2-findings.md) cleared
F1–F4 at `849267193a6d75113d2deb33c8a1b481f916fa4e`, recommended gate acceptance
with the cancellation qualification, and identified previously missed
source-escape events with no source disclosure. The human directed correction of
that pre-existing nonconformance within this task, including existing commands.

Additional correction target: `b408c414b041f032a8954ca450c9cbe30dded139`.
Correction scope relative to the previously reviewed implementation:
`849267193a6d75113d2deb33c8a1b481f916fa4e..b408c414b041f032a8954ca450c9cbe30dded139`.
The governing basis is [record actual source-disclosure level](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md#record-the-actual-source-disclosure-level).

The shared observation boundary now classifies actual disclosure by view family
and format across module/organization inspection, dependency views and investigram
inspection. Requested `--source-detail` remains in the request record. Empty
containers, IDs and omission counts alone do not emit source-escape events.
Actual locations and nonempty excerpts are identified by `sourceForms`, with the
existing disclosure family retained in `sourceLevel`. Locations alone count.
A captured repository-root path serialized by organization JSON counts even for
missing selection; the corresponding human view omits that path and emits no event.
No source rendering, acquisition or interpretation-retention policy was changed.

[Validation](../../validation/module-investigation/2026-09-29-milestone-2-source-disclosure.md):
type checking and build passed; 45 focused disclosure/investigation/organization/
dependency tests passed (48.56 seconds); all 369 tests passed with zero failures,
cancellations or skips on a stationary worktree (130.37 seconds). Regressions use
the real shell/worker and both human and JSON output, covering missing/unsupported
references, successful source-free inspection, empty and metadata-only containers,
locations without excerpts, successful excerpt disclosure and format-specific
rendering. Request intent, rendered output and event forms are checked together.
Reproduce with `npm run check`, `npm test`, or the focused command in validation.

These checks are implementing-agent verification of the new disclosure correction,
not an extension of the reviewer's independent clearance to unreviewed code.
The [disposition](2026-09-29-milestone-2-disposition.md) records both rounds and
this correction. Validation remains qualified by unexplained execution-ownership
cancellations: diagnosis is deferred through milestone 2 but required before
milestone 3's live, cost-bearing adapter work. No credentials or live inference
were used. Human milestone acceptance remains required.

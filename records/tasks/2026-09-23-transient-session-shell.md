# Transient interactive session shell

Status: active
Opened: 2026-09-23
Closed:

## Task

Implement the approved plan at docs/plans/transient-session-shell.md -- This is explicit authorization
to begin the substantive implementation task described by that plan

## Follow-ups

That file has been committed, the worktree is now clean.  You may proceed

Context: the pre-existing note edit was committed by the human before task opening.

the first review round is complete; it has a low priority finding that you may as well fix, and a few notes that you can address or keep in mind for later.  handle these as you see fit, record the disposition and then you're clear to continue implementation

The review is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.  When complete, prepare handoff for next review round

yes proceed with those

Context: approved retrying partial expansions (F3), retaining the publisher's
pre-output check while removing the duplicate post-execution check for CLI
requests (F4), and carrying the unexplained latency outlier and verification
limits explicitly into rereview.

The second round review is complete.  Address its new finding,  record the disposition, and prepare for next review round.  Ask me if  a substantial question arises.  When complete, prepare handoff for next review round.

Retry after additional inputs (Recommended)

Context: selected in response to the R2-F1 question asking whether to narrow
retries to when the provider has acquired additional inputs, preserving partial
results otherwise, instead of retaining the previously approved repeated retries.

not yet.  can you update the top-level README.md to conform its description of the CLI to the new behavior?

Context: human inspection and final review-gate acceptance remain pending. This
follow-up requests the README update within the active implementation task.

Copilot has performed a review, please fetch and preserve it as per the governing workflow.  All findings seem to be about documentation.  Please assess in each case whether the documentation simply needs updating, in which case do so, or whether the mismatch between documentation and copilot's analysis of functionality indicate a deeper issue.

Another round of Copilot review has uncovered another issue; please fetch and preserve the review, and assess and act on it, unless there's something that warrants my input.

Another round of Copilot review has completed, with no findings; it does recommend human review.  fetch and preserve it, and assess it,  and let me know whether there's anything that does need my review, given that i reviewed and approved the plan and the review cycle responses until now.

confirming i have performed the representative journey (on a separate project) and it functions as expected

Context: confirms the hands-on acceptance using a separate project, following the
option to accept that testing in place of the plan's specified fixture/PostCode
inspection. Final review-gate acceptance and task closure have not yet been
explicitly confirmed.

## Outcome

2026-09-23: implemented the plan's one-shot conversion checkpoint in
`01a8f5e44531fb8f0d15414e5d866a81bbe8d47b`. Short-lived sessions replace snapshot
records and reference scope; captured input support remains separate from session
identity. Exact name/handle queries preserve all matches. Retired scope options
and generated commands are removed; experimental schemas and observations move
to version 1 with session/command correlation.

Implementation conventions now describe session namespaces, retained input
support, one-shot selection, consistent reference normalization in tests, and the
new observation format instead of snapshot scope and generated commands.

The one-shot review gate was cleared by the human after round 1. F1 was corrected
in `3846f1f`; the [disposition](../reviews/transient-session-shell/2026-09-23-one-shot-disposition.md)
records verification and treatment of the non-defect notes.

2026-09-23: implemented the integrated session shell in
`6dd42cb6426cf21d56cbeab4745e179354007576`. The provider retains discovery and
completed requested work; projections preserve their evaluation bases and earlier
input support. Append-only bindings support precise in-session selection.
Compiler/repository/environment validation invalidates changed sessions. The
terminal shell shares request publication with one-shot use, isolates compiler
work in a terminable worker, and records truthful command outcomes and disclosures.
Runtime documentation and implementation conventions describe the established
reuse, binding, validation, observation and interruption practices.

The task remains active for final human-arranged integrated review and human
inspection/acceptance. It is not closed.

2026-09-23: integrated round 1 findings were assessed. Clear lifecycle,
reference-presentation, structured-defect and operational-error corrections are
committed in `c6ece7e85cb5e56041247c5fb793e587d47763cd`. The
[integrated disposition](../reviews/transient-session-shell/2026-09-23-integrated-disposition.md)
covers every actionable finding, non-defect observation, nit and residual limit.
Human direction is pending on partial-expansion retry policy, the placement of
one redundant validation pass, and proceeding to rereview with the unexplained
latency outlier and listed verification limits. No finding has been rejected or
materially qualified without direction. The next round retains the original
integrated handoff; its final corrected target awaits those choices. The task
remains active.

2026-09-23: the human approved the three pending dispositions. F3 and F4 are
corrected in `cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a`: module and dependency
reuse require complete requested expansions; CLI execution defers its final
validation to the publisher while direct execution retains both checks.
Implementation conventions, the CLI reference and architecture describe these
established practices. The integrated disposition now records all findings and
notes, approved residual limits, final measurements and the exact round 2 target.
The original integrated handoff is unchanged; review target `cafbd9c` includes
both correction commits, with new review scope `6dd42cb..cafbd9c`. The task
remains active for human-arranged rereview and human inspection/acceptance.

2026-09-23: integrated round 2 confirmed the prior corrections and identified
R2-F1, the latency and retained-memory cost of retrying project-wide expansions
for every request when any expansion is partial. The human approved narrowing
retries to additional input acquisition. Implemented in
`441772648cbd550b108c1060cc8dfb1df883edc4`: the provider retains stable partial work
against its acquisition revision, evaluation reuses identical partial outcomes
only with an explicit captured-input basis, and session-level module/dependency
caches no longer hide that boundary. Providers without the assurance continue to
retry incomplete work. Changed inputs still invalidate; earlier outcomes are
preserved. Runtime documentation and implementation conventions describe the
established policy and the discovery/evaluation method changes.

The integrated disposition covers the new finding, the approved policy change,
remaining notes and round 3 focus. Round 3 is ready under the unchanged original
handoff at target `4417726`, with correction scope `cafbd9c..4417726`. The task
remains active for human-arranged review and human inspection/acceptance.

2026-09-23: integrated round 3 and its supplementary long-session experiment were
received and assessed. The reviewer reports no remaining actionable findings from
rounds 1–3 and recommends no further round. The
[integrated disposition](../reviews/transient-session-shell/2026-09-23-integrated-disposition.md)
records every non-defect observation, the updated long-session evidence and the
remaining limits. No runtime changes were required; the reviewed implementation
remains `441772648cbd550b108c1060cc8dfb1df883edc4`. The task remains active pending
the human's final review-gate acceptance and confirmation of the required human
inspection. The reviewer recommendation does not supply either acceptance.

2026-09-23: updated the top-level README at the human's request. It now leads
with interactive shell use, includes a runnable fixture journey, separates
one-shot examples, and explains precise references, stable partial reuse,
additional-input retries, invalidation, termination and transient memory lifetime.
Corrected one stale statement in the linked CLI reference that described all
invocations as fresh evaluations. No runtime behavior changed. Human inspection
and final review-gate acceptance remain pending as explicitly confirmed by the
human; the task stays active.

2026-09-23: fetched and preserved the complete Copilot review of PR #6 in
[round 4 findings](../reviews/transient-session-shell/2026-09-23-integrated-round-4-copilot-findings.md),
including the overall review and all three inline comments; no conversation
comments were present. Each finding was accepted as stale descriptive text after
checking the actual session-allocation and captured-input preparation sequence.
Correction `60c33a4` updates the dependency/expansion preparation comments and the
manual probe's identity explanation. No underlying identity or input-support
defect was established, and no runtime semantics changed. The integrated
disposition records evidence and resolution separately for every finding. Human
inspection and final review-gate acceptance remain pending; the task stays active.

2026-09-23: preserved the second Copilot PR review as
[round 5 findings](../reviews/transient-session-shell/2026-09-23-integrated-round-5-copilot-findings.md),
including the medium-severity issue embedded in its overview. Accepted R5-F1 as
an observation-content defect: focused reference requests selected correctly but
recorded navigation text denying continuity. Correction `579a57e` derives that
text from the projection's reference flag, distinguishing session references
from exact lookups without claiming that an unknown reference resolved. The
observation shape, selection and rendered views are unchanged. The integrated
disposition records the assessment and checks. No policy question arose; human
inspection and final gate acceptance remain pending, and the task stays active.

2026-09-23: preserved and assessed the third Copilot PR review as
[round 6 findings](../reviews/transient-session-shell/2026-09-23-integrated-round-6-copilot-findings.md).
It reports no findings and reiterates the already pending human inspection.
No implementation work or new policy decision results. The implementing agent
recommends accepting the accumulated technical review as sufficient without
another code-review round. The integrated disposition distinguishes that
recommendation from the remaining human acceptance: confirmation of the plan's
fixture/PostCode inspection, or explicit acceptance of the human's other-repository
testing in its place, and the final review-gate decision. Earlier plan/correction
approvals remain effective; no repeat approval is requested. The task remains
active because neither final acceptance nor a change to the inspection requirement
has yet been given.

2026-09-23: the human confirmed completing the representative journey on a separate
project and that it functions as expected. Recorded this hands-on acceptance in
the integrated disposition and project status, using the separate project in
place of the specified fixture/PostCode human inspection as discussed. No further
usability issue was reported. Only explicit final review-gate acceptance and
closure remain pending; the task is still active.

## Verification

At the one-shot checkpoint: `npm run check` and all 197 tests passed. Controlled
before/after checks passed for 54 fixture views, including structured relationships
and Unicode output. A real TypeScript compiler experiment verified native SIGINT
termination before view publication; PostCode smoke checks exercised inventory,
dependencies and explicit source detail. See the
[validation record](../validation/transient-session-shell/2026-09-23-one-shot.md)
for methods, timings, memory observations, normalization details and remaining
verification. This is implementation-agent evidence, not independent review or
human acceptance of the complete plan.


At the integrated implementation: all 216 tests, type checking and diff checking
passed; 162 complete view/output comparisons passed across fresh, accumulated,
repeated and reordered requests. Actual compiler-backed shell interruption
produced an interruption observation without a view and awaited worker termination.
PostCode journeys measured first/follow-up costs and memory release, including an
unexplained latency outlier retained in the report. See the
[integrated validation](../validation/transient-session-shell/2026-09-23-integrated.md)
for coverage, measurements and remaining human verification.

At the first integrated-review corrections: type checking, all 221 tests and
162 complete view/output comparisons passed. A real pseudo-terminal EOF during
PostCode analysis completed output and exited 0 without a trailing prompt. The
compiler interruption probe still exited 130 without a fabricated view. Separate
validation samples measured 299–336 ms per check. The disposition preserves the
measurement method, full request timings, heap observations and unresolved limits.

At the final round 2 target: build and type checking, all 226 tests, diff checking
and 162 complete view/output comparisons passed. New regressions verify retries
of real partial expansions, preservation of earlier views/bindings, two direct
versus three publication checks, and before/after-output invalidation through
actual worker delivery. Real compiler interruption again recorded no fabricated
view and exited 130 after awaited teardown. The final PostCode journey completed;
validation samples were 348–396 ms per pass and focused shell requests were
about 1.07–1.20 seconds. The integrated disposition retains full measurements and
the unexplained earlier outlier, with the human-approved remaining limits.

At the round 3 target: `npm run check`, `npm test` (228 tests), diff checking and
162 complete view/output comparisons passed. Focused tests cover stable partial
reuse, additional dependency acquisition permitting a new attempt, earlier
outcome/binding preservation and retry behavior without a provider assurance.
The real compiler interruption probe again exited 130 with no fabricated view.
The [partial-reuse validation](../validation/transient-session-shell/2026-09-23-partial-reuse.md)
records a paired PostCode-sized clean/partial probe: partial-project focused
inspection improved from 2630–2706 ms to 576–600 ms, and collected heap across
20 mixed requests changed from 273.6 → 368.6 MiB before to 237.9 → 237.6 MiB after.
Full repeated results matched exactly. These descriptive measurements do not
establish a general latency or memory bound; previously approved limits remain.

At round 3 disposition: the independent reviewer reports passing type checking,
228 tests, 162 comparisons, real compiler interruption, stable partial reuse,
additional-acquisition retry, negative-resolution invalidation and a real
partial-project shell journey. Its supplementary clean PostCode experiment ran
800 direct commands with 238 distinct requests; every second-pass rendering
digest matched the first pass. Collected heap grew with new distinct requests
(about 135 KB each in that workload), stayed at 257.3–258.0 MiB during repetition,
and fell to 39.2 MiB after close. No latency growth with store size was observed.
The unexplained earlier outlier did not recur, but its cause remains unknown.
These are reviewer measurements with the limits preserved in the
[round 3 report](../reviews/transient-session-shell/2026-09-23-integrated-round-3-findings.md).
The implementing agent changed only records and project status in response;
diff checking passed, and runtime checks were not rerun for these documentation
changes. Human inspection and acceptance remain unconfirmed.

For the README follow-up: checked the revised syntax against CLI help and the
current command reference. Ran the documented exports-fixture shell sequence
in a real pseudo-terminal: all nine commands recorded completed outcomes and
the process exited 0. Diff checking passed. No runtime or test code changed,
and the full suite was not rerun for this documentation update. This smoke
check does not replace the pending human inspection.

For the Copilot follow-up: paginated GitHub REST retrieval covered reviews,
inline comments/replies and PR conversation comments. Verified all four retrieved
bodies and their source links against the preserved record. `npm run build` and
five existing focused identity/input-support tests passed. The manual dependency
provider probe completed on the dependency-contract fixture with full
materialization and the corrected policy text. Diff checking passed for the
corrections. No new tests or full-suite rerun were needed for the two comments
and one descriptive output string; no broader runtime verification is claimed.

For the second Copilot follow-up: paginated retrieval covered both overall reviews,
all three prior inline comments/replies, and the empty PR conversation. The new
review body was preserved verbatim; all four earlier bodies were verified unchanged
against round 4. The new publication regression reproduced the incorrect metadata
before correction. After the fix, type checking, build, all 229 tests and diff
checking passed. Coverage includes ten parsed/published request cases across
module/group references, dependency children/parents, ordinary handles, unknown
references, literal `@` selectors and one-shot lookup, plus the existing adaptive
worker-backed shell's observation. No performance or view-comparison rerun was
needed for this isolated metadata change.

For the clean Copilot follow-up: paginated retrieval found three overall reviews,
three prior inline comments and no conversation comments. Verified the new body
verbatim and all five previously preserved component bodies unchanged. Checked
the outstanding acceptance items against the approved plan, development/review
workflow, prior human directions and recorded verification. Diff checking passed.
No code changed and no runtime tests were rerun; the latest 229-test result remains
the applicable runtime verification.

Human acceptance evidence: the human's confirmation above establishes successful
execution of the representative journey on a separate project. It does not claim
human inspection on fixtures or PostCode. No implementation changed; diff checking
passed for the acceptance-record updates and runtime tests were not rerun.

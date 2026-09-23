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

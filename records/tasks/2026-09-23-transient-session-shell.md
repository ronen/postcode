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

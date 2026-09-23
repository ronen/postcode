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

The task remains active at the explicitly required independent-review checkpoint.
Accumulation, growth-safe bindings, change detection and the prompt have not begun.
The next step is human-arranged review before proceeding to those stages.

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

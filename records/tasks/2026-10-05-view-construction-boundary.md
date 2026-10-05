# Separate qualified view construction from presentation shaping

Status: active
Opened: 2026-10-05
Closed:

## Task

# Separate qualified view construction from presentation shaping

Resolve the open view-builder role question in `docs/backlog.md`. Use
`records/audits/2026-10-05-view-builder-boundary/REPORT.md` as
evidence, and follow the governing views and analysis boundary in
`docs/architectural-constraints.md` and the projection architecture decision in
`docs/decisions/initial-projection-architecture-decisions.md`.

The audit found no confirmed violation of the interface analysis boundary, but
the current builders combine qualified selection and derivation with
format-specific display shaping. Those responsibilities change for different
reasons, conflicting with the single-responsibility guideline in
`dev/engineering-guidelines.md`. Resolve that coupling as part of assigning
the builders' roles; do not treat their current structure as the intended design.

First establish a concrete architectural choice for the existing builders. Distinguish qualified selection and derivation, Projection construction, presentation arrangement, and format-specific rendering by the responsibility each performs, not by the current file or function name. Address investigation lenses, whose Projections are currently constructed inside view builders, and counts drawn from evaluation-wide populations or supporting evidence. Explain how the chosen boundary preserves each Lens's question, population, Claim qualification, evaluation materialization, and visible presentation omissions. Do not treat the current CLI JSON View schema as a canonical Projection contract without justification, or require separately stored runtime stages merely to express the conceptual distinction.

Make the architectural choice reviewable before changing code: describe the intended responsibilities and data flow, the smallest necessary API or record changes, affected existing behavior, and meaningful alternatives. If it is a consequential choice not already settled by accepted decisions, prepare a proposed decision and obtain explicit human agreement before implementing it. Do not silently settle that choice through a refactor.

Then implement the smallest coherent separation of responsibilities. A coordinating function may remain, but domain selection and qualified derivation should not be coupled to terminal fitting or format-dependent display bounds merely for convenience. Preserve established CLI behavior, selection, qualification, references, and evaluation outcomes; make any necessary externally visible change explicit before proceeding. Verify the boundary with focused behavior checks, update affected documentation, and resolve the backlog entry when the work is complete.

Scope is the existing view-construction boundary. Do not add new program analyses or Lenses, introduce persistence, or build a speculative general presentation framework. The resulting core responsibilities should be usable independently of CLI-specific presentation.

## Follow-ups

## Outcome

## Verification

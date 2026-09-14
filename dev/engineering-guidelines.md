# Engineering Guidelines

This document contains human-maintained guidance for exercising engineering judgment in PostCode. Its guidance should target predictable implementation failure modes and be concrete enough to use during design, implementation, and review.

These guidelines do not establish product meaning, governing architectural terminology or constraints, consequential architectural choices, or mechanical practices of the current codebase. Those belong respectively in the adopted foundation, [`docs/core-concepts.md`](../docs/core-concepts.md) and [`docs/architectural-constraints.md`](../docs/architectural-constraints.md), accepted [decision records](../docs/decisions/), and [`docs/implementation-conventions.md`](../docs/implementation-conventions.md).

Follow these guidelines unless a concrete conflict or circumstance makes a departure necessary. Do not depart merely for local convenience or expediency. Identify and explain any departure, and obtain human direction before making a material departure. A consequential choice still requires a decision record.

This document may be changed only through separate human-directed process maintenance. Agents performing product planning or implementation may report or propose improvements, but must not modify it as part of that work.

## Repository organization

- Prefer logical internal boundaries under `src/lib/` until there is evidence that a component needs an independently versioned package boundary.
- Create directories when they receive meaningful content; do not use placeholder files to materialize a speculative structure.

## Dependencies and boundaries

- Avoid both expedient coupling and speculative abstraction; introduce a boundary when there is a concrete responsibility to separate.
- Represent important domain concepts explicitly rather than repeatedly encoding them as primitive values.
- Expose a component through its intended public boundary; do not expose internal helpers or coordination types merely for consumer convenience.
- Keep transformations that require no external state independent of external I/O when those concerns are conceptually distinct.
- Translate external data and failure models at the boundary when they should not become part of domain behavior.
- Preserve language-specific semantics rather than forcing them into a falsely universal model.
- Treat a new third-party dependency as a design choice: confirm its purpose, maintenance posture, and operational implications before adding it.

## Tests and fixtures

- Test public behavior and important boundaries rather than implementation detail alone.
- Prefer representative data and real objects over mocks when practical.
- Before creating fixture or test infrastructure, look for existing assets that express the same concept.
- Make nondeterminism explicit and controlled.

## Implementation anomalies

- Treat implementation elements made newly unused by a change as evidence to investigate before deleting or retaining them.
- Treat recurring violations of an intended boundary as possible evidence that the implementation or the boundary is wrong; do not conceal the mismatch through repeated exceptions.

# Engineering Guidelines

This document contains human-maintained guidance for exercising engineering judgment in PostCode. Its guidance should target predictable implementation failure modes and be concrete enough to use during design, implementation, and review.

These guidelines do not establish product meaning, governing architectural terminology or constraints, consequential architectural choices, or mechanical practices of the current codebase. Those belong respectively in the adopted foundation, [`docs/core-concepts.md`](../docs/core-concepts.md) and [`docs/architectural-constraints.md`](../docs/architectural-constraints.md), accepted [decision records](../docs/decisions/), and [`docs/implementation-conventions.md`](../docs/implementation-conventions.md).

Follow these guidelines unless a concrete conflict or circumstance makes a departure necessary. Do not depart merely for local convenience or expediency. Applying an exception already expressed in a guideline, such as "when practical," is ordinary engineering judgment rather than a departure. Identify and explain material departures, and obtain human direction before making them. A consequential choice still requires a decision record.

This document may be changed only through separate human-directed process maintenance. Agents performing product planning or implementation may report or propose improvements, but must not modify it as part of that work.

## Repository organization

- Prefer logical internal boundaries under `src/lib/` until there is evidence that a component needs an independently versioned package boundary.
- Create directories when they receive meaningful content; do not use placeholder files to materialize a speculative structure.

## Dependencies and boundaries

- Apply the single responsibility principle: keep each module or component focused on a coherent responsibility, and separate responsibilities that change for different reasons. Add new operations to an existing module or component when they fit its responsibility; do not split code merely to make units smaller. When introducing a boundary, identify the responsibility or dependency it isolates and prefer the simplest boundary sufficient for that purpose. Avoid coupling unrelated responsibilities for local convenience or introducing abstractions for hypothetical future needs.
- Represent domain concepts explicitly when doing so preserves meaningful distinctions, enforces invariants, or prevents invalid combinations. Prefer the simplest adequate representation, such as a named type or record; not every named concept needs a class or wrapper.
- Expose a component through its intended public boundary; do not expose internal helpers or coordination types merely for consumer convenience.
- Keep transformations that require no external state independent of external I/O when those concerns are conceptually distinct.
- Translate external data and failure models at the boundary when they should not become part of domain behavior. Preserve distinctions and information callers need to interpret results or respond appropriately to failures.
- Preserve language-specific semantics rather than forcing them into a falsely universal model.
- Before adding helpers or policy rules, look for suitable implementations both in the codebase and in libraries already used by the project. Prefer using them when their behavior fits and doing so respects the intended dependency boundaries. Share logic that expresses the same responsibility and should change together, especially classifications and validation rules. Establish semantic equivalence before consolidating similar code; preserve meaningful differences in behavior and avoid introducing inappropriate coupling merely to remove duplication.
- Before implementing substantial generic functionality, check whether a suitable established library already exists. Prefer using one when it meaningfully reduces implementation, testing, or maintenance burden. Assess its fitness, maturity, maintenance posture, license, and integration cost. Avoid adding new dependencies solely for trivial functionality, and keep external assumptions from unnecessarily shaping the application’s core concepts.

## State and resource lifetimes

- When maintaining multiple representations of the same state, identify which is authoritative and how the others remain consistent. Prefer deriving redundant values when practical. If maintained copies or caches are necessary, make their update and invalidation rules explicit where applicable. Distinguish these from intentional snapshots that preserve an earlier state and must not be updated to match later changes.
- Make ownership and cleanup responsibilities explicit for resources that require release or termination. Release resources when their intended lifetime ends, accounting for failure, cancellation, and partial initialization as well as normal completion. Keep acquisition and cleanup structurally connected when practical; an intentional transfer of ownership must also transfer responsibility for cleanup.

## Processing cost

- Consider how processing cost grows with input size, including work repeated across calls. Unless the total cost is known to remain negligible given input size, execution frequency, and cost per operation, avoid unnecessary repeated work when a straightforward change would reduce the cost without materially complicating the design—for example, replacing repeated full-collection scans with a lookup or index. Use representative measurements to establish performance priorities and justify more complex optimizations.

## Tests and fixtures

- Focus tests on public behavior and important boundaries, choosing cases that distinguish correct behavior from plausible defects. Derive expected outcomes from requirements or independently understood examples rather than reproducing the implementation's assumptions. Test internal details when they provide useful coverage beyond those behavior checks.
- Prefer representative data and real objects over mocks when practical. Use controlled substitutes when real collaborators make important failure states difficult to exercise or introduce unnecessary nondeterminism or cost.
- Before creating fixture or test infrastructure, look for existing assets that express the same concept.
- Identify sources of nondeterminism, such as clocks, randomness, ordering, and concurrency. Control them in tests where needed for reproducible checks, while preserving necessary production behavior and testing any guarantees about that behavior.

## Output safety

- Treat repository-derived text, configuration values, invocation input, and other externally supplied strings as untrusted at terminal-output boundaries. Render terminal controls visibly or otherwise neutralize their effects without changing the underlying stored values.

## Implementation anomalies

- When work reveals code that conflicts with these guidelines, assess its significance. Consider correcting it when the correction supports the authorized task and introduces no separate design decision or material scope expansion. Otherwise, report material concerns through the workflow's [unexpected-findings process](workflow.md#5-unexpected-findings).
- When fixing a defect, establish the intended behavior and investigate the cause using a reproducing example or other concrete evidence where practical. Keep the investigation proportional to the defect and its risks, and verify that the correction addresses the identified cause. If the cause remains uncertain, distinguish a mitigation from a verified fix. Do not weaken tests, suppress errors, or add special cases merely to make the observed failure disappear; changes to tests or expected behavior need an independent justification.
- Treat implementation elements made newly unused by a change as evidence to investigate before deleting or retaining them. Determine whether the change legitimately removed their responsibility or accidentally disconnected required behavior; keep the investigation proportional to that question.
- Treat recurring violations of an intended boundary as possible evidence that the implementation or the boundary is wrong; do not conceal the mismatch through repeated exceptions.

# Application Development Conventions

These conventions supplement the adopted [baseline conventions](../foundation/baseline-conventions.md). Keep this document concrete and current as the implementation and toolchain emerge.

## Repository Structure

- Put application source under `src/`.
- Prefer logical internal boundaries under `src/lib/` until there is evidence that a component needs an independently versioned package boundary.
- Create directories when they receive meaningful content; do not use placeholder files to materialize a speculative structure.
- Keep test fixtures under `fixtures/` when they represent repositories or external inputs rather than unit-local test data.

## Temporary Working Material

- Put repository-specific scratch files and directories under a descriptively named root-level directory beginning with `_`, such as `_analysis/`, `_investigation/`, or `_rendered/`. The root `.gitignore` reserves this namespace for uncommitted working material.
- Treat underscore directories as disposable. Do not use them as the sole location of durable project knowledge, implementation, committed generated artifacts, configuration, or documentation. Remove scratch material that you created when it is no longer useful; do not remove pre-existing scratch material without human direction or clear ownership.
- Do not create project-local `.codex`, `.claude`, or similar tool-specific directories for scratch work.
- A Git-ignored directory is still inside the observed repository. Do not use underscore directories for information that is required to remain outside that repository.

## Dependencies and Boundaries

- Expose a component through its intended public boundary; do not expose internal helpers or coordination types merely for consumer convenience.
- Keep transformations that require no external state independent of external I/O when those concerns are conceptually distinct.
- Translate external data and failure models at the boundary when they should not become part of domain behavior.
- Preserve language-specific semantics rather than forcing them into a falsely universal model.
- Treat a new third-party dependency as a design choice: confirm its purpose, maintenance posture, and operational implications before adding it.

## Domain Information and Failures

- Represent important domain concepts explicitly rather than repeatedly encoding them as primitive values.
- Keep expected failures, defects or broken invariants, successful results containing diagnostics, and failures that prevent the intended result distinct.
- Preserve meaningful distinctions in computed results and format them only at presentation boundaries.

## Claims and Evidence

- Preserve provenance, method, epistemological status, scope, and limitations with projected information throughout processing and presentation.
- Do not strengthen a claim when transforming, aggregating, caching, comparing, or rendering it.
- Distinguish mechanically derived facts, recorded assertions, observations, and interpretations in names, types, tests, and user-visible output.
- Prefer explicit unavailability or limitation over plausible unsupported output.

## Tests and Fixtures

- Test public behavior and important boundaries rather than implementation detail alone.
- For analysis results, use small fixtures whose expected answers and limitations are reviewable.
- Include negative and incomplete-analysis cases where they test the epistemological contract.
- Prefer representative data and real objects over mocks when practical.
- Before creating fixture or test infrastructure, look for existing assets that express the same concept.
- Make nondeterminism explicit and controlled.

## Implementation Anomalies

- Treat implementation elements made newly unused by a change as evidence to investigate before deleting or retaining them.
- Treat recurring violations of an intended boundary as possible evidence that the implementation or the boundary is wrong; do not conceal the mismatch through repeated exceptions.

## Technology-Specific Conventions

Add language, formatting, naming, testing, and module conventions here when the relevant technology is adopted. Do not infer them from a proposed architecture before that decision is accepted.

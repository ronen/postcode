# Implementation Conventions

This document records repeatable application-level engineering practices within PostCode's governing architecture. It is subordinate to the adopted foundation, governing core concepts, architectural constraints, accepted decisions, and applicable approved plans. It must not introduce or alter consequential product behavior, conceptual semantics, architectural boundaries, guarantees, or lifecycle policy in place of an accepted decision.

An implementation convention ordinarily describes how the application is written, organized, built, tested, or maintained consistently. A consequential choice about what the system means, preserves, guarantees, depends on, or keeps separate belongs in a [decision record](decisions/). When the classification is unclear, report the question rather than silently establishing a convention.

Agents may update this document only as part of authorized implementation work that establishes or changes the underlying routine practice. Do not change a convention merely to excuse a deviation found in the current work. Record material convention changes in the task record and verify them where applicable. When a convention operationalizes an accepted decision, link to that decision.

## Repository layout

- Put application source under `src/`.
- Keep test fixtures under `fixtures/` when they represent repositories or external inputs rather than unit-local test data.
- Keep repository-input fixtures outside the application's compile include list.
- Put build output under the Git-ignored `_build/` directory.

## TypeScript style

Use strict checking, explicit type-only imports, `.js` relative import specifiers, two-space indentation, single-quoted TypeScript strings, and semicolons.

## Toolchain operation

- Install dependencies with `npm ci`.
- When upgrading TypeScript, rerun the semantic fixtures and check whether any identity method versions require a bump.

## Testing and verification

- Test analysis results with small fixtures whose expected answers and limitations are reviewable.
- Include negative and incomplete-analysis cases where they test the epistemological contract.
- Use the real compiler with small fixtures. Synthetic providers are appropriate for evaluation states that the eager first provider does not normally produce.
- Automated tests may create ephemeral test projects through Node's operating-system temporary-directory APIs and must clean them up.
- Run `npm run check` to check types without emitting. Run `npm test` to build and execute the tests.

## Identity method versions

When changing analysis, record, handle, or projection semantics, bump the responsible method version as required by the accepted [deterministic identity decision](decisions/initial-projection-architecture-decisions.md#use-deterministic-logical-identity-independently-of-persistence).

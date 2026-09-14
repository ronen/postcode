# Implementation Conventions

This document records repeatable application-level engineering practices within PostCode's governing architecture. It is subordinate to the adopted foundation, governing core concepts, architectural constraints, accepted decisions, and applicable approved plans. It must not introduce or alter consequential product behavior, conceptual semantics, architectural boundaries, guarantees, or lifecycle policy in place of an accepted decision.

An implementation convention ordinarily describes how the application is written, organized, built, tested, or maintained consistently. A consequential choice about what the system means, preserves, guarantees, depends on, or keeps separate belongs in a [decision record](decisions/). When the classification is unclear, report the question rather than silently establishing a convention.

Agents may update this document only as part of authorized implementation work that establishes or changes the underlying routine practice. Do not change a convention merely to excuse a deviation found in the current work. Record material convention changes in the task record and verify them where applicable. When a convention directly operationalizes an accepted decision, append a short link to that decision enclosed in brackets, as used below.

## Repository layout

- Put application source under `src/`.
- Keep test fixtures under `fixtures/` when they represent repositories or external inputs rather than unit-local test data.
- Keep repository-input fixtures outside the application's compile include list.
- Put build output under the Git-ignored `_build/` directory.

## TypeScript style

- Use strict checking, explicit type-only imports, `.js` relative import specifiers, two-space indentation, single-quoted TypeScript strings, and semicolons.

## Toolchain operation

- Use Node.js 22.13 or later and `tsc` from TypeScript 6.0.3 to build and type-check PostCode. Use ECMAScript modules and npm with a committed lockfile.
- Use Node's built-in test runner and assertions without a separate test framework or transpilation runner. Use npm for installation and build orchestration.
- Install dependencies with `npm ci`.
- One installed TypeScript package currently supplies both the runtime analyzer and the build-time `tsc`, although those roles do not inherently require the same version. Under the current dependency layout, an upgrade made for build-tool convenience also changes the runtime analyzer and must satisfy the semantic verification described under [TypeScript integration](#typescript-integration).

## TypeScript integration

- Use the bundled TypeScript compiler API as the runtime language analyzer. Keep its version pinned because the current slice targets its documented JavaScript API.
- When changing the TypeScript version used by the runtime language analyzer, rerun the semantic fixtures and determine whether any analysis identity method versions must be updated to reflect changed analysis semantics.
- Application modules outside `src/lib/typescript/` must not import the `typescript` package. Interfaces between the TypeScript integration and the rest of the application use PostCode domain types rather than exposing TypeScript compiler nodes, symbols, or other compiler objects. Tests may import the compiler directly when they need to verify the integration against real compiler behavior. [[TypeScript language-integration boundary](decisions/initial-module-inventory-decisions.md#begin-with-a-typescript-module-inventory)]

## Testing and verification

- Test analysis results with small fixtures whose expected answers and limitations are reviewable.
- Include negative and incomplete-analysis cases where they test the epistemological contract.
- Use the real compiler with small fixtures. Synthetic providers are appropriate for evaluation states that the eager first provider does not normally produce.
- Automated tests may create ephemeral test projects through Node's operating-system temporary-directory APIs and must clean them up.
- Run `npm run check` to check types without emitting. Run `npm test` to build and execute the tests.

## Identity method versions

- When changing analysis, record, handle, or projection semantics, update the responsible identity method version to reflect the change. [[Deterministic logical identity](decisions/initial-projection-architecture-decisions.md#use-deterministic-logical-identity-independently-of-persistence)]

## Selection and navigation references

- Inspection accepts one exact referent: a name, handle, or Entity ID. One referent may resolve to zero, one, or multiple subjects. Multiple input referents and list-selector syntax remain deferred; do not confuse those capabilities with multiple matches for one exact referent. [[Snapshot-scoped references](decisions/initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped)]
- Generate mnemonic handles from language names, extensionless source basenames, or declared exports, never from snapshot hash text. Retain generated status and provenance; a basename cue is not a conceptual name or responsibility classification. Generic basenames fall back to representative exports or honest anonymity. After normalizing a cue from any provenance, prefix it with `handle-` when it matches the compact Entity-ID syntax `module-` followed by 8–64 lowercase hexadecimal characters. Exact language names remain unchanged. [[Snapshot-scoped references](decisions/initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped)]
- Abbreviate compact module Entity IDs from record-key digests against the entire module population, extending prefixes on collision. Compute the same mapping for inventory and inspection, including collapsed modules. Handle and compact-ID selection require the full snapshot through `--snapshot`; missing or stale scope must not infer a successor. An exact language name remains usable without snapshot scope even when it equals a compact ID, while explicit current scope selects the compact ID precisely. Keep internal record keys, compact Entity IDs, names, and handles distinct. Use the short Unicode snapshot label only for recognition; commands and JSON retain the full scope. [[Snapshot-scoped references](decisions/initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped)]

## CLI operation

- Include explicit CLI and project invocation paths in suggested commands, and shell-quote their arguments when necessary.
- Put options before `--` and the literal selector after it.
- Keep operational invocation paths separate from discovered source evidence and domain identity.
- Report distinct enforced output-location boundaries in run qualification counts, not a census of generated files.

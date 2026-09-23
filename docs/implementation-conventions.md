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

- When changing analysis, record, handle, or projection semantics, update the responsible identity method version to reflect the change. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]

## Selection and session references

- One-shot inspection accepts one exact name or generated handle and retains every match. Compact IDs and internal record keys belong to the producing session, without cross-invocation navigation. Library projection selection separates precise compact references from name/handle lookup. [[Session references](decisions/transient-analysis-sessions.md#stable-reference-bindings-within-a-session)]
- Generate mnemonic handles from language names, extensionless basenames, or declared exports, with honest anonymity and explicit provenance. Generic basenames fall back to representative exports. Prefix cues matching `module-` or `group-` plus 8–64 lowercase hexadecimal characters with `handle-`; exact language names remain unchanged.
- Session IDs are random namespaces. Preserve captured input and method support in separate records referenced by provider Claim context; do not use the session identifier as input evidence. Record-key construction removes the current session namespace from its local digest input to keep semantic ordering independent of random UUIDs. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]
- The one-shot checkpoint abbreviates module/group IDs against the complete request population, extending collisions. The following accumulation checkpoint must replace population-wide reallocation with growth-safe stable bindings before exposing multiple commands.
- Equivalent-run tests rename session prefixes consistently while retaining all record relationships, evidence, qualifications, ordering and omissions. Do not discard referenced relationships to make comparisons pass.

## CLI operation

- Open one configured project per short-lived session. The current checkpoint executes one request and closes its transient state.
- Keep operational invocation paths separate from source evidence and domain identity. No generated next-command strings or corresponding presentation fields remain.
- Put options before `--` and a literal option-like selector after it.
- Report distinct enforced output-location boundaries in run qualification counts, not a census of generated files.

## Local observation sink

- Write each version-one command batch as one JSON file beneath a UTC date directory named `date=YYYY-MM-DD` in the PostCode development checkout's ignored `_observations/` directory. Begin each filename with the filesystem-safe UTC timestamp `timestamp=YYYY-MM-DDTHH-MM-SS.sssZ_` and follow it with the batch UUID.
- Include the session identifier and command order in each self-contained batch; the one-shot command ordinal is 1.
- Use the PostCode working tree containing the running CLI build as the local sink destination, independently of the selected project's configuration directory. Do not send observations to a remote or shared sink under the current configuration. [[Send to a sink and forget](decisions/initial-observation-recording-decisions.md#send-to-a-sink-and-forget)]
- Disclose the absolute local destination on stderr.
- Treat local observation files as potentially sensitive because they can contain repository context, selection inputs, documentation, qualifications, the qualified view artifact, the exact rendered output, and explicitly requested source detail. Create new sink and date directories with mode `0700` and files with mode `0600`; leave permissions of pre-existing directories under their owner's control.

## Source-detail presentation

- Organization/group views use the experimental `postcode-organization-view/1-experimental` schema; module-only views use `postcode-view/1-experimental` and dependency views use `postcode-dependency-view/1-experimental`. Mixed inspection embeds module detail and sections the subject kinds. Declare group details and the common module-standard expansions before evaluation so rendering consumes only materialized information.
- Group source detail includes captured absolute repository/group paths and repository-relative artifact paths and metadata, without reading or reproducing contents. Source-escape observations distinguish organization paths, module locations/excerpts, and mixed disclosure.
- Unicode organization bounds recursive display to 150 distinct groups, depth 6, and 12 direct module leaves per expanded group. Record pruning, repeated references, omitted selected groups, and omitted placements separately. JSON retains full selected structure; inspection retains all direct relationships and summarizes other artifacts by counts.

- Store file associations separately from precise source spans. Represent spans with one-based UTF-16 columns and exclusive ends.
- Expose source detail only through an explicit inspection expansion and group it by conceptual module and export labels. [[Conceptual presentation and source escape](decisions/initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape)]
- Preserve module and export containment in source presentation, and distinguish forwarding declarations from semantic-symbol definitions. [[Conceptual presentation and source escape](decisions/initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape)]
- Expand a narrow compiler span to its enclosing statement when that context makes the evidence intelligible, while keeping excerpts bounded and qualified.
- Treat Unicode documentation height limits as presentation policy. Preserve the stored assertions and count additional characters or tags omitted by the height limit in the qualified view.

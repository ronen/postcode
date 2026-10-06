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
- Run `npm run check` to check types without emitting. Run `npm test` to build and execute the tests. Fresh-process tests resolve their own compiled build through `import.meta.url`, rather than assuming a shared checkout build.
- Collect observation batches in sink callbacks and assert in the test body. Interaction-driving callbacks capture errors, finish cleanup and rethrow in the test. Use shared CLI collection and explicitly opt into expected sink warnings; register temporary-fixture cleanup immediately after acquisition.

## Identity method versions

- When changing analysis, record, handle, or projection semantics, update the responsible identity method version to reflect the change. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]

## Qualified construction and arrangement

- Keep the current module, organization, dependency and investigation core content independent of CLI limits, terminal fitting and format/source choices. Resolve fixed retained references before arrangement; subsequent history changes require another core selection. [[Construction boundary](decisions/qualified-projection-construction.md#separate-qualified-construction-from-arrangement)]
- Pass arrangement only the selected content, presentation/reporting inputs and coordinated bindings or the validated binding-only capability. Do not pass a store, lookup callback or history-refresh closure. Keep existing allocation populations and order explicit in coordination and arrangement.
- Carry investigation's usage-independent arrangement key in the worker envelope. Finalize usage with that explicit key; do not add it to public JSON or reconstruct it from a bounded View. [[Identity separation](decisions/qualified-projection-construction.md#separate-projection-identity-from-presentation-and-reporting-identity)]

## Selection and session references

- One-shot inspection accepts one exact name or generated handle and retains every match. Compact IDs and internal record keys belong to the producing session, without cross-invocation navigation. Library projection selection separates precise compact references from name/handle lookup. [[Session references](decisions/transient-analysis-sessions.md#stable-reference-bindings-within-a-session)]
- Generate mnemonic handles from language names, extensionless basenames, or declared exports, with honest anonymity and explicit provenance. Generic basenames fall back to representative exports. Prefix cues matching `module-` or `group-` plus 8–64 lowercase hexadecimal characters with `handle-`; exact language names remain unchanged.
- Session IDs are random namespaces. Preserve captured input and method support in separate records referenced by provider Claim context; do not use the session identifier as input evidence. Record-key construction normalizes the producing session only in explicitly identified reference positions, using `identityReference`; names, paths, selectors used as literals, prose and captured input values remain unchanged. Foreign references retain their namespace. At mixed reference/literal positions such as selectors, encode a resolved reference as an object distinct from every literal string. This keeps semantic ordering independent of random UUIDs without changing literal evidence. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]
- Validate a complete entity-reference request before allocating compact references through the store’s session-owned binding map. Allocate new references together per session/kind in deterministic order; separate calls remain append-only and are not order-independent. Once assigned, a spelling cannot be stolen or extended; only a new colliding allocation is lengthened. Shell `@` selectors request precise references; `--` preserves literal reserved-looking names.
- Equivalent-run tests use the shared reference-aware comparison policy in `test/comparison.ts`. Establish the producing session from the structured result (or supply it explicitly for bare reference collections); normalize only reference fields and the Unicode session heading. Preserve foreign references, literal evidence, qualifications, ordering, omissions and the exact JSON layout. Keep deliberate method/identity differences explicit in comparison reports. Do not discard referenced relationships to make comparisons pass.

## CLI operation

- Open one configured project per session. One-shot use executes one request; the terminal shell retains state through successive requests and closes on exit, EOF, invalidation or interruption.
- Keep operational invocation paths separate from source evidence and domain identity. No generated next-command strings or corresponding presentation fields remain.
- Put options before `--` and a literal option-like selector after it.
- Scan options with Node's strict `util.parseArgs` before applying PostCode lens/selector rules or help. Reject repeated/empty project values and shell project changes before honoring help; boolean repeats are idempotent. Keep shell word tokenization separate from option scanning.
- Report distinct enforced output-location boundaries in run qualification counts, not a census of generated files.

## Local observation sink

- Bind each local sink to the configured project at construction. Write new version-one batches to `_observations/<label>-<key>/YYYY-MM-DD/HH-mm-ss.sssZ_<batch-uuid>.json`, using one UTC submission timestamp. Derive the label from the configuration directory basename: NFKD normalization, ASCII letters/digits/underscore/hyphen, other runs replaced with hyphens, trimmed edge hyphens, 64-character limit, lowercase, and `project` fallback. The key is the first six hexadecimal SHA-256 characters of the normalized absolute configuration path. It is local organization, not domain identity. Preserve existing files at their current paths.
- Exclusively create a private staging file in the selected date directory, write and close it, then create the final hard link without replacement. Link creation commits acceptance; subsequent staging unlink failure is a cleanup warning, not non-delivery. Remove only owned staging paths. Unsupported publication fails visibly; no overwrite fallback, power-loss durability or automatic scavenging is provided. [[Local observation acceptance](decisions/local-observation-acceptance.md)]
- Include the session identifier and command order in each self-contained batch; the one-shot command ordinal is 1. Record a command outcome and actual stdout/status stderr. Distinguish expected analysis failure (`failed`/`command-failed`) from an unexpected defect (`defect`/`command-defect`). A command without a view must not emit view-produced or source-escape events.
- Use the PostCode working tree containing the running CLI build as the local sink destination, independently of the selected project's configuration directory. Do not send observations to a remote or shared sink under the current configuration. [[Send to a sink and forget](decisions/initial-observation-recording-decisions.md#send-to-a-sink-and-forget)]
- Disclose the absolute project-specific local destination on stderr; exclude the entire observation root from evidence.
- Treat local observation files as potentially sensitive because they can contain repository context, selection inputs, documentation, qualifications, the qualified view artifact, the exact rendered output, and explicitly requested source detail. Create new sink, project and date directories with mode `0700` and files with mode `0600`; leave permissions of pre-existing directories under their owner's control.

## Source-detail presentation

- Organization/group views use the experimental `postcode-organization-view/1-experimental` schema; module-only views use `postcode-view/1-experimental` and dependency views use `postcode-dependency-view/1-experimental`. Mixed inspection embeds module detail and sections the subject kinds. Declare group details and the common module-standard expansions before evaluation so rendering consumes only materialized information.
- Group source detail includes captured absolute repository/group paths and repository-relative artifact paths and metadata, without reading or reproducing contents. Source-escape observations distinguish organization paths, module locations/excerpts, and mixed disclosure.
- Unicode organization bounds recursive display to 150 distinct groups, depth 6, and 12 direct module leaves per expanded group. Record pruning, repeated references, omitted selected groups, and omitted placements separately. JSON retains full selected structure; inspection retains all direct relationships and summarizes other artifacts by counts.

- Store file associations separately from precise source spans. Represent spans with one-based UTF-16 columns and exclusive ends.
- Expose source detail only through an explicit inspection expansion and group it by conceptual module and export labels. [[Conceptual presentation and source escape](decisions/initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape)]
- Preserve module and export containment in source presentation, and distinguish forwarding declarations from semantic-symbol definitions. [[Conceptual presentation and source escape](decisions/initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape)]
- Expand a narrow compiler span to its enclosing statement when that context makes the evidence intelligible, while keeping excerpts bounded and qualified.
- Treat Unicode documentation height limits as presentation policy. Preserve the stored assertions and count additional characters or tags omitted by the height limit in the qualified view.
- Use `string-width` with narrow ambiguous characters and `Intl.Segmenter` graphemes for terminal cells, wrapping and fit checks. Escape tabs and CR visibly, retain structured LF, and keep escaped tokens indivisible. Preserve original spelling and original-code-point omission counts; disclose indivisible text that exceeds the available width. JSON and stored source coordinates retain their existing text/UTF-16 conventions.

## Accumulation and interactive execution

- Test investigator coordination through `test/investigator-double.ts`, replacing only the agent communication participant. Keep real evidence evaluation, acquisition, context delivery and whole-result validation in those tests. Routine tests use no inference credentials. Keep attempt usage outside disposable dialogue state and mark synthetic reports explicitly. [[Investigator execution](decisions/investigator-execution-and-evidence-access.md)]

- Prepare processing indexes over the selected immutable view/evaluation inputs, preserving original ordinals when merging evidence buckets. Artifact/placement indexes use weak capture/layout keys; they do not refresh or cache filesystem observations. Keep ordered export surfaces alongside name lookups.
- Keep Stately imports, encoded topology identifiers and mutable ephemeral graphs inside the directed-graph adapter. PostCode owns selected populations, sorting, all supporting claims and display traversal. Use explicit-direction, membership-checked DFS and sanctioned edge addition for sequential containment acceptance. [[Graph delegation](decisions/graph-kernel-delegation.md)]

- Retain provider discovery and completed work by declared requirements. Keep the module evaluation basis and its expansions together; never broaden projections by selecting the accumulated store indiscriminately. Reuse complete module and expansion outcomes. Reuse partial outcomes only when the provider explicitly supplies a captured `retryBasis` asserting stability until further input acquisition. Validate that basis as analysis inputs in the same session; providers without it still retry. The TypeScript provider keys partial caches by its append-only acquisition revision and reassesses them after dependency input acquisition. Do not add outer module/dependency caches that hide this check. Preserve earlier records when a new input basis permits another attempt. [[Accumulated information](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)]
- Evaluators return the immutable store-owned record after insertion. Publish a module outcome and its requested expansion outcomes atomically; a rejected expansion cannot leave a root-only attempt. The store still validates every submitted record and retains existing owned objects after an identical validated resubmission. Provider-owned discovery results are deeply frozen before returning them.
- Pure organization derivations use deterministic record lookup over immutable supporting records, including partial and unavailable outcomes. This differs from provider acquisition/retry rules; repeated derivation cannot refresh a captured basis. Share completed execution/full materialization checks while keeping availability and applicability conditions explicit at each consumer.
- Keep existing claim-context input references when reusing established information. Read first-established support from the stored Claim context. Newly acquired input records support newly established contexts; the store still rejects any conflicting replacement.
- Run both CLI entry paths through one private compiler worker, with one operation in flight and operation-tagged replies. Keep asynchronous Git child handles, exit monitoring and observation delivery in the parent. Direct session users await opening, execution, validation and close, with Git owned in their calling process. Disposal settles pending work and prevents late publication; cleanup reports remain separately awaitable. Share execution errors at the neutral execution boundary. No public transport or stdin batch API is established. [[Execution ownership](decisions/execution-ownership-and-cancellation.md)]
- Snapshot caller output locations into one live exclusion policy shared by compiler and repository acquisition. Re-resolve the captured boundary at each existing validation phase, including missing/dangling targets and aliases; refuse opening when it cannot be established. Retain failed ordinary candidate probes as compiler absence and replay their recovery. Compare missing output suffixes using observed filesystem case handling, without creating probe files or changing stored path spellings. Keep captured source-link resolution separate. [[Generated-output boundaries](decisions/generated-output-boundaries.md)]
- Validate captured compiler probes and repository evidence around command execution/publication. Replay compares against the retained compiler observations without recording new observations or advancing acquisition revision. Direct execution validates before and after work; the CLI explicitly defers the latter check to its publisher, which checks after result delivery before output and again after output. A caller using `deferPublicationCheck` owns that pre-output check. Detection invalidates rather than refreshes. The CLI reference specifies actual coverage and unavoidable gaps. [[Stable inputs](decisions/transient-analysis-sessions.md#stable-inputs-as-the-session-precondition)]
- Share qualification prose represented in run summaries through `qualification-policy.ts`. Classify composition contexts only when the primary producer (the first method token) exactly matches the registered composition method. Inherited composition provenance does not classify a derived context or suppress its limitations; distinct provider identities must not accidentally suppress each other’s qualifications.
- Compare full structured views and rendered output for fresh, accumulating and reordered requests. Consistent reference normalization must retain repeated-row reference markers and all evidence, relationships, qualification, omissions and ordering.

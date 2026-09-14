# Application Development Conventions

These conventions supplement the adopted [baseline conventions](../foundation/baseline-conventions.md). Keep this document concrete and current as the implementation and toolchain emerge.

## Repository Structure

- Put application source under `src/`.
- Prefer logical internal boundaries under `src/lib/` until there is evidence that a component needs an independently versioned package boundary.
- Create directories when they receive meaningful content; do not use placeholder files to materialize a speculative structure.
- Keep test fixtures under `fixtures/` when they represent repositories or external inputs rather than unit-local test data.

## Provisional Working Material

- Put repository-specific scratch files and directories under a descriptively named root-level directory beginning with `_`, such as `_analysis/`, `_investigation/`, or `_rendered/`. The root `.gitignore` reserves this namespace for uncommitted working material.
- `_work/TASK.md` is a governed task-drafting and handoff artifact, not ordinary scratch material. Handle it only as prescribed by the [task protocol](../foundation/task-protocol.md).
- Except for the task-intake role of `_work/TASK.md` defined by the governing task protocol, content under a root underscore directory is provisional and non-governing, regardless of any status or approval language it contains. To become durable or governing, content must be moved or incorporated into its appropriate non-underscore repository location and satisfy any applicable approval and commit requirements for that document type.
- Treat underscore directories as disposable. Do not use them as the sole location of durable project knowledge, implementation, committed generated artifacts, configuration, or documentation. Remove scratch material that you created when it is no longer useful; do not remove pre-existing scratch material without human direction or clear ownership.
- Do not create project-local `.codex`, `.claude`, or similar tool-specific directories for scratch work.
- A Git-ignored directory is still inside the observed repository. Do not use underscore directories for information that is required to remain outside that repository.
- Committed or otherwise durable project material must not depend on content under an underscore directory. Treat such a dependency as an unexpected finding and report it rather than using the underscore content as authoritative.

Use [`drafts/`](../drafts/) when provisional planning material is worth preserving in Git for review, comparison, or continuity across sessions. Draft artifacts are durable but non-governing: neither committing them nor placing approval language within them gives them the role of a plan, decision, or other canonical project document. Agents may use them as planning context, but not as binding requirements.

Keep canonical project material independent of draft artifacts. Do not cite a draft artifact as context required to understand canonical project material. When draft artifacts are promoted, carry the necessary context into the resulting canonical documents and link those documents to one another; Git history may preserve their shared drafting provenance. The human directs promotion, and content moved or incorporated into a canonical location must independently satisfy the approval requirements for that document type. Treat a canonical document that depends on a draft artifact as an unexpected finding.

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

The initial slice uses Node.js 22.13 or later, TypeScript, ECMAScript modules,
and npm with a committed lockfile. Install with `npm ci`. TypeScript's compiler
API is also the runtime language analyzer. Version 6.0.3 is pinned because this
slice targets its documented JavaScript compiler API; compiler upgrades require
re-running semantic fixtures and checking identity method versions.

- `typescript` provides the analyzer and `tsc` build/type check. It is the only
  direct runtime dependency. Its upstream is Microsoft's TypeScript project.
- `@types/node` 22.20.2 provides compile-time declarations for Node APIs.
  Its transitive `undici-types` dependency supplies HTTP API declarations used
  by those types; neither adds a runtime observation transport.
- Node's built-in test runner and assertions provide tests without a separate
  test framework or transpilation runner. npm is installation/build orchestration.

Use strict checking, explicit type-only imports, `.js` relative import specifiers,
two-space indentation, single-quoted TypeScript strings, and semicolons. Keep
compiler imports under the TypeScript integration. Do not expose compiler nodes
or symbols through program-domain interfaces. Tests use the real compiler with
small fixtures; synthetic providers are appropriate for evaluation states that
the eager first provider does not normally produce.

`npm run check` checks types without emitting; `npm test` builds and runs tests.
Build output lives under Git-ignored `_build/`. Repository-input fixtures live in
`fixtures/`, outside the application's compile include list. Tests can create
temporary projects through Node's temporary directory and must clean them up.
The internal test process probe is not a supported application CLI or JSON schema.

Inspection accepts one exact referent (name, handle, or Entity ID), which can
resolve to zero, one, or multiple subjects. Multiple input referents and list
selector syntax remain deferred by the initial plan; this is distinct from
multiple matches of one referent.

Generated mnemonic handles use language names, extensionless source basenames or
declared exports, never snapshot hash text. Retain generated status and provenance;
a basename cue is not a conceptual name or a responsibility classification.
Generic basenames fall back to representative exports or honest anonymity.
Reserve compact Entity-ID syntax (`module-` plus 8–64 lowercase hexadecimal
characters) by prefixing matching generated handles with `handle-`. Apply this
after cue normalization, regardless of cue provenance; exact language names remain unchanged.

Compact module Entity IDs abbreviate record-key digests against the entire module
population, extending prefixes on collision. Compute the same mapping for inventory
and inspection, including collapsed modules. Handles and compact IDs require the
full snapshot through `--snapshot`; missing or stale scope cannot infer successors.
An exact language name remains usable without snapshot scope even when it equals
a compact ID. With explicit current scope, compact ID selection stays precise.
Keep internal record keys, compact Entity IDs, names and handles distinct. The short
Unicode snapshot label is for recognition; commands and JSON retain the full scope.

Suggested commands include explicit CLI/project invocation paths and shell-quote
their arguments. Put options before `--` and the literal selector after it. Keep
those operational paths separate from discovered source
evidence and from domain identity. Run qualification counts report distinct
enforced output-location boundaries, not a census of generated files.

Method versions in the identity module participate in snapshot identity. Bump
the responsible version when changing analysis, record, handle, or projection
semantics. Equivalent runs must not include clocks or random observation UUIDs
in program-record identity or structured projection output.

### Local development observation sink selection

Implemented for this task: one version-zero invocation batch per local JSON file under a
UTC date directory named `date=YYYY-MM-DD` in the PostCode development checkout's
`_observations/` directory. Filenames begin with a filesystem-safe UTC timestamp as
`timestamp=YYYY-MM-DDTHH-MM-SS.sssZ_`, followed by the batch UUID. The destination is
the PostCode checkout, independently of the selected project's configuration
directory. The root underscore rule ignores it in Git. No remote or shared sink
is selected.

The CLI discloses the absolute local destination on stderr, escaping terminal
controls in its displayed value without changing the actual path. Diagnostic and
warning values use the same inline escaping policy. Files may contain
repository context, selection inputs, documentation, qualifications, the qualified
view artifact, the exact rendered output, and explicitly requested source detail.
The sink creates its root and dated directories with mode `0700` and files with
mode `0600`; pre-existing directory permissions remain the local owner's responsibility.
No real-project observations may be committed without human approval.

The caller must explicitly supply the actual observation directory to project
opening's output-exclusion boundary before any analysis, even when analyzing a
parent repository or a configuration outside the PostCode checkout. The same
requirement applies to retained views, reports, and other generated outputs.
Do not infer excluded output from target directory names: configured sources under
`_build` or `_observations` remain inputs unless the caller identifies those paths
as actual output destinations.
The destination choice does not impose retention, migration, historical-reading,
or producer-side cache policy. Delivery failure must be visible while preserving
a successfully produced view. The CLI and sink have automated delivery, privacy-mode, exact-output and nested-configuration
exclusion checks. Instrument validation and independent reviews are recorded in
the [initial task](../records/tasks/2026-09-12-initial-module-inventory.md).

Source evidence stores file associations separately from precise spans. Span ranges
use one-based UTF-16 columns and exclusive ends. Bounded excerpts come from captured
compiler input, never a presentation-time filesystem read. Source disclosure remains
an explicit inspection expansion, grouped by conceptual labels, with its actual
locations-and-excerpts level recorded in the source-escape event.

Source presentation must preserve module/export containment and distinguish
forwarding from semantic-symbol definition. Enclosing statement evidence may make
a narrow compiler span intelligible, but excerpts stay bounded and qualified.
Unicode documentation height limits are presentation policy; preserve stored
assertions and count the additional omitted characters/tags in the qualified view.

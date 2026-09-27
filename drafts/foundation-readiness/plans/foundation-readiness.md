# Foundation readiness

Status: in review
Created: 2026-09-27
Updated: 2026-09-27
Superseded by:

## Objective and outcome

Establish a solid, well-implemented foundation for ongoing PostCode development. Reduce ongoing ownership of generic mechanisms; make shared policies authoritative; make state and resource ownership dependable; remove demonstrated avoidable processing; and make verification capable of detecting meaningful regressions. Current migration effort receives less weight than long-term fit and maintainability.

Success is an integrated implementation with suitable library boundaries, clear ownership and qualification rules, exercised failure paths, credible equivalence checks, and representative scale measurements. A collection of closed audit findings alone is insufficient.

Success also requires preserving current analysis content, evidence, qualifications, selection, ordering, presentation and command outcomes, except for the CLI invocation syntax changes and the explicit behavioral fixes below. Library adoption, helper consolidation and indexing must not introduce incidental behavior changes.

| Intended change | Boundary of the exception |
| --- | --- |
| CLI option grammar | The [option grammar in package 8](#option-grammar), including inline values, option-like selectors, duplicate options and help/error precedence. Lens and selector meanings remain unchanged. |
| Reference identity | Preserve literal session-shaped text in identity keys; change affected IDs, method versions and ID-derived ordering only as required by this correction. |
| Immutable and atomic results | Prevent producer/consumer mutation of retained outcomes and prevent root-only publication when a coupled expansion is rejected. |
| Acquisition and execution failures | Apply one output boundary; refuse unverifiable boundaries; cancel owned Git work and enforce the per-call deadline. After confirmed cleanup, an opening Git timeout produces unavailable repository evidence with an explicit timeout qualification; subsequent recovery changes the capture basis and requires restart. Assess the responsible method version for this new qualification. Settle failed sends and late work correctly, retaining existing failure distinctions and input-validation coverage. |
| Observation files | Group new files by observed project and UTC date with simpler time/UUID filenames. Expose only complete final files, preserve existing files on collision, and distinguish published-with-cleanup-warning from non-delivery. Existing files retain their paths. |
| Terminal layout | Correct display width and grapheme splitting, visibly escape tabs, and disclose omissions under the specified layout policy. Preserve stored text, source coordinates and original-code-point omission accounting. |

Verify each intended difference explicitly, then compare all unaffected behavior against the relevant baseline. Do not broaden these exceptions to cover regressions found during migration.

## Context

The [eight audits](../../records/audits/2026-09-27-foundation-readiness/README.md) identified concrete weaknesses in verification, ownership, acquisition, generic algorithms and repeated processing. This plan addresses those weaknesses while retaining qualified records, immutable storage, selected projections, direct TypeScript integration, Git-backed evidence and transient sessions.

The [module-investigation plan](module-investigation.md) and [investigator execution decision](../decisions/investigator-execution-and-evidence-access.md) define the upcoming integration boundary. This slice establishes the shared foundations used by that work without implementing the investigator or its new lenses.

External graph delegation is worthwhile, and Stately is the selected library for the existing graph operations, subject to the per-operation exceptions in [package 6](#6-adopt-stately-for-existing-graph-responsibilities).

## Key technical positions

| Area | Position |
| --- | --- |
| Equivalence comparison | Necessary verification repair before structural refactoring. Replace global textual substitution with consistent reference-aware comparison. Preserve literal text, qualifications, ordering, and relationships. |
| Reference identity | Include a distinct identity correction. Normalize explicit reference positions in key construction, never arbitrary strings. Review method versions and semantic ordering. This is not an ordinary equivalence-preserving optimization. |
| Immutable ownership and atomic publication | Apply one ownership rule across evaluators and provider boundaries. Return store-owned records; protect retained provider data; make coupled root/expansion publication one atomic batch. |
| Pure-derivation reuse | Prefer lookup by deterministic record ID through a small non-throwing store lookup, removing duplicate session caches. Preserve provider acquisition/retry rules separately. Organization itself mainly repeats when repository evidence is unavailable; relationship organization also repeats for ordinary external endpoints. |
| Evaluation-state predicates | Inspect every use by meaning and write a state/consumer matrix. Share identical decisions. Do not infer a universal validity rule solely from today's eager provider. A single reuse/established predicate would conflate different questions. Resolve any actual contradiction explicitly. |
| Stately graph integration | Adopt for each SCC, incremental containment cycle-check, ancestry and upward-closure operation unless the documented simplicity, semantic-fit or performance exception applies. Encode empty root IDs; use supported mutation operations; preserve all parallel supporting claims; prefer explicit-direction DFS reachability. Preserve deterministic acceptance and output ordering. |
| Terminal wrapping | Adopt `string-width` and `Intl.Segmenter`; retain the small PostCode wrapping/continuation policy. The assessed `wrap-ansi` changes whitespace/tabs and normalizes Unicode. This is a semantic-fit reason, independent of migration cost. |
| Git cancellation and deadlines | A timeout signal alone does not guarantee a deadline: the [archived timeout probe](../../records/audits/2026-09-27-foundation-readiness/foundation-readiness/codex/timeout-results.json) recorded a child handling SIGTERM and exiting later. Separate request rejection, child exit, worker exit, and whole-operation deadline claims. |
| Exclusion resolution | Establish one live output-exclusion authority shared by compiler and repository acquisition. Keep captured source-link resolution separate. Memoization must retain boundary-retargeting detection. |
| Observation publication | Prefer private staging followed by no-overwrite publication and cleanup. Plain rename can overwrite an existing batch. Atomic final-name visibility and power-loss durability are different guarantees. |
| Store restructuring and indexing | Add the lookup needed for pure derivations now. Include a narrowly scoped evaluation index if it cleanly removes the existing store-wide query scan; update it only after batch validation. Decompose validators when responsibility warrants it, rather than because a switch is long or new record kinds are anticipated. |
| Compact reference allocation | Allocate each current batch together, grouped by session/kind, preserving previous bindings. This improves ordering within a batch; it cannot promise order independence across separate calls when bindings are append-only. |
| Presentation qualification policy | Include a shared, explicit qualification/classification boundary. Shared constants may suffice for existing prose; introduce record codes only when their semantic value justifies the representation/version change. |

## Implementation work packages

The eight work packages form one slice. The smaller-cleanup checklist below is explicit scope within these packages. The milestones group delivery and review around the responsibility boundaries established by the work.

### 1. Verification that can reject incorrect results

Scope:

- Move sink assertions into the test body. Interaction-driving callbacks must record failures, finish cleanup, and rethrow rather than stall.
- Share CLI invocation, observation collection, and immediately registered fixture cleanup. Permit intentionally expected warnings explicitly; do not break sink-failure tests with an unconditional no-warning rule.
- Replace broad namespace substitution in comparisons. Establish the producing session and valid reference mapping, compare reference fields consistently, and preserve arbitrary literal text.
- Pin graph member/component ordering, child/root indices, incomplete-root qualification, and all supporting claims with independent expected results.
- Repair interruption-probe phase markers and independent resource cleanup.
- Expand comparison coverage to full structured views and rendered/observed output, all affected lenses, source detail, accumulating/reordered requests, and a deterministic generated scale case.

Acceptance: legitimate consistent renaming compares equal; altered foreign references, literal namespace-shaped text, qualifications, omissions, relationships, and order fail. Deliberately falsified sink expectations fail as assertions, not timeouts. Separate builds of the same source compare equal. Real worker and sink failure tests are completed with their implementation packages.

Dependency: first. Introduce operation-count guards when implementing indexing, so the initial verification package need not assert performance the baseline does not yet achieve.

### 2. Immutable ownership, atomic outcomes, and principled reuse

Scope:

- Evaluators return immutable store-owned values after successful insertion; cache those values or their IDs.
- Protect provider-retained arrays/objects from consumer mutation without adding redundant copying everywhere.
- Construct module and expansion outcomes together and insert them in one atomic batch. Preserve independently acquired evidence and valid partial results.
- Add a non-throwing record lookup. Pure organization derivations reuse deterministic IDs over complete immutable bases, including partial/unavailable results; remove redundant session derivation maps.
- Preserve provider `retryBasis`, acquisition revision checks, first-established supporting inputs, and historical records.
- Use the new store lookup to retrieve already-established claim-context input support, removing the provider's duplicate `support` map where the same first-established basis can be read directly. Never replace historical support with the latest input basis.
- Consolidate identical outcome predicates by their meaning, retaining the current availability/applicability conditions at each consumer. Preserve the independent state dimensions and current store validity rules; no new global validity restriction is introduced. Record the call-site matrix as verification of this preservation.
- Add a private evaluation query index only for the concrete existing query, with publication after successful validation. Validate whole entity batches before allocating bindings.

Acceptance: producer/consumer mutation cannot affect stored or reused results or later provider discovery; invalid coupled publication leaves no root-only outcome; rejected batches leave no index/binding residue; repeated pure partial results perform no resubmission; a genuinely different basis derives a new result. Existing partial-provider retries still work.

Dependency: package 1. The state/consumer matrix verifies preserved semantics; it does not establish new state constraints.

### 3. Reference identity and authoritative presentation policy

Scope:

- Replace textual namespace removal in identity keys with explicit reference normalization. Enumerate key-construction callers so literal text and actual references remain distinguishable.
- Retain canonical serialization, native hashing, and append-only compact bindings.
- Review affected method versions, including any order derived from IDs. Document intentional identity/order differences rather than teaching the comparator to erase them. Update [Selection and session references](../implementation-conventions.md#selection-and-session-references) to state that local references are normalized in explicit reference positions while literal text remains unchanged.
- Replace duplicated presentation qualification strings and method-prefix classification with a shared application-owned policy appropriate to the existing record model.

Acceptance: literal session text remains distinguishable from the word `session`; same-session references normalize consistently; foreign references cannot be silently treated as local; collision rejection and existing bindings remain correct. Qualification appears exactly as intended regardless of presentation/provider wording changes.

Dependency: package 1 and ownership work. Establish an explicitly versioned baseline after identity changes. Graph/performance migrations compare against that baseline, rather than claiming byte equality across an intentional identity change.

### 4. Shared acquisition policy and dependable execution ownership

Scope:

- Resolve caller-supplied generated-output boundaries once into a shared policy, snapshot caller options, share equivalent containment/error classification, and preserve subsequent verification of the boundary.
- Keep platform paths, repository-relative paths, apparent identities, and captured source-link semantics distinct.
- Use parent-owned asynchronous Git subprocesses and asynchronous command validation under the [execution policy](../decisions/execution-ownership-and-cancellation.md), keeping compiler work in the private worker and parent-owned observation delivery.
- Keep Git handles and exit monitoring in the parent so ownership survives worker termination. Direct session users use the same execution owner in their calling process. Propagate asynchronous opening and validation through direct callers, including `scripts/measure-session-journey.mjs`, and CLI publishers, not only the shell wrapper. Preserve Git environment sanitation, bounded output and decoding checks.
- Repair synchronous send failure, close-while-pending, unexpected exit, and late-response handling; identify operations across asynchronous messages where required.
- Put common execution errors/contracts at a neutral boundary. Keep one active operation and terminal interruption behavior; no worker pool or transparent restart.
- Retain worker termination as disposal and remove the unused worker `close` message and handler. The parent-owned Git lifecycle handles child cancellation independently.
- Preserve current validation/publication phases and coverage. Precompute retained snapshot serialization, compare primitive values directly, and memoize only where replay still detects changes.

#### Timeouts and cleanup

Apply the following timeout and cleanup behavior. Choose and justify reasonable numeric limits during implementation, accounting for representative Git workloads, interactive responsiveness and supported-platform behavior.

| Event | Required response |
| --- | --- |
| A Git invocation exceeds its operation deadline | Fail that invocation as an expected operational timeout, prevent its late result from being accepted, and begin cancellation. The timer covers one invocation, not all Git calls in an operation. |
| User interruption, disposal, worker exit, or Git timeout | Cancel the affected work and request graceful termination of its owned Git children immediately. A Git timeout cancels that acquisition; after confirmed cleanup, opening may continue with qualified unavailability. User interruption remains terminal for the session and uses the existing interrupted outcome/status 130. |
| A child has not exited within the termination grace period | Request forced termination of that owned child. On POSIX use SIGTERM followed by SIGKILL; on a platform without that graceful distinction use the supported forced-termination operation directly. Do not claim descendant-tree termination from a child-handle signal. |
| Cleanup remains unconfirmed when the cleanup-reporting deadline expires | Settle the cleanup wait with an explicit incomplete-cleanup failure identifying the still-owned resource. Report it separately from the triggering interruption/failure; never report successful cleanup. Retain ownership and exit monitoring until actual exit, and forbid further work on the disposed session. |

Document the selected per-invocation deadline, termination grace period and cleanup-reporting deadline, including when each clock starts and the rationale for its value. Verify escalation and incomplete-cleanup reporting with controlled failure cases. Tests may use controlled clocks or shorter injected limits while separately checking production configuration. Numeric tuning is an implementation choice within this policy.

During opening, a Git acquisition timeout follows the existing unavailable-repository-evidence path after confirmed child cleanup. Capture the timeout as an operational reason without publishing partial repository evidence or treating it as an established empty repository. Validation keeps the existing basis comparison: a previously available capture becoming unavailable invalidates the session; a consistently unavailable capture may remain qualified as unavailable. Include only stable failure qualification in the compared capture, not elapsed time or process IDs. Transition to a different capture basis still invalidates, including an initially timed-out capture becoming available after Git recovers; that transition requires restart. A timeout does not authorize skipping subsequent validation. Assess the repository-input method version for the new timeout qualification.

A cleanup-reporting timeout does not overwrite an interrupted command's status 130 or imply that an OS process has exited. It bounds the wait for a cleanup report, not process lifetime. If opening cannot confirm child cleanup, report an operational resource failure instead of returning a usable session with an unmanaged acquisition still running.

#### Operational failure presentation

For an operational failure that prevents opening, both CLI entry paths use the existing multiline `Project open failed:` heading with indented detail describing the failed operation, relevant escaped path and operational reason. Do not invent a TypeScript diagnostic code. Keep TypeScript diagnostics in their existing format; exact prose is an implementation choice. Refused opening returns status 2 and produces no command view or view-produced observation. A qualified Git acquisition timeout alone is not an opening refusal.

Later input invalidation retains command status `invalidated`, CLI status 2 and restart-required behavior. Preserve already emitted output and truthful observations when a post-output check fails. Unexpected defects retain their existing classification.

#### Verification

Use controlled child-readiness markers and watchdogs to test cancellation during opening and validation, a child ignoring graceful termination, worker failure with an outstanding child, close while pending, send failure and late replies. Assert command settlement and actual child/worker exit separately. Late work cannot publish; send failures cannot leave phantom pending operations or unhandled rejections. Verify escalation and incomplete-cleanup reporting within the [native verification scope](#native-verification-scope) and disclose unverified or unavailable termination behavior. Preserve the first phase marker in the one-shot native compiler interruption probe, interrupt once, and require its control case to pass.

Test opening with timed-out Git and successful cleanup, opening with unconfirmed cleanup, available-to-unavailable validation, timed-out-then-available validation requiring restart, and consistently unavailable captures. Verify that timeout qualification is visible and never establishes an empty repository.

Exercise boundary aliases, missing descendants, dangling/cyclic links, retargeting, reordered/duplicate exclusions and outside-worktree locations across both compiler and repository acquisition. Preserve apparent paths and tracked/ignored distinctions, and assess identity-method versions for changed evidence or qualification semantics. Changed or unverifiable inputs invalidate rather than refresh retained evidence. Preserve current publication-check phases and coverage.

Dependency: package 1; coordinate with package 2. Implement timeouts, termination escalation and incomplete-cleanup reporting together with ownership and asynchronous propagation. The intermediate review covers actual ownership, timer behavior, cleanup reporting and platform limits.

### 5. Organized observation files and truthful delivery outcomes

Implement the [local sink acceptance contract](../decisions/local-observation-acceptance.md) with the following publication and file-organization behavior.

#### Publication mechanics

Write a batch to an exclusively created private staging file in the destination filesystem, complete and close it, then publish its final name without replacement. The final name becomes visible only for a complete batch. Existing destinations remain untouched on collision. Keep current private file/directory creation permissions and destination policy.

Use same-directory hard-link publication followed by staging unlink when supported and verified. Successful creation of the final link is the publication commit point. Before that point, failure means the batch was not published; after it, failure to remove staging means the batch was published with a cleanup problem. Preserve and report that distinction instead of reporting an observation gap or retrying a delivered batch. Only remove staging paths owned by this attempt. A cleanup warning must not turn a successful view into an analysis failure.

Unsupported no-overwrite publication fails visibly through the sink-delivery path. Do not silently use overwriting rename or copying into a partially visible final file as a fallback. Hard kill may leave staging residue; normal exception cleanup does not certify crash cleanup. Automatic scavenging is outside this change.

#### Project grouping and filenames

Store new batches using this layout beneath the existing local observation destination:

```text
_observations/<project-label>-<project-key>/YYYY-MM-DD/HH-mm-ss.sssZ_<batch-uuid>.json
```

The project is the configured project being observed, not the PostCode checkout hosting the sink. Choose a recognizable project label and slugify it into a safe directory component. The label source, fallback and slugification details are implementation choices: a suitable directory name or an available `package.json` name are reasonable candidates. Missing or unusable naming metadata must have a fallback and must not prevent observation delivery.

Append a six-character hexadecimal suffix derived from SHA-256 over the normalized absolute configuration-file path. This provides a compact disambiguator for same-named projects and different configurations. Repeated sessions with the same label and normalized configuration path share a directory; changes to the label or path may produce a different directory. This is local sink organization, not a domain project identity or cross-machine identifier.

Bind the project grouping when constructing the local sink so successful views, refusals, failures and interruptions from that session share it. Do not infer project grouping from the presence of a qualified view in a batch. The generic observation-sink contract and batch schema remain unchanged.

Use one UTC submission timestamp for the date directory and time component. Remove the `date=` and `timestamp=` prefixes and the redundant date in the filename. The batch UUID remains the collision-resistant suffix. Stage within the selected project/date directory and create new directories with mode `0700` and files with mode `0600`, leaving pre-existing permissions unchanged. Disclose the project-specific destination on stderr.

Write only new batches in this layout. Existing files remain at their current paths; this work introduces no migration, historical reader or cleanup of prior observations. The entire observation destination remains excluded from analyzed evidence.

Project-first grouping keeps each project's observations together across dates. The label aids browsing and the stable path-derived suffix disambiguates similar names without a project registry.

#### Verification and documentation

Inject creation, partial-write, close, publication and cleanup failures. Verify final-name completeness, preservation of a pre-existing destination, ownership of cleanup, truthful delivery diagnostics and unchanged successful command output/status. Test the publication mechanism within the [native verification scope](#native-verification-scope), including an injected unsupported-publication failure. Exception tests do not certify hard-kill cleanup or power-loss durability.

Test repeated sessions, different projects sharing a directory basename, multiple configurations in one directory, unsafe or empty labels, batches without views and UTC date rollover. Verify project-specific destination disclosure, staging/publication within the selected directory, permissions on newly created levels and exclusion of the full observation tree. Update [Local observation sink](../implementation-conventions.md#local-observation-sink), [Source detail and observations](../cli-reference.md#source-detail-and-observations), and affected tests. Adapt `scripts/measure-analysis.mjs` to supply project context when constructing its sink, and check every remaining local-sink caller.

Dependency: package 1; otherwise independent. Atomic visibility and cleanup are in scope; no retry queue, historical reader or archival subsystem is introduced.

### 6. Adopt Stately for existing graph responsibilities

For each operation—SCC, containment cycle checks, ancestry and upward closure—adopt Stately unless a local implementation is demonstrably simpler to maintain, preserves required semantics more directly, or avoids a demonstrated performance problem. Record a brief rationale and relevant verification for each exception; existing code and migration effort alone are insufficient reasons. Implementation verifies the selected operations and adapter rather than repeating the overall adoption analysis. The [graph decision](../decisions/graph-kernel-delegation.md) records the rationale and exception criteria.

Scope:

- Pin/review the audited Stately release and its resolved dependency/license requirements. Keep library imports/types and ephemeral graph ownership inside a narrow adapter.
- Retain project-only populations, isolates, all relationship IDs, deterministic sorting, self-loop classification, and incomplete-root gating.
- Preserve sorted sequential containment-link acceptance using sanctioned mutation APIs. Encode the empty repository-root node without changing stored paths.
- Consolidate ancestry and upward closures over selected containment information; retain every supporting edge, including parallel claims, rather than just traversal-tree edges.
- Use explicit-direction, membership-checked DFS for reachability; avoid the assessed `hasPath` queue behavior and recursive/path-enumeration APIs.
- Keep display traversal and future correction-specific citation policy in PostCode.

Acceptance: independent graph-order fixtures, isolates, self-loops, deep chains/cycles, unknown/root node cases, incremental updates, multi-parent diamonds and parallel evidence, full qualified output equivalence after the identity correction establishes its new baseline, and bounded randomized/oracle comparisons. Apply the same semantic and scale checks to delegated and local operations. Validate the actual selected APIs, not only the package's SCC implementation.

Dependency: packages 1 and 3's baseline where identity changes occur; share immutable ownership conventions with package 2. Stately adoption is established; operation-level exceptions and integrated verification follow the graph decision.

### 7. Processing improvements over selected immutable inputs

Scope:

- Prepare composition, documentation/export, group, placement, and relationship indexes once per selected view/evaluation.
- Index artifact/placement paths per immutable capture/layout pair; preserve boundary/link resolution, apparent paths, and redirect limits.
- Group provider results and resolution evidence once; retain export arrays plus name maps; avoid repeated large-span allocation or reuse excerpt calculations per captured span.
- Preserve source/evidence ordering when merging index buckets, including collapsed qualifications and ambiguous associations.
- Include the small membership, rendering, source-detail, and capture lookups enumerated in the cleanup checklist. They need not be individually dominant in a profile to justify a straightforward local simplification.
- Measure local validation optimizations from package 4 separately from view construction. Do not reduce validation passes or coverage in this package.

Acceptance: structured/rendered equivalence with the strengthened comparator; deterministic operation counts across input sizes; representative before/after measurements including repeated commands and many non-module artifacts. Distinguish opening, first lens use in an existing session, steady-state request, and full CLI publication costs. No tight wall-clock assertions in tests.

Dependency: packages 1–2, established identity baseline, and agreed exclusion policy for relevant path changes. Coordinate overlap with graph/containment indexes; do not build competing representations.

### 8. Terminal layout and standard option parsing

#### Terminal layout

Use `string-width` for terminal width and `Intl.Segmenter` for grapheme boundaries, with a thin local policy for wrapping, continuation and disclosure. Preserve original Unicode code-point spelling, apart from deliberate control escaping, wrapping and disclosed truncation. Keep source positions in UTF-16 and omission counts in original code points. Use the same layout calculation for fit checks and actual rendering.

Visibly escape tabs in terminal layout so their width is deterministic; retain exact stored text. Treat ambiguous-width characters as narrow. When an indivisible grapheme exceeds the available budget, disclose omission rather than splitting it or overflowing without qualification. Use the existing visible Unicode-escape spelling (`\u0009`) for tabs. Preserve current control escaping: CR is escaped, LF remains a structured line break in multiline layout, and inline values escape both. Count omitted source code points, not characters introduced by escaping; retained escape tokens and graphemes are indivisible during layout.

Width and segmentation are generic mechanisms; exact evidence spelling and qualification remain application policy. The audited `wrap-ansi` behavior changes whitespace/tabs and normalizes Unicode, so retain the thin local wrapping policy. Pin and verify the selected width-library release during implementation.

#### Option grammar

Use Node's `util.parseArgs` for option scanning. PostCode retains lens and selector interpretation, shell tokenization, conceptual help, controlled errors, observation production and shell project restrictions.

Apply the following grammar consistently to one-shot and shell paths where the option is permitted:

| Input case | Behavior |
| --- | --- |
| `--project=value` | Accept the inline value. |
| Option-looking selector | Require `--` before the literal selector. |
| Dash-prefixed option value | Require inline `--option=-value` form. |
| Literal reserved-looking `@` selector | Preserve literal selection through the existing terminator convention. |
| Unknown/invalid option alongside help | Parse the full input strictly and report the error. |
| Repeated value option | Reject duplicates instead of silently selecting a value. |
| Empty value for a required nonempty option | Report a controlled invocation error. |
| Repeated boolean flag | Treat as idempotent. |

Validate scanner output against the existing lens/selector rules. Help bypasses command-operand validation only after all option scanning and option-value checks succeed; it does not hide unknown options, missing/empty values, duplicate value options, or the shell restriction on `--project`. Both `-h` and `--help` remain supported. No additional short aliases or shell interpolation are introduced.

The runtime scanner replaces bespoke option mechanics; its defaults do not determine PostCode's selection or command policy.

#### Verification and documentation

Test CJK, combining sequences, ZWJ emoji, tabs, CRLF, control escapes, narrow budgets, continuation prefixes and exact omitted-code-point counts. Verify that stored source evidence and UTF-16 coordinates remain unchanged. Exercise the grammar matrix, project restrictions, quoting/tokenization, literal selectors and observation/error behavior in both one-shot and shell interfaces.

Assess affected presentation/method versions and document intentional differences separately from optimization equivalence. Update the CLI reference and relevant implementation conventions to describe the implemented behavior.

Dependency: package 1; can progress independently of graph/performance implementation.

## Smaller cleanups explicitly included

The original audits sometimes called these optional or fix-when-touched. The foundation slice already touches their owning responsibilities, and its objective includes establishing maintainable patterns. Include the concrete cleanups below alongside the relevant package. Small measured impact alone is not a reason to omit them. Preserve semantics; if an apparently simple change reveals a consequential policy choice or requires substantial machinery, report that specific issue rather than silently dropping the item.

Source locations identify the audited baseline, not immutable line numbers. The shared-policy items include the incidental observations from the original [library-reuse audit](../../records/audits/2026-09-27-foundation-readiness/library-reuse/claude/REPORT.md), the smaller lifetime findings from the [Claude state audit](../../records/audits/2026-09-27-foundation-readiness/state-resources/claude/REPORT.md) and [Codex state audit](../../records/audits/2026-09-27-foundation-readiness/state-resources/codex/REPORT.md), and the lookup candidates in the [Claude cost audit, section 5.6](../../records/audits/2026-09-27-foundation-readiness/processing-cost/claude/REPORT.md).

| ID | Concrete cleanup | Package and completion evidence |
| --- | --- | --- |
| C01 | Consolidate repeated CLI invocation and observation-collection helpers in `cli`, `organization-cli`, and `dependency-presentation` tests. Handle explicitly expected warnings separately. | 1: affected tests use the shared responsibility; rescued assertions demonstrably fail when falsified. |
| C02 | Consolidate equivalent temporary-project helpers while keeping fixture contents local. Register cleanup immediately after acquisition, including the `session-inputs` cases that currently open a session before entering cleanup protection. | 1: setup/open failure still removes owned directories and closes any acquired session. Do not merge helpers whose fixture semantics differ. |
| C03 | Fix partial initialization and independent cleanup in `scripts/compare-session-requests.mjs`: protect the first worker before acquiring/opening the second, and attempt both closes even if one fails. | 1: controlled second-open and first-close failures do not skip cleanup of the other worker. |
| C04 | Repair `scripts/probe-compiler-interruption.mjs`: retain the first phase-specific compiler marker and schedule interruption once, rather than overwriting it during validation replay. | 1: both control and interrupted cases verify the intended phases; no weaker assertion substitutes for the failing control. |
| C05 | Consolidate equivalent comparison/reference-normalization helpers used in tests and scripts. | 1: one deliberate normalization policy with positive and negative controls, preserving literal evidence. |
| C06 | Share the duplicated operational I/O error-code classification in `session.ts` and `repository/capture.ts`. | 4: identical classification, with capture/session error translation and narrower absent-path checks kept distinct. |
| C07 | Share equivalent lexical `within`/path-containment helpers and consolidate output-exclusion resolution. | 4: compiler/repository consumers record and apply the same boundary policy; platform, repository-relative, apparent, and captured-source path semantics remain explicit. Resolution choices remain governed by the generated-output boundary decision. |
| C08 | Name and share equivalent completed-materialization predicates; explicitly compose stronger availability/applicability conditions where required. | 2: each audited call site has a justified meaning in the state/consumer matrix. No universal reuse predicate replaces the distinct provider and pure-derivation rules. |
| C09 | Remove redundant organization-result session maps in favor of immutable store lookup. Remove the duplicate provider claim-context `support` map using that same lookup when retrieving historical support. | 2: repeated partial results reuse their basis; new acquisition never overwrites the first support of an existing context; rejected publication does not install false support. |
| C10 | Combine the root module evaluation and its expansion outcomes into one `put`. | 2: failure of any coupled outcome leaves no root-only attempt; previously stored evidence remains intact. |
| C11 | Remove the unused worker `close` message, union member and handler; retain worker termination and parent-owned Git cleanup. | 4: no dead close protocol remains; disposal tests verify both worker exit and independently owned child cleanup. |
| C12 | Allocate entity IDs as a validated batch per session/kind rather than one at a time. | 2–3: same-batch allocation respects deterministic ordering; previous references remain bound; no claim of order independence across separate allocation calls. |
| C13 | Keep the placement claim just created in `organization/evaluate.ts` instead of searching the growing claims array to retrieve it. | 7: identical records and ordering without the redundant scan. |
| C14 | Precompute the canonical retained repository snapshot and compare primitive probe values directly before structural serialization. | 4/7: current change-detection behavior and publication phases preserved; no repeated serialization of an unchanged retained snapshot. |
| C15 | Replace repeated export-name searches with a preparation-local name map alongside the ordered export surface; avoid whole-span array allocation for source-excerpt omission counting. | 7: broad export and Unicode/code-point cases retain exact results and order. These small improvements are included, not optional add-ons. |
| C16 | Use local membership sets in store validation for dependency component members and organization group membership. | 2/7: retain every current validation and duplicate check; sets change lookup mechanics only, with construction amortized across the relevant batch or outcome. |
| C17 | Prepare selected context/evaluation/qualification lookups for Unicode rendering, including collapsed external qualifications. | 7: complete rendered output and structured qualifications remain equivalent; avoid moving an entire scan into a per-item helper. |
| C18 | Precompute source-detail priority membership/ranks in `dependencies/presentation.ts` rather than scanning arrays inside the sort comparator. | 7: preserve exact priority and stable ordering within each priority. |
| C19 | Reuse per-view group, placement, artifact, and link indexes in organization source detail instead of nested `find`/`filter`/`some` joins. | 7: selected-group paths, artifact order, and all relevant links remain unchanged. |
| C20 | Replace repeated ignored-directory ancestor scans during repository capture with a capture-local lookup and segment-aware ancestor checks. | 4/7: preserve ignored-boundary decisions, tracked overrides, and apparent-path spelling without a new filesystem cache or changed traversal policy. |
| C21 | Replace fixed-point ancestry scans and repeated containment-edge filtering through the shared containment/graph responsibility. | 6: same deterministic link acceptance, ancestor populations, and every supporting parallel claim. This covers the incidental reachability observation. |
| C22 | Share existing presentation limitation definitions and replace method-prefix classification with an explicit appropriate discriminator. | 3: qualifications are neither silently duplicated nor suppressed by unrelated prose/version changes. Record codes are introduced only when warranted. |
| C23 | Remove newly unused helpers/imports/branches and duplicate index-building scaffolding left by the migrations. Do not copy the prototype's duplicated `append` helpers, temporary order assertions, or compatibility wrapper automatically. | Owning packages: inspect actual callers and tests; retain only meaningful boundaries, with no speculative general utility layer. |

These items are part of the final review checklist. Record each as implemented, already satisfied by an owning change, or a specifically justified retained design requiring an explicit disposition. Do not report the slice complete while included cleanup work is silently left for later. Existing behavioral checks and focused failure tests should provide proportionate verification; routine helper extraction does not require a test of every helper's mechanics.

The audit suggestions deliberately not turned into automatic cleanup are also explicit:

- Retain the discovery and dependency module-specifier recognizers separately: their supported syntax and evidence responsibilities differ.
- Retain store cloning, freezing, collision checks, and relational validation. Do not skip arbitrary repeated `put` validation as a shortcut; eliminate redundant derivation at its owner instead.
- Decompose record-family validators with actual responsibility changes or investigation record additions; source-file length alone is insufficient justification.
- Do not turn repeated lens-name strings into a broad registry as incidental cleanup. A neutral shared lens definition may be introduced if needed by the concrete command/execution boundary; per-lens async staging belongs with its actual execution redesign.
- Changes to human-maintained review checklists under `dev/` remain separate process maintenance. Implementation conventions can describe practices actually established by authorized product work.

## Implementation policies

| Area | Policy |
| --- | --- |
| Evaluation states and establishment | Share identical completed/full checks. Preserve the current stronger availability and applicability conditions at their consumers. Keep pure immutable derivation reuse separate from provider acquisition/retry rules. No new global validity constraint or rejection of currently valid states. The call-site matrix verifies these distinctions. |
| [Output boundaries](../decisions/generated-output-boundaries.md) | One live link-aware resolver accounts for dangling targets and missing suffixes. Unverifiable boundaries refuse opening as an operational failure; later inability to verify invalidates the session. Captured-source resolution remains separate. |
| [Execution ownership](../decisions/execution-ownership-and-cancellation.md) | The parent owns asynchronous Git and operation identities; the private worker retains compiler work. Git invocations have deadlines; cancellation requests immediate graceful termination and escalates after a grace period. Cleanup still unconfirmed at its reporting deadline is reported as incomplete, while the owner retains exit monitoring. Implementation chooses, justifies and tests reasonable numeric limits. No whole-analysis deadline or universal process-exit guarantee. |
| [Observation organization and publication](#5-organized-observation-files-and-truthful-delivery-outcomes) | Group new batches by configured project, then UTC date, with time/UUID filenames. Stage and close a complete private file, publish by no-overwrite link creation, then remove staging. Final-link creation commits delivery; later cleanup failure produces a cleanup warning. No power-loss durability guarantee. |
| [Terminal text](#terminal-layout) | Preserve code-point spelling and stored text; use display-cell widths and grapheme-safe breaks. Escape tabs visibly, use narrow ambiguous-width treatment, preserve original-code-point omission counts, and disclose omission of indivisible graphemes that exceed the available budget. |
| [CLI grammar](#option-grammar) | Accept inline values; require `--` for option-looking selectors and inline values for dash-prefixed paths. Preserve literal `@` via the terminator. Parse all options before honoring help; reject duplicate value options and empty required values. Repeated boolean flags remain idempotent. |
| Validation cost | Preserve the current documented validation phases and coverage. Precompute retained serialization and use local lookups without suppressing revalidation. A different detection strategy is outside this slice. |

The reference-identity correction retains the existing identity framework and canonical serialization. Update affected method versions; no claim of RFC 8785 conformance is introduced.

## Scope boundaries and investigation integration

The shared execution and acquisition policies established here provide the basis for investigation. This slice implements the concrete changes needed by current commands. The accepted investigation milestones remain responsible for subject-based full-content acquisition, internal mechanical-query access, investigator dialogue, external payload validation, atomic corrections, cause-specific citation reconsideration, and a non-disposable owner for incremental usage reporting.

Record-family validator decomposition can accompany actual investigation record additions. A schema validator may be appropriate at the unknown investigator-payload boundary. This plan neither prohibits schema libraries nor replaces the existing relational store.

Investigator features, general analysis parallelism, persistent sessions, a provider registry, a general scheduler, a graph database, universal cache/resource frameworks, all-pairs reachability caches and eager repository-content prefetch are outside this slice.

## Integrated acceptance and documentation

Run the required type check and full test suite on the actual final checkout/build. Control fresh-process test paths so they cannot accidentally execute stale shared build output. Run relevant failure probes and comparisons after their owning changes; preserve the baseline and report intentional semantic/version differences explicitly.

Retain the before/after build identities with semantic comparisons and measurement results. Measure the integrated result after individual improvements, including complete CLI publication and representative scale. Report integrated measurements directly; do not add together gains from differently scoped experiments.

Update descriptive architecture, CLI behavior/limits, implementation conventions, method versions, and user-facing status where the implemented behavior warrants it. Document the changed runtime ownership and the explicitly listed behavioral fixes, including the bounds and limits of cancellation and observation publication.

Prepare an independent integrated-review handoff that tests the combined responsibility boundaries, ownership, qualification, failure behavior, and upcoming-plan compatibility. Carry material open concerns explicitly rather than marking foundation readiness complete through audit-item counts.

The handoff must include dispositions for C01–C23 as well as the major package outcomes, so the smaller foundation improvements remain visible through implementation and review.

### Native verification scope

Required native checks cover the current macOS development environment and the local filesystems used for the checkout, temporary fixtures and observation destination. Record the actual OS, runtime and filesystem tested. This is the verification scope for this slice, not a new general platform-support declaration. Native Linux, Windows and network-filesystem certification are outside the required scope; additional runs may be reported separately. Use controlled failure injection to test unavailable termination/publication operations, and do not infer native compatibility from those simulations.

## Risks and implementation choices

The principal risks are over-normalizing identity comparisons, losing supporting claims or ordering through graph adapters, retaining stale indexes, abandoning subprocess ownership, and confusing publication success with cleanup failure. The package-specific acceptance checks address these risks. Stately's short release history requires a verified pin and tests of the actual APIs used. Identity corrections require an explicit new semantic baseline before optimization comparisons.

Timeout values must balance slow valid acquisition with responsiveness; qualified unavailability during opening and unchanged validation rules limit their semantic impact. Implementation selects and justifies numeric limits, package versions, project-label selection and slugification. These are delegated implementation choices, not missing planning decisions. The native verification scope above bounds platform claims.

## Decision basis

The four decisions developed with this plan are [graph delegation](../decisions/graph-kernel-delegation.md), [output-boundary resolution](../decisions/generated-output-boundaries.md), [execution ownership and cancellation](../decisions/execution-ownership-and-cancellation.md), and [local observation acceptance](../decisions/local-observation-acceptance.md).

Existing [session semantics](../decisions/transient-analysis-sessions.md), [qualification and evaluation distinctions](../decisions/adopt-qualification-and-evaluation-constraints.md), [identity and evidence boundaries](../decisions/adopt-identity-evidence-and-observation-constraints.md), [repository organization](../decisions/repository-organization-decisions.md), [dependency structure](../decisions/module-dependency-structure-decisions.md), and [observation lifecycle](../decisions/initial-observation-recording-decisions.md) remain in force. No governing core-concept or architectural-constraint revision is part of this plan.

## Evidence traceability and limits

The audited application baseline is `5c048694fa10dc19addcbaf5825bc9c9a9719c9a`; subsequent guideline and archival commits did not change application behavior. The [durable audit collection](../../records/audits/2026-09-27-foundation-readiness/README.md), committed as `c44ddef`, preserves eight reports and selected evidence with original/archived hashes, mechanical link-adjustment metadata, and omission inventories. It is exploratory evidence, not a completed implementation review. Historical probes and prototype patches describe their stated baselines; restore them to a disposable matching checkout to reproduce them. Do not run them in place or mistake a prototype for the final implementation.

| Package | Supplementary Codex findings | Supplementary Claude findings |
| --- | --- | --- |
| Verification | F1, F5 | A4d, C1–C5 |
| Ownership/reuse/state | F3, F8, F12 | A4e, B1–B2, B6 |
| Identity/presentation policy | F2, F12 | B6–B7 |
| Acquisition/execution | F4–F5, F9, F11–F12 | A4a–b, B3–B5, C2 |
| Observation files | F6 | B8 |
| Graph adoption | F7 | A1, A4c, C4 |
| Processing | F8–F9 | A4a, B5–B6, C5; earlier processing audits |
| Terminal/options | F10 | A2–A3 |
| Investigation coordination | F11 | B3, B6 |

Claude reports a fresh 229/229 test run, with some subprocess cases using an earlier same-source shared build. Codex reports compilation and focused new probes, reusing the earlier full-suite result. Neither report verifies an integrated production migration. Their prototypes establish feasibility within their stated scope, not complete implementation acceptance.

Planning checked the supplied reports, selected probe results, relevant governance and source boundaries. It did not rerun application tests, benchmark, install dependencies, or verify a new upstream release. Integrated implementation verification remains required.

## Milestones and review gates

| Milestone | Deliverable and dependency | Gate |
| --- | --- | --- |
| M1: Trustworthy verification | Package 1, including negative comparator controls, graph ordering oracle, and reliable probes. | Demonstrate that the harness rejects deliberate relationship/literal/order changes before using it to certify migrations. |
| M2: State and identity | Packages 2–3; C08–C10, C12, C16 and C22 as applicable. Depends on M1. | Establish the state/consumer matrix, immutable publication guarantees, and explicit identity/version baseline. Prepare an independent intermediate review before extending these patterns into later migrations. |
| M3: Acquisition and lifetime | Packages 4–5, including the async API propagation for existing direct and CLI users. Depends on M1. May overlap M2 where responsibilities are independent. | Independently review actual ownership through opening, validation, interruption, unexpected worker exit, and observation publication. Pause at this boundary before dependent work relies on it. |
| M4: Delegation, indexing and CLI | Packages 6–8. Graph and indexing require M2's settled baseline; path indexing requires M3's policy. Terminal/option work can proceed independently after M1. | Package-specific equivalence, failure and scale checks pass; intentional semantic changes are separately documented. |
| M5: Integrated foundation readiness | Final build, all package outcomes, C01–C23 dispositions, measurements, and documentation. Depends on M1–M4. | Commit a final integrated-review handoff; pause until the human determines the review gate is sufficient. |

M2 and M3 may share a single review if implemented together and both are complete; the review must cover both scopes.

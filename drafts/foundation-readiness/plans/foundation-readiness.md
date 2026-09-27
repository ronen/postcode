# Foundation readiness

Status: in review
Created: 2026-09-27
Updated: 2026-09-27
Superseded by:

## Planning package and approval boundary

This plan establishes the foundation programme before module investigation implementation. The programme includes the eight work packages and C01–C23 below. Plan approval does not authorize implementation; open implementation tasks only after explicit human direction under the [task protocol](../../foundation/task-protocol.md).

Review this plan with the draft decisions on [graph delegation](../decisions/graph-kernel-delegation.md), [generated-output boundaries](../decisions/generated-output-boundaries.md), [execution ownership](../decisions/session-execution-ownership.md), [local observation publication](../decisions/local-observation-publication.md), and [terminal and option semantics](../decisions/terminal-and-option-semantics.md). The package also includes revisions to the plans index, the module-investigation plan, and the backlog. Links use their intended canonical destinations, as required by the planning workflow.

[Needs review] Resolve the locally marked execution limits, boundary-failure mapping, and visible terminal/option choices before promotion. Reviewers should challenge the policy and responsibilities, not merely confirm that every audit finding has a matching item. No new core concept or cross-cutting architectural constraint is proposed: the scoped decisions operationalize existing constraints. If review identifies a conflict, add the necessary decision and governing revision to this package before approval rather than silently overriding it.

## Governing basis

Preserve the [core concepts](../core-concepts.md), [architectural constraints](../architectural-constraints.md), [transient-session decisions](../decisions/transient-analysis-sessions.md), [qualification distinctions](../decisions/adopt-qualification-and-evaluation-constraints.md), [identity/evidence boundaries](../decisions/adopt-identity-evidence-and-observation-constraints.md), and [observation lifecycle](../decisions/initial-observation-recording-decisions.md). Existing [dependency structure](../decisions/module-dependency-structure-decisions.md), [organization](../decisions/repository-organization-decisions.md), and [dependency/organization integration](../decisions/dependency-organization-integration-decisions.md) govern the meanings retained by the graph adapter and indexes. The [module-investigation plan](module-investigation.md) and [investigator execution decision](../decisions/investigator-execution-and-evidence-access.md) define the upcoming integration boundary.

Follow the [engineering guidelines](../../dev/engineering-guidelines.md), [implementation conventions](../implementation-conventions.md), and [development workflow](../../dev/workflow.md). The current audited application baseline is `5c048694fa10dc19addcbaf5825bc9c9a9719c9a`; subsequent guideline and archival commits do not change application behavior.

## Objective and outcome

Establish a solid, well-implemented foundation for ongoing PostCode development. Reduce ongoing ownership of generic mechanisms; make shared policies authoritative; make state and resource ownership dependable; remove demonstrated avoidable processing; and make verification capable of detecting meaningful regressions. Current migration effort receives less weight than long-term fit and maintainability.

Success is an integrated implementation with suitable library boundaries, clear ownership and qualification rules, exercised failure paths, credible equivalence checks, and representative scale measurements. A collection of closed audit findings alone is insufficient.

This document reconciles the supplementary [Codex review](../../records/audits/2026-09-27-foundation-readiness/foundation-readiness/codex/REPORT.md) and [Claude review](../../records/audits/2026-09-27-foundation-readiness/foundation-readiness/claude/REPORT.md), including their use of the six earlier audits. Application code did not change between the earlier audit baselines. The source excerpts checked during this synthesis agree with the principal findings; experiments were not rerun.

## Overall disposition

Both reviews endorse the core architecture: qualified records, immutable storage, selected projections, direct TypeScript integration, Git-backed evidence, transient sessions, and parent-owned observations. Their different opening verdicts do not represent a major architectural disagreement. Both identify specific work needed before those implementation patterns are extended to investigation.

The human's preference for Stately is conditional on external graph-library adoption being warranted. This synthesis recommends adoption: SCC, incremental containment cycle checks, multi-parent ancestry, and upward closure are concrete existing uses of generic directed-graph algorithms. Delegation reduces responsibility for several independently maintained traversals, while a narrow adapter preserves PostCode's evidence and ordering policies. This rationale does not depend on future investigation features or immediate line-count savings. The audited root-ID, mutation, and API-selection obligations are manageable adapter responsibilities; if integrated implementation requires recreating the algorithms or materially compromises semantics, reconsider adoption rather than treating the preference as unconditional authorization. Pin and verify the assessed release during implementation, confine imports and mutable library objects to the adapter, and preserve domain semantics outside it.

Proceed with a bounded foundation programme. Prepare execution and acquisition policies with the accepted investigation plan in mind, without implementing the investigator, its new lenses, or speculative infrastructure in this programme.

## Important additions and reconciliations

| Finding or disagreement | Integrated disposition |
| --- | --- |
| Equivalence normalization can hide foreign references and changed literal evidence | Necessary verification repair before structural refactoring. Replace global textual substitution with consistent reference-aware comparison. Preserve literal text, qualifications, ordering, and relationships. |
| Record identity rewrites literal session-shaped text | Include a distinct identity correction. Normalize explicit reference positions in key construction, never arbitrary strings. Review method versions and semantic ordering. This is not an ordinary equivalence-preserving optimization. |
| Evaluators return mutable objects and can expose provider-retained arrays | Apply one ownership rule across evaluators and provider boundaries. Return store-owned records; protect retained provider data; make coupled root/expansion publication one atomic batch. |
| Pure partial derivations are repeatedly recomputed | Prefer lookup by deterministic record ID through a small non-throwing store lookup, removing duplicate session caches. Preserve provider acquisition/retry rules separately. Organization itself mainly repeats when repository evidence is unavailable; relationship organization also repeats for ordinary external endpoints. |
| Three variants of complete/established predicates | Inspect every use by meaning and write a state/consumer matrix. Share identical decisions. Do not infer a universal validity rule solely from today's eager provider. A single reuse/established predicate would conflate different questions. Resolve any actual contradiction explicitly. |
| Stately graph integration | Adopt for SCC, incremental containment cycle checks, ancestry, and upward closure. Encode empty root IDs; use supported mutation operations; preserve all parallel supporting claims; prefer explicit-direction DFS reachability. Preserve deterministic acceptance and output ordering. |
| Terminal wrapping | Adopt `string-width` and `Intl.Segmenter`; retain the small PostCode wrapping/continuation policy. The assessed `wrap-ansi` changes whitespace/tabs and normalizes Unicode. This is a semantic-fit reason, independent of migration cost. |
| Git timeout recommendation | A timeout signal alone does not guarantee a deadline: the Codex probe's child handled SIGTERM and exited later. Separate request rejection, child exit, worker exit, and whole-operation deadline claims. |
| Exclusion resolution | Establish one live output-exclusion authority shared by compiler and repository acquisition. Keep captured source-link resolution separate. Memoization must retain boundary-retargeting detection. |
| Observation publication | Prefer private staging followed by no-overwrite publication and cleanup. Plain rename can overwrite an existing batch. Atomic final-name visibility and power-loss durability are different guarantees. |
| Store restructuring and indexing | Add the lookup needed for pure derivations now. Include a narrowly scoped evaluation index if it cleanly removes the existing store-wide query scan; update it only after batch validation. Decompose validators when responsibility warrants it, rather than because a switch is long or new record kinds are anticipated. |
| Compact reference allocation | Allocate each current batch together, grouped by session/kind, preserving previous bindings. This improves ordering within a batch; it cannot promise order independence across separate calls when bindings are append-only. |
| Presentation recognizes qualifications through literal prose/method prefixes | Include a shared, explicit qualification/classification boundary. Shared constants may suffice for existing prose; introduce record codes only when their semantic value justifies the representation/version change. |

The supplementary reviews were complementary again. Codex added comparator and identity counterexamples, split-publication evidence, timeout qualification, and Unicode normalization behavior. Claude extended producer-alias evidence, graph API cost/mutation checks, explicit graph-order test gaps, exclusion-resolution cost, and presentation-policy duplication.

## Implementation work packages

These are coherent work packages within one programme, not a requirement for separate tasks or arbitrary approval gates for each item. Task boundaries should follow independently meaningful implementation goals under the task protocol. Independent integrated review remains required under the repository workflow. The smaller-cleanup checklist below is explicit scope within these packages, not optional work left over after the larger changes.

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
- Consolidate equivalent outcome/error predicates by their meaning; resolve the evaluation-state matrix before imposing new validity constraints.
- Add a private evaluation query index only for the concrete existing query, with publication after successful validation. Validate whole entity batches before allocating bindings.

Acceptance: producer/consumer mutation cannot affect stored or reused results or later provider discovery; invalid coupled publication leaves no root-only outcome; rejected batches leave no index/binding residue; repeated pure partial results perform no resubmission; a genuinely different basis derives a new result. Existing partial-provider retries still work.

Dependency: package 1. State semantics are a focused decision checkpoint within this package, not a reason to block independent ownership repairs.

### 3. Reference identity and authoritative presentation policy

Scope:

- Replace textual namespace removal in identity keys with explicit reference normalization. Enumerate key-construction callers so literal text and actual references remain distinguishable.
- Retain canonical serialization, native hashing, and append-only compact bindings.
- Review affected method versions, including any order derived from IDs. Document intentional identity/order differences rather than teaching the comparator to erase them.
- Replace duplicated presentation qualification strings and method-prefix classification with a shared application-owned policy appropriate to the existing record model.

Acceptance: literal session text remains distinguishable from the word `session`; same-session references normalize consistently; foreign references cannot be silently treated as local; collision rejection and existing bindings remain correct. Qualification appears exactly as intended regardless of presentation/provider wording changes.

Dependency: package 1 and ownership work. Establish an explicitly versioned baseline after identity changes. Graph/performance migrations compare against that baseline, rather than claiming byte equality across an intentional identity change.

### 4. Shared acquisition policy and dependable execution ownership

Scope:

- Resolve caller-supplied generated-output boundaries once into a shared policy, snapshot caller options, share equivalent containment/error classification, and preserve subsequent verification of the boundary.
- Keep platform paths, repository-relative paths, apparent identities, and captured source-link semantics distinct.
- Adopt an explicit deadline/cancellation policy. Preferred design direction: owned asynchronous Git subprocesses coordinated with asynchronous command validation, keeping compiler work in the private worker and parent-owned observation delivery.
- Make ownership survive worker termination: the owner must be able to signal and reap children before disposal, or a supervisor must retain that responsibility. Merely changing `spawnSync` to `spawn` inside a worker that is then terminated is insufficient.
- Repair synchronous send failure, close-while-pending, unexpected exit, and late-response handling; identify operations across asynchronous messages where required.
- Put common execution errors/contracts at a neutral boundary. Keep one active operation and terminal interruption behavior; no worker pool or transparent restart.
- Remove the unused worker `close` message and handler if termination remains the actual disposal protocol. If the chosen child-ownership design needs graceful close, make it a real exercised protocol with callers and failure cleanup instead of retaining an unused branch.
- Preserve current validation/publication phases and coverage. Precompute retained snapshot serialization, compare primitive values directly, and memoize only where replay still detects changes.

Acceptance: controlled child readiness and watchdog tests cover opening and validation; both command settlement and actual child/worker exit are checked. Late work cannot publish. Send failures cannot leave phantom pending operations or unhandled rejections. Boundary aliases, missing descendants, dangling/cyclic links, retargeting, reordered exclusions, and outside-worktree locations are exercised. Changed inputs invalidate rather than refresh retained evidence.

Dependency: package 1; coordinate with package 2. Agree the execution policy before implementation of async propagation. No arbitrary timeout number is selected by this synthesis. A timeout guard may be an interim mitigation, but does not close the execution-lifetime work by itself.

### 5. Complete observation files and truthful delivery outcomes

Scope:

- Own a private staging file through creation, write, close, no-overwrite publication, and staging removal. Use same-directory link-and-unlink publication as specified by the local observation decision; validate supported-filesystem behavior.
- Preserve existing files on collision, private permissions, visible delivery failure, and successful command output.
- Define what happens if publication succeeds but staging cleanup fails; do not misreport a published batch as absent or delete another writer's file.
- Keep acceptance separate from an unrequested promise of power-loss durability. Do not introduce a retry queue or archival subsystem.

Acceptance: controlled failures before creation, after partial write, on close, publication, and cleanup; pre-existing destination untouched; no incomplete file appears under a final batch name; actual output/exit semantics remain correct. Exception tests do not certify hard-kill or power-loss behavior.

Dependency: package 1; otherwise independent. Atomic visibility and cleanup are in scope; fsync durability requires a separate explicit requirement.

### 6. Adopt Stately for existing graph responsibilities

Scope:

- Pin/review the audited Stately release and its resolved dependency/license requirements. Keep library imports/types and ephemeral graph ownership inside a narrow adapter.
- Delegate SCC and directed reachability. Retain project-only populations, isolates, all relationship IDs, deterministic sorting, self-loop classification, and incomplete-root gating.
- Preserve sorted sequential containment-link acceptance using sanctioned mutation APIs. Encode the empty repository-root node without changing stored paths.
- Consolidate ancestry and upward closures over selected containment information; retain every supporting edge, including parallel claims, rather than just traversal-tree edges.
- Use explicit-direction, membership-checked DFS for reachability; avoid the assessed `hasPath` queue behavior and recursive/path-enumeration APIs.
- Keep display traversal and future correction-specific citation policy in PostCode.

Acceptance: independent graph-order fixtures, deep chains/cycles, unknown/root node cases, incremental updates, multi-parent diamonds and parallel evidence, full qualified output equivalence, and bounded randomized/oracle comparisons. Validate the actual selected APIs, not only the package's SCC implementation.

Dependency: packages 1 and 3's baseline where identity changes occur; share immutable ownership conventions with package 2. Stately is the human's preferred candidate if delegation is warranted; the current evidence supports that recommendation, subject to integrated verification of the adapter and maintained responsibility reduction.

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

Scope:

- Adopt display-width measurement and grapheme segmentation. Retain exact Unicode text apart from deliberate control escaping, wrapping, and disclosed truncation; keep local continuation/whitespace rules.
- Use one layout calculation for fitting and rendering. Preserve source UTF-16 coordinates and original-code-point omission counts unless an explicit decision changes them.
- Adopt `util.parseArgs` for standard scanning; retain lens/selector semantics, literal tokenization, conceptual help, controlled errors, observations, and shell project restrictions.
- Review responsible presentation/method versions and document intentional behavior changes independently of optimization equivalence.

Acceptance: CJK, combining marks, ZWJ emoji, tabs, CRLF, narrow budgets, control escapes, continuation prefixes, exact omission counts, and unchanged source evidence. Exercise grammar in one-shot and shell paths, including `--`, literal `@`, option-looking selectors, repeated/empty options, and help/error precedence.

Dependency: package 1; can progress independently of graph/performance implementation after behavior choices below are agreed.

## Smaller cleanups explicitly included

The original audits sometimes called these optional or fix-when-touched. The foundation programme already touches their owning responsibilities, and its objective includes establishing maintainable patterns. Include the concrete cleanups below alongside the relevant package. Small measured impact alone is not a reason to omit them. Preserve semantics; if an apparently simple change reveals a consequential policy choice or requires substantial machinery, report that specific issue rather than silently dropping the item.

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
| C11 | Resolve the unused worker `close` message, union member, and handler as part of the actual selected disposal protocol. | 4: remove dead protocol code, or wire and test a needed graceful-close path. Do not retain a misleading unused branch. |
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

These items are part of the final review checklist. Record each as implemented, already satisfied by an owning change, or a specifically justified retained design requiring an explicit disposition. Do not report the programme complete while included cleanup work is silently left for later. Existing behavioral checks and focused failure tests should provide proportionate verification; routine helper extraction does not require a test of every helper's mechanics.

The audit suggestions deliberately not turned into automatic cleanup are also explicit:

- Retain the discovery and dependency module-specifier recognizers separately: their supported syntax and evidence responsibilities differ.
- Retain store cloning, freezing, collision checks, and relational validation. Do not skip arbitrary repeated `put` validation as a shortcut; eliminate redundant derivation at its owner instead.
- Decompose record-family validators with actual responsibility changes or investigation record additions; source-file length alone is insufficient justification.
- Do not turn repeated lens-name strings into a broad registry as incidental cleanup. A neutral shared lens definition may be introduced if needed by the concrete command/execution boundary; per-lens async staging belongs with its actual execution redesign.
- Changes to human-maintained review checklists under `dev/` remain separate process maintenance. Implementation conventions can describe practices actually established by authorized product work.

## Decision checkpoints

The accompanying decisions supply the durable choices. Their unsettled passages must be resolved before promotion. The table summarizes the implementation checkpoints; routine adapter names and version pinning do not require separate permission questions.

| Choice | Recommended planning position |
| --- | --- |
| Evaluation states and establishment | Write a matrix of valid producer states and what each consumer may conclude. Share minimal completed-materialization checks and explicitly stronger population/availability checks. Keep pure-derivation reuse separate. Add store rejection only for combinations established to be invalid; do not outlaw states merely because today's provider never emits them. |
| Exclusion resolution | Use one live link-aware resolver capable of accounting for dangling targets and missing suffixes; refuse unverifiable/cyclic boundaries under the accompanying decision instead of guessing. Retain explicit revalidation and captured-source resolution separately. Specify exact failure mapping and method-version impact before coding. |
| Cancellation and execution | Prefer async owned Git plus the existing compiler worker, with operation identity and tested child ownership through interruption. Set numeric deadlines, escalation/cleanup behavior, and supported-platform limits explicitly. Evaluate a supervised-process alternative if these guarantees cannot be achieved coherently. |
| Observation persistence | Publish complete files without overwriting, with owned cleanup. Do not promise persistence after power loss; add fsync only if that is an actual product requirement. |
| Terminal text | Preserve code-point spelling, use grapheme-safe breaks, retain code-point omission counts. Proposed tab policy: visibly escape tabs in terminal layout so width is deterministic while stored text remains exact. Use narrow ambiguous-width treatment; explicitly handle an indivisible grapheme that exceeds a narrow budget through qualified omission. These are proposed visible changes. |
| CLI grammar | Accept `--project=value`; require `--` for option-looking selectors and an inline value for dash-prefixed option values; preserve literal `@` through terminator tokens. Prefer strict full parsing, so invalid options are errors even alongside help. Publish and test the grammar matrix. |
| Validation cost | Keep current documented phases and coverage for this programme. Revisit detection strategy only against remaining measured cost and an explicit description of changed coverage. The session decision allows mechanism changes; it does not require full recapture forever. |

Identity literal/reference separation is included as a correctness improvement with a method-version assessment. It does not require choosing a new identity framework. No claim of RFC 8785 conformance is introduced.

## Relationship to module investigation

Settle the execution/acquisition policy during this programme so investigation does not establish a second one. Implement only the concrete changes needed by current commands here. The accepted investigation milestones remain responsible for subject-based full-content acquisition, internal mechanical-query access, investigator dialogue, external payload validation, atomic corrections, cause-specific citation reconsideration, and a non-disposable owner for incremental usage reporting.

Record-family validator decomposition can accompany actual investigation record additions. A schema validator may be appropriate at the unknown investigator-payload boundary; neither a global ban on schema libraries nor replacing the existing relational store follows from these reviews.

Do not add a provider registry, general scheduler, graph database, persistent session system, universal cache/resource framework, all-pairs reachability cache, or eager repository-content prefetch without a concrete requirement.

## Integrated acceptance and documentation

Run the required type check and full test suite on the actual final checkout/build. Control fresh-process test paths so they cannot accidentally execute stale shared build output. Run relevant failure probes and comparisons after their owning changes; preserve the baseline and report intentional semantic/version differences explicitly.

Measure the integrated result after individual improvements, including complete CLI publication and representative scale. Do not add together gains from differently scoped experiments or claim the earlier prototype's 21x result for the final application.

Update descriptive architecture, CLI behavior/limits, implementation conventions, method versions, and user-facing status where the implemented behavior warrants it. Proposed consequential decisions and any necessary core-concept/constraint revisions must be reviewed together. Do not alter `dev/` or `foundation/` as incidental product work. Human-maintained material and existing audit artifacts remain untouched.

Prepare an independent integrated-review handoff that tests the combined responsibility boundaries, ownership, qualification, failure behavior, and upcoming-plan compatibility. Close implementation only under the repository's review/task protocol. Carry material open concerns explicitly rather than marking foundation readiness complete through audit-item counts.

The handoff must include dispositions for C01–C23 as well as the major package outcomes, so the smaller foundation improvements remain visible through implementation and review.

## Evidence traceability and limits

The [durable audit collection](../../records/audits/2026-09-27-foundation-readiness/README.md), committed as `c44ddef`, preserves eight reports and selected evidence with original/archived hashes, mechanical link-adjustment metadata, and omission inventories. It is exploratory evidence, not a completed implementation review. Historical probes and prototype patches describe their stated baselines; restore them to a disposable matching checkout to reproduce them. Do not run them in place or mistake a prototype for the final implementation.

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
| M3: Acquisition and lifetime | Packages 4–5, including the async API propagation for existing direct and CLI users. Depends on M1 and approved execution/boundary policies. May overlap M2 where responsibilities are independent. | Independently review actual ownership through opening, validation, interruption, unexpected worker exit, and observation publication. Pause at this boundary before dependent work relies on it. |
| M4: Delegation, indexing and CLI | Packages 6–8. Graph and indexing require M2's settled baseline; path indexing requires M3's policy. Terminal/option work can proceed independently after M1 and its decision approval. | Package-specific equivalence, failure and scale checks pass; intentional semantic changes are separately documented. |
| M5: Integrated foundation readiness | Final build, all package outcomes, C01–C23 dispositions, measurements, and documentation. Depends on M1–M4. | Commit a final integrated-review handoff; pause until the human determines the review gate is sufficient. Only then conclude the authorized task(s). |

An intermediate review covers the completed responsibility boundary, not merely one file. M2 and M3 may share a handoff if implemented together and both are complete; do not skip either scope. The human arranges independent review under the [review workflow](../../dev/review.md), and determines gate sufficiency. Reviewers do not authorize implementation or promotion. Ordinary work within an authorized milestone does not need repeated permission.

Keep evidence sufficient to review each boundary: before/after build identities, semantic-baseline changes, the state/consumer matrix, structured/rendered comparisons, failure outcomes, operation-count trends, and separate opening/first-use/steady-state/publication measurements. Commit reproducible sources and compact results to suitable validation records; generated builds and bulky profiles remain disposable.

## Risks and completion discipline

The main integration risks are comparator over-normalization; state predicates that erase qualification; graph traversal that loses supporting claims or changes deterministic ordering; stale selected-basis indexes; asynchronous replies or child processes outliving their owner; and treating successful publication followed by cleanup failure as failed delivery. Each has explicit acceptance checks in its owning package.

Stately's relative youth warrants a verified pin and adapter contract tests. Its audited design and concrete fit justify delegation despite that risk. A failed fit must return to human planning review with evidence; it must not lead to a hidden custom graph framework. Library choice remains conditional on the responsibility reduction and semantic fit stated in its decision.

Do not mark the programme complete solely because all audits have dispositions. Demonstrate the integrated maintained responsibilities and failure behavior, and include C01–C23 individually in the final review. A material deferral requires explicit human scope direction and its durable record. The broader parallelism backlog remains open: this programme fixes demonstrated processing and lifetime problems without promising a general throughput architecture.

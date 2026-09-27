# Processing-cost audit

Date: 27 September 2026  
Repository: `/Users/ronen/postcode/app`  
Code baseline: `5c048694fa10dc19addcbaf5825bc9c9a9719c9a`  
Guideline baseline: the **working-tree** version of `dev/engineering-guidelines.md`, including the human's uncommitted update.  
Scope: audit and recommendations only. No product, test-suite, governing-document, backlog, or process changes were made.

## Assessment

The most worthwhile immediate correction is to index presentation inputs once per view. On PostCode's own project, assembling the module view repeatedly performs approximately **1.37 million store lookups for 215 modules**, even after analysis is retained. Measured median assembly time was **1.19 seconds for Unicode and 1.70 seconds for JSON**, excluding analysis, input validation, serialization, publication, and observations. A generated scale series confirms unnecessary quadratic work.

A second worthwhile correction is to reuse deterministic organization expansions against their immutable evaluation bases even when their answer is partial. An ordinary opaque external dependency currently prevents reuse of the entire relationship-organization result. Captured path placement and export-name resolution also contain straightforward indexing opportunities, with lower demonstrated impact.

These are processing inefficiencies, not demonstrated wrong answers. The exercised semantic tests pass, and repeated-session probes return identical results. No crash, data corruption, or service-level deadline violation was demonstrated. The recommendations below preserve qualification, captured evidence, source distinctions, ordering, and session reference bindings.

| Finding | Evidence level | Recommendation |
| --- | --- | --- |
| F1. Presentation repeatedly scans all expansion records | Demonstrated on the actual project and at increasing sizes | Address first; index selected records by subject and requirement within view assembly |
| F2. Partial organization expansions are recomputed against unchanged bases | Demonstrated through real session execution | Address next; reuse pure derivations by their complete immutable input keys |
| F3. Placement repeatedly scans captured artifact populations | Demonstrated operation growth; smaller current-project impact | Small local indexing change, preferably alongside organization work |
| F4. Export-name lookup rescans wide export surfaces | Demonstrated quadratic name calls; scale risk rather than current major bottleneck | Lower priority, bounded name-index improvement |

The priority order is an audit recommendation, not implementation authorization or a change to the curated backlog.

## Basis and method

The applicable Processing cost guideline requires considering input size and repeated calls, avoiding unnecessary repeated work where a straightforward change suffices, and using representative measurements before more complex optimization. This audit followed `AGENTS.md`, the task protocol, development workflow, conventions, core concepts, architectural constraints, and relevant session, dependency, and expansion decisions. The task protocol does not require an implementation task record for this exploratory audit; `_work/TASK.md` was absent.

The review traced the current paths from project opening and captured inputs through provider preparation, evaluation retention, the memory store, module/organization/dependency projections, view construction, rendering, publication, and observations. Runtime source and test evidence were assessed directly. Prior review findings were not used as the basis for conclusions. The approved future module-investigation capability is not implemented and was not treated as current executable behavior.

Measurements call the actual compiled implementation, without modifying production code. They cover:

- PostCode's current configured project: 215 discovered modules, 5,674 selected module-expansion claims, 646 selected evaluation records, 372 dependency relationships, 48 repository groups, and 325 captured artifacts.
- The existing `fixtures/dependency-journey` project: six modules. Its enclosing repository capture is this checkout, not a separate tiny repository.
- Generated Git repositories of 250, 500, and 1,000 project modules: one documented constant per module, a side-effect-import chain, ten modules per directory, and no default libraries or automatic type packages. These isolate scale behavior and are not claimed to represent all production workloads.
- A 100-module session control with and without one opaque external dependency, plus isolated modules exporting 250–2,000 constants.

Environment: Node `v22.13.1`, bundled TypeScript `6.0.3`, macOS x64, Intel Core i9-9980HK. Each reported repeated-stage timing is the median of three calls after a warm-up on the same retained inputs. Operation counts are collected in a separate call; timed view measurements do not include the counting wrappers. Timing samples retain CPU and wall-clock data where provided by the main probe. Final measurements ran without the audit's test processes running concurrently. This was a local diagnostic experiment, not a controlled multi-machine benchmark or a before/after optimization comparison. Timing variation, allocation/GC, warm caches, and instrumentation in the separate session-count experiment limit precision.

The initial exploratory measurement attempt overlapped test execution and then failed because the harness excluded its own generated input directory. Its raw files are retained as `preliminary-*`; none of its timings are used below. The corrected complete run is `measurements.json`.

## F1. Index selected expansion records once per view

**Demonstrated inefficiency; highest priority.**

[composition-view.ts:10](../../../../../src/lib/composition-view.ts#L10) reads every supplied claim ID and evaluation ID for each subject. Its callers supply the whole selected expansion population:

- [presentation.ts:114](../../../../../src/lib/presentation.ts#L114), including the call at line 123, for every module;
- [organization/presentation.ts:121](../../../../../src/lib/organization/presentation.ts#L121), for each presented module placement;
- [dependencies/presentation.ts:147](../../../../../src/lib/dependencies/presentation.ts#L147), for each displayed dependency module.

With M displayed modules, C selected expansion claims, and E selected evaluation records, composition assembly alone performs O(M × (C + E)) reads. In the generated examples C = 2M and E = 3M + 1, despite there being no positive composition claim to display. The work is therefore quadratic even for uncomplicated independent export surfaces. Store access itself is a map lookup; the repeated traversal is the problem.

The module view adds repeated full-array filters for exports, documentation, and composition in [presentation.ts:82](../../../../../src/lib/presentation.ts#L82) and lines 124–148. Unicode's zero-document limit still runs the documentation-association scan. External modules are assembled before being collapsed at lines 171–172. The collapse does not save those scans.

| Input | JSON module-view store reads | JSON module-view median | Unicode module-view median | Unicode organization-view median |
| --- | ---: | ---: | ---: | ---: |
| PostCode, 215 modules | 1,371,867 | 1,697 ms | 1,192 ms | 11 ms |
| Generated, 250 modules | 319,006 | 69 ms | 67 ms | 44 ms |
| Generated, 500 modules | 1,263,006 | 282 ms | 271 ms | 194 ms |
| Generated, 1,000 modules | 5,026,006 | 1,715 ms | 2,047 ms | 1,744 ms |

The operation counts approach fourfold growth on each doubling. Timings are noisier and should not be used to infer an exact exponent. PostCode's own export-rich external population explains why its smaller module count is still expensive. Its actual-project Unicode string rendering, measured separately, took only 4 ms median; the costly step here is constructing the view.

**Proportionate change.** Prepare indexes from the projection-selected records once: composition claims and outcomes by module, export claims by module, and documentation associations by subject. Share the composition preparation within its existing responsibility so all three callers benefit. Keep arrays in their established order, including original ordering when combining associations from multiple subjects, and preserve distinct outcomes and association provenance. Do not use the entire accumulated store as the selected population. Retaining only displayed claims or dropping collapsed qualifications would change meaning; indexes can avoid the scans without that change. A general query engine or persistent cache is unnecessary.

**Coverage and missing guard.** Existing tests check selected expansion subjects (`test/expansions.test.ts:90`), source/target composition and cycle behavior (`test/dependency-projections.test.ts:102`), display bounds (`test/dependency-presentation.test.ts:119,153`), and equality across accumulated requests (`test/session.test.ts:110`). They do not constrain traversal growth. Add a deterministic counting-store test through the view boundary at two input sizes, alongside complete structured-view and rendered-output equivalence checks for ambiguous selections, documentation aliases, partial composition, and collapsed external modules. Avoid tight wall-clock assertions.

## F2. Retain pure partial organization results by immutable basis

**Demonstrated repeated-work defect; worthwhile bounded correction.**

[session.ts:85](../../../../../src/lib/session.ts#L85) uses a common `reuse` helper that stores an outcome only when execution is completed and materialization is full. It applies this gate to both organization evaluation and relationship-organization evaluation at lines 107–110.

[evaluateDependencyOrganization at dependencies/organization.ts:153](../../../../../src/lib/dependencies/organization.ts#L153) reports partial materialization whenever any relationship lacks a common organization classification. An external endpoint intentionally has no repository placement, so a normal external dependency is enough to prevent caching. Every subsequent `dependencies`, `children`, or `parents` request against the same evaluation bases reconstructs all relationship organization claims, contexts, and supporting placement evidence, then resubmits them to the store. [memory-store.ts:62](../../../../../src/lib/memory-store.ts#L62) compares duplicate records canonically, clones, validates, and freezes them again.

This is different from retrying an incomplete compiler/provider analysis after additional input acquisition. Organization derivation here reads only immutable stored evaluation and repository records. Repeating it with identical basis IDs cannot discover additional evidence.

**Reproduction.** The real `openSession().execute()` probe runs the same dependency request three times and asserts deep equality of complete results:

| 100-project-module input | Organization result | Organization records submitted on each follow-up |
| --- | --- | --- |
| Internal dependencies only | Full | None |
| Same shape plus one opaque external target | Partial | 100 claims, 100 contexts, one dependency-organization evaluation |

The partial case reconstructs the 99 fully classifiable internal relationships too. PostCode's actual 372-relationship result is also partial; directly rebuilding that derivation on unchanged stored bases costs 102 ms median, including duplicate store work. That direct-stage measurement is not a measured speedup for a hypothetical fix. Whole-session follow-up timings in the small control overlap substantially because input validation dominates them.

**Proportionate change.** Reuse these pure derivations for the same complete key: module evaluation plus requested group expansions for organization; dependency evaluation plus organization evaluation for relationship organization. Retain partial/unavailable qualification unchanged. A newly established evaluation ID must select a new derivation. Keep calling the provider/evaluation boundary so its acquisition-revision and `retryBasis` checks continue to run; do not introduce an outer cache over module or dependency analysis. An unavailable repository snapshot is similarly immutable within this session, although that additional scenario was established by code inspection rather than the counted external-target probe.

**Coverage and missing guard.** `test/session-inputs.test.ts:237,329,362` covers partial provider expansions and renewed attempts after dependency acquisition. `test/session.test.ts:110` verifies repeated view equality. `test/dependency-projections.test.ts:174,195` verifies partial/unavailable placement qualifications. These can all pass while a pure result is needlessly rebuilt. Add a session-level count of submitted organization records for repeated partial and unavailable results, and verify a different immutable basis triggers a fresh derivation while earlier results remain unchanged.

## F3. Index captured artifact paths for placement

**Demonstrated avoidable scaling cost; smaller current-project impact.**

[organization/placement.ts:23](../../../../../src/lib/organization/placement.ts#L23) performs `placements.find(...)` and then `artifacts.find(...)` for each successfully located source path. Organization evaluation calls it for module evidence at [organization/evaluate.ts:114](../../../../../src/lib/organization/evaluate.ts#L114); relationship organization calls it again for occurrence and target-declaration paths at [dependencies/organization.ts:69](../../../../../src/lib/dependencies/organization.ts#L69). Multiple requests in one file and repeatedly imported targets revisit the same paths.

For A artifacts and K source associations, the ordinary successful path costs O(K × A). This excludes the additional scan/sort behavior on the bounded link-resolution fallback. In the generated repositories, looking up each project module once produced the following counts in **each** of the two `.find` calls:

| Project modules | Placement comparisons | Artifact comparisons |
| --- | ---: | ---: |
| 250 | 31,375 | 31,375 |
| 500 | 125,250 | 125,250 |
| 1,000 | 500,500 | 500,500 |

These counts are from the real `locate` implementation using captured evidence; they exclude the further endpoint lookups during dependency organization. PostCode's project had 59 project-module source lookups and 17,405 comparisons in each collection. That is not its dominant measured latency. The finding is valuable because larger repository populations and repeated endpoint associations grow the cost and a small map suffices. The complete 1,000-module organization stage took 223 ms once, but that includes record creation, validation, and other work: it is **not** an isolated measurement of time lost to path scanning.

**Proportionate change.** Prepare exact apparent-path maps once per immutable captured repository/layout pair, then use them throughout placement. Preserve the existing boundary/link fallback initially; no trie or filesystem cache is necessary. If memoizing completed path resolutions, bind the cache to that captured pair, not a process-global path. Do not replace apparent paths with realpaths or merge module identities. In the same materialization loop, [organization/evaluate.ts:128](../../../../../src/lib/organization/evaluate.ts#L128) can retain the just-created placement claim rather than scanning the growing claims array to retrieve it.

**Coverage and missing guard.** `test/organization.test.ts:171,193,253,270,362,426` exercises aliases, multiple placements, link traversal limits, outside-repository inputs, and root-alias distinctions. `test/dependency-projections.test.ts:153,195,236` covers occurrence-specific placements, fallback, and multiple containment parents. Preserve these. Add a broad direct-path population with repeated references and deterministic lookup-work counting. The recommendation is to change lookup mechanics, not resolution policy.

## F4. Add name lookup to cached export surfaces

**Demonstrated quadratic lookup; lower-priority scale risk.**

[typescript/expansions.ts:43](../../../../../src/lib/typescript/expansions.ts#L43) caches effective export arrays, but `edges` uses a full `.find` by name at line 66 for every traced export. Wildcard resolution repeats that search at line 102 and conflict checking at line 199. A direct module exporting W constants therefore does approximately W(W + 1)/2 name comparisons even without forwarding.

An isolated call to the actual `prepareExpansions` implementation, using a real compiler program and a warmed checker, measured:

| Direct exports | Export-symbol `getName()` calls | Preparation median |
| --- | ---: | ---: |
| 250 | 33,215 | 2 ms |
| 500 | 128,294 | 6 ms |
| 1,000 | 505,938 | 16 ms |
| 2,000 | 2,011,262 | 54 ms |

The name-call totals also include sorting and other preparation calls; the quadratic term follows the source loop directly. These measurements cover preparation, not record materialization or the entire command. They establish a real growth pattern but not a major present-day bottleneck or prevalence of such wide modules in user projects.

**Proportionate change.** Keep the sorted array for deterministic iteration and a name-to-symbol map alongside it for lookup. A preparation-local lifetime already exists. Do not redesign the route traversal: its existing per-trace visited-state graph handles shared suffixes and cycles and is semantically important. Cross-trace graph caching is a separate, more complicated proposal and is not justified here.

**Coverage and missing guard.** `test/expansions.test.ts:36,49,136,161` covers effective exports, type-only forwarding, renamed cycles, and layered wildcard diamonds. The diamond test checks linear retained route evidence for one exported value; it does not expose quadratic lookup across a wide surface. Add a broad-surface case and preserve exact export order, aliases, roles, and route evidence. At today's measured cost, this is suitable for a small follow-up rather than an urgent standalone performance project.

## Other costs and course corrections

These observations are deliberately not promoted to equivalent-priority defects:

- **Input validation is substantial and intentional.** [typescript/project.ts:105](../../../../../src/lib/typescript/project.ts#L105) replays captured compiler probes and recaptures repository evidence. A single unchanged-input validation measured 378 ms median on PostCode and 251 ms on the small journey fixture within this same repository. Direct execution performs two checks; CLI publication performs three, explicitly tested at `test/session-inputs.test.ts:263`. Do not silently remove checks or substitute unchecked timestamps. First profile probe replay, canonical comparison, and Git/filesystem capture separately, then assess whether redundant work can be reduced while preserving the stated validation boundary and invalidation tests. This may matter more than minor in-memory scans for focused navigation.
- **Other presentation joins deserve local indexes when touched.** [organization/presentation.ts:114](../../../../../src/lib/organization/presentation.ts#L114) repeatedly searches group claims/properties and scans placements/containment per group. [dependencies/presentation.ts:95](../../../../../src/lib/dependencies/presentation.ts#L95) filters all edges per visited component, and line 119 searches organization claims per selected edge. Unicode bounds mitigate the latter; JSON is unbounded. These loops are directly visible, but this audit did not isolate their individual timing from F1. After F1, measure again before expanding the optimization scope.
- **Store-wide evaluation scans can grow with history.** [memory-store.ts:346](../../../../../src/lib/memory-store.ts#L346) allocates and filters the entire record population for each `evaluations(session)` call, including unrelated stored projections. Projection builders call it on follow-ups. A session/kind index maintained only after successful atomic insertion is a simple candidate if session-history profiles show impact. No long-session slowdown was demonstrated here; identical requests also reuse record IDs rather than necessarily increasing the store.
- **Provider materialization has further joins.** [typescript/expansions.ts:286](../../../../../src/lib/typescript/expansions.ts#L286) rescans export/doc claim lists per module; [typescript/project.ts:314](../../../../../src/lib/typescript/project.ts#L314) associates resolution evidence by scanning across candidates. These are candidates for local grouping during preparation, but current retention amortizes them across repeated requests. They were not isolated as dominant costs.
- **Existing good choices should remain.** Source digests are cached per captured compiler object; provider work has acquisition-aware reuse; dependency SCC traversal is iterative with adjacency maps; relationship organization caches ancestry within one derivation; forwarding traces avoid enumerating all complete paths. Required evidence/qualification storage, immutable batch validation, and self-contained observations naturally scale with retained/output data. Their cost alone is not evidence that the contracts should be weakened. No concurrency framework, persistent cache, new dependency, or general scheduler is warranted by this audit.

## Verification and limits

The current source and all test source compiled successfully into this audit directory. `npm run check` passed. The selected semantic test runs and exact commands are documented in `REPRODUCE.md`; results are in `tests.log` and `dependency-tests.log`.

The main six-file run passed **72 tests**. The additional dependency run passed **30 tests**, for **102 passing tests** in total; the exact scope is recorded in `REPRODUCE.md`. Fresh-process reproduction cases that hard-code the repository's normal `_build` path were deliberately excluded from that additional run so the audit would not use stale build output or create build files outside its requested directory. The full `npm test` suite was not run. No implementation changes exist to validate against an optimized variant.

No target project code or hosted investigator was executed. Probes exercised compiler analysis and in-memory/public library behavior. They did not measure worker transport, real terminal throughput, observation sink writes, peak memory, or long-session growth. No application-wide throughput or speedup claim is made. Findings distinguish counted repeated work from inferred large-input risks and retain these limitations.

## Artifacts

All audit-created repository files are in `_codex-processing-cost-audit-2026-09-27/`, a disposable, non-governing directory under repository conventions:

- `REPORT.md`: this standalone audit.
- `REPRODUCE.md`: exact commands, test results, and interpretation of the probes.
- `probe.mjs`, `measurements.json`, `probe.log`: complete stage measurements, operation counts, and session-reuse reproduction.
- `export-probe.mjs`, `export-measurements.json`, `export-probe.log`: broad export-surface experiment.
- `source-manifest.json`, `guideline-update.diff`, `initial-status.txt`: audited baseline and hashes.
- `final-verification.json`, `final-status.txt`: source-preservation and artifact checks.
- `build/`, `inputs/`: compiled baseline and generated experiment repositories.
- `build.log`, `typecheck.log`, `tests.log`, `dependency-tests.log`: verification output.
- `preliminary-measurements.json`, `preliminary-probe.log`: excluded exploratory attempt retained for transparency.

The pre-existing modification to `dev/engineering-guidelines.md` was preserved. No task record, commit, backlog promotion, or fix was made. A future authorized implementation should begin with F1, verify full semantic equivalence and deterministic work growth, then separately address F2 and the smaller indexing opportunities as justified.

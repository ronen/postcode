# Supplementary foundation-readiness review of PostCode

Reviewer: Claude (Opus 5.5), interactive session, 2026-09-27
Code baseline: `5c048694fa10dc19addcbaf5825bc9c9a9719c9a` on `main` (see `baseline-commit.txt`)
Guideline baseline: the **working-tree** `dev/engineering-guidelines.md`, including the human's uncommitted "Implementation anomalies" bullet (`guideline-worktree.diff`)
Status: exploratory review. It authorizes no implementation, changes no production code, canonical tests, dependencies, governing or process documents, notes, backlog entries or task records, and makes no commits. `_work/TASK.md` was absent. No task record applies to this exploratory work.

All artifacts named below are in this directory. They are disposable and non-governing.

---

## 1. Overall assessment

**PostCode's core is a sound foundation to build on.** The claim, evidence, qualification and evaluation model is explicit, and the immutable, validated record store is a real authority. Deterministic record identity and a captured-input discipline are in place, and the behavioral tests check more than the successful path. Most of what looks like reinvented infrastructure turns out, on inspection, to be domain policy PostCode should own: the Git-backed capture, the captured compiler host, qualified records, and the observation batch model. The prior audits' "keep" conclusions for these areas hold up under the "choose foundations, not migration cost" weighting.

**It is not yet "ready" in five specific respects.** None needs a redesign. Each is cheaper to settle now than after the accepted module-investigation plan adds asynchronous interpretation, four new lenses and new record kinds.

1. **Ownership of returned values is inconsistent.** The store is authoritative and frozen, but every evaluator returns a different, unfrozen object from the one it stored. At least one of these aliases the provider's own retained state (demonstrated, **B1**).
2. **Reuse policy has no single definition.** It is spread over three mechanisms with different keys and rules, which is why pure partial derivations are needlessly recomputed (**B2**).
3. **"Complete/established" is defined at 14 sites with three non-equivalent predicates.** No store invariant makes the differences harmless (**A4e**).
4. **Cancellation and validation cost are unresolved design questions, not local fixes** (**B4**, **B5**). The investigation plan's asynchronous execution depends on them.
5. **Several tests cannot detect the failures they are named for** (**C1**, **C4**, **C5**). Nearly every recommended refactor, including graph adoption and indexing, depends on trustworthy equivalence checks.

**On the directed library questions:**

- **Graph direction (`@statelyai/graph`):** integrate it behind a small PostCode-owned adapter for SCC, containment cycle refusal, and ancestry, and later for citation reconsideration. The probes found three concrete adapter obligations: node IDs must be non-empty, graphs must not be mutated in place, and `hasPath` must not be used. There is also a maintenance-posture risk. No semantic mismatch prevents adoption (**A1**).
- **Terminal layout:** delegate display-width measurement to `string-width` and grapheme segmentation to the platform's `Intl.Segmenter`. Keep PostCode's wrapping loop. **Do not adopt `wrap-ansi`:** it changes the ordinary ASCII continuation contract and rewrites tabs (demonstrated). This revises the Codex audit's "probably `wrap-ansi`" (**A2**).
- **Option parsing:** use `node:util` `parseArgs` (platform, no dependency) as an early improvement. It requires one explicit CLI-contract decision about single-dash words (**A3**).

**Limits of this assessment.** Recommendations are not a change to the curated backlog. Measurements are single-machine and mostly single-sample. The graph and layout prototypes are isolated and not integrated into the application. I did not audit the correctness of TypeScript language semantics, fixture correctness, or the investigator design beyond identifying its foundation dependencies. See §9.

---

## 2. Baseline, evidence reuse, and audit discrepancies

**Source changes since the audited baselines: none.** The last commits touching `src/`, `test/`, `scripts/` or `package.json` are from 2026-09-23. Between `3415ece` (the two library audits) and `5c04869` (the other four), only `dev/engineering-guidelines.md` changed. That change added the reuse, responsibility, state/resource and verification guidance these audits apply. The library audits were therefore written against the **earlier** guideline text. Their weighting of "small code savings" predates the current bullet: "Before implementing substantial generic functionality… Prefer using one when it meaningfully reduces implementation, testing, or maintenance burden".

**Reproduced here rather than reused:**

- Type check passes.
- The full suite passes, 229/229 (`tests.log`), from an isolated build in `build/`. Some tests execute the shared `_build/` (for example `_build/test/process-probe.js`). That tree was rebuilt at 11:13 today by an earlier audit, so those tests ran against a build of the same source.

**Reused without repetition:**

- Codex and Claude processing-cost measurements (F1–F4; §5.1–5.5).
- Claude and Codex state/resource probes (sink-assertion swallowing, synchronous-Git termination latency, partial observation write, evaluation-cache alias, worker send failure, exclusion-resolver divergence).
- Codex graph oracle and depth probes (65,536 four-node graphs, 506 full-output cases, 100k-node chains).

**Discrepancies between audits, and how they resolve:**

| Topic | Disagreement | Resolution from direct inspection |
| --- | --- | --- |
| Partial organization reuse | Codex F2 says organization **and** relationship organization are recomputed when partial. The Claude state audit (S5) calls the caches "sound but redundant". | The top-level `organization-evaluation` is `completed/full` whenever repository evidence is available (`organization/evaluate.ts:168-169`). Placement partiality lives in the separate `placement` state, so organization is recomputed only when the repository is unavailable. Relationship organization is partial whenever any endpoint is external (`dependencies/organization.ts:153-158`), so Codex F2 holds for it. Both audits are right about different records. |
| Terminal wrapping library | Claude's library audit rejects `wrap-ansi`. Codex's library audit prefers it "probably". | Probed. `wrap-ansi` changes ordinary ASCII output even with `trim:false`, and it rewrites tabs (**A2**). Claude's library-audit position is supported. |
| SCC library | Claude's library audit: keep, recursion risk; revisit with graphlib. Codex: two iterative candidates. | Codex's depth probes are correct: graphlib's SCC is recursive, Stately's is iterative (verified in published source, `algorithms-*.mjs`, frame arrays). The human has since chosen Stately (**A1**). |
| Prototype scope | The Claude cost prototype also changed `organization/evaluate.ts`, `dependencies/organization.ts` and the TypeScript provider. Codex scoped F1 to presentation. | Complementary, not conflicting. Claude's 186/186 byte-identical comparison covers the broader prototype. |

---

## 3. Supplementary findings

Classification legend: **demonstrated defect**, **demonstrated inefficiency**, **structural concern**, **maintenance opportunity**, **unresolved design question**. Unless stated otherwise, "demonstrated" means reproduced in this review or a cited prior audit.

### A. Generic responsibility and reuse

#### A1. Graph algorithms: adopt `@statelyai/graph` behind a PostCode adapter, with three obligations

**Responsibilities in scope**, all currently hand-written:

| Operation | Location | Semantics PostCode must keep |
| --- | --- | --- |
| SCC + condensation | `dependencies/graph.ts` (61 lines, iterative Kosaraju) | Project-only population including isolates; sorted members; components ordered by first member; sorted child indices; every original relationship ID; self-loop ⇒ cyclic; roots only when complete |
| Containment cycle refusal during link acceptance | `repository/layout.ts:30-41,57-64` (`reaches`, filters all edges per visited node) | Order-dependent acceptance in sorted artifact order; mutation between checks |
| Multi-parent ancestry with every supporting claim | `dependencies/organization.ts:84-102` | All containment claims whose child is in the closure, including parallel claims |
| Ancestor closure (fixed-point loops) | `organization/evaluate.ts:144-155`, `organization/projections.ts:27-38` | Same closure as above, over paths or claims |
| **Planned:** transitive "needs reconsideration" per correction cause | `docs/plans/module-investigation.md:498-546` | Reachability over reversed citations **excluding exempt investigrams per cause**, with exposed causal graph |

**Evidence (this review; `graph-probe.mjs`, `graph-probe-staleness.mjs`, results JSON):**

- **Containment acceptance equivalence.** A Stately-backed replacement of the acceptance step matched the compiled `deriveLayout` exactly on 1,500 randomized repositories: 2,676 cyclic refusals and 8,053 accepted additional parents. It uses `hasPath` for refusal and `addEdge` on acceptance.
- **Ancestry equivalence.** `genDFS(..., { direction: 'incoming' })` plus an edge filter matched an independent fixed-point oracle for every node of 1,000 random multi-parent graphs. These included parallel claims and occasional cycles.
- **Impediment 1 (adapter obligation).** `createGraph` throws `Node id must be a non-empty string`. PostCode's repository-root region path is `''` (`layout.ts:13`). An adapter must encode node IDs; the probe prefixes `r:`. RecordIds are never empty, so SCC over modules is unaffected.
- **Impediment 2 (ownership hazard).** The library caches a CSR index per graph object and detects only array replacement or length change. Its own documentation (`indexing-*.mjs`) says in-place field mutation is not detected. Demonstrated: after `graph.edges[1].targetId = 'a'` turned `a→b, b→b` into a 2-cycle, `getStronglyConnectedComponents` still returned `[[b],[a]]`. `hasPath` did not return a stale answer in the corresponding experiment; I did not investigate why. PostCode must construct graphs once per derivation and mutate only through `addEdge`/`updateEdge`, or treat them as immutable. This matches the store's existing immutability discipline.
- **Impediment 3 (processing cost).** `hasPath` is BFS using `Array.prototype.shift`. On a 1-level star it took 17.5 ms at 10k nodes, 1,295 ms at 50k and 1,170 ms at 100k: quadratic, noisy single samples. An equivalent `genDFS` membership test took 1.7, 1.6 and 3.9 ms. The adapter should implement `reaches` with `genDFS`, not `hasPath`. The current `reaches` is itself O(R·E) per call, so even `hasPath` would be an improvement. This is about choosing the right library API.
- **Other published-source checks.**
  - SCC output order is Tarjan finishing order over insertion order. PostCode must canonicalize, as it already does.
  - `genSimplePaths` is recursive (`yield* dfsCollect`). Prohibit it and path-enumeration APIs in the adapter.
  - The package has no runtime dependencies; its many peers are optional. It is MIT, ESM, `sideEffects: false`.
- **Maintenance posture** (npm registry, retrieved today). First published 2026-02-11. **Major versions 1.0.0 (2026-05-28) and 2.0.0 (2026-06-11) were two weeks apart.** 2.4.0 (2026-08-27) is still latest. Expect API churn: pin exactly, and keep the adapter surface small so a major upgrade touches one file.

**Classification.** Maintenance opportunity, by the human's chosen direction. There is no demonstrated defect in current graph code.

**Consequence.** Four hand-written traversals, plus a fifth planned one with harder semantics, share one generic responsibility: directed reachability and SCC. Each has its own cost profile; `reaches` and the fixed-point loops are superlinear. A shared adapter removes ownership of traversal correctness. It keeps PostCode's ownership of evidence (which claims support an ancestor), qualification (roots only when complete), deterministic ordering, and domain records.

**Recommendation.** Create `src/lib/graph/` with a narrow API over PostCode IDs:

- `directedGraph(nodes, edges)`, where edges carry their RecordIds;
- `stronglyConnected(graph)`, returning canonicalized members;
- `reachable(graph, from, direction)`, via `genDFS`;
- `supportingEdges(graph, nodeSet, direction)`.

Encode node IDs inside the adapter and never expose library types. Migrate `graph.ts` (keep condensation assembly), `layout.ts` acceptance (keep sorted acceptance order), and all three ancestor closures through one containment index (see A4c). The reconsideration traversal can then be a per-cause filtered reachability over the same adapter; `getFilteredGraph` exists but was not probed.

Alternatives: keep the current code (reasonable, but the planned reconsideration traversal would add a fifth bespoke traversal), or `strongly-connected-components` for SCC only (dormant since 2014, and it doesn't cover the other operations).

**Decision needed:** accept the churn and maturity risk explicitly, and decide whether the adapter may be the only importer of the library. The latter mirrors the existing rule for `typescript`.

**Verification for the change:**

- Pin the SCC ordering contract in canonical tests (see **C4**).
- Add a deep-chain regression of at least 20k nodes, for both SCC and ancestry.
- Add a randomized containment-acceptance comparison against the retained current algorithm; port `graph-probe.mjs`.
- Run the Codex SCC oracle suite once against the adapter.
- Run `scripts/compare-analysis.mjs` before and after; all views must be byte-identical.

#### A2. Terminal layout: delegate measurement, keep the wrapping policy (revises Codex)

**Responsibility.** Mapping text to terminal display columns, and cutting it at user-perceived character boundaries. Current code counts code points (`presentation.ts:78-80,209-236`) or UTF-16 units (`organization/presentation.ts:263,270`). Module handles are slugged to ASCII (`typescript/project.ts:304-307`), so the inventory handle column (`presentation.ts:301,308,325`) is unaffected. Organization labels and wrapped documentation or excerpts are affected.

**Evidence (`layout-probe/probe.mjs`, `layout-probe/results.json`).** `currentWrap` is a verbatim copy of the private `wrapText`, with the source-detail `↪` continuation and 88 columns:

- **Demonstrated defect of the 88-column bound.** A CJK documentation line wraps to **170 display columns** today. Combining-mark text wraps at 46 columns and ZWJ-emoji text at 45, which is premature. An adapter that keeps the current loop but measures `string-width` over `Intl.Segmenter` grapheme clusters:
  - stays ≤ 88 columns in all cases;
  - is **byte-identical to current output for ASCII, double spaces, leading indentation, long words and escaped controls**.
- **`wrap-ansi` (hard, `trim:false`) is not a drop-in.**
  - For plain ASCII it keeps the break space, rendering `"  ↪  modules…"` where PostCode currently renders `"  ↪ modules…"`.
  - It pads the last line differently.
  - It **expands tabs to spaces**, which changes the displayed content of source excerpts.
  - Adapting it would mean re-implementing the continuation and consumption rules around it, so it would not remove the responsibility.
- `string-width('\t') === 0`. Tabs need a PostCode policy whichever library is used: escape them, expand them to a fixed width, or count them as 1 as today.
- `string-width` strips raw ANSI before measuring (`\u001b[31mred\u001b[0m` → 3). This is safe only because `terminalText` escapes controls first (`presentation.ts:224`). The ordering "escape, then measure" must stay an explicit invariant.
- Metadata (npm, today):
  - `string-width` 8.3.0: MIT, Node ≥ 20, dependencies `strip-ansi` and `get-east-asian-width`.
  - `wrap-ansi` 10.0.2: additionally `ansi-styles`.
  - Node 22.13.1 here ships ICU 76.1 / Unicode 16, and `Intl.Segmenter` segments ZWJ families and combining sequences correctly.

**Classification.** Demonstrated defect (display bound) plus maintenance opportunity (Unicode width tables).

**Recommendation.**

- Delegate width to `string-width` and cluster boundaries to `Intl.Segmenter`, both behind one PostCode `terminal-layout` module.
- Use that module from `wrapText`, `fitLines`, `excerpt`, and the organization column width.
- Retain the loop as policy (continuation marker, single-space break consumption, hard break, height accounting). Reject `wrap-ansi`.

**Decisions:**

- Tab policy.
- Omission-count unit. `omittedTextCharacters` currently counts code points; grapheme clusters are arguably closer to "characters". Stored text and JSON are unaffected either way.
- The resulting `methods.presentation` bump.

**Verification:** CJK, combining, ZWJ, tab and escaped-control fixtures asserting display width ≤ 88 via `string-width` (an independent oracle), unchanged ASCII output (`compare-analysis.mjs`), and unchanged JSON and stored assertions.

#### A3. Standard option parsing: `util.parseArgs`, with one contract decision

**Evidence (`parseargs-probe.mjs`, `parseargs-results.json`)** against the real `parseCommand`:

| Input | Current | `parseArgs` (strict) |
| --- | --- | --- |
| `inspect -x` | selector `-x` | `ERR_PARSE_ARGS_UNKNOWN_OPTION` |
| `--project -p` | config path `/cwd/-p` | invalid option value |
| `--project=a.json` | "unknown option" | accepted |
| `-jh` | lens error "use modules, …" | unknown option |
| `inspect -- -x`, `inspect -- --help`, `inspect @ref` | preserved | preserved; `tokens` exposes the terminator |

The current scanner treats single-dash words as selectors. The help text, however, says to pass "an option-like selector literally" after `--`. The current behavior is therefore an incidental quirk rather than a stated contract, and `-jh` produces a misleading message.

**Classification.** Maintenance opportunity, with an unresolved design question (CLI grammar).

**Recommendation.** An early improvement, not foundation-critical. Replace the ~14-line option loop (`commands.ts:57-70`) with `parseArgs({ strict: true, allowPositionals: true, tokens: true })`. Derive `literal` from the `option-terminator` token. Keep the lens grammar, the shell `--project` refusal and `commandWords` as PostCode policy. Translate errors to `Usage error:` through `inlineText`. Commander is not warranted: help text is conceptual prose and exit and observation control must remain PostCode's.

**Decision:** should single-dash words require `--`? Is `--project=value` accepted? The probe suggests yes to both.

**Verification:** the existing CLI tests (`cli.test.ts:108,162,176`, `shell.test.ts:13`) plus a table test of the cases above.

#### A4. Incidental reuse observations

**(a) Exclusion resolution: two authorities, one demonstrated divergence, live re-resolution.**

- `typescript/inputs.ts:8-34` resolves generated-output exclusions through `ts.sys`, which follows links, walking up to an existing ancestor.
- `repository/capture.ts:107-124` resolves them through `lstat`/`readlink`.
- Claude's state audit (S2) demonstrated that a dangling-symlink output directory yields `out` versus `elsewhere/target`, so the two recorded evidence values disagree.
- Additionally, `excluded(name)` in `inputs.ts:28-34` recomputes `real(name)` against the **live filesystem on every host call**, including memo hits and every probe replay, instead of using a captured decision. Measured (`exclusion-cost-probe.mjs`, single sample, PostCode's own project):
  - With the CLI's two exclusions, open + discovery made **12,614 live `fileExists`/`directoryExists`/`realpath` calls versus 557 without exclusions**.
  - One validation made 3,674 versus 557, about 40 ms (≈13%) of a 301 ms check.

Classification: structural concern plus minor demonstrated inefficiency.

Recommendation:

- **Consolidate the pair resolution into one authority**, a pure function in a shared path module computed once by the caller that supplies `excludedOutputDirectories`. Pass the resolved `{lexical, real}` pairs to both consumers and record them once.
- Choose `capture.ts`'s link-text semantics as authoritative: it resolves where output would actually land, and it is the one that handles the dangling case.
- Share `within`. Keep per-path checks lexical-first. Memoize per-path real resolution within the captured observation map, or accept the documented live check explicitly.

Decision: which resolution is authoritative. This is a small evidence-policy choice.

Verification: port the S2 divergence experiment into a canonical test asserting agreement, and keep `session-inputs.test.ts:190-205` (retargeted boundary refusal).

**(b) Operational error classification.** `session.ts:24-25` and `capture.ts:35` hold identical lists; the classifications are equivalent. **Consolidate** into one exported predicate, for example `isOperationalIoError`. Keep capture's narrower `ENOENT`/`ENOTDIR` "absent" checks (`capture.ts:101,294`) separate: they mean "absent", not "operational failure". Verification: existing operational-error tests (`session-inputs.test.ts:206-234`).

**(c) Containment traversal.** There are four closures over the same containment relation (A1 table). **Consolidate** into one containment index built once per organization evaluation (parents/children maps plus `ancestors(group) → {groups, claims}`), implemented on the graph adapter. `layout.ts` runs before group records exist, over paths, so it uses the adapter directly. The presentation tree walks in `organization/presentation.ts:152-177` and `dependencies/presentation.ts:79-98` are **retained**: they encode display policy (bounds, repeated references, pruning reasons), not generic traversal.

**(d) Test helpers.** There are about 60 `mkdtempSync` sites and eight differently shaped `temporary`/`fixture` helpers in `test/`, three near-identical CLI `invoke` helpers, and a duplicated `normalize` in `scripts/`. **Consolidate** into `test/support.ts`:

- `withProject(files, { git })`, registering cleanup through `node:test`'s `t.after()` immediately after acquisition. This is platform functionality and fixes Claude T5 structurally.
- `invokeCli(args, { sink })`, collecting batches and failing on any `WARNING: observation not recorded`. This fixes C1 structurally.

Keep per-file fixture content local.

**(e) Equivalent outcome predicates: not equivalent, and the difference is undecided.** There are three variants:

- `completed ∧ full`: `session.ts:88`, `evaluation.ts:39`, `projections.ts:56`, `organization/evaluate.ts:7`, `organization/projections.ts:84`, `typescript/project.ts:184`, `presentation.ts:343`.
- `+ available`: `dependencies/organization.ts:8`.
- `+ applicable ∧ available`: `dependencies/projections.ts:8`, `dependencies/presentation.ts:49`, `presentation.ts:252,320,402`, `composition-view.ts:31`.

Current producers never emit `completed ∧ full` with `unavailable` or `inapplicable`: organization uses `deferred` and relationship organization uses `stopped`. The variants therefore agree today. They diverge for synthetic providers, which the conventions explicitly endorse for tests. For example, `populationEstablished` would be true while the Status line says "not established".

Classification: structural concern.

Recommendation: decide the valid state combinations (core concepts §87-91 requires the dimensions to stay distinct, not all combinations to be valid). Validate them in `MemoryProgramRecordStore.put` for every evaluation-bearing record. Then export **one** `established(state)` predicate. Keep the organization-specific "placement" dimension distinct; it is meaningfully different.

Decision: the valid-combination rule.

Verification: store rejection tests for invalid combinations, plus a synthetic provider emitting `completed/full/unavailable` to prove it is refused.

**(f) Module-specifier recognition, duplicated but meaningfully different: retain.** Discovery records written specifiers with checker targets (`typescript/project.ts:149-161`). Dependency analysis recognizes a wider syntax, adds CommonJS and configured resolution, and has different evidence semantics (`typescript/dependencies.ts:55-134`). The shared part is a small syntax table. Consolidating would couple two methods with separate identity versions. Revisit only if either one's syntax coverage changes.

**(g) Retain as positively fitting:**

- `canonical` (identity.ts): exact semantics, with a throwing guard that the stable-stringify libraries lack.
- `commandWords`: deliberately literal.
- Git-backed capture: Git is the authority on ignore decisions.
- `terminalText`: a visible-escape policy, not stripping.
- The captured compiler host.
- The worker RPC: one stateful worker, terminate-on-interrupt.
- Observation batches.
- Store validation: relational, not schema.

The prior audits' reasoning survives the foundation-first weighting. In every case the library would host PostCode's rules rather than remove them.

### B. Implementation structure and shared policy

#### B1. Evaluators return objects they don't own, including provider-retained state (demonstrated; extends Codex F4)

**Evidence (`ownership-probe.mjs`, `ownership-probe-results.json`):**

- `evaluateModules` returns an object that is not the stored record and is not frozen. The stored copy is frozen.
- The returned `modules` array **is the provider's retained `core.moduleIds`** (`typescript/project.ts:327,355`, via the shallow spread at `evaluation.ts:34,47`).
- Pushing onto it through a caller's reference changed the module list of the provider's **next** `discover` result.
- `evaluateOrganization` and `evaluateDependencyOrganization` also return unfrozen, non-stored objects (`organization/evaluate.ts:165-173`, `dependencies/organization.ts:154-162`).
- Session `reuse` caches those unfrozen objects (`session.ts:90-97`). Codex F4 showed the `retained` evaluation cache (`evaluation.ts:30,58`) can disagree with the store.

**Classification.** Structural concern: a boundary weakness. No current caller mutates (types are `readonly`), and projections re-read the store (`projections.ts:15-17`, `organization/projections.ts:17-19`).

**Consequence.** The investigation plan adds a second producer (interpretation) and an investigator that can query evaluation "through that same evaluation boundary" (`module-investigation.md:231-237`). Once more code holds evaluation results, "readonly by convention" is weaker than the store's "frozen by construction".

**Recommendation.** One rule: **every evaluator returns `store.get(id)`** after its `put`, and every cache holds IDs or store-owned records. Providers must not hand out arrays they retain: freeze them at creation or copy them at the boundary. This is small, local, and needs no decision.

**Verification:** mutate returned and producer arrays after recording, then assert that initial and reused returns deep-equal `store.get(id)` and that the next discovery is unaffected. Port the probe.

#### B2. Reuse policy is split across three mechanisms; converge pure derivations on record identity

**Current state:**

| Mechanism | Location | Key | Rule |
| --- | --- | --- | --- |
| Provider caches | `typescript/project.ts:175-183,343-361` | requirement set + acquisition revision | complete: forever; partial: until acquisition |
| Module evaluation cache | `evaluation.ts:30-59` | canonical(result, expansions, retryBasis) | complete, or partial with a `retryBasis` |
| Session derivation caches | `session.ts:86-98` | `[evaluation.id, groups]`, `[dependency.id, organization.id]` | complete only |

The third mechanism caches deterministic derivations whose record IDs are already functions of complete immutable input keys:

- `organization/evaluate.ts:22`: `{ method, modules: moduleEvaluation.id, requested }`;
- `dependencies/organization.ts:26`: `[method, dependency.id, organization.id]`.

I checked key completeness. Organization derives only from the module evaluation, the requested group expansions, the session's repository evidence (fixed per session), and method versions (compiled in). Relationship organization derives only from its two referenced evaluations. **The keys are complete, and the inputs are immutable stored records.** It is therefore safe to reuse these results when partial, which resolves Codex F2. The "complete-only" gate is copied from provider reuse, where it matters because acquisition can change the answer. For pure derivations it does not apply.

**Classification.** Demonstrated inefficiency (Codex F2) with a structural root cause.

**Recommendation.** Make a stated policy:

- **Pure derivations over immutable stored bases are reused by their deterministic record ID, regardless of materialization.**
- **Provider-backed work is reused only under the provider's `retryBasis` assurance.**

Implement the first by having `evaluateOrganization` and `evaluateDependencyOrganization` look up their deterministic ID before computing. This needs a non-throwing `ProgramRecordStore.find(id)`. Then delete the session maps. Keep `evaluation.ts`'s content-keyed cache, since module evaluation IDs include an attempt counter, but make it hold IDs (B1).

Record the policy in the implementation conventions ("Accumulation and interactive execution" already has the provider half). Adding the pure-derivation half is a routine convention change within the existing session decision, not a new decision.

**Verification:**

- Codex's counted probe: zero organization records submitted on a repeated partial or unavailable request.
- A different module evaluation must produce a fresh derivation.
- Earlier results must remain unchanged (`session-inputs.test.ts:102-125` pattern).

#### B3. The request executor and synchronous session boundary will be reworked by the accepted plan; settle the boundary first

**Current.**

- `session.ts:99-133` is one closure that dispatches six lenses by string comparison, chooses expansions, evaluates, projects, builds views and renders.
- `session.execute` is synchronous. The worker (`session-worker.ts:15-24`) answers synchronously.
- Lens names are separately enumerated in `commands.ts:74-76`, `session.ts:32,101` and `observations.ts:38-42`.

**Planned (accepted plan).**

- Four new lenses (`summarize`, `explain`, `decompose`, `examine`).
- "Support asynchronous interpretation, retaining input checks before publication and after output… No late response is published after interruption or invalidation" (`module-investigation.md:808-814`).
- Milestone 1 requires "bounded asynchronous execution… cancellation and invalidation signals, rejection of late results" (`:935-966`).
- The investigator may request mechanical analysis mid-operation (`:231-237`).

**Classification.** Unresolved design question with a concrete, accepted driver. This is not hypothetical.

**Consequence.** Adding asynchronous lenses to the current closure would push `async` through `session.execute`, the worker protocol and `publishCommand` while also adding four lens branches. The one-in-flight rule (`interactive-session.ts:40`) and "late response rejection" need a per-operation identity that the worker protocol currently lacks: replies are matched only by `pending`.

**Recommendation.** Before Milestone 1, not now in isolation:

1. Split the executor into per-lens handlers sharing the current staging (requirements → evaluation → projection → view → render). A small table keyed by lens, used by parsing, execution and observation description, replaces three enumerations. It is justified by the four accepted lenses, not by generality.
2. Make `execute` return a promise and carry an operation identifier and an `AbortSignal` into evaluation.
3. Tag worker messages with the operation ID so late replies are dropped by construction.

Keep the single worker and termination-as-fallback. This also gives Codex F5 (send-failure cleanup) its natural home.

**Decision:** the async execution and cancellation contract (what "cancel" guarantees for inference vs compiler vs Git work).

**Verification:** operation-ID mismatch tests; interruption during each phase, promoted from `scripts/probe-session-interruption.mjs` (see C2); late-reply rejection.

#### B4. Cancellation during synchronous Git and filesystem capture: an unresolved design question, now on the plan's critical path

**Evidence.** Both state audits demonstrated that `worker.terminate()` waits for a synchronous `git` child (3.0 s and 5.5 s substitute delays). `capture.ts:45-47` has no timeout. Capture runs at opening **and in every validation** (`project.ts:105-107`), and there are three validations per CLI command (≈39 Git processes per shell command, per Claude's count).

**Foundation view.** A `spawnSync` timeout bounds the wait but is not cancellation, and the parent cannot reach a child spawned synchronously inside a worker thread. The plan's asynchronous execution requires input checks "before publication and after output" and prompt interruption. Its validations will therefore sit inside the interruptible window.

**Options**, which differ in guarantee, not only in code:

1. **Timeout only** (mitigation). Map expiry to the existing `CaptureFailure` path: unavailable at opening, invalidation during validation. Document the residual latency. Small, and no decision beyond choosing the bound.
2. **Asynchronous Git with owned children.** Capture becomes `async` with `spawn`, and the owner kills children on abort and awaits their exit. This makes capture and validation asynchronous, which composes with B3.
3. **Process-backed worker** (`child_process.fork` in its own process group). The parent kills the group on interrupt, reaching Git and compiler work alike. This is a larger execution-boundary change.

**Recommendation:** apply (1) now as a guard. Choose between (2) and (3) together with B3. Record the choice as a decision, since it defines what "interrupt" guarantees. Do not claim cleanup the implementation cannot prove (Codex F1).

**Verification:** controlled Git child with a readiness handshake; interrupt during opening and during validation; assert settlement **and** actual child and worker exit under an outer watchdog.

#### B5. Validation frequency and coverage: the steady-state cost floor; changing it changes a contract

**Evidence (reused).**

- One validation takes 0.25–0.38 s on PostCode (Codex), of which Git spawning is about 0.18 s and `canonical` about 0.06 s (Claude profile).
- It takes about 1.1 s with 33k artifacts, and there are three per CLI command.
- After the F1 indexing fixes, validation dominates steady-state shell latency (Claude §5.5).

**Added here:**

- The live exclusion re-resolution (A4a) is about 13% of one check.
- `project.ts:107` canonicalizes the *retained* capture on every check. That value could be computed once (Claude's local sub-item).

**Classification.** Unresolved design question, governed by the stable-inputs decision and the CLI reference's enumerated coverage (`docs/cli-reference.md:406-435`).

**Recommendation.** Take the two local savings (A4a memoization; pre-canonicalize the retained capture) inside the existing contract. **Do not** reduce passes or substitute cheaper detection (stat fingerprints, watchers) without a decision; each option trades named coverage. If a decision is sought, the most defensible candidate is **"cheap pre-check, full recapture only on difference or at publication"**. It keeps full coverage at the publication boundary and reduces the pre-execution pass. Coverage must then be restated in the CLI reference.

**Verification:** the existing invalidation-per-change-class tests (`session-inputs.test.ts:61-86`) and the check-count test (`:263-291`) must pass unchanged. Measure with the existing benchmark scripts.

#### B6. Store structure: keep the bespoke store, reorganize it before the plan doubles its record kinds

**Current.** `memory-store.ts` holds `references()` (a switch, lines 4-47) and one `put` whose validation switch runs to about 260 lines (61-326). `evaluations(session)` scans all records (346-349) and is used by every projection builder.

**Additional small finding.** `entityIds` allocates bindings **one ID at a time in caller order** (`memory-store.ts:330-336`), which defeats `EntityBindings.allocate`'s sorting (`identity.ts:53`). When two IDs share an 8-hex prefix, which one gets the longer spelling depends on which lens first displayed them. This is within the constraints: bindings stay stable, and cross-session spelling is not a determinism requirement. But reordered-request equivalence tests would then see different reference spellings for the same entities, and normalization only renames session prefixes. Probability is negligible at current populations. Pass the whole ID list to `allocate` to restore the intended order independence.

**Classification.** Maintenance opportunity, driven by the accepted plan: investigrams, citation indexes, corrections and request outcomes join "the session record store" (`module-investigation.md:215-221`).

**Recommendation.**

- Keep the bespoke relational store (no schema library; Codex §4 reasoning stands).
- Reorganize validation into per-kind validators colocated with each record family's types (`records.ts`, `organization/records.ts`, `dependencies/records.ts`), dispatched from `put`. This keeps atomic batch semantics.
- Add `find(id)` (B2) and a session/kind index maintained only after a successful commit. That preserves atomicity and removes the full scans that retained request-outcome lookup ("identified by operation, selected target, and semantic lens parameters", `:367-381`) would otherwise repeat.

**Verification:** existing `records.test.ts` suites, plus a test that a rejected batch leaves no index entries.

#### B7. Presentation infers provider semantics from literal strings

- `presentation.ts:411-415` suppresses "already represented" run limitations by **string equality** with text defined in `typescript/project.ts:15,270-271`.
- `presentation.ts:342` classifies composition contexts by `context.method.startsWith(methods.composition)`.

If the provider wording changes, Unicode output silently duplicates limitations. That is safe in direction but invisible to tests, which match fragments.

**Classification.** Structural concern (policy without an authoritative definition).

**Recommendation.** Export the limitation texts, or better, stable limitation codes carried on the context, from the provider boundary module. Classify contexts by explicit scope or kind rather than method-string prefixes.

**Verification:** a test that changes nothing but asserts each represented limitation appears exactly once in the Unicode status.

#### B8. Observation durability: settle the publication rule before observations become assessment evidence

**Evidence (reused).** Both state audits: `observations.ts:61-63` writes directly to the final `wx` name; a mid-write failure leaves a malformed file that looks like an accepted batch (Codex reproduced it with injected `ENOSPC`).

**Foundation view.** The plan makes observations the input to usage reporting and formative assessment (`module-investigation.md:846-869,1521-1543`). "Rename into place" (Claude R3) would **overwrite** an existing destination, weakening the `wx` guarantee.

**Recommendation.** Write to a private temporary name in the same directory, then `link(temp, final)`, which fails with `EEXIST` rather than overwriting, then `unlink(temp)`. Clean up the temporary on every failure path. Whether to `fsync` before linking (crash durability) is a separate policy decision; make it explicitly. Keep "delivery failure is visible and preserves the view" unchanged. That constraint is about outcome, not about mechanism.

**Verification:** injected failure before creation and after a short write (no final file, temp removed); an existing destination preserved; `0600` permissions; unchanged exit status and warning.

### C. Verification effectiveness

#### C1. Assertions that cannot fail (both audits; confirmed pattern)

`submitObservation` swallows sink exceptions by design (`command-execution.ts:14-21`). Assertions inside sink callbacks therefore cannot fail tests:

- `shell.test.ts:98-99`: the in-shell ≡ one-shot equivalence check, which is the purpose of that test.
- `shell.test.ts:120-121`.
- `session-inputs.test.ts:150-155`.

Codex demonstrated that the tests still pass when those assertions are replaced with `assert.fail`. The well-formed pattern already exists (`shell.test.ts:38-78`, which collects in the sink and asserts after; `session-inputs.test.ts:293-324`).

Recommendation: A4d's `invokeCli` helper, failing on any `WARNING: observation not recorded`. Verify by **mutation**: temporarily falsify each moved expectation and confirm failure.

#### C2. Cancellation and partial-initialization guarantees are unverified by automated tests

Untested paths:

- active interruption (only the manual probe exercises it);
- interruption during opening;
- interruption after output;
- worker crash;
- open failure through the worker;
- send failure (Codex F5).

The one-shot native-SIGINT probe `scripts/probe-compiler-interruption.mjs` **fails its own control run** (Codex), so no passing native-interruption evidence currently exists.

Recommendation: promote the session interruption probe into a test with an outer watchdog. Repair the compiler probe's phase marker without weakening it. Add opening and send-failure cases. A worker-crash seam (an injectable worker URL) needs human agreement (Claude T2).

#### C3. Ownership tests protect the store, not its callers

`records.test.ts:138-147` proves the store clones and freezes. Nothing checks what evaluators return (B1) or what provider caches retain. Add the B1 test.

#### C4. The graph ordering contract is not pinned by canonical tests

`dependency-projections.test.ts:58-59` sorts both component lists and member names before comparing. It deliberately ignores component order and index assignment, which **are** part of the stored `DependencyGraph` (children and roots are indices). Order is covered only by same-implementation re-execution (`:66`), fresh-process reproduction (`:260`), and the cross-build script. A library swap that produced a different, valid, deterministic order would pass the canonical suite.

Recommendation: before A1, add a test whose expected component order, indices and children are written from the specification ("components ordered by their smallest member RecordId; children ascending"), not from output. Add a ≥ 20k-node chain test (no stack overflow; a single chain yields N components).

#### C5. Equivalence tooling exists but is too small for the planned refactors

`scripts/compare-analysis.mjs` compares two builds across lenses, but only for two six-module fixtures plus PostCode's `modules --json`. The indexing work (Codex F1–F4, Claude §5.1–5.3), A1, A2, B1 and B2 all rely on "same output before and after". None of the canonical tests constrains work growth (both cost audits).

Recommendation:

- Add a deterministic synthetic scale fixture, based on Claude's `generate-synthetic.mjs` shape, to the comparison script's inputs, together with accumulated-session and reordered-request comparisons (`scripts/compare-session-requests.mjs` exists).
- Add one counting-store test through the view boundary at two sizes that asserts growth order, not time (Codex F1).
- Treat "compare-analysis passes on the scale fixture" as the acceptance gate for every performance or structure package below.

#### C6. Tests encoding implementation assumptions

The organization/placement `claims.find` retrieval (`organization/evaluate.ts:131`) and similar scans have no tests that mirror them. That is good: tests assert behavior. I found **no** tests that merely restate implementation logic among those inspected. The main effectiveness problems are C1 (swallowed), C4 (order-insensitive where order is contractual) and the missing failure paths in C2.

---

## 4. Material revisions to existing audit conclusions

| Audit / item | Previous conclusion | Revised conclusion | Reason |
| --- | --- | --- | --- |
| Codex library §1 | Prefer `string-width`, **probably with `wrap-ansi`** | `string-width` + `Intl.Segmenter`; **not** `wrap-ansi` | Demonstrated ASCII contract change and tab rewriting (A2) |
| Claude library #1 | `string-width` only, "no code removed" | Same choice; stronger basis | Demonstrated 170-column overflow; current ASCII output preserved exactly by the adapter |
| Claude library #2 / Codex §2 | parseArgs "marginal" (Claude) or "reasonable" (Codex) | Early improvement **plus** an explicit grammar decision | Probe shows current single-dash handling is an undocumented quirk (A3) |
| Claude library #3 | Keep SCC; graphlib later | Stately adapter for SCC, containment and ancestry, and the planned reconsideration | Human direction; iterative source verified; equivalence probed; three adapter obligations found (A1) |
| Codex graph research | Stately "tests confirmed mutation through `addEdge` updates reachability" | True for `addEdge`; **in-place mutation yields stale SCC**; `hasPath` is quadratic | Demonstrated (A1) |
| Codex cost F2 | Organization and relationship organization recomputed when partial | Relationship organization only (organization only when the repository is unavailable). The fix is a policy, reuse by deterministic ID, not another cache | Direct inspection (B2) |
| Claude state S5 | Session caches "sound but redundant" | Redundant **and** the cause of F2 | B2 |
| Codex state F4 | Evaluation cache can diverge from the store | Broader: all evaluators return unfrozen objects; module evaluations alias provider-retained arrays | Demonstrated (B1) |
| Claude state R3 | Temp + `rename` | Temp + `link` (no-overwrite) + `unlink` | `rename` would weaken `wx` (B8) |
| Claude state S2 | Consolidate resolvers **or** add an agreement test | Consolidate into one authority, choosing capture's link-text semantics; the per-call live re-resolution is an additional cost | A4a |
| Claude state S3 | Four identical "complete" predicates | Three non-equivalent variants (14 sites); needs a state-validity decision | A4e |

The remaining conclusions are confirmed on direct inspection:

- Codex F1/F3/F4 and Claude §5.1–5.4, the processing-cost indexing work.
- Both audits' Git-cancellation and sink-assertion findings.
- Claude S4 (two `put`s in `recordModuleEvaluation`).
- The "keep" list in A4g.

---

## 5. Interactions among findings

- **Indexing must respect immutable ownership and complete keys.** Per-view indexes (Codex F1) are safe because they live only during view construction over frozen store records. Anything retained longer must follow B1 (store-owned values) and B2 (deterministic-ID keys). Do **not** add an outer cache keyed by lens or selector: it would hide provider acquisition, which the conventions already forbid, and would not be keyed on complete inputs.
- **Shared exclusion logic must address the demonstrated divergence.** Merging `within` alone would leave the S2 divergence in place. The consolidation is only valid once one resolution semantics is chosen (A4a). Memoizing per-path decisions changes nothing observable only if validation still detects retargeted boundaries (`inputs.ts:65`).
- **Graph adoption must preserve qualified outputs.** The adapter returns reachability. Claims, qualifications, and the "roots only when complete" rule stay in `graph.ts` and `dependencies/organization.ts`. Containment acceptance order stays PostCode's (sorted artifacts). C4 must precede A1, or an order change would pass silently.
- **Performance refactoring depends on trustworthy equivalence checks.** C1 and C5 precede F1–F4, A1 and A2. The Claude prototype's 186/186 equivalence shows the approach works, but that harness is disposable.
- **B2 subsumes Codex F2.** Implementing F2 as "also cache partial outcomes in the session maps" would entrench the redundant mechanism B2 removes.
- **B3 and B4 are one decision.** Asynchronous interpretation, prompt interruption and interruptible validation all depend on the same execution-boundary choice. Deciding them separately risks two cancellation models.
- **The predicate decision (A4e) precedes consolidating "complete" checks** anywhere else, including the planned retained-outcome selection.
- **Terminal layout (A2) and the omission-unit decision** interact with `fitLines` height accounting. Both must change together, or the eight-line bound and omission counts would disagree.

---

## 6. Consolidated disposition of responsibilities

| Responsibility | Current location | Disposition | Notes |
| --- | --- | --- | --- |
| SCC / condensation | `dependencies/graph.ts` | **Delegate** (Stately via adapter) | Keep condensation assembly and ordering |
| Containment reachability and ancestry | `layout.ts`, `organization/evaluate.ts`, `organization/projections.ts`, `dependencies/organization.ts` | **Consolidate + delegate** | One containment index over the adapter |
| Display width and grapheme segmentation | `presentation.ts`, `organization/presentation.ts` | **Delegate** (`string-width`, `Intl.Segmenter`) | |
| Wrapping and continuation policy | `presentation.ts:222-236` | **Retain** | PostCode presentation contract |
| Option scanning | `commands.ts:57-70` | **Delegate** (`util.parseArgs`) | Grammar decision |
| Lens grammar, shell tokenizer | `commands.ts` | **Retain** | |
| Lens dispatch / execution staging | `session.ts:99-133` | **Redesign (bounded)** before the investigation M1 | Per-lens table; async boundary |
| Exclusion pair resolution | `inputs.ts`, `capture.ts` | **Consolidate** | One authority, capture semantics |
| Operational I/O error classification | `session.ts`, `capture.ts` | **Consolidate** | |
| "Established" evaluation predicate | 14 sites | **Consolidate after decision** | Store-validated state combinations |
| Evaluation return values | all evaluators | **Simplify** | Return `store.get(id)` |
| Pure-derivation reuse | `session.ts` maps | **Simplify** (reuse by deterministic ID) | Removes Codex F2 |
| Provider partial reuse | `typescript/project.ts` | **Retain** | The `retryBasis` contract is sound and tested |
| Store validation | `memory-store.ts` | **Retain, restructure** | Per-kind validators, `find`, session/kind index |
| Entity binding allocation | `memory-store.ts:328-338` | **Simplify** | Allocate whole list |
| Git subprocess lifetime | `capture.ts:45-55` | **Redesign (decision)** | Timeout now; cancellation model with B3 |
| Validation frequency and coverage | `session.ts`, `command-execution.ts`, `project.ts` | **Retain contract; local savings** | Any reduction needs a decision |
| Observation file publication | `observations.ts:57-64` | **Simplify/harden** | temp + link + unlink |
| Presentation limitation suppression | `presentation.ts:411-415,342` | **Consolidate** | Shared constants or codes |
| Per-view joins | presentations, `composition-view.ts` | **Simplify** (index once per view) | Codex F1 / Claude §5.1 |
| Placement lookups | `organization/placement.ts` | **Simplify** (maps per capture) | Codex F3 / Claude §5.2 |
| Canonical JSON, terminal escaping, capture, compiler host, worker RPC, observation model | various | **Retain** | Positive fit (A4g) |
| Test temp dirs, CLI invocation, sinks | `test/*` | **Consolidate** into `test/support.ts` | `t.after`, warning-failing sink |

---

## 7. Suggested work packages

Dependencies are shown as `→`. "Necessary" means foundation work to complete before the investigation plan's Milestone 1–2 or before the refactors that rely on it. "Worthwhile early" means valuable now at low cost. "Deferred" means speculative, or dependent on later evidence.

### Necessary foundation work

**WP1. Verification harness hardening** (no production change). → prerequisite for WP3–WP7

- Scope: C1 (sink assertions), A4d (`test/support.ts` with `t.after` cleanup and a warning-failing `invokeCli`), C4 (specification-derived graph ordering, deep-chain test), C5 (synthetic scale fixture in `compare-analysis.mjs`, accumulated and reordered comparisons, counting-store growth test).
- Verification: mutation-check each repaired assertion; the suite still passes; `compare-analysis.mjs` identical across two builds of the same source.
- Decisions: none. Promoting the synthetic generator into `scripts/` is routine tooling with a stated lifecycle.

**WP2. Ownership and reuse policy** (B1, B2, Claude S4). → WP1

- Scope:
  - Evaluators return store-owned records; providers do not expose retained arrays.
  - Add `ProgramRecordStore.find`.
  - Reuse pure derivations by deterministic ID and delete the session maps.
  - Use a single `put` in `recordModuleEvaluation`.
  - Record the pure-derivation reuse rule in the implementation conventions.
- Verification: ownership mutation tests; Codex's submitted-record count probe (zero on repeat); different-basis freshness; `compare-analysis.mjs`.
- Decisions: none beyond confirming the convention wording.

**WP3. Evaluation-state validity and a single predicate** (A4e). → WP2 for `find`/validation placement

- Scope: decide the valid combinations; validate them in the store; export `established()`; replace the 14 sites; keep the placement dimension distinct.
- Verification: store rejection tests; a synthetic provider test; `compare-analysis.mjs`.
- **Decision:** valid state combinations. This is probably a routine clarification under the existing qualification decision. If it changes meaning, it needs a decision record.

**WP4. Execution boundary and cancellation model** (B3, B4, Codex F5). → WP1 (C2 tests), WP2

- Scope: Git timeout guard immediately. Then, with the decision: per-lens dispatch table; promise-returning execute with an operation ID and `AbortSignal`; operation-tagged worker messages; the chosen Git cancellation model; send-failure cleanup; promote the interruption probes into tests.
- Verification: phase-specific interruption tests with watchdogs and actual child exit; late-reply rejection; existing publication and invalidation tests unchanged.
- **Decisions:** cancellation guarantees (timeout vs async Git vs process-backed worker); the async execution contract. Record them as a decision, since this defines interrupt semantics.

**WP5. Observation publication durability** (B8, Claude T3). Independent.

- Scope: temp + `link` + `unlink` publication; failure cleanup; tests with the real sink.
- **Decision:** whether crash durability (`fsync`) is required.

### Worthwhile early improvements

**WP6. Graph adapter** (A1, A4c). → WP1 (C4)

- Scope: `src/lib/graph/` over `@statelyai/graph` (pinned exactly; the only importer), with encoded node IDs, immutable construction, and `genDFS`-based reachability. Migrate SCC, layout acceptance, and one containment index for ancestry and closures.
- Verification: listed under A1.
- **Decision:** accept Stately's maturity and churn tradeoff; add the dependency with a stated lifecycle (workflow §4).

**WP7. Per-view and per-capture indexing** (Codex F1, F3, F4; Claude §5.1–5.4; B6 `evaluations` index; entity allocation order). → WP1, WP2

- Scope: exactly as the prototype, plus the session/kind index and whole-list allocation.
- Verification: `compare-analysis.mjs` on the scale fixture; growth-order test; measured before/after with the existing benchmark scripts. No timing assertions in tests.

**WP8. Shared policy consolidation** (A4a, A4b, B7). → WP1

- Scope: one exclusion-resolution authority with capture semantics and memoized per-path decisions; the operational-error predicate; limitation codes or constants.
- Verification: a canonical exclusion-agreement test (S2 case); invalidation-per-class tests unchanged; the A4a call-count probe shows the reduction.
- **Decision:** confirm capture's link-text semantics as authoritative.

**WP9. Terminal layout** (A2). → WP1

- Scope: a `terminal-layout` module on `string-width` + `Intl.Segmenter` used by wrap, fit, excerpt and column width; tab policy; omission unit; `methods.presentation` bump.
- Verification: width-oracle tests; ASCII output identical.
- **Decisions:** tab policy; omission unit (code points vs graphemes).

**WP10. Option parsing** (A3). Independent.

- **Decision:** single-dash words and `--project=value`.

**WP11. Store restructuring** (B6). Schedule with the investigation plan's first new record kinds (Milestone 1), not before. Per-kind validators colocated with record families.

### Speculative or deferred

- **Reducing validation frequency or cheaper change detection** (B5). Only with a decision and restated coverage in the CLI reference. Take only the two local savings now (inside WP8).
- **A shared module-specifier syntax table** (A4f). Only if either recognizer's coverage changes.
- **Parallel or async compiler work.** Covered by the existing backlog entry on parallelism and asynchronous I/O. WP4's async boundary is a prerequisite, not a commitment.
- **Persistence, eviction, general query or cache frameworks, schema libraries, Commander, `wrap-ansi`, `simple-git`/Execa, `chokidar`.** Not justified by current or accepted-plan requirements.

---

## 8. Unresolved human decisions

1. Accept `@statelyai/graph`'s maturity and churn tradeoff, pinned exactly, with the adapter as sole importer (WP6).
2. Valid evaluation-state combinations and the single "established" meaning (WP3).
3. The cancellation model for Git, filesystem and compiler work, and the asynchronous execution contract, taken together (WP4). This is a decision record.
4. Observation crash durability (`fsync`) (WP5).
5. Authoritative exclusion-resolution semantics (WP8).
6. Terminal tab policy, and the omission-count unit (WP9).
7. CLI grammar for single-dash words and `--project=value` (WP10).
8. Whether to pursue any reduction in validation frequency or coverage (B5). The default is no.

---

## 9. What was inspected, exercised, and left unverified

**Inspected directly:**

- Governing and process context: `AGENTS.md`, the task protocol, the workflow, engineering guidelines (working tree), process and implementation conventions, architectural constraints, the implemented architecture, the evaluation parts of core concepts, the CLI reference (interruption, observations, input stability), the backlog headings plus the reuse and parallelism entries, and the accepted module-investigation plan (architectural basis, retained outcomes, citations and reconsideration, asynchronous execution, Milestones 1–2).
- Source, all read in full: `session.ts`, `evaluation.ts`, `projections.ts`, `records.ts`, `identity.ts`, `memory-store.ts`, `command-execution.ts`, `cli.ts`, `commands.ts`, `shell.ts`, `interactive-session.ts`, `session-worker.ts`, `observations.ts`, `terminal-text.ts`, `composition-view.ts`, `repository/*`, `typescript/inputs.ts`, `typescript/project.ts`, `dependencies/graph.ts`, `dependencies/organization.ts`, `dependencies/projections.ts`, `dependencies/evaluate.ts`, `organization/placement.ts`, `organization/evaluate.ts`, `organization/projections.ts`, `presentation.ts`.
- Source, read substantially: `organization/presentation.ts`, `dependencies/presentation.ts`, `typescript/dependencies.ts` (request recognition).
- Source, located only: `typescript/expansions.ts`, `commonjs.ts`, `composition.ts`.
- Tests: `helpers.ts`, `session.test.ts`, `shell.test.ts` (1-160), selected `dependency-projections`, `discovery` and `session-inputs` ranges, and repository-wide pattern searches.
- Scripts: `compare-analysis.mjs`, `compare-session-requests.mjs`.
- The six audits and their key artifacts.
- `@statelyai/graph` 2.4.0 published source: SCC, `hasPath`, `genDFS`, `getTopologicalSort`, index and CSR caching.

**Exercised:**

- `npm run check` (pass).
- The full test suite from an isolated build (229/229).
- `graph-probe.mjs`: 1,500 containment-acceptance cases and 1,000 ancestry graphs matched; the empty-ID impediment; `hasPath` timing.
- `graph-probe-staleness.mjs`: stale SCC after in-place mutation; `genDFS` vs `hasPath` timing.
- `layout-probe/probe.mjs`: nine text cases across three wrappers.
- `parseargs-probe.mjs`: 14 argument vectors.
- `ownership-probe.mjs`: return and alias checks.
- `exclusion-cost-probe.mjs`: live-call counts and one validation timing.
- npm registry metadata for `@statelyai/graph`, `string-width`, `wrap-ansi`, `get-east-asian-width`, `strip-ansi` (retrieved 2026-09-27).

**Not verified:**

- Any integrated implementation of the recommendations. The prototypes are isolated; the graph and layout adapters were not wired into the application or run through `compare-analysis.mjs`.
- Speedups. None are claimed beyond the prior audits' prototype measurements. The exclusion-cost timing is a single sample.
- Stately's `getFilteredGraph` and any reconsideration traversal. Stately algorithms other than SCC, `hasPath`, `genDFS`, `getTopologicalSort` (inspected only), and index caching.
- Terminal rendering on real terminals: widths are `string-width`'s model, not observed terminal behavior.
- Cancellation behavior: the prior audits' results were reused, not re-run.
- Observation partial-write behavior (reused).
- The correctness of TypeScript expansion and dependency semantics, and fixture correctness.
- The investigator design beyond foundation dependencies.
- Transitive dependency licenses beyond the direct metadata shown.
- Tests that read the shared `_build/` ran against a build of the same source made earlier today by another audit, not against this review's build.

**Worktree state.** Unchanged apart from this directory: `git status --short` still shows only the pre-existing `M dev/engineering-guidelines.md`. `source-manifest.sha256` records the hashes of tracked source, tests, scripts and manifests at the start of the review.

## 10. Artifacts

| Path | Purpose |
| --- | --- |
| `REPORT.md` | This report |
| `baseline-commit.txt`, `initial-status.txt`, `guideline-worktree.diff`, `source-manifest.sha256` | Baselines |
| `build/` | Isolated compile of the baseline (source and tests) |
| `tests.log` | Full suite run (229/229) |
| `graph-probe.mjs`, `graph-probe-results.json` | Stately containment/ancestry equivalence, empty-ID impediment, `hasPath` timing |
| `graph-probe-staleness.mjs`, `graph-probe-staleness-results.json` | Stale SCC after in-place mutation; `genDFS` vs `hasPath` |
| `layout-probe/` (`probe.mjs`, `results.json`, pinned `string-width`/`wrap-ansi` install) | Terminal-width comparison |
| `parseargs-probe.mjs`, `parseargs-results.json` | Option-parsing comparison |
| `ownership-probe.mjs`, `ownership-probe-results.json` | Evaluation return and alias checks |
| `exclusion-cost-probe.mjs`, `exclusion-cost-results.json` | Live exclusion-filter call counts |

The graph probes import Stately from the Codex audit's isolated install (`_codex-library-reuse-audit/graph-research/probe/node_modules`). If that directory is removed, reinstall `@statelyai/graph@2.4.0` with `--ignore-scripts` and adjust the path in the probes.

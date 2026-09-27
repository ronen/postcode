# Graph-library suitability for PostCode

Date: 2026-09-27 (Europe/London)  
Status: exploratory research and isolated compatibility probes; no application adoption.  
Related report: [generic functionality audit](REPORT.md).

## Recommendation

**Yes: two libraries are technically suitable, with different scopes.** For a focused replacement of PostCode's strongly connected components (SCC) algorithm, my preferred library is **`strongly-connected-components` 1.0.1**. For a shared library covering SCCs, directed reachability and traversal, **`@statelyai/graph` 2.4.0** is the strongest broader candidate found.

An SCC-only course correction is defensible now: the focused package can remove ownership of the partitioning algorithm without weakening the existing iterative behavior. Its drawback is substantial: it has no demonstrated active maintenance. Adoption would mean relying on a small, stable, widely distributed implementation, not on an upstream team likely to fix future problems. If active maintenance is a requirement, do not select it.

Stately offers active development, native TypeScript declarations and more reusable algorithms. Its drawback is its short track record: first published in February 2026. I would choose it over the focused package **only if PostCode intends to delegate several concrete graph operations**, and accept that maturity tradeoff explicitly. Introducing its whole graph abstraction solely to remove the current SCC kernel is less compelling.

Neither choice justifies replacing qualified records, containment evidence or presentation policy with a generic graph model. Keeping the current implementation remains reasonable if neither maintenance posture is acceptable; the research does not establish that either candidate is unconditionally better.

## Actual requirements

The current [dependency graph implementation](../../../../../src/lib/dependencies/graph.ts) uses iterative Kosaraju traversal. A replacement must:

- Include every project module, including isolated modules, while excluding external endpoints from SCC computation.
- Handle deep chains and large cycles without dependence on the JavaScript call stack.
- Return a partition that PostCode can sort into deterministic members, component indices and children.
- Preserve every original internal relationship ID, including distinct claims between the same endpoints; recognize self-loops as cyclic.
- Preserve the rule that incomplete evaluations do not establish roots.

Other current opportunities are [directed reachability for containment-cycle refusal](../../../../../src/lib/repository/layout.ts#L31) and [multi-parent ancestry with supporting claims](../../../../../src/lib/dependencies/organization.ts#L84). The latter requires all supporting containment edges, not just a traversal's discovery edges or a single lowest common ancestor. An ephemeral library graph is compatible with the architecture; replacing the canonical program store is not.

## Candidates and evidence

Exact versions, publication dates, licenses, dependencies, download windows and archive URLs are saved in the [npm snapshot](graph-research/package-evidence.json). Source archives were inspected for all rows. Weekly downloads below cover 19–25 September 2026 and indicate distribution, not unique users or correctness. Graphology core and its SCC companion are assessed together.

| Candidate | Published SCC behavior / local result | Fitness judgment |
| --- | --- | --- |
| [`strongly-connected-components` 1.0.1](https://github.com/mikolalysenko/strongly-connected-components) | Explicit stack; passes 100,000-node chains/cycles. MIT, no runtime dependencies; ~788,000 weekly downloads. Published 2014-03-31. | Best focused SCC fit, subject to accepting dormant maintenance and a small local type declaration. |
| [`@statelyai/graph` 2.4.0](https://github.com/statelyai/graph) | Iterative SCC, directed traversal and reachability; passes the deep probes. MIT, no mandatory runtime dependencies; ~8,100 weekly downloads. Published 2026-08-27. | Best broader fit; active but young. Optional format/layout peers are unnecessary for these operations. |
| [`@dagrejs/graphlib` 4.0.5](https://github.com/dagrejs/graphlib) | Recursive Tarjan; stack overflow on both 20,000-node cases. MIT, no direct runtime dependencies; ~5.4 million weekly downloads. | Established and actively released, but its current SCC implementation weakens existing depth robustness. |
| [`graphology` 0.26.0 + `graphology-components` 1.5.4](https://graphology.github.io/standard-library/components.html) | Recursive SCC; stack overflow on both 20,000-node cases. MIT; core plus helper dependencies; ~1.68 million / 78,000 weekly downloads. | Established ecosystem, same depth objection. Iterative helpers elsewhere do not make its SCC iterative. |
| [`@rtsao/scc` 1.1.0](https://github.com/rtsao/scc) | Recursive Tarjan; stack overflow on both 20,000-node cases. MIT, no runtime dependencies; ~56.9 million weekly downloads. Published 2022-04-06. | Excellent `Map<T, Set<T>>` API fit and very broad distribution, but fails the depth criterion. |
| [`directed-graph-typed` 2.6.0](https://github.com/zrwusa/data-structure-typed) | Its `data-structure-typed` dependency implements recursive Tarjan; stack overflow on both 20,000-node cases. MIT; ~2,900 weekly downloads for the wrapper. | Adds a broader data-structure dependency without solving the depth problem. |
| [`cytoscape` 3.34.3](https://github.com/cytoscape/cytoscape.js) | Headless SCC is recursive; stack overflow on both 20,000-node cases. MIT, no direct runtime dependencies; ~18.4 million weekly downloads. | Mature but substantially broader than this need, and no depth advantage. |
| [`graph-data-structure` 4.5.0](https://github.com/datavis-tech/graph-data-structure) | Published exports include DFS, cycle detection, topological sorting and LCA, but no SCC operation. MIT; ~586,000 weekly downloads. | Screened out for the main requirement; not runtime-tested. |
| [`@thi.ng/adjacency` 3.0.92](https://codeberg.org/thi.ng/umbrella/src/branch/develop/packages/adjacency) | Published surface covers adjacency representations, BFS/DFS and paths; no SCC operation found. Apache-2.0, seven direct dependencies; ~1,700 weekly downloads. | Screened out for the main requirement; not runtime-tested. |

The depth failures are measured results on Node 22.13.1, macOS arm64, using normal stack settings. They are **not minimum failure thresholds**, and a 20,000-module dependency chain is a stress case, not an assertion about ordinary repositories. They demonstrate a robustness regression relative to current code.

## Focused choice: strongly-connected-components

The published [1.0.1 archive](https://registry.npmjs.org/strongly-connected-components/-/strongly-connected-components-1.0.1.tgz) uses an explicit DFS stack. The [upstream change introducing this behavior](https://github.com/mikolalysenko/strongly-connected-components/commit/5c309240f1bec906fed41f6128f703cd56945340) is from March 2014. It accepts integer-indexed adjacency arrays and returns component membership plus a condensation adjacency list. Node's ESM-to-CommonJS default import worked in the probe.

The adaptation is small: sort and index project IDs, construct adjacency arrays, invoke SCC, map indices back to IDs, then canonicalize. Keep PostCode's relationship scan and output construction. In particular, ignore the library's condensation adjacency result unless there is a separate reason to use it: PostCode must scan original claims anyway to retain their IDs, and library component indices change when groups are sorted. The [typed adapter sketch](graph-research/probe/scc-adapter.mts) is 13 physical lines plus a three-line ambient declaration. It is research code, not a production integration.

This removes approximately 30 lines of algorithm traversal and the reverse-adjacency structure from the current implementation. It leaves population selection and qualified output semantics in PostCode. Net line savings are modest; delegation of algorithm correctness is the rationale. It does not replace the other graph traversals.

The [repository activity snapshot](graph-research/github-evidence.json) shows the latest default-branch commit in March 2014, an unarchived repository, and one open 2020 browser/CommonJS import issue. The published test is very small. Neither high downloads nor our probes establish responsive maintenance. The library's value is therefore a reusable, inspectable implementation with substantial distribution, rather than ongoing feature development or strong upstream test infrastructure.

## Broader choice: @statelyai/graph

The published 2.4.0 SCC implementation uses explicit frame arrays over an internal adjacency snapshot. Its SCC result contains node objects, which an adapter maps to PostCode IDs. Public `genDFS` supports incoming traversal, and `hasPath` supports directed reachability. Tests also confirmed that mutation through `addEdge` updates subsequent reachability results. Its core/algorithm imports ran without installing optional layout or format libraries; a small adapter compiled with PostCode's strict TypeScript settings.

For PostCode, represent containment as ordinary directed edges with claim IDs. **Do not use `parentId`, `getAncestors` or `getLCA` as substitutes for multi-parent containment semantics.** Reverse traversal identifies reachable groups; a separate edge collection still needs to retain all supporting claims, including parallel claims and edges that did not first discover a node. Deterministic acceptance order for potential cyclic links remains PostCode policy. A [traversal probe](graph-research/probe/traversal.mjs) demonstrates the relevant multi-parent shape, directionality, isolates and mutation behavior.

The [upstream repository](https://github.com/statelyai/graph) was active in September 2026, and the saved npm metadata establishes a February 2026 first publication. The inspected release has no mandatory runtime dependencies, but the package is much broader than SCC and has a much shorter use history than Graphlib or Graphology. Algorithm safety must be assessed per API: its iterative SCC does not imply that every path/cycle algorithm in the package avoids recursion. No proposal here needs enumeration of all cycles or all simple paths.

## Verification and limits

[Probe results](graph-research/probe-results.json) record these checks:

- All seven executable library choices, plus PostCode, matched an independent transitive-reachability oracle on six explicit fixtures and 500 seeded random directed graphs of up to 24 nodes.
- Both iterative candidates and PostCode matched that oracle on all 65,536 directed graphs on four vertices, including every self-loop configuration.
- Both iterative candidates and PostCode passed 20,000- and 100,000-node chains and cycles. The five recursive alternatives failed both 20,000-node cases with `RangeError: Maximum call stack size exceeded`.
- Both candidate partitions, combined with the unchanged current output-assembly code, matched full `DependencyGraph` results on the 506 cases, with complete/incomplete evaluations, duplicate population entries, parallel claim IDs, external targets and reversed relationship order.
- [Stately traversal results](graph-research/traversal-results.json) cover multi-parent ancestry and claim preservation, directed reachability, isolates, mutation, and a 100,000-node incoming traversal.
- Both small TypeScript adapter sketches compiled under TypeScript 6.0.3 with strict null/index/optional-property checking, NodeNext resolution and verbatim module syntax.

These are bounded compatibility experiments, not a proof, performance benchmark, whole-application migration test, or security audit. No application build/test suite was run. The probes transpile the current graph source in memory and preserve its output assembly; the source hash is recorded. No production files, application dependencies or governing documents changed.

## Reproduction and adoption boundary

Research dependencies are isolated under [the probe directory](graph-research/probe/package.json), with exact versions and a [lockfile](graph-research/probe/package-lock.json). Installation used `--ignore-scripts --no-audit --no-fund`. Downloaded source and `node_modules` are disposable research artifacts. They are all inside the ignored audit directory.

From the repository root:

```sh
npm ci --prefix _codex-library-reuse-audit/graph-research/probe --ignore-scripts --no-audit --no-fund
node _codex-library-reuse-audit/graph-research/probe/probe.mjs
node _codex-library-reuse-audit/graph-research/probe/traversal.mjs
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --noUncheckedIndexedAccess --exactOptionalPropertyTypes --verbatimModuleSyntax --target ES2023 --module NodeNext --moduleResolution NodeNext _codex-library-reuse-audit/graph-research/probe/types-check.mts _codex-library-reuse-audit/graph-research/probe/scc-adapter.mts
```

[The source/metadata collector](research-graphs.py) retrieves current latest versions, so rerunning it refreshes the research snapshot; the probe lockfile reproduces the versions assessed here.

Any adoption should be a separately authorized implementation task: select the intended scope and maintenance tradeoff, add the small internal adapter, retain the current dependency/organization/repository behavior tests, add durable deep-graph and boundary regressions, and run `npm run check` and `npm test`. Broad adoption also needs testing of the actual ancestor/evidence and deterministic cycle-refusal adapters. It should not change the canonical store or expose library types as domain contracts.

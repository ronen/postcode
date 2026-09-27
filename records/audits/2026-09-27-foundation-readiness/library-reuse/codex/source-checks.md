# Published-source checks

These are narrow read-only compatibility checks, not an integration test or an upstream code review. Archives were read in memory on 2026-09-27 (London); these static checks did not install or execute packages. Separate [graph compatibility probes](graph-library-research.md) assess runtime behavior. `inspect-package-source.py` reproduces the source inspection from the versions in `package-evidence.json`.

| Package | Exact published source | Observation | Relevance |
| --- | --- | --- | --- |
| `@dagrejs/graphlib` 4.0.5 | [npm archive](https://registry.npmjs.org/@dagrejs/graphlib/-/graphlib-4.0.5.tgz), `package/dist/graphlib.cjs` | The exported `alg.tarjan` points to minified function `w`. Its nested function `n` calls itself for an unvisited successor. | SCC discovery uses the JavaScript call stack. PostCode's current Kosaraju passes use explicit arrays/stacks. The [graph probes](graph-library-research.md) measure deep-graph failures; no minimum failure depth is asserted. |
| `graphology-components` 1.5.4 | [npm archive](https://registry.npmjs.org/graphology-components/-/graphology-components-1.5.4.tgz), `package/index.js` | `stronglyConnectedComponents` defines `DFS` and calls `DFS(neighbor)` recursively. | Same call-stack concern; the helper named `DFSStack` elsewhere in this package does not make this particular SCC routine iterative. |
| `fast-json-stable-stringify` 2.1.0 | [npm archive](https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz), `package/index.js` | Serialization invokes a value's `toJSON`, returns no serialization for undefined, skips such object members, and inserts null for such array values. | Not an exact replacement for PostCode's direct object traversal and rejection of present undefined values. Valid ordinary JSON-shaped values are a narrower compatibility question. |

The graph findings are based on the exact published archives listed above. Repository main branches may differ from those releases.

Other fitness assessments use the upstream documentation linked in the report and library evidence catalog. In particular, shell-quote documents variable/operator/comment parsing, wrap-ansi documents hard wrapping and trimming defaults, and Piscina documents cancellation by stopping a running worker. Those capabilities do not on their own establish compatibility with PostCode.

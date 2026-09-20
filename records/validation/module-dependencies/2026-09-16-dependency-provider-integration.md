# Dependency provider integration checkpoint

Date: 2026-09-16
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Plan: [Module dependencies](../../../docs/plans/module-dependencies-plan.md)
Contract: [Approved ordered recognition rule](2026-09-16-final-recognition-contract.md)
Status: production provider and direct relationship records implemented; downstream integration pending

## Implemented boundary

The explicit dependency evaluator requests discovery and dependency preparation
through the language-analysis boundary, then records distinct evaluation outcomes.
The provider completes its compiler/host queries before snapshot finalization,
materializes records atomically with discovery, and exposes no compiler objects.
Ordinary module discovery does not silently request dependency analysis.

The source mechanisms are static and side-effect imports, direct re-exports,
import types (including `typeof import`), external import-equals, dynamic imports,
and the approved bounded CommonJS form. Literal resolution preserves a supported
target, unresolved result, or resolved file/symbol outside the population;
nonliteral targets remain indeterminate without expression evaluation. Wrong
shape, unavailable ownership, unsupported format, lexical insufficiency,
alternative bindings, binding insufficiency, and conflicting bindings remain
coverage results rather than unresolved literal occurrences.

Source requests aggregate by ordered module pair, retaining every occurrence,
mechanism and narrower qualification. Empty named lists and default imports do
not incorrectly establish whole-occurrence type-only evidence. A relationship
is type-only only when every supporting occurrence is; an unmarked relationship
makes no runtime or value-use claim. Self requests and cyclic relationships are
retained without dropping or flattening edges.

## Newly verified compiler-to-record boundaries

The production tests exercise the approved classic/mixed/preserve rule, missing
global declarations, global variable/function implementations, inline and named
callable annotations, conflicting and uninterpretable declarations, hoisted and
block-local bindings, destructuring/catch/loop bindings, parser recovery, `with`,
and JavaScript synthetic-symbol behavior. Unexpected defects propagate.

The additional ownership/resolution tests establish:

- Nested namespaces inside named modules retain the named-module owner.
  Unresolved named augmentations, global augmentations, and non-module scripts
  retain unestablished ownership; scripts use explicit legacy module detection
  in that negative fixture because automatic detection can establish modules.
- A checker-resolved wildcard ambient symbol already in the discovered
  population is a supported target for import syntax. This does not infer a
  wildcard match for CommonJS, whose non-file fallback remains exact ambient
  symbol evidence.
- An augmentation of an external module does not attribute its nested requests
  to the enclosing project SourceFile. Installed external interiors are not
  traversed for dependency owners.
- Import-type resolution-mode attributes select the appropriate conditional
  package target. CommonJS uses explicit CommonJS mode through the captured host.
  A successful file resolution outside the population remains outside it.
- For CommonJS, configured file resolution is mapped to the existing population;
  exact ambient symbols are a fallback when no file resolves. Other supported
  literal syntax retains the checker's direct symbol, including an ambient
  symbol even if a separate file resolver can find a package file. The raw
  file-resolver result and target-establishment basis are recorded separately.
  Only declaration/file evidence belonging to the actual target can narrow
  later organization placement. A dedicated test pins the same-name ambient
  declaration/package-file case, including canonical filesystem paths.
- Explicit output exclusions apply to dependency resolution. Positive and
  negative resolver inputs, source changes, and dependency method versions
  participate in snapshot identity. Fresh-process outputs are deterministic;
  later edits cannot change retained request evidence.

A fully materialized result means the bounded pass completed. It does not claim
universal recognition or erase coverage outcomes. Synthetic unavailable, stopped,
and failed evaluations verify the boundary's ability to retain qualified partial
results without claiming established emptiness. The eager provider introduces no
new cancellation, scheduling, caching, or persistence facility.

## Verification

- `npm run check`: passed.
- `npm test`: passed all **168 tests**, including **17 production dependency
  tests** and the prior **22 compiler characterization tests**. The test command
  builds the complete project first.
- `git diff --check`: passed.
- Store tests reject unsupported edges, empty occurrence support, and false
  whole-edge type-only claims atomically.
- Existing CLI and observation tests remain green; this checkpoint adds no
  dependency CLI or presentation.

The [production probe](../../../test/dependency-provider-probe.ts) uses only the
production opener/evaluator/store and explicitly excludes PostCode's build and
observation destinations. It neither executes target code nor substitutes a
second compiler recognizer. The earlier compiler probe remains a separate
investigation and now labels whether it *exercises* the dependency provider,
rather than asserting that no implementation exists.

## Repository exercises

[Retained production outputs](2026-09-16-dependency-provider-validation.json)
record the conditions, counts, core CommonJS requests, target outcomes, surveyed
relationships, coverage results, and original opening failure. Paths are relative
to the selected config directory; the original diagnostic path is normalized to
`<ts-node>`. Snapshot-derived occurrence IDs remain unchanged. The probes ran on
the implementation working tree before the validation artifact was written;
subsequent repository edits/commits change snapshot context.

| Project | Project modules | Recognized occurrences | Direct relationships |
| --- | ---: | ---: | ---: |
| PostCode | 39 | 233 | 219 |
| Adapted ts-node | 64 | 336 | 263 |

The ts-node revision is `ddb05ef23be92a90c3ecac5a0220435c65ebbd2a`, with the
same installed dependency environment and exact adapted configuration retained in
[the earlier validation](2026-09-16-ts-node-adapted-validation.json). The original
configuration still fails opening with 5107 and 5102; no application bypass was
introduced. That earlier validation proved identical selection of all 66 roots.

The production result recognizes all **21** surveyed core CommonJS occurrences:
8 resolve to supported modules, 5 are unresolved under the configured resolver,
5 resolve outside the supported population, and 3 remain target-indeterminate.
In particular:

- `src/bin.ts` to `src/child/child-loader.ts` retains CommonJS and import-type
  mechanisms in one relationship, which is not wholly type-only.
- `src/index.ts` to `src/esm.ts` retains CommonJS, import-type, re-export, and
  static-import evidence in one relationship, also not wholly type-only.
- The expressions at `src/index.ts:671` and `src/transpilers/swc.ts:32,48`
  remain non-edge, target-indeterminate CommonJS requests.

Across the entire ts-node configured population there are 42 recognized CommonJS
requests, not only the surveyed core subset. Its 44 ownership-coverage results
come from requests in script-shaped JavaScript files not established as modules
by the existing discovery predicate. The provider does not widen that population.
JSON specifiers that the configured resolver does not resolve are not promoted
by observing that a file exists or by assuming runtime loader behavior. Named
ambient Node declarations provide supported boundary modules, not an inferred
platform/runtime identity.

The two fresh provider probes took about 2.4–2.5 seconds each while running
concurrently. These are illustrative provider-only observations, not isolated
benchmarks or the still-required final CLI journey cost measurement.

Reproduce after building, with the documented ts-node environment/configuration:

```sh
node _build/test/dependency-provider-probe.js /path/to/ts-node/tsconfig.postcode-validation.json
node _build/test/dependency-provider-probe.js /path/to/ts-node/tsconfig.json
node _build/test/dependency-provider-probe.js tsconfig.json
```

## Review boundary and remaining work

The new recognition/evidence/aggregation implementation warrants independent review
before graph lenses and presentations rely on it. This is a second intermediate
assignment, distinct from the completed compiler-contract characterization review.

Graph roots and strongly connected components, focused projections, module
composition, organization classification, the discovery-facet rename, CLI and
structured/Unicode presentations, navigation, observations, final instrument
usability evaluation, and the final integrated-review handoff remain required.
This record does not claim that the module-dependency slice or task is complete.

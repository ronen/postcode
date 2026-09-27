# Reproducing the processing-cost audit

Run from `/Users/ronen/postcode/app` with the existing installed dependencies (Node 22.13+, TypeScript 6.0.3). The audited commit and working-tree file hashes are in `source-manifest.json`. The report evaluates the updated, uncommitted engineering guideline; its diff is preserved separately.

## Build and type check

```sh
node node_modules/typescript/bin/tsc -p tsconfig.json --outDir _codex-processing-cost-audit-2026-09-27/build > _codex-processing-cost-audit-2026-09-27/build.log 2>&1
npm run check > _codex-processing-cost-audit-2026-09-27/typecheck.log 2>&1
```

Both completed with exit code 0. The build compiles all source and test files; no repository source is modified. Build output stays inside the audit directory.

## Semantic tests

```sh
node --test \
  _codex-processing-cost-audit-2026-09-27/build/test/records.test.js \
  _codex-processing-cost-audit-2026-09-27/build/test/expansions.test.js \
  _codex-processing-cost-audit-2026-09-27/build/test/organization.test.js \
  _codex-processing-cost-audit-2026-09-27/build/test/session.test.js \
  _codex-processing-cost-audit-2026-09-27/build/test/session-inputs.test.js \
  _codex-processing-cost-audit-2026-09-27/build/test/dependency-presentation.test.js \
  > _codex-processing-cost-audit-2026-09-27/tests.log 2>&1

node --test --test-skip-pattern='reproduce.*fresh' \
  _codex-processing-cost-audit-2026-09-27/build/test/dependencies.test.js \
  _codex-processing-cost-audit-2026-09-27/build/test/dependency-projections.test.js \
  > _codex-processing-cost-audit-2026-09-27/dependency-tests.log 2>&1
```

Results: **72 passed** in the first run; **30 passed** in the second; no failures. Two fresh-process cases were filtered out:

- `dependency records reproduce in fresh processes without clock or invocation identity`
- `graph and composition results reproduce across fresh processes`

Those tests hard-code imports from the root `_build` directory. Filtering prevents accidental use of stale compiled output or creating audit build output outside the requested directory. Node's summary lists 30 executed tests and zero skipped; the two filtered cases are not included in that count. No claim is made that the full `npm test` suite passed. Existing tests create and clean their own operating-system temporary fixtures as permitted by the repository conventions.

## Measurements

Run sequentially, after the test processes have finished:

```sh
node _codex-processing-cost-audit-2026-09-27/probe.mjs > _codex-processing-cost-audit-2026-09-27/probe.log 2>&1
node _codex-processing-cost-audit-2026-09-27/export-probe.mjs > _codex-processing-cost-audit-2026-09-27/export-probe.log 2>&1
```

Both completed with exit code 0. They overwrite their result JSON/log files and regenerate their owned fixtures under `inputs/`; preserve a copy within this directory first if comparing runs. Generated inputs contain small nested Git repositories, with no commits or remote configuration. The original repository's index and history are untouched.

`probe.mjs` runs the real library implementation against PostCode, the existing journey fixture, and three generated source populations. It records:

- Single cold-path stage measurements in `stages` (diagnostic context, not three-sample medians).
- One discarded warm-up and three timed calls for each entry in `repeated`.
- Separate store-get operation counts for the same view/evaluation operations.
- Exact `.find` predicate counts for successful module path associations through `locate`, using read-through array proxies over captured data. These counts exclude endpoint association calls during relationship organization.
- Three actual session requests for each of two 100-module cases, counting records submitted to the memory store. Assertions require the second and third complete results to equal the first. The prototype wrapper counts/times `put` calls but still executes the original store implementation. These instrumented session timings are diagnostic, not a clean optimized-vs-unoptimized comparison.

The main timing functions do not use the counting wrappers. View timings exclude compiler/evaluation work, input validation, string rendering/serialization, worker transport, publication, and sink writes. The separately measured Unicode render and input-validation stages have their own entries. `repeatedDependencyOrganization` deliberately calls the pure derivation again; it does not assert that all full results are recomputed by the session. The separate real-session experiment establishes when the coordinator actually repeats it.

`export-probe.mjs` measures preparation only, using real TypeScript programs with one wide module. It warms the checker, times three preparations, then separately wraps the actual export symbols' `getName` methods to count calls and restores them. Counts include sorting and other name uses, not only `.find` comparisons. It does not time record materialization.

`measurements.json` and `export-measurements.json` contain the final evidence. The main probe stores platform/runtime information, wall time, and CPU usage. No before/after implementation or proposed optimization is embedded in either probe.

## Excluded preliminary attempt

`preliminary-measurements.json` and `preliminary-probe.log` retain the first exploratory run. Its early timings overlapped semantic tests. It then asserted when an overbroad harness exclusion hid its generated project configuration. This was corrected by excluding the audit directory only when analyzing the actual checkout or existing fixture, not when analyzing a generated project within it. The final probe succeeded. Preliminary results are excluded from report tables and conclusions about timing.

## Preservation check

`source-manifest.json` records SHA-256 hashes of the guideline and every source/test TypeScript file before measurement. The final preservation check compared all hashes and the file population, and confirmed the same Git HEAD and sole existing tracked modification (`dev/engineering-guidelines.md`). See `final-verification.json` and `final-status.txt`.

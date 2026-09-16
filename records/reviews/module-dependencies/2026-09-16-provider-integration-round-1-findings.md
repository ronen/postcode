# Review title: provider integration round 1 findings

Record type: findings
Received: 2026-09-16
Reviewer: independent review agent (Claude Sonnet 5, in-repository session)
Handoff: [Provider integration](2026-09-16-provider-integration-handoff.md)
Round: 1
Reviewed target: `688bf45180dd20f8193aadf181d57d555c81e38b`

## Returned findings

### Method

I read the handoff, the governing plan, the module-dependency-structure decisions,
the bounded-CommonJS-source-evidence decision, the dependency-organization
integration decisions, the approved final ordered recognition contract, and
`dev/review.md`. I then read the complete diff between the stated baseline
(`3e5d8987f6ed43bc661a81926f3e7857b8ba98d4`) and the stated target
(`688bf45180dd20f8193aadf181d57d555c81e38b`): `src/lib/typescript/dependencies.ts`,
`src/lib/typescript/commonjs.ts`, `src/lib/dependencies/records.ts`,
`src/lib/dependencies/evaluate.ts`, `src/lib/evaluation.ts`, `src/lib/identity.ts`,
`src/lib/records.ts`, `src/lib/memory-store.ts`, `src/lib/typescript/project.ts`,
`test/dependencies.test.ts`, `test/dependency-provider-probe.ts`,
`test/dependency-repository-probe.ts`, `STATUS.md`, `docs/architecture/README.md`,
and the two changed validation/disposition records. I traced the production
`commonjs.ts` recognizer line-by-line against every row of the approved ordered
rule and outcome table, and against the pre-existing (unchanged) compiler
characterization assertions in `test/dependency-contract.test.ts`. I manually
hand-counted the expected occurrence/coverage/relationship outcomes for
`fixtures/dependency-contract/requests.cts` against `test/dependencies.test.ts`'s
assertions to confirm the test oracle values are actually correct, not merely
self-consistent with the implementation. I did not change any implementation,
governing material, task status, or existing review record; this findings file
is the only new content.

### Verification actually reproduced

- `npm run check`: passed (silent, exit 0) at the reviewed target (`git diff
  --stat` confirms the one commit between target and HEAD only adds the
  handoff record itself, so HEAD and the reviewed target are code-identical).
- `npm run build`: passed.
- `node --test _build/test/dependencies.test.js _build/test/dependency-contract.test.js`:
  39/39 passed (17 production-provider + 22 compiler-contract), matching the
  handoff's claimed counts.
- `npm test`: 168/168 passed, matching the handoff's claimed total.
- `git diff --check 3e5d8987f6ed43bc661a81926f3e7857b8ba98d4
  688bf45180dd20f8193aadf181d57d555c81e38b`: passed (exit 0).
- Repository exercise: ran `node _build/test/dependency-provider-probe.js
  tsconfig.json` against PostCode itself and independently reproduced the
  retained PostCode numbers exactly: 39 project modules, 233 occurrences, 219
  relationships, mechanism counts `{dynamic-import: 1, static-import: 232}`,
  target statuses `{resolved: 233}`, empty coverage — byte-for-byte matching
  the `postcode` section of
  `records/validation/module-dependencies/2026-09-16-dependency-provider-validation.json`.
- I did **not** reproduce the adapted ts-node repository exercise (no local
  checkout of revision `ddb05ef23be92a90c3ecac5a0220435c65ebbd2a` with the
  adapted configuration and installed dependency tree was available in this
  session). I read the retained JSON's `adaptedTsNode` and
  `originalTsNodeOpening` sections instead of executing anything; those figures
  (64 modules, 336 occurrences, 263 relationships, 21 core CommonJS calls, the
  5107/5102 original-opening diagnostics) are consistent with the narrative in
  the validation record and with each other, but I have not independently
  confirmed them against a live run. This is a residual verification gap, not
  a finding against the implementation.

### Actionable findings

#### 1. Duplicate diagnostics accumulate in an aggregated relationship's context

`prepareDependencies` in `src/lib/typescript/dependencies.ts` builds each
relationship's `ClaimContextRecord` by flat-mapping the `diagnostics` array
already stored on every supporting occurrence's own context:

```ts
contexts.set(qualification, { ...base, diagnostics: supporting.flatMap(occurrence => contexts.get(occurrence.context)!.diagnostics) });
```

Each occurrence's own context diagnostics are computed per-file (`context()`
filters `program.getSyntacticDiagnostics()` by `sourceFiles.includes(diagnostic.file)`,
and occurrence-level calls pass a single-element `[request.node.getSourceFile()]`).
When two or more occurrences supporting the same relationship come from the
same source file, each of their per-occurrence diagnostic lists already
contains the identical file-wide diagnostics, and the relationship-level
`flatMap` concatenates those without deduplication — unlike the parallel
`evidence` field on the same context, which is explicitly deduplicated via
`[...new Set(sources)]` a few lines earlier in `context()`. The asymmetry
between the deduplicated `evidence` and non-deduplicated `diagnostics` on the
same record strongly suggests this is an oversight rather than an intended
design.

**Failure scenario (reproduced):** a file with two static imports to the same
target module, in a project that also has one unrelated syntax diagnostic
elsewhere in that same file. Built and ran production code:

```
occurrence diagnostics [ { code: 1109, category: 'error' } ]
occurrence diagnostics [ { code: 1109, category: 'error' } ]
relationship diagnostics [
  { code: 1109, category: 'error' },
  { code: 1109, category: 'error' }
]
```

The single diagnostic appears twice on the relationship's context. In a
relationship supported by *n* occurrences from the same file, an actual
diagnostic present in that file will appear *n* times in the relationship's
`diagnostics` list. This is currently invisible to users (no dependency view
or presentation exists yet at this checkpoint), but it is a real defect in the
materialized record graph that the plan explicitly asks dependency views to
surface later ("disclose any material unavailable recognition evidence";
"encountered analysis-path diagnostics remain distinct from project-open
failure and evaluation failure"). A downstream presentation that reports "N
diagnostics qualify this relationship" or enumerates them would overcount and
misrepresent severity. None of the new production tests assert on
`ClaimContextRecord.diagnostics` for any occurrence or relationship, so this
went uncaught.

**Suggested correction (not applied):** deduplicate the merged diagnostics the
same way `evidence` is deduplicated, e.g. by a canonical `code`+`category`+`file`
key, or restructure so relationship-level diagnostics are recomputed once over
the union of supporting occurrences' source files rather than concatenated
per-occurrence.

**Severity:** correctness/data-quality defect in the record model; does not
affect any already-tested relationship, occurrence, target-resolution, or
type-only claim, and does not invalidate the CommonJS recognition rule or the
occurrence/relationship aggregation this checkpoint is centrally about. I
judge this a moderate, narrowly-scoped, easily-corrected defect rather than a
reason to reject the checkpoint outright — see recommendation below.

### Non-defect observations

- **CommonJS recognizer fidelity.** I traced every branch of
  `src/lib/typescript/commonjs.ts` against the six-step ordered rule and the
  outcome table in the approved final recognition contract, including the
  exact completed-lexical-analysis protocol (program/SourceFile membership,
  syntax-diagnostic exclusion, `WithStatement` exclusion, the call-expression
  climb before `resolveName`, and the "undefined vs. no-declarations" symbol
  distinction) and the declaration-interpretation boundary (ambient
  implementation vs. declaration, per-declaration callable/noncallable/
  insufficient classification before trusting the merged type). Every branch
  matches the approved contract; I found no deviation. This also matches the
  pre-existing, unchanged `test/dependency-contract.test.ts` compiler
  characterization tests line for line (e.g. the identical
  `while (location.parent && ts.isCallExpression(location.parent))` climb).
- **Occurrence/coverage split correctness.** I hand-verified
  `fixtures/dependency-contract/requests.cts` (37 lines of every supported and
  excluded request shape) against `test/dependencies.test.ts`'s assertions
  independently of the implementation and confirmed the expected counts by
  reasoning about the fixture text alone: 25 owned occurrences split
  6 static/side-effect-import + 5 re-export + 2 import-equals + 2 import-type +
  5 dynamic-import + 5 commonjs, with the exact target-status and coverage
  breakdowns the test asserts. The test oracle is correct, not just
  self-consistent.
- **Target-resolution/ownership boundaries.** The "successful file resolution
  outside the supported population must not be mislabeled unresolved" rule,
  the "exact ambient symbol as CommonJS's non-file fallback only" rule, and
  the same-name ambient-declaration/package-file distinction (raw resolver
  path vs. checker-symbol target, kept separate via `targetBasis`) are all
  implemented as specified and covered by a dedicated test
  (`'file resolver evidence never narrows a different ambient target
  declaration'`) that I confirmed actually exercises the distinct-target case
  rather than accidentally collapsing to one module.
- **Ownership at namespace/named-module/global-augmentation/unresolved-
  augmentation/external-module boundaries.** `ownerOf` in `dependencies.ts`
  correctly returns "no owner" (never falling back to the enclosing file) for
  `declare global {}` bodies and unresolved string-named augmentations, and
  correctly skips identifier-named namespace declarations while climbing to
  the nearest string-named module. External module augmentations are
  attributed to the external module's coverage bucket
  (`external-owner`), not silently analyzed as project-owned. All confirmed
  both by static reading and the passing
  `'ownership respects named modules...'` and `'external interiors stay
  opaque...'` tests.
- **Aggregation and type-only whole-edge semantics.** One relationship per
  ordered module pair; only `targetStatus === 'resolved'` occurrences
  contribute to an edge's supporting set; `typeOnly` is `every()` over
  supporting occurrences only, never contaminated by non-edge or
  target-indeterminate occurrences. Self-loops and full-cycle edge
  preservation are correctly retained (verified against the cycle test).
- **Boundary ordering.** `prepareDependencies`'s eager AST traversal and all
  recognition/resolution decisions run synchronously inside the initial call,
  before `snapshotId(...)` is computed in `project.ts`; the returned closure
  only formats already-decided data into records via the same `evidence()`
  helper already used (and already reviewed) for ordinary module records. No
  compiler object (`ts.Node`, `ts.Symbol`, `ts.Program`, etc.) appears in any
  `Dependency*Record` type in `src/lib/dependencies/records.ts`.
- **Store validation.** `MemoryProgramRecordStore` rejects a relationship with
  empty/mismatched supporting occurrences, false whole-edge `typeOnly`, and an
  occurrence whose `target`/`targetStatus`/`commonjs.outcome` are mutually
  inconsistent; confirmed by both reading the code and the passing
  `'store rejects unsupported relationship edges...'` test, which exercises
  each rejection path.
- **Repository validation reproducibility.** The retained PostCode numbers in
  `2026-09-16-dependency-provider-validation.json` are exactly reproducible
  from a fresh run against the current working tree (see Verification above),
  which is a meaningfully stronger claim than "the JSON file is internally
  consistent."
- **Distinct-outcomes/explicit-request boundary.** `evaluateDependencies` is
  the only caller that passes `dependencies: true` to `discover`;
  `evaluateModules` (unchanged call site) still calls `discover(store,
  expansions)` with the parameter omitted, and a dedicated test
  (`'... ordinary discovery does not request dependencies'`) proves this by
  instrumentation rather than by inference.

### Residual uncertainty / not independently verified

- The adapted ts-node repository exercise (64 modules / 336 occurrences / 263
  relationships, 21 recognized core CommonJS calls, retained original-opening
  failure) was read but not re-executed in this session; I have no local copy
  of that checkout. This is the same limitation the handoff anticipated
  ("Report which repository checks you actually reproduced").
- I did not attempt to construct a case exercising duplicate diagnostics
  across *different* files contributing to the same relationship (only same-
  file duplication was reproduced); the same root cause plausibly also
  produces duplicates there whenever two occurrences share a diagnostic-
  bearing file, but I did not additionally test that variant since the defect
  is already established.
- I did not exhaustively re-derive every cell of the outcome table against a
  fresh fixture per row; instead I cross-checked the implementation against
  the table and against the pre-existing compiler-contract tests, which I
  judge sufficient given those tests were themselves the subject of the prior,
  already-approved review round.
- This round does not touch and I did not review: graph roots/SCCs, focused
  child/parent projections, module composition, organization-relative
  classification, discovery-facet renaming, CLI/presentation, navigation, or
  observation artifacts — the handoff states these are explicitly out of
  scope for this checkpoint, and I found no code in the reviewed diff
  attempting any of them.

### Recommendation

This checkpoint is sound enough to remain the basis for continued
implementation. The CommonJS recognition rule, occurrence/coverage
bifurcation, target-resolution and ownership boundaries, relationship
aggregation, type-only qualification, store integrity, and snapshot/method
identity extension are all faithfully and (as far as I traced) correctly
implemented against the governing decisions and the approved ordered contract,
and the claimed verification (test counts, `check`/`build`/`git diff --check`,
and the PostCode repository exercise) is reproducible exactly as stated.

I recommend the one actionable finding above (duplicate diagnostics on
aggregated relationship contexts) be corrected before or alongside the next
implementation increment, since later work (dependency views, source detail,
observation artifacts) is expected to surface `ClaimContextRecord.diagnostics`
directly and would otherwise inherit and display the overcount. I do not
consider it a reason to reject or roll back this checkpoint; it is narrow,
does not affect any occurrence, target, relationship, or type-only claim
verified in this round, and looks mechanically simple to fix and to add a
regression test for.

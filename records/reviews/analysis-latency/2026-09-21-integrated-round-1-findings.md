# Analysis latency integrated review: round 1 findings

Record type: findings
Received: 2026-09-21
Reviewer: Independent Claude Code review session (no prior involvement in this implementation)
Handoff: [Integrated handoff](2026-09-21-integrated-handoff.md)
Round: 1
Reviewed target: `b74c454c08c95a5aae7aacff816b27019fecaf9f`

## Returned findings

### Review method

Read the handoff and `dev/review.md` in full, then the governing material it cites:
the [analysis-latency task](../../tasks/2026-09-21-analysis-latency.md),
[architectural constraints](../../../docs/architectural-constraints.md) and
[engineering guidelines](../../../dev/engineering-guidelines.md) in full, the
relevant sections of
[core concepts](../../../docs/core-concepts.md),
[implementation conventions](../../../docs/implementation-conventions.md), and the
"keep the first evaluator eager and implementation-specific" decision in
[initial projection architecture decisions](../../../docs/decisions/initial-projection-architecture-decisions.md#keep-the-first-evaluator-eager-and-implementation-specific).

Confirmed with `git diff --stat` that the handoff's own commit (`59211bc`) adds only
the handoff file on top of the stated target `b74c454`, so the reviewed diff is
exactly `db3a593..b74c454` (13 files, 6031 insertions / 4 deletions, dominated by
retained measurement data and the validation report).

Read the complete production change
(`src/lib/typescript/project.ts`, net 16 lines) against its full surrounding
function rather than the hunk alone, the new regression
(`test/source-evidence.test.ts`, in full), the four development scripts, the
validation report, and every documentation update
(`STATUS.md`, `docs/architecture/README.md`, `docs/backlog.md`,
`docs/cli-reference.md`).

### Correctness of the reuse boundary

The change caches `digest(file.text)` in a `Map<ts.SourceFile, string>` created
fresh inside `discover()`, used both for the snapshot's `sources` entries and for
every `source-evidence` record's `contentDigest`. Three properties make this safe:

- `digest` (`src/lib/identity.ts`) is a pure function of its argument
  (`sha256(canonical(value))`); caching its result cannot change the value it
  would have produced.
- The compiler's custom `host.getSourceFile` (same file, unchanged by this diff)
  always constructs a fresh `ts.createSourceFile(name, text, ...)` from the text
  captured by `inputs.system.readFile` at Program-creation time, and nothing in
  this codebase calls TypeScript's incremental `updateSourceFile` API (checked
  with `grep -rn updateSourceFile src/lib`, no hits). `SourceFile.text` is
  therefore immutable input for the life of the object, so keying by object
  identity cannot observe a change during the call.
- The map is declared inside `discover()`, not hoisted to the enclosing
  `openTypeScriptProject` closure or module scope, so it is discarded when the
  call returns and cannot leak into a later opening. Tracing the two call sites
  (`evaluateModules` in `src/lib/evaluation.ts`, `evaluateDependencies` in
  `src/lib/dependencies/evaluate.ts`) and their only caller
  (`src/lib/cli.ts`, lines ~111-113) confirms the CLI invokes `discover()` exactly
  once per process via a mutually-exclusive ternary, so the call-local scope loses
  no achievable within-invocation reuse.

This satisfies the architectural-constraints.md requirement to "derive presented
source evidence from the captured analysis input supporting the claim, not from a
later filesystem read that may observe different content" — the cached value is
still exactly `digest` of the same captured `file.text` used before this change,
never a re-read. `methods.discovery` and every identity/hashing primitive
(`digest`, `snapshotId`, `recordId`, `canonical`) are untouched by the diff, so no
implicit analysis-method or identity-semantics change was introduced, consistent
with the decision record permitting a process to "retain an applicable snapshot in
memory" without establishing cross-process caching.

The new regression test exercises the boundary the handoff asked for: multiple
declarations, documentation, and forwarding/dependency evidence spans referring to
one file; a same-length on-disk edit made to the source file *between* two
`discover()` calls on an already-opened project, asserting the second call still
reproduces the pre-edit digest and records byte-for-byte (proving the cache
reflects captured input, not a later read); repeated discovery on one opening for
determinism; and two fresh openings (original and edited content) confirming the
snapshot id, source digest, and a specific excerpt all change together while
evidence-record population count and full record/outcome equality across
equivalent openings are preserved. This is adequate coverage of the optimized
boundary; I did not find a plausible failure mode it misses.

### Verification performed

- `npm run check` at the reviewed target: clean, no diagnostics.
- `npm test` at the reviewed target: 192 tests, 191 passed, 1 skipped. The skip is
  the pre-existing, environment-conditional
  `an existing link target with uncaptured case spelling remains unestablished
  rather than broken` test (requires a case-insensitive filesystem), unrelated to
  this change and present regardless of it.
- Independently reconstructed the baseline (`git archive db3a593` into a scratch
  directory, `node node_modules/typescript/bin/tsc` build, discarded afterward —
  the repository's `.gitignore` already excludes everything under `/_*/`, so this
  left no trace) and ran the repository's own `scripts/compare-analysis.mjs`
  against the current build. This imports both CLI implementations live and
  asserts `deepEqual` output/observation/view per case rather than trusting the
  retained JSON. All 21 documented cases printed `equal` across both dependency
  fixtures and PostCode's own `tsconfig.json`, matching the validation report's
  count and case list exactly.
- Ran one uncontrolled fresh-process timing sample per variant
  (`scripts/measure-analysis.mjs`) for PostCode `dependencies --json` as a
  sanity check, not a replication of the report's methodology: 32.4s before vs.
  7.2s after in this sandboxed shell. This confirms the same order of magnitude
  and direction as the published 39.09s → 4.82s figures; it does not match them
  exactly, which is expected given a single unwarmed sample on a different,
  shared host than the one the report measured on.
- Inspected `records/validation/2026-09-21-analysis-latency-data.json`
  structurally: 32 `runs` entries split 8 warm-up / 24 representative as claimed,
  2 `pilots`, 2 `cpuProfiles`, and the first pilot's recorded `wallMs` of 38090
  matches the report's "38.090 seconds" claim about tool-delivery delay not
  reflecting a real long-running outlier.
- Confirmed `docs/architecture/README.md`, `docs/backlog.md`, and
  `docs/cli-reference.md` describe the change accurately and without overclaiming
  (explicitly noting no cache/session option, further reduction as only a
  candidate, and that the historical outlier remains unexplained).

### Findings

No actionable defects found.

### Non-defect observations

- The digest cache is intentionally call-scoped rather than hoisted to the
  `openTypeScriptProject` closure, so it cannot be reused across repeated
  `discover()` calls against the same opened Program. Tracing actual callers
  shows this never happens today (one `discover()` call per CLI process), so
  nothing is left on the table by current usage; flagging only so a future
  caller that invokes `discover()` more than once per opening knows the reuse
  boundary is per-call, not per-opening, by design.
- My timing check and the retained-data inspection above are lighter-weight than
  the report's own controlled, alternating-order, paired series; I did not
  attempt to reproduce its CPU-profile stage attribution, host thermal/suspension
  counters, or the exact published percentages, since that requires the specific
  host and repeated controlled sampling the report already performed carefully.
  Treat my numbers as a plausibility check on direction and magnitude, not a
  second measurement of record.

### Unverified areas and residual limits

- Absolute timings, thermal-throttling behavior, and the historical 975-second
  outlier are host- and moment-specific and are not independently reproducible
  from this environment; the report itself states the outlier is not explained
  retrospectively, and I have no basis to add or subtract from that.
- I scoped code reading to the diff, its full enclosing function, and the actual
  call graph reaching `discover()`, rather than re-auditing unrelated parts of
  `src/lib/typescript/project.ts` or sibling modules the diff does not touch.

### Recommendation

The integrated review gate appears satisfied: the change is a small, correctly
scoped, call-local memoization of an existing pure digest computation; identity,
qualification, evidence population, and source-disclosure semantics are
unchanged; the new regression targets the right boundary; independent
re-verification (`npm run check`, `npm test`, and a live rebuild of the
comparison harness against a freshly reconstructed baseline) reproduces the
implementing agent's claims; and the measured improvement is directionally
confirmed. I found nothing that should block closing this review round.

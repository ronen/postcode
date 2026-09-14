# Final integrated independent review: returned findings

Reviewed: 2026-09-13
Reviewer: independent (fresh session; no prior involvement in this implementation)
Reviewed commit: `fee76353d011f93f0cf1f7bd377c94e96c4fe4c8` (checked out detached, exactly as named
by the handoff; the branch tip `9399e48` — a metadata-only handoff-preparation commit —
was **not** reviewed, per the handoff's own statement that it is metadata only)
Handoff reviewed: [`2026-09-13-module-inventory-final.md`](2026-09-13-module-inventory-final.md)

## Scope and method

Read, at the reviewed commit: `AGENTS.md`, `foundation/task-protocol.md`,
`foundation/product-design.md`, `foundation/baseline-conventions.md`,
`dev/conventions.md`, `dev/workflow.md`, the approved
[plan](../../docs/plans/initial-module-inventory-plan.md) and its three accepted
decision records, the [architecture overview](../../docs/architecture/README.md),
`README.md`, `docs/cli-reference.md`, `STATUS.md`, `docs/backlog.md`, the active
[task record](../tasks/2026-09-12-initial-module-inventory.md), the prior checkpoint
review and its findings/disposition, and the presentation-approval record.

Read the complete implementation: `src/cli.ts`, `src/lib/*.ts`,
`src/lib/typescript/*.ts` (records, memory-store, evaluation, projections, identity,
presentation, observations, project, expansions, inputs — ~1,900 lines total), and
all four test files (~980 lines, 51 tests). Cross-checked implementation behavior
against every decision in the three accepted decision records and against the
plan's success criteria, scope, and non-goals.

Ran the handoff's suggested reproduction at the reviewed commit:

- `npm ci` — clean, 0 vulnerabilities.
- `npm test` — **51/51 passed** (Node v22.13.1, npm 11.17.0), matching the claim.
- `npm run check` — passed, no type errors.
- `git diff 4a8914c..fee7635 --check` — no whitespace errors across the complete branch diff.
- Ran the CLI directly against `fixtures/exports/tsconfig.json` (Unicode and
  `--source-detail` inspection of `chain`) and against PostCode's own `tsconfig.json`
  (self-analysis). Self-analysis JSON reproduces exactly the population and
  materialization the final verification record claims: 174 modules, 349 evaluation
  records (1 discovery + 174 export + 174 documentation, all fully materialized),
  0 collapsed modules in JSON.
- Spot-checked the retained local validation evidence that happens to be present in
  this checkout under `_observations/validation/2026-09-13/` (git-ignored, not part
  of the reviewed commit): `view-final.json`, `view-final.txt`, and
  `inspect-final.txt` hash and byte-size exactly as recorded in
  `presentation-approval.md` and its manifest. This is supplementary corroboration,
  not a requirement of the review — the handoff correctly notes this evidence may be
  unavailable to a reviewer, and its absence would not have blocked this review.

Traced by hand, against the accepted decisions and the plan's success criteria:
the record/store/evaluation/projection boundary (`records.ts`, `memory-store.ts`,
`evaluation.ts`, `projections.ts`); TypeScript module discovery and the population
contract (`project.ts`); effective-export tracing including aliasing, re-export,
wildcard forwarding, export-assignment, type-only propagation, and merged/overloaded
symbols (`expansions.ts`); exact selector resolution (name/handle/compact-ID,
zero/one/many, snapshot scoping) (`projections.ts`); presentation construction and
rendering, including display bounding, omission counting, and source-detail
disclosure (`presentation.ts`); and the observation batch/sink boundary
(`observations.ts`, `cli.ts`).

## Findings

No blocking findings. I found no defect that contradicts the plan, the accepted
decisions, or the product design's epistemological contract in any code path
exercised by the test suite, and I independently traced several paths (export
tracing, selector resolution, source-evidence grouping, display-omission counting)
by hand rather than relying on the tests alone.

Two low-severity, non-blocking notes, both narrow and neither newly introduced by
work since the first checkpoint review:

### 1. Latent file-less-diagnostic branch remains unaddressed (informational, not a regression)

- **Where:** `src/lib/typescript/project.ts:177-181` (the `qualifications` closure
  inside `discover`).
- **What:** `qualifications(sourceFiles, projectWide)` filters encountered syntactic
  diagnostics with `diagnostic.file === undefined ? projectWide : sourceFiles.includes(diagnostic.file)`.
  This function is invoked once for the global (project-wide) context and once per
  module, with `sourceFiles` narrowed to that module's own files. A hypothetical
  file-less syntax diagnostic would pass the `projectWide` branch for the *global*
  call but would also incorrectly pass it for *every per-module call*, since the
  ternary's `projectWide` argument is fixed per call-site rather than being `false`
  for the per-module case. That would attach a population-wide diagnostic to every
  individual module's narrower Claim context rather than only the shared one.
- **Why it isn't blocking:** `program.getSyntacticDiagnostics()` diagnostics always
  carry a `file` in current TypeScript (6.0.3), so this branch is presently
  unreachable dead code, not a live defect. This is exactly the same observation the
  first architectural-checkpoint review recorded (its finding #3) at commit
  `da8e722`; it was explicitly dispositioned then as "not a live bug... a fixture is
  probably not worth building for an unreachable path," and remains true at this
  final commit. I am re-noting it only because the final review handoff asks for a
  complete accounting, not because it is new or because its disposition should change.
- **Suggested action:** none required. If ever revisited, passing `false` for the
  per-module call's `projectWide` argument (rather than reusing the outer scope's
  boolean) would remove the latent asymmetry at negligible cost.

### 2. Theoretical, unreachable ambiguity between a module name and the compact-Entity-ID text format (informational)

- **Where:** `src/lib/projections.ts:20-31` (`compactId`, `handleOnly`, and
  `referenceStatus` in `project()`).
- **What:** Selector resolution checks `compactId` (selector matches a computed
  `module-<hex>` compact ID) independently of whether the same selector also happens
  to equal some module's actual TypeScript name. If a project's TypeScript-established
  module name literally had the shape `module-<hexdigits>`, `compactId` would be
  `true` for that string regardless, forcing `referenceStatus` to `'snapshot-required'`
  even for what should be an ordinary current-snapshot name lookup (per the decision
  that "exact names are current lookups" needing no `--snapshot`).
- **Why it isn't blocking:** compact IDs are always derived from a SHA-256 digest
  prefix, so a colliding *established* module name is not something any real
  TypeScript project can produce by ordinary means (it would require a literal
  ambient-module string or resolved specifier equal to that generated text, which
  the tests never approach and which is not a realistic scenario the plan or
  decisions anticipate). No fixture exercises this, and none of the accepted
  decisions require guarding against it.
- **Suggested action:** none required now; if the compact-ID alphabet or generation
  scheme changes later, it would be worth reconfirming this can't collide with real
  TypeScript module names in practice.

## Focus-by-focus disposition (per the handoff's six review points)

1. **Plan coverage and boundaries:** sound. Rendering (`createView`/`renderView`)
   reads only materialized records and never queries the store or triggers
   evaluation; I traced this explicitly. `MemoryProgramRecordStore.put` validates
   references and kinds before committing any record in a batch (two-pass
   validate-then-commit), and freezes committed records, so cross-references and
   immutability invariants hold. No capability is hidden behind an incomplete
   milestone — expansions, presentations, source detail, and observations are all
   integrated and exercised end to end.
2. **TypeScript semantics and qualifications:** sound. I traced `expansions.ts`'s
   `trace()` function (the core of effective-export resolution) by hand against the
   `fixtures/exports/*` cases — direct, default, aliased, re-exported, wildcard
   (including the two-hop `chain.ts → barrel.ts → origin.ts` case), and CommonJS
   `export=`/property forwarding — and confirmed the recorded routes, type-only
   propagation, and merged/overloaded-symbol handling match what the compiler
   actually exposes, both via the tests and via direct CLI inspection
   (`--source-detail` on `chain` reproduces the expected forwarding/defining/alias
   hierarchy exactly). Unresolved targets, conflicting wildcard origins, and
   diagnostics correctly qualify results rather than being silently dropped or
   strengthened.
3. **Identity and exact selection:** sound, aside from the theoretical note #2 above.
   `moduleEntityIds`'s prefix-extension algorithm (compare only against sorted
   lexicographic neighbors) is a correct, well-known property of sorted-string LCP,
   confirmed both by reasoning and by the collision-fixture test. Snapshot-scoping
   of handles/compact IDs, current-snapshot name lookup, and stale-reference/mismatch
   handling all behave as decided, and I confirmed this against live CLI runs, not
   only the test suite.
4. **Conceptual/source boundary:** sound. Normal presentations contain no path,
   location, or compiler-node detail (confirmed both by test and by direct
   inspection of non-`--source-detail` JSON output); `--source-detail` groups
   evidence by displayed module/export, separates forwarding from defining source,
   never re-reads the filesystem (evidence is captured at discovery time), and
   file-level module associations correctly carry no excerpt. The unique
   `presentation.expansions` list (the human's final pre-approved correction) does
   not suppress per-module qualified outcomes — `evaluations` still carries one
   scoped record per module per requirement, which I confirmed directly in the
   regenerated self-analysis JSON (349 records) and in `test/expansions.test.ts`'s
   dedicated regression.
5. **Observation and exclusion:** sound. Batches are self-contained, UUID-addressed,
   and version-zero; the local sink writes private (`0700`/`0600`) files and reports
   delivery failure without invalidating a successful view (confirmed by test and by
   reasoning about `cli.ts`'s try/catch around `sink.submit`). Output-location
   exclusion is enforced before any filesystem read, including for a nested
   configuration outside the checkout root, with a dedicated regression test. No
   remote sink or historical-read capability exists, consistent with the decisions.
6. **Evidence and remaining risk:** the verification record's claims reproduce
   exactly (test count, type-check, whitespace, self-analysis population/
   materialization counts, and — where locally available — retained artifact
   hashes). I found no misleading claim or material discrepancy between the current
   documentation (`README.md`, `docs/cli-reference.md`, `docs/architecture/README.md`,
   `STATUS.md`) and the implementation's actual behavior. Historical review/
   validation records correctly describe the commit they were written against
   rather than being silently updated to describe the final commit; the task
   record's final "Outcome"/"Verification" entries do correspond to the reviewed
   commit `fee7635`.

## Verification reproduced vs. not performed

**Reproduced:** `npm ci`, `npm test` (51/51), `npm run check`, full-branch
`--check` whitespace diff, direct CLI exercise (Unicode inventory, `--source-detail`
inspection) against `fixtures/exports`, PostCode self-analysis (population/
materialization counts match the approval record exactly), and byte/hash
verification of the three final validation artifacts that happened to be present
locally.

**Not performed (relying on the existing record instead):** re-running the
unfamiliar-repository (p-queue) exercise from a fresh clone — the existing
[p-queue validation record](../validation/2026-09-13-p-queue.md) already documents
a pinned revision, reproduction commands, and independently checked export sets,
and I saw no reason to doubt it; re-running the clean-agent structured-question
exercise — this is a usability/instrument-validation exercise already completed and
recorded, not a correctness check within this review's scope; and re-deriving the
SHA-256 manifest for every retained local artifact (I spot-checked three
representative files rather than all of them).

## Close/no-close call

**No finding here prevents closing the task.** The implementation satisfies the
plan's success criteria, scope, and internal-boundary requirements; preserves the
product design's epistemological distinctions (claim vs. Claim context vs.
evaluation outcome vs. projection; conceptual vs. source-level presentation;
recorded assertion vs. established fact) in every path I traced; and the two notes
above are informational only — neither is a new defect, neither is reachable by any
input the plan or decisions contemplate, and neither requires implementation
changes before closure. The task's remaining gate — this final independent
review — is, from my independent reading, satisfied. Closure otherwise remains the
human's decision per the task protocol.

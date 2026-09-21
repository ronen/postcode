Record type: handoff
Prepared: 2026-09-21
Task: [Investigate and reduce analysis latency](../../tasks/2026-09-21-analysis-latency.md)
Review gate: final integrated review before task closure
Review target: `b74c454c08c95a5aae7aacff816b27019fecaf9f`
Baseline: `db3a5934ec219b0c45974a13135aa2a36eead92c`
Diff range: `db3a5934ec219b0c45974a13135aa2a36eead92c..b74c454c08c95a5aae7aacff816b27019fecaf9f`
Branch: `codex/analysis-latency`

# Analysis latency integrated review

## Review assignment and boundaries

Review the bounded implementation, measurement evidence, regression coverage and
documentation against the approved task. Inspect the code and evidence directly;
this handoff and the implementing agent's passing checks are not proof of
correctness. Recommend whether the integrated review gate is satisfied and
identify actionable defects or material gaps.

The task remains active. This is a human-arranged review under the
[development workflow](../../../dev/workflow.md#verification) and
[independent-review workflow](../../../dev/review.md). The reviewer may commit
only its findings record, following the return procedure below. Do not modify
implementation, governing material, task status or the task record. Do not expand
scope into sessions, durable caches, provider incompleteness or new features.

The exact target above is the implementation under review. The handoff's own
commit is assignment metadata, outside the implementation diff.

## Governing context

- The [approved task](../../tasks/2026-09-21-analysis-latency.md) specifies profiling,
  bounded optimization, contamination handling, semantic equivalence and reporting.
- [Core concepts](../../../docs/core-concepts.md) and
  [architectural constraints](../../../docs/architectural-constraints.md) preserve
  snapshot identity, qualification, captured evidence and observation boundaries.
- [Projection architecture decisions](../../../docs/decisions/initial-projection-architecture-decisions.md)
  permit implementation-specific eager evaluation and internal shared work without
  establishing a cross-process cache lifecycle.
- [Module inventory decisions](../../../docs/decisions/initial-module-inventory-decisions.md),
  [repository organization decisions](../../../docs/decisions/repository-organization-decisions.md),
  [dependency structure decisions](../../../docs/decisions/module-dependency-structure-decisions.md),
  [dependency organization decisions](../../../docs/decisions/dependency-organization-integration-decisions.md)
  and [observation decisions](../../../docs/decisions/initial-observation-recording-decisions.md)
  continue to govern unchanged behavior.
- [Engineering guidelines](../../../dev/engineering-guidelines.md) and
  [implementation conventions](../../../docs/implementation-conventions.md)
  govern the implementation and checks.

## Result under review

The only production change is in the TypeScript integration's project discovery:
compute the existing content digest once per captured compiler `SourceFile`
object per discovery call, and reuse it for snapshot source entries and evidence
records. The map is created after compiler preparation; it handles any further
evidence file on first use and cannot survive into another discovery call.

No source reads, compiler queries, records, evaluations, provider coverage,
qualifications or observation submissions were removed. There is no public API or
schema change and no new session, persistent cache or dependency. Identity methods
are unchanged because content and semantics are intended to remain exactly equal.

The [validation report](../../validation/2026-09-21-analysis-latency.md) contains the
measurement design, stage attribution, contamination policy, limitations,
reproduction commands and links to retained raw timing and equivalence data.
The new scripts instrument a disposable compiled copy rather than adding runtime
telemetry. Their purpose is development validation, not product functionality.
Architecture, CLI reference, status and the existing performance backlog entry
are updated. Further latency reductions remain a candidate, not part of this task.

## Verification already performed

- `npm run check` passed and `npm test` passed all 192 tests.
- The new source-evidence regression checks multiple evidence spans and captured
  content, repeat discovery, same-length edits, fresh openings, snapshot changes,
  and deterministic records/outcomes without timing thresholds.
- Paired fresh processes: three samples plus one warm-up per implementation per
  command, two commands on PostCode and two on the six-module dependency fixture.
  All 32 attempts succeeded; no suspension signal, timeout or material timing
  outlier was found. Wall/monotonic clocks, CPU, load, memory and parent heartbeat
  are retained. Two CPU pilots and later tooling smoke runs are separate.
- Median end-to-end dependency latency fell from 39.093s to 4.821s (87.67%);
  organization fell from 38.995s to 4.351s (88.84%). The small fixture stayed near
  0.9s. Rendered hashes match across every before/after run of each case.
- Twenty-one exact before/after CLI comparisons passed, covering inventory,
  organization, dependency structure, focused navigation, source detail, stale
  snapshot refusal and observation content apart from random IDs.
- Baseline reconstruction from the recorded commit matched all application files;
  two pre-existing unimported build siblings were identified and left untouched.
  Script syntax and the final diff whitespace checks passed.

These are implementing-agent checks, not independent verification.

## Review focus and reproduction

1. Confirm the compiler object's text is stable during the reuse lifetime and the
   map cannot return stale content for a later opening or path reuse. Check that
   snapshot and evidence digests retain the same canonical hashing semantics.
2. Confirm coverage, qualification, evidence population/spans/excerpts, source
   disclosure and observation recording remain intact. Assess whether the new
   regression sufficiently covers the optimized boundary.
3. Inspect raw samples and CPU attribution. Check comparable subject inputs,
   fresh processes, warm-ups, alternating order, nested-stage accounting,
   anomalous-run disposition and honest limits of suspension detection. The
   historical 975-second outlier is explicitly not explained retrospectively.
4. Check that reported improvement supports this small optimization and that
   no broader lifecycle or identity change has been introduced implicitly.
5. Run `npm run check` and `npm test`. Follow the validation report's reconstruction
   commands for a timing rerun and exact output/observation comparisons. Avoid
   concurrent builds/tests while measuring, and keep subject inputs fixed.

Absolute timings are specific to the measured host and warm filesystem conditions.
The output capture does not measure terminal painting or tool-delivery latency.
Thermal throttling was not measured directly. The small fixture shares the
PostCode worktree, isolating TypeScript scale while retaining repository cost.
These limitations are intentional and documented, not claims of universal speed.

## Findings return

Use review name `integrated` and the
[findings template](../../../dev/templates/review-findings.md). With repository
write access, create
`records/reviews/analysis-latency/YYYY-MM-DD-integrated-round-1-findings.md`, beginning
with `Record type: findings`. Record the reviewer, this handoff, round, exact target
and scope actually reviewed, method, checks performed, actionable findings,
non-defect observations, unverified limits and gate recommendation. Preserve the
report under `## Returned findings`. Commit only that findings record and modify
nothing else. Without write access, return the findings to the human for delivery.

For subsequent rounds, increment the round number and identify prior findings,
the prior target and the exact revised target. Continue under this handoff while
its assignment remains applicable; do not rewrite the handoff after review starts.

## Review gate

The human chooses and arranges the reviewer. The implementing agent must not
infer acceptance from a reviewer's recommendation. Address authorized in-scope
findings, preserve their disposition, and obtain further review if material
corrections invalidate an earlier review. Close the task only after the human
states that the review gate is sufficient and all remaining authorized work and
verification are satisfied.

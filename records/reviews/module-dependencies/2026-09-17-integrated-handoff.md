Record type: handoff
Prepared: 2026-09-17
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Review gate: Final integrated implementation review
Review target: `93d6d7d52bc3715276014a85f197db5e7f8a72b8`
Baseline: `8dac095574bc7dd40ab105d2ce1fe5524c1cf647`
Diff range: `8dac095574bc7dd40ab105d2ce1fe5524c1cf647..93d6d7d52bc3715276014a85f197db5e7f8a72b8`
Branch: `codex/module-dependencies`

# Module dependencies integrated review

## Review assignment and boundaries

Review the complete approved slice across provider, records, expansions, projections,
presentation, CLI navigation, observations, documentation and retained validation.
This is the final integrated gate requested by the human, following the narrower
provider and graph checkpoints. Inspect implementation and relevant evidence;
this handoff, earlier reviews and implementing-agent verification are not proof of
correctness. Recommend whether the integrated result is ready for human acceptance,
identifying defects, uncertainties and material verification gaps separately.

Review is read-only except for the findings record described below. Do not modify
implementation, governing material, task status or the active task record. The
handoff commit is outside the implementation range; use the exact target above.

## Governing context

- [Approved plan](../../../docs/plans/module-dependencies-plan.md) and the task's
  preserved follow-ups, including parent-view disclosure and evaluator authorization.
- [Core concepts](../../../docs/core-concepts.md),
  [architectural constraints](../../../docs/architectural-constraints.md), and
  [implementation conventions](../../../docs/implementation-conventions.md).
- [Dependency structure decisions](../../../docs/decisions/module-dependency-structure-decisions.md),
  read with the superseding [bounded CommonJS decision](../../../docs/decisions/bounded-commonjs-source-evidence-decision.md).
  The historical decision was preserved, not rewritten.
- [Dependency organization integration](../../../docs/decisions/dependency-organization-integration-decisions.md),
  [composition property](../../../docs/decisions/module-composition-property-decision.md), and
  [subject-kind standard expansions](../../../docs/decisions/subject-kind-standard-expansion-decision.md).
- [Architecture overview](../../../docs/architecture/README.md) and
  [CLI reference](../../../docs/cli-reference.md) describe the resulting behavior.
- Earlier [provider-contract disposition](2026-09-16-provider-contract-disposition.md),
  [provider-integration disposition](2026-09-16-provider-integration-disposition.md), and
  [graph/expansion disposition](2026-09-17-graph-expansions-disposition.md) link all
  prior findings and corrections. Their narrower acceptance does not replace this gate.

## Result under review

Dependency analysis captures source-request occurrences with separate recognition
and resolution outcomes and creates direct relationships only from established
endpoints. Whole-edge type-only qualification depends on every contributing
occurrence. CommonJS recognition uses the approved ordered lexical, context and
binding contract, including classic CommonJS and bounded preserve-mode support.
It makes no runtime execution or loader-equivalence claim.

Stored dependency data feeds structure, children and parents projections. Project
SCCs include isolated modules; opaque external endpoints do not become traversal
inputs. Composition is a positive qualified module property, separate from discovery
facets and relationship mechanisms. Organization comparison uses occurrence-specific
endpoints and conservative aggregation, preserving unknown and partial outcomes.

The CLI supplies Unicode and experimental JSON dependency views, scoped precise
navigation and explicit source detail. Bounds disclose omissions; cycle member
lists do not invent pairwise edges. Every dependency view states bounded CommonJS
coverage. Parents show established incoming relationships and explain why requests
without established children cannot produce a parent result; source-owned request
results and recognition-coverage records remain in structure/child views.

Generated inspection navigation explicitly requests dependency context to reproduce
the relevant snapshot preparation. Ordinary module and organization invocations do
not silently run that additional analysis. Source-detail navigation performs fresh
analysis; captured evidence belongs to that invocation, not historical retrieval.
Request and coverage row numbers are local to a view. Observations retain the actual
rendered artifact and source-disclosure level.

## Verification already performed

The implementing agent ran type checking and all **188 tests**, passing at code
commit `3d8d5349ad604225963094eecb0cb4cd0d31372a`. The target adds only durable validation
and status documentation. Tests include compiler characterization, production
provider evidence, multi-file aggregation, atomic record validation, graph and
organization qualification, composition, CLI navigation, display bounds, source
separation, observations, terminal controls and deterministic identities.

The [integrated instrument report](../../validation/module-dependencies/2026-09-17-integrated-instrument.md)
links retained captures, exact invocation summaries, exceptional fixture contents,
provider counts, original ts-node opening failure and all clean evaluator responses.
The six-module journey exercises a root, branching, shared child, intermediary,
children, parents and precise inspection. Boundary views exercise cycles, isolated
modules, external opacity and pruning. PostCode and adapted ts-node were analyzed
without executing their target code. The adaptation retains the original 66 source
roots and the original configuration failure; it is not presented as an unchanged
original opening.

Two human-authorized fresh agents interpreted supplied views without implementation
context. Their feedback improved notation, qualifications, omission disclosure and
fresh source navigation. This is comprehension validation, not independent
implementation review or human gate acceptance.

## Review focus and reproduction

Pay particular attention to cross-layer evidence preservation and negative cases:

1. Check recognition precedence, completed shadowing analysis, unavailable/conflicting
   evidence, preserve-mode requirements, owner attribution, resolution and population
   boundaries. Non-edges must not become dependencies or runtime claims.
2. Check occurrence-backed aggregation, whole-edge type-only qualification and
   diagnostics across multiple source files. Validate stored reference ownership and
   rejection atomicity, not just successful fixture construction.
3. Check graph roots, SCC membership versus actual directed edges, external endpoint
   opacity and display omissions. Compare Unicode with its qualified JSON model.
4. Check composition evaluation across declarations and conservative organization
   aggregation over narrowed endpoints, placement alternatives and incomplete evidence.
5. Check parent disclosure against the authorized contract, source-owned results in
   other views, source-detail bounds and observation fidelity. Bounded snippets may
   omit surrounding binding declarations and are not full independent proofs of the
   compiler classification.
6. Check exact/scoped navigation and mismatch rejection, explicit dependency-context
   preparation, method versions and reproducible identities. Fresh commands cannot
   promise historical snapshot retrieval or stable row numbers.
7. Compare documentation and instrument conclusions with implementation and captures;
   assess residual instrument friction and verification gaps independently.

From the target checkout, run:

```sh
npm run check
npm test
npm run postcode -- dependencies --project fixtures/dependency-journey/tsconfig.json
npm run postcode -- dependencies --project fixtures/dependency-journey/tsconfig.json --json
```

Use the emitted precise IDs and navigation commands for children, parents, inspection
and source detail; do not reuse historical captured snapshot IDs. Avoid concurrent
tracked edits during deterministic self-analysis tests. The instrument report links
PostCode/ts-node commands and the earlier adaptation investigation; reproduce that
explicit setup rather than silently repairing the original ts-node configuration.

Known limits remain visible: Unicode and supporting source evidence are bounded;
JSON retains full graph/relationship structure but supporting detail is also bounded.
Unestablished ownership and partial organization evidence are not upgraded to certainty.
CommonJS support is source evidence within its stated contract. No new caching or
runtime execution was introduced. Fresh actual CLI timings were 39.225–42.447 seconds
for PostCode and ordinarily 27.131–28.346 seconds for ts-node, with one unexplained
975.779-second outlier retained. These uncontrolled samples are not a latency bound.
Whole-repository corrected captures precede the last wording-only change; fresh
fixture captures and both evaluator confirmations cover that final wording, as the
report explicitly records. Full duplicate JSON envelopes are not committed.

## Findings return

If repository write access is available, use the
[findings template](../../../dev/templates/review-findings.md) and create
`records/reviews/module-dependencies/2026-09-17-integrated-round-1-findings.md`.
Identify reviewer, this handoff, round, exact target and scope actually reviewed,
method, checks performed, actionable findings, non-defect observations, unverified
areas and gate recommendation. Preserve the authored report under `## Returned findings`.
Commit only that record and modify nothing else. Otherwise return the findings to
the human, who will supply them for durable preservation. Subsequent rounds use
`YYYY-MM-DD-integrated-round-N-findings.md` with prior findings and prior target
metadata, remaining under this handoff unless the assignment materially changes.

## Review gate

Implementation and planned verification are substantially complete. The implementing
agent now pauses for the human to arrange final independent review. Returned findings
will receive recorded dispositions; clear in-scope corrections may be implemented,
while rejection, material qualification, consequential alternatives, scope expansion
or unresolved reviewer uncertainty require human direction. Material corrections
may require further rounds. The task remains active and must not close until the
human explicitly states that the accumulated final review gate is sufficient.

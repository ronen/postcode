Record type: handoff

# Module dependency provider integration review

Prepared: 2026-09-16
Task: [Implement module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Review gate: intermediate production-provider/evidence checkpoint before graph and presentation integration
Review target: `688bf45180dd20f8193aadf181d57d555c81e38b`
Baseline: `3e5d8987f6ed43bc661a81926f3e7857b8ba98d4`
Diff range: `3e5d8987f6ed43bc661a81926f3e7857b8ba98d4..688bf45180dd20f8193aadf181d57d555c81e38b`
Branch: `codex/module-dependencies`

## Review assignment and boundaries

Independently assess the production TypeScript dependency provider, occurrence and
relationship records, evaluation boundary, identity/evidence handling, and tests.
The earlier [provider-contract assignment](2026-09-16-provider-contract-handoff.md)
characterized compiler behavior before implementation; its
[two-round disposition](2026-09-16-provider-contract-disposition.md) records human
approval of the ordered rule and authorization to resume. This new assignment
reviews executable integration, not another characterization-only correction.

The record model and compiler-to-record boundary now support downstream graph and
organization claims. Independent review at this point can expose attribution,
recognition, resolution, or aggregation errors before those consumers depend on
wrong evidence. Review actual implementation and fixtures rather than treating
this handoff, prior reviews, validation reports, or green tests as proof.

Recommend whether the checkpoint is sound enough for continued implementation,
identify defects and missing acceptance evidence, and distinguish remaining
planned work from defects in this checkpoint. Do not change implementation,
governing material, task status, or any existing review record. A reviewer's
recommendation does not authorize resumption, scope changes, or task closure.

## Governing context

- [Approved plan](../../../docs/plans/module-dependencies-plan.md), particularly
  occurrence evidence, CommonJS coverage, type-only qualification, population,
  identity, and Approach steps 1–2.
- [Core concepts](../../../docs/core-concepts.md) and
  [architectural constraints](../../../docs/architectural-constraints.md).
- [Dependency structure decisions](../../../docs/decisions/module-dependency-structure-decisions.md),
  applying the [bounded CommonJS superseding decision](../../../docs/decisions/bounded-commonjs-source-evidence-decision.md)
  instead of the superseded headed CommonJS decision.
- [Approved ordered recognition contract](../../validation/module-dependencies/2026-09-16-final-recognition-contract.md),
  including the recorded subsequent human approval.
- [Dependency and organization integration](../../../docs/decisions/dependency-organization-integration-decisions.md),
  relevant to preservation of occurrence-specific and target-specific evidence;
  organization classification itself is not implemented at this checkpoint.
- [Engineering guidelines](../../../dev/engineering-guidelines.md),
  [implementation conventions](../../../docs/implementation-conventions.md), and
  [review workflow](../../../dev/review.md).

## Result under review

The explicit dependency evaluator requests production discovery plus dependency
preparation and records distinct outcomes. Preparation remains inside the
TypeScript integration and finishes compiler/host queries before snapshot identity
is finalized. Ordinary discovery does not implicitly request dependencies.

New addressable records preserve recognized occurrences, non-edge target results,
recognition/ownership coverage outcomes, actual target declaration evidence, and
one directed relationship claim per ordered module pair. Every relationship
retains supporting occurrences; whole-edge type-only requires unanimous occurrence
evidence. External interiors remain opaque, and file resolution cannot expand the
existing module population. Store validation rejects unsupported relationships and
false aggregation. No compiler objects cross into the domain.

CommonJS recognition implements the reviewed ordered lexical/context/declaration
rule. Literal CommonJS resolution uses the captured configured file resolver in
CommonJS mode, with exact ambient-symbol evidence as the non-file fallback.
Other supported literal syntax retains direct checker-symbol evidence, including
wildcard ambient targets. Raw resolver paths and actual target correspondence are
kept distinct, including the same-name ambient declaration/package-file case.

The [implementation and validation record](../../validation/module-dependencies/2026-09-16-dependency-provider-integration.md)
and [retained repository outputs](../../validation/module-dependencies/2026-09-16-dependency-provider-validation.json)
describe the established boundaries and qualifications. Current architecture and
status documentation describe the new library capability without claiming a
new CLI view.

## Verification already performed

Implementing-agent verification, not independent verification:

- `npm run check` passed; `npm test` built the project and passed all **168 tests**,
  including **17 production-provider tests** and **22 compiler-contract tests**.
- Existing CLI, observation, discovery, organization, determinism, and store tests
  passed. New store tests cover unsupported edges and false whole-edge claims.
- Production tests cover classic/mixed/preserve recognition, missing and conflicting
  declaration evidence, same-kind global implementations, named annotations,
  lexical completion, direct intermediates, non-edge outcomes, exact/wildcard
  ambient targets, import-type resolution modes, external and unresolved
  augmentation ownership, output exclusions, self/cyclic edges, fresh-process
  determinism, captured evidence, and unavailable/partial/failed evaluation.
- Production probes ran on PostCode and the documented adapted ts-node checkout.
  The latter recognizes all 21 surveyed core CommonJS calls, retains both cited
  internal relationships with mixed mechanisms and non-type-only qualification,
  and preserves the three nonliteral requests without edges. The original
  ts-node configuration still fails opening with 5107 and 5102.
- `git diff --check`, changed-document local links, and retained-output checks
  passed. The earlier compiler probe's metadata label was subsequently corrected
  from “provider implemented” to “provider exercised”; type checking was rerun.

## Review focus and reproduction

Focus particularly on:

1. Faithful implementation of the approved ordered CommonJS rule, including
   missing declarations versus incomplete lexical work, synthetic JavaScript
   symbols, global/local declarations, and first-blocking-outcome evidence.
2. Request ownership at namespace, named-module, global-augmentation,
   unresolved-augmentation, and external-module boundaries. No fallback should
   invent an owner or silently analyze external interiors.
3. Literal resolution, usage modes, file/ambient precedence, direct target
   identity, out-of-population qualification, and actual target-evidence
   correspondence. Does the preserved evidence safely support later organization
   placement without confusing the raw file resolver with a checker target?
4. Occurrence completeness, nonliteral/excluded/unresolved distinctions, direct
   re-export intermediates, aggregation, type-only conservatism, self edges, and
   every retained edge in cycles.
5. Captured-host/output filtering, snapshot method/input identity, store integrity,
   repeatability, separate evaluation outcomes, and unexpected-error propagation.
6. Whether the production fixtures pin the promised contract sufficiently, and
   whether repository validation conclusions match the retained results and
   disclosed environment rather than runtime or loader assumptions.

Suggested commands from the development checkout:

```sh
npm run check
npm run build
node --test _build/test/dependencies.test.js _build/test/dependency-contract.test.js
npm test
git diff --check 3e5d8987f6ed43bc661a81926f3e7857b8ba98d4 688bf45180dd20f8193aadf181d57d555c81e38b
```

For repository reproduction, use the production probe commands in the validation
record. The ts-node revision, installed-environment qualifications, exact adapted
configuration, original opening failure, and root-selection comparison are
retained in the linked validation records. No target code or lifecycle scripts
need be executed. Retained outputs were captured before their own repository
record was added; snapshot identity necessarily changes with repository inputs.
Report which repository checks you actually reproduced.

## Remaining planned work and known limits

This is not the final integrated implementation. Graph projections, roots and
strongly connected components, focused selection, module composition,
organization expansion, discovery-facet renaming, dependency CLI/presentations,
navigation, observation artifacts, final instrument usability evaluation, and
final integrated review remain required.

A completed/full dependency result describes this bounded pass, not universal
module recognition. Unsupported ownership/context and non-edge results remain
explicit. No platform/runtime identity is inferred from a specifier. The eager
provider has no cancellation scheduler; synthetic providers test evaluation-state
preservation. Provider-only timing samples are not final CLI cost measurements.

## Findings return

If you have repository write access, use
[the findings template](../../../dev/templates/review-findings.md). Create
`records/reviews/module-dependencies/YYYY-MM-DD-provider-integration-round-1-findings.md`
(or a later round number when appropriate). Identify this handoff, the exact
implementation target and baseline actually reviewed, your method and performed
verification, actionable findings, non-defect observations, residual uncertainty,
and your recommendation. Preserve your report under `## Returned findings`.
Commit **only** that findings record; modify nothing else.

If you cannot write to the repository, return the complete findings to the human
for preservation and disposition. Further rounds under this assignment retain
this handoff unchanged and state the new exact reviewed target in their findings.

## Review gate

Implementation pauses here for the human to arrange independent review. Findings
will be assessed and resolved under the user's disposition instructions. Resume
downstream implementation only after the human determines that this intermediate
gate is sufficient. The task remains active; completion still requires the final
integrated-review handoff, review rounds, and explicit human acceptance.

Record type: handoff

# Module dependency graph and expansions review

Prepared: 2026-09-17
Task: [Implement module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Review gate: intermediate graph and qualification checkpoint before presentation integration
Review target: `a5027451624aca573008668f6efbcca48151d586`
Baseline: `2e14de1db8a4fc0377b740be9988a1f0c3aaf776`
Diff range: `2e14de1db8a4fc0377b740be9988a1f0c3aaf776..a5027451624aca573008668f6efbcca48151d586`
Branch: `codex/module-dependencies`

## Review assignment and boundaries

Independently assess the dependency graph projections, module composition property,
relationship organization expansion, record/store boundaries, and discovery-facet
rename. The previous [provider integration assignment](2026-09-16-provider-integration-handoff.md)
was accepted by the human after its diagnostic correction and multi-file regression;
its [disposition](2026-09-16-provider-integration-disposition.md) records that gate.
This assignment reviews the new consumers of that evidence. Multi-placement
classification and partial evaluation now control what the forthcoming views may
claim, so independent review before presentation integration materially reduces risk.

Inspect the implementation and tests directly. This handoff, earlier reviews, and
green checks are context, not proof of correctness. Recommend whether this checkpoint
is sound enough for continued implementation. Distinguish defects in this checkpoint
from the planned remaining work below. Do not change implementation, governing
material, task status, or existing review records. The human arranges the review
and decides whether the gate is sufficient.

## Governing context

- [Approved plan](../../../docs/plans/module-dependencies-plan.md), especially graph
  semantics, composition, organization integration, and evaluation distinctions.
- [Core concepts](../../../docs/core-concepts.md) and
  [architectural constraints](../../../docs/architectural-constraints.md).
- [Dependency structure decisions](../../../docs/decisions/module-dependency-structure-decisions.md).
- [Bounded CommonJS evidence decision](../../../docs/decisions/bounded-commonjs-source-evidence-decision.md),
  which supersedes the earlier bundle's CommonJS decision.
- [Composition decision](../../../docs/decisions/module-composition-property-decision.md).
- [Organization integration decisions](../../../docs/decisions/dependency-organization-integration-decisions.md).
- [Subject-kind expansion decision](../../../docs/decisions/subject-kind-standard-expansion-decision.md).
- [Implemented architecture](../../../docs/architecture/README.md) and the active task above.

## Result under review

The library now constructs a project structure projection and direct child/parent
projections from stored dependency records. Structure preserves isolated modules,
strongly connected component members, all internal relationships, shared children,
and opaque external endpoints. Roots are established only for complete module and
dependency evaluations. Focused selection reuses exact names and snapshot-scoped
handles/IDs. Non-edge requests remain source-owned and are not incoming edges.

An explicitly requested composition expansion examines every captured declaration,
ignoring only comments and empty statements. It emits a qualified positive
`re-exports-only` claim or a separate evaluation outcome, never an inverse property.
Discovery classifications are renamed to `discoveryFacets` in records and existing
experimental presentation JSON. Composition is not in that collection.

The optional organization expansion uses matching stored dependency and organization
evaluations without I/O. Source occurrence and target declaration evidence narrow
placements; broader placement claims provide fallback. Applicable combinations,
common ancestors and containment support, variation by placement/occurrence,
partial/unavailable evaluation, and candidate ambiguity remain explicit. The existing
captured-path placement helper is extracted without changing organization evaluation.

Record references and selected structural invariants are validated atomically by
the memory store. New methods and schema/discovery/presentation versions participate
in snapshot identity.

## Verification already performed

Implementing-agent verification:

- `npm run check` passed with TypeScript 6.0.3.
- `npm test` passed all **181 tests**, including the existing provider and compiler
  characterization tests and **11 new graph/expansion tests**.
- New tests cover SCC roots, isolated modules, self loops, shared children, direct
  selection and opaque endpoints, non-edge ownership, incomplete dependency and
  organization evaluation, all supported re-export families and disqualifying
  statement categories, merged declarations, source narrowing, target variation,
  occurrence variation, fallback partial/ambiguous placement, multiple containment
  parents, established-empty outcomes, cross-process determinism, and atomic rejection
  of invalid graph indices or missing occurrence support.
- `git diff --check` passed after removing an extra trailing blank line.

Fixtures use real TypeScript programs and temporary Git repositories. Synthetic
stored outcomes specifically exercise partial containment and target-placement
fallback/ambiguity; the repository provider itself does not invent ambiguous
candidate placements. Test harness assumptions about anonymous-module handles and
snapshot-scoped selection were corrected during development; the final suite passes.

## Review focus and reproduction

Run `npm run check` and `npm test`; focused reproduction is
`npm run build && node --test _build/test/dependency-projections.test.js`.

Prioritize:

1. Population and root semantics under complete, incomplete, unavailable, and empty
   evaluations; cycle preservation and opaque endpoint behavior.
2. Exact focused selection, direct edge semantics, and source-owned non-edge results.
3. Composition syntax coverage and exhaustive handling of merged declarations,
   diagnostic qualification, and separation from discovery facets.
4. Organization endpoint narrowing versus fallback, every applicable combination,
   containment DAG evidence, no forced common result from incomplete/ambiguous
   placement, and aggregate occurrence agreement.
5. Snapshot/method identity, record references and qualifications, atomic store
   behavior, and missing boundary cases that should be added before presentation.

## Remaining work and limits

This is a library checkpoint, not the final integrated-review gate. Dependency CLI
commands, bounded Unicode/JSON graph views, source details and navigation, composition
annotations in organization views, presentation-declared expansion wiring, observation
integration, user documentation, and final PostCode/ts-node instrument validation
remain pending. The existing common module standard-expansion list still requests
exports/documentation; composition is explicitly requested by the new tests until
presentation integration declares the appropriate requirements.

No new whole-repository dependency exercise or performance measurement was run at
this checkpoint. Earlier provider validation remains historical evidence at its
recorded target. The final integrated handoff must cover the complete user journey,
all planned verification, and remaining limitations.

## Findings return

If you have repository write access, use
[the findings template](../../../dev/templates/review-findings.md), create
`records/reviews/module-dependencies/2026-09-17-graph-expansions-round-1-findings.md`,
identify this handoff and the exact target/scope actually reviewed, preserve your
report under `## Returned findings`, and commit only that record. Modify nothing
else. Otherwise return the findings to the human for durable recording. Later rounds
use the same assignment with incremented round numbers and their exact new targets.

## Review gate

Implementation pauses after this committed handoff for the human to arrange review.
Findings require individual disposition; clear authorized corrections can be made,
but rejection, material qualification, consequential alternatives, scope changes, or
reviewer-identified unresolved uncertainty require human direction. Material
corrections may require another round. Resume presentation integration only when
the human accepts this intermediate gate. The active task remains open and requires
final integrated review and explicit human acceptance before closure.

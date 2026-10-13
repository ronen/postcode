Record type: handoff

# Qualified result and Presentation compatibility

Prepared: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Review gate: Intermediate compatibility checkpoint before mechanical extension integration
Review target: `1b853bd61961b4da94b630c9c4e8de91c3be49e6`
Baseline or diff range: `d8ceb60b9671c136044a32db3a33f9f0a7cc9445..1b853bd61961b4da94b630c9c4e8de91c3be49e6`
Branch: `codex/lens-request-model`

## Assignment and boundaries

Review this compatibility slice independently before the remaining mechanical extension builds on it. The human accepted the preceding operation-definition gate; its disposition and findings remain historical evidence, not proof of this implementation. Inspect the code and relevant evidence rather than accepting this handoff or the implementer's tests as correctness claims.

Do not modify implementation, governing material, task status or the active task record. Recommend whether this intermediate boundary supports further implementation. Identify actionable defects, consequential choices or unresolved uncertainty, and verification limits. This is not the final integrated review or completion of M4.

## Governing context

- [Approved plan](../../../docs/plans/lens-request-model.md), especially result/Presentation contracts, outcome/retention cases, M4 and verification obligations.
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [Lens application and request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md), and [qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md).
- [Coordinated Views](../../../docs/decisions/coordinated-views-and-qualified-results.md), [precise designation and binding](../../../docs/decisions/precise-subject-designations-and-lookup-bindings.md), and [unordered collections](../../../docs/decisions/unordered-collection-inspection.md).
- [Engineering guidelines](../../../dev/engineering-guidelines.md), [implementation conventions](../../../docs/implementation-conventions.md), and [review workflow](../../../dev/review.md).

## Result under review

The captured Session catalog now contains runtime Presentation definitions for module, organization, dependency and interpretation content. Each bounded definition identifies its semantic contract, default role, supported format/source/paging choices, standard expansions, operational materialization precondition and optional same-contract fallback. Catalog validation rejects unsupported options/requirements, duplicate identities/defaults and invalid fallback chains. The production definitions accept qualified partial, unavailable and established-empty answers; internal fixture assembly can require complete materialization and declare a qualified fallback. This is fixed assembly, not public registration or hot replacement.

Coordination checks prospective compatibility before lookup/requested Evaluation. After shared subject resolution it selects the actual inspection contract or declared result contract. Missing compatibility returns a resolution result with the actual request and any prerequisite candidate/support information. Compatible default and fallback expansions are planned together before Evaluation. Existing prerequisite acquisition and successful reference-binding schedules are retained.

Construction resolves retained content before arrangement. Boundary checks validate semantic family and selected-content invariants in addition to the existing store/resolver validation. Operational materialization checks preserve partial/unavailable/outside-population distinctions; interpretation acceptance is not a claim that its account is complete or true. An unmet precondition without a compatible fallback returns a resolution result with retained-answer IDs and the unmet outcome states. It fabricates no View. Malformed internal content throws rather than entering this ordinary refusal path. No broad exception-to-refusal conversion was introduced.

When a fallback applies, explicit format, source and paging choices remain constraints. Views retain the initial/selected Presentation, selected compatibility criteria and consequential change explanation; Unicode also explains the fallback. Presentation decisions affect View identity, with mechanical Presentation advanced to `@31` and investigation Presentation to `@18`. Retained answer identity is unchanged. Parent usage finalization preserves these inputs and its existing explicit arrangement key.

The Session passes already-resolved content into the current family binding/arrangement wrappers. Arrangement has no store, lookup or Evaluation access. Embedded module detail and associated interpretation inspection remain the existing explicit compositions, with content validation at their boundaries; no general multi-Projection selection facility is added. Usage remains outside program Presentation compatibility. User-facing and descriptive documentation now distinguishes this implemented slice from the remaining mechanical extension work.

## Verification performed by the implementer

- `npm run check` and build passed.
- Final focused compatibility/content/extension run: 37/37 tests passed.
- Final full suite: 566/566 tests passed in approximately 142 seconds, using `caffeinate -is npm test` to prevent confirmed sleep interference for that process only. Existing offline loopback checks ran with permission; no paid inference was used.
- `git diff --check` passed. Visible repository inputs and Git state stayed unchanged during every test run. Temporary power assertions ended with their test processes.

The eight new compatibility tests cover refusal before lookup/Evaluation, resolved-contract refusal preserving prerequisite qualification, materialization failure retaining an answer, declared fallback preserving format/source choices and usage finalization, advance acquisition of fallback expansions, incompatible fallback options, partial/empty content versus malformed content, and invalid catalog declarations. Existing tests cover normal worker/CLI publication, comparison, embedded/associated content, correction history, source disclosure, paging, cancellation and usage. New fixture catalogs enter direct Session execution; there is no new worker assembly seam.

Initial authoring checks found a test using the wrong attribution field (`role` rather than `current.role`) and an existing identity assertion expecting the old mechanical Presentation method. The first focused run passed 35/36 after type correction; the remaining failure was that stale version expectation. It was updated for the deliberate method bump. An initial full run then passed 565 tests before the final refusal-explanation improvement and eighth test.

Two later full runs were contaminated by system sleep: one passed 563, failed two and cancelled one, with approximately 30-minute durations matching a logged 1,803-second idle sleep. All four affected checks passed on focused rerun. The next run, with idle-sleep inhibition, passed 556, failed six and cancelled four while logged maintenance sleep still occurred despite its live idle-sleep assertion. Failures included elapsed guards, invalidation and test timeouts. The final run protected against both idle and system sleep from its start and passed all 566, without changing code or expectations between these runs. This establishes a clean verification run; it does not independently root-cause every timing failure or explain the historical intermittent CLI failure recorded in earlier reviews.

## Review focus and reproduction

1. Verify definitions constrain actual behavior rather than merely describing it: pre-Evaluation choice, resolved inspection contract, supported options, expansion closure, and same-contract fallback. Check that absence of compatibility is distinct from Lens inapplicability.
2. Verify materialization refusal retains the actual answer and qualifications without a fabricated View, while qualified defaults preserve valid partial/unavailable/empty results. Challenge malformed values at the construction/arrangement boundary without assuming TypeScript alone enforces the contract.
3. Check retained answer versus View identity, immutable choice criteria, fallback disclosure, explicit choices, binding order and parent usage finalization. Check embedded and associated compositions and the distinction between their validation and top-level catalog choice.
4. Check existing Session/CLI/worker paths and the risks extension still use the same coordination and reporting boundaries. Identify missing behavioral coverage or false documentation claims.

Reproduce with `npm run check`, then `npm run build` and `node --test _build/test/presentation-compatibility.test.js _build/test/projection-content.test.js _build/test/lens-extensions.test.js`; use `npm test` for integration. Keep repository inputs/Git state stable and prevent machine sleep during input-sensitive and elapsed-guard tests.

## Known limits and next work

Mechanical Lens-name dispatch and its temporary catalog equality restriction remain. The nonpublic module-exports constructor, distinct qualified content contract, small Presentation and bounded assembly integration are still required by the approved plan. This slice does not claim extension completion, arbitrary renderer registration, a generic planner or comprehensive malformed-catalog fuzzing.

Custom precondition/fallback catalogs were exercised through direct Session tests; compatibility-specific fallback paging and custom-catalog worker delivery were not separately exercised. Existing production paging/publication tests passed. Final integrated coverage and review remain necessary after mechanical integration. General Presentation/options redesign, exact retained-answer redisplay, persistence, cross-Session handles and hosted-provider validation remain outside this checkpoint.

## Findings return and gate

If you have repository write access, use the [findings template](../../../dev/templates/review-findings.md), create `2026-10-13-presentation-compatibility-round-1-findings.md` in this directory, identify this handoff and exact reviewed target, preserve your report under `## Returned findings`, and commit only that findings record. Otherwise return the findings to the human. Later rounds retain this handoff and identify their new exact target and round.

Implementation pauses for human-arranged intermediate review under the workflow. Findings receive individual dispositions; rejection/material qualification, consequential alternatives, scope expansion and reviewer uncertainty return to the human. Human acceptance permits the remaining implementation to proceed and does not close the task or replace final integrated review.

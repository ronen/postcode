# Fixed operation definitions and interpretation extension

Record type: handoff
Prepared: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Review gate: Intermediate review of operation policy, reuse compatibility and interpretation extension
Review target: `300c5a7e4c1d310d8177d24c24590c5c5aad6368`
Baseline or diff range: `e324a791f01e0c2ae8c81425c71be7e767ef0b38..300c5a7e4c1d310d8177d24c24590c5c5aad6368`
Branch: `codex/lens-request-model`

## Review assignment and boundaries

Review this intermediate slice independently before further implementation builds on its catalog, reusable-operation and retained-selection boundaries. The human accepted the preceding attribution gate. This assignment concerns subsequent operation definitions and the ordinary interpretation extension, not final acceptance of the approved plan. Inspect the implementation and evidence; neither this handoff nor the implementer's passing tests establish correctness.

Do not modify implementation, governing material, task status or the active task record. Recommend whether this checkpoint can support the remaining work, identifying actionable defects, unresolved uncertainty and relevant verification limits.

## Governing context

- [Approved plan](../../../docs/plans/lens-request-model.md), particularly shared extension preparation, ordinary module risks, reuse and M4.
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [Lens application and request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md), and [qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md).
- [Investigation operations and Lenses](../../../docs/decisions/investigation-operations-and-lenses.md), [investigator execution and evidence access](../../../docs/decisions/investigator-execution-and-evidence-access.md), and [Session accumulation](../../../docs/decisions/transient-analysis-sessions.md).
- [Engineering guidelines](../../../dev/engineering-guidelines.md), [implementation conventions](../../../docs/implementation-conventions.md), and [independent review workflow](../../../dev/review.md).

## Result under review

The Session captures a fixed internal catalog before asynchronous opening. Lens definitions continue to govern normalization, subject applicability and operation requirements; they now supply interpretation titles. Production CLI command spellings remain fixed. Nonpublic interpretation definitions enter the same direct Session path through an internal assembly argument. There is no dynamic registration or running-Session replacement. Additional mechanical definitions are explicitly rejected at this checkpoint, pending their constructor/Presentation integration.

Separate operation definitions declare objective, supported subject kind, initial context policy and authored method. The common investigator machinery uses those declarations instead of operation-name branches. An effective method combines the common execution version, authored method and definition fingerprint. Evaluation compares both this method and the operation request for reuse. Accepted provenance/accounts/corrections retain the effective operation method. Changing an objective or context policy cannot reuse incompatible work merely because the author retained the same version label. Current Lens identity, designation and invocation attribution remain outside the operation reuse key.

Operation-result selections retain their actual operation request and subject kind, including unavailable outcomes. Construction checks the supplied Lens declaration; store validation checks self-contained selection/reference invariants and consistency with the selected Evaluation. Reference identity normalization and investigator reference transport include the newly retained operation subject. Reconstruction no longer consults a global Lens-to-operation map. Arrangement receives its title explicitly, includes that title in View identity, and selects associated-inspection behavior from the retained variant. The common support/correction/acceptance and usage machinery remains in use.

The test-only `risks` Lens and `risk-review` consumer share one operation and the existing interpretation Presentation. Their tests cover normal requests, name/raw-or-compact reference paths, missing/ambiguous/unsupported subjects, invalid parameters, unavailable outcomes, retained failure versus retryable communication failure, original provenance/current attribution, captured definitions, and changed operation policies. No fixture Lens is exposed as a public CLI command; no paid inference was used.

## Verification already performed

- `npm run check` and `npm run build` passed.
- The final extension-only run passed all 7 tests. The existing selection tests passed all 11 after the retained request/subject-kind changes.
- Final `npm test` passed all 542 tests in approximately 175 seconds, including current worker/CLI publication, correction history, cancellation, usage and source-disclosure tests. Offline authentication checks used local loopback permission.
- `git diff --check` passed. Repository inputs and Git state remained unchanged during test execution. Afterwards only an extra blank line and a descriptive-document link to the replacement governing decision were corrected before commit.

During test authoring, one new assertion used `unsupported` instead of the established `unsupported-subject` code. Another fixture placed an ambient declaration in a module file, where it did not establish the intended ambiguous population; the declaration was moved to a separate script file, matching the existing ambiguity fixture. Production resolution behavior and existing expectations were not changed to address either failure. The final full run includes both corrections.

## Review focus and reproduction

1. Check captured catalog lifetime and that ordinary interpretation additions require no Lens-name changes to common execution, acceptance, retention or rendering. Inspect remaining default-definition lookups at low-level construction wrappers and verify that supplied fixture definitions win consistently.
2. Check reuse versus method provenance for changed objectives, methods and initial context. Compatible consumption must preserve the original Evaluation, interpretation and attribution without new inference. Existing unavailable/retry and retained-failure policy must remain intact.
3. Check the migrated selection contract, actual subject validation, unavailable request reconstruction, normalized identity/reference positions, frozen correction snapshots and unchanged allocation behavior. Ensure self-contained store validation has not lost meaningful invariants when removing its global Lens map.
4. Check title handling and identity, ordinary production output and worker/parent usage finalization. Verify that unsupported fixture requests remain resolution results rather than fabricated answers.

Useful reproduction: `npm run check`, then `npm run build` and `node --test _build/test/lens-extensions.test.js _build/test/investigation-selection.test.js`; use `npm test` for integration. The changed-policy test deliberately assembles separate internal evaluators over one retained store to challenge reuse; it does not expose hot replacement in a Session.

## Known limits and remaining work

This is not M4 or full-plan completion. Runtime result/Presentation compatibility, selection before Evaluation, materialized preconditions, presentation-failure resolution with retained-answer references, declared fallback, removal of remaining mechanical Lens dispatch, and the qualified exports constructor/Presentation extension remain required. The catalog will need the corresponding bounded mechanical/Presentation assembly support. The current fixture demonstrates interpretation extension without claiming that result-contract declarations already establish runtime compatibility.

Final integrated capability verification and human acceptance remain required. Existing deferred general options, exact retained-answer redisplay, persistence and cross-Session validity limitations remain unchanged. The historical intermittent CLI test failure remains unexplained; this passing run does not establish its cause. No hosted-provider execution or exhaustive malformed-catalog fuzzing was performed.

## Findings return

If you have repository write access, use the [findings template](../../../dev/templates/review-findings.md), create `2026-10-13-operation-definitions-round-1-findings.md` in this directory, preserve your report under `## Returned findings`, identify this handoff and exact reviewed target, and commit only that findings record. Modify nothing else. Otherwise return findings to the human. Further rounds use this handoff with a new round number and the exact corrected target actually reviewed.

## Review gate

Implementation pauses for human-arranged review of this checkpoint. Findings receive individual dispositions; consequential alternatives, rejection/material qualification, scope changes and reviewer uncertainty return to the human. Human acceptance of this intermediate gate permits the remaining implementation to proceed. It does not close the task or replace final integrated review.

# Implement explicit Lenses and qualified request resolution

Status: active
Opened: 2026-10-11
Closed:

## Task

Please implement the approved plan at `docs/plans/lens-request-model.md`. This is explicit authorization to begin the substantive implementation task described by that plan.

## Follow-ups

## Outcome

Intermediate checkpoint, 2026-10-11: implementation commit `a9c8189f042d5fe6cabf27db414b995a5972d0f6` establishes normalized request reporting, shared Lens-to-operation declarations, explicit View/usage/parameter-resolution execution alternatives, parent usage finalization and observation-envelope version 2. Usage no longer has a synthetic Projection/View descriptor. Module matching is shared without the dependency-selection inspection side effect. The local observation convention now specifies version-two batches; user-facing and descriptive documentation records the implemented subset and remaining gaps.

The task remains active and no milestone is declared complete. Qualified subject resolution and retention changes, answer identity, prerequisite/evidence attribution, runtime Presentation compatibility, operation/extension seams and demonstrations, and full-plan verification remain required. The [intermediate review handoff](../reviews/lens-request-model/2026-10-11-request-publication-handoff.md) enumerates that work. Implementation pauses for human-arranged review under the development workflow before expanding this shared boundary into the remaining family migrations. Final integrated review and human gate acceptance will still be required before closure.

## Verification


At the intermediate checkpoint, `npm run check` passed and `npm test` passed all 495 tests. Existing offline sign-in tests required local loopback permission: a sandbox bind probe returned `EPERM`, and the final full run passed with that permission. No paid inference was used. Focused coverage and the initial failures/corrections are recorded in the review handoff. `git diff --check` passed. These results verify the checkpoint, not completion of the approved plan.

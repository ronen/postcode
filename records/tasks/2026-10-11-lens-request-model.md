# Implement explicit Lenses and qualified request resolution

Status: active
Opened: 2026-10-11
Closed:

## Task

Please implement the approved plan at `docs/plans/lens-request-model.md`. This is explicit authorization to begin the substantive implementation task described by that plan.

## Follow-ups

### 2026-10-11 — Review disposition and corrections

The review is complete.  Please assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-10-11 — F3 and F4 behavior

Context: The agent asked, “For F3, I recommend refusing usage requests that supply a selector, subject, or nonempty parameters, and retaining those rejected inputs in the resolution report. Should I use that behavior? Usage is defined as subjectless in the approved plan.” The human selected:

Refuse and preserve rejected inputs (recommended)

The subsequent human direction was:

For F4, also go with your recommendation.  Two details matter:

- Preserve the supplied Lens name as rejected input, without pretending it identifies a valid Lens.
- Non-cloneable values cannot necessarily be preserved verbatim in a report. Record the affected field and an intelligible reason, explicitly indicating any representation limit. Reporting must not fail while trying to serialize the rejected input.

Keep this handling narrow: an unexpected failure *after successful validation* remains an internal defect.

## Outcome

Intermediate checkpoint, 2026-10-11: implementation commit `a9c8189f042d5fe6cabf27db414b995a5972d0f6` establishes normalized request reporting, shared Lens-to-operation declarations, explicit View/usage/parameter-resolution execution alternatives, parent usage finalization and observation-envelope version 2. Usage no longer has a synthetic Projection/View descriptor. Module matching is shared without the dependency-selection inspection side effect. The local observation convention now specifies version-two batches; user-facing and descriptive documentation records the implemented subset and remaining gaps.

The task remains active and no milestone is declared complete. Qualified subject resolution and retention changes, answer identity, prerequisite/evidence attribution, runtime Presentation compatibility, operation/extension seams and demonstrations, and full-plan verification remain required. The [intermediate review handoff](../reviews/lens-request-model/2026-10-11-request-publication-handoff.md) enumerates that work. Implementation pauses for human-arranged review under the development workflow before expanding this shared boundary into the remaining family migrations. Final integrated review and human gate acceptance will still be required before closure.

Review corrections, 2026-10-11: all five actionable round-one findings were accepted and corrected in `4c9c3e0` and `709ea65d9ffe7f21e60306fa2d02ba9c0b74dd5f`. The [disposition](../reviews/lens-request-model/2026-10-11-request-publication-disposition.md) records each judgment, the human-directed F3/F4 behavior, and the exact corrected target. Dependency Lens vocabulary and designation validation now agree with the plan; usage refuses and preserves extra inputs; malformed input receives a safe caller refusal with explicit representation limits; unexpected post-validation failures remain defects; the usage schema's optional context is documented. The reviewer's intermittent CLI failure remains unexplained. Wider implementation remains paused pending human direction on that uncertainty and acceptance of the intermediate gate. The task remains active and the outstanding plan work above remains required.

## Verification

### Review-correction verification

Final `npm run check` passed. Final `npm test` passed all 503 tests, including the reviewer's previously failing CLI test and new refusal/serialization regressions. Focused runs passed 26 and 35 tests; `git diff --check` passed. An earlier full run was contaminated by creating a repository file during input-sensitive tests; stable reruns passed. The disposition preserves that distinction and does not treat passing reruns as an explanation of the reviewer's intermittent failure. Existing offline loopback tests ran with permission; no paid inference was used.

### Intermediate-checkpoint verification

At the intermediate checkpoint, `npm run check` passed and `npm test` passed all 495 tests. Existing offline sign-in tests required local loopback permission: a sandbox bind probe returned `EPERM`, and the final full run passed with that permission. No paid inference was used. Focused coverage and the initial failures/corrections are recorded in the review handoff. `git diff --check` passed. These results verify the checkpoint, not completion of the approved plan.

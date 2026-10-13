# Integrated Lens request model: findings

Record type: findings
Received: 2026-10-13
Reviewer: Claude Code (Claude Opus 5.5), independent agent session
Handoff: [Integrated Lens request model](2026-10-13-integrated-request-model-handoff.md)
Round: 1
Reviewed target: `f7a082eaa92b929a03402164280a6b47dc586f02` (scope `749640653b7df68deaaf48f1c7c0bc7e12133dd6..f7a082eaa92b929a03402164280a6b47dc586f02`)

## Returned findings

### Scope and method

I reviewed the exact target in a detached worktree. Later commits change only the handoff and task record. I read the handoff, the approved plan, the task record with the human's refinements, and the review workflow. I gave the most attention to the final slice (`f3a0c2e..f7a082e`): the mechanical registry, catalog capture and transfer to the worker, the exports record, content, Presentation, store validation and disclosure, and the shared export/documentation formatting extraction. I also traced how `session.ts` coordinates the whole request path: rejection, parameter/designation validation, compatibility before Evaluation, resolution, contract refinement, expansion planning, construction, settlement, and View/resolution delivery.

For the earlier milestones I checked whether tests exist for each plan verification obligation. I spot-checked their assertions instead of re-deriving every earlier gate. Earlier review rounds covered those gates in depth. Their accepted dispositions were context for this review, not proof.

I wrote and ran direct probes against the compiled target, outside the repository. They exercised exports over star re-exports, catalog replacement policy, and malformed direct-request fields, both through `openSession` and through the worker path in `interactiveSession`.

### Verification performed

- `npm run check` passed at the target.
- `caffeinate -is npm test` at the target: **575/575 passed, 0 failed/cancelled/skipped**, about 185 s. Offline only. No paid inference.
- `git diff --check` over the review range passed. The worktree stayed clean during and after the run.
- Probes (results below) confirmed F1 and F2 through both direct and worker Sessions.

### Actionable findings

#### F1 (medium): an unrecognized `subject` is reported as a repository request, but the answer is for the configured project

`normalizeCapturedRequest` maps any truthy `subject` other than `'project'` to `{ kind: 'repository' }` (`src/lib/requests.ts`, the designation expression near line 171). `invalidDesignation` never checks that `subject` is one of the two supported values. The registered organization constructor then ignores the normalized designation and reads the raw input again: `request.subject === 'repository' ? 'repository' : 'configured-project'` (`src/lib/mechanical-implementations.ts`, the `organization` registration).

Probe, same Session, `lens: 'organization', selector: null`:

| Supplied `subject` | Reported designation | Answer (Projection ID) |
| --- | --- | --- |
| `'bogus'` | `repository` | same as `project`/default (`…90eb25…`) |
| `'repository'` | `repository` | `…7998bc…` |
| `'project'` | `configured-project` | `…90eb25…` |
| omitted | `default` | `…90eb25…` |

The worker path (`interactiveSession`) behaves the same way. The request context, and therefore the observation `request` record, says a repository question was asked. The returned View answers the configured-project question. This contradicts the integrated claim that publication reports the actual request. It also contradicts the plan's direct-boundary rule that invalid designations get a resolution result before execution. The constructor also bypasses the normalized request, so a Lens-semantic choice depends on raw caller spelling.

The public CLI cannot produce this, because `commands.ts` only emits `project`/`repository`. It affects direct Session and worker callers, which the plan treats as first-class entry points.

Suggested correction: reject any `subject` other than `project`/`repository` as an invalid designation, preserving the supplied value. Have the organization registration take its scope from the normalized designation, not from `request.subject`. Add a direct and a worker regression test.

#### F2 (low): other malformed designation and choice fields are accepted or misdescribed instead of refused

These are all on the same direct-boundary path. No probe produced a wrong answer, but the refusals and recorded requests are inaccurate:

- **Omitted `selector`.** `undefined` is dropped during capture and then fails `!== null`, so it becomes `{ kind: 'name', value: undefined }`. `modules`/`dependency-structure` then refuse with "requires a project or repository subject, not a selector", although no selector was supplied. `inspect` reports `missing` with name-lookup criteria.
- **Non-string `selector`** (`42`, `{a:1}`, `['widget']`). These are recorded as name designations and refused as `missing` ("No applicable subject matches…"), not as invalid input. The value is preserved, which is good, but the reason and criteria describe a lookup that could never succeed.
- **Truthy non-boolean `reference`** (`'yes'`). This is treated as a precise reference.
- **`referenceLifetime: 'forever'`**. This is accepted and recorded verbatim in the normalized request, but it renders like `'session'`: there is no command-expiry statement and no refusal. So the recorded request claims a lifetime that PostCode does not implement.

The plan, and the human's F3/F4 direction, call for known input defects to get an intelligible refusal before execution, with post-validation failures kept as defects. Typed TypeScript callers cannot produce these values. However, the boundary already deliberately handles untyped and malformed input (accessors, non-cloneable values, unknown Lens names), so these field-type checks look like an omission rather than a deliberate limit.

Suggested correction: validate the primitive types and enumerations of `selector`, `reference`, `subject` and `referenceLifetime` at capture or designation validation. Return `invalid-designation` (or the existing rejected-input form) with the supplied values preserved. Distinguish an omitted selector from a supplied one.

### Non-defect observations

- **Registry and catalog seam.** `mechanicalImplementation` keys execution by an explicit `implementation` value and requires canonical equality with the registered definition. As a result, a fixture cannot attach changed semantics to an existing constructor, and new IDs cannot borrow one. I confirmed the default catalog excludes `exports` and that unknown-Lens rejection preserves the spelling. Capture happens in the parent before the Worker is constructed. The worker validates the transferred data again. No catalog state is needed for rendering or usage finalization in the parent.
- **Exports family.** The record selects only outcomes on its own construction basis. This makes it stable under later accumulation, which I checked against `recordModuleEvaluation`'s per-call basis. `complete` requires an in-population subject plus complete basis and exports outcomes, so unrequested, partial, unavailable and outside-population cases cannot claim completeness. The Unicode bounds (50 exports, 3 documentation entries) and source collection apply only to displayed items. `sourceDisclosure` classifies the new schema. The store validates that selected export and documentation claims came from supplied outcomes. It does not verify that the selection is *complete* relative to those outcomes, or check `contexts` against claims. The constructor is the only producer, so this is a defensive-validation limit, not a defect. My star re-export probe rendered `item [value] · wildcard; from widget` with complete qualification.
- **Shared formatting extraction.** `presentDocumentation`, `documentationLines`, `exportRoles` and `exportRoutes` are behavior-preserving moves. `documentationDisplayed` is now set from `items.length > 0`, which is equivalent to the old per-association loop. The module Presentation method was not advanced, which is consistent with unchanged output.
- **Remaining family-local Lens-ID branches.** Module, organization, dependency and interpretation arrangements still branch on the retained answer's own `lens` value (`projection.lens === 'inspect'`/`'modules'`/`'dependency-*'`, and the interpretation support line at `investigation/presentation.ts:253`). These are local to each family and keyed by the retained question, not by common coordination. The exact-definition registry prevents a new Lens from reaching them under a borrowed identity. The plan's shared-preparation section named "module arrangement branches on `inspect`" as coupling to remove, but neither walkthrough is obstructed by it. I record this as residual coupling for the human's judgment, not as a defect.
- **Catalog policy.** An interpretation definition can still replace a built-in *interpretation* Lens (e.g. `summarize` with a changed question/title) through the internal seam. This matches the earlier accepted disposition, which rejected only mechanical-related alterations, and production uses the default catalog. I mention it only so the policy stays explicit.
- **Coverage map.** The obligations from the plan's verification section all have named tests in `request-model`, `subject-resolution`, `answer-identity`, `work-attribution`, `presentation-compatibility`, `lens-extensions` and `exports-lens`. In the exports tests I spot-checked: name/raw/compact answer equality with distinct View IDs, no inspection/organization/selection records written, refusal before construction, the controlled partial/unavailable/outside cases, detached arrangement after source-file removal, and worker publication with sink rejection.

### Unverified areas and residual limits

- I did not independently re-derive the earlier gates' detailed evidence: attribution sizing at repository scale, the cancellation/late-work races, frozen revision snapshots, and allocation collision schedules. I relied on their passing tests and spot reads.
- I did not repeat the repository-scale timing probe. The handoff's single-Session measurements are unverified by me.
- No hosted inference, heap/GC study, worker-restart test or malformed-catalog fuzzing. Malformed-*request* probing was limited to the fields listed in F1/F2.
- The exports partial/unavailable cases remain controlled core inputs, as the handoff discloses. I did not find an end-to-end provider route that produces them.
- The historical intermittent CLI JSON failure was not reproduced. This passing run does not explain it.

### Recommendation

The integrated implementation substantially meets the approved plan. The registry and exports extension in particular are cleanly local and add no Lens-name branch to coordination, resolution, attribution or publication. My independent run of the full suite passed.

The final gate is **not yet sufficient** because of F1: a direct or worker request can be published as one question while answering another. That violates the actual-request reporting contract the task exists to establish. F1 is a small, clearly in-scope correction. F2 can be corrected with it. Once both have a disposition, a narrow re-check of the corrected boundary (direct and worker paths plus the regression tests) should suffice. A full new round is not needed unless the correction reaches further than designation validation and the organization registration.

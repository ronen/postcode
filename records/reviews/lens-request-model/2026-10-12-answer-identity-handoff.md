Record type: handoff
Prepared: 2026-10-12
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Review gate: Intermediate answer-identity and resolved-construction checkpoint
Review target: 5d1b33631313cfbbb1f304b0a4aba94153b29d00
Baseline or diff range: a081c929588770089320c0bde2b6ffd4cf4a78b2..5d1b33631313cfbbb1f304b0a4aba94153b29d00
Branch: codex/lens-request-model

# Answer identity checkpoint

## Review assignment and boundaries

Review the four-family answer-identity migration following the accepted [subject-resolution gate](2026-10-12-subject-resolution-disposition.md). This changes retained payloads, constructor inputs, identity methods and displayed resolution context across all current families. An intermediate review under the [development workflow](../../../dev/workflow.md#intermediate-review) should reduce the risk of building attribution, compatibility and extension work on an incorrect answer boundary.

Inspect implementation and relevant evidence directly; this handoff and the implementing agent's verification are not independent proof. Recommend whether this checkpoint is suitable for continuing the approved implementation, identifying necessary corrections and any consequential uncertainty. No milestone or full-plan completion is asserted.

The reviewer may commit only its findings record. Do not modify implementation, governing documents, task status or the active task record. The human chooses the reviewer and determines gate sufficiency. This is a new assignment because its identity/construction scope differs materially from the earlier resolution review.

## Governing context

- [Approved plan](../../../docs/plans/lens-request-model.md), especially effective answer inputs, outcome/retention rules, identity separation and M3 verification.
- [Qualified construction under the request model](../../../docs/decisions/qualified-construction-under-the-request-model.md) and [Lens application and request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md).
- [Precise subject designation and lookup binding](../../../docs/decisions/precise-subject-designations-and-lookup-bindings.md), including the human's successful-allocation and raw-ID requirements.
- [Experimental structured outputs](../../../docs/decisions/experimental-structured-outputs.md), [operation separation](../../../docs/decisions/investigation-operations-and-lenses.md) and [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md).
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [engineering guidelines](../../../dev/engineering-guidelines.md) and [implementation conventions](../../../docs/implementation-conventions.md).

Foundation, development-process, governing architecture and accepted historical decisions are unchanged. No dependencies, public commands or persistence guarantees are added.

## Result under review

Module, organization and dependency constructors accept resolved subject IDs or their defined population subject. They no longer perform lookup or retain designation/reference-status parameters. Their keys include the complete qualified payload, normalizing only explicitly declared reference positions. Organization inspection supplies the same genuine embedded module detail for equal selected subjects, including empty detail for group-only inspection. Known subjects outside supplied populations keep their qualified support.

Investigation constructors require one applicable resolved subject and a valid operation outcome, or exact historical inspection. They no longer retain missing, ambiguous or unsupported request selections. Legitimate associated selections may remain empty. The full frozen revision/association selection, valid failed/unavailable outcomes and original provenance remain retained; spelling, usage and current consumption reporting do not enter answer identity. Store validation rejects removed invocation-specific fields.

Coordination supplies a frozen resolution context separately to arrangement. It includes the supplied designation, settled subjects, criteria, qualification and lookup-population states. These appear in View JSON, with relevant lookup wording/qualification in Unicode, and participate in affected View/arrangement keys. Projection descriptors expose semantic parameters only, currently empty. Parent usage finalization continues to use the explicit usage-independent key. No arrangement receives lookup, store or Evaluation access.

Responsible methods advance to projection `@12`, dependency projection `@6`, investigation projection `@3`, shared mechanical presentation `@29` and investigation presentation `@14`. Provider capture of the method registry can consequently change supporting input-record IDs. Other qualification and captured values remain meaningful.

Tests use a local fixture adapter to resolve historical string-based fixture selections through the production resolver before calling the resolved-only constructors. Actual request/designation semantics remain tested directly through Session and CLI. Obsolete tests expecting retained missing answers now expect refusal; valid empty embedded/associated and population cases remain covered. The adapter is test-only and does not restore a legacy production lookup API.

### Work still required

The active task is not complete. Remaining approved work includes:

- The five-boundary root/prerequisite/evidence attribution trace: known actor, purpose, parent/trigger, inherited constraints, actual establishment versus consumption, original generation versus current reuse, direct `evaluateInvestigation`, interrupted/failed work and acquired-but-undelivered evidence. Resolution snapshots do not constitute this trace.
- Runtime result/Presentation compatibility through every View path, including pre-evaluation incompatibility, post-construction materialized-precondition failure with retained answer references, and permitted fallbacks preserving explicit choices.
- Fixed per-Session catalog construction, operation definitions replacing hard-coded objective/context dispatch, and both non-public extension demonstrations: risks with another consuming Lens proving shared operation reuse, and exports with its own qualified construction/Presentation.
- Integration through those seams and the full remaining capability, worker/publication, cancellation and qualification verification; final integrated review and human acceptance.

General options/redisplay design, captured-basis export, navigation-origin history, public plugins, persistence and cross-Session identities remain outside scope. The historical intermittent CLI failure's cause remains unconfirmed; this checkpoint does not claim to repair it.

## Verification already performed

- `npm run check` passed. The complete offline suite passed all 515 tests (about 161 seconds), including worker/parent publication, reference allocation, source disclosure, cancellation/usage and the previously intermittent CLI test.
- After that full run, test-only clarifications switched the controlled resolved-subject example directly to the production constructor, added isolated lookup-qualification identity and rejected-selector assertions, and removed misleading historical test labels. The final type check/build and both affected test files passed all 13 tests. Product code and documentation were unchanged after the full run.
- New Session coverage proves equal module inspection, group inspection and dependency children/parents answers by name/reference, distinct exposed View context and repeatable identical requests. The investigation integration test proves equal summary answer descriptors with no added inference. Existing raw/compact, mixed-subject, frozen-history, cross-Session normalization and support/qualification tests remain active.
- The controlled partial lookup has two real modules sharing a handle. Its returned subjects construct a repeatable answer, while incomplete lookup qualification remains separately frozen and affects View identity. A different qualified answer basis changes the answer ID. Store guards reject lookup-bearing parameters/selection payloads.
- The first full run passed 511/515. Four legacy tests still expected retained missing answers or foreign-subject empty answers; they were migrated to refusal checks and legitimate embedded/population empty cases. The 46 affected tests then passed before the successful full run. An earlier focused 26/29 run exposed three equivalent legacy selection expectations, also corrected.
- `git diff --check` passed. No dependencies, generated artifacts, foundation/process changes or unrelated work are included. No paid inference was used; existing offline authentication tests ran with local loopback permission. Visible repository inputs remained stable during each test run.

These checks establish implementing-agent evidence for this checkpoint, not independent review or completion of the plan. The historical intermittent failure remains unexplained.

## Review focus and reproduction

1. Check each family's full immutable payload/key for designation leakage, missing qualified support, cross-Session normalization and conflicting resubmission. Equal name/handle/raw/compact selections with identical effective inputs must share answers; different qualified support must remain distinct.
2. Inspect exposed resolution context and every affected View/arrangement identity. Check literal reference-shaped names remain literal, qualification survives partial lookup and parent finalization does not erase context or recursively hash finalized IDs.
3. Inspect resolved-only constructors and store invariants. Unsettled requests must not manufacture requested answers. Preserve valid empty populations, empty embedded module detail, associated zero-match selections, failed/unavailable interpretation, outside-population support, exact originals and complete frozen correction snapshots.
4. Check successful allocation schedules, full ambiguous candidate sets, existing bindings, source disclosure, mixed selections, direction/opaque dependency support and bounded display without reduced answer content.
5. Check test migration against independent intended behavior, especially the fixture adapter and removed missing-Projection assertions. Confirm the actual Session name/reference test proves equal answer descriptors and unchanged inference/usage, while different View context remains distinguishable.
6. Inspect the disclosed remaining attribution/contracts/extensions work. Report defects in the implemented subset or staging choices that prevent the approved outcome; do not treat the checkpoint as full conformance.

Useful checks: `npm run check`; `npm test`; after building, `node --test _build/test/answer-identity.test.js _build/test/foundation-identity.test.js _build/test/investigation-selection.test.js _build/test/investigation-integration.test.js _build/test/projection-content.test.js`. Hold visible repository inputs stable during input-sensitive tests. Existing offline authentication tests need local loopback permission; no paid inference is needed.

## Findings return

Use `2026-10-12-answer-identity-round-1-findings.md` in this directory, advancing the round suffix for later rounds. Follow the [findings template](../../../dev/templates/review-findings.md), identify this handoff, exact reviewed target/scope, reviewer, method, verification, actionable findings, non-defect observations, residual limits and gate recommendation. Preserve the authored report under `## Returned findings`.

With repository write access, create and commit only that findings file and modify nothing else. Without write access, return findings to the human for recording. Do not arrange another reviewer or modify implementation without explicit human authorization.

## Review gate

Implementation pauses at this checkpoint for human-arranged independent review. The human determines whether the findings, corrections and residual limits suffice before remaining implementation proceeds. A reviewer recommendation does not accept the gate or close the task. Final integrated review and human acceptance remain required before closure.

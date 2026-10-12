Record type: handoff
Prepared: 2026-10-12
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Review gate: Intermediate qualified subject-resolution checkpoint
Review target: 6acd1e94c89e026b2fa32dc86fce24b9897d0d37
Baseline or diff range: d5041af..6acd1e94c89e026b2fa32dc86fce24b9897d0d37
Branch: codex/lens-request-model

# Qualified subject resolution checkpoint

## Review assignment and boundaries

Review the shared subject-resolution and materialization boundary added after the human accepted the earlier request/publication gate. This is an intermediate review under the [workflow default](../../../dev/workflow.md#intermediate-review), before the remaining answer-identity and attribution migrations build on this selection boundary. It changes every current Lens request's unsuccessful lookup path and the mechanical families' handling of known subjects absent from an evaluation. Independent review at this point should reduce the risk of spreading an incorrect selection or qualification rule into those migrations.

Inspect the implementation and relevant evidence directly. This handoff and the implementing agent's checks are not proof of correctness. No milestone or full-plan completion is asserted. Recommend whether this boundary is suitable for continuing the authorized implementation, identifying corrections or material design concerns first.

The reviewer may commit only its findings record. Do not modify implementation, governing material, task status or the active task record. The human selects the reviewer and decides whether this gate is sufficient. This assignment is separate from the [earlier handoff](2026-10-11-request-publication-handoff.md); its [disposition](2026-10-11-request-publication-disposition.md) records acceptance of that gate and the remaining uncertainty about the historical intermittent CLI failure.

## Governing context

- [Approved plan](../../../docs/plans/lens-request-model.md), especially qualified resolution, outcome/retention cases, allocation preservation and M2 verification.
- [Lens application and request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md).
- [Qualified construction under the request model](../../../docs/decisions/qualified-construction-under-the-request-model.md).
- [Experimental structured outputs](../../../docs/decisions/experimental-structured-outputs.md).
- [Operation separation](../../../docs/decisions/investigation-operations-and-lenses.md), [investigator execution](../../../docs/decisions/investigator-execution-and-evidence-access.md), and [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md).
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [engineering guidelines](../../../dev/engineering-guidelines.md), and [implementation conventions](../../../docs/implementation-conventions.md).

The baseline is the accepted intermediate gate with its record-only acceptance commit. Foundation, development-process and governing architecture documents are unchanged. No dependencies or public commands were added.

## Result under review

Session coordination uses one resolver over Lens applicability/cardinality and qualified module/group populations. It reads established compact bindings or same-Session retained subject keys before deciding applicability. Classification does not allocate references, enumerate populations or infer existence from a prefix. Valid applications preserve population-wide allocation after classification. Exact module-name/handle matching is shared with family selection.

Missing names, unknown precise references, incompatible bound targets and single-subject ambiguity produce resolution reports instead of requested-application Projections. Incomplete and unavailable lookup populations remain distinct from established absence. The reports retain frozen candidates, criteria, prerequisite outcome summaries and qualification without depending on an observation sink. Successful execution and observation batches carry resolution information separately. Existing publication handles reports as refusals, with no View/source-escape event; valid but unavailable interpretation remains a retained answer/View.

Resolved subjects are passed into the mechanical constructors. A known module or group omitted from a narrower supplied evaluation remains selected with its retained naming support and an explicit outside-population qualification. Store validation checks that qualification against the retained supporting populations. Group detail/properties remain unavailable rather than becoming fabricated empty or false values. Rendering and source detail use supplied core content; arrangement still has no store access. Qualified empty module detail embedded in group-name inspection remains preserved.

The changed construction keys include selected subjects and the organization embedded module basis, preventing collisions between different resolved inputs. Module/organization construction uses projection method `@10`, dependency construction uses `@4`, and shared mechanical presentation uses `@28`. These are intermediate semantic bumps, not completion of designation-free answer identity. Comparison adds only the new explicit reference positions (`population`, `prerequisites`, `outsidePopulation`); qualifications and output are not discarded.

### Work still required

The task remains active; this checkpoint does not complete M1–M4. In particular:

- Implement the five-boundary root/prerequisite/evidence attribution trace, including purpose and inherited execution constraints, actual establishment versus reuse, original generation versus current consumption, direct `evaluateInvestigation`, failed/interrupted requests and acquired-but-undelivered evidence. Prerequisite outcome snapshots in this checkpoint are not that completed attribution trace.
- Finish the low-level family migration alongside answer identity. Directly callable legacy constructors still accept lookup arguments and can retain their earlier unsuccessful selection forms; the Session/worker/CLI request path refuses those applications before construction. Remove those obsolete forms and invocation-specific designation/lookup fields from all four retained answer families, preserving genuine empty embedded selections, qualified support and frozen interpretation history.
- Move consequential displayed lookup context beside shared answers and include it in the affected View/arrangement identity. Current successful family descriptors still contain lookup fields. Full four-family identity/resubmission proofs remain required.
- Complete runtime result/Presentation compatibility, pre/post-construction failure and allowed fallback; fixed catalog/operation definitions; both extension demonstrations; and the full remaining capability/reuse/qualification verification.
- Complete remaining equivalent known-target/materialization cases for interpretation and integration through the final catalog seam. The controlled narrower-population cases here exercise the actual resolver and mechanical constructors in one store/Session; production Session tests exercise current provider populations, including external endpoints.
- Prepare final integrated review after the full plan is implemented and verified. The separately deferred general Presentation/options design, exact retained-answer redisplay, captured-basis observation export and navigation-origin lineage remain outside scope.

## Verification already performed

- Final `npm run check` passed.
- Final `npm test` passed all 509 tests (about 171 seconds), including the prior intermittent CLI test, worker/parent publication, cancellation/usage, reference allocation, qualified construction and source disclosure checks.
- The initial focused request/resolution/investigation/construction run passed all 68 tests. Subsequent focused checks covered updated refusal/source-disclosure expectations; final full verification includes the corrected external-endpoint fixture and all later changes.
- New tests cover group binding preservation with no refusal-time Evaluation/allocation, no requested Projection on failed lookup, frozen incomplete/unavailable lookup information, candidate follow-up without observations, known modules/groups omitted from supplied evaluations, omission validation and external endpoint inspection/summary.
- `git diff --check` passed. The implementation diff contains no generated artifacts, dependencies, foundation/process changes or unrelated edits.
- No paid inference was used. Existing offline authentication tests ran with local loopback permission. Visible repository files were held stable during each complete test run.

The initial full run passed 497/508 tests and exposed legacy empty-View/observation-count expectations. The next passed 504/509 and exposed fixture-specific unavailable-layout expectations, the need to preserve qualified empty module detail, and an incorrectly changed assertion for a legitimate generated handle named `missing`. The final corrections preserve the actual fixture semantics and existing qualification checks. An initial new external-endpoint test used a fixture with no external endpoint; it was replaced with the existing temporary external-package fixture pattern. No product failure was relabelled to make a test pass.

The reviewer's earlier intermittent CLI failure remains historically unconfirmed as recorded in the prior disposition. This checkpoint does not claim to identify or repair its cause.

## Review focus and reproduction

1. Trace bind group → inspect → children/parents/summary/follow-up refusal → inspect again. Check that classification does no allocation/evaluation and cannot retarget a binding. Check unknown, foreign and reserved-looking references independently of applicable literal names.
2. Check collection versus single-subject matching, explicit candidates, unavailable/incomplete lookup support, stable returned snapshots, and candidate follow-up with no observation sink or requested interpretation on failed selection.
3. Inspect known-target versus materialization separation for module, dependency and group answers. Check no fabricated population membership, complete empty interior, group documentation or placement; verify source support uses the original retained naming basis. Inspect the new store invariant and identity inputs for conflicting resubmission.
4. Preserve valid-request population allocation/collision schedules, direct relationship direction, opaque endpoints, empty populations, genuine embedded/associated selections and exact-original investigation behavior.
5. Trace worker/parent and command observations: normalized requests, report refusal status, separate successful resolution information, sealed usage, sink failure behavior, no fabricated View or source disclosure. Check Unicode and JSON qualification, control-character escaping and reference lifetime.
6. Inspect the disclosed staging boundaries. Do not mistake the retained legacy low-level APIs, remaining attribution work or current selector-bearing identities for completed conformance. Report any defect in the implemented subset or any staging choice that prevents the remaining approved outcome.

Useful checks: `npm run check`; `npm test`; and, after building, `node --test _build/test/subject-resolution.test.js _build/test/request-model.test.js _build/test/investigation-integration.test.js _build/test/projection-content.test.js`. Hold visible repository inputs stable while running input-sensitive tests. The offline authentication tests need local loopback permission; no inference credentials are required.

## Findings return

Use `2026-10-12-subject-resolution-round-1-findings.md` under this review-series directory, advancing the round suffix for further rounds. Follow the [findings template](../../../dev/templates/review-findings.md), identify this handoff, the exact reviewed target/scope, reviewer, method, verification, actionable findings, non-defect observations, unverified areas and gate recommendation. Preserve the authored report under `## Returned findings`.

With repository write access, create and commit only that findings file and modify nothing else. Without write access, return the findings to the human for recording. Do not arrange another reviewer or modify the implementation unless the human expressly authorizes it.

## Review gate

Implementation pauses at this intermediate checkpoint for human-arranged independent review. The human determines whether the findings/corrections and residual limits are sufficient before the remaining implementation proceeds. A reviewer recommendation alone does not accept the gate or close the task. Final integrated review and human acceptance remain required before task closure.

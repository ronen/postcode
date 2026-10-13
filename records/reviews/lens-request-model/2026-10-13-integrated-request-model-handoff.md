Record type: handoff

# Integrated Lens request model

Prepared: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Review gate: Final integrated review before task closure
Review target: `f7a082eaa92b929a03402164280a6b47dc586f02`
Baseline or diff range: `749640653b7df68deaaf48f1c7c0bc7e12133dd6..f7a082eaa92b929a03402164280a6b47dc586f02`
Latest implementation slice: `f3a0c2e0757448e68cc21c677a5857f008834701..f7a082eaa92b929a03402164280a6b47dc586f02`
Branch: `codex/lens-request-model`

## Assignment and boundaries

Review the integrated implementation against the approved plan and the human's recorded refinements. The human accepted the preceding Presentation-compatibility gate and authorized the remaining implementation. The latest slice completes mechanical registration and the nonpublic exports extension, including the worker catalog seam. This assignment encompasses the complete request-model task, not only that final diff.

Inspect implementation and relevant evidence independently. This handoff, passing tests and earlier review recommendations are not proof of correctness. Recommend whether the final gate is sufficient, identify actionable findings and unresolved uncertainty, and state verification limits. Do not modify implementation, governing material, task status or the active task record.

## Governing context

- [Approved plan](../../../docs/plans/lens-request-model.md), including all milestone exit evidence, outcome/retention cases, attribution trace and both extension walkthroughs.
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [Lens applications and request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md), and [qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md).
- [Precise designations and binding](../../../docs/decisions/precise-subject-designations-and-lookup-bindings.md), [unordered selections](../../../docs/decisions/unordered-collection-inspection.md), and [compact attribution with complete results](../../../docs/decisions/compact-attribution-and-complete-results.md).
- [Application boundaries and initiation](../../../docs/decisions/application-specification-boundaries.md), [coordinated Views](../../../docs/decisions/coordinated-views-and-qualified-results.md), [operation reuse](../../../docs/decisions/investigation-operations-and-lenses.md), and [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md).
- [Engineering guidelines](../../../dev/engineering-guidelines.md), [implementation conventions](../../../docs/implementation-conventions.md), and [review workflow](../../../dev/review.md).

The task record preserves the human's refinements verbatim. Earlier review assignments and dispositions in this directory preserve publication, resolution, identity, attribution, operation-definition and compatibility evidence. They remain useful context without narrowing this final assignment or replacing independent verification.

## Integrated result under review

Every current Session program request uses captured Lens definitions, qualified subject resolution, declared result/Presentation compatibility, retained qualified construction and actual-request publication. Usage remains subjectless. Unsettled applications produce self-contained resolution results without fabricated program answers. Rejected input preserves supplied spellings and explicit representation limits without turning post-validation defects into ordinary refusals.

Precise compact references and raw same-Session record IDs are classified through actual retained subjects before applicability. Literal names remain literal. Unsuccessful lookup allocates only its complete returned candidate set, preserving genuine prerequisite allocations and established bindings. Known compatible subjects outside supplied populations remain identified and qualified. Current unordered collection constructors canonicalize full payloads in population order, then outside subjects by record identity. Ordinary empty inspection is an invariant violation; legitimate empty populations and embedded detail remain supported.

Retained answers exclude designation, presentation and invocation reporting while including complete semantic support. Name/reference applications share answers under identical effective inputs. Exposed resolution context belongs separately to View identity. Interpretation construction freezes revisions, associations, corrections and relevant unavailable outcomes; parent usage finalization uses its explicit usage-independent arrangement key. Reuse preserves generating provenance and attributes current consumption separately.

Request, prerequisite and evidence work carries frozen parent context, actual boundary outcomes, constraints and original origins. Incremental worker progress and grouped expansion reporting avoid repeated complete snapshots. Full reports accompany Session results independently of observations and include referenced parent descriptions. Non-View JSON retains the actual request and complete resolution explanation with a compact attribution summary whose detail and completeness are distinct. Cancellation, late work and publication checks retain their existing boundaries.

Compatibility is checked before requested Evaluation and after qualified construction. Compatible fallback expansions are acquired before arrangement. Explicit display choices constrain fallbacks, whose consequential changes are reported and enter View identity. Incompatible or unmet Presentation requirements produce resolution results with actual prerequisites and any retained answer IDs; malformed internal content remains a defect. Existing embedded and associated compositions remain explicit.

### Final registration and extension slice

`mechanical-implementations.ts` registers the exact executable Lens definitions, prerequisite/required expansions, result-contract selection and local construction coordination. Session execution no longer selects mechanical constructors by Lens name. Registration rejects metadata that a constructor cannot implement; it admits the registered exports question rather than retaining the earlier blanket restriction to built-in mechanical definitions. The registry is static and immutable. A new mechanical question requires local capability code and explicit registration, not arbitrary reuse of an existing constructor under changed semantics.

The nonpublic exports Lens retains a distinct `module-exports-projection`, selecting established export claims, documentation associations, relevant outcomes and support without manufacturing inspection. Its constructor distinguishes complete empty, unrequested, partial/unavailable and outside-population cases. Its pure arrangement accepts detached content, shares qualified export resolution and documentation/role formatting with existing inspection, bounds displayed detail and exposes source only when explicitly requested. Record-reference validation, content compatibility, source classification and reference normalization include this family explicitly. New construction and Presentation methods begin at `@1`; existing formatting semantics and method versions are preserved by the extraction.

The internal catalog seam now captures definitions before both direct and worker Session opening. The parent uses that snapshot for input capture and sends it to the worker. The exports pairing and risks/second-consumer fixtures use ordinary resolution, execution, retention, publication and observations. Neither is installed in the production CLI catalog. The interpretation extension uses existing operation execution and Presentation with no extra inference on compatible consumption.

## Verification performed by the implementer

- `npm run check`, build and `git diff --check` passed.
- Final focused extension/content/request-model run: **54/54 passed**.
- Full offline suite: **575/575 passed**, about **174 seconds**, using `caffeinate -is npm test` for temporary process-scoped sleep inhibition. Existing loopback authentication fixtures ran with permission; no paid inference was used.
- Repository inputs and Git state were held stable during verification; before/after status and tracked diffs matched. The temporary power assertions ended with their test processes.

The nine added tests cover the distinct export answer and absence of unused inspection; name/raw/compact answer equality; established-empty, reexport and type-only behavior; recorded documentation and explicit source disclosure; immutable catalogs and unsupported registration; missing/unknown/ambiguous/Presentation refusals; controlled partial/unavailable/unrequested/outside-population content; detached bounded arrangement and later accumulation; typed reference comparison; actual exports worker publication despite sink rejection; and risks worker reuse with authoritative usage and actual consuming Lens reporting. Existing dependency-selection tests still check the absence of unused module inspection.

Initial focused verification passed 44/51: seven new cases made incorrect fixture assumptions about generic filenames/handles or selected a naming field that was not the handle. The fixtures now use an independently meaningful basename and actual handle designation. A subsequent 7/8 run exposed another synthetic-fixture error: documentation expansion also supplied established export claims, so reducing only the export expansion did not create the intended one-claim partial case. The controlled partial/unavailable inputs now restrict both supplied expansion outcomes. No product qualification was weakened to satisfy those expectations. Subsequent focused runs passed 14/14 and finally 54/54, followed by the full passing suite. Type-checking also caught local test-field and shared-label extraction mistakes before execution.

### Repository-scale observation

A single direct Session run on the repository's **698 modules** measured:

| Request | Time | Progress updates / serialized bytes | Output / full work report bytes |
| --- | --- | --- | --- |
| Module inventory | 6.99 s | 10 / 1,070,491 | 9,972,574 / 1,070,266 |
| Exports of the project module with the largest displayed export count (29) | 1.86 s | 8 / 713,428 | 59,240 / 713,275 |
| Same exports via compact instead of raw reference | 1.60 s | 8 / 714,051 | 59,139 / 713,899 |
| Missing inspection | 1.71 s | 11 / 1,072,125 | 1,645,164 / 1,071,864 |

Raw/compact requests shared the retained answer ID. Export completeness was established; the missing lookup returned a resolution report. This was one accumulating Session, not a cold-start CLI benchmark, heap study or throughput guarantee. Earlier attribution-scale evidence remains in its disposition; these measurements do not replace it or imply execution work was omitted because progress was compact.

## Review focus and reproduction

1. Trace each approved outcome through direct Session and worker/publication boundaries. Challenge applicability versus unknown references, qualified lookup, complete candidate delivery, raw/compact equivalence, unsupported inputs, and the ordinary-refusal versus internal-defect boundary.
2. Inspect complete retained payload/key consistency, explicit reference normalization, binding schedules, canonical unordered selections and frozen interpretation snapshots. Verify that changed support stays consequential while designation, format, usage and consuming Lens do not improperly fragment reusable work.
3. Verify attribution across provider acquisition, Evaluation/derivation, interpretation evidence delivery and publication. Check full parent descriptions, original/current origins, outcome-preserving aggregation, report completeness and cancellation/late-work behavior.
4. Check that registered declarations determine executable behavior. The final mechanical registry and new result family need fresh review, including catalog capture across the worker, failed Presentation settlement, shared formatting equivalence, source classification and no unused inspection in exports/dependencies.
5. Test both extension walkthroughs as additions through common machinery. Check that adding the explicit new contract requires only the declared bounded integration points and does not hide a Lens-name special case in normalization, resolution, attribution or publication. Challenge new record/content validation and qualified empty/partial/unavailable semantics.
6. Reconcile the approved plan's milestone/verification obligations with actual evidence and current documentation. Identify unsupported completion or conformance claims rather than assuming a passing suite establishes every obligation.

Useful test entry points:

| Obligation | Evidence to inspect/reproduce |
| --- | --- |
| Definitions, input rejection, actual outcomes and worker reporting | `request-model.test.ts`, `lens-extensions.test.ts`, `exports-lens.test.ts`, `observation-publication.test.ts` |
| Resolution, collision schedules, raw references and omitted known subjects | `subject-resolution.test.ts`, `collection-selection.test.ts`, `session.test.ts` |
| Answer identity, canonical collections, embedded-empty and frozen selection | `answer-identity.test.ts`, `collection-selection.test.ts`, `investigation-selection.test.ts`, `projection-content.test.ts` |
| Attribution, cancellation, incremental reporting and size | `work-attribution.test.ts`, `evidence-access.test.ts`, existing execution/worker tests |
| Compatibility, fallback and materialization failure | `presentation-compatibility.test.ts`, `exports-lens.test.ts` |
| CLI/shell formats, source, pages, correction, reuse and usage | `cli.test.ts`, `organization-cli.test.ts`, `source-disclosure.test.ts`, `investigation-integration.test.ts`, dependency tests and Session comparison fixtures |

Run `npm run check`, then `npm run build` and the selected compiled tests under `_build/test/`; run `npm test` for integration. Keep repository files and Git state stable during input-sensitive tests. Prevent machine sleep during elapsed-guard verification.

## Residual limits

No further planned implementation is deliberately deferred at this gate. Final independent review, any resulting corrections and human acceptance remain necessary. This is not a claim of complete application-specification conformance.

The extension's partial/unavailable and narrower-population cases use controlled core inputs; its normal/empty/reexport and worker cases use the actual provider. The suite is not exhaustive malformed-catalog fuzzing, a heap/GC study, a hosted-investigator assessment or a worker-restart durability test. Custom fallback catalogs are exercised directly; the new worker seam is covered by both normal extension families, not every fallback/paging combination.

The earlier intermittent CLI JSON failure remains unconfirmed, as recorded in the publication disposition and task record. This clean full run does not retroactively explain it. Prior compatibility verification also documented sleep-contaminated runs separately from its passing run; no such failure occurred in this final run.

Exact retained-answer redisplay, changing-input/multi-state workspaces, arbitrary multi-Projection coordination, persistence/cross-Session references, a general planner, dynamic registration and broad Presentation/options redesign remain outside the approved task. The existing observation captured-program-basis gap and retained-Projection continuity backlog remain disclosed; request/work attribution does not claim to close those separate concerns.

## Findings return and gate

If you have repository write access, use the [findings template](../../../dev/templates/review-findings.md), create `2026-10-13-integrated-request-model-round-1-findings.md` in this directory, identify this handoff and exact reviewed target, preserve the report under `## Returned findings`, and commit only that record. Otherwise return the findings to the human. Subsequent rounds use this handoff with their exact new target and round number.

Implementation pauses for the human-arranged final review under the workflow. Each finding receives a disposition. Rejection or material qualification, consequential alternatives, scope expansion and reviewer uncertainty return to the human before proceeding. The task remains active until the human judges this final gate sufficient; a reviewer recommendation alone does not authorize closure.

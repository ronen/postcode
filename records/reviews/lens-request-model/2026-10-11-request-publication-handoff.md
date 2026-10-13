Record type: handoff
Prepared: 2026-10-11
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Review gate: Intermediate request/publication boundary checkpoint
Review target: a9c8189f042d5fe6cabf27db414b995a5972d0f6
Baseline or diff range: e83a7f3..a9c8189f042d5fe6cabf27db414b995a5972d0f6
Branch: codex/lens-request-model

# Request publication checkpoint

## Review assignment and boundaries

Review the first integrated implementation checkpoint of the approved request-model plan. This is an intermediate review under the [workflow default](../../../dev/workflow.md#intermediate-review), before expanding the changed worker/publication contract into qualified subject resolution, prerequisite attribution and retained answer identity. The shared boundary now carries non-View results and authoritative usage, so an error here could affect every subsequent family migration.

Inspect the implementation and evidence directly. This handoff and the implementing agent's test results are not independent proof of correctness. No milestone or full-plan completion is asserted. Recommend whether this boundary is suitable for continuing the remaining authorized implementation, identifying corrections or material design concerns first.

The reviewer may commit only its findings record. Do not modify implementation, governing material, task status or the active task record. The human chooses the reviewer and determines whether the gate is sufficient.

## Governing context

- [Approved plan](../../../docs/plans/lens-request-model.md), especially M1, the bounded reporting path, and the M2/M3 outcome/usage dependencies.
- [Lens applications and request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md).
- [Qualified construction under the request model](../../../docs/decisions/qualified-construction-under-the-request-model.md).
- [Experimental structured outputs](../../../docs/decisions/experimental-structured-outputs.md).
- [Operation separation](../../../docs/decisions/investigation-operations-and-lenses.md) and [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md).
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [engineering guidelines](../../../dev/engineering-guidelines.md), and [implementation conventions](../../../docs/implementation-conventions.md).

The worktree was clean at initiation. The initial checkout was `7496406`; comparison with the plan's assessed `dade1e7` found no source, test or package changes. The opening task-record commit is the implementation baseline above. Foundation and development-process files are unchanged.

## Result under review

The current static Lens declarations supply normalized question/parameter/designation reporting and the operation mapping used by Session dispatch and investigation selection validation. Usage has no Lens declaration. Requests capture presentation choices and reference lifetime separately; direct execution snapshots caller input before asynchronous validation. Invocation correlation remains outside immutable program answers and reusable operation requests.

The execution envelope now distinguishes `view`, `usage` and `resolution`. Only invalid Lens parameters currently produce the new resolution alternative. Those refusals and subjectless usage perform no Evaluation or Projection retention. The former usage-only Projection descriptor, arrangement identity and faux View have been removed. Report finalization in the parent reads sealed usage and renders the supplied report without store/binding access. Real investigation Views retain their explicit usage-independent arrangement key.

Version-two observations record the actual normalized request, including interpretive follow-ups, instead of reconstructing it from a View descriptor. Non-View results have report records and command outcomes but no view-produced or source-escape event. Existing input checks, command status, actual output, source classification, sink failure warnings and independent usage reporting remain in place.

Module matching is extracted into a shared selection function. Dependency children/parents consume that selection directly, removing the unused module-inspection Projection while preserving current selection and reference-allocation behavior. This is the bounded F4 correction, not completion of qualified resolution.

No existing program Projection payload or identity formula is changed in this checkpoint. Program-answer/presentation method bumps belong to the subsequent semantic migration; the removed usage report identity has no replacement content identity. Tests compare program outputs separately from occurrence context rather than normalizing arbitrary UUIDs or weakening reference-aware comparison.

### Work still required

The task remains active. This checkpoint does **not** complete M1, M2, M3 or M4:

- Complete the five-boundary request/Evaluation/evidence/publication attribution trace, preserving generating provenance separately from current consumption and covering interrupted/failed requests.
- Implement shared qualified subject resolution, read-only binding classification, applicable-but-unmaterialized targets, candidate lifetime, missing/unknown/unsupported/ambiguous/incomplete outcomes and their non-View publication. Existing ordinary subject-lookup failures still follow the old family paths, including F2.
- Separate designation and lookup-only qualification from all four families' retained answers; update identities, validation, descriptors and exposed resolution context with the prescribed method bumps and frozen selection guarantees. F3 remains in existing answer descriptors.
- Integrate runtime result/Presentation compatibility, pre/post-materialization failure and allowed fallback. Prospective result declarations alone are not runtime compatibility evidence.
- Introduce the fixed per-Session extension construction seam and operation objective/context/method definitions; demonstrate both module-risks Lenses sharing interpretation and the module-exports Lens/Presentation with controlled fixtures. No extension-locality claim is made by this checkpoint.
- Complete the plan's full capability, qualification, identity, reference-collision, reuse and extension verification and subsequent documentation reconciliation, then prepare the final integrated-review handoff.

The separately deferred F5/F6, captured-basis observation export and navigation-origin limitations remain. No new public Lens, plugin system, persistent history, general report framework, or foundation/process revision is included.

## Verification already performed

- `npm run check`: passed on the final implementation.
- `npm test`: all 495 tests passed with local loopback permission (about 141 seconds).
- Focused request/publication, Session, investigation, source-disclosure and sink checks: 84 tests passed before the final full run.
- New coverage checks all ten declarations and designation modes; early rejection for every Lens without store writes; usage without Evaluation; distinct invocation context with stable program output; caller request capture; actual worker publication and sink failure for all three result kinds; non-View pre/post-output invalidation; idempotent usage report finalization; and absence of the dependency-selection inspection side effect.
- Existing progressive worker tests now assert the actual summarize/decompose/explain/examine/inspect request identities and designation modes. Closing-window and offline adapter tests assert usage reports without synthetic Views while preserving sealed totals and credential exclusions.
- `git diff --check`: passed. Final diff inspection found no foundation/process edits, new dependencies, generated artifacts or unrelated changes.

All investigator/adapter tests use existing controlled doubles or offline transport fixtures; no paid inference was used. The initial sandbox full run had three loopback callback failures and four obsolete usage-as-View assertions. A local bind probe returned `EPERM`; the unchanged sign-in suite passed all 20 tests with loopback permission. The four assertions were replaced with explicit two-program-Views plus one usage-report checks, preserving usage, reuse and credential-exclusion assertions.

## Review focus and reproduction

1. Trace actual requests through direct Session execution, worker transfer, publication and observations. Check follow-up Lens identities, all designation modes, presentation/parameter separation, report-only semantics and caller input snapshots.
2. Verify that non-View usage finalization retains authoritative sealed reports, is idempotent and performs no core lookup. Check no late publication, pre/post-output invalidation and sink failure behavior for non-View results.
3. Confirm dependency selection retains no unused inspection Projection while maintaining direct direction, opaque subjects, population qualification, support and allocation order.
4. Review the boundary between implemented declarations and deliberately unfinished resolution/compatibility/extension work. Identify a contract error now, rather than treating prospective metadata as evidence that the whole model exists.
5. Check test changes against independent expected behavior. In particular, program-output comparisons omit only the explicit occurrence context; existing reference/evidence comparison policy is unchanged.

Reproduce with `npm run check` and `npm test`. Focused coverage includes `request-model`, `dependency-projections`, `investigation-integration`, `investigation-selection`, `session`, `session-inputs`, `source-disclosure`, `openai-investigator`, `shell` and `observation-publication` tests. The sign-in tests require a local loopback listener; they do not contact a hosted investigator.

## Findings return

Use `2026-10-11-request-publication-round-1-findings.md` in this review series (increment the round for subsequent targets), following the [findings template](../../../dev/templates/review-findings.md). Include the exact reviewed commit/range, method, performed verification, actionable findings, non-defect observations, unverified areas and recommendation for this intermediate gate. Preserve the authored report under `## Returned findings`.

If repository write access is available, create and commit only that findings record. Otherwise return the findings to the human, who may provide them to the implementing agent. Do not modify any other file.

## Review gate

The implementation pauses here for human-arranged independent review, as required by [the review workflow](../../../dev/review.md). Address returned in-scope findings under this active task. Continue the remaining authorized plan when the human determines that this intermediate gate is sufficient. Material corrections may require another round with an explicit new target. This gate cannot close the task: full implementation and verification followed by the final human-accepted integrated review remain required.

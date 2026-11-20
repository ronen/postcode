Record type: handoff
Prepared: 2026-11-20
Task: `2026-11-15-structured-architectural-accounts`
Review gate: final integrated review of the approved plan (M4), clean independent assessment
Review target: `801e2dd19603455947f32b9936d8f033b1feb5fc`
Baseline or diff range: `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1..801e2dd19603455947f32b9936d8f033b1feb5fc` for the complete implementation. `d724192871ab15510630e8a52374db8e313b21db..801e2dd19603455947f32b9936d8f033b1feb5fc` isolates the context-authoring extension, and `fdd670e619087ee5d45654153f99b99f13be65d4..801e2dd19603455947f32b9936d8f033b1feb5fc` covers all changes since the first integrated round.
Branch: `claude/structured-architectural-accounts`
Worktree: `../app-worktrees/structured-architectural-accounts-impl`
Pull request: https://github.com/ronen/postcode/pull/14

# Structured architectural accounts: clean final integrated review

## Review assignment and boundaries

Review the complete delivered implementation at `801e2dd` against the approved plan. Then recommend whether the final integrated gate is ready for the human's determination.

This is a new assignment, related to the [final integrated review](2026-11-19-m4-integrated-handoff.md). Two things changed materially, which is why it has its own handoff:
- **The governing basis.** Task follow-ups `0e32c08` and `d5c33d2` direct the delivery and agent authoring of explicitly selected follow-up context, beyond the plan's original M4 delivery. `d5c33d2` also authorized a focused live trial.
- **The focus and the reviewer's independence.** The earlier assignment had four rounds, two of them by the same reviewer session. The human has asked for a reviewer who has not taken part in this series.

The earlier handoff, findings and disposition remain unchanged and keep their own record of that assignment.

Assess the code independently, as if no earlier review had happened:
- Form your own view of the implementation and evidence before reading the earlier findings records. Use them afterwards only to compare conclusions, and say where you relied on them.
- Neither this handoff, the implementing agent's verification, the live trial's success nor earlier reviews prove correctness.

Boundaries:
- You may inspect the code and run offline checks.
- Do not invoke live inference. The authorization in `d5c33d2` covered the implementing agent's focused trial only.
- Do not change implementation or governing material, alter task status or the task record, merge, or arrange further agents or reviewers without human direction.

## Governing context

- **Plan and task:** the [approved plan](../../../docs/plans/structured-architectural-accounts.md) and the [active task record with its chronological direction](../../tasks/2026-11-15-structured-architectural-accounts.md). The two 2026-11-19 entries define the context extension and its live-verification budget.
- **Governing documents:** [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), the [application specification](../../../docs/app-specification.md), and the applicable adopted [foundation](../../../foundation/README.md).
- **Decisions on contributions, answers and explanation:**
  - [Common analysis contributions](../../../docs/decisions/common-analysis-contributions.md)
  - [Association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md)
  - [Qualified answers](../../../docs/decisions/qualified-answers-over-contributions.md)
  - [Structured content](../../../docs/decisions/structured-investigram-content.md)
  - [Structured architectural explanation](../../../docs/decisions/structured-architectural-explanation.md)
- **Decisions on outcomes, presentation, API and transport:**
  - [Investigation attempts and answer outcomes](../../../docs/decisions/investigation-attempts-and-answer-outcomes.md)
  - [Exact retained answers](../../../docs/decisions/exact-retained-answer-presentation.md)
  - [Internal application API](../../../docs/decisions/internal-application-api.md)
  - [Execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md)
  - [Reference transport](../../../docs/decisions/investigator-reference-transport.md)
- **Accepted checkpoint dispositions:** [M2](2026-11-18-m2-vertical-disposition.md), [M3 mechanical](2026-11-18-m3-mechanical-disposition.md), [ownership sharing](2026-11-18-m3-ownership-sharing-disposition.md) and [M3 caller](2026-11-18-m3-agentic-caller-disposition.md). These are evidence about earlier targets, not verification of this one.
- **Validation records:**
  - [Integrated checkpoint](../../validation/structured-architectural-accounts/m4-integrated-checkpoint.md)
  - [Retirement and coverage inventory](../../validation/structured-architectural-accounts/m4-retirement-coverage.md)
  - [Representative memory comparison](../../validation/structured-architectural-accounts/m4-memory-comparison.md)
  - [Context-authoring verification](../../validation/structured-architectural-accounts/m4-option-context-authoring.md)
- **Earlier assignment, for comparison after your own assessment:**
  - [Handoff](2026-11-19-m4-integrated-handoff.md)
  - Findings: [round 1](2026-11-19-m4-integrated-round-1-findings.md), [round 2](2026-11-19-m4-integrated-round-2-findings.md), [round 3](2026-11-19-m4-integrated-round-3-claude-findings.md) and [round 4](2026-11-19-m4-integrated-round-4-claude-findings.md)
  - [Disposition](2026-11-19-m4-integrated-disposition.md), current through `d1cc573`

## Result under review

All supported mechanical families and agentic operations use common contributions:
- Retained information is organized by qualified declaration ownership, exact uses, Query-result designations, actual producer inputs and identifiable reconsideration causes.
- The application API provides state-dependent behavior, a bounded state diagram and retained follow-up invocation.
- Existing CLI and worker capabilities use common answers, and no new commands are added.
- The old tree/correction regime, its native store records and the binding port are retired.
- Immutable evidence and content are shared under lifetime-scoped ownership. Each answer independently captures its selection, standing and reconsideration state.

These changes came after the first integrated round:
- **`feabbb5`:** documentation and coverage corrections from round 1.
- **`b8b1b6d`:** mixed diagram availability is stated neutrally. A fulfillment clause appears only from retained unmet requirements when a result contract applies. Documentation for the binding port and revision snapshots is corrected.
- **`d724192`:** explicit `InvocationRequest.context`, including context retained in an invoked option, is delivered after the subjects. It uses the same acquisitions, response and total-dialog bounds, and dispatch-only exposure. It is carried separately in `DialogInput.request.context`. Dialog method version: `@12`.
- **`801e2dd`:** the hosted submission schema and the follow-up authoring instructions expose optional `options[].request.context`. Entries are direct subject references (Entity, content/component, designation, investigram or scope) with no `{ subject }` wrapper. Omitting it is allowed. A scope-only entry yields an unavailable response. Dialog method `@13` and wire protocol `contribution-dialog-wire@9`. Acceptance, identity, acquisition, bounds and exposure semantics are stated as unchanged.

The implementation does not claim new CLI state or option commands, persistence, cross-Session identity, automatic reassessment or clearance, automatic context selection, or a total byte cap on serialized output.

## Verification already performed

This is implementing-agent and earlier-review evidence, not independent verification of this target:

- **At `801e2dd`:**
  - Type check and build passed.
  - 92/92 focused offline tests passed. The files are listed in the context-authoring record.
  - Compiled-source SHA-256: `a16e5600b93e0101bbb4bbfa1995b260b103e58087f52c8a989251d11c22efb6`.
  - **The full suite has not been run at this target.**
- **At `d724192`:** round 4 reproduced 725/725 tests on macOS with Node 22.13.1, with digest `190e2c60…`. That result does not carry over to `801e2dd`.
- **Live trial:** two authoring-and-invocation runs on the pinned Cockatiel fixture, using `gpt-5.6-sol` with medium reasoning and unchanged production limits. They used 14 of the 30-request cap.
  - In run 1, context was authored and delivered correctly. However, the invocation, which requested a diagram, ended at the elapsed-time guard while repairing a malformed state model.
  - Run 2, a prose-only follow-up, authored and invoked without repair.
- **Memory:** representative memory was last measured at `4a4d060`. It has not been repeated since. The ownership representation is stated as unchanged.

## Review focus and reproduction

1. **Complete integrated mechanism.**
   - Atomic acceptance and identity resolution.
   - Cause derivation and what counts as known: delivered, notified or concerned changes, as opposed to merely listed ones.
   - Acquired versus dispatched input and discard of undelivered content.
   - Reuse, fresh work, and attempt versus answer fulfillment.
   - Exact history after later changes and after Session close.
   - Ownership and disposal.
   - Coverage preserved by the retirement inventory, rather than retired assertions that merely let the suite pass.
2. **Context delivery (`d724192`).**
   - Order and separation from subjects and option metadata.
   - Validation of unknown references and component selectors before dispatch.
   - Behavior under the response and character bounds and at the pre-dispatch checkpoint.
   - Exposure records only what was actually sent.
   - Whether the hosted codec's key-based translation handles every context form correctly.
3. **Context authoring (`801e2dd`).**
   - Whether the schema's `anyOf`, including the separate scope branch, accepts exactly what acceptance accepts.
   - Decoding of handles and submission-local references in authored context.
   - Rejection of invalid or wrapped entries without mutating acceptance state.
   - Whether the instructions make context clearly optional and distinct from subjects.
   - Whether the `@13` and `wire@9` bumps are justified and described accurately in provenance and reuse terms.
4. **Live evidence.**
   - Judge whether the validation record and audit support its claims, including the request accounting, the unknown usage of request 8, and the interrupted run being treated as a real limit-stop.
   - The ignored artifacts are in `_trials/m4-option-context-*` in the implementation worktree, with manifest SHA-256 `eaac0bef…`. Raw captures can contain repository source. Inspect them locally only, and do not copy them into the findings record or anywhere external.
   - The audit `_trials/m4-option-context-audit.mjs` runs offline against a run directory.
5. **Documentation.** Check that the current architecture, capability and CLI documentation accurately describes the delivered behavior and its limits.

To reproduce from the implementation checkout, or from an isolated export of `801e2dd`:
- Run `npm run check`, then `npm run build`, then `node --test --test-concurrency=2 _build/test/*.test.js`.
- Use Node 22.13.1 for the installed native modules.
- Offline authentication tests need local loopback and native credential-lock access.
- Keep tracked files and the compiled build fixed during the suite, and run no other compilation in the same build directory. Repository-local fixtures read shared repository inputs.
- Reproduce the digest with `node --input-type=module -e 'import {buildIdentity} from "./scripts/comparison-fixtures.mjs"; console.log((await buildIdentity("_build")).sha256)'`.
- For memory, follow the memory record (Node 26.11.0, separate builds, pinned workload) if you reproduce it.

## Findings return

Use [the findings template](../../../dev/templates/review-findings.md).

If you have repository write access:
- Create `records/reviews/structured-architectural-accounts/2026-11-20-m4-clean-integrated-round-1-<reviewer>-findings.md`.
- Identify this handoff, the exact target and the scope you actually reviewed.
- Include your method, the checks you ran, actionable findings, non-defect observations, residual limits and your gate recommendation.
- Say whether, and where, you consulted earlier findings.
- Preserve the report under `## Returned findings`. Commit only that findings record and modify nothing else.

Without repository write access, return your findings to the human.

Further rounds reuse this handoff while its assignment applies. Each round identifies its new exact target and the preceding findings.

## Review gate

The implementing agent addresses returned findings under the active task and the review workflow, with further review after material corrections. Only the human's confirmation that the final review gate is sufficient permits the task to conclude. A clean review alone does not authorize closure or merge, and this handoff grants neither.

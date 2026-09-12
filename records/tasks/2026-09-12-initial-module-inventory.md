# Implement the initial module inventory slice

Status: active
Opened: 2026-09-12
Closed:

## Task

# Implement the initial module inventory slice

Implement the approved [Initial module inventory slice](../docs/plans/initial-module-inventory-plan.md) in full, governed by the accepted decisions linked from that plan and by the repository's adopted foundation, conventions, task protocol, and development workflow.

The goal is a runnable local development CLI that opens one `tsconfig.json`-configured TypeScript project and provides deterministic, qualified `modules(project)` and `inspect(subjects)` projections through Unicode and experimental JSON presentations. The implementation must establish only the concrete program-record, store, language-analysis, evaluation, projection, presentation, source-detail, and observation boundaries required by this slice.

Treat every success criterion, scope item, verification requirement, and non-goal in the approved plan as part of this task. In particular, preserve the distinctions among conceptual information, source detail, claims and Claim context, evaluation outcomes, recorded assertions, and observation evidence. Do not silently narrow the explicit TypeScript module population or broaden the slice into dependency analysis, persistent caching or sessions, a general evaluation framework, a GUI, or other deferred work.

## Implementation selections and approval gates

At implementation start, select the TypeScript CLI and test toolchain and state the purpose of each consequential dependency. Routine choices within the approved plan are delegated to the implementing agent. Obtain human approval before making a choice that introduces a durable commitment beyond the plan.

Select and document the concrete local development `ObservationSink`, its destination, and its privacy-visible configuration. Generated output may be stored inside or outside the development repository and must be ignored by Git unless intentionally retained as fixture or validation evidence. Whenever PostCode analyzes a repository containing the sink output, explicitly exclude that output location from repository evidence. Obtain human approval before using a remote or shared destination, committing observations from a real project, or adopting a destination whose exclusion from analysis cannot be guaranteed. Do not treat sink selection as a producer-side retention policy.

Before acquiring or analyzing an unfamiliar external TypeScript repository, propose the repository and obtain human approval unless the human has already delegated explicit selection criteria and acquisition authority. Repository selection must not change the scope of the external-repository validation exercise.

## Implementation and review

Before opening the task record, ensure the task is being performed on a dedicated feature branch based on the current main branch. Keep the task-record opening commit, implementation commits, review corrections, verification, and task-record closing commit on that branch so the complete task can be reviewed as one change.

Proceed through coherent, reviewable milestones while retaining one end-to-end task boundary. Keep one implementing agent accountable for integrating changes and verification; assistance or review by other agents does not create separate implementation tasks. Obtain independent review at consequential architectural checkpoints where early findings could prevent substantial rework. At minimum, review the integrated program-record, store, evaluation, and TypeScript-analysis boundaries before building extensively upon them.

At each required independent-review point, prepare a review handoff identifying the reviewed commit, governing plan and decisions, relevant verification, and requested review focus. Ask the human to arrange the independent review unless an explicitly authorized review integration is available. Do not treat implementing-agent self-review as satisfying this requirement. Incorporate returned findings into the active task and record their disposition.

After implementation and the planned verification are substantially complete, prepare a final integrated-review handoff and ask the human to arrange an independent review of the complete change against the approved plan and accepted decisions. Do not close the task until the returned findings have been materially resolved or any proposed residual concern has been explicitly accepted by the human. Record the checkpoint and final reviews and their dispositions in task verification without making a particular agent, model, or service part of the product or repository architecture.

Follow the task protocol for any material human follow-up that changes, clarifies, constrains, redirects, or extends this request. Treat reviewer corrections that merely bring the implementation into compliance with this task as implementation work rather than scope expansion. Put worthwhile unrelated findings in the backlog instead of expanding the task silently.

## Completion

Complete the automated fixture coverage, separate-process determinism checks, generated-output evidence-exclusion checks, PostCode self-analysis, unfamiliar-repository exercise, human Unicode-output inspection, clean-agent structured-question exercise, documentation, final-diff review, and task-record updates required by the approved plan and development workflow.

Retain the clean-agent inputs and outputs, unfamiliar-repository identification, and other validation evidence where practical in an appropriate durable or explicitly identified location. Do not commit third-party repository contents, observations from a real project without human approval, dependency caches, generated build output, or incidental scratch material.

Do not close the task merely because the CLI runs or an intermediate milestone passes. Closure requires the approved slice's complete outcome and proportionate verification, together with an explicit account of anything not verified, any material deviation, and any accepted residual uncertainty.

## Follow-ups

## Outcome

## Verification

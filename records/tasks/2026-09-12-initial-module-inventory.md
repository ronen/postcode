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

### 2026-09-13 — checkpoint review returned

Claude has performed a review, I've placed the findings in \_work/review-findings.md ; the review reports that none of the findings are blocking, so i will leave it to you whether/which you think they should be addressed before continuing with the task

## Outcome

### First architectural checkpoint — 2026-09-12

Task remains active. Implemented the configured TypeScript module-discovery core,
qualified program records, ephemeral store, evaluation attempts, and stored module
inventory/exact inspection projections in `da8e7224395b9ac58361339bdc485c14640ad473`.
The dedicated branch is `codex/initial-module-inventory`, based on main `4a8914c`.
The opening record was committed first as `58971db`; `_work/TASK.md` was then deleted.

The implementing agent selected TypeScript 6.0.3, Node's built-in test runner, npm,
and Node type declarations. Dependency purposes and the local observation sink
selection/privacy posture are documented in [conventions](../../dev/conventions.md).
The sink is selected but not yet implemented. The CLI, expansions, presentations,
source-detail disclosure, observations and full validation remain within this task.

Implementation is paused at the required early independent-review gate. The
[committed handoff](../reviews/2026-09-12-module-inventory-core.md) identifies the
reviewed commit, governing material, requested focus, evidence, and remaining work.
The human must arrange the external review. No independent review or final
acceptance has occurred, and this checkpoint does not conclude the task.

## Verification

### First checkpoint — 2026-09-12

- `npm test`: 19 tests passed on Node 22.13.1 and TypeScript 6.0.3.
- `npm run check`: passed; staged and unstaged diff whitespace checks passed.
- Exact fixture module membership, configured/transitive sources, JavaScript,
  declaration and merged ambient modules, automatic module detection, global
  scripts, empty results, configuration failures and encountered diagnostics checked.
- Store immutability, atomic reference validation, multiple snapshots, repeated
  evaluation attempts, unavailable/deferred/failed/stopped outcomes, and zero/one/
  multiple exact inspection selection checked at their implemented boundaries.
- Independent process equivalence and changed method version checked. Changed
  source, inherited configuration, package metadata, and absent resolution target
  inputs produce changed snapshot contexts.
- Generated-output exclusions checked for roots, imports, symlink targets, contents,
  snapshot identity, and caller-supplied locations. Git-ignore checks confirm build
  output, dependencies and the selected observation directory are ignored.
- Reviewed the milestone diff for unrelated, private and generated material. No
  foundation changes, third-party repository contents or real-project observations
  were committed.
- External checkpoint review: pending; no returned findings or dispositions yet.
- Final CLI, expansion and observation behavior, PostCode self-analysis, unfamiliar
  repository approval/exercise, human Unicode inspection, clean-agent validation,
  and final integrated independent review remain outstanding. See the handoff for
  details; no unperformed check is claimed to have passed.

### Independent checkpoint review received — 2026-09-13

The human supplied Claude's independent review of `da8e722`. The reviewer
reproduced `npm ci`, all 19 original tests, type checking and diff checks, and
reported no blocking findings. The complete review and item-by-item dispositions
are retained under [the checkpoint handoff](../reviews/2026-09-12-module-inventory-core.md).

The implementation retains one exact selector, consistent with the plan's
explicit deferral of list syntax. Ambient declarations in ordinary `.ts` files
now have characterized declaration-only facets; hypothetical file-less diagnostics
remain project-wide. All 20 tests pass after these corrections. The other notes
are recorded obligations for expansion records and actual CLI output exclusions.
The early review gate is cleared; implementation continues within the same task.
Final integrated review and remaining validation are still required.

# Integrated Lens request model: round 3 findings

Record type: findings
Received: 2026-10-13
Reviewer: Claude Code (Claude Opus 5.5), independent agent session
Handoff: [Integrated Lens request model](2026-10-13-integrated-request-model-handoff.md)
Round: 3
Reviewed target: `e4452fdfcf797ab04222cbea5cd546995ade9366` (correction range `764eaa0f4a4fb5663846b5f1bfc2efae54482431..e4452fdfcf797ab04222cbea5cd546995ade9366`)
Prior findings: [Round 1](2026-10-13-integrated-request-model-round-1-findings.md), [Round 2](2026-10-13-integrated-request-model-round-2-findings.md)
Prior reviewed target: `764eaa0f4a4fb5663846b5f1bfc2efae54482431`

## Returned findings

### Scope and method

This is a focused recheck of the round-2 corrections, requested by the human after the round-2 findings. I reviewed the implementation commit `e4452fd` in a detached worktree at that exact target. I also read the human follow-up in `be592d5`, the updated [disposition](2026-10-13-integrated-request-model-disposition.md) in `6b1a83e`, and the task-record checkpoint in `dfe084e`. Those three commits change only records.

The round-2 recommendation allowed implementer verification alone. I nonetheless ran the full suite, and I made the old/new real-project CLI comparison that earlier rounds listed as unperformed.

### Verification performed

- `npm run check` passed at the target.
- `caffeinate -is npm test` at the target: **589/589 passed, 0 failed/cancelled/skipped**, about 200 s. The run was offline and used no paid inference. The worktree stayed clean.
- **Real-project CLI comparison.** I built `764eaa0` and `e4452fd` in separate worktrees. I ran each build against this repository's `tsconfig.json`, in Unicode and in `--json`, for:
  - `modules`
  - `organization`
  - `organization repository`
  - `inspect requests` (module)
  - `inspect src` (group)
  - `dependencies`
  - `children requests`
  - `inspect nosuchthing` (unresolved)

  After normalizing session UUIDs, the results were:
  - **Unicode:** byte-identical in all eight cases. All built-in headings are preserved.
  - **JSON:** differs only in the new top-level `title` (and the embedded module-detail `title` for group inspection), plus View IDs.
  - **Exit codes:** identical, including exit 3 for the unresolved case.
  - **Projection IDs:** identical for organization, inspection and children. Modules and dependencies differed between the builds; see the observation below. The cause is the worktree location, not the correction.

### Prior findings

- **R2-F1: resolved.**
  - **Title source.** `createMechanicalView` now passes the definition title to module and organization arrangement, including embedded module detail.
  - **Payload and identity.** The title is retained in `QualifiedView`/`QualifiedOrganizationView` and included in View identity. It does not enter Projection identity.
  - **Rendering.** Renderers prefix their existing scope description with the supplied title, escaped with `inlineText`. Scope still selects layout, bounds and source eligibility only.
  - **The `inspect` Lens.** Its title becomes `Inspect`. The investigram context is added explicitly in two places: `session.ts`, for interpretation inspection, and the `createInvestigationView` default, for inspection-kind definitions without a supplied title. An explicit `title` still takes precedence. This puts label construction in coordination and the application, as the human directed, rather than inferring it in a shared renderer. Lens titles do not participate in any identity, so the definition change moves no Projection or answer ID.
  - **Tests.** The updated compatible-question tests require the supplied title in both Unicode and JSON. They show that a title-only change alters View IDs (including module detail) but leaves the Projection unchanged. Direct and worker tests pin each built-in heading.
  - **Method version.** `presentation@33` is advanced for the new payload field and identity input.
- **R2-F2: resolved.**
  - **Missing Lens.** An omitted or `undefined` Lens now reports `representation: 'absent'` with "A Lens or report name must be supplied."
  - **Unrepresentable Lens.** An accessor or function-valued Lens keeps its single `omitted` representation problem, with no extra absent or invalid-name problem, and the accessor is not read.
  - **Tests.** Direct and worker publication tests cover the omitted case.

### Actionable findings

None.

### Non-defect observations

- **Answer IDs for external declarations depend on the installation path.** Running the *same* `764eaa0` build from a third copied path also gave new modules and dependency Projection IDs. Each build was stable across repeated runs at one path. The first differing record is an external `node:console` `export=` symbol, so the likely source is TypeScript library or declaration files resolved through PostCode's own `node_modules` location.
  - **Why this is not a defect:** these IDs are already session-scoped, and continuity is only promised within a Session. It is not a regression from this correction, and it is not a defect against the plan.
  - **Why it matters:** cross-installation comparison of answer IDs, for example in observation analysis, should not assume path independence. If that becomes a requirement, it needs its own decision.
- **Interpretation title context in two places.** The `· investigram` suffix for inspection-kind definitions is constructed separately in `session.ts` and in the `createInvestigationView` default. They agree today, and tests cover both. A shared helper would prevent drift, but this is a maintainability note only.
- **Dependency views still take no question title.** Their heading comes from the explicit endpoint role, as noted in round 2. That is a description of answer direction, and the human's direction did not extend to it.

### Unverified areas and residual limits

The round-1 and round-2 residual limits still apply:

- Earlier gates and the repository-scale timings were not independently re-derived.
- There was no hosted inference, heap study, worker-restart test or catalog fuzzing.
- Exports partial/unavailable coverage remains controlled.

The CLI comparison covers one real project and the eight commands listed; it did not include interpretation commands or shell sessions. The historical intermittent CLI failure was not reproduced and remains unexplained.

### Recommendation

R2-F1 and R2-F2 are corrected as directed, with no change to built-in Unicode output, answers, qualifications, bounds or disclosure. Across the three rounds, no actionable finding remains open. From this review's perspective, the final gate is **sufficient**. Accepting the gate and authorizing closure remain the human's decisions.

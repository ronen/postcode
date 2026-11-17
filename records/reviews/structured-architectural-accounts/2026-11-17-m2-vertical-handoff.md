# M2 early vertical application review

Record type: handoff
Prepared: 2026-11-17
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Review gate: Milestone 2 checkpoint — independent review of the vertical result before completing the remaining migration
Review target: `6f42db0`
Baseline or diff range: `d1c34dd..6f42db0`. Task-record and review-record commits in that range are context, not implementation.
Branch: `claude/structured-architectural-accounts`
Worktree: `../app-worktrees/structured-architectural-accounts-impl` relative to the primary checkout
Pull request: [#14](https://github.com/ronen/postcode/pull/14)

## Review assignment and boundaries

Review the early vertical application required by Milestone 2 of the approved plan. The plan asks this checkpoint to examine the vertical result, instruction usability, identity and exposure attribution, warning breadth, and known dependency gaps, before the remaining migration is completed.

Inspect the implementation, tests and evidence directly. This handoff, the checkpoint record and the implementing agent's verification are context, not proof. The immutable target and diff range define the implementation under review.

Recommend whether the vertical result is sound enough to proceed to Milestone 3. Identify actionable defects with evidence, and separate them from work the plan assigns to later milestones. The reviewer may write only its findings record, as described below. Do not modify the implementation, governing documents, the task record, task status or this handoff, and do not close or merge the task.

## Governing context

- [Approved plan](../../../docs/plans/structured-architectural-accounts.md): Milestone 2, the intermediate-state contract, verification coverage, and the instruction table.
- Accepted decisions: [common analysis contributions](../../../docs/decisions/common-analysis-contributions.md), [association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md), [qualified answers over contributions](../../../docs/decisions/qualified-answers-over-contributions.md), and [structured architectural explanation](../../../docs/decisions/structured-architectural-explanation.md).
- [Investigator reference transport](../../../docs/decisions/investigator-reference-transport.md) for the hosted protocol.
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md) and the [M1 disposition](2026-11-15-m1-mechanism-disposition.md).
- [Task protocol](../../../dev/task-protocol.md#independent-review) and the [independent review workflow](../../../dev/review.md).

## Result under review

- **Module identification and exports.** Both are contributed through a Session-owned ledger. The internal exports answer selects its findings from the ledger.
- **Agentic dialog.** A dialog runs over the ledger, and the hosted transport carries it through a typed protocol.
- **State behavior.** State-dependent behavior has a content contract, a diagram contract and a renderer.
- **Application route.** It exposes state-behavior investigation, follow-up option invocation, explicit fresh investigation, and a retained contribution answer.

Nothing in the target changes CLI commands, and the earlier interpretation operations remain on their previous structures.

Evidence:

- The [M2 checkpoint record](../../validation/structured-architectural-accounts/m2-checkpoint.md) maps each plan requirement to its evidence and records capability status, defects corrected and open questions.
- The [measurement record](../../validation/structured-architectural-accounts/m2-measurement.md) compares a fixed journey on the baseline and current builds and accumulates scripted dialogs.
- The [trial record](../../validation/structured-architectural-accounts/m2-trials/README.md) describes seven live runs, the instruction and protocol findings, and observations against each instruction obligation, with the accepted diagrams.

## Verification already performed

By the implementing agent:

- `npm run check` and `git diff --check` passed at the target.
- The full offline suite passed 738/738 with no skips.
- The measurement ran on both builds.
- The live trials used 39 of the 60 approved requests.

The raw trial captures are not committed. They contain repository source and are in the implementing session's scratch directory. The human can make them available if the review needs them.

## Review focus and reproduction

1. **Identity and exposure attribution.** Check that wrappers, dialogs and assembly record exposure only for actual deliveries. Check also that mechanical findings and their organizing uses keep separate attribution, and that there is one Entity per module with no competing copy.
2. **Answer selection and reuse.** Do the contribution answer, ordinary reuse, explicit fresh investigation and follow-up invocation follow the qualified-answers decision? Confirm that exact presentation needs no ledger access, and that each alternative is assessed separately.
3. **Diagram fidelity.** Does the renderer draw exactly the supplied states and transitions and carry their full meaning, in the committed diagrams and in the tests?
4. **Instruction usability.** Are the dialog instructions and submission schema sufficient, judged against the trial findings? Is anything still ambiguous that a live agent is likely to get wrong?
5. **Warning breadth and the open questions** in the checkpoint record: scope breadth, supersede versus add, the single repair attempt, and the missing hosted-agent configuration path.
6. **Dependency gaps.** Is anything in the target likely to force a weaker rule when the remaining mechanical families and the earlier interpretation operations migrate?

To reproduce: run `npm ci`, then `npm run check`, then `npm test`. The contribution tests are `test/contribution-*.test.ts`. Rerun the measurement with `node --expose-gc scripts/measure-contribution-session.mjs <tsconfig> <build> [output] [dialogs]`. Live trials need a signed-in ChatGPT account and human approval of inference use.

## Findings return

Use the [findings template](../../../dev/templates/review-findings.md). If you have repository write access, create and commit only `records/reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-1-findings.md`, with the required metadata and your report under `## Returned findings`, and change nothing else. Add a reviewer name to the filename if several reviewers report in one round, and increment the round for a rereview. If you cannot write to the repository, return your findings to the human.

## Review gate

Milestone 3 does not begin until the human says this checkpoint is sufficient. Findings whose resolution is clear and within the authorized scope will be corrected and verified by the implementing agent. A finding that would change consequential semantics, reject a reviewer's conclusion or expand scope goes to the human first.

# M3 remaining mechanical-family review

Record type: handoff
Prepared: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Review gate: M3 remaining mechanical-family checkpoint, separate from the agentic/caller cut-over checkpoint
Review target: `6d30d89e35971b04d759ff99f9f2a25f2111dab1`
Baseline or diff range: `7035d036b384fa8f47ed3c27f30825c7ef645ebf..6d30d89e35971b04d759ff99f9f2a25f2111dab1`
Branch: `claude/structured-architectural-accounts`
Worktree: `../app-worktrees/structured-architectural-accounts-impl` relative to the primary checkout
Pull request: [#14](https://github.com/ronen/postcode/pull/14)

## Review assignment and boundaries

Review remaining mechanical-family conformance under M3 of the approved plan. M2 is accepted by the [human-directed disposition](2026-11-18-m2-vertical-disposition.md). Inspect the implementation and tests directly; this handoff and the implementing agent's verification are evidence to examine, not independent proof.

Recommend whether this mechanical checkpoint is sufficient to proceed with the remaining M3 migration. Identify actionable defects with evidence and distinguish them from the separately scheduled agentic/caller work. The reviewer may write only its findings record as described below. Do not change implementation, governing material, task status, the task record or this handoff, and do not close or merge the task. No additional live inference is authorized.

## Governing context

- [Approved plan](../../../docs/plans/structured-architectural-accounts.md), especially M3, the intermediate-state contract, mechanical identity/exposure coverage and the repeat measurement obligation.
- Accepted decisions: [common analysis contributions](../../../docs/decisions/common-analysis-contributions.md), [association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md), [qualified answers over contributions](../../../docs/decisions/qualified-answers-over-contributions.md), and [structured architectural explanation](../../../docs/decisions/structured-architectural-explanation.md).
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), and [application specification](../../../docs/app-specification.md).
- [Task protocol](../../../dev/task-protocol.md#independent-review) and [independent review workflow](../../../dev/review.md).

## Result under review

Remaining module expansions, symbols, individual export routes, documentation assertions/associations, composition, dependencies and repository organization now enter the Session's common contribution boundary. Groups and symbols receive provider-scoped native Entity identities. Mechanical findings retain exact provider records and their own qualification; deterministic organizing uses are separately attributed. Relationships and assertions do not become filler Entities.

Derived organization work records exact fixed retained inputs. Independent compiler/source work records no retained-input delivery. Provider equivalence recognizes unchanged placement/properties/dependency-organization findings across incidental evaluation changes, without renewing displaced uses.

Mechanical Projections capture selected items, uses and exact qualified support. Fresh selection reports changed standing and causes while exact earlier answers retain their snapshots. Human output discloses qualified concerns without raw source bodies. Acceptance uses batch-local indexes to avoid quadratic work at the expanded native population.

The [checkpoint](../../validation/structured-architectural-accounts/m3-mechanical-checkpoint.md) gives the migration matrix and verification history; the [measurement](../../validation/structured-architectural-accounts/m3-mechanical-measurement.md) records resource growth and the performance correction.

**Still due in M3:** legacy summarize/explain/decompose/examine migration; replacement of tree/correction/exposure structures; mixed associated-content inspection; general common/historical subject resolution; native common-content hosted reference transport and exact caller access. Their existing tests passing does not establish new-contract conformance. This handoff does not claim M3 complete, replace the agentic/caller checkpoint, or satisfy M4 integrated review.

## Verification already performed

By the implementing agent:

- Type check and build passed; whitespace checks passed.
- Full offline suite: **769/769**, no skips, under Node 22.13.1 with concurrency 2 and local callback/native credential-lock access outside the sandbox.
- After the final additional duplicate-provider-key rejection case, mechanism/exposure/native checks: **44/44**. Product code was unchanged from the full-suite run.
- Fixed 741-module measurement on baseline and current builds, including 40 scripted dialogs; no live inference.
- Equivalent evaluations add no ledger entries; repeated application answers remain equal; scripted dialog delivery volume is unchanged.
- A controlled GC check confirmed store and ledger collection after Session close while retaining the returned answer.

The measurement is not performance parity: the journey rose from 164.4 to 211.2 seconds, final-request heap from 454.6 to 1,251.5 MB, and serialized expanded ledger from 13.77 to 132.57 M characters. Retained native items rose from 1,482 to 27,412. The initially observed quadratic acceptance cost was corrected before this target; snapshot/representation cost remains an explicit review concern.

## Review focus and reproduction

1. **Complete mechanical coverage.** Check real provider paths and fixtures, partial/unavailable findings, export aliases, recorded assertions, opaque/unresolved dependency distinctions, group anonymity, containment, ambiguous placement and derived organization. Look for a producer that silently bypasses common retention or a selection that includes unrelated populations.
2. **Identity and equivalent recomputation.** Examine the derived native key normalization and its qualification/population boundaries. Verify withdrawn uses are not renewed and exact original records remain accessible when equivalent later records map to the same item. Names must not become identity keys.
3. **Truthful exposure.** Verify source work versus retained fixed-item inputs, independently attributed production batches and no assembly delivery. Check whether each derived provider's recorded input accurately describes what it consumed, without manufacturing association or inventory dependence.
4. **Fixed answers and disclosure.** Verify selected native findings, support graph, exact standing/change attribution, evidence identity and unchanged historical presentation. Check that raw provider/source bodies do not escape human output and that literal source strings are not normalized as references.
5. **Resource cost and acceptance integrity.** Review batch-local indexes for unchanged atomicity, duplicate validation and producer separation. Assess retained snapshot growth and whether any avoidable whole-population work remains. The measured cost is disclosed, not waived.
6. **Checkpoint boundary.** Confirm documentation accurately separates mechanical completion from unfinished agentic/caller integration, without creating a permanent alternate organizing model.

To reproduce: use the installed dependency set with a compatible Node runtime, run `npm run check`, `npm run build`, then `node --test --test-concurrency=2 _build/test/*.test.js`. The new native-family tests are in `test/contribution-native.test.ts`; `test/contributions.test.ts` and `test/contribution-exposure.test.ts` cover acceptance and independent input semantics. Measurement commands and exact build digests are in the measurement record. Do not run live trials.

## Findings return

Use the [findings template](../../../dev/templates/review-findings.md). If you have repository write access, create and commit only `records/reviews/structured-architectural-accounts/2026-11-18-m3-mechanical-round-1-findings.md`, with required metadata and your report under `## Returned findings`, and modify nothing else. Add a reviewer name if several reviewers report in the same round, and increment the round for rereview. Without write access, return findings to the human.

## Review gate

The implementing agent stops at this checkpoint for human-arranged review. Proceed to the remaining M3 migration only after the human says the mechanical checkpoint is sufficient. Findings with clear, authorized corrections are addressed and verified under the review workflow; material corrections can require another round under this handoff. Consequential semantic choices or scope changes require human direction. Agentic/caller review and final integrated review remain separate required gates; the task stays active.

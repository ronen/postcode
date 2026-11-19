Record type: handoff
Prepared: 2026-11-19
Task: `2026-11-15-structured-architectural-accounts`
Review gate: final integrated review of the approved plan (M4)
Review target: fdd670e619087ee5d45654153f99b99f13be65d4
Baseline or diff range: `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1..fdd670e619087ee5d45654153f99b99f13be65d4` for the complete implementation; `1e99e93e53bfc6af1480edaa93f9fb1e3bcee0b8..fdd670e619087ee5d45654153f99b99f13be65d4` isolates the final integration/retirement delta
Branch: `claude/structured-architectural-accounts`
Worktree: `../app-worktrees/structured-architectural-accounts-impl`
Pull request: https://github.com/ronen/postcode/pull/14

# Structured architectural accounts: final integrated review

## Review assignment and boundaries

Review the complete delivered result against the approved plan, including all mechanical families, agentic capabilities, callers, exact historical answers, ownership/lifetime and the state-diagram/follow-up application. The final delta retires the old regime and reconciles coverage and documentation. Review both that delta and its integration with the earlier implementation; do not restrict this assignment to deletions or the prior caller findings. Inspect implementation and relevant evidence independently. This handoff, prior reviews and implementing-agent verification are not proof of correctness. Recommend whether the final integrated gate is ready for human determination.

The mechanical and caller checkpoints were accepted separately. Those acceptances remain recorded and do not substitute for this final review. The task is active and the PR is draft. Reviewers may inspect and run offline checks. Do not invoke live inference, change implementation/governing material, alter task status or its record, merge, or arrange additional agents/reviewers without human direction. No additional live inference is authorized.

## Governing context

- [Approved plan](../../../docs/plans/structured-architectural-accounts.md), including complete coverage and final integration obligations; [active task and chronological direction](../../tasks/2026-11-15-structured-architectural-accounts.md).
- [Core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md), [application specification](../../../docs/app-specification.md), and applicable adopted [foundation](../../../foundation/README.md).
- [Common analysis contributions](../../../docs/decisions/common-analysis-contributions.md), [association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md), [qualified answers](../../../docs/decisions/qualified-answers-over-contributions.md), [structured content](../../../docs/decisions/structured-investigram-content.md), [structured architectural explanation](../../../docs/decisions/structured-architectural-explanation.md).
- [Investigation attempts and answer outcomes](../../../docs/decisions/investigation-attempts-and-answer-outcomes.md), [exact retained answers](../../../docs/decisions/exact-retained-answer-presentation.md), [internal application API](../../../docs/decisions/internal-application-api.md), [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md), [reference transport](../../../docs/decisions/investigator-reference-transport.md).
- Accepted [M2 disposition](2026-11-18-m2-vertical-disposition.md), [M3 mechanical disposition](2026-11-18-m3-mechanical-disposition.md), [ownership-sharing disposition](2026-11-18-m3-ownership-sharing-disposition.md), and [M3 caller disposition](2026-11-18-m3-agentic-caller-disposition.md). Their individual findings and limits remain evidence, not fresh verification of this target.
- [Integrated checkpoint](../../validation/structured-architectural-accounts/m4-integrated-checkpoint.md), [retirement/coverage inventory](../../validation/structured-architectural-accounts/m4-retirement-coverage.md), [representative memory comparison](../../validation/structured-architectural-accounts/m4-memory-comparison.md), [full measurement data](../../validation/structured-architectural-accounts/m4-memory-summary.json).

## Result under review

All supported mechanical families and existing agentic operations use common contributions. Qualified declaration ownership, exact uses, Query-result designations, actual producer inputs and identifiable reconsideration causes organize the retained information. State-dependent behavior, a bounded state diagram and retained follow-up invocation are available through the application API; existing CLI/worker capabilities use common answers without adding new commands.

The obsolete tree/correction executor, acceptance, evaluation, context, selection, revision, associated-arrangement and wire-schema modules are removed, together with their native store records/index, unused binding port and standalone retained presenter. Shared evidence traversal, hosted transport, credentials, reporting, worker delivery and cancellation boundaries remain. Mixed suites and development scripts use the common path. The retirement inventory identifies replaced coverage and assertions intentionally retired under the adopted semantics. Current architecture/capability/CLI documentation and implementation conventions describe the resulting behavior; the conformance notice and migration backlog record full implementation. Historical decisions and governing rules remain unchanged.

Internally owned immutable evidence/content is shared; each answer independently captures its selection, standing and reconsideration state. Historical presentation remains self-contained after Session close. Ownership bookkeeping is lifetime-scoped, external input remains isolated, and acceptance validation/collisions precede mutation. Sharing does not alter exposure. This final delta does not change the ownership mechanism or optimize temporary canonicalization/allocation.

## Verification already performed

Implementing-agent evidence, not independent review:

- Type check and build passed. The full offline suite passed **716/716 tests**, with zero failures, cancellations or skips, on Node 22.13.1 at concurrency 2 in 498.46 seconds.
- Script syntax and diff-whitespace checks passed; removed legacy modules have no remaining source/test/script importers. Changed Markdown file links resolve.
- The combined direct Session journey covers native families, all four agentic operations, state behavior, diagram, option invocation, repeated selection, exact presentation and post-close rendering. Existing CLI/worker suites cover their supported entry points. See the inventory for coverage mappings and the checkpoint for initial fixture failures and corrections.
- Representative memory was repeated against the corrected accepted caller implementation `4a4d060e2c789f903f950d68602ffa99d0575d42`, using fresh Node 26.11.0 processes and the same clean 741-module workload. All 18 normalized journey answer keys and retained-kind counts agree. Identical requests stabilize; eight distinct overlapping answers add about 1.05 MB without new canonical information or exposure. Shared canonical support and exact historical snapshots remain preserved. The retained inventory local explains the elevated post-close sample; store/ledger probes collect, and heap drops after the measuring frame returns. The comparison separates these lifetimes and profiler metadata; serialized logical sizes are not disjoint retained heap.
- Compiled-source SHA-256: `3edaa8934ae36f8f966f4fc08fef395da08da0343d5374d0cc4b5a640b320a94`. The memory record identifies the baseline digest and full reproduction method. No live inference was performed.

## Review focus and reproduction

1. Verify complete family migration and the absence of supported legacy bypasses. Judge whether removing the old check families preserves meaningful coverage under the adopted contracts rather than merely making the suite pass. Check native guarantees, exact subjects, mixed selection, incomplete/unresolved outcomes and application bindings.
2. Exercise result reuse/redesignation/withdrawal, historical selection, competing alternatives, and exact post-close presentation. Check that attempt reporting stays separate from answer meaning and renders applicable failure/inability details without changing historical identity.
3. Review actual acquired versus dispatched inputs, content versus scoped inventory, partial/unavailable delivery, change-notice timing, causes and no automatic clearance. Retrieval/assembly must create no production exposure.
4. Inspect ownership across simultaneous Sessions, held answers after close, disposal of bookkeeping, external frozen-but-mutable descendants, collision/atomic validation and plain structured worker delivery. Evaluate the representative memory evidence and post-close explanation, not only the small fixture.
5. Verify the full Session journey, state diagram/result contract and exact follow-up invocation. Preserve credential/model/no-fallback, canonical input/reply bounds, source-as-data, source disclosure, observation, human-output and cancellation checks after transport/test migration.
6. Assess whether current documentation and conformance closure accurately describe the delivered implementation and its limits. No new CLI state/option commands, persistence, cross-Session identity, automatic reassessment/clearance, broader UI, language families or total serialized-output byte cap are claimed.

From the implementation checkout, run `npm run check`, `npm run build`, then `node --test --test-concurrency=2 _build/test/*.test.js`. Use Node 22.13.1 for the installed native modules; offline authentication tests need local loopback/native credential-lock access. Keep tracked files and the compiled build fixed during the suite because repository-local fixtures capture shared repository inputs. If reviewing in a reused build directory, ensure emitted files for deleted legacy sources/tests are absent before running.

Reproduce source identity with `node --input-type=module -e 'import {buildIdentity} from "./scripts/comparison-fixtures.mjs"; console.log(buildIdentity("_build").sha256)'`. Follow the memory record for the unchanged profiler, separate baseline/current builds and pinned workload; do not infer identity equality from counts alone. Measurement is one process per revision, not a statistical performance claim. M2 trials remain the only live instruction-usability evidence; subsequent guidance is verified offline.

## Findings return

Use [the findings template](../../../dev/templates/review-findings.md). If repository write access is available, create `records/reviews/structured-architectural-accounts/2026-11-19-m4-integrated-round-1-findings.md` (or a date/round/reviewer-qualified successor), identify this handoff, exact target and actual reviewed scope, method, checks, actionable findings, residual limits and gate recommendation. Preserve the report under `## Returned findings`; commit only that findings record and modify nothing else. Without repository write access, return findings to the human. Further rounds reuse this handoff while its assignment applies and identify the new exact target and preceding findings.

## Review gate

The implementing agent stops for the human to arrange independent review. Address returned findings under the active task and review workflow, with appropriate further review after material corrections. Only human confirmation that the final review gate is sufficient permits task conclusion. A clean review alone does not authorize closure or merge; this handoff grants neither.

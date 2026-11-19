# M4 integrated implementation checkpoint

Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Integrated verification and documentation](../../../docs/plans/structured-architectural-accounts.md#4-integrated-verification-and-documentation)
Status: implementation complete; final integrated review and human sufficiency judgment pending
Baseline: accepted M3 caller implementation `4a4d060e2c789f903f950d68602ffa99d0575d42`; acceptance recorded at `1e99e93` after round 2
Compiled-source SHA-256: `3edaa8934ae36f8f966f4fc08fef395da08da0343d5374d0cc4b5a640b320a94`

## Direction and completed work

The human accepted the M3 caller checkpoint and directed continued work. The task follow-up at `82d8b96` records that direction and identifies the remaining approved work as M4. The separate mechanical and caller dispositions remain intact. No additional live inference is authorized or used.

Every supported mechanical family contributes qualified information through the common ledger: module/symbol identification, exports and forwarding, documentation, composition, dependencies, repository/project organization, groups, containment, placement and their properties. All four existing agentic operations and application/CLI/worker consumers use common contributions, exact subjects and result designations. State-dependent behavior, its bounded state diagram and retained follow-up-option invocation are application APIs; this does not add CLI commands.

The retired tree/correction executor, acceptance, account context, revisions, evaluator, selection records/resolution and presentation paths are deleted, along with the old hosted wire schema and native-store record union/index. The standalone legacy retained presenter and presentation binding port are removed. Common answers carry coordinated bindings and independently captured historical state; rendering needs neither a current ledger lookup nor a live Session. Shared evidence, usage, credentials, native reference traversal, Session validation and transport remain.

The [retirement inventory](m4-retirement-coverage.md) identifies removed checks, their current replacements and intentionally retired semantics. Mixed tests now invoke common dialog/acceptance directly. It preserves large native evidence traversal, cancellation, canonical character guards, provider-accounting anomalies, source-mapping validation and both hosted transport routes. One direct Session journey exercises the native families, all existing agentic operations, state behavior, diagram, option invocation, repeated selection, exact presentation and retained rendering after close. Existing CLI/worker journeys cover their supported routes.

`program-records@25` describes the reduced record contract. Retired method names no longer appear in the captured registry; method-specific native algorithms and guarantees are unchanged. Current capability/CLI/status/architecture documentation and implementation conventions describe the delivered boundaries. The architectural-constraints change is a status notice only, leaving its binding rules intact. Historical decisions, the application specification, foundation and development instructions are unchanged by this checkpoint.

## Verification

- `npm run check` and `npm run build`: passed.
- Final full offline suite, Node 22.13.1, `node --test --test-concurrency=2 _build/test/*.test.js`: **716/716 passed**, zero failures, cancellations or skips, in 498.46 seconds on 2026-11-19. The compiled-source digest remained unchanged after the run.
- The first full run had 716 tests: 715 passed and one old diagnostic fixture still expecting the retired wire function. Updating that fixture to `submit_contribution` preserved the credential-safe diagnostic assertions; all three diagnostic tests then passed. This was a test expectation correction, with no production change after the memory run.
- Focused migration checks cover the common transport/evidence/lifecycle/exports/output paths. Initial porting failures were corrected: native evidence is wrapped in a common response envelope; the source-cancellation assertion locates its query after baseline acquisition; excluded-alias coverage uses an actual excluded output; dialog-bound tests use valid positive bounds. Corrected cases pass and are included in the final full suite.
- Script syntax checks and `git diff --check`: passed. No remaining source/test/script import points to the removed tree/correction modules, binding port or standalone retained presenter.
- [Representative memory comparison](m4-memory-comparison.md), Node 26.11.0 against the same clean 741-module checkout: all 18 normalized journey keys and every retained-kind count agree with the accepted caller baseline. Identical selections stabilize at 16 answers, about 643.6 MB; eight distinct overlapping answers add about 1.05 MB with no new canonical information or exposure. Canonical evidence/items remain shared. Exact history and post-close collection checks pass. [Machine-readable evidence](m4-memory-summary.json) preserves before/after-GC memory, allocation groups, keys, counts and sharing audits.

The full run needs local loopback/native credential-lock access for offline authentication tests; it sends no live inference. Keep the tracked checkout and compiled build fixed while tests run, because repository-local fixtures capture shared repository inputs. The memory workload is the unchanged primary checkout, separate from the implementation worktree. Raw logs/profiles remain disposable `_verification/` artifacts; the results and comparison are preserved here.

## Conformance and remaining gate

No supported capability remains under the temporary migration exceptions. The [migration backlog entry](../../../docs/backlog.md#complete-structured-account-migration-conformance) closes its implementation obligation and points here. Native provider records still exist as qualified evidence, paired with common contributions; they do not preserve a competing organizing regime. Failed-attempt reporting remains separate from selected answer meaning under the accepted decision, and ownership sharing does not change exposure or historical standing.

Final integrated review must judge the complete result against the approved plan, including whether retirement preserved meaningful coverage and the conformance closure is justified. This implementation record is not independent review or human acceptance. The task stays active and the PR stays draft; no merge or task closure is authorized by the checkpoint alone.

No inference-policy changes, canonicalization/allocation optimization, persistence, cross-Session identity, automatic reassessment/clearance, new language families, general UI/navigation system or global serialized-output byte cap are included. Earlier M2 live trials remain limited to their recorded guidance revision; current M3/M4 guidance is verified offline.

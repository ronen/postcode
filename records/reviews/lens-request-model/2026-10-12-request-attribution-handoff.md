# Request attribution checkpoint

Record type: handoff
Prepared: 2026-10-12
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Review gate: Intermediate review of request, prerequisite and evidence attribution
Review target: `2c26810611230bcb5d28a8f89d75b5213d57a893`
Baseline or diff range: `1b5f17824329e47b8d129355e58f14b4d5aa99f3..2c26810611230bcb5d28a8f89d75b5213d57a893`
Branch: `codex/lens-request-model`

## Review assignment and boundaries

Review the bounded attribution path across Session entry, provider/evaluation outcomes, interpretation and evidence, worker execution, and command publication. This follows the human's acceptance of the [answer-identity gate](2026-10-12-answer-identity-disposition.md). The cross-boundary changes warrant an intermediate review under the [development workflow](../../../dev/workflow.md#intermediate-review) before the remaining compatibility and extension work builds on them.

Assess the implementation against the approved scope, identify actionable defects and unresolved uncertainty, and recommend whether this checkpoint is sufficient to continue. This is not the final integrated review or a declaration of full-plan conformance. Do not implement corrections or the next phase as part of the review.

## Governing context

- [Approved Lens request-model plan](../../../docs/plans/lens-request-model.md), especially the bounded initiation/attribution assessment and five existing boundaries.
- [Lens application and request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md), especially actual request reporting and retained generating attribution versus current consumption.
- [Qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md), including answer/report identity separation and arrangement isolation.
- [Core concepts](../../../docs/core-concepts.md) and [initiation/attribution constraints](../../../docs/architectural-constraints.md#investigation-initiation-and-request-attribution).
- [Execution ownership and cancellation](../../../docs/decisions/execution-ownership-and-cancellation.md), [investigator execution and evidence access](../../../docs/decisions/investigator-execution-and-evidence-access.md), and [Session accumulation](../../../docs/decisions/transient-analysis-sessions.md).
- [Engineering guidelines](../../../dev/engineering-guidelines.md), [implementation conventions](../../../docs/implementation-conventions.md), and [independent review workflow](../../../dev/review.md).

## Result under review

Session execution and direct interpretation establish a frozen parent before work: correlation, normalized request or operation, caller role, purpose and actual inherited investigation guards. Unknown caller identity is not fabricated as human; no numeric whole-request allowance is claimed. Direct operation inputs and configured guards are captured before asynchronous checks.

Reporting distinguishes requested-answer work from PostCode resolution prerequisites and investigator-triggered evidence work. TypeScript reports actual component reuse at its existing caches; module evaluation separately reports outcome/expansion retention, and pure organization derivations report their own reuse. Dependency outcome construction reports its actual repeated derivation even when the retained record ID is equal. First-retention attribution is Session-owned metadata alongside supported results, outside immutable answer payloads and reusable keys. Equal re-derivation preserves known origins and does not invent missing origins for previously untracked support.

Interpretation execution reports its attempt and parent, and retention/reuse/inspection records current consumption with original attribution. Evidence reporting preserves query triggers, qualified outcomes, evaluation/repository summaries, listing/page continuations and omissions, and delivery state. Captured-but-withheld and acquired-but-not-dispatched records are distinct from actual investigator exposure. Pure retrieval and continuation do not claim new acquisition. Existing citation eligibility remains tied to dispatch.

Worker progress carries operation-tagged facts before final success. Direct failures retain completed boundary facts and disclose unknown unfinished work. Forced worker termination seals received facts as incomplete; late completions cannot rewrite a sealed report. Cancellation checks stop subsequent boundaries, and a completed work scope cannot authorize another provider call. Returned snapshots remain usable independently of sink delivery. Version-two observations carry `request-work`; non-View JSON includes attribution. Successful View JSON remains a View, with work attribution in its execution envelope and observation. Original parent context is included in attempt reporting, so investigation presentation advances to `@16`.

The [descriptive architecture](../../../docs/architecture/README.md#request-work-attribution), [investigation description](../../../docs/architecture/investigation.md), CLI reference and status page describe this checkpoint. Core state remains releasable at Session close; this does not add a request catalog, historical export, autonomous scheduling or user-facing budgeting.

## Verification already performed

The implementer ran `npm run check` and build successfully. Final focused verification passed all 22 tests in `work-attribution.test.ts` and `evidence-access.test.ts`. Final `npm test` passed all 529 tests (about 196 seconds). `git diff --check` passed. Existing offline authentication tests ran with local loopback permission; no paid inference was used. Visible repository inputs stayed unchanged throughout each test run.

Ten new attribution tests cover original/current context and unchanged answers; provider/evaluator reuse versus repeated derivation; partial outcomes with and without retry assurance; withheld and unavailable evidence; direct operation capture/reuse; prior-account initial context and listing metadata; page continuation consumption; acquisition without dispatch under a guard; worker interruption and sink rejection; previously untracked support; construction defects; late asynchronous evidence completion; cancellation at a provider boundary; and refusal to reuse a completed work scope. These cases share tests where appropriate rather than constituting one test each. The existing request/Session/investigation focused run also passed all 64 tests before the later refinements.

The first full run passed 526/528. One test still expected six observation records; it now verifies the exact seven record kinds, preserving its source-disclosure assertions. The other detected an unnecessary change from omitted to explicit-false dependency arguments on ordinary discovery; the original default was restored without weakening the test. Both isolated cases passed, followed by full passing runs. A later listing assertion initially overlooked the mandatory association to the original investigation subject; its expected one-account listing was corrected to the established acceptance contract. Production association semantics were not changed. The final 529-test run includes every correction and reporting detail.

## Review focus and reproduction

1. Check that first generation and current consumption are independently attributable without request-history lookup. Examine mixed new/reused provider components, first-retention metadata, untracked origins, partial retry bases and equal re-derived outcomes. Ensure no outer cache hides acquisition and no invocation field enters answer or reusable-operation identity.
2. Follow missing/ambiguous lookup, direct operation, accepted/limited/failed/unavailable interpretation, exact/associated inspection, and evidence retrieval through the report. Check full qualification and continuation metadata, withheld evidence, and the distinction between availability, materialization and actual dispatch.
3. Check direct and worker failure/cancellation, report completeness, stale/late replies, guard inheritance, closed scopes, authoritative usage, input validation and release of core state. Confirm that no report invents completed acquisition or extends authorization after the parent ends.
4. Check actual request and work publication for View and non-View outcomes, including observation failure, without fabricated Views/source events or changed reference allocation.

Useful reproduction: `npm run check`, then `npm run build` and `node --test _build/test/work-attribution.test.js _build/test/evidence-access.test.js`; run `npm test` for integration. Use the existing scripted investigator and offline tests, not hosted inference.

## Known limits and remaining work

Runtime result/Presentation compatibility across all current families, pre/post-materialization failure and fallback cases, the fixed internal catalog/operation definitions, the two nonpublic extension demonstrations, and final integrated verification/review remain required by the plan. The new attribution is intended to support them; this checkpoint does not claim to demonstrate them.

This is not a general request/history store or a post-Session export of captured inputs. Lower-level work performed without the optional reporting capability retains an explicitly unknown origin. No new large-project performance benchmark, heap/GC measurement, hosted inference assessment or worker-restart-between-resolution-and-arrangement probe is claimed. The historical intermittent CLI failure remains unexplained as recorded in the earlier disposition; passing verification is not presented as its explanation or repair.

## Findings return

Use the [review-findings template](../../../dev/templates/review-findings.md). With repository write access, create and commit only `records/reviews/lens-request-model/2026-10-12-request-attribution-round-1-findings.md`, recording the exact reviewed target, checks, findings, uncertainty and gate recommendation; modify nothing else. Without write access, return the complete authored findings to the human for preservation. Further rounds under this assignment use the corresponding round number and identify their exact target and prior findings.

## Review gate

Implementation pauses for human-arranged independent review and the human's judgment that this intermediate gate is sufficient. Findings will receive explicit dispositions; consequential alternatives, rejection/material qualification, scope expansion or reviewer-identified unresolved uncertainty require human direction. The task remains active. Final integrated review and explicit human acceptance remain necessary before closure.

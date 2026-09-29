# Module investigation: domain execution review

Record type: handoff
Prepared: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review gate: milestone 1, before shell/session integration
Review target: `d4260522c2abf0530de076c05944f531de003e4b`
Baseline: `c15afdd3b03f588534ac386c2453c81da71ffb68`
Diff range: `c15afdd3b03f588534ac386c2453c81da71ffb68..d4260522c2abf0530de076c05944f531de003e4b`
Branch: `codex/module-investigation`

## Review assignment and boundaries

Independently review the implemented domain investigation capability and its
evidence against milestone 1 of the approved plan. Inspect code and reproduce
appropriate checks; this handoff and the implementing agent's test results are
not proof of correctness. Recommend whether this checkpoint is sufficient to
proceed to milestone 2, identifying actionable defects and remaining uncertainty.

The human arranges this review. Do not change implementation, governing documents,
task status or the active task record. The target above defines the implementation
scope; subsequent task-record and handoff commits provide context, not additional
implementation under review. There is no pull request required for this assignment.

## Governing context

- [Approved plan](../../../docs/plans/module-investigation.md), especially
  milestone 1, evaluation organization, evidence access, result acceptance,
  correction/context semantics and deterministic checks.
- [Investigator execution and evidence access](../../../docs/decisions/investigator-execution-and-evidence-access.md).
- [Investigrams and progressive investigation](../../../docs/decisions/investigrams-and-progressive-investigation.md).
- [Investigation operations and lenses](../../../docs/decisions/investigation-operations-and-lenses.md).
- [Core concepts](../../../docs/core-concepts.md),
  [architectural constraints](../../../docs/architectural-constraints.md), and
  [engineering guidelines](../../../dev/engineering-guidelines.md).
- [Implemented architecture](../../../docs/architecture/investigation.md), the
  [task's evaluation-layer rationale](../../tasks/2026-09-29-module-investigation.md),
  and the [verification record](../../validation/module-investigation/2026-09-29-milestone-1.md).

## Result under review

The domain boundary accepts lens-independent operation requests and coordinates
fresh, bounded asynchronous dialogues through an agent communication contract.
It supplies qualified evidence and prior-interpretation context, validates an
explicit whole-result submission, assigns immutable identities and returns an
accepted unit or classified outcome. The accepted unit includes multi-level
composition, disjoint replacement trees, recursive/competing corrections,
attributable qualifications, evidence, associations and execution provenance.

Evidence queries dispatch through existing module, dependency and organization
evaluators. Subject-based full-source and artifact acquisition uses the provider's
existing input host, output exclusions and validity probes. New content records
are validated and retained in the ordinary program record store. Investigator
context records substantive exposure and complete correction-context delivery.
Attempt/call usage survives failure, cancellation and invalidation independently
of accepted interpretation.

The reusable scripted investigator exercises these production boundaries without
credentials. No dependency was added. The TypeScript/compiler integration and
existing mechanical CLI behavior remain in their existing execution paths.

## Verification already performed

The implementing agent ran `npm run check` and `npm test` successfully: 323 tests,
including 27 new investigation tests. Following small final corrections, rebuilt
targeted runs passed 62 investigation/store/input/output-boundary tests and then
37 investigation/expansion tests; the final type check and `git diff --check`
also passed. The [validation record](../../validation/module-investigation/2026-09-29-milestone-1.md)
distinguishes the full-suite baseline from those final targeted checks.

Tests use an ephemeral self-authored repository, real TypeScript evaluation and a
communication-boundary double. They do not establish live model performance,
provider behavior, interpretive usefulness or independent semantic verification.

## Review focus and reproduction

Run `npm run check` and `npm test`. For a focused reproduction, run
`npm run build && node --test _build/test/investigation.test.js`.

Examine especially:

- Whether evaluation/query organization preserves existing qualification, reuse
  and projection boundaries, including symbol/alias documentation access.
- Whether reference-only source acquisition has any route around captured
  mappings, generated-output exclusions or input-validity checks; whether full
  source and unavailable/partial coverage remain attributable.
- Whether result validation prevents invalid references, unqualified content,
  same-result correction targets, shared composition and partial acceptance,
  while accepting legitimate competing and recursive corrections.
- Whether exact context delivery and its bounds preserve correction notices,
  references, citation exposure and completeness per target/correction, including
  content delivered over multiple exchanges and corrected initial subjects.
- Whether execution guards, cancellation and invalidation prevent late
  interpretation acceptance, close dialogue resources and preserve known usage;
  whether operational outcomes remain distinct from unexpected defects.
- Whether tests distinguish plausible failures rather than merely mirroring the
  implementation, and whether the documented limits match actual behavior.

## Known limits and remaining work

Milestone 2 owns retained investigation-outcome selection, atomic interpretation
publication, stable CLI references, summary/inspection views, shell coordination,
observations and session usage presentation. Milestone 3 owns the hosted adapter,
provider/model verification, secure credential setup and live baseline. Broader
follow-up navigation, correction-aware views, reconsideration propagation and the
formative exercise remain later milestones. Do not report their planned absence
as a missing milestone-1 feature; do report a contract defect that would prevent
their correct integration.

The current protocol submits one assembled result in one explicit exchange; no
repair or truncation recovery is implemented. Full-file evidence acquisition has
no range/streaming selector. Synchronous compiler/filesystem operations can delay
guard detection and cannot be preempted mid-operation; their results are checked
before delivery. The architecture document states the concrete limits and
distinguishes those from remote cancellation or monetary guarantees.

## Findings return

If you have repository write access, use
[the findings template](../../../dev/templates/review-findings.md) and create
`records/reviews/module-investigation/YYYY-MM-DD-milestone-1-round-1-findings.md`
(include a reviewer suffix when necessary to distinguish simultaneous reviews).
Record your identity, this handoff, round, exact target and actual scope, method,
performed checks, actionable findings, residual limits and gate recommendation.
Preserve your report under `## Returned findings`, and commit only that findings
record without modifying anything else. If you cannot write to the repository,
return your findings to the human for preservation through the review workflow.
Further rounds stay under this handoff and name their exact new target and prior
findings as required by the [review workflow](../../../dev/review.md).

## Review gate

The approved plan requires a committed milestone handoff and a pause for
human-arranged independent review. Findings must be resolved and the human must
direct continuation before milestone 2 begins. A reviewer recommendation alone
does not satisfy the human gate or close the active task. The remaining milestone
and final integrated-review gates still apply.

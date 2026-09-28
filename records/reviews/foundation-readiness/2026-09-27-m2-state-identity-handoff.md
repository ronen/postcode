Record type: handoff
Prepared: 2026-09-27
Task: [Foundation readiness](../../tasks/2026-09-27-foundation-readiness.md)
Review gate: M2 — verification, state and identity
Review target: 0037eaff2d7dcd17fdb9186bed8511011f1eb9b6
Baseline or diff range: `6af13629aa50d875b378bf8d0294a9fda5e356d3..0037eaff2d7dcd17fdb9186bed8511011f1eb9b6`
Branch: `codex/foundation-readiness`

# Foundation readiness M2 independent review

## Review assignment and boundaries

Independently review packages 1–3 of the [active plan](../../../docs/plans/foundation-readiness.md)
and the authorized idle Ctrl-C follow-up. This is the intermediate state/identity
gate, not integrated foundation acceptance. Inspect the implementation and evidence;
do not treat this handoff, passing tests or audit reports as proof of correctness.

The implementing agent has stopped at this checkpoint. The human arranges the
reviewer and transport. Reviewers may create their findings record only; do not
modify implementation, governing material, the task record or task status.

## Governing context

- [Task and authorized follow-up](../../tasks/2026-09-27-foundation-readiness.md)
- [Plan and milestone gates](../../../docs/plans/foundation-readiness.md#milestones-and-review-gates)
- [Core concepts](../../../docs/core-concepts.md) and [architectural constraints](../../../docs/architectural-constraints.md)
- [Transient-session decisions](../../../docs/decisions/transient-analysis-sessions.md)
- [Qualification/evaluation distinctions](../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md)
- [Identity, evidence and observation constraints](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
- [Repository organization](../../../docs/decisions/repository-organization-decisions.md), [dependency structure](../../../docs/decisions/module-dependency-structure-decisions.md), and [dependency organization](../../../docs/decisions/dependency-organization-integration-decisions.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md), [workflow](../../../dev/workflow.md), and [review procedure](../../../dev/review.md)
- [Upcoming investigation plan](../../../docs/plans/module-investigation.md) and [execution/evidence decision](../../../docs/decisions/investigator-execution-and-evidence-access.md)

## Result under review

The verification harness now rejects literal, foreign-reference, relationship,
qualification, omission and order changes; sink assertions cannot disappear into
successful delivery handling. Resource cleanup covers partial fixture/worker
initialization, and subprocess tests select the actual compiled test build.

Evaluators publish coupled module/expansion outcomes atomically and return owned,
frozen records. Provider discovery results resist consumer mutation. Deterministic
store lookup replaces redundant pure-derivation maps, including for unavailable
results, while provider retries still depend on acquisition revisions and explicit
retry bases. Historical context support comes from retained records. The store's
private evaluation index and staged compact-reference allocation publish only after
validation. Existing record validation remains in force.

Identity keys normalize explicit local-reference positions, preserving literal
text and foreign namespaces. The record identity method advances to version 19.
Shared qualification prose and exact composition-method classification advance the
presentation method to version 24, without adding record codes or view fields.
The additional authorized correction makes idle Ctrl-C discard the retained line
in both dumb and normal terminal modes.

## Verification already performed

See the [checkpoint validation record](../../validation/foundation-readiness/2026-09-27-m2.md)
for the complete state/consumer matrix, identity-call inventory, method assessment,
native scope, commands and linked data. It records implementation-agent verification,
not independent verification.

- Type check and final full suite pass: 248 tests, no failures/skips/cancellations.
- 72 original-baseline/ownership-checkpoint CLI comparisons and 72 version-aligned
  baseline/final-M2 comparisons pass over complete views, rendered output and
  observations, including generated scale inputs.
- 216 fresh/accumulating/reordered/retained session comparisons pass.
- Native compiler interruption control and interrupted case pass with the first
  compiler-specific marker preserved and only one scheduled interruption.
- Negative comparator and deliberately falsified assertion controls pass.
- Atomicity, mutation resistance, first-established support, provider partial retry,
  binding collisions and evaluation-query operation-count checks pass.
- A controlled real-provider literal-name case fails with an immutable collision
  on the original build and retains two distinct modules on the corrected build.

## Review focus and reproduction

1. Audit the comparison policy against current record/view schemas, opaque captured
   evidence, JSON layout and embedded Unicode headings. Check that no literal or
   foreign reference is silently normalized. Bare reference lists must name their
   producer. Confirm negative controls distinguish plausible regressions.
2. Trace producer ownership through discovery caches, evaluation insertion and
   returned values. Reject a coupled expansion and inspect both records and index
   state. Verify later acquisition cannot replace an earlier context's input support.
3. Challenge deterministic pure reuse with unavailable and partial bases, later
   genuinely different bases, synthetic providers lacking `retryBasis`, and ordinary
   external dependency endpoints. Confirm state decisions match the matrix rather
   than a new universal validity restriction.
4. Check every identity caller and the central version assessment. Literal names,
   selectors, source paths and qualification must survive even when they contain the
   producing namespace. Internal-record selectors normalize only after resolution.
   Foreign references must remain foreign. Inspect any ID-derived ordering changes.
5. Check exact method-token classification: unrelated names sharing a prefix must
   not lose qualification; shared limitation prose must neither duplicate nor hide
   meaningful exceptions. Assess the choice to use the existing versioned method
   identity instead of adding codes or representation fields.
6. Verify atomic index/binding publication and stable prior references, including
   malformed later batch members, duplicate submissions and staged collisions.
   Query cost must scale with evaluations rather than unrelated stored evidence.
7. Assess compatibility with the remaining acquisition/execution changes and the
   investigation plan. No new universal cache, scheduler, provider registry or
   persistent-session assumption should have been introduced.

Run `npm run check` and `npm test` from the review target. Focused controls live in
`test/verification.test.ts`, `test/foundation-ownership.test.ts` and
`test/foundation-identity.test.ts`; existing `session-inputs`, `records`, `shell`
and dependency/organization tests supply integration coverage. Reproduce the
comparison and interruption commands described in the validation record. Compare
against the exact target commit, not whatever later happens to be checked out.

The final semantic control changes exactly two method constants in a disposable
baseline build. This is explicitly version-aligned comparison, not unmodified
release equivalence. Review the version changes and intentional fixes separately.
No integrated speedup or M3 subprocess/publication guarantee is claimed.

## Package and cleanup dispositions

| Package | Checkpoint disposition |
| --- | --- |
| 1: Verification | Implemented. Real ownership/publication failure probes will be completed with their M3 owners, as the plan requires. |
| 2: Ownership, atomicity, reuse and states | Implemented; matrix and failure/mutation checks supplied. |
| 3: Identity and presentation policy | Implemented; explicit caller inventory, version assessment and semantic controls supplied. |
| 4: Acquisition/execution | Pending M3. |
| 5: Observation publication and grouping | Pending M3. |
| 6: Graph delegation | Pending M4 after the relevant review gates. |
| 7: Selected-input processing | Pending M4, except C13/C16 completed while changing their current owners. |
| 8: Terminal layout/options | Pending M4. |
| Integrated M5 | Pending all remaining work, final measurements and final independent review. |

| Cleanup | Disposition and evidence |
| --- | --- |
| C01 | Implemented: shared CLI collector, explicit expected warnings, assertions outside sinks, interaction failure control. |
| C02 | Implemented: shared immediate temporary-directory registration in CLI/dependency-presentation/session-input tests; distinct fixture contents and semantics stay local. Existing callback fixture wrappers retain their cleanup scopes. |
| C03 | Implemented: comparison workers acquired under ownership, independent close attempts; controlled second-open and first-close failures. |
| C04 | Implemented: first compiler marker retained; one interruption scheduled; native control and interrupted cases pass. |
| C05 | Implemented: shared current-session comparison policy in tests and active comparison scripts. Historical snapshot-conversion comparison has different intentional migration semantics and remains separate. |
| C06 | Pending M3: shared operational I/O error classification. |
| C07 | Pending M3: containment and live output-exclusion authority. |
| C08 | Implemented: named completed/full predicate and explicit stronger conditions, documented by consumer. |
| C09 | Implemented: pure organization maps and provider support map removed; deterministic lookup and first-established support tests. |
| C10 | Implemented: coupled root/expansion `put`, with rejection/index test. |
| C11 | Pending M3: worker close-protocol removal and independently owned child cleanup. |
| C12 | Implemented: validated batch allocation per session/kind with collision and prior-binding tests. |
| C13 | Implemented now: retain the newly created placement claim directly instead of searching accumulated claims. |
| C14 | Pending M3/M4: retained repository serialization and primitive probe comparisons. |
| C15 | Pending M4: export-name maps and bounded excerpt omission accounting. |
| C16 | Implemented: local graph-population set and batch-local organization-membership sets, retaining duplicate and validity checks. |
| C17 | Pending M4: selected rendering qualification/context indexes. |
| C18 | Pending M4: source-detail priority ranks. |
| C19 | Pending M4: organization source-detail joins. |
| C20 | Pending M3/M4: capture-local ignored-ancestor lookup. |
| C21 | Pending M4: shared graph/containment ancestry and reachability. |
| C22 | Implemented: shared limitation definitions and exact registered composition-method discriminator. |
| C23 | Completed for current migrations: removed obsolete maps/helpers/imports; type checks reject unused imports. Repeat during remaining migrations. |

No included pending item is deferred out of task scope. The task remains active.

## Findings return

If you can write to this repository, use the
[findings template](../../../dev/templates/review-findings.md), preserve your report
under `## Returned findings`, identify this handoff and exact target, and commit
only `2026-09-27-m2-state-identity-round-1-findings.md` in this review-series directory.
For later rounds, increment the round and name the exact revised target and prior
findings. Modify nothing else. If you cannot write to the repository, return the
findings to the human for preservation through the review workflow.

Include actionable defects, non-defect observations, checks actually performed,
unverified areas, residual limits, and a recommendation about this intermediate
gate. Do not infer human acceptance or close the task.

## Review gate

The plan requires an independent intermediate review before these state/identity
patterns extend into later migrations. The human determines when the gate is
sufficient and implementation may proceed. Material corrections may require another
round under this handoff. M3 still has its own ownership/publication review and
pause, and M5 still requires a final integrated handoff and human gate decision.

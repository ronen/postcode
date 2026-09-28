Record type: handoff
Prepared: 2026-09-28
Task: [Foundation readiness](../../tasks/2026-09-27-foundation-readiness.md)
Review gate: M3 — acquisition and lifetime
Review target: 4656a34c0847c82d9f830a9d1587a2a28f2dd138
Baseline or diff range: `ecb9f6b81cc11c392acad2546002520af82bdb91..4656a34c0847c82d9f830a9d1587a2a28f2dd138`
Branch: `codex/foundation-readiness`

# Foundation readiness M3 independent review

## Review assignment and boundaries

Independently review packages 4–5 of the [active plan](../../../docs/plans/foundation-readiness.md).
Inspect the actual implementation and evidence; this handoff, earlier reviews and
passing checks are not proof of correctness. M2 was accepted by the human after
its second review, as recorded in its [disposition](2026-09-28-m2-state-identity-disposition.md).
This is a new acquisition/lifetime assignment, not another round of M2 or final
foundation acceptance.

The implementing agent has stopped at M3. The human arranges the reviewer and
transport. Reviewers may create their findings record only; do not modify
implementation, governing material, the task record or task status.

## Governing context

- [Task and M3 authorization](../../tasks/2026-09-27-foundation-readiness.md)
- [Plan packages, exception boundaries and milestone gates](../../../docs/plans/foundation-readiness.md)
- [Generated-output boundaries](../../../docs/decisions/generated-output-boundaries.md)
- [Execution ownership and cancellation](../../../docs/decisions/execution-ownership-and-cancellation.md)
- [Local observation acceptance](../../../docs/decisions/local-observation-acceptance.md)
- [Core concepts](../../../docs/core-concepts.md) and [architectural constraints](../../../docs/architectural-constraints.md)
- [Transient sessions](../../../docs/decisions/transient-analysis-sessions.md), [qualification and failures](../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md), and [identity/evidence/observation constraints](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md), [workflow](../../../dev/workflow.md), and [review procedure](../../../dev/review.md)
- [Upcoming investigation](../../../docs/plans/module-investigation.md) and its [execution/evidence boundary](../../../docs/decisions/investigator-execution-and-evidence-access.md)

## Result under review

One live policy snapshots and resolves compiler/repository output exclusions,
including aliases, missing descendants and dangling links. Opening refuses
unverifiable explicit boundaries with operational detail and no invented compiler
diagnostic; replay invalidates on changed or unverifiable boundaries. Captured
repository source-link interpretation stays separate.

The CLI compiler worker requests Git through its parent. Parent-held children,
exit monitoring and observation delivery survive worker disposal. Direct session
callers use asynchronous opening/validation/execution and await cleanup in their
calling process. Worker operations are identified, with one active operation,
settled failed sends/pending close, and rejected stale replies. Shared errors and
contracts no longer belong to a higher-level session or shell implementation.

A Git invocation has a 30-second deadline, a 250-ms graceful-termination interval
before POSIX SIGKILL, and a 2-second cleanup-reporting limit. Unconfirmed exit stays
owned and is reported separately; it is never labelled successful cleanup. Opening
timeout with confirmed cleanup gives qualified unavailable evidence. Recovery or
loss invalidates the captured basis. Existing validation phases remain intact.
The repository-input and observed-input methods advance to version 4.

The local sink groups batches by configured project and UTC date. It closes a
complete private staging file, publishes the final name with a no-overwrite hard
link, then removes staging. Acceptance commits at final-link creation; subsequent
cleanup warning is distinct from non-delivery. Existing batches remain in place.

## Verification already performed

The [M3 validation record](../../validation/foundation-readiness/2026-09-28-m3.md)
contains selected-limit rationale, method assessment, failure matrix, build
fingerprints, reproducible comparison procedure, measurements and native limits.
These are implementing-agent checks, not independent verification.

- Type check passed. Both final checkout and clean independent builds passed all
  276 tests, zero failures/skips/cancellations.
- 72 aligned M2/M3 CLI comparisons and 72 independent same-source comparisons passed.
- 288 fresh/accumulating/reversed/retained session comparisons passed.
- Native compiler control publishes and exits 0; one interrupted run publishes no
  view and actually exits 130. Git interruption tests separately observe child exit.
- Native/injected ownership and publication failures, output-boundary refusal and
  retargeting, async journey, profiler smoke and documented failure qualifications
  pass. See the validation record for exact scope and limits.

## Review focus and reproduction

1. Trace actual ownership from opening through validation, interruption, unexpected
   worker exit and disposal. Separate command rejection, child exit, worker exit
   and cleanup-reporting deadlines. Check that late results cannot publish and an
   unconfirmed resource remains owned. Review direct-session callers as well as
   both CLI entry paths; synchronous direct compiler work is not worker isolation.
2. Challenge timers and races: timeout versus exit, failed spawn versus post-spawn
   error, output overflow, stdin errors, synchronous sends, close while pending,
   duplicate/mismatched replies, and cleanup failure after status 130. Inspect the
   difference between a cleanup report timing out and actual resource termination.
3. Verify qualification and failure mappings. Confirm opening timeout can produce
   compiler-backed qualified unavailability only after exit; unconfirmed cleanup
   must not become empty/available evidence. Check unavailable-to-available and
   available-to-unavailable replay, unexpected defects, operational refusal formatting,
   pre-output withholding and post-output truthful observation.
4. Audit shared output-boundary use through compiler and repository acquisition.
   Test aliases, missing/dangling/cyclic links, nested links with `..`, native path
   spelling, outside-worktree paths, copied caller options, retargeting and duplicate
   counts. Ensure the live policy never substitutes for captured source semantics.
5. Inspect publication as a state transition: complete closed staging, native
   no-overwrite link, accepted final name, separately failing cleanup. Challenge
   ownership on failed exclusive creation, partial writes, close/link/unlink errors,
   pre-existing destinations and unsupported filesystems. Check permissions,
   project-context binding for batches without views, clock rollover and full-root
   evidence exclusion. Do not infer crash cleanup or power-loss durability.
6. Confirm the async API propagation is complete, including measurement/comparison
   scripts and fresh-process tests. Check retained serialization, primitive probes
   and ignored-ancestor lookup without losing validation phases, evidence ordering
   or tracked overrides. Review the two method-version changes and the narrowly
   aligned baseline separately from intended behavior corrections.
7. Assess compatibility with later investigation: ownership must survive disposable
   computation without implying an investigator, universal scheduler, persistent
   session, descendant supervisor or stronger evidence guarantee.

Run `npm run check` and `npm test` at the exact target. Focused tests are
`test/execution-ownership.test.ts`, `test/output-boundary.test.ts`,
`test/observation-publication.test.ts`, `test/inputs.test.ts` and existing session,
repository, shell and CLI suites. Reproduce comparison/probe commands from the
validation record using disposable build directories. Neither process IDs nor
elapsed durations belong in stable timeout evidence.

## Package and cleanup dispositions

| Package | Disposition at M3 |
| --- | --- |
| 1 | Verification implemented in M1/M2; real worker/Git/sink failure checks completed with their M3 owners. |
| 2–3 | Accepted M2 ownership/state/identity baseline, including both round-1 corrections and human-selected primary-producer classification. |
| 4 | Implemented; shared acquisition policy, parent Git ownership, async callers, protocol settlement, replay and cleanup reporting. |
| 5 | Implemented; project/date grouping, no-overwrite complete publication and truthful cleanup acknowledgement. |
| 6 | Pending M4: graph delegation and its per-operation assessment. |
| 7 | Pending M4 except C13/C16 from M2 and C14/C20 from M3. Broader indexing/scale measurements remain. |
| 8 | Pending M4: terminal layout and option grammar. |
| M5 | Pending integrated verification, measurements and final review. |

| Cleanup | Disposition |
| --- | --- |
| C01 | M2 complete: shared CLI collectors and rescued assertions. |
| C02 | M2 complete; async fixture callers retain immediately registered cleanup. |
| C03 | M2 complete; comparison worker cleanup now awaited through the async boundary. |
| C04 | Complete; native probe now follows the private compiler worker while retaining the first marker, single signal and successful control. |
| C05 | M2 complete; current comparisons retain the same strict reference-aware policy. |
| C06 | Complete: neutral operational I/O classification, with distinct capture/session translations. |
| C07 | Complete: shared platform containment and live output boundary; captured source paths stay separate. |
| C08 | Accepted M2 state/consumer matrix and explicitly composed predicates. |
| C09 | Accepted M2 immutable lookup and first-established context support. |
| C10 | Accepted M2 atomic module/expansion publication. |
| C11 | Complete: unused worker close protocol removed; parent cleanup survives worker disposal. |
| C12 | Accepted M2 validated batch reference allocation. |
| C13 | Complete in M2: retain newly created placement directly. |
| C14 | Complete: retained repository serialization and primitive probe comparison; validation phases preserved. |
| C15 | Pending M4: export maps and bounded omission accounting. |
| C16 | Complete in M2: batch-local membership sets retaining validity checks. |
| C17 | Pending M4: selected rendering qualification/context indexes. |
| C18 | Pending M4: source-detail priority ranks. |
| C19 | Pending M4: organization source-detail joins. |
| C20 | Complete: capture-local ignored-directory lookup and segment parent walk. |
| C21 | Pending M4: shared graph/containment ancestry and reachability. |
| C22 | Accepted M2 qualification policy; primary producer only as directed by human and independently reviewed. |
| C23 | Complete for current migrations: obsolete synchronous Git, duplicated boundary helpers and dead protocol removed. Repeat during later packages. |

No pending item is deferred out of task scope. No M4/M5 completion or integrated
speedup is claimed. Native verification covers macOS/local APFS only; other OS and
network-filesystem certification, automatic staging scavenging, power-loss
persistence and descendant-tree termination remain outside the stated guarantees.

## Findings return

With repository write access, use the [findings template](../../../dev/templates/review-findings.md),
identify this handoff, exact target, scope and verification, preserve your report
under `## Returned findings`, and commit only
`2026-09-28-m3-acquisition-lifetime-round-1-findings.md` in this review-series directory.
Later rounds increment the round and identify prior findings and the exact revised
target. Modify nothing else. Without repository write access, return findings to
the human for preservation through the review workflow.

Include actionable findings, relevant non-defect observations, checks actually
performed, unverified areas and residual uncertainty, with a recommendation about
M3. Do not infer human acceptance or close the task.

## Review gate

The plan explicitly requires independent review of actual acquisition/lifetime and
publication ownership and a pause before dependent work. The human determines when
M3 is satisfied. Material corrections can require further rounds under this handoff.
Implementation remains paused here; M4 and final M5 review remain outstanding.

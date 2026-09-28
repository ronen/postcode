Record type: handoff
Prepared: 2026-09-28
Task: [Foundation readiness](../../tasks/2026-09-27-foundation-readiness.md)
Review gate: M5 — integrated foundation readiness
Review target: 9f8c8bd85e94428b11abb5b415e98cebb1f50901
Baseline or diff range: `6af13629aa50d875b378bf8d0294a9fda5e356d3..9f8c8bd85e94428b11abb5b415e98cebb1f50901`
Branch: `codex/foundation-readiness`

# Foundation readiness integrated review

## Assignment and authority

Independently review the combined implementation of all eight packages in the
[approved plan](../../../docs/plans/foundation-readiness.md), including C01–C23.
The implementing agent's claims and passing checks are evidence to inspect, not
proof of correctness. This assignment concerns the complete foundation slice,
not only the latest graph/index/CLI changes.

M2 and M3 were accepted by the human after their review rounds. The human explicitly
deferred the confirmed M3 defects concerning per-directory case rules on one device
and lexical paths crossing filesystems with different case rules. Their deferral
does not claim that either defect was fixed. See the [M2 disposition](2026-09-28-m2-state-identity-disposition.md)
and [M3 disposition](2026-09-28-m3-acquisition-lifetime-disposition.md).

The implementing agent stops at this gate. The human arranges the reviewer and
transport and decides when review is sufficient. Reviewers may create the findings
record only; do not change implementation, governing material, task status or this
handoff. The active task cannot close on the implementing agent's or reviewer's
recommendation alone.

## Governing context

- [Task and preserved human decisions](../../tasks/2026-09-27-foundation-readiness.md),
  [plan and exception boundaries](../../../docs/plans/foundation-readiness.md)
- [Core concepts](../../../docs/core-concepts.md),
  [architectural constraints](../../../docs/architectural-constraints.md),
  [implementation conventions](../../../docs/implementation-conventions.md)
- Accepted [graph delegation](../../../docs/decisions/graph-kernel-delegation.md),
  [output boundaries](../../../docs/decisions/generated-output-boundaries.md),
  [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md),
  and [observation acceptance](../../../docs/decisions/local-observation-acceptance.md)
- [Transient sessions](../../../docs/decisions/transient-analysis-sessions.md),
  [qualification/evaluation constraints](../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md),
  [identity/evidence/observation constraints](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
- [Engineering guidance](../../../dev/engineering-guidelines.md),
  [review procedure](../../../dev/review.md),
  [upcoming investigation](../../../docs/plans/module-investigation.md) and its
  [execution/evidence boundary](../../../docs/decisions/investigator-execution-and-evidence-access.md)

## Reached implementation

| Package | Combined result and review emphasis |
| --- | --- |
| 1: verification | Shared collectors surface swallowed assertions; cleanup handles partial initialization; comparisons normalize reference positions only and preserve literal evidence, qualification, order, omissions and exact output. Independent graph expectations and compiler interruption controls remain active. |
| 2: immutable ownership | Store-owned immutable outcomes, frozen provider discovery, atomic root/expansion publication, validated evaluation lookup and distinct reuse/consumer predicates. Partial provider reuse depends on an explicit captured revision basis; pure derivations use stored immutable support. |
| 3: identity | Reference-aware keys preserve literal namespace-shaped text; validated compact-reference batches preserve existing bindings. Composition qualification uses the human-selected primary producer, with exact tokens rather than prefix inference. |
| 4: acquisition/lifetime | Shared live output boundary and copied options, replay without new observations, retained validation coverage, one private compiler worker for both CLI modes, parent-owned asynchronous Git processes, bounded cancellation/cleanup reporting and truthful unavailable/failure qualification. O1/O2 remain deferred. |
| 5: local publication | Project/date grouping; private staging and no-overwrite hard-link publication after close; cleanup-after-publication warnings remain distinct from non-delivery. Existing observations are preserved. |
| 6: graphs | Pinned Stately adapter delegates SCC, incremental cycle checking, ancestry and upward closure. Domain populations, every supporting claim, deterministic order and qualified roots remain local. No operation exception is taken. |
| 7: processing | Selected view/evaluation indexes, weak capture/layout path lookup, ordered provider results, export-name maps and allocation-light source excerpt counting. Original evidence order, apparent paths and validation phases remain. |
| 8: CLI | Pinned width library plus grapheme segmentation, one fit/layout calculation, visible controls and original-code-point omissions. Strict standard option scanning implements the approved grammar in one-shot and shell paths. Presentation is version 26. |

Descriptive architecture, CLI reference, implementation conventions and status
describe the current result. No foundation, development-process, durable-note or
governing-concept file was changed. The slice does not add investigator features,
persistent sessions, general parallel execution, a provider registry or a scheduler.

## Evidence and limits

The [M4/M5 validation record](../../validation/foundation-readiness/2026-09-28-m4-m5.md)
contains the full C01–C23 disposition table, dependency/license review, intentional
semantic/version differences, exact build hashes, measurements and limitations.
It links the raw 72-case graph/index comparison, 72-case final comparison and
288-case session comparison. All pass. The final type check and **294/294 tests**
pass, including prior review regressions and native failure paths. The validation
record also discloses an earlier 293/294 attempt made while the workspace changed,
its missing diagnostic evidence and the subsequent stable rerun.

Final comparison aligns only the M3 baseline's presentation token from 25 to 26;
it does not weaken comparison policy to hide output changes. Deliberate Unicode
and grammar changes have separate direct/end-to-end tests. The graph/index-only
comparison uses unaligned M3 and precedes those terminal changes. Frozen build
identities are checked before and after CLI comparisons.

Measurements compare accepted M3 with the integrated final application, using
80 modules and either 240 or 2,400 non-module artifacts, two repetitions and reversed
run order. They separately report opening, first-use requests, repeated requests,
additional validation checks, interactive delivery and real local publication.
These are descriptive local samples; do not sum earlier package gains or infer
a universal latency improvement. The measured baseline is accepted M3, not the
pre-plan application.

Native scope is the current macOS/APFS environment and Node 22.13.1 x64. The
per-device case assumption remains defective for the two deferred modeled cases;
no native mixed-volume, case-sensitive-volume, Linux or Windows result is claimed.
Inputs remain first-observed and non-atomic. Validation is not continuous.
Cancellation does not guarantee descendant-tree termination or an analysis-wide
deadline; hard-link publication does not guarantee power-loss persistence or
crash-residue scavenging. These limits remain explicit rather than being inferred
away from passing tests.

## Requested review focus and reproduction

Trace combined responsibility boundaries: failed publication must not install
false retained support; new acquisition must not overwrite old contexts; input
replay must not acquire; worker disposal must not abandon owned children; output
must not escape its validation or observation obligations. Reassess integrated
compatibility with the upcoming investigator boundary without implementing it.

For M4, inspect selected populations and all parallel graph evidence, incremental
mutation order, index lifetime and merge order, ambiguous associations, control
escaping versus stored text, UTF-16 positions versus code-point omissions, and
strict option/help precedence and shell observation outcomes. Check actual APIs
and invariants rather than relying solely on fixture coverage or an audit count.

Run from the review target with a stable workspace:

```sh
npm run check
npm test
node scripts/compare-session-requests.mjs _foundation-readiness/review-session-comparison.json
```

Do not edit repository inputs or rebuild shared output while tests that analyze
them are active. For before/after comparisons, compile the indicated revisions
into separate directories, retain the verified pins, apply only the documented
baseline presentation-token alignment, then use `scripts/compare-analysis.mjs`.
The [measurement driver](../../validation/foundation-readiness/m4-measurements.mjs)
reproduces both artifact sizes from frozen builds and writes reports to a chosen
scratch directory; run it without concurrent verification workloads.

Record findings in `2026-09-28-m5-integrated-round-1-findings.md` in this series,
identifying the exact reviewed commit, reproduced evidence, severity, uncertainties,
unperformed checks, and whether further review is recommended. Distinguish the
already deferred O1/O2 defects from new findings. The human retains the gate decision.

## Work remaining

Human-arranged integrated review, dispositions/corrections for returned findings,
and explicit human determination that M5 is sufficient remain. Only then may the
task be concluded under the task protocol. No final foundation-readiness acceptance
or task closure is asserted by this handoff.

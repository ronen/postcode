Record type: handoff

# Repository evidence checkpoint

Prepared: 2026-09-15
Task: [Implement the module organization slice](../../tasks/2026-09-15-module-organization.md)
Review gate: intermediate repository-evidence checkpoint before domain and presentation integration
Review target: `b48b47baff36f3f38f855a5391966fb484247bd7`
Baseline: `0af5595c5d130020214245cd3b8d6205e7d59449`
Diff range: `0af5595c5d130020214245cd3b8d6205e7d59449..b48b47baff36f3f38f855a5391966fb484247bd7`
Branch: `codex/module-organization`

## Review assignment and boundaries

Independently review the repository-evidence capture and pure layout derivation
implemented at the exact target above. Errors in this boundary would propagate
into every later organization entity, relationship, qualification, and snapshot.
The author therefore selected this intermediate checkpoint under the human's
explicit authorization to pause when review would materially reduce risk.

Inspect the implementation and relevant evidence. This handoff, the author's
test results, and descriptive documentation are not proof of correctness. Give
actionable findings and a recommendation on whether this boundary is ready for
integration. Distinguish defects in this implemented boundary from deliberately
remaining vertical-slice work. Do not modify implementation, governing material,
task status, or the active task record. The only authorized repository mutation
for this review is the findings record described below.

The target and baseline define implementation scope. This handoff and the later
task-progress commit supply assignment context; they are not additional code
changes under review. Further rounds may name a new exact implementation target
under this same handoff.

## Governing context

- [Approved module organization plan](../../../docs/plans/module-organization-plan.md)
- [Accepted module organization decisions](../../../docs/decisions/module-organization-decisions.md)
- [Initial module inventory decisions](../../../docs/decisions/initial-module-inventory-decisions.md)
- [Initial projection architecture decisions](../../../docs/decisions/initial-projection-architecture-decisions.md)
- [Identity, evidence, and observation constraints](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
- [Core concepts](../../../docs/core-concepts.md)
- [Architectural constraints](../../../docs/architectural-constraints.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md)
- [Implementation conventions](../../../docs/implementation-conventions.md)
- [Independent review workflow](../../../dev/review.md)

## Result under review

The internal provider captures the enclosing Git worktree's present tracked and
visible untracked artifacts, effective repository/local/global exclusion inputs,
explicit output boundaries, Git path policy, and bounded link and opaque-repository
evidence. It retains artifact kinds and source paths without reading ordinary
artifact or documentation contents. Known capture failures produce explicit
unavailability; unexpected defects propagate.

Pure derivation prepares induced regions, intrinsic segment names, direct
containment, direct artifact placements, direct README associations, and qualified
link outcomes. Internal directory links can add parents to existing regions;
repeated regions are not duplicated, and containment cycles are refused.

The prepared paths are evidence keys, not public selectors or Entity IDs. This
checkpoint deliberately does not yet connect the provider to the TypeScript
project-open lifecycle, snapshot identity, `ProgramRecordStore`, evaluation,
organization projections, group/module inspection, CLI presentation, or
observations. Existing CLI behavior remains the module-inventory product. The
provider's capture and layout method versions must enter combined snapshot
identity during the next integration stage.

## Verification already performed

The implementing agent ran:

- `npm run check`: passed.
- `npm test`: all 97 tests passed, including 20 new repository tests.
- A read-only PostCode capture/derivation smoke check with its actual build and
  observation destinations explicitly excluded: 127 artifacts, 23 regions,
  22 containment edges, and 9 direct README associations, in approximately 227 ms
  on the author's machine before the handoff was added. This is a bounded smoke
  check, not instrument validation or a performance guarantee.
- Staged whitespace/error checks and manual inspection for unintended changes,
  generated files, and sensitive content.

Real temporary Git repositories exercise ignores, tracked overrides and current
deletion, case matching, generated-output evidence, nested markers and Gitlinks,
ordinary and refused links, documentation conventions, deterministic ordering,
changed-input evidence, and separate-process repeatability. The Gitlink fixture
uses a synthetic index Gitlink rather than cloning a live submodule. Filesystem
permission failures, missing Git, byte-encoded filename refusal, buffer exhaustion,
and every concurrent mutation topology are not exhaustively exercised.

## Review focus and reproduction

1. Check current-worktree visibility against Git behavior, including ignored
   directories with tracked descendants, inactive nested ignore rules, local and
   global exclusion policy, case/Unicode path matching, deleted tracked artifacts,
   and opaque boundaries. Look for either dropped visible artifacts or leaked
   ignored contents.
2. Check that explicit output boundaries operate independently of conventional
   names and Git ignores, including links into missing or existing output. The
   link itself can remain authored evidence while excluded target existence and
   contents remain outside the provider result.
3. Check the split between filesystem capture and pure derivation, evidence needed
   by future snapshot identity, and the limited first-observed consistency claim.
   Git consumes live exclusion policy; final policy checks detect lasting changes
   but cannot detect every transient edit. No atomic snapshot is claimed.
4. Assess bounded link behavior: resolution through captured paths, dot-dot after
   redirects, proven cycles versus the 40-redirect limit, external traversal,
   opaque/ignored targets, and existing targets with unsupported exact spellings.
   Conservative refusals are explicit; assess their compatibility with the
   accepted bounded link contract before more code depends on them.
5. Check region induction, direct versus descendant containment, one placement
   per captured artifact, every direct README match, graph cycle refusal, and
   deterministic output independent of input ordering. Assess whether the
   evidence supports later apparent-path module placement without collapsing
   TypeScript module identity into filesystem identity.

From the target checkout, use:

```sh
npm run check
npm test
node --test _build/test/repository.test.js
```

The last command narrows investigation after the build performed by `npm test`.
`test/repository-probe.ts` is a verification harness, not an organization CLI.

## Known limits and remaining work

Sparse-checkout completeness remains unresolved as prescribed by the plan.
Non-UTF-8 names and oversized Git subprocess output produce unavailability.
Links leaving captured worktree paths are refused even if an external alias could
re-enter; existing targets without an exact captured spelling remain
unestablished. These qualifications must survive later record and view creation.

All domain integration, repository/project projection population, module placement
and module-presence evaluation, exact cross-kind selection, standard expansions,
human/structured presentation, source escape, observation coverage, end-to-end
acceptance fixtures, unfamiliar-repository exercise, and clean-agent instrument
validation remain within the active task after this checkpoint. Missing final
product behavior is not being represented as complete.

## Findings return

Use the review name `repository-evidence` and keep findings in this directory.
The first filename is
`YYYY-MM-DD-repository-evidence-round-1-findings.md`; subsequent rounds use
`YYYY-MM-DD-repository-evidence-round-N-findings.md`, optionally adding a reviewer
identifier before `-findings` when needed to distinguish reports.

If the reviewer has repository write access, use the
[findings template](../../../dev/templates/review-findings.md), beginning with
`Record type: findings`. Identify this handoff, reviewer, round, exact target and
baseline actually reviewed, method, verification performed, actionable findings,
non-defect observations, residual limits, and the gate recommendation. Preserve
the authored report under `## Returned findings`. In later rounds also identify
prior findings, the prior reviewed target, and the changes presented for review.
Commit only that findings record and modify nothing else.

If the reviewer cannot write to the repository, return the complete findings to
the human with the same metadata. The human can then supply the text for durable
recording under the review workflow. Do not silently replace detailed findings
with a summary.

## Review gate

Implementation is paused for the human to arrange this independent review and
return the findings and direction for continuation. In-scope corrections and
further rounds follow the existing review workflow; a reviewer recommendation
does not constitute human acceptance. Material changes to this assignment need
a new handoff, while ordinary corrections remain under this one.

This is an intermediate gate. After implementation and planned verification are
substantially complete, the implementing agent must still prepare and commit a
separate final integrated-review handoff, pause for final review rounds, and keep
the task active until the human explicitly says that the review gate is sufficient.

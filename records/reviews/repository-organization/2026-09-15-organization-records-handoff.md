Record type: handoff

# Organization records and projections checkpoint

Prepared: 2026-09-15
Task: [Implement the module organization slice](../../tasks/2026-09-15-module-organization.md)
Review gate: intermediate snapshot, record, evaluation, and projection checkpoint before presentation integration
Review target: `faa1d538c50e3d345f2e7f379064da928687683a`
Baseline: `b0501be8c287677c65bd98342d0efad0f0fcb9b8`
Diff range: `b0501be8c287677c65bd98342d0efad0f0fcb9b8..faa1d538c50e3d345f2e7f379064da928687683a`
Branch: `codex/module-organization`

## Review assignment and boundaries

Independently review the snapshot, domain-record, organization-evaluation, and
projection integration at the exact target. Every new organization view will
depend on these contracts. The implementing agent selected this intermediate
checkpoint under the human's authorization to pause when review would materially
reduce risk.

Inspect the implementation and relevant evidence rather than treating this
handoff, the author's verification, or the earlier repository-evidence reviews as
proof of correctness. Recommend whether these contracts are ready for presentation
integration. Distinguish defects in the implemented boundary from the deliberately
remaining vertical-slice work. Do not modify implementation, governing material,
task status, or the task record. Only the findings record described below is an
authorized repository mutation for this assignment.

The prior [repository-evidence handoff](2026-09-15-repository-evidence-handoff.md)
and [disposition](2026-09-15-repository-evidence-disposition.md) cover capture and
pure layout derivation. That checkpoint was accepted by the human after two
rounds. This is a new assignment for integration above that boundary, including
the small capture extension retaining invoked root spellings. Later task-progress
and handoff commits provide assignment context and are outside the implementation
diff. Subsequent rounds may name a new exact target under this handoff.

## Governing context

- [Approved module organization plan](../../../docs/plans/module-organization-plan.md)
- [Accepted module organization decisions](../../../docs/decisions/module-organization-decisions.md)
- [Initial module inventory decisions](../../../docs/decisions/initial-module-inventory-decisions.md)
- [Initial projection architecture decisions](../../../docs/decisions/initial-projection-architecture-decisions.md)
- [Qualification and evaluation constraints](../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md)
- [Identity, evidence, and observation constraints](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
- [Core concepts](../../../docs/core-concepts.md)
- [Architectural constraints](../../../docs/architectural-constraints.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md)
- [Implementation conventions](../../../docs/implementation-conventions.md)
- [Independent review workflow](../../../dev/review.md)

## Result under review

After successful TypeScript project opening, repository capture is retained and
included in snapshot identity with its input/layout methods. Ordinary repository
artifact contents remain outside capture; compiler-observed inputs retain their
existing identity role. A snapshot references its stored capture result, including
unavailability outside Git. Captured canonical and invoked roots support apparent
source-path placement without redefining compiler module identity.

Organization evaluation reads stored inputs and a stored module-evaluation basis.
It materializes group entities, qualified direct containment and artifact
placements, direct README existence associations, and module placement outcomes.
Several established placements remain distinct from candidate ambiguity. External
modules remain outside organization; project-module placement exceptions retain
reasons. Accepted directory links reuse target groups and preserve all parents.

Repository coverage and module-placement coverage are separate evaluation states.
Group properties reference a particular evaluation; incomplete placement preserves
known direct membership and leaves descendant-only/absent presence unknown.
The store validates references, group primary claims, placement shape, and the
completed-evaluation prerequisite for negative presence. Group identity and direct
layout relationships remain shared across evaluation attempts in a snapshot.

Repository/project projections select from the same records. Project selection
includes placement groups and all ancestors without rewriting retained groups'
direct relationships. Declared `group-details` expansions expose adjacent groups,
direct modules, and relationship claims. Generic organization inspection matches
group and module names together and supports precise snapshot-scoped group/module
IDs. Groups have no generated handles or path selectors. Module handles reserve
both compact-ID prefixes, with corresponding method and convention updates.

## Verification already performed

The implementing agent ran:

- `npm run check`: passed.
- `npm test`: 115 passed, zero failed, zero skipped, including 15 new organization
  tests and the existing 100 regressions.
- A read-only PostCode evaluation using its actual build/observation exclusions:
  185 modules, 30 repository groups, 7 project-selected groups, 426 organization
  claims, full repository and placement materialization, approximately 1,983 ms.
- Inspection of the implementation diff and successful unstaged/staged whitespace
  checks.

The smoke counts describe the worktree at execution, not a golden expectation
after additional artifacts are committed. These checks are implementation
verification, not independent review or instrument validation.

## Review focus and reproduction

1. Reproduce `npm run check` and `npm test`. For focused coverage, run
   `npm run build` followed by `node --test _build/test/organization.test.js`.
2. Inspect `src/lib/typescript/project.ts` for project-open ordering, evidence
   retention, relevant snapshot inputs, method versions, and continued module
   behavior when repository evidence is unavailable.
3. Inspect `src/lib/organization/records.ts`, `evaluate.ts`, and the store changes
   for domain/evidence separation, reference integrity, evaluation-specific
   properties, incomplete-state fidelity, multiple placement versus ambiguity,
   apparent-path aliases, and refusal reasons.
4. Inspect organization projection selection and expansion separately: repository
   completeness, project ancestor closure, complete direct relationships for
   selected groups, repeated names, cross-kind selector collisions, scoped IDs,
   and retained module inspection expansions.
5. Judge whether the representative `fixtures/organization/` journey, real Git/TS
   tests, and synthetic incomplete providers establish these contracts. Seek
   counterexamples beyond the author's tests.

## Known limits and remaining work

This checkpoint exposes library records and projections. It does not yet implement
organization CLI commands, qualified Unicode/JSON views, graph presentation and
pruning, group source-detail disclosure, or observations for new views. Existing
module CLI snapshots include repository inputs, while their view surface remains
the module-inventory slice. These remaining features must undergo acceptance
verification, product-instrument validation on PostCode and an unfamiliar
repository, documentation, and final integrated review.

The eager TypeScript provider does not normally produce partial/unavailable module
evaluation; these states are exercised with synthetic outcomes referencing real
captured snapshots. Candidate ambiguity is supported by the record type and store
but is not fabricated by the initial provider. Capture remains non-atomic;
sparse-checkout completeness and bounded link/path refusals retain the prior
checkpoint's qualifications. No dependencies or governing/process files changed.

## Findings return

If the reviewer has repository write access, use
[`dev/templates/review-findings.md`](../../../dev/templates/review-findings.md),
start with `Record type: findings`, and create
`records/reviews/module-organization/YYYY-MM-DD-organization-records-round-N-findings.md`
(an optional reviewer suffix may distinguish concurrent reviewers). Identify this
handoff, reviewer, round, exact reviewed target and diff scope, review method,
verification, actionable findings, non-defect observations, residual limits, and
gate recommendation. Preserve the report under `## Returned findings`. Later
rounds must also identify prior findings, prior target, and presented corrections.
Commit only that findings record and modify nothing else. If repository writing
is unavailable, return the report to the human for preservation.

## Review gate

Implementation is paused for the human to arrange independent review. Findings
and necessary corrections stay under this assignment while its scope remains
applicable. Material corrections require further review as appropriate. A clean
review is a recommendation; the human determines whether this checkpoint permits
presentation integration to proceed. This is an intermediate gate. The task must
remain active until all remaining work and final review rounds are complete and
the human explicitly says the final review gate is sufficient.

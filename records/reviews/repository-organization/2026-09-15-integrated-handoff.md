Record type: handoff

# Module organization integrated review

Prepared: 2026-09-15
Task: [Implement the module organization slice](../../tasks/2026-09-15-module-organization.md)
Review gate: final integrated review before human acceptance and task closure
Review target: `4c95fd090c72a53358eb5d0e76c23ae896d5af8a`
Baseline: `0af5595c5d130020214245cd3b8d6205e7d59449`
Diff range: `0af5595c5d130020214245cd3b8d6205e7d59449..4c95fd090c72a53358eb5d0e76c23ae896d5af8a`
Branch: `codex/module-organization`

## Review assignment and boundaries

Independently review the complete implemented module-organization slice against
the approved plan and governing material. Implementation and planned verification
are substantially complete; the human explicitly requires one or more final
review rounds before closure. Inspect the code and relevant evidence rather than
treating this handoff, author checks, instrument impressions, or earlier reviews
as proof of correctness. Return actionable findings, residual limits, and a
recommendation for the final gate. The human retains its acceptance decision.

This is an integrated assignment across capture, identity, domain records,
evaluation, projections, views, navigation, source escape, and observations.
Earlier evidence and records checkpoints are accepted and provide context:

- [Repository evidence handoff](2026-09-15-repository-evidence-handoff.md) and
  [disposition](2026-09-15-repository-evidence-disposition.md), after two rounds.
- [Organization records handoff](2026-09-15-organization-records-handoff.md),
  [findings](2026-09-15-organization-records-round-1-findings.md), and
  [disposition](2026-09-15-organization-records-disposition.md). The human delegated
  the need for further review at that checkpoint; the author accepted it after
  bounded corrections and verification.

Do not modify implementation, governing material, task status, or the task record.
Only the findings record described below is an authorized repository mutation.
The immutable target and baseline define implementation scope. The later
task-verification commit and this handoff provide assignment context without
adding code to that scope. Subsequent rounds may identify a new exact target
under this handoff while its assignment remains applicable.

## Governing context

- [Approved module organization plan](../../../docs/plans/module-organization-plan.md)
- [Accepted module organization decisions](../../../docs/decisions/module-organization-decisions.md)
- [Core concepts](../../../docs/core-concepts.md)
- [Architectural constraints](../../../docs/architectural-constraints.md)
- [Adopted product design](../../../foundation/product-design.md)
- [Initial module inventory decisions](../../../docs/decisions/initial-module-inventory-decisions.md)
- [Initial projection architecture decisions](../../../docs/decisions/initial-projection-architecture-decisions.md)
- [Qualification and evaluation constraints](../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md)
- [Identity, evidence, and observation constraints](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
- [Initial observation decisions](../../../docs/decisions/initial-observation-recording-decisions.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md)
- [Implementation conventions](../../../docs/implementation-conventions.md)
- [Review workflow](../../../dev/review.md)
- [Implemented architecture](../../../docs/architecture/README.md)
- [Command reference](../../../docs/cli-reference.md)

## Integrated result

The CLI opens one configured TypeScript project before capturing the enclosing
Git worktree. Repository evidence and prepared layout participate in snapshot
identity and remain stored for subsequent evaluation and presentation. Visibility,
tracked overrides, current deletion, explicit output boundaries, environmental
exclusions, opaque repositories, and bounded link outcomes retain qualifications.
README-named opaque boundaries remain unanalyzed rather than documented, and
invoked root aliases are verified against the actual worktree root.

Group entities and direct relationships remain shared within a snapshot.
Repository and module-placement evaluation coverage are independent; partial or
unavailable placement retains usable facts without establishing false absence.
Established multiple placements differ from candidate ambiguity. The store
validates references, group primary claims, placement shape, and negative-presence
evaluation prerequisites. Program records remain separate from observations.

`organization project` selects project-module groups and ancestor context;
`organization repository` selects the full group population. Generic inspection
matches group/module names together or navigates precisely with a scoped Entity
ID. Groups have intrinsic segment names, no handles/path selectors, and an unnamed
root displayed contextually. Module handles retain generated provenance.

The presentation declares its requirements before evaluation. Unicode and JSON
consume stored information; rendering takes only a qualified view. Project views
label context groups, disclose pruning, and preserve their reachability. Shared
groups expand once. Group inspection lists all direct parents, subgroups, and
modules with IDs, documentation availability, and bounded other-artifact counts.
Placement exceptions distinguish established locations, candidates, and unavailable
or unplaced outcomes. Display omissions remain distinct from analysis coverage.

Group source escape exposes captured paths and artifact/link metadata without
contents. Existing module detail is retained for module-only or mixed inspection.
Observations record request, analysis scope, exact view/output, and the applicable
source level. The recorded repository root comes from captured evidence rather
than a second live lookup. Existing operational failure and sink-warning behavior
remain available.

## Verification already performed

The implementing agent ran `npm run check` and `npm test` at the final code state:
127 tests passed, zero failed or skipped. The code and staged diff were inspected;
whitespace checks passed. The new integrated tests exercise:

- representative repository/project populations and full direct relationships;
- group/subgroup/module navigation using a common snapshot;
- mixed names, current/stale IDs, and generated-handle provenance;
- captured source detail with no group/documentation contents;
- source-escape levels, recorded output, and visible sink rejection;
- unavailable repository, invalid project, and synthetic partial evaluation;
- repeated groups, depth/group/module bounds, and complete direct inspection;
- cross-process deterministic output and terminal control escaping; and
- candidate ambiguity with partial status and reachable candidate groups.

Earlier tests retain coverage of capture boundaries, source alias identities,
multiple placements, sparse/ignore qualifications, input identity, record-store
invariants, and legacy module behavior.

Bounded instrument evaluation used PostCode and public `microsoft/tsyringe` at
`78222334f49265ea2874fac2c73284345c1124d9`. The external root configuration received
only `compilerOptions.ignoreDeprecations = "6.0"` to open with the bundled
compiler; source selection was unchanged, no dependencies were installed, and
target code was not executed. Two clean subagents received only one qualified
Unicode view each and the same five comprehension/navigation questions. They
identified scope and membership correctly, selected justified next groups with
full snapshot requirements, and retained documentation/placement limitations.
Their wording feedback produced explicit context-group labels and a scoped
repository-layout relationship-count label, which both confirmed on rereading.
These responses are interpretations, not independent implementation verification.

A five-invocation journey on each repository checked project Unicode, full
repository JSON, chosen group source detail, root README-path detail, and direct
module inspection, including exact scope and observation equality. The detailed
task verification records counts, context, and local artifact names. Raw views
and responses remain ignored under `_build/` and are not committed. They were
captured during integration before the final method/metadata and command
construction refinements; the final automated suite covers those refinements.

## Review focus and reproduction

1. Run `npm ci` if necessary, `npm run check`, and `npm test`. Focused entry points
   after building are `test/repository.test.ts`, `test/organization.test.ts`, and
   `test/organization-cli.test.ts` through their `_build/test/` counterparts.
2. Follow the smallest representative journey from the plan. Tests copy
   `fixtures/organization/` into a temporary Git worktree so its repository
   population is independent of PostCode's enclosing worktree. Exercise both
   subjects, inspect the documented group, navigate to child and module, and
   request source detail without README contents.
3. Inspect lifecycle and snapshot consistency across lenses: project-open
   prerequisite, relevant inputs/methods, first-observed reuse, explicit output
   exclusion, and no analysis or filesystem reads during presentation.
4. Assess evidence-to-claim fidelity and incomplete-state handling, including
   candidate ambiguity, established multiple placements, unplaced/external
   distinctions, root aliases, opaque README boundaries, and group properties.
5. Review selection, expansion, and display separately. Confirm that complete
   direct relationships survive project selection, unrequested adjacent details
   cannot be read as absence, IDs remain precise, and every consequential pruning
   or omission is visible.
6. Review Unicode and structured products together: conceptual disclosure,
   generated labels/provenance, exact source-escape levels, control escaping,
   navigation command construction, observation context, and non-blocking sink
   failures. Inspect the user-facing documentation for overclaims.
7. Assess the measured latency limitation below and whether the accumulated
   evidence is sufficient for the final gate. Seek counterexamples beyond the
   author's checks and the earlier reviewers' scope.

## Residual limits

The local five-fresh-invocation journey took approximately 420 seconds on
PostCode, compared with 2.8 seconds on tsyringe. This is a material usability
limitation, documented in the command reference. No phase-level profiling was
performed, so this handoff does not attribute the cost to a particular component.
Every invocation evaluates afresh; no caching or weakened discovery policy was
introduced. Timing is environment-specific and is not a performance guarantee.

Capture remains first-observed and non-atomic, with unresolved sparse-checkout
completeness and explicit bounded link/path refusals. Partial/unavailable module
providers and candidate ambiguity are exercised synthetically because the eager
initial provider does not normally produce those outcomes. Experimental schemas
are not persistence contracts. The instrument exercise is bounded and does not
establish general usability or completeness. No dependency-role, architectural
intent, documentation-content, or multi-project analysis is added.

## Findings return

With repository write access, use
[`dev/templates/review-findings.md`](../../../dev/templates/review-findings.md),
start with `Record type: findings`, and create
`records/reviews/module-organization/YYYY-MM-DD-integrated-round-N-findings.md`
(optionally include a reviewer suffix for concurrent reviewers). Identify this
handoff, reviewer, round, exact reviewed target and scope, method, verification,
actionable findings, non-defect observations, residual limits, and final-gate
recommendation. Preserve the report under `## Returned findings`. Later rounds
must identify prior findings, prior reviewed target, and presented corrections.
Commit only that findings record and modify nothing else. Without repository
write access, return the findings to the human for preservation.

## Final gate

The implementing agent is paused for the human to arrange final independent
review. Findings and corrections may require further rounds under this assignment.
The task remains active. A reviewer recommendation does not close the gate: the
human must explicitly say that the accumulated final review is sufficient before
the task may be concluded.

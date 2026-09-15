Record type: findings

# Module organization integrated review: round 1

Received: 2026-09-15
Reviewer: Independent review (Claude Sonnet 5, interactive session)
Handoff: [2026-09-15 integrated handoff](2026-09-15-integrated-handoff.md)
Round: 1
Reviewed target: `4c95fd090c72a53358eb5d0e76c23ae896d5af8a`

## Returned findings

### Scope and method

Reviewed the complete diff `0af5595c5d130020214245cd3b8d6205e7d59449..4c95fd090c72a53358eb5d0e76c23ae896d5af8a`
against the approved [module organization plan](../../../docs/plans/module-organization-plan.md),
the accepted [module organization decisions](../../../docs/decisions/module-organization-decisions.md),
[core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md),
[implementation conventions](../../../docs/implementation-conventions.md), [engineering guidelines](../../../dev/engineering-guidelines.md),
and the implemented-architecture, CLI-reference, README, and STATUS documentation changes in scope.

Two areas of this diff (`src/lib/repository/*`, `src/lib/organization/{records,evaluate,projections}.ts`) already
received two independent review rounds (repository evidence) and one independent review round (organization
records/projections) under earlier handoffs in this series, with accepted corrections in
`ae09e427acae3ce3e112081ed270f0fbe5f965d8` and `f46b513008f58723486363286371052328211a6d`. I re-read those
files in full, independently re-verified both corrections against their described defects rather than trusting
the dispositions, and hand-traced representative scenarios myself, but concentrated the deepest new scrutiny on
`src/lib/organization/presentation.ts`, the `cli.ts`/`memory-store.ts`/`identity.ts`/`observations.ts`/
`typescript/project.ts` integration changes, and `test/organization-cli.test.ts` — the material in this diff that
had not previously been independently reviewed at all (everything from the final "Deliver organization views,
scoped inspection, and observations" commit).

Did not treat the handoff's verification counts, the accepted intermediate dispositions, or the round-1
organization-records findings as proof of this integration's correctness; verified independently as described
below.

### Verification performed

- `npm ci`, `npm run check` (clean), `npm test`: 127/127 passed, 0 failed/skipped, matching the handoff.
- `npm run build`, then manually drove the CLI (not the authored test suite) through the plan's smallest
  representative investigation using a fresh copy of `fixtures/organization/` in a scratch Git worktree:
  `organization repository`, `organization project`, `inspect` on the documented `src` group, navigation to
  its `child` subgroup and direct module by displayed Entity ID, and `--source-detail` on `src`. Confirmed by
  direct inspection of stdout (not just assertions) that: group/module annotations, direct/descendant/none
  presence, documentation-count, parent/subgroup/module Entity IDs, and source detail (paths and artifact kind
  only, no README content, no leaked absolute checkout path in JSON) all matched the plan's success criteria
  exactly.
- Manually reproduced the "opened project outside a Git worktree" boundary against the CLI directly (not only
  via the authored test): `organization repository` renders an explicit `unavailable`/`not-in-worktree`
  evaluation with both project modules reported as placement exceptions with reason `repository-unavailable`,
  and a same-selector `inspect` call correctly falls back to the existing plain module-only view
  (`postcode-view/0-experimental`) rather than attempting to construct an organization view over unavailable
  evidence.
- Independently re-verified both corrections from `f46b513` against their originally reported defects:
  - Re-read `src/lib/repository/layout.ts`'s `documentation` predicate
    (`!artifact.boundary && /^README(?:\.[\s\S]*)?$/...`) and confirmed it is applied uniformly to every
    artifact, including a `git-marker` nested-repository literally named `README` and a `gitlink` submodule
    literally named `README.submodule` (both exercised in `test/organization.test.ts`'s
    `opaque README boundaries...` test); the store never receives a `group-documentation` claim for either.
  - Re-derived the corrected root-alias walk in `src/lib/repository/capture.ts` by hand for the case the
    round-1 organization-records reviewer flagged as unexercised (a symlink at a segment other than the
    outermost/leaf of the invoked path). The new algorithm walks `ancestor` upward from `base` one directory at
    a time and tests `realpathSync(ancestor) === root` at each step, rather than computing a fixed hop count
    from the lexical/real path segment-length difference. This is correct for an arbitrary number of
    intervening real (non-symlink) directories between the invoked path and the aliasing segment, not only the
    single-hop case the new regression test (`intermediate invocation links do not invent worktree-root
    aliases...`) exercises — the fix is structurally general, not merely tailored to the added test.
- Hand-traced `src/lib/organization/presentation.ts`'s tree-construction loop (`createOrganizationView`'s
  `pending`/`seen`/`rows` walk) against the "shared groups expand once," "project selection does not filter a
  retained group's complete direct relationships," and "consequential pruning must remain visible" decisions:
  - Confirmed every project-selected group has at most one selected parent path missing (i.e., is reachable
    from a "root" with no selected parent) and that containment is acyclic (enforced upstream by
    `deriveLayout`), so every selected group is guaranteed to be visited or referenced exactly once by this
    single-pass DFS; there is no path by which a selected group could be silently dropped from `rows`.
  - Confirmed context-only adjacent groups (outside the project's module population but pulled in by the
    `group-details` expansion) always have `detail: 'not-requested'` with correctly empty relationship arrays,
    matching the documented contract in `docs/cli-reference.md` ("Its adjacent group summaries have
    `detail: "not-requested"`; their empty detail arrays are not claims of absent relationships"), and that the
    DFS never descends into such a group's (empty, undisclosed) subgroups because it is unconditionally marked
    `pruned: 'outside-project'` for the `configured-project` subject.
  - Confirmed the `omittedSelectedGroups`/`prunedGroups`/`repeatedGroupReferences`/`omittedModulePlacements`
    counters are each incremented on exactly the code paths that skip or truncate display, including the
    150-group cap's `continue` branch, which bypasses `rows.push` entirely and is separately accounted for via
    `projection.groups.filter(id => !seen.has(id))`.
- Hand-traced the `cli.ts` `moduleOnly` branch (deciding between the plain module view and the organization
  view for `inspect`) against `docs/architecture/README.md`'s "Module-only inspection reuses the existing
  qualified module view; mixed matches are sectioned by kind and retain that module view as embedded detail":
  confirmed the four cases (group-only match, module-only match, mixed match, no match) each route to the
  documented rendering path, including the `organizationOutcome!.groups.length === 0` disjunct that forces the
  plain-module fallback when repository organization is entirely unavailable or empty (verified manually above).
- Investigated the plan's residual latency limitation independently rather than accepting the handoff's framing.
  Timed `node _build/src/cli.js modules --project tsconfig.json --json` and
  `organization repository --project tsconfig.json --json` on PostCode's own checkout: both took ~38 seconds.
  To determine whether this diff introduced a new cost to the pre-existing `modules` command (which now always
  captures repository evidence for snapshot identity, even when organization is not requested), I built a
  separate detached worktree at the baseline commit `0af5595` (before any repository capture existed) and timed
  the identical `modules --json` invocation there: also ~38 seconds (37.9s baseline vs. 37.9–38.7s at target).
  The added repository capture is not a material additional cost on this repository; the pre-existing cost is
  TypeScript analysis of PostCode's own large program, not this slice's git enumeration. The handoff's framing
  ("costly even for an organization view," explicitly not attributing cost to a component) is accurate and not
  an overclaim.
- Read `README.md`, `STATUS.md`, `docs/architecture/README.md`, and `docs/cli-reference.md` diffs against the
  traced code behavior above; found no overclaim beyond the one documentation-precision nit noted below.
- Confirmed no changes to `package.json`/`package-lock.json`, `dev/engineering-guidelines.md`,
  `docs/core-concepts.md`, `docs/architectural-constraints.md`, `docs/decisions/`, or `foundation/` are in
  scope, consistent with the task's stated boundaries.

### Actionable findings

1. **A new implementation-conventions cross-reference omits its decision anchor and uses a heading that does
   not exist.** `docs/implementation-conventions.md`'s new bullet under "Selection and navigation references"
   ends with `[[Group identity and navigation](decisions/module-organization-decisions.md)]` — a bare link to
   the whole decisions file, with no `#anchor` fragment, and link text ("Group identity and navigation") that
   does not match any heading in that document. Every other bracketed cross-reference in the same file and
   section links to a specific decision heading's anchor (for example, the immediately adjacent
   `[[Snapshot-scoped references](decisions/initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped)]`
   appearing twice around it). The applicable decision is "Represent groups and placement with qualified
   identities and relationships" in `docs/decisions/module-organization-decisions.md`. Severity is low: it is a
   documentation-navigability defect only, with no effect on behavior, and the surrounding prose is itself
   accurate. Suggested fix: change the link to
   `[[Represent groups and placement with qualified identities and relationships](decisions/module-organization-decisions.md#represent-groups-and-placement-with-qualified-identities-and-relationships)]`,
   matching the file's established convention.

### Non-defect observations

- The `modules` lens's snapshot now always includes captured repository evidence (`SnapshotRecord.repository`),
  even when only `modules` is requested, so a plain `modules` invocation on a large repository pays the same
  repository-capture cost as an `organization` invocation. This is a deliberate, disclosed design choice (the
  architecture document states "Repository inputs contribute to snapshots across the module and organization
  CLI surfaces") that keeps snapshot identity uniform across lenses so a `modules` view and a later
  `organization` view over the same state share one snapshot ID for cross-lens navigation. As measured above,
  it is not a material additional cost on PostCode's own repository, where TypeScript analysis dominates; it
  could matter more on a repository with a very large, non-ignored worktree artifact population and a cheap
  TypeScript program, which the accumulated instrument evidence does not exercise. Not raised as an actionable
  finding because it is an explicit, in-scope implementation choice with a stated rationale, not an
  unacknowledged regression.
- `cli.ts`'s `moduleOnly` fallback path (plain module-only view when `inspect` matches no group) is exercised
  indirectly by `test/organization.test.ts` at the `inspectOrganization`/`createOrganizationView` level for the
  "outside Git worktree" scenario, but I did not find a `test/organization-cli.test.ts` case that drives that
  exact fallback through `runCli` end-to-end (only the `organization repository` CLI path is tested for
  repository-unavailable). I exercised it manually against the built CLI (see Verification performed) and it
  behaved correctly; noting the gap for completeness rather than as a defect, since the underlying behavior is
  correct and unit-tested at the layer below the CLI wiring.
- `README.md`'s new "Organization" section refers to the "experimental `postcode-organization-view/0` JSON
  schema," omitting the `-experimental` suffix that is actually part of the literal schema string
  (`postcode-organization-view/0-experimental`, as used precisely in `docs/cli-reference.md` and
  `docs/implementation-conventions.md`). This exactly mirrors the pre-existing Slice 1 convention already in
  `README.md`'s prose before this diff (which likewise referred to "the experimental `postcode-view/0`... JSON
  presentation" without the suffix, while `docs/cli-reference.md` used the full literal `postcode-view/0-experimental`
  for the same schema). Since this diff is following an established, pre-existing documentation style rather
  than introducing a new inconsistency, I am not raising it as an actionable finding.
- I did not independently repeat the bounded instrument validation on PostCode or `tsyringe`, or run a second
  unfamiliar external repository. I instead relied on my own fixture-level reproduction of the representative
  journey directly against the built CLI (not only the authored tests) and my own hand-tracing of the
  presentation/selection/expansion logic against the governing decisions, which is a different kind of
  evidence than clean-agent comprehension but exercises the same code paths the instrument validation depends
  on. The handoff's own framing of the instrument evidence as "interpretations, not independent implementation
  verification" is accurate and I did not find reason to doubt the counts it reports.

### Residual limits / unverified areas

- Did not re-run the bounded instrument validation (fresh subagents against PostCode and `tsyringe`); relied on
  the handoff's disclosed, appropriately qualified account of that evidence.
- Did not exercise a real Git submodule (only the existing synthetic gitlink/`.git`-marker fixtures), consistent
  with the plan's later-stage validation scope and the prior repository-evidence rounds' stated scope.
- Did not construct a repository with a very large non-ignored artifact population and a cheap TypeScript
  program to test whether the now-uniform repository-capture cost (see non-defect observations) becomes
  material relative to compilation cost in that regime; PostCode's own repository does not distinguish this
  because its TypeScript analysis cost already dominates.
- Sparse-checkout completeness, transient-concurrent-edit exposure, and the general bounded-link-topology scope
  remain the same disclosed, deliberately out-of-scope limitations verified by the two prior repository-evidence
  review rounds; I did not find new counterexamples to them.

### Recommendation

The integrated implementation is well-aligned with the approved plan and accepted decisions across capture,
records, evaluation, projections, presentation, CLI integration, and observations. Automated verification
reproduces cleanly (`npm run check`; `npm test` 127/127), my own independent reproduction of the plan's smallest
representative investigation against the built CLI matches its success criteria exactly, both prior corrections
(opaque-boundary documentation, invoked-root-alias verification) are correctly implemented and, on my own
hand-tracing, generalize beyond their specific regression tests, and my deep review of the previously
unreviewed presentation/CLI/observation layer found no functional defects. I found one confirmed, cosmetic,
very-low-severity documentation-navigability finding (a missing decision anchor) that does not affect behavior
and does not need to block closure, though it is easy to fix. I did not find a counterexample that undermines
the disclosed latency limitation's framing; my own measurement supports it being a pre-existing, disclosed,
environment-specific characteristic rather than a newly introduced or misattributed regression. In my judgment,
the accumulated evidence — this round together with the two prior repository-evidence rounds and the one prior
organization-records round, each with accepted corrections re-verified here — is sufficient for the final
review gate, contingent on the human's own explicit acceptance as required by the task's governing workflow.
This recommendation is input to the task, not an acceptance decision; the human retains the review-gate
conclusion.

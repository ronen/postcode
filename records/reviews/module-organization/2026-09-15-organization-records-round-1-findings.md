Record type: findings
Received: 2026-09-15
Reviewer: Independent review (Claude Sonnet 5, interactive session)
Handoff: [2026-09-15 organization records and projections handoff](2026-09-15-organization-records-handoff.md)
Round: 1
Reviewed target: `faa1d538c50e3d345f2e7f379064da928687683a`

## Returned findings

### Scope and method

Reviewed the diff `b0501be8c287677c65bd98342d0efad0f0fcb9b8..faa1d538c50e3d345f2e7f379064da928687683a`
against the approved [module organization plan](../../../docs/plans/module-organization-plan.md),
the accepted [module organization decisions](../../../docs/decisions/module-organization-decisions.md),
the [initial module inventory decisions](../../../docs/decisions/initial-module-inventory-decisions.md),
the [initial projection architecture decisions](../../../docs/decisions/initial-projection-architecture-decisions.md),
the [qualification/evaluation](../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md) and
[identity/evidence/observation](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
constraints, [core concepts](../../../docs/core-concepts.md), and
[architectural constraints](../../../docs/architectural-constraints.md).

Read `src/lib/typescript/project.ts`, `src/lib/organization/records.ts`,
`src/lib/organization/evaluate.ts`, `src/lib/organization/projections.ts`,
`src/lib/memory-store.ts`, `src/lib/identity.ts`, `src/lib/records.ts`, the
repository-evidence files touched in this diff (`capture.ts`, `evidence.ts`),
and `test/organization.test.ts` in full, plus the unchanged `src/lib/repository/layout.ts`
and `src/lib/projections.ts` for context the new code depends on. Hand-traced
the placement/ancestor-closure/expansion/selector-collision logic in
`evaluate.ts` and `projections.ts` against the decisions above for scenarios
beyond the author's own tests, including several not exercised by the suite,
before running anything. Did not treat the handoff's verification counts, the
prior repository-evidence rounds, or the disposition's acceptance as proof of
this integration's correctness.

### Verification performed

- Checked out the exact reviewed target `faa1d53` into a separate detached
  worktree (`git worktree add ... faa1d53 --detach`) and ran `npm ci` there,
  independent of the working tree's later handoff/task-progress commits.
- `npm run check`: passed, no diagnostics.
- `npm test`: 115/115 passed, 0 failed, 0 skipped, matching the handoff's
  count; independently confirmed 15 tests in `test/organization.test.ts`
  (`grep -c '^test('`) and 15 matching `ok` lines for that file specifically.
- `npm run build` followed by `node --test _build/test/organization.test.js`:
  15/15 passed, reproducing the focused organization coverage called out in
  the handoff's review focus.
- Hand-traced `evaluate.ts`'s `locate()` against every symlink/link fixture in
  `test/organization.test.ts` (nested directory-link traversal, cyclic
  containment via `src/up -> ..`, directory alias sharing, file-link modules)
  by working through `deriveLayout`'s `reaches`/cycle logic and
  `resolveLink`'s absolute-target handling together, not just reading the
  assertions. All traced outcomes matched what the tests assert.
- Hand-traced `projections.ts`'s `selected-entities` branch (precise ID,
  compact group ID with/without `--snapshot`, compact module ID, stale
  snapshot, and cross-kind exact-name collisions) against
  `implementation-conventions.md`'s selection/navigation conventions and
  against Slice 1's `src/lib/projections.ts`, which uses the same
  unconditional `snapshot-mismatch` short-circuit for a name-based selector
  paired with an explicitly wrong `--snapshot` — confirmed this is established
  Slice 1 precedent, not a new regression introduced by the organization
  integration.
- Hand-traced the `group-details` standard-expansion mechanism (adjacent
  parent/subgroup/module pull-in for `inspect`, and its redundancy for
  `organization(repository)`/`organization(project)` since those subjects
  already include complete direct relationships unconditionally through core
  claim selection) against the "Provide repository- and project-subject
  organization projections" decision's consequence that a project view must
  not have its retained groups' direct relationships rewritten or filtered.
- Hand-traced the `MemoryProgramRecordStore` validation added for `group`,
  `group-containment`, `artifact-placement`, `group-documentation`,
  `module-placement`, `group-properties`, `organization-evaluation`, and
  `organization-projection`, including the negative-module-presence guard
  (`descendant-only`/`none` requiring `placement.execution === 'completed' &&
  placement.materialization === 'full'`, `direct` exempt) against the plan's
  "incomplete placement preserves known direct membership and leaves
  descendant-only/absent presence unknown" requirement. Confirmed the guard
  is reachable and correctly ordered relative to the generic
  reference-existence check that runs before it in the same `put()` pass.
- Wrote and ran an independent probe (not part of the author's suite) against
  the built target to test a scenario the fixtures do not cover: an opaque
  Git nested-repository boundary artifact named `README`. See finding 1.
- Read the `STATUS.md` and `docs/architecture/README.md` diffs against the
  actual code behavior traced above; found no overclaim — the prose describes
  exactly what the store/evaluator/projections do and do not yet do (no CLI,
  no presentation, no observation integration, candidate ambiguity
  representable but not produced).
- Confirmed `fixtures/organization/` matches the plan's "smallest
  representative investigation": a documented group (`src`, direct module
  plus a subgroup), a project module directly inside that subgroup
  (`src/child/module.ts`), and sibling groups with documentation-only
  (`manual`) and unanalyzed-artifact-only (`data`) content and no project
  module.

### Actionable findings

1. **Opaque boundary artifacts can be misclassified as group documentation.**
   `src/lib/organization/evaluate.ts`'s artifact-placement loop
   (`for (const placement of layout?.placements ?? [])`) adds a
   `group-documentation` claim whenever `placement.documentation` is true,
   with no check on the artifact's `kind`/`boundary`. `placement.documentation`
   (computed in the unchanged `src/lib/repository/layout.ts`) is set purely by
   a filename regex (`/^README(?:\.[\s\S]*)?$/`) applied to every captured
   artifact, including Git submodules and nested repositories, which capture
   deliberately leaves opaque and unanalyzed (`RepositoryArtifact.boundary`).
   Module placement in the same file (`locate()`) explicitly refuses to treat
   a boundary artifact as an ordinary placement (`if (artifact.boundary)
   return { reason: 'opaque-boundary' }`), but the documentation path has no
   equivalent exclusion, so the two claim families disagree about what an
   opaque boundary artifact means within the same evaluation.

   Confirmed empirically: a directory named `README` containing a `.git`
   marker (captured as `kind: 'nested-repository', boundary: { basis:
   'git-marker', ... }`) produces one `group-documentation` claim referencing
   that artifact, asserting direct documentation exists at a path where
   PostCode has explicitly not looked at any content and does not know one
   exists. This contradicts the "Recognize direct group documentation without
   interpreting it" decision's basis for the claim (an actual retained
   artifact whose association "establishes... documentation existence") and
   the "opaque, unanalyzed boundary artifact" treatment adopted for
   submodules/nested repositories.

   Severity is low: it requires a submodule or nested repository literally
   named `README` or `README.*`, which is an unusual naming choice and not
   expected in PostCode's own repository or ordinary unfamiliar repositories.
   It does not affect snapshot identity, module placement, group population,
   or ancestor closure — only a documentation-availability annotation for the
   rare group containing such a boundary. Suggested fix: exclude artifacts
   with a `boundary` from the documentation match, either in `deriveLayout`
   (`src/lib/repository/layout.ts`, which is outside this diff but is the
   root cause) or in the consuming loop in `evaluate.ts` before asserting
   `group-documentation`.

### Non-defect observations

- The `group-details` standard expansion is a no-op for `organization(repository)`
  and `organization(project)`: their complete direct relationships (own
  `group`/`group-properties`/`artifact-placement`/`group-documentation`/
  `group-containment` claims for every selected group, and every non-external
  module's own `module-placement` claim) are already included unconditionally
  through the core `selectedClaims` filter, independent of whether
  `group-details` was requested. The expansion is only consequential for
  `inspect` (`selected-entities`), where `selected` is a small precise subset
  and the expansion pulls in adjacent, not-otherwise-selected entities. This
  matches the plan's requirement that project/repository selection must not
  filter away a retained group's complete direct relationships, so it is
  correct behavior, not a defect — worth naming only because it means
  `requested: []` genuinely changes nothing observable for the non-inspect
  subjects in the current test, which could look like an oversight without
  tracing why.
- `ModulePlacementClaim.information.materialization` is typed to allow
  `'partial'`, but the real evaluator only ever assigns `'full'` or `'none'`
  to an individual claim; `'partial'` is reachable only through
  synthetically constructed test records (as the "record boundary rejects
  malformed placement outcomes..." test does for the `ambiguous` case). This
  mirrors the already-accepted "candidate ambiguity is representable but not
  produced by the initial provider" pattern and is consistent, not a gap.
- The new invoked-root-spelling heuristic in `captureRepository`
  (`src/lib/repository/capture.ts`) derives `invokedRoot` by walking up from
  the lexical `base` path the same number of segments that separate the
  *real* root from the *real* `base` (`path.relative(root,
  realpathSync(base))`). This assumes the lexical and real path segment
  counts agree, which can diverge if a symlink sits partway through the
  invoked path rather than only at its outermost segment (for example, an
  intermediate directory in the invoked path, not just the leaf, is a
  symlink). No fixture exercises an intermediate-segment symlink in the
  invoked path; the existing invoked-alias fixture (from the prior
  repository-evidence round) only aliases the whole worktree in one hop. This
  is within the plan's explicitly bounded "safety, not general link-topology
  subsystem" scope, so I am not raising it as an actionable finding, but it
  is a real, undisclosed edge case in the new extension specifically (as
  opposed to the already-reviewed capture/layout boundary), so I note it here
  for the record.

### Residual limits / unverified areas

- Did not repeat the handoff's read-only PostCode self-evaluation (185
  modules, 30 groups, ~1,983 ms) or run against an unfamiliar external
  repository; the handoff correctly labels these as author verification, not
  independent review, and the plan defers full product/CLI instrument
  validation to a later checkpoint. I relied on my own fixture-level and
  hand-traced verification instead.
- Did not exercise a real Git submodule (only the synthetic gitlink/`.git`-marker
  fixtures already used by the existing suite and my own probe), consistent
  with the plan's later-stage validation scope.
- Did not review CLI wiring, Unicode/JSON presentation, group source detail,
  or observation integration, since the handoff and `docs/architecture/README.md`
  both correctly state these are not yet implemented at this checkpoint.

### Recommendation

The snapshot/record/evaluation/projection integration is well-aligned with
the governing plan and decisions. Automated verification reproduces cleanly
(`npm run check`; `npm test` 115/115 including the 15 new organization tests;
the focused build/test run), and my own independent tracing of placement,
ancestor closure, standard expansion, and cross-kind selector collision logic
against the accepted decisions found it correct for every scenario traced,
including several the author's tests do not cover. I found one confirmed,
low-severity, narrow-scope actionable finding (opaque boundary artifacts
misrecognized as group documentation when literally named `README`) that
should be corrected, but it does not touch snapshot identity, module
placement, or projection population, and in my judgment does not block this
checkpoint's use as a foundation for presentation integration. I recommend
fixing it promptly (a small, well-scoped change) rather than treating it as
gating. This recommendation is input to the task, not an acceptance decision;
the human retains the review-gate conclusion.

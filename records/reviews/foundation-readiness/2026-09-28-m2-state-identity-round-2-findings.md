# Foundation readiness M2 state/identity review: round 2 findings

Record type: findings
Received: 2026-09-28
Reviewer: Claude Code (Claude Opus 5.5), independent agent session arranged by the human
Handoff: [2026-09-27-m2-state-identity-handoff.md](2026-09-27-m2-state-identity-handoff.md)
Round: 2
Reviewed target: `d84b102102f5abbd851d1a0bd9221f1e9b2f9018` (corrections `0037eaff2d7dcd17fdb9186bed8511011f1eb9b6..d84b102102f5abbd851d1a0bd9221f1e9b2f9018`)
Prior findings: [2026-09-27-m2-state-identity-round-1-findings.md](2026-09-27-m2-state-identity-round-1-findings.md)
Prior reviewed target: `0037eaff2d7dcd17fdb9186bed8511011f1eb9b6`

## Returned findings

### Scope and method

This round reviewed the corrections for round-1 findings F1 and F2. It also reviewed
the human-directed primary-producer composition policy. The
[disposition](2026-09-28-m2-state-identity-disposition.md) records both. Commit
`29668ac`, which follows the target, changes only the disposition record, so it is
not part of the implementation reviewed here.

I read the source, test, script and convention diffs from `0037eaf` to `d84b102`. I
then checked out `d84b102` into a detached worktree, built it and ran the checks
below. Unchanged areas that round 1 accepted were not re-reviewed.

### Actionable findings

None.

### Assessment of the corrections

- **F1 (resolved).** All three projection families now put a resolved selector into
  the identity key as `{ reference: identityReference(...) }`. Literal selectors stay
  strings. An object and a string cannot serialize to the same canonical form, so the
  two value spaces are disjoint. The stored `parameters.selector`, selection behavior
  and view fields are unchanged.
  - I reran my round-1 reproduction against the target build: an ambient module named
    `session:module:<hash>`, selected by internal ID and then by literal name. Both
    selections now succeed with different projection IDs.
  - The new real-provider regression test covers module inspection, organization
    inspection, and dependency children and parents.
- **F2 (resolved).** Five cross-session tests cover module, organization-module,
  organization-group, children and parents. They select the same entity by internal ID
  and by compact reference in two independently opened sessions. They then assert
  equal projection digest suffixes and the expected retained selector spelling.
  - The session comparison script now also resolves compact references from each
    session's own inventory for `inspect`, `children` and `parents`.
- **Version assessment (appropriate).** Only the projection identity key changed:
  - `projection@8` becomes `@9`, covering module and organization projections, whose
    method is `projection;organization`.
  - `dependency-projection@2` becomes `@3`.
  - `program-records@19` stays, because neither the serializer nor `identityReference`
    changed.
  - `presentation@24` becomes `@25` for the composition policy change, which alters
    limitation suppression. That is the responsible method.
- **Primary-producer policy (implemented as directed).**
  `isCompositionContext` now compares only the first `;` token with the exact
  registered composition method. The expanded test covers:
  - a standalone composition token and a leading one;
  - an inherited, non-leading token, which is not classified as composition;
  - unrelated names that share the prefix;
  - rendering: independent and derived limitations stay visible, and the primary
    composition limitation is still suppressed after composition completes.
- **Conventions.** The implementation conventions now state the disjoint-encoding rule
  for mixed reference/literal positions and the primary-producer rule.

### Verification performed (independent, at `d84b102`)

- `npm run check` passes. `npm test` runs 254 tests: 254 pass, with 0 failed, skipped
  or cancelled.
- F1 reproduction probe: no collision, and the two selectors produce distinct
  projection IDs.
- Mutation checks in the compiled target build, each restored after its run. All eight
  were detected:
  - Raw selector in the module projection: the module cross-session test fails.
  - Raw selector in the organization projection: both organization cross-session tests
    fail.
  - Raw selector in the dependency projection: the children and parents tests fail.
  - Untagged normalized selector, applied to each of the three families separately:
    the collision regression test fails each time.
  - Composition classification by any token, and by prefix: the qualification test
    fails in both cases.
- Version-aligned comparison on the final target, which the disposition says was not
  rerun after `d84b102`. I copied the round-1 target build (`0037eaf`) and aligned only
  `projection@8→9`, `dependency-projection@2→3` and `presentation@24→25`. Result:
  72/72 CLI comparisons equal across all four fixtures, including the generated scale
  case. Ordinary name and handle requests therefore show no change beyond the
  intentional method versions.
- `scripts/compare-session-requests.mjs` on the final target: 4 fixtures × 72 = 288
  comparisons pass, including the compact-reference requests.

### Non-defect observations

- The literal-collision regression test selects modules only. The organization-group
  selector goes through the same `selectorKey` line, which the untagged-organization
  mutation exercises through the module path. The group case is covered by
  construction rather than by a dedicated literal-collision case. No change needed.
- The disposition correctly says its comparison evidence describes `f63d3d3`. The
  final-target comparisons above now cover `d84b102`.

### Unverified areas and residual limits

The round-1 residual limits still apply:

- I did not independently re-measure query operation counts.
- I reviewed the helper consolidations only lightly.
- Native scope is macOS and Node 22.13.1 only.
- M3 and later packages remain outside this assignment.

### Recommendation

Both round-1 findings are resolved and verified. The composition policy follows the
human's direction and is covered by tests. I found no new issues. From this review's
perspective, the M2 intermediate gate may be treated as satisfied. The human decides
whether it is.

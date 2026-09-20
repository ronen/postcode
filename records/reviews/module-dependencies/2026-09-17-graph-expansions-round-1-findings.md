# Graph and expansions review: round 1 findings

Record type: findings
Received: 2026-09-17
Reviewer: Independent Claude Code review session (no prior involvement in this implementation)
Handoff: [Graph and expansions handoff](2026-09-17-graph-expansions-handoff.md)
Round: 1
Reviewed target: `a5027451624aca573008668f6efbcca48151d586`

## Returned findings

### Review method

Read the handoff and `dev/review.md`, then the governing material it cites in full:
the [module-dependencies plan](../../../docs/plans/module-dependencies-plan.md),
[core concepts](../../../docs/core-concepts.md),
[architectural constraints](../../../docs/architectural-constraints.md), and the
four decision records (module dependency structure, bounded CommonJS source
evidence, module composition property, dependency/organization integration,
subject-kind standard expansion).

Confirmed the working tree at the review target (`3208325` adds only the handoff
file on top of `a502745`, so no code differs). Read the complete diff between the
stated baseline `2e14de1` and target `a502745` file by file:
`src/lib/dependencies/{graph,projections,organization,records}.ts`,
`src/lib/typescript/{composition,project,dependencies}.ts`,
`src/lib/organization/{evaluate,placement}.ts`, `src/lib/memory-store.ts`,
`src/lib/identity.ts`, `src/lib/records.ts`, `src/lib/presentation.ts`, the new
`test/dependency-projections.test.ts`, and the renamed-facet edits across
`test/cli.test.ts`, `test/dependency-provider-probe.ts`,
`test/dependency-repository-probe.ts`, `test/discovery.test.ts`,
`test/records.test.ts`, plus `STATUS.md` and `docs/architecture/README.md`.

Traced specific behaviors against the governing text rather than trusting the
handoff's description: SCC/root derivation in `graph.ts` against the "derive
graph structure" decision; lens population/edge/non-edge filtering in
`projections.ts` against the three-lens decision; the exhaustive re-export
syntax rule in `composition.ts` against the composition decision, including the
diagnostic/merged-declaration/comment/empty-statement edge cases exercised by
the new tests; the occurrence-narrowed vs. module-placement-fallback endpoint
classification, cross-product-of-narrowed-placements pairing, and
ambiguous/partial/varies-by-placement/varies-by-occurrence status derivation in
`organization.ts` against the organization-integration decision, paying
particular attention to the alternative explicitly rejected there
("cross-product every module placement") to confirm the implemented cross
product is over evidence-narrowed groups per occurrence, not over every
placement of the whole module. Checked `memory-store.ts`'s new atomic
invariants (graph index bounds, root-establishment consistency, organization
claim occurrence-completeness, and the established-status/non-null-classification
biconditional). Checked that `methods.records`, `discovery`, and `presentation`
were version-bumped for the discovery-facet field rename and that the new
`dependencyProjection`, `composition`, and `dependencyOrganization` methods are
included in snapshot identity (the whole `methods` map is embedded in
`snapshotId(...)`, so any version bump invalidates every snapshot regardless of
which expansions were requested).

### Verification performed

- `npm run check` — passes (TypeScript, no errors).
- `npm test` — all 181 tests pass, including the 11 new tests in
  `test/dependency-projections.test.ts` (counted directly: `grep -c "^test("`
  matches the handoff's claim).
- `npm run build && node --test _build/test/dependency-projections.test.js` (the
  handoff's focused reproduction) — all 11 tests pass independently of the full
  suite.
- Manually re-derived expected outcomes for several fixtures by hand (the
  self-loop cycle, the two-parent shared-child case, the merged-ambient-module
  composition case, the directory-link multi-parent containment case, and the
  synthetic ambiguous/partial fallback-placement case) and confirmed the
  assertions match what the governing decisions require, not just what the code
  happens to produce.

### Actionable findings

None. No correctness, decision-conformance, or qualification-boundary defect was
found in the reviewed scope.

### Non-defect observations

- The rejected alternative in the organization-integration decision ("cross-product
  every module placement") is easy to conflate with what `organization.ts`
  actually does (cross-producting each occurrence's already-narrowed source/target
  group sets). The two are different — the implemented version only reaches wider
  module-level placements through the explicit fallback path when occurrence/
  target-declaration evidence is absent — but a future reader skimming the
  decision record's alternatives-considered section could misread this code as
  the rejected approach. Worth a short comment if this area is touched again;
  not a defect now.
- `DependencyProjectionRecord.coverage` is unconditionally empty for the
  `dependency-parents` lens (`projections.ts`), while it is populated for
  `dependency-structure` and `dependency-children`. This is defensible — coverage
  records are owned by the request-making module, and a parents view's subject is
  the child being depended on, not an outgoing-request owner relevant to that
  view — but the plan's CommonJS-coverage decision says "every dependency view"
  discloses bounded coverage. Whether that disclosure needs to be satisfied by
  this per-projection `coverage` field or by the presentation layer's static
  `dependencyLimitations` text is not yet decided, since CLI/presentation wiring
  is explicitly deferred past this checkpoint. Flagging so it is not forgotten
  once presentation integration adds concrete dependency views; not an
  actionable defect at this library-only checkpoint.
- The graph's `components` only carry project-population members; opaque
  external endpoints are exposed to callers exclusively through
  `projection.modules`/`opaqueSubjects`/`relationships`, not inside
  `DependencyGraph`. This matches the decision that external modules are "not
  project roots" and are "not traversed," and the plan's "shared nodes and
  opaque external endpoints" requirement is satisfiable from the projection
  record as a whole — but it means a future Unicode/JSON renderer must combine
  `graph` with the sibling projection fields to draw external leaves, rather
  than finding them in the graph structure alone. Noted for whoever builds that
  renderer; not a defect in this checkpoint.

### Unverified areas and residual limits

- Did not independently re-verify the TypeScript compiler characterization
  underlying `prepareDependencies` (occurrence recognition, CommonJS shape/
  context/binding evidence, resolution) — that provider contract was in scope
  for the earlier provider-integration review round and is unchanged by this
  diff (confirmed `src/lib/dependencies/evaluate.ts` and the bulk of
  `src/lib/typescript/dependencies.ts` logic are untouched here beyond the
  mechanical facet rename).
- Did not exercise the library against a real multi-thousand-file repository or
  measure fresh-invocation cost; the handoff and plan both state that whole-
  repository exercise and performance measurement remain pending past this
  checkpoint, and I did not attempt either.
- Did not review CLI, Unicode/JSON rendering, navigation, or observation
  integration, since none of that exists yet in this diff — consistent with the
  handoff's stated remaining work.
- Did not review `src/lib/organization/evaluate.ts` beyond the mechanical
  `locate` extraction into `placement.ts` and the `facets`→`discoveryFacets`
  rename; its substantive placement logic predates this diff and was not
  re-derived from first principles here.

### Recommendation

The reviewed checkpoint (`a5027451624aca573008668f6efbcca48151d586`) is sound:
`npm run check` and `npm test` pass, the focused reproduction passes
independently, and the graph derivation, three-lens projection semantics,
composition property, and organization expansion each conform to their
governing decisions on inspection, including the boundary cases (cycles,
self-loops, shared children, incomplete/partial evaluation, merged declarations,
diagnostic-qualified composition, occurrence-narrowed vs. fallback placement,
ambiguous/partial placement, multi-parent containment, and determinism) that the
new tests exercise. I recommend this checkpoint is sufficient to proceed to
presentation integration, subject to the human's own judgment on the scope
boundary the handoff describes (library-only checkpoint, not the final
integrated gate) and to the two non-defect observations above being carried
forward rather than lost.

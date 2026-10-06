# Mechanical construction and arrangement checkpoint: findings

Record type: findings
Received: 2026-10-05
Reviewer: Claude Opus 5.5 (Claude Code), independent agent session arranged by the human
Handoff: [Mechanical construction and arrangement checkpoint](2026-10-05-mechanical-construction-handoff.md)
Round: 1
Reviewed target: `d98b4541c8c3851f638c69b4983f2dc30b893456` (diff range `b34e8ee43db39610de4189cd967fbd92e16a6592..d98b4541c8c3851f638c69b4983f2dc30b893456`)

## Returned findings

### Scope actually reviewed

The full diff range above. That includes the three content modules and their
shared helpers (`projection-content.ts`, `module-content.ts`, `composition-content.ts`,
`organization/content.ts`, `dependencies/content.ts`), the three coordinators and
arrangement functions, the organization renderer, `qualification-view.ts`, the
method bump in `identity.ts`, `test/projection-content.test.ts`, the comparison script,
the verification record and comparison result, and the changes to `docs/architecture/README.md`
and `docs/cli-reference.md`. I judged the work against the accepted proposal text at
`b34e8ee` (decision and constraint drafts), the task record's resolutions and the
handoff's five focus areas. I read `src/lib/session.ts`, `organization/projections.ts`
and `organization/evaluate.ts` only as context for call schedules and completeness
state. Investigation, associated inspection and the investigation identity changes
are outside this checkpoint and were not reviewed, except to confirm that their
callers still compile and pass tests.

### Method and verification performed

- I read the source diff in full and traced each `create*View` coordinator through
  resolution, binding and arrangement. I grepped arrangement, rendering and core
  modules for store access, CLI View imports and terminal-layout imports.
- `npm run check` at the target source: passed. The checkout was at `4ce516d`, which
  differs from the target only by the handoff record.
- `npm test` with loopback access and the checkout left unchanged during the run:
  **473 passed, 0 failed**. This full run includes the final containment-support
  addition, which the author ran only in a focused subset.
- I independently reproduced the differential comparison. I built the baseline `b34e8ee`
  in a separate git worktree, linked to the repository's `node_modules`, and ran
  `node scripts/compare-view-construction.mjs <baseline>/_build _build <report>`. The result
  was 632 matched Views, and the report was identical to the committed
  `2026-10-05-mechanical-comparison.json`. I also read the script itself. It adjusts
  only View IDs: it recomputes each one with the old formula and `@26`, and asserts
  that the ID changed. It applies exactly the three approved wording substitutions,
  and only when the baseline View's own fields show incomplete classification. It
  compares the `entityIds` call sequence (kind, population and order) and the
  actual source-disclosure classification. Every other field is retained.
- I ran an extra probe with no git worktree, so repository layout and placement
  were unavailable. In both a repository tree and an inspection, the only difference
  from baseline is the approved closing-qualification substitution. The opening
  materialization summary is still present.
- I ran a timing probe of the three coordinators on this repository (662 modules,
  Unicode, no source detail, mean of 5 runs). Before and after:
  modules ≈ 50–58 → 119–128 ms, organization ≈ 7 → 12–17 ms, dependencies ≈ 12 → 25–29 ms.

### Assessment by focus area

1. **Complete core content.** Module content holds every selected export, with its
   symbol and origin, and all documentation associations with their assertions,
   ordered by expansion order. It also holds composition claims and outcomes,
   evaluation outcomes and in-scope contexts. Each Claim carries its context, captured
   inputs and evidence. Organization content holds all selected groups, containment,
   artifact placements with artifacts, group documentation, module placements with
   module claims, the embedded module content, the repository summary and the
   evaluation-wide external-module support. Dependency content holds every relationship,
   every occurrence (including those beyond the 20/50 bounds) with its request and
   target evidence, coverage, organization occurrences with qualified support, and the
   discovery population. The values are deeply frozen and `structuredClone`-transferable,
   so they contain no closures. The tests check this, and arrangement of a cloned value
   matches the coordinator's output. No core module imports CLI View types or
   terminal helpers.
2. **Counts and completeness.** Selected and evaluation-wide counts stay distinct.
   Dependency `summary.modules` is the selected population, while `discoveredModules`
   and `projectModules` come from the basis. The external-module count is computed
   over all evaluation claims and carries `evaluation` and support. The completeness
   predicate matches the accepted text: `detail: materialized`, and repository and
   placement both applicable, available, completed and fully materialized. Placement
   state already incorporates module-population completeness (`organization/evaluate.ts`).
   Documentation-existence associations come from the same repository evaluation.
   Context groups get artifact-placement claims only when selected
   (`organization/projections.ts`), so their compatibility fields stay zero and they
   never receive the tree annotation. The renderer derives wording only from serialized
   View fields; the test renders after a JSON round trip. The partial-placement test
   lists one module and still uses the neutral wording.
3. **Reference populations and order.** The coordinators allocate the same populations
   in the same order as baseline: discovery modules for module Views; groups, then
   organization module population, then embedded module discovery for organization
   Views; and the basis modules for dependency Views. The reproduced comparison asserts
   that the call sequences are identical. Arrangement functions receive only content
   and binding maps. They have no store handle, callback or lazy accessor.
4. **Omission, traversal and disclosure.** Export, documentation, tag and text limits,
   tree depth, group and module limits, edge, occurrence and result limits, and source
   priority are unchanged in arrangement. Source groups still cover only displayed Claims.
   Dependency organization evidence is still gathered from the first 50 claims × the
   occurrence bound. Group source detail still lists only selected groups' artifacts.
   Comparing actual classifications over 632 Views found no expansion of exposed source.
5. **Method bump and documentation.** The shared method bump is applied once
   (`@26` → `@27`). The formulas are unchanged, and mechanical Projection and entity IDs
   are unchanged; the comparison checks this. The CLI reference documents the legacy
   `unanalyzed` field, the completeness rule and the neutral wording. The eager
   strategy is scoped explicitly to these builders in `docs/architecture/README.md`,
   and no universal eager-only rule is introduced.

### Actionable findings

No blocking or medium-severity defects were found. Low-severity items:

**F1 (low, fidelity to accepted text): core completeness is a bare boolean that does not
distinguish unrequested detail from incomplete classification.**
`organization/content.ts:90–92` sets `summary.complete = artifactClassificationComplete(..., detail)`.
That makes it `false` both for incomplete classification and for context groups with
`detail: not-requested`. The accepted text says core supplies "classification
completeness and its reasons with each summary" and that "unrequested detail remains
distinct from incomplete classification". Today the distinction and the reasons can be
recovered only by also reading `detail` and the `basis` evaluation records. A core
consumer other than the CLI (the stated goal of these values) that reads only
`summary.complete` would treat a context group's zero-valued counts as an incomplete
classification of that group. Suggested correction within scope: give the core summary
an explicit state, such as `complete | incomplete | not-requested`, with the incomplete
reasons, for example which of the repository and placement outcomes failed. Do not
change the View schema.

**F2 (low, clarity): the closing-qualification predicate is redundant and leaves the
zero-selected-group case implicit.** `organization/presentation.ts:286–288` combines
`selected.every(classificationComplete)` with
`artifactClassificationComplete(..., 'materialized')`. Selected groups always have
`detail: materialized`, so the first conjunct is implied by the second, and the rule
reduces to the evaluation-level predicate. As a result, a View with no selected groups
(missing selector, or unavailable layout) shows "classification is incomplete" whenever
repository or placement is incomplete, even though it supplies no artifact
classification. The accepted text ties the closing wording to "a requested artifact
classification supplied for the Projection". The behavior is conservative and was
confirmed against baseline as an approved substitution, so it is not misleading.
However, the code does not show that the choice was intended. Suggest simplifying to
the single predicate and noting in a short comment that this deliberately covers the
zero-group case, or otherwise confirming the intended rule.

**F3 (low, residual coupling/dead code): `prepareCompositionViews` survives as a
store-reading helper in a presentation module with no production callers.**
`composition-view.ts:13–17` describes the function as a "convenience coordinator for
existing callers", but its only caller is `test/processing-index.test.ts:52`. Keeping a
`ProgramRecordStore`-taking function next to `compositionView`/`compositionAnnotation`
makes the arrangement module look store-capable, and invites future reuse from
arrangement code. Suggest removing it and making the test call `resolveComposition` and
`compositionView` directly, or moving it beside the content module.

**F4 (low, documentation): the organization architecture section still describes
construction as one step.** `docs/architecture/README.md:386–388` ("View construction
reads stored claims and captured paths, materializes bounded display rows…") was not
updated. The new resolution/arrangement paragraph sits only in the module section
(around line 220). The organization section also doesn't mention that artifact wording
depends on classification completeness. This is not wrong, but it should match before
final promotion. This could reasonably wait for the integrated documentation pass.

### Non-defect observations

- The verification record honestly states that the final full-suite run predated the
  last additive change. My full run at the exact target closes that gap: 473/473.
- The focused tests and the comparison cover partial placement and synthetic partial
  repository outcomes, but not an *unavailable* repository. My probe showed that case
  behaves correctly. A small focused assertion would protect it.
- `module-content.ts` resolves the origin module claim (with its support) for each
  export, even when the origin is outside the selected module population. This is
  supporting content for a selected export, not a widened selection, and none of it
  reaches source detail. Noted only because it is the one place where content reaches
  past `projection.modules`.
- The eager strategy roughly doubles mechanical View construction time on this
  repository (still tens of milliseconds). This is consistent with the accepted
  transient-cost note; there is no correctness concern.
- Core `resolve*` functions now throw on malformed data that baseline arrangement
  sometimes skipped. Examples are a non-Claim-context organization support record
  (old `continue`) and placement candidate groups being registered eagerly. Current
  evaluators cannot produce these, and the error is louder rather than silent, so I
  see no action needed.
- Durable regression coverage for the mechanical binding-call sequence comes from the
  existing CLI, session and identity tests plus the one-off comparison script. No
  focused permanent test pins the sequence. This is acceptable for mechanical
  coordinators that preserve baseline calls exactly. The binding-port tests that the
  proposal requires belong with the deferred investigation work.

### Unverified areas and residual limits

- I did not compare whole observation envelopes or session-level reordered requests
  directly. I relied on the existing session tests, which passed.
- I didn't review investigation, associated inspection, the binding port, retained
  selections, or the identity and finalizer changes, because they are deferred by design.
- I didn't characterize performance beyond the single-repository probe above.
- The comparison fixtures all live inside this git worktree. Unavailable-repository
  behavior was checked only by my ad hoc probe.

### Recommendation for the stated gate

The mechanical boundary is **sound enough to continue** with investigation-selection
retention and associated-inspection work. Core resolution is complete, store-free, and
independent of display bounds. Arrangement is pure over content and binding maps.
Population binding order and every visible output field are preserved except for the
approved identity and wording changes. The completeness rule matches the accepted
resolution and is reproducible from the serialized View. F1–F4 are low severity and
can be addressed inside the authorized task; F1 and F2 preferably before promotion.
This is a reviewer recommendation only, not human acceptance of the checkpoint.

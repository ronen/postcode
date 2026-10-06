# Mechanical construction and arrangement checkpoint

Date: 2026-10-05
Task: [Separate qualified view construction from presentation shaping](../../tasks/2026-10-05-view-construction-boundary.md)
Baseline: `b34e8ee43db39610de4189cd967fbd92e16a6592`
Environment: macOS, Node.js 22.13.1, TypeScript 6.0.3
Verification: implementation-agent checks, not independent review

## Scope

Module, organization and dependency builders now resolve qualified immutable
content before arranging a View. Their coordinators preserve population binding
order. Resolution receives no format, source-detail choice or display bound;
arrangement accepts resolved content and binding maps without a store handle.
Content includes complete selected support, including material beyond CLI bounds.
Only the existing mechanical Projection records are retained; there is no new
storage stage for content or Views.

Organization summaries carry their repository/module/placement basis and preserve
all numeric calculations. The core completeness predicate uses existing evaluation
and group-detail fields. Partial classification uses the approved neutral label
in inspection, tree counts and the closing qualification, even with modules listed.
The opening materialization summary remains. Complete wording and JSON shape are
unchanged, and the CLI reference explains the legacy `unanalyzed` field.

The shared method changes from `postcode/presentation@26` to `@27`. All three
mechanical View ID values change, as does session/observation method metadata.
Associated inspection inherits the new base View ID. Mechanical Projection IDs,
entity identities and ID formulas are unchanged. The later investigation identity
changes in the accepted proposal are not implemented at this checkpoint.

## Automated checks

- `npm run check`: passed after the final core changes.
- `npm test`: 473 passed, zero failed, on the stable checkout before the final
  additive containment-support property.
- The final containment-support addition was checked with a fresh build and
  `node --test _build/test/projection-content.test.js _build/test/organization.test.js`:
  22 passed, zero failed. The new assertion preserves optional input support and
  checks that each direct parent relation has its complete Claim/context/evidence.
- The earlier broader focused run (construction, organization CLI, dependency
  presentation, processing indexes and source disclosure): 26 passed, zero failed.
- The 632-case differential comparison was rerun against the final core change:
  all passed, including binding-call order and source classifications.
- `git diff --check`: passed.

The focused construction tests use deeply frozen core values and transferred
copies with no store access. They cover 65 exports with long documentation,
75 occurrences beyond both Unicode and JSON bounds, retained supporting evidence,
67 modules across graph and tree bounds, source disclosure based on arranged
fields, stable old selections after unrelated accumulation, and distinct selected
versus discovery-wide module totals. Organization tests cover partial placement
with known modules and incomplete artifact support with full placement. They
verify the three wording sites, complete-case wording, unchanged JSON counts and
evaluation fields, context detail that was not requested, and self-contained
rendering after JSON serialization.

An initial sandboxed full run could not complete local sign-in callback tests.
A later run passed 472/473 but one session test detected changed inputs while
validation files were being added to its observed checkout. The subsequent stable
run used local loopback access and no concurrent worktree edits. These failed runs
are not counted as passing verification.

## Differential comparison

The checkpoint-specific [comparison script](../../../scripts/compare-view-construction.mjs)
compares the baseline builders and new builders against the same retained records.
The [result](2026-10-05-mechanical-comparison.json) contains 632 comparisons:
152 module, 216 organization and 264 dependency Views over ten fixtures.

Checks compare every structured field, exact pretty-printed JSON field order,
exact Unicode text, compact-reference allocation calls (population, kind and order),
and actual source-disclosure classifications. The same session and records are
used on both sides, so no session namespace normalization is needed. It exercises
inventories, exact and missing selections, source options, complete and partial
organization results, direct dependency navigation, and module reconstruction
after dependency accumulation. Existing session tests cover fresh and reordered
request behavior separately; this builder comparison does not itself compare
whole observation envelopes or investigation selections.

Only explicit View ID changes are adjusted: the script computes each expected
old ID with the original formula and `@26`, verifies it differs from the new ID,
and retains every other field. It checks 708 such changes including embedded
module Views. Thirty incomplete organization Unicode cases apply exactly the
three approved wording substitutions. It compares all 632 actual disclosure
classifications. Mechanical Projection IDs, compact IDs, qualification, source
support, ordering, omission counts and JSON calculations are not discarded.

To reproduce, build the baseline revision in an isolated checkout using the pinned
toolchain, then build this target. Run from this checkout:

```sh
node scripts/compare-view-construction.mjs BEFORE_BUILD _build /tmp/mechanical-comparison.json
```

`BEFORE_BUILD` is the baseline's compiled output directory. It must be able to
resolve the repository's installed dependencies. The script is specific to this
checkpoint's `@26` → `@27` comparison, not a general equivalence policy for future
identity changes.

## Remaining work and limits

Investigation selection retention, complete revision snapshots, restricted
reference binding, associated-inspection construction, and worker/finalizer
identity integration remain. The authorized decision and constraint promotion
is deferred until those builders also conform, as specified in the accepted
proposal. The backlog entry and task remain open. No GUI implementation, new Lens,
new analysis, persistence or general presentation framework is added.

Eager resolution can increase transient memory relative to a display-dependent
lookup. This checkpoint shares immutable stored support and does not add caching;
no broad performance characterization is claimed. Review should inspect population
scope and supporting qualification, not infer correctness from output equivalence
alone.

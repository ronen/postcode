Record type: handoff

# Mechanical construction and arrangement checkpoint

Prepared: 2026-10-05
Task: [Separate qualified view construction from presentation shaping](../../tasks/2026-10-05-view-construction-boundary.md)
Review gate: intermediate implementation review before investigation selection retention
Review target: `d98b4541c8c3851f638c69b4983f2dc30b893456`
Baseline: `b34e8ee43db39610de4189cd967fbd92e16a6592`
Diff range: `b34e8ee43db39610de4189cd967fbd92e16a6592..d98b4541c8c3851f638c69b4983f2dc30b893456`
Branch: `codex/view-construction-boundary`

## Review assignment and boundaries

Independently review the separation of core construction and arrangement in the
three mechanical builder families. The human authorized an intermediate review
if it materially reduces implementation risk. This checkpoint spans qualification,
source support, population summaries, reference allocation and bounded traversal;
reviewing it before introducing history-sensitive retained investigation selections
keeps those two kinds of change independently assessable.

This is an implementation review, not another proposal re-review. Inspect the
implementation and evidence; do not treat this handoff, the author's checks or
previous proposal reviews as proof. Recommend whether the mechanical boundary is
sound enough to continue with investigation and associated-inspection work. Only
the findings record below is an authorized repository change for this assignment.

## Governing context

- [Active task and recorded human resolutions](../../tasks/2026-10-05-view-construction-boundary.md)
- [Core concepts](../../../docs/core-concepts.md)
- [Architectural constraints](../../../docs/architectural-constraints.md)
- [Initial Projection architecture](../../../docs/decisions/initial-projection-architecture-decisions.md)
- [Session boundaries](../../../docs/decisions/transient-analysis-sessions.md)
- [View-builder audit](../../audits/2026-10-05-view-builder-boundary/REPORT.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md)
- [Implementation conventions](../../../docs/implementation-conventions.md)
- [Independent review workflow](../../../dev/review.md)

The human accepted the proposal with the resolutions recorded in the task. Its
final text is fixed at baseline commit `b34e8ee43db39610de4189cd967fbd92e16a6592`:

```sh
git show b34e8ee:drafts/view-construction-boundary/decisions/qualified-projection-construction.md
git show b34e8ee:drafts/view-construction-boundary/architectural-constraints-revisions.md
```

Canonical promotion remains pending because that text requires promotion together
with, or after, conformance of all current builders. Investigation and associated
inspection still use their earlier implementation. Do not mistake this checkpoint
for adoption of a binding constraint over those nonconforming paths.

## Result under review

Module, organization and dependency coordinators resolve typed, immutable content
from a retained Projection, coordinate existing population-wide bindings, then call
arrangement with content and binding maps. Core contains full selected claims,
contexts, input support, evidence, outcomes and population summaries. CLI bounds,
source grouping, documentation fitting, tree/graph traversal, source priority and
omission accounting remain in arrangement. Renderers consume self-sufficient Views.
No new content-storage stage or public JSON schema was introduced.

Organization classification completeness derives from existing repository,
placement and detail fields. Inspection, tree counts and the closing qualification
use neutral wording when incomplete, including partial placement with visible
modules. Complete-case wording and counts remain unchanged. The CLI reference
explains the qualified meaning of `unanalyzed`. The shared presentation-method
bump changes all mechanical View IDs and method metadata, including complete cases;
associated-inspection IDs inherit their changed base View ID.

The eager/no-display-bound strategy is scoped to these builders. It does not ban
qualified lazy materialization or presentation pushdown. Holding captured support
in core is not disclosure; arranged source fields continue through existing actual
disclosure classification and publication.

Deliberately remaining after this checkpoint: retained investigation-selection
records and validation, unpaged revision snapshots, the narrow reference-binding
capability, associated-inspection construction, investigation/worker/finalizer
identity changes, full architectural promotion and integrated verification.

## Verification already performed

See the [verification record](../../validation/view-construction-boundary/2026-10-05-mechanical.md)
and [differential result](../../validation/view-construction-boundary/2026-10-05-mechanical-comparison.json).
They distinguish the implementation agent's passing checks from initial failed
runs and unverified scope. The comparison preserves all output fields and applies
only the explicitly allowed identity and wording differences.

## Review focus and reproduction

1. Check that each core content value retains complete selected qualification and
   supporting relationships, including undisplayed documentation, occurrences and
   evidence; it must be useful independently of CLI View schemas.
2. Check selection versus evaluation-wide counts and their supporting basis.
   Inspect partial/unavailable states, documentation-existence coverage and
   unrequested group detail. Test that displayed module counts cannot imply
   completeness and the serialized View alone determines wording.
3. Trace compact-reference populations and allocation order through coordinators,
   including mixed inspection and collisions. Confirm arrangement has no store
   access or callback that can refresh content.
4. Check exact omission, traversal, source-priority, deduplication and qualification
   behavior. Full core content must not expand the source exposed in the View.
5. Confirm the shared method bump and CLI documentation match the approved visible
   changes. Check that the implementation introduces no universal eager-only rule.

Run `npm run check` and `npm test` with local loopback access for the existing
authentication tests. Keep the checkout unchanged during session tests; their
repository snapshots intentionally detect input changes. The focused tests are
in `test/projection-content.test.ts`; the verification record gives the controlled
baseline comparison command.

## Findings return

If you have repository write access, use the
[findings template](../../../dev/templates/review-findings.md), create
`2026-10-05-mechanical-construction-round-1-findings.md` in this review series,
include the exact target and scope actually reviewed, and preserve the report
under `## Returned findings`. Commit only that record. Do not modify source,
documentation, governing material, task status or the task record. Without write
access, return the findings to the human. Later rounds use successive round numbers
under this same assignment and identify any new exact implementation target.

## Review gate

Implementation pauses here for the human-arranged independent review. Address
returned findings within the authorized task and obtain human direction that this
checkpoint is sufficient before proceeding. A reviewer recommendation alone is
not human acceptance. The later integrated final-review gate remains mandatory,
and the task must not close without explicit human approval.

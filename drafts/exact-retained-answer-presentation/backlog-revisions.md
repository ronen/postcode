# Proposed revisions to docs/backlog.md

## Delete “Allow a View to be requested for an existing Projection”

Transfer this entry into [Exact retained-answer presentation](plans/exact-retained-answer-presentation.md) when the human approves the package. The plan carries F6's problem, continuity and pinned-request distinction, identity/reference obligations, conformance caveat and non-goals. Deleting the backlog candidate does not mean the capability is implemented. Apply the accompanying current-document link revisions in the same promotion.

## Replace “Decide how GUI Presentations and their parameters are represented”

## Decide how GUI Presentations and their parameters are represented

Added: 2026-10-06
Origin: representation audit finding [F5](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f5-presentation-choice-presentation-parameters-and-display-bounds-are-fused-into-format)
Area: presentations and GUI preparation

The CLI's format choice selects both encoding and existing display bounds. Its options do not provide general GUI sorting, grouping, layout or expansion-depth policy. Population-wide reference coordination also needs deliberate treatment before another interface can reuse it without reproducing CLI arrangement.

The [exact retained-answer plan](plans/exact-retained-answer-presentation.md) scopes the separation needed to present existing answers: explicit supported presentation inputs, retained-content compatibility, and reference coordination without fresh selection. Approval of that plan does not implement the separation or settle general GUI Presentation design.

Decide presentation choice, parameters, bounds and context for actual GUI capabilities. Determine which available-space, interaction, lifetime and usage differences affect the resulting View identity; do not assume all context is identity-neutral or blindly inherit CLI formulas. Assess interface-independent reference coordination against the implementations resulting from the retained-answer work.

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes are recorded and how continuity relates to identity before implementing a managed View lifecycle. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection.

This remaining work needs decisions before GUI Presentation implementation, not before the bounded retained-answer capability. No multi-Projection GUI implementation is authorized here.

## Preserve independent entries

Leave “Preserve captured-basis attribution in observations” and “Assess conformance when extending coordinated Views and state scope” open. This package neither establishes complete post-Session captured-state attribution nor adds a managed View lifecycle.

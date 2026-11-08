# Proposed revisions to docs/backlog.md

Replace the complete **Decide how GUI Presentations and their parameters are
represented** entry with the following. Preserve its origin and remaining open
scope; precise-ID access removes the need to reproduce CLI compact binding, not
the need to design GUI Presentations.

## Decide how GUI Presentations and their parameters are represented

Added: 2026-10-06
Origin: representation audit finding [F5](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f5-presentation-choice-presentation-parameters-and-display-bounds-are-fused-into-format)
Area: presentations and GUI preparation

The CLI's format choice selects both encoding and existing display bounds. Its options do not provide general GUI sorting, grouping, layout or expansion-depth policy. Under the [internal application API decision](decisions/internal-application-api.md#qualified-content-delivery), precise IDs suffice for GUI clients to refer to supplied subjects and answers without reproducing CLI compact-alias arrangement. The [application/interface boundary plan](plans/application-interface-boundary.md) establishes that access for current capabilities; it does not establish GUI Presentation policy or a general compact-binding API.

The [exact retained-answer plan](plans/exact-retained-answer-presentation.md) scopes the separation needed to present existing answers: explicit supported presentation inputs, retained-content compatibility, and reference coordination without fresh selection. General GUI Presentation design remains outside that bounded separation.

Decide presentation choice, parameters, bounds and context for actual GUI capabilities. Determine which available-space, interaction, lifetime and usage differences affect the resulting View identity; do not assume all context is identity-neutral or blindly inherit CLI formulas. Assess reference lifetime and exact correspondence against the implementations resulting from the retained-answer and application-boundary work. Any new interface-specific compact-reference requirement needs its own design.

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes remain visible and attributable in the investigation, and how continuity relates to identity, before implementing a managed View lifecycle. Select research recording of those changes according to the research question. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection.

This remaining work needs decisions before GUI Presentation implementation, not before the bounded retained-answer or application-boundary capabilities. No multi-Projection GUI implementation is authorized here.

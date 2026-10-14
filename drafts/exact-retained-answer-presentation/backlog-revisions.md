# Proposed revisions to docs/backlog.md

## Delete “Allow a View to be requested for an existing Projection”

Transfer this entry into [Exact retained-answer presentation](plans/exact-retained-answer-presentation.md) when the human approves the package. The plan carries F6's problem, continuity and pinned-request distinction, identity/reference obligations, conformance caveat and non-goals. The corresponding distinction for future external-agent references remains in “Design a bounded shared-context interface for coding agents”. Deleting the backlog candidate does not mean the capability is implemented. Apply the accompanying current-document link revisions in the same promotion.

## Replace “Decide how GUI Presentations and their parameters are represented”

## Decide how GUI Presentations and their parameters are represented

Added: 2026-10-06
Origin: representation audit finding [F5](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f5-presentation-choice-presentation-parameters-and-display-bounds-are-fused-into-format)
Area: presentations and GUI preparation

The CLI's format choice selects both encoding and existing display bounds. Its options do not provide general GUI sorting, grouping, layout or expansion-depth policy. Population-wide reference coordination also needs deliberate treatment before another interface can reuse it without reproducing CLI arrangement.

The [exact retained-answer plan](plans/exact-retained-answer-presentation.md) scopes the separation needed to present existing answers: explicit supported presentation inputs, retained-content compatibility, and reference coordination without fresh selection. General GUI Presentation design remains outside that bounded separation.

Decide presentation choice, parameters, bounds and context for actual GUI capabilities. Determine which available-space, interaction, lifetime and usage differences affect the resulting View identity; do not assume all context is identity-neutral or blindly inherit CLI formulas. Assess interface-independent reference coordination against the implementations resulting from the retained-answer work.

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes are recorded and how continuity relates to identity before implementing a managed View lifecycle. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection.

This remaining work needs decisions before GUI Presentation implementation, not before the bounded retained-answer capability. No multi-Projection GUI implementation is authorized here.

## Replace “Preserve captured-basis attribution in observations”

## Preserve captured-basis attribution in observations

Added: 2026-10-08
Origin: [Current observation provenance gap](decisions/coordinated-views-and-qualified-results.md#current-observation-provenance-gap)
Area: observation provenance and qualified result attribution

Current observation batches do not generally preserve an exported association between the presented Projection and its captured program-state basis. Ordinary module inventory is a confirmed case: the batch retains a conceptual View and session/path/method context, but not the retained analysis-input support. Session-local identifiers and configured paths do not establish that basis after the ephemeral store is gone. Optional source-detail evidence digests describe disclosed items, not a complete state association. Recorded output remains evidence of what PostCode displayed; observations do not generally establish the captured program basis supporting it. This is a current recording gap relevant to existing observation obligations, independent of future multi-state or GUI capability.

Assess and correct the bounded observation export path so that the recorded result remains attributable to the basis actually used, including capture limitations and the repository-state provenance required by the product design. Do not reconstruct provenance by reading a later working tree. Determine what can be supplied from retained support, which references remain resolvable after session closure, and which additional capture or retention information is necessary. Choose schema, disclosure and compatibility treatment from that assessment; do not prescribe a state field in every record family or imply that a commit alone captures relevant working-tree inputs.

Scope this work to identifying the captured basis and its limitations, rather than retaining everything necessary to reproduce an investigation. It does not authorize a durable analysis store or repository archive. Do not assume that a commit hash or references into a discarded store are sufficient attribution. Any bounded retention needed for adequate attribution must be justified within the later approved design; full reproducibility is a separate concern.

Include associated-inspection attribution in the assessment: its current exported descriptor uses the composite selection ID while retaining mechanical descriptor fields, and omits the explicit mechanical support reference retained in core. The [exact retained-answer plan](plans/exact-retained-answer-presentation.md) owns exposing the composite variant and precise mechanical-support reference, with verification and a corresponding update to this description. That bounded correction does not close the general captured-basis export gap. Check whether the observation adequately describes the actual qualified answer and its support after that implementation. A composed Projection does not inherently become a View of two independent Projections; preserve the accepted composition contract without requiring universal direct component pointers.

Correction is explicitly deferred and need not block architectural adoption or interface exploration. Complete it before relying on newly collected observations for assessments requiring attribution to a particular program state. Until then, preserve the distinction between evidence of displayed output and evidence of its captured program basis. Keep this work separate from F1 request-description fixes unless an approved implementation scope deliberately combines them. This candidate authorizes no implementation or rewriting of historical observations.

## Replace “Assess reference-lifetime disclosure in existing views”

## Assess reference-lifetime disclosure in existing views

Added: 2026-09-26
Origin: module investigation review and reference-lifetime disclosure decision
Area: presentation and session references

Assess output against the [reference-lifetime disclosure requirement](decisions/reference-lifetime-disclosure.md): when references expire before they can be used in a subsequent request, their surrounding presentation must make that limitation clear. Cover human and JSON output. A shared notice can cover affected references; ordinary follow-up references in a continuing Session need no repeated caveats.

The [exact retained-answer plan](plans/exact-retained-answer-presentation.md) owns disclosure and conformance verification for all references in its affected program Views, including answer aliases, module/group/investigram subjects and supporting source/navigation references. This includes the earlier module inventory/inspection/exports, repository/project organization and group inspection, dependency overview/direct relationships and their source detail, and one-shot versus shell output. Keep that coverage open in the plan until implementation is verified; adopting the plan does not establish conformance.

The remaining independent assessment covers references in non-View output, including ambiguous-selection candidates, operational reports and refusals. The retained-answer plan also covers its own presentation-unavailable retainedAnswers and new refusals; use that verified coverage without assuming it establishes conformance of every pre-existing non-View path.

Conformance of those remaining paths is currently unknown. The potential impact is confusion about which displayed references support further navigation, rather than a change to reference binding or underlying program claims. This remains a deferred usability assessment; its broader scope does not block the bounded retained-answer implementation.

## Preserve independent entries

Leave “Assess conformance when extending coordinated Views and state scope” open. This package adds no managed View lifecycle and establishes no general multi-input conformance. The broader captured-basis export and non-View reference-lifetime assessments above also remain open.

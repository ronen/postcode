# Proposed revisions to docs/backlog.md

Replace “Preserve captured-basis attribution in observations” in full; keep its title and link target.

## Preserve captured-basis attribution in observations

Added: 2026-10-08
Origin: [Current observation provenance gap](decisions/coordinated-views-and-qualified-results.md#current-observation-provenance-gap)
Area: observation provenance and qualified result attribution

Current observation batches do not generally preserve an exported association between the presented Projection and its captured program-state basis. Ordinary module inventory is a confirmed case: the batch retains a conceptual View and session/path/method context, but not the retained analysis-input support. Session-local identifiers and configured paths do not establish that basis after the ephemeral store is gone. Optional source-detail evidence digests describe disclosed items, not a complete state association. Recorded output remains evidence of what PostCode displayed; observations do not generally establish the captured program basis supporting it. This is a confirmed limitation of current exports. Under [question-driven recording](decisions/research-question-driven-observation.md#research-capture), it requires remediation for research that relies on captured-basis attribution, not for every use or every record of displayed output. It is independent of future multi-state or GUI capability and does not establish a missing internal architectural basis.

For a research question requiring this attribution, assess and correct the bounded observation export path so that the recorded result remains attributable to the basis actually used, including relevant capture limitations and repository-state provenance. Identify the question and required attribution before choosing additional capture. Do not reconstruct provenance by reading a later working tree. Determine what can be supplied from retained support, which references remain resolvable after session closure, and which additional capture or retention information is necessary. Choose schema, disclosure and compatibility treatment from that assessment; do not prescribe a state field in every record family or imply that a commit alone captures relevant working-tree inputs.

Scope this work to identifying the captured basis and its limitations, rather than retaining everything necessary to reproduce an investigation. It does not authorize a durable analysis store or repository archive. Do not assume that a commit hash or references into a discarded store are sufficient attribution. Any bounded retention needed for adequate attribution must be justified within the later approved design; full reproducibility is a separate concern.

Include associated-inspection attribution in the assessment: its exported descriptor now identifies the `associated-inspection` variant, composite selection ID and precise `mechanical` support reference. Retained-presentation tests verify that these identify the frozen composite and allow separate mechanical presentation. This bounded correction under the [exact retained-answer plan](plans/exact-retained-answer-presentation.md) does not close the general captured-basis export gap. Assess whether the records needed for the question adequately identify the actual qualified answer and its captured basis, including supplied prior interpretation and selected accounts/correction/association snapshots where used. Internal delivery/provenance and selection records do not by themselves establish that these contributions remain attributable in exported observations. A composed Projection does not inherently become a View of two independent Projections; preserve the accepted composition contract without requiring universal direct component pointers.

Correction is explicitly deferred and need not block architectural adoption or interface exploration. Complete it before relying on newly collected observations for assessments requiring attribution to a particular program state. Until then, preserve the distinction between evidence of displayed output and evidence of its captured program basis. Keep this work separate from F1 request-description fixes unless an approved implementation scope deliberately combines them. This candidate authorizes no implementation or rewriting of historical observations.

Replace “Assess investigation initiation and parent attribution” in full; retain its anchor.

## Assess investigation initiation and parent attribution

Added: 2026-10-10
Origin: [Application specification boundaries](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)
Area: request coordination, resource governance, observations

The completed [Lens request-model task](../records/tasks/2026-10-11-lens-request-model.md) implements bounded request, prerequisite and evidence-work attribution across current mechanical resolution, summary/follow-up Evaluation, investigator evidence access and publication. Parent descriptions, generating origins and current consumption travel with qualified outcomes. The [implemented attribution boundary](architecture/README.md#request-work-attribution) describes this support and its limits; do not duplicate that completed work here.

Retain the broader assessment for paths outside that scope and any independently substantial gaps identified by implementation. Establish which parent/trigger, initiator, captured-basis, outcome and resource relationships remain inspectable within the investigation and attributable in any research records that capture the work, including failure, reuse and cancellation; do not infer conformance from command names or request identifiers. The separate captured-basis export and navigation-origin candidates retain their own scope.

Preserve existing operation reuse, failure retention, cancellation ownership and construction boundaries. Record concrete remaining gaps rather than requiring a general planner or record for every helper. Do not defer a gap that prevents the planned request model from fulfilling its own contract. Complete the research-relevant assessment before relying on records for initiation/resource-policy evaluation. Independently establish authorization and investigation attribution before adding autonomous execution. Research selection does not defer a demonstrated operational attribution conflict.

Replace “Decide how GUI Presentations and their parameters are represented” in full; retain its anchors.

## Decide how GUI Presentations and their parameters are represented

Added: 2026-10-06
Origin: representation audit finding [F5](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f5-presentation-choice-presentation-parameters-and-display-bounds-are-fused-into-format)
Area: presentations and GUI preparation

The CLI's format choice selects both encoding and existing display bounds. Its options do not provide general GUI sorting, grouping, layout or expansion-depth policy. Population-wide reference coordination also needs deliberate treatment before another interface can reuse it without reproducing CLI arrangement.

The [exact retained-answer plan](plans/exact-retained-answer-presentation.md) scopes the separation needed to present existing answers: explicit supported presentation inputs, retained-content compatibility, and reference coordination without fresh selection. General GUI Presentation design remains outside that bounded separation.

Decide presentation choice, parameters, bounds and context for actual GUI capabilities. Determine which available-space, interaction, lifetime and usage differences affect the resulting View identity; do not assume all context is identity-neutral or blindly inherit CLI formulas. Assess interface-independent reference coordination against the implementations resulting from the retained-answer work.

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes remain visible and attributable in the investigation, and how continuity relates to identity, before implementing a managed View lifecycle. Select research recording of those changes according to the research question. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection.

This remaining work needs decisions before GUI Presentation implementation, not before the bounded retained-answer capability. No multi-Projection GUI implementation is authorized here.

Replace “Assess conformance when extending coordinated Views and state scope” in full; retain its anchors.

## Assess conformance when extending coordinated Views and state scope

Added: 2026-10-07
Origin: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md)
Area: qualified results, presentation composition and future lifecycle

The current implementation is a permitted limited subset of the broader product model. Before extending it, assess state-to-claim/evidence associations, meaningful ordering, capture timing and non-atomicity; input-level qualifications and partial outcomes; identity guarantees used for alignment; and distinctions among descriptive counts, overlapping populations and new analytical aggregates. Verify that each supplied Projection stays fixed and that arrangement cannot broaden its population through session access. No broad conformance audit has yet established these properties for future multi-input behavior.

Scope prerequisites to the introduced capability. Coordinating several existing Projections from one Session does not inherently require multi-state support or new capture identity. It does require attributable input meanings and qualifications, appropriate presentation descriptors and any question-selected observation descriptors, stable selected answers and visible composition changes. Choosing a qualified Projection selection versus coordinating supplied answers depends on requested meaning; neither new synthesis nor an outer Projection is required merely to share a display.

Current entity keys and several lookup/reuse paths are session-scoped and assume unchanged program inputs. Before introducing another capture, decide whether it belongs to a new Session or to a Session extended to support several captures, and how entity versions, record keys, reuse, associations and reference bindings distinguish their bases. Reusing a module key in the same namespace cannot by itself establish cross-state semantic correspondence. Assess affected schemas and method versions after choosing the design; this candidate does not prescribe a state-ID field in every record or a rewrite of every family.

Also assess View-to-View input dependencies and anchors: distinguish discovery lineage from a continuing dependency on another View’s supplied Projection or selection. Define handling of a changed or absent anchor without silent retargeting. This need does not create a third universal input-binding category or require a live View implementation now.

Before adding live refresh, multi-state analysis, cross-session coordination, workspace persistence or agent-context export, resolve the necessary reference/correspondence, result-selection, captured-result versus repeatable-request references, composition visibility, investigation-lineage and retention contracts for that capability. For multi-Projection output, assess the singular View descriptors, observation request records and any agent-context format together. Preserve the actual Projections presented, their composition and captured-state associations within the investigation, and make composition/basis changes visible. Choose research recording of them for the research question, separately from any workspace-state retention; recording a change does not inherently require workspace persistence. Expose the choices actually made and their criteria at the time, rather than explanations reconstructed from subsequently changed defaults. Inspectability requires neither a general planner nor a separately stored plan artifact.

This candidate creates no schedule or requirement to implement those capabilities together. The [Lens request-model plan](plans/lens-request-model.md) incorporates the existing defects in request observations, unsupported-subject status and parameter descriptors. They remain defects until implementation corrects them and must not be excused as missing future features. Broader coordinated-View/state-scope conformance remains separately scoped here.

Add the following candidate under “Candidates”; its position does not establish priority.

<a id="separate-optional-research-recording-from-feedback-context"></a>
## Separate optional research recording from feedback context

Added: 2026-11-05
Origin: [Research-question-driven observation](decisions/research-question-driven-observation.md#adoption-and-conformance)
Area: optional CLI recording, publication and explicit feedback

The CLI automatically constructs version-four observation batches and submits them to its local sink. Publication also takes the shell's displayed-result feedback snapshot from those batches. A discard sink avoids local writes but still constructs records and classifies exposure; deleting batch construction would also remove feedback context. The relaxed requirements permit a useful simplification, but do not require changing this working behavior for conformance.

Consider a bounded no-automatic-recording option that separates the available displayed-result snapshot from research event/UUID construction and sink submission. Keep explicit feedback submission useful with its available artifact, exact output and missing-context disclosure, without reconstruction. Choose the public control, default and feedback destination semantics before implementation; do not silently discard requested feedback when automatic capture is off. Avoid a generic event subscription/configuration framework without a concrete research need.

Potential benefits are fewer unnecessary local files and less record construction, serialization and delivery work. No runtime or storage savings have been measured. The existing sink is small, has useful no-overwrite/cleanup guarantees and fault tests, and remains needed by explicit feedback and research. Source-exposure classification has bounded family-specific logic and verification; preserve the human output boundary even if its research classification is skipped on an unrecorded path. Work attribution, usage, immutable basis/selection records, citation exposure and Investigator delivery are operational or semantic support, not disposable research instrumentation.

A later scoped plan should trace the publication/feedback dependency, choose the simplest separation, and verify identical qualified results, request attribution, exit status, input checks and cancellation with automatic recording on and off; absence of automatic files/submissions when off; explicit feedback with and without available context; and unchanged chosen-record delivery-failure behavior. Reuse current publication, feedback, actual-exposure, retained-presentation and local-sink tests. Verify that required operational attribution survives a failed or absent sink. No new benchmark or broad rewrite is required unless measurements are used to justify it.

Question-specific payload reduction is a separate opportunity when a concrete study establishes which data it needs. Retaining both qualified artifacts and exact output currently supports exposure assessment and self-contained feedback; removing either universally would lose that use. Preserve historical files and declare any changed experimental producer format. Do not add generalized schema selection, migrations, restoration or research UI merely to prepare for selection. This candidate is optional, separately approvable work and does not block documentary reconciliation.

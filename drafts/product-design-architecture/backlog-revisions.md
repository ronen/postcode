# Proposed revisions to docs/backlog.md

These additions accompany conceptual adoption. They neither prioritize candidates nor authorize implementation. Preserve existing entries and audit links.

## Add to “Correct lens misreporting in observations and dependency subject status”

Append:

Describe the requested information from the actual request and its resolution, not by inferring one Lens from a View-wide descriptor. A coordinating View can have several Projection requests and results; observations, captions and agent context must preserve those associations when that capability is introduced. A bounded correction to current misreporting need not introduce a plural schema or wait for that future work.

## Add to “Decide how lenses are represented”

Append:

The [coordinated-Views decision](decisions/coordinated-views-and-qualified-results.md) removes any assumption that a View has exactly one Lens or that coordinating a summary requires a composite summary Lens. Later Lens preparation should distinguish a Lens's question and parameters, its application to a subject and captured state basis, Evaluation's reusable operations, and the Presentation's input collection. Several analyses or qualified contributions can serve one Lens without a separate category. This does not decide a registration mechanism, one `inspect` identity across subject kinds, or an execution framework. The earlier exploratory representation proposals do not settle identifier spellings, a single `inspect` identity, a registry or prompt mechanism, a combined F1–F4 implementation scope, or schema migration. `usage` remains reporting under the accepted qualified-construction decision; its current lens-shaped descriptor is a compatibility issue, not an open question about whether it is a program Lens.

## Add to “Decide how a Projection's subject is designated and separated from lens parameters”

Append:

The coordinated-Views model does not make internally requested component Projections inherently invalid. F4 concerns construction and retention of an inspection Projection to obtain dependency subject-selection data: its selection is copied, but its qualified inspection answer is not consumed as an attributed contribution, and module-only selection determines the result. Preserve genuinely consumed component answers with attributable meaning, method, basis and qualification; no universal direct component pointer is prescribed. Keep subject designation, selected subjects, program-input designations, binding policies, captured-state attribution and true Lens parameters distinct; a revision designation is not a Lens parameter merely because it occupies a request field. Subject remains open-ended: a module investigated across captured states and an identified qualified change are different possible subjects, with state designation explicit in either case. No change-investigation implementation follows from that distinction. Do not infer a universal identity or deduplication policy from the possibility of several inputs.

## Add to “Decide how GUI Presentations and their parameters are represented”

Append:

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes are recorded and how continuity relates to identity before implementing a managed View lifecycle. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Revisit the audit’s presentation-context question: available space, interaction state, reference lifetime and per-input usage/reporting need explicit treatment rather than inheriting current CLI identity formulas. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection. No multi-Projection GUI implementation is authorized by the conceptual decision.

## Replace the last paragraph of the existing “Allow a View to be requested for an existing Projection” entry

Replace the paragraph beginning “Consider a request form that names a retained Projection” with:

The intended implementation direction is a request form that names an exact retained Projection together with new presentation inputs, so that paging and reformatting keep the same answer. Keep exact-result redisplay distinct from repeating a request with pinned inputs: pinning selects the same captured program state, not necessarily the same retained analysis result. Preserve this distinction in agent-context references and future interface wording.

## Add to “Allow a View to be requested for an existing Projection”

Append:

F6 is a current human-facing continuity/disclosure limitation, with remediation explicitly deferred to separately scoped work. Paging or reformatting is intended to preserve the selected answer and its qualifications, but the current request path may select newer retained interpretation or correction/association snapshots. Separate CLI commands and changed Projection IDs in JSON do not sufficiently disclose refresh to a human paging an answer. Make refresh behavior apparent and disclose consequential changes in answer, selection or qualifications if an interaction refreshes instead; clearly disclosed reselection may be an interim treatment but is not equivalent to exact-result continuity. This does not require a warning for every identifier change or a comparison notice for every independently requested fresh investigation.

Separate presenting a captured result from repeating a request under its input binding: following resolves a changing input again, while pinned continues to use the same captured program state. Retained interpretation and correction/association selections also support the answer, but are not thereby captured program states and acquire no following or pinned policies. Preserve explicit earlier results and reference bindings. Remediation does not depend on live refresh, multi-state analysis or GUI support and must precede any claim that current paging preserves one selected answer. Any new request or schema requires its own compatibility and identity decision; no implementation or session-lifecycle change is authorized here.

## Add this complete candidate

## Preserve captured-basis attribution in observations

Added: 2026-10-08
Origin: [Current observation provenance gap](decisions/coordinated-views-and-qualified-results.md#current-observation-provenance-gap)
Area: observation provenance and qualified result attribution

Current observation batches do not generally preserve an exported association between the presented Projection and its captured program-state basis. Ordinary module inventory is a confirmed case: the batch retains a conceptual View and session/path/method context, but not the retained analysis-input support. Session-local identifiers and configured paths do not establish that basis after the ephemeral store is gone. Optional source-detail evidence digests describe disclosed items, not a complete state association. This is a current recording gap, independent of future multi-state or GUI capability.

Assess and correct the bounded observation export path so that the recorded result remains attributable to the basis actually used, including capture limitations and the repository-state provenance required by the product design. Do not reconstruct provenance by reading a later working tree. Determine what can be supplied from retained support, which references remain resolvable after session closure, and which additional capture or retention information is necessary. Choose schema, disclosure and compatibility treatment from that assessment; do not prescribe a state field in every record family or imply that a commit alone captures relevant working-tree inputs.

Include associated-inspection attribution in the assessment: its exported descriptor uses the composite selection ID while retaining mechanical descriptor fields, and omits the explicit mechanical support reference retained in core. Check whether the observation adequately describes the actual qualified answer and its support. A composed Projection does not inherently become a View of two independent Projections; preserve the accepted composition contract without requiring universal direct component pointers.

Resolve urgency and any adoption-time remediation deferral with the human before accepting this package. The decision records the open choice. Until corrected, do not rely on current observations as complete captured-basis provenance. Keep this work separate from F1 request-description fixes unless an approved implementation scope deliberately combines them. This candidate authorizes no implementation or rewriting of historical observations.

## Add this complete candidate

## Assess conformance when extending coordinated Views and state scope

Added: 2026-10-07
Origin: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md)
Area: qualified results, presentation composition and future lifecycle

The current implementation is a permitted limited subset of the broader product model. Before extending it, assess state-to-claim/evidence associations, meaningful ordering, capture timing and non-atomicity; input-level qualifications and partial outcomes; identity guarantees used for alignment; and distinctions among descriptive counts, overlapping populations and new analytical aggregates. Verify that each supplied Projection stays fixed and that arrangement cannot broaden its population through session access. No broad conformance audit has yet established these properties for future multi-input behavior.

Scope prerequisites to the introduced capability. Coordinating several existing Projections from one Session does not inherently require multi-state support or new capture identity. It does require attributable input meanings and qualifications, appropriate presentation/observation descriptors, stable selected answers and visible composition changes. Choosing a qualified Projection selection versus coordinating supplied answers depends on requested meaning; neither new synthesis nor an outer Projection is required merely to share a display.

Current entity keys and several lookup/reuse paths are session-scoped and assume unchanged program inputs. Before introducing another capture, decide whether it belongs to a new Session or to a Session extended to support several captures, and how entity versions, record keys, reuse, associations and reference bindings distinguish their bases. Reusing a module key in the same namespace cannot by itself establish cross-state semantic correspondence. Assess affected schemas and method versions after choosing the design; this candidate does not prescribe a state-ID field in every record or a rewrite of every family.

Also assess View-to-View input dependencies and anchors: distinguish discovery lineage from a continuing dependency on another View’s supplied Projection or selection. Define handling of a changed or absent anchor without silent retargeting. This need does not create a third universal input-binding category or require a live View implementation now.

Before adding live refresh, multi-state analysis, cross-session coordination, workspace persistence or agent-context export, resolve the necessary reference/correspondence, result-selection, captured-result versus repeatable-request references, composition-recording and retention contracts for that capability. For multi-Projection output, assess the singular View descriptors, observation request records and any agent-context format together. Record the actual Projections presented, their composition and captured-state associations, and make composition/basis changes visible. Decide the required observation events and any workspace-state retention separately; recording a change does not inherently require workspace persistence. Expose the choices actually made and their criteria at the time, rather than explanations reconstructed from subsequently changed defaults. Inspectability requires neither a general planner nor a separately stored plan artifact.

This candidate creates no schedule or requirement to implement those capabilities together. Existing defects in request observations, unsupported-subject status and parameter descriptors remain separate candidates and must not be excused as missing future features.

## Add this complete candidate

## Consider summary suggestions and recursive navigation

Added: 2026-10-07
Origin: [Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)
Area: entry experience and navigation

The product permits suggesting a summary View when no more specific information need is expressed; it does not mandate that default. The CLI’s module-inventory default is compatible with that direction, while `summarize` offers the implemented module interpretation. Consider whether summary suggestions and recursive navigation would be useful in future interface work, distinguishing coordination of qualified inputs from synthesis of a new answer. Define useful selection and omission disclosure without requiring a summary Lens for every subject. No change to current commands or immediate GUI work is implied.

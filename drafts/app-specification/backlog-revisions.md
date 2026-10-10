# Proposed revisions to docs/backlog.md

Each block below is a complete replacement or addition at the identified destination. Unlisted material remains unchanged.

## Replace “Consider summary suggestions and recursive navigation”, preserving it and adding two reconciliation candidates after it

<!-- BEGIN PROMOTION CONTENT -->
## Consider summary suggestions and recursive navigation

Added: 2026-10-07
Origin: [Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)
Area: entry experience and navigation

The product permits suggesting a summary View when no more specific information need is expressed; it does not mandate that default. The CLI’s module-inventory default is compatible with that direction, while `summarize` offers the implemented module interpretation. Consider whether summary suggestions and recursive navigation would be useful in future interface work, distinguishing coordination of qualified inputs from synthesis of a new answer. Define useful selection and omission disclosure without requiring a summary Lens for every subject. No change to current commands or immediate GUI work is implied.

## Assess investigation initiation and parent attribution

Added: 2026-10-10
Origin: [Application specification boundaries](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)
Area: request coordination, resource governance, observations

Assess current prerequisite analyses and interpretation evidence requests against the distinction between explicit work, request-scoped system-initiated investigation, and autonomous work. Trace representative requests from selection through evaluation, result construction, inspection, and observation output. Establish which parent/trigger, initiator, captured-basis, outcome, and resource relationships are retained and inspectable, rather than inferring conformance from an explicit outer command.

Record concrete gaps and propose bounded remediation without requiring a general planner or a record for every implementation step. Preserve existing operation reuse, failure retention, cancellation ownership, and construction boundaries. Coordinate with existing request-misreporting and captured-basis entries rather than duplicating them. Complete attribution assessment before relying on current observations for initiation/resource-policy evaluation; establish authorization and attribution before adding autonomous execution.

## Design a bounded shared-context interface for coding agents

Added: 2026-10-10
Origin: [Application specification integration contract](app-specification.md#shared-context-for-external-coding-agents)
Area: external-agent context and reference lifecycle

Choose a first useful exchange that lets an external coding agent identify the focused/open Views and their qualified information without translating them manually into source coordinates. Distinguish exact retained Projection references from repeatable requests, disclose their lifetime and captured basis, and preserve source mappings, provenance, and relevant derivation. Assess current interfaces before selecting a transport or artifact format. Define which Workspaces/windows are included, how active focus is selected, and how the human can inspect that scope; a most-recently-active-window policy is a candidate, not an inherited requirement.

If using a generated artifact, specify publication, revision, and evidence-exclusion behavior. Do not require richer Workspace purpose/context machinery or persistence just to share existing Views and focus. No particular agent host, file format, or implementation milestone is selected by this candidate.
<!-- END PROMOTION CONTENT -->

## Replace “Provide Git history as investigator evidence” to update its governing reference

<!-- BEGIN PROMOTION CONTENT -->
## Provide Git history as investigator evidence

Added: 2026-09-29
Origin: module investigation scope discussion before implementation
Area: investigation evidence and historical context

The [research product design](../foundation/product-design.md#sources-of-program-knowledge)
recognizes repository history as evidence, while the initial
[module investigation slice](plans/module-investigation.md) excludes it.
Make relevant history available through the subject-based evidence interface
to help explain how code acquired its current shape and recorded rationale.
A bounded starting point could expose changes affecting a module and selected
commit messages and diffs, without requiring a general history lens.

Preserve revision identity, distinguish historical evidence from current source,
and qualify commit messages as recorded assertions. Make retrieval bounds and
unavailable history explicit. Reuse the investigation assessments to evaluate
the effect on explanatory value, evidence selection, usage, and latency;
reassess prompts when adding history access and tune them if findings warrant
it.
<!-- END PROMOTION CONTENT -->

## Replace “Decide how lenses are represented”, preserving it and adding the specification reconciliation dependency

<!-- BEGIN PROMOTION CONTENT -->
## Decide how lenses are represented

Added: 2026-10-06
Origin: [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#lens)
Area: lens model and request dispatch

Lens is first-class in the user model but has no representation in code. Its identity exists only as strings that differ between requests, Projection records, Views and observations. Subject applicability, requirements and dispatch are coded inline in the request executor. Several lists of lens names are maintained separately, which caused the defects in "Correct lens misreporting in observations and dependency subject status". A GUI will need to enumerate the questions available for a subject, caption each View with its question, and edit lens parameters.

Open questions:

- Is `inspect` one lens whose meaning depends on subject kind, or several lenses routed from one command? The same question applies to `children`/`parents` across dependency and investigram subjects.
- Should `usage` remain lens-shaped, or become a separate reporting request?
- How visible should "lens" be to users? This affects naming more than the need for a representation.

One option the audit proposed is a single typed lens table, giving each lens's identifier, accepted subject kinds, parameters, requirements and constructor. Command parsing, dispatch, the operation mapping and observation descriptions would all derive from it. Other forms remain open.

The [coordinated-Views decision](decisions/coordinated-views-and-qualified-results.md) removes any assumption that a View has exactly one Lens or that coordinating a summary requires a composite summary Lens. Later Lens preparation should distinguish a Lens's question and parameters, its application to a subject and captured state basis, Evaluation's reusable operations, and the Presentation's input collection. Several analyses or qualified contributions can serve one Lens without a separate category. This does not decide a registration mechanism, one `inspect` identity across subject kinds, or an execution framework. The earlier exploratory representation proposals do not settle identifier spellings, a single `inspect` identity, a registry or prompt mechanism, a combined F1–F4 implementation scope, or schema migration. `usage` remains reporting under the accepted qualified-construction decision; its current lens-shaped descriptor is a compatibility issue, not an open question about whether it is a program Lens.

Reconcile the follow-up design with the [application specification](app-specification.md) before accepting representation changes. Preserve the distinction between shared architecture and the capability toolbox, system-initiated prerequisite work and explicit requests, and delegated mechanics versus governing contracts. No registry, uniform inspection identity, outcome-lifetime change, or schema migration is adopted by the specification.
<!-- END PROMOTION CONTENT -->

## Replace “Review the investigation UI and UX as a whole”, preserving existing evidence and adding the Workspace direction

<!-- BEGIN PROMOTION CONTENT -->
## Review the investigation UI and UX as a whole

Added: 2026-09-23
Origin: human exploratory use of the completed interactive session on another repository
Area: presentations and interaction

The session works, but repeated use makes the current views difficult to read:
output is too wordy, important information is hard to find, and presentation
choices that were tolerable for one-shot commands compound across an
investigation. Evaluate the full journey across inventory, organization,
dependencies, inspection, qualifications, source detail, and shell interaction
before making isolated formatting changes. Identify what deserves immediate
attention, what should be progressively disclosed, and what belongs in a later
visual interface. Preserve precise navigation, evidence, qualifications, and
consequential omission disclosure while improving readability.

The [milestone-4 progressive assessment](../records/validation/module-investigation/pass-04/report.md)
adds captured examples: repeated full accounts and accounting/evidence metadata
obscure what changed; investigram source-detail views can supply artifact paths
and metadata without checkable excerpts or line positions; and standalone captured
interpretive views omit effective compiler/configuration attribution that is
available in the surrounding assessment record. Consider readable, bounded
evidence navigation and concise provenance in the whole-journey review. These
are formative observations, not measured human usability results or authorization
for a presentation redesign.

The [milestone-5 integrated assessment](../records/validation/module-investigation/pass-05/report.md)
adds original/current account distinctions, causal warning pages and explicit
conflicts to this journey. Assess whether repeated empty revision status obscures
important warnings, and how users discover qualifications learned in follow-ups
when the retained summary has no explicit correction. Preserve exact historical
selection and avoid implying automatic synthesis or reassessment. These remain
formative concerns, not a request to tune the current assessment. The
[focused dependent-account sequence](../records/validation/module-investigation/pass-06/report.md)
again exposes absent excerpts and dense repeated context. Its evaluator distinguishes
compatible replacement accounts from the structural “conflicting alternatives”
label, and local exact selection from family primary, but finds the wording demanding.
Use these captures as further qualitative evidence for the same journey review,
without implying measured misunderstanding or authorizing current-slice redesign.

For graphical-interface planning, use the [simple Workspace model](app-specification.md#workspaces-and-navigation): a collection and arrangement of Views, displayable in a tab or window. Decide bounded placement, focus, navigation/history, and transient inspection behavior using actual supported core capabilities. Keep exact retained-answer presentation and qualification visible. Shared Workspace purpose/defaults, specialized Workspace kinds, persistence, and a particular initial View are separate future choices, not prerequisites for this review. Opening a repository or subject is an explicit initial-View request when the action communicates that behavior; identify its scope and applicable resource constraints. Autonomous orientation outside that request requires an authorized resource policy before execution.
<!-- END PROMOTION CONTENT -->

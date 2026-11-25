# Proposed revisions to docs/backlog.md

Promote these changes with CLI retirement. Retain existing anchors for revised entries. They remain candidates, not implementation commitments; implementation timing and priority are unchanged.

## Add “Research observation and feedback support after CLI retirement”

<a id="research-observation-and-feedback-after-cli-retirement"></a>
## Research observation and feedback support after CLI retirement

Added: 2026-11-25
Origin: [CLI retirement and research-support gap](decisions/cli-shell-retirement.md#research-gap)
Area: human feedback, research observation, capture and delivery

CLI retirement removes the command-shaped feedback and observation implementation without a replacement human investigation interface. The foundation's [feedback](../foundation/product-design.md#inadequate-representations) and [research observation support](../foundation/product-design.md#research-observation-support) obligations, and the accepted client-neutral feedback contract, remain. Reconcile this capability gap when developing the relevant human interactions; removal is not conformance.

Support question-directed observation and deliberate inadequacy reporting with sufficient available context and delivery to the designated research destination. Feedback records experience, not program truth, correction or authorization for more investigation. Preserve actual displayed artifacts, exact output and available subject/basis/context without reconstruction; disclose missing context and delivery failure. Keep generated records separate from program evidence. Acceptance, cleanup and retention are distinct. This item does not select a GUI design, schema, general event framework, remote service or implementation schedule.

Carry forward the research-question-dependent captured-basis attribution need. Earlier command exports did not generally retain the association between a shown answer and its captured basis; paths, Session IDs, optional source-detail digests and references into a discarded store were insufficient. For research requiring that attribution, identify what retained or separately captured support makes the actual result and its qualifications interpretable, including selected prior accounts and organizing snapshots. Do not reconstruct provenance from a later working tree or assume a commit describes all inputs. Complete that reconciliation before relying on new records for basis-dependent claims. Full reproducibility, repository archiving and operational persistence are separate concerns.

The obsolete optional-CLI-recording and bounded observation-export remedies are replaced by this candidate. Retain their useful actual-display and captured-basis requirements without retaining their implementation premises. There is no requirement to implement observation support as part of shell retirement.

## Delete replaced candidates

Delete “Separate optional research recording from feedback context” (including its anchor) and “Preserve captured-basis attribution in observations”. Their remaining obligations are carried into the new entry above; historical findings are not rewritten.

## Replace “Decide how GUI Presentations and their parameters are represented”

## Decide how GUI Presentations and their parameters are represented

Added: 2026-10-06
Origin: representation audit finding [F5](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f5-presentation-choice-presentation-parameters-and-display-bounds-are-fused-into-format)
Area: presentations and GUI preparation

The internal application supplies qualified answers and precise references; CLI retirement removes its old format/bounds choices, compact aliases and mechanical-family Presentations. That does not supply GUI sorting, grouping, layout or expansion policy. Use the surviving [qualified application access](decisions/qualified-answers-over-contributions.md#qualified-application-access) and [retirement boundary](decisions/cli-shell-retirement.md#retire-client) without reproducing retired CLI formulas.

Exact retained access preserves qualified content and compatibility without fresh selection. Its historical CLI Presentation implementation is retired; the underlying access contract does not choose a GUI Presentation design.

Decide presentation choice, parameters, bounds and context for actual GUI capabilities. Determine which available-space, interaction, lifetime and usage differences affect the resulting View identity; do not assume all context is identity-neutral or blindly inherit CLI formulas. Assess reference lifetime and exact correspondence against the implementations resulting from the retained-answer and application-boundary work. Any new interface-specific compact-reference requirement needs its own design.

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes remain visible and attributable in the investigation, and how continuity relates to identity, before implementing a managed View lifecycle. Select research recording of those changes according to the research question. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection.

This remaining work needs decisions before GUI Presentation implementation, not before the bounded retained-answer or application-boundary capabilities. No multi-Projection GUI implementation is authorized here.

## Replace “Design bounded investigation and context exchange for external agents”

## Design bounded investigation and context exchange for external agents

Added: 2026-10-10
Origin: [Application specification integration contract](app-specification.md#shared-context-for-external-coding-agents)
Area: external-agent context and reference lifecycle

Choose a bounded useful exchange for external design and implementation agents, including agent-led or mixed investigation and conversations hosted elsewhere. An agent may request supported investigation or consult retained accounts without a preceding human investigation. Where the exchange uses focused/open Views, expose their qualified information without requiring manual translation into source coordinates. Distinguish exact retained Projection references from repeatable requests, disclose their lifetime and captured basis, and preserve source mappings, provenance, and relevant derivation. Assess current interfaces before selecting a transport or artifact format. Define which Workspaces/windows are included, how active focus is selected, and how the human can inspect that scope; a most-recently-active-window policy is a candidate, not an inherited requirement.

Revisit when a concrete coding-agent handoff, external investigation or shared-account
use case needs the exchange. Support for changing repository states may make a
repeated design-and-implementation workflow practical, but does not by itself
establish that an agent interface should be next. A human GUI, persistence and
changing-target support are not universal prerequisites for a bounded exchange.

If using a generated artifact, specify publication, revision, and evidence-exclusion behavior. Do not require richer Workspace purpose/context machinery or persistence just to share existing Views and focus. No particular agent host, file format, or implementation milestone is selected by this candidate.

Include the feedback path when PostCode output returns through repository comments,
documentation, commit messages, or agent contributions. Preserve supplied origin
and provenance through the exchange and subsequent analysis, keeping recorded
assertions distinct from established truth. Material derived from PostCode output
does not independently corroborate its originating conclusions. Origin may be
unavailable; this does not require detecting unknown derivation or preventing
useful artifact sharing.

The remaining internal API is not a supported external-agent interface. CLI retirement supplies no shared-context protocol or participant-contribution capability. When a concrete exchange requires contributions, define their provenance and evidential role in that scope. The modality candidate records the broader future capability; this entry does not select generalized capture, an acceptance workflow or a conversation host.

## Replace “Assess and preserve navigation-origin lineage”

## Assess and preserve navigation-origin lineage

Added: 2026-10-10
Origin: [Application specification conformance](decisions/application-specification-boundaries.md#adoption-and-conformance)
Area: investigation context, navigation provenance, interfaces

The internal application retains exact selected subjects and follow-up targets, but CLI retirement provides no replacement navigation interface or general origin-View lineage facility. Projections and observation batches do not by themselves reconstruct where the human found a reference. Disclose that limited context rather than claiming full investigation history.

Assess which supported human interactions establish discovery, source-navigation, and derivation origins, which existing records preserve them, and where origin is unavailable. Scope bounded retention and inspection support before claiming full navigation-origin history. Do not infer a source View merely because it previously displayed the same reference. Preserve qualified captured bases and distinguish navigation origin from program relationships and evidence dependencies. This does not require persistent Workspaces, a separately stored View object, or a general history service.

## Replace “Assess reference-lifetime disclosure in existing views”

<a id="assess-reference-lifetime-disclosure-in-existing-views"></a>
## Assess reference-lifetime disclosure in human output

Added: 2026-09-26
Origin: module investigation review and [reference lifetime disclosure](decisions/reference-lifetime-disclosure.md)
Area: presentation and Session references

Assess actual human output against the reference-lifetime requirement: when references expire before they can be used in a subsequent request, surrounding presentation must disclose that limit. A shared notice can cover affected references; ordinary follow-up references in a continuing Session need no repeated caveat. Encoding alone does not determine the audience.

The retired CLI had bounded verified lifetime notices for its affected program Views; that is historical evidence, not certification of another interface. Reassess actual future human output, including candidate references, operational reports and refusals, without carrying forward alias or shell-continuation assumptions. Preserve precise-reference meaning and qualified navigation. The retirement plan separately assesses its moved validation renderer's actual output obligations; this candidate covers remaining interface use rather than duplicate that bounded check.

Unknown conformance must remain explicit. The concern is misleading follow-up guidance, not altered reference binding or underlying program claims. No new interface or persistent reference mechanism is selected here.

## Replace “Review the investigation UI and UX as a whole”

## Review the investigation UI and UX as a whole

Added: 2026-09-23
Origin: human exploratory use of the completed interactive session on another repository
Area: presentations and interaction

Earlier shell use exposed overly wordy output and difficulty finding important information across repeated investigation. The CLI and its Presentations retire; these observations inform future human-interface design rather than a shell-formatting task. Evaluate the supported journey across inventory, organization, dependencies, inspection, qualifications and detail, using the available core capabilities. Preserve precise navigation, evidence attribution, qualification and consequential omission disclosure. Coordinate the [more-details placement review](#review-more-details-information-placement) with this broader work.

The [milestone-4 progressive assessment](../records/validation/module-investigation/pass-04/report.md) supplies captured examples of repeated accounts and accounting/evidence metadata obscuring what changed, limited evidence navigation, and standalone interpretive Views omitting effective compiler/configuration attribution available in the surrounding assessment record. Assess whether intelligible evidence attribution and bounded navigation help the human identify and evaluate support under the human output boundary. Missing source excerpts are not by themselves a deficiency. These are formative observations, not measured human usability results.

The [milestone-5 integrated assessment](../records/validation/module-investigation/pass-05/report.md) adds original/current account distinctions, causal warning pages and explicit conflicts to this journey. Assess whether repeated empty revision status obscures important warnings, and how users discover qualifications learned in follow-ups when the retained summary has no explicit correction. Preserve exact historical selection and avoid implying automatic synthesis or reassessment. The [focused dependent-account sequence](../records/validation/module-investigation/pass-06/report.md) supplies further qualitative evidence about dense repeated context and demanding wording around compatible replacement accounts, structural conflicts and local versus family selection. Evaluate support and provenance intelligibility rather than treating absent source excerpts as the problem. These captures do not establish measured human misunderstanding.

For graphical-interface planning, use the [simple Workspace model](app-specification.md#workspaces-and-navigation): a collection and arrangement of Views, displayable in a tab or window. Decide bounded placement, focus, navigation/history, and transient inspection behavior using actual supported core capabilities. Keep exact retained-answer presentation and qualification visible. Shared Workspace purpose/defaults, specialized Workspace kinds, persistence, and a particular initial View are separate future choices, not prerequisites for this review. Opening a repository or subject is an explicit initial-View request when the action communicates that behavior; identify its scope and applicable resource constraints. Autonomous orientation outside that request requires an authorized resource policy before execution.

Reconcile the existing GUI design-kickoff and analysis-needs notes with those
application boundaries before using them to guide new work. Revisit linked
Workspaces, saved-workspace/return journeys, summary-first assumptions, agent
focus across windows, and the N14 persistence and N18 agent-context requirements.
Use the simple Workspace and existing investigation context as the starting
point; persistence, a particular initial View, and cross-window focus selection
remain design choices. Opening a subject requests its initial View when that
behavior is communicated. Update stale foundation links as part of this
reconciliation.

Decide how visible Lens terminology and identifiers should be to users, and how an interface offers the applicable questions for a selected subject, captions answers and exposes meaningful parameters. The [Lens request-model plan](plans/lens-request-model.md) supplies explicit applicability and question definitions; it does not choose GUI controls or require the interface to use the word “Lens”. Keep these interaction choices in the broader UX review.

## Replace “Investigate analysis parallelism and asynchronous I/O”

## Investigate analysis parallelism and asynchronous I/O

Added: 2026-09-24
Origin: human observation that PostCode appears to use one CPU during analysis
Area: analysis execution and responsiveness

The surviving direct application executes one operation at a time in its caller's process. TypeScript construction/analysis and some filesystem work remain synchronous; owned Git work is asynchronous with explicit termination/exit monitoring. CLI retirement removes the private worker and its benchmark/profiling drivers without replacing them. This changes the measurement boundary, not evidence that analysis performance is sufficient or deficient.

When a concrete performance question warrants work, measure CPU use, stage-level wall time and memory on representative projects through the current direct boundary. Separate opening, first use and reuse; account for input validity, deterministic mechanical results, precise identity and resource ownership. Introduce successor measurement tooling only for that question. Do not assume asynchronous reads accelerate CPU-bound compiler work or that a new worker is required.

The [completed latency investigation](../records/validation/2026-09-21-analysis-latency.md), [processing audits](../records/audits/2026-09-27-foundation-readiness/README.md) and foundation-readiness measurements remain historical evidence. Their CLI publication and parent/worker costs do not describe the post-retirement runtime. This candidate does not authorize parallelism, a host redesign or a new benchmark project.

## Replace “Consider summary suggestions and recursive navigation”

## Consider summary suggestions and recursive navigation

Added: 2026-10-07
Origin: [Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)
Area: entry experience and navigation

The product permits suggesting a summary View when no more specific information need is expressed; it does not mandate that default. The application retains module interpretation after CLI retirement, but no replacement entry experience or navigation interface is selected. Consider whether summary suggestions and recursive navigation would be useful in future interface work, distinguishing coordination of qualified inputs from synthesis of a new answer. Define useful selection and omission disclosure without requiring a summary Lens for every subject. This does not authorize immediate GUI work.

## Sweep disposition for other candidates

The remaining candidates retain independent scope. In particular, generation provenance, fresh investigation/attempt history and bounded output filesystem fixes remain relevant. “Alias counting” in the filesystem-boundary entry concerns filesystem path aliases, not compact CLI references; do not remove that obligation by keyword matching. Historical shell examples in UI/UX evidence remain evidence, not a requirement to maintain their tooling. No other candidate is deleted or reprioritized. Recheck these dispositions against intervening backlog changes at promotion and the completed removal at implementation close.

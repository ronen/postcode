# Backlog

This backlog records worthwhile work and concerns that arise outside an active plan or authorized task. An entry is a candidate for consideration, not a commitment or authorization to implement. Its presence means that it remains open; no separate status is needed.

Keep entries concise but sufficiently contextual to remain intelligible. Remove an entry when it is incorporated into a plan, resolved, or declined. Carry any context worth preserving into the resulting plan or decision; Git retains the backlog's history. A consequential choice not to pursue something may warrant a decision record, but routine pruning does not.

The human evaluates backlog entries during planning as appropriate. Coding agents may add entries when directed by the development workflow, but must not prioritize, promote, implement, or remove them without human direction.

Use this form for new entries:

```markdown
## Short descriptive title

Added: YYYY-MM-DD
Origin:
Area:

Describe the need, why it matters, and relevant constraints without designing the solution prematurely.
```

## Candidates

<a id="complete-and-expose-generation-provenance"></a>
## Complete and expose generation provenance

Added: 2026-11-15
Origin: strategy discussion of agent attribution for logging, audits and historical accounting
Area: agent execution, investigram provenance and retrieval

Make the agent, subscription/account, model and relevant configuration used to
produce an investigram identifiable for later logging, auditing and historical
attribution. This is useful with a single configured agent, independently of
multiple-agent selection or change tracking.

Existing investigation provenance already captures configured agent identity,
instructions and configuration, including authentication/billing route and
reasoning settings. Call usage separately captures provider-reported model and
service tier. Assess gaps in capture and retrieval, particularly meaningful
subscription/account identification and connecting configured identity with
reported execution details. Preserve production-time information and disclose
unavailable or uncertain details rather than reconstructing them from current
configuration; account identification must not expose credentials. Reused content
keeps its original producer attribution.

Build on the common provenance ownership established by the approved
[structured-accounts plan](plans/structured-architectural-accounts.md), without
duplicating that migration. Scope the remaining capture and retrieval work from
the implementation available when this item is selected. A graphical display,
multi-agent support, freshness/reconsideration policies and automatic
reinvestigation are separate capabilities, not prerequisites or implied scope.

<a id="research-observation-and-feedback-after-cli-retirement"></a>
## Research observation and feedback support after CLI retirement

Added: 2026-11-25
Origin: [CLI retirement and research-support gap](decisions/cli-shell-retirement.md#research-gap)
Area: human feedback, research observation, capture and delivery

CLI retirement removes the command-shaped feedback and observation implementation without a replacement human investigation interface. The foundation's [feedback](../foundation/product-design.md#inadequate-representations) and [research observation support](../foundation/product-design.md#research-observation-support) obligations, and the accepted client-neutral feedback contract, remain. Reconcile this capability gap when developing the relevant human interactions; removal is not conformance.

Support question-directed observation and deliberate inadequacy reporting with sufficient available context and delivery to the designated research destination. Feedback records experience, not program truth, correction or authorization for more investigation. Preserve actual displayed artifacts, exact output and available subject/basis/context without reconstruction; disclose missing context and delivery failure. Keep generated records separate from program evidence. Acceptance, cleanup and retention are distinct. This item does not select a GUI design, schema, general event framework, remote service or implementation schedule.

Carry forward the research-question-dependent captured-basis attribution need. Earlier command exports did not generally retain the association between a shown answer and its captured basis; paths, Session IDs, optional source-detail digests and references into a discarded store were insufficient. For research requiring that attribution, identify what retained or separately captured support makes the actual result and its qualifications interpretable, including selected prior accounts and organizing snapshots. Do not reconstruct provenance from a later working tree or assume a commit describes all inputs. Complete that reconciliation before relying on new records for basis-dependent claims. Full reproducibility, repository archiving and operational persistence are separate concerns.

The obsolete optional-CLI-recording and bounded observation-export remedies are replaced by this candidate. Retain their useful actual-display and captured-basis requirements without retaining their implementation premises. There is no requirement to implement observation support as part of shell retirement.

<a id="investigate-hypothetical-and-intended-architecture"></a>
## Investigate hypothetical and intended architecture

Added: 2026-11-05
Origin: [Architectural modalities and current subset](decisions/specialized-architectural-investigation.md#architectural-modalities)
Area: architectural investigation, participant material and comparison

Support qualified investigation of hypothetical alternatives and intended designs alongside implemented architecture when concrete methods and use cases justify it. Current support remains implemented-only: module-originating prose interpretations, retained follow-up and exact presentation do not constitute general participant-material capture or hypothetical/intended account investigation. The absence of these capabilities is an accepted scope limit, not a newly demonstrated violation requiring speculative runtime changes.

Use concrete questions involving participant-supplied requirements, proposals, intentions or rationale, and where useful comparison with implemented accounts. Preserve the distinction between modality and provenance/epistemological status. Recording a proposal does not establish feasibility or acceptance; intended architecture does not establish realization. Scope a Lens to the modalities its method supports and qualify correspondence, consequences and unresolved relationships. Observed executions are evidence within their scope, not another modality.

Before implementing a selected capability, decide only the subject, basis, provenance, reference lifetime and contribution semantics it actually needs. Earlier Projections may contribute as qualified PostCode artifacts, never independent corroboration. Preserve supplied origin and the history of any proposal-to-intention transition without assuming PostCode owns architectural acceptance. Do not introduce modality fields, generalized input capture, acceptance workflows or migrations merely to anticipate the capability.

This candidate leaves detailed modality representation, account schemas, retrieval and selection, GUI design and broader sequencing to later work. Coordinate with [account exploration](#explore-architectural-accounts-through-journeys) and [external exchange](#design-a-bounded-shared-context-interface-for-coding-agents) without making either a prerequisite by assumption. Validate usefulness and qualification on the chosen journey before claiming broader support.

<a id="review-more-details-information-placement"></a>
## Review placement of information exposed by more details

Added: 2026-11-03
Origin: [Product-design reconciliation](plans/product-design-reconciliation.md#more-details)
Area: information presentation and progressive disclosure

The previous `--source-detail` interaction bundled source disclosure with other potentially useful information, making that information available only through the source escape hatch. That coupling was a design flaw: access to useful qualified information should not depend on requesting source. The minimal reconciliation replaces source disclosure with `--more-details`, preserving the other qualified information and its current placement. Review that information by purpose: what belongs in the default answer, what merits optional detail, and whether another interaction would serve the human better. Include dependency requests that did not establish edges, supporting explanations, evidence attribution, locations and implementation mappings. Their former inclusion in a source-escape option is not a reason to preserve that organization indefinitely.

Coordinate this bounded placement review with [Review the investigation UI and UX as a whole](#review-the-investigation-ui-and-ux-as-a-whole). Use concrete journeys to assess relevance and discoverability while preserving qualifications and bounded output. This is an improvement to information organization, not deferred conformance work or permission to restore the source escape.

<a id="explore-architectural-accounts-through-journeys"></a>
## Explore use of retained architectural accounts

Added: 2026-10-29
Origin: [Structured architectural explanation](decisions/structured-architectural-explanation.md)
Area: architectural investigation and presentation

The [structured-accounts plan](plans/structured-architectural-accounts.md) establishes the contribution/association mechanism, migrates existing producers and demonstrates state-dependent behavior with a bounded diagram. It does not select an initial user-facing investigation catalogue or prove usefulness in architectural practice. Do not treat those remaining product questions as missing mechanism conformance.

Explore how humans and agents use qualified overlapping accounts in concrete investigations, including composition across accounts and interaction/resource lifetimes. Consider a general state model versus scenario-specific models, shared versus local relationship identities, and when situations need a separate content type. Select additional concepts/diagrams only when use justifies them. Preserve qualifications, exact history, alternatives and the boundary between rendering and qualified synthesis. Use existing navigation, coordinated-View and external-exchange candidates rather than assuming new parallel infrastructure.

## Decide how GUI Presentations and their parameters are represented

Added: 2026-10-06
Origin: representation audit finding [F5](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f5-presentation-choice-presentation-parameters-and-display-bounds-are-fused-into-format)
Area: presentations and GUI preparation

The internal application supplies qualified answers and precise references; CLI retirement removes its old format/bounds choices, compact aliases and mechanical-family Presentations. That does not supply GUI sorting, grouping, layout or expansion policy. Use the surviving [qualified application access](decisions/qualified-answers-over-contributions.md#qualified-application-access) and [retirement boundary](decisions/cli-shell-retirement.md#retire-client) without reproducing retired CLI formulas.

Exact retained access preserves qualified content and compatibility without fresh selection. Its historical CLI Presentation implementation is retired; the underlying access contract does not choose a GUI Presentation design.

Decide presentation choice, parameters, bounds and context for actual GUI capabilities. Determine which available-space, interaction, lifetime and usage differences affect the resulting View identity; do not assume all context is identity-neutral or blindly inherit CLI formulas. Assess reference lifetime and exact correspondence against the implementations resulting from the retained-answer and application-boundary work. Any new interface-specific compact-reference requirement needs its own design.

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes remain visible and attributable in the investigation, and how continuity relates to identity, before implementing a managed View lifecycle. Select research recording of those changes according to the research question. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection.

This remaining work needs decisions before GUI Presentation implementation, not before the bounded retained-answer or application-boundary capabilities.

## Assess conformance when extending coordinated Views and state scope

Added: 2026-10-07
Origin: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md)
Area: qualified results, presentation composition and future lifecycle

The current implementation is a permitted limited subset of the broader product model. Before extending it, assess state-to-claim/evidence associations, meaningful ordering, capture timing and non-atomicity; input-level qualifications and partial outcomes; identity guarantees used for alignment; and distinctions among descriptive counts, overlapping populations and new analytical aggregates. Verify that each supplied Projection stays fixed and that arrangement cannot broaden its population through session access. No broad conformance audit has yet established these properties for future multi-input behavior.

Scope prerequisites to the introduced capability. Coordinating several existing Projections from one Session does not inherently require multi-state support or new capture identity. It does require attributable input meanings and qualifications, appropriate presentation descriptors and any question-selected observation descriptors, stable selected answers and visible composition changes. Choosing a qualified Projection selection versus coordinating supplied answers depends on requested meaning; neither new synthesis nor an outer Projection is required merely to share a display.

Current entity keys and several lookup/reuse paths are session-scoped and assume unchanged program inputs. Before introducing another capture, decide whether it belongs to a new Session or to a Session extended to support several captures, and how entity versions, record keys, reuse, associations and reference bindings distinguish their bases. Reusing a module key in the same namespace cannot by itself establish cross-state semantic correspondence. Assess affected schemas and method versions after choosing the design; this candidate does not prescribe a state-ID field in every record or a rewrite of every family.

Also assess View-to-View input dependencies and anchors: distinguish discovery lineage from a continuing dependency on another View’s supplied Projection or selection. Define handling of a changed or absent anchor without silent retargeting. This need does not create a third universal input-binding category or require a live View implementation now.

Before adding live refresh, multi-state analysis, cross-session coordination, workspace persistence or agent-context export, resolve the necessary reference/correspondence, result-selection, captured-result versus repeatable-request references, composition visibility, investigation-lineage and retention contracts for that capability. For multi-Projection output, assess the resulting View descriptions, any new research request records and any agent-context format together; the retired CLI descriptors and observation implementation are historical inputs, not current facilities. Preserve the actual Projections presented, their composition and captured-state associations within the investigation, and make composition/basis changes visible. Choose research recording of them for the research question, separately from any workspace-state retention; recording a change does not inherently require workspace persistence. Expose the choices actually made and their criteria at the time, rather than explanations reconstructed from subsequently changed defaults. Inspectability requires neither a general planner nor a separately stored plan artifact.

This candidate creates no schedule or requirement to implement those capabilities together. The [Lens request-model plan](plans/lens-request-model.md) incorporates the existing defects in request observations, unsupported-subject status and parameter descriptors. They remain defects until implementation corrects them and must not be excused as missing future features. Broader coordinated-View/state-scope conformance remains separately scoped here.

<a id="consider-summary-suggestions-and-recursive-navigation"></a>
## Consider summary suggestions and recursive navigation

Added: 2026-10-07
Origin: [Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)
Area: entry experience and navigation

The product permits suggesting a summary View when no more specific information need is expressed; it does not mandate that default. The application retains module interpretation after CLI retirement, but no replacement entry experience or navigation interface is selected. Consider whether summary suggestions and recursive navigation would be useful in future interface work, distinguishing coordination of qualified inputs from synthesis of a new answer. Define useful selection and omission disclosure without requiring a summary Lens for every subject.

<a id="assess-investigation-initiation-and-parent-attribution"></a>
## Assess investigation initiation and parent attribution

Added: 2026-10-10
Origin: [Application specification boundaries](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)
Area: request coordination, resource governance, observations

The completed [Lens request-model task](../records/tasks/2026-10-11-lens-request-model.md) implements bounded request, prerequisite and evidence-work attribution across current mechanical resolution, summary/follow-up Evaluation, investigator evidence access and publication. Parent descriptions, generating origins and current consumption travel with qualified outcomes. The [implemented attribution boundary](architecture/README.md#request-work-attribution) describes this support and its limits; do not duplicate that completed work here.

Retain the broader assessment for paths outside that scope and any independently substantial gaps identified by implementation. Establish which parent/trigger, initiator, captured-basis, outcome and resource relationships remain inspectable within the investigation and attributable in any research records that capture the work, including failure, reuse and cancellation; do not infer conformance from command names or request identifiers. The research observation/feedback reconciliation and navigation-origin candidates retain their own scope.

Preserve existing operation reuse, failure retention, cancellation ownership and construction boundaries. Record concrete remaining gaps rather than requiring a general planner or record for every helper. Do not defer a gap that prevents the planned request model from fulfilling its own contract. Complete the research-relevant assessment before relying on records for initiation/resource-policy evaluation. Independently establish authorization and investigation attribution before adding autonomous execution. Research selection does not defer a demonstrated operational attribution conflict.

<a id="design-a-bounded-shared-context-interface-for-coding-agents"></a>
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

<a id="assess-and-preserve-navigation-origin-lineage"></a>
## Assess and preserve navigation-origin lineage

Added: 2026-10-10
Origin: [Application specification conformance](decisions/application-specification-boundaries.md#adoption-and-conformance)
Area: investigation context, navigation provenance, interfaces

The internal application retains exact selected subjects and follow-up targets, but CLI retirement provides no replacement navigation interface or general origin-View lineage facility. Projections and historical observation batches do not by themselves reconstruct where the human found a reference. Disclose that limited context rather than claiming full investigation history.

Assess which supported human interactions establish discovery, source-navigation, and derivation origins, which existing records preserve them, and where origin is unavailable. Scope bounded retention and inspection support before claiming full navigation-origin history. Do not infer a source View merely because it previously displayed the same reference. Preserve qualified captured bases and distinguish navigation origin from program relationships and evidence dependencies. This does not require persistent Workspaces, a separately stored View object, or a general history service.

## Qualify evidence that modules are used for testing

Added: 2026-10-03
Origin: human discussion of test-code visibility in the planned GUI
Area: mechanical analysis and presentation

Investigate mechanical signals that a module is used for testing, including
weaker location and naming clues (such as a top-level `test` directory or a
`*.test.*` filename) and stronger evidence from known test frameworks.
Distinguish what each signal establishes: a matching path or name, selection as
a test entry by a runner's effective configuration, or a recognized test
registration. Imports of testing APIs alone need not establish either of the
latter claims.

Assess which claims are practical across configurable discovery rules, globals,
wrappers, and helper modules. Failure to recognize a signal must not imply that
a module is non-test, and no such signal alone establishes that its contents
are exclusively for testing. Consider how UIs could offer filtering or
collapsing choices based on these distinct signals, with their epistemic
qualifications visible and the treatment of unclassified modules explicit.

## Configurable investigator model and reasoning effort

Added: 2026-09-30
Origin: human discussion following the ChatGPT-plan route's model-availability check
Area: investigator configuration and usability

Allow users to choose the investigator's model and reasoning effort from the
configurations supported by their provider, account and authentication route.
The module investigation assessment required a human-selected alternative when
its intended model was unavailable through ChatGPT plan usage; product support
should make such choices accessible without implementation edits.

Provide defaults or recommendations, potentially per provider and access route,
with an explanation of expected quality, latency and usage tradeoffs and their
uncertainty. Recommendations could begin as curated defaults; automatic model
selection and comparative benchmarking are separate possibilities.

Preserve the effective configuration in investigation provenance and usage
reports. Define when configuration changes take effect and how they interact
with retained outcomes, without silently regenerating earlier investigations or
switching billing routes.

## Consider grouping investigation operations in one dialogue

Added: 2026-09-29
Origin: module investigation discussion of reusable operations and composite lenses
Area: investigation execution and efficiency

The [operation/lens separation](decisions/investigation-operations-and-lenses.md)
allows evaluation to identify investigation work independently of its consuming
lenses. The [module investigation slice](plans/module-investigation.md) executes
each missing operation in a fresh dialogue.
Assess whether grouping several selected operations in one dialogue improves
context reuse, latency, or usage sufficiently to justify the added complexity.

Define submission and outcome boundaries, independent success or failure,
execution limits, usage attribution, and the effect of shared context on
citation indexes and correction eligibility. Preserve qualified results and
operation provenance, and compare interpretive quality with separate dialogues;
selecting several operations does not itself require grouped execution.

<a id="provide-git-history-as-investigator-evidence"></a>
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

## Correct output boundaries across different filesystem case rules

Added: 2026-09-28
Origin: foundation-readiness M3 review, O1 and O2; explicitly deferred by the human when accepting M3
Area: generated-output evidence boundaries

The current case probe assumes one rule per device and folds an entire lexical
path according to its resolved parent's rule. A controlled filesystem model
confirms two defects: directories with different case rules on one device can
cause generated output to be missed or source to be excluded (O1); a sensitive
lexical prefix linked into an insensitive filesystem can exclude a distinct
case-differing sibling (O2). The local APFS checks do not exercise either layout.

Correct these while preserving shared compiler/repository exclusions, alias
counting, missing suffixes, original path spellings and replay invalidation.
Unknown explicit boundaries must still fail visibly rather than use a guessed
rule. Component-specific case observation needs assessment, including directories
that offer no usable spelling probe. This entry is a deferred concern, not platform
certification or authorization to implement. See the
[M3 disposition](../records/reviews/foundation-readiness/2026-09-28-m3-acquisition-lifetime-disposition.md)
and [preserved model evidence](../records/validation/foundation-readiness/2026-09-28-m3-round-2.md).

<a id="assess-reference-lifetime-disclosure-in-existing-views"></a>
## Assess reference-lifetime disclosure in human output

Added: 2026-09-26
Origin: module investigation review and [reference lifetime disclosure](decisions/reference-lifetime-disclosure.md)
Area: presentation and Session references

Assess actual human output against the reference-lifetime requirement: when references expire before they can be used in a subsequent request, surrounding presentation must disclose that limit. A shared notice can cover affected references; ordinary follow-up references in a continuing Session need no repeated caveat. Encoding alone does not determine the audience.

The retired CLI had bounded verified lifetime notices for its affected program Views; that is historical evidence, not certification of another interface. Reassess actual future human output, including candidate references, operational reports and refusals, without carrying forward alias or shell-continuation assumptions. Preserve precise-reference meaning and qualified navigation. The retirement plan separately assesses its moved validation renderer's actual output obligations; this candidate covers remaining interface use rather than duplicate that bounded check.

Unknown conformance must remain explicit. The concern is misleading follow-up guidance, not altered reference binding or underlying program claims. No new interface or persistent reference mechanism is selected here.

<a id="retry-failed-or-incomplete-interpretation-without-restarting-the-session"></a>
<a id="explicitly-rerun-a-successful-interpretation"></a>
## Expose fresh investigation and attempt history in interfaces

Added: 2026-09-24
Origin: module investigation planning discussion; [fresh-investigation contract](decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse)
Area: investigation interaction and recovery

The application now supports explicitly requesting a fresh investigation within the
supported Session, including after successful, failed or incomplete attempts; see
the [structured-accounts completion record](../records/tasks/2026-11-15-structured-architectural-accounts.md).
The remaining work is the interface interaction for requesting a new attempt and
navigating qualified answer and attempt history, rather than a new retry engine.

Distinguish fresh production from ordinary reuse, exact retained presentation,
investigation of selected content and invocation of a follow-up option. Make
execution cost, progress and failure understandable. A reason or reconsideration
flag is not required to request fresh investigation. Choose controls for the
interface that needs them; dedicated CLI syntax and model-configuration UI are
not prerequisites.

Preserve earlier accepted information and actual attempt provenance. Fresh execution
does not automatically displace earlier uses, reinstate withdrawn designations or
clear reconsideration; recency does not imply priority. Ordinary requests retain
their reuse and retry rules, and Session validity, execution authorization and
resource limits still apply. This does not change mechanical-analysis retry policy.

## Investigation usage and budgeting support

Added: 2026-09-24
Origin: module investigation planning discussion of execution containment and usage allowances
Area: investigation usage and budgeting

Consider user-set allowances for hosted inference, separate from the per-evaluation
mechanism that contains runaway investigations. Module investigation
includes basic per-investigation and session usage reporting, with explicit coverage
limits, but no budgeting interface. Future support could use those measurements
to prevent a new investigation from starting once an allowance is exhausted,
at coarse granularity without interrupting work in progress.
Define allowance scope, configuration, measured units, and enforcement limitations;
a token allowance is not a guaranteed monetary ceiling, and admission checks can
permit an in-flight investigation to exceed the remaining allowance.

Local inference may remove the need for provider-spending controls, but runaway
containment remains useful for responsiveness and resource use. Keep that mechanism
independent of budgeting support so it applies to either hosted or local execution.
Retain available provider usage metadata without assuming every integration reports
the same measures or supports precise cost accounting.

<a id="reconsider-investigrams-after-context-corrections"></a>
## Reassess contributions and clear specific reconsideration causes

Added: 2026-09-25
Origin: [Association exposure and reconsideration](decisions/association-organization-and-exposure.md#exposure-and-reconsideration)
Area: retained analysis and qualification

The first mechanism derives cause-bearing concerns from exact exposure, acquired inventory/selection scopes and designated membership. It does not clear them. Assess practical burden using representative causes, baseline identification scopes and no-change outcomes; authored propagation counts are not estimates of user warning rates.

Explicit user-requested fresh investigation is in scope of the structured-accounts plan, but does not itself clear earlier concerns. Design qualified reassessment for a specific target and cause, including a finding that the earlier information remains appropriate. Preserve original content, inputs and independent causes. Specify effects on downstream concerns without asserting that downstream content itself was reassessed. Clearing one path must not clear unrelated paths or reinstate displaced associations. Keep current standing of the historical cause inspectable.

Automatic reassessment of immediate dependents or currently/recently viewed information is a possible later policy, with explicit resource and initiation authority. It is not implied by warnings, human browsing or hosted-service enablement. Consider targeted producer suppression or directed propagation only with accountable qualified grounds and retained history.

## Investigate multi-project repositories

Added: 2026-09-25
Origin: human request to understand interrelated projects in a monorepo
Area: project scope and repository-wide investigation

PostCode currently opens one configured project per session, even though the
enclosing repository may contain several related projects. Investigate how to
identify and present those projects as useful organizational boundaries while
also reasoning about the behavior and dependencies of the collection as a whole.
Account for relationships that cross project boundaries, shared or overlapping
module populations, and differing project configurations without treating
repository layout alone as proof of a project's semantic boundary. Preserve the
scope and evidence behind both project-level and collection-level conclusions.

<a id="review-the-investigation-ui-and-ux-as-a-whole"></a>
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

## Investigate analysis parallelism and asynchronous I/O

Added: 2026-09-24
Origin: human observation that PostCode appears to use one CPU during analysis
Area: analysis execution and responsiveness

The surviving direct application executes one operation at a time in its caller's process. TypeScript construction/analysis and some filesystem work remain synchronous; owned Git work is asynchronous with explicit termination/exit monitoring. CLI retirement removes the private worker and its benchmark/profiling drivers without replacing them. This changes the measurement boundary, not evidence that analysis performance is sufficient or deficient.

When a concrete performance question warrants work, measure CPU use, stage-level wall time and memory on representative projects through the current direct boundary. Separate opening, first use and reuse; account for input validity, deterministic mechanical results, precise identity and resource ownership. Introduce successor measurement tooling only for that question. Do not assume asynchronous reads accelerate CPU-bound compiler work or that a new worker is required.

The [completed latency investigation](../records/validation/2026-09-21-analysis-latency.md), [processing audits](../records/audits/2026-09-27-foundation-readiness/README.md) and foundation-readiness measurements remain historical evidence. Their CLI publication and parent/worker costs do not describe the post-retirement runtime.

## Evaluate independent TypeScript versions for building and analysis

Added: 2026-09-14
Origin: human-directed process review of implementation conventions
Area: toolchain and TypeScript language integration

The current dependency layout uses one installed TypeScript version both to build and type-check PostCode and to analyze subject projects at runtime. Evaluate whether to separate those roles so the build-time compiler can evolve for development convenience while the runtime analyzer remains deliberately pinned and changes only with semantic fixtures and analysis-identity review. Preserve a clear account of which analyzer version establishes each result. If the roles are separated, revise the implementation convention so build-only TypeScript upgrades no longer require runtime-analyzer semantic verification.

## Assess dependency coverage beyond actual acquisition

Added: 2026-11-15
Origin: [Exposure limits](decisions/association-organization-and-exposure.md#exposure-and-reconsideration)
Area: retained analysis and reconsideration

Exact acquisition and scoped inventories do not establish complete semantic dependencies. An earlier conclusion can be affected by a later waiting case even when its producer received only one description, with no inventory covering that addition. Do not fabricate exposure or broaden every Entity reference to all future information to hide this limit.

Collect concrete examples from use before choosing among declared dependencies, producer-directed propagation, targeted suppression or improved acquisition. An eager producer might inspect earlier exposed results and identify particular affected ones; that requires a separately designed access and qualified-declaration contract. Compare this with explicit dependencies on content/use coverage. None replaces truthful actual-delivery provenance. Fix defects in promised propagation independently of this broader candidate.

Also preserve the accepted reuse-without-acquisition limit: a new association can reference an old item without delivery of its source association, leaving no exposure path from later displacement of that use. Existing references/deliveries can support an audit if useful. Defer a dedicated retained “used without delivery” field and any propagation dependency derived from it; neither is required by structural acceptance.

## Investigate identity correspondence and organizing declaration challenge

Added: 2026-11-15
Origin: [Common identities](decisions/common-analysis-contributions.md#identified-things-and-inquiry-results) and [association declarations](decisions/association-organization-and-exposure.md#qualified-declarations-and-exact-uses)
Area: identity and retained information

Investigate needs for explicit Entity supersession, merge/split correspondence, and any resulting lookup or reconsideration effects. Presently, independently identified things remain distinct; qualified correspondence does not redirect IDs or merge histories. New Entities and explicit associations can describe conflation without pretending earlier references meant something else.

Consider challenging, reinstating or withdrawing declarations as judgments distinct from displacing their designated uses. Current re-adoption uses a new addition and leaves earlier displacement intact. Define authority, exact targets, causes and competing interpretations before adding a reversal calculus. A policy preventing deliberate producer reassertion, if needed, belongs here or in a separately scoped host policy; equivalent recomputation already does not renew associations automatically.

A minimum-guarantee or guarantee-ranking selector is also deferred. Scoped epistemic guarantees do not form a universal ordered scale. Preserve explicit method/scope/guarantee changes in supersession grounds without introducing a numeric or total-order preference by default.

## Explore organization of contributions and architectural entities

Added: 2026-11-15
Origin: [Flat contributions](decisions/common-analysis-contributions.md#immutable-analysis-contributions)
Area: retained-information organization

The common model has no investigram parent/child tree. Evaluate organizational needs before introducing nesting or other grouping, whether agent-authored, mechanically inferred, based on UI context, or combined. Keep contribution organization separate from the provenance of investigations of selected content, result membership and relationships in the system under study.

Also examine architectural Entity organization when concrete investigations need it. Existing qualified module/group organization can inform this without being conflated with a canonical architecture or a hierarchy of explanations. No new organization mechanism is required merely because the retained information grows.

## Explore concept-informed investigation relevance

Added: 2026-11-15
Origin: [Content and catalogue responsibilities](decisions/structured-architectural-explanation.md#content-and-catalogue-responsibilities)
Area: architectural concepts and investigation guidance

Qualified concept classifications and exact follow-up options permit future concept-specific behavior without an exhaustive ontology. Assess whether operation knowledge belongs in PostCode guidance, agent judgment or both. Optional icons and advisory relevance classifications can inform presentation but must not masquerade as hard applicability constraints.

Soft signatures listing recommended categories are one possible design, distinct from existing required subject signatures. A missing recommendation does not establish irrelevance, and an advisory mismatch does not make an operation invalid. Global catalogue selection, ranking, UI demotion and follow-up-option lifecycle/result-reuse advice need their own demonstrated need.

## Consider participant objections and semantic-policy assistance

Added: 2026-11-15
Origin: [Acquisition policy](decisions/association-organization-and-exposure.md#acquisition-baseline-context-and-discovery)
Area: investigator interaction and validation

Current inadequacy feedback goes to developers/researchers; it does not challenge retained information or instruct an investigating agent. A user-facing objection/reconciliation mechanism would need an explicit qualified input and resource contract rather than reusing observational feedback silently.

If live experience shows instruction-following problems, consider semantic-policy assistance in the dialog: point out a suspected omission, permit further acquisition or explanation, and then validate the final submission. Decide any completeness or prior-acquisition gates separately. Acknowledging a reminder does not establish understanding. Structural integrity and honest delivery remain mandatory regardless of assistance.

## Assess artifact capture and cleanup in failed trials

Added: 2026-11-25
Origin: controlled failure cases for the structured-account trial runner during [CLI shell retirement planning](plans/cli-shell-retirement.md)
Area: development trials, artifact capture and budget cleanup

A failed trial can contain attempt reports but lack a completed step record or final usage summary. In the standard runner, a Session close failure can mask the request error and skip closing the budget lease. The dialog14 runner attempts budget close even when Session close fails. The CLI retirement plan preserves these existing behaviors during separation.

Determine which completed artifacts and known usage a failed or interrupted trial should retain, how to identify incomplete capture, and how callers should learn both the original failure and any cleanup failure. Assess budget release separately from the accounting for requests already reserved before dispatch.

<a id="preserve-opening-and-cleanup-failures"></a>
## Preserve simultaneous application-opening and cleanup failures

Added: 2026-11-25
Origin: [CLI shell retirement lifecycle checkpoint](../records/validation/cli-shell-retirement/README.md)
Area: application opening and resource ownership

Before an application Session is returned, the existing opening catch awaits owned
Git cleanup before propagating the acquisition error. If both fail, the cleanup
failure replaces the acquisition error. Controlled process-creation and cleanup
substitutes reproduce this: an acquisition defect plus `CleanupIncomplete` returns
only `CleanupIncomplete`. Cleanup failure is visible, but the original cause is lost.

Assess preservation of both opening and cleanup causes without implying that a
cleanup deadline confirms resource exit. This is separate from the approved
active-Session terminal-abort correction; no new opening lifecycle is selected here.

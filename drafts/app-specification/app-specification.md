# Application Specification

## Role and scope

This is the human-maintained, governing specification of PostCode's intended application behavior and high-level application design. It conforms to the [research product design](../foundation/product-design.md), uses the terminology in [core concepts](core-concepts.md), and is implemented subject to [architectural constraints](architectural-constraints.md) and accepted [decisions](decisions/README.md).

The research foundation establishes the concepts and commitments necessary for research evaluation. This specification makes application choices within them. Core concepts defines shared meanings; constraints states binding cross-cutting implementation rules; decisions preserve consequential choices and their rationale. [Implemented architecture](architecture/README.md) describes the current realization. Conflicts among governing documents require explicit human-directed resolution, not an automatic choice of whichever document is most convenient.

This document describes intended behavior, not a claim that every capability exists. [Project status](../STATUS.md) and the [capability reference](capability-reference.md) describe current support. Adoption does not authorize implementation, select delivery dates, or remove documented conformance gaps. A supported subset must describe its limits accurately. A conditional guarantee applies whenever the relevant capability is offered; it does not by itself require immediate implementation of that capability.

Agents may prepare specification changes under explicit human direction during design or planning. Implementing agents must report gaps or contradictions rather than change this specification as part of implementation. Consequential changes require accepted decisions; semantic changes to core concepts and substantive changes to constraints retain their corresponding decision requirements. [Document allocation and application contracts](decisions/application-specification-boundaries.md) establishes this arrangement.

## UX

### Working through qualified views

The human investigates software through read-only Views and directs program changes through coding agents. Interaction can be graphical, prose-based, command-line, or machine-readable. These interfaces use the same conceptual model and epistemological contract; they need not expose identical interaction facilities or all capabilities at once.

The working surface supports following subjects, relationships, and questions without routinely translating them into source coordinates. Text is a first-class Presentation. A useful explanation may contain interpretation, provided its status and supporting basis remain apparent. Qualification is information needed to understand the answer, not merely a warning hidden in documentation.

Presentations can support selection, inline detail, navigation, expansion of evidence and qualifications, and opening related Views. Exact controls, gestures, keyboard bindings, visual encoding, and layout are UX choices. The interface need not expose the word “Lens” or internal Lens identifiers. Named actions such as “Explain” can still have stable meanings and appear in menus, shortcuts, and capability documentation.

### Workspaces and navigation

A Workspace is a collection and arrangement of Views. A tab can contain several Views, and a Workspace can be displayed in a separate window. The exact tab/window treatment depends on shared interface controls. Opening related information inline or alongside existing information supports exploration without requiring a new top-level context for every answer.

Workspace organization is distinct from program structure, a View's composition, and an analysis Session. Several independent Views arranged together remain several Views. A single coordinating Presentation may instead instantiate one View over several Projections. Placement does not establish a program relationship or change an input binding.

The starting Workspace model requires neither a name, a permanent root subject, a formal task, nor a shared-context object. Ordinary focus supports interaction. An investigation can move beyond the subject from which it began. Avoid requiring the human to maintain a conceptual hierarchy merely to arrange related answers.

Navigation allows a displayed subject or relationship to become the subject of another question. A resulting View may be embedded, opened alongside its origin, or opened in another Workspace. Preserve relevant discovery and derivation information independently of placement: closing or moving a visible intermediate View must not be treated as evidence that no earlier relationship existed. Concrete history retention remains subject to the supported lifecycle.

Do not assume a uniquely correct hierarchy of the program. Containment may be hierarchical; dependencies, calls, evidence, tests, and other relationships offer different paths through an investigation. Files and directories are available through the source escape hatch rather than serving as the primary organizing model.

Richer shared investigation context, specialized Workspace kinds, and their corresponding initial Views remain future UX possibilities. They are not prerequisites for the simple Workspace. If introduced, shared context must not imply that all member Views share a subject or captured state, or that one View supplies evidence for another.

### Initial views and further investigation

Explicit information needs and choices take precedence. No particular Lens or initial View is prescribed as an application-wide default. PostCode may select or suggest an appropriate starting View when the human leaves that choice open. Selection and consequential omissions remain inspectable.

A summary View is one possibility. It may coordinate independently qualified Projections, present a synthesized account produced by a Lens, or combine both. A summary View does not require a summary Lens for every subject. An omitted aspect does not establish absence, unavailability, or unimportance. Additional investigation to construct a suggestion is request-scoped when it serves a parent request; without such a parent it is autonomous and follows the resource rules below.

### Source escape hatch

PostCode provides an identifiable route to source-level detail, conventional source, documentation, files, and other repository artifacts. Source access is legitimate: it can provide implementation detail, support verification, or allow investigation beyond current conceptual capabilities. Its use is a source excursion, recorded with the actual level of detail disclosed.

Conceptual terms are the default where evidence supports them. A language-specific analysis can establish a conceptual property without displaying the language-specific rule initially. Necessary qualification remains visible; supporting rules, declarations, locations, or excerpts may then be disclosed progressively. These disclosures also count as source excursions, rather than a silent fallback to source representation.

A file reached through the escape hatch can become a subject of further investigation; retain that source-navigation origin. Conventional source follows the Lens/Projection/Presentation model: a source Lens supplies qualified source information for a subject and captured basis, and a source Presentation exposes it. This does not select a command name or mandate full-source display in every interface.

Evidence displayed for a claim comes from its supporting capture, not a later filesystem read. Disclose actual source exposure in every Presentation, including expansions and exports. Internally possessing captured source is not itself human-facing source disclosure.

## Requests and capability behavior

### Interpreting and resolving requests

A request may specify any combination of subjects, Lenses, Lens parameters, Presentations, and Presentation parameters. PostCode may select unspecified elements to answer the expressed information need. The resolved choices, consequential criteria used at the time, and omissions remain inspectable; later defaults must not be used to reconstruct a different explanation of an earlier choice.

Subject designation, selected subjects, Lens parameters, designated program inputs, captured basis, and presentation/execution choices have distinct meanings. A request about output length changes presentation when it only abbreviates display; changing requested information or synthesizing a shorter account belongs to Lens selection or parameters. Execution budgets constrain effort rather than silently narrowing the question.

Request interpretation can consume qualified information but must not itself establish the program population or other program claims. When resolution needs additional investigation, obtain it through Evaluation and core construction. Preserve attribution to its results and qualifications even when the parent request remains ambiguous or cannot be resolved. Established candidates, missing population coverage, unsupported applications, unavailable analysis, and an established empty result must not collapse into an undifferentiated “not found.”

These responsibilities do not prescribe a universal planner, stored plan, request schema, selection algorithm, or new clarification dialog. They do not supersede existing family-specific result/retention contracts. A later request-model change must explicitly reconcile those contracts; the location of planning logic is not permission to silently remove currently retained outcomes.

### Shared contracts and the toolbox

Specific investigations are documented in the [capability reference](capability-reference.md), including supported subjects, options, presentations, and limitations. Their early implementation does not make them core architecture. A particular Lens or View becomes an explicit application requirement when a deliberate UX design depends on it, not merely because it appears in the current toolbox.

The architecture and semantic contracts apply across capabilities. Illustrative families in the [research design](../foundation/product-design.md#illustrative-lens-families) remain examples, not a prioritized implementation catalogue or universal ontology. Adding a capability requires its own appropriate design and implementation authorization.

Conditional guarantees remain important. Test views distinguish apparent intent, realization, behavioral evidence, and necessary language/runtime mechanisms. They should use the highest useful abstraction that preserves what the test establishes; not every test has a language-independent description. Written requirements are assertions, inferred requirements are interpretations, and test or type-system evidence establishes only its qualified scope. Candidate boundary groupings expose supporting and contrary evidence, cross-boundary dependencies, and ambiguity; they must be able to report that no clean boundary is evident. Runtime observations remain qualified by the execution or interval observed.

## Semantic contracts and guarantees

### Qualification and presentation

Preserve claim evidence, provenance/method, scope, epistemological status or guarantee, and limitations through every supported operation. Mechanically derived information, recorded assertions, observations, and interpretation remain distinguishable. Confidence expressed by a human or model does not strengthen a claim. Consequential qualification survives into human-readable and machine-readable Views.

Presentations can sort, group by supplied fields, filter, disclose detail, and count explicitly identified supplied populations. “87 dependencies; showing 20” is valid when the supplied qualified population or total establishes 87. Twenty supplied records alone cannot establish 87; counting overlapping rows does not establish distinct entities without established correspondence. Counts do not imply complete analysis.

New classifications, correlations, correspondence, flows, synthesized explanations, or other program claims require analysis and qualified Projections. Displaying two results together is not evidence of a relationship between them. Preserve each contributing Projection's subject, Lens, parameters, captured basis, qualification, and relevant outcomes. Consequential filtering, aggregation, grouping, and omissions remain visible. Ordinary layout and interaction are not restricted to an exhaustive whitelist of computations.

Adding or removing a Projection changes View composition; expose and record it. Replacing displayed information with newly captured results changes its basis; expose and record that too. Neither is merely a rendering-context change.

### Captured answers, bindings, and refresh

Use the [input and binding definitions](core-concepts.md#program-inputs-bindings-captured-states-and-projection-requests). Following inputs are resolved again for subsequent requests; pinned inputs reuse the same captured state. Neither policy makes a retained Projection mutable, nor guarantees atomic or synchronized capture. Runtime inputs can use execution-, interval-, or stream-appropriate bindings while identifying the observations actually captured.

Preserve associations between claims and their supporting states, including order or roles, timing, and capture limitations. Later observations cannot silently support an earlier interval. A branch designation, Session identifier, or identical label does not identify the captured basis or establish correspondence across states.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualification. An interaction that instead refreshes selection must make that behavior apparent and disclose consequential changes. Newly available interpretations or correction selections can change an answer without changing the program capture. Disclosed reselection is not equivalent to presenting an exact retained answer; every identifier change or independent fresh request does not require a comparison warning.

### Immutable results and interpretation history

**Retained evidence and qualified results are immutable.** Subsequent analysis, corrections, or refreshed inputs do not alter their content or supporting context. New information produces new records or explicit relationships, while existing references retain their original meaning.

This preserves the basis of dependent results and what an earlier investigation received or established. Immutability is not a requirement for every piece of application state: focus, arrangement, defaults, selected display accounts, and current derived reconsideration status can change. It does not prescribe programming-language immutability or UI state-management techniques.

**Immutability is distinct from retention.** Retention duration, disposal, restart persistence, and cross-session access require separate policies. A discarded result must not silently give its reference a different meaning, but immutability does not imply perpetual retrievability. Disclose reference lifetime where a displayed reference will expire before follow-up use.

Corrections and disagreements remain identifiable. A replacement does not erase the original or establish its own truth. Where an account is selected for display, expose the correction and competing alternatives with their qualifications. Presentational selection does not resolve interpretive disagreement. Earlier interpretations and correction history remain accessible within the supported retention lifecycle; this is intended UX behavior supporting explanation and trust, not an indefinite archive promise.

Keep result composition, later investigation provenance, correction relationships, citations, and workspace lineage distinct from one another and from program relationships. Existing [interpretation contracts](decisions/investigrams-and-progressive-investigation.md) govern exact-original access, replacement selection, atomic acceptance, conflicting corrections, and correction-aware evidence delivery. Detailed algorithms remain in those decisions rather than being silently replaced by generic wording here.

Reconsideration indicates that interpretation content supplied to an earlier investigation has been corrected, directly or through cited context under the applicable propagation rules. Exposure does not prove reliance, comprehension, or endorsement. The warning does not establish that the account is wrong, invalidate the Session, or automatically trigger inference. Current derived status can change without rewriting the account or its exposure history.

### Identity, labels, and continuity

Identity, implementation identifiers, displayed labels, and navigation handles remain distinct. Interpreted labels retain their provenance and status; a label change is not a program change. Exact identifiers and source mappings remain available for traceability and coding-agent coordination, with source disclosure classified appropriately. Language-independent terminology can emerge through use without imposing a universal naming vocabulary.

Continuity of investigation across program change remains an intended direction. Its implementation and precise UX/lifecycle requirements are deferred until experience with the application provides a better basis. This does not weaken current immutable-result, reference, capture, or qualification contracts. Prudent design should avoid obvious obstacles without speculative persistence infrastructure.

The direction preserves earlier attention without inventing successor entities. When future navigation maintains live anchors or input dependencies, uncertainty or disappearance must not silently retarget or destroy the human's investigation. Discovery, placement, derivation, binding, and investigation role remain distinct. Moving a View or opening another Workspace does not by itself change its basis or erase its lineage. Exact anchor behavior, refresh triggers, save/resume, and multi-capture Session mechanisms remain later design choices.

### Comparison and conceptual change

Applying a Lens at two states and presenting the results together permits comparison without claiming to have identified changes. Alignment uses established correspondence or exact identity guarantees within their scope; matching path labels alone does not establish semantic continuity.

Identifying additions, removals, correspondence, changed relationships, or significance requires a qualified comparison or conceptual-diff Lens. Such a capability can use ordered states, with roles and intermediate evolution where relevant. A subject-oriented change summary and a change-oriented account can organize the same evidence differently.

Different perspectives on change may coexist: mechanically derived dependency changes, interpreted responsibility movement, test-supported behavior, or asserted requirement correspondence. Expose selection criteria, supporting methods, alternatives, and omissions without implying one uniquely correct account. Analysis behavior must be stable or versioned sufficiently that PostCode changes do not masquerade as program changes. No particular diff command or prioritized comparison Lens is selected here.

## Application architecture and extensibility

### Responsibilities and boundaries

Core concepts defines the meanings; architectural constraints is the operational source for binding cross-cutting rules. The architecture separates these responsibilities without requiring independently materialized stages or a particular package layout:

| Responsibility | Contract |
| --- | --- |
| Request interpretation and coordination | Resolve expressed needs and choices using qualified information; request missing work; preserve resolution outcomes, attribution, and consequential choices. |
| Lens requirements | Identify the information requested of a subject, with meaningful parameters and applicable supporting analyses or operations. |
| Evaluation | Coordinate analysis, compatible reuse, execution constraints, evidence, and qualified outcomes. Interpretation participates through the investigation boundary. |
| Projection construction | Select qualified materialized information and relevant outcomes into an addressable retained answer. |
| Presentation and interaction | Arrange supplied answers, preserve their meaning, disclose omissions and source detail, and issue further requests when interaction needs new information. |

A Lens is distinct from reusable operations supplying its information. Several analyses or qualified results can contribute to one answer; several answers can be coordinated without creating another Lens. New synthesis is analysis. Neither one operation per Lens nor a distinct “composite Lens” category is a universal requirement.

Rendering and arrangement do not initiate Evaluation or independently query accumulated state to broaden an answer. Interactions requiring additional information return through request coordination, Evaluation, and core construction. Standard expansions remain subject-kind detail declared before evaluation; another Lens question is not made a standard expansion by inline placement. The [qualified-construction boundary](decisions/qualified-projection-construction.md) and its scoped binding-only capability remain in force.

Shared, lazy, staged, or presentation-guided execution is permitted when it preserves Lens meaning, qualified populations, materialization, and retained-result semantics. Pushdown does not reclassify presentation parameters as Lens parameters. Current eager builders are a scoped implementation choice, not a universal requirement.

### Design freedom and extension evidence

Human-directed design establishes meanings, guarantees, major responsibilities, ownership, lifecycles, and permitted dependencies. Within those constraints, implementing agents choose delegated representations, algorithms, and module organization, explain consequential choices, and verify their effects. They seek direction for changes to governing contracts or boundaries, undelegated consequential policy, or contradictions; local mechanics do not require routine human selection.

Extensibility should be demonstrated through representative additions, not merely asserted through a registry design. An ordinary interpretive capability and a mechanical capability using established information can exercise whether capability-specific work remains local and common request, qualification, presentation, and reporting facilities are reused appropriately. New semantics may require new analysis or Presentation code; the criterion is coherent responsibility rather than a promise that every Lens needs only a prompt.

Specific representations, registration mechanisms, and compatibility policies belong to the designs that need them, within these contracts. Changes to accepted semantics require explicit reconciliation and decision treatment.

### Language and evidence integration

Language support supplies discoverable subjects, analyses, and guarantees. Shared abstractions emerge from experience across languages; do not discard language-specific semantics to fit a preconceived ontology. Repository organization is a qualified scheme, not canonical architecture. External endpoints with opaque interiors do not establish empty interiors or richer package/service identity.

Defined evidence access preserves capture, provenance, qualification, and output exclusions. The built-in Investigator uses PostCode's subject-based evidence surface; repository material is evidence, not instructions. Its existing prohibition on independent filesystem discovery, shell execution, mutation, and web access remains scoped to that role. External coding agents have a separate integration role and may change programs under the human's instructions.

## Execution, resources, and initiative

### Resource-bounded work and outcomes

Applicability/availability, execution state, result materialization, and epistemological guarantee are distinct. A result can be partial despite successful execution; a stopped or failed attempt can retain usable information when its method permits it. An unavailable analysis may have an earlier qualified partial result. Preserve established emptiness versus absence of a result, and distinguish expected failures from defects.

PostCode may communicate anticipated cost and the likely effect of further analysis with appropriate uncertainty, allowing the human to proceed, stop, accept the qualified current result, or choose a cheaper method. Accumulated cost should be available where practical. Budgets govern effort rather than request meaning; unmet requirements remain explicit. More resources can expand coverage or change method, but do not inherently make a claim truer. A cheaper method with different guarantees must expose that difference.

Preservation of partial information does not override an analysis's acceptance contract. For example, mechanical evidence acquired during an unsuccessful interpretation may survive while no unfinished investigram is accepted. Cancellation, completion of a command, and confirmed cleanup are distinct; do not imply that stopping a request guarantees immediate resource exit. Current session interruption and retry behavior remains governed by the accepted execution decisions.

### System-initiated investigation

PostCode may initiate investigation for orientation, resolution, navigation, suggestions, or later interaction. Such work uses the same analysis, provenance, and qualification mechanisms as explicitly requested investigation, and need not create a visible View.

Request-scoped system-initiated work serves an explicit parent request and is governed by its constraints and resource choices. A human- or agent-initiated parent does not change who initiated that prerequisite investigation. Selecting unspecified request elements alone is not additional investigation. Qualified information needed to make that selection can require such work.

Autonomous investigation has no parent request. Work beyond a parent's purpose or continuing after that parent is satisfied or cancelled is autonomous and must satisfy its authorization requirements. Autonomous work may proceed only within human-authorized resource policies; work exceeding them or materially delaying an explicit request remains deferred unless authorized. Hosted-service enablement alone does not constitute an autonomous spending policy.

When system-initiated results influence a selection, suggestion, displayed answer, or report, its trigger, parent relationship where applicable, captured basis, relevant results, and qualifications remain inspectable from that outcome and attributable in observations. Reusing an earlier result does not make it current because its input designation has a following binding. These contracts prescribe neither a scheduler nor an event for every implementation step; they do require accountability for consequential additional investigation.

## Integration

### Shared context for external coding agents

The human and coding agent should be able to use projected subjects and relationships as shared referents. A limitation shown in a View can inform development, but is not itself an instruction to change the program.

Machine-readable context represents the current investigation without becoming a canonical representation of the program. It should make available the focused subject/View, open Views and their references, subjects and Projections, Lens and presentation choices, content and qualification, source mappings, designated inputs and bindings, captured bases and their associations, and relevant relationships among Views. Include a formalized task/information need where available, and system-initiated results materially influencing current choices. Simple workspaces need not invent richer shared purpose to expose their existing Views and focus.

References distinguish an exact retained Projection over its captured basis from a request repeatable against currently bound inputs. Make a consequential difference between the displayed basis and a subsequent request's basis recognizable. Reference lifetime and scope must be explicit enough for agent use; session-local spellings do not acquire durable meaning through export.

A synchronized context artifact is an available initial mechanism. If used, it should be atomically published, carry sufficient revision/basis information, avoid dirtying the repository, and not normally be committed. A compact manifest can reference separate records rather than duplicate an indefinitely growing body. Representation is open but should be documented and stable enough for different coding agents to consume without bespoke integration. Generated context must respect the evidence boundary below.

### Incoming agent context and interactive exchange

An external agent may supply task understanding, conceptual/implementation correspondence, rationale, constraints, uncertainty, verification, affected subjects, or suggested further investigation. Preserve agent provenance and asserted or interpretive status; structured form does not establish truth. Associate such context with relevant repository state and, where possible, its originating task or conversation.

Interactive exchange is a later possibility: agents could request Projections, repeat requests, contribute context during development, or suggest Views. Prompt-ready references or an integrated agent conversation can build on the same shared-context model. No particular transport, conversation host, or implementation milestone is required here.

### Hosted investigation and runtime observations

Hosted investigation requires intentional enablement and disclosure that selected repository content is transmitted. Deliberate PostCode-specific configuration can constitute enablement without confirmation for every request. Preserve credential exclusion from investigation context, output, observations, and logs, and disclose actual protection limits. Configuration failure and runtime failure remain distinct; do not silently substitute a different requested operation or billing route.

Usage describes execution attempts, including unsuccessful attempts, independently of result retention. Reuse does not incur new inference usage. Missing measurements remain explicit; reported totals must not masquerade as complete billed cost. Current provider/authentication contracts remain scoped decisions, not permanent selection of a model or price.

Runtime adapters may expose debugger, profiler, tracer, or test-runner observations with execution-specific scope. PostCode need not run the investigated program or become those external tools. Support and guarantees are documented per capability.

## Research observations and generated output

### Interaction capture and subjective reports

Automatically record relevant requests and choices, including prose prompts; external coding-agent prompts where available; selected subjects, Lenses, parameters, Projections, Presentations, and actual View composition; navigation, workspace changes, source excursions, agent-context interaction, failures/refusals/unavailability, evaluation dimensions, resource decisions, and available usage. Distinguish work available from work actually presented. Composition and captured-basis changes are observable events rather than only new rendering metadata.

Make contemporaneous subjective observations easy to record. Quick reactions with optional explanation and an unmet-information-need control are examples, not required widgets. These reports complement automatic capture without turning every use into a separate research diary.

Preserve enough provenance to relate observations to PostCode version, relevant repository commits and working-tree state, the bases of participating Projections, session, task where available, and research use versus testing/debugging PostCode. Session identity does not establish one task or a consistent program snapshot. Distinguish human-, external-agent-, and PostCode-initiated activity; system-initiated investigation records request-scoped versus autonomous attribution and its parent or trigger. Attribution is distinct from full reproducibility or indefinite retention of repository contents.

### Delivery and lifecycle

Released production builds deliver research observations to designated research storage using configuration selected when the build is produced. Development/test builds may suppress capture or use another destination, including an explicitly excluded location within the development repository. The research observation provision is read together with the generated-output boundary, not as withdrawal of development/test sink behavior.

Make delivery failure visible without invalidating an otherwise successfully produced View. Sink acceptance, post-acceptance cleanup, retention, migration, historical reading, and producer-side caching remain separate concerns. Existing local acceptance guarantees complete no-overwrite publication, not power-loss durability. Observations are evidence of use, not operational state for restoring a Session or its reference bindings.

Operational diagnostics or product telemetry can use other mechanisms but must not silently enter research evidence. Preserving an event stream does not automatically implement Workspace persistence.

### Generated-output evidence boundary

PostCode outputs about a repository—including observations, exported Views, context artifacts, CLI output, caches, and reports—must not silently become independent evidence in subsequent analysis of that repository. Keep them outside it or enforce an explicit exclusion policy. Generic directory names, Git-ignore status, or markings in content do not establish that boundary.

Outputs can be retained, reused, and compared as PostCode-produced artifacts with their provenance intact. Outputs about other repositories can remain development/test evidence about PostCode. When PostCode investigates itself, exclude locally retained outputs about itself from repository evidence. Sink selection and storage convenience do not waive this obligation.

## Scope and future refinement

Initial delivery may implement only part of this design. Keep the current [capability reference](capability-reference.md), status, and interface documentation accurate; preserve existing disclosed conformance gaps until separately resolved. Adoption of this specification changes no runtime schema, command, record identity, or existing observation.

Further UX decisions may select richer workspace context, specialized workspace kinds, or a particular initial View. Continuity across program changes and application restarts needs later requirements and lifecycle design. General multi-state analysis, live refresh, shared-context protocols, resource-policy mechanisms, and new language or Lens families each require appropriately scoped work. Their possible future role is not authorization to construct speculative infrastructure now.

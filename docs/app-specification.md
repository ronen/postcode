# Application Specification

<a id="role-and-scope"></a>
## Role and scope

This is the human-maintained, governing specification of PostCode's intended application behavior and high-level application design. It conforms to the [research product design](../foundation/product-design.md), uses the terminology in [core concepts](core-concepts.md), and is implemented subject to [architectural constraints](architectural-constraints.md) and accepted [decisions](decisions/README.md).

The research foundation establishes the concepts and commitments necessary for research evaluation. This specification makes application choices within them. Core concepts defines shared meanings; constraints states binding cross-cutting implementation rules; decisions preserve consequential choices and their rationale. [Implemented architecture](architecture/README.md) describes the current realization. [Document allocation and application contracts](decisions/application-specification-boundaries.md) establishes these roles.

This document describes intended behavior, not a claim that every capability exists. [Project status](../STATUS.md) and the [capability reference](capability-reference.md) describe current support. Adoption does not remove documented conformance gaps. A supported subset must describe its limits accurately. A conditional guarantee applies whenever the relevant capability is offered; it does not by itself require immediate implementation of that capability.

<a id="ux"></a>
## UX

<a id="working-through-qualified-views"></a>
### Working through qualified views

PostCode specializes in qualified architectural investigation and retained understanding for humans working alone or with design and implementation agents. Participants may conduct larger design conversations elsewhere while consulting, challenging, extending and comparing PostCode's accounts. PostCode contributes architectural expertise without taking responsibility for architectural decisions or requiring those conversations to occur inside it. Useful direct human investigation and superior architectural investigative expertise along relevant dimensions are aspirations to evaluate, not assumed advantages; specialization does not depend on demonstrating comparative advantage. [[Product role](decisions/specialized-architectural-investigation.md#specialized-product-role)]

The working surface supports understanding, design, direction and evaluation through computational, software-design and architectural concepts. The human investigates through read-only Views and is presumed to understand relevant computational, software-design and architectural concepts without source-language literacy. Views and Projections do not directly modify the program or silently rewrite their underlying material. Receiving participant-supplied requirements, proposals, intentions or rationale is compatible with that boundary; it does not automatically adopt that material or make it implemented. The human continues to direct program changes through implementation agents. Interaction may be graphical, prose-based, command-line or machine-readable, including external-agent invocation. Interfaces share the conceptual model and epistemological contract without necessarily exposing identical facilities.

The working surface supports following subjects, relationships and questions without routinely translating them into source coordinates. Text is a first-class Presentation. An explanation may contain interpretation if its status and supporting basis remain apparent. Qualification is information needed to understand the answer, not a warning hidden in documentation. Plain-English qualification may be clearer than an initially elaborate formal vocabulary.

Presentations can support selection, inline detail, navigation, expansion of evidence attribution and qualifications, opening related Views, and copying references for design- or implementation-agent prompts with their scope and lifetime apparent. Exact controls, gestures, keyboard bindings, visual encoding and layout are UX choices. The interface need not expose the word “Lens” or internal Lens identifiers. Named actions such as “Explain” can have stable meanings and appear in menus, shortcuts and capability documentation.

<a id="human-output-boundary"></a>
### Human output boundary

Human understanding must not depend on programming-language source or syntax. This is the **human output boundary**; it applies to explanations, evidence detail, qualifications, diagnostics and non-View reports as well as Views. Assertions, labels and evidence embedded in source artifacts may be presented when intelligible without source-language literacy, with provenance and epistemological status preserved. A code excerpt, declaration or raw signature the human must decipher is not an adequate architectural representation. Source origin or code-like spelling alone is not a reason to suppress useful information. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)]

Do not routinely display programming-language source as supporting evidence. Any display of source as source must serve a specific purpose that does not require the human to decipher it, and for which an intelligible description or reference would not suffice. Such display does not replace disclosure of an unmet architectural information need.

An interface's declared purpose and consumption contract determine whether it is human-facing or machine-facing; its encoding and the identity of its caller do not. An agent invoking a human-facing command does not change that command's obligations. Interfaces explicitly intended to supply agents with evidence may include source under their access contracts. This distinction does not prescribe separate commands, modes or channels.

Evidence attribution, source locations and implementation mappings remain available without requiring source-language literacy. Attribution can identify a supporting artifact and captured basis without displaying its source contents. Source stays available to analyses and agents through their defined interfaces. Evidence supplied for a claim comes from its supporting capture, not a later filesystem read.

<a id="workspaces-and-navigation"></a>
### Workspaces and navigation

A Workspace is a collection and arrangement of Views, displayed in a tab or window. One tab can contain several Views. The exact tab/window treatment depends on shared interface controls. Opening related information inline or alongside existing information supports exploration without requiring a new top-level context for every answer.

Workspace organization is distinct from program structure, a View's composition, and an analysis Session. Several independent Views arranged together remain several Views. A single coordinating Presentation may instead instantiate one View over several Projections. Placement does not establish a program relationship or change an input binding.

The starting Workspace model requires neither a name, a permanent root subject, a formal task, nor a shared-context object. Ordinary focus supports interaction. An investigation can move beyond the subject from which it began. The human constructs a working surface appropriate to the problem rather than operating within a predetermined dashboard. Avoid requiring the human to maintain a conceptual hierarchy merely to arrange related answers.

Navigation allows a displayed subject or relationship to become the subject of another question. A resulting View may be embedded, opened alongside its origin, or opened in another Workspace. The accumulated Views, their captured bases and relevant lineage form the local **investigation context**. A Workspace arranges Views within that context; the context need not end at a tab or window boundary or require a separate context object. This context supports continuity of investigation without defining all [retained architectural understanding](../foundation/product-design.md#retained-architectural-understanding-and-continuity), which includes accounts and underlying Projections available to humans and agents. [[Context responsibility](decisions/research-question-driven-observation.md#retained-understanding-and-context)]

For each retained View, preserve what it shows, its supporting captured bases, and applicable discovery and derivation relationships: the View or subject from which it was opened, the known origin of a supplied reference, and earlier information contributing to a comparison or summary. Moving or closing a visible View does not erase those relationships from retained investigation context. This intended contract applies across interfaces, including the CLI shell, within the supported lifecycle; it does not require a separately stored View object or persistence after that lifecycle ends. Preserve origin relationships the interface establishes and disclose unavailable origin rather than guessing where a human obtained a reference. The current CLI retains qualified results and some investigation provenance but lacks general View-to-View navigation-origin lineage; this [limitation is disclosed and backlogged](decisions/application-specification-boundaries.md#adoption-and-conformance). For example, opening dependencies alongside an explanation retains the navigation origin without asserting that the two answers share a capture or that one is evidence for the other.

Do not assume a uniquely correct hierarchy of the program. Containment may be hierarchical; dependencies, calls, evidence, tests and other relationships offer different paths through an investigation. Files and directories can be subjects or implementation provenance without being the primary organizing model.

Shared Workspace purpose and defaults, specialized Workspace kinds, and their corresponding initial Views remain future UX possibilities. They are not prerequisites for the simple Workspace. If introduced, shared context must not imply that all member Views share a subject or captured state, or that one View supplies evidence for another.

<a id="initial-views-and-further-investigation"></a>
### Initial views and further investigation

Explicit information needs and choices take precedence. No particular Lens or initial View is prescribed as an application-wide default. PostCode may select or suggest an appropriate starting View when the human leaves that choice open. Selection and consequential omissions remain inspectable.

Opening a repository or subject counts as requesting its initial View when the action communicates that behavior. It authorizes the work needed to answer that request within applicable resource constraints; it does not authorize unrelated exploration or waive hosted-service enablement. The choice of initial View remains open.

A summary View is one possibility. It may coordinate independently qualified Projections, present a synthesized account produced by a Lens, or combine both. A summary View does not require a summary Lens for every subject. An omitted aspect does not establish absence, unavailability, or unimportance. Selecting a summary to answer an expressed information need is part of interpreting that request: producing the selected answer remains explicitly requested work. Additional investigation needed to resolve the request or obtain prerequisite information is request-scoped system-initiated work. Investigation to construct a suggestion without a parent request is autonomous and follows the resource rules below.

<a id="representation-limits-and-feedback"></a>
### Representation limits and feedback

When PostCode recognizes that an architectural information need cannot be met adequately through available Views and investigation, disclose the limitation rather than require the human to decipher source or accept a more certain-sounding explanation. Recognized limits include known unsupported requests, refusals, unavailable evidence and material qualifications that cannot be conveyed intelligibly. Further qualified investigation may help, but a question can remain unresolved. Distinguish information that is unavailable from information that cannot be represented adequately by the offered interface. Preserve independently intelligible qualified content when part of a need remains unresolved. [[Representation limits and feedback](decisions/human-facing-architectural-representations.md#representation-limits-and-feedback)]

Provide a low-friction way for the human to report that a View or explanation is inadequate, with optional clarification and without requiring feedback before continuing. Retain the associated View, subject, captured basis and investigation context where already available, without requiring reconstruction or additional investigation. Include other available context that can be provided without undue effort and is likely to help interpret the feedback. Reporting inadequacy records and submits the feedback to the observation destination under [Delivery and lifecycle](#delivery-and-lifecycle), without otherwise changing the investigation or initiating further work. Feedback submission follows the existing observation delivery contract. Delivery failure is disclosed without invalidating the displayed result or preventing subsequent use. Feedback records the experience; it is not proof that a claim is wrong, an interpretive replacement or an instruction to modify the program.

<a id="requests-and-capability-behavior"></a>
## Requests and capability behavior

<a id="interpreting-and-resolving-requests"></a>
### Interpreting and resolving requests

A request may specify any combination of subjects, Lenses, Lens parameters, Presentations, and Presentation parameters. PostCode may select unspecified elements to answer the expressed information need. The resolved choices, consequential criteria used at the time, and omissions remain inspectable; later defaults must not be used to reconstruct a different explanation of an earlier choice.

Subject designation, selected subjects, Lens parameters, designated program inputs, captured basis, and presentation/execution choices have distinct meanings. A request about output length changes presentation when it only abbreviates display; changing requested information or synthesizing a shorter account belongs to Lens selection or parameters. Execution budgets constrain effort rather than silently narrowing the question.

Request coordination resolves subjects using qualified information and declared Lens applicability/cardinality. When the Lens is known, name lookup is narrowed to suitable subjects. A precise reference resolves to its actual target before applicability checking; an incompatible bound target is not an unknown reference. Lens implementations receive valid normalized applications and defensively enforce their invariants. Choosing the order of partial lookup and Lens selection belongs to coordination.

Request interpretation can consume qualified information but must not itself establish the subject population or other architectural claims. When resolution needs additional investigation, obtain it through Evaluation and core construction. Preserve attribution to its results and qualifications even when the parent request remains ambiguous or cannot be resolved. Established candidates, missing population coverage, unsupported applications, unavailable analysis, and an established empty result must not collapse into an undifferentiated “not found.”

For example, “Tell me about this module” can select a summary as the requested answer. If resolving “this module” first requires qualified population information, that prerequisite investigation is attributed to the parent request and retains any ambiguity or incomplete coverage.

Planning is an activity with an outcome even when it cannot settle a valid application. Deliver that outcome as a self-contained resolution result preserving the request, candidates, reasons, consequential choices, qualifications and prerequisite attribution. Do not manufacture a program Projection for the unsettled application. This is distinct from a valid empty/partial answer or a settled application whose Evaluation fails or is unavailable. Preserve independently produced prerequisite results and existing valid-but-failed or unavailable selections under their own retention rules.

An interface can retain and use the returned resolution information after execution finishes without observations or a new lookup. Candidate references support further requests within their supported Session lifetime, including selection of several candidates when the Lens accepts a collection. Later accumulation does not silently replace the displayed candidate selection. For now, no independent Session lookup of the resolution result, history reopening, persistent planning store or new clarification dialog is required. Current CLI delivery uses its output and worker/parent envelope, not a new outcome store; one-shot references still expire when the Session ends.

The [Lens application decision](decisions/lens-application-and-request-outcomes.md) specifies which earlier unsuccessful-selection Projections this contract replaces and which successful, failed/unavailable and associated selections remain retained. These responsibilities do not prescribe a universal planner, request schema or selection algorithm. General report representation and GUI interaction/rendering design remain separate from the bounded adaptations needed by current interfaces. These contracts apply on adoption, with the [identified implementation gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance) assigned to the [Lens request-model plan](plans/lens-request-model.md); adoption does not establish implementation conformance.

<a id="shared-contracts-and-the-toolbox"></a>
### Shared contracts and the toolbox

Specific investigations are documented in the [capability reference](capability-reference.md), including supported subjects, options, presentations, and limitations. Their early implementation does not make them core architecture. A particular Lens or View becomes an explicit application requirement when a deliberate UX design depends on it, not merely because it appears in the current toolbox.

The architecture and semantic contracts apply across capabilities. Established software-design and architectural concepts, such as responsibility, boundary, ownership, state, interaction, contract and concurrency, provide a working vocabulary and starting points for capability design. Their applicability to particular software must be established or qualified. Illustrative families in the [research design](../foundation/product-design.md#illustrative-lens-families) remain examples, not a prioritized implementation catalogue or universal ontology.

Conditional guarantees remain important. Test views distinguish apparent intent, realization, behavioral evidence, and necessary language/runtime mechanisms. They should use the highest useful abstraction that preserves what the test establishes; not every test has a language-independent description. Written requirements are assertions, inferred requirements are interpretations, and test or type-system evidence establishes only its qualified scope. Candidate boundary groupings expose supporting and contrary evidence, cross-boundary dependencies, and ambiguity; they must be able to report that no clean boundary is evident. Runtime observations remain qualified by the execution or interval observed.

<a id="semantic-contracts-and-guarantees"></a>
## Semantic contracts and guarantees

<a id="architectural-modalities-and-captured-bases"></a>
### Architectural modalities and captured bases

Accounts may concern implemented, hypothetical or intended architecture. Implemented accounts concern actual software and remain supported and qualified by implementation evidence. Hypothetical accounts concern alternatives without implied acceptance, feasibility or realization. Intended accounts concern accepted requirements or design decisions. These distinctions are independent of provenance, method and epistemological status; exact recording of a proposal does not establish that it is feasible, accepted or implemented. Observed behavior supplies execution-scoped evidence rather than another modality. Preserve provenance and history when a proposal becomes an intention. Sharing an account implies neither participant agreement nor authority for PostCode's interpretation. [[Modalities](decisions/specialized-architectural-investigation.md#architectural-modalities)]

A captured basis identifies the specific input material used for a Lens application. It can include program states, observations, participant-supplied architectural material and earlier Projections, with their qualifications and meaningful roles or order preserved. Program inputs and captured program states remain useful special cases; they do not exhaust the general model. Subject designation does not replace basis attribution. Lens applicability across modalities depends on method, not merely a compatible-looking data shape. New architectural claims require core analysis, including when resolving requests or comparing accounts. [[Captured bases](decisions/specialized-architectural-investigation.md#inputs-and-captured-bases)]

The current CLI remains an implemented-architecture subset: configured TypeScript project analysis, module-originating prose interpretations and qualified follow-up within a transient unchanged-input Session. It does not offer hypothetical/intended account investigation or general participant-material capture. These are future capabilities, not prerequisites for retaining the accurately described current subset.

<a id="qualification-and-presentation"></a>
### Qualification and presentation

Preserve claim evidence, provenance/method, scope, epistemological status or guarantee, and limitations through every supported operation. Mechanically derived information, recorded assertions, observations, and interpretation remain distinguishable. Confidence expressed by a human or model does not strengthen a claim. Consequential qualification survives into human-readable and machine-readable Views.

State human-facing qualifications at the level of intelligible computational, software-design or architectural concepts, preserving relevant language-specific meaning. When a material qualification cannot adequately be expressed that way, disclose a representation limit rather than silently drop the qualification or require the human to decipher source. A narrower intelligible claim may remain useful with an explicit limit on what can be concluded. Do not present a stronger claim without its necessary qualification; displaying opaque source wording does not supply that qualification.

Displaying supplied assertions or rendering established meaning intelligibly remains presentation when it preserves supplied meaning and qualifications without inferring additional architectural properties.

Presentations can sort, group by supplied fields, filter, disclose detail, and count explicitly identified supplied populations. “87 dependencies; showing 20” is valid when the supplied qualified population or total establishes 87. Twenty supplied records alone cannot establish 87; counting overlapping rows does not establish distinct entities without established correspondence. Counts do not imply complete analysis.

New classifications, correlations, correspondence, flows, synthesized explanations, or other architectural claims require analysis and qualified Projections. Displaying two results together is not evidence of a relationship between them. Preserve each contributing Projection's subject, Lens, parameters, captured basis, qualification, and relevant outcomes. Consequential filtering, aggregation, grouping, and omissions remain visible. Ordinary layout and interaction are not restricted to an exhaustive whitelist of computations.

Adding or removing a Projection changes View composition; make that change visible. Replacing displayed information with newly captured results changes its basis; make that change visible too. Preserve the lineage needed by the investigation. Neither is merely a rendering-context change. Research recording of these events follows [Interaction capture and subjective reports](#interaction-capture-and-subjective-reports). [[Qualified results and recording](decisions/research-question-driven-observation.md#results-over-captured-bases)]

<a id="captured-answers-bindings-and-refresh"></a>
### Captured answers, bindings, and refresh

Use the [input and binding definitions](core-concepts.md#program-inputs-bindings-captured-states-and-projection-requests). Following inputs are resolved again for subsequent requests; pinned inputs reuse the same captured state. Neither policy makes a retained Projection mutable, nor guarantees atomic or synchronized capture. Runtime inputs can use execution-, interval-, or stream-appropriate bindings while identifying the observations actually captured.

Preserve associations between claims and their supporting states, including order or roles, timing, and capture limitations. Later observations cannot silently support an earlier interval. A branch designation, Session identifier, or identical label does not identify the captured basis or establish correspondence across states.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualification. An interaction that instead refreshes selection must make that behavior apparent and disclose consequential changes. Newly available interpretations or correction selections can change an answer without changing the program capture. Disclosed reselection is not equivalent to presenting an exact retained answer; every identifier change or independent fresh request does not require a comparison warning.

<a id="immutable-results-and-interpretation-history"></a>
### Immutable results and interpretation history

**Retained evidence and qualified results are immutable.** Subsequent analysis, corrections, or refreshed inputs do not alter their content or supporting context. New information produces new records or explicit relationships, while existing references retain their original meaning.

This preserves the basis of dependent results and what an earlier investigation received or established. Immutability is not a requirement for every piece of application state: focus, arrangement, defaults, selected display accounts, and current derived reconsideration status can change. It does not prescribe programming-language immutability or UI state-management techniques.

**Immutability is distinct from retention.** Retention duration, disposal, restart persistence, and cross-session access require separate policies. A discarded result must not silently give its reference a different meaning, but immutability does not imply perpetual retrievability. Disclose reference lifetime where a displayed reference will expire before follow-up use.

Corrections and disagreements remain identifiable. A replacement does not erase the original or establish its own truth. Where an account is selected for display, expose the correction and competing alternatives with their qualifications. Presentational selection does not resolve interpretive disagreement. Earlier interpretations and correction history remain accessible within the supported retention lifecycle; this is intended UX behavior supporting explanation and trust, not an indefinite archive promise. For example, a correction arriving while the human pages through a retained answer leaves those pages on the same selected answer; choosing a refresh can select the correction, with the change made apparent.

Keep result composition, later investigation provenance, correction relationships, citations, and workspace lineage distinct from one another and from program relationships. Existing [interpretation contracts](decisions/investigrams-and-progressive-investigation.md) govern exact-original access, replacement selection, atomic acceptance, conflicting corrections, and correction-aware evidence delivery. Detailed algorithms remain in those decisions rather than being silently replaced by generic wording here.

Reconsideration indicates that interpretation content supplied to an earlier investigation has been corrected, directly or through cited context under the applicable propagation rules. Exposure does not prove reliance, comprehension, or endorsement. The warning does not establish that the account is wrong, invalidate the Session, or automatically trigger inference. Current derived status can change without rewriting the account or its exposure history.

An **[investigram](core-concepts.md#investigram)** is an immutable, addressable artifact containing a qualified interpretation, with referent information, evidence context and provenance. Its **[interpretation content](core-concepts.md#interpretation-content)** may be prose, structured content, or a combination, including prose within a structure. All of that content remains subject to the same qualification, evidence attribution, retention, citation exposure and correction requirements.

PostCode accumulates partial, qualified architectural understanding across investigations. Humans and agents can revisit that understanding and investigate it further; subsequent investigations can reuse, extend or challenge earlier accounts from different architectural perspectives. Accounts can overlap, disagree or remain incomplete; their evidence, qualifications and revision history remain distinguishable. Accumulation does not require a single consolidated, authoritative architecture model. [[Accumulated understanding](decisions/structured-investigram-content.md#require-accumulated-understanding)]

The ways humans and agents consult and contribute to retained architectural understanding, and the architecture supporting those capabilities, require further design informed by concrete journeys. Earlier accounts and underlying Projections can be consulted, compared or used as qualified inputs while keeping their evidence, qualifications and revision history attributable. Reuse does not supply independent repository corroboration. [[Retained understanding](decisions/research-question-driven-observation.md#retained-understanding-and-context)] These are currently unresolved application and architectural choices, not merely delegated implementation details. Retention duration, cross-session availability and correspondence across changed program states remain to be determined.

Structured interpretation is an expected ingredient of the accumulated understanding capability, but permitting it does not select account schemas, organization or supporting architecture. Structured form does not make an interpretation mechanically established. [[Structured interpretation](decisions/structured-investigram-content.md#permit-structured-interpretation)]

<a id="identity-labels-and-continuity"></a>
### Identity, labels, and continuity

Identity, implementation identifiers, displayed labels and navigation handles remain distinct. Interpreted labels retain their provenance and status; a label change is not a program change. Exact identifiers and implementation mappings remain available for traceability and agent coordination. PostCode uses established software-design and architecture vocabulary and notations and can develop additional ones through use. Their applicability and correspondence to implementation details must be established or qualified case by case; they do not form a universal ontology. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)]

Within the supported Session, otherwise identical qualified answers have repeatable Projection identity regardless of the subject's lookup spelling or name/reference route. Equality uses the [canonical effective-input set](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity), including Session context, method version and meaningful subject order/roles. Equal prose or displayed lists alone do not establish the same answer. Preserve request-specific resolution provenance separately without losing answer-relevant qualification. This is a logical referent contract, not a requirement for physical memoization, annotations or cross-session continuity. [[Qualified answer identity](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

The foundation’s requirement to preserve continuity across program change stands. Its realization and precise future UX/lifecycle requirements are deferred until experience with the application provides a better basis. The current unchanged-input Session is a disclosed limited subset: detected relevant changes invalidate further investigation and require reopening. PostCode must not silently retarget a View when correspondence becomes uncertain. Preserve current immutable-result, reference, capture, and qualification contracts while avoiding obvious obstacles to later continuity.

The direction preserves earlier attention without inventing successor entities. When future navigation maintains live anchors or input dependencies, uncertainty or disappearance must be exposed while preserving the investigation under the then-supported lifecycle. Discovery, placement, derivation, binding, and investigation role remain distinct. Moving a View or opening another Workspace does not by itself change its basis or erase its lineage. Exact anchor behavior, refresh triggers, save/resume, and multi-capture Session mechanisms remain later design choices.

Entities in hypothetical or intended accounts inherit the identity and provenance supplied by those accounts. Cross-account correspondence must be supported and qualified; matching labels or shared references do not establish realization in software. The current implemented-entity identity and Session contracts remain unchanged. [[Architectural subjects](decisions/specialized-architectural-investigation.md#architectural-subjects)]

<a id="comparison-and-conceptual-change"></a>
### Comparison and conceptual change

Architectural comparison may concern different implemented states, competing hypothetical alternatives, or intended and implemented accounts. Preserve each account's modality, basis, evidence and qualifications; their evidentiary bases need not be equivalent. Applying a Lens at two states and presenting the results together is one implemented-state case. Juxtaposition permits direct comparison without claiming that PostCode has derived a relationship. Alignment uses supported correspondence or exact identity guarantees within their scope; matching labels alone do not establish semantic continuity. [[Architectural comparison](decisions/specialized-architectural-investigation.md#architectural-modalities)]

Identifying correspondence, additions, removals, changed relationships, consequences, significance, conformance or contradiction requires a qualified comparison Lens. A conceptual diff concerns change between program states; it can use ordered states with roles and intermediate evolution where relevant. A subject-oriented change summary and a change-oriented account can organize the same evidence differently. Implementation review may compare prior implementation, intended change and resulting implementation, distinguishing what changed, whether it changed as intended and additional architectural consequences.

Different perspectives may coexist: mechanically derived dependency changes, interpreted responsibility movement, test-supported behavior or asserted requirement correspondence. Expose selection criteria, methods, alternatives and omissions without implying one uniquely correct account. Analysis behavior must be stable or versioned sufficiently that PostCode changes do not masquerade as program changes. No particular comparison command, Lens or cross-modality implementation is selected here.

<a id="application-architecture-and-extensibility"></a>
## Application architecture and extensibility

<a id="responsibilities-and-boundaries"></a>
### Responsibilities and boundaries

Core concepts defines the meanings; architectural constraints is the operational source for binding cross-cutting rules. [Immutability of retained evidence and qualified results](#immutable-results-and-interpretation-history) is a high-level architectural commitment, distinct from retention policy. The architecture separates these responsibilities without requiring independently materialized stages or a particular package layout:

| Responsibility | Contract |
| --- | --- |
| Request interpretation and coordination | Resolve expressed needs and choices using qualified information; request missing work; preserve resolution outcomes, attribution, and consequential choices. |
| Lens requirements | Identify the information requested of a subject, with meaningful parameters and applicable supporting analyses or operations. |
| Evaluation | Coordinate analysis, compatible reuse, execution constraints, evidence, and qualified outcomes. Interpretation participates through the investigation boundary. |
| Projection construction | Select qualified materialized information and relevant outcomes into an addressable retained answer. |
| Presentation and interaction | Arrange supplied answers, preserve their meaning, disclose omissions and evidence attribution without depending on source-language literacy, and issue further requests when interaction needs new information. |

A Lens is distinct from reusable operations supplying its information. Several analyses or qualified results can contribute to one answer; several answers can be coordinated without creating another Lens. New synthesis is analysis. Neither one operation per Lens nor a distinct “composite Lens” category is a universal requirement.

Rendering and arrangement do not initiate Evaluation or independently query accumulated state to broaden an answer. Interactions requiring additional information return through request coordination, Evaluation, and core construction. Standard expansions remain subject-kind detail declared before evaluation; another Lens question is not made a standard expansion by inline placement. The [qualified-construction boundary](decisions/research-question-driven-observation.md#qualified-construction) and its scoped binding-only capability remain in force.

Shared, lazy, staged, or presentation-guided execution is permitted when it preserves Lens meaning, qualified populations, materialization, and retained-result semantics. Pushdown does not reclassify presentation parameters as Lens parameters. Current eager builders are a scoped implementation choice, not a universal requirement.

<a id="design-freedom-and-extension-evidence"></a>
### Extension and compatibility

Extensibility should be demonstrated through representative additions, not merely asserted through a registry design. An ordinary interpretive capability and a mechanical capability using established information can exercise whether capability-specific work remains local and common request, qualification, presentation, and reporting facilities are reused appropriately. New capabilities may require new analysis or Presentation code; the criterion is coherent responsibility and reuse of shared facilities.

Specific representations, registration mechanisms, and compatibility policies belong to the designs that need them, within these contracts.

Lens implementations declare prospective qualified result contracts and Presentations declare compatible inputs, options, preconditions and standard expansions. Capability designs establish how result and Presentation contracts meet the [human output boundary](#human-output-boundary). Request planning uses these contracts, rather than inferring compatibility solely from a Lens name or data shape. Declare required expansions before Evaluation and validate materialized content before arrangement. Existing typed family contracts and explicit defaults suffice for the current toolbox; this does not require general Presentation ranking or a registry/plugin language. [[Result/Presentation compatibility](decisions/lens-application-and-request-outcomes.md#match-qualified-results-to-presentations-explicitly)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

<a id="language-and-evidence-integration"></a>
### Language and evidence integration

Language support supplies discoverable subjects, analyses, and guarantees. Concepts shared across languages and language-specific extensions coexist; do not distort implementation semantics to fit a predefined universal model. Structural Projections should use only relationships the applicable language analysis can define accurately, and should not manufacture symmetry where language semantics differ. Repository organization is a qualified scheme, not canonical architecture. External endpoints with opaque interiors do not establish empty interiors or richer package/service identity.

Defined evidence access preserves capture, provenance, qualification, and output exclusions. The built-in Investigator uses PostCode's subject-based evidence surface; repository material is evidence, not instructions. Its existing prohibition on independent filesystem discovery, shell execution, mutation, and web access remains scoped to that role. External design and implementation agents have separate integration roles; an agent acting in the implementation role may change programs under the human’s instructions. External participation does not expand the built-in Investigator’s access contract.

<a id="execution-resources-and-initiative"></a>
## Execution, resources, and initiative

<a id="resource-bounded-work-and-outcomes"></a>
### Resource-bounded work and outcomes

Applicability/availability, execution state, result materialization, and epistemological guarantee are distinct. A result can be partial despite successful execution; a stopped or failed attempt can retain usable information when its method permits it. An unavailable analysis may have an earlier qualified partial result. Preserve established emptiness versus absence of a result, and distinguish expected failures from defects.

PostCode may communicate anticipated cost and the likely effect of further analysis with appropriate uncertainty, allowing the human to proceed, stop, accept the qualified current result, or choose a cheaper method. Accumulated cost should be available where practical. Budgets govern effort rather than request meaning; unmet requirements remain explicit. More resources can expand coverage or change method, but do not inherently make a claim truer. A cheaper method with different guarantees must expose that difference.

Preservation of partial information does not override an analysis's acceptance contract. For example, mechanical evidence acquired during an unsuccessful interpretation may survive while no unfinished investigram is accepted. Cancellation, completion of a command, and confirmed cleanup are distinct; do not imply that stopping a request guarantees immediate resource exit. Current session interruption and retry behavior remains governed by the accepted execution decisions.

Minimize incurred interpretation costs by reusing completed interpretation when a later requirement requests the same compatible work within the supported Session validity contract. Consuming Lens, subject designation and navigation route do not themselves require another investigation. Newly accumulated evidence does not by itself invalidate a reusable outcome; existing qualification, correction, retention and retry rules continue to apply. Preserve generating provenance and distinguish current consumption from new execution. This reaffirms [operation reuse](decisions/investigation-operations-and-lenses.md) without prescribing a cache technique, multi-operation dialogue or semantic matching of other answers. [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

<a id="system-initiated-investigation"></a>
### System-initiated investigation

PostCode may obtain additional qualified information to resolve a request, support navigation, or prepare a suggestion, without producing a separate visible View. The human can inspect consequential work behind an outcome and its basis and qualifications. Selecting unspecified request elements alone is request interpretation; it does not reclassify the selected answer as system-initiated work.

[Investigation initiation](core-concepts.md#investigation-initiation) distinguishes request-scoped prerequisites from autonomous work. The [operational constraints](architectural-constraints.md#investigation-initiation-and-request-attribution) govern parent attribution, resource authorization, work after a parent ends, and traceability in the investigation and in any research records that capture the work. Autonomous work requires human-authorized resource policies; hosted-service enablement alone is insufficient. Existing prerequisite attribution has an [assessment gap](decisions/application-specification-boundaries.md#adoption-and-conformance), not a claim of current conformance. [[Investigation attribution](decisions/research-question-driven-observation.md#investigation-attribution)]

Within those contracts and an approved scope of work, the timing and trigger of system-initiated investigation are implementation decisions. This delegates scheduling mechanics without authorizing new autonomous behavior or spending policies.

<a id="integration"></a>
## Integration

<a id="shared-context-for-external-coding-agents"></a>
<a id="shared-context-for-external-agents"></a>
### Shared context for external agents

Humans, design agents and implementation agents should be able to use projected subjects and relationships as shared referents in human, agent or mixed investigations. They may conduct their larger conversations elsewhere. An agent need not wait for a human investigation before requesting supported information or consulting retained accounts. A limitation shown in a View can inform development, but is not itself an instruction to change the program. [[External participants](decisions/specialized-architectural-investigation.md#external-participants)]

Machine-readable context represents the current investigation without becoming a canonical representation of the program. It should make available the repositories represented, focused subject/View, open Views and their references, subjects and Projections, Lens and presentation choices, content and qualification, source mappings, designated inputs and bindings, captured bases and their associations, and applicable discovery, derivation, and placement relationships among Views. Live dependencies and investigation roots belong in that context if supported; the simple Workspace does not require inventing them. The interface design must make its Workspace/window scope and focus selection clear. Include a formalized task/information need where available, and system-initiated results materially influencing current choices. Simple workspaces need not invent richer shared purpose to expose their existing Views and focus.

References distinguish an exact retained Projection over its captured basis from a request repeatable against currently bound inputs. Make a consequential difference between the displayed basis and a subsequent request's basis recognizable. Reference lifetime and scope must be explicit enough for agent use; session-local spellings do not acquire durable meaning through export.

A synchronized context artifact is an available initial mechanism. If used, it should be atomically published, carry sufficient revision/basis information, avoid dirtying the repository, and not normally be committed. A compact manifest can reference separate records rather than duplicate an indefinitely growing body. Representation is open but should be documented and stable enough for different external agents to consume without bespoke integration. Generated context must respect the evidence boundary below.

<a id="incoming-agent-context-and-interactive-exchange"></a>
<a id="participant-material-and-agent-exchange"></a>
### Participant material and agent exchange

A human or external agent may supply requirements, proposals, intentions, task understanding, correspondence among hypothetical, intended and implemented elements, rationale, constraints, uncertainty, verification, affected subjects or suggested investigation. Preserve participant provenance and asserted or interpretive status; structured form and exact recording do not establish truth, feasibility, acceptance or realization. Associate contributions with their relevant captured material and, where available, originating task or conversation. This does not prescribe an acceptance workflow. [[External participants](decisions/specialized-architectural-investigation.md#external-participants)]

Agent investigation and exchange encompass requesting supported Projections, consulting retained accounts, repeating requests, contributing material and suggesting further investigation. They are broader than a coding-agent handoff after human exploration. The same conceptual and qualification model applies without requiring an integrated conversation. Current CLI invocation offers only its documented capabilities and reference lifetime; general participant-material ingestion and shared-context exchange remain future capabilities. No particular transport, conversation host or milestone is selected here.

<a id="hosted-investigation-and-runtime-observations"></a>
### Hosted investigation and runtime observations

Hosted investigation requires intentional enablement and disclosure that selected repository content is transmitted. Deliberate PostCode-specific configuration can constitute enablement without confirmation for every request. Preserve credential exclusion from investigation context, output, observations, and logs, and disclose actual protection limits. Configuration failure and runtime failure remain distinct; do not silently substitute a different requested operation or billing route.

Usage describes execution attempts, including unsuccessful attempts, independently of result retention. Reuse does not incur new inference usage. Missing measurements remain explicit; reported totals must not masquerade as complete billed cost. Current provider/authentication contracts remain scoped decisions, not permanent selection of a model or price.

Runtime adapters may expose debugger, profiler, tracer, or test-runner observations with execution-specific scope. PostCode need not run the investigated program or become those external tools. Support and guarantees are documented per capability.

<a id="experimental-structured-outputs"></a>
### Experimental structured outputs

For now, structured application outputs are experimental and subject to change without notice. Approved changes can update affected JSON and observation shapes directly without compatibility adapters, dual formats or historical migration. Existing experimental output schema strings do not establish supported compatibility versions. Observation batches remain explicitly versioned and experimental; their envelope versions distinguish format changes without promising historical migration. Semantic qualification, evidence attribution and method provenance remain required, as does the [human output boundary](#human-output-boundary) for human-facing output; specific earlier preservation clauses are reconciled explicitly by the change that replaces them.

Before supporting durable consumption, define deliberate format versioning, published schemas and compatibility obligations. The future external-agent context artifact, required to be documented and stable enough for independent agents to consume, is such a case. That later requirement does not impose schema infrastructure on current early development. [[Temporary output policy](decisions/experimental-structured-outputs.md)]

<a id="research-observations-and-generated-output"></a>
## Research observations and generated output

This section elaborates the foundation’s [Research Observation Support](../foundation/product-design.md#research-observation-support) with application-specific capture, delivery, and lifecycle requirements.

<a id="interaction-capture-and-subjective-reports"></a>
### Interaction capture and subjective reports

Choose research recording to serve the research question rather than a fixed comprehensive schema. Records may preserve or reference relevant interactions, contemporaneous reports, versions, repository states and surrounding context needed to interpret what occurred. Automatic capture is appropriate where retrospective reconstruction would be unreliable. Ordinary non-research use need not produce or export research records. This permission is independent of build type; it does not require a particular recording-mode interface. [[Research capture](decisions/research-question-driven-observation.md#research-capture)]

Depending on the question, useful material can include requests and prompts, selected subjects and answers, presentation choices, actual output, navigation and context changes, representation limits, agent exchange, failures, resource choices or usage. This is a set of examples, not a required event taxonomy. Preserve the versions, repository/basis associations, Session/task context and distinction between research and testing/debugging needed for the assessment. A Session identifier establishes neither a task nor a consistent program snapshot. References must remain usable for the intended assessment; do not mistake references into a discarded store for retained evidence. Disclose relevant missing context and limits without claiming full reproducibility.

System-initiated work remains attributable within the investigation whether or not research recording occurs. Any research records that capture it preserve the initiator, parent or autonomous trigger and enough relevant results, qualifications and context to interpret that work. Research selection does not weaken architectural evidence, captured-basis attribution, qualification, exact retained answers, usage accounting or resource authorization. [[Investigation attribution](decisions/research-question-driven-observation.md#investigation-attribution)]

When capturing presentation or interaction, distinguish work available from work actually shown and machine evidence delivery from human output. Keep attribution detail, displayed source, recognized representation limits and reported inadequacy distinct when collected; source display or detail access does not establish inadequacy. Composition and basis changes remain visible investigation events, regardless of whether the research captures them. Retain or reference the surrounding Views, choices, bases and lineage needed to interpret selected events without requiring a copy of all retained understanding. [[Actual exposure](decisions/research-question-driven-observation.md#actual-exposure)]

Retain the local application commitment to make contemporaneous subjective reports easy, with optional explanation and no obligation to report before continuing. This is a retained product choice, not a requirement to collect reports for every research question. Explicit inadequacy submission retains the existing self-contained feedback contract: include available displayed artifacts and exact output, make missing context explicit, perform no reconstruction or new investigation, and report delivery failure. Choosing no automatic recording must not silently discard a requested report. Do not infer subjective reports from automatic refusal or detail access. [[Feedback and local context](decisions/research-question-driven-observation.md#retained-understanding-and-context)] [[Representation limits and feedback](decisions/human-facing-architectural-representations.md#representation-limits-and-feedback)]

<a id="delivery-and-lifecycle"></a>
### Delivery and lifecycle

For research use, deliver resulting records to the designated destination required by [Research Observation Support](../foundation/product-design.md#research-observation-support). No delivery is required for ordinary non-research use that produces no research records. Development/test capture may use another destination, including explicitly excluded local storage. Whatever the destination, PostCode output is not independent repository evidence. A build type alone does not establish a research purpose or delivery policy. [[Research capture](decisions/research-question-driven-observation.md#research-capture)]

The person conducting the research establishes its purpose and designated record destination through study instructions or configuration. That designation may cover multiple sessions; it requires neither a separate declaration for each session, new application fields nor a mandatory research-mode workflow. The existing local observation folder can be the designated destination when explicitly chosen. Automatic capture can continue without implying research use or, by itself, establishing delivery to a research destination. [[Research capture](decisions/research-question-driven-observation.md#research-capture)]

Make failure of a requested delivery visible without invalidating an otherwise successfully delivered result, including a non-View report. A chosen absence of recording is not delivery failure or successful recording. Sink acceptance, post-acceptance cleanup, retention, migration, historical reading and producer-side caching remain separate. Existing local acceptance guarantees complete no-overwrite publication, not power-loss durability. Observations are evidence of use, not operational state for restoring a Session or its reference bindings.

The self-contained command-batch protocol remains an available recording format and the contract for explicit feedback. It does not prescribe a comprehensive schema or command boundary for every research question. Other recording choices preserve enough content or resolvable references for their intended interpretation. Operational diagnostics or product telemetry can use other mechanisms but must not silently enter research evidence. An event stream does not automatically implement Workspace persistence.

Operational request reporting describes the normalized request and its actual resolution/execution outcome independently of research capture or whether a View exists. Usage is subjectless reporting; unsuccessful resolution does not fabricate a program View. Retain actual outcomes, usage and consequential qualifications in their operational roles. Research records of those interactions describe the actual output and selected context without fabricating a view-produced event. [[Actual request reporting](decisions/research-question-driven-observation.md#request-reporting)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

<a id="generated-output-evidence-boundary"></a>
### Generated-output evidence boundary

PostCode outputs about a repository—including observation records, exported Views, context artifacts, CLI output, caches, and reports—must not become independent repository evidence in subsequent analysis of that same repository. Keep them outside it or enforce an explicit exclusion policy. Generic directory names, Git-ignore status, or markings in content do not establish that boundary.

Outputs can be retained, revisited for historical purposes, reused, and compared as PostCode-produced artifacts, provided their provenance and separation from repository evidence remain intact. The boundary governs their evidential role, not all access to or use of them. For example, comparing two earlier summaries can show how PostCode’s accounts changed; their agreement does not independently corroborate a claim about the program. Outputs about other repositories can remain development/test evidence about PostCode. When PostCode investigates itself, exclude locally retained outputs about itself from repository evidence. Sink selection and storage convenience do not waive this obligation.

Repository content derived from PostCode output does not independently corroborate the originating conclusions. Preserve supplied provenance identifying that origin where available; this does not require detecting otherwise unknown derivation.

<a id="scope-and-future-refinement"></a>
## Scope and future refinement

Keep the [capability reference](capability-reference.md), status and interface documentation accurate about supported behavior and disclosed gaps. The [human-facing representation decision](decisions/human-facing-architectural-representations.md#adoption-and-conformance) requires conformance with the human output boundary and inadequacy feedback. The [reconciliation plan](plans/product-design-reconciliation.md#implementation-specification) scopes the implementation and verification needed to establish that conformance.

Existing retention and follow-up provide mechanisms for the required [accumulated-understanding capability](#immutable-results-and-interpretation-history); its intended UX and supporting architecture remain unresolved. The [accumulation decision](decisions/structured-investigram-content.md#require-accumulated-understanding) records the deferred capability and the limits of current support. Further UX decisions may select richer workspace context, specialized workspace kinds, or a particular initial View. Continuity across program changes and application restarts needs later requirements and lifecycle design. Investigation of hypothetical and intended architecture, participant-material intake, general multi-state analysis, live refresh, shared-context protocols, resource-policy mechanisms and new language or Lens families each require appropriately scoped work. Retained interpretation already supplies qualified input to supported follow-up; it does not deliver those broader capabilities.
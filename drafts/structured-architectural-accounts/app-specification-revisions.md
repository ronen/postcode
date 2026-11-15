# Proposed revisions to docs/app-specification.md

These are complete replacement or addition units. Unlisted content is unchanged.

**Replace “Immutable results and interpretation history”, preserving its anchor.**

<a id="immutable-results-and-interpretation-history"></a>
### Immutable results and analysis history

Retained evidence and qualified analysis results are immutable. New contributions and association declarations preserve earlier content, source support, qualification and exact references. Derived standing, reconsideration, display selection and Workspace state can change without changing those records. Immutability is distinct from retention duration, disposal, persistence and availability; disclose supported reference lifetime.

An investigram is an analysis contribution from a mechanical, agentic or other supported producer. Its Analysis content comprises keyed findings and explanations, with referents, evidence, provenance and applicable qualifications. Structural acceptance establishes neither truth nor acceptance of a proposed architecture. Independent producers retain independent input histories even when contributions are accepted together. [[Common contributions](decisions/common-analysis-contributions.md)]

Entities identify things in the system under study; Query results separately organize answers to particular invocations. Exact qualified associations add, supersede or withdraw uses of content. Content can be reused with its original provenance. A contribution can retain qualified addressable items without associations or a designated answer, for later inspection and use; request fulfillment is assessed separately. A displaced association does not invalidate every use of its item or supersede its whole owning investigram. Names and identifying descriptions can coexist without a canonical winner. Investigrams have no parent/child organization requirement. [[Association organization](decisions/association-organization-and-exposure.md)]

Later analysis can explicitly redesignate a Query result while preserving its old designations. A Lens selects information according to its declared question and method: current designated answers preserve alternatives; method-specific queries preserve that method's findings. Complete applicable standing, displacement, cause and qualified history remains available to the application. Presentation must preserve consequential qualification and not make historical or disputed information appear unqualified. Exact retained Projections keep their original selections and snapshots; fresh access can show later status separately. [[Qualified answers](decisions/qualified-answers-over-contributions.md)]

Exposure records actual producer input, including exact uses and scoped inventories/selections. Relevant later changes can produce cause-bearing reconsideration through exposure or designated membership. The warning does not establish error, invalidate a Session, prevent reuse or initiate inference. Answer assembly and human browsing do not create producer exposure. Missing relevant exposure is not evidence that a later claim cannot matter. [[Reconsideration](decisions/association-organization-and-exposure.md#exposure-and-reconsideration)]

PostCode accumulates partial qualified understanding that humans and agents can revisit, extend, challenge and reorganize. Accounts may overlap or disagree without one reconciled authoritative model. Exact original access, conflicts, evidence and qualifications remain available within the supported lifecycle. Detailed graphical navigation, investigram organization, persistence and changed-program correspondence remain later work. [[Accumulated understanding](decisions/structured-architectural-explanation.md#accumulate-qualified-accounts)]

**Replace “Identity, labels, and continuity”.**

<a id="identity-labels-and-continuity"></a>
### Identity, labels, and continuity

Identity, implementation identifiers, displayed labels and navigation handles remain distinct. Interpreted labels retain their provenance and status; a label change is not a program change. Exact identifiers and implementation mappings remain available for traceability and agent coordination. PostCode uses established software-design and architecture vocabulary and notations and can develop additional ones through use. Their applicability and correspondence to implementation details must be established or qualified case by case; they do not form a universal ontology. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)]

Within the supported Session, otherwise identical qualified answers have repeatable Projection identity regardless of the subject's lookup spelling or name/reference route. Equality uses the [canonical effective-input set](decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse), including Session context, method version and meaningful subject order/roles. Equal prose or displayed lists alone do not establish the same answer. Preserve request-specific resolution provenance separately without losing answer-relevant qualification. This is a logical referent contract, not a requirement for physical memoization, annotations or cross-session continuity. [[Qualified answer identity](decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

The foundation’s requirement to preserve continuity across program change stands. Its realization and precise future UX/lifecycle requirements are deferred until experience with the application provides a better basis. The current unchanged-input Session is a disclosed limited subset: detected relevant changes invalidate further investigation and require reopening. PostCode must not silently retarget a View when correspondence becomes uncertain. Preserve current immutable-result, reference, capture, and qualification contracts while avoiding obvious obstacles to later continuity.

The direction preserves earlier attention without inventing successor entities. When future navigation maintains live anchors or input dependencies, uncertainty or disappearance must be exposed while preserving the investigation under the then-supported lifecycle. Discovery, placement, derivation, binding, and investigation role remain distinct. Moving a View or opening another Workspace does not by itself change its basis or erase its lineage. Exact anchor behavior, refresh triggers, save/resume, and multi-capture Session mechanisms remain later design choices.

Entities in hypothetical or intended accounts inherit the identity and provenance supplied by those accounts. Cross-account correspondence must be supported and qualified; matching labels or shared references do not establish realization in software. Preserve provider-specific identity guarantees when mapping native identities to common Session identities. Query results are separate from these Entities. [[Identified things](decisions/common-analysis-contributions.md#identified-things-and-inquiry-results)]

Support lookup of historical/displaced identifying names with their standing, ambiguity and access to current descriptions. A remembered name can locate an Entity without silently becoming its current authoritative name. Exact identities remain usable after identification withdrawal. Initial history inclusion and user confirmation/continuation are interface choices.

**Replace “Captured answers, bindings, and refresh”.**

<a id="captured-answers-bindings-and-refresh"></a>
### Captured answers, bindings, and refresh

Use the [input and binding definitions](core-concepts.md#program-inputs-bindings-captured-states-and-projection-requests). Following inputs are resolved again for subsequent requests; pinned inputs reuse the same captured state. Neither policy makes a retained Projection mutable, nor guarantees atomic or synchronized capture. Runtime inputs can use execution-, interval-, or stream-appropriate bindings while identifying the observations actually captured.

Preserve associations between claims and their supporting states, including order or roles, timing, and capture limitations. Later observations cannot silently support an earlier interval. A branch designation, Session identifier, or identical label does not identify the captured basis or establish correspondence across states.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualification. An interaction that instead refreshes selection must make that behavior apparent and disclose consequential changes. Newly available content or association/designation selections can change an answer without changing the program capture. Disclosed reselection is not equivalent to presenting an exact retained answer; every identifier change or independent fresh request does not require a comparison warning.

Answer assembly selects retained qualified information without creating producer exposure. New synthesis or correspondence remains analysis with its actual inputs recorded; a new selection does not rewrite the generating investigation's history. [[Application and engine](decisions/qualified-answers-over-contributions.md#application-answers-and-captured-bases)]

**Add “Structured explanations and follow-up options” under “Requests and capability behavior”.**

### Structured explanations and follow-up options

Support qualified explanations through prose and structured architectural content, with picture-plus-explanation where appropriate. Content contracts define meaning independently of rendering. An explicit request for a supported diagram requires compatible retained semantic content; prose alone does not fulfill it. Optional authored illustrations identify exact diagram types and content inputs, but compatible rendering does not require an illustration. Preserve limits and separate alternatives; a picture must not invent or strengthen architectural claims. [[Structured explanation](decisions/structured-architectural-explanation.md)]

State-dependent behavior and one bounded directed state-transition diagram are supported through application APIs under the [migration conformance contract](decisions/common-analysis-contributions.md#adoption-and-migration-conformance). The contract covers named states, qualified bearer, established entry, transitions and their conditions/effects; unsupported statechart features and unknown information remain explicit. This is not a full diagram language, GUI or initial user-facing catalogue commitment.

Retained follow-up options are owner-specific qualified metadata. The application can invoke an exact option with its subjects/parameters and declared result contract, preserving the originating information. Investigation of selected content targets that exact information, not silently updated answers. Summary, explanation, decomposition and examination use these semantics; decomposition need not create nested investigrams. API availability does not imply a new CLI command or menu. [[Guidance and scope](decisions/structured-architectural-explanation.md#validation-and-application-scope)]

Initial Entity context supplies all standing identifications with applicable support, qualification and concerns. Additional acquisition and explicit-referent discovery make related retained explanations available without assuming where the user obtained a subject. Delivery is qualified and bounded honestly; inaccessible information is not an established empty result. [[Acquisition](decisions/association-organization-and-exposure.md#acquisition-baseline-context-and-discovery)]

**Replace “Resource-bounded work and outcomes”, preserving resource policy and adding partial-contribution handling.**

<a id="resource-bounded-work-and-outcomes"></a>
### Resource-bounded work and outcomes

Applicability/availability, execution state, result materialization, and epistemological guarantee are distinct. A result can be partial despite successful execution; a stopped or failed attempt can retain usable information when its method permits it. An unavailable analysis may have an earlier qualified partial result. Preserve established emptiness versus absence of a result, and distinguish expected failures from defects.

PostCode may communicate anticipated cost and the likely effect of further analysis with appropriate uncertainty, allowing the human to proceed, stop, accept the qualified current result, or choose a cheaper method. Accumulated cost should be available where practical. Budgets govern effort rather than request meaning; unmet requirements remain explicit. More resources can expand coverage or change method, but do not inherently make a claim truer. A cheaper method with different guarantees must expose that difference.

Preservation of partial information does not override an analysis's acceptance contract. For example, mechanical evidence acquired during an unsuccessful interpretation may survive while no unfinished investigram is accepted. Cancellation, completion of a command, and confirmed cleanup are distinct; do not imply that stopping a request guarantees immediate resource exit. Current session interruption and retry behavior remains governed by the accepted execution decisions.

For ordinary requests, minimize incurred interpretation costs by reusing completed interpretation when a later requirement requests the same compatible work within the supported Session validity contract. Consuming Lens, subject designation and navigation route do not themselves require another investigation. Newly accumulated evidence does not by itself invalidate a reusable outcome; applicable qualification, association/displacement, retention and retry rules continue to apply. Preserve generating provenance and distinguish current consumption from new execution. This follows the [operation reuse and fresh-investigation contract](decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse) without prescribing a cache technique, multi-operation dialogue or semantic matching of other answers. [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

The user can explicitly ask to investigate the same question again using current qualified context and the supported producer configuration, even if nothing has been displaced or marked for reconsideration. A change to the agent model is one possible external reason; no reason is required. This initiates fresh production rather than ordinary retained-outcome reuse. Earlier attempts and answers remain accessible; new production alone does not replace them or clear their concerns. Existing execution authorization, resource and Session boundaries still apply.

If all current answer designations have been withdrawn, ordinary retrieval reports no current designated answer, exposes qualified withdrawal grounds and preserves access to historical answers. It neither restores an old answer nor automatically investigates again. This is not an established absence of architectural findings or a failure of the original investigation. A diagram requirement has no current fulfilling answer in this case, while exact access to the historical diagram remains available. The user can explicitly request a fresh investigation.

Contribution validity, fulfillment and substantive correctness are distinct. If valid content is submitted, retain it and process all its declarations normally even when a required diagram or other requested information is missing, or the producer reports inability. Disclose that shortfall; accepted content is neither quarantined nor passed off as complete. No returned contribution and structurally invalid unrepairable submission remain different cases. [[Contribution outcomes](decisions/common-analysis-contributions.md#access-and-outcomes)]

**Replace “Architectural modalities and captured bases”.**

<a id="architectural-modalities-and-captured-bases"></a>
### Architectural modalities and captured bases

Accounts may concern implemented, hypothetical or intended architecture. Implemented accounts concern actual software and remain supported and qualified by implementation evidence. Hypothetical accounts concern alternatives without implied acceptance, feasibility or realization. Intended accounts concern accepted requirements or design decisions. These distinctions are independent of provenance, method and epistemological status; exact recording of a proposal does not establish that it is feasible, accepted or implemented. Observed behavior supplies execution-scoped evidence rather than another modality. Preserve provenance and history when a proposal becomes an intention. Sharing an account implies neither participant agreement nor authority for PostCode's interpretation. [[Modalities](decisions/specialized-architectural-investigation.md#architectural-modalities)]

A captured basis identifies the specific input material used for a Lens application. It can include program states, observations, participant-supplied architectural material, earlier Projections and other retained qualified contributions, with their qualifications and meaningful roles or order preserved. Program inputs and captured program states remain useful special cases; they do not exhaust the general model. Subject designation does not replace basis attribution. Lens applicability across modalities depends on method, not merely a compatible-looking data shape. New architectural claims require core analysis, including when resolving requests or comparing accounts. [[Captured bases](decisions/qualified-answers-over-contributions.md#application-answers-and-captured-bases)]

The current CLI remains an implemented-architecture subset: configured TypeScript project analysis, module-originating prose interpretations and investigations of selected content within a transient unchanged-input Session. It does not offer hypothetical/intended account investigation or general participant-material capture. These are future capabilities, not prerequisites for retaining the accurately described current subset.

**Replace “Responsibilities and boundaries”.**

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

Rendering and arrangement do not initiate Evaluation or independently query accumulated state to broaden an answer. Interactions requiring additional information return through request coordination, Evaluation, and core construction. Standard expansions remain subject-kind detail declared before evaluation; another Lens question is not made a standard expansion by inline placement. The [qualified-construction boundary](decisions/qualified-answers-over-contributions.md#qualified-construction-and-retained-support) and its scoped binding-only capability remain in force.

Shared, lazy, staged, or presentation-guided execution is permitted when it preserves Lens meaning, qualified populations, materialization, and retained-result semantics. Pushdown does not reclassify presentation parameters as Lens parameters. Current eager builders are a scoped implementation choice, not a universal requirement.

**Replace “Application functionality and interface clients”.**

<a id="application-interface-boundary"></a>
### Application functionality and interface clients

Application and investigation behavior is accessible through an explicit internal
application API independently of the interface used to request it. Shared
services coordinate qualified resolution, information requirements, Evaluation,
answer construction, analysis-contribution selection into answers, retention, exact
retained-answer access, reference validity and operational outcomes. The API is
the request-validation boundary for direct callers. Clients do not duplicate those
operations; they own interaction, input handling, choice of supplied answers to
display, Presentations and output delivery.
[[Internal application boundary](decisions/internal-application-api.md#shared-application-boundary)]

Requests distinguish information needs, exact retained-answer access and
operational reports. Application results preserve selected qualified content and
supporting context independently of display bounds or format. Current eager
families deliver full selected materialized content, without making exhaustive
analysis or eager materialization a universal requirement. Typed application attribution and optional client invocation context remain
distinct from answer meaning and identity. Client Presentation methods affect
their artifacts, not application input or answer identity. Precise IDs suffice for clients;
compact aliases are a CLI affordance. Holding data does not extend the host-declared
Session/reference lifetime or promise availability after disposal. Internal
source-bearing support is not a ready-made public JSON or external-agent export.
[[Qualified answer delivery](decisions/qualified-answers-over-contributions.md#qualified-application-access)]
[[Method provenance](decisions/internal-application-api.md#method-provenance)]

Clients own Presentations and declare their information requirements through shared
coordination. Compatibility uses semantic content contracts
and qualified materialization; arrangement cannot acquire missing information or
broaden a retained answer. Presentations may be shared by compatible clients.
A direct information request without a Presentation defaults to current subject-kind
standard expansions supported by its answer family's content contract and may
request a supported subset;
exact retrieval never acquires missing support. Future costly expansions require
reconsidering that default. Interfaces may expose different capability subsets.
[[Requirements and Presentations](decisions/internal-application-api.md#requirements-and-presentations)]

Application work and client presentation/publication have distinct outcomes. An
answer successfully produced or retrieved remains completed application work when
subsequent client presentation fails; the client still reports its failure.
Application validity requirements must be satisfied before completing application
work, except where a guarded host explicitly takes ownership of those checks. Compact
alias handling preserves existing request and reference behavior without making
aliases a prerequisite for other clients.
[[CLI binding and outcomes](decisions/internal-application-api.md#cli-bindings-and-outcomes)]

Shared provider/account, feedback and delivery services preserve credentials,
resources, actual-display context and failure distinctions independently of command
handling. Shared publication guards enforce validity policy; hosts retain actual
output and recording choices. Feedback services accept available actual-display
context through neutral contracts or explicit context-free input; each client
exposes only the context it can supply. Future human
clients must reuse or re-establish verified output disclosure before exposing
internal support. The boundary permits later hosting without requiring a public
library, network service, separate process or permanent
schema. Keeping useful command-line facilities does not require indefinite
retention of an interactive human shell.
[[Runtime and publication](decisions/internal-application-api.md#runtime-and-publication)]

The associated [implementation plan](plans/application-interface-boundary.md)
establishes conformance for current capabilities. Adoption does not claim that
the existing implementation already supplies the boundary or that future graphical
and external-agent interfaces exist. Those tasks may extend these contracts.

**Replace “Language and evidence integration”.**

<a id="language-and-evidence-integration"></a>
### Language and evidence integration

Language support supplies discoverable subjects, analyses, and guarantees. Concepts shared across languages and language-specific extensions coexist; do not distort implementation semantics to fit a predefined universal model. Structural Projections should use only relationships the applicable language analysis can define accurately, and should not manufacture symmetry where language semantics differ. Repository organization is a qualified scheme, not canonical architecture. External endpoints with opaque interiors do not establish empty interiors or richer package/service identity.

Defined evidence access preserves capture, provenance, qualification, and output exclusions. The built-in investigating agent uses PostCode's subject-based evidence surface; repository material is evidence, not instructions. Its existing prohibition on independent filesystem discovery, shell execution, mutation, and web access remains scoped to that role. External design and implementation agents have separate integration roles; an agent acting in the implementation role may change programs under the human’s instructions. External participation does not expand the built-in investigating agent’s access contract.

**Replace “Scope and future refinement”.**

<a id="scope-and-future-refinement"></a>
## Scope and future refinement

Keep the [capability reference](capability-reference.md), status and interface documentation accurate about supported behavior and disclosed gaps. The [human-facing representation decision](decisions/human-facing-architectural-representations.md#adoption-and-conformance) requires conformance with the human output boundary and inadequacy feedback. The [reconciliation plan](plans/product-design-reconciliation.md#implementation-specification) scopes the implementation and verification needed to establish that conformance.

The [contribution and association architecture](decisions/structured-architectural-explanation.md#accumulate-qualified-accounts) supports the required [accumulated-understanding capability](#immutable-results-and-interpretation-history) through retained qualified information and further investigation. Its implementation and migration follow the [conformance contract](decisions/common-analysis-contributions.md#adoption-and-migration-conformance); adoption does not establish delivery. Broader navigation and initial user-facing catalogue choices remain separate. Further UX decisions may select richer workspace context, specialized workspace kinds, or a particular initial View. Continuity across program changes and application restarts needs later requirements and lifecycle design. Investigation of hypothetical and intended architecture, participant-material intake, general multi-state analysis, live refresh, shared-context protocols, resource-policy mechanisms and new language or Lens families each require appropriately scoped work. Retained interpretation already supplies qualified input to supported investigations of selected content; it does not deliver those broader capabilities.

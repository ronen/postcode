# Proposed revisions to docs/app-specification.md

Replace Working through qualified views, preserving its anchor.

### Working through qualified views

PostCode specializes in qualified architectural investigation and retained understanding for humans working alone or with design and implementation agents. Participants may conduct larger design conversations elsewhere while consulting, challenging, extending and comparing PostCode's accounts. PostCode contributes architectural expertise without taking responsibility for architectural decisions or requiring those conversations to occur inside it. Useful direct human investigation and superior architectural investigative expertise along relevant dimensions are aspirations to evaluate, not assumed advantages; specialization does not depend on demonstrating comparative advantage. [[Product role](decisions/specialized-architectural-investigation.md#specialized-product-role)]

The human investigates through read-only Views and is presumed to understand relevant computational, software-design and architectural concepts without source-language literacy. Views and Projections do not directly modify the program or silently rewrite their underlying material. Receiving participant-supplied requirements, proposals, intentions or rationale is compatible with that boundary; it does not automatically adopt that material or make it implemented. The human continues to direct program changes through implementation agents. Interaction may be graphical, prose-based, command-line or machine-readable, including external-agent invocation. Interfaces share the conceptual model and epistemological contract without necessarily exposing identical facilities.

The working surface supports following subjects, relationships and questions without routinely translating them into source coordinates. Text is a first-class Presentation. An explanation may contain interpretation if its status and supporting basis remain apparent. Qualification is information needed to understand the answer, not a warning hidden in documentation. Plain-English qualification may be clearer than an initially elaborate formal vocabulary.

Presentations can support selection, inline detail, navigation, expansion of evidence attribution and qualifications, opening related Views, and copying references for design- or implementation-agent prompts with their scope and lifetime apparent. Exact controls, gestures, keyboard bindings, visual encoding and layout are UX choices. The interface need not expose the word “Lens” or internal Lens identifiers. Named actions such as “Explain” can have stable meanings and appear in menus, shortcuts and capability documentation.

---

Replace Workspaces and navigation, preserving its anchor and all existing lineage obligations and disclosed gaps.

### Workspaces and navigation

A Workspace is a collection and arrangement of Views, displayed in a tab or window. One tab can contain several Views. The exact tab/window treatment depends on shared interface controls. Opening related information inline or alongside existing information supports exploration without requiring a new top-level context for every answer.

Workspace organization is distinct from program structure, a View's composition, and an analysis Session. Several independent Views arranged together remain several Views. A single coordinating Presentation may instead instantiate one View over several Projections. Placement does not establish a program relationship or change an input binding.

The starting Workspace model requires neither a name, a permanent root subject, a formal task, nor a shared-context object. Ordinary focus supports interaction. An investigation can move beyond the subject from which it began. The human constructs a working surface appropriate to the problem rather than operating within a predetermined dashboard. Avoid requiring the human to maintain a conceptual hierarchy merely to arrange related answers.

Navigation allows a displayed subject or relationship to become the subject of another question. A resulting View may be embedded, opened alongside its origin, or opened in another Workspace. The accumulated Views, their captured bases and relevant lineage form the local **investigation context**. A Workspace arranges Views within that context; the context need not end at a tab or window boundary or require a separate context object. This context supports continuity of investigation without defining all [retained architectural understanding](../foundation/product-design.md#retained-architectural-understanding-and-continuity), which includes accounts and underlying Projections available to humans and agents. [[Context responsibility](decisions/specialized-architectural-investigation.md#retained-understanding-and-context)]

For each retained View, preserve what it shows, its supporting captured bases, and applicable discovery and derivation relationships: the View or subject from which it was opened, the known origin of a supplied reference, and earlier information contributing to a comparison or summary. Moving or closing a visible View does not erase those relationships from retained investigation context. This intended contract applies across interfaces, including the CLI shell, within the supported lifecycle; it does not require a separately stored View object or persistence after that lifecycle ends. Preserve origin relationships the interface establishes and disclose unavailable origin rather than guessing where a human obtained a reference. The current CLI retains qualified results and some investigation provenance but lacks general View-to-View navigation-origin lineage; this [limitation is disclosed and backlogged](decisions/application-specification-boundaries.md#adoption-and-conformance). For example, opening dependencies alongside an explanation retains the navigation origin without asserting that the two answers share a capture or that one is evidence for the other.

Do not assume a uniquely correct hierarchy of the program. Containment may be hierarchical; dependencies, calls, evidence, tests and other relationships offer different paths through an investigation. Files and directories can be subjects or implementation provenance without being the primary organizing model.

Shared Workspace purpose and defaults, specialized Workspace kinds, and their corresponding initial Views remain future UX possibilities. They are not prerequisites for the simple Workspace. If introduced, shared context must not imply that all member Views share a subject or captured state, or that one View supplies evidence for another.

---

Add at the start of Semantic contracts and guarantees, before Qualification and presentation.

<a id="architectural-modalities-and-captured-bases"></a>
### Architectural modalities and captured bases

Accounts may concern implemented, hypothetical or intended architecture. Implemented accounts concern actual software and remain supported and qualified by implementation evidence. Hypothetical accounts concern alternatives without implied acceptance, feasibility or realization. Intended accounts concern accepted requirements or design decisions. These distinctions are independent of provenance, method and epistemological status; exact recording of a proposal does not establish that it is feasible, accepted or implemented. Observed behavior supplies execution-scoped evidence rather than another modality. Preserve provenance and history when a proposal becomes an intention. Sharing an account implies neither participant agreement nor authority for PostCode's interpretation. [[Modalities](decisions/specialized-architectural-investigation.md#architectural-modalities)]

A captured basis identifies the specific input material used for a Lens application. It can include program states, observations, participant-supplied architectural material and earlier Projections, with their qualifications and meaningful roles or order preserved. Program inputs and captured program states remain useful special cases; they do not exhaust the general model. Subject designation does not replace basis attribution. Lens applicability across modalities depends on method, not merely a compatible-looking data shape. New architectural claims require core analysis, including when resolving requests or comparing accounts. [[Captured bases](decisions/specialized-architectural-investigation.md#inputs-and-captured-bases)]

The current CLI remains an implemented-architecture subset: configured TypeScript project analysis, module-originating prose interpretations and qualified follow-up within a transient unchanged-input Session. It does not offer hypothetical/intended account investigation or general participant-material capture. These are future capabilities, not prerequisites for retaining the accurately described current subset. This conceptual scope introduces no modality fields, generalized input capture, design-acceptance workflows, account schemas or persistence machinery.

---

Replace Immutable results and interpretation history, preserving its anchor and existing immutable-result, correction and retention contracts.

### Immutable results and interpretation history

**Retained evidence and qualified results are immutable.** Subsequent analysis, corrections, or refreshed inputs do not alter their content or supporting context. New information produces new records or explicit relationships, while existing references retain their original meaning.

This preserves the basis of dependent results and what an earlier investigation received or established. Immutability is not a requirement for every piece of application state: focus, arrangement, defaults, selected display accounts, and current derived reconsideration status can change. It does not prescribe programming-language immutability or UI state-management techniques.

**Immutability is distinct from retention.** Retention duration, disposal, restart persistence, and cross-session access require separate policies. A discarded result must not silently give its reference a different meaning, but immutability does not imply perpetual retrievability. Disclose reference lifetime where a displayed reference will expire before follow-up use.

Corrections and disagreements remain identifiable. A replacement does not erase the original or establish its own truth. Where an account is selected for display, expose the correction and competing alternatives with their qualifications. Presentational selection does not resolve interpretive disagreement. Earlier interpretations and correction history remain accessible within the supported retention lifecycle; this is intended UX behavior supporting explanation and trust, not an indefinite archive promise. For example, a correction arriving while the human pages through a retained answer leaves those pages on the same selected answer; choosing a refresh can select the correction, with the change made apparent.

Keep result composition, later investigation provenance, correction relationships, citations, and workspace lineage distinct from one another and from program relationships. Existing [interpretation contracts](decisions/investigrams-and-progressive-investigation.md) govern exact-original access, replacement selection, atomic acceptance, conflicting corrections, and correction-aware evidence delivery. Detailed algorithms remain in those decisions rather than being silently replaced by generic wording here.

Reconsideration indicates that interpretation content supplied to an earlier investigation has been corrected, directly or through cited context under the applicable propagation rules. Exposure does not prove reliance, comprehension, or endorsement. The warning does not establish that the account is wrong, invalidate the Session, or automatically trigger inference. Current derived status can change without rewriting the account or its exposure history.

An **[investigram](core-concepts.md#investigram)** is an immutable, addressable artifact containing a qualified interpretation, with referent information, evidence context and provenance. Its **[interpretation content](core-concepts.md#interpretation-content)** may be prose, structured content, or a combination, including prose within a structure. All of that content remains subject to the same qualification, evidence attribution, retention, citation exposure and correction requirements.

PostCode accumulates partial, qualified architectural understanding across investigations. Humans and agents can revisit that understanding and investigate it further; subsequent investigations can reuse, extend or challenge earlier accounts from different architectural perspectives. Accounts can overlap, disagree or remain incomplete; their evidence, qualifications and revision history remain distinguishable. Accumulation does not require a single consolidated, authoritative architecture model. [[Accumulated understanding](decisions/structured-investigram-content.md#require-accumulated-understanding)]

The ways humans and agents consult and contribute to retained architectural understanding, and the architecture supporting those capabilities, require further design informed by concrete journeys. Earlier accounts and underlying Projections can be consulted, compared or used as qualified inputs while keeping their evidence, qualifications and revision history attributable. Reuse does not supply independent repository corroboration. [[Retained understanding](decisions/specialized-architectural-investigation.md#retained-understanding-and-context)] These are currently unresolved application and architectural choices, not merely delegated implementation details. Retention duration, cross-session availability and correspondence across changed program states remain to be determined.

Structured interpretation is an expected ingredient of the accumulated understanding capability, but permitting it does not select account schemas, organization or supporting architecture. Structured form does not make an interpretation mechanically established. [[Structured interpretation](decisions/structured-investigram-content.md#permit-structured-interpretation)]

---

Replace Identity, labels, and continuity, preserving its anchor.

### Identity, labels, and continuity

Identity, implementation identifiers, displayed labels and navigation handles remain distinct. Interpreted labels retain their provenance and status; a label change is not a program change. Exact identifiers and implementation mappings remain available for traceability and agent coordination. PostCode uses established software-design and architecture vocabulary and notations and can develop additional ones through use. Their applicability and correspondence to implementation details must be established or qualified case by case; they do not form a universal ontology. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)]

Within the supported Session, otherwise identical qualified answers have repeatable Projection identity regardless of the subject's lookup spelling or name/reference route. Equality uses the [canonical effective-input set](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity), including Session context, method version and meaningful subject order/roles. Equal prose or displayed lists alone do not establish the same answer. Preserve request-specific resolution provenance separately without losing answer-relevant qualification. This is a logical referent contract, not a requirement for physical memoization, annotations or cross-session continuity. [[Qualified answer identity](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

The foundation’s requirement to preserve continuity across program change stands. Its realization and precise future UX/lifecycle requirements are deferred until experience with the application provides a better basis. The current unchanged-input Session is a disclosed limited subset: detected relevant changes invalidate further investigation and require reopening. PostCode must not silently retarget a View when correspondence becomes uncertain. Preserve current immutable-result, reference, capture, and qualification contracts while avoiding obvious obstacles to later continuity.

The direction preserves earlier attention without inventing successor entities. When future navigation maintains live anchors or input dependencies, uncertainty or disappearance must be exposed while preserving the investigation under the then-supported lifecycle. Discovery, placement, derivation, binding, and investigation role remain distinct. Moving a View or opening another Workspace does not by itself change its basis or erase its lineage. Exact anchor behavior, refresh triggers, save/resume, and multi-capture Session mechanisms remain later design choices.

Entities in hypothetical or intended accounts inherit the identity and provenance supplied by those accounts. Cross-account correspondence must be supported and qualified; matching labels or shared references do not establish realization in software. The current implemented-entity identity and Session contracts remain unchanged. [[Architectural subjects](decisions/specialized-architectural-investigation.md#architectural-subjects)]

---

Replace Comparison and conceptual change, preserving its anchor.

### Comparison and conceptual change

Architectural comparison may concern different implemented states, competing hypothetical alternatives, or intended and implemented accounts. Preserve each account's modality, basis, evidence and qualifications; their evidentiary bases need not be equivalent. Applying a Lens at two states and presenting the results together is one implemented-state case. Juxtaposition permits direct comparison without claiming that PostCode has derived a relationship. Alignment uses supported correspondence or exact identity guarantees within their scope; matching labels alone do not establish semantic continuity. [[Architectural comparison](decisions/specialized-architectural-investigation.md#architectural-modalities)]

Identifying correspondence, additions, removals, changed relationships, consequences, significance, conformance or contradiction requires a qualified comparison Lens. A conceptual diff concerns change between program states; it can use ordered states with roles and intermediate evolution where relevant. Implementation review may compare prior implementation, intended change and resulting implementation, distinguishing what changed, whether it changed as intended and additional architectural consequences.

Different perspectives may coexist: mechanically derived dependency changes, interpreted responsibility movement, test-supported behavior or asserted requirement correspondence. Expose selection criteria, methods, alternatives and omissions without implying one uniquely correct account. Analysis behavior must be stable or versioned sufficiently that PostCode changes do not masquerade as program changes. No particular comparison command, Lens or cross-modality implementation is selected here.

---

Replace Language and evidence integration, preserving its anchor.

### Language and evidence integration

Language support supplies discoverable subjects, analyses, and guarantees. Concepts shared across languages and language-specific extensions coexist; do not distort implementation semantics to fit a predefined universal model. Structural Projections should use only relationships the applicable language analysis can define accurately, and should not manufacture symmetry where language semantics differ. Repository organization is a qualified scheme, not canonical architecture. External endpoints with opaque interiors do not establish empty interiors or richer package/service identity.

Defined evidence access preserves capture, provenance, qualification, and output exclusions. The built-in Investigator uses PostCode's subject-based evidence surface; repository material is evidence, not instructions. Its existing prohibition on independent filesystem discovery, shell execution, mutation, and web access remains scoped to that role. External design and implementation agents have separate integration roles; an agent acting in the implementation role may change programs under the human’s instructions. External participation does not expand the built-in Investigator’s access contract.

---

Replace Shared context for external coding agents; retain the existing shared-context-for-external-coding-agents anchor and add the new anchor shown below.

<a id="shared-context-for-external-agents"></a>
### Shared context for external agents

Humans, design agents and implementation agents should be able to use projected subjects and relationships as shared referents in human, agent or mixed investigations. They may conduct their larger conversations elsewhere. An agent need not wait for a human investigation before requesting supported information or consulting retained accounts. A limitation shown in a View can inform development, but is not itself an instruction to change the program. [[External participants](decisions/specialized-architectural-investigation.md#external-participants)]

Machine-readable context represents the current investigation without becoming a canonical representation of the program. It should make available the repositories represented, focused subject/View, open Views and their references, subjects and Projections, Lens and presentation choices, content and qualification, source mappings, designated inputs and bindings, captured bases and their associations, and applicable discovery, derivation, and placement relationships among Views. Live dependencies and investigation roots belong in that context if supported; the simple Workspace does not require inventing them. The interface design must make its Workspace/window scope and focus selection clear. Include a formalized task/information need where available, and system-initiated results materially influencing current choices. Simple workspaces need not invent richer shared purpose to expose their existing Views and focus.

References distinguish an exact retained Projection over its captured basis from a request repeatable against currently bound inputs. Make a consequential difference between the displayed basis and a subsequent request's basis recognizable. Reference lifetime and scope must be explicit enough for agent use; session-local spellings do not acquire durable meaning through export.

A synchronized context artifact is an available initial mechanism. If used, it should be atomically published, carry sufficient revision/basis information, avoid dirtying the repository, and not normally be committed. A compact manifest can reference separate records rather than duplicate an indefinitely growing body. Representation is open but should be documented and stable enough for different external agents to consume without bespoke integration. Generated context must respect the evidence boundary below.

---

Replace Incoming agent context and interactive exchange; retain its existing anchor and add the new anchor shown below.

<a id="participant-material-and-agent-exchange"></a>
### Participant material and agent exchange

A human or external agent may supply requirements, proposals, intentions, task understanding, correspondence among hypothetical, intended and implemented elements, rationale, constraints, uncertainty, verification, affected subjects or suggested investigation. Preserve participant provenance and asserted or interpretive status; structured form and exact recording do not establish truth, feasibility, acceptance or realization. Associate contributions with their relevant captured material and, where available, originating task or conversation. This does not prescribe an acceptance workflow. [[External participants](decisions/specialized-architectural-investigation.md#external-participants)]

Agent investigation and exchange encompass requesting supported Projections, consulting retained accounts, repeating requests, contributing material and suggesting further investigation. They are broader than a coding-agent handoff after human exploration. The same conceptual and qualification model applies without requiring an integrated conversation. Current CLI invocation offers only its documented capabilities and reference lifetime; general participant-material ingestion and shared-context exchange remain future capabilities. No particular transport, conversation host or milestone is selected here.

---

Replace Interaction capture and subjective reports, preserving its anchor.

### Interaction capture and subjective reports

Automatically record relevant requests and choices, including prose prompts; external-agent prompts where available; selected subjects, Lenses, parameters, Projections, Presentations and actual View composition; navigation, investigation-context evolution and workspace changes; representation limitations, evidence-attribution disclosures, displays of source as source and reported inadequacy; agent-context interaction, failures/refusals/unavailability, evaluation dimensions, resource estimates, budgets or thresholds, human resource choices and actual usage where available. Distinguish work available from work actually presented, and machine evidence delivery from human output. Source display, disclosed representation limits and reported inadequacy remain distinct observations; displaying source does not by itself establish that a conceptual representation failed. Composition and captured-basis changes are observable events rather than only new rendering metadata.

Make contemporaneous subjective observations easy to record, with optional explanation. Do not infer a subjective report from provenance access or automatic refusal. These reports complement automatic capture without turning every use into a separate research diary. [[Representation limits and feedback](decisions/human-facing-architectural-representations.md#representation-limits-and-feedback)]

Preserve enough provenance to relate observations to PostCode version, relevant repository commits and working-tree state, the bases of participating Projections, session, task where available, and research use versus testing/debugging PostCode. Session identity does not establish one task or a consistent program snapshot. Distinguish human-, external-agent-, and PostCode-initiated activity; system-initiated investigation records request-scoped versus autonomous attribution and its parent or trigger. Where a task is formalized, context may include its definition or a stable reference to the defining task artifact or conversation. Attribution is distinct from full reproducibility or indefinite retention of repository contents.

Retain or reference enough surrounding requests, Views, choices, captured bases and lineage to interpret each observation. Recording relevant investigation-context evolution remains a local application obligation; it does not require copying all retained architectural understanding into each event or treating observations as the store that restores it. Self-contained feedback batches continue to include the available displayed artifacts and exact output under their existing delivery contract. [[Observation responsibility](decisions/specialized-architectural-investigation.md#retained-understanding-and-context)]

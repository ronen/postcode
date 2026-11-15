# Proposed revisions to docs/app-specification.md

These are complete replacement or addition units. Unlisted content is unchanged.

**Replace “Immutable results and interpretation history”, preserving its anchor.**

<a id="immutable-results-and-interpretation-history"></a>
### Immutable results and analysis history

Retained evidence and qualified analysis results are immutable. New contributions and association declarations preserve earlier content, source support, qualification and exact references. Derived standing, reconsideration, display selection and Workspace state can change without changing those records. Immutability is distinct from retention duration, disposal, persistence and availability; disclose supported reference lifetime.

An investigram is an analysis contribution from a mechanical, agentic or other supported producer. Its Analysis content comprises keyed findings and explanations, with referents, evidence, provenance and applicable qualifications. Structural acceptance establishes neither truth nor acceptance of a proposed architecture. Independent producers retain independent input histories even when contributions are accepted together. [[Common contributions](decisions/common-analysis-contributions.md)]

Entities identify things in the system under study; Query results separately organize answers to particular invocations. Exact qualified associations add, supersede or withdraw uses of content. Content can be reused with its original provenance. A displaced association does not invalidate every use of its item or supersede its whole owning investigram. Names and identifying descriptions can coexist without a canonical winner. Investigrams have no parent/child organization requirement. [[Association organization](decisions/association-organization-and-exposure.md)]

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

**Add “Structured explanations and retained follow-up” under “Requests and capability behavior”.**

### Structured explanations and retained follow-up

Support qualified explanations through prose and structured architectural content, with picture-plus-explanation where appropriate. Content contracts define meaning independently of rendering. An explicit request for a supported diagram requires compatible retained semantic content; prose alone does not fulfill it. Optional authored illustrations identify exact diagram types and content inputs, but compatible rendering does not require an illustration. Preserve limits and separate alternatives; a picture must not invent or strengthen architectural claims. [[Structured explanation](decisions/structured-architectural-explanation.md)]

The first mechanism delivery supplies state-dependent behavior and one bounded directed state-transition diagram through supported application APIs. The contract covers named states, qualified bearer, established entry, transitions and their conditions/effects; unsupported statechart features and unknown information remain explicit. This is not a full diagram language, GUI or initial user-facing catalogue commitment.

Retained follow-up options are owner-specific qualified metadata. The application can invoke an exact option with its subjects/parameters and declared result contract, preserving the originating information. Prior-result investigation targets exact selected information, not silently updated answers. Existing summary/explanation/decomposition/examination capabilities migrate to these semantics; decomposition need not create nested investigrams. API availability does not imply a new CLI command or menu. [[Guidance and scope](decisions/structured-architectural-explanation.md#validation-and-application-scope)]

Initial Entity context supplies all standing identifications with applicable support, qualification and concerns. Additional acquisition and explicit-referent discovery make related retained explanations available without assuming where the user obtained a subject. Delivery is qualified and bounded honestly; inaccessible information is not an established empty result. [[Acquisition](decisions/association-organization-and-exposure.md#acquisition-baseline-context-and-discovery)]

**Replace “Resource-bounded work and outcomes”, preserving resource policy and adding partial-contribution handling.**

<a id="resource-bounded-work-and-outcomes"></a>
### Resource-bounded work and outcomes

Applicability/availability, execution state, result materialization, and epistemological guarantee are distinct. A result can be partial despite successful execution; a stopped or failed attempt can retain usable information when its method permits it. An unavailable analysis may have an earlier qualified partial result. Preserve established emptiness versus absence of a result, and distinguish expected failures from defects.

PostCode may communicate anticipated cost and the likely effect of further analysis with appropriate uncertainty, allowing the human to proceed, stop, accept the qualified current result, or choose a cheaper method. Accumulated cost should be available where practical. Budgets govern effort rather than request meaning; unmet requirements remain explicit. More resources can expand coverage or change method, but do not inherently make a claim truer. A cheaper method with different guarantees must expose that difference.

Preservation of partial information does not override an analysis's acceptance contract. For example, mechanical evidence acquired during an unsuccessful interpretation may survive while no unfinished investigram is accepted. Cancellation, completion of a command, and confirmed cleanup are distinct; do not imply that stopping a request guarantees immediate resource exit. Current session interruption and retry behavior remains governed by the accepted execution decisions.

Minimize incurred interpretation costs by reusing completed interpretation when a later requirement requests the same compatible work within the supported Session validity contract. Consuming Lens, subject designation and navigation route do not themselves require another investigation. Newly accumulated evidence does not by itself invalidate a reusable outcome; applicable qualification, association/displacement, retention and retry rules continue to apply. Preserve generating provenance and distinguish current consumption from new execution. This reaffirms [operation reuse](decisions/investigation-operations-and-lenses.md) without prescribing a cache technique, multi-operation dialogue or semantic matching of other answers. [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

Contribution validity, fulfillment and substantive correctness are distinct. If valid content is submitted, retain it and process all its declarations normally even when a required diagram or other requested information is missing, or the producer reports inability. Disclose that shortfall; accepted content is neither quarantined nor passed off as complete. No returned contribution and structurally invalid unrepairable submission remain different cases. [[Contribution outcomes](decisions/common-analysis-contributions.md#access-and-outcomes)]

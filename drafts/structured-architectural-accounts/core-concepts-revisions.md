# Proposed revisions to docs/core-concepts.md

These are complete replacement or addition units. Unlisted content is unchanged.

**Replace “Entity”.**

### Entity

*[decision: [Identified things and inquiry results](decisions/common-analysis-contributions.md#identified-things-and-inquiry-results)]*

An **Entity** is an explicitly identified thing in the system under study, distinct from claims made about it. Modules, symbols, groups, states, instance roles and deliberately identified architectural relationships or patterns can be Entities. Not every relationship claim, edge, content item or addressable record is an Entity. Identification of a relationship does not establish its occurrence or behavioral conditions.

A common identity preserves explicit reference within the supported Session. A later analysis reusing it refers to the previously identified thing without endorsing its descriptions. Names and descriptions are qualified information associated with the identity; several can coexist. A readable name/designation and sufficient distinguishing context constitute identifying support, not a complete behavioral definition. Assigned labels are distinguishable from names in the system under study.

Provider-native identity is resolved under its method and scope before common identity allocation. Existing mechanical identity guarantees remain method-specific; interpreted identity is an explicit qualified identification, not a guarantee of unique discovery. Hypothetical and intended Entities inherit the account's modality and provenance. Correspondence across independent accounts or program states requires qualified analysis; matching names alone does not establish it.

Exact reference, native identity, implementation identifier, displayed label and continuity of human attention are distinct. Displacing identifying information does not change what an exact Entity ID denotes. Historical-name lookup preserves qualification and ambiguity rather than silently turning a remembered name into an authoritative current description.

**Replace “Subject”.**

### Subject

*[decision: [Identified things and inquiry results](decisions/common-analysis-contributions.md#identified-things-and-inquiry-results)]*

A **Subject** is what a Lens investigates or a claim concerns. It is a role, not another Entity kind. Entities, collections, architectural relationships, qualified changes, investigrams and exact selected information can be subjects where the method supports them. A configured project can be an inventory subject without denoting an executable entry point or a Workspace.

Subject designation does not establish a captured basis, input binding or correspondence. A question about a module across states preserves those separately identified states; a question about an identified removal preserves its change and supporting evidence. Subjects can concern implemented, hypothetical or intended architecture within the capability's supported modalities.

An investigation of selected content preserves the exact selected investigram/content/designated answer as its subject, with its originating question/result and applicable standing available separately. It does not silently follow a Query result's latest designation. A selected phrase need not be registered as an Entity. [[Exact prior information](decisions/qualified-answers-over-contributions.md#exact-prior-information-as-a-subject)]

**Replace “Relationship”.**

### Relationship

*[decision: [Identified things and inquiry results](decisions/common-analysis-contributions.md#identified-things-and-inquiry-results)]*

An **architectural relationship** is a connection in the system under study, such as containment, dependency, a call or documentation about a subject. A relationship claim asserts a connection with its own Claim context; participants need not all be Entities. Its meaning is distinct from depiction as an edge.

A relationship may be deliberately identified as an Entity for continued reference, while claims about its occurrence, participants and conditions remain qualified content. A mechanical edge does not automatically receive that identity. References between records alone assert no architectural relationship.

**Investigram relationships** organize retained contributions through provenance, exposure and amendment information. **Content associations** assert qualified uses of information for Entities or Query results. These are different from relationships in the described architecture; shared representation does not merge their meanings.

**Add “Query result” after “Subject”.**

### Query result

*[decision: [Result designation](decisions/association-organization-and-exposure.md#result-designation-and-historical-selection)]*

A **Query result** is the organizing identity for the answer to one particular engine investigation invocation. It is neither an Entity in the system under study nor a Projection. Its designated answers remain traceable to the invocation's question, subjects and parameters so their meaning can be understood.

The invocation is the particular request; the Query result is a distinct identity organizing its answers. Keeping access to invocation context does not make the two the same object or concept.

A **result designation** is an immutable content association selecting exact items or declarations for that answer, possibly across investigrams. Later designations can add alternatives, supersede exact earlier designations or withdraw them. Membership never silently substitutes current content. Recognized ordinary reuse of an existing request reuses its result identity; a new user action does not alone create another invocation. Explicitly requesting a fresh investigation starts a new producing attempt and preserves earlier history, without automatically displacing earlier answers. Its answer can be designated for the repeated question's earlier Query result; ordinary retrieval follows the standing of those designations. An application Lens may select designated information into a Projection under its own question/method contract.

**Replace “Captured bases, program inputs and Projection requests”, preserving its explicit anchors.**

<a id="program-inputs-bindings-captured-states-and-projection-requests"></a>
<a id="captured-basis"></a>
### Captured bases, program inputs and Projection requests

*[decision: [Inputs and captured bases](decisions/qualified-answers-over-contributions.md#application-answers-and-captured-bases)]*

A **captured basis** identifies the specific input material used for a Lens application. It may contain one or more program states, observations, participant-supplied architectural material or earlier Projections. Preserve the contributions' provenance, scope and limitations, their associations with the information they support, and meaningful roles or order. Including material does not establish its truth or agreement with other material. Earlier PostCode output remains a qualified artifact, not independent repository evidence.

A **program input** is a designated source of program information, such as a repository revision, working tree, index, execution or observation stream. Its **binding policy** determines which state is used when a request is performed. For revision-oriented inputs, following resolves a changing input again and pinned continues to use the same captured program state.

A **captured program state** is program information captured from a designated input, with attributable scope, capture timing and limitations. It is one possible basis contribution and need not be exhaustive or atomic. An input designation or Session identifier alone is not a captured basis.

A **Projection request** designates applicable inputs, a subject, a Lens and Lens parameter values. Execution identifies the material actually used as the result's captured basis. Binding policies apply where the input supports them; participant material and earlier Projections do not acquire following or pinned policies by analogy. Repeating a request is distinct from presenting an exact retained Projection. A Session supplies analysis and reference context, not an input binding.

Retained content supplied to a producer contributes to its basis with the actual delivered content, provenance, qualifications and limitations. Delivery is not reliance, agreement or evidential support; a reference alone is not content delivery. A Projection's selected content, associations/designations and status snapshots also contribute to its captured basis, separately from the inputs to their generating producers and from captured program states. Answer assembly and retrieval do not create production exposure. [[Production and selection](decisions/qualified-answers-over-contributions.md#application-answers-and-captured-bases)]

**Replace “Evaluation”, retaining its existing definition and adding the contribution/outcome distinction.**

<a id="evaluation"></a>
### Evaluation

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evaluation** is PostCode's attempt to materialize requested information through applicable analyses. Information requirements include those arising from lenses and standard expansions requested by Presentations or by explicit or default content requirements of the request. These requirements do not require a Presentation to be instantiated. [[Direct content requirements](decisions/internal-application-api.md#requirements-and-presentations)] Execution constraints describe the conditions under which the attempt is made, rather than the question the lens asks.

Requirements can also arise from system-initiated investigation serving an explicit parent request or authorized autonomous work. [[Investigation initiation](decisions/research-question-driven-observation.md#investigation-attribution)]

Applicable analyses include mechanical and agentic production of qualified investigrams through a shared contribution boundary. Operational protocols can differ; acceptance does not flatten their method guarantees. [[Production and execution](decisions/common-analysis-contributions.md#production-and-execution)]

An **evaluation outcome** describes what occurred in that attempt: applicability and availability, execution state, result materialization, relevant cost, and reasons for failure or stopping. **Materialization** is how much of the requested information has been produced. These dimensions are distinct from the epistemological status of any produced claim.

An outcome can exist without a produced claim or entity, and an incomplete attempt can have usable qualified results. An established empty result is therefore different from the absence of a result. Evaluation outcome and Claim context describe different things even when an outcome helps explain a projection's coverage or limitations.

Contribution validity, request fulfillment and substantive correctness are distinct. Valid submitted contributions are retained and all their declarations processed normally even if the requested information remains incomplete or the producer reports inability. No accepted contribution, malformed submission and accepted-but-unfulfilled work remain distinct outcomes. [[Access and outcomes](decisions/common-analysis-contributions.md#access-and-outcomes)]

**Replace “Investigator” with “Investigation and producer”; preserve the investigator anchor.**

<a id="investigator"></a>
### Investigation and producer

*[decision: [Production and execution](decisions/common-analysis-contributions.md#production-and-execution)]*

An **investigation** is an inquiry whose analysis can produce qualified information. A **producer** is the operational role that supplies analysis contributions for validation and retention. Mechanical and agentic mechanisms are current examples, not an exhaustive taxonomy or mandatory shared execution protocol.

An **investigating agent** conducts a dialog with PostCode, uses supplied context, requests supported evidence and submits contributions. Interpretation describes the epistemic character of explanatory judgment, not every investigation's result. The agent boundary retains its restricted evidence access, resource and credential contracts; a mechanical producer retains its own analysis and failure contracts. The common mechanism accepts immutable investigrams with truthful method provenance and qualification.

**Replace “Session”, changing only the retained-reference clarification.**

<a id="session"></a>
### Session

*[decision: [Transient analysis sessions](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]*

A **Session** is a continuing context for investigation, retaining subject-reference bindings, captured evidence, analysis results, evaluation outcomes, and projections. Its accumulated information can grow as requests require additional analysis or inputs. A session is not an immutable description of a fixed, completely observed input set, a workspace of managed views, or a following binding for changing program inputs. [[Input bindings and Session context](decisions/coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states)]

Within a session, a reference once bound to an entity cannot be rebound. Evidence and published results retain their content, supporting context, and qualifications when later work adds information. Session membership alone does not establish a claim's evidence, completeness, or guarantee.

References bound to investigrams, items, associations, Query results and result designations retain their exact meanings. Later declarations change derived use/standing, not identity or captured content. [[Immutable contributions](decisions/common-analysis-contributions.md#immutable-analysis-contributions)]

The initial session opens one configured project and assumes its relevant inputs remain unchanged. Detection of a relevant change invalidates the session for further investigation; detection is best-effort and capture remains non-atomic. This does not establish earlier contents of an input first observed later.

A transient session ends with its process. References have meaning within the active session. Research records may use a Session identifier to correlate captured interactions; it does not establish the evidential basis or consistency of architectural claims. Research recording is distinct from the provenance and qualification required by retained results and may be absent in ordinary non-research use. Persistence and any future validity policy for reopening a session are separate decisions. [[Research capture](decisions/research-question-driven-observation.md#research-capture)]

Immutability is a property of retained information, distinct from retention duration, disposal, persistence, and availability after restart. It does not imply immutability of focus, layout, or derived current status. See the [retained-information constraints](architectural-constraints.md#session-references-and-retained-information) for the obligations. [[Immutability and retention](decisions/application-specification-boundaries.md#distinguish-immutable-information-from-retention-policy)]

**Replace “Lens”, retaining its existing definition and adding qualified delegation.**

### Lens

*[decision: [Results over captured bases](decisions/research-question-driven-observation.md#results-over-captured-bases)]*

A **Lens** describes the aspect of a subject being investigated: the question being asked. Lens parameters refine the information requested, such as direct versus transitive callers. A Lens may use multiple analyses, evidence sources, reusable operation outcomes or qualified Projections to produce its answer. Its method preserves the provenance, qualifications and limitations of those contributions. “Composite Lens” is descriptive language for a method, not a separate architectural category or a requirement to use other Lenses for every analysis contribution.

A Lens is distinct from the operations supplying its information and from the Presentation coordinating its result with other results. Combining several Projections in a View need not produce another Lens answer. A summary Lens produces a qualified account; a summary View may instead coordinate separately qualified answers. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

A Lens definition makes its question, applicability/cardinality, parameter meaning, requirements and prospective result contract explicit. The question is a conceptual information need rather than necessarily a user-supplied prose question. Subject-specific implementations can realize one Lens through different work and result contracts. The selected implementation remains attributable through its versioned method and provenance, separately from the Lens identity. Shared authoring declarations may define a Lens and its default operation conveniently; requirements and reusable operation identity remain distinct. [[Explicit Lens meaning](decisions/lens-application-and-request-outcomes.md#represent-lens-meaning-independently-of-lookup-and-implementation)]

A Lens invoking a follow-up option can delegate its specific question to an exact retained qualified follow-up option. The default result contract permits qualified supported content; a promised specialized form, such as a diagram, is explicit. The option's owner/key and meaning remain attributable. [[Guidance](decisions/structured-architectural-explanation.md#qualified-guidance-and-illustrations)]

**Replace “Projection”, preserving outer meaning and clarifying the engine mapping.**

### Projection

*[decision: [Results over captured bases](decisions/research-question-driven-observation.md#results-over-captured-bases)]*

A **Projection** is the qualified information produced by applying a Lens to a subject and a captured basis, with particular Lens parameter values. It includes its content and the qualifications needed to understand what that content establishes. The subject may be a collection. Requests designate applicable inputs; the result identifies the specific material actually used. Associations of basis contributions with claims and evidence, and meaningful ordering or roles among contributions, are part of interpreting the result.

A Projection is an architectural-domain object, addressable within its Session, identifying its subject, Lens, Lens parameters and session context, with references to selected claims, their captured supporting basis and method context, and relevant Evaluation outcomes. Session membership and a branch designation do not themselves establish that basis. A Projection is distinct from an evaluation attempt and from a rendering of its result.

A produced Projection retains the information selected for that result. Later accumulation or input changes do not mutate its captured basis, selected content or qualification. For revision-oriented inputs, a following binding resolves a changing input again on subsequent requests; a pinned binding continues to use the same captured program state. A result from newly captured input identifies that new basis without changing earlier results. Pinning the input does not mean redisplaying an exact retained Projection. Reusing or rendering a retained Projection need not establish a different answer. For mechanical analyses, equivalent inputs, methods, requirements and completed evaluation preserve deterministic semantic content. Later evaluation may add information missing from incomplete work without changing the earlier Projection or outcome. Presentation choices describe how supplied information is shown and do not redefine the Lens question. [[Immutable information](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)] [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

A Lens selects engine information according to its question/method contract. It can select Query-result designations, but these are not Projections and there is no required one-to-one Lens/invocation/investigram mapping. Preserve exact content, associations/designations, qualification and status selected for the answer. Current designated answers retain equally standing alternatives; method-specific answers retain that method's findings with applicable history available. An exact Projection does not acquire later changes. [[Lens selection](decisions/qualified-answers-over-contributions.md#lens-answers-and-engine-selection)]

Otherwise identical qualified answers have repeatable logical identity within the supported Session, independently of subject designation or lookup route. Equality uses the decision’s [canonical effective-input set](decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse), including Session context, method version and meaningful subject order/roles. Invocation-specific resolution information has a separate owner; answer-relevant qualification remains in the Projection. This preserves full immutable payload consistency without requiring physical memoization or cross-session identity. [[Qualified answer identity](decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse)]

**Replace “Investigram”.**

### Investigram

*[decision: [Immutable analysis contributions](decisions/common-analysis-contributions.md#immutable-analysis-contributions)]*

An **Investigram** is an immutable, addressable analysis contribution produced mechanically, agentically or by another supported mechanism. It contains or resolves to:

- **Analysis content:** keyed content items containing findings and explanations, including prose and specialized structured information.
- **Referent information:** explicitly identified things the contribution concerns, separately from its selected subject and evidence. A prose mention alone is not a referent reference. A separate free-form description of the investigation subject is not required; exact selected content and its recorded context identify a selected-content subject.
- **Evidence context:** supporting material and its claimed relationship to the information.
- **Provenance:** producing operation, selected subject/context, method, basis and actual input deliveries.
- **Qualifications:** attributable Claim context for content and organizing judgments, including narrower scope and limitations.
- **Organizing metadata:** content-association declarations and, where supplied, qualified follow-up options, illustrations and inconsistency reports.

A submitted pool of investigrams is accepted atomically without parent/child nesting. Different producers in one pool retain separate provenance/exposure. Content can be referenced across owners without copying or strengthening it. A declaration-only contribution is possible; no artificial substantive root is required.

An investigram is not globally replaced. Later declarations can displace particular uses, leaving original items, metadata, qualifications and identity intact. The contribution is not a Query result, a Projection, a program Entity merely by being addressable, or an accepted architectural intention merely because it was retained. Analysis content retains the actual epistemic guarantees of its method.

**Add “Analysis content and content items” and “Content association” after “Investigram”.**

<a id="interpretation-content"></a>
<a id="analysis-content"></a>
### Analysis content and content items

*[decision: [Content contracts](decisions/structured-architectural-explanation.md#content-and-catalogue-responsibilities)]*

**Analysis content** is an investigram's substantive information. A **content item** is an addressable keyed portion of it. Its **content type** identifies a supported structure; its **content-type contract** specifies meaning, required information, references, qualifications, dependencies and partiality. A **schema** describes mechanically checkable shape. Neither structure nor schema validation establishes truth.

Items can contain several related claims; not every sentence is an independent proposition record. Local component keys enable exact references without introducing global Entities. A qualified prose item remains valid, but does not silently satisfy a requested specialized form. Architectural concepts guide interpretation; diagram types map compatible supplied information to pictures without adding architectural claims.

### Content association

*[decision: [Qualified declarations](decisions/association-organization-and-exposure.md#qualified-declarations-and-exact-uses)]*

A **content association** is a qualified designated use of content for an Entity and information role, or for a Query result. Identification is a recognized Entity role; other topical information uses meaningful local keys, and further understood roles can be added when justified. The protocol may encode generic topical associations without making `topic` a fixed governing role. A result designation targets a Query result. Topic labels are not global identities. Every association has its own address within its owning investigram.

**Association declarations** add a use, supersede exact earlier uses with a new one, or withdraw uses without replacement. They are qualified immutable organizing metadata. They may reference another investigram's content without transferring ownership, evidence or provenance. Displacing one use does not globally invalidate its content or other associations. Derived standing, qualifications and reconsideration are distinct; no last-writer priority or automatic reinstatement is implied.

**Add “Exposure and reconsideration” after “Content association”.**

### Exposure and reconsideration

*[decision: [Exposure and reconsideration](decisions/association-organization-and-exposure.md#exposure-and-reconsideration)]*

An **exposure index** records qualified information actually supplied to a producing investigation, including exact association/content deliveries and explicitly acquired inventory or selection scopes. It does not assert reliance, endorsement or comprehension. Per-investigram attribution follows its actual production history, not a shared acceptance batch. Bare references, host equality reuse, human browsing and answer assembly create no production exposure. Evidence citations are different from this index.

**Needs reconsideration** is derived cause-bearing status from relevant later changes to acquired information/scopes or exact designated membership, including transitive exposure paths. Known context and substantive updates received during production follow the timing rules. Fixed result membership is not exposure, and an exact description is not a blanket inventory dependency. A warning does not prove error, suppress reuse, clear other causes or initiate investigation. Exact captured answers remain unchanged; fresh access can disclose current standing and causes.

Status is derived for each exact designation, not one warning set on the Query result. Its own displacement is standing; the designation does not acquire the cause that created it. Independent membership and producing-context concerns remain applicable.

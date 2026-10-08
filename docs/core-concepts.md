# Core Concepts

This document states PostCode's governing cross-cutting architectural terminology and the relationships necessary to define it. It says what the terms mean now; accepted [decision records](decisions/) preserve why the concepts were adopted or changed. It conforms to the adopted [product design](../foundation/product-design.md), which governs product direction rather than implementation architecture. Binding cross-cutting rules that implementations must follow are stated separately in [architectural constraints](architectural-constraints.md).

This document is not an exhaustive ontology or an inventory of implementation types. It defines only concepts and distinctions that need to remain stable across plans and slices. Definitions do not prescribe classes, interfaces, schemas, storage, module boundaries, or language-specific representations. Examples illustrate meanings, not a list of implemented capabilities.

Semantic changes require explicit human agreement and a corresponding accepted decision record, with both updated in the same commit. For every defined term, include a term-level `*[decision: ...]*` link to the decision that established or most recently changed its general definition. When a later decision makes a localized semantic addition or change without replacing that term-level provenance, add a `[[...]]` decision link at the end of the affected sentence or paragraph. Follow the [development workflow](../dev/workflow.md#documentation) when changing this document. If this document and an accepted decision disagree, treat the inconsistency as an unexpected finding rather than silently choosing or reconciling them.

## Subjects and program information

### Entity

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

An **Entity** is a distinguishable program subject represented by PostCode, such as a module, symbol, function, or test. What constitutes an entity, and what can be established about it, depends on the applicable language or analysis. An entity is distinct from the claims made about it and the evidence for those claims.

Addressability alone does not make something an entity. Claims, evidence, evaluation outcomes, and projections can also be addressable. An entity's identity, its implementation name, and a displayed label or navigation handle are different concepts. Continuity of a human's attention to a subject is also distinct from semantic continuity of that subject across program states.

### Subject

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

A **subject** is what a lens investigates or a claim concerns. This is a role, not another entity kind. Possible subjects are open-ended; examples include an entity, a collection of entities, a relationship, an identified qualified change, or an investigram. [[Investigrams as subjects](decisions/investigrams-and-progressive-investigation.md#separate-program-referents-from-interpretive-focus)]

“What changed in this module between A and B?” investigates the module across separately identified captured states A and B. “Why was this dependency removed?” can investigate an identified, qualified change, with its relevant states and evidence still explicit. Subject designation does not replace program-input designation or captured-state attribution. This distinction permits further investigation of a change without introducing a new entity kind. [[Subjects and states](decisions/coordinated-views-and-qualified-results.md#keep-subject-open-ended-and-state-designation-explicit)]

A configured project can provide the subject for a module inventory without denoting an executable entry point or the human's current workspace.

### Claim

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

A **Claim** is the information asserted by an analysis result. Its content is distinct from the Claim context that qualifies it and the evaluation outcome describing the attempt to produce it. Information about an entity and an assertion of a relationship are examples of claim content.

Claim does not mean proven fact. PostCode's qualified information distinguishes mechanically derived facts, recorded assertions, scoped observations, and interpretations. Establishing that documentation records a statement is different from establishing that the statement is true; establishing its association with a subject is another claim. This vocabulary does not require these distinctions to form one exhaustive record taxonomy.

### Property

*[decision: [Subject facets](decisions/facets-for-subjects.md#apply-facets-to-subjects-including-investigrams)]*

A **Property** is a characteristic of a subject about which information can be requested or asserted. A claim supplies information about such a characteristic in a particular context; naming the property alone does not establish its value or whether it holds. For example, rejection of duplicate identifiers may be investigated as a behavioral property, while test evidence and interpretation support different claims about it.

Property is descriptive vocabulary here. It does not imply a source-language field, an accessor, a separately addressable record, or a universal property schema.

### Relationship

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

A **Relationship** is a connection such as containment, dependency, a call, or an association between documentation and its subject. A **relationship claim** asserts such a connection and has Claim context of its own. For example, an exported symbol is an entity, while a module's export of that symbol is a relationship claim.

Participants are not necessarily all entities: a documentation association can connect an addressable recorded assertion to its subject. A relationship's meaning is distinct from its depiction as a graph edge or tree link. References between records do not, merely by being references, constitute asserted program relationships.

### Facet

*[decision: [Subject facets](decisions/facets-for-subjects.md#apply-facets-to-subjects-including-investigrams)]*

A **Facet** is a property used as a compact classification dimension for describing, filtering, grouping, or comparing subjects, including entities and investigrams. A claim supplies its value, and Claim context supplies its qualification. Different facets may overlap and need not share one representation or value type. For example, a module may be both external and declaration-only.

Facet names a role played by a property, not a separate record category or a special epistemological status. It does not imply a universal facet schema.

A conceptual facet describes the subject in terms useful to the investigation. A source facet describes its source-level representation or implementation mapping. Language-specific knowledge can establish a conceptual facet; language-specific does not by itself mean source-level. Facet names do not determine the strength of the supporting claim.

## Evidence and qualification

### Evidence

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evidence** is information or material used to support or assess a claim. Sources include program text and structure, recorded documentation and history, tests, and runtime observations. Evidence can also bear against an explanation. Its relevance and what it establishes depend on the claim and the method used to assess it.

Evidence is distinct from the conclusion drawn from it. A source reference identifies supporting material; it is not itself a guarantee that the material establishes the claim. Source evidence includes implementation mappings and locations, which are different from conceptual entity names or labels.

### Claim context

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Claim context** is the qualification of a claim: its evidence or source references, provenance and method, scope, epistemological status or guarantee, and limitations. Context can apply to a result set, including a projection, with narrower context for particular claims or subjects.

**Provenance and method** describe where information came from and how it was obtained. **Scope** describes the program state, population, execution, or other circumstances to which the claim applies. **Epistemological status or guarantee** describes what can safely be concluded. **Limitations** describe relevant bounds on that conclusion. These are related aspects of qualification, not interchangeable measures of confidence.

Where a claim or result concerns multiple program states, its context preserves which captured states support which information, their meaningful order or roles, and capture or observation limitations. Presenting results together does not establish that they describe a synchronized snapshot. [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

An observation about the investigated program concerns a particular observed execution or circumstance. An observation of PostCode use records an interaction or resulting view. The latter is evidence of that experience, not automatically a current claim about the investigated program.

## Evaluation and analysis context

### Program inputs, bindings, captured states and Projection requests

*[decision: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states)]*

A **program input** is a designated source of program information, such as a repository revision, working tree, index, execution or observation stream. Its **binding policy** determines which state is used when a request is performed. For revision-oriented inputs, following resolves a changing input again and pinned continues to use the same captured program state.

A **captured program state** is the program information captured from a designated input as the basis for a result, with attributable scope, capture timing and limitations. It need not be an exhaustive or atomic snapshot. An input designation or Session identifier alone is not that captured basis.

A **Projection request** designates program inputs and applicable bindings, a subject, a Lens and Lens parameter values. Execution resolves the inputs to captured states; the resulting [Projection](#projection) identifies the basis actually used. Repeating the request is distinct from presenting an exact retained Projection. These distinctions prescribe neither a storage schema nor a planner. A Session supplies analysis and reference context, not a following or pinned input binding.

### Evaluation

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evaluation** is PostCode's attempt to materialize requested information through applicable analyses. The information requirements arise from lenses and any standard expansions requested by presentations. Execution constraints describe the conditions under which the attempt is made, rather than the question the lens asks.

Applicable analyses include interpretation, which produces investigrams and their supporting context. [[Interpretation and evaluation](decisions/investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access)]

An **evaluation outcome** describes what occurred in that attempt: applicability and availability, execution state, result materialization, relevant cost, and reasons for failure or stopping. **Materialization** is how much of the requested information has been produced. These dimensions are distinct from the epistemological status of any produced claim.

An outcome can exist without a produced claim or entity, and an incomplete attempt can have usable qualified results. An established empty result is therefore different from the absence of a result. Evaluation outcome and Claim context describe different things even when an outcome helps explain a projection's coverage or limitations.

### Investigator

*[decision: [Investigator execution and evidence access](decisions/investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access)]*

An **Investigator** is an AI agent that investigates a subject through a dialogue with PostCode, using supplied context and requesting additional evidence as needed, and submits an interpretation for validation.

### Session

*[decision: [Transient analysis sessions](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]*

A **Session** is a continuing context for investigation, retaining subject-reference bindings, captured evidence, analysis results, evaluation outcomes, and projections. Its accumulated information can grow as requests require additional analysis or inputs. A session is not an immutable description of a fixed, completely observed input set, a workspace of managed views, or a following binding for changing program inputs. [[Input bindings and Session context](decisions/coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states)]

Within a session, a reference once bound to an entity cannot be rebound. Evidence and published results retain their content, supporting context, and qualifications when later work adds information. Session membership alone does not establish a claim's evidence, completeness, or guarantee.

References bound to investigrams likewise retain their original targets throughout the session, including after correction. [[Investigram references](decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)]

The initial session opens one configured project and assumes its relevant inputs remain unchanged. Detection of a relevant change invalidates the session for further investigation; detection is best-effort and capture remains non-atomic. This does not establish earlier contents of an input first observed later.

A transient session ends with its process. References have meaning within the active session. Observations carry a session identifier to correlate commands within the session; this identifier does not establish the evidential basis or consistency of program claims. Persistence and any future validity policy for reopening a session are separate decisions.

## Investigation and representation

### Lens

*[decision: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Lens** describes the aspect of a subject being investigated: the question being asked. Lens parameters refine the information requested, such as direct versus transitive callers. A Lens may use multiple analyses, evidence sources, reusable operation outcomes or qualified Projections to produce its answer. Its method preserves the provenance, qualifications and limitations of those contributions. “Composite Lens” is descriptive language for a method, not a separate architectural category or a requirement to use other Lenses for every analysis contribution.

A Lens is distinct from the operations supplying its information and from the Presentation coordinating its result with other results. Combining several Projections in a View need not produce another Lens answer. A summary Lens produces a qualified account; a summary View may instead coordinate separately qualified answers. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

### Projection

*[decision: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Projection** is the qualified information produced by applying a Lens to one or more captured program states and a subject, with particular Lens parameter values. It includes its content and the qualifications needed to understand what that content establishes. The subject may be a collection. Requests designate program inputs with applicable binding policies; execution resolves those inputs to the captured states identified by the result. State associations with claims and evidence, and meaningful ordering or roles among states, are part of interpreting the result.

A Projection is a program-domain object, addressable within its Session, identifying its subject, Lens, Lens parameters and session context, with references to selected claims, their captured supporting basis and method context, and relevant Evaluation outcomes. Session membership and a branch designation do not themselves establish that basis. A Projection is distinct from an evaluation attempt and from a rendering of its result.

A produced Projection retains the information selected for that result. Later accumulation or input changes do not mutate its captured basis, selected content or qualification. For revision-oriented inputs, a following binding resolves a changing input again on subsequent requests; a pinned binding continues to use the same captured program state. A result from newly captured input identifies that new basis without changing earlier results. Pinning the input does not mean redisplaying an exact retained Projection. Reusing or rendering a retained Projection need not establish a different answer. For mechanical analyses, equivalent inputs, methods, requirements and completed evaluation preserve deterministic semantic content. Later evaluation may add information missing from incomplete work without changing the earlier Projection or outcome. Presentation choices describe how supplied information is shown and do not redefine the Lens question. [[Immutable information](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)] [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

A fresh request for investigation results can select retained investigrams and explicit replacements into a new Projection while preserving earlier Projections. The retained interpretations and correction/association selections supporting an answer are distinct from its captured program-state basis: either can affect the answer, but interpretation history is not thereby a captured program state and does not acquire following or pinned policies. Presenting an exact retained Projection preserves both its basis and its selected answer. [[Retained interpretation selection](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)] [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

### Investigram

*[decision: [Investigrams and progressive investigation](decisions/investigrams-and-progressive-investigation.md#represent-retained-interpretation-as-investigrams)]*

An **Investigram** is an immutable, addressable artifact of program investigation containing a qualified interpretation in prose, with referent information, evidence context, and provenance. Its provenance identifies the operation and selected subject that produced it. It may contain multiple related claims.

Referent information describes what the interpretation concerns in its program context and may include references to specific subjects. A referent may span entities or identify captured source. Investigrams can be associated with the subjects they describe for subsequent inspection and investigation. [[Subject associations](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)]

An investigram and its subordinate investigrams form a fixed composition tree, which may have multiple levels. A subsequent investigation produces a separate root whose provenance identifies the investigram selected as its subject. Composition describes the parts of one result; investigation provenance connects separate results through their subjects. Neither describes the program's structure by itself. [[Composition and investigation provenance](decisions/investigrams-and-progressive-investigation.md#distinguish-fixed-composition-from-investigation-provenance)]

An investigram may carry accompanying corrections identifying earlier targets, replacement investigrams, reasons, and evidence context, as well as unresolved inconsistencies. Each replacement is constructed through its correction with a composition tree disjoint from the reporting tree. Replacements may themselves carry corrections; correction targets predate acceptance of the new result. [[Corrections](decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)]

An investigram's citation index records prior investigrams supplied to the investigator during its generating evaluation, without asserting reliance or endorsement. "Needs reconsideration" is a session-derived property indicating corrected context reached through those citations; the investigram and its index remain immutable. [[Citation exposure and reconsideration](decisions/investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status)]

### Presentation and View

*[decision: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Presentation** describes how one or more Projections are rendered, interacted with or exposed through a PostCode interface. Presentation parameters describe choices such as layout, sorting, grouping, filtering and disclosure of detail. A Presentation can be graphical, human-readable text or structured machine-readable data.

A **View** is an instantiated Presentation of a nonempty collection of Projections. Each Projection retains its identity, subject, Lens, parameters, program-state basis, content and qualification. Different Presentations or parameter values can give different Views over the same Projection or collection. Presentation context supplies rendering circumstances, such as available space or the surrounding investigation; it does not change the supplied answers.

One coordinating Presentation can relate several Projections through shared alignment, axes, anchoring or linked selection. Several independent Views placed together remain several Views; a common container or visual proximity alone does not make them one. Presentation relationships do not establish new relationships in the investigated program. Alignment requires established correspondence or an exact identity guarantee supplied by the inputs; deriving further correspondence or a new program claim requires core analysis and a qualified Projection. [[Interface boundary](decisions/coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims)]

Adding or removing an underlying Projection changes View composition, rather than merely rendering context. Such changes must be visible and recorded. Replacing displayed information with a result based on newly captured state must likewise expose and record the change of basis. These distinctions preserve investigation lineage and define meaning rather than requiring independently stored stages, a managed-View lifecycle or a universal View identity formula.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualifications. If an interaction instead refreshes the answer, its refresh behavior must be apparent and consequential changes in the answer, selection or qualifications disclosed. Disclosed reselection is distinct from the continuity of presenting the exact retained result with different presentation inputs. This does not require a warning for every identifier change or a comparison notice for every independently requested fresh investigation. [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

When the human has not expressed a more specific information need, PostCode may suggest a summary View as an initial View. Summary can also support recursive navigation; it is not a required default. A summary View may coordinate existing qualified results, show a synthesized summary Projection, or combine both. It does not require a summary Lens. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

### Expansion

*[decision: [Subject-kind standard expansion](decisions/subject-kind-standard-expansion-decision.md#define-standard-expansions-for-kinds-of-subject)]*

An **Expansion** exposes additional detail within a presentation. A **standard expansion** is related information defined for a kind of subject that a presentation can include as inline detail without applying another lens. Effective exported-symbol relationships and associated in-source documentation assertions are initial module-entity examples. Module composition and a dependency relationship's organization context are examples added by the module-dependency slice.

Standard expansions concern the subject kind's presentation semantics, independently of the Lens that selected the subject. A source-detail expansion discloses supporting implementation evidence. Exposing another Lens's answer may add its Projection to a coordinating Presentation or embed another View. Requesting that answer goes through Evaluation and core construction; presenting an already supplied result does not require reevaluation. Inline placement alone does not make an additional Lens question a standard expansion. Dependency children and dependency parents, for example, remain separately meaningful Lens questions rather than standard module expansions. [[Coordinated expansion](decisions/coordinated-views-and-qualified-results.md#keep-evaluation-and-qualified-construction-independent-of-presentation)]

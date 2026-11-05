# Proposed revisions to docs/core-concepts.md

Replace the complete Entity definition.

### Entity

*[decision: [Architectural subjects](decisions/specialized-architectural-investigation.md#architectural-subjects)]*

An **Entity** is a distinguishable architectural subject represented by PostCode. Implemented examples include a module, symbol, function or test; what can be established about them depends on the applicable language or analysis. An entity can also be introduced by a hypothetical or intended account, inheriting the identity and provenance supplied by that account. Correspondence with other accounts remains qualified rather than inferred from matching names. An entity is distinct from the claims made about it and the evidence for those claims.

Addressability alone does not make something an entity. Claims, evidence, evaluation outcomes, and projections can also be addressable. An entity's identity, its implementation name, and a displayed label or navigation handle are different concepts. Continuity of a human's attention to a subject is also distinct from semantic continuity of that subject across program states.

---

Replace the complete Subject definition (including successor provenance).

### Subject

*[decision: [Architectural subjects](decisions/specialized-architectural-investigation.md#architectural-subjects)]*

A **subject** is what a lens investigates or a claim concerns. This is a role, not another entity kind. Possible subjects are open-ended; examples include an entity, a collection of entities, a relationship, an identified qualified change, or an investigram. [[Investigrams as subjects](decisions/investigrams-and-progressive-investigation.md#separate-program-referents-from-interpretive-focus)]

“What changed in this module between A and B?” investigates the module across separately identified captured states A and B. “Why was this dependency removed?” can investigate an identified, qualified change, with its relevant states and evidence still explicit. Subject designation does not replace program-input designation or captured-state attribution. This distinction permits further investigation of a change without introducing a new entity kind. [[Subjects and states](decisions/coordinated-views-and-qualified-results.md#keep-subject-open-ended-and-state-designation-explicit)]

A configured project can provide the subject for a module inventory without denoting an executable entry point or the human's current workspace.

Subjects may concern implemented, hypothetical or intended architecture. Subject designation does not itself identify the captured basis or establish correspondence across accounts. Current selectable subjects remain capability-specific.

---

Replace the complete Claim definition (including successor provenance).

### Claim

*[decision: [Architectural subjects](decisions/specialized-architectural-investigation.md#architectural-subjects)]*

A **Claim** is the information asserted by an analysis result. Its content is distinct from the Claim context that qualifies it and the evaluation outcome describing the attempt to produce it. Information about an entity and an assertion of a relationship are examples of claim content.

Claim does not mean proven fact. PostCode's qualified information distinguishes mechanically derived facts, recorded assertions, scoped observations, and interpretations. Establishing that documentation records a statement is different from establishing that the statement is true; establishing its association with a subject is another claim. This vocabulary does not require these distinctions to form one exhaustive record taxonomy.

---

Replace the complete Relationship definition (including successor provenance).

### Relationship

*[decision: [Architectural subjects](decisions/specialized-architectural-investigation.md#architectural-subjects)]*

A **Relationship** is a connection such as containment, dependency, a call, or an association between documentation and its subject. A **relationship claim** asserts such a connection and has Claim context of its own. For example, an exported symbol is an entity, while a module's export of that symbol is a relationship claim.

Participants are not necessarily all entities: a documentation association can connect an addressable recorded assertion to its subject. A relationship's meaning is distinct from its depiction as a graph edge or tree link. References between records do not, merely by being references, constitute asserted architectural relationships.

---

Add after Claim context.

<a id="architectural-modality"></a>
### Architectural modality

*[decision: [Architectural modalities](decisions/specialized-architectural-investigation.md#architectural-modalities)]*

**Architectural modality** distinguishes what an account concerns: implemented architecture describes actual software, supported and qualified by implementation evidence; hypothetical architecture describes alternatives without implying acceptance, feasibility or realization; intended architecture describes accepted requirements or design decisions. Modality is distinct from provenance, method and epistemological status. An implemented account can be interpretive, and exact recording of a proposal establishes neither its acceptance nor its feasibility. Observed behavior is execution-scoped evidence, not a further modality.

These meanings require neither separate data models nor modality fields. Lens applicability depends on method. A transition from proposal to intention preserves its provenance and history; sharing an account does not establish participant agreement or confer authority on PostCode's interpretation.

---

Replace the complete Program inputs, bindings, captured states and Projection requests definition; preserve its former heading target with the explicit anchor below.

<a id="program-inputs-bindings-captured-states-and-projection-requests"></a>
<a id="captured-basis"></a>
### Captured bases, program inputs and Projection requests

*[decision: [Inputs and captured bases](decisions/specialized-architectural-investigation.md#inputs-and-captured-bases)]*

A **captured basis** identifies the specific input material used for a Lens application. It may contain one or more program states, observations, participant-supplied architectural material or earlier Projections. Preserve the contributions' provenance, scope and limitations, their associations with the information they support, and meaningful roles or order. Including material does not establish its truth or agreement with other material. Earlier PostCode output remains a qualified artifact, not independent repository evidence.

A **program input** is a designated source of program information, such as a repository revision, working tree, index, execution or observation stream. Its **binding policy** determines which state is used when a request is performed. For revision-oriented inputs, following resolves a changing input again and pinned continues to use the same captured program state.

A **captured program state** is program information captured from a designated input, with attributable scope, capture timing and limitations. It is one possible basis contribution and need not be exhaustive or atomic. An input designation or Session identifier alone is not a captured basis.

A **Projection request** designates applicable inputs, a subject, a Lens and Lens parameter values. Execution identifies the material actually used as the result's captured basis. Binding policies apply where the input supports them; participant material and earlier Projections do not acquire following or pinned policies by analogy. Repeating a request is distinct from presenting an exact retained Projection. These distinctions prescribe neither a storage schema, generalized input-capture mechanism nor planner. A Session supplies analysis and reference context, not an input binding.

The current implementation uses captured program information and selected retained interpretation within transient unchanged-input Sessions. This broader definition does not require changing its request or capture types before adding a capability that needs other input material.

---

Replace the complete Projection definition; its retained-selection and identity paragraphs remain intact.

### Projection

*[decision: [Results over captured bases](decisions/specialized-architectural-investigation.md#results-over-captured-bases)]*

A **Projection** is the qualified information produced by applying a Lens to a subject and a captured basis, with particular Lens parameter values. It includes its content and the qualifications needed to understand what that content establishes. The subject may be a collection. Requests designate applicable inputs; the result identifies the specific material actually used. Associations of basis contributions with claims and evidence, and meaningful ordering or roles among contributions, are part of interpreting the result.

A Projection is an architectural-domain object, addressable within its Session, identifying its subject, Lens, Lens parameters and session context, with references to selected claims, their captured supporting basis and method context, and relevant Evaluation outcomes. Session membership and a branch designation do not themselves establish that basis. A Projection is distinct from an evaluation attempt and from a rendering of its result.

A produced Projection retains the information selected for that result. Later accumulation or input changes do not mutate its captured basis, selected content or qualification. For revision-oriented inputs, a following binding resolves a changing input again on subsequent requests; a pinned binding continues to use the same captured program state. A result from newly captured input identifies that new basis without changing earlier results. Pinning the input does not mean redisplaying an exact retained Projection. Reusing or rendering a retained Projection need not establish a different answer. For mechanical analyses, equivalent inputs, methods, requirements and completed evaluation preserve deterministic semantic content. Later evaluation may add information missing from incomplete work without changing the earlier Projection or outcome. Presentation choices describe how supplied information is shown and do not redefine the Lens question. [[Immutable information](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)] [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

A fresh request for investigation results can select retained investigrams and explicit replacements into a new Projection while preserving earlier Projections. The retained interpretations and correction/association selections supporting an answer are distinct from its captured program-state basis: either can affect the answer, but interpretation history is not thereby a captured program state and does not acquire following or pinned policies. Presenting an exact retained Projection preserves both its basis and its selected answer. [[Retained interpretation selection](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)] [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

Otherwise identical qualified answers have repeatable logical identity within the supported Session, independently of subject designation or lookup route. Equality uses the decision’s [canonical effective-input set](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity), including Session context, method version and meaningful subject order/roles. Invocation-specific resolution information has a separate owner; answer-relevant qualification remains in the Projection. This preserves full immutable payload consistency without requiring physical memoization or cross-session identity. [[Qualified answer identity](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity)]

---

Replace the complete Investigram definition; preserve the interpretation-content anchor and existing composition, correction and citation obligations.

### Investigram

*[decision: [Architectural interpretation](decisions/specialized-architectural-investigation.md#architectural-interpretation)]*

An **Investigram** is an immutable, addressable artifact of architectural investigation containing a qualified interpretation. It includes the following information:

- <a id="interpretation-content"></a>**Interpretation content** — the substantive content of the interpretation. It may contain multiple related [claims](#claim), expressed in prose, structured content, or a combination, including prose within a structure.
- **Referent information** — what the interpretation concerns in its architectural context. It may include references to specific [subjects](#subject); a referent may span entities or identify captured source.
- **Evidence context** — the supporting [evidence](#evidence) and its relationship to the interpretation's claims.
- **Provenance** — the operation and selected subject that produced the investigram, together with its originating architectural context, captured basis and supporting method.
- **Qualifications** — the claims' [Claim context](#claim-context), including evidence attribution, provenance and method, scope, epistemological status or guarantee, and limitations. Qualifications remain attributable to the claims or portions they qualify; they need not apply uniformly to all content.

Investigrams can be associated with the subjects they describe for subsequent inspection and investigation. [[Subject associations](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)]

An investigram and its subordinate investigrams form a fixed composition tree, which may have multiple levels. A subsequent investigation produces a separate root whose provenance identifies the investigram selected as its subject. Composition describes the parts of one result; investigation provenance connects separate results through their subjects. Neither describes the program's structure by itself. [[Composition and investigation provenance](decisions/investigrams-and-progressive-investigation.md#distinguish-fixed-composition-from-investigation-provenance)]

An investigram may carry accompanying corrections identifying earlier targets, replacement investigrams, reasons, and evidence context, as well as unresolved inconsistencies. Each replacement is constructed through its correction with a composition tree disjoint from the reporting tree. Replacements may themselves carry corrections; correction targets predate acceptance of the new result. [[Corrections](decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)]

An investigram's citation index records prior investigrams supplied to the investigator during its generating evaluation, without asserting reliance or endorsement. "Needs reconsideration" is a session-derived property indicating corrected context reached through those citations; the investigram and its index remain immutable. [[Citation exposure and reconsideration](decisions/investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status)]

An Investigram is an interpretation result, not every architectural account or participant-supplied document. Current prose Investigrams originate in module investigation; the general definition permits other architectural subjects without requiring a schema change or treating retained-result validation as design acceptance.

---

Replace the complete Presentation and View definition; retain its preceding presentation-and-view anchor.

### Presentation and View

*[decision: [Results over captured bases](decisions/specialized-architectural-investigation.md#results-over-captured-bases)]*

A **Presentation** describes how one or more Projections are rendered, interacted with or exposed through a PostCode interface. Presentation parameters describe choices such as layout, sorting, grouping, filtering and disclosure of detail. A Presentation can be graphical, human-readable text or structured machine-readable data.

A **View** is an instantiated Presentation of a nonempty collection of Projections. Each Projection retains its identity, subject, Lens, parameters, captured basis, content and qualification. Different Presentations or parameter values can give different Views over the same Projection or collection. Presentation context supplies rendering circumstances, such as available space or the surrounding investigation; it does not change the supplied answers.

One coordinating Presentation can relate several Projections through shared alignment, axes, anchoring or linked selection. Several independent Views placed together remain several Views; a common container or visual proximity alone does not make them one. Presentation relationships do not establish new architectural relationships. Alignment requires established correspondence or an exact identity guarantee supplied by the inputs; deriving further correspondence or a new architectural claim requires core analysis and a qualified Projection. [[Architectural scope](decisions/specialized-architectural-investigation.md#results-over-captured-bases)] [[Interface boundary](decisions/coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims)]

Adding or removing an underlying Projection changes View composition, rather than merely rendering context. Such changes must be visible and recorded. Replacing displayed information with a result based on newly captured material must likewise expose and record the change of basis. These distinctions preserve investigation lineage and define meaning rather than requiring independently stored stages, a managed-View lifecycle or a universal View identity formula.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualifications. If an interaction instead refreshes the answer, its refresh behavior must be apparent and consequential changes in the answer, selection or qualifications disclosed. Disclosed reselection is distinct from the continuity of presenting the exact retained result with different presentation inputs. This does not require a warning for every identifier change or a comparison notice for every independently requested fresh investigation. [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

When the human has not expressed a more specific information need, PostCode may suggest a summary View as an initial View. Summary can also support recursive navigation; it is not a required default. A summary View may coordinate existing qualified results, show a synthesized summary Projection, or combine both. It does not require a summary Lens. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

Result/Presentation compatibility is an explicit contract between the qualified content a Lens implementation exposes and the inputs, options, preconditions and standard expansions a Presentation supports. Compatibility includes semantic meaning and qualified partial/unavailable cases, not only data shape or Lens identity. Planning uses it before Evaluation and validates the materialized result before arrangement. A missing compatible Presentation or failed materialization-dependent precondition without a permitted fallback returns a resolution result with a presentation-failure reason and references to any retained answers; it does not make the Lens inapplicable. Further required information returns through request coordination. Usage reports and resolution results are not Views merely because they are rendered. [[Compatibility](decisions/lens-application-and-request-outcomes.md#match-qualified-results-to-presentations-explicitly)] [[Reporting](decisions/lens-application-and-request-outcomes.md#report-actual-requests-and-outcomes)]

---

Replace the complete Investigation context definition; retain its preceding investigation-context anchor.

### Investigation context

*[decision: [Application specification boundaries](decisions/application-specification-boundaries.md#start-with-a-workspace-as-a-collection-and-arrangement-of-views)]*

An **investigation context** comprises the Views accumulated while following subjects, relationships, and questions, together with their captured bases and relevant lineage. It identifies what each View shows and how it relates to the investigation. It can span Workspace arrangements and does not imply a separately stored context object, common captured state, or persistent Session. The [application specification](app-specification.md#workspaces-and-navigation) states the retained-lineage contract.

This is local application terminology for Views, bases and lineage, not the definition of all [retained architectural understanding](../foundation/product-design.md#retained-architectural-understanding-and-continuity). It is distinct from an observation archive and the context supplied during an Investigator execution. Those responsibilities may refer to overlapping information without requiring one shared object. [[Retained understanding and context](decisions/specialized-architectural-investigation.md#retained-understanding-and-context)]

---

Replace the complete Lens definition only to update its term-level successor provenance; its substantive text is unchanged.

### Lens

*[decision: [Results over captured bases](decisions/specialized-architectural-investigation.md#results-over-captured-bases)]*

A **Lens** describes the aspect of a subject being investigated: the question being asked. Lens parameters refine the information requested, such as direct versus transitive callers. A Lens may use multiple analyses, evidence sources, reusable operation outcomes or qualified Projections to produce its answer. Its method preserves the provenance, qualifications and limitations of those contributions. “Composite Lens” is descriptive language for a method, not a separate architectural category or a requirement to use other Lenses for every analysis contribution.

A Lens is distinct from the operations supplying its information and from the Presentation coordinating its result with other results. Combining several Projections in a View need not produce another Lens answer. A summary Lens produces a qualified account; a summary View may instead coordinate separately qualified answers. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

A Lens definition makes its question, applicability/cardinality, parameter meaning, requirements and prospective result contract explicit. The question is a conceptual information need rather than necessarily a user-supplied prose question. Subject-specific implementations can realize one Lens through different work and result contracts. The selected implementation remains attributable through its versioned method and provenance, separately from the Lens identity. Shared authoring declarations may define a Lens and its default operation conveniently; requirements and reusable operation identity remain distinct. [[Explicit Lens meaning](decisions/lens-application-and-request-outcomes.md#represent-lens-meaning-independently-of-lookup-and-implementation)]

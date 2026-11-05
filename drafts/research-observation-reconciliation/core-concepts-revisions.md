# Proposed revisions to docs/core-concepts.md

Replace the complete “Session” definition; retain its existing explicit anchors.

### Session

*[decision: [Transient analysis sessions](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]*

A **Session** is a continuing context for investigation, retaining subject-reference bindings, captured evidence, analysis results, evaluation outcomes, and projections. Its accumulated information can grow as requests require additional analysis or inputs. A session is not an immutable description of a fixed, completely observed input set, a workspace of managed views, or a following binding for changing program inputs. [[Input bindings and Session context](decisions/coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states)]

Within a session, a reference once bound to an entity cannot be rebound. Evidence and published results retain their content, supporting context, and qualifications when later work adds information. Session membership alone does not establish a claim's evidence, completeness, or guarantee.

References bound to investigrams likewise retain their original targets throughout the session, including after correction. [[Investigram references](decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)]

The initial session opens one configured project and assumes its relevant inputs remain unchanged. Detection of a relevant change invalidates the session for further investigation; detection is best-effort and capture remains non-atomic. This does not establish earlier contents of an input first observed later.

A transient session ends with its process. References have meaning within the active session. Research records may use a Session identifier to correlate captured interactions; it does not establish the evidential basis or consistency of architectural claims. Research recording is distinct from the provenance and qualification required by retained results and may be absent in ordinary non-research use. Persistence and any future validity policy for reopening a session are separate decisions. [[Research capture](decisions/research-question-driven-observation.md#research-capture)]

Immutability is a property of retained information, distinct from retention duration, disposal, persistence, and availability after restart. It does not imply immutability of focus, layout, or derived current status. See the [retained-information constraints](architectural-constraints.md#session-references-and-retained-information) for the obligations. [[Immutability and retention](decisions/application-specification-boundaries.md#distinguish-immutable-information-from-retention-policy)]

Replace the complete “Lens” definition; retain its existing explicit anchors.

### Lens

*[decision: [Results over captured bases](decisions/research-question-driven-observation.md#results-over-captured-bases)]*

A **Lens** describes the aspect of a subject being investigated: the question being asked. Lens parameters refine the information requested, such as direct versus transitive callers. A Lens may use multiple analyses, evidence sources, reusable operation outcomes or qualified Projections to produce its answer. Its method preserves the provenance, qualifications and limitations of those contributions. “Composite Lens” is descriptive language for a method, not a separate architectural category or a requirement to use other Lenses for every analysis contribution.

A Lens is distinct from the operations supplying its information and from the Presentation coordinating its result with other results. Combining several Projections in a View need not produce another Lens answer. A summary Lens produces a qualified account; a summary View may instead coordinate separately qualified answers. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

A Lens definition makes its question, applicability/cardinality, parameter meaning, requirements and prospective result contract explicit. The question is a conceptual information need rather than necessarily a user-supplied prose question. Subject-specific implementations can realize one Lens through different work and result contracts. The selected implementation remains attributable through its versioned method and provenance, separately from the Lens identity. Shared authoring declarations may define a Lens and its default operation conveniently; requirements and reusable operation identity remain distinct. [[Explicit Lens meaning](decisions/lens-application-and-request-outcomes.md#represent-lens-meaning-independently-of-lookup-and-implementation)]

Replace the complete “Projection” definition; retain its existing explicit anchors.

### Projection

*[decision: [Results over captured bases](decisions/research-question-driven-observation.md#results-over-captured-bases)]*

A **Projection** is the qualified information produced by applying a Lens to a subject and a captured basis, with particular Lens parameter values. It includes its content and the qualifications needed to understand what that content establishes. The subject may be a collection. Requests designate applicable inputs; the result identifies the specific material actually used. Associations of basis contributions with claims and evidence, and meaningful ordering or roles among contributions, are part of interpreting the result.

A Projection is an architectural-domain object, addressable within its Session, identifying its subject, Lens, Lens parameters and session context, with references to selected claims, their captured supporting basis and method context, and relevant Evaluation outcomes. Session membership and a branch designation do not themselves establish that basis. A Projection is distinct from an evaluation attempt and from a rendering of its result.

A produced Projection retains the information selected for that result. Later accumulation or input changes do not mutate its captured basis, selected content or qualification. For revision-oriented inputs, a following binding resolves a changing input again on subsequent requests; a pinned binding continues to use the same captured program state. A result from newly captured input identifies that new basis without changing earlier results. Pinning the input does not mean redisplaying an exact retained Projection. Reusing or rendering a retained Projection need not establish a different answer. For mechanical analyses, equivalent inputs, methods, requirements and completed evaluation preserve deterministic semantic content. Later evaluation may add information missing from incomplete work without changing the earlier Projection or outcome. Presentation choices describe how supplied information is shown and do not redefine the Lens question. [[Immutable information](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)] [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

A fresh request for investigation results can select retained investigrams and explicit replacements into a new Projection while preserving earlier Projections. The selected retained interpretations and correction/association snapshots contribute to the answer’s broader captured basis, while remaining distinct from its captured program-state support and from the input deliveries to their generating investigations. Interpretation history is not thereby a captured program state and does not acquire following or pinned policies. Presenting an exact retained Projection preserves these contributions and its selected answer. [[Retained contributions](decisions/specialized-architectural-investigation.md#inputs-and-captured-bases)] [[Retained interpretation selection](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)] [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

Otherwise identical qualified answers have repeatable logical identity within the supported Session, independently of subject designation or lookup route. Equality uses the decision’s [canonical effective-input set](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity), including Session context, method version and meaningful subject order/roles. Invocation-specific resolution information has a separate owner; answer-relevant qualification remains in the Projection. This preserves full immutable payload consistency without requiring physical memoization or cross-session identity. [[Qualified answer identity](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity)]

Replace the complete “Presentation and View” definition; retain its existing explicit anchors.

### Presentation and View

*[decision: [Results over captured bases](decisions/research-question-driven-observation.md#results-over-captured-bases)]*

A **Presentation** describes how one or more Projections are rendered, interacted with or exposed through a PostCode interface. Presentation parameters describe choices such as layout, sorting, grouping, filtering and disclosure of detail. A Presentation can be graphical, human-readable text or structured machine-readable data.

A **View** is an instantiated Presentation of a nonempty collection of Projections. Each Projection retains its identity, subject, Lens, parameters, captured basis, content and qualification. Different Presentations or parameter values can give different Views over the same Projection or collection. Presentation context supplies rendering circumstances, such as available space or the surrounding investigation; it does not change the supplied answers.

One coordinating Presentation can relate several Projections through shared alignment, axes, anchoring or linked selection. Several independent Views placed together remain several Views; a common container or visual proximity alone does not make them one. Presentation relationships do not establish new architectural relationships. Alignment requires established correspondence or an exact identity guarantee supplied by the inputs; deriving further correspondence or a new architectural claim requires core analysis and a qualified Projection. [[Architectural scope](decisions/research-question-driven-observation.md#results-over-captured-bases)] [[Interface boundary](decisions/coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims)]

Adding or removing an underlying Projection changes View composition, rather than merely rendering context. Such changes must be visible. Replacing displayed information with a result based on newly captured material must likewise expose the change of basis. Preserve the lineage needed by the investigation; research recording of these changes depends on the research question. These distinctions preserve investigation lineage and define meaning rather than requiring independently stored stages, a managed-View lifecycle or a universal View identity formula.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualifications. If an interaction instead refreshes the answer, its refresh behavior must be apparent and consequential changes in the answer, selection or qualifications disclosed. Disclosed reselection is distinct from the continuity of presenting the exact retained result with different presentation inputs. This does not require a warning for every identifier change or a comparison notice for every independently requested fresh investigation. [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

When the human has not expressed a more specific information need, PostCode may suggest a summary View as an initial View. Summary can also support recursive navigation; it is not a required default. A summary View may coordinate existing qualified results, show a synthesized summary Projection, or combine both. It does not require a summary Lens. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

Result/Presentation compatibility is an explicit contract between the qualified content a Lens implementation exposes and the inputs, options, preconditions and standard expansions a Presentation supports. Compatibility includes semantic meaning and qualified partial/unavailable cases, not only data shape or Lens identity. Planning uses it before Evaluation and validates the materialized result before arrangement. A missing compatible Presentation or failed materialization-dependent precondition without a permitted fallback returns a resolution result with a presentation-failure reason and references to any retained answers; it does not make the Lens inapplicable. Further required information returns through request coordination. Usage reports and resolution results are not Views merely because they are rendered. [[Compatibility](decisions/lens-application-and-request-outcomes.md#match-qualified-results-to-presentations-explicitly)] [[Reporting](decisions/lens-application-and-request-outcomes.md#report-actual-requests-and-outcomes)]

Replace the complete “Investigation context” definition; retain its existing explicit anchors.

### Investigation context

*[decision: [Application specification boundaries](decisions/application-specification-boundaries.md#start-with-a-workspace-as-a-collection-and-arrangement-of-views)]*

An **investigation context** comprises the Views accumulated while following subjects, relationships, and questions, together with their captured bases and relevant lineage. It identifies what each View shows and how it relates to the investigation. It can span Workspace arrangements and does not imply a separately stored context object, common captured state, or persistent Session. The [application specification](app-specification.md#workspaces-and-navigation) states the retained-lineage contract.

This is local application terminology for Views, bases and lineage, not the definition of all [retained architectural understanding](../foundation/product-design.md#retained-architectural-understanding-and-continuity). It is distinct from an observation archive and the context supplied during an Investigator execution. Those responsibilities may refer to overlapping information without requiring one shared object. [[Retained understanding and context](decisions/research-question-driven-observation.md#retained-understanding-and-context)]

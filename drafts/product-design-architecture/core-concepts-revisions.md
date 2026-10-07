# Proposed revisions to docs/core-concepts.md

Replace the complete Lens, Projection, and Presentation and View definitions with the units below. Other definitions remain unchanged except the explicit localized additions to Claim context and Expansion that follow.

### Lens

*[decision: [Coordinated Views and qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Lens** describes the aspect of a subject being investigated: the question being asked. Lens parameters refine the information requested, such as direct versus transitive callers. A Lens may use multiple analyses, evidence sources, reusable operation outcomes or qualified Projections to produce its answer. Its method preserves the provenance, qualifications and limitations of those contributions. “Composite Lens” is descriptive language for a method, not a separate architectural category or a requirement to use other Lenses for every analysis contribution.

A Lens is distinct from the operations supplying its information and from the Presentation coordinating its result with other results. Combining several Projections in a View need not produce another Lens answer. A summary Lens produces a qualified account; a summary View may instead coordinate separately qualified answers. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

### Projection

*[decision: [Coordinated Views and qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Projection** is the qualified information produced by applying a Lens to one or more captured program states and a subject, with particular Lens parameter values. It includes its content and the qualifications needed to understand what that content establishes. The subject may be a collection. Requests designate program inputs with applicable binding policies; execution resolves those inputs to the captured states identified by the result. State associations with claims and evidence, and meaningful ordering or roles among states, are part of interpreting the result.

A Projection is a program-domain object, addressable within its Session, identifying its subject, Lens, Lens parameters and session context, with references to selected claims, their captured supporting basis and method context, and relevant Evaluation outcomes. Session membership and a branch designation do not themselves establish that basis. A Projection is distinct from an evaluation attempt and from a rendering of its result.

A produced Projection retains the information selected for that result. Later accumulation or input changes do not mutate its captured basis, selected content or qualification. For revision-oriented inputs, a following binding resolves a changing input again on subsequent requests; a pinned binding continues to use the same captured program state. A result from newly captured input identifies that new basis without changing earlier results. Pinning the input does not mean redisplaying an exact retained Projection. Reusing or rendering a retained Projection need not establish a different answer. For current mechanically derived Views, unchanged inputs and completed evaluation yield the same information on repeat requests. Later evaluation may add information missing from incomplete work without changing the earlier Projection or outcome. Presentation choices describe how supplied information is shown and do not redefine the Lens question. [[Immutable information](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)] [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

Redisplay of an investigation result can select retained investigrams and explicit replacements into a new Projection while preserving earlier Projections. [[Retained interpretation selection](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)]

The current unchanged-input Session supports a single-state implementation subset; this definition does not add multi-state analysis, a live-refresh mechanism or persistent results. [[Adoption scope](decisions/coordinated-views-and-qualified-results.md#adoption-and-conformance)]

### Presentation and View

*[decision: [Coordinated Views and qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Presentation** describes how one or more Projections are rendered, interacted with or exposed through a PostCode interface. Presentation parameters describe choices such as layout, sorting, grouping, filtering and disclosure of detail. A Presentation can be graphical, human-readable text or structured machine-readable data.

A **View** is an instantiated Presentation of a nonempty collection of Projections. Each Projection retains its identity, subject, Lens, parameters, program-state basis, content and qualification. Different Presentations or parameter values can give different Views over the same Projection or collection. Presentation context supplies rendering circumstances, such as available space or the surrounding investigation; it does not change the supplied answers.

One coordinating Presentation can relate several Projections through shared alignment, axes, anchoring or linked selection. Several independent Views placed together remain several Views; a common container or visual proximity alone does not make them one. Presentation relationships do not establish new relationships in the investigated program. Alignment requires established correspondence or an exact identity guarantee supplied by the inputs; deriving further correspondence or a new program claim requires core analysis and a qualified Projection. [[Interface boundary](decisions/coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims)]

Adding or removing an underlying Projection changes View composition, rather than merely rendering context. Such changes must be visible and recorded. Replacing displayed information with a result based on newly captured state must likewise expose and record the change of basis. These distinctions preserve investigation lineage and define meaning rather than requiring independently stored stages, a managed-View lifecycle or a universal View identity formula.

When the human has not expressed a more specific information need, PostCode may suggest a summary View as an initial View. Summary can also support recursive navigation; it is not a required default. A summary View may coordinate existing qualified results, show a synthesized summary Projection, or combine both. It does not require a summary Lens. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

## Addition to Claim context

Append after the paragraph defining provenance, scope, guarantee and limitations:

Where a claim or result concerns multiple program states, its context preserves which captured states support which information, their meaningful order or roles, and capture or observation limitations. Presenting results together does not establish that they describe a synchronized snapshot. [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

## Replacement paragraph in Expansion

Retain the term-level provenance and first paragraph. Replace the second paragraph with:

Standard expansions concern the subject kind's presentation semantics, independently of the Lens that selected the subject. A source-detail expansion discloses supporting implementation evidence. Exposing another Lens's answer may add its Projection to a coordinating Presentation or embed another View. Requesting that answer goes through Evaluation and core construction; presenting an already supplied result does not require reevaluation. Inline placement alone does not make an additional Lens question a standard expansion. Dependency children and dependency parents, for example, remain separately meaningful Lens questions rather than standard module expansions. [[Coordinated expansion](decisions/coordinated-views-and-qualified-results.md#keep-evaluation-and-qualified-construction-independent-of-presentation)]

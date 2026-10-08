# Proposed revisions to docs/core-concepts.md

Replace the complete Lens, Projection, and Presentation and View definitions with the units below. Add the grouped definition at the stated insertion point and apply the localized revisions to Subject, Session, Claim context and Expansion. Other definitions remain unchanged.

## Replacement paragraph and clarification in Subject

Retain the term-level provenance and the configured-project paragraph. Replace the first definition paragraph with these two paragraphs:

A **subject** is what a lens investigates or a claim concerns. This is a role, not another entity kind. Possible subjects are open-ended; examples include an entity, a collection of entities, a relationship, an identified qualified change, or an investigram. [[Investigrams as subjects](decisions/investigrams-and-progressive-investigation.md#separate-program-referents-from-interpretive-focus)]

“What changed in this module between A and B?” investigates the module across separately identified captured states A and B. “Why was this dependency removed?” can investigate an identified, qualified change, with its relevant states and evidence still explicit. Subject designation does not replace program-input designation or captured-state attribution. This distinction permits further investigation of a change without introducing a new entity kind. [[Subjects and states](decisions/coordinated-views-and-qualified-results.md#keep-subject-open-ended-and-state-designation-explicit)]

## Replacement definitions

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

### Presentation and View

*[decision: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Presentation** describes how one or more Projections are rendered, interacted with or exposed through a PostCode interface. Presentation parameters describe choices such as layout, sorting, grouping, filtering and disclosure of detail. A Presentation can be graphical, human-readable text or structured machine-readable data.

A **View** is an instantiated Presentation of a nonempty collection of Projections. Each Projection retains its identity, subject, Lens, parameters, program-state basis, content and qualification. Different Presentations or parameter values can give different Views over the same Projection or collection. Presentation context supplies rendering circumstances, such as available space or the surrounding investigation; it does not change the supplied answers.

One coordinating Presentation can relate several Projections through shared alignment, axes, anchoring or linked selection. Several independent Views placed together remain several Views; a common container or visual proximity alone does not make them one. Presentation relationships do not establish new relationships in the investigated program. Alignment requires established correspondence or an exact identity guarantee supplied by the inputs; deriving further correspondence or a new program claim requires core analysis and a qualified Projection. [[Interface boundary](decisions/coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims)]

Adding or removing an underlying Projection changes View composition, rather than merely rendering context. Such changes must be visible and recorded. Replacing displayed information with a result based on newly captured state must likewise expose and record the change of basis. These distinctions preserve investigation lineage and define meaning rather than requiring independently stored stages, a managed-View lifecycle or a universal View identity formula.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualifications. If an interaction instead refreshes the answer, its refresh behavior must be apparent and consequential changes in the answer, selection or qualifications disclosed. Disclosed reselection is distinct from the continuity of presenting the exact retained result with different presentation inputs. This does not require a warning for every identifier change or a comparison notice for every independently requested fresh investigation. [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

When the human has not expressed a more specific information need, PostCode may suggest a summary View as an initial View. Summary can also support recursive navigation; it is not a required default. A summary View may coordinate existing qualified results, show a synthesized summary Projection, or combine both. It does not require a summary Lens. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

## Addition to Claim context

Append after the paragraph defining provenance, scope, guarantee and limitations:

Where a claim or result concerns multiple program states, its context preserves which captured states support which information, their meaningful order or roles, and capture or observation limitations. Presenting results together does not establish that they describe a synchronized snapshot. [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)]

## Replacement paragraph in Expansion

Retain the term-level provenance and first paragraph. Replace the second paragraph with:

Standard expansions concern the subject kind's presentation semantics, independently of the Lens that selected the subject. A source-detail expansion discloses supporting implementation evidence. Exposing another Lens's answer may add its Projection to a coordinating Presentation or embed another View. Requesting that answer goes through Evaluation and core construction; presenting an already supplied result does not require reevaluation. Inline placement alone does not make an additional Lens question a standard expansion. Dependency children and dependency parents, for example, remain separately meaningful Lens questions rather than standard module expansions. [[Coordinated expansion](decisions/coordinated-views-and-qualified-results.md#keep-evaluation-and-qualified-construction-independent-of-presentation)]


## Addition under Evaluation and analysis context

Insert immediately before “Evaluation”:

### Program inputs, bindings, captured states and Projection requests

*[decision: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states)]*

A **program input** is a designated source of program information, such as a repository revision, working tree, index, execution or observation stream. Its **binding policy** determines which state is used when a request is performed. For revision-oriented inputs, following resolves a changing input again and pinned continues to use the same captured program state.

A **captured program state** is the program information captured from a designated input as the basis for a result, with attributable scope, capture timing and limitations. It need not be an exhaustive or atomic snapshot. An input designation or Session identifier alone is not that captured basis.

A **Projection request** designates program inputs and applicable bindings, a subject, a Lens and Lens parameter values. Execution resolves the inputs to captured states; the resulting [Projection](#projection) identifies the basis actually used. Repeating the request is distinct from presenting an exact retained Projection. These distinctions prescribe neither a storage schema nor a planner. A Session supplies analysis and reference context, not a following or pinned input binding.

## Replacement paragraph in Session

Retain the term-level provenance and all later paragraphs. Replace the first definition paragraph with:

A **Session** is a continuing context for investigation, retaining subject-reference bindings, captured evidence, analysis results, evaluation outcomes, and projections. Its accumulated information can grow as requests require additional analysis or inputs. A session is not an immutable description of a fixed, completely observed input set, a workspace of managed views, or a following binding for changing program inputs. [[Input bindings and Session context](decisions/coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states)]

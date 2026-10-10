# Proposed revisions to docs/core-concepts.md

Each block below is a complete replacement or addition at the identified destination. Unlisted material remains unchanged.

## Replace the opening role paragraph

<!-- BEGIN PROMOTION CONTENT -->
This document states PostCode's governing cross-cutting architectural terminology and the relationships necessary to define it. It says what the terms mean now; accepted [decision records](decisions/) preserve why the concepts were adopted or changed. It conforms to the adopted [product design](../foundation/product-design.md), which establishes research concepts and commitments. The [application specification](app-specification.md) governs intended behavior and high-level application design. Binding cross-cutting rules that implementations must follow are stated separately in [architectural constraints](architectural-constraints.md).
<!-- END PROMOTION CONTENT -->

## Replace “Evaluation”

<!-- BEGIN PROMOTION CONTENT -->
### Evaluation

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evaluation** is PostCode's attempt to materialize requested information through applicable analyses. Information requirements include those arising from lenses and any standard expansions requested by presentations. Execution constraints describe the conditions under which the attempt is made, rather than the question the lens asks.

Requirements can also arise from system-initiated investigation serving an explicit parent request or authorized autonomous work. [[Investigation initiation](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)]

Applicable analyses include interpretation, which produces investigrams and their supporting context. [[Interpretation and evaluation](decisions/investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access)]

An **evaluation outcome** describes what occurred in that attempt: applicability and availability, execution state, result materialization, relevant cost, and reasons for failure or stopping. **Materialization** is how much of the requested information has been produced. These dimensions are distinct from the epistemological status of any produced claim.

An outcome can exist without a produced claim or entity, and an incomplete attempt can have usable qualified results. An established empty result is therefore different from the absence of a result. Evaluation outcome and Claim context describe different things even when an outcome helps explain a projection's coverage or limitations.

### Investigation initiation

*[decision: [Application specification boundaries](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)]*

**System-initiated investigation** is additional investigation PostCode initiates without a separate human or external-agent request for that work. It can be **request-scoped**, serving an explicit parent request, or **autonomous**, with no parent request. The initiating actor is distinct from the actor authorizing the parent. Selecting unspecified elements to answer an expressed information need is request interpretation; the selected answer remains explicitly requested work. Obtaining additional qualified information needed to resolve the request can be system-initiated investigation.

Request-scoped work serves its parent; work outside that purpose or continuing after the parent’s satisfaction or cancellation is autonomous. Resource governance and attribution obligations are in the [architectural constraints](architectural-constraints.md#investigation-initiation-and-request-attribution). These meanings do not prescribe a scheduler or separate visible View.
<!-- END PROMOTION CONTENT -->

## Replace “Session”

<!-- BEGIN PROMOTION CONTENT -->
### Session

*[decision: [Transient analysis sessions](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]*

A **Session** is a continuing context for investigation, retaining subject-reference bindings, captured evidence, analysis results, evaluation outcomes, and projections. Its accumulated information can grow as requests require additional analysis or inputs. A session is not an immutable description of a fixed, completely observed input set, a workspace of managed views, or a following binding for changing program inputs. [[Input bindings and Session context](decisions/coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states)]

Within a session, a reference once bound to an entity cannot be rebound. Evidence and published results retain their content, supporting context, and qualifications when later work adds information. Session membership alone does not establish a claim's evidence, completeness, or guarantee.

References bound to investigrams likewise retain their original targets throughout the session, including after correction. [[Investigram references](decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)]

The initial session opens one configured project and assumes its relevant inputs remain unchanged. Detection of a relevant change invalidates the session for further investigation; detection is best-effort and capture remains non-atomic. This does not establish earlier contents of an input first observed later.

A transient session ends with its process. References have meaning within the active session. Observations carry a session identifier to correlate commands within the session; this identifier does not establish the evidential basis or consistency of program claims. Persistence and any future validity policy for reopening a session are separate decisions.

Immutability is a property of retained information, distinct from retention duration, disposal, persistence, and availability after restart. It does not imply immutability of focus, layout, or derived current status. See the [retained-information constraints](architectural-constraints.md#session-references-and-retained-information) for the obligations. [[Immutability and retention](decisions/application-specification-boundaries.md#distinguish-immutable-information-from-retention-policy)]
<!-- END PROMOTION CONTENT -->

## Replace “Presentation and View”, preserving its definition and adding “Investigation context” and “Workspace” immediately after it

<!-- BEGIN PROMOTION CONTENT -->
### Presentation and View

*[decision: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition)]*

A **Presentation** describes how one or more Projections are rendered, interacted with or exposed through a PostCode interface. Presentation parameters describe choices such as layout, sorting, grouping, filtering and disclosure of detail. A Presentation can be graphical, human-readable text or structured machine-readable data.

A **View** is an instantiated Presentation of a nonempty collection of Projections. Each Projection retains its identity, subject, Lens, parameters, program-state basis, content and qualification. Different Presentations or parameter values can give different Views over the same Projection or collection. Presentation context supplies rendering circumstances, such as available space or the surrounding investigation; it does not change the supplied answers.

One coordinating Presentation can relate several Projections through shared alignment, axes, anchoring or linked selection. Several independent Views placed together remain several Views; a common container or visual proximity alone does not make them one. Presentation relationships do not establish new relationships in the investigated program. Alignment requires established correspondence or an exact identity guarantee supplied by the inputs; deriving further correspondence or a new program claim requires core analysis and a qualified Projection. [[Interface boundary](decisions/coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims)]

Adding or removing an underlying Projection changes View composition, rather than merely rendering context. Such changes must be visible and recorded. Replacing displayed information with a result based on newly captured state must likewise expose and record the change of basis. These distinctions preserve investigation lineage and define meaning rather than requiring independently stored stages, a managed-View lifecycle or a universal View identity formula.

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualifications. If an interaction instead refreshes the answer, its refresh behavior must be apparent and consequential changes in the answer, selection or qualifications disclosed. Disclosed reselection is distinct from the continuity of presenting the exact retained result with different presentation inputs. This does not require a warning for every identifier change or a comparison notice for every independently requested fresh investigation. [[Presentation continuity](decisions/coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes)]

When the human has not expressed a more specific information need, PostCode may suggest a summary View as an initial View. Summary can also support recursive navigation; it is not a required default. A summary View may coordinate existing qualified results, show a synthesized summary Projection, or combine both. It does not require a summary Lens. [[Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)]

### Investigation context

*[decision: [Application specification boundaries](decisions/application-specification-boundaries.md#start-with-a-workspace-as-a-collection-and-arrangement-of-views)]*

An **investigation context** comprises the Views accumulated while following subjects, relationships, and questions, together with their captured bases and relevant lineage. It identifies what each View shows and how it relates to the investigation. It can span Workspace arrangements and does not imply a separately stored context object, common captured state, or persistent Session. The [application specification](app-specification.md#workspaces-and-navigation) states the retained-lineage contract.

### Workspace

*[decision: [Application specification boundaries](decisions/application-specification-boundaries.md#start-with-a-workspace-as-a-collection-and-arrangement-of-views)]*

A **Workspace** is a collection and arrangement of Views. It is a UX organization, distinct from a Session, a program subject, and a single View coordinating several Projections. Views in a Workspace need not share a subject, captured state, or evidence. Placement is distinct from discovery, derivation, and program relationships.

The initial model does not require a permanent root subject, name, formal task, shared-context object, or persistence. Shared Workspace purpose and defaults remain future UX possibilities, distinct from the investigation context already represented by Views, their bases, and lineage. Ordinary interface focus is sufficient for the initial model.
<!-- END PROMOTION CONTENT -->

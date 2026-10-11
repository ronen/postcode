# Proposed revisions to docs/app-specification.md

## Replace “Interpreting and resolving requests”

<a id="interpreting-and-resolving-requests"></a>
### Interpreting and resolving requests

A request may specify any combination of subjects, Lenses, Lens parameters, Presentations, and Presentation parameters. PostCode may select unspecified elements to answer the expressed information need. The resolved choices, consequential criteria used at the time, and omissions remain inspectable; later defaults must not be used to reconstruct a different explanation of an earlier choice.

Subject designation, selected subjects, Lens parameters, designated program inputs, captured basis, and presentation/execution choices have distinct meanings. A request about output length changes presentation when it only abbreviates display; changing requested information or synthesizing a shorter account belongs to Lens selection or parameters. Execution budgets constrain effort rather than silently narrowing the question.

Request coordination resolves subjects using qualified information and declared Lens applicability/cardinality. When the Lens is known, name lookup is narrowed to suitable subjects. A precise reference resolves to its actual target before applicability checking; an incompatible bound target is not an unknown reference. Lens implementations receive valid normalized applications and defensively enforce their invariants. Choosing the order of partial lookup and Lens selection belongs to coordination.

Request interpretation can consume qualified information but must not itself establish the program population or other program claims. When resolution needs additional investigation, obtain it through Evaluation and core construction. Preserve attribution to its results and qualifications even when the parent request remains ambiguous or cannot be resolved. Established candidates, missing population coverage, unsupported applications, unavailable analysis, and an established empty result must not collapse into an undifferentiated “not found.”

For example, “Tell me about this module” can select a summary as the requested answer. If resolving “this module” first requires qualified population information, that prerequisite investigation is attributed to the parent request and retains any ambiguity or incomplete coverage.

Planning is an activity with an outcome even when it cannot settle a valid application. Deliver that outcome as a self-contained resolution result preserving the request, candidates, reasons, consequential choices, qualifications and prerequisite attribution. Do not manufacture a program Projection for the unsettled application. This is distinct from a valid empty/partial answer or a settled application whose Evaluation fails or is unavailable. Preserve independently produced prerequisite results and existing valid-but-failed or unavailable selections under their own retention rules.

An interface can retain and use the returned resolution information after execution finishes without observations or a new lookup. Candidate references support further requests within their supported Session lifetime, including selection of several candidates when the Lens accepts a collection. Later accumulation does not silently replace the displayed candidate selection. For now, no independent Session lookup of the resolution result, history reopening, persistent planning store or new clarification dialog is required. Current CLI delivery uses its output and worker/parent envelope, not a new outcome store; one-shot references still expire when the Session ends.

The [Lens application decision](decisions/lens-application-and-request-outcomes.md) specifies which earlier unsuccessful-selection Projections this contract replaces and which successful, failed/unavailable and associated selections remain retained. These responsibilities do not prescribe a universal planner, request schema or selection algorithm. General report representation and GUI interaction/rendering design remain separate from the bounded adaptations needed by current interfaces.

## Add to “Identity, labels, and continuity” after its first paragraph

Within the supported Session, otherwise identical qualified answers have repeatable Projection identity regardless of the subject's lookup spelling or name/reference route. Equality uses the [canonical effective-input set](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity), including Session context, method version and meaningful subject order/roles. Equal prose or displayed lists alone do not establish the same answer. Preserve request-specific resolution provenance separately without losing answer-relevant qualification. This is a logical referent contract, not a requirement for physical memoization, annotations or cross-session continuity.

## Add to “Design freedom and extension evidence” after its last paragraph

Lens implementations declare prospective qualified result contracts and Presentations declare compatible inputs, options, preconditions and standard expansions. Request planning uses these contracts, rather than inferring compatibility solely from a Lens name or data shape. Declare required expansions before Evaluation and validate materialized content before arrangement. Existing typed family contracts and explicit defaults suffice for the current toolbox; this does not require general Presentation ranking or a registry/plugin language. [[Result/Presentation compatibility](decisions/lens-application-and-request-outcomes.md#match-qualified-results-to-presentations-explicitly)]

## Add to “Resource-bounded work and outcomes” after its last paragraph

Minimize incurred interpretation costs by reusing completed interpretation when a later requirement requests the same compatible work within the supported Session validity contract. Consuming Lens, subject designation and navigation route do not themselves require another investigation. Newly accumulated evidence does not by itself invalidate a reusable outcome; existing qualification, correction, retention and retry rules continue to apply. Preserve generating provenance and distinguish current consumption from new execution. This reaffirms [operation reuse](decisions/investigation-operations-and-lenses.md) without prescribing a cache technique, multi-operation dialogue or semantic matching of other answers.

## Add to “Delivery and lifecycle” after its last paragraph

Request reporting describes the normalized request and its actual resolution/execution outcome, independently of whether a View exists. Usage is subjectless reporting; unsuccessful resolution returns a resolution result and does not fabricate a program View. Preserve actual output, final usage and qualifications without fabricating a view-produced event. Observation-delivery failure remains visible without invalidating an otherwise delivered result, including a non-View report. [[Actual request reporting](decisions/lens-application-and-request-outcomes.md#report-actual-requests-and-outcomes)]

## Add subsection “Experimental structured outputs” at the end of “Integration”

<a id="experimental-structured-outputs"></a>
### Experimental structured outputs

For now, structured application outputs are experimental and subject to change without notice. Approved changes can update affected JSON and observation shapes directly without compatibility adapters, dual formats or historical migration. Existing experimental output schema strings do not establish supported compatibility versions. Observation batches remain explicitly versioned and experimental; their envelope versions distinguish format changes without promising historical migration. Semantic qualification, source disclosure and method provenance remain required; specific earlier preservation clauses are reconciled explicitly by the change that replaces them.

Before supporting durable consumption, define deliberate format versioning, published schemas and compatibility obligations. The future coding-agent context artifact, required to be documented and stable enough for independent agents to consume, is such a case. That later requirement does not impose schema infrastructure on current early development. [[Temporary output policy](decisions/experimental-structured-outputs.md)]

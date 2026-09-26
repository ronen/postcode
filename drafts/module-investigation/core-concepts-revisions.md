# Proposed revisions to docs/core-concepts.md

Replace the complete definitions identified below, preserving the surrounding
canonical sections. Add Investigram under `Investigation and representation`,
after Projection and before Presentation and View. Add Investigator after Evaluation.
Unlisted content is unchanged.

## Replace definition: Subject

### Subject

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

A **subject** is what a lens investigates or a claim concerns. This is a role, not another entity kind. A subject may be an entity, a collection of entities, a relationship, a change between revisions, or an investigram. [[Investigrams as subjects](decisions/investigrams-and-progressive-investigation.md#separate-program-referents-from-interpretive-focus)]

A configured project can provide the subject for a module inventory without denoting an executable entry point or the human's current workspace.

## Replace definition: Property

### Property

*[decision: [Subject facets](decisions/facets-for-subjects.md#apply-facets-to-subjects-including-investigrams)]*

A **Property** is a characteristic of a subject about which information can be requested or asserted. A claim supplies information about such a characteristic in a particular context; naming the property alone does not establish its value or whether it holds. For example, rejection of duplicate identifiers may be investigated as a behavioral property, while test evidence and interpretation support different claims about it.

Property is descriptive vocabulary here. It does not imply a source-language field, an accessor, a separately addressable record, or a universal property schema.

## Replace definition: Facet

### Facet

*[decision: [Subject facets](decisions/facets-for-subjects.md#apply-facets-to-subjects-including-investigrams)]*

A **Facet** is a property used as a compact classification dimension for describing, filtering, grouping, or comparing subjects, including entities and investigrams. A claim supplies its value, and Claim context supplies its qualification. Different facets may overlap and need not share one representation or value type. For example, a module may be both external and declaration-only.

Facet names a role played by a property, not a separate record category or a special epistemological status. It does not imply a universal facet schema.

A conceptual facet describes the subject in terms useful to the investigation. A source facet describes its source-level representation or implementation mapping. Language-specific knowledge can establish a conceptual facet; language-specific does not by itself mean source-level. Facet names do not determine the strength of the supporting claim.

## Replace definition: Evaluation

### Evaluation

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evaluation** is PostCode's attempt to materialize requested information through applicable analyses. The information requirements arise from lenses and any standard expansions requested by presentations. Execution constraints describe the conditions under which the attempt is made, rather than the question the lens asks.

Applicable analyses include interpretation, which produces investigrams and their supporting context. [[Interpretation and evaluation](decisions/investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access)]

An **evaluation outcome** describes what occurred in that attempt: applicability and availability, execution state, result materialization, relevant cost, and reasons for failure or stopping. **Materialization** is how much of the requested information has been produced. These dimensions are distinct from the epistemological status of any produced claim.

An outcome can exist without a produced claim or entity, and an incomplete attempt can have usable qualified results. An established empty result is therefore different from the absence of a result. Evaluation outcome and Claim context describe different things even when an outcome helps explain a projection's coverage or limitations.

## Add definition: Investigator

### Investigator

*[decision: [Investigator execution and evidence access](decisions/investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access)]*

An **Investigator** is an AI agent that investigates a subject through a dialogue
with PostCode, using supplied context and requesting additional evidence as needed,
and submits an interpretation for validation.

## Replace definition: Session

### Session

*[decision: [Transient analysis sessions](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]*

A **Session** is a continuing context for investigation, retaining subject-reference bindings, captured evidence, analysis results, evaluation outcomes, and projections. Its accumulated information can grow as requests require additional analysis or inputs. A session is not an immutable description of a fixed, completely observed input set, a workspace of managed views, or a promise to follow changing program inputs.

Within a session, a reference once bound to an entity cannot be rebound. Evidence and published results retain their content, supporting context, and qualifications when later work adds information. Session membership alone does not establish a claim's evidence, completeness, or guarantee.

References bound to investigrams likewise retain their original targets throughout the session, including after correction. [[Investigram references](decisions/investigrams-and-progressive-investigation.md#represent-retained-interpretation-as-investigrams)]

The initial session opens one configured project and assumes its relevant inputs remain unchanged. Detection of a relevant change invalidates the session for further investigation; detection is best-effort and capture remains non-atomic. This does not establish earlier contents of an input first observed later.

A transient session ends with its process. References have meaning within the active session. Observations carry a session identifier to correlate commands within the session; this identifier does not establish the evidential basis or consistency of program claims. Persistence and any future validity policy for reopening a session are separate decisions.

## Replace definition: Projection

### Projection

*[decision: [Transient analysis sessions](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)]*

A **Projection** is the qualified information produced by applying a lens to a particular program state and subject, with particular lens parameter values. It includes its content and the qualifications needed to understand what that content establishes.

A projection is a program-domain object, addressable within its session, identifying its subject, lens, lens parameters, and session context, with references to its claims, supporting evidence and method context, and relevant evaluation outcomes. A produced projection retains the information selected for that result; later accumulation does not silently change it. For the current mechanically derived views, repeating a request with unchanged inputs and completed evaluation yields the same information. Reconstructing or rendering a projection need not establish a different answer. A later evaluation may add information when earlier work was incomplete, without changing the earlier projection or outcome. It is distinct from both an evaluation attempt and a rendering of its result. Presentation choices describe how the information is shown; they do not redefine the question asked by the lens.

Redisplay of an investigation result can select retained investigrams and explicit replacements into a new projection while preserving earlier projections. [[Retained interpretation selection](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)]

## Add definition: Investigram

### Investigram

*[decision: [Investigrams and progressive investigation](decisions/investigrams-and-progressive-investigation.md#represent-retained-interpretation-as-investigrams)]*

An **Investigram** is an immutable, addressable artifact of program investigation
containing a qualified interpretation in prose, with referent information, evidence
context, and provenance. Its provenance identifies the operation and selected
subject that produced it. It may contain multiple related claims.

Referent information describes what the interpretation concerns in its program
context and may include references to specific subjects. A referent may span
entities or identify captured source. Investigrams can be associated with the
subjects they describe for subsequent inspection and investigation.
[[Subject associations](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)]

An investigram and its subordinate investigrams form a fixed composition tree, which
may have multiple levels. A subsequent investigation
produces a separate root whose provenance identifies the investigram selected as
its subject. Composition describes the parts of one result; investigation provenance
connects separate results through their subjects. Neither describes the program's
structure by itself.
[[Composition and investigation provenance](decisions/investigrams-and-progressive-investigation.md#distinguish-fixed-composition-from-investigation-provenance)]

An investigram may carry accompanying corrections identifying earlier targets,
replacement investigrams, reasons, and evidence context, as well as unresolved
inconsistencies. Each replacement is constructed through its correction with a
composition tree disjoint from the reporting tree. Replacements may themselves
carry corrections; correction targets predate acceptance of the new result.
[[Corrections](decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)]

An investigram's citation index records prior investigrams supplied to the
investigator during its generating evaluation, without asserting reliance or
endorsement. "Needs reconsideration" is a session-derived property indicating
corrected context reached through those citations; the investigram and its index remain immutable.
[[Citation exposure and reconsideration](decisions/investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status)]

# Proposed revisions to docs/core-concepts.md

Replace the complete **Evaluation** and **Expansion** definitions with the following.
Retain the Evaluation anchor and all unaffected definitions. These changes make
Presentation-independent content requirements explicit while preserving the
separation between subject-kind detail and a new Lens question. They require
human acceptance with the internal application API decision before promotion.

<a id="evaluation"></a>
### Evaluation

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evaluation** is PostCode's attempt to materialize requested information through applicable analyses. Information requirements include those arising from lenses and standard expansions requested by Presentations or by explicit or default content requirements of the request. These requirements do not require a Presentation to be instantiated. [[Direct content requirements](decisions/internal-application-api.md#requirements-and-presentations)] Execution constraints describe the conditions under which the attempt is made, rather than the question the lens asks.

Requirements can also arise from system-initiated investigation serving an explicit parent request or authorized autonomous work. [[Investigation initiation](decisions/research-question-driven-observation.md#investigation-attribution)]

Applicable analyses include interpretation, which produces investigrams and their supporting context. [[Interpretation and evaluation](decisions/investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access)]

An **evaluation outcome** describes what occurred in that attempt: applicability and availability, execution state, result materialization, relevant cost, and reasons for failure or stopping. **Materialization** is how much of the requested information has been produced. These dimensions are distinct from the epistemological status of any produced claim.

An outcome can exist without a produced claim or entity, and an incomplete attempt can have usable qualified results. An established empty result is therefore different from the absence of a result. Evaluation outcome and Claim context describe different things even when an outcome helps explain a projection's coverage or limitations.

### Expansion

*[decision: [Subject-kind standard expansion](decisions/subject-kind-standard-expansion-decision.md#define-standard-expansions-for-kinds-of-subject)]*

An **Expansion** exposes additional detail within a Presentation. A **standard expansion** is related information defined for a kind of subject that can be requested as supporting content without applying another Lens, and that a Presentation can include as inline detail. Standard expansion requirements may come from a Presentation or from explicit or default content requirements of the request. A direct content requirement selects only expansions supported by the answer's content contract; it does not instantiate a Presentation. [[Direct content requirements](decisions/internal-application-api.md#requirements-and-presentations)] Effective exported-symbol relationships and associated in-source documentation assertions are initial module-entity examples. Module composition and a dependency relationship's organization context are examples added by the module-dependency slice.

Standard expansions concern the subject kind's related-detail semantics, independently of the Lens that selected the subject or the interface consuming the result. Supporting implementation detail can include evidence attribution and mappings, subject to the human output boundary. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)] Exposing another Lens's answer may add its Projection to a coordinating Presentation or embed another View. Requesting that answer goes through Evaluation and core construction; presenting an already supplied result does not require reevaluation. Inline placement alone does not make an additional Lens question a standard expansion. Dependency children and dependency parents, for example, remain separately meaningful Lens questions rather than standard module expansions. [[Coordinated expansion](decisions/coordinated-views-and-qualified-results.md#keep-evaluation-and-qualified-construction-independent-of-presentation)]

# Core Concepts

This document states PostCode's governing cross-cutting architectural terminology and the relationships necessary to define it. It says what the terms mean now; accepted [decision records](decisions/) preserve why the concepts were adopted or changed. It conforms to the adopted [product design](../foundation/product-design.md), which governs product direction rather than implementation architecture. Binding cross-cutting rules that implementations must follow are stated separately in [architectural constraints](architectural-constraints.md).

This document is not an exhaustive ontology or an inventory of implementation types. It defines only concepts and distinctions that need to remain stable across plans and slices. Definitions do not prescribe classes, interfaces, schemas, storage, module boundaries, or language-specific representations. Examples illustrate meanings, not a list of implemented capabilities.

Semantic changes require explicit human agreement and a corresponding accepted decision record, with both updated in the same commit. For every defined term include a short bracketed link to the decision that established or most recently changed it. Follow the [development workflow](../dev/workflow.md#documentation-and-decisions) when changing this document. If this document and an accepted decision disagree, treat the inconsistency as an unexpected finding rather than silently choosing or reconciling them.

## Subjects and program information

### Entity

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

An **Entity** is a distinguishable program subject represented by PostCode, such as a module, symbol, function, or test. What constitutes an entity, and what can be established about it, depends on the applicable language or analysis. An entity is distinct from the claims made about it and the evidence for those claims.

Addressability alone does not make something an entity. Claims, evidence, evaluation outcomes, and projections can also be addressable. An entity's identity, its implementation name, and a displayed label or navigation handle are different concepts. Continuity of a human's attention to a subject is also distinct from semantic continuity of that subject across program states.

### Subject

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

A **subject** is what a lens investigates or a claim concerns. This is a role, not another entity kind. A subject may be an entity, a collection of entities, a relationship, or a change between revisions. A configured project can provide the subject for a module inventory without denoting an executable entry point or the human's current workspace.

### Claim

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

A **Claim** is the information asserted by an analysis result. Its content is distinct from the Claim context that qualifies it and the evaluation outcome describing the attempt to produce it. Information about an entity and an assertion of a relationship are examples of claim content.

Claim does not mean proven fact. PostCode's qualified information distinguishes mechanically derived facts, recorded assertions, scoped observations, and interpretations. Establishing that documentation records a statement is different from establishing that the statement is true; establishing its association with a subject is another claim. This vocabulary does not require these distinctions to form one exhaustive record taxonomy.

### Property

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-facet-as-a-classification-role-played-by-a-property)]*

A **Property** is a characteristic of a subject about which information can be requested or asserted. A claim supplies information about such a characteristic in a particular context; naming the property alone does not establish its value or whether it holds. For example, rejection of duplicate identifiers may be investigated as a behavioral property, while test evidence and interpretation support different claims about it.

Property is descriptive vocabulary here. It does not imply a source-language field, an accessor, a separately addressable record, or a universal property schema.

### Relationship

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning)]*

A **Relationship** is a connection such as containment, dependency, a call, or an association between documentation and its subject. A **relationship claim** asserts such a connection and has Claim context of its own. For example, an exported symbol is an entity, while a module's export of that symbol is a relationship claim.

Participants are not necessarily all entities: a documentation association can connect an addressable recorded assertion to its subject. A relationship's meaning is distinct from its depiction as a graph edge or tree link. References between records do not, merely by being references, constitute asserted program relationships.

### Facet

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#define-facet-as-a-classification-role-played-by-a-property)]*

A **Facet** is a property used as a compact classification dimension for describing, filtering, grouping, or comparing entities. A claim supplies its value, and Claim context supplies its qualification. Different facets may overlap and need not share one representation or value type. For example, a module may be both external and declaration-only.

Facet names a role played by a property, not a separate record category or a special epistemological status. It does not imply a universal facet schema.

A conceptual facet describes the entity in terms useful to the investigation. A source facet describes its source-level representation or implementation mapping. Language-specific knowledge can establish a conceptual facet; language-specific does not by itself mean source-level. Facet names do not determine the strength of the supporting claim.

## Evidence and qualification

### Evidence

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evidence** is information or material used to support or assess a claim. Sources include program text and structure, recorded documentation and history, tests, and runtime observations. Evidence can also bear against an explanation. Its relevance and what it establishes depend on the claim and the method used to assess it.

Evidence is distinct from the conclusion drawn from it. A source reference identifies supporting material; it is not itself a guarantee that the material establishes the claim. Source evidence includes implementation mappings and locations, which are different from conceptual entity names or labels.

### Claim context

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Claim context** is the qualification of a claim: its evidence or source references, provenance and method, scope, epistemological status or guarantee, and limitations. Context can apply to a result set, including a projection, with narrower context for particular claims or subjects.

**Provenance and method** describe where information came from and how it was obtained. **Scope** describes the program state, population, execution, or other circumstances to which the claim applies. **Epistemological status or guarantee** describes what can safely be concluded. **Limitations** describe relevant bounds on that conclusion. These are related aspects of qualification, not interchangeable measures of confidence.

An observation about the investigated program concerns a particular observed execution or circumstance. An observation of PostCode use records an interaction or resulting view. The latter is evidence of that experience, not automatically a current claim about the investigated program.

## Evaluation and analysis context

### Evaluation

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation)]*

**Evaluation** is PostCode's attempt to materialize requested information through applicable analyses. The information requirements arise from lenses and any standard expansions requested by presentations. Execution constraints describe the conditions under which the attempt is made, rather than the question the lens asks.

An **evaluation outcome** describes what occurred in that attempt: applicability and availability, execution state, result materialization, relevant cost, and reasons for failure or stopping. **Materialization** is how much of the requested information has been produced. These dimensions are distinct from the epistemological status of any produced claim.

An outcome can exist without a produced claim or entity, and an incomplete attempt can have usable qualified results. An established empty result is therefore different from the absence of a result. Evaluation outcome and Claim context describe different things even when an outcome helps explain a projection's coverage or limitations.

### Analysis snapshot

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#include-only-the-analysis-and-identity-context-needed-by-the-definitions)]*

An **analysis snapshot** identifies the analysis-defining inputs and method context for a body of program information. It distinguishes the state and analytical basis of that information from the particular invocation or evaluation attempt that produced it. It is more specific than a revision name alone.

Snapshot-scoped references identify records within that analysis context. Correspondence across snapshots is a separate qualified relationship, not semantic continuity implied by matching identifier spellings.

## Investigation and representation

### Lens

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#preserve-the-lens-projection-presentation-and-view-distinction)]*

A **Lens** describes the aspect of a subject being investigated: the question being asked. Lens parameters refine the information requested, such as direct versus transitive callers. A composite lens selects and combines information from other qualified projections while remaining a lens over its subject.

### Projection

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#preserve-the-lens-projection-presentation-and-view-distinction)]*

A **Projection** is the qualified information produced by applying a lens to a particular program state and subject, with particular lens parameter values. It includes its content and the qualifications needed to understand what that content establishes.

A projection is an addressable program-domain object identifying its subject, lens, lens parameters, and analysis snapshot, with references to its claims and relevant evaluation outcomes. It is distinct from both an evaluation attempt and a rendering of its result. Presentation choices describe how the information is shown; they do not redefine the question asked by the lens.

### Presentation and View

*[decision: [Initial core concepts](decisions/initial-core-concepts-decisions.md#preserve-the-lens-projection-presentation-and-view-distinction)]*

A **Presentation** describes how a projection is rendered, interacted with, or exposed through a PostCode interface. Presentation parameters describe choices such as layout, sorting, grouping, filtering, and disclosure of detail. A presentation can be graphical, human-readable text, or structured machine-readable data.

A **View** is an instantiated presentation of a particular projection. Different presentations or presentation parameter values can give different views over the same projection. Presentation context supplies circumstances affecting rendering, such as available space or the surrounding investigation. These distinctions describe meaning rather than a required sequence of separately materialized execution stages.

### Expansion

*[decision: [Subject-kind standard expansion](decisions/subject-kind-standard-expansion-decision.md#define-standard-expansions-for-kinds-of-subject)]*

An **Expansion** exposes additional detail within a presentation. A **standard expansion** is related information defined for a kind of subject that a presentation can include as inline detail without applying another lens. Effective exported-symbol relationships and associated in-source documentation assertions are initial module-entity examples. Module composition and a dependency relationship's organization context are examples added by the module-dependency slice.

Standard expansions concern the subject kind's presentation semantics, independently of the lens that selected the subject. A source-detail expansion discloses supporting implementation evidence. Expanding an item to embed a view of another projection instead involves another lens application; inline placement alone does not make that information a standard expansion. Dependency children and dependency parents, for example, are separately meaningful lens questions rather than standard module expansions.

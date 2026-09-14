# Initial core-concepts decisions

Status: in review
Decided:
Arising from: human-directed planning to populate the governing core concepts from the adopted product design, approved initial module inventory plan, and accepted architectural decisions
Scope: shared architectural terminology across PostCode plans and slices

## Context

The canonical core-concepts document currently defines its purpose but contains no adopted definitions. Terminology already appears in the adopted product design and accepted decisions, with descriptive architecture and one implemented TypeScript slice supplying examples. Later work needs a concise shared vocabulary without turning that slice's record shapes into the conceptual model of every language or analysis.

This proposed bundle accompanies the complete proposed [core-concepts document](../docs/core-concepts.md). Both remain non-governing drafts. Acceptance would populate that document and record the rationale together. It would not authorize implementation, alter the adopted product design, or replace the binding architectural constraints. No existing accepted decision is proposed for supersession: the definitions consolidate established distinctions, and the modest new wording for Property is identified below rather than presented as a previously adopted formal model.

### Source basis

The adopted design governs product meaning; accepted decisions establish scoped architectural choices. The [approved initial module inventory plan](../../../../docs/plans/initial-module-inventory-plan.md#success-criteria) corroborates how those choices fit together. The [current architecture overview](../../../../docs/architecture/README.md) describes their realization. Implementation was inspected only as supporting evidence, not as authority for filling semantic gaps.

| Proposed terminology | Principal basis and limit |
| --- | --- |
| Entity, Subject, identity and names | Product design [identity and continuity](../../../../foundation/product-design.md#24-identity-and-continuity-of-attention), [naming](../../../../foundation/product-design.md#25-naming-and-terminology), [navigation](../../../../foundation/product-design.md#34-navigation-through-views), and [summary subjects](../../../../foundation/product-design.md#411-summary-lenses); accepted [domain entities](../../../../docs/decisions/initial-module-inventory-decisions.md#represent-modules-as-qualified-domain-entities). Subject is an investigative role, not a promise that every such subject is currently selectable. |
| Claim, Relationship, Claim context | Accepted [record-oriented model](../../../../docs/decisions/initial-projection-architecture-decisions.md#use-a-record-oriented-program-information-model), [domain entities](../../../../docs/decisions/initial-module-inventory-decisions.md#represent-modules-as-qualified-domain-entities), and [Claim context and evaluation outcomes](../../../../docs/decisions/initial-module-inventory-decisions.md#preserve-claim-context-and-evaluation-outcomes-distinctly). The sources distinguish addressable categories without establishing an exhaustive taxonomy. |
| Property, Facet | Product design [epistemological contract](../../../../foundation/product-design.md#22-epistemological-contract) and [test lenses](../../../../foundation/product-design.md#414-test-lenses) use property descriptively. Accepted [module facets](../../../../docs/decisions/initial-module-inventory-decisions.md#represent-modules-as-qualified-domain-entities) and [conceptual presentation and source escape](../../../../docs/decisions/initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape) establish Facet more specifically. |
| Evidence and qualification | Product design [sources of program knowledge](../../../../foundation/product-design.md#23-sources-of-program-knowledge); accepted [qualification constraints](../../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md#preserve-claim-qualification-throughout-processing-and-presentation) and [observation production](../../../../docs/decisions/initial-observation-recording-decisions.md#record-normal-view-production-automatically). Evidence is broader than source locations or proof. |
| Evaluation, outcome, materialization | Product design [resource-bounded analysis](../../../../foundation/product-design.md#2151-resource-bounded-analysis); accepted [evaluation separation](../../../../docs/decisions/initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction) and [evaluation distinctions](../../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit). No scheduler or fixed state schema is implied. |
| Lens, Projection, Presentation, View, Expansion | Product design [four-way distinction](../../../../foundation/product-design.md#21-lenses-projections-presentations-and-views) and [navigation](../../../../foundation/product-design.md#34-navigation-through-views); accepted [projection records](../../../../docs/decisions/initial-projection-architecture-decisions.md#make-projection-and-evaluation-state-first-class-records), [standard expansions](../../../../docs/decisions/initial-module-inventory-decisions.md#represent-modules-as-qualified-domain-entities), and [source detail](../../../../docs/decisions/initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape). Logical distinctions do not prescribe physical execution stages. |
| Analysis snapshot | Accepted [logical identity](../../../../docs/decisions/initial-projection-architecture-decisions.md#use-deterministic-logical-identity-independently-of-persistence), [snapshot-scoped references](../../../../docs/decisions/initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped), and [analysis versus invocation identity](../../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md#make-analysis-identity-independent-of-invocation-identity). This is analysis context, not a cache-validity or atomic-capture definition. |

## Decisions

### Define entities, subjects, claims, and relationships by their meaning

#### Decision

Define Entity as a distinguishable program subject, Subject as the role of what is investigated or asserted about, and Claim as the information asserted by an analysis result. Define Relationship as a connection and relationship claim as the assertion of that connection with its own qualification. Do not equate addressability with entityhood or equate every stored reference with a program relationship.

Use the accepted module examples to make the distinction concrete: a symbol is an entity, its export from a module is a relationship claim, documentation is a recorded assertion, and the documentation's association with a subject can itself be a relationship claim. Definitions do not restrict all relationship participants to entities.

#### Rationale

These distinctions are already explicit in the accepted record model and module decisions. They allow subjects and connected information to remain intelligible across lenses and presentations without promoting a graph, a storage identifier, or a TypeScript union into an ontology.

#### Alternatives considered

- Call everything addressable an entity: conflicts with the accepted distinction among entities, claims, evidence, and relationships.
- Limit subjects and relationship participants to entities: excludes adopted relationship navigation and documentation associations.
- Define every relationship as a directed binary edge or every claim as a subject–predicate–object triple: introduces a formalism the sources have not adopted.

#### Consequences

Shared language can describe existing information and future lens subjects without prescribing record categories or relationship cardinality. The definition of Claim retains the accepted wording; it does not declare the current implementation's `Claim` union exhaustive. The recorded-assertion taxonomy remains an explicit open question below.

### Give Property a minimal descriptive meaning and preserve overlapping facets

#### Decision

Use Property for a characteristic of a subject about which information can be requested or asserted. Distinguish that characteristic from a claim about its value or whether it holds. Use Facet for an established characteristic describing an entity, with overlapping conceptual and source-level descriptions as established by the module decisions.

Adopt no formal subtype hierarchy among Property, Facet, Relationship, and Claim. Property's proposed wording is a minimal clarification of ordinary usage in the adopted design, not recognition of an existing formal Property model.

#### Rationale

The product design asks about properties and uses a behavioral property in its test example. The module decisions define facets as overlapping established characteristics and distinguish conceptual information from source detail. This supports useful vocabulary, but not a universal attribute system or a claim that every property has a separate record.

#### Alternatives considered

- Omit Property entirely: defensible given the lack of a formal model, but leaves an already-used word without even a limited shared meaning.
- Define Property as a key–value record or source-language member: excludes behavioral usage and imports representation assumptions.
- Make Facet a mutually exclusive entity kind, or require it to be a formal Property subtype: the first contradicts accepted overlap; the second adds an unsupported taxonomy.

#### Consequences

Property can be used in planning without implying an API. Facet does not acquire the current module facet list as a universal enumeration. If a future slice needs separately addressable properties, relationship properties, or a formal facet hierarchy, that requires a further choice rather than an inference from these definitions.

### Distinguish claim content, evidence, qualification, and evaluation

#### Decision

Define Evidence as material or information used to support or assess a claim, including potentially contrary evidence. Define Claim context using the accepted elements: evidence or source references, provenance and method, scope, epistemological status or guarantee, and limitations. Explain those elements without prescribing their encoding.

Define Evaluation as the attempt to materialize requested information and evaluation outcome as the account of that attempt. Distinguish applicability and availability, execution, materialization, cost, and reasons from the status of a produced claim. Include the established-empty versus absent-result distinction because it explains why outcomes exist independently of produced entities or claims.

Distinguish observations of the investigated program from observations of PostCode use. Do not add a general Observation record taxonomy.

#### Rationale

The epistemological contract and accepted constraints depend on these meanings. A successful attempt does not establish a stronger claim, a source citation is not proof, and a recorded view is evidence of an interaction rather than automatically current program information. A glossary that collapses these concepts would undermine the existing constraints even without explicitly changing their wording.

#### Alternatives considered

- Use one context or status concept for execution and knowledge: loses the distinction between production of information and what it establishes.
- Define Evidence only as source spans: excludes adopted historical, observational, and interpretive evidence paths.
- Treat every observation as a current program claim: conflates program knowledge with observation of the user's experience.

#### Consequences

Definitions explain the qualification model without duplicating propagation, failure-handling, source-capture, or observation-delivery rules from architectural constraints. They do not require all evidence to be raw source material or all qualification to be copied into every individual record.

### Preserve the lens, projection, presentation, and view distinction

#### Decision

Use the adopted definitions: a Lens states the question or aspect of interest; a Projection is the qualified information produced for a program state and subject; a Presentation states how that information is rendered, interacted with, or exposed; a View is an instantiated presentation of a particular projection.

Include the accepted addressability and associations of a projection with subject, lens, lens parameters, analysis snapshot, claims, and relevant evaluation outcomes. Define lens parameters by the information requested and presentation parameters by how that information is shown. Do not define the exact identity key of a projection or require independently materialized execution stages.

#### Rationale

This is explicit adopted product vocabulary, reinforced by the accepted projection architecture. Keeping it intact accommodates text, structured output, future graphical views, composite lenses, and execution planning without redefining product concepts around one implementation pipeline.

#### Alternatives considered

- Use projection and view interchangeably: loses the distinction between qualified information and an instance of its presentation.
- Define a lens as a language-analyzer invocation: ties the question to a particular method and obscures composite lenses.
- Copy a record identifier formula into the definition: would resolve the open distinction between logical projection identity and materialized attempts through implementation detail.

#### Consequences

The core document can describe several views over the same projection without promising a particular cache, persistence scheme, or identifier formula. Rendering boundaries and qualification-preservation requirements remain governed by their existing decisions and constraints.

### Define standard expansion separately from another lens application

#### Decision

Use Expansion for disclosure of additional detail within a presentation, and define standard expansion more narrowly as entity-kind-related information that may be included inline without applying another lens. Retain exports and associated documentation as module examples. Explain source-detail expansion and distinguish inline placement of a new lens's view from standard expansion.

#### Rationale

The product design uses expansion for disclosure and inline navigation. The accepted slice additionally gives standard expansions a specific domain meaning. Those uses coexist: an inline callers view is still a callers projection, while module exports can be standard recognition detail. Treating all expansion as arbitrary relationship traversal would erase the boundary the accepted decisions establish.

#### Alternatives considered

- Define every expanded item as another projection: excludes the accepted standard-expansion mechanism.
- Define every inline detail as a standard expansion: mistakes placement for information semantics.
- Freeze Expansion to the current exports/documentation implementation union: omits accepted source-detail disclosure and promotes a slice-specific list into shared terminology.

#### Consequences

The vocabulary explains why source detail, module standard detail, and an embedded view are distinguishable even when they share a visual affordance. It does not establish a universal expansion API, a registry, or new rules for when rendering may request evaluation.

### Include only the analysis and identity context needed by the definitions

#### Decision

Define Analysis snapshot as the analysis-defining inputs and method context for a body of program information. Distinguish that context from an invocation or evaluation attempt, and snapshot-scoped reference from correspondence across snapshots. Keep entity identity distinct from implementation names, labels, and handles.

Leave deterministic construction rules, persistence policy, cache validation, and physical snapshot capture to their existing authorities and later scoped decisions.

#### Rationale

Projection and Claim context cannot be understood using revision alone. Accepted decisions already make analysis methods significant and separate logical reference identity from invocation-specific observations. Conversely, neither repeatability nor an identical spelling establishes cross-state semantic continuity.

#### Alternatives considered

- Define snapshot as a Git commit: omits working-tree and analysis-method context.
- Define identity through persistent storage or the current digest algorithm: conflates reference meaning with lifecycle or encoding.
- Add a full workspace, session, revision-binding, and continuity ontology: unnecessary to populate the initial cross-cutting terms and liable to overstate what later work has settled.

#### Consequences

The definitions support current references and future investigation without promising atomic filesystem capture, reuse validity, or persistent semantic identity. A snapshot is not defined by the current implementation's input fields or hash representation.

## Ambiguities retained for review

These are limits on what the sources establish, not requests to choose TypeScript representations during this planning exercise. Acceptance can retain these limits; it need not settle a formal model that no approved work currently requires.

1. **Property and its relationship to Facet.** The foundation uses property for both requested information and behavioral characteristics, but no accepted decision defines its granularity, identity, or relationship to claim content. The proposed characteristic-versus-claim wording is intentionally modest. Whether a facet is formally a property, a special claim, or another construct remains unadopted. Review should confirm that this limited vocabulary is useful; a stronger meaning needs a separate proposal.

2. **Claim and recorded assertion.** The accepted module decision defines Claim as information asserted by an analysis result, while the product design discusses claims with recorded-assertion status and the record-model decision names claims and recorded assertions separately. These sources clearly distinguish the statement's contents, the fact that it was recorded, and its association with a subject. They do not settle whether all recorded assertions are formally Claim subtypes. In the supporting [record definitions](../../../../src/lib/records.ts), `RecordedAssertion` is outside the `Claim` union and its associated context currently has a mechanically-derived discriminator. That is not sufficient to decide the general taxonomy or to declare the documentation's contents mechanically established. The proposal preserves the semantic distinction without prescribing union membership or moving qualification fields.

3. **Relationship scope and structure.** Accepted documentation associations establish participants beyond pairs of entities, and the product design also uses relationships for investigation links among views. Neither a universal participant set nor arity, directionality, identity, or a taxonomy unifying program relationships and investigation links has been adopted. The definition gives meaningful examples and distinguishes claims from generic references; it does not force all such links into one relationship type. This remains a future design choice if a general relationship representation is needed.

4. **Logical projection versus materialized projection identity.** The product design defines a projection through lens, program state, subject, and lens parameters, independently of presentation choices. The accepted architecture makes projections addressable and keeps repeated evaluation attempts distinct, but does not fully specify whether equivalent requests with different attempts or materialization extents share a logical projection identity, have distinct result identities, or use both. The supporting [projection constructor](../../../../src/lib/projections.ts) includes an evaluation-record ID in the projection-record identity, and that ID includes an attempt ordinal in the [evaluator](../../../../src/lib/evaluation.ts). The projection also retains presentation-requested expansion information. This is a potential tension between logical and materialized identity, not evidence that evaluation attempts or presentation parameters should become lens parameters. The proposal does not endorse that formula as the conceptual definition. Clarify this before relying on projection identity across attempts, presentation-driven materializations, or durable reuse; any demonstrated conflict with the foundation requires explicit resolution.

The sources already settle the main standard-expansion distinction, shared versus narrower Claim context, and overlapping facets; those are not presented as unresolved merely because alternative representations are possible.

## Shared follow-up

On explicit human acceptance, promote the complete core-concepts document and this decision together, set the decision's accepted status and actual decision date, and add it to the canonical decision index. Correct draft-relative links for their canonical destinations and remove review-only packaging language. No earlier decision needs a supersession mapping unless review changes the proposed semantics to replace one of its choices.

Keep the unresolved questions with the decision so later work can find the limits of adoption. No canonical edits, decision acceptance, commit, implementation, or new task record are part of preparing this proposal.

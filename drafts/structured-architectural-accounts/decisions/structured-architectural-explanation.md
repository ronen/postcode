# Structured architectural explanation and illustrations

Status: in review
Decided: pending adoption
Arising from: [Structured architectural accounts](../plans/structured-architectural-accounts.md)
Scope: content meaning, qualified guidance, one representative architectural concept and diagram capability
Supersedes:

- [Require accumulated architectural understanding](structured-investigram-content.md#require-accumulated-understanding), by [Accumulate qualified accounts](#accumulate-qualified-accounts). The accumulation requirement is retained; the unresolved supporting architecture is replaced by the coordinated contribution decisions.

## Context

Prose can explain architecture but cannot alone supply reliably addressable state/relationship meaning to a diagram. A schema alone is also insufficient: a consumer needs to know what a state bearer, condition or transition means and what evidence qualifies it. The application needs enough structure to communicate through words and pictures without inventing a universal reconciled model or a complete presentation system.

## Decisions

### Accumulate qualified accounts

PostCode accumulates partial qualified architectural understanding that humans and agents can revisit, reuse, extend, challenge and reorganize. Accounts can overlap, disagree and remain incomplete. Preserve evidence, applicable qualifications, exact earlier information and revision relationships without requiring one authoritative architecture or persistence beyond the supported lifecycle.

The supporting mechanism is [common immutable contributions](common-analysis-contributions.md), [qualified associations and exposure](association-organization-and-exposure.md), and [Lens-selected immutable answers](qualified-answers-over-contributions.md). Account remains informal English for information PostCode provides, not another aggregate record. Broader navigation, user-facing capability selection and persistence remain separate design work. Retention does not independently corroborate a claim or adopt a proposal as intended architecture.

**Rationale and alternatives.** Disposable answers do not support progressive architectural understanding. A single mutable model would conceal disagreement and historical support. Qualified overlapping contributions give continuity without requiring reconciliation or a formal knowledge-representation system beyond the application need.

### Content and catalogue responsibilities

Analysis content consists of keyed content items. A content type names a supported structure; its content-type contract defines meaning, required data, references, qualification, dependency and partial-information rules. A schema expresses mechanically checkable shape. A prose item is a legitimate structured item, but placing prose under a key does not satisfy a required specialized state model.

Keep three responsibilities distinct, without requiring three physical registries:

| Responsibility | Contract |
| --- | --- |
| Architectural concept | Established vocabulary and agent guidance for identifying and explaining a kind of architectural information, including applicability and limits. |
| Content type | Addressable retained semantic information, references and required support; independent of one rendering. |
| Diagram type | Required content inputs and a mapping to a picture that preserves their asserted meaning and qualification. |

One item can express several concepts; one concept can have several content representations or prose explanations. Concepts can be recognized and extensible without a whitelist of everything agents may discuss. Multiple concept classifications of an Entity are qualified claims. Recognized classifications can support later icons or relevance-based operations, but those treatments and an ontology of investigation operations are deferred. Existing hard subject signatures remain explicit; advisory soft signatures are only a future candidate.

Use established architectural terminology with agent-facing descriptions and source attribution where helpful. Reference reading does not grant a built-in agent web access: essential instructions are supplied through supported integration/access boundaries. The supported schema and instructions must be sufficient to produce and validate the contract; externally linked sources are not a missing mandatory runtime input.

Local keys identify content components and cross-references without allocating an Entity for every node, edge or role. Content references share claims with their source qualification; Entity references share identity only. Local roles are scoped variables, with constraints and optional qualified example bindings. An example binding narrows a general role to an instance/scenario; it is not an alias for an already scenario-specific participant. A later investigation may explicitly identify an occurrence, preserving an exact originating address without asserting equivalence merely from selection.

Content contracts declare dependencies once. A transition step referring to a state model follows its exact state/transition reference; a diagram specification must not duplicate that dependency. Informative related-content links do not imply the linked content was delivered. Missing required support/coverage is explicit under the common acquisition rules.

**Rationale and consequences.** Conflating architectural concept with diagram schema would make visual convenience define meaning. Separate contracts allow reuse of qualified semantic information by several representations. They still avoid speculative ontology or new shared identities for every local element. Detailed field layout and registry packaging remain implementation choices.

### Qualified guidance and illustrations

An **investigation of selected content** takes exact prior information chosen as its subject. **Invocation of a follow-up option** executes an investigation request specified in retained guidance. These describe input selection and request initiation respectively: an option can name prior content as an input only where the invoked investigation supports that input kind. Invoking an option does not implicitly target whatever content the user has selected.

Follow-up options are qualified metadata owned by the investigram that generated them. Each has an exact local key and enough retained meaning, target/reference and parameter information to invoke it. They express available further inquiry, with no mandatory temporal meaning such as recommended next. An option from an earlier contribution stays attached to that version; a new contribution chooses its own options. A question already answered by the same submission need not be repeated. No transplanted option identity, completion lifecycle or automatic result-reuse policy is introduced.

The application can execute an exact retained option through a declared Lens/method contract. The Lens delegates the specific question to that qualified option while preserving its exact owner/key and meaning. Naming an unsupported method does not make an option executable; invocation must satisfy the supported method/applicability contract. An option packages a supported investigation request; it does not expand the accepted subject/input types. Its subjects and parameters must satisfy that investigation's declared contract. Option wording does not authorize arbitrary text as a subject; a retained content reference or contextual selection is usable only where that input kind is supported. The default result contract is a qualified contribution using valid supported content types. If the option promises a particular form, such as a state diagram, that specialization is explicit and checked through normal fulfillment/Presentation contracts. Every option need not predict the answer's exact shape. Option delivery to a producer is substantive qualified input; human browsing is not producer exposure.

An illustration is a picture the investigator authors as part of an explanation. Its retained specification names the diagram type, exact primary content inputs and applicable qualification/evidence. It is organizing metadata, distinct from architectural claims and from example bindings. An investigator can include illustrations spontaneously; explicit diagram requests impose requirements regardless of whether it would have chosen to illustrate otherwise.

An illustration is not permission to render. A compatible diagram can be generated from retained content without an authored illustration, and adding a renderer does not amend earlier investigrams. Correcting an erroneous specification uses explicit qualified new information; a missing suggestion for a later renderer is not an error. Application Presentation contracts own arrangement and compatibility, not the producer's taste in layout.

**Rationale and alternatives.** A separate durable guidance child would detach advice from the claims that motivated it: an offer about X need not remain relevant when the explanation changes to Y. Owner-specific metadata is simpler and honest. An exhaustive catalogue of globally offered investigations or concept-to-operation ontology is unnecessary for exact retained options.

### Bounded state-diagram capability

Implement state-dependent behavior as the first architectural concept and one real **directed state-transition diagram**: named states, an explicit initial entry when established, directed transitions labeled by trigger/condition and effect, and a qualified state bearer. This is a bounded conventional state-machine notation, not a claim to implement full UML statecharts. Hierarchical/orthogonal regions, history pseudostates, concurrency semantics, simulation and interaction diagrams are not required. If the selected account needs unsupported semantics, disclose that limit rather than flattening them into an apparently complete graph.

The contract carries the state bearer (Entity or scoped role), state identities/labels, transition endpoints, trigger or occurrence condition, guards/effects where claimed, initial-entry meaning where supported, applicability and evidence/limitations. Distinguish unknown or omitted entry/transition information from established absence. Relationships between a state category and an instance in a scenario are asserted content, not inferred from diagram position. Named edges and nodes are addressable locally; not all need global Entity identities.

The renderer arranges this supplied information; it must not infer missing states, causation, transitions, correspondence, completeness or a reconciled alternative. Use terse labels or mnemonics and an accompanying legend/detail where needed. Preserve conditions, effects, scope and qualification in the delivered diagram-plus-explanation; the image alone may be only an overview. Human understanding must not depend on source-language syntax.

The human-output boundary covers agent-authored names, diagram labels and qualifications as well as accompanying prose. Mechanical structural validation and visual inspection verify rendering fidelity, not truth of the architectural analysis.

Explicitly request a diagram in at least one supported application path. Check required semantic content before claiming fulfillment and actual Presentation compatibility before rendering. Missing investigation content differs from rendering failure. Both can coexist with useful valid retained content; process all accepted declarations normally. A keyed prose answer cannot silently fulfill the diagram requirement.

Check requirements against the actual selected answer, including each alternative in scope.

A later result designation does not inherit the earlier answer's diagram compatibility or fulfillment; assess its actual selected content. If two equally standing alternatives are selected and only one supports the diagram, preserve both, identify the supported one and report the other's unmet requirement. Do not report full fulfillment because one renders. A request explicitly selecting only one alternative is assessed for that selection. Separate diagrams suffice; no combined renderer is required. Any supported combined picture must preserve qualified differences rather than synthesizing a canonical model.

**Rationale and alternatives.** Injected schemas alone cannot demonstrate that real retained information supplies architectural meaning. One concrete diagram exercises this boundary without implementing an entire diagram system. Multiple concepts, statechart hierarchies or composition interactions would broaden the first delivery without being necessary for the mechanism. The initial product offering can later refine or replace this representative diagram.

One concept does not demonstrate catalogue extension across substantially different architectural concepts; that is an accepted validation limit of the first delivery.

### Validation and application scope

Deliver the state-dependent-behavior investigation and invocation of retained follow-up options through the supported application boundary, with declared subject signatures and result contracts. Preserve normal request resolution, Evaluation, qualified retention, exact retrieval and Presentation compatibility. It must not exist only behind a test-only producer call. New CLI commands or GUI menus are not required; actual API routes and limitations are documented during implementation.

Combine controlled dialogs/producers for deterministic mechanism coverage with a few focused live-agent trials for integration and instruction usability. Together the live trials demonstrate successful qualified state content, retention/retrieval, rendering and executing an exact retained option with additional acquisition. Failure-only trials do not meet that requirement. Allow legitimate output variation; optional spontaneous actions can be deliberately elicited for testing. Do not freeze an agent answer/image or claim statistical reliability, comprehensive interpretive ability or user value.

**Consequences.** The associated plan tests all common mechanisms while migrating existing capabilities. Actual schemas, renderer, input examples and live trial arrangements remain implementation choices within these semantics. New requirements that would change meaning, authority or coverage return to human design review.

## Adoption and subsequent work

Adopt with the contribution/association/application decisions and governing revisions. Broader composition and interaction, concept-driven relevance, graphical navigation and organization remain backlog candidates. Required qualification and evidence stay binding in all modalities actually supported; this first delivery does not add hypothetical/intended-input infrastructure by implication.

# Established concepts and architectural accounts

Recorded: 2026-11-06
Status: exploratory design guidance; not a methodology, adopted schema or implementation plan

## Operationalizing established concepts

The human introduced the framing that PostCode operationalizes established
software-design and architecture concepts. It is useful here because concepts
can shape what PostCode represents, investigates and connects, as well as the
questions and presentations offered to humans and external agents.

For example, ownership can guide investigation of who controls execution, retains
shared state or supplies work. Contract can distinguish an observation of current
eligibility from a reservation or guarantee. A label alone is insufficient: the
account must establish which meaning is relevant, its supporting basis, and what
the human can examine or challenge next. Established concepts can have several
legitimate meanings; their use must remain intelligible and qualified rather than
imposing one rigid taxonomy.

## Resources and their role

The human supplied these sources. The collection descriptions and relevant ATAM
report portions were inspected for this discussion; this was not an exhaustive
review of the books or methods. The following applications to PostCode are our
design interpretations, not claims that SEI endorses this product or its interface.

- [Views and Beyond collection](https://www.sei.cmu.edu/library/views-and-beyond-collection/):
  relevant architectural views and information spanning them, with view selection
  informed by audience and use. This can inform account content, related accounts,
  interfaces, behavior, rationale, and presentation. An architectural view in this
  literature need not map one-to-one to PostCode's technical View concept.
- [ATAM report](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/)
  ([full report](https://www.sei.cmu.edu/documents/629/2000_005_001_13706.pdf), particularly
  sections 5 and 7): examining decisions under concrete conditions and quality
  goals, identifying risks, sensitivities and tradeoffs, and making the reasoning
  explicit. This can help us notice missing conditions or unsupported conclusions
  without making ATAM an application workflow.
- [Attribute-Driven Design collection](https://www.sei.cmu.edu/library/attribute-driven-design-method-collection/):
  relating functional and quality requirements and constraints to design choices,
  responsibility allocation and interfaces. This can inform how PostCode relates
  reasons for a proposed change to its architectural consequences, without owning
  the design process or selecting an ADD decomposition workflow.

The assistant initially proposed organizing the sketch around views, scenarios
and rationale. The human clarified that PostCode should not embody a particular
formal methodology, and the initial interaction sketch should not explicitly
follow one. The human does not need familiarity with those methodologies. Their
concepts can inform the journey, application, and the definition, organization and
presentation of architectural accounts. This clarification governs our use of
these resources in the exploration.

## Implications for accounts

Questions for account design include:

- **Content:** which elements, relationships, responsibilities, behavior, interfaces
  and conditions are necessary to answer this inquiry?
- **Organization:** how do complementary accounts relate, overlap or conflict?
  Which correspondences are supported, and which are unresolved?
- **Supporting context:** what purpose, assumptions, rationale, evidence and
  limitations are needed to interpret the account? Recorded intent, inferred
  rationale and established behavior remain distinct.
- **Presentation:** what should be apparent immediately, what belongs in additional
  detail, and which relationship makes a useful route to another perspective?

These are design questions, not mandatory fields for every account or a new
universal schema. Some information can be supplied by associated accounts or
support rather than duplicated. A conceptual relationship needs analysis and
qualification; placing two panels beside each other cannot establish it.

The resources could also inform investigative practices and agent instructions:
clarify a claim's conditions, examine a competing explanation, or identify an
unresolved commitment. We have not selected a procedural checklist or required
these operations to appear as buttons. The existing dialogue supplies the
journey's information needs and progression.

## Reassessment of the Cockatiel sketch

The first reference-surface sketch makes concepts selectable but leaves several
accounts too much like adjacent summaries. Its repeated generic evidence notice
does not distinguish the supporting basis of a behavioral claim from the origin
of a proposal or the endorsement of an intention. The following revision addresses
those weaknesses without adding methodology-labelled tabs or changing the episode:

1. State the concrete question of the selected perspective. For example, breaker
   ownership asks who supplies work and retains recovery state; composition
   ownership asks who controls shared state and capacity. These clarify the
   concept's meaning in this context.
2. Offer a small number of relevant connections. The operating model's supplied
   operation is the work used in a recovery trial; composition's recovery waiting
   refers to the breaker interaction. A proposed ownership allocation can be
   compared with the implemented one. These are prepared qualified relationships
   from the recorded discussion, not relationships derived by the display.
3. Make supporting detail specific. Show which part of the recorded investigation
   supports an account and what it does not establish. Keep material conditions
   such as the default single-trial example visible in the account itself.
4. Preserve why the chosen direction was considered worthwhile and what remains
   undecided. For the timer proposal, notification and conservative scope inform
   the direction; event ordering and lifecycle remain unresolved. This is recorded
   participant reasoning, not established maintainer rationale or verified benefit.

The interactive revision retains open/close/reorder behavior, explicit input
attribution, conceptually available perspectives and distinguishable modalities.
Following a connection opens another prepared account with its version; it does
not initiate live analysis or silently share the panel with the design agent.

The next useful review is to follow one relationship across perspectives and ask
whether it helps reason about a consequential distinction. Presentation quality
still affects that judgment. Better connections or richer metadata alone do not
establish value over capable conversation with diagrams and notes.

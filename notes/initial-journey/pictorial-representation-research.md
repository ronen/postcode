# Pictorial representations: research shortlist

Date: 2026-10-14
Status: exploratory research; non-governing, not a notation or implementation decision

A [references-only companion](visual-language-references.md) contains the sources
without this exploration's interpretations or recommendations.

## Purpose

Following the [preferred direction](readiness-investigation-dialogue.md#retained-account-direction)
of pictures as views of a retained revisable account, the human asks us to examine
existing work on pictorial representations of software architecture and
functionality. Their reservations about UML are a preference to investigate,
not a reason to exclude it.

This bounded first pass seeks useful precedents, not an exhaustive literature
review or evidence that our proposed experience works. Relevance judgments below
are our interpretation. The [existing visual-language notes](../gui/visual-language.md)
concern interface typography, claim cues and view anatomy; this research concerns
pictures of the software being investigated. Neither silently replaces the other.

## Shortlist

### Functional pictograms: Enterprise Integration Patterns

Gregor Hohpe and Bobby Woolf combine pattern icons into larger explanations.
Their [notation discussion](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Introduction.html)
describes deliberately sketch-like representations, alongside selective use of
UML. The [Message Filter](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Filter.html)
is a compact example of illustrating an operation.

**Potential lesson:** repeated symbols should communicate functions and participate
in meaningful actions, rather than merely decorate named components.
**Limit:** messaging semantics do not describe Cockatiel's in-process policies.
Borrow the compositional approach without depicting Cockatiel as a message broker.

### Shared model and selected views: C4 / Structurizr

[C4's notation guidance](https://c4model.com/diagrams/notation) explicitly permits
alternative visualizations. [Structurizr dynamic views](https://docs.structurizr.com/dsl/cookbook/dynamic-view/)
reuse model elements and ordered relationship instances for particular scenarios.

**Potential lesson:** identify the same application, policy and dependency across
overview, composition and behavior pictures.
**Limit:** model/view consistency alone does not provide PostCode's evidence,
qualification, correction or exact earlier-answer guarantees. A static dependency
does not establish the behavioral relationship needed by another view.

### Visible behavior: Learnable Programming

[Bret Victor's essay](https://worrydream.com/LearnableProgramming/) demonstrates
representations of flow, state and time that can be inspected and compared,
including context across multiple moments.

**Potential lesson:** show meaningful events and changes, with a timeline or
successive pictures that can be revisited. For Cockatiel, distinguish time passing,
trial eligibility, an actual attempt and its outcome.
**Limit:** these programming-oriented design demonstrations are inspiration, not
validation for humans guiding development without reading code. An illustrative
timeline must not look like an observed execution trace.

### Spatial orientation: software cities

[Wettel and Lanza's CodeCity paper](https://www.cs.kent.edu/~jmaletic/cs69995-PC/papers/Wettle07.pdf)
maps classes to buildings, packages to districts and source metrics to visual
properties, seeking locality and orientation.

**Potential lesson:** recognizable places may help the human return to familiar
parts of a system.
**Limit:** organization and size do not explain purpose or commitments. Lower
priority for this journey: a city could reproduce the earlier tree-navigation
problem with a different metaphor.

### Understandable symbols: visual-notation research

[Moody, Genon, Heymans and Caire, Visual Notation Design 2.0](https://business.uq.edu.au/sites/default/files/events/files/daniel_moody_paper.pdf)
studies interpretation of symbols by novices and their participation in notation
design. The linked manuscript is marked as a draft. Its experiments concern a
requirements notation, not PostCode.

**Potential lesson:** evaluate what intended readers infer, including incorrect
meanings, instead of relying on designer judgments about intuitive icons.
**Limit:** neither these results nor our own familiarity proves that a breaker
symbol will help our audience. Recognizing an object and understanding its software
semantics are different achievements.

### UML and state-based representations: keep a fair comparison

The [OMG UML specification](https://www.omg.org/spec/UML/2.5.1/About-UML)
and [Harel's original statecharts paper](https://www.state-machine.com/doc/Harel87.pdf)
are reference candidates for further focused study, not fully assessed here.
Retain sequence and state diagrams as comparison options. Our preference for
pictorial explanation should not remove useful distinctions between order,
state, transition and condition. Nor does using one such distinction require
adopting an entire notation or teaching its full vocabulary.

## Proposed bounded application

Before an entire picture book, a small comparison could use the same objects in:

1. An overall scene: application, Cockatiel policies and an external dependency,
   making their responsibilities clear.
2. A composition scene: how a breaker and bulkhead affect an attempted operation,
   with waiting capacity distinct from execution capacity.
3. A recovery timeline: current versus proposed behavior, distinguishing
   eligibility from work execution and demonstrated health.

This is an agent recommendation, not a selected exercise. Preserve the dialogue's
knowledge at each point; do not use later understanding as though it were available
earlier. Keep operational state separate from confidence in our account, and
existing behavior separate from proposed behavior.

The main comparison remains strong guided chat with retained notes. Ask what the
person can explain, what useful questions they notice, where they infer something
incorrect, and whether returning to a familiar picture helps. A pleasing picture
or faster route to our known conclusion is not sufficient evidence.

## Remaining PostCode questions

- Which claims and identities need to be retained to support these particular
  views, and which are currently available from PostCode rather than supplied by
  this agent simulation?
- What additional interpretation is necessary before a behavior picture can be a
  Presentation of established results?
- How will a selected earlier picture retain its exact account and qualification
  while newer corrections remain discoverable?
- How can evidence be understood without source literacy, and uncertainty be
  visible without making every picture unreadable?
- Which symbols work across different projects, and where should domain-specific
  pictures or conventional diagrams be used?

The existing [journey dependencies](first-useful-investigation.md) still govern the
exploration's capability assessment. No new canonical model, persistence behavior,
visual language or GUI implementation is selected by this research.

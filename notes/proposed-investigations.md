# Proposed investigations

This note collects proposed named investigations discussed across plans, the questions they would address, and open questions about their subjects or expected results.

PostCode favors a small repertoire whose names help a reader anticipate what asking a question will produce. Proposed operations use working names. The capability reference records which operations and subjects work today. [Design principles](../steering/design-principles.md#named-investigations) · [Supported investigations](../docs/capability-reference.md#interpretive-investigation)

## Architectural questions

| Investigation | Question and expected account | Standing and open choices |
| --- | --- | --- |
| `entity-overview` | What is this entity, what does it do, and how does it fit into the system? An introductory account can identify significant relationships and further questions worth pursuing. | Part of the book model. A reference to an entity can lead to its overview. The existing `summarize` operation gives a terse functional account of one module. An overview’s supported subjects and scope determine which broader questions it can answer. [Book-model investigations](book-model/model.md#investigations) |
| `architecture-concept` | How does a named concept apply to this subject? For state-dependent behavior, describe states, triggers and effects. For responsibility, explain who performs or delegates the work. For interaction, trace what the participants do. | Proposed family. The Cockatiel example uses the policy module as subject, `state-behavior` as concept, and a diagram as a result requirement. Its retained diagram came from the existing `state-behavior` operation. Which concepts, subjects and result forms the family supports remains open. [Cockatiel example](book-model/cockatiel-example.md#underlying-investigation) · [Architectural vocabulary](initial-journey/architectural-concept-references.md#mnemonics) |

## Questions about an account

| Investigation or reader intent | Question and expected account | Standing and open choices |
| --- | --- | --- |
| `explain` | What does this selected passage or finding mean? Clarify the material the reader chose. | Already supported for exact retained content. [Supported investigations](../docs/capability-reference.md#interpretive-investigation) |
| `explain-together` | How do these subjects relate? A reader might select the breaker and bulkhead accounts to understand what a call waits for in each. An investigator could offer the same inquiry as a follow-up. Page composition could also request a joint explanation of a local finding and a broader overview when their connection needs explaining. | This intent could share an investigation with `explain`. Selecting two passages could mean clarifying each or explaining their connection. Pairing an answer with an unevaluated overview also raises the question of how to accept a question as a subject. |
| `elaborate` | What fuller answer can we give to this existing investigation? Investigate further using its current answers, then designate the resulting material on the original query result, preserving alternatives or superseding an earlier designation where warranted. | A later book-model capability. The original page keeps its identity. This aim differs from opening an explanation of a selected passage or supplying additional detail alongside the main answer. [Elaborating the main treatment](book-model/model.md#elaborating-the-main-treatment) |
| `example` | Can you show me a concrete case of this claim? For “calls share breaker state,” trace what happens to successive calls through the same instance. Identify whether the example was found in the codebase or constructed from qualified findings, and state the conditions it relies on. | Candidate reader action. It could be a distinct investigation or an example requested as the result form of another investigation. |
| `page-comparison` | What changed between these two identified treatments? Explain changes attributable to the software, to PostCode’s understanding, or to both, with the basis for each account. | Future candidate. Comparison across repository revisions needs identifiable software inputs. A comparison against stated intent or a hypothetical change would also need that input and its status made explicit. [Page comparison](book-model/future-work.md#page-comparison) |

## Investigations that develop the book

| Investigation | Question and expected account | Standing and open choices |
| --- | --- | --- |
| `page-composition` | How should this underlying investigation and its current answers be presented as a book page? Frame them with a title, orientation, main treatment, additional detail and links. Preserve material qualifications and disagreements when treating multiple answers. | Part of the book model. Composition draws on existing accounts and organization. An underlying architectural question can keep the same page identity as its answers and framing develop. [Page-composition responsibilities](book-model/model.md#page-composition-investigation-responsibilities) |
| `book-organization` | Where does a treatment fit in the developing book? Establish or reuse shared tags, prospective destinations and qualified relationships that help situate it. | Part of the book model. Page composition chooses which links to present. The book-map Lens supplies access to the resolved graph. [Book organization investigation](book-model/model.md#book-organization-investigation) |
| `coverage-planning` | Given a developing reference and an investigative purpose, which topics are well supported and which gaps are worth investigating next? Explain the grounds for proposed work and the limits of the coverage judgment. | Future candidate. Its scope extends beyond finding enough context for a particular treatment. [Coverage planning](book-model/future-work.md#coverage-planning) |

# Reference-book model handoff

These documents describe the reference-book model and investigation contracts to be
built. They provide a design handoff for book-model implementation, without replacing
the governing application specification or prescribing an implementation plan.

PostCode's book presents connected, qualified explanations of software. A page frames
an underlying investigation with orientation, additional detail and routes to related
treatments. The book develops through investigation while preserving the identity of
its pages and the qualifications of its accounts.

This handoff defines the book mechanism. It does not complete the choice or detailed
design of a first useful graphical investigation experience.

## Contents

| Document | Purpose |
| --- | --- |
| [Model](model.md) | Page and component identities, organization, investigation responsibilities and contract changes. |
| [Implementation notes](implementation-notes.md) | Existing mechanisms to build on, implementation choices and presentation/interface considerations. |
| [Future capabilities and related work](future-work.md) | Intended extensions, optional capabilities, candidates and conditional design implications. |
| [Cockatiel example](cockatiel-example.md) | A concrete, authored book treatment grounded in retained generated accounts, diagrams and live-trial records. |

The model and supporting notes carry their rationale without requiring the preceding
discussion. The example depends on its linked validation evidence and distinguishes
that evidence from illustrative book content.

## Implementation boundary

Book-model implementation covers its identified objects, association contracts,
book-map Lens, page-composition investigation, book organization investigation
and entity-overview investigation. Book organization is part of this mechanism; it
does not require constructing a separate architectural model of the repository.

Entity-overview, together with page composition and book organization, provides a
small starting set for exercising the mechanism. Additional specialized architectural
investigations are not prerequisites for that work. Existing operations may be reused
or adapted where they satisfy the contracts. The elaborate investigation remains
optional for the initial implementation.

An initial graphical interface can make it possible to try the book in practice.
Richer architectural investigations can then be developed, starting with the concerns
illustrated in the Cockatiel example. That example describes the intended reach of the mechanism, not a mandatory initial
set of investigations or a scripted acceptance journey.

Detailed implementation planning, interface design and subsequent work selection
remain separate activities. The handoff does not prescribe a migration schedule or
require both the earlier presentation toolbox and the book experience to remain supported.

## Relationship to the adopted design

The [product design](../../foundation/product-design.md),
[application specification](../../docs/app-specification.md),
[core concepts](../../docs/core-concepts.md) and
[architectural constraints](../../docs/architectural-constraints.md) remain governing.
The handoff uses their investigation, investigram, Lens, Projection, View and qualified
association concepts. It defines new book objects and contracts, including uniqueness
for singular page attributes; those additions need the normal design adoption and
implementation process before becoming governing behavior.

The existing Presentation and Expansion machinery is a separate application-design
question. Its possible simplification in a book-only model is recorded in
[future work](future-work.md#presentation-simplification), without changing
foundation or application documents here.

## Evidence and limits

The Cockatiel example uses actual generated state models and diagrams and recorded
follow-up successes and failures. The book organization, page composition and
destinations are authored illustrations. They do not establish that the new book
investigations are implemented, reliable or useful in a graphical interface.

The complete original prose for the main specimen was not preserved. The example's
replacement prose is explicitly authored; it is not evidence that a single substantive
architectural answer needs rewriting by page composition. Practical use of the implemented
book remains necessary to judge the experience.

# Book implementation considerations

The [model](model.md) supplies the contracts. These notes explain existing support and
choices left to implementation and subsequent interface work. They do not prescribe
algorithms, schemas, agent allocation or an implementation plan.

## Starting implementation

Entity-overview, page composition and book organization provide a small starting set
of investigations for exercising the book mechanism. Specialized architectural
investigations, such as those in the [Cockatiel example](cockatiel-example.md), can
follow once the mechanism and an initial interface can be tried. The elaborate
investigation remains optional for the initial implementation.

## Stable and familiar investigations

The book experience is expected to work best with a stable, familiar set of available
investigations, helping readers recognize useful inquiries and encounter consistent
treatments as they explore. A catalogue of architectural-concept investigations could
support this, drawing on established architectural vocabulary. The contents and design
of such a catalogue are outside the book model’s scope; it is one possible approach to
developing the available investigations, not an additional mechanism required by the model.

## Existing mechanisms and integration

### Registration and investigation identity

The current [contribution ledger](../../src/lib/contributions/ledger.ts) separates
question registration from producing an answer. Its invoke operation registers or
reuses an Invocation and Query-result identity without running an agent. The
[evaluation coordinator](../../src/lib/contributions/evaluation.ts) separately reuses
completed work or starts production. Book-model implementation can build on this
separation to establish destination pages before evaluating them; no dummy answer is needed.

Registered requests need resolved subjects and applicable parameters, selected context
and result requirements. Use the existing
[request-equivalence rules](../../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse).
Human-readable titles are not another question identity. An investigation type’s name
does not automatically become an alias of an existing operation; implementation must
determine the mapping while preserving the request's meaning and result contract.

Named responsibilities need not each require a new runtime operation. For example,
entity-overview may build on existing summary capabilities, explain already has a
meaning for selected content, and elaboration may build on existing deeper investigation.
The resulting behavior must satisfy the book contracts rather than merely reuse a name.

### Associations, qualification and updates

PageComposition, PageComponent and BookOrganizationTag are new association-target
categories. Their support extends the existing mechanism; their description in this
handoff is not a claim that current storage or agent tools already accept them.

Singular page attributes must have at most one current value, including when independent
investigations update them. Implementation must handle conflicting updates and enforce
that invariant. Collections may be replaced as complete values or support member-level
additions and withdrawals. No particular conflict policy or collection representation
is selected here.

Page composition acquires the underlying investigation's current answer set and the organizing
context it uses as scopes. That lets the existing needs-reconsideration mechanism detect
relevant additions and displacements. A bare reference or evidence citation is not
acquisition. The normal
[exposure rules](../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration)
apply to producing investigations and their actual input deliveries.

Needs-reconsideration does not itself rerun work or invalidate ordinary reuse. Coordination
must distinguish obtaining revised selected material from requesting new page composition
when interpretation is needed. The preferred experience is automatic updating with
notification; scheduling, retry and interface behavior remain to be designed. Exact
earlier Projections retain their selected material and qualifications.

Broader-context links reference the broader-than relationships they present. Destination
and tag information comes from those relationships, with no duplicate link tags to
maintain. Storage endpoints, relationship access and update mechanics remain implementation
choices. The book-map Lens initially supplies the resolved graph in a qualified
Projection; traversal, grouping and filtering are handled by its Presentation.

### Semantic fidelity

Page composition must faithfully represent the material it frames, including material
alternatives, disagreements and qualifications. Exact source references, qualified input
delivery and structural coverage can be checked mechanically. Such checks cannot prove
that prose preserves every consequential distinction or accurately synthesizes competing
accounts. That remains an interpretive responsibility to support through investigation
instructions and assess through produced examples and use.

Access to a synthesized component's underlying material enables scrutiny. It does not
replace the obligation to represent material alternatives and limitations in the
component itself. Earlier PostCode output remains qualified interpretive material,
not independent repository evidence merely because another investigation consumes it.

### Implementation choices

Implementing the model’s contracts requires decisions about:

- Typed content and association schemas for book objects and collections.
- Operation and result-contract mappings for the predefined investigation types.
- Mechanical, agentic or combined fulfillment, and whether page composition delegates
  individual responsibilities or supplies them in one investigation.
- Organization initialization before or during the first page request, acquisition
  breadth and depth, and reuse of available architectural accounts.
- Coordination of registration, evaluation, retained results, reconsideration and updates.

Failure to obtain the required answer and an answer containing limited findings remain
different outcomes. The latter can be the main treatment; normal attempt and qualified
answer semantics govern the former. No special failure-state model is defined here.

## Existing presentation machinery

Standard expansions are used by current module, organization and dependency paths,
including exports, documentation, module composition and repository-layout information.
Agent evidence access also consumes some of this material. The current concept is
therefore more than unused terminology, even though its organizing abstraction belongs
to the earlier presentation model.

A book-only model may replace or simplify that framework while retaining useful
information-acquisition capabilities. Examine the actual responsibilities and retire
unnecessary machinery; the conditional implication is described in
[future work](future-work.md#presentation-simplification). Whether to preserve a
parallel experience during transition is a separate planning choice.

## Presentation and interface considerations

The following considerations concern application coordination and presentation and
interface work. Their detailed behavior is not specified by the model:

- How page components are arranged, including how additional detail appears and attaches
  to the main content it elaborates.
- How links, labels and previews convey broader and related treatments.
- Whether newly obtained additional detail and previews are selected into a new page
  Projection or coordinated as separate Projections in its View, preserving their
  qualifications and leaving earlier retained results unchanged.
- How perspective selection filters and arranges the book graph and filters a
  page's broader-context links using tags on the corresponding graph relationships.
- How changes to tags and relationships resulting from investigation are
  communicated while preserving the reader's orientation and navigation continuity.
- How pages needing reconsideration are updated and changes communicated, with
  automatic updating and notification as the preferred experience.
- How accessing retained material and requesting material not yet produced can
  offer the same interaction, while communicating pending, partial or unavailable
  results, handling failed investigations for pages or additional detail, and offering retry.
- Selecting material and requesting an explanation on its own investigation page.
- Navigation history, returning to earlier pages and a searchable index of visited
  pages. These are distinct from the book's organizing relationships.
- How scope, basis, qualifications, alternatives and changes in understanding are
  presented, including access to earlier responses.
- How readers can inspect the underlying material when a page component is
  synthesized rather than directly using existing content.

For preview content, the UI can optimistically request ordinary destination
investigations through application coordination and preview the returned material.

## Visual inspiration

The [reference-book examples from the original discussion](../reference-book-inspiration/book-like-postcode.png)
combine book spreads and an index with ideas about entries, cross-references and
supporting detail. They suggest prose and several complementary illustrations around
one subject: an overview, detailed views and annotations can explain different aspects
together. They are visual inspiration, not a prescribed PostCode layout.

## Evaluating the book experience

Evaluate whether readers can enter, navigate and develop architectural understanding
through the reference, beyond completing a sequence of requests. Useful questions include:

- Do the available treatments and connections supply enough context to begin and
  continue investigating without implying comprehensive coverage?
- Can readers recognize unanswered questions and find useful further investigation,
  distinguishing missing material, unsuccessful investigation and established absence?
- Can they move between perspectives, inspect support and alternatives, and return
  to an earlier account without losing their place or mistaking it for current selection?

Continuity and discoverability are the useful hypotheses; literal book-shaped visuals
are not the objective. The framing alone does not demonstrate an advantage over chat.

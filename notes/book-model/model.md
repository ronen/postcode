# Reference-book model

PostCode’s reference-book experience lets readers explore connected
explanations of software. The book develops as
investigations contribute understanding, and further material can be obtained as the
reader explores. Its pages place explanations in context and provide routes to broader,
related and more detailed treatments. The book is a read-only window onto the software,
helping readers understand it for their own work.

This model defines pages, their organization and composition, and the investigations
and contracts that supply them.

We expect the book to be used with a stable, familiar set of investigation types, such
as entity-overview, explain and investigations of architectural concepts. Established
architectural concepts supply a vocabulary suited to each subject, rather than a fixed
template. In this approach, requests identify an investigation type, subject and
applicable parameters.

Algorithms, prompts, allocation among agents, scheduling, storage and wire schemas are
implementation choices. Detailed UI presentation and navigation are subsequent work.
[Implementation notes](implementation-notes.md) collect those considerations; this
model does not prescribe an implementation plan.

## Book organization

The book is organized as a collection of pages with relationships between them. Pages
and relationships can carry **book organization tags** identifying topics or
perspectives useful to the book. The UI can use these tags to present focused
perspectives on the book.

These pages and relationships form a graph rather than a single hierarchy. Relationships
can, for example, identify one treatment as **broader than** another. That relationship
may apply generally or with respect to particular tags, allowing a page to belong to
different broader contexts depending on the topic or perspective.

In contrast, **architectural organization** describes relationships among entities in
the software, such as containment, ownership and dependency, and is outside this
model’s scope. The two can overlap: pages can describe architectural entities and
relationships, and their organization in the book can reflect that structure.

## Page model

A page presents the question and responses of an **underlying investigation** as part of
the reference book. It adds a title, orientation, additional detail, and connections to
broader and related treatments. The underlying investigation determines the page's
identity; other investigations may supply the additional material.

A **page-composition investigation** produces the composition using the existing
investigram mechanism. The `PageComposition` and `PageComponent` objects described below
are targets for its attribute associations. Its contributions therefore participate in
the existing mechanisms for epistemic qualification, revision and **needs-reconsideration**.

A **page-composition Lens** uses this investigation and selects its results into a
qualified Projection of the page's composition and content. Its presentation is a
book-style [View](../../foundation/product-design.md#view).

The page's continuing identity follows the underlying investigation's [existing
identity](../../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse),
which is distinct from a particular execution or response. Responses and compositions
can change while the page remains associated with that investigation.

## Page components and composition

| Component | Summary |
| --- | --- |
| Title | The title of the page. |
| Orientation | An explanation of the frame and distinctions needed to understand the treatment. |
| Main content | The main treatment of the underlying question. |
| Additional detail | A collection of additional material for the current page, or requests to obtain it. |
| Broader-context links | A collection of links to more encompassing treatments. |
| See-also links | A collection of links to other relevant treatments. |

Diagrams are a form of explanatory content, not a separate component role. They can
supply main content, additional detail or contextual explanation; a diagram is not
automatically additional detail.

`PageComposition` and `PageComponent` are identified object categories alongside Entity
and Query result, using the same qualified attribute/association mechanism.

These objects impose an additional constraint: singular attributes have at most one
current value. Initial values can be established; subsequent changes replace or
withdraw them, preserving uniqueness even when investigations update independently.
Qualifications and historical values remain accessible.

Collections can hold items of additional detail, links, tag assignments or graph
relationships. Whether a collection is one value replaced atomically or supports
individual member additions and withdrawals is an implementation choice, as are the mechanisms
for handling conflicting updates while preserving uniqueness for singular attributes.

### PageComposition

A `PageComposition` identifies the composition of a page. Its identity is determined by
the identity of its underlying investigation, and it serves as a node in the book
organization graph. The underlying investigation can be registered without being
evaluated, allowing the `PageComposition` object to be established before that evaluation.
Subsequent investigations supply associations to that same object.

Its qualified attributes supply:

- **Component references:** mappings from component-role keywords such as `title`,
  `orientation`, `main-content`, `additional-detail`, `broader-context` and `see-also` to
  `PageComponent` references.
- **Book organization tags:** assignments referencing `BookOrganizationTag`
  identities and describing the page's participation in book organization.
- **Graph relationships:** assertions identifying a related `PageComposition`,
  the relationship type and any applicable book organization tags. The initial implementation
  supports **broader-than** relationships.

Tag assignments and graph relationships are attributes of `PageComposition`, not
additional `PageComponent` objects. These attributes can be added, superseded or
withdrawn through the association mechanism without changing the page's identity.

### PageComponent

A `PageComponent` supplies material for a page component through its qualified
attributes. Its content type defines the material's structure and schema, using existing
content types where applicable. Its role belongs to the referencing `PageComposition`'s
mapping, so the same component can be used in different roles on different pages. Its
material can be revised through the association mechanism while its identity remains
unchanged.

## Organization graph and perspectives

Broader-than relationships can be qualified by tags: one treatment may be broader than
another with respect to a particular topic or perspective. Relationships without tags
apply across perspectives.

Tags have shared meanings within the book. Book organization and page composition assign
them; the underlying investigator does not. The book organization investigation
maintains the tag set, without a formal distinction between topic and perspective tags.

A **book-map Lens** supplies the resolved book organization graph as a qualified
Projection: its page nodes, tags and relationships, with current associations resolved.
A Presentation makes that graph available through the interface.

Initially, the Presentation handles graph traversal and filtering. For example, the
UI could filter nodes by tags and arrange them
using the applicable broader-than relationships, including untagged relationships
among the selected nodes. Different contexts may have different orderings that cannot
simply be merged. The UI could also filter a page's broader-context links using tags on
the corresponding graph relationships. Selecting a perspective does not change the
page's title, orientation or main content.

## Page-composition investigation responsibilities

The page-composition investigation creates a treatment of the underlying investigation,
framing its accounts in the context of the book organization. It uses supplied
follow-ups, related material and organizational context to form the page. It does not
investigate the software afresh or originate new explanatory investigations. Any text it
authors is derived from existing accounts and book organization.

Page composition acquires the underlying investigation's current answer set and the
book-organization context it uses as scopes, so later additions and displacements can
trigger needs-reconsideration.

Page composition must faithfully represent its source material, preserving material
alternatives, disagreements and qualifications. Any synthesis remains identifiable as
interpretation.

The underlying investigation may supply guidance, such as a title or follow-ups. This is
advisory to page composition.

Links to other pages identify destination investigations, directly or through book
relationships.
If a link is derived from an entity reference, PostCode uses the entity as the subject
of a standard **entity-overview investigation**. A reference to retained content,
including a whole response or a selected part, can supply the subject of an
**explain investigation** or inform page composition's choice of another relevant destination
investigation.

The page-composition investigation's responsibilities follow.

### Tagging and organizing relationships

It consults the book organization and selects appropriate tags from the current set. If
none fit or further tags seem needed, it requests a **book organization investigation**,
supplying the underlying investigation result and an explanation of why existing tags
seem inadequate, optionally suggesting additional tags. It requests organizing work when
available surrounding context is insufficient to situate the treatment, and can
contribute new or revised qualified organizing relationships.

### Title

The investigation chooses a single title for the page. It has the underlying
investigation's suggested title and broader-context information available to it, and can
reuse that title or author one suited to the page's place in the book.

### Orientation

The investigation supplies a unified explanation of the frame and distinctions a reader
needs to understand this treatment, informed by relevant broader treatments. Orientation
typically provides more context than a summary of the answer alone.

### Main content

The investigation produces a unified treatment of the underlying question from all its
current result values. The treatment may include prose, structured explanations and
diagrams. It makes limitations or a lack of substantive findings explicit.
Where there are multiple contributions, interpretation judges whether they can be
combined, should remain alternatives, or have unresolved relationships. Shared ground
and local disagreement can coexist. "Unified" means an intelligible treatment, not
necessarily one agreed conclusion. Sources and qualifications remain identifiable;
the unified treatment does not automatically supersede its inputs.

In the common special case where the underlying investigation's Query result has
**exactly one current associated value** providing a substantive answer, page composition
simply uses its explanatory content directly.

### Additional detail

Candidates for additional detail come from the underlying investigation's response
material: its follow-ups supply requests for further investigation, and its related
material identifies existing content that may elaborate the treatment. The
page-composition investigation decides which material—whether supplied directly or to
be returned by a follow-up investigation—should be included as additional detail on
the current page.
It does not independently invent requests for additional detail. Each item can reference
the part of the main content it elaborates, or concern the treatment as a whole.

### Broader-context links

The investigation supplies a collection of links to more encompassing treatments in the
book organization, potentially from several perspectives. Each link leads to another
investigation's page. Candidates can come from the underlying response's follow-ups,
related material or book organization. Book organization is expected to be the main
source.

For each selected destination, page composition establishes or reuses its
`PageComposition` object and creates or revises the corresponding **broader-than**
relationships, including their applicable tags. It can register a candidate investigation
and establish its destination object before that investigation is evaluated.

Each link references the **broader-than** relationship it presents. Its destination and
applicable tags come from that relationship, so tags need not be duplicated on the link.

### See-also links

The investigation supplies a collection of links to other relevant treatments, without
necessarily asserting a broader/narrower relationship. Candidates come from the
underlying response's follow-ups, related material or book organization. Each link leads
to another investigation's page.

## Book organization investigation

The **book organization investigation** situates treatments within the book and
maintains coherence of its graph and tag set. It responds to organizing needs identified
by page composition. It receives an architectural investigation result and an
explanation of the organizing need, such as why the current tags do not fit well,
suggested additional tags or missing surrounding context. It can consult available
architectural accounts (including the module inventory) and the existing book
organization, and request further software investigations when those accounts do not
provide enough context.

It selects or proposes useful architectural investigations and creates or reuses their
`PageComposition` objects, establishing qualified **broader-than** relationships among
new and existing objects where appropriate. These relationships can be scoped by book
organization tags. It returns suitable existing tags or allocates new ones. Tags
organize existing and potential architectural treatments, rather than classify the
software's entities.

A **`BookOrganizationTag`** is an identified association-target object with a stable
identity and qualified attributes supplying its name and description. Tag assignments on
pages and relationships reference this identity, so renaming a tag does not require
retagging them. These attributes use the same association mechanism as the other
book-level objects.

Wider maintenance is a possible extension: the investigation could revise existing tags
and reassess assignments on other pages or relationships. A reorganization would need to
account for both changed tag meanings and affected assignments; marking assignments for
later reassessment does not establish their suitability under the revised meanings. How
such changes are prepared and made available remains outside the initial organization
contract.

### Starting the organization

When the book has no established organization, the organization investigation can
produce an initial set of tags. Implementation details remain open; one possible
approach is outlined below.

To inform that set, the module hierarchy provides a stable starting point for acquiring
architectural context through software investigations. Guidance could suggest following
result referents upward or obtaining top-level entity overviews, leaving the
investigator to judge the useful breadth and depth of exploration. The hierarchy does
not dictate the book's structure. The same approach can supply missing context as the
book develops.

Entity overviews can identify relevant architectural investigations as follow-ups, using
architectural concepts appropriate to their subjects. These help organization recognize
useful existing and potential treatments. The overviews identify worthwhile questions;
book organization determines their organizing tags.

The first page can therefore acquire useful surrounding context without first
constructing the whole book; later pages develop the same organization.

Where underlying architectural investigations have not yet produced answers, initial
tag assignments and relationships are educated judgments based on the questions and
available architectural context. When those pages are composed using actual answers,
page composition revises these judgments where appropriate through the normal
association mechanism, requesting book organization work where needed.

Other startup arrangements are possible: the agent could prepare an initial set of tags
before the first page request, or a separate initial-organization agent could perform
that work. The choice of timing and division of work is left to implementation and experience
in use.

## Elaborating the main treatment

Elaborating the main treatment can be done within this model through an
**elaborate investigation**. It takes an existing investigation and its current answers
and investigates further to develop the main treatment. It can use the association
mechanism to designate a fuller answer for the original Query result, superseding
earlier designations where warranted or retaining complementary or alternative
contributions. The page keeps its underlying investigation identity.

This differs from additional detail, which supplies material alongside the main
treatment. The elaborating investigation produces the new account; page composition
presents it under the same composition responsibilities.

## Changes and additions to the existing mechanism

The following summarizes the model's object categories, investigation-contract
changes, investigations and Lenses.

### Object categories

- **`PageComposition`:** the identified object whose associations supply a page's
  component references, tags and graph relationships; its identity is a graph node.
- **`PageComponent`:** an identified component of a page.
- **`BookOrganizationTag`:** an identified tag whose name and description are
  qualified attributes, referenced by tag assignments on pages and relationships.

All three use the qualified attribute/association mechanism.

These book-level objects are not normally supplied as context to investigations of the
software, which use repository evidence and relevant architectural accounts. Explicit
investigations of selected page content can receive that content. Book organization and
page-composition investigations normally use both architectural accounts and existing
book-level material, including material produced for other pages.

### Investigation contract changes

| Area | Change |
| --- | --- |
| Response titles | Require a descriptive title associated with an explanatory response, chosen by its investigator. It is available as a suggested page title. |
| Related material | Add optional references to relevant entities, investigations or retained content (including whole responses and selected parts), with an explanation of the connection. These may include a *source selection*. |
| Follow-ups | Require the follow-up's meaning to explain the proposed inquiry's relevance to the current account. Replace `references` with an optional *source selection*. |

For related material and follow-ups, a **source selection** identifies one or more parts
of the reply they concern: content items, addressable components within them, or
association uses. It is distinct from the destination of a related-material link or the
subjects and input context of a follow-up investigation. It can be omitted when the
connection concerns the reply as a whole.

### Investigations

- **Page-composition:** compose the underlying investigation's accounts into a
  page within the book organization.
- **Entity-overview:** provide an introductory account of an entity, serving as
  the underlying investigation for a destination derived from an entity reference.
  It can offer relevant architectural investigations as follow-ups.
- **Book organization:** situate treatments in the developing book, acquiring
  architectural context, establishing surrounding pages and relationships, and
  maintaining the tag set.
- **Elaborate:** develop the main treatment of an existing investigation. This
  capability need not be included in the initial implementation.

Orientation and synthesis of the main treatment are responsibilities of page
composition, not additional investigations.

### Lenses

- **Page-composition:** use the page-composition investigation and select its results
  into a qualified Projection of the page’s composition and content.
- **Book-map:** supply the resolved book organization graph as a qualified Projection,
  initially leaving traversal and filtering to the Presentation.

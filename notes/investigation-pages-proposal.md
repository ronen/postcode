# Reference-book experience: working proposal

Started: 2026-11-22

Status: exploratory proposal for continued human discussion. This consolidates working
agreements from the [SLICE discussion](slice-scope-discussion.md); it is not an adopted
specification, implementation plan or implementation authorization.

## Purpose and remit

We propose a reference-book experience for PostCode: readers explore connected
explanations of software through architectural concepts. The book develops as
investigations contribute understanding, and further material can be obtained as the
reader explores. Its pages place explanations in context and provide routes to broader,
related and more detailed treatments. The book is a read-only window onto the software,
helping readers understand it for their own work. Architectural concepts provide a
vocabulary suited to the subject, rather than a fixed template.

This proposal makes the reference-book experience concrete by defining its pages, their
organization and composition, and the investigations and contracts that supply them.

Algorithms, prompts, allocation among agents, scheduling, storage and wire schemas
belong to INVEST and other subsequent work. Detailed UI presentation and navigation
belong to PRESENT/MINIGUI. These are outside this proposal's remit, not unresolved tasks
for this discussion.

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
proposal's scope. The two can overlap: pages can describe architectural entities and
relationships, and their organization in the book can reflect that structure.

## Page model

A page presents the question and responses of an **underlying investigation** as part of
the reference book. It adds a title, orientation, expansions, and connections to broader
and related treatments. The underlying investigation determines the page's identity;
other investigations may supply the additional material.

**Applying a page-composition Lens to the underlying investigation produces a qualified
Projection of the page's composition and content**, using selected responses and
relevant context. Its presentation is a book-style
[View](../foundation/product-design.md#view).

The page's continuing identity follows the underlying investigation's [existing
identity](../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse),
which is distinct from a particular execution or response. Responses and compositions
can change while the page remains associated with that investigation. When the current
responses, component material or organizational context used by the page change, a new
Projection can be constructed to update the page. Exact earlier results remain
unchanged.

## Page components and composition

| Component | Summary |
| --- | --- |
| Title | The title of the page. |
| Orientation | An explanation of the frame and distinctions needed to understand the treatment. |
| Main content | The main treatment of the underlying question. |
| Expansions | A collection of additional material for the current page, or requests to obtain it. |
| Broader-context links | A collection of links to more encompassing treatments. |
| See-also links | A collection of links to other relevant treatments. |

Diagrams are a form of explanatory content, not a separate component role. They can
supply main content, an expansion or contextual explanation; a diagram is not
automatically an expansion.

`PageComposition` and `PageComponent` are identified object categories alongside Entity
and Query result, using the same qualified attribute/association mechanism.

### PageComposition

A `PageComposition` identifies the composition of a page. Its identity is determined by
its underlying investigation and serves as a node in the book organization graph. The
object can be established before it has any content; subsequent investigations supply
associations to that same object.

Its qualified attributes supply:

- **Component references:** mappings from component-role keywords such as `title`,
  `orientation`, `main-content`, `expansions`, `broader-context` and `see-also` to
  `PageComponent` references.
- **Book organization tags:** assignments referencing `BookOrganizationTag`
  identities and describing the page's participation in book organization.
- **Graph relationships:** assertions identifying a related `PageComposition`,
  the relationship type and any applicable book organization tags. The first slice
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

A **follows-up-from** relationship is a candidate to validate, not a first-slice
requirement. It would point from a follow-up page to the page that offered its
investigation. This might help organizing investigations understand why an inquiry
arose, but its value beyond existing retained follow-up information is unproven.

Tags have shared meanings within the book. Book organization and page composition assign
them; the underlying investigator does not. The book organization investigation
maintains the tag set, without a formal distinction between topic and perspective tags.

Tags support UI presentation of focused perspectives over the graph supplied in
qualified Projections. For example, the UI could filter nodes by tags and arrange them
using the corresponding broader-than partial ordering, including untagged relationships
among the selected nodes. Different contexts may have different orderings that cannot
simply be merged. The UI could also filter a page's tagged broader-context links by the
selected perspective. This is a presentation choice, not an investigation parameter; it
does not change the page's title, orientation or main content.

## Page-composition investigation responsibilities

The page-composition investigation creates a treatment of the underlying investigation,
framing its accounts in the context of the book organization. It uses supplied
follow-ups, related material and organizational context to form the page. It does not
investigate the software afresh or originate new explanatory investigations. Any text it
authors is derived from existing accounts and book organization.

It consults the book organization and selects appropriate tags from the current set. If
none fit or further tags seem needed, it requests a **book organization investigation**,
supplying the underlying investigation result and an explanation of why existing tags
seem inadequate, optionally suggesting additional tags. It requests organizing work when
available surrounding context is insufficient to situate the treatment, and can
contribute new or revised qualified organizing relationships.

The underlying investigation may supply guidance, such as a title or follow-ups. This is
advisory to page composition.

Links may identify an entity rather than an investigation. In that case, PostCode uses
the entity as the subject of a standard **entity-overview investigation**. Its page
follows the same model as any other investigation's page.

The page-composition investigation's responsibilities for each page component follow.

### Title

The investigation chooses a single title for the page. It has the underlying
investigation's suggested title and broader-context information available to it, and can
reuse that title or author one suited to the page's place in the book.

### Orientation

The investigation supplies a unified explanation of the frame and distinctions a reader
needs to understand this treatment, informed by relevant broader treatments. Orientation
typically provides more context than a summary of the answer alone.

### Main content

The investigation supplies the main treatment of the underlying question. It may include
prose, structured explanations and diagrams.

Main content comes from the underlying investigation's current result values.
Composition does not promote follow-ups or related-material candidates into main
content; those supply candidates for expansions or links.

If the underlying investigation's Query result has **one current associated value**, use
its explanatory content directly.

With **multiple current values**, interpretation produces a coherent joint treatment,
judging whether contributions can be combined, should remain alternatives, or have
unresolved relationships. Shared ground and local disagreement can coexist. "Unified"
means an intelligible treatment, not necessarily one agreed conclusion. Sources and
qualifications remain identifiable; the joint treatment does not automatically supersede
its inputs.

### Expansions

Expansion candidates come from the underlying investigation's response material: its
follow-ups supply requests for further investigation, and its related material
identifies existing content that may elaborate the treatment. The page-composition
investigation decides which material—whether supplied directly or to be returned by a
follow-up investigation—should be included as additional material on the current page.
These are the page's expansions. It does not independently invent expansion requests. An
expansion can reference the part of the main content it elaborates, or concern the
treatment as a whole.

### Broader-context links

The investigation supplies a collection of links to more encompassing treatments in the
book organization, potentially from several perspectives. Each link leads to another
investigation's page. Candidates can come from the underlying response's follow-ups,
related material or book organization. Book organization is expected to be the main
source.

Links can carry book organization tags so presentation can filter them by the selected
perspective. Untagged links apply across perspectives.

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

It identifies useful architectural investigations and creates or reuses their
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
produce an initial set of tags. Implementation details are left to INVEST; one possible
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

Alternatively, the agent could prepare an initial set of tags before the first page
request, or a separate initial-organization agent could perform that work. The choice of
timing and division of work is left to INVEST and experience in use.

## Elaborating the main treatment

Elaborating the main treatment can be done within the proposed mechanism through an
**elaborate investigation**. It takes an existing investigation and its current answers
and investigates further to develop the main treatment. It can use the association
mechanism to designate a fuller answer for the original Query result, superseding
earlier designations where warranted or retaining complementary or alternative
contributions. The page keeps its underlying investigation identity.

This differs from an expansion, which supplies additional material alongside the main
treatment. The elaborating investigation produces the new account; page composition
presents it under the same composition responsibilities.

## Proposed changes and additions

These inventories summarize the proposal's object categories, investigation-contract
changes and new investigations.

### Object categories

- **`PageComposition`:** the identified object whose associations supply a page's
  component references, tags and graph relationships; its identity is a graph node.
- **`PageComponent`:** an identified component of a page, reusable across
  compositions.
- **`BookOrganizationTag`:** an identified tag whose name and description are
  qualified attributes, referenced by tag assignments on pages and relationships.

All three use the qualified attribute/association mechanism.

These book-level objects are not normally supplied as context to investigations of the
software, which use repository evidence and relevant architectural accounts. Explicit
investigations of selected page content can receive that content. Book organization and
page-composition investigations normally use both architectural accounts and existing
book-level material, including material produced for other pages.

### Investigation contract changes

| Area | Proposed change |
| --- | --- |
| Response titles | Require a descriptive title associated with an explanatory response, chosen by its investigator. It is available as a suggested page title. |
| Related material | Add optional references to relevant entities, investigations, answers or selected content, with an explanation of the connection. These may include a *source selection*. |
| Follow-ups | Require the follow-up's meaning to explain the proposed inquiry's relevance to the current account. Replace `references` with an optional *source selection*. |

For related material and follow-ups, a **source selection** identifies the part of the
reply they concern: a content item, an addressable component within it, or an
association use. It is distinct from the destination of a related-material link or the
subjects and input context of a follow-up investigation. It can be omitted when the
connection concerns the reply as a whole.

### Investigations

- **Page-composition:** compose the underlying investigation's accounts into a
  page within the book organization.
- **Entity-overview:** provide an introductory account of an entity, serving as
  the underlying investigation when a link identifies that entity. It can offer
  relevant architectural investigations as follow-ups.
- **Book organization:** situate treatments in the developing book, acquiring
  architectural context, establishing surrounding pages and relationships, and
  maintaining the tag set.
- **Elaborate:** develop the main treatment of an existing investigation. This
  capability need not be included in the first slice.

Orientation and joint treatment of multiple responses are responsibilities of page
composition, not additional proposed investigations.

## UI concerns outside this proposal

The following considerations are recorded for future UI work, rather than resolved by
this proposal:

- How page components are arranged, including how expansions appear and attach
  to the main content they elaborate.
- How links, labels and previews convey broader and related treatments.
- How perspective selection filters and arranges the book graph and filters a
  page's broader-context links using book organization tags.
- How accessing retained material and requesting material not yet produced can
  offer the same interaction, while communicating pending, partial or unavailable
  results.
- Selecting material and requesting an explanation on its own investigation page.
- Navigation history, returning to earlier pages and a searchable index of visited
  pages. These are distinct from the book's organizing relationships.
- How scope, basis, qualifications, alternatives and changes in understanding are
  presented, including access to earlier responses.
- Prose-directed access that principally opens or develops relevant treatments.
  This is an intended capability that may follow the basic book experience.

For preview content, the UI can optimistically request ordinary destination
investigations through application coordination and preview the returned material.
An alternative mechanism for producing previews is a candidate capability, not a
first-slice requirement.

## Evidence and limits of the example

The [Cockatiel exercise](cockatiel-page-composition-exercise.md) grounds the discussion
in actual generated state models, diagrams and recorded live follow-ups. It
distinguishes those outputs from authored composition and proposed destinations, and
keeps the older authored journey's revision separate. The walkthrough illustrates the
current object and organization model, including offered expansions and optimistic
preview requests, without claiming that the book mechanisms have been implemented.

The committed state-model text is not a full explanatory response. The operation already
asks for prose, and live records document prose alongside models; the particular
original prose was not available in the preserved specimen used here. The exercise's
authored main explanation therefore compensates for missing evidence, not a demonstrated
need to rewrite every underlying response.

This proposal does not establish content correctness, reliable composition or usefulness
through human use. Concrete examples can reveal contract gaps without prescribing future
inference outcomes or a fixed Cockatiel journey. No complete investigation catalogue,
formal study, detailed UI or implementation is required to review and refine this
proposal.

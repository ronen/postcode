# Future capabilities and related work

Suggested future work after implementation of the core book-model mechanism.

## Investigation capabilities

### Architectural vocabulary

A maintained, lightly structured vocabulary could connect related concepts and provide
access to reference works for investigating agents, without imposing a fixed explanatory
template. The [architectural concept
references](../initial-journey/architectural-concept-references.md) provide a starting
point.

### Further architectural investigations

Develop further architectural investigations, starting with those illustrated in the
[Cockatiel example](cockatiel-example.md).

### Elaborating an answer

The [elaborate investigation](model.md#elaborating-the-main-treatment) fits the model
but need not be part of the initial experience.

### Prose-directed access

Prose would principally open or develop relevant book treatments, with a brief reply
where useful.

For example, “write me a chapter on this” could request a coherent treatment of an
architectural concern, later deepened or approached from another perspective. It
need not promise exhaustive coverage or unbounded investigation. Collecting existing
material and producing a new qualified synthesis are distinct kinds of work.

### Conveying a reader’s objection

Let a reader convey what seems wrong or missing in an account to an investigator,
so further investigation can address the specific concern. Current inadequacy feedback
records the reader’s experience; retrying an investigation does not convey that objection.

## Organization and navigation

### Focused book maps

Graph traversal and filtering initially belong to the Presentation of the book-map
Projection. As experience clarifies which operations belong to core book organization
and which are UI manipulations, the core operations could move into the book-map Lens,
with parameters where appropriate.

### Chapters and sections

Agents could group related pages into chapters and chapters into sections, author
introductory material, and apply book organization tags to the groups. Multiple
groupings could coexist. Presentation can derive some arrangements from the graph;
interpreted groupings could explain why complementary treatments belong together. Their
representation remains open.

### Organization for an investigative purpose

Organization could provide groupings, entry points and reading paths tailored to a
stated investigative purpose. This goes beyond filtering an existing graph by topic
or perspective: it would judge which treatments and connections help with that purpose,
without making their editorial placement a claim about the software's structure.

### Coverage planning

An investigation could identify worthwhile topics or gaps and propose further work
across the developing reference. This requires judgments about relevance and sufficiency
beyond obtaining enough surrounding context for one page. Missing material does not
establish that the corresponding behavior is absent; recognizing a relevant gap or
claiming adequate coverage itself requires qualified investigation.

### Investigator contributions to organization

The existing [candidate for investigator contributions to reference organization](../../steering/candidate-capabilities.md#investigator-contributions-to-reference-organization)
explores supplying a framework to an underlying investigator so it can suggest placement,
cross-references or new entries. This could complement dedicated organizing investigations.

### Follows-up-from relationships

A relationship from a follow-up page to the page that offered its investigation might
help organizing investigations understand why an inquiry arose. Its value beyond
existing retained follow-up information is unproven.

### Wider reorganization

Reassessing shared tag meanings and affected assignments across the book goes beyond the
initial [book organization contract](model.md#book-organization-investigation).

### Alternative preview production

Ordinary destination investigations can supply previews initially through optimistic
pre-evaluation. A separate mechanism could produce previews more selectively or
efficiently.

## Continuity and change

### Persistence and changing repository inputs

Continuing a book across sessions or following changes to its software inputs is not
established by this model. Sharing a developing book across users remains an unselected
possibility.

### Page comparison

A comparison investigation could explain changes in software, changes in PostCode's
understanding, or both, using identified earlier accounts and bases. Following or
pinning changing software inputs remains a future design choice.

## Simplifying existing mechanisms

### Presentation simplification

In a book-only model, independently selected Presentations and the existing Expansion
mechanism would no longer define the experience. Examine existing presentation
mechanisms, including the standard-expansion framework, and retire unnecessary parts.

### Architectural investigation and Lens consolidation

As the vocabulary-based approach develops, some existing architectural investigations
and Lenses may be retired in favor of it. Review which capabilities the new approach
covers and which remain useful as distinct investigations or Lenses.

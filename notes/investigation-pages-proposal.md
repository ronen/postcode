# Investigation pages: working proposal

Started: 2026-11-22

Status: exploratory proposal for continued human discussion. This consolidates
working agreements from the [SLICE discussion](slice-scope-discussion.md); it is
not an adopted specification, implementation plan or implementation authorization.
Open contract questions are stated where they arise. Proposed contract sketches
are starting points for discussion, not additional agreements inferred from the
existence of this document.

## Purpose and remit

We propose a reference-book experience for PostCode: readers explore connected
explanations of software through architectural concepts. The book develops as
investigations contribute understanding, and further material can be obtained as
the reader explores. Its pages place explanations in context and provide routes
to broader, related and more detailed treatments.

This proposal defines what a **page** of that book consists of: its content and
composition, the investigations that supply them, and their contracts. How the
page is presented is outside its scope.

Algorithms, prompts, allocation among agents, scheduling, storage and wire schemas
belong to INVEST and other subsequent work. Detailed UI presentation and navigation
belong to PRESENT/MINIGUI. These are outside this proposal's remit, not unresolved
tasks for this discussion. The investigation boundary can hide mechanical,
agentic or mixed fulfillment; naming a responsibility does not require a separate
agent, operation or execution phase.

## Working page model

A page presents the question and responses of an **underlying investigation** as
part of the reference book. It adds a title, orientation, expansions, and connections
to broader and related treatments. The underlying investigation determines the
page's identity; other investigations may supply the additional material.

**A page composition is the qualified result of applying a page-composition Lens
to the underlying investigation, using the selected responses and relevant context.**
It identifies the material for each page component. Its
presentation is a book-style [View](../foundation/product-design.md#view).

The page uses the underlying investigation's
[existing identity](../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse),
which is distinct from a particular execution or response. Responses and
compositions can change while the page remains associated with that investigation.
Exact earlier material remains distinguishable.

## Page components

We propose **`PageComposition`** and **`PageComponent`** as categories of identified
object alongside Entity and Query result, using the same qualified
attribute/association mechanism. A `PageComposition`'s identity is determined by
its underlying investigation. Its qualified attributes map component-role keywords
such as `title`, `orientation`, `main-content`, `expansions`, `broader-context` and
`see-also` to `PageComponent` references. Components can be reused across compositions.

### Title

A single title for the page. It may be supplied by the underlying investigation
or authored for the page based on that investigation and its broader context.

### Orientation

A unified explanation of the frame and distinctions a reader needs to understand
this treatment. Relevant broader treatments can inform it; it is not merely a
summary of the answer.

### Main content

The main treatment of the underlying question. It may include prose, structured
explanations and diagrams.

With a **single account**, use its explanatory content directly. Composition
still supplies the page's other parts and selects their relationships; it need
not rewrite an adequate explanation to turn it into a page.

With **multiple accounts**, interpretation produces a coherent joint treatment,
judging whether contributions can be combined, should remain alternatives, or
have unresolved relationships. Shared ground and local disagreement can coexist.
"Unified" means an intelligible treatment, not necessarily one agreed conclusion.
Sources and qualifications remain identifiable; the joint treatment does not
automatically supersede its inputs.

Here, "account" remains an informal term for explanatory material, not a new
aggregate record. The intended count concerns selected explanatory answers, not
the number of content items or investigrams. The precise input population for
this policy is an open contract detail. Interpretation that cannot establish a
relationship must preserve that uncertainty rather than manufacture agreement.
Its output should not inadvertently become an additional peer input triggering
unending synthesis; its role in composition must be explicit.

### Expansions

A collection of additional material to expose on the same page, or requests to
obtain it. An expansion can reference the part of the main content it elaborates,
or concern the treatment as a whole.

An expansion's reference to main content identifies what it elaborates. It is
part of the content contract; its visual attachment or placement is a UI choice.

### Broader-context links

A collection of links to more encompassing treatments, potentially from several
perspectives. Each link leads to another investigation's page.

### See-also links

A collection of links to other relevant treatments, without necessarily asserting
a broader/narrower relationship. Each link leads to another investigation's page.
Relevance, rather than whether a result has already been produced, determines
this role. A link needs a destination investigation, or enough information to
resolve one.

## Connections and lazy content

Selecting material and requesting explanation starts an investigation about that
selection, with its own page, or revisits its identified retained treatment.

Composition decides expansion versus another page. Hints from the underlying
investigator are advisory. The distinction does not follow merely from a label
such as "explain", the presence of a diagram, or whether the material exists yet.

From the reader's perspective, exposing content can be the same action whether
it uses retained results or requires investigation. An offered destination can
be evaluated lazily. Its request meaning and qualification must be sufficiently
identified; an offered picture is not an already fulfilled picture. Missing,
partial and unavailable information retain those meanings.

Prose-directed access is an intended capability whose implementation may follow
the basic book. Its purpose is principally to open or develop relevant treatments.

Current **follow-up options** package qualified executable requests, not page
placement decisions. They can support expansions or other-page destinations.
When a link or selection calls for a page about an entity, the proposal supplies
a standard **entity-overview investigation** applied to that entity. Its page
follows the same model as any other investigation's page. An exact historical
answer remains a different selection from a page's current response material.

Connections between originating and follow-up treatments belong to the reference
structure, distinct from the reader's navigation history. Detailed navigation,
searchable visited-page indexes, labels and preview display are outside this remit.

## Investigation contract sketches

These distinguish responsibilities. They do not yet select which responsibilities
need independent queries or which can be fulfilled within another investigation.

### Underlying investigation

**Purpose:** answer a particular architectural question about identified subjects.

Architectural concepts supply a vocabulary appropriate to the subject rather
than a fixed explanatory template. PostCode supplies understanding that readers
can use in their work; it does not take responsibility for solving their task.

**Inputs:** subjects, question/parameters, applicable basis and relevant selected
context under that investigation's contract.

**Supplies:** qualified explanatory response material with a descriptive title,
required structured content, and supported optional leads such as follow-ups or
see-also references. A diagram requirement needs appropriate semantic content;
rendering cannot reconstruct omitted meaning.

**Open:** what common expectations should all book-facing investigations meet,
beyond their specific content contracts? What information must a lead carry so
composition can interpret and preserve its relationship to the response?

### Entity overview

**Purpose:** introduce an identified entity and the useful understanding available
about it. This is the standard investigation for opening a page about an entity.

**Inputs:** the entity and applicable context/basis.

**Supplies:** a qualified overview response. Existing associated information can
support it; the Entity's identity record alone is not the explanation.

**Open:** what makes an overview sufficient? Which identification, explanatory
and relationship information belongs in it, and what does it supply when little
is known? What lets an entity reference unambiguously select this investigation?

### Page composition

**Purpose:** the page-composition Lens requests a coherent book treatment of the
underlying investigation. Its fulfillment can use other investigations without
prescribing a separate producer or execution for every component.

**Candidate inputs:** the underlying investigation and its selected responses,
available component material and hints, and relevant organizational context.

**Supplies:** qualified composition identifying the page components, their source
material, roles, expansions and destinations. It owns the decision about expansion
versus another treatment and applies the [main-content policy](#main-content).

**Open:** which inputs must be supplied versus requested through other contracts?
What exactly is selected when several current accounts exist? What can the
composition return when context or interpretation is incomplete? Which changes
make an existing composition require reconsideration, as a semantic dependency
question rather than a scheduling policy?

### Orientation and guidance

**Purpose:** make the current treatment intelligible in its broader context and
identify useful material for understanding or continuing from it.

**Candidate inputs:** the treatment, its scope and qualifications, relevant broader
treatments, and supplied links/leads.

**Candidate outputs:** qualified orientation, relevance explanations, previews
and proposed connections or investigations. Finding useful connections can also
contribute information to organization; the relationship need not be one-way.

**Open:** is this a distinct investigation, several investigations, or part of
composition's result contract? How do we distinguish required local orientation
from optional broader guidance without requiring a separate execution for each?
What is meaningful when no broader treatment is yet available?

### Reference organization / framework

**Purpose:** relate explanatory treatments into a useful developing reference.

The framework organizes explanations, not necessarily architectural entities.
Broader/narrower, complementary and other reference relationships do not imply
software containment, ownership or dependency. This does not require constructing
a comprehensive architectural organization of the codebase first.

**Candidate inputs:** identified investigations and qualified responses, with
other repository/entity information as appropriate to the question. A mechanical
inventory is a possible starting population, not the architectural framework.

**Candidate outputs:** qualified relationships and entry treatments usable by
composition and orientation, potentially across several organizational perspectives.
Broader/narrower relationships may support a partial ordering, while other links
have different meanings. More detail is not automatically narrower scope.

**Open next:** what exact information does the framework promise its consumers?
Can its population include investigations whose responses do not exist yet?
Do relationships attach to investigations, exact responses, or distinguish both?
What scope/coverage does a partial framework claim? These are contract questions;
the algorithm for discovering a useful organization is not part of this proposal.

### Joint treatment of multiple accounts

**Purpose:** fulfill the multiple-account policy through qualified interpretation.

**Inputs:** identified selected accounts and their scope, basis and qualifications.

**Supplies:** a treatment preserving meaningful agreement, complementary content,
alternatives and unresolved relationships, with attributable use of the inputs.

**Open:** is this a separate investigation or a responsibility within composition?
What is the result contract when no useful reconciliation/comparison is established?
What qualifies as a single versus multiple account input to this responsibility?

## Evidence and limits of the example

The [Cockatiel exercise](cockatiel-page-composition-exercise.md) tests these ideas
against actual generated state models, diagrams and recorded live follow-ups.
It explicitly distinguishes those outputs from authored composition and proposed
destinations, and keeps the older authored journey's revision separate.

The committed state-model text is not a full explanatory response. The operation
already asks for prose, and live records document prose alongside models; the
particular original prose was not available in the preserved specimen used here.
The exercise's authored main explanation therefore compensates for missing evidence,
not a demonstrated need to rewrite every underlying response.

This proposal does not establish content correctness, reliable composition or
usefulness through human use. Concrete examples can reveal contract gaps without
prescribing future inference outcomes or a fixed Cockatiel journey. No complete
investigation catalogue, formal study, detailed UI or implementation is required
to continue resolving these contracts.

## Next discussion

Start with **reference organization's output contract**, using the example's
broader-context needs. Then determine its relationship to orientation/guidance and
composition, followed by the entity-overview and multiple-account details. This
is a suggested discussion order, not an implementation pipeline.

Keep this document as the concise current proposal, use the discussion notes for
rationale and alternatives, and update the exercise when a concrete example helps
resolve a contract. Further exploration can revise the proposal; drafting it does
not freeze the model.

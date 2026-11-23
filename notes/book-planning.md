# Initial book capability: planning guidance

BOOK plans and implements the initial reference-book capability, including the core
model, supporting investigations, application access, and associated migration and
retirement work. Graphical presentation and interaction are out of scope. See the
[BOOK steering entry](../steering/upcoming-work.md#book) for current scope and sequencing.

The [book-model handoff](book-model/README.md) supplies the proposed model,
investigation contracts, examples and detailed implementation considerations.

This note records a proposed approach to BOOK and considerations to carry into
planning. The planning process may reveal reasons to revise that approach.

## Initial capability

Start with entity-overview, page composition and book organization, together with
the page-composition and book-map Lenses. These should provide connected, qualified
book content through the application API, using and extending the implemented
structured-account mechanism.

The book model is the central idea to exercise. The
[Cockatiel example](book-model/cockatiel-example.md) is illustrative, not required
implementation scope, in whole or in part. Specialized architectural investigations
can follow BOOK implementation. Bring a bounded investigation
forward if its absence prevents meaningful evaluation of the book.

## Planning outcome

Develop the implementation plan, consequential decisions and coordinated revisions
to the application specification and governing architecture together. Include the
migration needed to deliver the adopted behavior; make any temporary conformance
gaps explicit and account for them in the plan.

Use the [model](book-model/model.md) and
[implementation considerations](book-model/implementation-notes.md) as inputs to
that work. The handoff does not itself adopt new governing contracts.

## Implementation steps

Plan small, verifiable milestones within the coherent book capability, exercising
a working path through the book early. Include architectural changes and retirement
that make the current step sound or materially simplify or enable the next step.
Defer cleanup that can wait without spreading debt or forcing duplicate mechanisms;
it may belong in a later milestone rather than outside BOOK altogether.

Intermediate milestones may knowingly break existing capabilities while their
restoration, adaptation or deliberate retirement waits for a later milestone.
Identify the expected breakage and its planned resolution, and distinguish it from
unexpected regressions. Verify each milestone against its intended scope, retaining
enough working infrastructure to test that step, including live trials where needed.
Final integration must account for every affected capability. Temporary compatibility
machinery is not required solely to keep every intermediate commit fully functional.

## Existing presentation and expansion machinery

Assess the existing responsibilities and mechanisms as **keep, adapt, replace or
remove**. Distinguish useful acquisition, qualification and exact-result behavior
from the particular machinery that currently supplies it.

Include replacement and retirement in BOOK where appropriate. Needed responsibilities
must have working support at final integration, allowing the planned intermediate
breakage described above. Do not assume a lasting reconciliation layer between two
presentation systems. Git history provides a recovery route for removed machinery.

Identify work deferred out of BOOK, with the reason and any dependencies or trigger
for revisiting it. Assigning that work to later items belongs to steering.

## Existing architectural investigations and Lenses

Include existing architectural investigations and Lenses in the assessment, following
the handoff's [consolidation direction](book-model/future-work.md#architectural-investigation-and-lens-consolidation).
Determine which remain useful as distinct capabilities, which should change or be
consolidated into the book's investigations, and which can be retired. Distinguish
retiring an entry point from losing useful investigative behavior or supporting analysis.

Apply the same milestone discipline: make changes that support the initial book path
or remove duplication it would otherwise inherit, and defer independent consolidation
where appropriate. This assessment does not require implementing a broad architectural
investigation catalogue within BOOK. Record deliberate capability retirements alongside
adaptations and replacements so final integration has a clear target.

## CLI and development access

Presentation retirement and CLI retirement are connected: removing machinery that
the CLI depends on may require adapting or retiring affected commands or the
interactive shell. Trace those dependencies during BOOK planning rather than
preserving compatibility by default.

A simpler development CLI could exercise the book-model application boundary for
live trials and diagnosis: submit requests, report progress and failures, and output
qualified structured results and references. It need not reproduce book navigation
or preserve the current commands and human-facing presentation system.

Assess whether adapting the current CLI or replacing it with a small development
runner is simpler. Retiring the CLI as a product interface need not discard useful
execution, authentication or reporting components. Preserve practical access for
development and validation through the transition, without requiring the existing
interactive shell to survive.

## Core coordination

BOOK supplies qualified page content, organization and core coordination. Its
planning should resolve obtaining surrounding context and updating composition as
the accumulated accounts change. Automatic updating may require implementing the
deferred [reassessment and reconsideration-cause clearance](../docs/backlog.md#reassess-contributions-and-clear-specific-reconsideration-causes)
capability, together with coordination that initiates that work. The existing
needs-reconsideration mechanism identifies concerns; fresh investigation alone
does not resolve them. Assess and implement what pages need, including the case
where reassessment finds that existing material remains appropriate. That may
require the broader mechanism rather than a page-specific subset; determine the
scope during planning.

Expose qualified results through the application API without requiring clients to
perform interpretation. Persistence and support for changing repository inputs
remain separate scope choices.

## Validation

Exercise generated overviews, organization and composition through connected pages,
including qualifications, alternatives and revisions. The authored example can
guide validation without hard-coding its pages or relationships. Check that the
returned content contains the meaning needed for faithful presentation.

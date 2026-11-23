# SLICE scope discussion

Started: 2026-11-20

Working notes for [SLICE](../steering/upcoming-work.md#slice), explicitly identified
by the human as the subject of this discussion. These record evidence, proposals
and unresolved choices. Scope remains in development; the directions established
in discussion are identified below. No implementation plan has been accepted.

The human requested discussion of the first useful graphical investigation
experience, using actual structured-account outputs alongside the authored journey,
with working notes here and a plan only after scope has been worked out.

The [investigation-pages proposal](investigation-pages-proposal.md) now collects
the current model and contract sketches for continued discussion. This file keeps
the exploratory rationale and evolution; the [Cockatiel exercise](cockatiel-page-composition-exercise.md)
provides the concrete specimen. The proposal does not promote these notes into
governing material or authorize implementation.

## Current scope checkpoint

This checkpoint distinguishes working directions established in discussion from
capability hypotheses and unresolved boundaries. It is not a formal adopted
specification, approved plan or implementation authorization.

Main's steering clarification (`0ac52c0`, 2026-11-21) was read directly from
`main:steering/upcoming-work.md`. SLICE selects scope and identifies necessary
work; it does not implement the experience and need not have its own implementation
plan. New or modified investigations belong to conditional INVEST work, potentially
several plans, ahead of presentation work dependent on their content. ORGANIZE
supplies selected reference organization; PRESENT and MINIGUI handle detailed
presentation and interface work. This discussion can identify page/guidance and
follow-up information needs without selecting their implementation here. The
human's preference for general book capabilities, representative testbeds and
initial exploratory use remains the discussion's direction; this update does not
reintroduce a fixed scripted journey as a prerequisite. No steering file was edited.

### Evolved remit: page model and investigation contracts

The human clarified the evolved remit on 2026-11-22: clarify **a page as a View
of an investigation**, its decomposition into component parts and investigations,
and the **contract of each investigation**. How those investigations fulfill
their contracts belongs to INVEST and other subsequent work. This clarification
controls how the earlier broader scope questions in these notes should be read;
they are not all unfinished obligations of this discussion.

The intended result is a coherent conceptual model and sufficient semantic
contracts to explain what each investigation supplies and how the pieces fit.
Contracts can identify the question/purpose, required subjects and context,
qualified output and relationships, and the meaning of incomplete or unavailable
results. They need not prescribe wire schemas, algorithms, prompts, agent
allocation, acquisition/scheduling strategy or detailed presentation. A boundary
may accommodate mechanical, agentic or mixed fulfillment. Responsibility for
supplying information is distinct from prescribing which agent produces it.

Continue by identifying which responsibilities need independent investigation
contracts and which can be satisfied by supplied components within another result.
The working candidates include the underlying investigation (including entity
overview), page composition, orientation/contextual guidance, book organization,
and interpretation of multiple accounts. This is not a decision to require a
separate operation or execution for every named component. Expansions, see-also
and broader-context relationships need clear meanings and target/input references;
their production and UI realization remain outside this task's remit.

### Directions established

- PostCode helps people understand the software through qualified architectural
  accounts. Their motivating task can focus attention; solving that task or
  choosing a design direction is not the required endpoint.
- Explore the magic-reference-book content concept: coherent explanations,
  surrounding context, substantive related-topic previews and open-ended routes
  through a developing reference. The magic is adaptation and continued
  exploration, not universal answerability or exhaustive existing knowledge.
- People may enter with a concrete purpose and no project knowledge. Direct
  lookup and gaining surrounding context can happen together; no mandatory
  overview-first sequence has been selected.
- Architectural concepts supply an extensible vocabulary, not a template. Useful
  concepts depend on subject and context. Investigations can identify relevant
  concepts and then examine a subject through a selected concept, including
  reporting ambiguity or inadequate evidence.
- Selection, search, standard investigations and offered connections are the
  initial interaction direction. Exact parts of retained accounts can be subjects.
  The operation catalogue, including challenge behavior, remains to be selected.
- Prose-directed access is an intended capability: primarily open or develop the
  relevant book accounts, with a brief reply where useful. Its implementation
  can follow the basic book features. Prose exclusion is not a permanent principle.
- Organization need not produce one hierarchy; several perspectives can coexist
  even for one reader and topic. A default route may depend on the codebase.
- Select a content concept plausibly useful under plain competent presentation;
  detailed UI design and an interactive prototype are not prerequisites to scope
  discussion. Actual use will still be needed to establish usefulness.

### Supporting hypotheses, not yet specified capabilities

- A lightly structured vocabulary, drawing on agent knowledge and accessible
  reference works, may improve concept selection, explanations and guidance.
- PostCode can anticipate useful neighboring topics and produce previews without
  a separate explicit request for each. One investigation may supply several.
- Some reader-independent organization beginning with the mechanical inventory
  may provide a stable footing for interpretation. The inventory itself is not
  the architectural organization, and repeated interpretation need not be identical.
- Shared higher-level accounts may provide common landmarks across reading routes.
  Their adequacy and the appropriate degree of convergence remain to be tested.

### Page-model checkpoint and remaining scope questions (2026-11-22)

The accumulated discussion now supplies a working page model: a book-style View
identified by its **underlying investigation**, with qualified response material
and composition. The template comprises title, orientation, main content with
expansions, broader-context links and see-also links. Investigations supply
descriptive response titles; composition may choose its own page title. The
current main-content policy proposal reuses a single account and calls for
interpretation to produce a coherent treatment of multiple accounts while keeping
alternatives and unresolved relationships distinguishable. Qualification belongs
to components and composition, with presentation deferred.

Composition owns expansion versus other-page placement, informed by advisory
investigator hints. Expansions belong conceptually to the current page; broader
context and see-also lead to other pages. Selecting content and requesting
explanation starts another investigation/page. Content can be retained or lazily
obtained through the same book interaction. Entity pages use an entity-overview
investigation. Whether overview, guidance, organization or composition is
mechanical, agentic or mixed remains behind the investigation boundary.

The assistant's current assessment of the substantive remaining scope questions:

This list preceded the subsequent evolved-remit clarification above. Retain its
questions only insofar as they help establish the page model, decomposition and
investigation contracts; it does not mandate further implementation scoping or
mechanism design here.

- **Organization:** what framework is initially produced, from what material, and
  how does it establish useful broader treatments and cross-connections? Existing
  answers, proposed but unmaterialized investigations and mechanical entity
  inventory can play different roles. Establishing enough context to open a useful
  first page should not require completing the whole book first.
- **Entry and investigative choices:** what does an entity overview need to supply,
  and which operations are available on entities or selected account content?
  Distinguish meanings such as clarification, deeper examination and investigating
  an applicable architectural concept without requiring an exhaustive catalogue.
- **Inadequate accounts:** which continuations belong in the first offering when
  content is incomplete, unhelpful or questionable? Existing fresh investigation
  and recording feedback differ from conveying a specific objection to an agent.
- **Developing-book coherence:** how are existing investigations found and reused
  across routes, and what causes composition/organization to be reconsidered as
  accounts accumulate? Underlying-investigation identity supplies an anchor, but
  does not by itself recognize equivalent separately offered questions or ensure
  orientation and broader links remain appropriate. The required first behavior
  is a scope question; matching algorithms, scheduling and notification UX are not.
- **The first capability cut:** after these meanings are clear, choose a modest
  set sufficient to try the loop and identify INVEST/ORGANIZE/PRESENT/MINIGUI work.
  Decide whether an explicit small architectural vocabulary/reference seed is
  needed immediately. This is not a demand for a definitive investigation/diagram
  catalogue, a prescribed Cockatiel journey or a formal user study.

The assistant recommends discussing ORGANIZE next, because the page side is now
substantially clearer while broader context, entry routes and shared treatments
still depend on what the framework supplies. The human corrected the assistant's
description of other matters as "deliberately deferred": they are outside this
scope discussion's remit, not an outstanding queue of decisions for this task.
Exact schemas, producer allocation and UI layouts/indicators belong to subsequent
design/implementation work. Persistence, changing targets, shared services and
formal fresh-session consistency are not part of the selected first experience
at present; only a material capability need would make their inclusion/dependency
relevant to SLICE, not their detailed design. Prose-directed access remains intended
but can follow the basic book. Initial assessment remains trying actual emergent
investigations, not predicting their answer sequence.

### Open questions identified at the first checkpoint

The human subsequently reprioritized these questions in the next section. This
list preserves what prompted that clarification; it is not a required planning
checklist or a set of prerequisites for beginning the first outing.

- Concrete first scenario(s), available starting material and what understanding
  would count as a useful endpoint. Cockatiel remains a strong example, not a
  selected full-slice acceptance script or permanent concept catalogue.
- What a useful basic book contains: account scope/depth, diagrams, relationships,
  navigable subjects, supporting detail and the initial operation meanings.
- ORGANIZE's first responsibilities, initial versus incremental work, alternative
  perspectives, defaults and preservation/revision of organizing choices.
- How selection-based exploration continues from incomplete, misleading or
  unsuccessful accounts, including the scope of a challenge operation.
- Coherence expectations within a developing reference and reasonable consistency
  across independently generated references. These are separate evaluation questions.
- Persistence, continuation across repository changes and any cross-user sharing.
  Shared persistence is an unselected alternative, not the current plan.
- Bounds on anticipatory work and the usability implications of latency/failure,
  without prematurely prescribing how investigations are partitioned or scheduled.
- Evidence and acceptance criteria for fidelity, discoverability, understanding,
  continuity, guidance and consistency; additional capability prerequisites and
  their sequencing before PRESENT/MINIGUI.

### Human priorities after taking stock

The human's quick assessment refocused SLICE on the first capabilities of the
magic-book mechanism, rather than a first specific book or prescribed journey
about one chosen codebase. One or more favorite repositories can serve as places
to try it; the product should not be targeted to them. Initial content concepts
and diagrams can grow organically or methodically after the basic mechanism works;
the Cockatiel examples are plausible starting material, not a specially selected
product boundary.

The human identified initial operations and ORGANIZE's responsibilities as useful
open questions. They gave greater priority to coherence than to formalizing
consistency across fresh investigations, emphasizing that PostCode assembles
multiple accounts rather than necessarily reaching one answer. How those accounts
are combined and presented is a central unresolved question. Reasonable
cross-session consistency should remain in mind without becoming a separate
formal acceptance exercise at this stage.

Persistence and changed-input support appear noncritical for the first outing;
the current preference is to get the experience working. Initial evaluation can
be trying it out. Specific scripted journeys are problematic because actual
inferences and emerging investigative routes cannot be known in advance. This
does not claim usefulness has been established, or remove normal implementation
verification; it changes how the initial product experience should be scoped
and explored.

The agent clarified that “the first basic book” should mean the first coherent
capability set: a usable loop for generating, organizing, reading, connecting,
extending and revisiting accounts. Concrete examples exercise that loop, rather
than defining a required sequence of answers. The agent's earlier wording placed
too much weight on selecting a particular scenario and understanding endpoint.

The immediate scope discussion should therefore concentrate on operations,
organization and assembly/presentation of multiple qualified accounts, with
initial content sufficient to exercise those capabilities. No predetermined
Cockatiel storyline, formal user study, persistent shared service or comprehensive
concept catalogue has been selected as a prerequisite. Existing account/diagram/
follow-up trials remain evidence about mechanisms rather than proof of the whole
experience's usefulness.

## Working context

Branch: `codex/first-graphical-experience`.
Worktree: `/Users/ronen/postcode/app-worktrees/first-graphical-experience`.
Starting commit: `c6654827eef15a02786429cf0e0b4af15816a273`, synchronized with
`origin/main` before worktree creation. This is exploration, without an
implementation task record. Governing documents and steering remain unchanged.

## Evidence informing the opening discussion

- The adopted [product design](../foundation/product-design.md) and
  [application specification](../docs/app-specification.md) place the human's
  architectural reasoning at the center. The human may understand computation and
  design without understanding the implementation language. Accounts can remain
  partial, overlapping and disputed. Presentation cannot supply missing analysis
  or turn interpretation into established fact.
- The [first-slice note](first-graphical-slice.md) proposes recognizable entries,
  contents, cross-references and supporting detail. The
  [organization note](architectural-reference-organization.md) distinguishes
  indexing retained subjects from interpreting useful groupings and from judging
  coverage. None of these is already a selected product offering.
- The [journey script](initial-journey/cockatiel-investigation-script.md) starts
  with a real concern and issue-derived names, little Cockatiel knowledge, and
  substantial design experience. Its endpoint is a reasoned direction with open
  questions. The [connected examples](initial-journey/cockatiel-account-examples.md)
  depend on admission, shared state, individual execution and composition accounts,
  not only a state machine. Their answers and correction discoveries are authored
  examples, not actual PostCode execution.
- The [journey findings](initial-journey/design-findings.md) report that broader
  orientation became meaningful through local understanding. The
  [picture review](initial-journey/pictures-result-review.md) distinguishes useful
  content transfer from visual fidelity and human benefit. The human found some
  local illustrations reasonable, the broad ownership picture less illuminating,
  and particular arrows, wording and timing depictions misleading. All four
  retained PNGs were inspected for this discussion. They are illustrations derived
  from a working account, not current application-generated diagrams.
- The completed [structured-account task](../records/tasks/2026-11-15-structured-architectural-accounts.md)
  supplies the underlying retention, selected-content investigation, alternatives,
  revision, state-account and follow-up mechanisms. Its completion does not
  establish a useful graphical experience. The
  [capability reference](../docs/capability-reference.md) still discloses transient
  Sessions, unchanged-input requirements, no save/resume and no general navigable
  collection of Views.
- Actual [M2 output and trial evidence](../records/validation/structured-architectural-accounts/m2-trials/README.md)
  includes the generated
  [breaker state diagram](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy.svg)
  and [full text](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy.txt),
  its [fresh-investigation diagram](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy-fresh.svg),
  and accounts of the delegated breaker implementations. The two breaker-policy
  SVGs were rasterized on white and visually inspected. They show recognizable
  state structure but dense crossing edges and truncated transition labels; the
  explanatory text is needed for conditions and scope. These are preserved early
  renderer outputs, not a fresh test of the final renderer.
- The generated breaker-policy account distinguishes an arriving execution after
  the recovery delay from an automatic transition. It explicitly says the flat
  model does not represent each concurrent call. The delegated-breaker account
  qualifies its state bearer and common abstraction. The ConsecutiveBreaker output
  includes numeric comparison categories and unusual-value qualifications. These
  are useful examples of the selection/detail problem: structurally supported
  content can be much broader than the reader's current concern. Reading these
  outputs did not independently verify Cockatiel behavior.
- The [promised-contract follow-up](../records/validation/structured-architectural-accounts/m2-trials/promised-contract-verification.md)
  successfully produced and invoked a diagram-promising option with natural-language
  elicitation, in seven requests without repair. The
  [review elicitation](../records/validation/structured-architectural-accounts/m2-trials/review-elicitation.md)
  demonstrated reuse, alternatives, inconsistency and withdrawal under explicitly
  supplied trial directions. Neither proves natural discovery of important gaps.
- The [M4 context-authoring trial](../records/validation/structured-architectural-accounts/m4-option-context-authoring.md)
  preserved a real failure: a broader diagram follow-up timed out during repair at
  181 seconds. A subsequent run deliberately requested one small prose clarification;
  that invocation succeeded in about 43 seconds. This is evidence for making work,
  failure and a useful route to continue visible, not evidence that prose is always
  better or that a user can already narrow a request through the product.
- The [dialog 14 trial](../records/validation/structured-architectural-accounts/m4-dialog14-live-regression.md)
  produced an accepted clarification distinguishing admission, isolation and stale
  completion from three controlled retained notes. Its setup was scripted; it did
  not independently investigate those claims. The historical records preserve
  their own implementation revisions and limitations despite subsequent acceptance.

The journey uses Cockatiel `f48bea5`; the structured-account trials use `80b5ed6`.
They must not be combined into one verified account. The ignored raw-capture
directory named by the live records was not present in the remaining registered
structured-account worktree. This reading used committed actual diagrams/text and
durable trial records, not an inspection of those missing raw exchanges. No new
inference or Cockatiel runtime verification was performed.

## Opening choice: what must the person bring?

The consequential choice is the starting promise of the experience. Three useful
levels are distinguishable without selecting a particular screen layout:

| Starting situation | What PostCode must make useful | Main scope consequence |
| --- | --- | --- |
| The person already knows the subject and precise question | A focused answer, detail and follow-up | Smallest investigation surface, but a weak test of reference browsing and discovery |
| The person brings a concrete concern and an ordinary name or lead, but does not know the implementation or all the questions to ask | A bounded reference around that concern, related subjects and new inquiry | Needs orientation and discoverability within that concern; potentially a small amount of interpreted organization |
| The person opens an unfamiliar project with no specific concern | Useful entry points and an architectural organization from which to discover worthwhile questions | Makes broader orientation and coverage judgment central capabilities |

The initial agent recommendation is the middle case. This is a proposal for
discussion, not an accepted narrowing. It permits browsing and discovering new
questions; it does not require a scripted click sequence or an expert to supply
the correct source module. A raw index may or may not be sufficient: test whether
it exposes useful connections rather than assuming either full ORGANIZE or no
organization work.

A concrete candidate is: someone considering early admission/readiness behavior
in Cockatiel wants to understand recovery, waiting and the commitments an early
check could make. They bring the use concern and names found in ordinary material.
They should leave able to explain the relevant mechanism and consequences, choose
a defensible next design question or direction, identify unresolved assumptions,
and return to the accounts supporting that reasoning. Reaching the journey's
particular timer proposal is not an acceptance criterion.

## Discussion: purposeful entry with surrounding context

The human clarified their actual starting point: “i know nothing about cockatiel
but want to fix issue #111”; they did not even know what Cockatiel did. They asked
whether optimizing for that starting point would encourage an inadequately
informed approach. The initial recommendation above must not silently assume
project knowledge or an architectural foothold that the exercise did not have.

The agent distinguished bringing a purpose from already knowing the architecture.
The proposed starting condition became a concrete purpose, potentially no project
knowledge, and willingness to investigate. The proposed endpoint requires enough
understanding to reason responsibly, with unresolved assumptions visible. This
remains discussion rather than accepted scope.

The human then offered this reference analogy:

> For the reference idea, in some sense this could be like looking in the index to see what page talks about [the things mentioned in #111] and jumping right there; but then seeing which chapter that page is in immediately gives a little bit of context.

This suggests that direct lookup and orientation can occur together. A person
can enter through a term encountered in an issue and gain some context from the
entry's visible position in a larger organization, without first completing a
project overview. Local explanation and broader orientation need not be separate
entry modes.

Agent interpretation for further discussion: the entry could show an intelligible
surrounding topic, a route to its broader explanation, and related entries. Such
organization must convey meaning beyond a bare location marker. It need not be
a uniquely correct hierarchy of the software; editorial placement and program
relationships remain distinct. Whether a small useful neighborhood can be supplied
on entry, and how much framework must exist before that lookup, remain open
ORGANIZE questions. The analogy does not yet select controls, a book layout,
a fixed contents tree, or a pre-generated whole-project reference.

## Discussion: previews and anticipatory investigation

The human endorsed the hypothesis of gaining useful context around the opened
entry, while agreeing that a simple hierarchy would not establish it. They
suggested “see also” relationships or partially exposed other pages, making their
subjects apparent at a glance without leaving the current context. This endorses
a hypothesis to explore, not a particular layout or implementation plan.

The agent proposed evaluating whether a preview communicates what the related
account concerns and why it might matter. A clipped page fragment may or may not
achieve that; deliberate previews and literal page glimpses remain alternatives.
The agent initially distinguished previews of already retained accounts from
suggestions for further investigation.

The human then strengthened the reference-book proposal:

> Leaning into the reference-book metaphor; the illusion is that the entire book pre-exists (anticipating every possible concern), even if the pages are generated lazily; so we don't necessarily have to wait for an explicit investigation request to generate those preview accounts.

This expands the hypothesis beyond browsing the accounts already accumulated.
PostCode could investigate related material in anticipation of navigation, without
requiring a separate explicit investigation request for each preview. The reader
approaches an available reference, with production occurring as needed. Do not
silently narrow this proposal back to a history browser or links to empty topics.

Open implications for discussion:

- Organization and investigation must jointly supply useful surrounding content;
  identifying related concerns can itself require qualified analysis.
- Opening an entry could request a bounded surrounding treatment as part of its
  communicated behavior. Investigation continuing beyond a completed request,
  or independently exploring other topics, needs an authorized autonomous resource
  policy under the existing specification. A separate confirmation for every
  preview is not inherently required.
- The metaphor can convey navigability and anticipated interests without implying
  that uninvestigated claims are known, coverage is exhaustive, or answers cannot
  be unavailable. Previews making architectural claims require their own adequate
  support and qualification; a proposed topic is not yet such an account.
- Latency, resource use and relevance become part of usefulness. The live-trial
  delays make anticipatory preparation plausible, but do not establish that
  generating several surrounding accounts will be timely or worthwhile.
- Opening a preview should preserve the meaning that made it attractive. A deeper
  investigation may add or correct information, with the change identifiable.
- No limit on breadth, trigger, scheduling, persistence or precise preview form
  has been selected. This is a substantive scope hypothesis for SLICE, with
  potential ORGANIZE and investigation prerequisites.

The human also explicitly requested that discussion avoid acceptance bias:
challenge assumptions and disagree when warranted. Treat agreement with a useful
hypothesis as a reason to test it, not as evidence that its benefit is established.

## Consolidation: magic book, concept vocabulary and non-prose exploration

The following captures the subsequent discussion on 2026-11-20. It refines the
earlier hypotheses without turning this note into an adopted specification or
implementation plan.

### Product role and the meaning of the metaphor

The human clarified that PostCode is helping someone understand the software,
not taking responsibility for solving their problem. Their problem can motivate
and focus exploration. A useful architectural understanding is an endpoint in its
own right; choosing a design direction may be a downstream use, not a required
acceptance outcome. The earlier candidate endpoint above should be read with this
qualification.

The human described a “magic book” with potentially infinitely many pages,
chapters and sections: it is the same book, but different approaches expose
different pages. It need not have one fixed table of contents. Its magic is
adaptation to the subject and open-ended exploration, not an oracle promising
answers to all possible questions. This is consistent with a window onto the
source through intelligible architectural accounts, rather than source syntax.

The human hopes broader questions will often converge on shared pages. The agent
identified shared purpose/operating-model accounts as candidates, while noting
that broad architectural perspectives can still differ legitimately by concern.
Continuity, recognizable subjects, exact earlier accounts and intelligible
connections remain important. Different treatment, further detail and correction
should be distinguishable.

The human pointed out that the investigation identifying surrounding contexts
could also produce brief previews for them. Several previews do not inherently
require several separate investigations. Production partitioning and scheduling
remain implementation choices; do not infer linear cost from preview count.

### Content concept before UI design

The human raised strong dependence of usefulness on presentation. The discussion
distinguished a bad UI obscuring good content from good presentation being unable
to compensate for bad content. The agent initially proposed interactive exploration
before settling scope; the human suggested instead selecting a content concept
for which an adequate UI ought to be devisable, robust enough to work with a plain
presentation. The agent accepted that distinction.

The working approach is to select the content and interaction promises without
specifying the UI: coherent main account, intelligible surrounding context,
substantive related-topic previews, accessible support and continuity. Their
meaning should not depend on an unusually clever spatial arrangement. Partially
exposed pages remain one possible presentation, not a requirement. Actual human
use must eventually test usefulness, but an interactive prototype is not a
prerequisite merely to discuss and select SLICE's content concept.

### Non-prose interaction and investigative guidance

The human has wanted to avoid prose interaction for the initial offering. Their
candidate mechanisms are name search, standard investigations, investigation-owned
follow-ups, separate investigation supplying “see also” options, and ORGANIZE
providing a useful catalog/outline/index or other arrangement. Dynamic choices can
support open-ended exploration; they are not necessarily a predetermined guided
tour. The agent withdrew its earlier implication that prose was necessary to
avoid that outcome.

The human highlighted exact selected-account content as a subject for standard
operations, suggesting “explain this more” and “this seems wrong.” These remain
candidate operations, not a finalized catalogue. A challenge would initiate
examination of the exact account rather than automatically establish error or
silently replace it. It differs from current inadequacy feedback, which records
an experience without initiating investigation. Selecting the part and operation
communicates subject and intent without requiring prose explaining the objection.
Whether that is sufficient for useful challenge is to be tested; the reader's
reason for doubt is not thereby known.

The human's principled hypothesis is that PostCode's expertise includes helping
the user find useful architectural information, reducing the burden of knowing
which questions to ask. Guidance should illuminate the software while preserving
human choice, challenge and direction; it need not solve the motivating problem.
Productive exploration must not be mistaken for wasted effort simply because a
more directed path uses fewer steps.

The human explicitly confirmed the current boundary:

> yes. (future versions of postcode might indeed have prose interfaces and be able to answer questions, but explicitly trying to limit that for now.)

At this point in the discussion, the direction was to pursue selection-based
exploration rather than a free-form prose question/answer or design-conversation
interface. Name search remained included; avoiding prose investigation did not
mean banning all textual input. The subsequent decision below identifies
prose-directed access to the book as intended capability with deferrable
implementation, refining this earlier position.

### Concepts as an extensible vocabulary

The interpreting agent should identify concepts/concerns relevant to the current
subject or context, then support investigating a selected concept for that subject.
This reframes the capability discussion beyond enumerating a permanent list of
architectural investigations. Concept relevance is itself an investigative judgment;
recognition alone does not establish an adequate answer or method availability.

The human emphasized established architectural concepts as a vocabulary, explicitly
not a template. Different subjects and systems may call for entirely different
concepts. Cockatiel's anticipated ownership, state, interaction and contract concerns
must not become mandatory headings or a closed ontology for every account.

A candidate supporting capability is a maintained, structured vocabulary using the
[earlier architectural references](initial-journey/architectural-concept-references.md).
The human proposed ownership linked to creation, retention and related terms.
Meaningful connections can describe aspects to examine, related concepts and
contrasts without forcing one strict hierarchy. Creation can also belong in a
lifecycle account; participants responsible for creation, control and disposal
need not be the same.

Agents can draw on existing knowledge of the terms and consult linked reference
works. Lightweight disambiguation or local usage notes may suffice; no requirement
to write an exhaustive textbook was selected. Reference retrieval could be supplied
by PostCode on demand, cached or otherwise delivered. The current investigator has
no browsing tool, but retrieval machinery is an implementation choice for the
candidate capability, not an objection to reference-backed vocabulary. Architectural
reference material explains concepts; claims about the particular software still
need their own supporting basis.

Agents should be able to report “ownership is unclear.” Useful accounts distinguish
insufficient investigation/evidence, contradictory indications, and genuinely
shared or distributed roles; shared ownership is not automatically defective.
Vocabulary structure should improve distinctions, inquiry and uncertainty reporting,
not merely decorate prose with architectural terms.

### Remaining scope work

The discussion has established direction, not a complete offering. Still select
concrete subjects/scenario(s), starting material, useful understanding endpoints,
the content and diagram capabilities needed together, the initial selection-based
operations, the amount of organization/anticipation required, reference-material
access, lifecycle boundaries and evaluation criteria. Persistence and changing
repository inputs remain undecided. No new implementation, UI design, glossary
compilation or live inference has been authorized by this consolidation.

## Reconsidering prose: a way to open the book

After explicitly limiting prose for the current slice, the human asked for reasons
for that choice and a critical assessment. The reason previously discussed was
PostCode's expertise in helping people discover useful architectural questions.
The agent proposed additional reasons: recognition can require less effort than
formulating a question; exact selection makes the subject concrete; a bounded
offering is easier to assess; and a selection-based surface deserves evaluation
on its own terms.

These do not establish a principled ban on prose. Guidance, retained reference
accounts and read-only architectural investigation are compatible with prose
requests. Standard operations can become awkward menus, and a person may have a
precise concern that the available selections cannot express. Prose could also be
evaluated by observing where and why people use it. The agent characterized
withholding prose as a provisional scope/experimental choice, rather than a
requirement for keeping PostCode within its product role.

The human then explored how prose could remain within the reference-book/window
role. The proposed boundary concerns what PostCode undertakes to deliver:
investigation and explanation of the software rather than taking charge of the
user's task. Read-only execution alone does not establish that boundary. A prose
request could resolve to subjects, concepts and information needs, with ambiguity
and consequential assumptions disclosed, while normal evidence, qualification,
retention and capability limits continue to apply. Short clarification can resolve
the request without introducing an unrestricted design conversation.

The human proposed:

> yes, the answer to the prose might include a small amount of prose as a reply, but mostly it would "open the book" to the description that answers the question.

The substantive answer would therefore be the account reached in the reference,
whether already retained or newly investigated. A brief reply could explain the
destination and relevant passage; the content remains connected, inspectable and
available through other routes. Prose becomes another means of reaching a useful
treatment, alongside search, concept selection and offered connections.

### Intended capability and sequencing

The human subsequently directed:

> yes. i now think it should be identified as an intended capability, but we can decide that it its implementation can be deferred until after the basic "book" features are working.

Prose-directed access to the architectural reference is therefore an intended
capability in this scope discussion, not merely an unselected future possibility.
Its implementation can be deferred until the basic book features work. Initial
selection-based use is a sequencing choice, not a permanent product restriction.

A prose request would primarily open, focus or develop the relevant account(s),
possibly accompanied by a brief orienting reply. The substantive answer belongs
in the book and remains accessible through its other routes. PostCode's role
remains architectural understanding rather than taking charge of the motivating
task; this direction does not adopt an unrestricted design conversation.

Carry the intended capability and its sequencing into the eventual planning
package. This records human direction in exploratory notes; no governing document
has been revised and no implementation has been authorized. The meaning of the
basic book milestone and the eventual prose interaction still need scoping.

## Organization, coherence and consistency

The human distinguished two related questions:

1. Whether looking at several things within one developing reference feels
   coherent and permits accounts to share/combine information. Its lifetime might
   be one app invocation or several through persistence.
2. Whether independently starting fresh references for the same codebase produces
   reasonably consistent accounts and organizations.

Persistence can extend the first reference's lifetime; it does not establish the
second kind of consistency. The comparison needs a stated repository basis and
investigation conditions, rather than assuming that the same repository name
means unchanged inputs.

Within-reference coherence calls for recognizable subjects, useful shared
explanations, connections, return to earlier accounts and intelligible differences.
Arranging complementary accounts and synthesizing a new combined explanation
remain different operations. Current retention/reuse mechanisms do not themselves
establish the quality of agents' organizing judgments.

Across fresh references, the agent proposed assessing compatible substantive
claims and qualifications, recognizable major concepts and mechanisms, and useful
common landmarks. Identical prose or a single canonical hierarchy is not required.
The human has not yet selected acceptance thresholds for permissible variation.

The human proposed that some organization be independent of the current reading
context, potentially starting from the mechanical module inventory. They clarified
that the inventory alone does not supply a useful architectural inventory: its
role is to give interpreting agents a stable starting point. The agent agreed.

The resulting hypothesis is a common mechanical foundation for interpretive
organization, with contextual routes and treatments built on that developing
reference. “Context-free” here means independent of the reader's immediate
purpose, not independent of the software or captured evidence. The initial inquiry
should not arbitrarily determine the entire project's organization.

Architectural responsibilities and relationships can cross module boundaries;
the hypothesis does not make the module tree the book's table of contents or
establish cross-session identity merely from similar references. A common input
population can reduce arbitrary differences without guaranteeing identical
interpretation. The scope of an initial organizing investigation, its acquisition
beyond inventory, and upfront versus incremental production remain open.

Candidate evaluation separates developing one reference through different routes
from independently generating several references over the same basis. The latter
could hold the mechanical foundation and general organizing purpose constant,
then compare organizations and explore them through different reader concerns.
No such trial has yet been run for SLICE.

### Shared accumulation as an alternative to independent reconstruction

The human proposed, explicitly as a hypothetical possibility rather than a
preferred choice, built-in persistence at a shared location so that fresh visits,
including visits by different users, reuse developing entities and accounts.
Freshness would then describe a new visit to an existing reference rather than
independent reconstruction. This could replace much of the independent-consistency
problem with continuity through reuse.

Both participants noted that global sharing stresses coherence. It does not
establish account quality or eliminate conflicting interpretations, overlapping
identifications, acquisition-order effects or changed-software applicability.
Persistence, sharing across users and sharing one organization are separate
choices. Shared qualified accounts could support different organizations. No
shared service, persistence model or global-reference policy has been selected.

### Multiple organizations and codebase-dependent defaults

The human emphasized that multiple organizations/perspectives can be useful even
within one person's investigation of one topic. ORGANIZE need not expose a single
view or hierarchy. This refines earlier discussion of a general framework: there
may be several useful organizations over common subjects and overlapping accounts,
not one architectural outline with contextual branches.

The working coherence hypothesis is intelligible connection between perspectives,
with recognizable subjects, reusable accounts, meaningful cross-references and
qualified differences. It does not require one canonical table of contents or
automatic reconciliation. Presenting established relationships in different forms
and investigating a new conceptual organization remain distinct kinds of work.

The human further suggested that the default route could be selected based on
the codebase. A useful default need not be universal or determined only by the
reader's immediate concern. Selection may draw on a qualified assessment of the
software and its useful organizing perspectives. An initial route does not make
that perspective the uniquely correct architecture, prevent other routes, or
require a mandatory overview before direct lookup. The selection method and
quality criteria remain to be scoped and tested.

### Pages as developing book material

The human distinguished the underlying entity/attribute and question-response
population from a possible book-level collection of pages, with organization
over those pages still to be determined. A subject could be a collection of
items or entities. The previously suggested subject/concern/topic breakdown was
exploratory wording, not an accepted taxonomy. The human asked whether pages
could develop as further accounts accumulate and whether this fits adopted Views.

The assistant's proposed distinction is between a recognizable, revisitable
page and its particular displayed composition. A page could coordinate several
qualified accounts; it need not equal one response or one newly synthesized
answer. Its contents could develop without changing the exact retained accounts
on which earlier presentations depended. New synthesis or inferred relationships
would themselves require qualified analysis, rather than being invented by the
display. This remains a proposal, not an adopted page object or lifecycle.

The adopted product design already permits subjects that are collections and
Views coordinating several Projections; it explicitly distinguishes changes in
View composition or basis from rendering changes. Thus the book metaphor is
compatible with those provisions. A revisitable page identity, rules for choosing
its current contents, and update behavior are additional choices not settled by
the View definition. More accounts becoming available need not automatically
cause a page to change. Separating page composition from navigation among pages
is useful for discussion, without requiring a fixed page population before
organization begins.

### Query-rooted pages without separate interpretive authorship (2026-11-21)

The human proposed pages as entities or siblings of entities, potentially defined
and modified by interpreting agents. This prompted discussion of inherited
qualification, new synthesis and source consultation. No entity model or separate
page-authoring responsibility was selected. The human also clarified that the
adopted foundation may be deliberately revised if warranted; it should constrain
thrashing, not prevent justified product development. No foundation change was
requested.

As a simpler exercise, the human proposed a page defined by a particular query's
response(s) and traversal of their referents, displaying multiple responses as
alternatives. Page assembly can then be non-interpretive even when the displayed
content is interpreted. Expansion boundaries, treatment of complementary versus
alternative material, and revisiting current selections versus exact earlier
answers remain open.

The human observed that recognizing another question's response as bearing on
this one is already an interpreting-agent responsibility/affordance: answering
one question can also address earlier questions. This challenges the need for
a distinct interpretive page-authoring layer. A page could expose qualified
connections and answer designations produced through ordinary investigation.
Relevance alone need not mean a response is an alternative answer; the supplied
relationship and the page's query meaning determine what is shown. This is a
candidate mechanism for coherent developing pages, not evidence that discovery,
selection, refresh or graphical presentation is already sufficient in practice.

### Mechanically assembled pages with interpreted guidance

The human proposed a `see also` affordance alongside follow-up options, pointing
to existing entities or answers. Its useful meaning is navigation to identified
subjects or available material, distinguished from proposing further investigation.
A reason for the connection could supply a preview; relevance does not itself
establish agreement, corroboration or alternative-answer standing. Whether existing
association machinery suffices or new content is needed remains open.

The human then suggested that a page interpreter could take responsibility for
follow-up and see-also guidance, reducing the burden on account-producing agents.
The assistant identified a possible distinction between investigators optionally
contributing leads and another investigation selecting reader-facing guidance;
leads discovered during source investigation could otherwise be lost or rediscovered.

The human's intermediate proposal is a mechanically created page rooted in an
answer, augmented by another agent examining that answer and related material
to produce page-level guidance, potentially attached as attributes to the answer.
This separates mechanical page composition from interpreted navigation without
requiring an agent to rewrite or synthesize the main treatment. Guidance could
develop as related material accumulates. Logical attachment need not mutate the
original retained answer: attributable qualified information can be associated
with it. The precise attachment scope (exact answer, question or page), refresh
behavior, context supplied, and investigram representation remain design questions.
This is a candidate scope direction, not implementation authorization or a settled
requirement for a separate agent instance or execution phase.

### Guidance queries and lazy book interaction

Guidance can connect a local treatment to the emerging organization, using
established relationships and potentially contributing further organizing
interpretation. The human emphasized that guidance might be mechanical, agentic
or mixed, using referents, follow-ups and possible see-also hints. The existing
query boundary can hide that implementation choice. Define the information sought
without prematurely requiring a guidance agent; implementations must preserve
question meaning and disclose their methods and coverage.

The discussion distinguished elaborating the current treatment from opening a
separate connected treatment. The human proposed that the offered follow-up could
declare this intended relationship, informing inline versus new-page placement.
An elaboration can still require another query; visual form alone (for example,
a diagram) does not determine placement. The assistant suggested this as semantic
guidance for a presentation default, with actual fulfillment still assessed.
No placement schema or UI has been selected.

The human proposed retaining links between originating pages and follow-up pages.
These conceptual/derivation links differ from navigation history; a destination
can be reached from several origins without a mandatory single-parent hierarchy.
The assistant proposed within-session back navigation restoring reading context;
cross-restart persistence has not become a prerequisite.

The human further proposed the same interaction for new investigation and retained
results: offered follow-ups behave like available book content evaluated lazily.
A missing diagram can be presented as an action to expose the diagram, rather
than requiring the reader to choose an investigation procedure. This reinforces
the pre-existing-book metaphor without claiming every offered treatment is already
produced or guaranteed obtainable. Content-oriented actions can resolve to retained
qualified material or new investigation. Waiting, inability, qualifications and
material changes must remain intelligible; exact historic access and an explicit
request to investigate afresh retain their separate meanings.

The human agreed to record this interaction direction: readers ask to see content,
and PostCode resolves reuse versus new production behind that action. Follow-up
and see-also routes can therefore share a user-facing interaction even though
their underlying targets and execution differ. Inline elaboration versus opening
another treatment is a separate distinction from retained versus newly produced
content. A page can include described opportunities to expose further content,
not only completed answers. Ordinary browsing uses available qualified material;
explicit fresh investigation remains a distinct operation. This agreement does
not settle the page schema, guidance implementation or detailed UI.

### Surrounding context for a page

The human proposed determining the surrounding context for any given page,
potentially as part of guidance or organization, and asked to record the ensuing
distinction: context helps readers understand the current treatment, whereas
suggested next steps help them continue. The two overlap, but context should be
useful without requiring the reader to follow a link.

Organization can supply relationships across the developing book; contextual
guidance can select and, where necessary, investigate the relationships that make
a particular page intelligible. Newly established context can contribute back to
organization. No exclusive subsystem assignment or separate agent is selected.
Surrounding context may include broader treatments, important distinctions and
related concerns. It is not necessarily a parent chapter and siblings, nor every
referent one step away. Different treatments or approaches may call for different
context.

A candidate information need is: what context helps a reader understand this
treatment? Existing organizational relationships and hints may support mechanical
production, with interpretation where needed. Short orientation and substantive
neighboring-topic previews are possible presentations, not a selected layout.
This develops the original reference-book hypothesis: a reader entering directly
at a relevant passage can immediately understand where they have landed; see-also
links provide routes onward rather than carrying the entire contextual burden.

### Page composition behind the investigation boundary

The human proposed deferring the choice of mechanical, agentic or mixed page
assembly behind a page-composition investigation, given appropriate context.
"Composition" was accepted as more accurate than "layout": the result specifies
content and meaningful relationships, not screen geometry. This avoids allocating
responsibility between original investigators, guidance and organization before
understanding the desired output. Interpretation introduced by composition remains
qualified information, not hidden renderer synthesis.

The human requested a concrete Cockatiel exercise including diagrams and exposed
detail. The [page-composition exercise](cockatiel-page-composition-exercise.md)
uses the actual policy state account and breaker follow-up, explicitly distinguishes
authored composition from generated content, and leaves concurrent-call interaction
as an unfilled destination. It explores inline expansions, contextual previews,
connected pages, return behavior and qualifications. It is a proposal for discussion,
not an accepted page contract or new live validation.

### Response titles and two kinds of surrounding context (2026-11-22)

The exercise's actual underlying operation was `state-behavior` on the
`circuit-breaker-policy` module with a state-diagram requirement. Its main specimen
comes from a fresh investigation of that question. The assistant supplied the
page composition by hand; "admission and recovery" was an editorial focus, not
the original operation's explicit question. Whether composition may choose such
a focus or should receive it as part of its request remains open. A narrower
page title should describe the selected treatment accurately rather than conceal
the broader account's isolation and initialization content.

While examining the Cockatiel composition exercise, the human and assistant
settled on requiring a descriptive title for the explanatory response, expressed
as an associated attribute. The investigating agent chooses the wording; no extra
rule distinguishes a question-like title from a response-specific title. Page
composition can reuse it or supply a different page title. This is a discussion
decision for the intended capability, not an implemented field or adopted schema.

The human clarified that the original surrounding-context idea chiefly meant
structural context: which chapter or chapters contain the treatment, or "see
upwards", as distinct from the more lateral associations of "see also". The human
also found the example's orienting prose useful and asked whether both should be
present. The assistant proposes distinguishing structural placement/links to
broader treatments from a short explanation of the page's scope and connections.
Several qualified broader contexts may coexist without a single-parent hierarchy.
Navigation origin is separate: arriving through a page does not establish that
page as an architectural parent. The need for both kinds of context does not
require both to occupy substantial space on every page or new prose when the
structural labels already orient the reader adequately. This proposal remains
open for discussion.

### Orientation, broader context and reference organization (2026-11-22)

The human preferred **orienting explanation**, or simply **orientation**, for
the short explanation that helps a reader understand the current treatment.
**Broader context** is the proposed term for locating that treatment among more
encompassing explanations; **broader treatments** could label its destinations.
These names distinguish two information needs without requiring two large,
mandatory page sections. The original example supplies orientation but does not
yet demonstrate the proposed broader-context links.

The human proposed that the organization/framework link related explanations,
optionally indicating that one is broader than another. Broader context could
then be derived from a partial ordering of that graph. The assistant qualified
that the ordering would concern broader/narrower relationships, not every link:
support, contrast, follow-up origin and other see-also relationships have different
meanings. A more detailed explanation can have the same scope as a shorter one;
detail alone is not narrower scope. A broader treatment need not contain all the
content of its narrower treatments. Several broader frames may coexist, and many
pairs of treatments need not be comparable. The ordering's exact semantics and
consistency rules have not been selected.

Once relationships are supplied, a presentation can derive upward routes
mechanically. Composition may choose a readable neighborhood, such as nearby
broader treatments with onward routes, rather than show every ancestor. This
does not require a single chapter tree. The working responsibility distinction
is: organization establishes relationships, composition selects their exposure,
and orientation explains what the reader needs to understand locally. Those are
responsibilities, not mandated separate agents or execution stages.

The human further distinguished **organizing entities** from **organizing query
responses**. The current model distinguishes Entities from Query results and
retained answers; answers are not automatically a subtype of Entity. The book
framework could organize explanatory responses, whereas an architectural structure
would organize the things being explained. Reference relationships such as broader,
narrower, complementary or contrasting are not the software's containment,
ownership, responsibility or dependency relationships. For example, placing a
recovery explanation within a broader circuit-breaker treatment does not assert
that the implementation contains a separate recovery component.

This suggests scoping the book framework as **reference organization**, without
requiring a comprehensive architectural organization of the codebase first.
Individual investigations may still establish architectural relationships needed
for their explanations; the two kinds of organization can inform one another.
No new general entity-organization effort was selected in this discussion.

An unresolved identity issue remains: do reference-organization links attach to
exact responses, questions, revisitable pages, or some combination? A developing
page can outlive a particular answer; a replacement response does not automatically
inherit every organizing relationship merely by addressing the same question.
The assistant offered "treatments realized by qualified responses" as a conceptual
description while leaving the target model open. This does not adopt a new
treatment record, make responses Entities, or settle page identity and lifecycle.

### Where the example's orientation comes from

The human asked what supported the authored orientation and whether composition
provides it or delegates it. Its three distinctions draw on the retained fresh
policy account: instance-local state from its applicability statement; delegation
of the opening decision from Closed behavior and transition T1; and policy state
versus individual-call progress from the explicit concurrency limitation. The
retained breaker follow-up further supports distinguishing delegated criterion
state from caller-owned circuit modes. No fresh source inspection or existing
orientation field supplied that paragraph. Selecting these distinctions as useful
orientation and joining them in prose were the assistant's composition judgments.

The assistant's proposal is that page composition is responsible for supplying
adequate orientation when needed, without prescribing its producer. It could
reuse supplied explanatory content, interpret the available accounts itself, or
request orientation through another investigation. Delegation remains behind the
agreed investigation boundary. Broader organization is relevant when explaining
the page's place in the book, but the example's local scope distinctions do not
require it. Novel substantive claims need qualified investigation; a gap should
not be filled merely to make the introductory text read smoothly. This allocation
is a proposal, not yet a settled separate orientation capability.

### Emerging page content template

The human and assistant agreed that examining broader treatments can improve the
judgment of what orientation a reader needs: the local answer supplies facts and
scope, while broader contexts help select relevant distinctions and prerequisites.
For the Cockatiel example, circuit breaking, admission control and concurrent
execution could each motivate different emphasis. The assistant proposed a useful
default orientation across relevant broader contexts without assuming the reader
has absorbed a particular arrival page; route-sensitive emphasis remains optional.

The human identified an emerging general page template: **title, orientation,
main content including expansions, broader-context links, and see-also links**.
Navigation history, label/preview presentation and similar UI choices are outside
this immediate discussion. This is a page-content organization, not a fixed set
of architectural concepts to impose on every investigation. Proposed investigations
can appear as not-yet-materialized expansions or connected treatments, consistent
with lazy book interaction; they need not form a separate user-facing section.

The human suggested that each component could be an Entity, response or other
kind of thing carrying ordinary qualification and update/amendment/replacement
behavior. The assistant agrees with separately addressable, attributable material
and qualified relationships, but does not infer that every part requires a new
Entity or Query result. Existing attributes, content items, associations and
qualified responses may fill different roles. The object model remains open.

The assistant identifies scope/basis and consequential qualifications as
cross-cutting requirements of the template, rather than necessarily another
content section. Alternatives or disagreement must remain intelligible within the
main treatment where present. Material's membership and role in a composition are
also decisions: reusing an explanation as supporting detail versus orientation
does not alter the source explanation, but changes its use. Independently revised
parts must remain compatible in basis and scope; current pages may develop while
earlier exact content/compositions remain distinguishable. These observations are
design implications for discussion, not a selected schema or live-refresh policy.

The human agreed that the **page composition itself** can be one of these
addressable, qualified, revisable components, potentially with its own type.
It identifies selected material and the roles/relationships through which that
material forms a treatment. This makes composition available for examination
and revision, rather than leaving it implicit in display behavior. Its exact
representation remains open; no new Entity kind, content type or lifecycle
mechanism has been selected.

### Pages as Views, with future pinning and comparison

The human revisited whether a page fits the foundation's View concept, proposing
future pinned/live pages and a "what changed" investigation producing a page
relating earlier pages. The foundation already permits Views coordinating multiple
qualified Projections across subjects/bases, identifiable composition and basis
changes, and qualified comparisons using earlier Projections as input. The
assistant therefore proposes treating the displayed book page as a kind of View,
with its qualified composition and constituent accounts as underlying information.
This does not equate an interpretive composition result with a Presentation rule.

Two kinds of evolution matter: the target software can change, and accumulated
understanding/composition can change over the same target state. Pinning the input
state alone does not freeze the explanation; preserving exactly what was read is
a distinct selection. A live page could obtain later qualified compositions and
accounts rather than mutate earlier retained answers. Exact binding, refresh,
continuity and pinning behavior remain future design choices, not capabilities
selected for the first slice.

Comparison could explain changes in the software, changes in PostCode's account,
or both, while distinguishing them. It would use identified prior compositions,
accounts and bases, adding qualified comparison findings rather than inferring
architectural change merely from changed prose or layout. A comparison treatment
can itself use the same page template and link back to its inputs. The remaining
question is the continuing identity/lifecycle of a revisitable page versus its
particular retained compositions and displayed states. No foundation change or
new page/View identity rule has been adopted through this discussion.

### Continuing page identity follows the investigation, not its response

The human clarified the preferred experience when understanding changes over
unchanged software: appropriate notification and access to history/changes,
rather than routinely pinning to an outdated understanding. Exact earlier accounts
remain useful historical references; detailed notification and history UI are
deferred. This preference does not imply that every newly produced alternative
automatically supersedes earlier understanding.

For continuing identity, the human proposed that the page supplies the response
to a specific investigation, dressed as a complete book page, and explicitly
clarified that identity attaches to the **investigation, not the specific response**.
The assistant interprets this as the continuing investigative question/request,
not a particular execution attempt. Responses and compositions can change while
the page continues to address that investigation. This aligns conceptually with
the existing distinction between Query-result identity and particular invocations,
designated content and captured answers. It does not yet select an exact storage
mapping or establish cross-state/cross-session identity, semantic equivalence of
different requests, or equivalence between independently authored follow-up options.

### Working page model agreed

The human accepted the working model: **a page is the book-style View of a
particular investigation, with its current qualified response material and
composition**. Its continuing identity follows the investigation/question, not a
specific response or execution attempt. This is agreement in the scope discussion,
not adoption of a schema, lifecycle implementation or foundation amendment.

The human also confirmed that scope, basis and qualifications belong to the
response, the page components and the page/composition itself. They are part of
the content model, not a required extra page section. How visibly they appear,
including possible summaries/icons of the kind explored in steering's candidate
material, is deferred to UI/UX work. The human prefers avoiding intrusive displays
when unnecessary. This discussion selects neither an icon scheme nor a blanket
rule to hide qualifications; the presentation must still preserve consequential
meaning under the adopted contracts. No candidate steering file was modified.

### Revised Cockatiel walkthrough

After the discussion was committed, the human requested revision of the example
before continuing. The exercise now anchors identity and scope to the actual
state-behavior investigation, distinguishes proposed response title from page
title, separates orientation from hypothetical broader-context relationships,
and identifies the qualified composition and its component roles. Navigation and
visual presentation choices are deferred. Existing generated accounts and diagrams
remain the evidence; no new investigation or architectural validation was run.
The main paragraph sequence remains explicitly authored candidate synthesis and
now includes manual isolation and qualified initialization, consistent with the
underlying question. The next walkthrough topic is main content and expansions,
including selection versus synthesis; that choice has not been settled by revision.

### Terminology: underlying investigation

After considering defining, core, root, anchor, seed, kernel, content and related
terms, the human and assistant chose **underlying investigation**. A page's
underlying investigation is the investigation whose question and responses it
presents, and which determines its identity. This distinguishes it from page
composition without implying that it supplies every component. Identity follows
the continuing question, not a particular execution or response. The Cockatiel
exercise now uses this definition explicitly.

### Main-content synthesis was an evidence accommodation, not a demonstrated need

The human questioned why the example rewrote main content instead of using the
underlying investigation's generated prose. Inspection confirms that current
`stateBehaviorGuidance` explicitly requests a prose item explaining behavior,
reasoning and limits alongside the structured model. The harness separately saves
full answers and diagram text; the committed M2 `.txt` specimens used in the
exercise are the latter. Live records, including focused option verification and
review elicitation, document answers with both model and explanation. The full
prose of the selected specimen was not available in the exercise's preserved input.

The assistant therefore corrects the inference: hand-authored main content
compensated for incomplete available evidence, not an established inability of
the investigation to produce useful prose or a demonstrated page-composition
requirement. Its suitability cannot be judged from the model export. The example
has been annotated accordingly. The proposed default is to reuse the underlying
response's explanation, with additional synthesis justified by an actual need
(such as coordinating several complementary accounts), not imposed merely to
turn an answer into a page. This default remains a proposal for discussion.

### Proposed single-account / multiple-account main-content policy

The human proposed a definite policy: with one account, present it directly;
with multiple accounts, an inferencing agent produces a unified treatment and
judges whether the accounts are complementary and can be combined, or alternatives
that should remain presented as such. This supersedes the assistant's preceding
suggestion that multiple-account interpretation be optional as the working proposal
under discussion. It is not implementation authorization or an adopted contract.

The assistant supports the distinction, interpreting "unified" as one coherent
treatment rather than necessarily one agreed conclusion. The single-account rule
concerns main explanatory content; title selection, orientation, expansions and
context composition still apply. The multiple-account interpretation should
preserve selected sources and qualifications, may combine compatible contributions,
and should explain alternatives or unresolved relationships without forcing a
choice or silently superseding originals. It may find shared ground alongside
remaining disagreement. Inability to establish the relationship is a legitimate
qualified outcome, not permission to invent coherence.

Account counting should concern the current explanatory answers selected for the
underlying investigation, not the number of contributing investigrams or content
items; one answer can already assemble several such records. The synthesized
treatment is composition-supporting output over identified inputs, not automatically
another peer input that triggers repeated synthesis of itself. Exact input scope
and representation remain to be specified. The policy's cost/reliability tradeoff
is an additional interpretive dependency for multiple-account pages, accepted
only as a proposed content policy here; no live evidence has tested it.

### Expansions versus destinations and selection-based explanation

The human proposed that **expansions conceptually add or expose material on the
same page**, while **see-also and broader-context links open their own pages**.
The UX determines how same-page expansion and separate-page presentation appear;
these are content relationships, not requirements for particular windows or panels.
The human also proposed selecting material within a page and choosing an operation
such as "explain", resulting in a new page. The assistant supports this as a clear
working distinction consistent with investigation-based page identity.

An offered expansion is explicitly part of the current treatment, whether its
material is already retained or obtained lazily. A selection-based explanation
asks a new question about selected content and therefore has its own underlying
investigation/page, with the originating content and relationship preserved.
This does not require a fresh page every time an existing explanation is revisited.
Identity/reuse follows the actual supported request, not matching labels alone.
The distinction depends on the declared operation/relationship, not merely the
word "explain": an offered expansion can itself contain explanatory detail.
Its availability as a diagram versus prose likewise does not decide placement.

### Follow-up mechanics versus book relationships

Inspection of the current follow-up contract confirms that an option supplies a
qualified, exactly identified executable request with meaning, subjects/context,
references and optional result requirements. It does not declare whether the
result elaborates the current page or belongs to a separate treatment. Invoking
an option is distinct from independently investigating a current selection.

The assistant proposes separating **how material is obtained** from **its role in
the book**. An expansion can expose retained content or invoke a follow-up request
to obtain elaboration; see-also and broader-context links identify separate page
treatments, likewise retained or evaluated lazily. Thus follow-up need not be a
fourth visible page category. Supplied hints or qualified composition can establish
elaboration versus a separate related treatment, and organization can establish
broader/narrower scope. Diagram/prose form and current availability do not establish
those relationships.

The initial see-also proposal (references to existing entities/answers) consequently
needs refinement for page navigation: a destination must identify or resolve to an
underlying investigation, with the source relationship and its qualification.
An Entity reference alone names a subject, not the investigation/page to open;
an exact answer remains useful as a historical selection, distinct from the current
page of its underlying investigation. This is a content-contract clarification for
discussion, not a selected schema or newly implemented routing capability. Existing
exact option identity is not replaced by matching similar labels or request text.

### Composition owns placement; entity pages as a candidate

The human clarified that the underlying investigator may supply hints, but the
page-composition agent decides whether material belongs as an in-page expansion
or a link to another page. Original hints are advisory; the composer has the
broader treatment/context needed for that decision. This allocates responsibility
without changing the earlier openness to mechanical, agentic or mixed realization
behind the composition investigation boundary.

The human proposed another useful kind of page: a presentation of an Entity.
The assistant sees a useful entry point for direct entity lookup and entity
referents. In the current model, the Entity supplies identity; names,
descriptions and other information are qualified associated material. A human
entity page would present selected understanding about it rather than just its
identity record or an indiscriminate dump of every association.

One proposed fit with the current working model is an entity-overview investigation
(for example, "what is this entity, and what do we know about it?") whose response
can be selected mechanically from existing material. The entity page is then the
book-style View of that investigation. Entity-only see-also hints could resolve
through a designated overview route, while more precise hints continue to name
particular investigations. This does not presume an extra inferencing call or
that the overview/default-route capability is already implemented.

The alternative is an entity-anchored page independent of any underlying
investigation, extending the working identity model to two page kinds. Neither
mapping is selected yet. The assistant favors exploring the overview-query fit
first because it preserves one account/composition model without inventing a
separate rendering or qualification regime. Entity-page content, default selection
and their relationship to the broader reference framework remain open.

### Entity-overview investigation selected as the working model

The human agreed to model an entity page through an **entity-overview
investigation**, with mechanical, agentic or mixed implementation behind the
investigation boundary as for other investigations. This resolves the preceding
choice in favor of the same page model: the Entity is its subject, and the overview
investigation is its underlying investigation and identity anchor. A separate
entity-only page kind is not needed for this proposal. The overview's exact content
contract and entity-link resolution remain to be specified; this agreement does
not claim that the operation is implemented or authorize implementation.

### UI aside: searchable index of visited pages

The human suggested a searchable index of all visited pages. This is a candidate
way to rediscover explored treatments, distinct from navigation history and the
reference framework's organization of broader or as-yet-unvisited material. Its
scope is visited pages; it does not imply exhaustive indexing of the potential
book or require cross-session persistence. Detailed indexing, search and display
behavior remain UI work.

### Proposal wording: define the page at the information level

On stepping through the proposal, the human asked to replace the task-oriented
"Clarify a page as" with a definition of the page at the information level, not
the presentation level. The proposal now defines a page as a treatment of a
particular investigation comprising qualified response material and composition;
its presentation is a book-style View. This refines the earlier shorthand
"a page is a View" while retaining investigation-based identity and the distinction
between qualified composition and rendering. No foundation definition was changed.

The human then challenged whether "information level" was good terminology and
reiterated that their suggested wording should receive independent critical
judgment, not automatic acceptance. The proposal now states its remit directly:
page content and composition, the investigations supplying them, and their
contracts; presentation is outside scope. No additional architectural "level"
is introduced. The intended distinction is retained without that vague label.

### Functional definition through a page-composition Lens

The human proposed describing a page functionally as the result of applying a
page-composition Lens to its underlying investigation and related context. The
proposal now expresses the page's content as that qualified result, using selected
responses and relevant context. In foundation terminology a particular composition
result is a Projection and its presentation is a View. Later composition results
can belong to the same page, whose continuing identity still follows its underlying
investigation. This sharpens the relation to foundation terminology without choosing
an implementation mapping or amending the foundation. It also keeps interpretive
composition in the investigation model rather than treating it as hidden rendering.

### Reuse existing investigation identity

The human challenged the proposal's claim that a precise identity/reference
mapping remained to be specified. The existing request-equivalence and Query-result
mechanism already distinguishes the continuing investigation from particular
invocations and retained answers, including fresh execution of the same question.
The proposal now directly uses that identity rather than inventing a new open
identity problem or discussing general semantic matching in the page definition.
Existing lifecycle limits remain those of the supporting mechanism; no broader
identity capability is implied.

### Name the composition result consistently

The human identified ambiguity between the model calling the Lens result "a
page's content" and the components section referring to "the composition itself".
The proposal now names the result consistently **page composition**: the qualified
selection of page components and their roles/relationships, obtained through the
page-composition Lens. Page content describes the material it presents, not a
second distinct Lens result. The composition and component material can be
addressed/revised independently, while the page's continuing identity remains
the underlying investigation's identity.

### Propose Page Component as an identified category

The human proposed making the component model concrete: **Page Component** as
a category adjacent to Entity and the query-side identity, sharing the attribute
mechanism. The proposal now uses the existing repository term **Query result**
for that adjacent identity (the organizing identity for answers, distinct from a
particular response). Page Components would have identities with qualified
associated content/descriptive information, using existing addition, supersession
and withdrawal semantics. Existing response material can be reused through
associations rather than copied into new explanations.

This replaces the proposal's earlier statement leaving the component category
entirely open. It is an explicit proposed extension: current association targets
are Entities and Query results, so Page Component support is not already delivered.
No governing document or implementation has been changed. Particular content
contracts and how a composition selects components still need clarification;
the category proposal does not settle physical storage or execution strategy.

### Propose Page and Page Component as adjacent identified categories

The human extended the category proposal to include **Page** as well as **Page
Component**, alongside Entity and Query result with shared qualified attributes
and associations. The proposal now makes both categories explicit. The Page's
identity remains determined by the underlying investigation; separate composition
results are qualified information about that Page, not new Page identities solely
because the selected material changed. Page Components can be reused across
compositions. This clarifies identity versus current descriptions without selecting
a storage mapping, altering governing documents or implementing the extension.

### Component-role mapping and PageComposition terminology

The human proposed describing composition as a mapping from component-role
keywords to component objects. The discussion accepted a mapping to Page Component
references, with role assignments carried through qualified associations rather
than an unqualified mutable dictionary. Collections such as see-also links may
be contained by a component; neither storage layout nor a detailed cardinality
schema is selected.

The human then proposed **PageComposition** and **PageComponent** as less overloaded
names for the identified categories. The proposal now uses those names instead
of Page and Page Component. PageComposition has the identity determined by the
underlying investigation and qualified role-to-component attributes; a particular
Lens result captures its qualified composition. "Page" remains the book-treatment
term, not an additional identified category. This replaces the earlier category
naming without abandoning continuing identity or retained qualified history.

### Unified components versus link collections

The human narrowed the collection distinction: title, orientation and main content
are presumed unified by the page-composition Lens; broader-context and see-also
components contain collections of links. The proposal now states those roles
explicitly instead of generally allowing any component to be a collection.
Unified main content remains compatible with presenting meaningful alternatives
and disagreement under the multiple-account policy; it is not a requirement to
force one conclusion. Main-content expansions remain part of that treatment.

### Separate main content and expansions

The human proposed separating **Main content** from **Expansions**, with expansions
able to reference the parts of main content they elaborate. The proposal now uses
six component roles: title, orientation, main content, expansions, broader context
and see also. Title, orientation and main content remain unified; expansions form
a collection alongside the two link collections. An expansion can identify a part
of main content or concern the treatment as a whole, and can supply material or
a request for obtaining it lazily. The reference is a semantic connection for the
UI to present, not a prescribed placement. Expansions still belong to the same
page; this separation does not turn them into see-also destinations.

### Component terms grouped by component

The human requested a subsection for each page component, in page order, with its
terms specified locally. The proposal now has Title, Orientation, Main content,
Expansions, Broader-context links and See-also links subsections. The existing
single-/multiple-account policy sits within Main content. The page-composition
contract refers to that policy rather than repeating unification requirements.
Shared lazy-investigation/connection behavior remains separate. This reorganizes
the proposal without selecting additional component behavior or producer details.

### Composition remit within book organization

The human accepted treating diagrams as an explanatory form rather than a separate
top-level component: a diagram can be main content, an expansion or contextual
explanation. It is not an expansion merely because it is a diagram.

While reviewing Title, the human proposed describing the page-composition Lens's
decision explicitly: it chooses the page title with the underlying investigation's
suggested title and broader-context information available. The detailed component
subsections now sit under **Page-composition Lens responsibilities**, following
the component summary and identified-object proposal. Its introductory remit is
to take the investigation/responses and situate a coherent page in the overall book;
it consults and can contribute qualified updates to book organization.

The proposal now introduces **Book organization** before the components, contrasting
organization of pages/explanatory responses with architectural organization of
software entities. This makes the distinction available before discussing the
composer's use of broader context; the later contract sketch references it rather
than repeating the conceptual introduction. Producer implementation remains behind
the investigation boundary.

### Inventory of investigation changes and separation of guidance from placement

The human requested an inventory of proposed investigation changes and identified
two uses of "see also": guidance from underlying investigations versus the final
page component. The proposal now inventories response titles, related-material
guidance, follow-up guidance clarification, page composition, entity overview,
book organization and supporting responsibilities whose separate contracts remain
open. It distinguishes these from existing prose/model, qualification, reference,
follow-up and reuse capabilities and notes the proposed association-target extension.

The assistant proposes reserving **see also** for the page role and naming
underlying reference suggestions **related material**. A suggestion identifies a
target (entity, investigation, answer or selected content), explains its relevance,
and can identify the part of the originating response to which it relates.
Follow-ups keep their executable requests and promised forms, with sufficient
relevance information. All retain ordinary qualification. These are optional
connections, not a duty to anticipate the entire book; no expansion-versus-page
placement field is required from the underlying investigator. Composition can
include, omit, supplement or place suggestions. This candidate guidance contract
is recorded for discussion, not treated as a settled schema or changed implementation.

### Composition now requires interpretation

The human observed that the proposed title, orientation, multiple-account treatment,
broader-context and expansion-versus-see-also decisions call for an inference
agent rather than purely mechanical composition. The proposal now explicitly
states that fulfilling the general composition remit requires interpretive
judgment. Earlier openness to wholly mechanical composition is narrowed by the
responsibilities since assigned to it. Reuse of qualified components/results and
delegation remain possible; presenting a retained composition need not rerun an
agent. Supporting investigations can still be mechanical, agentic or mixed. The
allocation and execution of inference remain outside this proposal's remit.

### Investigation performs the composition work

The human proposed using **page-composition investigation** rather than
**page-composition Lens** when describing its responsibilities, and explicitly
noted that this applies whether the implementation is agentic or mechanical.
The proposal now attributes choosing/supplying component material to the
investigation. The formal definition still uses the Lens application to describe
the qualified result; no general equation of "investigation" with agent execution
is intended. The responsibility heading and its links were updated consistently.

### Keep composition execution unstated in the proposal

The human clarified that the proposal can leave implicit whether composition is
agentic and whether one investigation obtains all components or supporting
investigations are composed. They expect agentic work and suspect a single
investigation may suffice, without selecting that implementation. The proposal
therefore removes its explicit inference-agent requirement and questions treating
execution decomposition as unresolved work for this remit. It retains the required
component judgments and information contracts. This changes what the proposal
specifies, not the earlier assessment that those judgments require interpretation.

### Main-content policy uses existing Query-result values

The human pointed out that the single/multiple distinction already comes from
the current values associated with the underlying investigation's Query result.
The proposal now states the policy in those terms, removing the informal-account
terminology explanation, the purported unresolved input-population question and
speculative synthesis-loop commentary. The existing mechanism supplies the
designated values; an individual designation can select several content items.
The related contract sketch now refers to those Query-result values as its inputs.

### Sources of expansion candidates

The human proposed limiting expansion candidates to guidance supplied with the
underlying investigation's result. The proposal now identifies both follow-up
options (requests for more investigation) and related-material suggestions
(references to material that may elaborate the treatment) as sources. Composition
selects which belong on the same page; it does not independently invent expansion
requests. This narrows the earlier general permission to supplement guidance:
book organization can still supply additional broader-context and see-also links.

### Composition frames existing accounts within the book

The human clarified the boundary of composition: it frames existing accounts in
book context, rather than producing new accounts of the software, and can
contribute to book organization. The proposal states this at the start of the
responsibilities section. Orientation and joint treatment still derive explanatory
text from existing accounts; composition does not investigate the software afresh
or originate new explanatory investigations. Both see-also and broader-context
links can draw on follow-ups, related-material suggestions and book organization.
Organization is expected to be the main source of broader contexts, with composition
judging whether the destination actually supplies a more encompassing treatment.
The orientation/guidance sketch is aligned with this boundary.

### Expansion material remains distinct from main content

The human clarified that composition chooses whether material, either already
supplied or obtainable through a follow-up, belongs as additional material on the
current page. The proposal consistently calls this "additional material" and
avoids "expose" as a definition of the content role. Main content derives from the
underlying investigation's current result values; composition cannot promote
follow-up or related-material candidates into main content. Those candidates can
supply expansions or links.

### Separate composition responsibilities from UI considerations

The human identified "Connections and lazy content" as a miscellaneous section
whose useful composition points belong in the responsibilities introduction.
The proposal moves advisory investigator hints and the standard entity-overview
investigation there, retaining a brief statement that expansion/link material need
not already exist. A separate UI-concerns section collects presentation,
navigation, selection/explanation, lazy access, qualification/history display and
prose-directed access considerations for future UI work. The old section and
repeated explanations are removed.

### Retire duplicated investigation contract sketches

The human observed that much of the contract-sketch section was no longer needed.
The proposal removes repeated purpose/input/output descriptions now covered by
composition responsibilities and proposed investigation changes. It also removes
separate orientation and joint-treatment sketches that suggested an unchosen
execution decomposition. The useful source-connection detail moves alongside
proposed investigation changes. A short remaining-questions section preserves
book-organization interfaces, context requirements and reconsideration, entity
coverage, and guidance reference needs. The discussion order is updated to match.

### Specify changes to the investigation contract against existing support

The human requested framing the changes as changes to the existing investigation
contract, removing the redundant placement qualification and identifying exactly
what follow-up guidance lacks. Inspection of the accepted structured-explanation
decision, FollowUpOption/Member/SubjectRef types, authoring instructions and wire
schema confirms that options already retain meaning, executable requests, optional
specialized result contracts, references and qualification. Current instructions
require the specific question, but not an explicit explanation of relevance.
The proposal strengthens the meaning requirement to include relevance and uses
existing references for source items/association uses, with their connection
explained in the meaning. This requires no new field. Independent component-level
source references are not currently supported: component selectors belong to
subjects/context, which identify investigation inputs. Such an extension is not
required by the present proposal. The broad open question about existing follow-up
support is replaced by the remaining target-reference question for related material.

### Explicit source selection for both kinds of guidance

The human agreed to an optional selection identifying the part of the reply a
suggestion concerns, then suggested replacing follow-up `references` rather than
adding a second field. Inspection found generic item/association references that
are validated, retained and delivered with the option, but no separately specified
purpose requiring their preservation alongside source selection. The existing
test's reference points at the state model being elaborated. Invocation obtains
its subjects and additional input from the request, not from this reference list.
The proposal now gives both related-material and follow-up guidance an optional
source selection, supporting an item, addressable component or association use,
and proposes replacing the generic follow-up references. This supersedes the
earlier choice to rely on generic references without extending their contract.
The review establishes current documented/implemented use, not certainty about
the field's original design intent. No implementation or adopted contract changed.

### Entity-overview remit and elaborating an existing answer

The human placed entity-overview coverage with the overview investigation rather
than this proposal; it can investigate the entity rather than merely summarize
what is already known. The corresponding open question is removed. The human
also proposed an elaborate investigation given an existing investigation, which
could enrich its answer through association replacement. This is a candidate for
improving the current page's main treatment, distinct from an expansion that adds
material alongside it. Under existing association semantics, such work can
contribute new content and supersede exact result designations for the original
Query result; it does not replace that Query result's identity or erase earlier
content. The page remains associated with the original underlying investigation.
Replacement is a qualified judgment, not an automatic consequence of producing
a longer answer; complementary or alternative contributions remain possible.
The human agreed with this distinction and use of association semantics. The
proposal now includes elaboration as a way to develop the existing main treatment,
separate from expansions. Detailed operation and execution design remain outside
this agreement.

### Reconsideration and recomposition after elaboration

The human raised whether elaboration would flag the page through needs
reconsideration or whether the UI would request recomposition directly. Existing
rules can give the producing composition a reconsideration cause when an acquired
answer association is displaced, or when an answer is added within an acquired
Query-result inventory scope. Merely holding a reference does not create that
exposure. This is a cause-bearing warning, not proof that the composition is wrong
and not an automatic rerun. The UI can request recomposition after elaboration;
application coordination determines execution/reuse. Reconsideration remains useful
for changes produced through other routes. No elaboration-specific invalidation
mechanism is needed in the page proposal on this account.

### Updating page inputs and distinguishing current status from retained Projections

The human requested clarifying that changes to a page's inputs can prompt another
page-composition investigation. The working model now states this for responses,
component material and organizational context, preserving page identity and exact
earlier results. They also asked whether another investigation replacing component
material makes the presentation out of date rather than the Projection. Existing
rules preserve the Projection's captured selections and qualification unchanged;
fresh access supplies later standing/reconsideration separately. A live page can
therefore disclose that it displays earlier material, but rendering cannot silently
substitute new component values into the retained Projection. Displaying revised
material requires a newly constructed qualified answer. Fresh selection and
construction may suffice when the existing composition still applies; changes
affecting composition judgments may require another composition investigation.
This is not a new mutable stale flag on a Projection or an implemented live-View
refresh mechanism. PageComposition/PageComponent remain proposed categories.

### Inventory of proposed investigations and first-slice elaboration scope

The human requested a list of proposed investigations and noted that elaborate
need not be included in the first slice. The proposal now lists page-composition,
entity-overview and elaborate, with that scope qualification. Book organization
is separately acknowledged as required with its investigation contract still open;
orientation and joint treatment remain composition responsibilities rather than
separately proposed investigations.

### Opening a page develops its immediate surrounding context

The human agreed that opening a page should include developing enough surrounding
context to situate it, rather than depending entirely on previously generated
accounts. A useful treatment can become available while its context develops;
a destination can be offered before its full account exists. Missing context is
a fallback, not the intended result merely because no earlier user generated it.
How organization and composition fulfill this experience remains for discussion.

### Restore the graph model of book organization

The human recalled the earlier graph of explanatory responses/pages, with optional
broader-than directionality and possible follow-up-to relationships. The proposal
now states the graph model explicitly. Broader-than is an explanatory relationship;
follow-up-to preserves an originating connection, distinct from navigation history.
The precise identity of graph endpoints remains an open contract question. The
assistant recommends stable underlying-investigation identities for book navigation,
with particular response/composition versions qualifying the relationships, rather
than requiring a new graph node for every response revision. That refinement has
not yet been agreed.

### Proposed content organization tags

The human proposed content organization tags to distinguish multiple organizations
of the book. Tags could be assigned to responses/pages/nodes, and broader-than
relationships could be qualified by particular tags. Assignment belongs to book
organization or page composition, rather than the underlying investigator,
because the tags express topics relevant to the developing book as a whole.
This remains a proposed extension rather than a settled tag schema or node model.
The assistant distinguishes node membership in an organizing topic/perspective
from an explicitly asserted broader-than relationship within it: shared tags do
not imply relative breadth, and overlapping tags alone do not define different
organizations. The proposal can support multiple organizations by qualifying
relationships as well as tagging nodes. Organizing components would need to share
the meaning/identity of tags rather than independently invent synonymous labels.

### Allow topic and perspective tags without separate categories

The human agreed that organization tags can identify both topics and perspectives
and proposed leaving their usefulness to the organization investigation. The
proposal now includes tags on nodes and tag-qualified broader-than relationships,
assigned by book organization or page composition, with shared meanings within
the book. It does not introduce separate topic/perspective categories: no current
contract requires different behavior for them. Exact tag representation remains
unspecified.

### Perspectives select tagged nodes and their contextual ordering

The human proposed expressing multiple perspectives by filtering nodes by content
tags and arranging them by partial ordering. The proposal now states this, with
the ordering drawn from broader-than relationships in the selected context.
Unrelated nodes need not be comparable. Different contexts can order the same nodes
differently, so a union of tag selections does not automatically supply a single
valid combined partial order. Follow-up relationships remain separate from breadth.

### Perspective selection as presentation

The human asked whether perspective selection belongs only to the UI or also
affects analysis, leaning toward UI only. The proposal takes that working direction:
analysis establishes tags and qualified relationships, and presentation selects
and arranges the supplied graph. The UI's selected tags are not investigation
parameters. Changing perspective therefore does not automatically rewrite title,
orientation or main content. Organization and composition still reason about
topics/perspectives when producing relationships and explanations; this is
distinct from depending on the user's current display selection. The graph is
supplied through qualified Projections rather than discovered by rendering from
mutable accumulated state. Requesting additional graph material remains a request
for information, distinct from filtering supplied material.

### PageComposition identities as graph nodes, qualified results carrying tags

The human proposed that book-graph nodes be PageComposition identities, with tag
assignments carried by results so later investigations can revise them. This
refines the earlier endpoint discussion: a PageComposition identity is already
determined by its underlying investigation, so using it as the book node preserves
the same continuing page identity while expressing the book-level role directly.
The proposal now uses these nodes and treats tags as qualified attributes supplied
by results, revisable through the association mechanism. It allows a node to be
identified before full composition, preserving lazy destinations. A tag revision
does not require a new node or a rewritten underlying architectural account;
fresh qualified selection can capture current assignments. The endpoint-identity
question is removed from the remaining book-organization questions.

### Introduce the book before the detailed page and graph models

The human broadened the proposal's stated purpose from defining a page to making
concrete the reference-book experience, and requested introducing book organization
before the page model. The proposal's title and purpose now reflect that remit.
Book organization starts with pages, relationships and tags, then introduces the
graph and relationship kinds. Page model follows, without "Working" in its heading.
Graph identity, qualified tag assignments and perspective filtering are collected
after Page components, where PageComposition has been defined. This also records
the agreed ability to establish a PageComposition association target before its
content exists, then populate the same object through subsequent investigations.

### Tags are PageComposition attributes rather than page components

The human agreed that book organization tags belong directly to PageComposition
as qualified attributes rather than introducing another PageComponent role, and
requested making this explicit. The PageComposition definition now distinguishes
its component references from its tag attributes. Displaying tags in the UI does
not require separate component identities.

### Graph relationships as qualified PageComposition attributes

The human asked whether relationships to other PageCompositions are themselves
qualified attributes. The proposal now expresses graph relationships this way:
the associated material identifies the related PageComposition, relationship
meaning and applicable book tags, with normal qualification and association
revision semantics. The graph is expressed through these attributes, while a
page's broader-context/see-also components select organizing relationships for
the treatment. No additional relationship-object category is introduced.

### Consolidate the object definitions

The human requested collecting the scattered PageComposition specification under
Page components and composition, with separate object subsections and the diagram
paragraph before them. The proposal now defines PageComponent and PageComposition
there. PageComposition's stable investigation-based identity, ability to exist
before content, component references, book tags, relationship attributes and
association revision semantics are together. Organization graph and perspectives
retains relationship/tag meaning and presentation behavior rather than repeating
the object specification. The summary inventory and section link are updated.

### Separate PageComponent content type from its role in a composition

The human agreed to content type as the basis for component structure/schema,
rather than fixing a role on PageComponent. The definition now distinguishes that
type from the role in a PageComposition's mapping, preserving reuse of a component
in different roles across pages. Existing content types should be used where
applicable; no separate duplicate type system is prescribed.

### Follow-up relationships as context for organizing investigations

After questioning a concrete UI use for follow-up-to relationships, the human
suggested they could inform page composition and organization. The proposal now
states this use: the originating treatment and reason for a further inquiry can
help identify relevant contexts and connections even without a direct UI display.
Source selection and follow-up meaning supply useful detail behind the connection.
The relationship is input to an organizing judgment, not proof that either endpoint
is broader. Its usefulness can begin when the follow-up is offered, before it is
executed; it is distinct from the reader's click history. Storage versus derivation
from retained follow-up information remains an implementation choice.

### Follows-up-from remains a candidate rather than a slice requirement

The human noted that the need/usefulness of follows-up-from relationships has not
been established and asked whether to defer them. The proposal now specifies
broader-than as the initial relationship type and records follows-up-from as a
candidate to validate, not a first-slice requirement or promised later feature.
Its direction is from follow-up page to originating page. A possible benefit for
organizing investigations remains a hypothesis, particularly because the retained
follow-up metadata already preserves originating information.

### Default context boundary for book-level objects

The human proposed that PageComposition/PageComponent normally not be offered as
context to source investigations, while architectural accounts remain available
to composition and book objects remain available across page-composition
investigations. The proposal records this in the object-category inventory as a
default context-selection boundary, not an absolute access restriction. Software
investigations use repository evidence and relevant architectural accounts;
explicit investigations of selected page content can receive that content.
Book organization and page composition can use existing accounts and book objects
from other pages. This does not change the qualification of any selected material.

### BookOrganizationTag as an identified association target

The human proposed identifying tags independently of their names so renaming does
not require retagging all uses. The proposal now includes BookOrganizationTag as
an association-target object, with qualified name/description attributes. Page and
relationship tag assignments reference its stable identity. The object inventory
and context-boundary wording include this third book-level category. Renaming a
tag is distinct from materially redefining the category, which may require
reconsidering assignments rather than merely changing the displayed name.

### Focused book-tag investigation and possible wider maintenance

The human proposed that page composition select from current tags, requesting a
tuned book-tag investigation when tags seem missing or inadequate. The request
supplies capsule page context, the mismatch and the intended distinction; relevant
references let the investigator acquire further context. The proposal now describes
this investigation and includes it in the inventory. It can return suitable
existing tags as well as allocate new ones, and owns tag-set coherence rather
than treating every proposed new label as necessary. Reassessing the set and
retagging existing pages/relationships, immediately or through marked work for
later reassessment, remain possible extensions. A capsule can motivate a broader
review but does not by itself establish how other pages should be retagged.
Normal reconsideration catches some changes to acquired tag information/scopes;
new tags or changed category boundaries need not automatically flag every affected
assignment. Deferred maintenance therefore needs identified affected work rather
than assuming the current reconsideration mechanism handles it all. A pending
reassessment is not a completed replacement of tag assignments.

### Do not assume lazy tag reassessment or reader-managed maintenance

The human agreed with the book-tag refinements and questioned whether lazy
reassessment would be useful or feasible for correctness. They floated a UI for
proposed reorganization followed by a wait for updating, while finding it inelegant.
The proposal now leaves wider reorganization outside the initial book-tag contract
and removes lazy marking as an assumed strategy. Tag meaning changes and affected
assignments must be considered together; pending reassessment alone does not make
old assignments suitable for a new meaning. A reviewable reorganization proposal
could be useful, but no user-operated maintenance flow is adopted. Keeping the
previous organization available while preparing a coherent revision is a possible
approach, not a selected implementation or general atomic-update requirement.

### Seed organization through acquired accounts and module context

The human agreed to treating an empty book and an existing book through the same
organizing responsibility, then proposed direct access to the underlying result
rather than only a capsule. Following result referents in the mechanical module
hierarchy could lead to entity-overview investigations of ancestors; top-level
overviews could add context from the other direction. The proposal now describes
book organization as an investigation with this access and authority to obtain
missing architectural understanding. These traversal approaches are illustrative,
not mandated algorithms or a requirement that the book mirror repository nesting.
The resulting understanding can inform surrounding page identities, qualified
relationships and tags. The book organization investigation is added to the
inventory; details of its returned context and composition's contributions remain
open. Tag-investigation capsule references likewise allow acquisition of the
underlying result, rather than restricting the investigator to the summary.

### Overview guidance discovers potential architectural treatments

The human clarified that the module tree is a stable starting point for overview
investigations, not the book structure. Traversal can be agent guidance, with the
investigator choosing useful breadth/depth. They suggested that an entity overview
could explicitly identify relevant architectural investigations, possibly with a
more focused investigation if useful. The proposal uses existing follow-ups as the
natural way for overviews to offer those questions, without selecting another
specialized investigation yet. Tags organize existing and potential architectural
treatments rather than classify entities. The source overview identifies worthwhile
architectural questions using the architectural vocabulary; book organization and
the tag investigation determine their book-level categories. This preserves the
context/authority boundary for source investigations.

### Consolidate organization and tag maintenance into one investigation

The human found the split between book organization and book organization tag
investigations confusing and requested one organizing responsibility. The proposal
now has one book organization investigation owning graph and tag-set coherence,
with a subsection for starting an empty organization. Page-composition
responsibilities explicitly include selecting current tags and requesting book
organization when tags or surrounding context are inadequate. The request conveys
capsule context, the mismatch/needed distinction and access to the underlying
result. BookOrganizationTag is introduced within the unified organization section;
the separate tag-investigation inventory entry is removed. Wider reorganization
remains a possible extension rather than an initial requirement.

### Organization receives the result and an explanation of the need

The human proposed simplifying organization input to an architectural investigation
result plus an explanation of inadequate tags or possible additions, rather than
a capsule describing the result. The proposal now states this at both the requester
and receiver, also allowing a need for missing surrounding context. Available
architectural accounts include the module inventory; it is no longer listed as
a separate kind of input alongside them.

### Close the listed contract questions at proposal scope

The human asked whether the remaining contract questions had been dealt with.
The proposal now describes organization's inputs, tag/page/relationship outputs,
composition's organizing contributions, and requests for missing context. Update
and reconsideration behavior follows the existing qualified association/Projection
model; unavailable or incomplete work retains ordinary qualified-outcome semantics.
The obsolete remaining-questions section and its next-discussion instructions are
removed. This is closure of that question list at the proposal's scope, not adoption,
proof of usefulness, or an implementation design. Wider reorganization, optional
elaboration/follows-up-from, detailed UI, and INVEST's methods remain in their
recorded scope categories.

### Whole-proposal consistency review (2026-11-22)

At the human's request, the assistant read the complete proposal against the
accumulated agreements and the adopted Lens/Projection, association and exposure
semantics. The review made these editorial corrections:

- Distinguish the stable PageComposition object from the qualified Projection
  returned by a Lens application; continuing page identity follows the underlying
  investigation rather than being a particular execution or response.
- Restore the read-only understanding role and architectural vocabulary rather
  than a fixed template, both established earlier in discussion.
- Remove wording suggesting broader-than graph relationships also define see-also
  links; their respective contracts already distinguish these roles.
- State the agreed obligation to request organization when surrounding context is
  insufficient, and organization's authority to acquire missing software accounts.
- Remove repeated scope/placeholder explanations and tidy paragraph wrapping.
- Qualify the linked Cockatiel exercise as earlier content/evidence work, not a
  complete walkthrough of the current object and organization contracts. Its old
  five-role grouping and open-object-model language still need a separate refresh.

One content point merits human discussion: substantive previews were part of the
reference-book hypothesis, but the current proposal mentions previews only as a
presentation concern. Their supply is not assigned: existing account excerpts,
authored link descriptions and preview accounts have different implications.
The review does not silently require a new preview component or investigation.
The optional glossary, detailed implementation, UI realization and broader
maintenance mechanisms remain outside the current required contract rather than
being reopened as mandatory scope questions. No adopted documents or product
code were changed.

### Preview policy and conformance of the Cockatiel exercise

The human chose ordinary investigations requested optimistically by the UI as the
initial source of preview content, with another preview-production mechanism kept
as a candidate capability. The proposal records this through normal application
coordination; no separate preview investigation or component is required, and no
steering material was changed. This resolves the content point raised by the
whole-proposal review.

At the human's request, the Cockatiel exercise was revised against the complete
current proposal. It now demonstrates stable PageComposition identities, six
component roles, typed/reusable PageComponents, BookOrganizationTag identities,
tagged broader-than edges, the organization request and UI-only perspectives.
The diagram and transition details already supplied in the underlying result
remain main content. Progressive disclosure of those details is distinguished
from an expansion supplied by an offered follow-up. Authored candidate guidance
offers a focused post-isolation sample-completion clarification as an expansion
and concurrent-caller interactions as a separate page. These draw on preserved
M2/M4 trial records without transplanting exact option identities or fabricating
missing answers. The original prose remains unavailable; the main prose is an
explicitly authored stand-in, not a claimed rewrite required by composition.
The exercise now uses the agreed single-/multiple-value policy and update model,
and removes superseded open questions and its obsolete walkthrough-resumption
instructions. Preview descriptions of unproduced investigations remain proposed
questions rather than generated answers. No new inference or code execution
against Cockatiel was performed.

### Initial assessment of Claude's proposal review (2026-11-22)

Claude reviewed checkpoint `fcbb399`. The assistant read all twelve findings and
the optional suggestions against the proposal and relevant adopted semantics.
This records an initial assessment, not human agreement to the recommendations;
the proposal and exercise have not been changed in response to this review.

- Findings 1 and 2 expose important boundaries: identifying an executable page
  destination before its first evaluation, and relating a composition's selected
  answers to later changes and ordinary operation reuse. Request identity,
  Query-result identity and composition identity need clearer connections. The
  authority of book organization to originate useful investigation requests also
  deserves an explicit statement. Automatic semantic merging is not promised.
- Finding 2's recommended explicit recomposition policy is a possible solution,
  not a consequence that the adopted rules force on the product. We should first
  decide the intended behavior when opening a page after its inputs change, then
  distinguish new selection from new interpretive work. Competing component
  mappings must not acquire an implicit latest-wins rule.
- Finding 3 correctly asks what remains available without an underlying answer
  or complete composition. Its suggested ban on titles for unanswered pages is
  unnecessarily restrictive: identifying a question is not claiming an answer.
  Its proposed outcome paragraph also needs care to preserve the adopted
  distinction between attempt reporting and qualified answer outcomes.
- Findings 5 and 6 warrant discussion of agreement between broader-context links
  and graph relationships, and of cycles within a claimed partial ordering.
  Choosing an attribute owner is not by itself a coherence policy. Filtering to
  selected nodes already has an intelligible induced-subgraph meaning; automatic
  inclusion of relationship endpoints is a possible UI choice, not a necessary
  correction to the model.
- Findings 4, 8, 9 and 10 identify useful places to clarify inherited qualification,
  immutable selections, Session lifetime and intentional component sharing. They
  do not establish that qualified composition may never use another composition,
  that every late result requires one particular View structure, or that shared
  component identities must be removed. A page-specific edit to shared material
  does need to preserve the other pages' intended meaning.
- Finding 7 overstates the terminology conflict. Core concepts distinguish a
  general Expansion from a standard expansion and explicitly permit coordinating
  another Lens's answer. A book expansion need not be a standard expansion; a
  brief clarification may suffice without renaming the component.
- Finding 11 identifies a real destination distinction: a link referring to an
  exact answer or selection cannot silently become a link to different current
  material. Finding 12's multiple-part source selection is a small clarification
  consistent with the intended contract.

The review reports the exercise faithful to its retained evidence and careful
about authored material. Its suggested explicit paraphrase label is reasonable.
Identity before evaluation is a useful first discussion because it underlies
opening destinations and the subsequent update policy.

### Registering a question before producing an answer (2026-11-22)

The human separated the practical identity question from the epistemic question
of organizing unevaluated treatments. Inspection of the current implementation
shows that the low-level separation already exists: `ContributionLedger.invoke`
registers an Invocation and its Query result without starting production or
calling an agent. Equivalent ordinary requests reuse those identities.
`contributionEvaluation.evaluate` calls this registration operation first and
separately decides whether to reuse completed production or conduct a dialog.
An identity registered without production therefore does not itself count as a
completed evaluation or prevent later evaluation.

This narrows the initial assessment of review finding 1: an architectural
question can already have an identified, initially unanswered Query result.
The name `invoke` should not be read as proof that answer production has begun.
The proposal still needs to specify how organizing work requests this
registration and connects the resulting identity to its proposed PageComposition
object; that book-level object is not an existing engine category. A fully
specified request with valid subject/context references is required, not merely
a prose page title. No additional standalone query-identity category or dummy
producing investigation has been shown necessary.

This finding does not settle how reliable prospective tags or broader-than
relationships are, nor adopt the review's recommendation to replace the page's
identity model with a new request-key scheme. No implementation was changed.

### Revising prospective organization after investigation (2026-11-22)

The human observed that the association mechanism already permits tags and
relationships to be revised when the page is investigated. Changes to the book
organization are an ordinary consequence of developing understanding; how the
reader experiences those changes is a UX concern that exists regardless of
whether pages were organized before evaluation.

The assistant agrees that this substantially reduces the additional design
problem. Prospective organization need not become a separate immutable structure
or require a new lifecycle merely because its judgments precede an answer.
Technically, page tag assignments and graph relationships are qualified
attributes of PageComposition objects; BookOrganizationTag objects carry the
shared tag meanings. Both use the proposed association mechanism for revision.

The remaining responsibility is to consider the actual architectural answer
during page composition, reassess the page's organizing judgments, and revise
them or request book organization work where needed. Changing a shared tag's
meaning remains an organization responsibility, rather than a page-local edit.
Producing a new answer does not itself automatically supersede earlier organizing
associations. Appropriate changes must be expressed through the existing rules.

No separate question-scope versus achieved-coverage taxonomy is selected here.
Organizing claims retain their meaning, basis and qualifications and may be
revised as understanding develops. The mechanics of reassessment belong to
INVEST; communicating consequential changes and preserving navigation continuity
belong to UX. Exact earlier Projections remain unchanged.

On further discussion, the human observed that correcting earlier judgments is a
normal investigation responsibility applying to all page components. The explicit
reassessment paragraph was therefore removed from the proposal as redundant;
tagging does not require a special correction rule. The UX concern remains.

To make the prospective-organization case explicit without introducing a special
rule, the human suggested explaining it under Starting the organization. The
proposal now states that assignments and relationships for unanswered questions
are educated judgments from the questions and available architectural context;
composition using actual answers revises them as appropriate under the normal
association mechanism, requesting organizing work where needed.

The human also suggested that later related investigations might cause the
initial organizing contribution to be marked for reconsideration. Existing
exposure/reconsideration machinery can derive such status from relevant changes
to actually acquired information or selection scopes. Evidence citations and
referent links alone do not establish that exposure. Whether the organizing
investigation acquires a scope covering a later addition matters; merely being
about a related entity is insufficient. This is an existing status mechanism,
not automatic rerunning, correction or scheduling. Its use for the proposed book
objects remains implementation work, rather than a new guarantee in the proposal.

### Main treatment when findings are limited (2026-11-22)

The human distinguished failure to execute an investigation, handled as a failed
page opening by UX, from a completed investigation returning little useful
material. The latter can supply the main finding, or composition can explain the
lack of substantive findings from the returned material. This does not require a
separate page model or a general new edge-case mechanism.

At the human's suggestion, the Main content policy now uses existing explanatory
content directly when there is exactly one current associated value providing a
substantive answer. Otherwise interpretation supplies a coherent net treatment of
available results and their limitations, including multiple contributions or lack
of substantive findings. "Substantive answer" avoids equating success with positive
findings: a useful finding of absence or uncertainty need not be rewritten. The
policy retains source qualifications and does not turn attempt-only diagnostics
into architectural findings.

### Architectural questions as concept and subject (2026-11-23)

The human clarified that page queries, including those proposed by organization,
take the form (concept, subject), leaning into established architectural concepts;
the experience does not expose arbitrarily worded prose investigations. Different
titles or descriptions therefore do not themselves define different questions.
The proposal now makes this explicit and states that organization can select or
propose investigations, rather than only select previously offered questions.

This constrains the duplicate-question concern raised in review finding 1 without
requiring semantic matching of arbitrary prose. The pair describes the question,
not a replacement for the existing complete request-equivalence contract:
parameters, selected context, result requirements and applicable delegated-option
identity still matter. Intended future prose access remains a way to open relevant
book treatments, rather than an assumption of arbitrary-prose question identity.

The human then refined the question model: it selects a predefined investigation
type, subject and parameters, rather than always pairing an architectural concept
with a subject. Examples include elaborate, explain, entity-overview and
investigate architectural concept, with the concept a parameter of the last.
The proposal uses this more general formulation. These examples do not establish
a complete catalogue or make every named capability mandatory for the first slice.

The human identified the predefined investigations as part of what makes the book
stable and familiar. This framing now introduces the query model in Purpose and
remit, rather than presenting it only as a detail of page identity.

### Page freshness and review issue 2 (2026-11-23)

The human considers review issue 1 addressed by the revised proposal, which
should stand on its own without a separate reply to the reviewer.

For issue 2, the human's preferred UX is that when PostCode has reason to believe
a page is out of date, it notifies the reader and preferably updates the page
automatically and notifies them of the update. The immediate design question is
how PostCode knows that the page may be out of date, rather than starting from a
requirement for manual recomposition.

The assistant agrees with this framing. A freshness concern means that the
page may need revision relative to its intended current inputs; it does not by
itself prove its treatment wrong. Existing exposure/reconsideration can provide
causes, but coverage depends on the actual information and scopes acquired by
composition. In particular, acquiring only one exact answer differs from
acquiring the scope of current answers, where a subsequent addition can matter.
After detecting a relevant change, selecting already revised material and
performing new interpretation remain distinct ways of updating the page. The
freshness contract and its coverage remain under discussion; no new automatic
refresh mechanism has been implemented or specified here.

The human confirmed that needs reconsideration is the intended mechanism for
this question: whether the page needs reconsideration. The proposal now states
this explicitly. The remaining investigation concerns its input/exposure coverage
and the response to a detected cause, rather than inventing a separate page
freshness mechanism. This does not imply that current reconsideration machinery
already schedules or performs updates.

The human noted that input tracking is already part of the existing mechanism,
not an additional page-design obligation. To express this structurally, Page
model now introduces the page-composition investigation as using investigrams
and producing attribute associations for PageComposition and PageComponent
objects. Its contributions participate in the ordinary epistemic qualification,
revision and needs-reconsideration mechanisms. The page-composition Lens uses
that investigation and selects its results into a Projection. This replaces the
separate page-freshness sentence and avoids suggesting a special tracking system.

### Single current values for page framing (2026-11-23)

The human proposed restricting PageComposition and PageComponent associations
instead of requiring presentation to handle competing values for every component.
PostCode's architectural accounts may overlap or compete, but the page framing
can supply one current treatment of those accounts. The agreed contract gives
singular attributes at most one current value: initial establishment is allowed,
and subsequent changes replace or withdraw rather than leave competing standing
values. This is an explicit constraint on the proposed book objects, beyond the
unrestricted multiplicity of the existing association mechanism.

Collections remain possible. INVEST can choose between a single collection value
replaced atomically and individually added or withdrawn members. The uniqueness
constraint applies to singular attributes; collection cardinality is not limited
to one member. Whether that constraint also governs an enclosing collection value
depends on the chosen representation. Implementation must preserve uniqueness
even when independent investigations attempt updates to the same earlier value;
simply requiring each declaration to say supersede would not by itself ensure it.

Qualification and historical access remain intact, as do alternatives in the
underlying architectural accounts and their unified treatment. This replaces the
earlier suggestion that UX must necessarily handle alternative component values
under the general association rules. No rule for automatic precedence among
architectural accounts is introduced, and no implementation mechanism is chosen.

### Follow-up: presentation generality under a page-only model (2026-11-23)

The human observed that if PostCode adopts pages as essentially its only
presentation, some existing presentation rules and mechanisms may no longer be
needed. We agreed that removing them now would be premature, but should record
a follow-up to reassess that generality if a page-only experience is adopted.

Candidates for reassessment include arbitrary Lens/Presentation combinations,
presentation selection and general compatibility machinery. Prose, diagrams and
collections might be handled as page-component renderers rather than independently
selectable Presentations. Qualification, exact-result preservation, disclosure of
changes and separation of presentation from inference remain semantic obligations.
This is a possible future simplification, not a decision to change the adopted
model or part of the current proposal's implementation scope.

### Inspecting the inputs to a unified treatment (2026-11-23)

The human noted the limits of mechanically enforcing composition's semantic
obligations, particularly whether a unified treatment faithfully preserves
alternatives. Structural checks can retain sources, qualifications and input
coverage, but cannot prove that the interpretation represents them adequately.
The treatment remains attributable interpretation under the existing epistemic
contract; enforcement methods belong to INVEST.

The human suggested that UX allow inspection of the underlying results when the
main treatment is not simply a direct use of a sole existing answer. This is now
recorded in the proposal's UI concerns. Such access supports examination of the
synthesis; it does not relieve composition of its obligation to represent material
alternatives and limitations in the treatment itself. The relevant inputs are the
exact results used for the synthesis, not silently substituted later answers.

The human clarified that this access applies to other synthesized page components
as well as main content. The proposal's UI concern now covers page components
generally and their underlying material.

### Review issue 3: incomplete and failed page investigations (2026-11-23)

Much of the third review finding is covered by the distinction already discussed:
failed execution belongs to ordinary outcome handling and UX, while limited
findings can be presented under the revised main-content responsibility. The
human asked whether to explicitly list failed-page UX outside this proposal's
remit. The existing UI concern for pending, partial and unavailable results now
also names failed page or expansion investigations and offering retry. This does
not prescribe a new failure-state model or retry mechanism.

### Review issues 4 and 5: qualification and broader-context links (2026-11-23)

The human agreed that issue 4 is covered by composition's explicit participation
in the existing epistemic mechanisms. Qualified composed material can inform
later composition without becoming independent repository evidence; no blanket
ban on consuming other compositions is adopted.

For issue 5, we agreed to make the connection between broader-context links and
the book graph explicit: links select and describe broader-than relationships,
which page composition can establish or revise when considering candidates.
Links carry the applicable relationship tags. The human observed that this may
require establishing destination PageComposition objects before evaluation, just
as book organization can. The proposal now explicitly permits page composition
to register the candidate investigation and establish its destination object
before that investigation is evaluated. This does not expand its remit to
inventing new explanatory questions; it acts on the existing candidate sources.
The storage endpoint and update mechanics remain implementation choices.

The human refined this to avoid copying relationship tags onto links: composition
establishes or reuses destination objects and creates or revises the tagged graph
relationships directly. Broader-context links refer to destinations. Presentation
filters them using tags on the corresponding relationships, so a tag revision
does not require a matching edit to a link. The proposal and the exercise's
broader-context section now reflect this single location for relationship tags.

### Review issue 6: perspectives and cycles (2026-11-23)

Perspective selection and endpoint inclusion are UI choices; supplying the
qualified graph is implementation work. For cycles, the human chose to describe
broader-than relationships as typically forming a partial ordering within a
perspective, rather than guarantee an acyclic graph. Explicit cycle checking is
deferred until cycles become a practical problem. The proposal now states this
and describes UI arrangement using the applicable relationships without assuming
they always constitute a partial order.

The human subsequently simplified this: arranging pages using the applicable
broader-than relationships is sufficient, without a partial-order claim or an
explicit deferral of cycle checking. Presentation may tolerate cycles, so the
proposal should not assume checking is needed. Those two sentences were removed;
no acyclicity requirement is adopted.

### Review issue 7: existing expansion usage (2026-11-23)

The human identified the collision with the earlier application expansion model
as real, even though the reference-book model need not conflict with the product
foundation. Two options were considered: rename the book component and revisit
retirement of the old concept under a page-only model, or retire an unused old
concept now and reclaim the term.

Inspection shows standard expansions are actively integrated into the current
implementation. Module expansions supply exports, documentation and composition;
organization uses group details, and dependency presentations include repository
layout. Presentation contracts request these, evaluators materialize them, and
qualified answers retain their content and outcomes. Agent evidence access also
uses exports/documentation expansions, so this is not solely a presentation label.
Existing tests exercise expanded versus unexpanded answers and exact presentation
without acquiring missing detail. This inspection did not run those tests.

The assistant therefore recommends renaming the proposed book component, with
"supplements" a candidate, and retaining a follow-up to assess whether the old
concept can be retired or replaced under a page-only model. Retirement would need
to account for currently used functionality rather than delete unused terminology.
No rename or retirement is adopted by this assessment, and no governing material
or implementation was changed.

The human asked about committing to the book versus retaining the previous
experience while validating it. The assistant recommended a bounded transition,
but no migration strategy was adopted. The human directed the proposal to record
only the design implication: in a book-only model, the earlier presentation model
and Expansion mechanism should be examined and unnecessary parts retired. This
now appears under Proposed changes and additions. Adoption and migration remain
outside this proposal's remit; the foundation's semantic obligations remain.

### Additional detail terminology (2026-11-23)

The human chose **Additional detail** in place of **Expansions** for the book
component. The proposal, Cockatiel exercise and notes index now use that term,
with `additional-detail` as the illustrative component-role keyword. Historical
discussion terminology is retained. References to the existing application
Expansion concept and standard-expansion framework remain unchanged and distinct.

### Future capability: chapters and sections (2026-11-23)

The human suggested grouping related pages into chapters, and chapters into
sections, potentially with agent-authored overview or introductory material.
Multiple groupings could coexist, and the chapters or sections could themselves
carry book organization tags. This would not require one canonical hierarchy.

The UI could derive some grouping from the existing graph, while interpreting
agents could judge which pages belong together and explain the resulting
organization. Such a grouping need not merely reproduce broader-than links:
complementary treatments can belong together without one encompassing another.
Authored introductions and inferred grouping judgments would retain the usual
qualification and provenance.

This is recorded as a potential future capability, outside the current required
contracts. Whether groups need new identified object categories or can be
represented through existing investigations and book objects remains open.

### Consolidating future directions in the proposal (2026-11-23)

The human requested copying future capabilities and follow-ups into the proposal
so that it stands on its own, explicitly preserving these discussion notes.
A Future capabilities and follow-ups section now collects chapters/sections,
the supporting architectural vocabulary, intended prose access, optional
elaboration, candidate follows-up-from relationships and preview production,
wider reorganization, possible page comparisons, separate persistence/input-change
scope decisions and conditional presentation simplification. It distinguishes
their statuses rather than treating every idea as committed deferred work.
Detailed UI concerns remain in their existing section; earlier discussion and
rationale remain here unchanged.

### Review issue 8: late-arriving additional detail and previews (2026-11-23)

The human agreed to record the representation of newly obtained additional detail
and previews as a UI/implementation concern: they could be selected into a new
page Projection or coordinated as separate qualified Projections in its View.
The proposal does not require one representation for all cases. Existing
qualification and immutable-result obligations apply in either case. The relevant
section is now titled UI and implementation concerns outside this proposal.

The future-directions section was also renamed Future capabilities and related
work, and presentation simplification labeled a conditional design implication,
to avoid overloading the investigation term follow-up.

### Review issue 9: Session lifetime and persistence (2026-11-23)

The human considers issue 9 addressed by Future capabilities and related work,
which explicitly leaves persistence across sessions as a separate scope decision.
The page model follows existing investigation identity rules; the proposal does
not establish cross-session continuity. No further proposal wording was added.

### Review issues 10 and 11: shared components and link destinations (2026-11-23)

For issue 10, the human observed that respecting the meaning and scope of a
shared component is already an investigation responsibility. No special revision
rule was added. The incidental phrase "reusable across compositions" was removed
from the object inventory.

For issue 11, we distinguished related-material references used by composition
from the resulting links, which specify destination page investigations.
"Exact answer" was the reviewer's wording; the proposal had not defined a
separate answer destination category. Related material now names entities,
investigations or retained content, including whole responses and selected parts.
An entity-derived link uses entity-overview; retained content can be a subject
for explain or inform selection of another relevant investigation. Exact source
material remains part of normal qualified provenance, not an additional book-link
category. The human requested this framing in the responsibilities introduction,
which now states it in place of the entity-only link paragraph.

### Review issue 12 and optional suggestions (2026-11-23)

The human accepted the clarification that a source selection can identify one or
more parts of the reply. The proposal now explicitly permits multiple selected
items, components or association uses without choosing a representation.

The assistant also checked the review's optional suggestions. The exercise's
transition-detail table now labels its prose as paraphrase. Mapping proposed
investigations to existing summarize/examine operations is relevant implementation
work, not a requirement to create duplicate operations. The first-page entry route
belongs to UI work; possible upward cascades and latent destinations are largely
covered by establishing destinations without evaluation and without constructing
the whole book. Perspective-independent page content is already explicit. The
assistant found no further mandatory design decision in these suggestions;
this assessment does not claim implementation or empirical validation.

### Consistency pass after the review discussion (2026-11-23)

At the human's request, the assistant read the revised proposal and Cockatiel
exercise together against the review discussion and checked the retained state
models supporting the exercise. The pass made the following corrections:

- Align the exercise with registration before evaluation, investigation-backed
  composition and the singular-attribute uniqueness contract.
- Describe proposed destination investigations using investigation types,
  subjects and concept parameters, keeping actual historical requests distinct
  from the proposed catalogue and unresolved illustrative request descriptions.
- Remove the exercise's implicit choice of which graph endpoint stores an
  organizing relationship, and update entity-derived destination wording.
- Carry the agreed source-selection cardinality, synthesis responsibility,
  underlying-material access and refresh preference into the exercise.
- Preserve the implementation choice for late-arriving additional detail and
  previews, and keep graph tags separate from destination links.
- Clarify that the future choice about following or pinning concerns changing
  software inputs, rather than reopening the preferred refresh behavior for
  changes in accumulated understanding.
- Tidy terminology, wrapping, grammar and the notes index description.

The pass found no additional design decision requiring human resolution. All
23 local links and image references in the proposal and exercise, including
anchors, were checked, and the six component-role sections agree. The diff passed
whitespace checks. No generated diagrams, retained validation evidence, adopted
documents or implementation were changed, and no new live inference was run.
The human subsequently authorized committing this checkpoint.

### Initial assessment of the re-review at 828590d (2026-11-23)

The human supplied Claude's re-review of checkpoint `828590d`. It treats the
earlier findings as resolved, settled by choice or explicitly deferred, except
for narrower residuals concerning updates and broader-context relationships.
The assistant read the full report. The following is an initial assessment,
not agreement to adopt its recommendations; the proposal and exercise have not
been changed in response to this re-review.

- **A, catalogue and operation identity:** mapping proposed investigation types
  to existing operations belongs to implementation. Different result contracts
  already distinguish requests under the adopted identity rules. The exercise
  should keep the diagram requirement explicit when describing a proposed
  catalogue formulation, without claiming that a hypothetical request is already
  an alias of the recorded historical request.
- **B, reconsideration coverage:** the stated all-current-results responsibility
  requires input acquisition that represents the current answer set, and relevant
  organizing context needs analogous coverage. This is a concrete implementation
  obligation under the existing mechanism, not a new page freshness mechanism.
  Whether the proposal benefits from an explicit input-contract sentence remains
  for discussion; a bare reference alone still cannot establish exposure.
- **C, links and relationship changes:** the relevant question is how a selected
  destination remains eligible as broader context when graph relationships change.
  Referring to an exact relationship association is not the only possible solution
  and could reintroduce the need to edit links after ordinary relationship revision.
  Lookup by endpoints in qualified current graph material is another possibility.
  Withdrawal needs appropriate handling even in an unfiltered view; exact retained
  views keep their existing meaning.
- **D, competing replacements:** preserving uniqueness during independent updates
  is already an explicit constraint. Rejecting updates against a displaced value
  is one enforcement policy, not the only one. The representation and update
  granularity of collections were explicitly left to INVEST. This assessment does
  not adopt a particular acceptance or concurrency-control policy.

The re-review again found the exercise faithful to retained evidence. Its small
wording suggestions and the catalogue's treatment of elaborate can be assessed
without assuming all proposed investigations need distinct new implementations
or every operation must underlie a page of its own.

### Re-review A, B and D clarifications; discussion of C (2026-11-23)

The human accepted making the exercise's catalogue formulation explicit as
investigate-architecture-concept with state-behavior and with-diagram parameters.
The example now preserves the state-diagram requirement and leaves mapping to
the existing operation and result contract to INVEST, without altering the
recorded historical request.

The human agreed with finding B's input-contract clarification in concept. The
responsibilities now state that composition acquires the current answer set and
the book-organization context it uses as scopes, enabling reconsideration for
later additions and displacements. For D, the human asked whether INVEST's role
could be clearer; the uniqueness paragraph now explicitly assigns handling of
conflicting updates to INVEST while retaining the invariant.

For C, the human pointed out that referring to relationships would use ordinary
needs reconsideration. The assistant clarified that its earlier concern referred
to an exact association reference remaining bound to the old assertion after
supersession. Reconsideration and normal refresh can handle that; it is not a
reason to reject the approach. Relationship references need not duplicate tags.
The proposal's link-reference wording has not yet been changed in this exchange.

### Re-review C: broader-context links reference relationships (2026-11-23)

The human authorized changing broader-context links to refer to the broader-than
relationships they present rather than only their destinations. The proposal and
exercise now derive each such link's destination and applicable tags from its
referenced relationship. Tags are not duplicated on the link. Relationship
changes participate in ordinary reconsideration through composition's acquired
context; the reference is not a replacement for acquisition. This supersedes the
earlier destination-only link formulation.

The proposal also uses the hyphenated needs-reconsideration spelling for the
named status/mechanism, at the human's suggestion.

## Consequences to discuss after that choice

- **Reference substance:** a recovery entry connected to admission, ownership and
  composition may support the candidate episode. Decide which connections must be
  produced and navigable. Several adjacent answers alone do not establish them.
  An entry need not equal one contribution or one authoritative answer.
- **Pictures and detail:** a state overview explains transitions; waiting,
  concurrency and composition may need complementary interaction content and
  pictures. A state renderer cannot invent that meaning. Keep consequential
  conditions in the main explanation, with exact support and fuller detail nearby.
- **Inadequate accounts:** distinguish revealing retained detail, investigating a
  new question, retrying production, and submitting a specific objection. Fresh
  investigation exists. Inadequacy feedback only records the experience; giving
  an objection to the investigator requires additional capability. Do not imply
  that retry alone lets the person explain what is wrong or missing.
- **Return:** a developing reference within one sitting and a reference someone
  returns to tomorrow make different promises. Choose that explicitly before
  including or deferring PERSIST. Readable saved answers and executable resumed
  investigation are different levels of support.
- **Changing software:** choose whether usefulness ends at a design direction over
  fixed inputs or includes checking the subsequent implementation. The latter
  creates a reason for CHANGE. Neither repository changes nor restart should
  silently retarget earlier accounts.
- **Evidence of usefulness:** observe people explaining a consequential distinction,
  finding a related topic without researcher steering, returning to earlier support,
  recognizing an unresolved limitation, and continuing after an inadequate answer.
  Separate fidelity of content, fidelity of pictures, findability and actual
  reasoning benefit. A successful request or attractive diagram is insufficient.
  Allow different defensible endpoints and cases where the person reasonably stops.

No decision on these dependencies, diagrams, hosting, persistence, changed inputs,
or acceptance thresholds has yet been made. PRESENT and MINIGUI remain subsequent
design/implementation work; this discussion selects their useful scope.

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

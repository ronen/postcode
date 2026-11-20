# SLICE scope discussion

Started: 2026-11-20

Working notes for [SLICE](../steering/upcoming-work.md#slice), explicitly identified
by the human as the subject of this discussion. These record evidence, proposals
and unresolved choices. Scope remains in development; the directions established
in discussion are identified below. No implementation plan has been accepted.

The human requested discussion of the first useful graphical investigation
experience, using actual structured-account outputs alongside the authored journey,
with working notes here and a plan only after scope has been worked out.

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

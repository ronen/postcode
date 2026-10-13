# Candidate UX

This note is a place to remember ideas that have arisen and seem potentially promising, for future consideration rather than current planning. Ideas may be loosely formed or incomplete and have not necessarily been evaluated or reviewed; some explore new possibilities, while others may explore ways to fulfil existing requirements or improve existing capabilities. Consistent headings and detailed prose help preserve the thinking; they do not indicate maturity, validation, or readiness for implementation.

These notes are non-governing, are not an approved roadmap, and do not authorize implementation.

This inventory explores possible investigation experiences, organized around human needs, proposed experiences, potential value, dependencies, uncertainties, and what practical experience would help evaluate them.

[Candidate capabilities](candidate-capabilities.md) explores what PostCode could help someone discover or establish. This note explores how someone could initiate, navigate, organize, and continue that investigation. Ideas can span both: cross-links connect the experience to the relevant capability questions without duplicating their rationale or forcing an artificial separation.

For a bounded GUI experiment, [question discovery](#discoverable-questions-and-named-actions), [brief inspection](#brief-inspection-and-investigation-branches), and [qualification disclosure](#qualification-and-changing-accounts) offer readily explorable experiences using questions, inspection results, and qualifications already available in the [current toolbox](../docs/capability-reference.md). A prototype could stay within those capabilities without settling every option in an entry. Experiences involving durable resumption, comparison across program states, or new landscape analyses need substantial capability work beyond presentation. This distinction helps choose an experiment; it assigns no priority or implementation commitment.

<a id="richer-workspace-context"></a>
## Richer Workspace context

**Human need and value.** Someone investigating “why synchronization is slow” may bring together Views of several modules, runtime observations, and a comparison with an earlier revision while repeatedly explaining the same purpose. Shared purpose and request defaults could reduce repetition and help the investigation remain intelligible as it develops beyond its initial subject.

**Proposed experience.** A Workspace could optionally carry a stated information need, focal subjects, or repository/project and presentation defaults. That context could help interpret references, select relevant questions or Presentations, and communicate the investigation to a coding agent. The human could inspect which context influenced a choice, correct or clear it, and override defaults for an individual request. Explicit choices and inferred purpose would remain distinguishable.

Context could be enabled for selected Workspaces, offered automatically when useful, or become a common facility if experience supports it. Ordinary focus already supports basic navigation; shared purpose would be useful where it reduces repeated explanation rather than adding workspace-management work.

**Dependencies and uncertainties.** Which choices should context influence, and when does helpful inference become an unwanted constraint? When an investigation branches, should the new Workspace inherit the purpose and defaults, offer to revise them, or start afresh? Which context should be included in [agent sharing](#sharing-investigation-context-with-an-agent)? Changing defaults must not reinterpret existing results. Membership does not establish shared captured state, a program relationship, or one View as evidence for another. Rich context and persistence are independent; either could be useful without the other. See [human contributions](candidate-capabilities.md#human-contributions-to-interpretation-and-investigation) for the different meanings of assertions, preferences, and clarified focus.

**Experience to evaluate.** Follow an investigation that changes direction and branches into another Workspace, comparing ordinary View focus with shared purpose. Does shared context reduce clarification more than it creates surprising assumptions and correction work? Check whether inherited context helps the branch or holds it to an earlier question, whether the human can explain and correct the resulting choices, and whether they can tell what context an agent would receive.

<a id="workspace-kinds-and-starting-views"></a>
## Workspace kinds and starting Views

**Human need and value.** Orienting in an unfamiliar repository, examining a dependency, and comparing revisions may benefit from different starting arrangements without making people assemble each one manually.

**Proposed experience.** Optional Workspace kinds or lightweight presets could suggest useful starting Views. A generic collection would remain available, and an investigation could evolve beyond its starting kind. No universal summary-first default or fixed list of kinds is selected.

**Dependencies and uncertainties.** Are named kinds useful, or would choosing an initial question suffice? Each preset depends on actual capabilities; revision comparison cannot be supplied by layout alone. Under the [initial-View contract](../docs/app-specification.md#initial-views-and-further-investigation), opening must communicate the request it makes and respect its resource constraints. Starting arrangements do not authorize unrelated background investigation.

**Experience to evaluate.** Try the same orientation and focused-examination tasks with a generic start, a good initial-question chooser, and suggested arrangements. Do presets supply useful context beyond choosing the first question, or mainly introduce unnecessary work and difficulty escaping the initial framing? Related capability: [landscape orientation](candidate-capabilities.md#explorative-landscape-orientation).

<a id="brief-inspection-and-investigation-branches"></a>
## Brief inspection and investigation branches

**Human need and value.** Following every relationship into a permanent panel can fragment attention, while replacing the current View can lose useful context. People need to inspect briefly, keep useful findings nearby, and separate a growing line of inquiry.

**Proposed experience.** Explore an inline or temporary inspection that can be kept alongside existing Views, and ways to move a branch into another Workspace. A tab or window can hold an arrangement of several Views. Tiling, columns, collapse, and a free canvas are alternatives to evaluate, not a required layout system.

**Dependencies and uncertainties.** What distinguishes dismissing a visible panel from discarding retained information? How should navigation origin remain accessible when the source panel is closed? Placement must remain distinct from derivation. The earlier click/double-click/modifier gestures are candidates and need keyboard-accessible equivalents; tabs, multiple windows, and saved layouts need not arrive together.

**Experience to evaluate.** Follow several dependency branches, return to the original question, and rearrange the results. Observe whether people can recover their route without mistaking adjacency for a program or evidence relationship.

**Related exploration.** The earlier [Workspace prototype](gui/design-kickoff.md#design-canvas) explores inline inspection, opening beside, tiling, and branching into tabs or windows.

<a id="orientation-that-remains-in-view"></a>
## Orientation that remains in view

**Human need and value.** Detailed investigation can make someone lose the larger picture even when each individual View is useful.

**Proposed experience.** An optional overview could stay alongside the current detail, or serve as Workspace “wallpaper” with navigable landmarks. It might show where the current subject fits within a chosen perspective, while allowing that perspective to change or be hidden. This could be one View, a composed View, or several arranged Views; no new core abstraction is implied.

**Dependencies and uncertainties.** The information and qualification questions belong in [landscape orientation](candidate-capabilities.md#explorative-landscape-orientation) and [dependency landscape](candidate-capabilities.md#explorative-dependency-landscape). The UX question is how much context should remain visible. A map must not imply a canonical decomposition, established relationship, or shared captured basis that its inputs do not support. A retained overview is not necessarily live.

**Experience to evaluate.** Compare an ordinary overview that can be revisited with one kept visible during a multi-step investigation. Does keeping it visible help someone choose their next investigation, or merely occupy space? Look for visual crowding and unwarranted trust in the overview's completeness as well as improved orientation.

<a id="discoverable-questions-and-named-actions"></a>
## Discoverable questions and named actions

**Human need and value.** Someone should be able to find a useful investigation and understand the question it answers without first learning the internal Lens vocabulary.

**Proposed experience.** Subject menus, a command palette, shortcuts, and prose requests could expose consistent operation names such as “Explain” or “Decompose,” where supported. A View could state its question in plain language and expose parameters that change its meaning. Presentation controls could be distinguishable from requests for new information.

**Dependencies and uncertainties.** Neither example name establishes a current capability or requires hiding Lens names everywhere. Which names remain understandable across subject kinds? How are unsupported questions and incomplete subject resolution explained? The [toolbox contract](../docs/app-specification.md#shared-contracts-and-the-toolbox) supplies meanings; this note does not prescribe the capability reference's format or prioritize particular Lenses.

**Experience to evaluate.** Ask people to find an investigation, predict its answer, and change a consequential parameter using menus and prose. Check whether wording such as “used by” obscures direct versus transitive relationships or whether reformatting is mistaken for new analysis.

**Related exploration.** The [discussion of Lens vocabulary](gui/design-kickoff.md#open-question-is-lens-a-user-facing-notion) explores questions, captions, and editable parameters as user-facing concepts.

<a id="resolving-an-unclear-request"></a>
## Resolving an unclear request

**Human need and value.** A name may match several subjects, a question may not apply to the selected subject, or available information may be insufficient to settle the request. Someone needs to understand what remains unclear and continue without reconstructing the investigation.

**Proposed experience.** Show the unresolved request with enough context to choose among candidates, refine the question, or inspect the available information and its limitations. Clarification could happen inline with the request or in a nearby inspection, preserving explicit choices and the route that led there. A refinement could make clear what it carries forward and what it changes.

**Dependencies and uncertainties.** The adopted [request-resolution contract](../docs/app-specification.md#interpreting-and-resolving-requests) establishes the information to preserve; the interaction remains open. How much context should survive refinement, and when should earlier choices be reconsidered? Multiple candidates need not imply ambiguity when the question accepts a collection. Missing information, an unsupported application, an established empty answer, and failure while producing a valid answer have different meanings. Candidate references remain subject to their supported lifetime; keeping clarification visible does not make them durable.

**Experience to evaluate.** Try ambiguous names, inapplicable questions, and incomplete discovery. Ask people to explain what prevented an answer and continue by selecting, refining, or inspecting. Compare inline clarification with a separate step, observing repeated input, lost context, and unintended inherited choices. Does the interaction help resolve the request, or merely make the obstacle more elaborate?

<a id="staying-in-control-while-investigation-proceeds"></a>
## Staying in control while investigation proceeds

**Human need and value.** Between choosing an investigation and reading its answer, someone needs to know what work is underway, whether useful information is already available, and how to stop expensive work or change direction. Failure should leave an intelligible next step.

**Proposed experience.** Explore a request-local account of current work, including prerequisites, available partial results, and resource use or estimates where supported. The human could inspect usable findings, stop, revise the request, or recover from failure with the earlier question and available results still in view. Progress toward producing an answer would remain distinct from confidence in that answer.

**Dependencies and uncertainties.** The [resource and outcome contract](../docs/app-specification.md#resource-bounded-work-and-outcomes) and [initiation contract](../docs/app-specification.md#system-initiated-investigation) govern the work and its attribution. Which details help someone decide whether to continue, and how should uncertain cost or progress be conveyed? Partial information is usable only where its acceptance contract permits it; unfinished interpretation is not automatically a retained answer. Requesting cancellation, completing the request, and confirming resource cleanup are distinct. Changing direction or retrying must expose any new work and its resource implications. These experiences need not commit to a general background-task interface.

**Experience to evaluate.** Follow a slow investigation with prerequisite work, usable partial information, cancellation, and a failed attempt. Ask people what is running, what they can conclude so far, and what stopping or retrying will do. Observe whether disclosure supports timely decisions or mainly distracts, whether progress is mistaken for confidence, and whether recovery avoids unnecessary repetition without promising unsupported resumption.

<a id="context-sensitive-suggestions"></a>
## Context-sensitive suggestions

**Human need and value.** Someone can understand the current answer but still be unsure what to investigate next. Relevant suggestions could expose useful questions without imposing a fixed sequence.

**Proposed experience.** Offer a small set of inspectable, dismissible next steps based on the current subject, known results, and any explicit information need. Let the human see why a suggestion appeared and choose another question. Basic suggestions may use ordinary focus; richer Workspace context is not a prerequisite.

**Dependencies and uncertainties.** Distinguish displaying an available action from investigating to decide whether to recommend it, and from executing it. New claims require analysis; prerequisite or autonomous work follows the [initiation and resource contracts](../docs/app-specification.md#system-initiated-investigation). How should estimated cost, uncertainty, and consequential omissions be conveyed without overwhelming the choice?

**Experience to evaluate.** Compare a straightforward operation menu with suggestions during an unfamiliar task. Do suggestions reveal useful directions beyond those people find through the ordinary menu, or mainly repeat available actions and distract? Track repeated dismissals and whether the human understands what work has already occurred versus what accepting a suggestion will request.

<a id="returning-to-an-investigation"></a>
## Returning to an investigation

**Human need and value.** After an interruption or code change, someone may want to recover their question, earlier findings, and next step without reconstructing the whole investigation.

**Proposed experience.** Possibilities include a resumable arrangement, a short investigation trail, bookmarks, or a “since you were here” account. Restoring layout, retrieving an exact earlier answer, repeating a request, and comparing states are distinct experiences and need not be delivered together.

**Dependencies and uncertainties.** See [investigation across changing repository states](candidate-capabilities.md#investigation-across-changing-repository-states) for the underlying capability questions. Persistence, retention, reference lifetime, subject correspondence, and refresh policy remain undecided. An old answer can still describe its original state; changed inputs or a reconsideration flag do not establish that it was wrong. Restoring an observation log does not by itself restore a Session.

**Experience to evaluate.** First observe what people actually need after a pause with unchanged inputs; separately try a changed-repository scenario. Distinguish loss of orientation from unavailable records or analysis. Do not infer a requirement for universal save/resume or automatic refresh from a useful remembered layout.

<a id="qualification-and-changing-accounts"></a>
## Qualification and changing accounts

**Human need and value.** People need to read comfortably while understanding what an answer establishes, and to follow corrections or disagreement without losing the account they previously relied on.

**Proposed experience.** Explore concise qualification at rest, an inspectable basis on focus, and fuller evidence on demand. Human-readable labels and explicit links could connect original, corrected, competing, and reconsideration-marked accounts. An interface could help someone target a challenge or contribution without conflating it with an established correction.

**Dependencies and uncertainties.** [Structured qualification](candidate-capabilities.md#visual-and-structured-qualification) and [human contributions](candidate-capabilities.md#human-contributions-to-interpretation-and-investigation) retain the capability questions. The required [interpretation-history contract](../docs/app-specification.md#immutable-results-and-interpretation-history) already applies; the candidates here concern presentation. Consequential limitations must not be hidden behind hover, colour, or optional expansion. Neither human preference nor a compact confidence cue strengthens the evidence.

**Experience to evaluate.** Use actual partial, conflicting, and corrected results. Ask people what they can conclude, what changed, and how to recover the earlier account. Compare plain prose with layered disclosure and visual cues, including keyboard and non-colour access.

**Related exploration.** The [qualification layers](gui/visual-language.md#qualification-in-layers) and [cue vocabulary](gui/visual-language.md#cues) give concrete presentation treatments to evaluate.

<a id="sharing-investigation-context-with-an-agent"></a>
## Sharing investigation context with an agent

**Human need and value.** Someone discussing a finding with a coding agent should not have to reconstruct it in source coordinates or wonder which part of their investigation the agent received.

**Proposed experience.** Explore “refer to this” actions, an inspectable sharing scope, and an agent response displayed beside relevant Views with its provenance visible. Sharing a focused View, selected Views, or a Workspace are alternatives; an integrated conversation is a further possibility, not a prerequisite for copying a useful reference.

**Dependencies and uncertainties.** Apply the [agent-context contract](../docs/app-specification.md#shared-context-for-external-coding-agents) and the [bounded interface candidate](../docs/backlog.md#design-a-bounded-shared-context-interface-for-coding-agents). The earlier most-recently-active-window rule is not adopted. How should focus changes affect sharing, and how does the human distinguish an exact retained answer from a repeatable request? Export does not make transient references durable. Agent contributions remain attributed assertions or interpretations, and derived repository text cannot independently corroborate its PostCode source.

**Experience to evaluate.** Try a bounded exchange involving two investigations and an older retained answer. Check whether human and agent identify the same question, scope, and captured basis, and whether a returned report's status is clear. This does not depend on richer Workspace purpose or save/resume.

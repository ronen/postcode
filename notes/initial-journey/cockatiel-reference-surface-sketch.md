# Cockatiel beside the design conversation

Recorded: 2026-11-05
Status: exploratory storyboard; no GUI implementation or implementation plan authorized

## Working idea

PostCode remains available as an architectural reference surface alongside the
human's conversation with a design agent. Useful accounts stay visible without
requiring repeated CLI requests. The human can glance at them, refer to them with
the agent, or briefly focus on PostCode to investigate a question or arrange the
surface. A graphical application or terminal display could realize this idea.

The surface alternates between reference and focused investigation. It should
remain useful without continuously demanding attention. Intelligence might improve
framing, relevance, investigation and revision without producing a continuous
stream of unsolicited messages. Which changes warrant an interruption remains
open; no notification policy is selected here.

This builds on [persistent perspectives](persistent-architectural-perspectives.md)
and reworks the [operations walkthrough](cockatiel-conceptual-operations-sketch.md).
Commands describe available actions; they need not describe the rhythm of use.
The adopted [specialized investigation direction](../../docs/decisions/specialized-architectural-investigation.md)
now includes implemented, hypothetical and intended architecture. Our earlier
notes treated hypothetical support as a possible product extension; its intended
scope is now adopted, while delivered capability and first-slice selection remain
separate questions.

## What is assumed

Cockatiel content is reconstructed from the [recorded dialogue](readiness-investigation-dialogue.md)
and [working account](cockatiel-working-account.md), using the original investigated
revision `f48bea55022ab15ab07eb52a79bfc1e661300fd4` and issue report as read on
2026-10-14. It is illustrative content grounded in that recorded investigation,
not new PostCode output or fresh source/runtime verification. Conversations below
are compressed paraphrases, not additional transcript exchanges. Both participants
now know Cockatiel; this is a retrospective design exercise, not a novice test.

Presume useful tentative framing, relevant perspectives conceptually available,
and a bounded exchange of selected accounts with the design agent. The UI makes
available targets and actions clear. Assume no particular agent host, transport,
window-focus rule or automatic delivery of every open panel. Supplied account
versions are identifiable; receiving one does not establish understanding,
reliance, agreement or human acceptance.

The sequence selects representative moments rather than replaying all 30 exchanges.
The real reporter already suggested eager transitions. That alternative remains
available from entry; the storyboard does not manufacture its later discovery.

## Arrangement

Two adjacent surfaces have different roles:

- **Design conversation:** human questions, proposals, preferences and decisions,
  with the external agent's responses and references to PostCode accounts.
- **PostCode:** the human opens and arranges supported architectural views as
  panels. An operating-model panel plus a focused panel is one starting example,
  not a required number or division of roles. The human may close the overview,
  keep several focused accounts side by side, or open other supported views.
  Evidence, qualification and earlier accounts are available without requiring
  source-language literacy. "Reference surface" describes its role; the product
  label in the sketch is **PostCode**.

In this example, the operating-model panel offers surrounding context: the application owns preparation
and the operation; reusable Cockatiel policies govern execution; the application
receives the eventual outcome. It is partial and does not describe every policy.
The focused panel can examine breaker state, admission contracts, composition,
or proposed changes. Contexts and perspectives are UX hypotheses, not new domain
objects selected by this sketch. Panels may be independently qualified Views;
visual proximity supplies neither correspondence nor a coordinated Projection.

The accompanying interactive storyboard tests possible arrangements and changes
of attention. It allows opening, closing and reordering the supplied example
panels, and changing architectural perspective within them. The limited example
inventory is not the proposed product's complete panel vocabulary. Moving between
storyboard moments enacts the scripted change of the initial focused panel; added
reference panels keep their selected account versions. That is storyboard behavior,
not authorization for agents to rearrange the human's surface automatically.
It uses fixed example content; no inference, agent communication,
repository watching or code modification occurs. Its sequence controls are
storyboard controls, not a proposed workflow wizard. The durable content and
assumptions of the exercise are recorded here independently of that display.

## Presentation is part of the hypothesis

Follow-up discussion, 2026-11-05: the usefulness of a persistent account may be
highly sensitive to legibility and presentation, including type size, typography,
color, contrast, density, hierarchy and the ease of recognizing qualifications.
A poor experience with these drawings or styles would not establish that retained
accounts are unhelpful. Conversely, attractive or readable panels would not prove
better architectural reasoning. Evaluate both presentation quality and conceptual
utility, and avoid judging either solely through an unrefined visual sketch.

The revised storyboard exposes text-size and secondary-text-contrast adjustments
through host design controls when available. These are exploratory presentation
choices, not an adopted visual system or a substitute for human legibility review.

## Inputs and participants

The storyboard now shows an external annotation, **Inputs to PostCode**, for each
moment. These are illustrative assignments of responsibility and operation intent;
they are not existing CLI syntax, a production activity log, or claims about what
executed in the original chat. They make explicit what drives the displayed result.

| Moment | Inputs to PostCode and initiator |
| --- | --- |
| 1. Orientation | Human opens issue context and requests surrounding responsibilities and breaker account; design agent requests the selected exact accounts for discussion. PostCode performs the investigation supporting those requests. |
| 2. Proposal | Design agent supplies the human's readiness idea and the reporter's alternative, with distinct origins and no inferred acceptance; requests contract analysis. Human displays the proposal contract. |
| 3. Waiting | Human requests composition interactions; agent requests the resulting account and qualifications. PostCode investigates ordering and waiting. |
| 4. Recovery | Design agent requests deeper examination of the transition trigger with earlier interpretation and implementation evidence. Human displays the result and may inspect the earlier wording or evidence. |
| 5. Comparison | Design agent requests interaction comparison using supplied proposals and the implemented recovery account. Human displays that result and changes to ownership. |
| 6. Intention | Human endorses a direction in the design conversation. Agent supplies that explicit endorsement, source, and unsettled commitments; human keeps its contract visible. |
| 7. Repository change | Hypothetical prior user configuration enables monitoring. A monitor reports a new basis, marking older accounts without deriving impact; further investigation has not yet been requested. |

Operations that add analysis remain attributed to a parent request. Supplying
proposal material, requesting investigation, presenting an available account,
changing layout, and sending selected accounts to an agent are distinct actions.
Opening a panel does not by itself share it, and a design discussion does not by
itself permit autonomous investigation or repository monitoring. Other assignments
between human and agent may be equally useful; this sketch selects examples to
make the coordination visible, not a mandatory workflow.

## Episode

### 1. Enter through the issue; glance outward

**Conversation:** the human asks whether job submission is Cockatiel's central
purpose. The agent points to the responsibility boundary and relates the reported
preparation problem to it.

**Reference surface:** keep the operating model visible beside a focused breaker
account. The application prepares work; policies govern supplied executions.
Bulkhead queueing is in-memory execution waiting, not the business-job lifecycle.
The issue is an application of a central facility, not Cockatiel's whole purpose.

**Attention:** the human can inspect the broader account without leaving the issue
or being required to complete a project introduction. The initial framing is an
assumption to validate, not a demonstrated project-summary capability.

**Source:** dialogue exchanges 1, 3 and 9–10.

### 2. Introduce an idea while the existing account stays available

**Conversation:** the human suggests readiness before preparation. The agent
separates advice, reservation and a guarantee of success. The human prefers a
conservative change addressing the immediate need.

**Reference surface:** receive the advisory-query proposal with its origin and
hypothetical status. Show its candidate contract separately from the existing
breaker: no execution, no reservation, no guarantee of later admission or success.
The reporter's automatic-transition proposal is another supplied alternative.

**Attention:** the conversation develops the idea. PostCode can inspect its
commitments without becoming the author or the authority accepting it. This scene
assumes participant-material ingestion and hypothetical investigation, neither of
which is delivered by the current CLI.

**Source:** exchanges 2–7.

### 3. Briefly investigate waiting and composition

**Conversation:** the human asks about bulkhead capacity and combining policies.
The agent refers to the current interaction account rather than rebuilding all
of Cockatiel's operating model.

**Reference surface:** focus composition while leaving the operating model in
place. Bulkhead outside breaker can hold capacity while waiting for recovery;
breaker outside bulkhead can admit a trial that then waits for capacity. Separate
instances retain separate state. Default single-trial recovery can make other
calls wait; waiting may still end in rejection.

**Attention:** this is a short focused investigation, followed by return to the
conversation. Waiting and order qualify the proposed common acceptance contract.
The original dialogue added waiting after an incomplete account. If the sketch's
initial account already includes it, do not force an error for demonstration.

**Source:** exchanges 8–19. Claims are static accounts, not execution traces.

### 4. Examine a consequential ambiguity

**Conversation:** the human asks what the query adds to existing state inspection,
then whether Cockatiel already has a timer.

**Reference surface:** show the implemented transition trigger: opening records a
time and delay; a later execution checks elapsed time and can enter half-open.
Elapsed time alone does not change stored state or emit a transition event.
Half-open permits trial executions of ordinary application work, not special
repair work and not proof of health.

A correction detail can expose the original dialogue's ambiguous wording,
"timer expires," alongside the clarified account and its basis. This is a
reconstruction of a real correction, not a newly generated PostCode correction.
The exact earlier answer remains recoverable; a refreshed panel does not erase it.

**Attention:** the ambiguity justifies inspecting evidence/qualification, but
not opening implementation source. Rationale for avoiding idle timers is inference,
not established maintainer intent.

**Source:** exchanges 20–26.

### 5. Compare alternatives while continuing the conversation

**Conversation:** the human considers notification preferable for an application
waiting to resume. The agent qualifies that an incoming-request-driven query does
not necessarily require polling.

**Reference surface:** compare advisory query and automatic transition under a
shared interaction concern. The query reports eligibility when asked. The proposed
timer changes state and emits existing notifications at eligibility; later
execution still supplies the trial. Neither reserves permission or proves health.
Correspondence and consequences are qualified comparison analysis, not created by
placing two diagrams together.

**Return to ownership:** under the timer proposal, Cockatiel would own scheduling
the eligibility transition/notification. The application still owns preparation
and trial work. Preserve the implemented ownership account alongside this proposed
allocation. This is the clearest cross-perspective return in the episode.

**Source:** exchanges 27–28.

### 6. Retain the chosen direction and unfinished questions

**Conversation:** the human endorses optional automatic transitions with current
behavior preserved by default. The agent identifies remaining details for later
implementation assessment.

**Reference surface:** record this as intended architecture within the simulated
design exercise, with the explicit human endorsement and earlier proposal retained.
It is not Cockatiel maintainer acceptance or an implemented change. Keep visible:
eligibility starts no work; event ordering, obsolete timers, isolation/restoration,
resource lifetime, compatibility and scenario verification remain unresolved.

**Attention:** the surface is now a reference for subsequent work. No implementation
or external handoff is performed by this exercise.

**Source:** exchanges 29–30.

### Optional later beat: the repository changes

This beat is invented to expose a dependency; no changed Cockatiel implementation
was analyzed. A monitoring surface detects a different repository basis. It marks
the existing account as earlier, while retaining its exact content and references.
The intended behavior remains a distinct comparison target.

Detecting a change is not establishing architectural impact. An update requires
new analysis, may be partial or unavailable, and must distinguish what changed
from whether it matches the intention. No successful conformance result is supplied
in this sketch. A panel may eventually follow changes by preference; another may
remain a fixed discussion reference. The design agent must be able to identify
which version it has, rather than silently following every panel refresh.

The current unchanged-input Session cannot supply this monitoring/refresh behavior.
"Always available" initially can mean a stable surface during one supported Session;
it does not promise restart persistence or continuity across program changes.

## Requirements exposed, without selecting implementation scope

- Stable visible accounts and contexts that can be revisited while discussion
  continues elsewhere; persistent perspectives need not all be simultaneously open.
- Qualified operating-model and behavioral content; the visible model must not
  silently acquire claims from a later discussion or changed implementation.
- Exact references for selected shared accounts, with scope and basis apparent;
  available input, claimed support and participant agreement remain distinct.
- Usable evidence and correction access, including the prior answer and the reason
  for revision. Material qualifications remain visible in the main account.
- Participant contributions and qualified hypothetical/intended comparison for the
  broader episode; receiving or validating material is not design acceptance.
- An explicit later capability for change detection, new analysis, refresh and
  reference continuity if following repository changes becomes part of the slice.

Current exact-answer presentation, retained prose interpretation and correction
machinery support parts of this experience. Stable graphical/terminal panels,
general architectural framing, account correspondence, external shared context,
hypothetical investigation and changed-input continuity require further work.
Presentation alone cannot supply missing analysis.

The first useful slice could test a stable reference surface over one fixed basis,
with selected exchanges prepared manually, before adding automatic refresh. This
is an agent proposal, not a selected implementation boundary. The broader design
should still expose what refresh and shared references would require.

## Questions to discuss after trying the sketch

Which accounts would the human choose to keep visible? Does an operating model
help, or become background furniture? When is another panel preferable to changing
perspective in one already open? Are type, color, density and hierarchy adequate
for evaluating the account's usefulness at all?
Does the human actually consult the account, and can the agent use the same one
without repeating everything? Can the human distinguish recorded need, implemented
behavior, proposal and chosen intention at a glance? Which revisions deserve
attention, and which can wait until the panel is consulted?

Compare against capable agent conversation with diagrams and retained notes. A
successful rendering or convenient panel arrangement alone does not establish
better architectural understanding or investigative expertise.

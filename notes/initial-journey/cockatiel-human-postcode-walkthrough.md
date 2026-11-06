# Cockatiel investigation through selections in PostCode

Recorded: 2026-11-06
Status: exploratory walkthrough; no GUI implementation or capability commitment

## What this exercise changes

The human investigates directly through PostCode. Each question from the
[original dialogue](readiness-investigation-dialogue.md) becomes a question in
their head, answered by selecting architectural concepts, subjects and detail.
There is no conversational intermediary and no free-form question to PostCode.
Explanatory prose remains a possible result. Specific controls, panel counts,
layout and the promotion/discovery of available choices remain open.

Assume the human can recognize and select the available concepts and subjects.
Perspectives are conceptually available; they may be computed on demand. We also
assume an unspecified input mechanism supplies the human's hypothetical designs,
preferences and endorsements. This deliberately removes proposal-entry mechanics
from the earlier [operations sketch](cockatiel-conceptual-operations-sketch.md)'s
gaps. It does not assume that analysis of any supplied design succeeds.

Each selection below links to a [concept definition and its application here](architectural-concept-references.md).
These are design references, not required reading for the human. They constrain
what an account should contain; they do not turn a label into a capability.
The vocabulary emerged from the dialogue. It is neither a mandatory menu nor a
formal methodology. Alternatives, evidence and corrections are account operations
or material, not extra architectural concepts invented for particular questions.

## Basis and starting point

All Cockatiel answers are illustrative reconstructions from the dialogue and
[working account](cockatiel-working-account.md), concerning revision
`f48bea55022ab15ab07eb52a79bfc1e661300fd4` and issue #111 read on 2026-10-14.
Their basis was documentation and static source inspection, not PostCode output
or runtime reproduction. This pass makes no new claims about today's Cockatiel.
Definitions from SEI ground the perspectives; they do not support Cockatiel facts.

Start at the issue, a realistic lead. Its account says the reporter wants to avoid
costly preparation while a breaker withholds execution. A stored-state gate can
also prevent the execution that would initiate recovery. The reporter says an
external timing workaround works and suggests eager transitions. That suggestion
is available from the beginning; it is not a discovery manufactured at the end.

The route retains all 30 original substantive exchanges, grouping some below.
It uses corrected understanding, with the earlier answers and changes accessible;
it does not deliberately repeat the original mistakes. This retrospective exercise
can show expressive coverage, not prove that a newcomer would choose these
selections or that PostCode would produce these answers reliably.

<a id="orientation"></a>
## 1. “…what it's for…” — original exchange 1

**Question in mind:** is job submission central to Cockatiel?

**Selection:** issue → surrounding Cockatiel/application
[context](architectural-concept-references.md#context) →
[responsibilities](architectural-concept-references.md#responsibility).

**Account:** Cockatiel applies resilience policies to application-supplied
operations. The application prepares work and manages its business lifecycle.
Cockatiel's bulkhead can queue operations in memory while they wait for execution
capacity; that is not a background-job service.

**Consequence:** the human can locate the reported problem across a meaningful
boundary. The issue stays available while they look outward. This requires a
cross-module operating account, not merely the module containing the breaker.

[Dialogue basis](readiness-investigation-dialogue.md#orientation), qualified by
[the queueing correction](readiness-investigation-dialogue.md#queueing-correction).

<a id="readiness"></a>
## 2. “…a new facility: readiness check…” — exchanges 2–3

**Thought/input:** propose readiness; initially associate Cockatiel with background
jobs. The proposal arrives through the assumed input mechanism.

**Selections:** proposed readiness → [contract](architectural-concept-references.md#contract);
job preparation/queueing → [ownership](architectural-concept-references.md#ownership)
and the surrounding [context](architectural-concept-references.md#context).

**Account:** an advisory query could report current eligibility without reserving
permission or initiating work. Execution may later refuse. Preparation and the
business job lifecycle belong to the application. A reservation would additionally
need a lifetime and rules for abandoned work; asynchronous use does not itself
rule reservations out.

**Consequence:** the human can prefer a weaker promise for a stated reason.
The account exposes the mistaken boundary assumption without waiting for a
conversational correction. The original readiness account's omission of recovery
waiting remains visible as a correction, examined in scene 5.

[Dialogue basis](readiness-investigation-dialogue.md#readiness-proposal).

<a id="scope"></a>
## 3. “…other mechanisms…” / “…overall stated purpose…” — exchanges 4–6

**Questions in mind:** is breaker-based readiness the only option (4)? Should
other mechanisms be supported (5)? Which fit the library (6)?

**Selections:** known readiness candidates → compare
[contracts](architectural-concept-references.md#contract) (4); compare
[responsibilities](architectural-concept-references.md#responsibility) (5);
Cockatiel's surrounding [context](architectural-concept-references.md#context)
and stated purpose, then candidates' responsibility changes (6).

**Account:** breaker admission, bulkhead capacity, an active dependency probe and
application health signals answer different questions. A healthy dependency can
still be blocked by policy. General readiness would add responsibilities beyond
reporting existing policy conditions. Policy admission appears a closer fit;
this is an assessment, not a maintainer decision.

**Consequence:** the human can distinguish a reusable idea from an unnecessarily
broad feature. The candidate set is supplied from the original exploration and is
not exhaustive. If PostCode must discover alternatives itself, that is an
additional analytical requirement; a comparison menu does not do that work.

[Dialogue basis](readiness-investigation-dialogue.md#alternative-mechanisms).

<a id="preference"></a>
## 4. “…addresses the immediate need…” — exchange 7

**Human input:** prefer a conservative change that fits current facilities and
can grow without speculative features.

**Selection:** issue/design context → recorded
[intentions and constraints](architectural-concept-references.md#rationale).

**Account:** that preference is attributed to the human and associated with the
candidate designs. It has not established a contract or ruled out every broader
alternative.

**Consequence:** later comparisons can use the same preference without silently
treating it as repository evidence or a Cockatiel maintainer requirement.

[Dialogue basis](readiness-investigation-dialogue.md#conservative-scope).

<a id="waiting"></a>
## 5. “…make sense to unify…” — exchange 8

**Question in mind:** do bulkhead and breaker readiness mean the same thing?

**Selection:** breaker + bulkhead → compare
[contracts](architectural-concept-references.md#contract); selected waiting cases →
[interaction](architectural-concept-references.md#interaction).

**Account:** bulkhead execution can start, queue, or be rejected when capacities
are exhausted. In the default single-trial breaker example, another call can wait
for the recovery trial's outcome and subsequently be refused. Waiting for capacity
and waiting for a recovery decision have different conditions. Other recovery
sampling configurations were not worked through.

**Consequence:** “not starting” does not imply “rejected.” Inspecting the
[earlier answer and correction](architectural-concept-references.md#support-operations)
shows why normal/trial/blocked was incomplete. A proposed shared query needs to
say whether it describes a snapshot, waiting, or eventual execution.

[Dialogue basis](readiness-investigation-dialogue.md#bulkhead-comparison).

<a id="operating-model"></a>
## 6. “…overall theory of operation…” / “…policy object…” — exchanges 9–11

**Questions in mind:** what is the API's operating model (9)? Are there policy
objects (10)? Can breaker and bulkhead be combined (11)?

**Selections:** Cockatiel → [interaction](architectural-concept-references.md#interaction)
and [ownership](architectural-concept-references.md#ownership) (9);
policy [catalog and responsibilities](architectural-concept-references.md#responsibility) (10);
selected composition → [interaction](architectural-concept-references.md#interaction),
with either wrapping order (11).

**Account:** applications create reusable policy instances, supply operations and
receive eventual values or errors. Shared breaker state and bulkhead capacity
persist across calls; per-call progress is separate. Wrapping provides a combined
execution entry while retaining component instances and state. A bulkhead outside
a breaker can hold execution capacity while waiting for recovery; the reverse
order can admit a trial that then waits for capacity.

**Consequence:** the human gets an operating model they can revisit alongside
narrower details. No source signature must be deciphered. The conceptual policy
family is distinguished from implementation naming that also uses “Policy” for
failure-selection configuration.

[Dialogue basis](readiness-investigation-dialogue.md#operating-model).

<a id="acceptance"></a>
## 7. “…available now…” / “…acceptable…” / “…explaining…” — exchanges 12–14

**Thoughts/questions:** a policy query (12); accepting work to wait rather than
starting now (13); reasons accompanying a negative answer (14).

**Selections:** supplied query alternatives → compare
[contracts](architectural-concept-references.md#contract) (12–13);
selected negative outcome → contract's result meaning and supporting
[state](architectural-concept-references.md#state) (14).

**Account:** starting immediately, accepting to wait, and eventual success differ.
Possible explanations include exhausted capacity, recovery delay or isolation.
A last failure describes past experience, not present dependency health. Conditions
can change between query and execution. A Boolean alone conceals these distinctions;
a final return-type design has not been established.

**Consequence:** the human can refine the proposed promise and see unresolved
conditions. The supplied candidates are hypotheses, not current policy APIs.

[Dialogue basis](readiness-investigation-dialogue.md#available-now).

<a id="need-check"></a>
## 8. “…address the original requestor's issue…” — exchange 15

**Selection:** query proposal + reported preparation case →
[scenario-based assessment](architectural-concept-references.md#scenario).

**Account:** a query that recognizes elapsed recovery delay could avoid the
state-only gate preventing recovery attempts. It still cannot guarantee permission
after preparation. This matches the reported obstacle in principle; neither the
application nor a proposed implementation has been tested.

**Consequence:** “plausibly addresses the reported need” stays distinct from
“verified fix.” The report, proposed contract and comparison remain separately
inspectable.

[Dialogue basis](readiness-investigation-dialogue.md#original-need-check).

<a id="component-access"></a>
## 9. “…direct access to the breaker…” — exchange 16

**Selection:** wrapped policies + caller →
[ownership and access](architectural-concept-references.md#ownership).

**Account:** a caller assembling policies can retain the original breaker. A
caller supplied only a protected operation may not have access. Wrapping itself
does not settle that boundary.

**Consequence:** the human can assess when a component-specific facility is
usable without assuming either universal direct access or universal concealment.

[Dialogue basis](readiness-investigation-dialogue.md#access-to-wrapped-breaker).

<a id="generic-interface"></a>
## 10. “…generic interface…” / “…other policy types…” — exchanges 17–18

**Input/question:** propose acceptance on the common interface (17); discover
that there are more policies (18).

**Selections:** shared-query proposal → compare component and composed
[contracts](architectural-concept-references.md#contract) (17);
common policy family → [catalog and responsibilities](architectural-concept-references.md#responsibility) (18).

**Account:** retry, timeout, fallback and no-op also participate in policy
execution. They do not all govern admission alike. For a composition, inspecting
current component conditions cannot predict conditions after waiting. A negative
snapshot need not imply eventual rejection. No well-defined generic acceptance
contract follows merely from breaker and bulkhead having comparable conditions.

**Consequence:** PostCode qualifies the premise of the human's proposal. Selecting
the family exposes its coverage before the human adopts a common promise.
This can still happen after a tentative proposal; the journey need not enforce
complete understanding before any design thought.

[Dialogue basis](readiness-investigation-dialogue.md#shared-interface-direction).

<a id="outcomes"></a>
## 11. “…report failure/blocking…” — exchange 19

**Selection:** policy execution → [contract](architectural-concept-references.md#contract),
outcomes and notifications; composed failure →
[interaction](architectural-concept-references.md#interaction).

**Account:** execution eventually yields a value or error. Waiting remains pending.
Outer policies can handle inner errors, so local refusal need not be the final
caller outcome. Some selected return values count as policy failures without
becoming exceptions. Events describe local policy activity; breaker admission
refusal is not the normal operation-failure event path.

**Consequence:** the human can distinguish current reporting from the proposed
advisory query, and local information from a whole-composition answer.

[Dialogue basis](readiness-investigation-dialogue.md#failure-reporting).

<a id="stored-state"></a>
## 12. “…what does our proposed query add…” / “…good reason…” — exchanges 20–21

**Questions in mind:** why isn't state inspection enough (20)? Why use lazy
transitions (21)?

**Selections:** breaker → [state and transitions](architectural-concept-references.md#state),
then the issue's [interaction](architectural-concept-references.md#interaction) (20);
selected transition → [rationale](architectural-concept-references.md#rationale) (21).

**Account:** in an illustrative 30-second-delay case, stored state can still be
open at 31 seconds. Execution checks elapsed time, transitions and supplies trial
work; reading state does not. The application's state-only gate can therefore
prevent recovery. Avoiding idle timers and making recovery work-driven are
inferred advantages. Maintainer rationale is not established by this investigation.

**Consequence:** the human sees the precise missing distinction. A rationale
selection can return a qualified hypothesis and missing evidence rather than an
authoritative explanation of intent.

[Dialogue basis](readiness-investigation-dialogue.md#state-versus-acceptance).

<a id="trial"></a>
## 13. “…half open…” / “…willing to do a trial…” — exchanges 22–23

**Selections:** selected half-open state →
[state meaning](architectural-concept-references.md#state) and trial
[interaction](architectural-concept-references.md#interaction) (22);
query proposal → [contract](architectural-concept-references.md#contract), compared
with execution (23).

**Account:** half-open permits limited trials of ordinary application-supplied
work. It is not repair work, half the traffic, or proof of health. In the recorded
single-trial case, other calls wait while the trial runs and may then be refused.
An advisory query neither runs nor reserves a trial. Several callers could observe
eligibility before one actually executes.

**Consequence:** trial eligibility, a trial in progress and successful recovery
become separately intelligible. Following the supplied-work relationship returns
to the same application ownership account from scene 6.

[Dialogue basis](readiness-investigation-dialogue.md#half-open-explanation).

<a id="reporter-evidence"></a>
## 14. “…the workaround was sufficient…” — exchange 24

**Selection:** reported need →
[inspect supporting material](architectural-concept-references.md#support-operations)
→ reporter's workaround assessment.

**Account:** the recorded report says the application-side timing workaround
works but is clumsy. That is evidence of the reporter's experience, not our
reproduction or proof for every breaker configuration.

**Consequence:** no architectural concept is forced onto a provenance question.
Evidence access provides an intelligible attributed statement; reading source
code is unnecessary.

[Dialogue basis](readiness-investigation-dialogue.md#workaround-sufficiency).

<a id="timer"></a>
## 15. “…closed or half-open…” / “…built-in timer delay…” — exchanges 25–26

**Selections:** automatic-transition proposal →
[state and transitions](architectural-concept-references.md#state) (25);
compare implemented and proposed transition triggers (26), with
[correction detail](architectural-concept-references.md#support-operations).

**Account:** the proposed transition is open to half-open at delay expiry, making
a trial eligible without running work. It does not establish recovery or close
the breaker. The existing delay is checked when execution arrives; it is not a
scheduled state-changing timer. The earlier phrase “timer expires” blurred this.

**Consequence:** a compact current/proposed comparison isolates the change.
The corrected account, its predecessor and why the wording mattered remain
available. A factual correction and a new hypothetical design are different things.

[Dialogue basis](readiness-investigation-dialogue.md#requested-automatic-transition).

<a id="notifications"></a>
## 16. “…events…” / “…its own polling…” — exchanges 27–28

**Selections:** breaker → [contract](architectural-concept-references.md#contract),
notifications (27); query and automatic-transition candidates → compare
[interactions](architectural-concept-references.md#interaction) under the
[notification concern](architectural-concept-references.md#scenario) (28).

**Account:** existing break, half-open, reset and state-change events report actual
transitions. Delay expiry alone currently produces none. Automatic transition
could use the event facility to notify an application of trial eligibility.
A query answers when called; it need not require polling if incoming requests
already prompt checks. Neither alternative performs application work.

**Consequence:** the human has a conditional reason to prefer notification.
The proposal moves timing/announcement responsibility into Cockatiel while the
application still decides when to prepare and supply work. “Events are better”
is not a universal conclusion.

[Dialogue basis](readiness-investigation-dialogue.md#breaker-transition-events).

<a id="compatibility"></a>
## 17. “…backwards compatibility…” / “…timer management…” — exchange 29

**Selections:** optional automatic-transition proposal →
[scenario-based assessment](architectural-concept-references.md#scenario),
existing caller compatibility; timer →
[ownership/lifetime](architectural-concept-references.md#ownership) and
[state/event contract](architectural-concept-references.md#contract).

**Account:** preserving lazy behavior by default is a plausible compatibility
strategy; an options extension was not verified. Opting in changes event timing.
Unresolved cases include ordering and duplicate transitions, obsolete timers on
isolation/reopening, restored state, timer lifetime and process liveness. The timer
must start no trial and must not claim recovery.

**Consequence:** the human separates a promising direction from a complete design.
Unresolved cases are selectable further investigations, not silently completed
answers or a demand to settle every detail in this journey.

[Dialogue basis](readiness-investigation-dialogue.md#compatibility-and-timer-contract).

<a id="endpoint"></a>
## 18. “…that seems like the best approach…” — exchange 30

**Human input:** endorse the opt-in automatic-transition direction within this
exercise. That endorsement uses the assumed input mechanism.

**Selection:** selected design → [rationale and intentions](architectural-concept-references.md#rationale),
with its [exact supporting accounts](architectural-concept-references.md#support-operations)
and unresolved concerns.

**Account:** opt-in automatic open-to-half-open transition, existing state/events,
default preserved; preparation and trial work remain application responsibilities.
The choice is motivated by the immediate reported need, notification and restrained
scope. Timer/event details and scenario validation remain open. It is this human's
simulation decision, not maintainer acceptance or implemented behavior.

**Consequence:** the human can stop with a qualified direction and enough context
for later design or implementation discussion. This exercise sends no handoff
and implements nothing. It does not require an agent to be present to reach that
endpoint.

[Dialogue basis](readiness-investigation-dialogue.md#decision-endpoint).

<a id="presentation-and-retention"></a>
## Presentation and exact retained-answer needs

The exercise needs linked, selectable accounts, not a particular panel layout.
Text, a table, a state depiction or an interaction sequence can carry the same
qualified result. Useful presentation work includes:

- Keep subject, scope, implemented/hypothetical/intended status and material
  conditions apparent. In particular, “default single-trial case” and “static
  reconstruction” must remain visible when they affect the conclusion.
- Revisit the operating account while inspecting a narrower state, contract or
  interaction. Explain what relationship leads outward or inward. A directory
  tree alone does not supply that relationship.
- Compare like concerns across selected alternatives, with supported
  correspondence and substantive differences supplied by analysis. Show unresolved
  meaning instead of manufacturing an aligned value for every cell.
- Select a claim to inspect its intelligible supporting basis and limitations.
  Select a correction to examine the original, replacement, reason and relevant
  consequences. Legibility and staged detail matter to whether this is usable.

An exact return must preserve the particular selected accounts, correction and
association snapshots, subject/parameters, captured basis contributions and
qualifications. Reopening “breaker / state” by issuing a fresh request may select
a different answer. Reformatting or expanding retained detail must not silently
perform that reselection. Keep generating investigation inputs distinct from the
accounts selected for presentation and from the supporting program revision.

For this journey, retain at least the operating account; admission account and its
waiting correction; implemented transition account and timing correction; supplied
query and timer candidates; their qualified comparisons; human scope preference
and final endorsement. This is a set of related, versioned contributions, not a
single overwritable truth. A selected incomplete or unavailable result should
remain distinguishable from a complete answer saying nothing exists.

These requirements use the adopted
[captured-basis distinctions](../../docs/core-concepts.md#captured-basis).
They do not require every perspective to be stored in one universal architectural
model, nor do they require persisting an inferred record of what the human knows.

<a id="support-and-gaps"></a>
## What the exercise establishes, assumes and leaves open

**What it demonstrates on paper:** most of the recorded reasoning can be expressed
through a small recurring set: context, responsibility, ownership/access,
contract, state, interaction and rationale, with scenario-based comparison.
Evidence inspection and exact-answer/correction operations remain essential.
Concept references constrain those meanings; they do not prove the generated
accounts are accurate or sufficient. The human still introduces goals and judges
alternatives. PostCode's output need not be conversational for that to be useful.

**Existing support:** the [current toolbox](../../docs/capability-reference.md)
provides mechanical project/module exploration, module-originating qualified
interpretation and retained-account explain/decompose/examine. The completed
[lens request model](../../docs/plans/lens-request-model.md) supports the separation
of requests and exact retained-answer presentation. Existing Session support
preserves bounded earlier interpretations, corrections and selection snapshots.
None of that demonstrates this full conceptual selection experience.

**Presentation work:** concept/subject selection, connected accounts, selective
detail, comparisons of already-established information, and readable attribution.
There is no implemented GUI or general multi-Projection View composition.
Moving between these accounts must preserve their distinct answers and bases;
placing summaries together is insufficient.

**Additional core capability:** producing a useful cross-module operating account;
exposing the relevant architectural subjects and relationships; applying these
perspectives to them; qualified investigation of supplied designs; and semantic
comparison under a concern. The adopted architectural model permits broader
subjects and modalities, but today's implemented subset does not deliver these
operations. General supplied-material capture and cross-session retention also
remain future work. Inferring a flow, correspondence, omission or tradeoff is
analysis, not rendering.

**Orientation question:** the journey does need an application/library operating
account. It does not yet establish a need for an exhaustive project summary or
dependency landscape, or a mandatory top-level start. A task-scoped cross-module
account might suffice. Test whether current module interpretations can be combined
into a supported useful account, or whether an explicit broader investigation is
needed; do not assume navigation alone supplies the missing synthesis.

**Consequential assumptions to test:** can PostCode discover and explain the
application/library boundary, distinguish stored state from trial eligibility,
and expose waiting/composition qualifications? Can it relate the same subjects
across perspectives without inconsistent meanings? Can the human select a useful
next concern without the original conversational cues? Option discovery is deferred
for this pass, not proven solved. Can an incomplete account make its limitation
clear enough that the human can narrow or deepen investigation?

The cleanest next review is scenes 12–16: state inspection, trial meaning,
reporter evidence, timer comparison and notification. They test reuse of a few
concepts while retaining evidence, uncertainty and correction. Scenes 1 and 6
supply the surrounding model when needed. No first implementation slice or broader
plan sequence is selected here; the full design endpoint remains useful for
revealing what the investigation needs to retain.

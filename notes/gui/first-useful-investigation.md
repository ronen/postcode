# First useful graphical investigation

Started: 2026-10-14
Status: working notes; durable, non-governing exploration

## Purpose and current position

Define a first graphical investigation worth making useful: a concrete scenario,
a rough interaction sketch grounded in PostCode results, the division between
existing capability, presentation work and additional core capability, and the
dependencies and unresolved choices for later design.

This is product/design exploration. No GUI implementation, canonical plan, new
architectural decision, or broader development-sequence reorganization is
authorized. The explored journey may span several eventual implementation plans.

The first debugging-oriented sketch was reconsidered because it did not establish
enough value for human participation in agent-mediated development. The emerging
[human understanding and agency principle](../human-understanding-and-agency.md)
has guided a worked investigation of **Cockatiel issue #111, now at an
informed-direction endpoint**. The human selected opt-in automatic breaker
transitions to trial eligibility, preserving existing behavior by default. This
is a simulated external-project design choice, not implementation authorization.
The [recorded dialogue](readiness-investigation-dialogue.md) preserves the human
questions, substantive answers, qualifications and corrections, separately from
research observations. A final graphical sketch and implementation slice remain
unselected. The human's subsequent question about what PostCode adds to ordinary
agent chat makes incremental value the next issue to assess, before assuming
graphical interaction is the right response.

The working direction is assessing a concrete extension against one fixed
repository state: how it fits existing responsibilities and commitments, and
whether any change is needed. This avoids requiring historical analysis to
establish a repeated-change pattern. The human agreed this direction; the specific
extension was exercised through the Cockatiel trial. An agent proposal can give
the human something concrete to judge while remaining a qualified account to question. This is not a
requirement that all journeys begin with a proposal or end in a decision;
open-ended understanding and discovery remain valuable.

## Governing and exploratory context

The [application specification](../../docs/app-specification.md),
[foundation](../../foundation/product-design.md),
[core concepts](../../docs/core-concepts.md),
[constraints](../../docs/architectural-constraints.md), and accepted decisions
govern the work. In particular, the decisions on
[application boundaries](../../docs/decisions/application-specification-boundaries.md),
[coordinated Views](../../docs/decisions/coordinated-views-and-qualified-results.md),
[request outcomes](../../docs/decisions/lens-application-and-request-outcomes.md),
and [qualified construction](../../docs/decisions/qualified-construction-under-the-request-model.md)
qualify the earlier exploration.

Current support is described in [STATUS](../../STATUS.md), the
[capability reference](../../docs/capability-reference.md), and the completed
[Lens request-model plan](../../docs/plans/lens-request-model.md). The assessment
began against local main at `a34e620` on 2026-10-14. It used documentation and
historical result artifacts, not a new live inference run or conformance audit.

Build on the earlier [GUI kickoff](design-kickoff.md),
[analysis needs](analysis-needs.md), [visual language](visual-language.md),
[candidate UX](../candidate-ux.md), [candidate capabilities](../candidate-capabilities.md),
and [dependency-landscape exploration](../dependency-landscape.md). Their
possibilities are not commitments. Earlier summary-first, persistence,
linked-Workspace hierarchy, live/pinned controls, and most-recent-window agent
scope assumptions must not silently become requirements. The current model
permits a simple Workspace arranging Views, with retained investigation lineage
and no mandatory summary-first experience.

## How concrete the journey should be

Specify one worked journey sufficiently to assess its usefulness and dependencies:

- the person's information need, starting knowledge, and origin of any lead;
- concrete information received, with meaningful qualification;
- a plausible progression explaining why each next investigation is chosen;
- a useful endpoint and remaining uncertainty.

This is an example of use, not a mandatory wizard or a complete navigation
framework. Add one or two imperfect variations only where they test consequential
assumptions. "The journey must accommodate" should not become an unbounded
requirement to design every possible route or failure mode.

### Starting with a lead

A filename in an error report, a component mentioned in documentation, or a
suspected module is a legitimate lead even in an unfamiliar project. Its relevance
remains to be established. Supplying the correct module solely through the
designer's repository knowledge would hide the discovery problem.

Distinguish locating relevant subjects, understanding their surrounding context,
and explaining behavior. A named module may still require broad orientation; a
behavioral question may primarily require subject discovery that neither a
project summary nor a dependency landscape supplies. If a scenario has no natural
lead, expose that gap rather than manufacture one.

### Concrete results and assumptions

Assume enough successful analysis to explore an experience, while making the
required result concrete. Use actual results where available and label invented
results as illustrative. Their qualification must be sufficient to judge whether
they enable the next step. An illustrative result can demonstrate potential value
without establishing feasibility; an accurate existing result may still be a poor
Presentation for the human's need.

Keep a short list of consequential assumptions: the result assumed, why the next
step depends on it, current support, and what needs validation. Investigate the
assumption carrying the journey's central value early. Do not shape every answer
perfectly around a predetermined next click. Explore important ambiguity or
incompleteness without drawing every error path.

### Endpoint and implementation scope

Let the explored journey reach a meaningful user endpoint, including a change
handoff when natural. That step can reveal what the human needs to retain, select,
explain, or qualify earlier. Distinguish the explored journey, a useful first
implementation slice, and later portions sketched only enough to expose
dependencies. Do not truncate exploration to fit a preselected delivery boundary.
No first slice has been agreed.

A lightweight handoff can identify desired change, commitments to preserve,
supporting findings, uncertainty, and exact selected answers. It need not settle
transport, synchronization, hosting, or cross-window sharing.

## First sketch and why it was reconsidered

The initial Cockatiel sketch followed an illustrative report of an exception from
a success listener entering failure handling, with an error location naming the
executor as a plausible lead. The incident and lead were illustrative, not an
observed user report.

The proposed progression was: test the lead through a module account; understand
the shared executor versus policy responsibility; examine exception
classification; inspect supporting evidence; return to the earlier account; and
form a bounded change request.

The [recorded Cockatiel sequence](../../records/validation/module-investigation/pass-04/cockatiel-m4/sequence-view.txt)
provides actual historical material: a single-attempt executor account, explanation
of handled outcomes versus retry policy, selectable aspects, and examination of
exceptions from filters and synchronous success listeners. It also reports an
attributed documentation discrepancy and limits of the supplied tests. These are
qualified static-source interpretations, not new runtime observations. The deeper
account refines earlier understanding without issuing a formal correction.

The sketch was too close to work a human could delegate to a debugging agent.
Convenient existing results had shaped the experience more than the value of human
participation. A possible reframing asks: **Should monitoring and notification
failures affect the outcome of the work being monitored? What is currently
promised, and what would changing that commitment affect?** This remains a
candidate, not the chosen journey. Establishing commitment scope and consequences
may require additional capability beyond the recorded module accounts.

For correction-specific exploration, the
[numeric-classifier assessment](../../records/validation/module-investigation/pass-06/report.md)
contains originals, replacements, competing alternatives and reconsideration
causes. Its injected errors are controlled assessment material. Do not manufacture
a correction in the Cockatiel story or treat those fixtures as evidence of natural
error frequency.

## Candidate to assess: retries within an overall time budget

The repeated-policy-change example remains useful for explaining the purpose of
PostCode, but presupposes evidence of history and a pattern across changes. A
current-state extension should be easier to exercise without inventing that
history.

A concrete candidate, proposed for discussion rather than selected, is:

> We want callers to request retries within an overall two-second budget,
> including time between attempts. What can we promise when that budget expires,
> and can the existing design deliver it?

The human judges the externally visible commitment: stopping the wait, preventing
further attempts, and ensuring underlying work has stopped are different
requirements. What should happen to work already underway, and what obligations
fall on the operation being retried? Two seconds is an illustrative value, not a
measured or selected limit.

The recorded Cockatiel assessment pins commit
`80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`. Its
[pinned README](https://github.com/connor4312/cockatiel/blob/80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e/readme.md)
documents retry, timeout, policy composition, and cooperative versus aggressive
timeout behavior. Those are recorded assertions that give the investigation
credible starting subjects. They do not establish that the desired combined
commitment is satisfied. Existing composition, a focused addition, or a revised
commitment must all remain possible outcomes.

A useful account would explain the responsibilities for retry decisions, waiting,
deadline handling and cancellation; distinguish documented commitments from
implementation findings; and show the consequences and limits of a proposed
arrangement. This account is a requirement to investigate, not an existing
PostCode result. The earlier executor investigation is supporting exploration,
not evidence that PostCode has answered this new question.

For this initial candidate check, the pinned README was accessible, but the
original assessment source checkout was absent at its recorded local path.
Restoring and verifying the pinned repository is a prerequisite to implementation
inspection or live PostCode assessment. No code execution, runtime verification,
or fresh hosted investigation was performed.

## Selecting an exercise from an actual policy addition

A further candidate method is to find a real policy addition in repository history
and investigate the extension from the commit before that work. History is used
by the designers to select the exercise; the PostCode journey still investigates
one fixed program state and needs no historical-analysis capability.

A read-only Git inspection on 2026-10-14 identified these Cockatiel additions:

| Addition | Commit | Pre-addition baseline | Scope observed in commit metadata and file changes |
| --- | --- | --- | --- |
| Bulkhead isolation | [351b094](https://github.com/connor4312/cockatiel/commit/351b094fc042e15a94029b148054d3ce210522ea), 2019-11-19 | `2fa5d8508d7d5ff9310102a27b984ec6705b123d` | New bulkhead implementation and tests, Policy addition, small helper and error, documentation; seven changed files. |
| Timeouts | [ad38b55](https://github.com/connor4312/cockatiel/commit/ad38b5580d69b623638e9e1fa24d367704b55812), 2019-11-19 | `351b094fc042e15a94029b148054d3ce210522ea` | Introduces timeout and cancellation facilities and expands events; nine changed files. |
| Fallback | [ee47684](https://github.com/connor4312/cockatiel/commit/ee4768448263e8dcc0a0039f7d076084cf0e5f68), 2019-11-21 | `443d055e79eba641b726ae49bd466c109d6a61d0` | Adds fallback together with policy composition and changes several existing policies; fourteen changed files. |

Bulkhead is the most bounded candidate in this initial comparison. A possible
human-facing brief is: protect a downstream service by limiting how much work can
be in progress at once; decide what callers should experience when capacity is
full and how that protection fits existing retry and failure policies. Queueing,
rejection, fairness, and retry interaction are choices to investigate, not answers
inherited from the eventual patch.

The pre-bulkhead tree and README were inspected. They contain retry and circuit
breaker facilities and list bulkhead isolation as unfinished. This supplies a
credible recorded motivation, although the introductory description already names
some unfinished features; documentation must retain asserted status. The baseline
contains 31 TypeScript files including tests and uses TypeScript 3.7-era tooling.
No build, runtime test, or PostCode analysis of this baseline has been performed.
Compatibility with the current analyzer needs assessment.

All three additions occur in the project's first week. Small early baselines may
be useful for a tractable first exercise but insufficient to test orientation in
a mature system. Timeout is a broader alternative if introducing cancellation
provides more useful design decisions. No candidate is selected yet.

Prepare the brief in behavioral terms and freeze the baseline before assessment.
Keep later implementation, tests, and documentation outside the investigated
inputs. The historical result can later supply a comparison or additional cases,
but is not the uniquely correct design or the acceptance oracle. Initial selection
has inspected commit messages, changed-file summaries and pre-addition material;
it is not a blind evaluation. A later assessment should distinguish designer
knowledge from information actually supplied to the human and Investigator.

## Current open-issue candidate: admission before background work

On 2026-10-14, GitHub listed two open Cockatiel issues. The stronger journey
candidate is [#111, Support gating code from outside the actual exec function](https://github.com/connor4312/cockatiel/issues/111),
opened 2025-09-05, still open with no discussion comments at inspection. There is
no recorded maintainer acceptance of the suggested design.

The reporter describes an endpoint that prepares and acknowledges a background
job whose success depends on an external service. They want to gate preparation
using the service's circuit breaker. They report that blocking work while the
breaker is open also prevents the execution that would let the breaker progress
toward recovery. Their suggested remedy is eager state transitions; the user need
and this proposed mechanism should remain separate.

A behavioral brief could be:

> Help callers decide whether to accept work before expensive preparation, while
> preserving protection during dependency failures and allowing recovery attempts.
> What can an early check promise, and how should it relate to later execution?

The human-facing choices include whether the check supplies advisory information
or reserves permission for later execution, how recovery attempts are admitted,
what happens when conditions change between acceptance and execution, and how
concurrent callers share limited recovery opportunities. The agent investigates
mechanisms and alternatives; the human judges the commitments and tradeoffs. No
check should be presented as guaranteeing eventual job success merely from a
breaker state.

A bounded source inspection at Cockatiel commit
`f48bea55022ab15ab07eb52a79bfc1e661300fd4` found that `state` returns the stored
state, while `execute` checks elapsed backoff and moves an open breaker into its
half-open recovery state. Recovery sampling also tracks in-flight work. This
supports the relevance of the issue to the current implementation; it is static
agent inspection, not reproduction of the report, a comprehensive design review,
or a PostCode-produced answer. The
[pinned implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts)
provides a recoverable baseline for further assessment.

The other open issue, [#80, Improve feature parity w/ Polly v8](https://github.com/connor4312/cockatiel/issues/80),
combines pipelines, telemetry and naming. Its maintainer response invites more
specific needs and proposals. It is less bounded as a first journey unless one
of those needs is developed separately.

Issue #111 is a promising alternative to historical replay: a real stated need,
a mature fixed baseline, and consequential choices without reconstructing history.
It is now the subject of the [trial dialogue](readiness-investigation-dialogue.md),
while remaining a candidate for the final journey. The issue supplies the starting lead;
this does not assume PostCode can ingest issues or already produce a cross-subject
account of admission, execution and recovery. Those are separate capabilities to
assess when sketching the actual interaction.

<a id="simulation-endpoint"></a>
## Worked simulation and its endpoint

The [dialogue](readiness-investigation-dialogue.md) records a human who does not
know Cockatiel and deliberately does not follow source links. The issue supplies
a credible lead. The investigation needed purpose and application/library
boundaries, a concrete account of reusable policies and individual operations,
policy composition, and plain-language recovery states. Supplying an inventory
once did not establish lasting orientation. Some agent wording also created or
preserved misunderstandings, which the record keeps alongside later clarifications.

The human explored an advisory acceptance query, considered placing it on the
common policy interface, then questioned why existing state inspection was
insufficient. Examining lazy transitions and existing events revealed a narrower
alternative with notification benefits. The human ultimately favored opt-in
automatic transition to half-open when the delay ends, using existing state and
events and retaining current behavior by default. Half-open would mean trial
eligibility; a transition starts no work and does not establish successful recovery.

The [endpoint and compact handoff](readiness-investigation-dialogue.md#decision-endpoint)
identify event ordering, timer lifetime, isolation, restoration and compatibility
as outstanding assessment. No code change, runtime validation, or external handoff
was performed. The design choice is the human's outcome within the simulation,
not a canonical PostCode decision or implementation instruction.

This is enough to end the simulated investigation without designing the external
change in full. It is not enough to claim a completed graphical journey. The
answers were agent-produced from repository material and external documentation,
not fresh PostCode results. Graphical navigation, human evidence inspection,
exact answer redisplay and formal Corrections have not been exercised. Derive a
shorter interaction sketch and capability mapping from the useful questions and
information needs; do not turn the full dialogue into a mandatory sequence. Keep
actual evidence, illustrative explanations and inferred design rationale distinct.

<a id="added-value"></a>
## Added value over ordinary agent chat remains unproven

The [post-simulation debrief](readiness-investigation-dialogue.md#added-value-debrief)
asks a fundamental question: the human reached a reasonable design direction
entirely through prose chat with a repository-capable agent. The exercise supports
that baseline; it does not yet demonstrate additional value from PostCode or a GUI.
The repository dialogue record also shows that ordinary agent tools can retain
an investigation. Do not count persistence, diagrams or summaries as benefits
unavailable to the baseline.

Potential benefits to test are keeping an understandable operating model available,
making findings, proposals, revisions and decisions inspectable with their support,
and enabling selective reuse or continuation of understanding. Some orientation
problems arose from the agent's incomplete or imprecise explanations; rendering
them graphically would not itself correct them. Qualifications and source links
do not independently verify an interpretation, and the human deliberately did
not follow those links. Future continuity across program changes is a separate
capability hypothesis, not demonstrated current support.

A next experiment could compare a small operating-model and decision/evidence
view against good chat plus a concise retained investigation note, holding the
underlying answers and agent support comparable. Useful observations would include
whether the human understands relationships more readily, notices a changed
assumption, or resumes and directs work with less reconstruction. No such
comparison has been performed or its particular views selected. If improved
prose or a lightweight brief suffices, use that result to constrain scope.
Text presentations are permitted by the foundation; product value need not depend
on replacing conversation with graphical navigation.

## Orientation: what might supply the forest?

Existing organization and dependency results can situate modules within qualified
structures. Module interpretations can explain apparent local responsibilities.
Those capabilities do not establish project purpose, major responsibilities, or
representative behavior.

Neither project summary nor dependency landscape is selected. A larger dependency
map can reproduce the same orientation problem at another scale; a fluent summary
can hide unsupported selection or interpretation. Choose additional capability
from a concrete unmet need:

- difficulty reading supplied relationships may call for Presentation work;
- relationships between organizational groups may call for a landscape Lens;
- purpose, responsibility, or behavioral synthesis may need an interpretive Lens;
- locating relevant subjects may require a different discovery capability.

The reconsidered direction may need an account of the relevant part of a system
and its commitments, at a scale between one module and the whole project. The
required information remains to be established through the next sketch.

## Presentation and retained-answer dependencies

The completed request model supplies explicit questions and applicability,
qualified resolution, reusable interpretation operations, result/Presentation
compatibility, and bounded request-work attribution. It does not by itself deliver
graphical Presentation design, exact retained-answer redisplay, or general
navigation-origin retention.

Earlier inline inspection, open-beside, and layered qualification ideas remain
useful candidates. Consequential qualification must be visible without hover.
Independent Views arranged together can be sufficient; a coordinating Presentation
must preserve each input and use established correspondence. New behavioral flows,
group relationships, or synthesized accounts require core analysis. Graphical
proximity or a dependency edge does not establish runtime behavior.

Before implementation, identify the particular Presentation contracts and options
needed: graphical selection, sorting, bounds, expansions, qualified partial and
unavailable results, reference coordination, and observation of actual presented
content. Do not treat current bounded JSON output as complete core information.
See [Presentation design](../../docs/backlog.md#decide-how-gui-presentations-and-their-parameters-are-represented).

Exact investigram inspection preserves an original account, but is not sufficient
to recover the entire earlier answer: a fresh inspection can select newer
correction or association information. The journey's intended continuity needs:

- Back, reopening, paging, sorting and reformatting preserve the selected
  Projection and its frozen content, qualification and correction/association
  selection.
- Already supplied detail can be disclosed without reselection. Interactions
  needing additional information issue a new request with its relation to the
  earlier answer explicit.
- Selecting newer information is distinct from redisplaying an exact answer.
  Current reconsideration status can be shown separately without rewriting what
  the earlier answer showed.
- Navigation records the origin actually established by the interface, including
  source excursions, and preserves it when a visible panel is closed. Origin is
  distinct from placement, evidence dependence and program relationships.
- Initial retention can be Session-local. Neither an input pin nor an exported
  reference makes an answer durable across restart.

These concerns connect to [exact retained-Projection presentation](../../docs/backlog.md#allow-a-view-to-be-requested-for-an-existing-projection)
and [navigation lineage](../../docs/backlog.md#assess-and-preserve-navigation-origin-lineage).
Evidence disclosure needs per-result assessment: some recorded inspections expose
only locations, not excerpts. Supporting evidence must come from the captured
basis. A handoff introduces separate [shared-context requirements](../../docs/backlog.md#design-a-bounded-shared-context-interface-for-coding-agents).
The [captured-basis observation gap](../../docs/backlog.md#preserve-captured-basis-attribution-in-observations)
must be addressed before relying on new observations for state-specific assessment.

## Next questions

1. Identify and test a concrete benefit PostCode could add beyond ordinary agent
   chat with a concise retained note. Do not assume a graphical surface is needed.
2. Frame the repeatable scenario around the worked issue and its informed-direction
   endpoint, including the person's role and reason to care about the library.
3. Use a minimal interaction sketch to test the selected benefit, retaining freedom
   to ask, inspect and reconsider rather than reproducing every dialogue turn.
4. Identify the orientation information actually needed and how it remains
   available as the investigation changes direction. Do not presume a mandatory
   project-summary or dependency-landscape capability.
5. Map each required answer to current PostCode capabilities, Presentation work or
   new core support; distinguish actual PostCode output from the agent simulation
   and test the consequential capability assumptions.
6. Specify evidence access understandable without source fluency, qualification,
   exact retained-answer presentation, navigation and correction behavior, and
   the selected material needed for the lightweight handoff.
7. Identify a useful first implementation slice and later dependencies without
   settling plan breakdown or reorganizing broader development sequencing.
8. Decide separately whether and where remaining exploratory purpose material
   should be promoted; the simulation itself creates no governing requirements.

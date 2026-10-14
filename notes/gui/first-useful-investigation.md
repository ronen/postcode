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
is the central result so far. **No replacement scenario has yet been selected.**

The working direction is assessing a concrete extension against one fixed
repository state: how it fits existing responsibilities and commitments, and
whether any change is needed. This avoids requiring historical analysis to
establish a repeated-change pattern. The human agreed this direction; the specific
extension remains to be selected. An agent proposal can give the human something
concrete to judge while remaining a qualified account to question. This is not a
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

1. Select a scenario whose human benefit is clear: understanding, challenging an
   assumption, choosing a commitment, assessing a responsibility boundary, or
   directing a change. Avoid choosing solely because recorded results are handy.
2. Establish a credible starting situation and the consequential judgment or
   discovery the human wants to make. An agent proposal is one possible lead.
3. Sketch concrete answers and interactions, distinguishing recorded results,
   illustrative results and additional capability assumptions.
4. Identify exactly what surrounding context is missing before choosing an
   orientation capability. Test the most consequential result assumption.
5. Use the complete journey to identify a valuable first slice and later
   dependencies; leave plan breakdown and broader sequencing open.
6. Decide separately whether and where to promote the emerging purpose principle
   into application design or research material.

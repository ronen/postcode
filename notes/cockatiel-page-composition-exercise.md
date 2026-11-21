# Cockatiel page-composition exercise

Date: 2026-11-21

Exploratory example for [SLICE](slice-scope-discussion.md), not an adopted content
contract, interface design, implementation plan or newly executed investigation.
The human asked for a concrete page including exposed diagrams and extra detail.
Assume a page-composition investigation whose implementation may be mechanical,
agentic or mixed. Guidance, organization and investigator-supplied see-also hints
are available in principle; do not presume they already produce these outputs.

## Evidence and authored additions

The main specimen is the actual generated
[fresh CircuitBreakerPolicy state account](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy-fresh.txt)
and its [diagram](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy-fresh.svg).
The related specimen is the actual generated
[breaker-implementation account](../records/validation/structured-architectural-accounts/m2-trials/follow-up-breaker.txt).
Both concern Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`.
The [trial record](../records/validation/structured-architectural-accounts/m2-trials/README.md)
describes production, captured-source interpretation, limitations and revision.
The artifacts are not independent verification of the implementation's behavior.

All page titles, short explanations, previews, grouping, proposed actions and
connections below are authored for this exercise. They illustrate possible
composition output; they are not retained output from a page-composition agent.
The diagram and full transition text are existing generated output. New explanatory
wording is an attributed paraphrase/synthesis of those accounts, not merely a
mechanical rearrangement demonstrated by the present system. Editorial labels in
this note are not fabricated runtime IDs. No live inference or source investigation
was performed for this exercise.

The [authored journey](initial-journey/cockatiel-account-examples.md) motivates the
concurrency and surrounding-context choices. Its older revision and default
single-trial scope are not imported as answers for this specimen's newer revision
and configurable sampling. In particular, the proposed concurrent-caller picture
below has no supplied answer here.

## The page on arrival

**Circuit breaker: admission and recovery**

**Question being treated:** How does this policy move between admitting calls,
rejecting them and sampling recovery?

**Surrounding context:** This treatment concerns the modes of a circuit-breaker
policy instance. The rule for deciding that recorded failures warrant opening is
delegated to a configured breaker implementation. Individual calls also have their
own progress; this state account summarizes their aggregate effect on the policy.

**Main explanation:**

> In Closed, the policy admits work and reports its outcome to the configured
> breaker. When that breaker's failure criterion calls for opening, the policy
> enters Open and records a recovery delay.
>
> Elapsed time makes a recovery attempt eligible. The transition to HalfOpen shown
> in this account happens when a subsequent execution request arrives after the
> delay. That request joins a bounded recovery sample.
>
> Sampled failures can reopen the policy. If the configured sample completes,
> no sampled call remains in flight, and the failure limit has not already caused
> reopening, the policy returns to Closed.

**Keep visible beside the explanation:**

> This is an interpretation of captured source, not an observed execution. The
> model describes policy state; it does not describe each concurrent caller's
> progress. Manual isolation is another mode, separate from automatic recovery.

**Available expansions:**

- Show the state diagram.
- Explain exactly what starts recovery.
- Show the recovery decision conditions.
- Show concurrent callers during recovery.
- Explain manual isolation.
- Inspect this account's basis, limitations and earlier treatment.

These are content-oriented actions. Their labels need not distinguish retained
content from new investigation. Waiting and inability are still disclosed when
encountered. The example specifies content relationships, not buttons or layout.

## Exposing the diagram and precise detail

### Show the state diagram

Expand the following actual retained picture within this page:

![Actual generated CircuitBreakerPolicy diagram](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy-fresh.svg)

The accompanying caption should identify it as the full four-mode account,
including manual isolation, not a picture of individual calls. Its claimed state
and transition completeness belongs to that account. Constructor hydration is an
alternate entry; serialization and malformed restored state have qualifications
in the full account. Those qualifications remain accessible with the picture.

The existing SVG has crossing edges and truncated labels. It is evidence that
semantic content can be rendered, not a proposed adequate final presentation.
Full transition details must accompany it. Selection of a drawn transition to
expose its detail is proposed interaction, not functionality of this static SVG.
A recovery-focused picture could be offered later, but requires explicit scope
and omissions rather than silently deleting isolation and retaining a completeness
claim. No such new diagram is passed off as existing output here.

### Explain exactly what starts recovery / select transition T2

Show this detail beside or below the diagram, preserving the rest of the page:

> **Open → HalfOpen.** An execution request arrives after the current backoff
> duration has elapsed. The policy creates fresh sample counters and a shared
> deferred decision, increments the attempt number, emits the half-open and
> state-change notifications, and admits that request into the sample.

This authored paraphrase follows T2 of the retained account. The full original
transition text remains accessible. In a mechanical presentation, named trigger,
effect and qualification fields can instead be displayed directly. Opening detail
from the main explanation and from the diagram should reach the same selected
transition, rather than cause duplicate investigation.

### Show the recovery decision conditions

Expose T3 and T4 as distinct conditions, preserving their exact meaning:

| Result | Condition in the supplied account |
| --- | --- |
| Return to Open | A sampled failure is recorded and recorded failures are strictly greater than the configured failure threshold multiplied by the configured sample-call count. The backoff advances and calls waiting on the sample decision are resolved. |
| Return to Closed | The configured number of sampled calls has completed, none remains in flight, and the failure limit has not already caused reopening. Calls waiting on the sample decision are resolved. |

Resolving a wait does not by itself establish the waiting caller's eventual
admission or execution outcome. The page must not manufacture that further claim.
The concurrent-caller treatment is where it could be investigated.

### Explain manual isolation

Reveal the Isolated state and T5–T10 already supplied by the same account:
isolation handles retain manual isolation, further isolation increments their
count, and disposing the final outstanding handle returns an Isolated policy to
Closed. Intermediate disposal does not release the remaining handles' isolation.
The initial placement is elaboration within this page; opening it separately
could be offered without changing the underlying account.

## A missing picture: concurrent callers

**Action:** Show concurrent callers during recovery.

**Preview:** The state model says HalfOpen calls share counters and a deferred
decision. It does not show each caller's progress. This treatment would explain
which callers run or wait, and how the sample's outcome affects them.

**Intended result:** an interaction explanation and, if supportable, a picture
distinguishing the policy instance, sampled executions and other callers under an
explicit sampling configuration. The picture's form is not prescribed here; a
flat policy-state diagram cannot supply the missing interaction meaning.

**Placement:** a connected page, because this is a change from aggregate state
to interactions among participants. The original page retains the named link and
preview. Back returns to its previous reading position and diagram/detail state.
The new page exposes its origin without acquiring a unique mandatory parent.

If an adequate result is retained, open it. Otherwise this action starts work and
keeps its origin available. If only an explanation is obtained, show it and disclose
the absent picture; if the work fails, preserve access to the original account and
allow continuation or an explicit retry. A promise of a diagram is not fulfillment.

This is deliberately an unfilled destination in the exercise. The
[M4 live follow-up record](../records/validation/structured-architectural-accounts/m4-option-context-authoring.md)
reports that a broader half-open diagram follow-up timed out during repair, while
a narrower prose clarification later succeeded. It establishes both an executable
follow-up path and a real failure case, not the desired interaction picture or a
generally reliable way of generating it. The successful stale-sample clarification's
full answer is not preserved in that record, so no explanation of its conclusions
is invented here.

## Surrounding context and routes to other treatments

Display short contextual previews rather than bare entity names:

**What decides that failures warrant opening?** The policy delegates this decision
to a configured breaker. A separate retained account describes the outcome-history
criteria of the breaker implementations; those categories are not the policy's
Closed/Open/HalfOpen modes. **Open the failure-criterion treatment.**

This preview is authored synthesis from the two actual accounts. The destination
has existing generated content, including a diagram, but these trials did not
produce the proposed book link or preview. A composer would need to supply the
qualified connection. The existing follow-up account is a common abstraction over
three implementations, not one singleton machine; its limitations travel with it.

**Policy state and individual calls.** Recovery state is instance-local, while the
account describes several calls contributing to the same HalfOpen decision.
**Open concurrent callers during recovery.**

This contextual distinction uses the actual model's scope and concurrency
limitation. It connects to the same missing destination as the action above,
rather than inventing a second page merely because the route differs.

**Optional further route, not required on this page initially:** how a circuit
breaker interacts with a bulkhead. The authored journey demonstrates the potential
value of that concern, but supplies no same-basis generated answer for this
exercise. It should not be filled with the older journey's conclusions. Its value
here is less immediate than the two connections above; a composer need not expose
every imaginable architectural concern.

## Several accounts, changes and a questionable explanation

The main specimen is the fresh account. The M2 record says it superseded the
earlier designation with grounds of confirmation and refinement; the earlier
account is therefore historical material, not a fabricated equally standing rival.
An earlier-treatment link should say that and preserve its original content.

The [review elicitation](../records/validation/structured-architectural-accounts/m2-trials/review-elicitation.md)
separately demonstrated standing alternatives, including a new explanation reusing
an unchanged model. This exercise does not have their full preserved answer bodies
to present. For that case, the composition must identify the separate treatments;
it may expose exact shared diagram content without declaring agreement between
all their explanations. It must not choose a winner from enumeration order.

If the reader questions T2, selection can identify that exact transition for
further explanation or explicit fresh investigation. A proposed "reconsider this"
operation that carries an objection would require additional capability; recording
inadequacy feedback alone does not supply the objection to an investigator. The
exercise does not pretend that operation is already implemented.

## What the composition must supply

This is a semantic checklist for the example, not a schema or producer assignment.

| Supplied information | Why the presenter needs it |
| --- | --- |
| Page question, subject and basis; main selected treatment(s) | Establish what the page is about and preserve alternatives/history correctly. |
| Main explanation and exact source selections | Display supplied explanation without inventing a summary or confusing it with the original wording. |
| Explanatory roles and applicable qualifications | Separate the main point, necessary caveats, supporting detail and other treatments without concealing important limits. |
| Diagram inputs, coverage and addressable transitions | Expose a picture and its full meaning; selection of T2 reaches its actual detail. |
| Expansion targets, including T2 and T3/T4 | Open retained details without treating every action as new interpretation. |
| Intended continuation relationship | Distinguish elaboration here from the separate caller-interaction treatment. |
| Request/selection meaning and expected result form for lazy destinations | Resolve reuse or new work without changing the user's information request. |
| Qualified context, previews and exact destinations | Explain relevance and share destinations across routes without matching prose labels as identity. |
| Retained origin/destination links and reading context | Support both book connections and return navigation. |

The presenter still owns ordinary arrangement and interaction. It need not receive
pixel positions or a bespoke component tree. An interpretation that creates new
explanation or a substantive relationship remains attributable composition output,
not invisible work by the renderer.

## Provisional findings

- Existing state content can supply a substantial explanation, actual picture,
  precise detail, qualifications and an adjacent retained treatment. The core
  page is not blocked on inventing more diagram semantics.
- The useful page is not obtained by following every referent. Selecting a short
  treatment, supplying contextual distinctions and explaining the relevance of
  adjacent accounts are consequential composition choices.
- The composition may remain mechanically presentable even if some of those
  choices or explanations were interpreted upstream. This exercise does not choose
  which producer supplies them or prove that agents can reliably supply them.
- A missing interaction account cannot be repaired by layout or by drawing more
  arrows on the state model. Lazy exposure needs meaningful partial/failure states.
- Starting with a whole-policy state question makes several details natural
  elaborations; choosing a recovery-only question could change the composition.
  Page scope is useful information, not just a title inferred from a module name.
- A first useful page need not solve general synthesis of arbitrary accounts.
  This specimen still leaves that broader question open, particularly where
  several complementary contributions lack an already supplied reading structure.
- This is an authored content exercise, not a demonstrated GUI, a validated
  architectural account, or a usefulness result. The next discussion can challenge
  the proposed page and its information requirements before selecting implementation.

# Cockatiel page-composition exercise

Started: 2026-11-21. Revised: 2026-11-22 after discussion of page identity,
titles, orientation, broader context and qualified composition.

Exploratory example for [SLICE](slice-scope-discussion.md), not an adopted content
contract, interface design, implementation plan or newly executed investigation.
The human asked for a concrete page including exposed diagrams and extra detail.
Assume a page-composition investigation whose implementation may be mechanical,
agentic or mixed. Guidance, organization and investigator-supplied see-also hints
are available in principle; do not presume they already produce these outputs.

The working model is a **book-style View of a particular investigation**, with
its current qualified response material and composition. The example now describes
page content and relationships. Navigation history, visual placement, labels/icons,
preview presentation and notification design are deferred. The template does not
impose a fixed vocabulary of architectural concerns on every investigation.

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

## Underlying investigation and continuing identity

The page's **underlying investigation** is the investigation whose question and
responses it presents, and which determines its identity. It is distinct from
the page-composition investigation and need not supply every page component.

Here, the underlying investigation is **`state-behavior` on the
`circuit-breaker-policy` module**, with a state-diagram requirement. The fresh
account is a later response to that investigation, not a different page merely
because it is a different response. In ordinary language the question is:

> Explain this circuit-breaker policy's state-dependent behavior.

The module is the actual investigation subject; the generated account identifies
the state bearer as a policy instance. These are related but not interchangeable
identities. The query's scope includes automatic recovery, manual isolation and
qualified initialization/serialization information. The earlier draft's title
"admission and recovery" was a focus introduced by the author, not the original
query. This revision keeps the page aligned with the broader actual investigation.

The page's continuing identity follows that investigation/question, not a specific
execution, response, title or composition. This is a conceptual mapping, not an
invented runtime page ID or a claim of implemented cross-session identity. Updated
responses or compositions can contribute to the same page, with history and
consequential changes preserved. Multiple standing answers need not become a single
winner. Exact historical accounts remain distinct from the current treatment.

## Proposed page composition

The composition below supplies five roles: title, orientation, main content with
expansions, broader-context links and see-also links. Its selection of material
and relationships is itself qualified, addressable and revisable information.
No particular Entity, content type or association schema is selected here.

### Title

**Proposed response title:** Circuit-breaker policy states and transitions.

**Page title:** reuse that title for this composition.

The response title illustrates the agreed descriptive-title attribute to be
provided by the investigating agent. It is not a title attribute demonstrated by
the preserved trial output. Its wording is the investigator's choice. Composition
may supply a different page title if warranted, but this example has no need to.
Neither title is an identity key.

### Orientation

> This treatment explains how a circuit-breaker policy's modes govern execution,
> including automatic recovery and manual isolation. Its state belongs to a policy
> instance. The criterion for opening is delegated to a configured breaker;
> individual calls have their own progress, which this state account summarizes
> only through their aggregate effect on the policy.

This is an authored candidate orientation, not extracted prose. Its local basis
is the state account's applicability, Closed behavior/T1, Isolated behavior and
concurrency limitation. The breaker follow-up reinforces the distinction between
delegated outcome-history criteria and the circuit modes supplied by its caller.
Selecting these distinctions for an introduction is a composition judgment.

The proposed broader contexts below inform that choice: a circuit-breaking frame
motivates distinguishing the policy from its criterion; a state-dependent execution
frame motivates distinguishing policy modes from individual-call progress. Those
broader treatments are illustrative destinations, not actual generated accounts
silently used as evidence. A real composition could examine their qualified
content when available. No particular arrival route or prior reading is assumed.
Whether orientation is reused, authored by composition or delegated remains open.

### Main content: candidate explanatory synthesis

The underlying material supplies four state descriptions, ten transitions and
scope/coverage limitations. The paragraph sequence below is one possible treatment
of that material. **It is newly authored synthesis, not existing generated prose.**
The choice between selecting a suitable existing explanation, composing one, or
supporting both is the next open question in the walkthrough.

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
>
> Manual isolation puts the policy in Isolated, where calls are rejected.
> Outstanding isolation handles keep it there; releasing the final handle returns
> an Isolated policy to Closed. Construction ordinarily starts in Closed, but
> supplying saved state takes a separately qualified initialization path.

The source selections are Closed/T1, Open/T2, HalfOpen/T3–T4, Isolated/T5–T10 and
the entry qualification. An alternative composition could select a suitable
retained prose explanation and the structured model without authoring this
summary. The preserved model text alone does not demonstrate that such an
explanation already exists in the desired form.

### Main-content expansions

An expansion identifies additional material developing this treatment. Its form
of exposure is a UI decision. Requesting it can resolve to retained material or
new production; that distinction does not change the requested content.

| Expansion | Selected material / information requested | Availability in this exercise |
| --- | --- | --- |
| State diagram | The full four-mode state model and its qualifications | Actual retained generated diagram and model text. |
| What starts recovery | The Open → HalfOpen transition, T2 | Actual retained transition; authored paraphrase below. |
| Recovery decision conditions | Reopening/closing conditions, T3 and T4 | Actual retained transitions; authored treatment below. |
| Manual isolation | Isolated and T5–T10 | Actual retained state and transitions. |
| Initialization and saved state | Entry conditions and hydration/serialization limitations | Actual retained qualifications; summary below. |

Concurrent-caller interaction is a separate connected investigation, represented
under see-also links below. Account basis, limitations and history are attached
information, not another mandatory visible page section.

#### State diagram

The composition selects this actual retained picture and its underlying account:

![Actual generated CircuitBreakerPolicy diagram](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy-fresh.svg)

Its scope is the full four-mode account, including manual isolation, not a picture
of individual calls. Its claimed state
and transition completeness belongs to that account. Constructor hydration is an
alternate entry; serialization and malformed restored state have qualifications
in the full account. Those qualifications remain accessible with the picture.

The existing SVG has crossing edges and truncated labels. It is evidence that
semantic content can be rendered, not a proposed adequate final presentation.
The composition connects its transitions to their full detail. How those details
are exposed is deferred; this static SVG does not implement that interaction.
A recovery-focused picture could be offered later, but requires explicit scope
and omissions rather than silently deleting isolation and retaining a completeness
claim. No such new diagram is passed off as existing output here.

#### What starts recovery: transition T2

Candidate detail content:

> **Open → HalfOpen.** An execution request arrives after the current backoff
> duration has elapsed. The policy creates fresh sample counters and a shared
> deferred decision, increments the attempt number, emits the half-open and
> state-change notifications, and admits that request into the sample.

This authored paraphrase follows T2 of the retained account. The full original
transition text remains accessible. In a mechanical presentation, named trigger,
effect and qualification fields can instead supply the detail directly. The
composition identifies this as the same transition referenced by the diagram and
main explanation, not a separate investigation inferred from similar wording.

#### Recovery decision conditions

Expose T3 and T4 as distinct conditions, preserving their exact meaning:

| Result | Condition in the supplied account |
| --- | --- |
| Return to Open | A sampled failure is recorded and recorded failures are strictly greater than the configured failure threshold multiplied by the configured sample-call count. The backoff advances and calls waiting on the sample decision are resolved. |
| Return to Closed | The configured number of sampled calls has completed, none remains in flight, and the failure limit has not already caused reopening. Calls waiting on the sample decision are resolved. |

Resolving a wait does not by itself establish the waiting caller's eventual
admission or execution outcome. The page must not manufacture that further claim.
The concurrent-caller treatment is where it could be investigated.

#### Manual isolation

Reveal the Isolated state and T5–T10 already supplied by the same account:
isolation handles retain manual isolation, further isolation increments their
count, and disposing the final outstanding handle returns an Isolated policy to
Closed. Intermediate disposal does not release the remaining handles' isolation.
Its role is elaboration of the policy-state treatment, not a new answer inferred
from the existence of an Isolated label.

#### Initialization and saved state

The retained entry describes Closed when no truthy initial-state option is
supplied; otherwise construction hydrates the supplied state. The account treats
hydration as an alternate entry rather than a runtime transition, and excludes
malformed restored data from its established intended model. Serialization is
not a live state transition: the account says HalfOpen is serialized as Open.
This authored summary selects existing entry and limitation information; it does
not establish a complete persistence or restoration contract.

### Broader-context links

These are illustrative relationships supplied by the proposed reference
organization, not organization actually generated in the trials:

| Broader treatment / investigation | Proposed relationship to this page |
| --- | --- |
| Circuit breaking: explain the mechanism and its participating responsibilities | The current investigation develops the policy-state aspect; the broader treatment could situate it alongside failure criteria and execution-facing behavior. |
| State-dependent control of execution: explain how persistent control state governs attempts to run work | The current investigation is a particular treatment of that broader concern, distinguishing policy modes from per-call progress. |

The destination descriptions give information needs, not implemented operation
identifiers or a claim that matching accounts exist. Their content remains unfilled
in this exercise. They illustrate several broader frames rather than a mandatory
single parent. A production composer needs supplied, qualified organizing
relationships; it cannot establish them simply by matching words in titles.

These links organize explanations, not implementation containment. Broader/narrower
scope is distinct from more/less detail; expansion T2 is detailed content of this
treatment, not automatically another level of the book's broader-context ordering.
Which broader frames are helpful here remains a point to challenge in discussion.

### See-also links

#### Failure criteria in the breaker implementations

**Connection:** The policy delegates its opening decision to a configured breaker.
A separate retained account describes outcome-history criteria in the breaker
implementations; those categories differ from the policy's Closed/Open/HalfOpen
modes.

**Destination:** the existing investigation behind the
[breaker-implementation account](../records/validation/structured-architectural-accounts/m2-trials/follow-up-breaker.txt),
with that qualified response available as its treatment. The prose label here is
illustrative; the model requires the actual investigation reference rather than
establishing identity through the label.

The connection text is authored synthesis from the two actual accounts. The
destination has generated content and a diagram, but the trials did not produce
this book link. The destination account is a common abstraction over three
implementations, not one singleton machine; its limitations remain attached.

#### Concurrent callers during recovery: an unfilled destination

**Destination investigation:** explain concurrent callers during HalfOpen recovery,
including how sampled executions and other callers relate to the shared decision.
This is a proposed question, not a fabricated existing Query-result identity.

**Preview:** The state model says HalfOpen calls share counters and a deferred
decision. It does not show each caller's progress. This treatment would explain
which callers run or wait, and how the sample's outcome affects them.

**Intended result:** an interaction explanation and, if supportable, a picture
distinguishing the policy instance, sampled executions and other callers under an
explicit sampling configuration. The picture's form is not prescribed here; a
flat policy-state diagram cannot supply the missing interaction meaning.

**Relationship:** a separate connected treatment, because this changes the question
from aggregate policy state to interactions among participants. Its relationship
to this investigation is retained independently of navigation history. It is not
a broader treatment merely because it is a follow-up.

The same content request may resolve to a suitable retained result or obtain new
work. Partiality or failure must remain distinguishable from a fulfilled picture;
the UI for progress, notification, recovery and return is outside this exercise.

This is deliberately an unfilled destination in the exercise. The
[M4 live follow-up record](../records/validation/structured-architectural-accounts/m4-option-context-authoring.md)
reports that a broader half-open diagram follow-up timed out during repair, while
a narrower prose clarification later succeeded. It establishes both an executable
follow-up path and a real failure case, not the desired interaction picture or a
generally reliable way of generating it. The successful stale-sample clarification's
full answer is not preserved in that record, so no explanation of its conclusions
is invented here.

#### Possible additional connection, not selected in the initial composition

One further concern is how a circuit breaker interacts with a bulkhead. The
authored journey demonstrates the potential
value of that concern, but supplies no same-basis generated answer for this
exercise. It should not be filled with the older journey's conclusions. Its value
here is less immediate than the two connections above; a composer need not expose
every imaginable architectural concern.

## Scope, basis and qualifications across the composition

These belong to the material and its use in the page, not necessarily a separate
visible section. This section documents them for the exercise without deciding
their default prominence, indicators or detail presentation.

- The actual accounts concern the captured Cockatiel revision stated above and
  are source interpretations, not observed executions or independent validation.
- The main model claims four states and ten transitions, with explicit limits
  concerning concurrent calls, hydration, serialization and malformed restored
  state. A summary or diagram must preserve those limits where applicable.
- The candidate title, orientation, main explanation and detail paraphrases are
  authored for this exercise with the source selections described. Their relation
  to the original content remains identifiable; they are not silently attributed
  to the original investigator.
- Broader-context relationships and see-also relevance are proposed organizing
  judgments. Mentioning another account does not independently corroborate it.
- The concurrent-caller destination and broader treatment contents are not supplied.
  Neither an offered route nor a promised picture establishes its fulfillment.
- The composition has its own qualified selection and relationships. Its parts
  can be reused or revised without losing their prior meaning, but revising one
  part does not automatically establish coherence of the remaining composition.

The precise representation of components and composition remains open: they need
not all be Entities or all be separate responses. The renderer presents the supplied
meaning; it does not derive missing architectural claims from arrangement.

## Several accounts, changes and a questionable explanation

The main specimen is the fresh account. The M2 record says it superseded the
earlier designation with grounds of confirmation and refinement; the earlier
account is therefore historical material, not a fabricated equally standing rival.
The historical relationship preserves that distinction and the original content;
its notification and presentation remain UI decisions.

The [review elicitation](../records/validation/structured-architectural-accounts/m2-trials/review-elicitation.md)
separately demonstrated standing alternatives, including a new explanation reusing
an unchanged model. This exercise does not have their full preserved answer bodies
to present. For that case, the composition must identify the separate treatments;
it may expose exact shared diagram content without declaring agreement between
all their explanations. It must not choose a winner from enumeration order.

T2 remains an exact referent for further explanation or reconsideration. Carrying
a reader's objection to an investigator requires additional capability; existing
inadequacy feedback alone does not do that. The interaction for raising an objection
is outside this content walkthrough.

## What the composition must supply

This is a semantic checklist for the example, not a schema or producer assignment.

| Supplied information | Why the presenter needs it |
| --- | --- |
| Investigation reference, subject, parameters/requirements and basis; selected response material | Establish continuing page identity and distinguish current selections from earlier responses. |
| Response title and chosen page title | Label the response and its presentation without using wording as identity. |
| Orientation and its supporting material/context | Supply the local explanatory frame without assuming the renderer will invent one. |
| Main explanation and exact source selections | Display supplied explanation without inventing a summary or confusing it with the original wording. |
| Explanatory roles and applicable qualifications | Separate the main point, necessary caveats, supporting detail and other treatments without concealing important limits. |
| Diagram inputs, coverage and addressable transitions | Expose a picture and its full meaning; selection of T2 reaches its actual detail. |
| Expansion targets, including T2 and T3/T4 | Open retained details without treating every action as new interpretation. |
| Intended continuation relationship | Distinguish elaboration here from the separate caller-interaction treatment. |
| Request/selection meaning and expected result form for lazy destinations | Resolve reuse or new work without changing the user's information request. |
| Qualified broader-context and see-also relationships, connection explanations and destination references | Distinguish scope relationships from other relevance and preserve shared destinations across routes. |
| Composition identity, qualification and selected component roles | Make the assembly itself available for examination and revision while preserving its basis and earlier meaning. |

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
- Starting with the actual policy-state investigation makes recovery and isolation
  natural parts of the same treatment. A separately scoped recovery investigation
  could have another page; changing a title alone does not change the question.
- A first useful page need not solve general synthesis of arbitrary accounts.
  This specimen still leaves that broader question open, particularly where
  several complementary contributions lack an already supplied reading structure.
- This is an authored content exercise, not a demonstrated GUI, a validated
  architectural account, or a usefulness result. The next discussion can challenge
  the proposed page and its information requirements before selecting implementation.

## Where to resume the walkthrough

Title, orientation, broader context and the general page/composition model have
been discussed. Resume with **main content**: what must the underlying investigation
supply, what may composition select or synthesize, and what makes material a main
explanation rather than an expansion? The candidate paragraph sequence above makes
that open choice explicit; this revision does not decide who should produce it.

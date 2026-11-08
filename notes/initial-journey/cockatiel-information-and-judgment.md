# Cockatiel: information consulted and human judgment

Recorded: 2026-11-07
Revised: 2026-11-08 — human-read issue, name leads and library-only investigation
Status: exploratory companion pass; not an implementation plan or chosen UX

## Purpose and reading convention

This pass preserves the sequence and numbering of the
[human + PostCode walkthrough](cockatiel-human-postcode-walkthrough.md). Each step
links to its full verbatim human turns and concept selections there. That document
remains unchanged as a reference. Here each step has five parts:

- **Before:** the question, working understanding or intention at this point.
- **PostCode interaction:** subject/scope, desired information and a minimal
  operation; sometimes no new interaction is needed.
- **What PostCode shows:** concrete, qualified account content.
- **After:** a plausible change in understanding or ability to proceed, remaining
  uncertainty, and our assessment of what the information does or does not support.
- **Review point:** a design question or limitation worth examining together.

Before/after descriptions are reconstructions unless explicitly attributed to the
recorded dialogue. They do not claim that displaying an account caused the human
to understand, accept or rely on it. The after section can examine a tempting
inference as well as useful progress. A recorded proposal is evidence of what the
human expressed, not a complete account of their reasoning.

The working route emphasizes accounts of existing software that the human relates
to a reported need read outside PostCode.
The human considers design ideas without necessarily supplying them to PostCode.
Hypothetical comparison is not required in these interactions; review points
identify where requesting it might add value. Optional capture of an intention
or proposal is distinguished from asking PostCode to analyze it. This is a
simplification for the exercise, not a restriction on PostCode's adopted scope.

For this exercise, assess PostCode as a window onto the software: does it provide
and make accessible the architectural information the human would otherwise need
to obtain by reading source, sufficiently to reason about the change under
consideration? This does not require reproducing every implementation detail or
acting as a design analyst. A human can misunderstand source code too; success
means supporting informed reasoning, not guaranteeing correct human conclusions.
PostCode remains responsible for the fidelity and qualifications of its own
accounts, including making relevant detail and supporting evidence accessible.

The human observed that prominently available information could change the order:
the operating model might be consulted well before step 6. Holding the order fixed
tests information needs, not likely navigation behavior. Grouped steps are not
atomic requests, and later revisiting a question does not mean earlier content was
absent or necessarily understood. The route uses corrected accounts rather than
deliberately reenacting mistakes from the dialogue.

**PostCode interaction** describes the human side: available subjects they refer
to, the request they make, and any other material supplied or access needed.
Include an **Other input/access** entry only when it identifies an additional
input or access requirement for that step.
**What PostCode shows** describes the result, including named subjects introduced
by the account. A **Newly selectable** note appears only where it clarifies a later
selection; it is not a second inventory required at every step.

**What PostCode shows** can span both the initial display and information the
human exposes through additional selections, expansion or following displayed
relationships within that step. It need not appear all at once. This sketch leaves
the exact clicks and whether information is precomputed or produced on demand
open. Intermediate actions are made explicit where they materially change the
question or reveal a missing navigation route. This convention concerns the
experience; it does not reclassify new analysis as presentation-only work.
Verbs such as select, expand, follow and revisit describe human UI actions,
not prose instructions for an agent to decide what to explore. Listed perspectives
and relationships identify the information sought and possible routes to it;
they do not prescribe a click for every bullet or a fixed order unless a subject
must first be exposed before it can be selected.

Names describe what the human can recognize, not implementation identifiers. A
subject can be a policy type, architectural role, relationship or selected account
aspect; it need not be a source-code component. State, responsibility and contract
are perspectives; a particular state or transition can become a subject when an
account exposes it for further selection. Naming something in prose alone does
not provide that selection: the indicated routes are requirements for this sketch,
not delivered navigation capabilities.

References to earlier steps identify the account in which a subject became
available. They do not establish that the human noticed or understood it. Cases of
a supported operating model remain distinct from runtime instances or claims
about the reporter's uninspected application. Requests for further detail can
return partial or unavailable information.

## Basis and assumptions

Cockatiel content comes from the [working account](cockatiel-working-account.md)
and original dialogue, at revision `f48bea55022ab15ab07eb52a79bfc1e661300fd4`,
issue #111 read on 2026-10-14. This pass adds no code inspection, execution or
PostCode inference. For the 2026-11-08 revision, the author reread the
[issue body](https://github.com/connor4312/cockatiel/issues/111) to confirm the starting
terms circuit breaker, CircuitState and CircuitBreakerPolicy. That editorial check
is not an action performed by PostCode in the journey or a new validation of the
application's behavior. What PostCode shows below is illustrative account content,
not actual product output. Original static interpretations, reported experiences,
corrections and unresolved cases retain their qualifications.

**Information boundary for this route:** the human reads the issue outside
PostCode. PostCode receives the selected Cockatiel repository and the human's name
leads/selections, not the issue text, its URL, the reported application scenario,
or the reporter's workaround and proposal. Connections between library behavior
and that scenario belong to the human's reasoning. Returning to the issue is an
outside-PostCode activity. Historical dialogue and the working account support
our design notes; they are not implicitly preloaded into the simulated product.
Optional correction inspection uses only explicitly available library-account
material, not the entire original conversation. Optional capture of human intent
likewise conveys only what the human supplies, with no automatic issue context.

The [concept references](architectural-concept-references.md) ground context,
responsibility, ownership/access, contract, state, interaction and rationale.
Evidence inspection and exact-answer operations are supporting actions. Assume
choices are discoverable and the human can use them. UI wording and controls
remain unspecified; the interactions state what is selected and requested.

Supplying hypothetical designs or intentions remains possible through an
unspecified mechanism if needed. The main route does not depend on it for analysis.
The human can compare and reason from accounts, while PostCode still supplies
substantive interpretation of existing architecture. Inferring behavior or
correspondence is analytical work, not a rendering operation. A supplied human
conclusion retains its provenance and does not become independently supported
PostCode analysis merely by being recorded.

<a id="orientation"></a>
## 1. What Cockatiel is for

[Original step 1 and question](cockatiel-human-postcode-walkthrough.md#orientation)

**Before:** I have read the GitHub issue outside PostCode, but know little about
Cockatiel. Is the job-submission activity described there part of the library, or
an application using it? I have encountered these names:

- **circuit breaker:** a term in the report's prose, giving me an architectural lead.
- **CircuitBreakerPolicy:** a name in the issue's example that may identify the
  relevant policy in Cockatiel.
- **CircuitState:** another name in that example, apparently related to its states.

Recognizing those names does not mean I understand the programming language,
the example's syntax, or the relationship between the named things. They are
starting leads, not names supplied because we already know the answer.

**PostCode interaction:**

- **Entry context and name leads:** the human selects the Cockatiel repository
  and uses “circuit breaker” or `CircuitBreakerPolicy` to locate a subject.
  `CircuitState` is an additional lead if needed; the issue itself is not supplied.
- **Request:** inspect the meaning of the matched subject before choosing it;
  then request its responsibility and surrounding Cockatiel context. The content
  below may include detail exposed through further UI selections within that
  account, under the walkthrough's reading convention.

**What PostCode shows:**

- **Meaning of the name leads:** the matched `CircuitBreakerPolicy` subject is
  explained as the circuit-breaker policy. If the human uses `CircuitState`, the
  result identifies it as the breaker's state vocabulary, not a particular live
  breaker or a separate job system. These are illustrative semantic lookup results;
  resolving the names and their relationship requires supported analysis.
- **Overall purpose:** Cockatiel is a resilience library: it controls how
  application-supplied work is attempted when failures, delays or limited capacity
  matter. It does not need to understand the business meaning of that work.
- **Application role in Cockatiel's operating model:** the caller supplies the
  work that policies govern. Business job identity, acknowledgment and stored
  outcomes, where needed, are outside Cockatiel's responsibilities. This is an
  architectural responsibility boundary; PostCode has no particular caller
  application to describe in this route.
- **Policy:** an element that governs execution of application-supplied work
  according to configured rules. Cockatiel applications create policy instances
  and can reuse them across operations or combine them with other policies.
- **Cockatiel's policy family:** kinds of Policy with distinct responsibilities:

  - **Circuit breaker:** withholds attempts after configured failures, then allows
    limited trial executions to find out whether work can succeed again.
  - **Bulkhead:** limits concurrent execution and can queue operations in memory
    while they wait for capacity; refuses work when execution and queue capacity
    are exhausted. This is not a durable background-job service.
  - **Retry:** repeats an operation after selected failures, possibly with delays.
  - **Timeout:** applies a time limit; stopping underlying work depends on
    configuration and the operation's cooperation.
  - **Fallback:** supplies an alternative value or action after a selected failure.
  - **No-op:** passes execution through without adding a protection rule.
- **External dependency as an illustrative role:** application-supplied work
  might call an external service. Cockatiel's breaker regulates attempts based
  on observed outcomes; it does not directly establish that service's health.
  This illustrates a use of the library, not a discovered application dependency.
- **Relationships in the operating model:** the application supplies an operation
  to a policy for execution, and policies can be combined around that operation.
  An operation can interact with an external dependency in the illustrative
  usage above; that relationship does not assert a specific application's structure.
- **Basis and scope:** these responsibilities and relationships come from the
  library documentation and implementation, with the usage illustration labelled
  as such. The named items are architectural subjects and policy types, not a
  source-module decomposition or an exhaustive repository inventory. No issue
  analysis or application-specific claim is part of this result.

**After:** The human could connect the library's application/policy boundary to the
job-submission issue they read. That connection is their reasoning: PostCode has
not explained the reporter's application or inferred why the human asked. The
names now have enough meaning to select relevant architectural information without
reading source syntax. This remains initial orientation, not a complete operating
model; the original dialogue's later questions show that an early explanation
did not settle all of that understanding.

**Review point:** This explanatory account is a substantive requirement. Can the
human locate the relevant subject from issue-supplied names without reading code?
The lookup must distinguish a policy from state vocabulary, rather than silently
choose an answer. Whether surrounding context appears immediately or is opened
next remains a UI question. The bullets specify candidate content, not a fixed
layout or a demand that all detail appear at once. Naming the policy family here
could answer later questions earlier; the sequence remains a coverage reference.

<a id="readiness"></a>
## 2. Proposing readiness and considering reservation

[Original step 2, exchanges 2–3](cockatiel-human-postcode-walkthrough.md#readiness)

**Before:** A readiness check seems promising. Would it merely report an opportunity,
or secure one? In the original dialogue the human favored an advisory check while
still associating Cockatiel with managing background jobs.

**PostCode interaction:**

- **Available subjects:** Circuit breaker, Bulkhead, application role and supplied
  operation from [step 1](#orientation).
- **Request:** select the breaker's inspection/execution contract and the
  supplied operation's ownership. The displayed supplied-operation relationship
  provides a route between them. Revisit Bulkhead's queue role if needed.

**What PostCode shows:**

- **Circuit breaker — stored state:** an inspection describes the breaker's
  retained state. Reading it does not itself supply application work or reserve
  an opportunity to execute.
- **Execution/admission:** an application supplies an operation for execution;
  policy behavior determines whether it proceeds, waits or is refused. The
  detailed cases can be expanded on the policy.
- **Bulkhead — capacity and waiting queue:** execution capacity and queue capacity
  are resources controlled by the bulkhead, separate from the application's
  business job records.
- **Application role → supplied operation:** the caller controls work outside
  the policy-governed execution. The library account does not identify a particular
  job-preparation sequence; the human connects it to what they read in the issue.
- **Timing qualification:** state and available capacity can change between
  inspection and execution. This explains a limit of existing observations; it
  is not a specified contract for the human's proposed readiness query.

**After:** The human might infer that observing current conditions could avoid some
wasted preparation without securing later execution. In the dialogue they agreed
to explore that weaker promise. Our assessment: the boundary clarification helps,
but neither asynchrony nor queueing rules out reservation. Whether a weaker promise
is sufficient remains a design judgment, and the proposed readiness check's precise
meaning remains unsettled.

**Review point:** Does this window onto Cockatiel provide enough information to
reason about observation versus reservation without reading source? In particular,
can the human see what inspection does, what execution does, who controls the work,
and what can change between inspection and execution? The human judges what a
proposed readiness check should promise; PostCode need not assess that proposal
to make the existing behavior understandable.

<a id="scope"></a>
## 3. Other mechanisms and fit with the library

[Original step 3, exchanges 4–6](cockatiel-human-postcode-walkthrough.md#scope)

**Before:** Is breaker-based readiness the only mechanism? If we introduce readiness,
should it cover others, and which would fit Cockatiel's purpose? These are questions
about possible scope, not a commitment to generalize.

**PostCode interaction:**

- **Available subjects:** Cockatiel, Policy, its policy family, Circuit breaker,
  Bulkhead and external dependency role from [step 1](#orientation); inspection/capacity aspects
  from [step 2](#readiness).
- **Request:** revisit responsibilities and documented purpose; expand the meaning
  of the breaker's state information and the bulkhead's capacity information.

**What PostCode shows:**

- **Circuit breaker:** failure/recovery state governs attempts. Permission from
  the breaker does not establish that the dependency is currently healthy.
- **Bulkhead:** execution and queue capacity describe room for work; they do not
  measure dependency health. This expands the capacity aspect exposed in step 2.
- **Cockatiel purpose and policy family:** reuse step 1's resilience-library
  description and named responsibilities, with documentation attribution.
- **Relationship to an illustrative external dependency:** application-supplied
  work may contact a service while policies govern its execution. An external
  health signal is not established by either policy-state account. No particular
  application or dependency is identified.
- **Scope of the account:** no active-probe or general readiness facility is
  identified by this material. That is a limit of what has been established here,
  not an exhaustive search proving that no related mechanism exists. Deciding
  what future facilities fit the product remains open.

**After:** The human has grounds to consider whether a common concept is useful,
without assuming permission, capacity and health mean the same thing. They might
bring probes or health signals from architectural knowledge. In the original
dialogue, the agent introduced those alternatives; the displayed current accounts
do not establish that the human would independently generate that set. A broader
scope decision remains open.

**Review point:** The origin of alternatives is a real dependency, not something
hidden inside “show responsibility.” Reusing the earlier candidate list would be
consulting attributed material; generating new candidates or assessing their fit
would be an additional contribution. Discuss whether this simpler route is enough.

<a id="preference"></a>
## 4. Choosing conservative scope

[Original step 4, exchange 7](cockatiel-human-postcode-walkthrough.md#preference)

**Before:** The issue could grow into a broader readiness feature. I prefer a change
that addresses the immediate need, fits existing capabilities and leaves room to
grow without implementing unrequested features.

**PostCode interaction:**

- **Available subjects:** Circuit breaker and library responsibilities from
  [steps 1–3](#orientation); the issue remains outside PostCode.
- **Request:** none. Optionally supply the scope preference against the selected
  breaker inquiry; this records human intent without supplying or analyzing the issue.

**What PostCode shows:**

- **Retained reference material:** the existing library responsibility accounts
  remain as shown; this turn produces no new software claim or report of the issue.
- **Optional human preference record:** if supplied, it says to address the
  immediate need, fit existing facilities and leave room for growth without
  building unrequested features. Its author is the human in this exercise.
- **Association and limit:** associate that preference with the selected breaker
  inquiry. Any reference to “the immediate need” remains the human's wording,
  not evidence that PostCode knows the external issue. Without capture, there is
  no new preference record; with capture, it is not a maintainer requirement.

**After:** The human has set a criterion for later judgment. This preference was
explicit in the original dialogue. It does not settle which mechanism fits best,
and PostCode has not adopted it as a Cockatiel maintainer requirement.

**Review point:** This is a human contribution, not a question PostCode must answer.
Opening a rationale account merely to read back a just-expressed preference would
be unnecessary. Later recall may be useful; capture is not endorsement.

<a id="waiting"></a>
## 5. Comparing bulkhead and breaker readiness

[Original step 5, exchange 8](cockatiel-human-postcode-walkthrough.md#waiting)

**Before:** Bulkhead also seems to expose capacity readiness. What does it actually
mean, and would that support unifying it with breaker readiness?

**PostCode interaction:**

- **Available subjects:** Circuit breaker and Bulkhead ([step 1](#orientation)),
  execution/admission, execution capacity and waiting queue ([step 2](#readiness)).
- **Request:** select admission contracts for both policies, including their
  waiting cases. The cases may appear initially or through expansion.
- **Other input/access:** optional correction inspection requires the earlier
  library account and its corrected version to be explicitly available. The
  recorded dialogue supplies the example; this route has not generated that history.

**What PostCode shows:**

- **Bulkhead — start case:** available execution capacity lets a call proceed.
- **Bulkhead — wait case:** with execution capacity occupied and queue capacity
  remaining, a call waits in memory; its execution result remains pending.
- **Bulkhead — refusal case:** exhausted execution and queue capacities prevent
  acceptance of another call under this mechanism.
- **Circuit breaker — recovery case:** half-open is the recovery state in which
  limited trials of application work can run. In the recorded default single-trial
  case, other callers can wait while the trial is in progress.
- **Waiting caller → trial outcome:** after that wait, the breaker decision can
  still refuse the caller. Waiting for a recovery decision is therefore different
  from waiting for an execution slot.
- **Correction detail, if opened:** the original dialogue's normal/trial/blocked
  account omitted waiting; the later account adds it. The original and correction
  are separately attributable, rather than silently rewriting one another.
- **Conditions:** these are static interpretations of the inspected revision.
  Other recovery sampling configurations were not worked through. The start/wait/
  refuse cases are policy-scoped subjects, not a generic new acceptance API.
- **Newly selectable:** half-open and its recovery-trial interaction are exposed
  within the breaker account, providing a route to the closer examination in
  [step 13](#trial).

**After:** Shared admission vocabulary might lead the human toward a common query.
The waiting details give them reason to distinguish immediate progress from
acceptance and eventual execution. Our assessment: the resemblance is a reasonable
lead, but it does not establish a common contract. Composition and the rest of the
policy family still matter; the human remains positioned to investigate, not to
regard unification as settled.

**Review point:** Discuss whether these accounts make the differences clear enough,
or whether an explicit comparison of existing behavior is needed. Side-by-side
placement is presentation; new semantic correspondence is analytical content.
Neither requires a verdict on the desirability of unification.

<a id="operating-model"></a>
## 6. Understanding policy objects and composition

[Original step 6, exchanges 9–11](cockatiel-human-postcode-walkthrough.md#operating-model)

**Before:** I still lack the theory of operation. Does the application queue jobs,
create manageable job instances, or use policy objects? How do breaker and bulkhead
work together?

**PostCode interaction:**

- **Available subjects:** Policy, application role, supplied operation and policy
  family, including the “policies can be combined” relationship
  ([step 1](#orientation)); waiting cases from [step 5](#waiting).
- **Request:** select Policy's interaction and ownership at the application/library
  boundary. The displayed combination relationship provides access to wrapping
  and its ordering cases. Those cases may be shown together or opened individually;
  the route does not require selecting a composition before it has been identified.

**What PostCode shows:**

- **Application role:** creates and retains policy instances, chooses which calls
  share them, and supplies operations. Cockatiel does not automatically group
  operations by the external service they contact.
- **Reusable policy instance:** expand the instance notion introduced with Policy
  at step 1. An instance carries configured policy behavior across calls; a shared
  breaker retains failure/recovery state, while a shared bulkhead retains capacity
  counts and its waiting queue. This describes the operating model, not a discovered
  runtime instance in a particular application.
- **Individual execution:** is a particular use of a policy with a supplied
  operation. Its own progress, such as retry attempts, is distinct from shared
  policy state. Its result is pending until it completes with a value or error.
- **Wrapping/combined execution entry:** an outer policy controls calls into the
  next policy. Component instances and their states remain distinct; wrapping
  does not fuse them into one shared state machine.
- **Bulkhead outside Circuit breaker:** work can occupy bulkhead execution
  capacity while waiting for the breaker to finish its recovery decision.
- **Circuit breaker outside Bulkhead:** a recovery attempt can be admitted by
  the breaker and then wait for bulkhead capacity.
- **Scope and evidence:** the two orderings are supported usage patterns described
  through static interpretation. They are not observed executions or identified
  objects in the reporter's application. The combination relationship from step 1
  is expanded here into selectable patterns.
- **Newly selectable:** the wrapping account exposes the two named ordering
  cases above. The human can select either case to inspect its interaction and
  ownership, without needing to identify a concrete application wrapper.

**After:** The human could form a more usable model of the library and recognize why
ordering matters. They are better positioned to reason about where a query belongs.
Learning that instances compose does not yet establish what a combined query
would promise, and the source-language object model need not be deciphered.

**Review point:** This expands the brief Policy account from step 1; it need not
introduce the concept for the first time. More of this detail might be useful earlier,
but we preserve the sequence here. Responsibilities alone do not communicate the
operating model; relationships between the accounts are part of the information need.

<a id="acceptance"></a>
## 7. Choosing what an acceptance query should promise

[Original step 7, exchanges 12–14](cockatiel-human-postcode-walkthrough.md#acceptance)

**Before:** Could a policy answer “available now”? Perhaps “acceptable,” including
queueing, would better express what I need. Should a negative answer explain why?

**PostCode interaction:**

- **Available subjects:** Policy and its named types ([step 1](#orientation)),
  admission outcomes and waiting cases ([step 5](#waiting)), and component instances
  and composition orderings ([step 6](#operating-model)).
- **Request:** revisit the admission accounts; expand state/capacity inspection and
  the meaning of refusal information. Select the policy or its exposed outcome,
  with contract/state as the requested perspective.

**What PostCode shows:**

- **Bulkhead — execution slots and queue slots:** inspection can expose capacity
  to start immediately separately from capacity to wait. Reuse the start/wait/
  refuse cases from step 5 rather than invent a new admission model.
- **Circuit breaker — recovery delay:** after opening, elapsed time matters to
  eligibility for another trial. Stored state alone need not answer that question;
  the transition conditions can be expanded.
- **Circuit breaker — manual isolation:** an explicitly held-open condition is
  distinct from waiting for an ordinary recovery delay.
- **Circuit breaker — last failure:** information about prior failure can explain
  the breaker's history; it is not a fresh observation of dependency health.
- **Observable distinctions:** immediate start, waiting, later admission/refusal
  and eventual result are separate facts about an execution. Inspection reserves
  neither capacity nor permission, and conditions may change afterward.
- **Contract boundary:** these facts belong to existing policy accounts. There is
  no existing generic “acceptable” query established here, and no proposed return
  type or promise has been analyzed.

**After:** The human may prefer a promise that includes waiting and supplies reasons.
Those candidate choices were expressed in the dialogue. The accounts make the
choices intelligible; they do not force them or finish the result-type design.
A plausible interpretation of “acceptable” still needs conditions, especially for
compositions whose state changes while work waits.

**Review point:** Hypothetical analysis is not required just because the human is
designing. Its additional benefit would be checking a supplied promise for missing
conditions, races or contradictions, rather than restating the human's choice.

<a id="need-check"></a>
## 8. Assessing whether the proposal addresses the reported need

[Original step 8, exchange 15](cockatiel-human-postcode-walkthrough.md#need-check)

**Before:** I have a candidate query in mind. Would it address the reporter's
original problem? I return to the issue outside PostCode if necessary: the reported
application checks stored state before costly preparation and withholds work while
it says open. That report is my context, not an account held by PostCode.

**PostCode interaction:**

- **Available subjects:** Circuit breaker identified at [step 1](#orientation),
  stored state ([step 2](#readiness)) and recovery delay ([step 7](#acceptance)).
- **Request:** expand the breaker's state meanings and transition/admission
  conditions. No request asks PostCode to inspect the reported preparation gate.

**What PostCode shows:**

- **Circuit breaker — closed/open/half-open:** closed permits ordinary execution;
  open withholds attempts; half-open is the recovery-trial state. Manual isolation
  remains distinct from ordinary timed recovery.
- **Open-to-half-open transition:** an arriving execution checks elapsed recovery
  time and, when eligible, triggers the transition and supplies trial work.
  Elapsing time or reading stored state alone does not do so.
- **Execution dependency:** while no execution arrives, this recovery transition
  has no execution trigger. This describes library behavior for any applicable
  caller; it is not an analysis of the reporter's preparation gate.
- **Basis and limit:** the account comes from the inspected library behavior.
  It establishes neither a particular application's behavior nor whether the
  human's proposed query would solve that application's problem.

**After:** The human can connect the reported withholding of work to the library's
need for an arriving execution, and might conclude that recognizing trial eligibility
before preparation addresses the obstacle. Both the cross-source connection and
the judgment about the proposed query belong to the human here. They depend on
interpreting the report correctly and on the query having the intended meaning;
they guarantee neither later admission nor success. The original conversation
requested confirmation from an agent; this route has not demonstrated equivalent
unaided reasoning.

**Review point:** If the comparison is difficult, having PostCode assess the scenario
could add scrutiny, but it would require explicitly supplying scenario material
and would extend this simpler route. Neither the human's inference nor a future
assessment should be mistaken for a verified fix.

<a id="component-access"></a>
## 9. Access to a wrapped breaker

[Original step 9, exchange 16](cockatiel-human-postcode-walkthrough.md#component-access)

**Before:** Would callers already have access to the breaker after it has been
wrapped with a bulkhead? That affects whether a component-specific facility is
practical.

**PostCode interaction:**

- **Available subjects:** reusable policy instances, combined entry and component
  relationships from [step 6](#operating-model); application role from step 1.
- **Request:** on that composition model, select ownership/access. Expand the
  caller arrangements exposed by the account.

**What PostCode shows:**

- **Combined execution entry → component instances:** wrapping reuses the
  component policies; it does not inherently make the original breaker inaccessible.
- **Assembling caller:** a caller that creates or combines the policies can keep
  its direct breaker reference and inspect it separately.
- **Caller given only a protected operation:** access to execution need not include
  access to the component breaker. That depends on the interface its application
  exposes to it.
- **Boundary qualification:** these two caller roles explain permitted arrangements,
  not how the reporter's application is structured or which arrangement is typical.
  No usage-prevalence evidence is present in this account.

**After:** The human could see that component-specific inspection can serve some
callers, while a common facility might help others. This is enough to keep both
possibilities in consideration. It does not justify a general interface based on
an unsupported assumption about “typical” applications.

**Review point:** The available account establishes possible arrangements, not their
prevalence. Product scope may need more usage evidence if typicality becomes a
deciding consideration.

<a id="generic-interface"></a>
## 10. Generalizing to the policy interface

[Original step 10, exchanges 17–18](cockatiel-human-postcode-walkthrough.md#generic-interface)

**Before:** The query seems meaningful for breaker, bulkhead and either wrapping order,
so perhaps it belongs on the generic interface. Are there other policy types I
have not considered?

**PostCode interaction:**

- **Available subjects:** Policy, its family and all six named types
  ([step 1](#orientation)); the execution model and wrapping cases
  ([step 6](#operating-model)).
- **Request:** select Policy's common execution contract, then consult its named
  kinds for their particular contracts. Reuse the composition waiting accounts.

**What PostCode shows:**

- **Policy — common execution contract:** members of the policy family accept
  supplied work for governed execution and report its eventual outcome. Sharing this role
  does not establish a common pre-execution acceptance query.
- **Circuit breaker and Bulkhead:** revisit the state/capacity and waiting contracts
  already exposed, including each mechanism's refusal conditions.
- **Retry:** controls repeated attempts after selected failures; it is not simply
  another capacity or breaker gate.
- **Timeout:** controls time allowed under configured cancellation behavior.
  It does not by itself provide the same admission meaning as available queue slots.
- **Fallback and No-op:** fallback supplies an alternative after a selected failure;
  no-op passes through execution. The family names were already available at step 1;
  this selection expands their relevance to the shared contract.
- **Composition and time:** reuse the ordering cases from step 6. Conditions when
  an inner policy is reached can differ from a snapshot taken before waiting.
  Thus a negative component snapshot need not predict final refusal by the wrapper.
  This is qualified reasoning about existing behavior, not validation or rejection
  of the human's proposed generic interface.
- **Coverage:** no generic acceptance contract has been completed in this inquiry.
  Similar terminology is insufficient to assert uniform policy semantics.

**After:** The human might recognize that the initial generalization covered too
little of the family, or promised too much about future execution. The original
proposal and surprise at other policies are recorded; a rejection at this point
is not. In this route the policy names already appeared at step 1, so this can be
a return to overlooked information rather than the discovery of previously absent
policy types. They could refine, narrow or retain the idea. Our assessment: information
supporting a shared vocabulary was not sufficient to establish a shared contract.

**Review point:** Do these existing-behavior accounts expose the difficulty clearly
enough? If not, analyzing the supplied contract against a concrete counterexample
could materially improve judgment. Keeping the decision human-owned must not
excuse concealing contrary behavior in PostCode's accounts.

<a id="outcomes"></a>
## 11. Understanding existing failure reporting

[Original step 11, exchange 19](cockatiel-human-postcode-walkthrough.md#outcomes)

**Before:** What do policies already provide to explain failure or blocking? I need
that picture before deciding what additional reporting a query should offer.

**PostCode interaction:**

- **Available subjects:** Policy ([step 1](#orientation)) and its common execution
  contract ([step 10](#generic-interface)), wait/refuse outcomes ([step 5](#waiting)),
  and component/wrapper roles (step 6).
- **Request:** select outcomes and notifications for policy execution, including
  how an inner outcome reaches the final caller through an outer policy. Related
  outcomes may be shown together or explored through their displayed relationships.

**What PostCode shows:**

- **Individual execution — pending versus completed:** a waiting call has not
  yet produced a final value or error. Waiting is not itself a failure report.
- **Admission refusal:** the policy can refuse an attempted execution with an
  identifiable refusal error. This differs from an operation that ran and failed.
- **Operation failure and selected failure-valued result:** policy configuration
  can classify thrown errors or returned results as unsuccessful; a classified
  return value need not become a thrown exception.
- **Inner outcome → outer policy → final caller:** retry or fallback can respond
  to an inner failure, so a local failure need not be the final caller-visible error.
- **Policy-local notifications:** events describe activity of the policy emitting
  them. They are not automatically one report covering the whole composition.
- **Circuit breaker exception to a tempting inference:** admission refusals do
  not take its ordinary operation-failure event path. A listener to that path
  cannot be assumed to observe every blocked attempt.
- **Basis:** this is the static failure-reporting account already recorded in the
  investigation, not runtime-tested event coverage or a new reporting proposal.

**After:** The human could distinguish local refusal, waiting and the final caller
outcome, and use current conventions when imagining query results. Existing
reporting does not dictate the new query's shape. This step primarily answers a
behavioral question; a design verdict is unnecessary.

**Review point:** These are substantive answers for PostCode to explain. They should
not require the human to reconstruct behavior from an unfamiliar implementation
language merely because the subsequent design judgment is theirs.

<a id="stored-state"></a>
## 12. Understanding stored state and considering the existing rationale

[Original step 12, exchanges 20–21](cockatiel-human-postcode-walkthrough.md#stored-state)

**Before:** If breaker state is already inspectable, what would our query add? Why
does the breaker stay open until an attempt arrives, and is there a good reason?

**PostCode interaction:**

- **Available subjects:** stored breaker state, recovery delay and open-to-half-open
  transition ([steps 7–8](#acceptance)); the reported gate is known only to the
  human from outside reading.
- **Request:** revisit that transition, expanding timing and trigger detail; inspect
  rationale/support associated with it separately from the behavioral account.

**What PostCode shows:**

- **Revisited transition:** reuse open-to-half-open and its execution trigger
  from step 8; do not silently select a different meaning of readiness.
- **Opening time + recovery delay:** opening records the timing basis used by a
  later execution's elapsed-time check. Reading stored state performs no transition.
- **Illustrative timing case:** with a 30-second recovery delay, stored state may
  still say open at 31 seconds. An otherwise eligible arriving execution can
  transition to half-open and supply a trial. These numbers illustrate the account;
  they are not measurements of the reporter's application.
- **No arriving execution:** without that trigger the stored open state can
  persist despite elapsed delay. This is the library's behavior, not a report of
  why any particular application has stopped submitting work.
- **Inferred rationale:** work-driven recovery avoids scheduling a transition
  solely because time passes; avoiding idle timers is a possible advantage.
- **Unknown rationale:** the original investigator did not establish that those
  advantages were the maintainers' reasons. The interpretation and the lack of
  maintainer evidence remain visible independently of the behavioral explanation.

**After:** The human could now articulate what an eligibility query adds beyond
stored state, connect the mechanism to the reported gate they read outside
PostCode, and consider whether the inferred advantages matter to them. The
explanation supports a mechanism, not a proven history of why
it was chosen. A deeper rationale investigation might be needed if that history
would change the decision.

**Review point:** “Why does it happen?”, “why was it chosen?” and “is that a good
reason?” have different information and judgment needs. One rationale selection
must not collapse them.

<a id="trial"></a>
## 13. Understanding half-open and choosing whether a query acts

[Original step 13, exchanges 22–23](cockatiel-human-postcode-walkthrough.md#trial)

**Before:** I do not yet understand half-open. Would a query have to initiate a trial,
or merely indicate willingness to run one?

**PostCode interaction:**

- **Available subjects:** half-open and recovery trial ([step 5](#waiting)),
  open-to-half-open transition ([step 8](#need-check)), supplied operation and
  individual execution ([step 6](#operating-model)).
- **Request:** select half-open within the breaker account, requesting trial
  interaction, concurrent callers and ownership of the supplied work. The displayed
  supplied-work relationship provides a route to ownership detail without fixing
  the order in which that detail is opened.

**What PostCode shows:**

- **Half-open:** permits limited recovery trials, not half of ordinary traffic
  and not proof that the dependency has recovered.
- **Trial eligibility:** the policy can allow trial work under its recovery rules;
  eligibility is distinct from an actual trial executing.
- **Trial in progress → supplied operation:** the trial is ordinary application
  work attempted under the policy. It is not autonomous repair work started by
  reading the breaker's state.
- **Trial outcome:** the result contributes to the configured recovery decision;
  success can lead back to closed, failure to reopening. This description does
  not claim to enumerate every recovery sampling configuration.
- **Concurrent waiting caller:** in the recorded default single-trial case,
  callers can wait for the occupied trial and then encounter the resulting
  decision, including refusal. Reuse step 5's waiting case with this extra detail.
- **Scope:** these are the breaker's existing state/interaction semantics.
  Effects of an unprovided readiness-query design have not been inferred.

**After:** The human may see that reporting eligibility and initiating a trial would
be different promises, and favor the former. That preference remains a choice:
the original question alone did not settle it. The human might also infer that
several callers observing eligibility could all prepare work; whether this race
is acceptable is unresolved.

**Review point:** Clear trial semantics are required account content. If the human
needs confidence about races or effects of a specific query design, explicit
hypothetical analysis has a concrete purpose. Do not quietly define the proposal
as observational just because that is the preferred direction.

<a id="reporter-evidence"></a>
## 14. Checking what the reporter actually said

[Original step 14, exchange 24](cockatiel-human-postcode-walkthrough.md#reporter-evidence)

**Before:** This sounds much like the reporter's workaround. Did they say it was
sufficient but awkward, or did it still fail in some important way? I reopen the
issue outside PostCode and read the reporter's assessment. For this recorded case,
the report says the external timing workaround worked but was clumsy. This is
reported experience, not my reproduction or proof across configurations.

**PostCode interaction:**

- **Available subjects:** stored state and elapsed-time checking from
  [steps 8 and 12](#need-check) remain available as library reference material.
- **Request:** none is needed to learn what the reporter said. The human reads
  the GitHub issue separately, optionally revisiting those library accounts.

**What PostCode shows:**

- **Unchanged library reference:** the retained breaker-state and timing accounts
  remain accessible if the human wants to compare them with the external reading.
- **No new result:** PostCode does not report what the author said, summarize the
  workaround or claim to verify its sufficiency. Those facts have not been supplied
  to it.

**After:** The human might now view the opportunity as better library support for
an already workable approach. That change in thinking comes from their outside
reading, interpreted alongside library understanding. It does not require a new
PostCode answer. The report alone does not determine whether an addition is
worthwhile, and the live issue should not be mistaken for an immutable record of
a previous reading.

**Review point:** A useful journey can include outside reading. This step no longer
tests PostCode's ability to access issue evidence; library evidence access remains
relevant elsewhere. Adding report capture or analysis later would be a separate
capability, not something implicitly required to keep this step moving.

<a id="timer"></a>
## 15. Distinguishing recovery delay from an automatic transition

[Original step 15, exchanges 25–26](cockatiel-human-postcode-walkthrough.md#timer)

**Before:** From rereading the issue outside PostCode, I see a suggestion for
automatic transitions. Did the reporter mean closed or half-open? I thought
Cockatiel already had a timer delay, so I may be misunderstanding what would change.
The report provides the suggestion; it has not been supplied to PostCode.

**PostCode interaction:**

- **Available subjects:** open/half-open/closed and execution-triggered transition
  ([step 8](#need-check)), with timing detail from [step 12](#stored-state).
- **Request:** revisit the library's transition triggers and effects. If a retained
  timing explanation and correction are independently available, inspect them.

**What PostCode shows:**

- **Existing recovery delay:** reuse the opening-time/delay/elapsed-check account
  from step 12. It describes a condition checked by execution, not an existing
  timer that changes state independently.
- **Existing recovery states:** half-open allows a trial; closing depends on
  recovery under the configured rules. Passing time alone is not evidence of health.
- **Earlier library wording and correction, only if available:** an explanation
  using “timer expires” should remain distinguishable from its correction to
  elapsed-time checking on execution. The historical dialogue illustrates this
  need; it does not give this route automatic access to that conversation or
  establish that the same error occurred here.
- **Scope:** the result describes current library behavior. It includes no account
  of the reporter's intention and no comparison with the human's unprovided timer
  proposal.

**After:** The human can distinguish having a delay from scheduling an action at
its expiry, and relate that distinction to the suggestion they read. They might
formulate automatic open-to-half-open as the desired change: eligibility changes,
while work and demonstrated recovery still follow execution. That formulation
is their interpretation/design choice, not PostCode's interpretation of the
reporter's words or a behavior discovered in the implementation. Timer and event
details remain open.

**Review point:** The current-behavior account must resolve the factual ambiguity.
Comparing an explicitly supplied transition design could later check its effects,
but understanding what is implemented should not depend on doing that analysis.

<a id="notifications"></a>
## 16. Considering notification rather than querying

[Original step 16, exchanges 27–28](cockatiel-human-postcode-walkthrough.md#notifications)

**Before:** There may already be transition events. If so, could notification avoid
making the application poll, and favor an automatic transition over a new query?

**PostCode interaction:**

- **Available subjects:** breaker notifications ([step 11](#outcomes)) and states/
  transitions ([steps 8 and 12](#need-check)).
- **Request:** select the breaker's notification contract and its associations
  with state transitions, including the elapsed-time condition. The human can
  follow a displayed notification/transition relationship; inspecting every event
  separately is not required.

**What PostCode shows:**

- **Break notification:** the existing breaker event family includes notification
  of breaking/opening. The selected account relates it to the breaker's state change.
- **Half-open notification:** reports entry into the recovery-trial state.
- **Reset notification:** concerns resetting the breaker to normal closed behavior.
- **State-change notification:** exposes changes of stored breaker state.
  These are descriptions of the existing named events, not four new mechanisms.
- **Transition → notification:** reuse the current transition account. Delay
  expiry without an execution causes no transition and therefore no notification
  of an expiry-driven transition.
- **Notification versus execution:** the application supplies any trial work;
  reporting a state transition is distinct from executing that operation. What
  an application does in response belongs to its own behavior.
- **Coverage:** the event account comes from static inspection, not a runtime
  demonstration of all event ordering. It does not establish how a proposed
  automatic transition would schedule or order notifications.

**After:** The human might infer that an automatic transition could reuse the event
facility to announce eligibility. The dialogue records a preference for events
because queries could lead to polling. Our assessment: that is a conditional
benefit, not a universal advantage—an application could query on incoming requests.
The displayed existing contract does not by itself prove how newly timed events
would behave or what they would cost.

**Review point:** Discuss whether the human has enough to prefer a direction.
Analysis of a supplied timer/event proposal could expose ordering or lifecycle
interactions that change the choice; merely restating “events avoid polling”
would add little. The transcript does not establish that every timer cost was
weighed before the preference was expressed.

<a id="compatibility"></a>
## 17. Separating compatibility from timer semantics

[Original step 17, exchange 29](cockatiel-human-postcode-walkthrough.md#compatibility)

**Before:** I see two concerns: preserving compatibility through optional behavior,
and defining the timer/event semantics. Which existing facilities and behaviors
would constrain that work?

**PostCode interaction:**

- **Available subjects:** Circuit breaker, manual isolation and recovery delay
  ([step 7](#acceptance)), recovery transitions (steps 8/12), reopening after a
  trial outcome ([step 13](#trial)), and notifications ([step 16](#notifications)).
- **Request:** on the breaker, select configuration/defaults and state/lifetime
  information, with isolation and reopening as already-exposed focuses. Further
  detail is requested on the known breaker; no unidentified restoration object
  must be selected first.

**What PostCode shows:**

- **Breaker options/configuration:** the original investigation identified an
  options mechanism as a plausible extension point. Its compatibility with a
  particular new option was not verified; no option shape is invented here.
- **Existing default recovery:** revisit lazy, execution-triggered recovery and
  the notifications associated with actual transitions.
- **Manual isolation and reopening:** retain these as meaningful breaker-state
  concerns from earlier accounts. They identify places where further lifecycle
  detail can be requested; the displayed summary is not a complete lifecycle model.
- **Restoration detail:** the retained material does not provide a complete
  restoration account or a discovered restoration entity to inspect. A request
  for that detail returns an information gap rather than a fabricated model.
- **Independent recovery-transition timer:** none is part of the described
  recovery mechanism. There is consequently no such resource lifetime to display;
  this says nothing about timers used by other Cockatiel facilities.
- **Outcome of the request:** usable existing behavior is shown alongside these
  coverage limits. The options clue is attributed to the original investigation.
  Deeper current-state detail needs further evidence. Timer-specific concerns
  from the original design discussion are not silently included in this display;
  consulting those notes would require separate attributed material access.

**After:** The human could separate a compatibility strategy from the remaining design
work, as they explicitly did in the dialogue. They may identify event ordering,
duplicate transitions, obsolete timers, restoration and lifetime as concerns. In
the actual conversation, the agent contributed that detailed list; the simplified
route does not establish that the human would derive all of it independently.
The direction can be worth pursuing without those questions being answered.

**Review point:** This is a strong candidate for useful additional hypothetical
analysis: connect a supplied timer design to lifecycle cases the human might miss.
Do not smuggle the original agent's timer risk analysis into a supposedly
existing-behavior-only display. A complete design is unnecessary for the endpoint,
but the source and coverage of the unresolved concerns matter.

<a id="endpoint"></a>
## 18. Endorsing the direction and stopping

[Original step 18, exchange 30](cockatiel-human-postcode-walkthrough.md#endpoint)

**Before:** The opt-in automatic-transition direction seems preferable for the
immediate need. Have I reached enough understanding to stop investigating for now?

**PostCode interaction:**

- **Available subjects:** existing library transition/notification accounts
  ([steps 12–16](#stored-state)), and any disclosed gaps from [step 17](#compatibility).
  The earlier scope preference is available as a record only if captured at step 4.
- **Request:** none to decide. Optionally supply a chosen direction and rationale
  for retention, selecting exact supporting accounts already consulted.

**What PostCode shows:**

- **Existing reference material:** the exact selected state, interaction, evidence
  and notification accounts remain accessible with their qualifications. No final
  recap or fresh analysis is required simply because the human decides to stop.
- **Optional chosen-direction record:** if supplied, retain opt-in automatic
  open-to-half-open transition, use of existing state/events and preservation of
  default behavior as the human's direction in this exercise.
- **Optional rationale/support:** associate only rationale the human actually
  supplies and exact accounts they explicitly reference. Do not infer reliance
  merely from which accounts were displayed. Preserve the earlier scope preference
  separately if it was captured.
- **Status and open work:** the record is not maintainer acceptance or implemented
  behavior. Event/timer details and scenario validation remain unresolved to the
  extent identified in the inquiry; the record does not certify a complete risk list.
- **Without capture:** no decision object is created merely by the human silently
  reaching a conclusion. The available accounts remain useful reference material.

**After:** The human explicitly endorsed the direction and asked whether the journey
was complete in the dialogue. In this reconstructed route, they could stop with a
direction suitable for further design, while remaining uncertain about timer and
event details and scenario validation. Reaching the same endorsement would not
prove equivalent understanding, particularly if the simpler route exposed fewer
risks than the conversation.

**Review point:** Stopping is the human's judgment of sufficiency for their next
activity. No final recap or new account is mandatory. The exercise implements
nothing and sends no handoff; later detailed investigation remains possible.

<a id="account-requirements"></a>
## What this changes about the account requirements

The simpler route relies on a provisional set of connected accounts:

| Account or coordinated information | What must be intelligible | Human use it supports |
| --- | --- | --- |
| Application/library context and operating model | Supplied work, responsibility boundary, reusable state, per-call progress and composition | Place the issue; notice relevant scope and control choices |
| Policy, its family, contracts and access | The shared execution-governing role, its kinds and instance model; observable outcomes and component access | Consider where a proposed facility belongs |
| State and interaction | Stored state, conditions, triggers, waiting, concurrency and elapsed time | Understand recovery; reason about an early query or changed trigger |
| Library evidence, rationale and revisions | What is supported, interpreted, corrected or unknown about the library | Assess confidence and revisit the basis of understanding; issue reading remains outside PostCode |
| Participant intentions, if supplied | What the human proposes or chooses, with attribution and exact references | Resume the investigation or explain a direction later |

These are content needs, not prescribed panels or Lens definitions. Interaction
is specified only as selecting subjects/scopes, desired information and supporting
operations. More detail may mean expanding a retained answer or requesting deeper
analysis; those actions must remain distinguishable. Diagrams are optional, while
legibility and visibility of consequential conditions are essential to evaluating
whether the accounts help.

The human can compare accounts and reason about new designs without requiring
PostCode to generate every conclusion. Where PostCode itself asserts a new
relationship or consequence, that remains analysis requiring a qualified basis.
Presentation beside other information does not itself produce a supported
PostCode comparison. Optional capture of a human proposal is likewise distinct
from evaluating it.

Reading the issue and connecting it to library accounts are human activities in
this route. PostCode need not know the reported gate, workaround or proposal to
provide useful reference information. Step 14 can therefore involve no new PostCode
result. If the human later wants a scenario-specific assessment, supplying that
scenario would be an explicit extension, not information inferred from a name lead.

The main route has deliberately removed hypothetical comparison requests. It
therefore cannot simply inherit everything the original conversational agent
contributed. In particular, generation of alternative mechanisms (step 3) and
timer-specific risk analysis (step 17) need an explicit source if retained. Their
absence need not prevent an initial design direction, but can reduce the scope
or confidence of what the human is positioned to decide. These are consequential
limits to discuss, not failures to conceal to keep the journey moving.

The before/after commentary is our design analysis, not application telemetry.
The human's silent conclusion creates no obligation to infer or store a mental
state. If supplied, it remains a participant contribution. Viewing an account
establishes neither comprehension nor acceptance. Exact retained-answer support
preserves what was offered, including correction and selection snapshots,
independently of what the human made of it.

The [existing capability limits](../../docs/capability-reference.md) still apply.
Moving judgment to the human does not deliver missing cross-module accounts or
architectural subject navigation. Hypothetical analysis remains within adopted
scope, but it is not required simply because a human uses implemented-architecture
accounts to design something new.

<a id="navigation-findings"></a>
## Findings from tracing subjects and content

| Route | What this pass makes explicit | Remaining dependency |
| --- | --- | --- |
| Human-read issue → name lookup → Cockatiel context (step 1) | Circuit breaker, CircuitBreakerPolicy and CircuitState are leads the human supplies; the report stays outside PostCode. | Repository selection, semantic name resolution/disambiguation and a route to surrounding context. |
| Policy combination → wrapping cases (step 6) | Follow the relation exposed at step 1, then select an ordering case from the resulting account. | An analytical account exposing navigable relationships, not just text mentioning composition. |
| Half-open → trial interaction (steps 5/8 → 13) | A state is first named within the breaker account, then becomes a selectable subject. | Stable subject meaning and retained-account references across perspectives. |
| Current answer → earlier wording/correction (steps 5 and 15) | Historical errors belong to the recorded dialogue, not automatically to this new route. | Exact earlier material and correction associations if offered; no invented correction history. |
| Human rereads report → relates it to library behavior (steps 8, 12, 14–15) | Outside reading supplies the gate, workaround assessment and suggestion; PostCode supplies only library accounts. | No issue ingestion required. The human makes the cross-source connection; their reading is not proof of a fix. |
| Breaker → lifecycle detail (step 17) | A known subject can be used to request a new perspective without guessing a new entity. | Deeper evidence/investigation where this record has only a concern or incomplete account. |
| Human idea → retained intention (steps 4 and 18) | New participant material needs explicit supply, not navigation to an existing program element. | Capture is optional here and distinct from hypothetical analysis. |

This pass specifies concrete content for the remaining steps while preserving
before/after and review points. Reuse is explicit: steps 10 and 12 deepen or
revisit subjects already exposed rather than introducing another independent
summary. These links do not commit to a menu, layout or fixed hierarchy. They
also do not establish that each named subject or detail is currently implemented
in PostCode. The account and navigation requirements need evaluation together.

<a id="discussion-and-next-exercise"></a>
## Discussion points and whether another journey is needed

The most consequential review points are:

- **Steps 3 and 5:** whether current responsibilities and behavior support the
  human's scope/unification reasoning, and where additional candidate mechanisms
  come from.
- **Steps 7 and 10:** whether existing accounts reveal enough to qualify a common
  contract, or whether analyzing the supplied proposal against a counterexample
  adds material value.
- **Steps 16 and 17:** whether existing state/events support choosing a direction,
  and what important timer interactions a human might miss without further help.

Each after section now exposes both possible progress and limits to that progress.
A selection-only route must not acquire the original agent's suggestions and
critiques invisibly. Equally, it need not reproduce every conversational contribution
to be useful: understanding enough to choose a direction for further investigation
can be a meaningful endpoint.

**Recommendation for discussion:** review these cases before producing another
full journey. If uncertainty concerns account content, refine the accounts directly.
If it concerns what a user would naturally examine and infer from what is visible,
a short hypothetical natural investigation would test something different: begin
with the human's issue-derived name leads, make the operating model readily
available, and follow the information the human actually wants next. It need not reenact all 30 exchanges. That remains
a possible next exercise, not one performed or selected here.

# Readiness investigation: simulated dialogue

Started: 2026-10-14
Status: ongoing, exploratory, non-governing

Companion to [First useful graphical investigation](first-useful-investigation.md).
The human authorized recording the dialogue as it develops. This is a simulation
of investigation with an agent, not a run of PostCode or proof that its existing
capabilities produce these answers. No Cockatiel or GUI implementation is authorized.

## Recording convention and basis

The numbered exchanges below preserve the substantive human and assistant messages
verbatim, including uncertainty, proposals, and later corrections. Tool activity
and progress commentary are omitted; evidence access is described separately.
Keep subsequent clarifications as new exchanges rather than repairing earlier
answers. Research observations at the end are editorial interpretation, not part
of the simulated response or agreed product requirements.

The exercise uses [Cockatiel issue #111](https://github.com/connor4312/cockatiel/issues/111)
and repository revision `f48bea55022ab15ab07eb52a79bfc1e661300fd4`.
The issue was read on 2026-10-14; its linked live text can change. The
[README](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md)
and [circuit-breaker implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts)
are pinned. Earlier source inspection supported the opening explanation; later
responses used the issue and README, including policy and bulkhead sections.
Exchange 8 also inspected the pinned bulkhead and circuit-breaker implementations
to compare actual admission paths, including waiting during recovery sampling.
Exchange 9 inspected the policy interface, factories and composition implementation,
alongside the documented execution, cancellation and composition model.
This is static inspection and documentation-based interpretation. No runtime
reproduction or fresh PostCode analysis has been performed.

## Setup and opening

The human agreed that we could simulate the experience. The assistant proposed
using #111 for a trial: the human considers the change, the agent supplies
investigation responses, questions determine the route, and assumptions beyond
current PostCode are tracked. This selects a trial exercise, not the final GUI
scenario or implementation slice.

The opening response was:

> The [request](https://github.com/connor4312/cockatiel/issues/111) concerns an application that accepts background jobs. Preparing a job costs resources, so the caller wants to check whether its external dependency is available before doing that preparation.
>
> Cockatiel’s circuit breaker temporarily blocks calls after failures. After a waiting period, it allows limited trial work to discover whether the dependency has recovered.
>
> **The difficulty is that these trial calls begin through execution.** If the application checks the stored state and refuses to execute anything while calls are blocked, it can also prevent the work needed to discover recovery.
>
> This explains a tension in the request: **avoiding work likely to fail, while allowing enough work to find out whether conditions have improved.**
>
> The reporter proposes making the breaker change state automatically. We haven’t established whether that would satisfy the caller’s need—or what an early “yes” should promise about a job that executes later.
>
> *Basis: the issue report and inspection of the fixed source version. The mechanism is supported by that reading; the application’s reported failure has not been reproduced.*

The assistant invited the human to ask what they naturally wanted to understand
or challenge, without phrasing it as a PostCode command.

## Process interlude: starting knowledge

**Human:**

> [process question] i'm coming from a position of not actually knowing what Cockatiel is or does!  Should i read its README to get that context, or should i start with my current state of ignorance?  my gut feel is that a real user of postcode wouldn't start with complete ignorance?  or maybe that's actually valid and the journey should explain that?

**Assistant:**

I’d start with your actual knowledge and let the simulation reveal what context you need. Reading the README first would be legitimate, but prescribing it now could hide an orientation need.

A real user could be unfamiliar with Cockatiel: an agent might recommend it as a dependency, or flag a limitation that affects their product. What needs to be credible is **why the person cares**, rather than how much implementation knowledge they bring.

Our opening skipped that. Before discussing circuit breakers, you reasonably need to understand:

- What is Cockatiel, and what role does it play in an application?
- Why would someone use it?
- How does this request relate to its purpose?

That’s already a useful finding about the journey. It doesn’t establish that we need a project-summary capability or a mandatory introduction; it establishes that **this user needs enough context to understand the significance of the issue**. We can explore how PostCode supplies that context, including using documentation with clear attribution.

I suggest we continue from your real position, with “What is Cockatiel, and why would I use it?” as your first investigation question. We should also keep your eventual role open for a moment: evaluating a dependency and deciding how to evolve a library involve different judgments. As you learn what Cockatiel does, we can see which motivation you can meaningfully inhabit.

Your ignorance is useful here. We shouldn’t manufacture familiarity to keep the sketch moving.

<a id="orientation"></a>
## 1. Purpose and responsibility boundary

**Human:**

> OK, back to the scenario.... my first question is "i don't really know much about cockatiel or what it's for.  is this job submission thing a central part of it or just a component that takes care of part of it?"

**Assistant:**

**The job submission system belongs to the reporter’s application. Cockatiel supplies protection around work that application performs.** My opening blurred that boundary.

Cockatiel is a library for helping applications cope with failures, delays, and overloaded services. Its main facilities include:

- **Retry:** try an operation again after a failure.
- **Circuit breaker:** temporarily stop attempts after failures, then allow trial attempts to check for recovery.
- **Timeout:** put a time limit around an operation.
- **Bulkhead:** limit how much work runs concurrently.
- **Fallback:** provide an alternative result when an operation fails.

Applications can combine these protections around their own operations—for example, calling a database. That’s the role described in [Cockatiel’s README](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md).

In this particular issue, the responsibilities are:

| Reporter’s application | Cockatiel |
|---|---|
| Accept a job request and prepare the job | Supply the circuit breaker |
| Launch the background work and acknowledge the request | Permit or reject protected execution based on failures and recovery rules |
| Perform work that depends on an external service | Observe outcomes of that protected work |

The reporter wants to use the breaker’s information **earlier**, when deciding whether to prepare and accept the job. That is where the requested extension arises. [Issue #111](https://github.com/connor4312/cockatiel/issues/111)

So job submission is one application of Cockatiel. The broader design question concerns a central facility: **how should its circuit breaker support decisions made before the protected work begins?**

<a id="readiness-proposal"></a>
## 2. Naming a possible facility

**Human:**

> ok, that seems to me to call for a new facility: readiness check

**Assistant:**

A **readiness check** looks like a plausible facility. We should make its promise precise: **ready to try**, or **expected to succeed**? The circuit breaker can support the former; its observations alone can’t establish the latter.

For this use case, a simple yes/no may also hide an important distinction:

- **Normal work allowed:** the breaker is allowing calls.
- **Recovery attempt allowed:** enough time has passed to try again, but recovery is still uncertain.
- **Work blocked:** the breaker is still withholding attempts.

That would give the application information it can use before preparing a job.

There’s one consequential choice: **does checking readiness merely report an opportunity, or secure that opportunity for this job?** If several callers check at once, they could all receive “a recovery attempt is allowed” and all begin expensive preparation. An informational check wouldn’t necessarily prevent that.

My starting proposal would be to explore the informational check first, and explicitly allow execution to reject the job later if conditions have changed. If the requirement is stronger—“once we accept this job, it must retain permission to attempt execution”—then we’re asking for admission or reservation as well.

Would that weaker promise meet your intention for “readiness check”?

<a id="queueing-correction"></a>
## 3. Advisory information and a queueing misconception

**Human:**

> i agree.  since cockatiel seems to include managing queues of background jobs, securing an opportunity seems too synchronous.

**Assistant:**

An advisory check seems a reasonable direction, but I should clarify the queueing part: **Cockatiel can queue operations waiting for a concurrency slot in its bulkhead facility.** The background-job lifecycle in this issue belongs to the caller’s application. [Queueing documentation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md#bulkheadlimit-queue)

Your underlying point still holds: preparation and execution may be separated in time. Reserving permission across that gap introduces obligations—how long the reservation lasts, what happens if the job never starts, and whether it delays other recovery attempts. Reservations can work asynchronously, but we haven’t established a need for that complexity.

So our working requirement is:

> The application can check whether the circuit breaker currently allows normal work, permits a recovery attempt, or blocks attempts. Checking does not reserve permission or initiate work. The breaker makes the actual admission decision when execution is attempted.

That helps avoid preparation when attempts are currently blocked, while accepting that some prepared jobs may still be rejected later. It also means the check must recognize when a recovery attempt is eligible, even if the stored state still says “open”—otherwise we preserve the original problem.

<a id="alternative-mechanisms"></a>
## 4. Challenging the mechanism assumed by the agent

**Human:**

> is using the existing circuit breaker necessarily the only way to perform a readiness check?

**Assistant:**

No. I narrowed “readiness” to the circuit breaker too quickly. **The breaker is one source of information about readiness**, not necessarily the facility that should define it.

There are several possible approaches:

| Approach | What it can tell the application | Main limitation |
|---|---|---|
| Ask the circuit breaker | Whether its protection rules currently permit an attempt | Based on past outcomes and recovery rules |
| Actively probe the dependency | Whether a particular check succeeds now | Adds traffic; the check may not represent the actual job |
| Consult a health signal | Whether monitoring or the dependency reports availability | May be stale or too general |
| Combine application-specific conditions | Whether dependency health, capacity, credentials, and other prerequisites appear sufficient | Requires deciding what “ready” means for this application |

These are design alternatives, not claims about facilities Cockatiel already provides. None guarantees that later work will succeed.

There are also **two different questions** hiding here:

- “Does the dependency appear able to serve this job?”
- “Will Cockatiel permit this job to attempt execution?”

A successful health probe could answer the first while the breaker still blocks execution. If we introduce a separate readiness mechanism, we need to decide how those answers relate.

So before choosing the mechanism, I’d clarify the scope: are we addressing this issue’s need to anticipate **the breaker’s admission decision**, or exploring a broader facility that helps applications assess **their own readiness conditions**? Both are plausible, but they lead to different responsibilities for Cockatiel.

<a id="generalization"></a>
## 5. Exploring generalization without assuming it

**Human:**

> Anticipating the breaker will address the original request; But that is performing a "readiness check" of some sort, and so raises the question of if we're going to be doing that anyway, should we support other mechanisms too?

**Assistant:**

Yes—that’s a legitimate design question: **does this specific need reveal a broader concept that Cockatiel should support?**

I’d distinguish two commitments:

- **Provide a readiness query for the circuit breaker**, with its particular meanings: normal work allowed, recovery attempt eligible, or blocked.
- **Establish readiness as a common facility**, so other policies or application-supplied checks can participate.

The second could be useful if callers could ask a consistent question without knowing which protection mechanism is involved. But we need to establish whether those mechanisms can give answers that combine meaningfully. “The breaker permits a trial,” “there’s room in the queue,” and “the service passed a health probe” provide different kinds of assurance. Reducing them all to “ready” could hide precisely what the caller needs to understand.

**My recommendation is to investigate the broader concept now, without committing to the general facility yet.** Use the breaker as the concrete case, and test the idea against two contrasting cases:

- A bulkhead’s available capacity: another policy’s admission conditions.
- An application-supplied health probe: an active check of something outside Cockatiel.

That comparison should reveal whether we have a useful shared meaning, whether readiness information should remain specific to each mechanism, and whether a common facility would simplify real application decisions.

This gives our investigation a substantive next question: **what would callers gain from treating these as one facility, and what distinctions must survive that abstraction?**

<a id="scope"></a>
## 6. Checking fit against the product's stated purpose

**Human:**

> Also, which fit into Cockatiel's overall stated purpose and scope?

**Assistant:**

**Readiness relating to Cockatiel’s own protection policies fits most directly. General application readiness is a broader, less established direction.**

Cockatiel describes itself as a “resilience and transient-fault-handling library.” Its documented model applies configurable protection policies around operations supplied by the application. The application also decides which errors count as failures. [README and policy model](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md#ipolicy-the-shape-of-a-policy)

Against that stated purpose, my assessment is:

| Possible facility | Fit with Cockatiel’s scope |
|---|---|
| **Circuit-breaker readiness** | Strong: explains whether an existing protection policy would permit an attempt. |
| **Bulkhead capacity readiness** | Strong: explains whether work could start, queue, or be rejected. It already exposes available execution and queue slots. |
| **Readiness across combined policies** | Plausible: policy composition already matters to Cockatiel. Whether there’s a useful combined answer needs investigation. |
| **Application-supplied health probe** | Plausible extension: the application supplies the check, while Cockatiel could manage resilience around it. Treating its result as admission information would be a new design commitment. |
| **Built-in service monitoring or general job readiness** | A substantial expansion: Cockatiel would take responsibility for understanding dependencies or application prerequisites beyond its existing policies. |

The existing capacity queries are particularly relevant: **asking a policy about admission before execution already has a precedent**, although that doesn’t establish a common readiness abstraction. [Bulkhead documentation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md#bulkheadexecutionslots)

I’d therefore investigate **a common way to inspect policy admission conditions** first, using the breaker and bulkhead as concrete cases. Keep application-supplied probes as a test of extensibility, rather than assuming Cockatiel should own health monitoring.

That is a scope recommendation inferred from the documentation and existing facilities—not an explicit maintainer policy ruling broader readiness in or out.

## Recording checkpoint

**Human:**

> [aside: are you recording our dialog?  probably should record it as we go?]

At this checkpoint the assistant created this repository record. Earlier exchanges
were copied retrospectively from the chat; subsequent substantive exchanges should
be appended as the simulation continues. The checkpoint does not conclude the
simulation or accept the assistant's latest recommendation.

<a id="conservative-scope"></a>
## 7. Choosing a conservative scope

**Human:**

> [okay, getting back to the dialog]
> Probably best idea is to be conservative: design something that addresses the immediate need and meshes well with existing capabilities.  Design it so that it could grow if needed, but no point creating features that nobody has asked for yet.

**Assistant:**

That gives us a clear direction: **a circuit-breaker readiness query that helps callers decide whether to begin preparation.**

The intended promise is advisory: report whether an attempt would currently be permitted, including an eligible recovery attempt. It neither reserves permission nor guarantees that later execution will be admitted or succeed.

“Could grow” should mean keeping that promise precise and avoiding unnecessary dependencies—not introducing a general readiness framework in anticipation of future uses. We can use existing capacity queries as a consistency reference without making them part of this change. Health probes and combined readiness can wait for a concrete need.

Before handing this direction to an implementation agent, I’d investigate one remaining question: **what information does the breaker already expose, and what must be added to answer this query consistently with its execution rules?** That should let us distinguish a small addition from a change to the breaker’s behavior, and identify any cases where the proposed promise needs qualification.

<a id="bulkhead-comparison"></a>
## 8. Comparing bulkhead capacity with breaker admission

**Human:**

> Also I'd like to understand more about the existing Bulkhead capacity readiness to see to what extent it would/wouldn't make sense to unify that with the circuit-breaker readiness

**Assistant:**

**The bulkhead already supplies the ingredients for a readiness check: two capacity counts.** It reports how many operations can start immediately and how many can join its waiting queue. Reading those counts doesn’t reserve anything. [Bulkhead implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/BulkheadPolicy.ts)

For example, suppose it allows 12 operations running and four waiting:

| Current situation | What a new operation would encounter |
|---|---|
| 11 running | It can start immediately. |
| 12 running, three waiting | It can join the queue. |
| 12 running, four waiting | It is rejected for lack of capacity. |

Those are snapshots of the policy’s admission conditions, assuming the operation hasn’t been cancelled. Capacity can change between checking and submitting.

**There is a useful overlap with breaker readiness—but “ready” needs to distinguish starting from waiting.** Inspecting the breaker revealed something missing from my earlier three-way account: when its recovery trials are already occupied, another call can wait for their outcome. It then encounters the breaker’s new decision, which may allow execution or reject it. “Half-open” therefore doesn’t always mean “your operation can start a recovery attempt now.” [Breaker implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts)

A possible common vocabulary would be:

| Admission outlook | Bulkhead | Circuit breaker |
|---|---|---|
| **Can start now** | Execution capacity available | Normal execution allowed, or a recovery trial available |
| **Would wait** | Queue space available; wait for capacity | Recovery trials occupied; wait for a decision |
| **Would reject now** | Execution and queue capacity exhausted | Recovery delay still running, or breaker manually held open |

This is a **proposed interpretation**, not an existing shared facility. The reasons remain important: waiting for capacity and waiting to discover whether execution should be permitted are different commitments. Neither waiting path promises successful completion.

I’d separate two degrees of unification:

- **Consistent meaning:** design the breaker query around distinctions that also make sense for the bulkhead, while retaining policy-specific reasons and details. This looks worthwhile now.
- **A shared interface:** let callers ask either policy the same question. This becomes worthwhile if a caller actually needs to handle both interchangeably; we haven’t established that need yet.

That leaves room for growth without requiring a general framework. It also exposes the next decision for this job-submission scenario: **would “the call will wait” be sufficient reason to prepare a job, or does the caller only want to prepare work that can start now?**

*Basis: documentation and static inspection at our fixed revision; these paths have not been exercised in a runtime test.*

<a id="operating-model"></a>
## 9. Understanding the operating model without opening source links

**Human:**

> [aside: you're providing me with links to documentation/implementation but i'm deliberately not following them].  I don't really have full a picture in my head of the overall theory of operation... might be good to get a clear statement of it.  also the overall nature of the API, is it a collection of functions to queue things, or does the client create instances of jobs with their own manageable state, etc?

**Assistant:**

The explanation should stand on its own without you following those links. I’ve described individual mechanisms before making their shared operating model clear.

**Cockatiel’s API centers on reusable policy instances that govern calls to application-supplied operations.** The application creates these policies, configures their rules, and chooses which work passes through them.

For example, an application might create one circuit breaker for calls to its payment service and one bulkhead allowing at most 12 such calls at a time. These instances can serve many successive or overlapping calls.

The basic interaction is:

1. **Create and configure a policy.** For a breaker, specify which failures matter, when to stop allowing attempts, and when to try recovery. For a bulkhead, specify concurrent-work and queue limits.
2. **Supply an operation to execute.** Conceptually: “Run this payment-service call under these rules.” The application supplies an action Cockatiel can invoke; Cockatiel doesn’t need to understand payments or jobs.
3. **The policy controls execution.** Depending on the policy, it may run the action, delay it, reject it without running it, or run it again after failure.
4. **Receive the eventual outcome.** The call returns an asynchronous result—a promise—which eventually delivers a value or an error. That is how the application follows the outcome; it doesn’t receive a Cockatiel job record with a separate management lifecycle. [Policy API](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/Policy.ts)

**There is state, but it has different owners:**

| State | Where it belongs |
|---|---|
| Recent failures and recovery progress | The shared circuit-breaker instance |
| Running-operation count and waiting operations | The shared bulkhead instance |
| Progress of one execution, such as its retry attempt | That individual execution |
| Business job identity, status, acknowledgment, and stored results | The application |

The application decides which calls share a policy instance. Sharing one breaker makes those calls contribute to the same failure history; sharing one bulkhead makes them compete for the same capacity. Cockatiel doesn’t automatically group calls by the service they contact.

**Queueing is one policy’s behavior within this model.** If a bulkhead is full but has queue space, it retains the supplied action in memory until it can run. The caller’s result remains pending. This is an in-process waiting queue, not a durable background-job service. The core execution API also accepts cancellation signals; stopping work already underway can depend on the operation cooperating.

Policies can be combined around the same operation. For example, a retry policy can call through a breaker on each attempt. Their order matters because each outer policy controls calls into the next one. [Documented composition](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md#wrappolicies)

For our issue, the application owns the sequence **accept request → prepare job → launch background work → report its outcome**. It chooses where Cockatiel protects execution—perhaps around a dependency call within that work. The proposed readiness query would let it consult the **same policy instance earlier**, before paying the preparation cost.

That also clarifies the possible unification: breaker readiness and bulkhead capacity are both questions about a reusable policy’s current admission conditions. Neither is a question about the state of a job object.

*This account is grounded in the documented API and inspected implementation at our fixed revision. The payment example is illustrative; no runtime verification has been performed.*

<a id="policy-object"></a>
## 10. Clarifying the policy object

**Human:**

> ok, so is there a "policy" object?

**Assistant:**

**Yes.** The application creates a policy object—for example, a circuit-breaker object or a bulkhead object—and keeps it to use across calls.

Each supports the same basic operation: **“execute this action under your rules.”** Each also has its own configuration, state, and additional controls. A breaker exposes its circuit state; a bulkhead exposes available capacity. Combining policies produces another object supporting that same execution operation.

So our proposed readiness query would be something you ask **that existing policy object**, using the state it already maintains.

There’s a naming wrinkle in the implementation: the common contract for these executable objects is called `IPolicy`. A separate class literally named `Policy` configures which errors or results count as failures. When I’ve said “policy object,” I’ve meant the executable objects, such as the breaker and bulkhead. [API definitions](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/Policy.ts)

<a id="combined-policy"></a>
## 11. Combining a breaker and a bulkhead

**Human:**

> Cna the application combine a breaker and a bulkhead into a single policy?  or are those two different policies that can be used together?  or only one of them for a given operation request?

**Assistant:**

**Yes—the application can combine a breaker and a bulkhead into one policy object and execute an operation through both.**

Your first two possibilities describe different aspects of the same arrangement:

- The breaker and bulkhead remain **two distinct policy objects**, each with its own configuration and state.
- Cockatiel’s `wrap` facility creates a **combined policy object** that passes execution through them in a specified order.
- The application makes one execution call on that combined object and receives one eventual result. [Composition API](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md#wrappolicies)

For example, with the bulkhead first:

**Execution request → bulkhead → circuit breaker → application’s action**

The bulkhead first allows the request through, queues it, or rejects it for lack of capacity. Once through, the breaker applies its own rules before the action can run.

Reversing the order puts the breaker’s decision first. This matters: with the bulkhead first, a request can occupy a bulkhead execution slot while waiting for the breaker’s recovery decision. With the breaker first, a recovery attempt can be admitted and then wait for bulkhead capacity.

The combined object coordinates those existing policies; their state isn’t merged into a new shared state. That makes **readiness of the combined policy** a further question: knowing that either component alone is ready doesn’t establish that the operation can start through both.

<a id="available-now"></a>
## 12. Proposing an available-now query

**Human:**

> ok, it seems like "is available now" could be a query supported by a policy?

**Assistant:**

**Yes. “Available now” gives us a useful candidate for a shared policy query:**

> Would this policy let an operation begin now, without waiting?

For the two policies we’ve examined:

| Policy | “Available now” would mean |
|---|---|
| Bulkhead | An execution slot is free. Queue space alone doesn’t count. |
| Circuit breaker | Normal execution is allowed, or a recovery attempt can start now. |

The query would inspect the policy without starting work, reserving capacity, or changing its state. Its answer could become outdated before execution.

Two qualifications matter:

- **“Yes” means permission to begin, not a prediction of success.**
- **“No” means unable to begin immediately, not necessarily rejected.** Submitting the work might cause it to wait.

That meaning is consistent enough to explore a common query. A combined breaker-and-bulkhead policy would need both components to permit immediate progress; defining how a combined object obtains that answer is part of the design.

I’d keep the requirement focused on these demonstrated cases rather than assuming every kind of policy can provide a meaningful answer. This is a proposed addition; the existing common policy contract doesn’t currently include it.

<a id="research-observations"></a>
## Research observations

These observations are provisional design interpretation, separate from the dialogue.

- **Orientation was requested in context.** The human needed purpose and the
  application/library boundary before evaluating the change. This establishes an
  information need, not a mandatory summary-first screen or a selected project Lens.
- **The human's contribution is visible.** They proposed a facility, challenged the
  agent's restriction to one mechanism, and asked whether generalization fits the
  product's purpose. The investigation has moved beyond implementing the reporter's
  suggested fix without requiring source fluency.
- **A fluent answer did not eliminate misunderstanding.** The opening blurred the
  responsibility boundary; the human later understood queueing as background-job
  management. The agent clarified both, and acknowledged narrowing readiness too
  quickly. These are naturally occurring conversational clarifications, not formal
  PostCode Corrections or evidence that correction machinery has been exercised.
- **Agreement and rationale must be retained separately.** The human agreed to the
  advisory direction while offering a queueing/synchronicity rationale that needed
  correction. Preserving only the latest agreed conclusion would lose that distinction.
- **Evidence and recommendation differ.** The README supplies stated purpose and
  documented facilities; the agent assesses scope fit and proposes alternatives.
  The latter are not maintainer commitments or existing Cockatiel features.
- **Continuity needs concrete anchors.** A later comparison should be able to refer
  back to the application/library boundary (exchange 1), advisory promise (2–3),
  mechanism alternatives (4), and scope assessment (6), without silently rewriting
  those answers. This suggests retained, selectable answer parts; exact Presentation
  requirements remain to be worked out.
- **Graphical value remains untested.** Tables helped compare responsibilities and
  options, but this has been a conversational trial. Evidence links were supplied;
  the human has not yet requested an evidence excursion, revisited an earlier answer,
  used graphical navigation, or assembled a handoff. Do not count those as tested.
- **The human bounded the change after exploring alternatives.** In exchange 7,
  the human chose the immediate need and fit with existing facilities, with room
  for future growth but no speculative features. This is direction within the
  simulation, not authorization to implement Cockatiel or PostCode changes. The
  earlier broader recommendation remains visible rather than being rewritten.
- **Comparison refined an earlier answer.** Exchange 8 found that a breaker call
  can wait when recovery sampling is occupied. The earlier normal/recovery/blocked
  explanation did not express that distinction. Start/wait/reject is now a candidate
  shared vocabulary, not an implemented interface or exhaustive verified contract.
  The human asked to examine unification after choosing conservative scope; this
  is continued investigation, not approval of a common framework.
- **Source links were deliberately not followed.** In exchange 9 the human
  explicitly reported relying on the explanations. Despite the earlier facility
  list and responsibility table, they still lacked an overall operating model:
  what is created, what is shared across calls, what state belongs to a job, and
  how the API relates to execution. The agent supplied a model organized around
  reusable policy instances, individual executions and application-owned jobs.
  Whether this account resolves the need is not yet known. This strengthens the
  need for intelligible explanations; links alone are not demonstrated evidence
  access for a human who cannot or does not read implementation material. It does
  not by itself select a project-summary capability.
- **The human proposed a shared question after understanding composition.**
  Exchange 12 introduces "is available now" with a candidate meaning of immediate
  progress, excluding queue-only availability. This is a narrower question than
  generic readiness and retains the advisory, non-reserving intent. No API or
  combination algorithm is selected, and support across all policy types is not
  established.
- **Agent performance is not current PostCode capability.** Purpose explanation,
  cross-facility comparison, and scope judgment here were produced by the agent using
  documentation and source. Mapping each to current capabilities, Presentation work,
  or new core support remains outstanding.

The current trial direction is a narrowly scoped advisory circuit-breaker readiness
query. Broader readiness mechanisms are deferred pending demonstrated demand.
The human has requested comparison with bulkhead readiness to assess possible
unification; a shared interface remains undecided. Its exact
meaning under concurrency, recovery sampling, composition, and delay still needs
validation. No API, general readiness facility, or implementation slice is selected.
The human's eventual product role and the journey's meaningful endpoint remain open.

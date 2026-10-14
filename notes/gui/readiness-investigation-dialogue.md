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

<a id="acceptance-query"></a>
## 13. Considering acceptance rather than immediate execution

**Human:**

> or should the query be "acceptable" without "now", i.e. bulkhead has queue space and circuit breaker allows execution?

**Assistant:**

**For the original use case, acceptance seems a better fit if the application is happy for work to wait.** Requiring immediate execution could unnecessarily discourage preparing jobs that could enter the queue.

I’d phrase the question as:

> Would this policy currently accept a submission, either to start it or to let it wait, rather than reject it?

“Currently” still matters: the answer describes present conditions. What we’re removing is the requirement to **start immediately**.

For the bulkhead, that means an execution slot **or** a queue slot is available. For the breaker, it includes normal execution and an eligible recovery attempt.

There’s one consequential choice: **does waiting for an already-running recovery trial also count as acceptable?** For a consistent “start or wait” meaning, I’d say yes—but the caller must understand that this wait can end in rejection if recovery fails. Acceptance here would mean allowing the submission to enter the policy’s handling, not committing to eventually run its action.

That gives us two distinct questions:

- **Can start:** useful when waiting would defeat the purpose.
- **Can accept:** useful when waiting is an acceptable part of processing.

We don’t need to introduce both queries. I’d tentatively choose **can accept** for this scenario, retaining the advisory, non-reserving promise. For combined policies, it still cannot promise that a breaker will allow execution by the time a queued operation reaches it.

<a id="acceptance-explanation"></a>
## 14. Explaining a negative answer

**Human:**

> should "no" be accompanied by whatevr result information the policy provides explaining the queue state or breaker failure?

**Assistant:**

**Yes. The answer should include why the policy would refuse the submission, with the relevant information it already has.** That would make it useful for deciding what to do next, rather than just testing a boolean.

For example:

| Answer | Explanation and useful context |
|---|---|
| Cannot accept: capacity exhausted | No execution or queue slots remain; include the relevant capacity counts. |
| Cannot accept: recovery delay still running | The breaker is withholding attempts; potentially include the remaining delay and last recorded failure. |
| Cannot accept: manually blocked | The breaker has been explicitly held open; waiting for the recovery delay is not the remedy. |

These would be proposed query results, not errors produced by attempting execution.

There’s an important distinction in the breaker case: **the current reason for refusing work is its protection state; the last failure explains how it got there.** That earlier failure does not establish that the dependency is still failing now. Similarly, a remaining delay tells us when a recovery attempt may become eligible, not when the service will be healthy.

I’d make the acceptance answer and its explanation describe the **same observation**, so callers don’t have to read the state separately and risk getting an explanation that no longer matches the answer. For a combined policy, the explanation should identify which component is blocking acceptance.

We can keep this modest: a clear reason plus relevant policy-specific detail. It needn’t expose every internal field or invent a general diagnostic framework.

<a id="original-need-check"></a>
## 15. Checking the proposal against the original need

**Human:**

> ok.  confirming that this would address the original requestor's issue?

**Assistant:**

**Yes—at the design level, it addresses the reported need, provided the query recognizes when the recovery delay has elapsed.**

The requester wants to check before preparing a job, but reading the stored breaker state keeps telling them “blocked” until execution triggers recovery. Their workaround separately tracks elapsed time. [Original report](https://github.com/connor4312/cockatiel/issues/111)

With our proposed query:

1. **While the recovery delay is running:** it answers “cannot accept,” so the application can skip preparation.
2. **Once a recovery attempt is eligible:** it answers “can accept,” even though the stored circuit state may still say “open.”
3. **The application prepares and submits work:** execution performs the actual recovery transition and attempt.

The query itself needn’t change the circuit state or start work. That breaks the circular dependency that was preventing recovery and removes the need for the caller to duplicate the breaker’s timing logic.

It addresses their objective through an explicit query rather than their suggested automatic state transitions. It retains our agreed limitation: conditions can change after checking, so some prepared work may still be rejected or fail.

**The breaker query alone addresses this issue.** Bulkhead support and unification would be additional design choices. We still need implementation and a test of this sequence before calling the fix verified.

<a id="access-to-wrapped-breaker"></a>
## 16. Access to a breaker inside a combined policy

**Human:**

> in a typical application, even if bulkhead and breaker had been wrapped into a single policy, would the caller have direct access to the breaker?

**Assistant:**

**In a straightforward setup, yes—but it depends on what the application gives that caller access to.**

The code assembling the policies can create a breaker, retain its reference, and then wrap it with a bulkhead. Wrapping uses the original objects, so that code can still query the same breaker that participates in execution. The combined object also exposes its wrapped components. [Implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/Policy.ts)

But another part of the application might receive only a general policy object, or a function that executes protected work. That caller wouldn’t necessarily have a direct breaker reference. Requiring it to find the breaker inside the combination would make it depend on how the protection was assembled.

So there are two reasonable application arrangements:

- **The caller knows about the breaker:** it checks the breaker directly, then executes through the combined policy.
- **The caller only knows about the protected operation:** an acceptance query exposed alongside that operation would preserve that separation. The application could provide it, or a combined-policy query could eventually support it.

Your question therefore supplies a concrete reason to consider combined-policy support: **keeping callers independent of the particular protections being used.** Direct access is possible; whether it is the right interface for the caller is a design choice.

<a id="shared-interface-direction"></a>
## 17. Choosing the shared interface, subject to a workable contract

**Human:**

> ok, since "is acceptable" has well-defined meaning for bulkhead, for breaker, and for wrapped in either order, it seems to make sense to put  "is acceptable" on the generic interface; as long as the appropriate return type can be created/queried reasonably

**Assistant:**

**Yes—the shared interface now has a concrete purpose:** callers can ask about acceptance without knowing which protections were assembled. I’d take that as our design direction, subject to a workable result contract.

There’s one qualification to “wrapped in either order” that my earlier answers haven’t made explicit enough. Suppose the bulkhead can queue work, while the breaker is still in its recovery delay. The combined execution could queue the work and reach the breaker after that delay expires. Checking both components now would nevertheless find the breaker blocking.

So I’d define the combined query conservatively:

> Do all the component policies’ current acceptance conditions permit this work?

For the breaker/bulkhead pair, that can be evaluated in either order. But a negative answer would **not prove that submitting through the combination would necessarily fail**; waiting could change the conditions. This is more precise than promising to predict the combined execution’s outcome.

The result could remain straightforward:

- **An acceptance answer** that ordinary callers can query directly.
- **Reasons for a negative answer**, identifying the relevant policy and carrying its useful details—such as remaining capacity or breaker state.
- **For a combination, the component explanations**, so callers can inspect the cause without finding and querying those policy objects themselves.

The answer and details should describe the same observation. We don’t need one universal set of fields that makes queue capacity and failure history look interchangeable.

Before settling the interface, we should check its meaning for the remaining policy types and how it affects application-defined policies. That’s a bounded contract check for the chosen direction, rather than a reason to design additional readiness features.

<a id="policy-family"></a>
## 18. Seeing the full policy family

**Human:**

> oh, there are other policy types?

**Assistant:**

**Yes. I listed them earlier, but didn’t make clear that they are all policy objects with the same execution interface.**

| Policy | What it does around the supplied operation |
|---|---|
| **Circuit breaker** | Withholds attempts after failures, then permits recovery trials. |
| **Bulkhead** | Limits concurrent work, optionally queues excess work, and rejects when full. |
| **Retry** | Repeats an operation after selected failures, optionally waiting between attempts. |
| **Timeout** | Sets a time limit, with cancellation behavior depending on its configuration and the operation’s cooperation. |
| **Fallback** | Supplies an alternative value or action when a selected failure occurs. |

There is also a **no-op policy**, which simply passes execution through. Combining policies produces another object with that common interface. [Documented policy family](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/readme.md#ipolicy-the-shape-of-a-policy)

The breaker and bulkhead are particularly natural subjects for an acceptance query because they can refuse work based on shared conditions across calls. Retry, timeout, and fallback primarily govern what happens during execution or after an outcome.

That doesn’t rule out putting the query on the common interface. It means we should establish what its answer means for these other policies—and their combinations—before treating the breaker/bulkhead model as universal.

<a id="failure-reporting"></a>
## 19. Existing failure and blocking reports

**Human:**

> what mechanism(s) do policies currently use to report failure/blocking?

**Assistant:**

**There are three mechanisms: the execution’s result, event notifications, and queries of policy state.** They serve different purposes.

**1. The execution call delivers a result or an error.**

The caller receives a promise: an eventual value or an error it can catch. Policy refusals use recognizable error types:

| Situation | What the caller receives, unless another enclosing policy handles it |
|---|---|
| Bulkhead has no execution or queue capacity | A bulkhead-rejection error |
| Breaker is withholding attempts during recovery delay | A broken-circuit error |
| Breaker is manually held open | An isolated-circuit error |
| The supplied operation throws an error | That error, subject to the policies’ handling rules |

An outer retry policy can handle an inner error by trying again; a fallback can turn it into an alternative result. So an internal failure needn’t become the caller’s final error.

Also, an application can configure certain **returned values** to count as failures. After retrying is exhausted, such a value can still be returned normally. “Failure according to the policy” therefore isn’t synonymous with “an exception reaches the caller.” [Execution and failure handling](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/common/Executor.ts)

**2. Applications can subscribe to events.**

There are common success/failure notifications and specialized events: bulkhead rejection, breaker state changes, retry attempts and giving up, and timeout notifications. These describe activity at the particular policy; they aren’t one universal report of the whole combined operation. In particular, breaker admission refusals don’t pass through its ordinary operation-failure notification path. [Breaker implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts)

**3. Applications can inspect policy-specific state.**

Examples are the bulkhead’s available slots and the breaker’s current state and last recorded failure. These are existing ingredients for the query we’re discussing, but there is no common acceptance query today.

**Waiting itself is not reported as failure:** a queued bulkhead call or a call waiting for a recovery decision remains pending.

For our proposed query, I’d return an acceptance answer with explanatory information. We can reuse existing diagnostic concepts where they fit, but asking the question should not throw an ordinary admission-refusal error or emit failure events as though execution had been attempted.

*This distinction comes from static inspection; event coverage and behavior have not been runtime-tested here.*

<a id="state-versus-acceptance"></a>
## 20. Why the existing state query is insufficient

**Human:**

> if the application can already inspect the breaker's current state, then what does our proposed query add / what is the original issue?

**Assistant:**

**The stored state doesn’t tell the whole story: whether execution is allowed also depends on elapsed time.**

Suppose failures cause the breaker to open with a 30-second recovery delay. No further executions occur:

| When checked | Existing state query | What an execution would do |
|---|---|---|
| After 10 seconds | “Open” | Reject the attempt. |
| After 31 seconds | Still “Open” | Move into recovery and allow a trial attempt. |

The state stays “open” because **the transition into recovery happens when execution is attempted**, not automatically when the timer expires. Reading the state doesn’t trigger that transition. [Breaker implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts)

That creates the requester’s circular problem:

> “I won’t prepare a job while the state says open.”
> → No job reaches execution.
> → Nothing triggers the recovery transition.
> → The state keeps saying open.

Our proposed query would answer **whether a submission is acceptable under the current conditions**, considering the recovery delay as well as the stored state. At 31 seconds it could answer “yes, a recovery attempt is eligible” without changing the state or running anything.

The requester already built a workaround that tracks timing outside the breaker. The addition would put that decision inside the breaker, where its actual timing rules are known, so applications don’t have to duplicate them. [Original issue](https://github.com/connor4312/cockatiel/issues/111)

<a id="lazy-transition-rationale"></a>
## 21. Questioning the reason for the delayed state transition

**Human:**

> is there a goo reason the breaker stays open until the next atttempt?

**Assistant:**

**There are reasonable advantages to that design, but keeping the publicly reported state “open” isn’t essential to how a circuit breaker works.**

Two things need separating:

- **The delay has expired:** another trial is permitted.
- **The dependency has recovered:** trial results provide evidence for allowing normal traffic again.

Elapsed time establishes only the first. Cockatiel ties entry into its half-open recovery phase to an actual execution attempt. That keeps recovery activity driven by incoming work and avoids scheduling a background timer just to change each idle breaker’s state. These are advantages inferred from its implementation; I haven’t found an explicit statement of the author’s rationale in the material checked. [Cockatiel implementation](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts)

**But half-open needn’t mean a trial has already started.** It can mean a trial is now permitted. In fact, the Polly v7 documentation that Cockatiel’s README points to says its breaker can transition to half-open when the state is queried after the delay. That also avoids an automatic timer, while making state inspection reflect eligibility. [Polly’s documented behavior](https://github.com/App-vNext/Polly/wiki/Circuit-Breaker#how-the-polly-circuitbreaker-works)

So we have a genuine choice:

- **Preserve Cockatiel’s existing state semantics and add the acceptance query.** Inspection stays separate from state transitions, and the query can cover bulkhead capacity too.
- **Change the existing state query to reflect recovery eligibility.** This could address the original issue more narrowly, but changes what reading state means and potentially when transition notifications occur.

Our proposed query is defensible, but it isn’t the only solution forced by the current behavior. Your question exposes a tradeoff we should compare before settling the change.

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
- **The proposed question remains under refinement.** In exchange 13 the human
  asks whether acceptance, including queue capacity, better captures the need than
  immediate availability. The agent tentatively favors acceptance if waiting is
  acceptable, and surfaces that waiting for breaker recovery can end in rejection.
  A common meaning must distinguish entering policy handling from a commitment to
  run the action. Neither two separate queries nor a final acceptance contract has
  been selected.
- **Explanations become part of the proposed query.** Exchange 14 asks for
  existing capacity or failure information alongside a negative answer. The agent
  proposes a reason plus relevant policy-specific detail from the same observation,
  distinguishing present admission conditions from historical failure evidence.
  The example result categories and fields are proposals, not verified query output
  or a settled result schema.
- **The proposal was traced back to the original need.** Exchange 15 re-read
  issue #111 and mapped the proposed query to blocking preparation during the
  recovery delay, allowing preparation once a trial is eligible, and leaving the
  actual transition to execution. This is a design-level adequacy argument, not a
  reproduced fix or requester validation. Bulkhead support is not necessary to
  address the reported issue.
- **Composition exposes an application-boundary question.** Exchange 16 checks
  that wrapping retains original instances and exposes its input components, but
  distinguishes API access from what an application chooses to expose to a caller.
  A caller given only a protected operation supplies a plausible motivation for
  combined-policy queries, without proving a current application needs them.
  During inspection, the pinned README names the component property `policies`,
  while the pinned interface and implementation name it `wrapped`. The response
  relies on the implementation for component access; the naming discrepancy is
  recorded here without modifying the external project.
- **A shared interface is now the human-directed design direction.** In exchange
  17 the human favors a generic acceptance query, conditional on a reasonable return
  type. The agent supports that direction but qualifies an earlier assumption about
  composition: all component checks passing now is a conservative snapshot test,
  not a prediction of sequential execution after waiting. The proposed combined
  contract and result structure still need agreement and validation, including
  remaining and application-defined policy types. This is a simulated Cockatiel
  design choice, not implementation authorization or a PostCode architecture decision.
- **An earlier inventory did not establish the conceptual family.** In exchange
  18 the human was surprised by other policy types despite the earlier facility
  list. The agent had not made their shared object/interface relationship salient
  enough. A future Presentation may need to preserve that relationship in context,
  rather than assuming one explanatory list established lasting orientation.
  This is an observation about this exchange, not evidence of a required UI form.
- **Existing reporting separates outcomes, activity and state.** Exchange 19
  inspected the shared executor and retry, fallback and timeout implementations
  alongside previously read breaker and bulkhead code. It distinguishes policy
  rejection from operation failure, events from final outcomes, and pending work
  from rejection. The shared `FailureReason` represents an error or a returned
  value classified as failure; it is not already an acceptance-result contract.
  Inspection also found reasons not to infer uniform event coverage from the
  common interface: bulkhead execution directly invokes the supplied function
  despite exposing an executor's success/failure subscriptions, and shared executor
  error notifications can report `handled: false` despite narrower documentation.
  These are static observations, not runtime-confirmed defects or authorization to
  fix the external project. The response avoids promising universal event delivery.
- **The original mechanism needed a concrete contrast.** Exchange 20 revisits
  why state inspection is insufficient, using an illustrative 30-second delay to
  show the same stored state leading to different admission outcomes over time.
  This is an explanation grounded in inspected code, not a runtime trace. The
  human needed this distinction despite earlier descriptions; retain the question
  and response as evidence about the explanation's progression.
- **A rationale question reopened the solution comparison.** Exchange 21 checked
  Cockatiel's README and relevant history subjects, then read its linked Polly v7
  circuit-breaker documentation. That external documentation describes transition
  on state inspection after the delay. It is comparative evidence, not evidence
  of Cockatiel behavior or current Polly v8 semantics. The agent distinguishes
  inferred benefits of demand-driven transitions from documented author intent,
  and separates trial eligibility from actual recovery. Changing existing state
  inspection is now an explicit narrower alternative to the additional query;
  its compatibility and event implications are unassessed. No direction has been
  reversed by the human yet.
- **Agent performance is not current PostCode capability.** Purpose explanation,
  cross-facility comparison, and scope judgment here were produced by the agent using
  documentation and source. Mapping each to current capabilities, Presentation work,
  or new core support remains outstanding.

The current trial direction is an advisory acceptance query on the shared policy
interface, motivated by breaker, bulkhead and combined-policy use. The human favors
this direction subject to a reasonable result type. Immediate start is no longer
the leading question; acceptance may include waiting. The agent has proposed a
conservative all-components-currently-permit meaning for composition, explicitly
weaker than predicting actual execution after queueing. That qualification has not
yet been answered by the human. Exact result shape, behavior across policy types,
compatibility, concurrency and recovery details remain to be settled and validated.
Exchange 21 adds a narrower alternative: update existing breaker-state inspection
to reflect trial eligibility, following a documented comparison with Polly v7.
The human has not yet responded to that alternative; the shared-interface direction
has not been revoked. External health mechanisms remain outside the chosen direction. No implementation
is authorized or GUI implementation slice selected. The human's eventual product
role and the journey's meaningful endpoint remain open.

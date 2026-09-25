# Backlog

This backlog records worthwhile work and concerns that arise outside an active plan or authorized task. An entry is a candidate for consideration, not a commitment or authorization to implement. Its presence means that it remains open; no separate status is needed.

Keep entries concise but sufficiently contextual to remain intelligible. Remove an entry when it is incorporated into a plan, resolved, or declined. Carry any context worth preserving into the resulting plan or decision; Git retains the backlog's history. A consequential choice not to pursue something may warrant a decision record, but routine pruning does not.

The human evaluates backlog entries during planning as appropriate. Coding agents may add entries when directed by the development workflow, but must not prioritize, promote, implement, or remove them without human direction.

Use this form for new entries:

```markdown
## Short descriptive title

Added: YYYY-MM-DD
Origin:
Area:

Describe the need, why it matters, and relevant constraints without designing the solution prematurely.
```

## Candidates

## Review the investigation UI and UX as a whole

Added: 2026-09-23
Origin: human exploratory use of the completed interactive session on another repository
Area: presentations and interaction

The session works, but repeated use makes the current views difficult to read:
output is too wordy, important information is hard to find, and presentation
choices that were tolerable for one-shot commands compound across an
investigation. Evaluate the full journey across inventory, organization,
dependencies, inspection, qualifications, source detail, and shell interaction
before making isolated formatting changes. Identify what deserves immediate
attention, what should be progressively disclosed, and what belongs in a later
visual interface. Preserve precise navigation, evidence, qualifications, and
consequential omission disclosure while improving readability.

## Investigate analysis parallelism and asynchronous I/O

Added: 2026-09-24
Origin: human observation that PostCode appears to use one CPU during analysis
Area: analysis execution and responsiveness

Measure CPU use and stage-level wall time on representative projects to identify
work that could run independently or overlap without changing results. The
interactive shell currently runs one command at a time in one analysis worker;
TypeScript program construction and much of discovery use synchronous compiler
APIs, while repository capture and input probes perform synchronous filesystem
and Git reads. Evaluate whether parallel analysis or asynchronous I/O would
materially improve latency, throughput, or responsiveness, accounting for worker
startup and communication, memory use, deterministic output, captured-input
consistency, session reference bindings, and cancellation. Do not assume that
switching file reads to async will accelerate CPU-bound compiler work. Use the
[completed latency investigation](../records/validation/2026-09-21-analysis-latency.md)
as a baseline and account for reuse in the interactive session.

## Evaluate independent TypeScript versions for building and analysis

Added: 2026-09-14
Origin: human-directed process review of implementation conventions
Area: toolchain and TypeScript language integration

The current dependency layout uses one installed TypeScript version both to build and type-check PostCode and to analyze subject projects at runtime. Evaluate whether to separate those roles so the build-time compiler can evolve for development convenience while the runtime analyzer remains deliberately pinned and changes only with semantic fixtures and analysis-identity review. Preserve a clear account of which analyzer version establishes each result. If the roles are separated, revise the implementation convention so build-only TypeScript upgrades no longer require runtime-analyzer semantic verification.

## Retry failed or incomplete interpretation without restarting the session

Added: 2026-09-24
Origin: module investigation planning discussion
Area: investigation execution and recovery

The module investigation draft retains investigation-failure, partial-result, and
execution-limit outcomes; repeating a command displays those outcomes rather than
invoking the interpreter again. Communication/service failures leave no reusable
result, so later requests already proceed through ordinary selection in the same
shell. This candidate concerns explicit retry of retained outcomes, whose current
recovery requires restarting the shell and losing accumulated investigation context.
Consider supporting that retry if formative use establishes its value. Define
which outcomes qualify, how retained evidence and partial results are used, and
which attempt is displayed afterward. Preserve earlier outcomes and qualification;
a retry does not itself establish that earlier claims are superseded. This concerns
interpretation requests, not a change to existing mechanical-analysis retry rules.

## Explicitly rerun a successful interpretation

Added: 2026-09-24
Origin: module investigation planning discussion
Area: investigation execution and retained results

The module investigation draft currently reuses a retained successful result when
its command is repeated. Consider whether an explicit action to regenerate a
successful interpretation would be useful; no concrete need has yet been
established. Distinguish regeneration from inspecting a retained result, following
up on a new target, and displaying an explicit correction. Any later design must
account for inference cost and preserve earlier results without treating a newer
generation as automatically more correct. This is separate from retrying failed
or incomplete interpretation.

## Investigation usage and budgeting support

Added: 2026-09-24
Origin: module investigation planning discussion of execution containment and usage allowances
Area: investigation usage and budgeting

Consider user-set allowances for hosted inference, separate from the per-evaluation
mechanism that contains runaway investigations. The module investigation draft
includes basic per-investigation and session usage reporting, with explicit coverage
limits, but no budgeting interface. Future support could use those measurements
to prevent a new investigation from starting once an allowance is exhausted,
at coarse granularity without interrupting work in progress.
Define allowance scope, configuration, measured units, and enforcement limitations;
a token allowance is not a guaranteed monetary ceiling, and admission checks can
permit an in-flight investigation to exceed the remaining allowance.

Local inference may remove the need for provider-spending controls, but runaway
containment remains useful for responsiveness and resource use. Keep that mechanism
independent of budgeting support so it applies to either hosted or local execution.
Retain available provider usage metadata without assuming every integration reports
the same measures or supports precise cost accounting.

## Reconsider investigons after context corrections

Added: 2026-09-25
Origin: module investigation planning discussion of citation exposure
Area: investigation revision and qualification

Consider an explicit reconsider operation for accounts marked as needing
reconsideration after cited context changes. The module investigation draft records
conservative citation indexes and discloses direct and transitive warnings, but
provides no clearing operation. Evaluate the need using correction frequency,
citation breadth, and the practical burden of uncleared warnings.

A reassessment could retain a new account or record that the earlier account remains
unchanged against specified updated context. Preserve the original artifact and
record the reassessment basis. Define how clearing a cause affects downstream
warnings without erasing independent causes or implying downstream reassessment.
Track no-change outcomes as a possible sign of overly broad citation exposure,
not proof that the original citations were irrelevant. Interpreter-reported
relevance may eventually refine selection while full delivery history remains
available as provenance.

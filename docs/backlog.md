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

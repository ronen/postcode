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

## Reduce repeated investigation latency

Added: 2026-09-21
Origin: completed repository-organization and module-dependencies validation
Area: analysis execution and interaction

Fresh CLI invocations repeat project opening, repository capture, TypeScript
analysis, projection construction, presentation, and observation work. Recorded
validation measured roughly 39–42 seconds for ordinary PostCode dependency
commands and about 27–28 seconds for ordinary ts-node commands, with one retained
975-second outlier; an earlier five-command PostCode organization journey took
about 420 seconds. This latency makes ordinary navigation costly and will impede
interactive or visual use. Characterize where time is spent and evaluate bounded
ways to reuse valid analysis within and across investigation steps while
preserving session reference bindings, captured evidence, changed-input invalidation, qualification,
observation, and the distinction between cached results and current evidence. Do
not assume that durable caching is the first or only remedy.

The [authorized latency task](../records/tasks/2026-09-21-analysis-latency.md)
removed repeated source-text hashing within discovery. Its
[paired measurements](../records/validation/2026-09-21-analysis-latency.md)
reduced ordinary PostCode dependency/organization invocations to about 4.4–4.8
seconds, with unchanged outputs and current-input capture. Claude's independent
review found no actionable defects. Copilot's benchmark retry finding is corrected;
its separate test-count allegation was rejected with human approval. Final review-gate
acceptance remains before task closure. The small fixture remained near 0.9 seconds.
Further reduction remains a
candidate: project opening, complete record materialization/validation, startup
and repository capture still cost time, and navigation continues to analyze afresh.
The historical outlier is not explained by this result. Any later reuse lifecycle
still needs its own measured justification and validity contract.

## Evaluate independent TypeScript versions for building and analysis

Added: 2026-09-14
Origin: human-directed process review of implementation conventions
Area: toolchain and TypeScript language integration

The current dependency layout uses one installed TypeScript version both to build and type-check PostCode and to analyze subject projects at runtime. Evaluate whether to separate those roles so the build-time compiler can evolve for development convenience while the runtime analyzer remains deliberately pinned and changes only with semantic fixtures and analysis-identity review. Preserve a clear account of which analyzer version establishes each result. If the roles are separated, revise the implementation convention so build-only TypeScript upgrades no longer require runtime-analyzer semantic verification.

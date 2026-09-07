# Decisions

Decision records preserve consequential accepted choices and the reasoning available when those choices were made. They complement architecture documentation rather than replacing it. Do not create a decision record until the decision has been accepted; keep unresolved choices in plans or discussion.

A decision is accepted only through explicit human agreement. Agents may develop and evaluate alternatives in plans or discussion, but must not accept a decision themselves. An accepted decision must conform to governing foundation material; a conflicting choice requires an explicitly authorized foundation revision before it can be accepted. Within its stated scope, an accepted decision is prescriptive and binding on subsequent work until it is superseded.

Use descriptive, unnumbered filenames, such as `keep-analysis-core-independent-of-desktop-ui.md`. Store decisions globally by subject rather than nesting them under the plan or task where they arose.

## When to Record a Decision

Create a record when a choice:

- has meaningful and durable consequences;
- constrains future implementation or operation;
- establishes or changes an important boundary or contract;
- selects among credible alternatives likely to be reconsidered later.

Routine implementation choices do not require decision records.

## Lifecycle

Each record begins with metadata in this form:

```text
Status: accepted
Decided: YYYY-MM-DD
Arising from:
Scope:
Supersedes:
Superseded by:
```

Allowed statuses are:

- `accepted` — the currently adopted decision;
- `superseded` — replaced by a linked later decision.

`Arising from` may link to one or more plans, tasks, experiments, incidents, or discussions. `Scope` says where the decision applies, not where it was discussed.

Once accepted, preserve the record as historical evidence. A later reversal gets a new decision record. Link the records through `Supersedes` and `Superseded by`, and update the earlier record's status without rewriting its original context or rationale.

This directory's `README.md` is also the entry point for decisions. Once decision records exist, maintain a concise list of currently accepted decisions here, linking to their records without duplicating their contents.

## Suggested Contents

```markdown
# Decision title

Status: accepted
Decided: YYYY-MM-DD
Arising from:
Scope:
Supersedes:
Superseded by:

## Context

## Decision

## Rationale

## Alternatives considered

## Consequences

## Follow-up
```

State uncertainty and tradeoffs directly. A decision record should make the choice understandable without relying on the conversation that produced it.

# Decisions

Decision records preserve consequential accepted choices and the reasoning available when those choices were made. They complement architecture documentation rather than replacing it. Do not create a decision record until the decision has been accepted; keep unresolved choices in drafts or discussion.

A decision is accepted only through explicit human agreement. Agents may develop and evaluate alternatives in drafts or discussion, but must not accept a decision themselves. An accepted decision must conform to governing foundation material; a conflicting choice requires an explicitly authorized foundation revision before it can be accepted. Within its stated scope, an accepted decision is prescriptive and binding on subsequent work until it is superseded.

Use descriptive, unnumbered filenames, such as `keep-analysis-core-independent-of-desktop-ui.md` or `initial-product-slice-architecture.md`. Store decisions globally by subject rather than nesting them under the plan or task where they arose.

A record may contain one decision or a coherent set of related decisions that share context and scope and were evaluated and accepted together. Do not split such a set merely to make each file appear atomic, and do not bundle unrelated choices merely because they arose during the same plan. Give each decision in a bundled record its own unique, descriptive heading. Once accepted, preserve those headings so they remain stable link targets for later supersession.

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
Superseded in part:
Superseded by:
```

Allowed statuses are:

- `accepted` — the currently adopted decision;
- `partially superseded` — one or more identified decisions in the record have been superseded while the remainder stay accepted;
- `superseded` — replaced by a linked later decision.

`Arising from` may link to one or more plans, tasks, experiments, incidents, or discussions. `Scope` says where the decision applies, not where it was discussed.

Once accepted, preserve the record as historical evidence. A later reversal gets a new decision record. Link the records through `Supersedes` and `Superseded by`, and update the earlier record's status without rewriting its original context or rationale.

Supersession may be many-to-many. A later record may supersede one or more complete records, specific headed decisions from one or more bundled records, or any combination of them. Under its `Supersedes` field, list every earlier record or specific heading it replaces.

When a later record supersedes only part of a bundled record, set the earlier record's status to `partially superseded`. Under `Superseded in part`, identify each affected decision by its heading and link to the relevant replacement record or heading. Every affected earlier record must point forward through `Superseded by` or `Superseded in part`, and the replacement record must point back through `Supersedes`. Status alone is not sufficient: the mappings must make clear which decisions remain accepted and what replaced each superseded decision.

This directory's `README.md` is also the entry point for decisions. Once decision records exist, maintain a concise list of currently accepted decisions here, linking to their records without duplicating their contents.

## Suggested Contents

The template below is suitable for a single decision. For a bundled record, replace `## Decision` with a `## Decisions` section containing a unique, descriptive `###` heading for each decision.

```markdown
# Decision title

Status: accepted
Decided: YYYY-MM-DD
Arising from:
Scope:
Supersedes:
Superseded in part:
Superseded by:

## Context

## Decision

## Rationale

## Alternatives considered

## Consequences

## Follow-up
```

For example, a bundled section begins:

```markdown
## Decisions

### Initial interface

### Repository analysis boundary
```

State uncertainty and tradeoffs directly. A decision record should make the choice understandable without relying on the conversation that produced it.

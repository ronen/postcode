# Plans

Plans describe proposed future work and the learning or outcome it is intended to produce. A plan is not authorization to implement; substantive implementation begins only through the [task protocol](../../foundation/task-protocol.md).

Use descriptive, unnumbered filenames, such as `initial-product-slice.md` or `agent-context-exchange.md`. Do not encode priority or sequence in filenames. Express dependencies and ordering in the plan itself or in a current roadmap when one becomes necessary.

## Lifecycle

Each plan begins with metadata in this form:

```text
Status: proposed
Created: YYYY-MM-DD
Updated: YYYY-MM-DD
Superseded by:
```

Allowed statuses are:

- `proposed` — under discussion and not yet adopted;
- `active` — currently guiding authorized work;
- `completed` — its intended work or learning has concluded;
- `superseded` — replaced by a linked plan;
- `abandoned` — deliberately discontinued.

Plans may be revised while proposed or active. Preserve important changes of direction through Git history and, when they affect an active implementation task, through task follow-ups. When replacing a plan, link the successor rather than silently repurposing the old document.

The human directs changes to a plan's lifecycle status. Agents may draft and revise plans during human-led planning, but must not activate, complete, supersede, or abandon a plan without human direction.

## Suggested Contents

Use only the sections that help the work:

```markdown
# Plan title

Status: proposed
Created: YYYY-MM-DD
Updated: YYYY-MM-DD
Superseded by:

## Context

## Use narrative

## Intended outcome

## Success criteria

## Scope

## Non-goals

## Proposed approach

## Milestones

## Risks and uncertainties

## Open questions

## Resulting decisions
```

Link accepted decisions under **Resulting decisions**. Keep unresolved choices under **Open questions** rather than allowing a proposed approach to masquerade as an accepted decision.

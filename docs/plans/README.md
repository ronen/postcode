# Plans

Plans in this directory describe future work that the human has explicitly approved, and the learning or outcome it is intended to produce. Develop proposed plans under [`drafts/`](../../drafts/) or in an ignored underscore workspace. A plan is not authorization to implement; substantive implementation begins only through the [task protocol](../../foundation/task-protocol.md).

Use descriptive, unnumbered filenames, such as `initial-product-slice.md` or `agent-context-exchange.md`. Do not encode priority or sequence in filenames. Express dependencies and ordering in the plan itself or in a current roadmap when one becomes necessary.

## Lifecycle

Each plan begins with metadata in this form:

```text
Status: approved
Created: YYYY-MM-DD
Updated: YYYY-MM-DD
Superseded by:
```

Allowed statuses are:

- `approved` — adopted as a plan, but not currently guiding authorized implementation;
- `active` — currently guiding authorized work;
- `completed` — its intended work or learning has concluded;
- `superseded` — replaced by a linked plan;
- `abandoned` — deliberately discontinued.

Plans may be revised while approved or active, but proposed revisions remain non-governing until the human explicitly approves them. Preserve important changes of direction through Git history and, when they affect an active implementation task, through task follow-ups. When replacing a plan, link the successor rather than silently repurposing the old document.

The human directs approval and changes to a plan's lifecycle status. Agents may draft plans and proposed revisions during human-led planning, but must not place a plan in this directory or approve, activate, complete, supersede, or abandon one without human direction.

## Suggested Contents

Use only the sections that help the work:

```markdown
# Plan title

Status: approved
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

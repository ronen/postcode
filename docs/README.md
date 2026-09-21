# Project Documentation

This is the human-readable map of PostCode's canonical project knowledge. It also helps coding agents locate the context governing their work, but the documentation should remain understandable without access to an agent conversation.

Adopted, governing product and development material lives under [`foundation/`](../foundation/). This directory contains the governing core architectural concepts and constraints, evolving plans, accepted decisions, and documentation of the application built from that foundation.

Coding agents begin with [`AGENTS.md`](../AGENTS.md), which directs them to the applicable task protocol, development workflow, conventions, and project documentation.

For CLI use, begin with the [command and concepts reference](cli-reference.md).

## Documentation Types

### Drafts

[`drafts/`](../drafts/) contains provisional planning artifacts whose history is worth preserving in Git. Draft artifacts are durable but non-governing: committing them records their development without approving their contents. Ephemeral checkout-local work belongs in ignored root underscore directories instead.

### Durable notes

[`notes/`](../notes/) contains committed, human-curated exploratory material that is useful across sessions but is neither governing nor necessarily permanent. Notes may be revised, consolidated, incorporated elsewhere, or deleted; canonical documents must not depend on them, and immutable historical records must not link to them.

### Plans

[`plans/`](plans/) contains future-work plans explicitly approved by the human. Plans may evolve while approved or active and do not authorize implementation by themselves. Proposed plans and revisions remain under [`drafts/`](../drafts/) or in ignored underscore workspaces until approved.

### Core concepts

[`core-concepts.md`](core-concepts.md) states PostCode's governing cross-cutting architectural terminology and the relationships necessary to define it. It records what the terms mean now; accepted decision records preserve why the concepts were adopted or changed. Semantic changes require explicit human agreement and a corresponding accepted decision record.

### Architectural constraints

[`architectural-constraints.md`](architectural-constraints.md) states the current binding, cross-cutting rules that implementations must preserve. It provides a concise operational source for those rules; accepted decision records preserve why they were adopted or changed. Substantive changes require explicit human agreement and a corresponding accepted decision record.

### Architecture

Architecture documentation is a selective, descriptive map of how the current system works, not an exhaustive inventory of the implementation or a source of prescriptive requirements. It describes major boundaries, responsibilities, data flows, and operational constraints. Before implementation exists, proposed architecture belongs in a plan rather than being presented as current fact.

Create architecture documentation under `architecture/` when there is implemented architecture to describe. Begin with `architecture/README.md` as the single overview, and add further documents only when a stable area needs its own conceptual explanation. Link to accepted decisions that govern the described architecture; if implementation and a governing decision diverge, expose the inconsistency rather than making the description silently normative.

### Implementation conventions

[`implementation-conventions.md`](implementation-conventions.md) records repeatable application-level engineering practices within the governing architecture. These conventions may evolve with authorized implementation work, but cannot introduce consequential product behavior, conceptual semantics, architectural boundaries, guarantees, or lifecycle policy in place of an accepted decision or governing architectural constraint.

### Decisions

[`decisions/`](decisions/) preserves consequential choices explicitly accepted by the human, together with their context, rationale, and consequences. Accepted decisions are prescriptive and binding within their stated scope unless superseded; they authorize and explain substantive changes to the governing core concepts and architectural constraints, while architecture documentation describes the resulting implemented shape.

### Task records

`records/tasks/` contains the durable record of each authorized implementation task, including its request, material follow-ups, outcome, and verification. The governing [task protocol](../foundation/task-protocol.md) creates this directory with the first task; it is not created speculatively.

### Review records

[`records/reviews/`](../records/reviews/) preserves durable handoffs, returned findings, and dispositions for independent implementation reviews required by approved plans or authorized tasks. New review series are grouped by their governing plan, or by task when no plan applies; filenames identify each record's role.

### Backlog

[`backlog.md`](backlog.md) records worthwhile work and concerns that are not part of an active plan or authorized task. Backlog entries are candidates rather than commitments. Substantial entries should be promoted into plans before implementation.

# Project Documentation

This is the human-readable map of PostCode's canonical project knowledge. It also helps coding agents locate the context governing their work, but the documentation should remain understandable without access to an agent conversation.

Adopted, governing product and development material lives under [`foundation/`](../foundation/). This directory contains evolving plans, accepted decisions, and documentation of the application built from that foundation.

Coding agents begin with [`AGENTS.md`](../AGENTS.md), which directs them to the applicable task protocol, development workflow, conventions, and project documentation.

## Documentation Types

### Drafts

[`drafts/`](../drafts/) contains provisional planning artifacts whose history is worth preserving in Git. Draft artifacts are durable but non-governing: committing them records their development without approving their contents. Ephemeral checkout-local work belongs in ignored root underscore directories instead.

### Plans

[`plans/`](plans/) contains future-work plans explicitly approved by the human. Plans may evolve while approved or active and do not authorize implementation by themselves. Proposed plans and revisions remain under [`drafts/`](../drafts/) or in ignored underscore workspaces until approved.

### Architecture

Architecture documentation is a selective, descriptive map of how the current system works, not an exhaustive inventory of the implementation or a source of prescriptive requirements. It describes major boundaries, responsibilities, data flows, and operational constraints. Before implementation exists, proposed architecture belongs in a plan rather than being presented as current fact.

Create architecture documentation under `architecture/` when there is implemented architecture to describe. Begin with `architecture/README.md` as the single overview, and add further documents only when a stable area needs its own conceptual explanation. Link to accepted decisions that govern the described architecture; if implementation and a governing decision diverge, expose the inconsistency rather than making the description silently normative.

### Decisions

[`decisions/`](decisions/) preserves consequential choices explicitly accepted by the human, together with their context, rationale, and consequences. Accepted decisions are prescriptive and binding within their stated scope unless superseded; architecture documentation describes the resulting implemented shape.

### Task records

`records/tasks/` contains the durable record of each authorized implementation task, including its request, material follow-ups, outcome, and verification. The governing [task protocol](../foundation/task-protocol.md) creates this directory with the first task; it is not created speculatively.

### Backlog

[`backlog.md`](backlog.md) records worthwhile work and concerns that are not part of an active plan or authorized task. Backlog entries are candidates rather than commitments. Substantial entries should be promoted into plans before implementation.

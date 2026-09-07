# PostCode

PostCode is a software-development environment for humans understanding, directing, and supervising software built with coding agents, with the goal of enabling them to work at a conceptual level rather than through programming-language source code.

PostCode presents task-appropriate views of program structure, behavior, history, rationale, and other evidence. Projections preserve their provenance, epistemological status, and limitations so that derived facts, recorded assertions, observations, and interpretation are not presented as equally authoritative.

As an initial simplification, PostCode's projections and views are read-only. Humans continue to direct program changes by instructing coding agents in prose.

See [`foundation/product-design.md`](foundation/product-design.md) for the full conceptual design.

## Development

PostCode is expected to be implemented primarily by coding agents under human direction and review. The repository uses explicit plans, recorded architectural decisions, and durable task records so that development does not depend on transient agent conversations.

Once PostCode is minimally functional, the human directing the project will use it to understand and supervise further development of PostCode itself. Experience from that use will guide its continued development.

For the current project state, see [`STATUS.md`](STATUS.md). For plans, architecture, decisions, and the backlog, see the [documentation guide](docs/README.md).

Coding agents should begin with [`AGENTS.md`](AGENTS.md). The detailed development process is described in [`dev/workflow.md`](dev/workflow.md).

## Observability

PostCode is intended to support the [PostCode Research Project](https://github.com/ronen/postcode-research) by recording and exporting observations, including relevant interaction events and contemporaneous user reports, for later analysis. This capability has not yet been implemented.

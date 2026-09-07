# PostCode

> *When coding agents do the coding, humans should be able to understand, direct, and supervise software development without ever needing to see programming-language source code.*

PostCode is an application for software development that aims to make that possible. It presents task-appropriate views of program structure, behavior, history, and rationale.

Those views preserve the provenance, epistemological status, and limitations of their content. They clearly distinguish between derived facts, recorded assertions, observations, and interpretations.

As an initial simplification, PostCode's projections and views are read-only. Humans continue to direct program changes by instructing coding agents in prose.

See [`foundation/product-design.md`](foundation/product-design.md) for the full conceptual design.

## Development

PostCode is expected to be implemented primarily by coding agents under human direction and review. The repository uses explicit plans, recorded architectural decisions, and durable task records so that development does not depend on transient agent conversations.

Once PostCode is minimally functional, the human directing the project will use it to understand and supervise further development of PostCode itself. Experience from that use will guide its continued development.

For the current project state, see [`STATUS.md`](STATUS.md). For plans, architecture, decisions, and the backlog, see the [documentation guide](docs/README.md).

Coding agents should begin with [`AGENTS.md`](AGENTS.md). The detailed development process is described in [`dev/workflow.md`](dev/workflow.md).

## Observability

PostCode is intended to support the [PostCode Research Project](https://github.com/ronen/postcode-research) by recording and exporting observations, including relevant interaction events and contemporaneous user reports, for later analysis. This capability has not yet been implemented.

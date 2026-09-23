# Project Status

Last reviewed: 2026-09-23

PostCode is a development CLI for read-only exploration of one configured
TypeScript project. It supports module inventories, repository organization,
module and group inspection, and direct dependency navigation. Views expose
exports, recorded documentation and analysis qualifications; supporting source
locations and bounded excerpts are available on request. Output is Unicode text
or experimental JSON. These views describe program structure, not runtime
behavior or architectural intent.

The interactive shell keeps a project open across commands, with stable entity
references, reusable analysis and preserved earlier results. One-shot commands
provide the same views in separate sessions. Commands record local observations,
and active analysis can be interrupted. See the [README](README.md#development-cli)
for a runnable walkthrough and the [CLI reference](docs/cli-reference.md) for
supported commands and limits.

Sessions are transient and assume unchanged inputs. Detected relevant changes
end the session and require reopening; detection is best-effort, not a continuous
file watch. Retained memory can grow as new requests accumulate until the session
closes. There is no persistent investigation, graphical interface or interpreting
lens yet.

No implementation task is currently active. The [documentation guide](docs/README.md)
links to plans, decisions and historical records; the [backlog](docs/backlog.md)
contains candidates for future work, not an approved next implementation.

# Process Conventions

This document contains human-maintained conventions governing how development work is conducted in this repository. It supplements the adopted [baseline conventions](../foundation/baseline-conventions.md) and may be changed only through separate human-directed process maintenance.

## Provisional Working Material

- Put repository-specific scratch files and directories under a descriptively named root-level directory beginning with `_`, such as `_analysis/`, `_investigation/`, or `_rendered/`. The root `.gitignore` reserves this namespace for uncommitted working material.
- `_work/TASK.md` is a governed task-drafting and handoff artifact, not ordinary scratch material. Handle it only as prescribed by the [task protocol](../foundation/task-protocol.md).
- Except for the task-intake role of `_work/TASK.md` defined by the governing task protocol, content under a root underscore directory is provisional and non-governing, regardless of any status or approval language it contains. To become durable or governing, content must be moved or incorporated into its appropriate non-underscore repository location and satisfy any applicable approval and commit requirements for that document type.
- Treat underscore directories as disposable. Do not use them as the sole location of durable project knowledge, implementation, committed generated artifacts, configuration, or documentation. Remove scratch material that you created when it is no longer useful; do not remove pre-existing scratch material without human direction or clear ownership.
- Do not create project-local `.codex`, `.claude`, or similar tool-specific directories for scratch work.
- Automated tests and tools may use the operating system's temporary location for ephemeral runtime artifacts that they create and clean up. This exception does not apply to agent-created investigation, planning, or other repository working material.
- A Git-ignored directory is still inside the observed repository. Do not use underscore directories for information that is required to remain outside that repository.
- Committed or otherwise durable project material must not depend on content under an underscore directory. Treat such a dependency as an unexpected finding and report it rather than using the underscore content as authoritative.

Use [`drafts/`](../drafts/) when provisional planning material is worth preserving in Git for review, comparison, or continuity across sessions. Draft artifacts are durable but non-governing: neither committing them nor placing approval language within them gives them the role of a plan, decision, or other canonical project document. Agents may use them as planning context, but not as binding requirements.

Keep canonical project material independent of draft artifacts. Do not cite a draft artifact as context required to understand canonical project material. When draft artifacts are promoted, carry the necessary context into the resulting canonical documents and link those documents to one another; Git history may preserve their shared drafting provenance. The human directs promotion, and content moved or incorporated into a canonical location must independently satisfy the approval requirements for that document type. Treat a canonical document that depends on a draft artifact as an unexpected finding.

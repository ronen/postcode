# Proposed revisions to docs/decisions/execution-ownership-and-cancellation.md

Replace the metadata block before the first level-two heading with the following. Preserve all historical body text.

# Execution ownership and cancellation semantics

Status: partially superseded
Decided: 2026-09-27
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: ownership and cancellation contract for command opening, Git acquisition, validation and disposal

Superseded in part:

- [Decision](#decision), only private compiler-worker/parent composition and its host-specific consequences; retain acquisition, validity, ownership and cleanup distinctions, is replaced by [CLI shell retirement](cli-shell-retirement.md#retire-client).

- [Decision](#decision), terminal Session-abort settlement/reporting, extended to the specified direct shutdown assessment, is replaced by [CLI shell retirement](cli-shell-retirement.md#terminal-abort).

# Proposed revisions to docs/decisions/initial-observation-recording-decisions.md

Replace the title and lifecycle metadata block before the first body anchor or section with the following. Preserve every body section, original date, rationale and historical mapping.

# Initial observation recording decisions

Status: partially superseded
Decided: 2026-09-12
Arising from: [Initial module inventory plan](../plans/initial-module-inventory-plan.md)
Scope: automatic observation production in the initial PostCode slice
Superseded in part:

- [Submit self-contained, invocation-scoped observation batches](#submit-self-contained-invocation-scoped-observation-batches) is replaced by [Command-scoped observations with session correlation](transient-analysis-sessions.md#command-scoped-observations-with-session-correlation).
- [Record normal view production automatically](#record-normal-view-production-automatically) is replaced by [Command-scoped observations with session correlation](transient-analysis-sessions.md#command-scoped-observations-with-session-correlation).

- [Defer contemporaneous note capture](#defer-contemporaneous-note-capture) is replaced by [Initial feedback interaction](human-facing-architectural-representations.md#initial-feedback-interaction). The replacement includes the [feedback observation contract](human-facing-architectural-representations.md#feedback-observations).
- [Keep observations separate from `ProgramRecordStore`](#keep-observations-separate-from-programrecordstore) is replaced in full by [observation lifetime](research-question-driven-observation.md#observation-lifetime).

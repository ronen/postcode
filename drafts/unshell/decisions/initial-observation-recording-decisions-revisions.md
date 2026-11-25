# Proposed revisions to docs/decisions/initial-observation-recording-decisions.md

Replace the metadata block before the first level-two heading with the following. Preserve all historical body text.

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
- [Send to a sink and forget](#send-to-a-sink-and-forget), only the mandatory current ObservationSink production boundary and CLI discard/submission implementation; preserve general separation from archive/retention policy, is replaced by [CLI shell retirement](cli-shell-retirement.md#research-gap).

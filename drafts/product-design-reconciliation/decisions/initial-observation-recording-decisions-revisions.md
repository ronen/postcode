# Proposed revisions to docs/decisions/initial-observation-recording-decisions.md

## Lifecycle metadata only

Preserve `Status: partially superseded`, the original decision date, context, scope, body and all existing supersession mappings. Add to `Superseded in part`:

- [Defer contemporaneous note capture](#defer-contemporaneous-note-capture) is replaced by [Initial feedback interaction](human-facing-architectural-representations.md#initial-feedback-interaction) and [Feedback observations](human-facing-architectural-representations.md#feedback-observations), only the deferral of inadequacy reporting and the requirement for cross-invocation association before such reporting can be introduced. Shell reports use the displayed result's available context; one-shot reports are context-free. The prohibition on guessing an association remains binding; other subjective-note interactions are not selected.

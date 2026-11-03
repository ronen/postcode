# Proposed revisions to docs/decisions/transient-analysis-sessions.md

## Lifecycle metadata only

Set `Status: partially superseded` and add to `Superseded in part`:

- [Command-scoped observations with session correlation](#command-scoped-observations-with-session-correlation) is replaced by [Human-facing architectural representations](human-facing-architectural-representations.md#representation-limits-and-feedback), only its source-excursion recording clause; actual output and qualification remain binding.
- [Command-scoped observations with session correlation](#command-scoped-observations-with-session-correlation) is replaced by [Feedback observations](human-facing-architectural-representations.md#feedback-observations), only its investigation Session-correlation requirement for one-shot feedback and command-completion delivery timing for feedback. Self-contained command batches, existing investigation correlation, actual-output recording, sink acceptance and separation from operational state remain binding.

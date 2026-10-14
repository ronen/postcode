# Proposed revisions to docs/architecture/README.md

## Replace the paragraph beginning “There is no public request for redisplaying a specified retained Projection”

There is no public request for redisplaying a specified retained Projection, so current paging and format commands may reselect. This is the known F6 human-facing continuity/disclosure limitation: separate commands and changed Projection IDs in JSON do not adequately disclose refresh to a human paging an answer. Presentation-only actions are intended to preserve the selected answer; an interaction that refreshes must make that behavior apparent and disclose consequential changes in the answer, selection or qualifications. Exact retained-Projection presentation with new presentation inputs is the implementation direction. Clearly disclosed reselection could be an interim treatment but would not provide equivalent continuity. Remediation is scoped by the [exact retained-answer plan](../plans/exact-retained-answer-presentation.md); conceptual adoption does not implement it.

Apply this reference update when promoting the planning package. Retain the current limitation until implementation verifies the new behavior.

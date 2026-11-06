# Proposed revisions to docs/architecture/README.md

Insert this paragraph immediately after the “Observations and runtime boundaries” heading, preserving the existing description of current behavior.

The [research recording policy](../decisions/research-question-driven-observation.md#research-capture) permits question-specific recording and ordinary non-research use without records. The CLI described here still automatically constructs and submits command batches; it has no public no-recording mode or selective capture interface. `command-execution.ts` also derives the shell's displayed-result feedback snapshot from those records, and `feedback.ts` embeds it without live-store lookup. Discarding sink output does not skip record construction. The [optional cleanup candidate](../backlog.md#separate-optional-research-recording-from-feedback-context) identifies this coupling; no runtime change accompanies the policy revision. Full operational attribution, qualifications, Investigator exposure/provenance and retained-answer selection remain independent of research delivery. Study instructions or configuration can designate the current local folder as the research destination; automatic local capture alone does not establish research use. No research-mode workflow or new application fields accompany that responsibility rule.

Replace the paragraph beginning “Returned execution envelopes carry immutable work reports separately from Views.” (decision-link update only).

Returned execution envelopes carry immutable work reports separately from Views.
Non-View JSON retains the full resolution explanation and a compact attribution
summary. Reporting completeness and included detail are separate fields; Session
results and observations carry full reports independently of sink delivery. This
follows the [interface attribution decision](../decisions/research-question-driven-observation.md#compact-attribution).
The Session exposes its latest execution report
for failure handling, not a request-history catalog. Interpretation attempts carry
their parent context; retained operation reuse and exact/associated selection record
current consumption with original attribution. Evidence reporting preserves qualified
outcomes, page limits and support separately from delivery: captured-but-withheld,
acquired-but-not-dispatched and actually dispatched information remain distinguishable.
Pure retrieval/continuation records consumption without claiming new acquisition.
Exposure and citation eligibility still depend solely on actual dispatch.

# Proposed revisions to docs/architectural-constraints.md

## Addition under “Views and analysis boundary”

Insert immediately after the bullet beginning “Preserve the selected answer and its qualifications during presentation-only actions”.

- For the current eagerly retained Projection families, a supported exact-presentation request names a retained answer and arranges its fixed qualified content without subject reselection, Evaluation or acquisition of additional evidence. Preserve its selected interpretation, correction/association state and relevant evaluation outcomes as well as its captured program basis. An incompatible target or need for information outside that answer produces an explicit refusal, never silent fresh selection. Report current presentation separately from the retained answer's analysis outcome; references remain subject to the supported Session lifetime. [[Exact retained presentation](decisions/exact-retained-answer-presentation.md#request-an-exact-retained-answer)] [[Outcome reporting](decisions/exact-retained-answer-presentation.md#report-presentation-without-replaying-evaluation)]

This addition does not replace the existing general permission for qualified projection-scoped lazy materialization or presentation pushdown. It specifies the new supported operation over the current eager retained content.

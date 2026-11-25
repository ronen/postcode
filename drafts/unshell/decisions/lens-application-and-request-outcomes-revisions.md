# Proposed revisions to docs/decisions/lens-application-and-request-outcomes.md

Replace the metadata block before the first level-two heading with the following. Preserve all historical body text.

# Lens application, request outcomes and qualified answer identity

Status: partially superseded
Decided: 2026-10-11
Arising from: [Explicit Lenses and qualified request resolution](../plans/lens-request-model.md)
Scope: current Lens definitions, qualified subject resolution, outcome lifetime, Projection identity, reporting and result/Presentation compatibility
Supersedes: [Separate qualified Projection construction from presentation shaping](qualified-projection-construction.md), the complete record, jointly with [Qualified construction under the request model](qualified-construction-under-the-request-model.md) and [Experimental structured outputs](experimental-structured-outputs.md). The [whole-unit mapping](qualified-construction-under-the-request-model.md#supersession-mapping) identifies the replacement of each headed decision and carries forward its unaffected commitments.
Superseded in part:

- [Return unsettled applications as resolution results](#return-unsettled-applications-as-resolution-results), only its Investigation retention row and subsequent preservation paragraph insofar as they retain an investigation-attempt failure or retryable unavailability as answer content, is replaced by [Separate attempt reporting and answer meaning](investigation-attempts-and-answer-outcomes.md#separate-attempt-reporting-and-answer-meaning). Resolution results, mechanical qualified-answer retention and other retained-selection obligations remain accepted.
- [Report actual requests and outcomes](#report-actual-requests-and-outcomes) is replaced in full by [request reporting](research-question-driven-observation.md#request-reporting).
- [Give equivalent qualified answers repeatable identity](#give-equivalent-qualified-answers-repeatable-identity) is replaced in full by [qualified answers over contributions](qualified-answers-over-contributions.md#answer-identity-and-request-reuse).
- [Return unsettled applications as resolution results](#return-unsettled-applications-as-resolution-results), only current CLI/worker-envelope delivery and one-shot-specific guidance; preserve returned qualified resolution information and reference lifetime, is replaced by [CLI shell retirement](cli-shell-retirement.md#retire-client).

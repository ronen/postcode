# Separate investigation-attempt diagnostics from retained answers

Status: accepted
Decided: 2026-11-18
Arising from: human-directed resolution of an M3 migration conflict in [Structured architectural accounts](../plans/structured-architectural-accounts.md), following the M2 separation of attempt reporting from answer identity
Scope: failed, unavailable and incomplete investigation attempts; answer selection, identity and exact presentation for new and migrated investigation families
Supersedes:

- [Qualified construction and retained support](qualified-answers-over-contributions.md#qualified-construction-and-retained-support), only its requirement to retain investigation-attempt failure/unavailability kind, code and diagnostic in answer selections. Replaced by [Separate attempt reporting and answer meaning](#separate-attempt-reporting-and-answer-meaning); all other construction, support and qualification obligations remain accepted.
- [Separate answer, View and report identity](qualified-construction-under-the-request-model.md#separate-answer-view-and-report-identity), only the Investigation/associated Projection row's requirement to include attempt-only failure/unavailability outcomes and their kind, code and diagnostic in the semantic answer payload. Replaced by [Separate attempt reporting and answer meaning](#separate-attempt-reporting-and-answer-meaning); the remaining identity, arrangement, reporting and finalization rules remain accepted.
- [Return unsettled applications as resolution results](lens-application-and-request-outcomes.md#return-unsettled-applications-as-resolution-results), only its Investigation retention row and subsequent preservation paragraph insofar as they retain an investigation-attempt failure or retryable unavailability as answer content. Replaced by [Separate attempt reporting and answer meaning](#separate-attempt-reporting-and-answer-meaning); resolution results, mechanical qualified-answer retention and the other retained-selection obligations remain accepted.

## Context

The contribution-based M2 application separates an investigation attempt's outcome from the answer selected for its question. A failed attempt can supply no designation while an earlier answer remains standing. With no standing designation, different failures can leave the same no-current-answer selection. The attempt's report is retained separately and delivered with request reporting.

The migration requirements also carried forward older investigation-family contracts that retain unavailable kind, code and diagnostic inside answer selections. The earlier answer-identity table and family retention table still prescribe that behavior. Applying those requirements to `summarize` and its related investigations while retaining M2 behavior for newer investigations would give the families different answer semantics. Treating M2 alone as precedent would leave the binding contradiction unresolved.

This decision adopts the separation consistently. It changes where attempt-only outcomes belong, not whether failures must remain retained and visible or whether selected architectural information remains qualified.

<a id="separate-attempt-reporting-and-answer-meaning"></a>
## Decision

Retain an investigation attempt's outcome, including its applicable failure or unavailability kind, code and diagnostic, with the attempt under the supported Session lifetime. Preserve producer-reported inability and the attempt's result-contract fulfillment separately from the selected answer's fulfillment. Deliver the applicable attempt outcome in request reporting with its attribution, including when compatible completed work is reused. Do not require a new investigram, answer designation or failure Projection to preserve that report.

A Projection captures the information selected by the Lens, with its supporting basis, qualifications and standing/cause snapshots. Do not put an attempt-only diagnostic in that payload or its identity merely because the attempt supplied no designated answer. An accepted contribution's inability report with no selected answer content likewise remains production/attempt reporting; acceptance alone does not make the report answer content. An otherwise identical selected answer has the same logical identity despite different attempt-only failures, subject to the existing Session and method identity rules.

When no current designation exists, an investigation answer selection discloses that condition. It does not establish an empty architectural result, invent an architectural explanation for the absence, or acquire the latest attempt's failure as its meaning. An earlier standing answer remains available after a failed fresh attempt; presenting it does not imply that the fresh attempt succeeded. Withdrawal of the last designation retains its own qualified grounds and historical access, independently of attempt failure.

Exact presentation of a retained answer does not replay a particular attempt's failure diagnostic or fetch a later attempt to explain the answer. The explanation of a failed attempt remains in its retained attempt record and request reporting. The application preserves the association between the request, attempt and delivered answer without putting invocation identity into the answer. This decision does not prescribe a new UI, attempt-history navigation service, persistence mechanism or report serialization.

This separation does **not** remove answer-relevant outcomes or qualification:

- Selected partial content retains its actual limitations, evidence, provenance and applicable owner qualification/report. If an inability explains the scope of selected content, it accompanies that content with the correct attribution; it is not stripped out as incidental diagnostics.
- Mechanical answers retain their qualified empty, partial, unavailable and unrequested distinctions, including applicable kind, code and diagnostic under their existing contracts. For example, an unavailable dependency population can qualify a dependency answer; a later timeout while attempting to summarize that answer is separate attempt reporting.
- Structurally valid contributions and declarations retain their effects even if the requested result is unmet. No contribution, invalid unrepairable submission, accepted partial information and fulfilled results remain distinct.
- Request resolution, defects versus expected failures, cancellation, cleanup, provider-detail disclosure and retry/reuse eligibility keep their existing contracts. Retaining a failed attempt or an empty answer does not itself suppress an eligible retry. Returning an existing answer neither clears reconsideration nor establishes a new endorsement.

Apply these rules consistently to existing investigation families during migration, including `summarize` and related investigations, and to newer state-behavior and retained-option investigations. The governing distinction is the meaning of the outcome—attempt history versus qualification of selected information—not the operation's age or whether its producer is agentic.

## Rationale and alternatives

Suppose one attempt times out and a second fails authorization, with neither producing an answer. Their distinct retained attempt records explain both failures. Their otherwise identical no-current-answer selections need not have different answer identities. Conversely, if a prior qualified answer exists, neither failure changes that answer or its exact historical presentation.

Keeping every failure in answer identity would make equivalent architectural selections differ according to the attempt being reported. Preserving that behavior only for legacy operations would make migration preserve an inconsistent boundary. Dropping failure details altogether would hide unsuccessful work and lose the distinction between absence of an answer and established emptiness. Retaining and reporting the attempt separately avoids all three consequences.

The tradeoff is explicit: an answer reference alone no longer identifies why a particular investigation attempt failed. Consumers needing that explanation use the retained attempt and request reporting. Displaying the same answer with different attempt reports remains compatible with the existing separation of answer and View/report identity.

<a id="migration-and-verification"></a>
## Migration and verification

The M2 behavior motivates this decision; adoption is not a claim that all migrated operations already conform. Complete the affected migration and update descriptive documentation and tests within the existing [structured-accounts plan](../plans/structured-architectural-accounts.md). Record the direction in the active implementation task before implementing it. No additional capability or independent implementation task is required by the semantic change itself.

Verification must distinguish:

1. Two failures with different kind/code/diagnostic, each retained and accurately reported, while the otherwise identical empty answer identity remains equal.
2. A failed fresh attempt with an earlier standing answer: attempt failure remains visible, the answer and its fulfillment remain unchanged, and exact presentation does not replay the failure.
3. An accepted undesignated inability report versus selected qualified partial content: the former is attempt reporting, while applicable limitations of the latter remain answer support.
4. No current designated answer, established empty findings, withdrawn designations and mechanical unavailability; none collapses into another.
5. Direct/worker delivery, exact presentation, reuse and eligible retry, with unchanged qualification, attribution and reference-lifetime guarantees.

This decision does not accept an implementation checkpoint, claim conformance, authorize inference, or add reassessment/clearance. No foundation or development-process change is needed.

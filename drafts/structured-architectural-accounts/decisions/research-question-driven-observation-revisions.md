# Proposed revisions to docs/decisions/research-question-driven-observation.md

These are complete replacement or addition units. Unlisted content is unchanged.

**Replace the opening title/metadata block only. Preserve the original decision body and rationale unchanged.**

# Research-question-driven observation

Status: partially superseded
Decided: 2026-11-06
Arising from: Human-directed reconciliation of the research-observation revision adopted in foundation/product-design.md at `60f11e2`, November 2026; human clarification on 2026-11-06 that study instructions or configuration establish research purpose and destination without per-session declarations, new application fields or a mandatory research-mode workflow
Scope: Research capture and delivery, their separation from architectural provenance, and unchanged current recording support
Supersedes:

- [Command-scoped observations with session correlation](transient-analysis-sessions.md#command-scoped-observations-with-session-correlation), the whole headed decision, replaced by [research capture](#research-capture).
- [Stable inputs as the session precondition](transient-analysis-sessions.md#stable-inputs-as-the-session-precondition), the whole headed decision, replaced by [validity and recording](#validity-and-recording).
- [Attribute system-initiated investigation and constrain autonomous work](application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work), the whole headed decision, replaced by [investigation attribution](#investigation-attribution).
- [Report actual requests and outcomes](lens-application-and-request-outcomes.md#report-actual-requests-and-outcomes), the whole headed decision, replaced by [request reporting](#request-reporting).
- [Report presentation without replaying Evaluation](exact-retained-answer-presentation.md#report-presentation-without-replaying-evaluation), the whole headed decision, replaced by [retained presentation](#retained-presentation).
- [Results over captured bases](specialized-architectural-investigation.md#results-over-captured-bases), the whole headed decision, replaced by [results over captured bases](#results-over-captured-bases).
- [Retained understanding and local investigation context](specialized-architectural-investigation.md#retained-understanding-and-context), the whole headed decision, replaced by [retained understanding and context](#retained-understanding-and-context).
- [Record actual exposure and inadequacy separately](human-facing-architectural-representations.md#representation-observations), the whole headed decision, replaced by [actual exposure](#actual-exposure).
- [Provide additional detail under the human output boundary](human-facing-architectural-representations.md#additional-detail), the whole headed decision, replaced by [additional detail](#additional-detail).
- [Keep organization conceptual with intelligible detail](human-facing-architectural-representations.md#organization-detail), the whole headed decision, replaced by [organization detail](#organization-detail).
- [Preserve qualified construction and arrangement isolation](qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation), the whole headed decision, replaced by [qualified construction](#qualified-construction).
- [Keep observations separate from `ProgramRecordStore`](initial-observation-recording-decisions.md#keep-observations-separate-from-programrecordstore), the whole headed decision, replaced by [observation lifetime](#observation-lifetime).
- [Retain unaffected domain and storage commitments](coordinated-views-and-qualified-results.md#retain-unaffected-domain-and-storage-commitments), the whole headed decision, replaced by [domain and storage](#domain-and-storage).
- [Attribute usage to execution independently of interpretation retention](investigator-execution-and-evidence-access.md#attribute-usage-to-execution-independently-of-interpretation-retention), the whole headed decision, replaced by [execution usage](#execution-usage).
- [Compact interface attribution and complete operational results](compact-attribution-and-complete-results.md), the complete record, replaced by [compact attribution](#compact-attribution).

Superseded in part:

- [Preserve qualified construction and exposure coverage](#qualified-construction) is replaced in full by [qualified answers over contributions](qualified-answers-over-contributions.md#qualified-construction-and-retained-support).
- [Preserve domain and storage boundaries with selected research capture](#domain-and-storage) is replaced in full by [common analysis contributions](common-analysis-contributions.md#retained-domain-and-storage).

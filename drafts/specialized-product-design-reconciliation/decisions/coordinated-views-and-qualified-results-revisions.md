# Proposed revisions to docs/decisions/coordinated-views-and-qualified-results.md

Replace only the lifecycle metadata block after the title with the following. Preserve every original heading, context, rationale, decision text and historical link. Existing backward and forward mappings remain intact.

Status: partially superseded
Decided: 2026-10-08
Arising from: human strategy discussion following the product-design revision in commit `c0ed132a7af4c479e21deab69d0d6dfe9330ca7f`, as clarified by commit `337451bd37f91004a14d56149c52b4491bef783a` and the human’s instruction to conform application architecture to the adopted foundation
Scope: Lens and Projection meaning, Presentation and View composition, state qualification, interface analysis boundaries, and the relationship between product direction and the current implementation subset
Supersedes:

- [Transient analysis sessions — Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries), the whole headed decision.
- [Initial projection architecture — Separate lens requirements, evaluation, and projection construction](initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction), the whole headed decision.
- [Keep views grounded in core projections](keep-views-grounded-in-core-projections.md), the complete record.

Superseded in part:

- [Generalize Lens results and View composition](#generalize-lens-results-and-view-composition) is replaced by [Results over captured bases](specialized-architectural-investigation.md#results-over-captured-bases).
- [Define request inputs and captured states](#define-request-inputs-and-captured-states) is replaced by [Inputs and captured bases](specialized-architectural-investigation.md#inputs-and-captured-bases).

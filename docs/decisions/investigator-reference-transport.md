# Private investigator reference transport

Status: accepted
Decided: 2026-10-01
Arising from: [Module investigation task](../../records/tasks/2026-09-29-module-investigation.md), human follow-up recorded in `a53ea33`
Scope: Hosted investigator communication; no change to canonical record identity or public Entity bindings

## Context

The fixed milestone-3 reassessment produced invalid submissions with two-character
omissions from long canonical references. Exact offline audits established the
spelling errors without establishing a general model-quality explanation. The
human approved private short references and a bounded reassessment.

## Decision

Use short exact model-facing handles mapped to unchanged canonical IDs. Keep
reference availability distinct from evidence exposure: issuing a handle does not
make its underlying content supplied. Translate only designated reference fields,
including nested results and evidence requests; never search and replace source
or prose. Captures must establish the representation received and how references
resolved. Tell the investigator which representation the character guard measures.

## Rationale and consequences

A private transport representation reduces the copying burden while preserving
exact validation and canonical provenance. It does not broaden public selectable
identities, grant evidence access, authorize approximate matching, or introduce
inference repair turns. Translation and audit coverage must evolve with the typed
communication contract. The implementation measures canonical domain inputs and
decoded replies; compact wire size is not a token or spending guarantee.

The alternatives were continued copying of long canonical IDs, approximate
reference repair, and extending public Entity bindings to all evidence kinds.
The approved scope chooses the private boundary; it does not adopt either repair
or a broader public identity contract. Whether the representation improves the
fixed model's live results remains an assessment question.

# Compact interface attribution and complete operational results

Status: accepted
Decided: 2026-10-12
Arising from: Human direction on F2 of the [request-attribution review](../../records/reviews/lens-request-model/2026-10-12-request-attribution-round-1-findings.md), under the [Lens request-model plan](../plans/lens-request-model.md)
Scope: Attribution detail in current non-View JSON, Session results and observations

## Decision

Non-View JSON carries a compact attribution summary alongside the actual request,
resolution reason, candidates and consequential prerequisite qualifications. Counts
supplement that explanation; they do not replace it. Reporting completeness and
included detail are separate: a complete report can be presented as a summary
without implying incomplete execution or acquisition reporting.

The full attribution report travels with the Session result independently of
observation delivery, and observations retain it. Every referenced parent has its
description in the report, including earlier generating requests. Store each distinct
parent once and use local references; no separate Session or request-history lookup
is required to interpret the report.

Expansion work may be aggregated only while preserving associations between record
identities, qualified outcomes and generating origins. Different outcomes cannot
disappear into a total. These size improvements accompany incremental recording and
progress delivery and are checked at the repository's scale.

## Rationale and alternatives

Repeating the full report in ordinary JSON substantially enlarges refusals without
improving their immediate explanation. The chosen split follows the existing
separation between bounded interface output and fuller operational results. Keeping
the complete report in stdout was considered; retaining complete Session results
and self-contained resolution information makes that duplication unnecessary.

This changes neither qualified answer identity nor Session reference lifetime. It
introduces no durable history service, detail truncation in the full report, or new
whole-request resource budget.

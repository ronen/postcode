# Proposed revisions to docs/backlog.md

## Delete completed audit request

Delete the complete entry headed `Audit existing generic functionality for library reuse` when the human approves this package. The requested read-only work is complete in the [paired library audits](../records/audits/2026-09-27-foundation-readiness/README.md); the [foundation-readiness plan](plans/foundation-readiness.md) owns the approved adoption work. Removing the audit request does not claim that adoption is implemented.

## Retain broader execution investigation

Replace the complete entry headed `Investigate analysis parallelism and asynchronous I/O` with:

## Investigate analysis parallelism and asynchronous I/O

Added: 2026-09-24
Origin: human observation that PostCode appears to use one CPU during analysis
Area: analysis execution and responsiveness

After the [foundation-readiness programme](plans/foundation-readiness.md), measure remaining CPU use and stage-level wall time on representative projects to identify work that could run independently or overlap without changing results. That programme owns asynchronous Git lifetime/cancellation and demonstrated selected-basis indexing improvements; do not duplicate that work here or infer that it settles general parallelism.

Evaluate further parallel analysis or asynchronous I/O against worker startup and communication, memory use, deterministic output, captured-input consistency, session reference bindings and cancellation. Do not assume that asynchronous reads accelerate CPU-bound compiler work. Use the [completed latency investigation](../records/validation/2026-09-21-analysis-latency.md), the [processing audits](../records/audits/2026-09-27-foundation-readiness/README.md), and the foundation programme's integrated measurements as evidence, accounting separately for opening, first use, reuse and full CLI publication.

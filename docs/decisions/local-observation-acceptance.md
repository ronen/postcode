# Local observation acceptance contract

Status: accepted
Decided: 2026-09-27
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: acceptance and delivery guarantees of the development filesystem observation sink

## Context

Directly writing a final observation filename can expose an incomplete batch after failure. The existing [sink lifecycle](initial-observation-recording-decisions.md#send-to-a-sink-and-forget) leaves acceptance and durability with the sink, while the [delivery-failure policy](initial-observation-recording-decisions.md#surface-observation-delivery-failure-without-blocking-normal-use) preserves a successfully produced view. The local sink needs an explicit point at which delivery has succeeded, independently of later cleanup.

## Decision

Publish complete batches atomically under their final names without replacing existing files. Before publication succeeds, the batch is not accepted. Successful publication is the acceptance point: later cleanup failure does not make the batch undelivered and must not cause it to be reported as missing or automatically resubmitted.

Report delivery failure and post-publication cleanup failure distinctly. Neither changes an otherwise successfully produced view into an analysis failure. If the filesystem cannot provide complete, no-overwrite publication, report delivery failure rather than silently weakening that contract.

Acceptance guarantees complete final-name visibility, not persistence after power loss. Crash cleanup and historical retention are separate concerns; this decision does not establish an archive lifecycle or recovery service.

## Rationale

Complete publication prevents a partially written file from appearing to be a usable observation. No-overwrite behavior protects already published batches. A clear acceptance point makes delivery acknowledgements and subsequent cleanup diagnostics truthful without coupling analysis success to sink health.

## Alternatives considered

- Accept exclusive creation of the final filename before writing completes: prevents replacement but permits partial batches to appear under final names.
- Treat cleanup failure after publication as non-delivery: misrepresents an existing batch and can prompt duplicate submission.
- Guarantee power-loss durability as part of acceptance: adds a guarantee not required by the current development sink's purpose.

## Consequences

The sink must distinguish unsuccessful publication from successful publication with a cleanup problem. The implementation must preserve that distinction wherever it provides publication, and refuse delivery where the required filesystem behavior is unavailable. The [implementation plan](../plans/foundation-readiness.md#5-organized-observation-files-and-truthful-delivery-outcomes) specifies publication mechanics, project grouping, filenames, permissions and failure checks.

This specializes the local sink's contract without changing producer ownership, observation meaning or the separation between sink selection and archive policy.

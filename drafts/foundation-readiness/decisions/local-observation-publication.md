# Complete local observation publication

Status: in review
Decided:
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: acceptance contract of the development filesystem observation sink

## Context

Directly writing a final observation filename can expose an incomplete batch after failure. The existing [sink lifecycle](initial-observation-recording-decisions.md#send-to-a-sink-and-forget) leaves acceptance and durability with the sink, and [delivery-failure policy](initial-observation-recording-decisions.md#surface-observation-delivery-failure-without-blocking-normal-use) preserves a successfully produced view.

## Decision

Write a batch to an exclusively created private staging file in the destination filesystem, complete and close it, then publish its final name without replacement. The final name becomes visible only for a complete batch. Existing destinations remain untouched on collision. Keep current private file/directory creation permissions and destination policy.

Use same-directory hard-link publication followed by staging unlink when supported and verified. Successful creation of the final link is the publication commit point. Before that point, failure means the batch was not published; after it, failure to remove staging means the batch was published with a cleanup problem. Preserve and report that distinction instead of reporting an observation gap or retrying a delivered batch. Only remove staging paths owned by this attempt. A cleanup warning must not turn a successful view into an analysis failure.

Unsupported no-overwrite publication fails visibly through the sink-delivery path. Do not silently use overwriting rename or copying into a partially visible final file as a fallback. Hard kill may leave staging residue; normal exception cleanup does not certify crash cleanup. Automatic scavenging is outside this change.

## Rationale

Staging separates construction from publication. No-overwrite publication protects a batch already present at the final name. Explicitly identifying the commit point prevents retry and diagnostic mistakes when cleanup fails after successful delivery.

## Alternatives considered

- Write directly with exclusive final creation: prevents replacement but exposes partial content.
- Rename staging onto the final name: commonly permits overwrite and does not satisfy collision semantics.
- Add fsync, retry queues and archive management: unnecessary for the current acceptance contract; power-loss durability remains a separate requirement.

## Consequences and verification

Inject creation, partial-write, close, publication and cleanup failures. Verify final-name completeness, collision preservation, ownership of cleanup, truthful delivery diagnostics and unchanged successful command output/status. Test supported filesystem behavior explicitly. This establishes atomic final-name visibility without claiming persistence after power loss, strengthening the local sink contract without changing producer or archive ownership.

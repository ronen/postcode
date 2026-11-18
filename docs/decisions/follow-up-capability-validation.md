# Validate follow-up capability availability at invocation

Status: accepted
Decided: 2026-11-18
Arising from: [Structured architectural accounts task](../../records/tasks/2026-11-15-structured-architectural-accounts.md), human direction following [M2 round 11 review](../../records/reviews/structured-architectural-accounts/2026-11-18-m2-vertical-round-11-claude-findings.md)
Scope: retention and invocation of qualified follow-up options

## Context

The review observed that a follow-up option naming an unknown result contract can be retained, then refused when invoked. Unsupported operations already follow the same boundary. The human explicitly chose to preserve that behavior for both capabilities.

This specifies the availability-check boundary within [qualified guidance and illustrations](structured-architectural-explanation.md#qualified-guidance-and-illustrations). It does not change option ownership, exact question identity, qualification, supported subject requirements or result fulfillment.

<a id="invocation-time-availability"></a>
## Decision

Check capability availability when invoking an option, consistently for its operation and any promised result contract. A well-formed option may be retained even when either capability is unsupported. Invocation must refuse unsupported capabilities with a clear explanation; it must not open an investigator dialog, silently substitute an operation or drop the promised contract.

Continue rejecting structurally malformed options at authoring, including invalid request shapes and references under existing validation. Retention is not a guarantee of executability. Agent instructions direct authors creating executable options to the supplied catalogue of supported operations, subject forms and optional result contracts. That authoring guidance does not make membership in the current capability catalogue a retention-validity requirement.

## Rationale and alternatives

Qualified retained guidance and currently executable requests have distinct obligations. Deferring availability checks preserves the option's proposed meaning while enforcing the actual capability boundary when execution is requested. Checking only contracts at authoring would treat them inconsistently with operations. Rejecting all unsupported capabilities at authoring would conflate structural validity with current executability. Silently ignoring an unsupported promised contract would change the delegated request.

## Consequences and conformance

Current production already implements this choice. The ledger validates option structure and references without requiring registered operation/contract identities. Application invocation checks both capabilities before investigator execution and explains refusal. Production instructions supply the supported operation/subject and result-contract catalogues; these remain guidance for executable authoring.

Offline application tests cover retention followed by refusal for an unsupported operation and an unknown contract, without another dialog. Focused assertions also check explanatory text and explicit retention of the unknown contract. Structural-rejection regressions remain in the contribution dialog and ledger suites. No production behavior or instruction revision is required by this resolution.

This decision does not expand supported capabilities, require new live inference, accept the M2 checkpoint or authorize M3.

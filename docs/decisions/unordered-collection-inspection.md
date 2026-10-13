# Unordered collection inspection and explicit embedded empty detail

Status: accepted
Decided: 2026-10-12
Arising from: [Lens request model implementation](../../records/tasks/2026-10-11-lens-request-model.md), [answer-identity review F2](../../records/reviews/lens-request-model/2026-10-12-answer-identity-round-1-findings.md), and explicit human agreement
Scope: Current unordered module, group/mixed and dependency children/parents selections

## Context

The [qualified construction decision](qualified-construction-under-the-request-model.md#separate-answer-view-and-report-identity) makes the complete qualified answer determine its identity. Review found that resolved-subject constructors preserved caller order without defining its meaning. Current Session name lookup supplies population order and precise references identify one subject, but direct construction and future extension work also need an explicit rule. Ordinary module inspection also accepted an empty selection because group-only inspection needs empty embedded module detail.

## Canonicalize unordered collection payloads by population and record identity

Caller order has no defined meaning for these current collection inspections. Construct selections in evaluation-population order, followed by outside-population subjects in deterministic record-ID order. Organization preserves its separate group and module populations and their existing roles. Normalize the constructed payload consistently, before deriving its identity; sorting the key alone would leave conflicting immutable payloads.

Ordering must not use compact reference spelling or change reference-allocation populations, schedules or existing bindings. Existing wrong-kind, foreign-Session and duplicate-subject invariants remain enforced. Population inventories retain their existing evaluation ordering and valid empty answers.

This policy applies only to these unordered selections. It is not a universal canonicalization rule for future Lenses: meaningful subject order, roles, direction, supporting relationships and qualified content remain significant and must be preserved.

Treating caller order as semantic was considered and rejected because it has no defined meaning for these collections and would fragment equivalent answers.

## Separate embedded empty detail from ordinary inspection

An ordinary resolved-subject inspection requires at least one resolved subject. Empty input reaching that constructor is an internal invariant violation, not a caller refusal or an empty answer. Coordination handles unsuccessful user lookup by returning a resolution result without invoking the constructor.

Use a separate internal constructor for legitimate empty module detail embedded in a resolved group-only inspection. Preserve that detail's qualified support and the existing embedded/associated behavior. Valid empty inventory/population answers are unaffected.

Keeping the exception in ordinary inspection was considered and rejected because it hides the distinction between a settled application's embedded empty component and an unsuccessful application.

## Consequences and verification

Equivalent permutations must produce equal full payloads and IDs in all affected families. Tests distinguish evaluation order from record sorting, and outside-population record order from colliding compact-reference order. Verify unchanged allocation calls/bindings, invariant rejection of ordinary empty inspection, legitimate embedded empty detail, valid empty populations and coordination's non-View unsuccessful lookup path. Responsible construction methods advance when implementing this policy. No persistence, cross-Session reference validity, new public Lens or ordered-subject policy is introduced.

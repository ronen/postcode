# Proposed revisions to docs/decisions/README.md

Each block below is a complete replacement or addition at the identified destination. Unlisted material remains unchanged.

## Replace the opening role paragraph

<!-- BEGIN PROMOTION CONTENT -->
Decision records preserve consequential accepted choices and the reasoning available when those choices were made. They complement the human-maintained [application specification](../app-specification.md), governing [core concepts](../core-concepts.md), [architectural constraints](../architectural-constraints.md), and descriptive architecture documentation rather than replacing them. Do not create a decision record until the decision has been accepted; keep unresolved choices in drafts or discussion.
<!-- END PROMOTION CONTENT -->

## Replace “Governing-document changes”

<!-- BEGIN PROMOTION CONTENT -->
<a id="governing-document-changes"></a>
## Governing-document changes

[`docs/core-concepts.md`](../core-concepts.md) records the governing current cross-cutting architectural terminology, and [`docs/architectural-constraints.md`](../architectural-constraints.md) records the governing current cross-cutting rules. Decision records preserve why either was adopted or changed. Every semantic change to the core concepts and every substantive change to the architectural constraints requires explicit human agreement and a corresponding accepted decision record. Update the affected governing document and decision log in the same commit so the current statement and its history do not diverge.

Follow the [development workflow](../../dev/workflow.md#documentation) when changing either governing document. If a governing document and an accepted decision disagree, report the inconsistency rather than silently deciding which source to follow.

The human-maintained [application specification](../app-specification.md) governs intended application behavior and high-level design. Agents prepare its changes only under explicit human direction during design or planning; implementing agents report gaps and contradictions. Consequential changes require accepted decisions and coordinated updates to affected governing documents. A narrower research foundation does not by itself withdraw local application requirements.
<!-- END PROMOTION CONTENT -->

## Replace the “Accepted decisions” heading with itself and the new first entry

<!-- BEGIN PROMOTION CONTENT -->
<a id="accepted-decisions"></a>
## Accepted decisions

- [Separate research concepts from application specification](application-specification-boundaries.md)
<!-- END PROMOTION CONTENT -->

## Replace the acceptance paragraph beginning “A decision is accepted only through explicit human agreement”

<!-- BEGIN PROMOTION CONTENT -->
A decision is accepted only through explicit human agreement. Agents may develop and evaluate alternatives in drafts or discussion, but must not accept a decision themselves. An accepted decision must conform to governing foundation material, the application specification, core concepts, and architectural constraints unless it explicitly changes an affected governing document through the process below. A choice that conflicts with foundation material requires an explicitly authorized foundation revision before it can be accepted. Within its stated scope, an accepted decision is prescriptive and binding on subsequent work until it is superseded.
<!-- END PROMOTION CONTENT -->

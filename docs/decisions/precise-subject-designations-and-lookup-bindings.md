# Precise subject designations and unsuccessful lookup bindings

Status: accepted
Decided: 2026-10-12
Arising from: [Lens request model implementation](../../records/tasks/2026-10-11-lens-request-model.md), [subject-resolution review](../../records/reviews/lens-request-model/2026-10-12-subject-resolution-round-1-findings.md), and explicit human agreement on F1 and F4
Scope: Subject resolution and reference allocation in the current transient Session request model

## Context

The [request-model plan](../plans/lens-request-model.md) separates subject designation from effective qualified answers. The [construction decision](qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation) preserves successful allocation schedules while allowing unsuccessful requests to have a different allocation history. Review identified two choices to settle before answer-identity migration: which bindings unsuccessful name lookup creates, and whether precise designation accepts retained raw record IDs alongside compact bindings.

<a id="unsuccessful-lookup-bindings"></a>
## Allocate only returned candidates on unsuccessful lookup

Match the qualified population before allocating references for lookup delivery. A missing lookup does not allocate unrelated references. An ambiguous lookup allocates references for the full candidate set supplied in its result, independently of rendered paging or abbreviation. Preserve allocations required by genuine prerequisite work, all existing append-only bindings, and the established whole-population allocation schedules of successful applications.

Population-wide allocation on failure was considered and rejected because it binds unrelated subjects without serving prerequisite work or candidate delivery. A later unrelated subject can consequently receive a different compact spelling or collision length. Existing references must never change. Tests must preserve this distinction rather than normalize it away.

<a id="precise-subject-designations"></a>
## Accept raw same-Session record IDs as precise designations

Explicit reference designation accepts either an established compact reference or a raw ID of an actual retained module, group or investigram in the same Session. Validate the retained record, its Session and supported subject kind for either spelling. Check Lens applicability separately: a known incompatible subject is unsupported, not unknown. Raw-looking literal names remain name lookups. Neither spelling promises persistence or cross-Session validity.

A raw ID and its compact reference resolve to the same subject and, with otherwise identical effective inputs, the same qualified answer. Preserve supplied spellings independently in request reporting. This specializes the existing designation-independent answer-identity requirement; it does not permit dropping effective support, qualification, subject roles or immutable payload consistency.

Restricting public precise designation to compact bindings was considered and rejected. Raw IDs are useful precise references and were already accepted for module selection. Applying the same validation to groups and investigrams makes that behavior explicit and consistent without inferring existence from a prefix or allocating a binding merely to classify a target.

## Consequences

These choices refine the approved request model without introducing a durable reference service or changing Session lifetime. They govern the remaining answer-identity migration as well as current resolution. Implementation documentation must distinguish implemented precise-spelling equivalence from the broader name/handle/reference identity migration still in progress.

# Proposed revisions to docs/decisions/precise-subject-designations-and-lookup-bindings.md

Replace the metadata block before the first level-two heading with the following. Preserve all historical body text.

# Precise subject designations and unsuccessful lookup bindings

Status: partially superseded
Decided: 2026-10-12
Arising from: [Lens request model implementation](../../records/tasks/2026-10-11-lens-request-model.md), [subject-resolution review](../../records/reviews/lens-request-model/2026-10-12-subject-resolution-round-1-findings.md), and explicit human agreement on F1 and F4
Scope: Subject resolution and reference allocation in the current transient Session request model

Superseded in part:

- [Allocate only returned candidates on unsuccessful lookup](#unsuccessful-lookup-bindings), the whole allocation decision; qualified candidate population/resolution behavior remains required, is replaced by [CLI shell retirement](cli-shell-retirement.md#precise-references).

- [Accept raw same-Session record IDs as precise designations](#precise-subject-designations), only compact-input acceptance and compact/raw equivalence; preserve retained-ID, kind, Session and applicability validation, is replaced by [CLI shell retirement](cli-shell-retirement.md#precise-references).

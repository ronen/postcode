# Product-design architecture reconciliation: review guide

Updated: 2026-10-08
Foundation baseline: `337451bd37f91004a14d56149c52b4491bef783a`

Proposal coverage: `0bb24fe` (re-review corrections following `9deb123`).

This is non-governing review material, not a proposed canonical document. The draft adapts application architecture to the adopted [product design](../foundation/product-design.md); no foundation changes are proposed. The package remains unpromoted and awaits human-arranged review. It authorizes no implementation.

## Review order and destinations

| Draft | Intended canonical destination |
| --- | --- |
| [Decision](../drafts/product-design-architecture/decisions/coordinated-views-and-qualified-results.md) | `docs/decisions/coordinated-views-and-qualified-results.md` |
| [Core concepts](../drafts/product-design-architecture/core-concepts-revisions.md) | `docs/core-concepts.md` |
| [Architectural constraints](../drafts/product-design-architecture/architectural-constraints-revisions.md) | `docs/architectural-constraints.md` |
| [Architecture overview](../drafts/product-design-architecture/architecture/README-revisions.md) | `docs/architecture/README.md` |
| [CLI reference](../drafts/product-design-architecture/cli-reference-revisions.md) | `docs/cli-reference.md` |
| [Backlog](../drafts/product-design-architecture/backlog-revisions.md) | Additions to `docs/backlog.md`; candidates, not commitments |
| [Decision index](../drafts/product-design-architecture/decisions/README-revisions.md) | `docs/decisions/README.md` |
| [Session metadata](../drafts/product-design-architecture/decisions/transient-analysis-sessions-revisions.md), [projection metadata](../drafts/product-design-architecture/decisions/initial-projection-architecture-decisions-revisions.md), [interface metadata](../drafts/product-design-architecture/decisions/keep-views-grounded-in-core-projections-revisions.md) | Metadata-only revisions to the corresponding historical decisions |

The package root mirrors `docs/`. Revision files identify complete replacement units or exact insertion points. Links inside promotion-ready units target their intended canonical locations; those files need not exist inside the draft directory. Only proposed canonical documents or revisions remain under `drafts/product-design-architecture/`.

The separate [impact assessment](product-design-architecture-impact.md) records implementation limitations, known conformance issues, later choices and implications for Lens preparation. It is non-permanent supporting material. No draft file links to or depends on either this guide or the assessment; context required after promotion is carried in the proposed decision and backlog.

## Choices presented for adoption

A Lens may use several contributions without a separate composite-Lens category. One View may coordinate independently qualified Projections, each of which may concern several captured program states. Presentation can count an explicitly supplied qualified population and coordinate established information; deriving new program information requires core analysis and a qualified Projection.

Requests designate inputs and binding policies. Following resolves a changing input again; pinned requests continue using the same captured program state. A Projection identifies its captured basis and retains its qualified result. References distinguish that result from a request repeatable under current bindings. A summary View may be suggested when no more specific need is expressed; it is not a mandatory default and need not depend on a summary Lens.

Subject stays open-ended. A question about what changed in a module investigates the module across separately identified captured states; a question about why an identified dependency change occurred can investigate that qualified change. Neither hides state designation in the subject or introduces a change entity kind.

Presentation-only actions, including paging and reformatting, preserve the selected answer. An interaction that refreshes must make that behavior apparent and disclose consequential changes in answer, selection or qualifications. Retained interpretations and correction/association selections are distinct from captured program states and acquire no following/pinned policies. F6 is an acknowledged current human-facing continuity/disclosure limitation with explicitly deferred remediation. Exact retained-Projection presentation is the implementation direction; disclosed reselection may be an interim treatment but is not equivalent continuity.

PostCode must expose the selections actually made and their criteria at the time, without reconstructing explanations from changed defaults. This does not require a general planner or stored plan artifact. Output-form or length choices remain presentational only when they change rendering or abbreviation. GUI plans identify missing core capabilities instead of assigning new program derivation to View code; those capabilities need not all be implemented first.

Observations must record the actual Projections and their View composition, preserving their associations with captured states and recording composition/basis changes. Recording does not itself require workspace persistence. A newly confirmed current observation-provenance gap is distinguished from future multi-state support below.

The foundation remains unchanged. Captured-basis attribution does not prescribe a state field or new key in every family. Coordinating several Projections from one existing Session does not inherently require multi-state support. Legitimate component use requires attributable meaning, method, basis and qualification, not a universal direct pointer. The choice between a qualified Projection selection and View coordination follows requested meaning; shared display alone requires no outer Projection.

## Open adoption choice

Ordinary module observations retain the presented View but omit its retained analysis-input basis. Source-detail evidence can include item digests without establishing complete captured-state attribution. This is a current recording gap, separate from the core's retained qualified support and from F6. The proposed decision's [observation-provenance section](../drafts/product-design-architecture/decisions/coordinated-views-and-qualified-results.md#current-observation-provenance-gap) marks one consequential choice: accept the package with this gap explicitly deferred, or require a separately authorized bounded correction before acceptance. Adding a backlog candidate does not settle that choice.

Subject and F6 semantics are settled; no further choice about them is pending. Implementation designs remain scoped to future capabilities, and no implementation is authorized by this package.

## Later promotion

The human directs promotion after review. On acceptance, set the decision's status and actual decision date, reconcile intervening canonical changes, and apply the decision, governing revisions, descriptive revisions, backlog additions, supersession metadata and index updates together. The foundation remains unchanged.

Preserve historical decision bodies, their rationale, previous supersession mappings, concluded tasks, audits and reviews. Earlier mappings continue to point to their historical replacement; its new forward mapping supplies the next link in the chain. Do not retroactively rewrite those mappings or records.

Check destination links and retain all required canonical context before removing promoted drafts. This guide and assessment are not promotion inputs and may be removed separately at human direction. No task record was opened because this work is proposal preparation rather than implementation.

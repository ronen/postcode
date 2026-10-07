# Product-design architecture reconciliation

Status: in preparation — non-governing; awaiting human review
Prepared: 2026-10-07
Baseline: `c0ed132a7af4c479e21deab69d0d6dfe9330ca7f`

This package reconciles the application architecture with the revised product design and the human's qualifications about immutable results, presentational counts and summary-first navigation. It proposes adoption only. It neither authorizes implementation nor promotes any document.

## Review order and destinations

| Draft | Intended destination or role |
| --- | --- |
| [Foundation revisions](../drafts/product-design-architecture/foundation/product-design-revisions.md) | `foundation/product-design.md`; explicit human foundation adoption required |
| [Decision](../drafts/product-design-architecture/decisions/coordinated-views-and-qualified-results.md) | New `docs/decisions/coordinated-views-and-qualified-results.md` |
| [Core concepts](../drafts/product-design-architecture/core-concepts-revisions.md) | `docs/core-concepts.md` |
| [Architectural constraints](../drafts/product-design-architecture/architectural-constraints-revisions.md) | `docs/architectural-constraints.md` |
| [Architecture overview](../drafts/product-design-architecture/architecture/README-revisions.md) | `docs/architecture/README.md` |
| [CLI reference](../drafts/product-design-architecture/cli-reference-revisions.md) | `docs/cli-reference.md` |
| [Backlog](../drafts/product-design-architecture/backlog-revisions.md) | Additions to `docs/backlog.md`; candidates, not commitments |
| [Decision index](../drafts/product-design-architecture/decisions/README-revisions.md) | `docs/decisions/README.md` |
| [Session metadata](../drafts/product-design-architecture/decisions/transient-analysis-sessions-revisions.md), [projection metadata](../drafts/product-design-architecture/decisions/initial-projection-architecture-decisions-revisions.md), [interface metadata](../drafts/product-design-architecture/decisions/keep-views-grounded-in-core-projections-revisions.md) | Metadata-only revisions to the corresponding historical decisions |
| [Adoption impact](product-design-architecture-impact.md) | Package review material; no automatic canonical destination |

The package root mirrors `docs/`. The explicit exception is `foundation/product-design-revisions.md`, whose destination is the repository's `foundation/product-design.md`, not `docs/foundation/`. Revision files identify complete replacement units or exact insertion points. Links inside promotion-ready units target their intended canonical locations; they need not resolve inside this draft. This README and the impact assessment link to actual review material.

## Choices presented for adoption

A Lens may use several contributions without a separate composite-Lens category. One View may coordinate independently qualified Projections, each of which may concern several captured program states. Presentation can describe a supplied population and coordinate established information; new program claims require core analysis and a qualified Projection. Live bindings govern future requests, not mutation of results. Summary-first remains the default for an unspecified information need and does not require a summary Lens.

These choices follow the human's direction. No unresolved consequential choice blocks preparation of this package. The impact assessment identifies consequential implementation choices that remain unaccepted and must be resolved before the relevant later work. In particular, this package does not settle a universal identity scheme, a workspace lifecycle, Lens registration, or any public schema migration.

## Promotion boundary

The human arranges review and directs any later promotion. Review the foundation amendment, decision, governing revisions and metadata together. If accepted, adopt the foundation wording before or atomically with the dependent architecture changes; set the decision to `accepted` with the actual decision date. Reconcile intervening changes against the baseline rather than replacing current files blindly.

Apply the three metadata revisions and decision-index updates in the same promotion as the new decision and governing revisions. Preserve earlier decision bodies, their rationale, previous supersession mappings, concluded tasks, audits and reviews. Older mappings continue to point to the historical replacement; its new forward mapping supplies the next link in the chain. Do not retroactively rewrite those mappings or records.

Carry required context from the impact assessment into the decision and backlog (the proposed text already does so). Do not promote this README or its note links into an accepted decision. Check destination links and remove the promoted draft material only when the human directs promotion. There is no implementation plan or task record: this is exploration and proposal preparation under the planning workflow.

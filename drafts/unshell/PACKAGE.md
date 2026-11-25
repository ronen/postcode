# CLI shell retirement planning package

Draft for review, 25 November 2026. The package contains the plan, scoped decision
and coordinated canonical revisions for CLI shell retirement.

## Review entry points

- [Implementation plan](plans/cli-shell-retirement.md): scope, required outcomes, coverage,
  baselines, completion criteria and verification limits.
- [Retirement decision](decisions/cli-shell-retirement.md): contracts, alternatives,
  exact scoped supersession and adoption/conformance gaps.
- [Application specification revisions](app-specification-revisions.md) and
  [architectural constraint revisions](architectural-constraints-revisions.md).
- [Backlog revisions](backlog-revisions.md): research/feedback gap, captured-basis
  requirement and reconciliation of obsolete CLI/worker premises.
- `decisions/*-revisions.md`: complete replacement metadata blocks for affected older
  records. Each mapping names the whole section or the specific clauses it replaces.
- [Index revisions](README-revisions.md), [plan index](plans/README-revisions.md)
  and [decision index](decisions/README-revisions.md).

The content links use intended canonical paths. Links to existing canonical files
can therefore be unresolved when read directly inside the package; review them
against the corresponding `docs/` paths. This guide is package-only and is not
promoted to `docs/`.

## Scope and review focus

The plan removes the investigation CLI, private worker, compact aliases and unused
feedback/observation implementation, retains authentication and direct application
validation, moves useful rendering and corrects terminal-abort accounting/cleanup.
Review preservation boundaries and shutdown ordering together with the decision.
No new observation implementation, GUI design, worker framework or general callback
policy is included.

No semantic `core-concepts.md` revision is identified. Reference stability concerns
precise identity as well as any supported handle, not a requirement for CLI aliases.
Foundation and human-maintained development instructions are unchanged. Implemented
architecture, setup/reference docs and STATUS changes belong to implementation, so
they do not claim a completed retirement at adoption.

The source baseline is `5f9534a`; `c1907d2` identifies the reviewed exploratory proposal.
The decision and plan contain the contracts and verification requirements for review.

# UNSHELL planning package

Draft for human review, 25 November 2026. Nothing in this directory is adopted or
implementation authorization. The package records the reviewed proposal as a plan,
scoped decision and coordinated canonical revisions. No application code, canonical
governing document, foundation, steering or development-process file is changed.

## Review entry points

- [Implementation plan](plans/cli-shell-retirement.md): scope, ordered work, coverage,
  baselines, completion criteria and verification limits.
- [Retirement decision](decisions/cli-shell-retirement.md): contracts, alternatives,
  exact scoped supersession and adoption/conformance gaps.
- [Application specification revisions](app-specification-revisions.md) and
  [architectural constraint revisions](architectural-constraints-revisions.md).
- [Backlog revisions](backlog-revisions.md): research/feedback gap, captured-basis
  requirement and reconciliation of obsolete CLI/worker premises.
- `decisions/*-revisions.md`: complete replacement metadata blocks for affected older
  records. Their bodies and historical rationale are preserved.
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

The source baseline is `5f9534a`; proposal review concluded at `c1907d2` on
`codex/unshell-planning`. The proposal and its discussions are drafting provenance,
not dependencies of the intended canonical documents. Only the package is changed
for formal drafting; notes and disposable review evidence are left intact for now.

## Adoption and later implementation

After human approval, promote the plan, decision, specification/constraint/backlog
units, older-record metadata and indexes atomically. Set final status/date metadata
at adoption and reconcile intervening canonical changes. The research-support item
must accompany the decision; the immutable decision names it without linking to the
mutable entry. No task record is opened by drafting or promotion.

Clean up notes/review scratch only under human direction after required context is
incorporated. Report the steering implication separately: UNSHELL planning advances,
but its implementation and BOOK readiness are not established. Do not include steering
revisions in this package. Historical completed plans/records remain unchanged.

Implementation requires a separately authorized task under the task protocol and
uses its review gates. The human decides whether this draft needs another review and
whether to adopt it; the earlier proposal review did not approve this package.

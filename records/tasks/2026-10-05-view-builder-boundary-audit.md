# Audit view builders against the interface analysis boundary

Status: completed
Opened: 2026-10-05
Closed: 2026-10-05

## Task

please start a task to perform the audit listed in the backlog "Audit existing view builders against the interface analysis boundary" -- fix clear violations; and report any case that needs a new architectural choice rather than broadening the task into a refactor.

## Follow-ups

yes, remove the original backlog entry, and you can close the task

## Outcome

Audited the module, composition, organization, dependency, investigation and
associated-investigram view builders, and the interface modules, against the
views and analysis boundary. The
[audit report](../audits/2026-10-05-view-builder-boundary/REPORT.md) classifies
each operation as arrangement, core selection or derivation, or a new Claim.

No clear violation was confirmed, so no code changed. Investigation revision and
association selection is core derivation that the governing constraints require
and evaluation also uses. Organization and dependency evidence summaries arrange
information supplied by the core.

One finding needs an architectural choice and was reported rather than
refactored. The `create*View` builders combine format-dependent display bounds
with interface-independent dereferencing, counting and investigation
selection, and investigation lenses have no stored Projection record. Until
that role is assigned, it is undetermined whether some counts conform:

- the organization view's evaluation-wide external-module total;
- its per-group unanalyzed-artifact classification;
- the dependency view's module-evaluation population counts.

This finding was added to the backlog as "Assign the role of view builders
relative to Projections". As directed in the follow-up, the original audit
backlog entry was removed.

## Verification

- Read every view builder and renderer, and checked their call sites in
  `session.ts`. Searched the interface modules for record-store and claim
  access and found none.
- `npm test` after the opening commit, with no source changes: the first run
  reported 465 passed and 4 failed. The failing tests were not identified,
  because only the tail of that run's output was kept. An immediate full rerun
  (`node --test _build/test/*.test.js`) passed 469 of 469. The first run's
  failures remain unexplained intermittent results.
- Checked that the report's relative links point to existing documents and
  headings.

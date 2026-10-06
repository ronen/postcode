Record type: handoff

# Retained investigation selection checkpoint

Prepared: 2026-10-06
Task: [Separate qualified view construction from presentation shaping](../../tasks/2026-10-05-view-construction-boundary.md)
Review gate: intermediate implementation review before CLI arrangement and identity integration
Review target: `3e1b94bc09bd4586d61c60de554f724f2b57bd3e`
Baseline: `5591775af0737d90911fb247d2007e75db1ab59c`
Diff range: `5591775af0737d90911fb247d2007e75db1ab59c..3e1b94bc09bd4586d61c60de554f724f2b57bd3e`
Branch: `codex/view-construction-boundary`

## Review assignment and boundaries

Independently review the retained investigation-selection record, its construction,
validation and resolved core content, the unpaged revision derivation and its
compatibility adapter, and the restricted reference-binding capability.

The human authorized intermediate review when it materially reduces risk. The
record format now freezes history-dependent semantics that subsequent CLI
arrangement and View identity will rely on. Reviewing those semantics before
integrating the display traversal makes failures easier to isolate. This is a
new assignment after the human accepted the corrected mechanical checkpoint as
sufficient to continue; its [disposition](2026-10-06-mechanical-construction-disposition.md)
records that gate.

Inspect the implementation and evidence directly. Neither this handoff nor the
author's checks or earlier reviews establish correctness. Recommend whether this
core checkpoint is sound enough to proceed with CLI integration. Only the findings
record described below is an authorized repository change for this assignment.

## Governing context

- [Active task and human resolutions](../../tasks/2026-10-05-view-construction-boundary.md)
- [Core concepts](../../../docs/core-concepts.md)
- [Architectural constraints](../../../docs/architectural-constraints.md)
- [Retained interpretation and correction decisions](../../../docs/decisions/investigrams-and-progressive-investigation.md)
- [Session and Projection boundaries](../../../docs/decisions/transient-analysis-sessions.md)
- [Interface boundary](../../../docs/decisions/keep-views-grounded-in-core-projections.md)
- [Investigation architecture](../../../docs/architecture/investigation.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md)
- [Implementation conventions](../../../docs/implementation-conventions.md)
- [Independent review workflow](../../../dev/review.md)

The human-approved proposal, including the later zero-group wording resolution,
can be read at this immutable revision:

```sh
git show 354f204:drafts/view-construction-boundary/decisions/qualified-projection-construction.md
git show 354f204:drafts/view-construction-boundary/architectural-constraints-revisions.md
```

Promotion remains pending until all existing builders conform. This checkpoint
does not adopt a new binding constraint over the still-unconverted investigation
and associated-inspection builders. Eager resolution and no display bounds apply
to these builders, not universally to all future execution strategies. Holding
source in core is not disclosure; eventual disclosure through any Presentation
must be classified and recorded from its actual View.

## Result under review

The new record has request, historical-inspection and associated-inspection
variants. Request outcomes distinguish a retained evaluation, inline unavailable
outcome and no evaluation. Selection/status, exact subject references, roots,
original-to-selected relations, displaced composition, navigation, full ordered
associations and full revision snapshots are retained. Account/correction/provenance
and supporting content remain existing immutable records. Selection identity
normalizes known reference positions only; it excludes reporting and presentation
choices and absolute session ranks.

Core resolution reads the retained record and fixed references without session
enumeration, evaluation, source acquisition or binding. It supplies full selected
accounts, corrections, provenance, support/context/input/source data, exposure
pairs and a typed bindable population. The binding port permits only complete
batches of authorized IDs and kinds and exposes no content or selection operations.
It allocates nothing until explicitly invoked.

`InvestigationRevisions.snapshot` produces full immutable results. A separate
adapter preserves existing 24-row/inconsistency pages and eight-citation cause
limits. Existing CLI and investigator-context callers use that adapter; their
other selection, arrangement and identity behavior is unchanged. The exhaustive
investigator wire-reference traversal recognizes the new record type without
making it available through evidence acquisition.

Registering `postcode/investigation-projection@1` adds it to shared session method
metadata, including mechanical requests, because current sessions list every
registered method. This does not mean those requests produced an investigation
selection. No presentation method is bumped at this checkpoint. Existing View
identity formulas and public fields remain unchanged.

The new selection constructors, content resolver and binding port are exercised
independently by tests but **are not yet wired into CLI request execution**. This
is intentional at this review gate. Remaining work includes:

- Replay the existing bounded CLI traversal over this content while preserving
  displayed-subset provenance, support, exposures and actual source disclosure.
- Integrate retained associated selections using the shown mechanical Projection;
  preserve all-match allocation, continuation handling and existing listing bounds.
- Introduce the subjectless usage descriptor and separate arrangement/View identity,
  normalized continuation and revision-page inputs, and explicit worker-side
  arrangement-key transfer for parent-side usage finalization.
- Verify exact allocation call schedules and complete output/observation behavior,
  promote the approved architectural material, and prepare final integrated review.

## Verification already performed

The [verification record](../../validation/view-construction-boundary/2026-10-06-investigation-selection.md)
describes implementation-agent checks and their limits. Type checking and the
complete test suite passed: 484 tests, zero failed or skipped. A focused run passed
66 tests. The [differential result](../../validation/view-construction-boundary/2026-10-06-revision-comparison.json)
contains 875 exact structured and serialized comparisons with the baseline
revision delivery over 175 accounts and 58 corrections; no differences were
normalized away. Final implementation source/tests match those runs; the later
target commit corrects the verification document's description of method metadata.

## Review focus and reproduction

1. Are the retained variants and identity inputs complete for every authorized
   request case? Check missing-to-bound selection, unavailable outcomes without
   retained attempts, unchanged reuse/retry semantics, reference-shaped literals,
   and irrelevant additions that shift acceptance ranks.
2. Do full revision snapshots preserve primary/family-primary, conflicts,
   transitive reconsideration, provenance exemptions and qualified inconsistency
   attribution? Can old records be resolved and reinserted after later history
   without re-derivation or new associations?
3. Are roots, immutable child/accompanying adjacency and retained relations enough
   to replay the existing queue, including repeated routes to one primary?
   Check displaced descendants and their corrections, navigation, association
   order, and subjects/basis for embedded module and mixed organization inspection.
4. Does core resolve all qualification/support and reference positions needed by
   later arrangement beyond current display bounds without inventing a new
   selected population? Check evidence exposure pairs and support for correction
   and inconsistency reporters. Review ownership, cloning and immutability.
5. Does store validation enforce reference kind/session, graph and attribution
   consistency atomically? Does the binding port reject an invalid whole batch
   before allocating, and avoid reserving undisplayed colliding spellings?
6. Does the page adapter preserve existing CLI and investigator-context behavior
   exactly? Check that the new record type does not change evidence eligibility,
   correction eligibility, exposure accounting or evaluation reuse.

Run `npm run check` and `npm test` with local loopback access for existing
authentication tests. Keep the checkout unchanged while session tests run; they
intentionally detect repository input changes. Focused tests are
`test/investigation-selection.test.ts`, `test/investigation-revisions.test.ts`,
`test/investigation-integration.test.ts` and `test/records.test.ts`. The verification
record describes the baseline differential script. No performance characterization
or complete new-path CLI/worker comparison is claimed at this checkpoint.

## Findings return

If you have repository write access, use the
[findings template](../../../dev/templates/review-findings.md), create
`2026-10-06-investigation-selection-round-1-findings.md` in this review series,
include the exact target, scope and checks actually reviewed, and preserve the
report under `## Returned findings`. Commit only that record. Do not modify source,
documentation, governing material, task status or the task record. Without write
access, return the findings to the human. Further rounds use successive round
numbers under this assignment and identify their exact implementation target.

## Review gate

Implementation pauses for human-arranged independent review. Assess every returned
finding, act on clear authorized corrections, and obtain human direction before
rejecting or materially qualifying a finding, choosing consequential alternatives,
expanding scope or proceeding through unresolved reviewer uncertainty. Human
direction that this checkpoint is sufficient is required before CLI integration;
a reviewer recommendation alone is not acceptance. Final integrated review and
explicit approval to close the task remain mandatory.

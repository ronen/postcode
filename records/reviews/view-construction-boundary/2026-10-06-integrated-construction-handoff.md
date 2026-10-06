Record type: handoff

# Qualified construction boundary: final integrated review

Prepared: 2026-10-06
Task: [Separate qualified view construction from presentation shaping](../../tasks/2026-10-05-view-construction-boundary.md)
Review gate: final integrated review before explicit human approval to close
Review target: `16ec9ae261715735aa44f62e969ae0f49dc2942e`
Baseline: `b34e8ee43db39610de4189cd967fbd92e16a6592`
Diff range: `b34e8ee43db39610de4189cd967fbd92e16a6592..16ec9ae261715735aa44f62e969ae0f49dc2942e`
Branch: `codex/view-construction-boundary`

## Review assignment and boundaries

Independently review the integrated separation of qualified construction from CLI
arrangement across module, organization, dependency and investigation builders,
including associated inspection, identity, usage finalization, disclosure and
the promoted architectural decision. Recommend whether the task is ready for
human acceptance. Inspect source and evidence directly; this handoff, the author's
verification and prior reviews do not establish correctness.

This assignment follows two intermediate checkpoints. Their accepted corrections
and gate conclusions are recorded in the
[mechanical disposition](2026-10-06-mechanical-construction-disposition.md) and
[investigation selection disposition](2026-10-06-investigation-selection-disposition.md).
The human chose investigation F1(a), permitted continuation without re-review,
and required a final integrated review before task closure. The final integration
is in `48aed62`; decision promotion is in the target commit. The complete range
above also includes the earlier mechanical and core-selection implementations.

Only the findings record described below is an authorized repository change for
this assignment. Do not alter implementation, governing material or task status.

## Governing context

- [Active task and human resolutions](../../tasks/2026-10-05-view-construction-boundary.md)
- [Accepted qualified construction decision](../../../docs/decisions/qualified-projection-construction.md)
- [Core concepts](../../../docs/core-concepts.md)
- [Architectural constraints](../../../docs/architectural-constraints.md)
- [Initial Projection architecture](../../../docs/decisions/initial-projection-architecture-decisions.md)
- [Session and retained-result boundaries](../../../docs/decisions/transient-analysis-sessions.md)
- [Investigrams and progressive investigation](../../../docs/decisions/investigrams-and-progressive-investigation.md)
- [Architecture overview](../../../docs/architecture/README.md) and [investigation architecture](../../../docs/architecture/investigation.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md), [implementation conventions](../../../docs/implementation-conventions.md) and [review workflow](../../../dev/review.md)

The promoted constraints cover current and future Presentations of these families,
including the GUI. Eager resolution and absence of core display bounds describe
these builders, without universally forbidding presentation pushdown or lazy
materialization through Evaluation/core construction. Source held internally is
not disclosure; each Presentation must classify and record the actual source
exposed through its View. The original backlog entry is resolved by this decision
and implementation, not deferred.

## Result under review

Mechanical core content preserves selected records, evaluation bases and support,
including qualification for population-derived counts. Arrangement and rendering
consume supplied values without store access. Existing View fields establish
organization classification completeness, including zero-group cases, so there
is no additive completeness field. The legacy `unanalyzed` count remains unchanged;
incomplete cases use neutral wording and explain the qualified set difference.

Investigation core construction retains request, historical and associated
selection variants with full relevant revisions and association populations.
Resolution follows fixed references and supplies cloneable immutable content.
Arrangement replays the established bounded CLI traversal and requests only
declared references through a binding-only capability. Associated mechanical
inspection records its shown mechanical Projection and actual inspected subjects.
The associated domain query used by investigation evaluation no longer imports
presentation arrangement.

Projection identities exclude presentation controls and reporting. Separate View
formulas include normalized continuation/page choices, format/source detail,
reference lifetime and invocation reporting. Provider status/body/request ID
remain reporting under accepted F1(a); semantic unavailability stays selected.
The worker carries the usage-independent arrangement key outside the public View.
The parent finalizes identity and rendering from sealed usage without core access.
Usage-only requests have a subjectless reporting descriptor, not a stored program
Projection.

Permitted visible changes are the documented Projection/View IDs and method
metadata, plus neutral incomplete-artifact wording. The shared presentation bump
is `postcode/presentation@26` → `@27`; investigation presentation is `@11` → `@12`
and selection construction adds `postcode/investigation-projection@1`. The existing
complete registry in provider input capture also changes the captured value and
its derived input ID/references. No other schema, numeric, evaluation, reference,
qualification or source-disclosure change is intended.

## Verification already performed

The [integrated verification record](../../validation/view-construction-boundary/2026-10-06-integrated-construction.md)
describes checks, normalization rules, reproduction and limits:

- Type checking passed; the full suite passed **486 tests**, zero failed/skipped.
- **486 investigation/associated cases** compared full Views, exact Unicode/JSON,
  observation contents, binding schedules and actual disclosure. They include
  accumulating/reordered requests, colliding references, bounds, valid/invalid
  continuation pages, revision pages, reuse, unavailability and usage.
- Three real provider captures verified the exact registry and captured-input
  consequences, then supplied those input values to paired support fixtures.
- **632 mechanical Views** compared all fields and rendering across ten compiler
  fixtures, including the permitted incomplete wording and shared-method IDs.
- **875 revision results** matched exactly, including serialized order and bounds.
- Whitespace checks and affected documentation links/heading targets passed.

These are author checks. No hosted inference, GUI behavior, performance or memory
characterization was exercised. Complete eager content and dense-history snapshot
cost remain the approved strategy; no new claim of scalability is made.

## Review focus and reproduction

1. Verify that construction owns semantic selection and qualified derivation,
   while arrangement cannot retrieve, enumerate, refresh or broaden session
   content. Check every family and mixed/embedded mechanical inspection.
2. Verify that retained investigation records determine their complete payload,
   survive later history unchanged and preserve Lens/evaluation distinctions.
   Check F1 reporting exclusion and F2 unsupported/no-evaluation validation.
3. Trace bounded investigation display through complete core content. Check
   replacement/displacement order, accompanying corrections, provenance exposure,
   displayed-subset support and source, incoming inconsistencies and omissions.
4. Check exact reference-allocation populations and sequence, including the
   all-match association allocation after the mechanical or investigation display.
   The binding port must validate whole batches before changing bindings and must
   expose no content or lookup capability.
5. Check Projection versus arrangement/View identity, semantic continuation
   normalization, unknown/empty pages, omitted page 1, usage-only reporting and
   provider metadata. Trace the actual worker closing-window finalization, not
   only direct calls to the finalizer.
6. Check incomplete organization classification with some modules listed, incomplete
   artifact support with complete placement, and zero selected groups. Rendering
   must remain self-contained and preserve JSON numbers and evaluation metadata.
7. Inspect the comparison scripts' allowances rather than assuming their success
   proves equivalence. Confirm captured-input consequences and full observation
   values are accounted for without erasing meaningful differences. Check that
   the decision, constraints and architecture match the integrated implementation.

Run `npm run check` and `npm test` with local loopback access for existing tests.
Keep the checkout unchanged while the suite runs: session tests intentionally
detect repository changes. Focused tests include `projection-content`,
`investigation-selection`, `investigation-revisions`, `investigation-integration`
and `records`. The verification record gives the comparison commands and exact
baselines. The investigation comparison uses the later pre-core baseline
`5591775af0737d90911fb247d2007e75db1ab59c`, which already includes the corrected
mechanical implementation; the full review range remains the one above.

## Findings return

If you have repository write access, use the
[findings template](../../../dev/templates/review-findings.md), create
`2026-10-06-integrated-construction-round-1-findings.md` in this review series,
identify the exact target and scope actually reviewed, and preserve the report
under `## Returned findings`. Commit only that record. Do not modify other files,
governing material, implementation, task status or the active task record.
Otherwise, return the findings to the human. Further rounds use successive round
numbers under this assignment and identify their exact target.

## Review gate

Implementation pauses here for human-arranged final review. Assess and record a
disposition for every finding; act on clear authorized corrections and ask before
rejecting or materially qualifying a finding, choosing consequential alternatives,
expanding scope or proceeding through unresolved reviewer uncertainty. A reviewer
recommendation alone does not close the gate. The task remains active until the
human explicitly approves closure after any required correction/review rounds.

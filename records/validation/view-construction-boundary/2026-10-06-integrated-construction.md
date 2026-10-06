# Integrated qualified construction verification

Date: 2026-10-06
Task: [Construction boundary](../../tasks/2026-10-05-view-construction-boundary.md)
Mechanical baseline: `b34e8ee43db39610de4189cd967fbd92e16a6592`
Investigation baseline: `5591775af0737d90911fb247d2007e75db1ab59c`
Environment: Node.js 22.13.1; repository-pinned TypeScript 6.0.3.

## Integrated result

The current CLI now uses immutable core content for module, organization,
dependency and investigation arrangement. Investigation and associated inspection
retain selection Projections before arrangement; earlier selections resolve their
fixed references without consulting newer session history. Associated mechanical
inspection uses the actual shown mechanical Projection as its basis.

Investigation arrangement receives resolved content and a validated binding-only
capability. It preserves the existing bounded traversal, allocation sequence,
displayed-subset support/provenance/exposure and actual source disclosure.
Association paging consumes the complete retained match population. Domain
revision snapshots remain unpaged; the delivery adapter retains established
human and investigator bounds. Subjectless usage remains reporting.

The worker carries an explicit arrangement key beside its View. Parent-side usage
finalization uses that key and its sealed usage reports, preserving selection and
presentation inputs without core access or public JSON schema changes.

The shared mechanical presentation method is `postcode/presentation@27`;
investigation presentation is `postcode/investigation-presentation@12`, with
`postcode/investigation-projection@1` for retained selections. Registry changes
also appear in captured input values and their derived IDs/references. Investigation
and associated Projection/View identities change as approved. Incomplete
organization classification uses the qualified neutral wording; complete-case
text, numeric calculations, legacy field names and evaluation outcomes remain.
Existing View fields fully support classification completeness, so no additive
completeness field was needed.

## Automated checks

- `npm run check`: passed.
- `npm test`: **486 passed, zero failed, zero skipped**, approximately 158 seconds.
  This included the final source and tests. The checkout remained unchanged during
  the run. Local loopback access supports existing transport/authentication tests;
  no hosted inference was invoked.
- Focused investigation integration and selection tests: **52 passed** before the
  full run. They cover self-contained arrangement, disclosure bounds, provider
  reporting, identity normalization, usage finalization and the actual worker
  closing-window path.
- `git diff --check`: passed after removing one trailing blank line.
- Relative file links and heading targets checked for the promoted decision,
  constraints, decision index, affected architecture and conventions: no failures.

Two initial integration assertions expected pagination to change Projection IDs.
They were updated to require shared Projection IDs and distinct View IDs, matching
explicitly approved identity separation. An initial differential fixture built
result properties in a different order from production; the fixture was corrected
before checking exact JSON order. No implementation change was needed for that
fixture issue.

## Full output and observation comparisons

[Investigation comparison](2026-10-06-investigation-comparison.json): **486 cases**
(384 investigation Views, 102 associated mechanical inspections), each comparing
all View fields, exact rendering, binding call populations/order, actual source
disclosure and complete observation contents. Cases include JSON/Unicode,
source on/off, session/command lifetime, reuse, missing/ambiguous/unsupported
selections, limit stops, provider unavailability, subjectless usage, bounded trees,
revision and association pages, unknown/empty pages, corrections, incoming
inconsistencies, accumulating history and reversed request order. Two account IDs
collide at the initial compact-reference prefix. Valid association continuations
are exercised as well as invalid literals.

Only the explicitly permitted top-level Projection/View IDs are substituted for
comparison. Three real TypeScript provider captures independently establish that
the complete captured values differ only in their method registry, that the new
input ID follows the unchanged formula, and that session methods have precisely
the expected changes. Paired fixtures then use those captured values as their
support basis, explicitly substituting only the corresponding qualification input
reference. Observation-envelope random IDs are matched by their record/event
roles; record values, rendering, qualification and source disclosure are retained.
No unexplained differences remain. This is synthetic investigation-history
coverage with real provider input captures, not a hosted-model comparison.

[Mechanical comparison](2026-10-06-integrated-mechanical-comparison.json): **632
Views** across ten real-compiler fixtures (152 module, 216 organization, 264
dependency), with 708 View-ID substitutions including embedded module Views.
Every field, exact JSON serialization, complete-case Unicode, binding schedule and
source classification matched. Thirty incomplete organization Unicode cases
matched the explicitly permitted wording. Synthetic partial placement includes
successfully listed modules. Focused tests additionally cover incomplete artifact
support with complete placement, zero selected groups, and self-contained
classification from the existing View fields.

[Revision delivery comparison](2026-10-06-revision-comparison.json) was repeated
against the final build: **875 exact results** over 175 accounts and 58 corrections,
with pages 1, 2, 3, 4 and 9. All structured fields and serialized order matched,
including conflicts, reconsideration, whole-evaluation exemptions and omissions.
No normalization is applied to revision results.

## Reproduction and limits

Build the mechanical baseline and investigation baseline above plus the integrated
review target in separate directories using the repository's pinned dependencies.
Then, from the target checkout, run:

```sh
node scripts/compare-view-construction.mjs MECHANICAL_BASE_BUILD TARGET_BUILD MECHANICAL_REPORT.json
node scripts/compare-investigation-construction.mjs INVESTIGATION_BASE_BUILD TARGET_BUILD INVESTIGATION_REPORT.json
node scripts/compare-investigation-revisions.mjs INVESTIGATION_BASE_BUILD TARGET_BUILD REVISION_REPORT.json
```

The scripts take compiled output roots containing `src/lib`, not source roots.
They are task-specific verification tools, not a general normalization framework.

These are implementation-agent checks. Independent final review remains required.
The eager complete-content strategy and dense-history snapshot cost were approved;
no performance or memory characterization is claimed. No GUI was implemented or
exercised. Its future Presentations are covered by the accepted boundary and actual
source-disclosure obligation. Lazy materialization or presentation pushdown through
Evaluation/core construction remains permitted by the governing scope.

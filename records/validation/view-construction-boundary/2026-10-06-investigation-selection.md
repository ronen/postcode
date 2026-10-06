# Retained investigation selection checkpoint verification

Date: 2026-10-06
Task: [Separate qualified view construction from presentation shaping](../../tasks/2026-10-05-view-construction-boundary.md)
Baseline: `5591775af0737d90911fb247d2007e75db1ab59c`
Environment: Node.js 22.13.1; repository-pinned TypeScript 6.0.3.

## Implemented boundary

The new investigation-selection Projection family retains request, historical
inspection and associated mechanical inspection variants. It includes semantic
selection/status, evaluation or inline unavailable outcome, ordered original-to-
selected relations, displaced accounts, navigation, full associations and unpaged
revision snapshots. Identity includes the retained payload except its own ID,
normalizing only declared reference positions. Attempt reporting, reuse, usage,
presentation parameters and absolute acceptance ranks are absent.

The store validates same-session and kind references atomically, along with
selection/graph consistency, correction-row parties and inconsistency attribution.
It rejects paged revision values. Identical reinsertion preserves the owned object.
Validation of an old record uses its fixed references, not newly accumulated
history. The evaluation index continues to contain evaluations only.

Core resolution supplies immutable, cloneable account/correction/provenance data,
complete supporting contexts and captured inputs, source records, evidence exposure
pairs, module naming support and a typed reference population. It uses fixed
record retrieval only. The binding capability validates the entire requested
batch against that population before invoking the session allocator; construction
and capability creation do not preallocate spellings.

The live CLI and investigator-context paths now use the full revision derivation
through a separate adapter that preserves their existing page and proximal-citation
bounds. Their builders otherwise retain the old implementation at this checkpoint.
The new selection constructors, resolver and binding port are tested independently;
they are not yet wired into request execution. No new public View schema, method
metadata, source-disclosure behavior or View identity formula is introduced here.

## Checks and results

- `npm run check`: passed on the final implementation.
- Focused build and investigation-selection, investigation-revisions,
  investigation-integration and record-store tests: 66 passed, zero failed.
- After the final validation refinements, the complete `npm test` run passed:
  **484 tests, zero failures, zero skipped**, in approximately 155 seconds. It
  included the final source and tests. Local callback listeners required loopback
  access; no hosted inference credentials were used.
- The final focused selection/revision run passed 15 tests. The subsequent full
  run above also includes those cases.
- `git diff --check`: passed.

The new tests exercise accepted, limited, failed, unavailable, missing, ambiguous
and unsupported request selections; exact and missing historical inspection;
zero/nonzero associated selection; embedded module versus mixed organization
bases; repeated insertion and missing-to-bound identity; old reconstruction after
later corrections, associations and inconsistencies; transitive causes and
whole-evaluation exemptions; competing branches and later descendants; irrelevant
additions that shift absolute ranks; full content beyond 256 accounts, 24 revision
rows, eight proximal citations, 24 associations and 400 prose characters; deep
displaced corrections; full evidence/provenance support; and atomic binding-port
rejection with colliding spellings. Reconstruction tests supply a store whose
enumeration, lookup, mutation and allocation operations throw.

## Differential revision delivery

[The committed comparison result](2026-10-06-revision-comparison.json) records
875 comparisons over 175 accounts and 58 corrections, using pages 1, 2, 3, 4 and 9.
The fixture includes conflicting branches, dense transitive citation graphs,
whole-evaluation exemptions, incoming inconsistencies and empty pages. Every
structured field and the exact JSON serialization matched the baseline bounded
derivation, including field order, omissions and qualification. No differences
were normalized away.

Reproduce using compiled trees for the baseline above and the review target:

```sh
node scripts/compare-investigation-revisions.mjs BEFORE_BUILD AFTER_BUILD REPORT.json
```

The script imports only the two revision implementations and the new page adapter;
it does not access a real repository, run inference or modify those builds.

## Scope and remaining verification

These are implementation-agent checks, not independent review. They establish
the core checkpoint and compatibility of the live revision adapter, not completion
of the full construction-boundary task. CLI traversal over the new content,
displayed-subset qualification/exposure/source filtering, exact binding call
schedule, association continuation identity, worker usage finalization, usage-only
reporting and complete output/observation comparisons remain for the integration
stage. Proposal promotion and final integrated review also remain outstanding.
The task remains active.

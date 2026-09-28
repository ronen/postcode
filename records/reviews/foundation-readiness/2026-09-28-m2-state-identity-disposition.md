Record type: disposition
Date: 2026-09-28
Task: [Foundation readiness](../../tasks/2026-09-27-foundation-readiness.md)
Handoff: [M2 state/identity](2026-09-27-m2-state-identity-handoff.md)
Findings: [Round 1](2026-09-27-m2-state-identity-round-1-findings.md)

# Foundation readiness M2 state/identity review: disposition

## Findings and dispositions

### F1 — selector identity collision: accepted and corrected

The resolved internal reference and the literal normalized spelling occupied the
same string value space. All three projection families now encode the resolved
selector as `{ reference: identityReference(...) }`, while literal selectors stay
strings. The change affects the identity key only: stored request parameters,
selection semantics and published view fields retain their existing representation.
The object and string cannot have the same canonical serialization.

The regression uses the real provider: discover a file module, add an ambient
module named by the file reference's normalized spelling, then open a new session
and select both modules in each projection family. Both selections succeed with
different projection IDs and the expected subjects. Children and parents are
covered separately. The fixture changes occur between sessions, never by refreshing
an active session's evidence.

The responsible methods advance from `projection@8` to `@9` (module and organization
projections) and `dependency-projection@2` to `@3`. The central record serializer and
`identityReference` algorithm do not change, so `program-records@19` remains.
Method-list attribution changes captured input identities as usual. Ordinary
name/handle queries are compared against the prior M2 build with only these two
version constants aligned; internal-ID identity changes are intentional and tested
separately. This does not claim equality between unmodified method versions.

### F2 — positive reference-selector coverage: accepted and corrected

Five cross-session controls exercise module inspection, organization inspection by
module and by group, and dependency children and parents. Each verifies successful
selection by internal ID and by compact reference, retained request spelling, and
equal projection digest suffixes across independently opened sessions. This
assertion directly detects loss of internal-reference normalization without
normalizing arbitrary selector text in the shared comparator.

The session comparison command set also adds compact-reference `inspect`,
`children` and `parents`, with explicit source detail in both JSON and Unicode.
Each spelling is resolved from an inventory produced by its own session, and each
result must select exactly one subject. The command set now has 24 requests per
fixture, including six reference requests. Fresh direct, accumulating worker,
reversed and retained-repeat paths remain compared in full.

### Non-defect observations

| Reviewer observation | Disposition |
| --- | --- |
| Composition classification may mean any component or primary producer | Requires human direction. The reviewer identifies a future qualification-suppression ambiguity. Asked whether to retain any-token classification or restrict it to the primary producer; recommended primary producer to preserve derived limitations. No policy resolution is inferred from passing current fixtures. |
| Ordinary identity equivalence and proportionate method versions | Accepted. Existing reference spelling remains; F1 adds a distinct representation only at resolved-selector positions and advances the responsible projection methods. No new domain codes or view fields. |
| Identity-caller inventory is accurate; selector is the mixed position | Accepted. Documented the disjoint object/string representation for mixed identity positions in implementation conventions. No other caller transformation is needed for the reviewed inventory. |
| Other reference-normalization mutation coverage is good | Accepted. Retained those controls and added mutations targeting F1 and each of the three previously uncovered projection families. |
| Ownership, atomicity and index work as claimed | Accepted. Retained the implementation and its existing tests; no correction requested. |
| Validation precedes pure-derivation reuse | Accepted. Retained basis validation and deterministic lookup without changing outcome-state policy. |
| Historical support is read from the store; provider result cache assumes one store per session | Accepted as reported, including the stated pre-existing assumption. No broader provider/store-lifetime claim or cache redesign is introduced. |
| Freezing provider results is safe | Accepted. Retained owned-result freezing; no compiler objects are added to the frozen boundary. |
| Comparison policy fails closed | Accepted. No broader selector-field normalization is added to make the new tests pass. Compact request spellings compare literally; direct tests check internal-ID digest invariance explicitly. |
| Idle Ctrl-C test detects the defect | Accepted. Retained the authorized correction and dumb/xterm coverage. |

The review's verification limitations are retained: it did not independently
re-measure query operation counts or deeply review the helper consolidation, and
its native scope was macOS/Node 22.13.1. This correction does not claim to expand
that independent coverage. M3 ownership/publication and later packages remain
outside this review assignment and are still required by the active task.

## Corrections and verification

Correction commit: `f63d3d35ffbcaa120b38945c8ace93a8cab2d08d`.

- `npm run check`: passed.
- `npm test`: 254 passed, no failures/skips/cancellations.
- Focused identity suite: all ten tests pass.
- Updated the independent-process version-attribution test to mutate the current
  declared projection version. Its original hard-coded `@8` assertion failed after
  the intentional version bump; the assertion and version-change check remain.
- Controlled mutations in a disposable compiled copy: reverting tagged selector
  encoding reproduces `Immutable record collision`; using the raw selector in each
  projection family's identity independently fails its positive cross-session test.
  All four mutations are detected. The live source/build is never mutated by these
  controls. See [mutation results](../../validation/foundation-readiness/m2-round-1-mutation-results.json).
- 72 version-aligned before/after CLI comparisons pass, including generated scale;
  [report](../../validation/foundation-readiness/m2-round-1-analysis-comparison.json).
  All 288 session comparisons pass across four fixtures, including 72 comparisons
  from the added compact-reference requests;
  [report](../../validation/foundation-readiness/m2-round-1-session-comparison.json).
  The before/after report preserves compiled-source SHA-256 fingerprints; build
  identity was checked before and after comparison. Temporary configuration paths
  and build paths are replaced by fixture/checkpoint labels in the durable report.
  Result hashes and comparisons are unchanged.

Reproduce from the correction checkout with `npm run check`, `npm test` and
`node scripts/compare-session-requests.mjs REPORT`. For the before/after check,
build the original M2 target separately, align only the two projection method
constants in a disposable copy, then run
`node scripts/compare-analysis.mjs BEFORE_BUILD AFTER_BUILD REPORT`.

The original validation record and round-1 findings remain historical evidence of
the original target; neither has been rewritten to describe these corrections.

## Review rounds

Round 1 reviewed `0037eaff2d7dcd17fdb9186bed8511011f1eb9b6`, with findings committed
as `1bab0c1`. The corrections belong to the original M2 handoff; no new assignment
or edited handoff is required. A lightweight second review should check the tagged
selector encoding, version assessment, collision and positive controls, and expanded
comparison requests against the exact correction target above.

## Gate conclusion

The human has not declared the M2 gate sufficient. Further review of the corrections
is required, as recommended in round 1, and the composition-policy uncertainty still
requires human direction. No findings have been rejected or materially qualified.
The task remains active and M3–M5 work has not resumed.

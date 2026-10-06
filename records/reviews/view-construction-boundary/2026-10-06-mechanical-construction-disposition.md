Record type: disposition

# Mechanical construction and arrangement checkpoint: disposition

Date: 2026-10-06
Task: [Separate qualified view construction from presentation shaping](../../tasks/2026-10-05-view-construction-boundary.md)
Handoff: [Mechanical construction and arrangement checkpoint](2026-10-05-mechanical-construction-handoff.md)
Findings: [Round 1](2026-10-05-mechanical-construction-round-1-findings.md)
Correction target: `89f338a80fb96444f122253544cf5fc244d170d2`
Status: F1, F3 and F4 corrected; F2 awaits human direction

## Findings and dispositions

### F1 — Explicit classification state and reasons

**Accepted and corrected.** A bare `summary.complete` did not express the accepted
three-way distinction without requiring consumers to interpret adjacent fields.
Core summaries now carry `classification.state` as `complete`, `incomplete` or
`not-requested`, and `classification.reasons` identifies incomplete repository
and/or placement support. Full outcome qualification remains attached through
the summary's basis. Unrequested detail has its own state and no incomplete
classification reasons, even when the evaluation basis is incomplete.

The public View schema, numeric counts, qualification metadata and presentation
method remain unchanged. The compatibility predicate for rendering derives from
the same core classification function using the existing View fields. Tests cover
each failing applicability, availability, execution and materialization condition,
both incomplete bases together, unrequested detail with complete and incomplete
bases, and resolved summaries from partial-placement and partial-artifact fixtures.

### F2 — Redundant closing predicate and implicit zero-group policy

**Accepted clarity issue; requires human direction before correction.** The two
conjuncts are redundant for selected groups, and the zero-selected-group case
currently takes the evaluation-level result. The reviewer identifies an implicit
choice between that conservative behavior and wording tied only to an actual
selected artifact classification. The human's disposition instructions require
consultation before proceeding through unresolved uncertainty.

The implementing agent asked whether to preserve the current incomplete closing
notice when repository or placement is incomplete, including a missing selector
or unavailable layout, or restrict that notice to an incomplete selected group.
The recommendation is to preserve current behavior, simplify the predicate and
comment the zero-group rule, as the reviewer suggested. No answer has yet been
received. Neither that recommendation nor the alternative has been adopted, and
the closing predicate and wording are unchanged by this correction.

The new unavailable-repository regression test checks retained qualification,
opening materialization notices, source classification and self-contained
rendering. It deliberately leaves the pending closing-policy choice unasserted.

### F3 — Unused store-reading composition helper

**Accepted and corrected.** Removed `prepareCompositionViews` and the store import
from the composition presentation module. Its sole test caller now resolves
composition content and calls `compositionView` directly. The existing assertions
still verify linear preparation reads, no further store reads during arrangement,
parallel claims and evaluation ordering. No production caller needed migration.

### F4 — Organization architecture description

**Accepted and corrected now.** The organization section now distinguishes core
resolution, reference coordination, arrangement and rendering. It describes
summaries tied to their evaluation basis, explicit classification states and
reasons, completeness-dependent artifact wording, and preservation of the public
View fields. It links to the CLI reference's explanation of `unanalyzed`. This
was a descriptive correction within the authorized task; it was not deferred to
promotion and does not adopt a new architectural constraint.

## Non-defect observations

All six observations are accepted in the terms reported by the reviewer.

1. **Full-suite verification gap:** the reviewer's independent 473/473 run at
   `d98b454` closes the prior checkpoint's final-containment verification gap.
   This disposition preserves that attribution; it does not rewrite the earlier
   implementation-agent verification record.
2. **Unavailable repository regression coverage:** acted on. A permanent test now
   covers a repository tree and a missing inspection outside Git. Captured
   repository and placement unavailability remain explicit, core content remains
   immutable, transferred content arranges correctly, the opening notices remain,
   and rendering works after JSON serialization without source disclosure.
3. **Origin-module support beyond selected modules:** accepted as support for a
   selected export, not additional selection or source disclosure. No change.
4. **Eager construction cost:** accepted as a non-defect consistent with the
   approved strategy. The reviewer's single-repository timing evidence is retained
   in the findings. No performance optimization or additional infrastructure was
   introduced in response.
5. **Louder failures for malformed records:** accepted as described. No recovery
   policy or validation behavior was changed by these corrections.
6. **Mechanical binding-sequence coverage:** accepted as adequate for this
   checkpoint. The existing comparison and tests remain; the planned restricted
   binding-port tests remain part of the later investigation work.

## Corrections and verification

Correction commit: `89f338a80fb96444f122253544cf5fc244d170d2`.

- `npm run check`: passed.
- Fresh build followed by `node --test _build/test/projection-content.test.js _build/test/processing-index.test.js _build/test/organization.test.js`:
  26 passed, zero failed.
- `scripts/compare-view-construction.mjs` against the preserved `b34e8ee` build:
  all 632 comparisons passed (152 module, 216 organization, 264 dependency).
  The result matches the [checkpoint comparison](../../validation/view-construction-boundary/2026-10-05-mechanical-comparison.json):
  708 explicitly expected View ID changes from the original `@26` baseline,
  30 approved incomplete-organization Unicode substitutions, and 632 matching
  source-disclosure classifications. Reference allocation sequences and all
  remaining structured fields are preserved. These review corrections add no
  further visible difference.
- No `prepareCompositionViews` or `summary.complete` references remain in source
  or tests. `git diff --check` passed.

A new full-suite run was not performed for these small corrections. The reviewer's
473-test run applies to the reviewed target; the checks above apply to the
correction target. No direct whole-observation or reordered-session comparison,
new performance characterization, or investigation implementation review is
claimed. The reviewer's stated residual limits remain recorded in the findings.

## Review rounds

Round 1 reviewed `d98b4541c8c3851f638c69b4983f2dc30b893456`, under the linked original
handoff, and returned no blocking or medium-severity defects. The reviewer
recommended that the mechanical boundary was sound enough to continue, with F1–F4
addressed within scope. This disposition records the corrections and the one
remaining human decision; it does not turn that recommendation into acceptance.

## Gate conclusion

**Human direction is still required for F2 and checkpoint acceptance.** The latest
human instruction authorized assessment and clear in-scope corrections, not a
choice through unresolved uncertainty or closure of the task. Investigation work
has not resumed. No finding was rejected or materially qualified. Once F2 is
resolved and verified, the human can determine whether this intermediate gate is
sufficient or another round under the original handoff is needed. Canonical
promotion, remaining investigation work and the final integrated-review gate are
still outstanding; the task remains active and must not close without explicit
approval.

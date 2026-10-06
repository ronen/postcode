Record type: disposition

# Mechanical construction and arrangement checkpoint: disposition

Date: 2026-10-06
Task: [Separate qualified view construction from presentation shaping](../../tasks/2026-10-05-view-construction-boundary.md)
Handoff: [Mechanical construction and arrangement checkpoint](2026-10-05-mechanical-construction-handoff.md)
Findings: [Round 1](2026-10-05-mechanical-construction-round-1-findings.md)
Correction target: `dc29244467627c613aac628ec2d7be7d08e6659c`
Status: F1–F4 accepted and corrected

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

**Accepted and corrected following explicit human direction.** The two conjuncts
were redundant for selected groups, and the zero-selected-group case took the
evaluation-level result. The agent asked whether to preserve that conservative
behavior or restrict the notice to an incomplete selected group. The human
approved the recommendation to preserve the existing notice; that decision is
recorded in the active task and clarified in the proposal awaiting promotion.

The closing qualification now uses the single repository/placement completeness
predicate. A short code comment states that this applies when no groups match or
layout is unavailable. The CLI reference documents the rule. This qualifies the
evaluation basis without inventing a group classification or changing public
output, counts, schema or identity.

Regression checks assert the incomplete closing notice for missing selectors with
partial placement or partial artifact support, and for both repository-tree and
inspection Views with unavailable layout. A complete-basis missing selection keeps
the existing complete-case wording. Serialized Views remain self-sufficient.

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

Correction commits:

- F1, F3, F4 and unavailable-repository coverage: `89f338a80fb96444f122253544cf5fc244d170d2`.
- F2's authorized proposal clarification: `354f204`.
- F2 implementation, documentation and regression checks: `dc29244467627c613aac628ec2d7be7d08e6659c`.

The following checks passed after the F2 correction as well as after the initial
F1/F3/F4 correction:

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
human-approved F2 decision; it does not turn the reviewer recommendation into acceptance.

## Gate conclusion

**All findings are corrected; checkpoint acceptance remains a human decision.**
The human explicitly resolved F2, and there is no remaining uncertainty or rejected
finding in this disposition. These low-severity corrections were verified locally;
no additional independent review round is requested by the implementing agent.
The reviewer's recommendation that the boundary is sound enough to continue
remains recorded separately from human acceptance of the checkpoint.

The approval received selected F2's wording rule. It is not recorded here as a
separate decision to accept the overall checkpoint or close the task. Investigation
work has not resumed. The human can accept this checkpoint or request another
round under the original handoff. Canonical promotion, remaining investigation
work and the final integrated-review gate are still outstanding; the task remains
active and must not close without explicit approval.

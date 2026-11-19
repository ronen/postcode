# Structured architectural accounts final integrated review: disposition

Record type: disposition
Date: 2026-11-19
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Handoff: [Final integrated review](2026-11-19-m4-integrated-handoff.md)
Findings: [Round 1, Claude](2026-11-19-m4-integrated-round-1-findings.md)
Corrected target: `feabbb5d4fef990b0fa9a3c4ca83dd2a802bfdb9`
Gate status: further human-arranged review pending

## Findings and dispositions

**F1 — accepted and corrected.** The README and hosted-investigation guide now describe current designation/association selection, standing alternatives, immutable contribution inspection with newly captured standing/change context, and exact historical answer presentation. Revision pages describe captured change grounds, qualification groups and inconsistency reports. Hosted guidance distinguishes failed-attempt reporting from answer meaning. Earlier live assessments are explicitly historical evidence for the former representation; the README links the separate M2 common-contribution trials. No new live evidence is claimed.

**F2 — accepted and corrected.** The CLI reference's transitional instruction to remove the notice at completion is replaced by the delivered command scope. State behavior, diagram requests and retained follow-up-option invocation are application API routes, without corresponding CLI commands. Subject navigation is described as exact immutable contribution selection with newly captured standing/change context. The text now records that the legacy path has been removed while final review remains pending.

**F3 — accepted and corrected.** Removed `retainedPresentation`, `planPresentation` and `compatiblePresentation`. The first two had no production callers; the last was used only by a test. Removing `retainedPresentation` also left `settlePresentation` with test-only callers, so that duplicate was retired too. Remaining compatibility/precondition tests now use the production application's `consumptionPlan`, `freshFacts` and `settleConsumption`, with CLI definitions translated by the actual `applicationPresentation` adapter. The selected-subject test includes a population refusal control. The orphan-based exports refusal assertion is removed; the existing direct and CLI exact-compatibility tests exercise the executor's refusal and retained-answer reporting. Partial/unavailable exact support continues to be resolved through `application/retained.ts`. The [retirement inventory](../../validation/structured-architectural-accounts/m4-retirement-coverage.md) now identifies those distinct coverage paths accurately. No production execution or compatibility behavior changes.

**F4 — accepted and corrected.** The delegation/documentation dialog test collects the exact set of full records received over all its tool exchanges and compares it with `production.evidence`. It separately collects evaluation summaries, establishes that at least one dependency-evaluation summary was not delivered in full, and checks that summary-only records are absent from full-record evidence. Baseline common identification exposure cannot satisfy these assertions.

**F5 — accepted and corrected.** Two catalog regressions supply legacy `interpretation` requirements under the built-in `summarize` id and a new id. Both the direct application catalog and CLI catalog reject them, and CLI Session opening rejects them before project acquisition. These tests exercise the existing runtime guard without changing catalog behavior.

All corrections are in `feabbb5`. They are within the existing approved scope and review workflow. The original handoff and returned findings remain unchanged.

## Corrections and verification

Implementing-agent verification of the corrected target:

- `npm run check` and `npm run build` passed.
- **69/69 focused offline tests passed**, with zero failures, cancellations or skips, on macOS Node 22.13.1 at concurrency 2 in 19.82 seconds. Files: `evidence-access`, `exports-lens`, `lens-extensions`, `presentation-compatibility`, `projection-content`, and `application-exact-compatibility`. These cover the changed assertions and the production direct/CLI/worker paths they depend on.
- `git diff --check` passed. No source, test or current documentation references the removed helpers. Changed Markdown file links resolve.
- Compiled-source SHA-256 is `38adcf9153c80a852ff42cf15dfd9f1082440ab9a5f040625dcd600b4ce35ace`, reproduced with the existing `buildIdentity("_build")` function in `scripts/comparison-fixtures.mjs`. A trailing-whitespace cleanup after the focused run did not change that compiled-source digest.

An initial type check caught a test passing client presentation definitions directly to the application catalog; the regression now supplies only its Lens and operation definitions, matching the boundary being tested. The corrected type check, build and all focused tests passed. No product behavior was changed to satisfy a test.

The full suite and representative memory workload were not repeated for these documentation/test corrections and removal of unused helpers. Their prior results remain attributed to `fdd670e` in the [integrated checkpoint](../../validation/structured-architectural-accounts/m4-integrated-checkpoint.md) and [memory comparison](../../validation/structured-architectural-accounts/m4-memory-comparison.md). Ownership, retention, answer identity, exposure and lifetime implementation are unchanged. No additional live inference was authorized or performed.

## Review rounds

Round 1 reviewed `fdd670e619087ee5d45654153f99b99f13be65d4`, reproduced the type check, build and source digest, and ran 716 tests on Linux: 715 passed and one filesystem-specific case skipped. It found no behavioral, identity, exposure, ownership or lifetime defect, but required documentation retirement corrections and identified the cleanup/coverage improvements above. Its limited inspection of earlier milestone semantics and its un-reproduced memory measurement remain as reported in the preserved findings.

The human requested corrections before arranging rereview or further complete reviews. The original final integrated-review assignment remains applicable. Review `2fa4071..feabbb5` for the correction delta; use the original baseline `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1..feabbb5d4fef990b0fa9a3c4ca83dd2a802bfdb9` for a complete review. Subsequent findings should identify their actual scope and exact target under the existing handoff.

## Gate conclusion

All five round 1 findings are accepted, corrected and locally verified. Independent rereview/further full review and human sufficiency judgment remain pending. The task stays active and the PR stays draft. No task closure, merge or further inference is inferred.

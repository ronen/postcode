# Structured architectural accounts final integrated review: disposition

Record type: disposition
Date: 2026-11-19
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Handoff: [Final integrated review](2026-11-19-m4-integrated-handoff.md)
Findings: [Round 1](2026-11-19-m4-integrated-round-1-findings.md), [round 2](2026-11-19-m4-integrated-round-2-findings.md), [round 3, full branch](2026-11-19-m4-integrated-round-3-claude-findings.md)
Corrected target: `d724192871ab15510630e8a52374db8e313b21db`
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

## Round 2 and full-branch round 3

[Round 2](2026-11-19-m4-integrated-round-2-findings.md), committed at `7ff17bc`, reviewed `feabbb5` against all five round 1 findings and found them resolved, with no new findings. Its Linux run passed 717 of 718 tests with one filesystem-specific skip and reproduced the corrected build digest. The round 1 limitations on full-mechanism re-derivation still applied.

[Round 3](2026-11-19-m4-integrated-round-3-claude-findings.md), committed at `2963c35`, reviewed the complete branch through `feabbb5` and independently traced atomic acceptance, cause derivation, dispatch versus acquisition, reuse/fresh outcomes and immutable ownership. It reported no defect in those mechanisms. On macOS Node 22.13.1 it obtained 718 passing tests in aggregate: the full run passed 692 but lost one test file at module load because the reviewer's separate probe compilation rewrote the build during execution; that file then passed 26/26 in isolation. It reproduced the source digest. This is not treated as one uninterrupted 718-pass run. Mechanical providers, hosted transport and CLI rendering were spot-read, and representative memory was not remeasured.

### Round 3 findings and dispositions

**F1 — accepted and corrected in `b8b1b6d`.** Mixed diagram availability now has a neutral notice. Its fulfillment clause is derived only from the retained alternatives' actual unmet requirements when a result contract applies. Lack of a drawable diagram alone cannot imply failure of an unrequested diagram contract. Three regressions cover no contract, an unmet diagram contract and a fulfilled designated-answer contract that does not require diagrams. They also check that arrangement leaves retained content unchanged. The CLI artifact method advances to `postcode/contribution-presentation@4`; answer selection, fulfillment assessment and answer identity are unchanged by this presentation correction.

**F2 — accepted and corrected in `b8b1b6d`.** The architecture overview now describes designated content, independently captured standing/change context and application-coordinated bindings, with no retired binding-only port or revision-snapshot mechanism. The capability reference describes module and selected-content investigations, including application invocation of retained follow-up options, and exact historical state.

**F3 — accepted; human direction recorded; corrected in `d724192871ab15510630e8a52374db8e313b21db`.** The finding identified a real gap between retained `InvocationRequest.context` and actual dialog inputs. The human chose delivery using the existing acquisition, bounds and exposure rules; task follow-up `0e32c08` preserves that direction before implementation. The dialog now acquires explicit context after the initial subjects using their same production acquisition function. Entity identification, exact content/component, designation and whole-contribution context keep their existing qualification and capture rules; scope-only entries receive an explicit unavailable response. Request context remains separately identified in the immutable dialog input, including component selectors, and the existing hosted codec translates its addresses consistently with delivered content. Option metadata remains its own separate delivery.

Response limits can withhold individual context entries; the total character guard and interruption/dispatch checkpoint retain their existing behavior. Context addresses alone do not establish content exposure. Tests exercise actual option invocation through the application API, reuse and exact history after close; direct option-context acquisition across all supported subject kinds; oversized omission and a pre-dispatch guard with zero exposure; and hosted handle round-trip. The hosted option-authoring schema is unchanged. No new CLI command or broader context authoring interface is introduced. The dialog method advances to `postcode/contribution-dialog@12` because its initial inputs and guidance change. This version participates in operation identity and compatible-work reuse; these are intentionally new method-qualified attempts, not a claim that older attempts consumed the added context.

### Verification of the combined corrections

Implementing-agent verification of `d724192871ab15510630e8a52374db8e313b21db`:

- Type check and build passed.
- F1/F2 focused verification: 42/42 passed on a fixed build, zero failures/skips/cancellations, in 34.23 seconds. Files: `contribution-answers`, `contribution-application`, `contribution-results`, `application-exact-compatibility`, `m3-agentic-cutover`, `method-provenance`. An earlier 42-pass run began before build completion had been confirmed, so it was repeated with the build fixed; the fixed-build result is the evidence used here.
- F3 focused verification: 33/33 passed, zero failures/skips/cancellations, in 38.25 seconds. Files: `contribution-dialog`, `contribution-application`, `contribution-hosted`.
- Full offline suite, macOS Node 22.13.1, `node --test --test-concurrency=2 _build/test/*.test.js`: **725/725 passed**, zero failures, skips or cancellations, in 449.38 seconds. Local loopback and native credential-lock access were enabled; no inference was performed.
- Compiled-source SHA-256: `190e2c60866149a95aa65ea39a0f8f87791b0a0aef16d14cfbe14fd1c33a944b`; the digest remained fixed through the full suite. Reproduce with the existing `buildIdentity("_build")` function. No build or tracked checkout mutation occurred during that run.
- `git diff --check` and changed documentation link checks passed. Initial type checks caught missing context arrays in internal connection/test fixtures and incorrect use of the acceptance result in the new tests; these were corrected before runtime verification. No product behavior was weakened to satisfy a test.

Representative memory was not rerun: the ownership/retention representation is unchanged, and the earlier measurements remain attributed to their original targets. Explicit context now intentionally records the additional information actually dispatched. The dialog method bump changes agentic method-qualified identity, so this record does not claim unchanged answer identities against the earlier memory run. No additional live inference was authorized or performed; changed guidance has offline evidence only.

### Other observations and current gate

Round 3's non-defect observations remain limitations rather than new scope: change notices are capped at 24 per exchange without advertising a pending count, with undelivered changes correctly remaining causes; supported callers validate selected subjects before the lower-level plain-Error paths; and native batches use provider-derived local keys within the shared pool namespace. No additional policy, namespace redesign or notice interface is introduced.

All actionable findings from rounds 1–3 are now corrected. The full-branch review strengthens the evidence for the core mechanism, but it did not review these latest corrections. Appropriate rereview remains warranted, particularly for F3's newly delivered input and dispatch accounting. The original final integrated handoff still applies: correction delta `2963c35..d724192871ab15510630e8a52374db8e313b21db`, or full scope `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1..d724192871ab15510630e8a52374db8e313b21db`. Human review-sufficiency determination remains pending. The task remains active and the PR draft; no closure, merge or further inference is inferred.

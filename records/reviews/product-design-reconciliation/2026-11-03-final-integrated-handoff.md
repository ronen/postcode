Record type: handoff

# Product-design reconciliation: final integrated review

Prepared: 2026-11-03
Task: [Implement product-design reconciliation](../../tasks/2026-11-03-product-design-reconciliation.md)
Review gate: final integrated review before task closure
Review target: `ccc8ba35ee0fbef77136e7594dd1dc9876beefcd`
Baseline: `87706fa887c68a461be7fab3c6b9a0b809fa9a3f`
Diff range: `87706fa887c68a461be7fab3c6b9a0b809fa9a3f..ccc8ba35ee0fbef77136e7594dd1dc9876beefcd`
Branch: `codex/product-design-reconciliation-implementation`
Worktree: `../app-worktrees/product-design-reconciliation-implementation` relative to the primary checkout
Pull request: [ronen/postcode#12](https://github.com/ronen/postcode/pull/12)

## Review assignment and boundaries

Independently review the integrated implementation, tests, interface documentation and retained output evidence against the approved plan. Inspect the actual code and samples; this handoff and the implementing agent's passing checks are not proof of correctness. Recommend whether the final review gate is satisfied, identifying actionable defects and residual verification limits. The human arranges the reviewer and mechanism.

Do not change implementation, governing material, task status or the active task record. With repository write access, commit only the findings record described below. The implementation target excludes this handoff's own subsequent commit.

## Governing context

- [Approved plan](../../../docs/plans/product-design-reconciliation.md), especially human-output conformance, feedback, observations and minimum verification.
- [Human-facing architectural representations](../../../docs/decisions/human-facing-architectural-representations.md) and [structured investigram content](../../../docs/decisions/structured-investigram-content.md).
- [Application specification](../../../docs/app-specification.md), [core concepts](../../../docs/core-concepts.md), [architectural constraints](../../../docs/architectural-constraints.md) and [adopted foundation](../../../foundation/README.md).
- [Qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md), [observation recording](../../../docs/decisions/initial-observation-recording-decisions.md), [local observation acceptance](../../../docs/decisions/local-observation-acceptance.md).
- [Independent review workflow](../../../dev/review.md) and [task protocol](../../../dev/task-protocol.md).

## Result under review

`--more-details` replaces the rejected `--source-detail` flag. Human detail retains names, paths/ranges, request specifiers, resolution data and attribution while omitting captured source excerpts. Core analysis and investigator source access remain intact. Diagnostic and dependency/composition qualifications explain meaning and limitations; original diagnostic messages and locations remain available. Documentation retains plain-text blocks and useful reference assertions, including repaired `@see` capture; unsupported blocks/examples disclose representation limits.

Shell feedback embeds the last actually displayed View or resolution report and exact output, with no lookup, rerender, analysis or refreshed selection. Feedback and usage do not replace the snapshot. One-shot feedback requires no project or investigator and uses context-free invocation correlation and a discoverable local destination. Sink failures remain visible and subsequent shell use continues.

Observation format 4 separates detail requests, actual attribution disclosure, explicit representation limits and subjective inadequacy reports. Explicit nonconforming excerpt payloads are classified according to what each renderer exposes. Diagnostic paths outside detail fields and non-View resolution reports are included. Report guidance is finalized into the artifact before JSON rendering, keeping observations and feedback consistent with output.

No foundation, process, notes, application-specification or governing-architecture files were changed. Structured accounts, account selection, accumulated-understanding UX, persistence, cross-state correspondence and agent protocols remain outside scope. Existing captured-basis and navigation-lineage gaps are disclosed rather than reconstructed. Parser/project-opening failures preserve their existing pre-Session no-batch behavior.

## Verification already performed

The implementing agent rebuilt after a host reboot and completed `npm run build`, `npm run check`, `git diff --check`, and the entire regression suite using `node --test --test-concurrency=2 _build/test/*.test.js`: **617 passed, zero failed/skipped/cancelled**, approximately 359.5 seconds. The earlier interrupted final run was not counted as a pass. Archived JSON was reparsed and fixture hashes rechecked after recovery. See the [verification summary](../../validation/product-design-reconciliation/verification.txt).

The required real-investigator journey completed `summarize`, `explain`, `decompose` and `examine`, producing 18 accepted accounts through ChatGPT plan authorization with `gpt-5.6-sol`, medium reasoning. All three run outcomes are preserved, including initial credential unavailability and expired-authorization failure. The [assessment](../../validation/product-design-reconciliation/assessment.md) identifies the fixture/basis, actual instructions, provider/model, each account's prose/referent/qualification assessment, and the stage of implementation sampled. Raw JSON, rendered text and usage reports are adjacent. No natural structured correction/inconsistency arose; controlled inputs cover handling of those fields and explicitly do not establish generation quality.

## Review focus and reproduction

1. Check that excerpt removal preserves useful non-source information across module, organization, dependency, investigation, embedded and internal-export Views, in text/JSON and fresh/exact retained presentation. Confirm no new evidence acquisition, interpretation or selection enters presentation.
2. Assess audience intelligibility without weakening qualifications or inventing properties. Review diagnostic codes/messages, dependency recognition/basis labels, composition scope, documentation omissions, request failures and the four real generated samples. Inspect both main prose and less prominent referent, association, correction and inconsistency fields.
3. Inspect feedback snapshot ownership and self-contained delivery, including newer undisplayed corrections, repeated feedback, missing context, omitted explanation, sink rejection and context-free operation without project/investigator startup.
4. Check actual-exposure classification beyond explicit detail fields, including diagnostic paths and non-View output. Distinguish acquisition, attribution, source display, additional-detail access, recognized representation limits and subjective feedback. Assess the retained pre-Session no-batch boundary against the adopted scope.
5. Verify report-artifact/output agreement, experimental version changes, method attribution, documentation accuracy, preserved exact selection and source access. The broader context-attribution gaps must not be claimed resolved.

For deterministic reproduction, install locked dependencies if needed, run `npm run build`, `npm run check`, then the full two-worker command above. Keep the checkout unchanged while tests run: some tests validate captured repository inputs. Loopback callback-server tests require permission to bind local ports. Focused tests include `human-output`, `feedback`, `source-disclosure`, `investigation-integration`, `retained-presentation`, `request-model` and `work-attribution`. Read the retained real-run evidence before deciding whether any additional generation is necessary; the harness and isolated-fixture procedure are documented in the assessment.

## Findings return

Use the [findings template](../../../dev/templates/review-findings.md). With repository write access, create `records/reviews/product-design-reconciliation/YYYY-MM-DD-final-integrated-round-1-findings.md`, identify this handoff and the exact target/scope actually reviewed, preserve the report under `## Returned findings`, and commit only that file. For later rounds, increment the round and identify the prior findings, prior target and correction target. Modify nothing else. Without repository write access, return findings to the human for preservation through the review workflow.

## Review gate

The task remains active. The implementing agent stops after committing and publishing this handoff for the human to arrange review. Resolve material findings and obtain further review when needed. Neither a clean report nor this draft PR authorizes task closure or merge: the human must confirm that independent review is sufficient first.

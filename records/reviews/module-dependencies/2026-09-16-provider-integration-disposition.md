Record type: disposition

# Module dependency provider integration: disposition

Date: 2026-09-16
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Handoff: [Provider integration](2026-09-16-provider-integration-handoff.md)
Findings: [Round 1](2026-09-16-provider-integration-round-1-findings.md)
Status: actionable finding corrected; human direction pending on additional multi-file verification and the intermediate gate

## Findings and dispositions

### 1. Duplicate diagnostics in aggregated relationship contexts — accepted and corrected

The reviewer correctly identified multiplication of file-wide diagnostics when
several occurrences in one file support a relationship. The new regression
reproduced the defect before the correction: one actual diagnostic appeared
twice on a relationship supported by two imports.

Relationship contexts now select diagnostics once from the captured compiler
diagnostic list using the union of the supporting occurrences' source files.
This uses the reviewer's suggested recomputation approach. It avoids multiplying
a diagnostic by the number of supporting requests, without collapsing distinct
diagnostic events that share a code and category. The regression covers both one
and two same-code errors at distinct positions in the source file; a diagnostic
in an unrelated file must not enter the relationship context. Occurrence contexts
and successful evaluation qualification remain intact.

The dependency analysis method is bumped from `postcode/typescript-dependencies@1`
to `@2` because materialized relationship qualification changes. There is no
change to request recognition, ownership, target resolution, edge population,
mechanisms, or whole-edge type-only semantics.

Correction: `74237567c35b5eac492aceb18b41192559dece03`.

## Non-defect observations and residual limits

The review's observations are accepted and recorded: recognizer fidelity to the
approved ordered contract; independently checked occurrence/coverage test counts;
target-resolution and ownership boundaries; aggregation and type-only semantics;
pre-snapshot compiler work and language-boundary ordering; store validation;
reproduced PostCode numerical results; and the explicit dependency-request
boundary. These do not call for additional implementation changes.

The reviewer did not rerun the adapted ts-node checkout validation. Its assessment
of that artifact remains a consistency check of retained results, distinct from
independent live verification. Existing implementing-agent validation remains
attributed as such; this correction does not claim to close that review gap.

The reviewer explicitly left the multi-file diagnostic variant unverified. The
human has been asked whether to construct a focused regression for that variant,
as required by the instruction to ask before proceeding through reviewer-identified
uncertainty. That work has not begun pending an answer. The same-file correction
is established independently; no multi-file test result is claimed.

The review did not exhaustively recreate every contract-table row with new
fixtures, instead comparing implementation and existing characterization tests.
That verification boundary is retained. Graph/SCC, focused projections,
composition, organization classification, discovery-facet renaming, CLI,
presentation, navigation, and observation work remain outside this checkpoint's
review and still required by the active plan.

No finding is rejected or materially qualified. The sole actionable finding is
corrected; the explicitly unverified multi-file extension awaits human direction.

## Corrections and verification

- `npm run build` followed by the focused regression reproduced the pre-fix
  failure (two diagnostic entries instead of one).
- After correction, `npm run check` passed.
- `npm test` rebuilt the project and passed **169/169 tests**, including **18
  production-provider tests** and the prior **22 compiler characterization tests**.
- `git diff --check` passed.
- The original handoff, findings, and retained repository outputs are unchanged.
  Those outputs describe the earlier target and method; snapshot identities change
  with the corrected method version.

## Review rounds

Round 1 reviewed `688bf45180dd20f8193aadf181d57d555c81e38b` over baseline
`3e5d8987f6ed43bc661a81926f3e7857b8ba98d4`. The reviewer recommends retaining the
checkpoint as the basis for continued implementation with the diagnostic defect
corrected. The correction target is
`74237567c35b5eac492aceb18b41192559dece03`, under the same handoff and baseline;
no new handoff is required for this narrowly scoped correction.

## Gate conclusion

The human has not yet declared the provider-integration gate sufficient.
The reviewer's favorable recommendation is not human acceptance. Direction on
multi-file verification is also pending. Downstream implementation remains paused;
the task remains active and still requires final integrated review and explicit
human authorization to close.

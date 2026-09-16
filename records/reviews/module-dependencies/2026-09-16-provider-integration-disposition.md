Record type: disposition

# Module dependency provider integration: disposition

Date: 2026-09-16
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Handoff: [Provider integration](2026-09-16-provider-integration-handoff.md)
Findings: [Round 1](2026-09-16-provider-integration-round-1-findings.md)
Status: complete; human accepted the provider-integration gate on 2026-09-16

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
human subsequently authorized a focused regression. It establishes one merged
named module across two declaration files, with two requests in one file and one
in the other, all supporting the same relationship. Each file has one distinct
syntax diagnostic with the same code/category. The relationship retains exactly
two diagnostics, each occurrence retains its one file-local diagnostic, and an
unrelated file's diagnostic is excluded. The existing correction passes without
further production changes. This closes that specific verification gap through
implementing-agent testing, not an additional independent review.

The review did not exhaustively recreate every contract-table row with new
fixtures, instead comparing implementation and existing characterization tests.
That verification boundary is retained. Graph/SCC, focused projections,
composition, organization classification, discovery-facet renaming, CLI,
presentation, navigation, and observation work remain outside this checkpoint's
review and still required by the active plan.

No finding is rejected or materially qualified. The sole actionable finding is
corrected; the authorized multi-file extension is verified.

## Corrections and verification

- `npm run build` followed by the focused regression reproduced the pre-fix
  failure (two diagnostic entries instead of one).
- After correction, `npm run check` passed.
- `npm test` rebuilt the project and passed **169/169 tests**, including **18
  production-provider tests** and the prior **22 compiler characterization tests**.
- The authorized multi-file test passed independently, followed by `npm run check`
  and a full `npm test` run passing **170/170 tests**, including **19 production
  provider tests**. Regression commit: `ef6c8962a94554e8611ec4cb615b1bdcf2d3f53f`.
- `git diff --check` passed.
- The original handoff, findings, and retained repository outputs are unchanged.
  Those outputs describe the earlier target and method; snapshot identities change
  with the corrected method version.

## Review rounds

Round 1 reviewed `688bf45180dd20f8193aadf181d57d555c81e38b` over baseline
`3e5d8987f6ed43bc661a81926f3e7857b8ba98d4`. The reviewer recommends retaining the
checkpoint as the basis for continued implementation with the diagnostic defect
corrected. The production correction is
`74237567c35b5eac492aceb18b41192559dece03`; the latest target including authorized
multi-file verification is `ef6c8962a94554e8611ec4cb615b1bdcf2d3f53f`, under the same handoff and baseline;
no new handoff is required for this narrowly scoped correction.

## Gate conclusion

The human accepted the provider-integration gate after the correction and
authorized multi-file verification on 2026-09-16: "yes, resume implementation".
The task follow-up records that authorization. Downstream implementation may
resume. The task remains active and still requires final integrated review and
explicit human authorization to close.

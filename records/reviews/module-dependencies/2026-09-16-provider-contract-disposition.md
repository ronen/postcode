Record type: disposition

# Module dependency provider contract: disposition

Date: 2026-09-16
Task: [Implement module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Handoff: [Provider contract](2026-09-16-provider-contract-handoff.md)
Findings: [Round 1](2026-09-16-provider-contract-round-1-findings.md)
Status: findings assessed; clear corrections complete; human direction required

## Findings and dispositions

### 1. CommonJS format/declaration precedence — accepted gap; requires human direction

The original disjunction does not settle classic CommonJS or mixed NodeNext
recognition. No recognizer has been implemented from that proposal. The human
explicitly authorized further investigation and a proposed rule before
implementation. The new classic/mixed fixtures confirm the reviewer-reported
facts, using actual Node variable declarations rather than only a simplified
ambient function. A further test distinguishes ambient callable, noncallable,
missing, and global implementation bindings.

The [investigation and ordered proposal](../../validation/module-dependencies/2026-09-16-commonjs-review-investigation.md)
give per-file format precedence, use explicit configured CommonJS only when the
per-file signal is absent, and additionally require an unshadowed global callable
binding whose contributing declarations are ambient/declaration-only. An ambient
declaration alone cannot override ESM. Missing evidence must remain a disclosed
coverage limitation, not a false empty dependency result.

This proposal has not been accepted or encoded as recognition behavior. It is a
consequential resolution of the identified uncertainty and requires human
approval under the follow-up instructions. After agreement, outcome tests and
production integration remain necessary, followed by review under the original
handoff. The finding is not rejected or treated as resolved by raw-fact tests.

### 2. Default import plus all-type named imports — accepted and corrected

Added `import Def, { type Shape as DefaultShape } from './target.js'` to the
fixture and a real default export to its target. Assertions now establish the
non-type-only clause, default binding, and all-type named elements together.
Updated literal occurrence counts and the evidence record. This directly
supplies the missing compiler-shape coverage; production aggregation must still
preserve the default-binding guard. No claim of runtime use is introduced.

Correction: `0a5f58a4bdb3359ce0e22d7b0663a69c6ec73901`.

### 3. ts-node population-boundary risk — accepted; compiler hypothesis confirmed

Initially corrected the record to attribute the reviewer's configuration
inspection precisely and make per-target population evidence an explicit final
validation requirement. The subsequently authorized checkout investigation
confirmed that the two cited targets, `src/child/child-loader.ts` and `src/esm.ts`,
are selected roots, present in the compiler Program, and satisfy the supported
source-module predicate. Neither needs population expansion in this environment.
The [retained evidence](../../validation/module-dependencies/2026-09-16-ts-node-compiler-evidence.json)
records each occurrence, target, membership, and conditions.

This is compiler-level confirmation, not final product validation: unchanged
PostCode opening fails on obsolete configuration options, and the checkout used
PostCode's enclosing TypeScript/Node typings without installing ts-node's complete
dependency set. Some other resolved targets are outside the supported population.
Those limits are recorded rather than generalized away. Final validation still
must preserve the two target-specific outcomes and other request qualifications.

No discovery expansion or validation-revision choice has been made. Human
resolution is required for the newly observed configuration incompatibility,
as described below; the population finding itself is accepted.

Corrections/evidence: `0a5f58a4bdb3359ce0e22d7b0663a69c6ec73901` and
`0ccd04221d1d24e57830d656e02f823617e78cf2`.

### 4. Nested-namespace occurrence ownership — accepted and corrected

The test now starts at the actual import-type node inside `Nested`, walks outward
through enclosing module declarations, and asserts that the first symbol in the
ambient population is `named`. It checks the visited sequence and separately
asserts that the owner differs from the request's resolved target `target`.
This adds the requested ownership evidence without claiming that the future
production walk or unresolved augmentation cases are already verified.

Correction: `0a5f58a4bdb3359ce0e22d7b0663a69c6ec73901`.

## Non-defect observations and residual limits

- The original fixture counts were accurate. Counts affected by the added default
  import are now six import declarations and sixteen matching literal requests;
  unchanged call-shape counts remain covered.
- The Node variable-declaration observation is now explicitly reproduced by the
  classic and mixed fixtures using pinned `@types/node` 22.20.2. No structural
  signature is treated as proof of runtime loader availability.
- Production identity, records, and evaluation are unchanged. There is no
  production method-version change at this checkpoint.
- The composition and merged-ambient evidence is retained; the complete focused
  suite still passes.
- Wildcard ambient targets, mode attributes, production capture/output-exclusion
  behavior, external/unresolved augmentation ownership, full dependency analysis,
  graph/presentation/organization behavior, and instrument validation remain
  unverified as the review states. Nothing here treats the review recommendation
  as authorizing advancement through those uncertainties.

## Additional observations requiring human direction

1. **Validation configuration:** the unchanged surveyed revision fails operational
   opening under TypeScript 6.0.3 with diagnostics 5107 and 5102. Proposed next
   step: use a separately recorded configuration at the same revision, removing
   `importsNotUsedAsValues` and adding `ignoreDeprecations: "6.0"`, verify identical
   source selection, and retain the original failure. A later compatible revision
   with equivalent cases is an alternative allowed by the plan. No option has
   been selected or applied.
2. **Survey qualification:** both cited internal require calls have adjacent
   `typeof import(...)` occurrences resolving to the same targets. Proposed
   correction: retain every approved CommonJS requirement, but qualify the survey's
   description of these pairs as otherwise undiscoverable. Their distinct CommonJS
   occurrences still matter for mechanism and mixed type-only qualification;
   nonliteral requests remain separately important. No governing plan or decision
   has been rewritten, and this observation is not used to narrow scope.

These observations arose during the authorized investigation. They are distinct
from rejecting or materially qualifying a returned finding; any consequential
response still awaits the human's direction.

## Corrections and verification

- `0a5f58a4bdb3359ce0e22d7b0663a69c6ec73901`: clear evidence corrections for findings
  2 and 4, and precise reviewer attribution/final-validation requirement for 3.
  Type check, build, and 13 focused tests passed.
- `0ccd04221d1d24e57830d656e02f823617e78cf2`: authorized CommonJS context and ts-node
  investigation, three further characterization tests, manual reproducible probe,
  retained evidence, and a recognition proposal awaiting approval.
- `npm run check`: passed for the expanded contextual tests. `npm test` subsequently
  rebuilt all sources including the manual probe and passed all 145 tests (16
  compiler-contract tests).
- `git diff --check`: passed before the investigation commit.
- Actual unchanged ts-node operational opening: failed as explicitly recorded;
  the compiler probe does not convert it into a successful product investigation.

The reviewer findings and original handoff remain unchanged. No finding was
rejected. No production recognition outcome, plan revision, or population change
was implemented.

## Review rounds

Round 1 reviewed `12a5e76bd0c6211bf70ffb0c097085f7bd2e66b9` over baseline
`8dac095574bc7dd40ab105d2ce1fe5524c1cf647`. Returned findings are preserved in the
linked round-1 record. No round 2 has occurred. A future round should use the same
handoff and identify the exact new target after human direction and any resulting
corrections; no replacement handoff is needed for this assignment.

## Gate conclusion

The human has authorized disposition, clear in-scope corrections, and investigation
followed by a proposed rule. The human has **not** determined that the intermediate
review gate is sufficient. Direction is required on the recognition proposal,
validation setup, and survey qualification. Production integration remains paused.
The task remains active; final integrated review and human authorization to close
remain separately required.

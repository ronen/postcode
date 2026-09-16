Record type: disposition

# Module dependency provider contract: disposition

Date: 2026-09-16
Task: [Implement module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Handoff: [Provider contract](2026-09-16-provider-contract-handoff.md)
Findings: [Round 1](2026-09-16-provider-contract-round-1-findings.md), [Round 2](2026-09-16-provider-contract-round-2-findings.md)
Status: authorized corrections and investigation complete; final ordered contract returned for approval

## Findings and dispositions

### 1. CommonJS format/declaration precedence — accepted gap; requires human direction

The original disjunction does not settle classic CommonJS or mixed NodeNext
recognition. No recognizer has been implemented from that proposal. The human
explicitly authorized further investigation and a proposed rule before
implementation. The new classic/mixed fixtures confirm the reviewer-reported
facts, using actual Node variable declarations rather than only a simplified
ambient function. A further test distinguishes ambient callable, noncallable,
missing, and global implementation bindings.

The initial proposal required ambient declarations universally. Subsequent human
feedback and explicit authorization removed that prerequisite, required precise
lexical completion, and authorized bounded preserve characterization. The
[final ordered contract](../../validation/module-dependencies/2026-09-16-final-recognition-contract.md)
now specifies the public compiler lookup protocol, format precedence, separate
binding/coverage outcomes, and conditional preserve support. Six additional tests
characterize missing declarations, JavaScript synthetic symbols, nesting and
lexical bindings, parse recovery, with scope, and preserve declaration conflicts.

The complete contract is returned for approval, not implemented as a production
recognizer. No unresolved uncertainty is silently treated as acceptance. In
particular, the recommendation for preserve is affirmative mixed-mode context
plus callable ambient corroboration when no per-file format is available; it is
an explicit result of the authorized investigation, awaiting approval alongside
the complete outcome table. Finding 1's evidence work is complete; its integration
gate still requires human direction and any requested further review.

Correction/evidence: `be4897e66de57c16caf869d2da9bec829a8ef8ec`.

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

The human subsequently authorized a minimally adapted configuration at the same
revision. Validation now retains the original opening failure and exact
configuration edits, proves identical selection of all 66 roots, and exercises
existing production module discovery successfully. Its 202-module result includes
both targets as project modules. All declared dependencies were installed with
lifecycle scripts disabled; the retained evidence discloses npm range resolution
rather than historical Yarn-lock reproduction. This completes the population and
opening setup checks, not future dependency instrument validation.

Corrections/evidence: `0a5f58a4bdb3359ce0e22d7b0663a69c6ec73901`,
`0ccd04221d1d24e57830d656e02f823617e78cf2`, and
`be4897e66de57c16caf869d2da9bec829a8ef8ec`.

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

## Additional observations and authorized resolutions

1. **Validation configuration — authorized and exercised.** The original pinned
   ts-node configuration remains untouched and fails with diagnostics 5107 and
   5102. The separately named adapted configuration removes only
   `importsNotUsedAsValues` and adds `ignoreDeprecations: "6.0"`. The complete root
   arrays are identical. Successful production opening/discovery and their limits
   are in the [final report](../../validation/module-dependencies/2026-09-16-final-recognition-contract.md#adapted-ts-node-validation).
2. **Survey qualification — authorized and recorded by supersession.** The human
   explicitly directed a new decision, not rewriting the earlier decision body.
   [Bounded CommonJS source evidence](../../../docs/decisions/bounded-commonjs-source-evidence-decision.md)
   supersedes only the headed CommonJS decision in the original bundle. Required
   lifecycle metadata supplies both forward and backward mappings. Its original
   rationale remains intact; a byte comparison verified the body unchanged. The
   current plan cites the corrected rationale while preserving every approved
   mechanism, qualification, and nonliteral-result requirement.

These resolutions do not reject any reviewer finding or authorize scope expansion.

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

- `be4897e66de57c16caf869d2da9bec829a8ef8ec`: authorized final lexical/preserve
  characterization, exact adapted configuration and production-discovery evidence,
  corrected rationale through a superseding decision, and complete ordered
  recognition proposal. `npm run check` passed; `npm test` passed all 151 tests,
  including 22 compiler-contract cases. Diff checks, local links, and preservation
  of the previous decision body were verified.

The reviewer findings and original handoff remain unchanged. No finding was
rejected. The human-authorized plan correction and decision supersession are
recorded; no production recognizer or population change was implemented.

## Round-2 findings and dispositions

### 1. Non-ambient global variable implementation — accepted and corrected

Added the exact `var require = (name) => name;` case to the global-binding
matrix. Assertions establish one call signature, a non-ambient modifier result,
and `VariableDeclaration` kind. Declaration kinds are now asserted throughout
that matrix, explicitly pinning the same-kind distinction from an ambient variable.

### 2. Named callable annotations — accepted and corrected

Added both a named callable interface and a named callable type alias to the
per-declaration annotation matrix. Each must have a `TypeReference` annotation
and resolve to one call signature through `getTypeFromTypeNode`. This pins both
forms already described by the contract without changing its rule.

### Non-defect observations — recorded

Accepted the requested coverage disclosure: the outcome table now explicitly
names unset `compilerOptions.module` plus absent per-file format, including
legacy pre-ES6 effective CommonJS defaults, as insufficient context. The fallback
still requires explicit CommonJS; this documents existing under-recognition.

The reviewer also reports that its mixed function-implementation/ambient-variable
probe produced TS2300 and separate symbols rather than a merged symbol. This is
recorded as reviewer-observed evidence for that particular shape, not an
independently repeated check or a general guarantee about invalid programs.
It requires no contract change.

Round 2 confirms all four round-1 findings are substantively addressed. No
finding is rejected, deferred, or materially qualified. The review's residual
limits remain: wildcard ambient targets, import-type resolution-mode attributes,
captured-host/output-exclusion integration, external/unresolved augmentation
ownership, and production dependency behavior still require later planned work.
The reviewer checked the adapted ts-node inputs but did not repeat its installed
checkout validation; the existing implementing-agent evidence remains separately
attributed. None of these disclosures is treated as newly verified by this round.

## Review rounds

Round 1 reviewed `12a5e76bd0c6211bf70ffb0c097085f7bd2e66b9`; round 2 reviewed
`be4897e66de57c16caf869d2da9bec829a8ef8ec`. Both use the original handoff and
baseline `8dac095574bc7dd40ab105d2ce1fe5524c1cf647`. Returned findings remain
unchanged in their linked records. Round 2 found no new correctness defect and
recommended the checkpoint for human approval after optional coverage additions.

The round-2 correction commit is `1816656b587a7ef7c2be45660b6ae2b6d8078d44`. Verification: `npm run check` passed; `npm test` rebuilt the project and passed all 151 tests; `git diff --check` passed.
The two matrices expanded within the existing 22 compiler-contract tests.

## Gate conclusion

All round-2 corrections are complete. The ordered recognition rule is unchanged;
only supporting compiler cases and an explicit existing coverage boundary were
added. The human has not yet approved the complete ordered recognition contract
or declared the intermediate gate sufficient. Any further round can use the
same handoff and original baseline with the correction commit as its exact target.
No replacement handoff is needed for these additive corrections.

Production recognizer integration remains paused pending the human's gate
decision. The task remains active, with final integrated review and human
authorization to close separately required.

Record type: handoff

# Module dependency provider contract review

Prepared: 2026-09-16
Task: [Implement module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Review gate: intermediate compiler evidence and proposed provider contract
Review target: `12a5e76bd0c6211bf70ffb0c097085f7bd2e66b9`
Baseline: `8dac095574bc7dd40ab105d2ce1fe5524c1cf647`
Diff range: `8dac095574bc7dd40ab105d2ce1fe5524c1cf647..12a5e76bd0c6211bf70ffb0c097085f7bd2e66b9`
Branch: `codex/module-dependencies`

## Review assignment and boundaries

Independently review the compiler characterization and proposed provider contract
before production records, graph semantics, and presentations depend on them.
The human authorized intermediate review where it materially reduces risk. The
observed mismatch between require target resolution and supported Program
membership makes this such a checkpoint.

Read the tests, fixtures, and relevant existing integration, and reproduce or
challenge the evidence. Neither this handoff nor the implementing agent's passing
tests establish correctness. Assess whether the proposed contract can satisfy the
approved plan without silently narrowing request mechanisms or broadening module
population. Recommend whether production integration may proceed, needs specific
corrections or additional characterization, or requires human direction on a
consequential choice.

This is a characterization checkpoint, not a completed dependency implementation.
The proposed rules are review inputs, not newly accepted architecture decisions.
Do not modify implementation, governing material, task status, or the task record.
Repository write access authorizes only the findings record described below.

## Governing context

- [Approved plan](../../../docs/plans/module-dependencies-plan.md), especially
  the supported TypeScript contract, CommonJS scope evidence, population, and
  implementation revision conditions.
- [Module dependency decisions](../../../docs/decisions/module-dependency-structure-decisions.md).
- [Composition decision](../../../docs/decisions/module-composition-property-decision.md).
- [Organization integration decisions](../../../docs/decisions/dependency-organization-integration-decisions.md).
- [Subject-kind expansion decision](../../../docs/decisions/subject-kind-standard-expansion-decision.md).
- [Existing module discovery contract](../../../docs/decisions/initial-module-inventory-decisions.md).
- [Core concepts](../../../docs/core-concepts.md) and
  [architectural constraints](../../../docs/architectural-constraints.md).
- [Engineering guidelines](../../../dev/engineering-guidelines.md),
  [implementation conventions](../../../docs/implementation-conventions.md), and
  [independent review workflow](../../../dev/review.md).

## Result under review

The [characterization record](../../validation/module-dependencies/2026-09-16-typescript-contract.md)
records public compiler behavior and a proposed provider interpretation. The
[tests](../../../test/dependency-contract.test.ts) and
[fixture](../../../fixtures/dependency-contract/README.md) establish:

- request syntax and explicit type information without runtime claims;
- direct re-export target identity distinct from ultimate export provenance;
- TypeScript/JavaScript differences in require literal symbol lookup;
- explicit resolution, conditional package modes, and a resolved target absent
  from the configured Program;
- global versus lexical require bindings, including hoisting, temporal-dead-zone
  bindings, imported aliases, module-local ambient declarations, and missing
  declaration evidence;
- merged ambient declaration ownership, nested namespaces, and augmentation
  symbol identity;
- the positive composition syntax rule and parse-diagnostic qualification.

No production source has changed. No identity-method bump is needed for these
characterization tests because they do not change application analysis semantics.
A version bump remains necessary when the provider is integrated.

## Verification already performed

Implementing-agent checks on Node.js 22.13.1 with pinned TypeScript 6.0.3:

- `npm run check`: passed.
- `npm test`: passed, 142 tests including 13 new characterization tests.
- `git diff --check`: passed before the checkpoint commit.

An initial diagnostics test called `getText` before the default-host node had a
parent and failed. The test now passes the explicit source file; the complete
suite passed after that correction. No input programs were executed.

These checks have not verified the future dependency provider, the production
captured-input path for additional resolution, the surveyed ts-node repository,
or product usefulness. They are not independent-review evidence.

## Review focus and reproduction

Run the focused checks from the repository root:

```sh
npm run check
npm run build
node --test _build/test/dependency-contract.test.js
```

Run `npm test` for the existing-slice regression suite. Inspect the pinned public
compiler declarations as needed; avoid relying on private compiler fields. Read
`src/lib/typescript/project.ts` and `src/lib/typescript/inputs.ts` to evaluate how
the proposed operations will fit the actual capture and discovery boundaries.

Prioritize these questions:

1. Is the proposed affirmative CommonJS context sufficiently conservative and
   useful? In particular, distinguish a compiler-established CommonJS format,
   a callable ambient global declaration, a user-defined global implementation,
   a missing symbol, and a locally shadowed require. Identify missing adversarial
   cases before those distinctions become production claims.
2. Does the proposed resolved-outside-supported-population outcome accurately
   preserve evidence within the accepted population boundary? What must be
   established in ts-node to retain its surveyed internal relationships without
   silently extending discovery or mislabelling resolved requests as unresolved?
3. Does the ownership approach avoid assigning augmentation or nested-namespace
   requests to the wrong source-file or ambient-module subject, while retaining
   occurrence-specific declaration evidence for organization placement?
4. Are the type-only and composition proposals faithful to the accepted rules,
   including mixed/default imports, empty named lists, direct empty-list
   re-exports, and `typeof import`? Do the tests overstate any compiler guarantee?
5. What additional coverage is necessary before production integration, as
   distinct from later record, graph, and presentation tests? The characterization
   record lists unresolved wildcard ambient, mode-attribute, captured-host,
   output-exclusion, diagnostics, and real-repository checks explicitly.

## Work remaining

After this gate, implementation still needs dependency occurrence and relationship
records and validation, versioned captured analysis, evaluation distinctions,
graph roots and SCCs, focused lenses, composition and organization expansions,
discovery-facet renaming, conceptual views and bounds, exact navigation, source
escape, observations, full semantic tests, implemented-behavior documentation,
and instrument validation. The PostCode/unfamiliar-repository and surveyed
CommonJS journeys, clean evaluator exercise, latency measurement, and final
integrated handoff remain mandatory. This review cannot satisfy the final gate.

## Findings return

Use the review name `provider-contract`. First-round filename:

`records/reviews/module-dependencies/2026-09-16-provider-contract-round-1-findings.md`

For subsequent rounds use the corresponding date and incremented round, optionally
including the reviewer name before `-findings.md`. Keep rounds under this handoff
unless the assignment changes materially.

If you have repository write access, follow
[the findings template](../../../dev/templates/review-findings.md), begin with
`Record type: findings`, identify yourself, this handoff, the round, exact target
and scope actually reviewed, method, performed verification, actionable findings,
non-defect observations, unverified areas, and gate recommendation. Preserve your
report under `## Returned findings`. Commit only that findings record and modify
nothing else. If you cannot write, return the complete findings to the human for
preservation by the implementing agent. A review recommendation does not authorize
scope changes or task closure.

## Review gate

The implementing agent pauses after committing this handoff for the human to
arrange independent review. Resume against returned review evidence and human
direction; investigate and correct in-scope findings using the review workflow.
Obtain further review where material corrections invalidate the earlier analysis.
Only the human determines whether this checkpoint is sufficient to proceed. The
task remains active, and the final integrated-review gate remains separately
required before the human can authorize closure.

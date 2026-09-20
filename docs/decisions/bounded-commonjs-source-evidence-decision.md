# Bounded CommonJS source evidence

Status: accepted
Decided: 2026-09-16
Arising from: [Module dependencies task](../../records/tasks/2026-09-16-module-dependencies.md) and its authorized provider-contract investigation
Scope: bounded CommonJS-form request evidence, declaration availability, and corrected rationale within the module dependency slice
Supersedes: [Include bounded CommonJS-form requests without loader claims](module-dependency-structure-decisions.md#include-bounded-commonjs-form-requests-without-loader-claims)

## Context

The original bundled decision required bounded CommonJS recognition, partly on a
survey claim that excluding these occurrences would hide two otherwise
undiscoverable internal module relationships in ts-node. The
[revision-specific investigation](../../records/validation/module-dependencies/2026-09-16-commonjs-review-investigation.md)
established adjacent `typeof import(...)` occurrences for both pairs. Import-type
requests are already supported by the approved plan. Those pairs therefore do not
establish unique-edge recovery attributable only to CommonJS recognition.

The investigation also proposed making a callable ambient global declaration a
mandatory prerequisite. Subsequent human discussion accepted that this would make
source-form recognition unnecessarily depend on installed type declarations even
when CommonJS context and completed lexical analysis already support the claim.

The human authorized correcting the rationale through a new superseding decision,
revising that declaration requirement, and completing the bounded compiler
characterization. This decision replaces only the headed CommonJS decision in
the earlier bundle. All other decisions in that record remain accepted. It does
not accept an as-yet-unreviewed full compiler recognition algorithm or settle
`module: preserve` by assumption.

## Decision

Retain the approved bounded CommonJS mechanism: a bare `require` call with exactly
one argument, owned by an established module, with captured context affirmatively
supporting a CommonJS-form source request. Calls through aliases or properties,
wrong-arity calls, `require.resolve`, and other CommonJS APIs remain outside this
mechanism.

Recognition requires completed lexical analysis establishing no local binding.
Missing global declaration evidence is distinct from unavailable or failed
shadowing analysis. When CommonJS context and completed lexical analysis supply
the necessary evidence, the absence of an ambient global declaration does not
veto recognition. Where a declaration exists, retain it as evidence; do not
ignore an established alternative binding, a source implementation named require,
or conflicting binding evidence merely because the configured context supports
CommonJS. Incomplete required evidence must remain an explicit outcome.

The provider must characterize its exact context, lexical-analysis completion,
binding-evidence, and unsupported-mode boundaries before integration. Preserve
established alternative binding, established unsupported format, insufficient
context, conflicting evidence, and recognized request as distinct outcomes.
The complete ordered recognition contract and `module: preserve` outcome remain
subject to the task's review and approval gate.

Preserve literal and nonliteral target status. Resolve literal targets through
the configured TypeScript environment, and create a relationship only when it
establishes a target in the supported population. Retain unresolved literals and
target-indeterminate nonliteral requests without fabricated edges or expression
constant evaluation. Successful file resolution outside the supported population
must not be mislabeled unresolved or used to expand discovery silently.

Recognition establishes source-request evidence only. It establishes neither a
runtime loader nor loading, execution, emitted output, value use, bundler
retention, or deployment behavior. CommonJS occurrences participate in the same
aggregation, type-only qualification, organization, external-boundary, source
escape, identity, and observation rules as the other supported occurrences.
Dependency views disclose the bounded coverage and material unavailable evidence.

## Rationale

CommonJS remains required even when another mechanism establishes the same ordered
module pair. Its occurrences preserve additional request mechanisms and evidence;
a pair supported by both an import-type occurrence and an unmarked require
occurrence must not appear wholly type-only. Nonliteral requests remain useful
qualified results without graph edges. Literal requests can also establish
external boundary children or other qualified resolution outcomes.

The surveyed ts-node source demonstrates the two overlapping internal pairs and
three nonliteral expressions. Other surveyed literals remain subject to their
configured resolution evidence; their spelling alone does not establish package,
platform, or runtime identity. Final validation must establish their supported
outcomes rather than repeat the survey's original unique-edge explanation.

Requiring installed ambient declarations in every CommonJS context would exclude
source evidence for reasons unrelated to the narrow product claim. Conversely,
missing type declarations do not excuse incomplete lexical analysis or turn an
unknown binding into an established loader. The rule must preserve both sides.

Structural distortion is assessed per configured project across relationships,
mechanisms, qualifications, and non-edge requests. Absence of this mechanism in
other repositories does not cancel the importance of supported occurrences where
they exist.

## Alternatives considered

- Remove CommonJS support because the two pairs have import-type evidence:
  rejected; this loses mechanisms, mixed whole-edge qualification, and nonliteral
  results while changing the approved scope.
- Preserve the unique-edge rationale despite contrary evidence: rejected; the
  new record corrects the premise while preserving the original as history.
- Require a callable ambient declaration for every recognized call: rejected;
  absence can be compatible with established CommonJS context and complete
  lexical evidence.
- Recognize every call spelled require: rejected; shape, ownership, context,
  binding, and analysis-completion boundaries still apply.
- Use an ambient declaration alone to infer runtime CommonJS availability:
  rejected; source declarations and loader existence are different evidence.
- Recognize literals only or count only internal edges: rejected; nonliteral
  requests, external outcomes, and occurrence qualifications are part of the
  approved investigation.

## Consequences

- The original decision's context and rationale are preserved. Its metadata maps
  this headed decision to this replacement, leaving the bundle's other choices
  in force.
- The current plan's survey summary must reflect overlapping import-type evidence
  without removing CommonJS requirements or treating manual probes as completed
  product validation.
- The provider contract must explicitly characterize JavaScript and TypeScript
  lexical lookup, missing versus conflicting declarations, classic and per-file
  formats, and `preserve` before the recognition contract is approved.
- No core-concept or architectural-constraint definition changes.

## Follow-up

Complete the authorized contextual fixtures and final ordered rule, validate with
the adapted ts-node configuration while preserving its original opening failure,
and return to the provider-contract review gate before integration. Broader
CommonJS APIs, aliases, runtime analysis, or external population expansion require
separate authorization.

# Module composition property decision

Status: in review
Decided:
Arising from: [Module dependencies plan](../plans/module-dependencies-plan.md)
Scope: the `re-exports only` module-composition property introduced with dependency analysis

## Context

Dependency evidence exposes a mechanically useful module-composition
characteristic: some modules contain only supported direct re-exports.

## Decisions

### Add a narrow `re-exports only` module property

#### Decision

Establish the positive module property presented as **re-exports only** when the
module has at least one supported direct TypeScript re-export and every substantive
top-level statement is a supported direct re-export.

Supported direct re-export syntax includes the named, wildcard, namespace, and
explicitly type-only `export ... from` forms recognized by the selected public
TypeScript syntax model. Comments and explicitly enumerated empty statements do
not prevent the claim. Imports, declarations, executable statements, export
assignments, local exports, and `export {}` prevent it.

Represent the result as an independently qualified module-property claim. Allow
presentations to use it as a facet without inserting it into the
module-discovery facet collection. Do not create inverse or adjacent module-kind
classifications.

Do not infer barrel, facade, API boundary, purity, importance, safe collapse, or
absence of transitive side effects.

#### Rationale

The property gives a human a mechanically supported reason to look elsewhere for
local implementation. It is especially useful as a compact annotation in the
repository-organization view, making that view more informative without listing
exports or inferring architectural intent.

#### Alternatives considered

- Defer the property because it does not add navigation: rejected because helping
  the human avoid unproductive investigation is direct product value.
- Call such modules barrels, facades, or API boundaries: rejected because source
  shape does not establish those purposes.
- Add a general taxonomy of module composition kinds: rejected because only this
  narrowly useful positive property has evidence and a consumer.
- Put the value in the `discoveryFacets` array: rejected because that array
  represents classifications supplied by module discovery rather than every
  qualified module property that can serve as a facet.

#### Consequences

- Dependency and organization presentations may request the property as a
  standard module-subject expansion.
- Evaluation unavailability remains distinguishable from absence of the positive
  claim.
- Exact syntax coverage must be exhaustive and versioned with the responsible
  analysis method.
